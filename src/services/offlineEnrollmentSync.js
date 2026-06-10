import { CropexHttpError } from "./cropexHttp";
import {
  draftToFarmerEnrollmentRequest,
  enrollFarmer,
  getAgentIdFromSession,
  parseEnrolledFarmerResponse,
  startEnrollmentSession,
  submitEnrollmentBiometric,
  submitEnrollmentFace,
  submitEnrollmentFingerprint,
} from "./cropexApi";

function readString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function getPayloadRoot(payload) {
  if (!payload || typeof payload !== "object") return {};
  return payload.data && typeof payload.data === "object" ? payload.data : payload;
}

function extractSessionId(response) {
  const root = getPayloadRoot(response);
  return readString(root.session_id, response?.session_id);
}

function normalizeEnrollmentDraft(record) {
  const stored = record?.enrollmentDraft;
  if (stored && typeof stored === "object") {
    return {
      personal: stored.personal && typeof stored.personal === "object" ? stored.personal : {},
      farm: stored.farm && typeof stored.farm === "object" ? stored.farm : {},
      cooperative:
        stored.cooperative && typeof stored.cooperative === "object" ? stored.cooperative : {},
      biometrics:
        stored.biometrics && typeof stored.biometrics === "object" ? stored.biometrics : {},
    };
  }
  return null;
}

export function validateOfflineEnrollmentRecord(record) {
  const draft = normalizeEnrollmentDraft(record);
  if (!draft) {
    return "This pending farmer was saved before full offline sync was supported. Register the farmer again while online or offline with the latest app version.";
  }

  const personal = draft.personal || {};
  if (!readString(personal.fullName)) return "Full name is missing from the offline registration.";
  if (!readString(personal.phone)) return "Phone number is missing from the offline registration.";
  if (!readString(personal.nin)) return "NIN is missing from the offline registration.";
  if (!readString(personal.bvn)) return "BVN is missing from the offline registration.";
  if (!readString(personal.state, personal.stateId)) return "State is missing from the offline registration.";
  if (!readString(personal.lga, personal.lgaId)) return "LGA is missing from the offline registration.";
  if (!readString(personal.address)) return "Address is missing from the offline registration.";

  const farm = draft.farm || {};
  if (!readString(farm.farmSize)) return "Farm size is missing from the offline registration.";
  if (!readString(farm.cropType)) return "Crop type is missing from the offline registration.";
  if (!readString(farm.farmLocation)) return "Farm location is missing from the offline registration.";
  if (!readString(farm.soilType)) return "Soil type is missing from the offline registration.";

  const biometrics = draft.biometrics || {};
  if (!readString(biometrics.facePhoto)) {
    return "Face photo was not saved for this offline registration. Capture biometrics again and save before syncing.";
  }

  const fingerprints = Array.isArray(biometrics.fingerprints) ? biometrics.fingerprints : [];
  const validFingerprints = fingerprints.filter(
    (entry) => readString(entry?.position) && readString(entry?.fmr_template)
  );
  if (validFingerprints.length === 0) {
    return "Fingerprint data was not saved for this offline registration. Capture biometrics again and save before syncing.";
  }

  return "";
}

async function uploadStoredFacePhoto(sessionId, facePhotoBase64) {
  const face_photo = readString(facePhotoBase64);
  if (!face_photo) {
    throw new Error("Stored face photo is missing.");
  }

  const attempts = [
    () => submitEnrollmentFace({ session_id: sessionId, face_photo }),
    () =>
      submitEnrollmentBiometric({
        session_id: sessionId,
        biometric_data: { face_captured: true, face_photo },
      }),
    () =>
      submitEnrollmentBiometric({
        session_id: sessionId,
        biometric_data: {
          face_captured: true,
          face_photo: face_photo.startsWith("data:")
            ? face_photo
            : `data:image/jpeg;base64,${face_photo}`,
        },
      }),
  ];

  let lastError = null;
  for (const attempt of attempts) {
    try {
      await attempt();
      return;
    } catch (error) {
      lastError = error;
      if (!(error instanceof CropexHttpError) || error.status < 500) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Could not upload stored face photo.");
}

async function uploadStoredFingerprints(sessionId, fingerprints) {
  for (const entry of fingerprints) {
    const finger_position = readString(entry?.position);
    const fmr_template = readString(entry?.fmr_template);
    if (!finger_position || !fmr_template) continue;
    await submitEnrollmentFingerprint({
      session_id: sessionId,
      finger_position,
      fmr_template,
    });
  }
}

function buildSuccessEntry(record, createResponse) {
  const farmer = parseEnrolledFarmerResponse(createResponse);
  const payload = record?.payload || {};
  const draft = normalizeEnrollmentDraft(record) || {};
  const personal = draft.personal || {};
  const cooperative = draft.cooperative || {};

  return {
    clientId: readString(record?.clientId, payload.client_id, farmer.client_id),
    officialFarmerId: readString(farmer.farmer_id, farmer.id),
    phone: readString(farmer.phone_number, payload.phone_number, personal.phone),
    nin: readString(farmer.nin, payload.nin, personal.nin),
    name: readString(farmer.full_name, farmer.name, personal.fullName, record?.name),
    state: readString(farmer.state_of_origin, payload.state_of_origin, personal.state),
    lga: readString(farmer.lga, farmer.local_govt_area, payload.lga, personal.lga),
    address: readString(
      farmer.residential_address,
      payload.residential_address,
      personal.address
    ),
    photo: readString(farmer.profile_photo_url, farmer.photo_url, record?.photo) || "",
    primaryCrop: readString(
      Array.isArray(farmer.primary_crops) ? farmer.primary_crops[0] : "",
      payload.crop_type,
      draft.farm?.cropType
    ),
    farmSize: readString(farmer.farm_size, payload.farm_size, draft.farm?.farmSize),
    landOwnership: readString(payload.land_ownership, draft.farm?.landOwnership),
    cooperative: readString(cooperative.name, record?.cooperative),
    gender: readString(farmer.gender, payload.gender, personal.gender),
  };
}

export async function replayOfflineEnrollment(record, agentId = "") {
  const validationError = validateOfflineEnrollmentRecord(record);
  if (validationError) {
    throw new Error(validationError);
  }

  const ownerAgentId = readString(agentId, getAgentIdFromSession(), record?.ownerAgentId);
  if (!ownerAgentId) {
    throw new Error("Agent session is missing an agent ID. Log in again and retry sync.");
  }

  const draft = normalizeEnrollmentDraft(record);
  const clientId = readString(record?.clientId, record?.payload?.client_id);
  const fingerprints = (draft.biometrics.fingerprints || []).filter(
    (entry) => readString(entry?.position) && readString(entry?.fmr_template)
  );

  const startResponse = await startEnrollmentSession({ agent_id: ownerAgentId });
  const sessionId = extractSessionId(startResponse);
  if (!sessionId) {
    throw new Error("Backend did not return an enrollment session ID.");
  }

  await uploadStoredFacePhoto(sessionId, draft.biometrics.facePhoto);
  await uploadStoredFingerprints(sessionId, fingerprints);

  const enrollmentBody = draftToFarmerEnrollmentRequest(
    {
      personal: draft.personal,
      farm: draft.farm,
      cooperative: draft.cooperative,
      biometrics: draft.biometrics,
    },
    ownerAgentId,
    { clientId }
  );
  const createResponse = await enrollFarmer(enrollmentBody);
  return buildSuccessEntry(record, createResponse);
}

import { CropexHttpError } from "./cropexHttp";

const AUTH_KEY = "hcx_agent_auth";

export function getAgentSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (!o || typeof o !== "object") return null;
    return o;
  } catch {
    return null;
  }
}

export function getAgentAccessToken() {
  const s = getAgentSession();
  return s?.accessToken || s?.access_token || null;
}

function getAgentRefreshToken() {
  const s = getAgentSession();
  return s?.refreshToken || s?.refresh_token || null;
}

/** Merge token fields from any auth payload into local session storage. */
export function mergeAgentTokensFromRefreshResponse(data) {
  const prev = getAgentSession() || {};
  const accessToken =
    data?.access_token ??
    data?.accessToken ??
    data?.token ??
    data?.data?.access_token ??
    prev.accessToken;
  const refreshToken =
    data?.refresh_token ??
    data?.refreshToken ??
    data?.data?.refresh_token ??
    prev.refreshToken;
  sessionStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      ...prev,
      accessToken: accessToken || prev.accessToken || "",
      refreshToken: refreshToken || prev.refreshToken || "",
    })
  );
}

export function getAgentIdFromSession() {
  const s = getAgentSession();
  return s?.agentId || s?.agent_id || s?.userId || s?.user_id || "";
}

/** Persist local auth/session fields from a flexible payload shape. */
export function setAgentSessionFromAuthResponse(data) {
  const accessToken =
    data?.access_token ?? data?.accessToken ?? data?.token ?? data?.data?.access_token ?? "";
  const refreshToken =
    data?.refresh_token ?? data?.refreshToken ?? data?.data?.refresh_token ?? "";
  const agentId =
    data?.agent_id ??
    data?.user?.id ??
    data?.user_id ??
    data?.id ??
    data?.data?.id ??
    "";
  const email = data?.email ?? data?.user?.email ?? "";
  sessionStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      accessToken: accessToken || "",
      refreshToken: refreshToken || "",
      agentId: agentId != null ? String(agentId) : "",
      email: email || "",
    })
  );
}

export function clearAgentSession() {
  try {
    sessionStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
}

// --- OTP ---

export function sendOtp(phone) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true, phone }), 250);
  });
}

export function verifyOtp(phone, code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (String(code || "").length === 4) {
        resolve({ verified: true, phone });
        return;
      }
      reject(new CropexHttpError("Invalid OTP code.", 400, null));
    }, 250);
  });
}

// --- Agents ---

export function agentRegister(body) {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          ...body,
          id: `AGT-${Math.floor(1000 + Math.random() * 9000)}`,
        }),
      350
    );
  });
}

export function agentLogin(body) {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          access_token: "mock-token",
          refresh_token: "mock-refresh-token",
          agent_id: "AGT-001",
          email: body?.email || "",
        }),
      300
    );
  });
}

export function agentRefresh(refreshToken) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!refreshToken) {
        reject(new CropexHttpError("Missing refresh token.", 400, null));
        return;
      }
      resolve({
        access_token: "mock-token",
        refresh_token: "mock-refresh-token",
      });
    }, 300);
  });
}

// --- Farmers (local/mock mode) ---

export function listFarmers({ page = 1, page_size = 50 } = {}) {
  void page;
  void page_size;
  return Promise.resolve({ data: [] });
}

export function getFarmerById(id) {
  return Promise.resolve({ id });
}

export function enrollFarmer(body) {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          ...body,
          id: `HSH-IB-2026-${String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6)}`,
        }),
      500
    );
  });
}

/** Unwrap single-farmer JSON (shape varies). */
export function extractFarmerRecord(payload) {
  if (payload == null || typeof payload !== "object") return payload;
  return payload.data ?? payload.farmer ?? payload.item ?? payload;
}

// --- Normalizers for flexible payload shapes ---

export function extractFarmersArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.farmers)) return payload.farmers;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

/**
 * Map API row → shape used by AgentSavedFarmers / cards.
 */
export function mapApiFarmerToUi(row) {
  if (!row || typeof row !== "object") return null;
  const id =
    row.id ??
    row.uuid ??
    row.farmer_id ??
    row.farmerId ??
    row.hsh_id ??
    String(row.phone_number || row.phone || Math.random());
  const name = row.full_name ?? row.name ?? row.fullName ?? "Farmer";
  const phone = row.phone_number ?? row.phone ?? "";
  const primaryCrop =
    (Array.isArray(row.primary_crops) && row.primary_crops[0]) ||
    row.primary_crop ||
    row.primaryCrop ||
    "—";
  const created = row.created_at ?? row.enrolled_at ?? row.reg_date ?? "";
  const regDate =
    typeof created === "string" && created.includes("T")
      ? created.slice(0, 10).split("-").reverse().join("/")
      : created || "—";
  return {
    id: String(id),
    name,
    photo:
      row.photo_url ??
      row.photo ??
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&q=80&fit=crop",
    regDate,
    status: "synced",
    primaryCrop,
    state: row.state_of_origin ?? row.state ?? "—",
    lga: row.lga ?? "—",
    phone,
    cooperative: row.cooperative_name ?? row.cooperative ?? "—",
    farmSize: row.farm_size ?? "—",
    landOwnership: row.land_ownership ?? "—",
    gender: row.gender === "M" ? "Male" : row.gender === "F" ? "Female" : row.gender ?? "—",
    dob: row.date_of_birth ?? row.dob ?? "—",
    nin: row.nin ?? "—",
    address: row.residential_address ?? row.address ?? "—",
    biometric: { face: true, fingerprint: true },
  };
}

export function formatPhoneForApi(digits) {
  const d = String(digits || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("234")) return `+${d}`;
  if (d.startsWith("0")) return `+234${d.slice(1)}`;
  return `+234${d}`;
}

export function mapGenderToFarmerApi(g) {
  if (g === "Male") return "M";
  if (g === "Female") return "F";
  return "Other";
}

export function mapYearsExperienceToInt(label) {
  const m = {
    "Less than 1 year": 0,
    "1-3 years": 2,
    "4-7 years": 5,
    "8-15 years": 10,
    "15+ years": 18,
  };
  return m[label] ?? 0;
}

/**
 * Build `farmer.EnrollmentRequest` from AgentRegisterFarmer draft.
 */
export function draftToEnrollmentPayload(draft, enrolledByAgentId) {
  const p = draft.personal || {};
  const f = draft.farm || {};
  const phone_number = formatPhoneForApi(p.phone);
  const primaryCrops =
    Array.isArray(p.primaryCrops) && p.primaryCrops.length > 0
      ? p.primaryCrops
      : f.cropType
        ? [f.cropType]
        : [];

  const body = {
    full_name: p.fullName,
    phone_number,
    nin: p.nin,
    bvn: p.bvn,
    gender: mapGenderToFarmerApi(p.gender),
    date_of_birth: p.dob,
    state_of_origin: p.state,
    lga: p.lga,
    residential_address: p.address,
    marital_status: p.maritalStatus || undefined,
    education_level: p.educationLevel || undefined,
    farming_experience: mapYearsExperienceToInt(p.yearsExperience),
    primary_crops: primaryCrops,
    secondary_crops: [],
    next_of_kin_name: p.nextKinName || undefined,
    next_of_kin_phone: p.nextKinPhone ? formatPhoneForApi(p.nextKinPhone) : undefined,
    next_of_kin_relation: p.nextKinRelationship || undefined,
  };
  if (enrolledByAgentId) {
    body.enrolled_by_agent_id = String(enrolledByAgentId);
  }
  return body;
}

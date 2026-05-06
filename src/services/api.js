import {
  getFarmerDashboard,
  getFarmerIdCard,
  sendOtp,
  setFarmerSessionFromAuthResponse,
  verifyOtp as verifyFarmerOtp,
} from "./cropexApi";

function readString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function rootObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const data = value.data;
  if (data && typeof data === "object" && !Array.isArray(data)) return data;
  return value;
}

function formatDate(value) {
  const text = readString(value);
  if (!text) return "";
  if (!text.includes("T")) return text;
  return text.slice(0, 10).split("-").reverse().join("/");
}

function mapStatusLabel(statusRaw, isActive) {
  const status = readString(statusRaw).toUpperCase();
  if (isActive === false) return "Inactive";
  if (status === "PENDING") return "Pending";
  if (status === "REJECTED" || status === "SUSPENDED" || status === "INACTIVE") return "Inactive";
  if (status === "ACTIVE" || status === "VERIFIED") return "Verified";
  return readString(statusRaw) || "Verified";
}

async function loadFarmerComposite() {
  const [dashboardPayload, idCardPayload] = await Promise.all([
    getFarmerDashboard(),
    getFarmerIdCard().catch(() => null),
  ]);

  const dashboardRoot = rootObject(dashboardPayload);
  const farmer =
    (dashboardRoot.farmer && typeof dashboardRoot.farmer === "object" ? dashboardRoot.farmer : null) ||
    dashboardRoot;
  const idCardRoot = idCardPayload ? rootObject(idCardPayload) : null;
  return { farmer, idCard: idCardRoot };
}

export const getFarmerByPhone = async (phone) => {
  const normalized = String(phone || "").replace(/\D/g, "");
  if (normalized.length < 10) throw new Error("Enter a valid phone number.");
  const response = await sendOtp(normalized);
  const root = rootObject(response);
  return {
    farmerID:
      readString(root.farmer_id, root.user?.id, root.id) || `farmer-${normalized}`,
    name: readString(root.full_name, root.name, "Farmer"),
    status: readString(root.status, "PENDING"),
  };
};

export const verifyOTP = async (phone, otp) => {
  const payload = await verifyFarmerOtp(phone, otp);
  setFarmerSessionFromAuthResponse(payload);
  const root = rootObject(payload);
  const user =
    (root.user && typeof root.user === "object" ? root.user : null) || root;
  return {
    success: true,
    token: readString(root.token, root.access_token, root.accessToken, root.tokens?.access_token),
    farmerID: readString(user.farmer_id, user.id),
  };
};

export const getFarmerProfile = async () => {
  const { farmer, idCard } = await loadFarmerComposite();
  const primaryCrop = Array.isArray(farmer.primary_crops)
    ? readString(farmer.primary_crops[0])
    : readString(farmer.primary_crop, farmer.crop_type);
  const farmLocation = readString(farmer.farm_location, farmer.residential_address);

  return {
    id: readString(farmer.farmer_id, farmer.id),
    farmerID: readString(farmer.farmer_id, farmer.id),
    name: readString(farmer.full_name, farmer.name),
    fullName: readString(farmer.full_name, farmer.name),
    phone: readString(farmer.phone_number, farmer.phone),
    dob: readString(farmer.date_of_birth),
    gender: readString(farmer.gender),
    state: readString(farmer.state_of_origin, farmer.state),
    lga: readString(farmer.lga, farmer.local_govt_area),
    address: readString(farmer.residential_address, farmer.address, farmLocation),
    primaryCrop: primaryCrop || "-",
    secondaryCrops: Array.isArray(farmer.secondary_crops) ? farmer.secondary_crops : [],
    yearsOfExperience: readString(farmer.farming_experience, 0),
    cooperative: readString(farmer.cooperative_name),
    cooperativeRegNo: readString(farmer.cooperative_reg_no),
    role: readString(farmer.membership_role),
    status: mapStatusLabel(farmer.status, farmer.is_active),
    photo:
      readString(farmer.profile_photo_url, farmer.photo_url, idCard?.profile_photo_url) ||
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&q=80&fit=crop",
    farmSize: readString(farmer.farm_size),
    landOwnershipType: readString(farmer.land_ownership),
    enrolledDate: formatDate(farmer.created_at),
    maritalStatus: readString(farmer.marital_status),
    education: readString(farmer.education_level),
    nextOfKin: {
      name: readString(farmer.next_of_kin_name),
      phone: readString(farmer.next_of_kin_phone),
      relationship: readString(farmer.next_of_kin_relation),
    },
  };
};

export const getFarmerID = async () => {
  const cardPayload = await getFarmerIdCard();
  const card = rootObject(cardPayload);
  return {
    farmerID: readString(card.farmer_id, card.id),
    name: readString(card.full_name, card.name),
    photo:
      readString(card.profile_photo_url, card.photo_url) ||
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=320&q=80&fit=crop",
    qrCodeURL:
      readString(card.qr_code_url, card.qr_code, card.qrCodeURL) ||
      "https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=Hashmar%20Farmer%20ID",
    cooperative: readString(card.cooperative_name),
    primaryCrop: readString(card.primary_crop, card.crop_type),
    expiryDate: readString(card.expiry_date, card.expires_at),
    status: mapStatusLabel(card.status, card.is_active),
  };
};

export const getNotifications = async () => {
  const payload = await getFarmerDashboard();
  const root = rootObject(payload);
  const rows = Array.isArray(root.notifications) ? root.notifications : [];
  return rows.map((row, index) => ({
    id: readString(row.id, index),
    title: readString(row.title, row.type, "Update"),
    body: readString(row.body, row.message, row.description),
    date: readString(row.created_at, row.date, new Date().toISOString()),
    read: Boolean(row.read),
    type: readString(row.type, "info").toLowerCase(),
  }));
};

export const shareIDViaWhatsApp = async (farmerID) => {
  const profileURL = `https://cropex.hashmarcropex.com/verify/${farmerID}`;
  const message = `My Hashmar CropEx Farmer ID is *${farmerID}*. Verify my profile here: ${profileURL}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};

export const shareIDViaSMS = async (farmerID) => {
  const profileURL = `https://cropex.hashmarcropex.com/verify/${farmerID}`;
  const message = `My Hashmar CropEx Farmer ID: ${farmerID}. Verify: ${profileURL}`;
  return `sms:?body=${encodeURIComponent(message)}`;
};

export const getFarmerFarms = async () => {
  const payload = await getFarmerDashboard();
  const root = rootObject(payload);
  const farmer =
    (root.farmer && typeof root.farmer === "object" ? root.farmer : null) || root;

  const farms = Array.isArray(farmer.farms) ? farmer.farms : [];
  if (farms.length > 0) {
    return farms.map((farm, index) => ({
      id: readString(farm.id, `farm-${index}`),
      name: readString(farm.name, farm.farm_name, `Farm ${index + 1}`),
      location: readString(farm.location, farm.farm_location, farmer.farm_location),
      crop: readString(farm.crop_type, farm.primary_crop, farm.crop),
      size: readString(farm.farm_size, farm.size),
      soilType: readString(farm.soil_type, farm.soil),
      conditionType: "sunny",
    }));
  }

  const hasSingleFarm = readString(farmer.farm_location, farmer.farm_size, farmer.crop_type);
  if (!hasSingleFarm) return [];
  return [
    {
      id: readString(farmer.farm_id, "farm-1"),
      name: "Primary Farm",
      location: readString(farmer.farm_location, farmer.residential_address),
      crop: readString(
        Array.isArray(farmer.primary_crops) ? farmer.primary_crops[0] : "",
        farmer.primary_crop,
        farmer.crop_type,
      ),
      size: readString(farmer.farm_size),
      soilType: readString(farmer.soil_type),
      conditionType: "sunny",
    },
  ];
};

export const getRecentActivities = async () => {
  const payload = await getFarmerDashboard();
  const root = rootObject(payload);
  const rows = Array.isArray(root.recent_activities)
    ? root.recent_activities
    : Array.isArray(root.activities)
      ? root.activities
      : [];

  return rows.map((row, index) => ({
    id: readString(row.id, `act-${index}`),
    title: readString(row.title, row.name, row.activity, "Activity"),
    type: readString(row.type, "mapping").toLowerCase(),
    acres: readString(row.acres, row.farm_size),
    date: formatDate(row.created_at || row.date || new Date().toISOString()),
  }));
};

export const getHelpContent = async () => {
  const card = await getFarmerIdCard().catch(() => ({}));
  const root = rootObject(card);
  return {
    faqs: [],
    supportContact: {
      phone: readString(root.support_phone, "+2347000000000"),
      whatsapp: readString(root.support_whatsapp, "https://wa.me/2347000000000"),
      email: readString(root.support_email, "support@hashmar.com"),
      fieldAgent: readString(root.agent_name, "Assigned agent"),
    },
  };
};

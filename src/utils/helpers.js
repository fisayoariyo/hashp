// ============================================
// HASHMAR CROPEX — SHARED UTILITIES
// ============================================

/**
 * Format a date string or Date object to a readable Nigerian format.
 * e.g. "2026-04-01" → "1st April, 2026"
 */
export function formatDate(dateStr, options = {}) {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    const defaults = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", { ...defaults, ...options });
  } catch {
    return dateStr;
  }
}

/**
 * Format a date with ordinal suffix.
 * e.g. "2026-06-21" → "21st June, 2026"
 */
export function formatDateOrdinal(dateStr) {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    const month = date.toLocaleDateString("en-GB", { month: "long" });
    const year = date.getFullYear();
    return `${day}${suffix} ${month}, ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Format ISO date to short relative label: "Today", "Yesterday", or "21 Apr"
 */
export function formatRelativeDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function getOrdinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Mask a phone number for display.
 * e.g. "08012345678" → "0801****678"
 */
export function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone;
  return `${phone.slice(0, 4)}****${phone.slice(-3)}`;
}

/**
 * Human-readable phone for OTP screens (accepts local digits or +234).
 * e.g. "8136289427" → "+234 813 628 9427"
 */
export function formatPhoneForDisplay(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";

  let national = digits;
  if (national.startsWith("234") && national.length > 10) {
    national = national.slice(3);
  } else if (national.startsWith("0")) {
    national = national.slice(1);
  }

  const parts = [];
  if (national.length > 0) parts.push(national.slice(0, 3));
  if (national.length > 3) parts.push(national.slice(3, 6));
  if (national.length > 6) parts.push(national.slice(6));

  return parts.length ? `+234 ${parts.join(" ")}` : "";
}

/**
 * Mask a farmer ID for display in low-security contexts.
 * e.g. "HSH-IB-2026-000123" → "HSH-IB-****-000123"
 */
export function maskFarmerID(id) {
  if (!id) return "—";
  const parts = id.split("-");
  if (parts.length < 4) return id;
  parts[2] = "****";
  return parts.join("-");
}

/**
 * Truncate a string to maxLength with ellipsis.
 */
export function truncate(str, maxLength = 30) {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalise(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a number as a compact Nigerian Naira amount.
 * e.g. 250000 → "₦250,000"
 */
export function formatNaira(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Map crop name to emoji.
 */
const CROP_EMOJI_MAP = {
  Maize: "🌽",
  Rice: "🌾",
  "Green Beans": "🫘",
  "Soya bean": "🫘",
  Tomato: "🍅",
  Cassava: "🌿",
  Yam: "🍠",
  Pepper: "🌶️",
  Groundnut: "🥜",
  Millet: "🌾",
  Sorghum: "🌾",
};

export function getCropEmoji(crop) {
  return CROP_EMOJI_MAP[crop] ?? "🌱";
}

/**
 * Map activity type to emoji.
 */
const ACTIVITY_EMOJI_MAP = {
  plant: "🌱",
  watering: "🪣",
  harvesting: "🌾",
  mapping: "📍",
  fertilizer: "🌿",
  spraying: "💧",
  weeding: "🌿",
};

export function getActivityEmoji(type) {
  return ACTIVITY_EMOJI_MAP[type] ?? "🌿";
}

/**
 * Build a WhatsApp share URL for a farmer ID.
 */
export function buildWhatsAppShareURL(farmerID) {
  const profileURL = `https://cropex.hashmarcropex.com/verify/${farmerID}`;
  const message = `My Hashmar CropEx Farmer ID is *${farmerID}*. Verify my profile here: ${profileURL}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Build an SMS share URL for a farmer ID.
 */
export function buildSMSShareURL(farmerID) {
  const profileURL = `https://cropex.hashmarcropex.com/verify/${farmerID}`;
  const message = `My Hashmar CropEx Farmer ID: ${farmerID}. Verify: ${profileURL}`;
  return `sms:?body=${encodeURIComponent(message)}`;
}

/**
 * Returns true if the value is a non-empty string.
 */
export function isNonEmpty(val) {
  return typeof val === "string" && val.trim().length > 0;
}

const STATUS_PREVIEW_KEY = "hcx_agent_status_preview";
const USER_ID_MAP_KEY = "hcx_agent_user_id_map";
const REG_KEY = "hcx_agent_registration";

function readString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}

function extractDataRoot(payload) {
  if (!payload || typeof payload !== "object") return {};
  return payload.data && typeof payload.data === "object" ? payload.data : payload;
}

function resolveAgentRecord(root) {
  if (!root || typeof root !== "object") return root;
  if (root.field_agent && typeof root.field_agent === "object") return root.field_agent;
  if (root.agent && typeof root.agent === "object") return root.agent;
  if (root.user && typeof root.user === "object") return root.user;
  return root;
}

export function clearAgentStatusPreview() {
  try {
    sessionStorage.removeItem(STATUS_PREVIEW_KEY);
  } catch {
    /* ignore */
  }
}

export function setAgentStatusPreview(status) {
  try {
    const normalized = String(status || "").trim().toUpperCase();
    if (normalized) sessionStorage.setItem(STATUS_PREVIEW_KEY, normalized);
  } catch {
    /* ignore */
  }
}

export function getAgentStatusPreview() {
  try {
    return readString(sessionStorage.getItem(STATUS_PREVIEW_KEY)).toUpperCase();
  } catch {
    return "";
  }
}

export function extractAgentStatus(payload) {
  if (!payload || typeof payload !== "object") return "";

  const root = extractDataRoot(payload);
  const agent = resolveAgentRecord(root);

  const farmer = root?.farmer && typeof root.farmer === "object" ? root.farmer : null;

  const status = readString(
    root?.status,
    root?.account_status,
    root?.agent_status,
    farmer?.agent_status,
    agent?.status,
    agent?.account_status,
    payload?.status,
    payload?.account_status
  ).toUpperCase();

  if (status) return status;
  if (agent?.is_active === true || root?.is_active === true) return "ACTIVE";
  if (agent?.is_active === false || root?.is_active === false) return "PENDING";
  return "";
}

export function extractFarmerAgentUpgradeStatus(payload) {
  if (!payload || typeof payload !== "object") return "";

  const root = extractDataRoot(payload);
  const farmer = root?.farmer && typeof root.farmer === "object" ? root.farmer : null;
  const fieldAgent =
    farmer?.field_agent && typeof farmer.field_agent === "object"
      ? farmer.field_agent
      : farmer?.agent && typeof farmer.agent === "object"
        ? farmer.agent
        : root?.field_agent && typeof root.field_agent === "object"
          ? root.field_agent
          : null;
  const agentUpgrade =
    root?.agent_upgrade && typeof root.agent_upgrade === "object"
      ? root.agent_upgrade
      : farmer?.agent_upgrade && typeof farmer.agent_upgrade === "object"
        ? farmer.agent_upgrade
        : null;

  const status = readString(
    agentUpgrade?.status,
    farmer?.agent_upgrade_status,
    farmer?.upgrade_to_agent_status,
    farmer?.upgrade_status,
    farmer?.agent_status,
    fieldAgent?.status,
    fieldAgent?.account_status,
    root?.agent_upgrade_status,
    root?.upgrade_to_agent_status,
  ).toUpperCase();

  if (status) return status;
  if (farmer?.is_field_agent === true) return "ACTIVE";

  return "";
}

const FARMER_UPGRADE_STATUS_KEY = "hcx_farmer_agent_upgrade_status";

export function readStoredFarmerUpgradeStatus(farmerKey) {
  const key = readString(farmerKey);
  if (!key) return "none";
  try {
    const raw = localStorage.getItem(FARMER_UPGRADE_STATUS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const value = map[key];
    if (value === "verified" || value === "under_review" || value === "failed") return value;
  } catch {
    /* ignore */
  }
  return "none";
}

export function writeStoredFarmerUpgradeStatus(farmerKey, screen) {
  const key = readString(farmerKey);
  if (!key) return;
  try {
    const raw = localStorage.getItem(FARMER_UPGRADE_STATUS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    if (screen === "none") {
      delete map[key];
    } else if (screen === "verified" || screen === "under_review" || screen === "failed") {
      map[key] = screen;
    } else {
      return;
    }
    localStorage.setItem(FARMER_UPGRADE_STATUS_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function resolveFarmerAgentUpgradeScreen(dashboard, farmerKey = "") {
  const fromApi = getFarmerAgentUpgradeScreen(extractFarmerAgentUpgradeStatus(dashboard));
  if (fromApi !== "none") {
    writeStoredFarmerUpgradeStatus(farmerKey, fromApi);
    return fromApi;
  }

  const stored = readStoredFarmerUpgradeStatus(farmerKey);
  if (stored === "verified" || stored === "under_review" || stored === "failed") {
    return stored;
  }

  return "none";
}

export function isAgentStatusApproved(status) {
  const normalized = String(status || "").trim().toUpperCase();
  return (
    normalized === "ACTIVE" ||
    normalized === "VERIFIED" ||
    normalized === "APPROVED" ||
    normalized === "SUCCESS"
  );
}

export function extractAgentUserId(payload) {
  if (!payload || typeof payload !== "object") return "";
  const root = extractDataRoot(payload);
  const agent = resolveAgentRecord(root);
  const user = root?.user && typeof root.user === "object" ? root.user : null;
  return readString(
    user?.id,
    user?.user_id,
    user?.agent_id,
    agent?.id,
    agent?.user_id,
    agent?.agent_id,
    root?.id,
    root?.user_id,
    root?.agent_id,
    payload?.id,
    payload?.user_id,
    payload?.agent_id,
  );
}

export function saveAgentUserIdForEmail(email, userId) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedUserId = readString(userId);
  if (!normalizedEmail || !normalizedUserId) return;
  try {
    const raw = sessionStorage.getItem(USER_ID_MAP_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[normalizedEmail] = normalizedUserId;
    sessionStorage.setItem(USER_ID_MAP_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function getAgentUserIdForEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return "";
  try {
    const raw = sessionStorage.getItem(USER_ID_MAP_KEY);
    const map = raw ? JSON.parse(raw) : {};
    return readString(map?.[normalizedEmail]);
  } catch {
    return "";
  }
}

export function ensureRegistrationUserId({ email, userId } = {}) {
  const normalizedUserId = readString(userId);
  if (!normalizedUserId) return;
  try {
    const raw = sessionStorage.getItem(REG_KEY);
    const reg = raw ? JSON.parse(raw) : {};
    sessionStorage.setItem(
      REG_KEY,
      JSON.stringify({
        ...reg,
        email: readString(email, reg.email),
        userId: normalizedUserId,
      }),
    );
  } catch {
    /* ignore */
  }
}

export function resolveAgentUserId({ email, errorBody } = {}) {
  const fromError = extractAgentUserId(errorBody);
  if (fromError) return fromError;

  const fromEmail = getAgentUserIdForEmail(email);
  if (fromEmail) return fromEmail;

  try {
    const raw = sessionStorage.getItem(REG_KEY);
    const reg = raw ? JSON.parse(raw) : {};
    const regEmail = String(reg.email || "").trim().toLowerCase();
    const loginEmail = String(email || "").trim().toLowerCase();
    if (loginEmail && regEmail === loginEmail) {
      return readString(reg.userId);
    }
  } catch {
    /* ignore */
  }

  return "";
}

export function getRouteForAgentStatus(status) {
  const normalized = String(status || "").trim().toUpperCase();
  if (!normalized) return null;
  if (isAgentStatusApproved(normalized)) return null;

  if (
    normalized === "PENDING" ||
    normalized === "UNDER_REVIEW" ||
    normalized === "AWAITING_APPROVAL" ||
    normalized === "AWAITING_VERIFICATION"
  ) {
    return "/agent/account-under-review";
  }

  if (
    normalized === "REJECTED" ||
    normalized === "DENIED" ||
    normalized === "FAILED" ||
    normalized === "VERIFICATION_FAILED"
  ) {
    return "/agent/verification-failed";
  }

  if (normalized === "SUSPENDED" || normalized === "INACTIVE" || normalized === "DISABLED") {
    return "/agent/contact-support";
  }

  return null;
}

/**
 * Returns a post-auth route when the agent must not use the main app yet, or null when cleared for home.
 */
export function getAgentStatusRoute(payload) {
  const status = extractAgentStatus(payload);
  if (!status) return null;

  if (isAgentStatusApproved(status)) {
    clearAgentStatusPreview();
    return null;
  }

  return getRouteForAgentStatus(status);
}

/** Status polling / login-blocked flows: pending, success, failed outcome screens. */
export function getAgentStatusOutcomeRoute(payload) {
  const status = extractAgentStatus(payload);
  if (!status) return null;

  if (isAgentStatusApproved(status)) {
    clearAgentStatusPreview();
    return "/agent/account-verified";
  }

  return getRouteForAgentStatus(status);
}

/** Login blocked response (e.g. 403): read status + user id, persist id, return outcome route. */
export function getAgentLoginBlockedRoute(errorBody, email) {
  const root = extractDataRoot(errorBody);
  const loginEmail = readString(email, root?.user?.email);
  const userId = extractAgentUserId(errorBody);

  if (userId) {
    if (loginEmail) saveAgentUserIdForEmail(loginEmail, userId);
    ensureRegistrationUserId({ email: loginEmail, userId });
  }

  const route = getAgentStatusOutcomeRoute(errorBody);
  if (route) return route;

  const inferred = inferStatusFromLoginFailure("", errorBody);
  if (inferred === "PENDING") return "/agent/account-under-review";
  if (inferred === "REJECTED") return "/agent/verification-failed";
  if (inferred === "SUSPENDED") return "/agent/contact-support";
  return null;
}

export async function routeAgentByUserStatus({ email, errorBody, getAgentStatus }) {
  const loginEmail = String(email || "").trim();
  const userId = resolveAgentUserId({ email: loginEmail, errorBody });
  if (userId) {
    saveAgentUserIdForEmail(loginEmail, userId);
    ensureRegistrationUserId({ email: loginEmail, userId });
    try {
      const payload = await getAgentStatus(userId);
      const route = getAgentStatusOutcomeRoute(payload);
      if (route) return route;
    } catch {
      /* fall through to inferred route */
    }
  }

  const inferred = inferStatusFromLoginFailure("", errorBody);
  if (inferred === "PENDING") return "/agent/account-under-review";
  if (inferred === "REJECTED") return "/agent/verification-failed";
  return null;
}

function collectStatusHints(value, depth = 0, bucket = []) {
  if (depth > 5 || value == null) return bucket;
  if (typeof value === "string") {
    bucket.push(value);
    return bucket;
  }
  if (typeof value !== "object") return bucket;

  if (value.status) bucket.push(String(value.status));
  if (value.agent_status) bucket.push(String(value.agent_status));
  if (value.account_status) bucket.push(String(value.account_status));

  if (Array.isArray(value)) {
    value.forEach((item) => collectStatusHints(item, depth + 1, bucket));
    return bucket;
  }

  Object.values(value).forEach((child) => collectStatusHints(child, depth + 1, bucket));
  return bucket;
}

export function inferStatusFromLoginFailure(message, body) {
  for (const hint of collectStatusHints(body)) {
    const route = getRouteForAgentStatus(hint);
    if (route) return String(hint).trim().toUpperCase();
  }

  const text = `${message || ""} ${
    typeof body === "string" ? body : JSON.stringify(body || "")
  }`.toLowerCase();

  if (/suspend|deactivat|disabled account|account disabled/.test(text)) return "SUSPENDED";
  if (/reject|denied|not approved|verification failed|unable to verify|could not verify/.test(text)) {
    return "REJECTED";
  }
  if (
    /pending|under review|awaiting|admin approval|administrator|not yet approved|not been approved|approval required/.test(
      text
    )
  ) {
    return "PENDING";
  }

  return "";
}

export function getAgentStatusNavigateOptions(status) {
  const path = getRouteForAgentStatus(status);
  if (!path) return null;

  if (path === "/agent/contact-support") {
    return {
      path,
      state: { preAuth: true, from: "login-suspended" },
    };
  }

  return { path };
}

function isFarmerAgentUpgradePending(status) {
  const normalized = String(status || "").trim().toUpperCase();
  return (
    normalized === "PENDING" ||
    normalized === "UNDER_REVIEW" ||
    normalized === "AWAITING_APPROVAL" ||
    normalized === "AWAITING_VERIFICATION"
  );
}

function isFarmerAgentUpgradeFailed(status) {
  const normalized = String(status || "").trim().toUpperCase();
  return (
    normalized === "REJECTED" ||
    normalized === "DENIED" ||
    normalized === "FAILED" ||
    normalized === "VERIFICATION_FAILED"
  );
}

export function getFarmerAgentUpgradeScreen(status) {
  const normalized = String(status || "").trim().toUpperCase();
  if (!normalized) return "none";
  if (isAgentStatusApproved(normalized)) return "verified";
  if (isFarmerAgentUpgradePending(normalized)) return "under_review";
  if (isFarmerAgentUpgradeFailed(normalized)) return "failed";
  return "none";
}

const STATUS_PREVIEW_KEY = "hcx_agent_status_preview";

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
  const agent = root?.agent && typeof root.agent === "object" ? root.agent : root;

  const status = readString(
    agent?.status,
    agent?.account_status,
    root?.status,
    root?.account_status,
    payload?.status,
    payload?.account_status
  ).toUpperCase();

  if (status) return status;
  if (agent?.is_active === true || root?.is_active === true) return "ACTIVE";
  return "";
}

export function isAgentStatusApproved(status) {
  const normalized = String(status || "").trim().toUpperCase();
  return normalized === "ACTIVE" || normalized === "VERIFIED" || normalized === "APPROVED";
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

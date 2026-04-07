/** Base URL: set `VITE_API_BASE_URL` in `.env` (no trailing slash). */
export function getCropexBaseUrl() {
  const v = import.meta.env.VITE_API_BASE_URL;
  if (v != null && String(v).trim() !== "") {
    return String(v).replace(/\/$/, "");
  }
  return "https://hashmaramala-production.up.railway.app";
}

export class CropexHttpError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "CropexHttpError";
    this.status = status;
    this.body = body;
  }
}

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function errorMessageFromBody(data, fallback) {
  if (data == null) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (Array.isArray(data.errors)) return data.errors.map(String).join("; ");
  return fallback;
}

/**
 * @param {string} path - absolute path e.g. `/agents/login`
 * @param {{ method?: string, body?: object, token?: string | null, headers?: Record<string, string> }} opts
 */
export async function cropexFetch(path, opts = {}) {
  const { method = "GET", body, token, headers = {} } = opts;
  const base = getCropexBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const h = {
    Accept: "application/json",
    ...headers,
  };
  if (token) {
    h.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) {
    h["Content-Type"] = "application/json";
  }
  const res = await fetch(url, {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await parseBody(res);
  if (!res.ok) {
    const msg = errorMessageFromBody(data, res.statusText || "Request failed");
    throw new CropexHttpError(msg, res.status, data);
  }
  return data;
}

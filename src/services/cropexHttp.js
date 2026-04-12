/** Local-only placeholder while backend integration is paused. */
export function getCropexBaseUrl() {
  return "";
}

export class CropexHttpError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "CropexHttpError";
    this.status = status;
    this.body = body;
  }
}

export async function cropexFetch(path, opts = {}) {
  // Intentionally no network calls in local-only mode.
  void path;
  void opts;
  throw new CropexHttpError(
    "Backend integration is disabled in this build.",
    503,
    { localMode: true }
  );
}

import { getDisplayError } from "../utils/apiErrors";
import {
  extractGeoArray,
  getGeoLgas,
  getGeoStates,
  mapGeoLgaOption,
  mapGeoStateOption,
} from "./cropexApi";

const STATES_KEY = "hcx_geo_states";
const LGAS_KEY = "hcx_geo_lgas";

function isBrowserOnline() {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

function readLgasStore() {
  try {
    const raw = localStorage.getItem(LGAS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLgasStore(store) {
  try {
    localStorage.setItem(LGAS_KEY, JSON.stringify(store));
  } catch {}
}

export function getCachedGeoStates() {
  try {
    const raw = localStorage.getItem(STATES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function cacheGeoStates(options) {
  if (!Array.isArray(options) || options.length === 0) return;
  try {
    localStorage.setItem(STATES_KEY, JSON.stringify(options));
  } catch {}
}

export function getCachedGeoLgas(stateId) {
  const list = readLgasStore()[String(stateId || "")];
  return Array.isArray(list) ? list : [];
}

export function cacheGeoLgas(stateId, options) {
  const id = String(stateId || "");
  if (!id || !Array.isArray(options) || options.length === 0) return;
  const store = readLgasStore();
  store[id] = options;
  writeLgasStore(store);
}

export const GEO_OFFLINE_EMPTY_STATES_MESSAGE =
  "State list is not saved for offline use. Open the app while online once, then try again.";

export const GEO_OFFLINE_EMPTY_LGAS_MESSAGE =
  "LGAs for this state are not saved for offline use. Open the app while online once, then try again.";

async function fetchAndCacheStates() {
  const payload = await getGeoStates();
  const options = extractGeoArray(payload).map(mapGeoStateOption).filter(Boolean);
  if (options.length > 0) cacheGeoStates(options);
  return options;
}

async function fetchAndCacheLgas(stateId) {
  const payload = await getGeoLgas(stateId);
  const options = extractGeoArray(payload).map(mapGeoLgaOption).filter(Boolean);
  if (options.length > 0) cacheGeoLgas(stateId, options);
  return options;
}

export async function loadGeoStates({ online = isBrowserOnline() } = {}) {
  if (online) {
    try {
      const options = await fetchAndCacheStates();
      if (options.length > 0) {
        void prefetchAllGeoLgas({ states: options });
      }
      return {
        options,
        fromCache: false,
        error: options.length === 0 ? "Could not load states right now." : "",
      };
    } catch (error) {
      const cached = getCachedGeoStates();
      if (cached.length > 0) {
        return { options: cached, fromCache: true, error: "" };
      }
      return {
        options: [],
        fromCache: false,
        error: getDisplayError(error, "Could not load states right now."),
      };
    }
  }

  const cached = getCachedGeoStates();
  if (cached.length > 0) {
    return { options: cached, fromCache: true, error: "" };
  }

  return {
    options: [],
    fromCache: false,
    error: GEO_OFFLINE_EMPTY_STATES_MESSAGE,
  };
}

export async function loadGeoLgas(stateId, { online = isBrowserOnline() } = {}) {
  const id = String(stateId || "");
  if (!id) return { options: [], fromCache: false, error: "" };

  if (online) {
    try {
      const options = await fetchAndCacheLgas(id);
      return {
        options,
        fromCache: false,
        error: options.length === 0 ? "Could not load LGAs right now." : "",
      };
    } catch (error) {
      const cached = getCachedGeoLgas(id);
      if (cached.length > 0) {
        return { options: cached, fromCache: true, error: "" };
      }
      return {
        options: [],
        fromCache: false,
        error: getDisplayError(error, "Could not load LGAs right now."),
      };
    }
  }

  const cached = getCachedGeoLgas(id);
  if (cached.length > 0) {
    return { options: cached, fromCache: true, error: "" };
  }

  return {
    options: [],
    fromCache: false,
    error: GEO_OFFLINE_EMPTY_LGAS_MESSAGE,
  };
}

let prefetchPromise = null;

export function prefetchAllGeoLgas({ states } = {}) {
  const stateList = states || getCachedGeoStates();
  if (!isBrowserOnline() || stateList.length === 0) return Promise.resolve();

  if (prefetchPromise) return prefetchPromise;

  prefetchPromise = (async () => {
    for (const state of stateList) {
      if (!isBrowserOnline()) break;
      if (getCachedGeoLgas(state.id).length > 0) continue;
      try {
        await fetchAndCacheLgas(state.id);
      } catch {
        // Keep prefetching remaining states.
      }
    }
  })().finally(() => {
    prefetchPromise = null;
  });

  return prefetchPromise;
}

export async function preloadGeoCache() {
  if (!isBrowserOnline()) return;
  try {
    await fetchAndCacheStates();
    void prefetchAllGeoLgas();
  } catch {
    // Preload is best-effort.
  }
}

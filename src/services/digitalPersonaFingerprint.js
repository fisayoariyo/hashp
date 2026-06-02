/**
 * HID DigitalPersona U.are.U browser integration.
 *
 * The official npm packages ship browser-only IIFE bundles. They are copied to
 * public/vendor/digitalpersona so Vite can serve them in dev and production.
 * The Windows HID Authentication Device Client still has to be installed on the
 * operator machine so the browser can talk to the USB reader.
 */

const VENDOR_BASE = "/vendor/digitalpersona";
const WEBSDK_SRC = `${VENDOR_BASE}/websdk.client.ui.min.js`;
const FINGERPRINT_SDK_SOURCES = [
  `${VENDOR_BASE}/fingerprint.sdk.min.js`,
  "/fingerprint.sdk.min.js",
];
const CAPTURE_TIMEOUT_MS = 12000;

let loadPromise = null;

function hasWebSdk() {
  return typeof window !== "undefined" && Boolean(window.WebSdk);
}

export function isDigitalPersonaSdkLoaded() {
  return (
    typeof window !== "undefined" &&
    hasWebSdk() &&
    Boolean(window.Fingerprint?.WebApi) &&
    Boolean(window.Fingerprint?.SampleFormat)
  );
}

function appendScript(src, marker) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-dp-sdk="${marker}"][src="${src}"]`);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing || document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.dpSdk = marker;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      reject(new Error(`Could not load ${src}.`));
    };

    if (!existing) {
      document.head.appendChild(script);
    }
  });
}

async function loadScriptUntilReady({ sources, marker, isReady, label }) {
  if (isReady()) return;

  let lastError = null;
  for (const src of sources) {
    try {
      await appendScript(src, marker);
      if (isReady()) return;
      lastError = new Error(`${label} loaded from ${src} but the expected browser global was not found.`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError || new Error(`${label} could not be loaded.`);
}

export function loadDigitalPersonaSdk() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("DigitalPersona SDK requires a browser."));
  }
  if (isDigitalPersonaSdkLoaded()) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    await loadScriptUntilReady({
      sources: [WEBSDK_SRC],
      marker: "websdk",
      isReady: hasWebSdk,
      label: "DigitalPersona WebSDK",
    });
    await loadScriptUntilReady({
      sources: FINGERPRINT_SDK_SOURCES,
      marker: "fingerprint",
      isReady: () => Boolean(window.Fingerprint?.WebApi),
      label: "DigitalPersona Fingerprint SDK",
    });
  })().catch((error) => {
    loadPromise = null;
    throw error;
  });

  return loadPromise;
}

export function createDigitalPersonaWebApi() {
  if (!isDigitalPersonaSdkLoaded()) {
    throw new Error("DigitalPersona SDK is not loaded yet.");
  }
  return new window.Fingerprint.WebApi();
}

export function getDigitalPersonaSampleFormat() {
  const formats = window.Fingerprint?.SampleFormat || {};
  const format = formats.Fmd ?? formats.Intermediate;
  if (format == null) {
    throw new Error("DigitalPersona SDK does not expose an FMD/intermediate sample format.");
  }
  return format;
}

export async function enumerateDigitalPersonaReaders(webApi) {
  if (!webApi?.enumerateDevices) return [];
  const readers = await webApi.enumerateDevices();
  return Array.isArray(readers) ? readers : [];
}

export function getDigitalPersonaInstallMessage() {
  return (
    "Cannot communicate with the DigitalPersona reader. Confirm the U.are.U scanner is connected and install the HID Authentication Device Client if this workstation does not already have it."
  );
}

function normalizeSample(sample) {
  const text = String(sample || "");
  if (!text) return "";
  if (typeof window.Fingerprint?.b64UrlTo64 === "function") {
    return window.Fingerprint.b64UrlTo64(text);
  }
  return text;
}

function extractSampleTemplate(sample) {
  if (typeof sample === "string") {
    return normalizeSample(sample);
  }

  if (!sample || typeof sample !== "object") {
    return "";
  }

  const rawTemplate =
    (typeof sample.Data === "string" && sample.Data) ||
    (typeof sample.data === "string" && sample.data) ||
    "";

  return normalizeSample(rawTemplate);
}

async function stopAcquisition(webApi) {
  try {
    await webApi.stopAcquisition();
  } catch {
    /* ignore scanner stop failures during cleanup */
  }
}

/**
 * Acquire one FMD/intermediate sample and return a base64 template for the API.
 */
export function acquireDigitalPersonaFmd(webApi) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const startedAt = Date.now();
    let captureTimeoutId = null;
    const debug = (stage, details = {}) => {
      try {
        console.info("[fingerprint-debug]", {
          stage,
          elapsedMs: Date.now() - startedAt,
          ...details,
        });
      } catch {
        /* debug logging must never break capture flow */
      }
    };

    const finish = async (error, template) => {
      if (settled) return;
      settled = true;
      if (captureTimeoutId) {
        clearTimeout(captureTimeoutId);
        captureTimeoutId = null;
      }
      debug("finish:start", {
        ok: !error,
        templateLength: typeof template === "string" ? template.length : 0,
        error: error instanceof Error ? error.message : undefined,
      });
      await stopAcquisition(webApi);
      if (error) {
        debug("finish:reject", { message: error.message });
        reject(error);
        return;
      }
      debug("finish:resolve");
      resolve(template);
    };

    webApi.onSamplesAcquired = (event) => {
      debug("event:onSamplesAcquired");
      try {
        const samples = typeof event.samples === "string" ? JSON.parse(event.samples) : event.samples;
        const firstSample = Array.isArray(samples) ? samples[0] : samples;
        const fmdTemplate = extractSampleTemplate(firstSample);
        if (!fmdTemplate) {
          debug("event:onSamplesAcquired:emptyTemplate");
          void finish(new Error("No fingerprint sample returned."));
          return;
        }
        debug("event:onSamplesAcquired:templateReady", { templateLength: fmdTemplate.length });
        void finish(null, fmdTemplate);
      } catch (error) {
        debug("event:onSamplesAcquired:parseError", {
          message: error instanceof Error ? error.message : String(error),
        });
        void finish(error instanceof Error ? error : new Error(String(error)));
      }
    };

    webApi.onErrorOccurred = (event) => {
      const msg = event && typeof event.error !== "undefined" ? String(event.error) : "Scanner error";
      debug("event:onErrorOccurred", { message: msg });
      void finish(new Error(msg));
    };

    webApi.onCommunicationFailed = () => {
      debug("event:onCommunicationFailed");
      void finish(new Error(getDigitalPersonaInstallMessage()));
    };

    // Some readers stay in an in-between state after a successful scan; force reset before next start.
    captureTimeoutId = setTimeout(() => {
      void finish(new Error("Scanner timed out waiting for a fingerprint sample. Lift finger and try again."));
    }, CAPTURE_TIMEOUT_MS);

    debug("startAcquisition:resetThenCall");
    Promise.resolve(stopAcquisition(webApi))
      .catch(() => {
        /* ignore best-effort reset failure and still attempt start */
      })
      .finally(() => {
        Promise.resolve(webApi.startAcquisition(getDigitalPersonaSampleFormat())).catch((error) => {
          debug("startAcquisition:rejected", {
            message: error instanceof Error ? error.message : String(error),
          });
          void finish(error instanceof Error ? error : new Error(String(error)));
        });
      });
  });
}

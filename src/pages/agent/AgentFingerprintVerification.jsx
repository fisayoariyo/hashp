import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import {
  acquireDigitalPersonaFmd,
  createDigitalPersonaWebApi,
  enumerateDigitalPersonaReaders,
  getDigitalPersonaInstallMessage,
  loadDigitalPersonaSdk,
} from "../../services/digitalPersonaFingerprint";
import { getEnrollmentBiometricStatus, submitEnrollmentFingerprint } from "../../services/cropexApi";

const FINGER_OPTIONS = [
  { id: "right_thumb", label: "Right Thumb" },
  { id: "right_index", label: "Right Index" },
  { id: "right_middle", label: "Right Middle" },
  { id: "right_ring", label: "Right Ring" },
  { id: "right_little", label: "Right Little" },
  { id: "left_thumb", label: "Left Thumb" },
  { id: "left_index", label: "Left Index" },
  { id: "left_middle", label: "Left Middle" },
  { id: "left_ring", label: "Left Ring" },
  { id: "left_little", label: "Left Little" },
];

const TOTAL_SCANS_REQUIRED = 1;

const READER_CONNECT_TIMEOUT_MS = 25000;

const STATUS_COLORS = {
  idle: "#9ca3af",
  scanning: "#d4900a",
  success: "#155235",
  failed: "#ef4444",
};

function StatusLegendDot({ state }) {
  const color = STATUS_COLORS[state] || STATUS_COLORS.idle;
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-4 w-4 items-center justify-center rounded-full border"
      style={{ borderColor: color, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
    </span>
  );
}

function FingerprintPrint() {
  return (
    <div className="mx-auto flex w-full max-w-[220px] flex-col items-center gap-3">
      <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full border border-brand-border bg-brand-surface/80">
        <img
          src="/landing/icons/finger-access.svg"
          alt=""
          className="h-[64px] w-[64px]"
          aria-hidden="true"
        />
      </div>
      <p className="text-center text-xs font-semibold uppercase tracking-[0.4em] text-brand-text-secondary">
        Fingerprint
      </p>
    </div>
  );
}

function mapBackendFingerStatus(status) {
  const s = String(status || "").toLowerCase();
  if (s === "success") return "success";
  return "idle";
}

function getBiometricData(payload) {
  if (!payload || typeof payload !== "object") return {};
  return payload.data && typeof payload.data === "object" ? payload.data : payload;
}

function applyBackendFingerRows(previous, rows) {
  const next = { ...previous };
  if (!Array.isArray(rows)) return next;
  rows.forEach((row) => {
    if (next[row.position] !== undefined) {
      next[row.position] = mapBackendFingerStatus(row.status);
    }
  });
  return next;
}

export default function AgentFingerprintVerification({ onSuccess, onBack, embedded, sessionId }) {
  const webApiRef = useRef(null);
  const readerTimerRef = useRef(null);
  const activeCaptureIdRef = useRef(0);
  const scanningFingerRef = useRef("");
  const preScanFingerStateRef = useRef("idle");

  const [scannerChecking, setScannerChecking] = useState(true);
  const [scannerReady, setScannerReady] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [scanning, setScanning] = useState(false);
  const [selectedFingerId, setSelectedFingerId] = useState(FINGER_OPTIONS[0].id);
  const [fingerStates, setFingerStates] = useState(
    Object.fromEntries(FINGER_OPTIONS.map((finger) => [finger.id, "idle"]))
  );

  useEffect(() => {
    let mounted = true;

    function clearReaderTimer() {
      if (readerTimerRef.current) {
        clearTimeout(readerTimerRef.current);
        readerTimerRef.current = null;
      }
    }

    function detachWebApi() {
      const api = webApiRef.current;
      webApiRef.current = null;
      if (!api) return;
      try {
        api.stopAcquisition();
      } catch {
        /* ignore */
      }
      api.onDeviceConnected = null;
      api.onDeviceDisconnected = null;
      api.onReaderConnected = null;
      api.onReaderDisconnected = null;
      api.onErrorOccurred = null;
      api.onSamplesAcquired = null;
      api.onCommunicationFailed = null;
    }

    async function bootstrap() {
      if (!sessionId) {
        setScannerChecking(false);
        setScannerError("Enrollment session is missing.");
        return;
      }
      setScannerChecking(true);
      setScannerError("");
      setScannerReady(false);
      clearReaderTimer();

      try {
        await loadDigitalPersonaSdk();
        if (!mounted) return;

        const webApi = createDigitalPersonaWebApi();
        webApiRef.current = webApi;

        const handleReaderConnected = () => {
          if (!mounted) return;
          clearReaderTimer();
          setScannerReady(true);
          setScannerError("");
        };

        const handleReaderDisconnected = () => {
          if (!mounted) return;
          setScannerReady(false);
          setScannerError("Please connect the DigitalPersona U.are.U scanner.");
        };

        webApi.onDeviceConnected = handleReaderConnected;
        webApi.onDeviceDisconnected = handleReaderDisconnected;
        webApi.onReaderConnected = handleReaderConnected;
        webApi.onReaderDisconnected = handleReaderDisconnected;
        webApi.onErrorOccurred = (event) => {
          if (!mounted) return;
          const msg = event && event.error != null ? String(event.error) : "Scanner error";
          setScannerError(msg);
        };
        webApi.onCommunicationFailed = () => {
          if (!mounted) return;
          setScannerReady(false);
          setScannerError(getDigitalPersonaInstallMessage());
        };

        const readers = await enumerateDigitalPersonaReaders(webApi).catch(() => []);
        if (readers.length > 0) {
          handleReaderConnected();
        }

        readerTimerRef.current = setTimeout(() => {
          if (!mounted) return;
          setScannerReady((ready) => {
            if (!ready) {
              setScannerError(
                (prev) =>
                  prev ||
                  "DigitalPersona scanner not detected. Connect the U.are.U reader by USB and confirm the HID Authentication Device Client is installed."
              );
            }
            return ready;
          });
        }, READER_CONNECT_TIMEOUT_MS);

        const biometricStatus = await getEnrollmentBiometricStatus(sessionId).catch(() => null);
        if (!mounted) return;
        const statusData = getBiometricData(biometricStatus);
        const rows = Array.isArray(statusData.fingers) ? statusData.fingers : [];
        if (rows.length > 0) {
          const restoredStates = applyBackendFingerRows(
            Object.fromEntries(FINGER_OPTIONS.map((finger) => [finger.id, "idle"])),
            rows
          );
          setFingerStates((prev) => applyBackendFingerRows(prev, rows));
          const nextPreferred =
            FINGER_OPTIONS.find((finger) => restoredStates[finger.id] !== "success") || FINGER_OPTIONS[0];
          setSelectedFingerId(nextPreferred.id);
        }
      } catch (error) {
        if (!mounted) return;
        setScannerReady(false);
        setScannerError(error instanceof Error ? error.message : "Could not load fingerprint SDK.");
      } finally {
        if (mounted) setScannerChecking(false);
      }
    }

    void bootstrap();

    return () => {
      mounted = false;
      clearReaderTimer();
      detachWebApi();
    };
  }, [sessionId]);

  const completedCount = Object.values(fingerStates).filter((state) => state === "success").length;
  const allDone = completedCount >= TOTAL_SCANS_REQUIRED;
  const currentFinger = FINGER_OPTIONS.find((finger) => finger.id === selectedFingerId);

  const captureCurrent = async () => {
    if (!sessionId || !currentFinger || scanning) return;
    const webApi = webApiRef.current;
    if (!webApi) {
      setScannerError("Scanner is not initialized.");
      return;
    }
    const captureId = activeCaptureIdRef.current + 1;
    activeCaptureIdRef.current = captureId;
    scanningFingerRef.current = currentFinger.id;
    preScanFingerStateRef.current = fingerStates[currentFinger.id] || "idle";

    setScanning(true);
    setScannerError("");
    setStatusMessage(`Place ${currentFinger.label.toLowerCase()} on the scanner.`);
    setFingerStates((prev) => ({ ...prev, [currentFinger.id]: "scanning" }));
    const captureStartedAt = Date.now();
    const logCaptureDebug = (stage, details = {}) => {
      try {
        console.info("[fingerprint-debug]", {
          stage,
          finger: currentFinger.id,
          sessionId: String(sessionId),
          elapsedMs: Date.now() - captureStartedAt,
          ...details,
        });
      } catch {
        /* debug logging must never break scan flow */
      }
    };
    logCaptureDebug("capture:started");
    try {
      const fmdTemplate = await acquireDigitalPersonaFmd(webApi);
      if (activeCaptureIdRef.current !== captureId) return;
      logCaptureDebug("capture:templateReady", { templateLength: fmdTemplate.length });
      const apiStartedAt = Date.now();
      logCaptureDebug("api:submit:start");
      const response = await submitEnrollmentFingerprint({
        session_id: sessionId,
        finger_position: currentFinger.id,
        fmr_template: fmdTemplate,
      });
      if (activeCaptureIdRef.current !== captureId) return;
      logCaptureDebug("api:submit:success", {
        apiElapsedMs: Date.now() - apiStartedAt,
      });
      const responseData = getBiometricData(response);
      const rows = Array.isArray(responseData.fingers) ? responseData.fingers : [];
      const saved = rows.find((item) => item.position === currentFinger.id);
      const success = rows.length === 0 || String(saved?.status || "").toLowerCase() === "success";
      const nextStates =
        rows.length > 0
          ? applyBackendFingerRows(fingerStates, rows)
          : { ...fingerStates, [currentFinger.id]: success ? "success" : "failed" };
      setFingerStates((prev) =>
        rows.length > 0
          ? applyBackendFingerRows(prev, rows)
          : { ...prev, [currentFinger.id]: success ? "success" : "failed" }
      );
      setStatusMessage(success ? `${currentFinger.label} captured.` : `${currentFinger.label} failed, choose another finger.`);
    } catch (error) {
      if (activeCaptureIdRef.current !== captureId) return;
      logCaptureDebug("capture:failed", {
        message: error instanceof Error ? error.message : String(error),
      });
      setFingerStates((prev) => ({ ...prev, [currentFinger.id]: "failed" }));
      setStatusMessage(error instanceof Error ? error.message : "Capture failed.");
    } finally {
      if (activeCaptureIdRef.current === captureId) {
        logCaptureDebug("capture:finished");
        setScanning(false);
        scanningFingerRef.current = "";
      }
    }
  };

  const cancelCurrentScan = () => {
    if (!scanning) return;
    activeCaptureIdRef.current += 1;
    const scanningFingerId = scanningFingerRef.current;
    scanningFingerRef.current = "";
    setScanning(false);
    setStatusMessage("Scan cancelled. Retry when ready.");
    if (scanningFingerId) {
      setFingerStates((prev) => {
        if (prev[scanningFingerId] !== "scanning") return prev;
        return {
          ...prev,
          [scanningFingerId]: preScanFingerStateRef.current === "success" ? "success" : "idle",
        };
      });
    }
    try {
      webApiRef.current?.stopAcquisition?.();
    } catch {
      /* ignore stop failures while canceling */
    }
  };

  const shell = (
    <div className="min-h-screen bg-gradient-to-b from-brand-page-bg/80 via-brand-page-bg to-brand-page-bg px-4 py-8">
      <div className="mx-auto w-full max-w-[720px] rounded-[32px] bg-brand-page-bg/70 px-6 py-8 shadow-sm">
        <div className="mb-5 text-center">
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1.5 font-sans text-sm text-brand-text-secondary"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
          <h1 className="font-heading text-[40px] leading-[46px] font-semibold text-brand-text-primary">
            Fingerprint Verification
          </h1>
          <p className="font-sans text-sm text-brand-text-secondary">
            Capture a single fingerprint to verify identity (DigitalPersona U.are.U)
          </p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <p className="font-sans text-sm font-semibold text-brand-text-primary">
              Fingerprint scan status guide
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <p className="inline-flex items-center gap-2 font-sans text-xs text-brand-text-secondary">
                <StatusLegendDot state="idle" />
                Fingerprint not scanned yet
              </p>
              <p className="inline-flex items-center gap-2 font-sans text-xs text-brand-text-secondary">
                <StatusLegendDot state="success" />
                Fingerprint scan successful
              </p>
              <p className="inline-flex items-center gap-2 font-sans text-xs text-brand-text-secondary">
                <StatusLegendDot state="failed" />
                Fingerprint scan failed
              </p>
            </div>
          </div>

          <FingerprintPrint />

          <div className="text-center space-y-1">
            <p className="font-sans text-[28px] leading-[34px] text-brand-text-primary">
              {scanning
                ? `Scanning ${currentFinger?.label || "finger"}...`
                : completedCount > 0
                  ? "Scan successful"
                  : "Ready to scan"}
            </p>
            <p className="font-sans text-sm text-brand-text-secondary">
              {scanning
                ? "Hold still"
                : `Place the ${currentFinger?.label?.toLowerCase() || "next finger"} on the scanner`}
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-brand-text-secondary">
              Select a finger
            </label>
            <div className="relative">
              <select
                value={selectedFingerId}
                onChange={(event) => {
                  setSelectedFingerId(event.target.value);
                  setStatusMessage("");
                }}
                className="w-full appearance-none rounded-[18px] border border-brand-border bg-brand-surface/70 px-4 py-3 text-sm font-sans font-semibold text-brand-text-primary focus:border-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
                disabled={scanning || allDone}
              >
                {FINGER_OPTIONS.map((finger) => (
                  <option key={finger.id} value={finger.id}>
                    {finger.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-secondary">
                <ChevronDown size={18} strokeWidth={3} />
              </span>
            </div>
            <p className="text-xs text-brand-text-secondary">
              Only one scan required; switch fingers here if the current choice fails.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/25 bg-brand-green/10 px-3 py-1.5">
              <StatusLegendDot state="success" />
              <p className="font-sans text-xs font-semibold text-brand-green">
                Completed Scans: {Math.min(completedCount, TOTAL_SCANS_REQUIRED)}/{TOTAL_SCANS_REQUIRED}
              </p>
            </div>
          </div>

          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand-text-secondary">
            Dropdown only · scan one finger · switch if needed
          </p>

          {statusMessage ? (
            <p className="mt-3 text-center font-sans text-xs text-brand-text-secondary">{statusMessage}</p>
          ) : null}
          {scannerChecking ? (
            <p className="mt-3 text-center font-sans text-sm text-brand-text-secondary">
              Loading DigitalPersona Web SDK…
            </p>
          ) : null}
          {scannerError ? (
            <p className="mt-3 text-center font-sans text-sm text-red-600">{scannerError}</p>
          ) : null}
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          {allDone ? (
            <button type="button" onClick={onSuccess} className="btn-capture-pill w-[240px] justify-center">
              Continue
            </button>
          ) : (
            <>
              {scanning ? (
                <button
                  type="button"
                  onClick={cancelCurrentScan}
                  className="h-[48px] min-w-[140px] rounded-full border border-brand-border bg-white px-5 font-sans text-sm font-semibold text-brand-text-primary hover:bg-gray-50"
                >
                  Cancel
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void captureCurrent()}
                disabled={!scannerReady || scannerChecking || scanning}
                className="btn-capture-pill w-[240px] justify-center disabled:cursor-not-allowed disabled:opacity-45"
              >
                {scanning ? "Scanning..." : `Capture ${currentFinger?.label || "finger"}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return embedded ? <div className="min-h-0">{shell}</div> : shell;
}

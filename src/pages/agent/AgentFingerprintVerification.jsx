import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  acquireDigitalPersonaFmd,
  createDigitalPersonaWebApi,
  enumerateDigitalPersonaReaders,
  getDigitalPersonaInstallMessage,
  loadDigitalPersonaSdk,
} from "../../services/digitalPersonaFingerprint";
import { getEnrollmentBiometricStatus, submitEnrollmentFingerprint } from "../../services/cropexApi";

const SCAN_ORDER = [
  { id: "right_thumb", label: "Right Thumb" },
  { id: "right_index", label: "Right Index" },
  { id: "left_thumb", label: "Left Thumb" },
  { id: "left_index", label: "Left Index" },
];

const READER_CONNECT_TIMEOUT_MS = 25000;

const STATUS_COLORS = {
  idle: "#9ca3af",
  scanning: "#d4900a",
  success: "#155235",
  failed: "#ef4444",
};

const FINGER_POINTS = {
  left_thumb: { cx: 32, cy: 88, labelX: 16, labelY: 108, anchor: "start" },
  left_index: { cx: 58, cy: 36, labelX: 58, labelY: 20, anchor: "middle" },
  right_index: { cx: 142, cy: 36, labelX: 142, labelY: 20, anchor: "middle" },
  right_thumb: { cx: 168, cy: 88, labelX: 184, labelY: 108, anchor: "end" },
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

function FingerRow({ label, state, active }) {
  const effectiveState = active ? "scanning" : state;
  const color = STATUS_COLORS[effectiveState] || STATUS_COLORS.idle;
  const statusText =
    effectiveState === "success"
      ? "Captured"
      : effectiveState === "failed"
        ? "Failed"
        : effectiveState === "scanning"
          ? "Scanning..."
          : "Pending";
  return (
    <div className="flex items-center justify-between rounded-xl border border-brand-border bg-white px-4 py-3">
      <p className="font-sans text-sm text-brand-text-primary">{label}</p>
      <p className="font-sans text-sm font-semibold" style={{ color }}>
        {statusText}
      </p>
    </div>
  );
}

function HandsDiagram({ fingerStates, activeFingerId }) {
  const stroke = "#e5e7eb";
  const fill = "white";
  return (
    <svg viewBox="0 0 200 130" className="mx-auto w-full max-w-[380px]" aria-hidden="true">
      <rect x="40" y="42" width="12" height="34" rx="6" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <rect x="52" y="28" width="12" height="48" rx="6" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <rect x="64" y="42" width="12" height="34" rx="6" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <rect x="28" y="72" width="52" height="36" rx="12" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <rect x="18" y="84" width="18" height="10" rx="5" fill={fill} stroke={stroke} strokeWidth="1.4" transform="rotate(-20 27 89)" />

      <rect x="124" y="42" width="12" height="34" rx="6" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <rect x="136" y="28" width="12" height="48" rx="6" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <rect x="148" y="42" width="12" height="34" rx="6" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <rect x="120" y="72" width="52" height="36" rx="12" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <rect x="164" y="84" width="18" height="10" rx="5" fill={fill} stroke={stroke} strokeWidth="1.4" transform="rotate(20 173 89)" />

      {SCAN_ORDER.map((finger) => {
        const point = FINGER_POINTS[finger.id];
        const state = fingerStates[finger.id];
        const active = activeFingerId === finger.id;
        const effectiveState = active ? "scanning" : state;
        const color = STATUS_COLORS[effectiveState] || STATUS_COLORS.idle;
        return (
          <g key={finger.id}>
            <circle cx={point.cx} cy={point.cy} r="8.5" fill="white" stroke={color} strokeWidth="2" />
            <path
              d={`M ${point.cx - 3} ${point.cy + 1} q 3 -5 6 0 M ${point.cx - 4.5} ${point.cy + 3.5} q 4.5 -7 9 0`}
              stroke={color}
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <text
              x={point.labelX}
              y={point.labelY}
              textAnchor={point.anchor}
              fontSize="7.5"
              fill="#6b7280"
              fontFamily="sans-serif"
            >
              {finger.label}
            </text>
          </g>
        );
      })}
    </svg>
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

function nextPendingScanIndex(states) {
  const nextIndex = SCAN_ORDER.findIndex((finger) => states[finger.id] !== "success");
  return nextIndex === -1 ? SCAN_ORDER.length - 1 : nextIndex;
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
  const [scanIndex, setScanIndex] = useState(0);
  const [fingerStates, setFingerStates] = useState(
    Object.fromEntries(SCAN_ORDER.map((finger) => [finger.id, "idle"]))
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
            Object.fromEntries(SCAN_ORDER.map((finger) => [finger.id, "idle"])),
            rows
          );
          setFingerStates((prev) => applyBackendFingerRows(prev, rows));
          setScanIndex(nextPendingScanIndex(restoredStates));
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
  const allDone = completedCount >= SCAN_ORDER.length;
  const currentFinger = SCAN_ORDER[scanIndex];

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
    try {
      const fmdTemplate = await acquireDigitalPersonaFmd(webApi);
      if (activeCaptureIdRef.current !== captureId) return;
      const response = await submitEnrollmentFingerprint({
        session_id: sessionId,
        finger_position: currentFinger.id,
        fmr_template: fmdTemplate,
      });
      if (activeCaptureIdRef.current !== captureId) return;
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
      setScanIndex(nextPendingScanIndex(nextStates));
      setStatusMessage(success ? `${currentFinger.label} captured.` : `${currentFinger.label} failed, retry.`);
    } catch (error) {
      if (activeCaptureIdRef.current !== captureId) return;
      setFingerStates((prev) => ({ ...prev, [currentFinger.id]: "failed" }));
      setStatusMessage(error instanceof Error ? error.message : "Capture failed.");
    } finally {
      if (activeCaptureIdRef.current === captureId) {
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
    <div className="min-h-screen bg-gradient-to-b from-white via-brand-page-bg to-white px-4 py-5">
      <div className="mx-auto w-full max-w-[720px]">
        <div className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-1.5 font-sans text-sm text-brand-text-secondary"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
          <div className="w-full text-center">
            <h1 className="font-heading text-[40px] leading-[46px] font-semibold text-brand-text-primary">
              Fingerprint Verification
            </h1>
            <p className="font-sans text-sm text-brand-text-secondary">
              Scan each finger to complete identity verification (DigitalPersona U.are.U)
            </p>
          </div>
        </div>

        <div className="rounded-[20px] border border-brand-border bg-white px-5 py-6 shadow-sm">
          <div className="mb-4 text-center">
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

          <HandsDiagram fingerStates={fingerStates} activeFingerId={scanning ? currentFinger?.id : ""} />

          <div className="mt-5 text-center">
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

          <div className="mt-5 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/25 bg-brand-green/10 px-3 py-1.5">
              <StatusLegendDot state="success" />
              <p className="font-sans text-xs font-semibold text-brand-green">
                Completed Scans: {completedCount}/4
              </p>
            </div>
          </div>

          <div className="mx-auto mt-5 w-full max-w-[520px] space-y-2">
            {SCAN_ORDER.map((finger) => (
              <FingerRow
                key={finger.id}
                label={finger.label}
                state={fingerStates[finger.id]}
                active={scanning && currentFinger?.id === finger.id}
              />
            ))}
          </div>
          {statusMessage ? (
            <p className="mt-3 text-center font-sans text-xs text-brand-text-secondary">{statusMessage}</p>
          ) : null}
          {scannerChecking ? (
            <p className="mt-3 text-center font-sans text-sm text-brand-text-secondary">
              Loading DigitalPersona Web SDK…
            </p>
          ) : null}
          {scannerError ? <p className="mt-3 text-center font-sans text-sm text-red-600">{scannerError}</p> : null}
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

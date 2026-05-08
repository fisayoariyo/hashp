import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  captureFingerprintFromRdService,
  checkRdServiceReady,
  getEnrollmentBiometricStatus,
  submitEnrollmentFingerprint,
} from "../../services/cropexApi";

const SCAN_ORDER = [
  { id: "right_thumb", label: "Right Thumb" },
  { id: "right_index", label: "Right Index" },
  { id: "left_thumb", label: "Left Thumb" },
  { id: "left_index", label: "Left Index" },
];

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
    <svg viewBox="0 0 200 130" className="mx-auto w-full max-w-[340px]" aria-hidden="true">
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

export default function AgentFingerprintVerification({ onSuccess, onBack, embedded, sessionId }) {
  const [rdChecking, setRdChecking] = useState(true);
  const [rdReady, setRdReady] = useState(false);
  const [rdError, setRdError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);
  const [fingerStates, setFingerStates] = useState(
    Object.fromEntries(SCAN_ORDER.map((finger) => [finger.id, "idle"]))
  );

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      if (!sessionId) {
        setRdChecking(false);
        setRdError("Enrollment session is missing.");
        return;
      }
      setRdChecking(true);
      setRdError("");
      try {
        const device = await checkRdServiceReady();
        if (!mounted) return;
        if (!device.ready) {
          setRdReady(false);
          setRdError("Scanner not ready. Start RD Service and reconnect MFS100.");
          return;
        }
        setRdReady(true);
        const biometricStatus = await getEnrollmentBiometricStatus(sessionId).catch(() => null);
        const rows = Array.isArray(biometricStatus?.data?.fingers) ? biometricStatus.data.fingers : [];
        if (rows.length > 0) {
          setFingerStates((prev) => {
            const next = { ...prev };
            rows.forEach((row) => {
              if (next[row.position] !== undefined) {
                next[row.position] = String(row.status).toLowerCase() === "success" ? "success" : "idle";
              }
            });
            return next;
          });
        }
      } catch (error) {
        if (!mounted) return;
        setRdReady(false);
        setRdError(error instanceof Error ? error.message : "Could not reach fingerprint service.");
      } finally {
        if (mounted) setRdChecking(false);
      }
    }
    void bootstrap();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  const completedCount = Object.values(fingerStates).filter((state) => state === "success").length;
  const allDone = completedCount >= SCAN_ORDER.length;
  const currentFinger = SCAN_ORDER[scanIndex];

  const captureCurrent = async () => {
    if (!sessionId || !currentFinger || scanning) return;
    setScanning(true);
    setRdError("");
    setStatusMessage(`Place ${currentFinger.label.toLowerCase()} on scanner.`);
    setFingerStates((prev) => ({ ...prev, [currentFinger.id]: "scanning" }));
    try {
      const rdCapture = await captureFingerprintFromRdService();
      if (!rdCapture.ok) {
        throw new Error(rdCapture.errInfo || `Scanner capture failed (${rdCapture.errCode || "unknown"})`);
      }
      const response = await submitEnrollmentFingerprint({
        session_id: sessionId,
        finger_position: currentFinger.id,
        fmr_template: rdCapture.fmr,
      });
      const rows = Array.isArray(response?.data?.fingers) ? response.data.fingers : [];
      const saved = rows.find((item) => item.position === currentFinger.id);
      const success = String(saved?.status || "").toLowerCase() === "success";
      setFingerStates((prev) => ({ ...prev, [currentFinger.id]: success ? "success" : "failed" }));
      setStatusMessage(success ? `${currentFinger.label} captured.` : `${currentFinger.label} failed, retry.`);
      if (success && scanIndex < SCAN_ORDER.length - 1) {
        setScanIndex((idx) => idx + 1);
      }
    } catch (error) {
      setFingerStates((prev) => ({ ...prev, [currentFinger.id]: "failed" }));
      setStatusMessage(error instanceof Error ? error.message : "Capture failed.");
    } finally {
      setScanning(false);
    }
  };

  const shell = (
    <div className="min-h-screen bg-gradient-to-b from-white via-brand-page-bg to-white px-4 py-5">
      <div className="mx-auto w-full max-w-[520px]">
        <div className="mb-4 flex items-center gap-3">
          {!embedded ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-white text-brand-text-primary"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
          ) : null}
          <div>
            <h1 className="font-heading text-xl font-semibold text-brand-text-primary">
              Fingerprint Verification
            </h1>
            <p className="font-sans text-sm text-brand-text-secondary">
              Capture 4 fingers: right thumb, right index, left thumb, left index.
            </p>
          </div>
        </div>

        <div className="rounded-[20px] border border-brand-border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-sans text-sm text-brand-text-secondary">Completed</p>
            <p className="font-sans text-sm font-semibold text-brand-green">{completedCount}/4</p>
          </div>
          <HandsDiagram fingerStates={fingerStates} activeFingerId={scanning ? currentFinger?.id : ""} />
          <div className="mt-3 space-y-2">
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
            <p className="mt-3 font-sans text-xs text-brand-text-secondary">{statusMessage}</p>
          ) : null}
          {rdChecking ? (
            <p className="mt-3 font-sans text-sm text-brand-text-secondary">Checking scanner readiness...</p>
          ) : null}
          {rdError ? <p className="mt-3 font-sans text-sm text-red-600">{rdError}</p> : null}
        </div>

        <div className="mt-6 flex items-center justify-center">
          {allDone ? (
            <button type="button" onClick={onSuccess} className="btn-capture-pill w-[240px] justify-center">
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void captureCurrent()}
              disabled={!rdReady || rdChecking || scanning}
              className="btn-capture-pill w-[240px] justify-center disabled:cursor-not-allowed disabled:opacity-45"
            >
              {scanning ? "Scanning..." : `Capture ${currentFinger?.label || "finger"}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return embedded ? <div className="min-h-0">{shell}</div> : shell;
}

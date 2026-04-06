import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// Finger scan states per finger: "idle" | "scanning" | "success" | "failed"
const FINGERS = [
  // Left hand — displayed right-to-left in UI (thumb on far left)
  { id: "L_thumb",  label: "Left thumb",  hand: "left",  x: 14, y: 68 },
  { id: "L_pinkie", label: "Left pinkie", hand: "left",  x: 31, y: 34 },
  { id: "L_index",  label: "Left index",  hand: "left",  x: 44, y: 20 },
  { id: "L_middle", label: "Middle",      hand: "left",  x: 57, y: 14 },
  { id: "L_ring",   label: "Left index",  hand: "left",  x: 68, y: 18 },
  // Right hand
  { id: "R_index",  label: "Right index", hand: "right", x: 32, y: 20 },
  { id: "R_middle", label: "Middle",      hand: "right", x: 44, y: 14 },
  { id: "R_ring",   label: "Right index", hand: "right", x: 56, y: 18 },
  { id: "R_pinkie", label: "Right pinkie",hand: "right", x: 68, y: 34 },
  { id: "R_thumb",  label: "Right thumb", hand: "right", x: 85, y: 68 },
];

const STATE_COLOR = {
  idle:    "#9ca3af",
  scanning:"#d4900a",
  success: "#155235",
  failed:  "#ef4444",
};

export default function AgentFingerprintVerification({ onSuccess, onBack }) {
  const [fingerStates, setFingerStates] = useState(
    Object.fromEntries(FINGERS.map((f) => [f.id, "idle"]))
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [failed, setFailed] = useState([]);

  const completed = Object.values(fingerStates).filter((s) => s === "success").length;
  const currentFinger = FINGERS[currentIdx];

  const startNextScan = () => {
    if (currentIdx >= FINGERS.length || scanning) return;
    setScanning(true);
    setFingerStates((p) => ({ ...p, [FINGERS[currentIdx].id]: "scanning" }));

    // Simulate scan — 90% success rate
    setTimeout(() => {
      const success = Math.random() > 0.1;
      const newState = success ? "success" : "failed";
      setFingerStates((p) => ({ ...p, [FINGERS[currentIdx].id]: newState }));
      if (!success) setFailed((p) => [...p, FINGERS[currentIdx].id]);
      setCurrentIdx((i) => i + 1);
      setScanning(false);
    }, 1200);
  };

  const retryFailed = () => {
    // Reset failed fingers and rescan from first failed
    const firstFailedIdx = FINGERS.findIndex((f) => failed.includes(f.id));
    setFingerStates((p) => {
      const next = { ...p };
      failed.forEach((id) => { next[id] = "idle"; });
      return next;
    });
    setFailed([]);
    setCurrentIdx(firstFailedIdx >= 0 ? firstFailedIdx : 0);
  };

  const allDone = currentIdx >= FINGERS.length;
  const canContinue = allDone && failed.length === 0;

  // Status label
  const statusLabel = scanning
    ? `Scanning ${currentFinger?.label}…`
    : allDone
    ? failed.length > 0 ? `${failed.length} scan(s) failed — retry below` : "All scans complete!"
    : currentFinger
    ? `Ready to scan ${currentFinger.label} — tap Scan`
    : "";

  // Legend items
  const LEGEND = [
    { color: STATE_COLOR.idle,    label: "Fingerprint not scanned yet" },
    { color: STATE_COLOR.success, label: "Fingerprint scan successful" },
    { color: STATE_COLOR.failed,  label: "Fingerprint scan failed" },
  ];

  return (
    <div className="page-container bg-brand-bg-page flex flex-col">
      <div className="flex-1 px-4 pt-5 pb-36 overflow-y-auto scrollbar-hide">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-5">
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>

        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-1">
          Fingerprint verification
        </h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-5">
          Scan each finger to complete identity verification
        </p>

        {/* Status guide */}
        <div className="mb-5">
          <p className="font-sans text-sm font-semibold text-brand-text-primary mb-2">
            Fingerprint scan status guide
          </p>
          <div className="space-y-2">
            {LEGEND.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <FingerprintIcon color={color} size={20} />
                <span className="font-sans text-sm text-brand-text-primary">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hands diagram */}
        <div className="bg-white rounded-2xl p-4 mb-5">
          <HandsDiagram fingerStates={fingerStates} activeFingerId={scanning ? currentFinger?.id : null} />
        </div>

        {/* Scanning status */}
        <div className="text-center mb-4">
          <p className="font-display font-bold text-lg text-brand-text-primary">
            {scanning ? `Scanning ${currentFinger?.label}…` : allDone ? (failed.length > 0 ? "Partial scan complete" : "All scans complete!") : `Next: ${currentFinger?.label}`}
          </p>
          {scanning && (
            <p className="font-sans text-sm text-brand-text-secondary mt-1">Hold still</p>
          )}
        </div>

        {/* Progress counter */}
        <div className="flex items-center justify-center gap-2 bg-white rounded-2xl py-3 px-5">
          <FingerprintIcon color={STATE_COLOR.success} size={20} />
          <span className="font-sans text-sm text-brand-text-primary">
            Completed Scans :{" "}
            <span className="font-semibold text-brand-green">{completed}/{FINGERS.length}</span>
          </span>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 bg-white pt-3 space-y-3">
        {!allDone ? (
          <button
            onClick={startNextScan}
            disabled={scanning}
            className="btn-primary disabled:opacity-50"
          >
            {scanning ? "Scanning..." : `Scan ${currentFinger?.label}`}
          </button>
        ) : canContinue ? (
          <button onClick={onSuccess} className="btn-primary">
            Continue
          </button>
        ) : (
          <button onClick={onSuccess} className="btn-primary">
            Continue ({completed}/{FINGERS.length} scanned)
          </button>
        )}

        {(allDone && failed.length > 0) && (
          <button
            onClick={retryFailed}
            className="w-full text-center text-brand-green font-sans font-semibold text-sm py-2"
          >
            Retry Failed Scans
          </button>
        )}
      </div>
    </div>
  );
}

// ── Fingerprint SVG icon ───────────────────────────────────
function FingerprintIcon({ color = "#9ca3af", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38.78 4.58 2.1 6.35" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 6c-1.66 0-3 1.34-3 3 0 1.54.58 2.94 1.53 4" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12 10c-.55 0-1 .45-1 1 0 3 1.5 5.5 1.5 5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M15 9c0-1.66-1.34-3-3-3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M17 9c0-2.76-2.24-5-5-5S7 6.24 7 9c0 1.78.58 3.42 1.55 4.76" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M19 9c0-3.87-3.13-7-7-7S5 5.13 5 9" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

// ── Hands diagram SVG ──────────────────────────────────────
function HandsDiagram({ fingerStates, activeFingerId }) {
  // Simplified hand outline as SVG paths
  const fingerDots = [
    // Left hand fingers (% of viewBox width)
    { id: "L_thumb",  cx: "10%",  cy: "72%" },
    { id: "L_pinkie", cx: "25%",  cy: "36%" },
    { id: "L_index",  cx: "36%",  cy: "22%" },
    { id: "L_middle", cx: "46%",  cy: "16%" },
    { id: "L_ring",   cx: "55%",  cy: "20%" },
    // Right hand fingers
    { id: "R_index",  cx: "63%",  cy: "22%" },
    { id: "R_middle", cx: "73%",  cy: "16%" },
    { id: "R_ring",   cx: "83%",  cy: "20%" },
    { id: "R_pinkie", cx: "90%",  cy: "36%" },
    { id: "R_thumb",  cx: "95%",  cy: "72%" },
  ];

  return (
    <div className="relative w-full" style={{ paddingBottom: "55%" }}>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Hand outline placeholder */}
        <svg viewBox="0 0 400 220" className="w-full h-full" fill="none">
          {/* Left hand outline */}
          <path d="M30 200 Q20 160 25 120 Q22 80 35 50 Q42 30 52 28 Q62 26 65 40 Q68 20 78 18 Q88 16 90 32 Q94 14 104 14 Q114 14 114 32 Q118 16 128 16 Q138 16 138 35 L138 120 Q140 140 145 155 Q150 170 145 195 Z" stroke="#d1d5db" strokeWidth="1.5" fill="#f9fafb"/>
          {/* Right hand outline */}
          <path d="M370 200 Q380 160 375 120 Q378 80 365 50 Q358 30 348 28 Q338 26 335 40 Q332 20 322 18 Q312 16 310 32 Q306 14 296 14 Q286 14 286 32 Q282 16 272 16 Q262 16 262 35 L262 120 Q260 140 255 155 Q250 170 255 195 Z" stroke="#d1d5db" strokeWidth="1.5" fill="#f9fafb"/>
        </svg>

        {/* Finger indicator dots */}
        <div className="absolute inset-0">
          {fingerDots.map(({ id, cx, cy }) => {
            const state = fingerStates[id] || "idle";
            const isActive = activeFingerId === id;
            const color = isActive ? STATE_COLOR.scanning : STATE_COLOR[state];
            return (
              <div
                key={id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: cx, top: cy }}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isActive ? "scale-125" : ""}`}
                  style={{ backgroundColor: color + "33", border: `2px solid ${color}` }}
                >
                  {state === "success" && (
                    <svg viewBox="0 0 12 12" className="w-3 h-3">
                      <polyline points="2,6 5,9 10,3" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {state === "failed" && (
                    <svg viewBox="0 0 12 12" className="w-3 h-3">
                      <line x1="3" y1="3" x2="9" y2="9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                      <line x1="9" y1="3" x2="3" y2="9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                  {isActive && (
                    <div className="absolute w-5 h-5 rounded-full animate-ping" style={{ backgroundColor: color + "44" }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

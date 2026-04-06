import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// ── Scan order (Right Thumb first, as shown in RF05) ───────
const SCAN_ORDER = [
  { id: "R_thumb",  label: "Right Thumb"   },
  { id: "R_index",  label: "Right Index"   },
  { id: "R_middle", label: "Right Middle"  },
  { id: "R_ring",   label: "Right Ring"    },
  { id: "R_pinkie", label: "Right Pinkie"  },
  { id: "L_index",  label: "Left Index"    },
  { id: "L_middle", label: "Left Middle"   },
  { id: "L_ring",   label: "Left Ring"     },
  { id: "L_pinkie", label: "Left Pinkie"   },
  { id: "L_thumb",  label: "Left Thumb"    },
];

// Fingertip icon center + label position in SVG viewBox "0 -22 360 242"
// Hands: left hand thumb on far left, right hand thumb on far right
// Finger layout (left to right in image):
//   L_thumb | L_pinkie L_ring L_middle L_index | [gap] | R_index R_middle R_ring R_pinkie | R_thumb
const FPOS = {
  L_thumb:  { cx: 11,  cy: 134, lx: 1,   ly: 120, la: "start",  dispLabel: "Left thumb"    },
  L_pinkie: { cx: 56,  cy: 38,  lx: 56,  ly: 14,  la: "middle", dispLabel: "Left pinkie"   },
  L_ring:   { cx: 76,  cy: 24,  lx: 76,  ly: 0,   la: "middle", dispLabel: "Left index"    },
  L_middle: { cx: 96,  cy: 16,  lx: 96,  ly: -8,  la: "middle", dispLabel: "Middle finger" },
  L_index:  { cx: 116, cy: 24,  lx: 116, ly: 0,   la: "middle", dispLabel: "Left index"    },
  R_index:  { cx: 244, cy: 24,  lx: 244, ly: 0,   la: "middle", dispLabel: "Right index"   },
  R_middle: { cx: 264, cy: 16,  lx: 264, ly: -8,  la: "middle", dispLabel: "Middle finger" },
  R_ring:   { cx: 284, cy: 24,  lx: 284, ly: 0,   la: "middle", dispLabel: "Right index"   },
  R_pinkie: { cx: 304, cy: 38,  lx: 304, ly: 14,  la: "middle", dispLabel: "Right pinkie"  },
  R_thumb:  { cx: 349, cy: 134, lx: 359, ly: 120, la: "end",    dispLabel: "Right thumb"   },
};

const STATE_COLORS = {
  idle:     "#9ca3af",
  scanning: "#d4900a",
  success:  "#155235",
  failed:   "#ef4444",
};

// ── Fingerprint swirl icon (concentric arc pattern) ────────
function FPSwirl({ cx, cy, r = 10, state = "idle", isActive = false }) {
  const color = STATE_COLORS[isActive ? "scanning" : state];
  const s = r / 10;

  return (
    <g>
      {/* Filled disc for active/scanning amber state */}
      {isActive && (
        <circle cx={cx} cy={cy} r={r + 2} fill="#d4900a22" />
      )}
      {/* Outer border circle */}
      <circle
        cx={cx} cy={cy} r={r}
        fill={isActive ? "#d4900a18" : state === "success" ? "#15523318" : state === "failed" ? "#ef444418" : "#9ca3af10"}
        stroke={color}
        strokeWidth="1.4"
      />
      {/* Fingerprint ridge arcs — concentric semicircular arcs */}
      <path
        d={`M${cx - 3.5 * s},${cy + 2 * s} Q${cx - 3.5 * s},${cy - 4.5 * s} ${cx},${cy - 4.5 * s} Q${cx + 3.5 * s},${cy - 4.5 * s} ${cx + 3.5 * s},${cy + 2 * s}`}
        stroke={color} strokeWidth="1" fill="none" strokeLinecap="round"
      />
      <path
        d={`M${cx - 6 * s},${cy + 2 * s} Q${cx - 6 * s},${cy - 7 * s} ${cx},${cy - 7 * s} Q${cx + 6 * s},${cy - 7 * s} ${cx + 6 * s},${cy + 2 * s}`}
        stroke={color} strokeWidth="1" fill="none" strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={0.8 * s} fill={color} />

      {/* Pulse ring for active state */}
      {isActive && (
        <circle cx={cx} cy={cy} r={r + 1} fill="none" stroke="#d4900a" strokeWidth="1.5">
          <animate attributeName="r" values={`${r};${r + 6}`} dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
}

// ── Both hands SVG diagram ─────────────────────────────────
function HandsDiagram({ fingerStates, activeId }) {
  const H = "#e5e7eb"; // hand stroke color
  const F = "white";   // hand fill

  return (
    <svg
      viewBox="0 -22 360 242"
      className="w-full"
      style={{ maxHeight: 230 }}
      aria-hidden="true"
    >
      {/* ── LEFT HAND ──────────────────────────────── */}
      {/* Fingers (pinkie→index from left to right) */}
      <rect x="46" y="26"  width="20" height="80" rx="10" fill={F} stroke={H} strokeWidth="1.5"/>
      <rect x="66" y="12"  width="20" height="94" rx="10" fill={F} stroke={H} strokeWidth="1.5"/>
      <rect x="86" y="4"   width="20" height="102" rx="10" fill={F} stroke={H} strokeWidth="1.5"/>
      <rect x="106" y="12" width="20" height="94" rx="10" fill={F} stroke={H} strokeWidth="1.5"/>
      {/* Palm */}
      <rect x="38" y="104" width="98" height="76" rx="18" fill={F} stroke={H} strokeWidth="1.5"/>
      {/* Thumb — horizontal pill rotated outward to the left */}
      <rect x="2" y="120" width="46" height="18" rx="9" fill={F} stroke={H} strokeWidth="1.5"
        transform="rotate(-22 25 129)"/>
      {/* Knuckle lines */}
      <line x1="56"  y1="106" x2="56"  y2="100" stroke={H} strokeWidth="1"/>
      <line x1="76"  y1="106" x2="76"  y2="100" stroke={H} strokeWidth="1"/>
      <line x1="96"  y1="106" x2="96"  y2="100" stroke={H} strokeWidth="1"/>
      <line x1="116" y1="106" x2="116" y2="100" stroke={H} strokeWidth="1"/>
      {/* Finger crease lines */}
      <line x1="46" y1="66" x2="66" y2="66" stroke={H} strokeWidth="0.8" strokeDasharray="2,3"/>
      <line x1="66" y1="54" x2="86" y2="54" stroke={H} strokeWidth="0.8" strokeDasharray="2,3"/>
      <line x1="86" y1="46" x2="106" y2="46" stroke={H} strokeWidth="0.8" strokeDasharray="2,3"/>
      <line x1="106" y1="54" x2="126" y2="54" stroke={H} strokeWidth="0.8" strokeDasharray="2,3"/>

      {/* ── RIGHT HAND ─────────────────────────────── */}
      {/* Fingers (index→pinkie from left to right) */}
      <rect x="234" y="12"  width="20" height="94" rx="10" fill={F} stroke={H} strokeWidth="1.5"/>
      <rect x="254" y="4"   width="20" height="102" rx="10" fill={F} stroke={H} strokeWidth="1.5"/>
      <rect x="274" y="12"  width="20" height="94" rx="10" fill={F} stroke={H} strokeWidth="1.5"/>
      <rect x="294" y="26"  width="20" height="80" rx="10" fill={F} stroke={H} strokeWidth="1.5"/>
      {/* Palm */}
      <rect x="224" y="104" width="98" height="76" rx="18" fill={F} stroke={H} strokeWidth="1.5"/>
      {/* Thumb — rotated outward to the right */}
      <rect x="312" y="120" width="46" height="18" rx="9" fill={F} stroke={H} strokeWidth="1.5"
        transform="rotate(22 335 129)"/>
      {/* Knuckle lines */}
      <line x1="244" y1="106" x2="244" y2="100" stroke={H} strokeWidth="1"/>
      <line x1="264" y1="106" x2="264" y2="100" stroke={H} strokeWidth="1"/>
      <line x1="284" y1="106" x2="284" y2="100" stroke={H} strokeWidth="1"/>
      <line x1="304" y1="106" x2="304" y2="100" stroke={H} strokeWidth="1"/>
      {/* Finger crease lines */}
      <line x1="234" y1="54" x2="254" y2="54" stroke={H} strokeWidth="0.8" strokeDasharray="2,3"/>
      <line x1="254" y1="46" x2="274" y2="46" stroke={H} strokeWidth="0.8" strokeDasharray="2,3"/>
      <line x1="274" y1="54" x2="294" y2="54" stroke={H} strokeWidth="0.8" strokeDasharray="2,3"/>
      <line x1="294" y1="66" x2="314" y2="66" stroke={H} strokeWidth="0.8" strokeDasharray="2,3"/>

      {/* ── FINGERPRINT ICONS + LABELS ─────────────── */}
      {Object.entries(FPOS).map(([id, pos]) => {
        const state  = fingerStates[id] || "idle";
        const isActive = activeId === id;

        return (
          <g key={id}>
            {/* Float label */}
            <text
              x={pos.lx} y={pos.ly}
              textAnchor={pos.la}
              fontSize="7.5"
              fill="#6b7280"
              fontFamily="sans-serif"
            >
              {pos.dispLabel}
            </text>

            {/* Fingerprint swirl icon */}
            <FPSwirl cx={pos.cx} cy={pos.cy} r={10} state={state} isActive={isActive} />

            {/* Success tick */}
            {state === "success" && !isActive && (
              <g>
                <circle cx={pos.cx + 7} cy={pos.cy - 7} r={5} fill="#155235"/>
                <polyline
                  points={`${pos.cx + 4.5},${pos.cy - 7} ${pos.cx + 6.5},${pos.cy - 5} ${pos.cx + 9.5},${pos.cy - 9}`}
                  stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"
                />
              </g>
            )}

            {/* Failed X */}
            {state === "failed" && !isActive && (
              <g>
                <circle cx={pos.cx + 7} cy={pos.cy - 7} r={5} fill="#ef4444"/>
                <line x1={pos.cx + 4.5} y1={pos.cy - 9.5} x2={pos.cx + 9.5} y2={pos.cy - 4.5}
                  stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1={pos.cx + 9.5} y1={pos.cy - 9.5} x2={pos.cx + 4.5} y2={pos.cy - 4.5}
                  stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
              </g>
            )}

            {/* "Scanning" badge on active finger */}
            {isActive && (() => {
              // Keep badge inside viewBox (width 360)
              const bw = 50;
              const bx = Math.min(pos.cx + 6, 360 - bw - 2);
              const by = pos.cy - 22;
              return (
                <g>
                  <rect x={bx} y={by} width={bw} height={16} rx={8} fill="#155235"/>
                  <text x={bx + bw / 2} y={by + 11} textAnchor="middle"
                    fontSize="8.5" fill="white" fontFamily="sans-serif" fontWeight="600">
                    Scanning
                  </text>
                </g>
              );
            })()}
          </g>
        );
      })}
    </svg>
  );
}

// ── Fingerprint icon for legend + counter ──────────────────
function FPLegendIcon({ color, size = 20 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 1;
  const s = r / 9;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill={`${color}18`} stroke={color} strokeWidth="1.5"/>
      <path d={`M${cx-3*s},${cy+2*s} Q${cx-3*s},${cy-4*s} ${cx},${cy-4*s} Q${cx+3*s},${cy-4*s} ${cx+3*s},${cy+2*s}`}
        stroke={color} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d={`M${cx-5.5*s},${cy+2*s} Q${cx-5.5*s},${cy-6.5*s} ${cx},${cy-6.5*s} Q${cx+5.5*s},${cy-6.5*s} ${cx+5.5*s},${cy+2*s}`}
        stroke={color} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r={0.8*s} fill={color}/>
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────
export default function AgentFingerprintVerification({ onSuccess, onBack }) {
  const [fingerStates, setFingerStates] = useState(
    Object.fromEntries(SCAN_ORDER.map((f) => [f.id, "idle"]))
  );
  const [currentIdx, setCurrentIdx] = useState(null); // null = not started
  const [scanning, setScanning]     = useState(false);
  const [failedIds, setFailedIds]   = useState([]);
  const [allDone, setAllDone]       = useState(false);

  const completed = Object.values(fingerStates).filter((s) => s === "success").length;
  const current   = currentIdx !== null ? SCAN_ORDER[currentIdx] : null;

  // Auto-scan: advances through all fingers automatically
  const beginScan = () => {
    setCurrentIdx(0);
  };

  useEffect(() => {
    if (currentIdx === null || scanning) return;
    if (currentIdx >= SCAN_ORDER.length) {
      setAllDone(true);
      return;
    }

    const finger = SCAN_ORDER[currentIdx];
    setScanning(true);
    setFingerStates((p) => ({ ...p, [finger.id]: "scanning" }));

    const delay = 1100 + Math.random() * 400; // 1.1s–1.5s per finger
    const t = setTimeout(() => {
      const ok = Math.random() > 0.12; // ~88% success
      const newState = ok ? "success" : "failed";
      setFingerStates((p) => ({ ...p, [finger.id]: newState }));
      if (!ok) setFailedIds((p) => [...p, finger.id]);
      setCurrentIdx((i) => i + 1);
      setScanning(false);
    }, delay);

    return () => clearTimeout(t);
  }, [currentIdx, scanning]);

  const retryFailed = () => {
    const firstFailedScanIdx = SCAN_ORDER.findIndex((f) => failedIds.includes(f.id));
    setFingerStates((p) => {
      const next = { ...p };
      failedIds.forEach((id) => { next[id] = "idle"; });
      return next;
    });
    setFailedIds([]);
    setAllDone(false);
    setCurrentIdx(firstFailedScanIdx >= 0 ? firstFailedScanIdx : 0);
  };

  // Status text
  const statusMain = scanning && current
    ? `Scanning ${current.label}.....`
    : allDone
      ? failedIds.length > 0 ? "Scan complete — some failed" : "All scans complete!"
      : current
        ? `Ready: ${current.label}`
        : "Tap to begin scanning";

  const statusSub = scanning ? "Hold still" : allDone && failedIds.length === 0 ? "Tap Continue to proceed" : "";

  // Continue button appearance based on progress
  const continueActive = allDone && failedIds.length === 0;
  const continuePartial = allDone && failedIds.length > 0;

  const LEGEND = [
    { color: STATE_COLORS.idle,    text: "Fingerprint not scanned yet" },
    { color: STATE_COLORS.success, text: "Fingerprint scan succesful" },
    { color: STATE_COLORS.failed,  text: "Fingerprint scan failed"    },
  ];

  return (
    <div className="page-container">
      <div className="flex-1 px-4 pt-5 pb-40 overflow-y-auto scrollbar-hide">
        {/* Back */}
        <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-5">
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>

        {/* Title */}
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
            {LEGEND.map(({ color, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <FPLegendIcon color={color} size={20} />
                <span className="font-sans text-sm text-brand-text-primary">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hands diagram */}
        <div className="mb-4 px-1">
          <HandsDiagram
            fingerStates={fingerStates}
            activeId={scanning && current ? current.id : null}
          />
        </div>

        {/* Scanning status text */}
        <div className="text-center mb-4">
          <p className="font-display font-semibold text-lg text-brand-text-primary">
            {statusMain}
          </p>
          {statusSub && (
            <p className="font-sans text-sm text-brand-text-secondary mt-1">{statusSub}</p>
          )}
        </div>

        {/* Completed scans counter pill */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white rounded-2xl px-5 py-3 shadow-sm border border-brand-border">
            <FPLegendIcon color={STATE_COLORS.success} size={18} />
            <span className="font-sans text-sm text-brand-text-primary">
              Completed Scans :{" "}
              <span className="font-semibold text-brand-green">{completed}/10</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-6 bg-white pt-3 space-y-3">
        {currentIdx === null ? (
          /* Not started yet — show Begin Scan */
          <button onClick={beginScan} className="btn-primary">
            Begin Fingerprint Scan
          </button>
        ) : (
          /* Scanning in progress or done */
          <button
            onClick={onSuccess}
            disabled={!allDone}
            className={`w-full font-display font-semibold text-base py-4 px-6 rounded-3xl transition-all active:scale-95 ${
              continueActive
                ? "bg-brand-green text-white"
                : continuePartial
                ? "bg-brand-green/70 text-white"
                : "bg-[#8aada4] text-white cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        )}

        {/* Retry link */}
        {allDone && failedIds.length > 0 && (
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

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

// Facial states:
// idle    → waiting, show Capture button
// scanning → animated scanning overlay
// success  → green tick, show "Verification successful"

export default function AgentFacialVerification({ onSuccess, onBack }) {
  const [status, setStatus] = useState("idle"); // idle | scanning | success

  const handleCapture = () => {
    setStatus("scanning");
    // Simulate camera processing for 2 seconds then succeed
    setTimeout(() => setStatus("success"), 2000);
  };

  const handleContinue = () => {
    onSuccess();
  };

  return (
    <div className="page-container bg-brand-bg-page flex flex-col">
      <div className="flex-1 px-4 pt-5 pb-32 overflow-y-auto scrollbar-hide">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-text-secondary mb-5"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>

        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-1">
          Facial Verification
        </h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-8">
          Capture face for identity verification.
        </p>

        {/* Oval camera frame */}
        <div className="flex justify-center mb-6">
          <div className="relative w-64 h-80">
            {/* Dashed green oval border */}
            <svg
              viewBox="0 0 256 320"
              className="absolute inset-0 w-full h-full"
              fill="none"
            >
              <ellipse
                cx="128"
                cy="160"
                rx="120"
                ry="152"
                stroke={status === "success" ? "#155235" : "#155235"}
                strokeWidth="2.5"
                strokeDasharray="10 7"
                className={status === "scanning" ? "animate-spin" : ""}
                style={{ transformOrigin: "128px 160px" }}
              />
            </svg>

            {/* Camera preview — placeholder face image */}
            <div className="absolute inset-3 rounded-full overflow-hidden bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80"
                alt="Camera preview"
                className="w-full h-full object-cover"
              />

              {/* Scanning overlay */}
              {status === "scanning" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                  {/* Vertical scan line animation */}
                  <div
                    className="w-full h-0.5 bg-brand-green/80"
                    style={{
                      animation: "scanLine 1.5s ease-in-out infinite alternate",
                    }}
                  />
                </div>
              )}

              {/* Success overlay */}
              {status === "success" && (
                <div className="absolute inset-0 flex items-center justify-center bg-brand-green/20">
                  <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center">
                    <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                      <polyline
                        points="6,17 13,24 26,10"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Vertical centre-line — only when idle/scanning */}
            {status !== "success" && (
              <div
                className="absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-0.5 bg-white/70"
                style={{ backgroundImage: "repeating-linear-gradient(to bottom, white 0 8px, transparent 8px 14px)" }}
              />
            )}
          </div>
        </div>

        {/* Instruction text */}
        <p className="font-sans text-center text-sm text-brand-text-primary leading-relaxed px-4">
          {status === "idle" && "Position your face within the frame and look directly at the camera"}
          {status === "scanning" && "Hold still — scanning in progress..."}
          {status === "success" && (
            <span className="text-brand-green font-semibold">
              Face verification successful ✓
            </span>
          )}
        </p>
      </div>

      {/* Bottom button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile px-4 pb-8 bg-transparent pt-3">
        {status === "success" ? (
          <button onClick={handleContinue} className="btn-primary">
            Continue
          </button>
        ) : (
          <button
            onClick={handleCapture}
            disabled={status === "scanning"}
            className="btn-primary disabled:opacity-60"
          >
            {status === "scanning" ? "Scanning..." : "Capture"}
          </button>
        )}
      </div>

      <style>{`
        @keyframes scanLine {
          from { transform: translateY(-120px); }
          to   { transform: translateY(120px); }
        }
      `}</style>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";

export default function AgentVerifyPhone() {
  const navigate = useNavigate();
  const location = useLocation();

  const [digits, setDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Individual refs — never put in a useCallback dep array
  const r0 = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const refs = [r0, r1, r2, r3];

  useEffect(() => { r0.current?.focus(); }, []);

  // Plain function (no useCallback) — avoids stale closure on refs/digits
  const handleChange = (i, e) => {
    // Strip non-digits; take only the LAST char if browser auto-filled multiple chars
    const raw = e.target.value.replace(/\D/g, "");
    const val  = raw.length > 1 ? raw[raw.length - 1] : raw.slice(0, 1);
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    // Defer focus so React finishes re-rendering first
    if (val && i < 3) setTimeout(() => refs[i + 1].current?.focus(), 0);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        // Clear current box only
        const next = [...digits]; next[i] = ""; setDigits(next);
      } else if (i > 0) {
        setTimeout(() => refs[i - 1].current?.focus(), 0);
      }
    }
  };

  // Paste: fill all 4 boxes at once
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const next = ["", "", "", ""];
    pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
    setDigits(next);
    const last = Math.min(pasted.length, 3);
    setTimeout(() => refs[last].current?.focus(), 0);
  };

  const handleContinue = async () => {
    const otp = digits.join("");
    if (otp.length < 4) { setError("Please enter the complete 4-digit code."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (otp === "1234") {
      sessionStorage.setItem("hcx_agent_auth", JSON.stringify({ agentId: "AGT-001" }));
      navigate("/agent/home");
    } else {
      setError("Incorrect code. Try 1234 for demo.");
      setDigits(["", "", "", ""]);
      setTimeout(() => r0.current?.focus(), 0);
    }
    setLoading(false);
  };

  const OtpBody = (
    <>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={d}
            autoComplete="one-time-code"
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className={`w-full h-16 text-center text-2xl font-bold font-display bg-white border-2
              rounded-2xl focus:outline-none transition-colors
              ${d ? "border-brand-green text-brand-green" : "border-brand-border"}
              focus:border-brand-green`}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
      <p className="font-sans text-sm text-brand-text-secondary">
        I did not receive a code,{" "}
        <button className="text-brand-green font-semibold">Resend Code</button>
      </p>
      <p className="font-sans text-xs text-brand-text-muted mt-2">
        Demo OTP: <strong>1234</strong>
      </p>
    </>
  );

  return (
    <>
      <div className="page-white flex flex-col md:hidden">
        <div className="flex-1 px-5 pt-5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-text-secondary mb-6">
            <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
          </button>
          <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">
            Verify Phone number
          </h1>
          <p className="font-sans text-sm text-brand-text-secondary mb-8">
            Enter the 4-digit code we sent to your registered phone number
          </p>
          {OtpBody}
        </div>
        <div className="px-5 pb-8 space-y-3">
          <button
            onClick={handleContinue}
            disabled={loading || digits.join("").length < 4}
            className="btn-primary"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full text-center text-brand-green font-sans text-sm font-medium py-2"
          >
            Edit phone number
          </button>
        </div>
      </div>

      <AgentAuthDesktopLayout
        title="Verify Phone number"
        subtitle="Enter the 4-digit code we sent to your registered phone number"
        actions={
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              disabled={loading || digits.join("").length < 4}
              className="btn-primary"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full py-4 rounded-3xl bg-gray-100 text-brand-green font-sans text-xl font-medium"
            >
              Edit phone number
            </button>
          </div>
        }
      >
        {OtpBody}
      </AgentAuthDesktopLayout>
    </>
  );
}

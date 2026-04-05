import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AgentVerifyPhone() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || "register";

  const [digits, setDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const r0 = useRef(null); const r1 = useRef(null);
  const r2 = useRef(null); const r3 = useRef(null);
  const refs = [r0, r1, r2, r3];

  useEffect(() => { r0.current?.focus(); }, []);

  const handleChange = useCallback((i, val) => {
    if (!/^\d?$/.test(val)) return;
    setDigits((p) => { const n = [...p]; n[i] = val; return n; });
    setError("");
    if (val && i < 3) refs[i + 1].current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = useCallback((i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

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
      r0.current?.focus();
    }
    setLoading(false);
  };

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-text-secondary mb-6">
          <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Verify Phone number</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-8">
          Enter the 4-digit code we sent to your registered phone number
        </p>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {digits.map((d, i) => (
            <input key={i} ref={refs[i]} type="tel" inputMode="numeric" maxLength={1} value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-full h-16 text-center text-2xl font-bold font-display bg-white border-2 rounded-2xl focus:outline-none transition-colors ${d ? "border-brand-green text-brand-green" : "border-brand-border"} focus:border-brand-green`}
            />
          ))}
        </div>
        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
        <p className="font-sans text-sm text-brand-text-secondary">
          I did not receive a code,{" "}
          <button className="text-brand-green font-semibold">Resend Code</button>
        </p>
        <p className="font-sans text-xs text-brand-text-muted mt-2">Demo OTP: <strong>1234</strong></p>
      </div>
      <div className="px-5 pb-8 space-y-3">
        <button onClick={handleContinue} disabled={loading || digits.join("").length < 4} className="btn-primary">
          {loading ? "Verifying..." : "Continue"}
        </button>
        <button onClick={() => navigate(-1)}
          className="w-full text-center text-brand-green font-sans text-sm font-medium py-2">
          Edit phone number
        </button>
      </div>
    </div>
  );
}

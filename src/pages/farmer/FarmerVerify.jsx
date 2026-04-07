import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, ArrowLeft } from "lucide-react";
import FarmerAuthDesktopLayout from "../../components/farmer/FarmerAuthDesktopLayout";
import FarmerOnboarding from "../../components/farmer/FarmerOnboarding";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { sendOtp, verifyOtp, formatPhoneForApi } from "../../services/cropexApi";
import { CropexHttpError } from "../../services/cropexHttp";

// ── PHONE step (mobile + desktop) — one input tree; avoids remount + double-input ref bugs on mobile ──
function PhoneStep({ onSubmit, onBack }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (phone.trim().length < 10) { setError("Please enter a valid phone number."); return; }
    setError(""); setLoading(true);
    try {
      await sendOtp(formatPhoneForApi(phone));
      onSubmit(phone.trim());
    } catch (e) {
      const msg = e instanceof CropexHttpError ? e.message : "Could not send code. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const phoneField = (
    <div className="flex flex-col gap-1.5 mb-6">
      <label className="font-sans text-sm font-medium text-brand-text-primary">Phone Number</label>
      <div className={`flex items-center bg-white border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${error ? "border-red-400" : "border-brand-border"}`}>
        <Smartphone size={18} className="text-brand-text-muted shrink-0" />
        <div className="w-px h-5 bg-brand-border shrink-0" />
        <span className="text-sm text-brand-text-secondary shrink-0">+234</span>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handle()}
          placeholder="Input your phone number here"
          className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  if (isDesktop) {
    return (
      <FarmerAuthDesktopLayout
        title="Login to your farmer profile"
        heroImage="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80"
        actions={
          <div className="space-y-3">
            <button type="button" onClick={handle} disabled={loading} className="btn-primary">
              {loading ? "Checking..." : "Continue"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 rounded-2xl bg-gray-50 text-brand-text-secondary font-sans text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              I do not have an account
            </button>
          </div>
        }
      >
        {phoneField}
      </FarmerAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-10">
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-8 leading-tight">
          Login to your farmer profile
        </h1>
        {phoneField}
      </div>
      <div className="px-5 pb-8 space-y-3">
        <button type="button" onClick={handle} disabled={loading} className="btn-primary">
          {loading ? "Checking..." : "Continue"}
        </button>
        <button type="button" onClick={onBack} className="w-full text-center font-sans text-sm text-brand-text-secondary py-2">
          I do not have an account
        </button>
      </div>
    </div>
  );
}

// ── OTP step (mobile + desktop) — single OTP row in DOM so refs + focus stay on the visible inputs ──
function OTPStep({ phone, onSuccess, onBack }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const r0 = useRef(null); const r1 = useRef(null);
  const r2 = useRef(null); const r3 = useRef(null);
  const refs = [r0, r1, r2, r3];

  useEffect(() => { r0.current?.focus(); }, []);

  const handleChange = (i, e) => {
    const raw = e.target.value.replace(/\D/g, "");
    // Take only the last character typed (handles paste and auto-fill)
    const val = raw.length > 1 ? raw[raw.length - 1] : raw;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    if (val && i < 3) {
      // setTimeout 0 ensures focus happens after React re-render
      setTimeout(() => refs[i + 1].current?.focus(), 0);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        // Clear current box
        const next = [...digits];
        next[i] = "";
        setDigits(next);
      } else if (i > 0) {
        // Move to previous box
        setTimeout(() => refs[i - 1].current?.focus(), 0);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const next = ["", "", "", ""];
    pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
    setDigits(next);
    const lastIdx = Math.min(pasted.length, 3);
    setTimeout(() => refs[lastIdx].current?.focus(), 0);
  };

  const handleLogin = async () => {
    const otp = digits.join("");
    if (otp.length < 4) { setError("Enter the complete 4-digit code."); return; }
    setLoading(true);
    setError("");
    try {
      await verifyOtp(formatPhoneForApi(phone), otp);
      try {
        sessionStorage.setItem(
          "hcx_farmer_auth",
          JSON.stringify({ phone: formatPhoneForApi(phone), verified: true })
        );
      } catch { /* ignore */ }
      onSuccess();
    } catch (e) {
      const msg = e instanceof CropexHttpError ? e.message : "Invalid or expired code.";
      setError(msg);
      setDigits(["", "", "", ""]);
      r0.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const otpGrid = (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          autoComplete="one-time-code"
          className={`w-full h-16 text-center text-2xl font-bold font-display bg-white border-2 rounded-2xl focus:outline-none transition-colors ${d ? "border-brand-green text-brand-green" : "border-brand-border"} focus:border-brand-green`}
        />
      ))}
    </div>
  );

  const otpFooter = (
    <>
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
      <p className="font-sans text-sm text-brand-text-secondary mb-1">
        I did not receive a code,{" "}
        <button type="button" className="text-brand-green font-semibold">Resend Code</button>
      </p>
      <p className="font-sans text-xs text-brand-text-muted mb-0 md:mb-6">Use the code sent to your phone.</p>
    </>
  );

  if (isDesktop) {
    return (
      <FarmerAuthDesktopLayout
        title="Enter 4-Digit code"
        subtitle="Enter the 4-digit code we sent to your registered phone number"
        heroImage="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1400&q=80"
        heroTitle="Your Digital Identity"
        heroSub="One verified ID that proves you're a registered farmer and unlocks access to services."
        actions={
          <div className="space-y-3">
            <button type="button" onClick={handleLogin} disabled={loading || digits.join("").length < 4} className="btn-primary">
              {loading ? "Verifying..." : "Login"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 rounded-2xl bg-gray-50 text-brand-text-secondary font-sans text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
          </div>
        }
      >
        {otpGrid}
        {otpFooter}
      </FarmerAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-5">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-6">
          <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Enter 4-Digit code</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-8">
          Enter the 4-digit code we sent to your registered phone number
        </p>
        {otpGrid}
        {otpFooter}
      </div>
      <div className="px-5 pb-8 space-y-3">
        <button type="button" onClick={handleLogin} disabled={loading || digits.join("").length < 4} className="btn-primary">
          {loading ? "Verifying..." : "Login"}
        </button>
        <button type="button" onClick={onBack} className="w-full py-3.5 rounded-2xl bg-gray-50 text-brand-text-secondary font-sans text-sm font-medium">
          Back
        </button>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────
export default function FarmerVerify() {
  const navigate = useNavigate();
  const [step, setStep] = useState("onboarding");
  const [phone, setPhone] = useState("");

  if (step === "onboarding") {
    return <FarmerOnboarding onDone={() => setStep("phone")} />;
  }

  if (step === "phone") {
    return (
      <PhoneStep
        onSubmit={(p) => { setPhone(p); setStep("otp"); }}
        onBack={() => setStep("onboarding")}
      />
    );
  }

  if (step === "otp") {
    return (
      <OTPStep
        phone={phone}
        onSuccess={() => navigate("/farmer/home")}
        onBack={() => setStep("phone")}
      />
    );
  }

  return null;
}

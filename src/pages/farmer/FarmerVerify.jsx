import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, ArrowLeft } from "lucide-react";
import { farmerData } from "../../mockData/farmer";
import FarmerAuthDesktopLayout from "../../components/farmer/FarmerAuthDesktopLayout";
import FarmerOnboarding from "../../components/farmer/FarmerOnboarding";
import { useMediaQuery } from "../../hooks/useMediaQuery";

// ─────────────────────────────────────────────────────────────────────────────
// PHONE STEP
// Screen: FWD-CA-01 / 02 / 03  (left panel cycles, right panel identical)
// ─────────────────────────────────────────────────────────────────────────────
function PhoneStep({ onSubmit, onBack }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (phone.trim().length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    onSubmit(phone.trim());
    setLoading(false);
  };

  // ── Phone input — shared markup used in both mobile and desktop ──
  const phoneField = (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-sm font-medium text-brand-text-primary">
        Phone Number
      </label>
      {/*
        Container: thin gray border, moderate rounding — matches design exactly.
        Inside: phone icon | divider | +234 | divider | text field
      */}
      <div
        className={`flex items-center bg-white border rounded-xl px-4 py-3.5 gap-3
          focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent
          transition-all ${error ? "border-red-400" : "border-gray-300"}`}
      >
        <Smartphone size={18} className="text-brand-text-muted shrink-0" />
        <div className="w-px h-5 bg-gray-300 shrink-0" />
        <span className="font-sans text-sm text-brand-text-secondary shrink-0 select-none">
          +234
        </span>
        <div className="w-px h-5 bg-gray-300 shrink-0" />
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handle()}
          placeholder="Input your phone number here"
          className="flex-1 bg-transparent font-sans text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
        />
      </div>
      {error && <p className="font-sans text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );

  /* ── DESKTOP ── */
  if (isDesktop) {
    return (
      <FarmerAuthDesktopLayout
        title="Login to your farmer profile"
        // No fixedImage → left panel cycles through all 3 hero images
        actions={
          <div className="space-y-3">
            {/* Continue — green pill */}
            <button
              type="button"
              onClick={handle}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Checking..." : "Continue"}
            </button>
            {/* "I do not have an account" — teal text, very light gray bg */}
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 rounded-2xl bg-gray-50 font-sans text-sm font-medium text-brand-green hover:bg-gray-100 transition-colors"
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

  /* ── MOBILE ── */
  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-10">
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-8 leading-tight">
          Login to your farmer profile
        </h1>
        {phoneField}
      </div>
      <div className="px-5 pb-8 space-y-3">
        <button
          type="button"
          onClick={handle}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Checking..." : "Continue"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full text-center font-sans text-sm text-brand-text-secondary py-2"
        >
          I do not have an account
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OTP STEP
// Screen: FWD-CA-04  (left panel FIXED on farmer-3 / corn field)
// ─────────────────────────────────────────────────────────────────────────────
function OTPStep({ phone, onSuccess, onBack }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const r0 = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const refs = [r0, r1, r2, r3];

  useEffect(() => {
    r0.current?.focus();
  }, []);

  const handleChange = (i, e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const val = raw.length > 1 ? raw[raw.length - 1] : raw;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    if (val && i < 3) {
      setTimeout(() => refs[i + 1].current?.focus(), 0);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits];
        next[i] = "";
        setDigits(next);
      } else if (i > 0) {
        setTimeout(() => refs[i - 1].current?.focus(), 0);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (!pasted) return;
    const next = ["", "", "", ""];
    pasted.split("").forEach((ch, idx) => {
      next[idx] = ch;
    });
    setDigits(next);
    setTimeout(() => refs[Math.min(pasted.length, 3)].current?.focus(), 0);
  };

  const handleLogin = async () => {
    const otp = digits.join("");
    if (otp.length < 4) {
      setError("Enter the complete 4-digit code.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (otp === "1234") {
      sessionStorage.setItem(
        "hcx_farmer_auth",
        JSON.stringify({ phone, farmerId: farmerData.id })
      );
      onSuccess();
    } else {
      setError("Incorrect code. Try 1234 for demo.");
      setDigits(["", "", "", ""]);
      setTimeout(() => r0.current?.focus(), 0);
    }
    setLoading(false);
  };

  /*
    OTP boxes: white bg, thin gray border (border), rounded-xl, h-[4.5rem].
    When a digit is filled → border turns brand-green + text brand-green.
    gap-4 between boxes. No explicit width — grid fills the container equally.
  */
  const otpGrid = (
    <div className="grid grid-cols-4 gap-4">
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
          className={`w-full h-[4.5rem] text-center text-2xl font-bold font-display
            bg-white rounded-xl focus:outline-none transition-colors
            border ${d
              ? "border-brand-green text-brand-green"
              : "border-gray-200 text-brand-text-primary"
            }
            focus:border-brand-green`}
        />
      ))}
    </div>
  );

  /* "I did not receive a code, Resend Code" row */
  const resendRow = (
    <>
      {error && (
        <p className="font-sans text-xs text-red-500 mt-3">{error}</p>
      )}
      <p className="font-sans text-sm text-brand-text-secondary mt-4">
        I did not receive a code,{" "}
        <button type="button" className="text-brand-green font-semibold">
          Resend Code
        </button>
      </p>
    </>
  );

  /* ── DESKTOP ── */
  if (isDesktop) {
    return (
      <FarmerAuthDesktopLayout
        title="Enter 4-Digit code"
        subtitle="Enter the 4-digit code we sent to your registered phone number"
        // OTP screen stays fixed on the corn-field image (farmer-3) — matches FWD-CA-04
        fixedImage="/onboarding/farmer-3.jpg"
        actions={
          <div className="space-y-3">
            {/* Login — green pill */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading || digits.join("").length < 4}
              className="btn-primary"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
            {/* Back — teal text, very light gray bg */}
            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 rounded-2xl bg-gray-50 font-sans text-sm font-medium text-brand-green hover:bg-gray-100 transition-colors"
            >
              Back
            </button>
          </div>
        }
      >
        {otpGrid}
        {resendRow}
      </FarmerAuthDesktopLayout>
    );
  }

  /* ── MOBILE ── */
  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-brand-text-secondary mb-6"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">
          Enter 4-Digit code
        </h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-8">
          Enter the 4-digit code we sent to your registered phone number
        </p>
        {otpGrid}
        {resendRow}
      </div>
      <div className="px-5 pb-8 space-y-3">
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading || digits.join("").length < 4}
          className="btn-primary"
        >
          {loading ? "Verifying..." : "Login"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3.5 rounded-2xl bg-gray-50 text-brand-text-secondary font-sans text-sm font-medium"
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function FarmerVerify() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  /*
    Desktop: start at "phone" — skip the mobile onboarding slides entirely.
    Mobile:  start at "onboarding" — shows the 3 swipe slides first.
  */
  const [step, setStep] = useState(isDesktop ? "phone" : "onboarding");
  const [phone, setPhone] = useState("");

  // "I do not have an account" on desktop goes back to role select.
  // On mobile it goes back to the onboarding slides.
  const handlePhoneBack = () => {
    if (isDesktop) navigate("/");
    else setStep("onboarding");
  };

  if (step === "onboarding") {
    return <FarmerOnboarding onDone={() => setStep("phone")} />;
  }

  if (step === "phone") {
    return (
      <PhoneStep
        onSubmit={(p) => {
          setPhone(p);
          setStep("otp");
        }}
        onBack={handlePhoneBack}
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

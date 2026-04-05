import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, ArrowLeft } from "lucide-react";
import { farmerData } from "../../mockData/farmer";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    title: "Welcome to your Farmer Profile",
    sub: "You now have a digital identity that helps you access support, loans, and better opportunities.",
  },
  {
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
    title: "Your Digital Identity",
    sub: "One verified ID that proves you're a registered farmer and unlocks access to services.",
  },
  {
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80",
    title: "Access Loans & Support",
    sub: "Use your Farmer ID to apply for loans, get farm support and connect with buyers.",
  },
];

// ── Step 1: Onboarding slides ──────────────────────────────
function OnboardingStep({ onDone }) {
  const [idx, setIdx] = useState(0);
  const touchX = useRef(null);

  const next = () => {
    if (idx < SLIDES.length - 1) setIdx((i) => i + 1);
    else onDone();
  };

  return (
    <div
      className="relative min-h-dvh w-full flex flex-col overflow-hidden bg-black"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (!touchX.current) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx < -50) next();
        else if (dx > 50 && idx > 0) setIdx((i) => i - 1);
        touchX.current = null;
      }}
    >
      <img
        src={SLIDES[idx].image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <div className="relative z-10 flex flex-col justify-end h-full px-5 pb-10">
        <h2 className="font-display font-bold text-3xl text-white leading-tight mb-2">
          {SLIDES[idx].title}
        </h2>
        <p className="font-sans text-white/75 text-sm leading-relaxed mb-8">
          {SLIDES[idx].sub}
        </p>
        {/* Dot indicators */}
        <div className="flex gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? "w-8 bg-brand-amber" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
        <button onClick={next} className="btn-primary">
          {idx < SLIDES.length - 1 ? "Next" : "Login"}
        </button>
      </div>
    </div>
  );
}

// ── Step 2: Phone login ────────────────────────────────────
function PhoneStep({ onSubmit, onBack }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (phone.trim().length < 10) { setError("Please enter a valid phone number."); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    // Mock: accept the farmer's registered phone or any 10+ digit number
    onSubmit(phone.trim());
    setLoading(false);
  };

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-10">
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-8 leading-tight">
          Login to your farmer profile
        </h1>
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="font-sans text-sm font-medium text-brand-text-primary">Phone Number</label>
          <div className={`flex items-center bg-white border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${error ? "border-red-400" : "border-brand-border"}`}>
            <Smartphone size={18} className="text-brand-text-muted shrink-0" />
            <div className="w-px h-5 bg-brand-border shrink-0" />
            <span className="text-sm text-brand-text-secondary shrink-0">+234</span>
            <input
              type="tel" inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              placeholder="Input your phone number here"
              className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
      <div className="px-5 pb-8 space-y-3">
        <button onClick={handleContinue} disabled={loading} className="btn-primary">
          {loading ? "Checking..." : "Continue"}
        </button>
        <button onClick={onBack} className="w-full text-center font-sans text-sm text-brand-text-secondary py-2">
          I do not have an account
        </button>
      </div>
    </div>
  );
}

// ── Step 3: OTP ────────────────────────────────────────────
function OTPStep({ phone, onSuccess, onBack }) {
  const navigate = useNavigate();
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

  const handleLogin = async () => {
    const otp = digits.join("");
    if (otp.length < 4) { setError("Enter the complete 4-digit code."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (otp === "1234") {
      // Store auth in sessionStorage for demo
      sessionStorage.setItem("hcx_farmer_auth", JSON.stringify({ phone, farmerId: farmerData.id }));
      onSuccess();
    } else {
      setError("Incorrect code. Please try again.");
      setDigits(["", "", "", ""]);
      r0.current?.focus();
    }
    setLoading(false);
  };

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-5">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-6">
          <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Enter 4-Digit code</h1>
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
        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
        <p className="font-sans text-sm text-brand-text-secondary">
          I did not receive a code,{" "}
          <button className="text-brand-green font-semibold">Resend Code</button>
        </p>
        <p className="font-sans text-xs text-brand-text-muted mt-3">Demo OTP: <strong>1234</strong></p>
      </div>
      <div className="px-5 pb-8 space-y-3">
        <button onClick={handleLogin} disabled={loading || digits.join("").length < 4} className="btn-primary">
          {loading ? "Verifying..." : "Login"}
        </button>
        <button onClick={onBack} className="w-full text-center font-sans text-sm text-brand-text-secondary py-2 bg-gray-50 rounded-3xl">
          Back
        </button>
      </div>
    </div>
  );
}

// ── Main export: orchestrates all 3 steps ─────────────────
export default function FarmerVerify() {
  const navigate = useNavigate();
  const [step, setStep] = useState("onboarding"); // onboarding | phone | otp
  const [phone, setPhone] = useState("");

  return (
    <div className="max-w-mobile mx-auto w-full">
      {step === "onboarding" && (
        <OnboardingStep onDone={() => setStep("phone")} />
      )}
      {step === "phone" && (
        <PhoneStep
          onSubmit={(p) => { setPhone(p); setStep("otp"); }}
          onBack={() => setStep("onboarding")}
        />
      )}
      {step === "otp" && (
        <OTPStep
          phone={phone}
          onSuccess={() => navigate("/farmer/home")}
          onBack={() => setStep("phone")}
        />
      )}
    </div>
  );
}

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
    title: "Access Loans and Support",
    sub: "Use your Farmer ID to apply for loans, get farm support and connect with buyers.",
  },
];

// Left photo panel — reused on login and OTP desktop views
function DesktopPhotoPanel({ image }) {
  return (
    <div className="relative w-[46%] shrink-0 rounded-2xl overflow-hidden bg-black min-h-[560px]">
      <img src={image} alt="Farm" className="absolute inset-0 w-full h-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-8 left-8 right-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
              <path d="M16 3 L28 10 L28 22 L16 29 L4 22 L4 10 Z" stroke="white" strokeWidth="2" fill="none"/>
              <ellipse cx="16" cy="16" rx="6" ry="8" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <div>
            <p className="font-display font-black text-white text-sm tracking-widest uppercase leading-none">HASHMAR</p>
            <p className="font-sans text-[9px] text-white/70 tracking-[0.2em] uppercase">CROPEX LIMITED</p>
          </div>
        </div>
        <h2 className="font-display font-bold text-white text-2xl leading-tight mb-2">
          Welcome to your Farmer Profile
        </h2>
        <p className="font-sans text-white/80 text-sm leading-relaxed">
          You now have a digital identity that helps you access support, loans, and better opportunities.
        </p>
      </div>
    </div>
  );
}

// ── MOBILE onboarding slides ───────────────────────────────
function MobileOnboarding({ onDone }) {
  const [idx, setIdx] = useState(0);
  const touchX = useRef(null);
  const next = () => (idx < SLIDES.length - 1 ? setIdx((i) => i + 1) : onDone());

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100dvh" }}
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
        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-10">
        <h2 className="font-display font-bold text-3xl text-white leading-tight mb-2">{SLIDES[idx].title}</h2>
        <p className="font-sans text-white/75 text-sm leading-relaxed mb-6">{SLIDES[idx].sub}</p>
        <div className="flex gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-8 bg-brand-amber" : "w-2 bg-white/40"}`} />
          ))}
        </div>
        <button onClick={next} className="btn-primary">
          {idx < SLIDES.length - 1 ? "Next" : "Login"}
        </button>
      </div>
    </div>
  );
}

// ── PHONE step (mobile + desktop) ─────────────────────────
function PhoneStep({ onSubmit, onBack }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (phone.trim().length < 10) { setError("Please enter a valid phone number."); return; }
    setError(""); setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    onSubmit(phone.trim());
    setLoading(false);
  };

  const PhoneField = () => (
    <div className="flex flex-col gap-1.5 mb-6">
      <label className="font-sans text-sm font-medium text-brand-text-primary">Phone Number</label>
      <div className={`flex items-center bg-white border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${error ? "border-red-400" : "border-brand-border"}`}>
        <Smartphone size={18} className="text-brand-text-muted shrink-0" />
        <div className="w-px h-5 bg-brand-border shrink-0" />
        <span className="text-sm text-brand-text-secondary shrink-0">+234</span>
        <input
          type="tel" inputMode="numeric" value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handle()}
          placeholder="Input your phone number here"
          className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <>
      {/* MOBILE */}
      <div className="page-white flex flex-col md:hidden">
        <div className="flex-1 px-5 pt-10">
          <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-8 leading-tight">
            Login to your farmer profile
          </h1>
          <PhoneField />
        </div>
        <div className="px-5 pb-8 space-y-3">
          <button onClick={handle} disabled={loading} className="btn-primary">
            {loading ? "Checking..." : "Continue"}
          </button>
          <button onClick={onBack} className="w-full text-center font-sans text-sm text-brand-text-secondary py-2">
            I do not have an account
          </button>
        </div>
      </div>

      {/* DESKTOP: split panel */}
      <div className="hidden md:flex min-h-screen bg-white items-center justify-center p-8">
        <div className="flex gap-10 w-full max-w-4xl">
          <DesktopPhotoPanel image="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" />
          <div className="flex-1 flex flex-col justify-center py-8">
            <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-8">
              Login to your farmer profile
            </h1>
            <PhoneField />
            <div className="space-y-3">
              <button onClick={handle} disabled={loading} className="btn-primary">
                {loading ? "Checking..." : "Continue"}
              </button>
              <button onClick={onBack} className="w-full py-3.5 rounded-2xl bg-gray-50 text-brand-text-secondary font-sans text-sm font-medium hover:bg-gray-100 transition-colors">
                I do not have an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── OTP step (mobile + desktop) ────────────────────────────
function OTPStep({ phone, onSuccess, onBack }) {
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
    await new Promise((r) => setTimeout(r, 800));
    if (otp === "1234") {
      sessionStorage.setItem("hcx_farmer_auth", JSON.stringify({ phone, farmerId: farmerData.id }));
      onSuccess();
    } else {
      setError("Incorrect code. Try 1234 for demo.");
      setDigits(["", "", "", ""]);
      r0.current?.focus();
    }
    setLoading(false);
  };

  const OTPBoxes = () => (
    <>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {digits.map((d, i) => (
          <input key={i} ref={refs[i]} type="tel" inputMode="numeric" maxLength={1} value={d}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            autoComplete="one-time-code"
            className={`w-full h-16 text-center text-2xl font-bold font-display bg-white border-2 rounded-2xl focus:outline-none transition-colors ${d ? "border-brand-green text-brand-green" : "border-brand-border"} focus:border-brand-green`}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
      <p className="font-sans text-sm text-brand-text-secondary mb-1">
        I did not receive a code,{" "}
        <button className="text-brand-green font-semibold">Resend Code</button>
      </p>
      <p className="font-sans text-xs text-brand-text-muted mb-6">Demo OTP: <strong>1234</strong></p>
    </>
  );

  return (
    <>
      {/* MOBILE */}
      <div className="page-white flex flex-col md:hidden">
        <div className="flex-1 px-5 pt-5">
          <button onClick={onBack} className="flex items-center gap-2 text-brand-text-secondary mb-6">
            <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
          </button>
          <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Enter 4-Digit code</h1>
          <p className="font-sans text-sm text-brand-text-secondary mb-8">
            Enter the 4-digit code we sent to your registered phone number
          </p>
          <OTPBoxes />
        </div>
        <div className="px-5 pb-8 space-y-3">
          <button onClick={handleLogin} disabled={loading || digits.join("").length < 4} className="btn-primary">
            {loading ? "Verifying..." : "Login"}
          </button>
          <button onClick={onBack} className="w-full py-3.5 rounded-2xl bg-gray-50 text-brand-text-secondary font-sans text-sm font-medium">
            Back
          </button>
        </div>
      </div>

      {/* DESKTOP: split panel */}
      <div className="hidden md:flex min-h-screen bg-white items-center justify-center p-8">
        <div className="flex gap-10 w-full max-w-4xl">
          <DesktopPhotoPanel image="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80" />
          <div className="flex-1 flex flex-col justify-center py-8">
            <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Enter 4-Digit code</h1>
            <p className="font-sans text-sm text-brand-text-secondary mb-10">
              Enter the 4-digit code we sent to your registered phone number
            </p>
            <OTPBoxes />
            <div className="space-y-3">
              <button onClick={handleLogin} disabled={loading || digits.join("").length < 4} className="btn-primary">
                {loading ? "Verifying..." : "Login"}
              </button>
              <button onClick={onBack} className="w-full py-3.5 rounded-2xl bg-gray-50 text-brand-text-secondary font-sans text-sm font-medium hover:bg-gray-100 transition-colors">
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main export ────────────────────────────────────────────
export default function FarmerVerify() {
  const navigate = useNavigate();
  const [step, setStep] = useState("onboarding");
  const [phone, setPhone] = useState("");

  if (step === "onboarding") {
    return (
      <>
        {/* Mobile ONLY: full-screen onboarding slides */}
        <div className="md:hidden" style={{ height: "100dvh" }}>
          <MobileOnboarding onDone={() => setStep("phone")} />
        </div>
        {/* Desktop ONLY: skip slides, go straight to login split-panel */}
        <div className="hidden md:block">
          <PhoneStep
            onSubmit={(p) => { setPhone(p); setStep("otp"); }}
            onBack={() => navigate("/")}
          />
        </div>
      </>
    );
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Role card photo images — already in /public/onboarding/
const FARMER_IMG = "/onboarding/farmer-2.jpg";
const AGENT_IMG  = "/onboarding/agent-1.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP: split panel (hidden on mobile)
// ─────────────────────────────────────────────────────────────────────────────
function DesktopRoleSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("farmer"); // 'farmer' | 'agent'

  const handleContinue = () => {
    if (selected === "farmer") navigate("/farmer/verify");
    else navigate("/agent/splash");
  };

  return (
    <div className="hidden md:flex min-h-dvh bg-white p-5 lg:p-6 gap-5 lg:gap-6">

      {/* ── LEFT: hero photo card ─────────────────────────────── */}
      <div className="relative w-[45%] shrink-0 rounded-3xl overflow-hidden">
        <img
          src="/onboarding/farmer-1.jpg"
          alt="Hashmar farmer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        {/* brand + text */}
        <div className="absolute bottom-8 left-8 right-8 lg:bottom-10 lg:left-10 lg:right-10">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI by Hashmar Cropex"
            className="h-10 w-auto object-contain object-left mb-4"
            draggable="false"
          />
          <h2 className="font-display font-bold text-[1.85rem] lg:text-[2.2rem] text-white leading-tight mb-2">
            Welcome to your Farmer Profile
          </h2>
          <p className="font-sans text-base lg:text-[1.05rem] text-white/85 leading-snug">
            You now have a digital identity that helps you access support,
            loans, and better opportunities.
          </p>
        </div>
      </div>

      {/* ── RIGHT: role selection panel ──────────────────────── */}
      <div className="flex-1 flex flex-col justify-between py-14 lg:py-16 px-6 lg:px-14 xl:px-20">

        {/* top: heading + subtitle + role cards */}
        <div className="flex flex-col items-center">
          <h1 className="font-display font-bold text-[2rem] lg:text-[2.3rem] text-brand-text-primary text-center mb-2">
            Get Started
          </h1>
          <p className="font-sans text-sm text-brand-text-secondary text-center leading-relaxed mb-10 max-w-xs">
            Tell us how you'll be using Hashmar, Tap the card that best
            describes your role
          </p>

          {/* Role cards row */}
          <div className="flex gap-4 w-full">

            {/* Farmer card */}
            <button
              type="button"
              onClick={() => setSelected("farmer")}
              className={`flex-1 rounded-xl overflow-hidden transition-all duration-200 text-left
                ${
                  selected === "farmer"
                    ? "border-2 border-brand-green shadow-md"
                    : "border border-gray-200 shadow-sm"
                }`}
            >
              {/* photo */}
              <div className="w-full h-52 lg:h-56 overflow-hidden">
                <img
                  src={FARMER_IMG}
                  alt="Farmer"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* label */}
              <div
                className={`py-3.5 text-center font-sans font-medium text-sm transition-colors
                  ${
                    selected === "farmer"
                      ? "bg-brand-green text-white"
                      : "bg-white text-brand-text-primary"
                  }`}
              >
                Farmer
              </div>
            </button>

            {/* Agent card */}
            <button
              type="button"
              onClick={() => setSelected("agent")}
              className={`flex-1 rounded-xl overflow-hidden transition-all duration-200 text-left
                ${
                  selected === "agent"
                    ? "border-2 border-brand-green shadow-md"
                    : "border border-gray-200 shadow-sm"
                }`}
            >
              {/* photo */}
              <div className="w-full h-52 lg:h-56 overflow-hidden">
                <img
                  src={AGENT_IMG}
                  alt="Agent"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* label */}
              <div
                className={`py-3.5 text-center font-sans font-medium text-sm transition-colors
                  ${
                    selected === "agent"
                      ? "bg-brand-green text-white"
                      : "bg-white text-brand-text-primary"
                  }`}
              >
                Agent
              </div>
            </button>

          </div>
        </div>

        {/* bottom: Continue button */}
        <button
          type="button"
          onClick={handleContinue}
          className="btn-primary"
        >
          Continue
        </button>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE: existing card layout (kept as-is — was already great)
// ─────────────────────────────────────────────────────────────────────────────
function MobileRoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="
      md:hidden min-h-dvh w-full flex items-center justify-center
      bg-brand-bg-page px-4 py-8
    ">
      <div className="
        w-full max-w-role
        bg-white rounded-3xl shadow-card-lg
        px-6 py-10 sm:px-10 sm:py-14
        flex flex-col items-center gap-8
      ">
        {/* Logo */}
        <img
          src="/brand/HFEI_Primary_Logo_.png"
          alt="HFEI by Hashmar Cropex Ltd"
          className="h-14 w-auto object-contain"
          draggable="false"
        />

        {/* Tagline */}
        <p className="font-sans text-base text-brand-text-secondary text-center leading-relaxed max-w-sm">
          Empowering Farmers, Enabling Growth
        </p>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="font-sans text-xs text-brand-text-muted uppercase tracking-widest">
            Select your role
          </span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        {/* Role buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/farmer/verify")}
            className="
              flex-1 flex flex-col items-center gap-3
              bg-brand-green text-white
              rounded-2xl px-6 py-6
              hover:bg-brand-green-dark active:scale-[0.97]
              transition-all duration-200 shadow-card
            "
          >
            <span className="text-4xl select-none">🌾</span>
            <div className="text-center">
              <p className="font-display font-bold text-lg leading-tight">I am a Farmer</p>
              <p className="font-sans text-white/75 text-xs mt-1 leading-snug">
                View your digital ID, farms and profile
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate("/agent/splash")}
            className="
              flex-1 flex flex-col items-center gap-3
              bg-brand-amber text-white
              rounded-2xl px-6 py-6
              hover:brightness-95 active:scale-[0.97]
              transition-all duration-200 shadow-card
            "
          >
            <span className="text-4xl select-none">🪪</span>
            <div className="text-center">
              <p className="font-display font-bold text-lg leading-tight">I am an Agent</p>
              <p className="font-sans text-white/75 text-xs mt-1 leading-snug">
                Register farmers and manage records
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="font-sans text-xs text-brand-text-muted text-center mt-2">
          Hashmar CropEx Limited · Verified Farmer Identity Platform
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT: renders one or the other based on viewport (CSS media query approach)
// ─────────────────────────────────────────────────────────────────────────────
export default function RoleSelect() {
  return (
    <>
      <MobileRoleSelect />
      <DesktopRoleSelect />
    </>
  );
}

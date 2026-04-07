import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AgentOnboarding from "../../components/agent/AgentOnboarding";
import { agentBrandSplash } from "../../mockData/agent";

export default function AgentSplash() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("brand");

  useEffect(() => {
    if (phase !== "brand") return;
    const t = setTimeout(() => setPhase("onboarding"), 2600);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "brand") {
    return (
      <div className="relative min-h-dvh w-full overflow-hidden bg-black">
        <img
          src={agentBrandSplash.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  if (phase === "onboarding") {
    return <AgentOnboarding onDone={() => setPhase("menu")} />;
  }

  return (
    <div className="relative w-full overflow-hidden min-h-dvh flex flex-col bg-white md:grid md:grid-cols-2 md:min-h-dvh md:px-6 md:py-6 lg:px-8 lg:py-8 md:gap-6 lg:gap-8 md:items-stretch">
      {/* Mobile: full-bleed hero */}
      <div className="relative md:hidden min-h-[40vh] bg-black shrink-0">
        <img
          src="/onboarding/agent-1.jpg"
          alt="Field agents supporting farmers"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex flex-col justify-end h-full min-h-[40vh] p-6 text-white">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI by Hashmar Cropex Ltd"
            className="h-12 w-auto object-contain mb-6"
            draggable="false"
          />
          <h2 className="font-display font-bold text-2xl leading-tight mb-2">Digitally Onboard Farmers</h2>
          <p className="font-sans text-sm text-white/90 max-w-md">
            Capture farmer information and biometrics to create verified digital identities that can be trusted across the platform.
          </p>
        </div>
      </div>

      {/* Desktop: ~50% column — match Create Account hero size */}
      <div className="hidden md:flex md:min-w-0 items-stretch">
        <div className="relative w-full min-h-[calc(100dvh-3rem)] rounded-3xl overflow-hidden border border-black/8 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
          <img
            src="/onboarding/agent-1.jpg"
            alt="Field agents supporting farmers"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute left-8 right-8 bottom-8 text-white">
            <img
              src="/brand/HFEI_Primary_Logo_White.png"
              alt="HFEI by Hashmar Cropex Ltd"
              className="h-12 w-auto object-contain mb-6"
              draggable="false"
            />
            <h2 className="font-display font-bold text-3xl xl:text-4xl leading-tight mb-2">Digitally Onboard Farmers</h2>
            <p className="font-sans text-base lg:text-lg text-white/90 max-w-md leading-snug">
              Capture farmer information and biometrics to create verified digital identities that can be trusted across the platform.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col items-center justify-center px-6 py-10 md:py-8 lg:py-10 md:max-w-xl md:mx-auto lg:mx-0 lg:max-w-none lg:pr-8">
        <img
          src="/brand/HFEI_Primary_Logo_.png"
          alt="HFEI by Hashmar Cropex Ltd"
          className="h-12 w-auto object-contain mb-6 md:hidden"
          draggable="false"
        />
        <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-text-primary text-center mb-2">Get Started</h1>
        <p className="font-sans text-sm text-brand-text-secondary text-center max-w-sm mb-10">
          Tell us how you&apos;ll be using Hashmar. Create a new agent account or sign in if you already have one.
        </p>
        <div className="w-full max-w-sm space-y-3">
          <button type="button" onClick={() => navigate("/agent/create-account")} className="btn-primary w-full">
            Create account
          </button>
          <button
            type="button"
            onClick={() => navigate("/agent/login")}
            className="w-full py-4 rounded-3xl bg-gray-100 text-brand-green font-sans font-semibold text-sm"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

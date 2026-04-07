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

  /* ── Brand splash ── */
  if (phase === "brand") {
    return (
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ minHeight: "100dvh" }}
      >
        <img
          src={agentBrandSplash.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  /* ── Onboarding slides ── */
  if (phase === "onboarding") {
    return <AgentOnboarding onDone={() => setPhase("menu")} />;
  }

  /* ── Get Started menu ── */
  return (
    <div className="w-full flex flex-col bg-white" style={{ minHeight: "100dvh" }}>

      {/* Hero image — mobile only */}
      <div className="relative h-[45vh] bg-black shrink-0">
        <img
          src="/onboarding/agent-1.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-x-5 bottom-6 text-white">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI"
            className="h-10 w-auto object-contain mb-4"
            draggable="false"
          />
          <h2 className="font-display font-bold text-2xl leading-tight mb-1">
            Welcome, Agent
          </h2>
          <p className="font-sans text-sm text-white/80 leading-snug">
            Register farmers and manage their digital identities.
          </p>
        </div>
      </div>

      {/* CTA content */}
      <div className="flex-1 flex flex-col justify-center px-5 py-10 w-full max-w-[480px] mx-auto">
        <img
          src="/brand/HFEI_Primary_Logo_.png"
          alt="HFEI"
          className="h-12 w-auto object-contain mx-auto mb-6"
          draggable="false"
        />
        <h1 className="font-display font-bold text-2xl text-brand-text-primary text-center mb-2">
          Get Started
        </h1>
        <p className="font-sans text-sm text-brand-text-secondary text-center leading-relaxed mb-10">
          Create a new agent account or sign in if you already have one.
        </p>
        <div className="w-full space-y-3">
          <button
            type="button"
            onClick={() => navigate("/agent/create-account")}
            className="btn-primary"
          >
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

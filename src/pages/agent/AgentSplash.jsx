import { useState, useEffect } from "react";
import AgentOnboarding from "../../components/agent/AgentOnboarding";
import { agentBrandSplash } from "../../mockData/agent";

export default function AgentSplash() {
  const [phase, setPhase] = useState("brand");

  useEffect(() => {
    if (phase !== "brand") return;
    const t = setTimeout(() => setPhase("onboarding"), 2600);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "brand") {
    return (
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ height: "100dvh" }}
      >
        <img
          src={agentBrandSplash.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  return <AgentOnboarding />;
}

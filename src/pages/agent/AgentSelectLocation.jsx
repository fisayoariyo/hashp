import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import AgentFormFeedback from "../../components/agent/AgentFormFeedback";
import { nigerianStates, nigerianLGAs } from "../../mockData/agent";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const REG_KEY = "hcx_agent_registration";

function formatPhoneForLocalStore(digits) {
  const d = String(digits || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("234")) return `+${d}`;
  if (d.startsWith("0")) return `+234${d.slice(1)}`;
  return `+234${d}`;
}

export default function AgentSelectLocation() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [loading, setLoading] = useState(false);
  const [regError, setRegError] = useState("");

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(REG_KEY)) navigate("/agent/create-account", { replace: true });
    } catch {
      navigate("/agent/create-account", { replace: true });
    }
  }, [navigate]);

  const handleContinue = async () => {
    if (!state || !lga) return;
    setLoading(true);
    setRegError("");
    try {
      const raw = sessionStorage.getItem(REG_KEY);
      const reg = raw ? JSON.parse(raw) : {};
      const pwd = reg.password || "";
      if (pwd.length < 8) {
        setRegError("Password must be at least 8 characters. Go back to create account and set your password.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem(
        REG_KEY,
        JSON.stringify({
          ...reg,
          state,
          lga,
          phone: formatPhoneForLocalStore(reg.phone),
          submittedAt: new Date().toISOString(),
        })
      );
      sessionStorage.removeItem("hcx_agent_review_refresh_count");
      navigate("/agent/account-under-review");
    } catch {
      setRegError("Could not save your selected location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formBody = (
    <div className="space-y-5 w-full max-w-md mx-auto">
      {regError && (
        <AgentFormFeedback variant="error">{regError}</AgentFormFeedback>
      )}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-brand-text-primary">State</label>
        <div className="relative">
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setLga("");
            }}
            className="w-full bg-white border border-brand-border rounded-2xl px-4 py-3.5 text-sm text-brand-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-brand-green"
          >
            <option value="">Select state</option>
            {nigerianStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Local government</label>
        <div className="relative">
          <select
            value={lga}
            onChange={(e) => setLga(e.target.value)}
            className="w-full bg-white border border-brand-border rounded-2xl px-4 py-3.5 text-sm text-brand-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-brand-green"
          >
            <option value="">{state ? "Select local government" : "Select state first"}</option>
            {(nigerianLGAs[state] || []).map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
        </div>
      </div>
    </div>
  );

  const actions = (
    <div className="space-y-3 w-full max-w-sm">
      <button
        type="button"
        onClick={handleContinue}
        disabled={loading || !state || !lga}
        className="btn-primary w-full disabled:opacity-40"
      >
        {loading ? "Please wait..." : "Continue"}
      </button>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-full py-4 rounded-3xl bg-gray-100 text-brand-green font-sans font-semibold text-sm"
      >
        Back
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout
        centerTitle
        title="Select your assigned location"
        subtitle="Select the location you were assigned to"
        actions={actions}
      >
        {formBody}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col min-h-dvh">
      <div className="flex-1 px-5 pt-6">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-text-secondary mb-6">
          <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Select your assigned location</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-8">Select the location you were assigned to</p>
        {formBody}
      </div>
      <div className="px-5 pb-8 space-y-3">{actions}</div>
    </div>
  );
}

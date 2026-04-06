import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import AgentFormFeedback from "../../components/agent/AgentFormFeedback";
import { agentData } from "../../mockData/agent";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function AgentLogin() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState("");

  useEffect(() => {
    try {
      const m = sessionStorage.getItem("hcx_agent_login_message");
      if (m) {
        setBanner(m);
        sessionStorage.removeItem("hcx_agent_login_message");
      }
      const pre = sessionStorage.getItem("hcx_agent_reset_email_prefill");
      if (pre) {
        setEmail(pre);
        sessionStorage.removeItem("hcx_agent_reset_email_prefill");
      }
    } catch { /* ignore */ }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setError(""); setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (email === agentData.email && password === "password123") {
      sessionStorage.setItem("hcx_agent_auth", JSON.stringify({ agentId: agentData.id }));
      navigate("/agent/home");
    } else {
      setError("Incorrect Password");
    }
    setLoading(false);
  };

  const formBody = (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Email</label>
        <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all">
          <Mail size={18} className="text-brand-text-muted shrink-0" />
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email here"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Password</label>
        <div className={`flex items-center bg-white border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${error ? "border-red-400" : "border-brand-border"}`}>
          <Lock size={18} className="text-brand-text-muted shrink-0" />
          <input
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter your password"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
          <button type="button" onClick={() => setShowPass((v) => !v)} className="text-brand-text-muted shrink-0">
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate("/agent/forgot-password")}
          className="font-sans text-sm font-semibold text-brand-green"
        >
          Forgot password?
        </button>
      </div>
      {banner && (
        <div className="mt-2">
          <AgentFormFeedback variant="success">{banner}</AgentFormFeedback>
        </div>
      )}
      <p className="font-sans text-xs text-brand-text-muted">
        Demo: <strong>{agentData.email}</strong> / <strong>password123</strong>
      </p>
    </div>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout
        title="Log in to your account"
        actions={
          <div className="space-y-3">
            <button type="button" onClick={handleLogin} disabled={loading} className="btn-primary">
              {loading ? "Logging in..." : "Continue"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/agent/create-account")}
              className="w-full py-4 rounded-3xl bg-gray-100 text-brand-green font-sans text-xl font-medium"
            >
              I don&apos;t have an account
            </button>
          </div>
        }
      >
        {formBody}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-10">
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-8">Log in to your account</h1>
        {formBody}
      </div>
      <div className="px-5 pb-8 space-y-3">
        <button type="button" onClick={handleLogin} disabled={loading} className="btn-primary">
          {loading ? "Logging in..." : "Log in"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/agent/create-account")}
          className="w-full py-4 rounded-3xl bg-gray-100 text-brand-text-secondary font-sans text-sm font-medium"
        >
          I don&apos;t have an account
        </button>
      </div>
    </div>
  );
}

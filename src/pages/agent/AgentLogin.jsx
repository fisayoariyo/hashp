import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { agentData } from "../../mockData/agent";

export default function AgentLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState("");

  useEffect(() => {
    try {
      const m = sessionStorage.getItem("hcx_agent_login_message");
      if (m) { setBanner(m); sessionStorage.removeItem("hcx_agent_login_message"); }
      const pre = sessionStorage.getItem("hcx_agent_reset_email_prefill");
      if (pre) { setEmail(pre); sessionStorage.removeItem("hcx_agent_reset_email_prefill"); }
    } catch { /* ignore */ }
  }, []);

  const handleLogin = () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      if (email === agentData.email && password === "password123") {
        try { sessionStorage.setItem("hcx_agent_auth", JSON.stringify({ accessToken: "mock-token", agentId: agentData.id, email })); } catch { /* ignore */ }
        navigate("/agent/home");
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="w-full flex flex-col bg-white" style={{ minHeight: "100dvh" }}>

      <div className="flex-1 overflow-y-auto px-5 pt-10 pb-6 w-full max-w-[480px] mx-auto">

        <h1 className="font-display font-bold text-[2rem] leading-tight text-brand-text-primary mb-8">
          Log in to your account
        </h1>

        {banner && (
          <div className="mb-4 px-4 py-3 rounded-2xl bg-green-50 text-green-700 text-sm font-medium">
            {banner}
          </div>
        )}

        <div className="space-y-5">

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-sm font-medium text-brand-text-primary">Email</label>
            <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all">
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

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="font-sans text-sm font-medium text-brand-text-primary">Password</label>
            <div className={`flex items-center bg-white border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${error ? "border-red-400" : "border-brand-border"}`}>
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

          {/* Forgot password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/agent/forgot-password")}
              className="font-sans text-sm font-semibold text-brand-green"
            >
              Forgot password?
            </button>
          </div>

          {/* Demo hint */}
          <p className="font-sans text-xs text-brand-text-muted">
            Demo: <strong>{agentData.email}</strong> / <strong>password123</strong>
          </p>

          {/* CTAs */}
          <div className="space-y-3 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/agent/create-account")}
              className="w-full text-center text-brand-green font-sans text-sm font-medium py-2"
            >
              I don&apos;t have an account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

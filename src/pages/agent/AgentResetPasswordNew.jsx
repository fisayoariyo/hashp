import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const RESET_FLAG = "hcx_agent_reset_otp_ok";

export default function AgentResetPasswordNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(RESET_FLAG) !== "1") {
        navigate("/agent/forgot-password", { replace: true });
      }
    } catch {
      navigate("/agent/forgot-password", { replace: true });
    }
  }, [navigate]);

  const handleContinue = async () => {
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      sessionStorage.removeItem(RESET_FLAG);
    } catch { /* ignore */ }
    setLoading(false);
    try {
      sessionStorage.setItem(
        "hcx_agent_login_message",
        "Password reset successfully. Sign in with your new password."
      );
      if (email) sessionStorage.setItem("hcx_agent_reset_email_prefill", email);
    } catch { /* ignore */ }
    navigate("/agent/login");
  };

  const fields = (
    <div className="space-y-4 w-full max-w-md mx-auto md:mx-0">
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Create your password</label>
        <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all">
          <Lock size={18} className="text-brand-text-muted shrink-0" />
          <input
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
          <button type="button" onClick={() => setShowPass((v) => !v)} className="text-brand-text-muted shrink-0">
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Confirm password</label>
        <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all">
          <Lock size={18} className="text-brand-text-muted shrink-0" />
          <input
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm your new password"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
          <button type="button" onClick={() => setShowPass((v) => !v)} className="text-brand-text-muted shrink-0">
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );

  const actions = (
    <div className="space-y-3 w-full max-w-sm">
      <button type="button" onClick={handleContinue} disabled={loading} className="btn-primary w-full">
        {loading ? "Saving..." : "Continue"}
      </button>
      <button
        type="button"
        onClick={() => navigate("/agent/forgot-password")}
        className="w-full py-4 rounded-3xl bg-gray-100 text-brand-green font-sans font-semibold text-sm"
      >
        Back
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout title="Reset password" subtitle="Choose a new password for your account." actions={actions}>
        {fields}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col min-h-dvh">
      <div className="flex-1 px-5 pt-6">
        <button type="button" onClick={() => navigate("/agent/forgot-password")} className="flex items-center gap-2 text-brand-text-secondary mb-6">
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Reset password</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-8">Choose a new password for your account.</p>
        {fields}
      </div>
      <div className="px-5 pb-8">{actions}</div>
    </div>
  );
}

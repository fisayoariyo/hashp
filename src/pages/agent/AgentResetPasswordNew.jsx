import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import PasswordField from "../../components/PasswordField";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { resetPassword } from "../../services/cropexApi";
import { getDisplayError } from "../../utils/apiErrors";
import { PASSWORD_HINT, validateStrongPassword } from "../../utils/password";

const RESET_FLAG = "hcx_agent_reset_otp_ok";
const RESET_EMAIL_KEY = "hcx_agent_reset_email";
const RESET_OTP_KEY = "hcx_agent_reset_otp";

export default function AgentResetPasswordNew() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (
        sessionStorage.getItem(RESET_FLAG) !== "1" ||
        !sessionStorage.getItem(RESET_EMAIL_KEY) ||
        !sessionStorage.getItem(RESET_OTP_KEY)
      ) {
        navigate("/agent/forgot-password", { replace: true });
      }
    } catch {
      navigate("/agent/forgot-password", { replace: true });
    }
  }, [navigate]);

  const handleContinue = async () => {
    const passwordCheck = validateStrongPassword(password);
    if (!passwordCheck.valid) {
      setError(passwordCheck.message);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const email = sessionStorage.getItem(RESET_EMAIL_KEY) || "";
      const otp = sessionStorage.getItem(RESET_OTP_KEY) || "";
      await resetPassword({ email, otp, newPassword: password });
      sessionStorage.removeItem(RESET_FLAG);
      sessionStorage.removeItem(RESET_EMAIL_KEY);
      sessionStorage.removeItem(RESET_OTP_KEY);
      sessionStorage.setItem(
        "hcx_agent_login_message",
        "Password reset successfully. Sign in with your new password."
      );
      navigate("/agent/login");
    } catch (resetError) {
      setError(getDisplayError(resetError, "Could not reset password."));
    } finally {
      setLoading(false);
    }
  };

  const fields = (
    <div className="space-y-4 w-full">
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Create your password</label>
        <p className="font-sans text-xs leading-relaxed text-brand-text-muted">{PASSWORD_HINT}</p>
        <PasswordField
          prefix={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          visible={showPass}
          onToggleVisible={() => setShowPass((value) => !value)}
          autoComplete="new-password"
          placeholder="e.g. Farm2026!"
          wrapperClassName="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Confirm password</label>
        <PasswordField
          prefix={Lock}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          visible={showConfirmPass}
          onToggleVisible={() => setShowConfirmPass((value) => !value)}
          autoComplete="new-password"
          placeholder="Confirm your new password"
          wrapperClassName="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );

  const actions = (
    <div className="space-y-3 w-full">
      <button type="button" onClick={() => void handleContinue()} disabled={loading} className="btn-primary w-full">
        {loading ? "Saving..." : "Continue"}
      </button>
      <button
        type="button"
        onClick={() => navigate("/agent/forgot-password")}
        className="auth-btn-secondary"
      >
        Back
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout
        title="Reset password"
        subtitle="Choose a new password for your account."
        actions={actions}
      >
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
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-subtitle">
          Choose a new password for your account.
        </p>
        {fields}
      </div>
      <div className="px-5 pb-8">{actions}</div>
    </div>
  );
}

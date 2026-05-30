import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import AgentFormFeedback from "../../components/agent/AgentFormFeedback";
import OtpCooldownFeedback from "../../components/agent/OtpCooldownFeedback";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useOtpCountdown } from "../../hooks/useOtpCountdown";
import { requestAuthOtp } from "../../services/cropexApi";
import { getUserFacingError } from "../../utils/apiErrors";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export default function AgentForgotPassword() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { seconds: cooldownSeconds, isActive: isCooldownActive, start: startCooldown, clear: clearCooldown } =
    useOtpCountdown();

  const handleContinue = async () => {
    const normalizedEmail = email.trim();
    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email address.");
      clearCooldown();
      return;
    }

    if (isCooldownActive) return;

    setError("");
    clearCooldown();
    setLoading(true);
    try {
      await requestAuthOtp({ email: normalizedEmail });
      navigate("/agent/verify-phone", {
        state: { mode: "reset-password", email: normalizedEmail },
      });
    } catch (requestError) {
      const facing = getUserFacingError(requestError, "Could not send the reset code.");
      if (facing.isCooldown && facing.retrySeconds) {
        startCooldown(facing.retrySeconds);
        setError("");
      } else {
        setError(facing.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formBody = (
    <div className="w-full space-y-4">
      <p className="font-sans text-sm text-brand-text-secondary">
        Enter your registered email address. We&apos;ll send a verification code to continue.
      </p>
      {error ? <AgentFormFeedback variant="error">{error}</AgentFormFeedback> : null}
      <OtpCooldownFeedback seconds={cooldownSeconds} />
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Email Address</label>
        <div className="flex items-center gap-3 rounded-2xl border border-brand-border bg-white px-4 py-3.5 transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-brand-green">
          <Mail size={18} className="shrink-0 text-brand-text-muted" />
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleContinue()}
            placeholder="Enter your email here"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  const actions = (
    <div className="w-full space-y-3">
      <button
        type="button"
        onClick={() => void handleContinue()}
        disabled={loading || isCooldownActive || !isValidEmail(email.trim())}
        className="btn-primary w-full"
      >
        {loading ? "Sending code..." : isCooldownActive ? `Try again in ${cooldownSeconds}s` : "Continue"}
      </button>
      <button
        type="button"
        onClick={() => navigate("/agent/login")}
        className="w-full rounded-3xl bg-gray-100 py-4 font-sans text-sm font-semibold text-brand-green"
      >
        Back to log in
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout
        title="Reset password"
        subtitle="We'll email a code to your registered address."
        actions={actions}
      >
        {formBody}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex min-h-dvh flex-col">
      <div className="flex-1 px-5 pt-6">
        <button
          type="button"
          onClick={() => navigate("/agent/login")}
          className="mb-6 flex items-center gap-2 text-brand-text-secondary"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="mb-2 font-display text-3xl font-bold text-brand-text-primary">Reset password</h1>
        <p className="mb-8 font-sans text-sm text-brand-text-secondary">
          We&apos;ll email a code to your registered address.
        </p>
        {formBody}
      </div>
      <div className="px-5 pb-8">{actions}</div>
    </div>
  );
}

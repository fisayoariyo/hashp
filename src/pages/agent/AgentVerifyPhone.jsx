import { createRef, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import AgentFormFeedback from "../../components/agent/AgentFormFeedback";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useOtpCountdown } from "../../hooks/useOtpCountdown";
import {
  agentResendOtp,
  agentVerifyOtp,
  getAgentIdFromSession,
  resendAuthOtp,
  setAgentSessionFromAuthResponse,
  verifyChangePasswordOtp,
} from "../../services/cropexApi";
import { getPasswordResetFacingError, getUserFacingError } from "../../utils/apiErrors";
import { ensureRegistrationUserId, saveAgentUserIdForEmail } from "../../utils/agentStatus";

const REG_KEY = "hcx_agent_registration";
const RESET_FLAG = "hcx_agent_reset_otp_ok";
const RESET_EMAIL_KEY = "hcx_agent_reset_email";
const OTP_LENGTH = 6;

export default function AgentVerifyPhone() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const mode = location.state?.mode === "reset-password" ? "reset-password" : "register";
  const resetEmail = String(location.state?.email || "").trim();

  const [digits, setDigits] = useState(() => Array.from({ length: OTP_LENGTH }, () => ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const { seconds: cooldownSeconds, isActive: isCooldownActive, start: startCooldown, clear: clearCooldown } =
    useOtpCountdown();

  useEffect(() => {
    if (mode !== "register") return;
    let cancelled = false;
    try {
      const raw = sessionStorage.getItem(REG_KEY);
      const reg = raw ? JSON.parse(raw) : {};
      const email = String(reg.email || "").trim();
      if (!email) {
        if (!cancelled) setError("Missing account details. Go back to create account.");
        return;
      }
      setRegisterEmail(email);
      setRegisterPhone(String(reg.phoneNumber || reg.phone || "").trim());
    } catch {
      if (!cancelled) setError("Could not prepare verification code.");
    }
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const refs = useMemo(() => Array.from({ length: OTP_LENGTH }, () => createRef()), []);

  useEffect(() => {
    refs[0].current?.focus();
  }, [refs]);

  useEffect(() => {
    if (mode === "register") {
      try {
        if (!sessionStorage.getItem(REG_KEY)) {
          navigate("/agent/create-account", { replace: true });
        }
      } catch {
        navigate("/agent/create-account", { replace: true });
      }
    } else if (!resetEmail) {
      navigate("/agent/forgot-password", { replace: true });
    }
  }, [mode, resetEmail, navigate]);

  const handleChange = (index, event) => {
    const raw = event.target.value.replace(/\D/g, "");
    const value = raw.length > 1 ? raw[raw.length - 1] : raw.slice(0, 1);
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError("");
    if (value && index < OTP_LENGTH - 1) setTimeout(() => refs[index + 1].current?.focus(), 0);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        setTimeout(() => refs[index - 1].current?.focus(), 0);
      }
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array.from({ length: OTP_LENGTH }, () => "");
    pasted.split("").forEach((character, index) => {
      next[index] = character;
    });
    setDigits(next);
    const last = Math.min(pasted.length, OTP_LENGTH) - 1;
    setTimeout(() => refs[last].current?.focus(), 0);
  };

  const resetOtpInputs = () => {
    setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
    setTimeout(() => refs[0].current?.focus(), 0);
  };

  const handleContinue = async () => {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError(`Please enter the complete ${OTP_LENGTH}-digit code.`);
      return;
    }

    setLoading(true);
    setError("");
    clearCooldown();
    try {
      if (mode === "reset-password") {
        const response = await verifyChangePasswordOtp({ email: resetEmail, otp });
        setAgentSessionFromAuthResponse(response);
        sessionStorage.setItem(RESET_FLAG, "1");
        sessionStorage.setItem(RESET_EMAIL_KEY, resetEmail);
        navigate("/agent/reset-password-new", { replace: true });
        return;
      }

      if (!registerEmail) {
        setError("Missing account details.");
        return;
      }
      const response = await agentVerifyOtp({ email: registerEmail, otp });
      setAgentSessionFromAuthResponse(response);
      try {
        const raw = sessionStorage.getItem(REG_KEY);
        const reg = raw ? JSON.parse(raw) : {};
        const userId = getAgentIdFromSession();
        if (userId) {
          sessionStorage.setItem(REG_KEY, JSON.stringify({ ...reg, userId }));
          saveAgentUserIdForEmail(registerEmail, userId);
          ensureRegistrationUserId({ email: registerEmail, userId });
        }
      } catch {
        /* ignore */
      }
      navigate("/agent/identity-verification");
    } catch (verifyError) {
      const facing =
        mode === "reset-password"
          ? getPasswordResetFacingError(verifyError, "Verification failed.")
          : getUserFacingError(verifyError, "Verification failed.");
      setError(facing.message);
      resetOtpInputs();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (isCooldownActive) return;

    setError("");
    clearCooldown();
    setLoading(true);
    try {
      if (mode === "reset-password") {
        if (!resetEmail) return;
        await resendAuthOtp({ email: resetEmail });
      } else {
        if (!registerEmail) return;
        await agentResendOtp({ email: registerEmail, phone: registerPhone });
      }
    } catch (resendError) {
      const facing =
        mode === "reset-password"
          ? getPasswordResetFacingError(resendError, "Could not resend code.")
          : getUserFacingError(resendError, "Could not resend code.");
      if (facing.isCooldown && facing.retrySeconds) {
        startCooldown(facing.retrySeconds);
        setError("");
      } else if (mode === "register" && /already exists|already in use|conflict/i.test(facing.message)) {
        setError(
          "This signup already exists. Use the latest code sent to your email, or restart with a fresh account.",
        );
      } else {
        setError(facing.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const otpDestinationEmail = mode === "register" ? registerEmail : resetEmail;
  const otpDestinationHint = otpDestinationEmail ? (
    <p
      className={`font-sans text-xs text-brand-text-muted ${
        isDesktop ? "mx-auto mb-4 max-w-[360px] text-center" : "mb-4"
      }`}
    >
      Code sent to{" "}
      <span className="font-medium text-brand-text-secondary">{otpDestinationEmail}</span>
    </p>
  ) : null;

  const otpGrid = (
    <div className={`grid grid-cols-6 ${isDesktop ? "mx-auto max-w-[360px] gap-3" : "gap-3"}`}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={refs[index]}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          autoComplete="one-time-code"
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={index === 0 ? handlePaste : undefined}
          className={`w-full ${isDesktop ? "h-[44px] rounded-[10px] text-[18px]" : "h-16 rounded-2xl text-2xl"} border-2 text-center font-display font-bold transition-colors focus:border-brand-green focus:outline-none ${
            digit ? "border-brand-green text-brand-green" : "border-brand-border"
          } bg-white`}
        />
      ))}
    </div>
  );

  const otpMeta = (
    <>
      {error ? (
        <div className={`mb-4 ${isDesktop ? "flex justify-center" : ""}`}>
          <AgentFormFeedback variant="error" className={isDesktop ? "text-[13px]" : ""}>
            {error}
          </AgentFormFeedback>
        </div>
      ) : null}
      <p className={`font-sans text-brand-text-secondary ${isDesktop ? "text-center text-[14px]" : "text-sm"}`}>
        I did not receive a code,{" "}
        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={loading || isCooldownActive}
          className="font-semibold text-brand-green disabled:opacity-50"
        >
          {isCooldownActive ? `Resend in ${cooldownSeconds}s` : "Resend Code"}
        </button>
      </p>
    </>
  );

  const pageTitle = "Verify email address";
  const pageSubtitle = `Enter the ${OTP_LENGTH}-digit code we sent to your registered email address`;

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout
        title={pageTitle}
        subtitle={pageSubtitle}
        centerTitle
        actionsClassName="mt-auto pt-7"
        actions={
          <div className="w-full space-y-3">
            <button
              type="button"
              onClick={() => void handleContinue()}
              disabled={loading || digits.join("").length < OTP_LENGTH}
              className="btn-primary w-full"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(mode === "reset-password" ? "/agent/forgot-password" : "/agent/create-account")
              }
              className="auth-btn-secondary"
            >
              {mode === "reset-password" ? "Back" : "Edit account details"}
            </button>
          </div>
        }
      >
        {otpGrid}
        {otpDestinationHint}
        {otpMeta}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-5">
        <button
          type="button"
          onClick={() => navigate(mode === "reset-password" ? "/agent/forgot-password" : "/agent/create-account")}
          className="mb-6 flex items-center gap-2 text-brand-text-secondary"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="auth-title">{pageTitle}</h1>
        <p className="auth-subtitle">{pageSubtitle}</p>
        {otpGrid}
        {otpDestinationHint}
        {otpMeta}
      </div>
      <div className="space-y-3 px-5 pb-8">
        <button
          type="button"
          onClick={() => void handleContinue()}
          disabled={loading || digits.join("").length < OTP_LENGTH}
          className="btn-primary"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>
        <button
          type="button"
          onClick={() => navigate(mode === "reset-password" ? "/agent/forgot-password" : "/agent/create-account")}
          className="auth-btn-secondary"
        >
          {mode === "reset-password" ? "Back" : "Edit account details"}
        </button>
      </div>
    </div>
  );
}

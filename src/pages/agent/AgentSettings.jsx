import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  Smartphone,
} from "lucide-react";
import { AgentBottomNav } from "./AgentHome";
import AgentDesktopShell from "../../components/agent/AgentDesktopShell";
import OtpCooldownFeedback from "../../components/agent/OtpCooldownFeedback";
import PasswordField from "../../components/PasswordField";
import { agentFAQs } from "../../mockData/agent";
import { useOtpCountdown } from "../../hooks/useOtpCountdown";
import {
  changeAgentPassword,
  clearAgentSession,
  getAgentDashboard,
  getAgentSession,
  requestAgentChangePasswordOtp,
  verifyAgentChangePasswordOtp,
} from "../../services/cropexApi";
import { getDisplayError, getPasswordResetFacingError } from "../../utils/apiErrors";
import { validateStrongPassword } from "../../utils/password";

const OTP_LENGTH = 6;
const CHANGE_PASSWORD_OTP_OK = "hcx_agent_change_password_otp_ok";

function FAQScreen({ onBack }) {
  const [open, setOpen] = useState(null);
  const content = (
    <div className="flex-1 w-full md:max-w-[862.81px] px-4 md:px-0 pt-5 pb-28 md:pb-0 overflow-y-auto scrollbar-hide">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-brand-text-secondary mb-5"
      >
        <ArrowLeft size={18} />
        <span className="font-sans text-sm">Go back</span>
      </button>
      <h1 className="font-display font-bold text-2xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-1">
        FAQs
      </h1>
      <p className="font-sans text-sm md:text-[14px] text-brand-text-secondary mb-5 max-w-[760px]">
        Answers to common questions about the agent app.
      </p>
      <div className="space-y-3 max-w-[760px]">
        {agentFAQs.map((faq) => (
          <button
            key={faq.id}
            onClick={() => setOpen(open === faq.id ? null : faq.id)}
            className="w-full text-left bg-white border border-[#E6E6E6] rounded-[20px] p-4 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-sans font-semibold text-sm text-brand-text-primary">
                {faq.question}
              </p>
              {open === faq.id ? (
                <ChevronUp size={16} className="text-brand-green shrink-0 mt-0.5" />
              ) : (
                <ChevronDown size={16} className="text-brand-text-muted shrink-0 mt-0.5" />
              )}
            </div>
            {open === faq.id && (
              <p className="font-sans text-sm text-brand-text-secondary mt-3 border-t border-brand-border pt-3 leading-relaxed">
                {faq.answer}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden page-container">
        {content}
        <AgentBottomNav />
      </div>
      <AgentDesktopShell active="settings">{content}</AgentDesktopShell>
    </>
  );
}

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80" onClick={onCancel} />
      <div className="relative w-full max-w-[370px] rounded-[30px] bg-[#F6F6F6] px-6 pb-8 pt-9">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full">
            <LogOut size={38} strokeWidth={1.8} className="text-[#03624D]" />
          </div>
        </div>
        <h3 className="mx-auto mb-8 max-w-[270px] text-center font-sans text-2xl font-bold leading-[37px] text-[#03624D]">
          Are you sure you want to logout?
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-[50px] items-center justify-center rounded-full border border-[#C6D8D2] bg-transparent font-sans text-xl font-light leading-[35px] text-[#03624D]"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-[50px] items-center justify-center rounded-full bg-[#03624D] font-sans text-xl font-light leading-[35px] text-[#F6F6F6]"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordChangedModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/45 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-changed-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] rounded-2xl border border-black/[0.06] bg-white px-10 py-10 text-center shadow-[0_24px_64px_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#03624D] text-white shadow-[0_6px_14px_rgba(3,98,77,0.22)]">
          <Check size={36} strokeWidth={2.5} />
        </div>
        <h2
          id="password-changed-title"
          className="font-display text-xl font-bold leading-snug text-[#03624D] md:text-2xl"
        >
          Password changed successfully
        </h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-brand-text-secondary">
          Log back in with your new password.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 inline-flex h-[47px] w-full items-center justify-center rounded-[15px] bg-[#03624D] font-sans text-base font-semibold text-white"
        >
          Log in
        </button>
      </div>
    </div>
  );
}

function ChangePasswordScreen({ onBack, onPasswordChangedSuccess, accountEmail }) {
  const normalizedEmail = String(accountEmail || "").trim();
  const [step, setStep] = useState("otp");
  const [digits, setDigits] = useState(() => Array.from({ length: OTP_LENGTH }, () => ""));
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { seconds: cooldownSeconds, isActive: isCooldownActive, start: startCooldown } =
    useOtpCountdown();
  const otpRefs = useMemo(() => Array.from({ length: OTP_LENGTH }, () => createRef()), []);
  const otpRequestedRef = useRef(false);

  const fieldWrapper =
    "flex items-center bg-white border border-brand-border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all";

  useEffect(() => {
    try {
      sessionStorage.removeItem(CHANGE_PASSWORD_OTP_OK);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (otpRequestedRef.current) return;
    otpRequestedRef.current = true;

    let active = true;
    setSubmitting(true);
    setError("");

    requestAgentChangePasswordOtp()
      .then(() => {
        if (active) setOtpSent(true);
      })
      .catch((requestError) => {
        if (!active) return;
        otpRequestedRef.current = false;
        const facing = getPasswordResetFacingError(requestError, "Could not send a verification code.");
        if (facing.isCooldown && facing.retrySeconds) {
          startCooldown(facing.retrySeconds);
          setError("");
        } else {
          setError(facing.message);
        }
      })
      .finally(() => {
        if (active) setSubmitting(false);
      });

    return () => {
      active = false;
    };
  }, [startCooldown]);

  const handleDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError("");
    if (value && index < OTP_LENGTH - 1) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError("Enter the full verification code.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await verifyAgentChangePasswordOtp({ otp });
      sessionStorage.setItem(CHANGE_PASSWORD_OTP_OK, "1");
      setStep("password");
    } catch (requestError) {
      setError(getDisplayError(requestError, "Could not verify the code."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (isCooldownActive || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await requestAgentChangePasswordOtp();
      setOtpSent(true);
    } catch (requestError) {
      const facing = getPasswordResetFacingError(requestError, "Could not resend the code.");
      if (facing.isCooldown && facing.retrySeconds) {
        startCooldown(facing.retrySeconds);
        setError("");
      } else {
        setError(facing.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSavePassword = async () => {
    if (sessionStorage.getItem(CHANGE_PASSWORD_OTP_OK) !== "1") {
      setError("Verify your email code first.");
      setStep("otp");
      return;
    }
    if (!oldPassword) {
      setError("Enter your old password.");
      return;
    }
    const passwordCheck = validateStrongPassword(newPassword);
    if (!passwordCheck.valid) {
      setError(passwordCheck.message);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (oldPassword === newPassword) {
      setError("Choose a new password that is different from your old one.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await changeAgentPassword({
        oldPassword,
        newPassword,
      });
      sessionStorage.removeItem(CHANGE_PASSWORD_OTP_OK);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowSuccessModal(true);
    } catch (requestError) {
      setError(getDisplayError(requestError, "Could not update your password."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    try {
      sessionStorage.removeItem(CHANGE_PASSWORD_OTP_OK);
    } catch {
      /* ignore */
    }
    onBack();
  };

  const dismissSuccess = () => {
    setShowSuccessModal(false);
    onPasswordChangedSuccess();
  };

  const primaryAction =
    step === "otp"
      ? () => void handleVerifyOtp()
      : () => void handleSavePassword();
  const primaryLabel =
    step === "otp"
      ? submitting
        ? "Processing..."
        : "Verify"
      : submitting
        ? "Saving..."
        : "Continue";
  const primaryDisabled =
    submitting || (step === "otp" && digits.join("").length < OTP_LENGTH);

  const body = (
    <>
      <button
        type="button"
        onClick={handleGoBack}
        className="flex items-center gap-2 text-brand-text-secondary mb-6"
      >
        <ArrowLeft size={18} />
        <span className="font-sans text-sm">Go back</span>
      </button>

      {step === "otp" ? (
        <>
          <h1 className="font-display font-bold text-3xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-2">
            Enter OTP
          </h1>
          <p className="font-sans text-sm text-brand-text-secondary mb-8 max-w-[560px]">
            Enter the code sent to{" "}
            <span className="font-medium text-brand-text-primary">
              {normalizedEmail || "your registered email"}
            </span>{" "}
            to confirm.
          </p>
          <div className="grid grid-cols-6 gap-3 mb-4 max-w-[560px] md:gap-4">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => handleDigit(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                className={`h-16 w-full text-center text-2xl font-bold font-display bg-white border-2 rounded-2xl focus:outline-none transition-colors md:w-[92px] ${
                  digit ? "border-brand-green text-brand-green" : "border-brand-border"
                } focus:border-brand-green`}
              />
            ))}
          </div>
          {error ? <p className="font-sans text-xs text-red-500 mb-2">{error}</p> : null}
          <OtpCooldownFeedback seconds={cooldownSeconds} className="mb-2" />
          <div className="flex flex-wrap items-center gap-3 max-w-[560px]">
            <p className="font-sans text-xs text-brand-text-muted">
              {otpSent ? "Verification code sent to your email." : "Sending verification code..."}
            </p>
            <button
              type="button"
              onClick={() => void handleResendOtp()}
              disabled={submitting || isCooldownActive}
              className="font-sans text-xs font-semibold text-brand-green disabled:opacity-40"
            >
              {isCooldownActive ? `Resend in ${cooldownSeconds}s` : "Resend code"}
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-display font-bold text-3xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-2">
            Reset password
          </h1>
          <p className="font-sans text-sm text-brand-text-secondary mb-8 max-w-[560px]">
            Enter your old password and choose a new one.
          </p>
          <div className="space-y-4 max-w-[560px]">
            <div className="flex flex-col gap-2">
              <label className="font-sans text-sm font-medium text-brand-text-primary">
                Old password
              </label>
              <PasswordField
                prefix={Lock}
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                visible={showOld}
                onToggleVisible={() => setShowOld((value) => !value)}
                autoComplete="current-password"
                placeholder="Enter old password"
                wrapperClassName={fieldWrapper}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-sm font-medium text-brand-text-primary">
                Create your password
              </label>
              <PasswordField
                prefix={Lock}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                visible={showNew}
                onToggleVisible={() => setShowNew((value) => !value)}
                autoComplete="new-password"
                placeholder="Min 8 chars, letters, numbers & symbol"
                wrapperClassName={fieldWrapper}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-sm font-medium text-brand-text-primary">
                Confirm password
              </label>
              <PasswordField
                prefix={Lock}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                visible={showConfirm}
                onToggleVisible={() => setShowConfirm((value) => !value)}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                wrapperClassName={fieldWrapper}
              />
            </div>
            {error ? <p className="font-sans text-xs text-red-500">{error}</p> : null}
          </div>
        </>
      )}

      <div className="mt-8 max-w-[560px] pb-8 md:pb-0">
        <button
          type="button"
          onClick={primaryAction}
          disabled={primaryDisabled}
          className="w-full md:w-[240px] inline-flex h-[47px] items-center justify-center rounded-[15px] bg-[#03624D] text-white font-sans font-semibold disabled:opacity-40"
        >
          {primaryLabel}
        </button>
      </div>

      {showSuccessModal ? <PasswordChangedModal onClose={dismissSuccess} /> : null}
    </>
  );

  return (
    <>
      <div className="md:hidden page-container flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6">{body}</div>
        <AgentBottomNav />
      </div>
      <AgentDesktopShell active="settings">
        <div className="flex-1 px-4 md:px-0 pt-5 pb-10 overflow-y-auto scrollbar-hide">
          {body}
        </div>
      </AgentDesktopShell>
    </>
  );
}

function SettingsMain({ onChangePassword, onFAQ, onLogout, profile }) {
  const content = (
    <div className="flex-1 w-full md:max-w-[862.81px] px-4 md:px-0 pt-5 pb-28 md:pb-0 overflow-y-auto scrollbar-hide">
      <h1 className="font-display font-bold text-2xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-1">
        Settings
      </h1>
      <p className="font-sans text-sm md:text-[14px] text-brand-text-secondary mb-5 max-w-[760px]">
        To update your details, contact your administrator
      </p>

      <div className="flex items-center gap-3 mb-5 max-w-[760px] rounded-[20px] border border-[#E6E6E6] bg-white p-4">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-brand-green-muted flex items-center justify-center overflow-hidden">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={profile.fullName}
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : (
              <span className="text-brand-green text-xl font-bold">
                {profile.fullName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
            <span className="text-white text-xs">+</span>
          </div>
        </div>
        <div>
          <p className="font-display font-bold text-lg text-brand-text-primary leading-tight">
            {profile.fullName}
          </p>
          <p className="font-sans text-sm text-brand-text-secondary flex items-center gap-2 mt-0.5">
            <Mail size={14} className="text-brand-green shrink-0" aria-hidden />
            {profile.email}
          </p>
          <p className="font-sans text-sm text-brand-text-secondary flex items-center gap-2 mt-0.5">
            <Smartphone size={14} className="text-brand-green shrink-0" aria-hidden />
            {profile.phone}
          </p>
        </div>
      </div>

      <div className="max-w-[760px] bg-white rounded-[20px] border border-[#E6E6E6] overflow-hidden divide-y divide-brand-border">
        <button
          type="button"
          onClick={onChangePassword}
          className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-[#F6F6F6] transition-colors"
        >
          <Lock size={20} strokeWidth={1.8} className="text-brand-text-secondary shrink-0" />
          <span className="flex-1 font-sans text-sm font-medium text-brand-text-primary">
            Change password
          </span>
          <ChevronRight size={16} className="text-brand-text-muted shrink-0" />
        </button>
        <button
          type="button"
          onClick={onFAQ}
          className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-[#F6F6F6] transition-colors"
        >
          <HelpCircle size={20} strokeWidth={1.8} className="text-brand-text-secondary shrink-0" />
          <span className="flex-1 font-sans text-sm font-medium text-brand-text-primary">
            FAQs
          </span>
          <ChevronRight size={16} className="text-brand-text-muted shrink-0" />
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-[#F6F6F6] transition-colors"
        >
          <LogOut size={20} strokeWidth={1.8} className="text-red-500 shrink-0" />
          <span className="flex-1 font-sans text-sm font-medium text-red-500">
            Logout
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden page-container">
        {content}
        <AgentBottomNav />
      </div>
      <AgentDesktopShell active="settings">{content}</AgentDesktopShell>
    </>
  );
}

export default function AgentSettings() {
  const navigate = useNavigate();
  const [view, setView] = useState("main");
  const [showLogout, setShowLogout] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  useEffect(() => {
    let active = true;
    getAgentDashboard()
      .then((payload) => {
        if (active) setDashboard(payload);
      })
      .catch(() => {
        if (active) setDashboard(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const session = getAgentSession();
  const profile = useMemo(
    () => ({
      fullName:
        dashboard?.agent?.full_name ||
        session?.fullName ||
        session?.full_name ||
        "Agent",
      email: dashboard?.agent?.email || session?.email || "",
      phone: dashboard?.agent?.phone_number || session?.phone || "",
      photo: "",
    }),
    [dashboard, session]
  );

  const handleLogout = (loginMessage) => {
    try {
      clearAgentSession();
      sessionStorage.removeItem("hcx_agent_registration");
      sessionStorage.removeItem("hcx_agent_review_refresh_count");
      sessionStorage.removeItem("hcx_agent_reset_otp_ok");
      sessionStorage.removeItem(CHANGE_PASSWORD_OTP_OK);
      localStorage.removeItem("hcx_agent_farmers_list");
      if (loginMessage) {
        sessionStorage.setItem("hcx_agent_login_message", loginMessage);
      }
    } catch {
      /* ignore */
    }
    navigate("/agent/login");
  };

  if (view === "password") {
    return (
      <ChangePasswordScreen
        accountEmail={profile.email}
        onBack={() => setView("main")}
        onPasswordChangedSuccess={() =>
          handleLogout("Password changed successfully. Sign in with your new password.")
        }
      />
    );
  }

  if (view === "faq") {
    return <FAQScreen onBack={() => setView("main")} />;
  }

  return (
    <>
      <SettingsMain
        onChangePassword={() => setView("password")}
        onFAQ={() => setView("faq")}
        onLogout={() => setShowLogout(true)}
        profile={profile}
      />
      {showLogout && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </>
  );
}

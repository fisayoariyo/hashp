import { createRef, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  HelpCircle,
  Lock,
  LogOut,
} from "lucide-react";
import { AgentBottomNav } from "./AgentHome";
import AgentDesktopShell from "../../components/agent/AgentDesktopShell";
import OtpCooldownFeedback from "../../components/agent/OtpCooldownFeedback";
import { agentFAQs } from "../../mockData/agent";
import { useOtpCountdown } from "../../hooks/useOtpCountdown";
import {
  clearAgentSession,
  getAgentDashboard,
  getAgentSession,
  requestChangePasswordOtp,
  resendChangePasswordOtp,
  setAgentSessionFromAuthResponse,
  submitChangePassword,
  verifyChangePasswordOtp,
} from "../../services/cropexApi";
import { getPasswordResetFacingError, getDisplayError } from "../../utils/apiErrors";
import { PASSWORD_HINT, validateStrongPassword } from "../../utils/password";
import PasswordField from "../../components/PasswordField";

const OTP_LENGTH = 6;

function ChangePasswordScreen({ onBack }) {
  const session = getAgentSession();
  const [accountEmail, setAccountEmail] = useState(() => String(session?.email || "").trim());
  const [step, setStep] = useState("otp");
  const [digits, setDigits] = useState(() => Array.from({ length: OTP_LENGTH }, () => ""));
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { seconds: cooldownSeconds, isActive: isCooldownActive, start: startCooldown, clear: clearCooldown } =
    useOtpCountdown();

  const otpRefs = useMemo(() => Array.from({ length: OTP_LENGTH }, () => createRef()), []);

  useEffect(() => {
    let active = true;
    getAgentDashboard()
      .then((payload) => {
        if (!active) return;
        const resolved = String(payload?.agent?.email || session?.email || "").trim();
        if (resolved) setAccountEmail(resolved);
      })
      .catch(() => {
        /* keep session email if dashboard fails */
      });
    return () => {
      active = false;
    };
  }, [session?.email]);

  useEffect(() => {
    if (!accountEmail) {
      setError("No email is available for this account.");
      return;
    }

    let active = true;
    setSubmitting(true);
    setError("");
    clearCooldown();

    requestChangePasswordOtp({ email: accountEmail })
      .then(() => {
        if (active) setOtpSent(true);
      })
      .catch((requestError) => {
        if (!active) return;
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
  }, [accountEmail, clearCooldown, startCooldown]);

  const handleDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError("");
    if (value && index < OTP_LENGTH - 1) otpRefs[index + 1].current?.focus();
  };

  const handleOTPKeyDown = (index, event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOTP = async () => {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError("Enter the full verification code.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const response = await verifyChangePasswordOtp({ email: accountEmail, otp });
      setAgentSessionFromAuthResponse(response);
      setStep("new");
    } catch (requestError) {
      setError(getDisplayError(requestError, "Could not verify the code."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async () => {
    const passwordCheck = validateStrongPassword(password);
    if (!passwordCheck.valid) {
      setError(passwordCheck.message);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await submitChangePassword({ newPassword: password });
      setSuccess(true);
      window.setTimeout(() => onBack(), 2000);
    } catch (requestError) {
      setError(getDisplayError(requestError, "Could not update the password."));
    } finally {
      setSubmitting(false);
    }
  };

  const resendCode = async () => {
    if (!accountEmail || isCooldownActive) return;
    setSubmitting(true);
    setError("");
    clearCooldown();
    try {
      await resendChangePasswordOtp({ email: accountEmail });
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

  const content = (
    <div className="flex flex-col md:w-full md:max-w-[862.81px]">
      <div className="flex-1 px-5 md:px-0 pt-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-text-secondary mb-6"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-4 py-10">
            <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center">
              <span className="text-white text-2xl">OK</span>
            </div>
            <p className="font-display font-bold text-xl text-brand-text-primary">Password updated</p>
            <p className="font-sans text-sm text-brand-text-secondary text-center">
              Redirecting back to settings...
            </p>
          </div>
        ) : (
          <>
            {step === "otp" && (
              <>
                <h1 className="font-display font-bold text-3xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-2">
                  Enter OTP
                </h1>
                <p className="font-sans text-sm text-brand-text-secondary mb-8">
                  Enter the code sent to {accountEmail || "your registered email"} to confirm.
                </p>
                <div className="grid grid-cols-6 gap-3 mb-4 md:w-fit md:gap-4">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(event) => handleDigit(index, event.target.value)}
                      onKeyDown={(event) => handleOTPKeyDown(index, event)}
                      className={`h-16 w-full text-center text-2xl font-bold font-display bg-white border-2 rounded-2xl focus:outline-none transition-colors md:w-[92px] ${
                        digit ? "border-brand-green text-brand-green" : "border-brand-border"
                      } focus:border-brand-green`}
                    />
                  ))}
                </div>
                {error ? <p className="text-xs text-red-500 mb-2">{error}</p> : null}
                <OtpCooldownFeedback seconds={cooldownSeconds} className="mb-2" />
                <div className="flex items-center gap-3">
                  <p className="font-sans text-xs text-brand-text-muted">
                    {otpSent ? "Verification code sent to your email." : "Sending verification code..."}
                  </p>
                  <button
                    type="button"
                    onClick={() => void resendCode()}
                    disabled={submitting || !accountEmail || isCooldownActive}
                    className="font-sans text-xs font-semibold text-brand-green disabled:opacity-40"
                  >
                    {isCooldownActive ? `Resend in ${cooldownSeconds}s` : "Resend code"}
                  </button>
                </div>
              </>
            )}

            {step === "new" && (
              <div className="md:max-w-[560px]">
                <h1 className="font-display font-bold text-3xl md:text-[40px] md:leading-[48px] text-brand-text-primary mb-2">
                  New Password
                </h1>
                <p className="font-sans text-sm text-brand-text-secondary mb-8">
                  Create a new password for your account.
                </p>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-sm font-medium text-brand-text-primary">
                      New Password
                    </label>
                    <p className="font-sans text-xs leading-relaxed text-brand-text-muted">{PASSWORD_HINT}</p>
                    <PasswordField
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      visible={showPass}
                      onToggleVisible={() => setShowPass((value) => !value)}
                      autoComplete="new-password"
                      placeholder="e.g. Farm2026!"
                      wrapperClassName="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green transition-all"
                      inputClassName="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-brand-text-muted"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-sm font-medium text-brand-text-primary">
                      Confirm Password
                    </label>
                    <PasswordField
                      value={confirm}
                      onChange={(event) => setConfirm(event.target.value)}
                      visible={showConfirmPass}
                      onToggleVisible={() => setShowConfirmPass((value) => !value)}
                      autoComplete="new-password"
                      placeholder="Re-enter password"
                      wrapperClassName="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green transition-all"
                      inputClassName="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-brand-text-muted"
                    />
                  </div>
                  {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!success && (
        <div className={`px-5 md:px-0 pb-8 md:pb-0 md:pt-6 ${step === "new" ? "pt-4" : ""}`}>
          <button
            onClick={() => void (step === "otp" ? handleOTP() : handleSave())}
            disabled={submitting || (step === "otp" && digits.join("").length < OTP_LENGTH)}
            className="w-full md:w-[240px] inline-flex h-[47px] items-center justify-center rounded-[15px] bg-[#03624D] text-white font-sans font-semibold disabled:opacity-40"
          >
            {submitting ? "Processing..." : step === "otp" ? "Verify" : "Save Password"}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="md:hidden page-white">{content}</div>
      <AgentDesktopShell active="settings">{content}</AgentDesktopShell>
    </>
  );
}

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
          <p className="font-sans text-sm text-brand-text-secondary flex items-center gap-1 mt-0.5">
            <span className="text-brand-green text-xs">E</span>
            {profile.email}
          </p>
          <p className="font-sans text-sm text-brand-text-secondary flex items-center gap-1 mt-0.5">
            <span className="text-brand-green text-xs">P</span>
            {profile.phone}
          </p>
        </div>
      </div>

      <div className="max-w-[760px] bg-white rounded-[20px] border border-[#E6E6E6] overflow-hidden divide-y divide-brand-border">
        <button
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
      email: dashboard?.agent?.email || session?.email || "No email available",
      phone: dashboard?.agent?.phone_number || session?.phone || "No phone available",
      photo: "",
    }),
    [dashboard, session]
  );

  const handleLogout = () => {
    try {
      clearAgentSession();
      sessionStorage.removeItem("hcx_agent_registration");
      sessionStorage.removeItem("hcx_agent_review_refresh_count");
      sessionStorage.removeItem("hcx_agent_reset_otp_ok");
      localStorage.removeItem("hcx_agent_farmers_list");
    } catch {
      /* ignore */
    }
    navigate("/agent/login");
  };

  if (view === "password") {
    return <ChangePasswordScreen onBack={() => setView("main")} />;
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

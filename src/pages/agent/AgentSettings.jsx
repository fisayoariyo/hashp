import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock, HelpCircle, LogOut, ChevronRight,
  ChevronDown, ChevronUp, Eye, EyeOff, ArrowLeft,
} from "lucide-react";
import { AgentBottomNav } from "./AgentHome";
import AgentDesktopShell from "../../components/agent/AgentDesktopShell";
import { agentData, agentFAQs } from "../../mockData/agent";

// ── Change Password ────────────────────────────────────────
function ChangePasswordScreen({ onBack }) {
  const [step, setStep] = useState("otp");
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Individual refs — React rules of hooks compliant
  const r0 = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const otpRefs = [r0, r1, r2, r3];

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    if (val && i < 3) otpRefs[i + 1].current?.focus();
  };

  const handleOTPKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) otpRefs[i - 1].current?.focus();
  };

  const handleOTP = () => {
    const otp = digits.join("");
    if (otp !== "1234") { setError("Incorrect code. Use 1234 for demo."); return; }
    setError("");
    setDigits(["", "", "", ""]);
    setStep("new");
  };

  const handleSave = () => {
    if (password.length < 8) { setError("Minimum 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    setSuccess(true);
    setTimeout(() => onBack(), 2000);
  };

  if (success) {
    return (
      <div className="page-white flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center">
          <span className="text-white text-2xl">✓</span>
        </div>
        <p className="font-display font-bold text-xl text-brand-text-primary">Password updated!</p>
        <p className="font-sans text-sm text-brand-text-secondary text-center">
          Redirecting back to settings...
        </p>
      </div>
    );
  }

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-text-secondary mb-6"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>

        {step === "otp" && (
          <>
            <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">
              Enter OTP
            </h1>
            <p className="font-sans text-sm text-brand-text-secondary mb-8">
              Enter the code sent to your registered phone number to confirm.
            </p>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(i, e)}
                  className={`w-full h-16 text-center text-2xl font-bold font-display bg-white border-2 rounded-2xl focus:outline-none transition-colors ${
                    d
                      ? "border-brand-green text-brand-green"
                      : "border-brand-border"
                  } focus:border-brand-green`}
                />
              ))}
            </div>
            {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
            <p className="font-sans text-xs text-brand-text-muted">
              Demo OTP: <strong>1234</strong>
            </p>
          </>
        )}

        {step === "new" && (
          <>
            <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">
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
                <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green transition-all">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-brand-text-muted"
                  />
                  <button
                    onClick={() => setShowPass((v) => !v)}
                    className="text-brand-text-muted shrink-0"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-sm font-medium text-brand-text-primary">
                  Confirm Password
                </label>
                <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green transition-all">
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-brand-text-muted"
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
          </>
        )}
      </div>

      <div className="px-5 pb-8">
        <button
          onClick={step === "otp" ? handleOTP : handleSave}
          disabled={step === "otp" && digits.join("").length < 4}
          className="btn-primary"
        >
          {step === "otp" ? "Verify" : "Save Password"}
        </button>
      </div>
    </div>
  );
}

// ── FAQ screen ─────────────────────────────────────────────
function FAQScreen({ onBack }) {
  const [open, setOpen] = useState(null);
  const content = (
    <div className="flex-1 px-4 pt-5 pb-28 md:pb-0 overflow-y-auto scrollbar-hide">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-brand-text-secondary mb-5"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-1">FAQs</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-5">
          Answers to common questions about the agent app.
        </p>
        <div className="space-y-3">
          {agentFAQs.map((faq) => (
            <button
              key={faq.id}
              onClick={() => setOpen(open === faq.id ? null : faq.id)}
              className="w-full text-left bg-white rounded-2xl p-4 shadow-sm active:scale-[0.99] transition-transform"
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

// ── Logout modal ───────────────────────────────────────────
function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center max-w-mobile mx-auto left-0 right-0">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-t-3xl px-6 pt-6 pb-10 w-full animate-slide-up">
        <h3 className="font-display font-bold text-xl text-brand-text-primary mb-2">
          Log out?
        </h3>
        <p className="font-sans text-sm text-brand-text-secondary mb-6">
          Are you sure you want to log out of your agent account?
        </p>
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-500 text-white font-display font-semibold text-base py-4 px-6 rounded-3xl transition-all hover:brightness-90 active:scale-95"
          >
            Yes, log out
          </button>
          <button onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings screen ───────────────────────────────────
function SettingsMain({ onChangePassword, onFAQ, onLogout }) {
  const content = (
    <div className="flex-1 px-4 pt-5 pb-28 md:pb-0 overflow-y-auto scrollbar-hide">
        <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-1">
          Settings
        </h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-5">
          To update your details, contact your administrator
        </p>

        {/* Agent profile */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative shrink-0">
            <img
              src={agentData.photo}
              alt={agentData.fullName}
              className="w-16 h-16 rounded-2xl object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
              <span className="text-white text-xs">📷</span>
            </div>
          </div>
          <div>
            <p className="font-display font-bold text-lg text-brand-text-primary leading-tight">
              {agentData.fullName}
            </p>
            <p className="font-sans text-sm text-brand-text-secondary flex items-center gap-1 mt-0.5">
              <span className="text-brand-green text-xs">✉</span>
              {agentData.email}
            </p>
            <p className="font-sans text-sm text-brand-text-secondary flex items-center gap-1 mt-0.5">
              <span className="text-brand-green text-xs">📱</span>
              {agentData.phone}
            </p>
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-brand-border shadow-card">
          <button
            onClick={onChangePassword}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <Lock size={20} strokeWidth={1.8} className="text-brand-text-secondary shrink-0" />
            <span className="flex-1 font-sans text-sm font-medium text-brand-text-primary">
              Change password
            </span>
            <ChevronRight size={16} className="text-brand-text-muted shrink-0" />
          </button>
          <button
            onClick={onFAQ}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <HelpCircle size={20} strokeWidth={1.8} className="text-brand-text-secondary shrink-0" />
            <span className="flex-1 font-sans text-sm font-medium text-brand-text-primary">
              FAQs
            </span>
            <ChevronRight size={16} className="text-brand-text-muted shrink-0" />
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
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

// ── Main export ────────────────────────────────────────────
export default function AgentSettings() {
  const navigate = useNavigate();
  const [view, setView] = useState("main"); // main | password | faq
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("hcx_agent_auth");
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

import { createRef, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  CircleX,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Tractor,
  Upload,
  User,
  Users,
} from "lucide-react";
import FarmerDesktopLayout from "../../components/farmer/FarmerDesktopLayout";
import AgentStatusBadge from "../../components/agent/AgentStatusBadge";
import {
  clearFarmerSession,
  getFarmerDashboard,
  upgradeFarmerToAgent,
  verifyFarmerUpgradeOtp,
} from "../../services/cropexApi";
import { getDisplayError } from "../../utils/apiErrors";
import { extractAgentStatus, isAgentStatusApproved } from "../../utils/agentStatus";

const MOCK_AGENT_STATUS_KEY = "hcx_farmer_agent_upgrade_mock_status";

function readMockStatus() {
  try {
    const value = sessionStorage.getItem(MOCK_AGENT_STATUS_KEY);
    if (value === "under_review" || value === "verified" || value === "failed") return value;
  } catch {
    /* ignore */
  }
  return "none";
}

function writeMockStatus(status) {
  try {
    if (status === "none") {
      sessionStorage.removeItem(MOCK_AGENT_STATUS_KEY);
      return;
    }
    sessionStorage.setItem(MOCK_AGENT_STATUS_KEY, status);
  } catch {
    /* ignore */
  }
}

function ProfileCard({ profile }) {
  return (
    <div className="mb-5 flex flex-col gap-4 rounded-[20px] bg-[#F6F6F6] p-4 sm:flex-row sm:items-center">
      <div className="h-28 w-28 overflow-hidden rounded-full bg-white ring-1 ring-[#E5E7EB]">
        {profile.photo ? (
          <img src={profile.photo} alt={profile.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#9CA3AF]">
            <User size={36} />
          </div>
        )}
      </div>
      <div>
        <p className="font-display text-[32px] font-bold leading-[40px] text-[#030F0F]">{profile.name}</p>
        <p className="mt-1 font-sans text-[18px] text-[#030F0F]">
          Farmer ID : <span className="font-semibold">{profile.farmerId}</span>
        </p>
        <p className="mt-2 flex items-center gap-2 font-sans text-[18px] text-[#030F0F]">
          <Phone size={16} className="text-[#03624D]" />
          {profile.phone}
        </p>
        <p className="mt-1 flex items-center gap-2 font-sans text-[18px] text-[#030F0F]">
          <MapPin size={16} className="text-[#03624D]" />
          {profile.location}
        </p>
      </div>
    </div>
  );
}

function SettingsMenu({ modeMenuOpen, setModeMenuOpen, onAgentMode, onLogout }) {
  return (
    <div className="rounded-[20px] bg-white p-3">
      <button
        type="button"
        onClick={() => setModeMenuOpen((value) => !value)}
        className="flex h-14 w-full items-center rounded-xl px-3 text-left hover:bg-[#F8FAFC]"
      >
        <span className="inline-flex items-center gap-3 font-sans text-[22px] text-[#030F0F]">
          <Tractor size={18} />
          Farmer mode
          {modeMenuOpen ? (
            <ChevronDown size={18} className="rotate-180 text-[#030F0F]/70 transition-transform" />
          ) : (
            <ChevronDown size={18} className="text-[#030F0F]/70 transition-transform" />
          )}
        </span>
      </button>
      {modeMenuOpen && (
        <div className="ml-8 mb-1 w-[180px] rounded-[16px] border border-[#E9EDF1] bg-white p-1 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            onClick={() => setModeMenuOpen(false)}
            className="flex h-11 w-full items-center gap-3 rounded-xl px-3 font-sans text-base text-[#030F0F] hover:bg-[#F8FAFC]"
          >
            <Tractor size={16} />
            Farmer mode
          </button>
          <button
            type="button"
            onClick={() => {
              setModeMenuOpen(false);
              onAgentMode();
            }}
            className="flex h-11 w-full items-center gap-3 rounded-xl px-3 font-sans text-base text-[#030F0F] hover:bg-[#F8FAFC]"
          >
            <Users size={16} />
            Agent mode
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={onLogout}
        className="flex h-14 w-full items-center gap-3 rounded-xl px-3 text-left hover:bg-[#F8FAFC]"
      >
        <LogOut size={18} className="text-[#030F0F]/80" />
        <span className="font-sans text-[22px] text-[#030F0F]">Logout</span>
      </button>
    </div>
  );
}

function BecomeAgentForm({
  email,
  setEmail,
  bvn,
  setBvn,
  nin,
  setNin,
  fileName,
  onChooseFile,
  onSubmit,
  onBack,
  submitting,
  formError,
  photoPreview,
  hasPhoto,
}) {
  const submitDisabled = submitting || !email.trim() || !bvn.trim() || !nin.trim() || !hasPhoto;
  return (
    <div>
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-brand-text-secondary">
        <ArrowLeft size={16} />
        Go back
      </button>
      <h2 className="font-display text-[36px] font-bold leading-[44px] text-[#030F0F]">Become an agent</h2>
      <p className="mt-2 font-sans text-[20px] leading-[28px] text-[#030F0F]/75">
        Complete your verification to activate your agent account and start operating as a field agent.
      </p>

      <div className="mt-8">
        <p className="font-sans text-[24px] font-semibold text-[#030F0F]">Upload your image</p>
        <p className="mt-1 font-sans text-[18px] text-[#030F0F]/70">
          Please upload a recent passport photograph with a plain white background.
        </p>
        <label className="mt-4 relative flex h-[188px] w-full max-w-[360px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-[#D9DDE3] bg-white text-center">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Selected avatar preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 px-5 text-center">
            {photoPreview ? (
              <>
                <span className="text-sm font-semibold text-[#030F0F]">Change photo</span>
                <span className="text-xs text-[#9CA3AF]">{fileName || "JPG, JPEG, PNG less than 1MB"}</span>
              </>
            ) : (
              <>
                <Upload size={24} className="mb-3 text-[#9CA3AF]" />
                <span className="rounded-full border border-[#C7CDD8] px-4 py-1 text-xs text-[#445250]">
                  Click to upload
                </span>
                <span className="mt-2 text-xs text-[#9CA3AF]">{fileName || "JPG, JPEG, PNG less than 1MB"}</span>
              </>
            )}
          </div>
          <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={onChooseFile} />
        </label>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-sans text-[22px] font-semibold text-[#030F0F]">Email Address</span>
          <div className="flex h-[52px] items-center rounded-[15px] border border-[#E6E6E6] bg-white px-4">
            <Mail size={16} className="text-[#9CA3AF]" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your active email address"
              className="ml-3 w-full bg-transparent font-sans text-sm text-[#030F0F] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-2 block font-sans text-[22px] font-semibold text-[#030F0F]">National Identification Number (NIN)</span>
          <div className="flex h-[52px] items-center rounded-[15px] border border-[#E6E6E6] bg-white px-4">
            <User size={16} className="text-[#9CA3AF]" />
            <input
              value={nin}
              onChange={(event) => setNin(event.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="Enter your 11 digit NIN"
              className="ml-3 w-full bg-transparent font-sans text-sm text-[#030F0F] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-2 block font-sans text-[22px] font-semibold text-[#030F0F]">Bank Verification Number (BVN)</span>
          <div className="flex h-[52px] items-center rounded-[15px] border border-[#E6E6E6] bg-white px-4">
            <User size={16} className="text-[#9CA3AF]" />
            <input
              value={bvn}
              onChange={(event) => setBvn(event.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="Enter your 11 digit BVN for identity verification"
              className="ml-3 w-full bg-transparent font-sans text-sm text-[#030F0F] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </label>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitDisabled}
        className="btn-primary mt-10 max-w-[460px]"
      >
        {submitting ? "Submitting..." : "Continue"}
      </button>
      {formError ? (
        <p className="mt-3 text-sm font-medium text-red-600">{formError}</p>
      ) : null}
    </div>
  );
}

const UPGRADE_OTP_LENGTH = 6;

function VerifyEmailStep({ email, onVerify, onVerified, onBack, onResend }) {
  const [digits, setDigits] = useState(() => Array.from({ length: UPGRADE_OTP_LENGTH }, () => ""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const refs = useMemo(() => Array.from({ length: UPGRADE_OTP_LENGTH }, () => createRef()), []);

  const handleChange = (index, event) => {
    const value = event.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError("");
    if (value && index < UPGRADE_OTP_LENGTH - 1) {
      setTimeout(() => refs[index + 1].current?.focus(), 0);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key !== "Backspace") return;
    if (digits[index]) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }
    if (index > 0) refs[index - 1].current?.focus();
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, UPGRADE_OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = Array.from({ length: UPGRADE_OTP_LENGTH }, (_, index) => pasted[index] || "");
    setDigits(next);
    setError("");
    const last = Math.min(pasted.length, UPGRADE_OTP_LENGTH) - 1;
    setTimeout(() => refs[Math.max(last, 0)].current?.focus(), 0);
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < UPGRADE_OTP_LENGTH) {
      setError(`Please enter the complete ${UPGRADE_OTP_LENGTH}-digit code.`);
      return;
    }
    setVerifying(true);
    setError("");
    try {
      await onVerify(code);
      onVerified();
    } catch (err) {
      setError(getDisplayError(err, "Invalid or expired code. Try again."));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setResendMsg("");
    try {
      await onResend();
      setDigits(Array.from({ length: UPGRADE_OTP_LENGTH }, () => ""));
      setResendMsg("A new code has been sent to your email.");
    } catch (err) {
      setError(getDisplayError(err, "Could not resend code. Try again."));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-[760px]">
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-brand-text-secondary">
        <ArrowLeft size={16} />
        Go back
      </button>

      <div className="space-y-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#03624D]/10">
          <Mail size={36} className="text-[#03624D]" />
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-[36px] font-bold leading-[44px] text-[#030F0F]">Verify your email</h2>
          <p className="font-sans text-[20px] leading-[28px] text-[#030F0F]/75">
            We sent a 6-digit verification code to{" "}
            <span className="font-semibold text-[#030F0F]">{email}</span>. Enter it below to continue.
          </p>
        </div>

        <div className="grid max-w-[420px] grid-cols-6 gap-3">
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
              className={`h-[52px] w-full rounded-[15px] border bg-white text-center font-display text-[22px] font-bold outline-none transition-colors focus:border-[#03624D] ${
                digit ? "border-[#03624D] text-[#03624D]" : "border-[#E6E6E6] text-[#030F0F]"
              }`}
            />
          ))}
        </div>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
        {resendMsg ? <p className="text-sm font-medium text-[#03624D]">{resendMsg}</p> : null}

        <button
          type="button"
          onClick={handleVerify}
          disabled={verifying || digits.join("").length < UPGRADE_OTP_LENGTH}
          className="btn-primary max-w-[460px]"
        >
          {verifying ? "Verifying..." : "Verify email"}
        </button>

        <p className="font-sans text-sm text-[#030F0F]/60">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-semibold text-[#03624D] disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
}

function UnderReviewView({ onRefresh, onBack }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="max-w-[760px]">
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-brand-text-secondary">
        <ArrowLeft size={16} />
        Go back
      </button>

      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="font-display text-[36px] font-bold leading-[44px] text-[#030F0F]">
            Account Under Review
          </h2>
          <p className="font-sans text-[20px] leading-[28px] text-[#030F0F]/75">
            Your details have been submitted successfully and are currently being reviewed.
          </p>
        </div>

        <div className="flex justify-center">
          <AgentStatusBadge variant="pending" size={200} />
        </div>

        <div className="max-w-[560px] rounded-[18px] border border-[#E0EDE9] bg-[#F6F9F8] px-6 py-5">
          <p className="font-sans text-[17px] font-semibold leading-[26px] text-[#030F0F]">
            You will be able to log in as an agent and start operating once your account is verified. You will also be assigned to a designated location based on operational needs.
          </p>
          <p className="mt-3 font-sans text-[14px] leading-[22px] text-[#030F0F]/55">
            This usually takes a short while. We will notify you once your account is approved.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-primary max-w-[460px]"
        >
          {refreshing ? "Checking..." : "Refresh status"}
        </button>
      </div>
    </div>
  );
}

function StatusView({ title, message, variant, primaryLabel, secondaryLabel, onPrimary, onSecondary, onBack }) {
  const isFailed = variant === "failed";
  const accentClass = isFailed ? "bg-[#D84B50]" : "bg-[#03624D]";
  const icon = isFailed ? <CircleX size={62} className="text-white" /> : <BadgeCheck size={62} className="text-white" />;

  return (
    <div>
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-brand-text-secondary">
        <ArrowLeft size={16} />
        Go back
      </button>
      <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
        <div className={`mb-8 flex h-36 w-36 items-center justify-center rounded-full ${accentClass}`}>
          {icon}
        </div>
        <h2 className="font-display text-[48px] font-bold leading-[54px] text-[#030F0F]">{title}</h2>
        <p className="mt-3 max-w-[560px] font-sans text-[20px] leading-[28px] text-[#030F0F]/78">{message}</p>
        {primaryLabel ? (
          <button type="button" onClick={onPrimary} className="btn-primary mt-10 max-w-[460px]">
            {primaryLabel}
          </button>
        ) : null}
        {secondaryLabel ? (
          <button type="button" onClick={onSecondary} className="auth-btn-secondary mt-4 max-w-[460px]">
            {secondaryLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function FarmerSettings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboard, setDashboard] = useState(null);
  const [mockStatus, setMockStatus] = useState("none");
  const [screen, setScreen] = useState("settings");
  const [email, setEmail] = useState("");
  const [bvn, setBvn] = useState("");
  const [nin, setNin] = useState("");
  const [fileName, setFileName] = useState("");
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getFarmerDashboard()
      .then((payload) => {
        if (!active) return;
        setDashboard(payload);
      })
      .catch(() => {
        if (active) setDashboard(null);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryStatus = params.get("mockAgentStatus");
    if (queryStatus === "under_review" || queryStatus === "verified" || queryStatus === "failed") {
      setMockStatus(queryStatus);
      setScreen(queryStatus);
      writeMockStatus(queryStatus);
      return;
    }

    const stored = readMockStatus();
    setMockStatus(stored);
    if (stored !== "none") setScreen(stored);
  }, [location.search]);

  const profile = useMemo(() => {
    const farmer = dashboard?.farmer || {};
    const displayName = farmer.full_name || "Farmer";
    const id = farmer.farmer_id || "Unavailable";
    const phone = farmer.phone_number || "Unavailable";
    const state = farmer.state_of_origin || "";
    const lga = farmer.lga || "";
    const locationText =
      [state && `${state.toLowerCase()} state`, lga && `${lga.toLowerCase()} local government`]
        .filter(Boolean)
        .join(", ") || "Location unavailable";

    return {
      name: displayName,
      farmerId: id,
      phone,
      location: locationText,
      photo: farmer.profile_photo_url || "",
    };
  }, [dashboard]);

  const openFarmerModeFlow = () => {
    setModeMenuOpen(false);
    if (mockStatus === "under_review" || mockStatus === "verified" || mockStatus === "failed") {
      setScreen(mockStatus);
      return;
    }
    setScreen("form");
  };

  const handleChooseFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name || "");
    setFormError("");
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPhotoPreview(result);
        setPhotoBase64(result.split(",")[1] ?? result);
      }
    };
    reader.onerror = () => {
      setPhotoPreview("");
      setPhotoBase64("");
      setPhotoFile(null);
      setFormError("Unable to read the selected file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async () => {
    if (submitting) return;
    const normalizedEmail = String(email || "").trim();
    const normalizedBvn = String(bvn || "").replace(/\D/g, "");
    const normalizedNin = String(nin || "").replace(/\D/g, "");
    if (!normalizedEmail || !normalizedBvn || !normalizedNin) {
      setFormError("Email, NIN, and BVN are required.");
      return;
    }
    if (normalizedNin.length !== 11) {
      setFormError("NIN must be 11 digits.");
      return;
    }
    if (normalizedBvn.length !== 11) {
      setFormError("BVN must be 11 digits.");
      return;
    }
    if (!photoBase64) {
      setFormError("Please upload your photo.");
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      await upgradeFarmerToAgent({
        email: normalizedEmail,
        bvn: normalizedBvn,
        profilePhotoBase64: photoBase64,
      });
      setScreen("verify_email");
    } catch (error) {
      setFormError(getDisplayError(error, "Could not submit upgrade request. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailVerified = () => {
    setMockStatus("under_review");
    writeMockStatus("under_review");
    setScreen("under_review");
    setFileName("");
    setPhotoPreview("");
    setPhotoBase64("");
    setPhotoFile(null);
  };

  const handleVerifyUpgradeOtp = async (otp) => {
    await verifyFarmerUpgradeOtp({ otp });
  };

  const handleResendOtp = async () => {
    const normalizedEmail = String(email || "").trim();
    const normalizedBvn = String(bvn || "").replace(/\D/g, "");
    if (!normalizedEmail || !normalizedBvn || !photoBase64) {
      throw new Error("Upgrade details are missing. Go back and submit the form again.");
    }
    await upgradeFarmerToAgent({
      email: normalizedEmail,
      bvn: normalizedBvn,
      profilePhotoBase64: photoBase64,
    });
  };

  const handleRefreshStatus = async () => {
    try {
      const payload = await getFarmerDashboard();
      setDashboard(payload);
      const status = extractAgentStatus(payload);
      if (isAgentStatusApproved(status)) {
        setMockStatus("verified");
        writeMockStatus("verified");
        setScreen("verified");
      } else if (
        status === "REJECTED" ||
        status === "DENIED" ||
        status === "FAILED" ||
        status === "VERIFICATION_FAILED"
      ) {
        setMockStatus("failed");
        writeMockStatus("failed");
        setScreen("failed");
      }
    } catch {
      // stay on under_review
    }
  };

  const handleLogout = () => {
    clearFarmerSession();
    navigate("/log-in");
  };

  const handleSwitchToAgent = () => {
    setShowSwitchModal(true);
  };

  const confirmSwitchToAgent = () => {
    setShowSwitchModal(false);
    navigate("/agent/login");
  };

  const handleBack = () => {
    if (screen === "settings") {
      navigate("/farmer/home");
      return;
    }
    if (screen === "verify_email") {
      setScreen("form");
      return;
    }
    setScreen("settings");
  };

  const activeContent = (() => {
    if (screen === "form") {
      return (
        <BecomeAgentForm
          email={email}
          setEmail={setEmail}
          bvn={bvn}
          setBvn={setBvn}
          nin={nin}
          setNin={setNin}
          fileName={fileName}
          onChooseFile={handleChooseFile}
          onSubmit={handleFormSubmit}
          onBack={handleBack}
          submitting={submitting}
          formError={formError}
          photoPreview={photoPreview}
          hasPhoto={Boolean(photoFile)}
        />
      );
    }
    if (screen === "verify_email") {
      return (
        <VerifyEmailStep
          email={String(email || "").trim()}
          onVerify={handleVerifyUpgradeOtp}
          onVerified={handleEmailVerified}
          onBack={handleBack}
          onResend={handleResendOtp}
        />
      );
    }
    if (screen === "under_review") {
      return (
        <UnderReviewView
          onRefresh={handleRefreshStatus}
          onBack={handleBack}
        />
      );
    }
    if (screen === "verified") {
      return (
        <StatusView
          title="You're Verified as an Agent"
          message="Your account has been successfully verified. You can now start registering farmers."
          variant="review"
          primaryLabel="Switch to Agent"
          secondaryLabel="Continue as a farmer"
          onPrimary={handleSwitchToAgent}
          onSecondary={() => {
            setScreen("settings");
            setMockStatus("none");
            writeMockStatus("none");
          }}
          onBack={handleBack}
        />
      );
    }
    if (screen === "failed") {
      return (
        <StatusView
          title="Verification Failed"
          message="Please review your details and try again to continue using the app. If you believe this is an error, please contact support for assistance."
          variant="failed"
          primaryLabel="Retry Verification"
          secondaryLabel="Contact support"
          onPrimary={() => setScreen("form")}
          onSecondary={() => navigate("/agent/contact-support", { state: { preAuth: true, from: "verification-failed" } })}
          onBack={handleBack}
        />
      );
    }

    return (
      <div>
        <h1 className="mb-6 font-display text-[36px] font-bold leading-[44px] text-[#030F0F]">Settings</h1>
        <ProfileCard profile={profile} />
        <SettingsMenu
          modeMenuOpen={modeMenuOpen}
          setModeMenuOpen={setModeMenuOpen}
          onAgentMode={openFarmerModeFlow}
          onLogout={handleLogout}
        />
      </div>
    );
  })();

  return (
    <>
      <div className="md:hidden page-container">
        <div className="flex-1 px-4 pt-5 pb-10 overflow-y-auto scrollbar-hide">
          {activeContent}
        </div>
      </div>

      <FarmerDesktopLayout activeNav="Settings" islandContent edgeToEdge>
        {activeContent}
      </FarmerDesktopLayout>

      {showSwitchModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-[520px] rounded-[24px] bg-white p-8 shadow-xl">
            <div className="mb-4 flex justify-center text-[#03624D]">
              <Users size={44} />
            </div>
            <p className="mx-auto max-w-[360px] text-center font-sans text-[26px] leading-[34px] text-[#03624D]">
              Are you sure you want to switch to agent mode?
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowSwitchModal(false)}
                className="h-[52px] rounded-full border border-[#C6DBD5] bg-white font-sans text-[18px] text-[#03624D]"
              >
                No
              </button>
              <button
                type="button"
                onClick={confirmSwitchToAgent}
                className="h-[52px] rounded-full bg-[#03624D] font-sans text-[18px] text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

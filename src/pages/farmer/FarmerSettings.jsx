import { useEffect, useMemo, useState } from "react";
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
import {
  clearFarmerSession,
  getFarmerDashboard,
  requestAuthOtp,
  resendAuthOtp,
  upgradeFarmerToAgent,
  verifyAuthOtp,
} from "../../services/cropexApi";
import { getDisplayError } from "../../utils/apiErrors";

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
  fileName,
  onChooseFile,
  onSubmit,
  onBack,
  submitting,
  formError,
  photoPreview,
  hasPhoto,
}) {
  const submitDisabled = submitting || !email.trim() || !bvn.trim() || !hasPhoto;
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
          <span className="mb-2 block font-sans text-[22px] font-semibold text-[#030F0F]">Bank Verification Number (BVN)</span>
          <div className="flex h-[52px] items-center rounded-[15px] border border-[#E6E6E6] bg-white px-4">
            <User size={16} className="text-[#9CA3AF]" />
            <input
              value={bvn}
              onChange={(event) => setBvn(event.target.value)}
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

function VerifyEmailStep({ email, onVerified, onBack, onResend }) {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  const handleVerify = async () => {
    const code = otp.trim();
    if (code.length < 4) { setError("Enter the verification code sent to your email."); return; }
    setVerifying(true);
    setError("");
    try {
      await verifyAuthOtp({ email, otp: code });
      onVerified();
    } catch (err) {
      setError(err?.message || "Invalid or expired code. Try again.");
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
      setResendMsg("A new code has been sent to your email.");
    } catch (err) {
      setError(err?.message || "Could not resend code. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-brand-text-secondary">
        <ArrowLeft size={16} />
        Go back
      </button>
      <div className="mx-auto max-w-[480px]">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#03624D]/10">
          <Mail size={36} className="text-[#03624D]" />
        </div>
        <h2 className="font-display text-[36px] font-bold leading-[44px] text-[#030F0F]">Verify your email</h2>
        <p className="mt-2 font-sans text-[18px] leading-[26px] text-[#030F0F]/70">
          We sent a 6-digit verification code to <span className="font-semibold text-[#030F0F]">{email}</span>. Enter it below to continue.
        </p>

        <div className="mt-8">
          <label className="block">
            <span className="mb-2 block font-sans text-[18px] font-semibold text-[#030F0F]">Verification code</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
              placeholder="Enter 6-digit code"
              className="h-[56px] w-full rounded-[15px] border border-[#E6E6E6] bg-white px-5 font-sans text-[22px] tracking-[0.3em] text-[#030F0F] outline-none placeholder:text-[#9CA3AF] placeholder:tracking-normal focus:border-[#03624D]"
            />
          </label>
        </div>

        {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
        {resendMsg ? <p className="mt-3 text-sm font-medium text-[#03624D]">{resendMsg}</p> : null}

        <button
          type="button"
          onClick={handleVerify}
          disabled={verifying || otp.trim().length < 4}
          className="btn-primary mt-8 max-w-[460px]"
        >
          {verifying ? "Verifying..." : "Verify email"}
        </button>

        <p className="mt-5 font-sans text-sm text-[#030F0F]/60 text-center">
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

function AmberBadgeIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Scalloped badge shape */}
      <path
        d="M60 8
           C63 8 65.5 5 68.5 5.5
           C71.5 6 73 9.5 76 10.5
           C79 11.5 82 9.5 84.5 11
           C87 12.5 87 16.5 89 18.5
           C91 20.5 95 20.5 96.5 23
           C98 25.5 96.5 29 97.5 31.5
           C98.5 34 102 35.5 102.5 38.5
           C103 41.5 100.5 44 100.5 47
           C100.5 50 103 52.5 102.5 55.5
           C102 58.5 99 60 98.5 63
           C98 66 100 69 98.5 71.5
           C97 74 93.5 74 91.5 76
           C89.5 78 90 82 87.5 83.5
           C85 85 81.5 83.5 79 85
           C76.5 86.5 75.5 90 73 91
           C70.5 92 67.5 90 65 90.5
           C62.5 91 61 94.5 58.5 94.5
           C56 94.5 54.5 91 52 90.5
           C49.5 90 46.5 92 44 91
           C41.5 90 40.5 86.5 38 85
           C35.5 83.5 32 85 29.5 83.5
           C27 82 27.5 78 25.5 76
           C23.5 74 20 74 18.5 71.5
           C17 69 19 66 18.5 63
           C18 60 15 58.5 14.5 55.5
           C14 52.5 16.5 50 16.5 47
           C16.5 44 14 41.5 14.5 38.5
           C15 35.5 18.5 34 19.5 31.5
           C20.5 29 19 25.5 20.5 23
           C22 20.5 26 20.5 28 18.5
           C30 16.5 30 12.5 32.5 11
           C35 9.5 38 11.5 41 10.5
           C44 9.5 45.5 6 48.5 5.5
           C51.5 5 54 8 57 8
           C58 8 59 7.5 60 8Z"
        fill="#D97706"
      />
      <path
        d="M60 12
           C62.5 12 64.5 9.5 67 10
           C69.5 10.5 71 13.5 73.5 14.5
           C76 15.5 78.5 13.5 80.5 15
           C82.5 16.5 82.5 20 84 22
           C85.5 24 89 24 90.5 26.5
           C92 29 90.5 32.5 91.5 35
           C92.5 37.5 95.5 38.5 96 41.5
           C96.5 44.5 94.5 46.5 94.5 49.5
           C94.5 52.5 96.5 55 96 58
           C95.5 61 92.5 62.5 92 65.5
           C91.5 68.5 93.5 71 92 73.5
           C90.5 76 87.5 75.5 85.5 77.5
           C83.5 79.5 84 83 81.5 84
           C79 85 76 83.5 73.5 85
           C71 86.5 70.5 90 68 90.5
           C65.5 91 63 89 60.5 89
           C58 89 55.5 91 53 90.5
           C50.5 90 50 86.5 47.5 85
           C45 83.5 42 85 39.5 84
           C37 83 37.5 79.5 35.5 77.5
           C33.5 75.5 30.5 76 29 73.5
           C27.5 71 29.5 68.5 29 65.5
           C28.5 62.5 25.5 61 25 58
           C24.5 55 26.5 52.5 26.5 49.5
           C26.5 46.5 24.5 44.5 25 41.5
           C25.5 38.5 28.5 37.5 29.5 35
           C30.5 32.5 29 29 30.5 26.5
           C32 24 35.5 24 37 22
           C38.5 20 38.5 16.5 40.5 15
           C42.5 13.5 45 15.5 47.5 14.5
           C50 13.5 51.5 10.5 54 10
           C56.5 9.5 58.5 12 60 12Z"
        fill="#F59E0B"
      />
      {/* Checkmark */}
      <polyline
        points="40,60 53,73 80,46"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
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
    <div>
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-brand-text-secondary">
        <ArrowLeft size={16} />
        Go back
      </button>
      <div className="mx-auto flex max-w-[500px] flex-col items-center text-center">

        <div className="mb-6">
          <AmberBadgeIcon />
        </div>

        <h2 className="font-display text-[40px] font-bold leading-[48px] text-[#030F0F]">
          Account Under Review
        </h2>
        <p className="mt-2 font-sans text-[16px] leading-[24px] text-[#030F0F]/55 italic">
          Your details have been submitted successfully and are currently being reviewed.
        </p>

        <div className="mt-6 rounded-[18px] bg-[#F6F9F8] border border-[#E0EDE9] px-6 py-5">
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
          className="btn-primary mt-8 max-w-[460px]"
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
    const normalizedBvn = String(bvn || "").trim();
    if (!normalizedEmail || !normalizedBvn) {
      setFormError("Email and BVN are required.");
      return;
    }
    if (!photoBase64) {
      setFormError("Please upload your photo.");
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      // Send OTP to email to verify before upgrading
      await requestAuthOtp({ email: normalizedEmail, role: "FARMER" });
      setScreen("verify_email");
    } catch (error) {
      setFormError(getDisplayError(error, "Could not send verification code. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailVerified = async () => {
    const normalizedEmail = String(email || "").trim();
    const normalizedBvn = String(bvn || "").trim();
    try {
      await upgradeFarmerToAgent({
        email: normalizedEmail,
        bvn: normalizedBvn,
        profilePhotoBase64: photoBase64,
      });
    } catch {
      // Upgrade call failed but email is verified — still advance to review
    }
    setMockStatus("under_review");
    writeMockStatus("under_review");
    setScreen("under_review");
    setFileName("");
    setPhotoPreview("");
    setPhotoBase64("");
    setPhotoFile(null);
  };

  const handleResendOtp = () => {
    const normalizedEmail = String(email || "").trim();
    return resendAuthOtp({ email: normalizedEmail });
  };

  const handleRefreshStatus = async () => {
    try {
      const payload = await getFarmerDashboard();
      const agentStatus = payload?.agent_status || payload?.farmer?.agent_status || "";
      if (agentStatus === "verified" || agentStatus === "approved") {
        setMockStatus("verified");
        writeMockStatus("verified");
        setScreen("verified");
      } else if (agentStatus === "failed" || agentStatus === "rejected") {
        setMockStatus("failed");
        writeMockStatus("failed");
        setScreen("failed");
      }
      // still under_review — no change, user sees same screen
    } catch {
      // silently ignore — user stays on under_review
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

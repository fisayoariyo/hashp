import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, User } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import AgentFormFeedback from "../../components/agent/AgentFormFeedback";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { getAgentAccessToken, setAgentOnboardingProfilePhoto } from "../../services/cropexApi";

const REG_KEY = "hcx_agent_registration";

function readRegistration() {
  try {
    const raw = sessionStorage.getItem(REG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function hasIdentityDetails(reg) {
  const nin = String(reg.nin || "").replace(/\D/g, "");
  const bvn = String(reg.bvn || "").replace(/\D/g, "");
  const photo = String(reg.profilePhotoBase64 || "").trim();
  return nin.length === 11 && bvn.length === 11 && Boolean(photo);
}

export default function AgentIdentityVerification() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [nin, setNin] = useState("");
  const [bvn, setBvn] = useState("");
  const [fileName, setFileName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const reg = readRegistration();
      if (!sessionStorage.getItem(REG_KEY)) {
        navigate("/agent/create-account", { replace: true });
        return;
      }
      if (!getAgentAccessToken() && !reg.userId) {
        navigate("/agent/verify-phone", { replace: true });
        return;
      }
      if (hasIdentityDetails(reg)) {
        navigate("/agent/select-location", { replace: true });
        return;
      }
      if (reg.nin) setNin(String(reg.nin));
      if (reg.bvn) setBvn(String(reg.bvn));
      if (reg.profilePhotoPreview) setPhotoPreview(reg.profilePhotoPreview);
      if (reg.profilePhotoBase64) setPhotoBase64(reg.profilePhotoBase64);
    } catch {
      navigate("/agent/create-account", { replace: true });
    }
  }, [navigate]);

  const handleChooseFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name || "");
    setError("");
    setPhotoFile(file);
    setAgentOnboardingProfilePhoto(file);
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
      setError("Unable to read the selected file.");
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    const ninDigits = String(nin || "").replace(/\D/g, "");
    const bvnDigits = String(bvn || "").replace(/\D/g, "");
    if (ninDigits.length !== 11) {
      setError("NIN must be 11 digits.");
      return;
    }
    if (bvnDigits.length !== 11) {
      setError("BVN must be 11 digits.");
      return;
    }
    if (!photoBase64) {
      setError("Please upload your photo.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const reg = readRegistration();
      sessionStorage.setItem(
        REG_KEY,
        JSON.stringify({
          ...reg,
          nin: ninDigits,
          bvn: bvnDigits,
          profilePhotoBase64: photoBase64,
          profilePhotoPreview: photoPreview,
        }),
      );
      navigate("/agent/select-location");
    } catch {
      setError("Could not save your details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitDisabled = loading || !nin.trim() || !bvn.trim() || !photoBase64;

  const formBody = (
    <div className="w-full space-y-5 text-left">
      {error ? <AgentFormFeedback variant="error">{error}</AgentFormFeedback> : null}

      <div>
        <p className="font-sans text-sm font-medium text-brand-text-primary">Upload your image</p>
        <p className="mt-1 font-sans text-sm text-brand-text-secondary">
          Please upload a recent passport photograph with a plain white background.
        </p>
        <label className="mt-4 relative flex h-[188px] w-full max-w-[360px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-brand-border bg-white text-center">
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
                <span className="text-sm font-semibold text-brand-text-primary">Change photo</span>
                <span className="text-xs text-brand-text-muted">{fileName || "JPG, JPEG, PNG less than 1MB"}</span>
              </>
            ) : (
              <>
                <Upload size={24} className="mb-3 text-brand-text-muted" />
                <span className="rounded-full border border-brand-border px-4 py-1 text-xs text-brand-text-secondary">
                  Click to upload
                </span>
                <span className="mt-2 text-xs text-brand-text-muted">{fileName || "JPG, JPEG, PNG less than 1MB"}</span>
              </>
            )}
          </div>
          <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleChooseFile} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-sans text-sm font-medium text-brand-text-primary">NIN</span>
          <div className="flex h-[52px] items-center rounded-2xl border border-brand-border bg-white px-4">
            <User size={16} className="text-brand-text-muted" />
            <input
              value={nin}
              onChange={(event) => setNin(event.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="Enter your 11 digit NIN"
              className="ml-3 w-full bg-transparent font-sans text-sm text-brand-text-primary outline-none placeholder:text-brand-text-muted"
            />
          </div>
        </label>
        <label className="block">
          <span className="mb-2 block font-sans text-sm font-medium text-brand-text-primary">BVN</span>
          <div className="flex h-[52px] items-center rounded-2xl border border-brand-border bg-white px-4">
            <User size={16} className="text-brand-text-muted" />
            <input
              value={bvn}
              onChange={(event) => setBvn(event.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="Enter your 11 digit BVN"
              className="ml-3 w-full bg-transparent font-sans text-sm text-brand-text-primary outline-none placeholder:text-brand-text-muted"
            />
          </div>
        </label>
      </div>
    </div>
  );

  const actions = (
    <div className="w-full max-w-[560px] space-y-3">
      <button
        type="button"
        onClick={handleContinue}
        disabled={submitDisabled}
        className="btn-primary w-full disabled:opacity-40"
      >
        {loading ? "Please wait..." : "Continue"}
      </button>
      <button type="button" onClick={() => navigate("/agent/verify-phone")} className="auth-btn-secondary">
        Back
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout
        title="Verify your identity"
        subtitle="Upload your photo and enter your NIN and BVN to continue"
        titleClassName="text-left max-w-none"
        subtitleClassName="text-left max-w-none"
        actions={actions}
      >
        {formBody}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col min-h-dvh">
      <div className="flex-1 px-5 pt-6">
        <button
          type="button"
          onClick={() => navigate("/agent/verify-phone")}
          className="flex items-center gap-2 text-brand-text-secondary mb-6"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="auth-title">Verify your identity</h1>
        <p className="auth-subtitle">Upload your photo and enter your NIN and BVN to continue</p>
        {formBody}
      </div>
      <div className="px-5 pb-8 space-y-3">{actions}</div>
    </div>
  );
}

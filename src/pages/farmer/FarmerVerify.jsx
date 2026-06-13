import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Lock } from "lucide-react";
import FarmerAuthDesktopLayout from "../../components/farmer/FarmerAuthDesktopLayout";
import PasswordField from "../../components/PasswordField";
import { farmerLoginHero } from "../../mockData/farmer";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  farmerLogin,
  getFarmerAccessToken,
  setFarmerSessionFromAuthResponse,
} from "../../services/cropexApi";
import { getDisplayError } from "../../utils/apiErrors";

const FARMER_LOGIN_LAYOUT_PROPS = {
  fixedImage: farmerLoginHero.image,
  heroImagePosition: farmerLoginHero.position,
  heroTitle: farmerLoginHero.title,
  heroSubtitle: farmerLoginHero.sub,
};

export default function FarmerVerify() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [farmerId, setFarmerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!farmerId.trim() || !password) {
      setError("Please enter your Farmer ID and password.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await farmerLogin({ farmerId: farmerId.trim(), password });
      setFarmerSessionFromAuthResponse(response);
      if (!getFarmerAccessToken()) {
        setError("Sign-in succeeded but no session was returned. Contact your agent.");
        return;
      }
      navigate("/farmer/home");
    } catch (loginError) {
      setError(getDisplayError(loginError, "Invalid Farmer ID or password."));
    } finally {
      setLoading(false);
    }
  };

  const goBackButton = (
    <button
      type="button"
      onClick={() => navigate("/log-in")}
      className="mb-6 flex items-center gap-2 self-start text-brand-text-secondary"
    >
      <ArrowLeft size={18} />
      <span className="font-sans text-sm">Go back</span>
    </button>
  );

  const formFields = (
    <div className="space-y-5">
      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Farmer ID</label>
        <div
          className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-4 transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-brand-green ${
            error ? "border-red-400" : "border-brand-border"
          }`}
        >
          <BadgeCheck size={18} className="shrink-0 text-brand-text-muted" />
          <input
            type="text"
            autoComplete="username"
            value={farmerId}
            onChange={(event) => {
              setFarmerId(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => event.key === "Enter" && void handleLogin()}
            placeholder="Enter your Farmer ID here"
            className="min-w-0 flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Password</label>
        <PasswordField
          prefix={Lock}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          onKeyDown={(event) => event.key === "Enter" && void handleLogin()}
          visible={showPass}
          onToggleVisible={() => setShowPass((value) => !value)}
          autoComplete="current-password"
          placeholder="Enter your password"
          wrapperClassName={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-4 transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-brand-green ${
            error ? "border-red-400" : "border-brand-border"
          }`}
        />
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
      </div>
    </div>
  );

  const actions = (
    <div className="space-y-3">
      <button type="button" onClick={() => void handleLogin()} disabled={loading} className="btn-primary">
        {loading ? "Logging in..." : "Continue"}
      </button>
      <button type="button" onClick={() => navigate("/farmer/get-started")} className="auth-btn-secondary">
        I do not have an account
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <FarmerAuthDesktopLayout
        {...FARMER_LOGIN_LAYOUT_PROPS}
        title="Log in to your profile"
        leading={goBackButton}
        actions={actions}
      >
        {formFields}
      </FarmerAuthDesktopLayout>
    );
  }

  return (
    <div className="flex w-full flex-col bg-white" style={{ minHeight: "100dvh" }}>
      <div className="mx-auto w-full max-w-[480px] flex-1 overflow-y-auto px-5 pt-5 pb-6">
        {goBackButton}
        <h1 className="auth-title mb-8">Log in to your profile</h1>
        {formFields}
        <div className="mt-5 space-y-3 pb-[max(2rem,env(safe-area-inset-bottom))]">{actions}</div>
      </div>
    </div>
  );
}

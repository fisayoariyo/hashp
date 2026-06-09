import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import PasswordField from "../../components/PasswordField";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { CropexHttpError } from "../../services/cropexHttp";
import {
  agentLogin,
  clearAgentSession,
  getAgentAccessToken,
  getAgentDashboard,
  getAgentIdFromSession,
  getAgentSession,
  getAgentStatus,
  setAgentSessionFromAuthResponse,
} from "../../services/cropexApi";
import { getDisplayError } from "../../utils/apiErrors";
import {
  clearAgentStatusPreview,
  getAgentStatusRoute,
  inferStatusFromLoginFailure,
} from "../../utils/agentStatus";

export default function AgentLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState("");

  useEffect(() => {
    if (location.state?.sessionExpired === true) {
      setShowSessionExpired(true);
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
    }
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    try {
      const m = sessionStorage.getItem("hcx_agent_login_message");
      if (m) {
        setBanner(m);
        sessionStorage.removeItem("hcx_agent_login_message");
      }
      const pre = sessionStorage.getItem("hcx_agent_reset_email_prefill");
      if (pre) {
        setEmail(pre);
        sessionStorage.removeItem("hcx_agent_reset_email_prefill");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await agentLogin({ email: email.trim(), password });
      setAgentSessionFromAuthResponse(response);

      if (!getAgentAccessToken()) {
        clearAgentSession();
        setError("Sign-in succeeded but no session was returned. Please try again or contact support.");
        return;
      }

      const session = getAgentSession();
      const role = String(session?.role || "").trim().toUpperCase();
      if (role && role !== "AGENT") {
        clearAgentSession();
        setError("This account is not registered as an agent.");
        return;
      }

      let statusPayload = response;
      const userId = getAgentIdFromSession();
      if (userId) {
        try {
          statusPayload = await getAgentStatus(userId);
        } catch {
          try {
            statusPayload = await getAgentDashboard();
          } catch {
            /* login response may still include status */
          }
        }
      } else {
        try {
          statusPayload = await getAgentDashboard();
        } catch {
          /* login response may still include status */
        }
      }

      clearAgentStatusPreview();

      const statusRoute = getAgentStatusRoute(statusPayload);
      if (statusRoute) {
        navigate(statusRoute);
        return;
      }

      navigate("/agent/home");
    } catch (loginError) {
      if (loginError instanceof CropexHttpError) {
        const inferred = inferStatusFromLoginFailure(loginError.message, loginError.body);
        if (inferred === "PENDING") {
          try {
            const raw = sessionStorage.getItem("hcx_agent_registration");
            const reg = raw ? JSON.parse(raw) : {};
            const regEmail = String(reg.email || "").trim().toLowerCase();
            const loginEmail = email.trim().toLowerCase();
            const userId = String(reg.userId || "").trim();
            if (userId && regEmail && regEmail === loginEmail) {
              const statusPayload = await getAgentStatus(userId);
              const statusRoute = getAgentStatusRoute(statusPayload);
              if (statusRoute === "/agent/account-under-review") {
                navigate("/agent/account-under-review");
                return;
              }
            }
          } catch {
            /* fall through to login message */
          }
          setError(
            "Your account is still under administrator review. Try again after you receive approval.",
          );
          return;
        }
        if (inferred === "REJECTED") {
          setError("Your account verification was not approved. Contact support if you need help.");
          return;
        }
        if (inferred === "SUSPENDED") {
          setError("This account is suspended. Contact support for assistance.");
          return;
        }
      }
      setError(getDisplayError(loginError, "Invalid email or password."));
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
      {showSessionExpired && (
        <div className="mb-4 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
          Your session has expired. Please log in again to continue.
        </div>
      )}
      {banner && (
        <div className="mb-4 px-4 py-3 rounded-2xl bg-green-50 text-green-700 text-sm font-medium">
          {banner}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Email</label>
        <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all">
          <Mail size={18} className="text-brand-text-muted shrink-0" />
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email here" className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Password</label>
        <PasswordField
          prefix={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          visible={showPass}
          onToggleVisible={() => setShowPass((v) => !v)}
          autoComplete="current-password"
          placeholder="Enter your password"
          wrapperClassName={`flex items-center bg-white border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${error ? "border-red-400" : "border-brand-border"}`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={() => navigate("/agent/forgot-password")} className="font-sans text-sm font-semibold text-brand-green">
          Forgot password?
        </button>
      </div>
    </div>
  );

  const actions = (
    <div className="space-y-3">
      <button type="button" onClick={handleLogin} disabled={loading} className="btn-primary">
        {loading ? "Logging in..." : "Continue"}
      </button>
      <button type="button" onClick={() => navigate("/agent/create-account", { state: { returnTo: "/agent/login" } })} className="auth-btn-secondary">
        I don't have an account
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout title="Log in to your account" leading={goBackButton} actions={actions}>
        {formFields}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="w-full flex flex-col bg-white" style={{ minHeight: "100dvh" }}>
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6 w-full max-w-[480px] mx-auto">
        {goBackButton}
        <h1 className="auth-title mb-8">Log in to your account</h1>
        {formFields}
        <div className="space-y-3 pb-[max(2rem,env(safe-area-inset-bottom))] mt-5">
          <button type="button" onClick={handleLogin} disabled={loading} className="btn-primary">
            {loading ? "Logging in..." : "Continue"}
          </button>
          <button type="button" onClick={() => navigate("/agent/create-account", { state: { returnTo: "/agent/login" } })} className="auth-btn-secondary">
            I don&apos;t have an account
          </button>
        </div>
      </div>
    </div>
  );
}

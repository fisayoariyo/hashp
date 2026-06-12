import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import AgentStatusBadge from "../../components/agent/AgentStatusBadge";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { getAgentAccessToken } from "../../services/cropexApi";
import { getAgentUserIdForEmail } from "../../utils/agentStatus";

const REG_KEY = "hcx_agent_registration";

export default function AgentAccountVerified() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(REG_KEY);
      const reg = raw ? JSON.parse(raw) : {};
      const hasUserId = Boolean(reg.userId || getAgentUserIdForEmail(reg.email));
      if (!hasUserId) {
        navigate("/agent/login", { replace: true });
      }
    } catch {
      navigate("/agent/login", { replace: true });
    }
  }, [navigate]);

  const goDashboard = () => {
    if (!getAgentAccessToken()) {
      try {
        sessionStorage.setItem(
          "hcx_agent_login_message",
          "Your account is verified. Log in to continue.",
        );
      } catch {
        /* ignore */
      }
      navigate("/agent/login");
      return;
    }
    try {
      sessionStorage.removeItem(REG_KEY);
    } catch {
      /* ignore */
    }
    navigate("/agent/home");
  };

  const iconBlock = <AgentStatusBadge variant="verified" size={200} />;

  const bodyText = (
    <div className="w-full max-w-[360px] text-center">
      <p className="font-sans text-xl font-semibold leading-snug text-brand-text-primary">
        You can now start registering farmers and using all features of the app.
      </p>
    </div>
  );

  const dashboardButton = (
    <button type="button" onClick={goDashboard} className="btn-primary w-full max-w-sm">
      Go to Dashboard
    </button>
  );

  const body = (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      {iconBlock}
      {bodyText}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="h-dvh overflow-hidden">
        <AgentAuthDesktopLayout
          centerTitle
          title="You're Verified"
          subtitle="Your account has been successfully verified."
          subtitleClassName="block w-full max-w-[360px] text-center !text-[18px] !leading-snug !mb-0"
          contentClassName="!justify-between h-full min-h-0 py-6 lg:py-10"
          actions={<div className="w-full max-w-sm">{dashboardButton}</div>}
          actionsClassName="!pt-0"
        >
          <div className="flex flex-1 w-full max-w-sm flex-col items-center justify-center min-h-0 py-6">
            {body}
          </div>
        </AgentAuthDesktopLayout>
      </div>
    );
  }

  return (
    <div className="page-white flex flex-col min-h-dvh">
      <div className="flex-1 px-5 pt-6 flex flex-col">
        <button
          type="button"
          onClick={() => navigate("/agent/account-under-review")}
          className="self-start flex items-center gap-2 text-brand-text-secondary mb-6"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="auth-title text-center">You&apos;re Verified</h1>
        <p className="auth-subtitle mb-4 text-center">
          Your account has been successfully verified.
        </p>
        <div className="flex flex-1 w-full flex-col items-center justify-center">{body}</div>
        <div className="mt-8 w-full flex justify-center pb-2">{dashboardButton}</div>
      </div>
    </div>
  );
}

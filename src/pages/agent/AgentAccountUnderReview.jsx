import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import AgentStatusBadge from "../../components/agent/AgentStatusBadge";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { getAgentDashboard, getAgentSession } from "../../services/cropexApi";
import {
  clearAgentStatusPreview,
  extractAgentStatus,
  getAgentStatusPreview,
  getAgentStatusRoute,
  isAgentStatusApproved,
} from "../../utils/agentStatus";

const REG_KEY = "hcx_agent_registration";

export default function AgentAccountUnderReview() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const session = getAgentSession();
      const preview = getAgentStatusPreview();
      const raw = sessionStorage.getItem(REG_KEY);

      if (!session?.accessToken && !preview) {
        navigate("/agent/login", { replace: true });
        return;
      }

      if (!raw) return;

      const reg = JSON.parse(raw);
      if (!reg.state || !reg.lga) {
        navigate("/agent/select-location", { replace: true });
        return;
      }
      if (!session?.accessToken) {
        navigate("/agent/verify-phone", { replace: true, state: { mode: "register" } });
      }
    } catch {
      navigate("/agent/login", { replace: true });
    }
  }, [navigate]);

  const handleRefresh = async () => {
    if (!getAgentSession()?.accessToken) {
      setToast("Sign in to refresh your account status.");
      return;
    }

    setLoading(true);
    setToast("");
    try {
      const payload = await getAgentDashboard();
      clearAgentStatusPreview();

      const status = extractAgentStatus(payload);
      if (isAgentStatusApproved(status)) {
        navigate("/agent/account-verified");
        return;
      }

      const statusRoute = getAgentStatusRoute(payload);
      if (statusRoute && statusRoute !== "/agent/account-under-review") {
        navigate(statusRoute);
        return;
      }

      setToast("Still under review. An administrator must verify your account before you can use the app.");
    } catch (refreshError) {
      setToast(refreshError instanceof Error ? refreshError.message : "Could not refresh your review status.");
    } finally {
      setLoading(false);
    }
  };

  const iconBlock = <AgentStatusBadge variant="pending" className="mb-6" />;

  const bodyText = (
    <div className="w-full max-w-[36rem] self-stretch text-left">
      <p className="font-sans text-sm text-brand-text-primary mb-2">
        You will be able to start registering farmers once your account is verified.
      </p>
      <p className="font-sans text-xs text-brand-text-secondary mb-6">
        This usually takes a short while. We will notify you once an administrator has approved your application.
      </p>
      {toast && (
        <p className="font-sans text-sm text-brand-amber font-medium mb-4" role="status">
          {toast}
        </p>
      )}
    </div>
  );

  const body = (
    <>
      <div className="flex w-full justify-center">{iconBlock}</div>
      {bodyText}
    </>
  );

  const actions = (
    <div className="space-y-3 w-full max-w-sm">
      <button
        type="button"
        onClick={() => void handleRefresh()}
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? "Checking..." : "Refresh status"}
      </button>
      <button
        type="button"
        onClick={() => navigate("/agent/contact-support", { state: { preAuth: true, from: "under-review" } })}
        className="auth-btn-secondary"
      >
        Contact support
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout
        centerTitle
        title="Account Under Review"
        subtitle="Your details have been submitted successfully and are currently being reviewed."
        titleClassName="block w-full max-w-[36rem] self-stretch text-left"
        subtitleClassName="block w-full max-w-[36rem] self-stretch text-left mb-8"
        actions={actions}
      >
        <div className="flex w-full flex-col items-center">{body}</div>
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col min-h-dvh">
      <div className="flex-1 px-5 pt-6 flex flex-col">
        <button
          type="button"
          onClick={() => navigate(sessionStorage.getItem(REG_KEY) ? "/agent/select-location" : "/agent/login")}
          className="self-start flex items-center gap-2 text-brand-text-secondary mb-6"
        >
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="auth-title text-left">Account Under Review</h1>
        <p className="auth-subtitle mb-6 text-left max-w-[36rem]">
          Your details have been submitted successfully and are currently being reviewed.
        </p>
        <div className="flex w-full justify-center">{iconBlock}</div>
        {bodyText}
      </div>
      <div className="px-5 pb-8">{actions}</div>
    </div>
  );
}

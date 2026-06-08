import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import AgentStatusBadge from "../../components/agent/AgentStatusBadge";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { getAgentAccessToken, getAgentDashboard } from "../../services/cropexApi";
import {
  clearAgentStatusPreview,
  extractAgentStatus,
  getAgentStatusRoute,
  isAgentStatusApproved,
} from "../../utils/agentStatus";

const REG_KEY = "hcx_agent_registration";

export default function AgentAccountUnderReview() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const hasAgentSession = () => Boolean(getAgentAccessToken());
  const sessionActive = hasAgentSession();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(REG_KEY);

      if (!hasAgentSession()) {
        navigate("/agent/login", { replace: true });
        return;
      }

      if (!raw) return;

      const reg = JSON.parse(raw);
      if (!reg.state || !reg.lga) {
        navigate("/agent/select-location", { replace: true });
        return;
      }
    } catch {
      navigate("/agent/login", { replace: true });
    }
  }, [navigate]);

  const handleRefresh = async () => {
    if (!hasAgentSession()) {
      navigate("/agent/login", {
        replace: true,
        state: { sessionExpired: true, from: "under-review" },
      });
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

  const iconBlock = <AgentStatusBadge variant="pending" size={200} />;

  const bodyText = (
    <div className="w-full max-w-[360px] text-center">
      <p className="font-sans text-xl font-semibold leading-snug text-brand-text-primary mb-3">
        You will be able to start registering farmers once your account is verified.
      </p>
      <p className="font-sans text-base leading-relaxed text-brand-text-secondary">
        This usually takes a short while. We will notify you once an administrator has approved your application.
      </p>
      {toast && (
        <p className="mt-4 font-sans text-sm text-brand-amber font-medium" role="status">
          {toast}
        </p>
      )}
    </div>
  );

  const body = (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      {iconBlock}
      {bodyText}
    </div>
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
      <div className="h-dvh overflow-hidden">
        <AgentAuthDesktopLayout
          centerTitle
          title="Account Under Review"
          subtitle="Your details have been submitted successfully and are currently being reviewed."
          subtitleClassName="block w-full max-w-[360px] text-center !text-[18px] !leading-snug mb-8"
          contentClassName="!justify-between h-full py-2 lg:py-3"
          actions={actions}
        >
          <div className="flex h-full w-full max-w-sm flex-col items-center">{body}</div>
        </AgentAuthDesktopLayout>
      </div>
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
        <h1 className="auth-title text-center">Account Under Review</h1>
        <p className="auth-subtitle mb-6 text-center">
          Your details have been submitted successfully and are currently being reviewed.
        </p>
        <div className="flex w-full flex-col items-center">{body}</div>
      </div>
      <div className="px-5 pb-8">{actions}</div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import { agentSupportContact } from "../../mockData/agent";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function AgentContactSupport() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const body = (
    <div className="w-full max-w-md space-y-6">
      <p className="font-sans text-sm text-brand-text-secondary">
        We&apos;re here to support you. Reach out if you&apos;re having issues with registration, verification, or syncing data.
      </p>
      <div>
        <p className="font-sans font-semibold text-brand-text-primary mb-1">Customer Support</p>
        <p className="font-sans text-xs text-brand-text-secondary mb-4">Get help from our support team.</p>
        <div className="space-y-3">
          <a
            href={agentSupportContact.phoneHref}
            className="flex items-center gap-3 p-4 rounded-2xl border border-brand-border bg-white hover:bg-brand-green/5 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-green-muted flex items-center justify-center shrink-0">
              <Phone className="text-brand-green" size={20} />
            </div>
            <div>
              <p className="font-sans text-xs text-brand-text-muted">Phone</p>
              <p className="font-sans font-semibold text-brand-text-primary">{agentSupportContact.phoneDisplay}</p>
            </div>
          </a>
          <a
            href={`mailto:${agentSupportContact.email}`}
            className="flex items-center gap-3 p-4 rounded-2xl border border-brand-border bg-white hover:bg-brand-green/5 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-green-muted flex items-center justify-center shrink-0">
              <Mail className="text-brand-green" size={20} />
            </div>
            <div>
              <p className="font-sans text-xs text-brand-text-muted">Email</p>
              <p className="font-sans font-semibold text-brand-text-primary">{agentSupportContact.email}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );

  const desktopLeading = (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-brand-text-secondary mb-6 font-sans text-sm"
    >
      <ArrowLeft size={18} />
      Go back
    </button>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout
        leading={desktopLeading}
        title="Need Help?"
        subtitle="We're here to support you."
        actions={null}
      >
        {body}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col min-h-dvh">
      <div className="flex-1 px-5 pt-6">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-text-secondary mb-6">
          <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Need Help?</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-8">We&apos;re here to support you.</p>
        {body}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function AgentForgotPassword() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    navigate("/agent/verify-phone", { state: { mode: "reset-password", email: email.trim() } });
  };

  const formBody = (
    <div className="space-y-4 w-full max-w-md mx-auto md:mx-0">
      <p className="font-sans text-sm text-brand-text-secondary">
        Enter the email on your agent account. We&apos;ll send a verification code to your registered phone number.
      </p>
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Email</label>
        <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-3.5 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all">
          <Mail size={18} className="text-brand-text-muted shrink-0" />
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
            placeholder="Enter your email here"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
        </div>
      </div>
      <p className="font-sans text-xs text-brand-text-muted">Demo: use any email, then OTP <strong>1234</strong> on the next step.</p>
    </div>
  );

  const actions = (
    <div className="space-y-3 w-full max-w-sm">
      <button type="button" onClick={handleContinue} disabled={loading || !email.trim()} className="btn-primary w-full">
        {loading ? "Please wait..." : "Continue"}
      </button>
      <button
        type="button"
        onClick={() => navigate("/agent/login")}
        className="w-full py-4 rounded-3xl bg-gray-100 text-brand-green font-sans font-semibold text-sm"
      >
        Back to log in
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout title="Reset password" subtitle="We'll text a code to your registered number." actions={actions}>
        {formBody}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col min-h-dvh">
      <div className="flex-1 px-5 pt-6">
        <button type="button" onClick={() => navigate("/agent/login")} className="flex items-center gap-2 text-brand-text-secondary mb-6">
          <ArrowLeft size={18} />
          <span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">Reset password</h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-8">We&apos;ll text a code to your registered number.</p>
        {formBody}
      </div>
      <div className="px-5 pb-8">{actions}</div>
    </div>
  );
}

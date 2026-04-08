import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Smartphone, Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function AgentCreateAccount() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    gender: "Male",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    try {
      sessionStorage.setItem(
        "hcx_agent_registration",
        JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          gender: form.gender,
          password: form.password,
        })
      );
    } catch {
      /* ignore */
    }
    navigate("/agent/verify-phone", { state: { phone: form.phone, mode: "register" } });
    setLoading(false);
  };

  const formFields = (
    <div className="space-y-5">
      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Full Name</label>
        <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all">
          <User size={18} className="text-brand-text-muted shrink-0" />
          <input type="text" value={form.fullName} onChange={set("fullName")} placeholder="Write your full name here" className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Phone Number</label>
        <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all">
          <Smartphone size={18} className="text-brand-text-muted shrink-0" />
          <div className="w-px h-5 bg-brand-border shrink-0" />
          <span className="text-sm text-brand-text-secondary shrink-0 font-medium">+234</span>
          <input type="tel" inputMode="numeric" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))} placeholder="Input your phone number here" className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Email</label>
        <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all">
          <Mail size={18} className="text-brand-text-muted shrink-0" />
          <input type="email" value={form.email} onChange={set("email")} placeholder="Enter your email here" className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Gender</label>
        <div className="relative">
          <select value={form.gender} onChange={set("gender")} className="w-full bg-white border border-brand-border rounded-2xl px-4 py-4 text-sm text-brand-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all pr-10">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Create your password</label>
        <div className="flex items-center bg-white border border-brand-border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all">
          <Lock size={18} className="text-brand-text-muted shrink-0" />
          <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Create a strong password" className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none" />
          <button type="button" onClick={() => setShowPass((v) => !v)} className="text-brand-text-muted shrink-0">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
      </div>

      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-brand-border" />
        <span className="font-sans text-sm text-brand-text-muted">or</span>
        <div className="flex-1 h-px bg-brand-border" />
      </div>

      <button type="button" className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-brand-border bg-white text-brand-text-primary font-sans text-sm font-medium active:bg-gray-50 transition-colors">
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign up with Google
      </button>
    </div>
  );

  const actions = (
    <div className="space-y-3">
      <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary">
        {loading ? "Creating account..." : "Create account"}
      </button>
      <button type="button" onClick={() => navigate("/agent/login")} className="w-full py-4 rounded-3xl bg-gray-100 text-brand-green font-sans font-semibold text-sm">
        I already have an account
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout title="Create Agent Account" actions={actions}>
        {formFields}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="w-full flex flex-col bg-white" style={{ minHeight: "100dvh" }}>
      <div className="flex-1 overflow-y-auto px-5 pt-10 pb-6 w-full max-w-[480px] mx-auto">
        <h1 className="font-display font-bold text-[2rem] leading-tight text-brand-text-primary mb-8">Create Agent Account</h1>
        {formFields}
        <div className="space-y-3 pb-[max(2rem,env(safe-area-inset-bottom))] mt-5">
          <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary">
            {loading ? "Creating account..." : "Create account"}
          </button>
          <button type="button" onClick={() => navigate("/agent/login")} className="w-full text-center text-brand-green font-sans text-sm font-medium py-2">
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
}

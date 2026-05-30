import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Smartphone, Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import AgentFormFeedback from "../../components/agent/AgentFormFeedback";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { agentRegister, formatPhoneForApi } from "../../services/cropexApi";
import { getUserFacingError } from "../../utils/apiErrors";

const REG_KEY = "hcx_agent_registration";

function isGenericPhoneEmailConflictMessage(text) {
  const lower = String(text || "").toLowerCase();
  if (!/already|exist|duplicate|taken|registered|in use|conflict/.test(lower)) return false;
  return /phone|phone_number/.test(lower) && /email/.test(lower) && /\b(or|\/|and)\b/.test(lower);
}

function addConflictFieldFromHint(fields, fieldHint, text) {
  const hint = String(fieldHint || "").toLowerCase();
  const lower = String(text || "").toLowerCase();

  if (/phone|phone_number/.test(hint)) {
    fields.add("phone");
    return;
  }
  if (/email/.test(hint)) {
    fields.add("email");
    return;
  }

  if (!/already|exist|duplicate|taken|registered|in use|conflict/.test(lower)) return;
  if (isGenericPhoneEmailConflictMessage(lower)) return;

  const mentionsPhone = /phone|phone_number/.test(lower);
  const mentionsEmail = /email/.test(lower);
  if (mentionsPhone && !mentionsEmail) fields.add("phone");
  if (mentionsEmail && !mentionsPhone) fields.add("email");
}

function parse409ConflictFields(body) {
  const fields = new Set();
  const errors = body?.errors;

  if (Array.isArray(errors)) {
    errors.forEach((item) => {
      if (typeof item === "string") {
        addConflictFieldFromHint(fields, "", item);
        return;
      }
      if (!item || typeof item !== "object") return;
      const hint = [item.field, item.property, item.path, item.param].filter(Boolean).join(" ");
      const text = [item.message, item.error, item.detail].filter(Boolean).join(" ");
      addConflictFieldFromHint(fields, hint, text || hint);
    });
    return fields;
  }

  if (typeof errors === "string" && errors.trim()) {
    addConflictFieldFromHint(fields, "", errors);
  }

  return fields;
}

function getSignupFieldErrors(error) {
  const body = error?.body;
  const status = Number(error?.status || 0);
  const message = String(error?.message || "");
  const next = {};

  if (status === 409) {
    const conflictFields = parse409ConflictFields(body);

    if (conflictFields.size === 0) {
      const bodyMessage = typeof body?.message === "string" ? body.message : "";
      if (bodyMessage && !isGenericPhoneEmailConflictMessage(bodyMessage)) {
        addConflictFieldFromHint(conflictFields, "", bodyMessage);
      }
    }

    if (conflictFields.size === 0 && message && !isGenericPhoneEmailConflictMessage(message)) {
      addConflictFieldFromHint(conflictFields, "", message);
    }

    if (conflictFields.has("phone")) {
      next.phone = "This phone number is already in use.";
    }
    if (conflictFields.has("email")) {
      next.email = "This email address is already in use.";
    }

    return next;
  }

  if (/registrationrequest\.email/i.test(message) || /email tag/i.test(message)) {
    next.email = "Enter a valid email address.";
  }
  if (/registrationrequest\.phone/i.test(message) || /phone_number/i.test(message)) {
    next.phone = "Enter a valid phone number.";
  }
  if (/registrationrequest\.password/i.test(message) || /password/i.test(message)) {
    next.password = "Use a password with at least 8 characters.";
  }
  if (/registrationrequest\.full[_ ]?name/i.test(message) || /full[_ ]?name/i.test(message)) {
    next.fullName = "Enter your full name.";
  }
  if (/registrationrequest\.gender/i.test(message) || /gender/i.test(message)) {
    next.gender = "Select a valid gender.";
  }

  return next;
}

export default function AgentCreateAccount() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    gender: "Male",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const passwordMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const set = (key) => (event) => {
    setError("");
    setFieldErrors((current) => ({ ...current, [key]: "" }));
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = async () => {
    const nextFieldErrors = {};
    const nameParts = form.fullName.trim().split(/\s+/).filter(Boolean);
    if (!form.fullName.trim()) nextFieldErrors.fullName = "Full name is required.";
    else if (nameParts.length < 2) {
      nextFieldErrors.fullName = "Enter at least first and last name.";
    }
    if (!form.phone.trim()) nextFieldErrors.phone = "Phone number is required.";
    if (!form.email.trim()) nextFieldErrors.email = "Email is required.";
    if (!form.password) nextFieldErrors.password = "Password is required.";
    if (!form.confirmPassword) nextFieldErrors.confirmPassword = "Please confirm your password.";

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError("Please complete all required fields.");
      return;
    }

    if (form.password.length < 8) {
      setFieldErrors({ password: "Use at least 8 characters." });
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});
    try {
      const payload = {
        full_name: form.fullName.trim(),
        phone_number: formatPhoneForApi(form.phone),
        email: form.email.trim(),
        gender: form.gender,
        password: form.password,
      };
      await agentRegister(payload);

      sessionStorage.setItem(
        REG_KEY,
        JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone,
          phoneNumber: payload.phone_number,
          email: form.email.trim(),
          gender: form.gender,
          password: form.password,
          registeredAt: new Date().toISOString(),
        })
      );

      navigate("/agent/verify-phone", {
        state: { phone: form.phone, email: form.email.trim(), mode: "register" },
      });
    } catch (submitError) {
      try {
        sessionStorage.removeItem(REG_KEY);
      } catch {
        /* ignore */
      }
      const mappedFieldErrors = getSignupFieldErrors(submitError);
      if (Object.keys(mappedFieldErrors).length > 0) {
        setFieldErrors(mappedFieldErrors);
        setError("");
      } else if (submitError?.status === 409) {
        setError("This account could not be created. Check your phone number and email, then try again.");
      } else {
        setError(getUserFacingError(submitError, "Could not create the account.").message);
      }
    } finally {
      setLoading(false);
    }
  };

  const errorNotifier = error ? (
    <AgentFormFeedback variant="error">{error}</AgentFormFeedback>
  ) : null;

  const formFields = (
    <div className="space-y-5">
      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Full Name</label>
        <div className={`flex items-center bg-white border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${
          fieldErrors.fullName ? "border-red-400" : "border-brand-border"
        }`}>
          <User size={18} className="text-brand-text-muted shrink-0" />
          <input
            type="text"
            value={form.fullName}
            onChange={set("fullName")}
            placeholder="First and last name (e.g. Oluwaseun Adeyemi)"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
        </div>
        {fieldErrors.fullName ? <p className="font-sans text-xs text-red-500">{fieldErrors.fullName}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Phone Number</label>
        <div className={`flex items-center bg-white border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${
          fieldErrors.phone ? "border-red-400" : "border-brand-border"
        }`}>
          <Smartphone size={18} className="text-brand-text-muted shrink-0" />
          <div className="w-px h-5 bg-brand-border shrink-0" />
          <span className="text-sm text-brand-text-secondary shrink-0 font-medium">+234</span>
          <input
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(event) =>
              {
                setError("");
                setFieldErrors((current) => ({ ...current, phone: "" }));
                setForm((current) => ({
                  ...current,
                  phone: event.target.value.replace(/\D/g, ""),
                }));
              }
            }
            placeholder="Input your phone number here"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
        </div>
        {fieldErrors.phone ? <p className="font-sans text-xs text-red-500">{fieldErrors.phone}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Email</label>
        <div className={`flex items-center bg-white border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${
          fieldErrors.email ? "border-red-400" : "border-brand-border"
        }`}>
          <Mail size={18} className="text-brand-text-muted shrink-0" />
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="Enter your email here"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
        </div>
        {fieldErrors.email ? <p className="font-sans text-xs text-red-500">{fieldErrors.email}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Gender</label>
        <div className="relative">
          <select
            value={form.gender}
            onChange={set("gender")}
            className={`w-full bg-white border rounded-2xl px-4 py-4 text-sm text-brand-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all pr-10 ${
              fieldErrors.gender ? "border-red-400" : "border-brand-border"
            }`}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted pointer-events-none" />
        </div>
        {fieldErrors.gender ? <p className="font-sans text-xs text-red-500">{fieldErrors.gender}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Create your password</label>
        <div className={`flex items-center bg-white border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${
          fieldErrors.password ? "border-red-400" : "border-brand-border"
        }`}>
          <Lock size={18} className="text-brand-text-muted shrink-0" />
          <input
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={set("password")}
            placeholder="Create a strong password"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
          <button type="button" onClick={() => setShowPass((value) => !value)} className="text-brand-text-muted shrink-0">
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {fieldErrors.password ? <p className="font-sans text-xs text-red-500">{fieldErrors.password}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-sm font-medium text-brand-text-primary">Confirm password</label>
        <div className={`flex items-center bg-white border rounded-2xl px-4 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-green focus-within:border-transparent transition-all ${
          fieldErrors.confirmPassword ? "border-red-400" : "border-brand-border"
        }`}>
          <Lock size={18} className="text-brand-text-muted shrink-0" />
          <input
            type={showConfirmPass ? "text" : "password"}
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            placeholder="Re-enter your password"
            className="flex-1 bg-transparent text-sm text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none"
          />
          <button type="button" onClick={() => setShowConfirmPass((value) => !value)} className="text-brand-text-muted shrink-0">
            {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {fieldErrors.confirmPassword ? <p className="font-sans text-xs text-red-500">{fieldErrors.confirmPassword}</p> : null}
        {!fieldErrors.confirmPassword && passwordMismatch ? (
          <p className="font-sans text-xs text-red-500">Passwords do not match.</p>
        ) : null}
      </div>
    </div>
  );

  const actions = (
    <div className="space-y-3">
      {errorNotifier}
      <button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={loading || passwordMismatch}
        className="btn-primary"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
      <button
        type="button"
        onClick={() => navigate("/agent/login")}
        className="w-full py-4 rounded-3xl bg-gray-100 text-brand-green font-sans font-semibold text-sm"
      >
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
          {errorNotifier}
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading || passwordMismatch}
            className="btn-primary"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/agent/login")}
            className="w-full text-center text-brand-green font-sans text-sm font-medium py-2"
          >
            I already have an account
          </button>
        </div>
      </div>
    </div>
  );
}

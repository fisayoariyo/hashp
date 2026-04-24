import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AgentAuthDesktopLayout from "../../components/agent/AgentAuthDesktopLayout";
import AgentFormFeedback from "../../components/agent/AgentFormFeedback";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const REG_KEY = "hcx_agent_registration";
const RESET_FLAG = "hcx_agent_reset_otp_ok";

function formatPhoneForLocalStore(digits) {
  const d = String(digits || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("234")) return `+${d}`;
  if (d.startsWith("0")) return `+234${d.slice(1)}`;
  return `+234${d}`;
}

export default function AgentVerifyPhone() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const mode = location.state?.mode === "reset-password" ? "reset-password" : "register";
  const resetPhone = location.state?.phone || "";

  const [digits, setDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");

  useEffect(() => {
    if (mode !== "register") return;
    let cancelled = false;
    (async () => {
      try {
        const raw = sessionStorage.getItem(REG_KEY);
        const reg = raw ? JSON.parse(raw) : {};
        const ph = formatPhoneForLocalStore(reg.phone);
        if (!ph) {
          if (!cancelled) setError("Missing phone number. Go back to create account.");
          return;
        }
        setRegisterPhone(ph);
      } catch {
        if (!cancelled) {
          setError("Could not prepare verification code.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode]);

  const r0 = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const refs = [r0, r1, r2, r3];

  useEffect(() => {
    r0.current?.focus();
  }, []);

  useEffect(() => {
    if (mode === "register") {
      try {
        if (!sessionStorage.getItem(REG_KEY)) {
          navigate("/agent/create-account", { replace: true });
        }
      } catch {
        navigate("/agent/create-account", { replace: true });
      }
    } else if (!resetPhone) {
      navigate("/agent/forgot-password", { replace: true });
    }
  }, [mode, resetPhone, navigate]);

  const handleChange = (i, e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const val = raw.length > 1 ? raw[raw.length - 1] : raw.slice(0, 1);
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    if (val && i < 3) setTimeout(() => refs[i + 1].current?.focus(), 0);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits]; next[i] = ""; setDigits(next);
      } else if (i > 0) {
        setTimeout(() => refs[i - 1].current?.focus(), 0);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    const next = ["", "", "", ""];
    pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
    setDigits(next);
    const last = Math.min(pasted.length, 3);
    setTimeout(() => refs[last].current?.focus(), 0);
  };

  const handleContinue = async () => {
    const otp = digits.join("");
    if (otp.length < 4) { setError("Please enter the complete 4-digit code."); return; }
    setLoading(true);
    setError("");
    try {
      if (mode === "reset-password") {
        await new Promise((r) => setTimeout(r, 400));
        if (otp === "1234") {
          try {
            sessionStorage.setItem(RESET_FLAG, "1");
          } catch { /* ignore */ }
          navigate("/agent/reset-password-new", { replace: true, state: { phone: resetPhone } });
        } else {
          setError("Incorrect code, Try again");
          setDigits(["", "", "", ""]);
          setTimeout(() => r0.current?.focus(), 0);
        }
        return;
      }
      if (!registerPhone) {
        setError("Missing phone number.");
        return;
      }
      // Backend verification is paused; accept 4-digit OTP in local flow.
      navigate("/agent/select-location");
    } catch {
      setError("Verification failed.");
      setDigits(["", "", "", ""]);
      setTimeout(() => r0.current?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (mode !== "register") return;
    if (!registerPhone) return;
    setError("");
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 350));
    } catch {
      setError("Could not resend code.");
    } finally {
      setLoading(false);
    }
  };

  const otpGrid = (
    <div className={`grid grid-cols-4 mb-4 ${isDesktop ? "max-w-[232px] gap-3 mx-auto" : "gap-4"}`}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={d}
          autoComplete="one-time-code"
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className={`w-full ${isDesktop ? "h-[44px] text-[18px] rounded-[10px]" : "h-16 text-2xl rounded-2xl"} text-center font-bold font-display bg-white border-2
            focus:outline-none transition-colors
            ${d ? "border-brand-green text-brand-green" : "border-brand-border"}
            focus:border-brand-green`}
        />
      ))}
    </div>
  );

  const otpMeta = (
    <>
      {error && (
        <div className={`mb-4 ${isDesktop ? "flex justify-center" : ""}`}>
          <AgentFormFeedback variant="error" className={isDesktop ? "text-[13px]" : ""}>{error}</AgentFormFeedback>
        </div>
      )}
      <p className={`font-sans text-brand-text-secondary ${isDesktop ? "text-[14px] text-center" : "text-sm"}`}>
        I did not receive a code,{" "}
        <button type="button" onClick={handleResend} disabled={loading || mode !== "register"} className="text-brand-green font-semibold disabled:opacity-50">
          Resend Code
        </button>
      </p>
      {mode === "reset-password" && (
        <p className="font-sans text-xs text-brand-text-muted mt-2">
          Demo reset flow: use <strong>1234</strong> (no API for password reset yet).
        </p>
      )}
    </>
  );

  if (isDesktop) {
    return (
      <AgentAuthDesktopLayout
        title="Verify Phone number"
        subtitle="Enter the 4-digit code we sent to your registered phone number"
        centerTitle
        titleClassName="text-[46px] leading-[1.05] mb-2"
        subtitleClassName="text-[19px] leading-[1.3] mb-8"
        actionsClassName="mt-auto pt-7"
        actions={
          <div className="space-y-3 w-full">
            <button
              type="button"
              onClick={handleContinue}
              disabled={loading || digits.join("").length < 4}
              className="w-full h-[44px] rounded-2xl bg-brand-green text-white font-sans text-[20px] leading-none font-medium inline-flex items-center justify-center transition-all duration-200 active:scale-95 active:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
            <button
              type="button"
              onClick={() => navigate(mode === "reset-password" ? "/agent/forgot-password" : "/agent/create-account")}
              className="w-full h-[44px] rounded-2xl bg-gray-100 text-brand-green font-sans text-[20px] leading-none font-medium inline-flex items-center justify-center"
            >
              {mode === "reset-password" ? "Back" : "Edit phone number"}
            </button>
          </div>
        }
      >
        {otpGrid}
        {otpMeta}
      </AgentAuthDesktopLayout>
    );
  }

  return (
    <div className="page-white flex flex-col">
      <div className="flex-1 px-5 pt-5">
        <button
          type="button"
          onClick={() => navigate(mode === "reset-password" ? "/agent/forgot-password" : "/agent/create-account")}
          className="flex items-center gap-2 text-brand-text-secondary mb-6"
        >
          <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-3xl text-brand-text-primary mb-2">
          Verify Phone number
        </h1>
        <p className="font-sans text-sm text-brand-text-secondary mb-8">
          Enter the 4-digit code we sent to your registered phone number
        </p>
        {otpGrid}
        {otpMeta}
      </div>
      <div className="px-5 pb-8 space-y-3">
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading || digits.join("").length < 4}
          className="btn-primary"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>
        <button
          type="button"
          onClick={() => navigate(mode === "reset-password" ? "/agent/forgot-password" : "/agent/create-account")}
          className="w-full text-center text-brand-green font-sans text-sm font-medium py-2"
        >
          {mode === "reset-password" ? "Back" : "Edit phone number"}
        </button>
      </div>
    </div>
  );
}

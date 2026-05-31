import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ROLE_SELECT_COPY = {
  signup: {
    title: "Get Started",
    leftTitle: "Get Started",
    description:
      "Tell us how you'll be using Hashmar, Tap the card that best describes your role",
  },
  login: {
    title: "Log in as",
    leftTitle: "Log in to your profile",
    description:
      "Tell us how you'll be using Hashmar. Tap the card that best describes your role",
  },
};

const LEFT_HERO = {
  image: "/landing/images/farmer-card-cta.png",
  position: "62% 48%",
};

const FARMER_CARD_IMAGE = "/onboarding/farmer-role-select.png";
const FARMER_CARD_IMAGE_POSITION = "center center";
const AGENT_CARD_IMAGE = "/onboarding/agent-role-select.png";
const AGENT_CARD_IMAGE_POSITION = "center center";
const DOUBLE_TAP_MS = 400;

function useRoleSelect(mode) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("farmer");
  const lastTapRef = useRef({ role: null, time: 0 });

  const navigateForRole = (role) => {
    if (mode === "login") {
      if (role === "farmer") navigate("/farmer/verify");
      else navigate("/agent/login");
      return;
    }

    if (role === "farmer") navigate("/farmer/get-started", { state: { returnTo: "/get-started" } });
    else navigate("/agent/create-account", { state: { returnTo: "/get-started" } });
  };

  const handleContinue = () => {
    navigateForRole(selected);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const handleRoleSelect = (role) => {
    const now = Date.now();
    const { role: lastRole, time: lastTime } = lastTapRef.current;

    if (lastRole === role && now - lastTime < DOUBLE_TAP_MS) {
      navigateForRole(role);
      return;
    }

    lastTapRef.current = { role, time: now };
    setSelected(role);
  };

  return { selected, handleContinue, handleGoBack, handleRoleSelect };
}

function RoleCards({ selected, onSelect, className = "max-w-[520px]" }) {
  return (
    <div className={`grid w-full grid-cols-2 gap-4 ${className}`}>
      <button
        type="button"
        onClick={() => onSelect("farmer")}
        className={`overflow-hidden rounded-[15px] text-left transition-all duration-200 ${
          selected === "farmer"
            ? "border-2 border-brand-green shadow-md"
            : "border border-gray-200 shadow-sm"
        }`}
      >
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={FARMER_CARD_IMAGE}
            alt="Farmer"
            className="h-full w-full object-cover"
            style={{ objectPosition: FARMER_CARD_IMAGE_POSITION }}
          />
        </div>
        <div
          className={`py-4 text-center font-sans text-sm font-medium transition-colors ${
            selected === "farmer" ? "bg-brand-green text-white" : "bg-white text-brand-text-primary"
          }`}
        >
          Farmer
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelect("agent")}
        className={`overflow-hidden rounded-[15px] text-left transition-all duration-200 ${
          selected === "agent"
            ? "border-2 border-brand-green shadow-md"
            : "border border-gray-200 shadow-sm"
        }`}
      >
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={AGENT_CARD_IMAGE}
            alt="Agent"
            className="h-full w-full object-cover"
            style={{ objectPosition: AGENT_CARD_IMAGE_POSITION }}
          />
        </div>
        <div
          className={`py-4 text-center font-sans text-sm font-medium transition-colors ${
            selected === "agent" ? "bg-brand-green text-white" : "bg-white text-brand-text-primary"
          }`}
        >
          Agent
        </div>
      </button>
    </div>
  );
}

function DesktopRoleActions({ onContinue, onGoBack }) {
  return (
    <div className="flex w-full max-w-[520px] flex-col gap-3 self-center">
      <button type="button" onClick={onContinue} className="btn-primary">
        Continue
      </button>
      <button
        type="button"
        onClick={onGoBack}
        className="w-full rounded-3xl bg-[#F6F6F6] px-6 py-4 font-display text-base font-semibold text-brand-green transition-all duration-200 active:scale-95"
      >
        Go back
      </button>
    </div>
  );
}

function DesktopRoleSelect({ copy, mode }) {
  const { selected, handleContinue, handleGoBack, handleRoleSelect } = useRoleSelect(mode);

  return (
    <div className="hidden min-h-dvh gap-5 bg-white p-5 md:flex lg:gap-6 lg:p-6">
      <div className="relative w-[45%] shrink-0 overflow-hidden rounded-3xl">
        <img
          src={LEFT_HERO.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: LEFT_HERO.position }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute bottom-8 left-8 right-8 lg:bottom-10 lg:left-10 lg:right-10">
          <img
            src="/brand/HFEI_Primary_Logo_White.png"
            alt="HFEI by Hashmar Cropex Ltd"
            className="mb-4 block h-10 w-auto max-w-[200px] object-contain object-left"
            draggable="false"
          />
          <h2 className="mb-2 font-display text-[1.85rem] font-bold leading-tight text-white lg:text-[2.1rem]">
            {copy.leftTitle}
          </h2>
          <p className="font-sans text-base leading-snug text-white/85 lg:text-[1.05rem]">
            {copy.description}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between px-6 py-14 lg:px-14 lg:py-16 xl:px-20">
        <div className="flex w-full flex-col items-center">
          <h1 className="mb-3 text-center auth-desktop-title">{copy.title}</h1>
          <p className="mb-10 max-w-xs text-center font-sans text-sm leading-relaxed text-brand-text-secondary">
            {copy.description}
          </p>

          <RoleCards selected={selected} onSelect={handleRoleSelect} />
        </div>

        <DesktopRoleActions onContinue={handleContinue} onGoBack={handleGoBack} />
      </div>
    </div>
  );
}

function MobileRoleSelect({ copy, mode }) {
  const { selected, handleContinue, handleGoBack, handleRoleSelect } = useRoleSelect(mode);

  return (
    <div className="flex min-h-dvh flex-col bg-brand-bg-page px-5 pb-8 pt-14 md:hidden">
      <div>
        <h1 className="text-left font-display text-[1.75rem] font-bold leading-tight text-brand-text-primary">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-[340px] text-left font-sans text-sm font-normal leading-relaxed text-brand-text-secondary">
          {copy.description}
        </p>

        <div className="mt-10">
          <RoleCards
            selected={selected}
            onSelect={handleRoleSelect}
            className="max-w-none gap-5"
          />
        </div>
      </div>

      <div className="mt-auto flex w-full flex-col gap-3 pt-8">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full rounded-[14px] bg-brand-green px-6 py-4 font-display text-base font-semibold text-white shadow-[0_18px_12.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-95"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={handleGoBack}
          className="w-full rounded-[14px] bg-[#F6F6F6] px-6 py-4 font-display text-base font-semibold text-brand-green transition-all duration-200 active:scale-95"
        >
          Go back
        </button>
      </div>
    </div>
  );
}

export default function RoleSelect() {
  const { pathname } = useLocation();
  const mode = pathname === "/log-in" ? "login" : "signup";
  const copy = ROLE_SELECT_COPY[mode];

  return (
    <>
      <MobileRoleSelect copy={copy} mode={mode} />
      <DesktopRoleSelect copy={copy} mode={mode} />
    </>
  );
}

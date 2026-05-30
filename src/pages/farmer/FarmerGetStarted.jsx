import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const COPY = {
  heroTitle: "Get Started as a Farmer",
  heroDescription: "Contact an agent near you to create an account as a farmer",
  title: "Get started as a farmer",
  subtitle: "Contact an agent near you to create an account as a farmer",
  contactHeading: "Contact an Agent",
  phone: "+234 813 390 5285",
  phoneHref: "tel:+2348133905285",
  email: "support@hashmar.com",
  emailHref: "mailto:support@hashmar.com",
  loginPrompt: "If you have an account?",
  loginLink: "Log in to your farmer account",
};

const HERO_IMAGE = {
  src: "/landing/images/farmer-card-cta.png",
  position: "62% 48%",
};

function useGoBackTarget() {
  const location = useLocation();
  return location.state?.returnTo ?? "/get-started";
}

function FarmerHeroPanel({ className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={HERO_IMAGE.src}
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover grayscale"
        style={{ objectPosition: HERO_IMAGE.position }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10">
        <img
          src="/brand/HFEI_Primary_Logo_White.png"
          alt="HFEI by Hashmar Cropex Ltd"
          className="mb-4 block h-10 w-auto max-w-[200px] object-contain object-left"
          draggable="false"
        />
        <h2 className="mb-2 font-display text-[1.85rem] font-bold leading-tight text-white lg:text-[2.1rem]">
          {COPY.heroTitle}
        </h2>
        <p className="font-sans text-base leading-snug text-white/85 lg:text-[1.05rem]">
          {COPY.heroDescription}
        </p>
      </div>
    </div>
  );
}

function ContactRow({ icon: Icon, label, href }) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 text-brand-text-primary transition-opacity hover:opacity-80"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-brand-green text-white">
        <Icon size={18} strokeWidth={2} />
      </span>
      <span className="font-sans text-[15px] font-normal text-brand-text-primary md:text-[18px]">
        {label}
      </span>
    </a>
  );
}

function LoginPrompt() {
  return (
    <p className="font-sans text-[14px] leading-relaxed md:text-[16px] md:leading-[1.45]">
      <span className="text-brand-text-secondary">{COPY.loginPrompt} </span>
      <Link to="/farmer/verify" className="font-normal text-brand-green underline underline-offset-2">
        {COPY.loginLink}
      </Link>
    </p>
  );
}

function GoBackButton({ onClick, className = "", pill = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full bg-brand-green px-6 py-4 font-display text-base font-semibold text-white shadow-[0_18px_12.5px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-95 ${
        pill ? "rounded-full" : "rounded-[14px]"
      } ${className}`}
    >
      Go back
    </button>
  );
}

function DesktopFarmerGetStarted() {
  const navigate = useNavigate();
  const goBackTarget = useGoBackTarget();

  return (
    <div className="hidden h-dvh min-h-dvh gap-10 overflow-hidden bg-white p-5 md:flex lg:gap-14 lg:p-6 xl:gap-[72px]">
      <FarmerHeroPanel className="h-full min-h-0 w-[42%] shrink-0 rounded-3xl xl:w-[45%]" />

      <div className="flex h-full min-h-0 min-w-0 flex-1 items-stretch justify-center py-10 pl-10 pr-10 lg:py-12 lg:pl-14 lg:pr-14 xl:pl-20 xl:pr-24">
        <div className="flex h-full w-full max-w-[500px] flex-col justify-between py-8 lg:py-14">
          <div className="text-left">
            <h1 className="font-display text-[35px] font-bold leading-[1.1] text-brand-text-primary">
              {COPY.title}
            </h1>
            <p className="mt-4 font-sans text-[18px] font-normal leading-[1.35] text-brand-text-primary">
              {COPY.subtitle}
            </p>

            <p className="mt-6 font-sans text-[20px] font-normal leading-[1.35] text-brand-text-primary">
              {COPY.contactHeading}
            </p>

            <div className="mt-5 space-y-5">
              <ContactRow icon={Phone} label={COPY.phone} href={COPY.phoneHref} />
              <ContactRow icon={Mail} label={COPY.email} href={COPY.emailHref} />
            </div>

            <div className="mt-6">
              <LoginPrompt />
            </div>
          </div>

          <GoBackButton
            pill
            onClick={() => navigate(goBackTarget)}
            className="mt-12 shrink-0 lg:mt-0"
          />
        </div>
      </div>
    </div>
  );
}

function MobileFarmerGetStarted() {
  const navigate = useNavigate();
  const goBackTarget = useGoBackTarget();

  return (
    <div className="flex min-h-dvh flex-col bg-brand-bg-page md:hidden">
      <FarmerHeroPanel className="mx-5 mt-5 aspect-[4/5] max-h-[300px] shrink-0 rounded-3xl" />

      <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
        <div className="flex-1">
          <h1 className="text-left font-display text-[1.75rem] font-bold leading-tight text-brand-text-primary">
            {COPY.title}
          </h1>
          <p className="mt-3 max-w-[340px] text-left font-sans text-sm font-normal leading-relaxed text-brand-text-primary">
            {COPY.subtitle}
          </p>

          <p className="mt-8 font-sans text-[17px] font-normal text-brand-text-primary">{COPY.contactHeading}</p>

          <div className="mt-4 space-y-3">
            <ContactRow icon={Phone} label={COPY.phone} href={COPY.phoneHref} />
            <ContactRow icon={Mail} label={COPY.email} href={COPY.emailHref} />
          </div>

          <div className="mt-6">
            <LoginPrompt />
          </div>
        </div>

        <div className="mt-10 shrink-0">
          <GoBackButton onClick={() => navigate(goBackTarget)} />
        </div>
      </div>
    </div>
  );
}

export default function FarmerGetStarted() {
  return (
    <>
      <MobileFarmerGetStarted />
      <DesktopFarmerGetStarted />
    </>
  );
}

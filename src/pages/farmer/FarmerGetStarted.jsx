import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StartJourneyLeadForm from "../../components/shared/StartJourneyLeadForm";

const COPY = {
  heroTitle: "Get Started as a Farmer",
  heroDescription: "Contact an agent near you to create an account as a farmer",
  title: "Start Your Journey with Hashmar",
  subtitle:
    "Register your interest today by sharing your name, location, and phone number. We'll reach out to guide you through the next steps and available opportunities.",
};

const HERO_IMAGE = {
  src: "/landing/images/farmer-card-cta.png",
  position: "62% 48%",
};

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

function GoBackHomeButton({ className = "mb-6" }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/")}
      className={`flex items-center gap-2 self-start text-brand-text-secondary ${className}`}
    >
      <ArrowLeft size={18} />
      <span className="font-sans text-sm">Go back</span>
    </button>
  );
}

function DesktopFarmerGetStarted() {
  return (
    <div className="hidden h-dvh min-h-dvh gap-10 overflow-hidden bg-white p-5 md:flex lg:gap-14 lg:p-6 xl:gap-[72px]">
      <FarmerHeroPanel className="h-full min-h-0 w-[42%] shrink-0 rounded-3xl xl:w-[45%]" />

      <div className="flex h-full min-h-0 min-w-0 flex-1 items-stretch justify-center py-10 pl-10 pr-10 lg:py-12 lg:pl-14 lg:pr-14 xl:pl-20 xl:pr-24">
        <div className="flex w-full max-w-[500px] flex-col py-8 lg:py-14">
          <GoBackHomeButton />
          <h1 className="auth-desktop-title shrink-0 text-left">{COPY.title}</h1>
          <p className="auth-subtitle mb-0 mt-4 max-w-none text-left text-brand-text-primary desktop:text-[18px] desktop:leading-[1.45]">
            {COPY.subtitle}
          </p>
          <div className="mt-8">
            <StartJourneyLeadForm
              idPrefix="farmer-get-started-desktop"
              submitVariant="footer-full"
              showAlreadyHaveAccount
              footerClassName="mt-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileFarmerGetStarted() {
  return (
    <div className="flex min-h-dvh flex-col bg-brand-bg-page md:hidden">
      <FarmerHeroPanel className="mx-5 mt-5 aspect-[4/5] max-h-[300px] shrink-0 rounded-3xl" />

      <div className="flex flex-1 flex-col px-5 pb-8 pt-6">
        <GoBackHomeButton />
        <div className="flex-1">
          <h1 className="auth-title text-left">{COPY.title}</h1>
          <p className="auth-subtitle mb-0 mt-3 max-w-none text-left text-brand-text-primary">
            {COPY.subtitle}
          </p>

          <div className="mt-8">
            <StartJourneyLeadForm
              idPrefix="farmer-get-started-mobile"
              submitVariant="footer-full"
              showAlreadyHaveAccount
              footerClassName="mt-10 shrink-0"
            />
          </div>
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

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import LandingAbout from "../../components/landing/LandingAbout";
import LandingContact from "../../components/landing/LandingContact";
import LandingCtaBanner from "../../components/landing/LandingCtaBanner";
import LandingFaqs from "../../components/landing/LandingFaqs";
import LandingFooter from "../../components/landing/LandingFooter";
import LandingHeader from "../../components/landing/LandingHeader";
import LandingHero from "../../components/landing/LandingHero";
import LandingHowItWorks from "../../components/landing/LandingHowItWorks";
import { LANDING_FAQS } from "./landingContent";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "farmers" : "agents",
  );
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 480);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggleFaq = (index) => {
    setOpenFaqIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="landing-shell min-h-dvh">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingAbout />
        <LandingHowItWorks activeTab={activeTab} onTabChange={setActiveTab} />
        <LandingCtaBanner />
        <LandingContact />
        <LandingFaqs faqs={LANDING_FAQS} openIndex={openFaqIndex} onToggle={handleToggleFaq} />
      </main>
      <LandingFooter />
      {showBackToTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-landing-green text-white transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-landing-green/35 desktop:bottom-8 desktop:right-8"
        >
          <ArrowUp size={18} />
        </button>
      ) : null}
    </div>
  );
}

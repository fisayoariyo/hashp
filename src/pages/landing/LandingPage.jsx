import { useState } from "react";
import LandingAbout from "../../components/landing/LandingAbout";
import LandingCtaBanner from "../../components/landing/LandingCtaBanner";
import LandingFaqs from "../../components/landing/LandingFaqs";
import LandingFooter from "../../components/landing/LandingFooter";
import LandingHeader from "../../components/landing/LandingHeader";
import LandingHero from "../../components/landing/LandingHero";
import LandingHowItWorks from "../../components/landing/LandingHowItWorks";
import { LANDING_FAQS } from "./landingContent";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("agents");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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
        <LandingFaqs faqs={LANDING_FAQS} openIndex={openFaqIndex} onToggle={handleToggleFaq} />
      </main>
      <LandingFooter />
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Phone, Headphones } from "lucide-react";
import FarmerDesktopLayout from "../../components/farmer/FarmerDesktopLayout";
import { farmerFAQs } from "../../mockData/farmer";

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen((v) => !v)}
      className="w-full text-left bg-white rounded-2xl p-4 shadow-sm active:scale-[0.99] transition-transform border border-brand-border">
      <div className="flex items-start justify-between gap-3">
        <p className="font-sans font-semibold text-sm text-brand-text-primary">{faq.question}</p>
        {open
          ? <ChevronUp size={16} className="text-brand-green shrink-0 mt-0.5" />
          : <ChevronDown size={16} className="text-brand-text-muted shrink-0 mt-0.5" />}
      </div>
      {open && (
        <p className="font-sans text-sm text-brand-text-secondary mt-3 border-t border-brand-border pt-3 leading-relaxed">
          {faq.answer}
        </p>
      )}
    </button>
  );
}

function FAQContent() {
  return (
    <div className="space-y-3">
      {farmerFAQs.map((faq) => <FAQItem key={faq.id} faq={faq} />)}
    </div>
  );
}

function ContactContent() {
  return (
    <div className="max-w-md">
      <div className="bg-white rounded-2xl p-5 border border-brand-border">
        <div className="w-10 h-10 rounded-xl bg-brand-green-muted flex items-center justify-center mb-3">
          <Headphones size={20} className="text-brand-green" />
        </div>
        <h3 className="font-sans font-bold text-base text-brand-text-primary mb-1">Your Field Agent</h3>
        <p className="font-sans text-sm text-brand-text-secondary mb-4">
          For any issues with your profile or information, please contact your agent.
        </p>
        <p className="font-sans text-sm text-brand-text-primary mb-1">
          <span className="font-semibold">Agent Name:</span> Adesipe Tomide
        </p>
        <p className="font-sans text-sm text-brand-text-primary mb-5">
          <span className="font-semibold">Phone Number:</span> 08133905285
        </p>
        <a href="tel:08133905285"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-brand-green text-white font-sans font-semibold text-sm hover:bg-brand-green-dark transition-colors">
          <Phone size={16} /> Call Agent
        </a>
      </div>
    </div>
  );
}

export default function FarmerSettings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("faq");

  return (
    <>
      {/* ── MOBILE ───────────────────────────────────── */}
      <div className="md:hidden page-container">
        <div className="flex-1 px-4 pt-5 pb-10 overflow-y-auto scrollbar-hide">
          <button onClick={() => navigate("/farmer/home")}
            className="flex items-center gap-2 text-brand-text-secondary mb-5">
            <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
          </button>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-5 bg-white rounded-2xl p-1 shadow-sm">
            {[["faq", "FAQs"], ["contact", "Contact"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex-1 py-2.5 rounded-xl font-sans font-semibold text-sm transition-all ${
                  tab === key ? "bg-brand-green text-white" : "text-brand-text-secondary"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {tab === "faq" && (
            <>
              <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-1">Frequently asked questions</h1>
              <p className="font-sans text-xs text-brand-text-secondary mb-5">
                If you notice any mistake in your details, please contact your agent to make corrections.
              </p>
              <FAQContent />
            </>
          )}
          {tab === "contact" && (
            <>
              <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-1">General Support</h1>
              <p className="font-sans text-xs text-brand-text-secondary mb-5">
                For other questions or help, you can reach our support team.
              </p>
              <ContactContent />
            </>
          )}
        </div>
      </div>

      {/* ── DESKTOP: FAQ (FWDHP04) or Contact (FWDHP05) ─ */}
      <FarmerDesktopLayout activeNav="Home" islandContent edgeToEdge>
        <button onClick={() => navigate("/farmer/home")}
          className="flex items-center gap-2 text-brand-text-secondary mb-4 hover:text-brand-text-primary transition-colors">
          <ArrowLeft size={16} /><span className="font-sans text-sm">Go back</span>
        </button>

        {/* Desktop tab switcher */}
        <div className="flex gap-2 mb-6 border-b border-brand-border pb-0">
          {[["faq", "Frequently asked questions"], ["contact", "General Support"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`font-sans font-semibold text-sm pb-3 border-b-2 transition-all px-1 ${
                tab === key ? "border-brand-green text-brand-green" : "border-transparent text-brand-text-secondary hover:text-brand-text-primary"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "faq" && (
          <>
            <p className="font-sans text-sm text-brand-text-secondary mb-5">
              If you notice any mistake in your details, please contact your agent to make corrections.
            </p>
            <div className="max-w-2xl space-y-3">
              <FAQContent />
            </div>
          </>
        )}
        {tab === "contact" && (
          <>
            <p className="font-sans text-sm text-brand-text-secondary mb-5">
              For other questions or help, you can reach our support team.
            </p>
            <ContactContent />
          </>
        )}
      </FarmerDesktopLayout>
    </>
  );
}

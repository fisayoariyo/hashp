import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Smartphone } from "lucide-react";
import FarmerDesktopLayout from "../../components/farmer/FarmerDesktopLayout";
import FarmerDigitalIdCard from "../../components/agent/FarmerDigitalIdCard";
import { getFarmerIdCard } from "../../services/cropexApi";

function IDCard({ idCard }) {
  return (
    <FarmerDigitalIdCard
      photo={idCard.profilePhoto}
      name={idCard.fullName}
      farmerId={idCard.farmerId}
      cooperativeName={idCard.cooperativeName}
      agentName={idCard.agentName}
      agentSignature={idCard.agentSignature}
      issueDate={idCard.issueDate}
      expiryDate={idCard.expiryDate}
    />
  );
}

function ShareButtons({ farmerId, vertical = false }) {
  const shareViaWhatsApp = () => {
    const message = `My Farmer ID: *${farmerId}*\nVerify: https://cropex.hashmarcropex.com/verify/${farmerId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareViaSMS = () => {
    const message = `My Farmer ID: ${farmerId}. Verify: https://cropex.hashmarcropex.com/verify/${farmerId}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`, "_blank");
  };

  if (vertical) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={shareViaWhatsApp}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-sans font-semibold text-sm hover:brightness-90 transition-all"
        >
          <MessageCircle size={16} /> Share via WhatsApp
        </button>
        <button
          onClick={shareViaSMS}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-text-primary text-white font-sans font-semibold text-sm hover:brightness-90 transition-all"
        >
          <Smartphone size={16} /> Share via SMS
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <button
        onClick={shareViaWhatsApp}
        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-sans font-semibold text-sm hover:brightness-90 transition-all"
      >
        <MessageCircle size={16} /> WhatsApp
      </button>
      <button
        onClick={shareViaSMS}
        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-text-primary text-white font-sans font-semibold text-sm hover:brightness-90 transition-all"
      >
        <Smartphone size={16} /> SMS
      </button>
    </div>
  );
}

function createEmptyIdCard() {
  return {
    fullName: "-",
    farmerId: "-",
    cooperativeName: "-",
    agentName: "-",
    agentSignature: "-",
    issueDate: "-",
    expiryDate: "-",
    profilePhoto: "",
  };
}

export default function FarmerID() {
  const navigate = useNavigate();
  const [idCard, setIdCard] = useState(createEmptyIdCard());
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getFarmerIdCard()
      .then((payload) => {
        if (!active) return;
        setIdCard({
          fullName: payload?.full_name || "-",
          farmerId: payload?.farmer_id || "-",
          cooperativeName: payload?.cooperative_name || "-",
          agentName: payload?.agent_name || "-",
          agentSignature: payload?.agent_signature || "-",
          issueDate: payload?.issue_date || "-",
          expiryDate: payload?.expiry_date || "-",
          profilePhoto: payload?.profile_photo || "",
        });
        setError("");
      })
      .catch((fetchError) => {
        if (!active) return;
        setIdCard(createEmptyIdCard());
        setError(fetchError instanceof Error ? fetchError.message : "Could not load your ID card right now.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="md:hidden page-container">
        <div className="flex-1 px-4 pt-5 pb-10 overflow-y-auto scrollbar-hide">
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
              {error}
            </div>
          )}
          <button onClick={() => navigate("/farmer/home")} className="flex items-center gap-2 text-brand-text-secondary mb-4">
            <ArrowLeft size={18} />
            <span className="font-sans text-sm">Go back</span>
          </button>
          <h1 className="auth-title mb-5">Your Digital ID</h1>
          <IDCard idCard={idCard} />
          <ShareButtons farmerId={idCard.farmerId} />
        </div>
      </div>

      <FarmerDesktopLayout activeNav="Home" islandContent edgeToEdge>
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
            {error}
          </div>
        )}
        <button
          onClick={() => navigate("/farmer/home")}
          className="flex items-center gap-2 text-brand-text-secondary mb-4 hover:text-brand-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="auth-title mb-6">Your Digital ID</h1>
        <div className="max-w-xs">
          <IDCard idCard={idCard} />
          <ShareButtons farmerId={idCard.farmerId} vertical />
        </div>
      </FarmerDesktopLayout>
    </>
  );
}

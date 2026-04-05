import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, Smartphone } from "lucide-react";
import FarmerDesktopLayout from "../../components/farmer/FarmerDesktopLayout";
import { farmerData } from "../../mockData/farmer";

function IDCard() {
  return (
    <div className="bg-brand-green rounded-3xl p-5 flex flex-col items-center text-white">
      <div className="flex items-center gap-2 self-start mb-5">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
            <path d="M16 3 L28 10 L28 22 L16 29 L4 22 L4 10 Z" stroke="white" strokeWidth="2" fill="none"/>
            <ellipse cx="16" cy="16" rx="6" ry="8" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <div>
          <p className="font-display font-black text-sm tracking-widest leading-none">HASHMAR</p>
          <p className="font-sans text-[9px] text-white/60 tracking-[0.2em] uppercase">CROPEX LIMITED</p>
        </div>
      </div>

      <img src={farmerData.photo} alt={farmerData.name}
        className="w-28 h-28 rounded-2xl object-cover border-4 border-white/30 mb-4" />

      <div className="text-center mb-3">
        <p className="text-white/60 text-xs">Full Name</p>
        <p className="font-display font-bold text-xl mt-0.5">{farmerData.name}</p>
      </div>
      <div className="text-center mb-3">
        <p className="text-white/60 text-xs">Farmer ID</p>
        <p className="font-display font-bold text-base tracking-widest mt-0.5">{farmerData.id}</p>
      </div>
      <div className="text-center mb-4">
        <p className="text-white/60 text-xs">Corporative name</p>
        <p className="font-display font-bold text-sm mt-0.5">{farmerData.cooperative}</p>
      </div>

      <div className="w-full h-px bg-white/20 mb-4" />

      <div className="grid grid-cols-2 gap-4 w-full mb-4">
        <div>
          <p className="text-white/60 text-xs">Agent name</p>
          <p className="font-sans font-semibold text-sm mt-0.5">Adesipe Tomide</p>
        </div>
        <div>
          <p className="text-white/60 text-xs">Agent signature</p>
          <p className="font-sans italic text-sm mt-0.5 text-white/80">Paladise</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 w-full">
        <div className="text-center">
          <p className="text-white/60 text-xs">Issue date</p>
          <p className="font-display font-bold text-sm mt-0.5">20/04/2026</p>
        </div>
        <div className="w-px h-8 bg-white/30" />
        <div className="text-center">
          <p className="text-white/60 text-xs">Expiry date</p>
          <p className="font-display font-bold text-sm mt-0.5">20/04/2027</p>
        </div>
      </div>
    </div>
  );
}

function ShareButtons({ vertical = false }) {
  const shareViaWhatsApp = () => {
    const msg = `My Farmer ID: *${farmerData.id}*\nVerify: https://cropex.hashmarcropex.com/verify/${farmerData.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };
  const shareViaSMS = () => {
    const msg = `My Farmer ID: ${farmerData.id}. Verify: https://cropex.hashmarcropex.com/verify/${farmerData.id}`;
    window.open(`sms:?body=${encodeURIComponent(msg)}`, "_blank");
  };

  if (vertical) {
    return (
      <div className="flex flex-col gap-3 mt-4">
        <button onClick={shareViaWhatsApp}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-sans font-semibold text-sm hover:brightness-90 transition-all">
          <MessageCircle size={16} /> Share via WhatsApp
        </button>
        <button onClick={shareViaSMS}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-text-primary text-white font-sans font-semibold text-sm hover:brightness-90 transition-all">
          <Smartphone size={16} /> Share via SMS
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <button onClick={shareViaWhatsApp}
        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366] text-white font-sans font-semibold text-sm hover:brightness-90 transition-all">
        <MessageCircle size={16} /> WhatsApp
      </button>
      <button onClick={shareViaSMS}
        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-text-primary text-white font-sans font-semibold text-sm hover:brightness-90 transition-all">
        <Smartphone size={16} /> SMS
      </button>
    </div>
  );
}

export default function FarmerID() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── MOBILE ───────────────────────────────────── */}
      <div className="md:hidden page-container">
        <div className="flex-1 px-4 pt-5 pb-10 overflow-y-auto scrollbar-hide">
          <button onClick={() => navigate("/farmer/home")}
            className="flex items-center gap-2 text-brand-text-secondary mb-4">
            <ArrowLeft size={18} /><span className="font-sans text-sm">Go back</span>
          </button>
          <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-5">Your Digital ID</h1>
          <IDCard />
          <ShareButtons />
        </div>
      </div>

      {/* ── DESKTOP (FWDHP02) ────────────────────────── */}
      <FarmerDesktopLayout activeNav="Home">
        <button onClick={() => navigate("/farmer/home")}
          className="flex items-center gap-2 text-brand-text-secondary mb-4 hover:text-brand-text-primary transition-colors">
          <ArrowLeft size={16} /><span className="font-sans text-sm">Go back</span>
        </button>
        <h1 className="font-display font-bold text-2xl text-brand-text-primary mb-6">Your Digital ID</h1>
        <div className="max-w-xs">
          <IDCard />
          <ShareButtons vertical />
        </div>
      </FarmerDesktopLayout>
    </>
  );
}

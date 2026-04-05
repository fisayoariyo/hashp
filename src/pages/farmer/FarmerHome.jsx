import { useNavigate } from "react-router-dom";
import { BadgeCheck, Copy, CreditCard, User, HelpCircle, Headphones, HandCoins, Users, Link2, Home } from "lucide-react";
import FarmerDesktopLayout from "../../components/farmer/FarmerDesktopLayout";
import { farmerData } from "../../mockData/farmer";

const PRIMARY = [
  { label: "View My ID",  Icon: CreditCard,  path: "/farmer/id" },
  { label: "My Profile",  Icon: User,        path: "/farmer/profile" },
  { label: "FAQs",        Icon: HelpCircle,  path: "/farmer/settings" },
  { label: "Contact",     Icon: Headphones,  path: "/farmer/settings" },
];

const BENEFITS = [
  { label: "Access loans",      Icon: HandCoins, path: "/farmer/loans" },
  { label: "Get farm support",  Icon: Users,     path: "/farmer/support" },
  { label: "Connect to buyers", Icon: Link2,     path: "/farmer/buyers" },
];

function MobileBottomNav() {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50">
      <div className="bg-white border-t border-brand-border flex items-center justify-around px-4 py-2">
        {[
          { label: "Home", Icon: Home, path: "/farmer/home", active: true },
          { label: "My profile", Icon: User, path: "/farmer/profile", active: false },
        ].map(({ label, Icon, path, active }) => (
          <button key={path} onClick={() => navigate(path)} className="flex-1 flex flex-col items-center">
            <div className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${active ? "bg-brand-green" : ""}`}>
              <Icon size={22} strokeWidth={1.8} className={active ? "text-white" : "text-brand-green"} />
              <span className={`text-xs font-sans font-medium ${active ? "text-white" : "text-brand-text-secondary"}`}>{label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ActionGrid({ navigate }) {
  return (
    <>
      {/* Primary 2×2 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {PRIMARY.map(({ label, Icon, path }) => (
          <button key={label} onClick={() => navigate(path)}
            className="card flex flex-col gap-3 text-left hover:shadow-card-lg active:scale-[0.98] transition-all">
            <div className="w-11 h-11 rounded-xl bg-brand-green-muted flex items-center justify-center text-brand-green">
              <Icon size={22} strokeWidth={1.8} />
            </div>
            <span className="font-sans font-medium text-sm text-brand-text-primary">{label}</span>
          </button>
        ))}
      </div>

      {/* Benefits */}
      <h2 className="font-display font-bold text-lg text-brand-text-primary mb-3">Your Benefits</h2>
      <div className="grid grid-cols-2 gap-3">
        {BENEFITS.map(({ label, Icon, path }) => (
          <button key={label} onClick={() => navigate(path)}
            className="card flex flex-col gap-3 text-left hover:shadow-card-lg active:scale-[0.98] transition-all">
            <div className="w-11 h-11 rounded-xl bg-brand-green-muted flex items-center justify-center text-brand-green">
              <Icon size={22} strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-sans font-medium text-sm text-brand-text-primary">{label}</p>
              <span className="text-[10px] font-sans text-brand-text-muted bg-gray-100 px-2 py-0.5 rounded-full">Coming soon</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export default function FarmerHome() {
  const navigate = useNavigate();

  const copyID = () => navigator.clipboard?.writeText(farmerData.id).catch(() => {});

  return (
    <>
      {/* ── MOBILE ───────────────────────────────────── */}
      <div className="md:hidden page-container">
        <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto scrollbar-hide">
          {/* Welcome header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="font-display font-bold text-2xl text-brand-text-primary">
                Welcome {farmerData.firstName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-sans text-sm text-brand-text-secondary">
                  your ID: <span className="font-semibold text-brand-green">{farmerData.id}</span>
                </span>
                <button onClick={copyID} className="text-brand-text-muted hover:text-brand-green transition-colors">
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <span className="flex items-center gap-1.5 bg-brand-green text-white text-xs font-semibold font-sans px-3 py-1.5 rounded-full shrink-0">
              <BadgeCheck size={13} /> Verified
            </span>
          </div>
          <ActionGrid navigate={navigate} />
        </div>
        <MobileBottomNav />
      </div>

      {/* ── DESKTOP (FWDHP01) ────────────────────────── */}
      <FarmerDesktopLayout activeNav="Home">
        {/* 4-card primary row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {PRIMARY.map(({ label, Icon, path }) => (
            <button key={label} onClick={() => navigate(path)}
              className="bg-brand-bg-page rounded-2xl p-5 flex flex-col gap-4 text-left hover:shadow-card-lg active:scale-[0.98] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors">
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <span className="font-sans font-medium text-sm text-brand-text-primary">{label}</span>
            </button>
          ))}
        </div>

        {/* Benefits row */}
        <h2 className="font-display font-bold text-lg text-brand-text-primary mb-4">Your Benefits</h2>
        <div className="grid grid-cols-3 gap-4">
          {BENEFITS.map(({ label, Icon, path }) => (
            <button key={label} onClick={() => navigate(path)}
              className="bg-brand-bg-page rounded-2xl p-5 flex flex-col gap-4 text-left hover:shadow-card-lg active:scale-[0.98] transition-all">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-green">
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-sans font-medium text-sm text-brand-text-primary">{label}</p>
                <span className="text-[10px] font-sans text-brand-text-muted bg-white px-2 py-0.5 rounded-full">Coming soon</span>
              </div>
            </button>
          ))}
        </div>
      </FarmerDesktopLayout>
    </>
  );
}

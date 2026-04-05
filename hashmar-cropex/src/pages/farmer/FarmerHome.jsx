import { useNavigate } from "react-router-dom";
import { BadgeCheck, Copy, CreditCard, User, HelpCircle, Headphones, HandCoins, Users, Link2 } from "lucide-react";
import { farmerData } from "../../mockData/farmer";

function BottomNav({ active }) {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50">
      <div className="bg-white border-t border-brand-border flex items-center justify-around px-4 py-2">
        {[
          { label: "Home", icon: "🏠", path: "/farmer/home" },
          { label: "My profile", icon: "👤", path: "/farmer/profile" },
        ].map(({ label, icon, path }) => {
          const isActive = active === label;
          return (
            <button key={path} onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 px-6 py-2">
              <div className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all ${isActive ? "bg-brand-green" : ""}`}>
                <span className="text-xl">{icon}</span>
                <span className={`text-xs font-sans font-medium ${isActive ? "text-white" : "text-brand-text-secondary"}`}>{label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const PRIMARY = [
  { label: "View My ID",  icon: <CreditCard size={22} strokeWidth={1.8} />, path: "/farmer/id" },
  { label: "My Profile",  icon: <User size={22} strokeWidth={1.8} />,       path: "/farmer/profile" },
  { label: "FAQs",        icon: <HelpCircle size={22} strokeWidth={1.8} />, path: "/farmer/settings" },
  { label: "Contact",     icon: <Headphones size={22} strokeWidth={1.8} />, path: "/farmer/settings" },
];

const BENEFITS = [
  { label: "Access loans",      icon: <HandCoins size={22} strokeWidth={1.8} /> },
  { label: "Get farm support",  icon: <Users size={22} strokeWidth={1.8} /> },
  { label: "Connect to buyers", icon: <Link2 size={22} strokeWidth={1.8} /> },
];

export default function FarmerHome() {
  const navigate = useNavigate();

  const copyID = () => {
    navigator.clipboard?.writeText(farmerData.id).catch(() => {});
  };

  return (
    <div className="page-container">
      <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto scrollbar-hide">
        {/* Welcome header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="font-display font-bold text-2xl text-brand-text-primary">
              Welcome {farmerData.firstName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-sans text-sm text-brand-text-secondary">your ID:{" "}
                <span className="font-semibold text-brand-green">{farmerData.id}</span>
              </span>
              <button onClick={copyID} className="text-brand-text-muted hover:text-brand-green transition-colors">
                <Copy size={14} />
              </button>
            </div>
          </div>
          <span className="flex items-center gap-1.5 bg-brand-green text-white text-xs font-semibold font-sans px-3 py-1.5 rounded-full shrink-0">
            <BadgeCheck size={13} />
            Verified
          </span>
        </div>

        {/* Primary 2×2 grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {PRIMARY.map(({ label, icon, path }) => (
            <button key={label} onClick={() => navigate(path)}
              className="card flex flex-col gap-3 text-left hover:shadow-card-lg active:scale-[0.98] transition-all">
              <div className="w-11 h-11 rounded-xl bg-brand-green-muted flex items-center justify-center text-brand-green">
                {icon}
              </div>
              <span className="font-sans font-medium text-sm text-brand-text-primary">{label}</span>
            </button>
          ))}
        </div>

        {/* Benefits */}
        <h2 className="font-display font-bold text-lg text-brand-text-primary mb-3">Your Benefits</h2>
        <div className="grid grid-cols-2 gap-3">
          {BENEFITS.map(({ label, icon }) => (
            <div key={label} className="card flex flex-col gap-3 opacity-70">
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-brand-text-muted">
                {icon}
              </div>
              <div>
                <p className="font-sans font-medium text-sm text-brand-text-primary">{label}</p>
                <span className="text-[10px] font-sans text-brand-text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                  Coming soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav active="Home" />
    </div>
  );
}

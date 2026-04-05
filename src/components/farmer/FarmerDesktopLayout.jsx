import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, BadgeCheck, Copy } from "lucide-react";
import { farmerData } from "../../mockData/farmer";

const NAV = [
  { label: "Home",    path: "/farmer/home",    Icon: Home },
  { label: "Profile", path: "/farmer/profile", Icon: User },
];

function HCXLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 rounded-xl border-2 border-brand-green flex items-center justify-center shrink-0">
        <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
          <path d="M20 4 L35 12 L35 28 L20 36 L5 28 L5 12 Z" stroke="#155235" strokeWidth="2" fill="none"/>
          <ellipse cx="20" cy="20" rx="7" ry="9" stroke="#155235" strokeWidth="1.5" fill="none"/>
          <path d="M20 11 Q25 17 20 29" stroke="#155235" strokeWidth="1.5" fill="none"/>
          <path d="M20 11 Q15 17 20 29" stroke="#155235" strokeWidth="1.5" fill="none"/>
          <circle cx="28" cy="14" r="2.5" fill="#d4900a"/>
        </svg>
      </div>
      <div>
        <p className="font-display font-black text-base text-brand-green tracking-widest uppercase leading-none">
          HASHMAR
        </p>
        <p className="font-sans text-[9px] text-brand-text-muted tracking-[0.25em] uppercase leading-none mt-0.5">
          CROPEX LIMITED
        </p>
      </div>
    </div>
  );
}

export default function FarmerDesktopLayout({ children, activeNav }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = activeNav || (pathname.includes("profile") ? "Profile" : "Home");

  const copyID = () => {
    navigator.clipboard?.writeText(farmerData.id).catch(() => {});
  };

  return (
    <div className="hidden md:flex flex-col min-h-screen bg-brand-bg-page">
      {/* ── Top header ────────────────────────────── */}
      <header className="bg-white border-b border-brand-border px-8 py-4 flex items-center justify-between shrink-0">
        <HCXLogo />

        {/* Welcome + ID */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-brand-text-primary">
              Welcome, {farmerData.firstName}
            </span>
            <span className="flex items-center gap-1 bg-brand-green text-white text-xs font-semibold font-sans px-2.5 py-1 rounded-full">
              <BadgeCheck size={11} />
              Verified
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-sans text-sm text-brand-text-secondary">
              your ID:{" "}
              <span className="font-semibold text-brand-green">{farmerData.id}</span>
            </span>
            <button
              onClick={copyID}
              className="text-brand-text-muted hover:text-brand-green transition-colors"
              title="Copy ID"
            >
              <Copy size={12} />
            </button>
          </div>
        </div>

        {/* Spacer to balance layout */}
        <div className="w-40" />
      </header>

      <div className="flex flex-1">
        {/* ── Sidebar ───────────────────────────────── */}
        <aside className="w-64 bg-white border-r border-brand-border flex flex-col py-6 px-4 shrink-0">
          <nav className="flex flex-col gap-1">
            {NAV.map(({ label, path, Icon }) => {
              const isActive = active === label;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans font-medium text-sm transition-all cursor-pointer w-full text-left ${
                    isActive
                      ? "bg-brand-green text-white"
                      : "text-brand-text-secondary hover:bg-brand-green-muted hover:text-brand-green"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Main content ──────────────────────────── */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-card p-8 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

import { Home, Settings, Tractor, Plus, Headset, Wifi, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { agentData } from "../../mockData/agent";

export default function AgentDesktopShell({ active = "dashboard", isOnline = true, children }) {
  const navigate = useNavigate();
  const links = [
    { key: "dashboard", label: "Dashboard", icon: Home, path: "/agent/home" },
    { key: "farmers", label: "Farmers", icon: Tractor, path: "/agent/saved-farmers" },
    { key: "settings", label: "Settings", icon: Settings, path: "/agent/settings" },
    { key: "support", label: "Help & Support", icon: Headset, path: "/agent/contact-support" },
  ];

  return (
    <div className="hidden md:block min-h-dvh bg-brand-bg-page p-6">
      <div className="max-w-[1400px] mx-auto min-h-[calc(100dvh-3rem)] bg-white rounded-[28px] border border-[#e5e7eb] shadow-[0_8px_24px_rgba(15,23,42,0.06)] overflow-hidden flex">
      <aside className="w-64 bg-white px-6 py-8">
        <img src="/brand/HFEI_Primary_Logo_.png" alt="HFEI by Hashmar Cropex Ltd" className="h-10 w-auto object-contain mb-12" />
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const activeLink = active === link.key;
            return (
              <button
                key={link.key}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-colors ${
                  activeLink ? "bg-brand-green text-white" : "text-brand-text-secondary hover:bg-brand-green/10"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-6 flex flex-col min-h-0 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 w-full max-w-[1180px] mx-auto">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display font-bold text-2xl text-brand-text-primary">Welcome, Agent {agentData.name}</h1>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold ${isOnline ? "bg-brand-green/15 text-brand-green" : "bg-slate-100 text-slate-600"}`}>
                {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                {isOnline ? "Online ✓" : "Offline"}
              </div>
            </div>
            <p className="font-sans text-sm text-brand-text-secondary mt-0.5">
              Ready to manage farmer registration and track activities
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/agent/register-farmer")}
            className="inline-flex items-center justify-center gap-2 shrink-0 px-5 py-2.5 rounded-full bg-brand-green text-white font-sans font-semibold text-sm"
          >
            <Plus size={16} strokeWidth={2.5} /> Register New Farmer
          </button>
        </div>
        <div className="w-full max-w-[1180px] mx-auto flex flex-col flex-1 min-h-0 min-h-[320px]">
          {children}
        </div>
      </main>
      </div>
    </div>
  );
}

import { Headset, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { agentData } from "../../mockData/agent";
import homeIcon from "../../assets/comps/home-11.svg";
import tractorIcon from "../../assets/comps/tractor.svg";
import settingsIcon from "../../assets/comps/settings-03.svg";
import wifiOffIcon from "../../assets/comps/wifi-off-02.svg";

export default function AgentDesktopShell({ active = "dashboard", children }) {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);

    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);
    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  const links = [
    { key: "dashboard", label: "Dashboard", icon: homeIcon, path: "/agent/home" },
    { key: "farmers", label: "Farmers", icon: tractorIcon, path: "/agent/saved-farmers" },
    { key: "settings", label: "Settings", icon: settingsIcon, path: "/agent/settings" },
    { key: "help", label: "Help & Support", lucide: Headset, path: "/agent/contact-support" },
  ];

  return (
    <div className="hidden md:flex min-h-dvh bg-white">
      <aside className="w-64 bg-white border-r border-brand-border px-6 py-8">
        <img src="/brand/HFEI_Primary_Logo_.png" alt="HFEI by Hashmar Cropex Ltd" className="h-10 w-auto object-contain mb-12" />
        <nav className="space-y-2">
          {links.map((link) => {
            const activeLink = active === link.key;
            const LucideIcon = link.lucide;
            return (
              <button
                key={link.key}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-colors ${
                  activeLink ? "bg-brand-green text-white" : "text-brand-text-secondary hover:bg-brand-green/10"
                }`}
              >
                {link.icon ? (
                  <img
                    src={link.icon}
                    alt=""
                    className={`w-[18px] h-[18px] object-contain ${activeLink ? "brightness-0 invert" : ""}`}
                  />
                ) : (
                  <LucideIcon size={18} />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-6 flex flex-col min-h-0 min-w-0 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 max-w-5xl mx-auto w-full">
          <div className="flex items-start gap-3">
            <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-text-primary">
              Welcome, Agent {agentData.name}
            </h1>
            <p className="font-sans text-sm text-brand-text-secondary mt-0.5">
              Ready to manage farmer registration and track activities
            </p>
            </div>
            {isOnline ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-white mt-1">
                Online <span aria-hidden="true">✓</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-border px-3 py-1 text-xs font-semibold text-brand-text-secondary mt-1">
                <img src={wifiOffIcon} alt="" className="w-3.5 h-3.5" />
                Offline
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate("/agent/register-farmer")}
            className="inline-flex items-center justify-center gap-2 shrink-0 px-5 py-2.5 rounded-full bg-brand-green text-white font-sans font-semibold text-sm"
          >
            <Plus size={16} strokeWidth={2.5} /> Register New Farmer
          </button>
        </div>
        <div className="max-w-5xl mx-auto w-full flex flex-col flex-1 min-h-0 min-h-[320px]">
          {children}
        </div>
      </main>
    </div>
  );
}

import { Home, Settings, Tractor, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { agentData } from "../../mockData/agent";

export default function AgentDesktopShell({ active = "dashboard", children }) {
  const navigate = useNavigate();
  const links = [
    { key: "dashboard", label: "Dashboard", icon: Home, path: "/agent/home" },
    { key: "farmers", label: "Farmers", icon: Tractor, path: "/agent/saved-farmers" },
    { key: "settings", label: "Settings", icon: Settings, path: "/agent/settings" },
  ];

  return (
    <div className="hidden md:flex min-h-dvh bg-brand-bg-page">
      <aside className="w-64 bg-white border-r border-brand-border px-6 py-8">
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

      <main className="flex-1 p-4 md:p-6 flex flex-col min-h-0 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-text-primary">
              Welcome, Agent {agentData.name}
            </h1>
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
        <div className="bg-white rounded-2xl border border-brand-border p-4 md:p-5 max-w-5xl mx-auto w-full flex flex-col flex-1 min-h-0 min-h-[320px]">
          {children}
        </div>
      </main>
    </div>
  );
}

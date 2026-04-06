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

      <main className="flex-1 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-4xl text-brand-text-primary">Welcome, Agent {agentData.name}</h1>
            <p className="font-sans text-brand-text-secondary">Ready to manage farmer registration and track activities</p>
          </div>
          <button
            onClick={() => navigate("/agent/register-farmer")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-green text-white font-semibold"
          >
            <Plus size={16} /> Register New Farmer
          </button>
        </div>
        <div className="bg-white rounded-3xl p-6 min-h-[calc(100dvh-180px)] flex flex-col min-h-0">{children}</div>
      </main>
    </div>
  );
}

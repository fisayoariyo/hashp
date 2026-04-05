import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Settings, UserPlus, Search, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { agentData } from "../../mockData/agent";

// Custom tractor icon
function TractorIcon({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="7" cy="17" r="2.5" /><circle cx="17" cy="18" r="1.5" />
      <path d="M5 17H3V9l4-4h8l2 4h2v4h-2" /><path d="M9 5v8" /><path d="M3 13h12" />
    </svg>
  );
}

export function AgentBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tabs = [
    { label: "Dashboard", icon: <Home size={22} strokeWidth={1.8} />, path: "/agent/home" },
    { label: "Farmers", icon: <TractorIcon />, path: "/agent/saved-farmers" },
    { label: "Settings", icon: <Settings size={22} strokeWidth={1.8} />, path: "/agent/settings" },
  ];
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50">
      <div className="bg-white border-t border-brand-border flex items-center justify-around px-2 py-2">
        {tabs.map(({ label, icon, path }) => {
          const active = pathname === path || (path === "/agent/saved-farmers" && pathname.startsWith("/agent/saved"));
          return (
            <button key={path} onClick={() => navigate(path)} className="flex-1 flex flex-col items-center">
              <div className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${active ? "bg-brand-green" : ""}`}>
                <span className={active ? "text-white" : "text-brand-green"}>{icon}</span>
                <span className={`text-xs font-sans font-medium ${active ? "text-white" : "text-brand-text-secondary"}`}>{label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AgentHome() {
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSyncing(false); setSyncDone(true);
    setTimeout(() => setSyncDone(false), 3000);
  };

  return (
    <div className="page-container">
      {/* Dark green header */}
      <div className="bg-brand-green px-4 pt-6 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display font-bold text-xl text-white">Welcome, Agent {agentData.name}</h1>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20">
            <Wifi size={12} className="text-white" />
            <span className="text-xs font-sans font-semibold text-white">{agentData.status}</span>
          </div>
        </div>
        <p className="font-sans text-white/70 text-sm mb-5">
          Ready to manage farmer registration and track activities
        </p>
        <div className="space-y-3">
          {/* Registered Farmers — wide card */}
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">🚜</span>
              <span className="text-xs font-sans font-semibold text-brand-amber bg-brand-amber/20 px-2 py-0.5 rounded-full">+12%</span>
            </div>
            <p className="font-sans text-white/70 text-sm">Registered Farmers</p>
            <p className="font-display font-bold text-4xl text-white mt-1">{agentData.totalFarmersRegistered}</p>
          </div>
          {/* Two half-width cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl">🪪</span>
                <span className="text-xs font-sans font-semibold text-brand-amber bg-brand-amber/20 px-2 py-0.5 rounded-full">+12%</span>
              </div>
              <p className="font-sans text-white/70 text-xs">Digital IDs Issued</p>
              <p className="font-display font-bold text-2xl text-white mt-1">{agentData.syncedFarmers}</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <RefreshCw size={18} className="text-white/70" />
                <button onClick={handleSync} disabled={syncing}
                  className="flex items-center gap-1 text-brand-amber text-xs font-semibold">
                  <RefreshCw size={11} className={syncing ? "animate-spin" : ""} /> Sync now
                </button>
              </div>
              <p className="font-sans text-white/70 text-xs">Pending sync</p>
              <p className="font-display font-bold text-2xl text-white mt-1">
                {String(agentData.pendingSync).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* White body */}
      <div className="flex-1 px-4 pt-5 pb-28 overflow-y-auto scrollbar-hide space-y-4">
        {/* Action cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-green-muted flex items-center justify-center">
              <UserPlus size={22} className="text-brand-green" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-brand-text-primary">Register new farmer</p>
              <p className="font-sans text-xs text-brand-text-muted mt-0.5">Capture biometric and personal data</p>
            </div>
            <button onClick={() => navigate("/agent/register-farmer")} className="btn-amber py-2.5 text-xs">
              + Start Registration
            </button>
          </div>
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-green-muted flex items-center justify-center">
              <Search size={22} className="text-brand-green" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-brand-text-primary">Farmer lookup</p>
              <p className="font-sans text-xs text-brand-text-muted mt-0.5">Search by ID or name</p>
            </div>
            <button onClick={() => navigate("/agent/saved-farmers")} className="btn-amber py-2.5 text-xs">
              🔍 Search
            </button>
          </div>
        </div>

        {/* Sync status */}
        {syncDone && (
          <div className="bg-brand-green/10 border border-brand-green/20 rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-brand-green text-xs font-semibold">✓ Sync complete — all records uploaded</span>
          </div>
        )}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <WifiOff size={16} className="text-brand-text-secondary" />
              <p className="font-sans font-semibold text-sm text-brand-text-primary">Offline Status</p>
            </div>
            <button onClick={handleSync} disabled={syncing}
              className="flex items-center gap-1 text-brand-amber text-xs font-semibold">
              <RefreshCw size={12} className={syncing ? "animate-spin" : ""} /> Sync now
            </button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-sans text-sm text-brand-text-secondary">Synchronization Progress</p>
            <p className="font-sans text-sm font-semibold">{agentData.syncProgress}%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full mb-3">
            <div className="h-2 bg-brand-green rounded-full transition-all" style={{ width: `${agentData.syncProgress}%` }} />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-brand-green flex items-center justify-center">
                <span className="text-white text-[8px]">✓</span>
              </div>
              <span className="font-sans text-xs text-brand-text-secondary">{agentData.completedSync} Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-brand-amber" />
              <span className="font-sans text-xs text-brand-text-secondary">{agentData.pendingSync} Pending</span>
            </div>
          </div>
        </div>
      </div>
      <AgentBottomNav />
    </div>
  );
}

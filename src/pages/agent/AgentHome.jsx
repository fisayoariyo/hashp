import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Home, Settings, UserPlus, Search, RefreshCw, Wifi, WifiOff } from "lucide-react";
import AgentDesktopShell from "../../components/agent/AgentDesktopShell";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { agentData, agentRegisteredFarmers } from "../../mockData/agent";
import {
  getFarmerSyncCountsFromStorage,
  syncAllPendingFarmersStorage,
} from "../../hooks/useAgentFarmersSync";

// ── Asset imports ─────────────────────────────────────────
import cardPatternDesktop from "../../assets/comps/card-pattern-desktop.svg";
import statFarmersIcon    from "../../assets/comps/tractor.svg";
import statIdIcon         from "../../assets/comps/id.svg";
import registerActionIcon from "../../assets/comps/user-add-01.svg";
import lookupActionIcon   from "../../assets/comps/user-search-01.svg";
import wifiOffStatusIcon  from "../../assets/comps/wifi-off-02.svg";
import syncArrowIcon      from "../../assets/comps/arrow-reload-vertical.svg";
import searchIcon         from "../../assets/comps/search-01.svg";

// ── Custom tractor icon (mobile bottom nav) ───────────────
function TractorIcon({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="7" cy="17" r="2.5" /><circle cx="17" cy="18" r="1.5" />
      <path d="M5 17H3V9l4-4h8l2 4h2v4h-2" /><path d="M9 5v8" /><path d="M3 13h12" />
    </svg>
  );
}

function getChangePct(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

function formatChangePct(value) {
  return `${value >= 0 ? "+" : ""}${value}%`;
}

// ── Desktop stat card — accepts img URL or React element for icon ──
function DesktopStatCard({ icon, iconEl, label, value, badge, action }) {
  return (
    <div className="relative h-[128px] w-[273.94px] overflow-hidden rounded-[20px] bg-[#005F4A] px-[21px] pt-[15px] text-white">
      <img
        src={cardPatternDesktop}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-color pointer-events-none"
      />
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-[12px] flex items-center justify-between">
          {iconEl
            ? iconEl
            : <img src={icon} alt="" aria-hidden="true" className="h-[22px] w-[22px] opacity-95" />
          }
          {badge}
          {action}
        </div>
        <p className="text-[15px] font-light leading-[18px] text-white">{label}</p>
        <p className="mt-[8px] text-[30px] font-medium leading-[36px] tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Agent bottom nav (mobile) ─────────────────────────────
export function AgentBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tabs = [
    { label: "Dashboard", icon: <Home size={22} strokeWidth={1.8} />, path: "/agent/home" },
    { label: "Farmers",   icon: <TractorIcon />,                      path: "/agent/saved-farmers" },
    { label: "Settings",  icon: <Settings size={22} strokeWidth={1.8} />, path: "/agent/settings" },
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

// ── Main component ────────────────────────────────────────
export default function AgentHome() {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [syncing,    setSyncing]    = useState(false);
  const [syncDone,   setSyncDone]   = useState(false);
  const [syncCounts, setSyncCounts] = useState(() => {
    try {
      const counts = getFarmerSyncCountsFromStorage();
      if (!counts || typeof counts !== "object") return { completed: 0, pending: 0 };
      return {
        completed: Number.isFinite(counts.completed) ? counts.completed : 0,
        pending: Number.isFinite(counts.pending) ? counts.pending : 0,
      };
    } catch {
      return { completed: 0, pending: 0 };
    }
  });
  const [isOnline,   setIsOnline]   = useState(typeof navigator === "undefined" ? true : navigator.onLine);

  const safeSyncCounts = useMemo(() => {
    if (!syncCounts || typeof syncCounts !== "object") return { completed: 0, pending: 0 };
    return {
      completed: Number.isFinite(syncCounts.completed) ? syncCounts.completed : 0,
      pending: Number.isFinite(syncCounts.pending) ? syncCounts.pending : 0,
    };
  }, [syncCounts]);

  const recentFarmers = useMemo(
    () => (Array.isArray(agentRegisteredFarmers) ? agentRegisteredFarmers.slice(0, 4) : []),
    []
  );

  useEffect(() => {
    const refresh = () => {
      try {
        const counts = getFarmerSyncCountsFromStorage();
        setSyncCounts({
          completed: Number.isFinite(counts?.completed) ? counts.completed : 0,
          pending: Number.isFinite(counts?.pending) ? counts.pending : 0,
        });
      } catch {
        setSyncCounts({ completed: 0, pending: 0 });
      }
    };
    window.addEventListener("hcx-farmers-sync", refresh);
    return () => window.removeEventListener("hcx-farmers-sync", refresh);
  }, []);

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online",  handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const syncProgressPct = useMemo(() => {
    const t = safeSyncCounts.completed + safeSyncCounts.pending;
    if (t === 0) return 100;
    return Math.round((safeSyncCounts.completed / t) * 100);
  }, [safeSyncCounts]);

  const registeredFarmersChange = useMemo(
    () => getChangePct(agentData.totalFarmersRegistered, agentData.previousPeriodFarmersRegistered),
    []
  );
  const idsIssuedChange = useMemo(
    () => getChangePct(agentData.syncedFarmers, agentData.previousPeriodDigitalIdsIssued),
    []
  );

  const handleSync = async () => {
    if (safeSyncCounts.pending === 0) return;
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1200));
    syncAllPendingFarmersStorage();
    try {
      const counts = getFarmerSyncCountsFromStorage();
      setSyncCounts({
        completed: Number.isFinite(counts?.completed) ? counts.completed : 0,
        pending: Number.isFinite(counts?.pending) ? counts.pending : 0,
      });
    } catch {
      setSyncCounts({ completed: 0, pending: 0 });
    }
    setSyncing(false);
    setSyncDone(true);
    setTimeout(() => setSyncDone(false), 3000);
  };

  // ── Mobile layout (unchanged) ───────────────────────────
  const mobileContent = (
    <div className="page-container md:hidden">
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
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing || safeSyncCounts.pending === 0}
                  className="flex items-center gap-1 text-brand-amber text-xs font-semibold disabled:opacity-40"
                >
                  <RefreshCw size={11} className={syncing ? "animate-spin" : ""} /> Sync now
                </button>
              </div>
              <p className="font-sans text-white/70 text-xs">Pending sync</p>
              <p className="font-display font-bold text-2xl text-white mt-1">
                {String(safeSyncCounts.pending).padStart(2, "0")}
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
            <button
              type="button"
              onClick={handleSync}
              disabled={syncing || syncCounts.pending === 0}
              className="flex items-center gap-1 text-brand-amber text-xs font-semibold disabled:opacity-40"
            >
              <RefreshCw size={12} className={syncing ? "animate-spin" : ""} /> Sync now
            </button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-sans text-sm text-brand-text-secondary">Synchronization Progress</p>
            <p className="font-sans text-sm font-semibold">{syncProgressPct}%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full mb-3">
            <div className="h-2 bg-brand-green rounded-full transition-all" style={{ width: `${syncProgressPct}%` }} />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-brand-green flex items-center justify-center">
                <span className="text-white text-[8px]">✓</span>
              </div>
              <span className="font-sans text-xs text-brand-text-secondary">{syncCounts.completed} Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-brand-amber" />
              <span className="font-sans text-xs text-brand-text-secondary">{syncCounts.pending} Pending</span>
            </div>
          </div>
        </div>
      </div>
      <AgentBottomNav />
    </div>
  );

  // ── Desktop layout ──────────────────────────────────────
  const desktopContent = (
    <AgentDesktopShell active="dashboard" isOnline={isOnline} forceVisible>
      <div className="relative h-full w-full">
        <section className="absolute left-[36px] top-[24px] w-[862.81px]">
          <h2 className="mb-[15px] text-[20px] font-bold leading-6 text-[#030F0F]">Registration stats</h2>
          <div className="flex items-center gap-5">
            <DesktopStatCard
              icon={statFarmersIcon}
              label="Registered Farmers"
              value={agentData.totalFarmersRegistered}
              badge={
                <span className="inline-flex h-6 items-center rounded-[50px] bg-[#007158] px-2 text-[12px] font-light leading-[14px] text-[#F6F6F6]">
                  {formatChangePct(registeredFarmersChange)}
                </span>
              }
            />
            <DesktopStatCard
              icon={statIdIcon}
              label="Digital IDs Issued"
              value={agentData.syncedFarmers.toLocaleString()}
              badge={
                <span className="inline-flex h-6 items-center rounded-[50px] bg-[#007158] px-2 text-[12px] font-light leading-[14px] text-[#F6F6F6]">
                  {formatChangePct(idsIssuedChange)}
                </span>
              }
            />
            <DesktopStatCard
              iconEl={<img src={syncArrowIcon} alt="" aria-hidden="true" className="h-6 w-6" />}
              label="Pending sync"
              value={String(syncCounts.pending).padStart(2, "0")}
              action={
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing || safeSyncCounts.pending === 0}
                  className="inline-flex h-6 items-center gap-1 rounded-[20px] bg-[#FFBB3C] px-[10px] text-[12px] font-medium leading-[14px] text-[#030F0F] disabled:opacity-40"
                >
                  <img
                    src={syncArrowIcon}
                    alt=""
                    aria-hidden="true"
                    className={`h-3 w-3 ${syncing ? "animate-spin" : ""}`}
                  />
                  Sync now
                </button>
              }
            />
          </div>
        </section>

        <section className="absolute left-[36px] top-[218px] w-[568.94px]">
          <h3 className="mb-[15px] text-[20px] font-bold leading-6 text-[#030F0F]">Register new farmer</h3>
          <div className="flex gap-5">
            <div className="flex h-[166px] w-[273.94px] flex-col items-center justify-center gap-[15px] rounded-[20px] bg-white px-5 py-[15px]">
              <img src={registerActionIcon} alt="" aria-hidden="true" className="h-8 w-8" />
              <div className="space-y-1 text-center">
                <p className="text-[15px] font-medium leading-[18px] text-[#030F0F]">Register new farmer</p>
                <p className="text-[12px] font-normal leading-[14px] text-[#030F0F]">Capture biometric and personal data</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/agent/register-farmer")}
                className="inline-flex h-[37px] w-[190px] items-center justify-center gap-1 rounded-[10px] bg-[#FFBB3C] text-[12px] font-normal leading-[14px] text-[#030F0F]"
              >
                <Plus size={14} />
                Start Registration
              </button>
            </div>

            <div className="flex h-[166px] w-[274px] flex-col items-center justify-center gap-[15px] rounded-[20px] bg-white px-5 py-[15px]">
              <img src={lookupActionIcon} alt="" aria-hidden="true" className="h-8 w-8" />
              <div className="space-y-1 text-center">
                <p className="text-[15px] font-medium leading-[18px] text-[#030F0F]">Farmer lookup</p>
                <p className="text-[12px] font-normal leading-[14px] text-[#030F0F]">Search by ID or name</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/agent/saved-farmers")}
                className="inline-flex h-[37px] w-[190px] items-center justify-center gap-1 rounded-[10px] bg-[#FFBB3C] text-[12px] font-normal leading-[14px] text-[#030F0F]"
              >
                <img src={searchIcon} alt="" aria-hidden="true" className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="absolute left-[36px] top-[450px] w-[569px]">
          <h3 className="mb-[15px] text-[20px] font-bold leading-6 text-[#030F0F]">Synchronization</h3>
          <div className="h-[183px] rounded-[32px] bg-white px-[27px] py-[14px]">
            <div className="mb-[14px] flex items-center justify-between">
              <div className="flex items-center gap-[11px]">
                <img src={wifiOffStatusIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
                <p className="text-[19px] font-medium leading-[23px] text-[#030F0F]">Offline Status</p>
              </div>
              <button
                type="button"
                onClick={handleSync}
                disabled={syncing || syncCounts.pending === 0}
                className="inline-flex h-[35px] items-center gap-2 rounded-[44px] bg-[#03624D] px-[14px] text-[13px] font-bold leading-[15px] text-white disabled:opacity-40"
              >
                <img
                  src={syncArrowIcon}
                  alt=""
                  aria-hidden="true"
                  className={`h-[17px] w-[17px] ${syncing ? "animate-spin" : ""}`}
                />
                Sync now
              </button>
            </div>

            <div className="mb-2 flex items-center justify-between">
              <p className="text-[16px] font-normal leading-[19px] text-[#030F0F]">Synchronization Progress</p>
              <p className="text-[16px] font-semibold leading-[19px] text-[#030F0F]">{syncProgressPct}%</p>
            </div>
            <div className="relative mb-5 h-[22.5px] w-full rounded-[48px] bg-[rgba(3,98,77,0.05)]">
              <div
                className="absolute left-0 top-0 h-[22.5px] rounded-[48px] bg-[#03624D]"
                style={{ width: `${syncProgressPct}%` }}
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={16} className="text-[#03624D]" />
                <p className="text-[16px] font-normal leading-[19px] text-[#030F0F]">{safeSyncCounts.completed} Completed</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 rounded-full bg-[#FFBB3C]" />
                <p className="text-[16px] font-normal leading-[19px] text-[#030F0F]">{safeSyncCounts.pending} Pending</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="absolute left-[626px] top-[218px] w-[273px]">
          <h3 className="mb-4 text-[20px] font-bold leading-6 text-[#030F0F]">Recently Registered</h3>
          <div className="rounded-[20px] bg-white px-[17px] pb-3 pt-[17px]">
            <div className="space-y-[15px]">
              {recentFarmers.map((farmer) => (
                <div key={farmer.id} className="flex h-[74px] items-center gap-[10px] rounded-[10px] bg-[#F6F6F6] px-[9px] py-[8px]">
                  <img src={farmer.photo} alt={farmer.name} className="h-[61px] w-[61px] rounded-[11px] object-cover" />
                  <div>
                    <p className="text-[10px] font-normal leading-3 text-[#030F0F]">ID : {farmer.id}</p>
                    <p className="mt-[10px] text-[10px] font-normal leading-3 text-[#030F0F]">Name : {farmer.name}</p>
                    <button
                      type="button"
                      onClick={() => navigate("/agent/saved-farmers")}
                      className="mt-[10px] inline-flex items-center gap-1 text-[10px] font-bold leading-3 text-[#03624D]"
                    >
                      View Details
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate("/agent/saved-farmers")}
              className="mt-[15px] h-[37px] w-full rounded-[10px] bg-[#FFBB3C] text-[12px] font-normal leading-[14px] text-[#030F0F]"
            >
              See Registered Farmers
            </button>
          </div>
        </aside>

        {syncDone && (
          <div className="absolute bottom-2 right-6 rounded-[10px] border border-[#03624D] bg-[#e9f5f2] px-3 py-1 text-xs text-[#03624D]">
            Sync complete
          </div>
        )}
      </div>
    </AgentDesktopShell>
  );

  return isDesktop ? desktopContent : mobileContent;
}

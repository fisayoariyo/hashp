import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Settings, UserPlus, Search, RefreshCw, Wifi, WifiOff } from "lucide-react";
import AgentDesktopShell from "../../components/agent/AgentDesktopShell";
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
import lookupActionIcon   from "../../assets/comps/user-search.svg";   // ← fixed
import wifiOffStatusIcon  from "../../assets/comps/wifi-.svg";          // ← fixed
import arrowRightIcon     from "../../assets/comps/arrow-r.svg";        // ← added
import checkmarkCircleIcon from "../../assets/comps/checkmark-circle-02.svg"; // ← added

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
    <div className="relative overflow-hidden rounded-2xl bg-brand-green px-4 py-3 text-white min-h-[118px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
      <img
        src={cardPatternDesktop}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-color pointer-events-none"
      />
      <div className="relative z-10">
        <div className="mb-2 flex items-center justify-between">
          {iconEl
            ? iconEl
            : <img src={icon} alt="" aria-hidden="true" className="h-5 w-5 opacity-95" />
          }
          {badge}
          {action}
        </div>
        <p className="font-sans text-base leading-tight text-white/85">{label}</p>
        <p className="mt-2 font-display text-[40px] leading-none font-bold tracking-tight">{value}</p>
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
  const [syncing,    setSyncing]    = useState(false);
  const [syncDone,   setSyncDone]   = useState(false);
  const [syncCounts, setSyncCounts] = useState(getFarmerSyncCountsFromStorage);
  const [isOnline,   setIsOnline]   = useState(typeof navigator === "undefined" ? true : navigator.onLine);

  useEffect(() => {
    const refresh = () => setSyncCounts(getFarmerSyncCountsFromStorage());
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
    const t = syncCounts.completed + syncCounts.pending;
    if (t === 0) return 100;
    return Math.round((syncCounts.completed / t) * 100);
  }, [syncCounts]);

  const registeredFarmersChange = useMemo(
    () => getChangePct(agentData.totalFarmersRegistered, agentData.previousPeriodFarmersRegistered),
    []
  );
  const idsIssuedChange = useMemo(
    () => getChangePct(agentData.syncedFarmers, agentData.previousPeriodDigitalIdsIssued),
    []
  );

  const handleSync = async () => {
    if (syncCounts.pending === 0) return;
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1200));
    syncAllPendingFarmersStorage();
    setSyncCounts(getFarmerSyncCountsFromStorage());
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
                  disabled={syncing || syncCounts.pending === 0}
                  className="flex items-center gap-1 text-brand-amber text-xs font-semibold disabled:opacity-40"
                >
                  <RefreshCw size={11} className={syncing ? "animate-spin" : ""} /> Sync now
                </button>
              </div>
              <p className="font-sans text-white/70 text-xs">Pending sync</p>
              <p className="font-display font-bold text-2xl text-white mt-1">
                {String(syncCounts.pending).padStart(2, "0")}
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
    <AgentDesktopShell active="dashboard" isOnline={isOnline}>
      <div className="rounded-[22px] border border-[#dadada] bg-[#efefef] shadow-[0_8px_20px_rgba(15,23,42,0.03)] p-5">

        {/* ── Registration stats ── */}
        <h2 className="font-display font-bold text-[20px] leading-none text-brand-text-primary mb-4">
          Registration stats
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <DesktopStatCard
            icon={statFarmersIcon}
            label="Registered Farmers"
            value={agentData.totalFarmersRegistered}
            badge={
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/95">
                {formatChangePct(registeredFarmersChange)}
              </span>
            }
          />
          <DesktopStatCard
            icon={statIdIcon}
            label="Digital IDs Issued"
            value={agentData.syncedFarmers.toLocaleString()}
            badge={
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/95">
                {formatChangePct(idsIssuedChange)}
              </span>
            }
          />
          {/* Pending sync — uses Lucide RefreshCw since no reload SVG asset */}
          <DesktopStatCard
            iconEl={<RefreshCw size={20} className="text-white/95" />}
            label="Pending sync"
            value={String(syncCounts.pending).padStart(2, "0")}
            action={
              <button
                type="button"
                onClick={handleSync}
                disabled={syncing || syncCounts.pending === 0}
                className="inline-flex items-center gap-1 rounded-full bg-brand-amber px-3 py-1 text-xs font-semibold text-brand-text-primary disabled:opacity-40"
              >
                <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
                Sync now
              </button>
            }
          />
        </div>

        {/* ── Bottom section: left 2/3 + right 1/3 ── */}
        <div className="grid grid-cols-3 gap-4">

          {/* ── Left column ── */}
          <div className="col-span-2 space-y-5">

            {/* Register new farmer */}
            <section>
              <h3 className="font-display font-bold text-[20px] leading-none text-brand-text-primary mb-3">
                Register new farmer
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-[#e4e4e4] bg-white p-5 text-center flex flex-col items-center">
                  <img src={registerActionIcon} alt="" aria-hidden="true" className="mb-3 h-7 w-7" />
                  <p className="font-display font-bold text-[18px] leading-tight text-brand-text-primary">
                    Register new farmer
                  </p>
                  <p className="mt-2 text-sm text-brand-text-secondary">
                    Capture biometric and personal data
                  </p>
                  <button
                    onClick={() => navigate("/agent/register-farmer")}
                    className="btn-amber mt-4 py-3 text-sm w-full"
                  >
                    + Start Registration
                  </button>
                </div>
                <div className="rounded-3xl border border-[#e4e4e4] bg-white p-5 text-center flex flex-col items-center">
                  <img src={lookupActionIcon} alt="" aria-hidden="true" className="mb-3 h-7 w-7" />
                  <p className="font-display font-bold text-[18px] leading-tight text-brand-text-primary">
                    Farmer lookup
                  </p>
                  <p className="mt-2 text-sm text-brand-text-secondary">
                    Search by ID or name
                  </p>
                  <button
                    onClick={() => navigate("/agent/saved-farmers")}
                    className="btn-amber mt-4 py-3 text-sm w-full"
                  >
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <Search size={14} /> Search
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* Synchronization */}
            <section className="rounded-3xl border border-[#e4e4e4] bg-white p-5">
              <h3 className="font-display font-bold text-[20px] leading-none text-brand-text-primary mb-4">
                Synchronization
              </h3>

              {syncDone && (
                <div className="mb-3 rounded-xl border border-brand-green/25 bg-brand-green/10 px-3 py-2 text-xs font-semibold text-brand-green">
                  Sync complete — all records uploaded
                </div>
              )}

              {/* Status row */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={wifiOffStatusIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
                  <p className="font-sans text-[16px] leading-none font-semibold text-brand-text-primary">
                    Offline Status
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing || syncCounts.pending === 0}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                >
                  <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
                  Sync now
                </button>
              </div>

              {/* Progress */}
              <div className="mb-2 flex items-center justify-between">
                <p className="font-sans text-[15px] leading-none text-brand-text-primary">
                  Synchronization Progress
                </p>
                <p className="font-sans text-[15px] leading-none font-semibold text-brand-text-primary">
                  {syncProgressPct}%
                </p>
              </div>
              <div className="h-4 w-full rounded-full bg-[#dfe8e3] p-0.5 mb-4">
                <div
                  className="relative h-full overflow-hidden rounded-full bg-brand-green transition-all"
                  style={{ width: `${syncProgressPct}%` }}
                >
                  <img
                    src={cardPatternDesktop}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-color pointer-events-none"
                  />
                </div>
              </div>

              {/* Completed / Pending legend */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-[15px] text-brand-text-primary">
                  <img src={checkmarkCircleIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
                  <span>{syncCounts.completed} Completed</span>
                </div>
                <div className="flex items-center gap-2 text-[15px] text-brand-text-primary">
                  <div className="h-[14px] w-[14px] rounded-full bg-brand-amber" />
                  <span>{syncCounts.pending} Pending</span>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right column — Recently Registered ── */}
          <aside className="rounded-3xl border border-[#e4e4e4] bg-white p-4 flex flex-col">
            <h3 className="font-display font-bold text-[20px] leading-none text-brand-text-primary mb-4 whitespace-nowrap">
              Recently Registered
            </h3>
            <div className="space-y-3 flex-1">
              {agentRegisteredFarmers.slice(0, 4).map((farmer) => (
                <div key={farmer.id} className="rounded-2xl border border-[#ececec] bg-[#f8f8f8] p-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={farmer.photo}
                      alt={farmer.name}
                      className="h-[52px] w-[52px] rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] leading-[1.4] text-brand-text-secondary truncate">
                        ID : {farmer.id}
                      </p>
                      <p className="text-[12px] leading-[1.4] font-semibold text-brand-text-primary truncate">
                        Name : {farmer.name}
                      </p>
                      <button
                        onClick={() => navigate("/agent/saved-farmers")}
                        className="mt-1 inline-flex items-center gap-0.5 text-[12px] font-semibold text-brand-green"
                      >
                        View Details
                        <img src={arrowRightIcon} alt="" aria-hidden="true" className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate("/agent/saved-farmers")}
              className="btn-amber mt-4 py-3 text-sm"
            >
              See Registered Farmers
            </button>
          </aside>

        </div>
      </div>
    </AgentDesktopShell>
  );

  return (
    <>
      {mobileContent}
      {desktopContent}
    </>
  );
}

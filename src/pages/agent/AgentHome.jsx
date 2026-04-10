import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Headset, RefreshCw } from "lucide-react";
import AgentDesktopShell from "../../components/agent/AgentDesktopShell";
import { agentData, agentRegisteredFarmers } from "../../mockData/agent";
import {
  getFarmerSyncCountsFromStorage,
  syncAllPendingFarmersStorage,
} from "../../hooks/useAgentFarmersSync";
import homeIcon from "../../assets/comps/home-11.svg";
import tractorIcon from "../../assets/comps/tractor.svg";
import settingsIcon from "../../assets/comps/settings-03.svg";
import idIcon from "../../assets/comps/id.svg";
import syncIcon from "../../assets/comps/arrow-reload-vertical.svg";
import userAddIcon from "../../assets/comps/user-add-01.svg";
import userSearchIcon from "../../assets/comps/user-search-01.svg";
import wifiOffIcon from "../../assets/comps/wifi-off-02.svg";
import cardPatternDesktop from "../../assets/comps/card-pattern-desktop.svg";
import cardPatternMobile from "../../assets/comps/card-pattern-mobile.svg";
import loadingIdle from "../../assets/comps/Loading.png";
import loadingProgress from "../../assets/comps/Loading-progress.png";
import loadingSuccess from "../../assets/comps/Loading-successful.png";
import loadingFailed from "../../assets/comps/Loading-failed.png";

const DASHBOARD_PREV_PERIOD_KEY = "hcx-agent-dashboard-prev-period";

function calcGrowthPct(current, previous) {
  if (!previous || previous <= 0) return 0;
  return ((current - previous) / previous) * 100;
}

function formatGrowthBadge(value) {
  const rounded = Math.round(value);
  return `${rounded >= 0 ? "+" : ""}${rounded}%`;
}

export function AgentBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tabs = [
    { label: "Dashboard", icon: homeIcon, path: "/agent/home" },
    { label: "Farmers", icon: tractorIcon, path: "/agent/saved-farmers" },
    { label: "Settings", icon: settingsIcon, path: "/agent/settings" },
    { label: "Help", icon: null, path: "/agent/contact-support" },
  ];
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50">
      <div className="bg-white border-t border-brand-border flex items-center justify-around px-2 py-2">
        {tabs.map(({ label, icon, path }) => {
          const active = pathname === path || (path === "/agent/saved-farmers" && pathname.startsWith("/agent/saved"));
          return (
            <button key={path} onClick={() => navigate(path)} className="flex-1 flex flex-col items-center">
              <div className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${active ? "bg-brand-green" : ""}`}>
                {icon ? (
                  <img src={icon} alt="" className={`w-[18px] h-[18px] ${active ? "brightness-0 invert" : ""}`} />
                ) : (
                  <Headset size={18} className={active ? "text-white" : "text-brand-green"} />
                )}
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
  const [syncState, setSyncState] = useState("idle");
  const [syncCounts, setSyncCounts] = useState(getFarmerSyncCountsFromStorage);
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [prevPeriodCounts] = useState(() => {
    try {
      const raw = localStorage.getItem(DASHBOARD_PREV_PERIOD_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed.registered === "number" && typeof parsed.digitalIds === "number") {
        return parsed;
      }
    } catch {
      /* ignore storage parse errors */
    }
    return {
      registered: agentData.totalFarmersRegistered,
      digitalIds: agentData.syncedFarmers,
    };
  });

  useEffect(() => {
    const refresh = () => setSyncCounts(getFarmerSyncCountsFromStorage());
    window.addEventListener("hcx-farmers-sync", refresh);
    return () => window.removeEventListener("hcx-farmers-sync", refresh);
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        DASHBOARD_PREV_PERIOD_KEY,
        JSON.stringify({
          registered: agentData.totalFarmersRegistered,
          digitalIds: agentData.syncedFarmers,
        })
      );
    } catch {
      /* ignore storage write errors */
    }
  }, [syncCounts.completed, syncCounts.pending]);

  const syncProgressPct = useMemo(() => {
    const t = syncCounts.completed + syncCounts.pending;
    if (t === 0) return 100;
    return Math.round((syncCounts.completed / t) * 100);
  }, [syncCounts]);

  const registeredGrowth = useMemo(
    () => calcGrowthPct(agentData.totalFarmersRegistered, prevPeriodCounts.registered),
    [prevPeriodCounts.registered]
  );

  const digitalIdsGrowth = useMemo(
    () => calcGrowthPct(agentData.syncedFarmers, prevPeriodCounts.digitalIds),
    [prevPeriodCounts.digitalIds]
  );

  const handleSync = async () => {
    if (syncCounts.pending === 0) return;
    const currentSyncState = isOnline ? "loading" : "failed";
    setSyncState(currentSyncState);
    if (!isOnline) {
      setTimeout(() => setSyncState("idle"), 2600);
      return;
    }
    setSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setSyncState("loading-progress");
      await new Promise((resolve) => setTimeout(resolve, 900));
      syncAllPendingFarmersStorage();
      setSyncCounts(getFarmerSyncCountsFromStorage());
      setSyncState("successful");
      setTimeout(() => setSyncState("idle"), 2600);
    } catch {
      setSyncState("failed");
      setTimeout(() => setSyncState("idle"), 2600);
    } finally {
      setSyncing(false);
    }
  };

  const syncStatusPanel = useMemo(() => {
    if (syncState === "idle") return null;

    const contentMap = {
      loading: {
        image: loadingIdle,
        title: "Loading.....",
        subtitle: "Please wait",
      },
      "loading-progress": {
        image: loadingProgress,
        title: "Synchronization in progress",
        subtitle: "Please wait",
      },
      successful: {
        image: loadingSuccess,
        title: "Synchronization successful",
        subtitle: "",
      },
      failed: {
        image: loadingFailed,
        title: "Synchronization failed",
        subtitle: "Try again",
      },
    };

    const config = contentMap[syncState];
    return (
      <div className="bg-white border border-brand-border rounded-2xl px-4 py-3 flex items-center gap-3">
        <img src={config.image} alt="" className="w-9 h-9 object-contain" />
        <div>
          <p className="font-sans text-sm font-semibold text-brand-text-primary">{config.title}</p>
          {config.subtitle ? (
            <p className="font-sans text-xs text-brand-text-secondary">{config.subtitle}</p>
          ) : null}
        </div>
      </div>
    );
  }, [syncState]);

  const mobileContent = (
    <div className="page-container md:hidden">
      <div className="bg-brand-green px-4 pt-6 pb-5">
        <div className="flex items-start justify-between mb-2">
          <h1 className="font-display font-bold text-xl text-white">Welcome, Agent {agentData.name}</h1>
          {isOnline ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              Online <span aria-hidden="true">✓</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-brand-text-secondary">
              <img src={wifiOffIcon} alt="" className="w-3.5 h-3.5" />
              Offline
            </span>
          )}
        </div>
        <p className="font-sans text-white/70 text-sm mb-5">
          Ready to manage farmer registration and track activities
        </p>
      </div>

      <div className="flex-1 px-4 -mt-3 pb-28 overflow-y-auto scrollbar-hide space-y-4">
        <section className="bg-white rounded-2xl border border-brand-border shadow-sm p-3.5">
          <h2 className="font-display font-bold text-xl text-brand-text-primary mb-3">Registration stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative col-span-2 overflow-hidden rounded-2xl bg-brand-green p-4 text-white">
              <div className="absolute inset-0 pointer-events-none">
                <img src={cardPatternMobile} alt="" className="absolute right-0 top-0 h-32 w-[273.94px] object-cover opacity-20 mix-blend-color" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <img src={tractorIcon} alt="" className="w-5 h-5 brightness-0 invert" />
                  <span className="text-[11px] font-semibold rounded-full bg-white/10 px-2 py-0.5">
                    {formatGrowthBadge(registeredGrowth)}
                  </span>
                </div>
                <p className="text-white/80 text-sm mt-3">Registered Farmers</p>
                <p className="font-display font-bold text-4xl mt-1">
                  {agentData.totalFarmersRegistered.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-brand-green p-4 text-white">
              <div className="absolute inset-0 pointer-events-none">
                <img src={cardPatternMobile} alt="" className="absolute right-0 top-0 h-32 w-[273.94px] object-cover opacity-20 mix-blend-color" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <img src={idIcon} alt="" className="w-5 h-5 brightness-0 invert" />
                  <span className="text-[11px] font-semibold rounded-full bg-white/10 px-2 py-0.5">
                    {formatGrowthBadge(digitalIdsGrowth)}
                  </span>
                </div>
                <p className="text-white/80 text-xs mt-3">Digital IDs Issued</p>
                <p className="font-display font-bold text-2xl mt-1">
                  {agentData.syncedFarmers.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-brand-green p-4 text-white">
              <div className="absolute inset-0 pointer-events-none">
                <img src={cardPatternMobile} alt="" className="absolute right-0 top-0 h-32 w-[273.94px] object-cover opacity-20 mix-blend-color" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <img src={syncIcon} alt="" className="w-5 h-5 brightness-0 invert" />
                  <button
                    type="button"
                    onClick={handleSync}
                    disabled={syncing || syncCounts.pending === 0}
                    className="rounded-full bg-brand-amber px-2.5 py-1 text-[11px] font-semibold text-brand-text-primary disabled:opacity-40"
                  >
                    Sync now
                  </button>
                </div>
                <p className="text-white/80 text-xs mt-3">Pending sync</p>
                <p className="font-display font-bold text-2xl mt-1">
                  {String(syncCounts.pending).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="font-display font-bold text-xl text-brand-text-primary">Register new farmer</h3>
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-brand-border p-4 flex flex-col gap-3">
              <img src={userAddIcon} alt="" className="w-8 h-8" />
            <div>
              <p className="font-display font-bold text-sm text-brand-text-primary">Register new farmer</p>
              <p className="font-sans text-xs text-brand-text-muted mt-0.5">Capture biometric and personal data</p>
            </div>
            <button onClick={() => navigate("/agent/register-farmer")} className="btn-amber py-2.5 text-xs">
              + Start Registration
            </button>
          </div>
            <div className="bg-white rounded-2xl border border-brand-border p-4 flex flex-col gap-3">
              <img src={userSearchIcon} alt="" className="w-8 h-8" />
            <div>
              <p className="font-display font-bold text-sm text-brand-text-primary">Farmer lookup</p>
              <p className="font-sans text-xs text-brand-text-muted mt-0.5">Search by ID or name</p>
            </div>
            <button onClick={() => navigate("/agent/saved-farmers")} className="btn-amber py-2.5 text-xs">
              Search
            </button>
          </div>
        </div>
        </section>

        <section className="bg-white rounded-2xl border border-brand-border p-4 space-y-3">
          <h3 className="font-display font-bold text-xl text-brand-text-primary">Synchronization</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img src={wifiOffIcon} alt="" className="w-4 h-4" />
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
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div className="relative h-full bg-brand-green rounded-full transition-all overflow-hidden" style={{ width: `${syncProgressPct}%` }}>
              <img src={cardPatternMobile} alt="" className="absolute right-0 top-0 h-full w-full opacity-20 mix-blend-color object-cover" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-brand-green flex items-center justify-center text-white text-[8px]">
                ✓
              </div>
              <span className="font-sans text-xs text-brand-text-secondary">{syncCounts.completed} Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-brand-amber" />
              <span className="font-sans text-xs text-brand-text-secondary">{syncCounts.pending} Pending</span>
            </div>
          </div>
          {syncStatusPanel}
        </section>
      </div>
      <AgentBottomNav />
    </div>
  );

  const desktopContent = (
    <AgentDesktopShell active="dashboard">
      <section className="bg-brand-bg-page rounded-3xl border border-brand-border/70 p-5 md:p-6 mb-6">
        <h2 className="font-display font-bold text-3xl text-brand-text-primary mb-4">Registration stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-2xl bg-brand-green p-5 text-white min-h-40">
            <div className="absolute inset-0 pointer-events-none">
              <img src={cardPatternMobile} alt="" className="absolute right-0 top-0 h-32 w-[273.94px] object-cover opacity-20 mix-blend-color md:hidden" />
              <img src={cardPatternDesktop} alt="" className="absolute right-0 top-0 h-32 w-[353px] object-cover opacity-20 mix-blend-color hidden md:block" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <img src={tractorIcon} alt="" className="w-6 h-6 brightness-0 invert" />
                <span className="text-xs font-semibold rounded-full bg-white/10 px-2.5 py-1">
                  {formatGrowthBadge(registeredGrowth)}
                </span>
              </div>
              <p className="text-base opacity-80">Registered Farmers</p>
              <p className="font-display font-bold text-5xl mt-2">{agentData.totalFarmersRegistered.toLocaleString()}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-brand-green p-5 text-white min-h-40">
            <div className="absolute inset-0 pointer-events-none">
              <img src={cardPatternMobile} alt="" className="absolute right-0 top-0 h-32 w-[273.94px] object-cover opacity-20 mix-blend-color md:hidden" />
              <img src={cardPatternDesktop} alt="" className="absolute right-0 top-0 h-32 w-[353px] object-cover opacity-20 mix-blend-color hidden md:block" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <img src={idIcon} alt="" className="w-6 h-6 brightness-0 invert" />
                <span className="text-xs font-semibold rounded-full bg-white/10 px-2.5 py-1">
                  {formatGrowthBadge(digitalIdsGrowth)}
                </span>
              </div>
              <p className="text-base opacity-80">Digital IDs Issued</p>
              <p className="font-display font-bold text-5xl mt-2">{agentData.syncedFarmers.toLocaleString()}</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-brand-green p-5 text-white min-h-40">
            <div className="absolute inset-0 pointer-events-none">
              <img src={cardPatternMobile} alt="" className="absolute right-0 top-0 h-32 w-[273.94px] object-cover opacity-20 mix-blend-color md:hidden" />
              <img src={cardPatternDesktop} alt="" className="absolute right-0 top-0 h-32 w-[353px] object-cover opacity-20 mix-blend-color hidden md:block" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <img src={syncIcon} alt="" className="w-6 h-6 brightness-0 invert" />
                <button
                  type="button"
                  onClick={handleSync}
                  disabled={syncing || syncCounts.pending === 0}
                  className="px-3 py-1 rounded-full bg-brand-amber text-brand-text-primary text-xs font-semibold disabled:opacity-40"
                >
                  Sync now
                </button>
              </div>
              <p className="text-base opacity-80">Pending sync</p>
              <p className="font-display font-bold text-5xl mt-2">{String(syncCounts.pending).padStart(2, "0")}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <div>
            <h3 className="font-display font-bold text-4xl text-brand-text-primary mb-3">Register new farmer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-brand-border p-6">
                <img src={userAddIcon} alt="" className="w-8 h-8 mb-3" />
                <p className="font-display font-bold text-2xl mb-1">Register new farmer</p>
                <p className="text-sm text-brand-text-secondary mb-5">Capture biometric and personal data</p>
                <button onClick={() => navigate("/agent/register-farmer")} className="btn-amber py-3 text-sm">+ Start Registration</button>
              </div>
              <div className="bg-white rounded-2xl border border-brand-border p-6">
                <img src={userSearchIcon} alt="" className="w-8 h-8 mb-3" />
                <p className="font-display font-bold text-2xl mb-1">Farmer lookup</p>
                <p className="text-sm text-brand-text-secondary mb-5">Search by ID or name</p>
                <button onClick={() => navigate("/agent/saved-farmers")} className="btn-amber py-3 text-sm">Search</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-bold text-3xl text-brand-text-primary">Synchronization</p>
              <button
                type="button"
                onClick={handleSync}
                disabled={syncing || syncCounts.pending === 0}
                className="px-4 py-2 rounded-xl bg-brand-green text-white text-sm font-semibold disabled:opacity-40"
              >
                Sync now
              </button>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-brand-text-secondary">Synchronization Progress</p>
              <p className="text-sm font-semibold text-brand-text-primary">{syncProgressPct}%</p>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full mb-3 overflow-hidden">
              <div className="relative h-full bg-brand-green rounded-full transition-all overflow-hidden" style={{ width: `${syncProgressPct}%` }}>
                <img src={cardPatternDesktop} alt="" className="absolute right-0 top-0 h-full w-full opacity-20 mix-blend-color object-cover" />
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <span className="inline-flex items-center gap-2"><span aria-hidden="true">✅</span> {syncCounts.completed} Completed</span>
              <span className="inline-flex items-center gap-2"><span aria-hidden="true">🟡</span> {syncCounts.pending} Pending</span>
            </div>
            <div className="mt-4">{syncStatusPanel}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-4">
          <p className="font-display font-bold text-3xl text-brand-text-primary mb-3">Recently Registered</p>
          <div className="space-y-3">
            {agentRegisteredFarmers.slice(0, 4).map((farmer) => (
              <div key={farmer.id} className="flex items-center gap-3 p-3 rounded-xl border border-brand-border">
                <img src={farmer.photo} alt={farmer.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="text-xs">
                  <p className="text-brand-text-muted">ID : {farmer.id}</p>
                  <p className="font-semibold text-brand-text-primary">Name : {farmer.name}</p>
                  <button onClick={() => navigate("/agent/saved-farmers")} className="text-brand-green font-semibold mt-1">View Details</button>
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

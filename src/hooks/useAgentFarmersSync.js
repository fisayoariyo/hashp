import { useState, useCallback, useMemo, useEffect } from "react";
import { agentRegisteredFarmers } from "../mockData/agent";

export const FARMERS_SYNC_STORAGE_KEY = "hcx_agent_farmers_sync";

export function loadFarmersFromStorage() {
  try {
    const raw = localStorage.getItem(FARMERS_SYNC_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    return agentRegisteredFarmers.map((f) => ({
      ...f,
      status: map[f.id] === "synced" || map[f.id] === "pending" ? map[f.id] : f.status,
    }));
  } catch {
    return agentRegisteredFarmers.map((f) => ({ ...f }));
  }
}

export function saveFarmerStatuses(farmers) {
  const map = {};
  farmers.forEach((f) => {
    map[f.id] = f.status;
  });
  localStorage.setItem(FARMERS_SYNC_STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent("hcx-farmers-sync"));
}

export function getFarmerSyncCountsFromStorage() {
  const farmers = loadFarmersFromStorage();
  return {
    completed: farmers.filter((f) => f.status === "synced").length,
    pending: farmers.filter((f) => f.status === "pending").length,
  };
}

/** Used from dashboard so list + counts stay aligned (mock). */
export function syncAllPendingFarmersStorage() {
  const next = loadFarmersFromStorage().map((f) =>
    f.status === "pending" ? { ...f, status: "synced" } : f
  );
  saveFarmerStatuses(next);
}

/** Local mutable copy of registered farmers + mock sync actions (UI only). */
export function useAgentFarmersSync() {
  const [farmers, setFarmers] = useState(loadFarmersFromStorage);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  useEffect(() => {
    const onExternal = () => setFarmers(loadFarmersFromStorage());
    window.addEventListener("hcx-farmers-sync", onExternal);
    return () => window.removeEventListener("hcx-farmers-sync", onExternal);
  }, []);

  const showMessage = useCallback((text) => {
    setSyncMessage(text);
    window.setTimeout(() => setSyncMessage(null), 2800);
  }, []);

  const syncFarmer = useCallback(
    (id) => {
      setFarmers((prev) => {
        const next = prev.map((f) => (f.id === id ? { ...f, status: "synced" } : f));
        saveFarmerStatuses(next);
        return next;
      });
      showMessage("Farmer record synced successfully.");
    },
    [showMessage]
  );

  const syncAllPending = useCallback(async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 900));
    setFarmers((prev) => {
      const next = prev.map((f) => (f.status === "pending" ? { ...f, status: "synced" } : f));
      saveFarmerStatuses(next);
      return next;
    });
    setSyncing(false);
    showMessage("All pending farmers synced.");
  }, [showMessage]);

  const counts = useMemo(() => {
    const completed = farmers.filter((f) => f.status === "synced").length;
    const pending = farmers.filter((f) => f.status === "pending").length;
    return { completed, pending };
  }, [farmers]);

  return {
    farmers,
    syncing,
    syncMessage,
    syncFarmer,
    syncAllPending,
    counts,
  };
}

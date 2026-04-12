import { useState, useCallback, useMemo, useEffect } from "react";
import { agentRegisteredFarmers } from "../mockData/agent";

export const FARMERS_SYNC_STORAGE_KEY = "hcx_agent_farmers_sync";
const FARMERS_LIST_CACHE_KEY = "hcx_agent_farmers_list";

export function loadFarmersFromStorage() {
  try {
    const listRaw = localStorage.getItem(FARMERS_LIST_CACHE_KEY);
    if (listRaw) {
      const parsed = JSON.parse(listRaw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    /* fall through */
  }
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

/** Local mock: mark all pending as synced (dashboard “Sync now”). */
export function syncAllPendingFarmersStorage() {
  const next = loadFarmersFromStorage().map((f) =>
    f.status === "pending" ? { ...f, status: "synced" } : f
  );
  saveFarmerStatuses(next);
}

/** Local mutable copy with mock sync actions. */
export function useAgentFarmersSync() {
  const [farmers, setFarmers] = useState(loadFarmersFromStorage);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [listError, setListError] = useState(null);

  const refreshFromApi = useCallback(async () => {
    setListError(null);
    // Backend sync is paused; always use local/mock storage.
    setFarmers(loadFarmersFromStorage());
  }, []);

  useEffect(() => {
    refreshFromApi();
    const onExternal = () => {
      refreshFromApi();
    };
    window.addEventListener("hcx-farmers-sync", onExternal);
    window.addEventListener("hcx-farmers-refresh", onExternal);
    return () => {
      window.removeEventListener("hcx-farmers-sync", onExternal);
      window.removeEventListener("hcx-farmers-refresh", onExternal);
    };
  }, [refreshFromApi]);

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
    listError,
    syncFarmer,
    syncAllPending,
    counts,
    refreshFromApi,
  };
}

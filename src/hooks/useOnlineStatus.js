import { useEffect, useState } from "react";

export default function useOnlineStatus() {
  const supportsNavigator = typeof navigator !== "undefined" && typeof navigator.onLine === "boolean";
  const [isOnline, setIsOnline] = useState(supportsNavigator ? navigator.onLine : true);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

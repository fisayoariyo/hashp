import { useCallback, useEffect, useState } from "react";

const MAX_COOLDOWN_SECONDS = 60;

function normalizeCooldownSeconds(value) {
  const next = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(next) || next <= 0) return 0;
  return Math.min(next, MAX_COOLDOWN_SECONDS);
}

export function useOtpCountdown(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(() => normalizeCooldownSeconds(initialSeconds));

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const start = useCallback((value) => {
    const next = normalizeCooldownSeconds(value);
    if (next > 0) setSeconds(next);
  }, []);

  const clear = useCallback(() => setSeconds(0), []);

  return {
    seconds,
    isActive: seconds > 0,
    start,
    clear,
  };
}

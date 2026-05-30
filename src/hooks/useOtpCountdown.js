import { useEffect, useState } from "react";

export function useOtpCountdown(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(() =>
    Number.isFinite(initialSeconds) && initialSeconds > 0 ? Math.floor(initialSeconds) : 0,
  );

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [seconds <= 0]);

  const start = (value) => {
    const next = Number.parseInt(String(value || ""), 10);
    if (Number.isFinite(next) && next > 0) setSeconds(next);
  };

  const clear = () => setSeconds(0);

  return {
    seconds,
    isActive: seconds > 0,
    start,
    clear,
  };
}

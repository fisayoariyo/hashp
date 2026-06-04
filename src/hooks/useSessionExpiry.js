import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useSessionExpiry(loginPath = "/agent/login") {
  const navigate = useNavigate();

  useEffect(() => {
    function handleExpired() {
      navigate(loginPath, { replace: true, state: { sessionExpired: true } });
    }

    window.addEventListener("cropex:session-expired", handleExpired);
    return () => window.removeEventListener("cropex:session-expired", handleExpired);
  }, [navigate, loginPath]);
}

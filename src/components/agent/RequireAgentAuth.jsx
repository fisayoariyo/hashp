import { Navigate } from "react-router-dom";

export default function RequireAgentAuth({ children }) {
  try {
    const raw = sessionStorage.getItem("hcx_agent_auth");
    if (!raw) {
      return <Navigate to="/agent/login" replace />;
    }
    const parsed = JSON.parse(raw);
    const token =
      typeof parsed?.accessToken === "string" && parsed.accessToken.trim()
        ? parsed.accessToken.trim()
        : typeof parsed?.access_token === "string" && parsed.access_token.trim()
          ? parsed.access_token.trim()
          : "";
    if (!token) {
      sessionStorage.removeItem("hcx_agent_auth");
      return <Navigate to="/agent/login" replace />;
    }
  } catch {
    return <Navigate to="/agent/login" replace />;
  }
  return children;
}

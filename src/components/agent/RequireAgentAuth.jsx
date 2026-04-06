import { Navigate } from "react-router-dom";

export default function RequireAgentAuth({ children }) {
  try {
    if (!sessionStorage.getItem("hcx_agent_auth")) {
      return <Navigate to="/agent/login" replace />;
    }
  } catch {
    return <Navigate to="/agent/login" replace />;
  }
  return children;
}

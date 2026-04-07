import { Navigate } from "react-router-dom";
import { getAgentAccessToken } from "../../services/cropexApi";

export default function RequireAgentAuth({ children }) {
  try {
    if (!getAgentAccessToken()) {
      return <Navigate to="/agent/login" replace />;
    }
  } catch {
    return <Navigate to="/agent/login" replace />;
  }
  return children;
}

import { Navigate } from "react-router-dom";

export default function RequireFarmerAuth({ children }) {
  try {
    const raw = sessionStorage.getItem("hcx_farmer_auth");
    if (!raw) {
      return <Navigate to="/farmer/verify" replace />;
    }

    const parsed = JSON.parse(raw);
    const token =
      typeof parsed?.accessToken === "string" && parsed.accessToken.trim()
        ? parsed.accessToken.trim()
        : typeof parsed?.access_token === "string" && parsed.access_token.trim()
          ? parsed.access_token.trim()
          : "";

    if (!token) {
      sessionStorage.removeItem("hcx_farmer_auth");
      return <Navigate to="/farmer/verify" replace />;
    }
  } catch {
    return <Navigate to="/farmer/verify" replace />;
  }

  return children;
}

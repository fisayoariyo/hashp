import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Shared ──────────────────────────────────────
import RoleSelect from "./pages/shared/RoleSelect";

// ── Farmer pages ─────────────────────────────────
import FarmerSplash        from "./pages/farmer/FarmerSplash";
import FarmerVerify        from "./pages/farmer/FarmerVerify";
import FarmerHome          from "./pages/farmer/FarmerHome";
import FarmerID            from "./pages/farmer/FarmerID";
import FarmerProfile       from "./pages/farmer/FarmerProfile";
import FarmerSettings      from "./pages/farmer/FarmerSettings";

// ── Agent pages ──────────────────────────────────
import AgentSplash         from "./pages/agent/AgentSplash";
import AgentCreateAccount  from "./pages/agent/AgentCreateAccount";
import AgentVerifyPhone    from "./pages/agent/AgentVerifyPhone";
import AgentLogin          from "./pages/agent/AgentLogin";
import AgentHome           from "./pages/agent/AgentHome";
import AgentRegisterFarmer from "./pages/agent/AgentRegisterFarmer";
import AgentSavedFarmers   from "./pages/agent/AgentSavedFarmers";
import AgentSettings       from "./pages/agent/AgentSettings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shared */}
        <Route path="/"                        element={<RoleSelect />} />

        {/* Farmer */}
        <Route path="/farmer/splash"           element={<FarmerSplash />} />
        <Route path="/farmer/verify"           element={<FarmerVerify />} />
        <Route path="/farmer/home"             element={<FarmerHome />} />
        <Route path="/farmer/id"               element={<FarmerID />} />
        <Route path="/farmer/profile"          element={<FarmerProfile />} />
        <Route path="/farmer/settings"         element={<FarmerSettings />} />

        {/* Agent */}
        <Route path="/agent/splash"            element={<AgentSplash />} />
        <Route path="/agent/create-account"    element={<AgentCreateAccount />} />
        <Route path="/agent/verify-phone"      element={<AgentVerifyPhone />} />
        <Route path="/agent/login"             element={<AgentLogin />} />
        <Route path="/agent/home"              element={<AgentHome />} />
        <Route path="/agent/register-farmer"   element={<AgentRegisterFarmer />} />
        <Route path="/agent/saved-farmers"     element={<AgentSavedFarmers />} />
        <Route path="/agent/settings"          element={<AgentSettings />} />

        {/* Fallback */}
        <Route path="*"                        element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

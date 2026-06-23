import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAgentAuth         from "./components/agent/RequireAgentAuth";
import RequireFarmerAuth        from "./components/farmer/RequireFarmerAuth";
import LandingPage from "./pages/landing/LandingPage";
import RoleSelect from "./pages/shared/RoleSelect";
import FarmerSplash from "./pages/farmer/FarmerSplash";
import FarmerGetStarted from "./pages/farmer/FarmerGetStarted";
import FarmerVerify from "./pages/farmer/FarmerVerify";
import FarmerHome from "./pages/farmer/FarmerHome";
import FarmerID from "./pages/farmer/FarmerID";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import FarmerSettings from "./pages/farmer/FarmerSettings";
import FarmerComingSoon from "./pages/farmer/FarmerComingSoon";
import AgentSplash from "./pages/agent/AgentSplash";
import AgentCreateAccount from "./pages/agent/AgentCreateAccount";
import AgentVerifyPhone from "./pages/agent/AgentVerifyPhone";
import AgentIdentityVerification from "./pages/agent/AgentIdentityVerification";
import AgentSelectLocation from "./pages/agent/AgentSelectLocation";
import AgentAccountUnderReview from "./pages/agent/AgentAccountUnderReview";
import AgentAccountVerified from "./pages/agent/AgentAccountVerified";
import AgentVerificationFailed from "./pages/agent/AgentVerificationFailed";
import AgentContactSupport from "./pages/agent/AgentContactSupport";
import AgentForgotPassword from "./pages/agent/AgentForgotPassword";
import AgentResetPasswordNew from "./pages/agent/AgentResetPasswordNew";
import AgentLogin from "./pages/agent/AgentLogin";
import AgentHome from "./pages/agent/AgentHome";
import AgentRegisterFarmer from "./pages/agent/AgentRegisterFarmer";
import AgentSavedFarmers from "./pages/agent/AgentSavedFarmers";
import AgentSettings from "./pages/agent/AgentSettings";
import NotFoundScreen from "./screens/NotFoundScreen";
import LegalPage from "./pages/legal/LegalPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shared */}
        <Route path="/"                        element={<LandingPage />} />
        <Route path="/get-started"             element={<RoleSelect />} />
        <Route path="/log-in"                  element={<RoleSelect />} />
        <Route path="/privacy-policy"          element={<LegalPage />} />
        <Route path="/terms-of-use"            element={<LegalPage />} />
        <Route path="/data-protection"         element={<LegalPage />} />

        {/* Farmer */}
        <Route path="/farmer/splash"           element={<FarmerSplash />} />
        <Route path="/farmer/get-started"      element={<FarmerGetStarted />} />
        <Route path="/farmer/verify"           element={<FarmerVerify />} />
        <Route
          path="/farmer/home"
          element={
            <RequireFarmerAuth>
              <FarmerHome />
            </RequireFarmerAuth>
          }
        />
        <Route
          path="/farmer/id"
          element={
            <RequireFarmerAuth>
              <FarmerID />
            </RequireFarmerAuth>
          }
        />
        <Route
          path="/farmer/profile"
          element={
            <RequireFarmerAuth>
              <FarmerProfile />
            </RequireFarmerAuth>
          }
        />
        <Route
          path="/farmer/settings"
          element={
            <RequireFarmerAuth>
              <FarmerSettings />
            </RequireFarmerAuth>
          }
        />
        <Route
          path="/farmer/loans"
          element={
            <RequireFarmerAuth>
              <FarmerComingSoon />
            </RequireFarmerAuth>
          }
        />
        <Route
          path="/farmer/support"
          element={
            <RequireFarmerAuth>
              <FarmerComingSoon />
            </RequireFarmerAuth>
          }
        />
        <Route
          path="/farmer/buyers"
          element={
            <RequireFarmerAuth>
              <FarmerComingSoon />
            </RequireFarmerAuth>
          }
        />

        {/* Agent */}
        <Route path="/agent/splash"              element={<AgentSplash />} />
        <Route path="/agent/create-account"      element={<AgentCreateAccount />} />
        <Route path="/agent/verify-phone"        element={<AgentVerifyPhone />} />
        <Route path="/agent/identity-verification" element={<AgentIdentityVerification />} />
        <Route path="/agent/select-location"     element={<AgentSelectLocation />} />
        <Route path="/agent/account-under-review"  element={<AgentAccountUnderReview />} />
        <Route path="/agent/account-verified"      element={<AgentAccountVerified />} />
        <Route path="/agent/verification-failed"   element={<AgentVerificationFailed />} />
        <Route path="/agent/contact-support"      element={<AgentContactSupport />} />
        <Route path="/agent/forgot-password"       element={<AgentForgotPassword />} />
        <Route path="/agent/reset-password-new"    element={<AgentResetPasswordNew />} />
        <Route path="/agent/login"                 element={<AgentLogin />} />
        <Route
          path="/agent/home"
          element={
            <RequireAgentAuth>
              <AgentHome />
            </RequireAgentAuth>
          }
        />
        <Route
          path="/agent/register-farmer"
          element={
            <RequireAgentAuth>
              <AgentRegisterFarmer />
            </RequireAgentAuth>
          }
        />
        <Route
          path="/agent/saved-farmers"
          element={
            <RequireAgentAuth>
              <AgentSavedFarmers />
            </RequireAgentAuth>
          }
        />
        <Route
          path="/agent/settings"
          element={
            <RequireAgentAuth>
              <AgentSettings />
            </RequireAgentAuth>
          }
        />

        {/* Fallback */}
        <Route path="*"                        element={<NotFoundScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

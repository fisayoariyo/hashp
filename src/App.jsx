import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAgentAuth         from "./components/agent/RequireAgentAuth";

const LandingPage = lazy(() => import("./pages/landing/LandingPage"));
const RoleSelect = lazy(() => import("./pages/shared/RoleSelect"));

const FarmerSplash = lazy(() => import("./pages/farmer/FarmerSplash"));
const FarmerGetStarted = lazy(() => import("./pages/farmer/FarmerGetStarted"));
const FarmerVerify = lazy(() => import("./pages/farmer/FarmerVerify"));
const FarmerHome = lazy(() => import("./pages/farmer/FarmerHome"));
const FarmerID = lazy(() => import("./pages/farmer/FarmerID"));
const FarmerProfile = lazy(() => import("./pages/farmer/FarmerProfile"));
const FarmerSettings = lazy(() => import("./pages/farmer/FarmerSettings"));
const FarmerComingSoon = lazy(() => import("./pages/farmer/FarmerComingSoon"));

const AgentSplash = lazy(() => import("./pages/agent/AgentSplash"));
const AgentCreateAccount = lazy(() => import("./pages/agent/AgentCreateAccount"));
const AgentVerifyPhone = lazy(() => import("./pages/agent/AgentVerifyPhone"));
const AgentSelectLocation = lazy(() => import("./pages/agent/AgentSelectLocation"));
const AgentAccountUnderReview = lazy(() => import("./pages/agent/AgentAccountUnderReview"));
const AgentAccountVerified = lazy(() => import("./pages/agent/AgentAccountVerified"));
const AgentVerificationFailed = lazy(() => import("./pages/agent/AgentVerificationFailed"));
const AgentContactSupport = lazy(() => import("./pages/agent/AgentContactSupport"));
const AgentForgotPassword = lazy(() => import("./pages/agent/AgentForgotPassword"));
const AgentResetPasswordNew = lazy(() => import("./pages/agent/AgentResetPasswordNew"));
const AgentLogin = lazy(() => import("./pages/agent/AgentLogin"));
const AgentHome = lazy(() => import("./pages/agent/AgentHome"));
const AgentRegisterFarmer = lazy(() => import("./pages/agent/AgentRegisterFarmer"));
const AgentSavedFarmers = lazy(() => import("./pages/agent/AgentSavedFarmers"));
const AgentSettings = lazy(() => import("./pages/agent/AgentSettings"));

function RouteLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-5 text-center text-sm text-brand-text-secondary">
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Shared */}
        <Route path="/"                        element={<LandingPage />} />
        <Route path="/get-started"             element={<RoleSelect />} />
        <Route path="/log-in"                  element={<RoleSelect />} />

        {/* Farmer */}
        <Route path="/farmer/splash"           element={<FarmerSplash />} />
        <Route path="/farmer/get-started"      element={<FarmerGetStarted />} />
        <Route path="/farmer/verify"           element={<FarmerVerify />} />
        <Route path="/farmer/home"             element={<FarmerHome />} />
        <Route path="/farmer/id"               element={<FarmerID />} />
        <Route path="/farmer/profile"          element={<FarmerProfile />} />
        <Route path="/farmer/settings"         element={<FarmerSettings />} />
        <Route path="/farmer/loans"            element={<FarmerComingSoon />} />
        <Route path="/farmer/support"          element={<FarmerComingSoon />} />
        <Route path="/farmer/buyers"           element={<FarmerComingSoon />} />

        {/* Agent */}
        <Route path="/agent/splash"              element={<AgentSplash />} />
        <Route path="/agent/create-account"      element={<AgentCreateAccount />} />
        <Route path="/agent/verify-phone"        element={<AgentVerifyPhone />} />
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
        <Route path="*"                        element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

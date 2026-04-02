import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES } from "./constants/routes";

import SplashScreen from "./screens/SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import VerifyScreen from "./screens/VerifyScreen";
import OTPScreen from "./screens/OTPScreen";
import HomeScreen from "./screens/HomeScreen";
import FarmerIDScreen from "./screens/FarmerIDScreen";
import ProfileScreen from "./screens/ProfileScreen";
import UpdatesScreen from "./screens/UpdatesScreen";
import HelpScreen from "./screens/HelpScreen";
import FarmsScreen from "./screens/FarmsScreen";
import ActivitiesScreen from "./screens/ActivitiesScreen";
import NotFoundScreen from "./screens/NotFoundScreen";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.SPLASH}   element={<SplashScreen />} />
            <Route path={ROUTES.ONBOARD}  element={<OnboardingScreen />} />
            <Route path={ROUTES.VERIFY}   element={<VerifyScreen />} />
            <Route path={ROUTES.OTP}      element={<OTPScreen />} />

            <Route
              path={ROUTES.HOME}
              element={
                <ProtectedRoute>
                  <HomeScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ID_CARD}
              element={
                <ProtectedRoute>
                  <FarmerIDScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <ProfileScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.UPDATES}
              element={
                <ProtectedRoute>
                  <UpdatesScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.HELP}
              element={
                <ProtectedRoute>
                  <HelpScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.FARMS}
              element={
                <ProtectedRoute>
                  <FarmsScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ACTIVITIES}
              element={
                <ProtectedRoute>
                  <ActivitiesScreen />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

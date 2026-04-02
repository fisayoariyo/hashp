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

function Protected({ element }) {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.SPLASH}      element={<SplashScreen />} />
            <Route path={ROUTES.ONBOARD}     element={<OnboardingScreen />} />
            <Route path={ROUTES.VERIFY}      element={<VerifyScreen />} />
            <Route path={ROUTES.OTP}         element={<OTPScreen />} />
            <Route path={ROUTES.HOME}        element={<Protected element={<HomeScreen />} />} />
            <Route path={ROUTES.ID_CARD}     element={<Protected element={<FarmerIDScreen />} />} />
            <Route path={ROUTES.PROFILE}     element={<Protected element={<ProfileScreen />} />} />
            <Route path={ROUTES.UPDATES}     element={<Protected element={<UpdatesScreen />} />} />
            <Route path={ROUTES.HELP}        element={<Protected element={<HelpScreen />} />} />
            <Route path={ROUTES.FARMS}       element={<Protected element={<FarmsScreen />} />} />
            <Route path={ROUTES.ACTIVITIES}  element={<Protected element={<ActivitiesScreen />} />} />
            <Route path="*"                  element={<NotFoundScreen />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

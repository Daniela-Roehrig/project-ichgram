
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "../context/UserContext";
import { PostEventsProvider } from "../context/PostEventContext";
import { PostModalProvider } from "../context/PostModalContext";

import PrivateRoute from "../modules/PrivateRoute/PrivateRoute";
import PrivateLayout from "../layouts/PrivateLayout/PrivateLayout";
import PublicLayout from "../layouts/PublicLayout/PublicLayout";

import LoginPage from "./LoginPage/LoginPage";
import SignupPage from "./SignupPage/SignupPage";
import ForgotPasswordPage from "./ForgotPasswordPage/ForgotPasswordPage";
import HomePage from "./HomePage/HomePage";
import ProfilePage from "./ProfilePage/ProfilePage";
import EditProfilePage from "./EditProfilePage/EditProfilePage"
import OtherProfilePage from "./OtherProfilePage/OtherProfilePage"
import ExplorePage from "./ExplorePage/ExplorePage";
import NotFoundPage from "./NotFoundPage/NotFoundPage";
import LearnMorePage from './PolicyAndMorePages/LearnMorePage';
import ThermsPage from './PolicyAndMorePages/ThermsPage';
import PrivacyPolicyPage from './PolicyAndMorePages/PrivacyPolicyPage';
import CookiesPage from './PolicyAndMorePages/CookiesPage';

const Navigation = ({ onCreateClick }) => (
  <PostEventsProvider>
    <PostModalProvider>
      <UserProvider>
        <Routes>
          {/* Public Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/api/auth/register" element={<SignupPage />} />
            <Route path="/api/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/learn-more" element={<LearnMorePage />} />
            <Route path="/terms" element={<ThermsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookies-policy" element={<CookiesPage />} />
          </Route>

          {/* Private Layout mit PrivateRoute Schutz */}
          <Route element={<PrivateRoute><PrivateLayout onCreateClick={onCreateClick} /></PrivateRoute>}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/api/explore" element={<ExplorePage />} />
            <Route path="/users/:id" element={<OtherProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </UserProvider>
    </PostModalProvider>
  </PostEventsProvider>
);

export default Navigation;


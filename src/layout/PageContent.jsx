import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PartyFinderPage from "../pages/PartyFinderPage";
import CreateCampaignPage from "../pages/CreateCampaignPage";
import WikiPage from "../pages/WikiPage";
import WikiDetailPage from "../pages/WikiDetailPage";
import CreateHomebrewPage from "../pages/CreateHomebrewPage";
import MyCollectionsPage from "../pages/MyCollectionsPage";
import VenuesPage from "../pages/VenuesPage";
import CreateVenuePage from "../pages/CreateVenuePage";
import VenueDetailPage from "../pages/VenueDetailPage";
import ProfilePage from "../pages/ProfilePage";

const PageContent = () => {
  return (
    <Routes>
      {/* Ana Sayfa */}
      <Route path="/" element={<HomePage />} />

      {/* Auth İşlemleri */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/party-finder" element={<PartyFinderPage />} />
      <Route path="/create-campaign" element={<CreateCampaignPage />} />

      <Route path="/wiki" element={<WikiPage />} />
      <Route path="/wiki/:slug" element={<WikiDetailPage type="official" />} />
      <Route
        path="/homebrew/:slug"
        element={<WikiDetailPage type="homebrew" />}
      />
      <Route path="/create-homebrew" element={<CreateHomebrewPage />} />
      <Route path="/collections/me" element={<MyCollectionsPage />} />
      <Route path="/venues" element={<VenuesPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/venues/new" element={<CreateVenuePage />} />
      <Route path="/venues/:id" element={<VenueDetailPage />} />

      {/* Hatalı Linkler -> Anasayfaya yönlendir */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PageContent;

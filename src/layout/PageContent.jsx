import { Routes, Route, Navigate } from "react-router-dom";
import SettingsPage from "../pages/SettingsPage";
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
import TavernaPage from "../pages/TavernaPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import GuildsPage from "../pages/GuildsPage";
import GuildDetailPage from "../pages/GuildDetailPage";
import CreateGuildPage from "../pages/CreateGuildPage";
import MarketplacePage from "../pages/MarketplacePage";
import ListingDetailPage from "../pages/ListingDetailPage";
import CreateListingPage from "../pages/CreateListingPage";
import BadgesPage from "../pages/BadgesPage";

const PageContent = () => {
  return (
    <Routes>
      {/* Ana Sayfa */}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/create-campaign"
        element={<Navigate to="/kampanya-olustur" replace />}
      />
      <Route path="/wiki" element={<WikiPage />} />
      <Route path="/wiki/:slug" element={<WikiDetailPage type="official" />} />
      <Route
        path="/homebrew/:slug"
        element={<WikiDetailPage type="homebrew" />}
      />
      <Route path="/create-homebrew" element={<CreateHomebrewPage />} />
      <Route path="/collections/me" element={<MyCollectionsPage />} />
      <Route path="/venues" element={<VenuesPage />} />
      <Route path="/venues/new" element={<CreateVenuePage />} />
      <Route path="/venues/:id" element={<VenueDetailPage />} />

      {/* Taverna */}
      <Route path="/taverna" element={<TavernaPage />} />
      <Route path="/taverna/siralama" element={<LeaderboardPage />} />

      {/* Profile & Settings */}
      <Route path="/profil/:username" element={<ProfilePage />} />
      <Route
        path="/profile/:username"
        element={<Navigate to="/profil/:username" replace />}
      />
      <Route path="/ayarlar" element={<SettingsPage />} />

      {/* Campaign */}
      <Route path="/parti-bul" element={<PartyFinderPage />} />
      <Route
        path="/party-finder"
        element={<Navigate to="/parti-bul" replace />}
      />
      <Route path="/kampanya-olustur" element={<CreateCampaignPage />} />
      <Route path="/kampanya-duzenle/:id" element={<CreateCampaignPage />} />

      {/* Loncalar */}
      <Route path="/taverna/loncalar" element={<GuildsPage />} />
      <Route path="/taverna/loncalar/olustur" element={<CreateGuildPage />} />
      <Route path="/taverna/loncalar/:id" element={<GuildDetailPage />} />
      <Route
        path="/taverna/loncalar/:id/duzenle"
        element={<CreateGuildPage />}
      />

      <Route path="/taverna/rozetler" element={<BadgesPage />} />

      {/* Marketplace / Bit Pazarı */}
      <Route path="/pazar" element={<MarketplacePage />} />
      <Route path="/pazar/:id" element={<ListingDetailPage />} />
      <Route path="/pazar/ilan-olustur" element={<CreateListingPage />} />
      <Route path="/pazar/duzenle/:id" element={<CreateListingPage />} />

      {/* Redirect */}
      <Route path="/marketplace" element={<Navigate to="/pazar" replace />} />

      {/* Auth */}
      <Route path="/giris" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/giris" replace />} />
      <Route path="/kayit" element={<RegisterPage />} />
      <Route path="/register" element={<Navigate to="/kayit" replace />} />

      {/* Hatalı Linkler -> Anasayfaya yönlendir */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PageContent;

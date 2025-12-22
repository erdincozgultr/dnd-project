
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
import ProfilePage from "../pages/ProfilePage";
import TavernaPage from "../pages/TavernaPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import GuildsPage from "../pages/GuildsPage";
import GuildDetailPage from "../pages/GuildDetailPage";
import CreateGuildPage from "../pages/CreateGuildPage";
import BadgesPage from "../pages/BadgesPage";
import MarketplacePage from "../pages/MarketplacePage";
import ListingDetailPage from "../pages/ListingDetailPage";
import CreateListingPage from "../pages/CreateListingPage";
import VenuesPage from "../pages/VenuesPage";
import VenueDetailPage from "../pages/VenueDetailPage";
import CreateVenuePage from "../pages/CreateVenuePage";
import NotificationsPage from "../pages/NotificationsPage"

const PageContent = () => {
  return (
    <Routes>
      {/* Ana Sayfa */}
      <Route path="/" element={<HomePage />} />
      
      {/* Wiki & Homebrew */}
      <Route path="/wiki" element={<WikiPage />} />
      <Route path="/wiki/:slug" element={<WikiDetailPage type="official" />} />
      <Route path="/homebrew/:slug" element={<WikiDetailPage type="homebrew" />} />
      <Route path="/create-homebrew" element={<CreateHomebrewPage />} />
      <Route path="/collections/me" element={<MyCollectionsPage />} />

      {/* Dost Mekanlar - YENİ URL YAPISI */}
      <Route path="/mekanlar" element={<VenuesPage />} />
      <Route path="/mekanlar/:id" element={<VenueDetailPage />} />
      <Route path="/mekanlar/ekle" element={<CreateVenuePage />} />
      {/* Eski URL'ler için redirect */}
      <Route path="/venues" element={<Navigate to="/mekanlar" replace />} />
      <Route path="/venues/:id" element={<Navigate to="/mekanlar/:id" replace />} />
      <Route path="/venues/new" element={<Navigate to="/mekanlar/ekle" replace />} />

      {/* Taverna */}
      <Route path="/taverna" element={<TavernaPage />} />
      <Route path="/taverna/siralama" element={<LeaderboardPage />} />
      <Route path="/taverna/loncalar" element={<GuildsPage />} />
      <Route path="/taverna/loncalar/:id" element={<GuildDetailPage />} />
      <Route path="/taverna/lonca-olustur" element={<CreateGuildPage />} />
      <Route path="/taverna/lonca-duzenle/:id" element={<CreateGuildPage />} />
      <Route path="/taverna/rozetler" element={<BadgesPage />} />
      {/* Eski URL redirects */}
      <Route path="/guilds" element={<Navigate to="/taverna/loncalar" replace />} />
      <Route path="/guilds/:id" element={<Navigate to="/taverna/loncalar/:id" replace />} />

      {/* Bit Pazarı (Marketplace) */}
      <Route path="/pazar" element={<MarketplacePage />} />
      <Route path="/pazar/:id" element={<ListingDetailPage />} />
      <Route path="/pazar/ilan-olustur" element={<CreateListingPage />} />
      <Route path="/pazar/duzenle/:id" element={<CreateListingPage />} />
      <Route path="/marketplace" element={<Navigate to="/pazar" replace />} />

      {/* Profile & Settings */}
      <Route path="/profil/:username" element={<ProfilePage />} />
      <Route path="/profile/:username" element={<Navigate to="/profil/:username" replace />} />
      <Route path="/ayarlar" element={<SettingsPage />} />

      {/* Campaign / Parti Bul */}
      <Route path="/parti-bul" element={<PartyFinderPage />} />
      <Route path="/party-finder" element={<Navigate to="/parti-bul" replace />} />
      <Route path="/kampanya-olustur" element={<CreateCampaignPage />} />
      <Route path="/kampanya-duzenle/:id" element={<CreateCampaignPage />} />
      <Route path="/create-campaign" element={<Navigate to="/kampanya-olustur" replace />} />

           {/* Notifications */}
      <Route path="/bildirimler" element={<NotificationsPage />} />
      <Route path="/notifications" element={<Navigate to="/bildirimler" replace />} />

      {/* Auth */}
      <Route path="/giris" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/giris" replace />} />
      <Route path="/kayit" element={<RegisterPage />} />
      <Route path="/register" element={<Navigate to="/kayit" replace />} />

      {/* 404 - Anasayfaya yönlendir */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PageContent;
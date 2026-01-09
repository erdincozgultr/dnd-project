import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Pages imports
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import WikiPage from "../pages/WikiPage";
import WikiDetailPage from "../pages/WikiDetailPage";
import BlogPage from "../pages/blog/BlogPage";
import BlogDetailPage from "../pages/blog/BlogDetailPage";
import CreateBlogPage from "../pages/blog/CreateBlogPage";
import MyBlogsPage from "../pages/blog/MyBlogsPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/TermsOfServicePage";

// Protected pages
import SettingsPage from "../pages/SettingsPage";
import PartyFinderPage from "../pages/PartyFinderPage";
import CreateCampaignPage from "../pages/CreateCampaignPage";
import CreateHomebrewPage from "../pages/CreateHomebrewPage";
import MyCollectionsPage from "../pages/MyCollectionsPage";
import MyHomebrewsPage from "../pages/MyHomebrewsPage";
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
import NotificationsPage from "../pages/NotificationsPage";

const PageContent = () => {
  return (
    <Routes>
      {/* ========================================
          PUBLIC ROUTES - Herkes Erişebilir
      ======================================== */}
      
      {/* Ana Sayfa */}
      <Route path="/" element={<HomePage />} />

      {/* Wiki - Public okuma, protected yazma */}
      <Route path="/wiki" element={<WikiPage />} />
      <Route path="/wiki/:slug" element={<WikiDetailPage type="official" />} />
      
      {/* Homebrew Detail - Public okuma */}
      <Route path="/homebrew/:slug" element={<WikiDetailPage type="homebrew" />} />

      {/* Blog - Public okuma */}
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />

      {/* Footer Pages */}
      <Route path="/hakkimizda" element={<AboutPage />} />
      <Route path="/iletisim" element={<ContactPage />} />
      <Route path="/gizlilik" element={<PrivacyPolicyPage />} />
      <Route path="/kullanim-sartlari" element={<TermsOfServicePage />} />

      {/* Auth Pages */}
      <Route path="/giris" element={<LoginPage />} />
      <Route path="/login" element={<Navigate to="/giris" replace />} />
      <Route path="/kayit" element={<RegisterPage />} />
      <Route path="/register" element={<Navigate to="/kayit" replace />} />

      {/* ========================================
          PROTECTED ROUTES - Sadece Üyeler
      ======================================== */}

      {/* Blog Yazma ve Yönetimi - Protected */}
      <Route
        path="/blog/yaz"
        element={
          <ProtectedRoute>
            <CreateBlogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog/duzenle/:id"
        element={
          <ProtectedRoute>
            <CreateBlogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog/bloglarim"
        element={
          <ProtectedRoute>
            <MyBlogsPage />
          </ProtectedRoute>
        }
      />

      {/* Homebrew Oluşturma - Protected */}
      <Route
        path="/create-homebrew"
        element={
          <ProtectedRoute>
            <CreateHomebrewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collections/me"
        element={
          <ProtectedRoute>
            <MyCollectionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/homebrews/me"
        element={
          <ProtectedRoute>
            <MyHomebrewsPage />
          </ProtectedRoute>
        }
      />

      {/* Dost Mekanlar - Protected */}
      <Route
        path="/mekanlar"
        element={
          <ProtectedRoute>
            <VenuesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mekanlar/:id"
        element={
          <ProtectedRoute>
            <VenueDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mekanlar/ekle"
        element={
          <ProtectedRoute>
            <CreateVenuePage />
          </ProtectedRoute>
        }
      />
      <Route path="/venues" element={<Navigate to="/mekanlar" replace />} />
      <Route path="/venues/:id" element={<Navigate to="/mekanlar/:id" replace />} />
      <Route path="/venues/new" element={<Navigate to="/mekanlar/ekle" replace />} />

      {/* Taverna - Protected */}
      <Route
        path="/taverna"
        element={
          <ProtectedRoute>
            <TavernaPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/taverna/siralama"
        element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/taverna/loncalar"
        element={
          <ProtectedRoute>
            <GuildsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/taverna/loncalar/:id"
        element={
          <ProtectedRoute>
            <GuildDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/taverna/lonca-olustur"
        element={
          <ProtectedRoute>
            <CreateGuildPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/taverna/lonca-duzenle/:id"
        element={
          <ProtectedRoute>
            <CreateGuildPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/taverna/rozetler"
        element={
          <ProtectedRoute>
            <BadgesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/guilds" element={<Navigate to="/taverna/loncalar" replace />} />
      <Route path="/guilds/:id" element={<Navigate to="/taverna/loncalar/:id" replace />} />

      {/* Bit Pazarı - Protected */}
      <Route
        path="/pazar"
        element={
          <ProtectedRoute>
            <MarketplacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pazar/:id"
        element={
          <ProtectedRoute>
            <ListingDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pazar/ilan-olustur"
        element={
          <ProtectedRoute>
            <CreateListingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pazar/duzenle/:id"
        element={
          <ProtectedRoute>
            <CreateListingPage />
          </ProtectedRoute>
        }
      />
      <Route path="/marketplace" element={<Navigate to="/pazar" replace />} />

      {/* Campaign / Parti Bul - Protected */}
      <Route
        path="/parti-bul"
        element={
          <ProtectedRoute>
            <PartyFinderPage />
          </ProtectedRoute>
        }
      />
      <Route path="/party-finder" element={<Navigate to="/parti-bul" replace />} />
      <Route
        path="/kampanya-olustur"
        element={
          <ProtectedRoute>
            <CreateCampaignPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kampanya-duzenle/:id"
        element={
          <ProtectedRoute>
            <CreateCampaignPage />
          </ProtectedRoute>
        }
      />
      <Route path="/create-campaign" element={<Navigate to="/kampanya-olustur" replace />} />

      {/* Profil & Ayarlar - Protected */}
      <Route
        path="/profil/:username"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/profile/:username" element={<Navigate to="/profil/:username" replace />} />
      <Route
        path="/ayarlar"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Bildirimler - Protected */}
      <Route
        path="/bildirimler"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/notifications" element={<Navigate to="/bildirimler" replace />} />

      {/* 404 - Ana sayfaya yönlendir */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default PageContent;
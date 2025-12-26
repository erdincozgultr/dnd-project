// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  Shield,
  Award,
  Users,
  Calendar,
  ScrollText,
  Flame,
  Eye,
  ChevronRight,
  Loader2,
  Settings,
  MessageSquare,
  MapPin,
  BookOpen,
  Swords,
  Trophy,
  Star,
  Heart,
  Edit3,
  ExternalLink,
} from "lucide-react";
import useAxios, { METHODS } from "../hooks/useAxios";

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { sendRequest, loading } = useAxios();

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    sendRequest({
      url: `/users/profile/${username}`,
      method: METHODS.GET,
      callbackSuccess: (res) => setProfile(res.data),
    });
  }, [username]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 className="animate-spin text-cta" size={48} />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Genel Bakış", icon: <Shield size={16} /> },
    { id: "content", label: "İçerikler", icon: <ScrollText size={16} /> },
    { id: "badges", label: "Rozetler", icon: <Award size={16} /> },
    { id: "activity", label: "Aktivite", icon: <Flame size={16} /> },
  ];

  const getRankColor = (rank) => {
    const colors = {
      PEASANT: "from-gray-500 to-gray-400",
      ADVENTURER: "from-green-500 to-emerald-400",
      VETERAN: "from-blue-500 to-cyan-400",
      HERO: "from-purple-500 to-pink-400",
      LEGEND: "from-yellow-500 to-orange-400",
    };
    return colors[rank] || colors["PEASANT"];
  };

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>{profile.displayName || profile.username} | Zar & Kule</title>
      </Helmet>

      {/* ==================== HERO BANNER ==================== */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {/* Banner Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: profile.bannerUrl
              ? `url('${profile.bannerUrl}')`
              : `url('https://i.pinimg.com/736x/77/a0/66/77a066581f52577684ebf61a2c7327f2.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pb via-pb/60 to-transparent" />

        {/* Edit Button */}
        {isOwnProfile && (
          <Link
            to={`/ayarlar`}
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm text-white text-sm font-bold rounded-xl border border-white/20 hover:bg-cta hover:border-cta transition-all"
          >
            <Edit3 size={16} /> Profili Düzenle
          </Link>
        )}
      </div>

      {/* ==================== PROFILE HEADER ==================== */}
      <div className="relative -mt-20 pb-6 border-b border-cbg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-mbg overflow-hidden bg-cbg shadow-2xl">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getRankColor(
                      profile.stats?.rankTier
                    )} flex items-center justify-center text-white font-black text-5xl`}
                  >
                    {profile.displayName?.charAt(0) ||
                      profile.username?.charAt(0)}
                  </div>
                )}
              </div>
              {/* Rank Badge */}
              <div
                className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-lg bg-gradient-to-r ${getRankColor(
                  profile.stats?.rankTier
                )} text-white text-xs font-black uppercase shadow-lg`}
              >
                {profile.stats?.rankTitle || "Köylü"}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-mtf">
                  {profile.displayName || profile.username}
                </h1>
                {profile.title && (
                  <span className="px-3 py-1 bg-cta/10 text-cta text-sm font-bold rounded-lg border border-cta/20">
                    {profile.title}
                  </span>
                )}
              </div>
              <p className="text-sti mb-3">@{profile.username}</p>

              {profile.bio && (
                <p className="text-mtf/80 max-w-2xl mb-4 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-sti">
                {profile.guild && (
                  <Link
                    to={`/guilds/${profile.guild.id}`}
                    className="flex items-center gap-1.5 hover:text-cta transition-colors"
                  >
                    <Users size={16} className="text-purple-500" />
                    <span className="font-bold">{profile.guild.name}</span>
                    <span className="text-xs bg-purple-500/10 px-1.5 py-0.5 rounded">
                      Lv.{profile.guild.level}
                    </span>
                  </Link>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>
                    {new Date(profile.joinedAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                    })}{" "}
                    tarihinden beri üye
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 md:gap-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black text-cta">
                  {profile.stats?.currentXp?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-sti uppercase tracking-wider font-bold">
                  XP
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black text-mtf">
                  {profile.homebrewCount || 0}
                </p>
                <p className="text-xs text-sti uppercase tracking-wider font-bold">
                  Eser
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black text-mtf">
                  {profile.stats?.totalBadgeCount || 0}
                </p>
                <p className="text-xs text-sti uppercase tracking-wider font-bold">
                  Rozet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== TABS ==================== */}
      <div className="sticky top-20 z-30 bg-mbg border-b border-cbg">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all
                  ${
                    activeTab === tab.id
                      ? "bg-cta text-white shadow-lg shadow-cta/20"
                      : "text-sti hover:bg-cbg hover:text-mtf"
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ==================== CONTENT ==================== */}
      <div className="container mx-auto px-4 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* XP Progress Card */}
              <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-mtf uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Trophy size={20} className="text-cta" />
                  İlerleme Durumu
                </h3>

                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getRankColor(
                      profile.stats?.rankTier
                    )} flex items-center justify-center`}
                  >
                    <Shield size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-black text-mtf">
                      {profile.stats?.rankTitle || "Köylü"}
                    </p>
                    <p className="text-sm text-sti">Mevcut Rütbe</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-cta">
                      {profile.stats?.currentXp?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-sti uppercase">Toplam XP</p>
                  </div>
                </div>

                {/* XP Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-sti font-medium">
                    <span>Sonraki rütbeye kalan</span>
                    <span className="text-cta font-bold">
                      {profile.stats?.xpToNextRank?.toLocaleString() || 0} XP
                    </span>
                  </div>
                  <div className="h-3 bg-cbg rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getRankColor(
                        profile.stats?.rankTier
                      )} rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.min(
                          100,
                          100 - ((profile.stats?.xpToNextRank || 0) / 500) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-mtf uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Star size={20} className="text-yellow-500" />
                  İstatistikler
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={<ScrollText size={24} className="text-purple-500" />}
                    value={profile.stats?.totalHomebrews || 0}
                    label="Homebrew"
                  />
                  <StatCard
                    icon={<BookOpen size={24} className="text-blue-500" />}
                    value={profile.stats?.totalBlogs || 0}
                    label="Blog Yazısı"
                  />
                  <StatCard
                    icon={
                      <MessageSquare size={24} className="text-green-500" />
                    }
                    value={profile.stats?.totalComments || 0}
                    label="Yorum"
                  />
                  <StatCard
                    icon={<Heart size={24} className="text-red-500" />}
                    value={profile.stats?.totalLikesReceived || 0}
                    label="Beğeni Aldı"
                  />
                </div>
              </div>

              {/* Featured Homebrews */}
              {profile.publicCollections &&
                profile.publicCollections.length > 0 && (
                  <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2">
                        <ScrollText size={20} className="text-purple-500" />
                        Koleksiyonlar
                      </h3>
                      <Link
                        to={`/collections/${username}`}
                        className="text-sm font-bold text-cta hover:underline flex items-center gap-1"
                      >
                        Tümünü Gör <ChevronRight size={16} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.publicCollections
                        .slice(0, 4)
                        .map((collection) => (
                          <Link
                            key={collection.id}
                            to={`/collections/${collection.id}`}
                            className="flex items-center gap-3 p-4 bg-mbg rounded-xl hover:bg-cbg/50 transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                              <ScrollText
                                size={24}
                                className="text-purple-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-mtf group-hover:text-cta transition-colors truncate">
                                {collection.name}
                              </p>
                              <p className="text-xs text-sti">
                                {collection.itemCount} içerik
                              </p>
                            </div>
                            <ChevronRight
                              size={18}
                              className="text-sti group-hover:text-cta group-hover:translate-x-1 transition-all"
                            />
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Featured Badges */}
              <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-black text-mtf uppercase tracking-tight mb-4 flex items-center gap-2">
                  <Award size={20} className="text-yellow-500" />
                  Rozetler
                </h3>

                {profile.featuredBadges && profile.featuredBadges.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {profile.featuredBadges.slice(0, 8).map((badge) => (
                      <div
                        key={badge.id}
                        className="aspect-square rounded-xl bg-cbg/50 flex items-center justify-center hover:bg-cta/10 transition-colors cursor-pointer group"
                        title={badge.name}
                      >
                        {badge.iconUrl ? (
                          <img
                            src={badge.iconUrl}
                            alt={badge.name}
                            className="w-8 h-8 group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <Award
                            size={24}
                            className="text-yellow-500 group-hover:scale-110 transition-transform"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Award size={40} className="mx-auto text-cbg mb-2" />
                    <p className="text-sti text-sm">Henüz rozet kazanılmadı</p>
                  </div>
                )}

                {profile.stats?.totalBadgeCount > 8 && (
                  <button
                    onClick={() => setActiveTab("badges")}
                    className="w-full mt-4 py-2 text-center text-sm font-bold text-cta hover:underline"
                  >
                    +{profile.stats.totalBadgeCount - 8} rozet daha
                  </button>
                )}
              </div>

              {/* Guild Card */}
              {profile.guild && (
                <Link
                  to={`/guilds/${profile.guild.id}`}
                  className="block bg-white border border-cbg rounded-2xl p-6 shadow-sm hover:border-purple-500/30 hover:shadow-lg transition-all group"
                >
                  <h3 className="text-lg font-black text-mtf uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Users size={20} className="text-purple-500" />
                    Lonca
                  </h3>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center">
                      <Shield size={32} className="text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-mtf group-hover:text-purple-600 transition-colors">
                        {profile.guild.name}
                      </p>
                      <p className="text-sm text-sti">
                        Seviye {profile.guild.level}
                      </p>
                      <p className="text-xs text-sti">
                        {profile.guild.memberCount} üye
                      </p>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-sti group-hover:text-purple-500 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </Link>
              )}

              {/* Campaign Activity */}
              {profile.campaignCount > 0 && (
                <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-black text-mtf uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Swords size={20} className="text-red-500" />
                    Macera Geçmişi
                  </h3>

                  <div className="text-center py-4">
                    <p className="text-3xl font-black text-mtf">
                      {profile.campaignCount}
                    </p>
                    <p className="text-sm text-sti">Kampanya / Masa</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === "content" && <ContentTab username={username} />}

        {/* BADGES TAB */}
        {activeTab === "badges" && <BadgesTab badges={profile.badges} />}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && <ActivityTab username={username} />}
      </div>
    </div>
  );
};

// ==================== HELPER COMPONENTS ====================

const StatCard = ({ icon, value, label }) => (
  <div className="bg-mbg rounded-xl p-4 text-center">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-2xl font-black text-mtf">{value}</p>
    <p className="text-xs text-sti uppercase tracking-wider font-bold">
      {label}
    </p>
  </div>
);

const ContentTab = ({ username }) => {
  const [homebrews, setHomebrews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const { sendRequest, loading } = useAxios();

  useEffect(() => {
    // Fetch user's homebrews
    sendRequest({
      url: `/homebrews/user/${username}`,
      method: METHODS.GET,
      callbackSuccess: (res) =>
        setHomebrews(res.data.content || res.data || []),
      showErrorToast: false,
    });
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-cta" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Homebrews */}
      <div>
        <h3 className="text-xl font-black text-mtf uppercase tracking-tight mb-6 flex items-center gap-2">
          <ScrollText size={24} className="text-purple-500" />
          Homebrew İçerikler
        </h3>

        {homebrews.length === 0 ? (
          <div className="bg-white border border-cbg rounded-2xl p-12 text-center">
            <ScrollText size={48} className="mx-auto text-cbg mb-4" />
            <p className="text-sti">Henüz içerik paylaşılmadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homebrews.map((item) => (
              <Link
                key={item.id}
                to={`/homebrew/${item.slug}`}
                className="bg-white border border-cbg rounded-2xl overflow-hidden hover:border-cta/50 hover:shadow-lg transition-all group"
              >
                <div className="h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ScrollText size={40} className="text-purple-500/30" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded">
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-mtf group-hover:text-cta transition-colors truncate mb-2">
                    {item.name || item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-sti">
                    <span className="flex items-center gap-1">
                      <Flame size={12} className="text-red-400" />{" "}
                      {item.likeCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {item.viewCount || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BadgesTab = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="bg-white border border-cbg rounded-2xl p-12 text-center">
        <Award size={64} className="mx-auto text-cbg mb-4" />
        <p className="text-xl font-bold text-mtf mb-2">
          Henüz rozet kazanılmadı
        </p>
        <p className="text-sti">
          İçerik oluşturarak ve etkileşimde bulunarak rozet kazanabilirsin!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="bg-white border border-cbg rounded-2xl p-4 text-center hover:border-yellow-500/50 hover:shadow-lg transition-all group"
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            {badge.iconUrl ? (
              <img
                src={badge.iconUrl}
                alt={badge.name}
                className="w-10 h-10 group-hover:scale-110 transition-transform"
              />
            ) : (
              <Award
                size={32}
                className="text-yellow-500 group-hover:scale-110 transition-transform"
              />
            )}
          </div>
          <p className="font-bold text-mtf text-sm mb-1">{badge.name}</p>
          <p className="text-[10px] text-sti line-clamp-2">
            {badge.description}
          </p>
        </div>
      ))}
    </div>
  );
};

const ActivityTab = ({ username }) => {
  // Bu kısım için backend'de aktivite endpoint'i gerekebilir
  // Şimdilik placeholder
  return (
    <div className="bg-white border border-cbg rounded-2xl p-12 text-center">
      <Flame size={64} className="mx-auto text-cbg mb-4" />
      <p className="text-xl font-bold text-mtf mb-2">Aktivite Geçmişi</p>
      <p className="text-sti">Yakında eklenecek...</p>
    </div>
  );
};

export default ProfilePage;

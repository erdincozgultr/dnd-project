// src/pages/GuildDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import GuildXPDisplay from "../components/guild/GuildXPDisplay";
import QuestList from "../components/guild/QuestList";
import {
  Shield,
  Users,
  Crown,
  ChevronLeft,
  TrendingUp,
  Loader2,
  Settings,
  UserPlus,
  Award,
  Flame,
  Edit3,
  Target,
  UserMinus,
  ScrollText,
  FileText,
  Trophy,
  BarChart3,
  Heart,
} from "lucide-react";
import useAxios, { METHODS } from "../hooks/useAxios";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

const GuildDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { sendRequest, loading } = useAxios();

  const [guild, setGuild] = useState(null);
  const [activeTab, setActiveTab] = useState("members");
  const [contributions, setContributions] = useState(null);
  const [contributionPeriod, setContributionPeriod] = useState("monthly");

  useEffect(() => {
    sendRequest({
      url: `/guilds/${id}`,
      method: METHODS.GET,
      callbackSuccess: (res) => setGuild(res.data),
      callbackError: () => {
        toast.error("Lonca bulunamadı.");
        navigate("/taverna/loncalar");
      },
    });
  }, [id]);

  // Contributions fetch
  useEffect(() => {
    if (activeTab === "contributions" && id) {
      sendRequest({
        url: `/guilds/${id}/contributions?period=${contributionPeriod}`,
        method: METHODS.GET,
        callbackSuccess: (res) => setContributions(res.data),
      });
    }
  }, [activeTab, id, contributionPeriod]);

  if (loading || !guild) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  const isLeader =
    guild.currentUserIsLeader || user?.username === guild.leader?.username;
  const isMember =
    guild.currentUserIsMember ||
    guild.members?.some((m) => m.username === user?.username) ||
    isLeader;

  const handleJoin = () => {
    sendRequest({
      url: `/guilds/${id}/join`,
      method: METHODS.POST,
      callbackSuccess: () => {
        toast.success("Loncaya katıldın!");
        window.location.reload();
      },
    });
  };

  const handleLeave = () => {
    if (!window.confirm("Loncadan ayrılmak istediğine emin misin?")) return;

    sendRequest({
      url: `/guilds/${id}/leave`,
      method: METHODS.POST,
      callbackSuccess: () => {
        toast.success("Loncadan ayrıldın.");
        navigate("/taverna/loncalar");
      },
    });
  };

  const handleDelete = () => {
    if (
      !window.confirm(
        "Loncayı silmek istediğine emin misin? Bu işlem geri alınamaz!"
      )
    )
      return;

    sendRequest({
      url: `/guilds/${id}`,
      method: METHODS.DELETE,
      callbackSuccess: () => {
        toast.success("Lonca silindi.");
        navigate("/taverna/loncalar");
      },
    });
  };

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet>
        <title>{guild.name} | Zar & Kule</title>
      </Helmet>

      {/* Hero Header */}
      <div className="relative h-80 overflow-hidden">
        {/* Banner */}
        {guild.bannerUrl ? (
          <div className="absolute inset-0 ">
            <img
              src={guild.bannerUrl}
              alt={guild.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mtf/50 to-mtf" />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600" />
            <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 to-mtf" />
          </>
        )}

        <div className="container mx-auto px-4 h-full flex flex-col justify-between relative z-10">
          {/* Back Button */}
          <Link
            to="/taverna/loncalar"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white pt-6 transition-colors w-fit"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">Loncalara Dön</span>
          </Link>

          {/* Guild Info */}
          <div className="pb-12">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              {guild.avatarUrl ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={guild.avatarUrl}
                    alt={guild.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-4 border-white shadow-xl flex items-center justify-center backdrop-blur-sm">
                  <Shield size={48} className="text-amber-500" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                  <Shield size={12} />
                  Lonca
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                  {guild.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <Crown size={16} className="text-yellow-400" />
                    <span>
                      {guild.leader?.displayName || guild.leader?.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{guild.memberCount || 0} üye</span>
                  </div>
                  <div className="px-3 py-1 bg-amber-500/10 rounded-lg">
                    <span className="text-amber-600 font-black text-sm">
                      Level {guild.level || 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {isAuthenticated && !isMember && (
                  <button
                    onClick={handleJoin}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30"
                  >
                    <UserPlus size={18} /> Katıl
                  </button>
                )}

                {isAuthenticated && isMember && !isLeader && (
                  <button
                    onClick={handleLeave}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-white/20 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
                  >
                    <UserMinus size={18} /> Ayrıl
                  </button>
                )}

                {isLeader && (
                  <Link
                    to={`/taverna/lonca-duzenle/${guild.id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors"
                  >
                    <Settings size={18} /> Düzenle
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        {/* Description */}
        {guild.description && (
          <div className="bg-white border border-cbg rounded-2xl p-6 mb-6 shadow-sm">
            <p className="text-sti leading-relaxed">{guild.description}</p>
          </div>
        )}

        <div className="m-6">
          <GuildXPDisplay guild={guild} variant="full" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            "members",
            "quests",
            "contributions",
            // "activity",
            // "achievements",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all
                ${
                  activeTab === tab
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "bg-white border border-cbg text-sti hover:text-mtf"
                }
              `}
            >
              {tab === "members" && "Üyeler"}
              {tab === "quests" && "Görevler"}
              {tab === "contributions" && "Katkılar"}

              
              {tab === "activity" && "Aktivite"}
              {tab === "achievements" && "Başarılar"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "members" && (
          <div className="bg-white border border-cbg rounded-2xl p-6">
            <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
              <Users size={20} className="text-amber-500" />
              Üyeler ({guild.members?.length || 0})
            </h3>

            {guild.members?.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-cbg mb-4" />
                <p className="text-sti">Henüz üye yok</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {guild.members?.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    isLeader={member.username === guild.leader?.username}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "quests" && (
          <div className="bg-white border border-cbg rounded-2xl p-6">
            <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
              <Target size={20} className="text-amber-500" />
              Görevler
            </h3>
            <QuestList guildId={id} />
          </div>
        )}

        {activeTab === "contributions" && (
          <div className="space-y-6">
            {/* Period Filter */}
            <div className="flex gap-2">
              {["weekly", "monthly", "alltime"].map((period) => (
                <button
                  key={period}
                  onClick={() => setContributionPeriod(period)}
                  className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                    contributionPeriod === period
                      ? "bg-amber-500 text-white"
                      : "bg-white border border-cbg text-sti hover:border-amber-500"
                  }`}
                >
                  {period === "weekly"
                    ? "Bu Hafta"
                    : period === "monthly"
                    ? "Bu Ay"
                    : "Tüm Zamanlar"}
                </button>
              ))}
            </div>

            {!contributions ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-amber-500" size={32} />
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-cbg rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                      {contributions.homebrewsCount}
                    </div>
                    <p className="text-sm font-bold text-sti">
                      Homebrew Paylaşıldı
                    </p>
                  </div>

                  <div className="bg-white border border-cbg rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                      {contributions.blogsCount}
                    </div>
                    <p className="text-sm font-bold text-sti">Blog Yazıldı</p>
                  </div>

                  <div className="bg-white border border-cbg rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                      {contributions.campaignsCount}
                    </div>
                    <p className="text-sm font-bold text-sti">
                      Kampanya Oluşturuldu
                    </p>
                  </div>
                </div>

                {/* Recent Homebrews */}
                {contributions.recentHomebrews?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
                      <ScrollText size={20} className="text-amber-500" />
                      Son Paylaşılan Homebrew'lar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contributions.recentHomebrews.map((homebrew) => (
                        <Link
                          key={homebrew.id}
                          to={`/homebrew/${homebrew.slug}`}
                          className="bg-white border border-cbg rounded-xl p-4 hover:shadow-lg hover:border-amber-500 transition-all group"
                        >
                          <h4 className="font-bold text-mtf mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
                            {homebrew.title}
                          </h4>
                          <p className="text-xs text-sti mb-3">
                            {homebrew.authorName} •{" "}
                            {formatDistanceToNow(new Date(homebrew.createdAt), {
                              addSuffix: true,
                              locale: tr,
                            })}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-sti">
                            <span className="flex items-center gap-1">
                              <Heart size={12} className="text-red-500" />
                              {homebrew.likeCount}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Blogs */}
                {contributions.recentBlogs?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
                      <FileText size={20} className="text-blue-500" />
                      Son Yazılan Bloglar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contributions.recentBlogs.map((blog) => (
                        <Link
                          key={blog.id}
                          to={`/blog/${blog.slug}`}
                          className="bg-white border border-cbg rounded-xl p-4 hover:shadow-lg hover:border-amber-500 transition-all group"
                        >
                          <h4 className="font-bold text-mtf mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
                            {blog.title}
                          </h4>
                          <p className="text-xs text-sti mb-3">
                            {blog.authorName} •{" "}
                            {formatDistanceToNow(new Date(blog.createdAt), {
                              addSuffix: true,
                              locale: tr,
                            })}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-sti">
                            <span className="flex items-center gap-1">
                              <Heart size={12} className="text-red-500" />
                              {blog.likeCount}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Contributors */}
                {contributions.topContributors?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
                      <Trophy size={20} className="text-yellow-500" />
                      En Aktif Üyeler
                    </h3>
                    <div className="space-y-2">
                      {contributions.topContributors.map((member, index) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between bg-white border border-cbg rounded-xl p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            {/* Rank Badge */}
                            <div
                              className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-black text-sm
                                ${
                                  index === 0
                                    ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
                                    : index === 1
                                    ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
                                    : index === 2
                                    ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                                    : "bg-cbg text-sti"
                                }
                              `}
                            >
                              {index + 1}
                            </div>

                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                              {member.avatarUrl ? (
                                <img
                                  src={member.avatarUrl}
                                  alt={member.displayName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-amber-500 font-black">
                                  {member.displayName?.charAt(0) ||
                                    member.username?.charAt(0)}
                                </div>
                              )}
                            </div>

                            {/* Name */}
                            <Link
                              to={`/profil/${member.username}`}
                              className="font-bold text-mtf hover:text-amber-600 transition-colors"
                            >
                              {member.displayName || member.username}
                            </Link>
                          </div>

                          {/* Stats */}
                          <div className="text-right">
                            <p className="font-black text-amber-600">
                              +{member.xpContributed.toLocaleString()} XP
                            </p>
                            <p className="text-xs text-sti">
                              {member.contentCount} içerik
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {contributions.homebrewsCount === 0 &&
                  contributions.blogsCount === 0 &&
                  contributions.campaignsCount === 0 && (
                    <div className="text-center py-12">
                      <TrendingUp size={48} className="mx-auto text-sti mb-4" />
                      <p className="text-lg font-bold text-mtf mb-2">
                        Henüz Katkı Yok
                      </p>
                      <p className="text-sm text-sti">
                        {contributionPeriod === "weekly"
                          ? "Bu hafta henüz içerik paylaşılmadı"
                          : contributionPeriod === "monthly"
                          ? "Bu ay henüz içerik paylaşılmadı"
                          : "Henüz hiç içerik paylaşılmadı"}
                      </p>
                    </div>
                  )}
              </>
            )}
          </div>
        )}

        {/* 
        {activeTab === "activity" && (
          <div className="bg-white border border-cbg rounded-2xl p-6">
            <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
              <Flame size={20} className="text-amber-500" />
              Son Aktiviteler
            </h3>
            <div className="text-center py-12">
              <Flame size={48} className="mx-auto text-cbg mb-4" />
              <p className="text-sti">Yakında eklenecek</p>
            </div>
          </div>
        )} */}

        {/* 
        {activeTab === "achievements" && (
          <div className="bg-white border border-cbg rounded-2xl p-6">
            <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
              <Award size={20} className="text-amber-500" />
              Lonca Başarıları
            </h3>
            <div className="text-center py-12">
              <Award size={48} className="mx-auto text-cbg mb-4" />
              <p className="text-sti">Yakında eklenecek</p>
            </div>
          </div>
        )}
         */}
      </div>
    </div>
  );
};

const MemberCard = ({ member, isLeader }) => (
  <Link
    to={`/profil/${member.username}`}
    className="flex items-center gap-3 p-3 bg-mbg rounded-xl hover:bg-amber-50 transition-colors group"
  >
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={member.username}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-amber-500 font-black">
          {member.displayName?.charAt(0) || member.username?.charAt(0)}
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-mtf group-hover:text-amber-600 transition-colors truncate">
        {member.displayName || member.username}
      </p>
      <p className="text-xs text-sti truncate">@{member.username}</p>
    </div>
    {isLeader && <Crown size={18} className="text-yellow-500 flex-shrink-0" />}
  </Link>
);

export default GuildDetailPage;

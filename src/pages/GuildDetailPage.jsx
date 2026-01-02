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
} from "lucide-react";
import useAxios, { METHODS } from "../hooks/useAxios";

const GuildDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { sendRequest, loading } = useAxios();

  const [guild, setGuild] = useState(null);
  const [activeTab, setActiveTab] = useState("members");

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

  if (loading || !guild) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
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
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>{guild.name} | Zar & Kule</title>
      </Helmet>

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/77/a0/66/77a066581f52577684ebf61a2c7327f2.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mbg via-purple-900/70 to-purple-900/50" />

        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link
            to="/taverna/loncalar"
            className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm text-white rounded-xl hover:bg-black/50 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">Loncalar</span>
          </Link>
        </div>

        {/* Edit Button */}
        {isLeader && (
          <div className="absolute top-6 right-6">
            <Link
              to={`/taverna/loncalar/${id}/duzenle`}
              className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm text-white rounded-xl hover:bg-purple-500 transition-colors"
            >
              <Edit3 size={16} />
              <span className="text-sm font-bold">Düzenle</span>
            </Link>
          </div>
        )}
      </div>

      {/* Tabs & Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Guild Info Card */}
        <div className="bg-white border border-cbg rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Guild Icon */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30 flex items-center justify-center">
                <Shield size={48} className="text-purple-500" />
              </div>
            </div>

            {/* Guild Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-mtf">
                  {guild.name}
                </h1>
                <div className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm font-black">
                  Lv.{guild.level || 1}
                </div>
              </div>

              <p className="text-sti mb-4 max-w-2xl">
                {guild.description || "Bu lonca henüz bir açıklama eklememiş."}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-purple-500" />
                  <span className="font-bold text-mtf">
                    {guild.memberCount || guild.members?.length || 0}
                  </span>
                  <span className="text-sti text-sm">üye</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-500" />
                  <span className="font-bold text-mtf">
                    {(guild.xp || 0).toLocaleString()}
                  </span>
                  <span className="text-sti text-sm">XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown size={18} className="text-yellow-500" />
                  <Link
                    to={`/profil/${guild.leader?.username}`}
                    className="font-bold text-mtf hover:text-purple-600 transition-colors"
                  >
                    {guild.leader?.displayName || guild.leader?.username}
                  </Link>
                  <span className="text-sti text-sm">(Lider)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 md:items-end">
              {isAuthenticated && !isMember && (
                <button
                  onClick={handleJoin}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/30"
                >
                  <UserPlus size={18} /> Katıl
                </button>
              )}

              {isMember && !isLeader && (
                <button
                  onClick={handleLeave}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  <UserMinus size={18} /> Ayrıl
                </button>
              )}

              {isLeader && (
                <Link
                  to={`/taverna/loncalar/${guild.id}/duzenle`}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
                >
                  <Settings size={18} /> Düzenle
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="m-6">
          <GuildXPDisplay guild={guild} variant="full" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["members", "quests", "activity", "achievements"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all
                ${
                  activeTab === tab
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white border border-cbg text-sti hover:text-mtf"
                }
              `}
            >
              {tab === "members" && "Üyeler"}
              {tab === "quests" && "Görevler"}
              {tab === "activity" && "Aktivite"}
              {tab === "achievements" && "Başarılar"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "members" && (
          <div className="bg-white border border-cbg rounded-2xl p-6">
            <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
              <Users size={20} className="text-purple-500" />
              Üyeler ({guild.members?.length || 0})
            </h3>

            {guild.members?.length === 0 ? (
              <p className="text-sti text-center py-8">Henüz üye yok.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Leader First */}
                {guild.leader && (
                  <MemberCard member={guild.leader} isLeader={true} />
                )}
                {/* Other Members */}
                {guild.members
                  ?.filter((m) => m.username !== guild.leader?.username)
                  .map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "quests" && (
          <div className="bg-white border border-cbg rounded-2xl p-6">
            <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
              <Target size={20} className="text-purple-500" />
              Lonca Quest'leri
            </h3>
            <QuestList guildId={guild.id} />
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white border border-cbg rounded-2xl p-6">
            <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
              <Flame size={20} className="text-cta" />
              Son Aktiviteler
            </h3>
            <p className="text-sti text-center py-8">Yakında...</p>
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="bg-white border border-cbg rounded-2xl p-6">
            <h3 className="text-lg font-black text-mtf mb-4 flex items-center gap-2">
              <Award size={20} className="text-yellow-500" />
              Lonca Başarıları
            </h3>
            <p className="text-sti text-center py-8">Yakında...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Member Card Component
const MemberCard = ({ member, isLeader = false }) => (
  <Link
    to={`/profil/${member.username}`}
    className="flex items-center gap-3 p-4 bg-mbg rounded-xl hover:bg-purple-50 transition-colors group"
  >
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-2 border-cbg overflow-hidden flex-shrink-0">
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={member.username}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-purple-500 font-black">
          {member.displayName?.charAt(0) || member.username?.charAt(0)}
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-mtf group-hover:text-purple-600 transition-colors truncate">
        {member.displayName || member.username}
      </p>
      <p className="text-xs text-sti truncate">@{member.username}</p>
    </div>
    {isLeader && <Crown size={18} className="text-yellow-500 flex-shrink-0" />}
  </Link>
);

export default GuildDetailPage;

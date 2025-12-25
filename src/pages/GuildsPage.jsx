// src/pages/GuildsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import {
  Shield,
  Users,
  Crown,
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  Loader2,
  TrendingUp,
  Star,
  Sparkles,
  Filter,
} from "lucide-react";
import useAxios, { METHODS } from "../hooks/useAxios";

const GuildsPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { sendRequest, loading } = useAxios();

  const [guilds, setGuilds] = useState([]);
  const [filteredGuilds, setFilteredGuilds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("level"); // level, members, xp

  useEffect(() => {
    sendRequest({
      url: "/guilds",
      method: METHODS.GET,
      callbackSuccess: (res) => {
        setGuilds(res.data);
        setFilteredGuilds(res.data);
      },
      showErrorToast: false,
    });
  }, []);

  // Filter & Sort
  useEffect(() => {
    let result = [...guilds];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (g) =>
          g.name?.toLowerCase().includes(term) ||
          g.description?.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "level") return b.level - a.level;
      if (sortBy === "members") return b.memberCount - a.memberCount;
      if (sortBy === "xp") return b.xp - a.xp;
      return 0;
    });

    setFilteredGuilds(result);
  }, [guilds, searchTerm, sortBy]);

  const userGuild = guilds.find(
    (g) =>
      g.currentUserIsMember ||
      g.members?.some((m) => m.username === user?.username) ||
      g.leader?.username === user?.username
  );

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Loncalar | Zar & Kule</title>
        <meta
          name="description"
          content="Zar & Kule loncalarına katıl veya kendi loncanı kur."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/8a/7e/9a/8a7e9a5b7c8e9d0a1b2c3d4e5f6a7b8c.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-900/80 to-mbg" />

        <div className="container mx-auto px-4 relative z-10">
          <Link
            to="/taverna"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">Taverna'ya Dön</span>
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-bold uppercase tracking-wider mb-6">
              <Shield size={16} />
              Loncalar
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Birlikte <span className="text-purple-400">Güçlen</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl">
              Bir loncaya katıl, birlikte XP kazan ve diyarın en güçlü topluluğu
              ol.
            </p>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Lonca ara..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md text-white placeholder:text-white/40 rounded-xl border border-white/20 outline-none focus:border-purple-400 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl border border-white/20 outline-none appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="level" className="text-mtf">
                  Seviyeye Göre
                </option>
                <option value="members" className="text-mtf">
                  Üye Sayısına Göre
                </option>
                <option value="xp" className="text-mtf">
                  XP'ye Göre
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* User's Guild Banner */}
        {isAuthenticated && userGuild && (
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Shield size={28} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-bold">
                    Senin Loncan
                  </p>
                  <p className="text-xl font-black text-mtf">
                    {userGuild.name}
                  </p>
                </div>
              </div>
              <Link
                to={`/taverna/loncalar/${userGuild.id}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors"
              >
                Loncana Git <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        )}

        {/* Create Guild CTA */}
        {isAuthenticated && !userGuild && (
          <div className="mb-8 p-6 bg-gradient-to-r from-cta/10 to-orange-500/10 border border-cta/20 rounded-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xl font-black text-mtf mb-1">
                  Henüz bir loncan yok!
                </p>
                <p className="text-sti">
                  Bir loncaya katıl veya kendi loncanı kur.
                </p>
              </div>
              <Link
                to="/taverna/loncalar/olustur"
                className="flex items-center gap-2 px-5 py-2.5 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-colors shadow-lg shadow-cta/30"
              >
                <Plus size={18} /> Lonca Kur
              </Link>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Shield size={24} />}
            value={guilds.length}
            label="Toplam Lonca"
            color="purple"
          />
          <StatCard
            icon={<Users size={24} />}
            value={guilds.reduce((acc, g) => acc + (g.memberCount || 0), 0)}
            label="Toplam Üye"
            color="blue"
          />
          <StatCard
            icon={<Star size={24} />}
            value={Math.max(...guilds.map((g) => g.level || 0), 0)}
            label="En Yüksek Seviye"
            color="yellow"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            value={guilds
              .reduce((acc, g) => acc + (g.xp || 0), 0)
              .toLocaleString()}
            label="Toplam XP"
            color="green"
          />
        </div>

        {/* Guild List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-purple-500" size={48} />
          </div>
        ) : filteredGuilds.length === 0 ? (
          <div className="text-center py-20 bg-white border border-cbg rounded-2xl">
            <Shield size={64} className="mx-auto text-cbg mb-4" />
            <h3 className="text-xl font-black text-mtf mb-2">
              Lonca Bulunamadı
            </h3>
            <p className="text-sti mb-6">Arama kriterlerine uygun lonca yok.</p>
            {isAuthenticated && (
              <Link
                to="/taverna/loncalar/olustur"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors"
              >
                <Plus size={18} /> İlk Loncayı Kur
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuilds.map((guild, index) => (
              <GuildCard key={guild.id} guild={guild} rank={index + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== HELPER COMPONENTS ====================

const StatCard = ({ icon, value, label, color }) => {
  const colors = {
    purple: "bg-purple-500/10 text-purple-500",
    blue: "bg-blue-500/10 text-blue-500",
    yellow: "bg-yellow-500/10 text-yellow-500",
    green: "bg-green-500/10 text-green-500",
  };

  return (
    <div className="bg-white border border-cbg rounded-2xl p-4 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-mtf">{value}</p>
        <p className="text-xs text-sti uppercase tracking-wider font-bold">
          {label}
        </p>
      </div>
    </div>
  );
};

const GuildCard = ({ guild, rank }) => {
  const isTopThree = rank <= 3;
  const rankColors = {
    1: "from-yellow-500 to-amber-400",
    2: "from-gray-400 to-gray-300",
    3: "from-amber-700 to-amber-600",
  };

  return (
    <Link
      to={`/taverna/loncalar/${guild.id}`}
      className={`
        bg-white border border-cbg rounded-2xl overflow-hidden hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 group
        ${isTopThree ? "ring-2 ring-purple-500/20" : ""}
      `}
    >
      {/* Top Bar */}
      <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Rank Badge */}
            {isTopThree ? (
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rankColors[rank]} flex items-center justify-center text-white font-black text-sm`}
              >
                #{rank}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-cbg flex items-center justify-center text-sti font-black text-sm">
                #{rank}
              </div>
            )}

            {/* Guild Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center">
              <Shield size={24} className="text-purple-500" />
            </div>
          </div>

          {/* Level Badge */}
          <div className="px-3 py-1 bg-purple-500/10 rounded-lg">
            <span className="text-purple-600 font-black text-sm">
              Lv.{guild.level || 1}
            </span>
          </div>
        </div>

        {/* Guild Info */}
        <h3 className="text-lg font-black text-mtf mb-1 group-hover:text-purple-600 transition-colors">
          {guild.name}
        </h3>
        <p className="text-sm text-sti line-clamp-2 mb-4">
          {guild.description || "Bu lonca henüz bir açıklama eklememiş."}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-cbg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-sti">
              <Users size={14} className="text-purple-500" />
              <span className="font-bold">{guild.memberCount || 0}</span>
              <span className="text-xs">üye</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-sti">
              <TrendingUp size={14} className="text-green-500" />
              <span className="font-bold">
                {(guild.xp || 0).toLocaleString()}
              </span>
              <span className="text-xs">XP</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-sti">
            <Crown size={14} className="text-yellow-500" />
            <span className="font-medium truncate max-w-[80px]">
              {guild.leader?.displayName ||
                guild.leader?.username ||
                "Bilinmiyor"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GuildsPage;

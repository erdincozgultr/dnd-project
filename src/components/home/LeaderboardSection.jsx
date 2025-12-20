// src/components/home/LeaderboardSection.jsx - TAMAMEN YENİDEN
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, Crown, Flame, ScrollText, Users, 
  ChevronRight, Loader2, Shield, Award
} from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';

const LeaderboardSection = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({
    topUsers: [],
    topHomebrews: [],
    topGuilds: [],
  });
  const { sendRequest, loading } = useAxios();

  useEffect(() => {
    sendRequest({
      url: '/leaderboard/users/xp',
      method: METHODS.GET,
      params: { limit: 5 },
      callbackSuccess: (res) => setData(prev => ({ ...prev, topUsers: res.data })),
      showErrorToast: false,
    });

    sendRequest({
      url: '/leaderboard/content/homebrews',
      method: METHODS.GET,
      params: { limit: 5 },
      callbackSuccess: (res) => setData(prev => ({ ...prev, topHomebrews: res.data })),
      showErrorToast: false,
    });

    sendRequest({
      url: '/leaderboard/guilds/level',
      method: METHODS.GET,
      params: { limit: 5 },
      callbackSuccess: (res) => setData(prev => ({ ...prev, topGuilds: res.data })),
      showErrorToast: false,
    });
  }, []);

  const tabs = [
    { id: 'users', label: 'Kahramanlar', icon: <Crown size={16} /> },
    { id: 'homebrews', label: 'Efsaneler', icon: <ScrollText size={16} /> },
    { id: 'guilds', label: 'Loncalar', icon: <Users size={16} /> },
  ];

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-amber-400 text-white shadow-lg shadow-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-300 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-700 to-amber-600 text-white';
    return 'bg-white/10 text-white/70';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={14} className="text-yellow-300" />;
    if (rank === 2) return <Award size={14} className="text-gray-200" />;
    if (rank === 3) return <Award size={14} className="text-amber-300" />;
    return null;
  };

  return (
    <section className="relative py-20 overflow-hidden sm:h-[1000px]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://i.pinimg.com/736x/77/a0/66/77a066581f52577684ebf61a2c7327f2.jpg')` 
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />
      {/* Top Gradient Line */}
      {/* <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cta to-transparent" /> */}
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cta/20 border border-cta/30 text-cta text-sm font-bold uppercase tracking-wider mb-4">
            <Trophy size={16} />
            Taverna İlan Panosu
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Diyarın <span className="text-cta">Efsaneleri</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            En başarılı maceracılar, en beğenilen eserler ve en güçlü loncalar burada!
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-cta text-white shadow-lg shadow-cta/30 scale-105' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}
              `}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-cta" size={40} />
            </div>
          ) : (
            <>
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-3">
                  {data.topUsers.length === 0 ? (
                    <EmptyState message="Henüz sıralama oluşmadı" />
                  ) : (
                    data.topUsers.map((entry, index) => (
                      <Link 
                        key={entry.user?.username || index}
                        to={`/profile/${entry.user?.username}`}
                        className={`
                          flex items-center gap-4 p-4 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10
                          hover:bg-black/60 hover:border-cta/50 transition-all duration-300 group
                          ${index === 0 ? 'ring-2 ring-cta/50' : ''}
                        `}
                      >
                        {/* Rank Badge */}
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0
                          ${getRankStyle(entry.rank)}
                        `}>
                          {getRankIcon(entry.rank) || `#${entry.rank}`}
                        </div>

                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cta/30 to-purple-500/30 border-2 border-white/20 overflow-hidden flex-shrink-0">
                          {entry.user?.avatarUrl ? (
                            <img src={entry.user.avatarUrl} alt={entry.user.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-black text-lg">
                              {entry.user?.displayName?.charAt(0) || entry.user?.username?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold group-hover:text-cta transition-colors truncate">
                            {entry.user?.displayName || entry.user?.username}
                          </p>
                          <p className="text-white/50 text-sm truncate">{entry.rankTier}</p>
                        </div>

                        {/* XP */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-cta font-black text-xl">{entry.value?.toLocaleString()}</p>
                          <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold">XP</p>
                        </div>

                        <ChevronRight size={20} className="text-white/30 group-hover:text-cta group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    ))
                  )}
                </div>
              )}

              {/* Homebrews Tab */}
              {activeTab === 'homebrews' && (
                <div className="space-y-3">
                  {data.topHomebrews.length === 0 ? (
                    <EmptyState message="Henüz eser paylaşılmadı" />
                  ) : (
                    data.topHomebrews.map((entry, index) => (
                      <Link 
                        key={entry.contentId || index}
                        to={`/homebrew/${entry.slug}`}
                        className={`
                          flex items-center gap-4 p-4 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10
                          hover:bg-black/60 hover:border-cta/50 transition-all duration-300 group
                          ${index === 0 ? 'ring-2 ring-cta/50' : ''}
                        `}
                      >
                        {/* Rank Badge */}
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0
                          ${getRankStyle(entry.rank)}
                        `}>
                          {getRankIcon(entry.rank) || `#${entry.rank}`}
                        </div>

                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                          <ScrollText size={24} className="text-purple-400" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold group-hover:text-cta transition-colors truncate">
                            {entry.title}
                          </p>
                          <p className="text-white/50 text-sm truncate">
                            by {entry.authorUsername}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-red-400 font-black text-xl flex items-center justify-end gap-1">
                            <Flame size={18} /> {entry.likeCount}
                          </p>
                          <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold">Beğeni</p>
                        </div>

                        <ChevronRight size={20} className="text-white/30 group-hover:text-cta group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    ))
                  )}
                </div>
              )}

              {/* Guilds Tab */}
              {activeTab === 'guilds' && (
                <div className="space-y-3">
                  {data.topGuilds.length === 0 ? (
                    <EmptyState message="Henüz lonca kurulmadı" />
                  ) : (
                    data.topGuilds.map((guild, index) => (
                      <Link 
                        key={guild.guildId || index}
                        to={`/guilds/${guild.guildId}`}
                        className={`
                          flex items-center gap-4 p-4 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10
                          hover:bg-black/60 hover:border-cta/50 transition-all duration-300 group
                          ${index === 0 ? 'ring-2 ring-cta/50' : ''}
                        `}
                      >
                        {/* Rank Badge */}
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0
                          ${getRankStyle(index + 1)}
                        `}>
                          {getRankIcon(index + 1) || `#${index + 1}`}
                        </div>

                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                          <Shield size={24} className="text-indigo-400" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold group-hover:text-cta transition-colors truncate">
                            {guild.guildName}
                          </p>
                          <p className="text-white/50 text-sm truncate">
                            Lider: {guild.leaderUsername}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <div className="text-center">
                            <p className="text-indigo-400 font-black text-xl">{guild.level}</p>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold">Seviye</p>
                          </div>
                          <div className="text-center">
                            <p className="text-white/70 font-bold text-lg">{guild.memberCount}</p>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold">Üye</p>
                          </div>
                        </div>

                        <ChevronRight size={20} className="text-white/30 group-hover:text-cta group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link 
            to="/leaderboard"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-cta text-white font-bold hover:bg-cta-hover transition-all duration-300 shadow-lg shadow-cta/30 hover:shadow-cta/50 hover:scale-105"
          >
            <Trophy size={18} />
            Tüm Sıralamaları Gör
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cta to-transparent" /> */}
    </section>
  );
};

// Empty State Component
const EmptyState = ({ message }) => (
  <div className="text-center py-12 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10">
    <Trophy size={48} className="mx-auto text-white/20 mb-4" />
    <p className="text-white/50">{message}</p>
    <p className="text-white/30 text-sm mt-1">İlk sen ol!</p>
  </div>
);

export default LeaderboardSection;
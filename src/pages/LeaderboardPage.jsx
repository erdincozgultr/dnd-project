// src/pages/LeaderboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Trophy, Crown, Flame, ScrollText, Users, Shield,
  ChevronLeft, Loader2, Award, Star, TrendingUp
} from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState('users-xp');
  const [data, setData] = useState([]);
  const { sendRequest, loading } = useAxios();

  const tabs = [
    { id: 'users-xp', label: 'XP Sıralaması', icon: <Trophy size={16} />, endpoint: '/leaderboard/users/xp' },
    { id: 'users-likes', label: 'En Beğenilenler', icon: <Flame size={16} />, endpoint: '/leaderboard/users/likes' },
    { id: 'users-content', label: 'En Üretkenler', icon: <ScrollText size={16} />, endpoint: '/leaderboard/users/content' },
    { id: 'homebrews', label: 'Top Homebrew', icon: <Star size={16} />, endpoint: '/leaderboard/content/homebrews' },
    { id: 'guilds', label: 'Loncalar', icon: <Shield size={16} />, endpoint: '/leaderboard/guilds/level' },
  ];

  useEffect(() => {
    const currentTab = tabs.find(t => t.id === activeTab);
    if (currentTab) {
      sendRequest({
        url: currentTab.endpoint,
        method: METHODS.GET,
        params: { limit: 50 },
        callbackSuccess: (res) => setData(res.data),
        showErrorToast: false,
      });
    }
  }, [activeTab]);

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-amber-400 text-white shadow-lg shadow-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-300 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-700 to-amber-600 text-white';
    return 'bg-cbg text-sti';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={16} className="text-yellow-300" />;
    if (rank === 2) return <Award size={16} className="text-gray-200" />;
    if (rank === 3) return <Award size={16} className="text-amber-300" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Sıralama | Zar & Kule</title>
      </Helmet>

      {/* Header */}
      <div className="bg-pb py-8">
        <div className="container mx-auto px-4">
          <Link 
            to="/taverna" 
            className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors w-fit"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">Taverna'ya Dön</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cta/20 border border-cta/30 flex items-center justify-center">
              <Trophy size={28} className="text-cta" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Sıralama Tablosu</h1>
              <p className="text-white/60">Diyarın en güçlü maceracıları</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-cbg sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all
                  ${activeTab === tab.id 
                    ? 'bg-cta text-white shadow-lg shadow-cta/20' 
                    : 'text-sti hover:bg-cbg hover:text-mtf'}
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-cta" size={48} />
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-20 bg-white border border-cbg rounded-2xl">
              <Trophy size={64} className="mx-auto text-cbg mb-4" />
              <p className="text-xl font-bold text-mtf mb-2">Henüz veri yok</p>
              <p className="text-sti">İlk sen ol!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((entry, index) => (
                <LeaderboardRow 
                  key={entry.id || index}
                  entry={entry}
                  rank={entry.rank || index + 1}
                  type={activeTab}
                  getRankStyle={getRankStyle}
                  getRankIcon={getRankIcon}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Row Component
const LeaderboardRow = ({ entry, rank, type, getRankStyle, getRankIcon }) => {
  const isUser = type.startsWith('users');
  const isGuild = type === 'guilds';
  const isContent = type === 'homebrews';

  return (
    <div className={`
      flex items-center gap-4 p-4 bg-white border border-cbg rounded-2xl
      hover:border-cta/30 hover:shadow-lg transition-all
      ${rank <= 3 ? 'ring-2 ring-cta/20' : ''}
    `}>
      {/* Rank */}
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0
        ${getRankStyle(rank)}
      `}>
        {getRankIcon(rank) || `#${rank}`}
      </div>

      {/* Avatar/Icon */}
      {isUser && (
        <Link 
          to={`/profil/${entry.user?.username}`}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-cta/20 to-purple-500/20 border-2 border-cbg overflow-hidden flex-shrink-0 hover:border-cta transition-colors"
        >
          {entry.user?.avatarUrl ? (
            <img src={entry.user.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cta font-black">
              {entry.user?.displayName?.charAt(0) || entry.user?.username?.charAt(0)}
            </div>
          )}
        </Link>
      )}
      {isGuild && (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
          <Shield size={24} className="text-purple-500" />
        </div>
      )}
      {isContent && (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cta/20 to-orange-500/20 border border-cta/30 flex items-center justify-center flex-shrink-0">
          <ScrollText size={24} className="text-cta" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        {isUser && (
          <>
            <Link 
              to={`/profil/${entry.user?.username}`}
              className="font-bold text-mtf hover:text-cta transition-colors truncate block"
            >
              {entry.user?.displayName || entry.user?.username}
            </Link>
            <p className="text-sm text-sti truncate">{entry.rankTier || 'Maceracı'}</p>
          </>
        )}
        {isGuild && (
          <>
            <Link 
              to={`/taverna/loncalar/${entry.guildId}`}
              className="font-bold text-mtf hover:text-purple-600 transition-colors truncate block"
            >
              {entry.guildName}
            </Link>
            <p className="text-sm text-sti truncate">Lider: {entry.leaderUsername}</p>
          </>
        )}
        {isContent && (
          <>
            <Link 
              to={`/homebrew/${entry.slug}`}
              className="font-bold text-mtf hover:text-cta transition-colors truncate block"
            >
              {entry.title}
            </Link>
            <p className="text-sm text-sti truncate">by {entry.authorUsername}</p>
          </>
        )}
      </div>

      {/* Value */}
      <div className="text-right flex-shrink-0">
        <p className="text-xl font-black text-cta">{entry.value?.toLocaleString() || entry.level || entry.likeCount || 0}</p>
        <p className="text-[10px] text-sti uppercase tracking-wider font-bold">
          {isUser && type === 'users-xp' && 'XP'}
          {isUser && type === 'users-likes' && 'Beğeni'}
          {isUser && type === 'users-content' && 'İçerik'}
          {isGuild && 'Seviye'}
          {isContent && 'Beğeni'}
        </p>
      </div>
    </div>
  );
};

export default LeaderboardPage;
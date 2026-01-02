// src/pages/TavernaPage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import {
  Trophy, Users, Flame, ScrollText, Shield, Star, Sparkles,
  Crown, ChevronRight, Loader2
} from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

const TavernaPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { sendRequest } = useAxios();
  
  // Leaderboard data state
  const [leaderboardData, setLeaderboardData] = useState({
    topUser: null,
    topHomebrew: null,
    topGuild: null,
    loading: true,
  });

  const menuItems = [
    {
      icon: <Trophy size={32} />,
      title: 'Sıralama',
      description: 'Diyarın en güçlü maceracıları, en beğenilen eserleri ve en aktif loncaları',
      href: '/taverna/siralama',
      bgColor: 'bg-yellow-100',
      color: 'from-yellow-500 to-amber-500',
      borderColor: 'border-yellow-200',
    },
    {
      icon: <Users size={32} />,
      title: 'Loncalar',
      description: 'Topluluğa katıl, görevler tamamla ve birlikte XP kazan',
      href: '/taverna/loncalar',
      bgColor: 'bg-blue-100',
      color: 'from-blue-500 to-purple-500',
      borderColor: 'border-blue-200',
    },
    {
      icon: <Star size={32} />,
      title: 'Özetler',
      description: 'Kütüphane içerikleri, bloglar ve topluluk katkılarının derlenmiş halleri',
      href: '/taverna/ozetler',
      bgColor: 'bg-purple-100',
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-200',
    },
  ];

  // Fetch leaderboard data
  useEffect(() => {
    // Top user by XP
    sendRequest({
      url: '/leaderboard/users/xp',
      method: METHODS.GET,
      params: { limit: 1 },
      callbackSuccess: (res) => {
        setLeaderboardData(prev => ({ 
          ...prev, 
          topUser: res.data[0] || null 
        }));
      },
      showErrorToast: false,
    });

    // Top homebrew by likes
    sendRequest({
      url: '/leaderboard/content/homebrews',
      method: METHODS.GET,
      params: { limit: 1 },
      callbackSuccess: (res) => {
        setLeaderboardData(prev => ({ 
          ...prev, 
          topHomebrew: res.data[0] || null 
        }));
      },
      showErrorToast: false,
    });

    // Top guild by level
    sendRequest({
      url: '/leaderboard/guilds/level',
      method: METHODS.GET,
      params: { limit: 1 },
      callbackSuccess: (res) => {
        setLeaderboardData(prev => ({ 
          ...prev, 
          topGuild: res.data[0] || null,
          loading: false 
        }));
      },
      showErrorToast: false,
    });
  }, []);

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Taverna | Zar & Kule</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-pb py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-cta rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cta/20 border border-cta/30 text-cta text-sm font-bold uppercase tracking-wider mb-4">
              <Flame size={16} />
              Topluluk Merkezi
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              🏰 Taverna'ya <span className="text-gradient bg-gradient-to-r from-cta to-yellow-400 bg-clip-text text-transparent">Hoş Geldin!</span>
            </h1>
            
            <p className="text-white/80 text-lg mb-8">
              XP kazan, rozet topla, loncalara katıl ve topluluğun bir parçası ol!
            </p>

          {/* User Quick Stats */}
          {isAuthenticated && user && (
            <div className="inline-flex items-center gap-6 px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="text-center">
                <p className="text-2xl font-black text-cta">{user.currentXp || 0}</p>
                <p className="text-white/60 text-xs uppercase">XP</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-black text-white">{user.currentRank || 'Köylü'}</p>
                <p className="text-white/60 text-xs uppercase">Rütbe</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <Link 
                to={`/profil/${user.username}`}
                className="flex items-center gap-2 text-cta hover:text-white transition-colors"
              >
                <span className="text-sm font-bold">Profilim</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
      </section>

      {/* Menu Cards - BOŞLUK DÜZELTİLDİ */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`
                group bg-white border ${item.borderColor} rounded-2xl p-6 shadow-sm
                hover:shadow-xl hover:scale-105 transition-all duration-300
              `}
            >
              <div className={`
                w-16 h-16 rounded-2xl ${item.bgColor} flex items-center justify-center mb-4
                group-hover:scale-110 transition-transform
              `}>
                <span className={`bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}>
                  {item.icon}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-mtf mb-2 group-hover:text-cta transition-colors">
                {item.title}
              </h3>
              <p className="text-sti text-sm mb-4">
                {item.description}
              </p>
              
              <span className="flex items-center gap-1 text-cta font-bold text-sm group-hover:translate-x-2 transition-transform">
                Keşfet <ChevronRight size={16} />
              </span>
            </Link>
          ))}
        </div>

        {/* Quick Leaderboard Preview */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-mtf flex items-center gap-2">
              <Crown size={24} className="text-yellow-500" />
              Bu Haftanın Yıldızları
            </h2>
            <Link 
              to="/taverna/siralama" 
              className="text-sm font-bold text-cta hover:underline flex items-center gap-1"
            >
              Tüm Sıralama <ChevronRight size={16} />
            </Link>
          </div>

          {/* Leaderboard Cards */}
          {leaderboardData.loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-cta" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top User */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Crown size={20} className="text-yellow-500" />
                  <span className="text-xs font-black text-yellow-700 uppercase">En Güçlü Kahraman</span>
                </div>
                {leaderboardData.topUser ? (
                  <div className="flex items-center gap-3">
                    {leaderboardData.topUser.avatarUrl ? (
                      <img
                        src={leaderboardData.topUser.avatarUrl}
                        alt={leaderboardData.topUser.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-400 flex items-center justify-center text-white font-black text-lg">
                        {leaderboardData.topUser.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="font-black text-mtf">{leaderboardData.topUser.displayName}</p>
                      <p className="text-xs text-sti">{leaderboardData.topUser.xp?.toLocaleString() || 0} XP</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-sti">Henüz veri yok</p>
                )}
              </div>

              {/* Top Homebrew */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ScrollText size={20} className="text-purple-500" />
                  <span className="text-xs font-black text-purple-700 uppercase">En Beğenilen Eser</span>
                </div>
                {leaderboardData.topHomebrew ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-black">
                      <ScrollText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-mtf truncate">{leaderboardData.topHomebrew.title}</p>
                      <p className="text-xs text-sti">{leaderboardData.topHomebrew.likeCount || 0} Beğeni</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-sti">Henüz veri yok</p>
                )}
              </div>

              {/* Top Guild */}
              <div className="bg-gradient-to-br from-cta/10 to-orange-500/10 border border-cta/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={20} className="text-cta" />
                  <span className="text-xs font-black text-cta uppercase">En Güçlü Lonca</span>
                </div>
                {leaderboardData.topGuild ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cta to-orange-400 flex items-center justify-center text-white font-black">
                      <Shield size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-mtf truncate">{leaderboardData.topGuild.name}</p>
                      <p className="text-xs text-sti">Seviye {leaderboardData.topGuild.level || 0}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-sti">Henüz veri yok</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CTA for non-authenticated */}
        {!isAuthenticated && (
          <div className="mt-12 max-w-2xl mx-auto text-center bg-pb rounded-2xl p-8">
            <Sparkles size={40} className="mx-auto text-cta mb-4" />
            <h3 className="text-2xl font-black text-white mb-3">
              Topluluğa Katıl
            </h3>
            <p className="text-white/70 mb-6">
              Hesap oluştur, XP kazan, rozet topla ve loncalara katıl!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/kayit"
                className="px-8 py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-all"
              >
                Ücretsiz Kayıt Ol
              </Link>
              <Link
                to="/giris"
                className="px-8 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TavernaPage;
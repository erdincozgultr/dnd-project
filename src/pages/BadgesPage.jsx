// src/pages/BadgesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { 
  Award, ChevronLeft, Loader2, Lock, CheckCircle,
  Star, MessageSquare, ScrollText, Heart, Clock, Gift,
  Sparkles, Filter
} from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

// Kategori tanımları
const CATEGORIES = {
  FIRST_STEPS: { 
    label: 'İlk Adımlar', 
    icon: <Star size={20} />, 
    color: 'from-green-500 to-emerald-400',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600'
  },
  CREATOR: { 
    label: 'Yaratıcı', 
    icon: <ScrollText size={20} />, 
    color: 'from-purple-500 to-indigo-400',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-600'
  },
  COMMUNITY: { 
    label: 'Topluluk', 
    icon: <MessageSquare size={20} />, 
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600'
  },
  POPULARITY: { 
    label: 'Popülerlik', 
    icon: <Heart size={20} />, 
    color: 'from-red-500 to-pink-400',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-600'
  },
  LOYALTY: { 
    label: 'Sadakat', 
    icon: <Clock size={20} />, 
    color: 'from-amber-500 to-yellow-400',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-600'
  },
  SUPPORTER: { 
    label: 'Destekçi', 
    icon: <Gift size={20} />, 
    color: 'from-pink-500 to-rose-400',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-600'
  },
  WRITER: { 
    label: 'Yazar', 
    icon: <ScrollText size={20} />, 
    color: 'from-orange-500 to-amber-400',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-600'
  },
  OTHER: { 
    label: 'Diğer', 
    icon: <Award size={20} />, 
    color: 'from-gray-500 to-slate-400',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-600'
  },
};

const BadgesPage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  
  const [badges, setBadges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showEarnedOnly, setShowEarnedOnly] = useState(false);

  useEffect(() => {
    sendRequest({
      url: '/badges',
      method: METHODS.GET,
      callbackSuccess: (res) => setBadges(res.data),
    });
  }, []);

  // Filter badges
  const filteredBadges = badges.filter(badge => {
    if (selectedCategory !== 'ALL' && badge.category !== selectedCategory) return false;
    if (showEarnedOnly && !badge.earned) return false;
    return true;
  });

  // Group by category
  const groupedBadges = filteredBadges.reduce((acc, badge) => {
    const cat = badge.category || 'OTHER';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(badge);
    return acc;
  }, {});

  // Stats
  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;
  const progressPercent = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Rozetler | Zar & Kule</title>
        <meta name="description" content="Tüm rozetleri keşfet ve koleksiyonunu genişlet." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://i.pinimg.com/736x/f5/9a/8b/f59a8b7c8d9e0a1b2c3d4e5f6a7b8c9d.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/90 via-yellow-900/80 to-mbg" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/taverna" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">Taverna'ya Dön</span>
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-bold uppercase tracking-wider mb-6">
              <Award size={16} />
              Rozetler
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Başarılarını <span className="text-yellow-400">Sergile</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl">
              Toplulukta aktif ol, içerik üret ve özel rozetler kazan. 
              Her rozet senin maceracı kimliğinin bir parçası!
            </p>

            {/* Progress */}
            {isAuthenticated && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 max-w-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-bold">Koleksiyonun</span>
                  <span className="text-yellow-400 font-black">{earnedCount} / {totalCount}</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-white/50 text-xs mt-2">%{progressPercent} tamamlandı</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`
                px-4 py-2 rounded-xl text-sm font-bold transition-all
                ${selectedCategory === 'ALL' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-white border border-cbg text-sti hover:border-yellow-500/50'}
              `}
            >
              Tümü
            </button>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                  ${selectedCategory === key 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-white border border-cbg text-sti hover:border-yellow-500/50'}
                `}
              >
                {cat.icon}
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Earned Only Toggle */}
          {isAuthenticated && (
            <button
              onClick={() => setShowEarnedOnly(!showEarnedOnly)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                ${showEarnedOnly 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white border border-cbg text-sti hover:border-green-500/50'}
              `}
            >
              <CheckCircle size={16} />
              Sadece Kazanılanlar
            </button>
          )}
        </div>

        {/* Badge Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-yellow-500" size={48} />
          </div>
        ) : Object.keys(groupedBadges).length === 0 ? (
          <div className="text-center py-20 bg-white border border-cbg rounded-2xl">
            <Award size={64} className="mx-auto text-cbg mb-4" />
            <h3 className="text-xl font-black text-mtf mb-2">Rozet Bulunamadı</h3>
            <p className="text-sti">
              {showEarnedOnly 
                ? 'Henüz rozet kazanmadın. Aktif ol ve rozetleri topla!' 
                : 'Filtrelere uygun rozet yok.'}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedBadges).map(([category, categoryBadges]) => {
              const cat = CATEGORIES[category] || CATEGORIES.OTHER;
              return (
                <div key={category}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${cat.bgColor} flex items-center justify-center ${cat.textColor}`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-mtf">{cat.label}</h2>
                      <p className="text-xs text-sti">
                        {categoryBadges.filter(b => b.earned).length} / {categoryBadges.length} kazanıldı
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categoryBadges.map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} category={cat} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA for Guests */}
        {!isAuthenticated && (
          <div className="mt-12 text-center py-12 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl">
            <Sparkles size={40} className="mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-black text-mtf mb-2">Rozet Koleksiyonunu Başlat!</h3>
            <p className="text-sti mb-6 max-w-md mx-auto">
              Kayıt ol ve içerik üreterek, yorum yaparak özel rozetler kazan.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/kayit"
                className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 transition-colors"
              >
                Kayıt Ol
              </Link>
              <Link
                to="/giris"
                className="px-6 py-3 bg-white border border-cbg text-mtf rounded-xl font-bold hover:border-yellow-500/50 transition-colors"
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

// ==================== BADGE CARD ====================

const BadgeCard = ({ badge, category }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className={`
        relative bg-white border rounded-2xl p-5 text-center transition-all duration-300 group cursor-pointer
        ${badge.earned 
          ? 'border-yellow-500/30 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20' 
          : 'border-cbg opacity-60 hover:opacity-100'}
      `}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Earned Indicator */}
      {badge.earned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
          <CheckCircle size={14} className="text-white" />
        </div>
      )}

      {/* Lock for unearned */}
      {!badge.earned && (
        <div className="absolute top-2 right-2">
          <Lock size={14} className="text-cbg" />
        </div>
      )}

      {/* Icon */}
      <div className={`
        w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center
        ${badge.earned 
          ? `bg-gradient-to-br ${category.color}` 
          : 'bg-cbg'}
      `}>
        {badge.iconUrl ? (
          <img 
            src={badge.iconUrl} 
            alt={badge.name} 
            className={`w-10 h-10 ${!badge.earned && 'grayscale'}`}
          />
        ) : (
          <Award size={32} className={badge.earned ? 'text-white' : 'text-sti'} />
        )}
      </div>

      {/* Name */}
      <p className={`font-bold text-sm mb-1 ${badge.earned ? 'text-mtf' : 'text-sti'}`}>
        {badge.name}
      </p>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-mtf text-white text-xs rounded-xl shadow-xl z-10">
          <p className="font-bold mb-1">{badge.name}</p>
          <p className="text-white/70">{badge.description}</p>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-mtf" />
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
// src/pages/BadgesPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, Lock } from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

const BadgesPage = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  
  const [badges, setBadges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

useEffect(() => {
  if (isAuthenticated) {
    sendRequest({
      url: `/badges/my-badges`,
      method: METHODS.GET,
      callbackSuccess: (res) => {
        console.log('Badges response:', res.data); // ✅ Bunu ekle
        console.log('First badge:', res.data[0]); // ✅ İlk rozeti göster
        setBadges(res.data);
      },
    });
  } else {
    sendRequest({
      url: '/badges',
      method: METHODS.GET,
      callbackSuccess: (res) => {
        console.log('Badges response:', res.data); // ✅ Bunu ekle
        setBadges(res.data);
      },
    });
  }
}, [isAuthenticated]);

  const categories = [
    { id: 'ALL', name: 'Tümü', color: 'from-gray-500 to-slate-500', icon: '🏆' },
    { id: 'FIRST_STEPS', name: 'İlk Adımlar', color: 'from-blue-500 to-cyan-500', icon: '🎯' },
    { id: 'CONTENT_CREATOR', name: 'İçerik Üreticisi', color: 'from-purple-500 to-pink-500', icon: '✨' },
    { id: 'COMMUNITY', name: 'Topluluk', color: 'from-green-500 to-emerald-500', icon: '💬' },
    { id: 'TAVERNA', name: 'Taverna', color: 'from-amber-500 to-yellow-500', icon: '⚔️' },
    { id: 'PARTY_FINDER', name: 'Party Finder', color: 'from-red-500 to-orange-500', icon: '🎲' },
    { id: 'SPECIAL', name: 'Özel', color: 'from-indigo-500 to-violet-500', icon: '👑' },
  ];

  // Kategoriye göre grupla
  const groupedBadges = categories.reduce((acc, cat) => {
    if (cat.id === 'ALL') return acc;
    acc[cat.id] = badges.filter(b => b.category === cat.id);
    return acc;
  }, {});

  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;
  const progress = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet>
        <title>Rozetler | Zar & Kule</title>
      </Helmet>
      {/* Hero */}
      <section className="relative py-16 bg-mtf">
        <div className="">
          <div className="max-w-7xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-bold uppercase tracking-wider mb-6">
              <Award size={16} />
              Rozetler
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Başarılarını <span className="text-yellow-200">Sergile</span>
            </h1>
            
            <p className="text-white/80 text-lg mb-8">
              İçerik üret, toplulukla etkileşime geç ve özel rozetler kazan
            </p>

            {/* Progress */}
            {isAuthenticated && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-bold">İlerleme</span>
                  <span className="text-white/80 text-sm">
                    {earnedCount} / {totalCount} Rozet
                  </span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map(cat => {
            const categoryBadges = cat.id === 'ALL' ? badges : groupedBadges[cat.id] || [];
            const earnedInCategory = categoryBadges.filter(b => b.earned).length;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-5 py-2.5 rounded-xl font-bold text-sm transition-all relative
                  ${selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : 'bg-white border border-cbg text-sti hover:border-amber-500/50'
                  }
                `}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
                <span className={`ml-2 text-xs ${selectedCategory === cat.id ? 'text-white/80' : 'text-sti'}`}>
                  ({earnedInCategory}/{categoryBadges.length})
                </span>
              </button>
            );
          })}
        </div>

        {/* Badges by Category */}
        {loading ? (
          <div className="text-center py-20">
            <Award size={64} className="mx-auto text-cbg mb-4 animate-pulse" />
            <p className="text-sti">Rozetler yükleniyor...</p>
          </div>
        ) : badges.length === 0 ? (
          <div className="text-center py-20">
            <Award size={64} className="mx-auto text-cbg mb-4" />
            <p className="text-xl font-bold text-mtf mb-2">Rozet Bulunamadı</p>
          </div>
        ) : selectedCategory === 'ALL' ? (
          // Tüm kategorileri göster
          <div className="space-y-12">
            {categories.slice(1).map(cat => {
              const categoryBadges = groupedBadges[cat.id] || [];
              if (categoryBadges.length === 0) return null;

              const earnedInCategory = categoryBadges.filter(b => b.earned).length;

              return (
                <div key={cat.id}>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl`}>
                        {cat.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-mtf">{cat.name}</h2>
                        <p className="text-sm text-sti">
                          {earnedInCategory} / {categoryBadges.length} Kazanıldı
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categoryBadges.map(badge => (
                      <BadgeCard
                        key={badge.id}
                        badge={badge}
                        category={cat}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Sadece seçili kategoriyi göster
          <div>
            {(() => {
              const cat = categories.find(c => c.id === selectedCategory);
              const categoryBadges = groupedBadges[selectedCategory] || [];
              const earnedInCategory = categoryBadges.filter(b => b.earned).length;

              return (
                <>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-mtf">{cat.name}</h2>
                      <p className="text-sti">
                        {earnedInCategory} / {categoryBadges.length} Kazanıldı
                      </p>
                    </div>
                  </div>

                  {/* Badges Grid */}
                  {categoryBadges.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-cbg rounded-2xl">
                      <Award size={64} className="mx-auto text-cbg mb-4" />
                      <p className="text-xl font-bold text-mtf mb-2">Bu kategoride rozet yok</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {categoryBadges.map(badge => (
                        <BadgeCard
                          key={badge.id}
                          badge={badge}
                          category={cat}
                        />
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* CTA for non-authenticated */}
        {!isAuthenticated && (
          <div className="mt-12 text-center bg-white border border-cbg rounded-2xl p-12">
            <Award size={64} className="mx-auto text-amber-500 mb-4" />
            <h3 className="text-2xl font-black text-mtf mb-2">
              Rozet Toplamaya Başla!
            </h3>
            <p className="text-sti mb-6 max-w-md mx-auto">
              Kayıt ol ve içerik üreterek, yorum yaparak özel rozetler kazan.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/kayit"
                className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30"
              >
                Kayıt Ol
              </Link>
              <Link
                to="/giris"
                className="px-6 py-3 bg-white border border-cbg text-mtf rounded-xl font-bold hover:border-amber-500/50 transition-colors"
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

// Badge Card Component
const BadgeCard = ({ badge, category }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`
        relative bg-white border rounded-2xl p-5 text-center transition-all duration-300 group
        ${badge.earned
          ? 'border-amber-500/30 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1'
          : 'border-cbg opacity-60 hover:opacity-100'
        }
      `}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Earned Indicator */}
      {badge.earned && (
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-lg border-2 border-white">
          <CheckCircle size={16} className="text-white" />
        </div>
      )}

      {/* Lock for unearned */}
      {!badge.earned && (
        <div className="absolute top-3 right-3">
          <Lock size={16} className="text-cbg" />
        </div>
      )}

      {/* Icon/Emoji */}
      <div
        className={`
          w-20 h-20 mx-auto mb-3 rounded-xl flex items-center justify-center text-4xl
          ${badge.earned
            ? `bg-gradient-to-br ${category?.color || 'from-gray-500 to-slate-500'}`
            : 'bg-cbg'
          }
        `}
      >
        {badge.iconUrl ? (
          <span className={`${!badge.earned && 'grayscale opacity-50'}`}>
            {badge.iconUrl}
          </span>
        ) : (
          <Award size={40} className={badge.earned ? 'text-white' : 'text-sti'} />
        )}
      </div>

      {/* Name */}
      <p className={`font-bold text-sm mb-1 ${badge.earned ? 'text-mtf' : 'text-sti'}`}>
        {badge.name}
      </p>

      {/* Description */}
      <p className="text-xs text-sti line-clamp-2 min-h-[2rem]">
        {badge.description}
      </p>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-mtf text-white text-xs rounded-xl shadow-2xl z-10 pointer-events-none">
          <p className="font-bold mb-1">{badge.name}</p>
          <p className="text-white/80">{badge.description}</p>
          {badge.earned && badge.earnedAt && (
            <p className="text-white/60 mt-2 text-[10px]">
              {new Date(badge.earnedAt).toLocaleDateString('tr-TR')} tarihinde kazanıldı
            </p>
          )}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-mtf" />
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
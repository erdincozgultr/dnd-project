// src/pages/TavernaPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Trophy, Shield, Award, Users, ChevronRight, Flame,
  Crown, Star, Sparkles, ScrollText
} from 'lucide-react';
import { useSelector } from 'react-redux';

const TavernaPage = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const menuItems = [
    {
      title: 'Sıralama',
      description: 'Diyarın en güçlü maceracıları, en beğenilen eserleri ve en aktif loncaları',
      icon: <Trophy size={32} />,
      href: '/taverna/siralama',
      color: 'from-yellow-500 to-amber-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      title: 'Loncalar',
      description: 'Bir loncaya katıl veya kendi loncanı kur, birlikte güçlen',
      icon: <Shield size={32} />,
      href: '/taverna/loncalar',
      color: 'from-purple-500 to-indigo-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'Rozetler',
      description: 'Kazanabileceğin tüm rozetleri keşfet ve koleksiyonunu tamamla',
      icon: <Award size={32} />,
      href: '/taverna/rozetler',
      color: 'from-cta to-orange-400',
      bgColor: 'bg-cta/10',
      borderColor: 'border-cta/20',
    },
  ];

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Taverna | Zar & Kule</title>
        <meta name="description" content="Zar & Kule topluluğunun merkezi. Sıralamalar, loncalar ve rozetler." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://i.pinimg.com/736x/77/a0/66/77a066581f52577684ebf61a2c7327f2.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-mbg" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cta/20 border border-cta/30 text-cta text-sm font-bold uppercase tracking-wider mb-6">
            <Sparkles size={16} />
            Topluluk Merkezi
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Taverna'ya <span className="text-cta">Hoş Geldin</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Burada maceracılar buluşur, hikayeler paylaşılır ve efsaneler doğar.
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
                <p className="text-2xl font-black text-white">{user.rankTitle || 'Köylü'}</p>
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
      </section>

      {/* Menu Cards */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-20">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top User */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={20} className="text-yellow-500" />
                <span className="text-xs font-black text-yellow-600 uppercase">En Çok XP</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-400 flex items-center justify-center text-white font-black">
                  1
                </div>
                <div>
                  <p className="font-black text-mtf">Yükleniyor...</p>
                  <p className="text-xs text-sti">0 XP</p>
                </div>
              </div>
            </div>

            {/* Top Content */}
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ScrollText size={20} className="text-purple-500" />
                <span className="text-xs font-black text-purple-600 uppercase">En Beğenilen</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-400 flex items-center justify-center text-white font-black">
                  <Flame size={20} />
                </div>
                <div>
                  <p className="font-black text-mtf">Yükleniyor...</p>
                  <p className="text-xs text-sti">0 Beğeni</p>
                </div>
              </div>
            </div>

            {/* Top Guild */}
            <div className="bg-gradient-to-br from-cta/10 to-orange-500/10 border border-cta/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={20} className="text-cta" />
                <span className="text-xs font-black text-cta uppercase">En Güçlü Lonca</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cta to-orange-400 flex items-center justify-center text-white font-black">
                  <Star size={20} />
                </div>
                <div>
                  <p className="font-black text-mtf">Yükleniyor...</p>
                  <p className="text-xs text-sti">Seviye 0</p>
                </div>
              </div>
            </div>
          </div>
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
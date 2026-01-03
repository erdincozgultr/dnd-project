// src/components/home/GuildShowcaseSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Zap, Trophy, ArrowRight, Crown, Scroll } from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';

const GuildShowcaseSection = () => {
  const [guilds, setGuilds] = useState([]);
  const { sendRequest, loading } = useAxios();

  useEffect(() => {
    // Top guilds'leri al
    sendRequest({
      url: '/guilds',
      method: METHODS.GET,
      callbackSuccess: (res) => {
        // XP'ye göre sırala ve ilk 4'ü al
        const sortedGuilds = (res.data || [])
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 4);
        setGuilds(sortedGuilds);
      },
      showErrorToast: false,
    });
  }, []);

  const getRankBadge = (index) => {
    const badges = [
      { icon: Crown, color: 'text-cta', bg: 'bg-cta/10', border: 'border-cta/30' },
      { icon: Trophy, color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-400/30' },
      { icon: Trophy, color: 'text-amber-700', bg: 'bg-amber-700/10', border: 'border-amber-600/30' },
      { icon: Shield, color: 'text-sti', bg: 'bg-sti/10', border: 'border-sti/30' },
    ];
    return badges[index] || badges[3];
  };

  return (
    <section className="relative py-20 md:py-32 bg-mbg overflow-hidden">
      {/* Parşömen Texture Background */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-cta/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pb/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cta/10 border border-cta/20 text-cta text-sm font-bold uppercase tracking-wider mb-4">
            <Scroll size={16} />
            Efsane Loncalar
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-mtf mb-4">
            En Güçlü <span className="text-cta">Loncalar</span>
          </h2>
          <p className="text-sti max-w-2xl mx-auto text-lg">
            Zar & Kule'nin en aktif ve güçlü loncaları. Sen de bir loncaya katıl veya kendi loncani kur!
          </p>
        </div>

        {/* Guilds Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border-2 border-cbg rounded-2xl p-6 animate-pulse">
                <div className="h-8 bg-cbg rounded mb-4"></div>
                <div className="h-4 bg-cbg rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : guilds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {guilds.map((guild, index) => {
              const rankBadge = getRankBadge(index);
              const RankIcon = rankBadge.icon;

              return (
                <Link
                  key={guild.id}
                  to={`/taverna/loncalar/${guild.id}`}
                  className="group relative bg-white border-2 border-cbg hover:border-cta rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-cta/10 hover:-translate-y-1"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cta/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-mtf group-hover:text-cta transition-colors mb-1">
                        {guild.name}
                      </h3>
                      {guild.description && (
                        <p className="text-sm text-sti line-clamp-2">
                          {guild.description}
                        </p>
                      )}
                    </div>

                    {/* Rank Badge */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${rankBadge.bg} border ${rankBadge.border}`}>
                      <RankIcon size={24} className={rankBadge.color} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-cbg">
                    {/* Level */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sti mb-1">
                        <Shield size={14} />
                        <p className="text-xs font-bold uppercase">Seviye</p>
                      </div>
                      <p className="text-2xl font-black text-mtf">{guild.level || 1}</p>
                    </div>

                    {/* XP */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-cta mb-1">
                        <Zap size={14} />
                        <p className="text-xs font-bold uppercase">XP</p>
                      </div>
                      <p className="text-2xl font-black text-mtf">
                        {((guild.xp || 0) / 1000).toFixed(1)}k
                      </p>
                    </div>

                    {/* Members */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-pb mb-1">
                        <Users size={14} />
                        <p className="text-xs font-bold uppercase">Üye</p>
                      </div>
                      <p className="text-2xl font-black text-mtf">{guild.memberCount || 0}</p>
                    </div>
                  </div>

                  {/* Leader */}
                  {guild.leader && (
                    <div className="mt-4 pt-4 border-t border-cbg">
                      <p className="text-xs text-sti">
                        <span className="font-bold">Lonca Lideri:</span>{' '}
                        <span className="text-mtf">{guild.leader.displayName || guild.leader.username}</span>
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border-2 border-cbg rounded-2xl">
            <Shield size={48} className="mx-auto text-cbg mb-4" />
            <p className="text-mtf font-bold">Henüz lonca yok</p>
            <p className="text-sm text-sti mt-1">İlk loncayı sen kur!</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/taverna/loncalar"
            className="inline-flex items-center gap-3 px-8 py-4 bg-pb text-td hover:bg-cta hover:text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-cta/20 hover:-translate-y-1 group"
          >
            Tüm Loncaları Gör
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default GuildShowcaseSection;
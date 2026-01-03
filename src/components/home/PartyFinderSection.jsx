// src/components/home/PartyFinderSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swords, MapPin, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';

const PartyFinderSection = () => {
  const [campaignCount, setCampaignCount] = useState(0);
  const { sendRequest } = useAxios();

  useEffect(() => {
    // Kampanya sayısını al
    sendRequest({
      url: '/campaigns/public',
      method: METHODS.GET,
      params: { page: 0, size: 1 }, // Sadece sayı için
      callbackSuccess: (res) => {
        const totalCount = res.data.totalElements || res.data.length || 0;
        setCampaignCount(totalCount);
      },
      showErrorToast: false,
    });
  }, []);

  return (
    <section className="py-20 md:py-32 bg-mbg overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Görsel */}
          <div className="relative order-first lg:order-none group">
            
            <div className="absolute inset-0 bg-cta/20 rounded-2xl transform translate-x-3 translate-y-3 md:translate-x-6 md:translate-y-6 transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4"></div>
            
            <div className="absolute inset-0 border-2 border-mtf/10 rounded-2xl transform -translate-x-3 -translate-y-3 z-0"></div>

            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50">
              <img 
                src="https://cdnb.artstation.com/p/assets/images/images/031/491/175/large/alex-nacher-final-web.jpg?1603788622" 
                alt="Fantasy Party Adventure" 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Kampanya Sayısı Badge */}
              <div className="absolute bottom-4 left-4 bg-mbg/90 backdrop-blur-md px-4 py-2 rounded-lg border border-cbg shadow-lg flex items-center gap-2">
                <Users size={16} className="text-cta" />
                <span className="text-xs font-bold text-mtf uppercase tracking-wider">
                  {campaignCount > 0 ? `${campaignCount}+ Aktif Kampanya` : 'Kampanyalar Yükleniyor...'}
                </span>
              </div>
            </div>
          </div>

          {/* İçerik */}
          <div className="flex flex-col gap-6">
            
            <div className="flex items-center gap-2 text-cta font-bold tracking-wider uppercase text-sm">
              <Swords size={18} />
              <span>Maceraya Yalnız Atılma</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-mtf leading-tight">
              Yol Arkadaşların <br />
              <span className="relative inline-block text-cta">
                Seni Bekliyor
                <svg className="absolute w-full h-3 -bottom-1 left-0 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h2>

            <p className="text-lg text-sti leading-relaxed">
              Zar & Kule'nin gelişmiş <strong>Party Finder</strong> sistemi ile kendine uygun oyun grubunu bulmak artık çok kolay. 
              İster deneyimli bir Dungeon Master arıyor ol, ister ilk kez zar atacak bir oyuncu; masada senin için her zaman bir yer var.
            </p>

            <ul className="space-y-4 mt-2">
              <ListItem text="Şehre, oyun sistemine veya platforma (Roll20, Foundry) göre filtrele." />
              <ListItem text="Oyun tarzına (Roleplay, Savaş, Puzzle) uygun masaları keşfet." />
              <ListItem text="Güvenli ve onaylanmış topluluk üyeleriyle oyna." />
            </ul>

            <div className="pt-6">
              <Link 
                to="/campaigns" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-pb text-td hover:bg-cta hover:text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-cta/20 hover:-translate-y-1 group"
              >
                İlanlara Göz At 
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <p className="mt-4 text-sm text-sti/70 flex items-center gap-1">
                <MapPin size={14} /> İstanbul, Ankara, İzmir ve Online...
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

const ListItem = ({ text }) => (
  <li className="flex items-start gap-3">
    <div className="mt-1 min-w-[20px] text-cta">
      <CheckCircle2 size={20} />
    </div>
    <span className="text-mtf font-medium">{text}</span>
  </li>
);

export default PartyFinderSection;
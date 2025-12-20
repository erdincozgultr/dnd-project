import { Link } from 'react-router-dom';
import { 
  Crown, Feather, Users, ArrowRight, ShieldCheck, 
  Mic2, Youtube, Twitch 
} from 'lucide-react';

const CommunitySection = () => {
  return (
    <section className="relative py-20 md:py-32 bg-pb overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cta/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cta/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mbg/10 border border-td/20 text-cta text-sm font-bold mb-6 backdrop-blur-md">
              <Crown size={16} />
              <span>İçerik Üreticileri İçin Özel Davet</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-td mb-6 leading-tight">
              Hikayeni Sadece Anlatma, <br/>
              <span className="text-cta">Ölümsüzleştir.</span>
            </h2>

            <p className="text-lg text-cbg/80 mb-8 leading-relaxed">
              Youtube veya Twitch yayıncısı mısın? Videoların akıp gidiyor ama bilgilerin kaybolmasın. 
              Zar & Kule'de kendi <strong>Lonca</strong>'nı kur, blog yazılarını paylaş ve topluluğuna kalıcı bir kütüphane sun.
            </p>

            <div className="space-y-4 mb-10">
              <BenefitItem 
                icon={<Feather size={20} />} 
                title="Blog Yazarlığı Yetkisi" 
                desc="Kendi köşende rehberler, incelemeler ve senaryolar yayınla." 
              />
              <BenefitItem 
                icon={<ShieldCheck size={20} />} 
                title="Lonca Lideri Rozeti" 
                desc="İsminin yanında özel 'Onaylı İçerik Üreticisi' rozetini taşı." 
              />
              <BenefitItem 
                icon={<Users size={20} />} 
                title="Topluluğunu Topla" 
                desc="Takipçilerin senin sancağın altında toplansın, 'Lonca Üyesi' olsun." 
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/creators" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cta hover:bg-white hover:text-cta text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-cta/40 hover:-translate-y-1"
              >
                Başvuru Yap <ArrowRight size={20} />
              </Link>
              <Link 
                to="/community" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-mbg/5 border border-td/20 text-td hover:bg-mbg/10 rounded-xl font-bold text-lg transition-all"
              >
                Topluluğu Keşfet
              </Link>
            </div>

          </div>

          <div className="relative flex justify-center lg:justify-end">

            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cta rounded-full blur-3xl opacity-20 animate-pulse"></div>

            <div className="relative w-full max-w-md bg-mbg/95 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border-2 border-cta/30 transform rotate-2 hover:rotate-0 transition-transform duration-500">

              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-pb border-2 border-cta shadow-md"></div>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-cbg">
                <div className="relative">
                  <img 
                    src="https://ui-avatars.com/api/?name=Baris+Zari&background=D97706&color=fff&size=128" 
                    alt="Creator" 
                    className="w-16 h-16 rounded-xl border-2 border-cta shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-pb text-cta p-1 rounded-full border border-cta">
                    <ShieldCheck size={14} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-mtf">Barışın Kulesi</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-cta uppercase tracking-wider">
                    <Crown size={12} />
                    <span>Lonca Lideri</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Youtube size={14} className="text-sti hover:text-red-600 cursor-pointer transition-colors"/>
                    <Twitch size={14} className="text-sti hover:text-purple-600 cursor-pointer transition-colors"/>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                <div className="bg-cbg/30 p-2 rounded-lg">
                  <div className="text-lg font-black text-mtf">12</div>
                  <div className="text-[10px] text-sti uppercase font-bold">Blog Yazısı</div>
                </div>
                <div className="bg-cbg/30 p-2 rounded-lg">
                  <div className="text-lg font-black text-mtf">2.4k</div>
                  <div className="text-[10px] text-sti uppercase font-bold">Lonca Üyesi</div>
                </div>
                <div className="bg-cbg/30 p-2 rounded-lg">
                  <div className="text-lg font-black text-mtf">LVL 5</div>
                  <div className="text-[10px] text-sti uppercase font-bold">Ozan</div>
                </div>
              </div>

              <div className="bg-cbg/20 p-4 rounded-xl border border-cbg/50">
                <div className="flex items-center gap-2 mb-2">
                  <Feather size={14} className="text-cta" />
                  <span className="text-xs font-bold text-sti uppercase">Son Yayınlanan</span>
                </div>
                <h4 className="font-bold text-mtf text-sm mb-1 line-clamp-1">
                  Strahd'ı Yenmenin 5 Altın Kuralı
                </h4>
                <p className="text-xs text-sti line-clamp-2">
                  Ravenloft'un efendisiyle yüzleşmeden önce çantanızda mutlaka bulunması gereken büyülü eşyalar ve taktikler...
                </p>
              </div>

              <button className="w-full mt-4 py-2 bg-pb text-td text-sm font-bold rounded-lg hover:bg-cta hover:text-white transition-colors">
                Loncaya Katıl (+100 XP)
              </button>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

const BenefitItem = ({ icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="mt-1 w-10 h-10 bg-cta/10 rounded-lg flex items-center justify-center text-cta flex-shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-td font-bold text-lg mb-1">{title}</h4>
      <p className="text-cbg/60 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default CommunitySection;
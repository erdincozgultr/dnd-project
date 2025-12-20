import { Link } from 'react-router-dom';
import { Feather, Scroll, Check, Lock, Sparkles } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="relative py-20 md:py-32 bg-mbg overflow-hidden">

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cta/5 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div className="relative group order-last lg:order-first">
            <div className="absolute inset-0 bg-pb/10 rounded-2xl transform translate-x-4 translate-y-4"></div>
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-mtf/5">
              <img 
                src="https://cdna.artstation.com/p/assets/images/images/025/255/116/large/logan-feliciano-lesser-fiend-lf-002s.jpg?1585181054" 
                alt="Warlock Pact" 
                className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pb/40 to-transparent opacity-60"></div>
            </div>

            <div className="absolute -bottom-6 -right-6 w-24 h-24 z-20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
               <div className="w-full h-full bg-red-800 rounded-full border-4 border-red-900 shadow-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl tracking-tighter">Z&K</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            
            <div className="inline-flex items-center gap-2 text-cta font-bold tracking-widest uppercase text-sm">
              <Sparkles size={18} />
              <span>Son Adım</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-mtf leading-tight">
              Maceraya <br />
              <span className="text-cta">Resmen Başla</span>
            </h2>

            <p className="text-lg text-sti leading-relaxed italic border-l-4 border-cbg pl-6">
              "Kule'nin kapıları sadece cesurlara açılır. Bu anlaşma ile zarların kaderine ortak olmayı ve topluluğun bir parçası olmayı kabul edersin."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <ContractFeature text="Sınırsız Wiki Erişimi" />
              <ContractFeature text="Parti Kurma Yetkisi" />
              <ContractFeature text="Özel Profil Rozetleri" />
              <ContractFeature text="Lonca Kurma Hakkı" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-pb text-td hover:bg-cta hover:text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:-translate-y-1 group"
              >
                <Feather className="group-hover:-rotate-12 transition-transform" size={22} />
                Anlaşmayı İmzala
              </Link>
              
              <Link 
                to="/login" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-mtf font-bold hover:text-cta transition-colors"
              >
                Zaten üyeyim, giriş yap
              </Link>
            </div>

            <p className="text-xs text-sti/50 flex items-center gap-1">
              <Lock size={12} /> Bilgileriniz şifreli bir parşömende korunmaktadır.
            </p>

          </div>

        </div>
      </div>
    </section>
  );
};

const ContractFeature = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 rounded-full bg-cta/10 text-cta flex items-center justify-center flex-shrink-0">
      <Check size={14} strokeWidth={3} />
    </div>
    <span className="text-mtf font-bold text-sm uppercase tracking-tight">{text}</span>
  </div>
);

export default CallToActionSection;
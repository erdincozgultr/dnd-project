import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  Skull,
  Scroll,
  Feather,
  ArrowRight,
  Search,
  Library,
} from "lucide-react";

const WikiSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.pinimg.com/1200x/9f/c0/07/9fc007618a90b1975e2c601458e33a07.jpg"
          alt="Ancient Library Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pb/90 via-pb/80 to-pb/95 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cta/10 border border-cta/30 text-cta text-sm font-bold mb-6 backdrop-blur-md animate-fade-in">
            <Library size={16} />
            <span>Türkiye'nin En Büyük FRP Arşivi</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-td mb-6 tracking-tight drop-shadow-lg">
            Kadim Bilgiler <br />
            <span className="text-cta">Parmaklarının Ucunda</span>
          </h2>

          <p className="text-lg md:text-xl text-cbg/80 mb-8 leading-relaxed drop-shadow-md">
            Unutulmuş büyülerden efsanevi canavarlara, büyülü eşyalardan evren
            kurallarına kadar her şey burada. İster oyun sırasında kural bak,
            ister kendi içeriklerini ekleyerek kütüphaneyi genişlet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/wiki"
              className="w-full sm:w-auto px-8 py-4 bg-cta hover:bg-white hover:text-cta text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-cta/40 flex items-center justify-center gap-2"
            >
              <BookOpen size={20} /> Kütüphaneye Gir
            </Link>

            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Hızlı arama yap... (Örn: Fireball)"
                className="w-full sm:w-64 px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cta focus:bg-white/20 backdrop-blur-sm transition-all"
              />
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50"
                size={20}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <WikiStatCard
            icon={<Sparkles size={28} />}
            count="350+"
            label="Büyü & Cantrip"
            subtext="5e & Pathfinder"
            delay="0"
          />

          <WikiStatCard
            icon={<Skull size={28} />}
            count="120+"
            label="Canavar"
            subtext="Bestiary"
            delay="100"
          />

          <WikiStatCard
            icon={<Scroll size={28} />}
            count="200+"
            label="Büyülü Eşya"
            subtext="Loot Tables"
            delay="200"
          />

          <WikiStatCard
            icon={<Feather size={28} />}
            count="1.5k"
            label="Topluluk Girdisi"
            subtext="Homebrew İçerik"
            delay="300"
          />
        </div>
      </div>
    </section>
  );
};

const WikiStatCard = ({ icon, count, label, subtext, delay }) => (
  <div
    className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-cta/50 transition-all duration-300 hover:-translate-y-2"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-cta/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-cta/20 rounded-lg flex items-center justify-center text-cta mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>

      <span className="text-3xl md:text-4xl font-black text-white mb-1 group-hover:text-cta transition-colors">
        {count}
      </span>

      <span className="text-sm font-bold text-cbg uppercase tracking-wider mb-1">
        {label}
      </span>

      <span className="text-xs text-white/40 font-medium">{subtext}</span>
    </div>
  </div>
);

export default WikiSection;

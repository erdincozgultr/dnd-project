import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  Scroll,
  Dices,
  UserPlus,
  Map,
} from "lucide-react";

const HowToPlaySection = () => {
  const steps = [
    {
      id: 1,
      title: "Kuralları Öğren",
      desc: "FRP nedir, zar nasıl atılır ve oyunun temelleri nelerdir? Merak etme, başlangıç rehberimiz ile çok basit.",
      image:
        "https://i.pinimg.com/1200x/18/aa/1a/18aa1a448f417b95162242aec227a645.jpg",
      icon: <Scroll size={20} />,
    },
    {
      id: 2,
      title: "Karakterini Yarat",
      desc: "Cesur bir savaşçı mı yoksa kurnaz bir büyücü mü? Irkını ve sınıfını seç, kahramanına hayat ver.",
      image:
        "https://tabletopden.com/wp-content/uploads/2023/03/School-of-Magic-5-768x1152.png",
      icon: <Dices size={20} />,
    },
    {
      id: 3,
      title: "Masanı Bul",
      desc: "Karakterin hazır! Şimdi Party Finder'ı kullanarak sana uygun bir oyun grubu bul ve maceraya atıl.",
      image:
        "https://i.pinimg.com/1200x/4d/72/5d/4d725dff9bd29110f7783526f1991070.jpg",
      icon: <UserPlus size={20} />,
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-mbg relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50 Q 25 30 50 50 T 100 50"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            className="text-mtf"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-cta font-bold tracking-wider uppercase text-sm mb-3">
            <Compass size={18} />
            <span>Yol Haritası</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-mtf mb-4">
            Efsaneni Yazmaya <br />
            <span className="text-cta">3 Adımda Başla</span>
          </h2>
          <p className="text-sti text-lg">
            Bu dünyaya adım atmak sandığından çok daha kolay. Sadece bu adımları
            takip et.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="hidden md:block absolute top-1/3 left-0 w-full h-0.5 border-t-2 border-dashed border-cbg -z-0"></div>

          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative group flex flex-col items-center text-center z-10"
            >
              <div className="relative w-full aspect-[3/4] mb-8 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-cbg group-hover:-translate-y-2 transition-transform duration-500">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />

                <div className="absolute -top-3 -left-3 w-10 h-10 bg-cta text-white font-black text-xl flex items-center justify-center rounded-xl shadow-lg border-2 border-white transform rotate-3 group-hover:rotate-12 transition-transform">
                  {step.id}
                </div>

                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none"></div>
              </div>

              <div className="bg-mbg/80 backdrop-blur-sm px-4 py-2 rounded-xl">
                <h3 className="text-xl font-bold text-mtf mb-2 flex items-center justify-center gap-2">
                  <span className="text-cta">{step.icon}</span>
                  {step.title}
                </h3>
                <p className="text-sti text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/guide/how-to-play"
            className="inline-flex items-center gap-2 px-10 py-4 bg-pb text-td hover:bg-cta hover:text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-cta/25 hover:-translate-y-1"
          >
            <Map size={20} />
            Şimdi Başla
          </Link>
          <p className="mt-4 text-xs text-sti/60 font-medium uppercase tracking-widest">
            Detaylı Rehber için tıkla
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowToPlaySection;

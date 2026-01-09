// src/pages/AboutPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Dices, Heart, Users, BookOpen, Target, Sparkles, ChevronLeft, Scroll } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Hakkımızda | Zar & Kule</title>
      </Helmet>

      {/* Hero */}
      <section className="relative py-20 bg-pb text-td">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-td/60 hover:text-cta mb-8 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">Ana Sayfaya Dön</span>
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cta/20 border border-cta/30 text-cta text-sm font-bold uppercase tracking-wider mb-6">
              <Scroll size={16} />
              Hakkımızda
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-td mb-6">
              Zar & Kule
            </h1>
            <p className="text-xl text-td/80 leading-relaxed">
              Türkiye'nin en büyük masaüstü rol yapma oyunları topluluğu.
              Maceracılar, oyun yöneticileri ve yaratıcılar için bir sığınak.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Misyon */}
          <section className="bg-white border-2 border-cbg rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-cta/10 border-2 border-cta/20 flex items-center justify-center">
                <Target size={28} className="text-cta" />
              </div>
              <h2 className="text-3xl font-black text-mtf">Misyonumuz</h2>
            </div>
            <div className="space-y-4 text-sti leading-relaxed">
              <p>
                Zar & Kule, Türkiye'deki masaüstü rol yapma oyunları topluluğunu büyütmek,
                oyuncuları bir araya getirmek ve bu muhteşem hobinin daha erişilebilir olmasını
                sağlamak için kuruldu.
              </p>
              <p>
                Amacımız, yeni başlayanlardan deneyimli oyunculara kadar herkesin
                oyun bulabileceği, kaynak edinebileceği ve içerik oluşturabileceği
                bir platform sunmak.
              </p>
            </div>
          </section>

          {/* Neler Sunuyoruz */}
          <section>
            <h2 className="text-3xl font-black text-mtf mb-8 text-center">
              Neler Sunuyoruz?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                icon={<BookOpen size={28} />}
                title="Wiki & Arşiv"
                description="D&D 5e ve Pathfinder için Türkçe içerik arşivi. Büyüler, canavarlar, eşyalar ve daha fazlası."
              />
              
              <FeatureCard
                icon={<Users size={28} />}
                title="Parti Bul"
                description="Oyun aramak veya oyuncular bulmak için bir platform. Kampanya oluştur, oyuncular katılsın."
              />
              
              <FeatureCard
                icon={<Dices size={28} />}
                title="Taverna"
                description="XP kazan, seviye atla, rozetler topla ve loncalara katıl. Gamification ile topluluk deneyimi."
              />
              
              <FeatureCard
                icon={<Sparkles size={28} />}
                title="Homebrew İçerik"
                description="Kendi yaratıcı içeriklerini paylaş. Büyüler, canavarlar, sınıflar ve daha fazlası oluştur."
              />
            </div>
          </section>

          {/* İletişim CTA */}
          <section className="bg-cta/10 border-2 border-cta/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-black text-mtf mb-4">
              Sorularınız mı var?
            </h2>
            <p className="text-sti mb-6">
              Bizimle iletişime geçmekten çekinmeyin!
            </p>
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-2 px-8 py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-colors shadow-lg shadow-cta/30"
            >
              İletişime Geç
            </Link>
          </section>

        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white border-2 border-cbg rounded-2xl p-6 hover:border-cta/50 transition-all hover:shadow-lg">
    <div className="w-14 h-14 rounded-xl bg-cta/10 border-2 border-cta/20 flex items-center justify-center text-cta mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-black text-mtf mb-2">{title}</h3>
    <p className="text-sti text-sm leading-relaxed">{description}</p>
  </div>
);

export default AboutPage;
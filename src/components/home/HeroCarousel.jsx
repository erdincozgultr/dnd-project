import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, MapPin, Sparkles, BookOpen, Swords } from 'lucide-react';

const SLIDE_DURATION = 4000; 

const slides = [
  {
    id: 1,
    image: "https://i.pinimg.com/1200x/f3/4b/dd/f34bdd0551c7dc23713ae6ef4bb0116f.jpg", 
    tag: "Party Finder",
    title: "Yol Arkadaşlarını Bul",
    description: "Çevrendeki devam eden maceraları keşfet. Yerel kafelerde veya online platformlarda (Foundry, Roll20) oynanan oyunlara, rolünü belirterek başvur ve oynamaya başla.",
    ctaText: "Şimdi Başla",
    ctaLink: "/campaigns",
    icon: <Swords size={20} />,
    color: "bg-rose-600"
  },
  {
    id: 2,
    image: "https://png.pngtree.com/background/20250109/original/pngtree-whimsical-library-interior-a-magical-retreat-surrounded-by-books-and-grand-picture-image_15829872.jpg", 
    tag: "Wiki Kütüphanesi",
    title: "Kadim Bilgilere Eriş",
    description: "Unutulmuş büyülerden efsanevi canavarlara kadar her şeyi içeren devasa Türkçe kütüphaneyi keşfet. Kendi homebrew içeriklerini ekle ve toplulukla paylaş.",
    ctaText: "Kütüphaneyi Gez",
    ctaLink: "/wiki",
    icon: <BookOpen size={20} />,
    color: "bg-indigo-600"
  },
  {
    id: 3,
    image: "https://i.pinimg.com/1200x/74/7e/aa/747eaa707a856542a16a595418d4dabb.jpg", 
    tag: "Topluluk & Han",
    title: "Hikayeni Anlat",
    description: "Han'da diğer maceracılarla tanış, karakterinin destansı hikayesini paylaş veya bit pazarında kullanmadığın zarları takas et.",
    ctaText: "Topluluğa Katıl",
    ctaLink: "/community",
    icon: <Sparkles size={20} />,
    color: "bg-amber-600"
  }
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (index === currentIndex || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (isAnimating) return;

    const interval = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, nextSlide]);

  return (
    <section className="relative w-full h-[600px] md:h-[850px] overflow-hidden bg-pb">

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover transform scale-105"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
         
        </div>
      ))}

      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          {slides.map((slide, index) => (
             index === currentIndex && (
              <div key={slide.id} className="animate-fade-in space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-bold tracking-wide uppercase">
                  {slide.icon}
                  {slide.tag}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl drop-shadow-md">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    to={slide.ctaLink} 
                    className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 ${slide.color}`}
                  >
                    {slide.ctaText} <ChevronRight size={20} />
                  </Link>
                  <button className="px-8 py-4 rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-colors flex items-center justify-center gap-2">
                    Daha Fazla Bilgi
                  </button>
                </div>
              </div>
             )
          ))}
        </div>
      </div>

      <button 
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white/70 hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-sm border border-white/10"
      >
        <ChevronLeft size={32} />
      </button>

      <button 
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white/70 hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-sm border border-white/10"
      >
        <ChevronRight size={32} />
      </button>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "w-8 bg-cta" 
                : "w-2 bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

    </section>
  );
};

export default HeroCarousel;
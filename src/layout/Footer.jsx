// src/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { 
  Dices, BookOpen, Users, Shield, Scroll, Mail, MessageCircle, ChevronRight
} from 'lucide-react';

const Footer = () => {
  
  const navigation = {
    keşfet: [
      { name: 'Wiki & Arşiv', href: '/wiki' },
      { name: 'Blog', href: '/blog' },
      { name: 'Parti Bul', href: '/parti-bul' },
      { name: 'Dost Mekanlar', href: '/mekanlar' },
      { name: 'Bit Pazarı', href: '/pazar' },
    ],
    topluluk: [
      { name: 'Taverna', href: '/taverna' },
      { name: 'Loncalar', href: '/taverna/loncalar' },
      { name: 'Rozetler', href: '/taverna/rozetler' },
      { name: 'Sıralama', href: '/taverna/siralama' },
    ],
    kurumsal: [
      { name: 'Hakkımızda', href: '/hakkimizda' },
      { name: 'İletişim', href: '/iletisim' },
    ],
    yasal: [
      { name: 'Gizlilik Politikası', href: '/gizlilik' },
      { name: 'Kullanım Şartları', href: '/kullanim-sartlari' },
    ],
  };

  return (
    <footer className="bg-pb text-td border-t-4 border-cta">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <Dices 
                size={32} 
                className="text-cta transform -rotate-12 group-hover:rotate-0 transition-transform" 
              />
              <span className="text-3xl font-black tracking-tight text-td">
                Zar<span className="text-cta mx-0.5">&</span>Kule
              </span>
            </Link>
            
            <p className="text-td/70 text-sm leading-relaxed max-w-md">
              Türkiye'nin en büyük masaüstü rol yapma oyunları topluluğu. 
              D&D, Pathfinder ve diğer FRP sistemleri için bir arşiv ve oyun bulma platformu.
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://discord.gg/zarvekule" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-cta hover:bg-cta-hover text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
              >
                <MessageCircle size={16} />
                Discord'a Katıl
              </a>
              <a 
                href="mailto:info@zarvekule.com"
                className="px-4 py-2 border-2 border-td/20 hover:border-cta text-td hover:text-cta rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
              >
                <Mail size={16} />
                İletişim
              </a>
            </div>
          </div>

          {/* Keşfet */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-cta flex items-center gap-2">
              <BookOpen size={16} />
              Keşfet
            </h3>
            <ul className="space-y-2.5">
              {navigation.keşfet.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href}
                    className="text-sm text-td/70 hover:text-cta transition-colors flex items-center gap-1.5 group"
                  >
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topluluk */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-cta flex items-center gap-2">
              <Shield size={16} />
              Topluluk
            </h3>
            <ul className="space-y-2.5">
              {navigation.topluluk.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href}
                    className="text-sm text-td/70 hover:text-cta transition-colors flex items-center gap-1.5 group"
                  >
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal & Yasal */}
          <div className="space-y-8">
            {/* Kurumsal */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-cta flex items-center gap-2">
                <Scroll size={16} />
                Kurumsal
              </h3>
              <ul className="space-y-2.5">
                {navigation.kurumsal.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="text-sm text-td/70 hover:text-cta transition-colors flex items-center gap-1.5 group"
                    >
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Yasal */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-cta">
                Yasal
              </h3>
              <ul className="space-y-2.5">
                {navigation.yasal.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="text-sm text-td/70 hover:text-cta transition-colors flex items-center gap-1.5 group"
                    >
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-td/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-td/50">
            <p>
              &copy; {new Date().getFullYear()} Zar & Kule. Tüm hakları saklıdır.
            </p>
            <p>
              Dungeons & Dragons ve ilgili logolar Wizards of the Coast LLC'nin ticari markalarıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
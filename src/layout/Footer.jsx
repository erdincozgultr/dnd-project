import { Link } from 'react-router-dom';
import { 
  Dices, Map, BookOpen, Users, Twitter, 
  Instagram, Youtube, Mail, ChevronRight 
} from 'lucide-react';

const Footer = () => {
  
  const navigation = {
    keşfet: [
      { name: 'Oyun Bul (Party Finder)', href: '/parties', icon: Dices },
      { name: 'Nasıl Oynanır?', href: '/guide', icon: Map },
      { name: 'Wiki & Arşiv', href: '/wiki', icon: BookOpen },
      { name: 'İçerik Üreticileri Loncası', href: '/creators', icon: Users },
    ],
    hakkımızda: [
      { name: 'Vizyon & Misyon', href: '/about' },
      { name: 'Kullanım Şartları', href: '/terms' },
      { name: 'Gizlilik Politikası', href: '/privacy' },
      { name: 'Çerez Ayarları', href: '/cookies' },
    ],
    destek: [
      { name: 'Yardım Merkezi', href: '/help' },
      { name: 'Sıkça Sorulan Sorular', href: '/faq' },
      { name: 'İletişim', href: '/contact' },
      { name: 'Hata Bildir', href: '/bug-report' },
    ],
  };

  return (

    <footer className="bg-mbg border-t border-cbg/30 text-mtf">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">

          <div className="space-y-6 mb-12 xl:mb-0">
            <Link to="/" className="text-2xl font-black text-cta flex items-center gap-2">
                <Dices size={28} className='transform -rotate-12' />
                Zar & Kule
            </Link>
            <p className="text-sti text-sm max-w-xs">
              Türkiye'nin en büyük FRP topluluğu ve bilgi arşivi. Maceracılar ve Oyun Yöneticileri için bir sığınak.
            </p>
            
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-sti hover:text-cta transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-sti hover:text-cta transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-sti hover:text-cta transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-sti hover:text-cta transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="mt-12 xl:mt-0 grid grid-cols-2 gap-8 md:gap-12 xl:col-span-3 md:grid-cols-3">
            
            <div>
              <h3 className="text-sm font-black text-mtf uppercase tracking-widest mb-4 border-b border-cta/30 pb-1">
                Kuleyi Keşfet
              </h3>
              <ul role="list" className="space-y-3">
                {navigation.keşfet.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-sm text-sti hover:text-cta transition-colors flex items-center group">
                      <ChevronRight size={14} className='mr-1 opacity-70 group-hover:opacity-100 transition-opacity' />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black text-mtf uppercase tracking-widest mb-4 border-b border-cta/30 pb-1">
                Hakkımızda
              </h3>
              <ul role="list" className="space-y-3">
                {navigation.hakkımızda.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-sm text-sti hover:text-cta transition-colors flex items-center group">
                      <ChevronRight size={14} className='mr-1 opacity-70 group-hover:opacity-100 transition-opacity' />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black text-mtf uppercase tracking-widest mb-4 border-b border-cta/30 pb-1">
                Destek
              </h3>
              <ul role="list" className="space-y-3">
                {navigation.destek.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-sm text-sti hover:text-cta transition-colors flex items-center group">
                      <ChevronRight size={14} className='mr-1 opacity-70 group-hover:opacity-100 transition-opacity' />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
      </div>
      
      <div className="border-t border-cbg/30 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-sti/60">
            &copy; {new Date().getFullYear()} Zar & Kule. Tüm hakları gizlidir.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronLeft, Lock, Shield, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Gizlilik Politikası | Zar & Kule</title>
      </Helmet>

      {/* Hero */}
      <section className="py-16 bg-pb text-td">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-td/60 hover:text-cta mb-8 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">Ana Sayfaya Dön</span>
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-cta/20 border-2 border-cta/30 flex items-center justify-center">
              <Lock size={28} className="text-cta" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-td">
              Gizlilik Politikası
            </h1>
          </div>
          <p className="text-td/80">Son güncelleme: {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Giriş */}
          <div className="bg-cta/10 border-2 border-cta/20 rounded-2xl p-6 mb-8">
            <p className="text-mtf leading-relaxed">
              Zar & Kule olarak kullanıcılarımızın gizliliğine önem veriyoruz. Bu politika, 
              kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
            </p>
          </div>

          <div className="space-y-8">
            
            {/* Section 1 */}
            <Section
              icon={<Database size={24} />}
              title="1. Toplanan Bilgiler"
              content={
                <>
                  <p className="mb-4">Platform kullanımınız sırasında aşağıdaki bilgileri topluyoruz:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li><strong>Hesap Bilgileri:</strong> Kullanıcı adı, e-posta adresi, şifre (şifrelenmiş)</li>
                    <li><strong>Profil Bilgileri:</strong> Görünen ad, biyografi, avatar ve banner URL'leri</li>
                    <li><strong>İçerik:</strong> Oluşturduğunuz homebrew'lar, blog yazıları, yorumlar</li>
                    <li><strong>Kullanım Verileri:</strong> IP adresi, tarayıcı bilgisi, ziyaret edilen sayfalar</li>
                    <li><strong>Çerezler:</strong> Oturum yönetimi ve kullanıcı deneyimi için çerezler</li>
                  </ul>
                </>
              }
            />

            {/* Section 2 */}
            <Section
              icon={<UserCheck size={24} />}
              title="2. Bilgilerin Kullanımı"
              content={
                <>
                  <p className="mb-4">Topladığımız bilgileri şu amaçlarla kullanırız:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li>Hesap oluşturma ve yönetimi</li>
                    <li>Platform özelliklerinin sunulması (parti bulma, wiki, blog vb.)</li>
                    <li>Kullanıcı deneyiminin kişiselleştirilmesi</li>
                    <li>Platform güvenliğinin sağlanması</li>
                    <li>İstatistik ve analiz (anonim)</li>
                    <li>Kullanıcılara bildirim gönderme (önemli güncellemeler)</li>
                  </ul>
                </>
              }
            />

            {/* Section 3 */}
            <Section
              icon={<Shield size={24} />}
              title="3. Bilgi Güvenliği"
              content={
                <>
                  <p className="mb-4">Verilerinizi korumak için şu önlemleri alıyoruz:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li>Şifreler bcrypt ile şifrelenir ve düz metin olarak saklanmaz</li>
                    <li>HTTPS protokolü ile güvenli veri iletimi</li>
                    <li>Düzenli güvenlik güncellemeleri ve denetimleri</li>
                    <li>Veritabanı erişim kontrolü ve yetkili personel sınırlaması</li>
                    <li>Düzenli yedekleme ve felaket kurtarma planları</li>
                  </ul>
                </>
              }
            />

            {/* Section 4 */}
            <Section
              icon={<Eye size={24} />}
              title="4. Bilgi Paylaşımı"
              content={
                <>
                  <p className="mb-4">Kişisel bilgilerinizi üçüncü taraflarla paylaşmıyoruz. İstisnalar:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li><strong>Yasal Zorunluluklar:</strong> Mahkeme kararı veya yasal yükümlülük durumunda</li>
                    <li><strong>Platform Güvenliği:</strong> Kötüye kullanım veya güvenlik ihlallerinde</li>
                    <li><strong>Hizmet Sağlayıcılar:</strong> Hosting ve e-posta hizmetleri (gizlilik anlaşması ile)</li>
                  </ul>
                  <p className="mt-4 text-sti">
                    <strong>Not:</strong> Profil bilgileri (kullanıcı adı, görünen ad, avatar) ve oluşturduğunuz 
                    içerikler diğer kullanıcılar tarafından görülebilir.
                  </p>
                </>
              }
            />

            {/* Section 5 */}
            <Section
              icon={<AlertTriangle size={24} />}
              title="5. Kullanıcı Hakları"
              content={
                <>
                  <p className="mb-4">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li>Kişisel verilerinize erişim hakkı</li>
                    <li>Verilerin düzeltilmesini talep etme</li>
                    <li>Verilerin silinmesini talep etme ("unutulma hakkı")</li>
                    <li>Veri işlemeye itiraz etme</li>
                    <li>Verilerin taşınabilirliğini talep etme</li>
                  </ul>
                  <p className="mt-4 text-sti">
                    Bu haklarınızı kullanmak için <Link to="/iletisim" className="text-cta font-bold hover:underline">iletişim sayfamızdan</Link> bize ulaşabilirsiniz.
                  </p>
                </>
              }
            />

            {/* Section 6 */}
            <Section
              icon={<Lock size={24} />}
              title="6. Değişiklikler"
              content={
                <>
                  <p className="text-sti">
                    Bu gizlilik politikasını gerektiğinde güncelleyebiliriz. Önemli değişiklikler 
                    durumunda kullanıcılarımızı e-posta veya platform bildirimleri ile bilgilendiririz.
                  </p>
                </>
              }
            />

          </div>

          {/* İletişim */}
          <div className="mt-12 bg-white border-2 border-cbg rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-black text-mtf mb-4">Sorularınız mı var?</h3>
            <p className="text-sti mb-6">
              Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçin.
            </p>
            <Link
              to="/iletisim"
              className="inline-flex items-center gap-2 px-8 py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-colors shadow-lg shadow-cta/30"
            >
              İletişime Geç
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

const Section = ({ icon, title, content }) => (
  <div className="bg-white border-2 border-cbg rounded-2xl p-6">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl bg-cta/10 border-2 border-cta/20 flex items-center justify-center text-cta flex-shrink-0">
        {icon}
      </div>
      <h2 className="text-2xl font-black text-mtf">{title}</h2>
    </div>
    <div className="text-sti leading-relaxed ml-16">
      {content}
    </div>
  </div>
);

export default PrivacyPolicyPage;
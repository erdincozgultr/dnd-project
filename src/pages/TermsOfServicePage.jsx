// src/pages/TermsOfServicePage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronLeft, FileText, UserCheck, Shield, AlertTriangle, XCircle, Scale } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Kullanım Şartları | Zar & Kule</title>
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
              <FileText size={28} className="text-cta" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-td">
              Kullanım Şartları
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
              Zar & Kule platformunu kullanarak aşağıdaki şartları ve koşulları kabul etmiş sayılırsınız. 
              Lütfen dikkatle okuyun.
            </p>
          </div>

          <div className="space-y-8">
            
            {/* Section 1 */}
            <Section
              icon={<UserCheck size={24} />}
              title="1. Hesap Oluşturma"
              content={
                <>
                  <p className="mb-4">Platform kullanımı için bir hesap oluşturmanız gerekmektedir:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li>13 yaşından büyük olmalısınız</li>
                    <li>Doğru ve güncel bilgiler sağlamalısınız</li>
                    <li>Hesap güvenliğinden siz sorumlusunuz</li>
                    <li>Şifrenizi kimseyle paylaşmamalısınız</li>
                    <li>Bir kişi yalnızca bir hesap oluşturabilir</li>
                  </ul>
                </>
              }
            />

            {/* Section 2 */}
            <Section
              icon={<Shield size={24} />}
              title="2. Kabul Edilebilir Kullanım"
              content={
                <>
                  <p className="mb-4">Platform kullanırken aşağıdaki kurallara uymalısınız:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li>Diğer kullanıcılara saygılı davranın</li>
                    <li>Hakaret, nefret söylemi veya taciz yapmayın</li>
                    <li>Telif hakkı korumalı içerikleri izinsiz paylaşmayın</li>
                    <li>Spam veya kötü niyetli içerik paylaşmayın</li>
                    <li>Platform güvenliğini tehdit etmeyin</li>
                    <li>Başkalarının hesaplarını ele geçirmeye çalışmayın</li>
                  </ul>
                </>
              }
            />

            {/* Section 3 */}
            <Section
              icon={<FileText size={24} />}
              title="3. İçerik Sahipliği"
              content={
                <>
                  <p className="mb-4">Platformda paylaştığınız içerikler hakkında:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li>Oluşturduğunuz homebrew, blog ve yorumların telif hakkı size aittir</li>
                    <li>Platformda paylaşarak içeriğinizi görüntüleme ve kullanma lisansı vermiş olursunuz</li>
                    <li>İçeriğinizi istediğiniz zaman silebilirsiniz</li>
                    <li>Başkalarının telif haklarını ihlal etmemelisiniz</li>
                    <li>Wizards of the Coast ve diğer yayıncıların içeriklerine atıfta bulunurken dikkatli olun</li>
                  </ul>
                </>
              }
            />

            {/* Section 4 */}
            <Section
              icon={<Scale size={24} />}
              title="4. Telif Hakları"
              content={
                <>
                  <p className="mb-4">Zar & Kule, D&D 5e ve Pathfinder gibi sistemlerin içeriklerini referans olarak kullanır:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li>Resmi içerikler (SRD) Open Game License kapsamındadır</li>
                    <li>Wizards of the Coast ve Paizo'nun ticari markaları onlara aittir</li>
                    <li>Platform, resmi içerik sağlayıcılarla bağlantılı değildir</li>
                    <li>Telif hakkı ihlali bildirimleri için <Link to="/iletisim" className="text-cta font-bold hover:underline">iletişim</Link> sayfamızı kullanın</li>
                  </ul>
                </>
              }
            />

            {/* Section 5 */}
            <Section
              icon={<XCircle size={24} />}
              title="5. Yasaklı Davranışlar"
              content={
                <>
                  <p className="mb-4">Aşağıdaki davranışlar kesinlikle yasaktır:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li>Bot veya otomatik araçlar kullanmak</li>
                    <li>Platform güvenlik açıklarından yararlanmak</li>
                    <li>Sahte hesaplar oluşturmak</li>
                    <li>Sistemi manipüle etmeye çalışmak (XP farming, fake likes vb.)</li>
                    <li>Kişisel bilgileri izinsiz paylaşmak (doxxing)</li>
                    <li>Ticari amaçla spam göndermek</li>
                  </ul>
                </>
              }
            />

            {/* Section 6 */}
            <Section
              icon={<AlertTriangle size={24} />}
              title="6. Hesap Askıya Alma ve Kapatma"
              content={
                <>
                  <p className="mb-4">Kullanım şartlarını ihlal etmeniz durumunda:</p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li>İlk ihlalde uyarı alabilirsiniz</li>
                    <li>Tekrarlayan ihlallerde hesabınız geçici olarak askıya alınabilir</li>
                    <li>Ciddi ihlallerde hesabınız kalıcı olarak kapatılabilir</li>
                    <li>Yasaklanan kullanıcılar yeni hesap oluşturamazlar</li>
                    <li>İtiraz için <Link to="/iletisim" className="text-cta font-bold hover:underline">iletişime</Link> geçebilirsiniz</li>
                  </ul>
                </>
              }
            />

            {/* Section 7 */}
            <Section
              icon={<Shield size={24} />}
              title="7. Sorumluluk Reddi"
              content={
                <>
                  <p className="text-sti mb-4">
                    Zar & Kule platformu "olduğu gibi" sunulmaktadır. Aşağıdaki konularda sorumluluk kabul etmiyoruz:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sti ml-4">
                    <li>Kullanıcı içeriğinin doğruluğu veya kalitesi</li>
                    <li>Hizmet kesintileri veya veri kayıpları</li>
                    <li>Üçüncü taraf bağlantıları ve içerikler</li>
                    <li>Kullanıcılar arası anlaşmazlıklar</li>
                  </ul>
                </>
              }
            />

            {/* Section 8 */}
            <Section
              icon={<FileText size={24} />}
              title="8. Değişiklikler"
              content={
                <>
                  <p className="text-sti">
                    Bu kullanım şartlarını gerektiğinde güncelleyebiliriz. Önemli değişiklikler durumunda 
                    kullanıcılarımızı platform bildirimleri veya e-posta ile bilgilendiririz. 
                    Değişiklikler yayınlandıktan sonra platformu kullanmaya devam etmeniz, 
                    yeni şartları kabul ettiğiniz anlamına gelir.
                  </p>
                </>
              }
            />

          </div>

          {/* İletişim */}
          <div className="mt-12 bg-white border-2 border-cbg rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-black text-mtf mb-4">Sorularınız mı var?</h3>
            <p className="text-sti mb-6">
              Kullanım şartlarımız hakkında sorularınız için bizimle iletişime geçin.
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

export default TermsOfServicePage;
// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Send, ChevronLeft, Loader2, HelpCircle, MapPin, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import useAxios, { METHODS } from '../hooks/useAxios';

const ContactPage = () => {
  const { sendRequest, loading } = useAxios();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    sendRequest({
      url: '/contact',
      method: METHODS.POST,
      data: formData,
      callbackSuccess: () => {
        toast.success('Mesajınız gönderildi! En kısa sürede dönüş yapacağız.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      },
      showErrorToast: true,
    });
  };

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>İletişim | Zar & Kule</title>
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
              <Mail size={28} className="text-cta" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-td">
              İletişim
            </h1>
          </div>
          <p className="text-td/80 text-lg">
            Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            
            {/* İletişim Kanalları */}
            <div className="bg-white border-2 border-cbg rounded-2xl p-6">
              <h2 className="text-xl font-black text-mtf mb-4">İletişim Kanalları</h2>
              
              <div className="space-y-4">
                <ContactMethod
                  icon={<Mail size={20} />}
                  title="E-posta"
                  value="info@zarvekule.com"
                  href="mailto:info@zarvekule.com"
                />

                <ContactMethod
                  icon={<MessageCircle size={20} />}
                  title="Discord"
                  value="Topluluğa Katıl"
                  href="https://discord.gg/zarvekule"
                  external
                />
              </div>
            </div>

            {/* Çalışma Saatleri */}
            <div className="bg-white border-2 border-cbg rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-cta" />
                <h3 className="text-lg font-black text-mtf">Yanıt Süresi</h3>
              </div>
              <p className="text-sm text-sti leading-relaxed">
                E-posta mesajlarınıza genellikle <strong className="text-mtf">24-48 saat</strong> içinde 
                yanıt vermeye çalışıyoruz.
              </p>
              <p className="text-xs text-sti/70 mt-3">
                Hafta sonları ve resmi tatillerde yanıt süreleri uzayabilir.
              </p>
            </div>

            {/* SSS Yönlendirmesi */}
            <div className="bg-cta/10 border-2 border-cta/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle size={20} className="text-cta" />
                <h3 className="font-bold text-mtf">Hızlı Çözüm</h3>
              </div>
              <p className="text-sm text-sti mb-4">
                Teknik sorularınız için önce SSS sayfamızı kontrol edin. 
                Birçok yaygın sorunun çözümünü burada bulabilirsiniz.
              </p>
              <Link
                to="/sss"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cta text-white rounded-lg font-bold text-sm hover:bg-cta-hover transition-colors"
              >
                <HelpCircle size={16} />
                SSS'ye Git
              </Link>
            </div>

            {/* Adres Bilgisi */}
            <div className="bg-white border-2 border-cbg rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={20} className="text-cta" />
                <h3 className="font-bold text-mtf">Adres</h3>
              </div>
              <p className="text-sm text-sti">
                Zar & Kule<br />
                İstanbul, Türkiye
              </p>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white border-2 border-cbg rounded-2xl p-8">
              <h2 className="text-2xl font-black text-mtf mb-6">Mesaj Gönder</h2>

              <div className="space-y-5">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-black text-sti uppercase tracking-wider mb-2">
                    Adınız *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all"
                    placeholder="Ahmet Yılmaz"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black text-sti uppercase tracking-wider mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all"
                    placeholder="ahmet@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-black text-sti uppercase tracking-wider mb-2">
                    Konu *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Konu seçin...</option>
                    <option value="general">Genel Soru</option>
                    <option value="technical">Teknik Destek</option>
                    <option value="content">İçerik/Telif Hakkı</option>
                    <option value="account">Hesap Sorunları</option>
                    <option value="suggestion">Öneri/Geri Bildirim</option>
                    <option value="partnership">İş Birliği</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-black text-sti uppercase tracking-wider mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all resize-none"
                    placeholder="Mesajınızı detaylı bir şekilde açıklayın..."
                  />
                  <p className="text-xs text-sti mt-2">
                    Minimum 20 karakter
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-colors shadow-lg shadow-cta/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Gönder
                    </>
                  )}
                </button>

                {/* Privacy Note */}
                <p className="text-xs text-sti/70 text-center">
                  Mesajınızı göndererek <Link to="/gizlilik" className="text-cta hover:underline">Gizlilik Politikamızı</Link> kabul etmiş olursunuz.
                </p>

              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

// Contact Method Component
const ContactMethod = ({ icon, title, value, href, external = false }) => (
  <a 
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    className="flex items-center gap-3 p-3 bg-mbg rounded-xl hover:bg-cta/10 transition-colors group"
  >
    <div className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center text-cta group-hover:bg-cta/20 transition-colors">
      {icon}
    </div>
    <div>
      <p className="font-bold text-mtf text-sm">{title}</p>
      <p className="text-xs text-sti">{value}</p>
    </div>
  </a>
);

export default ContactPage;
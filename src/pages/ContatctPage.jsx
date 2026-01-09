// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Send, ChevronLeft, Loader2, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Backend endpoint'i ekle
    setTimeout(() => {
      toast.success('Mesajınız gönderildi! En kısa sürede dönüş yapacağız.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
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

          <h1 className="text-4xl md:text-5xl font-black text-td mb-4">
            İletişim
          </h1>
          <p className="text-td/80 text-lg">
            Sorularınız, önerileriniz veya geri bildirimleriniz için bize ulaşın
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-cbg rounded-2xl p-6">
              <h2 className="text-xl font-black text-mtf mb-4">İletişim Kanalları</h2>
              
              <div className="space-y-4">
                <a 
                  href="mailto:info@zarvekule.com"
                  className="flex items-center gap-3 p-3 bg-mbg rounded-xl hover:bg-cta/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center group-hover:bg-cta/20">
                    <Mail size={20} className="text-cta" />
                  </div>
                  <div>
                    <p className="font-bold text-mtf text-sm">E-posta</p>
                    <p className="text-xs text-sti">info@zarvekule.com</p>
                  </div>
                </a>

                <a 
                  href="https://discord.gg/zarvekule"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-mbg rounded-xl hover:bg-cta/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cta/10 flex items-center justify-center group-hover:bg-cta/20">
                    <MessageCircle size={20} className="text-cta" />
                  </div>
                  <div>
                    <p className="font-bold text-mtf text-sm">Discord</p>
                    <p className="text-xs text-sti">Topluluğa Katıl</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-cta/10 border-2 border-cta/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle size={20} className="text-cta" />
                <h3 className="font-bold text-mtf">Hızlı İpucu</h3>
              </div>
              <p className="text-sm text-sti">
                Teknik sorular için önce <Link to="/sss" className="text-cta font-bold hover:underline">SSS sayfamızı</Link> kontrol edin.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white border-2 border-cbg rounded-2xl p-8">
              <h2 className="text-2xl font-black text-mtf mb-6">Mesaj Gönder</h2>

              <div className="space-y-5">
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

                <div>
                  <label className="block text-xs font-black text-sti uppercase tracking-wider mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all"
                    placeholder="Konu başlığı"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-sti uppercase tracking-wider mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-2 focus:ring-cta/20 outline-none transition-all resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

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
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
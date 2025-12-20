import React, { useState, useEffect } from 'react';
import venueService from '../../services/venueService';
import { X, Star, MapPin, Globe, Instagram, Phone, ShieldCheck, MessageSquarePlus } from 'lucide-react';

const VenueDetailModal = ({ id, onClose }) => {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review (Yorum) State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Claim (Sahiplenme) State
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimReason, setClaimReason] = useState('');

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await venueService.getVenueById(id);
      setVenue(res.data);
    } catch (err) {
      console.error("Detaylar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      // ReviewRequest.java yapısına uygun gönderim
      await venueService.addReview(id, reviewData);
      alert("Yorumunuz kaydedildi.");
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      fetchDetails(); // Puanı güncellemek için
    } catch (err) {
      alert("Yorum gönderilemedi.");
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    try {
      // ClaimRequest.java: { reason }
      await venueService.claimVenue(id, { reason: claimReason });
      alert("Sahiplik başvurunuz iletildi.");
      setShowClaimForm(false);
    } catch (err) {
      alert("Başvuru sırasında bir hata oluştu.");
    }
  };

  if (!id) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-[var(--color-mbg)] border-2 border-[var(--color-pb)] rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Koyu Tema (pb/td) */}
        <div className="p-4 bg-[var(--color-pb)] flex justify-between items-center text-[var(--color-td)]">
          <h2 className="text-xl font-black uppercase tracking-tighter">
            {loading ? "Yükleniyor..." : venue?.name}
          </h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={24} /></button>
        </div>

        {/* İçerik Alanı */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-[var(--color-mtf)]">
          {loading ? (
            <div className="py-20 text-center italic text-[var(--color-sti)]">Mekan detayları getiriliyor...</div>
          ) : (
            <>
              {/* Üst Bilgiler */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-[var(--color-cta)] text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                      {venue.type}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-[var(--color-cta)]">
                      <Star size={16} fill="currentColor" /> {venue.averageRating} ({venue.reviewCount} Yorum)
                    </span>
                  </div>
                  
                  <p className="text-sm italic leading-relaxed bg-[var(--color-cbg)] p-4 rounded-lg border-l-4 border-[var(--color-cta)]">
                    {venue.description || "Bu mekan hakkında henüz bir açıklama girilmemiş."}
                  </p>

                  <div className="space-y-2 text-sm text-[var(--color-sti)]">
                    <p className="flex items-center gap-2 font-semibold">
                      <MapPin size={16} className="text-[var(--color-cta)]" /> 
                      {venue.address}, {venue.district}/{venue.city}
                    </p>
                    {venue.phone && <p className="flex items-center gap-2"><Phone size={16}/> {venue.phone}</p>}
                    <div className="flex gap-4 pt-2">
                      {venue.website && (
                        <a href={venue.website} target="_blank" className="flex items-center gap-1 text-[var(--color-cta)] font-bold hover:underline">
                          <Globe size={16}/> Website
                        </a>
                      )}
                      {venue.instagramHandle && (
                        <a href={`https://instagram.com/${venue.instagramHandle}`} target="_blank" className="flex items-center gap-1 text-[var(--color-cta)] font-bold hover:underline">
                          <Instagram size={16}/> @{venue.instagramHandle}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hızlı Aksiyonlar */}
              <div className="grid grid-cols-2 gap-4 border-t border-stone-300 pt-6">
                <button 
                  onClick={() => { setShowReviewForm(!showReviewForm); setShowClaimForm(false); }}
                  className="flex items-center justify-center gap-2 p-3 bg-[var(--color-pb)] text-[var(--color-td)] font-bold rounded-lg hover:opacity-90 transition-all"
                >
                  <MessageSquarePlus size={18} /> Yorum Yap
                </button>
                <button 
                  onClick={() => { setShowClaimForm(!showClaimForm); setShowReviewForm(false); }}
                  className="flex items-center justify-center gap-2 p-3 border-2 border-[var(--color-pb)] text-[var(--color-pb)] font-bold rounded-lg hover:bg-stone-200 transition-all"
                >
                  <ShieldCheck size={18} /> Sahiplen
                </button>
              </div>

              {/* Yorum Formu (ReviewRequest.java) */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="bg-[var(--color-cbg)] p-4 rounded-xl space-y-4 border-2 border-stone-300 animate-in fade-in zoom-in duration-200">
                  <h4 className="font-black text-sm uppercase italic">Deneyimini Paylaş</h4>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star} type="button" 
                        onClick={() => setReviewData({...reviewData, rating: star})}
                        className="transition-transform active:scale-90"
                      >
                        <Star size={24} fill={star <= reviewData.rating ? "var(--color-cta)" : "none"} color={star <= reviewData.rating ? "var(--color-cta)" : "gray"} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    className="w-full p-3 bg-[var(--color-mbg)] border border-stone-300 rounded outline-none focus:border-[var(--color-cta)]"
                    placeholder="Han hakkındaki düşüncelerin..."
                    value={reviewData.comment}
                    onChange={e => setReviewData({...reviewData, comment: e.target.value})}
                    required
                  />
                  <button type="submit" className="w-full p-2 bg-[var(--color-cta)] text-white font-bold rounded uppercase">Gönder</button>
                </form>
              )}

              {/* Sahiplenme Formu (ClaimRequest.java) */}
              {showClaimForm && (
                <form onSubmit={handleClaimSubmit} className="bg-stone-100 p-4 rounded-xl space-y-4 border-2 border-[var(--color-pb)] animate-in fade-in slide-in-from-bottom-2">
                  <h4 className="font-black text-sm uppercase italic text-[var(--color-pb)]">Mekan Sahipliği Başvurusu</h4>
                  <p className="text-[10px] text-[var(--color-sti)] italic">Lütfen mekanı neden sahiplendiğinizi (işletmeci, kurucu vb.) belirtin.</p>
                  <textarea 
                    className="w-full p-3 bg-white border border-stone-300 rounded outline-none focus:border-[var(--color-pb)]"
                    placeholder="Başvuru gerekçeniz..."
                    value={claimReason}
                    onChange={e => setClaimReason(e.target.value)}
                    required
                  />
                  <button type="submit" className="w-full p-2 bg-[var(--color-pb)] text-[var(--color-td)] font-bold rounded uppercase">Başvuruyu İlet</button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueDetailModal;
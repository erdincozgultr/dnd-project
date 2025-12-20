import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import venueService from '../services/venueService';
import { VenueTypeLabels, VenueStatusLabels } from '../constants/venueEnums';

const VenueDetailPage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal Durumları
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Form Verileri
  const [claimReason, setClaimReason] = useState("");
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  const loadVenue = async () => {
    try {
        const res = await venueService.getById(id);
        setVenue(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadVenue();
  }, [id]);

  // Sahiplenme İsteği Gönder
  const handleClaimSubmit = async (e) => {
      e.preventDefault();
      try {
          await venueService.claimVenue(id, { reason: claimReason });
          alert("Sahiplenme isteğiniz gönderildi! Yönetici onayından sonra size bildirilecek.");
          setShowClaimModal(false);
          loadVenue(); // Durumu güncellemek için
      } catch (err) {
          alert("Hata: " + (err.response?.data?.message || "İşlem başarısız."));
      }
  };

  // Yorum Gönder
  const handleReviewSubmit = async (e) => {
      e.preventDefault();
      try {
          await venueService.addReview(id, reviewData);
          alert("Yorumunuz eklendi!");
          setShowReviewModal(false);
          loadVenue(); // Puanı güncellemek için
      } catch (err) {
          alert("Hata: " + (err.response?.data?.message || "Yorum eklenemedi."));
      }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (!venue) return <div>Mekan bulunamadı.</div>;

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Üst Bilgi Kartı */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                  <h1 style={{ margin: '0 0 10px 0' }}>{venue.name}</h1>
                  <span style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '5px 10px', borderRadius: '20px', fontSize: '0.9rem' }}>
                      {VenueTypeLabels[venue.type]}
                  </span>
                  <span style={{ marginLeft: '10px', color: '#666' }}>
                      {venue.district}, {venue.city}
                  </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f39c12' }}>
                      ★ {venue.averageRating}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#888' }}>
                      {venue.reviewCount} Değerlendirme
                  </div>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f39c12', color: '#fff', border: 'none', borderRadius: '4px' }}
                  >
                      Yorum Yap
                  </button>
              </div>
          </div>
          
          <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #eee' }} />

          <p style={{ lineHeight: '1.6' }}>{venue.description || "Açıklama girilmemiş."}</p>
          
          {/* İletişim Bilgileri */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
              {venue.website && <a href={venue.website} target="_blank" rel="noreferrer">🌐 Web Sitesi</a>}
              {venue.instagramHandle && <a href={`https://instagram.com/${venue.instagramHandle}`} target="_blank" rel="noreferrer">📷 Instagram</a>}
              {venue.phone && <span>📞 {venue.phone}</span>}
          </div>
      </div>

      {/* Sahiplik Alanı */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '12px', border: '1px dashed #ccc' }}>
          <h4>Mekan Yöneticisi</h4>
          {venue.owner ? (
              <p>
                  Bu mekan <strong>{venue.owner.fullName || venue.owner.username}</strong> tarafından yönetiliyor.
              </p>
          ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0 }}>Bu mekanın henüz bir yöneticisi yok. İşletme sahibi misiniz?</p>
                  <button 
                    onClick={() => setShowClaimModal(true)}
                    style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                      Mekanı Sahiplen
                  </button>
              </div>
          )}
      </div>

      {/* --- MODALLAR --- */}

      {/* 1. Sahiplenme Modalı */}
      {showClaimModal && (
          <div style={modalOverlayStyle}>
              <div style={modalContentStyle}>
                  <h3>Mekanı Sahiplen</h3>
                  <p style={{fontSize: '0.9rem', color: '#666'}}>Neden bu mekanın sahibi olduğunuzu açıklayın.</p>
                  <form onSubmit={handleClaimSubmit}>
                      <textarea 
                          required
                          value={claimReason}
                          onChange={(e) => setClaimReason(e.target.value)}
                          placeholder="Örn: İşletme sahibiyim, vergi levham mevcut..."
                          style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button type="button" onClick={() => setShowClaimModal(false)}>İptal</button>
                          <button type="submit" style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '8px 15px' }}>Gönder</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* 2. Yorum Modalı */}
      {showReviewModal && (
          <div style={modalOverlayStyle}>
              <div style={modalContentStyle}>
                  <h3>Değerlendir ve Yorum Yap</h3>
                  <form onSubmit={handleReviewSubmit}>
                      <div style={{ marginBottom: '15px' }}>
                          <label>Puan: </label>
                          <select 
                            value={reviewData.rating} 
                            onChange={(e) => setReviewData({...reviewData, rating: parseInt(e.target.value)})}
                            style={{ padding: '5px' }}
                          >
                              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Yıldız</option>)}
                          </select>
                      </div>
                      <textarea 
                          required
                          value={reviewData.comment}
                          onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                          placeholder="Deneyiminiz nasıldı?"
                          style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button type="button" onClick={() => setShowReviewModal(false)}>İptal</button>
                          <button type="submit" style={{ backgroundColor: '#f39c12', color: '#fff', border: 'none', padding: '8px 15px' }}>Gönder</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

// Basit Modal Stilleri (index.css varsa oradan class da verilebilir)
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContentStyle = {
    backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '400px', maxWidth: '90%'
};

export default VenueDetailPage;
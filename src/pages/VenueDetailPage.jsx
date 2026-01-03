// src/pages/VenueDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  MapPinned, ChevronLeft, MapPin, Phone, Globe, Instagram,
  Star, Clock, Users, Navigation, Loader2, Edit3, Shield,
  MessageSquare, Send, ChevronRight, ExternalLink, Coffee,
  Store, BookOpen, Package, AlertCircle, CheckCircle, X
} from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

// Mekan türü tanımları
const VENUE_TYPES = {
  CAFE: { label: 'Kafe', icon: <Coffee size={20} />, color: 'bg-amber-500' },
  GAME_STORE: { label: 'Oyun Mağazası', icon: <Store size={20} />, color: 'bg-purple-500' },
  COMMUNITY_CENTER: { label: 'Topluluk Merkezi', icon: <Users size={20} />, color: 'bg-blue-500' },
  LIBRARY: { label: 'Kütüphane', icon: <BookOpen size={20} />, color: 'bg-green-500' },
  OTHER: { label: 'Diğer', icon: <Package size={20} />, color: 'bg-gray-500' },
};

const VenueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  
  const [venue, setVenue] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [claimReason, setClaimReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVenue();
    fetchReviews();
  }, [id]);

  const fetchVenue = () => {
    sendRequest({
      url: `/venues/${id}`,
      method: METHODS.GET,
      callbackSuccess: (res) => setVenue(res.data),
      callbackError: () => {
        toast.error('Mekan bulunamadı.');
        navigate('/mekanlar');
      }
    });
  };

  const fetchReviews = () => {
    sendRequest({
      url: `/venues/${id}/reviews`,
      method: METHODS.GET,
      callbackSuccess: (res) => setReviews(res.data || []),
      showErrorToast: false,
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewData.comment.trim()) {
      toast.warning('Lütfen bir yorum yazın.');
      return;
    }

    setSubmitting(true);
    sendRequest({
      url: `/venues/${id}/reviews`,
      method: METHODS.POST,
      data: reviewData,
      callbackSuccess: () => {
        toast.success('Yorumun eklendi!');
        setShowReviewForm(false);
        setReviewData({ rating: 5, comment: '' });
        fetchVenue();
        fetchReviews();
        setSubmitting(false);
      },
      callbackError: () => setSubmitting(false),
    });
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimReason.trim()) {
      toast.warning('Lütfen bir neden belirtin.');
      return;
    }

    setSubmitting(true);
    sendRequest({
      url: `/venues/${id}/claim`,
      method: METHODS.POST,
      data: { reason: claimReason },
      callbackSuccess: () => {
        toast.success('Sahiplik başvurunuz iletildi!');
        setShowClaimForm(false);
        setClaimReason('');
        setSubmitting(false);
      },
      callbackError: () => setSubmitting(false),
    });
  };

  if (loading || !venue) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  const type = VENUE_TYPES[venue.type] || VENUE_TYPES.OTHER;
  const hasOwner = venue.owner !== null;
  const isOwner = user?.username === venue.owner?.username;
  const hasAlreadyReviewed = reviews.some(r => r.user?.username === user?.username);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-mbg font-display pb-12">
      <Helmet>
        <title>{venue.name} | Dost Mekanlar | Zar & Kule</title>
        <meta name="description" content={venue.description || `${venue.name} - ${venue.city}`} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-mtf">
        <div className="absolute inset-0 " />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/mekanlar" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">Mekanlara Dön</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              {/* Type Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${type.color} text-white text-sm font-bold rounded-lg mb-4`}>
                {type.icon} {type.label}
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                {venue.name}
              </h1>
              
              <p className="text-white/70 flex items-center gap-2">
                <MapPin size={16} className="text-emerald-400" />
                {venue.address || `${venue.district}, ${venue.city}`}
              </p>
            </div>

            {/* Rating Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={24} className="text-amber-400 fill-amber-400" />
                    <span className="text-3xl font-black text-white">{venue.averageRating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <p className="text-white/60 text-xs">{venue.reviewCount || 0} değerlendirme</p>
                </div>
                
                {venue.distanceKm && (
                  <>
                    <div className="w-px h-12 bg-white/20" />
                    <div className="text-center">
                      <div className="flex items-center gap-1 mb-1">
                        <Navigation size={20} className="text-emerald-400" />
                        <span className="text-2xl font-black text-white">{venue.distanceKm.toFixed(1)}</span>
                      </div>
                      <p className="text-white/60 text-xs">km uzaklıkta</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white border border-cbg rounded-2xl p-6">
              <h2 className="text-lg font-black text-mtf uppercase tracking-tight mb-4 flex items-center gap-2">
                <MapPinned size={20} className="text-emerald-500" />
                Hakkında
              </h2>
              
              {venue.description ? (
                <p className="text-sti leading-relaxed whitespace-pre-wrap">{venue.description}</p>
              ) : (
                <p className="text-sti italic">Henüz açıklama eklenmemiş.</p>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white border border-cbg rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2">
                  <MessageSquare size={20} className="text-emerald-500" />
                  Değerlendirmeler ({reviews.length})
                </h2>

                {isAuthenticated && !hasAlreadyReviewed && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors"
                  >
                    <Star size={16} /> Değerlendir
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h4 className="font-bold text-mtf mb-4">Değerlendirmeni Paylaş</h4>
                  
                  {/* Rating Stars */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-sti uppercase mb-2">Puanın</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                          className="focus:outline-none"
                        >
                          <Star 
                            size={28} 
                            className={`transition-colors ${star <= reviewData.rating ? 'text-amber-400 fill-amber-400' : 'text-cbg'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-sti uppercase mb-2">Yorumun</label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                      rows={3}
                      placeholder="Deneyimini paylaş..."
                      className="w-full p-3 bg-white border border-cbg rounded-xl text-mtf resize-none focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-sti hover:text-mtf font-bold transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-5 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      Gönder
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="mx-auto text-cbg mb-3" />
                  <p className="text-sti">Henüz değerlendirme yok. İlk yorumu sen yap!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-mbg rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <Link 
                          to={`/profil/${review.user?.username}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden">
                            {review.user?.avatarUrl ? (
                              <img src={review.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-emerald-600 font-black">
                                {review.user?.displayName?.charAt(0) || review.user?.username?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-mtf group-hover:text-emerald-600 transition-colors">
                              {review.user?.displayName || review.user?.username}
                            </p>
                            <p className="text-xs text-sti">{formatDate(review.createdAt)}</p>
                          </div>
                        </Link>
                        
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              size={14} 
                              className={star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-cbg'}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sti text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white border border-cbg rounded-2xl p-6">
              <h3 className="text-sm font-black text-mtf uppercase tracking-tight mb-4">İletişim</h3>
              
              <div className="space-y-3">
                {venue.phone && (
                  <a 
                    href={`tel:${venue.phone}`}
                    className="flex items-center gap-3 p-3 bg-mbg rounded-xl hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Phone size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-sti uppercase">Telefon</p>
                      <p className="font-bold text-mtf group-hover:text-emerald-600 transition-colors">{venue.phone}</p>
                    </div>
                  </a>
                )}

                {venue.website && (
                  <a 
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-mbg rounded-xl hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Globe size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-sti uppercase">Website</p>
                      <p className="font-bold text-mtf group-hover:text-blue-600 transition-colors truncate">{venue.website}</p>
                    </div>
                    <ExternalLink size={16} className="text-sti" />
                  </a>
                )}

                {venue.instagramHandle && (
                  <a 
                    href={`https://instagram.com/${venue.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-mbg rounded-xl hover:bg-pink-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                      <Instagram size={18} className="text-pink-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-sti uppercase">Instagram</p>
                      <p className="font-bold text-mtf group-hover:text-pink-600 transition-colors">{venue.instagramHandle}</p>
                    </div>
                    <ExternalLink size={16} className="text-sti" />
                  </a>
                )}

                {!venue.phone && !venue.website && !venue.instagramHandle && (
                  <p className="text-sti text-sm italic text-center py-4">İletişim bilgisi eklenmemiş.</p>
                )}
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white border border-cbg rounded-2xl p-6">
              <h3 className="text-sm font-black text-mtf uppercase tracking-tight mb-4">Konum</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-emerald-500 mt-0.5" />
                  <div>
                    <p className="font-bold text-mtf">{venue.city}</p>
                    {venue.district && <p className="text-sm text-sti">{venue.district}</p>}
                    {venue.address && <p className="text-sm text-sti mt-1">{venue.address}</p>}
                  </div>
                </div>

                {venue.latitude && venue.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                  >
                    <Navigation size={18} />
                    Haritada Göster
                  </a>
                )}
              </div>
            </div>

            {/* Owner/Claim Card */}
            <div className="bg-white border border-cbg rounded-2xl p-6">
              <h3 className="text-sm font-black text-mtf uppercase tracking-tight mb-4 flex items-center gap-2">
                <Shield size={16} className="text-emerald-500" />
                Mekan Sahibi
              </h3>
              
              {hasOwner ? (
                <Link 
                  to={`/profil/${venue.owner.username}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 overflow-hidden">
                    {venue.owner.avatarUrl ? (
                      <img src={venue.owner.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-600 font-black">
                        {venue.owner.displayName?.charAt(0) || venue.owner.username?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-mtf group-hover:text-emerald-600 transition-colors">
                      {venue.owner.displayName || venue.owner.username}
                    </p>
                    <p className="text-xs text-sti flex items-center gap-1">
                      <CheckCircle size={12} className="text-green-500" />
                      Doğrulanmış Sahip
                    </p>
                  </div>
                </Link>
              ) : (
                <div>
                  <p className="text-sm text-sti mb-4">Bu mekanın henüz doğrulanmış bir sahibi yok.</p>
                  
                  {isAuthenticated && !showClaimForm && (
                    <button
                      onClick={() => setShowClaimForm(true)}
                      className="flex items-center gap-2 w-full px-4 py-3 border border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
                    >
                      <Shield size={18} />
                      Bu Mekan Bana Ait
                    </button>
                  )}

                  {showClaimForm && (
                    <form onSubmit={handleClaimSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-sti uppercase mb-2">
                          Mekanla ilişkinizi açıklayın
                        </label>
                        <textarea
                          value={claimReason}
                          onChange={(e) => setClaimReason(e.target.value)}
                          rows={3}
                          placeholder="Ben bu mekanın sahibiyim çünkü..."
                          className="w-full p-3 bg-mbg border border-cbg rounded-xl text-mtf resize-none focus:border-emerald-500 outline-none text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowClaimForm(false)}
                          className="flex-1 px-4 py-2 border border-cbg text-sti rounded-xl font-bold hover:bg-mbg transition-colors"
                        >
                          İptal
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                          Başvur
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <h4 className="text-sm font-black text-emerald-800 flex items-center gap-2 mb-3">
                <AlertCircle size={16} />
                Güvenli Buluşma
              </h4>
              <ul className="text-xs text-emerald-700 space-y-2">
                <li>• Buluşmadan önce mekanı araştırın</li>
                <li>• İlk buluşmalarda kalabalık ortamları tercih edin</li>
                <li>• Arkadaşlarınızı bilgilendirin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;
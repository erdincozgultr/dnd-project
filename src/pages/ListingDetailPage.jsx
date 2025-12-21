// src/pages/ListingDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  ShoppingBag, ChevronLeft, Clock, User, Tag, Package,
  Phone, Mail, MessageSquare, Shield, Award, Calendar,
  Loader2, Edit3, Trash2, CheckCircle, AlertCircle, Star
} from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

const CATEGORY_LABELS = {
  DICE: 'Zar Setleri',
  MINIATURE: 'Minyatürler',
  RULEBOOK: 'Kural Kitapları',
  BOARD_GAME: 'Kutu Oyunları',
  ACCESSORY: 'Aksesuarlar',
  OTHER: 'Diğer',
};

const CONDITION_LABELS = {
  NEW: { label: 'Sıfır', color: 'bg-green-500', desc: 'Hiç kullanılmamış, ambalajında' },
  USED_LIKE_NEW: { label: 'Sıfır Gibi', color: 'bg-blue-500', desc: 'Çok az kullanılmış, kusursuz' },
  USED_GOOD: { label: 'İyi Durumda', color: 'bg-yellow-500', desc: 'Normal kullanım izleri var' },
  USED_FAIR: { label: 'Kullanılmış', color: 'bg-orange-500', desc: 'Belirgin kullanım izleri var' },
};

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  
  const [listing, setListing] = useState(null);
  const [sellerTrust, setSellerTrust] = useState(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    // Fetch listing
    sendRequest({
      url: `/marketplace/${id}`,
      method: METHODS.GET,
      callbackSuccess: (res) => {
        setListing(res.data);
        // Fetch seller trust
        if (res.data.seller?.id) {
          sendRequest({
            url: `/marketplace/seller-trust/${res.data.seller.id}`,
            method: METHODS.GET,
            callbackSuccess: (trustRes) => setSellerTrust(trustRes.data),
            showErrorToast: false,
          });
        }
      },
      callbackError: () => {
        toast.error('İlan bulunamadı.');
        navigate('/pazar');
      }
    });
  }, [id]);

  const handleMarkAsSold = () => {
    if (!window.confirm('İlanı satıldı olarak işaretlemek istediğine emin misin?')) return;
    
    sendRequest({
      url: `/marketplace/${id}/sold`,
      method: METHODS.PATCH,
      callbackSuccess: () => {
        toast.success('İlan satıldı olarak işaretlendi!');
        navigate('/pazar');
      }
    });
  };

  const handleDelete = () => {
    if (!window.confirm('İlanı silmek istediğine emin misin?')) return;
    
    sendRequest({
      url: `/marketplace/${id}`,
      method: METHODS.DELETE,
      callbackSuccess: () => {
        toast.success('İlan silindi.');
        navigate('/pazar');
      }
    });
  };

  if (loading || !listing) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  const isOwner = user?.username === listing.seller?.username;
  const condition = CONDITION_LABELS[listing.condition] || CONDITION_LABELS.USED_GOOD;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

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
        <title>{listing.title} | Bit Pazarı | Zar & Kule</title>
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-b from-amber-900/20 to-mbg py-6">
        <div className="container mx-auto px-4">
          <Link 
            to="/pazar" 
            className="inline-flex items-center gap-2 text-sti hover:text-amber-600 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">Bit Pazarı'na Dön</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white border border-cbg rounded-2xl overflow-hidden">
              <div className="relative h-80 md:h-[450px] bg-gradient-to-br from-amber-100 to-orange-100">
                {listing.imageUrl ? (
                  <img 
                    src={listing.imageUrl} 
                    alt={listing.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size={80} className="text-amber-300" />
                  </div>
                )}
                
                {/* Condition Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1.5 ${condition.color} text-white text-sm font-bold rounded-xl`}>
                  {condition.label}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white border border-cbg rounded-2xl p-6">
              <h2 className="text-lg font-black text-mtf uppercase tracking-tight mb-4 flex items-center gap-2">
                <Package size={20} className="text-amber-500" />
                Ürün Detayları
              </h2>
              
              <div className="prose prose-sm max-w-none text-sti">
                <p className="whitespace-pre-wrap">{listing.description}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-cbg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-sti uppercase font-bold mb-1">Kategori</p>
                    <p className="font-bold text-mtf">{CATEGORY_LABELS[listing.category]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sti uppercase font-bold mb-1">Durum</p>
                    <p className="font-bold text-mtf">{condition.label}</p>
                    <p className="text-xs text-sti">{condition.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white border border-cbg rounded-2xl p-6">
              <div className="mb-4">
                <span className="text-3xl font-black text-amber-600">
                  {formatPrice(listing.price)}
                </span>
              </div>

              <h1 className="text-xl font-black text-mtf mb-2">{listing.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-sti mb-6">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(listing.createdAt)}
                </span>
              </div>

              {/* Actions */}
              {isOwner ? (
                <div className="space-y-3">
                  <Link
                    to={`/pazar/duzenle/${id}`}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
                  >
                    <Edit3 size={18} /> Düzenle
                  </Link>
                  <button
                    onClick={handleMarkAsSold}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle size={18} /> Satıldı Olarak İşaretle
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors"
                  >
                    <Trash2 size={18} /> İlanı Sil
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {showContact ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-xs text-amber-700 uppercase font-bold mb-2">İletişim Bilgisi</p>
                      <p className="text-mtf font-bold break-all">{listing.contactInfo}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.info('İletişim bilgisini görmek için giriş yapmalısın.');
                          navigate('/giris');
                          return;
                        }
                        setShowContact(true);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
                    >
                      <MessageSquare size={18} /> İletişime Geç
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Seller Card */}
            <div className="bg-white border border-cbg rounded-2xl p-6">
              <h3 className="text-sm font-black text-mtf uppercase tracking-tight mb-4 flex items-center gap-2">
                <User size={16} className="text-amber-500" />
                Satıcı
              </h3>

              <Link 
                to={`/profil/${listing.seller?.username}`}
                className="flex items-center gap-3 mb-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 overflow-hidden">
                  {listing.seller?.avatarUrl ? (
                    <img src={listing.seller.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-600 font-black">
                      {listing.seller?.displayName?.charAt(0) || listing.seller?.username?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-mtf group-hover:text-amber-600 transition-colors">
                    {listing.seller?.displayName || listing.seller?.username}
                  </p>
                  <p className="text-xs text-sti">@{listing.seller?.username}</p>
                </div>
              </Link>

              {/* Trust Score */}
              {sellerTrust && (
                <div className="pt-4 border-t border-cbg space-y-3">
                  <h4 className="text-xs font-black text-sti uppercase">Güvenilirlik</h4>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <Shield size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-mtf">{sellerTrust.accountAgeMonths} ay</p>
                      <p className="text-xs text-sti">Üyelik Süresi</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <CheckCircle size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-mtf">{sellerTrust.successfulSales} satış</p>
                      <p className="text-xs text-sti">Başarılı İşlem</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Star size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-mtf">{sellerTrust.totalContentEntries} içerik</p>
                      <p className="text-xs text-sti">Topluluk Katkısı</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h4 className="text-sm font-black text-amber-800 flex items-center gap-2 mb-3">
                <AlertCircle size={16} />
                Güvenli Alışveriş
              </h4>
              <ul className="text-xs text-amber-700 space-y-2">
                <li>• Ödemeyi ürünü teslim aldıktan sonra yapın</li>
                <li>• Yüz yüze görüşmelerde güvenli yerler tercih edin</li>
                <li>• Şüpheli durumları bize bildirin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
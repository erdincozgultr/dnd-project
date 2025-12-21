// src/pages/CreateListingPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { 
  ShoppingBag, ArrowLeft, Save, Loader2, AlertCircle, 
  Trash2, Image, Tag, Package, DollarSign, Phone
} from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

const CATEGORIES = [
  { value: 'DICE', label: 'Zar Setleri' },
  { value: 'MINIATURE', label: 'Minyatürler' },
  { value: 'RULEBOOK', label: 'Kural Kitapları' },
  { value: 'BOARD_GAME', label: 'Kutu Oyunları' },
  { value: 'ACCESSORY', label: 'Aksesuarlar' },
  { value: 'OTHER', label: 'Diğer' },
];

const CONDITIONS = [
  { value: 'NEW', label: 'Sıfır', desc: 'Hiç kullanılmamış, ambalajında' },
  { value: 'USED_LIKE_NEW', label: 'Sıfır Gibi', desc: 'Çok az kullanılmış, kusursuz' },
  { value: 'USED_GOOD', label: 'İyi Durumda', desc: 'Normal kullanım izleri var' },
  { value: 'USED_FAIR', label: 'Kullanılmış', desc: 'Belirgin kullanım izleri var' },
];

const CreateListingPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: 'OTHER',
      condition: 'USED_GOOD',
      contactInfo: '',
      imageUrl: '',
    }
  });

  const watchedCategory = watch('category');
  const watchedCondition = watch('condition');

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('İlan vermek için giriş yapmalısın.');
      navigate('/giris');
    }
  }, [isAuthenticated, navigate]);

  // Load listing for edit
  useEffect(() => {
    if (isEditMode && id) {
      sendRequest({
        url: `/marketplace/${id}`,
        method: METHODS.GET,
        callbackSuccess: (res) => {
          if (res.data.seller?.username !== user?.username) {
            toast.error('Bu ilanı düzenleme yetkiniz yok.');
            navigate('/pazar');
            return;
          }
          reset({
            title: res.data.title || '',
            description: res.data.description || '',
            price: res.data.price || '',
            category: res.data.category || 'OTHER',
            condition: res.data.condition || 'USED_GOOD',
            contactInfo: res.data.contactInfo || '',
            imageUrl: res.data.imageUrl || '',
          });
          setInitialLoading(false);
        },
        callbackError: () => {
          toast.error('İlan bulunamadı.');
          navigate('/pazar');
        }
      });
    }
  }, [isEditMode, id, user]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      price: parseFloat(data.price),
    };

    if (isEditMode) {
      sendRequest({
        url: `/marketplace/${id}`,
        method: METHODS.PATCH,
        data: payload,
        callbackSuccess: () => {
          toast.success('İlan güncellendi!');
          navigate(`/pazar/${id}`);
        }
      });
    } else {
      sendRequest({
        url: '/marketplace',
        method: METHODS.POST,
        data: payload,
        callbackSuccess: (res) => {
          toast.success('İlan oluşturuldu!');
          navigate(`/pazar/${res.data.id}`);
        }
      });
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet>
        <title>{isEditMode ? 'İlanı Düzenle' : 'İlan Ver'} | Bit Pazarı | Zar & Kule</title>
      </Helmet>

      {/* Header */}
      <div className="relative py-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://i.pinimg.com/736x/2d/3c/4e/2d3c4e5f6a7b8c9d0e1f2a3b4c5d6e7f.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/90 via-amber-900/80 to-mbg" />
        
        <div className="container mx-auto px-4 relative z-10">
          <button 
            onClick={() => navigate('/pazar')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-bold">Bit Pazarı'na Dön</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <ShoppingBag size={32} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                {isEditMode ? 'İlanı Düzenle' : 'İlan Ver'}
              </h1>
              <p className="text-white/60 mt-1">
                {isEditMode ? 'İlan bilgilerini güncelle' : 'Ürününü topluluğa sun'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
          {/* Basic Info */}
          <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-6">
              <Tag size={20} className="text-amber-500" />
              Ürün Bilgileri
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Başlık *
                </label>
                <input
                  {...register('title', { 
                    required: 'Başlık gerekli',
                    minLength: { value: 5, message: 'En az 5 karakter' },
                    maxLength: { value: 100, message: 'En fazla 100 karakter' }
                  })}
                  placeholder="Örn: Chessex Polyhedral Zar Seti, Player's Handbook 5e..."
                  className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Açıklama *
                </label>
                <textarea
                  {...register('description', { 
                    required: 'Açıklama gerekli',
                    minLength: { value: 20, message: 'En az 20 karakter' }
                  })}
                  rows={5}
                  placeholder="Ürününüzü detaylı tanımlayın. Ne kadar kullanıldı? Eksik parça var mı? Neden satıyorsunuz?"
                  className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.description.message}
                  </p>
                )}
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                    Kategori *
                  </label>
                  <select
                    {...register('category', { required: 'Kategori seçin' })}
                    className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-amber-500 outline-none appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                    Ürün Durumu *
                  </label>
                  <select
                    {...register('condition', { required: 'Durum seçin' })}
                    className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-amber-500 outline-none appearance-none cursor-pointer"
                  >
                    {CONDITIONS.map(cond => (
                      <option key={cond.value} value={cond.value}>{cond.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-sti mt-1">
                    {CONDITIONS.find(c => c.value === watchedCondition)?.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price & Contact */}
          <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-6">
              <DollarSign size={20} className="text-amber-500" />
              Fiyat & İletişim
            </h2>

            <div className="space-y-5">
              {/* Price */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Fiyat (₺) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sti font-bold">₺</span>
                  <input
                    {...register('price', { 
                      required: 'Fiyat gerekli',
                      min: { value: 0, message: 'Fiyat 0 veya üzeri olmalı' }
                    })}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full p-4 pl-10 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.price.message}
                  </p>
                )}
                <p className="text-xs text-sti mt-1">
                  Takas için 0 yazabilirsiniz
                </p>
              </div>

              {/* Contact Info */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  İletişim Bilgisi *
                </label>
                <input
                  {...register('contactInfo', { 
                    required: 'İletişim bilgisi gerekli'
                  })}
                  placeholder="Telefon, Email, Discord, Instagram..."
                  className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                />
                {errors.contactInfo && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.contactInfo.message}
                  </p>
                )}
                <p className="text-xs text-sti mt-1">
                  Sadece giriş yapmış kullanıcılar görebilir
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-6">
              <Image size={20} className="text-amber-500" />
              Görsel (Opsiyonel)
            </h2>

            <div>
              <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                Görsel URL'si
              </label>
              <input
                {...register('imageUrl')}
                placeholder="https://example.com/image.jpg"
                className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
              />
              <p className="text-xs text-sti mt-1">
                Imgur, Discord CDN veya başka bir görsel hosting servisi kullanabilirsiniz
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/pazar')}
              className="px-6 py-3 border border-cbg text-sti hover:text-mtf hover:border-mtf rounded-xl font-bold transition-colors"
            >
              İptal
            </button>
            
            <button
              type="submit"
              disabled={loading || (!isDirty && isEditMode)}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
                ${loading || (!isDirty && isEditMode)
                  ? 'bg-cbg text-sti cursor-not-allowed'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30'}
              `}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isEditMode ? 'Güncelle' : 'İlanı Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
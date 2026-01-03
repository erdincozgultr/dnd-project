// src/pages/CreateCampaignPage.jsx - TAMAMEN YENİDEN
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { 
  Swords, MapPin, Monitor, ChevronRight, Dices, Users, Clock,
  Globe, Save, Loader2, ArrowLeft, Trash2, AlertCircle, Link as LinkIcon
} from 'lucide-react';

import useAxios, { METHODS } from '../hooks/useAxios';
import { SYSTEMS, PLATFORMS, FREQUENCIES } from '../constants/gameEnums';

const CreateCampaignPage = () => {
  const { id } = useParams(); // Edit mode için
  const isEditMode = Boolean(id);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  
  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors, isDirty },
    setValue,
    reset
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      system: 'DND_5E',
      platform: 'DISCORD',
      frequency: 'WEEKLY',
      maxPlayers: 4,
      levelRange: '',
      city: '',
      district: '',
      virtualTableLink: '',
    }
  });

  const selectedPlatform = useWatch({ control, name: 'platform' });
  const isFaceToFace = selectedPlatform === 'FACE_TO_FACE';

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Bu sayfaya erişmek için giriş yapmalısın.');
      navigate('/giris');
    }
  }, [isAuthenticated, navigate]);

  // Load campaign data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      sendRequest({
        url: `/campaigns/${id}`,
        method: METHODS.GET,
        callbackSuccess: (res) => {
          const campaign = res.data;
          reset({
            title: campaign.title || '',
            description: campaign.description || '',
            system: campaign.system || 'DND_5E',
            platform: campaign.platform || 'DISCORD',
            frequency: campaign.frequency || 'WEEKLY',
            maxPlayers: campaign.maxPlayers || 4,
            levelRange: campaign.levelRange || '',
            city: campaign.city || '',
            district: campaign.district || '',
            virtualTableLink: campaign.virtualTableLink || '',
          });
          setInitialLoading(false);
        },
        callbackError: () => {
          toast.error('Kampanya bulunamadı.');
          navigate('/parti-bul');
        }
      });
    }
  }, [isEditMode, id, reset, navigate]);

  // Clear irrelevant fields when platform changes
  useEffect(() => {
    if (isFaceToFace) {
      setValue('virtualTableLink', '');
    } else {
      setValue('city', '');
      setValue('district', '');
    }
  }, [isFaceToFace, setValue]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      maxPlayers: parseInt(data.maxPlayers),
    };

    if (isEditMode) {
      // Update
      sendRequest({
        url: `/campaigns/${id}`,
        method: METHODS.PATCH,
        data: payload,
        callbackSuccess: () => {
          toast.success('Masa güncellendi!');
          navigate('/parti-bul');
        }
      });
    } else {
      // Create
      sendRequest({
        url: '/campaigns',
        method: METHODS.POST,
        data: payload,
        callbackSuccess: () => {
          toast.success('Masa kuruldu! Maceracılar bekleniyor...');
          navigate('/parti-bul');
        }
      });
    }
  };

  const handleDelete = () => {
    if (!window.confirm('Bu masayı silmek istediğine emin misin? Bu işlem geri alınamaz!')) return;
    
    sendRequest({
      url: `/campaigns/${id}`,
      method: METHODS.DELETE,
      callbackSuccess: () => {
        toast.success('Masa silindi.');
        navigate('/parti-bul');
      }
    });
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 className="animate-spin text-cta" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet>
        <title>{isEditMode ? 'Masayı Düzenle' : 'Yeni Masa Kur'} | Zar & Kule</title>
      </Helmet>

      {/* Hero Header */}
      <div className="relative py-12 overflow-hidden bg-mtf">
        <div className="absolute inset-0" />
        
        <div className="container mx-auto px-4 relative z-10 ">
          <button 
            onClick={() => navigate('/parti-bul')}
            className="flex items-center gap-2 text-cbg hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-bold">Parti Bul'a Dön</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cta/20 border border-cta/30 flex items-center justify-center">
              <Dices size={32} className="text-cta" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                {isEditMode ? 'Masayı Düzenle' : 'Yeni Masa Kur'}
              </h1>
              <p className="text-white/60 mt-1">
                {isEditMode ? 'Masa bilgilerini güncelle' : 'DM olarak masanı kur, kurallarını belirle ve ekibini topla'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
          
          {/* Section 1: Temel Bilgiler */}
          <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-6">
              <Swords size={20} className="text-cta" />
              Temel Bilgiler
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Masa Başlığı *
                </label>
                <input
                  {...register('title', { 
                    required: 'Başlık gerekli',
                    minLength: { value: 5, message: 'En az 5 karakter' },
                    maxLength: { value: 100, message: 'En fazla 100 karakter' }
                  })}
                  placeholder="Örn: Curse of Strahd - Yeni Başlayanlar İçin"
                  className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
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
                  rows={4}
                  placeholder="Kampanyanı tanıt. Ne tür bir macera? Hangi tonda? Oyunculardan beklentilerin neler?"
                  className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.description.message}
                  </p>
                )}
              </div>

              {/* System & Level Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                    Oyun Sistemi *
                  </label>
                  <select
                    {...register('system', { required: 'Sistem seçilmeli' })}
                    className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta outline-none appearance-none cursor-pointer"
                  >
                    {Object.entries(SYSTEMS).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                    Seviye Aralığı
                  </label>
                  <input
                    {...register('levelRange')}
                    placeholder="Örn: 1-5 veya 'Yeni Başlayanlar'"
                    className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-cta outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Platform & Sıklık */}
          <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-6">
              <Monitor size={20} className="text-cta" />
              Platform & Zamanlama
            </h2>

            <div className="space-y-5">
              {/* Platform Selection */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-3">
                  Oyun Platformu *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(PLATFORMS).map(([key, value]) => (
                    <label
                      key={key}
                      className={`
                        flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${selectedPlatform === key 
                          ? 'border-cta bg-cta/5' 
                          : 'border-cbg hover:border-cta/50'}
                      `}
                    >
                      <input
                        type="radio"
                        {...register('platform')}
                        value={key}
                        className="sr-only"
                      />
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedPlatform === key ? 'border-cta' : 'border-cbg'
                      }`}>
                        {selectedPlatform === key && (
                          <span className="w-2 h-2 bg-cta rounded-full" />
                        )}
                      </span>
                      <span className={`font-bold text-sm ${selectedPlatform === key ? 'text-cta' : 'text-mtf'}`}>
                        {value}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frequency & Max Players */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                    <Clock size={12} className="inline mr-1" />
                    Oyun Sıklığı *
                  </label>
                  <select
                    {...register('frequency', { required: true })}
                    className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta outline-none appearance-none cursor-pointer"
                  >
                    {Object.entries(FREQUENCIES).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                    <Users size={12} className="inline mr-1" />
                    Maksimum Oyuncu *
                  </label>
                  <select
                    {...register('maxPlayers', { required: true })}
                    className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta outline-none appearance-none cursor-pointer"
                  >
                    {[2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} Oyuncu</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditional Fields */}
              {isFaceToFace ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 text-sm font-bold mb-3 flex items-center gap-2">
                    <MapPin size={16} />
                    Yüz Yüze Oyun - Konum Bilgileri
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-green-700 uppercase tracking-wider mb-2">
                        Şehir
                      </label>
                      <input
                        {...register('city')}
                        placeholder="İstanbul"
                        className="w-full p-3 bg-white border border-green-200 rounded-xl text-mtf font-medium focus:border-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-green-700 uppercase tracking-wider mb-2">
                        İlçe
                      </label>
                      <input
                        {...register('district')}
                        placeholder="Kadıköy"
                        className="w-full p-3 bg-white border border-green-200 rounded-xl text-mtf font-medium focus:border-green-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-700 text-sm font-bold mb-3 flex items-center gap-2">
                    <Globe size={16} />
                    Online Oyun - Platform Linki
                  </p>
                  <div>
                    <label className="block text-[10px] font-black text-blue-700 uppercase tracking-wider mb-2">
                      <LinkIcon size={12} className="inline mr-1" />
                      Oyun Linki (Opsiyonel)
                    </label>
                    <input
                      {...register('virtualTableLink')}
                      placeholder="https://discord.gg/... veya Roll20 linki"
                      className="w-full p-3 bg-white border border-blue-200 rounded-xl text-mtf font-medium focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-6 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors order-2 sm:order-1"
              >
                <Trash2 size={18} />
                Masayı Sil
              </button>
            )}
            
            <div className={`flex gap-3 ${isEditMode ? 'order-1 sm:order-2' : 'w-full sm:w-auto'}`}>
              <button
                type="button"
                onClick={() => navigate('/parti-bul')}
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
                    : 'bg-cta text-white hover:bg-cta-hover shadow-lg shadow-cta/30 hover:shadow-cta/50'}
                `}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isEditMode ? 'Güncelle' : 'Masayı Kur'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
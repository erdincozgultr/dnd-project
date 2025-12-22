// src/pages/CreateVenuePage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { 
  MapPinned, ArrowLeft, Save, Loader2, AlertCircle, 
  MapPin, Phone, Globe, Instagram, Navigation, Coffee,
  Store, Users, BookOpen, Package, Info
} from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

const VENUE_TYPES = [
  { value: 'CAFE', label: 'Kafe', icon: <Coffee size={20} />, desc: 'Kahve ve içecek sunan mekanlar' },
  { value: 'GAME_STORE', label: 'Oyun Mağazası', icon: <Store size={20} />, desc: 'Masa oyunları satan ve oynatan mekanlar' },
  { value: 'COMMUNITY_CENTER', label: 'Topluluk Merkezi', icon: <Users size={20} />, desc: 'Dernek, kulüp veya topluluk mekanları' },
  { value: 'LIBRARY', label: 'Kütüphane', icon: <BookOpen size={20} />, desc: 'Oyun odası olan kütüphaneler' },
  { value: 'OTHER', label: 'Diğer', icon: <Package size={20} />, desc: 'Diğer mekan türleri' },
];

const CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

const CreateVenuePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  const [gettingLocation, setGettingLocation] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      type: 'CAFE',
      address: '',
      city: 'İstanbul',
      district: '',
      latitude: 0,
      longitude: 0,
      phone: '',
      website: '',
      instagramHandle: '',
    }
  });

  const watchedType = watch('type');
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Mekan eklemek için giriş yapmalısın.');
      navigate('/giris');
    }
  }, [isAuthenticated, navigate]);

  // Konum al
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Tarayıcınız konum özelliğini desteklemiyor.');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', position.coords.latitude);
        setValue('longitude', position.coords.longitude);
        toast.success('Konum alındı!');
        setGettingLocation(false);
      },
      (error) => {
        toast.error('Konum alınamadı. Lütfen izin verin.');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const onSubmit = (data) => {
    // Validate coordinates
    if (!data.latitude || !data.longitude) {
      toast.warning('Lütfen mekanın konumunu belirtin.');
      return;
    }

    sendRequest({
      url: '/venues',
      method: METHODS.POST,
      data: {
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      },
      callbackSuccess: (res) => {
        toast.success('Mekan başarıyla eklendi! Onay sürecinden sonra yayınlanacak.');
        navigate('/mekanlar');
      }
    });
  };

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet>
        <title>Mekan Ekle | Dost Mekanlar | Zar & Kule</title>
      </Helmet>

      {/* Header */}
      <div className="relative py-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://i.pinimg.com/736x/a8/b2/c4/a8b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-emerald-900/80 to-mbg" />
        
        <div className="container mx-auto px-4 relative z-10">
          <button 
            onClick={() => navigate('/mekanlar')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-bold">Mekanlara Dön</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <MapPinned size={32} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Mekan Ekle</h1>
              <p className="text-white/60 mt-1">D&D topluluğuna yeni bir mekan tanıt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
          
          {/* Info Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <Info size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-800 font-bold text-sm">Onay Süreci</p>
              <p className="text-emerald-700 text-sm">
                Eklediğin mekan moderatör onayından sonra yayınlanacak. 
                Mekan sahibiysen, yayınlandıktan sonra sahiplik başvurusu yapabilirsin.
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-6">
              <MapPinned size={20} className="text-emerald-500" />
              Mekan Bilgileri
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Mekan Adı *
                </label>
                <input
                  {...register('name', { 
                    required: 'Mekan adı gerekli',
                    minLength: { value: 3, message: 'En az 3 karakter' },
                    maxLength: { value: 100, message: 'En fazla 100 karakter' }
                  })}
                  placeholder="Örn: Dice & Coffee, Oyun Evi..."
                  className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Mekan Türü *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {VENUE_TYPES.map((type) => (
                    <label
                      key={type.value}
                      className={`
                        flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${watchedType === type.value 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-cbg hover:border-emerald-300'}
                      `}
                    >
                      <input
                        type="radio"
                        {...register('type')}
                        value={type.value}
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${watchedType === type.value ? 'bg-emerald-500 text-white' : 'bg-cbg text-sti'}`}>
                        {type.icon}
                      </div>
                      <span className={`font-bold text-sm ${watchedType === type.value ? 'text-emerald-600' : 'text-mtf'}`}>
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Açıklama
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Mekan hakkında bilgi ver. Ortam nasıl? Masa oyunu oynama imkanı var mı? Etkinlik düzenleniyor mu?"
                  className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-6">
              <MapPin size={20} className="text-emerald-500" />
              Konum Bilgileri
            </h2>

            <div className="space-y-5">
              {/* City & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                    Şehir *
                  </label>
                  <select
                    {...register('city', { required: 'Şehir seçin' })}
                    className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-emerald-500 outline-none appearance-none cursor-pointer"
                  >
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                    İlçe
                  </label>
                  <input
                    {...register('district')}
                    placeholder="Örn: Kadıköy, Çankaya..."
                    className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Açık Adres
                </label>
                <input
                  {...register('address')}
                  placeholder="Mahalle, sokak, bina no..."
                  className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Coordinates */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Harita Konumu *
                </label>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      {...register('latitude', { required: 'Konum gerekli' })}
                      type="number"
                      step="any"
                      placeholder="Enlem"
                      className="p-4 bg-mbg border border-cbg rounded-xl text-mtf font-mono text-sm focus:border-emerald-500 outline-none"
                    />
                    <input
                      {...register('longitude', { required: 'Konum gerekli' })}
                      type="number"
                      step="any"
                      placeholder="Boylam"
                      className="p-4 bg-mbg border border-cbg rounded-xl text-mtf font-mono text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gettingLocation}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {gettingLocation ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Navigation size={18} />
                    )}
                    Konumumu Al
                  </button>
                </div>
                
                {(latitude > 0 || longitude > 0) && (
                  <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                    <MapPin size={12} /> Konum belirlendi
                  </p>
                )}
                {errors.latitude && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Konum gerekli
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-6">
              <Phone size={20} className="text-emerald-500" />
              İletişim Bilgileri (Opsiyonel)
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                    Telefon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-sti" size={18} />
                    <input
                      {...register('phone')}
                      placeholder="0212 123 45 67"
                      className="w-full p-4 pl-12 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                    Instagram
                  </label>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-sti" size={18} />
                    <input
                      {...register('instagramHandle')}
                      placeholder="@mekan_adi"
                      className="w-full p-4 pl-12 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-sti" size={18} />
                  <input
                    {...register('website')}
                    placeholder="https://www.mekan.com"
                    className="w-full p-4 pl-12 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/mekanlar')}
              className="px-6 py-3 border border-cbg text-sti hover:text-mtf hover:border-mtf rounded-xl font-bold transition-colors"
            >
              İptal
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
                ${loading
                  ? 'bg-cbg text-sti cursor-not-allowed'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30'}
              `}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Mekan Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVenuePage;
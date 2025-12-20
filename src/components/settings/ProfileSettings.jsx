// src/components/settings/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  User, Camera, Image, Save, Loader2, X, Upload
} from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';
import { updateUserSummary } from '../../redux/actions/authActions';

const ProfileSettings = ({ user }) => {
  const dispatch = useDispatch();
  const { sendRequest, loading } = useAxios();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [bannerPreview, setBannerPreview] = useState(user?.bannerUrl || null);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      title: user?.title || '',
      avatarUrl: user?.avatarUrl || '',
      bannerUrl: user?.bannerUrl || '',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || '',
        bio: user.bio || '',
        title: user.title || '',
        avatarUrl: user.avatarUrl || '',
        bannerUrl: user.bannerUrl || '',
      });
      setAvatarPreview(user.avatarUrl);
      setBannerPreview(user.bannerUrl);
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    sendRequest({
      url: '/users/me',
      method: METHODS.PATCH,
      data: {
        displayName: data.displayName,
        bio: data.bio,
        title: data.title,
        avatarUrl: data.avatarUrl,
        bannerUrl: data.bannerUrl,
      },
      callbackSuccess: (res) => {
        toast.success('Profil güncellendi!');
        dispatch(updateUserSummary(res.data));
      },
    });
  };

  const handleAvatarUrlChange = (e) => {
    const url = e.target.value;
    setAvatarPreview(url || null);
  };

  const handleBannerUrlChange = (e) => {
    const url = e.target.value;
    setBannerPreview(url || null);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-2">
          <User size={24} className="text-cta" />
          Profil Ayarları
        </h2>
        <p className="text-sti text-sm">Diğer maceracıların seni nasıl göreceğini düzenle</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Banner Preview & Input */}
        <div className="bg-white border border-cbg rounded-2xl overflow-hidden shadow-sm">
          <div className="relative h-40 bg-gradient-to-r from-pb to-purple-900">
            {bannerPreview ? (
              <img 
                src={bannerPreview} 
                alt="Banner" 
                className="w-full h-full object-cover"
                onError={() => setBannerPreview(null)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image size={40} className="text-white/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-bold">Aşağıdan URL girin</span>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                Banner Görsel URL
              </label>
              <input
                {...register('bannerUrl')}
                onChange={(e) => {
                  register('bannerUrl').onChange(e);
                  handleBannerUrlChange(e);
                }}
                placeholder="https://example.com/banner.jpg"
                className="w-full p-3 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
              />
              <p className="text-[10px] text-sti mt-1">Önerilen boyut: 1500x500 piksel</p>
            </div>
          </div>
        </div>

        {/* Avatar & Basic Info */}
        <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                Profil Fotoğrafı
              </label>
              <div className="relative w-32 h-32">
                <div className="w-full h-full rounded-2xl border-2 border-cbg overflow-hidden bg-gradient-to-br from-cta/20 to-purple-500/20">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      onError={() => setAvatarPreview(null)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={40} className="text-cta/50" />
                    </div>
                  )}
                </div>
              </div>
              <input
                {...register('avatarUrl')}
                onChange={(e) => {
                  register('avatarUrl').onChange(e);
                  handleAvatarUrlChange(e);
                }}
                placeholder="Avatar URL"
                className="w-32 mt-2 p-2 text-xs bg-mbg border border-cbg rounded-lg text-mtf focus:border-cta outline-none"
              />
            </div>

            {/* Info Fields */}
            <div className="flex-1 space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Görünen İsim
                </label>
                <input
                  {...register('displayName', { 
                    maxLength: { value: 50, message: 'En fazla 50 karakter' } 
                  })}
                  placeholder="Nasıl görünmek istiyorsun?"
                  className="w-full p-3 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
                />
                {errors.displayName && (
                  <p className="text-red-500 text-xs mt-1">{errors.displayName.message}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Unvan
                </label>
                <input
                  {...register('title', { 
                    maxLength: { value: 30, message: 'En fazla 30 karakter' } 
                  })}
                  placeholder="Örn: Dungeon Master, Bard, Savaşçı..."
                  className="w-full p-3 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                )}
                <p className="text-[10px] text-sti mt-1">Profilinde isminin yanında görünecek</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
          <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
            Hakkımda
          </label>
          <textarea
            {...register('bio', { 
              maxLength: { value: 500, message: 'En fazla 500 karakter' } 
            })}
            rows={4}
            placeholder="Kendinden bahset... Hangi sistemleri oynuyorsun? Ne tür bir maceracısın?"
            className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-all resize-none"
          />
          {errors.bio && (
            <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
          )}
          <p className="text-[10px] text-sti mt-1 text-right">
            {(user?.bio?.length || 0)} / 500 karakter
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !isDirty}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
              ${loading || !isDirty
                ? 'bg-cbg text-sti cursor-not-allowed'
                : 'bg-cta text-white hover:bg-cta-hover shadow-lg shadow-cta/30 hover:shadow-cta/50'}
            `}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
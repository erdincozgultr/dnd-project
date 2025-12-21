// src/pages/CreateGuildPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { 
  Shield, ArrowLeft, Save, Loader2, AlertCircle, Trash2, Sparkles
} from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

const CreateGuildPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      name: '',
      description: '',
    }
  });

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Bu sayfaya erişmek için giriş yapmalısın.');
      navigate('/giris');
    }
  }, [isAuthenticated, navigate]);

  // Load guild data for edit
  useEffect(() => {
    if (isEditMode && id) {
      sendRequest({
        url: `/guilds/${id}`,
        method: METHODS.GET,
        callbackSuccess: (res) => {
          // Verify ownership
          if (res.data.leader?.username !== user?.username) {
            toast.error('Bu loncayı düzenleme yetkiniz yok.');
            navigate('/taverna/loncalar');
            return;
          }
          reset({
            name: res.data.name || '',
            description: res.data.description || '',
          });
          setInitialLoading(false);
        },
        callbackError: () => {
          toast.error('Lonca bulunamadı.');
          navigate('/taverna/loncalar');
        }
      });
    }
  }, [isEditMode, id, user]);

  const onSubmit = (data) => {
    if (isEditMode) {
      sendRequest({
        url: `/guilds/${id}`,
        method: METHODS.PUT,
        data,
        callbackSuccess: () => {
          toast.success('Lonca güncellendi!');
          navigate(`/taverna/loncalar/${id}`);
        }
      });
    } else {
      sendRequest({
        url: '/guilds',
        method: METHODS.POST,
        data,
        callbackSuccess: (res) => {
          toast.success('Lonca kuruldu!');
          navigate(`/taverna/loncalar/${res.data.id}`);
        }
      });
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet>
        <title>{isEditMode ? 'Loncayı Düzenle' : 'Lonca Kur'} | Zar & Kule</title>
      </Helmet>

      {/* Header */}
      <div className="relative py-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://i.pinimg.com/736x/77/a0/66/77a066581f52577684ebf61a2c7327f2.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-900/80 to-mbg" />
        
        <div className="container mx-auto px-4 relative z-10">
          <button 
            onClick={() => navigate('/taverna/loncalar')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-bold">Loncalara Dön</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Shield size={32} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                {isEditMode ? 'Loncayı Düzenle' : 'Lonca Kur'}
              </h1>
              <p className="text-white/60 mt-1">
                {isEditMode ? 'Lonca bilgilerini güncelle' : 'Kendi loncanı kur ve maceracıları topla'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 -mt-6 relative z-20">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
          <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-6">
              <Sparkles size={20} className="text-purple-500" />
              Lonca Bilgileri
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Lonca Adı *
                </label>
                <input
                  {...register('name', { 
                    required: 'Lonca adı gerekli',
                    minLength: { value: 3, message: 'En az 3 karakter' },
                    maxLength: { value: 50, message: 'En fazla 50 karakter' }
                  })}
                  placeholder="Örn: Gece Muhafızları, Altın Şafak..."
                  className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-bold focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">
                  Açıklama
                </label>
                <textarea
                  {...register('description', { 
                    maxLength: { value: 500, message: 'En fazla 500 karakter' }
                  })}
                  rows={4}
                  placeholder="Loncanı tanıt. Ne tür maceracılar arıyorsunuz? Amacınız ne?"
                  className="w-full p-4 bg-mbg border border-cbg rounded-xl text-mtf font-medium focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          {!isEditMode && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-6">
              <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                <Shield size={18} />
                Lonca Liderliği
              </h3>
              <ul className="text-sm text-purple-600 space-y-1">
                <li>• Sen loncanın lideri olacaksın</li>
                <li>• Üyeleri yönetebilir ve loncayı düzenleyebilirsin</li>
                <li>• Lonca üyelerinin kazandığı XP'nin bir kısmı loncaya eklenir</li>
                <li>• Seviye atladıkça yeni özellikler açılır</li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/taverna/loncalar')}
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
                  : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/30'}
              `}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isEditMode ? 'Güncelle' : 'Loncayı Kur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGuildPage;
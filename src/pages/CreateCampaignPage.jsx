import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { 
  Swords, MapPin, Monitor, ChevronRight, Dices, Layers, AlertCircle 
} from 'lucide-react';

import useAxios, { METHODS } from '../hooks/useAxios';

// Sabitler
const SYSTEMS = {
  DND_5E: "D&D 5e",
  PATHFINDER: "Pathfinder",
  CALL_OF_CTHULHU: "Call of Cthulhu",
  VAMPIRE_THE_MASQUERADE: "Vampire: TM",
  OTHER: "Diğer"
};

const PLATFORMS = {
  FACE_TO_FACE: "Yüz Yüze",
  DISCORD: "Discord",
  ROLL20: "Roll20",
  FOUNDRY_VTT: "Foundry VTT",
  OTHER: "Diğer"
};

const FREQUENCIES = {
  ONE_SHOT: "One-Shot",
  WEEKLY: "Haftalık",
  BIWEEKLY: "2 Haftada Bir",
  MONTHLY: "Aylık",
  PLAY_BY_POST: "PBP",
  IRREGULAR: "Düzensiz"
};

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { sendRequest, loading } = useAxios();
  
  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors },
    setValue 
  } = useForm({
    defaultValues: {
      system: 'DND_5E',
      platform: 'DISCORD',
      frequency: 'WEEKLY',
      maxPlayers: 4
    }
  });

  // Seçilen platformu anlık izle
  const selectedPlatform = useWatch({ control, name: 'platform' });
  const isFaceToFace = selectedPlatform === 'FACE_TO_FACE';

  // Platform değişirse ilgili alanları temizle
  useEffect(() => {
    if (isFaceToFace) {
      setValue('virtualTableLink', '');
    } else {
      setValue('city', '');
      setValue('district', '');
    }
  }, [isFaceToFace, setValue]);

  const onSubmit = (data) => {
    sendRequest({
      url: '/campaigns',
      method: METHODS.POST,
      data: data,
      callbackSuccess: () => {
        toast.success("Masa kuruldu! Maceracılar bekleniyor...");
        navigate('/party-finder');
      }
    });
  };

  return (
    <div className="min-h-screen bg-mbg pb-20">
      <Helmet><title>Yeni Oyun Kur | Zar & Kule</title></Helmet>

      {/* Hero Header */}
      <div className="bg-pb py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
        <div className="container mx-auto max-w-3xl relative z-10 text-center">
          <Dices className="mx-auto text-cta mb-4" size={48} />
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Yeni Bir Maceraya Başla</h1>
          <p className="text-sti/80">DM olarak masanı kur, kurallarını belirle ve ekibini topla.</p>
        </div>
      </div>

      {/* Form Alanı */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="max-w-3xl mx-auto bg-white border border-cbg rounded-xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
            
            {/* 1. Oyun Detayları */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-mtf border-b border-cbg pb-2 flex items-center gap-2">
                <Layers size={20} className="text-cta" /> Oyun Detayları
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-sti uppercase mb-1 block">Oyun Başlığı</label>
                  <input 
                    type="text" 
                    {...register("title", { required: "Başlık zorunludur", minLength: { value: 5, message: "En az 5 karakter" } })}
                    className="w-full p-3 bg-mbg border border-cbg rounded-lg focus:border-cta outline-none text-mtf font-bold"
                    placeholder="Örn: Ejderhaların Şafağı"
                  />
                  {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
                </div>

                <div>
                  <label className="text-xs font-bold text-sti uppercase mb-1 block">Sistem</label>
                  <select {...register("system")} className="w-full p-3 bg-mbg border border-cbg rounded-lg focus:border-cta outline-none text-mtf">
                    {Object.entries(SYSTEMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-sti uppercase mb-1 block">Sıklık</label>
                  <select {...register("frequency")} className="w-full p-3 bg-mbg border border-cbg rounded-lg focus:border-cta outline-none text-mtf">
                    {Object.entries(FREQUENCIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-sti uppercase mb-1 block">Hikaye & Açıklama</label>
                <textarea 
                  rows="5"
                  {...register("description", { required: "Açıklama zorunludur" })}
                  className="w-full p-3 bg-mbg border border-cbg rounded-lg focus:border-cta outline-none text-mtf text-sm"
                  placeholder="Oyunun konusu, tonu ve beklentilerin..."
                ></textarea>
                {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
              </div>
            </div>

            {/* 2. Platform ve Lokasyon */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-mtf border-b border-cbg pb-2 flex items-center gap-2">
                {isFaceToFace ? <MapPin size={20} className="text-cta" /> : <Monitor size={20} className="text-cta" />} 
                Nerede Oynanacak?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-sti uppercase mb-1 block">Platform</label>
                  <select {...register("platform")} className="w-full p-3 bg-mbg border border-cbg rounded-lg focus:border-cta outline-none text-mtf">
                    {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>

                {isFaceToFace ? (
                  /* Yüz Yüze Alanları */
                  <>
                    <div>
                      <label className="text-xs font-bold text-sti uppercase mb-1 block">Şehir *</label>
                      <input 
                        type="text" 
                        {...register("city", { required: "Şehir zorunludur" })}
                        className="w-full p-3 bg-mbg border border-cbg rounded-lg focus:border-cta outline-none text-mtf"
                        placeholder="Örn: İstanbul"
                      />
                      {errors.city && <span className="text-xs text-red-500">{errors.city.message}</span>}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-sti uppercase mb-1 block">İlçe / Mekan *</label>
                      <input 
                        type="text" 
                        {...register("district", { required: "İlçe zorunludur" })}
                        className="w-full p-3 bg-mbg border border-cbg rounded-lg focus:border-cta outline-none text-mtf"
                        placeholder="Örn: Kadıköy"
                      />
                      {errors.district && <span className="text-xs text-red-500">{errors.district.message}</span>}
                    </div>
                  </>
                ) : (
                  /* Online Alanı */
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-sti uppercase mb-1 block">Davet Linki (Opsiyonel)</label>
                    <div className="flex items-center gap-2 bg-yellow-50 p-2 rounded-lg border border-yellow-100 mb-2">
                       <AlertCircle size={14} className="text-yellow-600 flex-shrink-0" />
                       <span className="text-[10px] text-yellow-700">Link sadece kabul edilen oyunculara gösterilir.</span>
                    </div>
                    <input 
                      type="url" 
                      {...register("virtualTableLink")}
                      className="w-full p-3 bg-mbg border border-cbg rounded-lg focus:border-cta outline-none text-mtf"
                      placeholder="https://roll20.net/join/..."
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 3. Oyuncu Kriterleri */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-mtf border-b border-cbg pb-2 flex items-center gap-2">
                <Swords size={20} className="text-cta" /> Oyuncu Kriterleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="text-xs font-bold text-sti uppercase mb-1 block">Kontenjan</label>
                   <input type="number" {...register("maxPlayers", { required: true, min: 1, max: 20 })} className="w-full p-3 bg-mbg border border-cbg rounded-lg focus:border-cta outline-none text-mtf" />
                </div>
                <div>
                   <label className="text-xs font-bold text-sti uppercase mb-1 block">Seviye Aralığı</label>
                   <input type="text" {...register("levelRange")} className="w-full p-3 bg-mbg border border-cbg rounded-lg focus:border-cta outline-none text-mtf" placeholder="Örn: 1-5" />
                </div>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-cta text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-cta/30 flex items-center justify-center gap-2 transition-all">
              {loading ? 'Oluşturuluyor...' : <>İlanı Yayınla <ChevronRight size={20} /></>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
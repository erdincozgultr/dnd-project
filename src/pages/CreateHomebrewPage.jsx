import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { Save, Feather, Image as ImageIcon, Layers, FileText, ChevronLeft } from 'lucide-react';
import { useSelector } from 'react-redux';

import useAxios, { METHODS } from '../hooks/useAxios';
import { REVERSE_CATEGORY_LABELS } from '../constants/wikiEnums';

const CreateHomebrewPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  
  const forkSource = searchParams.get('forkSource');
  const isWiki = searchParams.get('isWiki') === 'true'; 
  const editSlug = searchParams.get('edit');

  const [idToUpdate, setIdToUpdate] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Admin Kontrolü
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  useEffect(() => {
    // 1. FORK İŞLEMİ (Veriyi Taslak Olarak Çek)
    if (forkSource) {
      const fetchUrl = isWiki ? `/wiki/read/${forkSource}` : `/homebrews/read/${forkSource}`;
      sendRequest({
        url: fetchUrl,
        method: METHODS.GET,
        callbackSuccess: (res) => {
          // Formu doldur ama ID'yi boş bırak (Yeni kayıt olacak)
          reset({
            name: `${res.data.name || res.data.title} (Kopya)`, // İsim çakışmasını önlemek için
            description: res.data.description || res.data.content,
            excerpt: res.data.excerpt || "",
            category: res.data.category,
            imageUrl: res.data.imageUrl,
            requiredLevel: res.data.requiredLevel,
            rarity: res.data.rarity,
            tags: res.data.tags ? res.data.tags.join(', ') : '',
            status: "PENDING_APPROVAL"
          });
        }
      });
    } 
    // 2. DÜZENLEME (Edit)
    else if (editSlug) {
      sendRequest({
        url: `/homebrews/read/${editSlug}`,
        method: METHODS.GET,
        callbackSuccess: (res) => {
          setIdToUpdate(res.data.id);
          reset({
            ...res.data,
            tags: res.data.tags ? res.data.tags.join(', ') : ''
          });
        }
      });
    }
  }, [forkSource, editSlug, reset, isWiki, sendRequest]);

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t !== "") : [],
      status: "PENDING_APPROVAL"
    };

    // DÜZENLEME (PATCH)
    if (editSlug && idToUpdate) {
        sendRequest({
            url: `/homebrews/${idToUpdate}`,
            method: METHODS.PATCH,
            data: payload,
            callbackSuccess: (res) => {
                toast.success("Güncellendi (Onay bekleniyor).");
                navigate(`/homebrew/${res.data.slug}`);
            }
        });
    }
    // YENİ OLUŞTURMA & FORK (POST)
    // Fork işlemi de aslında "verileri doldurulmuş yeni bir oluşturma" işlemidir.
    else {
        sendRequest({
            url: '/homebrews',
            method: METHODS.POST,
            data: payload,
            callbackSuccess: () => {
                toast.success("Efsane kaydedildi. Onaydan sonra yayınlanacak.");
                navigate('/wiki');
            }
        });
    }
  };

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet><title>{editSlug ? 'Düzenle' : 'Oluştur'} | Zar & Kule</title></Helmet>

      <div className="bg-purple-950 py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <Feather size={48} className="mx-auto mb-4 text-purple-400" />
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
            {forkSource ? 'Efsaneyi Kopyala & Geliştir' : (editSlug ? 'Maceranı Düzenle' : 'Yeni Bir Efsane Yaz')}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-cbg rounded-2xl p-8 shadow-2xl space-y-10">
          
          <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1 text-[10px] font-black text-sti hover:text-mtf uppercase tracking-widest transition-all">
             <ChevronLeft size={14}/> Geri Dön
          </button>

          {/* Bölüm 1: Temel Nitelikler */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-mtf border-b border-cbg pb-2 flex items-center gap-2 uppercase tracking-widest">
                <Layers size={18} className="text-purple-600" /> Temel Nitelikler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-sti uppercase mb-2 ml-1">İsim / Başlık *</label>
                    <input 
                        {...register("name", { required: "İsim alanı boş olamaz." })} 
                        className="w-full p-3.5 bg-mbg border border-cbg rounded-xl focus:border-purple-500 outline-none font-bold text-mtf" 
                        placeholder="Örn: Kadim Ejderha Kılıcı"
                    />
                    {errors.name && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.name.message}</span>}
                </div>
                <div>
                    <label className="block text-[10px] font-black text-sti uppercase mb-2 ml-1">Kategori *</label>
                    <select 
                        {...register("category", { required: "Kategori belirtilmelidir." })} 
                        className="w-full p-3.5 bg-mbg border border-cbg rounded-xl focus:border-purple-500 outline-none font-bold text-mtf"
                    >
                        <option value="">Seçiniz...</option>
                        {Object.entries(REVERSE_CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-sti uppercase mb-2 ml-1">Nadirlik (Rarity)</label>
                    <input {...register("rarity")} className="w-full p-3.5 bg-mbg border border-cbg rounded-xl outline-none font-bold text-mtf" placeholder="Legendary, Rare, Common..." />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-sti uppercase mb-2 ml-1">Gerekli Seviye</label>
                    <input {...register("requiredLevel")} className="w-full p-3.5 bg-mbg border border-cbg rounded-xl outline-none font-bold text-mtf" placeholder="Örn: 5" />
                </div>
                
                {isAdmin && (
                    <div>
                        <label className="block text-[10px] font-black text-red-600 uppercase mb-2 ml-1">Custom Slug (Admin Only)</label>
                        <input {...register("customSlug")} className="w-full p-3.5 bg-red-50 border border-red-100 rounded-xl outline-none font-bold text-red-900" placeholder="ozel-slug" />
                    </div>
                )}
            </div>
          </div>

          {/* Bölüm 2: Medya ve Etiketler */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-mtf border-b border-cbg pb-2 flex items-center gap-2 uppercase tracking-widest">
                <ImageIcon size={18} className="text-purple-600" /> Medya & Keşif
            </h3>
            <div>
                <label className="block text-[10px] font-black text-sti uppercase mb-2 ml-1">Görsel URL</label>
                <input {...register("imageUrl")} className="w-full p-3.5 bg-mbg border border-cbg rounded-xl focus:border-purple-500 outline-none font-bold text-mtf shadow-inner" placeholder="https://..." />
            </div>
            <div>
                <label className="block text-[10px] font-black text-sti uppercase mb-2 ml-1">Etiketler (Virgül ile ayır)</label>
                <input {...register("tags")} className="w-full p-3.5 bg-mbg border border-cbg rounded-xl outline-none font-bold text-mtf shadow-inner" placeholder="ejderha, kılıç, ateş" />
            </div>
          </div>

          {/* Bölüm 3: İçerik */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-mtf border-b border-cbg pb-2 flex items-center gap-2 uppercase tracking-widest">
                <FileText size={18} className="text-purple-600" /> Detaylar & Kurallar
            </h3>
            <div>
                <label className="block text-[10px] font-black text-sti uppercase mb-2 ml-1">Kısa Özet</label>
                <input {...register("excerpt")} className="w-full p-3.5 bg-mbg border border-cbg rounded-xl outline-none font-bold text-mtf shadow-inner" placeholder="Kısaca bu nedir? (Max 255)" maxLength={255} />
            </div>
            <div>
                <label className="block text-[10px] font-black text-sti uppercase mb-2 ml-1">Açıklama / Kurallar *</label>
                <textarea 
                    {...register("description", { required: "Açıklama boş olamaz." })} 
                    rows="10" 
                    className="w-full p-4 bg-mbg border border-cbg rounded-xl focus:border-purple-500 outline-none font-medium text-slate-700 shadow-inner" 
                    placeholder="Tüm kurallar, hasar tipleri ve arka plan hikayesi..."
                ></textarea>
                {errors.description && <span className="text-[10px] text-red-500 font-bold ml-1">{errors.description.message}</span>}
            </div>
          </div>

          <div className="pt-6 border-t border-cbg">
             <button disabled={loading} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-xl shadow-2xl hover:bg-purple-700 shadow-purple-600/30 transition-all flex items-center justify-center gap-3">
                {loading ? 'Büyü Yazılıyor...' : <>{forkSource ? 'Kopyayı Kaydet' : (editSlug ? 'Güncelle' : 'Onaya Gönder')} <Save size={24}/></>}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHomebrewPage;
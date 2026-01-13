// src/pages/CreateHomebrewPage.jsx - FIXED EDIT MODE

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useParams, useLocation } from "react-router-dom";
import CategorySelector from "../components/homebrew/create/CategorySelector";
import HomebrewDisclaimer from "../components/homebrew/create/HomebrewDisclaimer";
import MarkdownEditor from "../components/homebrew/create/MarkdownEditor";

// Form imports
import SpellForm from "../components/homebrew/create/forms/SpellForm";
import MonsterForm from "../components/homebrew/create/forms/MonsterForm";
import RaceForm from "../components/homebrew/create/forms/RaceForm";
import ClassForm from "../components/homebrew/create/forms/ClassForm";
import BackgroundForm from "../components/homebrew/create/forms/BackgroundForm";
import FeatForm from "../components/homebrew/create/forms/FeatForm";
import MagicItemForm from "../components/homebrew/create/forms/MagicItemForm";
import WeaponForm from "../components/homebrew/create/forms/WeaponForm";
import ArmorForm from "../components/homebrew/create/forms/ArmorForm";
import ConditionForm from "../components/homebrew/create/forms/ConditionForm";
import PlaneForm from "../components/homebrew/create/forms/PlaneForm";

import useAxios, { METHODS } from "../hooks/useAxios";
import { getTemplate } from "../utils/homebrewTemplates";

const CreateHomebrewPage = () => {
  const navigate = useNavigate();
  const { sendRequest, loading } = useAxios();
  const { id } = useParams();
  const location = useLocation();
  
  const isEditMode = !!id;
  const homebrewFromState = location.state?.homebrew;

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState({});
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(!isEditMode);

  // ✅ FIX: Edit mode - state'den data yükle
  useEffect(() => {
    if (isEditMode && homebrewFromState) {
      setName(homebrewFromState.name || "");
      setDescription(homebrewFromState.description || "");
      setCategory(homebrewFromState.category || "");
      setImageUrl(homebrewFromState.imageUrl || "");
      setTags(homebrewFromState.tags?.join(", ") || "");
      setContent(homebrewFromState.content || {});
      setRulesAccepted(true); // Edit modda kurallar zaten kabul edilmiş
      setIsDataLoaded(true);
    } else if (isEditMode && !homebrewFromState) {
      // State'de data yoksa API'den çek
      sendRequest({
        url: `/homebrews/my-homebrews`,
        method: METHODS.GET,
        callbackSuccess: (res) => {
          const homebrew = res.data.find(h => h.id === parseInt(id));
          if (homebrew) {
            setName(homebrew.name || "");
            setDescription(homebrew.description || "");
            setCategory(homebrew.category || "");
            setImageUrl(homebrew.imageUrl || "");
            setTags(homebrew.tags?.join(", ") || "");
            setContent(homebrew.content || {});
            setRulesAccepted(true);
            setIsDataLoaded(true);
          } else {
            toast.error("Homebrew bulunamadı");
            navigate("/homebrews/me");
          }
        },
        callbackError: () => {
          toast.error("Veri yüklenemedi");
          navigate("/homebrews/me");
        }
      });
    }
  }, [isEditMode, id, homebrewFromState]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (!isEditMode || !content || Object.keys(content).length === 0) {
      setContent(getTemplate(newCategory));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rulesAccepted && !isEditMode) {
      toast.error("Lütfen kuralları okuyup kabul edin");
      return;
    }

    const payload = {
      name,
      description,
      category,
      content,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrl: imageUrl || null,
    };

    sendRequest({
      url: isEditMode ? `/homebrews/${id}` : "/homebrews",
      method: isEditMode ? METHODS.PUT : METHODS.POST,
      data: payload,
      callbackSuccess: () => {
        toast.success(
          isEditMode ? "✅ Güncellendi!" : "🎉 Homebrew oluşturuldu! Moderatör onayı bekliyor..."
        );
        navigate("/homebrews/me");
      },
    });
  };

  const renderCategoryForm = () => {
    if (!category) return null;

    switch (category) {
      case "SPELLS":
        return <SpellForm formData={content} onChange={setContent} />;

      case "MONSTERS":
        return <MonsterForm formData={content} onChange={setContent} />;

      case "RACES":
        return <RaceForm formData={content} onChange={setContent} />;

      case "CLASSES":
        return <ClassForm formData={content} onChange={setContent} />;

      case "BACKGROUND":
        return <BackgroundForm formData={content} onChange={setContent} />;

      case "FEATS":
        return <FeatForm formData={content} onChange={setContent} />;

      case "MAGIC_ITEM":
        return <MagicItemForm formData={content} onChange={setContent} />;

      case "WEAPON":
        return <WeaponForm formData={content} onChange={setContent} />;

      case "ARMOR":
        return <ArmorForm formData={content} onChange={setContent} />;

      case "CONDITIONS":
        return <ConditionForm formData={content} onChange={setContent} />;

      case "PLANES":
        return <PlaneForm formData={content} onChange={setContent} />;

      case "CUSTOM":
        return (
          <div className="space-y-4">
            <MarkdownEditor
              value={content.desc || ""}
              onChange={(e) => setContent({ ...content, desc: e.target.value })}
              label="Özel İçerik Açıklaması"
              required
            />
          </div>
        );

      default:
        return (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-700">
              ⚠️ Bilinmeyen kategori: {category}
            </p>
          </div>
        );
    }
  };

  // ✅ Loading state for edit mode
  if (isEditMode && !isDataLoaded) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-cta" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet>
        <title>
          {isEditMode ? "Homebrew Düzenle" : "Yeni Homebrew Oluştur"} | Zar & Kule
        </title>
      </Helmet>

      {/* Hero Header */}
      <div className="relative py-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/8f/0d/4e/8f0d4e4d7a7f5c3e9b2a1d4c5e6f7a8b.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-purple-900/70 to-mbg" />

        <div className="container mx-auto px-4 relative z-10">
          <button
            onClick={() => navigate("/homebrews/me")}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-bold">Geri Dön</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Sparkles size={32} className="text-purple-300" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                {isEditMode ? "Homebrew " : "Yeni Homebrew "}
                <span className="text-purple-300">
                  {isEditMode ? "Düzenle" : "Oluştur"}
                </span>
              </h1>
              <p className="text-white/70 mt-1">
                {isEditMode
                  ? "Homebrew içeriğini güncelle"
                  : "Kendi D&D içeriğini oluştur ve topluluğa katkıda bulun"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Disclaimer - Sadece yeni oluşturmada göster */}
            {!isEditMode && (
              <HomebrewDisclaimer
                onAccept={setRulesAccepted}
                accepted={rulesAccepted}
              />
            )}

            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl border-2 border-cbg p-6 space-y-6">
              <h2 className="text-xl font-black text-mtf">Temel Bilgiler</h2>

              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-mtf mb-2">
                  İçerik Adı *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Ateş Topu, Gölge Ejderhası"
                  className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                             focus:border-cta focus:outline-none transition-colors"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-mtf mb-2">
                  Kısa Açıklama *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Liste görünümünde gösterilecek kısa açıklama (max 1000 karakter)"
                  className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                             focus:border-cta focus:outline-none transition-colors resize-y"
                  rows={3}
                  required
                  maxLength={1000}
                />
                <p className="text-xs text-sti mt-1">
                  {description.length}/1000 karakter
                </p>
              </div>

              {/* Category */}
              <CategorySelector
                value={category}
                onChange={handleCategoryChange}
                disabled={isEditMode} // ✅ Edit modda kategori değiştirilemez
              />

              {/* Image URL */}
              <div>
                <label className="block text-sm font-bold text-mtf mb-2">
                  Resim URL (Opsiyonel)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                             focus:border-cta focus:outline-none transition-colors"
                />
                {imageUrl && (
                  <div className="mt-3">
                    <img
                      src={imageUrl}
                      alt="Önizleme"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-cbg"
                      onError={(e) => {
                        e.target.style.display = "none";
                        toast.error("Resim yüklenemedi. URL'yi kontrol edin.");
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-mtf mb-2">
                  Etiketler (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="ateş, hasar, alan (virgülle ayırın)"
                  className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                             focus:border-cta focus:outline-none transition-colors"
                />
                <p className="text-xs text-sti mt-1">
                  Aramada bulunmayı kolaylaştırmak için etiketler ekleyin
                </p>
              </div>
            </div>

            {/* Category Specific Form */}
            {category && (
              <div className="bg-white rounded-2xl border-2 border-cbg p-6">
                <h2 className="text-xl font-black text-mtf mb-6">
                  Detaylı Bilgiler
                </h2>
                {renderCategoryForm()}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-between gap-4 bg-white rounded-2xl border-2 border-cbg p-6">
              <button
                type="button"
                onClick={() => navigate("/homebrews/me")}
                className="px-6 py-3 rounded-xl font-bold text-sti hover:text-mtf 
                           border-2 border-cbg hover:border-mtf transition-colors"
              >
                İptal
              </button>

              <button
                type="submit"
                disabled={loading || !category || (!isEditMode && !rulesAccepted)}
                className="px-8 py-3 rounded-xl font-bold bg-cta text-white 
                           hover:bg-cta/90 transition-colors flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {isEditMode ? "Güncelleniyor..." : "Oluşturuluyor..."}
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    {isEditMode ? "Güncelle" : "Homebrew Oluştur"}
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                {isEditMode ? (
                  <>
                    ℹ️ Değişiklikler kaydedildiğinde içeriğin durumu{" "}
                    <strong>PENDING_APPROVAL</strong> olarak değişecek ve tekrar
                    moderatör onayından geçecektir.
                  </>
                ) : (
                  <>
                    ℹ️ Oluşturduğunuz homebrew içerik{" "}
                    <strong>PENDING_APPROVAL</strong> statüsünde kaydedilecek ve
                    moderatör onayından sonra yayınlanacaktır. Durum değişiklikleri
                    hakkında bildirim alacaksınız.
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHomebrewPage;
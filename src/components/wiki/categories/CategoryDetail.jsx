// src/components/wiki/categories/CategoryDetail.jsx

import React from "react";
import { AlertCircle } from "lucide-react";

import ArmorDetail from "./ArmorDetail";
import WeaponDetail from "./WeaponDetail";
import SpellDetail from "./SpellDetail";
import MonsterDetail from "./MonsterDetail";
import RaceDetail from "./RaceDetail";
import ClassDetail from "./ClassDetail";
import BackgroundDetail from "./BackgroundDetail";
import FeatDetail from "./FeatDetail";
import ConditionDetail from "./ConditionDetail";
import PlaneDetail from "./PlaneDetail";
import MagicItemDetail from "./MagicItemDetail";
import SpellListDetail from "./SpellListDetail";

/**
 * Kategori bazlı detay router component
 *
 * Artık sadece turkishContent (data) kullanılıyor
 * metadata kaldırıldı - sadece backend'de referans için tutuluyor
 *
 * @param {string} category - Wiki kategorisi (ARMOR, WEAPON, etc.)
 * @param {Object} turkishContent - Türkçe içerik verisi (JSON)
 */
const CategoryDetail = ({ category, turkishContent }) => {
  // Data yoksa uyarı göster
  if (!turkishContent) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
        <p className="text-sti font-bold">İçerik bulunamadı</p>
        <p className="text-xs text-sti mt-1">
          Bu kayıt için detaylı veri mevcut değil.
        </p>
      </div>
    );
  }

  // Kategori bazlı component seçimi
  const renderDetail = () => {
    switch (category) {
      case "ARMOR":
        return <ArmorDetail data={turkishContent} />;

      case "WEAPON":
        return <WeaponDetail data={turkishContent} />;

      case "SPELLS":
        return <SpellDetail data={turkishContent} />;

      case "MONSTERS":
        return <MonsterDetail data={turkishContent} />;

      case "RACES":
        return <RaceDetail data={turkishContent} />;

      case "CLASSES":
        return <ClassDetail data={turkishContent} />;

      case "BACKGROUND":
        return <BackgroundDetail data={turkishContent} />;

      case "FEATS":
        return <FeatDetail data={turkishContent} />;

      case "CONDITIONS":
        return <ConditionDetail data={turkishContent} />;

      case "PLANES":
        return <PlaneDetail data={turkishContent} />;

      case "MAGIC_ITEM":
        return <MagicItemDetail data={turkishContent} />;

      case "SPELL_LIST":
        return <SpellListDetail data={turkishContent} />;

      default:
        // Bilinmeyen kategori için generic görünüm
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-700 font-bold">
                Bilinmeyen kategori: {category}
              </p>
            </div>

            {/* JSON olarak göster */}
            <div className="bg-slate-50 rounded-xl p-4 overflow-x-auto">
              <pre className="text-xs text-slate-600">
                {JSON.stringify(turkishContent, null, 2)}
              </pre>
            </div>
          </div>
        );
    }
  };

  return renderDetail();
};

export default CategoryDetail;

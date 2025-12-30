// src/components/wiki/categories/index.jsx

import ArmorDetail from './ArmorDetail';
import WeaponDetail from './WeaponDetail';
import RaceDetail from './RaceDetail';
import BackgroundDetail from './BackgroundDetail';
import PlaneDetail from './PlaneDetail';
import FeatDetail from './FeatDetail';
import MagicItemDetail from './MagicItemDetail';
import ConditionDetail from './ConditionDetail';
import ClassDetail from './ClassDetail';
import SpellListDetail from './SpellListDetail';
import MonsterDetail from './MonsterDetail';
import SpellDetail from './SpellDetail';

import { WIKI_CATEGORIES } from '../../../constants/wikiConstants';

/**
 * Kategori bazlı component mapping
 * Yeni kategori eklendiğinde buraya eklenir
 */
const CATEGORY_COMPONENTS = {
  [WIKI_CATEGORIES.ARMOR]: ArmorDetail,
  [WIKI_CATEGORIES.WEAPON]: WeaponDetail,
  [WIKI_CATEGORIES.RACES]: RaceDetail,
  [WIKI_CATEGORIES.BACKGROUND]: BackgroundDetail,
  [WIKI_CATEGORIES.PLANES]: PlaneDetail,
  [WIKI_CATEGORIES.FEATS]: FeatDetail,
  [WIKI_CATEGORIES.MAGIC_ITEM]: MagicItemDetail,
  [WIKI_CATEGORIES.CONDITIONS]: ConditionDetail,
  [WIKI_CATEGORIES.CLASSES]: ClassDetail,
  [WIKI_CATEGORIES.SPELL_LIST]: SpellListDetail,
  [WIKI_CATEGORIES.MONSTERS]: MonsterDetail,
  [WIKI_CATEGORIES.SPELLS]: SpellDetail,
};

/**
 * Fallback component - kategori bulunamazsa
 */
const DefaultDetail = ({ metadata, turkishContent }) => {
  const data = turkishContent || metadata || {};
  
  return (
    <div className="bg-white border border-cbg rounded-xl p-6">
      <p className="text-sm text-sti mb-4">
        Bu kategori için özel görünüm henüz eklenmedi.
      </p>
      {data.desc && (
        <div>
          <p className="text-[10px] font-bold text-sti uppercase mb-2">Açıklama</p>
          <p className="text-sm text-mtf leading-relaxed">{data.desc}</p>
        </div>
      )}
      {/* Ham veriyi göster (debug için) */}
      <details className="mt-4">
        <summary className="text-xs text-sti cursor-pointer">Ham Veri</summary>
        <pre className="mt-2 p-3 bg-slate-100 rounded-lg text-xs overflow-auto max-h-60">
          {JSON.stringify({ metadata, turkishContent }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

/**
 * Kategoriye göre doğru componenti döndürür
 * @param {string} category - Backend'den gelen kategori (ARMOR, WEAPON, etc.)
 * @returns {React.Component} Kategori componenti
 */
export const getCategoryComponent = (category) => {
  return CATEGORY_COMPONENTS[category] || DefaultDetail;
};

/**
 * Kategori detayını render eden wrapper
 */
export const CategoryDetail = ({ category, metadata, turkishContent }) => {
  const Component = getCategoryComponent(category);
  return <Component metadata={metadata} turkishContent={turkishContent} />;
};

export {
  ArmorDetail,
  WeaponDetail,
  RaceDetail,
  BackgroundDetail,
  PlaneDetail,
  FeatDetail,
  MagicItemDetail,
  ConditionDetail,
  ClassDetail,
  SpellListDetail,
  MonsterDetail,
  SpellDetail,
  DefaultDetail
};
// src/constants/wikiConstants

import { 
  Shield, Sword, Sparkles, Skull, Gem, Zap, 
  Scroll, Users, AlertCircle, Globe 
} from 'lucide-react';

/**
 * Backend ContentCategory enum ile birebir eşleşmeli
 */
export const WIKI_CATEGORIES = {
  ARMOR: 'ARMOR',
  WEAPON: 'WEAPON',
  SPELLS: 'SPELLS',
  MONSTERS: 'MONSTERS',
  MAGIC_ITEM: 'MAGIC_ITEM',
  FEATS: 'FEATS',
  BACKGROUND: 'BACKGROUND',
  RACES: 'RACES',
  CONDITIONS: 'CONDITIONS',
  PLANES: 'PLANES'
};

/**
 * Kategori konfigürasyonları
 * - label: Türkçe isim
 * - icon: Lucide icon componenti
 * - color: Tailwind renk adı
 * - defaultImage: public/wiki/ altındaki dosya
 */
export const CATEGORY_CONFIG = {
  [WIKI_CATEGORIES.ARMOR]: {
    label: 'Zırhlar',
    icon: Shield,
    color: 'zinc',
    defaultImage: '/wiki/armors.png',
    bgGradient: 'from-zinc-500 to-zinc-700'
  },
  [WIKI_CATEGORIES.WEAPON]: {
    label: 'Silahlar',
    icon: Sword,
    color: 'slate',
    defaultImage: '/wiki/weapons.png',
    bgGradient: 'from-slate-500 to-slate-700'
  },
  [WIKI_CATEGORIES.SPELLS]: {
    label: 'Büyüler',
    icon: Sparkles,
    color: 'purple',
    defaultImage: '/wiki/spells.png',
    bgGradient: 'from-purple-500 to-purple-700'
  },
  [WIKI_CATEGORIES.MONSTERS]: {
    label: 'Canavarlar',
    icon: Skull,
    color: 'red',
    defaultImage: '/wiki/monsters.png',
    bgGradient: 'from-red-500 to-red-700'
  },
  [WIKI_CATEGORIES.MAGIC_ITEM]: {
    label: 'Sihirli Eşyalar',
    icon: Gem,
    color: 'amber',
    defaultImage: '/wiki/magic_items.png',
    bgGradient: 'from-amber-500 to-amber-700'
  },
  [WIKI_CATEGORIES.FEATS]: {
    label: 'Yetenekler',
    icon: Zap,
    color: 'blue',
    defaultImage: '/wiki/feats.png',
    bgGradient: 'from-blue-500 to-blue-700'
  },
  [WIKI_CATEGORIES.BACKGROUND]: {
    label: 'Geçmişler',
    icon: Scroll,
    color: 'emerald',
    defaultImage: '/wiki/background.png',
    bgGradient: 'from-emerald-500 to-emerald-700'
  },
  [WIKI_CATEGORIES.RACES]: {
    label: 'Irklar',
    icon: Users,
    color: 'indigo',
    defaultImage: '/wiki/races.png',
    bgGradient: 'from-indigo-500 to-indigo-700'
  },
  [WIKI_CATEGORIES.CONDITIONS]: {
    label: 'Durumlar',
    icon: AlertCircle,
    color: 'orange',
    defaultImage: '/wiki/conditions.png',
    bgGradient: 'from-orange-500 to-orange-700'
  },
  [WIKI_CATEGORIES.PLANES]: {
    label: 'Düzlemler',
    icon: Globe,
    color: 'cyan',
    defaultImage: '/wiki/planes.png',
    bgGradient: 'from-cyan-500 to-cyan-700'
  }
};

/**
 * Kategori helper fonksiyonları
 */
export const getCategoryConfig = (category) => {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG[WIKI_CATEGORIES.SPELLS];
};

export const getCategoryLabel = (category) => {
  return getCategoryConfig(category).label;
};

export const getCategoryIcon = (category, size = 18) => {
  const config = getCategoryConfig(category);
  const IconComponent = config.icon;
  return <IconComponent size={size} />;
};

export const getCategoryColor = (category) => {
  return getCategoryConfig(category).color;
};

export const getCategoryDefaultImage = (category) => {
  return getCategoryConfig(category).defaultImage;
};

/**
 * Sidebar için kategori listesi
 */
export const CATEGORY_LIST = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
  id: key,
  label: config.label,
  icon: config.icon,
  color: config.color
}));

/**
 * API Endpoints
 */
export const WIKI_API = {
  LIST: '/wiki',
  CATEGORY: (cat) => `/wiki/category/${cat}`,
  DETAIL: (slug) => `/wiki/slug/${slug}`,
  SEARCH: '/wiki/search',
  SEARCH_TURKISH: '/wiki/search/turkish',
  CATEGORY_SEARCH: (cat) => `/wiki/category/${cat}/search`,
  STATS: '/wiki/stats/counts',
  CATEGORIES: '/wiki/categories'
};

/**
 * Pagination defaults
 */
export const WIKI_PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 20,
  MAX_SIZE: 100,
  DEFAULT_SORT: 'title',
  DEFAULT_SORT_DIR: 'asc'
};

/**
 * Like target type (backend ile eşleşmeli)
 */
export const LIKE_TARGET_TYPES = {
  WIKI: 'WIKI_ENTRY',
  HOMEBREW: 'HOMEBREW_ENTRY'
};

/**
 * Zırh kategorileri (Armor metadata için)
 */
export const ARMOR_CATEGORIES = {
  light: 'Hafif Zırh',
  medium: 'Orta Zırh',
  heavy: 'Ağır Zırh',
  shield: 'Kalkan'
};

/**
 * Silah hasar tipleri
 */
export const DAMAGE_TYPES = {
  bludgeoning: 'Ezici',
  piercing: 'Delici',
  slashing: 'Kesici'
};

/**
 * Kaynak/Doküman bilgisi için helper
 */
export const getSourceDisplay = (metadata) => {
  if (!metadata?.document) return null;
  return metadata.document.display_name || metadata.document.name;
};

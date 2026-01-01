// src/constants/blogConstants.jsx

import React from 'react';
import { 
  Map, BookOpen, Wrench, GraduationCap, 
  Calendar, Newspaper, Sparkles 
} from 'lucide-react';

/**
 * Blog kategorileri (Backend BlogCategory enum ile aynı)
 */
export const BLOG_CATEGORIES = {
  ADVENTURE: {
    value: 'ADVENTURE',
    label: 'Macera',
    icon: Map,
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-emerald-700',
    description: 'Macera senaryoları, quest\'ler, dungeon tasarımları'
  },
  LORE: {
    value: 'LORE',
    label: 'Evren Bilgisi',
    icon: BookOpen,
    color: 'purple',
    bgGradient: 'from-purple-500 to-purple-700',
    description: 'Hikayeler, world-building, lore yazıları'
  },
  MECHANICS: {
    value: 'MECHANICS',
    label: 'Mekanikler',
    icon: Wrench,
    color: 'blue',
    bgGradient: 'from-blue-500 to-blue-700',
    description: 'Kurallar, homebrew sistemler, house rules'
  },
  GUIDE: {
    value: 'GUIDE',
    label: 'Rehber',
    icon: GraduationCap,
    color: 'amber',
    bgGradient: 'from-amber-500 to-amber-700',
    description: 'DM ve oyuncu rehberleri, taktikler'
  },
  DIARY: {
    value: 'DIARY',
    label: 'Kampanya Günlüğü',
    icon: Calendar,
    color: 'rose',
    bgGradient: 'from-rose-500 to-rose-700',
    description: 'Session notları, campaign recaps'
  },
  NEWS: {
    value: 'NEWS',
    label: 'Duyuru',
    icon: Newspaper,
    color: 'red',
    bgGradient: 'from-red-500 to-red-700',
    description: 'Platform haberleri, güncellemeler'
  },
  OTHER: {
    value: 'OTHER',
    label: 'Diğer',
    icon: Sparkles,
    color: 'gray',
    bgGradient: 'from-gray-500 to-gray-700',
    description: 'Kategori dışı içerikler'
  }
};

/**
 * Blog durumları (Backend BlogStatus enum ile aynı)
 */
export const BLOG_STATUS = {
  DRAFT: {
    value: 'DRAFT',
    label: 'Taslak',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    icon: '📝'
  },
  PUBLISHED: {
    value: 'PUBLISHED',
    label: 'Yayınlandı',
    color: 'green',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: '✓'
  },
  ARCHIVED: {
    value: 'ARCHIVED',
    label: 'Arşivlendi',
    color: 'orange',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: '📦'
  }
};

/**
 * Pagination defaults
 */
export const BLOG_PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 12,
  MY_BLOGS_SIZE: 10
};

/**
 * Like target type (Community like sistemi ile entegrasyon)
 */
export const BLOG_LIKE_TARGET_TYPE = 'BLOG_ENTRY';

/**
 * Default placeholder image
 */
export const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1596345389986-d20b9c551f77?w=800&h=400&fit=crop';

/**
 * Okuma hızı (kelime/dakika) - Backend ile aynı
 */
export const READING_SPEED = 200; // words per minute

/**
 * Image URL regex validation
 */
export const IMAGE_URL_REGEX = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;

/**
 * Helper Functions
 */

/**
 * Kategori config'i döndür
 */
export const getCategoryConfig = (category) => {
  return BLOG_CATEGORIES[category] || BLOG_CATEGORIES.OTHER;
};

/**
 * Kategori icon component'i döndür
 */
export const getCategoryIcon = (category, size = 20) => {
  const config = getCategoryConfig(category);
  const IconComponent = config.icon;
  return <IconComponent size={size} className={`text-${config.color}-500`} />;
};

/**
 * Kategori label'ı döndür
 */
export const getCategoryLabel = (category) => {
  return getCategoryConfig(category).label;
};

/**
 * Status config'i döndür
 */
export const getStatusConfig = (status) => {
  return BLOG_STATUS[status] || BLOG_STATUS.DRAFT;
};

/**
 * Status badge component döndür
 */
export const getStatusBadge = (status) => {
  const config = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

/**
 * Kategori listesi (dropdown için)
 */
export const getCategoryOptions = () => {
  return Object.values(BLOG_CATEGORIES);
};

/**
 * Okuma süresini hesapla (kelime sayısından)
 */
export const calculateReadingTime = (text) => {
  if (!text) return 0;
  
  // HTML/Markdown etiketlerini temizle
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/[#*_~`]/g, '');
  
  // Kelimeleri say
  const words = cleanText.trim().split(/\s+/).length;
  
  // Dakika hesapla (min 1 dk)
  return Math.max(1, Math.ceil(words / READING_SPEED));
};

/**
 * Image URL validate et
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  return IMAGE_URL_REGEX.test(url);
};

/**
 * LocalStorage keys
 */
export const BLOG_STORAGE_KEYS = {
  DRAFT: 'blog-draft',
  AUTO_SAVE_TIME: 'blog-autosave-time'
};
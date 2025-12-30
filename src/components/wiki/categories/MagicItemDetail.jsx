// src/components/wiki/categories/MagicItemDetail.jsx

import React from 'react';
import { Gem, Sparkles, BookOpen, Lock, Star } from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import MarkdownRenderer from '../../common/MarkdownRenderer';

/**
 * Magic Item (Sihirli Eşya) detay componenti
 * metadata ve turkishContent'i parse ederek gösterir
 */

// Nadirlik tema mapping
const RARITY_THEMES = {
  common: {
    label: 'Sıradan',
    gradient: 'from-slate-50 to-slate-100',
    border: 'border-slate-200',
    iconBorder: 'border-slate-300',
    iconColor: 'text-slate-600',
    badge: 'bg-slate-500',
    starColor: 'text-slate-400'
  },
  uncommon: {
    label: 'Nadir Olmayan',
    gradient: 'from-green-50 to-green-100',
    border: 'border-green-200',
    iconBorder: 'border-green-300',
    iconColor: 'text-green-600',
    badge: 'bg-green-500',
    starColor: 'text-green-500'
  },
  rare: {
    label: 'Nadir',
    gradient: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    iconBorder: 'border-blue-300',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-500',
    starColor: 'text-blue-500'
  },
  'very rare': {
    label: 'Çok Nadir',
    gradient: 'from-purple-50 to-purple-100',
    border: 'border-purple-200',
    iconBorder: 'border-purple-300',
    iconColor: 'text-purple-600',
    badge: 'bg-purple-500',
    starColor: 'text-purple-500'
  },
  legendary: {
    label: 'Efsanevi',
    gradient: 'from-amber-50 to-amber-100',
    border: 'border-amber-200',
    iconBorder: 'border-amber-300',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-500',
    starColor: 'text-amber-500'
  },
  artifact: {
    label: 'Yapıt',
    gradient: 'from-red-50 to-red-100',
    border: 'border-red-200',
    iconBorder: 'border-red-300',
    iconColor: 'text-red-600',
    badge: 'bg-red-500',
    starColor: 'text-red-500'
  },
  default: {
    label: 'Bilinmiyor',
    gradient: 'from-amber-50 to-amber-100',
    border: 'border-amber-200',
    iconBorder: 'border-amber-300',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-500',
    starColor: 'text-amber-500'
  }
};

// Türkçe nadirlik mapping
const TURKISH_RARITY_MAP = {
  'sıradan': 'common',
  'nadir olmayan': 'uncommon',
  'nadir': 'rare',
  'çok nadir': 'very rare',
  'efsanevi': 'legendary',
  'yapıt': 'artifact',
  'artifact': 'artifact'
};

const MagicItemDetail = ({ metadata, turkishContent }) => {
  const tr = turkishContent || {};
  const meta = metadata || {};
  const source = getSourceDisplay(metadata);

  // Nadirlik teması
  const getRarityTheme = () => {
    const rarity = (tr.rarity || meta.rarity || '').toLowerCase();
    
    // Türkçe'den İngilizce'ye çevir
    const englishRarity = TURKISH_RARITY_MAP[rarity] || rarity;
    
    return RARITY_THEMES[englishRarity] || RARITY_THEMES.default;
  };

  // Eşya tipi
  const getItemType = () => {
    return tr.type || meta.type || 'Sihirli Eşya';
  };

  // Uyum gereksinimi
  const getAttunement = () => {
    const attunement = tr.requires_attunement || meta.requires_attunement;
    
    if (attunement === '' || attunement === null || attunement === undefined) {
      return null;
    }
    
    if (attunement === true || attunement === 'requires attunement') {
      return 'Uyum Gerektirir';
    }
    
    // Özel uyum gereksinimleri (örn: "requires attunement by a spellcaster")
    if (typeof attunement === 'string' && attunement.length > 0) {
      return attunement;
    }
    
    return null;
  };

  // Açıklama
  const getDescription = () => {
    return tr.desc || meta.desc || null;
  };

  // Nadirlik yıldızları
  const getRarityStars = () => {
    const rarity = (tr.rarity || meta.rarity || '').toLowerCase();
    const englishRarity = TURKISH_RARITY_MAP[rarity] || rarity;
    
    const starCounts = {
      'common': 1,
      'uncommon': 2,
      'rare': 3,
      'very rare': 4,
      'legendary': 5,
      'artifact': 6
    };
    
    return starCounts[englishRarity] || 1;
  };

  const theme = getRarityTheme();
  const itemType = getItemType();
  const attunement = getAttunement();
  const description = getDescription();
  const starCount = getRarityStars();

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl p-6`}>
        <div className="flex items-start gap-4">
          {/* İkon */}
          <div className="flex-shrink-0">
            <div className={`w-16 h-16 bg-white border-2 ${theme.iconBorder} rounded-xl flex items-center justify-center shadow-sm`}>
              <Gem size={32} className={theme.iconColor} />
            </div>
          </div>
          
          {/* Bilgi */}
          <div className="flex-1">
            {/* Tip ve Nadirlik Badge'leri */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {/* Eşya Tipi */}
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 text-mtf border border-cbg rounded-lg text-xs font-bold">
                <Sparkles size={12} />
                {itemType}
              </span>
              
              {/* Nadirlik */}
              <span className={`inline-block px-3 py-1 ${theme.badge} text-white rounded-lg text-xs font-bold`}>
                {theme.label}
              </span>
            </div>
            
            {/* Nadirlik Yıldızları */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(starCount)].map((_, i) => (
                <Star key={i} size={14} className={`${theme.starColor} fill-current`} />
              ))}
              {[...Array(6 - starCount)].map((_, i) => (
                <Star key={i + starCount} size={14} className="text-slate-200" />
              ))}
            </div>
            
            {/* Uyum */}
            {attunement && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <Lock size={14} />
                <span className="font-medium">{attunement}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Açıklama */}
      {description && (
        <div className="bg-white border border-cbg rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className={theme.iconColor} />
            <span className="text-sm font-bold text-mtf">Açıklama</span>
          </div>
          
          <MarkdownRenderer content={description} variant="default" />
        </div>
      )}

      {/* Kaynak */}
      {source && (
        <div className="flex items-center gap-2 text-xs text-sti">
          <BookOpen size={14} />
          <span>Kaynak: {source}</span>
        </div>
      )}
    </div>
  );
};

export default MagicItemDetail;
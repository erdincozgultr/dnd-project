// src/components/wiki/categories/SpellDetail.jsx

import React from 'react';
import { 
  Sparkles, Clock, Target, Zap, BookOpen,
  Volume2, Hand, Package, RefreshCw, AlertCircle
} from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import MarkdownRenderer from '../../common/MarkdownRenderer';

/**
 * Spell (Büyü) detay componenti
 * D&D 5e büyü kartı formatında gösterim
 */

// Büyü okulu renkleri
const SCHOOL_THEMES = {
  abjuration: { 
    label: 'Koruma', 
    gradient: 'from-blue-50 to-blue-100', 
    border: 'border-blue-200', 
    iconColor: 'text-blue-600', 
    badge: 'bg-blue-500',
    accent: 'text-blue-700'
  },
  conjuration: { 
    label: 'Çağırma', 
    gradient: 'from-amber-50 to-amber-100', 
    border: 'border-amber-200', 
    iconColor: 'text-amber-600', 
    badge: 'bg-amber-500',
    accent: 'text-amber-700'
  },
  divination: { 
    label: 'Kehanet', 
    gradient: 'from-purple-50 to-purple-100', 
    border: 'border-purple-200', 
    iconColor: 'text-purple-600', 
    badge: 'bg-purple-500',
    accent: 'text-purple-700'
  },
  enchantment: { 
    label: 'Büyüleme', 
    gradient: 'from-pink-50 to-pink-100', 
    border: 'border-pink-200', 
    iconColor: 'text-pink-600', 
    badge: 'bg-pink-500',
    accent: 'text-pink-700'
  },
  evocation: { 
    label: 'Çağrışım', 
    gradient: 'from-red-50 to-red-100', 
    border: 'border-red-200', 
    iconColor: 'text-red-600', 
    badge: 'bg-red-500',
    accent: 'text-red-700'
  },
  illusion: { 
    label: 'İllüzyon', 
    gradient: 'from-indigo-50 to-indigo-100', 
    border: 'border-indigo-200', 
    iconColor: 'text-indigo-600', 
    badge: 'bg-indigo-500',
    accent: 'text-indigo-700'
  },
  necromancy: { 
    label: 'Ölü Büyüsü', 
    gradient: 'from-zinc-50 to-zinc-100', 
    border: 'border-zinc-200', 
    iconColor: 'text-zinc-600', 
    badge: 'bg-zinc-500',
    accent: 'text-zinc-700'
  },
  transmutation: { 
    label: 'Dönüşüm', 
    gradient: 'from-emerald-50 to-emerald-100', 
    border: 'border-emerald-200', 
    iconColor: 'text-emerald-600', 
    badge: 'bg-emerald-500',
    accent: 'text-emerald-700'
  },
  default: { 
    label: 'Büyü', 
    gradient: 'from-slate-50 to-slate-100', 
    border: 'border-slate-200', 
    iconColor: 'text-slate-600', 
    badge: 'bg-slate-500',
    accent: 'text-slate-700'
  }
};

// Türkçe okul mapping
const TURKISH_SCHOOL_MAP = {
  'koruma': 'abjuration',
  'abjuration': 'abjuration',
  'çağırma': 'conjuration',
  'conjuration': 'conjuration',
  'kehanet': 'divination',
  'divination': 'divination',
  'büyüleme': 'enchantment',
  'enchantment': 'enchantment',
  'çağrışım': 'evocation',
  'evokasyon': 'evocation',
  'evocation': 'evocation',
  'illüzyon': 'illusion',
  'illusion': 'illusion',
  'ölü büyüsü': 'necromancy',
  'necromancy': 'necromancy',
  'dönüşüm': 'transmutation',
  'transmutation': 'transmutation'
};

// Seviye badge renkleri
const LEVEL_COLORS = {
  0: 'bg-slate-400',
  1: 'bg-green-500',
  2: 'bg-blue-500',
  3: 'bg-purple-500',
  4: 'bg-amber-500',
  5: 'bg-orange-500',
  6: 'bg-red-500',
  7: 'bg-rose-600',
  8: 'bg-fuchsia-600',
  9: 'bg-violet-700'
};

const SpellDetail = ({ metadata, turkishContent }) => {
  const tr = turkishContent || {};
  const meta = metadata || {};
  const source = getSourceDisplay(metadata);

  // Okul teması
  const getSchoolTheme = () => {
    let school = tr.school || meta.school || '';
    
    // Eğer school bir object ise (API v2 formatı)
    if (typeof school === 'object' && school.name) {
      school = school.name;
    }
    
    // Parantez içindeki İngilizce'yi çıkar: "Koruma (Abjuration)" -> "koruma"
    school = school.toLowerCase().split('(')[0].trim();
    
    const englishSchool = TURKISH_SCHOOL_MAP[school] || school;
    return SCHOOL_THEMES[englishSchool] || SCHOOL_THEMES.default;
  };

  const theme = getSchoolTheme();

  // Seviye
  const getLevel = () => {
    const level = tr.level ?? meta.level ?? 0;
    return level;
  };

  const getLevelLabel = () => {
    const level = getLevel();
    if (level === 0) return 'Sihirbazlık';
    return `${level}. Seviye`;
  };

  // Okul adı
  const getSchoolName = () => {
    let school = tr.school || meta.school || '';
    if (typeof school === 'object' && school.name) {
      school = school.name;
    }
    return school;
  };

  // Casting time
  const getCastingTime = () => {
    return tr.casting_time || meta.casting_time || '-';
  };

  // Range
  const getRange = () => {
    // Önce Türkçe, yoksa meta
    if (tr.range) return tr.range;
    
    // API v2 formatı
    if (meta.range_text) return meta.range_text;
    
    // Sayısal range
    if (typeof meta.range === 'number') {
      if (meta.range === 0) return 'Kendin';
      if (meta.range < 1) return 'Dokunma';
      return `${meta.range} feet`;
    }
    
    return meta.range || '-';
  };

  // Duration
  const getDuration = () => {
    return tr.duration || meta.duration || '-';
  };

  // Concentration
  const isConcentration = () => {
    return meta.concentration === true;
  };

  // Ritual
  const isRitual = () => {
    return tr.ritual === true || meta.ritual === true;
  };

  // Components
  const getComponents = () => {
    // Türkçe'de varsa
    if (tr.components) return tr.components;
    
    // API v2 formatı
    const parts = [];
    if (meta.verbal) parts.push('S');
    if (meta.somatic) parts.push('B');
    if (meta.material) parts.push('M');
    
    if (parts.length > 0) return parts.join(', ');
    
    return meta.components || '-';
  };

  // Description
  const getDescription = () => {
    return tr.desc || meta.desc || '';
  };

  // Higher Level
  const getHigherLevel = () => {
    return tr.higher_level || meta.higher_level || null;
  };

  const level = getLevel();
  const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS[0];

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl overflow-hidden`}>
        {/* Üst Bar - Seviye ve Okul */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/5">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 ${levelColor} text-white rounded text-xs font-bold`}>
              {getLevelLabel()}
            </span>
            <span className={`px-2 py-0.5 ${theme.badge} text-white rounded text-xs font-bold`}>
              {getSchoolName()}
            </span>
          </div>
          
          {/* Ritüel & Konsantrasyon Badges */}
          <div className="flex items-center gap-1">
            {isRitual() && (
              <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-xs font-bold">
                Ritüel
              </span>
            )}
            {isConcentration() && (
              <span className="px-2 py-0.5 bg-orange-500 text-white rounded text-xs font-bold flex items-center gap-1">
                <RefreshCw size={10} />
                Konsantrasyon
              </span>
            )}
          </div>
        </div>
        
        {/* Ana Bilgiler */}
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* İkon */}
            <div className="flex-shrink-0">
              <div className={`w-16 h-16 bg-white border-2 ${theme.border} rounded-xl flex items-center justify-center shadow-sm`}>
                <Sparkles size={32} className={theme.iconColor} />
              </div>
            </div>
            
            {/* Bilgi Grid */}
            <div className="flex-1 grid grid-cols-2 gap-2">
              {/* Casting Time */}
              <div className="bg-white/80 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Clock size={12} className={theme.iconColor} />
                  <span className="text-[10px] font-bold text-sti uppercase">Atım Süresi</span>
                </div>
                <p className="text-sm font-bold text-mtf">{getCastingTime()}</p>
              </div>
              
              {/* Range */}
              <div className="bg-white/80 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Target size={12} className={theme.iconColor} />
                  <span className="text-[10px] font-bold text-sti uppercase">Menzil</span>
                </div>
                <p className="text-sm font-bold text-mtf">{getRange()}</p>
              </div>
              
              {/* Duration */}
              <div className="bg-white/80 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Zap size={12} className={theme.iconColor} />
                  <span className="text-[10px] font-bold text-sti uppercase">Süre</span>
                </div>
                <p className="text-sm font-bold text-mtf">{getDuration()}</p>
              </div>
              
              {/* Components */}
              <div className="bg-white/80 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Package size={12} className={theme.iconColor} />
                  <span className="text-[10px] font-bold text-sti uppercase">Bileşenler</span>
                </div>
                <p className="text-sm font-bold text-mtf">{getComponents()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bileşen Detayları */}
      <div className="bg-white border border-cbg rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          {getComponents().includes('S') && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
              <Volume2 size={16} className="text-blue-500" />
              <span className="text-xs font-bold text-blue-700">Sözlü (V)</span>
            </div>
          )}
          {getComponents().includes('B') && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
              <Hand size={16} className="text-emerald-500" />
              <span className="text-xs font-bold text-emerald-700">Bedensel (S)</span>
            </div>
          )}
          {getComponents().includes('M') && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
              <Package size={16} className="text-amber-500" />
              <span className="text-xs font-bold text-amber-700">Malzeme (M)</span>
            </div>
          )}
        </div>
      </div>

      {/* Açıklama */}
      {getDescription() && (
        <div className="bg-white border border-cbg rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className={theme.iconColor} />
            <span className="text-sm font-bold text-mtf">Açıklama</span>
          </div>
          
          <MarkdownRenderer content={getDescription()} variant="default" />
        </div>
      )}

      {/* Yüksek Seviyede */}
      {getHigherLevel() && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-purple-500" />
            <span className="text-sm font-bold text-purple-700">Yüksek Seviyelerde</span>
          </div>
          <p className="text-sm text-purple-800">{getHigherLevel()}</p>
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

export default SpellDetail;
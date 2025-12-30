// src/components/wiki/categories/SpellListDetail.jsx

import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Sparkles, Search, List, Grid,
  ExternalLink, Filter
} from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import MarkdownRenderer from '../../common/MarkdownRenderer';

/**
 * SpellList (Büyü Listesi) detay componenti
 * Warlock, Wizard, Cleric gibi sınıfların büyü listeleri için
 */

// Sınıf tema renkleri (ClassDetail ile aynı)
const CLASS_THEMES = {
  druid: { gradient: 'from-emerald-50 to-emerald-100', border: 'border-emerald-200', iconColor: 'text-emerald-600', badge: 'bg-emerald-500', tagBg: 'bg-emerald-100', tagText: 'text-emerald-700' },
  wizard: { gradient: 'from-blue-50 to-blue-100', border: 'border-blue-200', iconColor: 'text-blue-600', badge: 'bg-blue-500', tagBg: 'bg-blue-100', tagText: 'text-blue-700' },
  fighter: { gradient: 'from-red-50 to-red-100', border: 'border-red-200', iconColor: 'text-red-600', badge: 'bg-red-500', tagBg: 'bg-red-100', tagText: 'text-red-700' },
  rogue: { gradient: 'from-slate-50 to-slate-100', border: 'border-slate-200', iconColor: 'text-slate-600', badge: 'bg-slate-500', tagBg: 'bg-slate-100', tagText: 'text-slate-700' },
  cleric: { gradient: 'from-amber-50 to-amber-100', border: 'border-amber-200', iconColor: 'text-amber-600', badge: 'bg-amber-500', tagBg: 'bg-amber-100', tagText: 'text-amber-700' },
  paladin: { gradient: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200', iconColor: 'text-yellow-600', badge: 'bg-yellow-500', tagBg: 'bg-yellow-100', tagText: 'text-yellow-700' },
  ranger: { gradient: 'from-green-50 to-green-100', border: 'border-green-200', iconColor: 'text-green-600', badge: 'bg-green-500', tagBg: 'bg-green-100', tagText: 'text-green-700' },
  barbarian: { gradient: 'from-orange-50 to-orange-100', border: 'border-orange-200', iconColor: 'text-orange-600', badge: 'bg-orange-500', tagBg: 'bg-orange-100', tagText: 'text-orange-700' },
  bard: { gradient: 'from-pink-50 to-pink-100', border: 'border-pink-200', iconColor: 'text-pink-600', badge: 'bg-pink-500', tagBg: 'bg-pink-100', tagText: 'text-pink-700' },
  monk: { gradient: 'from-cyan-50 to-cyan-100', border: 'border-cyan-200', iconColor: 'text-cyan-600', badge: 'bg-cyan-500', tagBg: 'bg-cyan-100', tagText: 'text-cyan-700' },
  sorcerer: { gradient: 'from-purple-50 to-purple-100', border: 'border-purple-200', iconColor: 'text-purple-600', badge: 'bg-purple-500', tagBg: 'bg-purple-100', tagText: 'text-purple-700' },
  warlock: { gradient: 'from-violet-50 to-violet-100', border: 'border-violet-200', iconColor: 'text-violet-600', badge: 'bg-violet-500', tagBg: 'bg-violet-100', tagText: 'text-violet-700' },
  artificer: { gradient: 'from-zinc-50 to-zinc-100', border: 'border-zinc-200', iconColor: 'text-zinc-600', badge: 'bg-zinc-500', tagBg: 'bg-zinc-100', tagText: 'text-zinc-700' },
  default: { gradient: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', iconColor: 'text-indigo-600', badge: 'bg-indigo-500', tagBg: 'bg-indigo-100', tagText: 'text-indigo-700' }
};

const SpellListDetail = ({ metadata, turkishContent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  const tr = turkishContent || {};
  const meta = metadata || {};
  const source = getSourceDisplay(metadata);

  // Sınıf adı ve teması
  const getClassName = () => {
    return tr.name || meta.name || 'Büyü Listesi';
  };

  const getClassTheme = () => {
    const slug = (meta.slug || meta.name || '').toLowerCase();
    return CLASS_THEMES[slug] || CLASS_THEMES.default;
  };

  const theme = getClassTheme();
  const className = getClassName();

  // Büyü listesi
  const getSpells = () => {
    return tr.spells || meta.spells || [];
  };

  const spells = getSpells();

  // Açıklama
  const getDescription = () => {
    return tr.desc || meta.desc;
  };

  const description = getDescription();

  // Büyü slug'ını okunabilir isme çevir
  const formatSpellName = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Filtrelenmiş büyüler
  const filteredSpells = useMemo(() => {
    if (!searchQuery.trim()) return spells;
    
    const query = searchQuery.toLowerCase();
    return spells.filter(spell => 
      spell.toLowerCase().includes(query) ||
      formatSpellName(spell).toLowerCase().includes(query)
    );
  }, [spells, searchQuery]);

  // Büyüleri alfabetik grupla
  const groupedSpells = useMemo(() => {
    const groups = {};
    
    filteredSpells.forEach(spell => {
      const firstLetter = spell.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(spell);
    });
    
    // Harfleri sırala
    return Object.keys(groups)
      .sort()
      .map(letter => ({
        letter,
        spells: groups[letter].sort()
      }));
  }, [filteredSpells]);

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl p-6`}>
        <div className="flex items-start gap-4">
          {/* İkon */}
          <div className="flex-shrink-0">
            <div className={`w-16 h-16 bg-white border-2 ${theme.border} rounded-xl flex items-center justify-center shadow-sm`}>
              <Sparkles size={32} className={theme.iconColor} />
            </div>
          </div>
          
          {/* Bilgi */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 ${theme.badge} text-white rounded-lg text-xs font-bold`}>
                <BookOpen size={12} />
                Büyü Listesi
              </span>
              
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 text-mtf border border-cbg rounded-lg text-xs font-bold">
                {spells.length} Büyü
              </span>
            </div>
            
            {/* Açıklama */}
            {description && (
              <p className="text-sm text-sti leading-relaxed italic">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Arama ve Görünüm Kontrolleri */}
      <div className="bg-white border border-cbg rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Arama */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sti" />
            <input
              type="text"
              placeholder="Büyü ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-cbg rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta"
            />
          </div>
          
          {/* Görünüm Değiştir */}
          <div className="flex items-center gap-1 bg-cbg rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-mtf shadow-sm' 
                  : 'text-sti hover:text-mtf'
              }`}
              title="Grid görünüm"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-mtf shadow-sm' 
                  : 'text-sti hover:text-mtf'
              }`}
              title="Liste görünüm"
            >
              <List size={18} />
            </button>
          </div>
        </div>
        
        {/* Sonuç sayısı */}
        {searchQuery && (
          <p className="mt-2 text-xs text-sti">
            {filteredSpells.length} / {spells.length} büyü bulundu
          </p>
        )}
      </div>

      {/* Büyü Listesi */}
      {filteredSpells.length > 0 ? (
        viewMode === 'grid' ? (
          // Grid Görünüm - Alfabetik gruplu
          <div className="space-y-6">
            {groupedSpells.map(({ letter, spells: letterSpells }) => (
              <div key={letter}>
                {/* Harf Başlığı */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-8 h-8 ${theme.badge} text-white rounded-lg flex items-center justify-center font-bold text-sm`}>
                    {letter}
                  </span>
                  <span className="text-xs text-sti">({letterSpells.length})</span>
                </div>
                
                {/* Büyüler Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {letterSpells.map((spell, index) => (
                    <div
                      key={index}
                      className={`${theme.tagBg} ${theme.tagText} border ${theme.border} rounded-lg px-3 py-2 text-xs font-medium hover:opacity-80 transition-opacity cursor-pointer truncate`}
                      title={formatSpellName(spell)}
                    >
                      {formatSpellName(spell)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Liste Görünüm
          <div className="bg-white border border-cbg rounded-xl divide-y divide-cbg">
            {filteredSpells.sort().map((spell, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={14} className={theme.iconColor} />
                  <span className="text-sm font-medium text-mtf">
                    {formatSpellName(spell)}
                  </span>
                </div>
                <span className="text-xs text-sti font-mono">
                  {spell}
                </span>
              </div>
            ))}
          </div>
        )
      ) : (
        // Sonuç bulunamadı
        <div className="bg-white border border-cbg rounded-xl p-8 text-center">
          <Search size={32} className="mx-auto text-sti mb-2" />
          <p className="text-sm text-sti">
            "{searchQuery}" için büyü bulunamadı
          </p>
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

export default SpellListDetail;
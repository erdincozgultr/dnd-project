// src/components/wiki/categories/SpellListDetail.jsx

import React, { useState, useMemo } from 'react';
import { BookMarked, Search, Grid, List, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Spell List (Büyü Listesi) detay componenti
 * 
 * turkish_content yapısı:
 * {
 *   "name": "Ruhban",
 *   "desc": "Sen, kutsal güçlerin rehberi olarak...",
 *   "hit_die": "d8",
 *   "spells": ["accelerate", "adjust-position", "aid", ...]
 * }
 */

const SpellListDetail = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  const spells = data.spells || [];

  // Slug'ı okunabilir isme çevir
  const formatSpellName = (slug) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Filtrelenmiş büyüler
  const filteredSpells = useMemo(() => {
    if (!searchTerm) return spells;
    const term = searchTerm.toLowerCase();
    return spells.filter(spell => 
      spell.toLowerCase().includes(term) ||
      formatSpellName(spell).toLowerCase().includes(term)
    );
  }, [spells, searchTerm]);

  // Alfabetik gruplama
  const groupedSpells = useMemo(() => {
    const groups = {};
    filteredSpells.forEach(spell => {
      const firstLetter = formatSpellName(spell).charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(spell);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredSpells]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white border-2 border-violet-300 rounded-xl flex items-center justify-center shadow-sm">
            <BookMarked size={32} className="text-violet-600" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-violet-600 uppercase font-bold">Büyü Listesi</p>
            <p className="text-xl font-bold text-mtf">{data.name}</p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-violet-500 text-white rounded-lg text-xs font-bold">
                {spells.length} Büyü
              </span>
              {data.hit_die && (
                <span className="px-3 py-1 bg-white/80 text-violet-700 rounded-lg text-xs font-bold flex items-center gap-1">
                  <Heart size={12} />
                  {data.hit_die}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Açıklama */}
      {data.desc && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <p className="text-sm text-sti leading-relaxed">{data.desc}</p>
        </div>
      )}

      {/* Arama ve Görünüm */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sti" />
          <input
            type="text"
            placeholder="Büyü ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-cbg rounded-xl text-sm focus:border-violet-400 outline-none"
          />
        </div>
        
        <div className="flex bg-white border border-cbg rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-violet-100 text-violet-600' : 'text-sti hover:bg-slate-50'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-violet-100 text-violet-600' : 'text-sti hover:bg-slate-50'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Sonuç sayısı */}
      {searchTerm && (
        <p className="text-xs text-sti">
          {filteredSpells.length} sonuç bulundu
        </p>
      )}

      {/* Büyü Listesi */}
      {filteredSpells.length === 0 ? (
        <div className="text-center py-8 text-sti">
          Arama kriterine uygun büyü bulunamadı
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredSpells.map((spell, index) => (
            <Link
              key={index}
              to={`/wiki/spell/${spell}`}
              className="bg-white border border-cbg rounded-lg px-3 py-2 text-sm font-medium text-mtf hover:bg-violet-50 hover:border-violet-200 transition-colors truncate"
              title={formatSpellName(spell)}
            >
              {formatSpellName(spell)}
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {groupedSpells.map(([letter, letterSpells]) => (
            <div key={letter}>
              <h3 className="text-sm font-black text-violet-600 mb-2 px-2">{letter}</h3>
              <div className="bg-white border border-cbg rounded-xl divide-y divide-cbg">
                {letterSpells.map((spell, index) => (
                  <Link
                    key={index}
                    to={`/wiki/spell/${spell}`}
                    className="block px-4 py-2.5 text-sm font-medium text-mtf hover:bg-violet-50 transition-colors"
                  >
                    {formatSpellName(spell)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpellListDetail;
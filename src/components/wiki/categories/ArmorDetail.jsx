// src/components/wiki/categories/ArmorDetail.jsx

import React from 'react';
import { Shield, AlertTriangle, Volume2 } from 'lucide-react';

/**
 * Zırh detay componenti
 * 
 * turkish_content yapısı:
 * {
 *   "name": "Zincir Gömlek",
 *   "desc": "",
 *   "category": "Orta Zırh",
 *   "ac_base": 13,
 *   "ac_display": "13 + Çeviklik değiştiricisi (maks 2)",
 *   "ac_add_dexmod": true,
 *   "ac_cap_dexmod": 2,
 *   "strength_score_required": null,
 *   "grants_stealth_disadvantage": false
 * }
 */
const ArmorDetail = ({ data }) => {
  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  // Zırh kategorisi rengi
  const getCategoryStyle = () => {
    const category = (data.category || '').toLowerCase();
    if (category.includes('hafif')) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
    if (category.includes('orta')) return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    if (category.includes('ağır')) return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
    if (category.includes('kalkan')) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  };

  const categoryStyle = getCategoryStyle();

  return (
    <div className="space-y-6">
      {/* Ana Bilgi Kartı */}
      <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          {/* AC Badge */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-white border-2 border-zinc-300 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <Shield size={20} className="text-zinc-500 mb-1" />
              <span className="text-2xl font-black text-mtf">{data.ac_base}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">AC</span>
            </div>
          </div>
          
          {/* Detaylar */}
          <div className="flex-1 space-y-3">
            {/* Kategori Badge */}
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border}`}>
              {data.category}
            </span>
            
            {/* AC Display */}
            {data.ac_display && (
              <div className="bg-white rounded-lg p-3 border border-zinc-200">
                <p className="text-[10px] font-bold text-sti uppercase mb-1">Zırh Sınıfı</p>
                <p className="text-sm font-bold text-mtf">{data.ac_display}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gereksinimler ve Dezavantajlar */}
      {(data.strength_score_required || data.grants_stealth_disadvantage) && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-amber-500" />
            <span className="text-sm font-bold text-mtf">Gereksinimler & Kısıtlamalar</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {data.strength_score_required && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-2 text-center">
                <p className="text-[10px] font-bold text-red-600 uppercase">Güç Gereksinimi</p>
                <p className="text-lg font-black text-red-700">{data.strength_score_required}</p>
              </div>
            )}
            
            {data.grants_stealth_disadvantage && (
              <div className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-2 flex items-center gap-2">
                <Volume2 size={16} className="text-orange-500" />
                <div>
                  <p className="text-[10px] font-bold text-orange-600 uppercase">Gizlilik</p>
                  <p className="text-sm font-bold text-orange-700">Dezavantaj</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Açıklama (varsa) */}
      {data.desc && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <p className="text-sm text-sti leading-relaxed">{data.desc}</p>
        </div>
      )}
    </div>
  );
};

export default ArmorDetail;
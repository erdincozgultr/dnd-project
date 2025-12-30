// src/components/wiki/categories/ArmorDetail.jsx

import React from 'react';
import { Shield, AlertTriangle, User, BookOpen } from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';

/**
 * Zırh detay componenti
 * metadata ve turkishContent'i parse ederek gösterir
 */
const ArmorDetail = ({ metadata, turkishContent }) => {
  // Türkçe içerik varsa onu, yoksa metadata kullan
  const data = turkishContent || metadata || {};
  const source = getSourceDisplay(metadata);
  
  // AC hesaplama metni
  const getACDisplay = () => {
    if (data.ac_display) return data.ac_display;
    
    let display = `${data.ac_base || '?'}`;
    if (data.ac_add_dexmod) {
      display += data.ac_cap_dexmod 
        ? ` + Çeviklik (maks ${data.ac_cap_dexmod})`
        : ' + Çeviklik';
    }
    return display;
  };

  // Kategori rengi
  const getCategoryColor = () => {
    const cat = (data.category || '').toLowerCase();
    switch (cat) {
      case 'light':
      case 'hafif':
      case 'hafif zırh':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'medium':
      case 'orta':
      case 'orta zırh':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'heavy':
      case 'ağır':
      case 'ağır zırh':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Ana Stat Kartı */}
      <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          {/* AC Badge */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-white border-2 border-zinc-300 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <Shield size={24} className="text-zinc-600 mb-1" />
              <span className="text-2xl font-black text-mtf">{data.ac_base || '?'}</span>
              <span className="text-[10px] font-bold text-sti uppercase">AC</span>
            </div>
          </div>
          
          {/* Detaylar */}
          <div className="flex-1 space-y-3">
            {/* Kategori */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getCategoryColor()}`}>
                {data.category || 'Zırh'}
              </span>
            </div>
            
            {/* AC Hesaplama */}
            <div className="bg-white rounded-lg p-3 border border-zinc-200">
              <p className="text-[10px] font-bold text-sti uppercase mb-1">Zırh Sınıfı</p>
              <p className="text-sm font-bold text-mtf">{getACDisplay()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Özellikler Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Çeviklik Bonusu */}
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-blue-500" />
            <span className="text-[10px] font-bold text-sti uppercase">Çeviklik Bonusu</span>
          </div>
          <p className="text-sm font-bold text-mtf">
            {data.ac_add_dexmod 
              ? (data.ac_cap_dexmod ? `Evet (Maks +${data.ac_cap_dexmod})` : 'Evet (Tam)')
              : 'Hayır'
            }
          </p>
        </div>

        {/* Güç Gereksinimi */}
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-red-500" />
            <span className="text-[10px] font-bold text-sti uppercase">Güç Gereksinimi</span>
          </div>
          <p className="text-sm font-bold text-mtf">
            {data.strength_score_required 
              ? `${data.strength_score_required}+`
              : 'Yok'
            }
          </p>
        </div>
      </div>

      {/* Gizlilik Dezavantajı */}
      {data.grants_stealth_disadvantage && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-orange-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-orange-700">Gizlilik Dezavantajı</p>
            <p className="text-xs text-orange-600">Bu zırh giyildiğinde Gizlilik (Stealth) kontrollerinde dezavantaj alırsınız.</p>
          </div>
        </div>
      )}

      {/* Açıklama */}
      {data.desc && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <p className="text-[10px] font-bold text-sti uppercase mb-2">Açıklama</p>
          <p className="text-sm text-mtf leading-relaxed">{data.desc}</p>
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

export default ArmorDetail;

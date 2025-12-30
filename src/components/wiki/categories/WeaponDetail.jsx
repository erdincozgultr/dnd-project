// src/components/wiki/categories/WeaponDetail.jsx

import React from 'react';
import { Sword, Target, Zap, CircleDot } from 'lucide-react';

/**
 * Silah detay componenti
 * 
 * turkish_content yapısı:
 * {
 *   "name": "Büyük Kılıç",
 *   "mastery": "Sıyırma",
 *   "category": "WEAPON",
 *   "is_simple": false,
 *   "properties": "Ağır, Çift Elli",
 *   "range_long": 0,
 *   "damage_dice": "2d6",
 *   "damage_type": "Kesici",
 *   "range_normal": 0,
 *   "is_improvised": false
 * }
 */
const WeaponDetail = ({ data }) => {
  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  // Hasar tipi rengi
  const getDamageTypeStyle = () => {
    const type = (data.damage_type || '').toLowerCase();
    if (type.includes('ezici')) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    if (type.includes('delici')) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    if (type.includes('kesici')) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  };

  const damageStyle = getDamageTypeStyle();

  // Menzilli mi?
  const isRanged = data.range_normal > 0 || data.range_long > 0;

  // Properties parse (virgülle ayrılmış string)
  const properties = data.properties 
    ? data.properties.split(',').map(p => p.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      {/* Ana Bilgi Kartı */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          {/* Hasar Badge */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <Sword size={24} className="text-slate-600 mb-1" />
              <span className="text-2xl font-black text-mtf">{data.damage_dice || '-'}</span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mt-1 ${damageStyle.bg} ${damageStyle.text}`}>
                {data.damage_type || 'Bilinmiyor'}
              </span>
            </div>
          </div>
          
          {/* Detaylar */}
          <div className="flex-1 space-y-3">
            {/* Tip Badge'leri */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                data.is_simple 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-purple-100 text-purple-700 border-purple-200'
              }`}>
                {data.is_simple ? 'Basit Silah' : 'Askeri Silah'}
              </span>
              
              {isRanged && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <Target size={12} />
                  Menzilli
                </span>
              )}
              
              {data.is_improvised && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                  Doğaçlama
                </span>
              )}
            </div>
            
            {/* Mastery */}
            {data.mastery && (
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-[10px] font-bold text-sti uppercase mb-1">Ustalık</p>
                <p className="text-sm font-bold text-purple-600">{data.mastery}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menzil Bilgisi */}
      {isRanged && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-mtf">Menzil</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Normal</p>
              <p className="text-lg font-black text-blue-700">{data.range_normal} ft</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Uzun</p>
              <p className="text-lg font-black text-slate-600">{data.range_long} ft</p>
            </div>
          </div>
        </div>
      )}

      {/* Özellikler */}
      {properties.length > 0 && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-amber-500" />
            <span className="text-sm font-bold text-mtf">Özellikler</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {properties.map((prop, index) => (
              <span 
                key={index} 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg text-sm font-medium text-amber-700"
              >
                <CircleDot size={12} className="text-amber-500" />
                {prop}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeaponDetail;
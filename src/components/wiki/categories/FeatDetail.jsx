// src/components/wiki/categories/FeatDetail.jsx

import React from 'react';
import { Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Feat (Hüner/Marifet) detay componenti
 * 
 * turkish_content yapısı:
 * {
 *   "name": "Yetenek Puanı Geliştirme",
 *   "desc": "",
 *   "type": "Genel",
 *   "prerequisite": "Seviye 4+",
 *   "benefits": [
 *     "Seçtiğin bir yetenek puanını 2 artır...",
 *     "Bu Marifeti birden fazla kez seçebilirsin."
 *   ]
 * }
 */

// Feat tipi renkleri
const TYPE_COLORS = {
  'genel': { bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  'general': { bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  'savaş': { bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  'combat': { bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  'büyü': { bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  'magic': { bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  'default': { bg: 'bg-slate-500', light: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' }
};

const FeatDetail = ({ data }) => {
  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  const getTypeColor = () => {
    const type = (data.type || '').toLowerCase();
    return TYPE_COLORS[type] || TYPE_COLORS.default;
  };

  const typeColor = getTypeColor();

  return (
    <div className="space-y-6">
      {/* Ana Bilgi Kartı */}
      <div className={`${typeColor.light} border ${typeColor.border} rounded-2xl p-6`}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-16 h-16 bg-white border-2 ${typeColor.border} rounded-xl flex items-center justify-center shadow-sm`}>
            <Zap size={32} className={typeColor.text} />
          </div>
          
          <div className="flex-1 space-y-3">
            {/* Tip Badge */}
            {data.type && (
              <span className={`inline-block px-3 py-1 ${typeColor.bg} text-white rounded-lg text-xs font-bold`}>
                {data.type}
              </span>
            )}
            
            {/* Ön Koşul */}
            {data.prerequisite && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase">Ön Koşul</p>
                  <p className="text-sm font-bold text-amber-700">{data.prerequisite}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Faydalar */}
      {data.benefits && data.benefits.length > 0 && (
        <div className="bg-white border border-cbg rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100">
            <span className="text-sm font-bold text-emerald-700">Faydalar</span>
          </div>
          <div className="p-4 space-y-3">
            {data.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-sti leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Açıklama */}
      {data.desc && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <p className="text-sm text-sti leading-relaxed">{data.desc}</p>
        </div>
      )}
    </div>
  );
};

export default FeatDetail;
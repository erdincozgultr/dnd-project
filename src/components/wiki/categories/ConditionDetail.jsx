// src/components/wiki/categories/ConditionDetail.jsx

import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Condition (Durum) detay componenti
 * 
 * turkish_content yapısı:
 * {
 *   "name": "Bilinçsiz",
 *   "descriptions": [
 *     "* Bilinçsiz bir yaratık Aciz Kalmıştır...",
 *     "* Yaratık elindekileri düşürerek...",
 *     "Bilinçsiz durumundayken şu etkileri yaşarsın:..."
 *   ]
 * }
 */

const ConditionDetail = ({ data }) => {
  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  // descriptions array'ini birleştir ve parse et
  const getDescriptionHtml = () => {
    if (!data.descriptions || data.descriptions.length === 0) return '';
    
    // En uzun/en detaylı açıklamayı seç (genellikle son olan)
    const desc = data.descriptions[data.descriptions.length - 1];
    
    return desc
      // Bullet points
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.+<\/li>\n?)+/g, '<ul class="list-disc pl-5 space-y-2">$&</ul>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mt-3">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white border-2 border-orange-300 rounded-xl flex items-center justify-center shadow-sm">
            <AlertCircle size={32} className="text-orange-600" />
          </div>
          <div>
            <p className="text-[10px] text-orange-600 uppercase font-bold">Durum Etkisi</p>
            <p className="text-xl font-bold text-mtf">{data.name}</p>
          </div>
        </div>
      </div>

      {/* Açıklama */}
      {data.descriptions && data.descriptions.length > 0 && (
        <div className="bg-white border border-cbg rounded-xl p-6">
          <div 
            className="prose prose-sm max-w-none text-sti leading-relaxed
              prose-strong:text-mtf
              prose-ul:my-2 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: getDescriptionHtml() }}
          />
        </div>
      )}
    </div>
  );
};

export default ConditionDetail;
// src/components/wiki/categories/PlaneDetail.jsx

import React from 'react';
import { Globe } from 'lucide-react';

/**
 * Plane (Düzlem) detay componenti
 * 
 * turkish_content yapısı:
 * {
 *   "name": "Beyond the Material",
 *   "desc": "\"Maddi Düzlemin ötesinde..."
 * }
 */

const PlaneDetail = ({ data }) => {
  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  // Markdown formatını HTML'e çevir
  const formatDesc = (text) => {
    if (!text) return '';
    
    // Escape edilmiş newline'ları düzelt
    text = text.replace(/\\n/g, '\n');
    
    return text
      // Tırnak işaretlerini temizle
      .replace(/^"|"$/g, '')
      // Headers
      .replace(/### (.+)/g, '<h3 class="text-base font-bold text-mtf mt-6 mb-2">$1</h3>')
      .replace(/## (.+)/g, '<h2 class="text-lg font-bold text-mtf mt-6 mb-2">$2</h2>')
      // Bold italic (***text*** veya **_text_**)
      .replace(/\*\*_(.+?)_\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mt-3">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white border-2 border-cyan-300 rounded-xl flex items-center justify-center shadow-sm">
            <Globe size={32} className="text-cyan-600" />
          </div>
          <div>
            <p className="text-[10px] text-cyan-600 uppercase font-bold">Düzlem</p>
            <p className="text-xl font-bold text-mtf">{data.name}</p>
          </div>
        </div>
      </div>

      {/* Açıklama */}
      {data.desc && (
        <div className="bg-white border border-cbg rounded-xl p-6">
          <div 
            className="prose prose-sm max-w-none text-sti leading-relaxed
              prose-headings:text-mtf
              prose-strong:text-mtf
              prose-em:text-purple-600"
            dangerouslySetInnerHTML={{ __html: formatDesc(data.desc) }}
          />
        </div>
      )}
    </div>
  );
};

export default PlaneDetail;
// src/components/wiki/categories/ConditionDetail.jsx

import React from 'react';
import { AlertCircle, BookOpen, List } from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import MarkdownRenderer from '../../common/MarkdownRenderer';

/**
 * Condition (Durum/Etki) detay componenti
 * metadata ve turkishContent'i parse ederek gösterir
 */

// Condition teması - turuncu/uyarı renkleri
const CONDITION_THEME = {
  gradient: 'from-orange-50 to-orange-100',
  border: 'border-orange-200',
  iconBorder: 'border-orange-300',
  iconColor: 'text-orange-600',
  badge: 'bg-orange-500',
  textColor: 'text-orange-700',
  listBg: 'bg-orange-50',
  listBorder: 'border-orange-100'
};

const ConditionDetail = ({ metadata, turkishContent }) => {
  const tr = turkishContent || {};
  const meta = metadata || {};
  const source = getSourceDisplay(metadata);

  // Açıklamaları al
  const getDescriptions = () => {
    // Türkçe descriptions - string array
    if (tr.descriptions && Array.isArray(tr.descriptions)) {
      return tr.descriptions;
    }
    
    // Meta descriptions - object array
    if (meta.descriptions && Array.isArray(meta.descriptions)) {
      return meta.descriptions.map(d => d.desc || '');
    }
    
    // Tek desc alanı
    if (tr.desc) {
      return [tr.desc];
    }
    
    if (meta.desc) {
      return [meta.desc];
    }
    
    return [];
  };

  // İkon varsa
  const getIcon = () => {
    return meta.icon || null;
  };

  const descriptions = getDescriptions();
  const icon = getIcon();
  const theme = CONDITION_THEME;

  // Açıklamayı maddelere ayır
  const parseDescriptionItems = (desc) => {
    if (!desc) return [];
    
    // \n ile ayrılmış maddeleri bul
    const lines = desc.split('\n').filter(line => line.trim());
    
    return lines.map(line => {
      // Başındaki * veya - işaretlerini temizle
      return line.replace(/^\s*[\*\-]\s*/, '').trim();
    }).filter(item => item.length > 0);
  };

  // Tüm açıklamalardan maddeleri topla
  const getAllItems = () => {
    const allItems = [];
    
    descriptions.forEach(desc => {
      const items = parseDescriptionItems(desc);
      allItems.push(...items);
    });
    
    return allItems;
  };

  const items = getAllItems();

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl p-6`}>
        <div className="flex items-start gap-4">
          {/* İkon */}
          <div className="flex-shrink-0">
            <div className={`w-16 h-16 bg-white border-2 ${theme.iconBorder} rounded-xl flex items-center justify-center shadow-sm`}>
              {icon ? (
                <img src={icon} alt="Condition icon" className="w-8 h-8" />
              ) : (
                <AlertCircle size={32} className={theme.iconColor} />
              )}
            </div>
          </div>
          
          {/* Bilgi */}
          <div className="flex-1">
            {/* Tip Badge */}
            <span className={`inline-block px-3 py-1 ${theme.badge} text-white rounded-lg text-xs font-bold mb-2`}>
              Durum Etkisi
            </span>
            
            {/* Kısa açıklama */}
            <p className={`text-sm ${theme.textColor}`}>
              Bu durum etkisi, bir yaratığın yeteneklerini veya davranışlarını geçici olarak değiştirir.
            </p>
          </div>
        </div>
      </div>

      {/* Etkiler Listesi */}
      {items.length > 0 && (
        <div className="bg-white border border-cbg rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <List size={18} className={theme.iconColor} />
            <span className="text-sm font-bold text-mtf">Etkiler</span>
          </div>
          
          <div className="space-y-3">
            {items.map((item, index) => (
              <div 
                key={index} 
                className={`flex gap-3 ${theme.listBg} border ${theme.listBorder} rounded-lg p-3`}
              >
                <div className={`flex-shrink-0 w-6 h-6 ${theme.badge} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                  {index + 1}
                </div>
                <div className="flex-1 text-sm text-sti">
                  <MarkdownRenderer content={item} variant="compact" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ham Markdown (eğer madde listesi boşsa) */}
      {items.length === 0 && descriptions.length > 0 && (
        <div className="bg-white border border-cbg rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className={theme.iconColor} />
            <span className="text-sm font-bold text-mtf">Açıklama</span>
          </div>
          
          {descriptions.map((desc, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <MarkdownRenderer content={desc} variant="default" />
            </div>
          ))}
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

export default ConditionDetail;
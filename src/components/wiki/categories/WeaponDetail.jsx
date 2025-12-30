// src/components/wiki/categories/WeaponDetail.jsx

import React, { useState } from 'react';
import { Sword, Target, Zap, BookOpen, CircleDot, ChevronDown, ChevronUp } from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import { 
  getWeaponProperty, 
  getDamageTypeName,
  parseWeaponProperties 
} from '../../../constants/wikiTranslations';

/**
 * Silah detay componenti
 * metadata ve turkishContent'i parse ederek gösterir
 */
const WeaponDetail = ({ metadata, turkishContent }) => {
  const [expandedProp, setExpandedProp] = useState(null);
  
  // Türkçe içerik varsa onu, yoksa metadata kullan
  const tr = turkishContent || {};
  const meta = metadata || {};
  
  const source = getSourceDisplay(metadata);
  
  // Hasar tipi - önce Türkçe, sonra çeviri sözlüğü
  const getDamageType = () => {
    if (tr.damage_type) return tr.damage_type;
    if (meta.damage_type?.name) {
      return getDamageTypeName(meta.damage_type.name);
    }
    return 'Bilinmiyor';
  };

  // Hasar rengi
  const getDamageColor = () => {
    const type = (meta.damage_type?.key || tr.damage_type || '').toLowerCase();
    if (type.includes('bludgeon') || type.includes('ezici')) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (type.includes('pierc') || type.includes('delici')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (type.includes('slash') || type.includes('kesici')) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  // Menzil bilgisi
  const getRangeDisplay = () => {
    if (tr.range_normal && tr.range_long) {
      return `${tr.range_normal} / ${tr.range_long}`;
    }
    if (meta.range && meta.long_range) {
      return `${meta.range}ft / ${meta.long_range}ft`;
    }
    return null;
  };

  // Özellikler listesi - Türkçe açıklamalarla
  const getProperties = () => {
    // Türkçe içerikte string olarak geliyor
    if (tr.properties && typeof tr.properties === 'string') {
      return parseWeaponProperties(tr.properties);
    }
    
    // Metadata'da array olarak geliyor
    if (meta.properties && Array.isArray(meta.properties)) {
      return meta.properties.map(p => {
        const propName = p.property?.name || '';
        const translation = getWeaponProperty(propName);
        
        return {
          name: translation?.name || propName,
          desc: translation?.desc || p.property?.desc || '',
          detail: p.detail,
          original: propName
        };
      }).filter(p => p.name);
    }
    
    return [];
  };

  const properties = getProperties();
  const range = getRangeDisplay();
  const isSimple = tr.is_simple ?? meta.is_simple;

  // Özellik accordion toggle
  const toggleProperty = (index) => {
    setExpandedProp(expandedProp === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {/* Ana Stat Kartı */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          {/* Hasar Badge */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-white border-2 border-slate-300 rounded-xl flex flex-col items-center justify-center shadow-sm">
              <Sword size={24} className="text-slate-600 mb-1" />
              <span className="text-2xl font-black text-mtf">{tr.damage_dice || meta.damage_dice || '?'}</span>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mt-1 ${getDamageColor()}`}>
                {getDamageType()}
              </span>
            </div>
          </div>
          
          {/* Detaylar */}
          <div className="flex-1 space-y-3">
            {/* Tip Badge'leri */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                isSimple 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-purple-100 text-purple-700 border-purple-200'
              }`}>
                {isSimple ? 'Basit Silah' : 'Askeri Silah'}
              </span>
              
              {range && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  <Target size={12} className="inline mr-1" />
                  Menzilli
                </span>
              )}
            </div>
            
            {/* Mastery (varsa) */}
            {tr.mastery && (
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-[10px] font-bold text-sti uppercase mb-1">Ustalık</p>
                <p className="text-sm font-bold text-purple-600">{tr.mastery}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menzil Bilgisi (varsa) */}
      {range && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-mtf">Menzil</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-[10px] font-bold text-blue-600 uppercase">Normal</p>
              <p className="text-lg font-black text-blue-700">
                {tr.range_normal || `${meta.range}ft`}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Uzun</p>
              <p className="text-lg font-black text-slate-600">
                {tr.range_long || `${meta.long_range}ft`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Özellikler - Türkçe Açıklamalarla */}
      {properties.length > 0 && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-amber-500" />
            <span className="text-sm font-bold text-mtf">Özellikler</span>
          </div>
          
          <div className="space-y-2">
            {properties.map((prop, index) => (
              <div key={index} className="border border-amber-100 rounded-lg overflow-hidden">
                {/* Özellik Başlığı */}
                <button
                  onClick={() => prop.desc && toggleProperty(index)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 bg-amber-50 text-left ${
                    prop.desc ? 'cursor-pointer hover:bg-amber-100' : 'cursor-default'
                  } transition-colors`}
                >
                  <div className="flex items-center gap-2">
                    <CircleDot size={14} className="text-amber-500" />
                    <span className="text-sm font-bold text-amber-700">{prop.name}</span>
                    {prop.detail && (
                      <span className="text-xs text-amber-600/70">({prop.detail})</span>
                    )}
                  </div>
                  {prop.desc && (
                    expandedProp === index 
                      ? <ChevronUp size={16} className="text-amber-500" />
                      : <ChevronDown size={16} className="text-amber-500" />
                  )}
                </button>
                
                {/* Özellik Açıklaması */}
                {prop.desc && expandedProp === index && (
                  <div className="px-3 py-3 bg-white border-t border-amber-100">
                    <p className="text-sm text-sti leading-relaxed">{prop.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
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

export default WeaponDetail;
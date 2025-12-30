// src/components/wiki/categories/RaceDetail.jsx

import React, { useState } from 'react';
import { 
  Users, Eye, Footprints, Scale, Clock, Heart, 
  Languages, Sparkles, ChevronDown, ChevronUp, BookOpen,
  Shield
} from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import MarkdownRenderer from '../../common/MarkdownRenderer';

/**
 * Irk detay componenti
 * metadata ve turkishContent'i parse ederek gösterir
 */
const RaceDetail = ({ metadata, turkishContent }) => {
  const [expandedSubrace, setExpandedSubrace] = useState(null);
  
  const tr = turkishContent || {};
  const meta = metadata || {};
  const source = getSourceDisplay(metadata);

  // Markdown bold/italic temizle (basit metin için)
  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
      .replace(/\*\*_([^*]+)_\*\*/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1');
  };

  // Başlık ve içerik ayır (örn: "***Yaş.*** Açıklama" -> {title: "Yaş", content: "Açıklama"})
  const parseSection = (text) => {
    if (!text) return { title: '', content: '' };
    
    const match = text.match(/^\*\*[\*_]([^.*]+)\.?[\*_]\*\*\.?\s*(.*)/s);
    if (match) {
      return { title: match[1].trim(), content: match[2].trim() };
    }
    
    return { title: '', content: cleanText(text) };
  };

  // ASI (Ability Score Increase) parse
  const getASI = () => {
    const asiList = [];
    
    if (meta.asi && Array.isArray(meta.asi)) {
      meta.asi.forEach(a => {
        if (a.attributes && a.value) {
          a.attributes.forEach(attr => {
            asiList.push({ attribute: attr, value: a.value });
          });
        }
      });
    }
    
    return asiList;
  };

  // Traits'i Markdown olarak al
  const getTraits = () => {
    return tr.traits || meta.traits || null;
  };

  const subraces = tr.subraces || meta.subraces || [];
  const asi = getASI();

  // Hız bilgisi
  const getSpeed = () => {
    if (meta.speed?.walk) return `${meta.speed.walk} ft`;
    const speedMatch = (tr.speed_desc || meta.speed_desc || '').match(/(\d+)\s*(metre|meter|feet|ft)/i);
    if (speedMatch) return speedMatch[0];
    return null;
  };

  // Attribute adını Türkçe'ye çevir
  const translateAttribute = (attr) => {
    const translations = {
      'Strength': 'Kuvvet',
      'Dexterity': 'Çeviklik',
      'Constitution': 'Dayanıklılık',
      'Intelligence': 'Zeka',
      'Wisdom': 'Bilgelik',
      'Charisma': 'Karizma'
    };
    return translations[attr] || attr;
  };

  return (
    <div className="space-y-6">
      {/* Ana Bilgi Kartı */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          {/* Irk İkonu */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white border-2 border-indigo-300 rounded-xl flex items-center justify-center shadow-sm">
              <Users size={32} className="text-indigo-600" />
            </div>
          </div>
          
          {/* Temel Bilgiler */}
          <div className="flex-1">
            {/* ASI Badge'leri */}
            {asi.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {asi.map((a, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-xs font-bold"
                  >
                    +{a.value} {translateAttribute(a.attribute)}
                  </span>
                ))}
              </div>
            )}
            
            {/* ASI Açıklama */}
            {(tr.asi_desc || meta.asi_desc) && (
              <p className="text-sm text-indigo-700">
                {cleanText(tr.asi_desc || meta.asi_desc)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Temel Özellikler Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Boyut */}
        {(tr.size || meta.size) && (
          <div className="bg-white border border-cbg rounded-xl p-3 text-center">
            <Scale size={20} className="text-amber-500 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-sti uppercase">Boyut</p>
            <p className="text-sm font-bold text-mtf">
              {meta.size_raw || parseSection(tr.size || meta.size).content.split('.')[0]}
            </p>
          </div>
        )}

        {/* Hız */}
        {getSpeed() && (
          <div className="bg-white border border-cbg rounded-xl p-3 text-center">
            <Footprints size={20} className="text-green-500 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-sti uppercase">Hız</p>
            <p className="text-sm font-bold text-mtf">{getSpeed()}</p>
          </div>
        )}

        {/* Görüş */}
        {(tr.vision || meta.vision) && (
          <div className="bg-white border border-cbg rounded-xl p-3 text-center">
            <Eye size={20} className="text-purple-500 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-sti uppercase">Görüş</p>
            <p className="text-sm font-bold text-mtf">
              {parseSection(tr.vision || meta.vision).title || 'Karanlıkta Görme'}
            </p>
          </div>
        )}

        {/* Yaş */}
        {(tr.age || meta.age) && (
          <div className="bg-white border border-cbg rounded-xl p-3 text-center">
            <Clock size={20} className="text-blue-500 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-sti uppercase">Yaş</p>
            <p className="text-sm font-bold text-mtf truncate" title={cleanText(tr.age || meta.age)}>
              Detay ↓
            </p>
          </div>
        )}
      </div>

      {/* Detaylı Bilgiler */}
      <div className="space-y-4">
        {/* Yaş */}
        {(tr.age || meta.age) && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-blue-500" />
              <span className="text-sm font-bold text-mtf">
                {parseSection(tr.age || meta.age).title || 'Yaş'}
              </span>
            </div>
            <p className="text-sm text-sti leading-relaxed">
              {parseSection(tr.age || meta.age).content}
            </p>
          </div>
        )}

        {/* Boyut Detay */}
        {(tr.size || meta.size) && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale size={16} className="text-amber-500" />
              <span className="text-sm font-bold text-mtf">
                {parseSection(tr.size || meta.size).title || 'Boyut'}
              </span>
            </div>
            <p className="text-sm text-sti leading-relaxed">
              {parseSection(tr.size || meta.size).content}
            </p>
          </div>
        )}

        {/* Hizalanma */}
        {(tr.alignment || meta.alignment) && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart size={16} className="text-pink-500" />
              <span className="text-sm font-bold text-mtf">
                {parseSection(tr.alignment || meta.alignment).title || 'Hizalanma'}
              </span>
            </div>
            <p className="text-sm text-sti leading-relaxed">
              {parseSection(tr.alignment || meta.alignment).content}
            </p>
          </div>
        )}

        {/* Görüş Detay */}
        {(tr.vision || meta.vision) && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={16} className="text-purple-500" />
              <span className="text-sm font-bold text-mtf">
                {parseSection(tr.vision || meta.vision).title || 'Görüş'}
              </span>
            </div>
            <p className="text-sm text-sti leading-relaxed">
              {parseSection(tr.vision || meta.vision).content}
            </p>
          </div>
        )}

        {/* Diller */}
        {(tr.languages || meta.languages) && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Languages size={16} className="text-cyan-500" />
              <span className="text-sm font-bold text-mtf">
                {parseSection(tr.languages || meta.languages).title || 'Diller'}
              </span>
            </div>
            <p className="text-sm text-sti leading-relaxed">
              {parseSection(tr.languages || meta.languages).content}
            </p>
          </div>
        )}
      </div>

      {/* Irk Özellikleri (Traits) - Markdown destekli */}
      {getTraits() && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-amber-500" />
            <span className="text-sm font-bold text-mtf">Irk Özellikleri</span>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <MarkdownRenderer content={getTraits()} variant="compact" />
          </div>
        </div>
      )}

      {/* Alt Irklar (Subraces) */}
      {subraces.length > 0 && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-indigo-500" />
            <span className="text-sm font-bold text-mtf">Alt Irklar</span>
          </div>
          
          <div className="space-y-2">
            {subraces.map((subrace, index) => (
              <div key={index} className="border border-indigo-100 rounded-lg overflow-hidden">
                {/* Alt Irk Başlığı */}
                <button
                  onClick={() => setExpandedSubrace(expandedSubrace === index ? null : index)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Shield size={16} className="text-indigo-500" />
                    <span className="font-bold text-indigo-700">{subrace.name}</span>
                    {subrace.asi_desc && (
                      <span className="text-xs text-indigo-500">
                        ({cleanText(subrace.asi_desc)})
                      </span>
                    )}
                  </div>
                  {expandedSubrace === index 
                    ? <ChevronUp size={18} className="text-indigo-500" />
                    : <ChevronDown size={18} className="text-indigo-500" />
                  }
                </button>
                
                {/* Alt Irk Detayları */}
                {expandedSubrace === index && (
                  <div className="p-4 space-y-3">
                    {/* Açıklama */}
                    {subrace.desc && (
                      <div className="text-sm text-sti leading-relaxed">
                        <MarkdownRenderer content={subrace.desc} variant="compact" />
                      </div>
                    )}
                    
                    {/* Alt Irk Özellikleri */}
                    {subrace.traits && (
                      <div className="bg-indigo-50 rounded-lg p-3">
                        <MarkdownRenderer content={subrace.traits} variant="compact" />
                      </div>
                    )}
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

export default RaceDetail;
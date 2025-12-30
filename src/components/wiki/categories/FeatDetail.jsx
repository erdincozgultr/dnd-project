// src/components/wiki/categories/FeatDetail.jsx

import React from 'react';
import { Zap, AlertCircle, CheckCircle, BookOpen, Tag } from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import MarkdownRenderer from '../../common/MarkdownRenderer';

/**
 * Feat (Yetenek/Marifet) detay componenti
 * metadata ve turkishContent'i parse ederek gösterir
 */

// Statik Tailwind class mapping
const FEAT_THEMES = {
  general: {
    label: 'Genel',
    gradient: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    iconBorder: 'border-blue-300',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-500',
    textColor: 'text-blue-700'
  },
  fighting: {
    label: 'Muharebe Stili',
    gradient: 'from-red-50 to-red-100',
    border: 'border-red-200',
    iconBorder: 'border-red-300',
    iconColor: 'text-red-600',
    badge: 'bg-red-500',
    textColor: 'text-red-700'
  },
  origin: {
    label: 'Köken',
    gradient: 'from-purple-50 to-purple-100',
    border: 'border-purple-200',
    iconBorder: 'border-purple-300',
    iconColor: 'text-purple-600',
    badge: 'bg-purple-500',
    textColor: 'text-purple-700'
  },
  epic: {
    label: 'Epik Nimet',
    gradient: 'from-amber-50 to-amber-100',
    border: 'border-amber-200',
    iconBorder: 'border-amber-300',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-500',
    textColor: 'text-amber-700'
  },
  default: {
    label: 'Yetenek',
    gradient: 'from-slate-50 to-slate-100',
    border: 'border-slate-200',
    iconBorder: 'border-slate-300',
    iconColor: 'text-slate-600',
    badge: 'bg-slate-500',
    textColor: 'text-slate-700'
  }
};

const FeatDetail = ({ metadata, turkishContent }) => {
  const tr = turkishContent || {};
  const meta = metadata || {};
  const source = getSourceDisplay(metadata);

  // Feat tipi ve tema
  const getFeatTheme = () => {
    const type = (tr.type || meta.type || '').toLowerCase();
    
    if (type.includes('general') || type.includes('genel')) return FEAT_THEMES.general;
    if (type.includes('fighting') || type.includes('muharebe')) return FEAT_THEMES.fighting;
    if (type.includes('origin') || type.includes('köken')) return FEAT_THEMES.origin;
    if (type.includes('epic') || type.includes('epik')) return FEAT_THEMES.epic;
    
    return FEAT_THEMES.general; // Default to general
  };

  // Önkoşul
  const getPrerequisite = () => {
    return tr.prerequisite || meta.prerequisite || null;
  };

  // Benefits listesi
  const getBenefits = () => {
    // Türkçe benefits - string array
    if (tr.benefits && Array.isArray(tr.benefits)) {
      return tr.benefits.map(b => typeof b === 'string' ? b : b.desc || '');
    }
    
    // Meta benefits - object array
    if (meta.benefits && Array.isArray(meta.benefits)) {
      return meta.benefits.map(b => b.desc || '');
    }
    
    return [];
  };

  // Açıklama
  const getDescription = () => {
    return tr.desc || meta.desc || null;
  };

  const theme = getFeatTheme();
  const prerequisite = getPrerequisite();
  const benefits = getBenefits();
  const description = getDescription();
  const hasPrerequisite = meta.has_prerequisite || !!prerequisite;

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl p-6`}>
        <div className="flex items-start gap-4">
          {/* İkon */}
          <div className="flex-shrink-0">
            <div className={`w-16 h-16 bg-white border-2 ${theme.iconBorder} rounded-xl flex items-center justify-center shadow-sm`}>
              <Zap size={32} className={theme.iconColor} />
            </div>
          </div>
          
          {/* Bilgi */}
          <div className="flex-1">
            {/* Tip Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 ${theme.badge} text-white rounded-lg text-xs font-bold`}>
                <Tag size={12} />
                {theme.label}
              </span>
              
              {hasPrerequisite && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-xs font-bold">
                  <AlertCircle size={12} />
                  Önkoşul Var
                </span>
              )}
            </div>
            
            {/* Açıklama (varsa) */}
            {description && (
              <p className={`text-sm ${theme.textColor} leading-relaxed`}>
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Önkoşul */}
      {prerequisite && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-orange-500" />
            <span className="text-sm font-bold text-orange-700">Önkoşul</span>
          </div>
          <div className="text-sm text-orange-800">
            <MarkdownRenderer content={prerequisite} variant="compact" />
          </div>
        </div>
      )}

      {/* Faydalar/Benefits */}
      {benefits.length > 0 && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-green-500" />
            <span className="text-sm font-bold text-mtf">Faydalar</span>
          </div>
          
          <div className="space-y-3">
            {benefits.map((benefit, index) => {
              // Markdown bullet'ı temizle
              const cleanBenefit = benefit.replace(/^\*\s*/, '').trim();
              
              return (
                <div 
                  key={index} 
                  className="flex gap-3 bg-green-50 border border-green-100 rounded-lg p-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-sm text-sti">
                    <MarkdownRenderer content={cleanBenefit} variant="compact" />
                  </div>
                </div>
              );
            })}
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

export default FeatDetail;
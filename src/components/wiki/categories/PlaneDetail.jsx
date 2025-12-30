// src/components/wiki/categories/PlaneDetail.jsx

import React from 'react';
import { Globe, Map, BookOpen, Layers } from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import MarkdownRenderer from '../../common/MarkdownRenderer';

/**
 * Plane (Düzlem) detay componenti
 * metadata ve turkishContent'i parse ederek gösterir
 */

// Statik Tailwind class mapping - dinamik class'lar Tailwind'de çalışmaz
const PLANE_THEMES = {
  upper: {
    label: 'Üst Düzlem',
    gradient: 'from-amber-50 to-amber-100',
    border: 'border-amber-200',
    iconBorder: 'border-amber-300',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-500',
    textColor: 'text-amber-500'
  },
  lower: {
    label: 'Alt Düzlem',
    gradient: 'from-red-50 to-red-100',
    border: 'border-red-200',
    iconBorder: 'border-red-300',
    iconColor: 'text-red-600',
    badge: 'bg-red-500',
    textColor: 'text-red-500'
  },
  inner: {
    label: 'İç Düzlem',
    gradient: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    iconBorder: 'border-blue-300',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-500',
    textColor: 'text-blue-500'
  },
  outer: {
    label: 'Dış Düzlem',
    gradient: 'from-purple-50 to-purple-100',
    border: 'border-purple-200',
    iconBorder: 'border-purple-300',
    iconColor: 'text-purple-600',
    badge: 'bg-purple-500',
    textColor: 'text-purple-500'
  },
  elemental: {
    label: 'Elemental Düzlem',
    gradient: 'from-orange-50 to-orange-100',
    border: 'border-orange-200',
    iconBorder: 'border-orange-300',
    iconColor: 'text-orange-600',
    badge: 'bg-orange-500',
    textColor: 'text-orange-500'
  },
  astral: {
    label: 'Astral Düzlem',
    gradient: 'from-indigo-50 to-indigo-100',
    border: 'border-indigo-200',
    iconBorder: 'border-indigo-300',
    iconColor: 'text-indigo-600',
    badge: 'bg-indigo-500',
    textColor: 'text-indigo-500'
  },
  ethereal: {
    label: 'Eterik Düzlem',
    gradient: 'from-violet-50 to-violet-100',
    border: 'border-violet-200',
    iconBorder: 'border-violet-300',
    iconColor: 'text-violet-600',
    badge: 'bg-violet-500',
    textColor: 'text-violet-500'
  },
  transitive: {
    label: 'Geçiş Düzlemi',
    gradient: 'from-indigo-50 to-indigo-100',
    border: 'border-indigo-200',
    iconBorder: 'border-indigo-300',
    iconColor: 'text-indigo-600',
    badge: 'bg-indigo-500',
    textColor: 'text-indigo-500'
  },
  shadow: {
    label: 'Gölge Düzlemi',
    gradient: 'from-zinc-50 to-zinc-100',
    border: 'border-zinc-200',
    iconBorder: 'border-zinc-300',
    iconColor: 'text-zinc-600',
    badge: 'bg-zinc-500',
    textColor: 'text-zinc-500'
  },
  feywild: {
    label: 'Peri Diyarı',
    gradient: 'from-emerald-50 to-emerald-100',
    border: 'border-emerald-200',
    iconBorder: 'border-emerald-300',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-500',
    textColor: 'text-emerald-500'
  },
  material: {
    label: 'Maddi Düzlem',
    gradient: 'from-teal-50 to-teal-100',
    border: 'border-teal-200',
    iconBorder: 'border-teal-300',
    iconColor: 'text-teal-600',
    badge: 'bg-teal-500',
    textColor: 'text-teal-500'
  },
  beyond: {
    label: 'Düzlem',
    gradient: 'from-cyan-50 to-cyan-100',
    border: 'border-cyan-200',
    iconBorder: 'border-cyan-300',
    iconColor: 'text-cyan-600',
    badge: 'bg-cyan-500',
    textColor: 'text-cyan-500'
  },
  default: {
    label: 'Düzlem',
    gradient: 'from-cyan-50 to-cyan-100',
    border: 'border-cyan-200',
    iconBorder: 'border-cyan-300',
    iconColor: 'text-cyan-600',
    badge: 'bg-cyan-500',
    textColor: 'text-cyan-500'
  }
};

const PlaneDetail = ({ metadata, turkishContent }) => {
  const tr = turkishContent || {};
  const meta = metadata || {};
  const source = getSourceDisplay(metadata);

  // Açıklama metni - tırnak içinde gelebilir, temizle ve \n'leri dönüştür
  const getDescription = () => {
    let desc = tr.desc || meta.desc || '';
    
    // Başındaki ve sonundaki tırnakları temizle
    if (desc.startsWith('"') && desc.endsWith('"')) {
      desc = desc.slice(1, -1);
    }
    
    // Escaped \n karakterlerini gerçek satır sonuna çevir
    desc = desc.replace(/\\n/g, '\n');
    
    // \r\n kombinasyonlarını da temizle
    desc = desc.replace(/\\r\\n/g, '\n');
    desc = desc.replace(/\\r/g, '');
    
    return desc;
  };

  // Üst düzlem (parent)
  const getParent = () => {
    return meta.parent || null;
  };

  // Düzlem tipi belirleme - hem isim hem de parent'a bak
  const getPlaneTheme = () => {
    const name = (tr.name || meta.name || '').toLowerCase();
    const parent = (meta.parent || '').toLowerCase();
    
    // İsme göre kontrol
    if (name.includes('upper') || name.includes('üst')) return PLANE_THEMES.upper;
    if (name.includes('lower') || name.includes('alt')) return PLANE_THEMES.lower;
    if (name.includes('inner') || name.includes('iç')) return PLANE_THEMES.inner;
    if (name.includes('outer') || name.includes('dış')) return PLANE_THEMES.outer;
    if (name.includes('elemental') || name.includes('element')) return PLANE_THEMES.elemental;
    if (name.includes('astral')) return PLANE_THEMES.astral;
    if (name.includes('ethereal') || name.includes('eterik')) return PLANE_THEMES.ethereal;
    if (name.includes('shadow') || name.includes('gölge') || name.includes('shadowfell')) return PLANE_THEMES.shadow;
    if (name.includes('feywild') || name.includes('peri')) return PLANE_THEMES.feywild;
    if (name.includes('material') || name.includes('maddi')) return PLANE_THEMES.material;
    if (name.includes('beyond') || name.includes('ötesi')) return PLANE_THEMES.beyond;
    
    // Parent'a göre kontrol (Transitive Planes gibi)
    if (parent.includes('transitive')) return PLANE_THEMES.transitive;
    if (parent.includes('beyond')) return PLANE_THEMES.beyond;
    if (parent.includes('inner')) return PLANE_THEMES.inner;
    if (parent.includes('outer')) return PLANE_THEMES.outer;
    
    return PLANE_THEMES.default;
  };

  const description = getDescription();
  const parent = getParent();
  const theme = getPlaneTheme();

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl p-6`}>
        <div className="flex items-start gap-4">
          {/* İkon */}
          <div className="flex-shrink-0">
            <div className={`w-16 h-16 bg-white border-2 ${theme.iconBorder} rounded-xl flex items-center justify-center shadow-sm`}>
              <Globe size={32} className={theme.iconColor} />
            </div>
          </div>
          
          {/* Bilgi */}
          <div className="flex-1">
            {/* Tip Badge */}
            <span className={`inline-block px-3 py-1 ${theme.badge} text-white rounded-lg text-xs font-bold mb-2`}>
              {theme.label}
            </span>
            
            {/* Parent */}
            {parent && (
              <div className="flex items-center gap-2 text-sm text-sti">
                <Layers size={14} />
                <span>Üst Kategori: <span className="font-bold text-mtf">{parent}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Açıklama */}
      {description && (
        <div className="bg-white border border-cbg rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Map size={18} className={theme.textColor} />
            <span className="text-sm font-bold text-mtf">Açıklama</span>
          </div>
          
          <MarkdownRenderer content={description} variant="default" />
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

export default PlaneDetail;
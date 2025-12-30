// src/components/wiki/categories/BackgroundDetail.jsx

import React, { useState } from 'react';
import { 
  Scroll, Wrench, Languages, Briefcase, BookOpen,
  ChevronDown, ChevronUp, Sparkles, Users, Heart,
  Target, AlertCircle, Link2
} from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import MarkdownRenderer from '../../common/MarkdownRenderer';

/**
 * Background (Geçmiş) detay componenti
 * metadata ve turkishContent'i parse ederek gösterir
 */
const BackgroundDetail = ({ metadata, turkishContent }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  const tr = turkishContent || {};
  const meta = metadata || {};
  const source = getSourceDisplay(metadata);

  // Benefits array'den veri çek (metadata formatı)
  const getBenefit = (type) => {
    if (!meta.benefits) return null;
    return meta.benefits.find(b => b.type === type);
  };

  // Skill proficiencies
  const getSkillProficiencies = () => {
    return tr.skill_proficiencies || getBenefit('skill_proficiency')?.desc || null;
  };

  // Tool proficiencies
  const getToolProficiencies = () => {
    return tr.tool_proficiencies || getBenefit('tool_proficiency')?.desc || null;
  };

  // Languages
  const getLanguages = () => {
    return tr.languages || getBenefit('language')?.desc || null;
  };

  // Equipment
  const getEquipment = () => {
    return tr.equipment || getBenefit('equipment')?.desc || null;
  };

  // Feature
  const getFeature = () => {
    const benefit = getBenefit('feature');
    return {
      name: tr.feature_name || benefit?.name || 'Özellik',
      desc: tr.feature_desc || benefit?.desc || null
    };
  };

  // Suggested Characteristics - Markdown olarak render edilecek
  const getCharacteristics = () => {
    return tr.additional_features?.['suggested-characteristics'] || 
           getBenefit('suggested_characteristics')?.desc || null;
  };

  // Connection and Memento - Markdown olarak render edilecek
  const getConnectionMemento = () => {
    return tr.additional_features?.['connection-and-memento'] ||
           getBenefit('connection_and_memento')?.desc || null;
  };

  // Adventures and Advancement
  const getAdvancement = () => {
    return tr.additional_features?.['adventures-and-advancement'] ||
           getBenefit('adventures_and_advancement')?.desc || null;
  };

  // Ability Score Increase
  const getASI = () => {
    return tr.ability_score_increase || getBenefit('ability_score')?.desc || null;
  };

  const feature = getFeature();
  const characteristics = getCharacteristics();
  const connectionMemento = getConnectionMemento();

  // Section toggle
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Açıklama - Markdown destekli */}
      {(tr.desc || meta.desc) && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-6">
          <MarkdownRenderer 
            content={tr.desc || meta.desc} 
            variant="card"
          />
        </div>
      )}

      {/* Proficiency'ler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Beceri Yetkinlikleri */}
        {getSkillProficiencies() && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-blue-500" />
              <span className="text-sm font-bold text-mtf">Beceri Yetkinlikleri</span>
            </div>
            <p className="text-sm text-sti">{getSkillProficiencies()}</p>
          </div>
        )}

        {/* Araç Yetkinlikleri */}
        {getToolProficiencies() && getToolProficiencies() !== 'Ek Alet Yetkinlikleri Yok' && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wrench size={18} className="text-amber-500" />
              <span className="text-sm font-bold text-mtf">Araç Yetkinlikleri</span>
            </div>
            <p className="text-sm text-sti">{getToolProficiencies()}</p>
          </div>
        )}

        {/* Diller */}
        {getLanguages() && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Languages size={18} className="text-purple-500" />
              <span className="text-sm font-bold text-mtf">Diller</span>
            </div>
            <p className="text-sm text-sti">{getLanguages()}</p>
          </div>
        )}

        {/* Yetenek Puanı Artışı */}
        {getASI() && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-indigo-500" />
              <span className="text-sm font-bold text-mtf">Yetenek Artışı</span>
            </div>
            <p className="text-sm text-sti">{getASI()}</p>
          </div>
        )}
      </div>

      {/* Ekipman */}
      {getEquipment() && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={18} className="text-slate-500" />
            <span className="text-sm font-bold text-mtf">Ekipman</span>
          </div>
          <p className="text-sm text-sti leading-relaxed">{getEquipment()}</p>
        </div>
      )}

      {/* Özellik (Feature) */}
      {feature.desc && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Scroll size={18} className="text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">{feature.name}</span>
          </div>
          <MarkdownRenderer content={feature.desc} variant="card" />
        </div>
      )}

      {/* Macera ve İlerleme */}
      {getAdvancement() && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-amber-600" />
            <span className="text-sm font-bold text-amber-700">Maceralar ve İlerleme</span>
          </div>
          <MarkdownRenderer content={getAdvancement()} variant="compact" />
        </div>
      )}

      {/* Bağlantılar ve Yadigârlar */}
      {connectionMemento && (
        <div className="border border-cbg rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('connections')}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Link2 size={18} className="text-slate-500" />
              <span className="font-bold text-mtf">Bağlantılar & Yadigârlar</span>
            </div>
            {expandedSection === 'connections' 
              ? <ChevronUp size={18} className="text-slate-500" />
              : <ChevronDown size={18} className="text-slate-500" />
            }
          </button>
          
          {expandedSection === 'connections' && (
            <div className="p-4 bg-white">
              <MarkdownRenderer content={connectionMemento} variant="compact" />
            </div>
          )}
        </div>
      )}

      {/* Önerilen Karakteristikler */}
      {characteristics && (
        <div className="border border-cbg rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('characteristics')}
            className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users size={18} className="text-purple-500" />
              <span className="font-bold text-purple-700">Önerilen Karakteristikler</span>
            </div>
            {expandedSection === 'characteristics' 
              ? <ChevronUp size={18} className="text-purple-500" />
              : <ChevronDown size={18} className="text-purple-500" />
            }
          </button>
          
          {expandedSection === 'characteristics' && (
            <div className="p-4 bg-white">
              <MarkdownRenderer content={characteristics} variant="default" />
            </div>
          )}
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

export default BackgroundDetail;
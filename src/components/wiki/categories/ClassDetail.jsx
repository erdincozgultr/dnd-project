// src/components/wiki/categories/ClassDetail.jsx

import React, { useState } from 'react';
import { 
  BookOpen, Shield, Sword, Heart, Sparkles, 
  ChevronDown, ChevronUp, Scroll, Target, Wrench,
  GraduationCap, Users, Zap
} from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import MarkdownRenderer from '../../common/MarkdownRenderer';

/**
 * Class (Sınıf) detay componenti
 * Druid, Fighter, Wizard gibi karakter sınıfları için
 */

// Sınıf tema renkleri
const CLASS_THEMES = {
  druid: { gradient: 'from-emerald-50 to-emerald-100', border: 'border-emerald-200', iconColor: 'text-emerald-600', badge: 'bg-emerald-500' },
  wizard: { gradient: 'from-blue-50 to-blue-100', border: 'border-blue-200', iconColor: 'text-blue-600', badge: 'bg-blue-500' },
  fighter: { gradient: 'from-red-50 to-red-100', border: 'border-red-200', iconColor: 'text-red-600', badge: 'bg-red-500' },
  rogue: { gradient: 'from-slate-50 to-slate-100', border: 'border-slate-200', iconColor: 'text-slate-600', badge: 'bg-slate-500' },
  cleric: { gradient: 'from-amber-50 to-amber-100', border: 'border-amber-200', iconColor: 'text-amber-600', badge: 'bg-amber-500' },
  paladin: { gradient: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200', iconColor: 'text-yellow-600', badge: 'bg-yellow-500' },
  ranger: { gradient: 'from-green-50 to-green-100', border: 'border-green-200', iconColor: 'text-green-600', badge: 'bg-green-500' },
  barbarian: { gradient: 'from-orange-50 to-orange-100', border: 'border-orange-200', iconColor: 'text-orange-600', badge: 'bg-orange-500' },
  bard: { gradient: 'from-pink-50 to-pink-100', border: 'border-pink-200', iconColor: 'text-pink-600', badge: 'bg-pink-500' },
  monk: { gradient: 'from-cyan-50 to-cyan-100', border: 'border-cyan-200', iconColor: 'text-cyan-600', badge: 'bg-cyan-500' },
  sorcerer: { gradient: 'from-purple-50 to-purple-100', border: 'border-purple-200', iconColor: 'text-purple-600', badge: 'bg-purple-500' },
  warlock: { gradient: 'from-violet-50 to-violet-100', border: 'border-violet-200', iconColor: 'text-violet-600', badge: 'bg-violet-500' },
  artificer: { gradient: 'from-zinc-50 to-zinc-100', border: 'border-zinc-200', iconColor: 'text-zinc-600', badge: 'bg-zinc-500' },
  default: { gradient: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', iconColor: 'text-indigo-600', badge: 'bg-indigo-500' }
};

const ClassDetail = ({ metadata, turkishContent }) => {
  const [expandedArchetype, setExpandedArchetype] = useState(null);
  const [showTable, setShowTable] = useState(false);
  
  const tr = turkishContent || {};
  const meta = metadata || {};
  const source = getSourceDisplay(metadata);

  // Sınıf teması
  const getClassTheme = () => {
    const slug = (meta.slug || meta.original_slug || '').toLowerCase();
    return CLASS_THEMES[slug] || CLASS_THEMES.default;
  };

  const theme = getClassTheme();

  // Proficiencies
  const getProficiencies = () => {
    const profs = tr.proficiencies || {};
    const metaProfs = {
      armor: meta.prof_armor,
      weapons: meta.prof_weapons,
      tools: meta.prof_tools,
      skills: meta.prof_skills,
      saving_throws: meta.prof_saving_throws
    };
    
    return {
      armor: profs.armor || metaProfs.armor,
      weapons: profs.weapons || metaProfs.weapons,
      tools: profs.tools || metaProfs.tools,
      skills: profs.skills || metaProfs.skills,
      saving_throws: profs.saving_throws || metaProfs.saving_throws
    };
  };

  // HP bilgisi
  const getHP = () => {
    return {
      hitDice: tr.hit_dice || meta.hit_dice,
      level1: tr.hp_at_1st_level || meta.hp_at_1st_level,
      higher: tr.hp_at_higher_levels || meta.hp_at_higher_levels
    };
  };

  // Ekipman
  const getEquipment = () => {
    return tr.equipment || meta.equipment;
  };

  // Büyü yeteneği
  const getSpellcastingAbility = () => {
    return tr.spellcasting_ability || meta.spellcasting_ability;
  };

  // Sınıf tablosu
  const getClassTable = () => {
    return tr.table || meta.table;
  };

  // Archetypes/Subclasses
  const getArchetypes = () => {
    const trArchetypes = tr.archetypes || [];
    const metaArchetypes = meta.archetypes || [];
    
    // Türkçe varsa onu kullan, yoksa meta
    if (trArchetypes.length > 0) return trArchetypes;
    return metaArchetypes;
  };

  // Sınıf açıklaması (özellikler)
  const getDescription = () => {
    return tr.desc || meta.desc;
  };

  const proficiencies = getProficiencies();
  const hp = getHP();
  const equipment = getEquipment();
  const spellcastingAbility = getSpellcastingAbility();
  const classTable = getClassTable();
  const archetypes = getArchetypes();
  const description = getDescription();

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl p-6`}>
        <div className="flex items-start gap-4">
          {/* İkon */}
          <div className="flex-shrink-0">
            <div className={`w-16 h-16 bg-white border-2 ${theme.border} rounded-xl flex items-center justify-center shadow-sm`}>
              <GraduationCap size={32} className={theme.iconColor} />
            </div>
          </div>
          
          {/* Temel Bilgiler */}
          <div className="flex-1">
            {/* Hit Dice Badge */}
            {hp.hitDice && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 ${theme.badge} text-white rounded-lg text-xs font-bold`}>
                  <Heart size={12} />
                  Can Zarı: {hp.hitDice}
                </span>
                
                {spellcastingAbility && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500 text-white rounded-lg text-xs font-bold">
                    <Sparkles size={12} />
                    Büyü: {spellcastingAbility}
                  </span>
                )}
              </div>
            )}
            
            {/* HP at 1st level */}
            {hp.level1 && (
              <p className="text-sm text-sti">
                <span className="font-bold">1. Seviye HP:</span> {hp.level1}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Yetkinlikler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Zırh Yetkinliği */}
        {proficiencies.armor && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-slate-500" />
              <span className="text-sm font-bold text-mtf">Zırh Yetkinliği</span>
            </div>
            <p className="text-sm text-sti">{proficiencies.armor}</p>
          </div>
        )}

        {/* Silah Yetkinliği */}
        {proficiencies.weapons && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sword size={18} className="text-red-500" />
              <span className="text-sm font-bold text-mtf">Silah Yetkinliği</span>
            </div>
            <p className="text-sm text-sti">{proficiencies.weapons}</p>
          </div>
        )}

        {/* Araç Yetkinliği */}
        {proficiencies.tools && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wrench size={18} className="text-amber-500" />
              <span className="text-sm font-bold text-mtf">Araç Yetkinliği</span>
            </div>
            <p className="text-sm text-sti">{proficiencies.tools}</p>
          </div>
        )}

        {/* Beceri Yetkinliği */}
        {proficiencies.skills && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-blue-500" />
              <span className="text-sm font-bold text-mtf">Beceri Yetkinliği</span>
            </div>
            <p className="text-sm text-sti">{proficiencies.skills}</p>
          </div>
        )}

        {/* Kurtarma Atışı */}
        {proficiencies.saving_throws && (
          <div className="bg-white border border-cbg rounded-xl p-4 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-purple-500" />
              <span className="text-sm font-bold text-mtf">Kurtarma Atışı Yetkinliği</span>
            </div>
            <p className="text-sm text-sti">{proficiencies.saving_throws}</p>
          </div>
        )}
      </div>

      {/* Ekipman */}
      {equipment && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-slate-500" />
            <span className="text-sm font-bold text-mtf">Başlangıç Ekipmanı</span>
          </div>
          <MarkdownRenderer content={equipment} variant="compact" />
        </div>
      )}

      {/* Sınıf Tablosu */}
      {classTable && (
        <div className="border border-cbg rounded-xl overflow-hidden">
          <button
            onClick={() => setShowTable(!showTable)}
            className={`w-full flex items-center justify-between px-4 py-3 ${theme.gradient} hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={18} className={theme.iconColor} />
              <span className="font-bold text-mtf">Sınıf Tablosu</span>
            </div>
            {showTable 
              ? <ChevronUp size={18} className={theme.iconColor} />
              : <ChevronDown size={18} className={theme.iconColor} />
            }
          </button>
          
          {showTable && (
            <div className="p-4 bg-white overflow-x-auto">
              <MarkdownRenderer content={classTable} variant="default" />
            </div>
          )}
        </div>
      )}

      {/* Sınıf Özellikleri */}
      {description && (
        <div className="bg-white border border-cbg rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Scroll size={18} className={theme.iconColor} />
            <span className="text-sm font-bold text-mtf">Sınıf Özellikleri</span>
          </div>
          <MarkdownRenderer content={description} variant="default" />
        </div>
      )}

      {/* Alt Sınıflar (Archetypes) */}
      {archetypes.length > 0 && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className={theme.iconColor} />
            <span className="text-sm font-bold text-mtf">
              Alt Sınıflar ({meta.subtypes_name || 'Archetypes'})
            </span>
            <span className="text-xs text-sti">({archetypes.length} adet)</span>
          </div>
          
          <div className="space-y-2">
            {archetypes.map((archetype, index) => (
              <div key={index} className={`border ${theme.border} rounded-lg overflow-hidden`}>
                {/* Alt Sınıf Başlığı */}
                <button
                  onClick={() => setExpandedArchetype(expandedArchetype === index ? null : index)}
                  className={`w-full flex items-center justify-between px-4 py-3 ${theme.gradient} hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className={theme.iconColor} />
                    <span className="font-bold text-mtf">{archetype.name}</span>
                  </div>
                  {expandedArchetype === index 
                    ? <ChevronUp size={18} className={theme.iconColor} />
                    : <ChevronDown size={18} className={theme.iconColor} />
                  }
                </button>
                
                {/* Alt Sınıf Detayları */}
                {expandedArchetype === index && (
                  <div className="p-4 bg-white max-h-96 overflow-y-auto">
                    <MarkdownRenderer content={archetype.desc} variant="default" />
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

export default ClassDetail;
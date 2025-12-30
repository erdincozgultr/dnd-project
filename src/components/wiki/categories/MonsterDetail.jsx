// src/components/wiki/categories/MonsterDetail.jsx

import React, { useState } from 'react';
import { 
  Skull, Heart, Shield, Zap, Eye, Footprints,
  Swords, BookOpen, ChevronDown, ChevronUp,
  AlertTriangle, Star, Brain, MessageCircle
} from 'lucide-react';
import { getSourceDisplay } from '../../../constants/wikiConstants';
import MarkdownRenderer from '../../common/MarkdownRenderer';

/**
 * Monster (Yaratık) detay componenti
 * D&D 5e stat block formatında gösterim
 */

// CR renk skalası
const getCRColor = (cr) => {
  const crNum = typeof cr === 'string' ? parseFloat(cr) : cr;
  if (crNum <= 1) return { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50' };
  if (crNum <= 4) return { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50' };
  if (crNum <= 10) return { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50' };
  if (crNum <= 17) return { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50' };
  return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50' };
};

// Yaratık tipi renkleri
const TYPE_COLORS = {
  aberration: { bg: 'bg-purple-500', border: 'border-purple-200', gradient: 'from-purple-50 to-purple-100' },
  beast: { bg: 'bg-green-500', border: 'border-green-200', gradient: 'from-green-50 to-green-100' },
  celestial: { bg: 'bg-yellow-500', border: 'border-yellow-200', gradient: 'from-yellow-50 to-yellow-100' },
  construct: { bg: 'bg-slate-500', border: 'border-slate-200', gradient: 'from-slate-50 to-slate-100' },
  dragon: { bg: 'bg-red-500', border: 'border-red-200', gradient: 'from-red-50 to-red-100' },
  elemental: { bg: 'bg-cyan-500', border: 'border-cyan-200', gradient: 'from-cyan-50 to-cyan-100' },
  fey: { bg: 'bg-emerald-500', border: 'border-emerald-200', gradient: 'from-emerald-50 to-emerald-100' },
  fiend: { bg: 'bg-rose-500', border: 'border-rose-200', gradient: 'from-rose-50 to-rose-100' },
  giant: { bg: 'bg-orange-500', border: 'border-orange-200', gradient: 'from-orange-50 to-orange-100' },
  humanoid: { bg: 'bg-blue-500', border: 'border-blue-200', gradient: 'from-blue-50 to-blue-100' },
  monstrosity: { bg: 'bg-amber-500', border: 'border-amber-200', gradient: 'from-amber-50 to-amber-100' },
  ooze: { bg: 'bg-lime-500', border: 'border-lime-200', gradient: 'from-lime-50 to-lime-100' },
  plant: { bg: 'bg-teal-500', border: 'border-teal-200', gradient: 'from-teal-50 to-teal-100' },
  undead: { bg: 'bg-zinc-500', border: 'border-zinc-200', gradient: 'from-zinc-50 to-zinc-100' },
  default: { bg: 'bg-indigo-500', border: 'border-indigo-200', gradient: 'from-indigo-50 to-indigo-100' }
};

// Türkçe tip mapping
const TURKISH_TYPE_MAP = {
  'sapkın': 'aberration',
  'hayvan': 'beast',
  'cennetli': 'celestial',
  'yapı': 'construct',
  'ejderha': 'dragon',
  'elemental': 'elemental',
  'peri': 'fey',
  'iblis': 'fiend',
  'dev': 'giant',
  'insansı': 'humanoid',
  'yaratık': 'monstrosity',
  'balçık': 'ooze',
  'bitki': 'plant',
  'ölümsüz': 'undead'
};

// Ability score modifier hesaplama
const getModifier = (score) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const MonsterDetail = ({ metadata, turkishContent }) => {
  const [expandedSections, setExpandedSections] = useState({
    actions: true,
    reactions: false,
    bonusActions: false,
    legendary: false,
    special: true
  });
  
  const tr = turkishContent || {};
  const meta = metadata || {};
  const source = getSourceDisplay(metadata);

  // Tip teması
  const getTypeTheme = () => {
    const type = (tr.type || meta.type || '').toLowerCase();
    const englishType = TURKISH_TYPE_MAP[type] || type;
    return TYPE_COLORS[englishType] || TYPE_COLORS.default;
  };

  const theme = getTypeTheme();
  const crColor = getCRColor(meta.cr || meta.challenge_rating);

  // Temel bilgiler
  const getName = () => tr.name || meta.name;
  const getSize = () => tr.size || meta.size;
  const getType = () => tr.type || meta.type;
  const getSubtype = () => tr.subtype || meta.subtype;
  const getAlignment = () => tr.alignment || meta.alignment;
  const getAC = () => meta.armor_class;
  const getArmorDesc = () => tr.armor_desc || meta.armor_desc;
  const getHP = () => meta.hit_points;
  const getHitDice = () => tr.hit_dice || meta.hit_dice;
  const getCR = () => meta.challenge_rating || meta.cr;
  
  // Speed
  const getSpeed = () => {
    const speed = tr.speed || meta.speed || {};
    const parts = [];
    
    if (speed.walk) parts.push(`${speed.walk} ft.`);
    if (speed.fly) parts.push(`uçma ${speed.fly} ft.`);
    if (speed.swim) parts.push(`yüzme ${speed.swim} ft.`);
    if (speed.climb) parts.push(`tırmanma ${speed.climb} ft.`);
    if (speed.burrow) parts.push(`kazma ${speed.burrow} ft.`);
    
    return parts.join(', ') || '-';
  };

  // Ability Scores
  const getAbilityScores = () => ({
    str: tr.strength || meta.strength || 10,
    dex: tr.dexterity || meta.dexterity || 10,
    con: tr.constitution || meta.constitution || 10,
    int: tr.intelligence || meta.intelligence || 10,
    wis: tr.wisdom || meta.wisdom || 10,
    cha: tr.charisma || meta.charisma || 10
  });

  // Senses & Languages
  const getSenses = () => tr.senses || meta.senses || '-';
  const getLanguages = () => tr.languages || meta.languages || '-';

  // Damage/Condition Info
  const getDamageImmunities = () => tr.damage_immunities || meta.damage_immunities;
  const getDamageResistances = () => tr.damage_resistances || meta.damage_resistances;
  const getDamageVulnerabilities = () => tr.damage_vulnerabilities || meta.damage_vulnerabilities;
  const getConditionImmunities = () => tr.condition_immunities || meta.condition_immunities;

  // Actions
  const getActions = () => tr.actions || meta.actions || [];
  const getReactions = () => tr.reactions || meta.reactions || [];
  const getBonusActions = () => tr.bonus_actions || meta.bonus_actions || [];
  const getLegendaryActions = () => tr.legendary_actions || meta.legendary_actions || [];
  const getSpecialAbilities = () => tr.special_abilities || meta.special_abilities || [];
  const getLegendaryDesc = () => tr.legendary_desc || meta.legendary_desc;

  const abilities = getAbilityScores();
  const actions = getActions();
  const reactions = getReactions();
  const bonusActions = getBonusActions();
  const legendaryActions = getLegendaryActions();
  const specialAbilities = getSpecialAbilities();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Action/Ability render helper
  const renderAbilityBlock = (items, title, icon, sectionKey, color = 'red') => {
    if (!items || items.length === 0) return null;
    
    const colorClasses = {
      red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', title: 'text-red-700' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', title: 'text-blue-700' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', title: 'text-amber-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-500', title: 'text-purple-700' },
      emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', title: 'text-emerald-700' }
    };
    
    const c = colorClasses[color] || colorClasses.red;
    const Icon = icon;
    
    return (
      <div className={`border ${c.border} rounded-xl overflow-hidden`}>
        <button
          onClick={() => toggleSection(sectionKey)}
          className={`w-full flex items-center justify-between px-4 py-3 ${c.bg} hover:opacity-90 transition-opacity`}
        >
          <div className="flex items-center gap-2">
            <Icon size={18} className={c.icon} />
            <span className={`font-bold ${c.title}`}>{title}</span>
            <span className="text-xs text-sti">({items.length})</span>
          </div>
          {expandedSections[sectionKey] 
            ? <ChevronUp size={18} className={c.icon} />
            : <ChevronDown size={18} className={c.icon} />
          }
        </button>
        
        {expandedSections[sectionKey] && (
          <div className="bg-white divide-y divide-cbg">
            {items.map((item, index) => (
              <div key={index} className="p-4">
                <p className="font-bold text-mtf text-sm mb-1">{item.name}</p>
                <p className="text-sm text-sti leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Başlık Kartı - Stat Block Header */}
      <div className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl overflow-hidden`}>
        {/* Üst Bar - CR ve Tip */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/5">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 ${theme.bg} text-white rounded text-xs font-bold`}>
              {getType()}
            </span>
            {getSubtype() && (
              <span className="text-xs text-sti">({getSubtype()})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 ${crColor.bg} text-white rounded text-xs font-bold`}>
              CR {getCR()}
            </span>
          </div>
        </div>
        
        {/* Ana Bilgiler */}
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* İkon */}
            <div className="flex-shrink-0">
              <div className={`w-16 h-16 bg-white border-2 ${theme.border} rounded-xl flex items-center justify-center shadow-sm`}>
                <Skull size={32} className="text-red-500" />
              </div>
            </div>
            
            {/* Temel Bilgiler */}
            <div className="flex-1 space-y-2">
              {/* Size & Alignment */}
              <p className="text-sm text-sti">
                {getSize()} {getType()}, {getAlignment()}
              </p>
              
              {/* AC, HP, Speed Grid */}
              <div className="grid grid-cols-3 gap-2">
                {/* AC */}
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <Shield size={14} className="mx-auto text-blue-500 mb-1" />
                  <p className="text-lg font-bold text-mtf">{getAC()}</p>
                  <p className="text-[10px] text-sti uppercase">Zırh Sınıfı</p>
                  {getArmorDesc() && (
                    <p className="text-[9px] text-sti">({getArmorDesc()})</p>
                  )}
                </div>
                
                {/* HP */}
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <Heart size={14} className="mx-auto text-red-500 mb-1" />
                  <p className="text-lg font-bold text-mtf">{getHP()}</p>
                  <p className="text-[10px] text-sti uppercase">Can Puanı</p>
                  {getHitDice() && (
                    <p className="text-[9px] text-sti">({getHitDice()})</p>
                  )}
                </div>
                
                {/* Speed */}
                <div className="bg-white/80 rounded-lg p-2 text-center">
                  <Footprints size={14} className="mx-auto text-amber-500 mb-1" />
                  <p className="text-xs font-bold text-mtf leading-tight">{getSpeed()}</p>
                  <p className="text-[10px] text-sti uppercase">Hız</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="bg-white border border-cbg rounded-xl p-4">
        <div className="grid grid-cols-6 gap-2 text-center">
          {[
            { key: 'str', label: 'KUV', color: 'text-red-500' },
            { key: 'dex', label: 'ÇEV', color: 'text-green-500' },
            { key: 'con', label: 'DAY', color: 'text-amber-500' },
            { key: 'int', label: 'ZEK', color: 'text-blue-500' },
            { key: 'wis', label: 'BİL', color: 'text-purple-500' },
            { key: 'cha', label: 'KAR', color: 'text-pink-500' }
          ].map(({ key, label, color }) => (
            <div key={key} className="bg-slate-50 rounded-lg p-2">
              <p className={`text-[10px] font-bold ${color} uppercase`}>{label}</p>
              <p className="text-lg font-bold text-mtf">{abilities[key]}</p>
              <p className="text-xs text-sti">({getModifier(abilities[key])})</p>
            </div>
          ))}
        </div>
      </div>

      {/* Senses, Languages, Immunities */}
      <div className="bg-white border border-cbg rounded-xl p-4 space-y-3">
        {/* Senses */}
        <div className="flex items-start gap-2">
          <Eye size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs font-bold text-mtf">Duyular: </span>
            <span className="text-xs text-sti">{getSenses()}</span>
          </div>
        </div>
        
        {/* Languages */}
        <div className="flex items-start gap-2">
          <MessageCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs font-bold text-mtf">Diller: </span>
            <span className="text-xs text-sti">{getLanguages()}</span>
          </div>
        </div>
        
        {/* Damage Info */}
        {getDamageImmunities() && (
          <div className="flex items-start gap-2">
            <Shield size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-mtf">Hasar Bağışıklıkları: </span>
              <span className="text-xs text-sti">{getDamageImmunities()}</span>
            </div>
          </div>
        )}
        
        {getDamageResistances() && (
          <div className="flex items-start gap-2">
            <Shield size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-mtf">Hasar Dirençleri: </span>
              <span className="text-xs text-sti">{getDamageResistances()}</span>
            </div>
          </div>
        )}
        
        {getDamageVulnerabilities() && (
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-mtf">Hasar Zafiyetleri: </span>
              <span className="text-xs text-sti">{getDamageVulnerabilities()}</span>
            </div>
          </div>
        )}
        
        {getConditionImmunities() && (
          <div className="flex items-start gap-2">
            <Star size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-mtf">Durum Bağışıklıkları: </span>
              <span className="text-xs text-sti">{getConditionImmunities()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Special Abilities */}
      {renderAbilityBlock(specialAbilities, 'Özel Yetenekler', Brain, 'special', 'purple')}

      {/* Actions */}
      {renderAbilityBlock(actions, 'Eylemler', Swords, 'actions', 'red')}

      {/* Bonus Actions */}
      {renderAbilityBlock(bonusActions, 'Bonus Eylemler', Zap, 'bonusActions', 'amber')}

      {/* Reactions */}
      {renderAbilityBlock(reactions, 'Tepkiler', AlertTriangle, 'reactions', 'blue')}

      {/* Legendary Actions */}
      {legendaryActions && legendaryActions.length > 0 && (
        <div className="border border-amber-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('legendary')}
            className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-2">
              <Star size={18} className="text-amber-500" />
              <span className="font-bold text-amber-700">Efsanevi Eylemler</span>
            </div>
            {expandedSections.legendary 
              ? <ChevronUp size={18} className="text-amber-500" />
              : <ChevronDown size={18} className="text-amber-500" />
            }
          </button>
          
          {expandedSections.legendary && (
            <div className="bg-white p-4">
              {getLegendaryDesc() && (
                <p className="text-sm text-sti mb-4 italic">{getLegendaryDesc()}</p>
              )}
              <div className="divide-y divide-cbg">
                {legendaryActions.map((action, index) => (
                  <div key={index} className="py-3 first:pt-0 last:pb-0">
                    <p className="font-bold text-mtf text-sm mb-1">{action.name}</p>
                    <p className="text-sm text-sti">{action.desc}</p>
                  </div>
                ))}
              </div>
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

export default MonsterDetail;
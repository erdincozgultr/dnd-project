import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState } from 'react';
import { 
  Skull, Heart, Shield, Footprints, Eye, MessageCircle,
  Swords, ChevronDown, ChevronUp, Zap, AlertTriangle, Star, Brain
} from 'lucide-react';

/**
 * Monster (Canavar) detay componenti
 * 
 * turkish_content yapısı:
 * {
 *   "name": "Çakaladam",
 *   "desc": "",
 *   "size": "Orta",
 *   "type": "İblis",
 *   "subtype": "",
 *   "alignment": "",
 *   "armor_class": 12,
 *   "armor_desc": "",
 *   "hit_points": 18,
 *   "hit_dice": "4d8",
 *   "speed": { "walk": 12 },
 *   "strength": 10,
 *   "dexterity": 14,
 *   "constitution": 10,
 *   "intelligence": 12,
 *   "wisdom": 10,
 *   "charisma": 14,
 *   "senses": "Karanlıkta Görme 18m, Pasif Algı 12",
 *   "languages": "Sıradan",
 *   "challenge_rating": "1/2",
 *   "special_abilities": [{ "name": "...", "desc": "..." }],
 *   "actions": [{ "name": "...", "desc": "..." }],
 *   "reactions": null,
 *   "legendary_actions": null
 * }
 */

// CR renk skalası
const getCRColor = (cr) => {
  const crStr = String(cr);
  if (crStr.includes('/') || parseFloat(cr) <= 1) return { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50' };
  if (parseFloat(cr) <= 4) return { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50' };
  if (parseFloat(cr) <= 10) return { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50' };
  if (parseFloat(cr) <= 17) return { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50' };
  return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50' };
};

// Modifier hesaplama
const getModifier = (score) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const MonsterDetail = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState({
    special: true, actions: true, reactions: false, legendary: false
  });

  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  const crColor = getCRColor(data.challenge_rating);

  // Hız formatlama
  const formatSpeed = () => {
    const speed = data.speed;
    if (!speed) return '-';
    if (typeof speed === 'string') return speed;
    
    const parts = [];
    if (speed.walk) parts.push(`${speed.walk} ft.`);
    if (speed.fly) parts.push(`uçma ${speed.fly} ft.`);
    if (speed.swim) parts.push(`yüzme ${speed.swim} ft.`);
    if (speed.climb) parts.push(`tırmanma ${speed.climb} ft.`);
    if (speed.burrow) parts.push(`kazma ${speed.burrow} ft.`);
    return parts.join(', ') || '-';
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Ability block render
  const renderAbilityBlock = (items, title, icon, sectionKey, colorScheme = 'red') => {
    if (!items || items.length === 0) return null;
    
    const colors = {
      red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', title: 'text-red-700' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', title: 'text-blue-700' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', title: 'text-amber-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-500', title: 'text-purple-700' }
    };
    const c = colors[colorScheme] || colors.red;
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
      {/* Başlık Kartı */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black/5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-500 text-white rounded text-xs font-bold">
              {data.type}
            </span>
            {data.subtype && (
              <span className="text-xs text-sti">({data.subtype})</span>
            )}
          </div>
          <span className={`px-2 py-0.5 ${crColor.bg} text-white rounded text-xs font-bold`}>
            CR {data.challenge_rating}
          </span>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-sti mb-3">
            {data.size} {data.type}{data.alignment ? `, ${data.alignment}` : ''}
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <Shield size={16} className="mx-auto text-blue-500 mb-1" />
              <p className="text-xl font-bold text-mtf">{data.armor_class}</p>
              <p className="text-[10px] text-sti uppercase">AC</p>
              {data.armor_desc && <p className="text-[9px] text-sti">({data.armor_desc})</p>}
            </div>
            
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <Heart size={16} className="mx-auto text-red-500 mb-1" />
              <p className="text-xl font-bold text-mtf">{data.hit_points}</p>
              <p className="text-[10px] text-sti uppercase">HP</p>
              {data.hit_dice && <p className="text-[9px] text-sti">({data.hit_dice})</p>}
            </div>
            
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <Footprints size={16} className="mx-auto text-amber-500 mb-1" />
              <p className="text-sm font-bold text-mtf leading-tight">{formatSpeed()}</p>
              <p className="text-[10px] text-sti uppercase">Hız</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="bg-white border border-cbg rounded-xl p-4">
        <div className="grid grid-cols-6 gap-2 text-center">
          {[
            { key: 'strength', label: 'KUV', color: 'text-red-500' },
            { key: 'dexterity', label: 'ÇEV', color: 'text-green-500' },
            { key: 'constitution', label: 'DAY', color: 'text-amber-500' },
            { key: 'intelligence', label: 'ZEK', color: 'text-blue-500' },
            { key: 'wisdom', label: 'BİL', color: 'text-purple-500' },
            { key: 'charisma', label: 'KAR', color: 'text-pink-500' }
          ].map(({ key, label, color }) => (
            <div key={key} className="bg-slate-50 rounded-lg p-2">
              <p className={`text-[10px] font-bold ${color} uppercase`}>{label}</p>
              <p className="text-lg font-bold text-mtf">{data[key] || 10}</p>
              <p className="text-xs text-sti">({getModifier(data[key] || 10)})</p>
            </div>
          ))}
        </div>
      </div>

      {/* Duyular & Diller */}
      {(data.senses || data.languages) && (
        <div className="bg-white border border-cbg rounded-xl p-4 space-y-3">
          {data.senses && (
            <div className="flex items-start gap-2">
              <Eye size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-mtf">Duyular: </span>
                <span className="text-xs text-sti">{data.senses}</span>
              </div>
            </div>
          )}
          
          {data.languages && (
            <div className="flex items-start gap-2">
              <MessageCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-mtf">Diller: </span>
                <span className="text-xs text-sti">{data.languages}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Abilities & Actions */}
      {renderAbilityBlock(data.special_abilities, 'Özel Yetenekler', Brain, 'special', 'purple')}
      {renderAbilityBlock(data.actions, 'Eylemler', Swords, 'actions', 'red')}
      {renderAbilityBlock(data.reactions, 'Tepkiler', AlertTriangle, 'reactions', 'blue')}
      {renderAbilityBlock(data.legendary_actions, 'Efsanevi Eylemler', Star, 'legendary', 'amber')}

      {/* Açıklama */}
      {data.desc && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <p className="text-sm text-sti leading-relaxed">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.desc}</ReactMarkdown></p>
        </div>
      )}
    </div>
  );
};

export default MonsterDetail;
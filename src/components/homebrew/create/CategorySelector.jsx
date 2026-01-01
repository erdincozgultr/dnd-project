// src/components/homebrew/create/CategorySelector.jsx

import React from 'react';
import { 
  Sparkles, Swords, Users, Shield, ScrollText, Award, 
  Wand2, Axe, Flame, Cloud, Zap 
} from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '../../../utils/homebrewTemplates';

/**
 * Kategori iconları
 * Backend enum isimleri ile uyumlu: SPELLS, MONSTERS, RACES, etc.
 */
const CATEGORY_ICONS = {
  SPELLS: Sparkles,      // ✅ SPELL → SPELLS
  MONSTERS: Swords,      // ✅ MONSTER → MONSTERS
  RACES: Users,          // ✅ RACE → RACES
  CLASSES: Shield,       // ✅ CLASS → CLASSES
  BACKGROUND: ScrollText,
  FEATS: Award,          // ✅ FEAT → FEATS
  MAGIC_ITEM: Wand2,
  WEAPON: Axe,
  ARMOR: Shield,
  CONDITIONS: Flame,     // ✅ CONDITION → CONDITIONS
  PLANES: Cloud,         // ✅ PLANE → PLANES
  CUSTOM: Zap
};

const CategorySelector = ({ value, onChange, disabled = false }) => {
  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-mtf mb-2">
          Kategori Seçin *
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                     focus:border-cta focus:outline-none transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          required
        >
          <option value="">-- Kategori Seçin --</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </div>

      {/* Kategori açıklaması */}
      {value && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            {React.createElement(CATEGORY_ICONS[value], {
              size: 20,
              className: "text-purple-500 flex-shrink-0 mt-0.5"
            })}
            <div>
              <p className="text-sm font-bold text-purple-700 mb-1">
                {CATEGORY_LABELS[value]}
              </p>
              <p className="text-xs text-purple-600">
                {CATEGORY_DESCRIPTIONS[value]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
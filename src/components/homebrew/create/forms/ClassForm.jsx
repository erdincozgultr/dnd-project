// src/components/homebrew/create/forms/ClassForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const ClassForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const HIT_DICE = ['d6', 'd8', 'd10', 'd12'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Can Zarı *</label>
          <select
            value={formData.hit_die}
            onChange={(e) => handleChange('hit_die', e.target.value)}
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          >
            {HIT_DICE.map(die => (
              <option key={die} value={die}>{die}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Ana Yetenek *</label>
          <input
            type="text"
            value={formData.primary_ability}
            onChange={(e) => handleChange('primary_ability', e.target.value)}
            placeholder="Güç, Çeviklik, Zeka..."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Koruma Atışları</label>
        <input
          type="text"
          value={formData.saving_throws}
          onChange={(e) => handleChange('saving_throws', e.target.value)}
          placeholder="Güç, Dayanıklılık"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Zırh Yeterliliği</label>
        <input
          type="text"
          value={formData.armor_proficiency}
          onChange={(e) => handleChange('armor_proficiency', e.target.value)}
          placeholder="Hafif zırh, orta zırh, kalkanlar"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Silah Yeterliliği</label>
        <input
          type="text"
          value={formData.weapon_proficiency}
          onChange={(e) => handleChange('weapon_proficiency', e.target.value)}
          placeholder="Basit silahlar, askeri silahlar"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
        />
      </div>

      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Sınıf Açıklaması"
        required
      />
    </div>
  );
};

export default ClassForm;
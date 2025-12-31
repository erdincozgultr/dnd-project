// src/components/homebrew/create/forms/MagicItemForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const MagicItemForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const RARITIES = ['Sıradan', 'Olağandışı', 'Nadir', 'Çok Nadir', 'Efsanevi', 'Yapay'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Tür *</label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            placeholder="Harika Eşya, Silah, Zırh..."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Nadirlik *</label>
          <select
            value={formData.rarity}
            onChange={(e) => handleChange('rarity', e.target.value)}
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          >
            {RARITIES.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.attunement}
            onChange={(e) => handleChange('attunement', e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-sm text-mtf">Uyum gerektirir</span>
        </label>
      </div>

      {formData.attunement && (
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Uyum Gereksinimleri</label>
          <input
            type="text"
            value={formData.attunement_requirements}
            onChange={(e) => handleChange('attunement_requirements', e.target.value)}
            placeholder="Büyücü veya Sihirbaz tarafından"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>
      )}

      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Sihirli Eşya Açıklaması"
        required
      />
    </div>
  );
};

export default MagicItemForm;
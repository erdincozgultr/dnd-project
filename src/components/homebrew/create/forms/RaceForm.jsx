// src/components/homebrew/create/forms/RaceForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const RaceForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const SIZES = ['Minik', 'Küçük', 'Orta', 'Büyük'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Tür</label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            placeholder="insansı, fey..."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Boyut *</label>
          <select
            value={formData.size}
            onChange={(e) => handleChange('size', e.target.value)}
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          >
            {SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Hız *</label>
          <input
            type="text"
            value={formData.speed}
            onChange={(e) => handleChange('speed', e.target.value)}
            placeholder="30 ft."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Yaş</label>
          <input
            type="text"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            placeholder="Olgunluk yaşı ve ömür"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Yetenek Skoru Artışı</label>
        <input
          type="text"
          value={formData.ability_score_increase}
          onChange={(e) => handleChange('ability_score_increase', e.target.value)}
          placeholder="Güç +2, Çeviklik +1"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Diller</label>
        <input
          type="text"
          value={formData.languages}
          onChange={(e) => handleChange('languages', e.target.value)}
          placeholder="Ortak Dil, Cüce Dili"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
        />
      </div>

      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Irk Açıklaması"
        required
      />
    </div>
  );
};

export default RaceForm;
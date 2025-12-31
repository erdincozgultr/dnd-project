// src/components/homebrew/create/forms/ArmorForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const ArmorForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const ARMOR_TYPES = ['Hafif Zırh', 'Orta Zırh', 'Ağır Zırh', 'Kalkan'];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Tür *</label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          required
        >
          {ARMOR_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Zırh Sınıfı *</label>
          <input
            type="text"
            value={formData.armor_class}
            onChange={(e) => handleChange('armor_class', e.target.value)}
            placeholder="11 + ÇEV değiştirici"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Güç Gereksinimi</label>
          <input
            type="text"
            value={formData.strength_requirement}
            onChange={(e) => handleChange('strength_requirement', e.target.value)}
            placeholder="Gür 13"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Ağırlık</label>
          <input
            type="text"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            placeholder="10 lb."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Fiyat</label>
          <input
            type="text"
            value={formData.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
            placeholder="50 gp"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.stealth_disadvantage}
            onChange={(e) => handleChange('stealth_disadvantage', e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-sm text-mtf">Gizlilik dezavantajı</span>
        </label>
      </div>

      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Zırh Açıklaması"
        required
      />
    </div>
  );
};

export default ArmorForm;
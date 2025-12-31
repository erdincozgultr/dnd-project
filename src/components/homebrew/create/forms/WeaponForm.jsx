// src/components/homebrew/create/forms/WeaponForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const WeaponForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const CATEGORIES = [
    'Basit Yakın Dövüş',
    'Basit Uzak Menzil',
    'Askeri Yakın Dövüş',
    'Askeri Uzak Menzil'
  ];

  const DAMAGE_TYPES = ['darbe', 'delme', 'kesme'];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Kategori *</label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          required
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Hasar Zarı *</label>
          <input
            type="text"
            value={formData.damage?.dice || ''}
            onChange={(e) => handleChange('damage', { ...formData.damage, dice: e.target.value })}
            placeholder="1d6, 2d4..."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Hasar Tipi *</label>
          <select
            value={formData.damage?.type || ''}
            onChange={(e) => handleChange('damage', { ...formData.damage, type: e.target.value })}
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          >
            <option value="">-- Seçin --</option>
            {DAMAGE_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Ağırlık</label>
          <input
            type="text"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            placeholder="1 lb."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Fiyat</label>
          <input
            type="text"
            value={formData.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
            placeholder="10 gp"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Menzil (Uzak silahlar için)</label>
        <input
          type="text"
          value={formData.range}
          onChange={(e) => handleChange('range', e.target.value)}
          placeholder="30/120 ft."
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
        />
      </div>

      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Silah Açıklaması"
        required
      />
    </div>
  );
};

export default WeaponForm;
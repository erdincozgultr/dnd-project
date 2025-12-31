// src/components/homebrew/create/forms/MonsterForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const MonsterForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = { ...newArray[index], [key]: value };
    onChange({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field, defaultValue = {}) => {
    onChange({
      ...formData,
      [field]: [...(formData[field] || []), defaultValue]
    });
  };

  const removeArrayItem = (field, index) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    onChange({ ...formData, [field]: newArray });
  };

  const SIZES = ['Minik', 'Küçük', 'Orta', 'Büyük', 'Kocaman', 'Dev'];

  return (
    <div className="space-y-6">
      {/* Boyut & Tür */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Tür *</label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            placeholder="insansı, canavar, ejderha..."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          />
        </div>
      </div>

      {/* Hizalama & ZS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Hizalama</label>
          <input
            type="text"
            value={formData.alignment}
            onChange={(e) => handleChange('alignment', e.target.value)}
            placeholder="tarafsız, kötü huylu, hayırsever..."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Zırh Sınıfı *</label>
          <input
            type="number"
            min="1"
            max="30"
            value={formData.armor_class}
            onChange={(e) => handleChange('armor_class', parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          />
        </div>
      </div>

      {/* Can Puanları & Hız */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Can Puanları *</label>
          <input
            type="text"
            value={formData.hit_points}
            onChange={(e) => handleChange('hit_points', e.target.value)}
            placeholder="10 (2d8 + 2)"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Hız</label>
          <input
            type="text"
            value={formData.speed}
            onChange={(e) => handleChange('speed', e.target.value)}
            placeholder="30 ft., uçuş 60 ft."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>
      </div>

      {/* Yetenek Skorları */}
      <div>
        <p className="text-sm font-bold text-mtf mb-2">Yetenek Skorları *</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { key: 'strength', label: 'GÜÇ' },
            { key: 'dexterity', label: 'ÇEV' },
            { key: 'constitution', label: 'DAY' },
            { key: 'intelligence', label: 'ZEK' },
            { key: 'wisdom', label: 'BİL' },
            { key: 'charisma', label: 'KAR' }
          ].map(ability => (
            <div key={ability.key}>
              <label className="text-xs text-sti uppercase block mb-1">{ability.label}</label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData[ability.key]}
                onChange={(e) => handleChange(ability.key, parseInt(e.target.value))}
                className="w-full px-2 py-2 bg-mbg border border-cbg rounded text-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Duyular & Diller */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Duyular</label>
          <input
            type="text"
            value={formData.senses}
            onChange={(e) => handleChange('senses', e.target.value)}
            placeholder="karanlık görüş 60 ft., pasif Algı 10"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Diller</label>
          <input
            type="text"
            value={formData.languages}
            onChange={(e) => handleChange('languages', e.target.value)}
            placeholder="Ortak Dil, Ejderha Dili"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>
      </div>

      {/* Tehdit Sıralaması */}
      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Tehdit Sıralaması</label>
        <input
          type="text"
          value={formData.challenge_rating}
          onChange={(e) => handleChange('challenge_rating', e.target.value)}
          placeholder="1/8, 1, 5, 10..."
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
        />
      </div>

      {/* Eylemler */}
      <div>
        <p className="text-sm font-bold text-mtf mb-2">Eylemler</p>
        {(formData.actions || []).map((action, index) => (
          <div key={index} className="mb-3 p-3 bg-slate-50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                value={action.name || ''}
                onChange={(e) => handleArrayChange('actions', index, 'name', e.target.value)}
                placeholder="Eylem adı"
                className="flex-1 px-3 py-2 bg-white border border-cbg rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('actions', index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
            <textarea
              value={action.desc || ''}
              onChange={(e) => handleArrayChange('actions', index, 'desc', e.target.value)}
              placeholder="Eylem açıklaması"
              className="w-full px-3 py-2 bg-white border border-cbg rounded-lg"
              rows={2}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('actions', { name: '', desc: '' })}
          className="text-sm text-cta font-bold hover:underline"
        >
          + Eylem Ekle
        </button>
      </div>

      {/* Açıklama */}
      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Yaratık Açıklaması"
        required
      />
    </div>
  );
};

export default MonsterForm;
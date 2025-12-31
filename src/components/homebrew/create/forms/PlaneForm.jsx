// src/components/homebrew/create/forms/PlaneForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const PlaneForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Tür</label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            placeholder="İç Düzlem, Dış Düzlem..."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">Hizalama</label>
          <input
            type="text"
            value={formData.alignment}
            onChange={(e) => handleChange('alignment', e.target.value)}
            placeholder="Tarafsız, Kötü Huylu..."
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Sakinler</label>
        <textarea
          value={formData.inhabitants}
          onChange={(e) => handleChange('inhabitants', e.target.value)}
          placeholder="Düzlemde yaşayan yaratıklar"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl resize-y"
          rows={3}
        />
      </div>

      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Düzlem Açıklaması"
        required
      />
    </div>
  );
};

export default PlaneForm;
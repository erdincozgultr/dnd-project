// src/components/homebrew/create/forms/BackgroundForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const BackgroundForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Beceri Yeterlilikleri *</label>
        <input
          type="text"
          value={formData.skill_proficiencies}
          onChange={(e) => handleChange('skill_proficiencies', e.target.value)}
          placeholder="Atletizm, İkna"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Araç Yeterlilikleri</label>
        <input
          type="text"
          value={formData.tool_proficiencies}
          onChange={(e) => handleChange('tool_proficiencies', e.target.value)}
          placeholder="Hırsız aletleri"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Diller</label>
        <input
          type="text"
          value={formData.languages}
          onChange={(e) => handleChange('languages', e.target.value)}
          placeholder="İki dil seçebilirsiniz"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Başlangıç Ekipmanı</label>
        <textarea
          value={formData.equipment}
          onChange={(e) => handleChange('equipment', e.target.value)}
          placeholder="Eşyaları listeleyin"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl resize-y"
          rows={3}
        />
      </div>

      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Geçmiş Açıklaması"
        required
      />
    </div>
  );
};

export default BackgroundForm;
// src/components/homebrew/create/forms/FeatForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const FeatForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-mtf mb-2">Ön Koşul</label>
        <input
          type="text"
          value={formData.prerequisite}
          onChange={(e) => handleChange('prerequisite', e.target.value)}
          placeholder="Güç 13 veya daha fazla"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl"
        />
      </div>

      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Yetenek Açıklaması"
        placeholder="Yeteneğin faydalarını ve etkilerini açıklayın"
        required
      />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs text-blue-700">
          💡 Faydaları açıklarken madde madde yazabilirsiniz
        </p>
      </div>
    </div>
  );
};

export default FeatForm;
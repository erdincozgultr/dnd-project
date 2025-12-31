// src/components/homebrew/create/forms/ConditionForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const ConditionForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Durum Açıklaması"
        placeholder="Durumun etkilediği ve nasıl çalıştığını açıklayın"
        required
      />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs text-blue-700">
          💡 Durumun tüm etkilerini madde madde yazabilirsiniz
        </p>
      </div>
    </div>
  );
};

export default ConditionForm;
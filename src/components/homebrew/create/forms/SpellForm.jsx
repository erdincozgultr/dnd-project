// src/components/homebrew/create/forms/SpellForm.jsx

import React from 'react';
import MarkdownEditor from '../MarkdownEditor';

const SpellForm = ({ formData, onChange }) => {
  
  const handleChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  // BG3 Türkçe Büyü Okulları
  const SCHOOLS = [
    { value: 'Abjuration', label: 'Koruma' },
    { value: 'Conjuration', label: 'Çağırma' },
    { value: 'Divination', label: 'Kehanet' },
    { value: 'Enchantment', label: 'Büyüleme' },
    { value: 'Evocation', label: 'Uyandırma' },
    { value: 'Illusion', label: 'Yanılsama' },
    { value: 'Necromancy', label: 'Ölümçülük' },
    { value: 'Transmutation', label: 'Dönüştürme' }
  ];

  return (
    <div className="space-y-6">
      {/* Seviye & Okul */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">
            Seviye *
          </label>
          <input
            type="number"
            min="0"
            max="9"
            value={formData.level}
            onChange={(e) => handleChange('level', parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                       focus:border-cta focus:outline-none transition-colors"
            required
          />
          <p className="text-xs text-sti mt-1">0 = Hüner, 1-9 = Büyü seviyesi</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">
            Okul *
          </label>
          <select
            value={formData.school}
            onChange={(e) => handleChange('school', e.target.value)}
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                       focus:border-cta focus:outline-none transition-colors"
            required
          >
            <option value="">-- Okul Seçin --</option>
            {SCHOOLS.map(school => (
              <option key={school.value} value={school.value}>
                {school.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Büyüleme Süresi & Menzil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">
            Büyüleme Süresi
          </label>
          <input
            type="text"
            value={formData.casting_time}
            onChange={(e) => handleChange('casting_time', e.target.value)}
            placeholder="Örn: 1 eylem, 1 bonus eylem"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                       focus:border-cta focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">
            Menzil
          </label>
          <input
            type="text"
            value={formData.range}
            onChange={(e) => handleChange('range', e.target.value)}
            placeholder="Örn: 60 fit, Dokunma, Kendi"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                       focus:border-cta focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Bileşenler & Süre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-mtf mb-2">
            Bileşenler
          </label>
          <input
            type="text"
            value={formData.components}
            onChange={(e) => handleChange('components', e.target.value)}
            placeholder="Örn: S, B, M"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                       focus:border-cta focus:outline-none transition-colors"
          />
          <p className="text-xs text-sti mt-1">S = Sözlü, B = Bedensel, M = Maddesel</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-mtf mb-2">
            Süre
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            placeholder="Örn: Anlık, 1 dakika, Yoğunlaşma"
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                       focus:border-cta focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Kullanılabilir Sınıflar */}
      <div>
        <label className="block text-sm font-bold text-mtf mb-2">
          Kullanılabilir Sınıflar
        </label>
        <input
          type="text"
          value={formData.available_for || ''}
          onChange={(e) => handleChange('available_for', e.target.value)}
          placeholder="Örn: Büyücü, Sihirbaz, Koruyucu"
          className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                     focus:border-cta focus:outline-none transition-colors"
        />
        <p className="text-xs text-sti mt-1">Hangi sınıflar bu büyüyü kullanabilir?</p>
      </div>

      {/* Açıklama (Markdown) */}
      <MarkdownEditor
        value={formData.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        label="Büyü Açıklaması"
        placeholder="Büyünün ne yaptığını detaylı açıklayın..."
        required
      />

      {/* Yüksek Seviyede */}
      <MarkdownEditor
        value={formData.higher_level || ''}
        onChange={(e) => handleChange('higher_level', e.target.value)}
        label="Yüksek Seviyelerde (Opsiyonel)"
        placeholder="Büyü daha yüksek yuva ile kullanıldığında ne olur?"
        required={false}
        minHeight="120px"
      />

      {/* Bilgi Kutusu */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs text-blue-700">
          💡 <strong>İpucu:</strong> Açıklamayı yazarken resmi D&D büyülerinden 
          ilham alabilirsiniz ancak birebir kopyalamayın. Kendi yorumunuzu katın!
        </p>
      </div>
    </div>
  );
};

export default SpellForm;
// src/components/blog/editor/MarkdownEditor.jsx

import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Info } from 'lucide-react';

/**
 * Markdown Editor Component
 * @uiw/react-md-editor with custom styling
 */
const MarkdownEditor = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-bold text-blue-900 mb-1">
              💡 Markdown Kullanımı
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li><code className="bg-blue-100 px-1 rounded"># Başlık 1</code> - Ana başlık</li>
              <li><code className="bg-blue-100 px-1 rounded">## Başlık 2</code> - Alt başlık</li>
              <li><code className="bg-blue-100 px-1 rounded">**kalın**</code> - Kalın metin</li>
              <li><code className="bg-blue-100 px-1 rounded">*italik*</code> - İtalik metin</li>
              <li><code className="bg-blue-100 px-1 rounded">[Link](url)</code> - Bağlantı</li>
              <li><code className="bg-blue-100 px-1 rounded">![Resim](url)</code> - Resim ekle</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Markdown Editor */}
      <div data-color-mode="light">
        <MDEditor
          value={value}
          onChange={onChange}
          preview="live"
          height={600}
          visibleDragbar={false}
          highlightEnable={true}
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid #e2e8f0',
          }}
          textareaProps={{
            placeholder: '# Blog başlığını buraya yazın...\n\nİçeriğinizi markdown formatında yazabilirsiniz.',
          }}
          previewOptions={{
            style: {
              padding: '2rem',
              fontSize: '16px',
              lineHeight: '1.75',
            },
          }}
        />
      </div>

      {/* Character Count */}
      <div className="flex justify-between items-center text-xs text-sti">
        <span>
          {value?.length || 0} karakter
        </span>
        <span>
          ~{Math.ceil((value?.length || 0) / 1000)} dakika okuma
        </span>
      </div>
    </div>
  );
};

export default MarkdownEditor;
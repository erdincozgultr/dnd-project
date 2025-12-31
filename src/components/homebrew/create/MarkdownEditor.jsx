// src/components/homebrew/create/MarkdownEditor.jsx

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Edit3, Bold, Italic, Link as LinkIcon, List } from 'lucide-react';

const MarkdownEditor = ({ 
  value, 
  onChange, 
  placeholder = "Açıklamanızı buraya yazın (Markdown destekler)...",
  label = "Açıklama",
  required = true,
  minHeight = "200px"
}) => {
  const [mode, setMode] = useState('write');

  const insertMarkdown = (prefix, suffix = '', placeholder = 'metin') => {
    const textarea = document.getElementById('markdown-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    
    onChange({ target: { value: newText } });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const toolbar = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), label: 'Kalın' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), label: 'İtalik' },
    { icon: LinkIcon, action: () => insertMarkdown('[', '](url)'), label: 'Bağlantı' },
    { icon: List, action: () => insertMarkdown('\n- ', '', 'liste öğesi'), label: 'Liste' }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-mtf">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center gap-2 border-b border-cbg">
        <button
          type="button"
          onClick={() => setMode('write')}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors
            ${mode === 'write' 
              ? 'border-cta text-cta' 
              : 'border-transparent text-sti hover:text-mtf'}`}
        >
          <Edit3 size={16} />
          Yaz
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors
            ${mode === 'preview' 
              ? 'border-cta text-cta' 
              : 'border-transparent text-sti hover:text-mtf'}`}
        >
          <Eye size={16} />
          Önizle
        </button>
      </div>

      {mode === 'write' ? (
        <>
          <div className="flex items-center gap-1 p-2 bg-slate-50 rounded-lg border border-cbg">
            {toolbar.map((tool, index) => (
              <button
                key={index}
                type="button"
                onClick={tool.action}
                className="p-2 rounded hover:bg-white hover:shadow-sm transition-all text-sti hover:text-mtf"
                title={tool.label}
              >
                <tool.icon size={18} />
              </button>
            ))}
            <div className="ml-auto text-xs text-sti">
              {value.length} karakter
            </div>
          </div>

          <textarea
            id="markdown-textarea"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            style={{ minHeight }}
            className="w-full px-4 py-3 bg-mbg border-2 border-cbg rounded-xl text-mtf 
                       focus:border-cta focus:outline-none transition-colors resize-y
                       font-mono text-sm"
          />

          <div className="text-xs text-sti space-y-1">
            <p className="font-bold">Markdown İpuçları:</p>
            <p>**kalın** | *italik* | [bağlantı](url) | - liste | ## Başlık</p>
          </div>
        </>
      ) : (
        <div 
          className="w-full px-4 py-3 bg-white border-2 border-cbg rounded-xl overflow-auto"
          style={{ minHeight }}
        >
          {value ? (
            <div className="prose prose-sm max-w-none text-sti leading-relaxed
                            prose-headings:text-mtf prose-headings:font-bold
                            prose-strong:text-mtf prose-em:text-purple-600
                            prose-a:text-cta prose-a:no-underline hover:prose-a:underline">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sti italic">Önizleme için metin yazın...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
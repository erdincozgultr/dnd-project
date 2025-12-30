// src/components/common/MarkdownRenderer.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Markdown Renderer Component
 * react-markdown + remark-gfm kullanarak güvenli Markdown render
 * 
 * Desteklenen formatlar:
 * - Bold: **text** veya ***text***
 * - Italic: *text* veya _text_
 * - Headers: # ## ### 
 * - Tables: GFM tabloları
 * - Lists: - veya 1.
 * - Links: [text](url)
 * - Code: `inline` veya ```block```
 * - Blockquotes: > text
 * 
 * Kullanım:
 * <MarkdownRenderer content={markdownText} />
 * <MarkdownRenderer content={markdownText} variant="compact" />
 */

// Tailwind v4 uyumlu custom component styling
const defaultComponents = {
  // Tablolar
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-lg border border-cbg">
      <table className="w-full text-sm border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-100">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-cbg">{children}</tbody>
  ),
  tr: ({ children, isHeader }) => (
    <tr className={isHeader ? '' : 'hover:bg-slate-50 transition-colors'}>
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="border-b border-cbg px-3 py-2.5 text-left font-bold text-mtf text-xs uppercase tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2.5 text-sm text-sti">{children}</td>
  ),

  // Başlıklar
  h1: ({ children }) => (
    <h1 className="text-xl font-black text-mtf mt-6 mb-3">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-mtf mt-5 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-bold text-mtf mt-4 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-bold text-mtf mt-3 mb-1">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-sm font-bold text-sti mt-2 mb-1">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-xs font-bold text-sti mt-2 mb-1">{children}</h6>
  ),

  // Paragraflar ve metin
  p: ({ children }) => (
    <p className="text-sm text-sti leading-relaxed mb-3 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-mtf">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic">{children}</em>
  ),

  // Listeler
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 mb-3 ml-2 text-sm text-sti">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1 mb-3 ml-2 text-sm text-sti">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),

  // Linkler
  a: ({ href, children }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-cta hover:text-cta/80 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),

  // Kod
  code: ({ inline, children }) => (
    inline ? (
      <code className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono">
        {children}
      </code>
    ) : (
      <code className="block p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
        {children}
      </code>
    )
  ),
  pre: ({ children }) => (
    <pre className="mb-3">{children}</pre>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-cta/50 pl-4 py-1 my-3 bg-cta/5 rounded-r-lg">
      {children}
    </blockquote>
  ),

  // Yatay çizgi
  hr: () => (
    <hr className="my-4 border-t border-cbg" />
  ),

  // Resimler
  img: ({ src, alt }) => (
    <img 
      src={src} 
      alt={alt || ''} 
      className="max-w-full h-auto rounded-lg my-3"
      loading="lazy"
    />
  ),
};

// Kompakt versiyon için özelleştirilmiş componentler
const compactComponents = {
  ...defaultComponents,
  p: ({ children }) => (
    <p className="text-sm text-sti leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-bold text-mtf mt-3 mb-1">{children}</h3>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-2 rounded-lg border border-cbg">
      <table className="w-full text-xs border-collapse">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-cbg px-2 py-1.5 text-left font-bold text-mtf text-xs">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-2 py-1.5 text-xs text-sti">{children}</td>
  ),
};

// Card içi versiyon (daha az spacing)
const cardComponents = {
  ...defaultComponents,
  p: ({ children }) => (
    <p className="text-sm text-sti leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-bold text-emerald-700 mt-3 mb-1.5">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-bold text-mtf mt-2 mb-1">{children}</h4>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-emerald-200">
      <table className="w-full text-sm border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-emerald-50">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border-b border-emerald-200 px-3 py-2 text-left font-bold text-emerald-700 text-xs uppercase tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-sm text-sti border-b border-emerald-100">{children}</td>
  ),
};

/**
 * MarkdownRenderer Component
 * 
 * @param {string} content - Markdown içeriği
 * @param {string} variant - 'default' | 'compact' | 'card'
 * @param {string} className - Ek CSS sınıfları
 * @param {object} customComponents - Özel component override'ları
 */
const MarkdownRenderer = ({ 
  content, 
  variant = 'default', 
  className = '',
  customComponents = {}
}) => {
  if (!content) return null;

  // Content preprocessing - escaped karakterleri dönüştür
  const processContent = (text) => {
    let processed = text;
    
    // Başındaki ve sonundaki tırnakları temizle
    if (processed.startsWith('"') && processed.endsWith('"')) {
      processed = processed.slice(1, -1);
    }
    
    // Escaped \n karakterlerini gerçek satır sonuna çevir
    processed = processed.replace(/\\n/g, '\n');
    
    // \r\n kombinasyonlarını da temizle
    processed = processed.replace(/\\r\\n/g, '\n');
    processed = processed.replace(/\\r/g, '');
    
    return processed;
  };

  // Variant'a göre component setini seç
  const getComponents = () => {
    switch (variant) {
      case 'compact':
        return { ...compactComponents, ...customComponents };
      case 'card':
        return { ...cardComponents, ...customComponents };
      default:
        return { ...defaultComponents, ...customComponents };
    }
  };

  const processedContent = processContent(content);

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={getComponents()}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;

// Named exports for specific use cases
export { defaultComponents, compactComponents, cardComponents };
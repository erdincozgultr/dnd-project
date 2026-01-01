// src/components/blog/detail/BlogContent.jsx
// PURE TAILWIND V4 - No plugins, no CSS files needed!

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BlogContent = ({ content }) => {
  if (!content) {
    return (
      <div className="text-center py-12 text-sti">
        <p>İçerik bulunamadı.</p>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 
              id={slugify(children)} 
              className="text-4xl md:text-5xl font-black text-mtf mt-8 mb-4 leading-tight scroll-mt-24"
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 
              id={slugify(children)} 
              className="text-3xl md:text-4xl font-bold text-mtf mt-10 mb-4 pb-2 border-b-2 border-cbg scroll-mt-24"
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 
              id={slugify(children)} 
              className="text-2xl md:text-3xl font-bold text-mtf mt-8 mb-3 scroll-mt-24"
            >
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl md:text-2xl font-bold text-mtf mt-6 mb-2">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="text-lg text-mtf leading-relaxed mb-6">
              {children}
            </p>
          ),

          // Links
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-cta border-b border-cta hover:border-transparent transition-colors"
              >
                {children}
              </a>
            );
          },

          // Images
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              loading="lazy"
              className="w-full rounded-xl shadow-lg my-8"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-cta bg-red-50 pl-6 pr-4 py-4 my-8 italic text-gray-700 rounded-r-xl">
              {children}
            </blockquote>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 my-6 text-mtf">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 my-6 text-mtf">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-lg leading-relaxed">
              {children}
            </li>
          ),

          // Code blocks & inline code
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            
            return !inline && match ? (
              // Code block - syntax highlighted
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  borderRadius: '12px',
                  padding: '1.5rem',
                  fontSize: '0.875rem',
                  margin: '2rem 0',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              // Inline code
              <code 
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-8">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border border-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-600 border border-gray-200">
              {children}
            </td>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="border-t-2 border-cbg my-8" />
          ),

          // Strong (bold)
          strong: ({ children }) => (
            <strong className="font-bold text-mtf">
              {children}
            </strong>
          ),

          // Emphasis (italic)
          em: ({ children }) => (
            <em className="italic">
              {children}
            </em>
          ),

          // Delete (strikethrough)
          del: ({ children }) => (
            <del className="line-through text-gray-500">
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

/**
 * Helper: String'i slug'a çevir (TOC için)
 */
const slugify = (children) => {
  if (!children) return '';
  
  const text = React.Children.toArray(children)
    .map(child => (typeof child === 'string' ? child : ''))
    .join('');
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default BlogContent;
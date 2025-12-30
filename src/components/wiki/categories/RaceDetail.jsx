// src/components/wiki/categories/RaceDetail.jsx

import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Irk detay componenti
 * 
 * turkish_content yapısı:
 * {
 *   "name": "Ejderdoğumlu",
 *   "desc": "## Ejderdoğumlu Özellikleri...",
 *   "asi_desc": "**_Yetenek Puanı Artışı._** Güç puanın 2 artar.",
 *   "size": "**_Boyut._** ...",
 *   "speed_desc": "**_Hız._** ...",
 *   "age": "**_Yaş._** ...",
 *   "alignment": "**_Hizip._** ...",
 *   "vision": "**_Karanlıkta Görme._** ...",
 *   "languages": "**_Diller._** ...",
 *   "traits": "**Draconic Ancestry**\n| Ejderha | Hasar Türü |...",
 *   "subraces": [...]
 * }
 */

// Prose class'ları - markdown render için
const proseClasses = `
  prose prose-sm max-w-none text-sti leading-relaxed
  prose-p:my-1
  prose-strong:text-mtf 
  prose-em:text-indigo-600
  prose-table:w-full prose-table:border-collapse prose-table:my-4
  prose-thead:bg-indigo-50
  prose-th:p-2 prose-th:text-left prose-th:text-xs prose-th:font-bold prose-th:border prose-th:border-indigo-200 prose-th:text-indigo-700
  prose-td:p-2 prose-td:text-sm prose-td:border prose-td:border-slate-200
  prose-h2:text-base prose-h2:font-bold prose-h2:text-mtf prose-h2:mt-4 prose-h2:mb-2
  prose-h3:text-sm prose-h3:font-bold prose-h3:text-mtf prose-h3:mt-3 prose-h3:mb-1
`;

const RaceDetail = ({ data }) => {
  const [expandedSubraces, setExpandedSubraces] = useState({});

  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  const toggleSubrace = (index) => {
    setExpandedSubraces(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-6">
      {/* Ana Bilgi Kartı - ASI */}
      {data.asi_desc && (
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white border-2 border-indigo-300 rounded-xl flex items-center justify-center shadow-sm">
                <Users size={32} className="text-indigo-600" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                <div className="prose prose-sm max-w-none prose-strong:text-emerald-700 prose-em:text-emerald-600 text-emerald-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {data.asi_desc}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Temel Özellikler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.size && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className={proseClasses}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.size}
              </ReactMarkdown>
            </div>
          </div>
        )}
        
        {data.speed_desc && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className={proseClasses}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.speed_desc}
              </ReactMarkdown>
            </div>
          </div>
        )}
        
        {data.age && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className={proseClasses}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.age}
              </ReactMarkdown>
            </div>
          </div>
        )}
        
        {data.alignment && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <div className={proseClasses}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.alignment}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Görüş */}
      {data.vision && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="prose prose-sm max-w-none prose-strong:text-purple-700 prose-em:text-purple-600 text-purple-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.vision}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Diller */}
      {data.languages && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className={proseClasses}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.languages}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Irk Özellikleri (traits) */}
      {data.traits && (
        <div className="bg-white border border-cbg rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
            <span className="text-sm font-bold text-indigo-700">Irk Özellikleri</span>
          </div>
          <div className="p-4">
            <div className={proseClasses}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.traits}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Açıklama (desc) */}
      {data.desc && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className={proseClasses}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.desc}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Alt Irklar */}
      {data.subraces && data.subraces.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-mtf uppercase">Alt Irklar</h3>
          {data.subraces.map((subrace, index) => (
            <div key={index} className="border border-purple-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSubrace(index)}
                className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <span className="font-bold text-purple-700">{subrace.name}</span>
                {expandedSubraces[index] 
                  ? <ChevronUp size={16} className="text-purple-500" />
                  : <ChevronDown size={16} className="text-purple-500" />
                }
              </button>
              
              {expandedSubraces[index] && (
                <div className="p-4 bg-white space-y-4">
                  {/* Alt Irk Açıklaması */}
                  {subrace.desc && (
                    <div className={proseClasses}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {subrace.desc}
                      </ReactMarkdown>
                    </div>
                  )}
                  
                  {/* Alt Irk ASI */}
                  {subrace.asi_desc && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                      <div className="prose prose-sm max-w-none prose-strong:text-emerald-700 prose-em:text-emerald-600 text-emerald-800">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {subrace.asi_desc}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                  
                  {/* Alt Irk Özellikleri */}
                  {subrace.traits && (
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className={proseClasses}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {subrace.traits}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RaceDetail;
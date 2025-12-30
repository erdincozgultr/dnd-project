import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState } from 'react';
import { 
  GraduationCap, Heart, Shield, Sword, Wrench, BookOpen,
  ChevronDown, ChevronUp, Sparkles, Scroll
} from 'lucide-react';

const ClassDetail = ({ data }) => {
  const [showTable, setShowTable] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [expandedArchetypes, setExpandedArchetypes] = useState({});

  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  const toggleArchetype = (index) => {
    setExpandedArchetypes(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const proficiencies = data.proficiencies || {};

  return (
    <div className="space-y-6">
      {/* Ana Bilgi Kartı */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white border-2 border-indigo-300 rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap size={32} className="text-indigo-600" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-wrap gap-3">
            {/* Hit Dice */}
            {data.hit_dice && (
              <div className="bg-white/80 rounded-lg px-4 py-2 flex items-center gap-2">
                <Heart size={16} className="text-red-500" />
                <div>
                  <p className="text-[10px] text-sti uppercase">Can Zarı</p>
                  <p className="font-bold text-mtf">{data.hit_dice}</p>
                </div>
              </div>
            )}
            
            {/* Spellcasting */}
            {data.spellcasting_ability && (
              <div className="bg-white/80 rounded-lg px-4 py-2 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-500" />
                <div>
                  <p className="text-[10px] text-sti uppercase">Büyü Yeteneği</p>
                  <p className="font-bold text-mtf">{data.spellcasting_ability}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HP Bilgileri */}
      {(data.hp_at_1st_level || data.hp_at_higher_levels) && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={18} className="text-red-500" />
            <span className="text-sm font-bold text-mtf">Can Puanları</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.hp_at_1st_level && (
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-red-600 uppercase mb-1">1. Seviyede</p>
                <p className="text-sm text-red-800">{data.hp_at_1st_level}</p>
              </div>
            )}
            {data.hp_at_higher_levels && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-slate-600 uppercase mb-1">Sonraki Seviyelerde</p>
                <p className="text-sm text-slate-700">{data.hp_at_higher_levels}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Yetkinlikler */}
      {Object.keys(proficiencies).length > 0 && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-mtf">Yetkinlikler</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proficiencies.armor && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-sti uppercase mb-1">Zırh</p>
                <p className="text-sm text-mtf">{proficiencies.armor}</p>
              </div>
            )}
            
            {proficiencies.weapons && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-sti uppercase mb-1">Silah</p>
                <p className="text-sm text-mtf">{proficiencies.weapons}</p>
              </div>
            )}
            
            {proficiencies.tools && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-sti uppercase mb-1">Araç</p>
                <p className="text-sm text-mtf">{proficiencies.tools}</p>
              </div>
            )}
            
            {proficiencies.saving_throws && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] font-bold text-sti uppercase mb-1">Kurtarma Atışları</p>
                <p className="text-sm text-mtf">{proficiencies.saving_throws}</p>
              </div>
            )}
            
            {proficiencies.skills && (
              <div className="bg-slate-50 rounded-lg p-3 md:col-span-2">
                <p className="text-[10px] font-bold text-sti uppercase mb-1">Beceriler</p>
                <p className="text-sm text-mtf">{proficiencies.skills}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ekipman */}
      {data.equipment && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sword size={18} className="text-amber-500" />
            <span className="text-sm font-bold text-mtf">Başlangıç Ekipmanı</span>
          </div>
          <div 
            className="prose prose-sm max-w-none text-sti leading-relaxed
              prose-ul:my-2 prose-li:my-0"
          /> 
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {data.equipment}
      </ReactMarkdown>
        </div>
      )}

      {/* Sınıf Tablosu */}
      {data.table && (
        <div className="border border-cbg rounded-xl overflow-hidden">
          <button
            onClick={() => setShowTable(!showTable)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="font-bold text-mtf text-sm flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-500" />
              Sınıf Tablosu
            </span>
            {showTable 
              ? <ChevronUp size={16} className="text-sti" />
              : <ChevronDown size={16} className="text-sti" />
            }
          </button>
          {showTable && (
            <div className="p-4 overflow-x-auto">
              <div 
                className="prose prose-sm max-w-none
                  prose-table:w-full prose-table:border-collapse prose-table:text-xs
                  prose-th:bg-indigo-50 prose-th:p-2 prose-th:text-left prose-th:font-bold prose-th:border prose-th:border-indigo-200
                  prose-td:p-2 prose-td:border prose-td:border-slate-200"
              />
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {data.table}
      </ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {/* Sınıf Açıklaması */}
      {data.desc && (
        <div className="border border-cbg rounded-xl overflow-hidden">
          <button
            onClick={() => setShowDesc(!showDesc)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="font-bold text-mtf text-sm flex items-center gap-2">
              <Scroll size={16} className="text-indigo-500" />
              Sınıf Özellikleri
            </span>
            {showDesc 
              ? <ChevronUp size={16} className="text-sti" />
              : <ChevronDown size={16} className="text-sti" />
            }
          </button>
          {showDesc && (
            <div className="p-4 max-h-[500px] overflow-y-auto">
              <div 
                className="prose prose-sm max-w-none text-sti leading-relaxed
                  prose-headings:text-mtf prose-headings:font-bold
                  prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
                  prose-h4:text-sm prose-h4:mt-3 prose-h4:mb-1
                  prose-strong:text-mtf
                  prose-ul:my-2 prose-li:my-0"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(data.desc) }}
              />
            </div>
          )}
        </div>
      )}

      {/* Alt Sınıflar (Archetypes) */}
      {data.archetypes && data.archetypes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-mtf uppercase flex items-center gap-2">
            <Wrench size={16} className="text-purple-500" />
            Alt Sınıflar ({data.archetypes.length})
          </h3>
          
          {data.archetypes.map((archetype, index) => (
            <div key={index} className="border border-purple-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleArchetype(index)}
                className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <span className="font-bold text-purple-700">{archetype.name}</span>
                {expandedArchetypes[index] 
                  ? <ChevronUp size={16} className="text-purple-500" />
                  : <ChevronDown size={16} className="text-purple-500" />
                }
              </button>
              {expandedArchetypes[index] && (
                <div className="p-4 bg-white max-h-[400px] overflow-y-auto">
                  <div 
                    className="prose prose-sm max-w-none text-sti leading-relaxed
                      prose-headings:text-mtf prose-headings:font-bold
                      prose-h5:text-sm prose-h5:mt-3 prose-h5:mb-1
                      prose-strong:text-mtf
                      prose-table:w-full prose-table:border-collapse prose-table:text-xs
                      prose-th:bg-purple-50 prose-th:p-2 prose-th:text-left prose-th:border prose-th:border-purple-200
                      prose-td:p-2 prose-td:border prose-td:border-slate-200"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(archetype.desc) }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Basit markdown -> HTML dönüşümü
function markdownToHtml(text) {
  if (!text) return '';
  
  return text
    // Headers
    .replace(/##### (.+)/g, '<h5>$1</h5>')
    .replace(/#### (.+)/g, '<h4>$1</h4>')
    .replace(/### (.+)/g, '<h3>$1</h3>')
    .replace(/## (.+)/g, '<h2>$1</h2>')
    // Bold & Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^\* (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

// Markdown tablo -> HTML
function markdownTableToHtml(tableText) {
  if (!tableText) return '';
  
  const lines = tableText.trim().split('\n');
  if (lines.length < 2) return tableText;
  
  let html = '<table>';
  
  lines.forEach((line, index) => {
    // Separator satırını atla
    if (line.match(/^\|[-:\s|]+\|$/)) return;
    
    const cells = line.split('|').filter(c => c.trim());
    const tag = index === 0 ? 'th' : 'td';
    const rowTag = index === 0 ? 'thead' : (index === 1 ? 'tbody' : '');
    
    if (rowTag === 'thead') html += '<thead>';
    if (rowTag === 'tbody') html += '<tbody>';
    
    html += '<tr>';
    cells.forEach(cell => {
      html += `<${tag}>${cell.trim()}</${tag}>`;
    });
    html += '</tr>';
    
    if (index === 0) html += '</thead>';
  });
  
  html += '</tbody></table>';
  return html;
}

export default ClassDetail;
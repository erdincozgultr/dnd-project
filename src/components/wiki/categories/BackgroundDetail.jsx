import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useState } from "react";
import {
  Scroll,
  Star,
  Package,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * Background (Geçmiş) detay componenti
 *
 * turkish_content yapısı:
 * {
 *   "name": "Eski Maceracı",
 *   "desc": "...",
 *   "skill_proficiencies": "Algı, Hayatta Kalma",
 *   "tool_proficiencies": "Ek Alet Yetkinlikleri Yok",
 *   "languages": "Seçtiğin bir dil",
 *   "equipment": "...",
 *   "feature_name": "Eski Arkadaşlar ve Düşmanlar",
 *   "feature_desc": "...",
 *   "additional_features": {
 *     "suggested-characteristics": "..."
 *   }
 * }
 */

const BackgroundDetail = ({ data }) => {
  const [showCharacteristics, setShowCharacteristics] = useState(false);

  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  // Markdown tabloları ve formatı HTML'e çevir
  const formatContent = (text) => {
    if (!text) return "";

    return (
      text
        // Headers
        .replace(
          /### (.+)/g,
          '<h3 class="text-base font-bold text-mtf mt-4 mb-2">$1</h3>'
        )
        .replace(
          /## (.+)/g,
          '<h2 class="text-lg font-bold text-mtf mt-4 mb-2">$1</h2>'
        )
        // Bold
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        // Tablolar - basit parse
        .replace(/\| d\d+ \| .+ \|[\s\S]*?(?=\n\n|\n[^|]|$)/g, (match) => {
          return formatTable(match);
        })
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mt-3">')
        .replace(/\n/g, "<br/>")
    );
  };

  // Markdown tabloyu HTML'e çevir
  const formatTable = (tableText) => {
    const lines = tableText
      .trim()
      .split("\n")
      .filter((l) => l.trim());
    if (lines.length < 2) return tableText;

    let html = '<table class="w-full border-collapse text-sm my-4">';

    lines.forEach((line, index) => {
      // Separator satırını atla
      if (line.match(/^\|[-:\s|]+\|$/)) return;

      const cells = line.split("|").filter((c) => c.trim());
      const tag = index === 0 ? "th" : "td";

      if (index === 0) html += "<thead>";
      if (index === 1 || (index === 2 && lines[1].includes("---")))
        html += "<tbody>";

      html += "<tr>";
      cells.forEach((cell) => {
        const cellClass =
          index === 0
            ? "bg-emerald-50 p-2 text-left font-bold border border-emerald-200 text-emerald-700"
            : "p-2 border border-slate-200";
        html += `<${tag} class="${cellClass}">${cell.trim()}</${tag}>`;
      });
      html += "</tr>";

      if (index === 0) html += "</thead>";
    });

    html += "</tbody></table>";
    return html;
  };

  return (
    <div className="space-y-6">
      {/* Ana Bilgi Kartı */}
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-white border-2 border-emerald-300 rounded-xl flex items-center justify-center shadow-sm">
            <Scroll size={32} className="text-emerald-600" />
          </div>

          <div className="flex-1 space-y-2">
            {/* Beceri Yetkinlikleri */}
            {data.skill_proficiencies && (
              <div className="bg-white/80 rounded-lg px-4 py-2 inline-block">
                <p className="text-[10px] text-sti uppercase">
                  Beceri Yetkinlikleri
                </p>
                <p className="font-bold text-emerald-700 text-sm">
                  {data.skill_proficiencies}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yetkinlikler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.tool_proficiencies &&
          data.tool_proficiencies !== "Ek Alet Yetkinlikleri Yok" && (
            <div className="bg-white border border-cbg rounded-xl p-4">
              <p className="text-[10px] font-bold text-sti uppercase mb-1">
                Araç Yetkinlikleri
              </p>
              <p className="text-sm text-mtf">{data.tool_proficiencies}</p>
            </div>
          )}

        {data.languages && (
          <div className="bg-white border border-cbg rounded-xl p-4">
            <p className="text-[10px] font-bold text-sti uppercase mb-1">
              Diller
            </p>
            <p className="text-sm text-mtf">{data.languages}</p>
          </div>
        )}
      </div>

      {/* Ekipman */}
      {data.equipment && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={16} className="text-amber-500" />
            <span className="text-sm font-bold text-mtf">Ekipman</span>
          </div>
          <p className="text-sm text-sti leading-relaxed">{data.equipment}</p>
        </div>
      )}

      {/* Özellik */}
      {(data.feature_name || data.feature_desc) && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={16} className="text-emerald-500" />
            <span className="text-sm font-bold text-emerald-700">
              {data.feature_name || "Özellik"}
            </span>
          </div>
          <p className="text-sm text-emerald-800 leading-relaxed">
            {" "}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.feature_desc}
            </ReactMarkdown>
          </p>
        </div>
      )}

      {/* Açıklama */}
      {data.desc && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-slate-500" />
            <span className="text-sm font-bold text-mtf">Açıklama</span>
          </div>
          <div className="prose prose-sm max-w-none text-sti leading-relaxed" />
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.desc}</ReactMarkdown>
        </div>
      )}

      {/* Önerilen Karakteristikler */}
      {data.additional_features?.["suggested-characteristics"] && (
        <div className="border border-cbg rounded-xl overflow-hidden">
          <button
            onClick={() => setShowCharacteristics(!showCharacteristics)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="font-bold text-mtf text-sm">
              Önerilen Karakteristikler
            </span>
            {showCharacteristics ? (
              <ChevronUp size={16} className="text-sti" />
            ) : (
              <ChevronDown size={16} className="text-sti" />
            )}
          </button>
          {showCharacteristics && (
            <div className="p-4 max-h-[500px] overflow-y-auto">
              <div className="prose prose-sm max-w-none text-sti leading-relaxed" />
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.additional_features["suggested-characteristics"]}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundDetail;

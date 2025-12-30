import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
import { Gem, Sparkles } from "lucide-react";

/**
 * Magic Item (Sihirli Eşya) detay componenti
 *
 * turkish_content yapısı:
 * {
 *   "name": "Isıtıcı Fincan",
 *   "desc": "Bu çizgili desenli fincan...",
 *   "type": "Harika Eşya",
 *   "rarity": "Sıradan",
 *   "requires_attunement": ""  // boş string = gerekmiyor
 * }
 */

// Nadirlik renkleri
const RARITY_COLORS = {
  common: {
    bg: "bg-slate-500",
    light: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
  },
  sıradan: {
    bg: "bg-slate-500",
    light: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
  },
  yaygın: {
    bg: "bg-slate-500",
    light: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
  },
  uncommon: {
    bg: "bg-green-500",
    light: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  "yaygın olmayan": {
    bg: "bg-green-500",
    light: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  rare: {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  nadir: {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  "very rare": {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  "çok nadir": {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  legendary: {
    bg: "bg-amber-500",
    light: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  efsanevi: {
    bg: "bg-amber-500",
    light: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  artifact: {
    bg: "bg-red-500",
    light: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  },
  yapıt: {
    bg: "bg-red-500",
    light: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  },
  default: {
    bg: "bg-slate-500",
    light: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
  },
};

const MagicItemDetail = ({ data }) => {
  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  const getRarityColor = () => {
    const rarity = (data.rarity || "").toLowerCase();
    return RARITY_COLORS[rarity] || RARITY_COLORS.default;
  };

  const rarityColor = getRarityColor();

  // Markdown formatını HTML'e çevir
  const formatDesc = (text) => {
    if (!text) return "";

    return (
      text
        // Bold
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        // Italic
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        // Line breaks
        .replace(/\n\n/g, '</p><p class="mt-3">')
        .replace(/\n/g, "<br/>")
    );
  };

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div
        className={`${rarityColor.light} border ${rarityColor.border} rounded-2xl p-6`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-16 h-16 bg-white border-2 ${rarityColor.border} rounded-xl flex items-center justify-center shadow-sm`}
          >
            <Gem size={32} className={rarityColor.text} />
          </div>

          <div className="flex-1 space-y-2">
            {/* Badge'ler */}
            <div className="flex flex-wrap gap-2">
              {data.rarity && (
                <span
                  className={`px-3 py-1 ${rarityColor.bg} text-white rounded-lg text-xs font-bold`}
                >
                  {data.rarity}
                </span>
              )}
              {data.type && (
                <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">
                  {data.type}
                </span>
              )}
            </div>

            {/* Uyum Gereksinimi */}
            {data.requires_attunement && data.requires_attunement !== "" && (
              <div className="flex items-center gap-2 text-purple-600">
                <Sparkles size={14} />
                <span className="text-xs font-bold">
                  Uyum Gerektirir
                  {typeof data.requires_attunement === "string" &&
                    data.requires_attunement.length > 0 &&
                    ` (${data.requires_attunement})`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Açıklama */}
      {data.desc && (
        <div className="bg-white border border-cbg rounded-xl p-6">
          <div
            className="prose prose-sm max-w-none text-sti leading-relaxed
              prose-strong:text-mtf
              prose-em:text-purple-600"
          />
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.desc}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MagicItemDetail;

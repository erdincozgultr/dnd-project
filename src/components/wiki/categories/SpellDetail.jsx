import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  Clock,
  Target,
  Hourglass,
  Volume2,
  Hand,
  Package,
  RefreshCw,
  BookOpen,
} from "lucide-react";

/**
 * Büyü detay componenti
 * 
 * turkish_content yapısı:
 * {
 *   "name": "Resurrection",
 *   "desc": "...",
 *   "level": 7,
 *   "range": "Dokunma",
 *   "ritual": false,
 *   "school": "Nekromansi (Necromancy)",
 *   "duration": "Anlık",
 *   "components": "V, S, M",
 *   "casting_time": "1hour",
 *   "higher_level": "",
 *   "available_for": "Ruhban, Druid, Büyücü"
 * }
 */

// Büyü okulu renkleri
const SCHOOL_THEMES = {
  koruma: {
    gradient: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    icon: "text-blue-600",
    badge: "bg-blue-500",
  },
  abjuration: {
    gradient: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    icon: "text-blue-600",
    badge: "bg-blue-500",
  },
  çağırma: {
    gradient: "from-amber-50 to-amber-100",
    border: "border-amber-200",
    icon: "text-amber-600",
    badge: "bg-amber-500",
  },
  conjuration: {
    gradient: "from-amber-50 to-amber-100",
    border: "border-amber-200",
    icon: "text-amber-600",
    badge: "bg-amber-500",
  },
  kehanet: {
    gradient: "from-purple-50 to-purple-100",
    border: "border-purple-200",
    icon: "text-purple-600",
    badge: "bg-purple-500",
  },
  divination: {
    gradient: "from-purple-50 to-purple-100",
    border: "border-purple-200",
    icon: "text-purple-600",
    badge: "bg-purple-500",
  },
  büyüleme: {
    gradient: "from-pink-50 to-pink-100",
    border: "border-pink-200",
    icon: "text-pink-600",
    badge: "bg-pink-500",
  },
  enchantment: {
    gradient: "from-pink-50 to-pink-100",
    border: "border-pink-200",
    icon: "text-pink-600",
    badge: "bg-pink-500",
  },
  evokasyon: {
    gradient: "from-red-50 to-red-100",
    border: "border-red-200",
    icon: "text-red-600",
    badge: "bg-red-500",
  },
  evocation: {
    gradient: "from-red-50 to-red-100",
    border: "border-red-200",
    icon: "text-red-600",
    badge: "bg-red-500",
  },
  illüzyon: {
    gradient: "from-indigo-50 to-indigo-100",
    border: "border-indigo-200",
    icon: "text-indigo-600",
    badge: "bg-indigo-500",
  },
  illusion: {
    gradient: "from-indigo-50 to-indigo-100",
    border: "border-indigo-200",
    icon: "text-indigo-600",
    badge: "bg-indigo-500",
  },
  nekromansi: {
    gradient: "from-zinc-50 to-zinc-100",
    border: "border-zinc-200",
    icon: "text-zinc-600",
    badge: "bg-zinc-600",
  },
  necromancy: {
    gradient: "from-zinc-50 to-zinc-100",
    border: "border-zinc-200",
    icon: "text-zinc-600",
    badge: "bg-zinc-600",
  },
  dönüşüm: {
    gradient: "from-emerald-50 to-emerald-100",
    border: "border-emerald-200",
    icon: "text-emerald-600",
    badge: "bg-emerald-500",
  },
  transmutation: {
    gradient: "from-emerald-50 to-emerald-100",
    border: "border-emerald-200",
    icon: "text-emerald-600",
    badge: "bg-emerald-500",
  },
  default: {
    gradient: "from-slate-50 to-slate-100",
    border: "border-slate-200",
    icon: "text-slate-600",
    badge: "bg-slate-500",
  },
};

// Seviye badge renkleri
const LEVEL_COLORS = {
  0: "bg-slate-400",
  1: "bg-green-500",
  2: "bg-blue-500",
  3: "bg-purple-500",
  4: "bg-amber-500",
  5: "bg-orange-500",
  6: "bg-red-500",
  7: "bg-rose-600",
  8: "bg-fuchsia-600",
  9: "bg-violet-700",
};

const SpellDetail = ({ data }) => {
  if (!data) {
    return <div className="text-center py-8 text-sti">Veri bulunamadı</div>;
  }

  // Okul teması - school string'inden parse et
  const getTheme = () => {
    const school = (data.school || "").toLowerCase();
    for (const [key, value] of Object.entries(SCHOOL_THEMES)) {
      if (school.includes(key)) return value;
    }
    return SCHOOL_THEMES.default;
  };

  const theme = getTheme();
  const level = data.level ?? 0;
  const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS[0];

  // Konsantrasyon kontrolü - duration'da "Concentration" veya "Konsantrasyon" varsa
  const isConcentration =
    (data.duration || "").toLowerCase().includes("consantrasyon") ||
    (data.duration || "").toLowerCase().includes("concentration");

  return (
    <div className="space-y-6">
      {/* Başlık Kartı */}
      <div
        className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl overflow-hidden`}
      >
        {/* Üst Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/5">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 ${levelColor} text-white rounded text-xs font-bold`}
            >
              {level === 0 ? "Sihirbazlık" : `${level}. Seviye`}
            </span>
            <span
              className={`px-2 py-0.5 ${theme.badge} text-white rounded text-xs font-bold`}
            >
              {data.school}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {data.ritual && (
              <span className="px-2 py-0.5 bg-emerald-500 text-white rounded text-xs font-bold">
                Ritüel
              </span>
            )}
            {isConcentration && (
              <span className="px-2 py-0.5 bg-orange-500 text-white rounded text-xs font-bold flex items-center gap-1">
                <RefreshCw size={10} />
                Konsantrasyon
              </span>
            )}
          </div>
        </div>

        {/* Ana Bilgiler Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/80 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Clock size={14} className={theme.icon} />
                <span className="text-[10px] font-bold text-sti uppercase">
                  Atım Süresi
                </span>
              </div>
              <p className="text-sm font-bold text-mtf">
                {data.casting_time || "-"}
              </p>
            </div>

            <div className="bg-white/80 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Target size={14} className={theme.icon} />
                <span className="text-[10px] font-bold text-sti uppercase">
                  Menzil
                </span>
              </div>
              <p className="text-sm font-bold text-mtf">{data.range || "-"}</p>
            </div>

            <div className="bg-white/80 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Hourglass size={14} className={theme.icon} />
                <span className="text-[10px] font-bold text-sti uppercase">
                  Süre
                </span>
              </div>
              <p className="text-sm font-bold text-mtf">
                {data.duration || "-"}
              </p>
            </div>

            <div className="bg-white/80 rounded-lg p-3">
              <div className="flex items-center gap-1 mb-1">
                <Package size={14} className={theme.icon} />
                <span className="text-[10px] font-bold text-sti uppercase">
                  Bileşenler
                </span>
              </div>
              <p className="text-sm font-bold text-mtf">
                {data.components || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bileşen Detayları */}
      {data.components && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex flex-wrap gap-3">
            {data.components.includes("V") && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                <Volume2 size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-blue-700">
                  Sözlü (V)
                </span>
              </div>
            )}
            {data.components.includes("S") && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                <Hand size={16} className="text-emerald-500" />
                <span className="text-xs font-bold text-emerald-700">
                  Bedensel (S)
                </span>
              </div>
            )}
            {data.components.includes("M") && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
                <Package size={16} className="text-amber-500" />
                <span className="text-xs font-bold text-amber-700">
                  Malzeme (M)
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Kullanılabilir Sınıflar */}
      {data.available_for && (
        <div className="bg-white border border-cbg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-purple-500" />
            <span className="text-xs font-bold text-mtf uppercase">
              Kullanılabilir Sınıflar
            </span>
          </div>
          <p className="text-sm text-sti">{data.available_for}</p>
        </div>
      )}

      {/* Açıklama */}
      {data.desc && (
        <div className="bg-white border border-cbg rounded-xl p-6">
          <div
            className="prose prose-sm max-w-none text-sti leading-relaxed
      prose-table:w-full prose-table:border-collapse
      prose-th:bg-slate-100 prose-th:p-2 prose-th:text-left prose-th:text-xs prose-th:font-bold prose-th:border prose-th:border-slate-200
      prose-td:p-2 prose-td:text-sm prose-td:border prose-td:border-slate-200
      prose-strong:text-mtf prose-em:text-purple-600
      prose-h5:text-sm prose-h5:font-bold prose-h5:text-mtf prose-h5:mt-4 prose-h5:mb-2"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {data.desc}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Yüksek Seviyede */}
      {data.higher_level && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-purple-500" />
            <span className="text-sm font-bold text-purple-700">
              Yüksek Seviyelerde
            </span>
          </div>
          <p className="text-sm text-purple-800">{data.higher_level}</p>
        </div>
      )}
    </div>
  );
};

export default SpellDetail;

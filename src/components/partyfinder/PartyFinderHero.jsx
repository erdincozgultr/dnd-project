import React from "react";
import { Search, Filter } from "lucide-react";

const PartyFinderHero = ({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div className="bg-pb pt-10 pb-16 px-4 relative overflow-hidden shadow-lg border-b border-cbg">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
      <div className="container mx-auto max-w-5xl relative z-10 text-center">
        <div className="flex gap-x-4 justify-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
            Oyununu Seç
          </h1>
          <h1 className="text-3xl md:text-5xl font-black text-cta mb-4 tracking-tight drop-shadow-md">
            Macerana Başla
          </h1>
        </div>
        <p className="text-sti/80 mb-8 max-w-xl mx-auto font-medium">
          Oyun masaları seni bekliyor. İster şehrindeki yüz yüze oyunları, ister
          online maceraları keşfet.
        </p>

        {/* Arama Çubuğu */}
        <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto bg-mbg p-2 rounded-xl shadow-2xl border border-cbg/50">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sti"
              size={18}
            />
            <input
              type="text"
              placeholder="Oyun, Sistem veya DM adı..."
              className="w-full pl-10 pr-4 py-3 bg-transparent text-mtf placeholder-sti/50 focus:outline-none font-bold text-sm"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
          <button
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 border border-transparent ${
              showFilters
                ? "bg-cta text-white shadow-lg shadow-cta/20"
                : "bg-cbg/50 text-sti hover:bg-cbg hover:text-mtf"
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} /> Filtreler
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartyFinderHero;

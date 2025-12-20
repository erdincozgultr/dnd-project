import React from 'react';
import { 
  Search, BookOpen, Skull, Sword, Ghost, Filter, 
  CheckSquare, Square , User, Shield
} from 'lucide-react';

const CATEGORIES = [
  { id: 'spells', label: 'Büyüler', icon: <Ghost size={18} /> },
  { id: 'monsters', label: 'Canavarlar', icon: <Skull size={18} /> },
  { id: 'classes', label: 'Sınıflar', icon: <User size={18} /> },
  { id: 'items', label: 'Eşyalar', icon: <Sword size={18} /> },
  { id: 'races', label: 'Irklar', icon: <BookOpen size={18} /> },
];

const WikiSidebar = ({ filters, setFilters, activeCategory, onCategoryChange }) => {
  
  const handleSourceToggle = (source) => {
    // Kaynak filtresi mantığı: Birine basınca toggle yapar
    // Örnek: Official açıksa ve Homebrew basılırsa ikisi de açık olabilir veya tek seçim.
    // Şimdilik "Checkbox" mantığıyla ikisi de seçilebilir yapıyoruz.
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    
    setFilters({ ...filters, sources: newSources });
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Arama */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Wiki'de ara..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta outline-none text-sm font-bold shadow-sm"
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
      </div>

      {/* 2. Kaynak Seçimi (Önemli Ayrım) */}
      <div>
        <h3 className="text-xs font-black text-sti uppercase tracking-widest mb-3 flex items-center gap-2">
            <Filter size={12} /> Kaynaklar
        </h3>
        <div className="space-y-2">
            {/* Official Toggle */}
            <button 
                onClick={() => handleSourceToggle('official')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    filters.sources.includes('official') 
                    ? 'bg-yellow-50 border-yellow-500/50 shadow-sm' 
                    : 'bg-mbg border-cbg opacity-60 hover:opacity-100'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Shield size={16} className={filters.sources.includes('official') ? "text-yellow-600" : "text-sti"} />
                    <span className={`text-sm font-bold ${filters.sources.includes('official') ? "text-mtf" : "text-sti"}`}>Official (SRD)</span>
                </div>
                {filters.sources.includes('official') ? <CheckSquare size={16} className="text-yellow-600" /> : <Square size={16} className="text-sti" />}
            </button>

            {/* Homebrew Toggle */}
            <button 
                onClick={() => handleSourceToggle('homebrew')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    filters.sources.includes('homebrew') 
                    ? 'bg-purple-50 border-purple-500/50 shadow-sm' 
                    : 'bg-mbg border-cbg opacity-60 hover:opacity-100'
                }`}
            >
                <div className="flex items-center gap-2">
                    <User size={16} className={filters.sources.includes('homebrew') ? "text-purple-600" : "text-sti"} />
                    <span className={`text-sm font-bold ${filters.sources.includes('homebrew') ? "text-mtf" : "text-sti"}`}>Homebrew</span>
                </div>
                {filters.sources.includes('homebrew') ? <CheckSquare size={16} className="text-purple-600" /> : <Square size={16} className="text-sti" />}
            </button>
        </div>
      </div>

      {/* 3. Kategoriler */}
      <div>
        <h3 className="text-xs font-black text-sti uppercase tracking-widest mb-3 flex items-center gap-2">
            <BookOpen size={12} /> Kütüphane
        </h3>
        <nav className="space-y-1">
           {CATEGORIES.map(cat => (
             <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                    activeCategory === cat.id 
                    ? 'bg-cta text-white shadow-md shadow-cta/20' 
                    : 'text-sti hover:bg-cbg hover:text-mtf'
                }`}
             >
                {cat.icon}
                {cat.label}
             </button>
           ))}
        </nav>
      </div>

    </div>
  );
};

export default WikiSidebar;
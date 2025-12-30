// src/components/wiki/layout/WikiSidebar.jsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, BookOpen, RotateCcw } from 'lucide-react';

import { 
  CATEGORY_LIST, 
  getCategoryIcon 
} from '../../../constants/wikiConstants';
import { setCategory, setSearch, resetFilters } from '../../../redux/actions/wikiActions';

/**
 * Wiki sidebar - kategori ve arama filtreleri
 */
const WikiSidebar = () => {
  const dispatch = useDispatch();
  const { activeCategory, searchQuery, categoryCounts } = useSelector(state => state.wiki);
  
  const [localSearch, setLocalSearch] = React.useState(searchQuery);
  const searchTimeoutRef = React.useRef(null);

  // Debounced arama
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    // Debounce
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(setSearch(value));
    }, 300);
  };

  // Kategori seçimi
  const handleCategoryClick = (categoryId) => {
    if (activeCategory === categoryId) {
      // Aynı kategoriye tıklanırsa kaldır
      dispatch(setCategory(null));
    } else {
      dispatch(setCategory(categoryId));
    }
  };

  // Filtreleri sıfırla
  const handleReset = () => {
    setLocalSearch('');
    dispatch(resetFilters());
  };

  return (
    <div className="space-y-6">
      {/* Arama */}
      <div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Wiki'de ara..." 
            value={localSearch}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 bg-white border border-cbg rounded-xl focus:border-cta focus:ring-1 focus:ring-cta/20 outline-none text-sm font-medium shadow-sm transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sti/50" size={18} />
        </div>
      </div>

      {/* Aktif filtreler + Reset */}
      {(activeCategory || searchQuery) && (
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-sti hover:text-cta transition-colors"
        >
          <RotateCcw size={14} />
          Filtreleri Temizle
        </button>
      )}

      {/* Kategoriler */}
      <div>
        <h3 className="text-xs font-black text-sti uppercase tracking-widest mb-3 flex items-center gap-2">
          <BookOpen size={12} />
          Kütüphane
        </h3>
        
        <nav className="space-y-1">
          {CATEGORY_LIST.map(cat => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.id] || 0;
            const isActive = activeCategory === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-cta text-white shadow-md shadow-cta/20' 
                    : 'text-sti hover:bg-cbg hover:text-mtf'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : `text-${cat.color}-500`} />
                  <span>{cat.label}</span>
                </div>
                
                {count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-cbg text-sti'
                  }`}>
                    {count > 999 ? '999+' : count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hızlı istatistik */}
      <div className="bg-gradient-to-br from-cta/5 to-cta/10 border border-cta/20 rounded-xl p-4">
        <p className="text-xs font-bold text-cta uppercase mb-2">Toplam İçerik</p>
        <p className="text-2xl font-black text-mtf">
          {Object.values(categoryCounts).reduce((a, b) => a + b, 0).toLocaleString('tr-TR')}
        </p>
      </div>
    </div>
  );
};

export default WikiSidebar;

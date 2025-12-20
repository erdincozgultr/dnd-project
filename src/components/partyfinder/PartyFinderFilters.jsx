import React from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { SYSTEMS, PLATFORMS, FREQUENCIES } from '../../constants/gameEnums';

const PartyFinderFilters = ({ filters, setFilters, onClear }) => {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-mbg border border-cbg rounded-xl shadow-xl p-5 mb-6 animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ring-1 ring-white/5">
       {/* Sistem */}
       <div className="space-y-1">
           <label className="text-[10px] font-bold text-sti uppercase tracking-wider pl-1">Sistem</label>
           <div className="relative">
              <select 
                  className="w-full appearance-none bg-pb/50 border border-cbg text-mtf py-2.5 px-3 rounded-lg text-sm font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                  value={filters.system}
                  onChange={(e) => handleChange('system', e.target.value)}
              >
                  <option value="">Tümü</option>
                  {Object.entries(SYSTEMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-sti pointer-events-none" />
           </div>
       </div>
       
       {/* Platform */}
       <div className="space-y-1">
           <label className="text-[10px] font-bold text-sti uppercase tracking-wider pl-1">Platform</label>
           <div className="relative">
              <select 
                  className="w-full appearance-none bg-pb/50 border border-cbg text-mtf py-2.5 px-3 rounded-lg text-sm font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                  value={filters.platform}
                  onChange={(e) => handleChange('platform', e.target.value)}
              >
                  <option value="">Tümü</option>
                  {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-sti pointer-events-none" />
           </div>
       </div>

       {/* Sıklık */}
       <div className="space-y-1">
           <label className="text-[10px] font-bold text-sti uppercase tracking-wider pl-1">Sıklık</label>
           <div className="relative">
              <select 
                  className="w-full appearance-none bg-pb/50 border border-cbg text-mtf py-2.5 px-3 rounded-lg text-sm font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors"
                  value={filters.frequency}
                  onChange={(e) => handleChange('frequency', e.target.value)}
              >
                  <option value="">Tümü</option>
                  {Object.entries(FREQUENCIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-sti pointer-events-none" />
           </div>
       </div>

       {/* Şehir */}
       <div className="space-y-1">
           <label className="text-[10px] font-bold text-sti uppercase tracking-wider pl-1">Şehir</label>
           <div className="relative">
              <input 
                  type="text"
                  placeholder="Örn: İstanbul"
                  className="w-full bg-pb/50 border border-cbg text-mtf py-2.5 px-3 rounded-lg text-sm font-bold focus:border-cta focus:ring-1 focus:ring-cta outline-none transition-colors placeholder:font-medium"
                  value={filters.city}
                  onChange={(e) => handleChange('city', e.target.value)}
              />
              <MapPin size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-sti pointer-events-none" />
           </div>
       </div>

       <button 
          onClick={onClear}
          className="text-xs text-cta hover:text-white font-bold hover:underline sm:col-span-2 lg:col-span-4 text-right transition-colors"
       >
          Filtreleri Temizle
       </button>
    </div>
  );
};

export default PartyFinderFilters;
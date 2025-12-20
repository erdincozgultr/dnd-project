import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import WikiSidebar from '../components/wiki/WikiSidebar';

const WikiLayout = ({ children, filters, setFilters, activeCategory, onCategoryChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mbg font-display">
      <div className="container mx-auto px-4 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
           
           {/* --- MOBIL SIDEBAR TOGGLE --- */}
           <div className="lg:hidden mb-4">
              <button 
                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                 className="flex items-center gap-2 bg-white border border-cbg px-4 py-2 rounded-lg shadow-sm text-mtf font-bold"
              >
                 {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                 {isSidebarOpen ? 'Filtreleri Kapat' : 'Kütüphane Menüsü'}
              </button>
           </div>

           {/* --- SIDEBAR --- */}
           <aside className={`
              fixed inset-0 z-40 bg-mbg p-6 overflow-y-auto transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto lg:p-0 lg:w-64 lg:bg-transparent lg:overflow-visible
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
           `}>
              <div className="lg:hidden flex justify-end mb-4">
                 <button onClick={() => setIsSidebarOpen(false)}><X size={24} className="text-sti" /></button>
              </div>
              
              <div className="sticky top-24">
                 <WikiSidebar 
                    filters={filters} 
                    setFilters={setFilters} 
                    activeCategory={activeCategory}
                    onCategoryChange={(cat) => {
                        onCategoryChange(cat);
                        setIsSidebarOpen(false); // Mobilde seçim yapınca kapat
                    }}
                 />
              </div>
           </aside>

           {/* --- MAIN CONTENT --- */}
           <main className="flex-1">
              {children}
           </main>

        </div>
      </div>
    </div>
  );
};

export default WikiLayout;
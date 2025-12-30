// src/pages/WikiPage.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Loader2, Menu, X, AlertCircle } from 'lucide-react';

import { fetchWikiEntries, fetchCategoryStats } from '../redux/actions/wikiActions';
import { getCategoryLabel } from '../constants/wikiConstants';

import WikiSidebar from '../components/wiki/layout/WikiSidebar';
import WikiCard from '../components/wiki/list/WikiCard';
import WikiPagination from '../components/wiki/list/WikiPagination';

/**
 * Wiki ana sayfası - liste görünümü
 */
const WikiPage = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { 
    entries, 
    loading, 
    error, 
    activeCategory, 
    searchQuery,
    pagination 
  } = useSelector(state => state.wiki);

  // İlk yükleme
  useEffect(() => {
    dispatch(fetchWikiEntries());
    dispatch(fetchCategoryStats());
  }, [dispatch]);

  // Sayfa başlığı
  const getPageTitle = () => {
    if (searchQuery) return `"${searchQuery}" araması`;
    if (activeCategory) return getCategoryLabel(activeCategory);
    return 'Tüm İçerikler';
  };

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Wiki - Zar & Kule</title>
        <meta name="description" content="D&D 5e içerikleri: Büyüler, Canavarlar, Zırhlar, Silahlar ve daha fazlası." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-cta/10 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-cta" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-mtf">Wiki Kütüphanesi</h1>
              <p className="text-sm text-sti">D&D 5e içerikleri keşfet</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobil Sidebar Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-2 bg-white border border-cbg px-4 py-2.5 rounded-xl shadow-sm text-mtf font-bold w-full justify-center"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              {isSidebarOpen ? 'Filtreleri Kapat' : 'Kategoriler & Filtreler'}
            </button>
          </div>

          {/* Sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-40 w-80 bg-mbg p-6 overflow-y-auto transition-transform duration-300 
            lg:translate-x-0 lg:static lg:z-auto lg:p-0 lg:w-72 lg:flex-shrink-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            {/* Mobil kapat butonu */}
            <div className="lg:hidden flex justify-between items-center mb-6 pb-4 border-b border-cbg">
              <span className="font-bold text-mtf">Filtreler</span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-cbg rounded-lg transition-colors"
              >
                <X size={24} className="text-sti" />
              </button>
            </div>
            
            <div className="lg:sticky lg:top-24">
              <WikiSidebar />
            </div>
          </aside>

          {/* Mobil overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Aktif filtre bilgisi */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-mtf">{getPageTitle()}</h2>
                <p className="text-sm text-sti">
                  {pagination.totalElements.toLocaleString('tr-TR')} sonuç bulundu
                </p>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-20">
                <Loader2 size={48} className="animate-spin text-cta" />
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
                <p className="text-red-700 font-bold">{error}</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && entries.length === 0 && (
              <div className="bg-white border border-cbg rounded-2xl p-12 text-center">
                <BookOpen size={48} className="text-sti/30 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-mtf mb-2">Sonuç Bulunamadı</h3>
                <p className="text-sm text-sti">
                  {searchQuery 
                    ? `"${searchQuery}" için sonuç bulunamadı.`
                    : 'Bu kategoride henüz içerik yok.'
                  }
                </p>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && entries.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {entries.map(entry => (
                    <WikiCard key={entry.id} item={entry} />
                  ))}
                </div>

                {/* Pagination */}
                <WikiPagination />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default WikiPage;
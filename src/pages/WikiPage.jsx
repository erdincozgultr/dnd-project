// src/pages/WikiPage.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Loader2, Menu, X, AlertCircle, Sparkles } from 'lucide-react';

import { fetchWikiEntries, fetchCategoryStats, setContentType } from '../redux/actions/wikiActions';
import { getCategoryLabel } from '../constants/wikiConstants';

import WikiSidebar from '../components/wiki/layout/WikiSidebar';
import WikiCard from '../components/wiki/list/WikiCard';
import WikiPagination from '../components/wiki/list/WikiPagination';

/**
 * Wiki ana sayfası - Resmi + Homebrew içerikler
 */
const WikiPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { 
    entries, 
    loading, 
    error, 
    activeCategory, 
    searchQuery,
    pagination,
    contentType 
  } = useSelector(state => state.wiki);

  // URL'den tab parametresi al
  const tabFromUrl = searchParams.get('tab') || 'official';

  // İlk yükleme ve tab değişimi
  useEffect(() => {
    const newContentType = tabFromUrl === 'homebrew' ? 'homebrew' : 'official';
    dispatch(setContentType(newContentType));
  }, [tabFromUrl, dispatch]);

  useEffect(() => {
    dispatch(fetchWikiEntries());
    dispatch(fetchCategoryStats());
  }, [dispatch, contentType]);

  // Tab değiştir
  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  // Sayfa başlığı
  const getPageTitle = () => {
    if (searchQuery) return `"${searchQuery}" araması`;
    if (activeCategory) return getCategoryLabel(activeCategory);
    return contentType === 'homebrew' ? 'Homebrew İçerikler' : 'Resmi İçerikler';
  };

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>D&D Kütüphanesi - Zar & Kule</title>
        <meta name="description" content="D&D 5e resmi içerikleri ve topluluk tarafından oluşturulan homebrew içerikler." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-cta/10 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-cta" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-mtf">D&D Kütüphanesi</h1>
              <p className="text-sm text-sti">Resmi içerikler ve homebrew materyaller</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 bg-white border-2 border-cbg rounded-xl p-1.5 sm:w-">
            <button
              onClick={() => handleTabChange('official')}
              className={`flex-1 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                contentType === 'official'
                  ? 'bg-cta text-white shadow-md'
                  : 'text-sti hover:text-mtf hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen size={18} />
                Resmi İçerikler
              </div>
            </button>
            <button
              onClick={() => handleTabChange('homebrew')}
              className={`flex-1 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                contentType === 'homebrew'
                  ? 'bg-pb text-white shadow-md'
                  : 'text-sti hover:text-mtf hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles size={18} />
                Homebrew
              </div>
            </button>
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
            {isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 hover:bg-cbg rounded-lg transition-colors"
              >
                <X size={24} className="text-sti" />
              </button>
            )}
            
            <div className="lg:sticky lg:top-24">
              <WikiSidebar onCategorySelect={() => setIsSidebarOpen(false)} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Başlık */}
            <div className="mb-6">
              <h2 className="text-xl font-black text-mtf mb-2">{getPageTitle()}</h2>
              <p className="text-sm text-sti">
                {pagination.totalElements} sonuç bulundu
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <Loader2 size={48} className="animate-spin text-cta mx-auto mb-4" />
                  <p className="text-sti font-bold">Yükleniyor...</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-700 mb-2">Bir Hata Oluştu</h3>
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && entries.length === 0 && (
              <div className="bg-white border-2 border-cbg rounded-2xl p-12 text-center">
                <BookOpen size={64} className="text-cbg mx-auto mb-4" />
                <h3 className="text-xl font-bold text-mtf mb-2">İçerik Bulunamadı</h3>
                <p className="text-sti">
                  {searchQuery 
                    ? `"${searchQuery}" için sonuç bulunamadı.`
                    : contentType === 'homebrew'
                    ? 'Henüz homebrew içerik oluşturulmamış.'
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
                    <WikiCard 
                      key={entry.id} 
                      item={entry}
                      isHomebrew={contentType === 'homebrew'}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <WikiPagination />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default WikiPage;
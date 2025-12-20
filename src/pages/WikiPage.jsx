import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { BookOpen, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import WikiLayout from '../layout/WikiLayout';
import WikiCard from '../components/wiki/WikiCard';
import useAxios, { METHODS } from '../hooks/useAxios';
import { CATEGORY_MAPPING } from '../constants/wikiEnums';

const WikiPage = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();

  const [activeCategory, setActiveCategory] = useState('spells'); 
  const [wikiData, setWikiData] = useState([]);
  const [homebrewData, setHomebrewData] = useState([]);
  
  const [filters, setFilters] = useState({
    search: '',
    sources: ['official'] 
  });

  const fetchData = useCallback(() => {
    const categoryEnum = CATEGORY_MAPPING[activeCategory]; 
    const searchTerm = filters.search;

    // --- 1. OFFICIAL WIKI ---
    if (filters.sources.includes('official')) {
        let url = '/wiki/public'; 

        if (searchTerm) {
            url = `/wiki/search?q=${searchTerm}`;
        } else if (categoryEnum !== 'GENERAL') {
            url = `/wiki/category/${categoryEnum}`;
        }
        
        sendRequest({
            url: url,
            method: METHODS.GET,
            callbackSuccess: (res) => setWikiData(res.data),
            callbackError: () => setWikiData([])
        });
    } else { setWikiData([]); }

    // --- 2. HOMEBREW ---
    if (filters.sources.includes('homebrew')) {
         let url = '/homebrews/public'; 

         if (searchTerm) {
             url = `/homebrews/search?q=${searchTerm}`;
         } else if (categoryEnum !== 'GENERAL') {
             url = `/homebrews/category/${categoryEnum}`;
         }

         sendRequest({
            url: url,
            method: METHODS.GET,
            callbackSuccess: (res) => setHomebrewData(res.data),
            callbackError: () => setHomebrewData([])
         });
    } else { setHomebrewData([]); }
  }, [activeCategory, filters.sources, filters.search, sendRequest]); 

  useEffect(() => {
    fetchData();
  }, [fetchData, isAuthenticated]);

  const combinedData = [
      ...wikiData.map(item => ({
          ...item,
          type: 'official',
          liked: item.liked === true, 
          likeCount: item.likeCount 
      })),
      ...homebrewData.map(item => ({
          ...item,
          type: 'homebrew',
          title: item.name, 
          liked: item.liked === true, 
          likeCount: item.likeCount
      }))
  ];

  return (
    <WikiLayout filters={filters} setFilters={setFilters} activeCategory={activeCategory} onCategoryChange={setActiveCategory}>
      <Helmet><title>Wiki & Homebrew | Zar & Kule</title></Helmet>
      
      <div className="mb-8 p-8 bg-white border border-cbg rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
                <h1 className="text-4xl font-black text-mtf mb-2 tracking-tight uppercase">Kütüphane</h1>
                <p className="text-sti font-bold uppercase text-[10px] tracking-widest">
                    {filters.sources.includes('homebrew') ? "Homebrew İçerikler" : "Resmi Arşiv"}
                </p>
            </div>
            {isAuthenticated && (
                <Link to="/create-homebrew" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg flex items-center gap-2 transition-all active:scale-95">
                    <Plus size={20} /> Yeni Efsane Yaz
                </Link>
            )}
      </div>

      {loading && combinedData.length === 0 ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={40} /></div>
      ) : combinedData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
             {combinedData.map((item) => (
                <WikiCard 
                   key={`${item.type}-${item.id}-${isAuthenticated}`} 
                   item={item} 
                   variant={item.type} 
                   isAuthenticated={isAuthenticated}
                />
             ))}
          </div>
      ) : (
          <div className="text-center py-20 bg-white border border-cbg rounded-xl shadow-sm">
             <BookOpen size={32} className="text-sti mx-auto mb-4" />
             <h3 className="text-mtf font-bold">Sonuç bulunamadı.</h3>
          </div>
      )}
    </WikiLayout>
  );
};

export default WikiPage;
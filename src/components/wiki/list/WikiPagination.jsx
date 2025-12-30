// src/components/wiki/list/WikiPagination.jsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { setPage } from '../../../redux/actions/wikiActions';

/**
 * Wiki sayfalama componenti
 */
const WikiPagination = () => {
  const dispatch = useDispatch();
  const { pagination } = useSelector(state => state.wiki);
  const { page, totalPages, totalElements, size } = pagination;

  if (totalPages <= 1) return null;

  // Sayfa numaralarını hesapla
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);
    
    // Baştan itibaren düzelt
    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== page) {
      dispatch(setPage(newPage));
      // Sayfanın üstüne scroll
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageNumbers = getPageNumbers();
  const startItem = page * size + 1;
  const endItem = Math.min((page + 1) * size, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-cbg">
      {/* Bilgi */}
      <p className="text-sm text-sti">
        <span className="font-bold text-mtf">{startItem}-{endItem}</span>
        {' '}arası gösteriliyor, toplam{' '}
        <span className="font-bold text-mtf">{totalElements.toLocaleString('tr-TR')}</span>
        {' '}sonuç
      </p>
      
      {/* Sayfalama */}
      <div className="flex items-center gap-1">
        {/* İlk sayfa */}
        <button
          onClick={() => handlePageChange(0)}
          disabled={page === 0}
          className="p-2 rounded-lg text-sti hover:bg-cbg hover:text-mtf disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="İlk sayfa"
        >
          <ChevronsLeft size={18} />
        </button>
        
        {/* Önceki */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className="p-2 rounded-lg text-sti hover:bg-cbg hover:text-mtf disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Önceki"
        >
          <ChevronLeft size={18} />
        </button>
        
        {/* Sayfa numaraları */}
        <div className="flex items-center gap-1 mx-2">
          {pageNumbers[0] > 0 && (
            <>
              <button
                onClick={() => handlePageChange(0)}
                className="w-10 h-10 rounded-lg text-sm font-bold text-sti hover:bg-cbg hover:text-mtf transition-colors"
              >
                1
              </button>
              {pageNumbers[0] > 1 && (
                <span className="px-2 text-sti">...</span>
              )}
            </>
          )}
          
          {pageNumbers.map(num => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${
                num === page
                  ? 'bg-cta text-white shadow-md shadow-cta/20'
                  : 'text-sti hover:bg-cbg hover:text-mtf'
              }`}
            >
              {num + 1}
            </button>
          ))}
          
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
                <span className="px-2 text-sti">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages - 1)}
                className="w-10 h-10 rounded-lg text-sm font-bold text-sti hover:bg-cbg hover:text-mtf transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
        
        {/* Sonraki */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-2 rounded-lg text-sti hover:bg-cbg hover:text-mtf disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Sonraki"
        >
          <ChevronRight size={18} />
        </button>
        
        {/* Son sayfa */}
        <button
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
          className="p-2 rounded-lg text-sti hover:bg-cbg hover:text-mtf disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Son sayfa"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default WikiPagination;

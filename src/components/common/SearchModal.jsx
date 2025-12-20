// src/components/common/SearchModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ScrollText, Swords, Users, MapPinned, ShoppingBag } from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const { sendRequest, loading } = useAxios();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 2) {
        sendRequest({
          url: '/search',
          method: METHODS.GET,
          params: { q: query },
          callbackSuccess: (res) => setResults(res.data),
          showErrorToast: false,
        });
      } else {
        setResults(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getIcon = (type) => {
    const icons = {
      WIKI: <ScrollText size={16} className="text-blue-500" />,
      HOMEBREW: <ScrollText size={16} className="text-purple-500" />,
      CAMPAIGN: <Swords size={16} className="text-red-500" />,
      VENUE: <MapPinned size={16} className="text-green-500" />,
      USER: <Users size={16} className="text-cta" />,
      LISTING: <ShoppingBag size={16} className="text-yellow-500" />,
    };
    return icons[type] || <Search size={16} />;
  };

  const getLink = (item) => {
    const links = {
      WIKI: `/wiki/${item.slug}`,
      HOMEBREW: `/homebrew/${item.slug}`,
      CAMPAIGN: `/party-finder?id=${item.id}`,
      VENUE: `/venues/${item.id}`,
      USER: `/profile/${item.username || item.slug}`,
      LISTING: `/marketplace/${item.id}`,
    };
    return links[item.type] || '#';
  };

  const filterResults = () => {
    if (!results) return [];
    if (activeTab === 'all') return results;
    return results.filter(r => r.type === activeTab.toUpperCase());
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div 
        className="w-full max-w-2xl bg-mbg rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-cbg">
          <Search size={24} className="text-sti flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Wiki, homebrew, kampanya, mekan ara..."
            className="flex-1 bg-transparent text-lg text-mtf placeholder:text-sti/50 outline-none font-medium"
          />
          {loading && <Loader2 size={20} className="animate-spin text-cta" />}
          <button 
            onClick={onClose}
            className="p-2 text-sti hover:text-mtf hover:bg-cbg rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        {results && results.length > 0 && (
          <div className="flex gap-1 px-4 pt-3 border-b border-cbg overflow-x-auto">
            {['all', 'wiki', 'homebrew', 'campaign', 'venue', 'user'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-t-lg transition-colors whitespace-nowrap
                  ${activeTab === tab 
                    ? 'bg-cta/10 text-cta border-b-2 border-cta' 
                    : 'text-sti hover:text-mtf hover:bg-cbg/50'}
                `}
              >
                {tab === 'all' ? 'Tümü' : tab}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-8 text-center">
              <Search size={40} className="mx-auto text-cbg mb-3" />
              <p className="text-sti text-sm">Aramaya başlamak için en az 2 karakter girin</p>
            </div>
          ) : loading ? (
            <div className="p-8 text-center">
              <Loader2 size={32} className="mx-auto animate-spin text-cta mb-3" />
              <p className="text-sti text-sm">Aranıyor...</p>
            </div>
          ) : results && results.length === 0 ? (
            <div className="p-8 text-center">
              <X size={40} className="mx-auto text-cbg mb-3" />
              <p className="text-sti text-sm">Sonuç bulunamadı</p>
              <p className="text-sti/60 text-xs mt-1">Farklı anahtar kelimeler deneyin</p>
            </div>
          ) : (
            filterResults().map((item, index) => (
              <Link
                key={`${item.type}-${item.id || index}`}
                to={getLink(item)}
                onClick={onClose}
                className="flex items-center gap-3 p-4 hover:bg-cbg/30 transition-colors border-b border-cbg/30"
              >
                <div className="w-10 h-10 rounded-xl bg-cbg/50 flex items-center justify-center flex-shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-mtf truncate">
                    {item.title || item.name || item.username}
                  </p>
                  <p className="text-xs text-sti/70 truncate">
                    {item.excerpt || item.description || item.category}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-sti/50 uppercase bg-cbg/50 px-2 py-1 rounded">
                  {item.type}
                </span>
              </Link>
            ))
          )}
        </div>

        {/* Keyboard Hint */}
        <div className="px-4 py-3 bg-cbg/30 border-t border-cbg flex items-center justify-between">
          <p className="text-[10px] text-sti/60">
            <kbd className="px-1.5 py-0.5 bg-cbg rounded text-[10px] mr-1">ESC</kbd> kapatmak için
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
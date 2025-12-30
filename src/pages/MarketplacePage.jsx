// src/pages/MarketplacePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { 
  ShoppingBag, Search, Filter, Plus, Loader2, ChevronLeft,
  Dice5, Puzzle, BookOpen, Package, Grid3X3, Tag, MapPin,
  Clock, User, ChevronDown, X, Sparkles
} from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

// Kategori ve Durum çevirileri
const CATEGORY_LABELS = {
  DICE: { label: 'Zar Setleri', icon: <Dice5 size={16} /> },
  MINIATURE: { label: 'Minyatürler', icon: <Puzzle size={16} /> },
  RULEBOOK: { label: 'Kural Kitapları', icon: <BookOpen size={16} /> },
  BOARD_GAME: { label: 'Kutu Oyunları', icon: <Grid3X3 size={16} /> },
  ACCESSORY: { label: 'Aksesuarlar', icon: <Package size={16} /> },
  OTHER: { label: 'Diğer', icon: <Tag size={16} /> },
};

const CONDITION_LABELS = {
  NEW: { label: 'Sıfır', color: 'bg-green-500' },
  USED_LIKE_NEW: { label: 'Sıfır Gibi', color: 'bg-blue-500' },
  USED_GOOD: { label: 'İyi Durumda', color: 'bg-yellow-500' },
  USED_FAIR: { label: 'Kullanılmış', color: 'bg-orange-500' },
};

const MarketplacePage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCondition, setSelectedCondition] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = () => {
    sendRequest({
      url: '/marketplace',
      method: METHODS.GET,
      callbackSuccess: (res) => {
        setListings(res.data);
        setFilteredListings(res.data);
      },
    });
  };

  // Filter & Sort
  useEffect(() => {
    let result = [...listings];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(l => 
        l.title?.toLowerCase().includes(term) ||
        l.description?.toLowerCase().includes(term)
      );
    }

    // Category
    if (selectedCategory !== 'ALL') {
      result = result.filter(l => l.category === selectedCategory);
    }

    // Condition
    if (selectedCondition !== 'ALL') {
      result = result.filter(l => l.condition === selectedCondition);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

    setFilteredListings(result);
  }, [listings, searchTerm, selectedCategory, selectedCondition, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedCondition('ALL');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'ALL' || selectedCondition !== 'ALL';

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Bit Pazarı | Zar & Kule</title>
        <meta name="description" content="İkinci el D&D ürünleri al, sat veya takas et." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden sm:h-[600px] sm:flex sm:items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://cdna.artstation.com/p/assets/images/images/020/107/772/large/samantha-kung-medieval-marketplace.jpg?1566397964')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/50 via-amber-900/55 to-mtf" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-bold uppercase tracking-wider mb-6">
              <ShoppingBag size={16} />
              Bit Pazarı
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Hazineni <span className="text-amber-400">Paylaş</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl">
              Kullanmadığın zar setlerini, minyatürleri ve kural kitaplarını sat veya takas et. 
              Başka maceracıların hazinelerine göz at!
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                <input
                  type="text"
                  placeholder="Ürün ara... (örn: zar seti, PHB, goblin minyatür)"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md text-white placeholder:text-white/40 rounded-xl border border-white/20 outline-none focus:border-amber-400 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold transition-all
                  ${showFilters || hasActiveFilters
                    ? 'bg-amber-500 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'}
                `}
              >
                <Filter size={18} />
                Filtrele
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 p-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-white/60 text-xs font-bold uppercase mb-2">Kategori</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/10 text-white rounded-lg border border-white/20 outline-none appearance-none cursor-pointer"
                    >
                      <option value="ALL" className="text-mtf">Tümü</option>
                      {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                        <option key={key} value={key} className="text-mtf">{val.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-white/60 text-xs font-bold uppercase mb-2">Durum</label>
                    <select
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/10 text-white rounded-lg border border-white/20 outline-none appearance-none cursor-pointer"
                    >
                      <option value="ALL" className="text-mtf">Tümü</option>
                      {Object.entries(CONDITION_LABELS).map(([key, val]) => (
                        <option key={key} value={key} className="text-mtf">{val.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-white/60 text-xs font-bold uppercase mb-2">Sıralama</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/10 text-white rounded-lg border border-white/20 outline-none appearance-none cursor-pointer"
                    >
                      <option value="newest" className="text-mtf">En Yeni</option>
                      <option value="oldest" className="text-mtf">En Eski</option>
                      <option value="price-low" className="text-mtf">Fiyat (Düşük → Yüksek)</option>
                      <option value="price-high" className="text-mtf">Fiyat (Yüksek → Düşük)</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 flex items-center gap-2 text-amber-400 text-sm font-bold hover:text-amber-300 transition-colors"
                  >
                    <X size={14} /> Filtreleri Temizle
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="text-sti">
              <span className="font-bold text-mtf">{filteredListings.length}</span> ilan bulundu
              {hasActiveFilters && ' (filtrelenmiş)'}
            </p>
          </div>

          {isAuthenticated && (
            <Link
              to="/pazar/ilan-olustur"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30"
            >
              <Plus size={18} /> İlan Ver
            </Link>
          )}
        </div>

        {/* Category Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`
              px-4 py-2 rounded-xl text-sm font-bold transition-all
              ${selectedCategory === 'ALL' 
                ? 'bg-amber-500 text-white' 
                : 'bg-white border border-cbg text-sti hover:border-amber-500/50'}
            `}
          >
            Tümü
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                ${selectedCategory === key 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-white border border-cbg text-sti hover:border-amber-500/50'}
              `}
            >
              {val.icon} {val.label}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-amber-500" size={48} />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 bg-white border border-cbg rounded-2xl">
            <ShoppingBag size={64} className="mx-auto text-cbg mb-4" />
            <h3 className="text-xl font-black text-mtf mb-2">İlan Bulunamadı</h3>
            <p className="text-sti mb-6">
              {hasActiveFilters 
                ? 'Arama kriterlerine uygun ilan yok.' 
                : 'Henüz ilan yok. İlk ilan veren sen ol!'}
            </p>
            {isAuthenticated && (
              <Link
                to="/pazar/ilan-olustur"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
              >
                <Plus size={18} /> İlan Ver
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* CTA for Guests */}
        {!isAuthenticated && (
          <div className="mt-12 text-center py-12 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
            <Sparkles size={40} className="mx-auto text-amber-500 mb-4" />
            <h3 className="text-xl font-black text-mtf mb-2">Satmak İstediğin Bir Şey mi Var?</h3>
            <p className="text-sti mb-6 max-w-md mx-auto">
              Kullanmadığın D&D ürünlerini topluluğa sun. Ücretsiz kayıt ol ve hemen ilan ver!
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/kayit"
                className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors"
              >
                Kayıt Ol
              </Link>
              <Link
                to="/giris"
                className="px-6 py-3 bg-white border border-cbg text-mtf rounded-xl font-bold hover:border-amber-500/50 transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== LISTING CARD ====================

const ListingCard = ({ listing }) => {
  const category = CATEGORY_LABELS[listing.category] || CATEGORY_LABELS.OTHER;
  const condition = CONDITION_LABELS[listing.condition] || CONDITION_LABELS.USED_GOOD;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <Link
      to={`/pazar/${listing.id}`}
      className="bg-white border border-cbg rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
        {listing.imageUrl ? (
          <img 
            src={listing.imageUrl} 
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {React.cloneElement(category.icon, { size: 48, className: 'text-amber-300' })}
          </div>
        )}
        
        {/* Condition Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 ${condition.color} text-white text-xs font-bold rounded-lg`}>
          {condition.label}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg flex items-center gap-1">
          {category.icon} {category.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-mtf group-hover:text-amber-600 transition-colors line-clamp-1 mb-1">
          {listing.title}
        </h3>
        <p className="text-xs text-sti line-clamp-2 mb-3">
          {listing.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-black text-amber-600">
            {formatPrice(listing.price)}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-cbg text-xs text-sti">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
              {listing.seller?.avatarUrl ? (
                <img src={listing.seller.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={12} className="text-amber-600" />
              )}
            </div>
            <span className="truncate max-w-[80px]">
              {listing.seller?.displayName || listing.seller?.username}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            {formatDate(listing.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MarketplacePage;
// src/pages/VenuesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { 
  MapPinned, Search, Filter, Plus, Loader2, ChevronLeft,
  Coffee, Store, Users, BookOpen, Package, MapPin, Star,
  Navigation, X, Phone, Globe, Instagram, ChevronRight,
  Sparkles, Map, List, Clock
} from 'lucide-react';
import useAxios, { METHODS } from '../hooks/useAxios';

// Mekan türü tanımları
const VENUE_TYPES = {
  CAFE: { label: 'Kafe', icon: <Coffee size={16} />, color: 'bg-amber-500' },
  GAME_STORE: { label: 'Oyun Mağazası', icon: <Store size={16} />, color: 'bg-purple-500' },
  COMMUNITY_CENTER: { label: 'Topluluk Merkezi', icon: <Users size={16} />, color: 'bg-blue-500' },
  LIBRARY: { label: 'Kütüphane', icon: <BookOpen size={16} />, color: 'bg-green-500' },
  OTHER: { label: 'Diğer', icon: <Package size={16} />, color: 'bg-gray-500' },
};

// Türkiye şehirleri (popüler olanlar)
const CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 
  'Konya', 'Gaziantep', 'Mersin', 'Kayseri', 'Eskişehir', 'Samsun'
];

const VenuesPage = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'reviews' | 'name'

  // Mekanları yükle
  useEffect(() => {
    fetchVenues();
    getUserLocation();
  }, []);

  const fetchVenues = () => {
    sendRequest({
      url: '/venues/public',
      method: METHODS.GET,
      callbackSuccess: (res) => {
        setVenues(res.data);
        setFilteredVenues(res.data);
      },
    });
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Konum izni alınamadı:', err)
      );
    }
  };

  // Yakındaki mekanları getir
  const handleNearbySearch = () => {
    if (!userLocation) {
      alert('Konum bilginize ulaşılamadı. Lütfen tarayıcı izni verin.');
      return;
    }
    
    sendRequest({
      url: '/venues/nearby',
      method: METHODS.GET,
      params: { lat: userLocation.lat, lon: userLocation.lng, maxKm: 25 },
      callbackSuccess: (res) => {
        setVenues(res.data);
        setFilteredVenues(res.data);
      },
    });
  };

  // Filtreleme
  useEffect(() => {
    let result = [...venues];

    // Arama
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(v => 
        v.name?.toLowerCase().includes(term) ||
        v.address?.toLowerCase().includes(term) ||
        v.district?.toLowerCase().includes(term)
      );
    }

    // Tür filtresi
    if (selectedType !== 'ALL') {
      result = result.filter(v => v.type === selectedType);
    }

    // Şehir filtresi
    if (selectedCity !== 'ALL') {
      result = result.filter(v => v.city === selectedCity);
    }

    // Sıralama
    result.sort((a, b) => {
      if (sortBy === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
      if (sortBy === 'reviews') return (b.reviewCount || 0) - (a.reviewCount || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name, 'tr');
      if (sortBy === 'distance' && a.distanceKm && b.distanceKm) return a.distanceKm - b.distanceKm;
      return 0;
    });

    setFilteredVenues(result);
  }, [venues, searchTerm, selectedType, selectedCity, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('ALL');
    setSelectedCity('ALL');
    setSortBy('rating');
  };

  const hasActiveFilters = searchTerm || selectedType !== 'ALL' || selectedCity !== 'ALL';

  // Şehirlerdeki mekan sayısı
  const getCityCount = (city) => venues.filter(v => v.city === city).length;

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Dost Mekanlar | Zar & Kule</title>
        <meta name="description" content="D&D oynayabileceğin kafeler, oyun mağazaları ve topluluk mekanlarını keşfet." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://i.pinimg.com/736x/a8/b2/c4/a8b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-emerald-900/80 to-mbg" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-bold uppercase tracking-wider mb-6">
              <MapPinned size={16} />
              Dost Mekanlar
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Macera <span className="text-emerald-400">Burada</span> Başlar
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl">
              D&D oynayabileceğin kafeler, oyun mağazaları ve topluluk mekanlarını keşfet. 
              Yeni arkadaşlıklar kur, masalara katıl!
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                <input
                  type="text"
                  placeholder="Mekan veya adres ara..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md text-white placeholder:text-white/40 rounded-xl border border-white/20 outline-none focus:border-emerald-400 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                onClick={handleNearbySearch}
                disabled={!userLocation}
                className={`
                  flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold transition-all
                  ${userLocation 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-white/10 text-white/50 cursor-not-allowed'}
                `}
              >
                <Navigation size={18} />
                Yakınımda
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold transition-all
                  ${showFilters || hasActiveFilters
                    ? 'bg-emerald-500 text-white' 
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
                  {/* Type */}
                  <div>
                    <label className="block text-white/60 text-xs font-bold uppercase mb-2">Mekan Türü</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/10 text-white rounded-lg border border-white/20 outline-none appearance-none cursor-pointer"
                    >
                      <option value="ALL" className="text-mtf">Tümü</option>
                      {Object.entries(VENUE_TYPES).map(([key, val]) => (
                        <option key={key} value={key} className="text-mtf">{val.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-white/60 text-xs font-bold uppercase mb-2">Şehir</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/10 text-white rounded-lg border border-white/20 outline-none appearance-none cursor-pointer"
                    >
                      <option value="ALL" className="text-mtf">Tüm Şehirler</option>
                      {CITIES.map(city => (
                        <option key={city} value={city} className="text-mtf">{city}</option>
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
                      <option value="rating" className="text-mtf">En Yüksek Puan</option>
                      <option value="reviews" className="text-mtf">En Çok Yorum</option>
                      <option value="name" className="text-mtf">İsme Göre (A-Z)</option>
                      <option value="distance" className="text-mtf">Mesafeye Göre</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-bold hover:text-emerald-300 transition-colors"
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
              <span className="font-bold text-mtf">{filteredVenues.length}</span> mekan bulundu
              {hasActiveFilters && ' (filtrelenmiş)'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-white border border-cbg rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-sti hover:bg-mbg'}`}
              >
                <Map size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-sti hover:bg-mbg'}`}
              >
                <List size={18} />
              </button>
            </div>

            {isAuthenticated && (
              <Link
                to="/mekanlar/ekle"
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
              >
                <Plus size={18} /> Mekan Ekle
              </Link>
            )}
          </div>
        </div>

        {/* Type Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`
              px-4 py-2 rounded-xl text-sm font-bold transition-all
              ${selectedType === 'ALL' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white border border-cbg text-sti hover:border-emerald-500/50'}
            `}
          >
            Tümü
          </button>
          {Object.entries(VENUE_TYPES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                ${selectedType === key 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white border border-cbg text-sti hover:border-emerald-500/50'}
              `}
            >
              {val.icon} {val.label}
            </button>
          ))}
        </div>

        {/* Venues Grid/List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-20 bg-white border border-cbg rounded-2xl">
            <MapPinned size={64} className="mx-auto text-cbg mb-4" />
            <h3 className="text-xl font-black text-mtf mb-2">Mekan Bulunamadı</h3>
            <p className="text-sti mb-6">
              {hasActiveFilters 
                ? 'Arama kriterlerine uygun mekan yok.' 
                : 'Henüz mekan eklenmemiş. İlk ekleyen sen ol!'}
            </p>
            {isAuthenticated && (
              <Link
                to="/mekanlar/ekle"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
              >
                <Plus size={18} /> Mekan Ekle
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVenues.map((venue) => (
              <VenueListItem key={venue.id} venue={venue} />
            ))}
          </div>
        )}

        {/* CTA for Guests */}
        {!isAuthenticated && (
          <div className="mt-12 text-center py-12 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl">
            <Sparkles size={40} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="text-xl font-black text-mtf mb-2">Mekan Sahibi misin?</h3>
            <p className="text-sti mb-6 max-w-md mx-auto">
              Mekanını ekle, topluluğa tanıt ve D&D severlerle buluş!
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/kayit"
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
              >
                Kayıt Ol
              </Link>
              <Link
                to="/giris"
                className="px-6 py-3 bg-white border border-cbg text-mtf rounded-xl font-bold hover:border-emerald-500/50 transition-colors"
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

// ==================== VENUE CARD ====================

const VenueCard = ({ venue }) => {
  const type = VENUE_TYPES[venue.type] || VENUE_TYPES.OTHER;

  return (
    <Link
      to={`/mekanlar/${venue.id}`}
      className="bg-white border border-cbg rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group"
    >
      {/* Image/Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
        {venue.imageUrl ? (
          <img 
            src={venue.imageUrl} 
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {React.cloneElement(type.icon, { size: 48, className: 'text-emerald-300' })}
          </div>
        )}
        
        {/* Type Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 ${type.color} text-white text-xs font-bold rounded-lg flex items-center gap-1`}>
          {type.icon} {type.label}
        </div>

        {/* Distance Badge (if available) */}
        {venue.distanceKm && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg flex items-center gap-1">
            <Navigation size={12} /> {venue.distanceKm.toFixed(1)} km
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-mtf group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1">
          {venue.name}
        </h3>
        
        <p className="text-xs text-sti flex items-center gap-1 mb-3">
          <MapPin size={12} className="text-emerald-500" />
          {venue.district && `${venue.district}, `}{venue.city || 'Konum bilgisi yok'}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="font-bold text-mtf">{venue.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="text-xs text-sti">({venue.reviewCount || 0})</span>
          </div>
          
          <ChevronRight size={16} className="text-sti group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
};

// ==================== VENUE LIST ITEM ====================

const VenueListItem = ({ venue }) => {
  const type = VENUE_TYPES[venue.type] || VENUE_TYPES.OTHER;

  return (
    <Link
      to={`/mekanlar/${venue.id}`}
      className="flex gap-4 bg-white border border-cbg rounded-2xl p-4 hover:border-emerald-500/50 hover:shadow-lg transition-all group"
    >
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
        {venue.imageUrl ? (
          <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {React.cloneElement(type.icon, { size: 32, className: 'text-emerald-300' })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-mtf group-hover:text-emerald-600 transition-colors truncate">
            {venue.name}
          </h3>
          <span className={`flex-shrink-0 px-2 py-0.5 ${type.color} text-white text-[10px] font-bold rounded`}>
            {type.label}
          </span>
        </div>

        <p className="text-xs text-sti flex items-center gap-1 mb-2">
          <MapPin size={12} className="text-emerald-500" />
          {venue.address || `${venue.district}, ${venue.city}`}
        </p>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="font-bold text-mtf">{venue.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="text-sti">({venue.reviewCount || 0} yorum)</span>
          </div>

          {venue.distanceKm && (
            <div className="flex items-center gap-1 text-sti">
              <Navigation size={12} />
              {venue.distanceKm.toFixed(1)} km
            </div>
          )}

          {venue.phone && (
            <div className="flex items-center gap-1 text-sti">
              <Phone size={12} />
              İletişim
            </div>
          )}
        </div>
      </div>

      <ChevronRight size={20} className="text-sti self-center group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
    </Link>
  );
};

export default VenuesPage;
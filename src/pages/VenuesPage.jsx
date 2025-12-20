import React, { useState, useEffect } from 'react';
import VenueMap from '../components/venue/VenueMap';
import venueService from '../services/venueService';
import VenueDetailModal from '../components/venue/VenueDetailModal';
import CreateVenueModal from '../components/venue/CreateVenueModal';
import {  VenueTypeLabels } from '../constants/venueEnums';
import { Search, Navigation, Plus, MapPin, Star, Filter } from 'lucide-react';

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [focusCoords, setFocusCoords] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(""); // Şehir filtresi
  const [userLocation, setUserLocation] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchInitialVenues();
    // Tarayıcı konumunu başlat
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Konum izni alınamadı:", err)
      );
    }
  }, []);

  const fetchInitialVenues = async () => {
    try {
      setLoading(true);
      const res = await venueService.getPublicVenues();
      setVenues(res.data);
    } catch (err) {
      console.error("Mekan yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. YAKINDAKİLER ÖZELLİĞİ
  const handleNearbySearch = () => {
    if (!userLocation) {
      alert("Konum bilginize ulaşılamadı. Lütfen izin verin.");
      return;
    }
    setLoading(true);
    venueService.getNearbyVenues(userLocation.lat, userLocation.lng, 20) // 20km mesafe
      .then(res => {
        setVenues(res.data);
        if (res.data.length > 0) {
          setFocusCoords([res.data[0].latitude, res.data[0].longitude]);
        }
      })
      .catch(() => alert("Yakınlarda mekan bulunamadı."))
      .finally(() => setLoading(false));
  };

  // Sidebar tıklama: Detay aç ve haritayı oraya odakla
  const onVenueClick = (v) => {
    setSelectedId(v.id);
    if (v.latitude && v.longitude) {
      setFocusCoords([v.latitude, v.longitude]);
    }
  };

  // Benzersiz şehirleri listele (Filtreleme için)
  const uniqueCities = [...new Set(venues.map(v => v.city).filter(Boolean))];

  // Filtreleme mantığı: Arama + Şehir
  const filteredVenues = venues.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || v.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-[var(--color-mbg)]">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-96 flex flex-col border-r border-stone-300 bg-[var(--color-cbg)] z-10">
        <div className="p-4 space-y-4 border-b border-stone-300">
          <h2 className="text-xl font-bold text-[var(--color-mtf)] uppercase italic tracking-tighter">MEKANLAR</h2>
          
          <div className="space-y-2">
            {/* Arama ve Yakınımda Ara Butonu */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 text-[var(--color-sti)]" size={16} />
                <input 
                  type="text"
                  className="w-full pl-8 pr-2 py-2 border border-stone-300 rounded font-serif outline-none bg-[var(--color-mbg)] text-[var(--color-mtf)] focus:border-[var(--color-cta)]"
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={handleNearbySearch}
                className="p-2 bg-[var(--color-pb)] text-[var(--color-td)] rounded hover:bg-[var(--color-pbh)] transition-colors"
                title="Yakınımda Ara"
              >
                <Navigation size={18} />
              </button>
            </div>

            {/* 2. ŞEHRE GÖRE FİLTRELEME DROPDOWN */}
            <div className="flex items-center gap-2 bg-[var(--color-mbg)] border border-stone-300 rounded px-2">
              <Filter size={14} className="text-[var(--color-sti)]" />
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2 bg-transparent text-sm font-serif outline-none text-[var(--color-mtf)]"
              >
                <option value="">Tüm Şehirler</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* LİSTE ALANI */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {loading ? (
            <p className="text-center italic text-[var(--color-sti)] py-4 uppercase">Keşfediliyor...</p>
          ) : filteredVenues.length > 0 ? (
            filteredVenues.map(v => (
              <div 
                key={v.id} 
                onClick={() => onVenueClick(v)}
                className={`p-3 rounded border cursor-pointer transition-all ${
                  selectedId === v.id ? 'bg-[var(--color-mbg)] border-[var(--color-cta)] shadow-md translate-x-1' : 'bg-white/40 border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[var(--color-mtf)] leading-tight">{v.name}</h3>
                  <span className="text-[9px] font-black uppercase text-[var(--color-cta)]">
                    {VenueTypeLabels[v.type] || 'Bilinmeyen'}
                  </span>
                </div>
                
                {/* 3. ŞEHİR / BÖLGE GÖSTERGESİ */}
                <p className="text-[11px] text-[var(--color-sti)] mt-1 flex items-center gap-1 italic">
                  <MapPin size={10} className="text-[var(--color-cta)]"/> 
                  {v.district && `${v.district}, `}{v.city || 'Konum Bilgisi Yok'}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-[var(--color-cta)] fill-[var(--color-cta)]" />
                    <span className="text-xs font-bold text-[var(--color-mtf)]">{v.averageRating || 0}</span>
                  </div>
                  <span className="text-[10px] text-[var(--color-sti)] font-bold">{v.reviewCount} Yorum</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[var(--color-sti)] py-10 uppercase text-xs">Mekan bulunamadı.</p>
          )}
        </div>
      </div>

      {/* HARİTA ALANI */}
      <div className="flex-1 relative">
        <VenueMap 
          venues={filteredVenues} 
          onVenueSelect={setSelectedId} 
          focusCoords={focusCoords}
        />
        
        {/* Mekan Ekle Butonu */}
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="absolute bottom-6 right-6 z-[400] w-14 h-14 bg-[var(--color-pb)] text-[var(--color-td)] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* MODALLAR */}
      {selectedId && <VenueDetailModal id={selectedId} onClose={() => setSelectedId(null)} />}
      
      {isCreateOpen && (
        <CreateVenueModal 
          onClose={() => setIsCreateOpen(false)} 
          userLocation={userLocation}
          onVenueCreated={fetchInitialVenues}
        />
      )}
    </div>
  );
};

export default VenuesPage;
// src/pages/PartyFinderPage.jsx - TAMAMEN YENİDEN
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Search, Filter, X, Swords, Users, MapPin, Monitor, 
  Calendar, ChevronRight, ChevronDown, Loader2, Crown, Globe,
  Clock, CheckCircle, AlertCircle, Sparkles
} from 'lucide-react';

import useAxios, { METHODS } from '../hooks/useAxios';
import { SYSTEMS, PLATFORMS, FREQUENCIES } from '../constants/gameEnums';
import CampaignDetailModal from '../components/partyfinder/CampaignDetailModal';

const PartyFinderPage = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  
  const [filters, setFilters] = useState({
    search: '',
    system: '',
    platform: '',
    frequency: '',
    city: '',
    hasOpenSlots: false,
  });

  useEffect(() => {
    fetchCampaigns();
    if (isAuthenticated) fetchMyApplications();
  }, [isAuthenticated]);

  const fetchCampaigns = () => {
    sendRequest({
      url: '/campaigns',
      method: METHODS.GET,
      callbackSuccess: (res) => {
        setCampaigns(res.data);
        setFilteredCampaigns(res.data);
      }
    });
  };

  const fetchMyApplications = () => {
    sendRequest({
      url: '/campaigns/my-applications',
      method: METHODS.GET,
      callbackSuccess: (res) => setMyApplications(res.data.map(app => app.campaignId)),
      showErrorToast: false,
    });
  };

  // Filter Logic
  useEffect(() => {
    let result = [...campaigns];

    // Tab filter
    if (activeTab === 'my-campaigns' && user) {
      result = result.filter(c => c.dungeonMaster?.username === user.username);
    } else if (activeTab === 'applied' && user) {
      result = result.filter(c => myApplications.includes(c.id));
    }

    // Search
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(c => 
        c.title?.toLowerCase().includes(term) || 
        c.dungeonMaster?.displayName?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      );
    }

    // Other filters
    if (filters.system) result = result.filter(c => c.system === filters.system);
    if (filters.platform) result = result.filter(c => c.platform === filters.platform);
    if (filters.frequency) result = result.filter(c => c.frequency === filters.frequency);
    if (filters.city) {
      const cityTerm = filters.city.toLowerCase();
      result = result.filter(c => c.city?.toLowerCase().includes(cityTerm));
    }
    if (filters.hasOpenSlots) {
      result = result.filter(c => c.currentPlayers < c.maxPlayers && c.status === 'OPEN');
    }

    setFilteredCampaigns(result);
  }, [filters, campaigns, activeTab, user, myApplications]);

  const clearFilters = () => {
    setFilters({
      search: '',
      system: '',
      platform: '',
      frequency: '',
      city: '',
      hasOpenSlots: false,
    });
  };

  const hasActiveFilters = filters.system || filters.platform || filters.frequency || filters.city || filters.hasOpenSlots;

  const stats = {
    total: campaigns.length,
    open: campaigns.filter(c => c.status === 'OPEN').length,
    faceToFace: campaigns.filter(c => c.platform === 'FACE_TO_FACE').length,
    online: campaigns.filter(c => c.platform !== 'FACE_TO_FACE').length,
  };

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Oyun Bul - Party Finder | Zar & Kule</title>
        <meta name="description" content="D&D ve diğer masa üstü rol yapma oyunları için oyuncu ve DM bul. Online veya yüz yüze oyunlara katıl." />
      </Helmet>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative py-16 overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://cdnb.artstation.com/p/assets/images/images/031/312/947/large/alysha-lowery-table2.jpg?1603252402')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cta/20 border border-cta/30 text-cta text-sm font-bold uppercase tracking-wider mb-6">
              <Swords size={16} />
              Party Finder
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Masanı Bul, <span className="text-cta">Macerana Başla</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
              Oyun masaları seni bekliyor. İster şehrindeki yüz yüze oyunları, ister online maceraları keşfet.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                  <input
                    type="text"
                    placeholder="Oyun adı, sistem veya DM ara..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 text-white placeholder:text-white/40 rounded-xl outline-none focus:bg-white/20 transition-colors font-medium"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`
                    flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all
                    ${showFilters 
                      ? 'bg-cta text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20'}
                  `}
                >
                  <Filter size={18} />
                  <span className="hidden sm:inline">Filtreler</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-cta rounded-full animate-pulse" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span><strong className="text-white">{stats.open}</strong> Açık Masa</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin size={14} />
                <span><strong className="text-white">{stats.faceToFace}</strong> Yüz Yüze</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Globe size={14} />
                <span><strong className="text-white">{stats.online}</strong> Online</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FILTERS PANEL ==================== */}
      {showFilters && (
        <div className="bg-white border-y border-cbg shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* System */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">Sistem</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-mbg border border-cbg text-mtf py-2.5 px-3 pr-8 rounded-xl text-sm font-bold focus:border-cta outline-none"
                    value={filters.system}
                    onChange={(e) => setFilters({ ...filters, system: e.target.value })}
                  >
                    <option value="">Tümü</option>
                    {Object.entries(SYSTEMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-sti pointer-events-none" />
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">Platform</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-mbg border border-cbg text-mtf py-2.5 px-3 pr-8 rounded-xl text-sm font-bold focus:border-cta outline-none"
                    value={filters.platform}
                    onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                  >
                    <option value="">Tümü</option>
                    {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-sti pointer-events-none" />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">Sıklık</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-mbg border border-cbg text-mtf py-2.5 px-3 pr-8 rounded-xl text-sm font-bold focus:border-cta outline-none"
                    value={filters.frequency}
                    onChange={(e) => setFilters({ ...filters, frequency: e.target.value })}
                  >
                    <option value="">Tümü</option>
                    {Object.entries(FREQUENCIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-sti pointer-events-none" />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">Şehir</label>
                <input
                  type="text"
                  placeholder="İstanbul, Ankara..."
                  className="w-full bg-mbg border border-cbg text-mtf py-2.5 px-3 rounded-xl text-sm font-bold focus:border-cta outline-none"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>

              {/* Open Slots Toggle */}
              <div>
                <label className="block text-[10px] font-black text-sti uppercase tracking-wider mb-2">Durum</label>
                <button
                  onClick={() => setFilters({ ...filters, hasOpenSlots: !filters.hasOpenSlots })}
                  className={`
                    w-full py-2.5 px-3 rounded-xl text-sm font-bold transition-all border
                    ${filters.hasOpenSlots 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-mbg text-sti border-cbg hover:border-green-500'}
                  `}
                >
                  {filters.hasOpenSlots ? '✓ Açık Masalar' : 'Açık Masalar'}
                </button>
              </div>

              {/* Clear Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 px-3 rounded-xl text-sm font-bold text-sti hover:text-red-500 hover:bg-red-50 transition-all border border-cbg"
                >
                  <X size={14} className="inline mr-1" />
                  Temizle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex bg-white border border-cbg rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'all' ? 'bg-cta text-white shadow-md' : 'text-sti hover:text-mtf'
              }`}
            >
              Tüm Masalar
            </button>
            {isAuthenticated && (
              <>
                <button 
                  onClick={() => setActiveTab('my-campaigns')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'my-campaigns' ? 'bg-cta text-white shadow-md' : 'text-sti hover:text-mtf'
                  }`}
                >
                  Masalarım
                </button>
                <button 
                  onClick={() => setActiveTab('applied')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'applied' ? 'bg-cta text-white shadow-md' : 'text-sti hover:text-mtf'
                  }`}
                >
                  Başvurularım
                </button>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-sti">
              <strong className="text-mtf">{filteredCampaigns.length}</strong> masa bulundu
            </span>
            
            {isAuthenticated && (
              <Link
                to="/kampanya-olustur"
                className="flex items-center gap-2 px-5 py-2.5 bg-cta text-white rounded-xl font-bold text-sm hover:bg-cta-hover transition-all shadow-lg shadow-cta/30 hover:shadow-cta/50 hover:scale-105"
              >
                <Plus size={18} />
                Masa Kur
              </Link>
            )}
          </div>
        </div>

        {/* Campaign Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-cta" size={48} />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-20 bg-white border border-cbg rounded-2xl">
            <div className="w-20 h-20 bg-cbg/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Swords size={40} className="text-sti" />
            </div>
            <h3 className="text-xl font-black text-mtf mb-2">Macera Bulunamadı</h3>
            <p className="text-sti mb-6">Filtreleri değiştirmeyi dene veya kendi masanı kur.</p>
            {isAuthenticated && (
              <Link
                to="/kampanya-olustur"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-all"
              >
                <Plus size={18} />
                İlk Masayı Kur
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => (
              <CampaignCard 
                key={campaign.id}
                campaign={campaign}
                user={user}
                isApplied={myApplications.includes(campaign.id)}
                onOpenModal={() => setSelectedCampaign(campaign)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ==================== CTA SECTION ==================== */}
      {!isAuthenticated && (
        <section className="bg-pb py-16">
          <div className="container mx-auto px-4 text-center">
            <Sparkles size={40} className="mx-auto text-cta mb-4" />
            <h2 className="text-3xl font-black text-white mb-4">
              Maceraya Katılmaya Hazır mısın?
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              Hesap oluştur, oyun başvurusu yap veya kendi masanı kur!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/kayit"
                className="px-8 py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-all shadow-lg"
              >
                Ücretsiz Kayıt Ol
              </Link>
              <Link
                to="/giris"
                className="px-8 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ==================== MODAL ==================== */}
      {selectedCampaign && (
        <CampaignDetailModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          user={user}
          isAuthenticated={isAuthenticated}
          updateList={fetchCampaigns}
          hasApplied={myApplications.includes(selectedCampaign.id)}
          updateApplications={fetchMyApplications}
        />
      )}
    </div>
  );
};

// ==================== CAMPAIGN CARD COMPONENT ====================
const CampaignCard = ({ campaign, user, isApplied, onOpenModal }) => {
  const isMyCampaign = user && campaign.dungeonMaster?.username === user.username;
  const isOpen = campaign.status === 'OPEN';
  const isFull = campaign.currentPlayers >= campaign.maxPlayers;
  const slotsLeft = campaign.maxPlayers - campaign.currentPlayers;

  return (
    <div 
      onClick={onOpenModal}
      className="bg-white border border-cbg rounded-2xl overflow-hidden hover:border-cta/50 hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      {/* Top Bar */}
      <div className={`h-1.5 w-full ${isOpen && !isFull ? 'bg-gradient-to-r from-cta to-orange-400' : 'bg-cbg'}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-pb/10 text-pb text-[10px] font-black rounded uppercase">
              {SYSTEMS[campaign.system] || campaign.system}
            </span>
            {isMyCampaign && (
              <span className="px-2 py-1 bg-purple-500/10 text-purple-600 text-[10px] font-black rounded uppercase flex items-center gap-1">
                <Crown size={10} /> DM
              </span>
            )}
          </div>
          
          {isApplied ? (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 text-[10px] font-black rounded-full">
              <CheckCircle size={10} /> Başvuruldu
            </span>
          ) : isOpen && !isFull ? (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 text-[10px] font-black rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Açık
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-1 bg-cbg text-sti text-[10px] font-black rounded-full">
              <AlertCircle size={10} /> Dolu
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-mtf group-hover:text-cta transition-colors mb-2 line-clamp-1">
          {campaign.title}
        </h3>

        {/* DM Info */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cta/20 to-purple-500/20 flex items-center justify-center text-[10px] font-black text-cta">
            {campaign.dungeonMaster?.displayName?.charAt(0) || campaign.dungeonMaster?.username?.charAt(0)}
          </div>
          <span className="text-xs text-sti">
            DM: <span className="font-bold text-mtf">{campaign.dungeonMaster?.displayName || campaign.dungeonMaster?.username}</span>
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-sti bg-mbg px-3 py-2 rounded-lg">
            <Monitor size={14} className="text-cta flex-shrink-0" />
            <span className="truncate font-medium">{PLATFORMS[campaign.platform]}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-sti bg-mbg px-3 py-2 rounded-lg">
            <Clock size={14} className="text-cta flex-shrink-0" />
            <span className="truncate font-medium">{FREQUENCIES[campaign.frequency]}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-sti bg-mbg px-3 py-2 rounded-lg">
            <Users size={14} className="text-cta flex-shrink-0" />
            <span className="font-medium">{campaign.currentPlayers}/{campaign.maxPlayers} Oyuncu</span>
          </div>
          {campaign.city && (
            <div className="flex items-center gap-2 text-xs text-sti bg-mbg px-3 py-2 rounded-lg">
              <MapPin size={14} className="text-cta flex-shrink-0" />
              <span className="truncate font-medium">{campaign.city}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-sti line-clamp-2 mb-4">
          {campaign.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-cbg">
          {isOpen && !isFull && slotsLeft > 0 && (
            <span className="text-xs text-green-600 font-bold">
              {slotsLeft} yer kaldı!
            </span>
          )}
          {(isFull || !isOpen) && (
            <span className="text-xs text-sti font-medium">Kontenjan dolu</span>
          )}
          
          <span className="flex items-center gap-1 text-xs font-bold text-cta group-hover:translate-x-1 transition-transform">
            Detaylar <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PartyFinderPage;
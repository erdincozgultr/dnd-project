import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';

import useAxios, { METHODS } from '../hooks/useAxios';
import PartyFinderHero from '../components/partyfinder/PartyFinderHero';
import PartyFinderFilters from '../components/partyfinder/PartyFinderFilters';
import CampaignList from '../components/partyfinder/CampaignList';
import CampaignDetailModal from '../components/partyfinder/CampaignDetailModal';

const PartyFinderPage = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  
  // States
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [myApplications, setMyApplications] = useState([]); 
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); 
  
  const [filters, setFilters] = useState({
    search: '',
    system: '',
    platform: '',
    frequency: '',
    city: ''
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
          callbackSuccess: (res) => setMyApplications(res.data.map(app => app.campaignId))
      });
  };

  // Filter Logic
  useEffect(() => {
    let result = campaigns;

    if (activeTab === 'my-campaigns' && user) {
        result = result.filter(c => c.dungeonMaster.username === user.username);
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(term) || 
        c.dungeonMaster.displayName?.toLowerCase().includes(term)
      );
    }
    if (filters.system) result = result.filter(c => c.system === filters.system);
    if (filters.platform) result = result.filter(c => c.platform === filters.platform);
    if (filters.frequency) result = result.filter(c => c.frequency === filters.frequency);
    if (filters.city) {
        const cityTerm = filters.city.toLowerCase();
        result = result.filter(c => c.city && c.city.toLowerCase().includes(cityTerm));
    }

    setFilteredCampaigns(result);
  }, [filters, campaigns, activeTab, user]);

  return (
    <div className="min-h-screen bg-mbg pb-20 font-display">
      <Helmet><title>Oyun Bul | Zar & Kule</title></Helmet>

      <PartyFinderHero 
          filters={filters} 
          setFilters={setFilters} 
          showFilters={showFilters} 
          setShowFilters={setShowFilters} 
      />

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        
        {showFilters && (
            <PartyFinderFilters 
                filters={filters} 
                setFilters={setFilters} 
                onClear={() => setFilters({ search: '', system: '', platform: '', frequency: '', city: '' })} 
            />
        )}

        <div className="bg-mbg border border-cbg rounded-t-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
             <div className="flex bg-pb/20 p-1 rounded-lg border border-cbg/30">
                 <button 
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-cta text-white shadow-md' : 'text-sti hover:text-mtf hover:bg-white/5'}`}
                 >
                    Tüm İlanlar
                 </button>
                 {isAuthenticated && (
                     <button 
                        onClick={() => setActiveTab('my-campaigns')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'my-campaigns' ? 'bg-cta text-white shadow-md' : 'text-sti hover:text-mtf hover:bg-white/5'}`}
                     >
                        Yönettiğim Masalar
                     </button>
                 )}
             </div>

             {isAuthenticated && (
                <Link to="/create-campaign" className="bg-pb text-td px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-cta hover:text-white transition-all shadow-lg hover:shadow-cta/20 flex items-center gap-2 border border-cbg/30">
                    <Plus size={18} /> Yeni İlan Oluştur
                </Link>
             )}
        </div>

        <div className="bg-mbg/50 border-x border-b border-cbg rounded-b-xl p-6 min-h-[400px]">
            <CampaignList 
                campaigns={filteredCampaigns}
                loading={loading}
                onOpenModal={setSelectedCampaign}
                user={user}
                myApplications={myApplications}
            />
        </div>

      </div>

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

export default PartyFinderPage;
import React from 'react';
import { MapPin, Monitor, Users, Calendar, User, ChevronDown, CheckCircle, Swords } from 'lucide-react';
import { SYSTEMS, PLATFORMS, FREQUENCIES } from '../../constants/gameEnums';

const CampaignList = ({ campaigns, loading, onOpenModal, user, myApplications }) => {
  const hasApplied = (campaignId) => myApplications.includes(campaignId);

  if (loading) {
      return <div className="text-center py-20 text-sti font-medium animate-pulse">Zindan taranıyor...</div>;
  }

  if (campaigns.length === 0) {
      return (
        <div className="text-center py-16">
            <div className="bg-cbg/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Swords size={32} className="text-sti" />
            </div>
            <p className="text-mtf font-bold text-lg mb-1">Henüz bir macera bulunamadı.</p>
            <p className="text-sm text-sti">Filtreleri değiştirmeyi dene veya kendi masanı kur.</p>
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => {
            const isApplied = hasApplied(campaign.id);
            const isMyCampaign = user && campaign.dungeonMaster.username === user.username;
            
            return (
                <div key={campaign.id} className="bg-mbg border border-cbg rounded-xl shadow-sm hover:shadow-xl hover:border-cta/50 transition-all duration-300 flex flex-col h-full group overflow-hidden relative">
                    {/* Üst Çizgi */}
                    <div className={`h-1 w-full ${campaign.status === 'OPEN' ? 'bg-cta' : 'bg-cbg'}`}></div>
                    
                    <div className="p-5 flex flex-col h-full relative">
                        {isApplied && (
                            <div className="absolute top-2 right-2 z-10">
                                <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
                                    <CheckCircle size={10} /> BAŞVURULDU
                                </span>
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                            <span className="bg-pb/10 text-pb text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider border border-pb/10">
                                {SYSTEMS[campaign.system]}
                            </span>
                            {!isApplied && (
                                <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${campaign.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-cbg text-sti'}`}>
                                    {campaign.status === 'OPEN' ? 'AÇIK' : 'KAPALI'}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-black text-mtf mb-1 group-hover:text-cta transition-colors line-clamp-1">
                            {campaign.title}
                        </h3>
                        
                        {/* DM Info */}
                        <div className="flex items-center gap-2 mb-4 text-xs text-sti font-medium">
                            <User size={12} className="text-cta" />
                            <span>DM: <span className="text-mtf font-bold">{campaign.dungeonMaster.displayName}</span></span>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-sti mb-4 bg-pb/5 p-3 rounded-lg border border-cbg/30">
                            <div className="flex items-center gap-1.5 truncate">
                                <Monitor size={12} className="text-cta shrink-0" />
                                <span className="truncate">{PLATFORMS[campaign.platform]}</span>
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                                <Calendar size={12} className="text-cta shrink-0" />
                                <span className="truncate">{FREQUENCIES[campaign.frequency]}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users size={12} className="text-cta shrink-0" />
                                <span>{campaign.currentPlayers}/{campaign.maxPlayers}</span>
                            </div>
                            {campaign.city && (
                                <div className="flex items-center gap-1.5 truncate">
                                    <MapPin size={12} className="text-cta shrink-0" />
                                    <span className="truncate">{campaign.city}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Desc */}
                        <p className="text-sm text-sti/80 line-clamp-2 mb-5 flex-grow leading-relaxed">
                            {campaign.description}
                        </p>

                        {/* Button */}
                        <button 
                            onClick={() => onOpenModal(campaign)}
                            className={`w-full mt-auto py-2.5 rounded-lg border text-sm font-bold transition-all flex items-center justify-center gap-2 
                            ${isMyCampaign 
                                ? 'border-cta bg-cta/10 text-cta hover:bg-cta hover:text-white' 
                                : 'border-cbg text-mtf hover:border-cta hover:text-cta bg-white shadow-sm'}`}
                        >
                            {isMyCampaign ? 'Yönet' : 'İncele'} {isMyCampaign ? null : <ChevronDown size={14} className="-rotate-90" />}
                        </button>
                    </div>
                </div>
            );
        })}
    </div>
  );
};

export default CampaignList;
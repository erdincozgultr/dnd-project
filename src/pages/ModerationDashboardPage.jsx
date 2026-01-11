// src/pages/ModerationDashboardPage.jsx - FIXED with Real Stats

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Shield, Sparkles, FileText, Users, Swords, MapPin,
  AlertCircle, CheckCircle, Clock, TrendingUp
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import moderationService from '../services/moderationService';

// Tab Components
import HomebrewModeration from '../components/moderation/HomebrewModeration';
import BlogModeration from '../components/moderation/BlogModeration';
import GuildModeration from '../components/moderation/GuildModeration';
import CampaignModeration from '../components/moderation/CampaignModeration';
import VenueModeration from '../components/moderation/VenueModeration';
import AuditLogViewer from '../components/moderation/AuditLogViewer';

const ModerationDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('homebrew');

  // FIXED: Fetch real stats
  const { data: statsData } = useQuery({
    queryKey: ['mod-stats'],
    queryFn: () => moderationService.getStats(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const stats = statsData?.data || {
    pendingItems: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalActions: 0,
  };

  const tabs = [
    {
      id: 'homebrew',
      label: 'Homebrew',
      icon: <Sparkles size={18} />,
      color: 'purple',
      component: HomebrewModeration,
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: <FileText size={18} />,
      color: 'amber',
      component: BlogModeration,
    },
    {
      id: 'guild',
      label: 'Lonca',
      icon: <Users size={18} />,
      color: 'blue',
      component: GuildModeration,
    },
    {
      id: 'campaign',
      label: 'Partibul',
      icon: <Swords size={18} />,
      color: 'red',
      component: CampaignModeration,
    },
    {
      id: 'venue',
      label: 'Mekanlar',
      icon: <MapPin size={18} />,
      color: 'green',
      component: VenueModeration,
    },
    {
      id: 'audit',
      label: 'Audit Log',
      icon: <AlertCircle size={18} />,
      color: 'gray',
      component: AuditLogViewer,
    },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);
  const CurrentComponent = currentTab?.component;

  return (
    <div className="min-h-screen bg-mbg pb-20 font-display">
      <Helmet>
        <title>Moderasyon Paneli | Zar & Kule</title>
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 py-8 px-4 border-b border-white/10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-3">
            <Shield size={32} className="text-yellow-400" />
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              Moderasyon Paneli
            </h1>
          </div>
          <p className="text-white/70 font-medium">
            İçerik yönetimi ve topluluk denetimi
          </p>
        </div>
      </div>

      {/* Stats Cards - FIXED with Real Data */}
      <div className="container mx-auto max-w-7xl px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Clock size={24} />}
            label="Bekleyen İşlemler"
            value={stats.pendingItems}
            color="amber"
          />
          <StatCard
            icon={<CheckCircle size={24} />}
            label="Bugün Onaylanan"
            value={stats.approvedToday}
            color="green"
          />
          <StatCard
            icon={<AlertCircle size={24} />}
            label="Bugün Reddedilen"
            value={stats.rejectedToday}
            color="red"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Toplam İşlem"
            value={stats.totalActions}
            color="blue"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex gap-2 mb-6 border-b border-cbg pb-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-white text-mtf border-t-4 border-cta -mb-[2px] shadow-lg'
                  : 'bg-mbg text-sti hover:bg-white/50'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-cbg p-6">
          {CurrentComponent && <CurrentComponent />}
        </div>
      </div>
    </div>
  );
};

/**
 * Stat Card Component
 */
const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    amber: 'from-amber-500 to-orange-500',
    green: 'from-green-500 to-emerald-500',
    red: 'from-red-500 to-rose-500',
    blue: 'from-blue-500 to-indigo-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-cbg p-4 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-black text-mtf mb-1">{value}</p>
      <p className="text-xs font-bold text-sti uppercase">{label}</p>
    </div>
  );
};

export default ModerationDashboardPage;
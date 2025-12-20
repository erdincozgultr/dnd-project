// src/components/home/StatsSection.jsx
import React, { useEffect, useState } from 'react';
import { Users, ScrollText, Swords, MapPinned, Shield, Flame } from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHomebrews: 0,
    totalCampaigns: 0,
    totalVenues: 0,
    totalGuilds: 0,
    totalLikes: 0,
  });
  const { sendRequest } = useAxios();

  useEffect(() => {
    // Backend'de /api/stats/public endpoint'i varsa kullan
    // Yoksa ayrı ayrı count endpoint'lerinden çek veya mock data kullan
    sendRequest({
      url: '/stats/public',
      method: METHODS.GET,
      callbackSuccess: (res) => setStats(res.data),
      showErrorToast: false,
      callbackError: () => {
        // Mock data if endpoint doesn't exist
        setStats({
          totalUsers: 1250,
          totalHomebrews: 3420,
          totalCampaigns: 89,
          totalVenues: 45,
          totalGuilds: 23,
          totalLikes: 15680,
        });
      }
    });
  }, []);

  const statItems = [
    { label: 'Maceracı', value: stats.totalUsers, icon: <Users size={24} />, color: 'text-blue-500' },
    { label: 'Homebrew', value: stats.totalHomebrews, icon: <ScrollText size={24} />, color: 'text-purple-500' },
    { label: 'Aktif Masa', value: stats.totalCampaigns, icon: <Swords size={24} />, color: 'text-red-500' },
    { label: 'Dost Mekan', value: stats.totalVenues, icon: <MapPinned size={24} />, color: 'text-green-500' },
    { label: 'Lonca', value: stats.totalGuilds, icon: <Shield size={24} />, color: 'text-indigo-500' },
    { label: 'Beğeni', value: stats.totalLikes, icon: <Flame size={24} />, color: 'text-cta' },
  ];

  return (
    <section className="py-12 bg-cbg/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statItems.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-5 text-center border border-cbg hover:border-cta/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`${item.color} mb-2 flex justify-center group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <p className="text-2xl font-black text-mtf mb-1">
                {item.value?.toLocaleString()}
              </p>
              <p className="text-xs text-sti uppercase tracking-wider font-bold">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
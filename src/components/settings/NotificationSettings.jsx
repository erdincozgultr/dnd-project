// src/components/settings/NotificationSettings.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Bell, Mail, MessageSquare, Heart, Award, Users, Swords, Save, Loader2
} from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';

const NotificationSettings = ({ user }) => {
  const { sendRequest, loading } = useAxios();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    commentNotifications: true,
    likeNotifications: true,
    badgeNotifications: true,
    guildNotifications: true,
    campaignNotifications: true,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    sendRequest({
      url: '/users/notification-settings',
      method: METHODS.PATCH,
      data: settings,
      callbackSuccess: () => {
        toast.success('Bildirim tercihleri kaydedildi!');
      },
      callbackError: () => {
        toast.info('Bu özellik yakında aktif olacak');
      }
    });
  };

  const toggleItems = [
    { 
      key: 'emailNotifications', 
      label: 'E-posta Bildirimleri', 
      description: 'Önemli güncellemeleri e-posta ile al',
      icon: <Mail size={20} className="text-blue-500" />
    },
    { 
      key: 'commentNotifications', 
      label: 'Yorum Bildirimleri', 
      description: 'İçeriklerine yorum yapıldığında bildir',
      icon: <MessageSquare size={20} className="text-green-500" />
    },
    { 
      key: 'likeNotifications', 
      label: 'Beğeni Bildirimleri', 
      description: 'İçeriklerin beğenildiğinde bildir',
      icon: <Heart size={20} className="text-red-500" />
    },
    { 
      key: 'badgeNotifications', 
      label: 'Rozet Bildirimleri', 
      description: 'Yeni rozet kazandığında bildir',
      icon: <Award size={20} className="text-yellow-500" />
    },
    { 
      key: 'guildNotifications', 
      label: 'Lonca Bildirimleri', 
      description: 'Lonca aktiviteleri hakkında bildir',
      icon: <Users size={20} className="text-purple-500" />
    },
    { 
      key: 'campaignNotifications', 
      label: 'Kampanya Bildirimleri', 
      description: 'Kampanya başvuruları ve güncellemeleri',
      icon: <Swords size={20} className="text-cta" />
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-2">
          <Bell size={24} className="text-cta" />
          Bildirim Tercihleri
        </h2>
        <p className="text-sti text-sm">Hangi bildirimleri almak istediğini seç</p>
      </div>

      {/* Toggle List */}
      <div className="bg-white border border-cbg rounded-2xl overflow-hidden shadow-sm">
        {toggleItems.map((item, index) => (
          <div 
            key={item.key}
            className={`flex items-center justify-between p-5 ${index !== toggleItems.length - 1 ? 'border-b border-cbg' : ''}`}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <div>
                <p className="font-bold text-mtf">{item.label}</p>
                <p className="text-xs text-sti">{item.description}</p>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => handleToggle(item.key)}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${settings[item.key] ? 'bg-cta' : 'bg-cbg'}
              `}
            >
              <span 
                className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform
                  ${settings[item.key] ? 'translate-x-7' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-cta text-white hover:bg-cta-hover shadow-lg shadow-cta/30 transition-all"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Tercihleri Kaydet
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
// src/components/settings/PrivacySettings.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Lock, Eye, EyeOff, Globe, Users, Save, Loader2
} from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';

const PrivacySettings = ({ user }) => {
  const { sendRequest, loading } = useAxios();
  const [settings, setSettings] = useState({
    profileVisibility: 'public', // public, friends, private
    showActivity: true,
    showBadges: true,
    showGuild: true,
    showStats: true,
  });

  const handleVisibilityChange = (value) => {
    setSettings(prev => ({ ...prev, profileVisibility: value }));
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    sendRequest({
      url: '/users/privacy-settings',
      method: METHODS.PATCH,
      data: settings,
      callbackSuccess: () => {
        toast.success('Gizlilik ayarları kaydedildi!');
      },
      callbackError: () => {
        toast.info('Bu özellik yakında aktif olacak');
      }
    });
  };

  const visibilityOptions = [
    { value: 'public', label: 'Herkese Açık', icon: <Globe size={20} />, description: 'Herkes profilini görebilir' },
    { value: 'private', label: 'Gizli', icon: <Lock size={20} />, description: 'Sadece sen görebilirsin' },
  ];

  const privacyToggles = [
    { key: 'showActivity', label: 'Aktivite Geçmişi', description: 'Son aktivitelerini göster' },
    { key: 'showBadges', label: 'Rozetler', description: 'Kazandığın rozetleri göster' },
    { key: 'showGuild', label: 'Lonca Bilgisi', description: 'Hangi loncada olduğunu göster' },
    { key: 'showStats', label: 'İstatistikler', description: 'XP ve içerik sayılarını göster' },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-mtf uppercase tracking-tight flex items-center gap-2 mb-2">
          <Lock size={24} className="text-cta" />
          Gizlilik Ayarları
        </h2>
        <p className="text-sti text-sm">Profilinin ve verilerinin görünürlüğünü kontrol et</p>
      </div>

      {/* Profile Visibility */}
      <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-black text-mtf mb-4">Profil Görünürlüğü</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibilityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleVisibilityChange(option.value)}
              className={`
                flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left
                ${settings.profileVisibility === option.value 
                  ? 'border-cta bg-cta/5' 
                  : 'border-cbg hover:border-cta/50'}
              `}
            >
              <span className={settings.profileVisibility === option.value ? 'text-cta' : 'text-sti'}>
                {option.icon}
              </span>
              <div>
                <p className={`font-bold ${settings.profileVisibility === option.value ? 'text-cta' : 'text-mtf'}`}>
                  {option.label}
                </p>
                <p className="text-xs text-sti">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Toggles */}
      <div className="bg-white border border-cbg rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-cbg">
          <h3 className="text-lg font-black text-mtf">Profilde Göster</h3>
          <p className="text-xs text-sti">Profilinde hangi bilgilerin görüneceğini seç</p>
        </div>
        
        {privacyToggles.map((item, index) => (
          <div 
            key={item.key}
            className={`flex items-center justify-between p-5 ${index !== privacyToggles.length - 1 ? 'border-b border-cbg' : ''}`}
          >
            <div>
              <p className="font-bold text-mtf">{item.label}</p>
              <p className="text-xs text-sti">{item.description}</p>
            </div>
            
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
          Ayarları Kaydet
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings;
// src/pages/SettingsPage.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  User, Shield, Bell, Palette, Lock, Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';

import ProfileSettings from '../components/settings/ProfileSettings';
import AccountSettings from '../components/settings/AccountSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import PrivacySettings from '../components/settings/PrivacySettings';

const SettingsPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [activeSection, setActiveSection] = useState('profile');

  // Auth kontrolü
  if (!isAuthenticated) {
    return <Navigate to="/giris" replace />;
  }

  const menuItems = [
    { 
      id: 'profile', 
      label: 'Profil Ayarları', 
      icon: <User size={20} />,
      description: 'Avatar, banner, bio ve görünen isim'
    },
    { 
      id: 'account', 
      label: 'Hesap Ayarları', 
      icon: <Shield size={20} />,
      description: 'E-posta ve şifre değişikliği'
    },
    { 
      id: 'notifications', 
      label: 'Bildirim Tercihleri', 
      icon: <Bell size={20} />,
      description: 'Bildirim ve e-posta ayarları'
    },
    { 
      id: 'privacy', 
      label: 'Gizlilik', 
      icon: <Lock size={20} />,
      description: 'Profil görünürlüğü ve veri ayarları'
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings user={user} />;
      case 'account':
        return <AccountSettings user={user} />;
      case 'notifications':
        return <NotificationSettings user={user} />;
      case 'privacy':
        return <PrivacySettings user={user} />;
      default:
        return <ProfileSettings user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Ayarlar | Zar & Kule</title>
      </Helmet>

      {/* Header */}
      <div className="bg-pb py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <SettingsIcon size={28} className="text-cta" />
            <div>
              <h1 className="text-2xl font-black text-white">Ayarlar</h1>
              <p className="text-white/60 text-sm">Hesap ve profil ayarlarını yönet</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <nav className="bg-white border border-cbg rounded-2xl overflow-hidden shadow-sm sticky top-24">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    w-full flex items-center gap-3 p-4 text-left transition-all border-b border-cbg last:border-b-0
                    ${activeSection === item.id 
                      ? 'bg-cta/10 border-l-4 border-l-cta' 
                      : 'hover:bg-cbg/30 border-l-4 border-l-transparent'}
                  `}
                >
                  <span className={activeSection === item.id ? 'text-cta' : 'text-sti'}>
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${activeSection === item.id ? 'text-cta' : 'text-mtf'}`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-sti truncate">{item.description}</p>
                  </div>
                  <ChevronRight size={16} className={activeSection === item.id ? 'text-cta' : 'text-cbg'} />
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
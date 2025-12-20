// src/components/common/UserHoverCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Users, Calendar, Loader2 } from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';

const UserHoverCard = ({ username, children, placement = 'bottom' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const { sendRequest, loading } = useAxios();
  const timeoutRef = useRef(null);
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      if (!userData) {
        sendRequest({
          url: `/profile/${username}/card`,
          method: METHODS.GET,
          callbackSuccess: (res) => setUserData(res.data),
          showErrorToast: false,
        });
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const placementClasses = {
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div 
          ref={cardRef}
          className={`absolute z-50 w-72 ${placementClasses[placement]} animate-fade-in`}
        >
          <div className="bg-mbg border border-cbg rounded-xl shadow-2xl overflow-hidden">
            {loading || !userData ? (
              <div className="p-6 flex items-center justify-center">
                <Loader2 className="animate-spin text-cta" size={24} />
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-pb p-4 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-cbg overflow-hidden border-2 border-cta/30">
                    {userData.avatarUrl ? (
                      <img src={userData.avatarUrl} alt={userData.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cta/20 to-purple-500/20 flex items-center justify-center text-td font-black text-xl">
                        {userData.displayName?.charAt(0) || userData.username?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/profile/${userData.username}`}
                      className="text-td font-black text-sm hover:text-cta transition-colors truncate block"
                    >
                      {userData.displayName || userData.username}
                    </Link>
                    <p className="text-td/60 text-xs truncate">@{userData.username}</p>
                    {userData.title && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-cta/20 text-cta text-[10px] font-bold rounded uppercase">
                        {userData.title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="p-4 space-y-3">
                  {/* Rank */}
                  <div className="flex items-center justify-between">
                    <span className="text-sti text-xs font-medium flex items-center gap-1.5">
                      <Shield size={14} /> Rütbe
                    </span>
                    <span className="text-mtf text-xs font-bold">{userData.rankTier}</span>
                  </div>

                  {/* XP */}
                  <div className="flex items-center justify-between">
                    <span className="text-sti text-xs font-medium">Toplam XP</span>
                    <span className="text-cta text-xs font-black">{userData.totalXp?.toLocaleString()}</span>
                  </div>

                  {/* Content Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-sti text-xs font-medium">İçerik</span>
                    <span className="text-mtf text-xs font-bold">
                      {userData.homebrewCount + userData.blogCount} eser
                    </span>
                  </div>

                  {/* Guild */}
                  {userData.guildName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sti text-xs font-medium flex items-center gap-1.5">
                        <Users size={14} /> Lonca
                      </span>
                      <span className="text-purple-500 text-xs font-bold">
                        {userData.guildName} (Lv.{userData.guildLevel})
                      </span>
                    </div>
                  )}

                  {/* Member Since */}
                  <div className="flex items-center justify-between">
                    <span className="text-sti text-xs font-medium flex items-center gap-1.5">
                      <Calendar size={14} /> Üyelik
                    </span>
                    <span className="text-mtf text-xs font-bold">{userData.memberSinceDays} gün</span>
                  </div>

                  {/* Featured Badges */}
                  {userData.featuredBadges && userData.featuredBadges.length > 0 && (
                    <div className="pt-2 border-t border-cbg">
                      <p className="text-[10px] text-sti font-bold uppercase mb-2 flex items-center gap-1">
                        <Award size={12} /> Rozetler
                      </p>
                      <div className="flex gap-1.5">
                        {userData.featuredBadges.map((badge) => (
                          <div 
                            key={badge.id} 
                            className="w-8 h-8 rounded-lg bg-cbg/50 flex items-center justify-center"
                            title={badge.name}
                          >
                            {badge.iconUrl ? (
                              <img src={badge.iconUrl} alt={badge.name} className="w-6 h-6" />
                            ) : (
                              <Award size={16} className="text-yellow-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-cbg/30 border-t border-cbg">
                  <Link 
                    to={`/profile/${userData.username}`}
                    className="text-[10px] font-bold text-cta hover:underline uppercase tracking-wide"
                  >
                    Profile Tamamını Gör →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHoverCard;
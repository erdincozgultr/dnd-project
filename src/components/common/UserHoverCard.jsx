import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Shield, Award, Users, Calendar, Loader2 } from 'lucide-react';
import useAxios, { METHODS } from '../../hooks/useAxios';

const UserHoverCard = ({ username, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { sendRequest, loading } = useAxios();
  const enterTimeoutRef = useRef(null);
  const leaveTimeoutRef = useRef(null);
  const triggerRef = useRef(null);
  const cardRef = useRef(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    const cardWidth = 288;
    const cardHeight = 350;
    const padding = 8;

    let top = rect.bottom + padding + window.scrollY;
    let left = rect.left + (rect.width / 2) - (cardWidth / 2) + window.scrollX;

    // Sağ taşma
    if (left + cardWidth > window.innerWidth - padding) {
      left = window.innerWidth - cardWidth - padding;
    }
    // Sol taşma
    if (left < padding) {
      left = padding;
    }
    // Alt taşma - üstte göster
    if (rect.bottom + cardHeight > window.innerHeight - padding) {
      top = rect.top - cardHeight - padding + window.scrollY;
    }

    setPosition({ top, left });
  }, []);

  const showCard = useCallback(() => {
    clearTimeout(leaveTimeoutRef.current);
    calculatePosition();
    setIsVisible(true);
    
    if (!userData && username) {
      sendRequest({
        url: `/profile/${username}/card`,
        method: METHODS.GET,
        callbackSuccess: (res) => setUserData(res.data),
        showErrorToast: false,
      });
    }
  }, [userData, username, calculatePosition, sendRequest]);

  const hideCard = useCallback(() => {
    clearTimeout(enterTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  }, []);

  const handleTriggerEnter = () => {
    clearTimeout(leaveTimeoutRef.current);
    enterTimeoutRef.current = setTimeout(showCard, 400);
  };

  const handleTriggerLeave = () => {
    clearTimeout(enterTimeoutRef.current);
    hideCard();
  };

  const handleCardEnter = () => {
    clearTimeout(leaveTimeoutRef.current);
  };

  const handleCardLeave = () => {
    hideCard();
  };

  useEffect(() => {
    return () => {
      clearTimeout(enterTimeoutRef.current);
      clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // Portal content
  const portalContent = (
    <div 
      ref={cardRef}
      className={`fixed w-72 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ 
        top: position.top, 
        left: position.left,
        zIndex: 99999,
      }}
      onMouseEnter={handleCardEnter}
      onMouseLeave={handleCardLeave}
    >
      <div className="bg-mbg border border-cbg rounded-2xl shadow-2xl overflow-hidden">
        {loading || !userData ? (
          <div className="p-8 flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-cta" size={28} />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-pb p-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-cbg overflow-hidden border-2 border-cta/30 flex-shrink-0">
                {userData.avatarUrl ? (
                  <img src={userData.avatarUrl} alt={userData.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cta/30 to-purple-500/30 flex items-center justify-center text-td font-black text-xl">
                    {userData.displayName?.charAt(0) || userData.username?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-td font-black text-sm truncate">
                  {userData.displayName || userData.username}
                </p>
                <p className="text-td/60 text-xs truncate">@{userData.username}</p>
                {userData.title && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-cta/20 text-cta text-[10px] font-bold rounded uppercase">
                    {userData.title}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sti text-xs font-medium flex items-center gap-1.5">
                  <Shield size={14} className="text-cta" /> Rütbe
                </span>
                <span className="text-mtf text-xs font-bold">{userData.rankTier || 'Köylü'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sti text-xs font-medium">Toplam XP</span>
                <span className="text-cta text-xs font-black">{(userData.totalXp || 0).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sti text-xs font-medium">İçerik</span>
                <span className="text-mtf text-xs font-bold">
                  {(userData.homebrewCount || 0) + (userData.blogCount || 0)} eser
                </span>
              </div>

              {userData.guildName && (
                <div className="flex items-center justify-between">
                  <span className="text-sti text-xs font-medium flex items-center gap-1.5">
                    <Users size={14} className="text-purple-500" /> Lonca
                  </span>
                  <span className="text-purple-600 text-xs font-bold">
                    {userData.guildName} (Lv.{userData.guildLevel})
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sti text-xs font-medium flex items-center gap-1.5">
                  <Calendar size={14} className="text-sti" /> Üyelik
                </span>
                <span className="text-mtf text-xs font-bold">{userData.memberSinceDays || 0} gün</span>
              </div>

              {/* Badges */}
              {userData.featuredBadges && userData.featuredBadges.length > 0 && (
                <div className="pt-3 border-t border-cbg">
                  <p className="text-[10px] text-sti font-bold uppercase mb-2 flex items-center gap-1">
                    <Award size={12} className="text-yellow-500" /> Rozetler
                  </p>
                  <div className="flex gap-1.5">
                    {userData.featuredBadges.slice(0, 4).map((badge) => (
                      <div 
                        key={badge.id} 
                        className="w-8 h-8 rounded-lg bg-cbg flex items-center justify-center"
                        title={badge.name}
                      >
                        {badge.iconUrl ? (
                          <img src={badge.iconUrl} alt={badge.name} className="w-5 h-5" />
                        ) : (
                          <Award size={14} className="text-yellow-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <Link 
              to={`/profile/${userData.username}`}
              className="block px-4 py-3 bg-cbg/50 border-t border-cbg text-center hover:bg-cta hover:text-white transition-colors"
            >
              <span className="text-xs font-bold uppercase tracking-wide">
                Profili Görüntüle →
              </span>
            </Link>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <span 
        ref={triggerRef}
        className="cursor-pointer"
        onMouseEnter={handleTriggerEnter}
        onMouseLeave={handleTriggerLeave}
      >
        {children}
      </span>
      {typeof document !== 'undefined' && createPortal(portalContent, document.body)}
    </>
  );
};

export default UserHoverCard;
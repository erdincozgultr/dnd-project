import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Bell, Check, CheckCheck, ExternalLink,
  MessageSquare, Heart, Award, Users, AlertCircle
} from 'lucide-react';
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '../../redux/thunks/notificationThunks';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const getIcon = (type) => {
    const icons = {
      COMMENT: <MessageSquare size={16} className="text-blue-500" />,
      LIKE: <Heart size={16} className="text-red-500" />,
      BADGE: <Award size={16} className="text-yellow-500" />,
      GUILD: <Users size={16} className="text-purple-500" />,
      SYSTEM: <AlertCircle size={16} className="text-cta" />,
      CONTENT_APPROVED: <Check size={16} className="text-green-500" />,
      CONTENT_REJECTED: <AlertCircle size={16} className="text-red-500" />,
      CAMPAIGN_INVITE: <Users size={16} className="text-indigo-500" />,
      CAMPAIGN_UPDATE: <Bell size={16} className="text-cta" />,
    };
    return icons[type] || <Bell size={16} className="text-sti" />;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Az önce";
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  const handleMarkRead = (e, id) => {
    e.stopPropagation();
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-14 right-0 w-80 sm:w-96 bg-mbg border border-cbg rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in"
    >
      {/* Header */}
      <div className="bg-pb px-4 py-3 flex items-center justify-between">
        <h3 className="text-td font-black text-sm uppercase tracking-wider flex items-center gap-2">
          <Bell size={16} />
          Bildirimler
          {unreadCount > 0 && (
            <span className="bg-cta text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="text-td/70 hover:text-cta text-[10px] font-bold uppercase flex items-center gap-1 transition-colors"
          >
            <CheckCheck size={14} /> Tümünü Oku
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={40} className="mx-auto text-cbg mb-3" />
            <p className="text-sti text-sm font-medium">Henüz bildirim yok</p>
            <p className="text-sti/60 text-xs mt-1">Yeni gelişmeler burada görünecek</p>
          </div>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <div
              key={notification.id}
              className={`
                flex items-start gap-3 p-4 border-b border-cbg/50 hover:bg-cbg/30 transition-colors cursor-pointer
                ${!notification.read ? 'bg-cta/5' : ''}
              `}
              onClick={() => !notification.read && dispatch(markNotificationRead(notification.id))}
            >
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                ${!notification.read ? 'bg-cta/10' : 'bg-cbg/50'}
              `}>
                {getIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${!notification.read ? 'text-mtf font-semibold' : 'text-sti'}`}>
                  {notification.title}
                </p>
                <p className="text-xs text-sti/70 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-[10px] text-sti/50 mt-1 font-medium">
                  {formatTime(notification.createdAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-1">
                {notification.relatedLink && (
                  <Link 
                    to={notification.relatedLink}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-sti hover:text-cta hover:bg-cta/10 rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                  </Link>
                )}
                {!notification.read && (
                  <button 
                    onClick={(e) => handleMarkRead(e, notification.id)}
                    className="p-1.5 text-sti hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="bg-cbg/30 px-4 py-3 text-center border-t border-cbg">
          <Link 
            to="/bildirimler" 
            onClick={onClose}
            className="text-xs font-bold text-cta hover:underline uppercase tracking-wide"
          >
            Tüm Bildirimleri Gör
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
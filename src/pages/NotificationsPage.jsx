import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  MessageSquare,
  Heart,
  Award,
  Users,
  AlertCircle,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react';
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '../redux/thunks/notificationThunks';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, COMMENT, LIKE, BADGE, etc.
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications()).finally(() => setLoading(false));
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/giris" replace />;
  }

  const getIcon = (type) => {
    const icons = {
      COMMENT: <MessageSquare size={20} className="text-blue-500" />,
      LIKE: <Heart size={20} className="text-red-500" />,
      BADGE: <Award size={20} className="text-yellow-500" />,
      GUILD: <Users size={20} className="text-purple-500" />,
      SYSTEM: <AlertCircle size={20} className="text-cta" />,
      CONTENT_APPROVED: <Check size={20} className="text-green-500" />,
      CONTENT_REJECTED: <AlertCircle size={20} className="text-red-500" />,
      CAMPAIGN_INVITE: <Users size={20} className="text-indigo-500" />,
      CAMPAIGN_UPDATE: <Bell size={20} className="text-cta" />,
    };
    return icons[type] || <Bell size={20} className="text-sti" />;
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
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const handleMarkRead = (id) => {
    dispatch(markNotificationRead(id));
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    // Read/Unread filter
    if (filter === 'unread' && notif.read) return false;
    if (filter === 'read' && !notif.read) return false;
    
    // Type filter
    if (typeFilter !== 'all' && notif.type !== typeFilter) return false;
    
    return true;
  });

  const notificationTypes = [
    { value: 'all', label: 'Tümü', icon: <Bell size={16} /> },
    { value: 'COMMENT', label: 'Yorumlar', icon: <MessageSquare size={16} /> },
    { value: 'LIKE', label: 'Beğeniler', icon: <Heart size={16} /> },
    { value: 'BADGE', label: 'Rozetler', icon: <Award size={16} /> },
    { value: 'GUILD', label: 'Lonca', icon: <Users size={16} /> },
    { value: 'SYSTEM', label: 'Sistem', icon: <AlertCircle size={16} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-cta" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mbg font-display">
      <Helmet>
        <title>Bildirimler | Zar & Kule</title>
      </Helmet>

      {/* Header */}
      <div className="bg-pb py-8 border-b border-cbg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cta/10 rounded-xl">
                <Bell size={28} className="text-cta" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Bildirimler</h1>
                <p className="text-white/60 text-sm">
                  {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : 'Tüm bildirimler okundu'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 px-4 py-2 bg-cta text-white rounded-xl font-bold text-sm hover:bg-cta-hover transition-colors"
              >
                <CheckCheck size={18} />
                Tümünü Okundu İşaretle
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white border border-cbg rounded-2xl p-4 space-y-4 sticky top-24">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-black text-mtf text-sm uppercase tracking-wider">Filtrele</h3>
                <Filter size={16} className="text-cta" />
              </div>

              {/* Read/Unread Filter */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-sti uppercase">Durum</p>
                <div className="space-y-1">
                  {['all', 'unread', 'read'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors
                        ${filter === f 
                          ? 'bg-cta/10 text-cta border border-cta/20' 
                          : 'text-sti hover:bg-cbg/50'}
                      `}
                    >
                      {f === 'all' ? 'Tümü' : f === 'unread' ? 'Okunmamış' : 'Okunmuş'}
                      {f === 'unread' && unreadCount > 0 && (
                        <span className="ml-2 text-xs bg-cta text-white px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-sti uppercase">Tür</p>
                <div className="space-y-1">
                  {notificationTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setTypeFilter(type.value)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2
                        ${typeFilter === type.value 
                          ? 'bg-cta/10 text-cta border border-cta/20' 
                          : 'text-sti hover:bg-cbg/50'}
                      `}
                    >
                      {type.icon}
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Notifications List */}
          <main className="flex-1 min-w-0">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white border border-cbg rounded-2xl p-12 text-center">
                <Bell size={48} className="mx-auto text-cbg mb-4" />
                <h3 className="text-xl font-black text-mtf mb-2">Bildirim Bulunamadı</h3>
                <p className="text-sti text-sm">
                  {filter === 'unread' 
                    ? 'Tüm bildirimlerin okunmuş görünüyor!' 
                    : 'Seçili filtrelere uygun bildirim yok.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      bg-white border border-cbg rounded-2xl p-5 transition-all hover:shadow-md
                      ${!notification.read ? 'border-l-4 border-l-cta bg-cta/5' : ''}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`
                        flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                        ${!notification.read ? 'bg-cta/10' : 'bg-cbg/50'}
                      `}>
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h4 className={`
                            font-bold text-base leading-tight
                            ${!notification.read ? 'text-mtf' : 'text-sti'}
                          `}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-sti/60 font-medium whitespace-nowrap">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-sti leading-relaxed mb-3">
                          {notification.message}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {notification.relatedLink && (
                            <Link 
                              to={notification.relatedLink}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cta hover:bg-cta/10 rounded-lg transition-colors"
                            >
                              <ExternalLink size={14} />
                              Görüntüle
                            </Link>
                          )}
                          
                          {!notification.read && (
                            <button 
                              onClick={() => handleMarkRead(notification.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Check size={14} />
                              Okundu İşaretle
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
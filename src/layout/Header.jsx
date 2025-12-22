import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Dices,
  ScrollText,
  Swords,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Bell,
  Search,
  Compass,
  ShoppingBag,
  Users,
  ChevronDown,
  Gavel,
  MapPinned,
  Settings,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import { logout, updateUserSummary } from "../redux/actions/authActions";
import { fetchUnreadCount } from "../redux/thunks/notificationThunks";
import useAxios, { METHODS } from "../hooks/useAxios";
import { clearAuthData } from "../api/axiosClient";
import NotificationDropdown from "../components/common/NotificationDropdown";
import SearchModal from "../components/common/SearchModal";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sendRequest } = useAxios();
  const dropdownRef = useRef(null);

  // Dropdown dışına tıklanınca kapatma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Kullanıcı bilgilerini ve bildirim sayısını güncelle
  useEffect(() => {
    if (isAuthenticated && user?.username && !isLoading) {
      sendRequest({
        url: `/users/summary/${user.username}`,
        method: METHODS.GET,
        callbackSuccess: (res) => {
          dispatch(updateUserSummary(res.data));
        },
        showErrorToast: false,
      });
      dispatch(fetchUnreadCount());
    }
  }, [isAuthenticated, user?.username, isLoading]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    clearAuthData();
    dispatch(logout());
    navigate("/giris");
    toast.info("Yolun açık olsun maceracı!");
    setIsUserMenuOpen(false);
  };

  // Profil sayfasına git
  const goToProfile = () => {
    if (user?.username) {
      navigate(`/profil/${user.username}`);
      setIsUserMenuOpen(false);
    }
  };

  const navItems = [
    {
      title: "Nasıl Oynanır",
      icon: <Compass size={18} />,
      href: "/nasil-oynanir",
    },
    { title: "Wiki", icon: <ScrollText size={18} />, href: "/wiki" },
    { title: "Parti Bul", icon: <Swords size={18} />, href: "/parti-bul" },
    {
      title: "Taverna",
      icon: <Users size={18} />,
      href: "/taverna",
      submenu: [
        { title: "🏆 Sıralama", href: "/taverna/siralama" },
        { title: "⚔️ Loncalar", href: "/taverna/loncalar" },
        { title: "🎖️ Rozetler", href: "/taverna/rozetler" },
      ],
    },
    {
      title: "Araçlar",
      icon: <Gavel size={18} />,
      href: "/araclar",
      submenu: [
        { title: "Zar Kulesi", href: "/araclar/zar" },
        { title: "İnisiyatif Takibi", href: "/araclar/inisiyatif" },
        { title: "İsim Üretici", href: "/araclar/isim-uretici" },
      ],
    },
    {
      title: "Dost Mekanlar",
      icon: <MapPinned size={18} />,
      href: "/mekanlar",
    },
    { title: "Bit Pazarı", icon: <ShoppingBag size={18} />, href: "/pazar" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-mbg/95 backdrop-blur-md border-b border-cbg shadow-sm font-display">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group select-none flex-shrink-0"
        >
          <div className="relative">
            <Dices
              className="text-pb group-hover:text-cta transition-colors duration-300 transform group-hover:-rotate-12"
              size={28}
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-mtf">
            Zar<span className="text-cta mx-0.5">&</span>Kule
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden xl:flex items-center gap-6">
          {navItems.map((item, index) => (
            <div key={index} className="relative group h-20 flex items-center">
              <NavLink
                to={item.href}
                className={({ isActive }) => `
                  flex items-center gap-1.5 font-bold text-sm transition-colors py-2
                  ${isActive ? 'text-cta' : 'text-mtf hover:text-cta'}
                `}
              >
                {item.icon}
                {item.title}
                {item.submenu && <ChevronDown size={14} className="ml-0.5" />}
              </NavLink>
              
              {/* Submenu */}
              {item.submenu && (
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white border border-cbg rounded-xl shadow-xl py-2 min-w-[180px]">
                    {item.submenu.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sub.href}
                        className="block px-4 py-2.5 text-sm font-bold text-mtf hover:bg-mbg hover:text-cta transition-colors"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-xl text-sti hover:text-mtf hover:bg-cbg/50 transition-colors"
            title="Ara (Ctrl+K)"
          >
            <Search size={20} />
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2.5 rounded-xl text-sti hover:text-mtf hover:bg-cbg/50 transition-colors relative"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-cta text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {isNotificationOpen && (
                  <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-cbg/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-cta/10 overflow-hidden flex items-center justify-center">
                    {isLoading ? (
                      <Loader2 size={18} className="text-cta animate-spin" />
                    ) : user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={18} className="text-cta" />
                    )}
                  </div>
                  <span className="hidden sm:block font-bold text-sm text-mtf max-w-[100px] truncate">
                    {user?.displayName || user?.username || 'Kullanıcı'}
                  </span>
                  <ChevronDown size={14} className="text-sti" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-cbg rounded-xl shadow-xl py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-cbg">
                      <p className="font-black text-mtf truncate">
                        {user?.displayName || user?.username}
                      </p>
                      <p className="text-xs text-sti">@{user?.username}</p>
                      {user?.rankTitle && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-cta/10 text-cta text-[10px] font-black rounded uppercase">
                          {user.rankTitle}
                        </span>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={goToProfile}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-mtf hover:bg-mbg hover:text-cta transition-colors text-left"
                      >
                        <UserIcon size={16} />
                        Profilim
                      </button>
                      <Link
                        to="/ayarlar"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-mtf hover:bg-mbg hover:text-cta transition-colors"
                      >
                        <Settings size={16} />
                        Ayarlar
                      </Link>
                      
                      {/* Admin Link (if user is admin) */}
                      {user?.roles?.includes('ROLE_ADMIN') && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-purple-600 hover:bg-purple-50 transition-colors"
                        >
                          <Shield size={16} />
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-cbg pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={16} />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/giris"
                className="px-4 py-2 text-sm font-bold text-mtf hover:text-cta transition-colors"
              >
                Giriş
              </Link>
              <Link
                to="/kayit"
                className="px-4 py-2 bg-cta text-white text-sm font-bold rounded-xl hover:bg-cta-hover transition-colors"
              >
                Kayıt Ol
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-xl text-mtf hover:bg-cbg/50 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full bg-white border-b border-cbg shadow-xl">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navItems.map((item, index) => (
              <div key={index}>
                <Link
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-mtf font-bold hover:bg-mbg hover:text-cta transition-colors"
                >
                  {item.icon}
                  {item.title}
                </Link>
                {item.submenu && (
                  <div className="ml-8 space-y-1">
                    {item.submenu.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-sti hover:text-cta transition-colors"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
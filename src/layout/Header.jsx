// src/layout/Header.jsx - TAMAMEN YENİ
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
} from "lucide-react";
import { toast } from "react-toastify";

import { logout, updateUserSummary } from "../redux/actions/authActions";
import { fetchUnreadCount } from "../redux/thunks/notificationThunks";
import useAxios, { METHODS } from "../hooks/useAxios";
import { STORAGE_KEYS } from "../api/axiosClient";
import NotificationDropdown from "../components/common/NotificationDropdown";
import SearchModal from "../components/common/SearchModal";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
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
    if (isAuthenticated && user?.username) {
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
  }, [isAuthenticated, user?.username, dispatch]);

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

  // ✅ DÜZELTME: Sadece TOKEN siliniyor
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    dispatch(logout());
    navigate("/login");
    toast.info("Yolun açık olsun maceracı!");
    setIsUserMenuOpen(false);
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
                  ${isActive ? "text-cta" : "text-sti hover:text-cta"}
                `}
              >
                <span className="text-cta/70 group-hover:text-cta">
                  {item.icon}
                </span>
                {item.title}
                {item.submenu && (
                  <ChevronDown
                    size={14}
                    className="mt-0.5 group-hover:rotate-180 transition-transform"
                  />
                )}
              </NavLink>

              {item.submenu && (
                <div className="absolute top-16 left-0 w-48 bg-mbg border border-cbg rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                  <div className="h-1 w-full bg-cta"></div>
                  <div className="flex flex-col p-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.href}
                        className="block px-4 py-2.5 text-sm font-semibold text-sti hover:bg-cbg/50 hover:text-cta rounded-lg transition-colors"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sti hover:text-mtf hover:bg-cbg/50 rounded-xl transition-colors group"
            title="Ara (⌘K)"
          >
            <Search size={18} />
            <span className="text-xs font-medium text-sti/50 group-hover:text-sti hidden lg:block">
              ⌘K
            </span>
          </button>

          <div className="h-6 w-px bg-cbg"></div>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 text-sti hover:text-mtf hover:bg-cbg/50 rounded-xl transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-cta text-white text-[10px] font-black rounded-full px-1 animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                />
              </div>

              {/* User Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-cbg/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cta/20 to-purple-500/20 border-2 border-cbg overflow-hidden">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-cta font-black text-sm">
                        {user.displayName?.charAt(0) ||
                          user.username?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-bold text-mtf leading-tight">
                      {user.displayName || user.username}
                    </p>
                    <p className="text-[10px] text-sti font-medium">
                      {user.title || "Maceracı"}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-sti transition-transform ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-14 right-0 w-64 bg-mbg border border-cbg rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                    <div className="h-1 w-full bg-gradient-to-r from-cta to-purple-500"></div>

                    {/* User Info Header */}
                    <div className="p-4 bg-cbg/30 border-b border-cbg">
                      <p className="text-sm font-black text-mtf">
                        {user.displayName || user.username}
                      </p>
                      <p className="text-xs text-sti">@{user.username}</p>
                      {user.currentXp !== undefined && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-cbg rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cta rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  user.currentXp % 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-cta">
                            {user.currentXp} XP
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-2">
                      {/* ✅ DÜZELTME: /profile yerine /profil */}
                      <Link
                        to={`/profil/${user.username}`}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-sti hover:bg-cbg/50 hover:text-mtf rounded-lg transition-colors"
                      >
                        <UserIcon size={16} /> Profilim
                      </Link>
                      <Link
                        to="/collections/me"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-sti hover:bg-cbg/50 hover:text-mtf rounded-lg transition-colors"
                      >
                        <ScrollText size={16} /> Koleksiyonlarım
                      </Link>
                      <Link
                        to="/ayarlar"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-sti hover:bg-cbg/50 hover:text-mtf rounded-lg transition-colors"
                      >
                        <Settings size={16} /> Ayarlar
                      </Link>

                      {/* Admin Link */}
                      {user.roles?.includes("ROLE_ADMIN") && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Shield size={16} /> Admin Panel
                        </Link>
                      )}

                      <div className="h-px bg-cbg mx-2 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut size={16} /> Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/register"
                className="text-sti hover:text-mtf font-bold text-sm px-2"
              >
                Kayıt Ol
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pb text-td hover:bg-cta hover:text-white transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <UserIcon size={18} /> Giriş Yap
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="xl:hidden p-2 text-sti hover:text-mtf hover:bg-cbg rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-20 left-0 w-full bg-mbg border-b border-cbg p-6 flex flex-col gap-2 shadow-xl animate-fade-in z-40 max-h-[80vh] overflow-y-auto">
          {/* Mobile Search */}
          <button
            onClick={() => {
              setIsSearchOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 p-3 text-sti font-bold text-lg hover:bg-cbg/50 rounded-lg mb-2"
          >
            <Search size={20} className="text-cta" />
            Ara...
          </button>

          {navItems.map((item, index) => (
            <div key={index}>
              <Link
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 text-mtf font-bold text-lg hover:bg-cbg/50 rounded-lg"
              >
                <span className="text-cta">{item.icon}</span>
                {item.title}
              </Link>

              {item.submenu && (
                <div className="pl-12 flex flex-col gap-1 mt-1 border-l-2 border-cbg ml-6">
                  {item.submenu.map((sub, i) => (
                    <Link
                      key={i}
                      to={sub.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2 px-2 text-sti font-medium text-sm hover:text-cta block"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="h-px bg-cbg my-4"></div>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-pb text-td font-bold text-center flex items-center justify-center gap-2"
              >
                <UserIcon size={18} /> Giriş Yap
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl border border-cbg text-sti font-bold text-center hover:text-cta"
              >
                Kayıt Ol
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-bold text-center flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Çıkış Yap
            </button>
          )}
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};

export default Header;
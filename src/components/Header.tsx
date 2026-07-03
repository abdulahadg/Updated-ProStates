import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { currencies, languages } from '../data';
import {
  Menu, X, Bell, Globe, Heart, Search, User, LogOut,
  Shield, Landmark, Plus, HelpCircle, Compass, ChevronDown, Check, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const {
    currentPage,
    setCurrentPage,
    selectedCurrency,
    setCurrencyByCode,
    selectedLanguage,
    setLanguageByCode,
    user,
    setUser,
    switchRole,
    notifications,
    markNotificationsAsRead,
    wishlist
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Expanded sidebar accordions
  const [sidebarCurrencyOpen, setSidebarCurrencyOpen] = useState(false);
  const [sidebarLanguageOpen, setSidebarLanguageOpen] = useState(false);
  const [sidebarNotificationsOpen, setSidebarNotificationsOpen] = useState(false);

  // Search overlay toggle
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [destQuery, setDestQuery] = useState('');

  const { searchCriteria, setSearchCriteria } = useApp();

  useEffect(() => {
    setDestQuery(searchCriteria.destination || '');
  }, [searchCriteria.destination]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCriteria({
      ...searchCriteria,
      destination: destQuery
    });
    setSearchOverlayOpen(false);
    setCurrentPage('search');
  };

  const selectCurrency = (code: string) => {
    setCurrencyByCode(code);
    setCurrencyOpen(false);
  };

  const selectLanguage = (code: string) => {
    setLanguageByCode(code);
    setLanguageOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setUserMenuOpen(false);
  };

  const handleLoginRedirect = () => {
    setCurrentPage('auth');
    setUserMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || currentPage !== 'home'
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
            : 'bg-gradient-to-b from-black/50 via-black/20 to-transparent text-white py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <div
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <span className={`text-xl font-bold tracking-tight ${
                scrolled || currentPage !== 'home' ? 'text-gray-900' : 'text-white'
              }`}>
                Pro<span className="text-blue-600">States</span>
              </span>
            </div>

            {/* SIDEBAR MENU BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-2 rounded-xl transition-all hover:bg-gray-100/10 cursor-pointer border ${
                scrolled || currentPage !== 'home'
                  ? 'text-gray-800 border-gray-200 hover:bg-gray-50'
                  : 'text-white border-white/20 hover:bg-white/10'
              }`}
              title="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* COMPREHENSIVE SIDEBAR DRAWER NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-[90%] sm:w-[85%] max-w-sm sm:max-w-md bg-white shadow-2xl z-50 flex flex-col text-gray-900"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div
                  onClick={() => {
                    setCurrentPage('home');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
                    <Compass className="w-4.5 h-4.5 animate-spin-slow" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    Pro<span className="text-blue-600">States</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* 1. COMPREHENSIVE SIDEBAR SEARCH BAR */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Search Properties</p>
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full h-11 bg-gray-100 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all shadow-xs">
                    <div className="absolute left-3.5 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Where would you like to go?"
                      value={destQuery}
                      onChange={(e) => setDestQuery(e.target.value)}
                      className="w-full pl-10 pr-20 bg-transparent border-none text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none focus:ring-0 h-full"
                    />
                    {destQuery && (
                      <button
                        type="button"
                        onClick={() => setDestQuery('')}
                        className="absolute right-11 p-1 rounded-full text-gray-400 hover:bg-gray-200/60"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-1 w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* 2. GENERAL NAVIGATION */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Navigate</p>
                  <button
                    onClick={() => {
                      setCurrentPage('home');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                      currentPage === 'home'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Compass className="w-5 h-5 text-gray-400" /> Home
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('search');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                      currentPage === 'search'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Search className="w-5 h-5 text-gray-400" /> Explore Properties
                  </button>
                </div>

                {/* 3. WORKSPACE DASHBOARDS */}
                {user && (
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">My Workspace</p>
                    <button
                      onClick={() => {
                        setCurrentPage('user-dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                        currentPage === 'user-dashboard'
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-5 h-5 text-gray-400" /> Guest Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('host-dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                        currentPage === 'host-dashboard'
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Plus className="w-5 h-5 text-gray-400" /> Host Dashboard
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setCurrentPage('admin-panel');
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                          currentPage === 'admin-panel'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Shield className="w-5 h-5 text-amber-500" /> Admin Controller
                      </button>
                    )}

                    {/* Wishlist item inside workspace list */}
                    <button
                      onClick={() => {
                        setCurrentPage('user-dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-between w-full p-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        Wishlist Stays
                      </span>
                      {wishlist.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {wishlist.length}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* 4. NOTIFICATIONS */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">Alerts</p>
                  <button
                    onClick={() => {
                      setSidebarNotificationsOpen(!sidebarNotificationsOpen);
                      if (!sidebarNotificationsOpen) markNotificationsAsRead();
                    }}
                    className="flex items-center justify-between w-full p-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <div className="relative">
                        <Bell className="w-5 h-5 text-gray-400" />
                        {unreadNotifs > 0 && (
                          <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                        )}
                      </div>
                      Notifications
                    </span>
                    <div className="flex items-center gap-1.5">
                      {unreadNotifs > 0 && (
                        <span className="text-[10px] text-white bg-red-500 px-1.5 py-0.5 rounded-full font-bold">
                          {unreadNotifs} new
                        </span>
                      )}
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sidebarNotificationsOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {sidebarNotificationsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50/50 rounded-xl border border-gray-100/50"
                      >
                        <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="text-center text-xs text-gray-400 py-4">No notifications yet.</p>
                          ) : (
                            notifications.map(notif => (
                              <div key={notif.id} className="p-2.5 bg-white border border-gray-100 rounded-lg shadow-xs flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                <div>
                                  <h4 className="text-xs font-bold text-gray-900">{notif.title}</h4>
                                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                                  <span className="text-[9px] text-gray-400 mt-1 block">{notif.date}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. CURRENCY & LANGUAGE LOCALES */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">Preferences</p>
                  
                  {/* Currency Selector */}
                  <div>
                    <button
                      onClick={() => {
                        setSidebarCurrencyOpen(!sidebarCurrencyOpen);
                        setSidebarLanguageOpen(false);
                      }}
                      className="flex items-center justify-between w-full p-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <Landmark className="w-5 h-5 text-gray-400" />
                        Currency: <span className="text-blue-600 font-bold">{selectedCurrency.code}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sidebarCurrencyOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {sidebarCurrencyOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-gray-50/50 rounded-xl border border-gray-100/50 mt-1"
                        >
                          <div className="p-2 grid grid-cols-2 gap-1">
                            {currencies.map(curr => (
                              <button
                                key={curr.code}
                                onClick={() => selectCurrency(curr.code)}
                                className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                                  selectedCurrency.code === curr.code
                                    ? 'bg-blue-100 text-blue-700 font-bold'
                                    : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <span>{curr.label}</span>
                                {selectedCurrency.code === curr.code && <Check className="w-3.5 h-3.5 text-blue-700" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Language Selector */}
                  <div>
                    <button
                      onClick={() => {
                        setSidebarLanguageOpen(!sidebarLanguageOpen);
                        setSidebarCurrencyOpen(false);
                      }}
                      className="flex items-center justify-between w-full p-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        Language: <span className="text-blue-600 font-bold">{selectedLanguage.name}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sidebarLanguageOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {sidebarLanguageOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-gray-50/50 rounded-xl border border-gray-100/50 mt-1"
                        >
                          <div className="p-2 space-y-1">
                            {languages.map(lang => (
                              <button
                                key={lang.code}
                                onClick={() => selectLanguage(lang.code)}
                                className={`flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                                  selectedLanguage.code === lang.code
                                    ? 'bg-blue-100 text-blue-700 font-bold'
                                    : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <span className="text-sm">{lang.flag}</span>
                                <span>{lang.name}</span>
                                {selectedLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-blue-700 ml-auto" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Drawer Footer & User Card */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 max-w-[80%]">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-xs"
                        />
                        <div className="truncate">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
                        title="Sign Out"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        switchRole(user.role === 'host' ? 'guest' : 'host');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-100 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Switch to {user.role === 'host' ? 'Guest' : 'Host'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentPage('auth');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-center font-bold shadow-md shadow-blue-600/15 hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Sign In or Register
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SEARCH FULL SCREEN OVERLAY */}
      <AnimatePresence>
        {searchOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSearchOverlayOpen(false)}
                className="absolute right-4 top-4 p-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="text-blue-600 w-5 h-5" /> Search Global Stays
              </h2>
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Where would you like to go?</label>
                  <input
                    type="text"
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    placeholder="e.g. Cotswolds, Kyoto, Amalfi Coast, Positano"
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Check-In</label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-200 rounded-xl outline-none text-sm focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Check-Out</label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-200 rounded-xl outline-none text-sm focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/15 transition-colors cursor-pointer"
                >
                  Search Properties
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Add simple spin slow utility in css or direct inline style
const refreshKeyframe = `
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .animate-spin-slow {
      animation: spin-slow 15s linear infinite;
    }
    ${refreshKeyframe}
  `;
  document.head.appendChild(style);
}

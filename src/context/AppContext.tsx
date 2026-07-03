import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Host, Booking, UserProfile, Notification, ChatThread, ChatMessage, PurchaseOrder } from '../types';
import { MOCK_PROPERTIES, INITIAL_USER, MOCK_NOTIFICATIONS, MOCK_BOOKINGS, MOCK_CHAT_THREADS, MOCK_ORDERS, currencies, languages } from '../data';

interface SearchCriteria {
  destination: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
}

interface FilterCriteria {
  category: string;
  propertyType: string;
  priceRange: [number, number];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  instantBookOnly: boolean;
  superHostOnly: boolean;
}

interface AppContextType {
  // Navigation & Page State
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  prevPage: string | null;
  setPrevPage: (page: string | null) => void;

  // Search & Filters State
  searchCriteria: SearchCriteria;
  setSearchCriteria: (criteria: SearchCriteria) => void;
  filters: FilterCriteria;
  setFilters: (filters: FilterCriteria) => void;
  resetFilters: () => void;

  // Currency & Language
  selectedCurrency: typeof currencies[0];
  setCurrencyByCode: (code: string) => void;
  selectedLanguage: typeof languages[0];
  setLanguageByCode: (code: string) => void;
  formatPrice: (priceGBP: number) => string;

  // User & Roles
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  switchRole: (role: 'guest' | 'host' | 'admin') => void;

  // Properties list
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'rating' | 'reviewsCount' | 'isVerified' | 'host'>) => void;
  updateProperty: (id: string, updated: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  toggleVerifyProperty: (id: string) => void;

  // Bookings list
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'bookingDate'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  deleteBooking: (id: string) => void;
  cancelBooking: (id: string) => void;

  // Orders list
  orders: PurchaseOrder[];
  addOrder: (order: Omit<PurchaseOrder, 'id' | 'orderDate'>) => void;
  updateOrder: (id: string, updated: Partial<PurchaseOrder>) => void;
  deleteOrder: (id: string) => void;

  // Wishlist list
  wishlist: string[];
  toggleWishlist: (id: string) => void;

  // Messages & Chats
  chats: ChatThread[];
  sendMessage: (threadId: string, text: string) => void;
  addChatThread: (propertyId: string) => string;

  // Notifications
  notifications: Notification[];
  markNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: Notification['type']) => void;
}

const defaultFilters: FilterCriteria = {
  category: 'all',
  propertyType: 'all',
  priceRange: [0, 1000],
  bedrooms: 0,
  bathrooms: 0,
  amenities: [],
  instantBookOnly: false,
  superHostOnly: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageState] = useState<string>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  const setCurrentPage = (page: string) => {
    setPrevPage(currentPage);
    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guestsCount: 1,
  });

  const [filters, setFilters] = useState<FilterCriteria>(defaultFilters);

  const resetFilters = () => setFilters(defaultFilters);

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const setCurrencyByCode = (code: string) => {
    const found = currencies.find(c => c.code === code);
    if (found) setSelectedCurrency(found);
  };

  const setLanguageByCode = (code: string) => {
    const found = languages.find(l => l.code === code);
    if (found) setSelectedLanguage(found);
  };

  const formatPrice = (priceGBP: number) => {
    const converted = priceGBP * selectedCurrency.rate;
    return `${selectedCurrency.symbol}${Math.round(converted).toLocaleString()}`;
  };

  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);

  const switchRole = (role: 'guest' | 'host' | 'admin') => {
    if (user) {
      setUser({ ...user, role });
      setCurrentPage(role === 'host' ? 'host-dashboard' : role === 'admin' ? 'admin-panel' : 'user-dashboard');
    }
  };

  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [orders, setOrders] = useState<PurchaseOrder[]>(MOCK_ORDERS);
  const [wishlist, setWishlist] = useState<string[]>(['prop-1', 'prop-2']);
  const [chats, setChats] = useState<ChatThread[]>(MOCK_CHAT_THREADS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const addProperty = (newProp: Omit<Property, 'id' | 'rating' | 'reviewsCount' | 'isVerified' | 'host'>) => {
    const hostObj: Host = {
      id: user?.id || 'host-anon',
      name: user?.name || 'Anonymous Host',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      rating: 4.90,
      reviewsCount: 1,
      isSuperHost: false,
      joinedDate: 'July 2026',
      responseRate: 100,
      responseTime: 'Within an hour',
    };

    const created: Property = {
      ...newProp,
      id: `prop-${properties.length + 1}`,
      rating: 5.0,
      reviewsCount: 0,
      isVerified: false,
      host: hostObj,
    };

    setProperties(prev => [created, ...prev]);
    addNotification('Listing Added', `Your property "${created.title}" is successfully listed! ProStates regional curators will verify it shortly.`, 'system');
  };

  const toggleVerifyProperty = (id: string) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, isVerified: !p.isVerified } : p))
    );
    const prop = properties.find(p => p.id === id);
    if (prop) {
      addNotification(
        'Property Verification Updated',
        `The verification status for "${prop.title}" was updated by Admin.`,
        'system'
      );
    }
  };

  const addBooking = (newBooking: Omit<Booking, 'id' | 'status' | 'bookingDate'>) => {
    const created: Booking = {
      ...newBooking,
      id: `bk-${bookings.length + 1}`,
      status: 'upcoming',
      bookingDate: new Date().toISOString().split('T')[0],
    };

    setBookings(prev => [created, ...prev]);
    addNotification(
      'New Booking Created!',
      `You have successfully booked "${created.propertyTitle}" for ${created.checkIn} to ${created.checkOut}.`,
      'booking'
    );
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(bk => (bk.id === id ? { ...bk, status: 'cancelled' as const } : bk))
    );
    const bk = bookings.find(b => b.id === id);
    if (bk) {
      addNotification(
        'Booking Cancelled',
        `Your booking for "${bk.propertyTitle}" has been cancelled. If any refund is due, it will clear into your wallet.`,
        'booking'
      );
    }
  };

  const updateProperty = (id: string, updated: Partial<Property>) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
    addNotification('Property Updated', `Property details updated by Admin.`, 'system');
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    addNotification('Property Deleted', `A property listing was removed by Admin.`, 'system');
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev =>
      prev.map(bk => (bk.id === id ? { ...bk, status } : bk))
    );
    addNotification('Booking Status Updated', `Booking status changed to ${status} by Admin.`, 'system');
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    addNotification('Booking Deleted', `A booking record was deleted by Admin.`, 'system');
  };

  const addOrder = (newOrder: Omit<PurchaseOrder, 'id' | 'orderDate'>) => {
    const created: PurchaseOrder = {
      ...newOrder,
      id: `ord-${orders.length + 1}`,
      orderDate: new Date().toISOString().split('T')[0],
    };
    setOrders(prev => [created, ...prev]);
    addNotification('Order Placed', `A new property transaction order "${created.id}" was recorded.`, 'system');
  };

  const updateOrder = (id: string, updated: Partial<PurchaseOrder>) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === id ? { ...ord, ...updated } : ord))
    );
    addNotification('Order Updated', `Order "${id}" details updated by Admin.`, 'system');
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(ord => ord.id !== id));
    addNotification('Order Deleted', `Order "${id}" was deleted from the ledger by Admin.`, 'system');
  };

  const sendMessage = (threadId: string, text: string) => {
    setChats(prev =>
      prev.map(th => {
        if (th.id === threadId) {
          const newMsg: ChatMessage = {
            id: `msg-${th.messages.length + 1}`,
            senderId: user?.id || 'usr-1',
            senderName: user?.name || 'Alexander Sterling',
            senderAvatar: user?.avatar || '',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...th,
            lastMessage: text,
            lastMessageTime: 'Just Now',
            messages: [...th.messages, newMsg],
          };
        }
        return th;
      })
    );
  };

  const addChatThread = (propertyId: string) => {
    const existing = chats.find(ch => ch.propertyId === propertyId);
    if (existing) return existing.id;

    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return '';

    const newId = `chat-${chats.length + 1}`;
    const newThread: ChatThread = {
      id: newId,
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyImage: prop.images[0],
      recipientName: prop.host.name,
      recipientAvatar: prop.host.avatar,
      recipientRole: prop.host.isSuperHost ? 'host' : 'host',
      lastMessage: 'Started a conversation',
      lastMessageTime: 'Just Now',
      unreadCount: 0,
      messages: [],
    };

    setChats(prev => [newThread, ...prev]);
    return newId;
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `notif-${notifications.length + 1}`,
      title,
      message,
      date: 'Just Now',
      isRead: false,
      type,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedPropertyId,
        setSelectedPropertyId,
        prevPage,
        setPrevPage,
        searchCriteria,
        setSearchCriteria,
        filters,
        setFilters,
        resetFilters,
        selectedCurrency,
        setCurrencyByCode,
        selectedLanguage,
        setLanguageByCode,
        formatPrice,
        user,
        setUser,
        switchRole,
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        toggleVerifyProperty,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        cancelBooking,
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        wishlist,
        toggleWishlist,
        chats,
        sendMessage,
        addChatThread,
        notifications,
        markNotificationsAsRead,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

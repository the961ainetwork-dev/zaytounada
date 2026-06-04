import React, { useState, useEffect } from 'react';
import { 
  Lock, LayoutDashboard, Calendar, CalendarCheck2, Star, Plus, Edit, Trash2, 
  Users, CheckCircle, Clock, XCircle, ChevronRight, Mail, Eye, Save, AlertCircle, 
  RefreshCw, FileText, Check, ArrowLeft, Search, Building2, Bell, MapPin, ArrowUp, ArrowDown,
  Compass
} from 'lucide-react';
import { Restaurant, Booking, Article } from '../types';

interface AdminDashboardViewProps {
  onRestaurantsUpdated?: () => void;
}

export default function AdminDashboardView({ onRestaurantsUpdated }: AdminDashboardViewProps) {
  // Authentication & Passcode gate
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active sub-section of admin controls
  const [adminTab, setAdminTab] = useState<'reservations' | 'restaurants' | 'subscribers' | 'emails' | 'stories' | 'pages-sections'>('reservations');

  // Server state data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [subscribers, setSubscribers] = useState<{ id: string; email: string; date: string }[]>([]);
  const [emailLogs, setEmailLogs] = useState<{ id: string; to: string; subject: string; html: string; date: string }[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagesConfig, setPagesConfig] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search/Filters in admin lists
  const [bookingFilter, setBookingFilter] = useState('');
  const [restaurantFilter, setRestaurantFilter] = useState('');
  const [subscriberFilter, setSubscriberFilter] = useState('');
  const [storyFilter, setStoryFilter] = useState('');

  // Modal / Form state for edit/addition of Restaurant
  const [isRestaurantFormOpen, setIsRestaurantFormOpen] = useState(false);
  const [editingRestaurantId, setEditingRestaurantId] = useState<string | null>(null);
  const [restaurantFormData, setRestaurantFormData] = useState({
    name: '',
    cuisine: '',
    city: 'Beirut',
    chef: '',
    stars: 0,
    distinction: 'SELECTED',
    priceRange: '$$$',
    address: '',
    phone: '',
    website: '',
    description: '',
    inspectorNote: '',
    imageUrl: '',
    category: 'fine_dining',
    neighborhood: 'hamra',
    signatureDishes: '',
    features: ''
  });

  // Modal / Form state for Bookings Editor
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    userName: '',
    userEmail: '',
    guestsCount: 2,
    date: '',
    time: '19:30',
    specialRequests: '',
    status: 'confirmed' as 'pending' | 'confirmed'
  });

  // Modal / Form state for Stories (Magazine articles)
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleFormData, setArticleFormData] = useState({
    title: '',
    subtitle: '',
    category: 'History',
    readTime: '6 min read',
    imageUrl: '',
    author: 'Jean-Luc Zaytounada',
    content: ''
  });

  // Form state for General Site Settings
  const [settingsFormData, setSettingsFormData] = useState({
    heroTagline: '',
    heroSubtitle: '',
    neighborhoodsTitle: '',
    neighborhoodsSubtitle: '',
    featuredChoiceId: 'rest-1'
  });

  // Subscriber Form
  const [quickEmail, setQuickEmail] = useState('');

  // Email Preview Modal
  const [selectedMail, setSelectedMail] = useState<{ to: string; subject: string; html: string; date: string } | null>(null);

  // Status message alerts
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'err'; text: string } | null>(null);

  // Check state authorizations on mount
  useEffect(() => {
    const isSavedAuth = sessionStorage.getItem('zaytounada_admin_authorized');
    if (isSavedAuth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  // Fetch admin states
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [resB, resR, resS, resE, resA, resP, resSettings] = await Promise.all([
        fetch('/api/bookings').then(r => r.json()),
        fetch('/api/restaurants').then(r => r.json()),
        fetch('/api/subscribers').then(r => r.json()),
        fetch('/api/email-logs').then(r => r.json()),
        fetch('/api/articles').then(r => r.json()),
        fetch('/api/pages').then(r => r.json()),
        fetch('/api/settings').then(r => r.json())
      ]);

      if (Array.isArray(resB)) setBookings(resB);
      if (Array.isArray(resR)) setRestaurants(resR);
      if (Array.isArray(resS)) setSubscribers(resS);
      if (Array.isArray(resE)) setEmailLogs(resE);
      if (Array.isArray(resA)) setArticles(resA);
      if (Array.isArray(resP)) setPagesConfig(resP.sort((a: any, b: any) => a.order - b.order));
      if (resSettings && !resSettings.error) {
        setSettingsFormData({
          heroTagline: resSettings.heroTagline || '',
          heroSubtitle: resSettings.heroSubtitle || '',
          neighborhoodsTitle: resSettings.neighborhoodsTitle || '',
          neighborhoodsSubtitle: resSettings.neighborhoodsSubtitle || '',
          featuredChoiceId: resSettings.featuredChoiceId || 'rest-1'
        });
      }
    } catch (err) {
      console.error("Failed to query full administrative states:", err);
      triggerAlert('err', 'Failed to retrieve administrative records from Express API Server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchAllData();
    }
  }, [isAuthorized]);

  const triggerAlert = (type: 'success' | 'err', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'admin') {
      setIsAuthorized(true);
      setAuthError('');
      sessionStorage.setItem('zaytounada_admin_authorized', 'true');
    } else {
      setAuthError('Access Denied. Passcode unverified in system crypt router.');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem('zaytounada_admin_authorized');
    setPasscode('');
  };

  // --- BOOKING OPERATIONS ---
  const handleOpenEditBooking = (book: Booking) => {
    setEditingBookingId(book.id);
    setBookingFormData({
      userName: book.userName,
      userEmail: book.userEmail,
      guestsCount: book.guestsCount,
      date: book.date,
      time: book.time,
      specialRequests: book.specialRequests || '',
      status: book.status
    });
    setIsBookingFormOpen(true);
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookingId) return;

    try {
      const res = await fetch(`/api/bookings/${editingBookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingFormData)
      });
      if (res.ok) {
        triggerAlert('success', 'Booking coordinates changed successfully.');
        setIsBookingFormOpen(false);
        fetchAllData();
      } else {
        triggerAlert('err', 'Could not apply adjustments on reservation server.');
      }
    } catch (err) {
      triggerAlert('err', 'Network failure adjusting booking.');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to cancel and erase this reservation?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerAlert('success', 'Reservation slot successfully released.');
        fetchAllData();
      } else {
        triggerAlert('err', 'Booking erasure failed.');
      }
    } catch (err) {
      triggerAlert('err', 'Error deleting reservation.');
    }
  };

  // --- RESTAURANT OPERATIONS ---
  const handleOpenAddRestaurant = () => {
    setEditingRestaurantId(null);
    setRestaurantFormData({
      name: '',
      cuisine: '',
      city: 'Beirut',
      chef: '',
      stars: 0,
      distinction: 'SELECTED',
      priceRange: '$$$',
      address: '',
      phone: '',
      website: '',
      description: '',
      inspectorNote: '',
      imageUrl: '',
      category: 'fine_dining',
      neighborhood: 'hamra',
      signatureDishes: '',
      features: ''
    });
    setIsRestaurantFormOpen(true);
  };

  const handleOpenEditRestaurant = (rest: Restaurant) => {
    setEditingRestaurantId(rest.id);
    setRestaurantFormData({
      name: rest.name,
      cuisine: rest.cuisine,
      city: rest.city,
      chef: rest.chef || '',
      stars: rest.stars || 0,
      distinction: rest.distinction || 'SELECTED',
      priceRange: rest.priceRange || '$$$',
      address: rest.address || '',
      phone: rest.phone || '',
      website: rest.website || '',
      description: rest.description || '',
      inspectorNote: rest.inspectorNote || '',
      imageUrl: rest.imageUrl || '',
      category: rest.category || 'fine_dining',
      neighborhood: rest.neighborhood || 'hamra',
      signatureDishes: Array.isArray(rest.signatureDishes) ? rest.signatureDishes.join(', ') : '',
      features: Array.isArray(rest.features) ? rest.features.join(', ') : ''
    });
    setIsRestaurantFormOpen(true);
  };

  const handleSaveRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse commas
    const processedDishes = restaurantFormData.signatureDishes
      ? restaurantFormData.signatureDishes.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const processedFeatures = restaurantFormData.features
      ? restaurantFormData.features.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...restaurantFormData,
      signatureDishes: processedDishes,
      features: processedFeatures
    };

    const url = editingRestaurantId ? `/api/restaurants/${editingRestaurantId}` : '/api/restaurants';
    const method = editingRestaurantId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerAlert('success', editingRestaurantId ? 'Restaurant index modified.' : 'New gourmet entry registered successfully!');
        setIsRestaurantFormOpen(false);
        fetchAllData();
        if (onRestaurantsUpdated) onRestaurantsUpdated();
      } else {
        const errData = await res.json();
        triggerAlert('err', errData.error || 'Server validation failed.');
      }
    } catch (err) {
      triggerAlert('err', 'Network error committing entry.');
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    if (!confirm('Are you sure you want to remove this establishment? This can break historic itinerary entries.')) return;
    try {
      const res = await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerAlert('success', 'Establishment de-indexed successfully.');
        fetchAllData();
        if (onRestaurantsUpdated) onRestaurantsUpdated();
      } else {
        triggerAlert('err', 'Failed to erase restaurant.');
      }
    } catch (err) {
      triggerAlert('err', 'Error connecting to delete API.');
    }
  };

  // --- SUBSCRIBERS OPERATIONS ---
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEmail) return;

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: quickEmail })
      });

      if (res.ok) {
        triggerAlert('success', 'Subscriber added successfully.');
        setQuickEmail('');
        fetchAllData();
      } else {
        const data = await res.json();
        triggerAlert('err', data.error || 'Subscription failed.');
      }
    } catch (err) {
      triggerAlert('err', 'Error routing subscription.');
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Unsubscribe this recipient?')) return;
    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerAlert('success', 'Removed from subscription modules.');
        fetchAllData();
      } else {
        triggerAlert('err', 'Failed to remove subscriber.');
      }
    } catch (err) {
      triggerAlert('err', 'Error communicating subscriber erasure.');
    }
  };

  // --- STORIES / ARTICLES OPERATIONS ---
  const handleOpenAddArticle = () => {
    setEditingArticleId(null);
    setArticleFormData({
      title: '',
      subtitle: '',
      category: 'History',
      readTime: '6 min read',
      imageUrl: '',
      author: 'Jean-Luc Zaytounada',
      content: ''
    });
    setIsArticleFormOpen(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticleId(art.id);
    setArticleFormData({
      title: art.title,
      subtitle: art.subtitle,
      category: art.category,
      readTime: art.readTime,
      imageUrl: art.imageUrl,
      author: art.author,
      content: Array.isArray(art.content) ? art.content.join('\n\n') : ''
    });
    setIsArticleFormOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    const processedContent = articleFormData.content
      ? articleFormData.content.split('\n\n').map(p => p.trim()).filter(Boolean)
      : [];

    const payload = {
      ...articleFormData,
      content: processedContent
    };

    const url = editingArticleId ? `/api/articles/${editingArticleId}` : '/api/articles';
    const method = editingArticleId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerAlert('success', editingArticleId ? 'Article modified.' : 'New chronicle listed successfully!');
        setIsArticleFormOpen(false);
        fetchAllData();
      } else {
        const errData = await res.json();
        triggerAlert('err', errData.error || 'Server validation failed.');
      }
    } catch (err) {
      triggerAlert('err', 'Network error committing chronicle.');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to remove this story? This will erase it from the magazine catalog.')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerAlert('success', 'Chronicle deleted successfully.');
        fetchAllData();
      } else {
        triggerAlert('err', 'Failed to delete chronicle.');
      }
    } catch (err) {
      triggerAlert('err', 'Error connecting to delete API.');
    }
  };

  // --- PAGES & SECTIONS OPERATIONS ---
  const handleMovePage = (index: number, direction: 'up' | 'down') => {
    const newPages = [...pagesConfig];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPages.length) return;

    // Swap ordering numbers
    const temp = newPages[index].order;
    newPages[index].order = newPages[targetIndex].order;
    newPages[targetIndex].order = temp;

    // Re-sort state
    const sorted = newPages.sort((a, b) => a.order - b.order);
    setPagesConfig(sorted);
  };

  const handlePageToggleActive = (pageId: string) => {
    const updated = pagesConfig.map(p => {
      if (p.id === pageId) {
        if (p.cannotDisable) return p;
        return { ...p, active: !p.active };
      }
      return p;
    });
    setPagesConfig(updated);
  };

  const handlePageLabelChange = (pageId: string, label: string) => {
    const updated = pagesConfig.map(p => {
      if (p.id === pageId) {
        return { ...p, label };
      }
      return p;
    });
    setPagesConfig(updated);
  };

  const handleSavePagesConfig = async () => {
    try {
      const res = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagesConfig)
      });
      if (res.ok) {
        triggerAlert('success', 'Page navigation order & configurations committed to Express Server!');
        fetchAllData();
      } else {
        triggerAlert('err', 'Failed to commit tab/page configuration.');
      }
    } catch (err) {
      triggerAlert('err', 'Network error committing pages configuration.');
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsFormData)
      });
      if (res.ok) {
        triggerAlert('success', 'General site content & headings customized successfully. Reload pages to view!');
        fetchAllData();
      } else {
        triggerAlert('err', 'Failed to customize site parameters.');
      }
    } catch (err) {
      triggerAlert('err', 'Network error committing core settings.');
    }
  };

  // Filters logic
  const filteredBookings = bookings.filter(b => 
    b.userName.toLowerCase().includes(bookingFilter.toLowerCase()) ||
    b.userEmail.toLowerCase().includes(bookingFilter.toLowerCase()) ||
    b.restaurantName.toLowerCase().includes(bookingFilter.toLowerCase())
  );

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(restaurantFilter.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(restaurantFilter.toLowerCase()) ||
    r.city.toLowerCase().includes(restaurantFilter.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(subscriberFilter.toLowerCase())
  );

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(storyFilter.toLowerCase()) ||
    a.category.toLowerCase().includes(storyFilter.toLowerCase()) ||
    a.author.toLowerCase().includes(storyFilter.toLowerCase())
  );

  // Authentication Lock Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 animate-fade-in text-white text-left" id="admin-lock-screen">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:shadow-emerald-950/20 hover:shadow-xl transition-all duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-900/60 rounded-full border border-emerald-500/30 text-emerald-400 mb-4 animate-pulse">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-semibold tracking-wider text-emerald-500 uppercase">
              Zaytounada Administration
            </h2>
            <p className="text-xs text-neutral-400 font-mono mt-1 uppercase tracking-widest">
              Security Authority Gate
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
                Enter Administrative Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Database Passcode..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 font-mono tracking-widest text-emerald-350 text-center uppercase"
                required
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">Default system bypass passcode is <code className="text-emerald-500">admin</code></span>
            </div>

            {authError && (
              <div className="bg-red-950/50 border border-red-500/20 text-red-250 p-3 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold uppercase py-3 rounded-xl transition-all duration-300 shadow-lg font-mono text-xs tracking-wider cursor-pointer"
            >
              Verify Crypt Passcode
            </button>
          </form>

          <p className="text-[9.5px] text-neutral-600 text-center mt-8 font-mono tracking-wider">
            ZAYTOUNADA CODES v1.2. CONFIDENTIALITY PROTOCOLS ACTIVE.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 py-6 animate-fade-in text-left" id="admin-authorized-desk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-neutral-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border border-emerald-950">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="bg-amber-450 bg-amber-500 text-emerald-950 font-mono text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md">
                Master Security Terminal
              </span>
              {isLoading && <span className="text-xs text-amber-300 animate-spin"><RefreshCw className="w-3.5 h-3.5" /></span>}
            </div>
            <h1 className="font-serif text-3xl font-light mt-1 uppercase tracking-wide">
              Control <span className="font-medium text-amber-300">Hub Dashboard</span>
            </h1>
            <p className="text-neutral-300 text-xs mt-1.5 font-mono max-w-xl">
              Vetting directory registers, table reservation rosters, micro-subscribers database, and routed verification routing SMTP engines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              className="flex items-center gap-1.5 bg-neutral-900/60 hover:bg-neutral-900 border border-white/10 text-neutral-200 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>SYNC STATES</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-950/85 hover:bg-red-950 text-red-200 hover:text-white border border-red-900/30 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Global Action Alerts */}
        {alertMsg && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${
            alertMsg.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <CheckCircle className={`w-5 h-5 ${alertMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`} />
            <span className="text-xs font-semibold leading-relaxed font-mono">{alertMsg.text}</span>
          </div>
        )}

        {/* Dynamic navigation bar */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3 mb-6">
          <button
            onClick={() => setAdminTab('reservations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              adminTab === 'reservations'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200 shadow-2xs'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>Reservations Ledger ({bookings.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('restaurants')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              adminTab === 'restaurants'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200 shadow-2xs'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-550" />
            <span>Edit Establishments ({restaurants.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('subscribers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              adminTab === 'subscribers'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200 shadow-2xs'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Subscribers Module ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('emails')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              adminTab === 'emails'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200 shadow-2xs'
            }`}
          >
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>Email Routing Sent Box ({emailLogs.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('stories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              adminTab === 'stories'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200 shadow-2xs'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Edit Stories ({articles.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('pages-sections')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              adminTab === 'pages-sections'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200 shadow-2xs'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-550" />
            <span>Edit Sections & Pages</span>
          </button>
        </div>

        {/* TABLE CONTROL 1: RESERVATIONS BOARD */}
        {adminTab === 'reservations' && (
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            {/* Action Bar */}
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Query guest, email, or dining room..."
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>
              <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-widest bg-white border border-neutral-200 px-3 py-1.5 rounded-full">
                {filteredBookings.length} results found
              </span>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <Calendar className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-medium">No dinner allocations found matching search criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-150 text-[10px] font-mono uppercase tracking-wider text-neutral-600">
                      <th className="px-6 py-4">Gourmet Seat Code</th>
                      <th className="px-6 py-4">Patron Details</th>
                      <th className="px-6 py-4">Establishment</th>
                      <th className="px-6 py-4">Timing Details</th>
                      <th className="px-6 py-4">Covers / Notes</th>
                      <th className="px-6 py-4">Seating Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {filteredBookings.map((book) => (
                      <tr key={book.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-neutral-600">
                          {book.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-neutral-900">{book.userName}</div>
                          <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{book.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 font-serif font-bold text-emerald-800">
                          {book.restaurantName}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-800">{book.date}</div>
                          <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{book.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-neutral-800">{book.guestsCount} Seats</div>
                          <div className="text-[10.5px] text-neutral-500 italic max-w-xs mt-1 leading-tight truncate" title={book.specialRequests}>
                            {book.specialRequests || "No food prerequisites."}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold text-white tracking-widest ${
                            book.status === 'confirmed' ? 'bg-emerald-700' : 'bg-amber-600'
                          }`}>
                            {book.status === 'confirmed' ? 'CONFIRMED' : 'PENDING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditBooking(book)}
                              className="p-1 px-2.5 bg-neutral-100 text-neutral-700 hover:bg-amber-500 hover:text-emerald-950 font-mono text-[10px] uppercase font-bold rounded border border-neutral-200 transition-colors cursor-pointer"
                              title="Edit seating reservation"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(book.id)}
                              className="p-1 px-2 bg-neutral-100 text-red-650 hover:bg-red-600 hover:text-white font-mono text-[10px] uppercase font-bold rounded border border-neutral-200 transition-colors cursor-pointer"
                              title="Cancel allocation"
                            >
                              CANCEL
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TABLE CONTROL 2: EDIT ESTABLISHMENTS GUIDE */}
        {adminTab === 'restaurants' && (
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            {/* Header section with Add Button */}
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-85 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search restaurant, chef, cuisine, cities..."
                    value={restaurantFilter}
                    onChange={(e) => setRestaurantFilter(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                  />
                </div>
              </div>

              <button
                onClick={handleOpenAddRestaurant}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>INDEX NEW ESTABLISHMENT</span>
              </button>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <Building2 className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-medium">No restaurants found in memory matching requirements.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-150 text-[10px] font-mono uppercase tracking-wider text-neutral-600">
                      <th className="px-6 py-4">Spot Cover</th>
                      <th className="px-6 py-4">Establishment & Chef</th>
                      <th className="px-6 py-4">Cuisine & City</th>
                      <th className="px-6 py-4">Ratings Distinction</th>
                      <th className="px-6 py-4">Contacts Database</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {filteredRestaurants.map((rest) => (
                      <tr key={rest.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-6 py-4 shrink-0">
                          <img
                            src={rest.imageUrl}
                            alt={rest.name}
                            className="w-14 h-11 object-cover rounded-lg border border-neutral-200 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-serif text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                            {rest.name}
                            <span className="text-[9px] font-mono text-neutral-400 font-normal">ID: {rest.id}</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 italic mt-0.5">Chef {rest.chef || "Senior Brigade"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium block text-emerald-800">{rest.cuisine}</span>
                          <span className="text-[10.5px] font-mono text-neutral-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            {rest.city} {rest.neighborhood ? `(${rest.neighborhood})` : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-amber-500">
                            {Array.from({ length: rest.stars || 0 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                            {(rest.stars === 0) && (
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 p-1 rounded">
                                {rest.distinction}
                              </span>
                            )}
                          </div>
                          <span className="text-[9.5px] text-neutral-500 block font-mono mt-1 text-left">Price range: {rest.priceRange}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-neutral-750 font-medium">{rest.phone}</div>
                          <div className="text-[10px] text-emerald-700 underline mt-0.5 truncate max-w-xs">{rest.website}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditRestaurant(rest)}
                              className="p-1 px-2.5 bg-neutral-100 text-neutral-700 hover:bg-amber-500 hover:text-emerald-950 font-mono text-[10px] uppercase font-bold rounded border border-neutral-200 transition-colors cursor-pointer"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => handleDeleteRestaurant(rest.id)}
                              className="p-1 px-2 bg-neutral-100 text-red-650 hover:bg-red-650 hover:text-white font-mono text-[10px] uppercase font-bold rounded border border-neutral-200 transition-colors cursor-pointer"
                            >
                              DELETE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TABLE CONTROL 3: SUBSCRIBERS DIRECTORY MODULE */}
        {adminTab === 'subscribers' && (
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            {/* Quick entry box */}
            <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex flex-col md:flex-row items-center justify-between gap-4">
              <form onSubmit={handleAddSubscriber} className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Insert guest email manually..."
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  className="px-3 py-2 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-600 shadow-2xs w-full sm:w-64"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-mono font-bold uppercase rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  ADD GUEST
                </button>
              </form>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Instant email filter..."
                  value={subscriberFilter}
                  onChange={(e) => setSubscriberFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>
            </div>

            {filteredSubscribers.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <Users className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-medium">No registered subscribers found matching query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-150 text-[10px] font-mono uppercase tracking-wider text-neutral-600">
                      <th className="px-6 py-4">Subscriber ID</th>
                      <th className="px-6 py-4">Guest Verified Email</th>
                      <th className="px-6 py-4">Registration Timestamp</th>
                      <th className="px-6 py-4">Update Submodules</th>
                      <th className="px-6 py-4 text-right">Delete Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {filteredSubscribers.map((sub, idx) => (
                      <tr key={sub.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-neutral-500">
                          {sub.id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-neutral-900">
                          {sub.email}
                        </td>
                        <td className="px-6 py-4 font-mono text-neutral-500">
                          {new Date(sub.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                            ACTIVE CIRCULARS
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(sub.id)}
                            className="p-1 px-2.5 bg-neutral-100 hover:bg-red-650 hover:text-white hover:border-red-600 text-red-650 font-mono text-[10px] uppercase font-bold rounded border border-neutral-250 transition-colors cursor-pointer"
                          >
                            REMOVE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TABLE CONTROL 4: EMAIL ROUTING SENT BOX TRACKER */}
        {adminTab === 'emails' && (
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in text-left">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-neutral-700">
                💌 SMTP LOG ROUTER ACTIVE: Tracing client reservation confirmation letters in real time.
              </span>
              <span className="text-[10px] font-mono bg-emerald-800 text-amber-300 font-bold px-3 py-1 rounded">
                SECURE OUTBOX
              </span>
            </div>

            {emailLogs.length === 0 ? (
              <div className="p-16 text-center text-neutral-500">
                <Mail className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h4 className="font-semibold text-neutral-900">Sent outbox is currently vacant.</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-normal">
                  No priority reservation email routing has been dispatched in the current node cycle. Try booking a table on any restaurant modal first!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {emailLogs.map((log) => (
                  <div key={log.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-50/50 transition-all text-left">
                    <div className="space-y-1 max-w-2xl text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-neutral-100 text-neutral-700 border border-neutral-250 font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                          {log.id}
                        </span>
                        <span className="text-xs font-mono font-bold text-neutral-500">
                          To: <span className="text-neutral-900">{log.to}</span>
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-neutral-950 text-sm">{log.subject}</h4>
                      <p className="text-[11px] text-neutral-400 font-mono">{new Date(log.date).toLocaleString()}</p>
                    </div>

                    <button
                      onClick={() => setSelectedMail(log)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-950 hover:bg-amber-500 text-white hover:text-emerald-950 border border-neutral-800 font-mono font-bold text-xs uppercase rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>INSPECT HTML SHEET</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TABLE CONTROL 5: EDIT STORIES (MAGAZINE ARTICLES) */}
        {adminTab === 'stories' && (
          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in text-left">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-85">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Query story title, category, author..."
                  value={storyFilter}
                  onChange={(e) => setStoryFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                />
              </div>

              <button
                onClick={handleOpenAddArticle}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>WRITE NEW STORY CHRONICLE</span>
              </button>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <FileText className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-medium">No story chronicles found in memory matching requirements.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-150 text-[10px] font-mono uppercase tracking-wider text-neutral-600">
                      <th className="px-6 py-4">Cover</th>
                      <th className="px-6 py-4">Title & Subtitle</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Author & Metrics</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-6 py-4 shrink-0">
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-14 h-11 object-cover rounded-lg border border-neutral-200 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-serif text-sm font-bold text-neutral-900 leading-tight">
                            {art.title}
                            <span className="text-[9px] font-mono text-neutral-400 font-normal ml-1.5 block sm:inline">ID: {art.id}</span>
                          </div>
                          <div className="text-[11px] text-neutral-500 italic mt-0.5 max-w-md line-clamp-1">{art.subtitle}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-red-50 text-red-650 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-red-200 font-mono">
                            {art.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-neutral-805">By {art.author}</div>
                          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{art.date} • {art.readTime}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditArticle(art)}
                              className="p-1 px-2.5 bg-neutral-100 text-neutral-700 hover:bg-amber-500 hover:text-emerald-950 font-mono text-[10px] uppercase font-bold rounded border border-neutral-200 transition-colors cursor-pointer"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-1 px-2 bg-neutral-100 text-red-650 hover:bg-red-650 hover:text-white font-mono text-[10px] uppercase font-bold rounded border border-neutral-200 transition-colors cursor-pointer"
                            >
                              DELETE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TABLE CONTROL 6: EDIT SECTIONS & PAGES ORDERING */}
        {adminTab === 'pages-sections' && (
          <div className="space-y-8 animate-fade-in text-left">
            {/* General Site Content Headings Customization */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
              <div className="border-b border-neutral-100 pb-3 mb-5">
                <h3 className="font-serif text-lg font-bold text-neutral-900 uppercase tracking-wide">
                  Customize Site Sections Copy
                </h3>
                <p className="text-xs text-neutral-450 font-mono uppercase tracking-widest">
                  Modify main display headings and templates
                </p>
              </div>

              <form onSubmit={handleSaveSiteSettings} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Hero Slider Title / Tagline
                    </label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={settingsFormData.heroTagline}
                      onChange={e => setSettingsFormData({...settingsFormData, heroTagline: e.target.value})}
                      required
                      placeholder="e.g. The Elite Authority Vetting Lebanese Terroir"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Hero Slider Subtitle
                    </label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={settingsFormData.heroSubtitle}
                      onChange={e => setSettingsFormData({...settingsFormData, heroSubtitle: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Neighborhoods Section Title
                    </label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={settingsFormData.neighborhoodsTitle}
                      onChange={e => setSettingsFormData({...settingsFormData, neighborhoodsTitle: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Neighborhoods Section Subtitle
                    </label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={settingsFormData.neighborhoodsSubtitle}
                      onChange={e => setSettingsFormData({...settingsFormData, neighborhoodsSubtitle: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-neutral-900 border border-neutral-850 hover:bg-amber-500 hover:text-emerald-950 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Apply site sections text
                  </button>
                </div>
              </form>
            </div>

            {/* Menu Navigation Ordering and Move Pages control */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900 uppercase tracking-wide">
                    Rearrange Main Menu Tabs & Pages
                  </h3>
                  <p className="text-xs text-neutral-450 font-mono uppercase tracking-widest mt-0.5">
                    Drag-free dynamic routing: Rename, enable/hide, and change navigation priority ordering
                  </p>
                </div>

                <button
                  onClick={handleSavePagesConfig}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>COMMIT PAGE HIERARCHY</span>
                </button>
              </div>

              {pagesConfig.length === 0 ? (
                <div className="p-8 text-center text-neutral-450 text-xs">
                  Loading menu components layout config...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-150 text-[10px] font-mono uppercase tracking-wider text-neutral-600">
                        <th className="px-6 py-4">Page Index</th>
                        <th className="px-6 py-4">Tab Reference ID</th>
                        <th className="px-6 py-4">Nav Label Name</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Priority Positioning Ordering</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-xs">
                      {pagesConfig.map((page, idx) => (
                        <tr key={page.id} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-neutral-550">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-emerald-800">
                            {page.id}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={page.label}
                              onChange={(e) => handlePageLabelChange(page.id, e.target.value)}
                              className="px-2.5 py-1.5 w-64 bg-neutral-50 border border-neutral-200 hover:border-neutral-350 focus:bg-white text-xs text-neutral-900 rounded font-medium focus:outline-none focus:border-emerald-600"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handlePageToggleActive(page.id)}
                              disabled={page.cannotDisable}
                              className={`px-3 py-1 text-[9px] font-mono uppercase font-bold rounded cursor-pointer ${
                                page.active
                                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-250'
                                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-450 border border-neutral-250 line-through'
                              }`}
                            >
                              {page.active ? 'Visible' : 'Hidden'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleMovePage(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-[10px] uppercase font-bold rounded border border-neutral-250 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <ArrowUp className="w-3 h-3" />
                                <span>UP</span>
                              </button>
                              <button
                                onClick={() => handleMovePage(idx, 'down')}
                                disabled={idx === pagesConfig.length - 1}
                                className="p-1 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-[10px] uppercase font-bold rounded border border-neutral-250 transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <ArrowDown className="w-3 h-3" />
                                <span>DOWN</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL WINDOW 1: ADD / EDIT RESTAURANT FORM */}
      {isRestaurantFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="restaurant-form-title" role="dialog" aria-modal="true text-neutral-955">
          <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" onClick={() => setIsRestaurantFormOpen(false)} />
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 animate-fade-in my-8 text-left text-neutral-950">
              
              <button
                onClick={() => setIsRestaurantFormOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-2 rounded-full cursor-pointer hover:bg-neutral-100"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="mb-6 border-b border-neutral-100 pb-3">
                <h3 className="font-serif text-2xl font-light text-neutral-900 uppercase tracking-wide" id="restaurant-form-title">
                  {editingRestaurantId ? 'Modify Restaurant' : 'Index Novel Establishment'}
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase tracking-widest leading-none">
                  Vetting Registry Entry form
                </p>
              </div>

              <form onSubmit={handleSaveRestaurant} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Establishment Name</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.name}
                      onChange={e => setRestaurantFormData({...restaurantFormData, name: e.target.value})}
                      required
                      placeholder="e.g. Sultan Ibrahim"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-705 mb-1">Cuisine / Speciality Descriptor</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.cuisine}
                      onChange={e => setRestaurantFormData({...restaurantFormData, cuisine: e.target.value})}
                      required
                      placeholder="e.g. Progressive Maritime & Fresh Sayyadieh"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Locality City</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.city}
                      onChange={e => setRestaurantFormData({...restaurantFormData, city: e.target.value})}
                    >
                      <option value="Beirut">Beirut</option>
                      <option value="Byblos">Byblos</option>
                      <option value="Batroun">Batroun</option>
                      <option value="Tripoli">Tripoli</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Gourmet Neighborhood District</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.neighborhood}
                      onChange={e => setRestaurantFormData({...restaurantFormData, neighborhood: e.target.value as any})}
                    >
                      <option value="hamra">Hamra</option>
                      <option value="mar_mikhael">Mar Mikhael</option>
                      <option value="sassine">Sassine / Achrafieh</option>
                      <option value="sodeco">Sodeco</option>
                      <option value="badaro">Badaro</option>
                      <option value="antelias">Antelias</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Executive Chef</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.chef}
                      onChange={e => setRestaurantFormData({...restaurantFormData, chef: e.target.value})}
                      placeholder="e.g. Rabih Fouad"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Ratings Star Count</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium font-bold text-amber-600"
                      value={restaurantFormData.stars}
                      onChange={e => setRestaurantFormData({...restaurantFormData, stars: parseInt(e.target.value)})}
                    >
                      <option value="0">0 Stars (Bib Gourmand / Vetted Selection)</option>
                      <option value="1">1 Star (High Quality Cooking - ✻)</option>
                      <option value="2">2 Stars (Excellent Cooking, Worth a Detour - ✻✻)</option>
                      <option value="3">3 Stars (Exceptional Cuisine, Worth a Special Journey - ✻✻✻)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Specific Guide Distinction Award</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.distinction}
                      onChange={e => setRestaurantFormData({...restaurantFormData, distinction: e.target.value})}
                    >
                      <option value="SELECTED">SELECTED GUIDE ENTRY</option>
                      <option value="BIB_GOURMAND">BIB GOURMAND (Exceptional value)</option>
                      <option value="STAR_1">1 ZAYTOUNADA STAR ✻</option>
                      <option value="STAR_2">2 ZAYTOUNADA STARS ✻✻</option>
                      <option value="STAR_3">3 ZAYTOUNADA STARS ✻✻✻</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Pricing Class Range</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.priceRange}
                      onChange={e => setRestaurantFormData({...restaurantFormData, priceRange: e.target.value})}
                    >
                      <option value="$">$ (Extremely Economical Street eats)</option>
                      <option value="$$">$$ (Moderate Bistronomy)</option>
                      <option value="$$$">$$$ (Fine Upper Midscale)</option>
                      <option value="$$$$">$$$$ (Elite Exclusive Luxury Palace)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Telephone Contacts</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.phone}
                      onChange={e => setRestaurantFormData({...restaurantFormData, phone: e.target.value})}
                      placeholder="e.g. +961 1 200 400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Digital Website Domain</label>
                    <input
                      type="url"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.website}
                      onChange={e => setRestaurantFormData({...restaurantFormData, website: e.target.value})}
                      placeholder="e.g. https://lisabeirut.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Vetting Category Module</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.category}
                      onChange={e => setRestaurantFormData({...restaurantFormData, category: e.target.value})}
                    >
                      <option value="fine_dining">Traditional Haute Gastronomy</option>
                      <option value="pub_cafe">Elite Bistro Pubs & Cosy Cafes</option>
                      <option value="vibe">Lebanese Vibes & Music</option>
                      <option value="takeaway_bakery_produce">Bakeries, Street Manoushehs & Sweetshops</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Primary Display Image URL</label>
                    <input
                      type="url"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={restaurantFormData.imageUrl}
                      onChange={e => setRestaurantFormData({...restaurantFormData, imageUrl: e.target.value})}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Physical Postal Address</label>
                  <input
                    type="text"
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                    value={restaurantFormData.address}
                    onChange={e => setRestaurantFormData({...restaurantFormData, address: e.target.value})}
                    placeholder="e.g. Sursock Quarter, Achrafieh, Beirut"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Editorial Description Hook</label>
                  <textarea
                    rows={2}
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium leading-relaxed"
                    value={restaurantFormData.description}
                    onChange={e => setRestaurantFormData({...restaurantFormData, description: e.target.value})}
                    required
                    placeholder="Provide authentic historic context, culinary mastery details, and structural architecture..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Secret Inspector Evaluation Report (Notes)</label>
                  <textarea
                    rows={2}
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium leading-relaxed"
                    value={restaurantFormData.inspectorNote}
                    onChange={e => setRestaurantFormData({...restaurantFormData, inspectorNote: e.target.value})}
                    placeholder="Vetting details prepared secretively by Michelin-vetted dining coordinators..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Signature Culinary Plates (comma-separated)</label>
                  <input
                    type="text"
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium font-mono text-[11px]"
                    value={restaurantFormData.signatureDishes}
                    onChange={e => setRestaurantFormData({...restaurantFormData, signatureDishes: e.target.value})}
                    placeholder="Moutabbal, Kibbeh Nayyeh, Hummus with Pine Nuts, Sayyadieh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Ambience & Space Attributes (comma-separated)</label>
                  <input
                    type="text"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-mono text-[11px]"
                    value={restaurantFormData.features}
                    onChange={e => setRestaurantFormData({...restaurantFormData, features: e.target.value})}
                    placeholder="Valet Parking, Outdoor Terrace, Live Music, Sea Views, Wood Fire"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsRestaurantFormOpen(false)}
                    className="px-4.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-mono font-bold uppercase rounded-xl transition-all cursor-pointer"
                  >
                    DISMISS
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer text-amber-300"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE ESTABLISHMENT</span>
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* MODAL WINDOW 2: EDIT RESERVATION FORM */}
      {isBookingFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="booking-form-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" onClick={() => setIsBookingFormOpen(false)} />
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 animate-fade-in my-8 text-neutral-950 text-left">
              
              <button
                onClick={() => setIsBookingFormOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-2 rounded-full cursor-pointer hover:bg-neutral-100"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="mb-6 border-b border-neutral-100 pb-3 text-left">
                <h3 className="font-serif text-2xl font-light text-neutral-900 uppercase tracking-wide" id="booking-form-title">
                  Adjust Seating Parameters
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-0.5 uppercase tracking-widest leading-none">
                  Reservation Seat Allocation: {editingBookingId}
                </p>
              </div>

              <form onSubmit={handleSaveBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Patron Guest Name</label>
                  <input
                    type="text"
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                    value={bookingFormData.userName}
                    onChange={e => setBookingFormData({...bookingFormData, userName: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Verification Routing Email</label>
                  <input
                    type="email"
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                    value={bookingFormData.userEmail}
                    onChange={e => setBookingFormData({...bookingFormData, userEmail: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Patron Covers (Seats)</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={bookingFormData.guestsCount}
                      onChange={e => setBookingFormData({...bookingFormData, guestsCount: parseInt(e.target.value)})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Appointed Hour</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-mono font-semibold"
                      value={bookingFormData.time}
                      onChange={e => setBookingFormData({...bookingFormData, time: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Reserved Calendar Date</label>
                  <input
                    type="date"
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-mono"
                    value={bookingFormData.date}
                    onChange={e => setBookingFormData({...bookingFormData, date: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Special Table Prerequisites</label>
                  <textarea
                    rows={2}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-955 leading-normal"
                    value={bookingFormData.specialRequests}
                    onChange={e => setBookingFormData({...bookingFormData, specialRequests: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Safety Approval Seating status</label>
                  <select
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-mono uppercase font-bold text-emerald-800"
                    value={bookingFormData.status}
                    onChange={e => setBookingFormData({...bookingFormData, status: e.target.value as any})}
                  >
                    <option value="pending">PENDING MANUEL SEPARATION</option>
                    <option value="confirmed">CONFIRMED VETTED ALLOCATION</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsBookingFormOpen(false)}
                    className="px-4 py-2 bg-neutral-150 hover:bg-neutral-200 text-neutral-700 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer"
                  >
                    DISMISS
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    COMMIT OVERWRITE
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* MODAL WINDOW 3: SMTP CONFIRMATION EMAIL EXTRUSION WRAPPER */}
      {selectedMail && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="mail-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs" onClick={() => setSelectedMail(null)} />
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-neutral-50 border border-neutral-200 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 animate-fade-in my-8 text-neutral-900 text-left">
              
              <button
                onClick={() => setSelectedMail(null)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 p-2 rounded-full cursor-pointer hover:bg-neutral-200"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="mb-6 border-b border-neutral-200 pb-3 text-left">
                <span className="text-[10px] font-mono text-amber-600 font-extrabold uppercase tracking-widest block">
                  SMTP SECURITY LOG REPORT
                </span>
                <h3 className="font-serif text-xl font-bold text-neutral-950 mt-1" id="mail-title">
                  Inspect Dispatched Email Envelope
                </h3>
                
                <div className="mt-4 bg-white border border-neutral-200 rounded-xl p-3 font-mono text-[11px] leading-normal space-y-1 text-neutral-600 text-left">
                  <div>📩 <span className="font-bold">From:</span> routing-agent@zaytounadaguide.com (Verified SMTP Router)</div>
                  <div>👤 <span className="font-bold">To:</span> {selectedMail.to}</div>
                  <div>📋 <span className="font-bold">Subject:</span> {selectedMail.subject}</div>
                  <div>🕒 <span className="font-bold">Dispatched:</span> {new Date(selectedMail.date).toLocaleString()}</div>
                </div>
              </div>

              {/* RENDERED EMAIL BODY CONTAINER */}
              <div 
                className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-inner overflow-y-auto max-h-[450px]"
                dangerouslySetInnerHTML={{ __html: selectedMail.html }}
              />

              <div className="flex justify-end pt-5 border-t border-neutral-200 mt-6">
                <button
                  onClick={() => setSelectedMail(null)}
                  className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-mono font-bold uppercase rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  AUDIT COMPLETE
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL WINDOW 4: ADD / EDIT STORY CHRONICLE */}
      {isArticleFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="article-form-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm" onClick={() => setIsArticleFormOpen(false)} />
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 animate-fade-in my-8 text-neutral-950 text-left">
              
              <button
                onClick={() => setIsArticleFormOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-2 rounded-full cursor-pointer hover:bg-neutral-100"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <div className="mb-6 border-b border-neutral-100 pb-3 text-left">
                <h3 className="font-serif text-2xl font-light text-neutral-900 uppercase tracking-wide" id="article-form-title">
                  {editingArticleId ? 'Modify Story Chronicle' : 'Create New Story Chronicle'}
                </h3>
                <p className="text-xs font-mono text-neutral-450 mt-0.5 uppercase tracking-widest leading-none">
                  Zaytounada Magazine Editorial Publisher
                </p>
              </div>

              <form onSubmit={handleSaveArticle} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Chronicle Title</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={articleFormData.title}
                      onChange={e => setArticleFormData({...articleFormData, title: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1 font-serif">Category / Genre</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={articleFormData.category}
                      onChange={e => setArticleFormData({...articleFormData, category: e.target.value})}
                    >
                      <option value="History">History</option>
                      <option value="Trends">Trends</option>
                      <option value="Guides">Guides</option>
                      <option value="Behind the Scenes">Behind the Scenes</option>
                      <option value="Chef Chronicles">Chef Chronicles</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Subtitle / Summary</label>
                  <input
                    type="text"
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                    value={articleFormData.subtitle}
                    onChange={e => setArticleFormData({...articleFormData, subtitle: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Author Name</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={articleFormData.author}
                      onChange={e => setArticleFormData({...articleFormData, author: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Read Time Estimate</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-medium"
                      value={articleFormData.readTime}
                      onChange={e => setArticleFormData({...articleFormData, readTime: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-950 font-mono"
                    value={articleFormData.imageUrl}
                    onChange={e => setArticleFormData({...articleFormData, imageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Editorial Content Paragraphs (Separate each paragraph with two line-breaks / enter keys)
                  </label>
                  <textarea
                    rows={7}
                    className="w-full bg-neutral-50 border border-neutral-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-neutral-955 leading-relaxed font-serif"
                    value={articleFormData.content}
                    onChange={e => setArticleFormData({...articleFormData, content: e.target.value})}
                    required
                    placeholder="First paragraph... \n\nSecond paragraph..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsArticleFormOpen(false)}
                    className="px-4 py-2 bg-neutral-150 hover:bg-neutral-200 text-neutral-700 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer animate-fade-in"
                  >
                    {editingArticleId ? 'COMMIT CHRONICLE DETAILS' : 'PUBLISH CHRONICLE'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

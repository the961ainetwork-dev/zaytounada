import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import RestaurantCard from './components/RestaurantCard';
import RestaurantDetailModal from './components/RestaurantDetailModal';
import AIConcierge from './components/AIConcierge';
import MapView from './components/MapView';
import MagazineView from './components/MagazineView';
import MyGuideView from './components/MyGuideView';
import GetStartedView from './components/GetStartedView';
import PlanMyDiningView from './components/PlanMyDiningView';
import CurationExplorerView from './components/CurationExplorerView';
import GiftCardView from './components/GiftCardView';
import LiveEntertainmentView from './components/LiveEntertainmentView';
import CategoryHeroSliders from './components/CategoryHeroSliders';
import SpecialtySectionView from './components/SpecialtySectionView';
import HeroSlider from './components/HeroSlider';
import NeighborhoodsView from './components/NeighborhoodsView';
import AdminDashboardView from './components/AdminDashboardView';
import { Restaurant, SavedItinerary, Booking } from './types';
import { RESTAURANTS } from './data/restaurants';
import { Award, Compass, Heart, Award as AwardIcon, MapPin, Grid, Plus, Sparkles, BookOpen, Calendar, Star, Gift, ArrowRight, Share2, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin/')) {
        return 'admin';
      }
      const hash = window.location.hash;
      if (hash === '#admin') {
        return 'admin';
      }
    }
    return 'discovery';
  });
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string | null>(null);
  const [focusedNeighborhoodId, setFocusedNeighborhoodId] = useState<string | null>(null);
  const [copiedNeighborhoodId, setCopiedNeighborhoodId] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [pagesConfig, setPagesConfig] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    heroTagline: "The Elite Authority Vetting Lebanese Terroir & Gastronomy",
    heroSubtitle: "Anonymous inspections, prestigious stars, and legendary feasts curated for true epicureans.",
    neighborhoodsTitle: "Select Gourmet Neighborhoods",
    neighborhoodsSubtitle: "Cultural Quarters Directory",
    featuredChoiceId: "rest-1"
  });

  const fetchPagesAndSettings = async () => {
    try {
      const resPages = await fetch('/api/pages');
      if (resPages.ok) {
        const dataPages = await resPages.json();
        if (Array.isArray(dataPages) && dataPages.length > 0) {
          setPagesConfig(dataPages.sort((a,b) => a.order - b.order));
        }
      }
      const resSettings = await fetch('/api/settings');
      if (resSettings.ok) {
        const dataSettings = await resSettings.json();
        if (dataSettings && dataSettings.heroTagline) {
          setSiteSettings(dataSettings);
        }
      }
    } catch (err) {
      console.error("Failed to load dynamic configurations:", err);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('/api/restaurants');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRestaurants(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch restaurants:", err);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    fetchPagesAndSettings();
  }, []);

  useEffect(() => {
    fetchPagesAndSettings();
  }, [activeTab]);

  useEffect(() => {
    // Gracefully normalize path-based Direct link to hash-based #admin link 
    // to prevent server-side/CDN 404 failures on subsequents refreshes.
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/admin' || path.startsWith('/admin/')) {
        window.history.replaceState(null, '', '/#admin');
        setActiveTab('admin');
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'admin') {
      if (window.location.hash !== '#admin') {
        window.history.pushState(null, '', '/#admin');
      }
    } else {
      if (window.location.hash === '#admin') {
        window.history.pushState(null, '', '/');
      }
    }
  }, [activeTab]);

  // Synchronize activeTab and selectedNeighborhoodId in the query parameters gracefully
  useEffect(() => {
    if (activeTab === 'admin') return;
    try {
      const url = new URL(window.location.href);
      let changed = false;
      
      const currentTab = url.searchParams.get('tab');
      if (activeTab !== 'discovery') {
        if (currentTab !== activeTab) {
          url.searchParams.set('tab', activeTab);
          changed = true;
        }
      } else {
        if (url.searchParams.has('tab')) {
          url.searchParams.delete('tab');
          changed = true;
        }
      }

      const currentNb = url.searchParams.get('neighborhood');
      if (activeTab === 'neighborhoods' && selectedNeighborhoodId) {
        if (currentNb !== selectedNeighborhoodId) {
          url.searchParams.set('neighborhood', selectedNeighborhoodId);
          changed = true;
        }
      } else {
        if (url.searchParams.has('neighborhood')) {
          url.searchParams.delete('neighborhood');
          changed = true;
        }
      }

      // If we previously had #admin hash but switched tabs, clear hash
      if (url.hash === '#admin' && activeTab !== 'admin') {
        url.hash = '';
        changed = true;
      }

      if (changed) {
        window.history.pushState(null, '', url.pathname + url.search + url.hash);
      }
    } catch (err) {
      console.error("Failed to sync URL parameters:", err);
    }
  }, [activeTab, selectedNeighborhoodId]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        setActiveTab('admin');
      } else {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        const neighborhoodParam = params.get('neighborhood');
        if (neighborhoodParam) {
          setSelectedNeighborhoodId(neighborhoodParam);
          setActiveTab('neighborhoods');
        } else if (tabParam) {
          setActiveTab(tabParam);
        } else {
          setActiveTab('discovery');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleShareNeighborhood = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const cleanPath = window.location.pathname === '/admin' ? '/' : window.location.pathname;
    const shareUrl = `${window.location.origin}${cleanPath.endsWith('/') ? cleanPath : cleanPath + '/'}?tab=neighborhoods&neighborhood=${id}`;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setCopiedNeighborhoodId(id);
          setTimeout(() => setCopiedNeighborhoodId(null), 2000);
        });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedNeighborhoodId(id);
        setTimeout(() => setCopiedNeighborhoodId(null), 2000);
      }
    } catch (err) {
      console.error("Share copy failed:", err);
    }
  };

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  
  // Custom featured spot calculated robustly
  const thisWeeksChoice = useMemo<Restaurant>(() => {
    return restaurants.find(r => r.id === 'rest-1' || r.stars === 3) || restaurants[0];
  }, [restaurants]);
  
  // Advanced Filter Categories
  const [selectedDistinction, setSelectedDistinction] = useState<string>('All Distinctions');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All Cuisines');
  const [selectedPrice, setSelectedPrice] = useState<string>('All Prices');

  // Selected Restaurant for Detailed Inspector Modal
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // AI Concierge slide drawer state
  const [isConciergeActive, setIsConciergeActive] = useState<boolean>(false);

  // States with Local Persistency
  const [savedRestaurantIds, setSavedRestaurantIds] = useState<string[]>([]);
  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load Saved parameters and query-string deep link on Mount
  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem('zaytounada_saved_restaurants') || localStorage.getItem('michelin_saved_restaurants');
      if (storedSaved) setSavedRestaurantIds(JSON.parse(storedSaved));

      const storedItineraries = localStorage.getItem('zaytounada_itineraries') || localStorage.getItem('michelin_itineraries');
      if (storedItineraries) setSavedItineraries(JSON.parse(storedItineraries));

      const storedBookings = localStorage.getItem('zaytounada_bookings') || localStorage.getItem('michelin_bookings');
      if (storedBookings) setBookings(JSON.parse(storedBookings));

      // Parse and apply deep-link query parameter
      const params = new URLSearchParams(window.location.search);
      const restaurantId = params.get('restaurant') || params.get('id');
      if (restaurantId) {
        const found = restaurants.find(r => r.id === restaurantId);
        if (found) {
          setSelectedRestaurant(found);
        }
      }

      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
      const neighborhoodParam = params.get('neighborhood');
      if (neighborhoodParam) {
        setSelectedNeighborhoodId(neighborhoodParam);
        setActiveTab('neighborhoods');
      }
    } catch (err) {
      console.error("Storage Mount & Deep-linking Loading error:", err);
    }
  }, [restaurants]);

  const handleCloseDetailModal = () => {
    setSelectedRestaurant(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('restaurant');
      url.searchParams.delete('id');
      window.history.replaceState({}, '', url.pathname + url.search);
    } catch (err) {
      console.error("Failed to update URL history state on modal close:", err);
    }
  };

  // Sync to LocalStorage on updates
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Storage Sync failed for ${key}:`, err);
    }
  };

  const handleToggleSaveRestaurant = (id: string) => {
    let next: string[];
    if (savedRestaurantIds.includes(id)) {
      next = savedRestaurantIds.filter(item => item !== id);
    } else {
      next = [...savedRestaurantIds, id];
    }
    setSavedRestaurantIds(next);
    saveToStorage('zaytounada_saved_restaurants', next);
  };

  const handleAddItinerary = (itinerary: SavedItinerary) => {
    const next = [itinerary, ...savedItineraries];
    setSavedItineraries(next);
    saveToStorage('zaytounada_itineraries', next);
  };

  const handleDeleteItinerary = (id: string) => {
    const next = savedItineraries.filter(it => it.id !== id);
    setSavedItineraries(next);
    saveToStorage('zaytounada_itineraries', next);
  };

  const handleAddBooking = (booking: Booking) => {
    const next = [booking, ...bookings];
    setBookings(next);
    saveToStorage('zaytounada_bookings', next);
  };

  const handleClearAllBookings = () => {
    setBookings([]);
    saveToStorage('zaytounada_bookings', []);
  };

  // Extract unique Cuisines dynamically for filtering option values
  const uniqueCuisinesList = useMemo(() => {
    const cuisinesSet = new Set<string>();
    restaurants.forEach(r => cuisinesSet.add(r.cuisine));
    return ['All Cuisines', ...Array.from(cuisinesSet)];
  }, [restaurants]);

  // Filter restaurants list based on grid combinations
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((rest) => {
      // City Match
      const cityMatch = selectedCity === 'All Cities' || rest.city.toLowerCase() === selectedCity.toLowerCase();
      
      // Text Query Match (Name, Chef, Cuisine, Country)
      const matchesSearch = 
        rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rest.chef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rest.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rest.country.toLowerCase().includes(searchQuery.toLowerCase());

      // Distinction Match
      let matchesDistinction = true;
      if (selectedDistinction !== 'All Distinctions') {
        if (selectedDistinction === 'Stars') {
          matchesDistinction = rest.stars > 0;
        } else if (selectedDistinction === 'Bib Gourmand') {
          matchesDistinction = rest.distinction === 'BIB_GOURMAND';
        } else if (selectedDistinction === 'Selected') {
          matchesDistinction = rest.distinction === 'SELECTED';
        }
      }

      // Cuisine tag Match
      const matchesCuisine = selectedCuisine === 'All Cuisines' || rest.cuisine === selectedCuisine;

      // Price Tier Match
      const matchesPrice = selectedPrice === 'All Prices' || rest.priceRange === selectedPrice;

      return cityMatch && matchesSearch && matchesDistinction && matchesCuisine && matchesPrice;
    });
  }, [restaurants, searchQuery, selectedCity, selectedDistinction, selectedCuisine, selectedPrice]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans" id="zaytounada-app-root">
      
      {/* Brand & Filter Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onOpenConcierge={() => setIsConciergeActive(true)}
        savedCount={savedRestaurantIds.length}
        pagesConfig={pagesConfig}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: DISCOVERY & DIRECTORY */}
        {activeTab === 'discovery' && (
          <div className="space-y-8 animate-fade-in" id="discovery-pane">
            
            {/* Elegant Dynamic Branding Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-1 text-left animate-fade-in" id="homepage-dynamic-hero-banner">
              <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                {/* Decorative background vectors */}
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="max-w-3xl relative z-10">
                  <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-amber-400 uppercase bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    ★ CHRONICLE HEADQUARTERS
                  </span>
                  <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal leading-tight mt-3 text-white uppercase tracking-wide">
                    {siteSettings?.heroTagline || "The Elite Authority Vetting Lebanese Terroir & Gastronomy"}
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 font-light mt-3 leading-relaxed max-w-2xl">
                    {siteSettings?.heroSubtitle || "Anonymous inspections, prestigious stars, and legendary feasts curated for true epicureans."}
                  </p>
                </div>
              </div>
            </div>

            {/* Gen Z Interactive Slider with Optimized Section Images & Live Marquee */}
            <HeroSlider 
              onNavigateTab={setActiveTab}
              onSelectDistinction={setSelectedDistinction}
              onOpenConcierge={() => setIsConciergeActive(true)}
            />

            {/* NEIGHBORHOODS HERO BANNER CARDS GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left" id="neighborhoods-directory-banner-rail">
              <div className="border-b border-neutral-100 pb-3 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-amber-500 block">
                  {siteSettings?.neighborhoodsSubtitle || "CULTURAL QUARTERS DIRECTORY"}
                </span>
                <h3 className="font-serif font-light text-2xl text-neutral-900 mt-1 uppercase tracking-wider">
                  {siteSettings?.neighborhoodsTitle ? (
                    siteSettings.neighborhoodsTitle
                  ) : (
                    <>Select <span className="font-medium text-emerald-800">Gourmet Neighborhoods</span></>
                  )}
                </h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { id: 'hamra', name: 'Hamra', label: 'الحمراء', desc: 'Intellectual & Cozy Cafes', count: 2, bg: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=350' },
                  { id: 'mar_mikhael', name: 'Mar Mikhael', label: 'مار ميخائيل', desc: 'Arts District & Bistro Chic', count: 8, bg: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=350' },
                  { id: 'sassine', name: 'Sassine / Achrafieh', label: 'الأشرفية ساسين', desc: 'Aristocratic & Starred Fine Dining', count: 4, bg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=350' },
                  { id: 'sodeco', name: 'Sodeco', label: 'سوديكو', desc: 'Crossroads & Sandstone Estates', count: 6, bg: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=350' },
                  { id: 'badaro', name: 'Badaro', label: 'بدارو', desc: 'Leafy Terraces & Sidewalk Lunches', count: 3, bg: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=350' },
                  { id: 'antelias', name: 'Antelias', label: 'أنطلياس', desc: 'Coastal Seafood Feasts', count: 2, bg: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=350' }
                ].map((nb) => {
                  const totalCount = RESTAURANTS.filter(r => r.neighborhood === nb.id).length || nb.count;
                  
                  // Compute match count based on all ACTIVE filters
                  const filteredCount = RESTAURANTS.filter(rest => {
                    if (rest.neighborhood !== nb.id) return false;
                    
                    const cityMatch = selectedCity === 'All Cities' || rest.city.toLowerCase() === selectedCity.toLowerCase();
                    
                    const matchesSearch = !searchQuery ? true : (
                      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      rest.chef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      rest.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      rest.country.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    let matchesDistinction = true;
                    if (selectedDistinction !== 'All Distinctions') {
                      if (selectedDistinction === 'Stars') {
                        matchesDistinction = rest.stars > 0;
                      } else if (selectedDistinction === 'Bib Gourmand') {
                        matchesDistinction = rest.distinction === 'BIB_GOURMAND';
                      } else if (selectedDistinction === 'Selected') {
                        matchesDistinction = rest.distinction === 'SELECTED';
                      }
                    }

                    const matchesCuisine = selectedCuisine === 'All Cuisines' || rest.cuisine === selectedCuisine;
                    const matchesPrice = selectedPrice === 'All Prices' || rest.priceRange === selectedPrice;

                    return cityMatch && matchesSearch && matchesDistinction && matchesCuisine && matchesPrice;
                  }).length;

                  const hasActiveFilters = selectedCity !== 'All Cities' ||
                                           searchQuery !== '' ||
                                           selectedDistinction !== 'All Distinctions' ||
                                           selectedCuisine !== 'All Cuisines' ||
                                           selectedPrice !== 'All Prices';

                  return (
                    <div
                      key={nb.id}
                      onClick={() => {
                        setSelectedNeighborhoodId(nb.id);
                        setActiveTab('neighborhoods');
                      }}
                      className="group relative h-40 rounded-2xl overflow-hidden border border-neutral-200 shadow-xs hover:shadow-lg hover:border-emerald-600/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left"
                      id={`banner-tile-${nb.id}`}
                    >
                      <img
                        src={nb.bg}
                        alt={nb.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 saturate-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent" />
                      
                      {/* Floating Share Button widget with responsive micro-feedback states (placed at z-35 for active clickability above any overlays) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareNeighborhood(nb.id);
                        }}
                        className={`absolute top-2 left-2 z-35 px-2 py-1 rounded-md border text-[9px] font-medium shadow-xs transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1 font-mono ${
                          copiedNeighborhoodId === nb.id 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-900/20' 
                            : 'bg-white/95 text-neutral-600 hover:text-emerald-800 border-neutral-200 hover:bg-neutral-50'
                        }`}
                        title={`Copy Share Link for ${nb.name}`}
                        id={`banner-tile-share-${nb.id}`}
                      >
                        {copiedNeighborhoodId === nb.id ? (
                          <Check className="w-3 h-3 text-white stroke-[3px]" />
                        ) : (
                          <Share2 className="w-3 h-3 text-emerald-600" />
                        )}
                        <span className={`text-[8px] font-bold uppercase tracking-wider ${
                          copiedNeighborhoodId === nb.id ? 'text-white' : 'text-emerald-800'
                        }`}>
                          {copiedNeighborhoodId === nb.id ? 'Copied!' : 'Share'}
                        </span>
                      </button>

                      {/* Immediate Float-up Visual Feedback Toast Layer (z-30) */}
                      {copiedNeighborhoodId === nb.id && (
                        <div className="absolute inset-x-2 top-11 z-30 flex justify-center animate-[bounce_1s_infinite]">
                          <div className="bg-emerald-950/95 text-white text-[8px] font-mono tracking-wider px-2 py-1 rounded-md border border-emerald-500/30 shadow-lg flex items-center gap-1 font-bold uppercase backdrop-blur-sm">
                            <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3px]" />
                            <span>Link Copied!</span>
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <span className="text-[8px] font-mono text-amber-300 font-bold uppercase tracking-wider block">
                          {nb.label}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-white tracking-tight leading-tight mt-0.5 group-hover:text-amber-300 transition-colors">
                          {nb.name}
                        </h4>
                        <p className="text-[8.5px] text-neutral-300 leading-none mt-1 truncate">
                          {nb.desc}
                        </p>
                      </div>

                      <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
                        <div className="bg-emerald-950/90 text-white border border-white/5 backdrop-blur-md px-1.5 py-0.5 rounded text-[7.5px] font-mono font-bold tracking-widest">
                          {totalCount} SPOTS
                        </div>
                        {hasActiveFilters && (
                          <div className="bg-amber-500 text-emerald-950 px-1.5 py-0.5 rounded text-[7.5px] font-mono font-black tracking-widest uppercase shadow border border-amber-300">
                            {filteredCount} MATCHED
                          </div>
                        )}
                      </div>

                      {/* Editorial Interactive Hover Tooltip Overlay (z-20) */}
                      <div className="absolute inset-0 bg-neutral-950/95 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 text-left">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-emerald-400 font-extrabold uppercase tracking-widest block font-bold">
                            ★ NEIGHBORHOOD INSIGHT
                          </span>
                          <h4 className="font-serif text-sm font-bold text-white tracking-tight leading-tight">
                            {nb.name} ({nb.label})
                          </h4>
                          <p className="text-[9px] text-neutral-300 leading-relaxed mt-1.5 font-sans font-light">
                            {hasActiveFilters ? (
                              <>
                                Found <span className="text-amber-300 font-bold">{filteredCount}</span> spot{filteredCount === 1 ? '' : 's'} matching active filters (out of {totalCount} total).
                              </>
                            ) : (
                              `Explore ${totalCount} exquisite dining spots, including historic bistros and local sourdough bakeries.`
                            )}
                          </p>

                          {hasActiveFilters && (
                            <div className="text-[7.5px] font-mono text-neutral-400 mt-1 uppercase tracking-wider space-y-0.5">
                              {selectedDistinction !== 'All Distinctions' && (
                                <div>• {selectedDistinction}</div>
                              )}
                              {selectedCuisine !== 'All Cuisines' && (
                                <div>• Cuisine: {selectedCuisine}</div>
                              )}
                              {selectedPrice !== 'All Prices' && (
                                <div>• Price: {selectedPrice}</div>
                              )}
                              {selectedCity !== 'All Cities' && (
                                <div>• City: {selectedCity}</div>
                              )}
                              {searchQuery && (
                                <div className="truncate">• Search: "{searchQuery}"</div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                          <span className="text-[8px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                            {hasActiveFilters ? `${filteredCount} / ${totalCount} Matches` : `${totalCount} Gourmet Spots`}
                          </span>
                          <span className="text-[8px] font-mono text-neutral-400 flex items-center gap-1 font-bold">
                            EXPLORE AREA →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Structured Advanced Filtering Rail */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
                
                {/* Secondary select filter lists */}
                <div className="flex flex-col sm:flex-row flex-1 gap-2.5">
                  
                  {/* Distinction level filter */}
                  <select
                    value={selectedDistinction}
                    onChange={(e) => setSelectedDistinction(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-full text-neutral-900 cursor-pointer focus:border-emerald-600 outline-none"
                    id="distinction-dropdown-select"
                  >
                    <option value="All Distinctions" className="bg-white text-neutral-900">All Distinctions</option>
                    <option value="Stars" className="bg-white text-neutral-900">Zaytounada Stars (✻)</option>
                    <option value="Bib Gourmand" className="bg-white text-neutral-900">Bib Gourmand (☺)</option>
                    <option value="Selected" className="bg-white text-neutral-900">Selected Recommendations</option>
                  </select>

                  {/* Cuisine Category filter */}
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-full text-neutral-900 cursor-pointer focus:border-emerald-600 outline-none"
                    id="cuisine-dropdown-select"
                  >
                    {uniqueCuisinesList.map((cuisine) => (
                      <option key={cuisine} value={cuisine} className="bg-white text-neutral-900">{cuisine}</option>
                    ))}
                  </select>

                  {/* Price budget level filter */}
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white border border-neutral-200 rounded-full text-neutral-900 cursor-pointer focus:border-emerald-600 outline-none"
                    id="price-dropdown-select"
                  >
                    <option value="All Prices" className="bg-white text-neutral-900">All Budgets ($)</option>
                    <option value="$$$$" className="bg-white text-neutral-900">$$$$ (Supreme Luxury)</option>
                    <option value="$$$" className="bg-white text-neutral-900">$$$ (Fine Dining)</option>
                    <option value="$$" className="bg-white text-neutral-900">$$ (Moderate Bistro)</option>
                  </select>
                </div>

                {/* Active Reset Trigger */}
                {(selectedDistinction !== 'All Distinctions' || selectedCuisine !== 'All Cuisines' || selectedPrice !== 'All Prices' || selectedCity !== 'All Cities' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCity('All Cities');
                      setSearchQuery('');
                      setSelectedCuisine('All Cuisines');
                      setSelectedDistinction('All Distinctions');
                      setSelectedPrice('All Prices');
                    }}
                    className="text-[10px] text-emerald-700 hover:text-emerald-600 font-bold uppercase tracking-widest cursor-pointer ml-auto"
                  >
                    Clear Filter Selections
                  </button>
                )}
              </div>
            </div>

            {/* Redesigned Spotlight "This Week's Choice" Section - Immersive scaled-up visuals */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-left" id="weeks-choice-spotlight">
              <div className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 border border-amber-400/40 rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row text-white">
                {/* Decorative spotlight blur overlay */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Details Column */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-between space-y-6 z-10 relative">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-amber-400 text-emerald-950 text-[10px] uppercase font-black font-mono px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>This Week's Choice</span>
                      </span>
                      <span className="text-amber-300 text-xs font-mono font-bold tracking-widest uppercase">Inspectors Benchmark</span>
                    </div>

                    <h2 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight leading-none text-white hover:text-amber-300 transition-colors">
                      {thisWeeksChoice.name}
                    </h2>
                    
                    <p className="text-[11px] font-mono tracking-widest text-amber-300 uppercase font-black">
                      {thisWeeksChoice.cuisine} • {thisWeeksChoice.city}, {thisWeeksChoice.country}
                    </p>

                    <p className="text-xs md:text-sm text-emerald-100 font-light leading-relaxed max-w-2xl">
                      {thisWeeksChoice.description}
                    </p>

                    <div className="p-4 bg-emerald-950/75 border-l-4 border-amber-400 rounded-r-xl italic text-xs text-amber-100/90 leading-relaxed max-w-2xl">
                      "{thisWeeksChoice.inspectorNote}"
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => setSelectedRestaurant(thisWeeksChoice)}
                      className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>inspect evaluating files</span>
                      <ArrowRight className="w-4 h-4 text-emerald-950" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRestaurant(thisWeeksChoice);
                        setTimeout(() => {
                          const container = document.getElementById('gourmet-booking-desk');
                          if (container) {
                            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }, 250);
                      }}
                      className="px-5 py-3.5 bg-transparent border border-white/20 hover:border-amber-400 hover:bg-white/5 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center"
                    >
                      Secure Instant Table Allocations
                    </button>
                  </div>
                </div>

                {/* Sizable Visual Column ("make bigger pictures when you can") */}
                <div className="w-full lg:w-[48%] h-72 sm:h-96 lg:h-auto overflow-hidden relative">
                  <img
                    src={thisWeeksChoice.imageUrl}
                    alt={thisWeeksChoice.name}
                    className="w-full h-full object-cover saturate-110 hover:scale-105 transition-transform duration-1000 min-h-[320px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-emerald-900 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-6 right-6 bg-emerald-950/90 border border-amber-400/30 backdrop-blur-md p-4 rounded-xl text-left max-w-xs shadow-lg">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-widest block mb-1">OFFICIAL CITATION</span>
                    <p className="font-serif text-xs font-bold text-white mb-0.5">3 ZAYTOUNADA STARS AWARDED</p>
                    <p className="text-[10px] text-neutral-300 font-light">Considered by food tasters to be the absolute pinnacle of Levantine culinary art.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CURATED CATEGORIES SECTIONS INDEX & DETAILED LISTS */}
            <CategoryHeroSliders 
              onSelectRestaurant={setSelectedRestaurant} 
              savedRestaurantIds={savedRestaurantIds} 
              onToggleSave={(id, e) => {
                e.stopPropagation();
                handleToggleSaveRestaurant(id);
              }}
              onFilterCuisine={(cuisineName) => {
                // Map the descriptive category to active state filters
                if (cuisineName.includes('Haute')) {
                  setSelectedCuisine('Traditional Lebanese Haute Cuisine');
                  setSearchQuery('');
                } else if (cuisineName.includes('Contemporary')) {
                  setSelectedCuisine('Polished Contemporary Lebanese');
                  setSearchQuery('');
                } else if (cuisineName.includes('Seafood')) {
                  setSearchQuery('Seafood');
                  setSelectedCuisine('All Cuisines');
                } else if (cuisineName.includes('Mediterranean')) {
                  setSearchQuery('Mediterranean');
                  setSelectedCuisine('All Cuisines');
                } else if (cuisineName.includes('Armenian')) {
                  setSelectedCuisine('Armenian-Lebanese Homestyle');
                  setSearchQuery('');
                } else if (cuisineName.includes('Bakeries')) {
                  setSearchQuery('Bakeries');
                  setSelectedCuisine('All Cuisines');
                }
                
                // Scroll smoothly to the filtering dropdowns
                setTimeout(() => {
                  const dropdownEl = document.getElementById('distinction-dropdown-select');
                  if (dropdownEl) {
                    dropdownEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 150);
              }}
            />

            {/* Showcase Restaurant Catalog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-baseline mb-5">
                <h3 className="font-serif font-light text-xl text-neutral-900 flex items-center gap-2 uppercase tracking-wider">
                  <Grid className="w-4 h-4 text-neutral-400" />
                  <span>Zerytounda Catalog</span>
                  <span className="text-[10px] text-neutral-500 font-mono font-normal ml-1 tracking-widest">({filteredRestaurants.length} EVALUATION{filteredRestaurants.length === 1 ? '' : 'S'})</span>
                </h3>
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="text-center py-24 bg-neutral-50 border border-neutral-200 rounded-xl p-10 shadow-sm flex flex-col items-center justify-center">
                  <Award className="w-16 h-16 text-neutral-200 mb-3.5" />
                  <p className="font-serif italic text-lg text-neutral-800">No Evaluations Configured</p>
                  <p className="text-xs text-neutral-500 max-w-sm leading-relaxed mt-1">
                    No inspectors reports fit the active filters. Try resetting keyword indices or checking another capital.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCity('All Cities');
                      setSearchQuery('');
                      setSelectedDistinction('All Distinctions');
                      setSelectedCuisine('All Cuisines');
                      setSelectedPrice('All Prices');
                    }}
                    className="mt-6 px-5 py-3 border border-emerald-600 text-emerald-700 text-[10px] uppercase tracking-[0.3em] font-bold bg-transparent hover:bg-emerald-700 hover:text-white transition-all cursor-pointer shadow-md"
                  >
                    Reset Grid filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="restaurants-grid">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onSelect={() => setSelectedRestaurant(restaurant)}
                      isSaved={savedRestaurantIds.includes(restaurant.id)}
                      onToggleSave={(e) => {
                        e.stopPropagation();
                        handleToggleSaveRestaurant(restaurant.id);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Premium Gift Cards Promotional Showcase embedded on Homepage as requested */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="home-gift-cards-promo">
              <div className="relative bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-800/80 rounded-3xl p-8 md:p-11 overflow-hidden shadow-md flex flex-col lg:flex-row items-center gap-8 text-left">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.08)_0%,transparent_50%)] pointer-events-none" />
                
                <div className="flex-1 space-y-3.5 z-10 relative">
                  <span className="text-amber-400 text-xs font-mono uppercase tracking-[0.3em] font-extrabold flex items-center gap-1.5 leading-none">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span>Zaytounada Luxury Vouchers</span>
                  </span>
                  
                  <h3 className="font-serif text-2xl md:text-3.5xl font-light text-white leading-tight uppercase tracking-wider">
                    Give the Ultimate <span className="font-bold text-amber-300">Gourmet Luxury</span> gift card
                  </h3>
                  
                  <p className="text-xs text-emerald-100 font-light max-w-xl leading-relaxed">
                    Surprise your loved ones, coordinate corporate hospitality, or dedicate spectacular anniversaries. Our digital gift vouchers provide instant delivery options and VIP priority bookings at Lebanon's finest starred establishments.
                  </p>

                  <div className="flex items-center gap-6 pt-1.5">
                    <div className="text-left">
                      <span className="text-lg md:text-xl font-mono font-bold text-amber-400">$50–$500</span>
                      <p className="text-[9px] text-emerald-250 uppercase tracking-widest font-mono">Custom Budgets</p>
                    </div>
                    <div className="border-l border-emerald-700 h-8" />
                    <div className="text-left">
                      <span className="text-lg md:text-xl font-serif font-black text-emerald-255 text-emerald-200">Instant</span>
                      <p className="text-[9px] text-emerald-255 uppercase tracking-widest font-mono">Voucher Delivery</p>
                    </div>
                    <div className="border-l border-emerald-700 h-8" />
                    <div className="text-left">
                      <span className="text-lg md:text-xl font-serif font-black text-amber-400">100%</span>
                      <p className="text-[9px] text-emerald-255 uppercase tracking-widest font-mono">Acceptance Rate</p>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => setActiveTab('gift-cards')}
                      className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-102 cursor-pointer"
                    >
                      Configure Bespoke Voucher NOW
                    </button>
                  </div>
                </div>

                {/* Immersive high-fi interactive Gold voucher layout */}
                <div className="w-80 h-48 shrink-0 relative bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 rounded-2xl p-6 flex flex-col justify-between shadow-2xl border border-white/25 select-none transform rotate-1 hover:rotate-0 transition-transform duration-500 z-10">
                  <div className="absolute inset-0 bg-black/5 rounded-2xl" />
                  <div className="flex justify-between items-start relative z-10 text-emerald-950">
                    <div>
                      <span className="font-serif font-black tracking-widest text-emerald-900 text-xl">Z</span>
                      <p className="text-[6px] tracking-widest text-emerald-950 uppercase font-mono font-bold">ZAYTOUNADA VIP</p>
                    </div>
                    <Gift className="w-5.5 h-5.5 text-emerald-900 opacity-80" />
                  </div>

                  <div className="space-y-1 text-left relative z-10">
                    <p className="text-[7px] text-emerald-950 font-mono tracking-[0.34em] font-extrabold uppercase">GASTRONOMIC GIFT VOUCHER</p>
                    <span className="font-mono text-xl text-emerald-950 font-bold">$250.00</span>
                    <p className="text-[8px] text-emerald-900 font-light italic leading-none truncate pr-4">Valid: Grand Gourmet Tasting Option</p>
                  </div>

                  <div className="flex justify-between items-end text-emerald-900 text-[6px] font-mono tracking-widest relative z-10 uppercase">
                    <div>
                      <p className="opacity-60">ID TICKET</p>
                      <p className="font-bold">ZAYT-GC-482937</p>
                    </div>
                    <div className="text-right">
                      <p className="opacity-60">EXPIRES</p>
                      <p className="font-bold">12/2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: NEIGHBORHOODS MAP & ATLAS */}
        {activeTab === 'neighborhoods' && (
          <NeighborhoodsView
            initialSelectedNeighborhood={selectedNeighborhoodId || undefined}
            savedRestaurantIds={savedRestaurantIds}
            onToggleSave={(id, e) => {
              e.stopPropagation();
              handleToggleSaveRestaurant(id);
            }}
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            onViewOnMap={(neighborhoodId, city) => {
              setSelectedCity(city);
              setFocusedNeighborhoodId(neighborhoodId);
              setActiveTab('map');
            }}
            selectedDistinction={selectedDistinction}
            selectedCuisine={selectedCuisine}
            selectedPrice={selectedPrice}
            searchQuery={searchQuery}
            selectedCity={selectedCity}
          />
        )}

        {/* VIEW: NEW DEDICATED ZAYTOUNADA CATALOGUE PAGE */}
        {activeTab === 'catalogue' && (
          <div className="animate-fade-in" id="catalogue-view-pane">
            <CategoryHeroSliders 
              onSelectRestaurant={setSelectedRestaurant} 
              savedRestaurantIds={savedRestaurantIds} 
              onToggleSave={(id, e) => {
                e.stopPropagation();
                handleToggleSaveRestaurant(id);
              }}
              onFilterCuisine={(cuisineName) => {
                // Map the descriptive category to active state filters
                if (cuisineName.includes('Haute')) {
                  setSelectedCuisine('Traditional Lebanese Haute Cuisine');
                  setSearchQuery('');
                } else if (cuisineName.includes('Contemporary')) {
                  setSelectedCuisine('Polished Contemporary Lebanese');
                  setSearchQuery('');
                } else if (cuisineName.includes('Seafood')) {
                  setSearchQuery('Seafood');
                  setSelectedCuisine('All Cuisines');
                } else if (cuisineName.includes('Mediterranean')) {
                  setSearchQuery('Mediterranean');
                  setSelectedCuisine('All Cuisines');
                } else if (cuisineName.includes('Armenian')) {
                  setSelectedCuisine('Armenian-Lebanese Homestyle');
                  setSearchQuery('');
                } else if (cuisineName.includes('Bakeries')) {
                  setSearchQuery('Bakeries');
                  setSelectedCuisine('All Cuisines');
                }
                setActiveTab('discovery');
                // Scroll smoothly to the filtering dropdowns
                setTimeout(() => {
                  const dropdownEl = document.getElementById('distinction-dropdown-select');
                  if (dropdownEl) {
                    dropdownEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 150);
              }}
            />
          </div>
        )}

        {/* VIEW 2: MAP PLATFORM */}
        {activeTab === 'map' && (
          <MapView
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            focusedNeighborhoodId={focusedNeighborhoodId}
            onClearFocusedNeighborhood={() => setFocusedNeighborhoodId(null)}
          />
        )}

        {/* VIEW: CURATION EXPLORER */}
        {activeTab === 'curation-explorer' && (
          <CurationExplorerView
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            onNavigateTab={setActiveTab}
            savedRestaurantIds={savedRestaurantIds}
            onToggleSaveRestaurant={handleToggleSaveRestaurant}
          />
        )}

        {/* VIEW: PLAN MY DINING */}
        {activeTab === 'plan-dining' && (
          <PlanMyDiningView
            onAddBooking={handleAddBooking}
            onNavigateTab={setActiveTab}
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
          />
        )}

        {/* VIEW: GIFT CARD CENTER */}
        {activeTab === 'gift-cards' && (
          <GiftCardView />
        )}

        {/* VIEW: LIVE ENTERTAINMENT SHOWS */}
        {activeTab === 'live-shows' && (
          <LiveEntertainmentView
            onAddBooking={handleAddBooking}
            onNavigateTab={setActiveTab}
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
          />
        )}

        {/* VIEW: SPECIALTY - PUBS & CAFES */}
        {activeTab === 'pubs-cafes' && (
          <SpecialtySectionView
            category="pub_cafe"
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            savedRestaurantIds={savedRestaurantIds}
            onToggleSaveRestaurant={handleToggleSaveRestaurant}
          />
        )}

        {/* VIEW: SPECIALTY - VIBES */}
        {activeTab === 'vibes' && (
          <SpecialtySectionView
            category="vibe"
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            savedRestaurantIds={savedRestaurantIds}
            onToggleSaveRestaurant={handleToggleSaveRestaurant}
          />
        )}

        {/* VIEW: SPECIALTY - BAKERIES & PRODUCE */}
        {activeTab === 'takeaways-bakeries' && (
          <SpecialtySectionView
            category="takeaway_bakery_produce"
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            savedRestaurantIds={savedRestaurantIds}
            onToggleSaveRestaurant={handleToggleSaveRestaurant}
          />
        )}

        {/* VIEW 3: MAGAZINE EDITORIALS */}
        {activeTab === 'magazine' && (
          <MagazineView />
        )}

        {/* VIEW 4: MY GUIDE & JOURNEY PLANNING */}
        {activeTab === 'my-guide' && (
          <MyGuideView
            savedRestaurantIds={savedRestaurantIds}
            onToggleSave={handleToggleSaveRestaurant}
            onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
            savedItineraries={savedItineraries}
            onAddItinerary={handleAddItinerary}
            onDeleteItinerary={handleDeleteItinerary}
            setActiveTab={setActiveTab}
          />
        )}

        {/* VIEW 5: MY SAVED CATALOG (BACKUP OR SHORT TAB SELECTION) */}
        {activeTab === 'saved' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="saved-guide-pane">
            <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 mb-8 border-b border-neutral-200 pb-4 text-left">
              <div>
                <h2 className="font-serif font-light text-3xl text-neutral-900 flex items-center gap-2">
                  <Heart className="w-8 h-8 text-amber-500 fill-amber-500" />
                  <span>My Saved Guides</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-1 tracking-wide">Quick listing of Zaytounada properties marked for your notebook.</p>
              </div>
              <button
                onClick={() => setActiveTab('my-guide')}
                className="flex items-center gap-2 px-4 py-2 bg-transparent border border-emerald-600 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sequence into Travel Itinerary</span>
              </button>
            </div>

            {savedRestaurantIds.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 border border-neutral-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
                <Heart className="w-16 h-16 text-neutral-200 mb-3" />
                <p className="font-serif italic text-lg text-neutral-800">No Selections Saved</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">
                  You haven't notebooked a gastronomy spot yet. Touch the heart button on restaurant cards to collect.
                </p>
                <button
                  onClick={() => setActiveTab('discovery')}
                  className="mt-6 px-5 py-3 border border-emerald-600 text-emerald-700 text-[10px] uppercase tracking-[0.3em] font-bold bg-transparent hover:bg-emerald-700 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  Browse Culinary Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {restaurants.filter(r => savedRestaurantIds.includes(r.id)).map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onSelect={() => setSelectedRestaurant(restaurant)}
                    isSaved={true}
                    onToggleSave={(e) => {
                      e.stopPropagation();
                      handleToggleSaveRestaurant(restaurant.id);
                    }}
                  />
                ))}
              </div>
            )}

            {/* My Active Bookings Dashboard Widget */}
            <div className="mt-12 bg-neutral-50 border border-neutral-200 rounded-xl p-6 md:p-8 text-left h-auto shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-200 pb-4 mb-5">
                <div>
                  <h3 className="font-serif font-light text-xl text-neutral-900 flex items-center gap-2 uppercase tracking-wide">
                    <Calendar className="w-5.5 h-5.5 text-emerald-600" />
                    <span>Active Bookings Dashboard</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Summary of tables requested through the Gourmet Booking Desk.</p>
                </div>

                {bookings.length > 0 && (
                  <button
                    onClick={handleClearAllBookings}
                    className="text-[10px] text-neutral-400 hover:text-emerald-700 font-mono uppercase tracking-widest cursor-pointer select-none"
                  >
                    Clear Booking Records
                  </button>
                )}
              </div>

              {bookings.length === 0 ? (
                <div className="py-8 font-serif italic text-neutral-400 text-center text-sm">
                  No allocation bookings initiated yet. Book from a restaurant's detail report modal first.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookings.map((book) => (
                    <div 
                      key={book.id} 
                      className="p-4.5 bg-white border border-neutral-200 shadow-sm rounded-lg flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-[8px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-250 font-bold px-1.5 py-0.5 rounded tracking-wider">
                          ALLOCATED TICKET
                        </span>
                        <h4 className="font-serif font-bold text-sm text-emerald-950 mt-1.5">
                          {book.restaurantName}
                        </h4>
                        <p className="text-[10px] text-neutral-600 mt-0.5">
                          Date: {book.date} • {book.time}
                        </p>
                        <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                          Party: {book.guestsCount} Guest{book.guestsCount > 1 ? 's' : ''} • {book.userName}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold block mb-1 tracking-wider">Status</span>
                        <span className="text-[9px] uppercase font-bold text-white bg-emerald-705 bg-emerald-700 px-2.5 py-1 rounded inline-block font-mono tracking-widest">
                          {book.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 6: GET STARTED & GDPR RESOURCES */}
        {activeTab === 'get-started' && (
          <GetStartedView
            onNavigateTab={setActiveTab}
            onOpenConcierge={() => setIsConciergeActive(true)}
          />
        )}

        {/* VIEW: ADMIN LOCKBOX DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboardView onRestaurantsUpdated={fetchRestaurants} />
        )}

      </main>

      {/* FOOTER */}
      <footer className="h-16 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between px-10 text-[9px] uppercase tracking-[0.2em] text-neutral-500 shrink-0 select-none mt-auto">
        <div>© 2026 ZAYTOUNADA GUIDE DIGITAL</div>
        <div className="flex gap-8">
          <span onClick={() => setActiveTab('get-started')} className="hover:text-neutral-900 transition-colors cursor-pointer">Privacy Policy</span>
          <span onClick={() => setActiveTab('get-started')} className="hover:text-neutral-900 transition-colors cursor-pointer">Cookies Manager</span>
          <span onClick={() => setActiveTab('get-started')} className="hover:text-neutral-900 transition-colors cursor-pointer">FAQ & Partners</span>
        </div>
      </footer>

      {/* INSPECTOR DETAIL MODAL COMPONENT */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={handleCloseDetailModal}
          isSaved={savedRestaurantIds.includes(selectedRestaurant.id)}
          onToggleSave={() => handleToggleSaveRestaurant(selectedRestaurant.id)}
          onAddBooking={handleAddBooking}
        />
      )}

      {/* AI COUNSELOR CHAT OVERLAY COMPONENT */}
      <AIConcierge
        isOpen={isConciergeActive}
        onClose={() => setIsConciergeActive(false)}
        savedRestaurants={restaurants.filter(r => savedRestaurantIds.includes(r.id)).map(r => ({
          id: r.id,
          name: r.name,
          city: r.city,
          cuisine: r.cuisine,
          stars: r.stars
        }))}
      />

    </div>
  );
}

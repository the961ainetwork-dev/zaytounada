import { useState, useEffect, useMemo } from 'react';
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
import { Restaurant, SavedItinerary, Booking } from './types';
import { RESTAURANTS } from './data/restaurants';
import { Award, Compass, Heart, Award as AwardIcon, MapPin, Grid, Plus, Sparkles, BookOpen, Calendar, Star } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('discovery');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  
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
      const storedSaved = localStorage.getItem('zaytouynda_saved_restaurants') || localStorage.getItem('michelin_saved_restaurants');
      if (storedSaved) setSavedRestaurantIds(JSON.parse(storedSaved));

      const storedItineraries = localStorage.getItem('zaytouynda_itineraries') || localStorage.getItem('michelin_itineraries');
      if (storedItineraries) setSavedItineraries(JSON.parse(storedItineraries));

      const storedBookings = localStorage.getItem('zaytouynda_bookings') || localStorage.getItem('michelin_bookings');
      if (storedBookings) setBookings(JSON.parse(storedBookings));

      // Parse and apply deep-link query parameter
      const params = new URLSearchParams(window.location.search);
      const restaurantId = params.get('restaurant') || params.get('id');
      if (restaurantId) {
        const found = RESTAURANTS.find(r => r.id === restaurantId);
        if (found) {
          setSelectedRestaurant(found);
        }
      }
    } catch (err) {
      console.error("Storage Mount & Deep-linking Loading error:", err);
    }
  }, []);

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
    saveToStorage('zaytouynda_saved_restaurants', next);
  };

  const handleAddItinerary = (itinerary: SavedItinerary) => {
    const next = [itinerary, ...savedItineraries];
    setSavedItineraries(next);
    saveToStorage('zaytouynda_itineraries', next);
  };

  const handleDeleteItinerary = (id: string) => {
    const next = savedItineraries.filter(it => it.id !== id);
    setSavedItineraries(next);
    saveToStorage('zaytouynda_itineraries', next);
  };

  const handleAddBooking = (booking: Booking) => {
    const next = [booking, ...bookings];
    setBookings(next);
    saveToStorage('zaytouynda_bookings', next);
  };

  const handleClearAllBookings = () => {
    setBookings([]);
    saveToStorage('zaytouynda_bookings', []);
  };

  // Extract unique Cuisines dynamically for filtering option values
  const uniqueCuisinesList = useMemo(() => {
    const cuisinesSet = new Set<string>();
    RESTAURANTS.forEach(r => cuisinesSet.add(r.cuisine));
    return ['All Cuisines', ...Array.from(cuisinesSet)];
  }, []);

  // Filter restaurants list based on grid combinations
  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter((rest) => {
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
  }, [searchQuery, selectedCity, selectedDistinction, selectedCuisine, selectedPrice]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col font-sans" id="zaytouynda-app-root">
      
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
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: DISCOVERY & DIRECTORY */}
        {activeTab === 'discovery' && (
          <div className="space-y-8 animate-fade-in" id="discovery-pane">
            
            {/* Elegant Hero Editorial Panel */}
            <div className="relative bg-[#050505] border-b border-white/5 text-[#F5F5F5] overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 shadow-2xl">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1550966842-2849a2202022?auto=format&fit=crop&q=80&w=1200" 
                  alt="Fine dining table background" 
                  className="w-full h-full object-cover opacity-15 object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/20 z-10" />
              </div>

              <div className="relative max-w-7xl mx-auto space-y-6 z-25">
                <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider border border-white/10 shadow-md">
                  <span className="text-amber-400 font-bold">✻</span>
                  <span>Official 2026 Gastronomic Edition</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight max-w-4xl leading-tight">
                  We Recommend
                </h1>
                <p className="text-white/60 text-base max-w-xl leading-relaxed font-light">
                  Handpicked traditional, coastal, and progressive Lebanese cooking centers and global culinary masterpieces, curated with absolute independence.
                </p>

                {/* Micro metrics count */}
                <div className="pt-4 flex flex-wrap gap-8 text-[10px] font-mono tracking-widest text-white/40">
                  <div>
                    <span className="block text-2xl font-bold text-red-500 font-serif tracking-tight">15+</span>
                    <span>WORLD DESTINATIONS</span>
                  </div>
                  <div className="border-l border-white/10 pl-8">
                    <span className="block text-2xl font-bold text-red-600 font-serif tracking-tight">✻✻✻</span>
                    <span>3 ZAYTOUYNDA STAR TEMPLES</span>
                  </div>
                  <div className="border-l border-white/10 pl-8">
                    <span className="block text-2xl font-bold text-white/80 font-serif tracking-tight">☺</span>
                    <span>BIB GOURMAND VALUE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Advanced Filtering Rail */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-2xl">
                
                {/* Secondary select filter lists */}
                <div className="flex flex-col sm:flex-row flex-1 gap-2.5">
                  
                  {/* Distinction level filter */}
                  <select
                    value={selectedDistinction}
                    onChange={(e) => setSelectedDistinction(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white/5 border border-white/10 rounded-full text-white cursor-pointer focus:border-red-600/50 outline-none"
                    id="distinction-dropdown-select"
                  >
                    <option value="All Distinctions" className="bg-neutral-950 text-white">All Distinctions</option>
                    <option value="Stars" className="bg-neutral-950 text-white">Zaytouynda Stars (✻)</option>
                    <option value="Bib Gourmand" className="bg-neutral-950 text-white">Bib Gourmand (☺)</option>
                    <option value="Selected" className="bg-neutral-950 text-white">Selected Recommendations</option>
                  </select>

                  {/* Cuisine Category filter */}
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white/5 border border-white/10 rounded-full text-white cursor-pointer focus:border-red-600/50 outline-none"
                    id="cuisine-dropdown-select"
                  >
                    {uniqueCuisinesList.map((cuisine) => (
                      <option key={cuisine} value={cuisine} className="bg-neutral-950 text-white">{cuisine}</option>
                    ))}
                  </select>

                  {/* Price budget level filter */}
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white/5 border border-white/10 rounded-full text-white cursor-pointer focus:border-red-600/50 outline-none"
                    id="price-dropdown-select"
                  >
                    <option value="All Prices" className="bg-neutral-950 text-white">All Budgets ($)</option>
                    <option value="$$$$" className="bg-neutral-950 text-white">$$$$ (Supreme Luxury)</option>
                    <option value="$$$" className="bg-neutral-950 text-white">$$$ (Fine Dining)</option>
                    <option value="$$" className="bg-neutral-950 text-white">$$ (Moderate Bistro)</option>
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
                    className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-widest cursor-pointer ml-auto"
                  >
                    Clear Filter Selections
                  </button>
                )}
              </div>
            </div>

            {/* Showcase Restaurant Catalog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-baseline mb-5">
                <h3 className="font-serif font-light text-xl text-[#F5F5F5] flex items-center gap-2 uppercase tracking-wider">
                  <Grid className="w-4 h-4 text-white/40" />
                  <span>Zerytounda Catalog</span>
                  <span className="text-[10px] text-white/30 font-mono font-normal ml-1 tracking-widest">({filteredRestaurants.length} EVALUATION{filteredRestaurants.length === 1 ? '' : 'S'})</span>
                </h3>
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="text-center py-24 bg-[#0a0a0a] border border-white/5 rounded-xl p-10 shadow-2xl flex flex-col items-center justify-center">
                  <Award className="w-16 h-16 text-white/20 mb-3.5" />
                  <p className="font-serif italic text-lg text-white/80">No Evaluations Configured</p>
                  <p className="text-xs text-white/40 max-w-sm leading-relaxed mt-1">
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
                    className="mt-6 px-5 py-3 border border-red-600 text-red-600 text-[10px] uppercase tracking-[0.3em] font-bold bg-transparent hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-md"
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

            {/* Category Hero Sliders Showcase */}
            <CategoryHeroSliders 
              onSelectRestaurant={setSelectedRestaurant} 
              savedRestaurantIds={savedRestaurantIds} 
              onToggleSave={(id, e) => {
                e.stopPropagation();
                handleToggleSaveRestaurant(id);
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
            <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 mb-8 border-b border-white/5 pb-4">
              <div>
                <h2 className="font-serif font-light text-3xl text-white flex items-center gap-2">
                  <Heart className="w-8 h-8 text-red-500 fill-current" />
                  <span>My Saved Guides</span>
                </h2>
                <p className="text-xs text-white/40 mt-1 tracking-wide">Quick listing of Zaytouynda properties marked for your notebook.</p>
              </div>
              <button
                onClick={() => setActiveTab('my-guide')}
                className="flex items-center gap-2 px-4 py-2 bg-transparent border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sequence into Travel Itinerary</span>
              </button>
            </div>

            {savedRestaurantIds.length === 0 ? (
              <div className="text-center py-20 bg-[#0a0a0a] border border-white/5 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
                <Heart className="w-16 h-16 text-white/10 mb-3" />
                <p className="font-serif italic text-lg text-white/85">No Selections Saved</p>
                <p className="text-xs text-white/40 mt-1 max-w-sm leading-relaxed">
                  You haven't notebooked a gastronomy spot yet. Touch the heart button on restaurant cards to collect.
                </p>
                <button
                  onClick={() => setActiveTab('discovery')}
                  className="mt-6 px-5 py-3 border border-red-600 text-red-600 text-[10px] uppercase tracking-[0.3em] font-bold bg-transparent hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  Browse Culinary Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {RESTAURANTS.filter(r => savedRestaurantIds.includes(r.id)).map((restaurant) => (
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
            <div className="mt-12 bg-[#0a0a0a] border border-white/5 rounded-xl p-6 md:p-8 text-left h-auto shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-4 mb-5">
                <div>
                  <h3 className="font-serif font-light text-xl text-white flex items-center gap-2 uppercase tracking-wide">
                    <Calendar className="w-5.5 h-5.5 text-red-600" />
                    <span>Active Bookings Dashboard</span>
                  </h3>
                  <p className="text-xs text-white/40 mt-0.5">Summary of tables requested through the Gourmet Booking Desk.</p>
                </div>

                {bookings.length > 0 && (
                  <button
                    onClick={handleClearAllBookings}
                    className="text-[10px] text-white/40 hover:text-red-500 font-mono uppercase tracking-widest cursor-pointer select-none"
                  >
                    Clear Booking Records
                  </button>
                )}
              </div>

              {bookings.length === 0 ? (
                <div className="py-8 font-serif italic text-white/40 text-center text-sm">
                  No allocation bookings initiated yet. Book from a restaurant's detail report modal first.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookings.map((book) => (
                    <div 
                      key={book.id} 
                      className="p-4.5 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-[8px] font-mono uppercase bg-red-600/10 text-red-400 border border-red-500/20 font-bold px-1.5 py-0.5 rounded tracking-wider">
                          ALLOCATED TICKET
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#F5F5F5] mt-1.5">
                          {book.restaurantName}
                        </h4>
                        <p className="text-[10px] text-white/60 mt-0.5">
                          Date: {book.date} • {book.time}
                        </p>
                        <p className="text-[10px] text-white/40 truncate mt-0.5">
                          Party: {book.guestsCount} Guest{book.guestsCount > 1 ? 's' : ''} • {book.userName}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-mono text-white/30 uppercase font-bold block mb-1 tracking-wider">Status</span>
                        <span className="text-[9px] uppercase font-bold text-[#F5F5F5] bg-red-600 px-2.5 py-1 rounded inline-block font-mono tracking-widest">
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

      </main>

      {/* FOOTER */}
      <footer className="h-16 bg-black border-t border-white/5 flex items-center justify-between px-10 text-[9px] uppercase tracking-[0.2em] text-white/30 shrink-0 select-none mt-auto">
        <div>© 2026 ZAYTOUYNDA GUIDE DIGITAL</div>
        <div className="flex gap-8">
          <span onClick={() => setActiveTab('get-started')} className="hover:text-[#F5F5F5] transition-colors cursor-pointer">Privacy Policy</span>
          <span onClick={() => setActiveTab('get-started')} className="hover:text-[#F5F5F5] transition-colors cursor-pointer">Cookies Manager</span>
          <span onClick={() => setActiveTab('get-started')} className="hover:text-[#F5F5F5] transition-colors cursor-pointer">FAQ & Partners</span>
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
        savedRestaurants={RESTAURANTS.filter(r => savedRestaurantIds.includes(r.id)).map(r => ({
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

import { Search, Compass, MapPin, BookOpen, Heart, Sparkles, Navigation, Info, Gift, Music, Calendar, Coffee, Flame, Store, X, Grid } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onOpenConcierge: () => void;
  savedCount: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  onOpenConcierge,
  savedCount
}: HeaderProps) {
  const cities = ['All Cities', 'Beirut', 'Byblos', 'Batroun', 'Tripoli'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 text-neutral-900 shadow-sm animate-fade-in">
      {/* Top Brand Bar with Yellow & Green theme accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo and Brand redesigned as requested */}
        <div 
          onClick={() => setActiveTab('discovery')} 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          id="zaytouynda-logo-btn"
        >
          {/* Olive Logo Icon Block */}
          <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-emerald-800 to-emerald-650 text-white rounded-xl shadow-md transition-all duration-300 group-hover:scale-105">
            <span className="font-serif font-black text-2xl tracking-tighter text-amber-350">Z</span>
            <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-amber-400 rounded-full border border-neutral-950 flex items-center justify-center shadow">
              <span className="text-[10px] text-emerald-950 font-bold leading-none">✻</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif tracking-widest text-emerald-800 font-bold uppercase text-xl">Zaytouynda <span className="text-amber-550 font-light">Guide</span></span>
            </div>
            <p className="text-[10px] font-mono text-emerald-600/80 tracking-widest uppercase font-bold">Culinary Excellence</p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* AI Gourmet Concierge Call To Action wrapped in yellow & green colors */}
          <button
            onClick={onOpenConcierge}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-emerald-850 from-emerald-800 to-emerald-650 border border-amber-400/30 text-white font-medium text-sm rounded-full shadow-md hover:shadow-lg hover:from-emerald-900 hover:to-emerald-700 transition-all duration-300 cursor-pointer"
            id="ai-concierge-trigger"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
            <span className="tracking-wide">AI Gourmet Concierge</span>
          </button>

          {/* Saved Guides Count */}
          <button
            onClick={() => setActiveTab('saved')}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                : 'bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 border-emerald-200/60 shadow-xs'
            }`}
            id="saved-guide-btn"
          >
            <Heart className={`w-4 h-4 ${activeTab === 'saved' || savedCount > 0 ? 'fill-amber-400 text-amber-400' : 'text-emerald-700'}`} />
            <span className="hidden md:inline font-semibold">My Saved</span>
            {savedCount > 0 && (
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold font-mono ${activeTab === 'saved' ? 'bg-amber-400 text-emerald-900' : 'bg-emerald-800 text-white'}`}>
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Primary Navigation & Interactive Filters */}
      <div className="bg-emerald-50/20 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 py-3">
          {/* Primary View Selector Tabs */}
          <nav className="flex space-x-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none flex-1 max-w-full" aria-label="Tabs">
            <button
              id="tab-discovery"
              onClick={() => setActiveTab('discovery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'discovery'
                  ? 'bg-emerald-750 bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Restaurants</span>
            </button>

            {/* DEDICATED NEW TAB: ZAYTOUYNDA CATALOGUE (Moved from homepage as requested) */}
            <button
              id="tab-catalogue"
              onClick={() => {
                setActiveTab('discovery');
                setTimeout(() => {
                  const el = document.getElementById('lebanese-hero-sliders');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer text-emerald-800 hover:text-neutral-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/40`}
            >
              <Grid className="w-3.5 h-3.5 text-emerald-850 font-black" />
              <span>Zaytouynda Catalogue</span>
            </button>

            <button
              id="tab-pubs-cafes"
              onClick={() => setActiveTab('pubs-cafes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'pubs-cafes'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-emerald-950 hover:text-emerald-950 hover:bg-emerald-105/50 hover:bg-emerald-100/60'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-550" />
              <span>Pubs & Cafes</span>
            </button>

            <button
              id="tab-vibes"
              onClick={() => setActiveTab('vibes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'vibes'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-emerald-950 hover:text-emerald-950 hover:bg-emerald-100/60'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Lebanese Vibes</span>
            </button>

            <button
              id="tab-takeaways-bakeries"
              onClick={() => setActiveTab('takeaways-bakeries')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'takeaways-bakeries'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-emerald-955 hover:text-emerald-950 hover:bg-emerald-100/60'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bakeries & Produce</span>
            </button>

            <button
              id="tab-curation-explorer"
              onClick={() => setActiveTab('curation-explorer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'curation-explorer'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-emerald-955 hover:text-emerald-950 hover:bg-emerald-100/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Curation Guide</span>
            </button>

            <button
              id="tab-map"
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-emerald-955 hover:text-emerald-950 hover:bg-emerald-100/60'
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-neutral-500" />
              <span>Gastronomic Map</span>
            </button>

            <button
              id="tab-plan-dining"
              onClick={() => setActiveTab('plan-dining')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'plan-dining'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold border border-emerald-600/35'
                  : 'text-emerald-955 hover:text-emerald-950 hover:bg-emerald-100/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Plan My Dining</span>
            </button>

            <button
              id="tab-gift-cards"
              onClick={() => setActiveTab('gift-cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'gift-cards'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-emerald-955 hover:text-emerald-950 hover:bg-emerald-100/60'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>Gift Vouchers</span>
            </button>

            <button
              id="tab-live-shows"
              onClick={() => setActiveTab('live-shows')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'live-shows'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-emerald-955 hover:text-emerald-955 hover:bg-emerald-100/60'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-emerald-800" />
              <span>Live Shows</span>
            </button>

            <button
              id="tab-magazine"
              onClick={() => setActiveTab('magazine')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'magazine'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-emerald-955 hover:text-emerald-950 hover:bg-emerald-100/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
              <span>Editorial Magazine</span>
            </button>

            <button
              id="tab-my-guide"
              onClick={() => setActiveTab('my-guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'my-guide'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'text-emerald-955 hover:text-emerald-955 hover:bg-emerald-100/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-550" />
              <span>Itineraries</span>
            </button>

            <button
              id="tab-get-started"
              onClick={() => setActiveTab('get-started')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'get-started'
                  ? 'bg-gradient-to-r from-emerald-800 to-amber-500 text-emerald-950 font-bold border border-amber-300'
                  : 'text-emerald-800 hover:text-emerald-900 hover:bg-emerald-100/60 font-medium'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Get Started</span>
            </button>
          </nav>

          {/* Quick Filter Controls for Discovery and Map tab in Emerald and Gold theme */}
          {(activeTab === 'discovery' || activeTab === 'map') && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              {/* City Filter */}
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="pl-9 pr-8 py-2 w-full sm:w-40 text-xs bg-white border border-emerald-200 rounded-full text-emerald-950 shadow-sm focus:outline-none focus:border-emerald-600 cursor-pointer appearance-none"
                  id="city-filter-select"
                >
                  {cities.map((city) => (
                    <option key={city} value={city} className="bg-white text-neutral-900">
                      {city === 'All Cities' ? 'All Lebanon' : city}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
                  <span className="text-[9px]">▼</span>
                </div>
              </div>

              {/* Text Search Input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cuisine, chef, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-10 py-2 w-full text-xs bg-white border border-emerald-200 rounded-full text-emerald-950 placeholder-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all duration-300 origin-center shadow-sm"
                  id="restaurant-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-all cursor-pointer flex items-center justify-center"
                    title="Clear search"
                    id="clear-search-button"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

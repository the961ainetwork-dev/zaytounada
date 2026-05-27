import { Search, Compass, MapPin, BookOpen, Heart, Sparkles, Navigation, Info, Gift, Music, Calendar, Coffee, Flame, Store, X } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={() => setActiveTab('discovery')} 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          id="zaytouynda-logo-btn"
        >
          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-11 h-11 bg-red-600 text-white rounded-xl shadow-md transition-colors">
            <span className="font-serif font-black text-2xl tracking-tighter">Z</span>
            <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-amber-400 rounded-full border border-neutral-950 flex items-center justify-center">
              <span className="text-[10px] text-neutral-950 font-bold leading-none">✻</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif tracking-widest text-red-600 font-bold uppercase text-xl">Zaytouynda <span className="text-white/90 font-light">Guide</span></span>
            </div>
            <p className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Culinary Excellence</p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* AI Gourmet Concierge Call To Action */}
          <button
            onClick={onOpenConcierge}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-medium text-sm rounded-full shadow hover:opacity-95 hover:shadow-lg transition-all duration-300 cursor-pointer"
            id="ai-concierge-trigger"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-amber-200" />
            <span>AI Gourmet Concierge</span>
          </button>

          {/* Saved Guides Count */}
          <button
            onClick={() => setActiveTab('saved')}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white/5 hover:bg-white/10 text-white/85 border-white/15'
            }`}
            id="saved-guide-btn"
          >
            <Heart className={`w-4 h-4 ${activeTab === 'saved' || savedCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="hidden md:inline font-medium">My Saved</span>
            {savedCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 bg-white text-red-600 rounded-full text-xs font-bold font-mono">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Primary Navigation & Interactive Filters */}
      <div className="bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 py-3">
          {/* Primary View Selector Tabs */}
          <nav className="flex space-x-1 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none flex-1 max-w-full" aria-label="Tabs">
            <button
              id="tab-discovery"
              onClick={() => setActiveTab('discovery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'discovery'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Restaurants</span>
            </button>

            <button
              id="tab-pubs-cafes"
              onClick={() => setActiveTab('pubs-cafes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'pubs-cafes'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-500" />
              <span>Pubs & Cafes</span>
            </button>

            <button
              id="tab-vibes"
              onClick={() => setActiveTab('vibes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'vibes'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>Lebanese Vibes</span>
            </button>

            <button
              id="tab-takeaways-bakeries"
              onClick={() => setActiveTab('takeaways-bakeries')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'takeaways-bakeries'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-emerald-500" />
              <span>Bakeries & Produce</span>
            </button>

            <button
              id="tab-curation-explorer"
              onClick={() => setActiveTab('curation-explorer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'curation-explorer'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Curation Guide</span>
            </button>

            <button
              id="tab-map"
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Gastronomic Map</span>
            </button>

            <button
              id="tab-plan-dining"
              onClick={() => setActiveTab('plan-dining')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'plan-dining'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-red-500/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>Plan My Dining</span>
            </button>

            <button
              id="tab-gift-cards"
              onClick={() => setActiveTab('gift-cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'gift-cards'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-orange-400" />
              <span>Gift Vouchers</span>
            </button>

            <button
              id="tab-live-shows"
              onClick={() => setActiveTab('live-shows')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'live-shows'
                  ? 'bg-red-600 text-white shadow-sm font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-pink-400" />
              <span>Live Shows</span>
            </button>

            <button
              id="tab-magazine"
              onClick={() => setActiveTab('magazine')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'magazine'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Editorial Magazine</span>
            </button>

            <button
              id="tab-my-guide"
              onClick={() => setActiveTab('my-guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'my-guide'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Culinary Itineraries</span>
            </button>

            <button
              id="tab-get-started"
              onClick={() => setActiveTab('get-started')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'get-started'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-sm font-semibold'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-white/5 font-medium'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Get Started</span>
            </button>
          </nav>

          {/* Quick Filter Controls for Discovery and Map tab */}
          {(activeTab === 'discovery' || activeTab === 'map') && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              {/* City Filter */}
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="pl-9 pr-8 py-2 w-full sm:w-40 text-xs bg-white/5 border border-white/10 rounded-full text-white shadow focus:outline-none focus:border-red-600/50 cursor-pointer appearance-none"
                  id="city-filter-select"
                >
                  {cities.map((city) => (
                    <option key={city} value={city} className="bg-neutral-950 text-white">
                      {city === 'All Cities' ? 'All Lebanon' : city}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                  <span className="text-[9px]">▼</span>
                </div>
              </div>

              {/* Text Search Input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cuisine, chef, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-10 py-2 w-full text-xs bg-white/5 border border-white/10 rounded-full text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 focus:bg-amber-950/15 focus:scale-[1.02] focus:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all duration-300 origin-center"
                  id="restaurant-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-1.5 rounded-full hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center"
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

import React from 'react';
import { Restaurant } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import { 
  Coffee, 
  Flame, 
  Store, 
  MapPin, 
  Eye, 
  ArrowRight, 
  Heart, 
  UtensilsCrossed, 
  Leaf, 
  Moon, 
  Music, 
  Crown, 
  Sparkles,
  Star,
  Award,
  ChevronRight,
  Compass
} from 'lucide-react';

interface CategoryHeroSlidersProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  savedRestaurantIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onFilterCuisine?: (cuisine: string) => void;
}

export default function CategoryHeroSliders({
  onSelectRestaurant,
  savedRestaurantIds,
  onToggleSave,
  onFilterCuisine
}: CategoryHeroSlidersProps) {
  
  // Categorized Datasets
  
  // Section 1: Cuisines (calculated dynamically or static clean presentation)
  const cuisineCategories = [
    { name: 'Traditional Lebanese Haute Cuisine', count: RESTAURANTS.filter(r => r.cuisine.includes('Traditional Lebanese Haute')).length, image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=400', desc: 'Opulent multi-course sequential feasts' },
    { name: 'Polished Contemporary Lebanese', count: RESTAURANTS.filter(r => r.cuisine.includes('Contemporary')).length, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400', desc: 'Light, enlightened palace interpretations' },
    { name: 'Coastal Seafood & Coastal Grill', count: RESTAURANTS.filter(r => r.cuisine.includes('Seafood') || r.cuisine.includes('Coastal')).length, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=400', desc: 'Fresh Mediterranean catch and sunset docks' },
    { name: 'Progressive Mediterranean / Charcoal', count: RESTAURANTS.filter(r => r.cuisine.includes('Progressive') || r.cuisine.includes('Charcoal')).length, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400', desc: 'High-heat wood charcoal coal-bistronomy' },
    { name: 'Armenian-Lebanese Homestyle', count: RESTAURANTS.filter(r => r.cuisine.includes('Armenian')).length, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400', desc: 'Spiced boat dumplings & comforting heritage' },
    { name: 'Traditional Bakeries, Sweets & Manousheh', count: RESTAURANTS.filter(r => r.cuisine.toLowerCase().includes('bakery') || r.cuisine.toLowerCase().includes('sweets') || r.cuisine.toLowerCase().includes('street')).length, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400', desc: 'Ancestral knafehs and slow fermented manoushehs' },
  ];

  // Section 2: Price for Value (Affordable Comfort, Veggie Highlights & Bib Gourmand)
  const priceForValue = RESTAURANTS.filter(r => 
    r.priceRange === '$' || 
    r.priceRange === '$$' || 
    r.distinction === 'BIB_GOURMAND' ||
    r.features.some(f => f.toLowerCase().includes('veg') || f.toLowerCase().includes('affordable'))
  );

  // Section 3: Clubs & Cafes
  const clubsAndCafes = RESTAURANTS.filter(r => 
    r.category === 'pub_cafe' || 
    r.cuisine.toLowerCase().includes('coffee') || 
    r.cuisine.toLowerCase().includes('tea') || 
    r.cuisine.toLowerCase().includes('pub')
  );

  // Section 4: Nightlife & Entertainment
  const nightlifeAndEntertainment = RESTAURANTS.filter(r => 
    r.category === 'vibe' || 
    r.cuisine.toLowerCase().includes('underground') || 
    r.cuisine.toLowerCase().includes('cabaret') || 
    r.features.some(f => f.toLowerCase().includes('skyline') || f.toLowerCase().includes('party') || f.toLowerCase().includes('dj'))
  );

  // Section 5: Bakeries & Street-Food Takeaways
  const bakeries = RESTAURANTS.filter(r => 
    r.cuisine.toLowerCase().includes('bakery') || 
    r.cuisine.toLowerCase().includes('bakeries') || 
    r.cuisine.toLowerCase().includes('sweets') || 
    r.cuisine.toLowerCase().includes('manousheh') || 
    r.id === 'rest-20' || // Al Hallab 1881
    r.id === 'rest-18'    // Furn Beaino
  );

  // Section 6: Traditional Cuisine & Heritage Cafe
  const traditionalCuisineAndCafe = RESTAURANTS.filter(r => 
    r.cuisine.toLowerCase().includes('traditional') || 
    r.cuisine.toLowerCase().includes('homestyle') || 
    r.cuisine.toLowerCase().includes('levantine grill') || 
    r.cuisine.toLowerCase().includes('rural kitchen') || 
    r.id === 'rest-1' || // Em Sherif
    r.id === 'rest-2' || // Liza
    r.id === 'rest-22'   // Abou Abdallah
  );

  // Section 7: Live Shows & Tarab Concerts
  const liveShows = RESTAURANTS.filter(r => 
    r.features.some(f => f.toLowerCase().includes('live ') || f.toLowerCase().includes('concert')) ||
    r.description.toLowerCase().includes('live traditional') ||
    r.description.toLowerCase().includes('live music') ||
    r.description.toLowerCase().includes('variety show') ||
    r.id === 'rest-16' // MusicHall
  );

  // Category Intersection Observer active element tracker 
  const [activeMenuSection, setActiveMenuSection] = React.useState<string>('section-1-cuisines');

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveMenuSection(entry.target.id);
        }
      });
    }, {
      rootMargin: '-10% 0px -70% 0px' // Detect which section is highlighted in the active scanning viewport
    });

    const ids = [
      'section-1-cuisines',
      'section-2-price-value',
      'section-3-clubs-cafes',
      'section-4-nightlife',
      'section-5-bakeries',
      'section-6-traditional',
      'section-7-liveshows'
    ];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const navItems = [
    { id: 'section-1-cuisines', label: 'Culinary Cuisines', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'section-2-price-value', label: 'Price & Veggie', icon: <Leaf className="w-4 h-4" /> },
    { id: 'section-3-clubs-cafes', label: 'Clubs & Cafes', icon: <Coffee className="w-4 h-4" /> },
    { id: 'section-4-nightlife', label: 'Nightlife & Vibes', icon: <Moon className="w-4 h-4" /> },
    { id: 'section-5-bakeries', label: 'Bakeries & Sweets', icon: <Store className="w-4 h-4" /> },
    { id: 'section-6-traditional', label: 'Heritage Elite', icon: <Crown className="w-4 h-4" /> },
    { id: 'section-7-liveshows', label: 'Live Concerts', icon: <Music className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-16 py-8 bg-neutral-50/50" id="lebanese-hero-sliders">
      
      {/* SECTION MAIN DESCRIPTIVE BLOCK */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-3" id="sliders-main-headline">
        <span className="text-[9px] font-mono uppercase text-emerald-800 font-extrabold tracking-[0.4em] block">THE CURATED ROADMAPS</span>
        <h2 className="font-serif font-light text-4xl text-neutral-900 uppercase tracking-wider">
          Inspectors <span className="font-bold text-emerald-800">Specialized Curation</span>
        </h2>
        <p className="text-sm text-neutral-500 font-light max-w-3xl leading-relaxed">
          Embark on highly specialized gastronomical expeditions. Slide through seven distinct categories, meticulously vetted by anonymous Zaytounada tasters. Each catalog layout is tailored to tell the unique story of the food style inside.
        </p>
      </div>

      {/* STICKY CATEGORIES NAVIGATION BAR */}
      <div className="sticky top-[124px] sm:top-[128px] z-30 w-full bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold tracking-widest hidden lg:inline shrink-0">
              Expedition Index:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none w-full justify-start lg:justify-end">
              {navItems.map((item) => {
                const isActive = activeMenuSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      const el = document.getElementById(item.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-emerald-50/45 text-emerald-900 border-emerald-100/60 hover:bg-emerald-100 hover:text-emerald-950'
                    }`}
                  >
                    <span className={isActive ? 'text-amber-300' : 'text-emerald-700'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: CUISINE CATEGORIES (Direct Visual Grid Selector Interface)
          ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-[190px]" id="section-1-cuisines">
        <div className="border-b border-emerald-100 pb-3.5 mb-6 flex justify-between items-end">
          <div className="space-y-1 text-left">
            <h3 className="font-serif font-light text-2xl text-neutral-900 flex items-center gap-2.5 uppercase tracking-wider">
              <UtensilsCrossed className="w-5.5 h-5.5 text-emerald-800" />
              <span>Section 1: Culinary Cuisine Categories</span>
              <span className="text-[10px] text-neutral-400 font-mono font-normal tracking-widest ml-1">(DIRECT FILTER ACCESS)</span>
            </h3>
            <p className="text-xs text-neutral-500 font-light italic">Immediate pathways to specialized and regional authentic culinary dialects.</p>
          </div>
        </div>
        
        {/* Visual Cuisines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5" id="cuisines-visual-grid">
          {cuisineCategories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => onFilterCuisine && onFilterCuisine(cat.name)}
              className="relative rounded-2xl overflow-hidden h-28 group cursor-pointer border border-emerald-100 shadow-xs hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent transition-all group-hover:via-black/35" />
              
              <div className="absolute inset-0 p-4.5 flex flex-col justify-between text-left">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] tracking-widest bg-emerald-900/90 text-amber-300 border border-emerald-850 px-2 py-0.5 rounded-sm font-mono uppercase font-black shadow-xs">
                    {cat.count} curated spot{cat.count !== 1 ? 's' : ''}
                  </span>
                  <Sparkles className="w-4 h-4 text-white/30 group-hover:text-amber-300 transition-colors" />
                </div>
                <div>
                  <h4 className="text-white font-serif font-bold text-sm tracking-wide leading-snug group-hover:text-amber-200 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-neutral-300 text-[10px] leading-none truncate font-light mt-1">{cat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: PRICE FOR VALUE & VEGGIE HIGHLIGHTS (Bento Meadow Grid)
          ===================================================================== */}
      <div className="bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/10 py-12 scroll-mt-[190px]" id="section-2-price-value">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="border-b border-emerald-100 pb-3.5 flex justify-between items-end">
            <div className="space-y-1 text-left">
              <h3 className="font-serif font-light text-2xl text-neutral-900 flex items-center gap-2.5 uppercase tracking-wider">
                <Leaf className="w-5.5 h-5.5 text-emerald-700" />
                <span>Section 2: Budgets, Bibs & Garden Highlights</span>
                <span className="text-[10px] text-emerald-800 font-mono font-bold tracking-widest ml-1">({priceForValue.length} REVIEWS)</span>
              </h3>
              <p className="text-xs text-neutral-500 font-light italic">Incredible organic charcoal fire mezze, Bib Gourmand value rosettes, and clever saving menus.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="section-2-bento-grid">
            {priceForValue.map((m) => {
              const isSaved = savedRestaurantIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectRestaurant(m)}
                  className="bg-white border border-emerald-100 hover:border-emerald-300/80 rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between border-l-4 border-l-emerald-600"
                >
                  <div className="relative h-48 overflow-hidden bg-emerald-50/50">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                    {/* Left Rank Tag */}
                    <div className="absolute top-3.5 left-3.5 text-[8.5px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-md bg-emerald-950 border border-emerald-800 text-white flex items-center gap-1 select-none">
                      {m.distinction === 'BIB_GOURMAND' ? (
                        <>
                          <span className="text-amber-400 font-serif font-black">☺</span>
                          <span className="text-amber-300">Bib Gourmand</span>
                        </>
                      ) : (
                        <>
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>Value Select</span>
                        </>
                      )}
                    </div>

                    {/* Bookmark */}
                    <button
                      onClick={(e) => onToggleSave(m.id, e)}
                      className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/50 text-white/95 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    
                    <div className="absolute bottom-3 left-4 text-[10px] font-mono text-white/90 bg-black/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{m.city}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-100/60 font-black px-2 py-0.5 rounded">
                        {m.priceRange} Budget Range
                      </span>
                      <h4 className="font-serif font-bold text-lg text-neutral-900 group-hover:text-emerald-700 transition-colors leading-tight pt-1">
                        {m.name}
                      </h4>
                      <p className="text-[9px] font-mono text-neutral-500 font-semibold tracking-wider">{m.cuisine}</p>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-2">
                        {m.description}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-emerald-750 font-bold bg-neutral-50 px-2.5 py-1 rounded border border-neutral-150">
                        {m.stars > 0 ? `${m.stars} Star Vetted` : 'Representative Quality'}
                      </span>
                      <span className="text-emerald-700 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <span>Inspector Analysis</span>
                        <Eye className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 3: CLUBS & SPECIALTY CAFES (Landscape Craft Split Sliders)
          ===================================================================== */}
      <div className="bg-gradient-to-br from-amber-50/15 via-white to-amber-50/5 py-12 border-b border-amber-100/30 scroll-mt-[190px]" id="section-3-clubs-cafes">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="border-b border-amber-200/60 pb-3.5 flex justify-between items-end">
            <div className="space-y-1 text-left">
              <h3 className="font-serif font-light text-2xl text-neutral-900 flex items-center gap-2.5 uppercase tracking-wider">
                <Coffee className="w-5.5 h-5.5 text-amber-600" />
                <span>Section 3: Cozy Clubs & Specialty Beach Cafes</span>
                <span className="text-[10px] text-amber-700 font-mono font-bold tracking-widest ml-1">({clubsAndCafes.length} REVIEWS)</span>
              </h3>
              <p className="text-xs text-neutral-500 font-light italic">Artisanal book corners, beachside roasteries, traditional garden teas, and intellectual Beirut hubs.</p>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-amber-700 uppercase">
              <span>Swipe Craft Row</span>
              <ArrowRight className="w-3 w-3 text-amber-500 animate-pulse" />
            </div>
          </div>

          <div 
            className="flex gap-6 overflow-x-auto pb-5 scrollbar-thin scrollbar-thumb-amber-250 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0"
            id="section-3-clubs-cafes-track"
          >
            {clubsAndCafes.map((m) => {
              const isSaved = savedRestaurantIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectRestaurant(m)}
                  className="w-[28rem] sm:w-[32rem] shrink-0 bg-white border border-amber-100 hover:border-amber-350 rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-xs hover:shadow-md flex flex-col sm:flex-row text-left"
                >
                  {/* Left Imagery half */}
                  <div className="w-full sm:w-1/2 h-44 sm:h-auto overflow-hidden relative shrink-0 bg-amber-50">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-750"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent h-12" />
                    
                    <button
                      onClick={(e) => onToggleSave(m.id, e)}
                      className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/60 text-white hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-4 text-[10px] font-mono text-white/90">
                      <span>{m.city}</span>
                    </div>
                  </div>

                  {/* Right Description half */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono uppercase bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded tracking-wider">
                        Cafe Culture
                      </span>
                      <h4 className="font-serif font-bold text-base text-neutral-950 group-hover:text-amber-800 transition-colors leading-tight pt-1">
                        {m.name}
                      </h4>
                      <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">{m.cuisine}</p>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-3">
                        {m.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-amber-50 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-amber-850 font-medium">{m.priceRange} Range</span>
                      <span className="text-amber-600 font-bold uppercase tracking-widest flex items-center gap-1">
                        <span>Details ↗</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 4: NIGHTLIFE & LATE ATMOSPHERES (Midnight Cyber Glow Slider)
          ===================================================================== */}
      <div className="bg-neutral-950 py-12 text-white scroll-mt-[190px] border-y border-neutral-900" id="section-4-nightlife">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="border-b border-neutral-800 pb-3.5 flex justify-between items-end">
            <div className="space-y-1 text-left">
              <h3 className="font-serif font-light text-2xl text-white flex items-center gap-2.5 uppercase tracking-wider">
                <Moon className="w-5.5 h-5.5 text-indigo-400 animate-pulse" />
                <span className="tracking-wide">Section 4: Midnight Skyline Bars & Vibrancies</span>
                <span className="text-[10px] text-indigo-300 font-mono font-bold tracking-widest ml-1">({nightlifeAndEntertainment.length} PASSES)</span>
              </h3>
              <p className="text-xs text-neutral-400 font-light italic">Dynamic sea cliff fires, architectural retractable club shrines, and sky-high craft mixology lounges.</p>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-indigo-300 uppercase">
              <span>Swipe late club row</span>
              <ArrowRight className="w-3 w-3 text-indigo-400" />
            </div>
          </div>

          <div 
            className="flex gap-6 overflow-x-auto pb-5 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0"
            id="section-4-nightlife-track"
          >
            {nightlifeAndEntertainment.map((m) => {
              const isSaved = savedRestaurantIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectRestaurant(m)}
                  className="w-76 sm:w-80 shrink-0 bg-neutral-900 border border-neutral-800 hover:border-amber-400/50 rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-2xl flex flex-col justify-between hover:translate-y-[-4px]"
                >
                  <div className="relative h-44 overflow-hidden bg-neutral-950">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />

                    <button
                      onClick={(e) => onToggleSave(m.id, e)}
                      className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/60 text-white/90 hover:text-amber-300 transition-colors cursor-pointer border border-white/5"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-4 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800">
                      <MapPin className="w-3 h-3 text-amber-300" />
                      <span>{m.city}</span>
                    </div>
                  </div>

                  <div className="p-4.5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded font-mono font-black uppercase shadow-sm">
                          HIGH VIBE SELECT
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">{m.priceRange}</span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors leading-tight pt-1">
                        {m.name}
                      </h4>
                      <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">{m.cuisine}</p>
                      <p className="text-xs text-neutral-350 font-light leading-relaxed line-clamp-2">
                        {m.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-amber-400/80 font-semibold">Active late till 4:00 AM</span>
                      <span className="text-amber-300 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <span>ENTRANCE DOSSIER</span>
                        <Eye className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 5: BAKERIES & TRADITIONAL TAKEAWAYS (Cozy Artisanal Wheat Seals)
          ===================================================================== */}
      <div className="bg-gradient-to-br from-amber-50/10 via-white to-orange-50/10 py-12 border-b border-amber-100/30 scroll-mt-[190px]" id="section-5-bakeries">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="border-b border-amber-200/50 pb-3.5 flex justify-between items-end">
            <div className="space-y-1 text-left">
              <h3 className="font-serif font-light text-2xl text-neutral-900 flex items-center gap-2.5 uppercase tracking-wider">
                <Store className="w-5.5 h-5.5 text-amber-700 animate-spin-slow" />
                <span>Section 5: Traditional Flour Bakeries & Pastry Shrines</span>
                <span className="text-[10px] text-amber-800 font-mono font-bold tracking-widest ml-1">({bakeries.length} WRAPS)</span>
              </h3>
              <p className="text-xs text-neutral-500 font-light italic">Fiery clay bakeries, crispy stone-baked meat Lahme bajins, and Tripoli rose-water clotted cheese knafehs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="section-5-bakery-column">
            {bakeries.map((m) => {
              const isSaved = savedRestaurantIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectRestaurant(m)}
                  className="bg-white border-2 border-dashed border-neutral-200 hover:border-amber-300 rounded-2xl p-5 transition-all duration-300 group cursor-pointer shadow-xs hover:shadow-md flex items-start gap-4"
                >
                  {/* Round oven seal cropped portrait image on left */}
                  <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 bg-neutral-100 border-2 border-amber-400/40 relative">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/30 h-6 flex items-center justify-center">
                      <span className="text-[6px] text-white font-mono uppercase tracking-widest">{m.city}</span>
                    </div>
                  </div>

                  {/* Right detail text */}
                  <div className="flex-1 min-w-0 text-left space-y-2 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[8px] font-mono tracking-widest text-amber-850 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                          Ancestral Recipe
                        </span>
                        <h4 className="font-serif font-bold text-base text-neutral-900 group-hover:text-amber-800 transition-colors leading-tight pt-1">
                          {m.name}
                        </h4>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(m.id, e);
                        }}
                        className="p-1 px-2 rounded-full border border-neutral-100 bg-neutral-50 hover:bg-rose-50 text-neutral-400 hover:text-rose-500 transition-colors"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    <p className="text-[9px] font-mono text-zinc-400 uppercase leading-none">{m.cuisine}</p>
                    <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-2">
                      {m.description}
                    </p>

                    <p className="text-[10px] font-serif italic text-amber-700/80 leading-none pt-1">
                      * Signature Specialty: "{m.signatureDishes[0]}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 6: TRADITIONAL CUISINE & HERITAGE (Royal Cream Slate)
          ===================================================================== */}
      <div className="bg-stone-50 py-14 scroll-mt-[190px] border-y border-neutral-200/60" id="section-6-traditional">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="border-b border-neutral-200 pb-3.5 flex justify-between items-end">
            <div className="space-y-1 text-left">
              <h3 className="font-serif font-light text-2xl text-neutral-900 flex items-center gap-2.5 uppercase tracking-wider">
                <Crown className="w-5.5 h-5.5 text-amber-500 animate-pulse" />
                <span>Section 6: Aristocratic Palaces & Traditional Hegemony</span>
                <span className="text-[10px] text-amber-700 font-mono font-bold tracking-widest ml-1">({traditionalCuisineAndCafe.length} ROYAL SPOTS)</span>
              </h3>
              <p className="text-xs text-neutral-500 font-light italic">Grand historic spaces preserving centuries of Levantine etiquette, sequencing raw kibbeh, and village maternal formulas.</p>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-amber-800 uppercase">
              <span>Imperial Catalog</span>
              <ArrowRight className="w-3 w-3 text-amber-500" />
            </div>
          </div>

          <div 
            className="flex gap-6 overflow-x-auto pb-5 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0"
            id="section-6-traditional-track"
          >
            {traditionalCuisineAndCafe.map((m) => {
              const isSaved = savedRestaurantIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectRestaurant(m)}
                  className="w-76 sm:w-80 shrink-0 bg-white border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between"
                >
                  <div className="relative h-56 overflow-hidden bg-neutral-100">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-750"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Bookmark */}
                    <button
                      onClick={(e) => onToggleSave(m.id, e)}
                      className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/60 text-white hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>

                    {/* Top-Left Stars Badge with Gold accents */}
                    <div className="absolute top-3.5 left-3.5 bg-neutral-950/95 border border-amber-400 p-2 py-1.5 rounded-sm text-left shadow flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[8px] font-mono text-amber-400 uppercase font-black tracking-widest">
                        {m.stars > 0 ? `${m.stars} ZAYTOUNADA STARS` : 'AUTHENTIFIED'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 text-[10px] font-mono text-white tracking-widest uppercase font-semibold flex items-center gap-1 font-serif">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{m.city}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-serif text-amber-700/90 font-bold uppercase tracking-widest">
                        Chef de Cuisine: {m.chef}
                      </span>
                      <h4 className="font-serif font-black text-xl text-neutral-950 group-hover:text-amber-850 transition-colors leading-tight pt-1">
                        {m.name}
                      </h4>
                      <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">{m.cuisine}</p>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-3 italic">
                        "{m.inspectorNote}"
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-neutral-150 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-neutral-700 font-bold">Standard Feasts {m.priceRange}</span>
                      <span className="text-amber-700 font-semibold uppercase tracking-widest flex items-center gap-1 group-hover:underline">
                        <span>Royal Docket</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 7: LIVE SHOWS & MUSIC STAGES (Vaporwave Stage Ticket Stubs)
          ===================================================================== */}
      <div className="bg-gradient-to-tr from-rose-950/10 via-white to-rose-950/5 py-12 scroll-mt-[190px] border-b border-rose-100" id="section-7-liveshows">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="border-b border-rose-200/50 pb-3.5 flex justify-between items-end">
            <div className="space-y-1 text-left">
              <h3 className="font-serif font-light text-2xl text-rose-950 flex items-center gap-2.5 uppercase tracking-wider">
                <Music className="w-5.5 h-5.5 text-rose-600 animate-bounce" />
                <span>Section 7: Legendary Tarab Orchestras & Live Cabarets</span>
                <span className="text-[10px] text-rose-700 font-mono font-bold tracking-widest ml-1">({liveShows.length} TICKETS INCLUDED)</span>
              </h3>
              <p className="text-xs text-neutral-500 font-light italic">Double-bill acoustic performance stages, Beirut music halls, dynamic vocalists, and vibrant beach concert sunsets.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="section-7-tickets-stub-grid">
            {liveShows.map((m) => {
              const isSaved = savedRestaurantIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectRestaurant(m)}
                  className="bg-white border-2 border-dashed border-rose-200/70 hover:border-rose-400 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col sm:flex-row text-left max-w-2xl relative"
                >
                  {/* Left Column of Ticket Stub: Photo */}
                  <div className="w-full sm:w-2/5 h-44 sm:h-auto overflow-hidden relative shrink-0 bg-neutral-100">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(m.id, e);
                      }}
                      className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/60 text-white hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500 border-none' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-4 text-[10px] text-white/95 uppercase tracking-widest font-mono font-black flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{m.city}</span>
                    </div>
                  </div>

                  {/* Coupon perforated stub split separator mock circle holes in CSS */}
                  <div className="hidden sm:block absolute left-[40%] top-0 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-neutral-50 rounded-full border border-rose-200/10 z-10" />
                  <div className="hidden sm:block absolute left-[40%] bottom-0 -translate-x-1/2 translate-y-1/2 w-5 h-5 bg-neutral-50 rounded-full border border-rose-200/10 z-10" />

                  {/* Main Ticket body */}
                  <div className="flex-1 p-5 md:p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-mono tracking-widest text-rose-700 uppercase bg-rose-50 border border-rose-100 px-2 py-0.5 rounded font-black">
                          ADMIT PASS TICKET
                        </span>
                        <span className="text-[9px] text-neutral-400 font-mono">ZAYT-SHOW-{Math.floor(100 + Math.random() * 900)}</span>
                      </div>
                      <h4 className="font-serif font-black text-lg text-neutral-900 group-hover:text-rose-700 transition-colors leading-tight pt-1">
                        {m.name}
                      </h4>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{m.cuisine}</p>
                      <p className="text-xs text-neutral-550 font-light leading-relaxed line-clamp-2">
                        {m.description}
                      </p>
                    </div>

                    {/* Barcode representation */}
                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-rose-100 text-[10px] font-mono select-none">
                      <div>
                        <p className="text-[7.5px] text-neutral-400 uppercase leading-none">Admission Tier</p>
                        <p className="font-bold text-neutral-800 mt-1">{m.priceRange} Premium Seats</p>
                      </div>
                      <div className="text-right shrink-0">
                        {/* simulated mock barcode */}
                        <div className="text-[8px] font-mono tracking-tighter text-neutral-400 select-none pb-0.5 font-black">
                          || | | |||| | || | ||| ||
                        </div>
                        <p className="text-[7px] text-neutral-400 uppercase leading-none tracking-widest font-bold">SECURE SEAT NOW</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

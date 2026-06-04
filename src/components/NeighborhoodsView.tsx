import React, { useState, useMemo } from 'react';
import { Restaurant } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import { MapPin, ArrowLeft, Star, Compass, Table, Eye, DollarSign, Calendar, Heart, Share2, Award, Sparkles, Building, Footprints, Check } from 'lucide-react';

interface NeighborhoodsViewProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  savedRestaurantIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  // Deep-link to selected neighborhood on homepage click
  initialSelectedNeighborhood?: string;
  onViewOnMap?: (neighborhoodId: string, city: string) => void;
  selectedDistinction?: string;
  selectedCuisine?: string;
  selectedPrice?: string;
  searchQuery?: string;
  selectedCity?: string;
}

interface NeighborhoodData {
  id: 'hamra' | 'mar_mikhael' | 'sassine' | 'sodeco' | 'badaro' | 'antelias';
  name: string;
  arabicName: string;
  description: string;
  longHistory: string;
  vibe: string;
  landmarks: string[];
  stats: {
    starred: number;
    bib: number;
    recommended: number;
  };
  bannerUrl: string;
  mapCenter: { lat: number; lng: number };
  localLandmarks: { name: string; x: number; y: number; type: 'monument' | 'institution' | 'geographic' | 'hub' }[];
  localStreets: { name: string; path: string; isMain?: boolean }[];
}

export const NEIGHBORHOODS: NeighborhoodData[] = [
  {
    id: 'hamra',
    name: 'Hamra',
    arabicName: 'الحمراء',
    description: 'The intellectual sanctuary of Beirut, echoing with historic memories of poets, political debate, and cozy independent cafes.',
    longHistory: 'Known as Beirut’s "Champs-Élysées" in the 1960s and 70s, Hamra has been the intellectual and cultural epicenter of the Levant. Surrounding the prestigious American University of Beirut (AUB), it contains historic theaters, printing presses, and legendary cafes where generations of writers and thinkers gathered to draft history.',
    vibe: 'Bustling, vibrant, intellectual, nostalgic, with active bookstores, legendary bars, and excellent late-night street food stalls.',
    landmarks: ['AUB Main Campus & Archaeological Museum', 'Piccadilly Theatre', 'Mahatma Gandhi Street', 'Bliss Street student promenade'],
    stats: { starred: 0, bib: 0, recommended: 2 },
    bannerUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=1200',
    mapCenter: { lat: 33.8962, lng: 35.4820 },
    localLandmarks: [
      { name: 'AUB Main Gate', x: 50, y: 15, type: 'institution' },
      { name: 'Piccadilly Theatre', x: 25, y: 65, type: 'monument' },
      { name: 'Horseshoe Café', x: 65, y: 55, type: 'hub' },
      { name: 'Hamra Square', x: 80, y: 45, type: 'hub' }
    ],
    localStreets: [
      { name: 'Bliss Street', path: 'M 10 15 L 90 15', isMain: true },
      { name: 'Hamra Main Street', path: 'M 10 50 L 90 50', isMain: true },
      { name: 'Mahatma Gandhi Street', path: 'M 35 15 L 35 90' },
      { name: 'Jeanne d\'Arc Street', path: 'M 65 15 L 65 90' }
    ]
  },
  {
    id: 'mar_mikhael',
    name: 'Mar Mikhael',
    arabicName: 'مار ميخائيل',
    description: 'The artistic industrial powerhouse of Beirut, where historic train tracks meet creative gastronic ateliers and booming canvas wall art.',
    longHistory: 'Once an industrial cargo sector centered around the old Charles Helou Train Station, Mar Mikhael has transformed into Beirut’s premier arts and design capital. Restored high-ceilinged houses, old workshops, and train tracks now house contemporary design houses, bustling bistros, and progressive galleries.',
    vibe: 'Hipster, hipster-chic, industrial, hyper-creative, with experimental cocktails, ingredients-first bistros, and lively street life.',
    landmarks: ['Historic Train Station Yards', 'Pharaon Street design district', 'Saint Michel Church', 'Gemmayze main strip connection'],
    stats: { starred: 1, bib: 2, recommended: 5 },
    bannerUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1200',
    mapCenter: { lat: 33.8972, lng: 35.5264 },
    localLandmarks: [
      { name: 'Historic Trainyard Depot', x: 75, y: 30, type: 'geographic' },
      { name: 'Saint Michel Church', x: 45, y: 65, type: 'monument' },
      { name: 'Electricité du Liban', x: 20, y: 45, type: 'institution' },
      { name: 'Pharaon Corner', x: 58, y: 40, type: 'hub' }
    ],
    localStreets: [
      { name: 'Armenia Street', path: 'M 10 45 L 90 45', isMain: true },
      { name: 'Pharaon Street', path: 'M 58 10 L 58 90', isMain: true },
      { name: 'Pasteur Street', path: 'M 10 25 L 45 25' },
      { name: 'Rail Line Reserve', path: 'M 10 75 L 90 75' }
    ]
  },
  {
    id: 'sassine',
    name: 'Sassine / Achrafieh',
    arabicName: 'الأشرفية ساسين',
    description: 'The aristocratic grand ridge of old Beirut, framed by centuries-old mansions, high-end shopping, and highly refined restaurants.',
    longHistory: 'Crowning one of Beirut’s historic hills, Sassine is the sophisticated heart of the Achrafieh district. It is famous for its grand 19th-century palaces, historical winding steps (such as the Sursock stairs), and deep Lebanese aristocratic lineage.',
    vibe: 'Elegant, manicured, historic, luxury-centric, featuring traditional mansion estates and highly refined dining rooms.',
    landmarks: ['Sassine Square Roundabout', 'Sursock Museum & Palace', 'ABC Mall luxury district', 'Gibran Khalil Gibran Library'],
    stats: { starred: 3, bib: 0, recommended: 1 },
    bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
    mapCenter: { lat: 33.8892, lng: 35.5165 },
    localLandmarks: [
      { name: 'Sassine Square', x: 50, y: 50, type: 'hub' },
      { name: 'Sursock Museum', x: 65, y: 20, type: 'monument' },
      { name: 'ABC Mall Achrafieh', x: 30, y: 45, type: 'institution' },
      { name: 'Sursock Historical Steps', x: 75, y: 15, type: 'geographic' }
    ],
    localStreets: [
      { name: 'Alfred Naccache Blvd', path: 'M 20 80 Q 50 50 80 20', isMain: true },
      { name: 'Sursock Street', path: 'M 40 20 L 90 20', isMain: true },
      { name: 'Independence Avenue', path: 'M 10 50 L 90 50' },
      { name: 'Sassine Crossing', path: 'M 50 10 L 50 90' }
    ]
  },
  {
    id: 'sodeco',
    name: 'Sodeco',
    arabicName: 'سوديكو',
    description: 'A stately crossroads of history and gastronomy, containing beautiful leafy streets, elegant stone architecture, and family estates.',
    longHistory: 'Adjacent to Monot, Sodeco sits along the historic green line from Lebanon\'s heritage era. Today, it has healed into a gorgeous upscale neighborhood of beautifully designed sandstone buildings, quiet residential streets, embassies, and fine dining hotspots.',
    vibe: 'Refined, serene, classic, upscale, with leafy residential lanes, upscale bistros, and charming artisanal hubs.',
    landmarks: ['Sodeco Square Crossroads', 'Historic Barakat Building (Beit Beirut)', 'Saint Joseph University (USJ)', ' leafy Monot historical alleys'],
    stats: { starred: 3, bib: 0, recommended: 3 },
    bannerUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=1200',
    mapCenter: { lat: 33.8912, lng: 35.5098 },
    localLandmarks: [
      { name: 'Sodeco Square Intersection', x: 45, y: 45, type: 'hub' },
      { name: 'Beit Beirut Museum', x: 60, y: 60, type: 'monument' },
      { name: 'USJ Campus', x: 30, y: 25, type: 'institution' },
      { name: 'Monot Historic Arch', x: 25, y: 55, type: 'geographic' }
    ],
    localStreets: [
      { name: 'Damascus Road', path: 'M 10 10 L 90 90', isMain: true },
      { name: 'Monot Street', path: 'M 25 10 C 25 40 45 60 45 90', isMain: true },
      { name: 'Sodeco Street', path: 'M 10 45 L 90 45' },
      { name: 'Adib Ishaq Street', path: 'M 20 70 L 80 70' }
    ]
  },
  {
    id: 'badaro',
    name: 'Badaro',
    arabicName: 'بدارو',
    description: 'Beirut’s leafy, botanical residential enclave, highly popular for dog-friendly outdoor terraces and long, relaxed sidewalk lunches.',
    longHistory: 'Directly bordering the spectacular, pine-filled Horsh Beirut park, Badaro was designed as a modern, green residential neighborhood in the mid-20th century. Known for its breezy Parisian-style grid layout, tree-lined sidewalks, and peaceful atmosphere, it has emerged as Beirut\'s favorite escape for relaxed sidewalk socializing.',
    vibe: 'Leafy, neighborly, breezy, botanical, with charming outdoor garden patios, local pubs, and authentic family-run breakfast joints.',
    landmarks: ['Beirut National Museum', 'Horsh Beirut Botanical Pine Forest', 'Badaro Main Street cafe strip', 'French Military Cemetery'],
    stats: { starred: 1, bib: 0, recommended: 2 },
    bannerUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=1200',
    mapCenter: { lat: 33.8821, lng: 35.5112 },
    localLandmarks: [
      { name: 'National Museum of Beirut', x: 50, y: 15, type: 'monument' },
      { name: 'Horsh Beirut Entrance', x: 75, y: 80, type: 'geographic' },
      { name: 'Badaro Rotunda', x: 40, y: 55, type: 'hub' },
      { name: 'Justice Ministry', x: 15, y: 30, type: 'institution' }
    ],
    localStreets: [
      { name: 'Badaro Main Street', path: 'M 40 15 L 40 90', isMain: true },
      { name: 'Damascus Highway border', path: 'M 80 10 L 80 90', isMain: true },
      { name: 'Museum Street', path: 'M 10 15 L 90 15' },
      { name: 'Adib Ishac Avenue', path: 'M 10 70 L 90 70' }
    ]
  },
  {
    id: 'antelias',
    name: 'Antelias',
    arabicName: 'أنطلياس',
    description: 'The monumental coastal gates of dining just north of Beirut, famous for world-class seafood feasts and breezy valley retreats.',
    longHistory: 'Historically a series of fertile citrus orchards and ancient water springs (Fawwar Antelias), Antelias has evolved into one of the country’s most important coastal dining hubs. Sitting along the highway connecting Beirut to Mount Lebanon, it is celebrated for hosting grand multi-tier seafood establishments and legendary Lebanese sweet shops.',
    vibe: 'Lively, grand, coastal, family-oriented, featuring high-capacity fine dining, live arak sessions, and sweeping coastal views.',
    landmarks: ['Fawwar Antelias water valley', 'St. Elie Church', 'Sea Road harbor front', 'Antelias cultural square'],
    stats: { starred: 1, bib: 1, recommended: 0 },
    bannerUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200',
    mapCenter: { lat: 33.9168, lng: 35.5912 },
    localLandmarks: [
      { name: 'Fawwar Spring River', x: 50, y: 45, type: 'geographic' },
      { name: 'Saint Elie Historical Church', x: 65, y: 65, type: 'monument' },
      { name: 'Antelias Sea Harbor', x: 15, y: 30, type: 'institution' },
      { name: 'Sweets Roundabout', x: 75, y: 25, type: 'hub' }
    ],
    localStreets: [
      { name: 'Seaside Highway', path: 'M 20 10 C 15 40 15 60 20 90', isMain: true },
      { name: 'Fawwar Antelias Street', path: 'M 20 45 L 90 45', isMain: true },
      { name: 'St. Elie Church Alley', path: 'M 65 45 L 65 90' },
      { name: 'Old Souk Antelias', path: 'M 45 10 L 45 45' }
    ]
  }
];

export default function NeighborhoodsView({
  onSelectRestaurant,
  savedRestaurantIds,
  onToggleSave,
  initialSelectedNeighborhood,
  onViewOnMap,
  selectedDistinction = 'All Distinctions',
  selectedCuisine = 'All Cuisines',
  selectedPrice = 'All Prices',
  searchQuery = '',
  selectedCity = 'All Cities'
}: NeighborhoodsViewProps) {
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<'hamra' | 'mar_mikhael' | 'sassine' | 'sodeco' | 'badaro' | 'antelias' | null>(
    (initialSelectedNeighborhood as any) || null
  );

  const hasActiveFilters = useMemo(() => {
    return selectedDistinction !== 'All Distinctions' ||
           selectedCuisine !== 'All Cuisines' ||
           selectedPrice !== 'All Prices' ||
           searchQuery !== '' ||
           selectedCity !== 'All Cities';
  }, [selectedDistinction, selectedCuisine, selectedPrice, searchQuery, selectedCity]);

  const getFilteredSpotsCount = React.useCallback((neighborhoodId: string) => {
    return RESTAURANTS.filter(rest => {
      if (rest.neighborhood !== neighborhoodId) return false;
      
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
  }, [selectedDistinction, selectedCuisine, selectedPrice, searchQuery, selectedCity]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialSelectedNeighborhood) {
      setSelectedNeighborhoodId(initialSelectedNeighborhood as any);
    }
  }, [initialSelectedNeighborhood]);

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?tab=neighborhoods&neighborhood=${id}`;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
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
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };
  
  const [activeSpecialty, setActiveSpecialty] = useState<string>('All');
  const [hoveredRestaurantId, setHoveredRestaurantId] = useState<string | null>(null);

  const selectedNeighborhood = useMemo(() => {
    if (!selectedNeighborhoodId) return null;
    return NEIGHBORHOODS.find(n => n.id === selectedNeighborhoodId) || null;
  }, [selectedNeighborhoodId]);

  // Filters restaurants belonging to the selected neighborhood and active specialty
  const neighborhoodRestaurants = useMemo(() => {
    if (!selectedNeighborhoodId) return [];
    return RESTAURANTS.filter(r => r.neighborhood === selectedNeighborhoodId);
  }, [selectedNeighborhoodId]);

  const filteredRestaurants = useMemo(() => {
    if (activeSpecialty === 'All') return neighborhoodRestaurants;
    return neighborhoodRestaurants.filter(r => {
      if (activeSpecialty === 'fine_dining') return r.category === 'fine_dining';
      if (activeSpecialty === 'pub_cafe') return r.category === 'pub_cafe';
      if (activeSpecialty === 'vibe') return r.category === 'vibe';
      if (activeSpecialty === 'takeaway_bakery_produce') return r.category === 'takeaway_bakery_produce';
      return true;
    });
  }, [neighborhoodRestaurants, activeSpecialty]);

  const specialtyCounts = useMemo(() => {
    const counts = {
      All: neighborhoodRestaurants.length,
      fine_dining: neighborhoodRestaurants.filter(r => r.category === 'fine_dining').length,
      pub_cafe: neighborhoodRestaurants.filter(r => r.category === 'pub_cafe').length,
      vibe: neighborhoodRestaurants.filter(r => r.category === 'vibe').length,
      takeaway_bakery_produce: neighborhoodRestaurants.filter(r => r.category === 'takeaway_bakery_produce').length
    };
    return counts;
  }, [neighborhoodRestaurants]);

  // Format rating badge helper
  const renderStars = (stars: number, distinction: string) => {
    if (stars > 0) {
      return (
        <span className="flex items-center gap-0.5 text-amber-500 font-mono font-bold text-[10px] tracking-wide">
          {Array.from({ length: stars }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" />
          ))}
          <span className="ml-1 bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase">
            {stars} Star{stars > 1 ? 's' : ''}
          </span>
        </span>
      );
    }
    if (distinction === 'BIB_GOURMAND') {
      return (
        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
          ☺ Bib Gourmand
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-neutral-500 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
        Selected recommendation
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left" id="neighborhoods-view-pane">
      
      {/* CASE 1: NO NEIGHBORHOOD SELECTED - SHOW INDEX GRID */}
      {!selectedNeighborhood ? (
        <div className="space-y-8" id="neighborhoods-index">
          <div className="border-b border-neutral-100 pb-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-extrabold text-amber-500 flex items-center gap-1">
              <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
              <span>Gourmet Districts Directory</span>
            </span>
            <h1 className="font-serif font-light text-4xl text-neutral-900 mt-2 uppercase tracking-wide">
              Explore Beirut’s <span className="font-medium text-emerald-850 text-emerald-800">Neighborhoods</span>
            </h1>
            <p className="text-xs text-neutral-500 mt-2 max-w-2xl leading-relaxed">
              Every district in the Levantine has its own distinct architectural style, historic soul, and culinary focus. Select a neighborhood landmark center to view details and map locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {NEIGHBORHOODS.map((n) => {
              // Get restaurant representative items
              const totalItems = RESTAURANTS.filter(r => r.neighborhood === n.id).length;
              const starredCount = RESTAURANTS.filter(r => r.neighborhood === n.id && r.stars > 0).length;
              const bibCount = RESTAURANTS.filter(r => r.neighborhood === n.id && r.distinction === 'BIB_GOURMAND').length;
              const recommendedCount = RESTAURANTS.filter(r => r.neighborhood === n.id && r.distinction === 'SELECTED').length;
              const filteredCount = getFilteredSpotsCount(n.id);

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    setSelectedNeighborhoodId(n.id);
                    setActiveSpecialty('All');
                  }}
                  className="group relative bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-600/30 transition-all cursor-pointer flex flex-col justify-between"
                  id={`neighborhood-card-${n.id}`}
                >
                  <div className="relative h-48 w-full overflow-hidden shrink-0">
                    <img
                      src={n.bannerUrl}
                      alt={n.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 saturate-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* FLOATING ACTION OVERLAYS: VIEW ON MAP & SHARE DIRECT LINK */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewOnMap) {
                            onViewOnMap(n.id, n.id === 'antelias' ? 'Antelias' : 'Beirut');
                          }
                        }}
                        className="bg-white/95 text-emerald-800 hover:text-emerald-950 px-2.5 py-1.5 rounded-lg text-[9px] font-bold tracking-wider border border-neutral-200 flex items-center gap-1.5 hover:bg-neutral-50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase select-none font-mono"
                        title={`Locate ${n.name} on the Map`}
                        id={`btn-map-locate-${n.id}`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-red-600 fill-red-100/50" />
                        <span>View on Map</span>
                      </button>
                      
                      <button
                        onClick={(e) => handleShare(n.id, e)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold tracking-wider border flex items-center gap-1.5 shadow-sm transition-all duration-305 hover:scale-105 active:scale-95 cursor-pointer uppercase select-none font-mono ${
                          copiedId === n.id 
                            ? 'bg-emerald-600 text-white border-emerald-600 px-2.5 shadow-md shadow-emerald-250' 
                            : 'bg-white/95 text-neutral-600 hover:text-emerald-800 border-neutral-200 hover:bg-neutral-50'
                        }`}
                        title={`Copy Share Link for ${n.name}`}
                        id={`btn-share-${n.id}`}
                      >
                        {copiedId === n.id ? (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3px] animate-pulse" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span className={copiedId === n.id ? 'text-white font-black' : ''}>
                          {copiedId === n.id ? 'Copied!' : 'Share'}
                        </span>
                      </button>

                      {/* Immediate Float-up Visual Feedback Toast Layer (z-20) */}
                      {copiedId === n.id && (
                        <div className="absolute inset-x-4 top-16 z-20 flex justify-center animate-[bounce_1s_infinite]">
                          <div className="bg-emerald-950/95 text-white text-[10px] font-mono tracking-wider px-3.5 py-2 rounded-full border border-emerald-500/30 shadow-lg flex items-center gap-1.5 font-bold uppercase backdrop-blur-sm">
                            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3px]" />
                            <span>District Link Copied!</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 text-left">
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-[0.2em] block">
                        {n.arabicName}
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white tracking-tight mt-0.5">
                        {n.name}
                      </h3>
                    </div>
                    
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10">
                      <div className="bg-emerald-950/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-mono tracking-widest font-black border border-amber-400/20">
                        {totalItems} PROPERTIES
                      </div>
                      {hasActiveFilters && (
                        <div className="bg-amber-500 text-emerald-950 px-2.5 py-1 rounded-full text-[9px] font-mono font-black tracking-widest uppercase shadow border border-amber-300">
                          {filteredCount} MATCHED
                        </div>
                      )}
                    </div>

                    {/* Interactive Hover Tooltip Overlay (z-20) */}
                    <div className="absolute inset-0 bg-neutral-950/95 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 text-left">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-emerald-400 font-extrabold uppercase tracking-widest block font-bold">
                          ✻ GOURMET VETTING INSIGHT
                        </span>
                        <h4 className="font-serif text-base font-bold text-white tracking-tight leading-none">
                          {n.name} ({n.arabicName})
                        </h4>
                        <p className="text-xs text-neutral-300 leading-relaxed mt-2 font-sans font-light">
                          {hasActiveFilters ? (
                            <>
                              There {filteredCount === 1 ? 'is' : 'are'} currently <span className="text-amber-300 font-bold">{filteredCount}</span> gourmet choice{filteredCount === 1 ? '' : 's'} matching your active filters in this neighborhood.
                            </>
                          ) : (
                            `Explore all ${totalItems} vetted epicurean venues, historical bistros, and local traditional suppliers.`
                          )}
                        </p>

                        {hasActiveFilters && (
                          <div className="text-[8px] font-mono text-neutral-400 mt-2 uppercase tracking-wider space-y-0.5">
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
                      
                      <div className="border-t border-white/10 pt-2 flex items-center justify-between mt-1">
                        <span className="text-[9px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                          {hasActiveFilters ? `${filteredCount} / ${totalItems} Matches` : `${totalItems} Gourmet Spots`}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400 flex items-center gap-1 font-bold">
                          INSPECT AREA →
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-neutral-600 leading-relaxed font-light line-clamp-2">
                      {n.description}
                    </p>

                    <div className="flex gap-2.5">
                      <div className="flex-1 p-2 bg-neutral-50 border border-neutral-100 rounded-lg text-center">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Starred</span>
                        <span className="text-sm font-black text-emerald-800">{starredCount > 0 ? `✻ ${starredCount}` : '0'}</span>
                      </div>
                      <div className="flex-1 p-2 bg-neutral-50 border border-neutral-100 rounded-lg text-center">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Bibs</span>
                        <span className="text-sm font-black text-emerald-800">{bibCount > 0 ? `☺ ${bibCount}` : '0'}</span>
                      </div>
                      <div className="flex-1 p-2 bg-neutral-50 border border-neutral-100 rounded-lg text-center">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Selected</span>
                        <span className="text-sm font-black text-emerald-850 text-emerald-800">{recommendedCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-emerald-800 pt-1">
                      <span>Inspect evaluations</span>
                      <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        
        /* CASE 2: NEIGHBORHOOD SELECT VIEW WITH DETAILED MAP & LANDMARKS */
        <div className="space-y-8 animate-fade-in" id={`neighborhood-view-${selectedNeighborhood.id}`}>
          
          {/* Back to index trigger */}
          <button
            onClick={() => setSelectedNeighborhoodId(null)}
            className="group flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 uppercase tracking-widest cursor-pointer select-none"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>View All Neighborhoods Directory</span>
          </button>

          {/* Large Immersive Header Column */}
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl text-white">
            <div className="absolute inset-0 opacity-40">
              <img
                src={selectedNeighborhood.bannerUrl}
                alt={selectedNeighborhood.name}
                className="w-full h-full object-cover scale-102"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
            
            {/* FLOATING CORNER INTERACTIVE MAP DEEPLINK */}
            <button
              onClick={() => {
                if (onViewOnMap) {
                  onViewOnMap(selectedNeighborhood.id, selectedNeighborhood.id === 'antelias' ? 'Antelias' : 'Beirut');
                }
              }}
              className="absolute top-6 right-6 z-20 bg-emerald-700/90 hover:bg-emerald-800 border border-white/20 text-white backdrop-blur-md px-4 py-2.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg transition-all cursor-pointer uppercase select-none font-sans"
              title={`Locate ${selectedNeighborhood.name} on map`}
              id={`btn-map-locate-header-${selectedNeighborhood.id}`}
            >
              <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>Locate on Map</span>
            </button>

            <div className="relative p-8 md:p-12 space-y-5 max-w-4xl text-left z-10">
              <div className="flex items-center gap-3">
                <span className="bg-amber-400 text-emerald-950 text-[10px] uppercase font-mono font-black px-3.5 py-1.5 rounded-full flex items-center gap-1 shadow">
                  <Building className="w-3.5 h-3.5" />
                  <span>{selectedNeighborhood.arabicName}</span>
                </span>
                <span className="text-amber-300 text-xs font-mono font-bold tracking-widest uppercase">Gourmet District</span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-none">
                {selectedNeighborhood.name}
              </h1>

              <p className="text-neutral-200 text-sm md:text-base font-light leading-relaxed max-w-3xl">
                {selectedNeighborhood.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/10 mt-6 text-xs text-neutral-300">
                <div className="space-y-1.5">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">Historic Chronicles</h4>
                  <p className="leading-relaxed font-light font-sans">{selectedNeighborhood.longHistory}</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold">Local Aura & Atmosphere</h4>
                  <p className="leading-relaxed font-light font-sans">{selectedNeighborhood.vibe}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-3">
                {selectedNeighborhood.landmarks.map((l, idx) => (
                  <span key={idx} className="bg-white/5 border border-white/10 hover:border-amber-400/30 text-white font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full transition-colors font-semibold">
                    📍 {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* TWO-COLUMN GRID: INTERACTIVE MAP & FILTERED LISTINGS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: SPECIALTIES & DETAILED SHOWCASE LISTINGS (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* SPECIALTY HORIZONTAL TABS */}
              <div className="border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-serif font-light text-xl text-neutral-900 uppercase tracking-wider">
                  <span>Specialties Catalog</span>
                  <span className="text-[10px] text-neutral-400 font-mono font-normal ml-1.5">({filteredRestaurants.length} active)</span>
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveSpecialty('All')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${
                    activeSpecialty === 'All'
                      ? 'bg-emerald-800 text-white shadow'
                      : 'bg-neutral-55 hover:bg-neutral-100 text-neutral-600 bg-neutral-100'
                  }`}
                >
                  All ({specialtyCounts.All})
                </button>
                <button
                  onClick={() => setActiveSpecialty('fine_dining')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${
                    activeSpecialty === 'fine_dining'
                      ? 'bg-emerald-800 text-white shadow'
                      : 'bg-neutral-55 hover:bg-neutral-100 text-neutral-600 bg-neutral-100'
                  }`}
                >
                  Fine Dining ({specialtyCounts.fine_dining})
                </button>
                <button
                  onClick={() => setActiveSpecialty('pub_cafe')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${
                    activeSpecialty === 'pub_cafe'
                      ? 'bg-emerald-800 text-white shadow'
                      : 'bg-neutral-55 hover:bg-neutral-100 text-neutral-600 bg-neutral-100'
                  }`}
                >
                  Cosy Pubs & Cafés ({specialtyCounts.pub_cafe})
                </button>
                <button
                  onClick={() => setActiveSpecialty('vibe')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${
                    activeSpecialty === 'vibe'
                      ? 'bg-emerald-800 text-white shadow'
                      : 'bg-neutral-55 hover:bg-neutral-100 text-neutral-600 bg-neutral-100'
                  }`}
                >
                  Lively Vibes ({specialtyCounts.vibe})
                </button>
                <button
                  onClick={() => setActiveSpecialty('takeaway_bakery_produce')}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${
                    activeSpecialty === 'takeaway_bakery_produce'
                      ? 'bg-emerald-800 text-white shadow'
                      : 'bg-neutral-55 hover:bg-neutral-100 text-neutral-600 bg-neutral-100'
                  }`}
                >
                  Bakeries & Takeaways ({specialtyCounts.takeaway_bakery_produce})
                </button>
              </div>

              {/* RESTAURANTS DETAILED LIST ROWS */}
              {filteredRestaurants.length === 0 ? (
                <div className="py-20 bg-neutral-50 border border-neutral-100 text-center rounded-2xl flex flex-col items-center justify-center p-6 shadow-xs">
                  <Footprints className="w-12 h-12 text-neutral-300 mb-2.5" />
                  <p className="font-serif italic text-base text-neutral-800">No matching specialties here</p>
                  <p className="text-[11px] text-neutral-400 mt-1 max-w-xs">No inspector evaluations match this category inside Hamra. Let's inspect other gourmet categories.</p>
                  <button
                    onClick={() => setActiveSpecialty('All')}
                    className="mt-4 px-4 py-2 border border-emerald-600 text-emerald-700 text-[10px] uppercase font-bold tracking-widest rounded-lg hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                  >
                    Reset Specialty Filter
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRestaurants.map((r) => {
                    const isHovered = hoveredRestaurantId === r.id;
                    const isSaved = savedRestaurantIds.includes(r.id);

                    return (
                      <div
                        key={r.id}
                        onMouseEnter={() => setHoveredRestaurantId(r.id)}
                        onMouseLeave={() => setHoveredRestaurantId(null)}
                        onClick={() => onSelectRestaurant(r)}
                        className={`group relative bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row text-left cursor-pointer ${
                          isHovered 
                            ? 'border-emerald-600 bg-emerald-50/10 shadow-sm' 
                            : 'border-neutral-200 bg-white'
                        }`}
                        id={`restaurant-row-${r.id}`}
                      >
                        {/* Interactive marker link overlay identifier */}
                        <div className={`absolute top-0 left-0 w-1 h-full transition-all ${
                          isHovered ? 'bg-emerald-600 h-full' : 'bg-transparent h-0'
                        }`} />

                        {/* Large, high quality food/decor cover */}
                        <div className="w-full sm:w-44 h-48 sm:h-auto shrink-0 relative overflow-hidden bg-neutral-100">
                          <img
                            src={r.imageUrl}
                            alt={r.name}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 h-48 sm:min-h-[160px]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2.5 right-2.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleSave(r.id, e);
                              }}
                              className={`p-2 rounded-full cursor-pointer transition-all border outline-none shadow-sm flex items-center justify-center backdrop-blur-md ${
                                isSaved
                                  ? 'bg-amber-400 border-amber-400 text-emerald-950'
                                  : 'bg-white/80 border-neutral-200 text-neutral-500 hover:text-rose-500'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          
                          <div className="absolute bottom-2.5 left-2.5 bg-neutral-900/80 backdrop-blur-sm shadow border border-white/10 px-2 py-1 rounded text-[8px] font-mono tracking-widest text-white uppercase">
                            {r.cuisine.split(' ')[0]}
                          </div>
                        </div>

                        {/* Content detail Column */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3 relative z-10">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-1.5">
                              {renderStars(r.stars, r.distinction)}
                              <span className="text-[10px] font-mono font-bold text-amber-500 tracking-wider">
                                {r.priceRange}
                              </span>
                            </div>

                            <h4 className="font-serif text-lg font-bold text-neutral-900 leading-tight group-hover:text-emerald-700 transition-colors">
                              {r.name}
                            </h4>

                            <p className="text-[10px] text-neutral-400 font-mono tracking-wide">
                              CHEF: {r.chef} • {r.city}
                            </p>

                            <p className="text-[11.5px] text-neutral-650 text-neutral-600 font-light leading-relaxed line-clamp-2 pr-2">
                              {r.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-[10px] tracking-wide text-neutral-400">
                            <span className="truncate max-w-xs block font-sans">
                              📍 {r.address}
                            </span>
                            <span className="font-bold text-emerald-850 text-emerald-800 uppercase group-hover:underline">
                              Read full dossier
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: DETAILED SPECIFIC SVG MAP PLATFORM (5 cols) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-8" id="neighborhood-local-map">
              <div className="bg-neutral-900 text-white rounded-3xl p-5 border border-neutral-800 shadow-xl overflow-hidden text-left relative">
                
                {/* Embedded Grid background overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                <div className="flex justify-between items-center pb-3 border-b border-white/10 relative z-10">
                  <div>
                    <h3 className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-1.5 uppercase">
                      <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
                      <span>{selectedNeighborhood.name} Local Locator</span>
                    </h3>
                    <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Interactive local coordinate chart</p>
                  </div>
                  <span className="text-[8px] font-mono bg-white/10 px-2 py-1 rounded text-neutral-300 font-bold tracking-widest">
                    GRID SYSTEM
                  </span>
                </div>

                {/* INTERACTIVE COORDINATE SCATTER CANVAS */}
                <div className="relative w-full h-[360px] bg-neutral-950/80 rounded-2xl border border-white/5 overflow-hidden my-4">
                  
                  {/* Visual Compass grid center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-56 h-56 border border-dashed border-white/40 rounded-full" />
                    <div className="w-28 h-28 border border-dashed border-white/30 rounded-full" />
                  </div>

                  {/* SVG paths representing the neighborhood streets */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    {/* Render local street pathways */}
                    {selectedNeighborhood.localStreets.map((street, idx) => (
                      <g key={idx}>
                        <path
                          d={street.path}
                          fill="none"
                          stroke={street.isMain ? '#34d399' : '#ffffff'}
                          strokeWidth={street.isMain ? '1.8' : '0.8'}
                          strokeOpacity={street.isMain ? '0.35' : '0.15'}
                          strokeDasharray={street.isMain ? 'none' : '3 3'}
                        />
                        {/* Subtle text for main street names */}
                        {street.isMain && (
                          <path
                            id={`street-path-${idx}`}
                            d={street.path}
                            fill="none"
                            stroke="none"
                          />
                        )}
                      </g>
                    ))}
                  </svg>

                  {/* Render Local landmarks labels */}
                  {selectedNeighborhood.localLandmarks.map((landmark, idx) => (
                    <div
                      key={idx}
                      style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center select-none z-10"
                    >
                      <div className="p-1 px-2 rounded bg-neutral-900/95 border border-white/10 shadow text-[7.5px] font-mono tracking-widest uppercase font-bold text-neutral-400 flex items-center gap-1">
                        <span>🏛️</span>
                        <span>{landmark.name}</span>
                      </div>
                    </div>
                  ))}

                  {/* PLOT NEIGHBORHOOD RESTAURANT TARGET PINS */}
                  {neighborhoodRestaurants.map((r) => {
                    const isHovered = hoveredRestaurantId === r.id;
                    const isPassedFilter = filteredRestaurants.some(fr => fr.id === r.id);
                    
                    // Coordinates based on the restaurant's local grid mapping or derived from original x,y
                    // We adapt original x,y (which map to whole beirut map) into localized grids nicely
                    const locX = r.coordinates.x % 35 + 30; // localized conversion standard to cover 0-100 canvas beautifully
                    const locY = r.coordinates.y % 35 + 30;

                    return (
                      <div
                        key={r.id}
                        onMouseEnter={() => setHoveredRestaurantId(r.id)}
                        onMouseLeave={() => setHoveredRestaurantId(null)}
                        onClick={() => onSelectRestaurant(r)}
                        style={{ left: `${locX}%`, top: `${locY}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all duration-300 ${
                          isPassedFilter ? 'opacity-100 scale-100' : 'opacity-30 scale-90 pointer-events-none'
                        }`}
                      >
                        {/* Glowing backdrop ripple for hovered elements */}
                        {isHovered && (
                          <span className="absolute -inset-4 bg-emerald-400/20 backdrop-blur-xs rounded-full animate-ping pointer-events-none" />
                        )}

                        {/* Interactive Marker Pin bubble */}
                        <div className={`p-1.5 rounded-full border transition-all flex items-center justify-center shadow-lg relative ${
                          isHovered 
                            ? 'bg-amber-400 border-amber-400 text-emerald-950 scale-120 z-30' 
                            : 'bg-emerald-950 border-emerald-500/50 text-emerald-300'
                        }`}>
                          {r.stars > 0 ? (
                            <Star className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Compass className="w-3.5 h-3.5" />
                          )}

                          {/* Float visual card tooltip on Pin hover */}
                          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 p-2 bg-neutral-900 border border-white/15 rounded-xl pointer-events-none transition-all duration-300 font-sans shadow-2xl text-left ${
                            isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
                          }`}>
                            <span className="text-[7.5px] font-mono tracking-widest text-amber-400 uppercase font-black block mb-0.5">
                              {r.cuisine.split(' ')[0]}
                            </span>
                            <span className="font-serif text-[10px] font-bold text-white block truncate">
                              {r.name}
                            </span>
                            <span className="text-[8px] text-neutral-400 block mt-0.5">
                              {r.priceRange} • Chef {r.chef.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Local Grid instructions guide */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-[10px] text-neutral-300 leading-relaxed font-light mt-1 flex items-center gap-3 relative z-10">
                  <span className="text-lg">💡</span>
                  <p>
                    <strong>Interactive coordinates matrix</strong>. Interacting with the restaurant items on the left highlights their exact geographic placement relative to district landmarks. Click a pin to instantly generate reports.
                  </p>
                </div>

                <div className="pt-2 flex justify-between items-center text-[9px] font-mono text-neutral-400 uppercase relative z-10">
                  <span>SCALE: 1 UNIT = ~22 METERS</span>
                  <span>MEDITERRANEAN DATUM WGS-84</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

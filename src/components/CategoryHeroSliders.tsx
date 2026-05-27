import React from 'react';
import { Restaurant } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import { Coffee, Flame, Store, MapPin, Eye, ArrowRight, Heart } from 'lucide-react';

interface CategoryHeroSlidersProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  savedRestaurantIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

export default function CategoryHeroSliders({
  onSelectRestaurant,
  savedRestaurantIds,
  onToggleSave
}: CategoryHeroSlidersProps) {
  
  // Filter restaurants by category
  const pubsAndCafes = RESTAURANTS.filter(r => r.category === 'pub_cafe');
  const vibes = RESTAURANTS.filter(r => r.category === 'vibe');
  const takeawaysAndBakeries = RESTAURANTS.filter(r => r.category === 'takeaway_bakery_produce');

  const renderSliderSection = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    items: Restaurant[],
    sectionId: string
  ) => {
    return (
      <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id={sectionId}>
        {/* Header Block of Slider */}
        <div className="flex justify-between items-end border-b border-white/5 pb-2.5">
          <div className="space-y-1 text-left">
            <h3 className="font-serif font-light text-xl text-[#F5F5F5] flex items-center gap-2 uppercase tracking-wider">
              {icon}
              <span>{title}</span>
              <span className="text-[10px] text-white/30 font-mono font-normal tracking-widest ml-1">({items.length} SPOTS)</span>
            </h3>
            <p className="text-xs text-white/40 font-light italic">{subtitle}</p>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[9px] font-mono tracking-widest text-[#F5F5F5]/40 uppercase select-none">
            <span>Scroll horizontally</span>
            <ArrowRight className="w-3 h-3 animate-pulse" />
          </div>
        </div>

        {/* Sliding Gallery Track */}
        <div 
          className="flex gap-6 overflow-x-auto pb-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0"
          id={`${sectionId}-track`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((m) => {
            const isSaved = savedRestaurantIds.includes(m.id);
            return (
              <div
                key={m.id}
                id={`gourmet-slider-card-${m.id}`}
                onClick={() => onSelectRestaurant(m)}
                className="w-72 sm:w-80 shrink-0 bg-[#0a0a0a] border border-white/5 hover:border-white/15 rounded-xl overflow-hidden transition-all duration-300 group cursor-pointer shadow-lg hover:scale-[1.015] flex flex-col justify-between"
              >
                {/* Photo & Tag overlay */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={m.imageUrl}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-80 group-hover:opacity-95"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                  {/* Top-Right Save Badge */}
                  <button
                    onClick={(e) => onToggleSave(m.id, e)}
                    className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white/70 hover:text-red-500 transition-colors border border-white/5 active:scale-95 cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Top-Left Distinction Tag */}
                  <div className="absolute top-3.5 left-3.5 text-[8px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded bg-black/80 border border-white/10 text-[#F5F5F5] flex items-center gap-1">
                    {m.stars > 0 ? (
                      <>
                        <span className="text-amber-400 font-bold">✻</span>
                        <span>{m.stars} Star{m.stars > 1 ? 's' : ''}</span>
                      </>
                    ) : m.distinction === 'BIB_GOURMAND' ? (
                      <>
                        <span className="text-amber-400 font-bold">☺</span>
                        <span>Bib Gourmand</span>
                      </>
                    ) : (
                      <>
                        <span className="text-white/40">✓</span>
                        <span>Selected</span>
                      </>
                    )}
                  </div>

                  {/* Bottom Area Overlay (City) */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white/90 text-[10px] font-medium font-mono">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{m.city}</span>
                  </div>
                </div>

                {/* Content Descriptions */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5 text-left">
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-base text-white/90 group-hover:text-red-400 transition-colors leading-tight">
                      {m.name}
                    </h4>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{m.cuisine}</p>
                    <p className="text-xs text-white/55 font-light leading-relaxed line-clamp-2 pt-1">
                      {m.description}
                    </p>
                  </div>

                  {/* Footer Stats summary & hover indicator */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#F5F5F5]/30 uppercase font-bold tracking-wider">
                      Budget: <span className="text-white/60">{m.priceRange}</span>
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 select-none">
                      <span>Detailed Report</span>
                      <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 py-4 border-b border-white/5 bg-gradient-to-b from-[#050505] to-[#080808]" id="lebanese-hero-sliders">
      
      {/* SECTION TITLE PANEL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-1">
        <span className="text-[9px] font-mono uppercase text-red-500 font-extrabold tracking-[0.4em] block">Lebanese Specialty Guides</span>
        <h2 className="font-serif font-light text-2xl text-white uppercase tracking-wider">Curated Micro-Slider Showcases</h2>
        <p className="text-xs text-white/40 font-light max-w-2xl leading-relaxed">
          Sip craft beers, party at late rooftop lounges, or sample early morning hot clay oven manoushehs. Slide through indices vetted by Zaytouynda inspectors.
        </p>
      </div>

      {renderSliderSection(
        "Pubs & Specialty Cafes",
        "Cozy intellectual Gemmayze espresso bars, surf-beach microbreweries, and quiet botanical gardens.",
        <Coffee className="w-5 h-5 text-amber-500" />,
        pubsAndCafes,
        "pubs-cafes-slider-container"
      )}

      {renderSliderSection(
        "Vibes & Live Late Nights",
        "World-renowned open-sky rooftops, scenic coastal bonfires, and architectural cabarets.",
        <Flame className="w-5 h-5 text-orange-500 animate-pulse" />,
        vibes,
        "vibes-slider-container"
      )}

      {renderSliderSection(
        "Bakeries, Takeaways & Produce",
        "Legendary thin-crust lahme b'ajins, slow-baked knafehs, and artisanal organic farmers honey.",
        <Store className="w-5 h-5 text-emerald-500" />,
        takeawaysAndBakeries,
        "takeaways-slider-container"
      )}

    </div>
  );
}

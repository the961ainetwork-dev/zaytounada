import React, { useState, useMemo } from 'react';
import { Restaurant } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import RestaurantCard from './RestaurantCard';
import { Coffee, Flame, Store, Award, MapPin, Sparkles, SlidersHorizontal, Info } from 'lucide-react';

interface SpecialtySectionViewProps {
  category: 'pub_cafe' | 'vibe' | 'takeaway_bakery_produce';
  onSelectRestaurant: (restaurant: Restaurant) => void;
  savedRestaurantIds: string[];
  onToggleSaveRestaurant: (id: string) => void;
}

export default function SpecialtySectionView({
  category,
  onSelectRestaurant,
  savedRestaurantIds,
  onToggleSaveRestaurant
}: SpecialtySectionViewProps) {
  const [selectedCity, setSelectedCity] = useState<string>('All');

  // Filter listings based on the active state selection
  const filteredListings = useMemo(() => {
    return RESTAURANTS.filter(r => {
      const isCategory = r.category === category;
      const isCity = selectedCity === 'All' || r.city.toLowerCase() === selectedCity.toLowerCase();
      return isCategory && isCity;
    });
  }, [category, selectedCity]);

  // Derive static metadata details for each view with beautiful light-mode alignments
  const config = useMemo(() => {
    switch (category) {
      case 'pub_cafe':
        return {
          title: "Lebanese Pubs & Specialty Cafes",
          tagline: "Vetted espresso bars, artisanal gardens, and native beach clubs.",
          icon: <Coffee className="w-8 h-8 text-amber-500" />,
          colorClass: "from-amber-50/60 via-white to-white border-amber-200/80 shadow-xs",
          textAccent: "text-amber-700",
          indicatorBg: "bg-amber-50/50 border-amber-200 text-amber-700",
          narrative: "Lebanon's social fabric is woven tightly inside its gathering hubs. From Gemmayze's heritage-listed intellectual libraries and Achrafieh's beautiful secret botanical espresso gardens to Batroun's organic, eco-engineered ocean microbreweries, this index tracks places where craft beverages and native hospitality reach absolute parity."
        };
      case 'vibe':
        return {
          title: "High Vibes & Live Late Nights",
          tagline: "Open-sky rooftops, active acoustics, and theatrical cabarets.",
          icon: <Flame className="w-8 h-8 text-orange-500 animate-pulse" />,
          colorClass: "from-rose-50/60 via-white to-white border-rose-200/80 shadow-xs",
          textAccent: "text-rose-700",
          indicatorBg: "bg-rose-50/50 border-rose-200 text-rose-700",
          narrative: "Beirut is legendary for light and music. Our Vibes registry covers spectacular seaside sunset sundecks on Batroun's ancient stone ruins, open-sky electronic temples hidden deep in the capital's post-industrial sector, and multi-course grand theatrical mezza halls with live acoustic oud and classical tarab musicians."
        };
      case 'takeaway_bakery_produce':
        return {
          title: "Bakeries, Takeaways & Local Produce",
          tagline: "Golden stone-ovens, heirloom honey, and ancient sweet castles.",
          icon: <Store className="w-8 h-8 text-emerald-500" />,
          colorClass: "from-emerald-50/60 via-white to-white border-emerald-200/80 shadow-xs",
          textAccent: "text-emerald-700",
          indicatorBg: "bg-emerald-50/50 border-emerald-200 text-emerald-700",
          narrative: "An index celebrating raw agricultural craft and traditional ovens. Explore Tripoli's majestic multi-generation sweet castles baking pure clotted ashta cream sheets, Byblos's ancient cobblestone bakeries turning wild mountain sesame and olive oil manoushehs, and local organic farms selling unfiltered cedar honey and cold-pressed olive elixirs."
        };
    }
  }, [category]);

  const uniqueCities = useMemo(() => {
    const citiesSet = new Set<string>();
    RESTAURANTS.filter(r => r.category === category).forEach(r => citiesSet.add(r.city));
    return ['All', ...Array.from(citiesSet)];
  }, [category]);

  // Statistics summaries
  const stats = useMemo(() => {
    const list = RESTAURANTS.filter(r => r.category === category);
    const starCount = list.reduce((acc, current) => acc + (current.stars || 0), 0);
    const averagePrice = "$".repeat(Math.round(list.reduce((acc, current) => acc + current.priceRange.length, 0) / list.length) || 2);
    return {
      total: list.length,
      stars: starCount,
      avgPrice: averagePrice
    };
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-neutral-900" id={`specialty-page-${category}`}>
      
      {/* EDITORIAL THEMED HERO BOX */}
      <div className={`relative mb-10 p-8 md:p-12 rounded-2xl bg-gradient-to-br border text-left overflow-hidden ${config.colorClass}`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-neutral-100/45 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase border border-neutral-300 bg-neutral-50/80">
            <Sparkles className="w-3.5 h-3.5 text-red-600 animate-spin" />
            <span className="text-neutral-600 font-bold">Specialty Registry</span>
          </div>

          <div className="space-y-2.5">
            <h1 className="text-3xl md:text-5xl font-serif font-light text-neutral-950 leading-tight flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="shrink-0">{config.icon}</span>
              <span>{config.title}</span>
            </h1>
            <p className={`text-sm tracking-wide font-bold uppercase font-mono ${config.textAccent}`}>{config.tagline}</p>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed font-light font-sans max-w-3.5xl">
            {config.narrative}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg pt-4 border-t border-neutral-200">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 block font-bold">Vetted Listings</span>
              <span className="font-serif text-2xl font-light text-neutral-900">{stats.total} Exclusive</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 block font-bold">Starred Level</span>
              <span className="font-serif text-2xl font-light text-amber-550">{'✻'.repeat(stats.stars) || "Vetted"}</span>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-450 block font-bold">Average Pricing</span>
              <span className="font-serif text-2xl font-light text-neutral-800">{stats.avgPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERING CONTROLS FOR REGIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 pb-6 mb-8 text-left">
        <div>
          <h3 className="font-serif text-lg text-neutral-950 font-semibold flex items-center gap-2 leading-tight">
            <SlidersHorizontal className="w-4 h-4 text-neutral-450" />
            <span>Interactive Filtering Directory</span>
          </h3>
          <p className="text-[11px] text-neutral-500 mt-0.5 font-light">Filter the listings index dynamically below</p>
        </div>

        {/* City/Region Badges Selection */}
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {uniqueCities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer border ${
                selectedCity === city
                  ? 'bg-red-650 border-red-650 text-white shadow-xs font-bold'
                  : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-250 text-neutral-600'
              }`}
            >
              {city === 'All' ? 'All Lebanon' : city}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER LISTS */}
      {filteredListings.length === 0 ? (
        <div className="p-16 border border-dashed border-neutral-250 rounded-2xl text-center space-y-3.5 bg-neutral-50">
          <Info className="w-8 h-8 text-neutral-300 mx-auto" />
          <h4 className="font-serif text-lg text-neutral-900 font-medium">No current registrations matched</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-light">
            Our inspectors are hard at work. Check back soon for updated evaluations inside this region!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onSelect={() => onSelectRestaurant(r)}
              isSaved={savedRestaurantIds.includes(r.id)}
              onToggleSave={(e) => {
                e.stopPropagation();
                onToggleSaveRestaurant(r.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

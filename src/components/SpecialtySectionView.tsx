import React, { useState, useMemo } from 'react';
import { Restaurant } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import RestaurantCard from './RestaurantCard';
import { Coffee, Flame, Store, Award, MapPin, Sparkles, SlidersHorizontal, Info, Music, Disc, Speaker, Wheat, Leaf } from 'lucide-react';
import ShareActions from './ShareActions';

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

          <div className="pt-4 border-t border-neutral-200/60 max-w-lg">
            <ShareActions 
              headline={config.title} 
              excerpt={`${config.tagline}. ${config.narrative}`} 
              linkUrl={typeof window !== 'undefined' ? `${window.location.origin}/?tab=${category === 'pub_cafe' ? 'pubs-cafes' : category === 'vibe' ? 'vibes' : 'takeaways-bakeries'}` : 'https://zaytounada.xyz/'}
            />
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

      {/* DEDICATED EXTRA EDITORIAL CONTENT */}
      {category === 'pub_cafe' && (
        <div className="mt-16 border-t border-neutral-200 pt-16 space-y-10" id="beirut-nightlife-editorial">
          <div className="max-w-3xl space-y-2 text-left">
            <span className="text-[10px] font-mono tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-bold uppercase">
              Exclusive Soundscapes
            </span>
            <h2 className="font-serif text-3xl font-light text-neutral-950 uppercase tracking-wide">
              Prominent Nightclubs & <span className="font-medium text-amber-600">Beirut Curates</span>
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Beirut’s nightlife is internationally recognized, particularly for its sophisticated rooftop bars, legendary basement concrete shrines, and high-energy underground collectives. Below are the definitive hubs of Lebanese electronic culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* SKYBAR */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-left">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono bg-neutral-950 text-white font-bold px-2 py-0.5 rounded tracking-wider">
                    BEIRUT
                  </span>
                  <span className="text-[10px] text-amber-600 font-mono font-bold uppercase tracking-widest">
                    Rooftop Club
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-950">SKYBAR (Beirut)</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  An iconic, long-standing rooftop nightclub known for its breathtaking panoramic sea views, upscale atmosphere, and world-class entertainment. It is considered one of the premier party destinations in the Middle East.
                </p>
              </div>
              <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span>Vibe: Premier & Elevation</span>
                <span className="text-amber-600">★★★★★</span>
              </div>
            </div>

            {/* B 018 */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-left">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono bg-neutral-950 text-white font-bold px-2 py-0.5 rounded tracking-wider">
                    BEIRUT
                  </span>
                  <span className="text-[10px] text-amber-600 font-mono font-bold uppercase tracking-widest">
                    Concrete Bunker
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-950">B 018</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  A legendary underground club known for its industrial aesthetic, retractable roof, and history as a staple of Beirut’s electronic music scene. Fusing historical architecture with modern sound.
                </p>
              </div>
              <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span>Vibe: Techno & Industrial</span>
                <span className="text-amber-600">★★★★★</span>
              </div>
            </div>

            {/* The Grand Factory */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-left">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono bg-neutral-950 text-white font-bold px-2 py-0.5 rounded tracking-wider">
                    BEIRUT
                  </span>
                  <span className="text-[10px] text-amber-600 font-mono font-bold uppercase tracking-widest">
                    Warehouse Venue
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-950">The Grand Factory</h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  A versatile, industrial-style venue that hosts major cultural events and is particularly famous for its weekend party series (such as "CU NXT SAT"). It offers a more expansive, warehouse-club feel.
                </p>
              </div>
              <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span>Vibe: Progressive & Raw</span>
                <span className="text-amber-600">★★★★★</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {/* THE DIY AND LIVE MUSIC SCENE */}
            <div className="bg-neutral-950 text-white rounded-3xl p-8 border border-neutral-800 space-y-6 text-left">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-widest block">Underground Roots</span>
                <h3 className="font-serif text-2xl font-light text-neutral-100 uppercase">The DIY & Live Music Scene</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans font-light">
                  Beyond the major clubs, Beirut maintains a resilient underground and live music scene that focuses on smaller venues and communal spaces.
                </p>
              </div>

              <div className="space-y-4 divide-y divide-neutral-805 text-left">
                <div className="pt-4 first:pt-0 space-y-1">
                  <h4 className="font-serif text-sm font-bold text-amber-300">Dajjeh (ضجة)</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    More than a single venue, this is an informal collective that has become the heart of the modern DIY punk and underground music scene in Beirut. They organize non-commercial shows that serve as a platform for local bands across punk, metal, and noise genres.
                  </p>
                </div>
                <div className="pt-4 space-y-1">
                  <h4 className="font-serif text-sm font-bold text-amber-300">Salon Beyrouth</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    A popular, more intimate spot that frequently hosts live jazz performances and local musical acts.
                  </p>
                </div>
                <div className="pt-4 space-y-1">
                  <h4 className="font-serif text-sm font-bold text-amber-300">The Quadrangle (Hazmieh)</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    A well-known venue for those looking to catch classic rock, tribute bands, and live performances in a pub-style atmosphere.
                  </p>
                </div>
                <div className="pt-4 space-y-1">
                  <h4 className="font-serif text-sm font-bold text-amber-305">Ahstar Jazz Bar (Byblos/Jbeil)</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light">
                    An essential destination for those interested in jazz and live music outside of the immediate Beirut city center.
                  </p>
                </div>
              </div>
            </div>

            {/* KESERWAN AND JOUNIEH NIGHTLIFE */}
            <div className="bg-white border border-neutral-250 rounded-3xl p-8 space-y-6 text-left">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-rose-600 font-bold uppercase tracking-widest block">Coastal After-Hours</span>
                <h3 className="font-serif text-2xl font-light text-neutral-950 uppercase">Keserwan & Jounieh Nightlife</h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-light">
                  For those exploring north of Beirut, the Keserwan district—particularly Jounieh and Kaslik—offers a high density of pubs and clubs with a local, energetic flair.
                </p>
              </div>

              <div className="space-y-4 divide-y divide-neutral-100 text-left">
                <div className="pt-4 first:pt-0 space-y-1 flex items-start gap-3">
                  <span className="bg-neutral-100 text-neutral-700 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 animate-pulse">1</span>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-neutral-900">Voice Club (Kaslik)</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                      A prominent destination in the Kaslik area known for its vibrant music and dance scene.
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-1 flex items-start gap-3">
                  <span className="bg-neutral-100 text-neutral-700 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-neutral-900">Vault Night Club (Sarba)</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed font-light">
                      A popular nightlife spot with a focus on electronic music and a consistent local following.
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-1 flex items-start gap-3">
                  <span className="bg-neutral-100 text-neutral-700 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-neutral-900">The Bass Lounge (Jounieh)</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed font-light font-sans">
                      Often frequented for its music, cocktails, and lively, casual atmosphere.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {category === 'takeaway_bakery_produce' && (
        <div className="mt-16 border-t border-neutral-200 pt-16 space-y-10" id="bakeries-farms-editorial">
          <div className="max-w-4xl space-y-2 text-left">
            <span className="text-[10px] font-mono tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold uppercase">
              Lebanese Terroir & Harvest
            </span>
            <h2 className="font-serif text-3xl font-light text-neutral-950 uppercase tracking-wide">
              Artisanal Bakeries, Farms & <span className="font-medium text-emerald-700">Heirloom Produce</span>
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Lebanon’s culinary landscape is a blend of time-honored tradition and a growing movement toward artisanal, community-focused production. Below is a selection of notable establishments and resources for high-quality local goods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Artisanal Bakeries */}
            <div className="bg-white border border-neutral-250 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-5 text-left">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-700 border border-emerald-200">
                  <Wheat className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-950">Artisanal Bakeries</h3>
              </div>
              
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                These spots range from historic institutions to modern social enterprises focusing on heritage grains.
              </p>

              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-neutral-900">Mavia Bakery <span className="text-[10px] text-neutral-400 font-mono">(Gemmayze, Beirut)</span></h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal">A women-led social enterprise specializing in sourdough. They are notable for working with farmers in the Bekaa region to revive ancient, heirloom wheat varieties, which they stone-mill locally.</p>
                </div>
                <div className="space-y-1 border-t border-neutral-100 pt-3">
                  <h4 className="font-serif font-bold text-neutral-900">Chamsine Bakery</h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal">A long-standing staple (est. 1980) with multiple branches across Lebanon. They offer a vast range of products, from traditional Arabic bread and manakish to pastries and cakes, maintaining a balance between industrial scale and artisanal technique.</p>
                </div>
                <div className="space-y-1 border-t border-neutral-100 pt-3">
                  <h4 className="font-serif font-bold text-neutral-900">Al Hamra Bakery <span className="text-[10px] text-neutral-400 font-mono">(Hamra, Beirut)</span></h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal">A classic go-to for authentic Lebanese breakfast items, particularly known for their manakish and traditional pastries.</p>
                </div>
                <div className="space-y-1 border-t border-neutral-100 pt-3">
                  <h4 className="font-serif font-bold text-neutral-900">Des Choux et des Idees <span className="text-[10px] text-neutral-400 font-mono">(Ashrafieh, Beirut)</span></h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal">A sophisticated patisserie that blends French technique with innovative local flavors—highly regarded for their tarts and éclairs.</p>
                </div>
                <div className="space-y-1 border-t border-neutral-100 pt-3">
                  <h4 className="font-serif font-bold text-neutral-900">OH! Bakehouse <span className="text-[10px] text-neutral-400 font-mono">(Ashrafieh, Beirut)</span></h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal">A specialized bakery catering to health-conscious diners, offering a range of gluten-free, dairy-free, and refined-sugar-free baked goods without compromising on quality.</p>
                </div>
              </div>
            </div>

            {/* Local Produce & Bio Farms */}
            <div className="bg-white border border-neutral-250 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-5 text-left">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-700 border border-emerald-200">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-950">Local Produce & Bio-Farms</h3>
              </div>

              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                The farm-to-table movement in Lebanon is robust, with several key players focusing on organic certification and sustainable rural development.
              </p>

              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-neutral-900">Biomass</h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal">One of the most recognized names in organic produce in Lebanon. They are EU-certified growers and distributors, offering a wide assortment of fresh fruits, vegetables, and herbs grown ethically.</p>
                </div>
                <div className="space-y-1 border-t border-neutral-100 pt-3">
                  <h4 className="font-serif font-bold text-neutral-900">Farmboise <span className="text-[10px] text-neutral-400 font-mono">(Qalaa, Mount Lebanon)</span></h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal">An innovative bio-farm initiative that focuses on high-quality berries (raspberries, redcurrants, etc.) and is expanding into other premium produce like tomatoes and avocados. They emphasize sustainability and education, often partnering with the American University of Beirut (AUB).</p>
                </div>
                <div className="space-y-1 border-t border-neutral-105 pt-3">
                  <h4 className="font-serif font-bold text-neutral-900">Agro Cedrus</h4>
                  <p className="text-[11px] text-neutral-605 font-light leading-normal">A cluster of farmers focused on high-quality organic aromatic herbs (thyme, sage, rosemary, etc.), ensuring good farming practices and fair income for local producers.</p>
                </div>
                <div className="space-y-1 border-t border-neutral-100 pt-3">
                  <h4 className="font-serif font-bold text-neutral-900">Agreen Organics</h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal">Known for pesticide-free fruits and vegetables, including apples and potatoes, while adhering to fair-trade guidelines and prioritizing women's empowerment.</p>
                </div>
              </div>
            </div>

            {/* Convenient Takeaways */}
            <div className="bg-white border border-neutral-250 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-5 text-left">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-700 border border-emerald-250">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-950">Convenient Takeaways</h3>
              </div>

              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                With the rise of delivery platforms like Toters, access to "home-style" meals has become seamless.
              </p>

              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-neutral-900">Kitchen of Mamita <span className="text-[10px] text-neutral-400 font-mono">(Beirut)</span></h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal">Operates with a focus on "homestyle" Lebanese comfort food, positioning itself as a convenient option for those seeking the taste of a traditional home-cooked meal without the kitchen effort.</p>
                </div>
                <div className="space-y-1 border-t border-neutral-100 pt-3">
                  <h4 className="font-serif font-bold text-neutral-900">Haddad Sweets <span className="text-[10px] text-neutral-400 font-mono">(Regional)</span></h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal font-sans">Famous for specific regional delicacies, such as <span className="italic">halawet a'rozz</span> (rice cheese roll), providing traditional premium takeaway options.</p>
                </div>
                <div className="space-y-1 border-t border-neutral-100 pt-3">
                  <h4 className="font-serif font-bold text-neutral-900">Al Gondoline Sweets <span className="text-[10px] text-neutral-400 font-mono">(Regional)</span></h4>
                  <p className="text-[11px] text-neutral-600 font-light leading-normal">Noted for deep black <span className="italic">qazha</span> or Nigella seed desserts which often yield magnificent take-home choices.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

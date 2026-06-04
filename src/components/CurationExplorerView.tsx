import { useState, useMemo } from 'react';
import { Restaurant } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import { ChefHat, MapPin, Award, Compass, Heart, ArrowRight, Grid } from 'lucide-react';

interface CurationExplorerProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onNavigateTab: (tab: string) => void;
  savedRestaurantIds: string[];
  onToggleSaveRestaurant: (id: string) => void;
}

type ExplorerSubTab = 'cuisines' | 'neighborhoods' | 'best-choice';

export default function CurationExplorerView({
  onSelectRestaurant,
  onNavigateTab,
  savedRestaurantIds,
  onToggleSaveRestaurant
}: CurationExplorerProps) {
  const [subTab, setSubTab] = useState<ExplorerSubTab>('cuisines');
  
  // Filtering and active selection states
  const [activeCuisineFilter, setActiveCuisineFilter] = useState<string>('All');
  const [activeNeighborhoodFilter, setActiveNeighborhoodFilter] = useState<string>('All');

  // Cuisines lists and descriptions
  const cuisineCollections = useMemo(() => {
    return [
      { name: 'Traditional Lebanese', image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600', desc: 'Opulent plates celebrating authentic Levantine mezza, warm flatbreads, and charcoal-grilled lamb.' },
      { name: 'Traditional coastal seafood', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600', desc: 'Sun-drenched seaside catches baked with wild olive oil, native sumac, and garlic.' },
      { name: 'Progressive Mediterranean', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', desc: 'Innovative, modern charcoal bistronomy featuring high-heat organic roasted vegetables.' },
      { name: 'Armenian-Lebanese Homestyle', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=600', desc: 'Comforting heritage dishes baked with sweet-and-sour fruit reductions and warm spices.' },
      { name: 'Gourmet Pubs', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600', desc: 'Outstanding microbrews and local mountain-herb cocktails accompanied by upscale burgers.' },
      { name: 'Sweets & Desserts', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600', desc: 'Flawless traditional pastries layered with grass-fed butter and fresh clotted ashta cream.' }
    ];
  }, []);

  // Neighborhood list and descriptions
  const neighborhoodCollections = useMemo(() => {
    return [
      { name: 'Achrafieh', city: 'Beirut', desc: 'Historic cobblestone alleys housing majestic villas and authentic mezza sanctuaries.' },
      { name: 'Mar Mikhael', city: 'Beirut', desc: 'A bohemian arts quadrant fusing traditional Lebanese homes with progressive mixology.' },
      { name: 'Old Souks & Coast', city: 'Byblos', desc: 'Breathtaking beachfront dining and fusion lounges in pre-historical ancient alleys.' },
      { name: 'Batroun Coastline', city: 'Batroun', desc: 'Surfers paradise with rustic beach clubs, sunset bonfires, and local organic craft beers.' },
      { name: 'Tripoli Ancient Palace', city: 'Tripoli', desc: 'Historic majestic alleys celebrating legendary Lebanese sweets and ancestral baking.' },
      { name: 'Badaro Avenue', city: 'Beirut', desc: 'Warm tree-lined neighborhood featuring local breakfast fawat as well as comforting hubs.' }
    ];
  }, []);

  // Curated Best Choice tour packages/collections
  const bestChoiceSelections = useMemo(() => {
    return [
      {
        id: 'bc-1',
        title: 'The Lebanese Traditional Grand Tour',
        badge: 'Top Curator Pick',
        desc: 'A comprehensive, opulent journey spanning Beirut\'s grandest tasting palaces, raw delicacies, and historic live acoustic Tarab sounds.',
        tags: ['Levantine Traditional', 'Opulent Decor', 'Live Tarab'],
        featuredId: 'rest-1', // Em Sherif
        bgImage: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'bc-2',
        title: 'Coastal Jbeil Seafood Escape',
        badge: 'Scenic Waterfront',
        desc: 'Overlooking spectacular Mediterranean water, this escape features fresh, ancient-preparation coastal red mullet paired with cold local wines.',
        tags: ['Mediterranean Sea', 'Al Fresco', 'Ancient Flavors'],
        featuredId: 'rest-3', // Babel Bahr
        bgImage: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'bc-3',
        title: 'Batroun Bay Sunsets & Microbeer',
        badge: 'Sunset High-Vibe',
        desc: 'Explore the beachfront of Batroun with organic beer tasting, fresh surf sea urchins, and bonfires under the beautiful night skies.',
        tags: ['Craft Microbrew', 'Wave Sundeck', 'Coastal DJs'],
        featuredId: 'rest-13', // Pierre & Friends
        bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600'
      }
    ];
  }, []);

  // Filter restaurants dynamically
  const filteredOutput = useMemo(() => {
    return RESTAURANTS.filter(r => {
      if (subTab === 'cuisines') {
        if (activeCuisineFilter === 'All') return true;
        return r.cuisine.toLowerCase().includes(activeCuisineFilter.toLowerCase()) || 
               activeCuisineFilter.toLowerCase().includes(r.cuisine.toLowerCase());
      } else if (subTab === 'neighborhoods') {
        if (activeNeighborhoodFilter === 'All') return true;
        // Match approximate neighborhood keywords in address or description
        return r.address.toLowerCase().includes(activeNeighborhoodFilter.toLowerCase()) ||
               r.description.toLowerCase().includes(activeNeighborhoodFilter.toLowerCase());
      }
      return true;
    });
  }, [subTab, activeCuisineFilter, activeNeighborhoodFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-neutral-900" id="curation-explorer-view">
      
      {/* Editorial Title Banner */}
      <div className="mb-8 border-b border-neutral-200 pb-4.5 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4">
        <div>
          <h2 className="font-serif font-light text-3xl text-neutral-900 flex items-center gap-2.5">
            <Compass className="w-8 h-8 text-red-650" />
            <span>Categorical Curation & Guides</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl font-light">
            Independently audited segments sorted by technical cuisine artistry, cultural neighborhoods, and premium curated Best Choice lists.
          </p>
        </div>

        {/* Curation Sub-Tabs Selection Bar */}
        <div className="flex bg-neutral-100 border border-neutral-200 p-1 rounded-xl">
          <button
            onClick={() => { setSubTab('cuisines'); setActiveCuisineFilter('All'); }}
            className={`px-4.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'cuisines'
                ? 'bg-red-600 text-white shadow'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
          >
            <ChefHat className="w-4.5 h-4.5" />
            <span>Elite Cuisines</span>
          </button>
          
          <button
            onClick={() => { setSubTab('neighborhoods'); setActiveNeighborhoodFilter('All'); }}
            className={`px-4.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'neighborhoods'
                ? 'bg-red-600 text-white shadow'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
          >
            <MapPin className="w-4.5 h-4.5" />
            <span>Scenic Neighborhoods</span>
          </button>

          <button
            onClick={() => setSubTab('best-choice')}
            className={`px-4.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'best-choice'
                ? 'bg-red-600 text-white shadow'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
          >
            <Award className="w-4.5 h-4.5" />
            <span>Best Choice Picks</span>
          </button>
        </div>
      </div>

      {/* CORE VIEW: ELITE CUISINES EXPLORER */}
      {subTab === 'cuisines' && (
        <div className="space-y-8 animate-fade-in text-left">
          {/* Main Grid categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cuisineCollections.map((c) => (
              <div
                key={c.name}
                onClick={() => setActiveCuisineFilter(c.name)}
                className={`relative group rounded-xl overflow-hidden border transition-all cursor-pointer h-40 ${
                  activeCuisineFilter.toLowerCase() === c.name.toLowerCase()
                    ? 'border-red-600 shadow-md scale-[1.01] ring-1 ring-red-500/10 bg-red-50/5'
                    : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="absolute inset-0">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-all" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                </div>
                <div className="absolute bottom-4 left-5 right-5 space-y-1 z-10">
                  <span className="text-[9px] font-mono tracking-widest text-red-600 font-bold uppercase">Zaytounada Category</span>
                  <h4 className="font-serif font-bold text-base text-neutral-950">{c.name}</h4>
                  <p className="text-[10px] text-neutral-600 font-light leading-tight">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-8">
            <div className="flex justify-between items-baseline mb-5">
              <h3 className="font-serif font-light text-xl text-neutral-900 flex items-center gap-2">
                <Grid className="w-4.5 h-4.5 text-neutral-400" />
                <span>Culinary Results for: <span className="text-red-650 italic font-medium">"{activeCuisineFilter}"</span></span>
              </h3>
              {activeCuisineFilter !== 'All' && (
                <button
                  onClick={() => setActiveCuisineFilter('All')}
                  className="text-[9px] text-neutral-500 hover:text-neutral-800 font-mono uppercase tracking-widest cursor-pointer"
                >
                  View All Culinary Offerings
                </button>
              )}
            </div>

            {/* List matching results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-neutral-50 p-4 rounded-xl border border-neutral-200 shadow-inner">
              {filteredOutput.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectRestaurant(m)}
                  className="bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all hover:scale-[1.01] shadow-xs"
                >
                  <div className="flex items-center gap-3 w-full">
                    <img src={m.imageUrl} alt={m.name} className="w-11 h-11 object-cover rounded border border-neutral-100" referrerPolicy="no-referrer" />
                    <div className="truncate flex-1">
                      <span className="font-serif font-bold text-sm text-neutral-950 block">{m.name}</span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5 leading-tight">{m.city} • {m.cuisine}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-amber-550 block text-xs tracking-tighter">
                      {'✻'.repeat(m.stars || 1)}
                    </span>
                    <span className="text-[8px] font-mono text-neutral-400 uppercase mt-1 tracking-wider">{m.priceRange}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CORE VIEW: SCENIC NEIGHBORHOODS EXPLORER */}
      {subTab === 'neighborhoods' && (
        <div className="space-y-8 animate-fade-in text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {neighborhoodCollections.map((nb) => (
              <div
                key={nb.name}
                onClick={() => setActiveNeighborhoodFilter(nb.name)}
                className={`p-5 rounded-xl border text-left transition-all cursor-pointer space-y-3.5 ${
                  activeNeighborhoodFilter.toLowerCase() === nb.name.toLowerCase()
                    ? 'bg-red-50/50 border-red-550 text-neutral-900 shadow-md scale-[1.01]'
                    : 'bg-white border-neutral-200 hover:border-neutral-350 hover:bg-neutral-50/50 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${activeNeighborhoodFilter.toLowerCase() === nb.name.toLowerCase() ? 'text-red-500' : 'text-neutral-450'}`} />
                    <span className="font-serif font-bold text-sm text-neutral-950">{nb.name}</span>
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200">
                    {nb.city}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed font-light">{nb.desc}</p>
                <div className="flex justify-end pt-1">
                  <span className="text-[9px] text-red-650 font-mono tracking-widest flex items-center gap-1">
                    <span>Survey Directory</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-8">
            <div className="flex justify-between items-baseline mb-5">
              <h3 className="font-serif font-light text-xl text-neutral-900 flex items-center gap-2">
                <Grid className="w-4.5 h-4.5 text-neutral-400" />
                <span>Culinary Results for: <span className="text-red-650 italic font-medium">"{activeNeighborhoodFilter}" Area</span></span>
              </h3>
              {activeNeighborhoodFilter !== 'All' && (
                <button
                  onClick={() => setActiveNeighborhoodFilter('All')}
                  className="text-[9px] text-neutral-500 hover:text-neutral-800 font-mono uppercase tracking-widest cursor-pointer"
                >
                  View All Areas
                </button>
              )}
            </div>

            {/* List matching results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-neutral-50 p-4 rounded-xl border border-neutral-200 shadow-inner">
              {filteredOutput.length === 0 ? (
                <div className="py-8 font-serif italic text-neutral-450 text-center col-span-full">
                  No matching registered directories inside this area yet. Try another scenic location!
                </div>
              ) : (
                filteredOutput.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onSelectRestaurant(m)}
                    className="bg-white border border-neutral-200 hover:border-neutral-350 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all hover:scale-[1.01] shadow-xs"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <img src={m.imageUrl} alt={m.name} className="w-11 h-11 object-cover rounded border border-neutral-100" referrerPolicy="no-referrer" />
                      <div className="truncate flex-1">
                        <span className="font-serif font-bold text-sm text-neutral-95 block">{m.name}</span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5 leading-tight">{m.cuisine} • Chef {m.chef}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-amber-550 block text-xs tracking-tighter animate-pulse text-amber-500">
                        {'✻'.repeat(m.stars || 1)}
                      </span>
                      <span className="text-[8px] font-mono text-neutral-450 uppercase mt-1 tracking-wider">{m.priceRange}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CORE VIEW: EDITOR'S BEST CHOICE */}
      {subTab === 'best-choice' && (
        <div className="space-y-8 animate-fade-in text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bestChoiceSelections.map((bc) => {
              const matchingRestaurant = RESTAURANTS.find(res => res.id === bc.featuredId);
              return (
                <div
                  key={bc.id}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:border-neutral-300 hover:shadow-md transition-all flex flex-col h-full"
                >
                  <div className="relative h-48 w-full bg-neutral-100">
                    <img src={bc.bgImage} alt={bc.title} className="w-full h-full object-cover opacity-85" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                    <span className="absolute top-4 left-4 text-[9px] font-mono uppercase bg-red-650 text-white font-extrabold px-2.5 py-1 rounded shadow">
                      {bc.badge}
                    </span>
                  </div>

                  <div className="p-5.5 flex-1 flex flex-col justify-between space-y-5 bg-white">
                    <div className="space-y-3">
                      <h4 className="font-serif font-bold text-lg text-neutral-950 leading-tight">{bc.title}</h4>
                      <p className="text-[11.5px] text-neutral-600 leading-relaxed font-light">{bc.desc}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {bc.tags.map(t => (
                          <span key={t} className="text-[8px] font-mono uppercase bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded text-neutral-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {matchingRestaurant && (
                      <div className="pt-4 border-t border-neutral-100">
                        <span className="text-[9px] font-mono uppercase text-neutral-450 block mb-2.5 tracking-wider font-semibold">FEATURED ESTABLISHMENT:</span>
                        <div 
                          onClick={() => onSelectRestaurant(matchingRestaurant)}
                          className="p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={matchingRestaurant.imageUrl} alt={matchingRestaurant.name} className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                            <div>
                              <span className="font-serif text-xs font-bold block text-neutral-900">{matchingRestaurant.name}</span>
                              <span className="text-[9px] text-neutral-500 block mt-0.5">{matchingRestaurant.city} • {matchingRestaurant.cuisine}</span>
                            </div>
                          </div>
                          <span className="text-amber-550 block text-xs tracking-tighter shrink-0 mb-2">
                            {'✻'.repeat(matchingRestaurant.stars || 1)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick interactive call to action */}
          <div className="bg-gradient-to-r from-red-50 via-orange-50/20 to-transparent border border-red-200/60 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left shadow-sm">
            <div className="space-y-1 max-w-xl">
              <span className="text-[9px] font-mono uppercase text-red-600 font-extrabold tracking-widest block font-bold">Interactive AI Planner</span>
              <h4 className="font-serif text-lg text-neutral-950 font-bold">Unsure which elite choice represents your path?</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Give our high-end **Plan My Dining** counselor 30 seconds to coordinate exact cuisine styles and seating layouts custom to your parameters.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('plan-dining')}
              className="px-5.5 py-3.5 bg-red-600 hover:bg-red-650 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all shrink-0 cursor-pointer shadow-sm shadow-red-500/25"
            >
              Start Plan Dining Wizard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

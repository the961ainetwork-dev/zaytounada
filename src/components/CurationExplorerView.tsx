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
      { name: 'Traditional coastal seafood', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600', desc: 'Sun-drenched seaside catches baked with wild olive oil, native sumac, and garlic.' },
      { name: 'Progressive Mediterranean', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600', desc: 'Innovative, modern charcoal bistronomy featuring high-heat organic roasted vegetables.' },
      { name: 'Armenian-Lebanese Homestyle', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600', desc: 'Comforting heritage dishes baked with sweet-and-sour fruit reductions and warm spices.' },
      { name: 'Gourmet Pubs', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600', desc: 'Outstanding microbrews and local mountain-herb cocktails accompanied by upscale burgers.' },
      { name: 'Sweets & Desserts', image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=600', desc: 'Flawless traditional pastries layered with grass-fed butter and fresh clotted ashta cream.' }
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
        bgImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'bc-2',
        title: 'Coastal Jbeil Seafood Escape',
        badge: 'Scenic Waterfront',
        desc: 'Overlooking spectacular Mediterranean water, this escape features fresh, ancient-preparation coastal red mullet paired with cold local wines.',
        tags: ['Mediterranean Sea', 'Al Fresco', 'Ancient Flavors'],
        featuredId: 'rest-3', // Babel Bahr
        bgImage: 'https://images.unsplash.com/photo-1550966842-2849a2202022?auto=format&fit=crop&q=80&w=600'
      },
      {
        id: 'bc-3',
        title: 'Batroun Bay Sunsets & Microbeer',
        badge: 'Sunset High-Vibe',
        desc: 'Explore the beachfront of Batroun with organic beer tasting, fresh surf sea urchins, and bonfires under the beautiful night skies.',
        tags: ['Craft Microbrew', 'Wave Sundeck', 'Coastal DJs'],
        featuredId: 'rest-13', // Pierre & Friends
        bgImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="curation-explorer-view">
      
      {/* Editorial Title Banner */}
      <div className="mb-8 border-b border-white/5 pb-4.5 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4">
        <div>
          <h2 className="font-serif font-light text-3xl text-white flex items-center gap-2.5">
            <Compass className="w-8 h-8 text-red-500" />
            <span>Categorical Curation & Guides</span>
          </h2>
          <p className="text-xs text-white/40 mt-1 max-w-xl font-light">
            Independently audited segments sorted by technical cuisine artistry, cultural neighborhoods, and premium curated Best Choice lists.
          </p>
        </div>

        {/* Curation Sub-Tabs Selection Bar */}
        <div className="flex bg-neutral-900 border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => { setSubTab('cuisines'); setActiveCuisineFilter('All'); }}
            className={`px-4.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              subTab === 'cuisines'
                ? 'bg-red-650 text-white shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ChefHat className="w-4.5 h-4.5 inline-block mr-1.5 -mt-0.5" />
            <span>Elite Cuisines</span>
          </button>
          
          <button
            onClick={() => { setSubTab('neighborhoods'); setActiveNeighborhoodFilter('All'); }}
            className={`px-4.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              subTab === 'neighborhoods'
                ? 'bg-red-650 text-white shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <MapPin className="w-4.5 h-4.5 inline-block mr-1.5 -mt-0.5" />
            <span>Scenic Neighborhoods</span>
          </button>

          <button
            onClick={() => setSubTab('best-choice')}
            className={`px-4.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              subTab === 'best-choice'
                ? 'bg-red-650 text-white shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Award className="w-4.5 h-4.5 inline-block mr-1.5 -mt-0.5" />
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
                    ? 'border-red-500 shadow-2xl scale-[1.01] ring-1 ring-red-500/10'
                    : 'border-white/5 bg-[#0a0a0a] hover:border-white/10'
                }`}
              >
                <div className="absolute inset-0">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-all" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-4 left-5 right-5 space-y-1">
                  <span className="text-[9px] font-mono tracking-widest text-red-500 font-bold uppercase">Zaytouynda Category</span>
                  <h4 className="font-serif font-bold text-base text-white/95">{c.name}</h4>
                  <p className="text-[10px] text-white/40 font-light leading-tight">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8">
            <div className="flex justify-between items-baseline mb-5">
              <h3 className="font-serif font-light text-xl text-[#F5F5F5] flex items-center gap-2">
                <Grid className="w-4.5 h-4.5 text-white/40" />
                <span>Culinary Results for: <span className="text-red-400 italic">"{activeCuisineFilter}"</span></span>
              </h3>
              {activeCuisineFilter !== 'All' && (
                <button
                  onClick={() => setActiveCuisineFilter('All')}
                  className="text-[9px] text-white/40 hover:text-white font-mono uppercase tracking-widest cursor-pointer"
                >
                  View All Culinary Offerings
                </button>
              )}
            </div>

            {/* List matching results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-neutral-950 p-4 rounded-xl border border-white/5">
              {filteredOutput.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectRestaurant(m)}
                  className="bg-[#0a0a0a] border border-white/5 hover:border-white/15 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3 w-full">
                    <img src={m.imageUrl} alt={m.name} className="w-11 h-11 object-cover rounded border border-white/10" referrerPolicy="no-referrer" />
                    <div className="truncate flex-1">
                      <span className="font-serif font-bold text-sm text-white/95">{m.name}</span>
                      <span className="text-[10px] text-white/40 block mt-0.5 leading-tight">{m.city} • {m.cuisine}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-amber-300 block text-xs tracking-tighter">
                      {'✻'.repeat(m.stars || 1)}
                    </span>
                    <span className="text-[8px] font-mono text-white/30 uppercase mt-1 tracking-wider">{m.priceRange}</span>
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
                    ? 'bg-red-650/15 border-red-550/45 text-white shadow-xl'
                    : 'bg-[#0a0a0a] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${activeNeighborhoodFilter.toLowerCase() === nb.name.toLowerCase() ? 'text-red-500' : 'text-white/45'}`} />
                    <span className="font-serif font-bold text-sm text-white/95">{nb.name}</span>
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-neutral-900 text-white/40 px-2 py-0.5 rounded border border-white/5">
                    {nb.city}
                  </span>
                </div>
                <p className="text-[11px] text-white/45 leading-relaxed font-light">{nb.desc}</p>
                <div className="flex justify-end pt-1">
                  <span className="text-[9px] text-red-400 font-mono tracking-widest flex items-center gap-1">
                    <span>Survey Directory</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8">
            <div className="flex justify-between items-baseline mb-5">
              <h3 className="font-serif font-light text-xl text-[#F5F5F5] flex items-center gap-2">
                <Grid className="w-4.5 h-4.5 text-white/40" />
                <span>Culinary Results for: <span className="text-red-400 italic">"{activeNeighborhoodFilter}" Area</span></span>
              </h3>
              {activeNeighborhoodFilter !== 'All' && (
                <button
                  onClick={() => setActiveNeighborhoodFilter('All')}
                  className="text-[9px] text-white/40 hover:text-white font-mono uppercase tracking-widest cursor-pointer"
                >
                  View All Areas
                </button>
              )}
            </div>

            {/* List matching results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-neutral-950 p-4 rounded-xl border border-white/5">
              {filteredOutput.length === 0 ? (
                <div className="py-8 font-serif italic text-white/35 text-center col-span-full">
                  No matching registered directories inside this area yet. Try another scenic location!
                </div>
              ) : (
                filteredOutput.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onSelectRestaurant(m)}
                    className="bg-[#0a0a0a] border border-white/5 hover:border-white/15 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <img src={m.imageUrl} alt={m.name} className="w-11 h-11 object-cover rounded border border-white/10" referrerPolicy="no-referrer" />
                      <div className="truncate flex-1">
                        <span className="font-serif font-bold text-sm text-white/95">{m.name}</span>
                        <span className="text-[10px] text-white/40 block mt-0.5 leading-tight">{m.cuisine} • Chef {m.chef}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-amber-300 block text-xs tracking-tighter">
                        {'✻'.repeat(m.stars || 1)}
                      </span>
                      <span className="text-[8px] font-mono text-white/30 uppercase mt-1 tracking-wider">{m.priceRange}</span>
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
                  className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-white/10 transition-all flex flex-col h-full"
                >
                  <div className="relative h-48 w-full">
                    <img src={bc.bgImage} alt={bc.title} className="w-full h-full object-cover opacity-35" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 text-[9px] font-mono uppercase bg-red-650 text-white font-extrabold px-2.5 py-1 rounded shadow">
                      {bc.badge}
                    </span>
                  </div>

                  <div className="p-5.5 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <h4 className="font-serif font-bold text-lg text-white/90 leading-tight">{bc.title}</h4>
                      <p className="text-[11.5px] text-white/45 leading-relaxed font-light">{bc.desc}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {bc.tags.map(t => (
                          <span key={t} className="text-[8px] font-mono uppercase bg-white/5 border border-white/15 px-2 py-0.5 rounded text-white/50">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {matchingRestaurant && (
                      <div className="pt-4 border-t border-white/5">
                        <span className="text-[9px] font-mono uppercase text-white/35 block mb-2.5 tracking-wider">FEATURED ESTABLISHMENT:</span>
                        <div 
                          onClick={() => onSelectRestaurant(matchingRestaurant)}
                          className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={matchingRestaurant.imageUrl} alt={matchingRestaurant.name} className="w-10 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                            <div>
                              <span className="font-serif text-xs font-bold block text-white/90">{matchingRestaurant.name}</span>
                              <span className="text-[9px] text-white/40 block mt-0.5">{matchingRestaurant.city} • {matchingRestaurant.cuisine}</span>
                            </div>
                          </div>
                          <span className="text-amber-300 block text-xs tracking-tighter shrink-0 mb-2">
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
          <div className="bg-gradient-to-r from-red-600/15 via-orange-600/5 to-transparent border border-red-500/10 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="space-y-1 max-w-xl">
              <span className="text-[9px] font-mono uppercase text-red-500 font-extrabold tracking-widest block">Interactive AI Planner</span>
              <h4 className="font-serif text-lg text-white font-bold">Unsure which elite choice represents your path?</h4>
              <p className="text-xs text-white/45 leading-relaxed font-light">
                Give our high-end **Plan My Dining** counselor 30 seconds to coordinate exact cuisine styles and seating layouts custom to your parameters.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('plan-dining')}
              className="px-5.5 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all shrink-0 cursor-pointer shadow-md"
            >
              Start Plan Dining Wizard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

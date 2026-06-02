import { MouseEvent, useState } from 'react';
import { Restaurant } from '../types';
import { Award, MapPin, DollarSign, Heart, ArrowRight, Share2, Check } from 'lucide-react';

interface RestaurantCardProps {
  key?: string | number;
  restaurant: Restaurant;
  onSelect: () => void;
  isSaved: boolean;
  onToggleSave: (e: MouseEvent) => void;
}

export default function RestaurantCard({
  restaurant,
  onSelect,
  isSaved,
  onToggleSave
}: RestaurantCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: MouseEvent) => {
    e.stopPropagation();
    const deepLink = `${window.location.origin}${window.location.pathname}?restaurant=${restaurant.id}`;
    navigator.clipboard.writeText(deepLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
      });
  };
  
  // Render Star Rosettes in Premium Emerald green and Gold Yellow
  const renderDistinctionBadge = () => {
    switch (restaurant.distinction) {
      case 'STAR_3':
        return (
          <div className="flex items-center gap-1.5 bg-emerald-900 text-white font-serif px-3 py-1.5 uppercase tracking-wider text-[10px] font-bold border border-amber-400/65 shadow-md rounded">
            <span className="text-amber-400 font-bold text-xs tracking-tighter">✻ ✻ ✻</span>
            <span className="text-amber-100 font-mono tracking-widest text-[9px]">3 Zaytouynda Stars</span>
          </div>
        );
      case 'STAR_2':
        return (
          <div className="flex items-center gap-1.5 bg-emerald-850 bg-emerald-800 text-white font-serif px-3 py-1.5 uppercase tracking-wider text-[10px] font-bold border border-amber-400/40 shadow-sm rounded">
            <span className="text-amber-400 font-bold text-xs tracking-tighter">✻ ✻</span>
            <span className="text-amber-100 font-mono tracking-widest text-[9px]">2 Zaytouynda Stars</span>
          </div>
        );
      case 'STAR_1':
        return (
          <div className="flex items-center gap-1.5 bg-emerald-800/90 text-white font-serif px-3 py-1.5 uppercase tracking-wider text-[10px] font-bold border border-emerald-500/30 shadow-sm rounded">
            <span className="text-amber-400 font-bold text-xs tracking-tighter">✻</span>
            <span className="text-amber-100 font-mono tracking-widest text-[9px]">1 Zaytouynda Star</span>
          </div>
        );
      case 'BIB_GOURMAND':
        return (
          <div className="flex items-center gap-1 bg-amber-50 text-emerald-850 border border-amber-300 px-3 py-1.5 uppercase tracking-widest text-[9px] font-bold shadow-sm rounded">
            <span className="text-amber-550 font-bold">☺</span>
            <span className="text-emerald-800 font-mono tracking-wider font-extrabold">Bib Gourmand</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 bg-white/95 text-neutral-700 border border-neutral-250 px-2.5 py-1.5 uppercase tracking-widest text-[9px] shadow-sm rounded">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono text-[9px] font-semibold text-neutral-600">Selected Spot</span>
          </div>
        );
    }
  };

  return (
    <div 
      id={`restaurant-${restaurant.id}`}
      onClick={onSelect}
      className="group relative bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-sm hover:border-emerald-600/35 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Restaurant Image Panel - Significantly increased heights to h-72 / sm:h-80 for cinematic visual scale */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-neutral-150">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover saturate-105 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/40 opacity-80" />
        
        {/* Distinction Placement */}
        <div className="absolute top-4 left-4 z-10">
          {renderDistinctionBadge()}
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className={`absolute top-4 right-14 z-10 flex items-center justify-center w-9 h-9 bg-neutral-900/85 backdrop-blur-md rounded-full border border-white/10 transition-all transform hover:scale-110 active:scale-95 cursor-pointer ${
            copied ? 'text-emerald-400 hover:text-emerald-300' : 'text-white/90 hover:text-amber-400'
          }`}
          title={copied ? "Link Copied!" : "Share Gourmet Deep-link"}
          id={`share-btn-${restaurant.id}`}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400 animate-pulse" /> : <Share2 className="w-4.5 h-4.5" />}
        </button>

        {/* Save button with beautiful Amber Golden fill dynamic */}
        <button
          onClick={onToggleSave}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 bg-neutral-900/85 backdrop-blur-md rounded-full text-white/90 hover:text-amber-400 border border-white/10 transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          title={isSaved ? "Remove from Saved Guides" : "Save to Guides"}
          id={`save-btn-${restaurant.id}`}
        >
          <Heart className={`w-4.5 h-4.5 transition-all ${isSaved ? 'fill-amber-400 text-amber-400 scale-110' : 'text-neutral-200'}`} />
        </button>

        {/* Location overlay label */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono tracking-wide text-[11px]">{restaurant.city}, {restaurant.country}</span>
          </div>
          <div className="flex items-center gap-0.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/5" title={`Budget: ${restaurant.priceRange}`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <DollarSign 
                key={i} 
                className={`w-3 h-3 ${i < restaurant.priceRange.length ? 'text-amber-400 font-black' : 'text-white/20'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Narrative & Details Area */}
      <div className="p-5.5 flex-1 flex flex-col justify-between bg-white text-neutral-900 border-t border-neutral-100">
        <div>
          {/* Cuisine Line in yellow-green theme */}
          <span className="text-[10px] font-bold tracking-[0.25em] text-emerald-700 uppercase block font-mono">
            {restaurant.cuisine}
          </span>

          {/* Restaurant Corporate Name */}
          <h3 className="font-serif text-xl font-bold text-neutral-950 mt-2 leading-tight group-hover:text-emerald-850 transition-colors">
            {restaurant.name}
          </h3>

          {/* Chef Citation */}
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-neutral-500">
            <span className="font-serif italic text-neutral-400">Chef de Cuisine:</span>
            <span className="font-semibold text-neutral-700">{restaurant.chef}</span>
          </div>

          {/* Short Narrative */}
          <p className="text-neutral-600 text-xs leading-relaxed mt-3 line-clamp-3 font-light">
            {restaurant.description}
          </p>

          {/* Inspector Highlight Snippet with subtle emerald side border */}
          <div className="mt-4 p-3 bg-neutral-50/70 border-l-3 border-emerald-600 rounded-r-lg text-[11px] text-neutral-700 italic leading-relaxed">
            "{restaurant.inspectorNote.substring(0, 110)}..."
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
          <span>UID: {restaurant.id}</span>
          <span className="flex items-center gap-1 h-5 font-bold text-neutral-700 group-hover:text-emerald-700 transition-colors uppercase tracking-widest text-[9px]">
            <span>Inspectors Evaluation</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-600" />
          </span>
        </div>
      </div>
    </div>
  );
}

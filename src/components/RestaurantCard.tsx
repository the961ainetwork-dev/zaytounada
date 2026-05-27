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
  
  // Render Star Rosettes
  const renderDistinctionBadge = () => {
    switch (restaurant.distinction) {
      case 'STAR_3':
        return (
          <div className="flex items-center gap-1.5 bg-red-600 text-white font-serif px-2.5 py-1 uppercase tracking-wider text-[10px] font-bold border border-white/10">
            <span className="text-amber-400 font-bold text-xs tracking-tighter">✻ ✻ ✻</span>
            <span>3 Zaytouynda Stars</span>
          </div>
        );
      case 'STAR_2':
        return (
          <div className="flex items-center gap-1.5 bg-red-600/90 text-white font-serif px-2.5 py-1 uppercase tracking-wider text-[10px] font-bold border border-white/10">
            <span className="text-amber-400 font-bold text-xs tracking-tighter">✻ ✻</span>
            <span>2 Zaytouynda Stars</span>
          </div>
        );
      case 'STAR_1':
        return (
          <div className="flex items-center gap-1.5 bg-red-600/80 text-white font-serif px-2.5 py-1 uppercase tracking-wider text-[10px] font-bold border border-white/10">
            <span className="text-amber-400 font-bold text-xs tracking-tighter">✻</span>
            <span>1 Zaytouynda Star</span>
          </div>
        );
      case 'BIB_GOURMAND':
        return (
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md text-[#F5F5F5] border border-white/10 px-2.5 py-1 uppercase tracking-widest text-[10px] font-bold">
            <span className="text-red-500 font-bold">☺</span>
            <span>Bib Gourmand</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 bg-white/5 text-white/70 border border-white/5 px-2.5 py-1 uppercase tracking-widest text-[10px]">
            <Award className="w-3 h-3 text-white/50" />
            <span>Selected</span>
          </div>
        );
    }
  };

  return (
    <div 
      id={`restaurant-${restaurant.id}`}
      onClick={onSelect}
      className="group relative bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-lg hover:border-white/15 hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Restaurant Image Panel */}
      <div className="relative h-56 w-full overflow-hidden bg-neutral-900">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 opacity-90" />
        
        {/* Distinction Placement */}
        <div className="absolute top-3.5 left-3.5 z-10">
          {renderDistinctionBadge()}
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className={`absolute top-3.5 right-14 z-10 flex items-center justify-center w-9 h-9 bg-black/60 backdrop-blur-sm rounded-full border border-white/5 transition-all transform hover:scale-110 active:scale-95 cursor-pointer ${
            copied ? 'text-green-500 hover:text-green-400' : 'text-white/80 hover:text-red-500 hover:bg-black/80'
          }`}
          title={copied ? "Link Copied!" : "Share Gourmet Deep-link"}
          id={`share-btn-${restaurant.id}`}
        >
          {copied ? <Check className="w-4 h-4 text-green-500 animate-pulse" /> : <Share2 className="w-4.5 h-4.5" />}
        </button>

        {/* Save button */}
        <button
          onClick={onToggleSave}
          className="absolute top-3.5 right-3.5 z-10 flex items-center justify-center w-9 h-9 bg-black/60 backdrop-blur-sm rounded-full text-white/80 hover:text-red-500 hover:bg-black/80 border border-white/5 transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          title={isSaved ? "Remove from Saved Guides" : "Save to Guides"}
          id={`save-btn-${restaurant.id}`}
        >
          <Heart className={`w-4.5 h-4.5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Location overlay label */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white/90 text-xs font-light">
          <div className="flex items-center gap-1 text-white/70">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>{restaurant.city}, {restaurant.country}</span>
          </div>
          <div className="flex items-center gap-0.5" title={`Price category ${restaurant.priceRange}`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <DollarSign 
                key={i} 
                className={`w-3 h-3 ${i < restaurant.priceRange.length ? 'text-red-500 font-bold' : 'text-white/20'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Narrative & Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-[#0a0a0a]">
        <div>
          {/* Cuisine Line */}
          <span className="text-[10px] font-bold tracking-[0.25em] text-red-500 uppercase">
            {restaurant.cuisine}
          </span>

          {/* Restaurant Corporate Name */}
          <h3 className="font-serif text-lg text-[#F5F5F5] mt-1.5 leading-snug group-hover:text-red-500 transition-colors">
            {restaurant.name}
          </h3>

          {/* Chef Citation */}
          <div className="mt-1 flex items-center gap-1 text-[11px] text-white/40">
            <span className="font-serif italic text-white/30">Chef de Cuisine:</span>
            <span className="font-medium text-white/70">{restaurant.chef}</span>
          </div>

          {/* Short Narrative */}
          <p className="text-white/60 text-xs leading-relaxed mt-2.5 line-clamp-2 font-light">
            {restaurant.description}
          </p>

          {/* Inspector Highlight Snippet */}
          <div className="mt-3.5 p-2.5 bg-white/5 border-l-2 border-red-600 rounded-r-sm text-[11px] text-white/70 italic leading-relaxed">
            "{restaurant.inspectorNote.substring(0, 110)}..."
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
          <span className="font-mono">ID: {restaurant.id}</span>
          <span className="flex items-center gap-1 font-semibold text-white/70 group-hover:text-red-500 transition-colors uppercase tracking-wider text-[9px]">
            <span>Inspector Report</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-red-500" />
          </span>
        </div>
      </div>
    </div>
  );
}

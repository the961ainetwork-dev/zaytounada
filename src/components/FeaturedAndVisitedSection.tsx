import React from 'react';
import { 
  Coffee, 
  Sparkles, 
  MapPin, 
  Star, 
  ArrowRight, 
  Heart, 
  Share2, 
  Award, 
  Clock, 
  UtensilsCrossed, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { showToast } from '../utils/toast';

interface FeaturedAndVisitedSectionProps {
  onOpenFeaturePage: () => void;
  onOpenMenuExtracts: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export default function FeaturedAndVisitedSection({
  onOpenFeaturePage,
  onOpenMenuExtracts,
  isSaved = false,
  onToggleSave
}: FeaturedAndVisitedSectionProps) {

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?tab=tasty-caffee`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Deep link to Tasty Caffee copied to clipboard!');
      });
    } else {
      showToast('Link ready: ' + url);
    }
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `☕ Check out this feature on Tasty Caffee in Achrafieh, Beirut on Zaytounada Guide! Top-tier specialty coffee, 72h cardamom cruffins, and sunlit lemon-tree courtyard:\n${window.location.origin}?tab=tasty-caffee`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 text-left" id="featured-and-visited-for-you-section">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-3 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-amber-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>EDITORIAL SPOTLIGHT • VISITED & INSPECTED</span>
          </span>
          <h2 className="font-serif font-light text-2xl sm:text-3xl text-neutral-900 mt-1 uppercase tracking-wide">
            Featured and <span className="font-semibold text-emerald-800">Visited for You</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Our inspectors’ latest on-site chronicle covering elite specialty coffee, sourdough viennoiserie, and tranquil garden terroir.
          </p>
        </div>

        <button
          onClick={onOpenFeaturePage}
          className="mt-3 md:mt-0 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 px-4.5 py-2.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 w-fit"
        >
          <span>Open Dedicated Feature Page</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Feature Showcase Card */}
      <div className="bg-white border border-neutral-200 hover:border-amber-400/70 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
        
        {/* Top Decorative Amber Accent Ribbon */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-500" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Visual Showcase Carousel & Badges (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-neutral-200 shadow-inner bg-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800"
                alt="Tasty Caffee Achrafieh Beirut"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 filter saturate-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Floating Badges */}
              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                <span className="bg-amber-400 text-neutral-950 font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow">
                  ★ VISITED & VERIFIED
                </span>
                <span className="bg-emerald-900/90 text-emerald-200 backdrop-blur-xs font-mono text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/30">
                  LAUREATE 2026
                </span>
              </div>

              {/* Bottom Quick Card Info */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider block">Achrafieh, Beirut</span>
                  <h4 className="font-serif text-xl font-bold">Tasty Caffee</h4>
                </div>
                <div className="text-right">
                  <span className="bg-white/20 backdrop-blur-xs font-mono text-xs font-bold px-2 py-1 rounded-md text-amber-300 flex items-center gap-1 border border-white/20">
                    4.9 <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  </span>
                </div>
              </div>
            </div>

            {/* Micro Gallery Thumbnails */}
            <div className="grid grid-cols-3 gap-2">
              <div className="h-20 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                <img 
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=300" 
                  alt="Cardamom Cruffin" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="h-20 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                <img 
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=300" 
                  alt="V60 Pour Over" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="h-20 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                <img 
                  src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=300" 
                  alt="Fig Tartine" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Text & Menu Extracts Snippets (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Header & Distinction */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded">
                  Specialty Coffee & Artisanal Viennoiserie
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  Rue du Liban, Sursock Quarter
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-light text-neutral-900 uppercase tracking-tight leading-snug">
                Tasty Caffee: <span className="font-semibold text-emerald-900">Slow Craft, Cardamom Cruffins & Single-Origin Alchemy</span>
              </h3>
            </div>

            {/* Inspector Thoughtful Review Extract */}
            <div className="border-l-3 border-amber-400 pl-4 py-1 bg-amber-50/40 rounded-r-xl">
              <p className="text-xs sm:text-sm text-neutral-700 font-serif italic leading-relaxed">
                "Tasty Caffee is what every neighborhood cafe dreams of becoming. The aromas of freshly roasted Ethiopian Yirgacheffe and warm cardamom-infused brioche meet you at the threshold. Their signature Cardamom & Orange Blossom Cruffin is nothing short of sublime—flaky, buttery layers shattering to reveal a velvet scented cream."
              </p>
              <p className="text-[10px] font-mono text-neutral-500 font-bold mt-1.5 uppercase tracking-wider">
                — Anonymous Zaytounada Inspection Report (August 2026)
              </p>
            </div>

            {/* 3 Key Feature Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-mono text-[9px] text-amber-700 uppercase font-black block">Single-Origin Program</span>
                <span className="text-neutral-800 font-medium">Ethiopian & Chouf Micro-lots</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-mono text-[9px] text-emerald-700 uppercase font-black block">72h Laminated Bakery</span>
                <span className="text-neutral-800 font-medium">AOP Butter Cruffins & Babkas</span>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-mono text-[9px] text-neutral-700 uppercase font-black block">Garden Courtyard</span>
                <span className="text-neutral-800 font-medium">Lemon Trees & 120Mbps Wi-Fi</span>
              </div>
            </div>

            {/* Curated Menu Extracts Highlight Bar */}
            <div className="bg-neutral-900 text-white p-4 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono border-b border-white/15 pb-2">
                <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Menu Extracts Preview</span>
                </span>
                <button
                  onClick={onOpenMenuExtracts}
                  className="text-[10px] text-neutral-300 hover:text-amber-300 underline cursor-pointer"
                >
                  View all 11 extracts ➔
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="space-y-0.5">
                  <strong className="text-white text-[11px] block truncate">Ethiopian V60 Pour Over</strong>
                  <span className="text-amber-300 font-mono text-[10px] font-bold">$5.50</span>
                  <p className="text-[9.5px] text-neutral-400 truncate">Jasmine, Bergamot, White Peach</p>
                </div>
                <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-white/10 pt-1 sm:pt-0 sm:pl-2">
                  <strong className="text-white text-[11px] block truncate">Cardamom Cruffin</strong>
                  <span className="text-amber-300 font-mono text-[10px] font-bold">$4.50</span>
                  <p className="text-[9.5px] text-neutral-400 truncate">72h lamination, orange blossom</p>
                </div>
                <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-white/10 pt-1 sm:pt-0 sm:pl-2">
                  <strong className="text-white text-[11px] block truncate">Fig & Goat Labneh Tartine</strong>
                  <span className="text-amber-300 font-mono text-[10px] font-bold">$8.50</span>
                  <p className="text-[9.5px] text-neutral-400 truncate">Bekaa labneh, sourdough, honey</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onOpenFeaturePage}
                className="px-6 py-3 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-900 hover:to-emerald-800 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <span>Read Full Review & Open Page</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>

              <button
                onClick={onOpenMenuExtracts}
                className="px-4.5 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
                <span>Menu Extracts</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleSave) onToggleSave();
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
                title={isSaved ? 'Saved in Guide' : 'Save to My Guide'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : 'text-neutral-500'}`} />
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all cursor-pointer"
                title="Share on WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface Slide {
  id: number;
  mantra: string;
  tag: string;
  headline: string;
  sub: string;
  imageUrl: string;
  targetTab: string;
  targetDistinction?: string;
  actionText: string;
  badgeColor: string;
  accentColor: string;
}

interface HeroSliderProps {
  onNavigateTab: (tab: string) => void;
  onSelectDistinction?: (distinction: string) => void;
  onOpenConcierge: () => void;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    mantra: "STRICTLY FINE DINING",
    tag: "✻ SUPREME 3-STAR TEMPLES",
    headline: "Em Sherif & Authentic Levantine Palaces",
    sub: "Step into theatrical mezza banquets celebrating rich ancestral heritage with unmatched grandeur.",
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=1200",
    targetTab: "discovery",
    targetDistinction: "Stars",
    actionText: "Browse Star Gastronomy",
    badgeColor: "bg-neutral-900 text-white border-neutral-900",
    accentColor: "#000000"
  },
  {
    id: 2,
    mantra: "MEDITERRANEAN BOUND",
    tag: "⚡ GEODESIC MAP & RULER",
    headline: "Map Views & Live Measurement Planning",
    sub: "Calculate real-world distances between coastal castles and seafood spots with precision snapping.",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200",
    targetTab: "map",
    actionText: "Launch Interactive Map",
    badgeColor: "bg-neutral-900 text-white border-neutral-900",
    accentColor: "#000000"
  },
  {
    id: 3,
    mantra: "BEIRUT AFTER DARK",
    tag: "🔥 COZY PUBS & NEON VIBES",
    headline: "Rooftops, Botanical Cafes, & Live Shows",
    sub: "Experience Gemmayze coffee spots, batroun beach craft beers, and late night music halls.",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200",
    targetTab: "vibes",
    actionText: "Explore Vibes & Rhythms",
    badgeColor: "bg-neutral-900 text-white border-neutral-900",
    accentColor: "#000000"
  },
  {
    id: 4,
    mantra: "STREET FOOD LEGACY",
    tag: "🥖 HAND-BAKED BRICK CLAY OVENS",
    headline: "Furn Beaino Lahme Bajin & Zaatar Saj",
    sub: "Explore legendary flatbread bakeries, weekly food cooperatives, and local mountain micro-producers.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200",
    targetTab: "takeaways-bakeries",
    actionText: "Savor Bakery Legacy",
    badgeColor: "bg-neutral-900 text-white border-neutral-900",
    accentColor: "#000000"
  },
  {
    id: 5,
    mantra: "THE COGNITIVE COUPE",
    tag: "🔮 PURE LEBANESE AI DESK",
    headline: "AI Gourmet Concierge Assistant Desk",
    sub: "Tailor-made sequences, historical mezza secrets, and custom pairing in a true Lebanese context.",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200",
    targetTab: "concierge",
    actionText: "Initiate AI Concierge",
    badgeColor: "bg-neutral-900 text-white border-neutral-900",
    accentColor: "#000000"
  }
];

export default function HeroSlider({
  onNavigateTab,
  onSelectDistinction,
  onOpenConcierge
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const progressTimer = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalDuration = 6000; // 6 seconds per slide
      const stepTime = 50; // update progress bar every 50ms
      const totalSteps = intervalDuration / stepTime;
      let currentStep = 0;

      progressTimer.current = window.setInterval(() => {
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
      }, stepTime);

      autoplayTimer.current = setTimeout(() => {
        handleNext();
      }, intervalDuration);
    } else {
      if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
      if (progressTimer.current) clearInterval(progressTimer.current);
    }

    return () => {
      if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleDotClick = (index: number) => {
    setProgress(0);
    setCurrentIndex(index);
  };

  const handleAction = (slide: Slide) => {
    if (slide.targetTab === 'concierge') {
      onOpenConcierge();
    } else {
      if (slide.targetDistinction && onSelectDistinction) {
        onSelectDistinction(slide.targetDistinction);
      }
      onNavigateTab(slide.targetTab);
    }
  };

  const activeSlide = SLIDES[currentIndex];

  const marqueeItems = [
    "✻ OFFICIAL 2026 EDITION",
    "BEIRUT GOURMET HIGH-SOCIETY",
    "BYBLOS CITADEL DISCOVERIES",
    "BATROUN COASTAL SUNSETS",
    "TRIPOLI ANCESTRAL SWEETS",
    "100% EXCLUSIVE VETTED REPORTS",
    "ZAYTOUNADA STARDOM",
    "GEODESIC DISTANCE ANALYSIS"
  ];

  return (
    <div 
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2" 
      id="hero-editorial-image-slider"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Stark brutalist white container with thick dark borders and retro offset shadows */}
      <div className="relative rounded-2xl overflow-hidden bg-white border-2 border-neutral-900 shadow-[8px_8px_0px_#000000] flex flex-col justify-between min-h-[520px] md:min-h-[460px] transition-shadow duration-300">
        
        {/* Top Header Controls (Pure stark black on white) */}
        <div className="relative z-10 p-4 flex items-center justify-between border-b-2 border-neutral-900 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-900 font-bold">
              FEATURED REPORT {currentIndex + 1} OF {SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg border-2 border-neutral-900 text-neutral-900 bg-white hover:bg-neutral-50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-[2px_2px_0px_#000000]"
              title={isPlaying ? "Pause autoplay" : "Resume autoplay"}
              id="hero-play-pause-btn"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 stroke-[2.5px]" /> : <Play className="w-3.5 h-3.5 stroke-[2.5px]" />}
            </button>
            <span className="font-mono text-xs text-neutral-900 tracking-wider font-extrabold bg-neutral-100 px-2 py-1 rounded-md border-2 border-neutral-900">
              {(currentIndex + 1).toString().padStart(2, '0')}.
            </span>
          </div>
        </div>

        {/* Main Content Split Area: Left Side Stark Editorial, Right Side Vivid Framed Photo */}
        <div className="relative z-0 flex flex-col md:flex-row items-stretch flex-grow bg-white">
          
          {/* L panel: editorial text components */}
          <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between items-start text-left space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-4 w-full"
              >
                {/* Stark Pill Gen Z Badge */}
                <div className="inline-block">
                  <div className="px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.15em] rounded border-2 border-neutral-900 bg-neutral-950 text-white shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
                    {activeSlide.tag}
                  </div>
                </div>

                {/* Mantra Label */}
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-extrabold text-neutral-500">
                  // {activeSlide.mantra}
                </p>

                {/* Highlight Headline */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-neutral-950 uppercase font-sans">
                  {activeSlide.headline}
                </h2>

                {/* Description Paragraph */}
                <p className="text-neutral-700 text-sm leading-relaxed font-normal max-w-xl">
                  {activeSlide.sub}
                </p>

                {/* Action Button styled as hard edge offset black button */}
                <div className="pt-3">
                  <button
                    onClick={() => handleAction(activeSlide)}
                    className="group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-md bg-neutral-950 hover:bg-neutral-900 text-white border-2 border-neutral-950 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-y-[4px] transition-all duration-200 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                    id={`hero-slide-action-btn-${activeSlide.id}`}
                  >
                    <span>{activeSlide.actionText}</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* R panel: Gorgeous vivid framed photograph (visible on all screens with appropriate spacing layout) */}
          <div className="w-full md:w-5/12 min-h-[220px] md:min-h-0 relative border-t-2 md:border-t-0 md:border-l-2 border-neutral-900 overflow-hidden bg-neutral-50 flex items-stretch">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeSlide.imageUrl}
                  alt={activeSlide.headline}
                  className="w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.05]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>
            {/* Soft inner photo frame shadows */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_4px_16px_rgba(0,0,0,0.1)] md:shadow-[inset_4px_0_16px_rgba(0,0,0,0.1)]" />
          </div>

        </div>

        {/* Bottom Panel Controls, Progress dynamic updates, and Custom Scrolling Marquee banner */}
        <div className="relative z-10 mt-auto flex flex-col">
          {/* Slider bottom progress bar tracker */}
          <div className="w-full bg-neutral-100 h-[3px] border-t-2 border-neutral-900">
            <div 
              className="bg-neutral-950 h-full transition-all duration-50"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Nav Controls and Mini Dots */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-t-2 border-neutral-900">
            
            {/* Progress indicators dots */}
            <div className="flex items-center gap-2">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2.5 rounded-full border border-neutral-900 transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-7 bg-neutral-950' 
                      : 'w-2.5 bg-neutral-100 hover:bg-neutral-200'
                  }`}
                  title={`Show slide ${idx + 1}`}
                  id={`hero-slide-dot-${idx}`}
                />
              ))}
            </div>

            {/* Left and Right navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg border-2 border-neutral-900 text-neutral-900 bg-white hover:bg-neutral-50 active:scale-90 transition-all cursor-pointer shadow-[2px_2px_0px_#000000]"
                title="Previous Slide"
                id="hero-slide-prev-btn"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg border-2 border-neutral-900 text-neutral-900 bg-white hover:bg-neutral-50 active:scale-90 transition-all cursor-pointer shadow-[2px_2px_0px_#000000]"
                title="Next Slide"
                id="hero-slide-next-btn"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
              </button>
            </div>
          </div>

          {/* Black on White scroll text banner */}
          <div 
            className="w-full h-8 overflow-hidden bg-neutral-950 text-white flex items-center border-t-2 border-neutral-900"
            id="scrolling-tag-marquee"
          >
            <div className="relative w-full overflow-hidden flex whitespace-nowrap">
              <div className="flex gap-16 text-[9px] font-mono uppercase tracking-[0.25em] font-black justify-between animate-marquee select-none">
                {marqueeItems.concat(marqueeItems).map((text, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <span className="text-neutral-400 font-extrabold">✻</span>
                    <span className="text-white/95">{text}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

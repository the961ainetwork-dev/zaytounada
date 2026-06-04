import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Compass, 
  BookOpen, 
  Sparkles,
  Flame,
  Award
} from 'lucide-react';

interface NarrativeChapter {
  heading: string;
  text: string;
  metaLabel: string;
}

interface Slide {
  id: number;
  mantra: string;
  tag: string;
  headline: string;
  imageUrl: string;
  targetTab: string;
  targetDistinction?: string;
  actionText: string;
  badgeColor: string;
  accentColor: string;
  coordinates: string;
  narratives: {
    spirit: NarrativeChapter;
    palette: NarrativeChapter;
    secret: NarrativeChapter;
  };
  chefQuote: {
    text: string;
    author: string;
    role: string;
  };
  audioTranscript: {
    chefVoice: string;
    transcript: string;
  };
}

interface HeroSliderProps {
  onNavigateTab: (tab: string) => void;
  onSelectDistinction?: (distinction: string) => void;
  onOpenConcierge: () => void;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    mantra: "AN ANCESTRAL FEAST IN THE MOUNT OF FLOWERS",
    tag: "✻ THEATRICAL LEVANTINE TEMPLES",
    headline: "Em Sherif & Grand Banquets",
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=1200",
    targetTab: "discovery",
    targetDistinction: "Stars",
    actionText: "Enter Levantine Palaces",
    badgeColor: "bg-emerald-950 text-amber-300 border-amber-300/30",
    accentColor: "#059669",
    coordinates: "33.8905° N, 35.5090° E • Achrafieh El Palace",
    narratives: {
      spirit: {
        metaLabel: "CHAPTER I: THE BANQUET CULTURE",
        heading: "The Sacred Ritual of the Mezza Sanctuary",
        text: "In Beirut’s grandest dining temples, hospitality is a theatrical sacrament. Cold mezza courses arrive in an meticulously timed choreography—velvety hand-beaten cold hummus swimming in green orchard oils, followed by charcoal-sizzling kibbeh, and hot sumac flat rolls over smoking pine embers."
      },
      palette: {
        metaLabel: "CHAPTER II: THE SENSORY ALCHEMY",
        heading: "A Symphony of Smoked Mint & Wild Berries",
        text: "Traditional Lebanese dining balances strong elements. The tangy splash of hand-harvested wild sumac, citrus lemon notes of fresh mountain mint, and slow-braised mountain lamb seasoned with traditional seven spice aromatics."
      },
      secret: {
        metaLabel: "CHAPTER III: INSPECTOR MEMOIRS",
        heading: "The Clandestine Feast of Madame Mireille",
        text: "The grand secret is that there is no conventional menu booklet here. Guests sit back as continuous, seasonally adjusted waves of thirty masterfully constructed small plates are presented, designed daily based on farm-gate acquisitions."
      }
    },
    chefQuote: {
      text: "To cook for someone is to offer them an intimate chapter of your life, simmered slowly and finished with fresh basil.",
      author: "Madame Mireille Hayek",
      role: "Grand Chef & Proprietor, Em Sherif"
    },
    audioTranscript: {
      chefVoice: "Recorded in Achrafieh Kitchens • 11:24 AM",
      transcript: "\"We make the garlic spread (Toume) exactly as my grandmother did in the coastal hills. It is not just about garlic and emulsion—it is about the rhythm of whipping and the fresh morning sea air.\""
    }
  },
  {
    id: 2,
    mantra: "THE GEODESIC TRAILS OF THE SUNSET HARBORS",
    tag: "⚡ DYNAMIC COASTAL SEAFOOD MAP",
    headline: "Coastal Castles & Wave-Swept Diners",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200",
    targetTab: "map",
    actionText: "Navigate Interactive Map",
    badgeColor: "bg-neutral-900 text-amber-300 border-emerald-500/20",
    accentColor: "#0f766e",
    coordinates: "34.2530° N, 35.6630° E • Salt Cliffs of Batroun",
    narratives: {
      spirit: {
        metaLabel: "CHAPTER I: THE MARITIME PASSAGE",
        heading: "Journey Across Ancient Salt-Sprayed Harbors",
        text: "Explore Byblos to Batroun, tracing ancient Phoenician ports. Our seaside trails wind through historic Roman archways down to wooden sun-decks perched right above crashing surf, where the catch of the day is delivered direct from artisanal boats."
      },
      palette: {
        metaLabel: "CHAPTER II: SEA & SUNSET ESSENCE",
        heading: "Charcoal Seabass, Red Mullet & Ice Arrack",
        text: "Seafood pairs with high-altitude coastal white wines. Crispy red mullet fried in heavy copper vats sits beside whole-roasted wild sea bass, finished with garlic-herb oil and cups of ice-chilled triple-distilled Arrack."
      },
      secret: {
        metaLabel: "CHAPTER III: INSIDER TELEMETRY",
        heading: "Geodesic Snapping & Scenic Route Planning",
        text: "Activate our live measurement rule. Trace the exact maritime path between Byblos harbor seafood grills and Batroun’s cliffside sunset lookouts to map a flawless evening with optimal coordinates."
      }
    },
    chefQuote: {
      text: "The sea provides the seasoning; we merely apply the flame of olive wood and the fresh lemon of our groves.",
      author: "Abou Jean",
      role: "Seafood Veteran, Batroun Port"
    },
    audioTranscript: {
      chefVoice: "Recorded at Wave-Deck Harbor • 6:45 PM",
      transcript: "\"The red mullet must hit the boiling oil for exactly three minutes. Any longer and you lose the crisp crust that holds the sweet Mediterranean seawater inside the flakes.\""
    }
  },
  {
    id: 3,
    mantra: "THE COZY MIDNIGHT VIBE OF BOTANICALS & VINYL",
    tag: "🔥 GEMMAYZE VINYL BARS",
    headline: "Alleys of Amber Lights & Live Show Halls",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200",
    targetTab: "vibes",
    actionText: "Explore Midnight Vibes",
    badgeColor: "bg-purple-950 text-white border-purple-500/30",
    accentColor: "#7e22ce",
    coordinates: "33.8970° N, 35.5240° E • Gemmayze Creative District",
    narratives: {
      spirit: {
        metaLabel: "CHAPTER I: TWILIGHT HYMNS",
        heading: "The Electric After-Hours Pulse of Beirut",
        text: "Beirut truly lives at twilight. The Ottoman steps of Gemmayze glow under warm streetlights as local vinyl rooms spin retro Arabic jazz, and botanical garden courtyards hide candle-lit tables where conversations stretch long into the sea breeze."
      },
      palette: {
        metaLabel: "CHAPTER II: MIDNIGHT LIBATIONS",
        heading: "Herbal Gin-Anise & Hot Sumac Manousheh",
        text: "A creative playground for experimental mixologists. Cocktails are infused with rosemary-apricot syrups and house anise liquors, paired with hot mini flatbreads folded straight from clay corner ovens."
      },
      secret: {
        metaLabel: "CHAPTER III: HIDDEN DECK ENTRY",
        heading: "The Unmarked Archways of Sursock Lower Steps",
        text: "Behind an unmarked ivy-draped iron gate near Sursock, a narrow stair lead down to a cozy speakeasy. Here, local selectors spin private vinyl collections in a sanctuary built inside historic vaulted stone archives."
      }
    },
    chefQuote: {
      text: "The night is where the memory of Beirut is written, accompanied by great rhythms and wild cardamoms.",
      author: "Marc-Antoine",
      role: "Creative Director, Sursock Vaults"
    },
    audioTranscript: {
      chefVoice: "Recorded at Arch-Sait Lounge • 11:58 PM",
      transcript: "\"We keep the music volume just below the sound of ice shaking. When guests hear the dynamic needles touch the vinyl grooves, the conversation softens, letting the true vintage spirit take over.\""
    }
  },
  {
    id: 4,
    mantra: "SACRED ANCESTRAL WHEATS FROM THE CLAY DOME",
    tag: "🥖 TRADITIONAL STREET WOOD OVEN",
    headline: "Decades of Sourdough & Hot Sesame Saj",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200",
    targetTab: "takeaways-bakeries",
    actionText: "Savor Baker Legacy",
    badgeColor: "bg-amber-950 text-amber-200 border-amber-500/20",
    accentColor: "#b45309",
    coordinates: "34.1230° N, 35.6510° E • Furn Beaino Hearth",
    narratives: {
      spirit: {
        metaLabel: "CHAPTER I: THE WILD FERMENT",
        heading: "The Morning Awakening of the Old Clay Hearth",
        text: "Long before dawn break, traditional bakers fire the brick vaults. Using wild sourdough mothers nurtured for over forty years, they stretch paper-thin dough, topping with fresh mountain thyme or minced local meats to create crispy crusts with deeply caramelized edges."
      },
      palette: {
        metaLabel: "CHAPTER II: THE CRUNCH SENSE",
        heading: "Fragrant Thyme, Creamy Labneh & akkawi Cheese",
        text: "Taste native, earthy herbs. Freshly rolled pastries filled with bubbly, melted Akkawi cheese, toasted pine seeds, and house-pressed goat cheese, finished with clean olive oil and cucumber rings."
      },
      secret: {
        metaLabel: "CHAPTER III: DEEP TECHNIQUE",
        heading: "The 80-Second Flash Fire Bake Ritual",
        text: "True Lahme el Bajin must cook at blistering woodland heats. At Furn Beaino, the wood-fired ovens hover at 450 degrees, baking the wafer-thin dough for exactly eighty seconds to preserve fresh meat juiciness while ensuring a crispy base."
      }
    },
    chefQuote: {
      text: "Our clay is made of local mountain earth. When it heats, it breathes the ancient flavor of the trees into our dough.",
      author: "Master Baker Beaino",
      role: "Third-generation Baker"
    },
    audioTranscript: {
      chefVoice: "Recorded at the Hearthside • 4:12 AM",
      transcript: "\"You must feel the dough. If it is too humid, the thyme oil sinks too deep and loses its green brightness. It must sit on top like a fragrant cedar crown.\""
    }
  },
  {
    id: 5,
    mantra: "PREDICTIVE CULINARY MATRICES CALIBRATED TO ANCIENT SOIL",
    tag: "🔮 INTUITIVE CULINARY CONCIERGE",
    headline: "AI Intelligence Curation & Clandestine Auditing",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200",
    targetTab: "concierge",
    actionText: "Initiate AI Concierge",
    badgeColor: "bg-teal-950 text-teal-300 border-emerald-500/20",
    accentColor: "#0d9488",
    coordinates: "33.8938° N, 35.5018° E • Core Cloud-Host Node",
    narratives: {
      spirit: {
        metaLabel: "CHAPTER I: NEURAL INSIGHT",
        heading: "Deep Culinary Wisdom Merged with Live Intelligence",
        text: "Our custom server-side artificial intelligence maps the complex geometric relationship between Lebanese micro-ingredients, kitchen consistency curves, and clandestine inspector journals to find your optimum dining experience."
      },
      palette: {
        metaLabel: "CHAPTER II: THE CONCIERGE GRID",
        heading: "Predictive Preferences Calibration",
        text: "Forget static rating filters. Our neural scheduler analyzes complex vibe alignments—grouping coastal sea bass spots, secret local bakeries, or late-night music shows based on real moods and live, unfiltered expert notes."
      },
      secret: {
        metaLabel: "CHAPTER III: THE AUDIT FEED",
        heading: "Direct Extraction of Secret Inspector Diaries",
        text: "Beyond typical user reviews, this cognitive platform provides actual field notes tracking chef transitions, backroom reserve lists, and vintage stock variations to place real authority in your hands."
      }
    },
    chefQuote: {
      text: "An algorithm doesn't eat the food, but it perfectly maps the unspoken poetry of pairing coastal sunsets with dry Bekaa whites.",
      author: "Aura",
      role: "Culinary AI Director Module"
    },
    audioTranscript: {
      chefVoice: "Synthetic Stream • Real-time Node",
      transcript: "\"Our database rejects empty five-star ratings. We evaluate back-of-house consistency, spice sourcing channels, and seating layouts to verify whether a spot is truly authentic or just noisy.\""
    }
  }
];

export default function HeroSlider({
  onNavigateTab,
  onSelectDistinction,
  onOpenConcierge
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'spirit' | 'palette' | 'secret'>('spirit');
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isListenMode, setIsListenMode] = useState(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const progressTimer = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && !isListenMode) {
      const intervalDuration = 8000; // 8 seconds per slide for deeper narrative reading
      const stepTime = 50; 
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
  }, [currentIndex, isPlaying, isListenMode]);

  // Reset active text chapter tab when moving to a new slide
  const handleNext = () => {
    setProgress(0);
    setActiveTab('spirit');
    setIsListenMode(false);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setActiveTab('spirit');
    setIsListenMode(false);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleDotClick = (index: number) => {
    setProgress(0);
    setActiveTab('spirit');
    setIsListenMode(false);
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
  const activeChapter = activeSlide.narratives[activeTab];

  const marqueeItems = [
    "✻ EDITORIAL NARRATIVE REPORT",
    "BEIRUT GOURMET DIARIES",
    "BYBLOS SEAFOOD HERITAGE",
    "BATROUN COASTAL WINELANDS",
    "TRIPOLI SOURDOUGH COMMONS",
    "100% UNBIASED FIELD ESSAYS",
    "CLANDESTINE MICHELIN INSIGHTS",
    "ANALYTICAL VIBES & GEOMAPPING"
  ];

  return (
    <div 
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4 select-none" 
      id="hero-editorial-image-slider"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => {
        if (!isListenMode) setIsPlaying(true);
      }}
    >
      {/* Editorial Board Container - Stark contrast, minimal borders, premium offset shadows */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-neutral-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[640px] transition-all duration-500">
        
        {/* TOP STATUS BAR: Styled like an elegant luxury magazine header */}
        <div className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-800 font-extrabold">
              Lebanon Culinary Archive • Essay {currentIndex + 1} of {SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
              EST. 2026 EDITION
            </span>
            <div className="h-4 w-[1px] bg-neutral-200" />
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                if (isListenMode) setIsListenMode(false);
              }}
              className="p-1.5 rounded-full border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-xs"
              title={isPlaying && !isListenMode ? "Pause stories Autoplay" : "Resume stories Autoplay"}
              id="hero-play-pause-btn"
            >
              {isPlaying && !isListenMode ? <Pause className="w-3.5 h-3.5 stroke-[2px]" /> : <Play className="w-3.5 h-3.5 stroke-[2px]" />}
            </button>
          </div>
        </div>

        {/* MAIN SPLIT WORKSPACE: Expanded text content & rich graphics panel */}
        <div className="relative z-0 flex flex-col lg:flex-row items-stretch flex-grow bg-white">
          
          {/* LEFT STORYTELLING COLUMN (Brutalist Literary Layout) */}
          <div className="w-full lg:w-7/12 p-6 sm:p-10 md:p-12 flex flex-col justify-between items-start text-left space-y-6">
            
            <div className="space-y-6 w-full">
              {/* Mantra Description Indicator */}
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] font-extrabold text-emerald-700 block">
                ✦ {activeSlide.mantra}
              </p>

              {/* Display Headline */}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-neutral-900 uppercase font-sans">
                {activeSlide.headline}
              </h2>

              {/* NARRATIVE CHAPTER MULTI-TABS - The core narrative engine */}
              <div className="flex border-b border-neutral-100 pb-1 gap-2 md:gap-4 overflow-x-auto w-full no-scrollbar">
                {(['spirit', 'palette', 'secret'] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  const label = tab === 'spirit' ? '📖 The Spirit' : tab === 'palette' ? '🍽️ The Palette' : '🔑 The Secret';
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setIsPlaying(false); // Stop autoplay when user actively reads chapters
                      }}
                      className={`relative pb-2.5 px-1 text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer ${
                        isActive ? 'text-neutral-950 font-black' : 'text-neutral-400 hover:text-neutral-700'
                      }`}
                      id={`tab-narrative-${tab}`}
                    >
                      {label}
                      {isActive && (
                        <motion.div 
                          layoutId="activeNarrativeIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" 
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ANIMATED NARRATIVE CONTENT WINDOW */}
              <div className="min-h-[160px] md:min-h-[140px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentIndex}-${activeTab}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-3"
                  >
                    <span className="text-[9px] font-mono font-black uppercase text-amber-600 tracking-widest block">
                      {activeChapter.metaLabel}
                    </span>
                    <h3 className="text-lg font-extrabold text-neutral-950 tracking-tight leading-tight">
                      {activeChapter.heading}
                    </h3>
                    <p className="text-neutral-600 text-sm leading-relaxed font-normal">
                      {activeChapter.text}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* INTERACTIVE TRANSMEMOIR AUDIO FEEDBACK BLOCK */}
              <div className="w-full bg-neutral-50 rounded-2xl p-4 border border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:bg-neutral-50/80">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setIsListenMode(!isListenMode);
                      if (!isListenMode) setIsPlaying(false);
                    }}
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-all border shrink-0 ${
                      isListenMode 
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-md animate-pulse' 
                        : 'bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-100 hover:scale-105 active:scale-95'
                    }`}
                    title="Toggle Chef memoirs voiceover audio transcript simulation"
                    id={`btn-listen-voice-${activeSlide.id}`}
                  >
                    {isListenMode ? (
                      <Volume2 className="h-4 w-4 text-amber-300" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-neutral-500" />
                    )}
                  </button>
                  <div className="text-left">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-emerald-800 font-extrabold block">
                      {isListenMode ? '• SIMULATING RAW TRANSCRIPT PLAY' : '🎙️ CHEF AUDIO NOTES'}
                    </span>
                    <span className="text-[10px] font-sans font-bold text-neutral-800">
                      {activeSlide.audioTranscript.chefVoice}
                    </span>
                  </div>
                </div>

                {/* Pulse wave indicators */}
                <div className="flex items-center gap-1.5 h-6 shrink-0">
                  <span className={`block w-0.5 bg-emerald-600 rounded-full transition-all duration-300 ${isListenMode ? 'h-5 animate-pulse' : 'h-2'}`} />
                  <span className={`block w-0.5 bg-emerald-600 rounded-full transition-all duration-250 ${isListenMode ? 'h-3 animate-pulse' : 'h-1.5'}`} />
                  <span className={`block w-0.5 bg-emerald-600 rounded-full transition-all duration-350 ${isListenMode ? 'h-6 animate-pulse' : 'h-2'}`} />
                  <span className={`block w-0.5 bg-emerald-600 rounded-full transition-all duration-200 ${isListenMode ? 'h-4 animate-pulse' : 'h-1.5'}`} />
                  <span className={`block w-0.5 bg-emerald-600 rounded-full transition-all duration-300 ${isListenMode ? 'h-2 animate-pulse' : 'h-1'}`} />
                </div>
              </div>

              {/* TRANSCRIPT CAPTION DRAWER OVERLAY */}
              <AnimatePresence>
                {isListenMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden w-full text-left"
                  >
                    <div className="p-3.5 bg-emerald-950 border border-emerald-800/60 rounded-xl font-mono text-[11px] text-emerald-100 tracking-wide leading-relaxed relative">
                      <span className="absolute top-2 right-3 text-[8px] tracking-widest text-amber-400 font-bold uppercase animate-pulse">
                        LIVE FEED
                      </span>
                      {activeSlide.audioTranscript.transcript}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* ACTION FOOTER & SIGNATURE CALLOUT */}
            <div className="pt-4 border-t border-neutral-100 w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
              
              {/* Callout quote from Culinary Director */}
              <div className="flex gap-3 text-left max-w-sm pl-3 border-l-2 border-emerald-600 py-1">
                <div className="text-neutral-700 text-xs italic font-serif">
                  "{activeSlide.chefQuote.text}"
                  <span className="block not-italic text-[9px] font-sans font-bold text-neutral-400 uppercase mt-1 tracking-wider">
                    — {activeSlide.chefQuote.author}, {activeSlide.chefQuote.role}
                  </span>
                </div>
              </div>

              {/* Core interactive buttons */}
              <div className="shrink-0 flex items-center pr-1">
                <button
                  onClick={() => handleAction(activeSlide)}
                  className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-transparent hover:border-amber-400/20 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                  id={`hero-slide-action-btn-${activeSlide.id}`}
                >
                  <span>{activeSlide.actionText}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT PICTURE GRAPH GRID PANEL (Visually stunning landscape window frame) */}
          <div className="w-full lg:w-5/12 min-h-[300px] lg:min-h-0 relative overflow-hidden bg-neutral-900 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-neutral-100">
            
            {/* Ambient sliding image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeSlide.imageUrl}
                  alt={activeSlide.headline}
                  className="w-full h-full object-cover object-center filter saturate-[1.08] contrast-[1.02] hover:scale-105 transition-transform duration-[4s]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* Premium editorial image gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40 pointer-events-none" />

            {/* UPPER PANEL: Tag Badge & Star distinctions overlays */}
            <div className="relative z-10 p-6 flex justify-between items-start">
              <span className={`px-3 py-1.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest border backdrop-blur-md shadow-lg ${activeSlide.badgeColor}`}>
                {activeSlide.tag}
              </span>

              <div className="bg-neutral-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5 text-[9px] text-amber-300 font-mono tracking-widest font-bold">
                <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>MAP PROXIMITY</span>
              </div>
            </div>

            {/* LOWER PANEL: Dynamic district coordinates telemetry */}
            <div className="relative z-10 p-6 text-left space-y-2 select-none pointer-events-none">
              <div className="text-[10px] font-mono text-amber-300 tracking-[0.25em] font-black uppercase drop-shadow flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 fill-red-400" />
                <span>LOCATOR: {activeSlide.coordinates}</span>
              </div>
              <p className="font-sans text-[11px] text-white/80 font-medium tracking-wide drop-shadow-md pr-12">
                Clicking the action button maps this narrative district instantly in your live application views.
              </p>
            </div>

          </div>

        </div>

        {/* BOTTOM METADATA BAR, DOT PROGRESSIVE TIMERS & RUNNING MARQUEE */}
        <div className="relative z-10 mt-auto flex flex-col bg-white">
          
          {/* Dynamic timer progress line */}
          <div className="w-full bg-neutral-100 h-[3px]">
            <div 
              className="bg-emerald-600 h-full transition-all duration-50"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dots Indicator & navigation selectors */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 px-6 border-t border-neutral-100 bg-white">
            
            {/* Dots navigation */}
            <div className="flex items-center gap-2.5">
              {SLIDES.map((s, idx) => {
                const isSelected = currentIndex === idx;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleDotClick(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer border ${
                      isSelected 
                        ? 'w-8 bg-emerald-800 border-emerald-800' 
                        : 'w-2 bg-neutral-200 border-neutral-200 hover:bg-neutral-300'
                    }`}
                    title={`Read Chapter ${idx + 1}`}
                    id={`hero-slide-dot-${idx}`}
                  />
                );
              })}
            </div>

            {/* Manual step controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-full border border-neutral-200 text-neutral-800 bg-white hover:bg-neutral-50 active:scale-90 transition-all cursor-pointer shadow-xs"
                title="Previous Slide"
                id="hero-slide-prev-btn"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5px]" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-full border border-neutral-200 text-neutral-800 bg-white hover:bg-neutral-50 active:scale-90 transition-all cursor-pointer shadow-xs"
                title="Next Slide"
                id="hero-slide-next-btn"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5px]" />
              </button>
            </div>

          </div>

          {/* Luxury Running Editorial Marquee Banner */}
          <div 
            className="w-full h-8 overflow-hidden bg-neutral-950 text-white flex items-center border-t border-neutral-900"
            id="scrolling-tag-marquee"
          >
            <div className="relative w-full overflow-hidden flex whitespace-nowrap">
              <div className="flex gap-16 text-[9px] font-mono uppercase tracking-[0.25em] font-black justify-between animate-marquee select-none">
                {marqueeItems.concat(marqueeItems).map((text, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-500 font-extrabold font-serif">✻</span>
                    <span className="text-white/90">{text}</span>
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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

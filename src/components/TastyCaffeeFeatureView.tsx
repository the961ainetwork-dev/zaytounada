import React, { useState } from 'react';
import { 
  Coffee, 
  Sparkles, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Heart, 
  Share2, 
  Star, 
  Check, 
  ArrowLeft, 
  Calendar, 
  Award, 
  ChevronRight, 
  Search, 
  Filter, 
  Compass, 
  ThumbsUp, 
  MessageSquare, 
  Plus, 
  ExternalLink,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  Users,
  UtensilsCrossed,
  Send,
  X
} from 'lucide-react';
import { showToast } from '../utils/toast';

interface TastyCaffeeFeatureViewProps {
  onBackToHome: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onBookTable?: (bookingData: any) => void;
}

interface MenuItemExtract {
  id: string;
  name: string;
  nameAr?: string;
  category: 'espresso_brews' | 'pastries_bakery' | 'brunch_tartines' | 'cold_elixirs' | 'desserts';
  priceUsd: number;
  priceLbp: string;
  description: string;
  tastingNotes: string[];
  tags: string[];
  isInspectorPick?: boolean;
  imageUrl?: string;
}

const MENU_EXTRACTS: MenuItemExtract[] = [
  {
    id: 'tc-1',
    name: 'Ethiopian Yirgacheffe V60 Pour-Over',
    nameAr: 'إثيوبي يرجاشيفي V60 مقطر',
    category: 'espresso_brews',
    priceUsd: 5.50,
    priceLbp: '495,000 LBP',
    description: 'Washed single-origin micro-lot from the Gedeo zone. Brewed on custom Hario V60 drippers with mineral-balanced mountain spring water at exactly 92°C.',
    tastingNotes: ['Wild Jasmine', 'Bergamot Citrus', 'Ripe White Peach', 'Honey Finish'],
    tags: ['Single Origin', 'Washed Process', 'Inspector Pick'],
    isInspectorPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tc-2',
    name: 'Mount Lebanon Honey Anaerobic Espresso',
    nameAr: 'إسبريسو عسلي لاهوائي من جبل لبنان',
    category: 'espresso_brews',
    priceUsd: 4.25,
    priceLbp: '380,000 LBP',
    description: 'Rare experimental nano-lot cultivated in high-altitude Chouf terraced micro-climates. Double extracted on Synesso MVP Hydra with a 1:2.2 brew ratio.',
    tastingNotes: ['Candied Fig', 'Orange Blossom', 'Dark Chocolate Truffle', 'Velvety Crema'],
    tags: ['Local Micro-Lot', 'Anaerobic Ferment', 'House Specialty'],
    isInspectorPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tc-3',
    name: 'Cortado with Pistachio Milk',
    nameAr: 'كورتادو بحليب الفستق الحلبي',
    category: 'espresso_brews',
    priceUsd: 4.75,
    priceLbp: '425,000 LBP',
    description: 'Equal parts Colombian Geisha espresso and warm, silky in-house roasted Aleppo pistachio milk, dusted with crushed green pistachios.',
    tastingNotes: ['Nutty Sweetness', 'Toasted Almond', 'Creamy Texture'],
    tags: ['Plant-Based', 'House Crafted Milk'],
    isInspectorPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tc-4',
    name: 'Cardamom & Orange Blossom Cruffin',
    nameAr: 'كروفين الهيل وماء الزهر',
    category: 'pastries_bakery',
    priceUsd: 4.50,
    priceLbp: '400,000 LBP',
    description: '72-hour slow-laminated croissant dough baked in muffin molds, rolled in fine cardamom sugar, and piped with velvet orange-blossom diplomat cream.',
    tastingNotes: ['Flaky Caramelized Layers', 'Warm Green Cardamom', 'Zesty Citrus Floral'],
    tags: ['72h Fermentation', 'AOP French Butter', 'Inspector Pick'],
    isInspectorPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tc-5',
    name: 'Wild Thyme & Akawi Sourdough Babka',
    nameAr: 'بابكا الزعتر البري والجبن العكاوي',
    category: 'pastries_bakery',
    priceUsd: 4.00,
    priceLbp: '360,000 LBP',
    description: 'Twisted brioche loaf swirled with fresh mountain za’atar, extra virgin Koura olive oil, and gentle desalted Akawi cheese ribbons.',
    tastingNotes: ['Savory Herbs', 'Pungent Thyme', 'Melted Sweet Curd'],
    tags: ['Organic Herbs', 'Local Terroir'],
    isInspectorPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tc-6',
    name: 'Valrhona Dark Chocolate & Halawa Pain Au Chocolat',
    nameAr: 'بان أو شوكولا بحلاوة السمسم وفالرونا',
    category: 'pastries_bakery',
    priceUsd: 4.75,
    priceLbp: '425,000 LBP',
    description: 'Double batons of 70% Valrhona Guanaja chocolate paired with artisanal sesame halawa, enveloped in shatteringly crisp laminated pastry.',
    tastingNotes: ['Nutty Tahini', 'Bittersweet Cocoa', 'Caramelized Butter'],
    tags: ['72h Lamination', 'Signature'],
    isInspectorPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tc-7',
    name: 'Heirloom Fig & Whipped Goat Labneh Tartine',
    nameAr: 'تارتين التين وجبنة اللبنة البلدية بالزعتر والعسل',
    category: 'brunch_tartines',
    priceUsd: 8.50,
    priceLbp: '765,000 LBP',
    description: 'Thick toasted slice of naturally leavened country sourdough, whipped Bekaa Valley goat labneh, seared mountain figs, organic wild thyme honey, and roasted walnuts.',
    tastingNotes: ['Creamy Tang', 'Sweet Seared Figs', 'Aromatic Thyme Honey', 'Crunchy Walnuts'],
    tags: ['Organic Bekaa Dairy', 'Sourdough', 'Inspector Pick'],
    isInspectorPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tc-8',
    name: 'Shakshuka Benedict on Za\'atar Brioche',
    nameAr: 'شكشوكة بينيديكت على خبز البريوش بالزعتر',
    category: 'brunch_tartines',
    priceUsd: 9.25,
    priceLbp: '830,000 LBP',
    description: 'Two poached organic free-range eggs resting on slow-simmered tomato-bell pepper confit, toasted za\'atar brioche, and topped with smoked sumac hollandaise.',
    tastingNotes: ['Rich Yolks', 'Smoky Pimento', 'Tangy Sumac Emulsion'],
    tags: ['Free-Range Eggs', 'All-Day Brunch'],
    isInspectorPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tc-9',
    name: 'Nitro Cold Brew with Cascara Honey Foam',
    nameAr: 'نايترو كولد برو مع رغوة قشر القهوة والعسل',
    category: 'cold_elixirs',
    priceUsd: 5.00,
    priceLbp: '450,000 LBP',
    description: '24-hour cold steeped Colombian Geisha infused with pure nitrogen for a Guinness-like silky head, crowned with aerated cascara (coffee cherry) honey foam.',
    tastingNotes: ['Silky Micro-Bubbles', 'Dried Cherry', 'Dark Malt', 'Honeyed Foam'],
    tags: ['Nitro Infused', 'Cold Steeped 24h', 'Zero Dairy'],
    isInspectorPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tc-10',
    name: 'Iced Rose-Cardamom Matcha Latte',
    nameAr: 'ماتشا لاتيه مثلج بماء الورد والهيل',
    category: 'cold_elixirs',
    priceUsd: 5.75,
    priceLbp: '515,000 LBP',
    description: 'Ceremonial grade Uji Matcha whisked with organic oat milk, layered over delicate Damascus rose petal syrup and subtle ground green cardamom.',
    tastingNotes: ['Earthy Umami', 'Floral Rose Water', 'Sweet Spice'],
    tags: ['Ceremonial Matcha', 'Plant-Based', 'Antioxidant Rich'],
    isInspectorPick: false,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'tc-11',
    name: 'Pistachio Ashta French Toast',
    nameAr: 'فرنش توست بالقشطة البلدية وغزل البنات',
    category: 'desserts',
    priceUsd: 8.75,
    priceLbp: '785,000 LBP',
    description: 'Caramelized thick-cut brioche soaked in orange-blossom custard, filled with fresh clotted ashta cream, drizzled with date syrup and garnished with fine ghazl el banat.',
    tastingNotes: ['Crisp Caramel Crust', 'Creamy Ashta', 'Aromatic Orange Blossom'],
    tags: ['Decadent Signature', 'Fresh Ashta', 'Inspector Pick'],
    isInspectorPick: true,
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-0097377926dd?auto=format&fit=crop&q=80&w=400'
  }
];

interface Testimonial {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  favoriteOrder: string;
  avatar: string;
  verified: boolean;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Karim Haddad',
    role: 'Specialty Coffee Association Q-Grader & Food Critic',
    rating: 5,
    date: 'August 12, 2026',
    comment: 'Tasty Caffee has quietly set the gold standard for third-wave coffee in the Levant. The extraction consistency on their Ethiopian Yirgacheffe V60 is unmatched in Beirut—floral, clean, and bursting with jasmine notes. Pairing it with the Cardamom Cruffin in the morning sunlit courtyard is pure poetic bliss.',
    favoriteOrder: 'Ethiopian V60 + Cardamom & Orange Blossom Cruffin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    verified: true
  },
  {
    id: 'test-2',
    author: 'Nour El-Khoury',
    role: 'Architect & Sursock Heritage Resident',
    rating: 5,
    date: 'August 04, 2026',
    comment: 'As someone who lives two blocks away on Rue du Liban, Tasty Caffee is my sacred morning sanctuary. The restoration of this 19th-century sandstone vault with the lush lemon trees makes you forget the noise of the city. The staff greets you by name, and the Heirloom Fig Tartine is to die for.',
    favoriteOrder: 'Heirloom Fig & Goat Labneh Tartine + Flat White',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    verified: true
  },
  {
    id: 'test-3',
    author: 'Marc Boustany',
    role: 'Gastronomy Blogger & Pastry Connoisseur',
    rating: 5,
    date: 'July 28, 2026',
    comment: 'The lamination technique here rivals top Parisian ateliers, but with an unapologetically Lebanese soul. That Valrhona chocolate and sesame halawa pain au chocolat has the most crisp, audible crunch when you bite into it. 10/10.',
    favoriteOrder: 'Halawa Pain Au Chocolat + Nitro Cold Brew',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    verified: true
  },
  {
    id: 'test-4',
    author: 'Dr. Rana Chami',
    role: 'Professor & Remote Researcher',
    rating: 5,
    date: 'July 19, 2026',
    comment: 'Reliable fiber Wi-Fi, quiet garden corners with outlets, gentle jazz on vinyl, and the most uplifting cup of coffee you can find. It is rare to find a cafe that balances top-tier culinary excellence with genuine hospitality and focus-friendly vibes.',
    favoriteOrder: 'Mount Lebanon Anaerobic Espresso + Wild Thyme Babka',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    verified: true
  }
];

export default function TastyCaffeeFeatureView({
  onBackToHome,
  isSaved = false,
  onToggleSave,
  onBookTable
}: TastyCaffeeFeatureViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'review' | 'menu' | 'testimonials' | 'gallery' | 'visit'>('review');
  const [savedLocal, setSavedLocal] = useState<boolean>(isSaved);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  
  // New Review Modal / Form state
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>('');
  const [newReviewRole, setNewReviewRole] = useState<string>('Coffee Enthusiast');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewFavorite, setNewReviewFavorite] = useState<string>('Cardamom Cruffin + Ethiopian V60');

  // Reservation Modal state
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [bookName, setBookName] = useState<string>('');
  const [bookEmail, setBookEmail] = useState<string>('');
  const [bookDate, setBookDate] = useState<string>('2026-08-20');
  const [bookTime, setBookTime] = useState<string>('10:00 AM');
  const [bookGuests, setBookGuests] = useState<number>(2);
  const [bookNotes, setBookNotes] = useState<string>('Courtyard garden table preferred');

  const handleToggleLocalSave = () => {
    setSavedLocal(!savedLocal);
    if (onToggleSave) {
      onToggleSave();
    } else {
      showToast(!savedLocal ? 'Tasty Caffee saved to your guide!' : 'Removed Tasty Caffee from saved guide');
    }
  };

  const handleShare = () => {
    const url = window.location.href.includes('tab=tasty-caffee') 
      ? window.location.href 
      : `${window.location.origin}${window.location.pathname}?tab=tasty-caffee`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Deep link to Tasty Caffee copied to clipboard!');
      });
    } else {
      showToast('Link ready to share: ' + url);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `☕ Check out this feature on Tasty Caffee in Achrafieh, Beirut on Zaytounada Guide! Top-tier specialty coffee, 72h cardamom cruffins, and sunlit lemon-tree courtyard:\n${window.location.origin}?tab=tasty-caffee`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSubmitNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast('Please fill in your name and review details.');
      return;
    }

    const newEntry: Testimonial = {
      id: `test-${Date.now()}`,
      author: newReviewAuthor.trim(),
      role: newReviewRole.trim() || 'Verified Patron',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      favoriteOrder: newReviewFavorite.trim() || 'Signature Espresso & Pastry',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      verified: true
    };

    setTestimonials([newEntry, ...testimonials]);
    setShowReviewModal(false);
    setNewReviewAuthor('');
    setNewReviewComment('');
    showToast('Thank you! Your review for Tasty Caffee has been published.');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !bookEmail.trim()) {
      showToast('Please provide your name and contact email.');
      return;
    }

    const bookingPayload = {
      id: `book-tc-${Date.now()}`,
      restaurantId: 'rest-tasty-caffee',
      restaurantName: 'Tasty Caffee',
      userName: bookName,
      userEmail: bookEmail,
      guestsCount: bookGuests,
      date: bookDate,
      time: bookTime,
      specialRequests: bookNotes,
      status: 'confirmed'
    };

    if (onBookTable) {
      onBookTable(bookingPayload);
    }
    setShowBookingModal(false);
    showToast(`Table confirmed at Tasty Caffee for ${bookName} on ${bookDate} at ${bookTime}!`);
  };

  const filteredMenuItems = MENU_EXTRACTS.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tastingNotes.some(n => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20 text-neutral-900 animate-fade-in" id="tasty-caffee-feature-page">
      
      {/* Top Sticky Navigation Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-[73px] z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span className="hidden sm:inline-block text-xs text-neutral-400 font-mono">/</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              FEATURED & VISITED FOR YOU
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLocalSave}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                savedLocal
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
              title="Save to My Guide"
            >
              <Heart className={`w-3.5 h-3.5 ${savedLocal ? 'fill-rose-600 text-rose-600' : 'text-neutral-500'}`} />
              <span className="hidden md:inline">{savedLocal ? 'Saved in Guide' : 'Save'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-2xs cursor-pointer"
              title="Share via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-all shadow-2xs cursor-pointer"
              title="Copy Deep Link"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Link</span>
            </button>

            <button
              onClick={() => setShowBookingModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-sm cursor-pointer ml-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Showcase Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative rounded-3xl overflow-hidden border border-neutral-200 shadow-xl bg-neutral-900 text-white text-left">
          
          {/* Main Hero Background & Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1600" 
              alt="Tasty Caffee Beirut Interior & Espresso Bar" 
              className="w-full h-full object-cover opacity-35 filter saturate-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-900/40" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-4xl space-y-6">
            
            {/* Badges Strip */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-amber-400 text-neutral-950 font-mono text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded shadow">
                ★ FEATURED & VISITED FOR YOU
              </span>
              <span className="bg-emerald-850/90 text-emerald-200 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                ZAYTOUNADA SPECIALTY COFFEE LAUREATE 2026
              </span>
              <span className="bg-white/15 text-white backdrop-blur-xs font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border border-white/20 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                Sursock Heritage Quarter, Achrafieh • Beirut
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight uppercase leading-tight">
                Tasty <span className="font-bold text-amber-400">Caffee</span>
              </h1>
              <p className="text-base sm:text-xl text-neutral-200 font-serif italic font-light max-w-2xl leading-relaxed">
                "Where third-wave extraction precision meets slow-fermented French viennoiserie inside a sunlit Sursock sandstone courtyard."
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 border-t border-white/15">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Inspection Score</span>
                <span className="font-mono text-xl font-bold text-amber-400 flex items-center gap-1">
                  4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
                </span>
                <p className="text-[9px] text-neutral-300">184 Verified Ratings</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Bakery Ferment</span>
                <span className="font-mono text-xl font-bold text-emerald-300">72 Hours</span>
                <p className="text-[9px] text-neutral-300">Laminated AOP Butter</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Bean Roasts</span>
                <span className="font-mono text-xl font-bold text-white">Direct-Trade</span>
                <p className="text-[9px] text-neutral-300">Micro-Lots & Single Origin</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">Atmosphere</span>
                <span className="font-mono text-xl font-bold text-amber-300">Quiet Garden</span>
                <p className="text-[9px] text-neutral-300">120 Mbps Fiber Wi-Fi</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setActiveTab('menu');
                  setTimeout(() => {
                    const el = document.getElementById('menu-extracts-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Explore Menu Extracts ({MENU_EXTRACTS.length} Items)</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('review');
                  setTimeout(() => {
                    const el = document.getElementById('editorial-review-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Read Full Inspector Review</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Tabs & Navigation Rail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Navigation Selector Tabs */}
        <div className="flex items-center space-x-2 border-b border-neutral-200 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'review'
                ? 'bg-neutral-900 text-amber-400 shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Extra Thoughtful Review</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-neutral-900 text-amber-400 shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Curated Menu Extracts</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'testimonials'
                ? 'bg-neutral-900 text-amber-400 shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Patron & Critic Testimonials ({testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-neutral-900 text-amber-400 shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sensory Photo Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab('visit')}
            className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'visit'
                ? 'bg-neutral-900 text-amber-400 shadow-md'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Visit Guide & Hours</span>
          </button>
        </div>

        {/* TAB 1: EXTRA THOUGHTFUL IN-DEPTH REVIEW */}
        {activeTab === 'review' && (
          <div className="mt-8 space-y-10 text-left animate-fade-in" id="editorial-review-section">
            
            {/* Inspector Summary Card */}
            <div className="bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/40 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-5 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-amber-700 block">
                    ZAYTOUNADA INSPECTION BOARD • OFFICIAL MEMORANDUM
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-light uppercase tracking-wide mt-1">
                    The Definitive Assessment: <span className="font-semibold text-emerald-900">Tasty Caffee</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Inspected August 2026 • 8 Min Read</span>
                </div>
              </div>

              {/* Inspector Headline Quote */}
              <div className="border-l-4 border-amber-400 pl-4 sm:pl-6 py-2 my-4 bg-white/70 rounded-r-2xl border border-y-0 border-r-0">
                <p className="font-serif text-base sm:text-lg text-neutral-800 italic leading-relaxed">
                  "In a city known for bustling noise and fleeting trends, Tasty Caffee is a masterclass in slow craft and intentional hospitality. Here, coffee is treated not as a commodity but as agricultural poetry, perfectly counterbalanced by some of the flakiest, most fragrant viennoiserie in the entire Mediterranean basin."
                </p>
                <p className="text-xs font-mono text-neutral-500 font-bold mt-2 uppercase tracking-wider">
                  — Zaytounada Anonymous Chief Inspector for Cafes & Bakeries
                </p>
              </div>

              {/* Scorecard Radial / Bar Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
                <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs text-center">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">Espresso Clarity</span>
                  <span className="font-mono text-xl font-black text-amber-600">9.9 / 10</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs text-center">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">Pastry Lamination</span>
                  <span className="font-mono text-xl font-black text-emerald-700">9.8 / 10</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs text-center">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">Terroir & Setting</span>
                  <span className="font-mono text-xl font-black text-neutral-900">9.9 / 10</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs text-center">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">Hospitality</span>
                  <span className="font-mono text-xl font-black text-amber-600">10 / 10</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs text-center col-span-2 sm:col-span-1">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">Overall Verdict</span>
                  <span className="font-mono text-xl font-black text-emerald-800">EXCEPTIONAL</span>
                </div>
              </div>
            </div>

            {/* Multi-Chapter In-Depth Editorial Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Main Reading Column (8 Cols) */}
              <div className="lg:col-span-8 space-y-8 text-neutral-750 font-light leading-relaxed text-sm sm:text-base">
                
                {/* Chapter 1 */}
                <div className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider">
                    <span>Chapter 01</span>
                    <span>•</span>
                    <span>The Setting & Spatial Architecture</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-medium">
                    A Courtyard of Light in Historic Sursock
                  </h3>
                  <p>
                    Tucked just off the aristocratic Rue du Liban in Achrafieh, Tasty Caffee occupies the ground level of a restored 19th-century Lebanese sandstone townhouse. The transition from the street into the cafe is an instant decompression of the senses: high arched limestone ceilings, raw timber benches, brass gooseneck lamps, and the soothing hum of a Synesso espresso machine.
                  </p>
                  <p>
                    At the back lies the crown jewel: a cobblestone garden framed by century-old lemon trees, wild jasmine vines, and wrought-iron bistro tables. Morning sunlight filters through the canopy in golden dappled patterns, making it one of the rare urban pockets in Beirut where time visibly slows down.
                  </p>
                </div>

                {/* Chapter 2 */}
                <div className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                    <span>Chapter 02</span>
                    <span>•</span>
                    <span>The Coffee Alchemy & Roasting Ethos</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-medium">
                    Precision Extraction & Direct-Trade Terroir
                  </h3>
                  <p>
                    Head barista and roaster Ziad Mansour approaches coffee with the analytical rigor of a chemist and the soul of an artist. Beans are sourced via direct-trade partnerships with sustainable farms in Ethiopia (Yirgacheffe, Sidama), Colombia (Huila, Geisha micro-lots), and rare seasonal experimental nano-lots from the Chouf mountains of Mount Lebanon.
                  </p>
                  <p>
                    Their pour-over bar features temperature-regulated water tailored to each lot’s mineral profile. The Ethiopian Yirgacheffe V60 is extraordinary—delivering vibrant notes of bergamot, ripe white peach, and a lingering wild honey finish with zero astringency. On the espresso side, the double shot of the honey-anaerobic lot produces a thick, tiger-striped crema that coats the palate with roasted hazelnut and dark fig.
                  </p>
                </div>

                {/* Chapter 3 */}
                <div className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 uppercase tracking-wider">
                    <span>Chapter 03</span>
                    <span>•</span>
                    <span>The Bakery Atelier & Viennoiserie</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-medium">
                    72-Hour Lamination & Levant Botanical Infusions
                  </h3>
                  <p>
                    While many cafes treat food as an afterthought, Tasty Caffee houses a full-scale artisanal bakery visible behind a paned-glass partition. Pastry chef Maya Salameh employs a strict 72-hour cold fermentation process using French AOP Isigny butter, yielding croissants with an impossibly airy honeycomb crumb and paper-thin brittle layers.
                  </p>
                  <p>
                    The standout is undoubtedly the <strong>Cardamom & Orange Blossom Cruffin</strong>. Rolled in green cardamom sugar and injected with a velvety diplomat cream scented with authentic Lebanese neroli blossoms, it creates an unforgettable harmony between classic French technique and native Levantine aromatics.
                  </p>
                </div>

                {/* Chapter 4 */}
                <div className="space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 uppercase tracking-wider">
                    <span>Chapter 04</span>
                    <span>•</span>
                    <span>All-Day Brunch & Savory Tartines</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-neutral-900 font-medium">
                    Sourdough Feasts from Bekaa Terroir
                  </h3>
                  <p>
                    The savory menu celebrates local agricultural heritage. The <em>Heirloom Fig & Whipped Goat Labneh Tartine</em> is served on naturally leavened country sourdough, smeared generously with tangy goat labneh from the high plains of the Bekaa, seared mountain figs, and a drizzle of organic wild thyme honey. It is rustic, balanced, and deeply nourishing.
                  </p>
                </div>

              </div>

              {/* Sidebar Quick Highlights (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* At a Glance Box */}
                <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
                  <h4 className="font-serif text-base font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
                    Quick Key Highlights
                  </h4>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 block font-medium">Single-Origin Roast Program</strong>
                        <span className="text-neutral-500">Beans roasted in micro-batches every Tuesday & Friday.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 block font-medium">72h Cold Fermented Pastries</strong>
                        <span className="text-neutral-500">Baked fresh in batches at 7:30 AM and 2:00 PM daily.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 block font-medium">Sunlit Lemon Courtyard</strong>
                        <span className="text-neutral-500">Quiet outdoor seating with natural shade & outlets.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 block font-medium">Fiber Wi-Fi & Work Friendly</strong>
                        <span className="text-neutral-500">Dedicated high-speed 120 Mbps connection for creatives.</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer text-center"
                    >
                      Book Coffee Tasting / Table
                    </button>
                  </div>
                </div>

                {/* Inspector Signature Dish Recommendations */}
                <div className="bg-gradient-to-br from-emerald-900 to-neutral-900 text-white p-6 rounded-3xl shadow-md space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-amber-300">
                      Must-Order Inspector Pairings
                    </h4>
                  </div>

                  <div className="space-y-3 text-xs text-neutral-300">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                      <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest block font-bold">The Morning Ritual</span>
                      <strong className="text-white block text-sm mt-0.5">Ethiopian V60 + Cardamom Cruffin</strong>
                      <p className="text-[11px] text-neutral-300 mt-1 font-light">The bright floral citrus notes of the pour-over perfectly slice through the rich butter and cardamom diplomat cream.</p>
                    </div>

                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                      <span className="font-mono text-[10px] text-emerald-300 uppercase tracking-widest block font-bold">The Afternoon Chill</span>
                      <strong className="text-white block text-sm mt-0.5">Nitro Cold Brew + Halawa Pain Au Chocolat</strong>
                      <p className="text-[11px] text-neutral-300 mt-1 font-light">The creamy cascading cold drip balances the nutty, bittersweet Valrhona chocolate and sesame paste.</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: CURATED MENU EXTRACTS */}
        {activeTab === 'menu' && (
          <div className="mt-8 space-y-8 text-left animate-fade-in" id="menu-extracts-section">
            
            {/* Header & Search Bar */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-amber-600 block">
                  AUTHENTIC KITCHEN & BREW BAR ROSTER
                </span>
                <h3 className="font-serif text-2xl text-neutral-900 font-light uppercase tracking-wide mt-0.5">
                  Curated <span className="font-semibold text-emerald-800">Menu Extracts</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Prices verified in USD & Lebanese Pounds (LBP) • All dairy & grains locally sourced from Bekaa & Mount Lebanon.
                </p>
              </div>

              {/* Search Filter Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search coffee, pastries, tartines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500 transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', label: 'All Extracts' },
                { id: 'espresso_brews', label: '☕ Specialty Brews & Espresso' },
                { id: 'pastries_bakery', label: '🥐 72h Viennoiserie & Bakery' },
                { id: 'brunch_tartines', label: '🥑 All-Day Brunch & Tartines' },
                { id: 'cold_elixirs', label: '🧊 Nitro & Cold Elixirs' },
                { id: 'desserts', label: '🍯 Desserts & Delicacies' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-800 text-amber-300 shadow-xs'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredMenuItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white border border-neutral-200 hover:border-amber-300/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group text-left relative overflow-hidden"
                >
                  {item.isInspectorPick && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-neutral-950 text-[8.5px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-neutral-950 text-neutral-950" />
                      <span>Inspector Choice</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4 pr-16">
                      <div>
                        <h4 className="font-serif font-semibold text-base text-neutral-900 group-hover:text-emerald-850 transition-colors">
                          {item.name}
                        </h4>
                        {item.nameAr && (
                          <p className="text-[11px] font-serif text-neutral-400 mt-0.5" dir="rtl">
                            {item.nameAr}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 font-light leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tasting Notes Chips */}
                    {item.tastingNotes && item.tastingNotes.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[9px] font-mono uppercase text-neutral-400 font-bold">Notes:</span>
                        {item.tastingNotes.map((note, idx) => (
                          <span 
                            key={idx} 
                            className="bg-amber-50/80 border border-amber-200/60 text-amber-900 text-[9.5px] font-mono px-2 py-0.5 rounded-md"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Price & Tags */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-base font-bold text-emerald-900">${item.priceUsd.toFixed(2)}</span>
                      <span className="text-[10px] font-mono text-neutral-400 ml-2">({item.priceLbp})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[8.5px] font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMenuItems.length === 0 && (
              <div className="py-16 bg-white border border-dashed border-neutral-300 rounded-3xl text-center space-y-3">
                <Coffee className="w-10 h-10 text-neutral-300 mx-auto" />
                <p className="font-serif text-neutral-600 font-medium">No menu items match your search criteria.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="mt-8 space-y-8 text-left animate-fade-in" id="testimonials-section">
            
            {/* Header & Write Review Action */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-emerald-700 block">
                  COMMUNITY & CRITIC VOICES
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-light uppercase tracking-wide mt-1">
                  Patron & Critic <span className="font-semibold text-amber-600">Testimonials</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                  Real experiences from verified food critics, coffee connoisseurs, and neighborhood locals on Rue du Liban.
                </p>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2 w-fit"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Submit Your Testimonial</span>
              </button>
            </div>

            {/* Testimonial Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((test) => (
                <div 
                  key={test.id}
                  className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Author Avatar & Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={test.avatar} 
                          alt={test.author} 
                          className="w-11 h-11 rounded-full object-cover border border-neutral-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-serif font-bold text-sm text-neutral-900">{test.author}</h4>
                            {test.verified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Inspector / Patron" />
                            )}
                          </div>
                          <p className="text-[10px] font-mono text-neutral-400">{test.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* Testimonial Comment */}
                    <p className="text-xs sm:text-sm text-neutral-700 font-light leading-relaxed italic border-l-2 border-amber-300 pl-3.5">
                      "{test.comment}"
                    </p>
                  </div>

                  {/* Favorite Order Snippet */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span className="text-emerald-900 font-medium">Favorite: <strong className="text-neutral-800">{test.favoriteOrder}</strong></span>
                    <span>{test.date}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: SENSORY PHOTO GALLERY */}
        {activeTab === 'gallery' && (
          <div className="mt-8 space-y-8 text-left animate-fade-in" id="sensory-gallery-section">
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-amber-600 block">
                IMMERSIVE VISUAL ARCHIVE
              </span>
              <h3 className="font-serif text-2xl text-neutral-900 font-light uppercase tracking-wide mt-1">
                Sensory <span className="font-semibold text-emerald-800">Atmosphere Gallery</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Visual snapshots from our inspector’s morning and afternoon sessions at Tasty Caffee.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800', title: 'Espresso Bar & Synesso Machine', subtitle: 'Baristas dialing in morning extractions' },
                { url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800', title: '72-Hour Laminated Cruffins', subtitle: 'Fresh out of the morning oven' },
                { url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800', title: 'Single-Origin V60 Pour Over', subtitle: 'Precision water stream at 92°C' },
                { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', title: 'Sunlit Lemon Tree Courtyard', subtitle: 'Cobblestone terrace in Achrafieh' },
                { url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800', title: 'Heirloom Fig Sourdough Tartine', subtitle: 'Whipped Bekaa goat labneh & wild thyme' },
                { url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800', title: 'Nitro Cold Brew on Tap', subtitle: 'Cascading micro-foam head' }
              ].map((img, idx) => (
                <div key={idx} className="group relative rounded-3xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100 h-72">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                    <span className="text-[9px] font-mono text-amber-300 uppercase tracking-widest block font-bold">SNAPSHOT 0{idx + 1}</span>
                    <h5 className="font-serif font-semibold text-base leading-snug">{img.title}</h5>
                    <p className="text-[11px] text-neutral-300 font-light">{img.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: VISIT GUIDE & HOURS */}
        {activeTab === 'visit' && (
          <div className="mt-8 space-y-8 text-left animate-fade-in" id="visit-guide-section">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Practical Details (7 Cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-extrabold text-emerald-700 block">
                    PRACTICAL DIRECTORY
                  </span>
                  <h3 className="font-serif text-2xl text-neutral-900 font-light uppercase tracking-wide mt-1">
                    Visiting <span className="font-semibold text-amber-600">Tasty Caffee</span>
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-900 block font-medium">Address & Location</strong>
                      <span className="text-neutral-600">Sursock Heritage Quarter, Rue du Liban, Achrafieh, Beirut, Lebanon</span>
                      <p className="text-[11px] text-neutral-400 mt-1 font-mono">2 minutes walking from Sursock Museum</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150">
                    <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-900 block font-medium">Opening Hours</strong>
                      <span className="text-neutral-600">Monday to Sunday: 7:30 AM – 11:00 PM</span>
                      <p className="text-[11px] text-emerald-700 mt-1 font-mono font-bold">Pastries fresh from the oven: 7:30 AM & 2:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150">
                    <Phone className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-900 block font-medium">Telephone & WhatsApp Reservations</strong>
                      <span className="text-neutral-600 font-mono">+961 1 218 890 / +961 70 939 779</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150">
                    <Wifi className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-900 block font-medium">Remote Work Amenities</strong>
                      <span className="text-neutral-600">Ultra-fast Fiber Optic (120 Mbps), quiet garden zones, laptop-friendly charging hubs.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="flex-1 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer text-center"
                  >
                    Reserve Table / Tasting
                  </button>
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Map & Neighborhood Context (5 Cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-neutral-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                    NEIGHBORHOOD CONTEXT
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-light">
                    In the Heart of <span className="font-bold text-amber-300">Achrafieh - Sursock</span>
                  </h4>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    Sursock is famous for its Venetian-Gothic mansions, winding staircases, and art institutions. A visit to Tasty Caffee pairs naturally with a morning stroll around the Sursock Museum gardens and a visit to Nicholas Sursock’s private art collections.
                  </p>
                </div>

                <div className="p-4 bg-white/10 rounded-2xl border border-white/15 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-300 font-bold block">
                    RECOMMENDED WALKING SEQUENCE
                  </span>
                  <p className="text-xs text-white">
                    1. Morning V60 & Cruffin at Tasty Caffee ➔ 2. Sursock Palace Gardens ➔ 3. Gemmayze Antique bookshops.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=Tasty+Caffee+Achrafieh+Beirut+Lebanon`;
                    window.open(googleMapsUrl, '_blank');
                  }}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-neutral-950 font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* MODAL: SUBMIT NEW TESTIMONIAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-neutral-200 text-left space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[9.5px] font-mono uppercase tracking-widest font-extrabold text-amber-600 block">
                  CONTRIBUTE TO THE RECORD
                </span>
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  Submit Tasty Caffee Testimonial
                </h3>
              </div>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewReview} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya El-Mir"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Your Role / Background
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coffee Enthusiast, Architect, Sursock Resident"
                  value={newReviewRole}
                  onChange={(e) => setNewReviewRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Rating Stars
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                  <span className="font-mono text-xs font-bold text-neutral-700 ml-2">{newReviewRating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Favorite Order / Pairing
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ethiopian Yirgacheffe V60 + Cardamom Cruffin"
                  value={newReviewFavorite}
                  onChange={(e) => setNewReviewFavorite(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Your Detailed Review & Thoughts *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the coffee taste profile, pastry flakiness, garden atmosphere, service..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2.5 text-xs font-mono font-bold uppercase text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TABLE / TASTING RESERVATION */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-neutral-200 text-left space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[9.5px] font-mono uppercase tracking-widest font-extrabold text-emerald-700 block">
                  PRIORITY GUEST CONCIERGE
                </span>
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  Reserve Table / Tasting at Tasty Caffee
                </h3>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maan Barazy"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@domain.com"
                  value={bookEmail}
                  onChange={(e) => setBookEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Time Slot
                  </label>
                  <select
                    value={bookTime}
                    onChange={(e) => setBookTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500 font-mono"
                  >
                    <option value="8:30 AM">8:30 AM (Fresh Morning Bake)</option>
                    <option value="10:00 AM">10:00 AM (Brunch & Pour Over)</option>
                    <option value="12:30 PM">12:30 PM (Lunch Tartines)</option>
                    <option value="2:30 PM">2:30 PM (Afternoon Warm Bake)</option>
                    <option value="5:00 PM">5:00 PM (Sunset Cold Drip)</option>
                    <option value="7:30 PM">7:30 PM (Evening Lounge)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={bookGuests}
                  onChange={(e) => setBookGuests(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                  Special Notes / Seating Preference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Garden courtyard table, quiet corner, dietary requests..."
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2.5 text-xs font-mono font-bold uppercase text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Confirm Priority Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

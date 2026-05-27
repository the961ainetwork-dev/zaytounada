import React, { useState, useTransition } from 'react';
import { RESTAURANTS } from '../data/restaurants';
import { Restaurant, Booking } from '../types';
import { Sparkles, Calendar, ArrowRight, ArrowLeft, CheckCircle, MapPin, DollarSign, ChefHat, Compass, FileText } from 'lucide-react';

interface PlanMyDiningProps {
  onAddBooking: (booking: Booking) => void;
  onNavigateTab: (tab: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function PlanMyDiningView({
  onAddBooking,
  onNavigateTab,
  onSelectRestaurant
}: PlanMyDiningProps) {
  // Wizard steps: 1 = Location, 2 = Cuisine/Vibe, 3 = Price & Preference, 4 = Counselor Recommendations & Booking
  const [step, setStep] = useState<number>(1);
  const [location, setLocation] = useState<string>('Beirut');
  const [cuisine, setCuisine] = useState<string>('Traditional Lebanese');
  const [price, setPrice] = useState<string>('$$$$');
  const [tablePreference, setTablePreference] = useState<string>('Main VIP Room');
  
  // Counselor status and outputs
  const [isPending, startTransition] = useTransition();
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  const [matchedRestaurants, setMatchedRestaurants] = useState<Restaurant[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Booking details for confirmation sequence
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('2026-05-30');
  const [bookingTime, setBookingTime] = useState<string>('20:30');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [selectedBookableRestaurant, setSelectedBookableRestaurant] = useState<Restaurant | null>(null);
  
  // Confirmed ticket state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const locations = ['Beirut', 'Byblos', 'Batroun', 'Tripoli'];
  
  const cuisinesForLocation: Record<string, string[]> = {
    'Beirut': ['Traditional Lebanese Haute Cuisine', 'Polished Contemporary Lebanese', 'Armenian-Lebanese Homestyle', 'Authentic Levantine Grill & Mezze', 'Gourmet Pub & Craft Cocktails', 'Waterfront Rooftop Lounge', 'Underground Electronic Temple', 'Theatrical Music Cabaret'],
    'Byblos': ['Lebanese Seafood & Coastal Grill', 'Funky Lebanese Fusion & Lounge', 'Traditional Bakeries & Manousheh'],
    'Batroun': ['Lebanese Rural Kitchen & Farmhouse', 'Beachfront Craft Brewery', 'Coastal Seafood & Sunset Vibe'],
    'Tripoli': ['Traditional Sweets & Baked Desserts']
  };

  const currentCuisines = cuisinesForLocation[location] || ['Traditional Lebanese', 'Sushi', 'Modern Italian'];

  const tablePlacements = [
    { id: 'vip', name: 'Main VIP Dining Room', desc: 'Opulent hall with live ambient acoustics.' },
    { id: 'terrace', name: 'Scenic Outdoor Balcony', desc: 'Sunkissed views with ocean breeze or cityscape.' },
    { id: 'chef', name: 'The Chef\'s Counter', desc: 'Direct view of the custom open flame fires.' },
    { id: 'private', name: 'Private Speakeasy Vault', desc: 'Maximum discretion and personal Maître D\'.' }
  ];

  // Auto-set the first available cuisine when location shifts
  const handleLocationChange = (loc: string) => {
    setLocation(loc);
    const available = cuisinesForLocation[loc] || [];
    if (available.length > 0) {
      setCuisine(available[0]);
    }
  };

  // Run AI reasoning & query server-side endpoint
  const queryCounselorAI = () => {
    setErrorMsg('');
    setAiSuggestions('');
    
    // local filtering of database
    const matches = RESTAURANTS.filter(r => {
      const cityMatch = r.city.toLowerCase() === location.toLowerCase();
      // soft match for culinary profile
      const cuisineMatch = r.cuisine.toLowerCase().includes(cuisine.toLowerCase()) || 
                           cuisine.toLowerCase().includes(r.cuisine.toLowerCase());
      const priceMatch = price === 'All Price Tiers' || r.priceRange === price || r.priceRange.length <= price.length;
      return cityMatch && (cuisineMatch || priceMatch);
    });

    setMatchedRestaurants(matches);
    if (matches.length > 0) {
      setSelectedBookableRestaurant(matches[0]);
    }

    // Prepare prompt for live Gemini counselor matching
    const aiPrompt = `Recommend fine dining experiences in ${location} for the gourmet craving ${cuisine} cuisine with a budget category of ${price}. The preferred seating layout is "${tablePreference}". Specifically suggest existing matching options from the database or compatible local gems, and explain why this selection represents elite Zaytouynda culinary value. Formulate the response with elegant, scannable paragraphs and bullet points. Do not include pricing metadata or logs.`;

    startTransition(async () => {
      try {
        const res = await fetch('/api/concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: aiPrompt,
            history: [],
            savedContext: matches.slice(0, 2).map(m => m.name)
          })
        });

        const data = await res.json();
        if (data.reply) {
          setAiSuggestions(data.reply);
          setStep(4);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error("Empty response received from server.");
        }
      } catch (err: any) {
        console.warn("AI endpoint unreachable, falling back to offline directory matching:", err);
        // Fallback robust narrative
        const mockReply = `### Selected Counselor Assessment for ${location}

Based on your culinary craving for **${cuisine}** and budget index **${price}** with a seating configuration in the **${tablePreference}**, our inspectors suggest the following exceptional curation:

*   **Primary Destination: ${matches.length > 0 ? matches[0].name : 'Levantine Palace Diner'}**  
    Our inspector surveys report top marks for flavor consistency and authenticity. Emphasized signatures include hand-pounded delicacies paired with custom direct oils.
*   **Seating Placement**: Your choice of **${tablePreference}** provides an elevated, secure vantage point with custom tasting intervals.
*   **Alternative Pairing**: Historic seafood checkpoints nearby or traditional bakeries of high distinction.

Please proceed to secure your allocation slot below, and our concierge will forward the confirmation details directly.`;
        
        setAiSuggestions(mockReply);
        setStep(4);
      }
    });
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) {
      alert("Please specify your name and email address to request custom allocation.");
      return;
    }

    const targetRestaurant = selectedBookableRestaurant || RESTAURANTS[0];
    const newBooking: Booking = {
      id: 'book-wizard-' + Date.now(),
      restaurantId: targetRestaurant.id,
      restaurantName: targetRestaurant.name,
      userName,
      userEmail,
      guestsCount,
      date: bookingDate,
      time: bookingTime,
      specialRequests: `${specialRequests} (Table Seating Preference: ${tablePreference})`,
      status: 'confirmed'
    };

    onAddBooking(newBooking);
    setConfirmedBooking(newBooking);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" id="plan-my-dining-view">
      
      {/* Tab Header Banner */}
      <div className="mb-8 border-b border-white/5 pb-4.5 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2">
        <div>
          <h2 className="font-serif font-light text-3xl text-white flex items-center gap-2.5">
            <Compass className="w-8 h-8 text-red-500" />
            <span>Plan My Dining</span>
          </h2>
          <p className="text-xs text-white/40 mt-1 max-w-xl font-light">
            An interactive step-by-step counselor checklist matching your layout requirements, budget tier, and location preferences with our elite curated directory.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900 border border-white/5 p-1 rounded-lg">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold font-mono transition-all ${
                step === s
                  ? 'bg-red-600 text-white shadow-md'
                  : step > s
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/30'
                  : 'text-white/30 hover:text-white/55'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: SELECT LOCATION */}
      {step === 1 && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-10 text-center animate-fade-in space-y-8">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase font-bold">Step One • Culinary Focus</span>
            <h3 className="font-serif text-2xl text-white font-light">Select Your Gastro Capital Location</h3>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              Choose the global destination you wish to explore. Our inspectors focus highly on Lebanese ports of gastronomy and international culinary capitols.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {locations.map((loc) => {
              const matchedCount = RESTAURANTS.filter(r => r.city === loc).length;
              return (
                <button
                  key={loc}
                  onClick={() => handleLocationChange(loc)}
                  className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
                    location === loc
                      ? 'bg-red-650/10 border-red-550/40 text-white shadow-xl ring-1 ring-red-550/20'
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/70'
                  }`}
                >
                  <MapPin className={`w-6 h-6 ${location === loc ? 'text-red-500' : 'text-white/30'}`} />
                  <div>
                    <span className="font-serif text-base font-medium block">{loc}</span>
                    <span className="text-[9px] font-mono text-white/30 uppercase mt-1 block">
                      {matchedCount} Registered Spots
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-6 flex justify-end max-w-3xl mx-auto">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white text-xs uppercase font-bold tracking-widest transition-all rounded-lg cursor-pointer"
            >
              <span>Choose Culinary Vibe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT CUISINE & TASTE */}
      {step === 2 && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-10 text-center animate-fade-in space-y-8">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase font-bold">Step Two • Gastronomy Selection</span>
            <h3 className="font-serif text-2xl text-white font-light">What style of cooking do you desire?</h3>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              Selecting your ideal cuisine allows our counselor model to sort the flavors, seasoning levels, and signature dishes correctly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3.5 justify-center max-w-2xl mx-auto">
            {currentCuisines.map((c) => (
              <button
                key={c}
                onClick={() => setCuisine(c)}
                className={`px-5 py-3 rounded-full border text-xs font-medium cursor-pointer transition-all ${
                  cuisine === c
                    ? 'bg-red-600 text-white border-red-600 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                }`}
              >
                <ChefHat className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-white/60" />
                <span>{c}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 flex justify-between max-w-3xl mx-auto border-t border-white/5">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-3 bg-neutral-900 border border-white/10 hover:bg-white/5 text-white text-xs uppercase font-bold tracking-widest transition-all rounded-lg cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white text-xs uppercase font-bold tracking-widest transition-all rounded-lg cursor-pointer"
            >
              <span>Seating & Price</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT PRICE & SEATING LOCATION */}
      {step === 3 && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-10 text-left animate-fade-in space-y-8">
          <div className="max-w-xl mx-auto text-center space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase font-bold">Step Three • Allocation & Budget</span>
            <h3 className="font-serif text-2xl text-white font-light">Determine Budget & Atmosphere Preference</h3>
            <p className="text-xs text-white/40 leading-relaxed font-light">
              Refinement of details: establish your expenditure standard and match secure layout choices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Price section */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase text-white/60 tracking-wider flex items-center gap-1.5 font-bold">
                <DollarSign className="w-4 h-4 text-red-500" />
                <span>Expenditure Standard (Price Category)</span>
              </label>
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { value: '$$$$', label: 'Supreme Luxury', desc: 'Prestige ingredients & elite cellars.' },
                  { value: '$$$', label: 'Premium Dining', desc: 'Refined courses and master artistry.' },
                  { value: '$$', label: 'Moderate Bistro', desc: 'Accessible elegance with historic vibe.' },
                  { value: 'All Price Tiers', label: 'Open Focus', desc: 'Assess any vetted kitchen quality.' }
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPrice(p.value)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      price === p.value
                        ? 'bg-red-650/15 border-red-550/50 text-white ring-1 ring-red-550/10 shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/70'
                    }`}
                  >
                    <span className="font-serif text-sm font-semibold block text-red-400">{p.value === 'All Price Tiers' ? '$$' : p.value}</span>
                    <span className="font-sans text-xs font-bold block mt-1">{p.label}</span>
                    <span className="text-[9.5px] text-white/35 mt-0.5 block leading-tight">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table layout Preference */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase text-white/60 tracking-wider flex items-center gap-1.5 font-bold">
                <Compass className="w-4 h-4 text-red-500" />
                <span>Discretionary Seating Layout</span>
              </label>
              <div className="space-y-2.5">
                {tablePlacements.map((plat) => (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => setTablePreference(plat.name)}
                    className={`w-full p-3.5 rounded-lg border text-left flex items-start justify-between gap-3 cursor-pointer transition-all ${
                      tablePreference === plat.name
                        ? 'bg-red-650/15 border-red-550/50 text-white font-medium shadow-md'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/60'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{plat.name}</span>
                      <span className="text-[10px] text-white/40 font-light mt-0.5 block">{plat.desc}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${tablePreference === plat.name ? 'border-red-500 bg-red-600 text-white' : 'border-white/20'}`}>
                      {tablePreference === plat.name && <div className="w-1.5 h-1.5 rounded-full bg-white bg-opacity-95" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-between max-w-4xl mx-auto border-t border-white/5">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-3 bg-neutral-900 border border-white/10 hover:bg-white/5 text-white text-xs uppercase font-bold tracking-widest transition-all rounded-lg cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={queryCounselorAI}
              className="flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs uppercase font-bold tracking-[0.2em] transition-all rounded-lg cursor-pointer shadow-lg hover:brightness-110"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Query AI Counselor</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RECOMMENDATIONS, INSIGHTS & BOOKING INTEGRATION */}
      {step === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* Left panel: Counselor advice */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6.5 text-left shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-600/25 flex items-center justify-center text-red-500">
                    <Sparkles className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-white font-medium">Zaytouynda Inspection Brief</h3>
                    <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Exclusive Matching Output</p>
                  </div>
                </div>
                <div className="text-[10px] font-mono tracking-wider text-red-500 bg-red-600/10 border border-red-500/20 px-2.5 py-1 rounded">
                  {location} • {cuisine}
                </div>
              </div>

              {/* Suggestions text rendering */}
              {isPending ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <p className="font-serif text-white/50 italic text-sm text-center">
                    Your gourmet counselor is contacting the Beirut Head Office to formulate matching options...
                  </p>
                </div>
              ) : (
                <div className="text-sm text-white/80 leading-relaxed font-light space-y-4 markdown-body">
                  {aiSuggestions.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={idx} className="font-serif text-white font-bold text-base mt-4 mb-2 tracking-wide text-red-400">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('**') || line.startsWith('* ')) {
                      return <p key={idx} className="pl-3 border-l-2 border-red-600/30 text-xs text-white/70 py-0.5 leading-snug">{line.replace('* ', '')}</p>;
                    }
                    return <p key={idx} className="text-white/75 mt-2 text-xs">{line}</p>;
                  })}
                </div>
              )}

              {/* Matches display cards */}
              {!isPending && matchedRestaurants.length > 0 && (
                <div className="pt-6 border-t border-white/5 space-y-3.5">
                  <h4 className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Matching Registered Directories ({matchedRestaurants.length})</h4>
                  <div className="space-y-3">
                    {matchedRestaurants.map((m) => (
                      <div 
                        key={m.id}
                        onClick={() => setSelectedBookableRestaurant(m)}
                        className={`p-4.5 rounded-xl border text-left flex items-center justify-between gap-4 cursor-pointer transition-all ${
                          selectedBookableRestaurant?.id === m.id
                            ? 'bg-red-650/10 border-red-550/40 text-white'
                            : 'bg-white/5 hover:bg-white/10 border-white/5 text-white/60'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <img src={m.imageUrl} alt={m.name} className="w-12 h-12 rounded object-cover border border-white/10 bg-neutral-900" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-serif text-sm font-bold block text-white/90">{m.name}</span>
                            <span className="text-[10px] text-white/40 block leading-tight mt-0.5">{m.cuisine} • Chef {m.chef}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-amber-400 block text-xs tracking-tighter">
                            {'✻'.repeat(m.stars || 1)}
                          </span>
                          <span className="text-[9px] font-mono text-white/30 uppercase block mt-1">
                            {m.priceRange} {m.city}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-3 bg-neutral-900 border border-white/10 hover:bg-white/5 text-white text-xs uppercase font-bold tracking-widest transition-all rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Adjust Parameters</span>
              </button>
            </div>
          </div>

          {/* Right panel: Direct Booking Wizard */}
          <div className="lg:col-span-5 space-y-6">
            
            {confirmedBooking ? (
              <div className="bg-[#0b0c0a] border border-emerald-500/15 rounded-2xl p-6.5 text-center shadow-2xl space-y-6">
                <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800/30">
                  <CheckCircle className="w-6 h-6 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold bg-emerald-950/45 px-2.5 py-1 border border-emerald-800/20 rounded">
                    CONCIERGE TICKET ACQUIRED
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white mt-2">Allocation Complete</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    Your seating of **{tablePreference}** has been coordinated with the Maitre D' at **{confirmedBooking.restaurantName}**. Detailed ticket summary forwarded below.
                  </p>
                </div>

                <div className="p-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">GUEST:</span>
                    <span className="text-white font-bold">{confirmedBooking.userName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">EMAIL:</span>
                    <span className="text-white">{confirmedBooking.userEmail}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">ESTABLISHMENT:</span>
                    <span className="text-white text-red-400 font-bold">{confirmedBooking.restaurantName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">DATE & TIME:</span>
                    <span className="text-white">{confirmedBooking.date} • {confirmedBooking.time}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">COVERS (GUESTS):</span>
                    <span className="text-white">{confirmedBooking.guestsCount} Seats Allocated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">PLACEMENT:</span>
                    <span className="text-white">{tablePreference}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => onNavigateTab('saved')}
                    className="w-full px-4 py-3 bg-red-650 hover:bg-red-550 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer"
                  >
                    View Active Bookings Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setConfirmedBooking(null);
                      setStep(1);
                    }}
                    className="w-full px-4 py-3 bg-transparent border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer"
                  >
                    Plan Another Experience
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl text-left space-y-5">
                <div>
                  <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <span>Instant Seating Reservation</span>
                  </h3>
                  <p className="text-xs text-white/40 mt-1 max-w-sm font-light">
                    Submit your details using our Zaytouynda luxury portal to secure a placing list at **{selectedBookableRestaurant?.name || 'Levantine Diner'}** directly.
                  </p>
                </div>

                <form onSubmit={handleCreateBooking} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block font-bold">Primary Guest Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Al-Sayed"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. resident@domain.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block font-bold">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block font-bold">Prefers Time</label>
                      <input
                        type="time"
                        required
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block font-bold">Covers Count (Guests)</label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-[#ffffff15] rounded-lg text-white font-medium focus:outline-none focus:border-red-600/50 outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                        <option key={num} value={num} className="bg-neutral-950 text-white">
                          {num} Guest{num > 1 ? 's' : ''} (Table Cover)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-wider block font-bold">Special Requests / Seating Notes</label>
                    <textarea
                      placeholder="e.g. Wheat allergy, celebrating continuous golden anniversary celebrations..."
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50 resize-none font-sans"
                    />
                  </div>

                  <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-lg text-[10px] text-red-300 font-mono flex items-start gap-2 leading-relaxed">
                    <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                    <span>Seat allocated for **{tablePreference}** will be held for exactly 15 minutes past scheduled timeline. No prepayment necessary.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-center text-white bg-red-600 hover:bg-red-550 text-[10px] tracking-widest font-bold uppercase transition-all rounded-lg cursor-pointer"
                  >
                    Confirm Exclusive Reservation Row
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

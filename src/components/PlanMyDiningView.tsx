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
  const [cuisine, setCuisine] = useState<string>('Traditional Lebanese Haute Cuisine');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-neutral-900" id="plan-my-dining-view">
      
      {/* Tab Header Banner */}
      <div className="mb-8 border-b border-neutral-200 pb-4.5 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2">
        <div className="text-left">
          <h2 className="font-serif font-light text-3xl text-neutral-900 flex items-center gap-2.5">
            <Compass className="w-8 h-8 text-red-650" />
            <span>Plan My Dining</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl font-light">
            An interactive step-by-step counselor checklist matching your layout requirements, budget tier, and location preferences with our elite curated directory.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 p-1 rounded-lg">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold font-mono transition-all ${
                step === s
                  ? 'bg-red-600 text-white shadow'
                  : step > s
                  ? 'bg-emerald-50 text-emerald-650 border border-emerald-300 font-extrabold'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: SELECT LOCATION */}
      {step === 1 && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-10 text-center animate-fade-in space-y-8 shadow-sm">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-red-650 uppercase font-extrabold block">Step One • Culinary Focus</span>
            <h3 className="font-serif text-2xl text-neutral-950 font-light">Select Your Gastro Capital Location</h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
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
                      ? 'bg-red-50/50 border-red-500 text-neutral-950 shadow ring-1 ring-red-200'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <MapPin className={`w-6 h-6 ${location === loc ? 'text-red-650' : 'text-neutral-400'}`} />
                  <div>
                    <span className="font-serif text-base font-semibold block">{loc}</span>
                    <span className="text-[9px] font-mono text-neutral-400 uppercase mt-1 block font-bold">
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
              className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-650 text-white text-xs uppercase font-bold tracking-widest transition-all rounded-lg cursor-pointer"
            >
              <span>Choose Culinary Vibe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT CUISINE & TASTE */}
      {step === 2 && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-10 text-center animate-fade-in space-y-8 shadow-sm">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-red-650 uppercase font-extrabold block">Step Two • Gastronomy Selection</span>
            <h3 className="font-serif text-2xl text-neutral-950 font-light">What style of cooking do you desire?</h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Selecting your ideal cuisine allows our counselor model to sort the flavors, seasoning levels, and signature dishes correctly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3.5 justify-center max-w-2xl mx-auto">
            {currentCuisines.map((c) => (
              <button
                key={c}
                onClick={() => setCuisine(c)}
                className={`px-5 py-3 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                  cuisine === c
                    ? 'bg-red-600 text-white border-red-600 shadow-sm'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-250'
                }`}
              >
                <ChefHat className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-neutral-550" />
                <span>{c}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 flex justify-between max-w-3xl mx-auto border-t border-neutral-100">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-3 bg-neutral-100 border border-neutral-250 hover:bg-neutral-200 text-neutral-700 text-xs uppercase font-bold tracking-widest transition-all rounded-lg cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-650 text-white text-xs uppercase font-bold tracking-widest transition-all rounded-lg cursor-pointer"
            >
              <span>Seating & Price</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT PRICE & SEATING LOCATION SECTION */}
      {step === 3 && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-10 text-left animate-fade-in space-y-8 shadow-sm">
          <div className="max-w-xl mx-auto text-center space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-red-650 uppercase font-extrabold block">Step Three • Allocation & Budget</span>
            <h3 className="font-serif text-2xl text-neutral-950 font-light text-center">Determine Budget & Atmosphere Preference</h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-light text-center">
              Refinement of details: establish your expenditure standard and match secure layout choices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Price section */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase text-neutral-600 tracking-wider flex items-center gap-1.5 font-bold">
                <DollarSign className="w-4 h-4 text-red-600" />
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
                        ? 'bg-red-50/50 border-red-500 text-neutral-950 ring-1 ring-red-200 shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="font-serif text-sm font-bold block text-red-650">{p.value === 'All Price Tiers' ? '$$' : p.value}</span>
                    <span className="font-sans text-xs font-bold block mt-1">{p.label}</span>
                    <span className="text-[9.5px] text-neutral-550 mt-0.5 block leading-tight">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table layout Preference */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase text-neutral-600 tracking-wider flex items-center gap-1.5 font-bold">
                <Compass className="w-4 h-4 text-red-600" />
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
                        ? 'bg-red-50/40 border-red-500 text-neutral-950 font-medium shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block text-neutral-900">{plat.name}</span>
                      <span className="text-[10px] text-neutral-500 font-light mt-0.5 block">{plat.desc}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${tablePreference === plat.name ? 'border-red-550 bg-red-600 text-white' : 'border-neutral-300'}`}>
                      {tablePreference === plat.name && <div className="w-1.5 h-1.5 rounded-full bg-white bg-opacity-95" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-between max-w-4xl mx-auto border-t border-neutral-150">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-3 bg-neutral-100 border border-neutral-250 hover:bg-neutral-200 text-neutral-750 text-xs uppercase font-bold tracking-widest transition-all rounded-lg cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={queryCounselorAI}
              className="flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-red-650 to-orange-500 text-white text-xs uppercase font-bold tracking-[0.2em] transition-all rounded-lg cursor-pointer shadow-sm hover:brightness-105"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Query AI Counselor</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RECOMMENDATIONS, INSIGHTS & BOOKING INTEGRATION */}
      {step === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in text-left">
          
          {/* Left panel: Counselor advice */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6.5 text-left shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-neutral-150 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                    <Sparkles className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-neutral-950 font-semibold leading-tight">Zaytouynda Inspection Brief</h3>
                    <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider mt-0.5">Exclusive Matching Output</p>
                  </div>
                </div>
                <div className="text-[10px] font-mono tracking-wider text-red-650 bg-red-50 border border-red-200 px-2.5 py-1 rounded font-bold">
                  {location} • {cuisine}
                </div>
              </div>

              {/* Suggestions text rendering */}
              {isPending ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <p className="font-serif text-neutral-500 italic text-sm text-center">
                    Your gourmet counselor is contacting the Beirut Head Office to formulate matching options...
                  </p>
                </div>
              ) : (
                <div className="text-sm text-neutral-800 leading-relaxed font-light space-y-4 markdown-body">
                  {aiSuggestions.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={idx} className="font-serif text-neutral-950 font-bold text-base mt-4 mb-2 tracking-wide text-red-650">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('**') || line.startsWith('* ')) {
                      return <p key={idx} className="pl-3 border-l-2 border-red-500/50 text-xs text-neutral-700 py-0.5 leading-snug">{line.replace('* ', '')}</p>;
                    }
                    return <p key={idx} className="text-neutral-700 mt-2 text-xs leading-relaxed">{line}</p>;
                  })}
                </div>
              )}

              {/* Matches display cards */}
              {!isPending && matchedRestaurants.length > 0 && (
                <div className="pt-6 border-t border-neutral-150 space-y-3.5">
                  <h4 className="text-[10px] font-mono uppercase text-neutral-450 tracking-wider font-bold">Matching Registered Directories ({matchedRestaurants.length})</h4>
                  <div className="space-y-3">
                    {matchedRestaurants.map((m) => (
                      <div 
                        key={m.id}
                        onClick={() => setSelectedBookableRestaurant(m)}
                        className={`p-4.5 rounded-xl border text-left flex items-center justify-between gap-4 cursor-pointer transition-all ${
                          selectedBookableRestaurant?.id === m.id
                            ? 'bg-red-50 border-red-500 text-neutral-950 shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <img src={m.imageUrl} alt={m.name} className="w-12 h-12 rounded object-cover border border-neutral-250 bg-neutral-100" referrerPolicy="no-referrer" />
                          <div>
                            <span className="font-serif text-sm font-bold block text-neutral-950">{m.name}</span>
                            <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">{m.cuisine} • Chef {m.chef}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-amber-550 block text-xs tracking-tighter">
                            {'✻'.repeat(m.stars || 1)}
                          </span>
                          <span className="text-[9px] font-mono text-neutral-450 uppercase block mt-1">
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
                className="flex items-center gap-2 px-5 py-3 bg-neutral-105 border border-neutral-250 hover:bg-neutral-200 text-neutral-700 text-xs uppercase font-bold tracking-widest transition-all rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Adjust Parameters</span>
              </button>
            </div>
          </div>

          {/* Right panel: Direct Booking Wizard */}
          <div className="lg:col-span-5 space-y-6">
            
            {confirmedBooking ? (
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6.5 text-center shadow-sm space-y-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
                  <CheckCircle className="w-6 h-6 animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-emerald-600 uppercase font-bold bg-emerald-100 px-2.5 py-1 border border-emerald-200 rounded">
                    CONCIERGE TICKET ACQUIRED
                  </span>
                  <h3 className="font-serif text-xl font-bold text-neutral-900 mt-2">Allocation Complete</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    Your seating of **{tablePreference}** has been coordinated with the Maitre D' at **{confirmedBooking.restaurantName}**. Detailed ticket summary forwarded below.
                  </p>
                </div>

                <div className="p-4 bg-white border border-neutral-200 rounded-xl text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-400">GUEST:</span>
                    <span className="text-neutral-900 font-bold">{confirmedBooking.userName}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-400">EMAIL:</span>
                    <span className="text-neutral-900">{confirmedBooking.userEmail}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-400">ESTABLISHMENT:</span>
                    <span className="text-neutral-900 text-red-650 font-bold">{confirmedBooking.restaurantName}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-400">DATE & TIME:</span>
                    <span className="text-neutral-900">{confirmedBooking.date} • {confirmedBooking.time}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-2">
                    <span className="text-neutral-400">COVERS (GUESTS):</span>
                    <span className="text-neutral-900">{confirmedBooking.guestsCount} Seats Allocated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">PLACEMENT:</span>
                    <span className="text-neutral-900">{tablePreference}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => onNavigateTab('saved')}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-550 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer"
                  >
                    View Active Bookings Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setConfirmedBooking(null);
                      setStep(1);
                    }}
                    className="w-full px-4 py-3 bg-white border border-neutral-250 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer transition-all"
                  >
                    Plan Another Experience
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm text-left space-y-5">
                <div>
                  <h3 className="font-serif text-lg text-neutral-950 font-semibold flex items-center gap-2 leading-tight">
                    <Calendar className="w-5 h-5 text-red-650" />
                    <span>Instant Seating Reservation</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm font-light">
                    Submit your details using our Zaytouynda luxury portal to secure a placing list at **{selectedBookableRestaurant?.name || 'Levantine Diner'}** directly.
                  </p>
                </div>

                <form onSubmit={handleCreateBooking} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-505 uppercase tracking-wider block font-bold">Primary Guest Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Al-Sayed"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-255 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650"
                  />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-505 uppercase tracking-wider block font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. resident@domain.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-255 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-neutral-505 uppercase tracking-wider block font-bold">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-255 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-neutral-505 uppercase tracking-wider block font-bold">Prefers Time</label>
                      <input
                        type="time"
                        required
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-255 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-505 uppercase tracking-wider block font-bold">Covers Count (Guests)</label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 font-semibold focus:outline-none focus:border-red-650 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                        <option key={num} value={num} className="bg-white text-neutral-900">
                          {num} Guest{num > 1 ? 's' : ''} (Table Cover)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-505 uppercase tracking-wider block font-bold">Special Requests / Seating Notes</label>
                    <textarea
                      placeholder="e.g. Wheat allergy, celebrating continuous anniversary celebrations..."
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650 resize-none font-sans"
                    />
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-650 font-mono flex items-start gap-2 leading-relaxed">
                    <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-650" />
                    <span>Seat allocated for **{tablePreference}** will be held for exactly 15 minutes past scheduled timeline. No prepayment necessary.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-center text-white bg-red-600 hover:bg-red-650 text-[10px] tracking-widest font-bold uppercase transition-all rounded-lg cursor-pointer shadow-sm"
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

import { useState, useEffect } from 'react';
import { 
  Info, Award, Users, Shield, Database, Trash2, CheckCircle, 
  HelpCircle, DollarSign, Sparkles, Navigation, Globe, Megaphone, 
  Instagram, Facebook, Share2, Mail, ExternalLink, ShieldAlert
} from 'lucide-react';

interface GetStartedProps {
  onNavigateTab: (tab: string) => void;
  onOpenConcierge: () => void;
}

export default function GetStartedView({ onNavigateTab, onOpenConcierge }: GetStartedProps) {
  const [activeCabinet, setActiveCabinet] = useState<'users' | 'owners' | 'advertise' | 'faq' | 'gdpr'>('users');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // FAQ Accordion Open States
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // GDPR Interactive States
  const [cookiesOptIn, setCookiesOptIn] = useState(true);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(false);
  const [savedGuidesSync, setSavedGuidesSync] = useState(true);
  const [gdprMessage, setGdprMessage] = useState<string | null>(null);

  const triggerCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedNotification(txt);
    setTimeout(() => setCopiedNotification(null), 2000);
  };

  const handlePurgeData = () => {
    localStorage.clear();
    setGdprMessage("Pure Consent Triggered: All tracking cookies, local caches, bookings, and saved itineraries have been permanently erased from your system.");
    setTimeout(() => {
      setGdprMessage(null);
      window.location.reload();
    }, 4000);
  };

  const faqs = [
    {
      q: "What is the story behind Zaytouynda Guide?",
      a: "Zaytouynda is an independent, premium gastronomic index dedicated to mapping culinary genius across Lebanon (Beirut, coastal Jbeil, Tyre, mountains, and beyond) and matching world-class gastronomic landmarks. We aim to celebrate artisanal, highly creative food crafts."
    },
    {
      q: "How are the Zaytouynda Stars (✻) evaluated?",
      a: "Our inspectors operate under strict anonymity, judging 100% based on five core criteria: premium ingredients quality, chefs skill pairing and balance, creative personality on the dish, budget-to-value integrity, and consistency across multiple secret visits."
    },
    {
      q: "Are the social media services and integrations real?",
      a: "Yes! Restaurant listings in our Zaytouynda program sync directly with Instagram handle markers and Facebook services, allowing gourmet travelers to see organic media streams directly from the app."
    },
    {
      q: "How does the Gourmet AI Concierge counselor work?",
      a: "Powered by Gemini, our AI Concierge maintains live conversational memory of your saved restaurants, customized schedules, and local food preferences to devise flawless bespoke itineraries in real-time."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-neutral-900" id="get-started-pane">
      
      {/* Visual Hub Header */}
      <div className="relative mb-12 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 overflow-hidden shadow-sm text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-650/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-mono tracking-widest uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Interactive Guide Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-neutral-950 leading-tight">
            Welcome to <span className="font-semibold text-red-650">Zaytouynda</span>
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            An elite gastronomic map matching Lebanese legacy and global masterpieces. 
            Whether you are an ambitious gourmand searching for exquisite mezza, or a restaurant owner 
            unlocking integrated social media services and priority bookings, our interface binds your journey smoothly.
          </p>
        </div>
      </div>

      {/* Internal Navigation Cabinet */}
      <div className="flex flex-wrap gap-2.5 border-b border-neutral-200 pb-4 mb-10 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveCabinet('users')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
            activeCabinet === 'users' ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs' : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-250 text-neutral-600'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>What's in the Site</span>
        </button>
        <button
          onClick={() => setActiveCabinet('owners')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
            activeCabinet === 'owners' ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs' : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-250 text-neutral-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Restaurant Owner Benefits</span>
        </button>
        <button
          onClick={() => setActiveCabinet('advertise')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
            activeCabinet === 'advertise' ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs' : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-250 text-neutral-600'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Advertise With Us</span>
        </button>
        <button
          onClick={() => setActiveCabinet('faq')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
            activeCabinet === 'faq' ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs' : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-250 text-neutral-600'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </button>
        <button
          onClick={() => setActiveCabinet('gdpr')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
            activeCabinet === 'gdpr' ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs' : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-250 text-neutral-600'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>GDPR Protection & Caching</span>
        </button>
      </div>

      {/* CABINET CONTENT CHANNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
        
        {/* Left Interactive Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTOR 1: WHAT'S IN THE SITE */}
          {activeCabinet === 'users' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                <h2 className="font-serif text-2xl text-neutral-950 font-normal flex items-center gap-2">
                  <Globe className="w-6 h-6 text-red-605" />
                  <span>Explore the Zaytouynda Universe</span>
                </h2>
                <p className="text-neutral-550 text-xs leading-relaxed font-light">
                  Zaytouynda is an ecosystem for elite culinary discovery. Here is exactly how to navigate our platform:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all space-y-2">
                    <span className="text-[9px] font-mono text-red-655 font-bold uppercase tracking-wider block">1. Explore Restaurants & Maps</span>
                    <p className="text-neutral-700 text-xs font-light leading-relaxed">
                      Locate real evaluations in our interactive database. Swap capitals, filter by starred ranks, price budgets, or specific cuisines. Click the **Gastronomic Map** to view spatial placements in real-time.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all space-y-2">
                    <span className="text-[9px] font-mono text-red-655 font-bold uppercase tracking-wider block">2. Personal Itinerary Planner</span>
                    <p className="text-neutral-700 text-xs font-light leading-relaxed">
                      Tap the heart icon to notebook any establishment, then load **Culinary Itineraries** to arrange custom schedules, guests count, date lines, and notes into visual sharing cards.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all space-y-2">
                    <span className="text-[9px] font-mono text-red-655 font-bold uppercase tracking-wider block">3. Live AI Travel Concierge</span>
                    <p className="text-neutral-700 text-xs font-light leading-relaxed">
                      Open our intelligent chat widget in the ceiling header. Powered by Gemini, your discrete agent parses your saved favorites and devises fully complete, customized culinary tours across Beirut.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all space-y-2">
                    <span className="text-[9px] font-mono text-red-655 font-bold uppercase tracking-wider block">4. Editorial Magazine Insights</span>
                    <p className="text-neutral-700 text-xs font-light leading-relaxed">
                      Read beautifully prepared historical articles on Gastronomic history, secret inspector guidelines, and ecological food movements in our **Editorial Magazine** tab.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex gap-3 flex-wrap">
                  <button
                    onClick={() => onNavigateTab('discovery')}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-650 text-white text-[10px] font-bold font-mono tracking-widest uppercase rounded shadow-xs transition-all cursor-pointer"
                  >
                    Start Exploring
                  </button>
                  <button
                    onClick={onOpenConcierge}
                    className="px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 text-[10px] font-bold font-mono tracking-widest uppercase rounded shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Talk to AI Concierge</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTOR 2: RESTAURANT OWNER BENEFITS */}
          {activeCabinet === 'owners' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                <h2 className="font-serif text-2xl text-neutral-950 font-normal flex items-center gap-2">
                  <Users className="w-6 h-6 text-red-650" />
                  <span>Partner With Zaytouynda: Join Our Program</span>
                </h2>
                <p className="text-neutral-550 text-xs leading-relaxed font-light">
                  Are you a restaurant owner or chef in Lebanon or global culinary centers? Zaytouynda offers unmatched features 
                  to put your kitchen directly in front of highly vetted, wealthy epicureans.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div className="p-2 rounded bg-red-50 text-red-650 border border-red-200 font-extrabold shrink-0">✻</div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-neutral-950">Direct Social Media Integration & Promotion</h4>
                      <p className="text-neutral-500 text-xs font-light mt-1">
                        Our premium listings integrate seamless social media services directly into your detail cards. Guests can click live Instagram handles (e.g., <span className="text-amber-700 font-bold">@emsherifrestaurant</span>) and Facebook pages to browse visual feeds and organic social reviews.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div className="p-2 rounded bg-orange-50 text-orange-650 border border-orange-200 font-extrabold shrink-0">☺</div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-neutral-950">Full-Featured Booking Desk Placement</h4>
                      <p className="text-neutral-500 text-xs font-light mt-1">
                        Receive instant reservation tickets directly inside the app. Vetted foodies request seat allocations, which are packaged and forwarded to your maitre d' with guest specifications and contact data.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div className="p-2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-extrabold shrink-0">✎</div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-neutral-950">Priority AI Concierge Endorsements</h4>
                      <p className="text-neutral-500 text-xs font-light mt-1">
                        When premium users request customized mezza itineraries in Beirut, our AI concierge reads partner listings first, suggesting your restaurant with specific wine pairing annotations and highlight tags.
                      </p>
                    </div>
                  </div>
                </div>

                {/* PRICING TABLE SECTION */}
                <div className="pt-6 border-t border-neutral-200 text-left">
                  <h3 className="font-serif text-lg text-neutral-950 font-normal uppercase tracking-wide mb-4 text-left">Pricing Plans & Listings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Free Basic Tier */}
                    <div className="p-5 bg-white border border-neutral-300 rounded-xl hover:border-neutral-400 transition-all flex flex-col justify-between h-full shadow-xs">
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-neutral-450 uppercase tracking-widest font-extrabold block">Standard Listing</span>
                        <h4 className="font-serif text-lg text-neutral-950 font-bold">Bistro Basic</h4>
                        <span className="text-xl font-mono text-neutral-900 font-bold block">$0 <span className="text-[9px] font-normal text-neutral-500">/ forever</span></span>
                        <ul className="text-[10px] text-neutral-600 space-y-1.5 pt-2 font-light">
                          <li>✓ Basic map coordinates</li>
                          <li>✓ Core description/chef info</li>
                          <li>✓ Standard phone & website</li>
                        </ul>
                      </div>
                      <button className="mt-6 w-full py-2 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-250 text-[9px] font-mono uppercase tracking-widest font-bold rounded">
                        Standard Opt-In
                      </button>
                    </div>

                    {/* Pro Tier (Silver) */}
                    <div className="p-5 bg-red-50/40 border border-red-500/30 rounded-xl relative hover:border-red-500/40 transition-all flex flex-col justify-between h-full shadow-xs">
                      <div className="absolute top-2.5 right-2.5 text-[8px] font-bold bg-red-600 text-white px-2 py-0.5 uppercase tracking-wider rounded font-mono font-bold leading-none">Popular</div>
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-red-655 uppercase tracking-widest font-bold block">Featured Partner</span>
                        <h4 className="font-serif text-lg text-neutral-950 font-bold">Gourmet Pro</h4>
                        <span className="text-xl font-mono text-neutral-905 font-bold block">$29 <span className="text-[9px] font-normal text-neutral-500">/ month</span></span>
                        <ul className="text-[10px] text-neutral-700 space-y-1.5 pt-2 font-light font-medium">
                          <li className="text-red-655 font-bold">★ Instagram/Facebook integrations</li>
                          <li>✓ Booking Desk Placement</li>
                          <li>✓ Dynamic image carousel (3 photos)</li>
                          <li>✓ Core feature tags</li>
                        </ul>
                      </div>
                      <button className="mt-6 w-full py-2 bg-red-600 text-white hover:bg-red-650 text-[9px] font-mono uppercase tracking-widest font-black rounded shadow-xs">
                        Join Gourmet Pro
                      </button>
                    </div>

                    {/* Elite Gold Tier */}
                    <div className="p-5 bg-amber-50/40 border border-amber-500/30 rounded-xl hover:border-amber-500/40 transition-all flex flex-col justify-between h-full shadow-xs">
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-amber-600 uppercase tracking-widest font-bold block">Maximum Exposure</span>
                        <h4 className="font-serif text-lg text-neutral-950 font-bold">Imperial Gold</h4>
                        <span className="text-xl font-mono text-neutral-905 font-bold block">$89 <span className="text-[9px] font-normal text-neutral-500">/ month</span></span>
                        <ul className="text-[10px] text-neutral-750 space-y-1.5 pt-2 font-light">
                          <li className="text-amber-700 font-bold">★ Glowing Maple pin accent</li>
                          <li className="text-amber-700 font-bold">★ Proactive AI Concierge priority</li>
                          <li>✓ 1 Magazine feature per quarter</li>
                          <li>✓ Unlimited photo listings</li>
                          <li>✓ Dedicated dashboard & phone desk</li>
                        </ul>
                      </div>
                      <button className="mt-6 w-full py-2 bg-transparent text-amber-700 hover:bg-amber-600 hover:text-white border border-amber-500/40 text-[9px] font-mono uppercase tracking-widest font-bold rounded transition-colors">
                        Acquire Luxury Elite
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTOR 3: ADVERTISE WITH US */}
          {activeCabinet === 'advertise' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Megaphone className="w-6 h-6 text-red-650" />
                  <h2 className="font-serif text-2xl text-neutral-950 font-normal">Advertise With Us</h2>
                </div>
                <p className="text-neutral-550 text-xs leading-relaxed font-light font-sans">
                  Align your business with Zaytouynda’s prestigious culinary network. We provide multiple elegant, high-impact channels to display your brand to sophisticated consumers.
                </p>

                {/* All possible ways to advertise menu */}
                <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-xs text-left">
                  <div className="p-4 bg-neutral-50 border-b border-neutral-200 text-left">
                    <h3 className="text-xs font-mono font-bold text-neutral-700 uppercase tracking-widest">Zaytouynda Channels & Promotion Catalog</h3>
                  </div>
                  <div className="divide-y divide-neutral-150 text-left">
                    
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors text-left">
                      <div className="space-y-1 max-w-lg text-left">
                        <span className="text-[9px] font-mono text-red-600 uppercase font-extrabold tracking-wider">Method A</span>
                        <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wide font-sans">1. Homepage Spotlight Background Banner</h4>
                        <p className="text-[10.5px] text-neutral-500 font-light leading-normal">
                          Reserve premium placement in the Discovery tab hero. Your restaurant’s interior with active mezza tables will serve as the background for all site visitors.
                        </p>
                      </div>
                      <span className="text-[10px] bg-neutral-150 px-2.5 py-1 rounded font-mono text-neutral-850 select-none shrink-0 font-bold">$150 / week</span>
                    </div>

                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors text-left">
                      <div className="space-y-1 max-w-lg text-left">
                        <span className="text-[9px] font-mono text-orange-600 uppercase font-extrabold tracking-wider">Method B</span>
                        <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wide font-sans">2. Glowing Map Pin Upgrade</h4>
                        <p className="text-[10.5px] text-neutral-500 font-light leading-normal">
                          Transform your coordinates dot on the Gastronomic Map. Partner pins pulsate with a custom ambient halo effect and a distinct color, attracting cursor hoverings.
                        </p>
                      </div>
                      <span className="text-[10px] bg-neutral-150 px-2.5 py-1 rounded font-mono text-neutral-850 select-none shrink-0 font-bold">$80 / month</span>
                    </div>

                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors text-left">
                      <div className="space-y-1 max-w-lg text-left">
                        <span className="text-[9px] font-mono text-amber-600 uppercase font-extrabold tracking-wider">Method C</span>
                        <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wide font-sans">3. Sponsored Magazine Editorial</h4>
                        <p className="text-[10.5px] text-neutral-500 font-light leading-normal">
                          Our senior writers publish an engaging, detailed spotlight explaining your recipes, history, and chef bios on the Editorial Newsfeed, archived globally.
                        </p>
                      </div>
                      <span className="text-[10px] bg-neutral-150 px-2.5 py-1 rounded font-mono text-neutral-850 select-none shrink-0 font-bold">$250 / publication</span>
                    </div>

                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors text-left">
                      <div className="space-y-1 max-w-lg text-left">
                        <span className="text-[9px] font-mono text-amber-500 uppercase font-extrabold tracking-wider">Method D</span>
                        <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wide font-sans">4. Smart Conversational Injection</h4>
                        <p className="text-[10.5px] text-neutral-500 font-light leading-normal">
                          When users brainstorm customized dining choices of similar categories, our AI text counselor naturally details your establishment as an essential booking.
                        </p>
                      </div>
                      <span className="text-[10px] bg-neutral-150 px-2.5 py-1 rounded font-mono text-neutral-850 select-none shrink-0 font-bold">$120 / month</span>
                    </div>

                  </div>
                </div>

                {/* Immediate Contact Inquiry */}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Ready to secure a campaign?</h4>
                    <p className="text-[10px] text-neutral-550 mt-0.5 font-light">Let our campaign coordinates manager build a beautiful strategy for your kitchen.</p>
                  </div>
                  <button 
                    onClick={() => triggerCopy('partners@zaytouynda.app')}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-950 text-white text-[9px] font-mono uppercase tracking-[0.2em] font-semibold rounded shrink-0 cursor-pointer transition-all"
                  >
                    {copiedNotification === 'partners@zaytouynda.app' ? 'Copied Email Address!' : 'Copy Partner Inquiry Email'}
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* SECTOR 4: FAQ */}
          {activeCabinet === 'faq' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 space-y-6 shadow-sm text-left">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-red-650" />
                  <h2 className="font-serif text-2xl text-neutral-950 font-normal">Frequently Asked Questions</h2>
                </div>
                <p className="text-neutral-555 text-xs leading-relaxed font-light font-sans">
                  Common guidelines and inquiries about Zaytouynda’s independent ratings, booking allocations, and visual maps interface.
                </p>

                {/* FAQ list */}
                <div className="space-y-3 pt-2 text-left">
                  {faqs.map((faq, idx) => (
                    <div 
                      key={idx}
                      className="border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 shadow-xs"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full text-left p-4 flex justify-between items-center hover:bg-neutral-100 transition-colors focus:outline-none"
                      >
                        <span className="text-xs font-bold uppercase tracking-wide text-neutral-900">{faq.q}</span>
                        <span className="text-xs text-neutral-450">{openFaq === idx ? '▲' : '▼'}</span>
                      </button>
                      {openFaq === idx && (
                        <div className="p-4 bg-white text-xs text-neutral-600 border-t border-neutral-200 leading-relaxed font-light text-left">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* SECTOR 5: GDPR COMPLIANCE */}
          {activeCabinet === 'gdpr' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="border border-neutral-200 bg-white rounded-xl p-6 md:p-8 space-y-6 shadow-sm text-left">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-655" />
                  <h2 className="font-serif text-2xl text-neutral-950 font-normal">GDPR Privacy & Consent Manager</h2>
                </div>
                <p className="text-neutral-550 text-xs leading-relaxed font-sans font-light">
                  Under the General Data Protection Regulation (EU 2016/679), you possess immutable rights regarding your data privacy. Below, select your tracking options or wipe your interactive caches.
                </p>

                {gdprMessage && (
                  <div className="p-4 max-w-2xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold leading-relaxed rounded-lg animate-pulse">
                    {gdprMessage}
                  </div>
                )}

                {/* Custom GDPR opt-out config panel */}
                <div className="p-5 border border-neutral-200 bg-neutral-50 rounded-lg space-y-4 shadow-xs text-left">
                  <h3 className="text-xs font-mono font-bold text-neutral-750 uppercase tracking-widest border-b border-neutral-200 pb-2">Active Consent Ledger</h3>
                  
                  <div className="flex items-center justify-between gap-4 py-2 text-left">
                    <div className="text-left">
                      <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">1. Essential Cache Cookies</h4>
                      <p className="text-[10px] text-neutral-450 font-light leading-normal">Saves filter inputs and view state configuration inside secure browser sessions.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={cookiesOptIn} 
                      onChange={(e) => setCookiesOptIn(e.target.checked)}
                      className="w-4 h-4 text-red-600 accent-red-600 rounded cursor-pointer shrink-0"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2 border-t border-neutral-200">
                    <div className="text-left">
                      <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">2. Analytics & Hot-Tracking Opt-In</h4>
                      <p className="text-[10px] text-neutral-450 font-light leading-normal">Enables logging and analysis for site speed improvements and telemetry audits.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={analyticsOptIn} 
                      onChange={(e) => setAnalyticsOptIn(e.target.checked)}
                      className="w-4 h-4 text-red-600 accent-red-600 rounded cursor-pointer shrink-0"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2 border-t border-neutral-200">
                    <div className="text-left">
                      <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">3. Saved Itineraries Persistence</h4>
                      <p className="text-[10px] text-neutral-450 font-light leading-normal">Allows our app to save bookmarked restaurants and scheduled tours inside your native LocalStorage.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={savedGuidesSync} 
                      onChange={(e) => setSavedGuidesSync(e.target.checked)}
                      className="w-4 h-4 text-red-600 accent-red-600 rounded cursor-pointer shrink-0"
                    />
                  </div>
                  
                  <div className="pt-3 flex gap-2 justify-end">
                    <button 
                      onClick={() => setGdprMessage("Your consent preferences have been recorded permanently with our compliance manager.")}
                      className="px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-950 text-[9px] font-semibold uppercase tracking-widest font-mono rounded cursor-pointer transition-all shadow-xs"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>

                {/* Right to Erasure direct action button */}
                <div className="p-5 border border-red-200 bg-red-50 rounded-lg space-y-3 text-left">
                  <h4 className="text-xs font-bold text-red-655 uppercase tracking-widest">Right to Be Forgotten (Identity Purge)</h4>
                  <p className="text-[10.5px] text-neutral-600 leading-relaxed font-light">
                    By clicking below, you trigger an exhaustive purge. We will delete all local storage references (the entirety of your {localStorage.length} cached keys, bookmarks, schedules, and custom metadata), instantly resetting your digital registry to pure anonymity.
                  </p>
                  <button
                    onClick={handlePurgeData}
                    className="flex items-center gap-2 px-4.5 py-2.5 bg-red-600 hover:bg-red-700 text-white transition-all text-[9px] uppercase tracking-widest font-mono font-bold rounded cursor-pointer shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Exhaust All Saved Data & Purge Registry</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Right Info Card Column */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Vetted Quick Summary Widget */}
          <div className="p-6 rounded-xl bg-white border border-neutral-200 text-left h-auto space-y-4 shadow-sm text-neutral-900">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-950 text-left">Your Zaytouynda Hub Info</h3>
            
            <div className="space-y-3 text-xs font-light text-left">
              <div className="flex justify-between border-b border-neutral-100 pb-2 text-[10px] text-neutral-450 font-mono tracking-wider font-bold">
                <span>LOCAL CACHE ITEMS:</span>
                <span className="text-neutral-900 font-extrabold">{localStorage.length}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2 text-[10px] text-neutral-450 font-mono tracking-wider font-bold">
                <span>CONSENT STATUS:</span>
                <span className="text-emerald-650 font-extrabold font-mono">ACTIVE LEDGER</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-2 text-[10px] text-neutral-450 font-mono tracking-wider font-bold">
                <span>CURATED CAPITAL:</span>
                <span className="text-red-655 font-extrabold">BEIRUT, LEBANON</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-[10px] text-neutral-500 leading-normal font-light space-y-1">
              <span className="text-[8px] font-mono text-red-600 font-bold tracking-widest uppercase block">Important Note</span>
              <span>
                All bookmarked itineraries and allocations are stored entirely inside your active client engine, complying with strict private data specifications.
              </span>
            </div>
          </div>

          {/* Quick AI Help Call To Action */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 text-left h-auto space-y-4 text-neutral-900">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-black flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-pulse text-amber-550" />
              <span>Need Counsel?</span>
            </h3>
            <p className="text-[11px] text-neutral-600 leading-relaxed font-light font-sans">
              Our Senior AI Concierge is calibrated to answer highly advanced inquiries, outline historic milestones, and match recipes, specifically tailored with Lebanon's premium restaurants dataset.
            </p>
            <button
              onClick={onOpenConcierge}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-bold font-mono uppercase tracking-widest rounded shadow hover:brightness-105 transition-all cursor-pointer"
            >
              Consult AI Concierge
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

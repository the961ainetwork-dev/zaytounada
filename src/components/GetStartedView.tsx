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
      a: "Powered by Gemini 3.5 Flash, our AI Concierge maintains live conversational memory of your saved restaurants, customized schedules, and local food preferences to devise flawless bespoke itineraries in real-time."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" id="get-started-pane">
      
      {/* Visual Hub Header */}
      <div className="relative mb-12 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-[#0c0c0c] to-[#040404] border border-white/5 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Interactive Guide Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-[#F5F5F5] leading-tight">
            Welcome to <span className="font-medium text-red-500">Zaytouynda</span>
          </h1>
          <p className="text-sm text-white/60 leading-relaxed font-light">
            An elite gastronomic map matching Lebanese legacy and global masterpieces. 
            Whether you are an ambitious gourmand searching for exquisite mezza, or a restaurant owner 
            unlocking integrated social media services and priority bookings, our interface binds your journey smoothly.
          </p>
        </div>
      </div>

      {/* Internal Navigation Cabinet */}
      <div className="flex flex-wrap gap-2.5 border-b border-white/5 pb-4 mb-10 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveCabinet('users')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
            activeCabinet === 'users' ? 'bg-white text-black font-semibold' : 'bg-white/5 hover:bg-white/10 text-white/70'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>What's in the Site</span>
        </button>
        <button
          onClick={() => setActiveCabinet('owners')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
            activeCabinet === 'owners' ? 'bg-white text-black font-semibold' : 'bg-white/5 hover:bg-white/10 text-white/70'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Restaurant Owner Benefits</span>
        </button>
        <button
          onClick={() => setActiveCabinet('advertise')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
            activeCabinet === 'advertise' ? 'bg-white text-black font-semibold' : 'bg-white/5 hover:bg-white/10 text-white/70'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Advertise With Us</span>
        </button>
        <button
          onClick={() => setActiveCabinet('faq')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
            activeCabinet === 'faq' ? 'bg-white text-black font-semibold' : 'bg-white/5 hover:bg-white/10 text-white/70'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </button>
        <button
          onClick={() => setActiveCabinet('gdpr')}
          className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
            activeCabinet === 'gdpr' ? 'bg-white text-black font-semibold' : 'bg-white/5 hover:bg-white/10 text-white/70'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>GDPR Protection & Caching</span>
        </button>
      </div>

      {/* CABINET CONTENT CHANNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Interactive Panel */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTOR 1: WHAT'S IN THE SITE */}
          {activeCabinet === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border border-white/5 bg-[#0a0a0a] rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                <h2 className="font-serif text-2xl text-white font-light flex items-center gap-2">
                  <Globe className="w-6 h-6 text-red-500" />
                  <span>Explore the Zaytouynda Universe</span>
                </h2>
                <p className="text-white/60 text-xs leading-relaxed font-light">
                  Zaytouynda is an ecosystem for elite culinary discovery. Here is exactly how to navigate our platform:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all space-y-2">
                    <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider block">1. Explore Restaurants & Maps</span>
                    <p className="text-white/80 text-xs font-light leading-relaxed">
                      Locate real evaluations in our interactive database. Swap capitals, filter by starred ranks, price budgets, or specific cuisines. Click the **Gastronomic Map** to view spatial placements in real-time.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all space-y-2">
                    <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider block">2. Personal Itinerary Planner</span>
                    <p className="text-white/80 text-xs font-light leading-relaxed">
                      Tap the heart icon to notebook any establishment, then load **Culinary Itineraries** to arrange custom schedules, guests count, date lines, and notes into visual sharing cards.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all space-y-2">
                    <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider block">3. Live AI Travel Concierge</span>
                    <p className="text-white/80 text-xs font-light leading-relaxed">
                      Open our intelligent chat widget in the ceiling header. Powered by Gemini, your discrete agent parses your saved favorites and devises fully complete, customized culinary tours across Beirut.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all space-y-2">
                    <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider block">4. Editorial Magazine Insights</span>
                    <p className="text-white/80 text-xs font-light leading-relaxed">
                      Read beautifully prepared historical articles on Gastronomic history, secret inspector guidelines, and ecological food movements in our **Editorial Magazine** tab.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex gap-3 flex-wrap">
                  <button
                    onClick={() => onNavigateTab('discovery')}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold font-mono tracking-widest uppercase rounded shadow transition-all cursor-pointer"
                  >
                    Start Exploring
                  </button>
                  <button
                    onClick={onOpenConcierge}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold font-mono tracking-widest uppercase rounded shadow transition-all cursor-pointer flex items-center gap-1.5"
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
            <div className="space-y-6 animate-fade-in">
              <div className="border border-white/5 bg-[#0a0a0a] rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                <h2 className="font-serif text-2xl text-white font-light flex items-center gap-2">
                  <Users className="w-6 h-6 text-red-500" />
                  <span>Partner With Zaytouynda: Join Our Program</span>
                </h2>
                <p className="text-white/60 text-xs leading-relaxed font-light">
                  Are you a restaurant owner or chef in Lebanon or global culinary centers? Zaytouynda offers unmatched features 
                  to put your kitchen directly in front of highly vetted, wealthy epicureans.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start p-4 bg-white/5 border border-white/5 rounded-lg">
                    <div className="p-2 rounded bg-red-600/10 text-red-500 font-bold shrink-0">✻</div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-white">Direct Social Media Integration & Promotion</h4>
                      <p className="text-white/50 text-xs font-light mt-1">
                        Our premium listings integrate seamless social media services directly into your detail cards. Guests can click live Instagram handles (e.g., <span className="text-amber-300">@emsherifrestaurant</span>) and Facebook pages to browse visual feeds and organic social reviews.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 bg-white/5 border border-white/5 rounded-lg">
                    <div className="p-2 rounded bg-orange-600/10 text-orange-500 font-bold shrink-0">☺</div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-white">Full-Featured Booking Desk Placement</h4>
                      <p className="text-white/50 text-xs font-light mt-1">
                        Receive instant reservation tickets directly inside the app. Vetted foodies request seat allocations, which are packaged and forwarded to your maitre d' with guest specifications and contact data.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 bg-white/5 border border-white/5 rounded-lg">
                    <div className="p-2 rounded bg-amber-600/10 text-amber-500 font-bold shrink-0">✎</div>
                    <div>
                      <h4 className="text-sm font-serif font-bold text-white">Priority AI Concierge Endorsements</h4>
                      <p className="text-white/50 text-xs font-light mt-1">
                        When premium users request customized mezza itineraries in Beirut, our AI concierge reads partner listings first, suggesting your restaurant with specific wine pairing annotations and highlight tags.
                      </p>
                    </div>
                  </div>
                </div>

                {/* PRICING TABLE SECTION */}
                <div className="pt-6 border-t border-white/5">
                  <h3 className="font-serif text-lg text-white font-light uppercase tracking-wide mb-4">Pricing Plans & Listings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Free Basic Tier */}
                    <div className="p-5 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-all flex flex-col justify-between h-full">
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-bold block">Standard Listing</span>
                        <h4 className="font-serif text-lg text-white">Bistro Basic</h4>
                        <span className="text-xl font-mono text-[#F5F5F5] font-bold block">$0 <span className="text-[9px] font-normal text-white/40">/ forever</span></span>
                        <ul className="text-[10px] text-white/50 space-y-1 pt-2 font-light">
                          <li>✓ Basic map coordinates</li>
                          <li>✓ Core description/chef info</li>
                          <li>✓ Standard phone & website</li>
                        </ul>
                      </div>
                      <button className="mt-6 w-full py-2 bg-white/5 text-white/80 hover:bg-white/10 border border-white/10 text-[9px] font-mono uppercase tracking-widest font-bold rounded">
                        Standard Opt-In
                      </button>
                    </div>

                    {/* Pro Tier (Silver) */}
                    <div className="p-5 bg-red-600/5 border border-red-500/20 rounded-xl relative hover:border-red-500/30 transition-all flex flex-col justify-between h-full">
                      <div className="absolute top-2.5 right-2.5 text-[8px] font-bold bg-red-600 text-white px-2 py-0.5 uppercase tracking-wider rounded font-mono">Popular</div>
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-red-400 uppercase tracking-widest font-bold block">Featured Partner</span>
                        <h4 className="font-serif text-lg text-white">Gourmet Pro</h4>
                        <span className="text-xl font-mono text-[#F5F5F5] font-bold block">$29 <span className="text-[9px] font-normal text-white/40">/ month</span></span>
                        <ul className="text-[10px] text-white/70 space-y-1 pt-2 font-light font-medium">
                          <li className="text-red-300">★ Instagram/Facebook integrations</li>
                          <li>✓ Booking Desk Placement</li>
                          <li>✓ Dynamic image carousel (3 photos)</li>
                          <li>✓ Core feature tags</li>
                        </ul>
                      </div>
                      <button className="mt-6 w-full py-2 bg-red-600 text-white hover:bg-red-700 text-[9px] font-mono uppercase tracking-widest font-semibold rounded shadow-md">
                        Join Gourmet Pro
                      </button>
                    </div>

                    {/* Elite Gold Tier */}
                    <div className="p-5 bg-amber-600/5 border border-amber-500/20 rounded-xl hover:border-amber-500/30 transition-all flex flex-col justify-between h-full">
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-amber-400 uppercase tracking-widest font-bold block">Maximum Exposure</span>
                        <h4 className="font-serif text-lg text-white">Imperial Gold</h4>
                        <span className="text-xl font-mono text-[#F5F5F5] font-bold block">$89 <span className="text-[9px] font-normal text-white/40">/ month</span></span>
                        <ul className="text-[10px] text-white/70 space-y-1 pt-2 font-light">
                          <li className="text-amber-300">★ Glowing Maple pin accent</li>
                          <li className="text-amber-300">★ Proactive AI Concierge priority</li>
                          <li>✓ 1 Magazine feature per quarter</li>
                          <li>✓ Unlimited photo listings</li>
                          <li>✓ Dedicated dashboard & phone desk</li>
                        </ul>
                      </div>
                      <button className="mt-6 w-full py-2 bg-transparent text-amber-400 hover:bg-amber-500 hover:text-white border border-amber-500/30 text-[9px] font-mono uppercase tracking-widest font-bold rounded">
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
            <div className="space-y-6 animate-fade-in">
              <div className="border border-white/5 bg-[#0a0a0a] rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Megaphone className="w-6 h-6 text-red-500" />
                  <h2 className="font-serif text-2xl text-white font-light">Advertise With Us</h2>
                </div>
                <p className="text-white/60 text-xs leading-relaxed font-light">
                  Align your business with Zaytouynda’s prestigious culinary network. We provide multiple elegant, high-impact channels to display your brand to sophisticated consumers.
                </p>

                {/* All possible ways to advertise menu */}
                <div className="border border-white/5 rounded-lg overflow-hidden bg-black/40">
                  <div className="p-4 bg-white/5 border-b border-white/5">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Zaytouynda Channels & Promotion Catalog</h3>
                  </div>
                  <div className="divide-y divide-white/5">
                    
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div className="space-y-1 max-w-lg">
                        <span className="text-[9px] font-mono text-red-400 uppercase font-extrabold tracking-wider">Method A</span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">1. Homepage Spotlight Background Banner</h4>
                        <p className="text-[10.5px] text-white/50 font-light leading-normal">
                          Reserve premium placement in the Discovery tab hero. Your restaurant’s interior with active mezza tables will serve as the background for all site visitors.
                        </p>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded font-mono text-white select-none shrink-0">$150 / week</span>
                    </div>

                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div className="space-y-1 max-w-lg">
                        <span className="text-[9px] font-mono text-orange-400 uppercase font-extrabold tracking-wider">Method B</span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">2. Glowing Map Pin Upgrade</h4>
                        <p className="text-[10.5px] text-white/50 font-light leading-normal">
                          Transform your coordinates dot on the Gastronomic Map. Partner pins pulsate with a custom ambient halo effect and a distinct color, attracting cursor hoverings.
                        </p>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded font-mono text-white select-none shrink-0">$80 / month</span>
                    </div>

                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div className="space-y-1 max-w-lg">
                        <span className="text-[9px] font-mono text-amber-500 uppercase font-extrabold tracking-wider">Method C</span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">3. Sponsored Magazine Editorial</h4>
                        <p className="text-[10.5px] text-white/50 font-light leading-normal">
                          Our senior writers publish an engaging, detailed spotlight explaining your recipes, history, and chef bios on the Editorial Newsfeed, archived globally.
                        </p>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded font-mono text-white select-none shrink-0">$250 / publication</span>
                    </div>

                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div className="space-y-1 max-w-lg">
                        <span className="text-[9px] font-mono text-amber-400 uppercase font-extrabold tracking-wider">Method D</span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">4. Smart Conversational Injection</h4>
                        <p className="text-[10.5px] text-white/50 font-light leading-normal">
                          When users brainstorm customized dining choices of similar categories, our AI text counselor naturally details your establishment as an essential booking.
                        </p>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded font-mono text-white select-none shrink-0">$120 / month</span>
                    </div>

                  </div>
                </div>

                {/* Immediate Contact Inquiry */}
                <div className="p-4 bg-orange-600/5 border border-orange-500/20 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ready to secure a campaign?</h4>
                    <p className="text-[10px] text-white/60 mt-0.5">Let our campaign coordinates manager build a beautiful strategy for your kitchen.</p>
                  </div>
                  <button 
                    onClick={() => triggerCopy('partners@zaytouynda.app')}
                    className="px-4 py-2 bg-[#F5F5F5] hover:bg-white text-black text-[9px] font-mono uppercase tracking-[0.2em] font-semibold rounded shrink-0 cursor-pointer"
                  >
                    {copiedNotification === 'partners@zaytouynda.app' ? 'Copied Email Address!' : 'Copy Partner Inquiry Email'}
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* SECTOR 4: FAQ */}
          {activeCabinet === 'faq' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border border-white/5 bg-[#0a0a0a] rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-red-500" />
                  <h2 className="font-serif text-2xl text-white font-light">Frequently Asked Questions</h2>
                </div>
                <p className="text-white/60 text-xs leading-relaxed font-light">
                  Common guidelines and inquiries about Zaytouynda’s independent ratings, booking allocations, and visual maps interface.
                </p>

                {/* FAQ list */}
                <div className="space-y-3 pt-2">
                  {faqs.map((faq, idx) => (
                    <div 
                      key={idx}
                      className="border border-white/5 rounded-lg overflow-hidden bg-black/20"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full text-left p-4 flex justify-between items-center hover:bg-white/5 transition-colors focus:outline-none"
                      >
                        <span className="text-xs font-bold uppercase tracking-wide text-white/95">{faq.q}</span>
                        <span className="text-xs text-white/40">{openFaq === idx ? '▲' : '▼'}</span>
                      </button>
                      {openFaq === idx && (
                        <div className="p-4 bg-[#0a0a0a]/50 text-xs text-white/60 border-t border-white/5 leading-relaxed font-light">
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
            <div className="space-y-6 animate-fade-in">
              <div className="border border-white/5 bg-[#0a0a0a] rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                  <h2 className="font-serif text-2xl text-white font-light">GDPR Privacy & Consent Manager</h2>
                </div>
                <p className="text-white/60 text-xs leading-relaxed font-light">
                  Under the General Data Protection Regulation (EU 2016/679), you possess immutable rights regarding your data privacy. Below, select your tracking options or wipe your interactive caches.
                </p>

                {gdprMessage && (
                  <div className="p-4 max-w-2xl bg-orange-600/10 border border-orange-500/40 text-orange-200 text-xs font-light leading-relaxed rounded-lg animate-pulse">
                    {gdprMessage}
                  </div>
                )}

                {/* Custom GDPR opt-out config panel */}
                <div className="p-5 border border-white/5 bg-black/40 rounded-lg space-y-4">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">Active Consent Ledger</h3>
                  
                  <div className="flex items-center justify-between gap-4 py-2">
                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wide">1. Essential Cache Cookies</h4>
                      <p className="text-[10px] text-white/40 font-light">Saves filter inputs and view state configuration inside secure browser sessions.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={cookiesOptIn} 
                      onChange={(e) => setCookiesOptIn(e.target.checked)}
                      className="w-4 h-4 text-red-600 accent-red-600 bg-black/40 border-white/20 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2 border-t border-white/5">
                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wide">2. Analytics & Hot-Tracking Opt-In</h4>
                      <p className="text-[10px] text-white/40 font-light">Enables logging and analysis for site speed improvements and telemetry audits.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={analyticsOptIn} 
                      onChange={(e) => setAnalyticsOptIn(e.target.checked)}
                      className="w-4 h-4 text-red-600 accent-red-600 bg-black/40 border-white/20 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2 border-t border-white/5">
                    <div>
                      <h4 className="text-xs font-semibold text-white uppercase tracking-wide">3. Saved Itineraries Persistence</h4>
                      <p className="text-[10px] text-white/40 font-light">Allows our app to save bookmarked restaurants and scheduled tours inside your native LocalStorage.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={savedGuidesSync} 
                      onChange={(e) => setSavedGuidesSync(e.target.checked)}
                      className="w-4 h-4 text-red-600 accent-red-600 bg-black/40 border-white/20 rounded cursor-pointer"
                    />
                  </div>
                  
                  <div className="pt-3 flex gap-2 justify-end">
                    <button 
                      onClick={() => setGdprMessage("Your consent preferences have been recorded permanently with our compliance manager.")}
                      className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 text-[9px] font-semibold uppercase tracking-widest font-mono rounded cursor-pointer"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>

                {/* Right to Erasure direct action button */}
                <div className="p-5 border border-red-900/30 bg-red-950/5 rounded-lg space-y-3">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest">Right to Be Forgotten (Identity Purge)</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed font-light">
                    By clicking below, you trigger an exhaustive purge. We will delete all local storage references (the entirety of your {localStorage.length} cached keys, bookmarks, schedules, and custom metadata), instantly resetting your digital registry to pure anonymity.
                  </p>
                  <button
                    onClick={handlePurgeData}
                    className="flex items-center gap-2 px-4.5 py-2.5 bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/30 transition-all text-[9px] uppercase tracking-widest font-mono font-bold rounded cursor-pointer"
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
        <div className="lg:col-span-4 space-y-6">
          
          {/* Vetted Quick Summary Widget */}
          <div className="p-6 rounded-xl bg-[#0a0a0a] border border-white/5 text-left h-auto space-y-4">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-white">Your Zaytouynda Hub Info</h3>
            
            <div className="space-y-3 text-xs font-light">
              <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] text-white/40 font-mono tracking-wider">
                <span>LOCAL CACHE ITEMS:</span>
                <span className="text-white font-bold">{localStorage.length}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] text-white/40 font-mono tracking-wider">
                <span>CONSENT STATUS:</span>
                <span className="text-emerald-400 font-bold font-mono">ACTIVE LEDGER</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] text-white/40 font-mono tracking-wider">
                <span>CURATED CAPITAL:</span>
                <span className="text-red-400 font-bold">BEIRUT, LEBANON</span>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/5 rounded text-[10px] text-white/50 leading-normal font-light space-y-1">
              <span className="text-[8px] font-mono text-red-400 font-bold tracking-widest uppercase block">Important Note</span>
              <span>
                All bookmarked itineraries and allocations are stored entirely inside your active client engine, complying with strict private data specifications.
              </span>
            </div>
          </div>

          {/* Quick AI Help Call To Action */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-red-600/10 to-orange-500/5 border border-red-500/20 text-left h-auto space-y-4">
            <h3 className="font-serif text-sm font-light uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Need Counsel?</span>
            </h3>
            <p className="text-[11px] text-white/70 font-light leading-relaxed">
              Our Senior AI Concierge is calibrated to answer highly advanced inquiries, outline historic milestones, and match recipes, specifically tailored with Lebanon's premium restaurants dataset.
            </p>
            <button
              onClick={onOpenConcierge}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-bold font-mono uppercase tracking-widest rounded shadow hover:opacity-95 transition-all cursor-pointer"
            >
              Consult AI Concierge
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

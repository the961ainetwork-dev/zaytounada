import React, { useState, useEffect } from 'react';
import { 
  Store, CheckCircle2, Calculator, Instagram, Smartphone, Sparkles, 
  TrendingUp, Percent, Award, ArrowRight, Lock, ShieldCheck, Check, 
  MapPin, User, Mail, Phone, FileText, Layout, MessageSquare, Share2, 
  HelpCircle, Eye, Rocket, Send, ArrowUpRight
} from 'lucide-react';

interface SupplierApplication {
  id?: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  discountOffer: string;
  description: string;
  instagram: string;
  area: string;
  status?: string;
  date?: string;
}

export default function SupplierOnboardingView() {
  // Form state
  const [formData, setFormData] = useState<SupplierApplication>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    category: 'nightlife',
    discountOffer: '20% off everything at any time',
    description: '',
    instagram: '',
    area: 'Mar Mikhael, Beirut'
  });

  // Calculator states
  const [avgTicket, setAvgTicket] = useState<number>(35);
  const [weeklyCardholders, setWeeklyCardholders] = useState<number>(45);

  // App submissions & visual states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [pastSubmissions, setPastSubmissions] = useState<SupplierApplication[]>([]);
  const [activeFormStep, setActiveFormStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Active mockup view: 'merchant_page' | 'instagram_story' | 'whatsapp_blast'
  const [mockupView, setMockupView] = useState<'merchant_page' | 'instagram_story' | 'whatsapp_blast'>('merchant_page');

  // FAQ Expand-collapses
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    // Load local stored copy of requests to render feedback
    try {
      const saved = localStorage.getItem('insider_supplier_applications');
      if (saved) {
        setPastSubmissions(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute stats
  const weeklyRevenue = weeklyCardholders * avgTicket;
  const weeklyDiscountGiven = weeklyRevenue * 0.20;
  const weeklyNetGain = weeklyRevenue - weeklyDiscountGiven; // In a realistic club setting, new foot traffic driven covers fixed cost
  const monthlyFootfall = weeklyCardholders * 4.33;
  const monthlyEstimatedGrowth = Math.round(weeklyNetGain * 4.33);

  const categories = [
    { id: 'dining', name: 'Premium Dining & Bistros', img: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=400' },
    { id: 'nightlife', name: 'Nightlife, Lounges & Clubs', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400' },
    { id: 'terroir', name: 'Lebanese Terroir, Wineries & Distilleries', img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400' },
    { id: 'hospitality', name: 'Boutique Resorts & Hospitality', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400' },
    { id: 'experiences', name: 'Curated Outings & Outdoor Mobility', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.businessName.trim()) return "Business Name is required";
      if (!formData.instagram.trim()) return "Instagram Handle or website is required";
    } else if (step === 2) {
      if (!formData.contactName.trim()) return "Contact Person Name is required";
      if (!formData.email.trim() || !formData.email.includes('@')) return "A valid Email address is required";
      if (!formData.phone.trim()) return "Contact Phone Number is required";
    }
    return null;
  };

  const handleNextStep = () => {
    const error = validateStep(activeFormStep);
    if (error) {
      setValidationError(error);
      return;
    }
    setActiveFormStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setActiveFormStep(prev => prev - 1);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateStep(activeFormStep);
    if (error) {
      setValidationError(error);
      return;
    }

    setIsSubmitting(true);
    setValidationError(null);

    const payload = {
      ...formData,
      status: 'pending',
      date: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedApp = await res.json();
        const updatedList = [savedApp, ...pastSubmissions];
        setPastSubmissions(updatedList);
        localStorage.setItem('insider_supplier_applications', JSON.stringify(updatedList));
        setSubmissionSuccess(true);
        setActiveFormStep(1);
      } else {
        const errData = await res.json();
        setValidationError(errData.error || "Failed to submit supplier application to backend. Let's fallback and save locally.");
        
        // Fallback save locally to keep prototype fully functioning
        const fallbackApp = { ...payload, id: `supp-${Math.random().toString(36).substr(2, 9)}` };
        const updatedList = [fallbackApp, ...pastSubmissions];
        setPastSubmissions(updatedList);
        localStorage.setItem('insider_supplier_applications', JSON.stringify(updatedList));
        setSubmissionSuccess(true);
      }
    } catch (err) {
      console.error(err);
      // Fallback save locally
      const fallbackApp = { ...payload, id: `supp-${Math.random().toString(36).substr(2, 9)}` };
      const updatedList = [fallbackApp, ...pastSubmissions];
      setPastSubmissions(updatedList);
      localStorage.setItem('insider_supplier_applications', JSON.stringify(updatedList));
      setSubmissionSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAfterSuccess = () => {
    setSubmissionSuccess(false);
    setFormData({
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      category: 'dining',
      discountOffer: '20% off everything at any time',
      description: '',
      instagram: '',
      area: 'Beirut'
    });
    setActiveFormStep(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-neutral-900" id="supplier-onboarding-portal">
      {/* BRAND HEADER & BANNER */}
      <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
        <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-amber-500 uppercase bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20">
          ★ EXCLUSIVELY FOR LEBANESE SUPPLIERS & MERCHANTS
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight uppercase leading-tight">
          Double Your Footfall. Join the <span className="text-emerald-800 italic underline decoration-amber-400">"Insider" Pass</span> Ecosystem.
        </h1>
        <p className="text-sm md:text-base text-neutral-600 font-light max-w-3xl mx-auto leading-relaxed">
          Welcome to Lebanon’s premier physical-meets-digital lifestyle pass program powered by <strong className="text-emerald-950 font-bold">Zaytounada.live</strong> and <strong className="text-emerald-950 font-bold">Whatsonlebanon.buzz</strong>. 
          Become an approved supplier, unlock a fully bespoke merchant digital catalog page, and activate a comprehensive social media marketing package.
        </p>
      </div>

      {/* CORE VALUE PILLARS & THE 20% DISCOUNT EXPLANATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" id="program-features-pillars">
        
        {/* Pillar 1: The 20% commitment */}
        <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-3xl p-8 border border-emerald-800 shadow-xl relative overflow-hidden flex flex-col justify-between text-left group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-all duration-300" />
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Percent className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">The 20% Standard</h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Suppliers guarantee a flat <strong className="text-amber-300 font-semibold">20% discount</strong> on selected goods, services, or dining sessions to verified Insider Pass holders. This acts as a frictionless customer acquisition engine that steers high-spending tourists and elites straight to your empty tables.
            </p>
          </div>
          <div className="border-t border-emerald-800 pt-4 mt-6 text-[10px] uppercase font-mono tracking-widest text-amber-300 flex items-center gap-1">
            <span>Guaranteed high-volume acquisition</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Pillar 2: The Bespoke Merchant Hub */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between text-left transition-all hover:scale-102 hover:shadow-md">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-emerald-800" />
            </div>
            <h3 className="font-serif text-xl font-bold text-neutral-900 uppercase tracking-wider">Your Digital Hub</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Every approved supplier gets their own <strong className="text-emerald-900 font-semibold">Bespoke Merchant Page</strong> on both Zaytounada and WhatsOnLebanon. Displays curated menus, maps, Instagram story slide widgets, custom tags (e.g., "Best Sunset Vibe"), and direct tap-to-reserve triggers.
            </p>
          </div>
          <div className="border-t border-neutral-150 pt-4 mt-6 text-[10px] uppercase font-mono tracking-widest text-emerald-800 flex items-center gap-1 font-bold">
            <span>No hosting or setup costs</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>

        {/* Pillar 3: Premium Campaign Engine */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between text-left transition-all hover:scale-102 hover:shadow-md">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-amber-800" />
            </div>
            <h3 className="font-serif text-xl font-bold text-neutral-900 uppercase tracking-wider">Social Media Blast</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              We compile and push a dedicated, multi-channel promotional campaign for your venue. Includes styled <strong className="text-amber-800 font-semibold">Instagram Stories</strong>, targeted WhatsApp broadcasts to 10k+ Lebanese cardholders, weekly feature banners, and coordinated lifestyle influencer matchmakers.
            </p>
          </div>
          <div className="border-t border-neutral-150 pt-4 mt-6 text-[10px] uppercase font-mono tracking-widest text-amber-800 flex items-center gap-1 font-bold">
            <span>Guaranteed reach package</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>
      </div>

      {/* DYNAMIC INCOME CALCULATOR & SIMULATOR */}
      <div className="bg-radial from-neutral-50 to-neutral-50/50 border border-neutral-200 rounded-3xl p-6 md:p-10 mb-16 text-left" id="supplier-roi-calculator">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-amber-500 font-bold block">
                ✦ VOLUME & GAIN CALCULATOR
              </span>
              <h2 className="font-serif text-2xl md:text-3.5xl font-light text-neutral-900 uppercase">
                Estimate your <span className="font-bold text-emerald-800">New Revenue Pipeline</span>
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">
                Providing a 20% discount feels like a cost, but in retail & hospitality, excess capacity has massive yields. Insider Pass steers steady, predictable weekday traffic straight to you, filling spaces that otherwise go unsold. Drag the variables to see estimated yields.
              </p>
            </div>

            {/* Input Slider 1 - Average Ticket Size */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-700 uppercase tracking-wider font-mono">Average Spend Per Customer (Check Size)</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-md font-mono font-bold font-semibold text-sm">${avgTicket} USD</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="250" 
                step="5"
                value={avgTicket}
                onChange={(e) => setAvgTicket(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                <span>$10 (Cafes/Snacks)</span>
                <span>$250 (Luxury Resorts & High Fine Dining)</span>
              </div>
            </div>

            {/* Input Slider 2 - Monthly Footfall */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-700 uppercase tracking-wider font-mono">Estimated Pass Holders Driven Weekly</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-md font-mono font-bold font-semibold text-sm">{weeklyCardholders} Visitors</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="300" 
                step="5"
                value={weeklyCardholders}
                onChange={(e) => setWeeklyCardholders(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                <span>5 / week</span>
                <span>300 / week (High volume lounges / events)</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box with Gold Accents */}
          <div className="w-full lg:w-96 bg-gradient-to-br from-emerald-950 to-emerald-900 text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden border border-emerald-800">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl" />
            
            <div className="space-y-6 relative z-10">
              <span className="text-[8px] font-mono tracking-widest text-amber-400 uppercase font-black bg-amber-400/10 px-2 py-1 rounded">ESTIMATED PARTNER GAINS</span>
              
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-200 uppercase tracking-widest block font-mono">Projected Monthly Visitors</span>
                <p className="text-3xl font-serif font-black text-white">{Math.ceil(monthlyFootfall)} <span className="text-xs text-amber-300 font-sans font-normal uppercase">Elites Driven</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-[9px] text-emerald-200 uppercase tracking-widest block font-mono">Gross Revenue Spike</span>
                  <p className="text-xl font-mono font-bold text-white">${Math.round(weeklyRevenue * 4.33)}</p>
                </div>
                <div>
                  <span className="text-[9px] text-amber-300 uppercase tracking-widest block font-mono">20% Cardholder Subsidy</span>
                  <p className="text-xl font-mono font-bold text-amber-400">-${Math.round(weeklyDiscountGiven * 4.33)}</p>
                </div>
              </div>

              <div className="border-t border-emerald-800/80 my-4" />

              <div className="space-y-1">
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest block font-mono">ESTIMATED NET NEW INCOME / MONTH</span>
                <p className="text-4xl font-mono font-black text-white tracking-tight">${monthlyEstimatedGrowth.toLocaleString()} <span className="text-xs text-emerald-200 font-sans font-light capitalize">Net</span></p>
                <p className="text-[9px] text-emerald-200/70 font-light italic mt-1 leading-normal">
                  *Calculated assuming 20% partner discount on list prices. Includes priority search placement boost.
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                const formEl = document.getElementById('supplier-form-container');
                if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="mt-6 w-full py-3 bg-amber-400 hover:bg-amber-500 text-emerald-950 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-97 select-none"
            >
              <span>APPLY FOR ENTRY HUB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* CORE EXPERIENCE: APPLICATION FORM && INTERACTIVE REAL-TIME LIVE PHONE MOCKUP PREVIEWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
        
        {/* LEFT COLUMN: THE STEP-BY-STEP INTEGRATED FORM */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-sm text-left relative" id="supplier-form-container">
          
          {submissionSuccess ? (
            <div className="py-12 px-4 text-center space-y-6 animate-fade-in flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 animate-bounce">
                <Check className="w-8 h-8 stroke-[3px]" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-neutral-900 uppercase">Application Received Over Airwaves!</h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                  Your registration for <strong className="text-emerald-950">{formData.businessName}</strong> has been received by Zaytounada & WhatsOnLebanon Partner board. A verification team has been dispatched to perform an review.
                </p>
              </div>

              <div className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-xl text-xs text-amber-900 max-w-md text-left leading-relaxed">
                <p className="font-bold uppercase tracking-wider mb-1 font-mono">⚡ NEXT VIP STEPS:</p>
                <ol className="list-decimal pl-4.5 space-y-1">
                  <li>Your simulated Merchant Digital Page will be prepared automatically.</li>
                  <li>Our visual designer team will draft your promotional Instagram Story asset.</li>
                  <li>You will obtain a notification to confirm your 20% discount structure.</li>
                </ol>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetAfterSuccess}
                  className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl cursor-pointer"
                >
                  Onboard Another Brand
                </button>
                <button
                  onClick={() => {
                    // Navigate to admin tab using standard custom events to preview this submitted supplier
                    const adminTabEl = document.getElementById('tab-admin');
                    if (adminTabEl) adminTabEl.click();
                  }}
                  className="px-5 py-3 border border-neutral-300 hover:border-neutral-400 text-neutral-700 font-bold text-xs uppercase tracking-widest rounded-xl cursor-pointer"
                >
                  Check Admin Locks
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-6">
              
              {/* Form Progress steps */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6 text-xs">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-950 uppercase">Supplier Registration</h3>
                  <p className="text-[10px] text-neutral-400 font-light leading-none mt-0.5">Let's collect your lifestyle pass layout specifications</p>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeFormStep >= 1 ? 'bg-emerald-800 text-white' : 'bg-neutral-100 text-neutral-400'}`}>1</span>
                  <div className="w-8 border-t border-neutral-200" />
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeFormStep >= 2 ? 'bg-emerald-800 text-white' : 'bg-neutral-100 text-neutral-400'}`}>2</span>
                </div>
              </div>

              {validationError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* STEP 1: BUSINESS IDENTITY */}
              {activeFormStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Category Selection Carousel block items */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono">Establishment Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                      {categories.map((cat) => (
                        <div 
                          key={cat.id}
                          onClick={() => {
                            setFormData(p => ({ ...p, category: cat.id }));
                            setValidationError(null);
                          }}
                          className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all select-none flex flex-col justify-between h-20 relative overflow-hidden ${
                            formData.category === cat.id 
                              ? 'border-emerald-800 bg-emerald-50/40 shadow-xs' 
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <span className="text-[9px] font-bold tracking-tight text-neutral-800 pr-2 line-clamp-2 leading-tight">{cat.name}</span>
                          <span className="text-[10px] text-emerald-800 font-bold self-end mt-2">
                            {formData.category === cat.id ? '✓Selected' : 'Select'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Business Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono">Brand or Venue Name</label>
                    <div className="relative">
                      <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                      <input 
                        type="text" 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="e.g., Al Falamanki, Spine Beirut, Iris Lounge"
                        className="pl-10 pr-4 py-2.5 w-full bg-white border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:border-emerald-800"
                      />
                    </div>
                  </div>

                  {/* Location and Area in Lebanon */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono">Geographical Cover Area</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                      <input 
                        type="text" 
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="e.g., Mar Mikhael, Achrafieh, Batroun Port, Byblos old street"
                        className="pl-10 pr-4 py-2.5 w-full bg-white border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:border-emerald-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Instagram Handle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono">Instagram Bio Handle</label>
                      <div className="relative">
                        <Instagram className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                        <input 
                          type="text" 
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          placeholder="e.g., @myvenuebeirut"
                          className="pl-10 pr-4 py-2.5 w-full bg-white border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:border-emerald-800"
                        />
                      </div>
                    </div>

                    {/* Offer details */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono">20% Pass Member Special Deal Offer</label>
                      <select 
                        name="discountOffer"
                        value={formData.discountOffer}
                        onChange={handleInputChange}
                        className="px-3.5 py-2.5 w-full bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-emerald-800 text-neutral-900 cursor-pointer"
                      >
                        <option value="20% off everything at any time">20% off everything at any time</option>
                        <option value="20% off selected food items and drinks">20% off selected food items and drinks</option>
                        <option value="20% off entry tickets and drinks stacks">20% off entry tickets and drinks stacks</option>
                        <option value="20% off all reservation suites during weekdays">20% off all reservation suites during weekdays</option>
                        <option value="Happy Hour Stack + additional 15% off cards">Happy Hour Stack + additional 15% off cards</option>
                        <option value="20% off premium gourmet tasting menus">20% off premium gourmet tasting menus</option>
                      </select>
                    </div>
                  </div>

                  {/* Description of Brand */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono">Description & Brand Esthetic Appeal</label>
                    <textarea 
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Briefly tell pass holders why they should visit your layout. Explain the vibe, signature dishes, or rooftop views."
                      className="p-3.5 w-full bg-white border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:border-emerald-800"
                    />
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue to Contact Info</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 2: CONTACT COORDINATES & SUBMISSION */}
              {activeFormStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Contact Person Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono">Contact Person (Owner / General Manager)</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                      <input 
                        type="text" 
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        placeholder="e.g., Nicole Sfeir, Philippe Karam"
                        className="pl-10 pr-4 py-2.5 w-full bg-white border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:border-emerald-800"
                      />
                    </div>
                  </div>

                  {/* Contact Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono">Corporate Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g., manager@myvenuebeirut.com"
                        className="pl-10 pr-4 py-2.5 w-full bg-white border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:border-emerald-800"
                      />
                    </div>
                  </div>

                  {/* Mobile Phone number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono">Mobile / WhatsApp Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g., +961 3 123 456 (For urgent confirmations)"
                        className="pl-10 pr-4 py-2.5 w-full bg-white border border-neutral-200 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:border-emerald-800"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl flex items-start gap-3.5 text-xs text-neutral-700 border border-emerald-100/50">
                    <div className="p-1 rounded-full bg-emerald-100 text-emerald-850 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 leading-relaxed">
                      <p className="font-bold text-emerald-950 font-sans uppercase text-[10px] tracking-wider">No Long-Term Bindings</p>
                      <p className="font-light">
                        Joining the Zaytounada / Insider Pass loyalty cards works as a monthly flexible program. You can alter, modify, pause, or update your 20% discount offer layout anytime by notifying our support.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-3 border border-neutral-200 hover:border-neutral-300 text-neutral-600 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-805 from-emerald-800 to-emerald-700 hover:scale-101 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Rocket className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Partner Application!</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}

            </form>
          )}

        </div>

        {/* RIGHT COLUMN: INTERACTIVE REAL-TIME PHONE MOCKUP PREVIEWER */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full text-left mb-4 flex justify-between items-center bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-200/60 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-widest font-black text-emerald-800">
              ⚡ Live Preview Simulator
            </span>
            <div className="flex gap-1.5 text-[9px] font-mono tracking-wider">
              <button 
                onClick={() => setMockupView('merchant_page')}
                className={`px-2 py-1 rounded transition-all select-none uppercase font-bold ${mockupView === 'merchant_page' ? 'bg-emerald-950 font-semibold text-amber-300' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'}`}
              >
                Page
              </button>
              <button 
                onClick={() => setMockupView('instagram_story')}
                className={`px-2 py-1 rounded transition-all select-none uppercase font-bold ${mockupView === 'instagram_story' ? 'bg-emerald-950 font-semibold text-amber-300' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'}`}
              >
                Insta
              </button>
              <button 
                onClick={() => setMockupView('whatsapp_blast')}
                className={`px-2 py-1 rounded transition-all select-none uppercase font-bold ${mockupView === 'whatsapp_blast' ? 'bg-emerald-950 font-semibold text-amber-300' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'}`}
              >
                Push
              </button>
            </div>
          </div>

          {/* Realistic iPhone Case Wrapper */}
          <div className="w-80 h-[520px] bg-neutral-950 rounded-[40px] p-3.5 shadow-2xl relative border-4 border-neutral-800 overflow-hidden ring-4 ring-neutral-200">
            
            {/* Top Speaker Slot & Camera Punch Hole */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-neutral-950 rounded-full flex items-center justify-between px-3.5 z-55 pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-850" />
              <div className="w-10 h-1 bg-neutral-800 rounded-full" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
            </div>

            {/* Simulated Phone Screen Canvas */}
            <div className="w-full h-full bg-neutral-50 rounded-[28px] overflow-hidden flex flex-col justify-between relative shadow-inner pt-4">
              
              {/* SCREEN CONTENT LAYER: OPTION 1: MERCHANT_PAGE */}
              {mockupView === 'merchant_page' && (
                <div className="flex flex-col flex-1 bg-white text-left animate-fade-in relative">
                  
                  {/* Banner Photo placeholder */}
                  <div className="h-28 w-full relative bg-neutral-200 overflow-hidden">
                    <img 
                      src={
                        formData.category === 'dining' ? 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=350' :
                        formData.category === 'nightlife' ? 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=350' :
                        formData.category === 'terroir' ? 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=350' :
                        formData.category === 'hospitality' ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=350' :
                        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=350'
                      }
                      alt="Banner" 
                      className="w-full h-full object-cover saturate-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
                    
                    {/* Elite Gold Seal badge floated */}
                    <div className="absolute top-2.5 right-2 px-1.5 py-0.5 rounded bg-emerald-950/90 text-amber-300 font-mono text-[6px] font-bold uppercase tracking-widest border border-amber-300/30">
                      ★ Insider Partner
                    </div>
                  </div>

                  {/* Merchant Bio Column */}
                  <div className="px-3.5 pb-3 flex-1 space-y-3">
                    
                    <div className="-mt-7 relative z-10 space-y-1">
                      {/* Logo avatar container */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-800 to-amber-500 border-2 border-white flex items-center justify-center text-white font-serif font-black text-xl shadow-md uppercase">
                        {formData.businessName ? formData.businessName.charAt(0) : 'Z'}
                      </div>
                      
                      <div className="pt-1 text-left">
                        <h4 className="font-serif font-black text-sm text-neutral-900 leading-tight uppercase tracking-tight truncate">
                          {formData.businessName || "Your Venue Brand"}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-neutral-400" />
                          <span className="text-[8.5px] text-neutral-500 font-mono font-semibold truncate">
                            {formData.area || "Beirut, Lebanon"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Member Perk Spotlight (The 20% Rule highlighted) */}
                    <div className="bg-amber-400/10 border-l-3 border-amber-400 rounded-r-lg p-2.5 text-left text-neutral-900 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[6.5px] font-mono uppercase bg-amber-400 text-neutral-950 font-black px-1.5 py-0.2 rounded leading-none">
                          OFFER TICKET
                        </span>
                        <span className="text-[8.5px] font-mono text-neutral-500 font-bold tracking-tight">INSIDER PASS BENEFIT</span>
                      </div>
                      <p className="font-serif text-[10px] font-bold uppercase tracking-tight text-emerald-950">
                        {formData.discountOffer || "20% Off selected dining items & VIP drinks."}
                      </p>
                    </div>

                    {/* Descriptive Bio Copy */}
                    <div className="space-y-1">
                      <span className="text-[7.5px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">Vibe description</span>
                      <p className="text-[9.5px] text-neutral-500 font-light leading-relaxed line-clamp-3">
                        {formData.description || "Enter your description on the left form to see it render automatically. Detail your sunset vibes, beautiful mountain views, design houses or cocktail mixes."}
                      </p>
                    </div>

                    {/* Interactive Contact & Social Tags */}
                    <div className="flex gap-1.5 items-center">
                      <span className="px-2 py-0.8 bg-neutral-100 text-neutral-600 rounded text-[7.5px] font-mono">
                        {formData.instagram || "@brandhandle"}
                      </span>
                      <span className="px-2 py-0.8 bg-emerald-50 text-emerald-800 rounded text-[7.5px] font-mono font-bold">
                        ★ {categories.find(c => c.id === formData.category)?.name || "Partner Category"}
                      </span>
                    </div>

                  </div>

                  {/* Dummy Booking Button CTA inside viewport */}
                  <div className="p-2 bg-neutral-50 border-t border-neutral-150 text-center shrink-0">
                    <button className="w-full py-1.8 bg-emerald-800 text-white rounded-lg text-[8.5px] font-mono font-bold uppercase tracking-widest shadow-xs">
                      Redeem 20% Insider Pass Discount
                    </button>
                  </div>

                </div>
              )}

              {/* SCREEN CONTENT LAYER: OPTION 2: INSTAGRAM_STORY */}
              {mockupView === 'instagram_story' && (
                <div className="flex flex-col flex-1 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden text-center animate-fade-in text-white p-4 justify-between">
                  {/* Glowing light bars simulating typical reels visual colors */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-emerald-500/10 to-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Insta Header simulated */}
                  <div className="flex items-center justify-between w-full relative z-10 text-left text-white">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center font-bold text-xs font-serif text-emerald-950 shadow">
                        {formData.businessName ? formData.businessName.charAt(0).toUpperCase() : 'Z'}
                      </div>
                      <div>
                        <span className="text-[9px] font-bold block leading-none">{formData.businessName || 'Your Venue Brand'}</span>
                        <span className="text-[7px] text-neutral-400 block font-mono">Sponsored • Lebanon</span>
                      </div>
                    </div>
                    <span className="text-[12px] opacity-70">•••</span>
                  </div>

                  {/* Featured Creative Block center */}
                  <div className="space-y-4 relative z-10 py-6">
                    <span className="bg-amber-400 text-emerald-950 text-[7px] font-mono font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full inline-block shadow">
                      ★ INSIDER PASS COLLABORATION
                    </span>
                    
                    <div className="space-y-1">
                      <h4 className="font-serif text-xl font-black text-white uppercase tracking-tight leading-tight px-2 drop-shadow-md">
                        {formData.businessName || "YOUR BRAND VENUE"}
                      </h4>
                      <p className="text-[9px] uppercase tracking-widest font-mono text-amber-300">
                        {formData.area || "BEIRUT, LEBANON"}
                      </p>
                    </div>

                    {/* Highly stylized stickers */}
                    <div className="inline-block transform -rotate-1 py-3 px-4.5 bg-gradient-to-r from-amber-300 to-amber-500 border border-white/30 text-emerald-950 rounded-2xl shadow-xl">
                      <span className="text-[8px] font-mono block tracking-widest uppercase font-extrabold leading-none text-emerald-900 mb-0.5">EXCLUSIVE CLUB DEAL</span>
                      <span className="text-xl font-black font-mono leading-none">20% OFF</span>
                      <p className="text-[8px] font-bold tracking-tight italic text-emerald-950 mt-0.5">WITH VERIFIED INSIDER PASS</p>
                    </div>

                    <p className="text-[9.5px] text-neutral-300 font-light max-w-xs mx-auto px-4 leading-relaxed line-clamp-3">
                      "{formData.description || "Briefly tell pass holders why they should visit your venue. Detail food, cocktails, rooftops, or hotels."}"
                    </p>
                  </div>

                  {/* Swipe Up interactive sticker */}
                  <div className="space-y-1 relative z-10 select-none pb-2">
                    <div className="animate-bounce flex flex-col items-center">
                      <span className="text-[10px] text-amber-300">▲</span>
                      <span className="text-[8px] font-mono tracking-widest text-emerald-400 font-extrabold uppercase">SWIPE UP TO GET ACCESS</span>
                    </div>
                    <p className="text-[6.5px] text-neutral-400 font-mono tracking-wider">Powered by WhatsOnLebanon.buzz & Zaytounada</p>
                  </div>

                </div>
              )}

              {/* SCREEN CONTENT LAYER: OPTION 3: WHATSAPP_BLAST */}
              {mockupView === 'whatsapp_blast' && (
                <div className="flex flex-col flex-1 bg-[#efeae2]/45 text-left animate-fade-in relative text-neutral-800 font-sans p-3 space-y-4">
                  {/* Header mimicking top bar of WhatsApp chat */}
                  <div className="bg-[#075e54] text-white p-2.5 rounded-lg flex items-center gap-2 relative z-10 -mx-3 -mt-4 shadow-sm">
                    <div className="w-5.5 h-5.5 rounded-full bg-emerald-700 font-bold text-xs flex items-center justify-center font-serif">Z</div>
                    <div>
                      <span className="text-[9.5px] font-bold block leading-none">Insider Pass Broadcast</span>
                      <span className="text-[7.5px] text-neutral-200 font-mono">10,483 Cardholders Online</span>
                    </div>
                  </div>

                  {/* WhatsApp speech bubble */}
                  <div className="max-w-[90%] bg-white p-3 rounded-lg border border-neutral-200 shadow-sm relative text-xs">
                    <span className="absolute -left-1.5 top-2.5 w-3 h-3 bg-white rotate-45 border-l border-b border-neutral-200" />
                    
                    <div className="space-y-2 relative z-10 text-[10px]">
                      <span className="text-emerald-700 font-bold block tracking-tight uppercase">📢 EXCLUSIVE MERCHANDISE UPDATE:</span>
                      
                      <p className="leading-relaxed">
                        Hey fellow Insiders! 🍋 We are extremely excited to welcome <strong>{formData.businessName || "[Brand Name]"}</strong> in {formData.area || "Lebanon"} into our VIP network!
                      </p>

                      <div className="p-2 bg-amber-50 rounded border border-amber-200 space-y-0.5 leading-normal">
                        <strong>Offer:</strong> {formData.discountOffer || "20% Discount Stack available on loyalty cards."}
                      </div>

                      <p className="leading-relaxed font-light text-neutral-600">
                        {formData.description || "They provide exquisite high-end setups, incredible views, and stellar vibes. Standard 20% discount is live starting tonight."}
                      </p>

                      <p className="font-mono text-[8px] text-neutral-400">
                        Instagram page: {formData.instagram || "@brandhandle"}
                      </p>
                    </div>

                    <div className="text-[7px] text-neutral-400 text-right mt-1.5 font-mono">
                      12:30 PM ✓✓ Delivered
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* FREQUENTLY ASKED QUESTIONS SECTION (SUPPLIERS) */}
      <div className="max-w-4xl mx-auto text-left mb-16 border-t border-neutral-200 pt-16" id="supplier-faq-accordion">
        <div className="text-center md:text-left space-y-2 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold text-emerald-800">
            ★ CLEAR ANSWERS FOR BUSINESS OWNERS
          </span>
          <h3 className="font-serif text-2xl font-light text-neutral-900 uppercase">
            Frequently Asked <span className="font-bold text-emerald-800">Supplier Questions</span>
          </h3>
        </div>

        <div className="space-y-2.5">
          {[
            {
              q: "Why is a minimum 20% discount required from suppliers?",
              a: "To make the Insider Pass genuinely enticing, we guarantee members substantial benefits. A 20% discount is the magical threshold where upscale locals and affluent tourists bypass all other dining options and direct their full evening budget directly to your establishment. This high footfall volume covers your food/service cost multiple times over."
            },
            {
              q: "How does the platform verify our 'Bespoke Merchant Page' is set up properly?",
              a: "Once you submit this onboarding registration, our content editors extract the best visual assets from your Instagram bio, customize a gorgeous background template, and code your reservation/menu widgets. There is no coding or developer hours required on your side—we deliver it fully turnkey."
            },
            {
              q: "What is included inside the 'Detailed Social Media Promotional Program'?",
              a: "Our marketing network regularly showcases partner establishments to our database of 10,000+ active cardholders in Lebanon. We distribute weekly high-impact newsletters, feature your brand in targeted WhatsApp Push notifications, feature prominent carousel headers on Zaytounada.live and WhatsOnLebanon.buzz, and coordinate content reviews with premium Lebanese lifestyle creators."
            },
            {
              q: "Is there any commission taken on reservations or bookings?",
              a: "No. Unlike traditional food delivery networks or booking platforms that extract 10% to 15% per cover, the Insider Pass structure does not charge transaction fees. You retain the absolute full, gross receipt value of everything the customer purchases, minus your volunteered 20% member catalog discount."
            },
            {
              q: "How do we verify a customer holds a valid Insider Pass at our venue?",
              a: "Pass holders present their high-contrast, security-encoded Zaytounada Digital VIP card on their smartphone screen upon checking out or before placing their order. You can easily visually check or register their unique ID code listed on the ticket."
            }
          ].map((faq, i) => (
            <div 
              key={i} 
              onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl p-4.5 cursor-pointer hover:border-emerald-800/30 transition-all select-none"
            >
              <div className="flex justify-between items-center gap-4 text-xs">
                <span className="font-bold text-neutral-900 font-sans tracking-tight uppercase block">{faq.q}</span>
                <span className="text-[10px] text-emerald-805 text-emerald-800 font-mono font-bold leading-none shrink-0 border border-emerald-250 bg-white shadow-xs px-2 py-0.5 rounded">
                  {expandedFaq === i ? 'CLOSE' : 'EXPAND'}
                </span>
              </div>
              {expandedFaq === i && (
                <div className="mt-3 text-neutral-600 bg-white p-3.5 border border-neutral-100 rounded-lg text-xs leading-relaxed font-light font-sans animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PERSISTENT SUBMITTED APPLICATIONS DASHBOARD BOARD (INTERACTIVE FEEDBACK FOR PROTOTYPE) */}
      {pastSubmissions.length > 0 && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 md:p-8 text-left" id="active-supplier-applications-registry">
          <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 border-b border-neutral-200 pb-4 mb-5">
            <div>
              <h3 className="font-serif font-light text-xl text-neutral-905 text-neutral-900 flex items-center gap-2 uppercase tracking-wide">
                <Store className="w-5.5 h-5.5 text-emerald-800" />
                <span>Submitted Applications Registry</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">Vetting status logs for your registered brands.</p>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('insider_supplier_applications');
                setPastSubmissions([]);
              }}
              className="text-[9px] font-mono text-neutral-400 hover:text-emerald-800 uppercase tracking-widest cursor-pointer select-none"
            >
              Clear Application Cache
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastSubmissions.map((app, index) => (
              <div 
                key={index} 
                className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <span className="text-[8px] font-mono uppercase bg-emerald-50 text-emerald-850 px-2.5 py-0.5 border border-emerald-200 rounded tracking-wider font-extrabold">
                      {app.category.toUpperCase()}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-amber-800 font-mono leading-none tracking-widest bg-amber-400/10 px-2 py-1 rounded">
                      {app.status || 'PENDING VETTING'}
                    </span>
                  </div>
                  
                  <h4 className="font-serif font-black text-sm text-neutral-900 mt-2.5 uppercase leading-none truncate">
                    {app.businessName}
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1 leading-none font-mono">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{app.area}</span>
                  </p>
                  
                  <p className="text-[9.5px] text-neutral-500 mt-2 line-clamp-2 leading-relaxed font-light">
                    {app.description || "No esthetic details entered. Partner discount of 20% volunteered structure."}
                  </p>
                </div>

                <div className="border-t border-neutral-100 mt-3 pt-3 text-[9px] font-mono text-neutral-400 flex justify-between items-center bg-neutral-50 -mx-4 -mb-4 p-3 rounded-b-xl shrink-0">
                  <div>
                    <span className="block font-bold">CONTACT PERSON</span>
                    <span className="text-neutral-600 block text-[9.5px] truncate max-w-[120px]">{app.contactName}</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold">REVENUE ESTIMATE</span>
                    <span className="text-emerald-805 text-emerald-800 font-black text-[10px] block font-mono">HIGH-ACQUISITION</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

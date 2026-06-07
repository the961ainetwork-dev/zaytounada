import React, { useState, useEffect } from 'react';
import { 
  Award, Sparkles, CheckCircle, Smartphone, MapPin, Printer, Clipboard, 
  Percent, Users, Play, Send, Star, QrCode, CreditCard, ChevronRight, 
  Layers, Volume2, HelpCircle, Flame, Gift, Camera, RefreshCw, Scan
} from 'lucide-react';
import { showToast } from '../utils/toast';

interface LoyaltyCard {
  cardholderName: string;
  tier: 'VIP Insider' | 'Elite Cultist' | 'Founder Member';
  activeTheme: 'gold' | 'cosmic' | 'emerald' | 'amber';
  cardNumber: string;
  activatedAt: string;
}

// Generate deterministic pseudo-random QR matrix (Version 1, 21x21 grid)
function generateQrMatrix(text: string): boolean[][] {
  const size = 21;
  const grid = Array(size).fill(null).map(() => Array(size).fill(false));
  
  // Draw 7x7 Finder Pattern at (r, c)
  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isBorder = i === 0 || i === 6 || j === 0 || j === 6;
        const isCenter = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        grid[r + i][c + j] = isBorder || isCenter;
      }
    }
  };
  
  // Three finder patterns in corners
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing lines (horizontal row 6, vertical column 6)
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Seed standard data modules deterministically
  let hash = 0;
  for (let k = 0; k < text.length; k++) {
    hash = text.charCodeAt(k) + ((hash << 5) - hash);
  }
  
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeftFinder = r < 8 && c < 8;
      const inTopRightFinder = r < 8 && c >= size - 8;
      const inBottomLeftFinder = r >= size - 8 && c < 8;
      const isTimingLine = r === 6 || c === 6;

      if (!inTopLeftFinder && !inTopRightFinder && !inBottomLeftFinder && !isTimingLine) {
        const value = Math.abs(Math.sin(hash + r * 13.7 + c * 31.9));
        grid[r][c] = value > 0.47; // ~53% solid density
      }
    }
  }
  return grid;
}

// Low-level Web Audio API wave generator for verification beep sound
function playSynthesizedBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // Crisp high electronic beep
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (err) {
    console.warn("Web Audio block/unsupported: ", err);
  }
}

export default function MerchantOfferLoyaltyView({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  // Saved Loyalty Card local state
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(() => {
    try {
      const stored = localStorage.getItem('whatsonlebanon_loyalty_card');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // active sub-tab for active pass-holder features
  const [activePassTab, setActivePassTab] = useState<'card' | 'qr' | 'scanner'>('card');

  // Scanner view controller states
  const [scannedVenue, setScannedVenue] = useState<string>("Spine Beirut");
  const [billAmount, setBillAmount] = useState<number>(120);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  // Editor states
  const [cardholderInput, setCardholderInput] = useState('');
  const [selectedTier, setSelectedTier] = useState<'VIP Insider' | 'Elite Cultist' | 'Founder Member'>('VIP Insider');
  const [selectedTheme, setSelectedTheme] = useState<'gold' | 'cosmic' | 'emerald' | 'amber'>('gold');
  const [isActivating, setIsActivating] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Active redemption states
  const [activeRedeemVenue, setActiveRedeemVenue] = useState<any | null>(null);
  const [redemptionSuccess, setRedemptionSuccess] = useState(false);

  // Mock static list of top-tier merchant offers in Lebanon
  const merchantOffers = [
    {
      id: "mo-1",
      businessName: "Spine Beirut",
      area: "Naccache Rooftop, Beirut",
      category: "NIGHTLIFE",
      offer: "20% Off flat discount on total food, craft cocktail sequences & bottle service.",
      rating: "5.0 ★ Star Rating",
      vibe: "Sleek architectural rooftop experience",
      tag: "Best View",
      img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "mo-2",
      businessName: "Al Falamanki",
      area: "Raouche & Achrafieh, Beirut",
      category: "DINING",
      offer: "20% Off standard bill on true Levantine mezza, traditional hubbly-bubbly & juices.",
      rating: "4.9 ★ Local Favorite",
      vibe: "Authentic Lebanese garden village vibe",
      tag: "Lebanese Terroir",
      img: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "mo-3",
      businessName: "Iris Beach Club",
      area: "Damour Coastal Highway",
      category: "HOSPITALITY",
      offer: "20% Off daytime bungalows, sunset entry tickers & all seaside dining bills.",
      rating: "4.8 ★ Resort Tier",
      vibe: "Beautiful Mediterranean poolside bliss",
      tag: "Beachfront",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "mo-4",
      businessName: "The Barn Achrafieh",
      area: "Sursock Quarter, Beirut",
      category: "PUBS & CAFES",
      offer: "20% Off organic sourdough bakes, premium gourmet cheese trays & morning cold brews.",
      rating: "4.9 ★ Organic",
      vibe: "Rustic country-chic organic hub",
      tag: "Organic & Cafe",
      img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400"
    }
  ];

  // Loyalty Card activation helper
  const handleActivateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardholderInput.trim()) return;

    setIsActivating(true);
    setTimeout(() => {
      const cardNum = 'WOL-PASS-' + Math.floor(100000 + Math.random() * 900000);
      const newCard: LoyaltyCard = {
        cardholderName: cardholderInput.trim(),
        tier: selectedTier,
        activeTheme: selectedTheme,
        cardNumber: cardNum,
        activatedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      setLoyaltyCard(newCard);
      localStorage.setItem('whatsonlebanon_loyalty_card', JSON.stringify(newCard));
      setIsActivating(false);
    }, 1200);
  };

  const handleDeactivateCard = () => {
    if (!confirm("Are you sure you want to log out and remove this local loyalty card file?")) return;
    localStorage.removeItem('whatsonlebanon_loyalty_card');
    setLoyaltyCard(null);
    setCardholderInput('');
  };

  const copyCardNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    showToast('Token Copied to Clipboard!');
  };

  // Simulate redeem
  const handleRedeemDiscount = (venue: any) => {
    if (!loyaltyCard) {
      // Prompt scroll up to activate loyalty pass first
      const activationEl = document.getElementById('loyalty-pass-creator');
      if (activationEl) {
        activationEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        alert("Please claim and configure your WhatsOnLebanon Loyalty Pass first to unlock this merchant's 20% discount offer!");
      }
      return;
    }
    setActiveRedeemVenue(venue);
    setRedemptionSuccess(false);
  };

  const executeSuccessfulRedemption = () => {
    setRedemptionSuccess(true);
    setTimeout(() => {
      setActiveRedeemVenue(null);
      setRedemptionSuccess(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in text-neutral-900" id="merchant-offers-loyalty-portal">
      
      {/* INTEGRATION SECTION: ATTACHMENT CORE FLYER COPY HERO */}
      <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
        <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-emerald-800 bg-emerald-150/10 px-4 py-1.5 rounded-full border border-emerald-200">
          🤝 WHATSONLEBANON.BUZZ VIP LOYALTY ECOSYSTEM
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight uppercase leading-tight">
          Delivering Exceptional Value. <br />
          <span className="text-emerald-800 italic underline decoration-amber-400">The 20% Merchant</span> Commitment.
        </h1>
        <p className="text-sm md:text-base text-neutral-600 font-light max-w-3xl mx-auto leading-relaxed">
          Our platform isn’t just a food directory; it is the heartbeat of Lebanese social and economic life. 
          Through a prestigious network connecting Beirut’s most discerning consumers with top-tier venues, 
          our partner establishments commit to a flat <strong className="text-emerald-950 font-bold">20% discount</strong> on all goods and services. 
          In exchange, members obtain premium digital access keys to prioritize their bookings instantly.
        </p>
      </div>

      {/* THREE-COLUMN LAYOUT CONVERTING FLYER AND DYNAMIC LOYALTY CARD SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
        
        {/* INTERACTIVE LOYALTY CARD PREVIEWER & SETTER (LEFT COLUMN-SPAN-7) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-sm text-left relative" id="loyalty-pass-creator">
          {loyaltyCard ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-neutral-100 pb-4">
                <div>
                  <h3 id="panel-vetted-title" className="font-serif text-lg font-bold text-neutral-950 uppercase">Verified Loyalty Pass</h3>
                  <p className="text-[10px] text-neutral-400 font-light mt-0.5">Your physical pass has been synced with whatsOnLebanon.buzz ecosystem</p>
                </div>
                <button
                  id="btn-log-out-pass"
                  onClick={handleDeactivateCard}
                  className="text-[11px] font-mono font-bold text-rose-700 hover:text-rose-900 uppercase tracking-wider underline cursor-pointer"
                >
                  Log Out Pass
                </button>
              </div>

              {/* NAVIGATION TABS FOR LOYALTY CARD OPTIONS */}
              <div className="flex border-b border-neutral-150 pb-2 gap-4">
                <button
                  id="tab-view-card"
                  onClick={() => {
                    setActivePassTab('card');
                    setScanResult(null);
                  }}
                  className={`pb-2 text-xs font-mono font-bold tracking-wider uppercase transition-all relative cursor-pointer ${
                    activePassTab === 'card' ? 'text-emerald-800 font-bold' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  💳 Digital Card
                  {activePassTab === 'card' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800" />}
                </button>
                <button
                  id="tab-view-qr"
                  onClick={() => {
                    setActivePassTab('qr');
                    setScanResult(null);
                  }}
                  className={`pb-2 text-xs font-mono font-bold tracking-wider uppercase transition-all relative cursor-pointer ${
                    activePassTab === 'qr' ? 'text-emerald-800 font-bold' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Dynamic QR Code</span>
                  </span>
                  {activePassTab === 'qr' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800" />}
                </button>
                <button
                  id="tab-view-scanner"
                  onClick={() => {
                    setActivePassTab('scanner');
                  }}
                  className={`pb-2 text-xs font-mono font-bold tracking-wider uppercase transition-all relative cursor-pointer ${
                    activePassTab === 'scanner' ? 'text-emerald-800 font-bold' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Scan className="w-3.5 h-3.5" />
                    <span>Terminal Scanner Desk</span>
                  </span>
                  {activePassTab === 'scanner' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800" />}
                </button>
              </div>

              {/* TAB CONTENT 1: DIGITAL CARD */}
              {activePassTab === 'card' && (
                <div className="space-y-6 animate-fade-in">
                  {/* DYNAMIC CARD VIEW STYLING OPTIONS */}
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] font-mono uppercase text-neutral-400 block tracking-wider">Customize Card Theme Color:</span>
                    <div className="p-1 bg-neutral-100 rounded-lg flex gap-1 text-[10px] font-mono w-fit max-w-full">
                      {(['gold', 'cosmic', 'emerald', 'amber'] as const).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => {
                            const updated = { ...loyaltyCard, activeTheme: theme };
                            setLoyaltyCard(updated);
                            localStorage.setItem('whatsonlebanon_loyalty_card', JSON.stringify(updated));
                          }}
                          className={`px-3 py-1.5 rounded-md transition-all uppercase font-semibold ${loyaltyCard.activeTheme === theme ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'}`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* THE PRESTIGIOUS RENDERED LOYALTY TICKET */}
                  <div className={`relative h-56 w-full rounded-2xl p-6.5 text-white overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.01] ${
                    loyaltyCard.activeTheme === 'gold' 
                      ? 'bg-gradient-to-br from-neutral-900 via-[#1b1a17] to-neutral-950 border border-amber-300/40' 
                      : loyaltyCard.activeTheme === 'cosmic'
                      ? 'bg-gradient-to-tr from-[#020024] via-[#090979] to-[#00d4ff] border border-blue-400/20'
                      : loyaltyCard.activeTheme === 'emerald'
                      ? 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-400/30'
                      : 'bg-gradient-to-br from-amber-950 via-amber-800 to-amber-950 border border-amber-500/30'
                  }`}>
                    {/* Visual Accent Glows */}
                    <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/5 rounded-full filter blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-2xl" />

                    <div className="flex justify-between items-start z-10">
                      <div>
                        <span className="text-[9px] font-mono uppercase bg-amber-400 text-neutral-950 font-black px-2 py-0.5 rounded tracking-widest leading-none">
                          {loyaltyCard.tier.toUpperCase()} PASS
                        </span>
                        <h4 className="font-serif font-bold text-base text-white/90 mt-2 tracking-wide">WHATSONLEBANON.BUZZ UNLIMITED</h4>
                      </div>
                      <Award className="w-8 h-8 text-amber-400 filter drop-shadow animate-pulse" />
                    </div>

                    <div className="flex justify-between items-end border-t border-white/10 pt-4 z-10">
                      <div className="space-y-1 text-left">
                        <span className="text-[7.5px] text-white/30 font-mono block">MEMBER PASS-HOLDER</span>
                        <span className="text-sm font-sans font-black text-white tracking-tight uppercase">{loyaltyCard.cardholderName}</span>
                        <span className="text-[9px] text-[#22c55e] block font-mono font-bold">● PASS ACTIVE / REGISTERED</span>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <span className="text-[7.5px] text-white/30 font-mono block">20% PROGRAM CODE</span>
                        <button 
                          onClick={() => copyCardNumber(loyaltyCard.cardNumber)}
                          className="text-xs font-mono font-bold tracking-widest text-[#fbbf24] block hover:underline"
                          title="Copy Card Number to Settle Bill"
                        >
                          {loyaltyCard.cardNumber}
                        </button>
                        <span className="text-[7px] text-white/40 block">Issued: {loyaltyCard.activatedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informative Instructions from Attachment */}
                  <div className="p-4 bg-emerald-50/40 border border-emerald-200/50 rounded-2xl flex items-start gap-3.5 text-xs text-neutral-700">
                    <CheckCircle className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-neutral-950 font-sans uppercase text-[10.5px] tracking-wider">How to Redeem Your 20% Discount Stack:</p>
                      <p className="font-light leading-relaxed">
                        Simply select either the <strong>Dynamic QR Code</strong> tab or present your card pass to any authorized elite partner waiter. The counter verifies the credentials and instantly applies the 20% discount onto all food & beverage sequences.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: LIVE DYNAMIC QR CODE GENERATOR */}
              {activePassTab === 'qr' && (
                <div className="space-y-6 animate-fade-in text-center py-4 bg-neutral-50 rounded-2xl border border-neutral-150 p-6">
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-mono bg-emerald-850/10 text-emerald-850 border border-emerald-200 px-2 py-1 rounded inline-block uppercase font-bold text-emerald-800">
                      ★ Live Vector QR Node
                    </span>
                    <h4 className="font-serif font-bold text-lg text-neutral-950 uppercase mt-2">QR Code Entry Voucher</h4>
                    <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto leading-relaxed">
                      This QR code shifts in real time base configuration matching your unique cardholder ID and pass number.
                    </p>
                  </div>

                  {/* HIGH-PRECISION DYNAMIC INLINE SVG QR CODE MATRIX */}
                  <div className="relative w-fit mx-auto p-4 bg-white rounded-3xl border border-neutral-200/80 shadow-md">
                    <svg viewBox="0 0 21 21" className="w-44 h-44 bg-white">
                      {generateQrMatrix(`${loyaltyCard.cardNumber}-${loyaltyCard.cardholderName}`).map((row, r) => 
                        row.map((active, c) => (
                          <rect
                            key={`${r}-${c}`}
                            x={c}
                            y={r}
                            width="1.0"
                            height="1.0"
                            className={active ? 'fill-neutral-950' : 'fill-white'}
                          />
                        ))
                      )}
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-850 bg-emerald-800 text-white rounded-lg flex items-center justify-center font-serif text-[11px] font-black border-2 border-white shadow-xs">
                      WOL
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#22c55e] uppercase">
                      ● SECURE QR DIGITAL PASS
                    </span>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      TOKEN: {loyaltyCard.cardNumber} • {loyaltyCard.cardholderName.toUpperCase()}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-250/60 max-w-sm mx-auto flex gap-3 text-[10.5px] font-mono">
                    <button
                      id="btn-print-pass"
                      onClick={() => alert("Sending print signal layout sequence to default device configuration... (Simulated direct print action)")}
                      className="flex-1 py-2.5 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-250 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Ticket</span>
                    </button>
                    <button
                      id="btn-copy-token"
                      onClick={() => {
                        navigator.clipboard.writeText(loyaltyCard.cardNumber);
                        showToast('Token Copied to Clipboard!');
                      }}
                      className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Copy Token</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 3: TERMINAL SCANNER SIMULATOR DESK */}
              {activePassTab === 'scanner' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono bg-amber-400 text-neutral-950 font-extrabold px-2 py-0.5 rounded tracking-widest uppercase">
                      Vending Point Integration
                    </span>
                    <h4 className="font-serif text-lg font-bold text-neutral-950 uppercase mt-1">Merchant Counter Scan Hub</h4>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      A live interactive testing ground where you can play the host role, configure guest balances, and execute our 20% discount scanning protocol.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Scanner configuration parameters */}
                    <div className="space-y-3 p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs">
                      <span className="font-mono font-bold uppercase text-[9.5px] tracking-wider text-emerald-800 block">1. Set Cash Desk Bill</span>
                      
                      {/* Venue selector */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 block">Select Outpost Venue:</label>
                        <select
                          id="scanner-venue"
                          value={scannedVenue}
                          onChange={(e) => {
                            setScannedVenue(e.target.value);
                            setScanResult(null);
                          }}
                          className="w-full bg-white border border-neutral-250 rounded-lg p-2 focus:outline-none focus:border-emerald-800 cursor-pointer"
                        >
                          <option value="Spine Beirut">Spine Beirut Rooftop</option>
                          <option value="Al Falamanki">Al Falamanki Achrafieh</option>
                          <option value="Iris Beach Club">Iris Beach Club Damour</option>
                          <option value="The Barn Achrafieh">The Barn Achrafieh</option>
                        </select>
                      </div>

                      {/* Guest Check Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <label className="text-[10px] text-neutral-500">Original Total Bill:</label>
                          <span className="font-mono font-black text-neutral-900 text-sm">${billAmount}.00 USD</span>
                        </div>
                        <input
                          id="scanner-bill-slider"
                          type="range"
                          min="20"
                          max="400"
                          step="10"
                          value={billAmount}
                          onChange={(e) => {
                            setBillAmount(Number(e.target.value));
                            setScanResult(null);
                          }}
                          className="w-full h-1 bg-neutral-250 rounded-lg appearance-none cursor-pointer accent-emerald-800"
                        />
                      </div>
                    </div>

                    {/* Laser Scanner Alignment Emulator */}
                    <div className="relative h-44 bg-neutral-950 rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center text-center p-4">
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent)] pointer-events-none" />
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.1)_1px,transparent_1px)] bg-[size:16px_16px] opacity-25 pointer-events-none" />

                      {/* Animated Red Laser Scan Line */}
                      <div className="absolute left-0 right-0 h-[2px] bg-cyan-400 opacity-80 shadow-[0_0_10px_rgb(34,211,238)] animate-bounce" style={{ animationDuration: '3s' }} />

                      <Camera className="w-8 h-8 text-neutral-500 animate-pulse mb-2" />
                      
                      <button
                        id="btn-trigger-emulator-scan"
                        disabled={isScanning}
                        onClick={() => {
                          setIsScanning(true);
                          setScanResult(null);
                          setTimeout(() => {
                            playSynthesizedBeep();
                            const disc = Math.round(billAmount * 0.20);
                            setScanResult({
                              id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
                              venue: scannedVenue,
                              originalBill: billAmount,
                              discountAmount: disc,
                              finalBill: billAmount - disc,
                              timestamp: new Date().toLocaleTimeString()
                            });
                            setIsScanning(false);
                          }, 1500);
                        }}
                        className="py-2 px-4 bg-emerald-800 hover:bg-emerald-950 text-white font-mono text-[10.5px] font-black uppercase rounded-lg shadow-md transition-all relative z-10 cursor-pointer"
                      >
                        {isScanning ? "Aligning QR Lens..." : "Scan Dynamic QR Pass"}
                      </button>

                      <span className="text-[8px] font-mono text-neutral-400 tracking-widest mt-2 uppercase">
                        {isScanning ? "DECODING ENCRYPTED GRID..." : "TAP OR CLICK TO BEEP"}
                      </span>
                    </div>
                  </div>

                  {/* THE GENERATED SECURED DIGITAL RECEIPT */}
                  {scanResult && (
                    <div className="bg-amber-50/40 border border-amber-300/40 rounded-2xl p-5 space-y-4 animate-scale-up text-xs text-neutral-800 relative overflow-hidden font-mono">
                      <div className="absolute top-2.5 right-2.5 animate-pulse text-[8.5px] bg-emerald-800 text-amber-300 font-bold px-2 py-0.5 rounded select-none uppercase">
                        Verified checkout
                      </div>

                      <div className="space-y-1 text-left">
                        <span className="font-bold text-neutral-950 block text-[12px] uppercase">✦ WhatsOnLebanon Receipts</span>
                        <span className="text-[10px] text-neutral-400 block pb-2 border-b border-dashed border-neutral-300">
                          TX-HASH: {scanResult.id} • {scanResult.timestamp}
                        </span>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between items-center text-neutral-600">
                          <span>Outpost Retailer:</span>
                          <span className="font-bold text-neutral-950 uppercase">{scanResult.venue}</span>
                        </div>
                        <div className="flex justify-between items-center text-neutral-600">
                          <span>Original Ticket Bill:</span>
                          <span className="font-bold text-neutral-900">${scanResult.originalBill}.00 USD</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-850">
                          <span className="font-bold">20% Passholder Discount:</span>
                          <span className="font-extrabold text-emerald-800">-${scanResult.discountAmount}.00 USD</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-dashed border-neutral-350 pt-2 text-neutral-900 font-sans font-black text-sm">
                          <span className="uppercase font-mono text-xs font-semibold">ADJUSTED BILLING TOTAL:</span>
                          <span className="text-emerald-850">${scanResult.finalBill}.00 USD</span>
                        </div>
                      </div>

                      <div className="pt-2 text-center text-[10px] text-neutral-400 leading-normal border-t border-neutral-200">
                        * Thank you, <strong>{loyaltyCard.cardholderName}</strong>! A copy of this transaction has been shared with your registered Viber/Email guide. Offer is backed by Whatsonlebanon.buzz loyalty ecosystem.
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-emerald-800 uppercase font-black bg-emerald-100/10 px-2 py-1 rounded">
                  ★ GET INSTANT VIP DISCOUNTS ACCESS
                </span>
                <h3 className="font-serif text-2xl font-bold text-neutral-950 uppercase mt-2">
                  Activate Your WhatsOnLebanon Card
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-light mt-1">
                  Enter your name below to instantly configure your customized digital loyalty pass. Connect with top-tier venues across Lebanon and claim a flat 20% commitment discount starting tonight!
                </p>
              </div>

              <form onSubmit={handleActivateCard} className="space-y-5">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono font-semibold">Your Full Name (Cardholder Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salim Maalouf, Marianne Khoury"
                    value={cardholderInput}
                    onChange={(e) => setCardholderInput(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:border-emerald-800 placeholder-neutral-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Membership Tier */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono font-semibold">Select Privilege Tier</label>
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value as any)}
                      className="px-3.5 py-3 w-full bg-white border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-emerald-800 text-neutral-900 cursor-pointer"
                    >
                      <option value="VIP Insider">VIP Insider Edition (Complimentary)</option>
                      <option value="Elite Cultist">Elite Cultist Pass (Gourmet Focus)</option>
                      <option value="Founder Member">Founder Member Gold (Zaytounada Backer)</option>
                    </select>
                  </div>

                  {/* Select Theme */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-widest block font-mono font-semibold">Pass Card Style Color</label>
                    <select
                      value={selectedTheme}
                      onChange={(e) => setSelectedTheme(e.target.value as any)}
                      className="px-3.5 py-3 w-full bg-white border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-emerald-800 text-neutral-900 cursor-pointer"
                    >
                      <option value="gold">Cosmic Black & Gold Solid</option>
                      <option value="cosmic">Deep Royal Blue Space Shift</option>
                      <option value="emerald">Elegant Levant Emerald Teal</option>
                      <option value="amber">Sun-kissed Med Terrace Amber</option>
                    </select>
                  </div>
                </div>

                {/* Simulated payment text to ensure clear instructions */}
                <p className="text-[10px] text-neutral-400 font-light leading-normal">
                  * By activating your loyalty card, your device registers in the shared Zaytounada ecosystem database, allowing local partner hosts to accept digital check-ins.
                </p>

                <button
                  type="submit"
                  disabled={isActivating || !cardholderInput.trim()}
                  className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 disabled:bg-neutral-200 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isActivating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Activating Digital Pass...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Activate & Claim Free Loyalty Pass NOW</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* EXCLUSIVE MERCHANDISE & WHY PARTNER WITH US SECTION (RIGHT COLUMN-SPAN-5) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 to-[#0e2c1e] text-white rounded-3xl p-6.5 md:p-8 border border-emerald-800 shadow-xl relative overflow-hidden flex flex-col justify-between text-left group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/10 transition-all duration-300" />
          
          <div className="space-y-6 relative z-10">
            <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase font-black bg-amber-400/10 px-2.5 py-1 rounded inline-block">
              Why Partner With Us?
            </span>
            
            <p className="text-xs leading-relaxed text-neutral-200 font-light">
              "Joining the Whatsonlebanon.buzz ecosystem means becoming part of the <strong className="text-amber-300">"Buss"</strong>—the ultimate insider network in Lebanon. 
              By offering 20% off, you are not just giving a discount; you are unlocking a powerful, recurring customer base that values quality and exclusive access. 
              You become the go-to destination for our community."
            </p>

            <div className="border-t border-emerald-800/80 my-4 pt-4" />

            <div className="space-y-3.5">
              <span className="text-[10px] text-amber-300 uppercase tracking-widest block font-mono font-bold">
                PROSPECTIVE VENUES REGISTER IN 2 MINUTES
              </span>
              <p className="text-[11.5px] text-neutral-300 leading-relaxed font-light">
                Are you a gourmet brand owner, resort organizer, winery manager, or nightlife lounge in Beirut? Submit an application to list your special 20% discount offer layout inside our master digital catalogue.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('suppliers')}
            className="mt-8 w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-emerald-950 text-xs font-mono font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:scale-101 active:scale-97 select-none"
          >
            <span>Merchant Onboarding Form</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* FLYER CORES: "PARTNER BENEFITS" GRID FROM THE ATTACHED PDF */}
      <div className="mb-20 text-left border-t border-neutral-150 pt-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 mb-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold text-emerald-800">
              ⚡ WHATSONLEBANON.BUZZ LOYALTY PROGRAM
            </span>
            <h3 className="font-serif text-2xl font-light text-neutral-900 uppercase mt-1">
              Your Exclusive <span className="font-bold text-emerald-800">Partner Benefits</span>
            </h3>
          </div>
          <div className="text-[10px] font-mono bg-emerald-800 text-amber-300 font-bold px-3 py-1 rounded">
            ECOSYSTEM VALUE FLOWS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Benefit 1 */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 hover:shadow-sm hover:border-emerald-800/20 transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-850 shrink-0">
                <Smartphone className="w-5 h-5 text-emerald-800" />
              </div>
              <h4 className="font-serif font-bold text-sm text-neutral-900 uppercase">Dedicated Merchant page</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                Every approved partner receives a fully optimized, high-conversion landing page on Whatsonlebanon.buzz, showcasing your brand story, food menu, services, and live performances.
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 hover:shadow-sm hover:border-emerald-800/20 transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-850 shrink-0">
                <Layers className="w-5 h-5 text-orange-800" />
              </div>
              <h4 className="font-serif font-bold text-sm text-neutral-900 uppercase">Integrated "Buss" Analytics</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                Gain instant digital data insights into customer table preferences, peak footfall traffic hours, and demographic engagement through our secure backend partner dashboard.
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 hover:shadow-sm hover:border-emerald-800/20 transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-850 shrink-0">
                <Star className="w-5 h-5 text-amber-805" />
              </div>
              <h4 className="font-serif font-bold text-sm text-neutral-900 uppercase">Priority Placement</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                Your luxury venue will be featured prominently in our legendary "What's Popping" alerts and curated event lists sent directly to our active, high-spending member base.
              </p>
            </div>
          </div>

          {/* Benefit 4 */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 hover:shadow-sm hover:border-emerald-800/20 transition-all flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-850 shrink-0">
                <Percent className="w-5 h-5 text-emerald-800" />
              </div>
              <h4 className="font-serif font-bold text-sm text-neutral-900 uppercase">Stackable Marketing</h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
                Your offers benefit from our proprietary "Stacking Rebate" engine, ensuring your brand is featured in our premium bundle deals, attracting a significantly higher volume of cardholders.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* FLYER CORES: "THE MEDIA PROMOTIONAL PROGRAM" COVERS DETAILS FROM PDF TABLE */}
      <div className="mb-20 text-left" id="loyalty-program-table">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 mb-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold text-emerald-800">
              📢 HOW WE CHAMPION YOU
            </span>
            <h3 className="font-serif text-2xl font-light text-neutral-900 uppercase mt-1">
              The Media <span className="font-bold text-emerald-800">Promotional Program</span>
            </h3>
          </div>
        </div>

        {/* Highly polished grid to present the PDF Table beautifully */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-emerald-950 text-white font-mono uppercase text-[10px] tracking-widest text-left">
                <th className="px-6 py-4 border-r border-emerald-800 w-1/4">Promotional Channel</th>
                <th className="px-6 py-4">Action & Targeted Outcomes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-250 text-xs">
              
              <tr className="hover:bg-neutral-50/60 transition-colors">
                <td className="px-6 py-4 border-r border-neutral-200 bg-neutral-50/40">
                  <div className="font-serif font-bold text-neutral-900 uppercase">Social Media Blitz</div>
                  <span className="text-[9px] font-mono text-emerald-700 font-semibold block mt-1">INSTAGRAM & TIKTOK</span>
                </td>
                <td className="px-6 py-4 leading-relaxed font-light text-neutral-600">
                  Weekly <strong className="text-neutral-900 font-bold">"Featured Partner"</strong> spotlight on Instagram and TikTok, utilizing localized Gen Z culture, meme-style creative layouts, and viral culinary showcases to fuel immediate visibility.
                </td>
              </tr>

              <tr className="hover:bg-neutral-50/60 transition-colors">
                <td className="px-6 py-4 border-r border-neutral-200 bg-neutral-50/40">
                  <div className="font-serif font-bold text-neutral-900 uppercase">Influencer Network</div>
                  <span className="text-[9px] font-mono text-emerald-700 font-semibold block mt-1">CREATOR MATCHMAKING</span>
                </td>
                <td className="px-6 py-4 leading-relaxed font-light text-neutral-600">
                  Highly coordinated collaborations with premium local trendsetters and lifestyle content creators who visit, document, and post dynamic Reels detailing their spectacular 20% experience at your venue.
                </td>
              </tr>

              <tr className="hover:bg-neutral-50/60 transition-colors">
                <td className="px-6 py-4 border-r border-neutral-200 bg-neutral-50/40">
                  <div className="font-serif font-bold text-neutral-900 uppercase">"What's Popping" Alerts</div>
                  <span className="text-[9px] font-mono text-emerald-700 font-semibold block mt-1">REAL-TIME Pushes</span>
                </td>
                <td className="px-6 py-4 leading-relaxed font-light text-neutral-600">
                  Live push notifications sent directly to thousands of cardholders when your specific venue is marked as the current "it" spot of the hour, driving immediate, offline real-time customer traffic to empty slots.
                </td>
              </tr>

              <tr className="hover:bg-neutral-50/60 transition-colors">
                <td className="px-6 py-4 border-r border-neutral-200 bg-neutral-50/40">
                  <div className="font-serif font-bold text-neutral-900 uppercase">Content Campaigns</div>
                  <span className="text-[9px] font-mono text-emerald-700 font-semibold block mt-1">turnkey photography</span>
                </td>
                <td className="px-6 py-4 leading-relaxed font-light text-neutral-600">
                  Professional photography schedules and short-form video content creation fully included for your bespoke merchant page, ensuring your gourmet brand looks as exceptionally good as it feels in real life.
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* INTERACTIVE MERCHANDISE OFFERS SHOWCASE (LINKED TO LOYALTY CARD) */}
      <div className="text-left border-t border-neutral-150 pt-16" id="merchant-offers-list">
        <div className="mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-extrabold text-emerald-800">
            ★ VERIFIED VIP REDEMPTIONS
          </span>
          <h3 className="font-serif text-2xl font-light text-neutral-900 uppercase mt-1">
            Browse Active <span className="font-bold text-emerald-800">Merchant Offers</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl font-light">
            Link your active Loyalty Pass to browse verified gourmet locations and preview discount settlements realistically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {merchantOffers.map((offer) => (
            <div 
              key={offer.id}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="h-40 relative bg-neutral-100">
                  <img 
                    src={offer.img} 
                    alt={offer.businessName} 
                    className="w-full h-full object-cover saturate-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-emerald-950 text-amber-300 font-mono text-[8.5px] font-semibold rounded uppercase">
                    {offer.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/90 text-neutral-800 font-mono text-[8.5px] rounded select-none font-bold">
                    {offer.tag}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-serif font-bold text-base text-neutral-900 leading-tight uppercase truncate">{offer.businessName}</h4>
                  
                  <p className="text-[9.5px] font-mono text-neutral-400 uppercase font-medium flex items-center gap-1 leading-none">
                    <MapPin className="w-3.5 h-3.5 text-neutral-300" />
                    <span>{offer.area}</span>
                  </p>
                  
                  <div className="bg-emerald-50 border border-emerald-150 rounded-lg p-2.5 text-emerald-950 text-[11px] leading-relaxed">
                    <span className="font-mono font-bold block text-[8.5px] text-emerald-800 tracking-wider">MEMBER OFFER:</span>
                    {offer.offer}
                  </div>

                  <p className="text-[10px] italic text-neutral-400 font-light font-sans">
                    "{offer.vibe}"
                  </p>
                </div>
              </div>

              <div className="p-4 pt-1 border-t border-neutral-100 shrink-0">
                <button
                  onClick={() => handleRedeemDiscount(offer)}
                  className="w-full py-2 bg-neutral-905 bg-neutral-900 text-white rounded-lg text-[10.5px] font-mono font-bold uppercase transition-all tracking-wider hover:bg-emerald-800 cursor-pointer"
                >
                  Present pass to redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REAL-TIME REDEMPTION MODAL DIALOG (LINKED WITH THE GENERATED LOYALTY CARD) */}
      {activeRedeemVenue && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 shadow-2xl">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 text-left relative text-neutral-900 shadow-2xl animate-scale-up">
            <button
              onClick={() => setActiveRedeemVenue(null)}
              className="absolute top-4 right-4 text-neutral-450 hover:text-neutral-900 font-mono text-base font-bold cursor-pointer"
            >
              ✕
            </button>

            {redemptionSuccess ? (
              <div className="py-10 text-center space-y-4 animate-fade-in flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 animate-bounce">
                  <CheckCircle className="w-10 h-10 stroke-[2.5px]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-black text-neutral-950 uppercase">Discount Code Applied!</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
                    Enjoy your flat <strong className="text-emerald-950">20% off</strong> on goods and dining services at <strong className="text-neutral-900 font-bold">{activeRedeemVenue.businessName}</strong>.
                  </p>
                </div>
                <div className="font-mono text-[9px] text-neutral-400">
                  REF-ID: {Math.floor(100000 + Math.random() * 900000)} • WHATSONLEBANON SECURED
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <span className="text-[8px] font-mono tracking-widest text-[#059669] uppercase font-bold block">
                    ⚡ Live Redemption Portal
                  </span>
                  <h3 className="font-serif text-xl font-bold text-neutral-950 uppercase mt-1">
                    Redeem {activeRedeemVenue.businessName} Offer
                  </h3>
                  <p className="text-[10.5px] text-neutral-500 leading-relaxed font-light mt-1">
                    Presenting your verified WhatsOnLebanon Loyalty Pass to complete checkout.
                  </p>
                </div>

                <div className="bg-neutral-50 border border-neutral-250 p-4.5 rounded-2xl text-[11px] space-y-4 font-sans leading-relaxed">
                  <div className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="font-bold text-neutral-700">Premium Venue:</span>
                    <span className="text-neutral-900 font-bold uppercase">{activeRedeemVenue.businessName}</span>
                  </div>
                  
                  <div className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="font-bold text-neutral-700">Special Benefit:</span>
                    <span className="text-emerald-800 font-bold font-mono">20% OFFER LIVE</span>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-neutral-150 space-y-0.5 mt-2">
                    <strong className="text-neutral-900 block text-[10px] uppercase font-mono tracking-wider text-emerald-800">Linked Cardholder:</strong>
                    <span className="text-xs text-neutral-800 uppercase font-black">{loyaltyCard?.cardholderName || 'Salim Maalouf'}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-neutral-150 space-y-0.5">
                    <strong className="text-neutral-900 block text-[10px] uppercase font-mono tracking-wider text-emerald-800">Pass Number:</strong>
                    <span className="text-xs font-mono font-bold text-neutral-800">{loyaltyCard?.cardNumber || 'WOL-PASS-NOY-8473'}</span>
                  </div>
                </div>

                <button
                  onClick={executeSuccessfulRedemption}
                  className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl shadow-md cursor-pointer transition-all hover:scale-101 active:scale-97 select-none"
                >
                  Verify check-in & settle bill
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

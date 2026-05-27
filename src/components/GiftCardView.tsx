import React, { useState } from 'react';
import { Gift, Sparkles, CheckCircle, Smartphone, MapPin, Printer, Clipboard } from 'lucide-react';

interface GiftCardVoucher {
  id: string;
  amount: number;
  vipExperience: string;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  personalNote: string;
  serialNumber: string;
  issueDate: string;
  paymentCardLast4: string;
}

export default function GiftCardView() {
  const [amount, setAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('Grand Gourmet Tasting');
  const [senderName, setSenderName] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [personalNote, setPersonalNote] = useState<string>('');

  // Checkout simulation states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [purchasedVoucher, setPurchasedVoucher] = useState<GiftCardVoucher | null>(null);

  // Active Gift cards stored locally
  const [localVouchers, setLocalVouchers] = useState<GiftCardVoucher[]>(() => {
    try {
      const stored = localStorage.getItem('zaytouynda_purchased_gift_cards');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const presetAmounts = [50, 100, 250, 500];

  const experiences = [
    { name: 'Grand Gourmet Tasting', desc: 'An exhaustive, multi-course mezza or seasonal tasting showcase with signature dishes.' },
    { name: 'VIP Chef Table Placement', desc: 'Secure front-row layout with direct discussion and customized allocations from the head chef.' },
    { name: 'Coastal Romance Sea Escape', desc: 'Beautiful cliffside seating overlooking ancient waters with premium wine pairing.' },
    { name: 'Traditional Live Tarab Evening', desc: 'Saturate your senses with live authentic music sequences alongside elite Levantine meals.' }
  ];

  const handleOpenCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !recipientName || !recipientEmail) {
      alert("Please specify the mandatory sender and recipient parameters first.");
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleSimulatePayment = () => {
    if (!cardNumber || !cardExpiry || !cardCvv) {
      alert("Please input the simulation credit card numbers first.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const finalAmount = amount === 0 ? Number(customAmount) || 100 : amount;
      const serialNum = 'ZAYT-GCID-' + Math.floor(100000 + Math.random() * 900000);
      const newVoucher: GiftCardVoucher = {
        id: 'gc-' + Date.now(),
        amount: finalAmount,
        vipExperience: selectedExperience,
        senderName,
        senderEmail,
        recipientName,
        recipientEmail,
        personalNote,
        serialNumber: serialNum,
        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        paymentCardLast4: cardNumber.slice(-4) || '4242'
      };

      const updated = [newVoucher, ...localVouchers];
      setLocalVouchers(updated);
      localStorage.setItem('zaytouynda_purchased_gift_cards', JSON.stringify(updated));

      setPurchasedVoucher(newVoucher);
      setIsProcessing(false);
      setIsCheckoutOpen(false);

      // Reset form fields
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
    }, 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left" id="gift-card-view">
      
      {/* Title Header */}
      <div className="mb-8 border-b border-white/5 pb-5">
        <h2 className="font-serif font-light text-3xl text-white flex items-center gap-2.5">
          <Gift className="w-8 h-8 text-red-500" />
          <span>The Gastronomy Gift Voucher Center</span>
        </h2>
        <p className="text-xs text-white/40 mt-1 max-w-xl font-light">
          Sanctify special anniversaries, coordinate executive rewards, or gift high-end VIP tables with our authentic, gorgeous digital Zaytouynda gift cards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Setup form */}
        <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6.5 shadow-xl space-y-6">
          <span className="text-[9px] font-mono tracking-widest text-red-500 uppercase font-black">Configure Gift parameters</span>
          
          <form onSubmit={handleOpenCheckout} className="space-y-6">
            
            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-white/60 tracking-wider font-bold">1. Select Gift Registry Amount</label>
              <div className="grid grid-cols-5 gap-3">
                {presetAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { setAmount(val); setCustomAmount(''); }}
                    className={`p-3.5 rounded-lg border text-center font-mono font-bold text-xs transition-all cursor-pointer ${
                      amount === val
                        ? 'bg-red-650/15 border-red-550/50 text-white shadow-md'
                        : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={() => setAmount(0)}
                  className={`p-3.5 rounded-lg border text-center font-mono text-xs transition-all cursor-pointer ${
                    amount === 0
                      ? 'bg-red-650/15 border-red-550/50 text-white font-bold'
                      : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Custom
                </button>
              </div>

              {amount === 0 && (
                <div className="pt-2 animate-fade-in">
                  <input
                    type="number"
                    placeholder="Enter Custom Value (USD)"
                    required
                    min={20}
                    max={2500}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Premium Table Placements / Experience */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-white/60 tracking-wider font-bold">2. Link to an Elite VIP Seating Experience</label>
              <div className="space-y-2.5">
                {experiences.map((exp) => (
                  <div
                    key={exp.name}
                    onClick={() => setSelectedExperience(exp.name)}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all flex justify-between items-start gap-3 ${
                      selectedExperience === exp.name
                        ? 'bg-red-650/10 border-red-550/40 text-white'
                        : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{exp.name}</span>
                      <span className="text-[10px] text-white/40 block leading-tight mt-0.5">{exp.desc}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${selectedExperience === exp.name ? 'border-red-500 bg-red-600' : 'border-white/20'}`}>
                      {selectedExperience === exp.name && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sender and Recipient Coordinates */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase text-white/60 tracking-wider font-bold block">3. Personalization & Delivery Details</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-white/40">Your Name (Sender)</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salim Maalouf"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-white/40">Your Email Address</span>
                  <input
                    type="email"
                    required
                    placeholder="salim@maalouftrading.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-white/40">Recipient Name</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Marianne Khoury"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-white/40">Recipient Email</span>
                  <input
                    type="email"
                    required
                    placeholder="marianne.k@beirutclinic.org"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-white/40">Custom Gift Message</span>
                <textarea
                  placeholder="With deepest compliments and admiration for your milestone. Looking forward to celebrating together in Beirut."
                  rows={3}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-600/50 font-sans resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 text-center text-white bg-gradient-to-r from-red-600 to-orange-500 hover:brightness-110 text-xs tracking-[0.2em] font-bold uppercase transition-all rounded-lg cursor-pointer shadow-lg"
            >
              Configure Credit Settlement
            </button>

          </form>
        </div>

        {/* Right column: Purchases review & voucher download */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-xl space-y-5">
            <h3 className="font-serif text-lg text-white font-medium">My Active Gift Registries</h3>
            <p className="text-[10.5px] text-white/40 leading-relaxed font-light">
              Digital files of gift cards bought from this device. These can be saved as printable vouchers, or shared directly via email serials.
            </p>

            {localVouchers.length === 0 ? (
              <div className="py-12 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-4">
                <Gift className="w-10 h-10 text-white/10 mb-2.5" />
                <span className="font-serif italic text-xs text-white/40 text-center">No purchased vouchers logged.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {localVouchers.map((vc) => (
                  <div
                    key={vc.id}
                    onClick={() => setPurchasedVoucher(vc)}
                    className="p-3.5 bg-neutral-900 border border-white/5 hover:border-red-600/40 rounded-xl transition-all cursor-pointer flex justify-between items-center gap-2.5"
                  >
                    <div>
                      <span className="text-red-400 font-serif font-bold text-base block">${vc.amount}</span>
                      <span className="text-[10px] font-mono text-white/40 mt-0.5 block truncate max-w-[190px]">
                        To: {vc.recipientName}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono uppercase bg-red-600/10 border border-red-500/20 text-red-400 px-2 py-1 rounded font-bold">
                      {vc.serialNumber.replace('ZAYT-GCID-', '#')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive display card preview */}
          <div className="relative bg-gradient-to-br from-neutral-950 to-neutral-850 border border-red-500/25 p-6 rounded-2xl text-left overflow-hidden shadow-2xl space-y-7 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-650 opacity-[0.03] rounded-full filter blur-2xl" />
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] font-mono uppercase bg-red-650 text-white font-extrabold px-2 py-0.5 rounded tracking-widest">
                  VIP REGISTRY
                </span>
                <h4 className="font-serif font-bold text-lg text-white/90 mt-2">Zaytouynda Lounge Card</h4>
              </div>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-white/30 text-[9px] font-mono uppercase block tracking-wider">VALUE PROVISION:</span>
              <span className="text-4xl font-serif font-bold text-red-500 block leading-none">
                ${amount === 0 ? Number(customAmount) || 120 : amount}
              </span>
              <span className="text-[10px] text-white/50 block font-light italic">
                "{selectedExperience}"
              </span>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <div>
                <span className="text-[8px] text-white/40 font-mono block">RECIPIENT:</span>
                <span className="text-xs text-white/95 font-medium block truncate max-w-[140px]">{recipientName || 'Marianne Khoury'}</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-white/40 font-mono block">SENDER COMPLIMENTS:</span>
                <span className="text-xs text-white/95 font-medium block truncate max-w-[140px]">{senderName || 'Salim Maalouf'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL: EXQUISITE PRINTABLE GIFT CERTIFICATE DETAILED OVERLAY */}
      {purchasedVoucher && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#050505] border border-white/10 rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
            <button
              onClick={() => setPurchasedVoucher(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-lg font-mono cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center space-y-4">
              <div className="w-10 h-10 bg-red-650/15 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/25">
                <Gift className="w-5- h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-white font-bold uppercase tracking-wide">Zaytouynda Luxury Voucher</h3>
                <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-0.5">Officially Certified Registry Document</p>
              </div>
            </div>

            {/* Complete, beautiful printable voucher */}
            <div className="bg-[#0a0a0a] border border-neutral-800 p-6.5 rounded-xl space-y-6 relative text-left">
              <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                <span className="font-serif text-white/95 text-lg font-bold">Compliment Ticket</span>
                <span className="text-red-400 font-mono font-bold text-xl">${purchasedVoucher.amount}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-white/35 block text-[9px] uppercase">Recipient:</span>
                  <span className="text-white font-bold block">{purchasedVoucher.recipientName}</span>
                  <span className="text-white/50 block mt-0.5">{purchasedVoucher.recipientEmail}</span>
                </div>
                <div>
                  <span className="text-white/35 block text-[9px] uppercase">Sender Compliments:</span>
                  <span className="text-white font-bold block">{purchasedVoucher.senderName}</span>
                  <span className="text-white/50 block mt-0.5">{purchasedVoucher.senderEmail}</span>
                </div>
              </div>

              <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-[9px] font-mono uppercase text-white/40 block font-bold">VIP EXPERIENCE SPECIFIED:</span>
                <span className="text-xs text-white/80 block font-medium italic">"{purchasedVoucher.vipExperience}"</span>
              </div>

              {purchasedVoucher.personalNote && (
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase text-white/35 block">Custom Message:</span>
                  <p className="text-xs text-white/60 leading-relaxed font-light font-sans bg-neutral-950 p-3 rounded border border-white/5">
                    "{purchasedVoucher.personalNote}"
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-neutral-800 pt-4">
                <div>
                  <span className="text-[9px] font-mono text-white/35 uppercase block">Serial Registration Key:</span>
                  <span className="text-xs font-mono text-white font-bold text-red-400">{purchasedVoucher.serialNumber}</span>
                  <span className="text-[9px] text-white/30 block mt-0.5">{purchasedVoucher.issueDate}</span>
                </div>
                {/* Simulated visual Barcode */}
                <div className="bg-white p-2 rounded text-black text-center shrink-0">
                  <div className="flex gap-0.5 items-stretch h-8">
                    {[2, 1, 3, 1, 4, 1, 2, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2].map((w, i) => (
                      <div key={i} className="bg-black" style={{ width: `${w}px` }} />
                    ))}
                  </div>
                  <span className="text-[7.5px] font-mono tracking-widest block mt-1 uppercase font-bold">ZAYT-REG-OK</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3.5 pt-2">
              <button
                onClick={() => {
                  alert("Voucher serial key copied to clipboard! Forward it companionably.");
                  navigator.clipboard.writeText(purchasedVoucher.serialNumber);
                }}
                className="px-4 py-2.5 bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-white/85 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Copy Key</span>
              </button>
              
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-red-650 hover:bg-red-550 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREDIT SETTLEMENT OVERLAY MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-white/10 p-6 md:p-8 rounded-2xl max-w-sm w-full space-y-5 text-left shadow-2xl relative">
            
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white font-mono cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[9px] font-mono tracking-widest text-red-500 uppercase font-bold">Secured Simulation Gateway</span>
              <h3 className="font-serif text-lg text-white font-bold mt-1">Payment Settlement</h3>
              <p className="text-[10.5px] text-white/40 leading-relaxed font-light">
                Please settle the gift value card of **${amount === 0 ? customAmount : amount}** securely using any mock credential inputs.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-white/40 uppercase block">Mock Credit Card Number</span>
                <input
                  type="text"
                  required
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  maxLength={19}
                  className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-white/40 uppercase block">Expiry Date</span>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-red-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-white/40 uppercase block">CVV Security Code</span>
                  <input
                    type="password"
                    required
                    placeholder="***"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[9.5px] text-white/40 font-mono leading-relaxed">
                * Note: Zaytouynda demo settlement portal handles secure simulation protocols. No actual transactions execute downstream.
              </div>

              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3.5 text-center text-white bg-red-600 hover:bg-red-550 disabled:bg-neutral-750 font-bold text-xs uppercase tracking-widest rounded-lg cursor-pointer transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Clearing...</span>
                  </>
                ) : (
                  <span>Submit Settlement</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

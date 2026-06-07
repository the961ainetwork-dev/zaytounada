import React, { useState } from 'react';
import { Gift, Sparkles, CheckCircle, Smartphone, MapPin, Printer, Clipboard } from 'lucide-react';
import { showToast } from '../utils/toast';

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
      const stored = localStorage.getItem('zaytounada_purchased_gift_cards');
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
      localStorage.setItem('zaytounada_purchased_gift_cards', JSON.stringify(updated));

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left text-neutral-900" id="gift-card-view">
      
      {/* Title Header */}
      <div className="mb-8 border-b border-neutral-200 pb-5">
        <h2 className="font-serif font-light text-3xl text-neutral-900 flex items-center gap-2.5">
          <Gift className="w-8 h-8 text-red-650" />
          <span>The Gastronomy Gift Voucher Center</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-1 max-w-xl font-light">
          Sanctify special anniversaries, coordinate executive rewards, or gift high-end VIP tables with our authentic, gorgeous digital Zaytounada gift cards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Setup form */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl p-6.5 shadow-sm space-y-6">
          <span className="text-[9px] font-mono tracking-widest text-red-600 uppercase font-black">Configure Gift parameters</span>
          
          <form onSubmit={handleOpenCheckout} className="space-y-6">
            
            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-neutral-500 tracking-wider font-bold">1. Select Gift Registry Amount</label>
              <div className="grid grid-cols-5 gap-3">
                {presetAmounts.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { setAmount(val); setCustomAmount(''); }}
                    className={`p-3.5 rounded-lg border text-center font-mono font-bold text-xs transition-all cursor-pointer ${
                      amount === val
                        ? 'bg-red-50 border-red-500 text-red-650 shadow-xs'
                        : 'bg-neutral-50 border-neutral-205 text-neutral-550 hover:bg-neutral-100'
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
                      ? 'bg-red-50 border-red-500 text-red-650 font-bold'
                      : 'bg-neutral-50 border-neutral-205 text-neutral-550 hover:bg-neutral-100'
                  }`}
                >
                  Custom
                </button>
              </div>

              {amount === 0 && (
                <div className="pt-2 animate-fade-in font-mono">
                  <input
                    type="number"
                    placeholder="Enter Custom Value (USD)"
                    required
                    min={20}
                    max={2500}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Premium Table Placements / Experience */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-neutral-500 tracking-wider font-bold block">2. Link to an Elite VIP Seating Experience</label>
              <div className="space-y-2.5">
                {experiences.map((exp) => (
                  <div
                    key={exp.name}
                    onClick={() => setSelectedExperience(exp.name)}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all flex justify-between items-start gap-3 ${
                      selectedExperience === exp.name
                        ? 'bg-red-50/40 border-red-500 text-neutral-900'
                        : 'bg-neutral-50/50 border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block text-neutral-950">{exp.name}</span>
                      <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">{exp.desc}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${selectedExperience === exp.name ? 'border-red-500 bg-red-600' : 'border-neutral-300'}`}>
                      {selectedExperience === exp.name && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sender and Recipient Coordinates */}
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase text-neutral-500 tracking-wider font-bold block">3. Personalization & Delivery Details</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 font-semibold">Your Name (Sender)</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salim Maalouf"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 font-semibold">Your Email Address</span>
                  <input
                    type="email"
                    required
                    placeholder="salim@maalouftrading.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 font-semibold">Recipient Name</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Marianne Khoury"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 font-semibold">Recipient Email</span>
                  <input
                    type="email"
                    required
                    placeholder="marianne.k@beirutclinic.org"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-neutral-500 font-semibold">Custom Gift Message</span>
                <textarea
                  placeholder="With deepest compliments and admiration for your milestone. Looking forward to celebrating together in Beirut."
                  rows={3}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650 font-sans resize-none font-light"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 text-center text-white bg-gradient-to-r from-red-650 to-orange-500 hover:brightness-110 text-xs tracking-[0.2em] font-bold uppercase transition-all rounded-lg cursor-pointer shadow-sm"
            >
              Configure Credit Settlement
            </button>

          </form>
        </div>

        {/* Right column: Purchases review & voucher download */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-serif text-lg text-neutral-950 font-semibold">My Active Gift Registries</h3>
            <p className="text-[10.5px] text-neutral-500 leading-relaxed font-light">
              Digital files of gift cards bought from this device. These can be saved as printable vouchers, or shared directly via email serials.
            </p>

            {localVouchers.length === 0 ? (
              <div className="py-12 border border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center p-4 bg-neutral-50">
                <Gift className="w-10 h-10 text-neutral-300 mb-2.5" />
                <span className="font-serif italic text-xs text-neutral-450 text-center">No purchased vouchers logged.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {localVouchers.map((vc) => (
                  <div
                    key={vc.id}
                    onClick={() => setPurchasedVoucher(vc)}
                    className="p-3.5 bg-neutral-50 border border-neutral-200 hover:border-red-500/65 rounded-xl transition-all cursor-pointer flex justify-between items-center gap-2.5"
                  >
                    <div>
                      <span className="text-red-650 font-serif font-bold text-base block">${vc.amount}</span>
                      <span className="text-[10px] font-mono text-neutral-500 mt-0.5 block truncate max-w-[190px]">
                        To: {vc.recipientName}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono uppercase bg-red-50 border border-red-200 text-red-650 px-2 py-1 rounded font-bold">
                      {vc.serialNumber.replace('ZAYT-GCID-', '#')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive display card preview */}
          <div className="relative bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-6 rounded-2xl text-left overflow-hidden shadow-2xl space-y-7 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-650 opacity-[0.03] rounded-full filter blur-2xl" />
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[8px] font-mono uppercase bg-red-600 text-white font-extrabold px-2 py-0.5 rounded tracking-widest">
                  VIP REGISTRY
                </span>
                <h4 className="font-serif font-bold text-lg text-white/90 mt-2">Zaytounada Lounge Card</h4>
              </div>
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-white/35 text-[9px] font-mono uppercase block tracking-wider font-semibold">VALUE PROVISION:</span>
              <span className="text-4xl font-serif font-bold text-red-500 block leading-none">
                ${amount === 0 ? Number(customAmount) || 120 : amount}
              </span>
              <span className="text-[10px] text-white/60 block font-light italic">
                "{selectedExperience}"
              </span>
            </div>

            <div className="flex justify-between items-end border-t border-white/5 pt-4">
              <div>
                <span className="text-[8px] text-white/35 font-mono block">RECIPIENT:</span>
                <span className="text-xs text-white/95 font-medium block truncate max-w-[140px]">{recipientName || 'Marianne Khoury'}</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-white/35 font-mono block">SENDER COMPLIMENTS:</span>
                <span className="text-xs text-white/95 font-medium block truncate max-w-[140px]">{senderName || 'Salim Maalouf'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL: EXQUISITE PRINTABLE GIFT CERTIFICATE DETAILED OVERLAY */}
      {purchasedVoucher && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 shadow-2xl">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl text-neutral-900">
            <button
              onClick={() => setPurchasedVoucher(null)}
              className="absolute top-4 right-4 text-neutral-450 hover:text-neutral-900 text-lg font-mono cursor-pointer font-bold"
            >
              ✕
            </button>

            <div className="text-center space-y-4">
              <div className="w-10 h-10 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto border border-red-200">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-neutral-950 font-bold uppercase tracking-wide">Zaytounada Luxury Voucher</h3>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-0.5">Officially Certified Registry Document</p>
              </div>
            </div>

            {/* Complete, beautiful printable voucher */}
            <div className="bg-neutral-50 border border-neutral-200 p-6.5 rounded-xl space-y-6 relative text-left">
              <div className="flex justify-between items-baseline border-b border-neutral-200 pb-3">
                <span className="font-serif text-neutral-950 text-lg font-bold">Compliment Ticket</span>
                <span className="text-red-650 font-mono font-bold text-xl">${purchasedVoucher.amount}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold">Recipient:</span>
                  <span className="text-neutral-900 font-bold block">{purchasedVoucher.recipientName}</span>
                  <span className="text-neutral-550 block mt-0.5">{purchasedVoucher.recipientEmail}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold">Sender Compliments:</span>
                  <span className="text-neutral-900 font-bold block">{purchasedVoucher.senderName}</span>
                  <span className="text-neutral-550 block mt-0.5">{purchasedVoucher.senderEmail}</span>
                </div>
              </div>

              <div className="space-y-1 bg-white p-3 rounded-lg border border-neutral-150">
                <span className="text-[9px] font-mono uppercase text-neutral-450 block font-bold">VIP EXPERIENCE SPECIFIED:</span>
                <span className="text-xs text-neutral-800 block font-medium italic">"{purchasedVoucher.vipExperience}"</span>
              </div>

              {purchasedVoucher.personalNote && (
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 block font-bold">Custom Message:</span>
                  <p className="text-xs text-neutral-650 leading-relaxed font-light font-sans bg-white p-3 rounded border border-neutral-150">
                    "{purchasedVoucher.personalNote}"
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-neutral-200 pt-4">
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase block">Serial Registration Key:</span>
                  <span className="text-xs font-mono text-red-650 font-bold">{purchasedVoucher.serialNumber}</span>
                  <span className="text-[9px] text-neutral-500 block mt-0.5">{purchasedVoucher.issueDate}</span>
                </div>
                {/* Simulated visual Barcode */}
                <div className="bg-white p-2 rounded text-black text-center shrink-0 border border-neutral-200">
                  <div className="flex gap-0.5 items-stretch h-8">
                    {[2, 1, 3, 1, 4, 1, 2, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2].map((w, i) => (
                      <div key={i} className="bg-black" style={{ width: `${w}px` }} />
                    ))}
                  </div>
                  <span className="text-[7.5px] font-mono tracking-widest block mt-1 uppercase font-bold text-neutral-700">ZAYT-REG-OK</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3.5 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(purchasedVoucher.serialNumber);
                  showToast('Voucher Copied to Clipboard!');
                }}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer border border-neutral-200"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Copy Key</span>
              </button>
              
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-550 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 shadow-2xl">
          <div className="bg-white border border-neutral-200 p-6 md:p-8 rounded-2xl max-w-sm w-full space-y-5 text-left shadow-2xl relative text-neutral-900">
            
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-neutral-450 hover:text-neutral-900 font-mono cursor-pointer font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-[9px] font-mono tracking-widest text-red-650 uppercase font-bold">Secured Simulation Gateway</span>
              <h3 className="font-serif text-lg text-neutral-950 font-bold mt-1">Payment Settlement</h3>
              <p className="text-[10.5px] text-neutral-500 leading-relaxed font-light">
                Please settle the gift value card of **${amount === 0 ? customAmount : amount}** securely using any mock credential inputs.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-neutral-500 uppercase block">Mock Credit Card Number</span>
                <input
                  type="text"
                  required
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  maxLength={19}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 font-mono focus:outline-none focus:border-red-650"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block">Expiry Date</span>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 font-mono focus:outline-none focus:border-red-650"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block">CVV Security Code</span>
                  <input
                    type="password"
                    required
                    placeholder="***"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 font-mono focus:outline-none focus:border-red-650"
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-[9.5px] text-neutral-500 font-mono leading-relaxed">
                * Note: Zaytounada demo settlement portal handles secure simulation protocols. No actual transactions execute downstream.
              </div>

              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3.5 text-center text-white bg-red-600 hover:bg-red-650 disabled:bg-neutral-300 font-bold text-xs uppercase tracking-widest rounded-lg cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
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

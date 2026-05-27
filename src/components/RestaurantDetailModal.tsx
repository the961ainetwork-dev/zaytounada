import { useState, FormEvent } from 'react';
import { Restaurant, Booking } from '../types';
import { X, MapPin, Phone, Globe, Award, Calendar, Users, Clock, AlertCircle, CheckCircle, Heart, Star, Share2, Check } from 'lucide-react';

interface RestaurantDetailModalProps {
  restaurant: Restaurant;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onAddBooking: (booking: Booking) => void;
}

export default function RestaurantDetailModal({
  restaurant,
  onClose,
  isSaved,
  onToggleSave,
  onAddBooking
}: RestaurantDetailModalProps) {
  const [activeImage, setActiveImage] = useState(restaurant.imageUrl);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('19:30');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [bookingState, setBookingState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const deepLink = `${window.location.origin}${window.location.pathname}?restaurant=${restaurant.id}`;
    navigator.clipboard.writeText(deepLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
      });
  };

  const timeSlots = ['12:00', '13:00', '19:00', '19:30', '20:00', '20:30', '21:00'];

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !bookingDate) {
      alert('Please fill in all booking fields.');
      return;
    }

    setBookingState('submitting');
    setTimeout(() => {
      const newBooking: Booking = {
        id: `book-${Math.random().toString(36).substr(2, 9)}`,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        userName,
        userEmail,
        guestsCount,
        date: bookingDate,
        time: selectedTime,
        specialRequests: dietaryRequirements,
        status: 'confirmed'
      };
      
      onAddBooking(newBooking);
      setConfirmedBooking(newBooking);
      setBookingState('success');
    }, 1500);
  };

  const imagesList = [restaurant.imageUrl, ...restaurant.images];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Visual Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 text-center">
        <div 
          className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-left my-8 scale-100 transition-all transform duration-300"
          id="restaurant-detail-container"
        >
          {/* Close Trigger Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 flex items-center justify-center w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm border border-white/5 shadow transition-colors cursor-pointer"
            id="modal-close-button"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left half: High-end visual showcase & galleries */}
          <div className="w-full md:w-1/2 bg-[#050505] flex flex-col text-white">
            {/* Spotlight Banner Image */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
              <img
                src={activeImage}
                alt={restaurant.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent h-40" />
              
              {/* Header Title Placement */}
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-red-500 font-bold">
                  {restaurant.cuisine}
                </span>
                <h2 className="text-3xl font-serif font-light mt-1 text-[#F5F5F5] drop-shadow-md">
                  {restaurant.name}
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-white/50 mt-1.5 font-light">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{restaurant.address}</span>
                </p>
              </div>
            </div>

            {/* Thumbnail Selection Bar */}
            <div className="p-6 pt-2 bg-[#0a0a0a] flex flex-col gap-4">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      activeImage === img ? 'border-red-600 scale-105 opacity-100' : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>

              {/* Distinction info details */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-white/40 font-mono tracking-widest uppercase">Official Distinction</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {restaurant.stars > 0 ? (
                      <div className="flex items-center gap-1">
                        <span className="text-red-500 text-lg">✻</span>
                        <span className="font-serif text-sm font-semibold text-white/90">
                          {restaurant.stars} Zaytouynda Star{restaurant.stars > 1 ? 's' : ''}
                        </span>
                      </div>
                    ) : restaurant.distinction === 'BIB_GOURMAND' ? (
                      <span className="text-red-500 font-semibold text-sm">☺ Exceptional Value Bib Gourmand</span>
                    ) : (
                      <span className="text-white/70 font-semibold text-sm">Selected Zaytouynda Guide Spot</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                      copied 
                        ? 'bg-green-950/40 text-green-400 border-green-500/20' 
                        : 'bg-white/5 text-white/75 border-white/10 hover:bg-white/10'
                    }`}
                    title="Copy unique deep-link"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Spot</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onToggleSave}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                      isSaved
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white/5 text-white/75 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Saved to Guides' : 'Save Restaurant'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right half: Editorial evaluation review & booking systems */}
          <div className="w-full md:w-1/2 flex flex-col h-[72vh] md:h-[85vh] overflow-y-auto bg-[#0a0a0a] border-l border-white/5 text-[#F5F5F5]">
            {/* Modal Tabs or section contents */}
            <div className="p-6 md:p-8 space-y-8 flex-1">
              
              {/* Core Inspector Summary */}
              <section id="inspector-analysis">
                <div className="flex items-center gap-2 text-red-500 font-serif font-light text-sm uppercase tracking-widest mb-3 border-b border-white/5 pb-1">
                  <Award className="w-4.5 h-4.5" />
                  <span>Zaytouynda Inspection Report</span>
                </div>
                
                {/* Master Chef block */}
                <div className="mb-4 inline-flex items-center gap-2.5 px-3 py-1 bg-white/5 rounded border border-white/5">
                  <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">CHEF DE CUISINE</span>
                  <span className="font-serif font-light text-sm text-white/90">{restaurant.chef}</span>
                </div>

                {/* Inspector's detailed text */}
                <p className="font-serif italic text-white/85 text-xs sm:text-sm leading-relaxed border-l-2 border-red-600 pl-4 bg-white/5 py-3 rounded-r-sm">
                  "{restaurant.inspectorNote}"
                </p>
                
                <p className="text-white/60 text-xs leading-relaxed mt-4 font-light">
                  {restaurant.description}
                </p>
              </section>

              {/* Signature Dishes */}
              <section id="signature-dishes">
                <h4 className="font-serif font-light text-base text-[#F5F5F5] mb-3.5 uppercase tracking-wide">Signature Dishes Selected by Inspectors</h4>
                <div className="space-y-2.5">
                  {restaurant.signatureDishes.map((dish, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3 bg-white/5 rounded border border-white/5">
                      <span className="flex items-center justify-center w-5.5 h-5.5 bg-red-600/10 text-red-400 border border-red-500/30 rounded-full font-mono text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-white/80 text-sm leading-snug font-light font-serif">{dish}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Special Features / Atmosphere */}
              <section id="features">
                <h4 className="font-mono text-[9px] font-bold tracking-widest text-white/40 uppercase mb-3">Establishment Features</h4>
                <div className="flex flex-wrap gap-2">
                  {restaurant.features.map((feature, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 text-white/80 rounded-full text-xs font-light">
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </section>

              {/* Contact Information & Practical Details */}
              <section id="contacts" className="pt-6 border-t border-white/5">
                <h4 className="font-mono text-[9px] font-bold tracking-widest text-white/40 uppercase mb-3.5">Practical Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-white/30" />
                    <span>{restaurant.phone}</span>
                  </div>
                  <a 
                    href={restaurant.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2.5 text-red-500 hover:text-red-400 hover:underline transition-colors"
                  >
                    <Globe className="w-4 h-4 text-white/30" />
                    <span>Visit Official Website ↗</span>
                  </a>
                </div>
              </section>

              {/* Interactive Booking Section */}
              <section id="booking-desk" className="pt-8 border-t border-white/5">
                <div className="bg-[#050505] border border-white/5 rounded-lg p-5 md:p-6 shadow-xl">
                  {bookingState === 'idle' || bookingState === 'submitting' ? (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <h4 className="font-serif font-light text-lg text-white uppercase tracking-wide">Gourmet Booking Desk</h4>
                      </div>
                      <p className="text-xs text-white/55 mb-4 leading-relaxed font-light">
                        Zaytouynda Guide tables are highly coveted. Request a seat placement, and details will be forwarded directly to our Maitre D'.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name Input */}
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            disabled={bookingState === 'submitting'}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:border-red-600/50 outline-none"
                          />
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="johndoe@gmail.com"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            disabled={bookingState === 'submitting'}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:border-red-600/50 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Guest Count */}
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1">Guests Count</label>
                          <div className="flex items-center border border-white/10 rounded overflow-hidden bg-white/5">
                            <button
                              type="button"
                              onClick={() => setGuestsCount(g => Math.max(1, g - 1))}
                              disabled={bookingState === 'submitting'}
                              className="px-3 py-1 bg-white/5 hover:bg-white/10 active:bg-white/20 border-r border-white/10 text-sm font-semibold cursor-pointer text-white"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center font-mono text-xs font-bold text-white/90">
                              {guestsCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => setGuestsCount(g => Math.min(10, g + 1))}
                              disabled={bookingState === 'submitting'}
                              className="px-3 py-1 bg-white/5 hover:bg-white/10 active:bg-white/20 border-l border-white/10 text-sm font-semibold cursor-pointer text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Date Picker */}
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1">Select Date</label>
                          <input
                            type="date"
                            required
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            disabled={bookingState === 'submitting'}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:border-red-600/50 outline-none select-none"
                          />
                        </div>

                        {/* Time Slots Selector */}
                        <div>
                          <label className="block text-xs font-semibold text-white/60 mb-1">Select Time</label>
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            disabled={bookingState === 'submitting'}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:border-red-600/50 outline-none cursor-pointer"
                          >
                            {timeSlots.map((time) => (
                              <option key={time} value={time} className="bg-neutral-950 text-white">{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Special Dietary Requirements */}
                      <div>
                        <label className="block text-xs font-semibold text-white/60 mb-1">Dietary Preferences or Allergies</label>
                        <textarea
                          placeholder="Vegetarian, pescatarian, nut allergies, celebrating wedding anniversary, etc..."
                          value={dietaryRequirements}
                          onChange={(e) => setDietaryRequirements(e.target.value)}
                          disabled={bookingState === 'submitting'}
                          rows={2}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-white focus:border-red-600/50 outline-none resize-none"
                        />
                      </div>

                      {/* Request Button */}
                      <button
                        type="submit"
                        disabled={bookingState === 'submitting'}
                        className={`w-full py-3 rounded uppercase font-bold text-xs tracking-widest text-white shadow border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          bookingState === 'submitting' 
                            ? 'bg-white/5 border-white/5 text-white/40 cursor-not-allowed' 
                            : 'bg-transparent border-red-600 text-red-500 hover:bg-red-600 hover:text-white_active:scale-[0.99]'
                        }`}
                        id="submit-booking-button"
                      >
                        {bookingState === 'submitting' ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            <span>Securing Allocation Table...</span>
                          </>
                        ) : (
                          <span>Submit Booking Request</span>
                        )}
                      </button>
                    </form>
                  ) : (
                    // Booking success screen!
                    <div className="flex flex-col items-center text-center py-4 space-y-4" id="booking-success-box">
                      <div className="relative">
                        <CheckCircle className="w-16 h-16 text-green-500 translate-y-0.5 animate-bounce" />
                        <div className="absolute top-0 right-0 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                          <span className="text-[9px] text-neutral-950 font-bold">✻</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-serif font-light text-xl text-white uppercase tracking-wider">Seat Reservation Secured</h4>
                        <p className="text-[10px] text-green-400 mt-1.5 font-bold font-mono uppercase tracking-widest bg-green-950/40 border border-green-500/20 px-2.5 py-1 rounded inline-block">
                          Allocated ID: {confirmedBooking?.id}
                        </p>
                      </div>

                      <div className="w-full bg-[#050505] border border-dashed border-white/15 rounded p-4 text-xs space-y-2.5 text-left max-w-sm shadow-sm font-mono">
                        <div className="flex justify-between border-b border-white/5 pb-1.5 font-sans font-semibold text-white/90">
                          <span>{restaurant.name}</span>
                          <span className="text-red-500 font-mono text-[10px]">✻ {restaurant.stars} STARS</span>
                        </div>
                        <div className="flex justify-between text-white/50 animate-fade-in">
                          <span>Guest:</span>
                          <span className="text-white font-medium">{confirmedBooking?.userName}</span>
                        </div>
                        <div className="flex justify-between text-white/50">
                          <span>Party Size:</span>
                          <span className="text-white font-medium">{confirmedBooking?.guestsCount} Guests</span>
                        </div>
                        <div className="flex justify-between text-white/50">
                          <span>Date:</span>
                          <span className="text-white font-medium">{confirmedBooking?.date}</span>
                        </div>
                        <div className="flex justify-between text-white/50">
                          <span>Timing:</span>
                          <span className="text-white font-medium">{confirmedBooking?.time}</span>
                        </div>
                        {confirmedBooking?.specialRequests && (
                          <div className="pt-1.5 border-t border-white/5 text-white/40 text-[10px]">
                            <span className="font-sans font-bold block mb-0.5 uppercase tracking-wide">Notes:</span>
                            <span className="italic">"{confirmedBooking.specialRequests}"</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[9px] text-white/40 max-w-xs uppercase font-mono tracking-widest">
                        A verification code has been dispatched to {confirmedBooking?.userEmail}. Show verification on arrival.
                      </p>

                      <button
                        onClick={() => {
                          setBookingState('idle');
                          setUserName('');
                          setUserEmail('');
                          setDietaryRequirements('');
                        }}
                        className="px-5 py-2.5 bg-transparent border border-white/10 hover:bg-white/10 text-white rounded text-xs font-semibold uppercase tracking-widest cursor-pointer transition-all"
                      >
                        Secure Another Reservation
                      </button>
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

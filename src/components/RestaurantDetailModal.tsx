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
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 text-center">
        <div 
          className="relative w-full max-w-5xl bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-left my-8 scale-100 transition-all transform duration-300 text-neutral-950"
          id="restaurant-detail-container"
        >
          {/* Close Trigger Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 flex items-center justify-center w-10 h-10 bg-white/90 hover:bg-white text-neutral-800 rounded-full border border-neutral-250 shadow-sm transition-colors cursor-pointer"
            id="modal-close-button"
          >
            <X className="w-5 h-5 font-bold" />
          </button>

          {/* Left half: High-end visual showcase & galleries */}
          <div className="w-full md:w-1/2 bg-neutral-50 flex flex-col text-neutral-900 border-b md:border-b-0 md:border-r border-neutral-200">
            {/* Spotlight Banner Image */}
            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-neutral-100">
              <img
                src={activeImage}
                alt={restaurant.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-transparent to-transparent h-40" />
              
              {/* Header Title Placement */}
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-705 text-emerald-700 font-extrabold block">
                  {restaurant.cuisine}
                </span>
                <h2 className="text-3xl font-serif font-black mt-1 text-neutral-955">
                  {restaurant.name}
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-neutral-600 mt-1.5 font-light">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{restaurant.address}</span>
                </p>
              </div>
            </div>

            {/* Thumbnail Selection Bar */}
            <div className="p-6 pt-2 bg-neutral-50 flex flex-col gap-4">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {imagesList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      activeImage === img ? 'border-emerald-600 scale-105 opacity-100 shadow-md' : 'border-neutral-250 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>

              {/* Distinction info details */}
              <div className="border-t border-neutral-200 pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div>
                  <p className="text-[9px] text-neutral-450 font-mono tracking-widest uppercase font-bold">Official Distinction</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {restaurant.stars > 0 ? (
                      <div className="flex items-center gap-1 text-neutral-900">
                        <span className="text-amber-550 text-lg leading-none font-bold">✻</span>
                        <span className="font-serif text-sm font-bold text-neutral-850">
                          {restaurant.stars} Zaytounada Star{restaurant.stars > 1 ? 's' : ''} (✻)
                        </span>
                      </div>
                    ) : restaurant.distinction === 'BIB_GOURMAND' ? (
                      <span className="text-amber-700 font-bold text-sm">☺ Exceptional Value Bib Gourmand</span>
                    ) : (
                      <span className="text-neutral-700 font-semibold text-sm">Selected Zaytounada Guide Spot</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                      copied 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                        : 'bg-white text-neutral-700 border-neutral-250 hover:bg-neutral-50 shadow-xs'
                    }`}
                    title="Copy unique deep-link"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Share Spot</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onToggleSave}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${
                      isSaved
                        ? 'bg-emerald-750 bg-emerald-700 text-white border-emerald-500 font-extrabold shadow-sm hover:bg-emerald-850'
                        : 'bg-white text-neutral-705 border-neutral-250 hover:bg-neutral-50 shadow-xs'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Saved to Guides' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right half: Editorial evaluation review & booking systems */}
          <div className="w-full md:w-1/2 flex flex-col h-[72vh] md:h-[85vh] overflow-y-auto bg-white text-neutral-900 text-left">
            {/* Modal Tabs or section contents */}
            <div className="p-6 md:p-8 space-y-8 flex-1">
              
              {/* Core Inspector Summary */}
              <section id="inspector-analysis">
                <div className="flex items-center gap-2 text-emerald-700 font-serif font-black text-sm uppercase tracking-widest mb-3 border-b border-neutral-200 pb-1">
                  <Award className="w-4.5 h-4.5" />
                  <span>Zaytounada Inspection Report</span>
                </div>
                
                {/* Master Chef block */}
                <div className="mb-4 inline-flex items-center gap-2.5 px-3 py-1 bg-neutral-100 rounded border border-neutral-200">
                  <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wide">CHEF DE CUISINE</span>
                  <span className="font-serif font-semibold text-sm text-neutral-805">{restaurant.chef}</span>
                </div>

                {/* Inspector's detailed text */}
                <p className="font-serif italic text-neutral-850 text-xs sm:text-sm leading-relaxed border-l-2 border-amber-400 pl-4 bg-neutral-50 py-3 rounded-r-md">
                  "{restaurant.inspectorNote}"
                </p>
                
                <p className="text-neutral-600 text-xs leading-relaxed mt-4 font-light font-sans">
                  {restaurant.description}
                </p>
              </section>

              {/* Signature Dishes */}
              <section id="signature-dishes" className="text-left">
                <h4 className="font-serif font-black text-base text-neutral-950 mb-3.5 uppercase tracking-wide">Signature Dishes Selected by Inspectors</h4>
                <div className="space-y-2.5 text-left">
                  {restaurant.signatureDishes.map((dish, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3 bg-neutral-50 rounded border border-neutral-200 text-left">
                      <span className="flex items-center justify-center w-5.5 h-5.5 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-full font-mono text-xs font-bold shrink-0 mt-0.5 select-none">
                        {idx + 1}
                      </span>
                      <p className="text-neutral-800 text-sm leading-snug font-light font-serif text-left">{dish}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Special Features / Atmosphere */}
              <section id="features">
                <h4 className="font-mono text-[9px] font-bold tracking-widest text-neutral-450 uppercase mb-3">Establishment Features</h4>
                <div className="flex flex-wrap gap-2">
                  {restaurant.features.map((feature, i) => (
                    <span key={i} className="px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-850 rounded-full text-xs font-medium">
                      ✓ {feature}
                    </span>
                  ))}
                </div>
              </section>

              {/* Contact Information & Practical Details */}
              <section id="contacts" className="pt-6 border-t border-neutral-200">
                <h4 className="font-mono text-[9px] font-bold tracking-widest text-neutral-450 uppercase mb-3.5">Practical Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-neutral-450 shrink-0" />
                    <span>{restaurant.phone}</span>
                  </div>
                  <a 
                    href={restaurant.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2.5 text-emerald-700 hover:text-emerald-600 hover:underline transition-colors font-bold"
                  >
                    <Globe className="w-4 h-4 text-neutral-450 shrink-0" />
                    <span>Visit Official Website ↗</span>
                  </a>
                </div>
              </section>

              {/* Interactive Booking Section */}
              <section id="booking-desk" className="pt-8 border-t border-neutral-200 text-left">
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 md:p-6 shadow-xs text-left">
                  {bookingState === 'idle' || bookingState === 'submitting' ? (
                    <form onSubmit={handleBookingSubmit} className="space-y-4 text-left">
                      <div className="flex items-center gap-2 mb-2 text-left">
                        <Calendar className="w-5 h-5 text-emerald-700" />
                        <h4 className="font-serif font-black text-lg text-emerald-950 uppercase tracking-wide">Gourmet Booking Desk</h4>
                      </div>
                      <p className="text-xs text-neutral-555 mb-4 leading-relaxed font-light font-sans text-left">
                        Zaytounada Guide tables are highly coveted. Request a seat placement, and details will be forwarded directly to our Maitre D'.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        {/* Name Input */}
                        <div>
                          <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            disabled={bookingState === 'submitting'}
                            className="w-full px-3 py-2.5 bg-white border border-neutral-250 text-neutral-900 rounded-lg text-xs focus:border-emerald-600 outline-none"
                          />
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="johndoe@gmail.com"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            disabled={bookingState === 'submitting'}
                            className="w-full px-3 py-2.5 bg-white border border-neutral-250 text-neutral-900 rounded-lg text-xs focus:border-emerald-600 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                        {/* Guest Count */}
                        <div>
                          <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Guests Count</label>
                          <div className="flex items-center border border-neutral-250 rounded-lg overflow-hidden bg-white">
                            <button
                              type="button"
                              onClick={() => setGuestsCount(g => Math.max(1, g - 1))}
                              disabled={bookingState === 'submitting'}
                              className="px-3 py-1 bg-neutral-50 hover:bg-neutral-100 border-r border-neutral-200 text-sm font-semibold cursor-pointer text-neutral-800"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center font-mono text-xs font-bold text-neutral-900">
                              {guestsCount}
                            </span>
                            <button
                              type="button"
                              onClick={() => setGuestsCount(g => Math.min(10, g + 1))}
                              disabled={bookingState === 'submitting'}
                              className="px-3 py-1 bg-neutral-50 hover:bg-neutral-100 border-l border-neutral-200 text-sm font-semibold cursor-pointer text-neutral-800"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Date Picker */}
                        <div>
                          <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Select Date</label>
                          <input
                            type="date"
                            required
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            disabled={bookingState === 'submitting'}
                            className="w-full px-3 py-2 bg-white border border-neutral-250 text-neutral-900 rounded-lg text-xs focus:border-emerald-600 outline-none select-none cursor-pointer"
                          />
                        </div>

                        {/* Time Slots Selector */}
                        <div>
                          <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Select Time</label>
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            disabled={bookingState === 'submitting'}
                            className="w-full px-3 py-2 bg-white border border-neutral-250 text-neutral-900 rounded-lg text-xs focus:border-emerald-600 outline-none cursor-pointer"
                          >
                            {timeSlots.map((time) => (
                              <option key={time} value={time} className="bg-white text-neutral-900">{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Special Dietary Requirements */}
                      <div className="text-left">
                        <label className="block text-[9px] font-bold font-mono tracking-wider uppercase text-neutral-600 mb-1">Dietary Preferences or Allergies</label>
                        <textarea
                          placeholder="Vegetarian, pescatarian, nut allergies, celebrating wedding anniversary, etc..."
                          value={dietaryRequirements}
                          onChange={(e) => setDietaryRequirements(e.target.value)}
                          disabled={bookingState === 'submitting'}
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-neutral-250 text-neutral-900 rounded-lg text-xs focus:border-emerald-600 outline-none resize-none"
                        />
                      </div>

                      {/* Request Button */}
                      <button
                        type="submit"
                        disabled={bookingState === 'submitting'}
                        className={`w-full py-3.5 rounded-lg uppercase tracking-widest text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          bookingState === 'submitting' 
                            ? 'bg-neutral-150 border-neutral-200 text-neutral-400 cursor-not-allowed' 
                            : 'bg-emerald-700 hover:bg-emerald-850 text-white shadow'
                        }`}
                        id="submit-booking-button"
                      >
                        {bookingState === 'submitting' ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-neutral-800 rounded-full animate-spin" />
                            <span>Securing Allocation Table...</span>
                          </>
                        ) : (
                          <span>Submit Booking Request</span>
                        )}
                      </button>
                    </form>
                  ) : (
                    // Booking success screen!
                    <div className="flex flex-col items-center text-center py-4 space-y-4 text-left" id="booking-success-box">
                      <div className="relative">
                        <CheckCircle className="w-16 h-16 text-emerald-600 translate-y-0.5 animate-bounce" />
                        <div className="absolute top-0 right-0 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                          <span className="text-[9px] text-neutral-950 font-bold select-none">✻</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <h4 className="font-serif font-black text-xl text-neutral-950 uppercase tracking-widest">Reservation Secured</h4>
                        <p className="text-[10px] text-emerald-700 mt-1.5 font-bold font-mono uppercase tracking-widest bg-emerald-50 border border-emerald-250 px-2.5 py-1 rounded inline-block">
                          Allocated ID: {confirmedBooking?.id}
                        </p>
                      </div>

                      <div className="w-full bg-white border border-dashed border-emerald-250 rounded-lg p-4 text-xs space-y-2.5 text-left max-w-sm shadow-xs font-mono">
                        <div className="flex justify-between border-b border-neutral-205 pb-1.5 font-sans font-bold text-neutral-900">
                          <span>{restaurant.name}</span>
                          <span className="text-amber-500 font-bold text-[10px]">✻ {restaurant.stars} STARS</span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                          <span>Guest:</span>
                          <span className="text-neutral-900 font-extrabold">{confirmedBooking?.userName}</span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                          <span>Party Size:</span>
                          <span className="text-neutral-900 font-extrabold">{confirmedBooking?.guestsCount} Guests</span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                          <span>Date:</span>
                          <span className="text-neutral-900 font-extrabold">{confirmedBooking?.date}</span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                          <span>Timing:</span>
                          <span className="text-neutral-900 font-extrabold">{confirmedBooking?.time}</span>
                        </div>
                        {confirmedBooking?.specialRequests && (
                          <div className="pt-1.5 border-t border-neutral-205 text-neutral-500 text-[10px] font-sans">
                            <span className="font-bold block mb-0.5 uppercase tracking-wide">Notes:</span>
                            <span className="italic">"{confirmedBooking.specialRequests}"</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[9px] text-neutral-450 max-w-xs uppercase font-mono tracking-widest text-center leading-relaxed">
                        A verification code has been dispatched to **{confirmedBooking?.userEmail}**. Show verification on arrival.
                      </p>

                      <button
                        onClick={() => {
                          setBookingState('idle');
                          setUserName('');
                          setUserEmail('');
                          setDietaryRequirements('');
                        }}
                        className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-250 text-neutral-800 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer transition-all shadow-xs"
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

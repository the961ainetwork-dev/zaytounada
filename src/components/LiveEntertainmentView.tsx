import React, { useState } from 'react';
import { RESTAURANTS } from '../data/restaurants';
import { Restaurant, Booking } from '../types';
import { Music, Calendar, MapPin, Sparkles, CheckCircle, Clock } from 'lucide-react';

interface LiveEntertainmentProps {
  onAddBooking: (booking: Booking) => void;
  onNavigateTab: (tab: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function LiveEntertainmentView({
  onAddBooking,
  onNavigateTab,
  onSelectRestaurant
}: LiveEntertainmentProps) {
  // Booking helper state for specific live show
  const [selectedShow, setSelectedShow] = useState<any | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [customRequests, setCustomRequests] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Elite live music & entertainment happening near you (focused on Beirut & international Zaytouynda venues)
  const entertainmentShows = [
    {
      id: 'show-1',
      title: 'Majestic Live Tarab Masterworks',
      perfGroup: 'The Al-Atlal Classical Orchestra',
      restId: 'rest-1', // Em Sherif Beirut
      restName: 'Em Sherif',
      venueCity: 'Beirut',
      venueDistrict: 'Achrafieh',
      timeString: 'Every Thursday & Saturday, 21:00 onwards',
      imageUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800',
      description: 'Step into an opulent, palace-like atmosphere. Mireille Hayek presents classical oud, kanun, and master vocalists performing legendary Tarab classics of Oum Kalthoum and Fairuz. Fully matched with their majestic mezza buffet.'
    },
    {
      id: 'show-2',
      title: 'Sunset Coast Violinist Rhythms',
      perfGroup: 'Soloist Maria Al-Sayegh',
      restId: 'rest-9', // Babel Bahr Jbeil Coast
      restName: 'Babel Bahr',
      venueCity: 'Beirut',
      venueDistrict: 'Amchit Coastal Road',
      timeString: 'Every Friday & Sunday, Sunset sessions (18:00 - 20:30)',
      imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
      description: 'Savor traditional baked fish with direct Mediterranean sea breezes. Virtuoso Maria Al-Sayegh integrates haunting acoustic violin compositions with contemporary ocean-wave acoustics, custom tailored for romantic sundowns.'
    },
    {
      id: 'show-3',
      title: 'Progressive Mediterranean Jazz & Lounge',
      perfGroup: 'The Mar Mikhael Jazz Quartet',
      restId: 'rest-11', // Baron Beirut (rest-11)
      restName: 'Baron',
      venueCity: 'Beirut',
      venueDistrict: 'Mar Mikhael',
      timeString: 'Every Wednesday Evening, 20:00 - 23:00',
      imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800',
      description: 'Accompanying Chef Baron\'s award-winning progressive wood-fired gastronomy, enjoy a soulful, upbeat performance featuring brass horns, standup double-bass scales, and soft vocal rhythms under the open canopy.'
    },
    {
      id: 'show-4',
      title: 'Chopin Nocturnes Piano Banquet',
      perfGroup: 'Pianist Kenji Yamadera',
      restId: 'rest-7', // Kikunoi Kyoto (or equivalent Kaiseki)
      restName: 'Kikunoi Honten',
      venueCity: 'Kyoto',
      venueDistrict: 'Maruyama Park',
      timeString: 'Every Monday Afternoon & Friday Evening',
      imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=800',
      description: 'In the tranquil heart of Kyoto, experience a meditative pairing of multi-course kaiseki meals with soft classical Chopin piano melodies bouncing lightly off tatami walls and pine trees. Perfect for quiet contemplation.'
    }
  ];

  const handleBookShow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) {
      alert("Please provide custom guest credentials to reserve.");
      return;
    }

    const linkedRestaurant = RESTAURANTS.find(r => r.id === selectedShow.restId) || RESTAURANTS[0];
    const newBooking: Booking = {
      id: 'book-live-' + Date.now(),
      restaurantId: linkedRestaurant.id,
      restaurantName: `${linkedRestaurant.name} (Live Performance Seating)`,
      userName,
      userEmail,
      guestsCount: guestCount,
      date: '2026-05-30', // Saturday fallback
      time: '21:00',
      specialRequests: `${customRequests} (Performance Reserved: "${selectedShow.title}" - Performance Guest Group: ${selectedShow.perfGroup})`,
      status: 'confirmed'
    };

    onAddBooking(newBooking);
    setBookingSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left text-neutral-900" id="live-entertainment-view">
      
      {/* Editorial Header */}
      <div className="mb-8 border-b border-neutral-200 pb-5 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2 text-left">
        <div>
          <h2 className="font-serif font-light text-3xl text-neutral-900 flex items-center gap-2.5">
            <Music className="w-8 h-8 text-red-650" />
            <span>Live Entertainment Happening Near You</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl font-light">
            Surround your luxury plate with authentic acoustic depth, classical Tarab orchestration, sunset cliffside violinists, or progressive jazz lounge arrays.
          </p>
        </div>
        <span className="text-[10px] font-mono uppercase bg-red-50 border border-red-200 text-red-650 font-bold px-3 py-1.5 rounded tracking-widest leading-none">
          Beirut & Global Schedule
        </span>
      </div>

      {/* Main visual list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {entertainmentShows.map((show) => {
          const matchingRestaurant = RESTAURANTS.find(r => r.id === show.restId);
          return (
            <div
              key={show.id}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between h-full hover:border-neutral-300 transition-all"
            >
              <div className="relative h-56 w-full bg-neutral-100">
                <img src={show.imageUrl} alt={show.title} className="w-full h-full object-cover opacity-90" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none" />
                
                {/* Visual marker tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[9px] font-mono uppercase bg-red-650 text-white font-extrabold px-2.5 py-1 rounded shadow-xs leading-none">
                    LIVE PERFORMANCE
                  </span>
                  <span className="text-[9px] font-mono uppercase bg-white/95 text-neutral-800 border border-neutral-250 px-2.5 py-1 rounded shadow-xs font-bold leading-none">
                    {show.venueCity}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-[9px] font-mono uppercase text-red-600 font-extrabold tracking-widest block">{show.perfGroup}</span>
                  <h4 className="font-serif font-black text-xl text-neutral-950 leading-snug">{show.title}</h4>
                  
                  <div className="flex flex-col gap-1.5 text-xs text-neutral-550 pt-1 font-light">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-red-600" />
                      <span>{show.timeString}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>At: <strong className="text-neutral-800 hover:text-red-650 hover:underline cursor-pointer" onClick={() => matchingRestaurant && onSelectRestaurant(matchingRestaurant)}>{show.restName}</strong> ({show.venueDistrict}, {show.venueCity})</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed font-light font-sans pt-2">
                    {show.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="text-left w-full sm:w-auto">
                    <span className="text-[9px] text-neutral-450 font-mono uppercase tracking-wider block font-bold">Inspections Standard:</span>
                    <span className="text-amber-550 text-xs tracking-tighter block mt-0.5 font-bold">
                      {'✻'.repeat(matchingRestaurant?.stars || 3)} Zaytouynda Stars (✻)
                    </span>
                  </div>
                  
                  <div className="flex gap-2.5 w-full sm:w-auto">
                    {matchingRestaurant && (
                      <button
                        onClick={() => onSelectRestaurant(matchingRestaurant)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 border border-neutral-250 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                      >
                        Details
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedShow(show);
                        setBookingSuccess(false);
                      }}
                      className="flex-1 sm:flex-initial px-5.5 py-2.5 bg-red-600 hover:bg-red-650 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      Reserve Seats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: LIVE PERFORMANCE RESERVATION PORTAL OVERLAY */}
      {selectedShow && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6.5 relative overflow-hidden shadow-2xl space-y-5 text-neutral-900 text-left">
            <button
              onClick={() => setSelectedShow(null)}
              className="absolute top-4 right-4 text-neutral-450 hover:text-neutral-900 font-mono cursor-pointer font-bold text-lg"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-5 animate-fade-in">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-250 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-mono uppercase bg-emerald-100 text-emerald-650 px-2 py-0.5 rounded border border-emerald-200 font-extrabold">
                    RESERVATIONS SECURED
                  </span>
                  <h3 className="font-serif text-lg text-neutral-950 font-bold">Show Seats Allocation Complete!</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto font-light">
                    Your allocation for **"{selectedShow.title}"** at **{selectedShow.restName}** has been secured in alignment with the artists schedule. Forwarded to the host roster.
                  </p>
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => {
                      setSelectedShow(null);
                      onNavigateTab('saved');
                    }}
                    className="px-5.5 py-3 bg-red-650 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer"
                  >
                    View active tickets dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-655">
                    <Music className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-neutral-950 font-bold">Performance Seating Portal</h3>
                    <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wide">At {selectedShow.restName}</p>
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[11px] text-neutral-700 space-y-1.5">
                  <div>
                    <span className="text-neutral-450 font-mono text-[8px] uppercase font-bold">SHOW PERFORMERS:</span>
                    <p className="text-neutral-900 font-bold">{selectedShow.title} - performed by {selectedShow.perfGroup}</p>
                  </div>
                  <div>
                    <span className="text-neutral-450 font-mono text-[8px] uppercase font-bold">TIMELINE INDEX:</span>
                    <p className="text-neutral-900 font-medium">{selectedShow.timeString}</p>
                  </div>
                </div>

                <form onSubmit={handleBookShow} className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] font-mono text-neutral-505 uppercase tracking-widest block font-bold">Guest Primary Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Al-Sayed"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9.5px] font-mono text-neutral-505 uppercase tracking-widest block font-bold">Corporate or Personal Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. resident@domain.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 focus:outline-none focus:border-red-650"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9.5px] font-mono text-neutral-505 uppercase tracking-widest block font-bold">Party Size Allocation (Covers)</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 font-semibold focus:outline-none cursor-pointer outline-none"
                    >
                      {[1, 2, 3, 4, 5, 8, 10].map((num) => (
                        <option key={num} value={num} className="bg-white text-neutral-900 font-medium">
                          {num} Guest{num > 1 ? 's' : ''} (Table Cover)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9.5px] font-mono text-neutral-505 uppercase tracking-widest block font-bold">Performance Seating Requests</label>
                    <textarea
                      placeholder="Special table near acoustic harp / live vocals, gluten restriction notes..."
                      rows={2}
                      value={customRequests}
                      onChange={(e) => setCustomRequests(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-250 rounded-lg text-neutral-900 focus:outline-none resize-none font-sans"
                    />
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 text-[9.5px] text-red-650 font-mono flex items-start gap-2 rounded-lg leading-relaxed">
                    <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 animate-pulse text-red-600" />
                    <span>Allocations for shows are extremely limited. Traditional attire or smart elegant jacket required at entrance. No ticketing cost.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-center bg-red-600 hover:bg-red-655 text-white text-[10px] tracking-widest font-extrabold uppercase rounded-lg transition-all cursor-pointer shadow-sm"
                  >
                    Confirm Show Allocation Seat
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

import { useState, FormEvent } from 'react';
import { Restaurant, SavedItinerary, Booking } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import { Sparkles, Calendar, Plus, Trash2, Heart, Award, ArrowRight, Share2, Clipboard, Printer, ExternalLink, MessageCircle, Star, Bookmark } from 'lucide-react';
import { showToast } from '../utils/toast';

interface MyGuideViewProps {
  savedRestaurantIds: string[];
  onToggleSave: (id: string) => void;
  revisitRestaurantIds: string[];
  onToggleRevisit: (id: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  savedItineraries: SavedItinerary[];
  onAddItinerary: (itinerary: SavedItinerary) => void;
  onDeleteItinerary: (id: string) => void;
  setActiveTab: (tab: string) => void;
  bookings: Booking[];
  onClearBookings: () => void;
  reviews: Record<string, { rating: number; comment: string; date: string; photo?: string; signatureDish?: string }>;
  onOpenReview: (booking: Booking) => void;
  bookingSortOrder: 'chrono' | 'reverse-chrono';
  setBookingSortOrder: (order: 'chrono' | 'reverse-chrono') => void;
}

export default function MyGuideView({
  savedRestaurantIds,
  onToggleSave,
  revisitRestaurantIds = [],
  onToggleRevisit,
  onSelectRestaurant,
  savedItineraries,
  onAddItinerary,
  onDeleteItinerary,
  setActiveTab,
  bookings = [],
  onClearBookings,
  reviews = {},
  onOpenReview,
  bookingSortOrder,
  setBookingSortOrder
}: MyGuideViewProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('Beirut');
  const [newDate, setNewDate] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [selectedRestIds, setSelectedRestIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeShareItinerary, setActiveShareItinerary] = useState<SavedItinerary | null>(null);

  // Get active saved restaurant instances
  const savedRestaurants = RESTAURANTS.filter(r => savedRestaurantIds.includes(r.id));

  // Get active revisit restaurant instances
  const revisitRestaurants = RESTAURANTS.filter(r => revisitRestaurantIds.includes(r.id));

  // Get saved restaurants filtered by the city chosen for the itinerary
  const candidateRestaurants = RESTAURANTS.filter(
    r => savedRestaurantIds.includes(r.id) && r.city.toLowerCase() === newCity.toLowerCase()
  );

  const handleCreateItinerary = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) {
      alert('Kindly fill in the title and scheduled date.');
      return;
    }

    const itinerary: SavedItinerary = {
      id: `itinerary-${Math.random().toString(36).substr(2, 9)}`,
      title: newTitle,
      cityName: newCity,
      tripDate: newDate,
      restaurantIds: selectedRestIds,
      notes: newNotes
    };

    onAddItinerary(itinerary);
    
    // Reset inputs
    setNewTitle('');
    setNewNotes('');
    setSelectedRestIds([]);
    setIsCreating(false);
  };

  const toggleSelectRestId = (id: string) => {
    setSelectedRestIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const copyShareText = (itinerary: SavedItinerary) => {
    const matchedRests = RESTAURANTS.filter(r => itinerary.restaurantIds.includes(r.id));
    let text = `CULINARY ITINERARY: ${itinerary.title}\nCity: ${itinerary.cityName}\nDate scheduled: ${itinerary.tripDate}\n\n`;
    text += `SAVED SELECTIONS:\n`;
    matchedRests.forEach((r, idx) => {
      text += `${idx + 1}. ${r.name} (${r.stars > 0 ? '★'.repeat(r.stars) : r.distinction === 'BIB_GOURMAND' ? 'Bib Gourmand' : 'Selected'})\n   Cuisine: ${r.cuisine}\n   Address: ${r.address}\n\n`;
    });
    if (itinerary.notes) {
      text += `NOTES:\n"${itinerary.notes}"\n`;
    }
    text += `\nShared via Gourmet Zaytounada Guide App`;

    navigator.clipboard.writeText(text);
    showToast('Link Copied to Clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-neutral-900" id="my-guide-perspective">
      {/* Title */}
      <div className="mb-8">
        <h2 className="font-serif font-light text-3xl text-neutral-900 flex items-center gap-2">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <span>My Curated Culinary Guide</span>
        </h2>
        <p className="text-xs text-neutral-500 mt-1 tracking-wide">
          Keep track of your favorite Zaytounada-starred locations and coordinate premium dining travel itineraries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left pane: Curated Favourites list */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-serif font-semibold text-base text-neutral-950 flex items-center gap-2 mb-4 uppercase tracking-wider">
              <Star className="w-4 h-4 text-red-500 fill-current" />
              <span>Saved Restaurants ({savedRestaurants.length})</span>
            </h3>

            {savedRestaurants.length === 0 ? (
              <div className="text-center py-10 px-4 flex flex-col items-center justify-center border border-dashed border-neutral-250 rounded bg-neutral-50">
                <Heart className="w-10 h-10 text-neutral-300 mb-3" />
                <p className="font-serif italic text-sm text-neutral-800">No saved selections yet.</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed font-light">
                  Browse through culinary capitals and click the heart icon on cards to save.
                </p>
                <button
                  onClick={() => setActiveTab('discovery')}
                  className="mt-6 px-4 py-2 border border-red-650 text-red-650 font-bold text-[10px] uppercase tracking-widest bg-transparent hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                >
                  Explore Restaurants Now
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                {savedRestaurants.map((restaurant) => {
                  const starsStars = restaurant.stars > 0 ? '✻'.repeat(restaurant.stars) : '';
                  return (
                    <div
                      key={restaurant.id}
                      className="group p-3 bg-neutral-50 border border-neutral-150 rounded flex items-center gap-3 hover:bg-neutral-100 transition-colors shadow-xs"
                    >
                      {/* Photo mini thumbnail */}
                      <img
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        onClick={() => onSelectRestaurant(restaurant)}
                        className="w-14 h-14 object-cover rounded shrink-0 cursor-pointer border border-neutral-200 grayscale hover:grayscale-0 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] font-mono uppercase text-neutral-400 font-bold tracking-wider">{restaurant.cuisine}</span>
                          {starsStars && <span className="text-red-500 text-xs font-serif font-bold tracking-tighter">{starsStars}</span>}
                        </div>
                        <h4 
                          onClick={() => onSelectRestaurant(restaurant)}
                          className="font-serif font-light text-xs text-neutral-900 truncate shrink-0 hover:text-red-650 transition-colors cursor-pointer"
                        >
                          {restaurant.name}
                        </h4>
                        <p className="text-[9px] text-neutral-500 truncate">{restaurant.city}, {restaurant.country}</p>
                      </div>

                      {/* Delete option */}
                      <button
                        onClick={() => onToggleSave(restaurant.id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1.5 cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Plan to Revisit Section */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm mt-6 text-left" id="my-guide-revisit-widget">
            <h3 className="font-serif font-semibold text-base text-neutral-950 flex items-center gap-2 mb-4 uppercase tracking-wider">
              <Bookmark className="w-4 h-4 text-emerald-800 fill-current" />
              <span>Plan to Revisit ({revisitRestaurants.length})</span>
            </h3>

            {revisitRestaurants.length === 0 ? (
              <div className="text-center py-8 px-4 flex flex-col items-center justify-center border border-dashed border-neutral-250 rounded bg-neutral-50/50">
                <Bookmark className="w-8 h-8 text-neutral-300 mb-2" />
                <p className="font-serif italic text-xs text-neutral-800">No revisit plans set yet.</p>
                <p className="text-[10px] text-neutral-500 mt-1 max-w-xs leading-relaxed font-light">
                  Use the 'Plan to Revisit' button in your booking feedback modal to save destinations here.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {revisitRestaurants.map((restaurant) => {
                  const starsStars = restaurant.stars > 0 ? '✻'.repeat(restaurant.stars) : '';
                  return (
                    <div
                      key={restaurant.id}
                      className="group p-3 bg-neutral-50 border border-neutral-150 rounded flex items-center gap-3 hover:bg-neutral-100 transition-colors shadow-xs"
                    >
                      {/* Photo mini thumbnail */}
                      <img
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        onClick={() => onSelectRestaurant(restaurant)}
                        className="w-14 h-14 object-cover rounded shrink-0 cursor-pointer border border-neutral-200 grayscale hover:grayscale-0 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] font-mono uppercase text-neutral-400 font-bold tracking-wider">{restaurant.cuisine}</span>
                          {starsStars && <span className="text-red-500 text-xs font-serif font-bold tracking-tighter">{starsStars}</span>}
                        </div>
                        <h4 
                          onClick={() => onSelectRestaurant(restaurant)}
                          className="font-serif font-light text-xs text-neutral-900 truncate shrink-0 hover:text-red-650 transition-colors cursor-pointer"
                        >
                          {restaurant.name}
                        </h4>
                        <p className="text-[9px] text-neutral-500 truncate">{restaurant.city}, {restaurant.country}</p>
                      </div>

                      {/* Delete option */}
                      <button
                        onClick={() => onToggleRevisit(restaurant.id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1.5 cursor-pointer"
                        title="Remove from revisit list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* My Active Bookings Dashboard Widget */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm mt-6 text-left" id="my-guide-bookings-widget">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-neutral-200 pb-3 mb-4">
              <div>
                <h3 className="font-serif font-semibold text-base text-neutral-950 flex items-center gap-2 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>My Bookings ({bookings.length})</span>
                </h3>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {bookings.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider select-none">Sort:</span>
                    <select
                      value={bookingSortOrder}
                      onChange={(e) => setBookingSortOrder(e.target.value as 'chrono' | 'reverse-chrono')}
                      className="text-[9px] font-mono uppercase bg-transparent text-neutral-600 border border-neutral-200 rounded px-1.5 py-0.5 outline-none cursor-pointer hover:border-neutral-350 focus:border-red-500 transition-colors"
                    >
                      <option value="chrono" className="text-neutral-900 bg-white">Earliest</option>
                      <option value="reverse-chrono" className="text-neutral-900 bg-white">Latest</option>
                    </select>
                  </div>
                )}
                {bookings.length > 0 && (
                  <button
                    onClick={onClearBookings}
                    className="text-[9px] text-neutral-400 hover:text-emerald-700 font-mono uppercase tracking-widest cursor-pointer select-none"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="py-6 font-serif italic text-neutral-400 text-center text-xs">
                No active bookings.
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {[...bookings]
                  .sort((a, b) => {
                    const dateCompare = a.date.localeCompare(b.date);
                    if (dateCompare !== 0) {
                      return bookingSortOrder === 'chrono' ? dateCompare : -dateCompare;
                    }
                    return bookingSortOrder === 'chrono' 
                      ? a.time.localeCompare(b.time) 
                      : b.time.localeCompare(a.time);
                  })
                  .map((book) => {
                    const review = reviews[book.id];
                  return (
                    <div 
                      key={book.id} 
                      className="p-3 bg-neutral-50 border border-neutral-150 rounded flex flex-col justify-between gap-2.5 text-left shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[7.5px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-1.5 py-0.5 rounded tracking-wider leading-none">
                            TICKET
                          </span>
                          <h4 className="font-serif font-bold text-xs text-neutral-900 mt-1">
                            {book.restaurantName}
                          </h4>
                          <p className="text-[9px] text-neutral-500">
                            {book.date} • {book.time}
                          </p>
                          <p className="text-[9px] text-neutral-400 font-light mt-0.5">
                            {book.guestsCount} Guest{book.guestsCount > 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className="text-[8px] uppercase font-bold text-white bg-emerald-700 px-1.5 py-0.5 rounded font-mono tracking-widest leading-none shrink-0 select-none">
                          {book.status}
                        </span>
                      </div>

                      {review && (
                        <div className="pt-2 border-t border-dotted border-neutral-200">
                          <div className="flex items-center gap-1">
                            <span className="text-amber-500 font-serif font-bold text-[10px] leading-none">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </span>
                            <span className="text-[7.5px] font-mono text-neutral-400 ml-1">My Review</span>
                          </div>
                          <p className="text-[9.5px] italic text-neutral-500 font-serif leading-relaxed mt-1 max-w-full">
                            "{review.comment}"
                          </p>
                          {review.signatureDish && (
                            <div className="mt-2 flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[8.5px] font-mono w-fit shadow-3xs animate-fade-in">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0"></span>
                              <span>Signature Dish: <strong className="font-extrabold">{review.signatureDish}</strong></span>
                            </div>
                          )}
                          {review.photo && (
                            <div className="mt-2 relative">
                              <img 
                                src={review.photo} 
                                alt="User review attachment" 
                                className="max-h-32 w-auto rounded-lg border border-neutral-200 object-cover shadow-3xs"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border-t border-neutral-150/60 pt-2 flex justify-end">
                        <button
                          onClick={() => onOpenReview(book)}
                          className="flex items-center gap-1 px-2.5 py-1 border border-red-500 hover:bg-red-600 hover:text-white text-red-650 transition-all text-[8.5px] font-bold uppercase tracking-widest cursor-pointer rounded bg-white shadow-3xs"
                        >
                          <Star className="w-3 h-3 text-red-500 fill-current block shrink-0" />
                          <span>{review ? 'Edit Review' : 'Review Visit'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right pane: Curated Itineraries Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-5">
              <div>
                <h3 className="font-serif font-light text-base text-neutral-900 flex items-center gap-2 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span>Culinary Trip Itineraries ({savedItineraries.length})</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1 font-light">Develop sequential schedules for exclusive dining escapes.</p>
              </div>

              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-transparent border border-red-500 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold cursor-pointer"
                  id="create-itinerary-trigger"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Itinerary</span>
                </button>
              )}
            </div>

            {/* Itinerary creator drawer panel */}
            {isCreating && (
              <form onSubmit={handleCreateItinerary} className="bg-neutral-50 border border-neutral-200 p-5 mb-6 space-y-4 rounded-lg animate-fade-in animate-duration-300" id="itinerary-creator-form">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-serif font-semibold text-xs text-neutral-900 uppercase tracking-wider">Draft New Culinary Journey</h4>
                  <button 
                    type="button" 
                    onClick={() => setIsCreating(false)}
                    className="text-[10px] text-neutral-400 hover:text-red-550 uppercase tracking-widest cursor-pointer font-mono font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Journey Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Beirut Weekend Gourmet, Batroun Sunset Tour"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded text-xs text-neutral-900 focus:border-red-650 outline-none"
                    />
                  </div>

                  {/* Scheduled Date */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded text-xs text-neutral-900 focus:border-red-650 outline-none select-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Destination City */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Culinary Capital</label>
                    <select
                      value={newCity}
                      onChange={(e) => {
                        setNewCity(e.target.value);
                        setSelectedRestIds([]); // reset selections to prevent mixing cities
                      }}
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded text-xs text-neutral-900 focus:border-red-650 outline-none cursor-pointer text-left"
                    >
                      {['Beirut', 'Byblos', 'Batroun', 'Tripoli'].map((city) => (
                        <option key={city} className="bg-white text-neutral-900" value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Notes space */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Journey Notes / Directives</label>
                    <input
                      type="text"
                      placeholder="e.g., Celebrating anniversary, focusing on coastal seafood..."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded text-xs text-neutral-900 focus:border-red-650 outline-none"
                    />
                  </div>
                </div>

                {/* Candidate Saved restaurants checklist inside chosen city */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide text-[10px]">
                    Select Saved Restaurants in {newCity} ({candidateRestaurants.length})
                  </label>
                  {candidateRestaurants.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic bg-white p-3 rounded border border-neutral-200 leading-relaxed font-light">
                      No saved restaurants in {newCity}. Save some restaurants in {newCity} from the main catalog to append them to your trip plan!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto bg-white p-2.5 rounded border border-neutral-200">
                      {candidateRestaurants.map((rest) => {
                        const isChecked = selectedRestIds.includes(rest.id);
                        return (
                          <button
                            type="button"
                            key={rest.id}
                            onClick={() => toggleSelectRestId(rest.id)}
                            className={`flex items-center text-left gap-2.5 p-2 rounded border text-xs cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-red-50 border-red-500 text-red-650 font-bold'
                                : 'bg-transparent border-neutral-100 text-neutral-750 hover:bg-neutral-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={isChecked}
                              className="rounded border-[#ccc] bg-transparent text-red-600 pointer-events-none"
                            />
                            <span className="truncate">{rest.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all text-[10px] uppercase tracking-widest font-bold cursor-pointer bg-transparent mt-4 shadow-sm"
                >
                  Confirm and Build Itinerary
                </button>
              </form>
            )}

            {/* List of planned itineraries */}
            {savedItineraries.length === 0 ? (
              <div className="text-center py-16 px-4 flex flex-col items-center justify-center border border-dashed border-neutral-200 rounded bg-neutral-50">
                <Calendar className="w-12 h-12 text-neutral-300 mb-3" />
                <p className="font-serif italic text-sm text-neutral-700">No culinary plans drafted yet.</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed font-light">
                  Draft a personalized Zaytounada travel sequence to organize specific dates, guest notes, and dining timelines.
                </p>
                {!isCreating && (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="mt-6 px-4 py-2.5 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer bg-transparent"
                  >
                    Draft First Plan
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {savedItineraries.map((itinerary) => {
                  const matchedRestaurants = RESTAURANTS.filter(r => itinerary.restaurantIds.includes(r.id));
                  return (
                    <div
                      key={itinerary.id}
                      className="border border-neutral-200 rounded p-5 bg-neutral-50/50 hover:border-neutral-300 transition-all space-y-4 text-left shadow-xs"
                      id={`itinerary-card-${itinerary.id}`}
                    >
                      {/* Card Header metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                        <div>
                          <span className="text-[8px] font-mono uppercase bg-red-50 text-red-650 border border-red-200 px-2 py-0.5 rounded font-bold tracking-widest">
                            {itinerary.cityName} JOURNEY
                          </span>
                          <h4 className="font-serif font-semibold text-base text-neutral-900 mt-2 uppercase tracking-wide">
                            {itinerary.title}
                          </h4>
                          <p className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-1 tracking-wider uppercase font-mono">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Planned Date: {itinerary.tripDate}</span>
                          </p>
                        </div>

                        {/* Actions utilities */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyShareText(itinerary)}
                            className="p-2 border border-neutral-200 rounded hover:border-red-500 hover:text-red-500 text-neutral-400 transition-colors cursor-pointer bg-white"
                            title="Copy itinerary details to clipboard"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteItinerary(itinerary.id)}
                            className="p-2 border border-neutral-200 rounded hover:bg-red-600 hover:text-white hover:border-red-600 text-neutral-400 transition-colors cursor-pointer bg-white"
                            title="Delete this Itinerary"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Notes snippet summary */}
                      {itinerary.notes && (
                        <p className="text-neutral-700 bg-white px-3 py-2.5 rounded border-l-2 border-red-600 italic leading-relaxed text-xs border border-neutral-100">
                          " {itinerary.notes} "
                        </p>
                      )}

                      {/* Sequential dining timeline */}
                      <div className="space-y-4 pt-1">
                        <span className="font-mono text-[8px] font-bold text-neutral-400 tracking-wider uppercase block">
                          Gastronomique Sequence ({matchedRestaurants.length})
                        </span>
                        
                        {matchedRestaurants.length === 0 ? (
                          <p className="text-xs text-neutral-500 italic font-light">No restaurants appended. Draft an itinerary and include saved selections inside it.</p>
                        ) : (
                          <div className="relative border-l border-neutral-200 ml-3.5 pl-5.5 space-y-4">
                            {matchedRestaurants.map((rest, pos) => (
                              <div key={rest.id} className="relative group/seq">
                                {/* Bullet spot index */}
                                <div className="absolute -left-9 top-0.5 w-6 h-6 bg-white text-red-650 border border-red-300 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shadow-sm group-hover/seq:border-red-500 transition-all">
                                  {pos + 1}
                                </div>

                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap text-[9px] uppercase font-mono tracking-wider">
                                      <span className="text-neutral-500 font-bold">{rest.cuisine}</span>
                                      {rest.stars > 0 && (
                                        <span className="text-red-500 font-serif font-bold">{'✻'.repeat(rest.stars)}</span>
                                      )}
                                    </div>
                                    <h5 
                                      onClick={() => onSelectRestaurant(rest)}
                                      className="font-serif font-light text-sm text-neutral-900 group-hover/seq:text-red-600 transition-colors cursor-pointer"
                                    >
                                      {rest.name}
                                    </h5>
                                    <p className="text-[10px] text-neutral-500 truncate font-light mt-0.5">{rest.address}</p>
                                  </div>

                                  <button
                                    onClick={() => onSelectRestaurant(rest)}
                                    className="p-1 text-neutral-400 hover:text-red-650 transition-colors cursor-pointer shrink-0"
                                    title="Open inspect file report"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

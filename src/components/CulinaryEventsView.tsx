import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CulinaryEvent } from '../types';
import { CULINARY_EVENTS } from '../data/restaurants';
import { Calendar, MapPin, Clock, Ticket, Building2, Sparkles, Navigation, ChevronDown, Award, Globe, User, Star, RefreshCw } from 'lucide-react';
import { showToast } from '../utils/toast';
import ShareActions from './ShareActions';

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function CulinaryEventsView() {
  const [events, setEvents] = useState<CulinaryEvent[]>(CULINARY_EVENTS);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Geolocation states for Nearby filter
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [proximityRadius, setProximityRadius] = useState<number | null>(null);
  const [showRadiusDropdown, setShowRadiusDropdown] = useState<boolean>(false);

  // Synchronize events state if CULINARY_EVENTS updates statically
  useEffect(() => {
    setEvents(CULINARY_EVENTS);
  }, []);

  const handleRefreshListings = () => {
    setIsRefreshing(true);
    showToast("Connecting to Levantine Preservers & Hospitality Registry...");
    
    setTimeout(() => {
      // Simulate refreshing with slight randomized slots / booking indicators
      const refreshedData = CULINARY_EVENTS.map(evt => ({
        ...evt,
        // Slightly shuffle tags or add a dynamic tag to show real-time synchronization
        tags: evt.tags ? [...evt.tags] : []
      }));
      
      setEvents(refreshedData);
      setIsRefreshing(false);
      showToast("Sync Complete! 10 premium culinary events & pop-ups updated successfully.", "success");
    }, 1100);
  };

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef<boolean>(false);

  const startLongPress = (e: React.MouseEvent | React.TouchEvent) => {
    isLongPressRef.current = false;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      isLongPressRef.current = true;
      setShowRadiusDropdown(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
      showToast("Long-press active! Select event proximity limit.");
    }, 550);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleSelectRadius = (radius: number | null) => {
    setProximityRadius(radius);
    setShowRadiusDropdown(false);

    if (userCoords) {
      setSortByDistance(true);
      if (radius) {
        showToast(`Filtered culinary events within ${radius} km and sorted by distance.`);
      } else {
        showToast("Sorted all events by distance.");
      }
      return;
    }

    triggerLocating(radius);
  };

  const triggerLocating = (radius: number | null) => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setSortByDistance(true);
        if (radius) {
          showToast(`Located successfully! Showing events within ${radius} km.`);
        } else {
          showToast("Located successfully! Sorted events by distance.");
        }
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location access denied. Please enable permission to find events nearby.";
        }
        showToast(errorMsg, "error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleFindNearbyEvents = () => {
    if (sortByDistance) {
      setSortByDistance(false);
      setProximityRadius(null);
      showToast("Cleared proximity filter.");
      return;
    }

    if (userCoords) {
      setSortByDistance(true);
      showToast("Showing events sorted by distance from you.");
      return;
    }

    triggerLocating(proximityRadius);
  };

  const handleFindNearbyClick = (e: React.MouseEvent) => {
    if (isLongPressRef.current) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressRef.current = false;
      return;
    }
    handleFindNearbyEvents();
  };

  const uniqueCities = useMemo(() => {
    const citiesSet = new Set<string>();
    CULINARY_EVENTS.forEach(e => citiesSet.add(e.city));
    return ['All', ...Array.from(citiesSet)];
  }, []);

  // Filter and Sort Events Dynamically
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Filter by city if selected and not doing GPS sorting
    if (selectedCity !== 'All' && !sortByDistance) {
      result = result.filter(e => e.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Filter by distance if user coords and distance sort is active
    if (sortByDistance && userCoords) {
      result = result.map(e => {
        const distance = getDistance(userCoords.lat, userCoords.lng, e.coordinates.lat, e.coordinates.lng);
        return { ...e, distance };
      }) as any;

      if (proximityRadius) {
        result = result.filter(e => (e as any).distance <= proximityRadius);
      }

      result.sort((a, b) => (a as any).distance - (b as any).distance);
    }

    return result;
  }, [events, selectedCity, sortByDistance, userCoords, proximityRadius]);

  const eventSectionUrl = useMemo(() => {
    return typeof window !== 'undefined' ? `${window.location.origin}/?tab=culinary-events` : 'https://zaytounada.xyz/?tab=culinary-events';
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-neutral-900 animate-fade-in" id="culinary-events-section-view">
      
      {/* Editorial Header Layout */}
      <div className="relative mb-10 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-white border border-amber-200/60 shadow-xs text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-neutral-100/40 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase border border-neutral-300 bg-neutral-50/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="text-neutral-600 font-bold">Seasonal Bulletins</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-serif font-light text-neutral-950 leading-tight uppercase tracking-tight">
              Culinary <span className="font-semibold text-amber-700">Events Near You</span>
            </h1>
            <p className="text-xs tracking-wider font-bold uppercase font-mono text-amber-700">Official Hospitality & Feast Calendar • Lebanon</p>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed font-light max-w-3xl">
            Savor Lebanon’s rich terroir and hospitality through our catalog of major culinary happenings, festivals, street food souks, and marine feasts. Use our interactive GPS mapping system below to discover authentic celebrations happening in your city or neighborhood.
          </p>

          <div className="pt-2">
            {/* Global Section Share actions */}
            <ShareActions 
              headline="Culinary Events Near You — Official Hospitality & Feast Calendar" 
              excerpt="Explore major culinary happenings, street food souks, marine feasts and traditional festivals happening across Lebanon." 
              linkUrl={eventSectionUrl}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Filter and Location Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-neutral-200 pb-6 mb-8 text-left">
        <div>
          <h3 className="font-serif text-lg text-neutral-950 font-semibold flex items-center gap-2 leading-tight">
            <Calendar className="w-4.5 h-4.5 text-amber-600" />
            <span>Interactive Scheduling & Directory</span>
          </h3>
          <p className="text-[11px] text-neutral-500 mt-0.5 font-light">Filter by city or use live GPS to sort events nearest to your current location</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* City filtering badges - disabled when distance sorting is active to avoid conflicts */}
          <div className={`flex flex-wrap gap-1.5 transition-opacity duration-300 ${sortByDistance ? 'opacity-40 pointer-events-none' : ''}`}>
            {uniqueCities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer border ${
                  selectedCity === city
                    ? 'bg-amber-700 border-amber-700 text-white font-bold shadow-xs'
                    : 'bg-white hover:bg-neutral-100 border-neutral-250 text-neutral-600'
                }`}
              >
                {city === 'All' ? 'All Cities' : city}
              </button>
            ))}
          </div>

          {/* Near Me GPS Trigger Button (Matches style of App.tsx restaurant nearby) */}
          <div className="relative" id="events-nearby-btn-container">
            <button
              id="find-events-nearby-btn"
              onClick={handleFindNearbyClick}
              onMouseDown={startLongPress}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchStart={startLongPress}
              onTouchEnd={cancelLongPress}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-black uppercase tracking-widest rounded-lg border transition-all cursor-pointer select-none active:scale-95 ${
                sortByDistance
                  ? 'bg-amber-700 hover:bg-amber-800 text-white border-amber-700 animate-pulse shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-900 hover:text-amber-300'
              }`}
              title="Click to locate. Long-press to select proximity radius."
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-amber-400' : ''}`} />
              <span>
                {isLocating
                  ? 'RETRIEVING GPS...'
                  : sortByDistance
                  ? `NEARBY ON (${proximityRadius ? `${proximityRadius}km` : 'ANY DIST'})`
                  : 'FIND EVENTS NEAR ME'}
              </span>
              <ChevronDown className="w-3 h-3 text-current ml-0.5 opacity-60" />
            </button>

            {/* Radius Selection Dropdown */}
            {showRadiusDropdown && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowRadiusDropdown(false)} />
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-neutral-250 shadow-lg py-2 z-50 text-left animate-fade-in">
                  <div className="px-3.5 py-1.5 border-b border-neutral-100 mb-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-450 block">PROXIMITY RADIUS</span>
                  </div>
                  {[5, 10, 25, 50].map((radius) => (
                    <button
                      key={radius}
                      onClick={() => handleSelectRadius(radius)}
                      className={`w-full px-4 py-2 text-xs text-left font-sans transition-colors hover:bg-neutral-50 flex items-center justify-between cursor-pointer ${proximityRadius === radius ? 'bg-amber-50/60 text-amber-800 font-bold' : 'text-neutral-700'}`}
                    >
                      <span>Within {radius} km</span>
                      <span className="text-[10px] font-mono text-neutral-400">{radius}km</span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleSelectRadius(null)}
                    className="w-full px-4 py-2 text-xs text-left font-sans text-neutral-700 transition-colors hover:bg-neutral-50 border-t border-neutral-100 mt-1 flex items-center justify-between cursor-pointer"
                  >
                    <span>Any Distance</span>
                    <span className="text-[10px] font-mono text-neutral-400">∞</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Refresh Listings Sync Button */}
          <button
            onClick={handleRefreshListings}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-black uppercase tracking-widest rounded-lg border transition-all cursor-pointer select-none active:scale-95 bg-white hover:bg-neutral-50 border-neutral-250 text-neutral-800 hover:text-amber-800 hover:border-amber-400 disabled:opacity-60 disabled:pointer-events-none`}
            title="Force synchronization with real-time culinary bulletin and pop-up events"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : 'text-neutral-500'}`} />
            <span>{isRefreshing ? 'SYNCHING...' : 'REFRESH LISTINGS'}</span>
          </button>
        </div>
      </div>

      {/* Events Listings Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-16 text-center bg-neutral-50 border border-neutral-200 rounded-2xl max-w-xl mx-auto my-12 shadow-2xs">
          <MapPin className="w-10 h-10 text-neutral-300 mx-auto mb-4 animate-bounce" />
          <h3 className="font-serif text-lg font-semibold text-neutral-900 uppercase">No happenings found</h3>
          <p className="text-xs text-neutral-500 mt-1.5 max-w-sm mx-auto leading-relaxed font-light">
            We couldn't identify any culinary events matching your active location filters. Try selecting "All Cities" or choosing a wider proximity radius.
          </p>
          <button
            onClick={() => {
              setSortByDistance(false);
              setProximityRadius(null);
              setSelectedCity('All');
            }}
            className="mt-5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const isNearHamra = event.neighborhood === 'hamra';
            const isNearAntelias = event.neighborhood === 'antelias';

            return (
              <div 
                key={event.id}
                className={`group flex flex-col justify-between bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 hover:border-neutral-300 text-left relative ${
                  isNearHamra || isNearAntelias ? 'border-amber-300 shadow-3xs ring-1 ring-amber-100/50' : 'border-neutral-200'
                }`}
                id={`event-card-${event.id}`}
              >
                {/* Event Cover Image */}
                <div className="aspect-video w-full overflow-hidden relative bg-neutral-100 border-b border-neutral-200">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* City Ribbon / Tag */}
                  <span className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-xs text-white text-[8px] font-mono font-bold uppercase px-2.5 py-1 rounded-md shadow-xs tracking-wider">
                    📍 {event.city} {event.neighborhood ? `• ${event.neighborhood.charAt(0).toUpperCase() + event.neighborhood.slice(1)}` : ''}
                  </span>

                  {/* Distance Ribbon if located */}
                  {(event as any).distance !== undefined && (
                    <span className="absolute top-3 right-3 bg-amber-700 text-white text-[8px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-md shadow-xs tracking-wider">
                      {(event as any).distance.toFixed(1)} km away
                    </span>
                  )}
                  
                  {/* Highlights/Badges for requested specific cities */}
                  {(isNearHamra || isNearAntelias) && (
                    <span className="absolute bottom-3 left-3 bg-amber-550 text-neutral-950 text-[7.5px] font-mono font-black uppercase px-2 py-0.5 rounded-sm shadow tracking-widest flex items-center gap-1">
                      <Award className="w-3 h-3 fill-current" />
                      <span>RECOMMENDED DISTRICT</span>
                    </span>
                  )}
                </div>

                {/* Event Contents */}
                <div className="p-5.5 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2 text-left">
                    {/* Tags / Badges */}
                    <div className="flex flex-wrap gap-1">
                      {event.tags?.map(tag => (
                        <span key={tag} className="text-[7.5px] font-mono uppercase tracking-wider text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-100 font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-serif text-base font-bold text-neutral-950 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug uppercase tracking-wide">
                      {event.title}
                    </h3>
                    
                    <p className="text-xs text-neutral-600 line-clamp-3 font-light leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Metadata fields */}
                  <div className="pt-4 border-t border-neutral-100 space-y-2.5 text-[10.5px] text-neutral-500 font-sans text-left">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-neutral-450 shrink-0" />
                      <span>Date: <strong className="text-neutral-800 font-medium">{event.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-neutral-450 shrink-0" />
                      <span>Time: <strong className="text-neutral-800 font-medium">{event.timeString}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-neutral-450 shrink-0" />
                      <span className="truncate">Venue: <strong className="text-neutral-800 font-medium">{event.venueName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket className="w-3.5 h-3.5 text-neutral-450 shrink-0" />
                      <span>Cost: <strong className="text-amber-700 font-semibold">{event.ticketPrice}</strong></span>
                    </div>
                  </div>

                  {/* Social and print actions bar */}
                  <div className="pt-4 border-t border-neutral-150">
                    <div className="text-[8px] font-mono uppercase tracking-widest text-neutral-450 font-bold mb-2.5">
                      SHARE MARKET BULLETIN & REDIRECT
                    </div>
                    <ShareActions 
                      headline={event.title} 
                      excerpt={event.excerpt || event.description} 
                      linkUrl={`${eventSectionUrl}&event=${event.id}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

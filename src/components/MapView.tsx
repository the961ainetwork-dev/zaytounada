import React, { useState, useMemo } from 'react';
import { Restaurant } from '../types';
import { RESTAURANTS } from '../data/restaurants';
import { Award, Navigation, Star, Compass, Table, Eye, DollarSign, Locate, RefreshCw, Map, Globe, Ruler } from 'lucide-react';

interface MapViewProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function MapView({
  selectedCity,
  setSelectedCity,
  onSelectRestaurant
}: MapViewProps) {
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [mapMode, setMapMode] = useState<'street' | 'satellite'>('street');

  // Measurement tool states
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number; name: string | null } | null>(null);
  const [measureEnd, setMeasureEnd] = useState<{ x: number; y: number; name: string | null } | null>(null);

  // Filter restaurants by currently selected city (or default to Beirut if "All Cities" is chosen)
  const currentCityForMap = useMemo(() => {
    if (selectedCity === 'All Cities') return 'Beirut'; // Fallback map capital
    return selectedCity;
  }, [selectedCity]);

  // Restaurants inside the active city
  const cityRestaurants = useMemo(() => {
    return RESTAURANTS.filter(r => r.city.toLowerCase() === currentCityForMap.toLowerCase());
  }, [currentCityForMap]);

  // Coordinates description based on city
  const cityMapThemes = useMemo(() => {
    switch (currentCityForMap) {
      case 'Beirut':
        return {
          bg: 'bg-neutral-50',
          title: 'Beirut Gastronomic Matrix',
          subtitle: 'Achrafieh, Mar Mikhael, Downtown & Corniche Coast',
          landmarks: [
            { name: 'Mediterranean Sea', x: 20, y: 18, type: 'river' },
            { name: 'Pigeon Rocks Raouché', x: 14, y: 56 },
            { name: 'Zaitunay Bay Club', x: 44, y: 32 },
            { name: 'Charles Helou Terminal', x: 62, y: 38 }
          ],
          terrainContours: [
            { cx: 75, cy: 65, rx: 32, ry: 24, label: "ACHRAFIEH RIDGE • 110M" },
            { cx: 75, cy: 65, rx: 20, ry: 15, label: "+95M" },
            { cx: 75, cy: 65, rx: 10, ry: 7, label: "+70M" },
            { cx: 14, cy: 56, rx: 16, ry: 11, label: "RAOUCHÉ CLIFFS • +35M" }
          ]
        };
      case 'Byblos':
        return {
          bg: 'bg-neutral-50',
          title: 'Byblos/Jbeil Waterfront Grid',
          subtitle: 'Ancient Old Souks, Citadel & Pre-historic Harbors',
          landmarks: [
            { name: 'Mediterranean Sea', x: 20, y: 20, type: 'river' },
            { name: 'Crusader Castle Citadel', x: 55, y: 45 },
            { name: 'Phoenician Port Harbor', x: 40, y: 50 },
            { name: 'Byblos Old Souk Alleys', x: 60, y: 38 }
          ],
          terrainContours: [
            { cx: 80, cy: 45, rx: 38, ry: 30, label: "BYBLOS MOUNT • 240M" },
            { cx: 80, cy: 45, rx: 26, ry: 20, label: "+180M" },
            { cx: 80, cy: 45, rx: 14, ry: 11, label: "+120M" }
          ]
        };
      case 'Batroun':
        return {
          bg: 'bg-neutral-50',
          title: 'Batroun Coastal Wave Map',
          subtitle: 'Beachfront Clubs, Phoenic Walls & Local Lemonades',
          landmarks: [
            { name: 'Mediterranean Sea', x: 20, y: 20, type: 'river' },
            { name: 'Phoenician Sea Wall', x: 30, y: 48 },
            { name: 'Makaad El Mir Lookout', x: 25, y: 60 },
            { name: 'Old Town Lemonade Square', x: 65, y: 40 }
          ],
          terrainContours: [
            { cx: 85, cy: 40, rx: 42, ry: 32, label: "BATROUN RIDGE • 190M" },
            { cx: 85, cy: 40, rx: 28, ry: 21, label: "+135M" },
            { cx: 85, cy: 40, rx: 14, ry: 11, label: "+80M" }
          ]
        };
      case 'Tripoli':
        return {
          bg: 'bg-neutral-50',
          title: 'Tripoli Sweet & Spice Map',
          subtitle: 'Ancestral Sweet Palaces, Soap Khan & Citadel of Raymond',
          landmarks: [
            { name: 'Abou Ali River Valley', x: 65, y: 40, type: 'river' },
            { name: 'Citadel of Raymond de Saint-Gilles', x: 55, y: 60 },
            { name: 'Khan Al-Saboun Soap Market', x: 48, y: 45 },
            { name: 'The Great Al-Mansouri Mosque', x: 40, y: 52 }
          ],
          terrainContours: [
            { cx: 55, cy: 60, rx: 34, ry: 28, label: "CITADEL HEIGHTS • 130M" },
            { cx: 55, cy: 60, rx: 22, ry: 18, label: "+95M" },
            { cx: 55, cy: 60, rx: 12, ry: 10, label: "+65M" }
          ]
        };
      default:
        return {
          bg: 'bg-neutral-50',
          title: `${currentCityForMap} Culinary Chart`,
          subtitle: 'Gastronomic landmark coordination map',
          landmarks: [
            { name: 'City Center', x: 50, y: 50 },
            { name: 'Historic District', x: 30, y: 35 }
          ],
          terrainContours: [
            { cx: 50, cy: 50, rx: 30, ry: 30, label: "HIGH PLAT • +120M" }
          ]
        };
    }
  }, [currentCityForMap]);

  // Active highlighted restaurant data
  const highlightedRestaurant = useMemo(() => {
    return RESTAURANTS.find(r => r.id === activePinId) || null;
  }, [activePinId]);

  // Dynamic Scale representation (meters per 1% of canvas width) for our geodesic distance tool
  const cityMetersPerUnit = useMemo(() => {
    switch (currentCityForMap) {
      case 'Beirut': return 55;
      case 'Byblos': return 28;
      case 'Batroun': return 18;
      case 'Tripoli': return 42;
      default: return 35;
    }
  }, [currentCityForMap]);

  // Snapping logic to locate and magnet-lock to nearby restaurant coordinates (within 4% visual tolerance)
  const getSnappedCoordinates = (x: number, y: number) => {
    let closestRest = null;
    let minDist = 4.0;
    cityRestaurants.forEach(r => {
      const dist = Math.sqrt(Math.pow(r.coordinates.x - x, 2) + Math.pow(r.coordinates.y - y, 2));
      if (dist < minDist) {
        minDist = dist;
        closestRest = r;
      }
    });
    if (closestRest) {
      return {
        x: (closestRest as any).coordinates.x,
        y: (closestRest as any).coordinates.y,
        name: (closestRest as any).name
      };
    }
    return { x, y, name: null };
  };

  // Click handler to set measurement markers relative to container
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMeasuring) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Snap to the nearest evaluated restaurant
    const snapped = getSnappedCoordinates(rawX, rawY);
    
    if (!measureStart || (measureStart && measureEnd)) {
      setMeasureStart(snapped);
      setMeasureEnd(null);
    } else {
      setMeasureEnd(snapped);
    }
  };

  // Compute calculated metrics
  const distanceDisplay = useMemo(() => {
    if (!measureStart || !measureEnd) return { meters: 0, km: '0.00', walkTime: 0, driveTime: 0 };
    const rawDistanceMeters = Math.sqrt(
      Math.pow(measureEnd.x - measureStart.x, 2) + Math.pow(measureEnd.y - measureStart.y, 2)
    ) * cityMetersPerUnit;
    const roundedMeters = Math.round(rawDistanceMeters);
    const kmString = (roundedMeters / 1000).toFixed(2);
    const walkMinutes = Math.max(1, Math.round(roundedMeters / 83.3));
    const driveMinutes = Math.max(1, Math.round(roundedMeters / 500));
    return {
      meters: roundedMeters,
      km: kmString,
      walkTime: walkMinutes,
      driveTime: driveMinutes
    };
  }, [measureStart, measureEnd, cityMetersPerUnit]);

  // Dynamic map background dependent on Selected Mode with topography gradients
  const bgStyle = useMemo(() => {
    if (mapMode === 'satellite') {
      return 'bg-emerald-50 bg-[radial-gradient(ellipse_at_70%_50%,_#f2fbf7_0%,_#e6f7ef_45%,_#d2f2e3_100%)]';
    }
    return cityMapThemes.bg; // bg-neutral-50
  }, [mapMode, cityMapThemes.bg]);

  // Detailed features (streets, parks) per city
  const cityDetailedFeatures = useMemo(() => {
    switch (currentCityForMap) {
      case 'Beirut':
        return {
          streets: [
            { name: 'Rue Monot / Achrafieh', x1: 50, y1: 0, x2: 50, y2: 100 },
            { name: 'Charles Helou Highway', x1: 0, y1: 42, x2: 100, y2: 42 },
            { name: 'Seaside Corniche', x1: 15, y1: 15, x2: 85, y2: 60 }
          ],
          satelliteZones: [
            { name: 'Horsh Beirut Forest', x: 44, y: 74, w: 22, h: 14, color: 'bg-emerald-100/40 border-emerald-300/30 text-emerald-800/80' },
            { name: 'Downtown Pedestrian Quarter', x: 52, y: 48, w: 10, h: 7, color: 'bg-emerald-100/30 border-emerald-300/20 text-emerald-800/80' }
          ]
        };
      case 'Byblos':
        return {
          streets: [
            { name: 'Byblos Main Seaside Road', x1: 35, y1: 0, x2: 35, y2: 100 },
            { name: 'Citadel Avenue', x1: 0, y1: 50, x2: 100, y2: 50 }
          ],
          satelliteZones: [
            { name: 'Archaeological Excavation Area', x: 55, y: 45, w: 15, h: 15, color: 'bg-emerald-100/30 border-emerald-300/20 text-emerald-800/80' }
          ]
        };
      case 'Batroun':
        return {
          streets: [
            { name: 'Batroun Old Souks Highway', x1: 50, y1: 0, x2: 50, y2: 100 },
            { name: 'Coastal Corniche Line', x1: 0, y1: 35, x2: 100, y2: 35 }
          ],
          satelliteZones: [
            { name: 'Ancient Phoenician Sea Wall Reserve', x: 28, y: 52, w: 10, h: 22, color: 'bg-sky-100/40 border-sky-305/30 text-sky-800/80' }
          ]
        };
      case 'Tripoli':
        return {
          streets: [
            { name: 'Tripoli Castle Boulevard', x1: 55, y1: 0, x2: 55, y2: 100 },
            { name: 'Mina Coastal Highway', x1: 0, y1: 40, x2: 100, y2: 40 }
          ],
          satelliteZones: [
            { name: 'Historic Grand Souk Alleys', x: 45, y: 48, w: 20, h: 15, color: 'bg-amber-100/30 border-amber-300/20 text-amber-805/85' }
          ]
        };
      default:
        return {
          streets: [
            { name: 'Main Boulevard', x1: 0, y1: 50, x2: 100, y2: 50 },
            { name: 'Central Avenue', x1: 50, y1: 0, x2: 50, y2: 100 }
          ],
          satelliteZones: [
            { name: 'Municipal Park', x: 45, y: 45, w: 10, h: 10, color: 'bg-emerald-100/40 border-emerald-300/30 text-emerald-850' }
          ]
        };
    }
  }, [currentCityForMap]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-neutral-900" id="gastronomic-map-view">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 text-left">
        <div>
          <h2 className="font-serif font-light text-3xl text-neutral-900 flex items-center gap-2">
            <Compass className="w-7 h-7 text-emerald-700 animate-spin-slow" />
            <span>Interactive Gastronomic Map</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1 tracking-wide">
            Browse coordinate spots of legendary starred eateries across world culinary capitals.
          </p>
        </div>

        {/* City Toggle Filters */}
        <div className="flex flex-wrap gap-2.5">
          {['Beirut', 'Byblos', 'Batroun', 'Tripoli'].map((city) => (
            <button
              key={city}
              onClick={() => {
                setSelectedCity(city);
                setActivePinId(null);
                setMeasureStart(null);
                setMeasureEnd(null);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded cursor-pointer transition-all border ${
                currentCityForMap === city
                  ? 'border-emerald-600 text-emerald-700 font-bold bg-white shadow-xs'
                  : 'bg-white border-neutral-250 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {city} Vector Map
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 text-left">
        {/* Left pane: Visual coordinate map container */}
        <div className="flex-1 relative bg-white border border-neutral-200 rounded-xl p-4 overflow-hidden shadow-sm flex flex-col min-h-[520px]">
          {/* Map Controls */}
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 bg-white/95 border border-neutral-200 p-3.5 rounded shadow-lg backdrop-blur-md text-left max-w-[220px]">
            <span className="text-[9px] font-mono tracking-widest text-emerald-700 uppercase font-black">Chart Status</span>
            <h3 className="font-serif font-bold text-sm text-neutral-950 leading-tight uppercase tracking-wider">
              {cityMapThemes.title}
            </h3>
            <p className="text-[10px] text-neutral-500 font-light leading-snug">
              {cityMapThemes.subtitle}
            </p>
            <div className="flex items-center gap-3 mt-2 border-t border-neutral-150 pt-2 text-[9px] font-mono uppercase tracking-wider text-neutral-600 font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={showGrid} 
                  onChange={() => setShowGrid(!showGrid)} 
                  className="rounded border-neutral-300 bg-white text-emerald-700 focus:ring-1 focus:ring-emerald-500 w-3 h-3 cursor-pointer"
                />
                <span>Gridlines</span>
              </label>
              <button 
                onClick={() => {
                  setActivePinId(null);
                  setMeasureStart(null);
                  setMeasureEnd(null);
                }} 
                className="flex items-center gap-1 hover:text-emerald-700 select-none cursor-pointer text-neutral-450 hover:text-neutral-900 transition-colors ml-auto font-bold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Geodesic Ruler Section */}
            <div className="border-t border-neutral-150 pt-2.5 space-y-2.5 mt-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-widest text-[#d97706] uppercase font-extrabold flex items-center gap-1">
                  <Ruler className="w-2.5 h-2.5" />
                  <span>Distance Ruler</span>
                </span>
                {isMeasuring && (
                  <span className="text-[7.5px] font-mono text-emerald-700 bg-emerald-50 px-1 border border-emerald-200 animate-pulse uppercase rounded font-bold">Active</span>
                )}
              </div>
              <button
                onClick={() => {
                  setIsMeasuring(!isMeasuring);
                  if (!isMeasuring) {
                    setMeasureStart(null);
                    setMeasureEnd(null);
                  }
                }}
                className={`w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded text-[9.5px] uppercase tracking-wider font-bold border transition-all cursor-pointer ${
                  isMeasuring 
                    ? 'border-amber-500 text-amber-700 bg-amber-50/50 shadow-xs' 
                    : 'border-neutral-250 text-neutral-700 hover:bg-neutral-50 bg-white'
                }`}
                id="map-measure-toggle-btn"
              >
                <span>{isMeasuring ? 'Exit Ruler Tool' : 'Activate Ruler'}</span>
              </button>
              
              {isMeasuring && (
                <div className="text-[9.5px] leading-relaxed pt-0.5 text-neutral-500 font-light space-y-1.5 min-w-[185px]">
                  {!measureStart ? (
                    <p className="text-neutral-450 italic text-[9px] font-medium">Click point A on the map to start...</p>
                  ) : !measureEnd ? (
                    <p className="text-neutral-450 italic text-[9px] animate-pulse font-medium">Click point B to calculate...</p>
                  ) : (
                    <div className="bg-neutral-50 border border-neutral-200 p-2.5 rounded space-y-1.5 font-mono text-[9px] tracking-wide text-neutral-800">
                      <div className="flex justify-between items-center text-neutral-900 border-b border-neutral-200 pb-1">
                        <span className="text-amber-700 font-black uppercase text-[8px]">GEODESIC METRICS</span>
                        <button 
                          onClick={() => { setMeasureStart(null); setMeasureEnd(null); }} 
                          className="text-[8px] text-neutral-400 hover:text-neutral-700 cursor-pointer font-bold"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="mt-1">
                        <p className="font-serif text-[13px] font-black text-neutral-950 tracking-normal flex items-baseline gap-1">
                          {distanceDisplay.km} km <span className="text-[9px] font-mono text-neutral-400 font-normal">({distanceDisplay.meters} m)</span>
                        </p>
                      </div>
                      <div className="text-neutral-600 text-[8.5px] flex flex-col gap-0.5 mt-1 border-t border-neutral-200 pt-1.5 uppercase font-bold">
                        <p>🚶 Walking: ~{distanceDisplay.walkTime} mins</p>
                        <p>🚗 Driving: ~{distanceDisplay.driveTime} mins</p>
                      </div>
                      <div className="text-[8px] text-neutral-500 border-t border-neutral-200 pt-1.5 flex flex-col gap-0.5 mt-1 font-light font-sans">
                        <div className="truncate"><span className="font-bold text-amber-700">A</span>: {measureStart.name || `Point (${Math.round(measureStart.x)}%, ${Math.round(measureStart.y)}%)`}</div>
                        <div className="truncate"><span className="font-bold text-red-600">B</span>: {measureEnd.name || `Point (${Math.round(measureEnd.x)}%, ${Math.round(measureEnd.y)}%)`}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Permanent Map Legend */}
          <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2.5 bg-white/95 border border-neutral-200 p-3.5 rounded shadow-lg backdrop-blur-md text-left min-w-[205px] max-w-[225px]" id="restaurant-map-legend">
            <span className="text-[9px] font-mono tracking-widest text-emerald-800 uppercase font-black select-none">Zaytounada Legend</span>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-6 h-6 rounded-full bg-emerald-700 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-sm text-white transition-all duration-300 hover:scale-120 hover:shadow-md hover:translate-y-[-2px] hover:ring-2 hover:ring-amber-400 active:scale-95 cursor-pointer select-none">
                  <span className="font-bold text-[10px] leading-none mb-0.5 select-none text-amber-300">✻</span>
                </div>
                <div>
                  <h4 className="text-[9.5px] uppercase font-bold font-mono text-neutral-900 leading-none">Zaytounada Star</h4>
                  <p className="text-[8.5px] text-neutral-500 font-light mt-0.5 leading-tight">Elite cuisine of excellent status.</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-6 h-6 rounded-full bg-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-sm text-white transition-all duration-300 hover:scale-120 hover:shadow-md hover:translate-y-[-2px] hover:ring-2 hover:ring-emerald-600 active:scale-95 cursor-pointer select-none">
                  <span className="text-white text-xs font-bold font-sans select-none">☺</span>
                </div>
                <div>
                  <h4 className="text-[9.5px] uppercase font-bold font-mono text-neutral-900 leading-none">Bib Gourmand</h4>
                  <p className="text-[8.5px] text-neutral-500 font-light mt-0.5 leading-tight">High value cooking, moderate prices.</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700/20 flex items-center justify-center shrink-0 shadow-sm text-white transition-all duration-300 hover:scale-120 hover:shadow-md hover:translate-y-[-2px] hover:ring-2 hover:ring-amber-400 active:scale-95 cursor-pointer select-none">
                  <span className="text-white text-[9px] font-bold font-serif select-none">Z</span>
                </div>
                <div>
                  <h4 className="text-[9.5px] uppercase font-bold font-mono text-neutral-900 leading-none">Selected Table</h4>
                  <p className="text-[8.5px] text-neutral-500 font-light mt-0.5 leading-tight">Representative venue of certified culinary merit.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Compass Rose in bottom right */}
          <div className="absolute bottom-6 right-6 z-10 pointer-events-none opacity-30">
            <div className="relative w-24 h-24 border border-neutral-300 rounded-full flex items-center justify-center animate-spin-slow text-neutral-400">
              <span className="absolute top-1 text-[10px] font-bold font-mono">N</span>
              <span className="absolute bottom-1 text-[10px] font-bold font-mono">S</span>
              <span className="absolute left-1 text-[10px] font-bold font-mono">W</span>
              <span className="absolute right-1 text-[10px] font-bold font-mono">E</span>
              <div className="w-0.5 h-full bg-neutral-200" />
              <div className="h-0.5 w-full bg-neutral-200" />
            </div>
          </div>

          {/* Actual 2D Interactive Canvas Layer */}
          <div 
            onClick={handleMapClick}
            className={`relative flex-1 rounded-lg overflow-hidden border border-neutral-200 ${bgStyle} transition-all duration-300 min-h-[460px] ${isMeasuring ? 'cursor-crosshair' : ''}`}
          >
            
            {/* Map Mode Toggles inside Canvas */}
            <div className="absolute top-4 right-4 z-30 flex bg-white/95 border border-neutral-250 p-1 rounded backdrop-blur-md shadow-xs" id="map-mode-selector">
              <button
                onClick={(e) => { e.stopPropagation(); setMapMode('street'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest font-extrabold transition-all cursor-pointer rounded ${
                  mapMode === 'street'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title="Toggle Street Vector Grid"
                id="btn-street-mode"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Street</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setMapMode('satellite'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest font-extrabold transition-all cursor-pointer rounded ${
                  mapMode === 'satellite'
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title="Toggle Orbital Satellite View"
                id="btn-satellite-mode"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Satellite</span>
              </button>
            </div>

            {/* Map Imagery Mesh Layer */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-500"
              style={{
                filter: mapMode === 'satellite' 
                  ? 'contrast(1.08) saturate(1.10) brightness(0.96)' 
                  : 'none'
              }}
            >
              {/* Visual River Simulation */}
              {cityMapThemes.landmarks.find(l => l.type === 'river') && (
                <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 blur-[2px] border-y transform -rotate-12 pointer-events-none flex items-center justify-center transition-all ${
                  mapMode === 'satellite'
                    ? 'bg-sky-100/60 border-sky-300/40'
                    : 'bg-indigo-50 border-indigo-100'
                }`}>
                  <span className={`font-serif italic text-xs tracking-widest uppercase font-black transition-colors ${
                    mapMode === 'satellite'
                      ? 'text-sky-600/50'
                      : 'text-indigo-650/40'
                  }`}>
                    {cityMapThemes.landmarks.find(l => l.type === 'river')?.name}
                  </span>
                </div>
              )}

              {/* Detailed Street Mode Overlays */}
              {mapMode === 'street' && (
                <>
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {cityDetailedFeatures.streets.map((street, idx) => (
                      <g key={idx}>
                        <line 
                          x1={`${street.x1}%`} 
                          y1={`${street.y1}%`} 
                          x2={`${street.x2}%`} 
                          y2={`${street.y2}%`} 
                          className="stroke-neutral-250" 
                          strokeWidth="1.2" 
                          strokeDasharray="4,6"
                        />
                      </g>
                    ))}
                  </svg>
                  {/* Street labels */}
                  <div className="absolute inset-0 pointer-events-none">
                    {cityDetailedFeatures.streets.map((street, idx) => (
                      <div
                        key={idx}
                        style={{ 
                          left: `${(street.x1 + street.x2) / 2}%`, 
                          top: `${(street.y1 + street.y2) / 2 - 2}%` 
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 text-[7.5px] font-mono tracking-widest text-neutral-400 uppercase select-none whitespace-nowrap transform rotate-6 font-bold"
                      >
                        {street.name}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Detailed Satellite Mode Overlays */}
              {mapMode === 'satellite' && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Terrain Shade & Shading Variation Underlay simulating elevation depth */}
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 transition-all duration-300"
                    style={{
                      backgroundImage: `
                        radial-gradient(ellipse at 70% 50%, rgba(16, 185, 129, 0.45) 0%, transparent 60%),
                        radial-gradient(ellipse at 25% 60%, rgba(52, 211, 153, 0.2) 0%, transparent 45%),
                        repeating-linear-gradient(45deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 12px, rgba(16, 185, 129, 0.04) 13px, rgba(16, 185, 129, 0.04) 14px),
                        linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(0, 0, 0, 0.55) 100%)
                      `
                    }}
                  />

                  {/* Topographic Contour Lines SVG using viewBox scaling for elevation mapping */}
                  <svg 
                    viewBox="0 0 100 100" 
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-50 text-emerald-600/30"
                  >
                    {cityMapThemes.terrainContours?.map((contour: any, idx: number) => (
                      <g key={idx}>
                        <ellipse
                          cx={contour.cx}
                          cy={contour.cy}
                          rx={contour.rx}
                          ry={contour.ry}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.25"
                          strokeDasharray="1, 1.5"
                        />
                        <text
                          x={contour.cx}
                          y={contour.cy - contour.ry + 1.2}
                          fill="rgba(5, 150, 105, 0.75)"
                          fontSize="1.5"
                          fontFamily="monospace"
                          textAnchor="middle"
                          letterSpacing="0.05em"
                          className="font-bold select-none"
                        >
                          {contour.label}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {/* Satellite Zones */}
                  {cityDetailedFeatures.satelliteZones.map((zone, idx) => (
                    <div
                      key={idx}
                      style={{ 
                        left: `${zone.x}%`, 
                        top: `${zone.y}%`,
                        width: `${zone.w}%`,
                        height: `${zone.h}%`
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded border ${zone.color} flex items-center justify-center p-1 overflow-hidden`}
                    >
                      <span className="text-[7.5px] font-mono tracking-widest text-emerald-600/80 uppercase whitespace-nowrap font-bold">
                        {zone.name}
                      </span>
                    </div>
                  ))}
                  {/* Simulated orbital HUD indicators */}
                  <div className="absolute bottom-16 left-4 text-[7px] font-mono text-emerald-600/60 flex flex-col items-start gap-0.5 select-none uppercase tracking-wider font-semibold">
                    <span>ORBIT: HIGH-RES GSD 0.1M</span>
                    <span>SPECTRAL: VIS + NIR IN SPECTRUM</span>
                    <span>SURFACE: RECON ACQUISITION TRUE</span>
                  </div>
                </div>
              )}

              {/* Coordinate Grid lines */}
              {showGrid && (
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none opacity-50">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-neutral-250 font-mono text-[7px] text-neutral-400 p-1" />
                  ))}
                </div>
              )}
            </div>

            {/* Static Visual Scale Bar */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-col items-start gap-1 select-none pointer-events-none bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-sm border border-neutral-250 shadow-xs" id="map-scale-bar">
              <span className="font-mono text-[8.5px] text-neutral-800 tracking-widest uppercase font-bold">
                SCALE: {10 * cityMetersPerUnit}m
              </span>
              <div className="w-[72px] h-1 border-b border-x border-neutral-400 flex justify-between">
                <div className="w-[0.5px] h-0.5 bg-neutral-400" />
                <div className="w-[0.5px] h-0.5 bg-neutral-400" />
              </div>
            </div>

            {/* Simulated Landmarks Text Markers */}
            {cityMapThemes.landmarks.filter((l: any) => !l.type).map((landmark: any, i: number) => (
              <div
                key={i}
                style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 font-serif italic text-[11px] font-bold text-center select-none z-10"
              >
                ⋄ {landmark.name}
              </div>
            ))}

            {/* Geodesic Ruler Measurement SVG overlay */}
            {isMeasuring && measureStart && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                <defs>
                  <linearGradient id="rulerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.95" />
                  </linearGradient>
                </defs>
                {/* Point A outer glow pulse */}
                <circle 
                  cx={`${measureStart.x}%`} 
                  cy={`${measureStart.y}%`} 
                  r="10" 
                  className="fill-amber-500/15 stroke-amber-500/40 stroke-1 animate-pulse" 
                />
                <circle 
                  cx={`${measureStart.x}%`} 
                  cy={`${measureStart.y}%`} 
                  r="4" 
                  className="fill-amber-500 stroke-white stroke-[1.5]" 
                />
                {/* Point A text tag */}
                <text
                  x={`${measureStart.x}%`}
                  y={`${measureStart.y - 3}%`}
                  fill="#d97706"
                  fontSize="9.5"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="font-bold tracking-wider select-none"
                >
                  [A]
                </text>
                
                {measureEnd && (
                  <>
                    {/* Geodesic Connecting Vector line */}
                    <line 
                      x1={`${measureStart.x}%`} 
                      y1={`${measureStart.y}%`} 
                      x2={`${measureEnd.x}%`} 
                      y2={`${measureEnd.y}%`} 
                      stroke="url(#rulerGradient)"
                      strokeWidth="2.5" 
                      strokeDasharray="4,4"
                      className="opacity-95"
                    />
                    {/* Point B outer glow pulse */}
                    <circle 
                      cx={`${measureEnd.x}%`} 
                      cy={`${measureEnd.y}%`} 
                      r="10" 
                      className="fill-red-500/15 stroke-red-500/40 stroke-1 animate-pulse" 
                    />
                    <circle 
                      cx={`${measureEnd.x}%`} 
                      cy={`${measureEnd.y}%`} 
                      r="4" 
                      className="fill-red-505 stroke-white stroke-[1.5]" 
                    />
                    {/* Point B text tag */}
                    <text
                      x={`${measureEnd.x}%`}
                      y={`${measureEnd.y - 3}%`}
                      fill="#ef4444"
                      fontSize="9.5"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="font-bold tracking-wider select-none"
                    >
                      [B] {distanceDisplay.km} km
                    </text>
                  </>
                )}
              </svg>
            )}

            {/* Restaurant Marker Pins */}
            {cityRestaurants.map((restaurant) => {
              const isActive = activePinId === restaurant.id;
              
              const isBibGourmand = restaurant.distinction === 'BIB_GOURMAND';
              const isStar = restaurant.stars > 0;

              return (
                <div
                  key={restaurant.id}
                  style={{ left: `${restaurant.coordinates.x}%`, top: `${restaurant.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={(e) => {
                      if (!isMeasuring) {
                        setActivePinId(isActive ? null : restaurant.id);
                      }
                    }}
                    className={`group relative flex items-center justify-center rounded-full shadow-md transition-all duration-300 pointer-events-auto transform hover:scale-125 cursor-pointer ${
                      isActive 
                        ? 'w-10 h-10 bg-emerald-800 border-2 border-amber-400 z-30 scale-110 text-white' 
                        : isStar 
                          ? 'w-8.5 h-8.5 bg-emerald-700 hover:bg-emerald-800 border border-white/40 text-white shadow-xs' 
                          : isBibGourmand
                            ? 'w-8 h-8 bg-amber-600 hover:bg-amber-700 border border-white/30 text-white shadow-xs'
                            : 'w-7 h-7 bg-neutral-900 hover:bg-black border border-white/20 text-white/95 shadow-xs'
                    }`}
                    id={`pin-${restaurant.id}`}
                  >
                    {/* Icon contents for pins */}
                    {isStar ? (
                      <span className="text-amber-300 font-bold text-[10px] leading-none mb-0.5">✻</span>
                    ) : isBibGourmand ? (
                      <span className="text-white text-xs font-bold font-sans">☺</span>
                    ) : (
                      <span className="text-white text-[9px] font-bold font-serif">Z</span>
                    )}

                    {/* Tooltip Hover Label */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-mono uppercase tracking-wider rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-45">
                      {restaurant.name} ({restaurant.stars > 0 ? `${restaurant.stars}★` : 'Bib'})
                    </span>
                  </button>
                </div>
              );
            })}

            {/* Interactive Float Popup Teaser Card (When pin is active/clicked) */}
            {highlightedRestaurant && (
              <div 
                className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white/95 backdrop-blur-md border border-neutral-250 shadow-xl rounded-xl p-4 z-30 animate-fade-in text-left text-neutral-900"
                id="map-floating-popup"
              >
                <div className="flex gap-3">
                  {/* Photo mini thumbnail */}
                  <img
                    src={highlightedRestaurant.imageUrl}
                    alt={highlightedRestaurant.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-neutral-200 grayscale-30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[8px] tracking-wider font-mono text-neutral-450 uppercase font-bold">
                        {highlightedRestaurant.cuisine}
                      </span>
                      {highlightedRestaurant.stars > 0 ? (
                        <span className="text-red-655 font-serif text-xs font-black shrink-0">
                          {Array.from({ length: highlightedRestaurant.stars }).map(() => '✻').join('')}
                        </span>
                      ) : highlightedRestaurant.distinction === 'BIB_GOURMAND' ? (
                        <span className="text-amber-600 text-[10px] font-bold">☺ Bib</span>
                      ) : (
                        <span className="text-neutral-500 text-[9px] uppercase font-bold font-mono">Selected</span>
                      )}
                    </div>
                    <h4 className="font-serif font-black text-sm text-neutral-950 mt-1 uppercase tracking-wide truncate leading-tight">
                      {highlightedRestaurant.name}
                    </h4>
                    <p className="text-[10px] text-neutral-600 mt-0.5 font-light truncate">
                      Chef {highlightedRestaurant.chef}
                    </p>
                    <p className="text-[10px] text-neutral-500 italic line-clamp-1 mt-1 font-serif font-light">
                      "{highlightedRestaurant.inspectorNote}"
                    </p>
                  </div>
                </div>

                {/* Micro Actions */}
                <div className="mt-3.5 pt-3 border-t border-neutral-150 flex items-center justify-between text-[9px] font-mono tracking-wider">
                  <span className="text-neutral-400 font-bold">Y: {highlightedRestaurant.coordinates.y} X: {highlightedRestaurant.coordinates.x}</span>
                  <button
                    onClick={() => onSelectRestaurant(highlightedRestaurant)}
                    className="flex items-center gap-1 font-extrabold text-red-655 hover:text-red-700 transition-colors select-none cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read Report & Book</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right pane: List sidebar of active city establishments */}
        <div className="w-full lg:w-80 flex flex-col gap-4 text-left">
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm flex flex-col">
            <h3 className="font-serif font-black text-base text-neutral-950 flex items-center gap-2 uppercase tracking-wide">
              <Table className="w-4.5 h-4.5 text-emerald-700" />
              <span>{currentCityForMap} Guide</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed font-light font-sans">
              Click on a restaurant in {currentCityForMap} to center and select its digital map coordinate pin.
            </p>

            <div className="space-y-2 mt-4 max-h-[380px] overflow-y-auto pr-1 text-left">
              {cityRestaurants.map((restaurant) => {
                const isSelected = activePinId === restaurant.id;
                return (
                  <button
                    key={restaurant.id}
                    onClick={() => setActivePinId(restaurant.id)}
                    className={`w-full text-left p-2.5 rounded border transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-305 text-emerald-950 font-bold'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300 text-neutral-800'
                    }`}
                  >
                    {/* Circle icon with stars or marker */}
                    <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center shrink-0 font-bold transition-colors ${
                      isSelected 
                        ? 'bg-emerald-700 text-white' 
                        : 'bg-neutral-100 text-neutral-550 border border-neutral-200'
                    }`}>
                      {restaurant.stars > 0 ? (
                        <span className={`text-xs font-bold leading-none mb-0.5 ${isSelected ? 'text-amber-350' : 'text-emerald-700'}`}>✻</span>
                      ) : restaurant.distinction === 'BIB_GOURMAND' ? (
                        <span className={`text-xs font-sans ${isSelected ? 'text-white' : 'text-amber-600'}`}>☺</span>
                      ) : (
                        <span className="text-xs font-serif font-bold leading-none">Z</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[8px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                          {restaurant.cuisine}
                        </span>
                        {restaurant.stars > 0 && (
                          <span className="text-amber-600 font-serif text-[9px] font-black">
                            {restaurant.stars}✻
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif font-black text-xs truncate text-neutral-950 uppercase tracking-wide mt-0.5">
                        {restaurant.name}
                      </h4>
                      <p className="text-[9px] text-neutral-450 truncate font-mono font-light">
                        {restaurant.address.split(',')[0]}
                      </p>
                    </div>
                  </button>
                );
              })}
              {cityRestaurants.length === 0 && (
                <div className="text-center py-8 text-xs font-serif italic text-neutral-400 font-light">
                  No registered evaluations in {currentCityForMap} for this guide edition.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { LocationPoint, JourneyOption, UserAppSettings } from '../types';
import { POPULAR_LOCATIONS } from '../data/singaporeTransitData';
import { searchSingaporeLocations, calculateSingaporeRoutes } from '../services/apiService';
import { 
  Crosshair, 
  MapPin, 
  Clock, 
  Search, 
  Home, 
  Briefcase, 
  Plane, 
  ShoppingBag, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Footprints, 
  Train, 
  Bus, 
  Sparkles, 
  ArrowLeft, 
  Leaf, 
  Navigation,
  RefreshCw
} from 'lucide-react';

interface JourneyPlannerProps {
  onRouteSelected: (route: JourneyOption | null, origin: LocationPoint, destination: LocationPoint) => void;
  selectedRoute: JourneyOption | null;
  settings: UserAppSettings;
  onSetMapFocus: (lat: number, lng: number, zoom?: number) => void;
}

export const JourneyPlanner: React.FC<JourneyPlannerProps> = ({
  onRouteSelected,
  selectedRoute,
  settings,
  onSetMapFocus,
}) => {
  const [origin, setOrigin] = useState<LocationPoint>(POPULAR_LOCATIONS[0]); // Current Location
  const [destination, setDestination] = useState<LocationPoint | null>(null);
  
  const [originInput, setOriginInput] = useState('Current Location');
  const [destInput, setDestInput] = useState('');
  
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);
  
  const [originSuggestions, setOriginSuggestions] = useState<LocationPoint[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationPoint[]>([]);
  
  const [departureTimePref, setDepartureTimePref] = useState('Leave Now');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedRoutes, setCalculatedRoutes] = useState<JourneyOption[]>([]);
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'fastest' | 'bus' | 'mrt'>('all');

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Autocomplete search handlers
  useEffect(() => {
    if (isSearchingOrigin) {
      searchSingaporeLocations(originInput).then((res) => {
        setOriginSuggestions(res);
      });
    }
  }, [originInput, isSearchingOrigin]);

  useEffect(() => {
    if (isSearchingDest) {
      searchSingaporeLocations(destInput).then((res) => {
        setDestSuggestions(res);
      });
    }
  }, [destInput, isSearchingDest]);

  // Click outside suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setIsSearchingOrigin(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setIsSearchingDest(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchRoutes = async (targetDest?: LocationPoint) => {
    const destToUse = targetDest || destination;
    if (!destToUse) {
      // Default to Work (MBFC) if none entered
      const defaultDest = POPULAR_LOCATIONS[2];
      setDestination(defaultDest);
      setDestInput(defaultDest.name);
      executeRouteSearch(origin, defaultDest);
      return;
    }

    executeRouteSearch(origin, destToUse);
  };

  const executeRouteSearch = async (from: LocationPoint, to: LocationPoint) => {
    setIsCalculating(true);
    setIsSearchingOrigin(false);
    setIsSearchingDest(false);

    try {
      const fromLat = from && typeof from.lat === 'number' && isFinite(from.lat) ? from.lat : 1.3546;
      const fromLng = from && typeof from.lng === 'number' && isFinite(from.lng) ? from.lng : 103.9422;
      const toLat = to && typeof to.lat === 'number' && isFinite(to.lat) ? to.lat : 1.2798;
      const toLng = to && typeof to.lng === 'number' && isFinite(to.lng) ? to.lng : 103.8539;

      const safeFrom: LocationPoint = { ...from, lat: fromLat, lng: fromLng };
      const safeTo: LocationPoint = { ...to, lat: toLat, lng: toLng };

      const routes = await calculateSingaporeRoutes(safeFrom, safeTo, departureTimePref, settings.concessionType);
      setCalculatedRoutes(routes);
      setActiveRouteIndex(0);
      onRouteSelected(routes[0], safeFrom, safeTo);
      onSetMapFocus((fromLat + toLat) / 2, (fromLng + toLng) / 2, 13);
    } catch {
      // route calculation fallback
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSelectQuickAction = (loc: LocationPoint) => {
    setDestination(loc);
    setDestInput(loc.name);
    executeRouteSearch(origin, loc);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos?.coords?.latitude;
          const lng = pos?.coords?.longitude;
          if (typeof lat !== 'number' || !isFinite(lat) || typeof lng !== 'number' || !isFinite(lng)) {
            setOrigin(POPULAR_LOCATIONS[0]);
            setOriginInput('Current Location');
            return;
          }
          const loc: LocationPoint = {
            id: 'geo_current',
            name: 'GPS Current Location',
            detail: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
            lat: lat,
            lng: lng,
            type: 'current',
          };
          setOrigin(loc);
          setOriginInput('Current Location');
          onSetMapFocus(lat, lng, 15);
        },
        () => {
          // fallback to default Singapore Tampines location
          setOrigin(POPULAR_LOCATIONS[0]);
          setOriginInput('Current Location');
        }
      );
    }
  };

  const filteredRoutes = calculatedRoutes.filter((r) => {
    if (activeFilter === 'fastest') return r.tags.includes('Fastest');
    if (activeFilter === 'bus') return r.legs.some((l) => l.mode === 'BUS');
    if (activeFilter === 'mrt') return r.legs.some((l) => l.mode === 'MRT');
    return true;
  });

  return (
    <section
      id="journey-planner-panel"
      className="w-full h-full bg-white border-4 border-slate-900 rounded-3xl bento-shadow-md flex flex-col relative z-30 overflow-y-auto select-none"
    >
      {/* Route Results Mode */}
      {calculatedRoutes.length > 0 && destination ? (
        <div className="p-4 md:p-6 flex flex-col h-full space-y-4 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
            <button
              id="btn-back-planner"
              onClick={() => {
                setCalculatedRoutes([]);
                onRouteSelected(null, origin, destination);
              }}
              className="flex items-center gap-1.5 text-xs font-black text-slate-800 hover:text-blue-600 uppercase tracking-wider py-1.5 px-3 rounded-xl bg-slate-100 border-2 border-slate-900 bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Edit Trip
            </button>
            <div className="text-right">
              <span className="text-[11px] font-black text-slate-900 uppercase bg-amber-400 border-2 border-slate-900 px-2.5 py-1 rounded-xl bento-shadow-sm">
                ⚡ OneMap SG Live
              </span>
            </div>
          </div>

          {/* Journey Header Card */}
          <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 space-y-2 bento-shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-900 font-black">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border border-slate-900" />
              <span className="truncate">{origin.name}</span>
              <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="w-3 h-3 rounded-full bg-rose-500 border border-slate-900" />
              <span className="truncate">{destination.name}</span>
            </div>
            <p className="text-xs font-bold text-slate-500">
              Departure: {departureTimePref} • Concession: {settings.concessionType}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(['all', 'fastest', 'mrt', 'bus'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white border-slate-900 bento-shadow-sm'
                    : 'bg-white border-slate-900 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {filter === 'all' ? 'All Routes' : filter === 'fastest' ? '⚡ Fastest' : filter === 'mrt' ? '🚇 MRT Only' : '🚌 Bus Direct'}
              </button>
            ))}
          </div>

          {/* Route Options List */}
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {filteredRoutes.map((route, idx) => {
              const isSelected = activeRouteIndex === idx;
              return (
                <div
                  key={route.id}
                  onClick={() => {
                    setActiveRouteIndex(idx);
                    onRouteSelected(route, origin, destination);
                  }}
                  className={`border-3 rounded-2xl p-4 cursor-pointer transition-all duration-100 ${
                    isSelected
                      ? 'bg-blue-50 border-slate-900 bento-shadow translate-x-0.5'
                      : 'bg-white border-slate-900 bento-shadow-sm hover:bento-shadow'
                  }`}
                >
                  {/* Top line: Tags & Fare */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-1.5 flex-wrap">
                      {route.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-amber-400 text-slate-900 border border-slate-900"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-base font-black text-slate-900">
                      ${route.fare.toFixed(2)}
                    </span>
                  </div>

                  {/* Hero Timing Display */}
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[32px] font-black text-slate-900 tracking-tight leading-none">
                        {route.totalDurationMins}
                      </span>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">MINS</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-300">
                      {route.departureTime} – {route.arrivalTime}
                    </span>
                  </div>

                  {/* Mode Visualizer Legs */}
                  <div className="flex items-center gap-1.5 my-3 overflow-x-auto py-1">
                    {route.legs.map((leg, lIdx) => (
                      <React.Fragment key={lIdx}>
                        {leg.mode === 'WALK' && (
                          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-xs font-black text-slate-800 border border-slate-900 flex-shrink-0 bento-shadow-sm">
                            <Footprints className="w-3.5 h-3.5" />
                            <span>{leg.durationMins}m</span>
                          </div>
                        )}
                        {leg.mode === 'MRT' && (
                          <div
                            style={{ backgroundColor: leg.lineColor || '#005ec4' }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black text-white border border-slate-900 shadow-sm flex-shrink-0 bento-shadow-sm"
                          >
                            <Train className="w-3.5 h-3.5" />
                            <span>{leg.line || 'MRT'}</span>
                          </div>
                        )}
                        {leg.mode === 'BUS' && (
                          <div className="flex items-center gap-1.5 bg-blue-600 px-2.5 py-1 rounded-lg text-xs font-black text-white border border-slate-900 shadow-sm flex-shrink-0 bento-shadow-sm">
                            <Bus className="w-3.5 h-3.5" />
                            <span>Bus {leg.serviceNo}</span>
                          </div>
                        )}
                        {lIdx < route.legs.length - 1 && (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Secondary Metrics */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] font-bold text-slate-600">
                    <span>{route.totalDistanceKm} km</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-black">
                      <Leaf className="w-3 h-3" />
                      -{route.co2SavingsKg}kg CO₂
                    </span>
                    <span className="text-blue-700 font-black">{route.caloriesBurned} kcal burned</span>
                  </div>

                  {/* Expanded Step-by-Step details if selected */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t-2 border-slate-200 space-y-3">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        Turn-by-Turn Transit Directions
                      </p>
                      {route.legs.map((leg, legIndex) => (
                        <div key={legIndex} className="relative pl-6 pb-2 text-xs space-y-1">
                          {/* Dot & Line connector */}
                          <div
                            className="absolute left-1 top-1 w-3 h-3 rounded-full border border-slate-900"
                            style={{
                              backgroundColor:
                                leg.mode === 'MRT'
                                  ? leg.lineColor || '#005ec4'
                                  : leg.mode === 'BUS'
                                  ? '#2563eb'
                                  : '#94a3b8',
                            }}
                          />
                          {legIndex < route.legs.length - 1 && (
                            <div className="absolute left-[7px] top-4 w-0.5 h-full bg-slate-300" />
                          )}
                          <div className="flex items-center justify-between">
                            <span className="font-black text-slate-900">
                              {leg.mode === 'WALK'
                                ? 'Walk'
                                : leg.mode === 'MRT'
                                ? `Board MRT (${leg.line})`
                                : `Board Bus ${leg.serviceNo}`}
                            </span>
                            <span className="font-bold text-slate-500">{leg.durationMins} mins</span>
                          </div>
                          <p className="text-slate-700 font-medium">{leg.instructions}</p>
                          {leg.passedStops && leg.passedStops.length > 0 && (
                            <p className="text-[10px] text-slate-500 font-medium">
                              Passes {leg.numStops || leg.passedStops.length} stops: {leg.passedStops.slice(0, 3).join(' → ')}...
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Planner Form View */
        <div className="p-4 md:p-6 flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="mb-5">
              <h2 className="text-2xl font-black uppercase italic text-slate-900 tracking-tight">
                Plan Your Journey
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Real-time routing & fare calculation
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchRoutes();
              }}
              className="space-y-3.5"
            >
              {/* Start Point Input with timeline connection */}
              <div ref={originRef} className="relative flex items-center group">
                <div className="absolute left-3.5 flex flex-col items-center z-20">
                  <Crosshair className="w-4 h-4 text-emerald-600" />
                </div>
                <input
                  id="input-start-point"
                  type="text"
                  value={originInput}
                  onChange={(e) => {
                    setOriginInput(e.target.value);
                    setIsSearchingOrigin(true);
                  }}
                  onFocus={() => setIsSearchingOrigin(true)}
                  placeholder="Start Point"
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-2xl py-3 pl-11 pr-11 text-slate-900 text-sm font-bold focus:bg-white focus:border-blue-600 focus:outline-none bento-shadow-sm transition-colors placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="absolute right-3.5 text-slate-500 hover:text-blue-600 transition-colors z-20"
                  title="Use current GPS location"
                >
                  <Navigation className="w-4 h-4" />
                </button>

                {/* Origin Autocomplete Suggestions */}
                {isSearchingOrigin && originSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-[52px] z-50 bg-white border-3 border-slate-900 rounded-2xl bento-shadow-md max-h-60 overflow-y-auto divide-y-2 divide-slate-100 p-1">
                    {originSuggestions.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => {
                          setOrigin(loc);
                          setOriginInput(loc.name);
                          setIsSearchingOrigin(false);
                        }}
                        className="p-2.5 hover:bg-amber-100 rounded-xl cursor-pointer flex items-center gap-3 text-left transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-black text-slate-900">{loc.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium truncate">{loc.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input */}
              <div ref={destRef} className="relative flex items-center group">
                <div className="absolute left-3.5 flex flex-col items-center z-20">
                  <MapPin className="w-4 h-4 text-rose-500" />
                </div>
                <input
                  id="input-destination-point"
                  type="text"
                  value={destInput}
                  onChange={(e) => {
                    setDestInput(e.target.value);
                    setIsSearchingDest(true);
                  }}
                  onFocus={() => setIsSearchingDest(true)}
                  placeholder="Where to? (e.g. Marina Bay, Tampines)"
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-2xl py-3 pl-11 pr-4 text-slate-900 text-sm font-bold focus:bg-white focus:border-blue-600 focus:outline-none bento-shadow-sm transition-colors placeholder:text-slate-400"
                />

                {/* Destination Autocomplete Suggestions */}
                {isSearchingDest && destSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-[52px] z-50 bg-white border-3 border-slate-900 rounded-2xl bento-shadow-md max-h-60 overflow-y-auto divide-y-2 divide-slate-100 p-1">
                    {destSuggestions.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => {
                          setDestination(loc);
                          setDestInput(loc.name);
                          setIsSearchingDest(false);
                        }}
                        className="p-2.5 hover:bg-amber-100 rounded-xl cursor-pointer flex items-center gap-3 text-left transition-colors"
                      >
                        <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-black text-slate-900">{loc.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium truncate">{loc.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Departure Time */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <select
                    id="select-departure-time"
                    value={departureTimePref}
                    onChange={(e) => setDepartureTimePref(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border-2 border-slate-900 rounded-2xl py-2.5 pl-4 pr-10 text-slate-900 text-xs font-black focus:outline-none focus:bg-white bento-shadow-sm cursor-pointer"
                  >
                    <option value="Leave Now">Leave Now</option>
                    <option value="Depart in 15 mins">Depart in 15 mins</option>
                    <option value="Arrive by 08:30 AM (Peak)">Arrive by 08:30 AM (Peak)</option>
                    <option value="Arrive by 09:00 AM">Arrive by 09:00 AM</option>
                  </select>
                  <Clock className="w-4 h-4 absolute right-3.5 top-3 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Search Action Button */}
              <button
                id="btn-search-routes"
                type="submit"
                disabled={isCalculating}
                className="w-full bg-blue-600 border-2 border-slate-900 text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-2xl bento-shadow-sm hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Calculating OneMap Routing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-white" />
                    <span>Search Routes</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Actions Bento Grid */}
            <div className="mt-6">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3">
                Quick Shortcuts
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Home */}
                <button
                  id="btn-quick-home"
                  type="button"
                  onClick={() => handleSelectQuickAction(POPULAR_LOCATIONS[1])}
                  className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3 flex flex-col gap-1.5 hover:bg-amber-100 transition-all text-left group cursor-pointer bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <div className="flex items-center justify-between w-full">
                    <Home className="w-4 h-4 text-blue-600" />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Home</p>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Tampines Ave 4</p>
                  </div>
                </button>

                {/* Work */}
                <button
                  id="btn-quick-work"
                  type="button"
                  onClick={() => handleSelectQuickAction(POPULAR_LOCATIONS[2])}
                  className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3 flex flex-col gap-1.5 hover:bg-amber-100 transition-all text-left group cursor-pointer bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <div className="flex items-center justify-between w-full">
                    <Briefcase className="w-4 h-4 text-rose-500" />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Work</p>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Marina Bay Financial</p>
                  </div>
                </button>

                {/* Changi Airport */}
                <button
                  id="btn-quick-airport"
                  type="button"
                  onClick={() => handleSelectQuickAction(POPULAR_LOCATIONS[3])}
                  className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3 flex flex-col gap-1.5 hover:bg-amber-100 transition-all text-left group cursor-pointer bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <div className="flex items-center justify-between w-full">
                    <Plane className="w-4 h-4 text-emerald-600" />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Airport</p>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Changi Terminal 3</p>
                  </div>
                </button>

                {/* Orchard */}
                <button
                  id="btn-quick-orchard"
                  type="button"
                  onClick={() => handleSelectQuickAction(POPULAR_LOCATIONS[4])}
                  className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3 flex flex-col gap-1.5 hover:bg-amber-100 transition-all text-left group cursor-pointer bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <div className="flex items-center justify-between w-full">
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Orchard</p>
                    <p className="text-[10px] font-bold text-slate-500 truncate">ION Orchard / MRT</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* System Footer Note */}
          <div className="mt-4 pt-3 border-t-2 border-slate-200 flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>OneMap SG & LTA Datamall</span>
            <span className="text-emerald-700 font-black">● 100% Real-Time Connected</span>
          </div>
        </div>
      )}
    </section>
  );
};

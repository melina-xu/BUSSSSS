import React, { useState, useEffect } from 'react';
import { TransitStop, ThemeMode, RouteOption, LocationItem } from '../types';
import { MAP_IMAGES } from '../data/mockData';

interface InteractiveMapProps {
  theme: ThemeMode;
  activeCity?: string;
  stops: TransitStop[];
  selectedStop: TransitStop | null;
  onSelectStop: (stop: TransitStop) => void;
  onViewSchedule: (stop: TransitStop) => void;
  activeRoute?: RouteOption | null;
  origin?: LocationItem | null;
  destination?: LocationItem | null;
  isNavigating?: boolean;
  onStopNavigation?: () => void;
  mode?: 'transit' | 'radar' | 'explore';
  zoomLevel?: number;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  theme,
  activeCity = 'Singapore',
  stops,
  selectedStop,
  onSelectStop,
  onViewSchedule,
  activeRoute,
  origin,
  destination,
  isNavigating = false,
  onStopNavigation,
  mode = 'transit',
  className = ''
}) => {
  const isDark = theme === 'dark';
  const [zoom, setZoom] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'transit' | 'satellite' | 'radar'>('transit');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [liveTracking, setLiveTracking] = useState(true);

  // Navigation simulation state
  const [navProgress, setNavProgress] = useState(0); // 0 to 1
  const [navCurrentStepIndex, setNavCurrentStepIndex] = useState(0);

  // Animate navigation position along the route polyline
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isNavigating && activeRoute && activeRoute.polyline.length > 1) {
      setNavProgress(0);
      interval = setInterval(() => {
        setNavProgress((prev) => {
          if (prev >= 1) {
            return 0; // loop simulation
          }
          const next = prev + 0.015;
          // compute step index
          if (activeRoute.steps && activeRoute.steps.length > 0) {
            const stepIdx = Math.min(
              Math.floor(next * activeRoute.steps.length),
              activeRoute.steps.length - 1
            );
            setNavCurrentStepIndex(stepIdx);
          }
          return next;
        });
      }, 350);
    } else {
      setNavProgress(0);
      setNavCurrentStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isNavigating, activeRoute]);

  // Compute animated vehicle coordinates along the polyline
  const getNavCoordinates = () => {
    if (!activeRoute || !activeRoute.polyline || activeRoute.polyline.length === 0) {
      return { x: 50, y: 50 };
    }
    const poly = activeRoute.polyline;
    const totalSegments = poly.length - 1;
    if (totalSegments <= 0) return poly[0];

    const scaledProgress = navProgress * totalSegments;
    const currIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentProgress = scaledProgress - currIndex;

    const p1 = poly[currIndex];
    const p2 = poly[currIndex + 1] || p1;

    return {
      x: p1.x + (p2.x - p1.x) * segmentProgress,
      y: p1.y + (p2.y - p1.y) * segmentProgress
    };
  };

  const navPos = getNavCoordinates();

  // Select appropriate map image based on city, theme, and mode
  const getMapBackground = () => {
    if (mode === 'radar') {
      return MAP_IMAGES.nycRadarNight;
    }
    if (activeCity.includes('Calgary')) {
      return MAP_IMAGES.calgaryLight;
    }
    if (isDark) {
      return MAP_IMAGES.singaporeNight;
    }
    return MAP_IMAGES.singaporeLight;
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.85));
  const handleResetLocation = () => setZoom(1);

  // Format SVG polyline string from percentage coordinates
  const formatSvgPath = (points: { x: number; y: number }[]) => {
    if (!points || points.length === 0) return '';
    return points.reduce((acc, curr, idx) => {
      const x = (curr.x / 100) * 1000;
      const y = (curr.y / 100) * 1000;
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  };

  return (
    <div
      id="transit-map-container"
      className={`relative w-full h-full overflow-hidden select-none ${className} ${
        isDark ? 'bg-[#121212]' : 'bg-[#dbd9d9]'
      }`}
    >
      {/* Background Map Image with scale transform */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out"
        style={{
          backgroundImage: `url('${getMapBackground()}')`,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      />

      {/* Depth & Contrast Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-t from-[#121212]/85 via-[#121212]/20 to-[#121212]/40'
            : 'bg-gradient-to-t from-[#fbf9f8]/40 via-transparent to-transparent'
        }`}
      />

      {/* SVG Vector Route Polyline Layer */}
      {activeRoute && activeRoute.polyline && (
        <svg
          viewBox="0 0 1000 1000"
          className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-transform duration-500 ease-out"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <defs>
            <linearGradient id="routeGradientTransit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#006e05" />
              <stop offset="50%" stopColor="#1e88e5" />
              <stop offset="100%" stopColor="#d32f2f" />
            </linearGradient>
            <linearGradient id="routeGradientCar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="60%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Alternative Route Polyline (Soft Gray) */}
          {activeRoute.alternativesPolyline && (
            <path
              d={formatSvgPath(activeRoute.alternativesPolyline)}
              fill="none"
              stroke={isDark ? '#666666' : '#9ca3af'}
              strokeWidth="6"
              strokeDasharray="6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.75"
            />
          )}

          {/* Main Active Route Polyline Background Glow/Casing */}
          <path
            d={formatSvgPath(activeRoute.polyline)}
            fill="none"
            stroke={isDark ? '#000000' : '#ffffff'}
            strokeWidth={activeRoute.mode === 'walk' ? '7' : '10'}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeGlow)"
            opacity="0.85"
          />

          {/* Main Active Route Polyline Foreground */}
          <path
            d={formatSvgPath(activeRoute.polyline)}
            fill="none"
            stroke={
              activeRoute.mode === 'transit'
                ? 'url(#routeGradientTransit)'
                : activeRoute.mode === 'car'
                ? 'url(#routeGradientCar)'
                : '#059669'
            }
            strokeWidth={activeRoute.mode === 'walk' ? '5' : '7'}
            strokeDasharray={activeRoute.mode === 'walk' ? '8 8' : 'none'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Origin Marker Pin (A) */}
      {origin && (
        <div
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer group"
          style={{
            top: `${origin.coordinates.y}%`,
            left: `${origin.coordinates.x}%`
          }}
          title={`Origin: ${origin.name}`}
        >
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-md bg-[#006e05] text-white text-[10px] font-black uppercase shadow-md mb-1 whitespace-nowrap">
              {origin.name.split(' ')[0]}
            </div>
            <div className="w-7 h-7 rounded-full bg-[#006e05] text-white flex items-center justify-center font-black text-xs shadow-xl ring-4 ring-white dark:ring-[#1a1a1a]">
              A
            </div>
          </div>
        </div>
      )}

      {/* Destination Marker Pin (B) */}
      {destination && (
        <div
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer group"
          style={{
            top: `${destination.coordinates.y}%`,
            left: `${destination.coordinates.x}%`
          }}
          title={`Destination: ${destination.name}`}
        >
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-md bg-[#d32f2f] text-white text-[10px] font-black uppercase shadow-md mb-1 whitespace-nowrap">
              {destination.name.split(' ')[0]}
            </div>
            <div className="w-7 h-7 rounded-full bg-[#d32f2f] text-white flex items-center justify-center font-black text-xs shadow-xl ring-4 ring-white dark:ring-[#1a1a1a]">
              B
            </div>
          </div>
        </div>
      )}

      {/* Animated Live Navigation Vehicle Marker */}
      {isNavigating && activeRoute && (
        <div
          className="absolute z-25 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
          style={{
            top: `${navPos.y}%`,
            left: `${navPos.x}%`
          }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-500/30 rounded-full animate-ping absolute"></div>
            <div className="w-9 h-9 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow-2xl relative z-10">
              <span className="material-symbols-outlined text-[20px]">
                {activeRoute.mode === 'car'
                  ? 'directions_car'
                  : activeRoute.mode === 'transit'
                  ? 'directions_bus'
                  : 'directions_walk'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation In-Progress Floating HUD Banner (Top-Center) */}
      {isNavigating && activeRoute && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-2.5 rounded-2xl shadow-2xl border backdrop-blur-xl bg-[#111827]/95 text-white border-blue-500/50">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            <span className="material-symbols-outlined text-[18px]">navigation</span>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
              {activeRoute.steps[navCurrentStepIndex]?.instruction || 'Proceed along recommended route'}
            </div>
            <div className="text-xs text-gray-300 font-medium">
              Speed: 45 km/h • Remaining: {((1 - navProgress) * activeRoute.distanceKm).toFixed(1)} km
            </div>
          </div>
          <button
            onClick={onStopNavigation}
            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm ml-2"
          >
            End
          </button>
        </div>
      )}

      {/* Live Tracking Status Badge (Top-Left) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div
          onClick={() => setLiveTracking(!liveTracking)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md cursor-pointer border transition-all ${
            isDark
              ? 'bg-[#131313]/90 border-[#2e2e2e] text-[#e5e2e1]'
              : 'bg-white/95 border-[#becab6] text-[#1b1c1c]'
          }`}
          title="Toggle live telemetry"
        >
          <span className="relative flex h-2.5 w-2.5">
            {liveTracking && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#37ab2e] opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${liveTracking ? 'bg-[#37ab2e]' : 'bg-gray-400'}`}></span>
          </span>
          <span className="text-[11px] font-bold tracking-wider uppercase">
            {liveTracking ? 'Live Network GPS' : 'GPS Paused'}
          </span>
        </div>
      </div>

      {/* Layer Controls (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors border backdrop-blur-md ${
              isDark
                ? 'bg-[#131313]/90 text-[#e5e2e1] border-[#2e2e2e] hover:bg-[#201f1f]'
                : 'bg-white text-[#1b1c1c] border-[#becab6] hover:bg-[#f5f3f3]'
            }`}
            title="Map Layers"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>

          {showLayerMenu && (
            <div
              className={`absolute right-0 top-12 w-40 rounded-xl p-1.5 shadow-2xl z-30 border ${
                isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white border-[#becab6] text-[#1b1c1c]'
              }`}
            >
              {(['transit', 'radar', 'satellite'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => {
                    setActiveLayer(layer);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold capitalize flex items-center justify-between ${
                    activeLayer === layer
                      ? 'bg-[#37ab2e]/15 text-[#37ab2e]'
                      : isDark
                      ? 'hover:bg-[#2a2a2a]'
                      : 'hover:bg-[#f5f3f3]'
                  }`}
                >
                  <span>{layer} Layer</span>
                  {activeLayer === layer && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simulated Live Bus Markers */}
      {stops.slice(0, 2).map((st, sIdx) => (
        <div
          key={st.id}
          onClick={() => onSelectStop(st)}
          className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-115 group"
          style={{
            top: `${sIdx === 0 ? 42 : 58}%`,
            left: `${sIdx === 0 ? 58 : 34}%`
          }}
          title={`${st.routes[0]?.routeName || st.name} - Live on Route`}
        >
          <div
            className={`px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border transition-all ${
              isDark
                ? 'bg-[#1a1a1a] text-[#e5e2e1] border-[#37ab2e]/50 hover:border-[#6cdf5c] shadow-[0_0_12px_rgba(108,223,92,0.3)]'
                : 'bg-white text-[#1b1c1c] border-[#becab6] hover:border-[#006e05]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#006e05]">directions_bus</span>
            <span className="text-[12px] font-bold">{st.routes[0]?.routeNumber || '14'}</span>
          </div>
        </div>
      ))}

      {/* Floating Bottom-Right Map Navigation Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
        <button
          onClick={handleResetLocation}
          className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all border backdrop-blur-md ${
            isDark
              ? 'bg-[#1a1a1a]/95 text-[#e5e2e1] border-[#2e2e2e] hover:text-[#6cdf5c] hover:border-[#6cdf5c]'
              : 'bg-white text-[#1b1c1c] border-[#becab6] hover:text-[#006e05]'
          }`}
          title="Center on My Location"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>

        <div
          className={`flex flex-col rounded-2xl shadow-xl overflow-hidden border backdrop-blur-md ${
            isDark ? 'bg-[#1a1a1a]/95 border-[#2e2e2e]' : 'bg-white border-[#becab6]'
          }`}
        >
          <button
            onClick={handleZoomIn}
            className={`w-11 h-11 flex items-center justify-center transition-colors ${
              isDark ? 'text-[#e5e2e1] hover:bg-[#2a2a2a]' : 'text-[#1b1c1c] hover:bg-[#f5f3f3]'
            }`}
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <div className={`h-[1px] w-6 mx-auto ${isDark ? 'bg-[#2e2e2e]' : 'bg-[#becab6]'}`} />
          <button
            onClick={handleZoomOut}
            className={`w-11 h-11 flex items-center justify-center transition-colors ${
              isDark ? 'text-[#e5e2e1] hover:bg-[#2a2a2a]' : 'text-[#1b1c1c] hover:bg-[#f5f3f3]'
            }`}
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
        </div>
      </div>

      {/* Contextual Stop Popup Card (When a stop is clicked) */}
      {selectedStop && (
        <div
          className={`absolute bottom-6 left-6 z-20 p-4 rounded-2xl shadow-2xl max-w-xs backdrop-blur-xl border transition-all animate-[fadeIn_0.25s_ease-out] ${
            isDark
              ? 'bg-[#1a1a1a]/95 border-[#2e2e2e] text-[#e5e2e1]'
              : 'bg-white/95 border-[#becab6] text-[#1b1c1c]'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#37ab2e]/20 text-[#37ab2e] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-snug">{selectedStop.name}</h3>
              <p className="text-xs text-gray-400">Selected Transit Hub</p>
            </div>
          </div>
          <p className={`text-xs mb-3 ${isDark ? 'text-[#becab6]' : 'text-[#3f4a3a]'}`}>
            {selectedStop.description || `${selectedStop.routes.length} active routes serving this location.`}
          </p>
          <button
            onClick={() => onViewSchedule(selectedStop)}
            className="w-full bg-[#006e05] hover:bg-[#37ab2e] text-white font-bold text-xs py-2 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1"
          >
            <span>View Stop Timetable</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
};

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
  const [navProgress, setNavProgress] = useState(0);
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
      id="girly-transit-map-container"
      className={`relative w-full h-full overflow-hidden select-none ${className} ${
        isDark ? 'bg-[#181017]' : 'bg-[#fff0f5]'
      }`}
    >
      {/* Background Map Image with scale transform */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out"
        style={{
          backgroundImage: `url('${getMapBackground()}')`,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          filter: isDark ? 'brightness(0.85) saturate(1.1)' : 'saturate(1.05) contrast(0.95)'
        }}
      />

      {/* Pastel Soft Vignette Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-t from-[#181119]/90 via-[#181119]/20 to-[#181119]/40'
            : 'bg-gradient-to-t from-[#fff5f8]/50 via-transparent to-transparent'
        }`}
      />

      {/* SVG Vector Route Polyline Layer with Rose / Pastel Gradients */}
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
            <linearGradient id="routeGradientPinkTransit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="routeGradientCandyCar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="60%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            <linearGradient id="routeGradientWalk" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <filter id="routeGlowPink" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Alternative Route Polyline (Soft Pastel Pink Dashed) */}
          {activeRoute.alternativesPolyline && (
            <path
              d={formatSvgPath(activeRoute.alternativesPolyline)}
              fill="none"
              stroke={isDark ? '#be185d' : '#f472b6'}
              strokeWidth="5"
              strokeDasharray="6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          )}

          {/* Main Active Route Polyline Background Glow/Casing */}
          <path
            d={formatSvgPath(activeRoute.polyline)}
            fill="none"
            stroke={isDark ? '#2a1126' : '#ffffff'}
            strokeWidth={activeRoute.mode === 'walk' ? '8' : '11'}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeGlowPink)"
            opacity="0.95"
          />

          {/* Main Active Route Polyline Foreground */}
          <path
            d={formatSvgPath(activeRoute.polyline)}
            fill="none"
            stroke={
              activeRoute.mode === 'transit'
                ? 'url(#routeGradientPinkTransit)'
                : activeRoute.mode === 'car'
                ? 'url(#routeGradientCandyCar)'
                : 'url(#routeGradientWalk)'
            }
            strokeWidth={activeRoute.mode === 'walk' ? '5' : '7'}
            strokeDasharray={activeRoute.mode === 'walk' ? '8 8' : 'none'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Origin Marker Pin (A) - Strawberry Blossom */}
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
            <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black uppercase shadow-md mb-1 whitespace-nowrap flex items-center gap-1">
              <span>🍓</span>
              <span>{origin.name.split(' ')[0]}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center font-black text-xs shadow-xl ring-4 ring-white dark:ring-[#2e1c2a] animate-bounce">
              A
            </div>
          </div>
        </div>
      )}

      {/* Destination Marker Pin (B) - Sparkle Heart */}
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
            <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[10px] font-black uppercase shadow-md mb-1 whitespace-nowrap flex items-center gap-1">
              <span>💖</span>
              <span>{destination.name.split(' ')[0]}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 to-purple-500 text-white flex items-center justify-center font-black text-xs shadow-xl ring-4 ring-white dark:ring-[#2e1c2a] animate-bounce">
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
            <div className="w-14 h-14 bg-pink-400/40 rounded-full animate-ping absolute"></div>
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-500 border-2 border-white rounded-full flex items-center justify-center text-white shadow-2xl relative z-10">
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
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-2.5 rounded-2xl shadow-2xl border backdrop-blur-xl bg-[#201121]/95 text-pink-100 border-pink-500/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold shadow-md shadow-pink-500/30">
            <span className="material-symbols-outlined text-[18px]">navigation</span>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-1">
              <span>✨</span>
              <span className="truncate">{activeRoute.steps[navCurrentStepIndex]?.instruction || 'Proceed along sweet route'}</span>
            </div>
            <div className="text-xs text-pink-200/80 font-medium">
              Speed: 45 km/h • Remaining: {((1 - navProgress) * activeRoute.distanceKm).toFixed(1)} km 🌸
            </div>
          </div>
          <button
            onClick={onStopNavigation}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-xs shadow-sm ml-2"
          >
            End
          </button>
        </div>
      )}

      {/* Live Tracking Status Badge (Top-Left) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div
          onClick={() => setLiveTracking(!liveTracking)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md cursor-pointer border transition-all ${
            isDark
              ? 'bg-[#20121e]/90 border-pink-900/40 text-pink-200'
              : 'bg-white/95 border-pink-200 text-[#371329]'
          }`}
          title="Toggle live telemetry"
        >
          <span className="relative flex h-2.5 w-2.5">
            {liveTracking && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${liveTracking ? 'bg-pink-500' : 'bg-gray-400'}`}></span>
          </span>
          <span className="text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1">
            <span>{liveTracking ? '✨ Live GPS' : 'GPS Paused'}</span>
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
                ? 'bg-[#20121e]/90 text-pink-200 border-pink-900/40 hover:bg-[#2c1729]'
                : 'bg-white text-[#371329] border-pink-200 hover:bg-pink-50'
            }`}
            title="Map Layers"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>

          {showLayerMenu && (
            <div
              className={`absolute right-0 top-12 w-44 rounded-2xl p-1.5 shadow-2xl z-30 border ${
                isDark ? 'bg-[#20121e] border-[#381a34] text-pink-100' : 'bg-white border-pink-200 text-[#371329]'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 text-pink-500">
                Map View Layers
              </div>
              {(['transit', 'radar', 'satellite'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => {
                    setActiveLayer(layer);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold capitalize flex items-center justify-between ${
                    activeLayer === layer
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold'
                      : isDark
                      ? 'hover:bg-[#2f182c]'
                      : 'hover:bg-pink-50'
                  }`}
                >
                  <span>{layer} Layer</span>
                  {activeLayer === layer && <span className="text-xs">✨</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simulated Live Bus Markers with cute pink badges */}
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
            className={`px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border transition-all ${
              isDark
                ? 'bg-[#20121e] text-pink-100 border-pink-500/60 shadow-[0_0_12px_rgba(244,114,182,0.3)]'
                : 'bg-white text-[#371329] border-pink-200 hover:border-pink-500'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-pink-500">directions_bus</span>
            <span className="text-[11px] font-black">{st.routes[0]?.routeNumber || '14'}</span>
            <span className="text-[10px]">🌸</span>
          </div>
        </div>
      ))}

      {/* Floating Bottom-Right Map Navigation Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2.5">
        <button
          onClick={handleResetLocation}
          className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center transition-all border backdrop-blur-md ${
            isDark
              ? 'bg-[#20121e]/95 text-pink-200 border-pink-900/50 hover:text-pink-400 hover:border-pink-400'
              : 'bg-white text-[#371329] border-pink-200 hover:text-pink-600'
          }`}
          title="Center on My Location"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>

        <div
          className={`flex flex-col rounded-2xl shadow-xl overflow-hidden border backdrop-blur-md ${
            isDark ? 'bg-[#20121e]/95 border-pink-900/50' : 'bg-white border-pink-200'
          }`}
        >
          <button
            onClick={handleZoomIn}
            className={`w-11 h-11 flex items-center justify-center transition-colors ${
              isDark ? 'text-pink-200 hover:bg-[#2f182c]' : 'text-[#371329] hover:bg-pink-50'
            }`}
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <div className={`h-[1px] w-6 mx-auto ${isDark ? 'bg-pink-900/50' : 'bg-pink-200'}`} />
          <button
            onClick={handleZoomOut}
            className={`w-11 h-11 flex items-center justify-center transition-colors ${
              isDark ? 'text-pink-200 hover:bg-[#2f182c]' : 'text-[#371329] hover:bg-pink-50'
            }`}
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
        </div>
      </div>

      {/* Contextual Stop Popup Card */}
      {selectedStop && (
        <div
          className={`absolute bottom-6 left-6 z-20 p-4 rounded-3xl shadow-2xl max-w-xs backdrop-blur-xl border transition-all animate-[fadeIn_0.25s_ease-out] ${
            isDark
              ? 'bg-[#20121e]/95 border-[#381a34] text-pink-100'
              : 'bg-white/95 border-pink-200 text-[#371329]'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-snug flex items-center gap-1">
                <span>{selectedStop.name}</span>
                <span className="text-xs">🌸</span>
              </h3>
              <p className="text-xs text-pink-400">Selected Transit Hub</p>
            </div>
          </div>
          <p className="text-xs mb-3 text-pink-600 dark:text-pink-200/80">
            {selectedStop.description || `${selectedStop.routes.length} active routes serving this location.`}
          </p>
          <button
            onClick={() => onViewSchedule(selectedStop)}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs py-2 rounded-xl shadow-md shadow-pink-500/25 transition-colors flex items-center justify-center gap-1"
          >
            <span>View Stop Timetable</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
};

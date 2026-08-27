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
  const [activeLayer, setActiveLayer] = useState<'neural' | 'radar' | 'satellite'>('neural');
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

  // Select appropriate map background
  const getMapBackground = () => {
    if (activeLayer === 'radar' || mode === 'radar') {
      return MAP_IMAGES.nycRadarNight;
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
      id="aether-quant-map-container"
      className={`relative w-full h-full overflow-hidden select-none ${className} ${
        isDark ? 'bg-[#06080d]' : 'bg-[#0f172a]'
      }`}
    >
      {/* Background Map Image with scale transform */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out"
        style={{
          backgroundImage: `url('${getMapBackground()}')`,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          filter: isDark
            ? 'brightness(0.65) contrast(1.25) saturate(1.2)'
            : 'brightness(0.85) contrast(1.15) saturate(1.1)'
        }}
      />

      {/* High-Tech Tactical Grid & Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 240, 255, 0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 240, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-t from-[#06080d]/90 via-[#06080d]/30 to-[#06080d]/50'
            : 'bg-gradient-to-t from-[#090d16]/80 via-transparent to-transparent'
        }`}
      />

      {/* SVG Vector Route Polyline Layer with Electric Cyan & Gold Gradients */}
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
            <linearGradient id="routeGradientCyanHFT" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="routeGradientCarAutonomous" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="routeGradientWalkSkybridge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <filter id="routeGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00f0ff" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Alternative Route Polyline (Gold Dashed Alpha) */}
          {activeRoute.alternativesPolyline && (
            <path
              d={formatSvgPath(activeRoute.alternativesPolyline)}
              fill="none"
              stroke="#eab308"
              strokeWidth="4"
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
            stroke="#00f0ff"
            strokeWidth={activeRoute.mode === 'walk' ? '7' : '10'}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#routeGlowCyan)"
            opacity="0.9"
          />

          {/* Main Active Route Polyline Foreground */}
          <path
            d={formatSvgPath(activeRoute.polyline)}
            fill="none"
            stroke={
              activeRoute.mode === 'transit'
                ? 'url(#routeGradientCyanHFT)'
                : activeRoute.mode === 'car'
                ? 'url(#routeGradientCarAutonomous)'
                : 'url(#routeGradientWalkSkybridge)'
            }
            strokeWidth={activeRoute.mode === 'walk' ? '4' : '6'}
            strokeDasharray={activeRoute.mode === 'walk' ? '8 8' : 'none'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Origin Marker Pin (A) - High Precision GPS Node */}
      {origin && (
        <div
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer group"
          style={{
            top: `${origin.coordinates.y}%`,
            left: `${origin.coordinates.x}%`
          }}
          title={`Origin Node: ${origin.name}`}
        >
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 rounded bg-[#090d16] text-cyan-400 font-mono text-[9px] font-black uppercase border border-cyan-500/40 shadow-lg mb-1 whitespace-nowrap flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span>ORIGIN [{origin.quantCode || 'NODE_A'}]</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-mono font-black text-xs shadow-xl shadow-cyan-500/30 border border-white">
              A
            </div>
          </div>
        </div>
      )}

      {/* Destination Marker Pin (B) - Goldman Sachs / Target Gateway */}
      {destination && (
        <div
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer group"
          style={{
            top: `${destination.coordinates.y}%`,
            left: `${destination.coordinates.x}%`
          }}
          title={`Destination Target: ${destination.name}`}
        >
          <div className="flex flex-col items-center">
            <div className="px-2 py-0.5 rounded bg-[#090d16] text-amber-300 font-mono text-[9px] font-black uppercase border border-amber-400/40 shadow-lg mb-1 whitespace-nowrap flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>TARGET [{destination.quantCode || 'NODE_B'}]</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-mono font-black text-xs shadow-xl shadow-amber-400/30 border border-white animate-bounce">
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
            <div className="w-14 h-14 bg-cyan-400/20 rounded-full animate-ping absolute"></div>
            <div className="w-10 h-10 bg-[#090d16] border-2 border-cyan-400 rounded-xl flex items-center justify-center text-cyan-300 shadow-2xl shadow-cyan-400/50 relative z-10">
              <span className="material-symbols-outlined text-[20px]">
                {activeRoute.mode === 'car'
                  ? 'local_taxi'
                  : activeRoute.mode === 'transit'
                  ? 'train'
                  : 'directions_walk'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation In-Progress Floating HUD Banner (Top-Center) */}
      {isNavigating && activeRoute && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-2.5 rounded-xl shadow-2xl border backdrop-blur-xl bg-[#090d16]/95 text-slate-100 border-cyan-500/50 font-mono">
          <div className="w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-500/30">
            <span className="material-symbols-outlined text-[16px]">navigation</span>
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>ACTIVE CORRIDOR TELEMETRY</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-300 truncate">
                {activeRoute.steps[navCurrentStepIndex]?.instruction || 'Proceeding along designated alpha route'}
              </span>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Speed: <span className="text-emerald-400 font-bold">54.2 km/h</span> • Remaining:{' '}
              <span className="text-cyan-300 font-bold">{((1 - navProgress) * activeRoute.distanceKm).toFixed(1)} km</span> • P99 Delta: 0.0s
            </div>
          </div>
          <button
            onClick={onStopNavigation}
            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs shadow-sm ml-2"
          >
            TERMINATE
          </button>
        </div>
      )}

      {/* Live Tracking Status Badge (Top-Left) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 font-mono">
        <div
          onClick={() => setLiveTracking(!liveTracking)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl shadow-lg backdrop-blur-md cursor-pointer border transition-all ${
            isDark
              ? 'bg-[#090d16]/90 border-cyan-500/30 text-cyan-300'
              : 'bg-white/95 border-slate-300 text-slate-900'
          }`}
          title="Toggle live telemetry radar"
        >
          <span className="relative flex h-2 w-2">
            {liveTracking && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                liveTracking ? 'bg-cyan-400' : 'bg-slate-400'
              }`}
            ></span>
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase">
            {liveTracking ? 'REAL-TIME RADAR • 100HZ' : 'TELEMETRY PAUSED'}
          </span>
        </div>
      </div>

      {/* Layer Controls (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 font-mono">
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`w-9 h-9 rounded-xl shadow-lg flex items-center justify-center transition-colors border backdrop-blur-md ${
              isDark
                ? 'bg-[#090d16]/90 text-cyan-300 border-cyan-500/30 hover:border-cyan-400'
                : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
            }`}
            title="Sensor Layers"
          >
            <span className="material-symbols-outlined text-[18px]">layers</span>
          </button>

          {showLayerMenu && (
            <div
              className={`absolute right-0 top-11 w-48 rounded-xl p-1.5 shadow-2xl z-30 border ${
                isDark ? 'bg-[#090d16] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <div className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 text-slate-400">
                Tactical Visualizer Layers
              </div>
              {(['neural', 'radar', 'satellite'] as const).map((layer) => (
                <button
                  key={layer}
                  onClick={() => {
                    setActiveLayer(layer);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold capitalize flex items-center justify-between ${
                    activeLayer === layer
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : isDark
                      ? 'hover:bg-slate-800'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <span>{layer} matrix</span>
                  {activeLayer === layer && <span className="text-[10px] text-cyan-400">ACTIVE</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simulated Live Autonomous Transit Nodes on Map */}
      {stops.slice(0, 3).map((st, sIdx) => (
        <div
          key={st.id}
          onClick={() => onSelectStop(st)}
          className="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-115 group"
          style={{
            top: `${sIdx === 0 ? 42 : sIdx === 1 ? 58 : 34}%`,
            left: `${sIdx === 0 ? 58 : sIdx === 1 ? 34 : 70}%`
          }}
          title={`${st.routes[0]?.routeName || st.name} - Telemetry Active`}
        >
          <div
            className={`px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5 border transition-all font-mono ${
              isDark
                ? 'bg-[#090d16] text-slate-100 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-white text-slate-900 border-slate-300 hover:border-cyan-600'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-cyan-400">directions_bus</span>
            <span className="text-[10px] font-black">{st.routes[0]?.routeNumber || '196X'}</span>
            <span className="text-[9px] text-emerald-400 font-bold">● LIVE</span>
          </div>
        </div>
      ))}

      {/* Floating Bottom-Right Map Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 font-mono">
        <button
          onClick={handleResetLocation}
          className={`w-9 h-9 rounded-xl shadow-lg flex items-center justify-center transition-all border backdrop-blur-md ${
            isDark
              ? 'bg-[#090d16]/95 text-cyan-300 border-slate-700 hover:border-cyan-400'
              : 'bg-white text-slate-900 border-slate-300 hover:border-cyan-600'
          }`}
          title="Center on GPS Node"
        >
          <span className="material-symbols-outlined text-[18px]">my_location</span>
        </button>

        <div
          className={`flex flex-col rounded-xl shadow-xl overflow-hidden border backdrop-blur-md ${
            isDark ? 'bg-[#090d16]/95 border-slate-700' : 'bg-white border-slate-300'
          }`}
        >
          <button
            onClick={handleZoomIn}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${
              isDark ? 'text-cyan-300 hover:bg-slate-800' : 'text-slate-900 hover:bg-slate-100'
            }`}
            title="Zoom In"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
          <div className={`h-[1px] w-5 mx-auto ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <button
            onClick={handleZoomOut}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${
              isDark ? 'text-cyan-300 hover:bg-slate-800' : 'text-slate-900 hover:bg-slate-100'
            }`}
            title="Zoom Out"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
        </div>
      </div>

      {/* Contextual Stop Popup Card */}
      {selectedStop && (
        <div
          className={`absolute bottom-6 left-6 z-20 p-4 rounded-2xl shadow-2xl max-w-sm backdrop-blur-xl border transition-all animate-[fadeIn_0.25s_ease-out] font-mono ${
            isDark ? 'bg-[#090d16]/95 border-cyan-500/40 text-slate-100' : 'bg-white/95 border-slate-300 text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
            <div>
              <h3 className="font-extrabold text-xs leading-snug">{selectedStop.name}</h3>
              <p className="text-[10px] text-cyan-400">Node ID: {selectedStop.code} • {selectedStop.nodalThroughput || '12,000 pax/hr'}</p>
            </div>
          </div>
          <p className="text-xs mb-3 text-slate-300 font-sans">
            {selectedStop.description || `${selectedStop.routes.length} active routes serving this high-density location.`}
          </p>
          <button
            onClick={() => onViewSchedule(selectedStop)}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs py-2 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1"
          >
            <span>INSPECT TIMETABLE TELEMETRY</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
};

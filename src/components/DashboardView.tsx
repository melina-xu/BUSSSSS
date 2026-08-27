import React, { useState } from 'react';
import { TransitStop, ThemeMode, TravelMode, LocationItem, RouteOption } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { RoutePlanner } from './RoutePlanner';
import { POPULAR_LOCATIONS, getRoutePlans } from '../data/mockData';

interface DashboardViewProps {
  theme: ThemeMode;
  activeCity: string;
  stops: TransitStop[];
  selectedStop: TransitStop | null;
  onSelectStop: (stop: TransitStop) => void;
  onViewSchedule: (stop: TransitStop) => void;
  onViewAdvisoryDetails: (advisoryTitle: string) => void;
  onSimulateArrival: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  theme,
  activeCity,
  stops,
  selectedStop,
  onSelectStop,
  onViewSchedule,
  onViewAdvisoryDetails
}) => {
  const isDark = theme === 'dark';

  // Navigation & Route Planning State
  const [origin, setOrigin] = useState<LocationItem>(POPULAR_LOCATIONS[0]);
  const [destination, setDestination] = useState<LocationItem>(POPULAR_LOCATIONS[1]);
  const [travelMode, setTravelMode] = useState<TravelMode>('transit');
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(() => {
    const plans = getRoutePlans(POPULAR_LOCATIONS[0], POPULAR_LOCATIONS[1], 'transit');
    return plans[0] || null;
  });
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // Floating UI Toggles
  const [showArrivalsDrawer, setShowArrivalsDrawer] = useState<boolean>(false);
  const [showStatsCard, setShowStatsCard] = useState<boolean>(true);
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(true);

  const handleToggleNavigation = () => {
    setIsNavigating((prev) => !prev);
  };

  return (
    <div id="aether-quant-dashboard-view" className="relative w-full h-[calc(100vh-64px)] overflow-hidden font-sans">
      {/* Full-Bleed Map Canvas */}
      <div className="absolute inset-0 z-0">
        <InteractiveMap
          theme={theme}
          activeCity={activeCity}
          stops={stops}
          selectedStop={selectedStop}
          onSelectStop={onSelectStop}
          onViewSchedule={onViewSchedule}
          activeRoute={selectedRoute}
          origin={origin}
          destination={destination}
          isNavigating={isNavigating}
          onStopNavigation={() => setIsNavigating(false)}
        />
      </div>

      {/* Floating Top Quantitative Advisory Pill */}
      {showAlertBanner && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-xl w-[90%] md:w-auto font-mono">
          <div
            className={`px-4 py-2 rounded-xl shadow-2xl border backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-semibold transition-all ${
              isDark
                ? 'bg-[#090d16]/95 border-amber-500/40 text-amber-200 shadow-amber-950/30'
                : 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-200/50'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="truncate font-bold">
                [ALERT] Bus 857 Surge Latency (+3.2m) • AETHER AI Pre-Cleared Flyover 2 Bypass Active
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onViewAdvisoryDetails('Financial District Surge Arbitrage')}
                className="text-[11px] font-mono font-bold text-cyan-400 hover:underline"
              >
                ARBITRAGE
              </button>
              <button
                onClick={() => setShowAlertBanner(false)}
                className="opacity-60 hover:opacity-100"
                title="Dismiss telemetry alert"
              >
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Floating Route Planning Panel (Top-Left) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto max-h-[calc(100vh-96px)] flex flex-col">
        <RoutePlanner
          theme={theme}
          origin={origin}
          destination={destination}
          travelMode={travelMode}
          onOriginChange={(newOrigin) => setOrigin(newOrigin)}
          onDestinationChange={(newDest) => setDestination(newDest)}
          onTravelModeChange={(newMode) => setTravelMode(newMode)}
          onSelectRoute={(route) => setSelectedRoute(route)}
          selectedRoute={selectedRoute}
          isNavigating={isNavigating}
          onToggleNavigation={handleToggleNavigation}
        />
      </div>

      {/* Floating Control Bar (Bottom-Left) */}
      <div className="absolute bottom-6 left-4 z-20 flex items-center gap-2.5 font-mono">
        {/* Toggle Telemetry Arrivals Drawer */}
        <button
          onClick={() => setShowArrivalsDrawer(!showArrivalsDrawer)}
          className={`px-3.5 py-2 rounded-xl shadow-xl border backdrop-blur-xl flex items-center gap-2 text-xs font-bold transition-all ${
            showArrivalsDrawer
              ? 'bg-cyan-600 text-white border-cyan-400 shadow-cyan-600/30'
              : isDark
              ? 'bg-[#090d16]/90 border-slate-700 text-slate-200 hover:border-cyan-500'
              : 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-50'
          }`}
          title="Toggle live telemetry nodal arrivals"
        >
          <span className="material-symbols-outlined text-[16px]">sensors</span>
          <span>NODAL SENSORS</span>
          <span
            className={`text-[9px] px-1.5 py-0.2 rounded font-black ${
              showArrivalsDrawer ? 'bg-black/30 text-white' : 'bg-cyan-500/20 text-cyan-400'
            }`}
          >
            {stops.length} ACTIVE
          </span>
        </button>

        {/* Toggle Quant Stats Pill */}
        <button
          onClick={() => setShowStatsCard(!showStatsCard)}
          className={`px-3.5 py-2 rounded-xl shadow-xl border backdrop-blur-xl flex items-center gap-2 text-xs font-bold transition-all ${
            showStatsCard
              ? isDark
                ? 'bg-[#0d121f]/90 border-cyan-500/50 text-cyan-300'
                : 'bg-cyan-50 border-cyan-400 text-cyan-900'
              : isDark
              ? 'bg-[#090d16]/90 border-slate-700 text-slate-400 hover:border-cyan-500'
              : 'bg-white/95 border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
          title="Toggle quantitative yield telemetry"
        >
          <span className="material-symbols-outlined text-[16px]">query_stats</span>
          <span className="hidden sm:inline">ALPHA METRICS</span>
        </button>
      </div>

      {/* Floating Quant Commute Yield Card (Bottom-Left / Mid) */}
      {showStatsCard && (
        <div
          className={`absolute bottom-16 left-4 z-20 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl max-w-xs transition-all font-mono ${
            isDark ? 'bg-[#090d16]/95 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-300 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span>QUANT CORRIDOR YIELD</span>
            </span>
            <button
              onClick={() => setShowStatsCard(false)}
              className="text-slate-500 hover:text-slate-300"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              className={`p-2.5 rounded-xl border ${
                isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-[9px] text-slate-400 uppercase">Alpha Time Saved</div>
              <div className="text-sm font-black text-emerald-400 mt-0.5">
                +{selectedRoute?.alphaTimeSavedMin ? `${selectedRoute.alphaTimeSavedMin} min` : '6.4 min'}
              </div>
              <div className="text-[8px] text-slate-500">P99 on-time delta</div>
            </div>

            <div
              className={`p-2.5 rounded-xl border ${
                isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-[9px] text-slate-400 uppercase">Neural Confidence</div>
              <div className="text-sm font-black text-cyan-400 mt-0.5">
                {selectedRoute?.neuralConfidence ? `${selectedRoute.neuralConfidence}%` : '99.7%'}
              </div>
              <div className="text-[8px] text-slate-500">120 TFLOPS cluster</div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in Telemetry Arrivals Drawer */}
      {showArrivalsDrawer && (
        <div
          className={`absolute top-4 right-4 bottom-6 w-80 md:w-96 rounded-2xl shadow-2xl border backdrop-blur-xl z-30 flex flex-col overflow-hidden animate-[slideInRight_0.25s_ease-out] font-mono ${
            isDark ? 'bg-[#090d16]/95 border-slate-800 text-slate-100' : 'bg-white/95 border-slate-300 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`p-3.5 border-b flex items-center justify-between ${
              isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[15px]">sensors</span>
              </div>
              <h3 className="font-extrabold text-xs">LIVE NODAL TELEMETRY</h3>
            </div>
            <button
              onClick={() => setShowArrivalsDrawer(false)}
              className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          {/* Stops List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5">
            {stops.map((stop) => {
              const isSelected = selectedStop?.id === stop.id;
              return (
                <div
                  key={stop.id}
                  onClick={() => onSelectStop(stop)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-cyan-950/30 border-cyan-500 ring-1 ring-cyan-500/40'
                        : 'bg-cyan-50 border-cyan-600 ring-1 ring-cyan-600'
                      : isDark
                      ? 'bg-[#06080d] border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-xs leading-tight">{stop.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {stop.distanceDisplay} • {stop.nodalThroughput || '12k pax/hr'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewSchedule(stop);
                      }}
                      className="text-[10px] font-bold text-cyan-400 hover:underline"
                    >
                      TIMETABLE
                    </button>
                  </div>

                  {/* Routes */}
                  <div className="space-y-1">
                    {stop.routes.map((route, rIdx) => (
                      <div
                        key={rIdx}
                        className={`flex items-center justify-between p-1.5 rounded-lg ${
                          isDark ? 'bg-[#0b0f19]' : 'bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {route.routeNumber}
                          </span>
                          <span className="text-xs truncate text-slate-300 font-sans font-medium">
                            {route.routeName}
                          </span>
                        </div>

                        <div className="text-right shrink-0 pl-2">
                          <span
                            className={`font-mono text-xs font-black ${
                              route.status === 'arriving'
                                ? 'text-cyan-400 animate-pulse'
                                : route.status === 'delayed'
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {route.primaryTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [destination, setDestination] = useState<LocationItem>(POPULAR_LOCATIONS[2]);
  const [travelMode, setTravelMode] = useState<TravelMode>('transit');
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(() => {
    const plans = getRoutePlans(POPULAR_LOCATIONS[0], POPULAR_LOCATIONS[2], 'transit');
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
    <div id="girly-dashboard-view" className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
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

      {/* Floating Top Warning Pill (Cute & Non-intrusive) */}
      {showAlertBanner && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-lg w-[90%] md:w-auto">
          <div
            className={`px-4 py-2 rounded-full shadow-lg border backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-semibold transition-all ${
              isDark
                ? 'bg-[#261625]/90 border-pink-500/40 text-pink-200 shadow-pink-900/20'
                : 'bg-rose-50/95 border-rose-200 text-rose-900 shadow-rose-200/50'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm">🌸</span>
              <span className="truncate font-bold">
                Line B: 15 min delay due to track care • Alternate routes active ✨
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onViewAdvisoryDetails('Subway Line B Service Disruption')}
                className="text-[11px] font-black underline hover:text-pink-600"
              >
                Details
              </button>
              <button
                onClick={() => setShowAlertBanner(false)}
                className="opacity-60 hover:opacity-100"
                title="Dismiss banner"
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

      {/* Floating Control Bar (Bottom-Left) for Arrivals & Stats */}
      <div className="absolute bottom-6 left-4 z-20 flex items-center gap-2.5">
        {/* Toggle Nearby Arrivals Drawer */}
        <button
          onClick={() => setShowArrivalsDrawer(!showArrivalsDrawer)}
          className={`px-4 py-2.5 rounded-2xl shadow-xl border backdrop-blur-xl flex items-center gap-2 text-xs font-bold transition-all ${
            showArrivalsDrawer
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400 shadow-pink-500/30'
              : isDark
              ? 'bg-[#20121e]/90 border-[#381a34] text-pink-200 hover:bg-[#2e182b]'
              : 'bg-white/95 border-pink-200 text-[#371329] hover:bg-pink-50'
          }`}
          title="Toggle live nearby arrivals"
        >
          <span className="material-symbols-outlined text-[18px]">directions_bus</span>
          <span>Nearby Arrivals</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              showArrivalsDrawer ? 'bg-white/20 text-white' : 'bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300'
            }`}
          >
            {stops.length}
          </span>
        </button>

        {/* Toggle Stats Pill */}
        <button
          onClick={() => setShowStatsCard(!showStatsCard)}
          className={`px-4 py-2.5 rounded-2xl shadow-xl border backdrop-blur-xl flex items-center gap-2 text-xs font-bold transition-all ${
            showStatsCard
              ? isDark
                ? 'bg-[#2f182c]/90 border-pink-500/50 text-pink-300'
                : 'bg-pink-50/95 border-pink-300 text-pink-800'
              : isDark
              ? 'bg-[#20121e]/90 border-[#381a34] text-pink-400/70 hover:bg-[#2e182b]'
              : 'bg-white/95 border-pink-200 text-pink-700/80 hover:bg-pink-50'
          }`}
          title="Toggle commute stats"
        >
          <span className="material-symbols-outlined text-[18px]">query_stats</span>
          <span className="hidden sm:inline">Commute Stats 🌸</span>
        </button>
      </div>

      {/* Floating Commute Stats Card (Bottom-Left / Mid) */}
      {showStatsCard && (
        <div
          className={`absolute bottom-20 left-4 z-20 p-4 rounded-3xl shadow-2xl border backdrop-blur-xl max-w-xs transition-all ${
            isDark ? 'bg-[#20121e]/95 border-[#381a34] text-pink-100' : 'bg-white/95 border-pink-200 text-[#371329]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-500 flex items-center gap-1">
              <span>🌸</span> Trip Intelligence
            </span>
            <button
              onClick={() => setShowStatsCard(false)}
              className="text-pink-400 hover:text-pink-600"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div
              className={`p-2.5 rounded-2xl border ${
                isDark ? 'bg-[#281525] border-[#3e1d3a]' : 'bg-[#fff5f8] border-pink-100'
              }`}
            >
              <div className="text-[10px] font-bold text-pink-400">Carbon Impact</div>
              <div className="text-base font-black text-rose-500 mt-0.5">
                {selectedRoute?.carbonSavedKg ? `-${selectedRoute.carbonSavedKg} kg` : '-2.4 kg'}
              </div>
              <div className="text-[9px] text-pink-400">vs Solo Drive 🌿</div>
            </div>

            <div
              className={`p-2.5 rounded-2xl border ${
                isDark ? 'bg-[#281525] border-[#3e1d3a]' : 'bg-[#fff5f8] border-pink-100'
              }`}
            >
              <div className="text-[10px] font-bold text-pink-400">Avg Travel Time</div>
              <div className="text-base font-black text-inherit mt-0.5">
                {selectedRoute ? `${selectedRoute.durationMinutes} min` : '28 min'}
              </div>
              <div className="text-[9px] text-pink-500 font-bold">✨ Sweet flow</div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in Nearby Arrivals Drawer */}
      {showArrivalsDrawer && (
        <div
          className={`absolute top-4 right-4 bottom-6 w-80 md:w-96 rounded-3xl shadow-2xl border backdrop-blur-xl z-30 flex flex-col overflow-hidden animate-[slideInRight_0.25s_ease-out] ${
            isDark ? 'bg-[#20121e]/95 border-[#381a34] text-pink-100' : 'bg-white/95 border-pink-200 text-[#371329]'
          }`}
        >
          {/* Header */}
          <div
            className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'bg-[#281525] border-[#381a34]' : 'bg-[#fff5f8] border-pink-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[17px]">directions_bus</span>
              </div>
              <h3 className="font-extrabold text-sm flex items-center gap-1">
                <span>Nearby Stops & Arrivals</span>
                <span className="text-xs">🌸</span>
              </h3>
            </div>
            <button
              onClick={() => setShowArrivalsDrawer(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-pink-100 dark:hover:bg-pink-900 text-pink-400 hover:text-pink-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Stops List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-3">
            {stops.map((stop) => {
              const isSelected = selectedStop?.id === stop.id;
              return (
                <div
                  key={stop.id}
                  onClick={() => onSelectStop(stop)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-[#2f182c] border-pink-400 ring-2 ring-pink-400/40'
                        : 'bg-[#fff5f8] border-pink-400 ring-2 ring-pink-300 shadow-sm'
                      : isDark
                      ? 'bg-[#180e19] border-[#381a34] hover:bg-[#251424]'
                      : 'bg-white border-pink-100 hover:bg-pink-50/60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-xs leading-tight text-[#371329] dark:text-pink-100 flex items-center gap-1">
                        <span>{stop.name}</span>
                        <span className="text-[10px]">🌸</span>
                      </h4>
                      <p className="text-[10px] text-pink-400 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[12px]">directions_walk</span>
                        {stop.distanceDisplay}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewSchedule(stop);
                      }}
                      className="text-[10px] font-black text-pink-600 dark:text-pink-300 hover:underline"
                    >
                      Timetable ✨
                    </button>
                  </div>

                  {/* Routes */}
                  <div className="space-y-1.5">
                    {stop.routes.map((route, rIdx) => (
                      <div
                        key={rIdx}
                        className={`flex items-center justify-between p-2 rounded-xl ${
                          isDark ? 'bg-[#261525]' : 'bg-[#fff0f5]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-8 h-5 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 shadow-xs ${
                              route.colorType === 'secondary'
                                ? 'bg-purple-500 text-white'
                                : route.colorType === 'delayed'
                                ? 'bg-amber-500 text-white'
                                : route.colorType === 'critical'
                                ? 'bg-rose-600 text-white'
                                : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                            }`}
                          >
                            {route.routeNumber}
                          </div>
                          <span className="text-xs font-semibold truncate text-[#371329] dark:text-pink-100">
                            {route.routeName}
                          </span>
                        </div>

                        <div className="text-right shrink-0 pl-2">
                          <span
                            className={`font-timer-display text-xs font-black ${
                              route.status === 'arriving'
                                ? 'text-pink-500 animate-pulse'
                                : route.status === 'delayed'
                                ? 'text-amber-500'
                                : 'text-[#371329] dark:text-pink-100'
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

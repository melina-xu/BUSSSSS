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
  const [origin, setOrigin] = useState<LocationItem>(POPULAR_LOCATIONS[0]); // Your Location
  const [destination, setDestination] = useState<LocationItem>(POPULAR_LOCATIONS[2]); // Marina Bay Sands
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
    <div id="senior-dashboard-view" className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
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

      {/* Floating Top Warning Pill (Dismissable & Non-intrusive) */}
      {showAlertBanner && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-lg w-[90%] md:w-auto">
          <div
            className={`px-3.5 py-2 rounded-full shadow-lg border backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-semibold transition-all ${
              isDark
                ? 'bg-[#1e1e1e]/90 border-amber-500/30 text-amber-300'
                : 'bg-amber-50/95 border-amber-300/80 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-amber-500 text-[18px] shrink-0">
                warning
              </span>
              <span className="truncate">
                Line B: 15 min delay due to track maintenance
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onViewAdvisoryDetails('Subway Line B Service Disruption')}
                className="text-[11px] font-black underline hover:opacity-80"
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

      {/* Primary Floating Google Maps-Style Route Planning Panel (Top-Left) */}
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

      {/* Floating Control Bar (Top-Right / Bottom-Left) for Arrivals & Stats */}
      <div className="absolute bottom-6 left-4 z-20 flex items-center gap-2.5">
        {/* Toggle Nearby Arrivals Drawer */}
        <button
          onClick={() => setShowArrivalsDrawer(!showArrivalsDrawer)}
          className={`px-3.5 py-2.5 rounded-2xl shadow-xl border backdrop-blur-xl flex items-center gap-2 text-xs font-bold transition-all ${
            showArrivalsDrawer
              ? 'bg-[#006e05] text-white border-[#006e05] shadow-lg'
              : isDark
              ? 'bg-[#181818]/90 border-[#2e2e2e] text-[#e5e2e1] hover:bg-[#222222]'
              : 'bg-white/95 border-[#becab6] text-[#1b1c1c] hover:bg-[#f5f3f3]'
          }`}
          title="Toggle live nearby arrivals"
        >
          <span className="material-symbols-outlined text-[18px]">directions_bus</span>
          <span>Nearby Arrivals</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              showArrivalsDrawer ? 'bg-white/20 text-white' : 'bg-[#006e05]/15 text-[#006e05]'
            }`}
          >
            {stops.length}
          </span>
        </button>

        {/* Toggle Stats Pill */}
        <button
          onClick={() => setShowStatsCard(!showStatsCard)}
          className={`px-3.5 py-2.5 rounded-2xl shadow-xl border backdrop-blur-xl flex items-center gap-2 text-xs font-bold transition-all ${
            showStatsCard
              ? isDark
                ? 'bg-[#1f2937]/90 border-blue-500/40 text-blue-400'
                : 'bg-blue-50/95 border-blue-200 text-blue-800'
              : isDark
              ? 'bg-[#181818]/90 border-[#2e2e2e] text-gray-400 hover:bg-[#222222]'
              : 'bg-white/95 border-[#becab6] text-gray-600 hover:bg-[#f5f3f3]'
          }`}
          title="Toggle commute stats"
        >
          <span className="material-symbols-outlined text-[18px]">query_stats</span>
          <span className="hidden sm:inline">Commute Stats</span>
        </button>
      </div>

      {/* Floating Commute Stats Card (Bottom-Left / Mid) */}
      {showStatsCard && (
        <div
          className={`absolute bottom-20 left-4 z-20 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl max-w-xs transition-all ${
            isDark ? 'bg-[#181818]/95 border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white/95 border-[#becab6] text-[#1b1c1c]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Trip Intelligence
            </span>
            <button
              onClick={() => setShowStatsCard(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              className={`p-2 rounded-xl border ${
                isDark ? 'bg-[#222222] border-[#333333]' : 'bg-[#f4f3f2] border-[#e0dedc]'
              }`}
            >
              <div className="text-[10px] font-semibold text-gray-400">Carbon Impact</div>
              <div className="text-base font-black text-[#37ab2e] mt-0.5">
                {selectedRoute?.carbonSavedKg ? `-${selectedRoute.carbonSavedKg} kg` : '-2.4 kg'}
              </div>
              <div className="text-[9px] text-gray-400">vs Solo Drive</div>
            </div>

            <div
              className={`p-2 rounded-xl border ${
                isDark ? 'bg-[#222222] border-[#333333]' : 'bg-[#f4f3f2] border-[#e0dedc]'
              }`}
            >
              <div className="text-[10px] font-semibold text-gray-400">Avg Travel Time</div>
              <div className="text-base font-black text-inherit mt-0.5">
                {selectedRoute ? `${selectedRoute.durationMinutes} min` : '28 min'}
              </div>
              <div className="text-[9px] text-[#37ab2e] font-semibold">Optimal flow</div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in / Floating Nearby Arrivals Drawer (When requested) */}
      {showArrivalsDrawer && (
        <div
          className={`absolute top-4 right-4 bottom-6 w-80 md:w-96 rounded-2xl shadow-2xl border backdrop-blur-xl z-30 flex flex-col overflow-hidden animate-[slideInRight_0.25s_ease-out] ${
            isDark ? 'bg-[#181818]/95 border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white/95 border-[#becab6] text-[#1b1c1c]'
          }`}
        >
          {/* Header */}
          <div
            className={`p-3.5 border-b flex items-center justify-between ${
              isDark ? 'bg-[#1e1e1e] border-[#2e2e2e]' : 'bg-[#f7f6f5] border-[#becab6]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006e05] text-[20px]">
                directions_bus
              </span>
              <h3 className="font-bold text-sm">Nearby Stops & Arrivals</h3>
            </div>
            <button
              onClick={() => setShowArrivalsDrawer(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-500/20 text-gray-400 hover:text-inherit transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
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
                        ? 'bg-[#242424] border-[#6cdf5c] ring-1 ring-[#6cdf5c]'
                        : 'bg-[#f5f3f3] border-[#006e05] ring-1 ring-[#006e05]'
                      : isDark
                      ? 'bg-[#1e1e1e] border-[#2e2e2e] hover:bg-[#262626]'
                      : 'bg-white border-[#becab6] hover:bg-[#faf9f8]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-xs leading-tight">{stop.name}</h4>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[12px]">directions_walk</span>
                        {stop.distanceDisplay}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewSchedule(stop);
                      }}
                      className="text-[10px] font-bold text-[#006e05] dark:text-[#6cdf5c] hover:underline"
                    >
                      Timetable
                    </button>
                  </div>

                  {/* Routes */}
                  <div className="space-y-1.5">
                    {stop.routes.map((route, rIdx) => (
                      <div
                        key={rIdx}
                        className={`flex items-center justify-between p-1.5 rounded-lg ${
                          isDark ? 'bg-[#141414]' : 'bg-[#f4f3f2]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-8 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                              route.colorType === 'secondary'
                                ? 'bg-[#1e88e5] text-white'
                                : route.colorType === 'delayed'
                                ? 'bg-[#ff9800] text-black'
                                : route.colorType === 'critical'
                                ? 'bg-[#d32f2f] text-white'
                                : 'bg-[#006e05] text-white'
                            }`}
                          >
                            {route.routeNumber}
                          </div>
                          <span className="text-xs font-semibold truncate text-inherit">
                            {route.routeName}
                          </span>
                        </div>

                        <div className="text-right shrink-0 pl-2">
                          <span
                            className={`font-timer-display text-xs font-bold ${
                              route.status === 'arriving'
                                ? 'text-[#1e88e5] animate-pulse font-black'
                                : route.status === 'delayed'
                                ? 'text-[#ff9800]'
                                : isDark
                                ? 'text-[#e5e2e1]'
                                : 'text-[#1b1c1c]'
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

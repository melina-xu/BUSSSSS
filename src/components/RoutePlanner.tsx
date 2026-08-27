import React, { useState, useEffect } from 'react';
import { ThemeMode, TravelMode, LocationItem, RouteOption, NavigationStep } from '../types';
import { POPULAR_LOCATIONS, getRoutePlans } from '../data/mockData';

interface RoutePlannerProps {
  theme: ThemeMode;
  origin: LocationItem;
  destination: LocationItem;
  travelMode: TravelMode;
  onOriginChange: (loc: LocationItem) => void;
  onDestinationChange: (loc: LocationItem) => void;
  onTravelModeChange: (mode: TravelMode) => void;
  onSelectRoute: (route: RouteOption) => void;
  selectedRoute: RouteOption | null;
  isNavigating: boolean;
  onToggleNavigation: () => void;
  onClosePlanner?: () => void;
  className?: string;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  theme,
  origin,
  destination,
  travelMode,
  onOriginChange,
  onDestinationChange,
  onTravelModeChange,
  onSelectRoute,
  selectedRoute,
  isNavigating,
  onToggleNavigation,
  className = ''
}) => {
  const isDark = theme === 'dark';
  const [originText, setOriginText] = useState(origin.name);
  const [destText, setDestText] = useState(destination.name);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState<RouteOption[]>([]);
  const [showStepDetails, setShowStepDetails] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  // Sync inputs when props change
  useEffect(() => {
    setOriginText(origin.name);
  }, [origin]);

  useEffect(() => {
    setDestText(destination.name);
  }, [destination]);

  // Compute routes whenever origin, destination or mode changes
  useEffect(() => {
    const routes = getRoutePlans(origin, destination, travelMode);
    setAvailableRoutes(routes);
    if (routes.length > 0) {
      if (!selectedRoute || selectedRoute.mode !== travelMode) {
        onSelectRoute(routes[0]);
      } else {
        const found = routes.find((r) => r.id === selectedRoute.id) || routes[0];
        onSelectRoute(found);
      }
    }
  }, [origin, destination, travelMode]);

  const handleSwap = () => {
    const temp = origin;
    onOriginChange(destination);
    onDestinationChange(temp);
  };

  const handleSelectOrigin = (loc: LocationItem) => {
    onOriginChange(loc);
    setOriginText(loc.name);
    setShowOriginDropdown(false);
  };

  const handleSelectDestination = (loc: LocationItem) => {
    onDestinationChange(loc);
    setDestText(loc.name);
    setShowDestDropdown(false);
  };

  const filteredOriginOptions = POPULAR_LOCATIONS.filter(
    (l) =>
      l.id !== destination.id &&
      (l.name.toLowerCase().includes(originText.toLowerCase()) ||
        l.address.toLowerCase().includes(originText.toLowerCase()))
  );

  const filteredDestOptions = POPULAR_LOCATIONS.filter(
    (l) =>
      l.id !== origin.id &&
      (l.name.toLowerCase().includes(destText.toLowerCase()) ||
        l.address.toLowerCase().includes(destText.toLowerCase()))
  );

  return (
    <div
      id="girly-route-planner"
      className={`rounded-3xl shadow-2xl border transition-all duration-300 backdrop-blur-xl flex flex-col z-30 overflow-hidden ${
        isDark
          ? 'bg-[#1e131f]/95 border-[#381a34] text-pink-50'
          : 'bg-white/95 border-pink-200 text-[#371329]'
      } ${isCollapsed ? 'w-80 md:w-96' : 'w-full md:w-[420px]'} ${className}`}
    >
      {/* Top Header & Mode Selector */}
      <div
        className={`p-4 border-b flex flex-col gap-3 ${
          isDark ? 'bg-[#251527] border-[#381a34]' : 'bg-[#fff5f8] border-pink-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-500/25">
              <span className="material-symbols-outlined text-[19px]">alt_route</span>
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight flex items-center gap-1">
                <span>Trip & Route Planner</span>
                <span className="text-xs">🌸</span>
              </span>
              <p className="text-[10px] text-pink-500 font-medium">Smart multi-modal directions</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isDark ? 'hover:bg-[#381a34] text-pink-300' : 'hover:bg-pink-100 text-pink-700'
              }`}
              title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isCollapsed ? 'expand_more' : 'expand_less'}
              </span>
            </button>
          </div>
        </div>

        {/* Travel Mode Switcher Tabs (Transit / Car / Walk) */}
        <div
          className={`grid grid-cols-3 p-1 rounded-2xl border ${
            isDark ? 'bg-[#180e19] border-[#381a34]' : 'bg-pink-100/60 border-pink-200'
          }`}
        >
          <button
            onClick={() => onTravelModeChange('transit')}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              travelMode === 'transit'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30'
                : isDark
                ? 'text-pink-300 hover:text-white'
                : 'text-[#63214c] hover:text-pink-700'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">directions_transit</span>
            <span>Transit 🌸</span>
          </button>

          <button
            onClick={() => onTravelModeChange('car')}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              travelMode === 'car'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30'
                : isDark
                ? 'text-pink-300 hover:text-white'
                : 'text-[#63214c] hover:text-pink-700'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">directions_car</span>
            <span>Drive 🚗</span>
          </button>

          <button
            onClick={() => onTravelModeChange('walk')}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              travelMode === 'walk'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30'
                : isDark
                ? 'text-pink-300 hover:text-white'
                : 'text-[#63214c] hover:text-pink-700'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">directions_walk</span>
            <span>Walk 👟</span>
          </button>
        </div>

        {/* Input Fields for Starting Point & Destination */}
        <div className="relative flex items-center gap-2">
          {/* Visual Track Line between Origin & Destination */}
          <div className="flex flex-col items-center ml-1 shrink-0">
            <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black shadow-sm ring-2 ring-pink-200 dark:ring-pink-900">
              A
            </div>
            <div className="w-0.5 h-6 bg-gradient-to-b from-rose-400 to-pink-400 my-0.5 stroke-dashed"></div>
            <div className="w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px] font-black shadow-sm ring-2 ring-pink-200 dark:ring-pink-900">
              B
            </div>
          </div>

          {/* Text Inputs */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            {/* Origin Input (A) */}
            <div className="relative">
              <input
                type="text"
                value={originText}
                onChange={(e) => {
                  setOriginText(e.target.value);
                  setShowOriginDropdown(true);
                }}
                onFocus={() => setShowOriginDropdown(true)}
                placeholder="Choose starting point 🍓"
                className={`w-full py-2 pl-3 pr-8 rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#180e19] text-pink-100 placeholder-pink-400/50 border border-[#381a34] focus:border-pink-500'
                    : 'bg-white text-[#371329] placeholder-pink-400 border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 shadow-xs'
                }`}
              />
              {originText && (
                <button
                  onClick={() => {
                    setOriginText('');
                    setShowOriginDropdown(true);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              )}

              {/* Origin Autocomplete Suggestions */}
              {showOriginDropdown && filteredOriginOptions.length > 0 && (
                <div
                  className={`absolute left-0 right-0 top-10 rounded-2xl p-1.5 shadow-2xl z-50 border max-h-56 overflow-y-auto ${
                    isDark ? 'bg-[#20121e] border-[#381a34]' : 'bg-white border-pink-200'
                  }`}
                >
                  <div className="text-[10px] font-bold text-pink-500 px-3 py-1 uppercase tracking-wider flex items-center gap-1">
                    <span>🍓</span> Choose Origin
                  </div>
                  {filteredOriginOptions.map((loc) => (
                    <div
                      key={loc.id}
                      onMouseDown={() => handleSelectOrigin(loc)}
                      className={`p-2 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors ${
                        isDark ? 'hover:bg-[#2f182c]' : 'hover:bg-pink-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm">🌸</span>
                        <div className="truncate">
                          <div className="font-bold text-[#371329] dark:text-pink-100">{loc.name}</div>
                          <div className="text-[10px] text-pink-500/70 truncate">{loc.address}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Input (B) */}
            <div className="relative">
              <input
                type="text"
                value={destText}
                onChange={(e) => {
                  setDestText(e.target.value);
                  setShowDestDropdown(true);
                }}
                onFocus={() => setShowDestDropdown(true)}
                placeholder="Choose cute destination 💖"
                className={`w-full py-2 pl-3 pr-8 rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#180e19] text-pink-100 placeholder-pink-400/50 border border-[#381a34] focus:border-pink-500'
                    : 'bg-white text-[#371329] placeholder-pink-400 border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 shadow-xs'
                }`}
              />
              {destText && (
                <button
                  onClick={() => {
                    setDestText('');
                    setShowDestDropdown(true);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              )}

              {/* Destination Autocomplete Suggestions */}
              {showDestDropdown && filteredDestOptions.length > 0 && (
                <div
                  className={`absolute left-0 right-0 top-10 rounded-2xl p-1.5 shadow-2xl z-50 border max-h-56 overflow-y-auto ${
                    isDark ? 'bg-[#20121e] border-[#381a34]' : 'bg-white border-pink-200'
                  }`}
                >
                  <div className="text-[10px] font-bold text-pink-500 px-3 py-1 uppercase tracking-wider flex items-center gap-1">
                    <span>💖</span> Choose Destination
                  </div>
                  {filteredDestOptions.map((loc) => (
                    <div
                      key={loc.id}
                      onMouseDown={() => handleSelectDestination(loc)}
                      className={`p-2 rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors ${
                        isDark ? 'hover:bg-[#2f182c]' : 'hover:bg-pink-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm">✨</span>
                        <div className="truncate">
                          <div className="font-bold text-[#371329] dark:text-pink-100">{loc.name}</div>
                          <div className="text-[10px] text-pink-500/70 truncate">{loc.address}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap Origin / Destination Button */}
          <button
            onClick={handleSwap}
            className={`w-8 h-8 rounded-full border shadow-sm flex items-center justify-center shrink-0 transition-transform active:rotate-180 ${
              isDark
                ? 'bg-[#251527] text-pink-300 border-[#381a34] hover:bg-[#381a34]'
                : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50'
            }`}
            title="Swap Origin & Destination"
          >
            <span className="material-symbols-outlined text-[18px]">swap_vert</span>
          </button>
        </div>

        {/* Quick Landmark Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-0.5 pt-0.5">
          {POPULAR_LOCATIONS.slice(1, 5).map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleSelectDestination(loc)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all ${
                destination.id === loc.id
                  ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                  : isDark
                  ? 'bg-[#180e19] text-pink-200/80 border-[#381a34] hover:border-pink-500'
                  : 'bg-white text-pink-800 border-pink-200 hover:bg-pink-50'
              }`}
            >
              🌸 {loc.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Routes List & Step Details */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-3 max-h-[calc(100vh-320px)]">
          {/* Route Options Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-500 flex items-center gap-1">
              <span>✨</span>
              <span>Recommended Routes ({availableRoutes.length})</span>
            </span>
            {selectedRoute && (
              <span className="text-[11px] font-bold text-pink-500/80">
                {selectedRoute.distanceKm} km
              </span>
            )}
          </div>

          {/* Route Options Cards */}
          <div className="space-y-2.5">
            {availableRoutes.map((route) => {
              const isSelected = selectedRoute?.id === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => onSelectRoute(route)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? isDark
                        ? 'bg-[#2a172a] border-pink-500 ring-2 ring-pink-500/40 shadow-lg'
                        : 'bg-[#fff5f8] border-pink-400 ring-2 ring-pink-300 shadow-md'
                      : isDark
                      ? 'bg-[#180e19] border-[#381a34] hover:bg-[#241323]'
                      : 'bg-white border-pink-200/80 hover:bg-pink-50/50'
                  }`}
                >
                  {/* Recommended Badge */}
                  {route.isRecommended && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-pink-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl shadow-xs">
                      💖 Sweetest Route
                    </div>
                  )}

                  {/* Duration, Title & Arrival Time */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-[#371329] dark:text-pink-100">
                          {route.durationMinutes} min
                        </span>
                        {route.isFastest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border border-pink-300/60">
                            ✨ Fastest
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-pink-500 font-medium">
                        {route.departureTime} – {route.arrivalTime}
                      </div>
                    </div>

                    <div className="text-right">
                      {route.cost && (
                        <div className="text-xs font-black text-rose-500 dark:text-rose-400">
                          {route.cost}
                        </div>
                      )}
                      {route.carbonSavedKg && (
                        <div className="text-[10px] font-bold text-pink-600 dark:text-pink-300 flex items-center justify-end gap-0.5">
                          <span>🌸</span>
                          <span>-{route.carbonSavedKg} kg CO₂</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary / Via Description */}
                  <p className="text-xs text-[#501c3d] dark:text-pink-200/80 font-medium mb-2.5">
                    {route.title}
                  </p>

                  {/* Transit Pill Badges */}
                  {route.transitBadges && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {route.transitBadges.map((badge, bIdx) => (
                        <React.Fragment key={bIdx}>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs"
                            style={{
                              backgroundColor: badge.type === 'walk' ? '#fce7f3' : badge.bg,
                              color: badge.type === 'walk' ? '#be185d' : badge.color
                            }}
                          >
                            {badge.label}
                          </span>
                          {bIdx < route.transitBadges.length - 1 && (
                            <span className="text-[10px] text-pink-300">›</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Route Turn-by-Turn Guidance Accordion */}
          {selectedRoute && (
            <div
              className={`rounded-2xl p-3.5 border transition-all ${
                isDark ? 'bg-[#180e19] border-[#381a34]' : 'bg-[#fff5f8]/70 border-pink-200'
              }`}
            >
              <div
                onClick={() => setShowStepDetails(!showStepDetails)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-pink-500 text-[18px]">
                    list_alt
                  </span>
                  <span className="font-extrabold text-xs text-[#371329] dark:text-pink-100">
                    Turn-by-Turn Steps ({selectedRoute.steps.length})
                  </span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-pink-400">
                  {showStepDetails ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              {showStepDetails && (
                <div className="mt-3.5 space-y-3 pl-1">
                  {selectedRoute.steps.map((step, idx) => {
                    const isExpanded = expandedStepId === step.id;
                    return (
                      <div key={step.id} className="relative pl-6">
                        {/* Vertical timeline connector line */}
                        {idx < selectedRoute.steps.length - 1 && (
                          <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-pink-200 dark:bg-pink-900/60" />
                        )}

                        {/* Step Icon Pin */}
                        <div
                          className={`absolute left-0 top-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-[#180e19] ${
                            step.mode === 'walk'
                              ? 'bg-pink-100 text-pink-600'
                              : step.mode === 'mrt'
                              ? 'bg-rose-500 text-white'
                              : step.mode === 'bus'
                              ? 'bg-pink-600 text-white'
                              : 'bg-purple-600 text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            {step.icon}
                          </span>
                        </div>

                        {/* Step Details */}
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-bold text-xs leading-tight text-[#371329] dark:text-pink-100">
                              {step.instruction}
                            </div>
                            <span className="text-[10px] font-bold text-pink-500 shrink-0">
                              {step.durationMinutes}m
                            </span>
                          </div>

                          {step.detail && (
                            <p className="text-[11px] text-pink-600/80 dark:text-pink-300/80 mt-0.5">
                              {step.detail}
                            </p>
                          )}

                          {/* Expandable intermediate stops list */}
                          {step.stopCount && step.stopsList && (
                            <div className="mt-1.5">
                              <button
                                onClick={() =>
                                  setExpandedStepId(isExpanded ? null : step.id)
                                }
                                className="text-[10px] font-bold text-pink-600 dark:text-pink-300 hover:underline flex items-center gap-1"
                              >
                                <span>
                                  {isExpanded ? 'Hide' : `Ride ${step.stopCount} stops`}
                                </span>
                                <span className="material-symbols-outlined text-[13px]">
                                  {isExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="mt-2 pl-3 border-l-2 border-dashed border-pink-300 dark:border-pink-800 space-y-1">
                                  {step.stopsList.map((stName, sIdx) => (
                                    <div
                                      key={sIdx}
                                      className="text-[10px] text-[#501c3d] dark:text-pink-200/80 flex items-center gap-1.5"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                                      <span>{stName}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Start Live Navigation Preview Button */}
          {selectedRoute && (
            <div className="pt-1">
              <button
                onClick={onToggleNavigation}
                className={`w-full py-3 px-4 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isNavigating
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25'
                    : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-500/30 hover:scale-[1.02]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isNavigating ? 'stop_circle' : 'navigation'}
                </span>
                <span>
                  {isNavigating ? 'Stop Live Navigation Preview' : 'Start Live Trip Preview ✨'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

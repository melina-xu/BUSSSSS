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
      // If current selected route isn't in new mode, select first
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
      id="google-maps-route-planner"
      className={`rounded-2xl shadow-2xl border transition-all duration-300 backdrop-blur-xl flex flex-col z-30 ${
        isDark
          ? 'bg-[#181818]/95 border-[#2e2e2e] text-[#e5e2e1]'
          : 'bg-white/95 border-[#becab6] text-[#1b1c1c]'
      } ${isCollapsed ? 'w-80 md:w-96' : 'w-full md:w-[410px]'} ${className}`}
    >
      {/* Top Header & Mode Selector */}
      <div
        className={`p-3.5 border-b flex flex-col gap-2.5 ${
          isDark ? 'bg-[#1e1e1e] border-[#2e2e2e]' : 'bg-[#f7f6f5] border-[#becab6]'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#006e05] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
            </div>
            <span className="font-bold text-sm tracking-tight">Directions & Routing</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isDark ? 'hover:bg-[#2a2a2a] text-gray-400' : 'hover:bg-[#e4e2e2] text-gray-600'
              }`}
              title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isCollapsed ? 'expand_more' : 'expand_less'}
              </span>
            </button>
          </div>
        </div>

        {/* Travel Mode Switcher Tabs (Transit / Car / Walk) */}
        <div
          className={`grid grid-cols-3 p-1 rounded-xl border ${
            isDark ? 'bg-[#131313] border-[#2e2e2e]' : 'bg-[#e9e8e7] border-[#becab6]'
          }`}
        >
          <button
            onClick={() => onTravelModeChange('transit')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              travelMode === 'transit'
                ? isDark
                  ? 'bg-[#37ab2e] text-[#003701] shadow-md'
                  : 'bg-[#006e05] text-white shadow-md'
                : isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_transit</span>
            <span>Transit</span>
          </button>

          <button
            onClick={() => onTravelModeChange('car')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              travelMode === 'car'
                ? isDark
                  ? 'bg-[#37ab2e] text-[#003701] shadow-md'
                  : 'bg-[#006e05] text-white shadow-md'
                : isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_car</span>
            <span>Driving</span>
          </button>

          <button
            onClick={() => onTravelModeChange('walk')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              travelMode === 'walk'
                ? isDark
                  ? 'bg-[#37ab2e] text-[#003701] shadow-md'
                  : 'bg-[#006e05] text-white shadow-md'
                : isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_walk</span>
            <span>Walk</span>
          </button>
        </div>
      </div>

      {/* Origin and Destination Input Box */}
      <div className="p-3.5 border-b border-inherit relative">
        <div className="flex items-center gap-2">
          {/* Visual Track Line Indicator */}
          <div className="flex flex-col items-center py-2 shrink-0">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#006e05] bg-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#006e05]"></div>
            </div>
            <div className={`w-0.5 h-7 border-l-2 border-dotted my-0.5 ${isDark ? 'border-gray-600' : 'border-gray-400'}`}></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#d32f2f] flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px] text-white font-black">place</span>
            </div>
          </div>

          {/* Input Fields */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Origin Input */}
            <div className="relative">
              <input
                id="origin-location-input"
                type="text"
                value={originText}
                onChange={(e) => {
                  setOriginText(e.target.value);
                  setShowOriginDropdown(true);
                }}
                onFocus={() => setShowOriginDropdown(true)}
                placeholder="Choose starting point or click map..."
                className={`w-full text-xs font-medium py-2 pl-3 pr-7 rounded-xl transition-all focus:outline-none ${
                  isDark
                    ? 'bg-[#222222] text-[#e5e2e1] placeholder-gray-500 border border-[#333333] focus:border-[#6cdf5c]'
                    : 'bg-[#f4f3f2] text-[#1b1c1c] placeholder-gray-500 border border-[#e0dedc] focus:bg-white focus:border-[#006e05] focus:ring-1 focus:ring-[#006e05]'
                }`}
              />
              {originText && (
                <button
                  onClick={() => {
                    setOriginText('');
                    setShowOriginDropdown(true);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}

              {/* Origin Autocomplete Dropdown */}
              {showOriginDropdown && filteredOriginOptions.length > 0 && (
                <div
                  className={`absolute top-10 left-0 right-0 rounded-xl p-1.5 shadow-2xl z-50 border max-h-56 overflow-y-auto ${
                    isDark ? 'bg-[#202020] border-[#383838]' : 'bg-white border-[#becab6]'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 text-gray-400">
                    Suggested Starting Points
                  </div>
                  {filteredOriginOptions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectOrigin(item)}
                      className={`p-2 rounded-lg cursor-pointer flex items-center gap-2.5 transition-colors ${
                        isDark ? 'hover:bg-[#2c2c2c]' : 'hover:bg-[#f5f3f3]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#006e05]">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-400 truncate">{item.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Input */}
            <div className="relative">
              <input
                id="destination-location-input"
                type="text"
                value={destText}
                onChange={(e) => {
                  setDestText(e.target.value);
                  setShowDestDropdown(true);
                }}
                onFocus={() => setShowDestDropdown(true)}
                placeholder="Choose destination..."
                className={`w-full text-xs font-medium py-2 pl-3 pr-7 rounded-xl transition-all focus:outline-none ${
                  isDark
                    ? 'bg-[#222222] text-[#e5e2e1] placeholder-gray-500 border border-[#333333] focus:border-[#6cdf5c]'
                    : 'bg-[#f4f3f2] text-[#1b1c1c] placeholder-gray-500 border border-[#e0dedc] focus:bg-white focus:border-[#006e05] focus:ring-1 focus:ring-[#006e05]'
                }`}
              />
              {destText && (
                <button
                  onClick={() => {
                    setDestText('');
                    setShowDestDropdown(true);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}

              {/* Destination Autocomplete Dropdown */}
              {showDestDropdown && filteredDestOptions.length > 0 && (
                <div
                  className={`absolute top-10 left-0 right-0 rounded-xl p-1.5 shadow-2xl z-50 border max-h-56 overflow-y-auto ${
                    isDark ? 'bg-[#202020] border-[#383838]' : 'bg-white border-[#becab6]'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 text-gray-400">
                    Suggested Destinations
                  </div>
                  {filteredDestOptions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectDestination(item)}
                      className={`p-2 rounded-lg cursor-pointer flex items-center gap-2.5 transition-colors ${
                        isDark ? 'hover:bg-[#2c2c2c]' : 'hover:bg-[#f5f3f3]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#d32f2f]">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-400 truncate">{item.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:rotate-180 border shadow-sm ${
              isDark
                ? 'bg-[#262626] border-[#383838] text-[#6cdf5c] hover:bg-[#333333]'
                : 'bg-white border-[#becab6] text-[#006e05] hover:bg-[#f5f3f3]'
            }`}
            title="Swap Starting point and Destination"
          >
            <span className="material-symbols-outlined text-[18px]">swap_vert</span>
          </button>
        </div>

        {/* Quick Destination Chips */}
        <div className="flex gap-1.5 pt-2.5 overflow-x-auto scrollbar-hide">
          {POPULAR_LOCATIONS.filter((l) => l.id !== origin.id && l.id !== destination.id).slice(0, 4).map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectDestination(preset)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border flex items-center gap-1 ${
                isDark
                  ? 'bg-[#222222] border-[#333333] text-gray-300 hover:border-[#6cdf5c] hover:text-white'
                  : 'bg-[#f4f3f2] border-[#e0dedc] text-[#3f4a3a] hover:border-[#006e05] hover:bg-white'
              }`}
            >
              <span className="material-symbols-outlined text-[13px] text-[#006e05]">
                {preset.icon}
              </span>
              <span>{preset.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Route Options Comparison List */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5 max-h-[calc(100vh-360px)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">
            Available Routes ({availableRoutes.length})
          </div>

          {availableRoutes.map((route) => {
            const isSelected = selectedRoute?.id === route.id;
            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? isDark
                      ? 'bg-[#242424] border-[#6cdf5c] ring-1 ring-[#6cdf5c] shadow-lg'
                      : 'bg-[#f5f3f3] border-[#006e05] ring-1 ring-[#006e05] shadow-md'
                    : isDark
                    ? 'bg-[#1e1e1e] border-[#2e2e2e] hover:bg-[#262626]'
                    : 'bg-white border-[#becab6] hover:bg-[#faf9f8]'
                }`}
              >
                {/* Route Header summary */}
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-timer-display text-lg font-black text-inherit">
                        {route.durationMinutes} min
                      </span>
                      <span className="text-xs text-gray-400">({route.distanceKm} km)</span>

                      {route.isFastest && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#37ab2e]/15 text-[#37ab2e] uppercase">
                          Fastest
                        </span>
                      )}
                      {route.trafficCondition === 'fast' && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500">
                          Light Traffic
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5">{route.viaSummary}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-inherit">{route.arrivalTime}</div>
                    <div className="text-[10px] text-gray-400">Arrive</div>
                  </div>
                </div>

                {/* Transit Segment Badges */}
                {route.transitBadges && route.transitBadges.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap my-2">
                    {route.transitBadges.map((badge, bIdx) => (
                      <React.Fragment key={bIdx}>
                        <span
                          className="px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 shadow-xs"
                          style={{ backgroundColor: badge.bg, color: badge.color }}
                        >
                          {badge.type === 'walk' && (
                            <span className="material-symbols-outlined text-[13px]">directions_walk</span>
                          )}
                          {badge.type === 'mrt' && (
                            <span className="material-symbols-outlined text-[13px]">train</span>
                          )}
                          {badge.type === 'bus' && (
                            <span className="material-symbols-outlined text-[13px]">directions_bus</span>
                          )}
                          <span>{badge.label}</span>
                        </span>
                        {bIdx < route.transitBadges.length - 1 && (
                          <span className="material-symbols-outlined text-[14px] text-gray-400">
                            chevron_right
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Additional metadata tags (Cost, Carbon savings, Headway) */}
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-inherit/40 mt-2">
                  <div className="flex items-center gap-2">
                    {route.cost && (
                      <span className="font-semibold text-inherit flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">payments</span>
                        {route.cost}
                      </span>
                    )}
                    {route.carbonSavedKg !== undefined && (
                      <span className="text-[#37ab2e] font-semibold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[13px]">eco</span>
                        -{route.carbonSavedKg} kg CO₂
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-medium text-inherit">
                    Departs {route.departureTime}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Step-by-Step Navigation Drawer for Selected Route */}
          {selectedRoute && (
            <div
              className={`rounded-xl border p-3 mt-2 ${
                isDark ? 'bg-[#151515] border-[#2e2e2e]' : 'bg-[#f4f3f2] border-[#becab6]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowStepDetails(!showStepDetails)}
                  className="flex items-center gap-1.5 text-xs font-bold text-inherit hover:text-[#006e05] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {showStepDetails ? 'expand_more' : 'chevron_right'}
                  </span>
                  <span>Turn-by-Turn Steps ({selectedRoute.steps.length})</span>
                </button>

                <button
                  id="start-live-navigation-btn"
                  onClick={onToggleNavigation}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1 shadow-sm transition-all ${
                    isNavigating
                      ? 'bg-[#d32f2f] text-white animate-pulse'
                      : 'bg-[#006e05] hover:bg-[#37ab2e] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {isNavigating ? 'stop_circle' : 'navigation'}
                  </span>
                  <span>{isNavigating ? 'Exit Nav' : 'Start Preview'}</span>
                </button>
              </div>

              {showStepDetails && (
                <div className="space-y-2.5 pt-1 border-t border-inherit/40">
                  {selectedRoute.steps.map((step, sIdx) => {
                    const isExpanded = expandedStepId === step.id;
                    return (
                      <div key={step.id} className="relative pl-6 pb-2 last:pb-0">
                        {/* Step Connection vertical timeline */}
                        {sIdx < selectedRoute.steps.length - 1 && (
                          <div
                            className={`absolute left-2.5 top-5 bottom-0 w-0.5 ${
                              isDark ? 'bg-gray-700' : 'bg-gray-300'
                            }`}
                          />
                        )}

                        {/* Step Icon Node */}
                        <div
                          className={`absolute left-0 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-xs ${
                            step.mode === 'mrt'
                              ? 'bg-[#d32f2f]'
                              : step.mode === 'bus'
                              ? 'bg-[#006e05]'
                              : step.mode === 'car'
                              ? 'bg-[#1e88e5]'
                              : 'bg-gray-500'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[12px]">{step.icon}</span>
                        </div>

                        {/* Step Content */}
                        <div>
                          <div className="flex items-baseline justify-between">
                            <p className="text-xs font-bold leading-tight text-inherit">
                              {step.instruction}
                            </p>
                            <span className="text-[10px] font-semibold text-gray-400 shrink-0 ml-2">
                              {step.distanceDisplay}
                            </span>
                          </div>

                          {step.detail && (
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                              {step.detail}
                            </p>
                          )}

                          {/* Intermediate Transit Stops Breakdown */}
                          {step.stopsList && step.stopsList.length > 0 && (
                            <div className="mt-1">
                              <button
                                onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                                className="text-[10px] font-bold text-[#006e05] dark:text-[#6cdf5c] flex items-center gap-0.5 hover:underline"
                              >
                                <span>{step.stopCount || step.stopsList.length} intermediate stops</span>
                                <span className="material-symbols-outlined text-[13px]">
                                  {isExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                              </button>

                              {isExpanded && (
                                <ul className="pl-3 py-1 space-y-0.5 border-l border-[#006e05]/30 my-1">
                                  {step.stopsList.map((stopName, idx) => (
                                    <li key={idx} className="text-[10px] text-gray-400 flex items-center gap-1">
                                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                      <span>{stopName}</span>
                                    </li>
                                  ))}
                                </ul>
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
        </div>
      )}
    </div>
  );
};

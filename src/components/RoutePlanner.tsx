import React, { useState, useEffect } from 'react';
import { ThemeMode, TravelMode, LocationItem, RouteOption } from '../types';
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
      id="aether-quant-route-planner"
      className={`rounded-2xl shadow-2xl border transition-all duration-300 backdrop-blur-xl flex flex-col z-30 overflow-hidden font-sans ${
        isDark
          ? 'bg-[#090d16]/95 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-300 text-slate-900'
      } ${isCollapsed ? 'w-80 md:w-96' : 'w-full md:w-[420px]'} ${className}`}
    >
      {/* Top Header & Mode Selector */}
      <div
        className={`p-4 border-b flex flex-col gap-3 ${
          isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <span className="material-symbols-outlined text-[19px]">alt_route</span>
            </div>
            <div>
              <span className="font-extrabold text-xs font-mono tracking-tight text-white dark:text-white flex items-center gap-1.5">
                <span>NEURAL ROUTE ARBITRAGE</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI v4.8
                </span>
              </span>
              <p className="text-[10px] font-mono text-slate-400">High-speed latency optimization</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
              }`}
              title={isCollapsed ? 'Expand cockpit' : 'Collapse cockpit'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isCollapsed ? 'expand_more' : 'expand_less'}
              </span>
            </button>
          </div>
        </div>

        {/* Travel Mode Switcher Tabs */}
        <div
          className={`grid grid-cols-3 p-1 rounded-xl border ${
            isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-200/70 border-slate-300'
          }`}
        >
          <button
            onClick={() => onTravelModeChange('transit')}
            className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
              travelMode === 'transit'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">train</span>
            <span>HSR / Metro</span>
          </button>

          <button
            onClick={() => onTravelModeChange('car')}
            className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
              travelMode === 'car'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">local_taxi</span>
            <span>Autonomous</span>
          </button>

          <button
            onClick={() => onTravelModeChange('walk')}
            className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
              travelMode === 'walk'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">directions_walk</span>
            <span>Skybridge</span>
          </button>
        </div>

        {/* Input Fields for Starting Point & Destination */}
        <div className="relative flex items-center gap-2 font-mono">
          {/* Visual Track Line */}
          <div className="flex flex-col items-center ml-1 shrink-0">
            <div className="w-5 h-5 rounded bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-xs">
              A
            </div>
            <div className="w-0.5 h-6 bg-slate-700 my-0.5"></div>
            <div className="w-5 h-5 rounded bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-xs">
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
                placeholder="Origin Node or GPS Coordinates..."
                className={`w-full py-1.5 pl-3 pr-7 rounded-lg text-xs font-mono font-semibold focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#06080d] text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-cyan-500'
                    : 'bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:border-cyan-600 shadow-xs'
                }`}
              />
              {originText && (
                <button
                  onClick={() => {
                    setOriginText('');
                    setShowOriginDropdown(true);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}

              {/* Origin Autocomplete */}
              {showOriginDropdown && filteredOriginOptions.length > 0 && (
                <div
                  className={`absolute left-0 right-0 top-9 rounded-xl p-1.5 shadow-2xl z-50 border max-h-56 overflow-y-auto ${
                    isDark ? 'bg-[#0d121f] border-slate-700' : 'bg-white border-slate-300'
                  }`}
                >
                  <div className="text-[9px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                    Matched Origin Corridors
                  </div>
                  {filteredOriginOptions.map((loc) => (
                    <div
                      key={loc.id}
                      onMouseDown={() => handleSelectOrigin(loc)}
                      className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-[16px] text-cyan-400">fidget_spinner</span>
                        <div className="truncate">
                          <div className="font-bold text-slate-200">{loc.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{loc.address}</div>
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
                placeholder="Target Destination Hub..."
                className={`w-full py-1.5 pl-3 pr-7 rounded-lg text-xs font-mono font-semibold focus:outline-none transition-all ${
                  isDark
                    ? 'bg-[#06080d] text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-cyan-500'
                    : 'bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:border-cyan-600 shadow-xs'
                }`}
              />
              {destText && (
                <button
                  onClick={() => {
                    setDestText('');
                    setShowDestDropdown(true);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}

              {/* Destination Autocomplete */}
              {showDestDropdown && filteredDestOptions.length > 0 && (
                <div
                  className={`absolute left-0 right-0 top-9 rounded-xl p-1.5 shadow-2xl z-50 border max-h-56 overflow-y-auto ${
                    isDark ? 'bg-[#0d121f] border-slate-700' : 'bg-white border-slate-300'
                  }`}
                >
                  <div className="text-[9px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                    Matched Destination Targets
                  </div>
                  {filteredDestOptions.map((loc) => (
                    <div
                      key={loc.id}
                      onMouseDown={() => handleSelectDestination(loc)}
                      className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition-colors ${
                        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-[16px] text-amber-400">corporate_fare</span>
                        <div className="truncate">
                          <div className="font-bold text-slate-200">{loc.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{loc.address}</div>
                        </div>
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
            className={`w-7 h-7 rounded-lg border shadow-xs flex items-center justify-center shrink-0 transition-transform active:rotate-180 ${
              isDark
                ? 'bg-[#0d121f] text-cyan-400 border-slate-700 hover:bg-slate-800'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
            title="Invert Origin & Destination Vectors"
          >
            <span className="material-symbols-outlined text-[16px]">swap_vert</span>
          </button>
        </div>

        {/* Quick Hub Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-0.5 pt-0.5 font-mono">
          {POPULAR_LOCATIONS.slice(1, 5).map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleSelectDestination(loc)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border transition-all ${
                destination.id === loc.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-xs'
                  : isDark
                  ? 'bg-[#06080d] text-slate-400 border-slate-800 hover:border-slate-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              [{loc.quantCode || 'NODE'}]
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Route Options & Quantitative Step Guidance */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 max-h-[calc(100vh-320px)]">
          {/* Header */}
          <div className="flex items-center justify-between px-1 font-mono">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <span>ALPHA CORRIDOR OPTIONS ({availableRoutes.length})</span>
            </span>
            {selectedRoute && (
              <span className="text-[10px] font-bold text-slate-400">
                {selectedRoute.distanceKm} km • {selectedRoute.neuralConfidence}% CONF
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
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden font-mono ${
                    isSelected
                      ? isDark
                        ? 'bg-cyan-950/30 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg'
                        : 'bg-cyan-50 border-cyan-600 ring-1 ring-cyan-600 shadow-md'
                      : isDark
                      ? 'bg-[#0b0f19] border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Recommended Badge */}
                  {route.isRecommended && (
                    <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg font-mono">
                      ALPHA LEAD
                    </div>
                  )}

                  {/* Duration & Delta */}
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white dark:text-white">
                          {route.durationMinutes} min
                        </span>
                        {route.alphaTimeSavedMin ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            +{route.alphaTimeSavedMin}m Alpha
                          </span>
                        ) : null}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {route.departureTime} → {route.arrivalTime}
                      </div>
                    </div>

                    <div className="text-right">
                      {route.cost && (
                        <div className="text-xs font-black text-amber-400 font-mono">
                          {route.cost}
                        </div>
                      )}
                      <div className="text-[9px] text-slate-400">
                        Vol: <span className="text-emerald-400 font-bold">{route.volatilityRating || 'LOW'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Title */}
                  <p className="text-xs text-slate-300 font-sans font-medium mb-2">
                    {route.title}
                  </p>

                  {/* Transit Badges */}
                  {route.transitBadges && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {route.transitBadges.map((badge, bIdx) => (
                        <React.Fragment key={bIdx}>
                          <span
                            className="px-2 py-0.5 rounded text-[9px] font-mono font-bold"
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color
                            }}
                          >
                            {badge.label}
                          </span>
                          {bIdx < route.transitBadges.length - 1 && (
                            <span className="text-[10px] text-slate-600">›</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Turn-by-Turn Steps */}
          {selectedRoute && (
            <div
              className={`rounded-xl p-3 border transition-all ${
                isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div
                onClick={() => setShowStepDetails(!showStepDetails)}
                className="flex items-center justify-between cursor-pointer font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-[16px]">
                    alt_route
                  </span>
                  <span className="font-extrabold text-[11px] text-slate-200 uppercase">
                    Vector Steps Telemetry ({selectedRoute.steps.length})
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  {showStepDetails ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              {showStepDetails && (
                <div className="mt-3 space-y-2.5 pl-1 font-mono">
                  {selectedRoute.steps.map((step, idx) => {
                    const isExpanded = expandedStepId === step.id;
                    return (
                      <div key={step.id} className="relative pl-5">
                        {/* Timeline connector */}
                        {idx < selectedRoute.steps.length - 1 && (
                          <div className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-slate-800" />
                        )}

                        {/* Step Icon */}
                        <div className="absolute left-0 top-0.5 w-4 h-4 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-[10px]">
                          <span className="material-symbols-outlined text-[11px]">
                            {step.icon}
                          </span>
                        </div>

                        {/* Step Details */}
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-bold text-xs leading-tight text-slate-200 font-sans">
                              {step.instruction}
                            </div>
                            <span className="text-[10px] font-bold text-cyan-400 shrink-0 font-mono">
                              {step.durationMinutes}m
                            </span>
                          </div>

                          {step.detail && (
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                              {step.detail}
                            </p>
                          )}

                          {/* Expandable stops */}
                          {step.stopCount && step.stopsList && (
                            <div className="mt-1">
                              <button
                                onClick={() =>
                                  setExpandedStepId(isExpanded ? null : step.id)
                                }
                                className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                              >
                                <span>
                                  {isExpanded ? 'Hide stops' : `Corridor: ${step.stopCount} intermediate nodes`}
                                </span>
                                <span className="material-symbols-outlined text-[12px]">
                                  {isExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="mt-1.5 pl-2.5 border-l border-slate-700 space-y-1">
                                  {step.stopsList.map((stName, sIdx) => (
                                    <div
                                      key={sIdx}
                                      className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
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

          {/* Start Simulation Execution Button */}
          {selectedRoute && (
            <div className="pt-1">
              <button
                onClick={onToggleNavigation}
                className={`w-full py-2.5 px-4 rounded-xl font-mono font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isNavigating
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {isNavigating ? 'stop_circle' : 'bolt'}
                </span>
                <span>
                  {isNavigating ? 'TERMINATE TELEMETRY SIMULATION' : 'EXECUTE NEURAL ROUTE SIMULATION'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

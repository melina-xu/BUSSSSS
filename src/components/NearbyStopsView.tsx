import React, { useState } from 'react';
import { TransitStop, ThemeMode, TransportMode } from '../types';
import { InteractiveMap } from './InteractiveMap';

interface NearbyStopsViewProps {
  theme: ThemeMode;
  activeCity: string;
  stops: TransitStop[];
  selectedStop: TransitStop | null;
  onSelectStop: (stop: TransitStop) => void;
  onViewSchedule: (stop: TransitStop) => void;
}

export const NearbyStopsView: React.FC<NearbyStopsViewProps> = ({
  theme,
  activeCity,
  stops,
  selectedStop,
  onSelectStop,
  onViewSchedule
}) => {
  const isDark = theme === 'dark';
  const [stopSearch, setStopSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<TransportMode>('all');
  const [sortDistance, setSortDistance] = useState(true);

  const filteredStops = stops
    .filter((stop) => {
      const matchSearch =
        stop.name.toLowerCase().includes(stopSearch.toLowerCase()) ||
        stop.code.includes(stopSearch) ||
        stop.routes.some((r) => r.routeNumber.toLowerCase().includes(stopSearch.toLowerCase()) || r.routeName.toLowerCase().includes(stopSearch.toLowerCase()));
      return matchSearch;
    })
    .sort((a, b) => (sortDistance ? a.walkTimeMins - b.walkTimeMins : 0));

  return (
    <div id="nearby-stops-view" className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Left Panel: Stops List (450px on desktop) */}
      <div
        className={`w-full md:w-[450px] shrink-0 flex flex-col border-r z-10 shadow-[4px_0_12px_rgba(0,0,0,0.05)] transition-colors ${
          isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-[#efeded] border-[#becab6] text-[#1b1c1c]'
        }`}
      >
        {/* List Header & Search */}
        <div
          className={`p-5 sticky top-0 z-20 flex flex-col gap-3.5 border-b shadow-sm ${
            isDark ? 'bg-[#131313] border-[#2e2e2e]' : 'bg-white border-[#becab6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <h1 className="font-black text-2xl tracking-tight">Explore Stops</h1>
            <span className="text-xs font-semibold text-gray-400">
              {filteredStops.length} stops nearby
            </span>
          </div>

          {/* Search Box */}
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#37ab2e] text-[20px] transition-colors">
              explore
            </span>
            <input
              type="text"
              value={stopSearch}
              onChange={(e) => setStopSearch(e.target.value)}
              placeholder="Search by street or stop ID..."
              className={`w-full text-sm py-2.5 pl-11 pr-3 rounded-xl transition-all focus:outline-none ${
                isDark
                  ? 'bg-[#201f1f] text-[#e5e2e1] placeholder-[#9ca3af] focus:ring-2 focus:ring-[#6cdf5c]'
                  : 'bg-[#f5f3f3] text-[#1b1c1c] placeholder-[#3f4a3a] focus:ring-2 focus:ring-[#006e05] focus:bg-white'
              }`}
            />
            {stopSearch && (
              <button
                onClick={() => setStopSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-200"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Filters & Sort Controls */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-[#37ab2e]">my_location</span>
              <span>Downtown Core</span>
            </div>

            <button
              onClick={() => setSortDistance(!sortDistance)}
              className="flex items-center gap-1 font-bold text-[#37ab2e] hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">sort</span>
              <span>Distance</span>
            </button>
          </div>

          {/* Transport Mode Pills */}
          <div className="flex gap-2 pt-1 overflow-x-auto scrollbar-hide">
            {(['all', 'bus', 'subway', 'ferry'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveFilter(mode)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  activeFilter === mode
                    ? 'bg-[#37ab2e] text-[#003701] shadow-sm'
                    : isDark
                    ? 'bg-[#2a2a2a] text-[#becab6] hover:bg-[#353534]'
                    : 'bg-[#e4e2e2] text-[#3f4a3a] hover:bg-[#dbd9d9]'
                }`}
              >
                {mode === 'all' ? 'All Modes' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Stops List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
          {filteredStops.map((stop) => {
            const isSelected = selectedStop?.id === stop.id;
            return (
              <div
                key={stop.id}
                onClick={() => onSelectStop(stop)}
                className={`rounded-2xl p-4 shadow-sm relative overflow-hidden group cursor-pointer transition-all ${
                  isSelected
                    ? isDark
                      ? 'bg-[#242424] ring-2 ring-[#6cdf5c] shadow-lg'
                      : 'bg-white ring-2 ring-[#006e05] shadow-md'
                    : isDark
                    ? 'bg-[#1c1b1b] hover:bg-[#201f1f] hover:shadow-md'
                    : 'bg-white hover:bg-[#fbf9f8] hover:shadow-md'
                }`}
              >
                {/* Active Indicator Bar on Left */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#006e05]" />
                )}

                {/* Stop Header */}
                <div className="flex justify-between items-start mb-3 pl-1">
                  <div>
                    <h2 className="font-bold text-base text-inherit group-hover:text-[#37ab2e] transition-colors">
                      {stop.name}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">directions_walk</span>
                        {stop.walkTimeMins} min
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-400" />
                      <span>Stop ID: {stop.code}</span>
                    </div>
                  </div>

                  {/* Weather Micro-widget */}
                  <div
                    className={`flex flex-col items-end px-2 py-1 rounded-lg ${
                      isDark ? 'bg-[#2a2a2a]' : 'bg-[#f5f3f3]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#37ab2e] mb-0.5">
                      {stop.weatherIcon || 'partly_cloudy_day'}
                    </span>
                    <span className="text-xs font-bold">{stop.temp}</span>
                  </div>
                </div>

                {/* Routes At This Stop */}
                <div className="space-y-2">
                  {stop.routes.map((route, rIdx) => (
                    <div
                      key={rIdx}
                      className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                        isDark ? 'bg-[#131313]' : 'bg-[#f5f3f3]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-11 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            route.colorType === 'secondary'
                              ? 'bg-[#1e88e5] text-white'
                              : route.colorType === 'pink'
                              ? 'bg-[#f85d9d] text-white'
                              : route.colorType === 'delayed'
                              ? 'bg-[#ff9800] text-black font-extrabold'
                              : route.colorType === 'critical'
                              ? 'bg-[#d32f2f] text-white'
                              : route.colorType === 'blue'
                              ? 'bg-[#3394f1] text-white'
                              : 'bg-[#006e05] text-white'
                          }`}
                        >
                          {route.routeNumber}
                        </div>
                        <span className="text-xs font-semibold truncate text-inherit">{route.routeName}</span>
                      </div>

                      {/* Timers list: Primary (bold/pulsing) + Secondary small times */}
                      {route.primaryTime === 'No Service' || route.status === 'critical' ? (
                        <span className="text-[11px] font-bold text-[#d32f2f] bg-[#ffdad6]/60 dark:bg-[#93000a]/40 px-2 py-0.5 rounded-md">
                          No Service
                        </span>
                      ) : (
                        <div className="flex items-baseline gap-2 shrink-0">
                          <span
                            className={`font-timer-display text-base ${
                              route.status === 'arriving'
                                ? 'text-[#1e88e5] animate-pulse font-extrabold'
                                : route.status === 'delayed'
                                ? 'text-[#ff9800]'
                                : route.status === 'on-time'
                                ? 'text-[#37ab2e]'
                                : 'text-inherit'
                            }`}
                          >
                            {route.primaryTime}
                          </span>
                          {route.secondaryTimes &&
                            route.secondaryTimes.map((sec, sIdx) => (
                              <span key={sIdx} className="text-xs text-gray-400 pb-0.5">
                                {sec}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Map Integration */}
      <div className="flex-1 relative bg-surface-dim">
        <InteractiveMap
          theme={theme}
          activeCity={activeCity}
          stops={stops}
          selectedStop={selectedStop || stops[0]}
          onSelectStop={onSelectStop}
          onViewSchedule={onViewSchedule}
        />
      </div>
    </div>
  );
};

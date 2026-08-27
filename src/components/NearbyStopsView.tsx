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
        stop.routes.some(
          (r) =>
            r.routeNumber.toLowerCase().includes(stopSearch.toLowerCase()) ||
            r.routeName.toLowerCase().includes(stopSearch.toLowerCase())
        );
      return matchSearch;
    })
    .sort((a, b) => (sortDistance ? a.walkTimeMins - b.walkTimeMins : 0));

  return (
    <div id="girly-nearby-stops-view" className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Left Panel: Stops List */}
      <div
        className={`w-full md:w-[450px] shrink-0 flex flex-col border-r z-10 shadow-lg transition-colors ${
          isDark
            ? 'bg-[#1e121f] border-[#381a34] text-pink-50'
            : 'bg-[#fff5f8] border-pink-200 text-[#371329]'
        }`}
      >
        {/* List Header & Search */}
        <div
          className={`p-5 sticky top-0 z-20 flex flex-col gap-3.5 border-b shadow-sm ${
            isDark ? 'bg-[#180e19] border-[#381a34]' : 'bg-white border-pink-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h1 className="font-black text-2xl tracking-tight flex items-center gap-1.5">
              <span>Explore Stops</span>
              <span>🌸</span>
            </h1>
            <span className="text-xs font-bold text-pink-500">
              {filteredStops.length} stops nearby ✨
            </span>
          </div>

          {/* Search Box */}
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 group-focus-within:text-pink-600 text-[20px] transition-colors">
              explore
            </span>
            <input
              type="text"
              value={stopSearch}
              onChange={(e) => setStopSearch(e.target.value)}
              placeholder="Search by stop name, street or ID... 💖"
              className={`w-full text-xs sm:text-sm py-2.5 pl-11 pr-3 rounded-2xl transition-all focus:outline-none ${
                isDark
                  ? 'bg-[#281525] text-pink-100 placeholder-pink-400/50 border border-pink-900/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30'
                  : 'bg-pink-50/60 text-[#371329] placeholder-pink-400 border border-pink-200 focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-200'
              }`}
            />
            {stopSearch && (
              <button
                onClick={() => setStopSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pink-400 hover:text-pink-600"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Filters & Sort Controls */}
          <div className="flex items-center justify-between text-xs text-pink-400 pt-1">
            <div className="flex items-center gap-1.5 font-bold text-pink-500">
              <span className="material-symbols-outlined text-[16px]">my_location</span>
              <span>Central Sakura District</span>
            </div>

            <button
              onClick={() => setSortDistance(!sortDistance)}
              className="flex items-center gap-1 font-extrabold text-rose-500 hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">sort</span>
              <span>Shortest Walk 👟</span>
            </button>
          </div>

          {/* Transport Mode Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {(['all', 'bus', 'subway', 'train'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveFilter(mode)}
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-all border ${
                  activeFilter === mode
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-xs'
                    : isDark
                    ? 'bg-[#251324] text-pink-200/80 border-[#381a34] hover:bg-[#341b31]'
                    : 'bg-white text-[#501c3d] border-pink-200 hover:bg-pink-100/60'
                }`}
              >
                {mode === 'all'
                  ? 'All 🌸'
                  : mode === 'bus'
                  ? 'Buses 🚌'
                  : mode === 'subway'
                  ? 'MRT / Subway 🚇'
                  : 'Light Rail 🚊'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Stops List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3.5">
          {filteredStops.map((stop) => {
            const isSelected = selectedStop?.id === stop.id;
            return (
              <div
                key={stop.id}
                onClick={() => onSelectStop(stop)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-[#2f182c] border-pink-400 ring-2 ring-pink-500/40 shadow-lg'
                      : 'bg-white border-pink-400 ring-2 ring-pink-300 shadow-md'
                    : isDark
                    ? 'bg-[#180e19] border-[#381a34] hover:bg-[#251424]'
                    : 'bg-white border-pink-200 hover:bg-pink-50/50 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#371329] dark:text-pink-50 flex items-center gap-1">
                      <span>{stop.name}</span>
                      <span className="text-xs">🌸</span>
                    </h3>
                    <p className="text-xs text-pink-500 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[13px]">directions_walk</span>
                      <span>{stop.distanceDisplay}</span>
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewSchedule(stop);
                    }}
                    className="text-xs font-black text-rose-500 hover:underline flex items-center gap-1"
                  >
                    <span>Timetable</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </button>
                </div>

                {/* Routes Grid */}
                <div className="space-y-2">
                  {stop.routes.map((route, rIdx) => (
                    <div
                      key={rIdx}
                      className={`flex items-center justify-between p-2.5 rounded-2xl ${
                        isDark ? 'bg-[#261525]' : 'bg-[#fff5f8]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-6 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 text-white shadow-xs ${
                            route.colorType === 'secondary'
                              ? 'bg-gradient-to-tr from-purple-500 to-indigo-500'
                              : route.colorType === 'delayed'
                              ? 'bg-amber-500'
                              : 'bg-gradient-to-tr from-pink-500 to-rose-500'
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
                          className={`text-xs font-black ${
                            route.status === 'arriving'
                              ? 'text-pink-500 animate-pulse'
                              : route.status === 'delayed'
                              ? 'text-amber-500'
                              : 'text-rose-500 dark:text-rose-400'
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

      {/* Right Area: Interactive Map Canvas */}
      <div className="flex-1 h-full hidden md:block">
        <InteractiveMap
          theme={theme}
          activeCity={activeCity}
          stops={stops}
          selectedStop={selectedStop}
          onSelectStop={onSelectStop}
          onViewSchedule={onViewSchedule}
        />
      </div>
    </div>
  );
};

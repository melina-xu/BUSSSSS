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
        stop.code.toLowerCase().includes(stopSearch.toLowerCase()) ||
        stop.routes.some(
          (r) =>
            r.routeNumber.toLowerCase().includes(stopSearch.toLowerCase()) ||
            r.routeName.toLowerCase().includes(stopSearch.toLowerCase())
        );
      return matchSearch;
    })
    .sort((a, b) => (sortDistance ? a.walkTimeMins - b.walkTimeMins : 0));

  return (
    <div id="aether-quant-nearby-stops-view" className="flex h-[calc(100vh-64px)] w-full overflow-hidden font-sans">
      {/* Left Panel: High Density Quant Telemetry Nodal Matrix */}
      <div
        className={`w-full md:w-[460px] shrink-0 flex flex-col border-r z-10 shadow-lg transition-colors font-mono ${
          isDark
            ? 'bg-[#080a0f] border-slate-800 text-slate-100'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}
      >
        {/* List Header & Search */}
        <div
          className={`p-4 sticky top-0 z-20 flex flex-col gap-3 border-b ${
            isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-cyan-400">radar</span>
              <h1 className="font-extrabold text-sm tracking-tight text-white dark:text-white">
                NODAL TELEMETRY MATRIX
              </h1>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              {filteredStops.length} NODES ONLINE
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={stopSearch}
              onChange={(e) => setStopSearch(e.target.value)}
              placeholder="Filter by Node ID, Corridor, or Line..."
              className={`w-full text-xs py-2 pl-9 pr-8 rounded-xl font-mono transition-all focus:outline-none ${
                isDark
                  ? 'bg-[#06080d] text-slate-100 placeholder-slate-500 border border-slate-700 focus:border-cyan-500'
                  : 'bg-slate-100 text-slate-900 placeholder-slate-400 border border-slate-300 focus:border-cyan-600'
              }`}
            />
            {stopSearch && (
              <button
                onClick={() => setStopSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            )}
          </div>

          {/* Mode Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {(['all', 'bus', 'subway', 'train'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveFilter(mode)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize whitespace-nowrap transition-all border ${
                  activeFilter === mode
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : isDark
                    ? 'bg-[#06080d] text-slate-400 border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {mode === 'all'
                  ? 'All Corridors'
                  : mode === 'bus'
                  ? 'Autonomous Express'
                  : mode === 'subway'
                  ? 'HSR / Subterranean'
                  : 'Point-to-Point'}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Stops List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-3">
          {filteredStops.map((stop) => {
            const isSelected = selectedStop?.id === stop.id;
            return (
              <div
                key={stop.id}
                onClick={() => onSelectStop(stop)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-cyan-950/30 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg'
                      : 'bg-cyan-50 border-cyan-600 ring-1 ring-cyan-600 shadow-md'
                    : isDark
                    ? 'bg-[#0b0f19] border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {stop.code}
                      </span>
                      <h3 className="font-extrabold text-xs text-white dark:text-white font-sans">{stop.name}</h3>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>{stop.distanceDisplay}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{stop.nodalThroughput || '14,200 pax/hr'}</span>
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewSchedule(stop);
                    }}
                    className="text-[10px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>TIMETABLE</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </button>
                </div>

                {/* Routes Grid */}
                <div className="space-y-1.5">
                  {stop.routes.map((route, rIdx) => (
                    <div
                      key={rIdx}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        isDark ? 'bg-[#06080d]' : 'bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-black text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {route.routeNumber}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate text-slate-200 font-sans">
                            {route.routeName}
                          </div>
                          {route.vehicleTelemetryId && (
                            <div className="text-[9px] text-slate-500">
                              {route.vehicleTelemetryId} • {route.speedKmh ? `${route.speedKmh} km/h` : 'Lock'}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span
                          className={`text-xs font-black ${
                            route.status === 'arriving'
                              ? 'text-cyan-400 animate-pulse'
                              : route.status === 'delayed'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {route.primaryTime}
                        </span>
                        {route.loadFactorPct && (
                          <div className="text-[9px] text-slate-500">
                            Cap: <span className={route.loadFactorPct > 80 ? 'text-amber-400 font-bold' : 'text-slate-400'}>{route.loadFactorPct}%</span>
                          </div>
                        )}
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

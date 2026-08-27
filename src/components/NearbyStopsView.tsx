import React, { useState } from 'react';
import { ThemeMode, BusStopDetail } from '../types';
import { SINGAPORE_BUS_STOPS } from '../data/mockData';

interface NearbyStopsViewProps {
  theme: ThemeMode;
  onSelectStopCode: (code: string) => void;
}

export const NearbyStopsView: React.FC<NearbyStopsViewProps> = ({
  theme,
  onSelectStopCode
}) => {
  const isDark = theme === 'dark';
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  const districts = ['All', 'Downtown', 'Orchard', 'East Coast', 'Jurong', 'Tampines', 'Woodlands', 'Changi'];

  const filteredStops = SINGAPORE_BUS_STOPS.filter((stop) => {
    const matchesQuery =
      !filterQuery ||
      stop.code.includes(filterQuery) ||
      stop.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      stop.roadName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      stop.services.some((srv) => srv.toLowerCase() === filterQuery.toLowerCase());

    const matchesDistrict =
      selectedDistrict === 'All' ||
      (stop.district && stop.district.toLowerCase().includes(selectedDistrict.toLowerCase()));

    return matchesQuery && matchesDistrict;
  });

  return (
    <div id="nearby-stops-view" className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Search and District Filter */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search bus stops by name, code (e.g. 83139), or bus service (e.g. 196)..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-hidden'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-hidden'
              }`}
            />
          </div>
        </div>

        {/* District Filter Chips */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-slate-500 font-medium shrink-0">District:</span>
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-1 rounded-lg border font-semibold transition-all shrink-0 ${
                selectedDistrict === d
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : isDark
                  ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Bus Stops Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredStops.map((stop) => (
          <div
            key={stop.code}
            onClick={() => onSelectStopCode(stop.code)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group hover:shadow-md ${
              isDark
                ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
                : 'bg-white border-slate-200 hover:border-emerald-600 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm flex items-center justify-center shrink-0">
                  {stop.code}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {stop.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {stop.roadName} {stop.district ? `• ${stop.district}` : ''}
                  </p>
                </div>
              </div>

              <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-[20px] transition-transform group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </div>

            {/* Bus Services Chips */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-400 mb-2">
                Available Bus Services ({stop.services.length}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {stop.services.map((srv) => (
                  <span
                    key={srv}
                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

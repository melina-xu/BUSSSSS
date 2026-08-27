import React from 'react';
import { TransitStop, ThemeMode, StopScheduleEntry } from '../types';
import { SAMPLE_SCHEDULE_ENTRIES } from '../data/mockData';

interface ScheduleModalProps {
  theme: ThemeMode;
  stop: TransitStop | null;
  routeNumber?: string;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  theme,
  stop,
  routeNumber,
  onClose
}) => {
  if (!stop && !routeNumber) return null;

  const isDark = theme === 'dark';
  const stopName = stop ? stop.name : `Route ${routeNumber} Schedule`;

  // Fallback schedules
  const scheduleEntries: StopScheduleEntry[] =
    (stop && SAMPLE_SCHEDULE_ENTRIES[stop.name]) || [
      { departureTime: '08:14', routeNumber: routeNumber || '14', destination: 'Sakura Central Concourse', platform: 'Bay 1', status: 'Boarding' },
      { departureTime: '08:22', routeNumber: routeNumber || '14', destination: 'Sakura Central Concourse', platform: 'Bay 1', status: 'On Time' },
      { departureTime: '08:30', routeNumber: routeNumber || '14', destination: 'Sakura Central Concourse', platform: 'Bay 1', status: 'On Time' },
      { departureTime: '08:42', routeNumber: routeNumber || '14', destination: 'Sakura Central Concourse', platform: 'Bay 1', status: 'Delayed', delayMins: 4 },
      { departureTime: '08:55', routeNumber: routeNumber || '14', destination: 'Sakura Central Concourse', platform: 'Bay 1', status: 'On Time' }
    ];

  return (
    <div
      id="girly-schedule-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        className={`max-w-2xl w-full rounded-3xl shadow-2xl border overflow-hidden transition-all ${
          isDark ? 'bg-[#20121e] border-[#381a34] text-pink-50' : 'bg-white border-pink-200 text-[#371329]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'bg-[#281525] border-[#381a34]' : 'bg-[#fff5f8] border-pink-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-500/25">
              <span className="material-symbols-outlined text-[22px]">departure_board</span>
            </div>
            <div>
              <h2 className="font-black text-lg flex items-center gap-1.5">
                <span>{stopName}</span>
                <span className="text-xs">🌸</span>
              </h2>
              <p className="text-xs text-pink-400 font-semibold">
                {stop ? `Stop ID: ${stop.code} • ${stop.distanceDisplay}` : 'System Timetable ✨'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-pink-100 dark:hover:bg-pink-900 text-pink-400 hover:text-pink-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Schedule Table */}
        <div className="p-5 max-h-96 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-pink-100 dark:border-pink-900/30 text-[10px] font-black uppercase tracking-wider text-pink-400">
                <th className="pb-3">Line #</th>
                <th className="pb-3">Destination</th>
                <th className="pb-3">Platform</th>
                <th className="pb-3 text-right">Departs</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100/60 dark:divide-pink-900/20">
              {scheduleEntries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-pink-50/50 dark:hover:bg-[#281525]/60 transition-colors">
                  <td className="py-3 font-extrabold text-pink-600 dark:text-pink-300">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500 text-white font-black text-[10px]">
                      {entry.routeNumber}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-[#371329] dark:text-pink-100">{entry.destination}</td>
                  <td className="py-3 text-pink-400 font-bold">{entry.platform}</td>
                  <td className="py-3 text-right font-black text-rose-500">{entry.departureTime}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                        entry.status === 'Boarding'
                          ? 'bg-pink-100 text-pink-700 animate-pulse'
                          : entry.status === 'Delayed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex justify-end ${
            isDark ? 'bg-[#1a0e1b] border-[#381a34]' : 'bg-[#fff0f5] border-pink-200'
          }`}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm"
          >
            Close 🌸
          </button>
        </div>
      </div>
    </div>
  );
};

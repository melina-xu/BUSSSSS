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
      { departureTime: '08:14', routeNumber: routeNumber || '14', destination: 'Downtown Concourse', platform: 'Bay 1', status: 'Boarding' },
      { departureTime: '08:22', routeNumber: routeNumber || '14', destination: 'Downtown Concourse', platform: 'Bay 1', status: 'On Time' },
      { departureTime: '08:30', routeNumber: routeNumber || '14', destination: 'Downtown Concourse', platform: 'Bay 1', status: 'On Time' },
      { departureTime: '08:42', routeNumber: routeNumber || '14', destination: 'Downtown Concourse', platform: 'Bay 1', status: 'Delayed', delayMins: 4 },
      { departureTime: '08:55', routeNumber: routeNumber || '14', destination: 'Downtown Concourse', platform: 'Bay 1', status: 'On Time' }
    ];

  return (
    <div
      id="schedule-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        className={`max-w-2xl w-full rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white border-[#becab6] text-[#1b1c1c]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006e05] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">departure_board</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">{stopName}</h2>
              <p className="text-xs text-gray-400">
                {stop ? `Stop ID: ${stop.code} • ${stop.distanceDisplay}` : 'System Timetable'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-500/20"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Timetable List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-2.5">
          <div className="text-[11px] font-bold tracking-wider uppercase text-gray-400 mb-2">
            Live Scheduled Departures
          </div>

          {scheduleEntries.map((entry, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="font-timer-display text-base font-black">{entry.departureTime}</div>
                <div className="w-9 h-6 rounded-full bg-[#006e05] text-white font-bold text-xs flex items-center justify-center">
                  {entry.routeNumber}
                </div>
                <div>
                  <div className="font-semibold text-xs">{entry.destination}</div>
                  <div className="text-[10px] text-gray-400">{entry.platform}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {entry.status === 'Boarding' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#1e88e5] text-white animate-pulse">
                    Boarding
                  </span>
                )}
                {entry.status === 'On Time' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#37ab2e]/15 text-[#37ab2e]">
                    On Time
                  </span>
                )}
                {entry.status === 'Delayed' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#ff9800]/15 text-[#ff9800]">
                    +{entry.delayMins} min Late
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex justify-end gap-2 ${
            isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
          }`}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#006e05] hover:bg-[#37ab2e] text-white shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const stopName = stop ? stop.name : `Corridor ${routeNumber} Telemetry Matrix`;

  // Fallback schedules
  const scheduleEntries: StopScheduleEntry[] =
    (stop && SAMPLE_SCHEDULE_ENTRIES[stop.name]) || [
      { departureTime: '08:14:00', routeNumber: routeNumber || 'HSR-01', destination: 'Marina Bay Financial Concourse', platform: 'Gate Alpha', status: 'Boarding' },
      { departureTime: '08:22:00', routeNumber: routeNumber || 'HSR-01', destination: 'Marina Bay Financial Concourse', platform: 'Gate Alpha', status: 'On Time' },
      { departureTime: '08:30:00', routeNumber: routeNumber || 'HSR-01', destination: 'Marina Bay Financial Concourse', platform: 'Gate Alpha', status: 'On Time' },
      { departureTime: '08:42:00', routeNumber: routeNumber || 'HSR-01', destination: 'Marina Bay Financial Concourse', platform: 'Gate Alpha', status: 'Delayed', delayMins: 2 },
      { departureTime: '08:55:00', routeNumber: routeNumber || 'HSR-01', destination: 'Marina Bay Financial Concourse', platform: 'Gate Alpha', status: 'On Time' }
    ];

  return (
    <div
      id="aether-quant-schedule-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 font-mono"
    >
      <div
        className={`max-w-2xl w-full rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          isDark ? 'bg-[#090d16] border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-sm">
              <span className="material-symbols-outlined text-[20px]">departure_board</span>
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white dark:text-white font-sans">
                {stopName}
              </h2>
              <p className="text-[10px] text-slate-400">
                {stop ? `Node ID: ${stop.code} • ${stop.distanceDisplay} • P99: 0.04m` : 'Deterministic Timetable Matrix'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Schedule Table */}
        <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[9px] font-black uppercase text-slate-500">
                <th className="pb-2.5">VECTOR ID</th>
                <th className="pb-2.5">TARGET HUB</th>
                <th className="pb-2.5">CONCOURSE</th>
                <th className="pb-2.5 text-right">DEPARTURE</th>
                <th className="pb-2.5 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {scheduleEntries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 font-bold text-cyan-400">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px]">
                      {entry.routeNumber}
                    </span>
                  </td>
                  <td className="py-2.5 font-semibold text-slate-200 font-sans">{entry.destination}</td>
                  <td className="py-2.5 text-slate-400">{entry.platform}</td>
                  <td className="py-2.5 text-right font-black text-cyan-300">{entry.departureTime}</td>
                  <td className="py-2.5 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        entry.status === 'Boarding'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse'
                          : entry.status === 'Delayed'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
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
          className={`p-3.5 border-t flex justify-end ${
            isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-slate-50 border-slate-300'
          }`}
        >
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};

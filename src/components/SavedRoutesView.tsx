import React, { useState } from 'react';
import { SavedRoute, ThemeMode } from '../types';
import { SAVED_ROUTES_DATA } from '../data/mockData';

interface SavedRoutesViewProps {
  theme: ThemeMode;
  onViewScheduleForRoute: (routeNumber: string) => void;
  onSimulateArrival: () => void;
}

export const SavedRoutesView: React.FC<SavedRoutesViewProps> = ({
  theme,
  onViewScheduleForRoute,
  onSimulateArrival
}) => {
  const isDark = theme === 'dark';
  const [routes, setRoutes] = useState<SavedRoute[]>(SAVED_ROUTES_DATA);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRouteNum, setNewRouteNum] = useState('');
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');

  const toggleFavorite = (id: string) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r))
    );
  };

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newRouteNum) return;
    const newRoute: SavedRoute = {
      id: `saved-${Date.now()}`,
      title: newTitle,
      routeNumber: newRouteNum,
      from: newFrom || 'Executive Node Alpha',
      to: newTo || 'Goldman Sachs FinTech Concourse',
      nextArrival: '2 min',
      status: 'on-time',
      statusBadge: 'ALPHA PRIORITY',
      scheduleSummary: 'Custom executive high-frequency corridor',
      frequency: 'Every 3 min',
      stopsCount: 5,
      favorite: true,
      colorType: 'primary',
      quantYield: '+99.9%',
      onTimeP99: '0.02m delta',
      corridorRisk: 'ALPHA'
    };
    setRoutes([newRoute, ...routes]);
    setShowAddModal(false);
    setNewTitle('');
    setNewRouteNum('');
    setNewFrom('');
    setNewTo('');
  };

  return (
    <div id="aether-quant-saved-routes-view" className="flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto p-6 custom-scrollbar font-mono">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-extrabold text-cyan-400 tracking-widest uppercase flex items-center gap-1.5">
              <span>EXECUTIVE CORRIDOR PORTFOLIO</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-1 text-white dark:text-white font-sans">
              Commute Asset Management & Alpha Yield
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSimulateArrival}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0e1320] text-cyan-300 hover:border-cyan-400 transition-colors flex items-center gap-1.5 border border-cyan-500/30 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-cyan-400">notifications_active</span>
              <span>TEST TELEMETRY PUSH</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-all shadow-md shadow-cyan-600/30 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>PROVISION NEW CORRIDOR</span>
            </button>
          </div>
        </div>

        {/* Saved Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all hover:border-cyan-500/50 ${
                isDark ? 'bg-[#090d16] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div>
                {/* Top Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-black text-xs">
                      {route.routeNumber}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm font-sans">{route.title}</h3>
                      <p className="text-[10px] text-slate-400">
                        {route.stopsCount} intermediate nodes • {route.frequency}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavorite(route.id)}
                    className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                    title="Toggle Portfolio Watch"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        route.favorite ? 'text-amber-400' : 'text-slate-600'
                      }`}
                    >
                      {route.favorite ? 'star' : 'star_outline'}
                    </span>
                  </button>
                </div>

                {/* Origin -> Destination Line */}
                <div
                  className={`p-3 rounded-xl space-y-1.5 mb-4 border ${
                    isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded bg-cyan-400" />
                    <span className="text-slate-400">Origin:</span>
                    <span className="font-semibold truncate text-slate-200">{route.from}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded bg-amber-400" />
                    <span className="text-slate-400">Target:</span>
                    <span className="font-semibold truncate text-slate-200">{route.to}</span>
                  </div>
                </div>

                {/* Quant Yield Metrics Bar */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-2 rounded-xl bg-[#0e1320] border border-slate-800 text-[10px]">
                  <div>
                    <div className="text-slate-500">ON-TIME YIELD</div>
                    <div className="font-bold text-emerald-400">{route.quantYield || '+99.8%'}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">P99 DELTA</div>
                    <div className="font-bold text-cyan-400">{route.onTimeP99 || '0.04m'}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">RISK CLASS</div>
                    <div className="font-bold text-amber-400">{route.corridorRisk || 'ALPHA'}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => onViewScheduleForRoute(route.routeNumber)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#0d121f] text-cyan-300 border border-slate-700 hover:border-cyan-500 transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>INSPECT SCHEDULE</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Commute Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${
              isDark ? 'bg-[#090d16] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-sm uppercase text-cyan-400 flex items-center gap-1.5">
                <span>PROVISION EXECUTIVE CORRIDOR</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddRoute} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Corridor Label
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Goldman Sachs Desk ↔ Sand Hill AI Lab"
                  required
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-none ${
                    isDark
                      ? 'bg-[#06080d] border-slate-700 text-slate-100 focus:border-cyan-500'
                      : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Route / Telemetry #
                  </label>
                  <input
                    type="text"
                    value={newRouteNum}
                    onChange={(e) => setNewRouteNum(e.target.value)}
                    placeholder="e.g. 196X or HSR-01"
                    required
                    className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-none ${
                      isDark
                        ? 'bg-[#06080d] border-slate-700 text-slate-100 focus:border-cyan-500'
                        : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Frequency
                  </label>
                  <input
                    type="text"
                    defaultValue="Every 3 min"
                    className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-none ${
                      isDark
                        ? 'bg-[#06080d] border-slate-700 text-slate-100 focus:border-cyan-500'
                        : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-cyan-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Origin Node
                </label>
                <input
                  type="text"
                  value={newFrom}
                  onChange={(e) => setNewFrom(e.target.value)}
                  placeholder="e.g. Marina Bay Financial Concourse"
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-none ${
                    isDark
                      ? 'bg-[#06080d] border-slate-700 text-slate-100 focus:border-cyan-500'
                      : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Destination Target
                </label>
                <input
                  type="text"
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  placeholder="e.g. Goldman Sachs 200 West St"
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-none ${
                    isDark
                      ? 'bg-[#06080d] border-slate-700 text-slate-100 focus:border-cyan-500'
                      : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-cyan-600'
                  }`}
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg text-xs font-black bg-cyan-600 hover:bg-cyan-500 text-slate-950"
                >
                  SAVE ASSET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

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
      from: newFrom || 'Current Location',
      to: newTo || 'Downtown Terminal',
      nextArrival: '4 min',
      status: 'on-time',
      statusBadge: 'ON TIME',
      scheduleSummary: 'Custom saved transit commute',
      frequency: '6 min freq',
      stopsCount: 12,
      favorite: true,
      colorType: 'primary'
    };
    setRoutes([newRoute, ...routes]);
    setShowAddModal(false);
    setNewTitle('');
    setNewRouteNum('');
    setNewFrom('');
    setNewTo('');
  };

  return (
    <div id="saved-routes-view" className="flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
              Commuter Hub / Presets
            </div>
            <h1 className="text-3xl font-black tracking-tight mt-1">Saved Routes & Commutes</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSimulateArrival}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1e88e5]/15 text-[#1e88e5] hover:bg-[#1e88e5]/25 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span>
              <span>Test Push Notification</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#006e05] hover:bg-[#37ab2e] text-white transition-all shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Commute</span>
            </button>
          </div>
        </div>

        {/* Saved Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white border-[#becab6] text-[#1b1c1c]'
              }`}
            >
              <div>
                {/* Top Row: Route Pill, Title & Star */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-8 rounded-full flex items-center justify-center font-extrabold text-sm shadow-sm ${
                        route.colorType === 'secondary'
                          ? 'bg-[#1e88e5] text-white'
                          : route.colorType === 'tertiary'
                          ? 'bg-[#f85d9d] text-white'
                          : 'bg-[#006e05] text-white'
                      }`}
                    >
                      {route.routeNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{route.title}</h3>
                      <p className="text-xs text-gray-400">
                        {route.stopsCount} stops • {route.frequency}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavorite(route.id)}
                    className="text-gray-400 hover:text-[#ff9800] transition-colors p-1"
                    title="Toggle Favorite"
                  >
                    <span
                      className={`material-symbols-outlined text-[22px] ${
                        route.favorite ? 'text-[#ff9800]' : ''
                      }`}
                      style={{ fontVariationSettings: route.favorite ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                </div>

                {/* Origin -> Destination Line */}
                <div
                  className={`p-3 rounded-xl space-y-2 mb-4 ${
                    isDark ? 'bg-[#201f1f]' : 'bg-[#f5f3f3]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#37ab2e]" />
                    <span className="font-semibold text-gray-400">From:</span>
                    <span className="font-medium truncate">{route.from}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#e65100]" />
                    <span className="font-semibold text-gray-400">To:</span>
                    <span className="font-medium truncate">{route.to}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-500/20">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-gray-400">Next Bus:</span>
                  <span
                    className={`font-timer-display text-lg ${
                      route.status === 'arriving'
                        ? 'text-[#1e88e5] animate-pulse font-black'
                        : 'text-[#37ab2e] font-black'
                    }`}
                  >
                    {route.nextArrival}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      route.status === 'arriving'
                        ? 'bg-[#1e88e5]/15 text-[#1e88e5]'
                        : 'bg-[#37ab2e]/15 text-[#37ab2e]'
                    }`}
                  >
                    {route.statusBadge}
                  </span>
                </div>

                <button
                  onClick={() => onViewScheduleForRoute(route.routeNumber)}
                  className="text-xs font-bold text-[#006e05] dark:text-[#6cdf5c] hover:underline flex items-center gap-0.5"
                >
                  <span>Timetable</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Commute Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div
              className={`max-w-md w-full rounded-2xl p-6 shadow-2xl border ${
                isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white border-[#becab6] text-[#1b1c1c]'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Add New Commute Route</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleAddRoute} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold block mb-1">Commute Name</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Morning Gym Run"
                    className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#37ab2e] ${
                      isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Route / Line Number</label>
                  <input
                    type="text"
                    required
                    value={newRouteNum}
                    onChange={(e) => setNewRouteNum(e.target.value)}
                    placeholder="e.g., 65X or M2"
                    className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#37ab2e] ${
                      isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1">Origin Station</label>
                    <input
                      type="text"
                      value={newFrom}
                      onChange={(e) => setNewFrom(e.target.value)}
                      placeholder="Start point"
                      className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#37ab2e] ${
                        isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Destination</label>
                    <input
                      type="text"
                      value={newTo}
                      onChange={(e) => setNewTo(e.target.value)}
                      placeholder="End station"
                      className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#37ab2e] ${
                        isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:bg-gray-500/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#006e05] hover:bg-[#37ab2e] text-white shadow-md"
                  >
                    Save Commute
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

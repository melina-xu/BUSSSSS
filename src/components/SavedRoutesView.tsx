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
      to: newTo || 'Sakura Central Concourse',
      nextArrival: '4 min',
      status: 'on-time',
      statusBadge: 'ON TIME ✨',
      scheduleSummary: 'Custom saved cute commute',
      frequency: '5 min freq',
      stopsCount: 8,
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
    <div id="girly-saved-routes-view" className="flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-extrabold text-pink-500 tracking-widest uppercase flex items-center gap-1">
              <span>🌸</span> Commuter Hub / My Favorites
            </div>
            <h1 className="text-3xl font-black tracking-tight mt-1 flex items-center gap-2">
              <span>My Favorite Routes & Commutes</span>
              <span>💖</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSimulateArrival}
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 hover:bg-pink-200 transition-colors flex items-center gap-1.5 border border-pink-200 dark:border-pink-900"
            >
              <span className="material-symbols-outlined text-[16px]">favorite</span>
              <span>Test Arrival Toast 🌸</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white transition-all shadow-md shadow-pink-500/25 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Favorite Commute</span>
            </button>
          </div>
        </div>

        {/* Saved Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className={`rounded-3xl p-5 border shadow-sm flex flex-col justify-between transition-all hover:shadow-lg ${
                isDark ? 'bg-[#20121e] border-[#381a34] text-pink-50' : 'bg-white border-pink-200 text-[#371329]'
              }`}
            >
              <div>
                {/* Top Row: Route Pill, Title & Star / Heart */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-xs ${
                        route.colorType === 'secondary'
                          ? 'bg-gradient-to-tr from-purple-500 to-indigo-500 text-white'
                          : route.colorType === 'tertiary'
                          ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white'
                          : 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white'
                      }`}
                    >
                      {route.routeNumber}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base flex items-center gap-1">
                        <span>{route.title}</span>
                        <span className="text-xs">🌸</span>
                      </h3>
                      <p className="text-xs text-pink-400">
                        {route.stopsCount} stops • {route.frequency}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavorite(route.id)}
                    className="text-pink-300 hover:text-rose-500 transition-colors p-1"
                    title="Toggle Favorite"
                  >
                    <span
                      className={`material-symbols-outlined text-[24px] ${
                        route.favorite ? 'text-rose-500 fill-current' : 'text-pink-300'
                      }`}
                      style={{ fontVariationSettings: route.favorite ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                {/* Origin -> Destination Line */}
                <div
                  className={`p-3 rounded-2xl space-y-2 mb-4 border ${
                    isDark ? 'bg-[#281525] border-[#381a34]' : 'bg-[#fff5f8] border-pink-100'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="font-bold text-pink-400">From:</span>
                    <span className="font-semibold truncate">{route.from}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="font-bold text-pink-400">To:</span>
                    <span className="font-semibold truncate">{route.to}</span>
                  </div>
                </div>

                {/* Real-time Status Card */}
                <div className="flex items-center justify-between text-xs mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span className="font-bold text-pink-600 dark:text-pink-300">
                      Next: {route.nextArrival}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                      route.status === 'on-time'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {route.statusBadge}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-pink-100 dark:border-pink-900/30">
                <button
                  onClick={() => onViewScheduleForRoute(route.routeNumber)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 hover:bg-pink-200 transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>View Timetable</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Commute Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border ${
              isDark ? 'bg-[#20121e] border-[#381a34] text-pink-50' : 'bg-white border-pink-200 text-[#371329]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg flex items-center gap-1.5">
                <span>🌸</span>
                <span>Add Favorite Commute</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-pink-400 hover:text-pink-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddRoute} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-pink-500 block mb-1">
                  Commute Nickname
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Morning Sakura Stroll to Studio"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none border ${
                    isDark
                      ? 'bg-[#180e19] border-[#381a34] text-pink-100 focus:border-pink-500'
                      : 'bg-pink-50/50 border-pink-200 text-[#371329] focus:border-pink-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-pink-500 block mb-1">
                    Route / Line #
                  </label>
                  <input
                    type="text"
                    value={newRouteNum}
                    onChange={(e) => setNewRouteNum(e.target.value)}
                    placeholder="e.g. 196 or NSL"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none border ${
                      isDark
                        ? 'bg-[#180e19] border-[#381a34] text-pink-100 focus:border-pink-500'
                        : 'bg-pink-50/50 border-pink-200 text-[#371329] focus:border-pink-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-pink-500 block mb-1">
                    Frequency
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4 min"
                    defaultValue="5 min"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none border ${
                      isDark
                        ? 'bg-[#180e19] border-[#381a34] text-pink-100 focus:border-pink-500'
                        : 'bg-pink-50/50 border-pink-200 text-[#371329] focus:border-pink-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-pink-500 block mb-1">
                  Starting Point
                </label>
                <input
                  type="text"
                  value={newFrom}
                  onChange={(e) => setNewFrom(e.target.value)}
                  placeholder="e.g. Home / Sakura Residence"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none border ${
                    isDark
                      ? 'bg-[#180e19] border-[#381a34] text-pink-100 focus:border-pink-500'
                      : 'bg-pink-50/50 border-pink-200 text-[#371329] focus:border-pink-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-pink-500 block mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  placeholder="e.g. Orchard Shopping Concourse"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none border ${
                    isDark
                      ? 'bg-[#180e19] border-[#381a34] text-pink-100 focus:border-pink-500'
                      : 'bg-pink-50/50 border-pink-200 text-[#371329] focus:border-pink-500'
                  }`}
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30"
                >
                  Save Route 💖
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

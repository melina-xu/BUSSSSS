import React, { useState } from 'react';
import { SavedRoute, LocationPoint, JourneyOption } from '../types';
import { INITIAL_SAVED_ROUTES } from '../data/singaporeTransitData';
import { 
  Bookmark, 
  Home, 
  Briefcase, 
  Plane, 
  Heart, 
  Bell, 
  BellOff, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Play,
  Navigation
} from 'lucide-react';

interface SavedRoutesProps {
  onStartRoute: (origin: LocationPoint, destination: LocationPoint) => void;
}

export const SavedRoutes: React.FC<SavedRoutesProps> = ({ onStartRoute }) => {
  const [routes, setRoutes] = useState<SavedRoute[]>(INITIAL_SAVED_ROUTES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');

  const toggleAlert = (id: string) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, alertEnabled: !r.alertEnabled } : r))
    );
  };

  const deleteRoute = (id: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'work':
        return <Briefcase className="w-5 h-5 text-rose-500" />;
      case 'airport':
        return <Plane className="w-5 h-5 text-emerald-600" />;
      default:
        return <Heart className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div
      id="saved-routes-panel"
      className="w-full h-full bg-white border-4 border-slate-900 rounded-3xl bento-shadow-md flex flex-col p-4 md:p-6 overflow-y-auto select-none"
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-200 flex-shrink-0">
        <div>
          <h2 className="text-xl font-black uppercase italic text-slate-900 tracking-tight">Saved Commutes</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">One-tap departure & Live ETAs</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 border-2 border-slate-900 bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
          title="Add Saved Route"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showAddForm && (
        <div className="bg-slate-50 border-3 border-slate-900 rounded-2xl p-4 mb-4 space-y-3 bento-shadow-sm animate-in fade-in duration-150 flex-shrink-0">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Create New Commute</h4>
          <input
            type="text"
            placeholder="Route Name (e.g. Gym Commute)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-white border-2 border-slate-900 rounded-xl p-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
          />
          <input
            type="text"
            placeholder="From (e.g. Tampines Ave 4)"
            value={newFrom}
            onChange={(e) => setNewFrom(e.target.value)}
            className="w-full bg-white border-2 border-slate-900 rounded-xl p-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
          />
          <input
            type="text"
            placeholder="To (e.g. Marina Bay Sands)"
            value={newTo}
            onChange={(e) => setNewTo(e.target.value)}
            className="w-full bg-white border-2 border-slate-900 rounded-xl p-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (newTitle && newFrom && newTo) {
                  const newEntry: SavedRoute = {
                    id: `save_${Date.now()}`,
                    title: newTitle,
                    fromLocation: {
                      id: `from_${Date.now()}`,
                      name: newFrom,
                      detail: 'Singapore Location',
                      lat: 1.3521,
                      lng: 103.94,
                      type: 'recent',
                    },
                    toLocation: {
                      id: `to_${Date.now()}`,
                      name: newTo,
                      detail: 'Singapore Destination',
                      lat: 1.283,
                      lng: 103.85,
                      type: 'landmark',
                    },
                    iconType: 'favorite',
                    typicalDurationMins: 35,
                    preferredMode: 'fastest',
                    liveEtaMins: 34,
                    alertEnabled: true,
                  };
                  setRoutes([newEntry, ...routes]);
                  setShowAddForm(false);
                  setNewTitle('');
                  setNewFrom('');
                  setNewTo('');
                }
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-blue-600 border-2 border-slate-900 text-white hover:bg-blue-700 bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Save Commute
            </button>
          </div>
        </div>
      )}

      {/* Routes List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-white border-3 border-slate-900 rounded-2xl p-4 bento-shadow-sm hover:bento-shadow transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-50 border-2 border-slate-900 bento-shadow-sm">
                  {getIcon(route.iconType)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{route.title}</h3>
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">
                    {route.preferredMode.toUpperCase()} TRANSIT
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleAlert(route.id)}
                  className={`p-2 rounded-xl border-2 transition-all bento-shadow-sm ${
                    route.alertEnabled
                      ? 'bg-amber-400 border-slate-900 text-slate-900'
                      : 'bg-slate-100 border-slate-900 text-slate-400'
                  }`}
                  title={route.alertEnabled ? 'Commuter alert active' : 'Alerts disabled'}
                >
                  {route.alertEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteRoute(route.id)}
                  className="p-2 rounded-xl bg-slate-100 border-2 border-slate-900 text-slate-600 hover:text-white hover:bg-rose-500 bento-shadow-sm transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Path description */}
            <div className="flex items-center gap-2 text-xs text-slate-800 font-bold my-2 bg-slate-50 p-2.5 rounded-xl border-2 border-slate-900 bento-shadow-sm">
              <span className="truncate max-w-[130px] font-black">{route.fromLocation.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate max-w-[130px] font-black">{route.toLocation.name}</span>
            </div>

            {/* Live Timing & Quick Launch */}
            <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100 mt-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">
                  {route.liveEtaMins || route.typicalDurationMins}
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MIN LIVE</span>
              </div>

              <button
                onClick={() => onStartRoute(route.fromLocation, route.toLocation)}
                className="px-4 py-2 rounded-xl bg-blue-600 border-2 border-slate-900 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 bento-shadow-sm hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

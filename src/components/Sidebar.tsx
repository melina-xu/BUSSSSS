import React from 'react';
import { NavigationTab } from '../types';
import { 
  Compass, 
  Map as MapIcon, 
  Bookmark, 
  AlertTriangle, 
  Clock, 
  Settings, 
  HelpCircle, 
  Sparkles,
  Train,
  Route
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenSettings: () => void;
  onOpenUpgrade: () => void;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings,
  onOpenUpgrade,
  onOpenHelp,
}) => {
  return (
    <nav
      id="desktop-sidebar"
      className="hidden md:flex flex-col h-full w-[270px] fixed left-0 top-0 z-40 bg-white border-r-4 border-slate-900 py-6 px-4 select-none justify-between"
    >
      {/* Brand Header Bento Tile */}
      <div>
        <div className="bg-slate-50 border-2 border-slate-900 p-3.5 rounded-2xl bento-shadow mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 border-2 border-slate-900 rounded-xl flex items-center justify-center bento-shadow-sm flex-shrink-0">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase italic text-slate-900 leading-tight">
              SG Transit Hub
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              LTA & OneMap Live
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-2">
          {/* Plan Trip */}
          <button
            id="nav-plan-trip"
            onClick={() => onSelectTab('plan')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl border-2 transition-all duration-100 text-left font-black text-xs uppercase tracking-wider ${
              activeTab === 'plan'
                ? 'bg-blue-600 text-white border-slate-900 bento-shadow translate-x-0.5'
                : 'bg-white border-transparent text-slate-700 hover:border-slate-900 hover:bg-slate-100 hover:bento-shadow-sm'
            }`}
          >
            <Route className={`w-4 h-4 ${activeTab === 'plan' ? 'text-white' : 'text-slate-900'}`} />
            <span>Route Planner</span>
          </button>

          {/* Live Map */}
          <button
            id="nav-live-map"
            onClick={() => onSelectTab('live-map')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl border-2 transition-all duration-100 text-left font-black text-xs uppercase tracking-wider ${
              activeTab === 'live-map'
                ? 'bg-amber-400 text-slate-900 border-slate-900 bento-shadow translate-x-0.5'
                : 'bg-white border-transparent text-slate-700 hover:border-slate-900 hover:bg-slate-100 hover:bento-shadow-sm'
            }`}
          >
            <MapIcon className="w-4 h-4 text-slate-900" />
            <span>Interactive Map</span>
          </button>

          {/* Arrivals Board */}
          <button
            id="nav-arrivals"
            onClick={() => onSelectTab('arrivals')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl border-2 transition-all duration-100 text-left font-black text-xs uppercase tracking-wider ${
              activeTab === 'arrivals'
                ? 'bg-emerald-400 text-slate-900 border-slate-900 bento-shadow translate-x-0.5'
                : 'bg-white border-transparent text-slate-700 hover:border-slate-900 hover:bg-slate-100 hover:bento-shadow-sm'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-900" />
            <span>Bus & MRT Timing</span>
          </button>

          {/* Saved Routes */}
          <button
            id="nav-saved-routes"
            onClick={() => onSelectTab('saved')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl border-2 transition-all duration-100 text-left font-black text-xs uppercase tracking-wider ${
              activeTab === 'saved'
                ? 'bg-indigo-600 text-white border-slate-900 bento-shadow translate-x-0.5'
                : 'bg-white border-transparent text-slate-700 hover:border-slate-900 hover:bg-slate-100 hover:bento-shadow-sm'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${activeTab === 'saved' ? 'text-white' : 'text-slate-900'}`} />
            <span>Saved Commutes</span>
          </button>

          {/* Service Status */}
          <button
            id="nav-service-status"
            onClick={() => onSelectTab('status')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl border-2 transition-all duration-100 text-left font-black text-xs uppercase tracking-wider ${
              activeTab === 'status'
                ? 'bg-rose-500 text-white border-slate-900 bento-shadow translate-x-0.5'
                : 'bg-white border-transparent text-slate-700 hover:border-slate-900 hover:bg-slate-100 hover:bento-shadow-sm'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${activeTab === 'status' ? 'text-white' : 'text-slate-900'}`} />
            <div className="flex items-center justify-between flex-1">
              <span>Rail Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse border border-slate-900"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Area: Upgrade Card & Settings */}
      <div className="space-y-3 pt-4 border-t-2 border-slate-200">
        {/* Bento Pro Membership Promo Card */}
        <div className="bg-amber-400 border-2 border-slate-900 p-3.5 rounded-2xl bento-shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-950">
              ⚡ SG Kinetic Pro
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-950" />
          </div>
          <p className="text-[11px] font-bold text-amber-950 leading-snug mb-2">
            Car crowds & rain radar predictions.
          </p>
          <button
            id="btn-upgrade-pro"
            onClick={onOpenUpgrade}
            className="w-full py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            Upgrade S$2.99
          </button>
        </div>

        {/* Secondary Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-sidebar-settings"
            onClick={onOpenSettings}
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-100 border-2 border-slate-900 rounded-xl text-[11px] font-black text-slate-800 hover:bg-slate-200 bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            title="Settings & API Keys"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Config</span>
          </button>
          <button
            id="btn-sidebar-help"
            onClick={onOpenHelp}
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-100 border-2 border-slate-900 rounded-xl text-[11px] font-black text-slate-800 hover:bg-slate-200 bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            title="Help Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>
        </div>
      </div>
    </nav>
  );
};


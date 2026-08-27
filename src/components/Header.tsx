import React from 'react';
import { NavigationTab } from '../types';
import { Route, Map as MapIcon, Clock, AlertTriangle, Settings, Sparkles, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenWeather: () => void;
  currentTemp: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenWeather, currentTemp }) => {
  return (
    <header
      id="mobile-header"
      className="md:hidden fixed top-0 w-full z-50 bg-white border-b-4 border-slate-900 flex items-center justify-between px-4 h-16 select-none shadow-sm"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-blue-600 border-2 border-slate-900 rounded-xl flex items-center justify-center bento-shadow-sm flex-shrink-0">
          <div className="w-3.5 h-3.5 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <span className="text-base font-black tracking-tight uppercase italic text-slate-900 block leading-tight">
            SG Transit Hub
          </span>
          <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            LTA Real-Time
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenWeather}
          className="bg-amber-400 border-2 border-slate-900 text-slate-900 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <span>☁️ {currentTemp}°C</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="bg-slate-100 border-2 border-slate-900 text-slate-900 p-2 rounded-xl bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

interface BottomNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 w-full z-50 bg-white border-t-4 border-slate-900 flex justify-around items-center h-16 pb-safe px-2 select-none shadow-[0_-4px_0_0_rgba(15,23,42,1)]"
    >
      <button
        onClick={() => onSelectTab('plan')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl border-2 transition-transform duration-100 ${
          activeTab === 'plan'
            ? 'bg-blue-600 text-white border-slate-900 bento-shadow-sm'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        <Route className="w-4 h-4" />
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Planner</span>
      </button>

      <button
        onClick={() => onSelectTab('live-map')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl border-2 transition-transform duration-100 ${
          activeTab === 'live-map'
            ? 'bg-amber-400 text-slate-900 border-slate-900 bento-shadow-sm'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        <MapIcon className="w-4 h-4" />
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Map</span>
      </button>

      <button
        onClick={() => onSelectTab('arrivals')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl border-2 transition-transform duration-100 ${
          activeTab === 'arrivals'
            ? 'bg-emerald-400 text-slate-900 border-slate-900 bento-shadow-sm'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        <Clock className="w-4 h-4" />
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Arrivals</span>
      </button>

      <button
        onClick={() => onSelectTab('status')}
        className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl border-2 transition-transform duration-100 ${
          activeTab === 'status'
            ? 'bg-rose-500 text-white border-slate-900 bento-shadow-sm'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        <AlertTriangle className="w-4 h-4" />
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Status</span>
      </button>

      <button
        onClick={() => onSelectTab('community')}
        className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl border-2 transition-transform duration-100 ${
          activeTab === 'community'
            ? 'bg-sky-500 text-white border-slate-900 bento-shadow-sm'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Chat</span>
      </button>
    </nav>
  );
};


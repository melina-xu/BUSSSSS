import React, { useState } from 'react';
import { ThemeMode, TransitStop } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  stops: TransitStop[];
  onSelectStop: (stop: TransitStop) => void;
  activeCity: string;
  onChangeCity: (city: string) => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  stops,
  onSelectStop,
  activeCity,
  onChangeCity,
  unreadCount = 2,
  onOpenNotifications
}) => {
  const isDark = theme === 'dark';
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const CITIES = [
    { id: 'Singapore', name: 'Marina Bay / Singapore FinTech', tag: 'SG-MBFC' },
    { id: 'New York', name: 'Wall St / New York Executive', tag: 'NYC-200W' },
    { id: 'San Francisco', name: 'Sand Hill / Silicon Valley AI', tag: 'SF-SHV' },
    { id: 'London', name: 'Canary Wharf / London Quant', tag: 'LDN-CW' },
    { id: 'Tokyo', name: 'Marunouchi / Tokyo High-Speed', tag: 'TYO-MRN' }
  ];

  const filteredStops = stops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header
      id="aether-quant-header"
      className={`fixed top-0 left-72 right-0 h-16 z-30 flex items-center justify-between px-6 border-b transition-all duration-300 ${
        isDark
          ? 'bg-[#080a0f]/90 border-slate-800/80 backdrop-blur-md text-slate-100'
          : 'bg-white/90 border-slate-200 backdrop-blur-md text-slate-900 shadow-xs'
      }`}
    >
      {/* Left: Financial / Transit Hub Selector + Bloomberg Ticker */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative">
          <select
            value={activeCity}
            onChange={(e) => onChangeCity(e.target.value)}
            className={`appearance-none text-xs font-mono font-extrabold pl-8 pr-8 py-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-[#0e1320] border-cyan-500/30 text-cyan-300 hover:border-cyan-400 focus:ring-1 focus:ring-cyan-500'
                : 'bg-slate-100 border-slate-300 text-slate-900 hover:border-cyan-600'
            }`}
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.tag}] {c.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined text-[16px] absolute left-2.5 top-2.5 text-cyan-400 pointer-events-none">
            apartment
          </span>
          <span className="material-symbols-outlined text-[16px] absolute right-2 top-2.5 text-slate-400 pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Quant Ticker Strip */}
        <div className="hidden lg:flex items-center gap-3 overflow-hidden text-[10px] font-mono whitespace-nowrap border-l border-slate-700/50 pl-4">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="font-bold">ALPHA:</span>
            <span>+14.2%</span>
            <span className="material-symbols-outlined text-[13px]">trending_up</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="font-bold">HSR LATENCY:</span>
            <span>0.00s DELTA</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="font-bold">FLEET CAP:</span>
            <span>78.4%</span>
          </div>
        </div>
      </div>

      {/* Middle/Right: AI Prompt/Node Search Bar */}
      <div className="relative w-80 max-w-md mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Node ID, corridor or coordinates..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            className={`w-full text-xs font-mono pl-9 pr-14 py-2 rounded-xl border transition-all ${
              isDark
                ? 'bg-[#0b0f19] border-slate-700 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
            }`}
          />
          <span className="material-symbols-outlined text-[18px] absolute left-2.5 top-2.5 text-slate-400">
            search
          </span>
          <span className="absolute right-2.5 top-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ⌘K
          </span>
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && searchQuery.trim().length > 0 && (
          <div
            className={`absolute left-0 right-0 top-11 rounded-xl border shadow-2xl overflow-hidden z-50 ${
              isDark ? 'bg-[#0d121f] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="p-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              Matched Telemetry Nodes ({filteredStops.length})
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredStops.map((stop) => (
                <div
                  key={stop.id}
                  onClick={() => {
                    onSelectStop(stop);
                    setShowSearchDropdown(false);
                  }}
                  className={`p-3 cursor-pointer transition-colors border-b last:border-b-0 flex items-center justify-between ${
                    isDark ? 'hover:bg-slate-800/80 border-slate-800/50' : 'hover:bg-slate-100 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-cyan-400">
                      fidget_spinner
                    </span>
                    <div>
                      <div className="text-xs font-bold font-mono">{stop.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{stop.distanceDisplay}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] font-black text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {stop.code}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Notifications & Dark/Light Mode */}
      <div className="flex items-center gap-2.5">
        {/* Risk Alerts Notification Trigger */}
        <button
          onClick={onOpenNotifications}
          className={`relative p-2 rounded-xl border transition-all ${
            isDark
              ? 'bg-[#0e1320] border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title="Network Advisories"
        >
          <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-mono text-[9px] font-black flex items-center justify-center shadow-md">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Theme Toggler */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 ${
            isDark
              ? 'bg-[#0e1320] border-slate-700 text-amber-300 hover:border-amber-400/40'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title={isDark ? 'Switch to Platinum Executive (Light)' : 'Switch to Obsidian Terminal (Dark)'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Executive User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-700/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-amber-400 p-[1px]">
            <div className="w-full h-full rounded-[7px] bg-[#090d16] flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
              GS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { ThemeMode, TransitStop } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);

  const cities = ['Singapore', 'New York City, NY', 'Calgary, Downtown'];

  const filteredStops = searchQuery.trim()
    ? stops.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.includes(searchQuery) ||
          s.routes.some((r) => r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) || r.routeName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <header
      id="app-header"
      className={`fixed top-0 left-72 right-0 h-16 z-40 px-6 flex items-center justify-between border-b transition-colors duration-200 backdrop-blur-xl ${
        isDark
          ? 'bg-[#181119]/85 border-[#2e1c2a] text-[#fce7f3]'
          : 'bg-[#fff5f8]/90 border-[#fbcfe8] text-[#371329] shadow-[0_1px_12px_rgba(244,114,182,0.08)]'
      }`}
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-lg relative">
        <div className="relative flex items-center">
          <span
            className={`material-symbols-outlined absolute left-3.5 text-[20px] transition-colors ${
              isDark ? 'text-pink-400' : 'text-pink-500'
            }`}
          >
            search
          </span>
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search cute stops, MRT lines, cafes & routes... 🌸"
            className={`w-full h-10 pl-11 pr-4 rounded-full text-xs sm:text-sm font-medium transition-all focus:outline-none ${
              isDark
                ? 'bg-[#261625] text-pink-100 placeholder-pink-400/50 border border-pink-900/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30'
                : 'bg-white text-[#371329] placeholder-pink-400/70 border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-300 shadow-sm'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-xs text-pink-400 hover:text-pink-600"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchFocused && filteredStops.length > 0 && (
          <div
            className={`absolute top-12 left-0 right-0 rounded-2xl p-2.5 shadow-2xl z-50 border max-h-80 overflow-y-auto ${
              isDark ? 'bg-[#20121e] border-[#381a34]' : 'bg-white border-pink-200'
            }`}
          >
            <div className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 text-pink-500 dark:text-pink-400 flex items-center gap-1">
              <span>🌸</span>
              <span>Matched Transit Stops</span>
            </div>
            {filteredStops.map((stop) => (
              <div
                key={stop.id}
                onMouseDown={() => {
                  onSelectStop(stop);
                  onSearchChange('');
                }}
                className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                  isDark ? 'hover:bg-[#2e182b]' : 'hover:bg-pink-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? 'bg-pink-950/60 text-pink-300' : 'bg-pink-100 text-pink-600'}`}>
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#371329] dark:text-pink-100">{stop.name}</div>
                    <div className="text-[10px] text-pink-500/80 dark:text-pink-300/70">
                      ID: {stop.code} • {stop.distanceDisplay}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {stop.routes.slice(0, 2).map((r, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500 text-white shadow-xs"
                    >
                      {r.routeNumber}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Header Action Items */}
      <div className="flex items-center gap-3 ml-6">
        {/* City Selector */}
        <div className="relative">
          <button
            id="city-selector-btn"
            onClick={() => setShowCityMenu(!showCityMenu)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isDark
                ? 'bg-[#261625] text-pink-200 border-pink-900/40 hover:bg-[#341b31]'
                : 'bg-white text-pink-950 border-pink-200 hover:bg-pink-50 shadow-sm'
            }`}
          >
            <span className="text-sm">🌸</span>
            <span className="max-w-[110px] truncate">{activeCity}</span>
            <span className="material-symbols-outlined text-[16px] text-pink-400">expand_more</span>
          </button>

          {showCityMenu && (
            <div
              className={`absolute right-0 top-10 w-48 rounded-2xl p-1.5 shadow-2xl z-50 border ${
                isDark ? 'bg-[#20121e] border-[#381a34] text-pink-100' : 'bg-white border-pink-200 text-[#371329]'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 text-pink-500">
                Choose City Hub
              </div>
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onChangeCity(c);
                    setShowCityMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                    activeCity === c
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold'
                      : isDark
                      ? 'hover:bg-[#2e182b]'
                      : 'hover:bg-pink-50 text-[#371329]'
                  }`}
                >
                  <span>{c}</span>
                  {activeCity === c && <span className="text-xs">✨</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon Pill */}
        <button
          id="header-notification-btn"
          onClick={onOpenNotifications}
          className={`relative w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
            isDark
              ? 'bg-[#261625] text-pink-200 border-pink-900/40 hover:bg-[#341b31]'
              : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50 shadow-sm'
          }`}
          title="Notifications & Alerts"
        >
          <span className="material-symbols-outlined text-[19px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#181119]">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Theme Mode Toggle (Cute Pink Sun / Sparkle Moon) */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
            isDark
              ? 'bg-gradient-to-r from-pink-950 to-purple-950 text-pink-200 border-pink-800 hover:border-pink-600'
              : 'bg-gradient-to-r from-pink-50 to-rose-100 text-pink-700 border-pink-200 hover:border-pink-300 shadow-sm'
          }`}
          title={`Switch to ${isDark ? 'Light Blossom' : 'Velvet Night'} mode`}
        >
          <span>{isDark ? '🌙' : '🌸'}</span>
          <span className="hidden sm:inline font-semibold">{isDark ? 'Velvet' : 'Blossom'}</span>
        </button>
      </div>
    </header>
  );
};

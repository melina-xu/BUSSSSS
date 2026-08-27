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
          ? 'bg-[#131313]/85 border-[#2e2e2e] text-[#e5e2e1]'
          : 'bg-[#fbf9f8]/90 border-[#becab6] text-[#1b1c1c] shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-lg relative">
        <div className="relative flex items-center">
          <span
            className={`material-symbols-outlined absolute left-3.5 text-[20px] transition-colors ${
              isDark ? 'text-[#9ca3af]' : 'text-[#3f4a3a]'
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
            placeholder={isDark ? 'Search routes or stops...' : 'Search routes, stops, or addresses...'}
            className={`w-full h-10 pl-11 pr-4 rounded-full text-sm font-normal transition-all focus:outline-none ${
              isDark
                ? 'bg-[#201f1f] text-[#e5e2e1] placeholder-[#9ca3af] border border-transparent focus:border-[#6cdf5c] focus:ring-1 focus:ring-[#6cdf5c]'
                : 'bg-[#f5f3f3] text-[#1b1c1c] placeholder-[#3f4a3a] border border-transparent focus:bg-white focus:ring-2 focus:ring-[#88fc75]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-xs text-gray-400 hover:text-gray-200"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchFocused && filteredStops.length > 0 && (
          <div
            className={`absolute top-12 left-0 right-0 rounded-2xl p-2 shadow-2xl z-50 border max-h-80 overflow-y-auto ${
              isDark ? 'bg-[#1c1b1b] border-[#2e2e2e]' : 'bg-white border-[#becab6]'
            }`}
          >
            <div className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 text-gray-400">
              Matched Stops & Routes
            </div>
            {filteredStops.map((stop) => (
              <div
                key={stop.id}
                onMouseDown={() => {
                  onSelectStop(stop);
                  onSearchChange('');
                }}
                className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                  isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-[#f5f3f3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#353534]' : 'bg-[#e4e2e2]'}`}>
                    <span className="material-symbols-outlined text-[18px] text-[#37ab2e]">location_on</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{stop.name}</div>
                    <div className="text-xs text-gray-400">
                      Stop ID: {stop.code} • {stop.distanceDisplay}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {stop.routes.slice(0, 2).map((r, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#37ab2e] text-white"
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
      <div className="flex items-center gap-4 ml-6">
        {/* City Selector */}
        <div className="relative">
          <button
            id="city-selector-btn"
            onClick={() => setShowCityMenu(!showCityMenu)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
              isDark
                ? 'bg-[#201f1f] text-[#becab6] border-[#2e2e2e] hover:border-[#6cdf5c]'
                : 'bg-[#f5f3f3] text-[#3f4a3a] border-[#becab6] hover:bg-[#eae8e7]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#37ab2e]">pin_drop</span>
            <span className="truncate max-w-[120px]">{activeCity}</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>

          {showCityMenu && (
            <div
              className={`absolute right-0 top-10 w-48 rounded-xl p-1.5 shadow-xl z-50 border ${
                isDark ? 'bg-[#1c1b1b] border-[#2e2e2e]' : 'bg-white border-[#becab6]'
              }`}
            >
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onChangeCity(city);
                    setShowCityMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    activeCity === city
                      ? 'bg-[#37ab2e]/15 text-[#37ab2e] font-bold'
                      : isDark
                      ? 'text-[#e5e2e1] hover:bg-[#2a2a2a]'
                      : 'text-[#1b1c1c] hover:bg-[#f5f3f3]'
                  }`}
                >
                  <span>{city}</span>
                  {activeCity === city && (
                    <span className="material-symbols-outlined text-[16px] text-[#37ab2e]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle (Light / Dark Mode Switcher) */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isDark
              ? 'bg-[#201f1f] text-[#6cdf5c] hover:bg-[#2a2a2a] border border-[#2e2e2e]'
              : 'bg-[#f5f3f3] text-[#006e05] hover:bg-[#eae8e7] border border-[#becab6]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Icon with Badge */}
        <button
          id="header-notifications-btn"
          onClick={onOpenNotifications}
          className={`relative p-2 rounded-full transition-colors ${
            isDark
              ? 'text-[#becab6] hover:text-[#6cdf5c] hover:bg-[#201f1f]'
              : 'text-[#3f4a3a] hover:text-[#006e05] hover:bg-[#f5f3f3]'
          }`}
          title="Alerts & Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-transparent"></span>
          )}
        </button>

        {/* User Profile Avatar */}
        <div
          id="user-profile-avatar"
          className="w-8 h-8 rounded-full bg-[#006e05] flex items-center justify-center text-white cursor-pointer shadow-sm hover:scale-105 transition-transform"
          title="Account Profile"
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
};

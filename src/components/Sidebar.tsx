import React from 'react';
import { NavTab, ThemeMode } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  theme: ThemeMode;
  unreadAlertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  theme,
  unreadAlertsCount = 2
}) => {
  const isDark = theme === 'dark';

  const navItems: { id: NavTab; label: string; icon: string; badge?: number; emoji?: string }[] = [
    { id: 'dashboard', label: 'Trip Planner & Map', icon: 'explore', emoji: '✨' },
    { id: 'nearby-stops', label: 'Nearby Stops', icon: 'location_on', emoji: '🌸' },
    { id: 'saved-routes', label: 'My Favorite Routes', icon: 'favorite', emoji: '💖' },
    { id: 'alerts', label: 'Transit Updates', icon: 'notifications_active', badge: unreadAlertsCount, emoji: '🎀' },
    { id: 'weather-hub', label: 'Weather & Forecast', icon: 'filter_drama', emoji: '🌷' }
  ];

  return (
    <aside
      id="app-sidebar"
      className={`fixed left-0 top-0 h-full w-72 z-50 flex flex-col transition-colors duration-200 border-r select-none ${
        isDark
          ? 'bg-[#181119] border-[#2e1c2a] text-[#fce7f3]'
          : 'bg-[#fff5f8] border-[#fbcfe8] text-[#371329]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-pink-100 dark:border-[#2e1c2a]/80">
        <div
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 cursor-pointer group w-full"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onTabChange('dashboard'); }}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-pink-300 flex items-center justify-center text-white shadow-md shadow-pink-500/30 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]">local_florist</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 dark:from-pink-300 dark:via-rose-300 dark:to-purple-300 bg-clip-text text-transparent">
                Urban Blossom
              </span>
              <span className="text-xs">🌸</span>
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-pink-400 dark:text-pink-300/70 uppercase">
              Smart Transit & Commute
            </span>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-4 py-5 flex flex-col gap-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-pink-400/80 dark:text-pink-300/60">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-2xl text-left transition-all duration-200 relative group ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold shadow-md shadow-pink-500/25 scale-[1.02]'
                  : isDark
                  ? 'text-[#fce7f3]/80 hover:bg-[#281525] hover:text-pink-200'
                  : 'text-[#501c3d] hover:bg-pink-100/70 hover:text-pink-900'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-2.5 transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : isDark
                  ? 'bg-[#2a1727] text-pink-300 group-hover:bg-[#381a34]'
                  : 'bg-pink-100 text-pink-600 group-hover:bg-pink-200'
              }`}>
                <span className="material-symbols-outlined text-[19px]">
                  {item.icon}
                </span>
              </div>
              <span className="text-[13px] flex-1 font-semibold tracking-wide">
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 ? (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white text-pink-600'
                      : 'bg-rose-500 text-white shadow-sm'
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                <span className="text-xs opacity-70 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status / Cute Commuter Profile Card */}
      <div className={`p-4 border-t ${isDark ? 'border-[#2e1c2a] bg-[#1d121f]' : 'border-pink-200/70 bg-[#fff0f5]'}`}>
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/70 dark:bg-[#281525]/90 border border-pink-200/50 dark:border-pink-900/40 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-400 to-pink-300 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-pink-200 dark:ring-pink-900">
            🌸
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#371329] dark:text-pink-100 truncate">
                Sweet Commuter
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-pink-500 text-white">
                VIP
              </span>
            </div>
            <span className="text-[10px] text-pink-500 dark:text-pink-300/80 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              All lines smooth today ✨
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

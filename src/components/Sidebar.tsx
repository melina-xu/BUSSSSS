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

  const navItems: { id: NavTab; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: isDark ? 'DASHBOARD' : 'Dashboard', icon: 'dashboard' },
    { id: 'nearby-stops', label: isDark ? 'NEARBY STOPS' : 'Nearby Stops', icon: isDark ? 'location_on' : 'near_me' },
    { id: 'saved-routes', label: isDark ? 'SAVED ROUTES' : 'Saved Routes', icon: isDark ? 'route' : 'bookmark' },
    { id: 'alerts', label: isDark ? 'ALERTS & NOTIFICATIONS' : 'Alerts & Notifications', icon: isDark ? 'notifications_active' : 'notifications', badge: unreadAlertsCount },
    { id: 'weather-hub', label: isDark ? 'WEATHER HUB' : 'Weather Hub', icon: isDark ? 'thermostat' : 'partly_cloudy_day' }
  ];

  return (
    <aside
      id="app-sidebar"
      className={`fixed left-0 top-0 h-full w-72 z-50 flex flex-col transition-colors duration-200 border-r ${
        isDark
          ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]'
          : 'bg-[#efeded] border-[#becab6] text-[#1b1c1c]'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center px-6 ${isDark ? 'mb-6 pt-4' : 'mb-4'}`}>
        <div
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onTabChange('dashboard'); }}
        >
          {isDark ? (
            <div className="w-8 h-8 bg-[#6cdf5c] rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(108,223,92,0.3)]">
              <span className="material-symbols-outlined text-[#003a01] text-[20px]">electric_bolt</span>
            </div>
          ) : (
            <span className="material-symbols-outlined text-[#006e05] text-[26px]">directions_bus</span>
          )}
          <span
            className={`font-bold tracking-tight text-xl ${
              isDark ? 'text-[#e5e2e1]' : 'text-[#006e05]'
            }`}
          >
            Urban Kinetic
          </span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className={`flex-1 px-4 flex flex-col ${isDark ? 'gap-1.5' : 'space-y-1'}`}>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-full text-left transition-all duration-150 relative ${
                isActive
                  ? isDark
                    ? 'bg-[#37ab2e] text-[#003701] font-bold shadow-sm'
                    : 'bg-[#37ab2e] text-[#003701] font-bold shadow-sm'
                  : isDark
                  ? 'text-[#becab6] hover:bg-[#2a2a2a] hover:text-[#e5e2e1]'
                  : 'text-[#3f4a3a] hover:bg-[#eae8e7] hover:text-[#1b1c1c]'
              }`}
            >
              <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive ? 'text-[#003701]' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-[14px] flex-1 ${isDark ? 'tracking-wider font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#003701] text-[#88fc75]'
                      : isDark
                      ? 'bg-[#ff9800] text-[#131313]'
                      : 'bg-[#e65100] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status / Account Card */}
      <div
        className={`p-4 border-t ${
          isDark ? 'border-[#2e2e2e]' : 'border-[#becab6]'
        }`}
      >
        {isDark ? (
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-[#6cdf5c] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#003a01] text-[18px]">person</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#e5e2e1]">Commuter</span>
              <span className="text-[10px] font-semibold text-[#9ca3af] tracking-wider uppercase">PRO ACCOUNT</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#f5f3f3]">
            <span className="material-symbols-outlined text-[#37ab2e] text-[20px]">check_circle</span>
            <span className="text-[11px] font-semibold tracking-wide text-[#1b1c1c]">System: All Lines Normal</span>
          </div>
        )}
      </div>
    </aside>
  );
};

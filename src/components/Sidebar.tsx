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

  const navItems: { id: NavTab; label: string; subLabel: string; icon: string; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Executive Cockpit',
      subLabel: 'Neural Routing & Map HUD',
      icon: 'hub'
    },
    {
      id: 'nearby-stops',
      label: 'Nodal Telemetry',
      subLabel: 'Live Sensor Matrix',
      icon: 'radar'
    },
    {
      id: 'saved-routes',
      label: 'Corridor Portfolio',
      subLabel: 'Alpha Yield Commutes',
      icon: 'analytics'
    },
    {
      id: 'alerts',
      label: 'Risk & Advisories',
      subLabel: 'Arbitrage & Alerts',
      icon: 'crisis_alert',
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : undefined
    },
    {
      id: 'lta-live',
      label: 'LTA DataMall Ingress',
      subLabel: 'v3 Bus, Lots & Alerts',
      icon: 'sensors',
      badge: 'LIVE'
    },
    {
      id: 'weather-hub',
      label: 'Doppler Atmospheric',
      subLabel: 'Friction Index Matrix',
      icon: 'speed'
    }
  ];

  return (
    <aside
      id="aether-quant-sidebar"
      className={`fixed top-0 left-0 bottom-0 w-72 z-40 flex flex-col justify-between border-r transition-all duration-300 ${
        isDark
          ? 'bg-[#080a0f] border-slate-800/80 text-slate-100'
          : 'bg-[#f8fafc] border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Top Branding Section */}
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-amber-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full rounded-[10px] bg-[#090d16] flex items-center justify-center text-cyan-400">
              <span className="material-symbols-outlined text-[24px]">terminal</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-sm tracking-tight text-white dark:text-white font-quant">
                AETHER<span className="text-cyan-400 font-bold">.QUANT</span>
              </h1>
              <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                GS-v4.8
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-wide mt-0.5">
              Autonomous Mobility Desk
            </p>
          </div>
        </div>

        {/* Live Cluster Status Badge */}
        <div className="mt-4 p-2.5 rounded-xl bg-[#0e1320] border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-300">
              ML CLUSTER: <span className="text-emerald-400">ONLINE</span>
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyan-400">0.04ms</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-3 flex-1 overflow-y-auto space-y-1 py-2 custom-scrollbar">
        <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
          Executive Workspaces
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all group ${
                isActive
                  ? isDark
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'bg-cyan-600 text-white shadow-md shadow-cyan-600/25'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined text-[20px] transition-colors ${
                    isActive
                      ? isDark
                        ? 'text-cyan-400'
                        : 'text-white'
                      : isDark
                      ? 'text-slate-400 group-hover:text-cyan-400'
                      : 'text-slate-500 group-hover:text-cyan-600'
                  }`}
                >
                  {item.icon}
                </span>
                <div>
                  <div className="font-bold text-xs tracking-tight">{item.label}</div>
                  <div
                    className={`text-[10px] font-mono ${
                      isActive ? (isDark ? 'text-cyan-300/80' : 'text-cyan-100') : 'text-slate-500'
                    }`}
                  >
                    {item.subLabel}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                    isActive
                      ? isDark
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-amber-300 text-slate-900'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Telemetry & Quantitative KPI Widget */}
      <div className="p-4 border-t border-slate-800/60 space-y-3">
        <div className="p-3 rounded-xl bg-[#0b0f19] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400">NEURAL ACCURACY</span>
            <span className="font-bold text-cyan-400">99.87%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-amber-400 h-1 rounded-full w-[99.87%]"></div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono pt-1">
            <span className="text-slate-400">ALPHA TIME SAVED</span>
            <span className="font-bold text-emerald-400">+14.2 min/day</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
          <span>DESK ID: GS-NYC-SG-01</span>
          <span className="text-amber-400 font-bold">SECURE TLS 1.3</span>
        </div>
      </div>
    </aside>
  );
};

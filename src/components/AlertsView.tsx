import React, { useState } from 'react';
import { NetworkAlert, AlertNotificationSetting, ThemeMode } from '../types';
import { ACTIVE_ALERTS_DATA, INITIAL_USER_ALERTS } from '../data/mockData';

interface AlertsViewProps {
  theme: ThemeMode;
  onNavigateToWeather: () => void;
  onViewAlternatives: (alert: NetworkAlert) => void;
  onSimulateArrival: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  theme,
  onNavigateToWeather,
  onViewAlternatives,
  onSimulateArrival
}) => {
  const isDark = theme === 'dark';
  const [filterTab, setFilterTab] = useState<'all' | 'my-routes'>('all');
  const [showPushBanner, setShowPushBanner] = useState(true);
  const [userSettings, setUserSettings] = useState<AlertNotificationSetting[]>(INITIAL_USER_ALERTS);
  const [pushEnabled, setPushEnabled] = useState(true);

  const toggleSetting = (id: string) => {
    setUserSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const displayedAlerts =
    filterTab === 'all'
      ? ACTIVE_ALERTS_DATA
      : ACTIVE_ALERTS_DATA.filter((a) =>
          a.affectedRoutes.some((r) =>
            userSettings.some((u) => u.enabled && (u.routeNumber === r || r.includes(u.routeNumber)))
          )
        );

  return (
    <div id="alerts-view" className="flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Push Notification Banner */}
        {showPushBanner && (
          <div
            className={`rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border shadow-sm transition-all ${
              isDark
                ? 'bg-gradient-to-r from-[#201f1f] to-[#1a1a1a] border-[#2e2e2e]'
                : 'bg-gradient-to-r from-[#fbf9f8] to-[#efeded] border-[#becab6]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#006e05] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">notifications_active</span>
              </div>
              <div>
                <h4 className="font-bold text-sm">Enable Push Notifications</h4>
                <p className="text-xs text-gray-400">
                  Get instant updates about delays on your favorited routes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  setPushEnabled(true);
                  setShowPushBanner(false);
                  onSimulateArrival();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#006e05] hover:bg-[#37ab2e] text-white shadow-sm transition-all"
              >
                Allow Alerts
              </button>
              <button
                onClick={() => setShowPushBanner(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-200"
              >
                Not Now
              </button>
            </div>
          </div>
        )}

        {/* Header and Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
              Urban Kinetic / Advisories
            </div>
            <h1 className="text-3xl font-black tracking-tight mt-1">Service & Notifications</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                filterTab === 'all'
                  ? 'bg-[#37ab2e] text-[#003701] shadow-sm'
                  : isDark
                  ? 'bg-[#201f1f] text-[#becab6] hover:bg-[#2a2a2a]'
                  : 'bg-[#f5f3f3] text-[#3f4a3a] hover:bg-[#eae8e7]'
              }`}
            >
              All Alerts ({ACTIVE_ALERTS_DATA.length})
            </button>
            <button
              onClick={() => setFilterTab('my-routes')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                filterTab === 'my-routes'
                  ? 'bg-[#37ab2e] text-[#003701] shadow-sm'
                  : isDark
                  ? 'bg-[#201f1f] text-[#becab6] hover:bg-[#2a2a2a]'
                  : 'bg-[#f5f3f3] text-[#3f4a3a] hover:bg-[#eae8e7]'
              }`}
            >
              My Routes (1)
            </button>
          </div>
        </div>

        {/* 2-Column Layout: Left Alerts Stream, Right Alerts Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Weather Advisory Card */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-4 transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-[#2a1c0d] to-[#1c1b1b] border-[#ff9800]/30 text-[#e5e2e1]'
                  : 'bg-gradient-to-r from-[#fff3e0] to-[#fbf9f8] border-[#ff9800]/40 text-[#1b1c1c]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#ff9800] text-black flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[24px]">thunderstorm</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-base text-[#ff9800]">Heavy Monsoon Rain Expected</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff9800]/20 text-[#ff9800] uppercase">
                    Valid until 18:00
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-2">
                  Expect 10-15 minute delays across all island-wide routes due to localized flooding and reduced visibility. Drive safely if transiting.
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <button
                    onClick={onNavigateToWeather}
                    className="text-[#ff9800] hover:underline flex items-center gap-1"
                  >
                    <span>View Weather Radar</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Advisories Header */}
            <div className="flex items-center justify-between pt-2">
              <h2 className="font-bold text-lg">Active Network Updates</h2>
              <span className="text-xs text-gray-400">Real-time system telemetry</span>
            </div>

            {/* List of Alerts */}
            {displayedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border shadow-sm transition-all hover:shadow-md ${
                  isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white border-[#becab6] text-[#1b1c1c]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        alert.category === 'severe' || alert.category === 'major-delay'
                          ? 'bg-[#ba1a1a] text-white'
                          : alert.category === 'moderate' || alert.category === 'reroute'
                          ? 'bg-[#ff9800] text-black'
                          : 'bg-[#006e05] text-white'
                      }`}
                    >
                      {alert.category.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{alert.timeAgo}</span>
                  </div>

                  <div className="flex gap-1.5">
                    {alert.affectedRoutes.map((route, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#37ab2e]/15 text-[#37ab2e] border border-[#37ab2e]/30"
                      >
                        {route}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="font-bold text-base mb-1.5">{alert.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">{alert.summary}</p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-500/20">
                  <div className="flex items-center gap-3">
                    {alert.skippedStops && (
                      <span className="text-[11px] text-gray-400">
                        Skipped: <strong className="text-inherit">{alert.skippedStops.join(', ')}</strong>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onViewAlternatives(alert)}
                    className="text-xs font-bold text-[#006e05] dark:text-[#6cdf5c] hover:underline flex items-center gap-1"
                  >
                    <span>{alert.actionLinkText || 'View Details'}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar: My Alerts & Smart Settings */}
          <div className="space-y-4">
            {/* Simulation Card */}
            <div
              className={`p-4 rounded-2xl border shadow-sm ${
                isDark ? 'bg-[#1c1b1b] border-[#2e2e2e]' : 'bg-white border-[#becab6]'
              }`}
            >
              <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#37ab2e]">campaign</span>
                <span>Push Notification Test</span>
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Trigger a live simulated push toast to preview the commuter arrival alert banner.
              </p>
              <button
                onClick={onSimulateArrival}
                className="w-full py-2.5 rounded-xl bg-[#006e05] hover:bg-[#37ab2e] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                <span>Simulate Arrival Alert</span>
              </button>
            </div>

            {/* My Alerts Preferences List */}
            <div
              className={`p-5 rounded-2xl border shadow-sm ${
                isDark ? 'bg-[#1c1b1b] border-[#2e2e2e]' : 'bg-white border-[#becab6]'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base">My Alerts</h3>
                <span className="text-[11px] text-gray-400 font-semibold uppercase">ACTIVE PRESETS</span>
              </div>

              <div className="space-y-3">
                {userSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 bg-[#006e05] text-white rounded-full flex items-center justify-center font-bold text-xs">
                        {setting.routeNumber}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">{setting.destination}</h4>
                        <p className="text-[10px] text-gray-400">{setting.triggerDescription}</p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div
                      onClick={() => toggleSetting(setting.id)}
                      className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors relative ${
                        setting.enabled ? 'bg-[#37ab2e]' : isDark ? 'bg-[#353534]' : 'bg-[#becab6]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                          setting.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Impact Widget */}
            <div
              className={`p-5 rounded-2xl border shadow-sm ${
                isDark ? 'bg-[#1c1b1b] border-[#2e2e2e]' : 'bg-white border-[#becab6]'
              }`}
            >
              <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
                Weather Impact
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-3xl font-black font-timer-display">42°</div>
                  <div className="text-xs font-semibold text-[#ba1a1a]">Heavy Rain</div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#ffdad6]/60 dark:bg-[#93000a]/40 text-[#ba1a1a] dark:text-[#ffb4ab] text-[10px] font-extrabold uppercase tracking-wider">
                  Expect Delays
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                Surface flooding reported near several major subway concourses. Slow speeds on bus corridors.
              </p>
              <button
                onClick={onNavigateToWeather}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[#37ab2e]/15 text-[#37ab2e] hover:bg-[#37ab2e]/25 transition-colors flex items-center justify-center gap-1"
              >
                <span>Open Weather Hub</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

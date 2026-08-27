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
  onViewAlternatives,
  onSimulateArrival
}) => {
  const isDark = theme === 'dark';
  const [filterTab, setFilterTab] = useState<'all' | 'my-routes'>('all');
  const [showPushBanner, setShowPushBanner] = useState(true);
  const [userSettings, setUserSettings] = useState<AlertNotificationSetting[]>(INITIAL_USER_ALERTS);
  const [, setPushEnabled] = useState(true);

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
    <div id="girly-alerts-view" className="flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Push Notification Banner */}
        {showPushBanner && (
          <div
            className={`rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border shadow-sm transition-all ${
              isDark
                ? 'bg-gradient-to-r from-[#281525] to-[#201121] border-[#381a34]'
                : 'bg-gradient-to-r from-[#fff0f5] to-[#fce7f3] border-pink-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-500/25">
                <span className="material-symbols-outlined text-[22px]">notifications_active</span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm flex items-center gap-1">
                  <span>Enable Push Notifications</span>
                  <span className="text-xs">🌸</span>
                </h4>
                <p className="text-xs text-pink-600 dark:text-pink-300">
                  Receive sweet alerts about updates and disruptions on your favorite lines.
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
                className="px-4 py-2 rounded-2xl text-xs font-black bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-500/25 transition-all"
              >
                Allow Sweet Alerts ✨
              </button>
              <button
                onClick={() => setShowPushBanner(false)}
                className="px-3 py-2 rounded-2xl text-xs font-semibold text-pink-400 hover:text-pink-600"
              >
                Later
              </button>
            </div>
          </div>
        )}

        {/* Header and Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-extrabold text-pink-500 tracking-widest uppercase flex items-center gap-1">
              <span>🌸</span> Network Bulletins & Safety
            </div>
            <h1 className="text-3xl font-black tracking-tight mt-1 flex items-center gap-2">
              <span>Service Bulletins & Alerts</span>
              <span>🎀</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                filterTab === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-xs'
                  : isDark
                  ? 'bg-[#20121e] text-pink-200 border-[#381a34]'
                  : 'bg-white text-[#371329] border-pink-200 hover:bg-pink-50'
              }`}
            >
              All Alerts 🌸
            </button>
            <button
              onClick={() => setFilterTab('my-routes')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                filterTab === 'my-routes'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-500 shadow-xs'
                  : isDark
                  ? 'bg-[#20121e] text-pink-200 border-[#381a34]'
                  : 'bg-white text-[#371329] border-pink-200 hover:bg-pink-50'
              }`}
            >
              My Favorites 💖
            </button>
          </div>
        </div>

        {/* Active Alerts List */}
        <div className="space-y-4">
          {displayedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-3xl p-5 border shadow-sm transition-all ${
                isDark ? 'bg-[#20121e] border-[#381a34] text-pink-50' : 'bg-white border-pink-200 text-[#371329]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white ${
                      alert.category === 'severe' || alert.category === 'major-delay'
                        ? 'bg-rose-600 shadow-rose-500/30'
                        : alert.category === 'moderate'
                        ? 'bg-amber-500 shadow-amber-500/30'
                        : 'bg-pink-500 shadow-pink-500/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {alert.category === 'severe' || alert.category === 'major-delay'
                        ? 'warning'
                        : alert.category === 'moderate'
                        ? 'schedule'
                        : 'info'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base flex items-center gap-1.5">
                      <span>{alert.title}</span>
                      <span className="text-xs">🌸</span>
                    </h3>
                    <p className="text-xs text-pink-500 font-medium">
                      {alert.timeAgo} • {alert.type.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewAlternatives(alert)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 hover:bg-pink-200 flex items-center gap-1 border border-pink-200 dark:border-pink-900"
                  >
                    <span className="material-symbols-outlined text-[15px]">alt_route</span>
                    <span>Sweet Alternatives</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-pink-600 dark:text-pink-200/80 leading-relaxed font-medium mb-3">
                {alert.summary}
              </p>

              {/* Affected routes badges */}
              <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-pink-100 dark:border-pink-900/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                  Affected Lines:
                </span>
                {alert.affectedRoutes.map((r, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-pink-500 text-white shadow-xs"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Alert Preferences Settings */}
        <div
          className={`rounded-3xl p-5 border shadow-sm ${
            isDark ? 'bg-[#20121e] border-[#381a34] text-pink-50' : 'bg-white border-pink-200 text-[#371329]'
          }`}
        >
          <h3 className="font-extrabold text-base mb-3 flex items-center gap-1.5">
            <span>🌸</span>
            <span>Alert Preferences for Saved Lines</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userSettings.map((setting) => (
              <div
                key={setting.id}
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isDark ? 'bg-[#281525] border-[#381a34]' : 'bg-[#fff5f8] border-pink-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                    {setting.routeNumber}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#371329] dark:text-pink-100 block">
                      {setting.destination}
                    </span>
                    <span className="text-[10px] text-pink-400 font-medium">
                      {setting.triggerDescription}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                    setting.enabled ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      setting.enabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

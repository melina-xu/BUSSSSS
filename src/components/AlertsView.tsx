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
    <div id="aether-quant-alerts-view" className="flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto p-6 custom-scrollbar font-mono">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Quantitative Push Advisory Banner */}
        {showPushBanner && (
          <div
            className={`rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border shadow-sm transition-all ${
              isDark
                ? 'bg-[#0d121f] border-cyan-500/30 text-slate-100'
                : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
              </div>
              <div>
                <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                  <span>HIGH-FREQUENCY RISK TELEMETRY ACTIVE</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">P99 MONITOR</span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  AETHER quant nodes continuously backtest corridor friction and push instant bypass recommendations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  setShowPushBanner(false);
                  onSimulateArrival();
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-all shadow-xs"
              >
                TEST TELEMETRY PUSH
              </button>
              <button
                onClick={() => setShowPushBanner(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                DISMISS
              </button>
            </div>
          </div>
        )}

        {/* Header and Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-extrabold text-cyan-400 tracking-widest uppercase flex items-center gap-1">
              <span>ALGORITHMIC RISK TERMINAL</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-1 text-white dark:text-white font-sans">
              Network Friction Advisories & Arbitrage
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                filterTab === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : isDark
                  ? 'bg-[#06080d] text-slate-400 border-slate-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              ALL ADVISORIES ({ACTIVE_ALERTS_DATA.length})
            </button>
            <button
              onClick={() => setFilterTab('my-routes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                filterTab === 'my-routes'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : isDark
                  ? 'bg-[#06080d] text-slate-400 border-slate-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              CORRIDOR PORTFOLIO
            </button>
          </div>
        </div>

        {/* Active Alerts List */}
        <div className="space-y-3.5">
          {displayedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl p-5 border shadow-sm transition-all ${
                isDark ? 'bg-[#090d16] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-slate-950 font-bold ${
                      alert.category === 'severe' || alert.category === 'major-delay'
                        ? 'bg-rose-500'
                        : alert.category === 'moderate'
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {alert.category === 'severe' || alert.category === 'major-delay'
                        ? 'warning'
                        : alert.category === 'moderate'
                        ? 'troubleshoot'
                        : 'info'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm font-sans flex items-center gap-2">
                      <span>{alert.title}</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {alert.timeAgo} • RISK SCORE: <span className="text-amber-400 font-bold">{alert.riskScore || '0.12'}</span> • YIELD: <span className="text-emerald-400 font-bold">{alert.automatedRerouteYield || 'Optimal'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewAlternatives(alert)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0d121f] text-cyan-300 hover:border-cyan-400 flex items-center gap-1 border border-slate-700"
                  >
                    <span className="material-symbols-outlined text-[15px]">alt_route</span>
                    <span>OPTIMIZE ARBITRAGE</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
                {alert.summary}
              </p>

              {/* Affected routes badges */}
              <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-800 text-[10px]">
                <span className="font-bold uppercase text-slate-500">
                  AFFECTED TELEMETRY VECTORS:
                </span>
                {alert.affectedRoutes.map((r, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Alert Preferences */}
        <div
          className={`rounded-2xl p-5 border shadow-sm ${
            isDark ? 'bg-[#090d16] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <h3 className="font-extrabold text-sm mb-3 flex items-center gap-1.5 font-sans">
            <span>AUTOMATED LATENCY HEDGE PARAMETERS</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userSettings.map((setting) => (
              <div
                key={setting.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                    {setting.routeNumber}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block font-sans">
                      {setting.destination}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {setting.triggerDescription} (Hedge: {setting.hedgeThreshold || '±45s'})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleSetting(setting.id)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                    setting.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
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

import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../types';
import { MRT_LINES } from '../data/mockData';
import { ltaApi, LTATrainAlert, LTATrafficIncident } from '../services/ltaApi';

interface MrtStatusViewProps {
  theme: ThemeMode;
}

export const MrtStatusView: React.FC<MrtStatusViewProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [trainAlerts, setTrainAlerts] = useState<LTATrainAlert[]>([]);
  const [trafficIncidents, setTrafficIncidents] = useState<LTATrafficIncident[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadAlerts() {
      setLoading(true);
      const [alertsRes, trafficRes] = await Promise.all([
        ltaApi.getTrainAlerts(),
        ltaApi.getTrafficIncidents()
      ]);
      setLoading(false);

      if (alertsRes.data && alertsRes.data.value) {
        setTrainAlerts(alertsRes.data.value);
      }
      if (trafficRes.data && trafficRes.data.value) {
        setTrafficIncidents(trafficRes.data.value);
      }
    }

    loadAlerts();
  }, []);

  const hasDisruption = trainAlerts.some((a) => a.Status === 2);

  return (
    <div id="mrt-status-view" className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Overview Banner */}
      <div
        className={`p-6 rounded-2xl border transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[24px]">train</span>
              <h2 className="text-xl font-extrabold tracking-tight">Singapore MRT & LRT Rail Status</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Live operating conditions, headway frequencies, and service alerts across all lines.
            </p>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 self-start sm:self-center ${
              hasDisruption
                ? 'bg-red-500/10 border-red-500/30 text-red-600'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hasDisruption ? 'bg-red-500 animate-ping' : 'bg-emerald-500'
              }`}
            ></span>
            <span>{hasDisruption ? 'Service Alert Active' : 'All Rail Lines Normal'}</span>
          </div>
        </div>
      </div>

      {/* Disruption Alerts (if any) */}
      {trainAlerts.length > 0 && hasDisruption && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-500">
            Active Rail Service Alerts
          </h3>
          {trainAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300"
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-[22px]">warning</span>
                <div>
                  <h4 className="font-bold text-sm">{alert.Line || 'Rail System Alert'}</h4>
                  <p className="text-xs mt-1">{alert.Message || 'Service delay reported. Please factor in additional travel time.'}</p>
                  {alert.FreePublicBus && (
                    <div className="mt-2 text-xs font-semibold text-red-800 dark:text-red-200">
                      🚌 Free Regular Bus Service activated: {alert.FreePublicBus}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rail Lines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MRT_LINES.map((line) => (
          <div
            key={line.id}
            className={`p-5 rounded-2xl border transition-all ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  style={{ backgroundColor: line.color }}
                  className="w-12 h-12 rounded-xl text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                >
                  {line.code}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {line.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {line.direction}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                {line.status}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              {line.message}
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Incidents Section (if available) */}
      {trafficIncidents.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">traffic</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Road Traffic & Expressway Incidents ({trafficIncidents.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trafficIncidents.slice(0, 6).map((inc, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>{inc.Type}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">{inc.Message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

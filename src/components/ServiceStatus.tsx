import React, { useState, useEffect } from 'react';
import { ServiceAlert } from '../types';
import { INITIAL_SERVICE_ALERTS, MRT_LINE_COLORS } from '../data/singaporeTransitData';
import { fetchLiveTrainAlerts } from '../services/apiService';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Bus, 
  Train, 
  Info, 
  RefreshCw 
} from 'lucide-react';

export const ServiceStatus: React.FC = () => {
  const [alerts, setAlerts] = useState<ServiceAlert[]>(INITIAL_SERVICE_ALERTS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAlerts = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchLiveTrainAlerts();
      if (data && data.value && data.value.length > 0) {
        const liveItems: ServiceAlert[] = data.value.map((item: any, idx: number) => ({
          id: `live_alert_${idx}`,
          line: item.Line || 'MRT',
          title: item.Line ? `${item.Line} Service Notice` : 'Train Service Notice',
          status: item.Status === '1' ? 'disrupted' : 'delay',
          severity: item.Status === '1' ? 'critical' : 'minor',
          impactDescription: item.Message || item.Content || 'Live train service advisory.',
          updatedAt: item.CreatedDate ? new Date(item.CreatedDate).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }) : 'Live',
          affectedStations: item.Station ? [item.Station] : [],
        }));
        setAlerts(liveItems);
      }
    } catch {
      // keep fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleRefresh = () => {
    loadAlerts();
  };

  const getSeverityBadge = (sev: ServiceAlert['severity']) => {
    switch (sev) {
      case 'normal':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-emerald-400 text-slate-900 border-2 border-slate-900 flex items-center gap-1.5 bento-shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Normal Service
          </span>
        );
      case 'minor':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-amber-400 text-slate-900 border-2 border-slate-900 flex items-center gap-1.5 bento-shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            Minor Delay
          </span>
        );
      case 'critical':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-rose-500 text-white border-2 border-slate-900 flex items-center gap-1.5 bento-shadow-sm animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            Disrupted
          </span>
        );
      case 'planned':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-blue-500 text-white border-2 border-slate-900 flex items-center gap-1.5 bento-shadow-sm">
            <Info className="w-3.5 h-3.5" />
            Planned Maint.
          </span>
        );
    }
  };

  return (
    <div
      id="service-status-panel"
      className="w-full h-full bg-white border-4 border-slate-900 rounded-3xl bento-shadow-md flex flex-col p-4 md:p-6 overflow-y-auto select-none"
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-200 flex-shrink-0">
        <div>
          <h2 className="text-xl font-black uppercase italic text-slate-900 tracking-tight">Singapore Rail Status</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SMRT & SBS Transit Live Telemetry</p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 border-2 border-slate-900 bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
          title="Refresh Network Status"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Network Overview Summary Card */}
      <div className="bg-slate-50 border-3 border-slate-900 rounded-2xl p-4 mb-4 bento-shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
            Overall Rail Health
          </span>
          <span className="text-[11px] font-black text-slate-900 bg-emerald-400 border border-slate-900 px-2 py-0.5 rounded-lg bento-shadow-sm">
            98.5% On-Time
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t-2 border-slate-200">
          <div className="bg-white p-2 rounded-xl border-2 border-slate-900 bento-shadow-sm">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Lines</span>
            <p className="text-base font-black text-slate-900 mt-0.5">6 MRT</p>
          </div>
          <div className="bg-white p-2 rounded-xl border-2 border-slate-900 bento-shadow-sm">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Stations</span>
            <p className="text-base font-black text-emerald-700 mt-0.5">140+</p>
          </div>
          <div className="bg-white p-2 rounded-xl border-2 border-slate-900 bento-shadow-sm">
            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Alerts</span>
            <p className="text-base font-black text-amber-600 mt-0.5">1 Minor</p>
          </div>
        </div>
      </div>

      {/* Line-by-Line Status Feed */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {alerts.map((alert) => {
          const lineMeta = alert.line !== 'GENERAL' && alert.line !== 'BUS_NETWORK' ? MRT_LINE_COLORS[alert.line] : null;
          return (
            <div
              key={alert.id}
              className="bg-white border-3 border-slate-900 rounded-2xl p-4 bento-shadow-sm hover:bento-shadow transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {lineMeta ? (
                    <span
                      style={{ backgroundColor: lineMeta.bg }}
                      className="text-xs font-black text-white px-2.5 py-0.5 rounded-lg border border-slate-900 shadow-sm"
                    >
                      {alert.line}
                    </span>
                  ) : (
                    <span className="text-xs font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-lg border border-slate-900">
                      BUS
                    </span>
                  )}
                  <h4 className="text-sm font-black text-slate-900">
                    {lineMeta ? lineMeta.name : alert.title}
                  </h4>
                </div>

                {getSeverityBadge(alert.severity)}
              </div>

              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                {alert.impactDescription}
              </p>

              {alert.alternativeAdvice && (
                <div className="bg-amber-50 border-2 border-slate-900 rounded-xl p-2.5 text-xs text-slate-900 flex items-start gap-2 bento-shadow-sm">
                  <Bus className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-900 font-black">Alternative Commute: </strong>
                    <span className="font-semibold text-slate-800">{alert.alternativeAdvice}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100 text-[10px] font-bold text-slate-500">
                <span>Updated: {alert.updatedAt}</span>
                {alert.freeShuttleAvailable && (
                  <span className="text-emerald-700 font-black bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                    Free Shuttle Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

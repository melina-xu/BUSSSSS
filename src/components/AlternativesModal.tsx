import React from 'react';
import { NetworkAlert, ThemeMode } from '../types';

interface AlternativesModalProps {
  theme: ThemeMode;
  alert: NetworkAlert | null;
  onClose: () => void;
}

export const AlternativesModal: React.FC<AlternativesModalProps> = ({
  theme,
  alert,
  onClose
}) => {
  if (!alert) return null;
  const isDark = theme === 'dark';

  const defaultAlternatives = [
    {
      name: 'Corridor 99X (Autonomous Flyover Bypass)',
      description: 'Pre-cleared high-speed arterial bypass eliminating signal friction.',
      estTime: '14 min (+5.2m Alpha)',
      confidence: '99.9%'
    },
    {
      name: 'Subterranean Downtown HSR Loop',
      description: 'CBTC automated magnetic rail with zero street-level congestion.',
      estTime: '17 min (+3.8m Alpha)',
      confidence: '99.5%'
    },
    {
      name: 'Executive Autonomous Pod Cluster',
      description: 'On-demand synchronized micro-fleet operating at 60 km/h.',
      estTime: '12 min (+7.1m Alpha)',
      confidence: '99.1%'
    }
  ];

  return (
    <div
      id="aether-quant-alternatives-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 font-mono"
    >
      <div
        className={`max-w-xl w-full rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          isDark ? 'bg-[#090d16] border-slate-800 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-black">
              <span className="material-symbols-outlined text-[20px]">alt_route</span>
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white dark:text-white font-sans">
                {alert.title}
              </h2>
              <p className="text-[10px] text-slate-400">Algorithmic Arbitrage Vectors & Bypass Telemetry</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div className="p-3 rounded-xl bg-[#06080d] border border-slate-800 text-xs leading-relaxed text-slate-300 font-sans">
            {alert.summary}
          </div>

          <div>
            <h4 className="text-[10px] font-extrabold uppercase text-cyan-400 mb-2 flex items-center gap-1">
              <span>PRE-COMPUTED ARBITRAGE BYPASSES</span>
            </h4>

            <div className="space-y-2">
              {defaultAlternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-[#0b0f19] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-cyan-400 text-[18px]">bolt</span>
                    <div>
                      <div className="font-bold text-xs text-slate-200 font-sans">{alt.name}</div>
                      <div className="text-[10px] text-slate-400">{alt.description}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="text-xs font-black text-emerald-400 block">{alt.estTime}</span>
                    <span className="text-[9px] text-slate-500">{alt.confidence} Conf</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skipped Stops if any */}
          {alert.skippedStops && alert.skippedStops.length > 0 && (
            <div className="pt-2">
              <span className="text-[9px] font-black uppercase text-amber-400 block mb-1">
                EXCLUDED FRICTION NODES:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {alert.skippedStops.map((stopCode, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  >
                    Node #{stopCode}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-3.5 border-t flex justify-end ${
            isDark ? 'bg-[#0d121f] border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}
        >
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-black bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-xs"
          >
            EXECUTE ARBITRAGE BYPASS
          </button>
        </div>
      </div>
    </div>
  );
};

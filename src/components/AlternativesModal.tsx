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
      name: 'Direct Shuttle 99X (Sakura Express)',
      description: 'Bypasses the affected corridor via Boulevard Expressway.',
      estTime: '18 min'
    },
    {
      name: 'MRT Downtown Loop Line',
      description: 'Fast, smooth rail bypass with direct transfers.',
      estTime: '22 min'
    },
    {
      name: 'Shared Candy EV Shuttle',
      description: 'On-demand micro-transit running every 4 minutes.',
      estTime: '15 min'
    }
  ];

  return (
    <div
      id="girly-alternatives-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        className={`max-w-xl w-full rounded-3xl shadow-2xl border overflow-hidden transition-all ${
          isDark ? 'bg-[#20121e] border-[#381a34] text-pink-50' : 'bg-white border-pink-200 text-[#371329]'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'bg-[#281525] border-[#381a34]' : 'bg-[#fff5f8] border-pink-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-md shadow-pink-500/25">
              <span className="material-symbols-outlined text-[22px]">alt_route</span>
            </div>
            <div>
              <h2 className="font-black text-lg flex items-center gap-1.5">
                <span>{alert.title}</span>
                <span className="text-xs">🌸</span>
              </h2>
              <p className="text-xs text-pink-400 font-medium">Advisory Details & Sweet Alternates ✨</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-pink-400 hover:text-pink-600 hover:bg-pink-100 dark:hover:bg-pink-900/40"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div className="p-3.5 rounded-2xl bg-pink-100/50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/40 text-xs font-semibold leading-relaxed text-pink-700 dark:text-pink-300">
            {alert.summary}
          </div>

          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-pink-500 mb-2.5 flex items-center gap-1">
              <span>🌸</span> Recommended Alternative Routes
            </h4>

            <div className="space-y-2.5">
              {defaultAlternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-[#281525] border-[#381a34]' : 'bg-[#fff5f8] border-pink-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌸</span>
                    <div>
                      <div className="font-bold text-xs text-[#371329] dark:text-pink-100">{alt.name}</div>
                      <div className="text-[11px] text-pink-500">{alt.description}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-rose-500">{alt.estTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skipped Stops if any */}
          {alert.skippedStops && alert.skippedStops.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 block mb-1">
                Temporarily Skipped Stops:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {alert.skippedStops.map((stopCode, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                  >
                    Stop #{stopCode}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex justify-end ${
            isDark ? 'bg-[#180e19] border-[#381a34]' : 'bg-[#fff0f5] border-pink-200'
          }`}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm"
          >
            Got it 💖
          </button>
        </div>
      </div>
    </div>
  );
};

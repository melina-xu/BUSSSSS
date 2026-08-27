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

  return (
    <div
      id="alternatives-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        className={`max-w-xl w-full rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white border-[#becab6] text-[#1b1c1c]'
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">alt_route</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">{alert.title}</h2>
              <p className="text-xs text-gray-400">Advisory Details & Alternate Routes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-500/20"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs leading-relaxed">
            {alert.summary}
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Recommended Alternative Routes
            </h4>
            <div className="space-y-2">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-6 rounded-full bg-[#006e05] text-white font-bold text-xs flex items-center justify-center">
                    42
                  </div>
                  <div>
                    <div className="text-xs font-bold">Bus 42 • Crosstown Express</div>
                    <div className="text-[11px] text-gray-400">Honoring passes at all subway stops (+3 min)</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#37ab2e]">Boarding in 3m</span>
              </div>

              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-6 rounded-full bg-[#1e88e5] text-white font-bold text-xs flex items-center justify-center">
                    M1
                  </div>
                  <div>
                    <div className="text-xs font-bold">M1 • Uptown Express via Park Ave</div>
                    <div className="text-[11px] text-gray-400">Direct non-stop bypass (+0 min delay)</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#37ab2e]">Boarding Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex justify-end ${
            isDark ? 'bg-[#201f1f] border-[#2e2e2e]' : 'bg-[#f5f3f3] border-[#becab6]'
          }`}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#006e05] hover:bg-[#37ab2e] text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

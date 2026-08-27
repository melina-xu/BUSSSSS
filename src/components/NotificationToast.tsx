import React, { useEffect } from 'react';
import { ThemeMode } from '../types';

interface NotificationToastProps {
  theme: ThemeMode;
  title: string;
  message: string;
  routeNumber?: string;
  onClose: () => void;
  autoCloseMs?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  theme,
  title,
  message,
  routeNumber = 'HSR-01',
  onClose,
  autoCloseMs = 5000
}) => {
  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [onClose, autoCloseMs]);

  return (
    <div
      id="aether-quant-push-toast"
      className="fixed top-16 right-6 z-50 max-w-sm w-full font-mono select-none"
    >
      <div
        className={`rounded-2xl p-4 shadow-2xl border flex items-start gap-3 backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-[#090d16]/95 border-cyan-500/50 text-slate-100 shadow-[0_10px_30px_rgba(0,240,255,0.15)]'
            : 'bg-white/95 border-slate-300 text-slate-900 shadow-xl'
        }`}
      >
        {/* Quant Icon */}
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">sensors</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-white dark:text-white font-sans">{title}</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {routeNumber}
              </span>
            </div>
            <span className="text-[9px] text-slate-400">P99: 0.04m</span>
          </div>

          <p className="text-xs text-slate-300 mt-1 leading-snug font-sans">
            {message}
          </p>

          <div className="mt-2 flex items-center justify-between text-[9px]">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span>●</span>
              <span>TELEMETRY SYNCHRONIZED</span>
            </span>
            <button
              onClick={onClose}
              className="font-bold text-slate-400 hover:text-slate-200"
            >
              DISMISS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

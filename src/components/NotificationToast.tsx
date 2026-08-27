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
  routeNumber = '196',
  onClose,
  autoCloseMs = 6000
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
      id="commuter-push-toast"
      className="fixed top-20 right-6 z-50 max-w-sm w-full animate-bounce-short select-none"
    >
      <div
        className={`rounded-2xl p-4 shadow-2xl border flex items-start gap-3 backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-[#1c1b1b]/95 border-[#37ab2e] text-[#e5e2e1] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'bg-white/95 border-[#006e05] text-[#1b1c1c] shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
        }`}
      >
        {/* Bus badge */}
        <div className="w-10 h-10 rounded-xl bg-[#006e05] text-white flex items-center justify-center shrink-0 shadow-md">
          <span className="material-symbols-outlined text-[22px]">directions_bus</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm">{title}</span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#1e88e5] text-white">
                {routeNumber}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">Just now</span>
          </div>

          <p className="text-xs text-gray-400 mt-1 leading-snug">{message}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-[#1e88e5] animate-ping" />
            <span className="text-[11px] font-bold text-[#1e88e5]">Approaching in 2 stops</span>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200 p-1"
          title="Dismiss"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
};

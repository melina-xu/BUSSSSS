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
        className={`rounded-3xl p-4 shadow-2xl border flex items-start gap-3 backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-[#20121e]/95 border-pink-500 text-pink-50 shadow-[0_10px_30px_rgba(244,114,182,0.25)]'
            : 'bg-white/95 border-pink-400 text-[#371329] shadow-[0_10px_30px_rgba(244,114,182,0.2)]'
        }`}
      >
        {/* Cute Blossom Icon */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-500/25">
          <span className="material-symbols-outlined text-[22px]">favorite</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm">{title}</span>
              <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-pink-500 text-white">
                {routeNumber}
              </span>
            </div>
            <span className="text-[10px] text-pink-400 font-bold">Just now 🌸</span>
          </div>

          <p className="text-xs text-pink-600 dark:text-pink-200/80 mt-1 leading-snug font-medium">
            {message}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-rose-500 flex items-center gap-1">
              <span>✨</span>
              <span>Arriving on schedule</span>
            </span>
            <button
              onClick={onClose}
              className="text-[10px] font-bold text-pink-400 hover:text-pink-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

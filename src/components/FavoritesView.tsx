import React from 'react';
import { ThemeMode, FavoriteItem, BusStopDetail } from '../types';
import { SINGAPORE_BUS_STOPS } from '../data/mockData';

interface FavoritesViewProps {
  theme: ThemeMode;
  favorites: FavoriteItem[];
  onSelectStopCode: (code: string) => void;
  onRemoveFavorite: (id: string) => void;
  onGoToSearch: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  theme,
  favorites,
  onSelectStopCode,
  onRemoveFavorite,
  onGoToSearch
}) => {
  const isDark = theme === 'dark';

  const stopFavorites = favorites.filter((f) => f.type === 'stop');
  const serviceFavorites = favorites.filter((f) => f.type === 'service');

  return (
    <div id="favorites-view" className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header Banner */}
      <div
        className={`p-6 rounded-2xl border transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-[24px]">star</span>
              <h2 className="text-xl font-extrabold tracking-tight">Saved Bus Stops & Services</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your daily commuter bookmarks. Stored locally on this device for instant access anytime.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToSearch}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-center"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add More Stops</span>
          </button>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div
          className={`p-12 rounded-2xl border text-center ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[30px]">star_border</span>
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Saved Stops Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Tap the star icon (⭐) next to any bus stop or bus service number in the search tab to pin your daily commute here!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {SINGAPORE_BUS_STOPS.slice(0, 4).map((stop) => (
              <button
                key={stop.code}
                type="button"
                onClick={() => onSelectStopCode(stop.code)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                + {stop.name} ({stop.code})
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Saved Bus Stops */}
          {stopFavorites.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Starred Bus Stops ({stopFavorites.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stopFavorites.map((fav) => (
                  <div
                    key={fav.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div
                      onClick={() => onSelectStopCode(fav.busStopCode)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                        {fav.busStopCode}
                      </div>

                      <div className="min-w-0 flex-1 pr-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {fav.busStopName}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {fav.roadName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectStopCode(fav.busStopCode)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-colors"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveFavorite(fav.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Starred Bus Services */}
          {serviceFavorites.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Starred Bus Lines ({serviceFavorites.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceFavorites.map((fav) => (
                  <div
                    key={fav.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div
                      onClick={() => onSelectStopCode(fav.busStopCode)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-emerald-500/20 text-white dark:text-emerald-400 font-mono font-black text-base shrink-0">
                        {fav.serviceNo}
                      </div>

                      <div className="min-w-0 flex-1 pr-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {fav.busStopName}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          Stop {fav.busStopCode} • {fav.roadName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectStopCode(fav.busStopCode)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-colors"
                      >
                        Timings
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveFavorite(fav.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

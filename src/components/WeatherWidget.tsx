import React, { useState } from 'react';
import { SingaporeWeather } from '../types';
import { CloudRain, Sun, Cloud, CloudLightning, Wind, Droplets, ShieldAlert, X } from 'lucide-react';

interface WeatherWidgetProps {
  weather: SingaporeWeather;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, isOpenModal, onCloseModal }) => {
  const [expanded, setExpanded] = useState(false);

  const getWeatherIcon = (cond: string, className: string = 'w-6 h-6') => {
    const c = cond.toLowerCase();
    if (c.includes('thunder') || c.includes('storm')) {
      return <CloudLightning className={`${className} text-[#ff9800]`} />;
    }
    if (c.includes('rain') || c.includes('shower')) {
      return <CloudRain className={`${className} text-[#a2c9ff]`} />;
    }
    if (c.includes('cloud')) {
      return <Cloud className={`${className} text-[#becab6]`} />;
    }
    return <Sun className={`${className} text-[#6cdf5c]`} />;
  };

  const showDetails = expanded || isOpenModal;

  return (
    <>
      {/* Floating Pill on Desktop */}
      <div className="hidden md:block pointer-events-auto">
        <button
          id="weather-badge-button"
          onClick={() => setExpanded(!expanded)}
          className="bg-white hover:bg-amber-100 transition-all border-3 border-slate-900 rounded-2xl p-3 flex items-center gap-3 bento-shadow text-left cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          title="Click to view full Singapore 2-Hour Weather & Transit Advisory"
        >
          <div className="p-1.5 rounded-xl bg-amber-400 border-2 border-slate-900 bento-shadow-sm">
            {getWeatherIcon(weather.condition, 'w-6 h-6')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-base font-black text-slate-900">
                {weather.temperature}°C
              </p>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-md border border-slate-900">
                SG LIVE
              </span>
            </div>
            <p className="text-xs font-bold text-slate-600">{weather.condition}</p>
          </div>
        </button>
      </div>

      {/* Expanded Modal / Popover */}
      {showDetails && (
        <div
          id="weather-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => {
            setExpanded(false);
            if (onCloseModal) onCloseModal();
          }}
        >
          <div
            className="bg-white border-4 border-slate-900 rounded-3xl w-full max-w-lg p-6 bento-shadow-lg space-y-5 text-slate-900 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400 rounded-2xl border-2 border-slate-900 bento-shadow-sm">
                  {getWeatherIcon(weather.condition, 'w-7 h-7')}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic text-slate-900">Singapore Weather & Environment</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time NEA / MSS Weather API</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setExpanded(false);
                  if (onCloseModal) onCloseModal();
                }}
                className="text-slate-900 hover:bg-slate-100 p-1.5 rounded-xl border-2 border-slate-900 bento-shadow-sm transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-2.5">
              <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3 text-center bento-shadow-sm">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Temp</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{weather.temperature}°C</p>
              </div>
              <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3 text-center bento-shadow-sm">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Rainfall</span>
                <p className="text-xl font-black text-blue-600 mt-0.5">{weather.rainfallMm} mm</p>
              </div>
              <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3 text-center bento-shadow-sm">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Humidity</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{weather.humidity}%</p>
              </div>
              <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3 text-center bento-shadow-sm">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">24h PSI</span>
                <p className="text-xl font-black text-emerald-700 mt-0.5">{weather.psi}</p>
                <span className="text-[9px] text-emerald-800 font-black bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">GOOD</span>
              </div>
            </div>

            {/* Transit Advisory */}
            {weather.transitAdvisory && (
              <div className="bg-amber-100 border-2 border-slate-900 rounded-2xl p-3.5 flex items-start gap-3 bento-shadow-sm">
                <ShieldAlert className="w-5 h-5 text-amber-900 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-amber-950 uppercase tracking-wider">Commuter Weather Advisory</p>
                  <p className="text-xs font-bold text-amber-900 mt-0.5">{weather.transitAdvisory}</p>
                </div>
              </div>
            )}

            {/* Regional 2-Hour Nowcast Breakdown */}
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2.5">
                Regional 2-Hour Nowcast
              </p>
              <div className="grid grid-cols-5 gap-2">
                {weather.regionForecasts.map((rf) => (
                  <div key={rf.region} className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-2.5 text-center flex flex-col items-center bento-shadow-sm">
                    <span className="text-xs font-black text-slate-900">{rf.region}</span>
                    <div className="my-1.5">{getWeatherIcon(rf.forecast, 'w-5 h-5')}</div>
                    <span className="text-xs font-black text-blue-600">{rf.temp}°C</span>
                    <span className="text-[10px] font-bold text-slate-500">{rf.rainChance}% rain</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hourly Trend */}
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Hourly Trend</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {weather.hourlyForecast.map((h, i) => (
                  <div key={i} className="flex-shrink-0 bg-slate-50 border-2 border-slate-900 rounded-xl p-2 text-center min-w-[70px] bento-shadow-sm">
                    <p className="text-[10px] text-slate-500 font-black">{h.time}</p>
                    <p className="text-sm font-black text-slate-900 my-0.5">{h.temp}°C</p>
                    <p className="text-[10px] font-bold text-blue-600">{h.rainProb}% rain</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

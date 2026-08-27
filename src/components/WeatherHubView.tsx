import React, { useState } from 'react';
import { ThemeMode, WeatherData } from '../types';
import { WEATHER_DATA, MAP_IMAGES } from '../data/mockData';

interface WeatherHubViewProps {
  theme: ThemeMode;
  activeCity: string;
}

export const WeatherHubView: React.FC<WeatherHubViewProps> = ({
  theme,
  activeCity
}) => {
  const isDark = theme === 'dark';
  const [weather] = useState<WeatherData>(WEATHER_DATA);
  const [radarZoom, setRadarZoom] = useState(1);
  const [selectedHour, setSelectedHour] = useState<number | null>(0);

  return (
    <div id="aether-quant-weather-hub-view" className="flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto p-6 custom-scrollbar font-mono">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-extrabold text-cyan-400 tracking-widest uppercase flex items-center gap-1.5">
              <span>ATMOSPHERIC TELEMETRY</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-1 text-white dark:text-white font-sans">
              Micro-Climate Friction Matrix & Doppler Radar
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                isDark
                  ? 'bg-[#090d16] border-slate-800 text-slate-200'
                  : 'bg-white border-slate-300 text-slate-900 shadow-xs'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>DOPPLER SENSORS: 100% RESOLUTION • {activeCity || weather.city}</span>
            </div>
          </div>
        </div>

        {/* Top 2-Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Conditions Card */}
          <div
            className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between ${
              isDark ? 'bg-[#090d16] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div>
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-cyan-400 mb-3 flex items-center gap-1.5">
                <span>ATMOSPHERIC VECTOR STATUS</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black text-white dark:text-white">{weather.temp}°{weather.unit}</div>
                  <div className="text-xs font-bold text-cyan-400 mt-1 flex items-center gap-1">
                    <span>{weather.condition}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">wb_sunny</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {weather.impactSummary}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <div className="p-2 rounded bg-[#06080d] border border-slate-800">
                  <span className="text-slate-500 block">FRICTION INDEX</span>
                  <span className="font-bold text-emerald-400">{weather.frictionIndex || '0.04 (NOMINAL)'}</span>
                </div>
                <div className="p-2 rounded bg-[#06080d] border border-slate-800">
                  <span className="text-slate-500 block">BAROMETRIC</span>
                  <span className="font-bold text-cyan-400">{weather.pressureHpa || 1014.2} hPa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Forecast SVG Chart */}
          <div
            className={`md:col-span-2 rounded-2xl p-5 border shadow-sm flex flex-col justify-between ${
              isDark ? 'bg-[#090d16] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-cyan-400 flex items-center gap-1.5">
                <span>HOURLY TEMPERATURE & FRICTION PREDICTION</span>
              </div>
              <span className="text-xs text-slate-400 font-mono font-bold">ZERO CORRIDOR LATENCY</span>
            </div>

            {/* SVG spline chart with hourly points */}
            <div className="relative h-28 w-full mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="quantWeatherCurveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d="M 0,35 Q 60,20 125,15 T 250,25 T 375,45 T 500,60 L 500,80 L 0,80 Z"
                  fill="url(#quantWeatherCurveGrad)"
                />
                {/* Curve line */}
                <path
                  d="M 0,35 Q 60,20 125,15 T 250,25 T 375,45 T 500,60"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Hourly Data Points Overlay */}
              <div className="absolute inset-0 flex items-end justify-between px-2 pb-1">
                {weather.hourlyPoints.map((hour, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedHour(idx)}
                    className={`flex flex-col items-center cursor-pointer transition-transform hover:scale-110 p-1 rounded-lg ${
                      selectedHour === idx ? 'bg-cyan-500/20 border border-cyan-500/40' : ''
                    }`}
                  >
                    <span className="text-xs font-black text-cyan-400">{hour.temp}°</span>
                    <span className="text-[10px] text-slate-400">{hour.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forecast footer tags */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-slate-800">
              <span>PRECIPITATION: &lt;5% • OPTICAL VISIBILITY: {weather.visibilityKm || 16} KM</span>
              <span className="font-bold text-emerald-400">NOMINAL CONDITIONS</span>
            </div>
          </div>
        </div>

        {/* Live Weather Radar Card */}
        <div
          className={`rounded-2xl p-5 border shadow-sm ${
            isDark ? 'bg-[#090d16] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5 font-sans">
                <span>DOPPLER SATELLITE & CORRIDOR THERMAL SCAN</span>
              </h3>
              <p className="text-[10px] text-slate-400">High-altitude synthetic aperture radar telemetry</p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setRadarZoom((p) => Math.min(p + 0.2, 1.6))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-300 font-bold flex items-center justify-center hover:bg-slate-700"
              >
                +
              </button>
              <button
                onClick={() => setRadarZoom((p) => Math.max(p - 0.2, 0.8))}
                className="w-7 h-7 rounded-lg bg-slate-800 text-cyan-300 font-bold flex items-center justify-center hover:bg-slate-700"
              >
                -
              </button>
            </div>
          </div>

          <div className="relative h-72 w-full rounded-xl overflow-hidden border border-slate-800">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
              style={{
                backgroundImage: `url('${MAP_IMAGES.nycRadarNight}')`,
                transform: `scale(${radarZoom})`,
                filter: isDark ? 'contrast(1.3) brightness(0.9)' : 'contrast(1.1) brightness(1.0)'
              }}
            />
            <div className="absolute top-3 left-3 bg-[#090d16]/90 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>SYNTHETIC DOPPLER • LIVE INGESTION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

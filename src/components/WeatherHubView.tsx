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
    <div id="girly-weather-hub-view" className="flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-extrabold text-pink-500 tracking-widest uppercase flex items-center gap-1">
              <span>🌸</span> Commuter Atmosphere & Sky
            </div>
            <h1 className="text-3xl font-black tracking-tight mt-1 flex items-center gap-2">
              <span>Weather Hub & Blossom Radar</span>
              <span>🌷</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border ${
                isDark
                  ? 'bg-[#20121e] border-[#381a34] text-pink-200'
                  : 'bg-white border-pink-200 text-[#371329] shadow-xs'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
              <span>Live Telemetry • {activeCity || weather.city} ✨</span>
            </div>
          </div>
        </div>

        {/* Top 2-Card Row: Current Conditions & Hourly Forecast */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Conditions Card */}
          <div
            className={`rounded-3xl p-5 border shadow-sm flex flex-col justify-between ${
              isDark ? 'bg-[#20121e] border-[#381a34] text-pink-50' : 'bg-white border-pink-200 text-[#371329]'
            }`}
          >
            <div>
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-pink-500 mb-3 flex items-center gap-1">
                <span>🌸</span> Current Atmosphere
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-black font-timer-display">{weather.temp}°{weather.unit}</div>
                  <div className="text-sm font-extrabold text-rose-500 mt-1 flex items-center gap-1">
                    <span>✨</span>
                    <span>{weather.condition}</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-500/25">
                  <span className="material-symbols-outlined text-3xl">wb_sunny</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-pink-100 dark:border-pink-900/30">
              <p className="text-xs text-pink-600 dark:text-pink-200/80 leading-relaxed font-medium">
                {weather.impactSummary}
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold text-pink-500">
                <span>🧴</span>
                <span>Pro tip: UV index 7 — remember your sunscreen & cute hat!</span>
              </div>
            </div>
          </div>

          {/* Hourly Forecast SVG Chart */}
          <div
            className={`md:col-span-2 rounded-3xl p-5 border shadow-sm flex flex-col justify-between ${
              isDark ? 'bg-[#20121e] border-[#381a34] text-pink-50' : 'bg-white border-pink-200 text-[#371329]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-pink-500 flex items-center gap-1">
                <span>🌷</span> Hourly Commuter Temperature
              </div>
              <span className="text-xs text-pink-400 font-bold">Pleasant Breeze</span>
            </div>

            {/* SVG spline chart with hourly points */}
            <div className="relative h-28 w-full mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="girlyWeatherCurveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d="M 0,35 Q 60,20 125,15 T 250,25 T 375,45 T 500,60 L 500,80 L 0,80 Z"
                  fill="url(#girlyWeatherCurveGrad)"
                />
                {/* Curve line */}
                <path
                  d="M 0,35 Q 60,20 125,15 T 250,25 T 375,45 T 500,60"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Hourly Data Points Overlay */}
              <div className="absolute inset-0 flex items-end justify-between px-2 pb-1">
                {weather.hourlyPoints.map((hour, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedHour(idx)}
                    className={`flex flex-col items-center cursor-pointer transition-transform hover:scale-110 p-1 rounded-xl ${
                      selectedHour === idx ? 'bg-pink-100/70 dark:bg-pink-950/70' : ''
                    }`}
                  >
                    <span className="text-xs font-black text-rose-500">{hour.temp}°</span>
                    <span className="text-[10px] text-pink-400">{hour.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forecast footer tags */}
            <div className="flex items-center justify-between text-[11px] text-pink-500 pt-3 border-t border-pink-100 dark:border-pink-900/30">
              <span className="font-semibold">Precipitation: 10% • Wind: 12 km/h</span>
              <span className="font-bold">✨ Great commute conditions</span>
            </div>
          </div>
        </div>

        {/* Live Weather Radar Card */}
        <div
          className={`rounded-3xl p-5 border shadow-sm ${
            isDark ? 'bg-[#20121e] border-[#381a34] text-pink-50' : 'bg-white border-pink-200 text-[#371329]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-base flex items-center gap-1.5">
                <span>🌸</span>
                <span>Precipitation & Cloud Radar</span>
              </h3>
              <p className="text-xs text-pink-400">High-resolution Doppler radar telemetry</p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setRadarZoom((p) => Math.min(p + 0.2, 1.6))}
                className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 font-bold flex items-center justify-center hover:bg-pink-200"
              >
                +
              </button>
              <button
                onClick={() => setRadarZoom((p) => Math.max(p - 0.2, 0.8))}
                className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 font-bold flex items-center justify-center hover:bg-pink-200"
              >
                -
              </button>
            </div>
          </div>

          <div className="relative h-72 w-full rounded-2xl overflow-hidden border border-pink-200 dark:border-pink-900/40">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
              style={{
                backgroundImage: `url('${MAP_IMAGES.nycRadarNight}')`,
                transform: `scale(${radarZoom})`,
                filter: isDark ? 'saturate(1.2) hue-rotate(320deg)' : 'hue-rotate(320deg) brightness(1.05)'
              }}
            />
            <div className="absolute top-3 left-3 bg-[#1e101f]/85 border border-pink-500/40 text-pink-200 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>Live Cloud Doppler ✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

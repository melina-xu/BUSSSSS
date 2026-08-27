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
  const [selectedHour, setSelectedHour] = useState<number | null>(2);

  return (
    <div id="weather-hub-view" className="flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
              Urban Kinetic / Atmospheric Telemetry
            </div>
            <h1 className="text-3xl font-black tracking-tight mt-1">Weather Hub</h1>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border ${
                isDark
                  ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]'
                  : 'bg-white border-[#becab6] text-[#1b1c1c]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#37ab2e] animate-pulse"></span>
              <span>Live Telemetry • {activeCity || weather.city}</span>
            </div>
          </div>
        </div>

        {/* Top 2-Card Row: Current Conditions & Hourly Forecast */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Conditions Card */}
          <div
            className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between ${
              isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white border-[#becab6] text-[#1b1c1c]'
            }`}
          >
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                Current Conditions
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-black font-timer-display">{weather.temp}°{weather.unit}</div>
                  <div className="text-sm font-bold text-[#37ab2e] mt-1">{weather.condition}</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#37ab2e]/15 flex items-center justify-center text-[#37ab2e]">
                  <span className="material-symbols-outlined text-4xl">wb_sunny</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 leading-relaxed pt-3 border-t border-gray-500/20">
              {weather.impactSummary}
            </p>
          </div>

          {/* Hourly Forecast SVG Chart (Spans 2 cols on md) */}
          <div
            className={`md:col-span-2 rounded-2xl p-5 border shadow-sm flex flex-col justify-between ${
              isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white border-[#becab6] text-[#1b1c1c]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                Hourly Commuter Forecast
              </div>
              <span className="text-xs text-gray-400 font-medium">Temperature & Precip</span>
            </div>

            {/* SVG spline chart with hourly points */}
            <div className="relative h-28 w-full mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="weatherCurveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#37ab2e" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#37ab2e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d="M 0,35 Q 60,20 125,15 T 250,25 T 375,45 T 500,60 L 500,80 L 0,80 Z"
                  fill="url(#weatherCurveGrad)"
                />
                {/* Curve line */}
                <path
                  d="M 0,35 Q 60,20 125,15 T 250,25 T 375,45 T 500,60"
                  fill="none"
                  stroke="#37ab2e"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              {/* Data points overlay */}
              <div className="absolute inset-0 flex justify-between items-center px-4">
                {weather.hourlyPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedHour(idx)}
                    className={`flex flex-col items-center cursor-pointer p-1 rounded-lg transition-transform hover:scale-110 ${
                      selectedHour === idx ? 'bg-[#37ab2e]/15' : ''
                    }`}
                  >
                    <span className="text-xs font-bold">{pt.temp}°</span>
                    <span className="text-[10px] text-gray-400 font-semibold mt-1">{pt.time}</span>
                    <span className="text-[9px] text-[#1e88e5] font-semibold">{pt.pop}% pop</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-500/20">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#37ab2e]">check_circle</span>
                Dry commuting through +2H
              </span>
              <span className="text-[#ff9800] font-semibold">60% chance of showers at +4H</span>
            </div>
          </div>
        </div>

        {/* Live Commuter Radar Map & Rain Probability */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Interactive Radar View (2 cols on lg) */}
          <div
            className={`lg:col-span-2 rounded-2xl border shadow-sm overflow-hidden flex flex-col relative h-96 ${
              isDark ? 'bg-[#121212] border-[#2e2e2e]' : 'bg-[#dbd9d9] border-[#becab6]'
            }`}
          >
            {/* Map image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
              style={{
                backgroundImage: `url('${MAP_IMAGES.nycRadarNight}')`,
                transform: `scale(${radarZoom})`,
                transformOrigin: 'center center'
              }}
            />

            {/* Radar animated scan pulse overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 text-white backdrop-blur-md border border-white/15 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-[#37ab2e] animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider">Live Commuter Radar</span>
              </div>
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-col rounded-xl overflow-hidden shadow-xl border border-white/20 bg-black/80 backdrop-blur-md">
              <button
                onClick={() => setRadarZoom((z) => Math.min(z + 0.2, 1.8))}
                className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/20"
                title="Zoom in"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <div className="h-[1px] bg-white/20" />
              <button
                onClick={() => setRadarZoom((z) => Math.max(z - 0.2, 0.9))}
                className="w-9 h-9 flex items-center justify-center text-white hover:bg-white/20"
                title="Zoom out"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
            </div>

            {/* Precipitation Intensity Legend */}
            <div className="absolute bottom-4 left-4 z-20 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-white max-w-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                Precipitation Intensity
              </div>
              <div className="h-2 w-44 rounded-full bg-gradient-to-r from-[#88fc75] via-[#ffeb3b] to-[#ff1744] mb-1" />
              <div className="flex justify-between text-[9px] text-gray-300">
                <span>Light</span>
                <span>Moderate</span>
                <span>Heavy</span>
              </div>
            </div>
          </div>

          {/* Right: Rain Probability 12-Hour Bar Chart & Advisories */}
          <div className="space-y-4">
            {/* Rain Bar Chart */}
            <div
              className={`p-5 rounded-2xl border shadow-sm ${
                isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white border-[#becab6] text-[#1b1c1c]'
              }`}
            >
              <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                12-Hour Rain Probability
              </div>

              <div className="flex items-end justify-between h-32 pt-4 px-2">
                {weather.rainProbability.map((bar, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.prob}%
                    </span>
                    <div
                      className={`w-7 rounded-t-lg transition-all duration-300 ${
                        bar.highlight
                          ? 'bg-[#37ab2e] shadow-[0_0_10px_rgba(55,171,46,0.5)]'
                          : isDark
                          ? 'bg-[#2a2a2a] group-hover:bg-[#353534]'
                          : 'bg-[#e4e2e2] group-hover:bg-[#becab6]'
                      }`}
                      style={{ height: `${Math.max(bar.prob * 0.9, 8)}%` }}
                    />
                    <span className="text-[11px] font-semibold text-gray-400 mt-1">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commuter Advisories */}
            <div
              className={`p-5 rounded-2xl border shadow-sm ${
                isDark ? 'bg-[#1c1b1b] border-[#2e2e2e] text-[#e5e2e1]' : 'bg-white border-[#becab6] text-[#1b1c1c]'
              }`}
            >
              <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">
                Weather Impact Advisories
              </div>

              <div className="space-y-3">
                {weather.activeAdvisories.map((adv, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                      adv.severity === 'warning'
                        ? isDark
                          ? 'bg-[#ff9800]/10 border-[#ff9800]/30'
                          : 'bg-[#fff3e0] border-[#ff9800]/40'
                        : isDark
                        ? 'bg-[#201f1f] border-[#2e2e2e]'
                        : 'bg-[#f5f3f3] border-[#becab6]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                        adv.severity === 'warning' ? 'text-[#ff9800]' : 'text-[#37ab2e]'
                      }`}
                    >
                      {adv.severity === 'warning' ? 'warning' : 'check_circle'}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs">{adv.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{adv.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

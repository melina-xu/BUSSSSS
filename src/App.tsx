/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, JourneyOption, LocationPoint, SingaporeWeather, UserAppSettings, MRTStation, BusStop } from './types';
import { Sidebar } from './components/Sidebar';
import { Header, BottomNav } from './components/Header';
import { WeatherWidget } from './components/WeatherWidget';
import { JourneyPlanner } from './components/JourneyPlanner';
import { LiveMap } from './components/LiveMap';
import { ArrivalsBoard } from './components/ArrivalsBoard';
import { SavedRoutes } from './components/SavedRoutes';
import { ServiceStatus } from './components/ServiceStatus';
import { SettingsModal, UpgradeModal, HelpModal } from './components/Modals';
import { fetchSingaporeRealtimeWeather } from './services/apiService';
import { POPULAR_LOCATIONS } from './data/singaporeTransitData';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('plan');
  const [selectedRoute, setSelectedRoute] = useState<JourneyOption | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('14:42 PM');
  
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number; zoom: number }>({
    lat: 1.3521,
    lng: 103.8198,
    zoom: 12,
  });

  const [weather, setWeather] = useState<SingaporeWeather>({
    temperature: 29,
    condition: 'Partly Cloudy',
    conditionCode: 'cloudy',
    humidity: 72,
    rainfallMm: 0.0,
    psi: 38,
    uvIndex: 4.1,
    windSpeedKmh: 14,
    regionForecasts: [
      { region: 'Central', forecast: 'Partly Cloudy', temp: 29, rainChance: 30 },
      { region: 'East', forecast: 'Passing Showers', temp: 28, rainChance: 55 },
      { region: 'West', forecast: 'Fair', temp: 30, rainChance: 20 },
      { region: 'North', forecast: 'Light Rain', temp: 27, rainChance: 65 },
      { region: 'South', forecast: 'Partly Cloudy', temp: 29, rainChance: 30 },
    ],
    hourlyForecast: [
      { time: 'Now', temp: 29, condition: 'Partly Cloudy', rainProb: 30 },
      { time: '15:00', temp: 29, condition: 'Passing Showers', rainProb: 45 },
      { time: '16:00', temp: 28, condition: 'Cloudy', rainProb: 35 },
      { time: '17:00', temp: 28, condition: 'Fair', rainProb: 15 },
      { time: '18:00', temp: 27, condition: 'Fair', rainProb: 10 },
      { time: '19:00', temp: 26, condition: 'Clear', rainProb: 5 },
    ],
    transitAdvisory: 'Optimal rail transit condition across Island. Rain shelters active at interchange hubs.',
  });

  const [settings, setSettings] = useState<UserAppSettings>(() => {
    try {
      const saved = localStorage.getItem('urban_kinetic_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      concessionType: 'Adult',
      routingPreference: 'fastest',
      shelteredWalkwaysPriority: true,
      oneMapApiKey: '',
      ltaApiKey: '',
      highContrastMap: true,
      notificationsEnabled: true,
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);

  // Live Singapore Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-SG', {
        timeZone: 'Asia/Singapore',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real-time weather on startup and every 60s
  useEffect(() => {
    const loadWeather = () => {
      fetchSingaporeRealtimeWeather().then((w) => setWeather(w));
    };
    loadWeather();
    const interval = setInterval(loadWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveSettings = (newSettings: UserAppSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('urban_kinetic_settings', JSON.stringify(newSettings));
    } catch {
      // ignore
    }
  };

  const handleSetMapFocus = (lat: number, lng: number, zoom: number = 14) => {
    const safeLat = typeof lat === 'number' && isFinite(lat) ? lat : 1.3521;
    const safeLng = typeof lng === 'number' && isFinite(lng) ? lng : 103.8198;
    const safeZoom = typeof zoom === 'number' && isFinite(zoom) ? zoom : 14;
    setMapFocus({ lat: safeLat, lng: safeLng, zoom: safeZoom });
  };

  const handleStartSavedRoute = (origin: LocationPoint, destination: LocationPoint) => {
    setActiveTab('plan');
    const oLat = origin && typeof origin.lat === 'number' && isFinite(origin.lat) ? origin.lat : 1.3546;
    const oLng = origin && typeof origin.lng === 'number' && isFinite(origin.lng) ? origin.lng : 103.9422;
    const dLat = destination && typeof destination.lat === 'number' && isFinite(destination.lat) ? destination.lat : 1.2798;
    const dLng = destination && typeof destination.lng === 'number' && isFinite(destination.lng) ? destination.lng : 103.8539;
    handleSetMapFocus((oLat + dLat) / 2, (oLng + dLng) / 2, 13);
  };

  return (
    <div className="bg-slate-100 text-slate-900 h-screen w-screen flex flex-col md:flex-row overflow-hidden font-sans select-none">
      {/* Desktop Left Sidebar (Bento styled) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'live-map') {
            handleSetMapFocus(1.3521, 103.8198, 12);
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Mobile Top App Bar */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWeather={() => setIsWeatherModalOpen(true)}
        currentTemp={weather.temperature}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 w-full h-full pt-16 md:pt-0 md:ml-[270px] flex flex-col pb-16 md:pb-0 overflow-hidden p-3 md:p-5 gap-3 md:gap-4">
        {/* Desktop Top Bento Header Bar */}
        <header className="hidden md:flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 border-2 border-slate-900 rounded-xl flex items-center justify-center bento-shadow-sm flex-shrink-0">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase italic text-slate-900">
                SG Transit Hub
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Real-Time Multi-Modal Telemetry
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            {/* Live Data Badge */}
            <div className="bg-white border-2 border-slate-900 px-3.5 py-1.5 rounded-xl bento-shadow-sm flex gap-3 items-center">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">LTA Live</span>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border border-slate-900"></span>
            </div>

            {/* Singapore Clock Badge */}
            <div className="bg-white border-2 border-slate-900 px-4 py-1.5 rounded-xl bento-shadow-sm text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Singapore SGT</p>
              <p className="text-sm font-black text-slate-900 leading-tight">{currentTime}</p>
            </div>
          </div>
        </header>

        {/* Bento Content Body: Split Left Functional Panel & Right Interactive Map */}
        <main className="flex-1 w-full h-full flex flex-col md:flex-row gap-4 overflow-hidden min-h-0">
          {/* Active Tab Functional Bento Panel (Planner, Arrivals, Saved, Alerts) */}
          <div className="w-full md:w-[410px] lg:w-[440px] h-full flex flex-col flex-shrink-0 min-h-0 overflow-hidden">
            {activeTab === 'plan' && (
              <JourneyPlanner
                onRouteSelected={(route) => setSelectedRoute(route)}
                selectedRoute={selectedRoute}
                settings={settings}
                onSetMapFocus={handleSetMapFocus}
              />
            )}

            {activeTab === 'arrivals' && (
              <ArrivalsBoard settings={settings} onSetMapFocus={handleSetMapFocus} />
            )}

            {activeTab === 'saved' && (
              <SavedRoutes onStartRoute={handleStartSavedRoute} />
            )}

            {activeTab === 'status' && (
              <ServiceStatus />
            )}

            {activeTab === 'live-map' && (
              /* If live-map is active on mobile or narrow screen, show a quick bento status card */
              <div className="hidden md:flex flex-col gap-3 h-full overflow-y-auto pr-1">
                {/* Weather Bento Card */}
                <div className="bg-amber-400 border-4 border-slate-900 rounded-3xl bento-shadow p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-amber-950 mb-1">
                        Weather (Real-time SG)
                      </p>
                      <h3 className="text-4xl font-black text-slate-900">{weather.temperature}°C</h3>
                      <p className="font-black text-amber-950 italic">{weather.condition}</p>
                    </div>
                    <div className="text-4xl">☁️</div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <span className="bg-amber-900/15 border border-amber-950/20 px-3 py-1 rounded-full text-xs font-black text-amber-950">
                      Humidity: {weather.humidity}%
                    </span>
                    <span className="bg-amber-900/15 border border-amber-950/20 px-3 py-1 rounded-full text-xs font-black text-amber-950">
                      UV Index: {weather.uvIndex}
                    </span>
                  </div>
                </div>

                {/* Rail Health Bento Card */}
                <div className="bg-indigo-600 border-4 border-slate-900 rounded-3xl bento-shadow p-5 text-white">
                  <h3 className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-3">
                    MRT Rail Health
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 p-3 rounded-2xl border-2 border-white/20">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 mb-2 border border-slate-900"></div>
                      <p className="text-xs font-bold opacity-80">EW Line</p>
                      <p className="text-sm font-black">Normal</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl border-2 border-white/20">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 mb-2 border border-slate-900"></div>
                      <p className="text-xs font-bold opacity-80">NS Line</p>
                      <p className="text-sm font-black">Normal</p>
                    </div>
                  </div>
                </div>

                {/* Rain Advisory Alert Bento Card */}
                <div className="bg-rose-500 border-4 border-slate-900 rounded-3xl bento-shadow p-5 text-white flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <h4 className="font-black text-base leading-tight">Rain & Transit Advisory</h4>
                      <p className="text-xs font-bold opacity-90">{weather.transitAdvisory}</p>
                    </div>
                  </div>
                  <div className="mt-2 py-2 px-3 bg-white/20 border border-white/30 rounded-xl text-xs font-bold">
                    Tip: Use underground MRT concourses during rainfall.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Interactive Bento Map (takes remaining width) */}
          <div className="relative flex-1 h-full w-full overflow-hidden flex flex-col min-h-0 bg-white border-4 border-slate-900 rounded-3xl bento-shadow-lg relative group">
            {/* Dot grid pattern overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none z-10 bg-bento-dots"></div>

            {/* Map Canvas */}
            <LiveMap
              weather={weather}
              selectedRoute={selectedRoute}
              mapFocus={mapFocus}
              onSelectStation={(stn: MRTStation) => {
                handleSetMapFocus(stn.lat, stn.lng, 15);
              }}
              onSelectBusStop={(stop: BusStop) => {
                handleSetMapFocus(stop.lat, stop.lng, 16);
              }}
              onSelectWeatherArea={(zone) => {
                handleSetMapFocus(zone.lat, zone.lng, 14);
              }}
            />

            {/* Floating Weather Bento Badge (Top Right of Map) */}
            <div className="absolute top-4 right-4 z-40">
              <WeatherWidget
                weather={weather}
                isOpenModal={isWeatherModalOpen}
                onCloseModal={() => setIsWeatherModalOpen(false)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'live-map') {
            handleSetMapFocus(1.3521, 103.8198, 12);
          }
        }}
      />

      {/* Application Modals with Bento Styling */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}


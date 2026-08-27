import { useState, useEffect } from 'react';
import { ThemeMode, NavTab, TransitStop, NetworkAlert } from './types';
import { INITIAL_STOPS, ACTIVE_ALERTS_DATA } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { NearbyStopsView } from './components/NearbyStopsView';
import { SavedRoutesView } from './components/SavedRoutesView';
import { AlertsView } from './components/AlertsView';
import { WeatherHubView } from './components/WeatherHubView';
import { ScheduleModal } from './components/ScheduleModal';
import { NotificationToast } from './components/NotificationToast';
import { AlternativesModal } from './components/AlternativesModal';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [activeCity, setActiveCity] = useState<string>('Singapore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stops] = useState<TransitStop[]>(INITIAL_STOPS);
  const [selectedStop, setSelectedStop] = useState<TransitStop | null>(INITIAL_STOPS[0]);

  // Modals & Toast State
  const [scheduleModalStop, setScheduleModalStop] = useState<TransitStop | null>(null);
  const [scheduleModalRoute, setScheduleModalRoute] = useState<string | undefined>(undefined);
  const [activeAlertDetail, setActiveAlertDetail] = useState<NetworkAlert | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: 'Bus 196 Arriving ✨',
    message: 'Arriving at Capitol Sakura Concourse in 2 mins 🌸',
    routeNumber: '196'
  });

  // Sync theme with document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectStop = (stop: TransitStop) => {
    setSelectedStop(stop);
  };

  const handleOpenSchedule = (stop: TransitStop) => {
    setScheduleModalStop(stop);
    setScheduleModalRoute(undefined);
  };

  const handleOpenScheduleForRoute = (routeNumber: string) => {
    setScheduleModalRoute(routeNumber);
    setScheduleModalStop(null);
  };

  const handleSimulateArrival = () => {
    setToastMessage({
      title: 'Bus 196 Arriving ✨',
      message: 'Arriving at Capitol Sakura Concourse in 2 mins 🌸',
      routeNumber: '196'
    });
    setShowToast(true);
  };

  const handleViewAdvisoryDetails = (advisoryTitle: string) => {
    const alert =
      ACTIVE_ALERTS_DATA.find((a) => a.title.includes(advisoryTitle) || advisoryTitle.includes(a.title)) ||
      ACTIVE_ALERTS_DATA[0];
    setActiveAlertDetail(alert);
  };

  const handleViewAlternatives = (alert: NetworkAlert) => {
    setActiveAlertDetail(alert);
  };

  return (
    <div
      id="urban-blossom-app"
      className={`min-h-screen w-full transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#140b15] text-[#fce7f3]' : 'bg-[#fff5f8] text-[#371329]'
      }`}
    >
      {/* Fixed Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        theme={theme}
        unreadAlertsCount={2}
      />

      {/* Fixed Top Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stops={stops}
        onSelectStop={(stop) => {
          setSelectedStop(stop);
          if (currentTab !== 'dashboard' && currentTab !== 'nearby-stops') {
            setCurrentTab('nearby-stops');
          }
        }}
        activeCity={activeCity}
        onChangeCity={setActiveCity}
        unreadCount={2}
        onOpenNotifications={() => setCurrentTab('alerts')}
      />

      {/* Main Content Area */}
      <main className="ml-72 pt-16 min-h-screen overflow-hidden">
        {currentTab === 'dashboard' && (
          <DashboardView
            theme={theme}
            activeCity={activeCity}
            stops={stops}
            selectedStop={selectedStop}
            onSelectStop={handleSelectStop}
            onViewSchedule={handleOpenSchedule}
            onViewAdvisoryDetails={handleViewAdvisoryDetails}
            onSimulateArrival={handleSimulateArrival}
          />
        )}

        {currentTab === 'nearby-stops' && (
          <NearbyStopsView
            theme={theme}
            activeCity={activeCity}
            stops={stops}
            selectedStop={selectedStop}
            onSelectStop={handleSelectStop}
            onViewSchedule={handleOpenSchedule}
          />
        )}

        {currentTab === 'saved-routes' && (
          <SavedRoutesView
            theme={theme}
            onViewScheduleForRoute={handleOpenScheduleForRoute}
            onSimulateArrival={handleSimulateArrival}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            theme={theme}
            onNavigateToWeather={() => setCurrentTab('weather-hub')}
            onViewAlternatives={handleViewAlternatives}
            onSimulateArrival={handleSimulateArrival}
          />
        )}

        {currentTab === 'weather-hub' && (
          <WeatherHubView
            theme={theme}
            activeCity={activeCity}
          />
        )}
      </main>

      {/* Schedule Timetable Modal */}
      {(scheduleModalStop || scheduleModalRoute) && (
        <ScheduleModal
          theme={theme}
          stop={scheduleModalStop}
          routeNumber={scheduleModalRoute}
          onClose={() => {
            setScheduleModalStop(null);
            setScheduleModalRoute(undefined);
          }}
        />
      )}

      {/* Disruption Alternatives Modal */}
      {activeAlertDetail && (
        <AlternativesModal
          theme={theme}
          alert={activeAlertDetail}
          onClose={() => setActiveAlertDetail(null)}
        />
      )}

      {/* Arrival Push Notification Toast Banner */}
      {showToast && (
        <NotificationToast
          theme={theme}
          title={toastMessage.title}
          message={toastMessage.message}
          routeNumber={toastMessage.routeNumber}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

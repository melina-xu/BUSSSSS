import React, { useState, useEffect } from 'react';
import { BusArrival, BusStop, MRTStation, UserAppSettings } from '../types';
import { BUS_STOPS, MRT_STATIONS, MRT_LINE_COLORS } from '../data/singaporeTransitData';
import { fetchLiveBusArrivals } from '../services/apiService';
import { 
  Clock, 
  Bus, 
  Train, 
  Search, 
  RefreshCw, 
  Users, 
  Accessibility, 
  Layers, 
  ChevronRight, 
  MapPin, 
  ArrowUpRight 
} from 'lucide-react';

interface ArrivalsBoardProps {
  settings: UserAppSettings;
  onSetMapFocus: (lat: number, lng: number, zoom?: number) => void;
}

export const ArrivalsBoard: React.FC<ArrivalsBoardProps> = ({ settings, onSetMapFocus }) => {
  const [selectedStop, setSelectedStop] = useState<BusStop>(BUS_STOPS[0]); // Tampines Ave 4
  const [arrivals, setArrivals] = useState<BusArrival[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshCountdown, setRefreshCountdown] = useState<number>(20);
  const [activeTab, setActiveTab] = useState<'bus' | 'train'>('bus');

  const loadArrivals = async (stopCode: string) => {
    setIsLoading(true);
    try {
      const data = await fetchLiveBusArrivals(stopCode);
      setArrivals(data);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArrivals(selectedStop.code);
  }, [selectedStop]);

  // Auto-refresh timer every 20s (LTA v3 standard)
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          loadArrivals(selectedStop.code);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedStop]);

  const filteredBusStops = BUS_STOPS.filter(
    (s) =>
      s.code.includes(searchQuery) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roadName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLoadBadge = (load: 'SEA' | 'SDA' | 'LSD') => {
    switch (load) {
      case 'SEA':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-emerald-400 text-slate-900 border-2 border-slate-900 flex items-center gap-1.5 bento-shadow-sm">
            <span className="w-2 h-2 rounded-full bg-slate-900" />
            Seats Available
          </span>
        );
      case 'SDA':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-amber-400 text-slate-900 border-2 border-slate-900 flex items-center gap-1.5 bento-shadow-sm">
            <span className="w-2 h-2 rounded-full bg-slate-900" />
            Standing Available
          </span>
        );
      case 'LSD':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-rose-500 text-white border-2 border-slate-900 flex items-center gap-1.5 bento-shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Crowded
          </span>
        );
    }
  };

  return (
    <div
      id="arrivals-board-panel"
      className="w-full h-full bg-white border-4 border-slate-900 rounded-3xl bento-shadow-md flex flex-col p-4 md:p-6 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-200 flex-shrink-0">
        <div>
          <h2 className="text-xl font-black uppercase italic text-slate-900 tracking-tight">Live Transport Timings</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">LTA Datamall Live Telemetry</p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-100 border-2 border-slate-900 px-3 py-1.5 rounded-xl text-xs font-black text-slate-900 bento-shadow-sm">
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{refreshCountdown}s</span>
        </div>
      </div>

      {/* Mode Switch Tabs (Bus Stops vs MRT Stations) */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border-2 border-slate-900 mb-3 flex-shrink-0">
        <button
          onClick={() => setActiveTab('bus')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all ${
            activeTab === 'bus' ? 'bg-blue-600 text-white border-slate-900 bento-shadow-sm' : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Bus className="w-4 h-4" />
          Bus Arrivals
        </button>
        <button
          onClick={() => setActiveTab('train')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-2 transition-all ${
            activeTab === 'train' ? 'bg-amber-400 text-slate-900 border-slate-900 bento-shadow-sm' : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Train className="w-4 h-4" />
          MRT Timings
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-3 flex-shrink-0">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={activeTab === 'bus' ? 'Search bus stop code or road...' : 'Search MRT station...'}
          className="w-full bg-slate-50 border-2 border-slate-900 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none bento-shadow-sm placeholder:text-slate-400 transition-colors"
        />
      </div>

      {activeTab === 'bus' ? (
        <>
          {/* Quick Select Bus Stops */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 flex-shrink-0">
            {filteredBusStops.map((stop) => (
              <button
                key={stop.code}
                onClick={() => {
                  setSelectedStop(stop);
                  onSetMapFocus(stop.lat, stop.lng, 16);
                }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all text-left ${
                  selectedStop.code === stop.code
                    ? 'bg-amber-400 border-slate-900 text-slate-900 bento-shadow-sm'
                    : 'bg-white border-slate-900 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-black">{stop.code}</span> • {stop.description.slice(0, 14)}...
              </button>
            ))}
          </div>

          {/* Current Stop Banner */}
          <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-3.5 mb-3 flex items-start justify-between bento-shadow-sm flex-shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-lg border border-slate-900">
                  {selectedStop.code}
                </span>
                <span className="text-xs font-bold text-slate-500">{selectedStop.roadName}</span>
              </div>
              <h3 className="text-sm font-black text-slate-900 mt-1">{selectedStop.description}</h3>
              <p className="text-[11px] font-bold text-slate-600 mt-0.5">
                Services: {selectedStop.services.join(', ')}
              </p>
            </div>
            <button
              onClick={() => onSetMapFocus(selectedStop.lat, selectedStop.lng, 17)}
              className="p-2 rounded-xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-amber-400 bento-shadow-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
              title="Locate on Map"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bus Arrival Cards */}
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {arrivals.map((arr) => {
              const isImminent = arr.nextBus.etaMinutes <= 1;
              return (
                <div
                  key={arr.serviceNo}
                  className="bg-white border-3 border-slate-900 rounded-2xl p-4 bento-shadow-sm hover:bento-shadow transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-blue-600 border-2 border-slate-900 text-white font-black text-base px-3.5 py-1 rounded-xl bento-shadow-sm">
                        {arr.serviceNo}
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">
                        {arr.operator}
                      </span>
                    </div>

                    {getLoadBadge(arr.nextBus.load)}
                  </div>

                  {/* Timings Row */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t-2 border-slate-100 text-center">
                    {/* Next Bus */}
                    <div className="bg-slate-50 rounded-xl p-2 border-2 border-slate-900 bento-shadow-sm">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Next</span>
                      <p
                        className={`text-xl font-black my-0.5 ${
                          isImminent ? 'text-blue-600 animate-pulse' : 'text-emerald-700'
                        }`}
                      >
                        {isImminent ? 'ARR' : `${arr.nextBus.etaMinutes}m`}
                      </p>
                      <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-slate-600">
                        <span>{arr.nextBus.type === 'DD' ? 'Double Deck' : 'Single Deck'}</span>
                        {arr.nextBus.feature === 'WAB' && (
                          <Accessibility className="w-3 h-3 text-blue-600" />
                        )}
                      </div>
                    </div>

                    {/* 2nd Bus */}
                    <div className="bg-slate-50 rounded-xl p-2 border-2 border-slate-900 bento-shadow-sm">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">2nd Bus</span>
                      <p className="text-xl font-black text-slate-900 my-0.5">
                        {arr.nextBus2 ? `${arr.nextBus2.etaMinutes}m` : '—'}
                      </p>
                      <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-slate-500">
                        <span>{arr.nextBus2?.type || '—'}</span>
                      </div>
                    </div>

                    {/* 3rd Bus */}
                    <div className="bg-slate-50 rounded-xl p-2 border-2 border-slate-900 bento-shadow-sm">
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">3rd Bus</span>
                      <p className="text-xl font-black text-slate-400 my-0.5">
                        {arr.nextBus3 ? `${arr.nextBus3.etaMinutes}m` : '—'}
                      </p>
                      <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-slate-500">
                        <span>{arr.nextBus3?.type || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* MRT Station Arrival Tracker */
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {MRT_STATIONS.map((station) => {
            const color = MRT_LINE_COLORS[station.line]?.bg || '#009640';
            return (
              <div
                key={station.code}
                onClick={() => onSetMapFocus(station.lat, station.lng, 16)}
                className="bg-white border-3 border-slate-900 rounded-2xl p-4 bento-shadow-sm hover:bento-shadow cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: color }}
                      className="text-xs font-black text-white px-2 py-0.5 rounded-lg border border-slate-900 shadow-sm"
                    >
                      {station.code}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{station.name} MRT</h4>
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg">
                    {station.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t-2 border-slate-100 text-center">
                  <div className="bg-slate-50 p-2.5 rounded-xl border-2 border-slate-900 bento-shadow-sm">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Next East / North</span>
                    <p className="text-lg font-black text-emerald-700 mt-0.5">
                      {station.nextTrainEastbound || 2} MIN
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border-2 border-slate-900 bento-shadow-sm">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Next West / South</span>
                    <p className="text-lg font-black text-emerald-700 mt-0.5">
                      {station.nextTrainWestbound || 3} MIN
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

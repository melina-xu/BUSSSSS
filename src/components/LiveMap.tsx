import React, { useEffect, useRef, useState } from 'react';
import { JourneyOption, MRTStation, BusStop, SingaporeWeather, WeatherAreaZone } from '../types';
import { MRT_STATIONS, BUS_STOPS, MRT_LINE_COLORS, DEFAULT_WEATHER_ZONES } from '../data/singaporeTransitData';
import { 
  Layers, 
  Train, 
  Bus, 
  CloudRain, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Radio, 
  Sparkles,
  Sun,
  CloudLightning,
  CloudSun,
  Eye,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Compass
} from 'lucide-react';
import L from 'leaflet';

interface LiveMapProps {
  weather?: SingaporeWeather;
  selectedRoute: JourneyOption | null;
  mapFocus: { lat: number; lng: number; zoom: number };
  onSelectStation?: (station: MRTStation) => void;
  onSelectBusStop?: (busStop: BusStop) => void;
  onSelectWeatherArea?: (zone: WeatherAreaZone) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  weather,
  selectedRoute,
  mapFocus,
  onSelectStation,
  onSelectBusStop,
  onSelectWeatherArea,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const transitLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const vehicleLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const weatherLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [showMrt, setShowMrt] = useState(true);
  const [showBuses, setShowBuses] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showWeatherRadar, setShowWeatherRadar] = useState(true);
  const [showWeatherEffects, setShowWeatherEffects] = useState(true);
  const [showWeatherBadges, setShowWeatherBadges] = useState(true);
  const [selectedZone, setSelectedZone] = useState<WeatherAreaZone | null>(null);

  const zonesToDisplay: WeatherAreaZone[] = (weather?.areaZones && weather.areaZones.length > 0) 
    ? weather.areaZones 
    : DEFAULT_WEATHER_ZONES;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const safeLat = mapFocus && typeof mapFocus.lat === 'number' && isFinite(mapFocus.lat) ? mapFocus.lat : 1.3521;
    const safeLng = mapFocus && typeof mapFocus.lng === 'number' && isFinite(mapFocus.lng) ? mapFocus.lng : 103.8198;
    const safeZoom = mapFocus && typeof mapFocus.zoom === 'number' && isFinite(mapFocus.zoom) ? mapFocus.zoom : 12;

    const map = L.map(mapContainerRef.current, {
      center: [safeLat, safeLng],
      zoom: safeZoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Clean CartoDB Basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OneMap SG / LTA Datamall / NEA Singapore',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    weatherLayerGroupRef.current = L.layerGroup().addTo(map);
    transitLayerGroupRef.current = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = L.layerGroup().addTo(map);
    vehicleLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when focus changes
  useEffect(() => {
    if (mapInstanceRef.current && mapFocus) {
      const safeLat = typeof mapFocus.lat === 'number' && isFinite(mapFocus.lat) ? mapFocus.lat : 1.3521;
      const safeLng = typeof mapFocus.lng === 'number' && isFinite(mapFocus.lng) ? mapFocus.lng : 103.8198;
      const safeZoom = typeof mapFocus.zoom === 'number' && isFinite(mapFocus.zoom) ? mapFocus.zoom : 14;

      try {
        mapInstanceRef.current.flyTo([safeLat, safeLng], safeZoom, {
          duration: 1.2,
        });
      } catch {
        // Safe guard
      }
    }
  }, [mapFocus]);

  // Render Live Weather Animations & Regional Area Overlays
  useEffect(() => {
    if (!mapInstanceRef.current || !weatherLayerGroupRef.current) return;

    weatherLayerGroupRef.current.clearLayers();

    if (!showWeatherRadar) return;

    zonesToDisplay.forEach((zone) => {
      if (typeof zone.lat !== 'number' || !isFinite(zone.lat) || typeof zone.lng !== 'number' || !isFinite(zone.lng)) {
        return;
      }

      const isRain = zone.conditionCode === 'rain';
      const isStorm = zone.conditionCode === 'thunderstorm';
      const isCloudy = zone.conditionCode === 'cloudy';
      const isClear = zone.conditionCode === 'clear';
      const isHazy = zone.conditionCode === 'hazy';

      // 1. Regional Weather Animated Aura / Atmosphere Layer
      if (showWeatherEffects) {
        let auraColor = 'rgba(59, 130, 246, 0.18)';
        let innerHtml = '';

        if (isRain) {
          auraColor = 'rgba(59, 130, 246, 0.22)';
          innerHtml = `
            <div style="position: relative; width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, ${auraColor} 0%, rgba(96, 165, 250, 0.08) 60%, transparent 80%); pointer-events: none; overflow: hidden;">
              <!-- Falling Rain Drops -->
              <div class="weather-rain-streak" style="top: 8px; left: 24px; animation-delay: 0.1s;"></div>
              <div class="weather-rain-streak" style="top: 18px; left: 48px; animation-delay: 0.4s;"></div>
              <div class="weather-rain-streak" style="top: 10px; left: 72px; animation-delay: 0.7s;"></div>
              <div class="weather-rain-streak" style="top: 24px; left: 96px; animation-delay: 0.25s;"></div>
              <div class="weather-rain-streak" style="top: 14px; left: 118px; animation-delay: 0.55s;"></div>
              <div class="weather-rain-streak" style="top: 30px; left: 36px; animation-delay: 0.85s;"></div>
              
              <!-- Ground Water Ripples -->
              <div class="weather-rain-ripple" style="width: 44px; height: 22px; bottom: 18px; left: 28px; animation-delay: 0.2s;"></div>
              <div class="weather-rain-ripple" style="width: 36px; height: 18px; bottom: 26px; left: 74px; animation-delay: 0.9s;"></div>
              <div class="weather-radar-wave" style="position: absolute; inset: 15px; border-radius: 50%; border: 1.5px solid rgba(59, 130, 246, 0.45);"></div>
            </div>
          `;
        } else if (isStorm) {
          auraColor = 'rgba(49, 46, 129, 0.32)';
          innerHtml = `
            <div style="position: relative; width: 150px; height: 150px; border-radius: 50%; background: radial-gradient(circle, ${auraColor} 0%, rgba(99, 102, 241, 0.12) 65%, transparent 85%); pointer-events: none; overflow: hidden;">
              <!-- Heavy Rain & Flash -->
              <div class="weather-lightning-flash" style="position: absolute; inset: 0; background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(199, 210, 254, 0.6) 40%, transparent 70%);"></div>
              <div class="weather-rain-streak" style="height: 16px; top: 5px; left: 30px; animation-delay: 0.05s; background: linear-gradient(to bottom, transparent, #2563eb);"></div>
              <div class="weather-rain-streak" style="height: 16px; top: 12px; left: 60px; animation-delay: 0.3s; background: linear-gradient(to bottom, transparent, #2563eb);"></div>
              <div class="weather-rain-streak" style="height: 16px; top: 8px; left: 90px; animation-delay: 0.6s; background: linear-gradient(to bottom, transparent, #2563eb);"></div>
              <div class="weather-rain-streak" style="height: 16px; top: 20px; left: 115px; animation-delay: 0.2s; background: linear-gradient(to bottom, transparent, #2563eb);"></div>
              <div class="weather-rain-ripple" style="width: 50px; height: 25px; bottom: 15px; left: 45px;"></div>
              <div class="weather-radar-wave" style="position: absolute; inset: 10px; border-radius: 50%; border: 2px solid rgba(239, 68, 68, 0.5);"></div>
            </div>
          `;
        } else if (isClear) {
          auraColor = 'rgba(251, 191, 36, 0.26)';
          innerHtml = `
            <div style="position: relative; width: 130px; height: 130px; border-radius: 50%; background: radial-gradient(circle, ${auraColor} 0%, rgba(245, 158, 11, 0.08) 60%, transparent 80%); pointer-events: none; display: flex; align-items: center; justify-content: center;">
              <!-- Spinning Sun Corona Rays -->
              <div class="weather-sun-rays" style="position: absolute; width: 85px; height: 85px; border-radius: 50%; border: 2px dashed rgba(245, 158, 11, 0.65);"></div>
              <div class="weather-sun-glow" style="width: 42px; height: 42px; border-radius: 50%; background: radial-gradient(circle, #fde047 0%, #f59e0b 80%); box-shadow: 0 0 18px #f59e0b;"></div>
            </div>
          `;
        } else if (isHazy) {
          auraColor = 'rgba(217, 119, 6, 0.16)';
          innerHtml = `
            <div style="position: relative; width: 130px; height: 130px; border-radius: 50%; background: radial-gradient(circle, ${auraColor} 0%, rgba(202, 138, 4, 0.05) 60%, transparent 80%); pointer-events: none; overflow: hidden;">
              <div class="weather-mist-wave" style="position: absolute; inset: 20px; border-radius: 9999px; background: rgba(245, 158, 11, 0.2); filter: blur(4px);"></div>
            </div>
          `;
        } else {
          // Cloudy / Partly Cloudy
          auraColor = 'rgba(148, 163, 184, 0.22)';
          innerHtml = `
            <div style="position: relative; width: 130px; height: 130px; border-radius: 50%; background: radial-gradient(circle, ${auraColor} 0%, rgba(203, 213, 225, 0.08) 60%, transparent 80%); pointer-events: none; display: flex; align-items: center; justify-content: center;">
              <!-- Drifting Cumulus Cloud Layer -->
              <div class="weather-cloud-drift" style="width: 65px; height: 35px; background: #e2e8f0; border-radius: 20px; box-shadow: 0 6px 14px rgba(100, 116, 139, 0.35); position: relative; opacity: 0.85;">
                <div style="position: absolute; width: 28px; height: 28px; background: #e2e8f0; border-radius: 50%; top: -14px; left: 12px;"></div>
                <div style="position: absolute; width: 34px; height: 34px; background: #e2e8f0; border-radius: 50%; top: -18px; left: 26px;"></div>
              </div>
            </div>
          `;
        }

        const effectIcon = L.divIcon({
          className: 'custom-weather-effect-layer',
          html: innerHtml,
          iconSize: [140, 140],
          iconAnchor: [70, 70],
        });

        L.marker([zone.lat, zone.lng], { 
          icon: effectIcon, 
          zIndexOffset: -50,
          interactive: false 
        }).addTo(weatherLayerGroupRef.current!);
      }

      // 2. Interactive Floating Regional Weather Badge Capsule
      if (showWeatherBadges) {
        let badgeBg = '#ffffff';
        let badgeBorder = '#0f172a';
        let iconEmoji = '⛅';
        let badgeText = 'Partly Cloudy';
        let accentColor = '#3b82f6';

        if (isRain) {
          iconEmoji = '🌧️';
          badgeText = `${zone.rainChance}% Rain`;
          accentColor = '#2563eb';
        } else if (isStorm) {
          iconEmoji = '⛈️';
          badgeText = `Storm ${zone.rainChance}%`;
          accentColor = '#dc2626';
        } else if (isClear) {
          iconEmoji = '☀️';
          badgeText = `Fair (${zone.temp}°C)`;
          accentColor = '#d97706';
        } else if (isHazy) {
          iconEmoji = '🌫️';
          badgeText = 'Haze / Moderate';
          accentColor = '#b45309';
        } else {
          iconEmoji = '⛅';
          badgeText = `${zone.rainChance}% Rain`;
          accentColor = '#475569';
        }

        const badgeHtml = `
          <div class="group cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95" style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: ${badgeBg};
            border: 2px solid ${badgeBorder};
            border-radius: 12px;
            padding: 3px 8px;
            box-shadow: 2px 3px 0px #0f172a;
            white-space: nowrap;
          ">
            <span style="font-size: 13px; line-height: 1;">${iconEmoji}</span>
            <div style="display: flex; flex-direction: column; line-height: 1.1;">
              <span style="font-size: 9px; font-weight: 900; color: #64748b; letter-spacing: 0.05em; text-transform: uppercase;">
                ${zone.region} • ${zone.townName.split('&')[0].trim()}
              </span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 11px; font-weight: 900; color: #0f172a;">${zone.temp}°C</span>
                <span style="font-size: 9px; font-weight: 700; color: ${accentColor}; background: rgba(0,0,0,0.04); padding: 1px 4px; border-radius: 4px;">
                  ${badgeText}
                </span>
              </div>
            </div>
          </div>
        `;

        const badgeIcon = L.divIcon({
          className: 'custom-weather-badge-pin',
          html: badgeHtml,
          iconSize: [110, 36],
          iconAnchor: [55, 18],
        });

        const badgeMarker = L.marker([zone.lat, zone.lng], {
          icon: badgeIcon,
          zIndexOffset: 150,
        });

        // Rich Telemetry Popup
        const popupContent = `
          <div style="padding: 6px; font-family: Plus Jakarta Sans, Inter, sans-serif; min-width: 210px; color: #0f172a;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 18px;">${iconEmoji}</span>
                <div>
                  <h4 style="font-size: 13px; font-weight: 900; margin: 0; color: #0f172a; line-height: 1.2;">
                    ${zone.townName}
                  </h4>
                  <span style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">
                    ${zone.region} Sector Forecast
                  </span>
                </div>
              </div>
              <span style="font-size: 16px; font-weight: 900; color: #0f172a;">
                ${zone.temp}°C
              </span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px 6px;">
                <span style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; display: block;">Rain Chance</span>
                <span style="font-size: 12px; font-weight: 900; color: ${accentColor};">${zone.rainChance}%</span>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px 6px;">
                <span style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; display: block;">Precipitation</span>
                <span style="font-size: 12px; font-weight: 900; color: #0f172a;">${zone.rainfallMm.toFixed(1)} mm</span>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px 6px;">
                <span style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; display: block;">Humidity</span>
                <span style="font-size: 12px; font-weight: 900; color: #0f172a;">${zone.humidity}%</span>
              </div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px 6px;">
                <span style="font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase; display: block;">Wind</span>
                <span style="font-size: 12px; font-weight: 900; color: #0f172a;">${zone.windSpeedKmh} km/h</span>
              </div>
            </div>

            ${zone.advisory ? `
              <div style="background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 4px; padding: 4px 8px; margin-bottom: 8px;">
                <p style="font-size: 10px; color: #1e40af; font-weight: 600; margin: 0; line-height: 1.3;">
                  💡 ${zone.advisory}
                </p>
              </div>
            ` : ''}

            <div style="text-align: right;">
              <span style="font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">
                Live NEA Radar Stream
              </span>
            </div>
          </div>
        `;

        badgeMarker.bindPopup(popupContent);

        badgeMarker.on('click', () => {
          setSelectedZone(zone);
          if (onSelectWeatherArea) onSelectWeatherArea(zone);
        });

        badgeMarker.addTo(weatherLayerGroupRef.current!);
      }
    });
  }, [zonesToDisplay, showWeatherRadar, showWeatherEffects, showWeatherBadges]);

  // Render Static MRT Lines & Station Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !transitLayerGroupRef.current) return;

    transitLayerGroupRef.current.clearLayers();

    if (showMrt) {
      // Draw MRT Lines as glowing neon polylines
      const lines: { name: string; color: string; stations: MRTStation[] }[] = [
        {
          name: 'East-West Line',
          color: '#009640',
          stations: MRT_STATIONS.filter((s) => s.line === 'EWL'),
        },
        {
          name: 'North-South Line',
          color: '#d42e12',
          stations: MRT_STATIONS.filter((s) => s.line === 'NSL'),
        },
        {
          name: 'Downtown Line',
          color: '#005ec4',
          stations: MRT_STATIONS.filter((s) => s.line === 'DTL'),
        },
        {
          name: 'North-East Line',
          color: '#9016b2',
          stations: MRT_STATIONS.filter((s) => s.line === 'NEL'),
        },
      ];

      lines.forEach((line) => {
        const sorted = [...line.stations]
          .filter((s) => typeof s.lat === 'number' && isFinite(s.lat) && typeof s.lng === 'number' && isFinite(s.lng))
          .sort((a, b) => a.lng - b.lng);
        const latlngs: [number, number][] = sorted.map((s) => [s.lat, s.lng]);

        if (latlngs.length >= 2) {
          // Base glow line
          L.polyline(latlngs, {
            color: line.color,
            weight: 7,
            opacity: 0.35,
            lineCap: 'round',
          }).addTo(transitLayerGroupRef.current!);

          // Core sharp line
          L.polyline(latlngs, {
            color: line.color,
            weight: 3.5,
            opacity: 0.9,
            lineCap: 'round',
          }).addTo(transitLayerGroupRef.current!);
        }
      });

      // Draw Stations
      MRT_STATIONS.forEach((station) => {
        if (typeof station.lat !== 'number' || !isFinite(station.lat) || typeof station.lng !== 'number' || !isFinite(station.lng)) {
          return;
        }

        const color = MRT_LINE_COLORS[station.line]?.bg || '#009640';
        const isInterchange = (station.interchanges && station.interchanges.length > 0);

        const customIcon = L.divIcon({
          className: 'custom-mrt-pin',
          html: `
            <div style="
              width: ${isInterchange ? '16px' : '12px'};
              height: ${isInterchange ? '16px' : '12px'};
              border-radius: 50%;
              background-color: ${color};
              border: 2px solid #ffffff;
              box-shadow: 0 0 8px ${color};
              cursor: pointer;
            "></div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([station.lat, station.lng], { icon: customIcon });
        
        marker.bindPopup(`
          <div style="padding: 4px; font-family: Plus Jakarta Sans, Inter, sans-serif;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 800; background-color: ${color}; color: #fff; padding: 2px 6px; border-radius: 4px;">
                ${station.code}
              </span>
              <span style="font-size: 10px; color: #37ab2e; font-weight: 700; text-transform: uppercase;">
                ${station.status}
              </span>
            </div>
            <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">
              ${station.name} MRT
            </h4>
            <div style="font-size: 12px; color: #475569; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
              <div>Next Eastbound: <strong style="color: #16a34a;">${station.nextTrainEastbound || 2}m</strong></div>
              <div>Next Westbound: <strong style="color: #16a34a;">${station.nextTrainWestbound || 3}m</strong></div>
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectStation) onSelectStation(station);
        });

        marker.addTo(transitLayerGroupRef.current!);
      });
    }

    // Draw Bus Stops
    if (showBuses) {
      BUS_STOPS.forEach((stop) => {
        if (typeof stop.lat !== 'number' || !isFinite(stop.lat) || typeof stop.lng !== 'number' || !isFinite(stop.lng)) {
          return;
        }

        const busIcon = L.divIcon({
          className: 'custom-bus-pin',
          html: `
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 2px;
              background-color: #16a34a;
              border: 1.5px solid #0f172a;
              box-shadow: 0 0 6px rgba(22, 163, 74, 0.7);
              cursor: pointer;
            "></div>
          `,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });

        const marker = L.marker([stop.lat, stop.lng], { icon: busIcon });
        marker.bindPopup(`
          <div style="padding: 4px; font-family: Plus Jakarta Sans, Inter, sans-serif;">
            <span style="font-size: 10px; font-weight: 800; background-color: #16a34a; color: #ffffff; padding: 2px 5px; border-radius: 3px;">
              BUS STOP ${stop.code}
            </span>
            <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 4px 0 2px 0;">
              ${stop.description}
            </h4>
            <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;">${stop.roadName}</p>
            <div style="font-size: 11px; color: #2563eb; font-weight: 700;">
              Services: ${stop.services.join(', ')}
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectBusStop) onSelectBusStop(stop);
        });

        marker.addTo(transitLayerGroupRef.current!);
      });
    }
  }, [showMrt, showBuses]);

  // Render Live Moving Vehicles Animation
  useEffect(() => {
    if (!mapInstanceRef.current || !vehicleLayerGroupRef.current || !showVehicles) {
      if (vehicleLayerGroupRef.current) vehicleLayerGroupRef.current.clearLayers();
      return;
    }

    vehicleLayerGroupRef.current.clearLayers();

    // Moving trains simulation along EWL & DTL
    const train1 = L.marker([1.335, 103.92], {
      icon: L.divIcon({
        className: 'vehicle-train-pulse',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: #009640;
            border: 2px solid #ffffff;
            box-shadow: 0 0 12px #6cdf5c;
            color: #ffffff;
            font-size: 10px;
            font-weight: 900;
          ">
            🚇
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    }).addTo(vehicleLayerGroupRef.current);

    const bus1 = L.marker([1.356, 103.935], {
      icon: L.divIcon({
        className: 'vehicle-bus-pulse',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            background-color: #3394f1;
            border: 1.5px solid #ffffff;
            box-shadow: 0 0 10px #3394f1;
            color: #ffffff;
            font-size: 9px;
            font-weight: 900;
          ">
            65
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    }).addTo(vehicleLayerGroupRef.current);

    const interval = setInterval(() => {
      if (train1 && bus1) {
        try {
          const tPos = train1.getLatLng();
          if (tPos && typeof tPos.lat === 'number' && isFinite(tPos.lat) && typeof tPos.lng === 'number' && isFinite(tPos.lng)) {
            train1.setLatLng([tPos.lat - 0.0001, tPos.lng - 0.0001]);
          }
        } catch {
          // safe catch
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [showVehicles]);

  // Render Selected Active Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerGroupRef.current) return;

    routeLayerGroupRef.current.clearLayers();

    if (selectedRoute && Array.isArray(selectedRoute.legs)) {
      selectedRoute.legs.forEach((leg) => {
        if (leg && Array.isArray(leg.coordinates) && leg.coordinates.length > 0) {
          const validCoords: [number, number][] = leg.coordinates.filter(
            (c): c is [number, number] => Array.isArray(c) && c.length >= 2 && typeof c[0] === 'number' && isFinite(c[0]) && typeof c[1] === 'number' && isFinite(c[1])
          );

          if (validCoords.length < 2) return;

          const color =
            leg.mode === 'MRT'
              ? leg.lineColor || '#005ec4'
              : leg.mode === 'BUS'
              ? '#16a34a'
              : '#3b82f6';

          try {
            // Glow backdrop
            L.polyline(validCoords, {
              color: color,
              weight: 8,
              opacity: 0.4,
              dashArray: leg.mode === 'WALK' ? '4, 8' : undefined,
            }).addTo(routeLayerGroupRef.current!);

            // Foreground path
            L.polyline(validCoords, {
              color: color,
              weight: 4,
              opacity: 1,
              dashArray: leg.mode === 'WALK' ? '6, 6' : undefined,
            }).addTo(routeLayerGroupRef.current!);
          } catch {
            // Safe catch
          }
        }
      });
    }
  }, [selectedRoute]);

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
    }
  };

  const handleResetSingaporeView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([1.3521, 103.8198], 12);
    }
  };

  const handleFlyToZone = (zone: WeatherAreaZone) => {
    if (mapInstanceRef.current && zone && typeof zone.lat === 'number' && typeof zone.lng === 'number') {
      mapInstanceRef.current.flyTo([zone.lat, zone.lng], 13.5, { duration: 1.2 });
      setSelectedZone(zone);
    }
  };

  return (
    <div id="live-map-container" className="relative w-full h-full flex-1 bg-slate-100 border-4 border-slate-900 rounded-3xl bento-shadow-md overflow-hidden select-none">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Floating Regional Weather Quick Navigator Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 pointer-events-none flex justify-center">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border-3 border-slate-900 rounded-2xl px-3 py-1.5 bento-shadow-md flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none text-xs font-bold">
          <div className="flex items-center gap-1 text-slate-800 pr-2 border-r-2 border-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            <span className="font-black text-[11px] uppercase tracking-wider text-slate-900 hidden sm:inline">SG Weather:</span>
          </div>

          <button
            onClick={handleResetSingaporeView}
            className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-900 text-slate-800 hover:bg-amber-300 transition-colors whitespace-nowrap text-[11px] font-black"
          >
            🌐 All SG
          </button>

          {zonesToDisplay.map((zone) => {
            const isRain = zone.conditionCode === 'rain' || zone.conditionCode === 'thunderstorm';
            return (
              <button
                key={zone.id}
                onClick={() => handleFlyToZone(zone)}
                className={`px-2 py-1 rounded-xl border border-slate-900 transition-all whitespace-nowrap text-[11px] font-black flex items-center gap-1 ${
                  isRain 
                    ? 'bg-blue-100 text-blue-900 hover:bg-blue-200' 
                    : 'bg-amber-50 text-slate-800 hover:bg-amber-200'
                }`}
                title={`Jump to ${zone.name}: ${zone.condition}, ${zone.temp}°C`}
              >
                <span>{zone.conditionCode === 'rain' ? '🌧️' : zone.conditionCode === 'thunderstorm' ? '⛈️' : zone.conditionCode === 'clear' ? '☀️' : '⛅'}</span>
                <span>{zone.region}: {zone.temp}°</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Transit & Weather Layer Controls (Top Left) */}
      <div className="absolute top-16 left-4 z-30 flex flex-col gap-2 pointer-events-auto max-w-[210px]">
        <div className="bg-white border-3 border-slate-900 rounded-2xl p-2.5 bento-shadow-md flex flex-col gap-1.5 text-xs text-slate-900">
          <div className="flex items-center gap-2 px-2 py-1 text-[10px] font-black text-slate-500 uppercase tracking-wider border-b-2 border-slate-100">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Map Overlays
          </div>
          
          {/* Weather Toggle */}
          <button
            onClick={() => setShowWeatherRadar(!showWeatherRadar)}
            className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left transition-all border-2 ${
              showWeatherRadar ? 'bg-blue-100 border-slate-900 font-black text-slate-900 bento-shadow-sm' : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <CloudRain className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              Live Area Weather
            </span>
            <span className={`w-2.5 h-2.5 rounded-full border border-slate-900 shrink-0 ${showWeatherRadar ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
          </button>

          {showWeatherRadar && (
            <div className="flex flex-col gap-1 pl-2 pr-1 py-1 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="flex items-center justify-between text-[11px] font-bold text-slate-700 cursor-pointer">
                <span>✨ Rain & Sun FX</span>
                <input
                  type="checkbox"
                  checked={showWeatherEffects}
                  onChange={(e) => setShowWeatherEffects(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between text-[11px] font-bold text-slate-700 cursor-pointer">
                <span>🏷️ Area Badges</span>
                <input
                  type="checkbox"
                  checked={showWeatherBadges}
                  onChange={(e) => setShowWeatherBadges(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          )}

          {/* MRT Toggle */}
          <button
            onClick={() => setShowMrt(!showMrt)}
            className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left transition-all border-2 ${
              showMrt ? 'bg-amber-100 border-slate-900 font-black text-slate-900 bento-shadow-sm' : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <Train className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              MRT Lines
            </span>
            <span className={`w-2.5 h-2.5 rounded-full border border-slate-900 shrink-0 ${showMrt ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          </button>

          {/* Bus Toggle */}
          <button
            onClick={() => setShowBuses(!showBuses)}
            className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left transition-all border-2 ${
              showBuses ? 'bg-amber-100 border-slate-900 font-black text-slate-900 bento-shadow-sm' : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <Bus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              Bus Network
            </span>
            <span className={`w-2.5 h-2.5 rounded-full border border-slate-900 shrink-0 ${showBuses ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          </button>

          {/* Moving Vehicles */}
          <button
            onClick={() => setShowVehicles(!showVehicles)}
            className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl text-left transition-all border-2 ${
              showVehicles ? 'bg-amber-100 border-slate-900 font-black text-slate-900 bento-shadow-sm' : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-1.5 truncate">
              <Radio className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              Live Vehicles
            </span>
            <span className={`w-2.5 h-2.5 rounded-full border border-slate-900 shrink-0 ${showVehicles ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
          </button>
        </div>
      </div>

      {/* Floating Zoom & Reset Buttons (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-30 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => handleZoom(1)}
          className="w-10 h-10 rounded-xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-amber-400 bento-shadow-sm flex items-center justify-center transition-all active:translate-x-0.5 active:translate-y-0.5"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom(-1)}
          className="w-10 h-10 rounded-xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-amber-400 bento-shadow-sm flex items-center justify-center transition-all active:translate-x-0.5 active:translate-y-0.5"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleResetSingaporeView}
          className="w-10 h-10 rounded-xl bg-white border-2 border-slate-900 text-slate-900 hover:bg-amber-400 bento-shadow-sm flex items-center justify-center transition-all active:translate-x-0.5 active:translate-y-0.5"
          title="Reset Singapore Island View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time Telemetry Pill (Bottom Left) */}
      <div className="hidden md:flex absolute bottom-6 left-6 z-30 pointer-events-auto bg-white border-2 border-slate-900 rounded-2xl px-4 py-2 items-center gap-3 bento-shadow-sm text-xs text-slate-700">
        <div className="flex items-center gap-1.5 text-slate-900 font-black">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900 animate-pulse" />
          <span>LTA & WEATHER RADAR LIVE</span>
        </div>
        <span className="text-slate-300 font-bold">|</span>
        <span className="font-bold">Lat: {(typeof mapFocus?.lat === 'number' && isFinite(mapFocus.lat) ? mapFocus.lat : 1.352).toFixed(3)}°N</span>
        <span className="font-bold">Lng: {(typeof mapFocus?.lng === 'number' && isFinite(mapFocus.lng) ? mapFocus.lng : 103.820).toFixed(3)}°E</span>
      </div>
    </div>
  );
};

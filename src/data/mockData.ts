import {
  TransitStop,
  SavedRoute,
  NetworkAlert,
  AlertNotificationSetting,
  WeatherData,
  StopScheduleEntry,
  LocationItem,
  RouteOption,
  TravelMode,
  NavigationStep
} from '../types';

export const MAP_IMAGES = {
  calgaryLight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW8AtpWs64JaAVdeLT-21YACEfDMnWOZlhqsMmpYNM-v6TbJjCB_TXhUF1YfbByPaJ4xn-dpuzcUV19KzgqJZ8ZmDpOav_Lpfip9uuchJwzds7nLiFwK3SMRB2mmdP-fZidjxRilO53b9kybkRqQcW-Tjn0J2CjLo7Ww_FBN0Q4qfxOcqwnVM6Amlu-2nzw9D4NfCiYj0QXDw7UdrMchacPzjAi7UmCrqnTSAtzLNnJ4WMTKENJ4L8Hg',
  singaporeLight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq5r44dgmpggLgUvXCH3hAWpTcAClasqpsev8vxoXwNz_5SOH0O0H50HKoFQIgWxWCpxs3oKpcivLByBYD18k6HxvypX6mm9P4pEebQNh1I96B2kMhwZW1xQ6FrNzhxsRitBi8BjS7wHAqRWHGg82Yfum7FnbHBwGww4c1VIlKLxYqWTFDkNu2oxBjzIxKHDG_VNvCyVcSS5wfl53G2c10yl0uZdnTT0tIPoRS60VRb9Ju3wDzeJRMwg',
  singaporeNight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz9oocrgEKTWzix0dILqNnfRQUIrrYxj1r8oCscvHzmX59EGb4Ao6SqvtflJqBr9wzHOMuaRXgm04nSCHq8E4FhCUj2y1fhH6Pn5MHVw48RZuGwvnuMRqEjuM4etOxsgRlR0D4bOp1__brXUfMrY_Ng2DTGynZj7IEkoTUOGjGauaZlghMqCaypjN9BgLDw5LhN_UxzghQhaDO9sdy_ih88cHnn_IKk_u1x4hnGeCBW1GsFMXiZ4yeQ',
  nycRadarNight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWsSSrhmsBpxagHqiiigN39_DdfguVB5Nhkdf9ickY7BGegefPVPneaG4zWz1OhojvTIA3cRVjTrWNeUuSXlAud3udN2fQxMdIwNLCGg7yJLL7XeevXf0r8ex274auW1fGgmFzu05CujqATHIkwugRb_Ser0cNYTJADzi_cKYM866uxmqk5DFRoyQ_z9Y1d9HI9bXbiRwH4Aowl7UhB2ud55anOPbvxNHp1H5M4DRJWHdfl1Prg2h_mQ'
};

export const INITIAL_STOPS: TransitStop[] = [
  {
    id: 'stop-marina-bay-financial',
    name: 'Marina Bay Financial Concourse',
    code: 'MBFC-01',
    walkTimeMins: 2,
    distanceDisplay: '2 min • Node ID: MBFC-01',
    temp: '28°',
    weatherIcon: 'cloudy',
    coordinates: { x: 48, y: 35 },
    totalActiveRoutes: 3,
    description: 'Tier-1 High-Frequency Transit Interchange & Downtown Fintech Hub.',
    starred: true,
    nodalThroughput: '14,200 pax/hr',
    reliabilityScore: 99.8,
    routes: [
      {
        routeNumber: '196X',
        routeName: 'Wall St / Marina Express',
        primaryTime: 'Now',
        secondaryTimes: ['3m', '9m'],
        status: 'arriving',
        statusText: 'ALPHA LEAD',
        occupancy: 'seats-available',
        colorType: 'primary',
        live: true,
        loadFactorPct: 42,
        vehicleTelemetryId: 'GS-QUANTUM-88',
        speedKmh: 48.5
      },
      {
        routeNumber: '10E',
        routeName: 'Shenton Way Direct',
        primaryTime: '4m',
        secondaryTimes: ['12m', '20m'],
        status: 'on-time',
        statusText: 'OPTIMAL',
        occupancy: 'moderate',
        colorType: 'primary',
        loadFactorPct: 68,
        vehicleTelemetryId: 'TEL-METRO-04',
        speedKmh: 36.2
      },
      {
        routeNumber: '857',
        routeName: 'Silicon Corridor Arterial',
        primaryTime: '8m',
        secondaryTimes: ['18m', '31m'],
        status: 'delayed',
        statusText: '+1.5m DELTA',
        occupancy: 'standing',
        colorType: 'delayed',
        loadFactorPct: 89,
        vehicleTelemetryId: 'AI-AUTON-19',
        speedKmh: 24.1
      }
    ]
  },
  {
    id: 'stop-orchard-mrt',
    name: 'Orchard Global Interchange',
    code: 'NS22-TE14',
    walkTimeMins: 3,
    distanceDisplay: '3 min • Node ID: NS22',
    temp: '29°',
    weatherIcon: 'thunderstorm',
    coordinates: { x: 55, y: 44 },
    totalActiveRoutes: 2,
    description: 'Subterranean dual-line high speed interchange with real-time crowd vector balancing.',
    starred: true,
    nodalThroughput: '28,400 pax/hr',
    reliabilityScore: 99.4,
    routes: [
      {
        routeNumber: 'NS-LINE',
        routeName: 'North-South High Speed Rail',
        primaryTime: '1m',
        secondaryTimes: ['3m', '6m'],
        status: 'arriving',
        statusText: 'P99 ON-TIME',
        occupancy: 'seats-available',
        colorType: 'primary',
        live: true,
        loadFactorPct: 54,
        vehicleTelemetryId: 'HSR-TRAIN-09',
        speedKmh: 75.0
      },
      {
        routeNumber: '14',
        routeName: 'Raffles Quay Shuttles',
        primaryTime: '5m',
        secondaryTimes: ['14m', '26m'],
        status: 'on-time',
        statusText: 'SYNCHRONIZED',
        occupancy: 'standing',
        colorType: 'secondary',
        loadFactorPct: 78,
        vehicleTelemetryId: 'EV-FLEET-302',
        speedKmh: 38.0
      }
    ]
  },
  {
    id: 'stop-sandhill-venture',
    name: 'Silicon Hub / Sand Hill Terminal',
    code: 'SHV-99',
    walkTimeMins: 5,
    distanceDisplay: '5 min • Node ID: SHV-99',
    temp: '21°',
    weatherIcon: 'wb_sunny',
    coordinates: { x: 38, y: 52 },
    totalActiveRoutes: 2,
    description: 'Venture & DeepTech Arterial with autonomous point-to-point EV micro-links.',
    starred: false,
    nodalThroughput: '8,900 pax/hr',
    reliabilityScore: 99.9,
    routes: [
      {
        routeNumber: 'AI-101',
        routeName: 'Autonomous Fast-Track',
        primaryTime: 'Now',
        secondaryTimes: ['2m', '5m'],
        status: 'arriving',
        statusText: 'ZERO LATENCY',
        occupancy: 'seats-available',
        colorType: 'primary',
        live: true,
        loadFactorPct: 35,
        vehicleTelemetryId: 'WAYMO-POD-44',
        speedKmh: 52.0
      },
      {
        routeNumber: '700X',
        routeName: 'Executive Palo Alto Line',
        primaryTime: '9m',
        secondaryTimes: ['24m', '39m'],
        status: 'on-time',
        statusText: 'OPTIMAL',
        occupancy: 'seats-available',
        colorType: 'primary',
        loadFactorPct: 40,
        vehicleTelemetryId: 'GS-EXEC-02',
        speedKmh: 64.0
      }
    ]
  },
  {
    id: 'stop-somerset-node',
    name: 'Somerset Quantum Concourse',
    code: 'SOM-81',
    walkTimeMins: 6,
    distanceDisplay: '6 min • Node ID: SOM-81',
    temp: '29°',
    weatherIcon: 'cloud',
    coordinates: { x: 62, y: 38 },
    totalActiveRoutes: 1,
    description: 'Financial corridor feeder terminal with neural passenger prediction dispatch.',
    starred: false,
    nodalThroughput: '6,400 pax/hr',
    reliabilityScore: 98.9,
    routes: [
      {
        routeNumber: '143',
        routeName: 'Shenton Downtown Hub',
        primaryTime: '3m',
        secondaryTimes: ['11m', '25m'],
        status: 'on-time',
        statusText: 'SYNCHRONIZED',
        occupancy: 'moderate',
        colorType: 'secondary',
        loadFactorPct: 62,
        vehicleTelemetryId: 'SMART-BUS-143',
        speedKmh: 31.0
      }
    ]
  }
];

export const POPULAR_LOCATIONS: LocationItem[] = [
  {
    id: 'loc-current',
    name: 'Current Quantum GPS Position',
    address: 'Lat 1.2839° N, Lng 103.8515° E (Accuracy: ±0.4m)',
    category: 'current',
    coordinates: { x: 48, y: 35, lat: 1.2839, lng: 103.8515 },
    icon: 'my_location',
    quantCode: 'GPS_LOCK_01'
  },
  {
    id: 'loc-gs-tower',
    name: 'Goldman Sachs Headquarters / 200 West St',
    address: '200 West Street, Financial District',
    category: 'landmark',
    coordinates: { x: 68, y: 72, lat: 40.7145, lng: -74.0143 },
    icon: 'account_balance',
    quantCode: 'GS_NY_HQ'
  },
  {
    id: 'loc-mbfc-tower',
    name: 'Marina Bay Financial Centre Tower 1',
    address: '8 Marina Boulevard, Singapore 018981',
    category: 'landmark',
    coordinates: { x: 48, y: 35, lat: 1.2798, lng: 103.8542 },
    icon: 'corporate_fare',
    quantCode: 'MBFC_SG'
  },
  {
    id: 'loc-sandhill',
    name: 'Sand Hill AI Innovation Campus',
    address: '3000 Sand Hill Rd, Menlo Park, CA',
    category: 'landmark',
    coordinates: { x: 38, y: 52, lat: 37.4221, lng: -122.2045 },
    icon: 'memory',
    quantCode: 'SAND_HILL_AI'
  },
  {
    id: 'loc-changi-hub',
    name: 'Changi Aviation & Autonomous Rail Terminal',
    address: 'Airport Blvd, Level 2 Intermodal Hub',
    category: 'airport',
    coordinates: { x: 88, y: 18, lat: 1.3644, lng: 103.9915 },
    icon: 'flight',
    quantCode: 'CHANGI_AIR_01'
  }
];

export const MULTIMODAL_ROUTES_DATA: Record<TravelMode, RouteOption[]> = {
  transit: [
    {
      id: 'route-transit-alpha',
      mode: 'transit',
      title: 'Neural Alpha Route (HSR + Autonomous Shuttle)',
      viaSummary: 'Downtown Express Line 196X → Direct High-Speed Rail Corridor',
      durationMinutes: 16,
      distanceKm: 11.4,
      departureTime: '08:42 AM',
      arrivalTime: '08:58 AM',
      isFastest: true,
      isRecommended: true,
      cost: '$2.15',
      carbonSavedKg: 2.8,
      trafficCondition: 'fast',
      alphaTimeSavedMin: 6.4,
      neuralConfidence: 99.7,
      volatilityRating: 'LOW',
      arbitrageType: 'ALPHA_SPEED',
      polyline: [
        { x: 48, y: 35 },
        { x: 52, y: 40 },
        { x: 58, y: 50 },
        { x: 64, y: 62 },
        { x: 68, y: 72 }
      ],
      transitBadges: [
        { label: '196X EXPRESS', type: 'bus', color: '#00f0ff', bg: 'rgba(6,182,212,0.15)' },
        { label: 'DTL METRO', type: 'mrt', color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
        { label: '1m WALK', type: 'walk', color: '#10b981', bg: 'rgba(16,185,129,0.15)' }
      ],
      steps: [
        {
          id: 's-1',
          instruction: 'Fast-Walk to Marina Bay Platform A',
          detail: 'Take executive escalator to subterranean Gate 3 • High-speed turnstiles',
          distanceDisplay: '90m (1 min)',
          durationMinutes: 1,
          mode: 'walk',
          icon: 'directions_walk',
          telemetrySpeed: '5.2 km/h',
          efficiencyScore: 98
        },
        {
          id: 's-2',
          instruction: 'Board 196X Autonomous Executive Express',
          detail: '3 stops (Express flyover corridor) • Vehicle GS-QUANTUM-88 • On-time delta 0.0s',
          distanceDisplay: '6.2 km (8 min)',
          durationMinutes: 8,
          mode: 'bus',
          icon: 'directions_bus',
          lineBadge: '196X',
          lineColor: '#00f0ff',
          lineBg: '#083344',
          stopCount: 3,
          stopsList: ['Marina Bay Concourse', 'Raffles Place Financial', 'Downtown Skybridge', 'City Hall Interchange'],
          departureTime: '08:43 AM',
          arrivalTime: '08:51 AM',
          telemetrySpeed: '46.5 km/h',
          efficiencyScore: 99
        },
        {
          id: 's-3',
          instruction: 'Transfer to Downtown Line (Rail Platform 2)',
          detail: 'Direct zero-latency cross-platform interchange • Train incoming in 45s',
          distanceDisplay: 'Zero-step transfer (2 min)',
          durationMinutes: 2,
          mode: 'mrt',
          icon: 'train',
          lineBadge: 'DTL',
          lineColor: '#eab308',
          lineBg: '#422006',
          stopCount: 2,
          stopsList: ['City Hall Interchange', 'Capitol Center Terminal', 'Financial Tower Gate'],
          departureTime: '08:53 AM',
          arrivalTime: '08:57 AM',
          isTransfer: true,
          telemetrySpeed: '78.0 km/h',
          efficiencyScore: 100
        },
        {
          id: 's-4',
          instruction: 'Arrive at Goldman Sachs Executive Lobby Gate',
          detail: 'Biometric fast-entry concourse',
          distanceDisplay: '40m (1 min)',
          durationMinutes: 1,
          mode: 'walk',
          icon: 'location_on',
          telemetrySpeed: '4.8 km/h',
          efficiencyScore: 99
        }
      ]
    },
    {
      id: 'route-transit-direct',
      mode: 'transit',
      title: 'Zero-Transfer Direct Arterial',
      viaSummary: 'Single-Seat Corridor via Bus 10E Direct',
      durationMinutes: 21,
      distanceKm: 9.8,
      departureTime: '08:44 AM',
      arrivalTime: '09:05 AM',
      cost: '$1.80',
      carbonSavedKg: 2.2,
      trafficCondition: 'moderate',
      alphaTimeSavedMin: 1.2,
      neuralConfidence: 97.4,
      volatilityRating: 'LOW',
      arbitrageType: 'ZERO_TRANSFER',
      polyline: [
        { x: 48, y: 35 },
        { x: 45, y: 48 },
        { x: 55, y: 60 },
        { x: 68, y: 72 }
      ],
      transitBadges: [
        { label: '10E DIRECT', type: 'bus', color: '#10b981', bg: 'rgba(16,185,129,0.15)' }
      ],
      steps: [
        {
          id: 's-d1',
          instruction: 'Board Bus 10E at Marina Bay Financial Stop',
          detail: 'Single uninterrupted seat to Executive Terminal',
          distanceDisplay: '9.8 km (20 min)',
          durationMinutes: 20,
          mode: 'bus',
          icon: 'directions_bus',
          lineBadge: '10E',
          lineColor: '#10b981',
          lineBg: '#064e3b',
          stopCount: 6,
          stopsList: ['Marina Bay Concourse', 'Shenton Way', 'Anson Rd', 'Tanjong Pagar', 'Chinatown Point', 'Executive Hub'],
          departureTime: '08:45 AM',
          arrivalTime: '09:05 AM',
          telemetrySpeed: '32.4 km/h',
          efficiencyScore: 94
        }
      ]
    }
  ],
  car: [
    {
      id: 'route-car-fast',
      mode: 'car',
      title: 'Autonomous Executive Chauffeur (Waymo/Cybercab)',
      viaSummary: 'Marina Coastal Expressway (MCE) Tunnel Flow',
      durationMinutes: 14,
      distanceKm: 12.1,
      departureTime: '08:42 AM',
      arrivalTime: '08:56 AM',
      isFastest: true,
      cost: '$18.50',
      carbonSavedKg: 0.8,
      trafficCondition: 'fast',
      alphaTimeSavedMin: 8.2,
      neuralConfidence: 98.9,
      volatilityRating: 'MED',
      arbitrageType: 'EXECUTIVE_CORRIDOR',
      polyline: [
        { x: 48, y: 35 },
        { x: 40, y: 38 },
        { x: 35, y: 55 },
        { x: 50, y: 68 },
        { x: 68, y: 72 }
      ],
      steps: [
        {
          id: 's-c1',
          instruction: 'Autonomous vehicle dispatched to Executive Port 2',
          detail: 'Tesla Cybercab #9082 • ETA 45 seconds',
          distanceDisplay: '0m',
          durationMinutes: 1,
          mode: 'car',
          icon: 'local_taxi',
          telemetrySpeed: '0 km/h',
          efficiencyScore: 97
        },
        {
          id: 's-c2',
          instruction: 'Merge onto Marina Coastal Expressway (MCE)',
          detail: 'High speed autonomous convoy • 85 km/h lane lock',
          distanceDisplay: '11.8 km (12 min)',
          durationMinutes: 12,
          mode: 'car',
          icon: 'directions_car',
          telemetrySpeed: '84.2 km/h',
          efficiencyScore: 96
        },
        {
          id: 's-c3',
          instruction: 'Arrive at Financial Center VIP Drop-off',
          detail: 'Underground lane B',
          distanceDisplay: '300m (1 min)',
          durationMinutes: 1,
          mode: 'car',
          icon: 'location_on',
          telemetrySpeed: '20 km/h',
          efficiencyScore: 98
        }
      ]
    }
  ],
  walk: [
    {
      id: 'route-walk-climate',
      mode: 'walk',
      title: 'Climate-Controlled Underpass Skybridge Walk',
      viaSummary: 'Subterranean Network & High-Line Promenade',
      durationMinutes: 28,
      distanceKm: 2.4,
      departureTime: '08:42 AM',
      arrivalTime: '09:10 AM',
      cost: '$0.00',
      carbonSavedKg: 3.6,
      trafficCondition: 'fast',
      alphaTimeSavedMin: 0,
      neuralConfidence: 100,
      volatilityRating: 'LOW',
      arbitrageType: 'ECO_EFFICIENCY',
      polyline: [
        { x: 48, y: 35 },
        { x: 50, y: 45 },
        { x: 58, y: 58 },
        { x: 68, y: 72 }
      ],
      steps: [
        {
          id: 's-w1',
          instruction: 'Enter Underground Air-Conditioned Concourse',
          detail: 'Constant 21°C climate • Zero street traffic',
          distanceDisplay: '1.2 km (14 min)',
          durationMinutes: 14,
          mode: 'walk',
          icon: 'directions_walk',
          telemetrySpeed: '5.1 km/h',
          efficiencyScore: 100
        },
        {
          id: 's-w2',
          instruction: 'Ascend to Waterfront Glass Skybridge',
          detail: 'Direct skybridge link to Tower 2 executive lobby',
          distanceDisplay: '1.2 km (14 min)',
          durationMinutes: 14,
          mode: 'walk',
          icon: 'directions_walk',
          telemetrySpeed: '5.0 km/h',
          efficiencyScore: 100
        }
      ]
    }
  ]
};

export function getRoutePlans(
  origin: LocationItem,
  dest: LocationItem,
  mode: TravelMode
): RouteOption[] {
  const baseRoutes = MULTIMODAL_ROUTES_DATA[mode] || MULTIMODAL_ROUTES_DATA.transit;
  return baseRoutes.map((r, i) => ({
    ...r,
    id: `${r.id}-${origin.id}-${dest.id}-${i}`,
    polyline: [
      origin.coordinates,
      {
        x: (origin.coordinates.x * 2 + dest.coordinates.x) / 3 + (i === 1 ? 5 : 0),
        y: (origin.coordinates.y * 2 + dest.coordinates.y) / 3
      },
      {
        x: (origin.coordinates.x + dest.coordinates.x * 2) / 3,
        y: (origin.coordinates.y + dest.coordinates.y * 2) / 3 - (i === 1 ? 4 : 0)
      },
      dest.coordinates
    ]
  }));
}

export const SAVED_ROUTES_DATA: SavedRoute[] = [
  {
    id: 'sr-1',
    title: 'Executive Corridor: Goldman Sachs Desk ↔ Sand Hill AI Lab',
    routeNumber: '196X',
    from: 'Marina Bay Concourse Hub',
    to: 'Silicon Valley Financial Gate',
    nextArrival: 'Arr (2m)',
    status: 'arriving',
    statusBadge: 'ALPHA PRIORITY',
    scheduleSummary: 'Departing every 3 min (99.8% P99 On-Time Yield)',
    frequency: 'Every 3 min',
    stopsCount: 4,
    favorite: true,
    colorType: 'primary',
    quantYield: '+99.8%',
    onTimeP99: '0.04m delta',
    corridorRisk: 'ALPHA'
  },
  {
    id: 'sr-2',
    title: 'Quant Shuttle: Shenton Way HFT Hub ↔ Changi Flight Concourse',
    routeNumber: '10E',
    from: 'Shenton Trading Center',
    to: 'Airport Intermodal Wing',
    nextArrival: '4 min',
    status: 'on-time',
    statusBadge: 'SYNCHRONIZED',
    scheduleSummary: 'Direct express line with dedicated priority lane',
    frequency: 'Every 6 min',
    stopsCount: 7,
    favorite: true,
    colorType: 'primary',
    quantYield: '+99.2%',
    onTimeP99: '0.12m delta',
    corridorRisk: 'OPTIMAL'
  },
  {
    id: 'sr-3',
    title: 'Downtown High-Speed Rail: NS Metro Line Loop',
    routeNumber: 'NS-LINE',
    from: 'Orchard Interchange',
    to: 'Marina South Financial Pier',
    nextArrival: '1 min',
    status: 'on-time',
    statusBadge: 'HIGH FREQUENCY',
    scheduleSummary: 'Autonomous CBTC signalling • Zero human error latency',
    frequency: 'Every 2 min',
    stopsCount: 5,
    favorite: false,
    colorType: 'secondary',
    quantYield: '+99.9%',
    onTimeP99: '0.01m delta',
    corridorRisk: 'ALPHA'
  }
];

export const ACTIVE_ALERTS_DATA: NetworkAlert[] = [
  {
    id: 'alert-1',
    category: 'moderate',
    title: 'Financial District Surge Arbitrage: Reroute Advised for Bus 857',
    summary: 'Dynamic congestion spike (+3.2 min latency) detected on Central Boulevard corridor. AETHER AI routing engine has pre-cleared automated bypass via Flyover 2.',
    timeAgo: '4m ago',
    validUntil: '11:00 AM EST',
    affectedRoutes: ['857', '102', '12'],
    type: 'transit',
    riskScore: '0.24 LOW',
    automatedRerouteYield: '+4.8 min saved'
  },
  {
    id: 'alert-2',
    category: 'info',
    title: 'Autonomous Rail CBTC v4.8 Optimization Complete',
    summary: 'Downtown line trains are operating with automated 90-second headway intervals, increasing network throughput by +18.4%.',
    timeAgo: '18m ago',
    validUntil: 'All Day',
    affectedRoutes: ['NS-LINE', 'DTL', '196X'],
    type: 'transit',
    riskScore: '0.02 MINIMAL',
    automatedRerouteYield: 'Optimal'
  },
  {
    id: 'alert-3',
    category: 'reroute',
    title: 'Executive Corridors Priority Clearance Active',
    summary: 'Dedicated express bus priority signalling active at all downtown intersections. Green wave guarantee for routes 196X & 10E.',
    timeAgo: '32m ago',
    validUntil: '10:30 AM EST',
    affectedRoutes: ['196X', '10E'],
    type: 'transit',
    riskScore: '0.00 ZERO',
    automatedRerouteYield: '+6.2 min saved'
  }
];

export const INITIAL_USER_ALERTS: AlertNotificationSetting[] = [
  {
    id: 'ua-1',
    routeNumber: '196X',
    destination: 'Goldman Sachs Trading Hub',
    triggerDescription: 'Trigger instant neural push if latency delta exceeds +60 seconds',
    enabled: true,
    timeWindow: '07:30 - 09:30 AM (Morning Trading Open)',
    hedgeThreshold: '±45s'
  },
  {
    id: 'ua-2',
    routeNumber: 'NS-LINE',
    destination: 'Downtown Financial High-Speed Rail',
    triggerDescription: 'Automated platform load balancing alerts when train capacity < 50%',
    enabled: true,
    timeWindow: '05:00 - 07:30 PM (Evening Market Close)',
    hedgeThreshold: '±30s'
  },
  {
    id: 'ua-3',
    routeNumber: '10E',
    destination: 'Aviation Express Terminal',
    triggerDescription: 'Notify on high-speed rail transfer synchronicity updates',
    enabled: false,
    timeWindow: 'All Day',
    hedgeThreshold: '±90s'
  }
];

export const WEATHER_DATA: WeatherData = {
  city: 'New York / Singapore Global Trading Desk',
  temp: 28,
  unit: 'C',
  condition: 'Optimal Atmospheric Visibility',
  icon: 'wb_sunny',
  impactSummary: 'Zero micro-climate friction on ground corridors. Autonomous radar and optical sensors operating at 100% telemetry resolution.',
  frictionIndex: '0.04 (ZERO IMPACT)',
  pressureHpa: 1014.2,
  visibilityKm: 16.0,
  hourlyPoints: [
    { time: '08:00', temp: 27, pop: 2 },
    { time: '09:00', temp: 28, pop: 5 },
    { time: '10:00', temp: 29, pop: 10 },
    { time: '11:00', temp: 31, pop: 12 },
    { time: '12:00', temp: 32, pop: 15 },
    { time: '13:00', temp: 32, pop: 20 },
    { time: '14:00', temp: 31, pop: 18 },
    { time: '15:00', temp: 30, pop: 12 }
  ],
  rainProbability: [
    { label: '08:00', prob: 2 },
    { label: '10:00', prob: 5 },
    { label: '12:00', prob: 15 },
    { label: '14:00', prob: 20 },
    { label: '16:00', prob: 10 },
    { label: '18:00', prob: 4 }
  ],
  activeAdvisories: [
    {
      title: 'Atmospheric Transit Friction Index: 0.04 (Nominal)',
      desc: 'No precipitation slowdowns expected across major express corridors.',
      severity: 'info'
    }
  ]
};

export const MOCK_STOP_SCHEDULE: StopScheduleEntry[] = [
  { departureTime: '08:42:15', routeNumber: '196X', destination: 'Financial District Gate A', platform: 'Bay 1', status: 'Boarding', delayMins: 0, vehicleId: 'GS-Q88', loadPct: 42 },
  { departureTime: '08:45:00', routeNumber: 'NS-LINE', destination: 'North-South Rail Loop', platform: 'Track 2', status: 'On Time', delayMins: 0, vehicleId: 'HSR-09', loadPct: 54 },
  { departureTime: '08:48:30', routeNumber: '10E', destination: 'Shenton Way Direct', platform: 'Bay 3', status: 'On Time', delayMins: 0, vehicleId: 'EV-302', loadPct: 68 },
  { departureTime: '08:52:00', routeNumber: '196X', destination: 'Financial District Gate A', platform: 'Bay 1', status: 'On Time', delayMins: 0, vehicleId: 'GS-Q92', loadPct: 35 },
  { departureTime: '08:55:00', routeNumber: '857', destination: 'Silicon Corridor Arterial', platform: 'Bay 4', status: 'Delayed', delayMins: 2, vehicleId: 'AI-19', loadPct: 89 }
];

export const SAMPLE_SCHEDULE_ENTRIES: Record<string, StopScheduleEntry[]> = {
  default: MOCK_STOP_SCHEDULE
};

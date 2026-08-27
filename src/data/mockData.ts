import { TransitStop, SavedRoute, NetworkAlert, AlertNotificationSetting, WeatherData, StopScheduleEntry, LocationItem, RouteOption, TravelMode, NavigationStep } from '../types';

export const MAP_IMAGES = {
  calgaryLight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW8AtpWs64JaAVdeLT-21YACEfDMnWOZlhqsMmpYNM-v6TbJjCB_TXhUF1YfbByPaJ4xn-dpuzcUV19KzgqJZ8ZmDpOav_Lpfip9uuchJwzds7nLiFwK3SMRB2mmdP-fZidjxRilO53b9kybkRqQcW-Tjn0J2CjLo7Ww_FBN0Q4qfxOcqwnVM6Amlu-2nzw9D4NfCiYj0QXDw7UdrMchacPzjAi7UmCrqnTSAtzLNnJ4WMTKENJ4L8Hg',
  singaporeLight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq5r44dgmpggLgUvXCH3hAWpTcAClasqpsev8vxoXwNz_5SOH0O0H50HKoFQIgWxWCpxs3oKpcivLByBYD18k6HxvypX6mm9P4pEebQNh1I96B2kMhwZW1xQ6FrNzhxsRitBi8BjS7wHAqRWHGg82Yfum7FnbHBwGww4c1VIlKLxYqWTFDkNu2oxBjzIxKHDG_VNvCyVcSS5wfl53G2c10yl0uZdnTT0tIPoRS60VRb9Ju3wDzeJRMwg',
  singaporeNight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz9oocrgEKTWzix0dILqNnfRQUIrrYxj1r8oCscvHzmX59EGb4Ao6SqvtflJqBr9wzHOMuaRXgm04nSCHq8E4FhCUj2y1fhH6Pn5MHVw48RZuGwvnuMRqEjuM4etOxsgRlR0D4bOp1__brXUfMrY_Ng2DTGynZj7IEkoTUOGjGauaZlghpMqCaypjN9BgLDw5LhN_UxzghQhaDO9sdy_ih88cHnn_IKk_u1x4hnGeCBW1GsFMXiZ4yeQ',
  nycRadarNight: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWsSSrhmsBpxagHqiiigN39_DdfguVB5Nhkdf9ickY7BGegefPVPneaG4zWz1OhojvTIA3cRVjTrWNeUuSXlAud3udN2fQxMdIwNLCGg7yJLL7XeevXf0r8ex274auW1fGgmFzu05CujqATHIkwugRb_Ser0cNYTJADzi_cKYM866uxmqk5DFRoyQ_z9Y1d9HI9bXbiRwH4Aowl7UhB2ud55anOPbvxNHp1H5M4DRJWHdfl1Prg2h_mQ'
};

export const INITIAL_STOPS: TransitStop[] = [
  {
    id: 'stop-central-library',
    name: 'Central Library',
    code: '9482',
    walkTimeMins: 3,
    distanceDisplay: '3 min • Stop ID: 9482',
    temp: '22°',
    weatherIcon: 'partly_cloudy_day',
    coordinates: { x: 48, y: 35 },
    totalActiveRoutes: 2,
    description: '2 active routes serving this location right now.',
    starred: true,
    routes: [
      {
        routeNumber: '14',
        routeName: 'Riverside',
        primaryTime: 'Now',
        secondaryTimes: ['4m', '12m'],
        status: 'arriving',
        statusText: 'On Time',
        occupancy: 'seats-available',
        colorType: 'primary',
        live: true
      },
      {
        routeNumber: '55X',
        routeName: 'Tech Park Exp',
        primaryTime: '8m',
        secondaryTimes: ['22m', '35m'],
        status: 'delayed',
        statusText: 'Delayed +3m',
        occupancy: 'standing',
        colorType: 'delayed'
      }
    ]
  },
  {
    id: 'stop-market-square',
    name: 'Market Square',
    code: '4122',
    walkTimeMins: 7,
    distanceDisplay: '7 min • Stop ID: 4122',
    temp: '21°',
    weatherIcon: 'rainy',
    coordinates: { x: 38, y: 52 },
    totalActiveRoutes: 1,
    description: 'High-frequency downtown connector stop.',
    starred: false,
    routes: [
      {
        routeNumber: '8',
        routeName: 'South Station',
        primaryTime: '2m',
        secondaryTimes: ['15m', '30m'],
        status: 'on-time',
        statusText: 'On Time',
        occupancy: 'seats-available',
        colorType: 'primary'
      }
    ]
  },
  {
    id: 'stop-university-ave',
    name: 'University Ave',
    code: '1109',
    walkTimeMins: 12,
    distanceDisplay: '12 min • Stop ID: 1109',
    temp: '22°',
    weatherIcon: 'cloud',
    coordinates: { x: 28, y: 68 },
    totalActiveRoutes: 2,
    description: 'Campus interchange & direct cross-city express hub.',
    starred: false,
    routes: [
      {
        routeNumber: '102',
        routeName: 'West Campus',
        primaryTime: '14m',
        secondaryTimes: ['34m', '--'],
        status: 'on-time',
        statusText: 'On Time',
        occupancy: 'moderate',
        colorType: 'secondary'
      },
      {
        routeNumber: '12',
        routeName: 'North Hills',
        primaryTime: 'No Service',
        secondaryTimes: [],
        status: 'critical',
        statusText: 'No Service',
        occupancy: 'full',
        colorType: 'critical'
      }
    ]
  },
  {
    id: 'stop-orchard-mrt',
    name: 'Orchard MRT',
    code: '09023',
    walkTimeMins: 2,
    distanceDisplay: '2 min walk',
    temp: '31°',
    weatherIcon: 'thunderstorm',
    coordinates: { x: 55, y: 44 },
    totalActiveRoutes: 2,
    description: 'Primary retail corridor & North-South Line connection.',
    starred: true,
    routes: [
      {
        routeNumber: '14',
        routeName: 'Clementi Int',
        primaryTime: 'Arr',
        secondaryTimes: ['6m', '14m'],
        status: 'arriving',
        statusText: 'On Time',
        occupancy: 'seats-available',
        colorType: 'primary',
        live: true
      },
      {
        routeNumber: '196',
        routeName: 'Bedok Int',
        primaryTime: '4 min',
        secondaryTimes: ['11m', '22m'],
        status: 'delayed',
        statusText: '+2 min',
        occupancy: 'standing',
        colorType: 'secondary'
      }
    ]
  },
  {
    id: 'stop-somerset-mrt',
    name: 'Somerset MRT',
    code: '08121',
    walkTimeMins: 5,
    distanceDisplay: '5 min walk',
    temp: '31°',
    weatherIcon: 'thunderstorm',
    coordinates: { x: 62, y: 56 },
    totalActiveRoutes: 2,
    description: 'Direct access to Somerset 313 and Orchard Gateway.',
    starred: false,
    routes: [
      {
        routeNumber: '10',
        routeName: 'Tampines Int',
        primaryTime: '9 min',
        secondaryTimes: ['18m', '29m'],
        status: 'on-time',
        statusText: 'On Time',
        occupancy: 'seats-available',
        colorType: 'pink'
      },
      {
        routeNumber: '14',
        routeName: 'Bedok Int',
        primaryTime: '12 min',
        secondaryTimes: ['25m', '38m'],
        status: 'on-time',
        statusText: 'On Time',
        occupancy: 'full',
        colorType: 'primary'
      }
    ]
  },
  {
    id: 'stop-central-station',
    name: 'Central Station',
    code: '1001',
    walkTimeMins: 2,
    distanceMeters: 120,
    distanceDisplay: '0.1 MI AWAY',
    temp: '72°',
    weatherIcon: 'wb_sunny',
    coordinates: { x: 50, y: 40 },
    totalActiveRoutes: 3,
    description: 'Grand Central transit concourse and multi-line terminal.',
    starred: true,
    routes: [
      {
        routeNumber: 'M1',
        routeName: 'Uptown Express',
        subText: 'VIA PARK AVE',
        primaryTime: 'NOW',
        status: 'arriving',
        statusText: 'On Time',
        occupancy: 'seats-available',
        colorType: 'primary',
        live: true
      },
      {
        routeNumber: '42',
        routeName: 'Crosstown Local',
        subText: 'WESTSIDE',
        primaryTime: '3 min',
        status: 'on-time',
        statusText: '3 min',
        occupancy: 'moderate',
        colorType: 'subtle'
      },
      {
        routeNumber: 'L7',
        routeName: 'Downtown Shuttl.',
        subText: 'DELAYED',
        primaryTime: '12 min',
        status: 'delayed',
        statusText: 'DELAYED',
        occupancy: 'full',
        colorType: 'delayed'
      }
    ]
  },
  {
    id: 'stop-riverside-plaza',
    name: 'Riverside Plaza',
    code: '1044',
    walkTimeMins: 5,
    distanceMeters: 350,
    distanceDisplay: '0.4 MI AWAY',
    temp: '72°',
    weatherIcon: 'wb_sunny',
    coordinates: { x: 35, y: 30 },
    totalActiveRoutes: 2,
    description: 'Waterfront promenade and commuter ferry slip.',
    starred: false,
    routes: [
      {
        routeNumber: 'F12',
        routeName: 'Ferry Terminal',
        subText: 'NORTHBOUND',
        primaryTime: '8 min',
        status: 'on-time',
        statusText: '8 min',
        occupancy: 'seats-available',
        colorType: 'blue'
      },
      {
        routeNumber: '9',
        routeName: 'University Loop',
        subText: 'EAST CAMPUS',
        primaryTime: '15 min',
        status: 'on-time',
        statusText: '15 min',
        occupancy: 'moderate',
        colorType: 'subtle'
      }
    ]
  },
  {
    id: 'stop-tech-park-west',
    name: 'Tech Park West',
    code: '2094',
    walkTimeMins: 7,
    distanceMeters: 420,
    distanceDisplay: '7 min • 420m',
    temp: '72°',
    weatherIcon: 'wb_sunny',
    coordinates: { x: 70, y: 72 },
    totalActiveRoutes: 1,
    description: 'Silicon Boulevard innovation campus entrance.',
    starred: false,
    routes: [
      {
        routeNumber: '04',
        routeName: 'Westbound',
        primaryTime: 'DELAYED',
        status: 'delayed',
        statusText: 'Delayed 15m',
        occupancy: 'full',
        colorType: 'subtle'
      }
    ]
  }
];

export const SAVED_ROUTES_DATA: SavedRoute[] = [
  {
    id: 'saved-1',
    title: 'Home to Office',
    routeNumber: '196',
    from: 'Clementi Ave 3',
    to: 'Bedok Interchange',
    nextArrival: '2 min',
    status: 'arriving',
    statusBadge: 'ARRIVING',
    scheduleSummary: 'Every 4-6 mins during rush hours',
    frequency: '5 min freq',
    stopsCount: 28,
    favorite: true,
    colorType: 'primary'
  },
  {
    id: 'saved-2',
    title: 'University Campus Express',
    routeNumber: '102',
    from: 'Downtown Concourse',
    to: 'Science Park II',
    nextArrival: '14 min',
    status: 'on-time',
    statusBadge: 'ON TIME',
    scheduleSummary: 'Direct express with limited stops',
    frequency: '12 min freq',
    stopsCount: 14,
    favorite: true,
    colorType: 'secondary'
  },
  {
    id: 'saved-3',
    title: 'Evening Metro Shuttle',
    routeNumber: 'M1',
    from: 'Central Station Platform 2',
    to: 'Uptown Heights',
    nextArrival: 'Now',
    status: 'arriving',
    statusBadge: 'LIVE NOW',
    scheduleSummary: 'Rapid transit artery with air-con cars',
    frequency: '3 min freq',
    stopsCount: 9,
    favorite: true,
    colorType: 'primary'
  },
  {
    id: 'saved-4',
    title: 'Market Ferry Crossing',
    routeNumber: 'F12',
    from: 'Riverside Pier',
    to: 'Harbor Gateway',
    nextArrival: '8 min',
    status: 'on-time',
    statusBadge: 'ON TIME',
    scheduleSummary: 'Scenic river transit connecting east/west banks',
    frequency: '15 min freq',
    stopsCount: 4,
    favorite: false,
    colorType: 'tertiary'
  }
];

export const ACTIVE_ALERTS_DATA: NetworkAlert[] = [
  {
    id: 'alert-1',
    category: 'severe',
    title: 'Orchard Road Diversion',
    summary: 'Due to an accident near Somerset MRT, services 7, 14, 16, 65, 111, 123, 175 are diverted. Stops 09038 and 09048 are skipped.',
    timeAgo: '10 mins ago',
    affectedRoutes: ['7', '14', '16', '+4'],
    skippedStops: ['09038', '09048'],
    actionLinkText: 'View Diversion Map',
    type: 'transit'
  },
  {
    id: 'alert-2',
    category: 'moderate',
    title: 'Bus Stop Relocation',
    summary: 'Bus stop 81049 (Paya Lebar Stn Exit D) temporarily relocated 50m down Paya Lebar Road due to ongoing construction.',
    timeAgo: '45 mins ago',
    affectedRoutes: ['24', '28', '43'],
    type: 'transit'
  },
  {
    id: 'alert-3',
    category: 'major-delay',
    title: 'Red Line - City Center Segment',
    summary: 'Signal failure at Union Station causing cascading delays of up to 45 minutes on northbound trains. Alternate bus routes 42 and 44 are cross-honoring passes.',
    timeAgo: '10m ago',
    affectedRoutes: ['Red Line', '42', '44'],
    actionLinkText: 'View Alternatives',
    type: 'transit'
  },
  {
    id: 'alert-4',
    category: 'reroute',
    title: 'Route 14 Express Detour',
    summary: 'Due to ongoing construction on 5th Ave, Route 14 is detouring via 7th Ave until 8:00 PM. Stops between 32nd St and 42nd St are bypassed.',
    timeAgo: '1h ago',
    affectedRoutes: ['14 Express'],
    type: 'transit'
  },
  {
    id: 'alert-5',
    category: 'advisory',
    title: 'Heavy Monsoon Rain Expected',
    summary: 'Expect 10-15 minute delays across all island-wide routes due to localized flooding and reduced visibility. Drive safely if transiting.',
    timeAgo: 'Updated 5m ago',
    validUntil: '18:00',
    affectedRoutes: ['All Lines'],
    type: 'weather'
  },
  {
    id: 'alert-6',
    category: 'info',
    title: 'Weekend Schedule Changes',
    summary: 'Starting this weekend, all commuter rail lines will operate on a modified holiday schedule due to track maintenance. Plan for 30-minute headways.',
    timeAgo: 'Upcoming',
    affectedRoutes: ['Commuter Rail'],
    type: 'schedule'
  },
  {
    id: 'alert-7',
    category: 'news',
    title: 'New Express Route 99 Launch',
    summary: 'The new Rapid Transit Route 99 connecting the tech park to downtown launches Monday. First rides are free.',
    timeAgo: 'News',
    affectedRoutes: ['Route 99'],
    type: 'general'
  }
];

export const INITIAL_USER_ALERTS: AlertNotificationSetting[] = [
  {
    id: 'alert-set-1',
    routeNumber: '196',
    destination: 'To Clementi Int',
    triggerDescription: 'Alert 2 stops before',
    enabled: true
  },
  {
    id: 'alert-set-2',
    routeNumber: '97',
    destination: 'To Jurong East Int',
    triggerDescription: 'Alert 5 mins before',
    enabled: false
  },
  {
    id: 'alert-set-3',
    routeNumber: '10',
    destination: 'To Tampines Int',
    triggerDescription: 'M-F 17:00 - 19:00',
    enabled: true
  },
  {
    id: 'alert-set-4',
    routeNumber: 'M1',
    destination: 'To Uptown Express',
    triggerDescription: 'Alert on delay > 5m',
    enabled: true
  }
];

export const WEATHER_DATA: WeatherData = {
  city: 'New York City, NY',
  temp: 72,
  unit: 'F',
  condition: 'Optimal commuting conditions',
  icon: 'wb_sunny',
  impactSummary: 'Clear skies across the metropolitan network. Transit speeds running 100% on schedule.',
  hourlyPoints: [
    { time: 'NOW', temp: 72, pop: 10 },
    { time: '+2H', temp: 74, pop: 15 },
    { time: '+4H', temp: 71, pop: 65 },
    { time: '+6H', temp: 68, pop: 40 },
    { time: '+8H', temp: 65, pop: 20 }
  ],
  rainProbability: [
    { label: '12P', prob: 20 },
    { label: '3P', prob: 10 },
    { label: '6P', prob: 60, highlight: true },
    { label: '9P', prob: 40 },
    { label: '12A', prob: 15 }
  ],
  activeAdvisories: [
    {
      title: 'Subway L Line',
      desc: 'Track maintenance due to minor flooding. Expect 15 min delays.',
      severity: 'warning'
    },
    {
      title: 'Bus Route M15',
      desc: 'Operating normal schedule.',
      severity: 'info'
    }
  ]
};

export const SAMPLE_SCHEDULE_ENTRIES: Record<string, StopScheduleEntry[]> = {
  'Central Library': [
    { departureTime: '14:02', routeNumber: '14', destination: 'Riverside Loop', platform: 'Bay A', status: 'Boarding' },
    { departureTime: '14:06', routeNumber: '14', destination: 'Riverside Loop', platform: 'Bay A', status: 'On Time' },
    { departureTime: '14:10', routeNumber: '55X', destination: 'Tech Park Express', platform: 'Bay B', status: 'Delayed', delayMins: 3 },
    { departureTime: '14:14', routeNumber: '14', destination: 'Riverside Loop', platform: 'Bay A', status: 'On Time' },
    { departureTime: '14:24', routeNumber: '55X', destination: 'Tech Park Express', platform: 'Bay B', status: 'On Time' },
    { departureTime: '14:35', routeNumber: '55X', destination: 'Tech Park Express', platform: 'Bay B', status: 'On Time' }
  ],
  'Central Station': [
    { departureTime: '08:14', routeNumber: 'M1', destination: 'Uptown Express via Park Ave', platform: 'Platform 2', status: 'Boarding' },
    { departureTime: '08:17', routeNumber: '42', destination: 'Crosstown Local Westside', platform: 'Bay 1', status: 'On Time' },
    { departureTime: '08:26', routeNumber: 'L7', destination: 'Downtown Shuttle', platform: 'Bay 4', status: 'Delayed', delayMins: 12 },
    { departureTime: '08:30', routeNumber: 'M1', destination: 'Uptown Express via Park Ave', platform: 'Platform 2', status: 'On Time' }
  ],
  'Orchard MRT': [
    { departureTime: '18:04', routeNumber: '14', destination: 'Clementi Interchange', platform: 'Door 1', status: 'Boarding' },
    { departureTime: '18:08', routeNumber: '196', destination: 'Bedok Interchange', platform: 'Door 2', status: 'Delayed', delayMins: 2 },
    { departureTime: '18:14', routeNumber: '14', destination: 'Clementi Interchange', platform: 'Door 1', status: 'On Time' },
    { departureTime: '18:22', routeNumber: '196', destination: 'Bedok Interchange', platform: 'Door 2', status: 'On Time' }
  ]
};

export const POPULAR_LOCATIONS: LocationItem[] = [
  {
    id: 'loc-current',
    name: 'Your Location',
    address: 'Near Central Concourse, Downtown',
    coordinates: { x: 48, y: 52 },
    category: 'current',
    icon: 'my_location'
  },
  {
    id: 'loc-orchard',
    name: 'Orchard MRT Station (NS22)',
    address: '437 Orchard Road, Singapore',
    coordinates: { x: 36, y: 44 },
    category: 'mrt',
    icon: 'train'
  },
  {
    id: 'loc-mbs',
    name: 'Marina Bay Sands',
    address: '10 Bayfront Avenue, Singapore',
    coordinates: { x: 68, y: 65 },
    category: 'landmark',
    icon: 'apartment'
  },
  {
    id: 'loc-central-station',
    name: 'Central Grand Station',
    address: '100 North Bridge Rd, Singapore',
    coordinates: { x: 50, y: 38 },
    category: 'mrt',
    icon: 'directions_transit'
  },
  {
    id: 'loc-library',
    name: 'Central Library',
    address: '100 Victoria Street, Singapore',
    coordinates: { x: 48, y: 35 },
    category: 'landmark',
    icon: 'local_library'
  },
  {
    id: 'loc-techpark',
    name: 'Science & Tech Park',
    address: '12 Science Park Drive, Singapore',
    coordinates: { x: 25, y: 70 },
    category: 'landmark',
    icon: 'domain'
  },
  {
    id: 'loc-airport',
    name: 'Changi Airport Terminal 3',
    address: '65 Airport Boulevard, Singapore',
    coordinates: { x: 84, y: 28 },
    category: 'airport',
    icon: 'flight'
  },
  {
    id: 'loc-riverside',
    name: 'Riverside Plaza',
    address: '11 River Valley Road, Singapore',
    coordinates: { x: 35, y: 30 },
    category: 'bus',
    icon: 'directions_bus'
  },
  {
    id: 'loc-somerset',
    name: 'Somerset 313',
    address: '313 Orchard Road, Singapore',
    coordinates: { x: 44, y: 48 },
    category: 'landmark',
    icon: 'shopping_bag'
  },
  {
    id: 'loc-market-sq',
    name: 'Market Square Concourse',
    address: '42 Cross Street, Singapore',
    coordinates: { x: 58, y: 55 },
    category: 'bus',
    icon: 'store'
  }
];

// Helper to generate intermediate polyline points with realistic curves
function generateSmoothPolyline(
  start: { x: number; y: number },
  end: { x: number; y: number },
  offsetFactor: number = 0
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const steps = 14;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Normal vector for curve curvature
  const perpX = -dy * 0.22 * offsetFactor;
  const perpY = dx * 0.22 * offsetFactor;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier with midpoint offset
    const curve = Math.sin(t * Math.PI);
    const x = start.x + dx * t + perpX * curve;
    const y = start.y + dy * t + perpY * curve;
    points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
  }

  return points;
}

export function getRoutePlans(
  origin: LocationItem,
  destination: LocationItem,
  mode: TravelMode
): RouteOption[] {
  const dx = destination.coordinates.x - origin.coordinates.x;
  const dy = destination.coordinates.y - origin.coordinates.y;
  const rawDistKm = Math.max(1.2, Math.sqrt(dx * dx + dy * dy) * 0.28);
  const distKm = Number(rawDistKm.toFixed(1));

  const mainPolyline = generateSmoothPolyline(origin.coordinates, destination.coordinates, 0.4);
  const altPolyline = generateSmoothPolyline(origin.coordinates, destination.coordinates, -0.5);

  const now = new Date();
  const formatTime = (addMins: number) => {
    const d = new Date(now.getTime() + addMins * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (mode === 'transit') {
    const duration1 = Math.max(12, Math.round(distKm * 2.8 + 6));
    const duration2 = duration1 + 7;
    const duration3 = Math.max(15, Math.round(distKm * 3.2));

    return [
      {
        id: 'transit-opt-1',
        mode: 'transit',
        title: 'MRT North-South Line & Bus 196',
        viaSummary: 'via City Hall Interchange • Best connection',
        durationMinutes: duration1,
        distanceKm: distKm,
        departureTime: formatTime(2),
        arrivalTime: formatTime(duration1 + 2),
        isFastest: true,
        isRecommended: true,
        cost: '$1.85',
        carbonSavedKg: Number((distKm * 0.16).toFixed(1)),
        transitBadges: [
          { label: 'Walk 3m', type: 'walk', color: '#1b1c1c', bg: '#e5e7eb' },
          { label: 'MRT NSL', type: 'mrt', color: '#ffffff', bg: '#d32f2f' },
          { label: 'Bus 196', type: 'bus', color: '#ffffff', bg: '#006e05' },
          { label: 'Walk 2m', type: 'walk', color: '#1b1c1c', bg: '#e5e7eb' }
        ],
        steps: [
          {
            id: 's1',
            instruction: `Walk to nearest transit station (${origin.name.split(' ')[0]} Entry)`,
            detail: 'Head south-east along pedestrian covered walkway',
            distanceDisplay: '180 m',
            durationMinutes: 3,
            mode: 'walk',
            icon: 'directions_walk'
          },
          {
            id: 's2',
            instruction: 'Board MRT North-South Line towards Marina South Pier',
            detail: 'Train arriving in 2 mins • Platform B • Normal passenger load',
            distanceDisplay: `${(distKm * 0.6).toFixed(1)} km`,
            durationMinutes: Math.round(duration1 * 0.55),
            mode: 'mrt',
            icon: 'train',
            lineBadge: 'NSL',
            lineColor: '#ffffff',
            lineBg: '#d32f2f',
            stopCount: 4,
            stopsList: ['Dhoby Ghaut', 'City Hall', 'Raffles Place', 'Marina Bay']
          },
          {
            id: 's3',
            instruction: 'Transfer at Interchange to Bus 196 (Bedok Interchange)',
            detail: 'Board at Bay 3 • Next bus arriving in 3 mins (Seats Available)',
            distanceDisplay: `${(distKm * 0.35).toFixed(1)} km`,
            durationMinutes: Math.round(duration1 * 0.35),
            mode: 'bus',
            icon: 'directions_bus',
            lineBadge: '196',
            lineColor: '#ffffff',
            lineBg: '#006e05',
            stopCount: 3,
            stopsList: ['Opp Capitol Bldg', 'Aft St Andrew Cath', 'Promontory Plaza']
          },
          {
            id: 's4',
            instruction: `Alight at ${destination.name.split(' ')[0]} and walk to entrance`,
            detail: 'Arrive at destination concourse',
            distanceDisplay: '120 m',
            durationMinutes: 2,
            mode: 'walk',
            icon: 'location_on'
          }
        ],
        polyline: mainPolyline,
        alternativesPolyline: altPolyline
      },
      {
        id: 'transit-opt-2',
        mode: 'transit',
        title: 'Direct Bus 14 Express',
        viaSummary: 'via Orchard Blvd • No transfers',
        durationMinutes: duration2,
        distanceKm: Number((distKm * 1.05).toFixed(1)),
        departureTime: formatTime(4),
        arrivalTime: formatTime(duration2 + 4),
        isFastest: false,
        isRecommended: false,
        cost: '$1.55',
        carbonSavedKg: Number((distKm * 0.18).toFixed(1)),
        transitBadges: [
          { label: 'Walk 4m', type: 'walk', color: '#1b1c1c', bg: '#e5e7eb' },
          { label: 'Bus 14', type: 'bus', color: '#ffffff', bg: '#006e05' },
          { label: 'Walk 3m', type: 'walk', color: '#1b1c1c', bg: '#e5e7eb' }
        ],
        steps: [
          {
            id: 's2-1',
            instruction: 'Walk to Aft Capitol Theatre Stop (04111)',
            distanceDisplay: '240 m',
            durationMinutes: 4,
            mode: 'walk',
            icon: 'directions_walk'
          },
          {
            id: 's2-2',
            instruction: 'Board Bus 14 towards Clementi Interchange',
            detail: 'Direct express route • Air-conditioned double decker',
            distanceDisplay: `${distKm} km`,
            durationMinutes: duration2 - 7,
            mode: 'bus',
            icon: 'directions_bus',
            lineBadge: '14',
            lineColor: '#ffffff',
            lineBg: '#006e05',
            stopCount: 7
          },
          {
            id: 's2-3',
            instruction: `Alight at ${destination.name}`,
            distanceDisplay: '160 m',
            durationMinutes: 3,
            mode: 'walk',
            icon: 'location_on'
          }
        ],
        polyline: altPolyline
      },
      {
        id: 'transit-opt-3',
        mode: 'transit',
        title: 'Downtown Line (DTL) Rapid Subway',
        viaSummary: 'via Promenade & Bayfront',
        durationMinutes: duration3,
        distanceKm: distKm,
        departureTime: formatTime(1),
        arrivalTime: formatTime(duration3 + 1),
        isFastest: false,
        cost: '$1.95',
        carbonSavedKg: Number((distKm * 0.15).toFixed(1)),
        transitBadges: [
          { label: 'Walk 5m', type: 'walk', color: '#1b1c1c', bg: '#e5e7eb' },
          { label: 'MRT DTL', type: 'mrt', color: '#ffffff', bg: '#1e88e5' },
          { label: 'Walk 2m', type: 'walk', color: '#1b1c1c', bg: '#e5e7eb' }
        ],
        steps: [
          {
            id: 's3-1',
            instruction: 'Walk to Downtown Line entrance',
            distanceDisplay: '300 m',
            durationMinutes: 5,
            mode: 'walk',
            icon: 'directions_walk'
          },
          {
            id: 's3-2',
            instruction: 'Board Downtown Line towards Expo',
            detail: 'Runs every 3 mins',
            distanceDisplay: `${distKm} km`,
            durationMinutes: duration3 - 7,
            mode: 'mrt',
            icon: 'train',
            lineBadge: 'DTL',
            lineColor: '#ffffff',
            lineBg: '#1e88e5',
            stopCount: 5
          },
          {
            id: 's3-3',
            instruction: 'Arrive at destination concourse',
            distanceDisplay: '100 m',
            durationMinutes: 2,
            mode: 'walk',
            icon: 'location_on'
          }
        ],
        polyline: mainPolyline
      }
    ];
  } else if (mode === 'car') {
    const driveDuration1 = Math.max(8, Math.round(distKm * 1.8 + 4));
    const driveDuration2 = driveDuration1 + 5;

    return [
      {
        id: 'car-opt-1',
        mode: 'car',
        title: 'Fastest Route via Central Expressway (CTE)',
        viaSummary: 'via CTE & Orchard Rd • Light traffic',
        durationMinutes: driveDuration1,
        distanceKm: distKm,
        departureTime: formatTime(0),
        arrivalTime: formatTime(driveDuration1),
        isFastest: true,
        isRecommended: true,
        cost: 'ERP $2.00',
        trafficCondition: 'fast',
        steps: [
          {
            id: 'c1',
            instruction: 'Head north on Orchard Blvd toward Paterson Rd',
            detail: 'Continue for 450 meters',
            distanceDisplay: '450 m',
            durationMinutes: 2,
            mode: 'car',
            icon: 'straight'
          },
          {
            id: 'c2',
            instruction: 'Take the ramp onto Central Expressway (CTE / AYE)',
            detail: 'Pass ERP Gantry (Rate: $2.00) • Merge smoothly into lane 2',
            distanceDisplay: `${(distKm * 0.6).toFixed(1)} km`,
            durationMinutes: Math.round(driveDuration1 * 0.5),
            mode: 'car',
            icon: 'turn_right'
          },
          {
            id: 'c3',
            instruction: 'Take Exit 2 toward Marina Coastal / Downtown Core',
            detail: 'Use the left 2 lanes to turn left onto Temasek Blvd',
            distanceDisplay: '800 m',
            durationMinutes: 2,
            mode: 'car',
            icon: 'turn_left'
          },
          {
            id: 'c4',
            instruction: `Arrive at ${destination.name}`,
            detail: 'Underground parking available at Bayfront Carpark B',
            distanceDisplay: '200 m',
            durationMinutes: 1,
            mode: 'car',
            icon: 'local_parking'
          }
        ],
        polyline: mainPolyline,
        alternativesPolyline: altPolyline
      },
      {
        id: 'car-opt-2',
        mode: 'car',
        title: 'Alternative via Nicoll Highway',
        viaSummary: 'via Nicoll Hwy • No Tolls (Avoids ERP)',
        durationMinutes: driveDuration2,
        distanceKm: Number((distKm * 1.15).toFixed(1)),
        departureTime: formatTime(0),
        arrivalTime: formatTime(driveDuration2),
        isFastest: false,
        cost: 'Toll-free',
        trafficCondition: 'moderate',
        steps: [
          {
            id: 'c2-1',
            instruction: 'Head south on Stamford Rd toward Victoria St',
            distanceDisplay: '600 m',
            durationMinutes: 3,
            mode: 'car',
            icon: 'straight'
          },
          {
            id: 'c2-2',
            instruction: 'Continue onto Nicoll Highway over the reservoir bridge',
            distanceDisplay: `${(distKm * 0.8).toFixed(1)} km`,
            durationMinutes: driveDuration2 - 5,
            mode: 'car',
            icon: 'straight'
          },
          {
            id: 'c2-3',
            instruction: `Turn right into ${destination.name}`,
            distanceDisplay: '300 m',
            durationMinutes: 2,
            mode: 'car',
            icon: 'turn_right'
          }
        ],
        polyline: altPolyline
      }
    ];
  } else {
    // Walking mode
    const walkDuration = Math.max(14, Math.round(distKm * 12));
    const calories = Math.round(distKm * 58);

    return [
      {
        id: 'walk-opt-1',
        mode: 'walk',
        title: 'Pedestrian Underpass & Park Walkway',
        viaSummary: 'Mostly flat • Covered walkway & shade',
        durationMinutes: walkDuration,
        distanceKm: distKm,
        departureTime: formatTime(0),
        arrivalTime: formatTime(walkDuration),
        isFastest: true,
        isRecommended: true,
        cost: 'Free',
        carbonSavedKg: Number((distKm * 0.22).toFixed(1)),
        steps: [
          {
            id: 'w1',
            instruction: `Head out from ${origin.name} onto tree-lined walkway`,
            detail: 'Follow green pedestrian signs toward civic district',
            distanceDisplay: '350 m',
            durationMinutes: 4,
            mode: 'walk',
            icon: 'directions_walk'
          },
          {
            id: 'w2',
            instruction: 'Take pedestrian underpass across North Bridge Road',
            detail: 'Air-conditioned underground linkway with escalator',
            distanceDisplay: '200 m',
            durationMinutes: 3,
            mode: 'walk',
            icon: 'stairs'
          },
          {
            id: 'w3',
            instruction: 'Continue through Esplanade Waterfront Promenade',
            detail: `Scenic reservoir path with open skyline view (~${calories} kcal burned)`,
            distanceDisplay: `${(distKm * 0.7).toFixed(1)} km`,
            durationMinutes: walkDuration - 9,
            mode: 'walk',
            icon: 'directions_walk'
          },
          {
            id: 'w4',
            instruction: `Arrive at destination: ${destination.name}`,
            detail: 'Entrance on your right',
            distanceDisplay: '100 m',
            durationMinutes: 2,
            mode: 'walk',
            icon: 'location_on'
          }
        ],
        polyline: mainPolyline,
        alternativesPolyline: altPolyline
      }
    ];
  }
}

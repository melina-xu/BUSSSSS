export type NavigationTab = 'plan' | 'live-map' | 'saved' | 'status' | 'arrivals' | 'community';

export interface LocationPoint {
  id: string;
  name: string;
  detail: string;
  lat: number;
  lng: number;
  type: 'mrt' | 'bus' | 'landmark' | 'current' | 'recent';
  code?: string; // Station code e.g. EW24 or Bus stop 03019
  lineCodes?: string[]; // e.g. ['EWL', 'NSL']
}

export type MRTLine = 'EWL' | 'NSL' | 'NEL' | 'CCL' | 'DTL' | 'TEL' | 'BPLRT' | 'SKLRT' | 'PGLRT';

export interface MRTStation {
  code: string;
  name: string;
  line: MRTLine;
  lat: number;
  lng: number;
  interchanges?: string[];
  nextTrainEastbound?: number; // minutes
  nextTrainWestbound?: number; // minutes
  status: 'normal' | 'crowded' | 'delayed' | 'maintenance';
}

export interface BusArrival {
  serviceNo: string;
  operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  nextBus: {
    etaMinutes: number;
    load: 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
    feature: 'WAB' | 'ORD'; // Wheelchair Accessible Bus
    type: 'SD' | 'DD' | 'BD'; // Single, Double, Bendy
  };
  nextBus2?: {
    etaMinutes: number;
    load: 'SEA' | 'SDA' | 'LSD';
    feature: 'WAB' | 'ORD';
    type: 'SD' | 'DD' | 'BD';
  };
  nextBus3?: {
    etaMinutes: number;
    load: 'SEA' | 'SDA' | 'LSD';
    feature: 'WAB' | 'ORD';
    type: 'SD' | 'DD' | 'BD';
  };
}

export interface BusStop {
  code: string;
  roadName: string;
  description: string;
  lat: number;
  lng: number;
  services: string[];
}

export interface RouteLeg {
  mode: 'WALK' | 'MRT' | 'BUS';
  line?: MRTLine;
  lineName?: string;
  lineColor?: string;
  serviceNo?: string;
  fromName: string;
  toName: string;
  fromCode?: string;
  toCode?: string;
  departureTime: string;
  arrivalTime: string;
  durationMins: number;
  distanceKm: number;
  numStops?: number;
  passedStops?: string[];
  crowdLevel: 'low' | 'moderate' | 'high';
  coordinates: [number, number][];
  instructions: string;
}

export interface JourneyOption {
  id: string;
  title: string;
  summary: string;
  totalDurationMins: number;
  totalWalkingMins: number;
  totalDistanceKm: number;
  fare: number; // in SGD
  departureTime: string;
  arrivalTime: string;
  co2SavingsKg: number;
  caloriesBurned: number;
  crowdIndex: 'low' | 'moderate' | 'high';
  legs: RouteLeg[];
  tags: string[]; // e.g. 'Fastest', 'Cheapest', 'Sheltered Path', 'Direct'
}

export interface WeatherAreaZone {
  id: string;
  name: string;
  region: 'Central' | 'North' | 'South' | 'East' | 'West';
  townName: string;
  lat: number;
  lng: number;
  radiusKm: number;
  condition: string;
  conditionCode: 'rain' | 'cloudy' | 'clear' | 'thunderstorm' | 'hazy';
  temp: number;
  rainfallMm: number;
  rainChance: number;
  humidity: number;
  windSpeedKmh: number;
  advisory?: string;
}

export interface SingaporeWeather {
  temperature: number;
  condition: string;
  conditionCode: 'rain' | 'cloudy' | 'clear' | 'thunderstorm' | 'hazy';
  humidity: number;
  rainfallMm: number;
  psi: number;
  uvIndex: number;
  windSpeedKmh: number;
  areaZones?: WeatherAreaZone[];
  regionForecasts: {
    region: 'Central' | 'North' | 'South' | 'East' | 'West';
    forecast: string;
    temp: number;
    rainChance: number;
  }[];
  hourlyForecast: {
    time: string;
    temp: number;
    condition: string;
    rainProb: number;
  }[];
  transitAdvisory?: string;
}

export interface ServiceAlert {
  id: string;
  line: MRTLine | 'BUS_NETWORK' | 'GENERAL';
  title: string;
  severity: 'normal' | 'minor' | 'critical' | 'planned';
  affectedStations?: string[];
  impactDescription: string;
  alternativeAdvice?: string;
  freeShuttleAvailable: boolean;
  updatedAt: string;
  statusText: string;
}

export interface SavedRoute {
  id: string;
  title: string;
  fromLocation: LocationPoint;
  toLocation: LocationPoint;
  iconType: 'home' | 'work' | 'gym' | 'favorite' | 'airport';
  typicalDurationMins: number;
  preferredMode: 'fastest' | 'mrt' | 'bus';
  liveEtaMins?: number;
  alertEnabled: boolean;
}

export interface UserAppSettings {
  concessionType: 'Adult' | 'Student' | 'Senior' | 'Workfare';
  routingPreference: 'fastest' | 'least_walking' | 'bus_only' | 'mrt_only';
  shelteredWalkwaysPriority: boolean;
  oneMapApiKey: string;
  ltaApiKey: string;
  highContrastMap: boolean;
  notificationsEnabled: boolean;
}

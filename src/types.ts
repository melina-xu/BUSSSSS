export type ThemeMode = 'light' | 'dark';

export type NavTab = 'dashboard' | 'nearby-stops' | 'saved-routes' | 'alerts' | 'weather-hub';

export type TransportMode = 'all' | 'bus' | 'subway' | 'train' | 'ferry';

export type TravelMode = 'transit' | 'car' | 'walk';

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  city?: string;
  coordinates: { x: number; y: number; lat?: number; lng?: number };
  category: 'current' | 'recent' | 'landmark' | 'mrt' | 'bus' | 'airport';
  icon: string;
}

export interface NavigationStep {
  id: string;
  instruction: string;
  detail?: string;
  distanceDisplay: string;
  durationMinutes: number;
  mode: 'walk' | 'mrt' | 'bus' | 'car';
  icon: string;
  lineBadge?: string;
  lineColor?: string;
  lineBg?: string;
  stopCount?: number;
  stopsList?: string[];
  departureTime?: string;
  arrivalTime?: string;
  isTransfer?: boolean;
}

export interface RouteOption {
  id: string;
  mode: TravelMode;
  title: string;
  viaSummary: string;
  durationMinutes: number;
  distanceKm: number;
  departureTime: string;
  arrivalTime: string;
  isFastest?: boolean;
  isRecommended?: boolean;
  cost?: string;
  carbonSavedKg?: number;
  trafficCondition?: 'fast' | 'moderate' | 'slow';
  steps: NavigationStep[];
  polyline: { x: number; y: number }[];
  transitBadges?: {
    label: string;
    type: 'mrt' | 'bus' | 'walk';
    color: string;
    bg: string;
  }[];
  alternativesPolyline?: { x: number; y: number }[];
}

export interface RouteArrival {
  routeNumber: string;
  routeName: string;
  subText?: string;
  primaryTime: string; // "Now", "Arr", "2m", "4 min", "8m", "No Service"
  secondaryTimes?: string[]; // ["4m", "12m"]
  status: 'on-time' | 'delayed' | 'critical' | 'arriving' | 'no-service';
  statusText?: string; // "On Time", "+2 min", "DELAYED", "No Service"
  occupancy?: 'seats-available' | 'standing' | 'full' | 'moderate';
  colorType?: 'primary' | 'secondary' | 'delayed' | 'critical' | 'subtle' | 'pink' | 'blue';
  customBadgeColor?: string;
  customBadgeTextColor?: string;
  platform?: string;
  direction?: string;
  live?: boolean;
}

export interface TransitStop {
  id: string;
  name: string;
  code: string;
  walkTimeMins: number;
  distanceMeters?: number;
  distanceDisplay: string; // "2 min walk", "3 min • Stop ID: 9482", "0.1 MI AWAY"
  temp: string;
  weatherIcon: string;
  coordinates: { x: number; y: number; lat?: number; lng?: number };
  routes: RouteArrival[];
  pinned?: boolean;
  starred?: boolean;
  type?: 'bus' | 'subway' | 'multimodal' | 'ferry';
  description?: string;
  totalActiveRoutes?: number;
}

export interface SavedRoute {
  id: string;
  title: string;
  routeNumber: string;
  from: string;
  to: string;
  nextArrival: string;
  status: 'on-time' | 'delayed' | 'arriving';
  statusBadge: string;
  scheduleSummary: string;
  frequency: string;
  stopsCount: number;
  favorite: boolean;
  colorType: 'primary' | 'secondary' | 'tertiary';
}

export interface NetworkAlert {
  id: string;
  category: 'severe' | 'moderate' | 'major-delay' | 'reroute' | 'info' | 'advisory' | 'news';
  title: string;
  summary: string;
  timeAgo: string;
  validUntil?: string;
  affectedRoutes: string[];
  skippedStops?: string[];
  actionLinkText?: string;
  type: 'transit' | 'weather' | 'schedule' | 'general';
}

export interface AlertNotificationSetting {
  id: string;
  routeNumber: string;
  destination: string;
  triggerDescription: string;
  enabled: boolean;
  timeWindow?: string;
}

export interface WeatherData {
  city: string;
  temp: number;
  unit: 'C' | 'F';
  condition: string;
  icon: string;
  impactSummary: string;
  hourlyPoints: { time: string; temp: number; pop: number }[];
  rainProbability: { label: string; prob: number; highlight?: boolean }[];
  activeAdvisories: { title: string; desc: string; severity: 'warning' | 'info' }[];
}

export interface StopScheduleEntry {
  departureTime: string;
  routeNumber: string;
  destination: string;
  platform: string;
  status: 'On Time' | 'Delayed' | 'Cancelled' | 'Boarding';
  delayMins?: number;
}

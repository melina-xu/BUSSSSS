export type ThemeMode = 'light' | 'dark';

export type NavTab = 'buses' | 'favorites' | 'nearby' | 'carparks' | 'trains';

export interface BusArrivalInfo {
  serviceNo: string;
  operator: string;
  nextBus: {
    arrivalMins: number | null; // e.g. 0 (Arr), 2, 8, null
    arrivalText: string; // "Arr", "2 min", "15 min", "No est."
    load: 'SEA' | 'SDA' | 'LSD' | string; // Seats Available, Standing, Limited Standing
    loadLabel: string;
    loadColor: 'green' | 'amber' | 'red';
    type: 'SD' | 'DD' | 'BD' | string;
    typeLabel: string;
    feature?: string; // WAB
  };
  nextBus2?: {
    arrivalMins: number | null;
    arrivalText: string;
    load: string;
    loadLabel: string;
    loadColor: 'green' | 'amber' | 'red';
    type: string;
    typeLabel: string;
  };
  nextBus3?: {
    arrivalMins: number | null;
    arrivalText: string;
    load: string;
    loadLabel: string;
    loadColor: 'green' | 'amber' | 'red';
    type: string;
    typeLabel: string;
  };
}

export interface BusStopDetail {
  code: string;
  name: string;
  roadName: string;
  district?: string;
  lat?: number;
  lng?: number;
  services: string[];
}

export interface FavoriteItem {
  id: string; // e.g. "83139" or "83139-15"
  type: 'stop' | 'service';
  busStopCode: string;
  busStopName: string;
  roadName: string;
  serviceNo?: string;
  addedAt: number;
}

export interface MrtLineStatus {
  id: string;
  name: string;
  code: string; // NSL, EWL, CCL, DTL, TEL, NEL, BPLRT
  color: string;
  bgLight: string;
  status: 'Normal' | 'Minor Delay' | 'Disrupted';
  message: string;
  direction?: string;
}


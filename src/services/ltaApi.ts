import { BusArrivalInfo } from '../types';

/**
 * Client-side service to communicate with backend /api/lta/* routes.
 * No API credentials are stored or handled in the client.
 */

export interface LTANextBus {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string; // ISO 8601 string, e.g. "2026-08-27T15:42:00+08:00"
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string; // Seats Available, Standing Available, Limited Standing
  Feature?: 'WAB' | string; // Wheelchair Accessible Bus
  Type?: 'SD' | 'DD' | 'BD' | string; // Single Deck, Double Deck, Bendy
}

export interface LTABusServiceArrival {
  ServiceNo: string;
  Operator: string;
  NextBus?: LTANextBus;
  NextBus2?: LTANextBus;
  NextBus3?: LTANextBus;
}

export interface LTABusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: LTABusServiceArrival[];
}

export function parseLtaBus(nextBus?: LTANextBus) {
  if (!nextBus || !nextBus.EstimatedArrival) {
    return {
      arrivalMins: null,
      arrivalText: 'No est.',
      load: 'SEA',
      loadLabel: 'No info',
      loadColor: 'green' as const,
      type: 'SD',
      typeLabel: 'Single Deck',
      feature: undefined
    };
  }

  const mins = getMinutesUntil(nextBus.EstimatedArrival);
  const text = formatArrivalText(mins);

  let loadLabel = 'Seats Available';
  let loadColor: 'green' | 'amber' | 'red' = 'green';
  if (nextBus.Load === 'SDA') {
    loadLabel = 'Standing Available';
    loadColor = 'amber';
  } else if (nextBus.Load === 'LSD') {
    loadLabel = 'Crowded / Limited Standing';
    loadColor = 'red';
  }

  let typeLabel = 'Single Deck';
  if (nextBus.Type === 'DD') typeLabel = 'Double Deck';
  if (nextBus.Type === 'BD') typeLabel = 'Bendy Bus';

  return {
    arrivalMins: mins,
    arrivalText: text,
    load: nextBus.Load || 'SEA',
    loadLabel,
    loadColor,
    type: nextBus.Type || 'SD',
    typeLabel,
    feature: nextBus.Feature
  };
}

export function mapLtaToBusArrivalInfo(raw: LTABusArrivalResponse): BusArrivalInfo[] {
  if (!raw.Services || !Array.isArray(raw.Services)) return [];
  return raw.Services.map((srv) => ({
    serviceNo: srv.ServiceNo,
    operator: srv.Operator || 'SBS / SMRT / Tower Transit',
    nextBus: parseLtaBus(srv.NextBus),
    nextBus2: srv.NextBus2?.EstimatedArrival ? parseLtaBus(srv.NextBus2) : undefined,
    nextBus3: srv.NextBus3?.EstimatedArrival ? parseLtaBus(srv.NextBus3) : undefined
  }));
}


export interface LTACarparkItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // "1.282 103.858"
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y' | string; // Cars, Heavy, Motorcycles
  Agency: 'HDB' | 'LTA' | 'URA' | string;
}

export interface LTACarparksResponse {
  'odata.metadata'?: string;
  value: LTACarparkItem[];
}

export interface LTATrafficIncident {
  Type: string;
  Latitude: number;
  Longitude: number;
  Message: string;
}

export interface LTATrafficIncidentsResponse {
  'odata.metadata'?: string;
  value: LTATrafficIncident[];
}

export interface LTATrainAlert {
  Status: number; // 1: Normal, 2: Disrupted
  Line?: string;
  Direction?: string;
  Stations?: string;
  FreePublicBus?: string;
  FreeMRTShuttle?: string;
  Message?: string;
}

export interface LTATrainAlertsResponse {
  'odata.metadata'?: string;
  value: LTATrainAlert[];
}

export interface LTAStatusResponse {
  configured: boolean;
  endpoints: string[];
}

/** Calculate minutes until arrival from ISO string */
export function getMinutesUntil(isoString?: string): number | null {
  if (!isoString) return null;
  const targetTime = new Date(isoString).getTime();
  if (isNaN(targetTime)) return null;
  const now = Date.now();
  const diffMs = targetTime - now;
  const mins = Math.round(diffMs / 60000);
  return mins;
}

export function formatArrivalText(mins: number | null): string {
  if (mins === null) return 'No est.';
  if (mins <= 0) return 'Arr';
  if (mins === 1) return '1 min';
  return `${mins} min`;
}

export const ltaApi = {
  async getStatus(): Promise<LTAStatusResponse> {
    try {
      const res = await fetch('/api/lta/status');
      if (!res.ok) throw new Error('Status failed');
      return await res.json();
    } catch {
      return { configured: false, endpoints: [] };
    }
  },

  async getBusArrivals(busStopCode: string, serviceNo?: string): Promise<{ data?: LTABusArrivalResponse; error?: string }> {
    try {
      let url = `/api/lta/bus-arrival?busStopCode=${encodeURIComponent(busStopCode)}`;
      if (serviceNo) url += `&serviceNo=${encodeURIComponent(serviceNo)}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return { error: errJson.error || `HTTP ${res.status}` };
      }
      const data = await res.json();
      return { data };
    } catch (e: any) {
      return { error: e?.message || 'Network error' };
    }
  },

  async getCarparks(): Promise<{ data?: LTACarparksResponse; error?: string }> {
    try {
      const res = await fetch('/api/lta/carparks');
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return { error: errJson.error || `HTTP ${res.status}` };
      }
      const data = await res.json();
      return { data };
    } catch (e: any) {
      return { error: e?.message || 'Network error' };
    }
  },

  async getTrafficIncidents(): Promise<{ data?: LTATrafficIncidentsResponse; error?: string }> {
    try {
      const res = await fetch('/api/lta/traffic-incidents');
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return { error: errJson.error || `HTTP ${res.status}` };
      }
      const data = await res.json();
      return { data };
    } catch (e: any) {
      return { error: e?.message || 'Network error' };
    }
  },

  async getTrainAlerts(): Promise<{ data?: LTATrainAlertsResponse; error?: string }> {
    try {
      const res = await fetch('/api/lta/train-alerts');
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return { error: errJson.error || `HTTP ${res.status}` };
      }
      const data = await res.json();
      return { data };
    } catch (e: any) {
      return { error: e?.message || 'Network error' };
    }
  }
};

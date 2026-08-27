import { BusStopDetail, MrtLineStatus, BusArrivalInfo } from '../types';

export const SINGAPORE_BUS_STOPS: BusStopDetail[] = [
  {
    code: '83139',
    name: 'Opp Parkway Parade',
    roadName: 'Marine Parade Rd',
    district: 'Marine Parade / East Coast',
    lat: 1.3008,
    lng: 103.9056,
    services: ['15', '31', '36', '43', '48', '196', '197', '853M', '966']
  },
  {
    code: '03011',
    name: 'Marina Bay Financial Ctr',
    roadName: 'Marina Blvd',
    district: 'Marina Bay / Downtown',
    lat: 1.2796,
    lng: 103.8545,
    services: ['97', '97e', '106', '133', '400', '513', '651', '653', '657']
  },
  {
    code: '03059',
    name: 'One Raffles Quay',
    roadName: 'Raffles Quay',
    district: 'Raffles Place / CBD',
    lat: 1.2818,
    lng: 103.8521,
    services: ['10', '10e', '57', '70', '100', '107', '130', '131', '167', '196']
  },
  {
    code: '01012',
    name: 'Hotel Grand Pacific',
    roadName: 'Victoria St',
    district: 'Bugis / Bras Basah',
    lat: 1.2968,
    lng: 103.8529,
    services: ['2', '7', '12', '12e', '32', '33', '51', '61', '63', '80', '130', '133', '145', '175', '197']
  },
  {
    code: '04179',
    name: 'Raffles Hotel',
    roadName: 'Bras Basah Rd',
    district: 'City Hall',
    lat: 1.2947,
    lng: 103.8541,
    services: ['14', '14e', '16', '16M', '36', '77', '106', '111', '128', '130', '131', '133', '162', '167', '857']
  },
  {
    code: '10018',
    name: 'Shenton House',
    roadName: 'Shenton Way',
    district: 'Tanjong Pagar / Shenton Way',
    lat: 1.2785,
    lng: 103.8499,
    services: ['57', '131', '167', '186', '400', '700', '970']
  },
  {
    code: '09048',
    name: 'Orchard Stn / Lucky Plaza',
    roadName: 'Orchard Rd',
    district: 'Orchard',
    lat: 1.3044,
    lng: 103.8339,
    services: ['7', '14', '16', '36', '65', '77', '106', '111', '123', '124', '143', '162', '167', '174', '190', '502']
  },
  {
    code: '28009',
    name: 'Jurong East Bus Interchange',
    roadName: 'Jurong Gateway Rd',
    district: 'Jurong East',
    lat: 1.3331,
    lng: 103.7423,
    services: ['41', '49', '51', '52', '66', '78', '79', '97', '98', '105', '143', '160', '183', '197', '333', '334', '335', '506']
  },
  {
    code: '65009',
    name: 'Tampines Bus Interchange',
    roadName: 'Tampines Central 1',
    district: 'Tampines',
    lat: 1.3533,
    lng: 103.9452,
    services: ['3', '4', '8', '10', '19', '20', '23', '28', '29', '31', '37', '38', '46', '65', '67', '68', '69', '72', '81', '291', '292', '293']
  },
  {
    code: '54009',
    name: 'Bishan Bus Interchange',
    roadName: 'Bishan St 13',
    district: 'Bishan',
    lat: 1.3503,
    lng: 103.8488,
    services: ['50', '52', '53', '54', '55', '56', '57', '58', '59', '410G', '410W']
  },
  {
    code: '95129',
    name: 'Changi Airport PTB3',
    roadName: 'Airport Blvd',
    district: 'Changi Airport',
    lat: 1.3551,
    lng: 103.9864,
    services: ['24', '27', '34', '36', '53', '110', '858']
  },
  {
    code: '46009',
    name: 'Woodlands Integrated Transport Hub',
    roadName: 'Woodlands Square',
    district: 'Woodlands',
    lat: 1.4368,
    lng: 103.7865,
    services: ['161', '168', '169', '178', '187', '856', '900', '901', '902', '903', '904', '911', '912', '913', '925', '950', '960', '961', '962', '963', '964', '965', '966', '969']
  }
];

export const MRT_LINES: MrtLineStatus[] = [
  {
    id: 'nsl',
    name: 'North-South Line',
    code: 'NSL',
    color: '#d42e12',
    bgLight: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400',
    status: 'Normal',
    direction: 'Jurong East ↔ Marina South Pier',
    message: 'Regular peak/off-peak headway (2-4 mins). All stations operational.'
  },
  {
    id: 'ewl',
    name: 'East-West Line',
    code: 'EWL',
    color: '#009645',
    bgLight: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    status: 'Normal',
    direction: 'Pasir Ris / Changi Airport ↔ Tuas Link',
    message: 'Operating normally. Headways at ~3 mins.'
  },
  {
    id: 'ccl',
    name: 'Circle Line',
    code: 'CCL',
    color: '#fa9e0d',
    bgLight: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    status: 'Normal',
    direction: 'Dhoby Ghaut / Marina Bay ↔ HarbourFront',
    message: 'Full CBTC signalling active. Normal train frequencies.'
  },
  {
    id: 'dtl',
    name: 'Downtown Line',
    code: 'DTL',
    color: '#005ec4',
    bgLight: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
    status: 'Normal',
    direction: 'Bukit Panjang ↔ Expo',
    message: 'Normal operation across all 34 stations.'
  },
  {
    id: 'tel',
    name: 'Thomson-East Coast Line',
    code: 'TEL',
    color: '#9d5b25',
    bgLight: 'bg-amber-800/10 border-amber-800/30 text-amber-800 dark:text-amber-300',
    status: 'Normal',
    direction: 'Woodlands North ↔ Bayshore',
    message: 'Stage 4 passenger service operational. Smooth headways.'
  },
  {
    id: 'nel',
    name: 'North East Line',
    code: 'NEL',
    color: '#8f4199',
    bgLight: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
    status: 'Normal',
    direction: 'HarbourFront ↔ Punggol Coast',
    message: 'Normal passenger operations.'
  },
  {
    id: 'bplrt',
    name: 'Bukit Panjang LRT',
    code: 'BPLRT',
    color: '#748477',
    bgLight: 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400',
    status: 'Normal',
    direction: 'Choa Chu Kang ↔ Bukit Panjang Loop',
    message: 'Dual-loop service operational.'
  },
  {
    id: 'splrt',
    name: 'Sengkang & Punggol LRT',
    code: 'SPLRT',
    color: '#748477',
    bgLight: 'bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400',
    status: 'Normal',
    direction: 'East & West Loops',
    message: 'Normal loop operations.'
  }
];

export function getFallbackArrivals(busStopCode: string): BusArrivalInfo[] {
  const stop = SINGAPORE_BUS_STOPS.find((s) => s.code === busStopCode);
  const services = stop ? stop.services : ['15', '31', '36', '43', '48', '196'];

  const loads: Array<'SEA' | 'SDA' | 'LSD'> = ['SEA', 'SEA', 'SDA', 'SEA', 'LSD', 'SEA'];
  const types: Array<'SD' | 'DD' | 'BD'> = ['DD', 'SD', 'DD', 'DD', 'SD', 'DD'];

  return services.map((srv, idx) => {
    const mins1 = (idx * 3) % 11;
    const mins2 = mins1 + 7 + ((idx * 2) % 6);
    const mins3 = mins2 + 10 + ((idx * 3) % 8);

    const load1 = loads[idx % loads.length];
    const load2 = loads[(idx + 1) % loads.length];
    const load3 = 'SEA';

    const getLoadMeta = (load: 'SEA' | 'SDA' | 'LSD' | string) => {
      if (load === 'SEA') return { label: 'Seats Available', color: 'green' as const };
      if (load === 'SDA') return { label: 'Standing Available', color: 'amber' as const };
      return { label: 'Crowded / Limited Standing', color: 'red' as const };
    };

    const getTypeMeta = (type: string) => {
      if (type === 'DD') return 'Double Deck';
      if (type === 'BD') return 'Bendy Bus';
      return 'Single Deck';
    };

    const l1 = getLoadMeta(load1);
    const l2 = getLoadMeta(load2);
    const l3 = getLoadMeta(load3);

    return {
      serviceNo: srv,
      operator: ['SBST', 'SMRT', 'Tower Transit', 'Go-Ahead Singapore'][idx % 4],
      nextBus: {
        arrivalMins: mins1,
        arrivalText: mins1 === 0 ? 'Arr' : mins1 === 1 ? '1 min' : `${mins1} min`,
        load: load1,
        loadLabel: l1.label,
        loadColor: l1.color,
        type: types[idx % types.length],
        typeLabel: getTypeMeta(types[idx % types.length]),
        feature: 'WAB'
      },
      nextBus2: {
        arrivalMins: mins2,
        arrivalText: `${mins2} min`,
        load: load2,
        loadLabel: l2.label,
        loadColor: l2.color,
        type: types[(idx + 1) % types.length],
        typeLabel: getTypeMeta(types[(idx + 1) % types.length])
      },
      nextBus3: {
        arrivalMins: mins3,
        arrivalText: `${mins3} min`,
        load: load3,
        loadLabel: l3.label,
        loadColor: l3.color,
        type: types[(idx + 2) % types.length],
        typeLabel: getTypeMeta(types[(idx + 2) % types.length])
      }
    };
  });
}

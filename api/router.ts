import { Router } from 'express';
import { handleBusArrival, handleTrafficIncidents, handleTrainAlerts } from './lta';
import { createWeatherProxyHandler, handleWeatherOverview } from './weather';
import { handleOneMapRoute, handleOneMapSearch } from './onemap';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SG Transit API Gateway',
  });
});

// LTA DataMall v3 Bus Arrival & Alerts
apiRouter.get('/lta/bus-arrival', handleBusArrival);
apiRouter.get('/lta/traffic-incidents', handleTrafficIncidents);
apiRouter.get('/lta/train-alerts', handleTrainAlerts);

// Real-Time Singapore Weather (data.gov.sg v2 endpoints)
apiRouter.get('/weather/overview', handleWeatherOverview);
apiRouter.get('/weather/two-hr-forecast', createWeatherProxyHandler('two-hr-forecast'));
apiRouter.get('/weather/twenty-four-hr-forecast', createWeatherProxyHandler('twenty-four-hr-forecast'));
apiRouter.get('/weather/four-day-outlook', createWeatherProxyHandler('four-day-outlook'));
apiRouter.get('/weather/air-temperature', createWeatherProxyHandler('air-temperature'));
apiRouter.get('/weather/rainfall', createWeatherProxyHandler('rainfall'));
apiRouter.get('/weather/psi', createWeatherProxyHandler('psi'));
apiRouter.get('/weather/pm25', createWeatherProxyHandler('pm25'));
apiRouter.get('/weather/uv', createWeatherProxyHandler('uv'));
apiRouter.get('/weather/relative-humidity', createWeatherProxyHandler('relative-humidity'));
apiRouter.get('/weather/wind-speed', createWeatherProxyHandler('wind-speed'));

// OneMap Routing & Geocoding
apiRouter.get('/onemap/route', handleOneMapRoute);
apiRouter.get('/onemap/search', handleOneMapSearch);

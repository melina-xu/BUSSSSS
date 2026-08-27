import { Request, Response } from 'express';

/**
 * LTA DataMall v3 API Handler
 * 
 * Endpoints:
 * - Bus Arrivals (v3): https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=...&ServiceNo=...
 * - Traffic Incidents: https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents
 * - Train Service Alerts: https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts
 */

export async function handleBusArrival(req: Request, res: Response): Promise<void> {
  const accountKey = process.env.LTA_ACCOUNT_KEY;

  if (!accountKey) {
    res.status(500).json({ error: 'credential not configured' });
    return;
  }

  const busStopCode = req.query.BusStopCode as string;
  const serviceNo = req.query.ServiceNo as string | undefined;

  if (!busStopCode) {
    res.status(400).json({ error: 'BusStopCode query parameter is required' });
    return;
  }

  try {
    let url = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `LTA DataMall responded with status ${response.status}`,
        statusText: response.statusText,
      });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({
      error: 'Failed to fetch from LTA DataMall API',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function handleTrafficIncidents(_req: Request, res: Response): Promise<void> {
  const accountKey = process.env.LTA_ACCOUNT_KEY;

  if (!accountKey) {
    res.status(500).json({ error: 'credential not configured' });
    return;
  }

  try {
    const url = 'https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `LTA DataMall responded with status ${response.status}`,
        statusText: response.statusText,
      });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({
      error: 'Failed to fetch Traffic Incidents from LTA DataMall',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function handleTrainAlerts(_req: Request, res: Response): Promise<void> {
  const accountKey = process.env.LTA_ACCOUNT_KEY;

  if (!accountKey) {
    res.status(500).json({ error: 'credential not configured' });
    return;
  }

  try {
    const url = 'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `LTA DataMall responded with status ${response.status}`,
        statusText: response.statusText,
      });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({
      error: 'Failed to fetch Train Service Alerts from LTA DataMall',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

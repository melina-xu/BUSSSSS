import { Request, Response } from 'express';

/**
 * OneMap Routing & Geocoding Service
 * 
 * Endpoint:
 * https://www.onemap.gov.sg/api/public/routingsvc/route?start=1.320981,103.844150&end=1.326762,103.8559&routeType=walk
 * 
 * Headers:
 * Authorization: process.env.ONEMAP_TOKEN
 */

export async function handleOneMapRoute(req: Request, res: Response): Promise<void> {
  const token = process.env.ONEMAP_TOKEN || process.env.ONEMAP_API_TOKEN;

  if (!token) {
    res.status(500).json({ error: 'credential not configured' });
    return;
  }

  const { start, end, routeType = 'walk' } = req.query as {
    start?: string;
    end?: string;
    routeType?: string;
  };

  if (!start || !end) {
    res.status(400).json({ error: 'start and end query parameters are required (e.g. start=1.3209,103.8441&end=1.3267,103.8559)' });
    return;
  }

  try {
    const url = `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&routeType=${encodeURIComponent(routeType)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      // If OneMap returns 401/403 or routing error
      res.status(response.status).json({
        error: `OneMap API responded with status ${response.status}`,
        statusText: response.statusText,
      });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({
      error: 'Failed to fetch route from OneMap API',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function handleOneMapSearch(req: Request, res: Response): Promise<void> {
  const searchVal = req.query.searchVal as string;

  if (!searchVal || searchVal.trim().length === 0) {
    res.status(400).json({ error: 'searchVal parameter is required' });
    return;
  }

  try {
    const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(searchVal)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `OneMap Search responded with ${response.status}`,
      });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(502).json({
      error: 'Failed to query OneMap search API',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

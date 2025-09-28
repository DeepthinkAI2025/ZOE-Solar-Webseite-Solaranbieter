import { google } from 'googleapis';

const SEARCH_SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

function normalisePrivateKey(key) {
  return key ? key.replace(/\\n/g, '\n') : key;
}

function subtractDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export async function fetchSearchConsoleData(apiKeys) {
  const config = apiKeys?.googleServiceAccount ?? {};
  if (!config.clientEmail || !config.privateKey || !config.propertyUrl) {
    return {
      status: 'missing-config',
      message: 'Search Console benötigt Service-Account (clientEmail, privateKey) sowie propertyUrl.'
    };
  }

  try {
    const jwt = new google.auth.JWT(
      config.clientEmail,
      undefined,
      normalisePrivateKey(config.privateKey),
      SEARCH_SCOPES
    );

    await jwt.authorize();

    const webmasters = google.webmasters({ version: 'v3', auth: jwt });
    const endDate = new Date();
    const startDate = subtractDays(endDate, 30);

    const [pagesResponse, queriesResponse, pageQueryResponse] = await Promise.all([
      webmasters.searchanalytics.query({
        siteUrl: config.propertyUrl,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['page'],
          rowLimit: 10,
          startRow: 0,
          dataState: 'final'
        }
      }),
      webmasters.searchanalytics.query({
        siteUrl: config.propertyUrl,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['query'],
          rowLimit: 10,
          startRow: 0,
          dataState: 'final'
        }
      }),
      webmasters.searchanalytics.query({
        siteUrl: config.propertyUrl,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['query', 'page'],
          rowLimit: 25,
          startRow: 0,
          dataState: 'final'
        }
      })
    ]);

    const pageRows = pagesResponse.data.rows ?? [];
    const queryRows = queriesResponse.data.rows ?? [];
    const pageQueryRows = pageQueryResponse.data.rows ?? [];

    const totals = pageRows.reduce(
      (acc, row) => {
        const clicks = row.clicks ?? 0;
        const impressions = row.impressions ?? 0;
        const position = row.position ?? 0;
        acc.clicks += clicks;
        acc.impressions += impressions;
        acc.positions.push(position);
        return acc;
      },
      { clicks: 0, impressions: 0, positions: [] }
    );

    const avgPosition = totals.positions.length
      ? totals.positions.reduce((sum, value) => sum + value, 0) / totals.positions.length
      : null;

    const topTenRatio = pageRows.length
      ? pageRows.filter((row) => (row.position ?? 100) <= 10).length / pageRows.length
      : null;

    return {
      status: 'ok',
      pages: pageRows,
      queries: queryRows,
      pageQuery: pageQueryRows,
      summary: {
        clicks: totals.clicks,
        impressions: totals.impressions,
        averagePosition: avgPosition,
        topTenRatio
      }
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      details: error.stack
    };
  }
}

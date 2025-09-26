import { google } from 'googleapis';

const ANALYTICS_SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

function normalisePrivateKey(key) {
  return key ? key.replace(/\\n/g, '\n') : key;
}

function formatMonthKey(row) {
  const year = row.dimensionValues?.[0]?.value ?? '';
  const month = row.dimensionValues?.[1]?.value ?? '';
  return `${year}-${month.padStart(2, '0')}`;
}

export async function fetchAnalyticsData(apiKeys) {
  const config = apiKeys?.googleServiceAccount ?? {};
  if (!config.clientEmail || !config.privateKey || !config.analyticsPropertyId) {
    return {
      status: 'missing-config',
      message: 'Analytics benötigt Service-Account (clientEmail, privateKey) sowie analyticsPropertyId.'
    };
  }

  try {
    const jwt = new google.auth.JWT(
      config.clientEmail,
      undefined,
      normalisePrivateKey(config.privateKey),
      ANALYTICS_SCOPES
    );

    await jwt.authorize();

    const analyticsData = google.analyticsdata('v1beta');
    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - 5);

    const response = await analyticsData.properties.runReport({
      property: `properties/${config.analyticsPropertyId}`,
      requestBody: {
        dateRanges: [
          {
            startDate: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-01`,
            endDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
          }
        ],
        dimensions: [
          { name: 'year' },
          { name: 'month' }
        ],
        metrics: [
          { name: 'totalUsers' },
          { name: 'newUsers' }
        ],
        orderBys: [
          {
            dimension: {
              orderType: 'NUMERIC',
              dimensionName: 'year'
            }
          },
          {
            dimension: {
              orderType: 'NUMERIC',
              dimensionName: 'month'
            }
          }
        ]
      }
    });

    const rows = response.data.rows ?? [];
    const monthlyVisitors = rows.map((row) => {
      const key = formatMonthKey(row);
      return {
        month: key,
        totalUsers: Number(row.metricValues?.[0]?.value ?? 0),
        newUsers: Number(row.metricValues?.[1]?.value ?? 0)
      };
    });

    return {
      status: 'ok',
      monthlyVisitors
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
      details: error.stack
    };
  }
}

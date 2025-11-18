import axios from 'axios';

const AHREFS_ENDPOINT = 'https://apiv2.ahrefs.com';

export async function fetchAhrefsData(apiKeys) {
  const config = apiKeys?.ahrefs ?? {};
  if (!config.apiToken || !config.target) {
    return {
      status: 'missing-config',
      message: 'Ahrefs benötigt apiToken und target (Domain oder URL).'
    };
  }

  try {
    const params = new URLSearchParams({
      token: config.apiToken,
      from: 'backlinks_new_lost',
      target: config.target,
      mode: 'domain',
      output: 'json',
      order_by: 'date:desc',
      limit: '50'
    });

    const [{ data }, domainMetricsResponse] = await Promise.all([
      axios.get(`${AHREFS_ENDPOINT}`, {
        params
      }),
      axios.get(`${AHREFS_ENDPOINT}`, {
        params: {
          token: config.apiToken,
          from: 'domain_rating',
          target: config.target,
          mode: 'domain',
          output: 'json'
        }
      })
    ]);

    const entries = data?.refpages ?? [];
    const summary = entries.reduce(
      (acc, entry) => {
        if (entry.type === 'new') acc.newBacklinks += 1;
        if (entry.type === 'lost') acc.lostBacklinks += 1;
        return acc;
      },
      { newBacklinks: 0, lostBacklinks: 0 }
    );

    const metrics = domainMetricsResponse.data?.metrics ?? {};
    summary.domainRating = metrics.domain_rating ? Number(metrics.domain_rating) : null;
    summary.totalBacklinks = metrics.backlinks ? Number(metrics.backlinks) : null;

    return {
      status: 'ok',
      entries,
      summary
    };
  } catch (error) {
    const responseData = error.response?.data;
    return {
      status: 'error',
      message: error.message,
      details: responseData ?? null
    };
  }
}

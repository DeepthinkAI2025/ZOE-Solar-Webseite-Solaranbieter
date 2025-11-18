import express from 'express';
const router = express.Router();

// Test-Daten für Dashboard Analytics
let metrics = {
  customers: {
    total: 1247,
    new: 45,
    active: 892,
    leads: 310,
    retention: 0.87
  },
  projects: {
    total: 234,
    completed: 187,
    inProgress: 28,
    planned: 19,
    avgValue: 125000
  },
  revenue: {
    monthly: [
      { month: '2024-01', amount: 2500000 },
      { month: '2024-02', amount: 2800000 },
      { month: '2024-03', amount: 3200000 },
      { month: '2024-04', amount: 2900000 },
      { month: '2024-05', amount: 3500000 },
      { month: '2024-06', amount: 3800000 },
      { month: '2024-07', amount: 4100000 },
      { month: '2024-08', amount: 3900000 },
      { month: '2024-09', amount: 4200000 },
      { month: '2024-10', amount: 4500000 }
    ],
    total: 31200000,
    growth: 0.15
  },
  leads: {
    total: 892,
    converted: 341,
    conversion: 0.382,
    sources: {
      website: 456,
      referral: 234,
      sales: 156,
      exhibition: 46
    },
    regions: {
      'Berlin': 234,
      'Hamburg': 189,
      'München': 167,
      'Köln': 145,
      'Frankfurt': 127,
      'Stuttgart': 89,
      'Düsseldorf': 76,
      'Anderes': 34
    }
  },
  performance: {
    websiteVisitors: 45678,
    conversionRate: 0.023,
    avgProjectSize: 125000,
    avgDealTime: 45
  },
  seo: {
    keywordRankings: 234,
    organicTraffic: 12345,
    backlinks: 89,
    domainAuthority: 45
  }
};

// Middleware für Authentifizierung
function requireAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.CONTENT_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }
  next();
}

// ============= DASHBOARD METRICS API =============

// GET - Haupt-Dashboard-Metriken
router.get('/dashboard/metrics', (req, res) => {
  const { timeframe = 'month', region } = req.query;

  // Simuliere Zeitrahmen-basierte Daten
  const timeMultiplier = timeframe === 'year' ? 12 : timeframe === 'week' ? 0.25 : 1;

  res.json({
    metrics: {
      customers: {
        total: metrics.customers.total,
        new: Math.round(metrics.customers.new * timeMultiplier),
        active: Math.round(metrics.customers.active * timeMultiplier),
        leads: Math.round(metrics.customers.leads * timeMultiplier),
        retention: metrics.customers.retention
      },
      projects: {
        total: metrics.projects.total,
        completed: Math.round(metrics.projects.completed * timeMultiplier),
        inProgress: Math.round(metrics.projects.inProgress * timeMultiplier),
        planned: Math.round(metrics.projects.planned * timeMultiplier),
        avgValue: metrics.projects.avgValue
      },
      revenue: {
        monthly: metrics.revenue.monthly.slice(-6 * timeMultiplier),
        total: Math.round(metrics.revenue.total * timeMultiplier),
        growth: metrics.revenue.growth
      },
      leads: {
        total: Math.round(metrics.leads.total * timeMultiplier),
        converted: Math.round(metrics.leads.converted * timeMultiplier),
        conversion: metrics.leads.conversion,
        sources: {
          website: Math.round(metrics.leads.sources.website * timeMultiplier),
          referral: Math.round(metrics.leads.sources.referral * timeMultiplier),
          sales: Math.round(metrics.leads.sources.sales * timeMultiplier),
          exhibition: Math.round(metrics.leads.sources.exhibition * timeMultiplier)
        }
      },
      performance: {
        websiteVisitors: Math.round(metrics.performance.websiteVisitors * timeMultiplier),
        conversionRate: metrics.performance.conversionRate,
        avgProjectSize: metrics.performance.avgProjectSize,
        avgDealTime: metrics.performance.avgDealTime
      },
      seo: metrics.seo,
      timeframe
    }
  });
});

// GET - Kunden-Metriken
router.get('/dashboard/customers', (req, res) => {
  const { status, region, customerType } = req.query;

  let filteredMetrics = { ...metrics.customers };

  // Simuliert gefilterte Metriken
  if (status) {
    switch (status) {
      case 'active':
        filteredMetrics.active = Math.round(filteredMetrics.total * 0.71);
        break;
      case 'lead':
        filteredMetrics.leads = Math.round(filteredMetrics.total * 0.25);
        break;
    }
  }

  if (customerType) {
    switch (customerType) {
      case 'commercial':
        filteredMetrics.total = Math.round(filteredMetrics.total * 0.75);
        break;
      case 'private':
        filteredMetrics.total = Math.round(filteredMetrics.total * 0.25);
        break;
    }
  }

  res.json({
    customers: filteredMetrics,
    trends: {
      newCustomersLast30Days: 45,
      churnRate: 0.13,
      avgLifetimeValue: 145000
    }
  });
});

// GET - Projekt-Metriken
router.get('/dashboard/projects', (req, res) => {
  const { status, type, timeRange = 'quarter' } = req.query;

  res.json({
    projects: metrics.projects,
    details: {
      completionRate: 0.80,
      avgDuration: 89, // Tage
      types: {
        'Dachanlage': 145,
        'Freiflächenanlage': 67,
        'Carport': 15,
        'Agri-PV': 7
      },
      timeline: [
        { month: '2024-08', completed: 18, started: 22 },
        { month: '2024-09', completed: 23, started: 26 },
        { month: '2024-10', completed: 27, started: 31 }
      ]
    }
  });
});

// GET - Umsatz-Metriken
router.get('/dashboard/revenue', (req, res) => {
  const { period = 'monthly', year = '2024' } = req.query;

  res.json({
    revenue: metrics.revenue,
    breakdown: {
      byMonth: metrics.revenue.monthly,
      byCategory: {
        'Module': 12400000,
        'Wechselrichter': 8900000,
        'Speicher': 5600000,
        'Service': 2100000,
        'Sonstiges': 2200000
      },
      byRegion: {
        'Berlin': 8900000,
        'Hamburg': 6700000,
        'München': 5400000,
        'Anderes': 10200000
      }
    },
    projections: {
      nextMonth: 4600000,
      quarter: 13800000,
      year: 55000000
    }
  });
});

// GET - Lead-Metriken
router.get('/dashboard/leads', (req, res) => {
  const { status, source, timeRange = 'month' } = req.query;

  res.json({
    leads: metrics.leads,
    pipeline: {
      new: 234,
      qualified: 156,
      proposal: 89,
      negotiation: 45,
      closed: 34
    },
    conversionRates: {
      websiteToLead: 0.045,
      leadToOpportunity: 0.62,
      opportunityToClose: 0.38,
      websiteToClose: 0.023
    },
    sources: metrics.leads.sources,
    quality: {
      high: 267,      // 30%
      medium: 446,    // 50%
      low: 179        // 20%
    }
  });
});

// GET - Performance-Metriken
router.get('/dashboard/performance', (req, res) => {
  const { metric, period = 'month' } = req.query;

  res.json({
    performance: metrics.performance,
    details: {
      websiteMetrics: {
        pageViews: 234567,
        uniqueVisitors: 45678,
        avgSessionDuration: 245,
        bounceRate: 0.34
      },
      salesMetrics: {
        avgDealSize: 125000,
        avgDealTime: 45,
        closeRate: 0.38,
        leadResponseTime: 2.3
      },
      operationalMetrics: {
        projectsPerMonth: 19,
        avgProjectDuration: 89,
        onTimeDelivery: 0.94,
        customerSatisfaction: 4.6
      }
    }
  });
});

// GET - SEO-Metriken
router.get('/dashboard/seo', (req, res) => {
  const { timeframe = 'month' } = req.query;

  res.json({
    seo: metrics.seo,
    details: {
      keywordRankings: [
        { keyword: 'Photovoltaik Berlin', position: 3, url: '/photovoltaik/berlin' },
        { keyword: 'Solaranlage gewerbe', position: 5, url: '/photovoltaik/gewerbe' },
        { keyword: 'Solaranlagen Kosten', position: 7, url: '/photovoltaik/kosten' },
        { keyword: 'Agri-PV Deutschland', position: 4, url: '/agri-pv' }
      ],
      organicTraffic: {
        search: 8234,
        direct: 3211,
        referral: 845,
        social: 555
      },
      backlinks: {
        total: 89,
        newThisMonth: 12,
        lostThisMonth: 3,
        averageDA: 45
      },
      technicalSEO: {
        pagespeed: 92,
        mobileUsability: 98,
        coreWebVitals: 94,
        https: true
      }
    }
  });
});

// GET - Regional-Analyse
router.get('/dashboard/regions', (req, res) => {
  res.json({
    regions: [
      {
        name: 'Berlin',
        code: 'DE-BE',
        customers: 234,
        projects: 45,
        revenue: 8900000,
        marketShare: 0.28,
        growth: 0.15
      },
      {
        name: 'Hamburg',
        code: 'DE-HH',
        customers: 189,
        projects: 38,
        revenue: 6700000,
        marketShare: 0.21,
        growth: 0.18
      },
      {
        name: 'München',
        code: 'DE-BY',
        customers: 167,
        projects: 35,
        revenue: 5400000,
        marketShare: 0.17,
        growth: 0.12
      },
      {
        name: 'Köln',
        code: 'DE-NW',
        customers: 145,
        projects: 28,
        revenue: 4100000,
        marketShare: 0.13,
        growth: 0.20
      },
      {
        name: 'Frankfurt',
        code: 'DE-HE',
        customers: 127,
        projects: 25,
        revenue: 3750000,
        marketShare: 0.12,
        growth: 0.25
      },
      {
        name: 'Stuttgart',
        code: 'DE-BW',
        customers: 89,
        projects: 18,
        revenue: 2340000,
        marketShare: 0.09,
        growth: 0.08
      },
      {
        name: 'Düsseldorf',
        code: 'DE-NW',
        customers: 76,
        projects: 15,
        revenue: 1980000,
        marketShare: 0.07,
        growth: 0.14
      },
      {
        name: 'Anderes',
        code: 'OTHER',
        customers: 220,
        projects: 30,
        revenue: 10200000,
        marketShare: 0.32,
        growth: 0.22
      }
    ]
  });
});

// GET - Produkt-Performance
router.get('/dashboard/products', (req, res) => {
  const { category, timeframe = 'month' } = req.query;

  res.json({
    products: [
      {
        category: 'Module',
        units: 5678,
        revenue: 12400000,
        margin: 0.28,
        topSelling: ['Jinko Solar', 'Trina Solar', 'LONGi Solar']
      },
      {
        category: 'Wechselrichter',
        units: 2134,
        revenue: 8900000,
        margin: 0.35,
        topSelling: ['SMA', 'Huawei', 'Fronius']
      },
      {
        category: 'Speicher',
        units: 456,
        revenue: 5600000,
        margin: 0.42,
        topSelling: ['Tesla', 'BYD', 'Huawei']
      },
      {
        category: 'Service',
        revenue: 2100000,
        margin: 0.65,
        services: ['Wartung', 'Monitoring', 'Repairs']
      }
    ],
    trends: {
      demandGrowth: 0.18,
      priceTrends: 'stable',
      technologyShift: 'increasing battery storage demand'
    }
  });
});

// POST - Aktuelle Metriken aktualisieren (simuliert)
router.post('/dashboard/metrics/update', requireAuth, (req, res) => {
  const { metricType, value } = req.body;

  // Simuliere Metrik-Update
  switch (metricType) {
    case 'customer':
      metrics.customers.total += value || 0;
      break;
    case 'revenue':
      metrics.revenue.total += value || 0;
      break;
    case 'project':
      metrics.projects.total += value || 0;
      break;
  }

  res.json({
    message: 'Metrics updated successfully',
    updatedMetric: metricType,
    newValue: value,
    timestamp: new Date().toISOString()
  });
});

// GET - Live-Daten (real-time Simulation)
router.get('/dashboard/live', (req, res) => {
  const { metric } = req.query;

  const liveData = {
    timestamp: new Date().toISOString(),
    activeUsers: Math.floor(Math.random() * 50) + 10,
    currentVisitors: Math.floor(Math.random() * 200) + 50,
    recentSignups: Math.floor(Math.random() * 5) + 1,
    recentConversions: Math.floor(Math.random() * 3),
    avgSessionTime: Math.floor(Math.random() * 300) + 120,
    conversionRateToday: (Math.random() * 0.05 + 0.01).toFixed(4)
  };

  if (metric) {
    res.json({
      [metric]: liveData[metric],
      timestamp: liveData.timestamp
    });
  } else {
    res.json(liveData);
  }
});

export default router;

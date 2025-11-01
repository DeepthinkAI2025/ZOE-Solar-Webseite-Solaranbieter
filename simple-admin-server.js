import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'zoe-solar-admin-secret-2025';

// Admin Credentials aus Environment
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@zoe-solar.de';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

// Simple In-Memory Storage für Tests
let scheduledPosts = [
  {
    id: 'sched-001',
    title: 'Photovoltaik Trends 2025',
    slug: 'photovoltaik-trends-2025',
    status: 'scheduled',
    publishDate: '2025-11-05T10:00:00Z',
    author: 'Admin',
    createdAt: '2025-11-01T12:00:00Z'
  }
];

let customers = [
  {
    id: 'cus_001',
    name: 'Thomas Müller',
    email: 't.mueller@test.de',
    companyName: 'Test GmbH',
    status: 'active',
    projects: 2
  }
];

// Auth Middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin Login
app.post('/api/admin/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { userId: 'admin-001', email: email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const session = {
      userId: 'admin-001',
      email: email,
      role: 'admin',
      loginTime: new Date().toISOString(),
      permissions: ['dashboard.read', 'content.write', 'customers.read']
    };

    return res.json({
      success: true,
      data: { session, token }
    });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

// Dashboard Metrics
app.get('/api/dashboard/metrics', requireAuth, (req, res) => {
  const mockData = {
    monitoring: {
      lastRun: new Date().toISOString(),
      totalBacklinks: 1567,
      domainAuthority: 42,
      averagePosition: 6.8,
      coreWebVitals: {
        lcp: 1650,
        fid: 95,
        cls: 0.08,
        overall: 'good'
      }
    },
    traffic: [
      { month: '2025-10', estimatedVisitors: 12500, actualVisitors: 11800 },
      { month: '2025-09', estimatedVisitors: 11200, actualVisitors: 10800 }
    ],
    rankings: [
      { page: '/photovoltaik-anlagen', position: 3, change: 1, trafficShare: 25 },
      { page: '/solaranlagen-kosten', position: 5, change: -1, trafficShare: 18 }
    ],
    tasks: [
      {
        id: 'task-001',
        category: 'Content',
        title: 'Blog-Artikel planen',
        status: 'open',
        priority: 'hoch'
      }
    ]
  };

  res.json({
    data: mockData,
    issues: [],
    services: {
      searchConsole: 'ok',
      analytics: 'ok',
      ahrefs: 'missing-config',
      businessProfile: 'ok'
    }
  });
});

// Blog Scheduling
app.get('/api/admin/scheduling', requireAuth, (req, res) => {
  res.json({ data: scheduledPosts, total: scheduledPosts.length });
});

app.post('/api/admin/scheduling', requireAuth, (req, res) => {
  const newPost = {
    id: `sched-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    status: 'draft'
  };
  scheduledPosts.push(newPost);
  res.status(201).json({ success: true, data: newPost });
});

// Customer Management
app.get('/api/admin/customers', requireAuth, (req, res) => {
  res.json({ data: customers, total: customers.length });
});

app.post('/api/admin/customers', requireAuth, (req, res) => {
  const newCustomer = {
    id: `cus_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  customers.push(newCustomer);
  res.status(201).json({ success: true, data: newCustomer });
});

// Image Management
app.get('/api/admin/images', requireAuth, (req, res) => {
  res.json({
    data: [
      {
        id: 'img-001',
        filename: 'hero-image.jpg',
        url: '/images/hero-image.jpg',
        size: 245760,
        tags: ['hero', 'solar']
      }
    ],
    pagination: { page: 1, limit: 20, total: 1 }
  });
});

// API Keys
app.get('/api/admin/api-keys', requireAuth, (req, res) => {
  res.json({
    services: {
      gemini: { configured: true, model: 'gemini-pro', lastUpdated: '2025-11-01' },
      googleMaps: { configured: false, lastUpdated: null },
      ahrefs: { configured: false, lastUpdated: null }
    },
    tasks: [
      {
        id: 'task-001',
        category: 'Technical',
        title: 'API Keys konfigurieren',
        status: 'open',
        priority: 'hoch'
      }
    ]
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Simple Admin Server läuft auf Port ${PORT}`);
  console.log(`📧 Login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
});
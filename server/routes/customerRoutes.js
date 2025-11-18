import express from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();

// Test-Kundendaten
let customers = [
  {
    id: '1',
    name: 'Max Mustermann',
    email: 'max.mustermann@example.com',
    phone: '+49 30 12345678',
    companyName: 'Mustermann GmbH',
    industry: 'Handel',
    customerType: 'commercial',
    status: 'active',
    address: {
      street: 'Musterstraße 1',
      zip: '10115',
      city: 'Berlin',
      country: 'Germany'
    },
    contactPerson: 'Max Mustermann',
    registrationDate: '2024-01-15',
    lastActivity: '2024-10-31',
    tags: ['VIP', 'Solar-Interesse'],
    projects: ['proj1', 'proj2'],
    offers: [],
    totalRevenue: 125000
  },
  {
    id: '2',
    name: 'Schmidt Solar AG',
    email: 'info@schmidt-solar.de',
    phone: '+49 40 98765432',
    companyName: 'Schmidt Solar AG',
    industry: 'Energiewirtschaft',
    customerType: 'commercial',
    status: 'active',
    address: {
      street: 'Solarweg 42',
      zip: '20095',
      city: 'Hamburg',
      country: 'Germany'
    },
    contactPerson: 'Anna Schmidt',
    registrationDate: '2024-02-20',
    lastActivity: '2024-10-28',
    tags: ['Großkunde', 'Industrie'],
    projects: ['proj3'],
    offers: ['offer1', 'offer2'],
    totalRevenue: 450000
  },
  {
    id: '3',
    name: 'Maria Musterfrau',
    email: 'maria.musterfrau@web.de',
    phone: '+49 69 87654321',
    companyName: '',
    industry: '',
    customerType: 'private',
    status: 'lead',
    address: {
      street: 'Privatweg 7',
      zip: '60313',
      city: 'Frankfurt',
      country: 'Germany'
    },
    contactPerson: 'Maria Musterfrau',
    registrationDate: '2024-10-01',
    lastActivity: '2024-10-15',
    tags: ['Privatkunde', 'Erstkontakt'],
    projects: [],
    offers: [],
    totalRevenue: 0
  }
];

let projects = [
  {
    id: 'proj1',
    customerId: '1',
    name: 'Dachanlage Mustermann GmbH',
    type: 'Dachanlage',
    power: '250 kWp',
    status: 'completed',
    startDate: '2024-06-01',
    completionDate: '2024-09-15',
    cost: 125000,
    location: 'Berlin',
    description: 'Vollständige PV-Anlage für Firmendach'
  },
  {
    id: 'proj2',
    customerId: '1',
    name: 'Erweiterung Lagerhalle',
    type: 'Dachanlage',
    power: '150 kWp',
    status: 'planning',
    startDate: '2024-11-01',
    cost: 75000,
    location: 'Berlin',
    description: 'Erweiterung der bestehenden Anlage'
  },
  {
    id: 'proj3',
    customerId: '2',
    name: 'Industriepark Solar',
    type: 'Freiflächenanlage',
    power: '2.5 MWp',
    status: 'in_progress',
    startDate: '2024-05-15',
    cost: 450000,
    location: 'Hamburg',
    description: 'Großprojekt für Solarpark'
  }
];

let offers = [
  {
    id: 'offer1',
    customerId: '2',
    projectId: null,
    title: 'Solarpark Hamburg - Angebot',
    status: 'accepted',
    totalAmount: 450000,
    creationDate: '2024-04-10',
    validUntil: '2024-05-10',
    items: [
      {
        description: 'Module Jinko Solar 550Wp',
        quantity: 4545,
        unitPrice: 85,
        total: 386325
      },
      {
        description: 'Wechselrichter SMA',
        quantity: 10,
        unitPrice: 6375,
        total: 63750
      }
    ],
    notes: 'Skonto bei Zahlung innerhalb 14 Tagen 2%'
  },
  {
    id: 'offer2',
    customerId: '2',
    projectId: null,
    title: 'Service und Wartung',
    status: 'pending',
    totalAmount: 25000,
    creationDate: '2024-10-15',
    validUntil: '2024-11-15',
    items: [
      {
        description: 'Jährliche Wartung 2025',
        quantity: 1,
        unitPrice: 25000,
        total: 25000
      }
    ]
  }
];

// Middleware für Authentifizierung
function requireAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.CONTENT_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }
  next();
}

// ============= KUNDEN API =============

// GET - Alle Kunden abrufen
router.get('/customers', (req, res) => {
  const { status, customerType, industry, limit = 50, offset = 0 } = req.query;

  let filteredCustomers = customers;

  // Filter nach Status
  if (status) {
    filteredCustomers = filteredCustomers.filter(c => c.status === status);
  }

  // Filter nach Kundentyp
  if (customerType) {
    filteredCustomers = filteredCustomers.filter(c => c.customerType === customerType);
  }

  // Filter nach Branche
  if (industry) {
    filteredCustomers = filteredCustomers.filter(c => c.industry.toLowerCase().includes(industry.toLowerCase()));
  }

  const total = filteredCustomers.length;
  const paginatedCustomers = filteredCustomers.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    customers: paginatedCustomers,
    total,
    hasMore: parseInt(offset) + parseInt(limit) < total
  });
});

// GET - Einzelnen Kunden abrufen
router.get('/customers/:id', (req, res) => {
  const { id } = req.params;
  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  // Projekte und Angebote hinzufügen
  const customerProjects = projects.filter(p => p.customerId === id);
  const customerOffers = offers.filter(o => o.customerId === id);

  res.json({
    ...customer,
    projects: customerProjects,
    offers: customerOffers
  });
});

// POST - Neuen Kunden erstellen
router.post('/customers', requireAuth, (req, res) => {
  const newCustomer = req.body;

  // Validierung
  if (!newCustomer.name || !newCustomer.email) {
    return res.status(400).json({ error: 'Missing required fields: name, email' });
  }

  // Duplikatsprüfung
  if (customers.find(c => c.email === newCustomer.email)) {
    return res.status(400).json({ error: 'Customer with this email already exists' });
  }

  // ID und Metadaten hinzufügen
  newCustomer.id = Date.now().toString();
  newCustomer.registrationDate = new Date().toISOString().split('T')[0];
  newCustomer.lastActivity = newCustomer.registrationDate;
  newCustomer.status = newCustomer.status || 'lead';
  newCustomer.customerType = newCustomer.customerType || 'private';
  newCustomer.tags = newCustomer.tags || [];
  newCustomer.projects = [];
  newCustomer.offers = [];
  newCustomer.totalRevenue = 0;

  customers.push(newCustomer);

  res.status(201).json({
    message: 'Customer created successfully',
    customer: newCustomer
  });
});

// PUT - Kunden aktualisieren
router.put('/customers/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const index = customers.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  customers[index] = { ...customers[index], ...req.body, id };
  customers[index].lastActivity = new Date().toISOString().split('T')[0];

  res.json({
    message: 'Customer updated successfully',
    customer: customers[index]
  });
});

// DELETE - Kunden löschen
router.delete('/customers/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const index = customers.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const deletedCustomer = customers.splice(index, 1)[0];

  // Auch zugehörige Projekte und Angebote bereinigen
  projects = projects.filter(p => p.customerId !== id);
  offers = offers.filter(o => o.customerId !== id);

  res.json({
    message: 'Customer deleted successfully',
    customer: deletedCustomer
  });
});

// GET - Kunden suchen
router.get('/customers/search', (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query parameter "q" is required' });
  }

  const searchQuery = q.toLowerCase();
  const results = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery) ||
    customer.email.toLowerCase().includes(searchQuery) ||
    (customer.companyName && customer.companyName.toLowerCase().includes(searchQuery)) ||
    (customer.industry && customer.industry.toLowerCase().includes(searchQuery))
  ).slice(0, parseInt(limit));

  res.json({
    query: q,
    results,
    total: results.length
  });
});

// GET - Kundenstatistiken
router.get('/customers/stats', (req, res) => {
  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    leadCustomers: customers.filter(c => c.status === 'lead').length,
    commercialCustomers: customers.filter(c => c.customerType === 'commercial').length,
    privateCustomers: customers.filter(c => c.customerType === 'private').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalRevenue, 0),
    averageRevenue: customers.length > 0 ? customers.reduce((sum, c) => sum + c.totalRevenue, 0) / customers.length : 0,
    customersByIndustry: {},
    customersByStatus: {},
    registrationTrend: {}
  };

  // Statistiken nach Branche
  customers.forEach(customer => {
    if (customer.industry) {
      if (!stats.customersByIndustry[customer.industry]) {
        stats.customersByIndustry[customer.industry] = 0;
      }
      stats.customersByIndustry[customer.industry]++;
    }

    if (customer.status) {
      if (!stats.customersByStatus[customer.status]) {
        stats.customersByStatus[customer.status] = 0;
      }
      stats.customersByStatus[customer.status]++;
    }

    // Registration trend (simplified)
    const month = customer.registrationDate.substring(0, 7); // YYYY-MM
    if (!stats.registrationTrend[month]) {
      stats.registrationTrend[month] = 0;
    }
    stats.registrationTrend[month]++;
  });

  res.json(stats);
});

// GET - Kunden exportieren
router.get('/customers/export', (req, res) => {
  const { format = 'json' } = req.query;

  if (format === 'csv') {
    // CSV Header
    const csvHeader = 'ID,Name,Email,Company,Industry,Status,Registration Date,Total Revenue\n';

    // CSV Rows
    const csvRows = customers.map(c =>
      `${c.id},"${c.name}","${c.email}","${c.companyName}","${c.industry}","${c.status}","${c.registrationDate}",${c.totalRevenue}`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="customers.csv"');
    res.send(csvHeader + csvRows);
  } else {
    res.json({
      customers,
      exportedAt: new Date().toISOString(),
      total: customers.length
    });
  }
});

// ============= KUNDENPROJEKTE API =============

// GET - Kundenprojekte abrufen
router.get('/customers/:id/projects', (req, res) => {
  const { id } = req.params;
  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const customerProjects = projects.filter(p => p.customerId === id);

  res.json({
    customerId: id,
    customerName: customer.name,
    projects: customerProjects,
    total: customerProjects.length
  });
});

// POST - Neues Projekt für Kunden erstellen
router.post('/customers/:id/projects', requireAuth, (req, res) => {
  const { id } = req.params;
  const newProject = req.body;

  // Validierung
  if (!newProject.name || !newProject.type) {
    return res.status(400).json({ error: 'Missing required fields: name, type' });
  }

  // Prüfen ob Kunde existiert
  const customer = customers.find(c => c.id === id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  // Projekt erstellen
  newProject.id = Date.now().toString();
  newProject.customerId = id;
  newProject.status = newProject.status || 'planning';
  newProject.startDate = newProject.startDate || new Date().toISOString().split('T')[0];
  newProject.creationDate = new Date().toISOString().split('T')[0];

  projects.push(newProject);

  res.status(201).json({
    message: 'Project created successfully',
    project: newProject
  });
});

// PUT - Kundenprojekt aktualisieren
router.put('/customers/:id/projects/:projectId', requireAuth, (req, res) => {
  const { id, projectId } = req.params;
  const index = projects.findIndex(p => p.id === projectId && p.customerId === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects[index] = { ...projects[index], ...req.body, id: projectId, customerId: id };

  res.json({
    message: 'Project updated successfully',
    project: projects[index]
  });
});

// DELETE - Kundenprojekt löschen
router.delete('/customers/:id/projects/:projectId', requireAuth, (req, res) => {
  const { id, projectId } = req.params;
  const index = projects.findIndex(p => p.id === projectId && p.customerId === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const deletedProject = projects.splice(index, 1)[0];

  res.json({
    message: 'Project deleted successfully',
    project: deletedProject
  });
});

// ============= KUNDENANGEBOTE API =============

// GET - Kundenangebote abrufen
router.get('/customers/:id/offers', (req, res) => {
  const { id } = req.params;
  const customer = customers.find(c => c.id === id);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const customerOffers = offers.filter(o => o.customerId === id);

  res.json({
    customerId: id,
    customerName: customer.name,
    offers: customerOffers,
    total: customerOffers.length
  });
});

// POST - Neues Angebot für Kunden erstellen
router.post('/customers/:id/offers', requireAuth, (req, res) => {
  const { id } = req.params;
  const newOffer = req.body;

  // Validierung
  if (!newOffer.title || !newOffer.totalAmount) {
    return res.status(400).json({ error: 'Missing required fields: title, totalAmount' });
  }

  // Prüfen ob Kunde existiert
  const customer = customers.find(c => c.id === id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  // Angebot erstellen
  newOffer.id = Date.now().toString();
  newOffer.customerId = id;
  newOffer.status = newOffer.status || 'draft';
  newOffer.creationDate = new Date().toISOString().split('T')[0];
  newOffer.validUntil = newOffer.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  offers.push(newOffer);

  res.status(201).json({
    message: 'Offer created successfully',
    offer: newOffer
  });
});

// PUT - Kundenangebot aktualisieren
router.put('/customers/:id/offers/:offerId', requireAuth, (req, res) => {
  const { id, offerId } = req.params;
  const index = offers.findIndex(o => o.id === offerId && o.customerId === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Offer not found' });
  }

  offers[index] = { ...offers[index], ...req.body, id: offerId, customerId: id };

  res.json({
    message: 'Offer updated successfully',
    offer: offers[index]
  });
});

// DELETE - Kundenangebot löschen
router.delete('/customers/:id/offers/:offerId', requireAuth, (req, res) => {
  const { id, offerId } = req.params;
  const index = offers.findIndex(o => o.id === offerId && o.customerId === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Offer not found' });
  }

  const deletedOffer = offers.splice(index, 1)[0];

  res.json({
    message: 'Offer deleted successfully',
    offer: deletedOffer
  });
});

// GET - Angebot als PDF generieren (simuliert)
router.get('/customers/:id/offers/:offerId/pdf', requireAuth, (req, res) => {
  const { id, offerId } = req.params;
  const offer = offers.find(o => o.id === offerId && o.customerId === id);

  if (!offer) {
    return res.status(404).json({ error: 'Offer not found' });
  }

  // Simuliere PDF-Erstellung
  res.json({
    message: 'PDF generated successfully',
    pdfUrl: `/api/customers/${id}/offers/${offerId}/download.pdf`,
    offerId: offerId
  });
});

export default router;
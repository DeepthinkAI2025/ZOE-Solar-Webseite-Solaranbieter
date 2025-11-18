import express from 'express';
const router = express.Router();

// Test-Daten für Produkt-API
let testProducts = [
  {
    id: '1',
    name: 'Jinko Solar JKM450M-7RL3-V',
    category: 'Module',
    manufacturerSlug: 'jinko-solar',
    manufacturerName: 'Jinko Solar',
    imageUrl: '/images/products/jinko-solar-module.jpg',
    description: 'Hochleistungsmodul mit 450 Wp und 22,6% Wirkungsgrad',
    basePrice: 150,
    specs: {
      power: '450Wp',
      efficiency: '22.6%',
      warranty: '25 Jahre'
    },
    keyFeatures: ['Hohe Effizienz', '25 Jahre Garantie', 'PID-frei'],
    stock: 150,
    available: true
  },
  {
    id: '2',
    name: 'SMA Sunny Tripower 10.0',
    category: 'Wechselrichter',
    manufacturerSlug: 'sma',
    manufacturerName: 'SMA Solar Technology',
    imageUrl: '/images/products/sma-wechselrichter.jpg',
    description: '3-phasiger Stringwechselrichter mit 10 kW Leistung',
    basePrice: 1200,
    specs: {
      power: '10.0kW',
      phases: '3',
      efficiency: '98.5%',
      warranty: '5 Jahre'
    },
    keyFeatures: ['3-Phasen', 'Hohe Effizienz', 'Smart Home Ready'],
    stock: 25,
    available: true
  },
  {
    id: '3',
    name: 'Tesla Powerwall 2',
    category: 'Speicher',
    manufacturerSlug: 'tesla',
    manufacturerName: 'Tesla Energy',
    imageUrl: '/images/products/tesla-powerwall.jpg',
    description: '13,5 kWh Lithium-Ionen Batteriespeicher',
    basePrice: 8500,
    specs: {
      capacity: '13.5kWh',
      power: '5kW',
      cycles: '6000+',
      warranty: '10 Jahre'
    },
    keyFeatures: ['Hohe Speicherdichte', '10 Jahre Garantie', 'Skalierbar'],
    stock: 12,
    available: true
  },
  {
    id: '4',
    name: 'Wallbox Pulsar Plus',
    category: 'Ladestationen',
    manufacturerSlug: 'wallbox',
    manufacturerName: 'Wallbox',
    imageUrl: '/images/products/wallbox-ladestation.jpg',
    description: '22kW intelligente Ladestation mit RFID',
    basePrice: 2500,
    specs: {
      power: '22kW',
      phases: '3',
      rfid: true,
      wifi: true
    },
    keyFeatures: ['Intelligentes Laden', 'RFID-Kartenleser', 'WiFi-Steuerung'],
    stock: 40,
    available: true
  },
  {
    id: '5',
    name: 'Schnellmontagesystem Schieferdach',
    category: 'Unterkonstruktion',
    manufacturerSlug: 'ibc-solar',
    manufacturerName: 'IBC SOLAR',
    imageUrl: '/images/products/montagesystem.jpg',
    description: 'Universelles Montagesystem für Schieferdächer',
    basePrice: 450,
    specs: {
      material: 'Aluminium',
      roofTypes: ['Schiefer', 'Beton', 'Wellblech'],
      warranty: '12 Jahre'
    },
    keyFeatures: ['Universell einsetzbar', 'Schnelle Montage', 'Langlebig'],
    stock: 100,
    available: true
  }
];

let testManufacturers = [
  {
    slug: 'jinko-solar',
    name: 'Jinko Solar',
    logoUrl: '/images/manufacturers/jinko-solar-logo.png',
    category: ['Module'],
    description: 'Einer der größten Hersteller von Solarmodulen weltweit',
    whyWeTrust: ['Top-Qualität', 'Weltweiter Marktführer', 'Innovationsführer'],
    country: 'China',
    founded: '2006'
  },
  {
    slug: 'sma',
    name: 'SMA Solar Technology',
    logoUrl: '/images/manufacturers/sma-logo.png',
    category: ['Wechselrichter'],
    description: 'Führender Hersteller von Solar-Wechselrichtern und Speichersystemen',
    whyWeTrust: ['Deutsche Qualität', 'Marktführer', 'Zuverlässigkeit'],
    country: 'Deutschland',
    founded: '1981'
  },
  {
    slug: 'tesla',
    name: 'Tesla Energy',
    logoUrl: '/images/manufacturers/tesla-logo.png',
    category: ['Speicher', 'Ladestationen'],
    description: 'Innovatives Unternehmen für Elektromobilität und Energiespeicherung',
    whyWeTrust: ['Innovation', 'Technologieführer', 'Ecosystem-Integration'],
    country: 'USA',
    founded: '2003'
  },
  {
    slug: 'wallbox',
    name: 'Wallbox',
    logoUrl: '/images/manufacturers/wallbox-logo.png',
    category: ['Ladestationen'],
    description: 'Spezialist für intelligente Ladelösungen für Elektrofahrzeuge',
    whyWeTrust: ['Innovation', 'Zertifizierte Qualität', 'Europäischer Markt'],
    country: 'Spanien',
    founded: '2015'
  },
  {
    slug: 'ibc-solar',
    name: 'IBC SOLAR',
    logoUrl: '/images/manufacturers/ibc-solar-logo.png',
    category: ['Unterkonstruktion', 'Zubehör'],
    description: 'Deutscher Spezialist für Montagesysteme und Solardachziegel',
    whyWeTrust: ['Deutsche Ingenieurkunst', '50+ Jahre Erfahrung', 'Qualität'],
    country: 'Deutschland',
    founded: '1975'
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

// ============= PRODUKTE API =============

// GET - Alle Produkte abrufen
router.get('/products', (req, res) => {
  const { category, manufacturer, limit = 20, offset = 0, minPrice, maxPrice } = req.query;

  let filteredProducts = testProducts;

  // Filter nach Kategorie
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  // Filter nach Hersteller
  if (manufacturer && manufacturer !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.manufacturerSlug === manufacturer);
  }

  // Filter nach Preis
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => product.basePrice >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => product.basePrice <= parseFloat(maxPrice));
  }

  // Sortieren nach Name
  filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

  const total = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    products: paginatedProducts,
    total,
    hasMore: parseInt(offset) + parseInt(limit) < total
  });
});

// GET - Produkt-Kategorien abrufen
router.get('/products/categories', (req, res) => {
  const categories = [...new Set(testProducts.map(product => product.category))];
  res.json({ categories });
});

// GET - Einzelnes Produkt abrufen
router.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = testProducts.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// POST - Neues Produkt erstellen
router.post('/products', requireAuth, (req, res) => {
  const newProduct = req.body;

  // Validierung
  if (!newProduct.name || !newProduct.category || !newProduct.manufacturerSlug) {
    return res.status(400).json({ error: 'Missing required fields: name, category, manufacturerSlug' });
  }

  // ID und Metadaten hinzufügen
  newProduct.id = Date.now().toString();
  newProduct.createdAt = new Date().toISOString();
  newProduct.stock = newProduct.stock || 0;
  newProduct.available = newProduct.available !== false;

  // Finde Hersteller-Info
  const manufacturer = testManufacturers.find(m => m.slug === newProduct.manufacturerSlug);
  if (manufacturer) {
    newProduct.manufacturerName = manufacturer.name;
  }

  testProducts.push(newProduct);

  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
});

// PUT - Produkt aktualisieren
router.put('/products/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const index = testProducts.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  testProducts[index] = { ...testProducts[index], ...req.body, id };
  testProducts[index].updatedAt = new Date().toISOString();

  res.json({
    message: 'Product updated successfully',
    product: testProducts[index]
  });
});

// DELETE - Produkt löschen
router.delete('/products/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const index = testProducts.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deletedProduct = testProducts.splice(index, 1)[0];

  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
});

// GET - Produkte nach Verfügbarkeit filtern
router.get('/products/available', (req, res) => {
  const availableProducts = testProducts.filter(product => product.available);
  res.json({
    products: availableProducts,
    total: availableProducts.length
  });
});

// GET - Produkte im Lager filtern (mit niedrigem Bestand)
router.get('/products/low-stock', (req, res) => {
  const { threshold = 20 } = req.query;
  const lowStockProducts = testProducts.filter(product => product.stock && product.stock < parseInt(threshold));

  res.json({
    products: lowStockProducts,
    total: lowStockProducts.length,
    threshold: parseInt(threshold)
  });
});

// ============= HERSTELLER API =============

// GET - Alle Hersteller abrufen
router.get('/manufacturers', (req, res) => {
  res.json({ manufacturers: testManufacturers });
});

// GET - Alle Produkte eines Herstellers abrufen
router.get('/manufacturers/:slug/products', (req, res) => {
  const { slug } = req.params;

  const manufacturer = testManufacturers.find(m => m.slug === slug);
  if (!manufacturer) {
    return res.status(404).json({ error: 'Manufacturer not found' });
  }

  const manufacturerProducts = testProducts.filter(product => product.manufacturerSlug === slug);

  res.json({
    manufacturer,
    products: manufacturerProducts,
    total: manufacturerProducts.length
  });
});

// GET - Hersteller-Details abrufen
router.get('/manufacturers/:slug', (req, res) => {
  const { slug } = req.params;

  const manufacturer = testManufacturers.find(m => m.slug === slug);
  if (!manufacturer) {
    return res.status(404).json({ error: 'Manufacturer not found' });
  }

  const manufacturerProducts = testProducts.filter(product => product.manufacturerSlug === slug);

  res.json({
    ...manufacturer,
    productCount: manufacturerProducts.length,
    totalStockValue: manufacturerProducts.reduce((sum, p) => sum + (p.basePrice * (p.stock || 0)), 0)
  });
});

// GET - Hersteller nach Kategorie filtern
router.get('/manufacturers/by-category/:category', (req, res) => {
  const { category } = req.params;

  const filteredManufacturers = testManufacturers.filter(m => m.category.includes(category));

  res.json({
    category,
    manufacturers: filteredManufacturers,
    total: filteredManufacturers.length
  });
});

// = SUCHFUNKTIONEN =============

// ============= STATISTIKEN =============

// GET - Produktstatistiken
router.get('/products/stats', (req, res) => {
  const stats = {
    totalProducts: testProducts.length,
    totalManufacturers: testManufacturers.length,
    totalStockValue: testProducts.reduce((sum, p) => sum + (p.basePrice * (p.stock || 0)), 0),
    productsByCategory: {},
    lowStockCount: testProducts.filter(p => p.stock && p.stock < 10).length,
    availableCount: testProducts.filter(p => p.available).length,
    avgPrice: testProducts.length > 0 ? testProducts.reduce((sum, p) => sum + p.basePrice, 0) / testProducts.length : 0
  };

  // Produkte pro Kategorie zählen
  testProducts.forEach(product => {
    if (!stats.productsByCategory[product.category]) {
      stats.productsByCategory[product.category] = 0;
    }
    stats.productsByCategory[product.category]++;
  });

  res.json(stats);
});

// ============= PRODUKTSUCHE (am Ende, damit /:id nicht blockiert) =============

// GET - Produkte suchen
router.get('/products/search', (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query parameter "q" is required' });
  }

  const searchQuery = q.toLowerCase();
  const results = testProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery) ||
    product.description.toLowerCase().includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery) ||
    product.manufacturerName.toLowerCase().includes(searchQuery)
  ).slice(0, parseInt(limit));

  res.json({
    query: q,
    results,
    total: results.length,
    hasMore: results.length >= parseInt(limit)
  });
});

export default router;
import express from 'express';
const router = express.Router();

// Test-Daten für n8n Integration
let testArticles = [
  {
    id: '1',
    title: 'Test Artikel 1',
    slug: 'test-artikel-1',
    category: 'Technik',
    content: 'Dies ist ein Testartikel für die n8n Integration.',
    date: '2025-01-01',
    author: 'Test Author'
  },
  {
    id: '2',
    title: 'Test Artikel 2',
    slug: 'test-artikel-2',
    category: 'Allgemein',
    content: 'Ein weiterer Testartikel für die API-Demonstration.',
    date: '2025-01-02',
    author: 'Test Author'
  }
];

let testFAQ = [
  {
    id: '1',
    question: 'Was ist Photovoltaik?',
    answer: 'Photovoltaik ist die Umwandlung von Licht in elektrische Energie.',
    category: 'Allgemein'
  },
  {
    id: '2',
    question: 'Welche Förderungen gibt es?',
    answer: 'Es gibt verschiedene staatliche Förderprogramme für Solaranlagen.',
    category: 'Förderung'
  }
];

let testProjects = [
  {
    id: '1',
    title: 'Muster Projekt GmbH',
    slug: 'muster-projekt-gmbh',
    type: 'Dachanlage',
    power: '500 kWp',
    location: 'Berlin',
    date: '2024-12-01'
  },
  {
    id: '2',
    title: 'Landwirtschaft Betrieb',
    slug: 'landwirtschaft-betrieb',
    type: 'Agri-PV',
    power: '1.2 MWp',
    location: 'Brandenburg',
    date: '2024-11-15'
  }
];

// Middleware für einfache API-Key Authentifizierung
function requireAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.CONTENT_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }
  next();
}

// ============= BLOG-ARTIKEL API =============

// GET - Alle Artikel abrufen
router.get('/articles', (req, res) => {
  const { category, limit = 10, offset = 0 } = req.query;

  let filteredArticles = testArticles;

  // Filter nach Kategorie
  if (category) {
    filteredArticles = testArticles.filter(article => article.category === category);
  }

  // Sortieren nach Datum (neueste zuerst)
  filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = filteredArticles.length;
  const paginatedArticles = filteredArticles.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    articles: paginatedArticles,
    total,
    hasMore: parseInt(offset) + parseInt(limit) < total
  });
});

// GET - Einzelnen Artikel abrufen
router.get('/articles/:id', (req, res) => {
  const { id } = req.params;
  const article = testArticles.find(a => a.id === id);

  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  res.json(article);
});

// POST - Neuen Artikel erstellen
router.post('/articles', requireAuth, (req, res) => {
  const newArticle = req.body;

  // Validierung
  if (!newArticle.title || !newArticle.content) {
    return res.status(400).json({ error: 'Missing required fields: title, content' });
  }

  // ID und Metadaten hinzufügen
  newArticle.id = Date.now().toString();
  newArticle.slug = newArticle.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  newArticle.date = new Date().toISOString().split('T')[0];
  newArticle.author = newArticle.author || 'API User';

  testArticles.push(newArticle);

  res.status(201).json({
    message: 'Article created successfully',
    article: newArticle
  });
});

// PUT - Artikel aktualisieren
router.put('/articles/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const index = testArticles.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  testArticles[index] = { ...testArticles[index], ...req.body };

  res.json({
    message: 'Article updated successfully',
    article: testArticles[index]
  });
});

// DELETE - Artikel löschen
router.delete('/articles/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const index = testArticles.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  const deletedArticle = testArticles.splice(index, 1)[0];

  res.json({
    message: 'Article deleted successfully',
    article: deletedArticle
  });
});

// ============= FAQ API =============

// GET - Alle FAQ-Einträge abrufen
router.get('/faq', (req, res) => {
  const { category, limit = 20, offset = 0 } = req.query;

  let filteredFAQ = testFAQ;

  // Filter nach Kategorie
  if (category) {
    filteredFAQ = testFAQ.filter(item => item.category === category);
  }

  const total = filteredFAQ.length;
  const paginatedFAQ = filteredFAQ.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    faq: paginatedFAQ,
    total,
    hasMore: parseInt(offset) + parseInt(limit) < total
  });
});

// GET - FAQ-Kategorien abrufen
router.get('/faq/categories', (req, res) => {
  const categories = [...new Set(testFAQ.map(item => item.category))];
  res.json({ categories });
});

// POST - Neuen FAQ-Eintrag erstellen
router.post('/faq', requireAuth, (req, res) => {
  const newFAQ = req.body;

  // Validierung
  if (!newFAQ.question || !newFAQ.answer) {
    return res.status(400).json({ error: 'Missing required fields: question, answer' });
  }

  newFAQ.id = Date.now().toString();
  newFAQ.category = newFAQ.category || 'Allgemein';

  testFAQ.push(newFAQ);

  res.status(201).json({
    message: 'FAQ entry created successfully',
    faq: newFAQ
  });
});

// PUT - FAQ-Eintrag aktualisieren
router.put('/faq/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const index = testFAQ.findIndex(f => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'FAQ entry not found' });
  }

  testFAQ[index] = { ...testFAQ[index], ...req.body };

  res.json({
    message: 'FAQ entry updated successfully',
    faq: testFAQ[index]
  });
});

// DELETE - FAQ-Eintrag löschen
router.delete('/faq/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const index = testFAQ.findIndex(f => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'FAQ entry not found' });
  }

  const deletedFAQ = testFAQ.splice(index, 1)[0];

  res.json({
    message: 'FAQ entry deleted successfully',
    faq: deletedFAQ
  });
});

// ============= PROJEKTE API =============

// GET - Alle Projekte abrufen
router.get('/projects', (req, res) => {
  const { type, location, limit = 20, offset = 0 } = req.query;

  let filteredProjects = testProjects;

  // Filter nach Typ
  if (type) {
    filteredProjects = filteredProjects.filter(project => project.type === type);
  }

  // Filter nach Standort
  if (location) {
    filteredProjects = filteredProjects.filter(project => project.location === location);
  }

  // Sortieren nach Datum (neueste zuerst)
  filteredProjects.sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = filteredProjects.length;
  const paginatedProjects = filteredProjects.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

  res.json({
    projects: paginatedProjects,
    total,
    hasMore: parseInt(offset) + parseInt(limit) < total
  });
});

// GET - Projekt-Typen abrufen
router.get('/projects/types', (req, res) => {
  const types = [...new Set(testProjects.map(project => project.type))];
  res.json({ types });
});

// GET - Projekt-Standorte abrufen
router.get('/projects/locations', (req, res) => {
  const locations = [...new Set(testProjects.map(project => project.location))];
  res.json({ locations });
});

// POST - Neues Projekt erstellen
router.post('/projects', requireAuth, (req, res) => {
  const newProject = req.body;

  // Validierung
  if (!newProject.title || !newProject.type) {
    return res.status(400).json({ error: 'Missing required fields: title, type' });
  }

  newProject.id = Date.now().toString();
  newProject.slug = newProject.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  newProject.date = new Date().toISOString().split('T')[0];

  testProjects.push(newProject);

  res.status(201).json({
    message: 'Project created successfully',
    project: newProject
  });
});

// ============= SEARCH API =============

// GET - Volltextsuche über alle Daten
router.get('/search', (req, res) => {
  const { q, type, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query parameter "q" is required' });
  }

  const searchQuery = q.toLowerCase();
  const results = {
    articles: [],
    faq: [],
    projects: []
  };

  // Suche in Artikeln
  if (!type || type === 'articles') {
    results.articles = testArticles.filter(article =>
      (article.title && article.title.toLowerCase().includes(searchQuery)) ||
      (article.content && article.content.toLowerCase().includes(searchQuery)) ||
      (article.category && article.category.toLowerCase().includes(searchQuery))
    ).slice(0, parseInt(limit));
  }

  // Suche in FAQ
  if (!type || type === 'faq') {
    results.faq = testFAQ.filter(item =>
      (item.question && item.question.toLowerCase().includes(searchQuery)) ||
      (item.answer && item.answer.toLowerCase().includes(searchQuery)) ||
      (item.category && item.category.toLowerCase().includes(searchQuery))
    ).slice(0, parseInt(limit));
  }

  // Suche in Projekten
  if (!type || type === 'projects') {
    results.projects = testProjects.filter(project =>
      (project.title && project.title.toLowerCase().includes(searchQuery)) ||
      (project.type && project.type.toLowerCase().includes(searchQuery)) ||
      (project.location && project.location.toLowerCase().includes(searchQuery))
    ).slice(0, parseInt(limit));
  }

  const totalResults = results.articles.length + results.faq.length + results.projects.length;

  res.json({
    query: q,
    results,
    total: totalResults,
    hasMore: totalResults >= parseInt(limit)
  });
});

// ============= STATUS ENDPOINT =============

// GET - API Status und Statistiken
router.get('/status', (req, res) => {
  res.json({
    status: 'API is running',
    version: '1.0.0',
    endpoints: {
      articles: {
        count: testArticles.length,
        endpoints: ['GET /articles', 'GET /articles/:id', 'POST /articles', 'PUT /articles/:id', 'DELETE /articles/:id']
      },
      faq: {
        count: testFAQ.length,
        endpoints: ['GET /faq', 'GET /faq/categories', 'POST /faq', 'PUT /faq/:id', 'DELETE /faq/:id']
      },
      projects: {
        count: testProjects.length,
        endpoints: ['GET /projects', 'GET /projects/types', 'GET /projects/locations', 'POST /projects']
      },
      search: {
        endpoints: ['GET /search']
      }
    },
    authentication: 'API-Key required for POST/PUT/DELETE operations',
    documentation: 'Use header "X-API-Key" for authentication'
  });
});

export default router;
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Datenpfade
const dataDir = path.join(__dirname, '../data');
const articlesPath = path.join(dataDir, 'articles.ts');
const faqPath = path.join(dataDir, 'faqData.ts');
const projectsPath = path.join(dataDir, 'caseStudiesData.ts');

// Hilfsfunktionen für Dateioperationen
async function readArticles() {
  try {
    const content = await fs.readFile(articlesPath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading articles:', error);
    return 'export const articles: Article[] = [];';
  }
}

async function writeArticles(content) {
  try {
    await fs.writeFile(articlesPath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing articles:', error);
    return false;
  }
}

// Middleware für einfache Authentifizierung (kann später erweitert werden)
function requireAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.CONTENT_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }
  next();
}

// ============= BLOG-ARTIKEL API =============

// GET - Alle Artikel abrufen
router.get('/articles', async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;

    const content = await readArticles();
    const articlesMatch = content.match(/export const articles: Article\[] = \[([\s\S]*?)\];/);

    if (!articlesMatch) {
      return res.json({ articles: [], total: 0 });
    }

    let articles = JSON.parse('[' + articlesMatch[1] + ']');

    // Filter nach Kategorie
    if (category) {
      articles = articles.filter(article => article.category === category);
    }

    // Sortieren nach Datum (neueste zuerst)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    const total = articles.length;
    const paginatedArticles = articles.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      articles: paginatedArticles,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - Einzelnen Artikel abrufen
router.get('/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await readArticles();
    const articlesMatch = content.match(/export const articles: Article\[] = \[([\s\S]*?)\];/);

    if (!articlesMatch) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const articles = JSON.parse('[' + articlesMatch[1] + ']');
    const article = articles.find(a => a.slug === slug);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Neuen Artikel erstellen
router.post('/articles', requireAuth, async (req, res) => {
  try {
    const newArticle = req.body;

    // Validierung
    if (!newArticle.slug || !newArticle.title || !newArticle.content) {
      return res.status(400).json({ error: 'Missing required fields: slug, title, content' });
    }

    const content = await readArticles();
    const articlesMatch = content.match(/export const articles: Article\[] = \[([\s\S]*?)\];/);

    let articles = [];
    if (articlesMatch) {
      articles = JSON.parse('[' + articlesMatch[1] + ']');
    }

    // Prüfen ob Slug bereits existiert
    if (articles.find(a => a.slug === newArticle.slug)) {
      return res.status(400).json({ error: 'Article with this slug already exists' });
    }

    // Datum hinzufügen falls nicht vorhanden
    if (!newArticle.date) {
      newArticle.date = new Date().toISOString().split('T')[0];
    }

    articles.push(newArticle);

    // Datei aktualisieren
    const newContent = content.replace(
      /export const articles: Article\[] = \[[\s\S]*?\];/,
      `export const articles: Article[] = ${JSON.stringify(articles, null, 2)};`
    );

    const success = await writeArticles(newContent);

    if (success) {
      res.status(201).json({ message: 'Article created successfully', article: newArticle });
    } else {
      res.status(500).json({ error: 'Failed to save article' });
    }
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - Artikel aktualisieren
router.put('/articles/:slug', requireAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const updatedArticle = req.body;

    const content = await readArticles();
    const articlesMatch = content.match(/export const articles: Article\[] = \[([\s\S]*?)\];/);

    if (!articlesMatch) {
      return res.status(404).json({ error: 'Articles not found' });
    }

    let articles = JSON.parse('[' + articlesMatch[1] + ']');
    const index = articles.findIndex(a => a.slug === slug);

    if (index === -1) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Updated timestamp
    updatedArticle.updatedAt = new Date().toISOString();

    articles[index] = { ...articles[index], ...updatedArticle };

    // Datei aktualisieren
    const newContent = content.replace(
      /export const articles: Article\[] = \[[\s\S]*?\];/,
      `export const articles: Article[] = ${JSON.stringify(articles, null, 2)};`
    );

    const success = await writeArticles(newContent);

    if (success) {
      res.json({ message: 'Article updated successfully', article: articles[index] });
    } else {
      res.status(500).json({ error: 'Failed to update article' });
    }
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE - Artikel löschen
router.delete('/articles/:slug', requireAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await readArticles();
    const articlesMatch = content.match(/export const articles: Article\[] = \[([\s\S]*?)\];/);

    if (!articlesMatch) {
      return res.status(404).json({ error: 'Articles not found' });
    }

    let articles = JSON.parse('[' + articlesMatch[1] + ']');
    const index = articles.findIndex(a => a.slug === slug);

    if (index === -1) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const deletedArticle = articles.splice(index, 1)[0];

    // Datei aktualisieren
    const newContent = content.replace(
      /export const articles: Article\[] = \[[\s\S]*?\];/,
      `export const articles: Article[] = ${JSON.stringify(articles, null, 2)};`
    );

    const success = await writeArticles(newContent);

    if (success) {
      res.json({ message: 'Article deleted successfully', article: deletedArticle });
    } else {
      res.status(500).json({ error: 'Failed to delete article' });
    }
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= KATEGORIEN API =============

// GET - Alle Kategorien abrufen
router.get('/articles/categories', async (req, res) => {
  try {
    const content = await readArticles();
    const articlesMatch = content.match(/export const articles: Article\[] = \[([\s\S]*?)\];/);

    if (!articlesMatch) {
      return res.json({ categories: [] });
    }

    const articles = JSON.parse('[' + articlesMatch[1] + ']');
    const categories = [...new Set(articles.map(article => article.category))];

    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= FAQ API =============

// Hilfsfunktionen für FAQ
async function readFAQ() {
  try {
    const content = await fs.readFile(faqPath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading FAQ:', error);
    return 'export const faqData: { category: FaqCategory; question: string; answer: string; regions?: string[]; }[] = [];';
  }
}

async function writeFAQ(content) {
  try {
    await fs.writeFile(faqPath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing FAQ:', error);
    return false;
  }
}

// GET - Alle FAQ-Einträge abrufen
router.get('/faq', async (req, res) => {
  try {
    const { category, region, limit = 50, offset = 0 } = req.query;

    const content = await readFAQ();
    const faqMatch = content.match(/export const faqData: \{[\s\S]*?\}\[\] = \[([\s\S]*?)\];/);

    if (!faqMatch) {
      return res.json({ faq: [], total: 0 });
    }

    let faqData = JSON.parse('[' + faqMatch[1] + ']');

    // Filter nach Kategorie
    if (category && category !== 'all') {
      faqData = faqData.filter(item => item.category === category);
    }

    // Filter nach Region
    if (region && region !== 'all') {
      faqData = faqData.filter(item =>
        !item.regions || item.regions.length === 0 || item.regions.includes(region)
      );
    }

    const total = faqData.length;
    const paginatedFAQ = faqData.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      faq: paginatedFAQ,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - FAQ-Kategorien abrufen
router.get('/faq/categories', async (req, res) => {
  try {
    const content = await readFAQ();
    const faqMatch = content.match(/export const faqData: \{[\s\S]*?\}\[\] = \[([\s\S]*?)\];/);

    if (!faqMatch) {
      return res.json({ categories: [] });
    }

    const faqData = JSON.parse('[' + faqMatch[1] + ']');
    const categories = [...new Set(faqData.map(item => item.category))];

    res.json({ categories });
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Neuen FAQ-Eintrag erstellen
router.post('/faq', requireAuth, async (req, res) => {
  try {
    const newFAQ = req.body;

    // Validierung
    if (!newFAQ.category || !newFAQ.question || !newFAQ.answer) {
      return res.status(400).json({ error: 'Missing required fields: category, question, answer' });
    }

    const content = await readFAQ();
    const faqMatch = content.match(/export const faqData: \{[\s\S]*?\}\[\] = \[([\s\S]*?)\];/);

    let faqData = [];
    if (faqMatch) {
      faqData = JSON.parse('[' + faqMatch[1] + ']');
    }

    // ID hinzufügen
    newFAQ.id = Date.now().toString();

    faqData.push(newFAQ);

    // Datei aktualisieren
    const newContent = content.replace(
      /export const faqData: \{[\s\S]*?\}\[\] = \[[\s\S]*?\];/,
      `export const faqData: {
  category: FaqCategory;
  question: string;
  answer: string;
  regions?: string[];
  id?: string;
}[] = ${JSON.stringify(faqData, null, 2)};`
    );

    const success = await writeFAQ(newContent);

    if (success) {
      res.status(201).json({ message: 'FAQ entry created successfully', faq: newFAQ });
    } else {
      res.status(500).json({ error: 'Failed to save FAQ entry' });
    }
  } catch (error) {
    console.error('Error creating FAQ entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - FAQ-Eintrag aktualisieren
router.put('/faq/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFAQ = req.body;

    const content = await readFAQ();
    const faqMatch = content.match(/export const faqData: \{[\s\S]*?\}\[\] = \[([\s\S]*?)\];/);

    if (!faqMatch) {
      return res.status(404).json({ error: 'FAQ data not found' });
    }

    let faqData = JSON.parse('[' + faqMatch[1] + ']');
    const index = faqData.findIndex(f => f.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'FAQ entry not found' });
    }

    faqData[index] = { ...faqData[index], ...updatedFAQ };

    // Datei aktualisieren
    const newContent = content.replace(
      /export const faqData: \{[\s\S]*?\}\[\] = \[[\s\S]*?\];/,
      `export const faqData: {
  category: FaqCategory;
  question: string;
  answer: string;
  regions?: string[];
  id?: string;
}[] = ${JSON.stringify(faqData, null, 2)};`
    );

    const success = await writeFAQ(newContent);

    if (success) {
      res.json({ message: 'FAQ entry updated successfully', faq: faqData[index] });
    } else {
      res.status(500).json({ error: 'Failed to update FAQ entry' });
    }
  } catch (error) {
    console.error('Error updating FAQ entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE - FAQ-Eintrag löschen
router.delete('/faq/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const content = await readFAQ();
    const faqMatch = content.match(/export const faqData: \{[\s\S]*?\}\[\] = \[([\s\S]*?)\];/);

    if (!faqMatch) {
      return res.status(404).json({ error: 'FAQ data not found' });
    }

    let faqData = JSON.parse('[' + faqMatch[1] + ']');
    const index = faqData.findIndex(f => f.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'FAQ entry not found' });
    }

    const deletedFAQ = faqData.splice(index, 1)[0];

    // Datei aktualisieren
    const newContent = content.replace(
      /export const faqData: \{[\s\S]*?\}\[\] = \[[\s\S]*?\];/,
      `export const faqData: {
  category: FaqCategory;
  question: string;
  answer: string;
  regions?: string[];
  id?: string;
}[] = ${JSON.stringify(faqData, null, 2)};`
    );

    const success = await writeFAQ(newContent);

    if (success) {
      res.json({ message: 'FAQ entry deleted successfully', faq: deletedFAQ });
    } else {
      res.status(500).json({ error: 'Failed to delete FAQ entry' });
    }
  } catch (error) {
    console.error('Error deleting FAQ entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
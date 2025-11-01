import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Datenpfade
const dataDir = path.join(__dirname, '../data');
const productsPath = path.join(dataDir, 'products.generated.ts');

// Hilfsfunktionen für Produkte
async function readProducts() {
  try {
    const content = await fs.readFile(productsPath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading products:', error);
    return 'export const productCatalog = { manufacturers: [] };';
  }
}

async function writeProducts(content) {
  try {
    await fs.writeFile(productsPath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
}

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
router.get('/products', async (req, res) => {
  try {
    const { category, manufacturer, limit = 50, offset = 0 } = req.query;

    const content = await readProducts();

    // Extrahiere Hersteller und Produkte aus der TypeScript-Struktur
    const catalogMatch = content.match(/export const productCatalog = ({[\s\S]*?});/);

    if (!catalogMatch) {
      return res.json({ products: [], total: 0 });
    }

    // Parse das catalog JSON (vereinfachter Ansatz)
    let allProducts = [];

    // Suche nach allen manufacturers im Content
    const manufacturerMatches = content.matchAll(/slug: "([^"]+)"[\s\S]*?name: "([^"]+)"[\s\S]*?logoUrl: "([^"]*)"[\s\S]*?category: \[([^\]]*)\][\s\S]*?description: "([^"]*)"[\s\S]*?whyWeTrust: \[([^\]]*)\][\s\S]*?products: \[([\s\S]*?)\]/g);

    for (const match of manufacturerMatches) {
      const manufacturerData = {
        slug: match[1],
        name: match[2],
        logoUrl: match[3],
        category: eval('[' + match[4] + ']'), // Kategorien als Array
        description: match[5],
        whyWeTrust: eval('[' + match[6] + ']'), // Trust-Faktoren als Array
        products: []
      };

      // Parse Produkte dieses Herstellers
      const productMatches = match[7].matchAll(/{ name: "([^"]+)",[\s\S]*?category: "([^"]+)",[\s\S]*?imageUrl: "([^"]+)",[\s\S]*?description: "([^"]+)"/g);

      for (const productMatch of productMatches) {
        allProducts.push({
          id: `${manufacturerData.slug}-${productMatch[0].substring(0, 10)}`,
          name: productMatch[1],
          category: productMatch[2],
          manufacturerSlug: manufacturerData.slug,
          manufacturerName: manufacturerData.name,
          imageUrl: productMatch[3],
          description: productMatch[4],
          manufacturer: manufacturerData
        });
      }
    }

    // Filter nach Kategorie
    if (category && category !== 'all') {
      allProducts = allProducts.filter(product => product.category === category);
    }

    // Filter nach Hersteller
    if (manufacturer && manufacturer !== 'all') {
      allProducts = allProducts.filter(product => product.manufacturerSlug === manufacturer);
    }

    const total = allProducts.length;
    const paginatedProducts = allProducts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      products: paginatedProducts,
      total,
      hasMore: parseInt(offset) + parseInt(limit) < total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - Alle Hersteller abrufen
router.get('/manufacturers', async (req, res) => {
  try {
    const content = await readProducts();

    const manufacturers = [];
    const manufacturerMatches = content.matchAll(/slug: "([^"]+)"[\s\S]*?name: "([^"]+)"[\s\S]*?logoUrl: "([^"]*)"[\s\S]*?category: \[([^\]]*)\][\s\S]*?description: "([^"]*)"/g);

    for (const match of manufacturerMatches) {
      manufacturers.push({
        slug: match[1],
        name: match[2],
        logoUrl: match[3],
        category: eval('[' + match[4] + ']'),
        description: match[5]
      });
    }

    res.json({ manufacturers });
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - Produkt-Kategorien abrufen
router.get('/products/categories', async (req, res) => {
  try {
    const categories = [
      'Module',
      'Wechselrichter',
      'Speicher',
      'Ladestationen',
      'Unterkonstruktion',
      'Elektrokomponenten',
      'Zubehör',
      'Leistungsoptimierer'
    ];

    res.json({ categories });
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - Einzelnes Produkt abrufen
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const content = await readProducts();
    let allProducts = [];

    // Parse alle Produkte (gleiche Logik wie oben)
    const manufacturerMatches = content.matchAll(/slug: "([^"]+)"[\s\S]*?name: "([^"]+)"[\s\S]*?logoUrl: "([^"]*)"[\s\S]*?category: \[([^\]]*)\][\s\S]*?description: "([^"]*)"[\s\S]*?whyWeTrust: \[([^\]]*)\][\s\S]*?products: \[([\s\S]*?)\]/g);

    for (const match of manufacturerMatches) {
      const manufacturerData = {
        slug: match[1],
        name: match[2],
        logoUrl: match[3],
        category: eval('[' + match[4] + ']'),
        description: match[5],
        whyWeTrust: eval('[' + match[6] + ']')
      };

      const productMatches = match[7].matchAll(/{ name: "([^"]+)",[\s\S]*?category: "([^"]+)",[\s\S]*?imageUrl: "([^"]+)",[\s\S]*?description: "([^"]+)"/g);

      for (const productMatch of productMatches) {
        const productId = `${manufacturerData.slug}-${productMatch[0].substring(0, 10)}`;
        allProducts.push({
          id: productId,
          name: productMatch[1],
          category: productMatch[2],
          manufacturerSlug: manufacturerData.slug,
          manufacturerName: manufacturerData.name,
          imageUrl: productMatch[3],
          description: productMatch[4],
          manufacturer: manufacturerData
        });
      }
    }

    const product = allProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Neues Produkt erstellen
router.post('/products', requireAuth, async (req, res) => {
  try {
    const newProduct = req.body;

    // Validierung
    if (!newProduct.name || !newProduct.category || !newProduct.manufacturerSlug) {
      return res.status(400).json({ error: 'Missing required fields: name, category, manufacturerSlug' });
    }

    // Generiere ID
    newProduct.id = `${newProduct.manufacturerSlug}-${Date.now()}`;

    // Für Demonstration: Simuliere Erfolg (in echter Anwendung würde dies in Datei geschrieben)
    res.status(201).json({
      message: 'Product created successfully (simulated)',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - Produkt aktualisieren
router.put('/products/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = req.body;

    // Für Demonstration: Simuliere Update
    res.json({
      message: 'Product updated successfully (simulated)',
      product: { id, ...updatedProduct }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE - Produkt löschen
router.delete('/products/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Für Demonstration: Simuliere Delete
    res.json({
      message: 'Product deleted successfully (simulated)',
      productId: id
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= HERSTELLER API =============

// GET - Alle Produkte eines Herstellers abrufen
router.get('/manufacturers/:slug/products', async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await readProducts();
    let manufacturerProducts = [];

    // Finde den spezifischen Hersteller
    const manufacturerRegex = new RegExp(`slug: "${slug}"[\\s\\S]*?name: "([^"]+)"[\\s\\S]*?logoUrl: "([^"]*)"[\\s\\S]*?category: \\[([^\\]]*)\\][\\s\\S]*?description: "([^"]*)"[\\s\\S]*?whyWeTrust: \\[([^\\]]*)\\][\\s\\S]*?products: \\[([\\s\\S]*?)\\]`, 'g');

    const manufacturerMatch = content.match(manufacturerRegex);

    if (!manufacturerMatch) {
      return res.status(404).json({ error: 'Manufacturer not found' });
    }

    const manufacturerData = {
      slug: slug,
      name: manufacturerMatch[1],
      logoUrl: manufacturerMatch[2],
      category: eval('[' + manufacturerMatch[3] + ']'),
      description: manufacturerMatch[4],
      whyWeTrust: eval('[' + manufacturerMatch[5] + ']')
    };

    // Parse Produkte dieses Herstellers
    const productMatches = manufacturerMatch[6].matchAll(/{ name: "([^"]+)",[\s\S]*?category: "([^"]+)",[\s\S]*?imageUrl: "([^"]+)",[\s\S]*?description: "([^"]+)"/g);

    for (const productMatch of productMatches) {
      manufacturerProducts.push({
        id: `${slug}-${productMatch[0].substring(0, 10)}`,
        name: productMatch[1],
        category: productMatch[2],
        manufacturerSlug: slug,
        manufacturerName: manufacturerData.name,
        imageUrl: productMatch[3],
        description: productMatch[4],
        manufacturer: manufacturerData
      });
    }

    res.json({
      manufacturer: manufacturerData,
      products: manufacturerProducts,
      total: manufacturerProducts.length
    });
  } catch (error) {
    console.error('Error fetching manufacturer products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - Hersteller-Details abrufen
router.get('/manufacturers/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await readProducts();

    const manufacturerRegex = new RegExp(`slug: "${slug}"[\\s\\S]*?name: "([^"]+)"[\\s\\S]*?logoUrl: "([^"]*)"[\\s\\S]*?category: \\[([^\\]]*)\\][\\s\\S]*?description: "([^"]*)"[\\s\\S]*?whyWeTrust: \\[([^\\]]*)\\]`);

    const manufacturerMatch = content.match(manufacturerRegex);

    if (!manufacturerMatch) {
      return res.status(404).json({ error: 'Manufacturer not found' });
    }

    const manufacturer = {
      slug: slug,
      name: manufacturerMatch[1],
      logoUrl: manufacturerMatch[2],
      category: eval('[' + manufacturerMatch[3] + ']'),
      description: manufacturerMatch[4],
      whyWeTrust: eval('[' + manufacturerMatch[5] + ']')
    };

    res.json(manufacturer);
  } catch (error) {
    console.error('Error fetching manufacturer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
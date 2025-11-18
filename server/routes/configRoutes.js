import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Konfigurations-Pfade
const configDir = path.join(__dirname, '../config');
const settingsPath = path.join(configDir, 'settings.json');

// Standard-Konfiguration
const defaultSettings = {
  general: {
    siteName: 'ZOE Solar',
    siteDescription: 'Ihr Experte für Solaranlagen',
    contactEmail: 'info@zoe-solar.de',
    contactPhone: '+49 123 456789',
    address: {
      street: 'Musterstraße 1',
      zip: '12345',
      city: 'Berlin',
      country: 'Germany'
    }
  },
  seo: {
    metaTitle: 'ZOE Solar - Experte für Solaranlagen',
    metaDescription: 'Professionelle Solaranlagen für Privat- und Geschäftskunden.',
    keywords: ['Solar', 'Photovoltaik', 'Erneuerbare Energie', 'Solaranlagen'],
    ogImage: '/images/og-image.jpg',
    favicon: '/favicon.ico'
  },
  socialMedia: {
    facebook: 'https://facebook.com/zoe-solar',
    instagram: 'https://instagram.com/zoe-solar',
    linkedin: 'https://linkedin.com/company/zoe-solar',
    youtube: 'https://youtube.com/c/zoe-solar'
  },
  business: {
    taxRate: 0.19,
    shippingCosts: 0,
    freeShippingThreshold: 1000,
    currencies: ['EUR'],
    defaultCurrency: 'EUR'
  },
  features: {
    enableBlog: true,
    enableShop: true,
    enableContactForm: true,
    enableNewsletter: true,
    enableCustomerPortal: false,
    enableAppointmentBooking: true
  },
  limits: {
    maxFileSize: 10485760, // 10MB
    maxImageUploads: 10,
    maxDocumentUploads: 5,
    sessionTimeout: 3600000 // 1 Stunde
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: false,
    newCustomerNotification: true,
    newOrderNotification: true,
    lowStockNotification: true
  }
};

// Hilfsfunktionen für Konfigurationsmanagement
async function readSettings() {
  try {
    const content = await fs.readFile(settingsPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.log('Settings file not found, using defaults');
    return { ...defaultSettings };
  }
}

async function writeSettings(settings) {
  try {
    // Stelle sicher dass das config Verzeichnis existiert
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing settings:', error);
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

// ============= KONFIGURATION API =============

// GET - Alle Konfigurationen abrufen
router.get('/config', async (req, res) => {
  try {
    const settings = await readSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - Konfigurations-Bereich abrufen
router.get('/config/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const settings = await readSettings();

    if (!settings[section]) {
      return res.status(404).json({ error: 'Configuration section not found' });
    }

    res.json({ [section]: settings[section] });
  } catch (error) {
    console.error('Error fetching config section:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - Konfigurations-Bereich aktualisieren
router.put('/config/:section', requireAuth, async (req, res) => {
  try {
    const { section } = req.params;
    const newConfig = req.body;

    const settings = await readSettings();
    settings[section] = { ...settings[section], ...newConfig };

    const success = await writeSettings(settings);

    if (!success) {
      return res.status(500).json({ error: 'Failed to save configuration' });
    }

    res.json({
      message: 'Configuration updated successfully',
      section,
      config: settings[section]
    });
  } catch (error) {
    console.error('Error updating config section:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - Gesamte Konfiguration aktualisieren
router.put('/config', requireAuth, async (req, res) => {
  try {
    const newSettings = req.body;

    // Validiere grundlegende Struktur
    if (!newSettings.general || !newSettings.seo) {
      return res.status(400).json({ error: 'Invalid configuration structure' });
    }

    const success = await writeSettings(newSettings);

    if (!success) {
      return res.status(500).json({ error: 'Failed to save configuration' });
    }

    res.json({
      message: 'Configuration updated successfully',
      settings: newSettings
    });
  } catch (error) {
    console.error('Error updating full configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Konfiguration auf Standard zurücksetzen
router.post('/config/reset', requireAuth, async (req, res) => {
  try {
    const { section } = req.body;

    const settings = await readSettings();

    if (section) {
      // Nur bestimmten Bereich zurücksetzen
      if (defaultSettings[section]) {
        settings[section] = { ...defaultSettings[section] };
        await writeSettings(settings);
        res.json({
          message: `Configuration section '${section}' reset to defaults`,
          section: settings[section]
        });
      } else {
        return res.status(404).json({ error: 'Configuration section not found' });
      }
    } else {
      // Komplette Konfiguration zurücksetzen
      await writeSettings(defaultSettings);
      res.json({
        message: 'Configuration reset to defaults',
        settings: defaultSettings
      });
    }
  } catch (error) {
    console.error('Error resetting configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Konfiguration exportieren
router.post('/config/export', requireAuth, async (req, res) => {
  try {
    const { format = 'json' } = req.body;
    const settings = await readSettings();

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="config.json"');
      res.json(settings);
    } else {
      res.status(400).json({ error: 'Unsupported export format' });
    }
  } catch (error) {
    console.error('Error exporting configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Konfiguration importieren
router.post('/config/import', requireAuth, async (req, res) => {
  try {
    const { config } = req.body;

    if (!config || typeof config !== 'object') {
      return res.status(400).json({ error: 'Invalid configuration data' });
    }

    // Validiere grundlegende Struktur
    if (!config.general || !config.general.siteName) {
      return res.status(400).json({ error: 'Invalid configuration structure' });
    }

    const success = await writeSettings(config);

    if (!success) {
      return res.status(500).json({ error: 'Failed to import configuration' });
    }

    res.json({
      message: 'Configuration imported successfully',
      settings: config
    });
  } catch (error) {
    console.error('Error importing configuration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - Konfigurations-Status prüfen
router.get('/config/status', async (req, res) => {
  try {
    const settings = await readSettings();

    const status = {
      isConfigured: !!settings.general.siteName,
      lastUpdated: settings.lastUpdated || null,
      version: settings.version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      featuresEnabled: Object.keys(settings.features || {}).filter(key => settings.features[key]).length,
      totalFeatures: Object.keys(settings.features || {}).length
    };

    res.json(status);
  } catch (error) {
    console.error('Error checking config status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= SYSTEM-EINSTELLUNGEN =============

// GET - System-Informationen abrufen
router.get('/config/system', async (req, res) => {
  try {
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };

    res.json(systemInfo);
  } catch (error) {
    console.error('Error fetching system info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET - Feature-Flags abrufen
router.get('/config/features', async (req, res) => {
  try {
    const settings = await readSettings();
    res.json(settings.features || {});
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - Feature-Flags aktualisieren
router.put('/config/features', requireAuth, async (req, res) => {
  try {
    const { features } = req.body;

    if (!features || typeof features !== 'object') {
      return res.status(400).json({ error: 'Invalid features data' });
    }

    const settings = await readSettings();
    settings.features = { ...settings.features, ...features };
    settings.lastUpdated = new Date().toISOString();

    const success = await writeSettings(settings);

    if (!success) {
      return res.status(500).json({ error: 'Failed to update features' });
    }

    res.json({
      message: 'Features updated successfully',
      features: settings.features
    });
  } catch (error) {
    console.error('Error updating features:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
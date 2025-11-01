import express from 'express';
import PageContentService from '../services/pageContentService.js';
import { AuthService } from '../services/authService.js';

const router = express.Router();

/**
 * GET /api/admin/content/contact
 * Kontakt-Content laden
 */
router.get('/content/contact', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const content = await PageContentService.getContactContent();
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('[Admin Content] GET Kontakt Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Kontakt-Content konnte nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * PUT /api/admin/content/contact
 * Kontakt-Content aktualisieren
 */
router.put('/content/contact', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Keine Updates übertragen'
      });
    }

    const result = await PageContentService.updateContactContent(updates, req.admin.id);

    res.json(result);
  } catch (error) {
    console.error('[Admin Content] PUT Kontakt Fehler:', error);
    
    if (error.details) {
      return res.status(400).json({
        success: false,
        error: 'Validierung fehlgeschlagen',
        details: error.details
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Kontakt-Content konnte nicht aktualisiert werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/content/imprint
 * Impressums-Content laden
 */
router.get('/content/imprint', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const content = await PageContentService.getImprintContent();
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('[Admin Content] GET Impressum Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Impressum-Content konnte nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * PUT /api/admin/content/imprint
 * Impressums-Content aktualisieren
 */
router.put('/content/imprint', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Keine Updates übertragen'
      });
    }

    const result = await PageContentService.updateImprintContent(updates, req.admin.id);

    res.json(result);
  } catch (error) {
    console.error('[Admin Content] PUT Impressum Fehler:', error);
    
    if (error.details) {
      return res.status(400).json({
        success: false,
        error: 'Validierung fehlgeschlagen',
        details: error.details
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Impressum-Content konnte nicht aktualisiert werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/content/history
 * Änderungshistorie laden
 */
router.get('/content/history', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const history = await PageContentService.getChangeHistory();
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('[Admin Content] History Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Änderungshistorie konnte nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/content/stats
 * Content-Statistiken
 */
router.get('/content/stats', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const stats = await PageContentService.getContentStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('[Admin Content] Stats Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Statistiken konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/content/reset
 * Content auf Standard zurücksetzen
 */
router.post('/content/reset', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { pageType } = req.body;
    
    if (!pageType || !['contact', 'imprint'].includes(pageType)) {
      return res.status(400).json({
        success: false,
        error: 'Ungültiger Seitentyp. Erlaubt: contact, imprint'
      });
    }

    const result = await PageContentService.resetToDefault(pageType, req.admin.id);

    res.json(result);
  } catch (error) {
    console.error('[Admin Content] Reset Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Content konnte nicht zurückgesetzt werden',
      message: error.message
    });
  }
});

export default router;
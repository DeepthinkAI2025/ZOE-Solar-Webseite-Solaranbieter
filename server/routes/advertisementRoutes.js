import express from 'express';
import multer from 'multer';
import AdvertisementService from '../services/advertisementService.js';
import { AuthService } from '../services/authService.js';

const router = express.Router();

// Multer für Banner-Upload konfigurieren
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Nicht unterstütztes Bildformat'));
    }
  }
});

/**
 * GET /api/admin/advertisements
 * Alle Werbebanner abrufen
 */
router.get('/advertisements', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { 
      category, 
      adSpace, 
      isActive, 
      dateFrom, 
      dateTo, 
      search, 
      page = 1, 
      limit = 20 
    } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (adSpace) filters.adSpace = adSpace;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    if (search) filters.search = search;
    
    let banners = await AdvertisementService.getAllBanners(filters);
    
    // Paginierung
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedBanners = banners.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        advertisements: paginatedBanners,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: banners.length,
          pages: Math.ceil(banners.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('[Admin Advertisements] GET Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Banner konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/advertisements/:bannerId
 * Einzelnes Banner abrufen
 */
router.get('/advertisements/:bannerId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { bannerId } = req.params;
    
    const banner = await AdvertisementService.getBanner(bannerId);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner nicht gefunden'
      });
    }
    
    res.json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('[Admin Advertisements] GET Einzelner Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Banner konnte nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/advertisements/rotation/:adSpace
 * Banner für Werbefläche abrufen (mit Rotation)
 */
router.get('/advertisements/rotation/:adSpace', async (req, res) => {
  try {
    const { adSpace } = req.params;
    const { rotation = 'true' } = req.query;
    
    const banner = await AdvertisementService.getBannersForAdSpace(
      adSpace, 
      rotation === 'true'
    );
    
    res.json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('[Admin Advertisements] Rotation Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Banner für Werbefläche konnte nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/advertisements
 * Neues Werbebanner erstellen
 */
router.post('/advertisements',
  AuthService.requireAdminAuth,
  upload.single('banner'),
  async (req, res) => {
    try {
      const bannerData = {
        name: req.body.name,
        title: req.body.title,
        subtitle: req.body.subtitle,
        description: req.body.description,
        callToAction: req.body.callToAction,
        targetUrl: req.body.targetUrl,
        category: req.body.category || 'general',
        priority: parseInt(req.body.priority) || 1,
        isActive: req.body.isActive === 'true',
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        adSpace: req.body.adSpace,
        rotationWeights: req.body.rotationWeights ? JSON.parse(req.body.rotationWeights) : undefined,
        settings: req.body.settings ? JSON.parse(req.body.settings) : undefined,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
      };

      const result = await AdvertisementService.createBanner(bannerData, req.file);
      
      res.status(201).json(result);
    } catch (error) {
      console.error('[Admin Advertisements] POST Fehler:', error);
      
      if (error.details) {
        return res.status(400).json({
          success: false,
          error: 'Banner-Erstellung fehlgeschlagen',
          details: error.details
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Banner konnte nicht erstellt werden',
        message: error.message
      });
    }
  }
);

/**
 * PUT /api/admin/advertisements/:bannerId
 * Banner aktualisieren
 */
router.put('/advertisements/:bannerId',
  AuthService.requireAdminAuth,
  upload.single('banner'),
  async (req, res) => {
    try {
      const { bannerId } = req.params;
      
      const updates = {
        name: req.body.name,
        title: req.body.title,
        subtitle: req.body.subtitle,
        description: req.body.description,
        callToAction: req.body.callToAction,
        targetUrl: req.body.targetUrl,
        category: req.body.category,
        priority: req.body.priority ? parseInt(req.body.priority) : undefined,
        isActive: req.body.isActive !== undefined ? req.body.isActive === 'true' : undefined,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        adSpace: req.body.adSpace,
        rotationWeights: req.body.rotationWeights ? JSON.parse(req.body.rotationWeights) : undefined,
        settings: req.body.settings ? JSON.parse(req.body.settings) : undefined,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : undefined
      };

      // Entferne undefined Felder
      Object.keys(updates).forEach(key => {
        if (updates[key] === undefined) {
          delete updates[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Keine Updates übertragen'
        });
      }

      const result = await AdvertisementService.updateBanner(bannerId, updates, req.file);

      res.json(result);
    } catch (error) {
      console.error('[Admin Advertisements] PUT Fehler:', error);
      
      if (error.message.includes('nicht gefunden')) {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }
      
      if (error.details) {
        return res.status(400).json({
          success: false,
          error: 'Banner-Update fehlgeschlagen',
          details: error.details
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Banner konnte nicht aktualisiert werden',
        message: error.message
      });
    }
  }
);

/**
 * DELETE /api/admin/advertisements/:bannerId
 * Banner löschen
 */
router.delete('/advertisements/:bannerId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { bannerId } = req.params;

    const result = await AdvertisementService.deleteBanner(bannerId);

    res.json(result);
  } catch (error) {
    console.error('[Admin Advertisements] DELETE Fehler:', error);
    
    if (error.message.includes('nicht gefunden')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Banner konnte nicht gelöscht werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/advertisements/:bannerId/performance
 * Banner-Performance aktualisieren
 */
router.post('/advertisements/:bannerId/performance', async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { event } = req.body;

    if (!event || !['impression', 'click', 'conversion'].includes(event)) {
      return res.status(400).json({
        success: false,
        error: 'Ungültiges Event. Erlaubt: impression, click, conversion'
      });
    }

    const result = await AdvertisementService.updateBannerPerformance(bannerId, event);

    res.json(result);
  } catch (error) {
    console.error('[Admin Advertisements] Performance Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Performance-Update fehlgeschlagen',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/advertisements/categories
 * Banner-Kategorien abrufen
 */
router.get('/advertisements/categories', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const categories = await AdvertisementService.getBannerCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('[Admin Advertisements] Categories Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Kategorien konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/advertisements/ad-spaces
 * Werbeflächen abrufen
 */
router.get('/advertisements/ad-spaces', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const adSpaces = await AdvertisementService.getAdSpaces();
    
    res.json({
      success: true,
      data: adSpaces
    });
  } catch (error) {
    console.error('[Admin Advertisements] AdSpaces Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Werbeflächen konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/advertisements/stats
 * Werbe-Statistiken für Dashboard
 */
router.get('/advertisements/stats', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const stats = await AdvertisementService.getAdvertisementStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('[Admin Advertisements] Stats Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Statistiken konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/advertisements/top-performing
 * Top performende Banner abrufen
 */
router.get('/advertisements/top-performing', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { limit = 10, category, adSpace } = req.query;
    
    const filters = {
      ...(category && { category }),
      ...(adSpace && { adSpace })
    };
    
    const banners = await AdvertisementService.getAllBanners(filters);
    
    const topBanners = banners
      .filter(banner => banner.performance.impressions > 0)
      .sort((a, b) => {
        const aCTR = a.performance.impressions > 0 ? (a.performance.clicks / a.performance.impressions) * 100 : 0;
        const bCTR = b.performance.impressions > 0 ? (b.performance.clicks / b.performance.impressions) * 100 : 0;
        return bCTR - aCTR;
      })
      .slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: topBanners
    });
  } catch (error) {
    console.error('[Admin Advertisements] Top Performing Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Top performende Banner konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/advertisements/bulk-toggle
 * Mehrere Banner aktivieren/deaktivieren
 */
router.post('/advertisements/bulk-toggle', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { bannerIds, isActive } = req.body;

    if (!Array.isArray(bannerIds) || bannerIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Banner IDs müssen als Array übertragen werden'
      });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive muss boolean sein'
      });
    }

    const results = [];
    for (const bannerId of bannerIds) {
      try {
        const result = await AdvertisementService.updateBanner(bannerId, { isActive });
        results.push({ bannerId, success: true, result });
      } catch (error) {
        results.push({ 
          bannerId, 
          success: false, 
          error: error.message 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      message: `${successCount} von ${bannerIds.length} Bannern ${isActive ? 'aktiviert' : 'deaktiviert'}`,
      data: results
    });
  } catch (error) {
    console.error('[Admin Advertisements] Bulk Toggle Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Bulk-Update fehlgeschlagen',
      message: error.message
    });
  }
});

export default router;
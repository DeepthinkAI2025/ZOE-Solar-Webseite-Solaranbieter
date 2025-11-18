import express from 'express';
import multer from 'multer';
import ImageManagementService from '../services/imageManagementService.js';
import { AuthService } from '../services/authService.js';

const router = express.Router();

// Multer für File-Upload konfigurieren
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Nicht unterstütztes Dateiformat'));
    }
  }
});

/**
 * GET /api/admin/images
 * Alle Bilder abrufen
 */
router.get('/images', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '', format = '' } = req.query;
    
    const images = await ImageManagementService.getAllImages();
    
    // Filter anwenden
    let filteredImages = images;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredImages = filteredImages.filter(img => 
        img.name.toLowerCase().includes(searchLower)
      );
    }
    
    if (format) {
      filteredImages = filteredImages.filter(img => img.format === format);
    }
    
    // Paginierung
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedImages = filteredImages.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        images: paginatedImages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredImages.length,
          pages: Math.ceil(filteredImages.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('[Admin Images] GET Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Bilder konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/images/:imageId
 * Einzelnes Bild abrufen
 */
router.get('/images/:imageId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { imageId } = req.params;
    
    const image = await ImageManagementService.getImage(imageId);
    
    res.json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('[Admin Images] GET Einzelbild Fehler:', error);
    
    if (error.message === 'Bild nicht gefunden') {
      return res.status(404).json({
        success: false,
        error: 'Bild nicht gefunden'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Bild konnte nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/images/upload
 * Bild hochladen
 */
router.post('/images/upload', 
  AuthService.requireAdminAuth,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Keine Bilddatei übertragen'
        });
      }
      
      const result = await ImageManagementService.uploadImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      
      res.status(201).json(result);
    } catch (error) {
      console.error('[Admin Images] Upload Fehler:', error);
      
      if (error.details) {
        return res.status(400).json({
          success: false,
          error: 'Upload fehlgeschlagen',
          details: error.details
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Upload fehlgeschlagen',
        message: error.message
      });
    }
  }
);

/**
 * DELETE /api/admin/images/:imageId
 * Bild löschen
 */
router.delete('/images/:imageId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { imageId } = req.params;
    
    await ImageManagementService.deleteImage(imageId);
    
    res.json({
      success: true,
      message: 'Bild erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('[Admin Images] DELETE Fehler:', error);
    
    res.status(500).json({
      success: false,
      error: 'Bild konnte nicht gelöscht werden',
      message: error.message
    });
  }
});

/**
 * PUT /api/admin/images/:imageId/assign
 * Bild zu Seite zuweisen
 */
router.put('/images/:imageId/assign', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { imageId } = req.params;
    const { pagePath, action = 'assign' } = req.body;
    
    if (!pagePath) {
      return res.status(400).json({
        success: false,
        error: 'Seitenpfad ist erforderlich'
      });
    }
    
    await ImageManagementService.updatePageAssignment(imageId, pagePath, action);
    
    res.json({
      success: true,
      message: `Bild ${action === 'assign' ? 'zugewiesen' : 'entfernt'}`
    });
  } catch (error) {
    console.error('[Admin Images] Assignment Fehler:', error);
    
    res.status(500).json({
      success: false,
      error: 'Zuweisung fehlgeschlagen',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/images/stats
 * Bildstatistiken abrufen
 */
router.get('/images/stats', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const stats = await ImageManagementService.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('[Admin Images] Stats Fehler:', error);
    
    res.status(500).json({
      success: false,
      error: 'Statistiken konnten nicht geladen werden',
      message: error.message
    });
  }
});

export default router;
import express from 'express';
import multer from 'multer';
import KnowledgeBaseService from '../services/knowledgeBaseService.js';
import { AuthService } from '../services/authService.js';

const router = express.Router();

// Multer für File-Upload konfigurieren
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Nicht unterstütztes Dateiformat'));
    }
  }
});

/**
 * GET /api/admin/knowledge
 * Alle Knowledge-Base-Dokumente abrufen
 */
router.get('/knowledge', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { category, tags, status, search, page = 1, limit = 20 } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (tags) filters.tags = Array.isArray(tags) ? tags : [tags];
    if (status) filters.status = status;
    if (search) filters.search = search;
    
    let documents = await KnowledgeBaseService.getAllDocuments(filters);
    
    // Paginierung
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedDocuments = documents.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        documents: paginatedDocuments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: documents.length,
          pages: Math.ceil(documents.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('[Admin Knowledge] GET Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Knowledge Base Dokumente konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/knowledge/:documentId
 * Einzelnes Dokument abrufen
 */
router.get('/knowledge/:documentId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const document = await KnowledgeBaseService.getDocument(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Dokument nicht gefunden'
      });
    }
    
    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('[Admin Knowledge] GET Einzelnes Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Dokument konnte nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/knowledge/upload
 * Dokument hochladen
 */
router.post('/knowledge/upload',
  AuthService.requireAdminAuth,
  upload.single('document'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Keine Dokumentdatei übertragen'
        });
      }
      
      const metadata = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category || 'Allgemein',
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
        author: req.body.author || 'Unbekannt',
        language: req.body.language || 'de'
      };
      
      const result = await KnowledgeBaseService.uploadDocument(req.file, metadata);
      
      res.status(201).json(result);
    } catch (error) {
      console.error('[Admin Knowledge] Upload Fehler:', error);
      
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
 * PUT /api/admin/knowledge/:documentId
 * Dokument aktualisieren
 */
router.put('/knowledge/:documentId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { documentId } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Keine Updates übertragen'
      });
    }

    // Tags normalisieren falls sie als String übertragen werden
    if (typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    const result = await KnowledgeBaseService.updateDocument(documentId, updates);

    res.json(result);
  } catch (error) {
    console.error('[Admin Knowledge] PUT Fehler:', error);
    
    if (error.message.includes('nicht gefunden')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Dokument konnte nicht aktualisiert werden',
      message: error.message
    });
  }
});

/**
 * DELETE /api/admin/knowledge/:documentId
 * Dokument löschen
 */
router.delete('/knowledge/:documentId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { documentId } = req.params;

    const result = await KnowledgeBaseService.deleteDocument(documentId);

    res.json(result);
  } catch (error) {
    console.error('[Admin Knowledge] DELETE Fehler:', error);
    
    if (error.message.includes('nicht gefunden')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Dokument konnte nicht gelöscht werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/knowledge/:documentId/analyze
 * KI-Analyse für Dokument starten
 */
router.post('/knowledge/:documentId/analyze', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const document = await KnowledgeBaseService.getDocument(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Dokument nicht gefunden'
      });
    }
    
    const analysisResult = await KnowledgeBaseService.analyzeDocument(document);
    
    res.json({
      success: true,
      message: 'KI-Analyse gestartet',
      data: analysisResult
    });
  } catch (error) {
    console.error('[Admin Knowledge] Analyze Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'KI-Analyse fehlgeschlagen',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/knowledge/search
 * Knowledge Base durchsuchen
 */
router.get('/knowledge/search', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { q: query, category, tags, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Suchbegriff ist erforderlich'
      });
    }

    const filters = {};
    if (category) filters.category = category;
    if (tags) filters.tags = Array.isArray(tags) ? tags : [tags];

    const results = await KnowledgeBaseService.searchDocuments(query, filters);
    
    // Begrenzen der Ergebnisse
    const limitedResults = results.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: {
        query,
        results: limitedResults,
        totalFound: results.length
      }
    });
  } catch (error) {
    console.error('[Admin Knowledge] Search Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Suche fehlgeschlagen',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/knowledge/categories
 * Alle Kategorien abrufen
 */
router.get('/knowledge/categories', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const categories = await KnowledgeBaseService.getCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('[Admin Knowledge] Categories Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Kategorien konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/knowledge/tags
 * Alle Tags abrufen
 */
router.get('/knowledge/tags', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const tags = await KnowledgeBaseService.getTags();
    
    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('[Admin Knowledge] Tags Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Tags konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/knowledge/stats
 * Knowledge Base Statistiken
 */
router.get('/knowledge/stats', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const stats = await KnowledgeBaseService.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('[Admin Knowledge] Stats Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Statistiken konnten nicht geladen werden',
      message: error.message
    });
  }
});

export default router;
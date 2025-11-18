import express from 'express';
import BlogSchedulingService from '../services/blogSchedulingService.js';
import { AuthService } from '../services/authService.js';

const router = express.Router();

/**
 * GET /api/admin/scheduling
 * Alle geplanten Beiträge abrufen
 */
router.get('/scheduling', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { status = '', page = 1, limit = 20 } = req.query;
    
    const schedules = await BlogSchedulingService.getScheduledPosts();
    
    // Filter anwenden
    let filteredSchedules = schedules;
    
    if (status && status !== 'all') {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.publishStatus === status);
    }
    
    // Sortieren (neueste zuerst)
    filteredSchedules.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Paginierung
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        schedules: paginatedSchedules,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredSchedules.length,
          pages: Math.ceil(filteredSchedules.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('[Admin Scheduling] GET Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Geplante Beiträge konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/scheduling/:scheduleId
 * Einzelnen geplanten Beitrag abrufen
 */
router.get('/scheduling/:scheduleId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { scheduleId } = req.params;
    
    const schedule = await BlogSchedulingService.getScheduledPost(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        error: 'Geplanter Beitrag nicht gefunden'
      });
    }
    
    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('[Admin Scheduling] GET Einzelner Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Geplanter Beitrag konnte nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/scheduling
 * Neuen Beitrag zur Veröffentlichung planen
 */
router.post('/scheduling', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      author,
      featuredImage,
      scheduledDate,
      publishStatus = 'scheduled',
      metaTitle,
      metaDescription,
      seoKeywords
    } = req.body;

    // Grundlegende Validierung
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Titel ist erforderlich'
      });
    }
    
    if (!slug?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Slug ist erforderlich'
      });
    }
    
    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Inhalt ist erforderlich'
      });
    }
    
    if (!scheduledDate) {
      return res.status(400).json({
        success: false,
        error: 'Geplantes Datum ist erforderlich'
      });
    }

    const result = await BlogSchedulingService.schedulePost({
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      content: content.trim(),
      excerpt: excerpt?.trim() || '',
      category: category || 'Allgemein',
      tags: Array.isArray(tags) ? tags : [],
      author: author || 'Admin',
      featuredImage: featuredImage || '',
      scheduledDate,
      publishStatus,
      metaTitle: metaTitle || title.trim(),
      metaDescription: metaDescription || excerpt?.trim() || '',
      seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : []
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('[Admin Scheduling] POST Fehler:', error);
    res.status(400).json({
      success: false,
      error: 'Beitrag konnte nicht geplant werden',
      message: error.message
    });
  }
});

/**
 * PUT /api/admin/scheduling/:scheduleId
 * Geplanten Beitrag bearbeiten
 */
router.put('/scheduling/:scheduleId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Keine Updates übertragen'
      });
    }

    const result = await BlogSchedulingService.updateScheduledPost(scheduleId, updates);

    res.json(result);
  } catch (error) {
    console.error('[Admin Scheduling] PUT Fehler:', error);
    
    if (error.message.includes('nicht gefunden')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(400).json({
      success: false,
      error: 'Geplanter Beitrag konnte nicht aktualisiert werden',
      message: error.message
    });
  }
});

/**
 * DELETE /api/admin/scheduling/:scheduleId
 * Geplanten Beitrag löschen
 */
router.delete('/scheduling/:scheduleId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const result = await BlogSchedulingService.deleteScheduledPost(scheduleId);

    res.json(result);
  } catch (error) {
    console.error('[Admin Scheduling] DELETE Fehler:', error);
    
    if (error.message.includes('nicht gefunden')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(400).json({
      success: false,
      error: 'Geplanter Beitrag konnte nicht gelöscht werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/scheduling/:scheduleId/publish
 * Geplanten Beitrag sofort veröffentlichen
 */
router.post('/scheduling/:scheduleId/publish', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { force = false } = req.body;

    const result = await BlogSchedulingService.publishScheduledPost(scheduleId, force);

    res.json(result);
  } catch (error) {
    console.error('[Admin Scheduling] Publish Fehler:', error);
    
    if (error.message.includes('nicht gefunden')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    if (error.message.includes('kann noch nicht veröffentlicht')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Beitrag konnte nicht veröffentlicht werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/scheduling/immediate
 * Beitrag sofort veröffentlichen (ohne Planung)
 */
router.post('/scheduling/immediate', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const postData = req.body;

    const result = await BlogSchedulingService.publishImmediately(postData);

    res.status(201).json(result);
  } catch (error) {
    console.error('[Admin Scheduling] Immediate Publish Fehler:', error);
    res.status(400).json({
      success: false,
      error: 'Beitrag konnte nicht sofort veröffentlicht werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/scheduling/check-publish
 * Automatische Veröffentlichung prüfen (für Cron-Job)
 */
router.post('/scheduling/check-publish', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const results = await BlogSchedulingService.checkAndPublishScheduledPosts();

    res.json({
      success: true,
      message: 'Automatische Veröffentlichung durchgeführt',
      data: {
        processed: results.length,
        results: results
      }
    });
  } catch (error) {
    console.error('[Admin Scheduling] Check Publish Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Automatische Veröffentlichung fehlgeschlagen',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/scheduling/stats
 * Statistiken für Dashboard
 */
router.get('/scheduling/stats', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const stats = await BlogSchedulingService.getSchedulingStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('[Admin Scheduling] Stats Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Statistiken konnten nicht geladen werden',
      message: error.message
    });
  }
});

export default router;
import express from 'express';
import CustomerManagementService from '../services/customerManagementService.js';
import { AuthService } from '../services/authService.js';

const router = express.Router();

/**
 * GET /api/admin/customers
 * Alle Kunden abrufen
 */
router.get('/customers', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { 
      status, 
      planType, 
      search, 
      dateFrom, 
      dateTo, 
      page = 1, 
      limit = 20 
    } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (planType) filters.planType = planType;
    if (search) filters.search = search;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    
    let customers = await CustomerManagementService.getAllCustomers(filters);
    
    // Paginierung
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedCustomers = customers.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        customers: paginatedCustomers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: customers.length,
          pages: Math.ceil(customers.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('[Admin Customers] GET Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Kunden konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/customers/:customerId
 * Einzelnes Kundenkonto abrufen
 */
router.get('/customers/:customerId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const customer = await CustomerManagementService.getCustomer(customerId);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Kunde nicht gefunden'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('[Admin Customers] GET Einzelner Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Kunde konnte nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/customers
 * Neues Kundenkonto erstellen
 */
router.post('/customers', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      phone,
      address,
      planType = 'basic',
      notes = ''
    } = req.body;

    // Grundlegende Validierung
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Name ist erforderlich'
      });
    }
    
    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'E-Mail ist erforderlich'
      });
    }

    const result = await CustomerManagementService.createCustomer({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password || 'temp123',
      companyName: companyName?.trim() || '',
      phone: phone?.trim() || '',
      address: address || {},
      planType: planType || 'basic',
      notes: notes.trim()
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('[Admin Customers] POST Fehler:', error);
    
    if (error.message.includes('existiert bereits')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Kunde konnte nicht erstellt werden',
      message: error.message
    });
  }
});

/**
 * PUT /api/admin/customers/:customerId
 * Kundenkonto aktualisieren
 */
router.put('/customers/:customerId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { customerId } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Keine Updates übertragen'
      });
    }

    const result = await CustomerManagementService.updateCustomer(customerId, updates);

    res.json(result);
  } catch (error) {
    console.error('[Admin Customers] PUT Fehler:', error);
    
    if (error.message.includes('nicht gefunden')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Kunde konnte nicht aktualisiert werden',
      message: error.message
    });
  }
});

/**
 * DELETE /api/admin/customers/:customerId
 * Kundenkonto löschen (soft delete)
 */
router.delete('/customers/:customerId', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { customerId } = req.params;

    const result = await CustomerManagementService.deleteCustomer(customerId);

    res.json(result);
  } catch (error) {
    console.error('[Admin Customers] DELETE Fehler:', error);
    
    if (error.message.includes('nicht gefunden')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Kunde konnte nicht gelöscht werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/customers/:customerId/tags
 * Kunden-Tags verwalten
 */
router.post('/customers/:customerId/tags', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { customerId } = req.params;
    const { tags, action = 'set' } = req.body;

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Tags müssen als Array übertragen werden'
      });
    }

    const result = await CustomerManagementService.updateCustomerTags(
      customerId, 
      tags, 
      action
    );

    res.json(result);
  } catch (error) {
    console.error('[Admin Customers] Tags Fehler:', error);
    
    if (error.message.includes('nicht gefunden')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Tags konnten nicht aktualisiert werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/customers/search
 * Kunden suchen
 */
router.get('/customers/search', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { q: query, status, planType } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Suchbegriff ist erforderlich'
      });
    }

    const filters = {};
    if (status) filters.status = status;
    if (planType) filters.planType = planType;

    const results = await CustomerManagementService.searchCustomers(query, filters);
    
    res.json({
      success: true,
      data: {
        query,
        results: results.slice(0, 50), // Begrenzen der Suchergebnisse
        totalFound: results.length
      }
    });
  } catch (error) {
    console.error('[Admin Customers] Search Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Suche fehlgeschlagen',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/customers/active-sessions
 * Aktive Kunden-Sessions abrufen
 */
router.get('/customers/active-sessions', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const sessions = await CustomerManagementService.getActiveCustomerSessions();
    
    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('[Admin Customers] Active Sessions Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Aktive Sessions konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/customers/:customerId/activity
 * Kundenaktivität protokollieren
 */
router.post('/customers/:customerId/activity', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { customerId } = req.params;
    const activity = req.body;

    if (!activity.type) {
      return res.status(400).json({
        success: false,
        error: 'Aktivitäts-Typ ist erforderlich'
      });
    }

    const result = await CustomerManagementService.logCustomerActivity(customerId, activity);

    res.json(result);
  } catch (error) {
    console.error('[Admin Customers] Activity Log Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Aktivität konnte nicht protokolliert werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/customers/stats
 * Kunden-Statistiken für Dashboard
 */
router.get('/customers/stats', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const stats = await CustomerManagementService.getCustomerStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('[Admin Customers] Stats Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Statistiken konnten nicht geladen werden',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/customers/export
 * Kunden-Daten exportieren
 */
router.get('/customers/export', AuthService.requireAdminAuth, async (req, res) => {
  try {
    const { format = 'json', status, planType, search } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (planType) filters.planType = planType;
    if (search) filters.search = search;

    const exportData = await CustomerManagementService.exportCustomers(format, filters);
    
    // Content-Type für Export setzen
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="customers.csv"');
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="customers.json"');
    }
    
    res.send(exportData);
  } catch (error) {
    console.error('[Admin Customers] Export Fehler:', error);
    res.status(500).json({
      success: false,
      error: 'Export fehlgeschlagen',
      message: error.message
    });
  }
});

export default router;
import express from 'express';
import AuthService from '../services/authService.js';

const router = express.Router();

/**
 * POST /api/admin/auth/login
 * Admin-Login mit sicheren Credentials
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Credentials validieren
    if (!AuthService.validateCredentials(email, password)) {
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Session erstellen
    const adminData = {
      id: 'admin-001',
      email: email,
      role: 'admin'
    };

    const { session, token } = AuthService.createSession(adminData);

    // Erfolgreiche Authentifizierung
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        session,
        token
      }
    });

    console.log(`[ADMIN AUTH] Successful login for ${email} at ${new Date().toISOString()}`);

  } catch (error) {
    console.error('[ADMIN AUTH] Login error:', error);
    res.status(500).json({
      error: 'Internal server error during authentication',
      code: 'LOGIN_ERROR'
    });
  }
});

/**
 * POST /api/admin/auth/logout
 * Admin-Logout (Token invalidieren)
 */
router.post('/auth/logout', AuthService.requireAdminAuth, (req, res) => {
  try {
    // In einer produktiven Implementierung würde hier der Token 
    // zu einer Blacklist hinzugefügt oder aus der Session-DB entfernt
    
    res.json({
      success: true,
      message: 'Logout successful'
    });

    console.log(`[ADMIN AUTH] Logout for ${req.admin.email} at ${new Date().toISOString()}`);

  } catch (error) {
    console.error('[ADMIN AUTH] Logout error:', error);
    res.status(500).json({
      error: 'Internal server error during logout',
      code: 'LOGOUT_ERROR'
    });
  }
});

/**
 * GET /api/admin/auth/me
 * Aktuellen Admin-Status abrufen
 */
router.get('/auth/me', AuthService.optionalAdminAuth, (req, res) => {
  if (!req.admin) {
    return res.status(401).json({
      error: 'Not authenticated',
      code: 'NOT_AUTHENTICATED'
    });
  }

  res.json({
    success: true,
    data: {
      admin: req.admin,
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * POST /api/admin/auth/refresh
 * Token erneuern (falls noch nicht abgelaufen)
 */
router.post('/auth/refresh', AuthService.requireAdminAuth, (req, res) => {
  try {
    const adminData = {
      id: req.admin.id,
      email: req.admin.email,
      role: req.admin.role
    };

    const { session, token } = AuthService.createSession(adminData);

    res.json({
      success: true,
      message: 'Token refreshed',
      data: {
        session,
        token
      }
    });

    console.log(`[ADMIN AUTH] Token refreshed for ${req.admin.email}`);

  } catch (error) {
    console.error('[ADMIN AUTH] Token refresh error:', error);
    res.status(500).json({
      error: 'Internal server error during token refresh',
      code: 'REFRESH_ERROR'
    });
  }
});

export default router;
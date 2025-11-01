import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Admin-Credentials aus Environment-Variablen (nicht hardcoded!)
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'zukunftsorientierte.energie@gmail.com',
  password: process.env.ADMIN_PASSWORD || 'ZOE.seo2026!'
};

export class AuthService {
  
  /**
   * Validiert Admin-Credentials
   */
  static validateCredentials(email, password) {
    return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password;
  }

  /**
   * Generiert JWT-Token für Admin
   */
  static generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Verifiziert JWT-Token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Erstellt Session für Admin
   */
  static createSession(adminData) {
    const sessionData = {
      id: adminData.id,
      email: adminData.email,
      role: adminData.role,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
    };

    const token = this.generateToken({
      userId: adminData.id,
      email: adminData.email,
      role: adminData.role
    });

    return {
      session: sessionData,
      token
    };
  }

  /**
   * Middleware für Admin-Authentifizierung
   */
  static requireAdminAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authorization header missing or invalid',
        code: 'AUTH_REQUIRED'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = this.verifyToken(token);
      
      // Prüfe ob Token noch gültig ist
      const now = new Date();
      const expiresAt = new Date(decoded.exp * 1000);
      
      if (expiresAt <= now) {
        return res.status(401).json({ 
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      req.admin = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
      
      next();
    } catch (error) {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
  }

  /**
   * Optionale Admin-Authentifizierung (für Dashboard-Loading)
   */
  static optionalAdminAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.admin = null;
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = this.verifyToken(token);
      req.admin = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    } catch (error) {
      req.admin = null;
    }
    
    next();
  }
}

export default AuthService;
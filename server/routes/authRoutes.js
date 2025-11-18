import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const router = express.Router();

// Secret Key für JWT (in production aus Environment Variable)
const JWT_SECRET = process.env.JWT_SECRET || 'zoe-solar-secret-key-2025';

// Admin-Benutzer (Test-Daten)
const adminUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@zoe-solar.de',
    password: '$2a$10$rF9jZtVj.vCLiPZnNAv1XOgXHhqRZVAMGeZvdKQ/ZGBLraIHt3cNi', // password: "admin123"
    role: 'super_admin',
    permissions: ['read', 'write', 'delete', 'admin', 'users'],
    name: 'Administrator',
    isActive: true,
    lastLogin: null,
    createdAt: '2024-01-01'
  }
];

// Aktive Sessions (Token-Whitelist)
const activeSessions = new Map();

// Middleware für JWT-Authentifizierung
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// ============= AUTHENTIFIZIERUNGS-API =============

// POST - Admin Login
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Admin-Benutzer finden
  const user = adminUsers.find(u => u.username === username || u.email === username);

  if (!user || !user.isActive) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Passwort prüfen
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // JWT Token erstellen
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Session speichern
  activeSessions.set(token, {
    userId: user.id,
    username: user.username,
    role: user.role,
    loginTime: new Date().toISOString()
  });

  user.lastLogin = new Date().toISOString();

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      name: user.name,
      lastLogin: user.lastLogin
    }
  });
});

// POST - Admin Logout
router.post('/auth/logout', authenticateToken, (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token && activeSessions.has(token)) {
    activeSessions.delete(token);
  }

  res.json({ message: 'Logout successful' });
});

// GET - Aktuellen Benutzer abrufen
router.get('/auth/me', authenticateToken, (req, res) => {
  const user = adminUsers.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    name: user.name,
    isActive: user.isActive,
    lastLogin: user.lastLogin
  });
});

export default router;

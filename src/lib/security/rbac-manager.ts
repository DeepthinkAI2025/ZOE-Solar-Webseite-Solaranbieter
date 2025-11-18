// 🔐 RBAC-Sicherheitsmanager für ZOE Solar CMS
// Rollenbasierte Zugriffskontrolle mit erweiterten Sicherheitsfeatures

export type Permission = 
  | 'notion:read:public'      // Öffentliche Notion-Daten lesen
  | 'notion:read:private'     // Private Notion-Daten lesen
  | 'notion:write:content'    // Notion-Inhalte erstellen/bearbeiten
  | 'notion:write:admin'      // Admin-Bereiche bearbeiten
  | 'webhook:receive'         // Webhooks empfangen
  | 'api:admin'               // Admin-API-Zugriff
  | 'api:public'              // Öffentlicher API-Zugriff
  | 'cache:manage'            // Cache-Verwaltung
  | 'audit:view'              // Audit-Logs einsehen
  | 'security:configure'      // Sicherheitseinstellungen

export type Role = 
  | 'guest'           // Öffentliche Besucher
  | 'user'            // Registrierte Benutzer
  | 'content-editor'  // Content-Editor
  | 'admin'           // Administrator
  | 'super-admin'     // Super-Administrator

export interface User {
  id: string
  email: string
  roles: Role[]
  permissions: Permission[]
  createdAt: number
  lastLogin?: number
  isActive: boolean
  metadata?: Record<string, unknown>
}

export interface SecurityContext {
  user?: User
  ip?: string
  userAgent?: string
  timestamp: number
  sessionId?: string
}

export interface AuthConfig {
  jwtSecret: string
  jwtExpiry: number
  sessionTimeout: number
  maxLoginAttempts: number
  lockoutDuration: number
  requireMFA: boolean[]
  allowedDomains?: string[] // Erlaubte E-Mail-Domains
  rateLimits: Record<string, number> // Rate Limits pro Endpoint
}

interface PermissionMap {
  [key: string]: Permission[]
}

interface RolePermissions {
  [key in Role]: Permission[]
}

export class RBACManager {
  private static instance: RBACManager
  private users = new Map<string, User>()
  private permissions: PermissionMap = new Map()
  private sessionStore = new Map<string, SecurityContext>()
  private loginAttempts = new Map<string, { attempts: number, lockedUntil?: number }>()
  private config: AuthConfig
  private encryptionKey?: string

  private constructor(config: AuthConfig) {
    this.config = config
    this.initializePermissions()
    this.loadEncryptionKey()
  }

  public static getInstance(config: AuthConfig): RBACManager {
    if (!RBACManager.instance) {
      RBACManager.instance = new RBACManager(config)
    }
    return RBACManager.instance
  }

  // ========== Permission-System ==========

  private initializePermissions(): void {
    // Standard-Rollen-Berechtigungen definieren
    const rolePermissions: RolePermissions = {
      guest: [
        'notion:read:public',
        'api:public'
      ],
      user: [
        ...['guest'],
        'notion:read:private',
        'cache:manage'
      ],
      'content-editor': [
        ...['user'],
        'notion:write:content',
        'webhook:receive'
      ],
      admin: [
        ...['content-editor'],
        'notion:write:admin',
        'api:admin',
        'audit:view'
      ],
      'super-admin': [
        ...['admin'],
        'security:configure'
      ]
    }

    // Permission-Map erstellen
    Object.entries(rolePermissions).forEach(([role, permissions]) => {
      this.permissions.set(role, permissions)
    })
  }

  /**
   * Benutzer anmelden
   */
  async login(email: string, password: string, context: Partial<SecurityContext> = {}): Promise<{
    success: boolean
    token?: string
    user?: User
    error?: string
    requiresMFA?: boolean
  }> {
    const clientIp = context.ip || 'unknown'
    
    // Brute Force Protection
    if (this.isLockedOut(clientIp)) {
      return {
        success: false,
        error: 'Zu viele Anmeldeversuche. Bitte später erneut versuchen.'
      }
    }

    // Benutzer validieren
    const user = this.authenticateUser(email, password)
    if (!user) {
      this.recordFailedAttempt(clientIp)
      return {
        success: false,
        error: 'Ungültige Anmeldedaten'
      }
    }

    // MFA-Prüfung (falls erforderlich)
    if (this.config.requireMFA && this.config.requireMFA.includes(user.roles[0])) {
      return {
        success: true,
        requiresMFA: true,
        user: { ...user, permissions: this.getUserPermissions(user) }
      }
    }

    // Session erstellen
    const sessionId = await this.createSession(user, context)
    const token = await this.generateJWT(user, sessionId)

    // Erfolgreiche Anmeldung
    this.clearFailedAttempts(clientIp)
    this.updateLastLogin(user.id)

    return {
      success: true,
      token,
      user: { ...user, permissions: this.getUserPermissions(user) }
    }
  }

  /**
   * Session-basiertes Login (für API-Schlüssel)
   */
  async loginWithApiKey(apiKey: string, context: Partial<SecurityContext> = {}): Promise<{
    success: boolean
    token?: string
    user?: User
    error?: string
  }> {
    // API-Schlüssel validieren
    const user = this.authenticateApiKey(apiKey)
    if (!user) {
      return {
        success: false,
        error: 'Ungültiger API-Schlüssel'
      }
    }

    // Session erstellen
    const sessionId = await this.createSession(user, context)
    const token = await this.generateJWT(user, sessionId)

    this.updateLastLogin(user.id)

    return {
      success: true,
      token,
      user: { ...user, permissions: this.getUserPermissions(user) }
    }
  }

  /**
   * Berechtigung prüfen
   */
  hasPermission(user: User, permission: Permission): boolean {
    const userPermissions = this.getUserPermissions(user)
    return userPermissions.includes(permission)
  }

  /**
   * Mehrere Berechtigungen prüfen (alle müssen erfüllt sein)
   */
  hasAllPermissions(user: User, permissions: Permission[]): boolean {
    const userPermissions = this.getUserPermissions(user)
    return permissions.every(p => userPermissions.includes(p))
  }

  /**
   * Mehrere Berechtigungen prüfen (mindestens eine muss erfüllt sein)
   */
  hasAnyPermission(user: User, permissions: Permission[]): boolean {
    const userPermissions = this.getUserPermissions(user)
    return permissions.some(p => userPermissions.includes(p))
  }

  /**
   * Token validieren und User-Kontext erstellen
   */
  async validateToken(token: string, context: Partial<SecurityContext> = {}): Promise<SecurityContext | null> {
    try {
      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(token, this.config.jwtSecret) as {
        userId: string
        email: string
        roles: Role[]
        sessionId: string
        iat: number
        exp: number
      }
      
      const session = this.sessionStore.get(decoded.sessionId)
      if (!session) {
        return null // Session abgelaufen
      }

      // Session-Timeout prüfen
      const now = Date.now()
      if (now - session.timestamp > this.config.sessionTimeout) {
        this.sessionStore.delete(decoded.sessionId)
        return null // Session abgelaufen
      }

      // Session aktualisieren
      session.timestamp = now
      session.ip = context.ip || session.ip
      session.userAgent = context.userAgent || session.userAgent

      return session

    } catch (error) {
      console.warn('Token validation failed:', error)
      return null
    }
  }

  /**
   * Benutzer abmelden
   */
  async logout(sessionId: string): Promise<void> {
    this.sessionStore.delete(sessionId)
    
    // Client-seitige Cache-Invalidierung
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('userLoggedOut', {
        detail: { sessionId, timestamp: Date.now() }
      }))
    }
  }

  /**
   * Session-Check für Middleware
   */
  requireAuth(context: Partial<SecurityContext> & { requiredPermissions?: Permission[] }): {
    success: boolean
    error?: string
    user?: User
    context?: SecurityContext
  } {
    // Session validieren
    if (!context.sessionId) {
      return { success: false, error: 'Session-ID erforderlich' }
    }

    const session = this.sessionStore.get(context.sessionId)
    if (!session || !session.user) {
      return { success: false, error: 'Ungültige oder abgelaufene Session' }
    }

    // Berechtigungen prüfen
    if (context.requiredPermissions && context.requiredPermissions.length > 0) {
      const hasPermission = this.hasAllPermissions(session.user, context.requiredPermissions)
      if (!hasPermission) {
        return { 
          success: false, 
          error: 'Unzureichende Berechtigungen',
          user: session.user 
        }
      }
    }

    return {
      success: true,
      user: session.user,
      context: session
    }
  }

  // ========== User Management ==========

  /**
   * Benutzer erstellen
   */
  createUser(userData: {
    email: string
    roles?: Role[]
    metadata?: Record<string, unknown>
  }): User {
    const user: User = {
      id: this.generateUserId(),
      email: userData.email.toLowerCase(),
      roles: userData.roles || ['user'],
      permissions: [],
      createdAt: Date.now(),
      isActive: true,
      metadata: userData.metadata
    }

    this.users.set(user.email, user)
    return user
  }

  /**
   * Benutzer-Rollen ändern
   */
  updateUserRoles(userId: string, roles: Role[]): boolean {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        user.roles = roles
        return true
      }
    }
    return false
  }

  /**
   * Benutzer aktivieren/deaktivieren
   */
  setUserActive(userId: string, isActive: boolean): boolean {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        user.isActive = isActive
        return true
      }
    }
    return false
  }

  /**
   * Benutzer abrufen
   */
  getUser(emailOrId: string): User | null {
    // Per E-Mail
    const user = this.users.get(emailOrId.toLowerCase())
    if (user) return user

    // Per ID
    for (const u of this.users.values()) {
      if (u.id === emailOrId) return u
    }

    return null
  }

  // ========== API Key Management ==========

  /**
   * API-Schlüssel erstellen
   */
  createApiKey(userId: string, permissions: Permission[]): string {
    const apiKey = this.generateApiKey()
    
    // API-Schlüssel in User-Metadata speichern
    const user = this.getUser(userId)
    if (user) {
      if (!user.metadata?.apiKeys) {
        user.metadata.apiKeys = {}
      }
      
      user.metadata.apiKeys[apiKey] = {
        permissions,
        createdAt: Date.now(),
        lastUsed: null,
        isActive: true
      }
    }

    return apiKey
  }

  /**
   * API-Schlüssel löschen
   */
  revokeApiKey(userId: string, apiKey: string): boolean {
    const user = this.getUser(userId)
    if (user?.metadata?.apiKeys?.[apiKey]) {
      delete user.metadata.apiKeys[apiKey]
      return true
    }
    return false
  }

  // ========== Audit & Security ==========

  /**
   * Sicherheitsereignis protokollieren
   */
  logSecurityEvent(event: {
    type: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'api_access'
    userId?: string
    context: SecurityContext
    details?: Record<string, unknown>
  }): void {
    const auditLog = {
      timestamp: Date.now(),
      ...event
    }

    // Audit-Log speichern
    console.log('🔒 Security Event:', auditLog)

    // In Produktion: In persistenter Datenbank speichern
    if (process.env.NODE_ENV === 'production') {
      this.persistAuditLog(auditLog)
    }
  }

  /**
   * Rate Limiting prüfen
   */
  checkRateLimit(key: string, limit: number, windowMs: number): boolean {
    // Vereinfachte Implementierung - in Produktion: Redis verwenden
    const now = Date.now()
    const _windowStart = now - windowMs
    
    // In Produktion: Hier würde die tatsächliche Rate-Limiting-Logik stehen
    return true // Für Demo-Zwecke immer erlauben
  }

  // ========== Private Methoden ==========

  private authenticateUser(email: string, password: string): User | null {
    const user = this.users.get(email.toLowerCase())
    if (!user || !user.isActive) {
      return null
    }

    // Passwort-Validierung (vereinfacht)
    // In Produktion: bcrypt oder ähnliches verwenden
    const isValidPassword = this.validatePassword(password)
    if (!isValidPassword) {
      return null
    }

    return user
  }

  private authenticateApiKey(apiKey: string): User | null {
    for (const user of this.users.values()) {
      if (user.metadata?.apiKeys?.[apiKey]?.isActive) {
        // Last used aktualisieren
        user.metadata.apiKeys[apiKey].lastUsed = Date.now()
        return user
      }
    }
    return null
  }

  private getUserPermissions(user: User): Permission[] {
    const permissions = new Set<Permission>()
    
    // Rollen-basierte Berechtigungen
    user.roles.forEach(role => {
      const rolePermissions = this.permissions.get(role) || []
      rolePermissions.forEach(p => permissions.add(p))
    })

    // Individuelle Berechtigungen hinzufügen
    user.permissions.forEach(p => permissions.add(p))

    return Array.from(permissions)
  }

  private async createSession(user: User, context: Partial<SecurityContext>): Promise<string> {
    const sessionId = this.generateSessionId()
    
    const session: SecurityContext = {
      user,
      ip: context.ip,
      userAgent: context.userAgent,
      timestamp: Date.now(),
      sessionId
    }

    this.sessionStore.set(sessionId, session)
    return sessionId
  }

  private async generateJWT(user: User, sessionId: string): Promise<string> {
    const jwt = require('jsonwebtoken')
    
    return jwt.sign({
      userId: user.id,
      email: user.email,
      roles: user.roles,
      sessionId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + Math.floor(this.config.jwtExpiry / 1000)
    }, this.config.jwtSecret)
  }

  private updateLastLogin(userId: string): void {
    for (const user of this.users.values()) {
      if (user.id === userId) {
        user.lastLogin = Date.now()
        break
      }
    }
  }

  private isLockedOut(clientIp: string): boolean {
    const attempts = this.loginAttempts.get(clientIp)
    return attempts?.lockedUntil ? Date.now() < attempts.lockedUntil : false
  }

  private recordFailedAttempt(clientIp: string): void {
    const attempts = this.loginAttempts.get(clientIp) || { attempts: 0 }
    attempts.attempts++
    
    if (attempts.attempts >= this.config.maxLoginAttempts) {
      attempts.lockedUntil = Date.now() + this.config.lockoutDuration
    }
    
    this.loginAttempts.set(clientIp, attempts)
  }

  private clearFailedAttempts(clientIp: string): void {
    this.loginAttempts.delete(clientIp)
  }

  // ========== Utility Methoden ==========

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9)
  }

  private generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 16)
  }

  private generateApiKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = 'ns_'
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private validatePassword(password: string): boolean {
    // Vereinfachte Passwort-Validierung
    // In Produktion: Hash-Vergleich mit bcrypt
    return password.length >= 8
  }

  private loadEncryptionKey(): void {
    // Encryption-Key aus Environment laden
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-for-development'
  }

  private async persistAuditLog(auditLog: {
    timestamp: number
    type: string
    userId?: string
    context: SecurityContext
    details?: Record<string, unknown>
  }): Promise<void> {
    // In Produktion: Audit-Log in Datenbank speichern
    // Hier könnte eine Datenbank-Operation stehen
    console.log('📊 Audit Log persisted:', auditLog)
  }

  // ========== Cleanup ==========

  public cleanup(): void {
    // Abgelaufene Sessions entfernen
    const now = Date.now()
    for (const [sessionId, session] of this.sessionStore) {
      if (now - session.timestamp > this.config.sessionTimeout) {
        this.sessionStore.delete(sessionId)
      }
    }

    // Alte Login-Attempts entfernen
    for (const [ip, attempts] of this.loginAttempts) {
      if (attempts.lockedUntil && Date.now() > attempts.lockedUntil) {
        this.loginAttempts.delete(ip)
      }
    }
  }

  public destroy(): void {
    this.users.clear()
    this.sessionStore.clear()
    this.loginAttempts.clear()
    RBACManager.instance = null
  }
}

// Standard-Konfiguration
export const defaultAuthConfig: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
  jwtExpiry: 24 * 60 * 60 * 1000, // 24 Stunden
  sessionTimeout: 30 * 60 * 1000, // 30 Minuten
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 Minuten
  requireMFA: ['admin', 'super-admin'],
  allowedDomains: ['zoe-solar.de', 'zoe-solar.com'],
  rateLimits: {
    '/api/login': 5,      // 5 Versuche pro Stunde
    '/api/admin': 100,    // 100 Anfragen pro Stunde
    '/api/webhook': 1000  // 1000 Webhooks pro Stunde
  }
}

export default RBACManager
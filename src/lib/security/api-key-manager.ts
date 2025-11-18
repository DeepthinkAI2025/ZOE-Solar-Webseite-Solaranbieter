// 🔑 Sichere API-Key-Verwaltung für Notion-Integration
// Verschlüsselung, Rotation und sichere Speicherung von API-Schlüsseln

import crypto from 'crypto'

export interface ApiKeyInfo {
  id: string
  name: string
  createdAt: number
  lastUsed?: number
  expiresAt?: number
  permissions: ApiKeyPermission[]
  isActive: boolean
  usageCount: number
  metadata?: Record<string, unknown>
}

export type ApiKeyPermission = 
  | 'notion:read'
  | 'notion:write'
  | 'notion:webhook'
  | 'notion:admin'
  | 'notion:images'
  | 'notion:users'

export interface ApiKeyConfig {
  encryptionAlgorithm: 'aes-256-gcm' | 'aes-256-cbc'
  rotationInterval: number // Tage
  maxKeysPerUser: number
  requireRotation: boolean
  allowedOrigins: string[]
  rateLimits: Record<ApiKeyPermission, number>
  auditLogging: boolean
}

interface EncryptedKey {
  key: string
  iv: string
  authTag: string
  encryptedData: string
}

interface ApiKeyRecord {
  id: string
  userId: string
  encryptedKey: EncryptedKey
  metadata: ApiKeyInfo
  createdAt: number
}

export class ApiKeyManager {
  private static instance: ApiKeyManager
  private config: ApiKeyConfig
  private keys = new Map<string, ApiKeyRecord>()
  private keyRotationSchedule = new Map<string, NodeJS.Timeout>()
  private encryptionKey: string
  private crypto: typeof crypto

  private constructor(config: ApiKeyConfig) {
    this.config = config
    this.crypto = crypto
    this.encryptionKey = this.getOrCreateEncryptionKey()
    this.startRotationSchedule()
  }

  public static getInstance(config: ApiKeyConfig): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager(config)
    }
    return ApiKeyManager.instance
  }

  // ========== API Key Management ==========

  /**
   * Neuen API-Schlüssel erstellen
   */
  async createApiKey(userId: string, keyInfo: {
    name: string
    permissions: ApiKeyPermission[]
    expiresInDays?: number
    metadata?: Record<string, unknown>
  }): Promise<{
    success: boolean
    apiKey?: string
    keyInfo?: ApiKeyInfo
    error?: string
  }> {
    try {
      // Berechtigungen validieren
      if (!this.validatePermissions(keyInfo.permissions)) {
        return { success: false, error: 'Ungültige Berechtigungen' }
      }

      // Schlüssel-Limit prüfen
      if (this.getKeysByUser(userId).length >= this.config.maxKeysPerUser) {
        return { success: false, error: 'Maximale Anzahl an API-Schlüsseln erreicht' }
      }

      // Zufälligen API-Schlüssel generieren
      const apiKey = this.generateApiKey()
      const expiresAt = keyInfo.expiresInDays 
        ? Date.now() + (keyInfo.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined

      // Schlüssel verschlüsseln
      const encryptedKey = await this.encryptApiKey(apiKey)

      // Metadaten erstellen
      const keyMetadata: ApiKeyInfo = {
        id: this.generateKeyId(),
        name: keyInfo.name,
        createdAt: Date.now(),
        lastUsed: undefined,
        expiresAt,
        permissions: keyInfo.permissions,
        isActive: true,
        usageCount: 0,
        metadata: keyInfo.metadata
      }

      // Datensatz erstellen
      const record: ApiKeyRecord = {
        id: keyMetadata.id,
        userId,
        encryptedKey,
        metadata: keyMetadata,
        createdAt: Date.now()
      }

      // Speichern
      this.keys.set(keyMetadata.id, record)

      // Rotation einrichten
      this.scheduleRotation(keyMetadata.id)

      // Audit-Log
      if (this.config.auditLogging) {
        console.log(`🔑 API Key created: ${keyMetadata.id} for user: ${userId}`)
      }

      return {
        success: true,
        apiKey,
        keyInfo: keyMetadata
      }

    } catch (error) {
      console.error('Failed to create API key:', error)
      return { success: false, error: 'Fehler beim Erstellen des API-Schlüssels' }
    }
  }

  /**
   * API-Schlüssel validieren und entschlüsseln
   */
  async validateApiKey(apiKey: string): Promise<{
    valid: boolean
    keyInfo?: ApiKeyInfo
    permissions?: ApiKeyPermission[]
    error?: string
  }> {
    try {
      // Suche nach passendem verschlüsselten Schlüssel
      for (const record of this.keys.values()) {
        try {
          const decrypted = await this.decryptApiKey(record.encryptedKey)
          if (decrypted === apiKey) {
            // Prüfungen durchführen
            if (!record.metadata.isActive) {
              return { valid: false, error: 'API-Schlüssel ist deaktiviert' }
            }

            if (record.metadata.expiresAt && Date.now() > record.metadata.expiresAt) {
              return { valid: false, error: 'API-Schlüssel ist abgelaufen' }
            }

            // Letzten Zugriff aktualisieren
            record.metadata.lastUsed = Date.now()
            record.metadata.usageCount++

            return {
              valid: true,
              keyInfo: record.metadata,
              permissions: record.metadata.permissions
            }

          }
        } catch (_error) {
          // Entschlüsselung fehlgeschlagen - weiter suchen
          continue
        }
      }

      return { valid: false, error: 'Ungültiger API-Schlüssel' }

    } catch (error) {
      console.error('API key validation failed:', error)
      return { valid: false, error: 'Validierung fehlgeschlagen' }
    }
  }

  /**
   * API-Schlüssel deaktivieren
   */
  deactivateApiKey(keyId: string, userId: string): {
    success: boolean
    error?: string
  } {
    const record = this.keys.get(keyId)
    if (!record || record.userId !== userId) {
      return { success: false, error: 'API-Schlüssel nicht gefunden' }
    }

    record.metadata.isActive = false
    this.cancelRotation(keyId)

    if (this.config.auditLogging) {
      console.log(`🔑 API Key deactivated: ${keyId}`)
    }

    return { success: true }
  }

  /**
   * API-Schlüssel löschen
   */
  deleteApiKey(keyId: string, userId: string): {
    success: boolean
    error?: string
  } {
    const record = this.keys.get(keyId)
    if (!record || record.userId !== userId) {
      return { success: false, error: 'API-Schlüssel nicht gefunden' }
    }

    this.keys.delete(keyId)
    this.cancelRotation(keyId)

    if (this.config.auditLogging) {
      console.log(`🗑️ API Key deleted: ${keyId}`)
    }

    return { success: true }
  }

  /**
   * API-Schlüssel erneuern (rotieren)
   */
  async rotateApiKey(keyId: string, userId: string): Promise<{
    success: boolean
    apiKey?: string
    error?: string
  }> {
    const record = this.keys.get(keyId)
    if (!record || record.userId !== userId) {
      return { success: false, error: 'API-Schlüssel nicht gefunden' }
    }

    // Neuen Schlüssel generieren
    const newApiKey = this.generateApiKey()
    const newEncryptedKey = await this.encryptApiKey(newApiKey)

    // Alten Schlüssel ersetzen
    record.encryptedKey = newEncryptedKey
    record.metadata.createdAt = Date.now() // Reset für Rotation
    record.metadata.lastUsed = undefined

    // Rotation neu einplanen
    this.cancelRotation(keyId)
    this.scheduleRotation(keyId)

    if (this.config.auditLogging) {
      console.log(`🔄 API Key rotated: ${keyId}`)
    }

    return {
      success: true,
      apiKey: newApiKey
    }
  }

  // ========== Permission Management ==========

  /**
   * Berechtigung prüfen
   */
  hasPermission(keyInfo: ApiKeyInfo, permission: ApiKeyPermission): boolean {
    return keyInfo.permissions.includes(permission)
  }

  /**
   * Rate-Limiting prüfen
   */
  checkRateLimit(permission: ApiKeyPermission, _keyId: string): boolean {
    // Vereinfachte Rate-Limiting-Implementierung
    // In Produktion: Redis oder ähnliches für distributed rate limiting verwenden
    const _limit = this.config.rateLimits[permission]
    // Hier würde die tatsächliche Rate-Limiting-Logik stehen
    return true // Für Demo immer erlauben
  }

  /**
   * API-Schlüssel eines Benutzers abrufen
   */
  getUserApiKeys(userId: string): ApiKeyInfo[] {
    return this.getKeysByUser(userId).map(record => record.metadata)
  }

  // ========== Encryption & Security ==========

  private async encryptApiKey(apiKey: string): Promise<EncryptedKey> {
    const iv = this.crypto.randomBytes(16)
    const key = this.getOrCreateEncryptionKey()

    const cipher = this.crypto.createCipherGCM(key, iv)
    let encrypted = cipher.update(apiKey, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()

    return {
      key: this.crypto.createHash('sha256').update(key).digest('hex'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      encryptedData: encrypted
    }
  }

  private async decryptApiKey(encryptedKey: EncryptedKey): Promise<string> {
    const key = this.getOrCreateEncryptionKey()
    const providedKeyHash = this.crypto.createHash('sha256').update(key).digest('hex')
    
    if (providedKeyHash !== encryptedKey.key) {
      throw new Error('Invalid encryption key')
    }

    const iv = Buffer.from(encryptedKey.iv, 'hex')
    const authTag = Buffer.from(encryptedKey.authTag, 'hex')
    const encrypted = encryptedKey.encryptedData

    const decipher = this.crypto.createDecipherGCM(key, iv, authTag)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }

  private getOrCreateEncryptionKey(): string {
    if (this.encryptionKey) {
      return this.encryptionKey
    }

    // Versuche aus Environment zu laden
    const envKey = process.env.API_KEY_ENCRYPTION_KEY
    if (envKey && envKey.length >= 32) {
      this.encryptionKey = envKey
      return this.encryptionKey
    }

    // Erstelle neuen Schlüssel
    this.encryptionKey = this.crypto.randomBytes(32).toString('hex')
    
    // In Produktion: Schlüssel sicher speichern (z.B. Vault, KMS)
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ API encryption key should be stored securely in production')
    }

    return this.encryptionKey
  }

  // ========== Rotation Management ==========

  private scheduleRotation(keyId: string): void {
    if (!this.config.requireRotation) return

    const record = this.keys.get(keyId)
    if (!record) return

    const rotateAt = record.metadata.expiresAt || 
      (record.createdAt + (this.config.rotationInterval * 24 * 60 * 60 * 1000))

    const delay = rotateAt - Date.now()
    if (delay <= 0) return // Rotation überfällig

    const timeoutId = setTimeout(() => {
      this.handleKeyRotation(keyId)
    }, delay)

    this.keyRotationSchedule.set(keyId, timeoutId)
  }

  private cancelRotation(keyId: string): void {
    const timeout = this.keyRotationSchedule.get(keyId)
    if (timeout) {
      clearTimeout(timeout)
      this.keyRotationSchedule.delete(keyId)
    }
  }

  private async handleKeyRotation(keyId: string): void {
    const record = this.keys.get(keyId)
    if (!record || !record.metadata.isActive) return

    try {
      // Automatische Rotation
      await this.rotateApiKey(keyId, record.userId)
      
      console.log(`🔄 Auto-rotated API key: ${keyId}`)

    } catch (error) {
      console.error(`Failed to auto-rotate API key ${keyId}:`, error)
    }
  }

  private startRotationSchedule(): void {
    // Prüfe alle 24h auf überfällige Rotationen
    setInterval(() => {
      const now = Date.now()
      for (const [keyId, record] of this.keys) {
        if (!record.metadata.isActive) continue

        const rotateAt = record.metadata.expiresAt || 
          (record.createdAt + (this.config.rotationInterval * 24 * 60 * 60 * 1000))

        if (now > rotateAt) {
          this.handleKeyRotation(keyId)
        }
      }
    }, 24 * 60 * 60 * 1000) // 24 Stunden
  }

  // ========== Validation & Security ==========

  private validatePermissions(permissions: ApiKeyPermission[]): boolean {
    const allowedPermissions: ApiKeyPermission[] = [
      'notion:read',
      'notion:write', 
      'notion:webhook',
      'notion:admin',
      'notion:images',
      'notion:users'
    ]

    return permissions.every(p => allowedPermissions.includes(p))
  }

  private getKeysByUser(userId: string): ApiKeyRecord[] {
    return Array.from(this.keys.values()).filter(record => record.userId === userId)
  }

  private generateApiKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = 'ns_'
    for (let i = 0; i < 48; i++) { // 48 + 3 = 51 Zeichen
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private generateKeyId(): string {
    return 'key_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // ========== Maintenance ==========

  /**
   * Abgelaufene API-Schlüssel bereinigen
   */
  cleanupExpiredKeys(): { removed: number } {
    const now = Date.now()
    let removed = 0

    for (const [keyId, record] of this.keys) {
      if (record.metadata.expiresAt && now > record.metadata.expiresAt) {
        this.keys.delete(keyId)
        this.cancelRotation(keyId)
        removed++
      }
    }

    if (removed > 0) {
      console.log(`🧹 Cleaned up ${removed} expired API keys`)
    }

    return { removed }
  }

  /**
   * Statistiken abrufen
   */
  getStats(): {
    totalKeys: number
    activeKeys: number
    expiredKeys: number
    keysByUser: Record<string, number>
    keysByPermission: Record<ApiKeyPermission, number>
  } {
    const stats = {
      totalKeys: this.keys.size,
      activeKeys: 0,
      expiredKeys: 0,
      keysByUser: {} as Record<string, number>,
      keysByPermission: {
        'notion:read': 0,
        'notion:write': 0,
        'notion:webhook': 0,
        'notion:admin': 0,
        'notion:images': 0,
        'notion:users': 0
      } as Record<ApiKeyPermission, number>
    }

    const now = Date.now()

    for (const record of this.keys.values()) {
      // Aktiv/Abgelaufen
      if (record.metadata.isActive) {
        stats.activeKeys++
      } else {
        stats.expiredKeys++
      }

      if (record.metadata.expiresAt && now > record.metadata.expiresAt) {
        stats.expiredKeys++
      }

      // Nach User
      const userId = record.userId
      stats.keysByUser[userId] = (stats.keysByUser[userId] || 0) + 1

      // Nach Berechtigung
      record.metadata.permissions.forEach(permission => {
        stats.keysByPermission[permission]++
      })
    }

    return stats
  }

  /**
   * Export für Backup (verschlüsselt)
   */
  exportKeys(): string {
    const exportData = Array.from(this.keys.values()).map(record => ({
      ...record,
      metadata: {
        ...record.metadata,
        // Entferne sensitive Daten für Export
        lastUsed: undefined,
        usageCount: 0
      }
    }))

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * Alle Daten löschen (Cleanup)
   */
  clearAll(): void {
    // Rotation-Timer löschen
    for (const timeout of this.keyRotationSchedule.values()) {
      clearTimeout(timeout)
    }
    this.keyRotationSchedule.clear()

    // Keys löschen
    this.keys.clear()

    console.log('🗑️ All API keys cleared')
  }

  public destroy(): void {
    this.clearAll()
    ApiKeyManager.instance = null
  }
}

// Standard-Konfiguration
export const defaultApiKeyConfig: ApiKeyConfig = {
  encryptionAlgorithm: 'aes-256-gcm',
  rotationInterval: 90, // 90 Tage
  maxKeysPerUser: 10,
  requireRotation: true,
  allowedOrigins: [
  process.env.NEXT_PUBLIC_SITE_URL || 'https://zoe-solar.de',
  'https://zoe-solar.vercel.app',
  'https://zoe-solar-*.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
],
  rateLimits: {
    'notion:read': 1000,     // 1000 Anfragen pro Stunde
    'notion:write': 100,     // 100 Schreib-Operationen pro Stunde
    'notion:webhook': 500,   // 500 Webhooks pro Stunde
    'notion:admin': 50,      // 50 Admin-Operationen pro Stunde
    'notion:images': 200,    // 200 Bild-Operationen pro Stunde
    'notion:users': 100      // 100 Benutzer-Operationen pro Stunde
  },
  auditLogging: true
}

export default ApiKeyManager
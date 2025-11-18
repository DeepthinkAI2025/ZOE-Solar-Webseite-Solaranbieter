// Admin Authentication & Authorization Service für ZOE Solar
// Rollenbasiertes Berechtigungssystem mit Notion Integration

import { Client } from '@notionhq/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'marketing_manager' | 'sales_manager' | 'content_editor' | 'viewer';
  permissions: string[];
  lastLogin?: string;
  isActive: boolean;
  department?: string;
  avatar?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'marketing' | 'sales' | 'analytics' | 'admin' | 'system';
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'publish' | 'archive';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: number; // 1-5, higher = more permissions
  isActive: boolean;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
  permissions: string[];
}

class AdminAuthService {
  private notion: Client;
  private usersDbId: string;
  private rolesDbId: string;
  private sessions: Map<string, Session> = new Map();
  private sessionTimeout = 24 * 60 * 60 * 1000; // 24 Stunden

  constructor() {
    this.notion = new Client({
      auth: import.meta.env.VITE_NOTION_TOKEN,
    });
    this.usersDbId = import.meta.env.VITE_NOTION_USERS_DB || '';
    this.rolesDbId = import.meta.env.VITE_NOTION_ROLES_DB || '';

    // Session cleanup
    setInterval(() => this.cleanupExpiredSessions(), 60 * 60 * 1000); // Alle Stunden
  }

  // Standard Permissions Definition
  private getStandardPermissions(): Permission[] {
    return [
      // Content Permissions
      { id: 'content_create', name: 'Content erstellen', description: 'Neue Inhalte erstellen', category: 'content', resource: 'content', action: 'create' },
      { id: 'content_read', name: 'Content lesen', description: 'Inhalte einsehen', category: 'content', resource: 'content', action: 'read' },
      { id: 'content_update', name: 'Content bearbeiten', description: 'Inhalte bearbeiten', category: 'content', resource: 'content', action: 'update' },
      { id: 'content_delete', name: 'Content löschen', description: 'Inhalte löschen', category: 'content', resource: 'content', action: 'delete' },
      { id: 'content_publish', name: 'Content veröffentlichen', description: 'Inhalte veröffentlichen', category: 'content', resource: 'content', action: 'publish' },

      // Marketing Permissions
      { id: 'marketing_create', name: 'Marketing Assets erstellen', description: 'Marketing Assets erstellen', category: 'marketing', resource: 'marketing', action: 'create' },
      { id: 'marketing_read', name: 'Marketing Assets lesen', description: 'Marketing Assets einsehen', category: 'marketing', resource: 'marketing', action: 'read' },
      { id: 'marketing_update', name: 'Marketing Assets bearbeiten', description: 'Marketing Assets bearbeiten', category: 'marketing', resource: 'marketing', action: 'update' },
      { id: 'marketing_delete', name: 'Marketing Assets löschen', description: 'Marketing Assets löschen', category: 'marketing', resource: 'marketing', action: 'delete' },
      { id: 'marketing_publish', name: 'Kampagnen veröffentlichen', description: 'Marketing Kampagnen veröffentlichen', category: 'marketing', resource: 'marketing', action: 'publish' },
      { id: 'ab_testing', name: 'A/B Testing', description: 'A/B Tests durchführen', category: 'marketing', resource: 'ab_testing', action: 'create' },

      // Sales Permissions
      { id: 'leads_read', name: 'Leads lesen', description: 'Leads einsehen', category: 'sales', resource: 'leads', action: 'read' },
      { id: 'leads_update', name: 'Leads bearbeiten', description: 'Leads bearbeiten', category: 'sales', resource: 'leads', action: 'update' },
      { id: 'leads_assign', name: 'Leads zuweisen', description: 'Leads zuweisen', category: 'sales', resource: 'leads', action: 'update' },
      { id: 'analytics_read', name: 'Analytics lesen', description: 'Analytics Daten einsehen', category: 'analytics', resource: 'analytics', action: 'read' },

      // Admin Permissions
      { id: 'users_create', name: 'Benutzer erstellen', description: 'Neue Benutzer erstellen', category: 'admin', resource: 'users', action: 'create' },
      { id: 'users_read', name: 'Benutzer lesen', description: 'Benutzer einsehen', category: 'admin', resource: 'users', action: 'read' },
      { id: 'users_update', name: 'Benutzer bearbeiten', description: 'Benutzer bearbeiten', category: 'admin', resource: 'users', action: 'update' },
      { id: 'users_delete', name: 'Benutzer löschen', description: 'Benutzer löschen', category: 'admin', resource: 'users', action: 'delete' },
      { id: 'roles_manage', name: 'Rollen verwalten', description: 'Benutzerrollen verwalten', category: 'admin', resource: 'roles', action: 'update' },

      // System Permissions
      { id: 'system_config', name: 'System Konfiguration', description: 'Systemeinstellungen bearbeiten', category: 'system', resource: 'system', action: 'update' },
      { id: 'system_backup', name: 'System Backup', description: 'System Backups erstellen', category: 'system', resource: 'system', action: 'create' },
      { id: 'system_logs', name: 'System Logs', description: 'System Logs einsehen', category: 'system', resource: 'system', action: 'read' }
    ];
  }

  // Standard Roles Definition
  private getStandardRoles(): Role[] {
    const allPermissions = this.getStandardPermissions();

    return [
      {
        id: 'super_admin',
        name: 'Super Admin',
        description: 'Vollzugriff auf alle Systemfunktionen',
        permissions: allPermissions.map(p => p.id),
        level: 5,
        isActive: true
      },
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Administrative Berechtigungen ohne System-Zugriff',
        permissions: allPermissions.filter(p => p.category !== 'system').map(p => p.id),
        level: 4,
        isActive: true
      },
      {
        id: 'marketing_manager',
        name: 'Marketing Manager',
        description: 'Vollzugriff auf Marketing-Funktionen',
        permissions: [
          ...allPermissions.filter(p => p.category === 'marketing').map(p => p.id),
          ...allPermissions.filter(p => p.category === 'content' && ['create', 'read', 'update', 'publish'].includes(p.action)).map(p => p.id),
          ...allPermissions.filter(p => p.category === 'analytics' && p.action === 'read').map(p => p.id)
        ],
        level: 3,
        isActive: true
      },
      {
        id: 'sales_manager',
        name: 'Sales Manager',
        description: 'Zugriff auf Leads und Analytics',
        permissions: [
          ...allPermissions.filter(p => p.category === 'sales').map(p => p.id),
          ...allPermissions.filter(p => p.category === 'analytics' && p.action === 'read').map(p => p.id),
          'content_read', 'marketing_read'
        ],
        level: 3,
        isActive: true
      },
      {
        id: 'content_editor',
        name: 'Content Editor',
        description: 'Inhalte erstellen und bearbeiten',
        permissions: [
          ...allPermissions.filter(p => p.category === 'content' && p.action !== 'delete').map(p => p.id),
          'marketing_read', 'analytics_read'
        ],
        level: 2,
        isActive: true
      },
      {
        id: 'viewer',
        name: 'Viewer',
        description: 'Nur Leseberechtigungen',
        permissions: [
          'content_read', 'marketing_read', 'leads_read', 'analytics_read'
        ],
        level: 1,
        isActive: true
      }
    ];
  }

  /**
   * Benutzer authentifizieren
   */
  async authenticate(email: string, _password: string): Promise<Session | null> {
    try {
      // In einer echten Implementierung hier Passwort-Hash-Check
      // Für Demo-Zwecke simulieren wir die Authentifizierung

      const users = await this.getUsers();
      const user = users.find(u => u.email === email && u.isActive);

      if (!user) {
        return null;
      }

      // Session erstellen
      const token = this.generateToken();
      const session: Session = {
        user,
        token,
        expiresAt: new Date(Date.now() + this.sessionTimeout),
        permissions: await this.getUserPermissions(user.id)
      };

      this.sessions.set(token, session);

      // Last Login aktualisieren
      await this.updateLastLogin(user.id);

      return session;

    } catch (error) {
      console.error('❌ Authentifizierung fehlgeschlagen:', error);
      return null;
    }
  }

  /**
   * Session validieren
   */
  validateSession(token: string): Session | null {
    const session = this.sessions.get(token);

    if (!session || session.expiresAt < new Date()) {
      this.sessions.delete(token);
      return null;
    }

    // Session verlängern
    session.expiresAt = new Date(Date.now() + this.sessionTimeout);

    return session;
  }

  /**
   * Berechtigung prüfen
   */
  hasPermission(user: User, permission: string): boolean {
    return user.permissions.includes(permission);
  }

  /**
   * Multi-Berechtigung prüfen
   */
  hasAnyPermission(user: User, permissions: string[]): boolean {
    return permissions.some(permission => user.permissions.includes(permission));
  }

  /**
   * Alle Berechtigungen prüfen
   */
  hasAllPermissions(user: User, permissions: string[]): boolean {
    return permissions.every(permission => user.permissions.includes(permission));
  }

  /**
   * Benutzer abrufen
   */
  async getUsers(): Promise<User[]> {
    try {
      if (!this.usersDbId) {
        return this.getDemoUsers();
      }

      const response = await this.notion.databases.query({
        database_id: this.usersDbId,
        sorts: [
          {
            property: 'Name',
            direction: 'ascending'
          }
        ]
      });

      return response.results.map((page: unknown) => this.mapNotionPageToUser(page));

    } catch (error) {
      console.error('❌ Fehler beim Abrufen der Benutzer:', error);
      return this.getDemoUsers();
    }
  }

  /**
   * Benutzer erstellen
   */
  async createUser(user: Omit<User, 'id'>): Promise<string> {
    try {
      if (!this.usersDbId) {
        throw new Error('Users Datenbank nicht konfiguriert');
      }

      const notionPage = {
        parent: {
          type: 'database_id',
          database_id: this.usersDbId
        },
        properties: {
          'Email': {
            title: [
              { text: { content: user.email } }
            ]
          },
          'Name': {
            rich_text: [
              { text: { content: user.name } }
            ]
          },
          'Rolle': {
            select: { name: user.role }
          },
          'Abteilung': {
            rich_text: [
              { text: { content: user.department || '' } }
            ]
          },
          'Status': {
            select: { name: user.isActive ? 'Aktiv' : 'Inaktiv' }
          },
          'Letzter Login': {
            date: user.lastLogin ? { start: user.lastLogin } : null
          }
        }
      };

      const response = await this.notion.pages.create(notionPage);
      return response.id;

    } catch (error) {
      console.error('❌ Fehler beim Erstellen des Benutzers:', error);
      throw error;
    }
  }

  /**
   * Benutzer aktualisieren
   */
  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    try {
      if (!this.usersDbId) {
        throw new Error('Users Datenbank nicht konfiguriert');
      }

      const updateData: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

      if (updates.name) {
        updateData['Name'] = {
          rich_text: [
            { text: { content: updates.name } }
          ]
        };
      }

      if (updates.role) {
        updateData['Rolle'] = {
          select: { name: updates.role }
        };
      }

      if (updates.department) {
        updateData['Abteilung'] = {
          rich_text: [
            { text: { content: updates.department } }
          ]
        };
      }

      if (updates.isActive !== undefined) {
        updateData['Status'] = {
          select: { name: updates.isActive ? 'Aktiv' : 'Inaktiv' }
        };
      }

      await this.notion.pages.update({
        page_id: id,
        properties: updateData
      });

    } catch (error) {
      console.error('❌ Fehler beim Aktualisieren des Benutzers:', error);
      throw error;
    }
  }

  /**
   * Benutzer-Berechtigungen abrufen
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.id === userId);

      if (!user) {
        return [];
      }

      const roles = this.getStandardRoles();
      const userRole = roles.find(r => r.id === user.role);

      return userRole?.permissions || [];

    } catch (error) {
      console.error('❌ Fehler beim Abrufen der Benutzer-Berechtigungen:', error);
      return [];
    }
  }

  /**
   * Logout
   */
  logout(token: string): void {
    this.sessions.delete(token);
  }

  /**
   * Aktive Sessions abrufen
   */
  getActiveSessions(): Session[] {
    const now = new Date();
    return Array.from(this.sessions.values()).filter(session => session.expiresAt > now);
  }

  // Private Helper Methods
  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      if (!this.usersDbId) return;

      await this.notion.pages.update({
        page_id: userId,
        properties: {
          'Letzter Login': {
            date: { start: new Date().toISOString() }
          }
        }
      });

    } catch (error) {
      console.warn('⚠️ Last Login konnte nicht aktualisiert werden:', error);
    }
  }

  private cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [token, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(token);
      }
    }
  }

  private mapNotionPageToUser(page: any): User { // eslint-disable-line @typescript-eslint/no-explicit-any
    const properties = page.properties;

    return {
      id: page.id,
      email: properties['Email']?.title?.[0]?.plain_text || '',
      name: properties['Name']?.rich_text?.[0]?.plain_text || '',
      role: (properties['Rolle']?.select?.name as 'super_admin' | 'admin' | 'marketing_manager' | 'sales_manager' | 'content_editor' | 'viewer') || 'viewer',
      permissions: [], // Wird dynamisch geladen
      lastLogin: properties['Letzter Login']?.date?.start,
      isActive: properties['Status']?.select?.name === 'Aktiv',
      department: properties['Abteilung']?.rich_text?.[0]?.plain_text,
      avatar: properties['Avatar']?.files?.[0]?.external?.url
    };
  }

  private getDemoUsers(): User[] {
    return [
      {
        id: 'demo-super-admin',
        email: 'admin@zoe-solar.de',
        name: 'Max Mustermann',
        role: 'super_admin',
        permissions: this.getStandardPermissions().map(p => p.id),
        isActive: true,
        department: 'Management'
      },
      {
        id: 'demo-marketing-manager',
        email: 'marketing@zoe-solar.de',
        name: 'Sarah Marketing',
        role: 'marketing_manager',
        permissions: this.getStandardRoles().find(r => r.id === 'marketing_manager')?.permissions || [],
        isActive: true,
        department: 'Marketing'
      },
      {
        id: 'demo-sales-manager',
        email: 'sales@zoe-solar.de',
        name: 'Tom Sales',
        role: 'sales_manager',
        permissions: this.getStandardRoles().find(r => r.id === 'sales_manager')?.permissions || [],
        isActive: true,
        department: 'Sales'
      }
    ];
  }

  // Public getters für Rollen und Berechtigungen
  getAllRoles(): Role[] {
    return this.getStandardRoles();
  }

  getAllPermissions(): Permission[] {
    return this.getStandardPermissions();
  }
}

// Singleton instance
export const adminAuthService = new AdminAuthService();

// Export types
export type { User, Permission, Role, Session };
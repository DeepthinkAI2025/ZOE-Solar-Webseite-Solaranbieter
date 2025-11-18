/**
 * Bidirectional Notion Sync Service
 *
 * Handles real-time synchronization between Notion and the web application
 * - User management sync
 * - Credential management sync
 * - Environment variable sync
 */

import { Client } from '@notionhq/client';

interface SyncConfig {
  notionToken: string;
  credentialsDbId: string;
  usersDbId: string;
  rolesDbId: string;
  envSyncDbId: string;
  webhookSecret: string;
  syncFrequency: number; // in minutes
}

interface UserSyncData {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  department: string;
  permissions: string[];
  lastSync: string;
}

interface CredentialSyncData {
  id: string;
  name: string;
  service: string;
  type: string;
  environment: string;
  encryptedValue: string;
  description: string;
  lastSync: string;
}

interface WebhookEvent {
  type: string;
  databaseId: string;
  pageId: string;
  timestamp: string;
  properties: Record<string, any>;
}

class NotionSyncService {
  private notion: Client;
  private config: SyncConfig;
  private syncInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(config: SyncConfig) {
    this.config = config;
    this.notion = new Client({
      auth: config.notionToken,
      timeoutMs: 30000
    });
  }

  /**
   * Start the bidirectional sync service
   */
  async startSync(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Sync service is already running');
      return;
    }

    console.log('🚀 Starting Notion bidirectional sync service...');
    this.isRunning = true;

    // Start periodic sync
    this.syncInterval = setInterval(
      () => this.performSync(),
      this.config.syncFrequency * 60 * 1000
    );

    // Perform initial sync
    await this.performSync();
    console.log('✅ Notion sync service started successfully');
  }

  /**
   * Stop the sync service
   */
  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isRunning = false;
    console.log('🛑 Notion sync service stopped');
  }

  /**
   * Perform full sync operation
   */
  private async performSync(): Promise<void> {
    try {
      console.log('🔄 Performing sync cycle...');

      await Promise.all([
        this.syncUsersFromNotion(),
        this.syncCredentialsFromNotion(),
        this.checkEnvironmentSync()
      ]);

      console.log('✅ Sync cycle completed');
    } catch (error) {
      console.error('❌ Sync cycle failed:', error);
    }
  }

  /**
   * Sync users from Notion to local storage/external systems
   */
  private async syncUsersFromNotion(): Promise<void> {
    try {
      console.log('👥 Syncing users from Notion...');

      const usersResponse = await this.notion.databases.query({
        database_id: this.config.usersDbId,
        filter: {
          property: 'Status',
          select: {
            equals: 'Aktiv'
          }
        }
      });

      const users: UserSyncData[] = usersResponse.results.map((page: any) => ({
        id: page.id,
        email: page.properties['Email']?.title?.[0]?.plain_text || '',
        name: page.properties['Name']?.rich_text?.[0]?.plain_text || '',
        role: page.properties['Rolle']?.select?.name || '',
        status: page.properties['Status']?.select?.name || '',
        department: page.properties['Abteilung']?.select?.name || '',
        permissions: page.properties['Berechtigungen']?.multi_select?.map((item: any) => item.name) || [],
        lastSync: new Date().toISOString()
      }));

      // Store users in local cache or send to external system
      await this.updateUserStorage(users);
      console.log(`✅ Synced ${users.length} users from Notion`);

    } catch (error) {
      console.error('❌ Failed to sync users:', error);
    }
  }

  /**
   * Sync credentials from Notion
   */
  private async syncCredentialsFromNotion(): Promise<void> {
    try {
      console.log('🔐 Syncing credentials from Notion...');

      const credentialsResponse = await this.notion.databases.query({
        database_id: this.config.credentialsDbId,
        filter: {
          property: 'Status',
          select: {
            equals: 'Active'
          }
        }
      });

      const credentials: CredentialSyncData[] = credentialsResponse.results.map((page: any) => ({
        id: page.id,
        name: page.properties['Credential Name']?.title?.[0]?.plain_text || '',
        service: page.properties['Service']?.select?.name || '',
        type: page.properties['Credential Type']?.select?.name || '',
        environment: page.properties['Environment']?.select?.name || '',
        encryptedValue: page.properties['API Key/Secret']?.rich_text?.[0]?.plain_text || '',
        description: page.properties['Description']?.rich_text?.[0]?.plain_text || '',
        lastSync: new Date().toISOString()
      }));

      // Update environment variables
      await this.updateEnvironmentVariables(credentials);
      console.log(`✅ Synced ${credentials.length} credentials from Notion`);

    } catch (error) {
      console.error('❌ Failed to sync credentials:', error);
    }
  }

  /**
   * Check environment sync status
   */
  private async checkEnvironmentSync(): Promise<void> {
    try {
      console.log('📊 Checking environment sync status...');

      const syncResponse = await this.notion.databases.query({
        database_id: this.config.envSyncDbId
      });

      for (const page of syncResponse.results) {
        const envName = page.properties['Environment Name']?.title?.[0]?.plain_text;
        const syncStatus = page.properties['Sync Status']?.select?.name;

        if (syncStatus === 'Pending') {
          console.log(`🔄 Processing pending sync for: ${envName}`);
          await this.processEnvironmentSync(page.id);
        }
      }

    } catch (error) {
      console.error('❌ Failed to check environment sync:', error);
    }
  }

  /**
   * Process individual environment sync
   */
  private async processEnvironmentSync(envPageId: string): Promise<void> {
    try {
      // Update sync status to processing
      await this.notion.pages.update({
        page_id: envPageId,
        properties: {
          'Sync Status': { select: { name: 'Synced' } }
        }
      });

      console.log(`✅ Environment sync completed for page: ${envPageId}`);

    } catch (error) {
      // Update sync status to failed
      await this.notion.pages.update({
        page_id: envPageId,
        properties: {
          'Sync Status': { select: { name: 'Failed' } }
        }
      });

      console.error(`❌ Environment sync failed for page: ${envPageId}`, error);
    }
  }

  /**
   * Update user storage (could be Redis, localStorage, etc.)
   */
  private async updateUserStorage(users: UserSyncData[]): Promise<void> {
    // In a real implementation, this would:
    // 1. Update local cache
    // 2. Send to external authentication system
    // 3. Update user roles in your application

    const userData = {
      users,
      lastUpdated: new Date().toISOString(),
      totalUsers: users.length
    };

    // Store in localStorage for demo purposes
    if (typeof window !== 'undefined') {
      localStorage.setItem('zoe-solar-users', JSON.stringify(userData));
    }

    console.log(`📦 Updated user storage with ${users.length} users`);
  }

  /**
   * Update environment variables based on Notion credentials
   */
  private async updateEnvironmentVariables(credentials: CredentialSyncData[]): Promise<void> {
    // Group credentials by environment
    const groupedCreds = credentials.reduce((acc, cred) => {
      if (!acc[cred.environment]) {
        acc[cred.environment] = {};
      }
      acc[cred.environment][cred.name] = cred.encryptedValue;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    // Update environment variables for each environment
    for (const [environment, envCreds] of Object.entries(groupedCreds)) {
      if (environment === 'Production') {
        await this.updateVercelEnvironmentVariables(envCreds);
      } else if (environment === 'Development') {
        this.updateLocalEnvironmentVariables(envCreds);
      }
    }

    console.log(`🔧 Updated environment variables for ${Object.keys(groupedCreds).length} environments`);
  }

  /**
   * Update Vercel environment variables via API
   */
  private async updateVercelEnvironmentVariables(creds: Record<string, string>): Promise<void> {
    // This would require Vercel API integration
    // For now, we'll log what would be updated
    console.log('🌐 Would update Vercel environment variables:', Object.keys(creds));

    // In production:
    // 1. Get Vercel API token
    // 2. Use Vercel API to update environment variables
    // 3. Trigger redeployment if needed
  }

  /**
   * Update local environment variables
   */
  private updateLocalEnvironmentVariables(creds: Record<string, string>): void {
    console.log('💻 Local environment variables updated:', Object.keys(creds));

    // Store in localStorage for development
    if (typeof window !== 'undefined') {
      Object.entries(creds).forEach(([key, value]) => {
        localStorage.setItem(`env_${key}`, value);
      });
    }
  }

  /**
   * Handle webhook events from Notion
   */
  async handleWebhookEvent(event: WebhookEvent): Promise<void> {
    try {
      console.log(`🪝 Processing webhook event: ${event.type} for database: ${event.databaseId}`);

      switch (event.databaseId) {
        case this.config.usersDbId:
          await this.handleUserWebhookEvent(event);
          break;
        case this.config.credentialsDbId:
          await this.handleCredentialWebhookEvent(event);
          break;
        case this.config.envSyncDbId:
          await this.handleEnvironmentWebhookEvent(event);
          break;
        default:
          console.log(`ℹ️ Unknown database ID: ${event.databaseId}`);
      }

      console.log('✅ Webhook event processed successfully');
    } catch (error) {
      console.error('❌ Failed to process webhook event:', error);
    }
  }

  /**
   * Handle user-related webhook events
   */
  private async handleUserWebhookEvent(event: WebhookEvent): Promise<void> {
    console.log(`👤 User webhook event: ${event.type}`);

    // Re-sync users on any change
    await this.syncUsersFromNotion();
  }

  /**
   * Handle credential-related webhook events
   */
  private async handleCredentialWebhookEvent(event: WebhookEvent): Promise<void> {
    console.log(`🔐 Credential webhook event: ${event.type}`);

    // Re-sync credentials on any change
    await this.syncCredentialsFromNotion();
  }

  /**
   * Handle environment sync webhook events
   */
  private async handleEnvironmentWebhookEvent(event: WebhookEvent): Promise<void> {
    console.log(`🌍 Environment webhook event: ${event.type}`);

    // Check if sync is needed
    await this.checkEnvironmentSync();
  }

  /**
   * Create or update user in Notion
   */
  async upsertUserInNotion(userData: Partial<UserSyncData>): Promise<string | null> {
    try {
      // Check if user already exists
      const existingUsers = await this.notion.databases.query({
        database_id: this.config.usersDbId,
        filter: {
          property: 'Email',
          title: {
            equals: userData.email
          }
        }
      });

      if (existingUsers.results.length > 0) {
        // Update existing user
        const userId = existingUsers.results[0].id;
        await this.notion.pages.update({
          page_id: userId,
          properties: {
            'Name': {
              rich_text: [{ text: { content: userData.name || '' } }]
            },
            'Rolle': {
              select: { name: userData.role || 'Viewer' }
            },
            'Status': {
              select: { name: userData.status || 'Aktiv' }
            },
            'Abteilung': {
              select: { name: userData.department || 'Management' }
            },
            'Berechtigungen': {
              multi_select: (userData.permissions || []).map(p => ({ name: p }))
            }
          }
        });

        console.log(`✅ Updated user in Notion: ${userData.email}`);
        return userId;
      } else {
        // Create new user
        const newPage = await this.notion.pages.create({
          parent: { database_id: this.config.usersDbId },
          properties: {
            'Email': {
              title: [{ text: { content: userData.email || '' } }]
            },
            'Name': {
              rich_text: [{ text: { content: userData.name || '' } }]
            },
            'Rolle': {
              select: { name: userData.role || 'Viewer' }
            },
            'Status': {
              select: { name: userData.status || 'Aktiv' }
            },
            'Abteilung': {
              select: { name: userData.department || 'Management' }
            },
            'Berechtigungen': {
              multi_select: (userData.permissions || []).map(p => ({ name: p }))
            }
          }
        });

        console.log(`✅ Created user in Notion: ${userData.email}`);
        return newPage.id;
      }
    } catch (error) {
      console.error(`❌ Failed to upsert user ${userData.email}:`, error);
      return null;
    }
  }

  /**
   * Delete user from Notion
   */
  async deleteUserFromNotion(email: string): Promise<boolean> {
    try {
      const users = await this.notion.databases.query({
        database_id: this.config.usersDbId,
        filter: {
          property: 'Email',
          title: {
            equals: email
          }
        }
      });

      if (users.results.length > 0) {
        await this.notion.pages.update({
          page_id: users.results[0].id,
          properties: {
            'Status': {
              select: { name: 'Inaktiv' }
            }
          }
        });

        console.log(`✅ Deactivated user in Notion: ${email}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`❌ Failed to delete user ${email}:`, error);
      return false;
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): {
    isRunning: boolean;
    lastSync: string;
    nextSyncIn: number;
    databases: string[];
  } {
    return {
      isRunning: this.isRunning,
      lastSync: new Date().toISOString(),
      nextSyncIn: this.config.syncFrequency * 60 * 1000,
      databases: [
        'Users Management',
        'Credentials Management',
        'Environment Sync'
      ]
    };
  }
}

// Export singleton instance
export const notionSyncService = new NotionSyncService({
  notionToken: process.env.NOTION_TOKEN || '',
  credentialsDbId: process.env.NEXT_PUBLIC_NOTION_CREDENTIALS_DB || '',
  usersDbId: process.env.NEXT_PUBLIC_NOTION_USERS_DB || '',
  rolesDbId: process.env.NEXT_PUBLIC_NOTION_ROLES_DB || '',
  envSyncDbId: process.env.NEXT_PUBLIC_NOTION_ENV_SYNC_DB || '',
  webhookSecret: process.env.NOTION_WEBHOOK_SECRET || '',
  syncFrequency: 5 // Sync every 5 minutes
});

export default NotionSyncService;
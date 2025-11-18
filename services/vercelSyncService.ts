/**
 * Vercel Environment Variables Sync Service
 *
 * Provides bidirectional synchronization between Notion credentials and Vercel environment variables
 */

import { NotionAPI } from '../lib/notion/enhanced-client';

interface VercelEnvVar {
  key: string;
  value: string;
  target?: string[];
  type?: 'encrypted' | 'plain';
  gitBranch?: string;
}

interface VercelProject {
  id: string;
  name: string;
  framework?: string;
  link: {
    type: string;
    value: string;
  };
}

interface VercelAPIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class VercelSyncService {
  private projectId: string;
  private teamId?: string;
  private accessToken: string;
  private notionAPI: NotionAPI;

  constructor() {
    this.projectId = process.env.VERCEL_PROJECT_ID || '';
    this.teamId = process.env.VERCEL_TEAM_ID;
    this.accessToken = process.env.VERCEL_ACCESS_TOKEN || '';
    this.notionAPI = new NotionAPI();
  }

  /**
   * Get authentication headers for Vercel API
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    if (this.teamId) {
      headers['x-vercel-team-id'] = this.teamId;
    }

    return headers;
  }

  /**
   * Get project information
   */
  async getProjectInfo(): Promise<VercelAPIResponse<VercelProject>> {
    try {
      const response = await fetch(
        `https://api.vercel.com/v9/projects/${this.projectId}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Failed to get Vercel project info:', error);
      return { error: error.message };
    }
  }

  /**
   * Get all environment variables for the project
   */
  async getEnvironmentVariables(): Promise<VercelAPIResponse<VercelEnvVar[]>> {
    try {
      const url = this.teamId
        ? `https://api.vercel.com/v1/projects/${this.projectId}/env?teamId=${this.teamId}`
        : `https://api.vercel.com/v9/projects/${this.projectId}/env`;

      const response = await fetch(url, {
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch environment variables: ${response.status}`);
      }

      const data = await response.json();
      return { data: data.envs || [] };
    } catch (error) {
      console.error('Failed to fetch Vercel environment variables:', error);
      return { error: error.message };
    }
  }

  /**
   * Create or update an environment variable
   */
  async setEnvironmentVariable(
    key: string,
    value: string,
    options: {
      target?: string[];
      type?: 'encrypted' | 'plain';
      gitBranch?: string;
    } = {}
  ): Promise<VercelAPIResponse> {
    try {
      const url = this.teamId
        ? `https://api.vercel.com/v1/projects/${this.projectId}/env?teamId=${this.teamId}`
        : `https://api.vercel.com/v9/projects/${this.projectId}/env`;

      const payload = {
        key,
        value,
        target: options.target || ['production', 'preview', 'development'],
        type: options.type || 'encrypted',
        gitBranch: options.gitBranch,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to set environment variable: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Environment variable '${key}' set successfully in Vercel`);

      return { data, message: `Environment variable '${key}' updated successfully` };
    } catch (error) {
      console.error(`Failed to set environment variable '${key}':`, error);
      return { error: error.message };
    }
  }

  /**
   * Delete an environment variable
   */
  async deleteEnvironmentVariable(envId: string): Promise<VercelAPIResponse> {
    try {
      const url = this.teamId
        ? `https://api.vercel.com/v1/projects/${this.projectId}/env/${envId}?teamId=${this.teamId}`
        : `https://api.vercel.com/v9/projects/${this.projectId}/env/${envId}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete environment variable: ${response.status}`);
      }

      console.log(`✅ Environment variable deleted successfully from Vercel`);
      return { message: 'Environment variable deleted successfully' };
    } catch (error) {
      console.error('Failed to delete environment variable:', error);
      return { error: error.message };
    }
  }

  /**
   * Sync credentials from Notion to Vercel
   */
  async syncCredentialsFromNotion(): Promise<VercelAPIResponse & { syncedCount?: number }> {
    try {
      console.log('🔄 Starting credentials sync from Notion to Vercel...');

      // Get credentials from Notion
      const credentialsData = await this.notionAPI.getCredentialsData();

      if (!credentialsData || credentialsData.length === 0) {
        return { message: 'No credentials found in Notion to sync' };
      }

      let syncedCount = 0;
      const errors: string[] = [];

      // Process each credential
      for (const credential of credentialsData) {
        const { serviceName, apiKey, environment, isActive } = credential;

        if (!isActive || !apiKey) {
          continue; // Skip inactive or empty credentials
        }

        // Map service name to environment variable key
        const envKey = this.mapServiceToEnvKey(serviceName);

        if (!envKey) {
          errors.push(`Unknown service: ${serviceName}`);
          continue;
        }

        // Set environment variable in Vercel
        const result = await this.setEnvironmentVariable(envKey, apiKey, {
          target: environment === 'Production' ? ['production'] : ['preview', 'development'],
          type: 'encrypted'
        });

        if (result.error) {
          errors.push(`Failed to sync ${serviceName}: ${result.error}`);
        } else {
          syncedCount++;
        }
      }

      console.log(`✅ Credentials sync completed. Synced ${syncedCount} credentials.`);

      return {
        message: `Sync completed. ${syncedCount} credentials synced to Vercel.`,
        syncedCount,
        error: errors.length > 0 ? errors.join('; ') : undefined
      };

    } catch (error) {
      console.error('Failed to sync credentials from Notion:', error);
      return { error: error.message };
    }
  }

  /**
   * Sync a single credential from Notion to Vercel
   */
  async syncSingleCredential(credentialId: string): Promise<VercelAPIResponse> {
    try {
      // Get specific credential from Notion
      const credential = await this.notionAPI.getCredentialById(credentialId);

      if (!credential) {
        return { error: 'Credential not found in Notion' };
      }

      const { serviceName, apiKey, environment } = credential;
      const envKey = this.mapServiceToEnvKey(serviceName);

      if (!envKey) {
        return { error: `Unknown service: ${serviceName}` };
      }

      return await this.setEnvironmentVariable(envKey, apiKey, {
        target: environment === 'Production' ? ['production'] : ['preview', 'development'],
        type: 'encrypted'
      });

    } catch (error) {
      console.error('Failed to sync single credential:', error);
      return { error: error.message };
    }
  }

  /**
   * Map service names to environment variable keys
   */
  private mapServiceToEnvKey(serviceName: string): string | null {
    const mapping: Record<string, string> = {
      'Notion API': 'NOTION_SECRET',
      'Google Analytics': 'GOOGLE_ANALYTICS_ID',
      'Vercel API': 'VERCEL_ACCESS_TOKEN',
      'SendGrid': 'SENDGRID_API_KEY',
      'Stripe': 'STRIPE_SECRET_KEY',
      'Cloudinary': 'CLOUDINARY_URL',
      'Mailgun': 'MAILGUN_API_KEY',
      'AWS S3': 'AWS_ACCESS_KEY_ID',
      'OpenAI': 'OPENAI_API_KEY',
      'Firebase': 'FIREBASE_PRIVATE_KEY',
      'HubSpot': 'HUBSPOT_API_KEY',
      'Sentry': 'SENTRY_DSN',
      'MongoDB Atlas': 'MONGODB_URI',
      'PostgreSQL': 'DATABASE_URL',
      'Redis': 'REDIS_URL'
    };

    return mapping[serviceName] || null;
  }

  /**
   * Test Vercel API connection
   */
  async testConnection(): Promise<VercelAPIResponse & { project?: VercelProject }> {
    try {
      const projectInfo = await this.getProjectInfo();

      if (projectInfo.error) {
        return { error: `Vercel API connection failed: ${projectInfo.error}` };
      }

      return {
        message: 'Vercel API connection successful',
        project: projectInfo.data
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Get sync status between Notion and Vercel
   */
  async getSyncStatus(): Promise<{
    notionCredentials: number;
    vercelEnvVars: number;
    lastSync: string | null;
    connectionStatus: 'connected' | 'disconnected' | 'error';
  }> {
    try {
      // Get credentials count from Notion
      const notionData = await this.notionAPI.getCredentialsData();
      const notionCredentials = notionData?.length || 0;

      // Get environment variables count from Vercel
      const vercelData = await this.getEnvironmentVariables();
      const vercelEnvVars = vercelData.data?.length || 0;

      // Test connection
      const connectionTest = await this.testConnection();
      const connectionStatus = connectionTest.error ? 'error' : 'connected';

      return {
        notionCredentials,
        vercelEnvVars,
        lastSync: new Date().toISOString(),
        connectionStatus
      };
    } catch (error) {
      return {
        notionCredentials: 0,
        vercelEnvVars: 0,
        lastSync: null,
        connectionStatus: 'disconnected'
      };
    }
  }
}

// Singleton instance
export const vercelSyncService = new VercelSyncService();
export default vercelSyncService;
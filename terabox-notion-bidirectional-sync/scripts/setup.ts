#!/usr/bin/env ts-node

/**
 * Setup Script for TeraBox + Notion Sync
 * Interactive setup wizard for initial configuration
 */

import { createInterface } from 'readline';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { open } from 'open';

interface SetupConfig {
  terabox: {
    baseURL: string;
    username: string;
    password: string;
    targetFolder: string;
    watchSubfolders: boolean;
  };
  notion: {
    token: string;
    workspaceId: string;
    databaseName: string;
    restrictToWorkspace: boolean;
  };
  sync: {
    mode: 'bidirectional' | 'terabox_to_notion' | 'notion_to_terabox';
    conflictResolution: string;
    pollingInterval: number;
  };
  ocr: {
    enabled: boolean;
    baseURL: string;
  };
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function runSetup(): Promise<void> {
  console.log('🚀 TeraBox + Notion Sync Setup Wizard\n');

  const config: Partial<SetupConfig> = {};

  // TeraBox Configuration
  console.log('📁 TeraBox Configuration:');
  config.terabox = {
    baseURL: await question('TeraBox Base URL (default: https://nephobox.com): ') || 'https://nephobox.com',
    username: await question('TeraBox Username: '),
    password: await question('TeraBox Password: '),
    targetFolder: await question('Target Folder (default: /Terabox Cloud Storage und Notion CMS): ') || '/Terabox Cloud Storage und Notion CMS',
    watchSubfolders: (await question('Watch subfolders? (y/n, default: y): ') || 'y').toLowerCase() === 'y'
  };

  // Notion Configuration
  console.log('\n🗃️ Notion Configuration:');
  config.notion = {
    token: await question('Notion Integration Token: '),
    workspaceId: await question('Notion Workspace ID: '),
    databaseName: await question('Database Name (default: TeraBox File Sync): ') || 'TeraBox File Sync',
    restrictToWorkspace: (await question('Restrict to this workspace only? (y/n, default: y): ') || 'y').toLowerCase() === 'y'
  };

  // Sync Configuration
  console.log('\n🔄 Sync Configuration:');
  const syncMode = await question('Sync Mode (bidirectional/terabox_to_notion/notion_to_terabox, default: bidirectional): ') || 'bidirectional';
  const conflictResolution = await question('Conflict Resolution (latest_wins/terabox_wins/notion_wins/keep_both, default: latest_wins): ') || 'latest_wins';
  const pollingInterval = parseInt(await question('Polling Interval in seconds (default: 30): ') || '30');

  config.sync = {
    mode: syncMode as any,
    conflictResolution,
    pollingInterval: pollingInterval * 1000
  };

  // OCR Configuration
  console.log('\n🤖 OCR Configuration:');
  const ocrEnabled = (await question('Enable OCR? (y/n, default: y): ') || 'y').toLowerCase() === 'y';
  config.ocr = {
    enabled: ocrEnabled,
    baseURL: ocrEnabled ? await question('OCR Base URL (default: http://localhost:7860): ') || 'http://localhost:7860' : ''
  };

  // Save configuration
  const configDir = path.join(__dirname, '../config');
  const configPath = path.join(configDir, 'sync-config.json');

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  const fullConfig = {
    terabox: config.terabox!,
    notion: config.notion!,
    sync: config.sync!,
    ocr: config.ocr!,
    logging: {
      level: 'info',
      file: 'sync.log',
      maxFiles: 5,
      maxSize: '10MB'
    }
  };

  writeFileSync(configPath, JSON.stringify(fullConfig, null, 2));
  console.log(`\n✅ Configuration saved to: ${configPath}`);

  // Create environment file
  const envContent = `
# TeraBox Configuration
TERABOX_BASE_URL=${config.terabox!.baseURL}
TERABOX_USERNAME=${config.terabox!.username}
TERABOX_PASSWORD=${config.terabox!.password}
TERABOX_TARGET_FOLDER=${config.terabox!.targetFolder}
TERABOX_WATCH_SUBFOLDERS=${config.terabox!.watchSubfolders}

# Notion Configuration
NOTION_TOKEN=${config.notion!.token}
NOTION_WORKSPACE_ID=${config.notion!.workspaceId}
NOTION_DATABASE_NAME=${config.notion!.databaseName}
NOTION_RESTRICT_TO_WORKSPACE=${config.notion!.restrictToWorkspace}

# Sync Configuration
SYNC_MODE=${config.sync!.mode}
CONFLICT_RESOLUTION=${config.sync!.conflictResolution}
SYNC_POLLING_INTERVAL=${config.sync!.pollingInterval}

# OCR Configuration
OCR_ENABLED=${config.ocr!.enabled}
OCR_BASE_URL=${config.ocr!.baseURL}

# Logging
LOG_LEVEL=info
LOG_FILE=sync.log
`;

  const envPath = path.join(__dirname, '../.env');
  writeFileSync(envPath, envContent.trim());
  console.log(`✅ Environment file created: ${envPath}`);

  console.log('\n🎉 Setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Review the configuration in config/sync-config.json');
  console.log('2. Start the sync service with: npm start');
  console.log('3. Open the monitoring dashboard: http://localhost:3000');

  const openDashboard = await question('\nOpen setup interface in browser? (y/n): ');
  if (openDashboard.toLowerCase() === 'y') {
    try {
      await open(path.join(__dirname, '../setup/workspace-selector.html'));
    } catch (error) {
      console.log('Could not open browser automatically. Please open setup/workspace-selector.html manually.');
    }
  }

  rl.close();
}

// Run setup if called directly
if (require.main === module) {
  runSetup().catch(console.error);
}

export { runSetup };
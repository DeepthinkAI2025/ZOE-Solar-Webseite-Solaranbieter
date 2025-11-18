#!/usr/bin/env ts-node

/**
 * Monitor Script
 * Starts the monitoring dashboard
 */

import { spawn } from 'child_process';
import * as path from 'path';

async function startMonitor(): Promise<void> {
  console.log('🚀 Starting TeraBox + Notion Sync Monitor...\n');

  try {
    // Start the main sync service
    const syncProcess = spawn('npm', ['start'], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    syncProcess.on('error', (error) => {
      console.error('❌ Failed to start sync service:', error);
      process.exit(1);
    });

    // Wait a moment for the service to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Open the monitoring dashboard
    const dashboardPath = path.join(__dirname, '../monitoring/index.html');
    const { default: open } = await import('open');

    console.log('📊 Opening monitoring dashboard...');
    await open(`file://${dashboardPath}`);

    console.log('🌐 Monitoring dashboard should open in your browser');
    console.log('💡 You can also access it at: http://localhost:3000');
    console.log('\nPress Ctrl+C to stop the monitor');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping monitor...');
      syncProcess.kill('SIGTERM');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Stopping monitor...');
      syncProcess.kill('SIGTERM');
      process.exit(0);
    });

    // Keep the process running
    syncProcess.on('close', (code) => {
      console.log(`Sync service exited with code ${code}`);
      process.exit(code);
    });

  } catch (error) {
    console.error('❌ Failed to start monitor:', error);
    process.exit(1);
  }
}

// Run monitor if called directly
if (require.main === module) {
  startMonitor().catch(console.error);
}

export { startMonitor };
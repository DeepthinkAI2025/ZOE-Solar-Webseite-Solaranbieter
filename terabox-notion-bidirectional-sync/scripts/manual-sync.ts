#!/usr/bin/env ts-node

/**
 * Manual Sync Script
 * Triggers a manual synchronization
 */

import { TeraBoxNotionSync } from '../src/index';

async function runManualSync(): Promise<void> {
  console.log('🔄 TeraBox + Notion Manual Sync\n');

  try {
    // Create sync instance
    const sync = new TeraBoxNotionSync();

    console.log('⚡ Starting manual synchronization...');

    // Get initial status
    const initialStatus = sync.getStatus();
    console.log(`Initial state: ${initialStatus.metrics.totalFiles} files, ${initialStatus.metrics.pendingOperations} pending operations`);

    // Start sync (if not already running)
    await sync.start();

    console.log('✅ Manual sync initiated!');

    // Wait a bit and show updated status
    await new Promise(resolve => setTimeout(resolve, 5000));

    const updatedStatus = sync.getStatus();
    console.log(`Updated state: ${updatedStatus.metrics.totalFiles} files, ${updatedStatus.metrics.pendingOperations} pending operations`);
    console.log(`Success rate: ${updatedStatus.metrics.successRate.toFixed(2)}%`);

    // Cleanup
    await sync.stop();
    await sync.cleanup();

    console.log('\n🎉 Manual sync completed successfully!');

  } catch (error) {
    console.error('❌ Manual sync failed:', error);
    process.exit(1);
  }
}

// Run manual sync if called directly
if (require.main === module) {
  runManualSync().catch(console.error);
}

export { runManualSync };
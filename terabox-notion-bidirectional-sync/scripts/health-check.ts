#!/usr/bin/env ts-node

/**
 * Health Check Script
 * Tests all components and connections
 */

import { TeraBoxNotionSync } from '../src/index';

async function runHealthCheck(): Promise<void> {
  console.log('🔍 TeraBox + Notion Sync Health Check\n');

  try {
    // Create sync instance
    const sync = new TeraBoxNotionSync();

    console.log('📊 Checking system health...');

    // Get health status
    const health = await sync.getHealthStatus();

    console.log('\n🏥 Health Status:');
    console.log(`Overall Status: ${health.status}`);
    console.log(`Uptime: ${formatUptime(health.uptime)}`);

    console.log('\n🔧 Components:');
    console.log(`Sync Engine: ${health.components.sync ? '✅ Healthy' : '❌ Unhealthy'}`);
    console.log(`OCR Integration: ${health.components.ocr ? '✅ Healthy' : '❌ Unhealthy'}`);
    console.log(`TeraBox Connection: ${health.components.terabox ? '✅ Healthy' : '❌ Unhealthy'}`);
    console.log(`Notion Connection: ${health.components.notion ? '✅ Healthy' : '❌ Unhealthy'}`);

    // Get system status
    const status = sync.getStatus();

    console.log('\n📈 System Metrics:');
    console.log(`Sync Mode: ${status.config.syncMode}`);
    console.log(`OCR Enabled: ${status.config.ocrEnabled ? 'Yes' : 'No'}`);
    console.log(`Total Files: ${status.metrics.totalFiles}`);
    console.log(`Success Rate: ${status.metrics.successRate.toFixed(2)}%`);
    console.log(`Pending Operations: ${status.metrics.pendingOperations}`);

    if (status.ocr) {
      console.log('\n🤖 OCR Metrics:');
      console.log(`Processed: ${status.ocr.totalProcessed}`);
      console.log(`Successful: ${status.ocr.successful}`);
      console.log(`Failed: ${status.ocr.totalProcessed - status.ocr.successful}`);
      console.log(`Queue Length: ${status.ocr.queue.queueLength}`);
      console.log(`Processing: ${status.ocr.queue.processing ? 'Yes' : 'No'}`);
    }

    console.log('\n✅ Health check completed successfully!');

    // Note: sync.cleanup() will be available after full implementation

  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  }
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}

// Run health check if called directly
if (require.main === module) {
  runHealthCheck().catch(console.error);
}

export { runHealthCheck };
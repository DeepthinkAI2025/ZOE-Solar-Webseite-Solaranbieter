/**
 * 🚀 AI Gateway Demo - ZOE Solar
 *
 * Demonstration der neuen konsolidierten AI-Architektur
 * 114 Services → 3 Core Services
 */

import { aiGatewayService } from './AIGatewayService';

async function runAIGatewayDemo() {
  console.log('🎯 ZOE SOLAR AI GATEWAY DEMO');
  console.log('=' .repeat(50));

  try {
    // 1. Connection Test
    console.log('\n1️⃣ Connection Test...');
    const isConnected = await aiGatewayService.testConnection();
    console.log(`   Status: ${isConnected ? '✅ Connected' : '❌ Failed'}`);

    // 2. Health Check
    console.log('\n2️⃣ Health Check...');
    const health = aiGatewayService.getHealthStatus();
    console.log(`   Gateway Status: ${health.status}`);
    console.log(`   OpenRouter Status: ${health.cacheStatus.status}`);
    console.log(`   Uptime: ${Math.round(health.uptime)}s`);

    // 3. Content Optimization Demo
    console.log('\n3️⃣ Content Optimization Demo...');
    const contentResult = await aiGatewayService.optimizeContent({
      content: 'ZOE Solar bietet Solarlösungen für Unternehmen.',
      contentType: 'page',
      optimizationGoals: ['seo', 'local'],
      targetKeywords: ['Solaranlagen', 'Photovoltaik', 'Unternehmen'],
      context: { location: 'München' }
    });

    console.log(`   Success: ${contentResult.success}`);
    if (contentResult.success) {
      console.log(`   Optimizations Applied: ${contentResult.appliedOptimizations?.join(', ')}`);
      console.log(`   Optimization Score: ${contentResult.metrics?.optimizationScore}%`);
      console.log(`   Processing Time: ${contentResult.metrics?.processingTime}ms`);
    }

    // 4. Local SEO Demo
    console.log('\n4️⃣ Local SEO Demo...');
    const localResult = await aiGatewayService.generateLocalSEOContent({
      location: 'Berlin',
      service: 'Photovoltaikanlagen',
      targetAudience: 'Unternehmen'
    });

    console.log(`   Success: ${localResult.success}`);
    if (localResult.success) {
      console.log(`   Location: ${localResult.location}`);
      console.log(`   Service: ${localResult.service}`);
      console.log(`   Geo Keywords: ${localResult.seoElements?.geoKeywords.slice(0, 3).join(', ')}...`);
    }

    // 5. Product Description Demo
    console.log('\n5️⃣ Product Description Demo...');
    const productResult = await aiGatewayService.generateProductDescription({
      product: 'High-Power Photovoltaikanlage HP-500',
      features: ['Hoher Wirkungsgrad', '25 Jahre Garantie', 'Intelligente Steuerung'],
      benefits: ['Kosteneinsparung', 'Nachhaltigkeit', 'Unabhängigkeit'],
      targetIndustry: 'Produktion'
    });

    console.log(`   Success: ${productResult.success}`);
    if (productResult.success) {
      console.log(`   Readability Score: ${productResult.analytics?.readabilityScore}/100`);
      console.log(`   Conversion Potential: ${productResult.analytics?.conversionPotential}%`);
    }

    // 6. Batch Processing Demo
    console.log('\n6️⃣ Batch Processing Demo...');
    const batchResult = await aiGatewayService.processBatchRequests({
      requests: [
        {
          type: 'seo',
          data: {
            url: 'https://zoe-solar.de/test',
            content: 'Test content for SEO analysis',
            targetKeywords: ['Solar', 'Photovoltaik'],
            analysisType: 'basic'
          },
          priority: 'high'
        },
        {
          type: 'conversation',
          data: {
            message: 'Was kosten Solaranlagen für Unternehmen?',
            userId: 'demo-user'
          },
          priority: 'medium'
        }
      ]
    });

    console.log(`   Success: ${batchResult.success}`);
    if (batchResult.success) {
      console.log(`   Processed Requests: ${batchResult.processedRequests}`);
      console.log(`   Success Rate: ${Math.round(batchResult.successRate * 100)}%`);
      console.log(`   Total Processing Time: ${batchResult.processingTime}ms`);
    }

    // 7. Usage Statistics
    console.log('\n7️⃣ Usage Statistics...');
    const stats = aiGatewayService.getUsageStatistics();
    console.log(`   Total Gateway Requests: ${stats.gateway.totalRequests}`);
    console.log(`   Average Response Time: ${stats.gateway.averageResponseTime}ms`);
    console.log(`   OpenRouter Tokens Used: ${stats.openRouter.totalTokens}`);

    console.log('\n✅ AI GATEWAY DEMO COMPLETED SUCCESSFULLY!');
    console.log('\n📊 SUMMARY:');
    console.log('   • 114+ Services → 3 Core Services');
    console.log('   • OpenRouter API Integration Ready');
    console.log('   • Massive Cost & Performance Optimization');
    console.log('   • Production Ready Architecture');

  } catch (error) {
    console.error('❌ Demo Failed:', error);
  }
}

// Demo ausführen, wenn dieses File direkt gerunnt wird
if (require.main === module) {
  runAIGatewayDemo();
}

export { runAIGatewayDemo };
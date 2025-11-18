#!/usr/bin/env node

/**
 * Kompletter Bild-Test für ZOE Solar Website
 * Überprüft alle Bilder auf Verfügbarkeit und korrekte Anzeige
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log('🔍 ZOE SOLAR - KOMPLETTER BILD-TEST');
console.log('='.repeat(60));

// Test-Konfiguration
const config = {
  localServer: 'http://localhost:5175',
  timeout: 5000,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
};

// Test-URLs von allen Bildern auf der Website
const imageTests = [
  // Manufacturer Logos
  { type: 'Manufacturer Logo', category: 'Solar Modules', urls: [
    'http://localhost:5175/assets/logos/alpitronic.png',
    'http://localhost:5175/assets/logos/jinko-solar.png',
    'http://localhost:5175/assets/logos/longi-solar.png',
    'http://localhost:5175/assets/logos/trina-solar.png',
    'http://localhost:5175/assets/logos/q-cells.png',
    'http://localhost:5175/assets/logos/wallbox.png',
    'http://localhost:5175/assets/logos/sma.png',
    'http://localhost:5175/assets/logos/fronius.png',
    'http://localhost:5175/assets/logos/enphase.png',
    'http://localhost:5175/assets/logos/solaredge.png'
  ]},

  // Project Images (Unsplash professionelle Solar-Bilder)
  { type: 'Project Gallery', category: 'Solar Projects', urls: [
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589656966895-2f33e7653817?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591025811585-5c2d1b0c2a1a?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581093458791-9d3a6ea6b8ac?q=80&w=2070&auto=format&fit=crop'
  ]},

  // Product Images
  { type: 'Product Images', category: 'Solar Products', urls: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=870&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559304686-3a564a3a5b6e?q=80&w=870&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1662973163920-7435f1f9f257?q=80&w=870&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=870&auto=format=fit=crop'
  ]},

  // Team Images
  { type: 'Team Images', category: 'Company', urls: [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573497019940-1c2c75d09986?q=80&w=2070&auto=format&fit=crop'
  ]}
];

// Funktion zum Testen einer einzelnen URL
async function testImageUrl(url, type, category) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const startTime = Date.now();

    const req = protocol.get(url, {
      timeout: config.timeout,
      headers: { 'User-Agent': config.userAgent }
    }, (res) => {
      const responseTime = Date.now() - startTime;

      if (res.statusCode === 200) {
        const contentType = res.headers['content-type'];
        const contentLength = res.headers['content-length'];

        resolve({
          url,
          success: true,
          statusCode: res.statusCode,
          contentType,
          contentLength,
          responseTime,
          type,
          category,
          error: null
        });
      } else {
        resolve({
          url,
          success: false,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          responseTime,
          type,
          category,
          error: `HTTP ${res.statusCode}`
        });
      }
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        success: false,
        statusCode: null,
        responseTime: config.timeout,
        type,
        category,
        error: 'Timeout'
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        success: false,
        statusCode: null,
        responseTime: Date.now() - startTime,
        type,
        category,
        error: err.message
      });
    });
  });
}

// Funktion zum Testen lokaler Dateien
function testLocalFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const stats = fs.statSync(fullPath);

    return {
      filePath,
      exists: true,
      sizeKB: Math.round(stats.size / 1024),
      lastModified: stats.mtime,
      error: null
    };
  } catch (error) {
    return {
      filePath,
      exists: false,
      sizeKB: 0,
      lastModified: null,
      error: error.message
    };
  }
}

// Haupt-Test-Funktion
async function runAllImageTests() {
  console.log('\n📋 TEST 1: LOKALE HERSTELLERLOGOS');
  console.log('-'.repeat(40));

  const logoDir = path.join(process.cwd(), 'public', 'assets', 'logos');
  const logoFiles = fs.readdirSync(logoDir).filter(file =>
    file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.svg')
  );

  let logoStats = { total: 0, success: 0, failed: 0, issues: [] };

  logoFiles.forEach(file => {
    logoStats.total++;
    const test = testLocalFile(path.join('public', 'assets', 'logos', file));

    if (test.exists && test.sizeKB > 0 && test.sizeKB < 5000) {
      logoStats.success++;
      console.log(`✅ ${file} (${test.sizeKB}KB)`);
    } else {
      logoStats.failed++;
      logoStats.issues.push(`${file}: ${test.error || 'Size issue'} (${test.sizeKB}KB)`);
      console.log(`❌ ${file} - ${test.error || 'Size issue'}`);
    }
  });

  console.log('\n🌐 TEST 2: EXTERNE BILDER (REMOTE URLS)');
  console.log('-'.repeat(40));

  let remoteStats = { total: 0, success: 0, failed: 0, avgResponseTime: 0 };
  const results = [];

  for (const testGroup of imageTests) {
    console.log(`\n📂 ${testGroup.type} (${testGroup.category})`);

    for (const url of testGroup.urls) {
      remoteStats.total++;
      process.stdout.write(`  Testing ${url.split('/').pop()}... `);

      const result = await testImageUrl(url, testGroup.type, testGroup.category);
      results.push(result);

      if (result.success) {
        remoteStats.success++;
        console.log(`✅ ${result.responseTime}ms (${result.contentType})`);
      } else {
        remoteStats.failed++;
        console.log(`❌ ${result.error}`);
      }
    }
  }

  // Berechne durchschnittliche Response Time
  const successfulResults = results.filter(r => r.success);
  if (successfulResults.length > 0) {
    remoteStats.avgResponseTime = Math.round(
      successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length
    );
  }

  // Zusammenfassung
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST-ERGEBNISSE:');

  console.log('\n🏭 HERSTELLERLOGOS (LOKAL):');
  console.log(`   • Gesamt: ${logoStats.total}`);
  console.log(`   • Erfolgreich: ${logoStats.success} ✅`);
  console.log(`   • Fehlgeschlagen: ${logoStats.failed} ❌`);
  console.log(`   • Erfolgsquote: ${Math.round((logoStats.success / logoStats.total) * 100)}%`);

  if (logoStats.issues.length > 0) {
    console.log('\n⚠️  LOGO-PROBLEME:');
    logoStats.issues.forEach(issue => console.log(`   • ${issue}`));
  }

  console.log('\n🌐 EXTERNE BILDER:');
  console.log(`   • Gesamt: ${remoteStats.total}`);
  console.log(`   • Erfolgreich: ${remoteStats.success} ✅`);
  console.log(`   • Fehlgeschlagen: ${remoteStats.failed} ❌`);
  console.log(`   • Erfolgsquote: ${Math.round((remoteStats.success / remoteStats.total) * 100)}%`);
  console.log(`   • Durchschnittliche Ladezeit: ${remoteStats.avgResponseTime}ms`);

  if (remoteStats.failed > 0) {
    console.log('\n⚠️  FEHLERHAFTE EXTERNE BILDER:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • ${r.url.split('/').pop()} - ${r.error}`);
    });
  }

  // Performance-Analyse
  console.log('\n🚀 PERFORMANCE-ANALYSE:');
  const slowImages = successfulResults.filter(r => r.responseTime > 3000);
  if (slowImages.length > 0) {
    console.log(`   • Langsame Bilder (>3s): ${slowImages.length}`);
    slowImages.forEach(r => {
      console.log(`     - ${r.responseTime}ms: ${r.url.split('/').pop()}`);
    });
  } else {
    console.log(`   ✅ Alle Bilder laden schnell (<3s)`);
  }

  // Gesamtbewertung
  const overallSuccessRate = Math.round(
    ((logoStats.success + remoteStats.success) / (logoStats.total + remoteStats.total)) * 100
  );

  console.log('\n' + '='.repeat(60));
  console.log('🎯 GESAMTBEWERTUNG:');
  console.log(`   • Overall Success Rate: ${overallSuccessRate}%`);

  if (overallSuccessRate >= 95) {
    console.log(`   🏆 STATUS: EXZELLENT - Alle Bilder funktionieren einwandfrei!`);
  } else if (overallSuccessRate >= 85) {
    console.log(`   ✅ STATUS: GUT - Die meisten Bilder funktionieren korrekt`);
  } else {
    console.log(`   ⚠️  STATUS: OPTIMIERUNGSBEDARF - Einige Bilder müssen überprüft werden`);
  }

  console.log('\n💡 EMPFEHLUNGEN:');
  if (remoteStats.failed > 0) {
    console.log('   • Ersetze fehlende externe Bilder durch lokale Alternativen');
  }
  if (slowImages.length > 0) {
    console.log('   • Optimiere langsame Bilder (Compression, CDN)');
  }
  if (logoStats.issues.length > 0) {
    console.log('   • Behebe lokale Logo-Probleme');
  }

  console.log(`\n🌐 Website: ${config.localServer}`);
  console.log(`📄 Logo-Test: logo-test.html`);

  return {
    logoStats,
    remoteStats,
    overallSuccessRate,
    issues: [...logoStats.issues, ...results.filter(r => !r.success).map(r => r.url)]
  };
}

// Test ausführen
runAllImageTests().catch(console.error);
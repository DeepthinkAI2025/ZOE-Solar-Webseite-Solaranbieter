#!/usr/bin/env node

/**
 * Manuelles Logo-Prüfungs-Script
 * Überprüft alle Herstellerlogos auf Existenz und visuelle Qualität
 */

const fs = require('fs');
const path = require('path');

// Herstellerliste basierend auf den .ts Dateien
const manufacturers = [
  'alpitronic', 'byd', 'enphase', 'fox-ess', 'fronius', 'goodwe',
  'huawei', 'ja-solar', 'jinko-solar', 'k2-systems', 'keba',
  'lg-energy-solution', 'longi-solar', 'mennekes', 'meyer-burger',
  'q-cells', 'rec-solar', 'schneider-electric', 'sma', 'solaredge',
  'sonnen', 'trina-solar', 'victron-energy', 'wallbox-chargers'
];

const logoDir = path.join(process.cwd(), 'public', 'assets', 'logos');

console.log('🔍 HERSTELLER LOGO - PRÜFREPORT');
console.log('='.repeat(60));

function checkLogoFile(manufacturer) {
  const extensions = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp'];
  const results = [];

  for (const ext of extensions) {
    const filename = manufacturer + ext;
    const filepath = path.join(logoDir, filename);

    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      const sizeKB = Math.round(stats.size / 1024);

      results.push({
        filename,
        exists: true,
        sizeKB,
        filepath: `/assets/logos/${filename}`,
        viable: sizeKB > 1 && sizeKB < 5000 // Zwischen 1KB und 5MB
      });
    } else {
      results.push({
        filename,
        exists: false,
        sizeKB: 0,
        filepath: `/assets/logos/${filename}`,
        viable: false
      });
    }
  }

  return results;
}

function findBestLogo(manufacturer) {
  const logoFiles = checkLogoFile(manufacturer);

  // Priorität: .png > .jpg > .svg > .ico > .jpeg > .webp
  const priority = ['.png', '.jpg', '.svg', '.ico', '.jpeg', '.webp'];

  for (const ext of priority) {
    const found = logoFiles.find(f => f.exists && f.filename.endsWith(ext) && f.viable);
    if (found) {
      return found;
    }
  }

  // Fallback: irgendeine existierende Datei
  return logoFiles.find(f => f.exists) || null;
}

let totalFound = 0;
let totalMissing = 0;
let totalIssues = 0;

console.log('\n📋 DETAİL-PRÜFUNG:\n');

manufacturers.forEach((manufacturer, index) => {
  const logoFiles = checkLogoFile(manufacturer);
  const bestLogo = findBestLogo(manufacturer);
  const hasIssues = logoFiles.filter(f => f.exists && !f.viable).length > 0;

  const status = bestLogo ? '✅' : '❌';
  const issueStatus = hasIssues ? '⚠️' : '';

  console.log(`${String(index + 1).padStart(2)}. ${status} ${issueStatus} ${manufacturer.padEnd(20)}`);

  if (bestLogo) {
    console.log(`    📁 ${bestLogo.filename} (${bestLogo.sizeKB}KB)`);
    console.log(`    🌐 URL: ${bestLogo.filepath}`);
    totalFound++;
  } else {
    console.log(`    ❌ KEIN LOGO GEFUNDEN`);
    totalMissing++;
  }

  if (hasIssues) {
    console.log(`    ⚠️  Problematische Dateien gefunden:`);
    logoFiles.filter(f => f.exists && !f.viable).forEach(file => {
      console.log(`       • ${file.filename} (${file.sizeKB}KB) ${file.sizeKB === 0 ? '- Leer' : file.sizeKB > 5000 ? '- Zu groß' : '- Zu klein'}`);
    });
    totalIssues++;
  }

  console.log('');
});

console.log('='.repeat(60));
console.log('📊 ZUSAMMENFASSUNG:');
console.log(`   • Hersteller gefunden: ${manufacturers.length}`);
console.log(`   • Logos vorhanden: ${totalFound}`);
console.log(`   • Logos fehlend: ${totalMissing}`);
console.log(`   • Problematische Dateien: ${totalIssues}`);
console.log(`   • Erfolgsquote: ${Math.round((totalFound / manufacturers.length) * 100)}%`);

console.log('\n🔧 AKTIONEN EMPFOHLEN:');

if (totalMissing > 0) {
  console.log(`\n1. FEHLENDE LOGOS (${totalMissing}):`);
  const missing = manufacturers.filter(m => !findBestLogo(m));
  missing.forEach(m => {
    console.log(`   • ${m} - Logo manuell suchen und hinzufügen`);
  });
}

if (totalIssues > 0) {
  console.log(`\n2. PROBLEMATISCHE DATEIEN:`);
  console.log(`   • Leere oder zu große Dateien ersetzen`);
  console.log(`   • Optimal: PNG, 10KB-500KB, transparent`);
}

console.log(`\n3. OPTIMIERUNGSEMPFEHLUNGEN:`);
console.log(`   • Alle Logos als PNG mit transparentem Hintergrund`);
console.log(`   • Konsistente Größe: 200x200px oder 300x300px`);
console.log(`   • Dateigröße: 10KB-200KB für schnelle Ladezeiten`);
console.log(`   • White-Label Logos bevorzugen`);

console.log(`\n🌐 TEST-URLS:`);
console.log(`   • Local: http://localhost:5175/`);
console.log(`   • Im Browser: Network Tab prüfen für 404 errors`);

console.log('\n📝 NÄCHSTE SCHRITTE:');
console.log(`   1. Fehlende Logos herunterladen`);
console.log(`   2. Qualität der vorhandenen prüfen`);
console.log(`   3. Standardisieren (PNG, transparent)`);
console.log(`   4. In Website integrieren und testen`);

// Erstelle eine schnelle Test-HTML Seite
const testHTML = createTestHTML();
fs.writeFileSync(
  path.join(process.cwd(), 'logo-test.html'),
  testHTML
);

console.log(`\n📄 TEST-SEITE ERSTELLT: logo-test.html`);
console.log(`   Öffne im Browser zur visuellen Prüfung aller Logos`);

function createTestHTML() {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hersteller Logo Test - ZOE Solar</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #f5f5f5;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .logo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .logo-card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .logo-card h3 {
            margin: 0 0 15px 0;
            color: #333;
        }
        .logo-img {
            width: 150px;
            height: 100px;
            object-fit: contain;
            margin-bottom: 10px;
            border: 1px solid #eee;
            background: white;
            padding: 10px;
            border-radius: 4px;
        }
        .logo-img.error {
            background: #ffebee;
            color: #c62828;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        .logo-url {
            font-size: 11px;
            color: #666;
            word-break: break-all;
            background: #f5f5f5;
            padding: 5px;
            border-radius: 4px;
        }
        .status {
            margin-top: 10px;
            font-weight: bold;
        }
        .status.success { color: #2e7d32; }
        .status.error { color: #c62828; }
        .status.warning { color: #f57c00; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏭 Hersteller Logo Test</h1>
        <p>Visuelle Überprüfung aller ${manufacturers.length} Herstellerlogos für ZOE Solar</p>
    </div>

    <div class="logo-grid">
${manufacturers.map(manufacturer => {
  const bestLogo = findBestLogo(manufacturer);
  const status = bestLogo ? 'success' : 'error';
  const statusText = bestLogo ? '✅ Logo vorhanden' : '❌ Logo fehlt';

  return `
        <div class="logo-card">
            <h3>${manufacturer}</h3>
            ${bestLogo ?
              `<img src="${bestLogo.filepath}" alt="${manufacturer}" class="logo-img" onerror="this.className='logo-img error'; this.nextElementSibling.style.display='block';">
               <div class="logo-url">${bestLogo.filepath}</div>` :
              `<div class="logo-img error">Kein Logo gefunden</div>`
            }
            <div class="status ${status}">${statusText}</div>
        </div>`;
}).join('')}
    </div>

    <div style="text-align: center; margin-top: 40px; color: #666;">
        <p><strong>Erstellt am:</strong> ${new Date().toLocaleString('de-DE')}</p>
        <p><strong>Status:</strong> Manuelles Logo-Prüfungs-Tool</p>
    </div>
</body>
</html>
`;
}
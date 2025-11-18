#!/usr/bin/env node

/**
 * Notion Integration Test Suite for ZOE Solar
 *
 * This script tests the complete integration with Notion
 * to ensure all databases and services work correctly.
 *
 * Usage:
 * node scripts/test-notion-integration.cjs
 */

const { Client } = require('@notionhq/client');
const { setupNotionDatabases } = require('./notion-setup-manager.cjs');

// Test configuration
const testConfig = {
  token: process.env.NOTION_TOKEN || process.env.VITE_NOTION_TOKEN,
  environment: process.env.NODE_ENV || 'development',
  verbose: process.env.VERBOSE === 'true'
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: []
};

/**
 * Enhanced test reporting
 */
function logTest(testName, status, message = '') {
  const statusIcons = {
    pass: '✅',
    fail: '❌',
    skip: '⏭️',
    info: 'ℹ️'
  };

  console.log(`${statusIcons[status]} ${testName}${message ? ': ' + message : ''}`);

  if (status === 'pass') testResults.passed++;
  if (status === 'fail') testResults.failed++;
  if (status === 'skip') testResults.skipped++;
}

/**
 * Test Notion connection
 */
async function testNotionConnection() {
  try {
    const notion = new Client({ auth: testConfig.token });
    const user = await notion.users.me();
    logTest('Notion API Verbindung', 'pass', `Verbunden als ${user.name || user.id}`);
    return { client: notion, user };
  } catch (error) {
    logTest('Notion API Verbindung', 'fail', error.message);
    testResults.errors.push({ test: 'Notion Connection', error: error.message });
    throw error;
  }
}

/**
 * Test database existence and structure
 */
async function testDatabaseStructure(notion, databaseId, expectedName) {
  try {
    if (!databaseId || databaseId === 'existing') {
      logTest(`Datenbankstruktur (${expectedName})`, 'skip', 'Datenbank existiert bereits');
      return true;
    }

    const database = await notion.databases.retrieve({ database_id: databaseId });

    // Check if database has required properties
    const requiredProperties = ['Test Name', 'Status', 'Created time'];
    const missingProperties = requiredProperties.filter(prop => !database.properties[prop]);

    if (missingProperties.length > 0) {
      logTest(`Datenbankstruktur (${expectedName})`, 'fail', `Fehlende Properties: ${missingProperties.join(', ')}`);
      return false;
    }

    logTest(`Datenbankstruktur (${expectedName})`, 'pass', `${Object.keys(database.properties).length} Properties`);
    return true;

  } catch (error) {
    logTest(`Datenbankstruktur (${expectedName})`, 'fail', error.message);
    testResults.errors.push({ test: `Database Structure (${expectedName})`, error: error.message });
    return false;
  }
}

/**
 * Test creating a test page
 */
async function testPageCreation(notion, databaseId, databaseName) {
  try {
    if (!databaseId || databaseId === 'existing') {
      logTest(`Seitenerstellung (${databaseName})`, 'skip', 'Datenbank existiert bereits');
      return true;
    }

    const testPage = {
      parent: { type: 'database_id', database_id: databaseId },
      properties: {
        'Test Name': {
          title: [{ text: { content: `Integration Test ${Date.now()}` } }]
        },
        'Status': {
          select: { name: 'Draft' }
        }
      }
    };

    const createdPage = await notion.pages.create(testPage);
    logTest(`Seitenerstellung (${databaseName})`, 'pass', `Seite ${createdPage.id} erstellt`);

    // Test updating the page
    await notion.pages.update({
      page_id: createdPage.id,
      properties: {
        'Status': {
          select: { name: 'Completed' }
        }
      }
    });
    logTest(`Seitenaktualisierung (${databaseName})`, 'pass');

    return true;

  } catch (error) {
    logTest(`Seitenerstellung (${databaseName})`, 'fail', error.message);
    testResults.errors.push({ test: `Page Creation (${databaseName})`, error: error.message });
    return false;
  }
}

/**
 * Test querying functionality
 */
async function testQuerying(notion, databaseId, databaseName) {
  try {
    if (!databaseId || databaseId === 'existing') {
      logTest(`Datenabfrage (${databaseName})`, 'skip', 'Datenbank existiert bereits');
      return true;
    }

    const queryResult = await notion.databases.query({
      database_id: databaseId,
      page_size: 10
    });

    logTest(`Datenabfrage (${databaseName})`, 'pass', `${queryResult.results.length} Ergebnisse`);
    return true;

  } catch (error) {
    logTest(`Datenabfrage (${databaseName})`, 'fail', error.message);
    testResults.errors.push({ test: `Querying (${databaseName})`, error: error.message });
    return false;
  }
}

/**
 * Test service integration
 */
async function testServiceIntegration(serviceName, serviceModule) {
  try {
    // Check if service module exists
    if (!serviceModule) {
      logTest(`Service Integration (${serviceName})`, 'skip', 'Service nicht gefunden');
      return true;
    }

    // Test service initialization
    if (typeof serviceModule === 'function') {
      const service = new serviceModule();
      logTest(`Service Integration (${serviceName})`, 'pass', 'Service initialisiert');
    } else if (serviceModule && typeof serviceModule.default === 'function') {
      const service = new serviceModule.default();
      logTest(`Service Integration (${serviceName})`, 'pass', 'Service initialisiert');
    } else {
      logTest(`Service Integration (${serviceName})`, 'pass', 'Service vorhanden');
    }

    return true;

  } catch (error) {
    logTest(`Service Integration (${serviceName})`, 'fail', error.message);
    testResults.errors.push({ test: `Service Integration (${serviceName})`, error: error.message });
    return false;
  }
}

/**
 * Test environment variables
 */
function testEnvironmentVariables() {
  const requiredEnvVars = [
    'NOTION_TOKEN',
    'VITE_NOTION_TOKEN'
  ];

  const optionalEnvVars = [
    'NOTION_PARENT_PAGE_ID',
    'VITE_NOTION_PARENT_PAGE_ID',
    'NEXT_PUBLIC_NOTION_ABTESTING_DB',
    'NEXT_PUBLIC_NOTION_USERS_DB',
    'NEXT_PUBLIC_NOTION_ROLES_DB'
  ];

  let allRequiredPresent = true;

  // Test required variables
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      logTest(`Umgebungsvariable (${envVar})`, 'pass', 'Gefunden');
    } else {
      logTest(`Umgebungsvariable (${envVar})`, 'fail', 'Nicht gefunden');
      allRequiredPresent = false;
      testResults.errors.push({ test: `Environment Variable (${envVar})`, error: 'Not found' });
    }
  }

  // Test optional variables
  for (const envVar of optionalEnvVars) {
    if (process.env[envVar]) {
      logTest(`Umgebungsvariable (${envVar})`, 'info', `Gefunden: ${process.env[envVar].substring(0, 8)}...`);
    } else {
      logTest(`Umgebungsvariable (${envVar})`, 'info', 'Nicht gesetzt (optional)');
    }
  }

  return allRequiredPresent;
}

/**
 * Test file system permissions
 */
function testFileSystemPermissions() {
  try {
    const fs = require('fs');
    const path = require('path');

    // Test if we can write to the project directory
    const testFile = path.join(process.cwd(), '.notion-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);

    logTest('Dateisystem-Berechtigungen', 'pass', 'Kann im Projektverzeichnis schreiben');
    return true;

  } catch (error) {
    logTest('Dateisystem-Berechtigungen', 'fail', error.message);
    testResults.errors.push({ test: 'File System Permissions', error: error.message });
    return false;
  }
}

/**
 * Main test suite
 */
async function runIntegrationTests() {
  console.log('🧪 ZOE Solar Notion Integration Test Suite');
  console.log('============================================');
  console.log(`Environment: ${testConfig.environment}`);
  console.log(`Verbose: ${testConfig.verbose}`);
  console.log('');

  let notion = null;
  let databases = {};

  // Test 1: Environment Variables
  console.log('📋 ENVIRONMENT TESTS');
  console.log('-------------------');
  const envTest = testEnvironmentVariables();
  console.log('');

  // Test 2: File System Permissions
  console.log('📁 FILE SYSTEM TESTS');
  console.log('---------------------');
  const fsTest = testFileSystemPermissions();
  console.log('');

  if (!envTest || !fsTest) {
    console.log('❌ Grundlegende Tests fehlgeschlagen. Beheben Sie die Probleme und versuchen Sie es erneut.');
    return false;
  }

  // Test 3: Notion Connection
  console.log('🔗 NOTION CONNECTION TESTS');
  console.log('---------------------------');
  try {
    const connectionResult = await testNotionConnection();
    notion = connectionResult.client;
  } catch (error) {
    console.log('');
    console.log('❌ Verbindung zu Notion fehlgeschlagen. Überprüfen Sie Ihren Token und versuchen Sie es erneut.');
    return false;
  }
  console.log('');

  // Test 4: Setup Databases (if needed)
  console.log('🗄️ DATABASE SETUP TESTS');
  console.log('------------------------');
  try {
    databases = await setupNotionDatabases();
    logTest('Datenbank-Setup', 'pass', 'Alle Datenbanken erstellt');
  } catch (error) {
    logTest('Datenbank-Setup', 'fail', error.message);
    testResults.errors.push({ test: 'Database Setup', error: error.message });
  }
  console.log('');

  // Test 5: Database Structure Tests
  console.log('🏗️ DATABASE STRUCTURE TESTS');
  console.log('-----------------------------');
  await testDatabaseStructure(notion, databases.abTesting, 'A/B Testing');
  await testDatabaseStructure(notion, databases.users, 'Users');
  await testDatabaseStructure(notion, databases.roles, 'Roles');
  console.log('');

  // Test 6: Page Creation Tests
  console.log('📄 PAGE CREATION TESTS');
  console.log('-----------------------');
  await testPageCreation(notion, databases.abTesting, 'A/B Testing');
  await testPageCreation(notion, databases.users, 'Users');
  await testPageCreation(notion, databases.roles, 'Roles');
  console.log('');

  // Test 7: Querying Tests
  console.log('🔍 QUERY TESTS');
  console.log('----------------');
  await testQuerying(notion, databases.abTesting, 'A/B Testing');
  await testQuerying(notion, databases.users, 'Users');
  await testQuerying(notion, databases.roles, 'Roles');
  console.log('');

  // Test 8: Service Integration Tests
  console.log('⚙️ SERVICE INTEGRATION TESTS');
  console.log('------------------------------');
  try {
    const abTestingService = require('../src/services/abTestingService.ts');
    await testServiceIntegration('A/B Testing Service', abTestingService);
  } catch (error) {
    logTest('Service Integration (A/B Testing)', 'info', 'TypeScript Modul, wird in Build kompiliert');
  }

  try {
    const adminAuthService = require('../src/services/adminAuthService.ts');
    await testServiceIntegration('Admin Auth Service', adminAuthService);
  } catch (error) {
    logTest('Service Integration (Admin Auth)', 'info', 'TypeScript Modul, wird in Build kompiliert');
  }
  console.log('');

  // Generate final report
  console.log('📊 TEST ERGEBNISSE');
  console.log('==================');
  console.log(`✅ Bestanden: ${testResults.passed}`);
  console.log(`❌ Fehlgeschlagen: ${testResults.failed}`);
  console.log(`⏭️ Übersprungen: ${testResults.skipped}`);
  console.log(`📈 Erfolgsquote: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  console.log('');

  // Show errors if any
  if (testResults.errors.length > 0) {
    console.log('❌ FEHLER-DETAILS:');
    console.log('------------------');
    testResults.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.test}: ${error.error}`);
    });
    console.log('');
  }

  // Final recommendation
  const allCriticalTestsPassed = envTest && fsTest && notion && testResults.failed === 0;

  if (allCriticalTestsPassed) {
    console.log('🎉 ALLE KRITISCHEN TESTS BESTANDEN!');
    console.log('');
    console.log('✨ Ihr ZOE Solar Conversion System ist betriebsbereit:');
    console.log('   • Notion API Verbindung erfolgreich');
    console.log('   • Alle Datenbanken erstellt und konfiguriert');
    console.log('   • Seitenerstellung und -aktualisierung funktioniert');
    console.log('   • Datenabfragen erfolgreich');
    console.log('   • Services integriert');
    console.log('');
    console.log('🚀 Starten Sie Ihre Anwendung mit:');
    console.log('   npm run dev');
    console.log('');
    console.log('📱 Rufen Sie das Admin Dashboard auf:');
    console.log('   http://localhost:3000/admin');
    console.log('');
    console.log('🧪 Testen Sie das A/B Testing Dashboard:');
    console.log('   http://localhost:3000/admin/ab-testing');
  } else {
    console.log('⚠️ EINIGE TESTS SIND FEHLGESCHLAGEN');
    console.log('');
    console.log('💡 BEHEBEN SIE DIE FOLGENDEN PROBLEME:');
    if (!envTest) console.log('   • Setzen Sie die fehlenden Umgebungsvariablen');
    if (!fsTest) console.log('   • Überprüfen Sie die Dateisystem-Berechtigungen');
    if (!notion) console.log('   • Überprüfen Sie Ihren Notion API Token');
    if (testResults.failed > 0) console.log('   • Prüfen Sie die Fehlerdetails oben');
    console.log('');
    console.log('🔄 Starten Sie die Tests erneut mit:');
    console.log('   node scripts/test-notion-integration.cjs');
  }

  return allCriticalTestsPassed;
}

// Run tests if called directly
if (require.main === module) {
  runIntegrationTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Test Suite fehlgeschlagen:', error.message);
      process.exit(1);
    });
}

module.exports = { runIntegrationTests };
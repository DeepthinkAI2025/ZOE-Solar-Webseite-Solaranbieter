#!/usr/bin/env node

/**
 * Create all ZOE Solar Notion databases directly
 */

const { Client } = require('@notionhq/client');

const token = 'your_notion_api_token_here';
const notion = new Client({ auth: token });

const parentId = '2a3d95db-e7b1-80de-ace7-e8ab322f8f1a'; // Steuersoftware (CMS)

async function createABTestingDatabase() {
  try {
    console.log('🧪 Creating A/B Testing Database...');

    const schema = {
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '🧪 A/B Testing Management' } }],
      properties: {
        'Test Name': { title: {} },
        'Status': {
          select: {
            options: [
              { name: 'Draft', color: 'gray' },
              { name: 'Running', color: 'green' },
              { name: 'Completed', color: 'blue' },
              { name: 'Paused', color: 'yellow' },
              { name: 'Cancelled', color: 'red' }
            ]
          }
        },
        'Test Typ': {
          select: {
            options: [
              { name: 'Popup', color: 'blue' },
              { name: 'Banner', color: 'green' },
              { name: 'Landing Page', color: 'purple' },
              { name: 'Call to Action', color: 'orange' },
              { name: 'Headline', color: 'pink' },
              { name: 'Color Scheme', color: 'yellow' }
            ]
          }
        },
        'Beschreibung': { rich_text: {} },
        'Startdatum': { date: {} },
        'Enddatum': { date: {} },
        'Stichprobengröße': { number: { format: 'number' } },
        'Konfidenzlevel': { number: { format: 'number' } },
        'Varianten': { rich_text: {} },
        'Metriken': { rich_text: {} },
        'Gewinner': { rich_text: {} },
        'Statistische Signifikanz': { number: { format: 'percent' } },
        'Priorität': {
          select: {
            options: [
              { name: 'Hoch', color: 'red' },
              { name: 'Mittel', color: 'yellow' },
              { name: 'Niedrig', color: 'gray' }
            ]
          }
        },
        'Budget': { number: { format: 'euro' } },
        'Testergebnis': { rich_text: {} },
        'Empfehlungen': { rich_text: {} }
      },
      icon: { type: 'emoji', emoji: '🧪' }
    };

    const response = await notion.databases.create(schema);
    console.log(`✅ A/B Testing Database created: ${response.url}`);
    return response.id;

  } catch (error) {
    console.error('❌ Error creating A/B Testing DB:', error.message);
    return null;
  }
}

async function createUsersDatabase() {
  try {
    console.log('👥 Creating Users Database...');

    const schema = {
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '👥 Admin Users Management' } }],
      properties: {
        'Email': { title: {} },
        'Name': { rich_text: {} },
        'Rolle': {
          select: {
            options: [
              { name: 'Super Admin', color: 'red' },
              { name: 'Administrator', color: 'orange' },
              { name: 'Marketing Manager', color: 'green' },
              { name: 'Sales Manager', color: 'blue' },
              { name: 'Content Editor', color: 'purple' },
              { name: 'Viewer', color: 'gray' }
            ]
          }
        },
        'Status': {
          select: {
            options: [
              { name: 'Aktiv', color: 'green' },
              { name: 'Inaktiv', color: 'red' },
              { name: 'Ausstehend', color: 'yellow' }
            ]
          }
        },
        'Abteilung': {
          select: {
            options: [
              { name: 'Management', color: 'red' },
              { name: 'Marketing', color: 'green' },
              { name: 'Vertrieb', color: 'blue' },
              { name: 'IT', color: 'purple' },
              { name: 'Support', color: 'gray' }
            ]
          }
        },
        'Berechtigungen': {
          multi_select: {
            options: [
              { name: 'Alle Berechtigungen', color: 'red' },
              { name: 'Marketing verwalten', color: 'green' },
              { name: 'Leads verwalten', color: 'blue' },
              { name: 'Analysen einsehen', color: 'purple' },
              { name: 'Inhalte bearbeiten', color: 'orange' },
              { name: 'Nur Lesen', color: 'gray' }
            ]
          }
        },
        'Telefon': { phone: {} },
        'Avatar': { url: {} }
      },
      icon: { type: 'emoji', emoji: '👥' }
    };

    const response = await notion.databases.create(schema);
    console.log(`✅ Users Database created: ${response.url}`);
    return response.id;

  } catch (error) {
    console.error('❌ Error creating Users DB:', error.message);
    return null;
  }
}

async function createRolesDatabase() {
  try {
    console.log('🔑 Creating Roles Database...');

    const schema = {
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '🔑 Roles & Permissions' } }],
      properties: {
        'Rollenname': { title: {} },
        'Beschreibung': { rich_text: {} },
        'Berechtigungen': {
          multi_select: {
            options: [
              { name: 'Dashboard einsehen', color: 'blue' },
              { name: 'Marketing Assets verwalten', color: 'green' },
              { name: 'Newsletter verwalten', color: 'orange' },
              { name: 'Leads verwalten', color: 'purple' },
              { name: 'A/B Tests erstellen', color: 'red' },
              { name: 'A/B Tests starten/stoppen', color: 'pink' },
              { name: 'Analytics einsehen', color: 'yellow' },
              { name: 'Benutzer verwalten', color: 'brown' },
              { name: 'Rollen verwalten', color: 'gray' },
              { name: 'Systemeinstellungen', color: 'black' }
            ]
          }
        },
        'Priorität': { number: { format: 'number' } },
        'Aktiv': { checkbox: {} }
      },
      icon: { type: 'emoji', emoji: '🔑' }
    };

    const response = await notion.databases.create(schema);
    console.log(`✅ Roles Database created: ${response.url}`);
    return response.id;

  } catch (error) {
    console.error('❌ Error creating Roles DB:', error.message);
    return null;
  }
}

async function addSampleData(abTestId, usersId, rolesId) {
  try {
    console.log('📝 Adding sample data...');

    // Add sample A/B test
    if (abTestId) {
      await notion.pages.create({
        parent: { database_id: abTestId },
        properties: {
          'Test Name': {
            title: [{ text: { content: 'Black Friday Popup Headline Test' } }]
          },
          'Status': { select: { name: 'Draft' } },
          'Test Typ': { select: { name: 'Popup' } },
          'Beschreibung': {
            rich_text: [{ text: { content: 'Test verschiedener Headlines für Black Friday Popup' } }]
          },
          'Stichprobengröße': { number: 1000 },
          'Konfidenzlevel': { number: 95 },
          'Priorität': { select: { name: 'Hoch' } },
          'Budget': { number: 5000 }
        }
      });
      console.log('✅ Sample A/B test added');
    }

    // Add sample users
    if (usersId) {
      await notion.pages.create({
        parent: { database_id: usersId },
        properties: {
          'Email': {
            title: [{ text: { content: 'admin@zoe-solar.de' } }]
          },
          'Name': {
            rich_text: [{ text: { content: 'System Administrator' } }]
          },
          'Rolle': { select: { name: 'Super Admin' } },
          'Status': { select: { name: 'Aktiv' } },
          'Abteilung': { select: { name: 'Management' } },
          'Berechtigungen': {
            multi_select: [{ name: 'Alle Berechtigungen' }]
          }
        }
      });
      console.log('✅ Sample user added');
    }

    // Add sample roles
    if (rolesId) {
      await notion.pages.create({
        parent: { database_id: rolesId },
        properties: {
          'Rollenname': {
            title: [{ text: { content: 'Super Admin' } }]
          },
          'Beschreibung': {
            rich_text: [{ text: { content: 'Vollzugriff auf alle Systemfunktionen' } }]
          },
          'Berechtigungen': {
            multi_select: [
              { name: 'Dashboard einsehen' },
              { name: 'Marketing Assets verwalten' },
              { name: 'Newsletter verwalten' },
              { name: 'Leads verwalten' },
              { name: 'A/B Tests erstellen' },
              { name: 'A/B Tests starten/stoppen' },
              { name: 'Analytics einsehen' },
              { name: 'Benutzer verwalten' },
              { name: 'Rollen verwalten' },
              { name: 'Systemeinstellungen' }
            ]
          },
          'Priorität': { number: 1 },
          'Aktiv': { checkbox: true }
        }
      });
      console.log('✅ Sample role added');
    }

  } catch (error) {
    console.error('⚠️ Error adding sample data:', error.message);
  }
}

async function createEnvFile(abTestId, usersId, rolesId) {
  try {
    console.log('📋 Creating .env.local file...');

    const envContent = `
# ZOE Solar Notion Database IDs
# Generated on ${new Date().toISOString()}

# ZOE Solar Workspace Configuration
NOTION_WORKSPACE=ZOE Solar
NOTION_INTEGRATION_NAME=ZOE Solar Conversion System

# A/B Testing Database
NEXT_PUBLIC_NOTION_ABTESTING_DB=${abTestId}

# Users Database
NEXT_PUBLIC_NOTION_USERS_DB=${usersId}

# Roles Database
NEXT_PUBLIC_NOTION_ROLES_DB=${rolesId}

# Parent Page
NOTION_PARENT_PAGE_ID=${parentId}

# Notion API Token (ZOE Solar Workspace only)
NOTION_TOKEN=your_notion_api_token_here
VITE_NOTION_TOKEN=your_notion_api_token_here
`.trim();

    require('fs').writeFileSync('.env.local', envContent);
    console.log('✅ .env.local file created');

  } catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 ZOE Solar Notion Database Creation');
    console.log('======================================');
    console.log(`Parent Page: Steuersoftware (CMS)`);
    console.log(`Workspace: ZOE Solar`);
    console.log('');

    const abTestId = await createABTestingDatabase();
    const usersId = await createUsersDatabase();
    const rolesId = await createRolesDatabase();

    console.log('');
    await addSampleData(abTestId, usersId, rolesId);
    await createEnvFile(abTestId, usersId, rolesId);

    console.log('');
    console.log('🎉 All databases created successfully!');
    console.log('');
    console.log('📊 DATABASE IDs:');
    console.log(`   A/B Testing: ${abTestId}`);
    console.log(`   Users: ${usersId}`);
    console.log(`   Roles: ${rolesId}`);
    console.log('');
    console.log('🚀 Start your application: npm run dev');
    console.log('📱 Admin Dashboard: http://localhost:3000/admin');
    console.log('🧪 A/B Testing: http://localhost:3000/admin/ab-testing');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
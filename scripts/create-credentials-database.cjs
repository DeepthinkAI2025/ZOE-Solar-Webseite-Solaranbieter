#!/usr/bin/env node

/**
 * Create Credentials Management Database in Notion
 * For secure storage of API keys, tokens, and environment variables
 */

const { Client } = require('@notionhq/client');

const token = 'your_notion_api_token_here';
const notion = new Client({ auth: token });

const parentId = '2a3d95db-e7b1-80de-ace7-e8ab322f8f1a'; // Steuersoftware (CMS) page

async function createCredentialsDatabase() {
  try {
    console.log('🔐 Creating Credentials Management Database...');

    const schema = {
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '🔐 Credentials & API Keys Management' } }],
      properties: {
        'Credential Name': { title: {} },
        'Service': {
          select: {
            options: [
              { name: 'Notion API', color: 'blue' },
              { name: 'Google Analytics', color: 'green' },
              { name: 'Google Maps', color: 'yellow' },
              { name: 'Mailchimp', color: 'orange' },
              { name: 'Vercel KV', color: 'purple' },
              { name: 'SendGrid', color: 'pink' },
              { name: 'Stripe', color: 'red' },
              { name: 'Firebase', color: 'brown' },
              { name: 'Custom API', color: 'gray' }
            ]
          }
        },
        'Credential Type': {
          select: {
            options: [
              { name: 'API Key', color: 'blue' },
              { name: 'Secret Token', color: 'red' },
              { name: 'Database URL', color: 'green' },
              { name: 'Webhook Secret', color: 'orange' },
              { name: 'Environment Variable', color: 'purple' },
              { name: 'Private Key', color: 'red' },
              { name: 'OAuth Token', color: 'yellow' }
            ]
          }
        },
        'Environment': {
          select: {
            options: [
              { name: 'Production', color: 'red' },
              { name: 'Development', color: 'gray' },
              { name: 'Staging', color: 'yellow' },
              { name: 'Local', color: 'blue' },
              { name: 'Shared', color: 'green' }
            ]
          }
        },
        'API Key/Secret': { rich_text: {} }, // Encrypted in practice
        'Description': { rich_text: {} },
        'Usage/Purpose': { rich_text: {} },
        'Created Date': { date: {} },
        'Last Updated': { last_edited_time: {} },
        'Expires On': { date: {} },
        'Priority': {
          select: {
            options: [
              { name: 'Critical', color: 'red' },
              { name: 'High', color: 'orange' },
              { name: 'Medium', color: 'yellow' },
              { name: 'Low', color: 'gray' }
            ]
          }
        },
        'Status': {
          select: {
            options: [
              { name: 'Active', color: 'green' },
              { name: 'Inactive', color: 'red' },
              { name: 'Testing', color: 'yellow' },
              { name: 'Deprecated', color: 'gray' }
            ]
          }
        },
        'Access Level': {
          select: {
            options: [
              { name: 'Public', color: 'green' },
              { name: 'Internal', color: 'blue' },
              { name: 'Restricted', color: 'orange' },
              { name: 'Confidential', color: 'red' }
            ]
          }
        },
        'Owner': {
          select: {
            options: [
              { name: 'System Administrator', color: 'red' },
              { name: 'Marketing Team', color: 'green' },
              { name: 'Development Team', color: 'blue' },
              { name: 'Sales Team', color: 'purple' }
            ]
          }
        },
        'Documentation URL': { url: {} },
        'Related Services': { multi_select: {
          options: [
            { name: 'A/B Testing', color: 'blue' },
            { name: 'Analytics', color: 'green' },
            { name: 'Email Marketing', color: 'orange' },
            { name: 'Payment Processing', color: 'red' },
            { name: 'Authentication', color: 'purple' },
            { name: 'Storage', color: 'brown' }
          ]
        }},
        'Rotation Frequency': {
          select: {
            options: [
              { name: 'Never', color: 'gray' },
              { name: 'Monthly', color: 'blue' },
              { name: 'Quarterly', color: 'green' },
              { name: 'Bi-annually', color: 'yellow' },
              { name: 'Annually', color: 'orange' }
            ]
          }
        }
      },
      icon: { type: 'emoji', emoji: '🔐' },
      cover: {
        type: 'external',
        external: {
          url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1600&h=400&fit=crop'
        }
      }
    };

    const response = await notion.databases.create(schema);
    console.log(`✅ Credentials Database created: ${response.url}`);
    return response.id;

  } catch (error) {
    console.error('❌ Error creating Credentials DB:', error.message);
    return null;
  }
}

async function addSampleCredentials(credentialsId) {
  try {
    console.log('📝 Adding sample credentials...');

    const sampleCredentials = [
      {
        properties: {
          'Credential Name': {
            title: [{ text: { content: 'Notion API Integration Token' } }]
          },
          'Service': { select: { name: 'Notion API' } },
          'Credential Type': { select: { name: 'Secret Token' } },
          'Environment': { select: { name: 'Production' } },
          'API Key/Secret': {
            rich_text: [{ text: { content: 'your_notion_api_token_here' } }]
          },
          'Description': {
            rich_text: [{ text: { content: 'Main Notion API token for ZOE Solar workspace integration' } }]
          },
          'Usage/Purpose': {
            rich_text: [{ text: { content: 'Used for creating and managing Notion databases, pages, and content synchronization' } }]
          },
          'Priority': { select: { name: 'Critical' } },
          'Status': { select: { name: 'Active' } },
          'Access Level': { select: { name: 'Restricted' } },
          'Owner': { select: { name: 'System Administrator' } },
          'Related Services': {
            multi_select: [
              { name: 'A/B Testing' },
              { name: 'Analytics' }
            ]
          },
          'Rotation Frequency': { select: { name: 'Annually' } }
        }
      },
      {
        properties: {
          'Credential Name': {
            title: [{ text: { content: 'Google Analytics Measurement ID' } }]
          },
          'Service': { select: { name: 'Google Analytics' } },
          'Credential Type': { select: { name: 'API Key' } },
          'Environment': { select: { name: 'Production' } },
          'API Key/Secret': {
            rich_text: [{ text: { content: 'G-XXXXXXXXXX' } }]
          },
          'Description': {
            rich_text: [{ text: { content: 'Google Analytics 4 measurement ID for tracking website performance and conversions' } }]
          },
          'Usage/Purpose': {
            rich_text: [{ text: { content: 'Website analytics, conversion tracking, and user behavior analysis' } }]
          },
          'Priority': { select: { name: 'High' } },
          'Status': { select: { name: 'Active' } },
          'Access Level': { select: { name: 'Internal' } },
          'Owner': { select: { name: 'Marketing Team' } },
          'Related Services': {
            multi_select: [{ name: 'Analytics' }]
          },
          'Rotation Frequency': { select: { name: 'Never' } }
        }
      },
      {
        properties: {
          'Credential Name': {
            title: [{ text: { content: 'Vercel KV REST API Token' } }]
          },
          'Service': { select: { name: 'Vercel KV' } },
          'Credential Type': { select: { name: 'Secret Token' } },
          'Environment': { select: { name: 'Production' } },
          'API Key/Secret': {
            rich_text: [{ text: { content: 'kvpc_...' } }]
          },
          'Description': {
            rich_text: [{ text: { content: 'Vercel KV Redis-compatible database for caching and session storage' } }]
          },
          'Usage/Purpose': {
            rich_text: [{ text: { content: 'Application caching, session management, and real-time data synchronization' } }]
          },
          'Priority': { select: { name: 'Critical' } },
          'Status': { select: { name: 'Active' } },
          'Access Level': { select: { name: 'Restricted' } },
          'Owner': { select: { name: 'Development Team' } },
          'Related Services': {
            multi_select: [{ name: 'Authentication' }]
          },
          'Rotation Frequency': { select: { name: 'Annually' } }
        }
      },
      {
        properties: {
          'Credential Name': {
            title: [{ text: { content: 'JWT Secret for Authentication' } }]
          },
          'Service': { select: { name: 'Custom API' } },
          'Credential Type': { select: { name: 'Private Key' } },
          'Environment': { select: { name: 'Production' } },
          'API Key/Secret': {
            rich_text: [{ text: { content: 'your-super-secure-jwt-secret-key-here-minimum-32-chars' } }]
          },
          'Description': {
            rich_text: [{ text: { content: 'JSON Web Token secret for user authentication and session management' } }]
          },
          'Usage/Purpose': {
            rich_text: [{ text: { content: 'Securing API endpoints, managing user sessions, and authentication tokens' } }]
          },
          'Priority': { select: { name: 'Critical' } },
          'Status': { select: { name: 'Active' } },
          'Access Level': { select: { name: 'Confidential' } },
          'Owner': { select: { name: 'System Administrator' } },
          'Related Services': {
            multi_select: [{ name: 'Authentication' }]
          },
          'Rotation Frequency': { select: { name: 'Quarterly' } }
        }
      },
      {
        properties: {
          'Credential Name': {
            title: [{ text: { content: 'Mailchimp API Key' } }]
          },
          'Service': { select: { name: 'Mailchimp' } },
          'Credential Type': { select: { name: 'API Key' } },
          'Environment': { select: { name: 'Production' } },
          'API Key/Secret': {
            rich_text: [{ text: { content: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us1' } }]
          },
          'Description': {
            rich_text: [{ text: { content: 'Mailchimp API key for newsletter management and email campaigns' } }]
          },
          'Usage/Purpose': {
            rich_text: [{ text: { content: 'Newsletter subscription management, campaign automation, and email marketing' } }]
          },
          'Priority': { select: { name: 'Medium' } },
          'Status': { select: { name: 'Active' } },
          'Access Level': { select: { name: 'Internal' } },
          'Owner': { select: { name: 'Marketing Team' } },
          'Related Services': {
            multi_select: [{ name: 'Email Marketing' }]
          },
          'Rotation Frequency': { select: { name: 'Annually' } }
        }
      }
    ];

    for (const credential of sampleCredentials) {
      try {
        await notion.pages.create({
          parent: { database_id: credentialsId },
          properties: credential.properties
        });
        console.log(`✅ Added sample credential: ${credential.properties['Credential Name'].title[0].text.content}`);
      } catch (error) {
        console.warn(`⚠️ Could not add sample credential: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('⚠️ Error adding sample credentials:', error.message);
  }
}

async function createEnvSyncTemplate() {
  try {
    console.log('📋 Creating Environment Sync Template...');

    const schema = {
      parent: { type: 'page_id', page_id: parentId },
      title: [{ text: { content: '🔄 Environment Sync Manager' } }],
      properties: {
        'Environment Name': { title: {} },
        'Target Platform': {
          select: {
            options: [
              { name: 'Vercel Production', color: 'red' },
              { name: 'Vercel Staging', color: 'yellow' },
              { name: 'Local Development', color: 'blue' },
              { name: 'GitHub Actions', color: 'purple' },
              { name: 'Docker Container', color: 'green' }
            ]
          }
        },
        'Sync Status': {
          select: {
            options: [
              { name: 'Synced', color: 'green' },
              { name: 'Pending', color: 'yellow' },
              { name: 'Failed', color: 'red' },
              { name: 'Manual Override', color: 'orange' }
            ]
          }
        },
        'Last Sync': { last_edited_time: {} },
        'Credentials Count': { number: { format: 'number' } },
        'Sync Frequency': {
          select: {
            options: [
              { name: 'Real-time', color: 'green' },
              { name: 'Every 5 minutes', color: 'blue' },
              { name: 'Every 30 minutes', color: 'yellow' },
              { name: 'Hourly', color: 'orange' },
              { name: 'Manual', color: 'gray' }
            ]
          }
        },
        'Webhook URL': { url: {} },
        'Description': { rich_text: {} }
      },
      icon: { type: 'emoji', emoji: '🔄' }
    };

    const response = await notion.databases.create(schema);
    console.log(`✅ Environment Sync Database created: ${response.url}`);
    return response.id;

  } catch (error) {
    console.error('❌ Error creating Environment Sync DB:', error.message);
    return null;
  }
}

async function main() {
  try {
    console.log('🔐 ZOE Solar Credentials Management Setup');
    console.log('======================================');
    console.log(`Parent Page: Steuersoftware (CMS)`);
    console.log(`Workspace: ZOE Solar`);
    console.log('');

    const credentialsId = await createCredentialsDatabase();
    if (credentialsId) {
      console.log('');
      await addSampleCredentials(credentialsId);
    }

    const syncId = await createEnvSyncTemplate();

    console.log('');
    console.log('🎉 Credentials Management System created!');
    console.log('');
    console.log('📊 DATABASE IDs:');
    console.log(`   Credentials: ${credentialsId}`);
    console.log(`   Environment Sync: ${syncId}`);
    console.log('');
    console.log('🔐 FEATURES:');
    console.log('   • Secure credential storage in Notion');
    console.log('   • Environment-based access control');
    console.log('   • Credential rotation tracking');
    console.log('   • Service relationship mapping');
    console.log('   • Automated sync capabilities');
    console.log('');
    console.log('📱 NEXT STEPS:');
    console.log('   1. Set up webhooks for real-time sync');
    console.log('   2. Configure bidirectional user sync');
    console.log('   3. Implement encryption for sensitive data');
    console.log('   4. Set up automated environment variable sync');

    // Update .env.local
    try {
      const currentEnv = require('fs').readFileSync('.env.local', 'utf8');
      const newEnv = currentEnv + `

# Credentials Management Database
NEXT_PUBLIC_NOTION_CREDENTIALS_DB=${credentialsId}
NEXT_PUBLIC_NOTION_ENV_SYNC_DB=${syncId}`;
      require('fs').writeFileSync('.env.local', newEnv);
      console.log('✅ .env.local updated with new database IDs');
    } catch (error) {
      console.log('⚠️ Could not update .env.local automatically');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
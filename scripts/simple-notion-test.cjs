#!/usr/bin/env node

/**
 * Simple Notion Test to isolate the issue
 */

const { Client } = require('@notionhq/client');

const token = 'your_notion_api_token_here';
const notion = new Client({ auth: token });

async function testSimpleDatabase() {
  try {
    console.log('🧪 Testing simple database creation...');

    // Simple database schema
    const simpleSchema = {
      parent: {
        type: 'workspace',
        workspace: true
      },
      title: [{
        text: { content: 'Test Database' }
      }],
      properties: {
        'Name': {
          title: {}
        },
        'Status': {
          select: {
            options: [
              { name: 'Active', color: 'green' },
              { name: 'Inactive', color: 'red' }
            ]
          }
        }
      },
      icon: {
        type: 'emoji',
        emoji: '🧪'
      }
    };

    console.log('Schema properties:', Object.keys(simpleSchema.properties));
    console.log('Sending request...');

    const response = await notion.databases.create(simpleSchema);

    console.log('✅ SUCCESS!');
    console.log('Database ID:', response.id);
    console.log('Database URL:', response.url);

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Code:', error.code);

    if (error.body) {
      console.error('Error body:', JSON.stringify(error.body, null, 2));
    }
  }
}

testSimpleDatabase();
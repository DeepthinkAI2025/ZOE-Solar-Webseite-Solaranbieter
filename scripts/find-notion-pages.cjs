#!/usr/bin/env node

/**
 * Find available pages in ZOE Solar Notion workspace
 */

const { Client } = require('@notionhq/client');

const token = 'your_notion_api_token_here';
const notion = new Client({ auth: token });

async function findPages() {
  try {
    console.log('🔍 Searching for pages in ZOE Solar workspace...');

    const search = await notion.search({
      filter: {
        value: 'page',
        property: 'object'
      },
      page_size: 10
    });

    console.log(`Found ${search.results.length} pages:`);
    console.log('');

    search.results.forEach((page, index) => {
      console.log(`${index + 1}. ${page.properties.title?.title?.[0]?.plain_text || 'Untitled'}`);
      console.log(`   ID: ${page.id}`);
      console.log(`   URL: ${page.url}`);
      console.log('');
    });

    if (search.results.length > 0) {
      const firstPage = search.results[0];
      console.log('✅ Using first page as parent:');
      console.log(`   Page: ${firstPage.properties.title?.title?.[0]?.plain_text || 'Untitled'}`);
      console.log(`   ID: ${firstPage.id}`);
      return firstPage.id;
    }

    console.log('❌ No pages found. Please create a page first in Notion.');
    return null;

  } catch (error) {
    console.error('❌ Error finding pages:', error.message);
    return null;
  }
}

findPages();
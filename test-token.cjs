#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

console.log('NOTION_API_TOKEN:', process.env.NOTION_API_TOKEN);
console.log('NOTION_WORKSPACE_ID:', process.env.NOTION_WORKSPACE_ID);
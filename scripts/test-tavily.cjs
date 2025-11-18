#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function testTavily() {
    console.log('🔍 Testing Tavily API...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    if (!apiKey) {
        console.log('❌ No API key found');
        return;
    }

    try {
        const tavilyClient = new TavilyClient(apiKey);

        console.log('🔎 Making simple search...');

        const result = await tavilyClient.search('Tesla Solar Roof V3 specifications 2024');

        console.log('✅ Success!');
        console.log('Found', result.results.length, 'results');

        if (result.answer) {
            console.log('Answer:', result.answer.substring(0, 200) + '...');
        }

        return result;

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
        return null;
    }
}

testTavily();
#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchTeslaSolarPanel() {
    console.log('🔍 Starting Tesla Solar Panel 400W Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        const query = 'Tesla Solar Panel 400W specifications technical data Wp efficiency dimensions weight official datasheet 2024';

        console.log('🔎 Searching for Tesla Solar Panel 400W data...');

        const result = await tavilyClient.search(query, {
            max_results: 10,
            include_answer: true,
            search_depth: "basic"
        });

        console.log('\n📊 RESEARCH RESULTS:');
        console.log('====================');

        if (result.answer) {
            console.log('\n🎯 AI-Generated Summary:');
            console.log(result.answer);
        }

        console.log('\n🔗 Detailed Sources:');
        result.results.forEach((source, index) => {
            console.log(`\n${index + 1}. ${source.title}`);
            console.log(`   URL: ${source.url}`);
            console.log(`   Score: ${source.score}`);
            if (source.content) {
                console.log(`   Content: ${source.content.substring(0, 300)}...`);
            }
        });

        // Save results
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `research-results/tesla-solar-panel-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(result, null, 2));
        console.log(`\n💾 Results saved to: ${fileName}`);

        return result;

    } catch (error) {
        console.error('❌ Research failed:', error.message);
        return null;
    }
}

researchTeslaSolarPanel().then(result => {
    if (result) {
        console.log('\n✅ Tesla Solar Panel 400W research completed!');
    } else {
        console.log('\n❌ Research failed');
    }
});
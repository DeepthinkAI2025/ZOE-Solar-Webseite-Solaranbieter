#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchTeslaSolarRoof() {
    console.log('🔍 Starting Tesla Solar Roof V3 Research...');

    // Initialize Tavily API
    const apiKey = process.env.TAVILY_API_KEY || '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';

    if (!apiKey || apiKey === 'your-api-key-here') {
        console.log('⚠️  Please set TAVILY_API_KEY environment variable');
        return;
    }

    try {
        // Initialize Tavily client
        const tavilyClient = new TavilyClient(apiKey);

        // Research Tesla Solar Roof V3 specifications - more focused query
        const query = 'Tesla Solar Roof V3 specifications power output efficiency cost warranty 2024';

        console.log('🔎 Searching for Tesla Solar Roof V3 data...');
        console.log('Query:', query);

        const result = await tavilyClient.search(query, {
            max_results: 8,
            include_answer: true,
            search_depth: "basic"  // Changed from advanced to basic
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

        // Save results to file
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `research-results/tesla-solar-roof-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(result, null, 2));
        console.log(`\n💾 Results saved to: ${fileName}`);

        return result;

    } catch (error) {
        console.error('❌ Research failed:', error.message);
        console.error('Stack:', error.stack);
        return null;
    }
}

// Run research
researchTeslaSolarRoof().then(result => {
    if (result) {
        console.log('\n✅ Tesla Solar Roof V3 research completed successfully!');
        console.log('📈 Total sources found:', result.results.length);
    } else {
        console.log('\n❌ Research failed. Please check your API key and connection.');
    }
});
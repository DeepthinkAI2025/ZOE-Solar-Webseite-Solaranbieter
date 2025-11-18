#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchSMAProducts() {
    console.log('🔍 Starting SMA Products Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research multiple SMA products
        const queries = [
            'SMA Sunny Boy 3.0-5.0 specifications datasheet efficiency warranty 2024',
            'SMA Sunny Tripower 10.0 specifications datasheet technical data 2024',
            'SMA Sunny Tripower CORE1 50kW specifications datasheet 2024',
            'SMA Sunny Island 6.0H off-grid inverter specifications datasheet 2024',
            'SMA Sunny Home Storage 2.5 battery specifications datasheet 2024'
        ];

        const results = {};

        for (const query of queries) {
            console.log(`\n🔎 Searching: ${query}`);

            try {
                const result = await tavilyClient.search(query, {
                    max_results: 8,
                    include_answer: true,
                    search_depth: "basic"
                });

                // Extract product name from query
                const productName = query.split(' ')[1] + ' ' + query.split(' ')[2];
                results[productName] = result;

                console.log(`✅ Found data for ${productName}`);

                // Brief summary of findings
                if (result.answer) {
                    console.log(`   📋 Summary: ${result.answer.substring(0, 150)}...`);
                }
                console.log(`   🔗 Sources: ${result.results.length} found`);

            } catch (error) {
                console.log(`❌ Failed to research ${query}: ${error.message}`);
                results[productName] = null;
            }
        }

        // Save results
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `research-results/sma-products-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ SMA research failed:', error.message);
        return null;
    }
}

researchSMAProducts().then(result => {
    if (result) {
        console.log('\n✅ SMA Products research completed!');
    } else {
        console.log('\n❌ SMA research failed');
    }
});
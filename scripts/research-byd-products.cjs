#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchBYDProducts() {
    console.log('🔍 Starting BYD Products Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research multiple BYD products
        const queries = [
            'BYD Battery-Box Premium HVS 5.12kWh specifications datasheet LFP battery 2024',
            'BYD Battery-Box Premium LVS 4.0kWh specifications datasheet low voltage 2024',
            'BYD M6-10 375W solar panel specifications datasheet efficiency 2024',
            'BYD M8-10 410W solar panel MBB specifications datasheet 2024',
            'BYD M10-10 450W solar panel G12 specifications datasheet 2024',
            'BYD Battery-Box Premium HVM 7.68kWh specifications datasheet commercial 2024'
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
        const fileName = `research-results/byd-products-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ BYD research failed:', error.message);
        return null;
    }
}

researchBYDProducts().then(result => {
    if (result) {
        console.log('\n✅ BYD Products research completed!');
    } else {
        console.log('\n❌ BYD research failed');
    }
});
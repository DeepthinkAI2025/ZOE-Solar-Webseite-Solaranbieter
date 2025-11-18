#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchFroniusProducts() {
    console.log('🔍 Starting Fronius Products Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research multiple Fronius products
        const queries = [
            'Fronius Symo GEN24 Plus specifications datasheet hybrid inverter 2024',
            'Fronius Primo GEN24 specifications datasheet string inverter 2024',
            'Fronius Tauro commercial inverter specifications datasheet 50-100kW 2024',
            'Fronius Ohmpilot specifications datasheet heat generation 2024',
            'Fronius Solar Battery specifications datasheet LFP energy storage 2024'
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
        const fileName = `research-results/fronius-products-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ Fronius research failed:', error.message);
        return null;
    }
}

researchFroniusProducts().then(result => {
    if (result) {
        console.log('\n✅ Fronius Products research completed!');
    } else {
        console.log('\n❌ Fronius research failed');
    }
});
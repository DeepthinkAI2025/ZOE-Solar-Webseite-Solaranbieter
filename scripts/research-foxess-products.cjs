#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchFoxESSProducts() {
    console.log('🔍 Starting Fox ESS Products Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research Fox ESS hybrid inverters and battery systems
        const queries = [
            'Fox ESS KH9.0 hybrid inverter specifications datasheet 9kW AC coupled 2024',
            'Fox ESS H3 series hybrid inverter H3-8.0 specifications datasheet 2024',
            'Fox ESS HV battery system specification datasheet 10kWh 15kWh 2024',
            'Fox ESS Solar Cube battery storage system specifications datasheet 2024'
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
                const productName = query.includes('KH9.0') ? 'KH9.0 Hybrid Inverter' :
                                   query.includes('H3-8.0') ? 'H3-8.0 Hybrid Inverter' :
                                   query.includes('HV battery') ? 'HV Battery System' :
                                   query.includes('Solar Cube') ? 'Solar Cube Battery' :
                                   'Fox ESS Product';
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
        const fileName = `research-results/foxess-products-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ Fox ESS research failed:', error.message);
        return null;
    }
}

researchFoxESSProducts().then(result => {
    if (result) {
        console.log('\n✅ Fox ESS Products research completed!');
    } else {
        console.log('\n❌ Fox ESS research failed');
    }
});
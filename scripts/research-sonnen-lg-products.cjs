#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchSonnenLGProducts() {
    console.log('🔍 Starting Sonnen & LG Energy Solution Products Research for 2025...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research Sonnen hybrid systems and LG battery storage for 2025
        const queries = [
            'Sonnen eco 8 hybrid inverter battery system specifications datasheet 2025',
            'Sonnen core VRM virtual power plant battery storage specifications 2025',
            'LG Energy Solution RESU Prime 10H battery system specifications datasheet 2025',
            'LG Energy Solution enblock home battery storage system specifications 2025'
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
                const productName = query.includes('sonnen eco') ? 'Sonnen eco 8 Hybrid System' :
                                   query.includes('core VRM') ? 'Sonnen core VRM System' :
                                   query.includes('RESU Prime') ? 'LG RESU Prime 10H' :
                                   query.includes('enblock') ? 'LG enblock Home Battery' :
                                   'Premium Battery System';
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
        const fileName = `research-results/sonnen-lg-products-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ Sonnen & LG research failed:', error.message);
        return null;
    }
}

researchSonnenLGProducts().then(result => {
    if (result) {
        console.log('\n✅ Sonnen & LG Energy Solution Products research for 2025 completed!');
    } else {
        console.log('\n❌ Sonnen & LG research failed');
    }
});
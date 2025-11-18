#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchSolarEdgeProducts() {
    console.log('🔍 Starting SolarEdge Products Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research SolarEdge power optimizers and HD Wave inverters
        const queries = [
            'SolarEdge P700 optimizers specifications datasheet power optimizer 2024',
            'SolarEdge HD Wave SE5000H inverter specifications datasheet single-phase 2024',
            'SolarEdge SE7600H-US inverter specifications datasheet HD Wave technology 2024',
            'SolarEdge P960 optimizers specifications datasheet high-power optimizer 2024'
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
                const productName = query.includes('P700') ? 'P700 Power Optimizer' :
                                   query.includes('SE5000H') ? 'SE5000H HD Wave Inverter' :
                                   query.includes('SE7600H') ? 'SE7600H-US HD Wave Inverter' :
                                   query.includes('P960') ? 'P960 Power Optimizer' :
                                   'SolarEdge Product';
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
        const fileName = `research-results/solaredge-products-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ SolarEdge research failed:', error.message);
        return null;
    }
}

researchSolarEdgeProducts().then(result => {
    if (result) {
        console.log('\n✅ SolarEdge Products research completed!');
    } else {
        console.log('\n❌ SolarEdge research failed');
    }
});
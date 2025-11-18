#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchGoodWeInverters() {
    console.log('🔍 Starting GoodWe Inverters Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research GoodWe string inverters and hybrid inverters
        const queries = [
            'GoodWe DT series inverter DT 10-30 specifications datasheet string inverter 2024',
            'GoodWe SDT series hybrid inverter SDT G2 10kW specifications datasheet 2024',
            'GoodWe GW 10K-MT three-phase inverter specifications datasheet 2024',
            'GoodWe XS series residential inverter specifications datasheet 2024'
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
                const productName = query.includes('DT 10-30') ? 'DT 10-30 String Inverter' :
                                   query.includes('SDT G2') ? 'SDT G2 Hybrid Inverter' :
                                   query.includes('GW 10K-MT') ? 'GW 10K-MT Three-Phase Inverter' :
                                   query.includes('XS series') ? 'XS Series Residential Inverter' :
                                   'GoodWe Inverter';
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
        const fileName = `research-results/goodwe-inverters-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ GoodWe research failed:', error.message);
        return null;
    }
}

researchGoodWeInverters().then(result => {
    if (result) {
        console.log('\n✅ GoodWe Inverters research completed!');
    } else {
        console.log('\n❌ GoodWe research failed');
    }
});
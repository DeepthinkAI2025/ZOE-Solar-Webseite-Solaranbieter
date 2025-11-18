#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchLongiSolarProducts() {
    console.log('🔍 Starting LONGi Solar Products Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research multiple LONGi Solar modules
        const queries = [
            'LONGi Hi-MO 6 LR5-585HTH specifications datasheet HPD N-Type 2024',
            'LONGi Hi-MO 5m LR4-540HPM specifications datasheet PERC monocrystalline 2024',
            'LONGi Hi-MO X6 Scientist LR5-575HTD specifications datasheet bifacial HPD 2024',
            'LONGi Hi-MO 4 LR4-385HP specifications datasheet monocrystalline PERC 2024'
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
                const productName = query.split(' ')[1] + ' ' + query.split(' ')[2] + ' ' + query.split(' ')[3] + ' ' + query.split(' ')[4];
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
        const fileName = `research-results/longi-solar-products-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ LONGi Solar research failed:', error.message);
        return null;
    }
}

researchLongiSolarProducts().then(result => {
    if (result) {
        console.log('\n✅ LONGi Solar Products research completed!');
    } else {
        console.log('\n❌ LONGi Solar research failed');
    }
});
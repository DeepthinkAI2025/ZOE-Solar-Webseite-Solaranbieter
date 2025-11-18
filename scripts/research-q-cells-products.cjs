#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchQCellsProducts() {
    console.log('🔍 Starting Q-Cells Products Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research multiple Q-Cells solar modules
        const queries = [
            'Q.PEAK DUO ML-G11S 415W specifications datasheet Q Cells solar module 2024',
            'Q.TRON BLK M-G2+ 430W specifications datasheet Q Cells all black solar module 2024',
            'Q.PEAK DUO ZML-G9+ 355W specifications datasheet Q Cells half cut cell module 2024',
            'Q.PEAK DUO G9+ 330W specifications datasheet Q Cells mono PERC module 2024',
            'Q.PEAK DUO XL-G11.2+ 500W specifications datasheet Q Cells XL high power module 2024'
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
                const productName = query.split(' ')[0] + ' ' + query.split(' ')[1] + ' ' + query.split(' ')[2];
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
        const fileName = `research-results/q-cells-products-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ Q-Cells research failed:', error.message);
        return null;
    }
}

researchQCellsProducts().then(result => {
    if (result) {
        console.log('\n✅ Q-Cells Products research completed!');
    } else {
        console.log('\n❌ Q-Cells research failed');
    }
});
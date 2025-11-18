#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchTrinaSolarProducts() {
    console.log('🔍 Starting Trina Solar Products Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research multiple Trina Solar Vertex modules
        const queries = [
            'Trina Solar Vertex S+ 545W specifications datasheet bifacial 2024',
            'Trina Solar Vertex TSM-DEG19C.20 560W specifications datasheet n-type 2024',
            'Trina Solar Vertex S+ series technical specifications multi-busbar 2024'
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
                const productName = query.includes('Vertex S+') ? 'Vertex S+ 545W' :
                                   query.includes('TSM-DEG19C.20') ? 'Vertex TSM-DEG19C.20' :
                                   'Vertex S+ Series';
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
        const fileName = `research-results/trina-solar-products-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ Trina Solar research failed:', error.message);
        return null;
    }
}

researchTrinaSolarProducts().then(result => {
    if (result) {
        console.log('\n✅ Trina Solar Products research completed!');
    } else {
        console.log('\n❌ Trina Solar research failed');
    }
});
#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchJaSolarModules() {
    console.log('🔍 Starting JA Solar Modules Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research JA Solar high-performance modules
        const queries = [
            'JA Solar JAM72S20-410/MR specifications datasheet N-Type bifacial 2024',
            'JA Solar JKM550M-7RL3-V specifications datasheet mono PERC 2024',
            'JA Solar JAP72S20-400-MR specifications datasheet half-cut N-Type 2024',
            'JA Solar JKM525N-72HL4-V specifications datasheet N-Type TOPCon 2024'
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
                const productName = query.includes('JAM72S20') ? 'JAM72S20-410/MR' :
                                   query.includes('JKM550M') ? 'JKM550M-7RL3-V' :
                                   query.includes('JAP72S20') ? 'JAP72S20-400-MR' :
                                   query.includes('JKM525N') ? 'JKM525N-72HL4-V' :
                                   'JA Solar Module';
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
        const fileName = `research-results/ja-solar-modules-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ JA Solar research failed:', error.message);
        return null;
    }
}

researchJaSolarModules().then(result => {
    if (result) {
        console.log('\n✅ JA Solar Modules research completed!');
    } else {
        console.log('\n❌ JA Solar research failed');
    }
});
#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchJinkoSolarProducts() {
    console.log('🔍 Starting Jinko Solar Products Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research multiple Jinko Solar modules
        const queries = [
            'Jinko Solar Tiger Neo 475N-72HL4-V specifications datasheet TOPCon N-Type 2024',
            'Jinko Solar Tiger Neo 550N-72HL4-BMR specifications datasheet bifacial TOPCon 2024',
            'Jinko Solar Tiger Neo 450N-60HL4-V specifications datasheet residential TOPCon 2024',
            'Jinko Solar JKM425M-7RL3-V Eagle specifications datasheet PERC monocrystalline 2024'
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
                const productName = query.split(' ')[2] + ' ' + query.split(' ')[3] + ' ' + query.split(' ')[4];
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
        const fileName = `research-results/jinko-solar-products-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ Jinko Solar research failed:', error.message);
        return null;
    }
}

researchJinkoSolarProducts().then(result => {
    if (result) {
        console.log('\n✅ Jinko Solar Products research completed!');
    } else {
        console.log('\n❌ Jinko Solar research failed');
    }
});
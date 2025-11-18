#!/usr/bin/env node

const { TavilyClient } = require('tavily');

async function researchHuaweiFusionSolar() {
    console.log('🔍 Starting Huawei FusionSolar Research...');

    const apiKey = process.env.TAVILY_API_KEY || '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';

    try {
        const tavilyClient = new TavilyClient(apiKey);

        // Research Huawei FusionSolar inverters
        const queries = [
            'Huawei SUN2000-8KTL-MT0 specifications datasheet three-phase inverter 2024',
            'Huawei SUN2000-5KTL-MT0 specifications datasheet single-phase inverter 2024',
            'Huawei SUN2000-12KTL-MT0 specifications datasheet three-phase commercial inverter 2024',
            'Huawei FusionSolar smart energy manager specifications datasheet 2024'
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
                const productName = query.includes('SUN2000-8KTL') ? 'SUN2000-8KTL-MT0' :
                                   query.includes('SUN2000-5KTL') ? 'SUN2000-5KTL-MT0' :
                                   query.includes('SUN2000-12KTL') ? 'SUN2000-12KTL-MT0' :
                                   'Smart Energy Manager';
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
        const fileName = `research-results/huawei-fusionsolar-${timestamp}.json`;

        const fs = require('fs');
        if (!fs.existsSync('research-results')) {
            fs.mkdirSync('research-results');
        }
        fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
        console.log(`\n💾 All results saved to: ${fileName}`);

        return results;

    } catch (error) {
        console.error('❌ Huawei FusionSolar research failed:', error.message);
        return null;
    }
}

researchHuaweiFusionSolar().then(result => {
    if (result) {
        console.log('\n✅ Huawei FusionSolar research completed!');
    } else {
        console.log('\n❌ Huawei FusionSolar research failed');
    }
});
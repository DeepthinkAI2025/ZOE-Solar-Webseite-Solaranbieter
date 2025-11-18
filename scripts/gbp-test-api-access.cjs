#!/usr/bin/env node

/**
 * ZOE Solar - GBP API Access Testing
 * Testet den Zugriff auf alle Google Business Profile API Endpoints
 */

const fs = require('fs');
const path = require('path');

/**
 * Lädt OAuth2 Konfiguration
 */
function loadOAuth2Config() {
    const configPath = path.join(__dirname, '../data/gbp-oauth2-working-config.json');

    if (!fs.existsSync(configPath)) {
        console.log('❌ OAuth2 config not found. Please run: node scripts/gbp-oauth2-setup.cjs');
        return null;
    }

    try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config;
    } catch (error) {
        console.log('❌ Error loading OAuth2 config:', error.message);
        return null;
    }
}

/**
 * Prüft ob Token noch gültig ist
 */
function isTokenValid(config) {
    if (!config.expires_at) return false;

    const expiresAt = new Date(config.expires_at);
    const now = new Date();
    const fiveMinutesBuffer = 5 * 60 * 1000; // 5 Minuten Puffer

    return expiresAt.getTime() > (now.getTime() + fiveMinutesBuffer);
}

/**
 * Aktualisiert Access Token mit Refresh Token
 */
async function refreshAccessToken(config) {
    if (!config.refresh_token) {
        console.log('❌ No refresh token available');
        return null;
    }

    console.log('🔄 Refreshing access token...');

    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: config.oauth2_config.web.client_id,
                client_secret: config.oauth2_config.web.client_secret,
                refresh_token: config.refresh_token,
                grant_type: 'refresh_token'
            })
        });

        if (response.ok) {
            const tokenData = await response.json();
            console.log('✅ Access token refreshed successfully');

            // Update config
            config.access_token = tokenData.access_token;
            config.expires_at = new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString();
            config.expires_in = tokenData.expires_in;

            // Save updated config
            fs.writeFileSync(path.join(__dirname, '../data/gbp-oauth2-working-config.json'), JSON.stringify(config, null, 2));
            console.log('💾 Updated config saved');

            return config;
        } else {
            const errorText = await response.text();
            console.log('❌ Token refresh failed:', errorText);
            return null;
        }
    } catch (error) {
        console.log('❌ Network error during token refresh:', error.message);
        return null;
    }
}

/**
 * Testet alle GBP API Endpoints
 */
async function testAllGBPEndpoints(accessToken) {
    console.log('🧪 Testing all GBP API endpoints...');

    const endpoints = [
        {
            name: 'Business Information API - Accounts',
            url: 'https://mybusinessbusinessinformation.googleapis.com/v1/accounts',
            description: 'Haupt-API für Account-Verwaltung'
        },
        {
            name: 'Business Information API - Locations',
            url: 'https://mybusinessbusinessinformation.googleapis.com/v1/locations',
            description: 'API für Standort-Verwaltung'
        },
        {
            name: 'My Business Account Management v4',
            url: 'https://mybusiness.googleapis.com/v4/accounts',
            description: 'Legacy Account Management API'
        },
        {
            name: 'My Business Account Management v4.1',
            url: 'https://mybusiness.googleapis.com/v4.1/accounts',
            description: 'Neuere Account Management API'
        },
        {
            name: 'Business Profile Performance API',
            url: 'https://businessprofileperformance.googleapis.com/v1/locations',
            description: 'Performance-Tracking API'
        },
        {
            name: 'My Business Notifications API',
            url: 'https://mybusinessnotifications.googleapis.com/v1/accounts',
            description: 'Notifications API'
        }
    ];

    const results = [];

    for (const endpoint of endpoints) {
        console.log(`\n📡 Testing ${endpoint.name}...`);
        console.log(`   URL: ${endpoint.url}`);
        console.log(`   Description: ${endpoint.description}`);

        try {
            const response = await fetch(endpoint.url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log(`   Status: ${response.status} ${response.statusText}`);

            if (response.ok) {
                const data = await response.json();
                console.log('   ✅ SUCCESS - Endpoint accessible!');

                let itemCount = 0;
                let dataType = '';

                if (data.accounts) {
                    itemCount = data.accounts.length;
                    dataType = 'accounts';
                    console.log(`   📊 Found ${itemCount} accounts`);

                    if (itemCount > 0) {
                        console.log('   🏢 Available Accounts:');
                        data.accounts.slice(0, 3).forEach((account, index) => {
                            console.log(`      ${index + 1}. ${account.name}`);
                            console.log(`         Name: ${account.accountName || 'No name'}`);
                            console.log(`         Type: ${account.type || 'Unknown'}`);
                            console.log(`         Role: ${account.roleInfo?.role || 'No role'}`);
                        });
                        if (itemCount > 3) console.log(`      ... and ${itemCount - 3} more`);
                    }
                } else if (data.locations) {
                    itemCount = data.locations.length;
                    dataType = 'locations';
                    console.log(`   📊 Found ${itemCount} locations`);

                    if (itemCount > 0) {
                        console.log('   🏢 Available Locations:');
                        data.locations.slice(0, 3).forEach((location, index) => {
                            console.log(`      ${index + 1}. ${location.locationName || location.name}`);
                            console.log(`         Address: ${location.address?.addressLines?.join(', ') || 'No address'}`);
                        });
                        if (itemCount > 3) console.log(`      ... and ${itemCount - 3} more`);
                    }
                } else if (data.error) {
                    console.log(`   ⚠️  API Response Error: ${data.error.message}`);
                }

                results.push({
                    endpoint: endpoint.name,
                    url: endpoint.url,
                    success: true,
                    data: data,
                    itemCount: itemCount,
                    dataType: dataType,
                    description: endpoint.description
                });

            } else if (response.status === 401) {
                console.log('   ❌ Token expired or invalid');
                results.push({
                    endpoint: endpoint.name,
                    url: endpoint.url,
                    success: false,
                    error: 'Token expired or invalid',
                    description: endpoint.description
                });
            } else if (response.status === 403) {
                console.log('   ❌ Insufficient permissions');
                results.push({
                    endpoint: endpoint.name,
                    url: endpoint.url,
                    success: false,
                    error: 'Insufficient permissions',
                    description: endpoint.description
                });
            } else if (response.status === 404) {
                console.log('   ❌ Endpoint not found');
                results.push({
                    endpoint: endpoint.name,
                    url: endpoint.url,
                    success: false,
                    error: 'Endpoint not found',
                    description: endpoint.description
                });
            } else {
                const errorText = await response.text();
                console.log(`   ❌ Error: ${errorText.substring(0, 150)}...`);
                results.push({
                    endpoint: endpoint.name,
                    url: endpoint.url,
                    success: false,
                    error: errorText.substring(0, 150),
                    description: endpoint.description
                });
            }
        } catch (error) {
            console.log(`   ❌ Network error: ${error.message}`);
            results.push({
                endpoint: endpoint.name,
                url: endpoint.url,
                success: false,
                error: error.message,
                description: endpoint.description
            });
        }
    }

    return results;
}

/**
 * Erstellt detaillierten Test-Bericht
 */
function createTestReport(results, config) {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    const report = {
        timestamp: new Date().toISOString(),
        test_summary: {
            total_endpoints: results.length,
            successful_endpoints: successful.length,
            failed_endpoints: failed.length,
            success_rate: `${((successful.length / results.length) * 100).toFixed(1)}%`
        },
        configuration: {
            client_id: config.oauth2_config.web.client_id.substring(0, 20) + '...',
            account: config.account,
            project: config.project,
            token_expires_at: config.expires_at,
            has_refresh_token: !!config.refresh_token
        },
        results: results,
        working_endpoints: successful.map(r => ({
            name: r.endpoint,
            url: r.url,
            data_type: r.dataType,
            item_count: r.itemCount
        })),
        failed_endpoints: failed.map(f => ({
            name: f.endpoint,
            url: f.url,
            error: f.error
        }))
    };

    // Speichere Bericht
    const reportPath = path.join(__dirname, '../data/gbp-api-access-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return report;
}

/**
 * Zeigt Test-Ergebnisse in der Konsole an
 */
function displayResults(results, report) {
    console.log('\n' + '='.repeat(80));
    console.log('📊 ZOE SOLAR - GBP API ACCESS TEST RESULTS');
    console.log('='.repeat(80));

    console.log(`\n📈 SUMMARY:`);
    console.log(`   Total Endpoints: ${report.test_summary.total_endpoints}`);
    console.log(`   Successful: ${report.test_summary.successful_endpoints}`);
    console.log(`   Failed: ${report.test_summary.failed_endpoints}`);
    console.log(`   Success Rate: ${report.test_summary.success_rate}`);

    if (report.test_summary.successful_endpoints > 0) {
        console.log(`\n✅ WORKING ENDPOINTS:`);
        report.working_endpoints.forEach((endpoint, index) => {
            console.log(`   ${index + 1}. ${endpoint.name}`);
            console.log(`      URL: ${endpoint.url}`);
            console.log(`      Data Type: ${endpoint.data_type}`);
            console.log(`      Items: ${endpoint.item_count}`);
        });

        console.log(`\n🎉 GBP API ACCESS IS WORKING!`);
        console.log(`💡 Ready for ZOE Solar location creation via API!`);
    } else {
        console.log(`\n❌ NO WORKING ENDPOINTS FOUND`);
        console.log(`💡 OAuth2 setup may need to be repeated or permissions checked`);
    }

    if (report.test_summary.failed_endpoints > 0) {
        console.log(`\n❌ FAILED ENDPOINTS:`);
        report.failed_endpoints.forEach((endpoint, index) => {
            console.log(`   ${index + 1}. ${endpoint.name}`);
            console.log(`      Error: ${endpoint.error}`);
        });
    }

    console.log(`\n📁 REPORT SAVED TO:`);
    console.log(`   data/gbp-api-access-test-report.json`);
}

/**
 * Main Funktion
 */
async function main() {
    console.log('🚀 ZOE Solar - GBP API Access Testing');
    console.log('=' .repeat(60));

    // Load OAuth2 config
    const config = loadOAuth2Config();
    if (!config) {
        console.log('\n❌ Please run OAuth2 setup first:');
        console.log('   node scripts/gbp-oauth2-setup.cjs');
        return;
    }

    console.log('📋 OAUTH2 CONFIGURATION:');
    console.log(`   Account: ${config.account}`);
    console.log(`   Project: ${config.project}`);
    console.log(`   Token expires: ${config.expires_at}`);

    // Check if token is valid
    if (!isTokenValid(config)) {
        console.log('\n⚠️  Access token expired or expiring soon');

        if (config.refresh_token) {
            console.log('🔄 Attempting to refresh token...');
            const refreshedConfig = await refreshAccessToken(config);

            if (!refreshedConfig) {
                console.log('\n❌ Token refresh failed');
                console.log('💡 Please run OAuth2 setup again:');
                console.log('   node scripts/gbp-oauth2-setup.cjs');
                return;
            }

            config = refreshedConfig;
        } else {
            console.log('\n❌ No refresh token available');
            console.log('💡 Please run OAuth2 setup again:');
            console.log('   node scripts/gbp-oauth2-setup.cjs');
            return;
        }
    }

    console.log('\n✅ OAuth2 token is valid');
    console.log(`   Access Token: ${config.access_token.substring(0, 30)}...`);

    // Test all endpoints
    const results = await testAllGBPEndpoints(config.access_token);

    // Create report
    const report = createTestReport(results, config);

    // Display results
    displayResults(results, report);

    console.log('\n' + '=' .repeat(60));
    console.log('🏁 GBP API Access Test completed');
}

// Ausführen
main().catch(console.error);
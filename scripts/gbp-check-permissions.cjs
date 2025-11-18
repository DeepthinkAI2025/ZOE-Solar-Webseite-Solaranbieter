#!/usr/bin/env node

/**
 * ZOE Solar - GBP Permissions Analysis & Troubleshooting
 * Detaillierte Analyse von Google Business Profile Berechtigungen
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Lädt OAuth2 Konfiguration
 */
function loadOAuth2Config() {
    const configPath = path.join(__dirname, '../data/gbp-oauth2-working-config.json');

    if (!fs.existsSync(configPath)) {
        console.log('❌ OAuth2 config not found');
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
 * Prüft Google Cloud Konfiguration
 */
function checkGoogleCloudConfig() {
    console.log('🔍 Checking Google Cloud Configuration...');

    try {
        // Projekt prüfen
        const project = execSync('gcloud config get-value project', { encoding: 'utf8' }).trim();
        console.log(`✅ Current Project: ${project}`);

        // Account prüfen
        const account = execSync('gcloud auth list --filter=status:ACTIVE --format="value(account)"', { encoding: 'utf8' }).trim();
        console.log(`✅ Active Account: ${account}`);

        // IAM Rollen prüfen
        const roles = execSync(`gcloud projects get-iam-policy ${project} --flatten="bindings[].members" --format="table(bindings.role, bindings.members)" --filter="bindings.members:${account}"`, { encoding: 'utf8' });
        console.log('✅ IAM Roles:');
        console.log(roles);

        // Billing prüfen
        try {
            const billing = execSync(`gcloud billing projects describe ${project} --format="table(billingAccountName, billingEnabled)"`, { encoding: 'utf8' });
            console.log('💳 Billing Status:');
            console.log(billing);
        } catch (error) {
            console.log('⚠️  Could not check billing status');
        }

        return { project, account };
    } catch (error) {
        console.log('❌ Error checking Google Cloud config:', error.message);
        return null;
    }
}

/**
 * Prüft aktivierte APIs
 */
function checkEnabledAPIs(project) {
    console.log('\n📡 Checking Enabled Google APIs...');

    try {
        const apis = execSync(`gcloud services list --enabled --project=${project}`, { encoding: 'utf8' });
        const lines = apis.split('\n').filter(line => line.trim());

        console.log(`✅ Enabled APIs (${lines.length}):`);

        // Finde Business-relevante APIs
        const businessAPIs = lines.filter(line =>
            line.includes('business') ||
            line.includes('mybusiness') ||
            line.includes('GBP')
        );

        if (businessAPIs.length > 0) {
            console.log('\n🏢 Business-related APIs:');
            businessAPIs.forEach(api => {
                const parts = api.split(/\s+/);
                if (parts.length >= 2) {
                    console.log(`   ✅ ${parts[1]} - ${parts[0]}`);
                }
            });
        } else {
            console.log('\n❌ No business-related APIs found');
            console.log('💡 Run: gcloud services enable mybusinessbusinessinformation.googleapis.com');
        }

        return businessAPIs;
    } catch (error) {
        console.log('❌ Error checking enabled APIs:', error.message);
        return [];
    }
}

/**
 * Testet OAuth2 Token mit verschiedenen Scopes
 */
async function testTokenWithDifferentScopes(accessToken) {
    console.log('\n🔐 Testing OAuth2 Token with different scopes...');

    const endpoints = [
        {
            name: 'Business Info API - Accounts',
            url: 'https://mybusinessbusinessinformation.googleapis.com/v1/accounts',
            required_scopes: ['https://www.googleapis.com/auth/business.manage']
        },
        {
            name: 'Business Info API - Locations',
            url: 'https://mybusinessbusinessinformation.googleapis.com/v1/locations',
            required_scopes: ['https://www.googleapis.com/auth/business.manage']
        },
        {
            name: 'My Business API v4',
            url: 'https://mybusiness.googleapis.com/v4/accounts',
            required_scopes: ['https://www.googleapis.com/auth/business.manage']
        },
        {
            name: 'User Info API',
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            required_scopes: ['https://www.googleapis.com/auth/userinfo.email']
        }
    ];

    const results = [];

    for (const endpoint of endpoints) {
        console.log(`\n📡 Testing ${endpoint.name}...`);

        try {
            const response = await fetch(endpoint.url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                }
            });

            console.log(`   Status: ${response.status} ${response.statusText}`);

            if (response.ok) {
                const data = await response.json();
                console.log('   ✅ SUCCESS');

                if (data.accounts) {
                    console.log(`   📊 Found ${data.accounts.length} accounts`);
                } else if (data.locations) {
                    console.log(`   📊 Found ${data.locations.length} locations`);
                } else if (data.email) {
                    console.log(`   👤 User Email: ${data.email}`);
                }

                results.push({
                    endpoint: endpoint.name,
                    success: true,
                    data: data,
                    required_scopes: endpoint.required_scopes
                });
            } else {
                const errorText = await response.text();
                console.log(`   ❌ Error: ${errorText.substring(0, 100)}...`);

                let errorType = 'Unknown';
                if (response.status === 403) {
                    errorType = 'Insufficient scopes';
                    console.log(`   💡 Required scopes: ${endpoint.required_scopes.join(', ')}`);
                } else if (response.status === 401) {
                    errorType = 'Invalid token';
                }

                results.push({
                    endpoint: endpoint.name,
                    success: false,
                    error: errorText.substring(0, 100),
                    error_type: errorType,
                    required_scopes: endpoint.required_scopes
                });
            }
        } catch (error) {
            console.log(`   ❌ Network error: ${error.message}`);
            results.push({
                endpoint: endpoint.name,
                success: false,
                error: error.message,
                error_type: 'Network',
                required_scopes: endpoint.required_scopes
            });
        }
    }

    return results;
}

/**
 * Prüft Google Business Profile Account Status
 */
async function checkGBPAccountStatus(accessToken) {
    console.log('\n🏢 Checking Google Business Profile Account Status...');

    try {
        const response = await fetch('https://mybusinessbusinessinformation.googleapis.com/v1/accounts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();

            if (data.accounts && data.accounts.length > 0) {
                console.log(`✅ Found ${data.accounts.length} GBP Accounts:`);

                data.accounts.forEach((account, index) => {
                    console.log(`\n   ${index + 1}. ${account.name}`);
                    console.log(`      Name: ${account.accountName || 'No display name'}`);
                    console.log(`      Type: ${account.type || 'Unknown'}`);
                    console.log(`      Role: ${account.roleInfo?.role || 'No role info'}`);
                    console.log(`      State: ${account.state || 'Unknown'}`);
                    console.log(`      Permission Level: ${account.permissionLevel || 'Unknown'}`);
                });

                return {
                    hasAccounts: true,
                    count: data.accounts.length,
                    accounts: data.accounts
                };
            } else {
                console.log('❌ No GBP accounts found');
                console.log('💡 Create a GBP account at: https://business.google.com/');
                return { hasAccounts: false, count: 0, accounts: [] };
            }
        } else {
            console.log('❌ Cannot access GBP accounts');
            return { hasAccounts: false, count: 0, accounts: [] };
        }
    } catch (error) {
        console.log('❌ Error checking GBP account status:', error.message);
        return { hasAccounts: false, count: 0, accounts: [] };
    }
}

/**
 * Erstellt Lösungs-empfehlungen
 */
function createRecommendations(config, cloudConfig, enabledAPIs, tokenTest, gbpStatus) {
    console.log('\n💡 RECOMMENDATIONS & SOLUTIONS:');

    const recommendations = [];

    // OAuth2 Config Probleme
    if (!config) {
        recommendations.push({
            issue: 'OAuth2 Configuration Missing',
            solution: 'Run OAuth2 setup first',
            command: 'node scripts/gbp-oauth2-setup.cjs',
            priority: 'HIGH'
        });
    }

    // Google Cloud Probleme
    if (!cloudConfig) {
        recommendations.push({
            issue: 'Google Cloud Configuration Problems',
            solution: 'Check gcloud setup and permissions',
            command: 'gcloud auth login && gcloud config set project zoe-solar-gbp',
            priority: 'HIGH'
        });
    }

    // API Probleme
    if (enabledAPIs.length === 0) {
        recommendations.push({
            issue: 'No Business APIs Enabled',
            solution: 'Enable required APIs',
            command: 'gcloud services enable mybusinessbusinessinformation.googleapis.com',
            priority: 'HIGH'
        });
    }

    // Token Probleme
    const tokenErrors = tokenTest.filter(t => !t.success);
    if (tokenErrors.length > 0) {
        const scopeErrors = tokenErrors.filter(t => t.error_type === 'Insufficient scopes');

        if (scopeErrors.length > 0) {
            recommendations.push({
                issue: 'Insufficient OAuth2 Scopes',
                solution: 'Re-run OAuth2 with correct scopes',
                command: 'node scripts/gbp-oauth2-setup.cjs',
                priority: 'HIGH'
            });
        }

        const invalidToken = tokenErrors.filter(t => t.error_type === 'Invalid token');
        if (invalidToken.length > 0) {
            recommendations.push({
                issue: 'Invalid or Expired Token',
                solution: 'Refresh OAuth2 token',
                command: 'node scripts/gbp-oauth2-setup.cjs',
                priority: 'HIGH'
            });
        }
    }

    // GBP Account Probleme
    if (!gbpStatus.hasAccounts) {
        recommendations.push({
            issue: 'No GBP Account Found',
            solution: 'Create Google Business Profile account',
            url: 'https://business.google.com/',
            priority: 'MEDIUM'
        });
    }

    // Display recommendations
    if (recommendations.length > 0) {
        console.log('\n🔧 SOLUTIONS (in priority order):');

        recommendations.forEach((rec, index) => {
            console.log(`\n${index + 1}. ${rec.issue} [${rec.priority}]`);
            console.log(`   💡 Solution: ${rec.solution}`);
            if (rec.command) {
                console.log(`   🛠️  Command: ${rec.command}`);
            }
            if (rec.url) {
                console.log(`   🔗 URL: ${rec.url}`);
            }
        });
    } else {
        console.log('\n✅ All checks passed - No issues found!');
        console.log('💡 Ready for ZOE Solar location creation');
    }

    return recommendations;
}

/**
 * Erstellt detaillierten Bericht
 */
function createAnalysisReport(config, cloudConfig, enabledAPIs, tokenTest, gbpStatus, recommendations) {
    const report = {
        timestamp: new Date().toISOString(),
        oauth2_config: {
            exists: !!config,
            account: config?.account || 'Not found',
            project: config?.project || 'Not found',
            token_expires_at: config?.expires_at || 'Not found',
            has_refresh_token: !!config?.refresh_token
        },
        google_cloud_config: {
            exists: !!cloudConfig,
            project: cloudConfig?.project || 'Not found',
            account: cloudConfig?.account || 'Not found'
        },
        enabled_apis: {
            count: enabledAPIs.length,
            apis: enabledAPIs
        },
        token_test: {
            total_endpoints: tokenTest.length,
            successful_endpoints: tokenTest.filter(t => t.success).length,
            failed_endpoints: tokenTest.filter(t => !t.success).length,
            success_rate: `${((tokenTest.filter(t => t.success).length / tokenTest.length) * 100).toFixed(1)}%`,
            results: tokenTest
        },
        gbp_status: gbpStatus,
        recommendations: recommendations,
        overall_status: recommendations.length === 0 ? 'READY' : 'NEEDS_FIXES'
    };

    // Speichere Bericht
    const reportPath = path.join(__dirname, '../data/gbp-permissions-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return report;
}

/**
 * Main Funktion
 */
async function main() {
    console.log('🚀 ZOE Solar - GBP Permissions Analysis & Troubleshooting');
    console.log('=' .repeat(70));

    // Load OAuth2 config
    const config = loadOAuth2Config();

    // Check Google Cloud config
    const cloudConfig = checkGoogleCloudConfig();

    // Check enabled APIs
    const enabledAPIs = checkEnabledAPIs(cloudConfig?.project);

    // Test token with different scopes
    let tokenTest = [];
    if (config) {
        console.log('\n✅ OAuth2 config found, testing token...');
        tokenTest = await testTokenWithDifferentScopes(config.access_token);
    }

    // Check GBP account status
    let gbpStatus = { hasAccounts: false, count: 0, accounts: [] };
    if (config && tokenTest.some(t => t.success)) {
        gbpStatus = await checkGBPAccountStatus(config.access_token);
    }

    // Create recommendations
    const recommendations = createRecommendations(config, cloudConfig, enabledAPIs, tokenTest, gbpStatus);

    // Create analysis report
    const report = createAnalysisReport(config, cloudConfig, enabledAPIs, tokenTest, gbpStatus, recommendations);

    console.log('\n' + '=' .repeat(70));
    console.log('📊 ANALYSIS SUMMARY:');
    console.log(`   OAuth2 Config: ${config ? '✅ Found' : '❌ Missing'}`);
    console.log(`   Google Cloud: ${cloudConfig ? '✅ Configured' : '❌ Issues'}`);
    console.log(`   Enabled APIs: ${enabledAPIs.length} business APIs`);
    console.log(`   Token Test: ${tokenTest.filter(t => t.success).length}/${tokenTest.length} working`);
    console.log(`   GBP Account: ${gbpStatus.hasAccounts ? `✅ ${gbpStatus.count} accounts` : '❌ None found'}`);
    console.log(`   Recommendations: ${recommendations.length} issues found`);
    console.log(`   Overall Status: ${report.overall_status}`);

    console.log('\n📁 DETAILED REPORT SAVED TO:');
    console.log(`   data/gbp-permissions-analysis-report.json`);

    console.log('\n' + '=' .repeat(70));
    console.log('🏁 GBP Permissions Analysis completed');
}

// Ausführen
main().catch(console.error);
#!/usr/bin/env node

/**
 * ZOE Solar - Google Business Profile OAuth2 Setup
 * Komplettes OAuth2 Setup für GBP API mit "insufficient authentication scopes" Lösung
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

// OAuth2 Konfiguration
const OAUTH2_CONFIG = {
    client_id: "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com",
    client_secret: "d-FL96QWqRn4xmsnUoym8dB1",
    redirect_uri: "http://localhost:8080",
    scope: "https://www.googleapis.com/auth/business.manage",
    auth_uri: "https://accounts.google.com/o/oauth2/v2/auth",
    token_uri: "https://oauth2.googleapis.com/token"
};

/**
 * Erstellt OAuth2 Authorization URL mit korrekten Parametern
 */
function createAuthUrl() {
    const params = new URLSearchParams({
        client_id: OAUTH2_CONFIG.client_id,
        redirect_uri: OAUTH2_CONFIG.redirect_uri,
        response_type: "code",
        scope: OAUTH2_CONFIG.scope,
        access_type: "offline",
        prompt: "consent"
    });

    return `${OAUTH2_CONFIG.auth_uri}?${params.toString()}`;
}

/**
 * Tauscht Authorization Code gegen Access Tokens
 */
async function exchangeCodeForTokens(code) {
    console.log('🔄 Exchanging authorization code for tokens...');

    try {
        const response = await fetch(OAUTH2_CONFIG.token_uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: OAUTH2_CONFIG.client_id,
                client_secret: OAUTH2_CONFIG.client_secret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: OAUTH2_CONFIG.redirect_uri
            })
        });

        if (response.ok) {
            const tokenData = await response.json();
            console.log('✅ Tokens received successfully');
            console.log(`   Access Token: ${tokenData.access_token.substring(0, 30)}...`);
            console.log(`   Refresh Token: ${tokenData.refresh_token ? 'Available' : 'Not Available'}`);
            console.log(`   Expires In: ${tokenData.expires_in} seconds`);
            return tokenData;
        } else {
            const errorText = await response.text();
            console.log('❌ Token exchange failed:', errorText);
            return null;
        }
    } catch (error) {
        console.log('❌ Network error during token exchange:', error.message);
        return null;
    }
}

/**
 * Testet den Access Token mit GBP API Endpoints
 */
async function testGBPAPIAccess(accessToken) {
    console.log('🧪 Testing GBP API access with working tokens...');

    const endpoints = [
        {
            name: 'Business Information API - Accounts',
            url: 'https://mybusinessbusinessinformation.googleapis.com/v1/accounts'
        },
        {
            name: 'Business Information API - Locations',
            url: 'https://mybusinessbusinessinformation.googleapis.com/v1/locations'
        },
        {
            name: 'My Business Account Management v4',
            url: 'https://mybusiness.googleapis.com/v4/accounts'
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
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log(`   Status: ${response.status} ${response.statusText}`);

            if (response.ok) {
                const data = await response.json();
                console.log('   ✅ SUCCESS - Endpoint accessible!');

                let itemCount = 0;
                if (data.accounts) {
                    itemCount = data.accounts.length;
                    console.log(`   📊 Found ${itemCount} accounts`);
                    if (itemCount > 0) {
                        console.log('   🏢 Available Accounts:');
                        data.accounts.slice(0, 3).forEach((account, index) => {
                            console.log(`      ${index + 1}. ${account.name} (${account.accountName || 'No name'})`);
                            console.log(`         Role: ${account.roleInfo?.role || 'No role'}`);
                        });
                        if (itemCount > 3) console.log(`      ... and ${itemCount - 3} more`);
                    }
                } else if (data.locations) {
                    itemCount = data.locations.length;
                    console.log(`   📊 Found ${itemCount} locations`);
                    if (itemCount > 0) {
                        console.log('   🏢 Available Locations:');
                        data.locations.slice(0, 3).forEach((location, index) => {
                            console.log(`      ${index + 1}. ${location.locationName || location.name}`);
                        });
                        if (itemCount > 3) console.log(`      ... and ${itemCount - 3} more`);
                    }
                }

                results.push({
                    endpoint: endpoint.name,
                    url: endpoint.url,
                    success: true,
                    data: data,
                    itemCount: itemCount
                });

            } else if (response.status === 401) {
                console.log('   ❌ Token expired or invalid');
                results.push({
                    endpoint: endpoint.name,
                    url: endpoint.url,
                    success: false,
                    error: 'Token expired or invalid'
                });
            } else if (response.status === 403) {
                console.log('   ❌ Insufficient permissions');
                results.push({
                    endpoint: endpoint.name,
                    url: endpoint.url,
                    success: false,
                    error: 'Insufficient permissions'
                });
            } else {
                const errorText = await response.text();
                console.log(`   ❌ Error: ${errorText.substring(0, 100)}...`);
                results.push({
                    endpoint: endpoint.name,
                    url: endpoint.url,
                    success: false,
                    error: errorText.substring(0, 100)
                });
            }
        } catch (error) {
            console.log(`   ❌ Network error: ${error.message}`);
            results.push({
                endpoint: endpoint.name,
                url: endpoint.url,
                success: false,
                error: error.message
            });
        }
    }

    return results;
}

/**
 * Speichert die OAuth2 Konfiguration
 */
function saveOAuth2Config(tokenData) {
    const config = {
        oauth2_config: {
            web: {
                client_id: OAUTH2_CONFIG.client_id,
                client_secret: OAUTH2_CONFIG.client_secret,
                redirect_uris: [OAUTH2_CONFIG.redirect_uri],
                auth_uri: OAUTH2_CONFIG.auth_uri,
                token_uri: OAUTH2_CONFIG.token_uri
            }
        },
        scopes: [OAUTH2_CONFIG.scope],
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_type: tokenData.token_type || "Bearer",
        expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
        expires_in: tokenData.expires_in,
        created_at: new Date().toISOString(),
        account: "zukunftsorientierte.energie@gmail.com",
        project: "zoe-solar-gbp"
    };

    // Speichere in multiple Dateien für verschiedene Zwecke
    const paths = [
        path.join(__dirname, '../data/oauth2-manual-config.json'),
        path.join(__dirname, '../data/gbp-oauth2-working-config.json')
    ];

    paths.forEach(filePath => {
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
    });

    console.log('💾 OAuth2 config saved to:');
    paths.forEach(p => console.log(`   ${p}`));
    return config;
}

/**
 * Speichert die API Test Ergebnisse
 */
function saveTestResults(testResults, accessToken) {
    const results = {
        timestamp: new Date().toISOString(),
        access_token_preview: accessToken.substring(0, 30) + '...',
        test_results: testResults,
        summary: {
            total_endpoints: testResults.length,
            successful_endpoints: testResults.filter(r => r.success).length,
            success_rate: `${((testResults.filter(r => r.success).length / testResults.length) * 100).toFixed(1)}%`,
            working_endpoints: testResults.filter(r => r.success).map(r => r.endpoint)
        }
    };

    const resultPath = path.join(__dirname, '../data/gbp-api-test-results.json');
    fs.writeFileSync(resultPath, JSON.stringify(results, null, 2));
    console.log(`💾 Test results saved to: ${resultPath}`);
    return results;
}

/**
 * Startet OAuth2 Web Server
 */
function startOAuthServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            const parsedUrl = url.parse(req.url, true);

            if (parsedUrl.pathname === '/') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>ZOE Solar - GBP OAuth2 Setup</title>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                max-width: 800px;
                                margin: 50px auto;
                                padding: 20px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                            }
                            .container {
                                background: rgba(255,255,255,0.1);
                                padding: 30px;
                                border-radius: 15px;
                                backdrop-filter: blur(10px);
                            }
                            .auth-button {
                                background-color: #4CAF50;
                                color: white;
                                padding: 20px 40px;
                                border: none;
                                border-radius: 10px;
                                font-size: 18px;
                                cursor: pointer;
                                margin: 20px 0;
                                font-weight: bold;
                                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                                transition: all 0.3s ease;
                                display: inline-block;
                                text-decoration: none;
                            }
                            .auth-button:hover {
                                background-color: #45a049;
                                transform: translateY(-2px);
                            }
                            .info {
                                background: rgba(255,255,255,0.15);
                                padding: 20px;
                                border-radius: 10px;
                                margin: 20px 0;
                            }
                            .success { color: #4CAF50; font-weight: bold; }
                            .error { color: #f44336; font-weight: bold; }
                            h1 {
                                text-align: center;
                                margin-bottom: 30px;
                                font-size: 2.5em;
                                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                            }
                            h3 {
                                color: #ffd700;
                                margin-top: 20px;
                            }
                            ul {
                                text-align: left;
                                line-height: 1.6;
                            }
                            .highlight {
                                background: rgba(255,215,0,0.2);
                                padding: 2px 6px;
                                border-radius: 4px;
                                font-weight: bold;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>🔐 ZOE Solar - GBP OAuth2 Setup</h1>

                            <div class="info">
                                <h3>🎯 PROBLEM LÖSUNG:</h3>
                                <p>Das <span class="highlight">"insufficient authentication scopes"</span> Problem wird jetzt gelöst!</p>
                                <p><strong>Benötigte Berechtigung:</strong> Google Business Profile Management</p>
                                <p><strong>Account:</strong> zukunftsorientierte.energie@gmail.com</p>
                            </div>

                            <a href="${createAuthUrl()}" class="auth-button">
                                🔑 GOOGLE AUTHORIZATION
                            </a>

                            <div class="info">
                                <h3>📋 SCHritt-für-Schritt Anleitung:</h3>
                                <ol>
                                    <li>Klicke auf den <strong>"GOOGLE AUTHORIZATION"</strong> Button</li>
                                    <li>Melde dich mit <strong>zukunftsorientierte.energie@gmail.com</strong> an</li>
                                    <li>Erlaube <strong>"Manage your business profiles"</strong> Zugriff</li>
                                    <li>Du wirst automatisch zurück zu dieser Seite geleitet</li>
                                    <li>Der Token wird gespeichert und alle GBP APIs werden getestet</li>
                                </ol>
                            </div>

                            <div class="info">
                                <h3>🔍 Erwartetes Ergebnis:</h3>
                                <ul>
                                    <li>✅ <strong>200 OK</strong> Responses von allen GBP APIs</li>
                                    <li>✅ Auflistung deiner bestehenden GBP Accounts</li>
                                    <li>✅ Berechtigung zum Erstellen neuer ZOE Solar Standorte</li>
                                    <li>✅ Vorbereitung für API-assisted Standort-Erstellung (27 Standorte)</li>
                                </ul>
                            </div>

                            <div class="info">
                                <h3>📊 WIRD AUTOMATISCH ERSTELLT:</h3>
                                <ul>
                                    <li>✅ OAuth2 Token mit business.manage scope</li>
                                    <li>✅ Konfigurationsdateien für API-Zugriff</li>
                                    <li>✅ API-Test Ergebnisse für alle Endpoints</li>
                                    <li>✅ Bereitschaft für ZOE Solar Standort-Erstellung</li>
                                </ul>
                            </div>
                        </div>
                    </body>
                    </html>
                `);
                return;
            }

            if (parsedUrl.pathname === '/oauth2callback') {
                const code = parsedUrl.query.code;
                const error = parsedUrl.query.error;

                if (error) {
                    console.log('❌ OAuth2 Error:', error);
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end(`
                        <div style="text-align: center; margin: 50px; color: red; font-family: Arial;">
                            <h1>❌ OAuth2 Authorization Failed</h1>
                            <p>Error: ${error}</p>
                            <p><a href="/">Try Again</a></p>
                        </div>
                    `);
                    server.close();
                    reject(new Error(`OAuth2 Error: ${error}`));
                    return;
                }

                if (code) {
                    console.log('✅ Authorization code received');

                    // Exchange code for tokens
                    const tokenData = await exchangeCodeForTokens(code);

                    if (tokenData) {
                        // Save config
                        const config = saveOAuth2Config(tokenData);

                        // Test API access
                        console.log('\n🧪 Testing GBP API access...');
                        const testResults = await testGBPAPIAccess(tokenData.access_token);

                        // Save test results
                        const results = saveTestResults(testResults, tokenData.access_token);

                        const workingEndpoints = testResults.filter(r => r.success).length;
                        const totalEndpoints = testResults.length;

                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(`
                            <div style="text-align: center; margin: 50px; font-family: Arial; color: #333;">
                                <h1 style="color: #4CAF50;">🎉 OAuth2 Setup SUCCESSFUL!</h1>

                                <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 600px;">
                                    <h3>✅ TOKEN DATEN:</h3>
                                    <p><strong>Access Token:</strong> ${tokenData.access_token.substring(0, 30)}...</p>
                                    <p><strong>Refresh Token:</strong> ${tokenData.refresh_token ? 'Available' : 'Not Available'}</p>
                                    <p><strong>Expires In:</strong> ${tokenData.expires_in} seconds</p>
                                    <p><strong>Account:</strong> zukunftsorientierte.energie@gmail.com</p>
                                </div>

                                <div style="background: ${workingEndpoints > 0 ? '#e8f5e8' : '#ffe8e8'}; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 600px;">
                                    <h3>🧪 API TEST ERGEBNISSE:</h3>
                                    <p><strong>Working Endpoints:</strong> ${workingEndpoints}/${totalEndpoints}</p>
                                    <p><strong>Success Rate:</strong> ${results.summary.success_rate}</p>
                                    ${workingEndpoints > 0 ? '<p class="success">✅ GBP API ACCESS NOW WORKING!</p>' : '<p class="error">❌ API Access still limited</p>'}
                                </div>

                                ${testResults.map(result => `
                                    <div style="background: ${result.success ? '#e8f5e8' : '#ffe8e8'}; padding: 10px; margin: 10px auto; max-width: 600px; text-align: left; border-radius: 5px;">
                                        <strong>${result.endpoint}:</strong>
                                        <span style="${result.success ? 'color: green' : 'color: red'}">
                                            ${result.success ? '✅ SUCCESS' : '❌ FAILED'}
                                        </span>
                                        ${result.itemCount ? `<br>Items: ${result.itemCount}` : ''}
                                        ${result.error ? `<br>Error: ${result.error}` : ''}
                                    </div>
                                `).join('')}

                                <div style="background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px auto; max-width: 600px;">
                                    <h3>📁 GESPEICHERTE DATEIEN:</h3>
                                    <ul style="text-align: left;">
                                        <li>data/oauth2-manual-config.json ✅</li>
                                        <li>data/gbp-oauth2-working-config.json ✅</li>
                                        <li>data/gbp-api-test-results.json ✅</li>
                                    </ul>
                                </div>

                                ${workingEndpoints > 0 ? `
                                <h3>🚀 NÄCHSTER SCHRITT:</h3>
                                <p><strong>Führe aus:</strong> <code>node scripts/gbp-location-data-creator.cjs</code></p>
                                <p>Jetzt werden alle 27 ZOE Solar Standorte mit vollständigen Daten erstellt!</p>
                                ` : `
                                <h3>⚠️ PROBLEM LÖSUNG BENÖTIGT:</h3>
                                <p>Der OAuth2 Setup war erfolgreich, aber die API-Zugriffe sind noch eingeschränkt.</p>
                                <p>Bitte überprüfe die Google Business Profile Berechtigungen.</p>
                                `}

                                <script>
                                    setTimeout(() => {
                                        console.log('OAuth2 setup completed successfully!');
                                    }, 2000);
                                </script>
                            </div>
                        `);

                        server.close();
                        resolve({ success: true, config, testResults, results });
                    } else {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.end(`
                            <div style="text-align: center; margin: 50px;">
                                <h1 class="error">❌ Token Exchange Failed</h1>
                                <p>Could not exchange authorization code for tokens.</p>
                                <p><a href="/">Try Again</a></p>
                            </div>
                        `);
                        server.close();
                        reject(new Error('Token exchange failed'));
                    }
                } else {
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end(`
                        <div style="text-align: center; margin: 50px;">
                            <h1 class="error">❌ No Authorization Code</h1>
                            <p>No authorization code received from Google.</p>
                            <p><a href="/">Try Again</a></p>
                        </div>
                    `);
                    server.close();
                    reject(new Error('No authorization code'));
                }
            }
        });

        server.listen(8080, () => {
            console.log('🌐 OAuth2 Server started on http://localhost:8080');
            console.log('📱 Öffne http://localhost:8080 in Safari Browser!');
        });

        // Timeout nach 15 Minuten
        setTimeout(() => {
            console.log('⏰ OAuth2 Server timeout - closing');
            server.close();
            reject(new Error('OAuth2 server timeout'));
        }, 15 * 60 * 1000);
    });
}

/**
 * Main Funktion
 */
async function main() {
    console.log('🚀 ZOE Solar - Google Business Profile OAuth2 Setup');
    console.log('=' .repeat(70));

    console.log('📋 OAuth2 KONFIGURATION:');
    console.log(`   Client ID: ${OAUTH2_CONFIG.client_id.substring(0, 20)}...`);
    console.log(`   Client Secret: ${OAUTH2_CONFIG.client_secret.substring(0, 10)}...`);
    console.log(`   Redirect URI: ${OAUTH2_CONFIG.redirect_uri}`);
    console.log(`   Required Scope: ${OAUTH2_CONFIG.scope}`);
    console.log(`   Account: zukunftsorientierte.energie@gmail.com`);
    console.log(`   Project: zoe-solar-gbp`);

    console.log('\n🎯 LÖSUNG FÜR "insufficient authentication scopes":');
    console.log('Problem: Fehlende Business Management Berechtigungen');
    console.log('Lösung: User OAuth2 mit korrektem business.manage scope');

    console.log('\n🌐 Starting OAuth2 flow...');
    console.log('⚠️  WICHTIG: Öffne http://localhost:8080 in Safari Browser!');
    console.log('⚠️  Meld dich mit zukunftsorientierte.energie@gmail.com an!');

    try {
        const result = await startOAuthServer();

        if (result.success) {
            console.log('\n🎉 OAuth2 Setup ERFOLGREICH!');
            console.log('✅ OAuth2 Authentication: COMPLETED');
            console.log('✅ API Access Test: COMPLETED');
            console.log('✅ Configuration Files: SAVED');
            console.log('✅ Ready for ZOE Solar location creation!');

            const workingEndpoints = result.testResults.filter(r => r.success).length;
            console.log(`\n📊 API TEST ERGEBNISSE: ${workingEndpoints}/${result.testResults.length} Endpoints working`);
            console.log(`📈 Success Rate: ${result.results.summary.success_rate}`);

            if (workingEndpoints > 0) {
                console.log('\n🚀 NÄCHSTER SCHRITT:');
                console.log('Führe aus: node scripts/gbp-location-data-creator.cjs');
                console.log('Jetzt werden alle 27 ZOE Solar Standorte mit vollständigen Daten erstellt!');
            }
        }
    } catch (error) {
        console.log('\n❌ OAuth2 Setup fehlgeschlagen:', error.message);
        console.log('💡 Bitte versuche es erneut oder überprüfe die Google-Konto-Berechtigungen');
    }

    console.log('\n' + '=' .repeat(70));
    console.log('🏁 ZOE Solar GBP OAuth2 Setup abgeschlossen');
}

// Ausführen
main().catch(console.error);
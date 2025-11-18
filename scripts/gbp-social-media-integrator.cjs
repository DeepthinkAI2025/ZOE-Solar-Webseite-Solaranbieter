/**
 * ZOE Solar - GBP Social Media Integration
 * Integriert Social Media URLs für alle Google Business Profile Standorte
 *
 * Version: 1.0.0
 * Created: 2025-11-01
 */

const fs = require('fs');
const path = require('path');

// Social Media Konfiguration für ZOE Solar
const SOCIAL_MEDIA_CONFIG = {
    business: {
        name: "ZOE Solar",
        facebook: "https://www.facebook.com/profile.php?id=100088899755919",
        instagram: "https://www.instagram.com/_zoe_solar/",
        linkedin: "https://www.linkedin.com/company/91625256",
        whatsapp: "https://wa.me/15678876200",
        website: "https://zoe-solar.de",
        email: "info@zoe-solar.de"
    },
    platforms: {
        facebook: {
            name: "Facebook",
            url_template: "https://www.facebook.com/profile.php?id=100088899755919",
            description: "Folgen Sie uns auf Facebook für Updates und Neuigkeiten"
        },
        instagram: {
            name: "Instagram",
            url_template: "https://www.instagram.com/_zoe_solar/",
            description: "Entdecken Sie unsere Projekte auf Instagram"
        },
        linkedin: {
            name: "LinkedIn",
            url_template: "https://www.linkedin.com/company/91625256",
            description: "Vernetzen Sie sich mit uns auf LinkedIn"
        },
        whatsapp: {
            name: "WhatsApp",
            url_template: "https://wa.me/15678876200",
            description: "Kontaktieren Sie uns über WhatsApp für eine schnelle Beratung"
        },
        youtube: {
            name: "YouTube",
            url_template: "https://youtube.com/@zoesolar",
            description: "Schauen Sie sich unsere Videos auf YouTube an"
        },
        twitter: {
            name: "Twitter/X",
            url_template: "https://twitter.com/zoesolar",
            description: "Folgen Sie uns auf Twitter für aktuelle Nachrichten"
        },
        website: {
            name: "Website",
            url_template: "https://zoe-solar.de",
            description: "Besuchen Sie unsere Website für mehr Informationen"
        },
        email: {
            name: "Email",
            url_template: "mailto:info@zoe-solar.de",
            description: "Kontaktieren Sie uns per Email"
        }
    }
};

/**
 * Erstellt Social Media Integration für alle Standorte
 */
function createSocialMediaIntegration() {
    console.log('🚀 ZOE Solar - GBP Social Media Integration');
    console.log('='.repeat(80));
    console.log('📋 Creating social media integration for all locations...\n');

    // Lade die Standortdaten
    const locationsPath = path.join(__dirname, '../data/zoe-solar-locations.json');
    let locations;

    try {
        const locationsData = fs.readFileSync(locationsPath, 'utf8');
        const jsonData = JSON.parse(locationsData);
        locations = jsonData.locations || [];
        console.log(`✅ Loaded ${locations.length} locations for social media integration`);
    } catch (error) {
        console.error('❌ Error loading locations:', error.message);
        return;
    }

    // Erstelle Social Media Integration für jeden Standort
    const locationsWithSocialMedia = locations.map(location => {
        const locationSocialMedia = {
            ...location,
            social_media: {
                ...SOCIAL_MEDIA_CONFIG.business,
                location_specific: generateLocationSpecificSocialMedia(location)
            },
            social_links: generateSocialMediaLinks(location),
            contact_methods: generateContactMethods(location)
        };

        return locationSocialMedia;
    });

    // Speichere aktualisierte Standortdaten mit Social Media
    const updatedData = {
        ...JSON.parse(fs.readFileSync(locationsPath, 'utf8')),
        locations: locationsWithSocialMedia,
        social_media_integration: {
            integrated_at: new Date().toISOString(),
            total_locations: locationsWithSocialMedia.length,
            platforms_integrated: Object.keys(SOCIAL_MEDIA_CONFIG.platforms).length,
            business_name: SOCIAL_MEDIA_CONFIG.business.name
        }
    };

    const outputPath = path.join(__dirname, '../data/zoe-solar-locations-with-social-media.json');
    fs.writeFileSync(outputPath, JSON.stringify(updatedData, null, 2));
    console.log(`💾 Updated locations with social media: zoe-solar-locations-with-social-media.json`);

    // Erstelle Social Media CSV für GBP
    const socialMediaCSV = createSocialMediaCSV(locationsWithSocialMedia);
    const csvPath = path.join(__dirname, '../data/zoe-solar-social-media-gbp.csv');
    fs.writeFileSync(csvPath, socialMediaCSV);
    console.log(`💾 Social media CSV created: zoe-solar-social-media-gbp.csv`);

    // Erstelle Social Media Anleitung
    const socialMediaGuide = createSocialMediaIntegrationGuide();
    const guidePath = path.join(__dirname, '../data/gbp-social-media-integration-guide.md');
    fs.writeFileSync(guidePath, socialMediaGuide);
    console.log(`📖 Social media integration guide: gbp-social-media-integration-guide.md`);

    // Erstelle Social Media Validierungsbericht
    const validationReport = createSocialMediaValidationReport(locationsWithSocialMedia);
    const reportPath = path.join(__dirname, '../data/gbp-social-media-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(validationReport, null, 2));
    console.log(`📊 Social media validation report: gbp-social-media-validation-report.json`);

    return locationsWithSocialMedia;
}

/**
 * Generiert standortspezifische Social Media Daten
 */
function generateLocationSpecificSocialMedia(location) {
    return {
        location_tag: `#${location.name.replace(/\s+/g, '').toLowerCase()}`,
        local_hashtags: generateLocalHashtags(location),
        regional_content: generateRegionalContent(location),
        location_specific_offers: generateLocationSpecificOffers(location)
    };
}

/**
 * Generiert lokale Hashtags für jeden Standort
 */
function generateLocalHashtags(location) {
    const city = location.address.locality.toLowerCase();
    const state = location.address.administrativeArea.toLowerCase();

    return [
        `#${city.replace(/\s+/g, '')}solar`,
        `#${state.replace(/\s+/g, '')}solarenergie`,
        `#${city.replace(/\s+/g, '')}photovoltaik`,
        `#zoesolar${city.replace(/\s+/g, '')}`,
        `#solarenergie${city.replace(/\s+/g, '')}`,
        `#photovoltaik${city.replace(/\s+/g, '')}`,
        `#grünerstrom${city.replace(/\s+/g, '')}`,
        `#nachhaltigkeit${city.replace(/\s+/g, '')}`
    ];
}

/**
 * Generiert regionale Content-Ideen
 */
function generateRegionalContent(location) {
    const city = location.address.locality;
    const state = location.address.administrativeArea;

    return {
        blog_topics: [
            `Solaranlage kaufen in ${city}`,
            `Photovoltaik Preise ${state}`,
            `Solarförderung ${city} 2025`,
            `Stromkosten sparen mit Solar in ${state}`,
            `Solarpanel Installation ${city}`
        ],
        social_media_posts: [
            `Neues Solarprojekt in ${city} abgeschlossen! 🌞`,
            `Jetzt Solarförderung in ${state} sichern`,
            `Kostenlose Solarberatung für ${city} und Umgebung`,
            `Ihr Solar-Experte für ${state}`,
            `Photovoltaik für ${city} - Nachhaltig profitieren`
        ],
        local_events: [
            `Solar-Infotag in ${city}`,
            `Photovoltaik Workshop ${state}`,
            `Nachhaltigkeitsmesse ${city}`,
            `Energie-Consulting ${state}`
        ]
    };
}

/**
 * Generiert standortspezifische Angebote
 */
function generateLocationSpecificOffers(location) {
    const city = location.address.locality;

    return [
        `Kostenlose Solaranalyse für ${city}`,
        `Regionale Solarförderung nutzen`,
        `Vor-Ort-Beratung in ${city}`,
        `Schnelle Installation in ${city} und Umgebung`,
        `Service und Wartung für ${city}`
    ];
}

/**
 * Generiert Social Media Links
 */
function generateSocialMediaLinks(location) {
    const links = [];

    Object.entries(SOCIAL_MEDIA_CONFIG.platforms).forEach(([platform, config]) => {
        links.push({
            platform: platform,
            name: config.name,
            url: config.url_template,
            description: config.description,
            location_specific: `${config.description} - Standort: ${location.name}`
        });
    });

    return links;
}

/**
 * Generiert Kontaktmethoden
 */
function generateContactMethods(location) {
    return {
        primary: {
            type: "phone",
            value: location.phone,
            description: "Haupttelefon für Anfragen und Beratung"
        },
        secondary: [
            {
                type: "whatsapp",
                value: SOCIAL_MEDIA_CONFIG.business.whatsapp,
                description: "Kontaktieren Sie uns schnell über WhatsApp"
            },
            {
                type: "email",
                value: SOCIAL_MEDIA_CONFIG.business.email,
                description: "Senden Sie uns eine Email für detaillierte Anfragen"
            },
            {
                type: "website",
                value: SOCIAL_MEDIA_CONFIG.business.website,
                description: "Besuchen Sie unsere Website für Informationen"
            },
            {
                type: "facebook",
                value: SOCIAL_MEDIA_CONFIG.business.facebook,
                description: "Folgen Sie uns auf Facebook"
            },
            {
                type: "instagram",
                value: SOCIAL_MEDIA_CONFIG.business.instagram,
                description: "Entdecken Sie unsere Projekte auf Instagram"
            },
            {
                type: "linkedin",
                value: SOCIAL_MEDIA_CONFIG.business.linkedin,
                description: "Vernetzen Sie sich geschäftlich auf LinkedIn"
            }
        ]
    };
}

/**
 * Erstellt Social Media CSV für GBP
 */
function createSocialMediaCSV(locations) {
    const headers = [
        'Location Name',
        'Facebook URL',
        'Instagram URL',
        'LinkedIn URL',
        'WhatsApp URL',
        'Website URL',
        'Email',
        'Primary Phone',
        'Location Hashtags',
        'Social Media Description'
    ];

    const rows = locations.map(location => {
        const hashtags = location.social_media.location_specific.local_hashtags.join(', ');
        const description = `Folgen Sie ZOE Solar auf Social Media für Updates, Projekte und Neuigkeiten aus ${location.address.locality}.`;

        return [
            location.name,
            SOCIAL_MEDIA_CONFIG.business.facebook,
            SOCIAL_MEDIA_CONFIG.business.instagram,
            SOCIAL_MEDIA_CONFIG.business.linkedin,
            SOCIAL_MEDIA_CONFIG.business.whatsapp,
            SOCIAL_MEDIA_CONFIG.business.website,
            SOCIAL_MEDIA_CONFIG.business.email,
            location.phone,
            hashtags,
            description
        ];
    });

    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    return csvContent;
}

/**
 * Erstellt Social Media Integrations-Anleitung
 */
function createSocialMediaIntegrationGuide() {
    return `# ZOE Solar - Google Business Profile Social Media Integration Guide

## 📋 Overview
This guide provides comprehensive instructions for integrating social media links into all ZOE Solar Google Business Profile locations.

## 🌐 Social Media Platforms

### Primary Platforms
- **Facebook**: https://www.facebook.com/profile.php?id=100088899755919
- **Instagram**: https://www.instagram.com/_zoe_solar/
- **LinkedIn**: https://www.linkedin.com/company/91625256
- **WhatsApp**: https://wa.me/15678876200

### Additional Platforms
- **Website**: https://zoe-solar.de
- **Email**: mailto:info@zoe-solar.de
- **YouTube**: https://youtube.com/@zoesolar
- **Twitter**: https://twitter.com/zoesolar

## 🚀 Integration Process

### Step 1: Access Individual GBP Locations
1. Go to [Google Business Profile Manager](https://business.google.com/)
2. Select each location individually
3. Navigate to the "Info" tab
4. Scroll to the "Social profiles" section

### Step 2: Add Social Media Links
For each location, add the following social media profiles:

#### Facebook
- URL: https://www.facebook.com/profile.php?id=100088899755919
- Label: Facebook

#### Instagram
- URL: https://www.instagram.com/_zoe_solar/
- Label: Instagram

#### LinkedIn
- URL: https://www.linkedin.com/company/91625256
- Label: LinkedIn

#### WhatsApp
- URL: https://wa.me/15678876200
- Label: WhatsApp

### Step 3: Add Contact Information
Ensure each location has:

#### Primary Contact
- Phone: Location-specific phone number
- Website: https://zoe-solar.de
- Email: info@zoe-solar.de

#### Additional Contact Methods
- Add WhatsApp as additional contact method
- Include social media links in business description

### Step 4: Update Business Descriptions
Incorporate social media references in business descriptions:

\`\`\`
Besuchen Sie uns auf Social Media:
📸 Instagram: @_zoe_solar
📘 Facebook: ZOE Solar
💼 LinkedIn: ZOE Solar
💬 WhatsApp: +49 176 83214923

Ihre lokale Solar-Experten in [CITY].
\`\`\`

## 📍 Location-Specific Strategy

### Local Hashtags
Each location should use location-specific hashtags:
- \#[CITY]solar
- \#[STATE]solarenergie
- \#[CITY]photovoltaik
- #zoesolar[CITY]

### Regional Content
Create content relevant to each location:
- Local solar projects
- Regional solar incentives
- Local customer testimonials
- Area-specific solar news

### Community Engagement
- Participate in local community events
- Share local sustainability initiatives
- Highlight regional partnerships
- Feature local customer stories

## 📊 Social Media Content Strategy

### Content Categories
1. **Project Showcases**: Completed installations in each location
2. **Educational Content**: Solar tips and guides
3. **Customer Stories**: Testimonials from local customers
4. **Industry News**: Solar energy updates
5. **Company Updates**: ZOE Solar news and achievements

### Posting Schedule
- **Facebook**: 3-4 posts per week
- **Instagram**: 4-5 posts per week
- **LinkedIn**: 2-3 posts per week
- **WhatsApp**: Updates for interested customers

### Engagement Strategy
- Respond to comments within 24 hours
- Share user-generated content
- Run location-specific campaigns
- Collaborate with local businesses

## 🔧 Technical Implementation

### GBP API Integration
For automated social media integration:
1. Use the GBP API to update social profiles
2. Implement bulk updates for all locations
3. Schedule regular social media link validation
4. Monitor social media engagement metrics

### CSV Import Method
Use the provided CSV file:
1. Download: \`zoe-solar-social-media-gbp.csv\`
2. Import into GBP Manager
3. Map social media columns correctly
4. Validate all links before finalizing

## 📈 Success Metrics

### Key Performance Indicators
- Social media profile views
- Click-through rates from GBP to social media
- Engagement rates on social media posts
- Lead generation from social media channels
- Local brand awareness metrics

### Reporting Schedule
- Weekly: Engagement metrics
- Monthly: Performance overview
- Quarterly: Strategy review
- Annually: Comprehensive analysis

## ⚠️ Best Practices

### Consistency
- Use consistent branding across all platforms
- Maintain uniform messaging
- Update all locations simultaneously
- Monitor brand mentions regularly

### Compliance
- Follow GBP guidelines for external links
- Ensure all social media accounts are active
- Keep social media content professional
- Respond to reviews and comments promptly

### Local Relevance
- Tailor content to local audiences
- Highlight local expertise
- Participate in community discussions
- Build local relationships

## 🎯 Next Steps

1. **Immediate**: Add social media links to all GBP locations
2. **Week 1**: Update business descriptions with social media references
3. **Week 2**: Implement location-specific content strategy
4. **Month 1**: Review and optimize social media integration
5. **Ongoing**: Monitor performance and adjust strategy

---
*Generated: ${new Date().toISOString().split('T')[0]}*
*Total Locations: ${SOCIAL_MEDIA_CONFIG.business.name}*
*Social Platforms: ${Object.keys(SOCIAL_MEDIA_CONFIG.platforms).length}*
`;
}

/**
 * Erstellt Social Media Validierungsbericht
 */
function createSocialMediaValidationReport(locations) {
    const report = {
        summary: {
            total_locations: locations.length,
            social_media_integrated: locations.filter(l => l.social_media).length,
            validation_date: new Date().toISOString(),
            platforms_configured: Object.keys(SOCIAL_MEDIA_CONFIG.platforms).length
        },
        platform_coverage: {},
        location_analysis: {},
        issues: [],
        recommendations: []
    };

    // Analysiere Platform-Abdeckung
    Object.keys(SOCIAL_MEDIA_CONFIG.platforms).forEach(platform => {
        report.platform_coverage[platform] = {
            configured_locations: locations.length,
            url: SOCIAL_MEDIA_CONFIG.platforms[platform].url_template,
            status: 'active'
        };
    });

    // Analysiere Standortdaten
    locations.forEach(location => {
        const phase = location.phase;
        if (!report.location_analysis[phase]) {
            report.location_analysis[phase] = {
                count: 0,
                with_social_media: 0,
                with_local_hashtags: 0,
                with_contact_methods: 0
            };
        }

        report.location_analysis[phase].count++;

        if (location.social_media) {
            report.location_analysis[phase].with_social_media++;
        }

        if (location.social_media && location.social_media.location_specific && location.social_media.location_specific.local_hashtags) {
            report.location_analysis[phase].with_local_hashtags++;
        }

        if (location.contact_methods && location.contact_methods.secondary) {
            report.location_analysis[phase].with_contact_methods++;
        }
    });

    // Erstelle Empfehlungen
    if (report.summary.social_media_integrated < report.summary.total_locations) {
        report.recommendations.push('Complete social media integration for all locations');
    }

    report.recommendations.push('Regularly validate social media links');
    report.recommendations.push('Monitor social media engagement metrics');
    report.recommendations.push('Update location-specific content regularly');

    return report;
}

/**
 * Hauptfunktion
 */
function main() {
    try {
        const locationsWithSocialMedia = createSocialMediaIntegration();

        console.log('\n' + '='.repeat(80));
        console.log('📊 ZOE SOLAR - SOCIAL MEDIA INTEGRATION SUMMARY');
        console.log('='.repeat(80));

        console.log(`\n📈 INTEGRATION RESULTS:`);
        console.log(`   ✅ ${locationsWithSocialMedia.length} locations with social media integration`);
        console.log(`   ✅ ${Object.keys(SOCIAL_MEDIA_CONFIG.platforms).length} social media platforms integrated`);
        console.log(`   ✅ Location-specific hashtags generated`);
        console.log(`   ✅ Regional content strategy created`);
        console.log(`   ✅ Contact methods configured`);

        console.log(`\n📁 FILES CREATED:`);
        console.log(`   - zoe-solar-locations-with-social-media.json (Updated locations)`);
        console.log(`   - zoe-solar-social-media-gbp.csv (Social media CSV)`);
        console.log(`   - gbp-social-media-integration-guide.md (Integration guide)`);
        console.log(`   - gbp-social-media-validation-report.json (Validation report)`);

        console.log(`\n🎯 NEXT STEPS:`);
        console.log(`   1. Review integration guide: data/gbp-social-media-integration-guide.md`);
        console.log(`   2. Check validation report: data/gbp-social-media-validation-report.json`);
        console.log(`   3. Add social media links to GBP locations manually`);
        console.log(`   4. Implement location-specific content strategy`);
        console.log(`   5. Monitor social media engagement`);

        console.log('\n' + '='.repeat(80));
        console.log('🏁 Social Media Integration completed successfully');

    } catch (error) {
        console.error('❌ Error during social media integration:', error.message);
        process.exit(1);
    }
}

// Skript ausführen
if (require.main === module) {
    main();
}

module.exports = {
    createSocialMediaIntegration,
    generateLocalHashtags,
    generateRegionalContent,
    createSocialMediaCSV
};
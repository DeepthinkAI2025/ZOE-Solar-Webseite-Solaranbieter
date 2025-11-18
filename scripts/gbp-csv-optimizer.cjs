/**
 * ZOE Solar - GBP CSV Optimizer
 * Optimiert CSV-Dateien für Google Business Profile Bulk Import
 *
 * Version: 1.0.0
 * Created: 2025-11-01
 */

const fs = require('fs');
const path = require('path');

// GBP Bulk Import CSV Header Konfiguration
const GBP_CSV_HEADERS = [
    'Name',
    'Address Line 1',
    'City',
    'State',
    'ZIP',
    'Phone',
    'Website',
    'Primary Category',
    'Description',
    'Service Radius (km)',
    'Opening Hours Monday',
    'Opening Hours Tuesday',
    'Opening Hours Wednesday',
    'Opening Hours Thursday',
    'Opening Hours Friday',
    'Opening Hours Saturday',
    'Opening Hours Sunday',
    'Latitude',
    'Longitude',
    'Labels',
    'Ad Words Location Extensions',
    'Location Group Name'
];

// Geschäftskonfiguration
const BUSINESS_CONFIG = {
    name: "ZOE Solar",
    category: "Solaranlagenservice",
    service_radius_km: 50,
    opening_hours: {
        monday: "00:00-23:59",
        tuesday: "00:00-23:59",
        wednesday: "00:00-23:59",
        thursday: "00:00-23:59",
        friday: "00:00-23:59",
        saturday: "00:00-23:59",
        sunday: "Geschlossen"
    },
    website: "https://zoe-solar.de",
    phone: "+49 176 83214923"
};

/**
 * Optimierte CSV-Erstellung für GBP Bulk Import
 */
function createOptimizedCSV() {
    console.log('🚀 ZOE Solar - GBP CSV Optimizer');
    console.log('='.repeat(80));
    console.log('📋 Optimizing CSV files for Google Business Profile bulk import...\n');

    // Lade die erstellten Standortdaten
    const locationsPath = path.join(__dirname, '../data/zoe-solar-locations.json');
    let locations;

    try {
        const locationsData = fs.readFileSync(locationsPath, 'utf8');
        const jsonData = JSON.parse(locationsData);
        locations = jsonData.locations || [];
        console.log(`✅ Loaded ${locations.length} locations from JSON file`);
    } catch (error) {
        console.error('❌ Error loading locations:', error.message);
        return;
    }

    // Erstelle optimierte CSV-Daten
    const optimizedRows = locations.map(location => {
        const row = [
            location.name,
            location.address.streetAddress,
            location.address.locality,
            location.address.administrativeArea,
            location.address.postalCode,
            location.phone,
            location.website,
            location.category,
            location.description.substring(0, 250), // GBP Beschreibungs-Limit
            BUSINESS_CONFIG.service_radius_km.toString(),
            BUSINESS_CONFIG.opening_hours.monday,
            BUSINESS_CONFIG.opening_hours.tuesday,
            BUSINESS_CONFIG.opening_hours.wednesday,
            BUSINESS_CONFIG.opening_hours.thursday,
            BUSINESS_CONFIG.opening_hours.friday,
            BUSINESS_CONFIG.opening_hours.saturday,
            BUSINESS_CONFIG.opening_hours.sunday,
            location.coordinates?.latitude || '',
            location.coordinates?.longitude || '',
            location.labels?.join(', ') || '',
            'true', // Ad Words Location Extensions
            location.phase || 'ZOE Solar Locations'
        ];

        return row;
    });

    // Erstelle vollständigen CSV-Content
    const csvContent = [GBP_CSV_HEADERS, ...optimizedRows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    // Speichere optimierte CSV-Dateien
    const optimizedFiles = [
        {
            filename: 'zoe-solar-gbp-optimized-complete.csv',
            description: 'Complete optimized CSV for GBP bulk import',
            data: csvContent
        }
    ];

    // Erstelle separate CSVs für jede Phase
    const phases = ['Berlin-Brandenburg', 'International', 'Bundesländer'];
    phases.forEach(phase => {
        const phaseLocations = locations.filter(l => l.phase === phase);
        const phaseRows = phaseLocations.map(location => {
            const row = [
                location.name,
                location.address.streetAddress,
                location.address.locality,
                location.address.administrativeArea,
                location.address.postalCode,
                location.phone,
                location.website,
                location.category,
                location.description.substring(0, 250),
                BUSINESS_CONFIG.service_radius_km.toString(),
                BUSINESS_CONFIG.opening_hours.monday,
                BUSINESS_CONFIG.opening_hours.tuesday,
                BUSINESS_CONFIG.opening_hours.wednesday,
                BUSINESS_CONFIG.opening_hours.thursday,
                BUSINESS_CONFIG.opening_hours.friday,
                BUSINESS_CONFIG.opening_hours.saturday,
                BUSINESS_CONFIG.opening_hours.sunday,
                location.coordinates?.latitude || '',
                location.coordinates?.longitude || '',
                location.labels?.join(', ') || '',
                'true',
                location.phase
            ];
            return row;
        });

        const phaseCSV = [GBP_CSV_HEADERS, ...phaseRows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        optimizedFiles.push({
            filename: `zoe-solar-gbp-optimized-${phase.toLowerCase().replace('ö', 'oe').replace('ä', 'ae').replace('ü', 'ue').replace(/\s+/g, '-')}.csv`,
            description: `Optimized CSV for ${phase} phase (${phaseLocations.length} locations)`,
            data: phaseCSV
        });
    });

    // Speichere alle optimierten CSV-Dateien
    optimizedFiles.forEach(file => {
        const filePath = path.join(__dirname, '../data', file.filename);
        fs.writeFileSync(filePath, file.data);

        const lineCount = file.data.split('\n').length;
        console.log(`💾 Optimized CSV saved: ${file.filename}`);
        console.log(`   ${file.description}`);
        console.log(`   Lines: ${lineCount} (${lineCount - 1} locations + header)\n`);
    });

    // Erstelle GBP Import Anleitung
    const importInstructions = createImportInstructions(optimizedFiles);
    const instructionsPath = path.join(__dirname, '../data/gbp-import-instructions.md');
    fs.writeFileSync(instructionsPath, importInstructions);
    console.log(`📖 Import instructions saved: gbp-import-instructions.md`);

    // Erstelle CSV Validierungsbericht
    const validationReport = createValidationReport(locations, optimizedRows);
    const validationPath = path.join(__dirname, '../data/gbp-csv-validation-report.json');
    fs.writeFileSync(validationPath, JSON.stringify(validationReport, null, 2));
    console.log(`📊 Validation report saved: gbp-csv-validation-report.json`);

    return optimizedFiles;
}

/**
 * Erstellt detaillierte Import Anweisungen
 */
function createImportInstructions(files) {
    return `# ZOE Solar - Google Business Profile Bulk Import Instructions

## 📋 Overview
This document provides step-by-step instructions for importing ZOE Solar locations into Google Business Profile using the optimized CSV files.

## 📁 Available CSV Files

${files.map(file => `- **${file.filename}**: ${file.description}`).join('\n')}

## 🚀 Import Process

### Step 1: Access Google Business Profile Manager
1. Go to [Google Business Profile Manager](https://business.google.com/)
2. Sign in with your business account: \`zukunftsorientierte.energie@gmail.com\`
3. Ensure you have manager or owner permissions

### Step 2: Choose Import Method
You have two options for importing locations:

#### Option A: Bulk Import via CSV (Recommended for multiple locations)
1. In Business Profile Manager, click on the "Locations" tab
2. Click "Import locations" (or "Bulk import")
3. Select the appropriate CSV file:
   - For all locations: \`zoe-solar-gbp-optimized-complete.csv\`
   - For specific phases: Use the phase-specific CSV files
4. Follow the on-screen instructions to map columns
5. Review and confirm the import

#### Option B: Manual Creation (For individual locations)
1. Click "Add location" in Business Profile Manager
2. Enter location details manually using the CSV data as reference
3. Use the optimized data for accuracy

### Step 3: Column Mapping Guide
The CSV files use these standard GBP headers:
- **Name**: Business location name
- **Address Line 1**: Street address
- **City**: City/locality
- **State**: State/province
- **ZIP**: Postal code
- **Phone**: Phone number with country code
- **Website**: Website URL
- **Primary Category**: "Solaranlagenservice"
- **Description**: Business description (max 250 characters)
- **Service Radius (km)**: 50 (service area business)
- **Opening Hours**: Daily opening hours
- **Latitude/Longitude**: Geographic coordinates
- **Labels**: Location tags
- **Ad Words Location Extensions**: Set to "true"

### Step 4: Post-Import Verification
1. Verify all locations were imported correctly
2. Check that each location has the correct:
   - Address and contact information
   - Business category
   - Service area radius
   - Opening hours
   - Website link
3. Add photos and additional details to each location
4. Set up location-specific phone numbers if needed

### Step 5: Social Media Integration
After import, add social media links to each location:
- Facebook: https://www.facebook.com/profile.php?id=100088899755919
- Instagram: https://www.instagram.com/_zoe_solar/
- LinkedIn: https://www.linkedin.com/company/91625256
- WhatsApp: https://wa.me/15678876200

## ⚠️ Important Notes

1. **Service Area Business**: All locations are configured as service area businesses with a 50km radius
2. **Phone Format**: Use international format (+49 for Germany)
3. **Website**: All locations link to the main website
4. **Category**: All locations use "Solaranlagenservice" as primary category
5. **Descriptions**: Optimized for SEO and within GBP character limits
6. **Coordinates**: Include accurate GPS coordinates for each location

## 🔧 Troubleshooting

### Common Issues:
- **Import failures**: Check CSV format and required fields
- **Address validation**: Verify addresses are valid and recognized by Google Maps
- **Duplicate locations**: Check for existing locations before import
- **Permission errors**: Ensure you have proper GBP permissions

### Solutions:
1. Use the validation report to check data quality
2. Test with a single location first
3. Contact GBP support if needed

## 📞 Support

For technical support with the import process:
- Google Business Profile Help Center
- ZOE Solar Technical Team
- Use the validation report for debugging

---
*Generated: ${new Date().toISOString().split('T')[0]}*
*Files: ${files.length} CSV files ready for import*
`;
}

/**
 * Erstellt CSV Validierungsbericht
 */
function createValidationReport(locations, rows) {
    const report = {
        summary: {
            total_locations: locations.length,
            total_csv_rows: rows.length,
            validation_date: new Date().toISOString(),
            validation_status: 'completed'
        },
        data_quality: {
            addresses_with_complete_data: 0,
            locations_with_phone: 0,
            locations_with_website: 0,
            locations_with_coordinates: 0,
            locations_with_valid_descriptions: 0
        },
        phases: {},
        issues: [],
        recommendations: []
    };

    // Validiere Standortdaten
    locations.forEach(location => {
        // Phasen-Statistik
        if (!report.phases[location.phase]) {
            report.phases[location.phase] = 0;
        }
        report.phases[location.phase]++;

        // Datenqualitäts-Checks
        if (location.address && location.address.streetAddress && location.address.locality && location.address.postalCode) {
            report.data_quality.addresses_with_complete_data++;
        }

        if (location.phone) {
            report.data_quality.locations_with_phone++;
        }

        if (location.website) {
            report.data_quality.locations_with_website++;
        }

        if (location.coordinates && location.coordinates.latitude && location.coordinates.longitude) {
            report.data_quality.locations_with_coordinates++;
        }

        if (location.description && location.description.length > 50 && location.description.length <= 250) {
            report.data_quality.locations_with_valid_descriptions++;
        }
    });

    // Erstelle Empfehlungen
    if (report.data_quality.addresses_with_complete_data < locations.length) {
        report.recommendations.push('Some locations have incomplete address data');
    }

    if (report.data_quality.locations_with_coordinates < locations.length) {
        report.recommendations.push('Add GPS coordinates for better location accuracy');
    }

    return report;
}

/**
 * Hauptfunktion
 */
function main() {
    try {
        const optimizedFiles = createOptimizedCSV();

        console.log('\n' + '='.repeat(80));
        console.log('📊 ZOE SOLAR - GBP CSV OPTIMIZATION SUMMARY');
        console.log('='.repeat(80));

        console.log(`\n📈 OPTIMIZATION RESULTS:`);
        console.log(`   ✅ ${optimizedFiles.length} optimized CSV files created`);
        console.log(`   ✅ Enhanced GBP formatting applied`);
        console.log(`   ✅ Column headers optimized for bulk import`);
        console.log(`   ✅ Data validation completed`);
        console.log(`   ✅ Import instructions generated`);

        console.log(`\n📁 FILES CREATED:`);
        optimizedFiles.forEach(file => {
            const lines = file.data.split('\n').length;
            console.log(`   - ${file.filename} (${lines - 1} locations)`);
        });

        console.log(`\n🎯 NEXT STEPS:`);
        console.log(`   1. Review validation report: data/gbp-csv-validation-report.json`);
        console.log(`   2. Read import instructions: data/gbp-import-instructions.md`);
        console.log(`   3. Choose import method (bulk CSV or manual)`);
        console.log(`   4. Execute import in Google Business Profile Manager`);
        console.log(`   5. Verify imported locations`);

        console.log('\n' + '='.repeat(80));
        console.log('🏁 CSV Optimization completed successfully');

    } catch (error) {
        console.error('❌ Error during CSV optimization:', error.message);
        process.exit(1);
    }
}

// Skript ausführen
if (require.main === module) {
    main();
}

module.exports = {
    createOptimizedCSV,
    createImportInstructions,
    createValidationReport
};
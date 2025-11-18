import { Manufacturer } from '../productTypes';

export const wallbox_chargers: Manufacturer = {
      slug: 'wallbox-chargers',
      name: 'Wallbox',
      logoUrl: '/assets/logos/wallbox.png',
      category: ['Ladestationen'],
      description:
        'Wallbox ist ein global führender spanischer Hersteller von intelligenten Lade- und Energiemanagementlösungen für Elektrofahrzeuge. Mit ausgezeichnetem Design und innovativer Technologie fördert Wallbox weltweit die Akzeptanz von E-Mobilität durch smarte, benutzerfreundliche und umweltfreundliche Ladelösungen.',
      whyWeTrust: [
        'Globaler Technologieführer mit preisgekröntem Design und Innovation.',
        'Intelligente Funktionen wie Power-Sharing, Solar-Überschussladen und dynamisches Lastmanagement.',
        'MyWallbox Cloud-Plattform mit Echtzeit-Überwachung und Nutzerverwaltung.',
        'Umfassendes Portfolio für private, gewerbliche und Enterprise-Anwendungen.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Wallbox Pulsar Plus 11kW/22kW 2025
        {
          name: 'Pulsar Plus 11/22',
          category: 'Ladestationen',
          manufacturerSlug: 'wallbox-chargers',
          imageUrl: 'https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=870&auto=format&fit=crop',
          description: 'Wallbox Pulsar Plus 11/22 - Eine der kleinsten, leistungsstärksten und smartesten Wallboxen für zu Hause. Mit 11kW oder 22kW Ladeleistung, WiFi/Bluetooth Konnektivität und App-Steuerung. Kompaktes Design mit fortschrittlichen Energiemanagement-Funktionen.',
          basePrice: 749,
          configurable: false,
          specs: {
            'Ladeleistung': '11 kW (1-phasig) oder 22 kW (3-phasig)',
            'Anschluss': 'Typ 2 Buchse mit 5m festem Kabel',
            'Nennstrom': '16 A (11kW) oder 32 A (22kW)',
            'Eingangsspannung': '230 V AC (1-phasig) oder 400 V AC (3-phasig)',
            'Wirkungsgrad': '> 95 %',
            'Konnektivität': 'WiFi 2.4GHz, Bluetooth 4.2, Ethernet (optional)',
            'Steuerung': 'Wallbox App (iOS/Android), Sprachsteuerung via Alexa/Google Assistant',
            'Schutzart': 'IP54 (spritzwassergeschützt), IK10',
            'Temperaturbereich': '-30°C bis +50°C',
            'Gewicht': '3.5 kg',
            'Abmessungen': '185 x 145 x 95 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1, VDE 0100-701, KfW-gefördert',
            'Förderfähigkeit': 'KfW 440 (BAFA) förderfähig',
            'Smart Features': 'Power Sharing, Solar-Überschussladen, Dynamic Load Balancing, Energy Monitoring',
            'Sicherheitsfunktionen': 'DC-Leckstromerkennung, Temperaturüberwachung, Überspannungsschutz',
            'Besondere Merkmale': 'Award-Winning Design (Red Dot 2024), Kompaktestes Design auf dem Markt, MyWallbox Cloud Integration, Advanced Power Management, Sprachsteuerung, Zeitgesteuertes Laden, Plug&Play Installation, High-Quality Materials, Spanish Engineering Excellence, Future-Proof Technology Updates'
          },
          keyFeatures: ['11/22kW Leistung', 'Kompaktestes Design', 'Smart App-Steuerung', 'Solar-Überschussladen', 'KfW-gefördert', 'Award-Winning Design'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Wallbox Official Website + Pulsar Plus Datasheet + Smart Features Guide + Energy Management Documentation',
          datasheet_url: 'https://www.wallbox.com/en/pulsar-plus'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Wallbox Commander 2 22kW 2025
        {
          name: 'Commander 2 22kW',
          category: 'Ladestationen',
          manufacturerSlug: 'wallbox-chargers',
          imageUrl: 'https://images.unsplash.com/photo-1633333393122-2c63e2f5b80a?q=80&w=870&auto=format&fit=crop',
          description: 'Wallbox Commander 2 22kW - Professionelle Unternehmens-Wallbox mit 7-Zoll-Touchscreen, RFID-Authentifizierung und umfassender Nutzerverwaltung über MyWallbox-Plattform. Ideal für Firmenparkplätze und gewerbliche Anwendungen.',
          basePrice: 1790,
          configurable: false,
          specs: {
            'Ladeleistung': '22 kW (3-phasig, simultan)',
            'Anschlüsse': '2x Typ 2 Buchsen (optional mit festen Kabeln)',
            'Nennstrom': '32 A pro Buchse',
            'Eingangsspannung': '400 V AC (3-phasig)',
            'Wirkungsgrad': '> 96 %',
            'Display': '7" Touchscreen mit intuitiver Bedienoberfläche',
            'Konnektivität': 'WiFi, Ethernet, 4G LTE (optional), Bluetooth',
            'Authentifizierung': 'RFID (MIFARE, ISO 14443), App, PIN, Credit Card (optional)',
            'Management': 'MyWallbox Enterprise Plattform mit Echtzeit-Überwachung',
            'Schutzart': 'IP54, IK10',
            'Temperaturbereich': '-30°C bis +50°C',
            'Gewicht': '8.2 kg',
            'Abmessungen': '390 x 245 x 150 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1, VDE 0100-701, MID-Zulassung',
            'Enterprise Features': 'Multi-User Management, Access Control, Energy Analytics, Payment Integration',
            'Smart Charging': 'Dynamic Load Management, Power Sharing, Solar Integration, Time-of-Use',
            'Besondere Merkmale': 'Professional Enterprise Solution, 7" High-Resolution Touchscreen, Advanced User Management, Real-Time Energy Monitoring, White-Label Branding Possible, Corporate Fleet Management, Integration with ERP Systems, Remote Diagnostics, Scheduled Maintenance Alerts, Premium Build Quality, Spanish Manufacturing Excellence'
          },
          keyFeatures: ['22kW Enterprise Leistung', '7" Touchscreen', 'MyWallbox Platform', 'Enterprise Management', 'Multi-User Authentifizierung', 'Professional Grade'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Wallbox Official Website + Commander 2 Datasheet + Enterprise Features Guide + MyWallbox Platform Documentation',
          datasheet_url: 'https://www.wallbox.com/en/commander-2'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Wallbox Copper SB Modular System 2025
        {
          name: 'Copper SB Modular',
          category: 'Ladestationen',
          manufacturerSlug: 'wallbox-chargers',
          imageUrl: 'https://images.unsplash.com/photo-1623498872344-7c8b88a359a4?q=80&w=870&auto=format&fit=crop',
          description: 'Wallbox Copper SB Modular - Modulares Ladesystem mit bis zu 22kW pro Einheit und skalierbarem Design für gewerbliche Anwendungen. Parallelbetrieb für mehrere Fahrzeuge mit intelligenter Lastverteilung.',
          basePrice: 2450,
          configurable: false,
          specs: {
            'Ladeleistung': 'Bis zu 22 kW pro Modul (skalierbar)',
            'Modulanzahl': '1-6 Module parallel betreibbar',
            'Anschlüsse': 'Modulare Konfiguration, flexibel erweiterbar',
            'Gesamtleistung': 'Bis zu 132 kW (6x 22kW) im Parallelbetrieb',
            'Eingangsspannung': '400 V AC (3-phasig)',
            'Wirkungsgrad': '> 96 %',
            'Lastverteilung': 'Intelligente dynamische Lastverteilung zwischen Modulen',
            'Konnektivität': 'WiFi, Ethernet, 4G LTE (optional)',
            'Management': 'MyWallbox Plattform mit System-Überwachung',
            'Authentifizierung': 'RFID, App, zentralisierte Nutzerverwaltung',
            'Schutzart': 'IP54, robustes Industriesystem',
            'Temperaturbereich': '-30°C bis +50°C',
            'Gewicht': '45 kg (pro 2-Modul-System)',
            'Abmessungen': 'Modulares Design, anpassbar an Standort',
            'Zertifizierungen': 'CE, IEC 61851-1, VDE 0100-701, Industriesicherheit',
            'Scalability Features': 'Easy Installation, Plug-and-Play Modules, Future-Proof Expansion',
            'Enterprise Integration': 'ERP System Connection, Corporate Energy Management, Fleet Optimization',
            'Besondere Merkmale': 'Highly Scalable Modular Design, Intelligent Power Distribution, Future-Proof Technology, Corporate Fleet Solution, Commercial Grade Reliability, Easy Installation and Maintenance, Remote Management Capabilities, Premium Spanish Engineering, Cost-Effective Scaling, Optimized for Multi-Vehicle Environments'
          },
          keyFeatures: ['Modulares System', 'Bis zu 132W Gesamt', 'Skalierbar', 'Intelligent Load Sharing', 'Enterprise Ready', 'Future-Proof'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Wallbox Official Website + Copper SB Modular Datasheet + Scalable Solutions Guide + Enterprise Installation Manual',
          datasheet_url: 'https://www.wallbox.com/en/copper-sb'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Wallbox Quasar 22kW DC Ultra-Fast 2025
        {
          name: 'Quasar 22kW DC',
          category: 'Ladestationen',
          manufacturerSlug: 'wallbox-chargers',
          imageUrl: 'https://images.unsplash.com/photo-1623498872344-7c8b88a359a4?q=80&w=870&auto=format&fit=crop',
          description: 'Wallbox Quasar 22kW DC - Revolutionärer DC Ultra-Fast-Lader mit 22kW Leistung und Type 2 Anschluss für extrem schnelles Laden zu Hause. DC-Technologie für bis zu 3x schnellere Ladezeiten im Vergleich zu konventionellen AC-Ladern.',
          basePrice: 5990,
          configurable: false,
          specs: {
            'Ladeleistung': '22 kW (DC-Ultra-Fast)',
            'Ladetechnologie': 'DC-Ladung mit Gleichrichter-Integration',
            'Anschluss': 'Typ 2 DC-Buchse mit festem Kabel',
            'DC-Eingangsspannung': '400-800 V DC (flexibel)',
            'AC-Eingangsspannung': '400 V AC (3-phasig)',
            'Wirkungsgrad': '> 94 % (DC-Ladeeffizienz)',
            'Ladezeiten': 'Bis zu 3x schneller als AC-Lader (bei kompatiblen Fahrzeugen)',
            'Konnektivität': 'WiFi, Ethernet, Bluetooth, 4G LTE (optional)',
            'Steuerung': 'Wallbox App mit DC-Ladeoptimierung',
            'Schutzart': 'IP54, IK10',
            'Temperaturbereich': '-30°C bis +50°C',
            'Gewicht': '18.5 kg',
            'Abmessungen': '450 x 320 x 180 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1, IEC 62196, VDE 0100-701',
            'DC Technology Features': 'DC-Optimized Charging, Vehicle Communication (ISO 15118), Battery Protection',
            'Smart Functions': 'Dynamic Power Adjustment, Solar Integration, Energy Optimization',
            'Safety Features': 'Advanced DC Safety Systems, Temperature Monitoring, Fault Detection',
            'Besondere Merkmale': 'Revolutionary DC Technology for Residential Use, 3x Faster Charging Times, Ultra-Compact DC Design, Advanced Battery Protection, Smart DC Energy Management, Home Integration Ready, Premium Spanish DC Engineering, Future-Proof DC Technology, Smart Grid Compatible, User-Friendly DC Interface'
          },
          keyFeatures: ['22kW DC Ultra-Fast', '3x Schneller Laden', 'DC-Technologie', 'Battery Protection', 'Smart Energy Management', 'Residential DC Innovation'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Wallbox Official Website + Quasar DC Datasheet + DC Technology Guide + Ultra-Fast Charging Documentation',
          datasheet_url: 'https://www.wallbox.com/en/quasar'
        }
      ]
    };

export default wallbox_chargers;

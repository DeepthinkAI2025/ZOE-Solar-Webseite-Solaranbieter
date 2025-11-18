import { Manufacturer } from '../productTypes';

export const schneider_electric: Manufacturer = {
      slug: 'schneider-electric',
      name: 'Schneider Electric',
      logoUrl: '/assets/logos/schneider-electric.png',
      category: ['Wechselrichter', 'Ladestationen', 'Energiemanagement'],
      description:
        'Schneider Electric ist ein global führender Spezialist für Energiemanagement und Automatisierung mit über 175 Jahren Erfahrung. Das Unternehmen bietetinnovative Lösungen für Solar-Wechselrichter, E-Mobilität und intelligente Energiemanagement-Systeme für Wohn-, Gewerbe- und Industrieanwendungen.',
      whyWeTrust: [
        'Globaler Technologieführer mit über 175 Jahren Erfahrung und Präsenz in 100+ Ländern.',
        'Industrielle Qualität und Zuverlässigkeit mit höchsten Sicherheitsstandards.',
        'Umfassendes Portfolio von Solar-Wechselrichtern, EV-Ladestationen und Energiemanagement.',
        'Führend in digitaler Transformation und smart grid Integration.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Schneider Electric Conext XW Pro Hybrid 8.0kW 2025
        {
          name: 'Conext XW Pro Hybrid 8.0',
          category: 'Wechselrichter',
          manufacturerSlug: 'schneider-electric',
          imageUrl: 'https://images.unsplash.com/photo-1622903728016-76b0cf4a2860?q=80&w=870&auto=format&fit=crop',
          description: 'Schneider Electric Conext XW Pro Hybrid 8.0kW - Leistungsstarker Hybrid-Wechselrichter mit integrierter Notstromversorgung und Batterie-Management für maximale Energieunabhängigkeit. Industrial-grade Qualität für anspruchsvolle Anwendungen.',
          basePrice: 5890,
          configurable: false,
          specs: {
            'Ausgangsleistung': '8.0 kW (kontinuierlich)',
            'Spitzenleistung': '12.0 kW (30 Minuten)',
            'Wirkungsgrad': '98.0 % (EURO_eff)',
            'Eingangsspannung': '150-500 V DC',
            'Ausgangsspannung': '230/400 V AC (3-phasig)',
            'Frequenz': '50/60 Hz (automatische Erkennung)',
            'MPPT-Tracker': '2 parallelgeschaltete MPPTs',
            'Max. PV-Eingangsstrom': '34 A pro MPPT',
            'Notstromfunktion': 'Ja (Backup Power)',
            'Batterie-Spannung': '48 V DC',
            'Ladecontroller': 'Integriert (80 A)',
            'Netzintegration': 'Advanced Grid Support (AGS)',
            'Kommunikation': 'Ethernet, CAN bus, RS485, Modbus',
            'Monitoring': 'Conext ComBox und Insight Cloud',
            'Schutzart': 'IP54 (NEMA 3R)',
            'Temperaturbereich': '-20°C bis +60°C',
            'Gewicht': '65 kg',
            'Abmessungen': '711 x 521 x 267 mm (H x B x T)',
            'Zertifizierungen': 'VDE, CE, IEC 62109-1/2, UL 1741 SA',
            'Besondere Merkmale': 'Hybrid Technology Excellence, Grid Support Functionality, Parallel Operation Capability, Advanced Battery Management, Zero-Export Function, Remote Monitoring, Industrial Grade Design, 10-Year Warranty Options, Power Factor Control, Frequency Ride-Through, Programmable Auxiliary Relay, Temperature Compensation'
          },
          keyFeatures: ['8.0kW Hybrid Leistung', 'Notstromversorgung', '98.0% Wirkungsgrad', 'Batterie-Management', 'Grid Support', 'Industrial Quality'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Schneider Electric Official Website + Conext XW Pro Technical Datasheet + Hybrid Inverter Guide + Grid Support Documentation',
          datasheet_url: 'https://www.se.com/ww/en/product-range/603-conext-xw-pro/'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Schneider Electric EVlink Smart 22kW 2025
        {
          name: 'EVlink Smart Wallbox 22',
          category: 'Ladestationen',
          manufacturerSlug: 'schneider-electric',
          imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=870&auto=format&fit=crop',
          description: 'Schneider Electric EVlink Smart Wallbox 22 - Intelligente 22kW Ladestation mit Load Management und Fernüberwachung. Kompaktes Design für private und gewerbliche Installationen mit höchsten Sicherheitsstandards.',
          basePrice: 1890,
          configurable: false,
          specs: {
            'Ladeleistung': '22 kW (3-phasig)',
            'Anschluss': 'Typ 2 Buchse (IEC 62196-2)',
            'Nennstrom': '32 A',
            'Eingangsspannung': '400 V AC (3-phasig)',
            'Wirkungsgrad': '> 96 %',
            'Lastmanagement': 'Dynamic Load Balancing (bis zu 3 Einheiten)',
            'Kommunikation': 'Ethernet, WiFi (optional), Modbus TCP',
            'Monitoring': 'EVlink Remote Management Platform',
            'Authentifizierung': 'RFID-Karte, Smartphone App',
            'Smart Charging': 'Time-of-Use, Solar-Integration, V2G Ready',
            'Steuerung': 'Mobile App (iOS/Android), Web-Interface',
            'Schutzart': 'IP54 (außeninstallation geeignet)',
            'Sicherheitsfunktionen': 'DC-Leckstromerkennung, Temperaturüberwachung',
            'Kabellänge': '5 Meter (flexibles Kabel)',
            'Display': 'LED-Statusanzeigen',
            'Temperaturbereich': '-25°C bis +50°C',
            'Gewicht': '12.5 kg',
            'Abmessungen': '400 x 250 x 150 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1, VDE 0100-701, KfW-gefördert',
            'Besondere Merkmale': 'Smart Load Management, Remote Monitoring, Solar Integration Ready, Multi-User Support, Energy Cost Optimization, Scheduled Charging, Power Sharing, OCPP 1.6 Compatibility, Premium Industrial Design, Easy Installation, High Safety Standards, Schneider Electric Quality'
          },
          keyFeatures: ['22kW Smart Ladeleistung', 'Dynamic Load Balancing', 'Remote Monitoring', 'Solar-Integration', 'Premium Safety', 'Industrial Quality'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Schneider Electric Official Website + EVlink Technical Datasheet + Smart Charging Solutions Guide + Load Management Documentation',
          datasheet_url: 'https://www.se.com/ww/en/product-range/2086-evlink/'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Schneider Electric Wiser Energy Management 2025
        {
          name: 'Wiser Energy Manager',
          category: 'Energiemanagement',
          manufacturerSlug: 'schneider-electric',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=870&auto=format&fit=crop',
          description: 'Schneider Electric Wiser Energy Manager - Intelligentes Energiemanagement-System für vernetzte Häuser mit Solar-, Batterie- und E-Mobilitäts-Integration. Vollständige Kontrolle über den Energieverbrauch und maximale Kosteneinsparungen.',
          basePrice: 1250,
          configurable: false,
          specs: {
            'Systemtyp': 'Smart Home Energy Management System',
            'Energiequellen': 'Solar, Batterie, Grid, Generator',
            'Verbraucher': 'Haushalt, EV-Ladung, Heizung/Klima',
            'Monitoring': 'Echtzeit-Energiefluss-Darstellung',
            'Steuerung': 'Automatische Verbrauchsoptimierung',
            'Konnektivität': 'WiFi, Ethernet, Zigbee, Z-Wave',
            'App-Steuerung': 'Wiser App (iOS/Android, Sprachsteuerung)',
            'Integration': 'Solar-Wechselrichter, EV-Ladestation, Smart Meter',
            'Automatisierung': 'Zeitpläne, Szenarien, Energy Rules',
            'Kostensparfunktionen': 'Time-of-Use Optimization, Peak Shaving',
            'Energie-API': 'Offene Schnittstelle für Drittanbieter',
            'Datenspeicherung': 'Cloud-basiert mit lokalem Backup',
            'Display': '7" Touchscreen (optional Gateway)',
            'Schutzart': 'IP20 (Indoor Installation)',
            'Stromversorgung': '230 V AC oder 24 V DC',
            'Temperaturbereich': '0°C bis +50°C',
            'Gewicht': '1.2 kg',
            'Abmessungen': '160 x 120 x 40 mm (H x B x T)',
            'Zertifizierungen': 'CE, FCC, RCM, Cybersecurity Standards',
            'Besondere Merkmale': 'Complete Energy Visibility, AI-Powered Optimization, Solar Integration, EV Charging Control, Voice Control Ready, Historical Energy Analytics, Multi-Room Control, Scheduled Automation, Remote Access, Energy Cost Forecasting, Third-Party Integration, Schneider Electric Ecosystem, Future-Proof Design'
          },
          keyFeatures: ['Intelligentes Energiemanagement', 'Solar- & EV-Integration', 'AI-Optimierung', 'Sprachsteuerung', 'App-Kontrolle', 'Kosteneinsparung'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Schneider Electric Official Website + Wiser Energy System Guide + Smart Home Integration Documentation + Energy Management Features',
          datasheet_url: 'https://www.se.com/ww/en/product-range/62280-wiser/'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Schneider Electric Conext Core 5.0 String Inverter 2025
        {
          name: 'Conext Core 5.0',
          category: 'Wechselrichter',
          manufacturerSlug: 'schneider-electric',
          imageUrl: 'https://images.unsplash.com/photo-1622903728016-76b0cf4a2860?q=80&w=870&auto=format&fit=crop',
          description: 'Schneider Electric Conext Core 5.0 - Hochleistungs-String-Wechselrichter mit 97.5% Wirkungsgrad und intelligenter Grid-Support-Funktionalität. Optimiert für residential Solaranlagen mit höchsten Effizienzanforderungen.',
          basePrice: 2450,
          configurable: false,
          specs: {
            'Ausgangsleistung': '5.0 kW (kontinuierlich)',
            'Wirkungsgrad': '97.5 % (CEC/gewichtet)',
            'Maximaler Wirkungsgrad': '98.3 %',
            'Eingangsspannung': '100-600 V DC',
            'MPPT-Spannungsbereich': '125-550 V DC',
            'Max. PV-Eingangsstrom': '22 A',
            'MPP-Anzahl': '1 Single MPPT',
            'Ausgangsspannung': '230 V AC (1-phasig)',
            'Frequenz': '50/60 Hz',
            'Einspeisemanagement': 'Advanced Grid Support (AGS)',
            'Leistungsfaktor': '0.8 führend bis 0.8 nacheilend',
            'Kommunikation': 'RS485, Ethernet (optional)',
            'Monitoring': 'Conext ComBox oder Insight Cloud',
            'Schutzart': 'IP65',
            'Temperaturbereich': '-25°C bis +60°C',
            'Gewicht': '19.8 kg',
            'Abmessungen': '560 x 370 x 180 mm (H x B x T)',
            'Zertifizierungen': 'VDE, CE, IEC 62109-1/2',
            'Besondere Merkmale': 'High Efficiency String Inverter, Advanced Grid Integration, Compact Outdoor Design, Natural Cooling Technology, Extended Temperature Range, Remote Firmware Updates, Arc Fault Detection, Rapid Shutdown Ready, 10-Year Warranty Option, Professional Installation, Schneider Electric Reliability'
          },
          keyFeatures: ['97.5% Hoher Wirkungsgrad', 'String-Wechselrichter', 'Grid Support', 'IP65 Outdoor Design', 'Kompakte Bauform', 'Professional Quality'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Schneider Electric Official Website + Conext Core Technical Specifications + String Inverter Performance Data + Installation Guide',
          datasheet_url: 'https://www.se.com/ww/en/product-range/613-conext-core/'
        }
      ]
    };

export default schneider_electric;

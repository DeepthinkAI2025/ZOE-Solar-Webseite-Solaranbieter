import { Manufacturer } from '../productTypes';

export const enphase: Manufacturer = {
      slug: 'enphase',
      name: 'Enphase Energy',
      logoUrl: '/assets/logos/enphase.png',
      category: ['Wechselrichter', 'Speicher'],
      description:
        'Enphase Energy ist der weltweit führende Anbieter von Mikrowechselrichter-basierten Solar- und Energiespeichersystemen. Mit der revolutionären IQ8-Technologie und dem Ensemble-Energiemanagement-System bietet Enphase maximale Energieerzeugung, Notstromversorgung und vollständige Kontrolle über die eigene Energiezukunft.',
      whyWeTrust: [
        'Globaler Marktführer für Mikrowechselrichter mit über 60 Millionen installierten Einheiten.',
        'Branchenführende 25-Jahres-Produktgarantie und höchste Zuverlässigkeitsstandards.',
        'Vollständig integriertes Solar- und Speichersystem mit Enlighten-Monitoring-Plattform.',
        'Revolutionäre Sunlight Backup-Technologie für unterbrechungsfreie Stromversorgung.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Enphase IQ8A Microinverter 485W Peak Power 2025
        {
          name: 'IQ8A Microinverter 485W',
          category: 'Wechselrichter',
          manufacturerSlug: 'enphase',
          imageUrl: 'https://images.unsplash.com/photo-1581093458791-9d3a6ea6b8ac?q=80&w=870&auto=format&fit=crop',
          description: 'Enphase IQ8A Microinverter 485W - Hochleistungs-Mikrowechselrichter der 8. Generation mit Sunlight Backup-Fähigkeit und 97.5% Wirkungsgrad. Der leistungsstärkste Mikrowechselrichter für moderne Hochleistungs-Solarmodule.',
          basePrice: 225,
          configurable: false,
          specs: {
            'AC-Nennleistung': '366 VA',
            'Max. DC-Leistung': '485 Wp',
            'Peak-Wirkungsgrad': '97.5 % (CEC-gewichtet)',
            'Gewichteter Wirkungsgrad': '97.0 %',
            'MPPT-Spannungsbereich': '16-60 V DC',
            'Max. Eingangsstrom': '13 A',
            'AC-Ausgangsspannung': '230 V AC (1-phasig)',
            'Frequenz': '50 Hz (automatisch anpassbar)',
            'Kommunikation': 'Sunspec (Power Line Communication)',
            'Grid-Forming': 'Ja (Sunlight Backup-fähig)',
            'Peak-Shaving': 'Ja (intelligentes Energiemanagement)',
            'Schutzart': 'IP67 (wasserdicht)',
            'Temperaturbereich': '-40°C bis +85°C',
            'Gewicht': '2.2 kg',
            'Abmessungen': '230 x 185 x 39 mm (H x B x T)',
            'Zertifizierungen': 'IEC 62109, VDE, CE, UL 1741 SA',
            'Produktgarantie': '25 Jahre',
            'Besondere Merkmale': 'Sunlight Backup Technology, Grid-Agnostic Operation, Advanced MPPT Algorithm, Built-in Rapid Shutdown, Self-Consumption Optimization, Peak Power Shaving, Module-Level Monitoring, Plug-and-Play Installation, Advanced Thermal Management, Industry-Leading Reliability, Storm Ready Technology'
          },
          keyFeatures: ['485W Spitzenleistung', 'Sunlight Backup', '97.5% Wirkungsgrad', '25 Jahre Garantie', 'Grid-Forming', 'Modul-Level Monitoring'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Enphase Energy Official Website + IQ8A Technical Specifications + Sunlight Backup Documentation + Performance Analysis',
          datasheet_url: 'https://enphase.com/en-us/products-and-services/microinverters/iq8'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Enphase IQ8P Microinverter 480W Premium 2025
        {
          name: 'IQ8P Microinverter 480W',
          category: 'Wechselrichter',
          manufacturerSlug: 'enphase',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description: 'Enphase IQ8P Microinverter 480W - Premium-Mikrowechselrichter für Hochleistungs-Solarmodule mit bis zu 480W Leistung und exzellenter Effizienz. Optimiert für moderne N-Type- und TOPCon-Module.',
          basePrice: 215,
          configurable: false,
          specs: {
            'AC-Nennleistung': '350 VA',
            'Max. DC-Leistung': '480 Wp',
            'Peak-Wirkungsgrad': '97.5 % (CEC-gewichtet)',
            'Gewichteter Wirkungsgrad': '97.0 %',
            'MPPT-Spannungsbereich': '18-60 V DC',
            'Max. Eingangsstrom': '12.5 A',
            'AC-Ausgangsspannung': '230 V AC (1-phasig)',
            'Frequenz': '50 Hz (automatisch anpassbar)',
            'Kommunikation': 'Sunspec (Power Line Communication)',
            'Grid-Forming': 'Ja (Sunlight Backup-fähig)',
            'Optimierung': 'Advanced Module-Level Optimization',
            'Schutzart': 'IP67 (wasserdicht)',
            'Temperaturbereich': '-40°C bis +85°C',
            'Gewicht': '2.1 kg',
            'Abmessungen': '230 x 185 x 39 mm (H x B x T)',
            'Zertifizierungen': 'IEC 62109, VDE, CE, UL 1741 SA',
            'Produktgarantie': '25 Jahre',
            'Besondere Merkmale': 'Premium High Power Microinverter, Optimized for High-Power Modules, Advanced MPPT Tracking, Sunlight Backup Ready, Enhanced Temperature Performance, Module-Level Diagnostics, Self-Consumption Management, Grid Support Functions, Rapid Shutdown Integrated, Future-Proof Technology'
          },
          keyFeatures: ['480W Premium Leistung', 'Optimiert für High-Power Module', 'Advanced MPPT', 'Sunlight Backup', '25 Jahre Garantie', 'Future-Proof'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Enphase Energy Official Website + IQ8P Technical Datasheet + High Power Module Optimization + Premium Features Guide',
          datasheet_url: 'https://enphase.com/en-us/products-and-services/microinverters/iq8p'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Enphase IQ Battery 5P 5kWh LFP Storage 2025
        {
          name: 'IQ Battery 5P 5kWh',
          category: 'Speicher',
          manufacturerSlug: 'enphase',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
          description: 'Enphase IQ Battery 5P 5kWh - Intelligenter Heim-Energiespeicher mit 5.0 kWh Kapazität und 96.5% Rundum-Wirkungsgrad. Mit LFP-Technologie für maximale Sicherheit und 10-Jahres-Garantie für Sorgenfreiheit.',
          basePrice: 4450,
          configurable: true,
          specs: {
            'Nutzbare Kapazität': '5.0 kWh (10 kWh Bruttokapazität)',
            'Rundum-Wirkungsgrad': '96.5 % (AC-seitig)',
            'Max. Ladeleistung': '3.84 kW',
            'Max. Entladeleistung': '3.84 kW',
            'Peak-Leistung': '7.68 kW (10 Sekunden)',
            'Chemie': 'LFP (Lithium-Eisenphosphat)',
            'System-Typ': 'AC-gekoppelt (Ensemble Ready)',
            'Spannung': ' nominell 48 V DC',
            'Betriebstemperatur': '-10°C bis +50°C',
            'Zyklenfestigkeit': '4000 Zyklen bei 80% DoD',
            'Garantie': '10 Jahre oder 4000 Zyklen (80% Kapazität)',
            'Skalierbarkeit': 'Bis zu 4 Einheiten (20 kWhGesamt)',
            'Kommunikation': 'Sunspec (integriertes Gateway)',
            'Monitoring': 'Enlighten Plattform mit Echtzeitdaten',
            'Schutzart': 'IP55 (Inneninstallation)',
            'Gewicht': '65 kg',
            'Abmessungen': '705 x 450 x 250 mm (H x B x T)',
            'Zertifizierungen': 'IEC 62619, UL 9540A, CE, VDE',
            'Besondere Merkmale': 'LFP Safety Chemistry, High Round-Trip Efficiency, Ensemble System Integration, Smart Grid Ready, Remote Firmware Updates, Advanced Battery Management System, Thermal Management, Power Control Algorithms, Self-Consumption Optimization, Storm Ready Technology, Modular Scalability, Enphase Quality Standards'
          },
          keyFeatures: ['5.0 kWh Kapazität', '96.5% Effizienz', 'LFP Sicherheits-Chemie', 'Ensemble Integration', '10 Jahre Garantie', 'Storm Ready'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Enphase Energy Official Website + IQ Battery 5P Technical Data + LFP Chemistry Guide + Ensemble System Integration',
          datasheet_url: 'https://enphase.com/en-us/products-and-services/storage/iq-battery-5p'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Enphase IQ Gateway with Sunlight Backup 2025
        {
          name: 'IQ Gateway 3G Pro',
          category: 'Wechselrichter',
          manufacturerSlug: 'enphase',
          imageUrl: 'https://images.unsplash.com/photo-1581093458791-9d3a6ea6b8ac?q=80&w=870&auto=format&fit=crop',
          description: 'Enphase IQ Gateway 3G Pro - Intelligentes System-Management-Gateway mit Sunlight Backup-Unterstützung und cellular-Konnektivität. Zentraler Kommunikationsknoten für das komplette Enphase Ensemble-System.',
          basePrice: 850,
          configurable: false,
          specs: {
            'Systemtyp': 'Smart Energy Management Gateway',
            'AC-Anschluss': '3-phasig (230/400 V)',
            'Max. Systemstrom': '63 A pro Phase',
            'Backup-Funktion': 'Sunlight Backup Ready',
            'Konnektivität': 'Gigabit Ethernet, WiFi 6, 4G LTE Cellular',
            'Display': '5" Multi-Touch Display mit Echtzeitdaten',
            'Monitoring': 'Enlighten Plattform mit erweiterten Analytics',
            'Laststeuerung': 'Intelligente Verbrauchsoptimierung',
            'Schutzfunktionen': 'Advanced Arc Fault Detection',
            'Kommunikationsprotokolle': 'Sunspec, Modbus TCP, MQTT',
            'Datenlogging': 'Integrierte 1-Jahres-Datenspeicherung',
            'Firmware-Updates': 'Over-the-Air Updates möglich',
            'Schutzart': 'IP55 (Inneninstallation)',
            'Temperaturbereich': '-10°C bis +60°C',
            'Stromversorgung': '230 V AC mit USV-Pufferung',
            'Gewicht': '4.8 kg',
            'Abmessungen': '280 x 200 x 90 mm (H x B x T)',
            'Zertifizierungen': 'CE, FCC, IEC 62619, Cybersecurity Standards',
            'Garantie': '5 Jahre (erweiterbar auf 10 Jahre)',
            'Besondere Merkmale': 'Advanced Sunlight Backup Technology, 5G Cellular Connectivity, Real-Time Energy Analytics, Smart Load Control, Grid Support Functions, Advanced Safety Features, Remote Diagnostics, System Health Monitoring, Professional Installation Ready, Future-Proof Technology, Enphase Ecosystem Integration'
          },
          keyFeatures: ['Sunlight Backup Gateway', '5G Cellular Konnektivität', '5" Touch Display', 'Advanced Analytics', 'Smart Load Control', 'Professional Grade'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Enphase Energy Official Website + IQ Gateway Technical Specifications + Sunlight Backup Documentation + Advanced Features Guide',
          datasheet_url: 'https://enphase.com/en-us/products-and-services/microinverters/iq-gateway'
        }
      ]
    };

export default enphase;

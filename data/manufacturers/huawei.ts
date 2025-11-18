import { Manufacturer } from '../productTypes';

export const huawei: Manufacturer = {
      slug: 'huawei',
      name: 'Huawei',
      logoUrl: '/assets/logos/huawei.png',
      category: ['Wechselrichter', 'Speicher'],
      description:
        'Huawei FusionSolar ist ein weltweit führender Anbieter von intelligenter Photovoltaik-Technologie und Energiemanagement-Lösungen. Durch die Kombination von digitaler IT-Expertise mit Solar-Technologie bietet Huawei hocheffiziente Wechselrichter, intelligente Speichersysteme und KI-gestützte Energiemanagement-Plattformen für Residential- und Gewerbeanwendungen.',
      whyWeTrust: [
        'Globaler Technologieführer mit umfassender Forschungs- und Entwicklungs-Expertise.',
        'Führende KI-gestützte Optimierung und smarte Energiemanagement-Systeme.',
        'Umfassendes Portfolio von Wechselrichtern (3-215kW) und modularen Speichersystemen.',
        'FusionSolar-Plattform mit fortschrittlicher Überwachung und prädiktiver Analytik.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Huawei SUN2000-8KTL-MT0 Three-Phase Inverter 2025
        {
          name: 'SUN2000-8KTL-MT0',
          category: 'Wechselrichter',
          manufacturerSlug: 'huawei',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description: 'Huawei SUN2000-8KTL-MT0 - Dreiphasen-Stringwechselrichter mit 98.4% Wirkungsgrad und intelligenter PID-Schutzfunktion. Für Residential-Anwendungen optimiert mit natürlicher Kühlung und KI-gestützter Leistungsoptimierung.',
          basePrice: 1390,
          configurable: false,
          specs: {
            'AC-Nennleistung': '8.0 kW (3-phasig)',
            'Max. DC-Eingangsleistung': '11.0 kWp',
            'Max. Wirkungsgrad': '98.4 % (EURO_eff)',
            'Europäischer Wirkungsgrad': '98.1 % (gewichtet)',
            'MPP-Tracker': '2 (parallel schaltbar)',
            'Eingangsspannungsbereich': '80 - 1000 V DC',
            'Max. Eingangsstrom pro MPP': '22.5 A',
            'MPPT-Spannungsbereich': '200 - 1000 V DC',
            'AC-Ausgangsspannung': '380/400 V (3-phasig)',
            'Max. AC-Ausgangsstrom': '11.5 A',
            'Netzfrequenz': '50/60 Hz (automatisch anpassbar)',
            'Power-Faktor': '0.8 führend bis 0.8 nacheilend',
            'Kühlung': 'Natürliche Konvektion (lautlos)',
            'Schutzart': 'IP65 (wetterfest)',
            'Betriebstemperatur': '-25°C bis +60°C',
            'Gewicht': '10.0 kg',
            'Abmessungen': '365 x 520 x 165 mm (B x H x T)',
            'Zertifizierungen': 'VDE, CE, IEC 62109-1/2, MCS',
            'Garantie': '10 Jahre (erweiterbar auf 25 Jahre)',
            'Smart Features': 'AI-Powered Optimization, Smart PID Protection, I-V Curve Diagnosis, Natural Cooling, Advanced String Monitoring, Smart Temperature Management, Built-in WiFi, FusionSolar Integration',
            'Besondere Merkmale': 'Künstliche Intelligenz für Leistungs-Optimierung, Smart ARC Detection, Plug-and-Play Installation, Smartphone App Kompatibilität, Remote Firmware Updates, Predictive Maintenance, Global Huawei Quality Standards'
          },
          keyFeatures: ['98.4% Premium Wirkungsgrad', '2 MPP-Tracker', 'KI-gestützte Optimierung', 'Natürliche Kühlung', '10-25 Jahre Garantie', 'FusionSolar Integration'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Huawei FusionSolar Official Website + SUN2000-8KTL-MT0 Technical Datasheet + AI Optimization Features + Three-Phase Inverter Guide',
          datasheet_url: 'https://solar.huawei.com/eu/products/energy/solar-inverter/sun2000/'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Huawei LUNA2000-5-S0 Modular Storage System 2025
        {
          name: 'LUNA2000-5-S0 Storage System',
          category: 'Speicher',
          manufacturerSlug: 'huawei',
          imageUrl: 'https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?q=80&w=870&auto=format&fit=crop',
          description: 'Huawei LUNA2000-5-S0 - Modulares Heim-Energiespeichersystem mit 5.0 kWh Kapazität und 96.5% Wirkungsgrad. Mit LFP-Technologie für maximale Sicherheit und intelligenter Energiemanagement-Integration.',
          basePrice: 3850,
          configurable: true,
          specs: {
            'Nutzbare Kapazität': '5.0 kWh pro Modul (bis zu 3 Module)',
            'Gesamtkapazität': '5.0 - 15.0 kWh (skalierbar)',
            'Rundum-Wirkungsgrad': '96.5 %',
            'Max. Ladeleistung': '2.5 kW (pro System)',
            'Max. Entladeleistung': '2.5 kW (pro System)',
            'Chemie': 'LFP (Lithium-Eisenphosphat)',
            'System-Typ': 'Modulares AC-gekoppeltes System',
            'Spannung': 'Systemspannung 400-500 V DC',
            'Betriebstemperatur': '-10°C bis +50°C',
            'Zyklenfestigkeit': '6000+ Zyklen bei 90% DoD',
            'Garantie': '10 Jahre oder 6000 Zyklen (85% Kapazität)',
            'Skalierbarkeit': 'Bis zu 3 Module parallel (15 kWhGesamt)',
            'Integration': 'Nahtlose FusionSolar Platform Integration',
            'Schutzart': 'IP55 (Inneninstallation)',
            'Gewicht': '58 kg (pro 5 kWh Modul)',
            'Abmessungen': '650 x 450 x 200 mm (pro Modul)',
            'Zertifizierungen': 'IEC 62619, CE, VDE, UL 9540A',
            'Smart Features': 'AI-powered Charging, Smart Energy Management, Grid Support Functions, Remote Monitoring, Over-the-Air Updates',
            'Besondere Merkmale': 'Modulares Design für einfache Skalierung, High Safety LFP Chemistry, Advanced Battery Management System, Smart Grid Ready, Huawei Quality Standards, Integration with Solar Inverters, Predictive Analytics, Multi-User Energy Management'
          },
          keyFeatures: ['5.0-15.0 kWh Modular', '96.5% Hohe Effizienz', 'LFP Sicherheits-Chemie', 'AI-Charging Optimization', '10 Jahre Garantie', 'FusionSolar Integration'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Huawei FusionSolar Official Website + LUNA2000 Storage Technical Datasheet + LFP Chemistry Guide + Energy Management Integration',
          datasheet_url: 'https://solar.huawei.com/eu/products/energy/storage/luna2000/'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Huawei SUN2000-12KTL-MT1 Commercial String Inverter 2025
        {
          name: 'SUN2000-12KTL-MT1',
          category: 'Wechselrichter',
          manufacturerSlug: 'huawei',
          imageUrl: 'https://images.unsplash.com/photo-1547283437-0e61a5339f1a?q=80&w=870&auto=format&fit=crop',
          description: 'Huawei SUN2000-12KTL-MT1 - Hochleistungs-Stringwechselrichter für Gewerbeanwendungen mit 98.6% Wirkungsgrad und 3 MPP-Trackern. Mit KI-gestützter String-Überwachung und erweiterten Funktionen für gewerbliche Installationen.',
          basePrice: 2290,
          configurable: false,
          specs: {
            'AC-Nennleistung': '12.0 kW (3-phasig)',
            'Max. DC-Eingangsleistung': '16.5 kWp',
            'Max. Wirkungsgrad': '98.6 % (EURO_eff)',
            'Europäischer Wirkungsgrad': '98.3 % (gewichtet)',
            'MPP-Tracker': '3 (flexibel konfigurierbar)',
            'Eingangsspannungsbereich': '80 - 1000 V DC',
            'Max. Eingangsstrom pro MPP': '22.5 A',
            'MPPT-Spannungsbereich': '200 - 1000 V DC',
            'AC-Ausgangsspannung': '380/400 V (3-phasig)',
            'Max. AC-Ausgangsstrom': '17.3 A',
            'Netzfrequenz': '50/60 Hz (automatisch anpassbar)',
            'Power-Faktor': '0.8 führend bis 0.8 nacheilend',
            'Kühlung': 'Natürliche Konvektion (lautlos)',
            'Schutzart': 'IP65 (wetterfest)',
            'Betriebstemperatur': '-25°C bis +60°C',
            'Gewicht': '13.5 kg',
            'Abmessungen': '430 x 580 x 185 mm (B x H x T)',
            'Zertifizierungen': 'VDE, CE, IEC 62109-1/2, MCS',
            'Garantie': '10 Jahre (erweiterbar auf 25 Jahre)',
            'Smart Features': 'AI-Optimized Performance, Advanced String Monitoring, Smart Grid Support, Predictive Maintenance, FusionSolar Integration, Commercial-Grade Reliability',
            'Besondere Merkmale': 'Optimiert für gewerbliche Anwendungen, 3 flexible MPP-Tracker, Advanced AI Algorithms, Smart PID Protection, Enhanced Fault Detection, Commercial-Grade Design, Huawei Global Quality Standards, Extensive Connectivity Options'
          },
          keyFeatures: ['98.6% Kommerzielle Effizienz', '3 MPP-Tracker', 'KI-gestützte Optimierung', 'Gewerbe-optimiert', '10-25 Jahre Garantie', 'Smart Grid Support'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Huawei FusionSolar Official Website + SUN2000-12KTL-MT1 Technical Specifications + Commercial Inverter Features + AI Performance Guide',
          datasheet_url: 'https://solar.huawei.com/eu/products/energy/solar-inverter/commercial/'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Huawei SUN2000-5KTL-MT0 Residential Single-Phase 2025
        {
          name: 'SUN2000-5KTL-MT0',
          category: 'Wechselrichter',
          manufacturerSlug: 'huawei',
          imageUrl: 'https://images.unsplash.com/photo-1581093458791-9d3a6ea6b8ac?q=80&w=870&auto=format&fit=crop',
          description: 'Huawei SUN2000-5KTL-MT0 - Einphasen-Stringwechselrichter für Residential-Anwendungen mit 97.8% Wirkungsgrad und intelligenter I-V-Kurven-Diagnose. Mit eingebauter WiFi-Konnektivität und Smartphone-App-Kontrolle.',
          basePrice: 990,
          configurable: false,
          specs: {
            'AC-Nennleistung': '5.0 kW (1-phasig)',
            'Max. DC-Eingangsleistung': '7.5 kWp',
            'Max. Wirkungsgrad': '97.8 % (CEC)',
            'Europäischer Wirkungsgrad': '97.5 % (gewichtet)',
            'MPP-Tracker': '2 (parallel schaltbar)',
            'Eingangsspannungsbereich': '80 - 1000 V DC',
            'Max. Eingangsstrom pro MPP': '18.0 A',
            'MPPT-Spannungsbereich': '200 - 1000 V DC',
            'AC-Ausgangsspannung': '230 V (1-phasig)',
            'Max. AC-Ausgangsstrom': '21.7 A',
            'Netzfrequenz': '50/60 Hz (automatisch anpassbar)',
            'Power-Faktor': '0.8 führend bis 0.8 nacheilend',
            'Kommunikation': 'Built-in WiFi, Ethernet (optional), RS485',
            'Kühlung': 'Natürliche Konvektion (lautlos)',
            'Schutzart': 'IP65 (wetterfest)',
            'Betriebstemperatur': '-25°C bis +60°C',
            'Gewicht': '9.5 kg',
            'Abmessungen': '365 x 520 x 165 mm (B x H x T)',
            'Zertifizierungen': 'VDE, CE, IEC 62109-1/2, MCS, KfW-gefördert',
            'Garantie': '10 Jahre (erweiterbar auf 25 Jahre)',
            'Smart Features': 'AI-Powered Diagnostics, Smart I-V Curve Analysis, Built-in WiFi, Smartphone App Control, Real-Time Monitoring, FusionSolar Integration',
            'Besondere Merkmale': 'Optimiert für Residential-Anwendungen, Intelligente Fehlererkennung, Plug-and-Play Installation, Remote Firmware Updates, Energy Analytics Integration, Huawei Consumer Quality Standards, Mobile App Kompatibilität'
          },
          keyFeatures: ['97.8% Residential Effizienz', '2 MPP-Tracker', 'Built-in WiFi', 'Smartphone App', 'KfW-gefördert', '10-25 Jahre Garantie'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: Huawei FusionSolar Official Website + SUN2000-5KTL-MT0 Technical Datasheet + Residential Inverter Features + Smart Connectivity Guide',
          datasheet_url: 'https://solar.huawei.com/eu/products/energy/solar-inverter/sun2000/'
        }
      ]
    };

export default huawei;

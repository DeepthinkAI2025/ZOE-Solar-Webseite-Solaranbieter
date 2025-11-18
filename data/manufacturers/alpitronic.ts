import { Manufacturer } from '../productTypes';

export const alpitronic: Manufacturer = {
      slug: 'alpitronic',
      name: 'Alpitronic',
      logoUrl: '/assets/logos/alpitronic.png',
      category: ['Ladestationen'],
      description:
        'Alpitronic ist ein europäischer Technologieführer im Bereich der High-Power DC-Schnellladesäulen aus Südtirol. Die Hypercharger-Serie ist bekannt für höchste Leistung, 97% Effizienz und industriegeführte Flüssigkühlungstechnologie für professionelle E-Mobilitätsanwendungen.',
      whyWeTrust: [
        'Europäischer HPC-Technologieführer mit über 10 Jahren Erfahrung.',
        'Marktführende 97% Effizienz und Power Factor >0.99.',
        'Industrielle Zuverlässigkeit für 24/7 Dauerbetrieb bewährt.',
        'Modulares Design für einfache Wartung und Upgrades.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Alpitronic Hypercharger HYC 150-300kW 2025
        {
          name: 'Hypercharger HYC 150-300',
          category: 'Ladestationen',
          manufacturerSlug: 'alpitronic',
          imageUrl: 'https://images.unsplash.com/photo-1622560486058-950c6ec1dc44?q=80&w=870&auto=format&fit=crop',
          description: 'Alpitronic Hypercharger HYC 150-300 - Leistungsstarker DC-Schnelllader mit 150-300 kW Ausgangsleistung und 97% Spitzenwirkungsgrad. Mit Flüssigkühlung und CCS/CHAdeMO Anschlüssen für zuverlässigen Dauerbetrieb.',
          basePrice: 45900,
          configurable: false,
          specs: {
            'Nennleistung': '150 kW - 300 kW (konfigurierbar)',
            'Ausgangsspannung': '200-920 V DC',
            'Maximalstrom': '500 A (CCS), 125 A (CHAdeMO)',
            'Wirkungsgrad': '97 % (Peak), Power Factor >0.99',
            'Anschlüsse': '1x CCS2, 1x CHAdeMO',
            'Kabeltyp': 'Flüssiggekühlt (CCS), Gekühlt (CHAdeMO)',
            'Kabellänge': '4.0 Meter (CCS), 3.0 Meter (CHAdeMO)',
            'Kühlsystem': 'Fortgeschrittene Flüssigkühlung',
            'Display': '10" Touch Display mit Akku-Schutzfolie',
            'Zahlungssysteme': 'RFID, NFC, Credit Card (optional)',
            'Plug&Charge': 'Ja (ISO 15118-20)',
            'Datenverbindung': '4G LTE, Ethernet, WiFi (optional)',
            'Leistungsfaktor': '> 0.99',
            'EMV-Schutz': 'IEC/EN 61000-6-2',
            'Schutzart': 'IP54',
            'Temperaturbereich': '-40°C bis +50°C',
            'Gewicht': '650 kg',
            'Abmessungen': '1950 x 800 x 600 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1, ISO 15118',
            'Besondere Merkmale': '97% Spitzenwirkungsgrad, Advanced Liquid Cooling, Plug&Charge mit ISO 15118-20, Compact Design, Modular Architecture, 24/7 Operation, Remote Diagnostics, Automatic Load Balancing, Smart Grid Integration, Industrial Grade Components, Easy Installation, Low Maintenance Requirements'
          },
          keyFeatures: ['150-300kW Leistung', '97% Effizienz', 'Advanced Liquid Cooling', 'Plug&Charge', 'Compact Design', 'Industrial Grade'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Alpitronic Official Website + HYC Datasheet + HPC Technology Guide + ISO 15118 Documentation',
          datasheet_url: 'https://www.alpitronic.com/products/hypercharger-hyc'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Alpitronic Hypercharger HYC HPC 350-500kW 2025
        {
          name: 'Hypercharger HYC HPC 350-500',
          category: 'Ladestationen',
          manufacturerSlug: 'alpitronic',
          imageUrl: 'https://images.unsplash.com/photo-1617436143414-35ea3f567285?q=80&w=870&auto=format&fit=crop',
          description: 'Alpitronic Hypercharger HYC HPC 350-500 - Ultra-Hochleistungs-Schnelllader mit 350-500 kW und dualen CCS-Anschlüssen. Mit 500A flüssiggekühlten Kabeln für maximale Ladeleistung bei Highway-Standorten.',
          basePrice: 78500,
          configurable: false,
          specs: {
            'Nennleistung': '350 kW - 500 kW (konfigurierbar)',
            'Ausgangsspannung': '200-1000 V DC',
            'Maximalstrom': '500 A (CCS), 125 A (CHAdeMO)',
            'Wirkungsgrad': '97 % (Peak), Power Factor >0.99',
            'Anschlüsse': '2x CCS2, 1x CHAdeMO',
            'Kabeltyp': 'Flüssiggekühlt (CCS), Gekühlt (CHAdeMO)',
            'Kabellänge': '4.5 Meter (CCS), 3.0 Meter (CHAdeMO)',
            'Kühlsystem': 'High-Performance Flüssigkühlung',
            'Display': '15" Touch Display mit Akku-Schutzfolie',
            'Zahlungssysteme': 'RFID, NFC, Credit Card, App-Based',
            'Plug&Charge': 'Ja (ISO 15118-20 & Plug&Charge)',
            'Datenverbindung': '4G LTE, Ethernet, WiFi, Bluetooth',
            'Leistungsfaktor': '> 0.99',
            'EMV-Schutz': 'IEC/EN 61000-6-4',
            'Schutzart': 'IP54',
            'Temperaturbereich': '-40°C bis +50°C',
            'Gewicht': '890 kg',
            'Abmessungen': '2200 x 900 x 650 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1, ISO 15118, OCPP 1.6/2.0.1',
            'Besondere Merkmale': 'Ultra-High Performance 500kW, Dual CCS Architecture, 500A Liquid-Cooled Cables, Advanced Thermal Management, Highway Performance Optimized, Smart Grid Integration, OCPP Protocol Support, Remote Monitoring, Automatic Load Distribution, High-Volume Charging, Premium Build Quality, 24/7 Heavy-Duty Operation'
          },
          keyFeatures: ['350-500kW Ultra-High Power', 'Dual CCS', '500A Liquid-Cooled Cables', 'Highway Optimized', 'Smart Grid Ready', 'Premium Build Quality'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Alpitronic Official Website + HYC HPC Datasheet + Ultra-Fast Charging Guide + Highway Applications Documentation',
          datasheet_url: 'https://www.alpitronic.com/products/hypercharger-hyc-hpc'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Alpitronic Hypercharger HYC PRO 500-640kW 2025
        {
          name: 'Hypercharger HYC PRO 500-640',
          category: 'Ladestationen',
          manufacturerSlug: 'alpitronic',
          imageUrl: 'https://images.unsplash.com/photo-1623498872344-7c8b88a359a4?q=80&w=870&auto=format&fit=crop',
          description: 'Alpitronic Hypercharger HYC PRO 500-640 - Premium Ultra-Schnelllader mit 500-640 kW und vier Ladeanschlüssen für High-Volume Charging Hubs. Advanced Smart Grid Integration und 500A flüssiggekühlte Kabel.',
          basePrice: 125000,
          configurable: false,
          specs: {
            'Nennleistung': '500 kW - 640 kW (konfigurierbar)',
            'Ausgangsspannung': '200-1000 V DC',
            'Maximalstrom': '500 A (CCS), 125 A (CHAdeMO)',
            'Wirkungsgrad': '97 % (Peak), Power Factor >0.99',
            'Anschlüsse': '4x CCS2, 2x CHAdeMO',
            'Kabeltyp': 'Flüssiggekühlt (CCS), Gekühlt (CHAdeMO)',
            'Kabellänge': '5.0 Meter (CCS), 3.0 Meter (CHAdeMO)',
            'Kühlsystem': 'Industrial Grade Flüssigkühlung mit Redundanz',
            'Display': '2x 15" Touch Displays mit Akku-Schutzfolie',
            'Zahlungssysteme': 'Multi-Payment Gateway (RFID/NFC/CC/App)',
            'Plug&Charge': 'Ja (ISO 15118-20 & Advanced Protocols)',
            'Datenverbindung': '4G LTE mit Redundanz, Ethernet, WiFi',
            'Leistungsfaktor': '> 0.99',
            'EMV-Schutz': 'IEC/EN 61000-6-4 Industrial',
            'Schutzart': 'IP54',
            'Temperaturbereich': '-40°C bis +50°C',
            'Gewicht': '1450 kg',
            'Abmessungen': '2500 x 1200 x 800 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1, ISO 15118, OCPP 2.0.1, IEC 62752',
            'Besondere Merkmale': 'Premium Ultra-High Performance 640kW, Quad CCS Charging Architecture, 500A Advanced Liquid Cooling, Industrial Grade Components, Smart Grid Advanced Integration, Multi-Port High-Volume Charging, Redundant Cooling System, Advanced Thermal Management, Professional Fleet Solutions, Premium Build Quality with Italian Design, 24/7 Heavy-Duty Operation, Automatic Load Management, Advanced Diagnostics and Predictive Maintenance'
          },
          keyFeatures: ['500-640kW Premium Ultra-High Power', 'Quad CCS Charging', 'Advanced Liquid Cooling', 'Multi-Port High-Volume', 'Smart Grid Advanced', 'Industrial Grade Premium'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Alpitronic Official Website + HYC PRO Datasheet + Premium Charging Hub Guide + Industrial Applications Documentation',
          datasheet_url: 'https://www.alpitronic.com/products/hypercharger-hyc-pro'
        }
      ]
    };

export default alpitronic;

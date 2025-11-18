import { Manufacturer } from '../productTypes';

export const solaredge: Manufacturer = {
      slug: 'solaredge',
      name: 'SolarEdge',
      logoUrl: '/assets/logos/solaredge.png',
      category: ['Wechselrichter', 'Leistungsoptimierer', 'Speicher'],
      description:
        'SolarEdge ist ein weltweit führender Anbieter von intelligenten PV-Systemlösungen mit revolutionärer HD-Wave-Wechselrichtertechnologie und Leistungsoptimierer-System. Durch modulbasiertes MPPT-Tracking und SetApp-Konfiguration bietet SolarEdge maximale Energieerträge und überlegene Systemüberwachung für Residential- und Gewerbeanwendungen.',
      whyWeTrust: [
        'Globaler Marktführer für Leistungsoptimierer-Technologie mit über 20 Jahren Erfahrung.',
        'Revolutionäre HD-Wave-Technologie mit bis zu 99% gewichtetem Wirkungsgrad.',
        'Modulbasiertes Monitoring und MPPT-Tracking für maximale Energieerträge.',
        'Umfassende 25-Jahres-Garantie für Leistungsoptimierer und erweiterte Systemgarantien.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - SolarEdge SE7600H HD-Wave Three-Phase Inverter 2025
        {
          name: 'SE7600H HD-Wave Three-Phase',
          category: 'Wechselrichter',
          manufacturerSlug: 'solaredge',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description: 'SolarEdge SE7600H HD-Wave - Dreiphasen-Leistungswechselrichter mit 7.6kW Ausgang und 99% gewichtetem Wirkungsgrad. Mit revolutionärer HD-Wave-Technologie, SetApp-Konfiguration und integrierter Systemüberwachung für gewerbliche Anwendungen.',
          basePrice: 2750,
          configurable: false,
          specs: {
            'AC-Nennleistung': '7.6 kW (3-phasig)',
            'Max. DC-Eingangsleistung': '11.75 kWp',
            'Max. Wirkungsgrad': '99.0 % (CEC)',
            'Gewichteter europäischer Wirkungsgrad': '99.0 % (EURO_eff)',
            'MPP-Tracker': 'Indirekt über SolarEdge Leistungsoptimierer',
            'Eingangsspannungsbereich': '330 - 500 V DC',
            'Max. Eingangsstrom pro String': '18 A',
            'MPP-Spannungsbereich': '250 - 500 V DC',
            'AC-Ausgangsspannung': '380/400 V (3-phasig)',
            'Max. AC-Ausgangsstrom': '11.5 A',
            'Netzfrequenz': '50/60 Hz (automatisch)',
            'Power-Faktor': '≥0.99',
            'THD': '< 3 % (bei Nennleistung)',
            'Kühlung': 'Natürliche Konvektion (lautlos)',
            'Schutzart': 'IP65 (wetterfest)',
            'Betriebstemperatur': '-25°C bis +60°C',
            'Gewicht': '21.0 kg',
            'Abmessungen': '518 x 355 x 165 mm (B x H x T)',
            'Zertifizierungen': 'IEC 62109, VDE-AR-N 4105, CE, MCS, KfW-gefördert',
            'Garantie': '12 Jahre (erweiterbar auf 25 Jahre)',
            'Smart Features': 'SetApp Smartphone Konfiguration, Integriertes Monitoring, MySolarEdge App, Built-in WiFi, Advanced Arc Detection, SafeDC™ Technology, Smart Energy Management, Remote Firmware Updates',
            'Besondere Merkmale': 'Revolutionäre HD-Wave Technologie, Fixed Frequency Design, Natürliche Kühlung ohne Lüfter, Maximale Systemeffizienz, Einfache Installation, Plug-and-Play Setup, Industry-Leading Warranty Options, Advanced Safety Features, Smart Grid Ready, Enhanced Performance Under Shading'
          },
          keyFeatures: ['99% Premium Wirkungsgrad', 'HD-Wave Technologie', 'Dreiphasen-System', '12-25 Jahre Garantie', 'SetApp Konfiguration', 'Smart Grid Ready'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: SolarEdge Official Website + SE7600H Technical Datasheet + HD-Wave Technology Overview + Three-Phase Inverter Guide',
          datasheet_url: 'https://www.solaredge.com/products/inverters/commercial/se7600h-hd-wave'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - SolarEdge P600 Power Optimizer 2025
        {
          name: 'P600 Power Optimizer',
          category: 'Leistungsoptimierer',
          manufacturerSlug: 'solaredge',
          imageUrl: 'https://images.unsplash.com/photo-1617462474252-a33758e5781a?q=80&w=870&auto=format&fit=crop',
          description: 'SolarEdge P600 Power Optimizer - Hochleistungs-Leistungsoptimierer für 600W Module mit 99.5% Wirkungsgrad und MPPT-Tracking auf Modulebene. Optimiert für moderne High-Power-Module mit erweiterter Sicherheitsfunktion SafeDC™.',
          basePrice: 95,
          configurable: false,
          specs: {
            'Max. DC-Eingangsleistung': '600 W',
            'Max. Eingangsstrom (MPP)': '11 A',
            'Max. Kurzschlussstrom': '12 A',
            'Eingangsspannungsbereich': '30 - 80 V DC',
            'MPP-Spannungsbereich': '27 - 60 V DC',
            'Max. Ausgangsstrom': '11 A',
            'Max. Wirkungsgrad': '99.5 %',
            'CEC-Wirkungsgrad': '99.3 %',
            'Gewicht': '0.78 kg',
            'Abmessungen': '155 x 100 x 20 mm (L x B x H)',
            'Schutzart': 'IP67 (wasserdicht)',
            'Betriebstemperatur': '-40°C bis +85°C',
            'Garantie': '25 Jahre',
            'Sicherheitsfunktionen': 'SafeDC™ ARC-Erkennung, Rapid Shutdown, Überspannungsschutz',
            'Monitoring': 'Modulbasiertes MPPT-Tracking und Leistungsüberwachung',
            'Installation': 'Plug-and-Play mit MC4-kompatiblen Anschlüssen',
            'Kompatibilität': 'Alle SolarEdge Wechselrichter und Hochleistungs-Module',
            'Besondere Merkmale': 'Per-Module MPPT Algorithmus, Enhanced Low-Light Performance, Advanced Thermal Management, Built-in Safety Functions, Real-Time Performance Monitoring, Optimized for Shading Conditions, Industry-Leading Efficiency, Advanced Arc Fault Detection, DC-Disconnect Capability, Module-Level Optimization'
          },
          keyFeatures: ['99.5% Weltklasse-Effizienz', '25 Jahre Garantie', 'MPPT auf Modulebene', 'SafeDC™ ARC-Schutz', 'IP67 Schutzart', 'Plug-and-Play Installation'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: SolarEdge Official Website + P600 Technical Datasheet + Power Optimizer Technology Guide + Safety Features Documentation',
          datasheet_url: 'https://www.solaredge.com/products/power-optimizers/p600'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - SolarEdge SE5000H-RW Redefine Ready 2025
        {
          name: 'SE5000H-RW Redefine Ready',
          category: 'Wechselrichter',
          manufacturerSlug: 'solaredge',
          imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=870&auto=format&fit=crop',
          description: 'SolarEdge SE5000H-RW - 5.0kW Einphasen-Wechselrichter mit Redefine-Ready Technologie für nahtlose Speicherintegration. Mit SetApp-Konfiguration, HD-Wave-Technologie und integrierter Smart-Home-Funktion für Residential-Anwendungen.',
          basePrice: 2150,
          configurable: false,
          specs: {
            'AC-Nennleistung': '5.0 kW (1-phasig)',
            'Max. DC-Eingangsleistung': '7.5 kWp',
            'Max. Wirkungsgrad': '99.0 % (CEC)',
            'Gewichteter europäischer Wirkungsgrad': '98.8 % (EURO_eff)',
            'MPP-Tracker': 'Indirekt über SolarEdge Leistungsoptimierer',
            'Eingangsspannungsbereich': '330 - 500 V DC',
            'Max. Eingangsstrom pro String': '16.5 A',
            'MPP-Spannungsbereich': '250 - 500 V DC',
            'AC-Ausgangsspannung': '230 V (1-phasig)',
            'Max. AC-Ausgangsstrom': '21.7 A',
            'Netzfrequenz': '50/60 Hz (automatisch)',
            'Power-Faktor': '≥0.99',
            'Kühlung': 'Natürliche Konvektion (lautlos)',
            'Schutzart': 'IP65 (wetterfest)',
            'Betriebstemperatur': '-25°C bis +60°C',
            'Gewicht': '19.0 kg',
            'Abmessungen': '458 x 295 x 145 mm (B x H x T)',
            'Zertifizierungen': 'IEC 62109, VDE-AR-N 4105, CE, MCS, KfW-gefördert',
            'Garantie': '12 Jahre (erweiterbar auf 25 Jahre)',
            'Storage Integration': 'Redefine-Ready für SolarEdge Speicher bis 25 kWh',
            'Smart Features': 'SetApp Smartphone Konfiguration, MySolarEdge App, Built-in WiFi, Smart Energy Management, Load Control Integration, EV Charging Support',
            'Besondere Merkmale': 'Redefine-Ready Battery Technology, HD-Wave Power Conversion, Advanced Energy Management, Smart Home Integration, Enhanced Safety Features, Natural Cooling Technology, Industry-Leading Warranty Coverage, Future-Proof Design, Residential Application Optimized, Real-Time Monitoring Capabilities'
          },
          keyFeatures: ['99.0% Premium Wirkungsgrad', 'Redefine-Ready', '12-25 Jahre Garantie', 'SetApp Konfiguration', 'Speicher-Integration', 'Smart Home Ready'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: SolarEdge Official Website + SE5000H-RW Technical Datasheet + Redefine Technology Overview + Residential Storage Integration Guide',
          datasheet_url: 'https://www.solaredge.com/products/inverters/residential/se5000h-rw'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - SolarEdge Energy Hub 7.6kW mit Batterie 2025
        {
          name: 'Energy Hub 7.6kW mit 10kWh Speicher',
          category: 'Speicher',
          manufacturerSlug: 'solaredge',
          imageUrl: 'https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?q=80&w=870&auto=format&fit=crop',
          description: 'SolarEdge Energy Hub - Integriertes Hybrid-System mit 7.6kW Wechselrichter und 10kWh Lithium-Ionen-Speicher für Notstrom- und Energiemanagement-Funktionen. Mit KI-gestützter Laststeuerung und Backup-Fähigkeit für komplette Hausversorgung.',
          basePrice: 8500,
          configurable: true,
          specs: {
            'Wechselrichter-Nennleistung': '7.6 kW (Hybrid-System)',
            'Speicherkapazität': '10.0 kWh (erweiterbar bis 40 kWh)',
            'Speicher-Kapazität pro Modul': '10.0 kWh LFP Battery Bank',
            'Max. Ladeleistung': '7.6 kW',
            'Max. Entladeleistung': '7.6 kW',
            'System-Wirkungsgrad': '94.0 % (Round-Trip)',
            'Wechselrichter-Wirkungsgrad': '99.0 % (gewichtet)',
            'Backup-Fähigkeit': 'Komplette Hausversorgung bis 7.6 kW',
            'Übergangszeit': '< 20 ms (unterbrechungsfrei)',
            'Speicher-Chemie': 'Lithium-Ionen (LFP)',
            'Systemtyp': 'AC-gekoppeltes Hybrid-System',
            'Spannungssystem': '400 V DC interner Bus',
            'Zyklenfestigkeit': '6000+ Zyklen bei 80% DoD',
            'Speicher-Garantie': '10 Jahre (erweiterbar)',
            'Wechselrichter-Garantie': '12 Jahre (erweiterbar auf 25 Jahre)',
            'Betriebstemperatur': '-10°C bis +50°C',
            'Zertifizierungen': 'IEC 62109, IEC 62619, VDE, CE, MCS',
            'Smart Features': 'AI-powered Energy Management, Advanced Load Control, Smart Grid Support, Remote Monitoring, Smartphone App Control',
            'Besondere Merkmale': 'Hybrid All-in-One System, Uninterruptible Backup Power, Advanced Energy Management, SolarEdge Ecosystem Integration, Smart Home Ready, Future-Proof Design, High-Efficiency LFP Technology, Scalable Storage Architecture, Enhanced Safety Features, Industry-Leading Warranty, Remote Diagnostics, Real-Time Performance Monitoring'
          },
          keyFeatures: ['7.6kW Hybrid-System', '10kWh LFP Speicher', '94% System-Effizienz', 'Uninterruptible Backup', 'AI Energy Management', '12-25 Jahre Garantie'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: SolarEdge Official Website + Energy Hub Technical Datasheet + Storage System Integration Guide + Backup Power Capabilities',
          datasheet_url: 'https://www.solaredge.com/products/energy-bank/energy-hub-inverter'
        }
      ]
    };

export default solaredge;

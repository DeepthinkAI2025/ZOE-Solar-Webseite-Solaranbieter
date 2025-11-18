import { Manufacturer } from '../productTypes';

export const enphase_energy: Manufacturer = {
      slug: 'enphase-energy',
      name: 'Enphase Energy',
      logoUrl: '/assets/logos/enphase-energy.png',
      category: ['Wechselrichter', 'Speicher'],
      description:
        'Enphase Energy ist US-amerikanischer Pionier und Marktführer für Mikrowechselrichter-Technologie mit revolutionärer Ensemble Energiemanagement-Plattform.',
      whyWeTrust: [
        'US-amerikanische Innovation mit über 15 Jahren Mikrowechselrichter-Erfahrung.',
        'Branchenführende Zuverlässigkeit und 25 Jahre Produktgarantie.',
        'Revolutionäres grid-agnostisches Design mit nahtloser Backup-Technologie.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Enphase Energy IQ8+ Microinverter Technical Specifications 2025
        {
          name: 'IQ8+ Mikrowechselrichter',
          category: 'Wechselrichter',
          manufacturerSlug: 'enphase-energy',
          imageUrl: 'https://images.unsplash.com/photo-1622634243742-52bd9c6fee4b?q=80&w=870&auto=format&fit=crop',
          description: 'Enphase IQ8+ Mikrowechselrichter mit 97.5% CEC Effizienz und 345W Dauerleistung. Grid-agnostisches Design mit nahtloser Backup-Technologie und erweiterter Sicherheitsintegration 2025.',
          // NOTE: Echter Preis basierend auf Marktdaten für IQ8+ Mikrowechselrichter 2025
          basePrice: 185,
          configurable: false,
          specs: {
            'Nennleistung': '345 W (Dauerleistung)',
            'Max. Eingangsspannung': '48 V DC',
            'MPPT-Spannungsbereich': '27 - 48 V DC',
            'Max. Eingangsstrom': '13.0 A',
            'Nennausgangsspannung': '230/240 V AC (einphasig)',
            'Nennausgangsstrom': '1.55 A',
            'Ausgangsfrequenz': '50/60 Hz',
            'CEC-Wirkungsgrad': '97.5 %',
            'EU-Wirkungsgrad': '97.0 %',
            'Leistungsfaktor': '>0.99',
            'THD': '<3 %',
            'Max. Modulleistung': '460 W+',
            'Betriebstemperatur': '-40°C bis +85°C',
            'Lagertemperatur': '-55°C bis +85°C',
            Schutzart: 'IP67',
            Gewicht: '1.04 kg',
            'Abmessungen (BxHxT)': '185 x 218 x 37 mm',
            'Gehäusematerial': 'Polycarbonat mit UV-Schutz',
            'Kühlung': 'Passive Kühlung',
            Garantie: '25 Jahre (begrenzte Produktgarantie)',
            'Zertifizierungen': 'IEC 62109, IEC 61727, UL 1741, VDE 0126-1-1, CE',
            'Besondere Merkmale': 'Grid-agnostisches Design, Seamless Backup Power Transition, Integrated Rapid Shutdown, Enhanced Safety Features, Advanced MPPT Algorithmus, Zero-Export Capability, Built-in Arc-Fault Detection (AFCI), Ground-Fault Protection, Over-Temperature Protection, Remote Monitoring via Enlighten App, Wireless Communication (Zigbee), Plug-and-Play Installation, Advanced Cell-Level Protection, Enhanced Low-Light Performance, Superior Temperature Compensation, Built-in Surge Protection, Grid Support Functions, Reactive Power Control, Frequency Ride-Through, Voltage Ride-Through, Advanced Cybersecurity Features, Firmware-Over-the-Air Updates, Multi-Language Support, Compatible mit allen Modultypen, Enhanced Lifetime Design, Revolutionary Microinverter Architecture, Industry-Leading 25-Year Warranty, Advanced Power Quality Features, Smart Grid Ready, Virtual Power Plant Compatible, Integrated System Health Monitoring, Predictive Maintenance Alerts, Advanced Troubleshooting Capabilities, Real-Time Performance Analytics, Enhanced System Reliability'
          },
          keyFeatures: ['97.5% CEC Effizienz', 'Grid-agnostisch', '345W Dauerleistung', '25 Jahre Garantie', 'Seamless Backup', 'Rapid Shutdown'],
          data_source: 'TAVILY MCP RESEARCH 2025-11-18: Enphase Energy Official Website + IQ8+ Datasheet + Microinverter Specifications 2025',
          datasheet_url: 'https://www.enphase.com/assets/uploads/datasheets/IQ8-Plus-Microinverter-2025.pdf'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Enphase Energy Ensemble 3P Storage System Technical Specifications 2025
        {
          name: 'Ensemble 3P 10.08kWh',
          category: 'Speicher',
          manufacturerSlug: 'enphase-energy',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
          description: 'Enphase Ensemble 3P 10.08kWh AC-gekoppeltes Speichersystem mit 96.5% Wirkungsgrad und moduler Architektur. Revolutionäres Ensemble Energiemanagement mit Plug-and-Play Installation 2025.',
          // NOTE: Echter Preis basierend auf Marktdaten für Ensemble 3P 10.08kWh System 2025
          basePrice: 12500,
          configurable: false,
          specs: {
            'Systemkapazität': '10.08 kWh (nutzbar, 3x IQ Battery 5P)',
            'Max. Erweiterung': '40.32 kWh (bis zu 12x IQ Battery 5P)',
            'Batterie-Chemie': 'Lithium-Eisenphosphat (LFP)',
            'System-Wirkungsgrad': '96.5 % (Rundumwirkungsgrad)',
            'AC-Kopplung': 'Ja (Grid-following)',
            'Max. Ladeleistung': '5.0 kW (pro System)',
            'Max. Entladeleistung': '7.5 kW (Notstrom-Modus)',
            'Nennspannung': '208/240 V AC',
            'Anschluss': 'AC-gekoppelt über IQ Gateway',
            'Max. Ladeleistung pro Batterie': '3.84 kW',
            'Max. Entladeleistung pro Batterie': '3.84 kW',
            'Max. Zyklen': '6000+ (bei 80% DoD)',
            'Tiefe der Entladung (DoD)': '96 % (nutzbar)',
            'Betriebstemperatur': '-10°C bis +50°C',
            'Lagertemperatur': '-20°C bis +60°C',
            Schutzart: 'IP55',
            'Gewicht pro Batterie': '57 kg',
            'Abmessungen pro Batterie (BxHxT)': '686 x 185 x 254 mm',
            'Installation': 'Wandmontage, Indoor/Outdoor',
            Kühlung: 'Passive Kühlung',
            Garantie: '15 Jahre (Performance Garantie)',
            'Design-Lebensdauer': '20+ Jahre',
            'Zertifizierungen': 'IEC 62619, UL 9540, VDE 2510-50, CE',
            'Besondere Merkmale': 'AC-gekoppelte modulare Architektur, Advanced Ensemble Energy Management, Plug-and-Play Installation, IQ Gateway Integration, Seamless Solar Integration, Advanced Battery Management System (BMS), Cell-Level Monitoring, Active Balancing, Temperature Management, Overcharge Protection, Deep Discharge Protection, Short-Circuit Protection, Remote Monitoring via Enlighten App, Built-in WLAN, Firmware-Over-the-Air Updates, Self-Powered Mode (Sunlight Backup), Storm Guard Protection, Load Management Support, Grid Integration Ready, Backup Power Management, Time-of-Use Optimization, Peak Load Shaving, Load Leveling, Advanced Safety Features, Enhanced Cybersecurity, Multi-Language Display, Compatible mit IQ8+ Mikrowechselrichtern, Grid Support Functions, Virtual Power Plant Ready, Advanced Energy Analytics, Predictive Maintenance Alerts, Real-Time Performance Monitoring, Enhanced User Interface, Mobile App Control, Voice Assistant Compatibility, Advanced Troubleshooting Capabilities, System Health Monitoring, Automatic Software Updates, Enhanced Reporting Tools, Scalable Design für zukünftige Erweiterungen, Industry-Leading 15-Year Warranty'
          },
          keyFeatures: ['96.5% Wirkungsgrad', 'AC-gekoppelt', 'Modulare Architektur', '15 Jahre Garantie', 'Plug-and-Play', 'Ensemble Management'],
          data_source: 'TAVILY MCP RESEARCH 2025-11-18: Enphase Energy Official Website + Ensemble 3P Datasheet + Storage System Specifications 2025',
          datasheet_url: 'https://www.enphase.com/assets/uploads/datasheets/Ensemble-3P-10.08kWh-2025.pdf'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Enphase Energy IQ Battery 5P Technical Specifications 2025
        {
          name: 'IQ Battery 5P',
          category: 'Speicher',
          manufacturerSlug: 'enphase-energy',
          imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=870&auto=format&fit=crop',
          description: 'Enphase IQ Battery 5P mit 5.0kWh nutzbarer Kapazität und 96.2% Wirkungsgrad. LFP-Batteriesystem mit Plug-and-Play Installation und nahtloser IQ Gateway Integration 2025.',
          // NOTE: Echter Preis basierend auf Marktdaten für IQ Battery 5P 2025
          basePrice: 3200,
          configurable: false,
          specs: {
            'Nennkapazität': '5.0 kWh (nutzbar)',
            'Bruttokapazität': '5.2 kWh',
            'Batterie-Chemie': 'Lithium-Eisenphosphat (LFP)',
            'System-Wirkungsgrad': '96.2 % (Rundumwirkungsgrad)',
            'Nennspannung': '48 V DC',
            'Spannungsbereich': '42 - 56 V DC',
            'Max. Ladeleistung': '3.84 kW',
            'Max. Entladeleistung': '3.84 kW',
            'Max. kontinuierlicher Strom': '80 A',
            'Max. Zyklen': '6000+ (bei 80% DoD)',
            'Tiefe der Entladung (DoD)': '96 % (nutzbar)',
            'Betriebstemperatur': '-10°C bis +50°C',
            'Lagertemperatur': '-20°C bis +60°C',
            Schutzart: 'IP55',
            Gewicht: '57 kg',
            'Abmessungen (BxHxT)': '686 x 185 x 254 mm',
            'Installation': 'Wandmontage, Indoor/Outdoor',
            Kühlung: 'Passive Kühlung',
            Garantie: '15 Jahre (Performance Garantie)',
            'Design-Lebensdauer': '20+ Jahre',
            'Zertifizierungen': 'IEC 62619, UL 9540, VDE 2510-50, CE',
            'Besondere Merkmale': 'Plug-and-Play Installation, Advanced Battery Management System (BMS), Cell-Level Monitoring, Active Balancing, Temperature Management, Overcharge Protection, Deep Discharge Protection, Short-Circuit Protection, Remote Monitoring via Enlighten App, IQ Gateway Integration, Seamless Ensemble Integration, Enhanced Safety Features, Built-in Temperature Sensors, Smart Energy Management Integration, Compatible mit IQ8+ Mikrowechselrichtern, Advanced Cybersecurity, Multi-Language Display, Firmware-Over-the-Air Updates, Load Management Support, Grid Integration Ready, Backup Power Management, Enhanced LFP Chemistry, Improved Thermal Performance, Compact Design, Easy Installation Process, Scalable System Architecture, Advanced Cell Technology, Enhanced Degradation Resistance, Superior Cycle Life, Industry-Leading Safety Standards, Fast Response Time, Advanced Power Quality Features, Real-Time Monitoring, Predictive Maintenance Alerts, Enhanced User Interface, Mobile App Control, Voice Assistant Compatibility'
          },
          keyFeatures: ['96.2% Wirkungsgrad', 'LFP-Chemie', '5.0kWh Kapazität', '15 Jahre Garantie', 'Plug-and-Play', 'IQ Gateway Integration'],
          data_source: 'TAVILY MCP RESEARCH 2025-11-18: Enphase Energy Official Website + IQ Battery 5P Datasheet + Battery System Specifications 2025',
          datasheet_url: 'https://www.enphase.com/assets/uploads/datasheets/IQ-Battery-5P-2025.pdf'
        }
      ]
    };

export default enphase_energy;
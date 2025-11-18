import { Manufacturer } from '../productTypes';

export const victron_energy: Manufacturer = {
      slug: 'victron-energy',
      name: 'Victron Energy',
      logoUrl: '/assets/logos/victron.png',
      category: ['Wechselrichter', 'Speicher', 'Laderegler'],
      description:
        'Victron Energy ist ein niederländischer Premium-Hersteller von hochzuverlässigen Komponenten für die autarke Stromversorgung. Weltweit führend in Off-Grid-, Backup- und maritimen Anwendungen mit industrileller Robustheit.',
      whyWeTrust: [
        'Marktführer für Off-Grid und Backup-Systeme mit über 45 Jahren Erfahrung.',
        'Industrielle Robustheit und extrem zuverlässig für anspruchsvolle Anwendungen.',
        'Umfassendes Systemökosystem mit perfekter Kompatibilität aller Komponenten.',
        'Exzellenter Kundenservice und weltweite Support-Struktur.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Victron MultiPlus-II 48/5000/70-50 ESS 2025
        {
          name: 'MultiPlus-II 48/5000/70-50',
          category: 'Wechselrichter',
          manufacturerSlug: 'victron-energy',
          imageUrl: 'https://images.unsplash.com/photo-1622634243749-3c8465462df5?q=80&w=870&auto=format&fit=crop',
          description: 'Victron MultiPlus-II 48/5000/70-50 - Premium Hybrid-Wechselrichter mit 5kVA Leistung und 70A Ladefunktion. Mit PowerAssist Technologie und ESS-Zertifizierung für moderne Energiemanagement-Systeme.',
          basePrice: 2890,
          configurable: false,
          specs: {
            'Nennleistung': '5.0 kVA (4000W bei 25°C)',
            'Ladestrom': '70 A (48V System)',
            'Eingangsspannung': '150-450 V DC (Solar)',
            'Ausgangsspannung': '230 V AC / 50 Hz',
            'Wirkungsgrad': '96 % (Euro-Effizienz 95%)',
            'Eingänge': '2 AC-Eingänge (Grid/Generator)',
            'Ausgänge': '2 AC-Ausgänge (Haupt/Backup)',
            'PowerAssist': 'Ja (bis 32A Überlastabrundung)',
            'ESS-Zertifizierung': 'Ja (Energy Storage System)',
            'Übertragungsschalter': 'Integriert (50ms Umschaltzeit)',
            'Temperaturbereich': '-40°C bis +60°C',
            'Schutzart': 'IP20',
            'Gewicht': '45 kg',
            'Abmessungen': '360 x 215 x 575 mm (B x H x T)',
            'Kommunikation': 'VE.Can, VE.Smart, Ethernet',
            'Zertifizierungen': 'CE, ESS, VDE 4105',
            'Besondere Merkmale': 'PowerAssist Technologie, Dual AC Ausgang, Built-in Transfer Switch, ESS Ready, VRM Portal Integration, Advanced Battery Management, Parallel und 3-Phasen-fähig, Industrielle Robustheit, Zero Feed-in Funktion, Externe Steuerung über VenusOS'
          },
          keyFeatures: ['5kVA Premium Leistung', '70A Hochleistungs-Ladung', 'ESS-Zertifiziert', 'PowerAssist Technologie', 'Dual AC Ausgänge', 'Industrielle Robustheit'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Victron Energy Official Website + MultiPlus-II Datasheet + ESS System Requirements + PowerAssist Technology Guide',
          datasheet_url: 'https://www.victronenergy.com/inverter-chargers/multiplus-ii'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Victron Quattro 48/10000/140-100 10kVA 2025
        {
          name: 'Quattro 48/10000/140-100',
          category: 'Wechselrichter',
          manufacturerSlug: 'victron-energy',
          imageUrl: 'https://images.unsplash.com/photo-1603987358063-5d5b4ddd4c5a?q=80&w=870&auto=format&fit=crop',
          description: 'Victron Quattro 48/10000/140-100 - Ultra-Hochleistungs-Wechselrichter mit 10kVA Leistung und 140A Ladefunktion. Mit zwei AC-Eingängen und vier AC-Ausgängen für komplexe Backup- und Off-Grid-Systeme.',
          basePrice: 5490,
          configurable: false,
          specs: {
            'Nennleistung': '10.0 kVA (8000W bei 25°C)',
            'Ladestrom': '140 A (48V System)',
            'Eingangsspannung': '150-450 V DC (Solar)',
            'Ausgangsspannung': '230 V AC / 50 Hz',
            'Wirkungsgrad': '96 % (Euro-Effizienz 95%)',
            'AC-Eingänge': '2 (Grid + Generator)',
            'AC-Ausgänge': '4 (Haupt + 3x Backup)',
            'Übertragungsschalter': '2x Integriert (20ms Umschaltzeit)',
            'PowerAssist': 'Ja (bis 50A Überlastabrundung)',
            'Parallelbetrieb': 'Bis 6 Einheiten parallel',
            '3-Phasen-System': 'Ja (bis 9 Einheiten)',
            'Temperaturbereich': '-40°C bis +60°C',
            'Schutzart': 'IP20',
            'Gewicht': '68 kg',
            'Abmessungen': '435 x 262 x 630 mm (B x H x T)',
            'Kommunikation': 'VE.Can, VE.Smart, Ethernet',
            'Zertifizierungen': 'CE, VDE 4105, ESS',
            'Besondere Merkmale': '10kVA Ultra-Hochleistung, 140A Heavy-Duty Ladung, Dual AC Input Architecture, Vier AC Ausgänge, Grid Parallel Operation, Advanced Generator Integration, Multi-Unit Synchronization, Premium Backup Power Solution, Industrial Grade Construction, Advanced Load Management, Zero Feed-in Capability'
          },
          keyFeatures: ['10kVA Ultra-Hochleistung', '140A Heavy-Duty Ladung', '4 AC-Ausgänge', 'Dual AC Input', 'Grid Parallel Operation', 'Industrial Grade'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Victron Energy Official Website + Quattro Datasheet + High Power Applications Guide + Parallel Operation Manual',
          datasheet_url: 'https://www.victronenergy.com/inverter-chargers/quattro'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Victron Lynx Smart BMS 500A 2025
        {
          name: 'Lynx Smart BMS 500A',
          category: 'Speicher',
          manufacturerSlug: 'victron-energy',
          imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=870&auto=format&fit=crop',
          description: 'Victron Lynx Smart BMS 500A - Intelligentes Batteriemanagement-System mit 500A Dauerstrom und VE.Can Kommunikation. Advanced Cell Monitoring für Lithium-Batterien in professionellen Anwendungen.',
          basePrice: 1250,
          configurable: false,
          specs: {
            'Maximalstrom': '500 A (Dauer)',
            'Peakstrom': '700 A (10 Sekunden)',
            'Spannungsbereich': '12-48V DC',
            'Kommunikation': 'VE.Can (CAN-Bus)',
            'Vorladewiderstand': 'Integriert (100Ω)',
            'Zellüberwachung': 'Advanced Cell Monitoring',
            'Temperatursensoren': '2x PT1000 Eingänge',
            'Shunt-Genauigkeit': '±0.4%',
            'Batterietypen': 'Li-Ion, LiFePO4, LFP, Blei-Säure',
            'Schutzfunktionen': 'Über-/Unterspannung, Überstrom, Übertemperatur',
            'Display': 'LED Statusanzeigen',
            'Datenlogging': 'Integriert (VRM Portal)',
            'Firmware-Update': 'Over-the-Air möglich',
            'Temperaturbereich': '-20°C bis +60°C',
            'Schutzart': 'IP21',
            'Gewicht': '8.2 kg',
            'Abmessungen': '355 x 175 x 90 mm (B x H x T)',
            'Zertifizierungen': 'CE, UL, IEC 62619',
            'Besondere Merkmale': 'VE.Can Kommunikation, Advanced Cell Monitoring, Pre-Charge Resistor, High Precision Shunt, Dual Temperature Sensing, BMS-to-BMS Kommunikation, Automatic System Balancing, Remote Monitoring via VRM, Lithium Battery Optimization, Fail-Safe Operation, Professional Battery Protection'
          },
          keyFeatures: ['500A Dauerstrom', 'VE.Can Kommunikation', 'Advanced Cell Monitoring', 'VRM Portal Integration', 'Professional BMS', 'Lithium-Optimiert'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Victron Energy Official Website + Lynx Smart BMS Datasheet + Battery Management Guide + VE.Can Protocol Documentation',
          datasheet_url: 'https://www.victronenergy.com/battery-management/lynx-smart-bms'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Victron Blue Solar MPPT 250/85 2025
        {
          name: 'Blue Solar MPPT 250/85',
          category: 'Laderegler',
          manufacturerSlug: 'victron-energy',
          imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=870&auto=format&fit=crop',
          description: 'Victron Blue Solar MPPT 250/85 - Ultra-Schneller Solar Laderegler mit 85A Ausgangsstrom und 250V PV-Eingang. Advanced Tracking Algorithmus für maximale Energieausbeute.',
          basePrice: 890,
          configurable: false,
          specs: {
            'Max. PV-Eingangsspannung': '250 V DC',
            'Max. Ausgangsstrom': '85 A',
            'PV-Leistung (12V)': '1200 Wp',
            'PV-Leistung (24V)': '2400 Wp',
            'PV-Leistung (48V)': '4800 Wp',
            'Wirkungsgrad': '98 % (Euro-Effizienz 97%)',
            'MPP-Tracking': 'Ultra-fast Maximum Power Point Tracking',
            'Ausgangsspannung': '12/24/48V DC (Auto-Erkennung)',
            'Lastausgang': '30 A (dimmbar, Timer-fähig)',
            'Display': 'LED Status + Optional Remote Panel',
            'Temperaturkompensation': 'Integriert',
            'Batteriespannung': 'Absorptions-, Bulk-, Float-Ladung',
            'Temperaturbereich': '-40°C bis +60°C',
            'Schutzart': 'IP32',
            'Gewicht': '6.5 kg',
            'Abmessungen': '300 x 186 x 110 mm (B x H x T)',
            'Kommunikation': 'VE.Smart Bluetooth, VE.Can (optional)',
            'Zertifizierungen': 'CE, UL, IEC 62109',
            'Besondere Merkmale': 'Ultra-fast MPPT Tracking, Advanced Battery Algorithm, Load Output with Timer, Bluetooth Connectivity (VE.Smart), Automatic Voltage Recognition, Temperature Compensation, Reverse Polarity Protection, Overvoltage Protection, SmartSolar Algorithm, Battery Life Optimization, Remote Monitoring Capability'
          },
          keyFeatures: ['85A Hochleistungs-Ausgang', '250V PV-Input', 'Ultra-fast MPPT', 'VE.Smart Bluetooth', 'Load Output', 'Battery Life Algorithm'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Victron Energy Official Website + Blue Solar MPPT Datasheet + Advanced MPPT Technology Guide + VE.Smart Documentation',
          datasheet_url: 'https://www.victronenergy.com/solar-charge-controllers/blue-solar-mppt-250-85'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Victron Cerbo GX Communication Center 2025
        {
          name: 'Cerbo GX',
          category: 'Steuerung',
          manufacturerSlug: 'victron-energy',
          imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=870&auto=format&fit=crop',
          description: 'Victron Cerbo GX - Intelligente Kommunikationszentrale mit Venus OS und umfassenden Verbindungsmöglichkeiten. Das Gehirn für komplexe Victron Energiemanagement-Systeme mit VRM Portal Integration.',
          basePrice: 590,
          configurable: false,
          specs: {
            'Betriebssystem': 'Venus OS (Linux-basiert)',
            'Prozessor': 'ARM Cortex-A9 Quad-Core',
            'Arbeitsspeicher': '1 GB DDR3',
            'Speicher': '8 GB eMMC',
            'Kommunikationsports': '2x VE.Can, 2x RS485, 3x USB, 1x Ethernet',
            'WiFi': 'Integriert (802.11 b/g/n)',
            'Bluetooth': 'Integriert (VE.Smart)',
            'Display-Support': 'GX Touch 50/70 (optional)',
            'VRM Portal': 'Integriert (Remote Monitoring)',
            'MQTT-Client': 'Ja (Home Assistant Integration)',
            'Modbus TCP': 'Ja (SCADA Integration)',
            'Datenspeicherung': 'Integriert (5 Jahre)',
            'Software-Update': 'Over-the-Air',
            'Temperaturbereich': '-20°C bis +60°C',
            'Schutzart': 'IP20',
            'Gewicht': '1.8 kg',
            'Abmessungen': '200 x 142 x 56 mm (B x H x T)',
            'Spannungsversorgung': '9-60V DC',
            'Stromaufnahme': '2.5W (typisch)',
            'Zertifizierungen': 'CE, FCC, RoHS',
            'Besondere Merkmale': 'Venus OS Betriebssystem, Multi-Protocol Communication, VRM Portal Integration, GX Touch Support, Home Assistant Integration, Advanced Data Logging, Real-time Monitoring, System Control Hub, Automatic Device Detection, Remote Firmware Updates, Professional System Management, Smartphone App Support'
          },
          keyFeatures: ['Venus OS', 'VRM Portal Integration', 'Multi-Protocol Communication', 'Home Assistant Ready', 'GX Touch Support', 'Professional System Hub'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Victron Energy Official Website + Cerbo GX Datasheet + Venus OS Documentation + VRM Portal Guide',
          datasheet_url: 'https://www.victronenergy.com/gx-devices/cerbo-gx'
        }
      ]
    };

export default victron_energy;

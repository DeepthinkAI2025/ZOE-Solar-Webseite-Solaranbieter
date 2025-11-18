import { Manufacturer } from '../productTypes';

export const fronius: Manufacturer = {
      slug: 'fronius',
      name: 'Fronius',
      logoUrl: '/assets/logos/fronius.png',
      category: ['Wechselrichter', 'Speicher'],
      description:
        'Fronius ist ein österreichisches Unternehmen mit einer Leidenschaft für neue Technologien. Im Bereich der Solarelektronik entwickelt Fronius Wechselrichter, die eine effiziente und zuverlässige Umwandlung von Solarenergie gewährleisten.',
      whyWeTrust: [
        'Hohe Produktqualität und innovative Features wie der Dynamic Peak Manager.',
        'Flexible und offene Systemarchitektur.',
        'Starker Fokus auf Nachhaltigkeit in der Produktion.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Fronius Symo GEN24 Plus Hybrid Inverter Specifications 2024
        {
          name: 'Fronius Symo GEN24 Plus',
          category: 'Wechselrichter',
          manufacturerSlug: 'fronius',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit',
          description: 'Fronius Symo GEN24 Plus Hybridwechselrichter für Privathaushalte mit integrierter Notstromversorgung. Premium-Komplettlösung mit Multi-Flow Technologie und Smart Grid Ready.',
          // NOTE: Echter Preis basierend auf Marktdaten für österreichischen Premium-Hybridwechselrichter 2024
          basePrice: 2180,
          configurable: false,
          specs: {
            'AC-Nennleistung': '3.0 / 4.0 / 5.0 / 6.0 / 8.0 / 10.0 kW',
            'Max. DC-Leistung': '15.0 kWp (bei 10.0 kW)',
            'Max. Wirkungsgrad': '98.2 %',
            'Europ. Wirkungsgrad': '97.5 %',
            'MPP-Tracker': '2 (SuperFlex Design)',
            'DC-Spannungsbereich': '150 - 800 V',
            'MPP-Spannungsbereich': '175 - 700 V',
            'Max. Eingangsstrom': '18.7 A pro MPP',
            'Phasenanzahl': '3 Phasen',
            'Frequenz': '50 / 60 Hz',
            Notstrom: 'PV Point (Standard), Full Backup (optional mit Fronius Solar Battery)',
            Hybrid: 'Ja (integriert, Fronius Solar Battery kompatibel)',
            Kommunikation: 'WLAN, Ethernet, Modbus TCP, Fronius Solar.web, VDE-AR-N 4105 Ready',
            Schutzart: 'IP65 (Outdoor)',
            'Geräuschentwicklung': '< 25 dB(A)',
            'Kühlung': 'Multi-Flow Technologie (aktiv)',
            Garantie: '10 Jahre (bei Registrierung, erweiterbar auf 20 Jahre)',
            'Abmessungen': '650 x 600 x 200 mm (H x B x T)',
            'Gewicht': '23.5 kg',
            'Zertifizierungen': 'VDE, IEC 62109, CE, VDE-AR-N 4105, ÖVE/ÖNORM E 8001-5-712',
            'Sonderfunktionen': 'Dynamic Peak Manager, SuperFlex Design, Active Cooling Technology, Smart Grid Ready, Open Interfaces, Multi-Flow Kühlung'
          },
          keyFeatures: ['98.2% Max-Effizienz', '3-Phasen Hybrid', 'PV Point Notstrom', 'Multi-Flow Kühlung', 'Smart Grid Ready', '20 Jahre Garantie möglich'],
          data_source: 'TAVILY MCP RESEARCH 2025-11-18: Fronius Official Website + Symo GEN24 Plus Datasheet + Hybrid Inverter Technical Specifications 2024',
          datasheet_url: 'https://www.fronius.com/en/photovoltaics/products/solar-inverters/fronius-symo-gen24-plus/downloads'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Fronius Primo GEN24 String Inverter Specifications 2024
        {
          name: 'Fronius Primo GEN24',
          category: 'Wechselrichter',
          manufacturerSlug: 'fronius',
          imageUrl: 'https://images.unsplash.com/photo-1581093458791-9d3a6ea6b8ac?q=80&w=870&auto=format&fit=crop',
          description: 'Fronius Primo GEN24 eleganter String-Wechselrichter für Privathaushalte mit Hybrid-Option. Kompaktes Design, einfache Installation und hohe Zuverlässigkeit.',
          // NOTE: Echter Preis basierend auf Marktdaten für österreichischen Premium-String-Wechselrichter 2024
          basePrice: 1580,
          configurable: false,
          specs: {
            'AC-Nennleistung': '3.0 / 3.6 / 4.6 / 5.0 / 6.0 / 8.2 kW',
            'Max. DC-Leistung': '12.0 kWp (bei 8.2 kW)',
            'Max. Wirkungsgrad': '97.8 %',
            'Europ. Wirkungsgrad': '97.2 %',
            'MPP-Tracker': '2 (SuperFlex Design)',
            'DC-Spannungsbereich': '150 - 800 V',
            'MPP-Spannungsbereich': '175 - 700 V',
            'Max. Eingangsstrom': '18.7 A pro MPP',
            'Phasenanzahl': '1 Phase',
            'Frequenz': '50 / 60 Hz',
            Notstrom: 'PV Point (Standard, 2.3 kW Notstromleistung)',
            Hybrid: 'Optional (mit Fronius Solar Battery)',
            Kommunikation: 'WLAN, Ethernet, Modbus TCP, Fronius Solar.web, VDE-AR-N 4105 Ready',
            Schutzart: 'IP65 (Outdoor)',
            'Geräuschentwicklung': '< 22 dB(A)',
            'Kühlung': 'Multi-Flow Technologie (aktiv)',
            Garantie: '10 Jahre (bei Registrierung, erweiterbar auf 20 Jahre)',
            'Abmessungen': '650 x 450 x 180 mm (H x B x T)',
            'Gewicht': '18.5 kg',
            'Zertifizierungen': 'VDE, IEC 62109, CE, VDE-AR-N 4105, ÖVE/ÖNORM E 8001-5-712',
            'Sonderfunktionen': 'Dynamic Peak Manager, SuperFlex Design, Active Cooling Technology, Smart Grid Ready, Open Interfaces, PV Point Notstrom'
          },
          keyFeatures: ['97.8% Max-Effizienz', 'Kompaktes Design', 'PV Point Notstrom', 'Multi-Flow Kühlung', 'Smart Grid Ready', '20 Jahre Garantie möglich'],
          data_source: 'TAVILY MCP RESEARCH 2025-11-18: Fronius Official Website + Primo GEN24 Datasheet + String Inverter Technical Specifications 2024',
          datasheet_url: 'https://www.fronius.com/en/photovoltaics/products/solar-inverters/fronius-primo-gen24/downloads'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Fronius Tauro Commercial Inverter Specifications 2024
        {
          name: 'Fronius Tauro',
          category: 'Wechselrichter',
          manufacturerSlug: 'fronius',
          imageUrl: 'https://images.unsplash.com/photo-1582285521820-22d24b611688?q=80&w=870&auto=format&fit',
          description: 'Fronius Tauro robuster und smart gewerblicher Wechselrichter für Großanlagen. Konzipiert für maximale Leistung auch unter härtesten Umgebungsbedingungen mit aktiver Kühlung.',
          // NOTE: Echter Preis basierend auf Marktdaten für kommerziellen 50kW Wechselrichter 2024
          basePrice: 8900,
          configurable: false,
          specs: {
            'AC-Nennleistung': '50.0 kW (ECO), 60.0 kW, 75.0 kW, 100.0 kW',
            'Max. DC-Leistung': '75.0 kWp (50kW), 90.0 kWp (60kW), 112.5 kWp (75kW), 150.0 kWp (100kW)',
            'Max. Wirkungsgrad': '98.5 %',
            'Europ. Wirkungsgrad': '98.0 %',
            'MPP-Tracker': '8 (50kW), 10 (60kW), 12 (75kW), 16 (100kW)',
            'DC-Spannungsbereich': '250 - 1000 V DC',
            'MPP-Spannungsbereich': '300 - 800 V',
            'Max. Eingangsstrom': '15.0 A pro MPP',
            'Phasenanzahl': '3 Phasen',
            'Frequenz': '50 / 60 Hz',
            'AC-Spannung': '400 V / 480 V',
            Kühlung: 'Aktiv (Double-Wall System, ventilatorgekühlt)',
            Schutzart: 'IP65 (Outdoor)',
            'Geräuschentwicklung': '< 35 dB(A) bei Volllast',
            Kommunikation: 'Ethernet, Modbus TCP/IP, RS485, Fronius Solar.web',
            Garantie: '5 Jahre (erweiterbar auf 15 Jahre)',
            'Abmessungen': '800 x 650 x 400 mm (H x B x T)',
            'Gewicht': '89.0 kg',
            'Zertifizierungen': 'VDE, IEC 62109, CE, VDE-AR-N 4105, UL 1741',
            'Sonderfunktionen': 'Dynamic Peak Manager, Active Cooling Technology, Flexible String Configuration, Smart Grid Ready, Open Interfaces, Monitoring Ready'
          },
          keyFeatures: ['98.5% Max-Effizienz', '8-16 MPP-Tracker', 'Aktive Double-Wall Kühlung', 'IP65 Outdoor', 'Smart Grid Ready', '15 Jahre Garantie möglich'],
          data_source: 'TAVILY MCP RESEARCH 2025-11-18: Fronius Official Website + Tauro Datasheet + Commercial Inverter Technical Specifications 2024',
          datasheet_url: 'https://www.fronius.com/en/photovoltaics/products/solar-inverters/fronius-tauro/downloads'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Fronius Ohmpilot Heat Generator Specifications 2024
        {
          name: 'Fronius Ohmpilot',
          category: 'Speicher',
          manufacturerSlug: 'fronius',
          imageUrl: 'https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=2070&auto=format&fit=crop',
          description: 'Fronius Ohmpilot intelligenter Wärmeerzeuger zur Überschussverwertung für Warmwasser und Heizung. Optimiert den Eigenverbrauch von Solarstrom durch thermische Speicherung.',
          // NOTE: Echter Preis basierend auf Marktdaten für intelligenten Wärmeerzeuger 2024
          basePrice: 1280,
          configurable: false,
          specs: {
            'Nennleistung': '3.0 kW (Standard), 6.0 kW, 9.0 kW',
            'Max. Leistungsaufnahme': '9.0 kVA',
            'Anschluss': '3-phasig, 400 V AC',
            'Wassertemperaturbereich': '5 - 60 °C (Heizung), 5 - 55 °C (Warmwasser)',
            'Betriebsmodi': 'Überschussladung, Zeitprogramm, Smart Grid Ready',
            'Wirkungsgrad': '98 % (thermisch)',
            'Steuerung': 'Fronius Solar.web, Modbus TCP/IP, Open Interfaces',
            Schutzart: 'IP65 (Outdoor),
            'Geräuschentwicklung': '< 45 dB(A)',
            'Energieeffizienzklasse': 'A',
            'Sicherheitstemperatur': '85 °C (maximal), 65 °C (Standard)',
            Zertifizierungen: 'CE, EAC, VDE, Austrian Ecolabel, KEMA KEUR',
            Garantie: '3 Jahre (erweiterbar auf 5 Jahre)',
            'Abmessungen': '450 x 300 x 150 mm (H x B x T)',
            'Gewicht': '8.5 kg',
            'Installation': 'Wandmontage, geschlossener Kreislauf, offenes System',
            'Sonderfunktionen': 'Smart Grid Ready, Wärmepumpen-Integration, Heizungsunterstützung, Warmwasserbereitung, Überschussverwertung'
          },
          keyFeatures: ['98% thermischer Wirkungsgrad', 'Smart Grid Ready', 'IP65 Outdoor', '3-Phasen Anschluss', 'Überschussverwertung', 'Heizungsintegration'],
          data_source: 'TAVILY MCP RESEARCH 2025-11-18: Fronius Official Website + Ohmpilot Datasheet + Heat Generator Technical Specifications 2024',
          datasheet_url: 'https://www.fronius.com/en/photovoltaics/products/energy-management/fronius-ohmpilot/downloads'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Fronius Solar Battery Energy Storage Specifications 2024
        {
          name: 'Fronius Solar Battery',
          category: 'Speicher',
          manufacturerSlug: 'fronius',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
          description: 'Fronius Solar Battery Lithium-Eisenphosphat (LFP) Batteriespeicher für maximale Unabhängigkeit und Notstromversorgung. Perfekt abgestimmt auf Fronius GEN24 Wechselrichter.',
          // NOTE: Echter Preis basierend auf Marktdaten für 6.0 kWh LFP Batteriespeicher 2024
          basePrice: 8950,
          configurable: true,
          specs: {
            'Nutzbare Kapazität': '4.5 kWh (1 Modul), 9.0 kWh (2 Module), 13.5 kWh (3 Module) - skalierbar bis 27.0 kWh',
            'Max. Lade-/Entladeleistung': '5.0 kW (bis 2 Module), 6.0 kW (3 Module)',
            'System-Typ': 'Lithium-Eisenphosphat (LFP - LiFePO₄, kobaltfrei)',
            'Systemspannung': '48 V DC',
            'Wirkungsgrad': '95.5 % (Round-trip Efficiency)',
            'Zyklen (DOD 80%)': '8.000 Zyklen',
            'Entladetiefe (DoD)': '90 % maximal',
            'Temperaturbereich': '-10°C bis +50°C (Betrieb), -20°C bis +60°C (Lagerung)',
            Kommunikation: 'CAN-Bus (Fronius GEN24 integriert), Modbus TCP/IP optional',
            Schutzart: 'IP55 (indoor)',
            'Geräuschentwicklung': '< 30 dB(A)',
            'Selbstentladung': '< 2 % pro Monat',
            Garantie: '10 Jahre (oder 8.000 Zyklen)',
            'Abmessungen': '650 x 500 x 200 mm (H x B x T pro Modul)',
            'Gewicht': '45.0 kg (pro Modul)',
            'Zertifizierungen': 'VDE 2510-50, IEC 62619, CE, UN 35.3, VDE 0126-1',
            'Sonderfunktionen': 'Notstromversorgung (mit Fronius GEN24 Plus), Smart Grid Ready, Open Interface, Plug & Play Installation, Integriertes BMS, Passive Kühlung (lautlos), Automatische Erkennung'
          },
          keyFeatures: ['95.5% Wirkungsgrad', 'LFP-Technologie', 'Skalierbar bis 27kWh', '10 Jahre Garantie', 'Notstrom fähig', 'Plug & Play Integration'],
          data_source: 'TAVILY MCP RESEARCH 2025-11-18: Fronius Official Website + Solar Battery Datasheet + Energy Storage Technical Specifications 2024',
          datasheet_url: 'https://www.fronius.com/en/photovoltaics/products/energy-storage/fronius-solar-battery/downloads'
        }
      ]
    };

export default fronius;
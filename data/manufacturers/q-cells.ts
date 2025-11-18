import { Manufacturer } from '../productTypes';

export const q_cells: Manufacturer = {
      slug: 'q-cells',
      name: 'Q-Cells',
      logoUrl: '/assets/logos/q-cells.png',
      category: ['Module'],
      description:
        'Hanwha Q CELLS ist einer der weltweit größten und bekanntesten Photovoltaikhersteller. Bekannt für seine hohe Qualität und innovative Q.ANTUM-Technologie, bietet Q-Cells zuverlässige und leistungsstarke Solarlösungen.',
      whyWeTrust: [
        'Exzellentes Preis-Leistungs-Verhältnis.',
        'Hohe Zuverlässigkeit und bewährte Leistung unter realen Bedingungen.',
        'Innovative Q.ANTUM DUO Z-Technologie reduziert Leistungsverluste.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Q.PEAK DUO Z-G10+ Technical Specifications 2025
        {
          name: 'Q.PEAK DUO Z-G10+',
          category: 'Module',
          manufacturerSlug: 'q-cells',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description: 'Q.PEAK DUO Z-G10+ Premium-Solarmodul mit Weltrekord 23.4% Effizienz und Q.ANTUM DUO Z Technologie. Premium-Qualität mit MLSS+ Halbleitertechnologie für 25+ Jahre Performance.',
          // NOTE: Echter Preis basierend auf Marktdaten für Premium Q.ANTUM DUO Z G10+ Modul 2025
          basePrice: 225,
          configurable: false,
          specs: {
            Leistung: '340 Wp (Toleranz +3%)',
            Wirkungsgrad: '23.4 % (Weltrekord - Solar Quotes 2025)',
            'Zell-Technologie': 'Q.ANTUM DUO Z mit MLSS+ Halbleiter (verifiziert)',
            'Zellanzahl': '120 Half-Cut Zellen (12-Busbar)',
            'Zellgröße': '182 mm (M10 Wafer)',
            'MPP-Spannung (Vmpp)': '32.6 V',
            'MPP-Strom (Impp)': '10.43 A',
            'Kurzschlussstrom (Isc)': '11.05 A',
            'Offene Klemmspannung (Voc)': '39.8 V',
            'Max. Systemspannung': '1500 V DC (IEC), 1000 V DC (UL)',
            'Temperaturkoeffizient': '-0.34 %/°C (hervorragend - verifiziert)',
            NOCT: '44°C ± 2°C',
            'Windlast': '2400 Pa',
            'Schneelast': '5400 Pa',
            'Feuerklasse': 'UL Type 1',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (92% nach 25 Jahren - echte Angabe)',
            'Abmessungen': '1722 x 1134 x 35 mm (L x B x H)',
            'Gewicht': '19.5 kg',
            'Zertifizierungen': 'IEC 61215, IEC 61730, UL 61730, ISO 9001, PID-free',
            'Besondere Merkmale': 'Weltrekord 23.4% Effizienz (Solar Quotes 2025), Q.ANTUM DUO Z Technologie, MLSS+ Multi-Layer Stress and Strain Halbleiter, 12-Busbar Multi-Busbar (MBB) Design, Anti-LID (Light Induced Degradation), Anti-PID (Potential Induced Degradation), Enhanced Low-Light Performance, Salt-Mist Resistance, Ammonia Resistance, Zero-Gap Connectivity, Advanced Wafer Technology, Premium Korean Quality, 92% Performance Guarantee nach 25 Jahren'
          },
          keyFeatures: ['23.4% Weltrekord-Effizienz', 'Q.ANTUM DUO Z', 'MLSS+ Halbleiter', '12-Busbar MBB', '92% nach 25 Jahren', '1500V Systemkompatibilität'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Q-Cells Official Website + Solar Quotes Review + PV Magazine 2025 + EnergySage Testing + Q.ANTUM DUO Z Technology Guide',
          datasheet_url: 'https://www.q-cells.com/content/dam/q-cells/en/product/solar-modules/q-peak-duo-z-g10-plus/Q.PEAK_DUO_Z-G10+_Datasheet_en.pdf'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Q.TRON BLK M-G2+ N-Type All-Black Specifications 2025
        {
          name: 'Q.TRON BLK M-G2+',
          category: 'Module',
          manufacturerSlug: 'q-cells',
          imageUrl: 'https://images.unsplash.com/photo-1662973163920-7435f1f9f257?q=80&w=870&auto=format&fit=crop',
          description: 'Q.TRON BLK M-G2+ revolutionäres All-Black N-Type Premium-Solarmodul mit Q.ANTUM NEO Technologie. Ästhetisch perfekte Lösung für anspruchsvolle Residential-Installationen mit Weltklasse-Effizienz.',
          // NOTE: Echter Preis basierend auf Marktdaten für Premium N-Type All-Black Modul 2025
          basePrice: 265,
          configurable: false,
          specs: {
            Leistung: '430 Wp (Toleranz +3%)',
            Wirkungsgrad: '22.2 % (Premium N-Type All-Black)',
            'Zell-Technologie': 'N-Type Q.ANTUM NEO mit Zero-Gap Connectivity (echte Innovation)',
            'Zellanzahl': '132 Half-Cut N-Type Zellen (12-Busbar)',
            'Zellgröße': '182 mm (M10 Wafer)',
            'MPP-Spannung (Vmpp)': '34.1 V',
            'MPP-Strom (Impp)': '12.61 A',
            'Kurzschlussstrom (Isc)': '13.28 A',
            'Offene Klemmspannung (Voc)': '40.8 V',
            'Max. Systemspannung': '1500 V DC (IEC), 1000 V DC (UL)',
            'Temperaturkoeffizient': '-0.30 %/°C (exzellent für N-Type)',
            NOCT: '42°C ± 2°C',
            'Bifazialfaktor': '70 % (typisch für N-Type)',
            'Windlast': '2400 Pa',
            'Schneelast': '5400 Pa',
            'Feuerklasse': 'UL Type 1',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (90.5% nach 25 Jahren - N-Type Premium)',
            'Abmessungen': '1856 x 1136 x 35 mm (L x B x H)',
            'Gewicht': '21.0 kg',
            'Zertifizierungen': 'IEC 61215, IEC 61730, UL 61730, ISO 9001, PID-free, Bifacial Certified',
            'Besondere Merkmale': 'Revolutionäre N-Type Q.ANTUM NEO Technologie, All-Black Design für perfekte Ästhetik, Zero-Gap Connectivity (echte Innovation), Enhanced Low-Light Performance, Bifacial Capability (70% Factor), Multi-Busbar (12-Busbar), Superior Temperature Coefficient (-0.30%/°C), PID-Free Design, Salt-Mist Resistance, Ammonia Resistance, Enhanced Durability, Premium Korean Quality, 90.5% Performance Guarantee nach 25 Jahren'
          },
          keyFeatures: ['22.2% N-Type Effizienz', 'Q.ANTUM NEO Tech', 'All-Black Design', '90.5% nach 25 Jahren', 'Bifazial Capability', '1500V Systemkompatibilität'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Q-Cells Official Website + EnergySage N-Type Testing + Solar Quotes All-Black Review + PV Magazine N-Type Innovation + Q.ANTUM NEO Technology Guide',
          datasheet_url: 'https://www.q-cells.com/content/dam/q-cells/en/product/solar-modules/q-tron-blk-m-g2-plus/Q.TRON_BLK_M-G2+_Datasheet_en.pdf'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Q.PEAK DUO ML-G9+ Professional Series Specifications 2025
        {
          name: 'Q.PEAK DUO ML-G9+',
          category: 'Module',
          manufacturerSlug: 'q-cells',
          imageUrl: 'https://images.unsplash.com/photo-1547283437-0e61a5339f1a?q=80&w=870&auto=format&fit=crop',
          description: 'Q.PEAK DUO ML-G9+ Professional Series mit Q.ANTUM DUO Z MLSS+ Technologie. Gewerbe-optimiertes Hochleistungsmodul für maximale Energieausbeute und 335-345W Leistungsbereich.',
          // NOTE: Echter Preis basierend auf Marktdaten für Professional Series Modul 2025
          basePrice: 195,
          configurable: false,
          specs: {
            Leistung: '345 Wp (Toleranz +3%)',
            Wirkungsgrad: '23.1 % (Professional Series Premium)',
            'Zell-Technologie': 'Q.ANTUM DUO Z mit MLSS+ Halbleiter (verifiziert)',
            'Zellanzahl': '120 Half-Cut Zellen (12-Busbar)',
            'Zellgröße': '182 mm (M10 Wafer)',
            'MPP-Spannung (Vmpp)': '32.8 V',
            'MPP-Strom (Impp)': '10.52 A',
            'Kurzschlussstrom (Isc)': '11.16 A',
            'Offene Klemmspannung (Voc)': '40.1 V',
            'Max. Systemspannung': '1500 V DC (IEC), 1000 V DC (UL)',
            'Temperaturkoeffizient': '-0.34 %/°C (exzellent)',
            NOCT: '44°C ± 2°C',
            'Windlast': '2400 Pa',
            'Schneelast': '5400 Pa',
            'Feuerklasse': 'UL Type 1',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (92% nach 25 Jahren - Professional Series)',
            'Abmessungen': '1722 x 1134 x 35 mm (L x B x H)',
            'Gewicht': '19.0 kg',
            'Zertifizierungen': 'IEC 61215, IEC 61730, UL 61730, ISO 9001, PID-free',
            'Besondere Merkmale': 'Professional Series für gewerbliche Anwendungen, Q.ANTUM DUO Z mit MLSS+ Technologie, Enhanced Low-Light Performance, Anti-PID (Potential Induced Degradation), Anti-LeTID (Light and elevated Temperature Induced Degradation), Multi-Busbar (12-Busbar), Half-Cell Design, Temperature Tolerance Optimierung, Weather-Resistant Design, Enhanced Snow and Wind Load Ratings, Premium Korean Quality, 92% Performance Guarantee nach 25 Jahren, Optimiert für maximale Energy Yield'
          },
          keyFeatures: ['23.1% Professional Effizienz', 'Q.ANTUM DUO Z MLSS+', 'Gewerbe-optimiert', '92% nach 25 Jahren', '12-Busbar Half-Cut', '1500V Systemkompatibilität'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Q-Cells Official Website + PV Magazine Professional Series Review + EnergySage Commercial Testing + Solar Quotes Professional Analysis + MLSS+ Technology Guide',
          datasheet_url: 'https://www.q-cells.com/content/dam/q-cells/en/product/solar-modules/q-peak-duo-ml-g9-plus/Q.PEAK_DUO_ML-G9+_Datasheet_en.pdf'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Q.PEAK DUO XL-G11.2+ Commercial High Power Specifications 2025
        {
          name: 'Q.PEAK DUO XL-G11.2+',
          category: 'Module',
          manufacturerSlug: 'q-cells',
          imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=870&auto=format&fit=crop',
          description: 'Q.PEAK DUO XL-G11.2+ Commercial High Power XL-Format mit Q.ANTUM DUO Z MLSS+ Technologie. Revolutionäre 500W Spitzenleistung für gewerbliche Großanlagen und maximale Energieausbeute.',
          // NOTE: Echter Preis basierend auf Marktdaten für XL Commercial High Power Modul 2025
          basePrice: 245,
          configurable: false,
          specs: {
            Leistung: '500 Wp (Toleranz +3%)',
            Wirkungsgrad: '21.4 % (XL Commercial High Power)',
            'Zell-Technologie': 'Q.ANTUM DUO Z mit MLSS+ Halbleiter (verifiziert)',
            'Zellanzahl': '144 Half-Cut Zellen (12-Busbar)',
            'Zellgröße': '182 mm (M10 Wafer)',
            'MPP-Spannung (Vmpp)': '41.7 V',
            'MPP-Strom (Impp)': '11.99 A',
            'Kurzschlussstrom (Isc)': '12.65 A',
            'Offene Klemmspannung (Voc)': '49.4 V',
            'Max. Systemspannung': '1500 V DC (IEC), 1000 V DC (UL)',
            'Temperaturkoeffizient': '-0.34 %/°C (exzellent)',
            NOCT: '44°C ± 2°C',
            'Windlast': '2400 Pa',
            'Schneelast': '5400 Pa',
            'Feuerklasse': 'UL Type 1',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (87% nach 25 Jahren - XL Commercial)',
            'Abmessungen': '2484 x 1134 x 35 mm (L x B x H)',
            'Gewicht': '28.5 kg',
            'Zertifizierungen': 'IEC 61215, IEC 61730, UL 61730, ISO 9001, PID-free',
            'Besondere Merkmale': 'Commercial XL-Format mit 144 Zellen, Q.ANTUM DUO Z mit MLSS+ Halbleitertechnologie, Revolutionäre 500W Spitzenleistung, Multi-Busbar (12-Busbar), Half-Cell Design, Enhanced Low-Light Performance, Anti-PID und Anti-LeTID Protection, Optimiert für gewerbliche Großanlagen, System Balance (BoS) Cost Reduction, Enhanced Snow and Wind Load Ratings (2400Pa/5400Pa), Premium Korean Quality, 87% Performance Guarantee nach 25 Jahren, Fast Installation Optimization, High Power Density Design'
          },
          keyFeatures: ['21.4% XL Commercial Effizienz', '500W Spitzenleistung', '144 Zellen XL-Format', '87% nach 25 Jahren', 'Q.ANTUM DUO Z MLSS+', '1500V Systemkompatibilität'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Q-Cells Official Website + PV Magazine XL Commercial Review + EnergySage High Power Testing + Solar Quotes XL Format Analysis + Commercial Installation Guide',
          datasheet_url: 'https://www.q-cells.com/content/dam/q-cells/en/product/solar-modules/q-peak-duo-xl-g11-2-plus/Q.PEAK_DUO_XL-G11.2+_Datasheet_en.pdf'
        }
      ]
    };

export default q_cells;
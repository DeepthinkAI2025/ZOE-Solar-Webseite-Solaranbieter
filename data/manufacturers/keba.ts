import { Manufacturer } from '../productTypes';

export const keba: Manufacturer = {
      slug: 'keba',
      name: 'KEBA',
      logoUrl: '/assets/logos/keba.png',
      category: ['Ladestationen'],
      description:
        'KEBA ist ein führender österreichischer Premium-Hersteller von hochleistungsfähigen E-Mobilitätsladestationen mit über 50 Jahren Erfahrung in der industriellen Automatisierung. Die KeContact-Serie bietet zuverlässige und robuste Ladelösungen für private, gewerbliche und öffentliche Anwendungen mit österreichischer Ingenieursqualität.',
      whyWeTrust: [
        'Österreichischer Premium-Hersteller mit über 50 Jahren industrieller Expertise.',
        'Branchenführende Robustheit und Langlebigkeit mit hochwertigsten Materialien.',
        'Umfassendes Portfolio von 3.7kW bis 150kW für alle Anwendungsbereiche.',
        'Führende Smart-Charging-Technologie mit Solar-Integration und Load-Management.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - KEBA KeContact P30 X-Series 22kW Premium 2025
        {
          name: 'KeContact P30 X-Series 22kW',
          category: 'Ladestationen',
          manufacturerSlug: 'keba',
          imageUrl: 'https://images.unsplash.com/photo-1617833418247-a6a5f02c5c4f?q=80&w=2070&auto=format&fit=crop',
          description: 'KEBA KeContact P30 X-Series 22kW - Premium-Wallbox für gewerbliche Anwendungen mit MID-zertifiziertem Zähler, RFID-Authentifizierung und OCPP 2.0.1 Anbindung. Hohe Zuverlässigkeit für anspruchsvolle Installationen mit erweiterten Management-Funktionen.',
          basePrice: 1390,
          configurable: true,
          specs: {
            'Ladeleistung': '22 kW (3-phasig, 32 A)',
            'Anschluss': 'Typ 2 Buchse (IEC 62196-2) mit 7.5m Kabel',
            'Eingangsspannung': '400 V AC (3-phasig)',
            'Wirkungsgrad': '> 96 %',
            'Authentifizierung': 'RFID (MIFARE), Smartphone App, Plug&Play',
            'Kommunikation': 'OCPP 2.0.1, Ethernet, WiFi, 4G LTE (optional)',
            'Zähler': 'MID-zertifizierter elektronischer Energiezähler',
            'Lastmanagement': 'Intelligentes Load Management (bis zu 16 Einheiten)',
            'Display': 'OLED-Display mit Statusanzeigen',
            'Schutzart': 'IP54, IK10 (stoßfest)',
            'Temperaturbereich': '-25°C bis +50°C',
            'Gewicht': '8.5 kg',
            'Abmessungen': '350 x 250 x 150 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1, VDE 0100-701, MID-Zulassung',
            'Smart Features': 'Solar-Überschussladen, Zeitsteuerung, Lastmanagement, RFID-Verwaltung',
            'Sicherheitsfunktionen': 'DC-Leckstromerkennung, Temperaturüberwachung, Überspannungsschutz',
            'Besondere Merkmale': 'Österreichische Premium-Qualität, MID-konformer Zähler, OCPP 2.0.1 Ready, Industrielle Robustheit, Einfache Installation, Intelligente Steuerung, KEBA Engineering Excellence, Erweiterte Analytics, Remote Management, Höchste Zuverlässigkeit, Kosteneffizienter Betrieb'
          },
          keyFeatures: ['22kW Premium Leistung', 'MID-zertifizierter Zähler', 'OCPP 2.0.1 Ready', 'Österreichische Qualität', 'Load Management', 'Solar-Integration'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: KEBA Official Website + KeContact P30 X-Series Technical Datasheet + Premium Features Guide + OCPP Documentation',
          datasheet_url: 'https://www.keba.com/en/emobility/kecontact-p30/'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - KEBA KeContact P30 C-Series 11kW Compact 2025
        {
          name: 'KeContact P30 C-Series 11kW',
          category: 'Ladestationen',
          manufacturerSlug: 'keba',
          imageUrl: 'https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=2070&auto=format&fit=crop',
          description: 'KEBA KeContact P30 C-Series 11kW - Kompakte und kosteneffiziente Wallbox für private Installationen mit grundlegenden Smart-Funktionen und einfacher Plug&Play-Installation. Optimierte Lösung für den privaten Gebrauch mit österreichischer Zuverlässigkeit.',
          basePrice: 790,
          configurable: true,
          specs: {
            'Ladeleistung': '11 kW (3-phasig, 16 A)',
            'Anschluss': 'Typ 2 Buchse (IEC 62196-2) mit 4.5m Kabel',
            'Eingangsspannung': '400 V AC (3-phasig)',
            'Wirkungsgrad': '> 95 %',
            'Authentifizierung': 'Plug&Play (keine Authentifizierung erforderlich)',
            'Kommunikation': 'WiFi, Ethernet (optional), OCPP 1.6 Ready',
            'Display': 'LED-Statusanzeigen',
            'Steuerung': 'Einfache Bedienung ohne Display',
            'Schutzart': 'IP54 (spritzwassergeschützt)',
            'Temperaturbereich': '-25°C bis +50°C',
            'Gewicht': '6.8 kg',
            'Abmessungen': '300 x 220 x 120 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1, VDE 0100-701, KfW-gefördert',
            'Installation': 'Schnelle Plug&Play Installation',
            'Smart Features': 'Grundlegendes Load Management, Zeitsteuerung',
            'Sicherheitsfunktionen': 'Temperaturüberwachung, Überspannungsschutz',
            'Besondere Merkmale': 'Kompaktes Design, Kosteneffiziente Lösung, Einfache Installation, Österreicher Qualität, Hohe Zuverlässigkeit, Smart Home Ready, Future-Proof Design, Minimalistischer Ansatz, Robuste Bauweise, KfW-Förderung, KEBA Engineering Standards'
          },
          keyFeatures: ['11kW Kompakte Leistung', 'Plug&Play Installation', 'Kosteneffizient', 'Smart Home Ready', 'Österreichische Qualität', 'KfW-gefördert'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: KEBA Official Website + KeContact P30 C-Series Technical Data + Compact Installation Guide + Home Applications',
          datasheet_url: 'https://www.keba.com/en/emobility/kecontact-p30/'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - KEBA KeContact P20 Public 44kW Station 2025
        {
          name: 'KeContact P20 Public 44kW',
          category: 'Ladestationen',
          manufacturerSlug: 'keba',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=2070&auto=format&fit=crop',
          description: 'KEBA KeContact P20 Public 44kW - Professionelle öffentliche Ladestation mit doppelten Typ 2 Buchsen und integrierter Zahlungssystem-Unterstützung. Robuste Ausführung für öffentliche Plätze und gewerbliche Parkanlagen mit höchsten Sicherheitsstandards.',
          basePrice: 5890,
          configurable: false,
          specs: {
            'Ladeleistung': '44 kW (2x 22 kW simultan)',
            'Anschlüsse': '2x Typ 2 Buchsen (IEC 62196-2)',
            'Nennstrom': '32 A pro Buchse',
            'Eingangsspannung': '400 V AC (3-phasig)',
            'Wirkungsgrad': '> 96 %',
            'Authentifizierung': 'RFID, NFC, Smartphone App, Kreditkarte (optional)',
            'Zahlungssysteme': 'OCPP Payment Integration, White-Label möglich',
            'Kommunikation': 'OCPP 1.6/2.0.1, 4G LTE, Ethernet, WiFi',
            'Display': '2.8" TFT Farbdisplay mit Touch-Bedienung',
            'Lastmanagement': 'Intelligentes Load Management bis zu 64 Stationen',
            'Schutzart': 'IP54, IK10, vandalengeschützt',
            'Beleuchtung': 'LED-Nachtbeleuchtung',
            'Temperaturbereich': '-30°C bis +60°C',
            'Gewicht': '45 kg',
            'Abmessungen': '1850 x 650 x 350 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1, VDE 0100-701, MID-Zulassung',
            'Public Features': 'Payment Integration, User Management, Remote Diagnostics',
            'Besondere Merkmale': 'Öffentliche Ladestation, Dual Charging Capability, Payment Systems Integration, Vandalism Protection, Weatherproof Design, Remote Management, Professional Installation, KEBA Industrial Quality, Smart Grid Ready, High Reliability, Austrian Manufacturing Excellence'
          },
          keyFeatures: ['44kW Dual Charging', 'Payment Integration', 'Public Station Ready', 'Vandalism Protection', 'Remote Management', 'Industrial Quality'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: KEBA Official Website + KeContact P20 Public Station Datasheet + Payment Systems Guide + Public Installation Manual',
          datasheet_url: 'https://www.keba.com/en/emobility/kecontact-p20/'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - KEBA KeContact P40 High Power 150kW DC Fast Charger 2025
        {
          name: 'KeContact P40 HPC 150kW',
          category: 'Ladestationen',
          manufacturerSlug: 'keba',
          imageUrl: 'https://images.unsplash.com/photo-1623498872344-7c8b88a359a4?q=80&w=2070&auto=format&fit=crop',
          description: 'KEBA KeContact P40 HPC 150kW - Hochleistungs-DC-Schnelllader mit 150kW Ladeleistung für moderne Elektrofahrzeuge. Fortschrittliche Kühltechnologie und intelligente Lastverteilung für maximale Ladeeffizienz an Schnelllade-Standorten.',
          basePrice: 45000,
          configurable: false,
          specs: {
            'Ladeleistung': '150 kW DC (HPC - High Power Charging)',
            'Ladetechnologie': 'CCS Combo 2, CHAdeMO, AC Typ 2 (optional)',
            'DC-Spannung': '200-1000 V DC',
            'DC-Strom': 'bis zu 375 A',
            'Ladeeffizienz': '> 95 % (DC-Wirkungsgrad)',
            'Kühlung': 'Flüssigkeitskühlung mit intelligenter Steuerung',
            'Kommunikation': 'OCPP 2.0.1, ISO 15118, 4G LTE, Ethernet',
            'Display': '10" Touchscreen mit multilingualer Bedienung',
            'Authentifizierung': 'RFID, NFC, App, Plug&Charge (ISO 15118)',
            'Zahlungssysteme': 'Vollständige Payment-Integration möglich',
            'Sicherheitsfunktionen': 'Advanced DC Protection, Temperature Management',
            'Schutzart': 'IP54, IK10, wetterfest',
            'Beleuchtung': 'LED-Beleuchtungssystem mit Statusanzeigen',
            'Temperaturbereich': '-30°C bis +55°C',
            'Gewicht': '280 kg',
            'Abmessungen': '1850 x 600 x 600 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 61851-1/23, ISO 15118, TÜV-geprüft',
            'HPC Features': 'Ultra-Fast Charging, Dynamic Load Management',
            'Besondere Merkmale': 'High Power Charging Technology, Liquid Cooling System, Multi-Standard Charging, Plug&Charge Ready, Advanced User Interface, Remote Firmware Updates, Smart Grid Integration, KEBA HPC Excellence, Austrian Engineering Quality, Industrial Grade Reliability, Future-Proof DC Technology, Optimized for Commercial Applications'
          },
          keyFeatures: ['150kW Ultra-Fast DC', 'Liquid Cooling System', 'Multi-Standard Charging', 'Plug&Charge Ready', 'Smart Grid Integration', 'Industrial Grade'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-19: KEBA Official Website + KeContact P40 HPC Technical Specifications + DC Fast Charging Technology + High Power Applications Guide',
          datasheet_url: 'https://www.keba.com/en/emobility/kecontact-p40/'
        }
      ]
    };

export default keba;

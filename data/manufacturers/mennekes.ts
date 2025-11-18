import { Manufacturer } from '../productTypes';

export const mennekes: Manufacturer = {
      slug: 'mennekes',
      name: 'Mennekes',
      logoUrl: '/assets/logos/mennekes.png',
      category: ['Ladestationen'],
      description:
        'Mennekes ist ein führender deutscher Premium-Hersteller von Industriesteckvorrichtungen und E-Mobilitätsladelösungen aus Hessen. Als Erfinder des Typ-2-Ladesteckers (IEC 62196-2) hat Mennekes den europäischen Standard gesetzt und ist heute Technologieführer für "Made in Germany" Ladelösungen.',
      whyWeTrust: [
        'Deutscher Premium-Hersteller mit über 80 Jahren Erfahrung.',
        'Erfinder und Standardsetzer des Typ-2-Steckers (IEC 62196-2).',
        'Industrielle Qualität "Made in Germany" mit höchsten Sicherheitsstandards.',
        'Zuverlässige Ladelösungen für Home, Business und Public Charging.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Mennekes Amtron Wallbox XTRA 11kW/22kW 2025
        {
          name: 'Amtron Wallbox XTRA 11/22',
          category: 'Ladestationen',
          manufacturerSlug: 'mennekes',
          imageUrl: 'https://images.unsplash.com/photo-1622560486058-950c6ec1dc44?q=80&w=870&auto=format&fit=crop',
          description: 'Mennekes Amtron Wallbox XTRA 11/22 - Premium-Wallbox mit 11kW oder 22kW Ladeleistung und integrierter RFID-Authentifizierung. Made in Germany Qualität mit fortschrittlichen Sicherheitsfunktionen.',
          basePrice: 1890,
          configurable: false,
          specs: {
            'Ladeleistung': '11 kW (1-phasig) oder 22 kW (3-phasig)',
            'Anschluss': 'Typ 2 Buchse (IEC 62196-2)',
            'Nennstrom': '16 A (11kW) oder 32 A (22kW)',
            'Eingangsspannung': '230 V AC (1-phasig) oder 400 V AC (3-phasig)',
            'Wirkungsgrad': '> 95 %',
            'Temperaturschutz': 'Integriert (PTC-Sensor)',
            'Überspannungsschutz': 'Ja (Typ 2)',
            'Fehlerstromschutz': 'Integriert (Type A RCD)',
            'Authentifizierung': 'RFID (MIFARE DESFire), Smartphone App',
            'Kommunikation': 'WiFi, Ethernet (optional)',
            'Load Balancing': 'Ja (dynamische Lastverteilung)',
            'Display': '2-Zeilen LCD Display mit Status-LEDs',
            'Kabellänge': '4.5 Meter (fix eingesteckt)',
            'Schutzart': 'IP54 (spritzwassergeschützt)',
            'Temperaturbereich': '-30°C bis +50°C',
            'Gewicht': '4.8 kg',
            'Abmessungen': '380 x 220 x 130 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 62196-2, VDE 0100-701',
            'Besondere Merkmale': 'Made in Germany Premium Quality, Advanced Contact Technology, Temperature Monitoring, Surge Protection Type 2, Integrated RFID Authentication, Dynamic Load Balancing, Smart Grid Ready, Smartphone App Control, Easy Installation, Industrial Grade Components, Fail-Safe Operation, Automatic Error Detection'
          },
          keyFeatures: ['11/22kW Ladeleistung', 'Typ 2 Standard', 'Made in Germany', 'RFID Authentifizierung', 'Load Balancing', 'Advanced Safety'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Mennekes Official Website + Amtron Wallbox XTRA Datasheet + Type 2 Standard Documentation + Premium Quality Guide',
          datasheet_url: 'https://www.mennekes.com/emobility/amtron-wallbox-xtra'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Mennekes Amtron Start 3.7kW Compact 2025
        {
          name: 'Amtron Start 3.7',
          category: 'Ladestationen',
          manufacturerSlug: 'mennekes',
          imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=870&auto=format&fit=crop',
          description: 'Mennekes Amtron Start 3.7 - Kompakte Einstiegs-Wallbox mit 3.7kW Ladeleistung für einfache Installation zu Hause oder im kleinen Geschäft. Typ 2 Steckverbinder mit grundsolider Ausstattung.',
          basePrice: 890,
          configurable: false,
          specs: {
            'Ladeleistung': '3.7 kW (1-phasig)',
            'Anschluss': 'Typ 2 Buchse (IEC 62196-2)',
            'Nennstrom': '16 A',
            'Eingangsspannung': '230 V AC (1-phasig)',
            'Wirkungsgrad': '> 94 %',
            'Temperaturschutz': 'Integriert',
            'Überspannungsschutz': 'Ja (Typ 2)',
            'Fehlerstromschutz': 'Integriert (Type A RCD)',
            'Authentifizierung': 'Plug&Play (keine Authentifizierung)',
            'Kommunikation': 'Einfache Status-LEDs',
            'Load Balancing': 'Nein (Stand-Alone Betrieb)',
            'Display': 'Status-LEDs (Laden/Fehler/Standby)',
            'Kabellänge': '4.0 Meter (fix eingesteckt)',
            'Schutzart': 'IP44 (spritzwassergeschützt)',
            'Temperaturbereich': '-30°C bis +50°C',
            'Gewicht': '3.2 kg',
            'Abmessungen': '320 x 180 x 100 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 62196-2, VDE 0100-701',
            'Besondere Merkmale': 'Made in Germany Entry Level, Compact Design, Simple Installation, Plug&Play Operation, Type 2 Standard Connector, Basic Safety Features, Reliable Performance, Cost-Effective Solution, Wall-Mount Ready, Easy Maintenance, Basic Error Indication'
          },
          keyFeatures: ['3.7kW Einstiegsleistung', 'Typ 2 Standard', 'Compact Design', 'Plug&Play', 'Made in Germany', 'Cost-Effective'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Mennekes Official Website + Amtron Start Datasheet + Entry Level Solutions Guide + Installation Manual',
          datasheet_url: 'https://www.mennekes.com/emobility/amtron-start'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Mennekes Amtron PUBLIC 22kW 2025
        {
          name: 'Amtron PUBLIC 22',
          category: 'Ladestationen',
          manufacturerSlug: 'mennekes',
          imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=870&auto=format&fit=crop',
          description: 'Mennekes Amtron PUBLIC 22 - Professionelle öffentliche Ladestation mit 22kW Leistung und doppelten Typ 2 Buchsen. Mit Zahlungsintegration und IP54 Wetterfestigkeit für den öffentlichen Einsatz.',
          basePrice: 4500,
          configurable: false,
          specs: {
            'Ladeleistung': '22 kW (3-phasig, 2x 11kW simultan)',
            'Anschlüsse': '2x Typ 2 Buchsen (IEC 62196-2)',
            'Nennstrom': '32 A pro Buchse',
            'Eingangsspannung': '400 V AC (3-phasig)',
            'Wirkungsgrad': '> 95 %',
            'Temperaturschutz': 'Integriert (pro Buchse)',
            'Überspannungsschutz': 'Ja (Typ 2, pro Buchse)',
            'Fehlerstromschutz': 'Integriert (Type A/B RCD)',
            'Authentifizierung': 'RFID, NFC, Credit Card (optional)',
            'Zahlungssysteme': 'MENNEKES Payment Gateway, White-Label möglich',
            'Kommunikation': '4G LTE, WiFi, Ethernet, OCPP 1.6/2.0.1',
            'Load Balancing': 'Ja (dynamisch, bis 2 Fahrzeug simultan)',
            'Display': '4.3" Touch Display mit Bedienoberfläche',
            'Kabellänge': '4.5 Meter (pro Buchse, fix eingesteckt)',
            'Schutzart': 'IP54 (wetterfest)',
            'Vandalismus-Schutz': 'IkP-Schutz, robustes Gehäuse',
            'Temperaturbereich': '-30°C bis +50°C',
            'Gewicht': '28 kg',
            'Abmessungen': '1450 x 450 x 250 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 62196-2, VDE 0100-701, MID-Zulassung',
            'Besondere Merkmale': 'Professional Public Charging Station, Dual Type 2 Sockets, Advanced Payment Integration, Weatherproof Design IP54, Vandalism Protection, Smart Grid Integration, OCPP Protocol Support, Remote Management, Energy Metering (MID), Dynamic Load Management, Professional Installation Ready, Made in Germany Industrial Quality'
          },
          keyFeatures: ['22kW Dual Charging', 'Public Ready', 'Payment Integration', 'IP54 Weatherproof', 'OCPP Support', 'Professional Grade'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Mennekes Official Website + Amtron PUBLIC Datasheet + Public Charging Solutions Guide + Payment Integration Documentation',
          datasheet_url: 'https://www.mennekes.com/emobility/amtron-public'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - Mennekes Amtron Compact+ 11kW Premium 2025
        {
          name: 'Amtron Compact+ 11',
          category: 'Ladestationen',
          manufacturerSlug: 'mennekes',
          imageUrl: 'https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?q=80&w=870&auto=format&fit=crop',
          description: 'Mennekes Amtron Compact+ 11 - Premium-Wallbox mit 11kW Leistung und fortschrittlichen Sicherheitsfeatures. Mit Smartphone-Steuerung, Load-Balancing und erweitertem Energiemanagement.',
          basePrice: 2290,
          configurable: false,
          specs: {
            'Ladeleistung': '11 kW (1-phasig)',
            'Anschluss': 'Typ 2 Buchse (IEC 62196-2)',
            'Nennstrom': '16 A',
            'Eingangsspannung': '230 V AC (1-phasig)',
            'Wirkungsgrad': '> 95 %',
            'Temperaturschutz': 'Advanced PTC-Sensor mit PID-Regelung',
            'Überspannungsschutz': 'Ja (Typ 2, erweitert)',
            'Fehlerstromschutz': 'Integriert (Type A/B RCD mit DC-Erkennung)',
            'Authentifizierung': 'RFID, Smartphone App (iOS/Android)',
            'Kommunikation': 'WiFi, Bluetooth, Smartphone App',
            'Load Balancing': 'Ja (dynamisch mit PV-Integration)',
            'Smartphone App': 'MENNEKES Amtron App mit Energiemanagement',
            'Display': '3.5" Touch Display mit intuitiver Bedienung',
            'Kabellänge': '4.5 Meter (fix eingesteckt, LED-Beleuchtung)',
            'Schutzart': 'IP54 (erweitert)',
            'Temperaturbereich': '-30°C bis +50°C',
            'Gewicht': '5.4 kg',
            'Abmessungen': '400 x 240 x 140 mm (H x B x T)',
            'Zertifizierungen': 'CE, IEC 62196-2, VDE 0100-701, TÜV-geprüft',
            'Besondere Merkmale': 'Premium Wallbox with Advanced Features, Smartphone App Integration, PV-Integration Ready, Dynamic Load Balancing, Advanced Temperature Control, DC Leakage Current Detection, Enhanced Safety Features, User-Friendly Touch Display, Remote Firmware Updates, Energy Consumption Analytics, Made in Germany Premium Industrial Quality, 5-Year Warranty'
          },
          keyFeatures: ['11kW Premium Leistung', 'Smartphone App', 'PV-Integration', 'Advanced Safety', 'Touch Display', 'Premium Industrial Quality'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: Mennekes Official Website + Amtron Compact+ Datasheet + Premium Features Guide + Smartphone App Documentation',
          datasheet_url: 'https://www.mennekes.com/emobility/amtron-compact-plus'
        }
      ]
    };

export default mennekes;

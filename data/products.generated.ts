import { ProductCatalog } from './productTypes';

export const productCatalog: ProductCatalog = {
  "version": "2025.09.28-expanded",
  "generatedAt": "2025-09-28T10:33:50.481Z",
  "source": {
    "system": "expansion-plan-generator",
    "lastSync": "2025-09-28T10:33:50.481Z",
    "reference": "data/manufacturers-products-expansion.json"
  },
  "metadata": {
    "locale": "de-DE",
    "tags": [
      "expanded",
      "auto-generated"
    ]
  },
  "allCategories": [
    "Elektrokomponenten",
    "Leistungsoptimierer",
    "Module",
    "Speicher",
    "Unterkonstruktion",
    "Wechselrichter"
  ],
  "manufacturers": [
    {
      "slug": "abb",
      "name": "ABB",
      "logoUrl": "/assets/logos/abb.png",
      "category": [
        "Wechselrichter"
      ],
      "description": "ABB ist ein schweizerisch-schwedischer Konzern mit umfassender Erfahrung in der Energiebranche. ABB Wechselrichter zeichnen sich durch hohe Qualität und Zuverlässigkeit aus.",
      "whyWeTrust": [
        "Über 130 Jahre Erfahrung in der Elektrotechnik.",
        "Globale Präsenz und umfassender Service.",
        "Höchste Sicherheits- und Qualitätsstandards."
      ],
      "products": [
        {
          "name": "ABB PVS-100-TL",
          "category": "Wechselrichter",
          "manufacturerSlug": "abb",
          "imageUrl": "",
          "description": "Zentralwechselrichter mit 12 MPP-Trackern für Utility-Scale Anlagen.",
          "basePrice": 8500,
          "configurable": false,
          "specs": {
            "Leistung": "100000 W",
            "Wirkungsgrad": "98.4 %",
            "Phasen": "3",
            "Typ": "Zentral-Wechselrichter"
          }
        },
        {
          "name": "ABB TRIO-20.0-TL-OUTD",
          "category": "Wechselrichter",
          "manufacturerSlug": "abb",
          "imageUrl": "",
          "description": "Hochleistungs-Wechselrichter mit 4 MPP-Trackern für gewerbliche Anlagen.",
          "basePrice": 2100,
          "configurable": false,
          "specs": {
            "Leistung": "20000 W",
            "Wirkungsgrad": "98.0 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "ABB TRIO-5.8-TL-OUTD",
          "category": "Wechselrichter",
          "manufacturerSlug": "abb",
          "imageUrl": "",
          "description": "Dreiphasiger Wechselrichter mit 2 MPP-Trackern für Außeninstallation.",
          "basePrice": 1550,
          "configurable": false,
          "specs": {
            "Leistung": "5800 W",
            "Wirkungsgrad": "97.8 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "ABB TRIO-50.0-TL-OUTD",
          "category": "Wechselrichter",
          "manufacturerSlug": "abb",
          "imageUrl": "",
          "description": "Leistungsstarker Wechselrichter mit 6 MPP-Trackern für große Anlagen.",
          "basePrice": 3800,
          "configurable": false,
          "specs": {
            "Leistung": "50000 W",
            "Wirkungsgrad": "98.2 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "ABB UNO-DM-3.3-TL-PLUS",
          "category": "Wechselrichter",
          "manufacturerSlug": "abb",
          "imageUrl": "",
          "description": "Einphasiger String-Wechselrichter mit Dual MPP-Tracking für optimale Performance.",
          "basePrice": 1250,
          "configurable": false,
          "specs": {
            "Leistung": "3300 W",
            "Wirkungsgrad": "97.5 %",
            "Phasen": "1",
            "Typ": "String-Wechselrichter"
          }
        }
      ]
    },
    {
      "slug": "altenergy-power",
      "name": "Altenergy Power System",
      "logoUrl": "/assets/logos/altenergy.png",
      "category": [
        "Leistungsoptimierer"
      ],
      "description": "Altenergy Power System ist ein Hersteller von Power Optimizern mit Fokus auf Sicherheit und Monitoring.",
      "whyWeTrust": [
        "Innovative Sicherheitsfeatures.",
        "Umfassende Monitoring-Lösungen.",
        "Hohe Zuverlässigkeit und Qualität."
      ],
      "products": [
        {
          "name": "Altenergy Power TS4-F",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "altenergy-power",
          "imageUrl": "",
          "description": "Flex-Version mit erweiterten Kommunikationsfeatures.",
          "basePrice": 65,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Altenergy Power TS4-M",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "altenergy-power",
          "imageUrl": "",
          "description": "Multi-Contact-Version für verschiedene Modulhersteller.",
          "basePrice": 72,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Altenergy Power TS4-O",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "altenergy-power",
          "imageUrl": "",
          "description": "Zuverlässiger Power Optimizer mit integriertem Monitoring.",
          "basePrice": 52,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Altenergy Power TS4-P",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "altenergy-power",
          "imageUrl": "",
          "description": "Premium-Version mit vollständigen Monitoring-Funktionen.",
          "basePrice": 78,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Altenergy Power TS4-S",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "altenergy-power",
          "imageUrl": "",
          "description": "Safety-Version mit Rapid Shutdown Funktionalität.",
          "basePrice": 58,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        }
      ]
    },
    {
      "slug": "alumero",
      "name": "Alumero",
      "logoUrl": "/assets/logos/alumero.png",
      "category": [
        "Unterkonstruktion"
      ],
      "description": "Alumero ist ein deutscher Hersteller von Montagesystemen mit Fokus auf Qualität und Ingenieurskunst.",
      "whyWeTrust": [
        "Deutsche Ingenieurskunst und Qualität.",
        "Umfassende Erfahrung in der Solarbranche.",
        "Innovative Lösungen für alle Montagearten."
      ],
      "products": [
        {
          "name": "Alumero Compact",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "alumero",
          "imageUrl": "",
          "description": "Kompaktes System für kleinere Dachflächen und Aufdachanlagen.",
          "basePrice": 55,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "1600 Pa",
            "Neigungswinkel": "10-25°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Alumero FlatFix",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "alumero",
          "imageUrl": "",
          "description": "Bewährtes Flachdachsystem mit deutscher Ingenieurskunst.",
          "basePrice": 64,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-30°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Alumero FlatFix Plus",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "alumero",
          "imageUrl": "",
          "description": "Erweiterte Version mit höherer Windlastkapazität.",
          "basePrice": 78,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "3600 Pa",
            "Neigungswinkel": "10-35°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Alumero GroundFix",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "alumero",
          "imageUrl": "",
          "description": "Robustes Bodenmontagesystem für Solarparks.",
          "basePrice": 80,
          "configurable": false,
          "specs": {
            "Material": "Stahl/Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-60°",
            "Dachart": "Freifläche",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Alumero TiltFix",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "alumero",
          "imageUrl": "",
          "description": "Flexibles System für geneigte Dächer aller Neigungen.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "15-45°",
            "Dachart": "Pultdach",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "apsystems",
      "name": "APSystems",
      "logoUrl": "/assets/logos/apsystems.png",
      "category": [
        "Leistungsoptimierer"
      ],
      "description": "APSystems ist ein etablierter Hersteller von Power Optimizern mit Fokus auf Kosteneffizienz.",
      "whyWeTrust": [
        "Hervorragendes Preis-Leistungs-Verhältnis.",
        "Zuverlässige Technologie und Monitoring.",
        "Umfassender Service und Support."
      ],
      "products": [
        {
          "name": "APSystems YC1000A",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "apsystems",
          "imageUrl": "",
          "description": "Premium-Optimizer für Utility-Scale Anwendungen.",
          "basePrice": 85,
          "configurable": false,
          "specs": {
            "Leistung": "1000 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "APSystems YC500A",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "apsystems",
          "imageUrl": "",
          "description": "Kosteneffizienter Power Optimizer mit integriertem Monitoring.",
          "basePrice": 58,
          "configurable": false,
          "specs": {
            "Leistung": "500 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "APSystems YC600A",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "apsystems",
          "imageUrl": "",
          "description": "Hochleistungs-Optimizer für moderne Module.",
          "basePrice": 65,
          "configurable": false,
          "specs": {
            "Leistung": "600 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "APSystems YC700A",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "apsystems",
          "imageUrl": "",
          "description": "Professionelle Version mit erweiterten Features.",
          "basePrice": 72,
          "configurable": false,
          "specs": {
            "Leistung": "700 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "APSystems YC800A",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "apsystems",
          "imageUrl": "",
          "description": "Höchstleistungs-Optimizer für große Anlagen.",
          "basePrice": 78,
          "configurable": false,
          "specs": {
            "Leistung": "800 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        }
      ]
    },
    {
      "slug": "byd",
      "name": "BYD Energy",
      "logoUrl": "/assets/logos/byd.png",
      "category": [
        "Speicher"
      ],
      "description": "BYD Energy ist die Energiesparte des chinesischen Automobil- und Batterieherstellers BYD. Spezialisiert auf Lithium-Eisenphosphat-Batterien.",
      "whyWeTrust": [
        "Über 25 Jahre Erfahrung in der Batterieproduktion.",
        "Höchste Sicherheitsstandards mit LFP-Chemie.",
        "Umfassende Produktpalette von Residential bis Utility-Scale."
      ],
      "products": [
        {
          "name": "BYD Battery-Box Premium HV",
          "category": "Speicher",
          "manufacturerSlug": "byd",
          "imageUrl": "",
          "description": "Hochkapazitives System für größere Wohnanlagen.",
          "basePrice": 7800,
          "configurable": false,
          "specs": {
            "Kapazität": "11.0 kWh",
            "Leistung": "5.5 kW",
            "Spannung": "200-400 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "BYD Battery-Box Premium HVM",
          "category": "Speicher",
          "manufacturerSlug": "byd",
          "imageUrl": "",
          "description": "Mittelgroßes System mit erweiterten Monitoring-Funktionen.",
          "basePrice": 6200,
          "configurable": false,
          "specs": {
            "Kapazität": "8.3 kWh",
            "Leistung": "4.2 kW",
            "Spannung": "200-400 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "BYD Battery-Box Premium HVS",
          "category": "Speicher",
          "manufacturerSlug": "byd",
          "imageUrl": "",
          "description": "Modulares Lithium-Eisenphosphat-System mit hoher Sicherheit.",
          "basePrice": 3800,
          "configurable": false,
          "specs": {
            "Kapazität": "5.1 kWh",
            "Leistung": "2.5 kW",
            "Spannung": "200-400 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "BYD Cube-S1",
          "category": "Speicher",
          "manufacturerSlug": "byd",
          "imageUrl": "",
          "description": "Kompaktes System für kleine Installationen und Off-Grid-Anwendungen.",
          "basePrice": 3500,
          "configurable": false,
          "specs": {
            "Kapazität": "5.0 kWh",
            "Leistung": "2.5 kW",
            "Spannung": "48 V",
            "Zyklen": "5000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "BYD Cube-S2",
          "category": "Speicher",
          "manufacturerSlug": "byd",
          "imageUrl": "",
          "description": "Erweiterte Version mit höherer Kapazität für mittlere Anlagen.",
          "basePrice": 6500,
          "configurable": false,
          "specs": {
            "Kapazität": "10.0 kWh",
            "Leistung": "5.0 kW",
            "Spannung": "48 V",
            "Zyklen": "5000",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "canadian-solar",
      "name": "Canadian Solar",
      "logoUrl": "/assets/logos/canadian-solar.png",
      "category": [
        "Module"
      ],
      "description": "Canadian Solar ist einer der weltweit größten Hersteller von Solarmodulen und Anbieter von Solarlösungen. Das Unternehmen beliefert über 160 Länder mit hochwertigen und kosteneffizienten Solarmodulen.",
      "whyWeTrust": [
        "Über 25 Jahre Erfahrung und weltweite Präsenz in mehr als 160 Ländern.",
        "Ausgezeichnete Bankability und finanzielle Stabilität.",
        "Breites Produktportfolio für alle Anwendungsbereiche."
      ],
      "products": [
        {
          "name": "BiHiKu7 CS7N-665MS Bifacial",
          "category": "Module",
          "manufacturerSlug": "canadian-solar",
          "imageUrl": "",
          "description": "Bifaziales N-Type Modul für maximale Erträge durch Doppelseitige Energiegewinnung.",
          "basePrice": 185,
          "configurable": false,
          "specs": {
            "Leistung": "665 Wp",
            "Wirkungsgrad": "21.6 %",
            "Zell-Technologie": "N-Type Bifacial",
            "Bifazialität": "85%"
          }
        },
        {
          "name": "HiKu6 Mono PERC CS6W-410MS",
          "category": "Module",
          "manufacturerSlug": "canadian-solar",
          "imageUrl": "",
          "description": "Kompakte HiKu6 Serie ideal für Aufdachanlagen mit begrenztem Platz.",
          "basePrice": 140,
          "configurable": false,
          "specs": {
            "Leistung": "410 Wp",
            "Wirkungsgrad": "20.9 %",
            "Zell-Technologie": "Mono PERC"
          }
        },
        {
          "name": "HiKu7 Mono PERC CS7L-545MS",
          "category": "Module",
          "manufacturerSlug": "canadian-solar",
          "imageUrl": "",
          "description": "HiKu7 Serie mit bewährter PERC-Technologie für höchste Zuverlässigkeit und Performance.",
          "basePrice": 155,
          "configurable": false,
          "specs": {
            "Leistung": "545 Wp",
            "Wirkungsgrad": "21.2 %",
            "Zell-Technologie": "Mono PERC"
          }
        }
      ]
    },
    {
      "slug": "chilicon-power",
      "name": "Chilicon Power",
      "logoUrl": "/assets/logos/chilicon.png",
      "category": [
        "Leistungsoptimierer"
      ],
      "description": "Chilicon Power ist ein chinesischer Hersteller von Power Optimizern mit Fokus auf Kosteneffizienz.",
      "whyWeTrust": [
        "Hervorragendes Preis-Leistungs-Verhältnis.",
        "Zuverlässige Technologie und Qualität.",
        "Gute Verfügbarkeit und Service."
      ],
      "products": [
        {
          "name": "Chilicon CP-250-60-1000",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "chilicon-power",
          "imageUrl": "",
          "description": "Premium-Optimizer für Utility-Scale Anwendungen.",
          "basePrice": 82,
          "configurable": false,
          "specs": {
            "Leistung": "1000 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Chilicon CP-250-60-500",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "chilicon-power",
          "imageUrl": "",
          "description": "Kosteneffizienter Power Optimizer mit guter Leistung.",
          "basePrice": 55,
          "configurable": false,
          "specs": {
            "Leistung": "500 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Chilicon CP-250-60-600",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "chilicon-power",
          "imageUrl": "",
          "description": "Hochleistungs-Optimizer für moderne Solarmodule.",
          "basePrice": 62,
          "configurable": false,
          "specs": {
            "Leistung": "600 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Chilicon CP-250-60-700",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "chilicon-power",
          "imageUrl": "",
          "description": "Professionelle Version mit erweiterten Monitoring-Funktionen.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Leistung": "700 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Chilicon CP-250-60-800",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "chilicon-power",
          "imageUrl": "",
          "description": "Höchstleistungs-Optimizer für große Anlagen.",
          "basePrice": 75,
          "configurable": false,
          "specs": {
            "Leistung": "800 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        }
      ]
    },
    {
      "slug": "darfon",
      "name": "Darfon Electronics",
      "logoUrl": "/assets/logos/darfon.png",
      "category": [
        "Leistungsoptimierer"
      ],
      "description": "Darfon Electronics ist ein taiwanischer Hersteller von Power Optimizern mit hoher Qualität.",
      "whyWeTrust": [
        "Hohe Qualitätsstandards und Zuverlässigkeit.",
        "Umfassende Erfahrung in der Elektronikproduktion.",
        "Gute technische Unterstützung."
      ],
      "products": [
        {
          "name": "Darfon M1P350A",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "darfon",
          "imageUrl": "",
          "description": "Zuverlässiger Power Optimizer mit hoher Effizienz.",
          "basePrice": 48,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Darfon M1P400A",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "darfon",
          "imageUrl": "",
          "description": "Erweiterte Version für höhere Modulleistungen.",
          "basePrice": 55,
          "configurable": false,
          "specs": {
            "Leistung": "400 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Darfon M1P500A",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "darfon",
          "imageUrl": "",
          "description": "Hochleistungs-Optimizer für moderne Module.",
          "basePrice": 62,
          "configurable": false,
          "specs": {
            "Leistung": "500 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Darfon M1P600A",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "darfon",
          "imageUrl": "",
          "description": "Professioneller Optimizer mit erweiterten Features.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Leistung": "600 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Darfon M1P700A",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "darfon",
          "imageUrl": "",
          "description": "Premium-Optimizer für anspruchsvolle Anwendungen.",
          "basePrice": 75,
          "configurable": false,
          "specs": {
            "Leistung": "700 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        }
      ]
    },
    {
      "slug": "e3dc",
      "name": "E3/DC",
      "logoUrl": "/assets/logos/e3dc.png",
      "category": [
        "Speicher"
      ],
      "description": "E3/DC ist ein deutscher Hersteller von All-in-One Energiespeichersystemen mit integrierten Wechselrichtern.",
      "whyWeTrust": [
        "All-in-One Lösungen mit integrierten Komponenten.",
        "Hohe Systemeffizienz und Zuverlässigkeit.",
        "Deutsche Ingenieurskunst und Qualität."
      ],
      "products": [
        {
          "name": "E3/DC S10 E",
          "category": "Speicher",
          "manufacturerSlug": "e3dc",
          "imageUrl": "",
          "description": "All-in-One Energiespeichersystem mit integriertem Wechselrichter.",
          "basePrice": 6800,
          "configurable": false,
          "specs": {
            "Kapazität": "10.0 kWh",
            "Leistung": "3.6 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "E3/DC S10 Pro",
          "category": "Speicher",
          "manufacturerSlug": "e3dc",
          "imageUrl": "",
          "description": "Professionelle Version mit erweiterten Monitoring-Funktionen.",
          "basePrice": 8200,
          "configurable": false,
          "specs": {
            "Kapazität": "10.0 kWh",
            "Leistung": "9.0 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "E3/DC S10 X",
          "category": "Speicher",
          "manufacturerSlug": "e3dc",
          "imageUrl": "",
          "description": "Erweiterte Version mit höherer Leistung für größere Anlagen.",
          "basePrice": 7500,
          "configurable": false,
          "specs": {
            "Kapazität": "10.0 kWh",
            "Leistung": "6.0 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "E3/DC S20",
          "category": "Speicher",
          "manufacturerSlug": "e3dc",
          "imageUrl": "",
          "description": "Doppelte Kapazität für größere Energieautarkie.",
          "basePrice": 12500,
          "configurable": false,
          "specs": {
            "Kapazität": "20.0 kWh",
            "Leistung": "9.0 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "E3/DC S30",
          "category": "Speicher",
          "manufacturerSlug": "e3dc",
          "imageUrl": "",
          "description": "Hochkapazitives System für gewerbliche Anwendungen.",
          "basePrice": 17500,
          "configurable": false,
          "specs": {
            "Kapazität": "30.0 kWh",
            "Leistung": "12.0 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "esdec",
      "name": "Esdec",
      "logoUrl": "/assets/logos/esdec.png",
      "category": [
        "Unterkonstruktion"
      ],
      "description": "Esdec ist ein innovativer Hersteller von Montagesystemen mit Fokus auf einfache Installation und höchste Qualität.",
      "whyWeTrust": [
        "Innovative Click-Systeme für schnelle Montage.",
        "Umfassende Produktpalette für alle Dacharten.",
        "Hohe Qualität und Langlebigkeit."
      ],
      "products": [
        {
          "name": "Esdec FlatFix Eco",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "esdec",
          "imageUrl": "",
          "description": "Kostengünstiges System für Standardanwendungen.",
          "basePrice": 58,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "1600 Pa",
            "Neigungswinkel": "10-25°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Esdec FlatFix Extreme",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "esdec",
          "imageUrl": "",
          "description": "Extrem belastbares System für Küsten- und Bergregionen.",
          "basePrice": 95,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "5400 Pa",
            "Neigungswinkel": "10-40°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Esdec FlatFix Fusion",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "esdec",
          "imageUrl": "",
          "description": "Innovatives Flachdachsystem mit patentiertem Click-System für schnelle Montage.",
          "basePrice": 78,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "3600 Pa",
            "Neigungswinkel": "10-35°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Esdec FlatFix Wave",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "esdec",
          "imageUrl": "",
          "description": "Wellenförmiges Montagesystem für optimale Wasserableitung.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-30°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Esdec TiltFix Pro",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "esdec",
          "imageUrl": "",
          "description": "Universelles System für geneigte Dächer mit variabler Neigung.",
          "basePrice": 72,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "15-45°",
            "Dachart": "Pultdach",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "fronius",
      "name": "Fronius International",
      "logoUrl": "/assets/logos/fronius.png",
      "category": [
        "Wechselrichter",
        "Speicher",
        "Elektrokomponenten"
      ],
      "description": "Fronius ist ein österreichischer Hersteller von Schweißtechnik und Solartechnik mit innovativen Backup-Systemen.",
      "whyWeTrust": [
        "Innovative Technologien und hohe Qualität.",
        "Umfassendes Energiemanagement-System.",
        "Exzellenter Service und Support weltweit."
      ],
      "products": [
        {
          "name": "Fronius BYD Battery-Box 10.2",
          "category": "Speicher",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Kooperationssystem mit BYD für optimale Integration.",
          "basePrice": 7200,
          "configurable": false,
          "specs": {
            "Kapazität": "10.2 kWh",
            "Leistung": "5.1 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Fronius Eco 25.0-27.0",
          "category": "Wechselrichter",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Hochleistungs-Wechselrichter für gewerbliche Anlagen mit SnapINverter Technologie.",
          "basePrice": 2200,
          "configurable": false,
          "specs": {
            "Leistung": "25000-27000 W",
            "Wirkungsgrad": "98.2 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Fronius Eco Hybrid Backup",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Effizientes Hybrid-System mit erweiterten Backup-Funktionen.",
          "basePrice": 4500,
          "configurable": false,
          "specs": {
            "Leistung": "3000-8000 W",
            "Kapazität": "3000-16000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<50 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Fronius LG Chem RESU 10",
          "category": "Speicher",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "LG Chem Batterie mit Fronius Energiemanagement.",
          "basePrice": 6800,
          "configurable": false,
          "specs": {
            "Kapazität": "9.8 kWh",
            "Leistung": "5.0 kW",
            "Spannung": "400 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Fronius Ohmpilot",
          "category": "Wechselrichter",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Intelligenter Verbrauchsoptimierer zur Nutzung von Überschussstrom für Warmwasser.",
          "basePrice": 1800,
          "configurable": false,
          "specs": {
            "Leistung": "3000 W",
            "Wirkungsgrad": "95.0 %",
            "Phasen": "1",
            "Typ": "Verbrauchsoptimierer"
          }
        },
        {
          "name": "Fronius Ohmpilot Storage",
          "category": "Speicher",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Intelligenter Verbrauchsoptimierer mit Speicherfunktion.",
          "basePrice": 3800,
          "configurable": false,
          "specs": {
            "Kapazität": "2.0-14.0 kWh",
            "Leistung": "3.0 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Fronius Ohmpilot Storage 3.0",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Intelligenter Verbrauchsoptimierer mit Backup-Funktion.",
          "basePrice": 2800,
          "configurable": false,
          "specs": {
            "Leistung": "3000 W",
            "Kapazität": "3000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<50 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Fronius Ohmpilot Storage 5.0",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Erweiterte Version mit höherer Kapazität.",
          "basePrice": 4200,
          "configurable": false,
          "specs": {
            "Leistung": "5000 W",
            "Kapazität": "5000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<50 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Fronius Primo 3.0-8.2",
          "category": "Wechselrichter",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Kompakter String-Wechselrichter mit integriertem WLAN für einfache Überwachung.",
          "basePrice": 1100,
          "configurable": false,
          "specs": {
            "Leistung": "3000-8200 W",
            "Wirkungsgrad": "97.9 %",
            "Phasen": "1",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Fronius Primo Hybrid Backup",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Kompaktes Hybrid-System für Wohnanlagen.",
          "basePrice": 3800,
          "configurable": false,
          "specs": {
            "Leistung": "3000-6000 W",
            "Kapazität": "3000-12000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<50 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Fronius Primo Hybrid Storage",
          "category": "Speicher",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Kompaktes Hybrid-System für Wohnanlagen.",
          "basePrice": 4800,
          "configurable": false,
          "specs": {
            "Kapazität": "3.0-9.0 kWh",
            "Leistung": "3.0-6.0 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Fronius Symo 3.0-20.0",
          "category": "Wechselrichter",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Dreiphasiger String-Wechselrichter mit Active Cooling für optimale Leistung.",
          "basePrice": 1400,
          "configurable": false,
          "specs": {
            "Leistung": "3000-20000 W",
            "Wirkungsgrad": "98.0 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Fronius Symo GEN24 Plus",
          "category": "Wechselrichter",
          "manufacturerSlug": "fronius",
          "imageUrl": "https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit",
          "description": "Der vielseitige Hybridwechselrichter für Privathaushalte mit integrierter Notstromversorgung und flexiblen Speicheroptionen.",
          "basePrice": 1850,
          "configurable": false,
          "specs": {
            "AC-Nennleistung": "10.0 kW",
            "Max. DC-Leistung": "15 kWp",
            "Max. Wirkungsgrad": "98.2 %",
            "MPP-Tracker": 2,
            "Notstrom": "PV Point, Full Backup (opt.)",
            "Hybrid": "Ja",
            "Garantie": "10 Jahre (bei Registrierung)"
          },
          "keyFeatures": [
            "Hybrid-Funktionalität",
            "Integrierte Notstromversorgung",
            "Offene Schnittstellen"
          ]
        },
        {
          "name": "Fronius Symo Hybrid Backup",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Hybrid-System mit integriertem Backup-Modus.",
          "basePrice": 3500,
          "configurable": false,
          "specs": {
            "Leistung": "3000-5000 W",
            "Kapazität": "3000-10000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<50 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Fronius Symo Hybrid Storage",
          "category": "Speicher",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Hybrid-System mit integriertem Wechselrichter.",
          "basePrice": 5200,
          "configurable": false,
          "specs": {
            "Kapazität": "4.0-12.0 kWh",
            "Leistung": "3.0-5.0 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Fronius Tauro",
          "category": "Wechselrichter",
          "manufacturerSlug": "fronius",
          "imageUrl": "https://images.unsplash.com/photo-1582285521820-22d24b611688?q=80&w=870&auto=format&fit",
          "description": "Der robuste und smarte Wechselrichter für gewerbliche Großanlagen. Konzipiert für maximale Leistung auch unter härtesten Umgebungsbedingungen.",
          "basePrice": 4100,
          "configurable": false,
          "specs": {
            "AC-Nennleistung": "50.0 kW",
            "Max. DC-Leistung": "75 kWp",
            "Max. Wirkungsgrad": "98.5 %",
            "MPP-Tracker": 3,
            "Kühlung": "Aktiv (Doppelwand-System)",
            "Schutzart": "IP65",
            "Garantie": "5 Jahre"
          },
          "keyFeatures": [
            "Extrem robust (IP 65)",
            "Aktive Kühltechnologie",
            "Flexible Auslegung"
          ]
        },
        {
          "name": "Fronius Tauro 50.0-100.0",
          "category": "Wechselrichter",
          "manufacturerSlug": "fronius",
          "imageUrl": "",
          "description": "Leistungsstarker Zentralwechselrichter mit integriertem Transformator für große Anlagen.",
          "basePrice": 8000,
          "configurable": false,
          "specs": {
            "Leistung": "50000-100000 W",
            "Wirkungsgrad": "98.3 %",
            "Phasen": "3",
            "Typ": "Zentral-Wechselrichter"
          }
        }
      ]
    },
    {
      "slug": "ginlong",
      "name": "Ginlong Technologies",
      "logoUrl": "/assets/logos/ginlong.png",
      "category": [
        "Leistungsoptimierer"
      ],
      "description": "Ginlong Technologies ist ein chinesischer Hersteller von Wechselrichtern und Power Optimizern.",
      "whyWeTrust": [
        "Umfassende Produktpalette von Residential bis Utility-Scale.",
        "Hohe Qualität und Zuverlässigkeit.",
        "Innovative Technologien und guter Service."
      ],
      "products": [
        {
          "name": "Ginlong Solis-1P(2.5-6)K-4G",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "ginlong",
          "imageUrl": "",
          "description": "Intelligenter Optimizer mit integriertem Wechselrichter.",
          "basePrice": 52,
          "configurable": false,
          "specs": {
            "Leistung": "2500-6000 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Ginlong Solis-3P(12-20)K-4G",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "ginlong",
          "imageUrl": "",
          "description": "Hochleistungs-Optimizer für große Solarparks.",
          "basePrice": 85,
          "configurable": false,
          "specs": {
            "Leistung": "12000-20000 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Ginlong Solis-3P(25-30)K-4G",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "ginlong",
          "imageUrl": "",
          "description": "Professioneller Optimizer für Utility-Scale Projekte.",
          "basePrice": 95,
          "configurable": false,
          "specs": {
            "Leistung": "25000-30000 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Ginlong Solis-3P(40-50)K-4G",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "ginlong",
          "imageUrl": "",
          "description": "Megawatt-Optimizer für große Solaranlagen.",
          "basePrice": 110,
          "configurable": false,
          "specs": {
            "Leistung": "40000-50000 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Ginlong Solis-3P(5-10)K-4G",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "ginlong",
          "imageUrl": "",
          "description": "Dreiphasiger Optimizer für gewerbliche Anlagen.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Leistung": "5000-10000 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        }
      ]
    },
    {
      "slug": "growatt",
      "name": "Growatt",
      "logoUrl": "/assets/logos/growatt.png",
      "category": [
        "Wechselrichter"
      ],
      "description": "Growatt ist ein chinesischer Hersteller von Wechselrichtern und Energiespeichersystemen. Bekannt für kosteneffiziente und zuverlässige Lösungen.",
      "whyWeTrust": [
        "Hervorragendes Preis-Leistungs-Verhältnis.",
        "Breites Produktportfolio von Residential bis Utility-Scale.",
        "Schnelle technische Unterstützung und Firmware-Updates."
      ],
      "products": [
        {
          "name": "Growatt MAX 50-80KTL3-X LV",
          "category": "Wechselrichter",
          "manufacturerSlug": "growatt",
          "imageUrl": "",
          "description": "Mittelgroßer dreiphasiger Wechselrichter mit 6 MPP-Trackern.",
          "basePrice": 4200,
          "configurable": false,
          "specs": {
            "Leistung": "50000-80000 W",
            "Wirkungsgrad": "98.4 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Growatt MIN 2500-6000TL-X",
          "category": "Wechselrichter",
          "manufacturerSlug": "growatt",
          "imageUrl": "",
          "description": "Kompakter einphasiger Wechselrichter mit hoher Überlastfähigkeit.",
          "basePrice": 950,
          "configurable": false,
          "specs": {
            "Leistung": "2500-6000 W",
            "Wirkungsgrad": "97.8 %",
            "Phasen": "1",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Growatt MOD 17-25KTL3-X",
          "category": "Wechselrichter",
          "manufacturerSlug": "growatt",
          "imageUrl": "",
          "description": "Hochleistungs-Wechselrichter mit 3 MPP-Trackern für gewerbliche Anlagen.",
          "basePrice": 1950,
          "configurable": false,
          "specs": {
            "Leistung": "17000-25000 W",
            "Wirkungsgrad": "98.2 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Growatt MOD 3-10KTL3-X",
          "category": "Wechselrichter",
          "manufacturerSlug": "growatt",
          "imageUrl": "",
          "description": "Dreiphasiger Wechselrichter mit 2 MPP-Trackern für flexible Installation.",
          "basePrice": 1250,
          "configurable": false,
          "specs": {
            "Leistung": "3000-10000 W",
            "Wirkungsgrad": "98.0 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Growatt MOD 30-40KTL3-X",
          "category": "Wechselrichter",
          "manufacturerSlug": "growatt",
          "imageUrl": "",
          "description": "Leistungsstarker Wechselrichter mit 4 MPP-Trackern für große Anlagen.",
          "basePrice": 2800,
          "configurable": false,
          "specs": {
            "Leistung": "30000-40000 W",
            "Wirkungsgrad": "98.3 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        }
      ]
    },
    {
      "slug": "huawei",
      "name": "Huawei Digital Power",
      "logoUrl": "/assets/logos/huawei.png",
      "category": [
        "Speicher",
        "Wechselrichter",
        "Leistungsoptimierer"
      ],
      "description": "Huawei Digital Power bietet fortschrittliche Power Optimizer mit AI-gestützter Optimierung.",
      "whyWeTrust": [
        "AI-gestützte Leistungsoptimierung.",
        "Hohe Systemeffizienz und Zuverlässigkeit.",
        "Umfassende Garantie und Support."
      ],
      "products": [
        {
          "name": "Huawei Luna2000-10-S0",
          "category": "Speicher",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Erweiterbares System mit höherer Kapazität.",
          "basePrice": 6500,
          "configurable": false,
          "specs": {
            "Kapazität": "10.0 kWh",
            "Leistung": "5.0 kW",
            "Spannung": "150-850 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Huawei Luna2000-15-S0",
          "category": "Speicher",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Hochkapazitives System für größere Anlagen.",
          "basePrice": 9200,
          "configurable": false,
          "specs": {
            "Kapazität": "15.0 kWh",
            "Leistung": "7.5 kW",
            "Spannung": "150-850 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Huawei Luna2000-20-S0",
          "category": "Speicher",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Professionelles System mit erweiterten Backup-Funktionen.",
          "basePrice": 11800,
          "configurable": false,
          "specs": {
            "Kapazität": "20.0 kWh",
            "Leistung": "10.0 kW",
            "Spannung": "150-850 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Huawei Luna2000-30-S0",
          "category": "Speicher",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Maximal erweiterbares System für kommerzielle Anwendungen.",
          "basePrice": 16500,
          "configurable": false,
          "specs": {
            "Kapazität": "30.0 kWh",
            "Leistung": "15.0 kW",
            "Spannung": "150-850 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Huawei Luna2000-5-S0",
          "category": "Speicher",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Modulares System mit AI-gestütztem Energiemanagement.",
          "basePrice": 3800,
          "configurable": false,
          "specs": {
            "Kapazität": "5.0 kWh",
            "Leistung": "2.5 kW",
            "Spannung": "150-850 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Huawei SUN2000-100KTL-185KTL",
          "category": "Wechselrichter",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Hochleistungs-Zentralwechselrichter mit 16 MPP-Trackern für komplexe Anlagen.",
          "basePrice": 12000,
          "configurable": false,
          "specs": {
            "Leistung": "100000-185000 W",
            "Wirkungsgrad": "98.6 %",
            "Phasen": "3",
            "Typ": "Zentral-Wechselrichter"
          }
        },
        {
          "name": "Huawei SUN2000-29.9KTL-40KTL",
          "category": "Wechselrichter",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Kompakter dreiphasiger Wechselrichter mit 4 MPP-Trackern für flexible Installation.",
          "basePrice": 2800,
          "configurable": false,
          "specs": {
            "Leistung": "29900-40000 W",
            "Wirkungsgrad": "98.3 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Huawei SUN2000-2KTL-12KTL",
          "category": "Wechselrichter",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Einphasiger String-Wechselrichter mit hoher Überlastfähigkeit für Wohnanlagen.",
          "basePrice": 1150,
          "configurable": false,
          "specs": {
            "Leistung": "2000-12000 W",
            "Wirkungsgrad": "97.8 %",
            "Phasen": "1",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Huawei SUN2000-3KTL-10KTL",
          "category": "Wechselrichter",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Intelligenter String-Wechselrichter mit AI-Optimierung und Smart I-V Kurve Diagnose.",
          "basePrice": 1300,
          "configurable": false,
          "specs": {
            "Leistung": "3000-10000 W",
            "Wirkungsgrad": "98.2 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Huawei SUN2000-450W-P",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "AI-gestützter Power Optimizer mit intelligenter Leistungsoptimierung.",
          "basePrice": 55,
          "configurable": false,
          "specs": {
            "Leistung": "450 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Huawei SUN2000-500W-P",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Hochleistungs-Optimizer für moderne Solarmodule.",
          "basePrice": 62,
          "configurable": false,
          "specs": {
            "Leistung": "500 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Huawei SUN2000-50KTL-80KTL",
          "category": "Wechselrichter",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Mittelgroßer String-Wechselrichter mit 12 MPP-Trackern für gewerbliche Anlagen.",
          "basePrice": 4500,
          "configurable": false,
          "specs": {
            "Leistung": "50000-80000 W",
            "Wirkungsgrad": "98.4 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Huawei SUN2000-600W-P",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Professioneller Optimizer für große Anlagen.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Leistung": "600 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Huawei SUN2000-700W-P",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Höchstleistungs-Optimizer mit erweiterten Features.",
          "basePrice": 75,
          "configurable": false,
          "specs": {
            "Leistung": "700 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Huawei SUN2000-800W-P",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "huawei",
          "imageUrl": "",
          "description": "Premium-Optimizer für Utility-Scale Projekte.",
          "basePrice": 82,
          "configurable": false,
          "specs": {
            "Leistung": "800 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "LUNA2000 Smart String ESS",
          "category": "Speicher",
          "manufacturerSlug": "huawei",
          "imageUrl": "https://solar.huawei.com/eu/products/for-home/luna2000",
          "description": "Modulares LFP-Speichersystem mit Smart PCS und bis zu 3.870 kWh Kapazität für Gewerbe- und C&I-Anwendungen.",
          "specs": {
            "Kapazität": "100 – 3.870 kWh",
            "Wechselrichter": "LUNA2000-100KTL-M1",
            "Wirkungsgrad": "98,4 %",
            "Schutzklasse": "IP66",
            "Zyklenfestigkeit": "≥6.000 Zyklen"
          },
          "keyFeatures": [
            "Modular kaskadierbares Speichersystem",
            "Intelligente Kühlung & Brandschutz integriert",
            "Kompatibel mit FusionSolar Smart PV Management"
          ],
          "documents": [
            {
              "type": "datasheet",
              "url": "https://solar.huawei.com/admin/asset/v1/pro/view/ad91d6d343ee4f13860b641e8239e53c.pdf",
              "title": "Huawei LUNA2000-100KTL-M1 Datenblatt"
            },
            {
              "type": "datasheet",
              "url": "https://solar.huawei.com/download?p=%2F-%2Fmedia%2FSolarV4%2Fsolar-version2%2Fcommon%2Fprofessionals%2Fall-products%2Fci%2Fsmart-string-ess%2Fluna2000-200kwhg-2h1%2Fdatasheet%2Fluna2000-200kwhg-2h1-dtatsheet-20230310.pdf",
              "title": "Huawei LUNA2000-200KWH-2H1 Technical Data"
            },
            {
              "type": "installation_manual",
              "url": "https://solar.huawei.com/admin/asset/v1/pro/view/1d15e9e120be44748cef729b4dc8a351.pdf",
              "title": "Huawei LUNA2000 Smart String ESS – User Manual"
            },
            {
              "type": "other",
              "url": "https://solar.huawei.com/~/media/Solar/attachment/pdf/apac/service/download/HUAWEI_Warranty_and_Service_Conditions_for_Smart_PV_Products2.pdf",
              "title": "Huawei Smart PV Warranty"
            }
          ]
        },
        {
          "name": "Smart String Energy Storage 2.0 MWh",
          "category": "Speicher",
          "manufacturerSlug": "huawei",
          "imageUrl": "https://solar.huawei.com/eu/products/for-business/smart-string-energy-storage",
          "description": "Containerisiertes Smart-String-ESS mit 2.032 kWh nutzbarer Energie und Hybrid-Kühlung für Utility-Scale-Projekte.",
          "specs": {
            "Kapazität": "2.032 kWh pro Container",
            "Leistungsabgabe": "bis 2.064 kW",
            "Nennspannung": "1.250 V DC",
            "Kühlung": "Hybrid (Flüssig + Luft)",
            "Kommunikation": "Ethernet / Modbus TCP"
          },
          "keyFeatures": [
            "Hybridgekühltes Batteriesystem mit Brandschutz",
            "Grid-forming-ready für neue Energiesysteme",
            "IP55 Schutz und Betrieb bis -30 °C"
          ],
          "documents": [
            {
              "type": "datasheet",
              "url": "https://digitalpower.huawei.com/upload-pro/index/64fd034f35534588bf76e6a66815032c/Active-Safety-and-Grid-Forming-Accelerating-PV-ESS-as-the-Main-Energy-Source.pdf",
              "title": "Huawei Active Safety & Grid Forming Whitepaper"
            },
            {
              "type": "datasheet",
              "url": "https://solar.huawei.com/download?p=%2F-%2Fmedia%2FSolarV4%2Fsolar-version2%2Fcommon%2Fprofessionals%2Fall-products%2Fci%2Fsmart-string-ess%2Fluna2000-200kwhg-2h1%2Fdatasheet%2Fluna2000-200kwhg-2h1-dtatsheet-20230310.pdf",
              "title": "LUNA2000-200KWH-2H1 Datenblatt"
            },
            {
              "type": "installation_manual",
              "url": "https://solar.huawei.com/admin/asset/v1/pro/view/324114d5a1154060a1b398099f34d08b.pdf",
              "title": "LUNA2000-215 Smart String ESS – Installationshandbuch"
            },
            {
              "type": "other",
              "url": "https://solar.huawei.com/download?p=%2F-%2Fmedia%2FSolarV4%2Fsolar-version2%2Fcommon%2Fservice-support%2Fwarranty%2Fpdf%2Fc-i-ess-warranty-policy-oversea-v2-0.pdf",
              "title": "Huawei C&I ESS Warranty Policy"
            }
          ]
        }
      ]
    },
    {
      "slug": "ibc-solar",
      "name": "IBC Solar",
      "logoUrl": "/assets/logos/ibc-solar.png",
      "category": [
        "Unterkonstruktion"
      ],
      "description": "IBC Solar ist ein internationaler Hersteller von Montagesystemen mit Fokus auf Innovation und Qualität.",
      "whyWeTrust": [
        "Internationale Erfahrung und Präsenz.",
        "Innovative aerodynamische Systeme.",
        "Hohe Qualitätsstandards und Garantien."
      ],
      "products": [
        {
          "name": "IBC AeroFix",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "ibc-solar",
          "imageUrl": "",
          "description": "Aerodynamisches Flachdachsystem mit minimalem Windwiderstand.",
          "basePrice": 82,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "3600 Pa",
            "Neigungswinkel": "10-35°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "IBC FlatFix",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "ibc-solar",
          "imageUrl": "",
          "description": "Klassisches Flachdachsystem mit bewährter Technik.",
          "basePrice": 72,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-30°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "IBC GroundFix",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "ibc-solar",
          "imageUrl": "",
          "description": "Bodenmontagesystem mit optimierter Materialausnutzung.",
          "basePrice": 88,
          "configurable": false,
          "specs": {
            "Material": "Stahl/Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-60°",
            "Dachart": "Freifläche",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "IBC RailFix",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "ibc-solar",
          "imageUrl": "",
          "description": "Schienensystem mit hoher Flexibilität in der Modulanordnung.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "15-45°",
            "Dachart": "Pultdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "IBC Universal",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "ibc-solar",
          "imageUrl": "",
          "description": "Universelles System für alle Montagearten und Dachformen.",
          "basePrice": 75,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-45°",
            "Dachart": "Universal",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "ja-solar",
      "name": "JA Solar",
      "logoUrl": "/assets/logos/ja-solar.png",
      "category": [
        "Module"
      ],
      "description": "JA Solar ist ein weltweit führender Hersteller von Hochleistungs-Photovoltaikprodukten. Das Unternehmen ist bekannt für seine kontinuierliche Innovation und sein Engagement für Qualität und Zuverlässigkeit.",
      "whyWeTrust": [
        "Starke Position als Tier-1-Hersteller.",
        "Hohe Effizienz und Langlebigkeit der Module.",
        "Breites Produktportfolio für diverse Anwendungsbereiche."
      ],
      "products": [
        {
          "name": "JAM54S40 440W",
          "category": "Module",
          "manufacturerSlug": "ja-solar",
          "imageUrl": "",
          "description": "Kompaktes Hocheffizienz-Modul für private und gewerbliche Aufdachanlagen.",
          "basePrice": 195,
          "configurable": false,
          "specs": {
            "Leistung": "440 Wp",
            "Wirkungsgrad": "22.3 %",
            "Zell-Technologie": "Mono PERC+"
          }
        },
        {
          "name": "JAM60S20 480W",
          "category": "Module",
          "manufacturerSlug": "ja-solar",
          "imageUrl": "",
          "description": "Ausgewogenes Modul der JAM-Serie für verschiedene Anwendungsbereiche.",
          "basePrice": 155,
          "configurable": false,
          "specs": {
            "Leistung": "480 Wp",
            "Wirkungsgrad": "20.9 %",
            "Zell-Technologie": "Mono PERC"
          }
        },
        {
          "name": "JAM72D40 550W Bifacial",
          "category": "Module",
          "manufacturerSlug": "ja-solar",
          "imageUrl": "",
          "description": "Bifaziales Glas-Glas-Modul für erhöhte Erträge durch Rückseiteneinstrahlung.",
          "basePrice": 170,
          "configurable": false,
          "specs": {
            "Leistung": "550 Wp",
            "Wirkungsgrad": "21.2 %",
            "Zell-Technologie": "Bifacial PERC",
            "Bifazialität": "85%"
          }
        },
        {
          "name": "JAM72S30 535W",
          "category": "Module",
          "manufacturerSlug": "ja-solar",
          "imageUrl": "",
          "description": "Zuverlässiges PERC-Modul für Großanlagen mit exzellentem Preis-Leistungs-Verhältnis.",
          "basePrice": 150,
          "configurable": false,
          "specs": {
            "Leistung": "535 Wp",
            "Wirkungsgrad": "20.7 %",
            "Zell-Technologie": "Mono PERC"
          }
        },
        {
          "name": "JAM78S30 580W",
          "category": "Module",
          "manufacturerSlug": "ja-solar",
          "imageUrl": "",
          "description": "Hochleistungs-Modul mit 78 Zellen für maximale Energieausbeute pro Modul.",
          "basePrice": 175,
          "configurable": false,
          "specs": {
            "Leistung": "580 Wp",
            "Wirkungsgrad": "21.5 %",
            "Zell-Technologie": "Mono PERC"
          }
        }
      ]
    },
    {
      "slug": "jinko-solar",
      "name": "Jinko Solar",
      "logoUrl": "/assets/logos/jinko-solar.png",
      "category": [
        "Module"
      ],
      "description": "Jinko Solar ist einer der größten und innovativsten Solarmodulhersteller der Welt. Das Unternehmen vertreibt seine Solarmodule und Lösungen an einen breit gefächerten internationalen Kundenstamm.",
      "whyWeTrust": [
        "Führender Hersteller mit enormen Produktionskapazitäten und hoher Lieferfähigkeit.",
        "Innovative TOPCon-Technologie für hohe Effizienz.",
        "Breites Produktportfolio für verschiedene Anwendungsfälle."
      ],
      "products": [
        {
          "name": "Cheetah HC 72M 535W",
          "category": "Module",
          "manufacturerSlug": "jinko-solar",
          "imageUrl": "",
          "description": "Half-Cell Technologie für reduzierte Hotspots und höhere Effizienz.",
          "basePrice": 160,
          "configurable": false,
          "specs": {
            "Leistung": "535 Wp",
            "Wirkungsgrad": "21.0 %",
            "Zell-Technologie": "Mono PERC Half-Cell"
          }
        },
        {
          "name": "Swan SW 410W",
          "category": "Module",
          "manufacturerSlug": "jinko-solar",
          "imageUrl": "",
          "description": "Kompaktes Modul der Swan-Serie für Wohnanlagen mit optimiertem Design.",
          "basePrice": 140,
          "configurable": false,
          "specs": {
            "Leistung": "410 Wp",
            "Wirkungsgrad": "20.5 %",
            "Zell-Technologie": "Mono PERC"
          }
        },
        {
          "name": "Tiger Neo N-type",
          "category": "Module",
          "manufacturerSlug": "jinko-solar",
          "imageUrl": "https://images.unsplash.com/photo-1547283437-0e61a5339f1a?q=80&w=870&auto=format=fit-crop",
          "description": "N-Typ-Modul mit TOPCon-Technologie für extrem niedrige Degradation und hohe Leistung, optimiert für Großprojekte.",
          "basePrice": 165,
          "configurable": false,
          "specs": {
            "Leistung": "575 Wp",
            "Wirkungsgrad": "22.3 %",
            "Zell-Technologie": "N-Type TOPCon",
            "Produktgarantie": "15 Jahre",
            "Leistungsgarantie": "30 Jahre (87.4%)",
            "Bifazialität": "Ja (optional)"
          },
          "keyFeatures": [
            "Sehr geringe Degradation",
            "TOPCon-Technologie",
            "Ideal für Großprojekte"
          ]
        },
        {
          "name": "Tiger Neo N-type 72HL4",
          "category": "Module",
          "manufacturerSlug": "jinko-solar",
          "imageUrl": "",
          "description": "N-Type Hocheffizienzmodul mit TOPCon-Technologie für maximale Erträge.",
          "basePrice": 175,
          "configurable": false,
          "specs": {
            "Leistung": "580 Wp",
            "Wirkungsgrad": "22.5 %",
            "Zell-Technologie": "N-Type TOPCon"
          }
        },
        {
          "name": "Tiger Neo N-type 78HL4-BDVP",
          "category": "Module",
          "manufacturerSlug": "jinko-solar",
          "imageUrl": "",
          "description": "Bifaziales N-Type Modul mit hoher Bifazialität für Freiflächenanlagen.",
          "basePrice": 190,
          "configurable": false,
          "specs": {
            "Leistung": "620 Wp",
            "Wirkungsgrad": "23.1 %",
            "Zell-Technologie": "N-Type TOPCon Bifacial"
          }
        },
        {
          "name": "Tiger Pro 72HC 540W",
          "category": "Module",
          "manufacturerSlug": "jinko-solar",
          "imageUrl": "",
          "description": "Hochleistungs-Modul für gewerbliche Anwendungen mit bewährter PERC-Technologie.",
          "basePrice": 155,
          "configurable": false,
          "specs": {
            "Leistung": "540 Wp",
            "Wirkungsgrad": "20.9 %",
            "Zell-Technologie": "Mono PERC"
          }
        }
      ]
    },
    {
      "slug": "k2-systems",
      "name": "K2 Systems",
      "logoUrl": "/assets/logos/k2-systems.png",
      "category": [
        "Unterkonstruktion"
      ],
      "description": "K2 Systems ist ein deutscher Hersteller von Montagesystemen mit über 20 Jahren Erfahrung in der Solarbranche.",
      "whyWeTrust": [
        "Über 20 Jahre Erfahrung in der Solartechnik.",
        "Innovative Systemlösungen für alle Anwendungen.",
        "Hohe Qualität und Zuverlässigkeit."
      ],
      "products": [
        {
          "name": "K2 Base Rail",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "k2-systems",
          "imageUrl": "",
          "description": "Klassisches Schienensystem für geneigte Dächer mit hoher Zuverlässigkeit.",
          "basePrice": 60,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "15-45°",
            "Dachart": "Pultdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "K2 CrossRail",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "k2-systems",
          "imageUrl": "",
          "description": "Kreuzschiene für flexible Modulanordnung.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "15-45°",
            "Dachart": "Pultdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "K2 Dome",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "k2-systems",
          "imageUrl": "",
          "description": "Einfaches Flachdachsystem mit minimalem Montageaufwand.",
          "basePrice": 52,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "1600 Pa",
            "Neigungswinkel": "10-25°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "K2 Ground Mount",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "k2-systems",
          "imageUrl": "",
          "description": "Bodenmontagesystem für großflächige Solarparks.",
          "basePrice": 82,
          "configurable": false,
          "specs": {
            "Material": "Stahl/Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-60°",
            "Dachart": "Freifläche",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "K2 Wave",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "k2-systems",
          "imageUrl": "",
          "description": "Wellenförmiges System für optimale Statik und Wasserableitung.",
          "basePrice": 75,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "3600 Pa",
            "Neigungswinkel": "10-35°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "kaco",
      "name": "KACO new energy",
      "logoUrl": "/assets/logos/kaco.png",
      "category": [
        "Wechselrichter"
      ],
      "description": "KACO new energy ist ein deutscher Hersteller von Wechselrichtern mit Fokus auf Qualität und Zuverlässigkeit. Spezialisiert auf mittlere bis große Anlagen.",
      "whyWeTrust": [
        "Deutsche Ingenieurskunst und Qualität seit über 100 Jahren.",
        "Spezialisierung auf mittlere und große Anlagen.",
        "Hervorragende Langzeiterfahrung und Zuverlässigkeit."
      ],
      "products": [
        {
          "name": "KACO blueplanet 10.0 TL3",
          "category": "Wechselrichter",
          "manufacturerSlug": "kaco",
          "imageUrl": "",
          "description": "Hochleistungs-Wechselrichter mit 2 MPP-Trackern für flexible String-Konfigurationen.",
          "basePrice": 1750,
          "configurable": false,
          "specs": {
            "Leistung": "10000 W",
            "Wirkungsgrad": "97.8 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "KACO blueplanet 5.0 TL3",
          "category": "Wechselrichter",
          "manufacturerSlug": "kaco",
          "imageUrl": "",
          "description": "Zuverlässiger dreiphasiger String-Wechselrichter für Wohn- und Gewerbeanlagen.",
          "basePrice": 1450,
          "configurable": false,
          "specs": {
            "Leistung": "5000 W",
            "Wirkungsgrad": "97.5 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "KACO blueplanet 50.0 TL3",
          "category": "Wechselrichter",
          "manufacturerSlug": "kaco",
          "imageUrl": "",
          "description": "Mittelgroßer Wechselrichter mit 4 MPP-Trackern für gewerbliche Anlagen.",
          "basePrice": 4200,
          "configurable": false,
          "specs": {
            "Leistung": "50000 W",
            "Wirkungsgrad": "98.0 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "KACO blueplanet 87.0 TL3",
          "category": "Wechselrichter",
          "manufacturerSlug": "kaco",
          "imageUrl": "",
          "description": "Hochleistungs-Wechselrichter mit 6 MPP-Trackern für große Anlagen.",
          "basePrice": 6500,
          "configurable": false,
          "specs": {
            "Leistung": "87000 W",
            "Wirkungsgrad": "98.2 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "KACO Powador 100.0 TL3",
          "category": "Wechselrichter",
          "manufacturerSlug": "kaco",
          "imageUrl": "",
          "description": "Zentralwechselrichter mit integriertem Transformator für Solarparks.",
          "basePrice": 7500,
          "configurable": false,
          "specs": {
            "Leistung": "100000 W",
            "Wirkungsgrad": "98.3 %",
            "Phasen": "3",
            "Typ": "Zentral-Wechselrichter"
          }
        }
      ]
    },
    {
      "slug": "krinner",
      "name": "Krinner",
      "logoUrl": "/assets/logos/krinner.png",
      "category": [
        "Unterkonstruktion"
      ],
      "description": "Krinner ist ein innovativer Hersteller von Montagesystemen mit Fokus auf Bodenmontage und schnelle Installation.",
      "whyWeTrust": [
        "Innovative Verbindungstechnik für schnelle Montage.",
        "Spezialisierung auf Bodenmontagesysteme.",
        "Hohe Materialeffizienz und Stabilität."
      ],
      "products": [
        {
          "name": "Krinner K-Fix",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "krinner",
          "imageUrl": "",
          "description": "Schnellmontagesystem mit patentierten Verbindungselementen.",
          "basePrice": 78,
          "configurable": false,
          "specs": {
            "Material": "Stahl/Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-45°",
            "Dachart": "Freifläche",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Krinner K-Flat",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "krinner",
          "imageUrl": "",
          "description": "Flachdachsystem mit optimierter Statik.",
          "basePrice": 62,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "1600 Pa",
            "Neigungswinkel": "10-25°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Krinner K-Force",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "krinner",
          "imageUrl": "",
          "description": "Kraftvolles System für anspruchsvolle Standorte.",
          "basePrice": 95,
          "configurable": false,
          "specs": {
            "Material": "Stahl",
            "Belastung": "3600 Pa",
            "Neigungswinkel": "10-60°",
            "Dachart": "Freifläche",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Krinner K-Light",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "krinner",
          "imageUrl": "",
          "description": "Leichtes Bodenmontagesystem mit minimalem Materialeinsatz.",
          "basePrice": 85,
          "configurable": false,
          "specs": {
            "Material": "Stahl/Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-60°",
            "Dachart": "Freifläche",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Krinner K-Tilt",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "krinner",
          "imageUrl": "",
          "description": "Universelles System für geneigte Dächer.",
          "basePrice": 70,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "15-45°",
            "Dachart": "Pultdach",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "lg-chem",
      "name": "LG Chem",
      "logoUrl": "/assets/logos/lg-chem.png",
      "category": [
        "Speicher"
      ],
      "description": "LG Chem ist ein südkoreanischer Chemiekonzern und weltweit führender Hersteller von Lithium-Ionen-Batterien für Energiespeichersysteme.",
      "whyWeTrust": [
        "Über 20 Jahre Erfahrung in der Batterieproduktion.",
        "Höchste Sicherheitsstandards und Qualität.",
        "Umfassende Garantie und globaler Service."
      ],
      "products": [
        {
          "name": "LG Chem RESU 13.1",
          "category": "Speicher",
          "manufacturerSlug": "lg-chem",
          "imageUrl": "",
          "description": "Hochkapazitives System für größere Wohnanlagen mit Backup-Funktion.",
          "basePrice": 8900,
          "configurable": false,
          "specs": {
            "Kapazität": "13.1 kWh",
            "Leistung": "6.6 kW",
            "Spannung": "400 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "LG Chem RESU 16.4",
          "category": "Speicher",
          "manufacturerSlug": "lg-chem",
          "imageUrl": "",
          "description": "Professionelles Batteriesystem für gewerbliche Anwendungen.",
          "basePrice": 11200,
          "configurable": false,
          "specs": {
            "Kapazität": "16.4 kWh",
            "Leistung": "8.2 kW",
            "Spannung": "400 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "LG Chem RESU 19.7",
          "category": "Speicher",
          "manufacturerSlug": "lg-chem",
          "imageUrl": "",
          "description": "Maximal erweiterbares System für größere Energieautarkie.",
          "basePrice": 13500,
          "configurable": false,
          "specs": {
            "Kapazität": "19.7 kWh",
            "Leistung": "9.9 kW",
            "Spannung": "400 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "LG Chem RESU 6.4",
          "category": "Speicher",
          "manufacturerSlug": "lg-chem",
          "imageUrl": "",
          "description": "Modulares Lithium-Ionen-Batteriesystem für Wohnanlagen mit hoher Energiedichte.",
          "basePrice": 4500,
          "configurable": false,
          "specs": {
            "Kapazität": "6.4 kWh",
            "Leistung": "3.3 kW",
            "Spannung": "400 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "LG Chem RESU 9.8",
          "category": "Speicher",
          "manufacturerSlug": "lg-chem",
          "imageUrl": "",
          "description": "Erweiterbares Batteriesystem mit intelligenter Energiemanagement-Software.",
          "basePrice": 6800,
          "configurable": false,
          "specs": {
            "Kapazität": "9.8 kWh",
            "Leistung": "5.0 kW",
            "Spannung": "400 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "lg-solar",
      "name": "LG Solar",
      "logoUrl": "/assets/logos/lg-solar.png",
      "category": [
        "Module"
      ],
      "description": "LG Electronics ist ein globaler Technologiekonzern mit einer starken Präsenz im Solarmarkt. LG Solarmodule zeichnen sich durch hohe Qualität und innovative Technologien aus.",
      "whyWeTrust": [
        "Weltweit führender Technologiekonzern mit jahrzehntelanger Erfahrung.",
        "Höchste Qualitätsstandards und umfassende Garantien.",
        "Innovative Zell-Technologien wie Cello und NeON."
      ],
      "products": [
        {
          "name": "NeON 2 Black LG380Q1K-A6",
          "category": "Module",
          "manufacturerSlug": "lg-solar",
          "imageUrl": "",
          "description": "Vollschwarzes Modul der NeON 2 Serie für ästhetisch anspruchsvolle Installationen.",
          "basePrice": 270,
          "configurable": false,
          "specs": {
            "Leistung": "380 Wp",
            "Wirkungsgrad": "20.8 %",
            "Zell-Technologie": "Cello P-Type"
          }
        },
        {
          "name": "NeON 2 LG355Q1C-A6",
          "category": "Module",
          "manufacturerSlug": "lg-solar",
          "imageUrl": "",
          "description": "Kosteneffizientes Modul der NeON 2 Serie für Standard-Anwendungen.",
          "basePrice": 250,
          "configurable": false,
          "specs": {
            "Leistung": "355 Wp",
            "Wirkungsgrad": "19.8 %",
            "Zell-Technologie": "Cello P-Type"
          }
        },
        {
          "name": "NeON 3 LG415N2T-A6",
          "category": "Module",
          "manufacturerSlug": "lg-solar",
          "imageUrl": "",
          "description": "NeON 3 mit verbesserter Cello-Technologie für maximale Energieausbeute.",
          "basePrice": 290,
          "configurable": false,
          "specs": {
            "Leistung": "415 Wp",
            "Wirkungsgrad": "22.0 %",
            "Zell-Technologie": "Cello N-Type"
          }
        },
        {
          "name": "NeON H LG420N2W-A6 Bifacial",
          "category": "Module",
          "manufacturerSlug": "lg-solar",
          "imageUrl": "",
          "description": "Bifaziales Modul der NeON H Serie für erhöhte Erträge durch Doppelglas-Design.",
          "basePrice": 300,
          "configurable": false,
          "specs": {
            "Leistung": "420 Wp",
            "Wirkungsgrad": "21.8 %",
            "Zell-Technologie": "Cello Bifacial",
            "Bifazialität": "85%"
          }
        },
        {
          "name": "NeON R LG400N2R-A5",
          "category": "Module",
          "manufacturerSlug": "lg-solar",
          "imageUrl": "",
          "description": "NeON R Serie mit Cello-Technologie für höchste Effizienz und Zuverlässigkeit.",
          "basePrice": 280,
          "configurable": false,
          "specs": {
            "Leistung": "400 Wp",
            "Wirkungsgrad": "21.7 %",
            "Zell-Technologie": "Cello N-Type"
          }
        }
      ]
    },
    {
      "slug": "longi-solar",
      "name": "LONGi Solar",
      "logoUrl": "/assets/logos/longi-solar.png",
      "category": [
        "Module"
      ],
      "description": "LONGi Solar ist ein weltweit führender Hersteller von hocheffizienten monokristallinen Solarmodulen. Das Unternehmen konzentriert sich auf die Entwicklung und Produktion von Mono-Wafern, -Zellen und -Modulen.",
      "whyWeTrust": [
        "Weltmarktführer in der Monokristallin-Technologie.",
        "Hohe Effizienz und Zuverlässigkeit der Produkte.",
        "Starkes Engagement in Forschung und Entwicklung."
      ],
      "products": [
        {
          "name": "Hi-MO 4m LR4-60HIBD 375W",
          "category": "Module",
          "manufacturerSlug": "longi-solar",
          "imageUrl": "",
          "description": "Kosteneffizientes Modul der Hi-MO 4m Serie für Standard-Anwendungen.",
          "basePrice": 135,
          "configurable": false,
          "specs": {
            "Leistung": "375 Wp",
            "Wirkungsgrad": "19.8 %",
            "Zell-Technologie": "Mono PERC"
          }
        },
        {
          "name": "Hi-MO 5m LR4-60HPH 405W",
          "category": "Module",
          "manufacturerSlug": "longi-solar",
          "imageUrl": "",
          "description": "Bewährte Hi-MO 5m Serie mit PERC-Technologie für Wohn- und Gewerbeanwendungen.",
          "basePrice": 145,
          "configurable": false,
          "specs": {
            "Leistung": "405 Wp",
            "Wirkungsgrad": "20.6 %",
            "Zell-Technologie": "Mono PERC"
          }
        },
        {
          "name": "Hi-MO 6 Explorer LR5-72HTH 545W",
          "category": "Module",
          "manufacturerSlug": "longi-solar",
          "imageUrl": "",
          "description": "Hi-MO 6 Serie mit hybridem TOPCon-Design für optimale Performance bei allen Lichtverhältnissen.",
          "basePrice": 165,
          "configurable": false,
          "specs": {
            "Leistung": "545 Wp",
            "Wirkungsgrad": "21.2 %",
            "Zell-Technologie": "TOPCon Hybrid"
          }
        },
        {
          "name": "Hi-MO 7 LR5-72HBD 570W Bifacial",
          "category": "Module",
          "manufacturerSlug": "longi-solar",
          "imageUrl": "",
          "description": "Bifaziales Modul der Hi-MO 7 Serie für erhöhte Erträge durch Rückseiteneinstrahlung.",
          "basePrice": 180,
          "configurable": false,
          "specs": {
            "Leistung": "570 Wp",
            "Wirkungsgrad": "21.8 %",
            "Zell-Technologie": "N-Type Bifacial",
            "Bifazialität": "85%"
          }
        },
        {
          "name": "Hi-MO X6 Explorer LR1-84HTH 605W",
          "category": "Module",
          "manufacturerSlug": "longi-solar",
          "imageUrl": "",
          "description": "Spitzenmodul der Hi-MO X6 Serie mit höchster Effizienz für anspruchsvollste Projekte.",
          "basePrice": 195,
          "configurable": false,
          "specs": {
            "Leistung": "605 Wp",
            "Wirkungsgrad": "22.8 %",
            "Zell-Technologie": "N-Type TOPCon"
          }
        }
      ]
    },
    {
      "slug": "magnum-energy",
      "name": "Magnum Energy",
      "logoUrl": "/assets/logos/magnum.png",
      "category": [
        "Elektrokomponenten"
      ],
      "description": "Magnum Energy ist ein US-amerikanischer Hersteller von Backup-Systemen mit Fokus auf Qualität und Zuverlässigkeit.",
      "whyWeTrust": [
        "Über 40 Jahre Erfahrung in der Backup-Technologie.",
        "Robuste und zuverlässige Systeme.",
        "Gute Kompatibilität mit verschiedenen Batterien."
      ],
      "products": [
        {
          "name": "Magnum MMS1012",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "magnum-energy",
          "imageUrl": "",
          "description": "Kompakte 12V-Version für kleinere Anlagen.",
          "basePrice": 1250,
          "configurable": false,
          "specs": {
            "Leistung": "1000 W",
            "Kapazität": "1440 Wh",
            "Spannung": "12 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Magnum MS4024PAE",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "magnum-energy",
          "imageUrl": "",
          "description": "Zuverlässiges Backup-System mit Magnum-Qualität.",
          "basePrice": 3650,
          "configurable": false,
          "specs": {
            "Leistung": "4000 W",
            "Kapazität": "9600 Wh",
            "Spannung": "24 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Magnum MS4448PAE",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "magnum-energy",
          "imageUrl": "",
          "description": "48V-Version mit höherer Kapazität.",
          "basePrice": 4250,
          "configurable": false,
          "specs": {
            "Leistung": "4400 W",
            "Kapazität": "21120 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Magnum RD2212",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "magnum-energy",
          "imageUrl": "",
          "description": "Mittelgroße 12V-Version.",
          "basePrice": 1850,
          "configurable": false,
          "specs": {
            "Leistung": "2200 W",
            "Kapazität": "2640 Wh",
            "Spannung": "12 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Magnum RD3924",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "magnum-energy",
          "imageUrl": "",
          "description": "Hochleistungs-24V-System.",
          "basePrice": 3150,
          "configurable": false,
          "specs": {
            "Leistung": "3900 W",
            "Kapazität": "9360 Wh",
            "Spannung": "24 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        }
      ]
    },
    {
      "slug": "mounting-systems",
      "name": "Mounting Systems",
      "logoUrl": "/assets/logos/mounting-systems.png",
      "category": [
        "Unterkonstruktion"
      ],
      "description": "Mounting Systems ist ein internationaler Hersteller von Montagesystemen mit Fokus auf modulare und skalierbare Lösungen.",
      "whyWeTrust": [
        "Modulare Systeme für flexible Anwendungen.",
        "Internationale Präsenz und Erfahrung.",
        "Innovative Lösungen für Dach und Bodenmontage."
      ],
      "products": [
        {
          "name": "Mounting Systems MS-COMPACT",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "mounting-systems",
          "imageUrl": "",
          "description": "Kompaktes System für kleinere Dachflächen.",
          "basePrice": 55,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "1600 Pa",
            "Neigungswinkel": "10-30°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Mounting Systems MS-FLAT",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "mounting-systems",
          "imageUrl": "",
          "description": "Modulares Flachdachsystem mit hoher Anpassungsfähigkeit.",
          "basePrice": 70,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "3600 Pa",
            "Neigungswinkel": "10-35°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Mounting Systems MS-GROUND",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "mounting-systems",
          "imageUrl": "",
          "description": "Bodenmontagesystem für Freiflächenanlagen mit stabiler Konstruktion.",
          "basePrice": 85,
          "configurable": false,
          "specs": {
            "Material": "Stahl/Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-60°",
            "Dachart": "Freifläche",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Mounting Systems MS-HEAVY",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "mounting-systems",
          "imageUrl": "",
          "description": "Schwerlastsystem für extreme Wetterbedingungen.",
          "basePrice": 110,
          "configurable": false,
          "specs": {
            "Material": "Stahl",
            "Belastung": "7200 Pa",
            "Neigungswinkel": "10-45°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Mounting Systems MS-TILT",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "mounting-systems",
          "imageUrl": "",
          "description": "Flexibles System für geneigte Dächer aller Art.",
          "basePrice": 65,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "15-45°",
            "Dachart": "Pultdach",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "outback-power",
      "name": "OutBack Power",
      "logoUrl": "/assets/logos/outback.png",
      "category": [
        "Elektrokomponenten"
      ],
      "description": "OutBack Power ist ein US-amerikanischer Hersteller von Backup-Systemen für Off-Grid und Backup-Anwendungen.",
      "whyWeTrust": [
        "Über 40 Jahre Erfahrung in der Backup-Technologie.",
        "Robuste Systeme für extreme Bedingungen.",
        "Umfassende Produktpalette für verschiedene Anwendungen."
      ],
      "products": [
        {
          "name": "OutBack GFX1312E",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "outback-power",
          "imageUrl": "",
          "description": "12V-Version für kleinere Systeme.",
          "basePrice": 1450,
          "configurable": false,
          "specs": {
            "Leistung": "1300 W",
            "Kapazität": "1560 Wh",
            "Spannung": "12 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "OutBack GFX1424E",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "outback-power",
          "imageUrl": "",
          "description": "24V-System mit guter Leistung.",
          "basePrice": 1650,
          "configurable": false,
          "specs": {
            "Leistung": "1400 W",
            "Kapazität": "3360 Wh",
            "Spannung": "24 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "OutBack Radian GS4048A",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "outback-power",
          "imageUrl": "",
          "description": "Hochleistungs-Hybrid mit integriertem Backup.",
          "basePrice": 3850,
          "configurable": false,
          "specs": {
            "Leistung": "4000 W",
            "Kapazität": "7680 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "OutBack Radian GS8048A",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "outback-power",
          "imageUrl": "",
          "description": "Professionelles System für große Backup-Anlagen.",
          "basePrice": 5200,
          "configurable": false,
          "specs": {
            "Leistung": "8000 W",
            "Kapazität": "15360 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "OutBack VFXR3048A",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "outback-power",
          "imageUrl": "",
          "description": "Robustes Backup-System für Off-Grid und Backup-Anwendungen.",
          "basePrice": 2750,
          "configurable": false,
          "specs": {
            "Leistung": "3000 W",
            "Kapazität": "4800 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        }
      ]
    },
    {
      "slug": "panasonic",
      "name": "Panasonic",
      "logoUrl": "/assets/logos/panasonic.png",
      "category": [
        "Module"
      ],
      "description": "Panasonic ist ein Technologiekonzern mit jahrzehntelanger Erfahrung in der Elektronik. Die HIT-Solarmodule von Panasonic gehören zu den effizientesten und langlebigsten auf dem Markt.",
      "whyWeTrust": [
        "Höchste Moduleffizienz und bewährte Heterojunction-Technologie (HIT).",
        "Außergewöhnliche Leistung bei hohen Temperaturen und Schwachlicht.",
        "25 Jahre Produktgarantie und hervorragende Langzeiterfahrung."
      ],
      "products": [
        {
          "name": "EVERVOLT HIT Black VBHN325SA16",
          "category": "Module",
          "manufacturerSlug": "panasonic",
          "imageUrl": "",
          "description": "Elegante schwarze HIT-Module für höchste ästhetische Ansprüche bei Premium-Installationen.",
          "basePrice": 320,
          "configurable": false,
          "specs": {
            "Leistung": "325 Wp",
            "Wirkungsgrad": "19.4 %",
            "Zell-Technologie": "HIT Schwarz"
          }
        },
        {
          "name": "EVERVOLT HIT VBHN330SA17",
          "category": "Module",
          "manufacturerSlug": "panasonic",
          "imageUrl": "",
          "description": "EVERVOLT HIT-Modul mit patentierter Heterojunction-Technologie für Premium-Anwendungen.",
          "basePrice": 295,
          "configurable": false,
          "specs": {
            "Leistung": "330 Wp",
            "Wirkungsgrad": "19.7 %",
            "Zell-Technologie": "HIT (Heterojunction)"
          }
        },
        {
          "name": "EVERVOLT HIT+ VBHN340SA17",
          "category": "Module",
          "manufacturerSlug": "panasonic",
          "imageUrl": "",
          "description": "Weiterentwickelte HIT+ Technologie für noch höhere Effizienz und bessere Schwachlichtperformance.",
          "basePrice": 310,
          "configurable": false,
          "specs": {
            "Leistung": "340 Wp",
            "Wirkungsgrad": "20.3 %",
            "Zell-Technologie": "HIT+ (Enhanced)"
          }
        },
        {
          "name": "HIT H350",
          "category": "Module",
          "manufacturerSlug": "panasonic",
          "imageUrl": "",
          "description": "Spitzenmodul der HIT-Serie für maximale Leistung in anspruchsvollen Umgebungen.",
          "basePrice": 330,
          "configurable": false,
          "specs": {
            "Leistung": "350 Wp",
            "Wirkungsgrad": "20.5 %",
            "Zell-Technologie": "HIT High Efficiency"
          }
        },
        {
          "name": "HIT N340 Black",
          "category": "Module",
          "manufacturerSlug": "panasonic",
          "imageUrl": "",
          "description": "N-Type HIT-Modul mit verbesserter Effizienz und Zuverlässigkeit.",
          "basePrice": 305,
          "configurable": false,
          "specs": {
            "Leistung": "340 Wp",
            "Wirkungsgrad": "20.1 %",
            "Zell-Technologie": "HIT N-Type"
          }
        }
      ]
    },
    {
      "slug": "q-cells",
      "name": "Q-Cells",
      "logoUrl": "/assets/logos/q-cells.png",
      "category": [
        "Module"
      ],
      "description": "Hanwha Q CELLS ist einer der weltweit größten und bekanntesten Photovoltaikhersteller. Bekannt für seine hohe Qualität und innovative Q.ANTUM-Technologie, bietet Q-Cells zuverlässige und leistungsstarke Solarlösungen.",
      "whyWeTrust": [
        "Exzellentes Preis-Leistungs-Verhältnis.",
        "Hohe Zuverlässigkeit und bewährte Leistung unter realen Bedingungen.",
        "Innovative Q.ANTUM DUO Z-Technologie reduziert Leistungsverluste."
      ],
      "products": [
        {
          "name": "Q.ANTUM NEO SOLAR MODULE",
          "category": "Module",
          "manufacturerSlug": "q-cells",
          "imageUrl": "",
          "description": "Hocheffizientes Modul mit Q.ANTUM NEO Technologie für maximale Energieausbeute.",
          "basePrice": 200,
          "configurable": false,
          "specs": {
            "Leistung": "440-455 Wp",
            "Wirkungsgrad": "22.8 %",
            "Zell-Technologie": "Q.ANTUM NEO"
          }
        },
        {
          "name": "Q.PEAK DUO BLK ML-G10+",
          "category": "Module",
          "manufacturerSlug": "q-cells",
          "imageUrl": "",
          "description": "Vollschwarzes Premium-Solarmodul mit optimierter Ästhetik für anspruchsvolle Wohngebäude.",
          "basePrice": 185,
          "configurable": false,
          "specs": {
            "Leistung": "405 Wp",
            "Wirkungsgrad": "20.6 %",
            "Zell-Technologie": "Q.ANTUM DUO Z"
          }
        },
        {
          "name": "Q.PEAK DUO ML-G11S",
          "category": "Module",
          "manufacturerSlug": "q-cells",
          "imageUrl": "https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop",
          "description": "Das Solarmodul mit bis zu 415 Wp ist die ideale und wirtschaftliche Lösung für private und gewerbliche Aufdachanlagen.",
          "basePrice": 195,
          "configurable": false,
          "specs": {
            "Leistung": "415 Wp",
            "Wirkungsgrad": "21.3 %",
            "Zell-Technologie": "Q.ANTUM DUO Z",
            "Produktgarantie": "25 Jahre",
            "Leistungsgarantie": "25 Jahre (86%)"
          },
          "keyFeatures": [
            "Top Preis-Leistung",
            "Hohe Zuverlässigkeit",
            "Wetterfest (Anti-LID, LeTID)"
          ]
        },
        {
          "name": "Q.TRON BLACK",
          "category": "Module",
          "manufacturerSlug": "q-cells",
          "imageUrl": "",
          "description": "Vollschwarzes Modul mit ausgezeichneter Performance und Allwetter-Technologie.",
          "basePrice": 190,
          "configurable": false,
          "specs": {
            "Leistung": "445 Wp",
            "Wirkungsgrad": "22.3 %",
            "Zell-Technologie": "Q.ANTUM NEO"
          }
        },
        {
          "name": "Q.TRON BLK M-G2+",
          "category": "Module",
          "manufacturerSlug": "q-cells",
          "imageUrl": "https://images.unsplash.com/photo-1662973163920-7435f1f9f257?q=80&w=870&auto=format&fit=crop",
          "description": "N-Type-Zelltechnologie für höchste Effizienz und Langlebigkeit, ideal für anspruchsvolle Projekte mit bestem Schwachlichtverhalten.",
          "basePrice": 240,
          "configurable": false,
          "specs": {
            "Leistung": "430 Wp",
            "Wirkungsgrad": "22.5 %",
            "Zell-Technologie": "N-Type Q.ANTUM NEO",
            "Produktgarantie": "25 Jahre",
            "Leistungsgarantie": "25 Jahre (90.5%)",
            "Temperaturkoeffizient Pmax": "-0.30 %/°C"
          },
          "keyFeatures": [
            "N-Type Premium-Technologie",
            "Exzellentes Schwachlichtverhalten",
            "Lange Lebensdauer"
          ]
        },
        {
          "name": "Q.TRON CLASSIC",
          "category": "Module",
          "manufacturerSlug": "q-cells",
          "imageUrl": "",
          "description": "Klassisches Design mit höchster Effizienz für professionelle Installationen.",
          "basePrice": 210,
          "configurable": false,
          "specs": {
            "Leistung": "495-515 Wp",
            "Wirkungsgrad": "23.2 %",
            "Zell-Technologie": "Q.ANTUM NEO"
          }
        }
      ]
    },
    {
      "slug": "rec",
      "name": "REC Solar",
      "logoUrl": "/assets/logos/rec-solar.png",
      "category": [
        "Module"
      ],
      "description": "REC ist ein europäischer Pionier der Solarenergie seit 1996. Das norwegische Unternehmen entwickelt und produziert Solarzellen und -module und ist bekannt für seine Innovationen und hohe Qualität.",
      "whyWeTrust": [
        "Europäische Qualität und Innovation seit über 25 Jahren.",
        "Branchenführende Heterojunction-Technologie (Alpha Pure Serie).",
        "Hervorragende Leistung bei Schwachlicht und hohen Temperaturen."
      ],
      "products": [
        {
          "name": "REC Alpha Pure Black 405W",
          "category": "Module",
          "manufacturerSlug": "rec",
          "imageUrl": "",
          "description": "Elegantes Vollschwarz-Design der Alpha Pure Serie für anspruchsvolle Architektur.",
          "basePrice": 275,
          "configurable": false,
          "specs": {
            "Leistung": "405 Wp",
            "Wirkungsgrad": "21.7 %",
            "Zell-Technologie": "Heterojunction"
          }
        },
        {
          "name": "REC Alpha Pure-R 430W",
          "category": "Module",
          "manufacturerSlug": "rec",
          "imageUrl": "",
          "description": "Premium Alpha Pure Serie mit Heterojunction-Technologie für höchste Effizienz und Langlebigkeit.",
          "basePrice": 260,
          "configurable": false,
          "specs": {
            "Leistung": "430 Wp",
            "Wirkungsgrad": "22.3 %",
            "Zell-Technologie": "Heterojunction"
          }
        },
        {
          "name": "REC TwinPeak 5 Mono 380W",
          "category": "Module",
          "manufacturerSlug": "rec",
          "imageUrl": "",
          "description": "TwinPeak 5 Serie mit Split-Cell-Technologie für reduzierte Hotspot-Bildung.",
          "basePrice": 190,
          "configurable": false,
          "specs": {
            "Leistung": "380 Wp",
            "Wirkungsgrad": "19.9 %",
            "Zell-Technologie": "Mono PERC"
          }
        }
      ]
    },
    {
      "slug": "renusol",
      "name": "Renusol",
      "logoUrl": "/assets/logos/renusol.png",
      "category": [
        "Unterkonstruktion"
      ],
      "description": "Renusol ist ein etablierter Hersteller von Montagesystemen mit Fokus auf bewährte Technik und Zuverlässigkeit.",
      "whyWeTrust": [
        "Langjährige Erfahrung und bewährte Technik.",
        "Umfassende Produktpalette für alle Anwendungen.",
        "Hohe Qualitätsstandards und Service."
      ],
      "products": [
        {
          "name": "Renusol ConSole",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "renusol",
          "imageUrl": "",
          "description": "Klassisches Konsolsystem für geneigte Dächer mit bewährter Technik.",
          "basePrice": 62,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "15-45°",
            "Dachart": "Pultdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Renusol ConSole+",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "renusol",
          "imageUrl": "",
          "description": "Erweiterte Version mit höherer Belastbarkeit.",
          "basePrice": 75,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "3600 Pa",
            "Neigungswinkel": "15-45°",
            "Dachart": "Pultdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Renusol FlatCon",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "renusol",
          "imageUrl": "",
          "description": "Flachdachsystem mit optimierter Materialeffizienz.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-30°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Renusol FlatCon Plus",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "renusol",
          "imageUrl": "",
          "description": "Hochbelastbares Flachdachsystem für anspruchsvolle Standorte.",
          "basePrice": 82,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "3600 Pa",
            "Neigungswinkel": "10-35°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Renusol GroundFix",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "renusol",
          "imageUrl": "",
          "description": "Bodenmontagesystem für Freiflächenanlagen aller Größen.",
          "basePrice": 78,
          "configurable": false,
          "specs": {
            "Material": "Stahl/Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-60°",
            "Dachart": "Freifläche",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "schletter",
      "name": "Schletter Group",
      "logoUrl": "/assets/logos/schletter.png",
      "category": [
        "Unterkonstruktion"
      ],
      "description": "Schletter ist ein weltweit führender Hersteller von Montagesystemen für Solaranlagen mit über 40 Jahren Erfahrung.",
      "whyWeTrust": [
        "Über 40 Jahre Erfahrung in der Solarbranche.",
        "Innovative Systemlösungen für alle Anwendungsbereiche.",
        "Höchste Qualitätsstandards und umfassende Garantien."
      ],
      "products": [
        {
          "name": "Schletter FixGrid Plus",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "schletter",
          "imageUrl": "",
          "description": "Kosteneffizientes Flachdachsystem mit optimierter Materialausnutzung.",
          "basePrice": 75,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "3600 Pa",
            "Neigungswinkel": "10-35°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Schletter FixGrid Pro",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "schletter",
          "imageUrl": "",
          "description": "Professionelles Montagesystem für Flachdächer mit höchster Stabilität und Flexibilität.",
          "basePrice": 85,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "5400 Pa",
            "Neigungswinkel": "10-45°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Schletter FixGrid Universal",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "schletter",
          "imageUrl": "",
          "description": "Universelles Montagesystem für verschiedene Flachdach-Anwendungen.",
          "basePrice": 65,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-30°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Schletter FixGrid XXL",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "schletter",
          "imageUrl": "",
          "description": "Hochbelastbares System für extreme Wind- und Schneelasten.",
          "basePrice": 120,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "7200 Pa",
            "Neigungswinkel": "10-50°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Schletter S-Dome",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "schletter",
          "imageUrl": "",
          "description": "Einfaches und schnelles Montagesystem für kleinere Anlagen.",
          "basePrice": 55,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "1600 Pa",
            "Neigungswinkel": "10-25°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "schneider-electric",
      "name": "Schneider Electric",
      "logoUrl": "/assets/logos/schneider-electric.png",
      "category": [
        "Wechselrichter",
        "Elektrokomponenten"
      ],
      "description": "Schneider Electric ist ein globaler Konzern mit umfassenden Energie-Management-Lösungen.",
      "whyWeTrust": [
        "Über 180 Jahre Erfahrung in der Elektrotechnik.",
        "Globale Präsenz und umfassender Service.",
        "Höchste Sicherheits- und Qualitätsstandards."
      ],
      "products": [
        {
          "name": "Schneider Conext CL-125E",
          "category": "Wechselrichter",
          "manufacturerSlug": "schneider-electric",
          "imageUrl": "",
          "description": "Hochleistungs-Zentralwechselrichter für große gewerbliche Anlagen.",
          "basePrice": 7800,
          "configurable": false,
          "specs": {
            "Leistung": "125000 W",
            "Wirkungsgrad": "98.0 %",
            "Phasen": "3",
            "Typ": "Zentral-Wechselrichter"
          }
        },
        {
          "name": "Schneider Conext CL-60E",
          "category": "Wechselrichter",
          "manufacturerSlug": "schneider-electric",
          "imageUrl": "",
          "description": "Zentralwechselrichter mit integriertem Transformator für mittlere Anlagen.",
          "basePrice": 5200,
          "configurable": false,
          "specs": {
            "Leistung": "60000 W",
            "Wirkungsgrad": "97.8 %",
            "Phasen": "3",
            "Typ": "Zentral-Wechselrichter"
          }
        },
        {
          "name": "Schneider Conext Core XC",
          "category": "Wechselrichter",
          "manufacturerSlug": "schneider-electric",
          "imageUrl": "",
          "description": "Modularer String-Wechselrichter mit skalierbarem Design für verschiedene Anlagengrößen.",
          "basePrice": 4500,
          "configurable": false,
          "specs": {
            "Leistung": "6800-125000 W",
            "Wirkungsgrad": "97.5 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Schneider Conext SW",
          "category": "Wechselrichter",
          "manufacturerSlug": "schneider-electric",
          "imageUrl": "",
          "description": "Hybrid-Wechselrichter mit Batterieunterstützung für Backup-Systeme.",
          "basePrice": 2200,
          "configurable": false,
          "specs": {
            "Leistung": "3800-6000 W",
            "Wirkungsgrad": "97.0 %",
            "Phasen": "1",
            "Typ": "Hybrid-Wechselrichter"
          }
        },
        {
          "name": "Schneider Conext SW 4024",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "schneider-electric",
          "imageUrl": "",
          "description": "24V-Hybrid mit integriertem Backup-Modus.",
          "basePrice": 3650,
          "configurable": false,
          "specs": {
            "Leistung": "4000 W",
            "Kapazität": "9600 Wh",
            "Spannung": "24 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Schneider Conext SW 4048",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "schneider-electric",
          "imageUrl": "",
          "description": "48V-Version mit höherer Kapazität.",
          "basePrice": 3950,
          "configurable": false,
          "specs": {
            "Leistung": "4000 W",
            "Kapazität": "19200 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Schneider Conext XW Pro",
          "category": "Wechselrichter",
          "manufacturerSlug": "schneider-electric",
          "imageUrl": "",
          "description": "Professioneller Hybrid-Wechselrichter für Insel- und Grid-Tie Anwendungen.",
          "basePrice": 2800,
          "configurable": false,
          "specs": {
            "Leistung": "6800 W",
            "Wirkungsgrad": "96.5 %",
            "Phasen": "1",
            "Typ": "Hybrid-Wechselrichter"
          }
        },
        {
          "name": "Schneider Conext XW+ 5548",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "schneider-electric",
          "imageUrl": "",
          "description": "Professionelles Hybrid-System mit XW Power Distribution Panel.",
          "basePrice": 4250,
          "configurable": false,
          "specs": {
            "Leistung": "5500 W",
            "Kapazität": "10560 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Schneider Conext XW+ 6848",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "schneider-electric",
          "imageUrl": "",
          "description": "Hochleistungs-Hybrid für größere Anlagen.",
          "basePrice": 4850,
          "configurable": false,
          "specs": {
            "Leistung": "6800 W",
            "Kapazität": "13056 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Schneider Conext XW+ 8548",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "schneider-electric",
          "imageUrl": "",
          "description": "Premium-Hybrid mit erweiterten Backup-Funktionen.",
          "basePrice": 5500,
          "configurable": false,
          "specs": {
            "Leistung": "8500 W",
            "Kapazität": "16320 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "5 Jahre"
          }
        }
      ]
    },
    {
      "slug": "selectronic",
      "name": "Selectronic Australia",
      "logoUrl": "/assets/logos/selectronic.png",
      "category": [
        "Elektrokomponenten"
      ],
      "description": "Selectronic ist ein australischer Hersteller von Backup-Systemen mit extrem schneller Umschaltzeit.",
      "whyWeTrust": [
        "Australische Qualität und Robustheit.",
        "Extrem schnelle Umschaltzeiten (<5ms).",
        "Umfassende Erfahrung in der Backup-Technologie."
      ],
      "products": [
        {
          "name": "Selectronic SP PRO 10kW",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "selectronic",
          "imageUrl": "",
          "description": "Professionelles System für gewerbliche Backup-Anwendungen.",
          "basePrice": 7200,
          "configurable": false,
          "specs": {
            "Leistung": "10000 W",
            "Kapazität": "20000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<5 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Selectronic SP PRO 15kW",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "selectronic",
          "imageUrl": "",
          "description": "Höchstleistungs-Backup für kritische Infrastruktur.",
          "basePrice": 9500,
          "configurable": false,
          "specs": {
            "Leistung": "15000 W",
            "Kapazität": "30000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<5 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Selectronic SP PRO 20kW",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "selectronic",
          "imageUrl": "",
          "description": "Megawatt-Backup-System für große Anlagen.",
          "basePrice": 12500,
          "configurable": false,
          "specs": {
            "Leistung": "20000 W",
            "Kapazität": "40000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<5 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Selectronic SP PRO 5kW",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "selectronic",
          "imageUrl": "",
          "description": "Australisches Qualitätsprodukt mit schneller Umschaltzeit.",
          "basePrice": 4200,
          "configurable": false,
          "specs": {
            "Leistung": "5000 W",
            "Kapazität": "10000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<5 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Selectronic SP PRO 8kW",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "selectronic",
          "imageUrl": "",
          "description": "Hochleistungs-Version für größere Anlagen.",
          "basePrice": 5800,
          "configurable": false,
          "specs": {
            "Leistung": "8000 W",
            "Kapazität": "16000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<5 ms",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "sma",
      "name": "SMA Solar Technology",
      "logoUrl": "/assets/logos/sma.png",
      "category": [
        "Wechselrichter",
        "Speicher",
        "Elektrokomponenten"
      ],
      "description": "SMA ist ein deutscher Hersteller von Wechselrichtern und Energiespeichersystemen mit umfassenden Backup-Lösungen.",
      "whyWeTrust": [
        "Über 40 Jahre Erfahrung in der Solartechnik.",
        "Umfassende Monitoring-Lösungen mit Sunny Portal.",
        "Hohe Qualität und Zuverlässigkeit."
      ],
      "products": [
        {
          "name": "SMA Sunny Backup 2200",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Intelligentes Backup-System mit Sunny Portal Integration.",
          "basePrice": 2200,
          "configurable": false,
          "specs": {
            "Leistung": "2200 W",
            "Kapazität": "2000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "SMA Sunny Backup 5000",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Hochleistungs-Backup für mittlere bis große Anlagen.",
          "basePrice": 3800,
          "configurable": false,
          "specs": {
            "Leistung": "5000 W",
            "Kapazität": "5000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "SMA Sunny Backup 8000",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Professionelles Backup-System für gewerbliche Anwendungen.",
          "basePrice": 5200,
          "configurable": false,
          "specs": {
            "Leistung": "8000 W",
            "Kapazität": "8000 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "SMA Sunny Boy 5.0-6.0",
          "category": "Wechselrichter",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Zuverlässiger String-Wechselrichter für Wohnanlagen mit optimierter MPP-Tracking.",
          "basePrice": 1200,
          "configurable": false,
          "specs": {
            "Leistung": "5000-6000 W",
            "Wirkungsgrad": "97.5 %",
            "Phasen": "1",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "SMA Sunny Boy Storage 3.7",
          "category": "Speicher",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Intelligentes Batteriesystem mit Sunny Portal Monitoring.",
          "basePrice": 4200,
          "configurable": false,
          "specs": {
            "Kapazität": "2.0-10.0 kWh",
            "Leistung": "3.7 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "SMA Sunny Boy Storage 5.0",
          "category": "Speicher",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Erweiterte Version mit höherer Leistung.",
          "basePrice": 5800,
          "configurable": false,
          "specs": {
            "Kapazität": "2.0-15.0 kWh",
            "Leistung": "5.0 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "SMA Sunny Boy Storage 6.0",
          "category": "Speicher",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Hochleistungssystem mit erweiterten Monitoring-Funktionen.",
          "basePrice": 7200,
          "configurable": false,
          "specs": {
            "Kapazität": "2.0-18.0 kWh",
            "Leistung": "6.0 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "SMA Sunny Central Backup 100",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Hochleistungs-Backup für große Industrieanlagen.",
          "basePrice": 85000,
          "configurable": false,
          "specs": {
            "Leistung": "100000 W",
            "Kapazität": "200000 Wh",
            "Spannung": "400 V",
            "Umschaltzeit": "<100 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "SMA Sunny Central Backup 50",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Großspeicher-Backup für kritische Infrastruktur.",
          "basePrice": 45000,
          "configurable": false,
          "specs": {
            "Leistung": "50000 W",
            "Kapazität": "100000 Wh",
            "Spannung": "400 V",
            "Umschaltzeit": "<100 ms",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "SMA Sunny Central Storage 2200",
          "category": "Speicher",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Großspeichersystem für Utility-Scale Anwendungen.",
          "basePrice": 280000,
          "configurable": false,
          "specs": {
            "Kapazität": "2200 kWh",
            "Leistung": "1100 kW",
            "Spannung": "1500 V",
            "Zyklen": "5000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "SMA Sunny Central Storage 2750",
          "category": "Speicher",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Erweiterte Version für größere Energiespeicherprojekte.",
          "basePrice": 350000,
          "configurable": false,
          "specs": {
            "Kapazität": "2750 kWh",
            "Leistung": "1100 kW",
            "Spannung": "1500 V",
            "Zyklen": "5000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "SMA Sunny Highpower PEAK3",
          "category": "Wechselrichter",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Hochleistungs-Zentralwechselrichter für große Solarparks mit maximaler Effizienz.",
          "basePrice": 15000,
          "configurable": false,
          "specs": {
            "Leistung": "100000-150000 W",
            "Wirkungsgrad": "98.5 %",
            "Phasen": "3",
            "Typ": "Zentral-Wechselrichter"
          }
        },
        {
          "name": "SMA Sunny Island 8.0H-11.0H",
          "category": "Wechselrichter",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Hybrid-Wechselrichter mit integrierter Batterieladefunktion für Insel- und Backup-Systeme.",
          "basePrice": 3500,
          "configurable": false,
          "specs": {
            "Leistung": "8000-11000 W",
            "Wirkungsgrad": "95.5 %",
            "Phasen": "1",
            "Typ": "Hybrid-Wechselrichter"
          }
        },
        {
          "name": "SMA Sunny Tripower Smart Energy",
          "category": "Wechselrichter",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Intelligenter Hybrid-Wechselrichter mit Energiemanagement für Smart-Home-Anwendungen.",
          "basePrice": 2800,
          "configurable": false,
          "specs": {
            "Leistung": "8000-10000 W",
            "Wirkungsgrad": "98.2 %",
            "Phasen": "3",
            "Typ": "Hybrid-Wechselrichter"
          }
        },
        {
          "name": "SMA Sunny Tripower X 10-50",
          "category": "Wechselrichter",
          "manufacturerSlug": "sma",
          "imageUrl": "",
          "description": "Hochleistungs-String-Wechselrichter mit integriertem Energiemanagement für gewerbliche Anlagen.",
          "basePrice": 2500,
          "configurable": false,
          "specs": {
            "Leistung": "10000-50000 W",
            "Wirkungsgrad": "98.0 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Sunny Boy 5.0",
          "category": "Wechselrichter",
          "manufacturerSlug": "sma",
          "imageUrl": "https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit=crop",
          "description": "Der bewährte Standard-Wechselrichter für private Aufdachanlagen. Zuverlässig, effizient und einfach zu installieren.",
          "basePrice": 1250,
          "configurable": false,
          "specs": {
            "AC-Nennleistung": "5.0 kW",
            "Max. DC-Leistung": "7.5 kWp",
            "Europ. Wirkungsgrad": "96.5 %",
            "MPP-Tracker": 2,
            "Kommunikation": "WLAN, Ethernet",
            "Schutzart": "IP65",
            "Garantie": "5 + 5 Jahre"
          },
          "keyFeatures": [
            "Bewährter Klassiker",
            "Einfache Installation",
            "SMA Smart Connected"
          ]
        },
        {
          "name": "Sunny Tripower CORE1",
          "category": "Wechselrichter",
          "manufacturerSlug": "sma",
          "imageUrl": "https://images.unsplash.com/photo-1582285521820-22d24b611688?q=80&w=870&auto=format&fit=crop",
          "description": "Der weltweit erste frei stehende String-Wechselrichter für dezentrale gewerbliche Aufdachanlagen und Freiflächen. Spart Installationszeit und Kosten.",
          "basePrice": 3800,
          "configurable": false,
          "specs": {
            "AC-Nennleistung": "50.0 kW",
            "Max. DC-Leistung": "75 kWp",
            "Max. Wirkungsgrad": "98.1 %",
            "MPP-Tracker": 6,
            "Kommunikation": "Ethernet",
            "Schutzart": "IP65",
            "Garantie": "5 Jahre"
          },
          "keyFeatures": [
            "Für Gewerbeanlagen",
            "Schnelle Installation",
            "Hohe Leistungsklasse"
          ]
        },
        {
          "name": "Sunny Tripower X",
          "category": "Wechselrichter",
          "manufacturerSlug": "sma",
          "imageUrl": "https://images.unsplash.com/photo-1582285521820-22d24b611688?q=80&w=870&auto=format&fit=crop",
          "description": "Die innovative Systemlösung für gewerbliche und industrielle PV-Anlagen mit integrierten Smart-Funktionen.",
          "basePrice": 2100,
          "configurable": false,
          "specs": {
            "AC-Nennleistung": "25.0 kW",
            "Max. DC-Leistung": "37.5 kWp",
            "Max. Wirkungsgrad": "98.5 %",
            "MPP-Tracker": 3,
            "Kommunikation": "Ethernet, WLAN (opt.)",
            "Schutzart": "IP65",
            "Garantie": "5 + 5 Jahre"
          },
          "keyFeatures": [
            "System-Manager integriert",
            "Direct-Marketing fähig",
            "SMA ArcFix-Lichtbogenschutz"
          ]
        }
      ]
    },
    {
      "slug": "solaredge",
      "name": "SolarEdge Technologies",
      "logoUrl": "/assets/logos/solaredge.png",
      "category": [
        "Wechselrichter",
        "Leistungsoptimierer"
      ],
      "description": "SolarEdge ist ein weltweit führender Hersteller von Power Optimizern und intelligenter Solartechnik.",
      "whyWeTrust": [
        "Über 10 Jahre Erfahrung mit Power Optimizer Technologie.",
        "Höchste Effizienz und umfassendes Monitoring.",
        "25 Jahre Garantie auf Optimizer."
      ],
      "products": [
        {
          "name": "SolarEdge P320",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "solaredge",
          "imageUrl": "",
          "description": "Hochleistungs-Power-Optimizer mit integriertem Monitoring für maximale Modulleistung.",
          "basePrice": 45,
          "configurable": false,
          "specs": {
            "Leistung": "320 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "SolarEdge P370",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "solaredge",
          "imageUrl": "",
          "description": "Erweiterte Version für höhere Modulleistungen bis 370W.",
          "basePrice": 52,
          "configurable": false,
          "specs": {
            "Leistung": "370 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "SolarEdge P404",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "solaredge",
          "imageUrl": "",
          "description": "Power Optimizer für moderne Hochleistungsmodule.",
          "basePrice": 58,
          "configurable": false,
          "specs": {
            "Leistung": "404 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "SolarEdge P485",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "solaredge",
          "imageUrl": "",
          "description": "Professioneller Optimizer für große Solarmodule.",
          "basePrice": 65,
          "configurable": false,
          "specs": {
            "Leistung": "485 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "SolarEdge P505",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "solaredge",
          "imageUrl": "",
          "description": "Höchstleistungs-Optimizer für Utility-Scale Anwendungen.",
          "basePrice": 72,
          "configurable": false,
          "specs": {
            "Leistung": "505 W",
            "Eingangsspannung": "8-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "SolarEdge SE100K",
          "category": "Wechselrichter",
          "manufacturerSlug": "solaredge",
          "imageUrl": "",
          "description": "Zentralwechselrichter mit 12 MPP-Trackern für Solarparks.",
          "basePrice": 8500,
          "configurable": false,
          "specs": {
            "Leistung": "100000 W",
            "Wirkungsgrad": "98.9 %",
            "Phasen": "3",
            "Typ": "Zentral-Wechselrichter"
          }
        },
        {
          "name": "SolarEdge SE12.5K-25K",
          "category": "Wechselrichter",
          "manufacturerSlug": "solaredge",
          "imageUrl": "",
          "description": "Dreiphasiger Wechselrichter mit 3 MPP-Trackern für gewerbliche Anlagen.",
          "basePrice": 2200,
          "configurable": false,
          "specs": {
            "Leistung": "12500-25000 W",
            "Wirkungsgrad": "98.5 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "SolarEdge SE3000H HD-Wave",
          "category": "Wechselrichter",
          "manufacturerSlug": "solaredge",
          "imageUrl": "",
          "description": "HD-Wave Technologie mit Power Optimizer für maximale Effizienz und Sicherheit.",
          "basePrice": 1400,
          "configurable": false,
          "specs": {
            "Leistung": "3000 W",
            "Wirkungsgrad": "99.2 %",
            "Phasen": "1",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "SolarEdge SE33.3K-50K",
          "category": "Wechselrichter",
          "manufacturerSlug": "solaredge",
          "imageUrl": "",
          "description": "Hochleistungs-Wechselrichter mit 6 MPP-Trackern für große Anlagen.",
          "basePrice": 3500,
          "configurable": false,
          "specs": {
            "Leistung": "33300-50000 W",
            "Wirkungsgrad": "98.7 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "SolarEdge SE5000H-10K",
          "category": "Wechselrichter",
          "manufacturerSlug": "solaredge",
          "imageUrl": "",
          "description": "Einphasiger Wechselrichter mit integriertem Monitoring für Wohnanlagen.",
          "basePrice": 1600,
          "configurable": false,
          "specs": {
            "Leistung": "5000-10000 W",
            "Wirkungsgrad": "98.8 %",
            "Phasen": "1",
            "Typ": "String-Wechselrichter"
          }
        }
      ]
    },
    {
      "slug": "sonnen",
      "name": "Sonnen",
      "logoUrl": "/assets/logos/sonnen.png",
      "category": [
        "Speicher"
      ],
      "description": "Sonnen ist ein deutscher Hersteller von intelligenten Energiespeichersystemen mit Fokus auf Cloud-basiertes Energiemanagement.",
      "whyWeTrust": [
        "Intelligente Software und Cloud-Management.",
        "Hohe Zuverlässigkeit und lange Lebensdauer.",
        "Innovative Energiegemeinschaft-Konzepte."
      ],
      "products": [
        {
          "name": "Sonnen ecoLinx",
          "category": "Speicher",
          "manufacturerSlug": "sonnen",
          "imageUrl": "",
          "description": "Intelligentes Batteriesystem mit Cloud-Management für optimale Energieeffizienz.",
          "basePrice": 4200,
          "configurable": false,
          "specs": {
            "Kapazität": "4.0 kWh",
            "Leistung": "2.0 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Sonnen sonnenBatterie 10",
          "category": "Speicher",
          "manufacturerSlug": "sonnen",
          "imageUrl": "",
          "description": "Hochkapazitives System für größere Energieautarkie.",
          "basePrice": 8500,
          "configurable": false,
          "specs": {
            "Kapazität": "10.0 kWh",
            "Leistung": "5.0 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Sonnen sonnenBatterie 12",
          "category": "Speicher",
          "manufacturerSlug": "sonnen",
          "imageUrl": "",
          "description": "Professionelles System mit erweiterten Backup-Funktionen.",
          "basePrice": 9500,
          "configurable": false,
          "specs": {
            "Kapazität": "12.0 kWh",
            "Leistung": "6.0 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Sonnen sonnenBatterie 15",
          "category": "Speicher",
          "manufacturerSlug": "sonnen",
          "imageUrl": "",
          "description": "Maximal erweiterbares System für kommerzielle Anwendungen.",
          "basePrice": 11500,
          "configurable": false,
          "specs": {
            "Kapazität": "15.0 kWh",
            "Leistung": "7.5 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Sonnen sonnenBatterie 8",
          "category": "Speicher",
          "manufacturerSlug": "sonnen",
          "imageUrl": "",
          "description": "Modulares System mit intelligenter Lastverteilung.",
          "basePrice": 7200,
          "configurable": false,
          "specs": {
            "Kapazität": "8.0 kWh",
            "Leistung": "4.0 kW",
            "Spannung": "48 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "studer",
      "name": "Studer Innotec",
      "logoUrl": "/assets/logos/studer.png",
      "category": [
        "Elektrokomponenten"
      ],
      "description": "Studer Innotec ist ein Schweizer Hersteller von Energie-Management-Systemen mit höchsten Qualitätsstandards.",
      "whyWeTrust": [
        "Schweizer Präzision und Qualität seit 1987.",
        "Innovative Transfer-Systeme für unterbrechungsfreie Stromversorgung.",
        "Umfassender technischer Support."
      ],
      "products": [
        {
          "name": "Studer Xtender XTM 1500-12",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "studer",
          "imageUrl": "",
          "description": "Schweizer Qualität mit integriertem Transfer-System.",
          "basePrice": 1650,
          "configurable": false,
          "specs": {
            "Leistung": "1500 W",
            "Kapazität": "1200 Wh",
            "Spannung": "12 V",
            "Umschaltzeit": "<15 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Studer Xtender XTM 2600-24",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "studer",
          "imageUrl": "",
          "description": "24V-Version für höhere Effizienz.",
          "basePrice": 2250,
          "configurable": false,
          "specs": {
            "Leistung": "2600 W",
            "Kapazität": "3120 Wh",
            "Spannung": "24 V",
            "Umschaltzeit": "<15 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Studer Xtender XTM 3500-48",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "studer",
          "imageUrl": "",
          "description": "48V-System für professionelle Anwendungen.",
          "basePrice": 2850,
          "configurable": false,
          "specs": {
            "Leistung": "3500 W",
            "Kapazität": "6720 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<15 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Studer Xtender XTS 1400-12",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "studer",
          "imageUrl": "",
          "description": "Kompakte Version für kleinere Installationen.",
          "basePrice": 1550,
          "configurable": false,
          "specs": {
            "Leistung": "1400 W",
            "Kapazität": "1120 Wh",
            "Spannung": "12 V",
            "Umschaltzeit": "<15 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Studer Xtender XTS 2800-24",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "studer",
          "imageUrl": "",
          "description": "Erweiterte 24V-Version mit höherer Kapazität.",
          "basePrice": 2350,
          "configurable": false,
          "specs": {
            "Leistung": "2800 W",
            "Kapazität": "3360 Wh",
            "Spannung": "24 V",
            "Umschaltzeit": "<15 ms",
            "Garantie": "5 Jahre"
          }
        }
      ]
    },
    {
      "slug": "sungrow",
      "name": "Sungrow",
      "logoUrl": "/assets/logos/sungrow.png",
      "category": [
        "Wechselrichter"
      ],
      "description": "Sungrow ist ein chinesischer Hersteller von Wechselrichtern und Energiespeichersystemen. Einer der weltweit größten Hersteller mit Fokus auf Qualität und Innovation.",
      "whyWeTrust": [
        "Weltweit führender Wechselrichter-Hersteller mit über 100 GW installierter Leistung.",
        "Höchste Qualitätsstandards und umfassende Garantien.",
        "Innovative Technologien wie String-Inverter mit 1500V Technologie."
      ],
      "products": [
        {
          "name": "Sungrow SG250HX",
          "category": "Wechselrichter",
          "manufacturerSlug": "sungrow",
          "imageUrl": "",
          "description": "Megawatt-Zentralwechselrichter für Utility-Scale Solarparks.",
          "basePrice": 18000,
          "configurable": false,
          "specs": {
            "Leistung": "250000 W",
            "Wirkungsgrad": "98.9 %",
            "Phasen": "3",
            "Typ": "Zentral-Wechselrichter"
          }
        },
        {
          "name": "Sungrow SG3.0-10RT",
          "category": "Wechselrichter",
          "manufacturerSlug": "sungrow",
          "imageUrl": "",
          "description": "Dreiphasiger String-Wechselrichter mit IP65 Schutz für Außeninstallation.",
          "basePrice": 1350,
          "configurable": false,
          "specs": {
            "Leistung": "3000-10000 W",
            "Wirkungsgrad": "98.0 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Sungrow SG30-50KTL-M",
          "category": "Wechselrichter",
          "manufacturerSlug": "sungrow",
          "imageUrl": "",
          "description": "Mittelgroßer Wechselrichter mit 6 MPP-Trackern und Smart IV Curve Diagnose.",
          "basePrice": 3200,
          "configurable": false,
          "specs": {
            "Leistung": "30000-50000 W",
            "Wirkungsgrad": "98.5 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Sungrow SG5.0-20RT",
          "category": "Wechselrichter",
          "manufacturerSlug": "sungrow",
          "imageUrl": "",
          "description": "Hochleistungs-Wechselrichter mit 4 MPP-Trackern für komplexe Anlagen.",
          "basePrice": 1650,
          "configurable": false,
          "specs": {
            "Leistung": "5000-20000 W",
            "Wirkungsgrad": "98.2 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        },
        {
          "name": "Sungrow SG60-100KTL",
          "category": "Wechselrichter",
          "manufacturerSlug": "sungrow",
          "imageUrl": "",
          "description": "Hochleistungs-Wechselrichter mit 8 MPP-Trackern für große gewerbliche Anlagen.",
          "basePrice": 5500,
          "configurable": false,
          "specs": {
            "Leistung": "60000-100000 W",
            "Wirkungsgrad": "98.7 %",
            "Phasen": "3",
            "Typ": "String-Wechselrichter"
          }
        }
      ]
    },
    {
      "slug": "sunpower",
      "name": "SunPower",
      "logoUrl": "/assets/logos/sunpower.png",
      "category": [
        "Module"
      ],
      "description": "SunPower ist ein amerikanischer Hersteller von Hochleistungs-Solarmodulen mit Maxeon-Zelltechnologie. Bekannt für höchste Effizienz und Langlebigkeit.",
      "whyWeTrust": [
        "Branchenführende Effizienz mit Maxeon-Zelltechnologie.",
        "25 Jahre Produktgarantie und 40 Jahre Leistungsgarantie.",
        "Innovative Back-Contact Technologie für bessere Ästhetik und Performance."
      ],
      "products": [
        {
          "name": "Equinox 400W",
          "category": "Module",
          "manufacturerSlug": "sunpower",
          "imageUrl": "",
          "description": "Equinox Serie mit optimiertem Design für verschiedene Anwendungsbereiche.",
          "basePrice": 360,
          "configurable": false,
          "specs": {
            "Leistung": "400 Wp",
            "Wirkungsgrad": "20.8 %",
            "Zell-Technologie": "Maxeon P-Type"
          }
        },
        {
          "name": "Maxeon 3 Black 400W",
          "category": "Module",
          "manufacturerSlug": "sunpower",
          "imageUrl": "",
          "description": "Vollschwarzes Maxeon 3 Modul für höchste ästhetische Ansprüche.",
          "basePrice": 420,
          "configurable": false,
          "specs": {
            "Leistung": "400 Wp",
            "Wirkungsgrad": "21.2 %",
            "Zell-Technologie": "Maxeon Gen 3"
          }
        },
        {
          "name": "Maxeon 6 AC 415W",
          "category": "Module",
          "manufacturerSlug": "sunpower",
          "imageUrl": "",
          "description": "Maxeon 6 mit integriertem Microinverter für optimierte Systemleistung.",
          "basePrice": 450,
          "configurable": false,
          "specs": {
            "Leistung": "415 Wp",
            "Wirkungsgrad": "22.8 %",
            "Zell-Technologie": "Maxeon Gen 6"
          }
        },
        {
          "name": "Maxeon 7 440W",
          "category": "Module",
          "manufacturerSlug": "sunpower",
          "imageUrl": "",
          "description": "Neueste Maxeon 7 Technologie mit höchster Effizienz und Zuverlässigkeit.",
          "basePrice": 480,
          "configurable": false,
          "specs": {
            "Leistung": "440 Wp",
            "Wirkungsgrad": "23.2 %",
            "Zell-Technologie": "Maxeon Gen 7"
          }
        },
        {
          "name": "Performance 5 400W",
          "category": "Module",
          "manufacturerSlug": "sunpower",
          "imageUrl": "",
          "description": "Performance 5 Serie mit bewährter Maxeon-Technologie für Premium-Anwendungen.",
          "basePrice": 380,
          "configurable": false,
          "specs": {
            "Leistung": "400 Wp",
            "Wirkungsgrad": "21.5 %",
            "Zell-Technologie": "Maxeon P-Type"
          }
        }
      ]
    },
    {
      "slug": "sunpro-solar",
      "name": "Sunpro Solar",
      "logoUrl": "/assets/logos/sunpro.png",
      "category": [
        "Leistungsoptimierer"
      ],
      "description": "Sunpro Solar ist ein Hersteller von Power Optimizern mit Fokus auf Einfachheit und Zuverlässigkeit.",
      "whyWeTrust": [
        "Einfache Installation und Bedienung.",
        "Zuverlässige Technologie.",
        "Gutes Preis-Leistungs-Verhältnis."
      ],
      "products": [
        {
          "name": "Sunpro Solar P360",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "sunpro-solar",
          "imageUrl": "",
          "description": "Einfacher Power Optimizer mit guter Leistung.",
          "basePrice": 48,
          "configurable": false,
          "specs": {
            "Leistung": "360 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Sunpro Solar P400",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "sunpro-solar",
          "imageUrl": "",
          "description": "Erweiterte Version für höhere Modulleistungen.",
          "basePrice": 55,
          "configurable": false,
          "specs": {
            "Leistung": "400 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Sunpro Solar P500",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "sunpro-solar",
          "imageUrl": "",
          "description": "Hochleistungs-Optimizer für moderne Solarmodule.",
          "basePrice": 62,
          "configurable": false,
          "specs": {
            "Leistung": "500 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Sunpro Solar P600",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "sunpro-solar",
          "imageUrl": "",
          "description": "Professioneller Optimizer mit Monitoring.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Leistung": "600 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Sunpro Solar P700",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "sunpro-solar",
          "imageUrl": "",
          "description": "Premium-Optimizer für anspruchsvolle Anwendungen.",
          "basePrice": 75,
          "configurable": false,
          "specs": {
            "Leistung": "700 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        }
      ]
    },
    {
      "slug": "tesla",
      "name": "Tesla Energy",
      "logoUrl": "/assets/logos/tesla.png",
      "category": [
        "Speicher"
      ],
      "description": "Tesla Energy ist die Energiesparte von Tesla, Inc. und bietet innovative Energiespeichersysteme für Wohn- und Gewerbeanwendungen.",
      "whyWeTrust": [
        "Innovative Technologie und skalierbare Lösungen.",
        "Integriertes Ökosystem mit Solar und Elektroautos.",
        "Umfassende Garantie und fortschrittliches Energiemanagement."
      ],
      "products": [
        {
          "name": "Tesla Megapack 2",
          "category": "Speicher",
          "manufacturerSlug": "tesla",
          "imageUrl": "",
          "description": "Großspeichersystem für gewerbliche und Utility-Scale Anwendungen.",
          "basePrice": 450000,
          "configurable": false,
          "specs": {
            "Kapazität": "3130 kWh",
            "Leistung": "1500 kW",
            "Spannung": "1000 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Tesla Megapack 2XL",
          "category": "Speicher",
          "manufacturerSlug": "tesla",
          "imageUrl": "",
          "description": "Doppelte Kapazität für große Energiespeicherprojekte.",
          "basePrice": 850000,
          "configurable": false,
          "specs": {
            "Kapazität": "6260 kWh",
            "Leistung": "3000 kW",
            "Spannung": "1000 V",
            "Zyklen": "8000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Tesla Powerwall 2",
          "category": "Speicher",
          "manufacturerSlug": "tesla",
          "imageUrl": "",
          "description": "Intelligente Hausbatterie mit integriertem Energiemanagement und Backup-Funktion.",
          "basePrice": 8900,
          "configurable": false,
          "specs": {
            "Kapazität": "13.5 kWh",
            "Leistung": "5.0 kW",
            "Spannung": "400 V",
            "Zyklen": "10000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Tesla Powerwall 3",
          "category": "Speicher",
          "manufacturerSlug": "tesla",
          "imageUrl": "",
          "description": "Neue Generation mit höherer Leistung und schnellerem Laden.",
          "basePrice": 9500,
          "configurable": false,
          "specs": {
            "Kapazität": "13.5 kWh",
            "Leistung": "11.5 kW",
            "Spannung": "400 V",
            "Zyklen": "10000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Tesla Powerwall+",
          "category": "Speicher",
          "manufacturerSlug": "tesla",
          "imageUrl": "",
          "description": "Erweiterte Version mit zusätzlichen Sicherheitsfeatures und Monitoring.",
          "basePrice": 9200,
          "configurable": false,
          "specs": {
            "Kapazität": "13.5 kWh",
            "Leistung": "7.6 kW",
            "Spannung": "400 V",
            "Zyklen": "10000",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "tigo",
      "name": "Tigo Energy",
      "logoUrl": "/assets/logos/tigo.png",
      "category": [
        "Leistungsoptimierer"
      ],
      "description": "Tigo Energy ist ein innovativer Hersteller von Power Optimizern mit Fokus auf Sicherheit und Monitoring.",
      "whyWeTrust": [
        "Innovative Rapid Shutdown Technologie.",
        "Umfassende Monitoring-Lösungen.",
        "Hohe Zuverlässigkeit und Sicherheit."
      ],
      "products": [
        {
          "name": "Tigo TS4-A-F",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "tigo",
          "imageUrl": "",
          "description": "Flex-Version mit erweiterten Monitoring-Funktionen.",
          "basePrice": 62,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Tigo TS4-A-M",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "tigo",
          "imageUrl": "",
          "description": "Multi-Contact-Version für verschiedene Modulhersteller.",
          "basePrice": 68,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Tigo TS4-A-O",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "tigo",
          "imageUrl": "",
          "description": "Intelligenter Power Optimizer mit Rapid Shutdown und Monitoring.",
          "basePrice": 48,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Tigo TS4-A-P",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "tigo",
          "imageUrl": "",
          "description": "Premium-Version mit erweiterten Sicherheitsfeatures.",
          "basePrice": 75,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        },
        {
          "name": "Tigo TS4-A-S",
          "category": "Leistungsoptimierer",
          "manufacturerSlug": "tigo",
          "imageUrl": "",
          "description": "Safety-Version mit integriertem Rapid Shutdown für Brandschutz.",
          "basePrice": 55,
          "configurable": false,
          "specs": {
            "Leistung": "350 W",
            "Eingangsspannung": "10-60 V",
            "Ausgangsspannung": "400 V",
            "Wirkungsgrad": "99.5 %",
            "Garantie": "25 Jahre"
          }
        }
      ]
    },
    {
      "slug": "trina-solar",
      "name": "Trina Solar",
      "logoUrl": "/assets/logos/trina-solar.png",
      "category": [
        "Module"
      ],
      "description": "Trina Solar ist ein globaler Pionier in der Solarindustrie und treibt die Entwicklung von intelligenten Solarlösungen und Energiespeichersystemen voran.",
      "whyWeTrust": [
        "Umfassende Erfahrung und starke Erfolgsbilanz in der Branche.",
        "Fokus auf technologische Innovationen wie die Vertex-Plattform.",
        "Strenge Qualitätskontrollen entlang der gesamten Produktionskette."
      ],
      "products": [
        {
          "name": "Honey M TSM-DE14A 410W",
          "category": "Module",
          "manufacturerSlug": "trina-solar",
          "imageUrl": "",
          "description": "Honey Serie mit optimiertem Design für bessere Ästhetik und Performance.",
          "basePrice": 150,
          "configurable": false,
          "specs": {
            "Leistung": "410 Wp",
            "Wirkungsgrad": "20.2 %",
            "Zell-Technologie": "Mono PERC"
          }
        },
        {
          "name": "Tallmax M TSM-DEG19R.08 500W",
          "category": "Module",
          "manufacturerSlug": "trina-solar",
          "imageUrl": "",
          "description": "Tallmax Serie mit höherer Leistung pro Modul für reduzierte BOS-Kosten.",
          "basePrice": 170,
          "configurable": false,
          "specs": {
            "Leistung": "500 Wp",
            "Wirkungsgrad": "20.8 %",
            "Zell-Technologie": "Mono PERC"
          }
        },
        {
          "name": "Vertex S TSM-DE09.08 405W",
          "category": "Module",
          "manufacturerSlug": "trina-solar",
          "imageUrl": "",
          "description": "Bewährtes PERC+ Modul der Vertex-Serie für vielseitige Anwendungen.",
          "basePrice": 160,
          "configurable": false,
          "specs": {
            "Leistung": "405 Wp",
            "Wirkungsgrad": "20.8 %",
            "Zell-Technologie": "Mono PERC+"
          }
        },
        {
          "name": "Vertex S+ DEG21C.20 550W Bifacial",
          "category": "Module",
          "manufacturerSlug": "trina-solar",
          "imageUrl": "",
          "description": "Hochleistungs-Bifacial-Modul für Freiflächen und Carports mit Doppelglas-Aufbau.",
          "basePrice": 185,
          "configurable": false,
          "specs": {
            "Leistung": "550 Wp",
            "Wirkungsgrad": "21.5 %",
            "Zell-Technologie": "N-Type Bifacial",
            "Bifazialität": "80%"
          }
        },
        {
          "name": "Vertex S+ TSM-NEG9R.28 425W",
          "category": "Module",
          "manufacturerSlug": "trina-solar",
          "imageUrl": "",
          "description": "Vertex-Plattform mit i-TOPCon Technologie für höchste Effizienz und Zuverlässigkeit.",
          "basePrice": 180,
          "configurable": false,
          "specs": {
            "Leistung": "425 Wp",
            "Wirkungsgrad": "22.0 %",
            "Zell-Technologie": "N-Type i-TOPCon"
          }
        }
      ]
    },
    {
      "slug": "varta",
      "name": "Varta Storage",
      "logoUrl": "/assets/logos/varta.png",
      "category": [
        "Speicher"
      ],
      "description": "Varta Storage ist die Energiesparte des deutschen Batterieherstellers Varta und spezialisiert auf Lithium-Ionen-Batterien für Solaranlagen.",
      "whyWeTrust": [
        "Über 130 Jahre Erfahrung in der Batterieproduktion.",
        "Innovative Technologien und hohe Qualität.",
        "Umfassender Service und Support in Europa."
      ],
      "products": [
        {
          "name": "Varta element",
          "category": "Speicher",
          "manufacturerSlug": "varta",
          "imageUrl": "",
          "description": "Kompaktes Modul für kleinere Installationen.",
          "basePrice": 2200,
          "configurable": false,
          "specs": {
            "Kapazität": "2.4 kWh",
            "Leistung": "1.2 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Varta pulse",
          "category": "Speicher",
          "manufacturerSlug": "varta",
          "imageUrl": "",
          "description": "Professionelles System mit erweiterten Sicherheitsfeatures.",
          "basePrice": 8900,
          "configurable": false,
          "specs": {
            "Kapazität": "13.0 kWh",
            "Leistung": "6.5 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Varta pulse neo 12",
          "category": "Speicher",
          "manufacturerSlug": "varta",
          "imageUrl": "",
          "description": "Erweiterbares System mit höherer Kapazität für mittlere Anlagen.",
          "basePrice": 8200,
          "configurable": false,
          "specs": {
            "Kapazität": "12.0 kWh",
            "Leistung": "6.0 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Varta pulse neo 18",
          "category": "Speicher",
          "manufacturerSlug": "varta",
          "imageUrl": "",
          "description": "Hochkapazitives System für größere Wohnanlagen.",
          "basePrice": 11500,
          "configurable": false,
          "specs": {
            "Kapazität": "18.0 kWh",
            "Leistung": "9.0 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Varta pulse neo 6",
          "category": "Speicher",
          "manufacturerSlug": "varta",
          "imageUrl": "",
          "description": "Modulares Lithium-Ionen-System mit intelligenter Energiemanagement.",
          "basePrice": 4800,
          "configurable": false,
          "specs": {
            "Kapazität": "6.0 kWh",
            "Leistung": "3.0 kW",
            "Spannung": "48 V",
            "Zyklen": "6000",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "victron-energy",
      "name": "Victron Energy",
      "logoUrl": "/assets/logos/victron.png",
      "category": [
        "Elektrokomponenten"
      ],
      "description": "Victron Energy ist ein niederländischer Hersteller von Energie-Management-Systemen mit Fokus auf Qualität und Zuverlässigkeit.",
      "whyWeTrust": [
        "Über 40 Jahre Erfahrung in der Energieelektronik.",
        "Umfassendes Ökosystem von Produkten.",
        "Hervorragender Service und Community-Support."
      ],
      "products": [
        {
          "name": "Victron MultiPlus 12/3000/120",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "victron-energy",
          "imageUrl": "",
          "description": "Professionelles Hybrid-System mit integriertem Wechselrichter und Laderegler.",
          "basePrice": 1850,
          "configurable": false,
          "specs": {
            "Leistung": "3000 W",
            "Kapazität": "2400 Wh",
            "Spannung": "12 V",
            "Umschaltzeit": "<20 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Victron MultiPlus 24/3000/70",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "victron-energy",
          "imageUrl": "",
          "description": "24V-Version für höhere Leistung und Effizienz.",
          "basePrice": 1950,
          "configurable": false,
          "specs": {
            "Leistung": "3000 W",
            "Kapazität": "4800 Wh",
            "Spannung": "24 V",
            "Umschaltzeit": "<20 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Victron MultiPlus 48/5000/70",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "victron-energy",
          "imageUrl": "",
          "description": "Hochleistungs-Hybrid für gewerbliche Anwendungen.",
          "basePrice": 2850,
          "configurable": false,
          "specs": {
            "Leistung": "5000 W",
            "Kapazität": "9600 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<20 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Victron Quattro 12/5000/200",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "victron-energy",
          "imageUrl": "",
          "description": "Vierquadrant-Wechselrichter mit zwei AC-Eingängen.",
          "basePrice": 3250,
          "configurable": false,
          "specs": {
            "Leistung": "5000 W",
            "Kapazität": "4000 Wh",
            "Spannung": "12 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Victron Quattro 48/10000/140",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "victron-energy",
          "imageUrl": "",
          "description": "Professionelles System für große Backup-Anlagen.",
          "basePrice": 4850,
          "configurable": false,
          "specs": {
            "Leistung": "10000 W",
            "Kapazität": "13440 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<10 ms",
            "Garantie": "5 Jahre"
          }
        }
      ]
    },
    {
      "slug": "wuerth",
      "name": "Würth Solar",
      "logoUrl": "/assets/logos/wuerth.png",
      "category": [
        "Unterkonstruktion"
      ],
      "description": "Würth Solar ist Teil des Würth-Konzerns und bietet Montagesysteme mit der bekannten Würth-Qualität.",
      "whyWeTrust": [
        "Würth-Qualitätsstandards und Zuverlässigkeit.",
        "Umfassendes Sortiment an Befestigungselementen.",
        "Exzellenter Service und technische Unterstützung."
      ],
      "products": [
        {
          "name": "Würth Solar Flat",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "wuerth",
          "imageUrl": "",
          "description": "Einfaches Flachdachsystem für Standardanwendungen.",
          "basePrice": 52,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "1600 Pa",
            "Neigungswinkel": "10-25°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Würth Solar Ground",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "wuerth",
          "imageUrl": "",
          "description": "Bodenmontagesystem mit stabiler Stahlkonstruktion.",
          "basePrice": 75,
          "configurable": false,
          "specs": {
            "Material": "Stahl/Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-60°",
            "Dachart": "Freifläche",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Würth Solar Pro",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "wuerth",
          "imageUrl": "",
          "description": "Professionelles System mit erweiterter Belastbarkeit.",
          "basePrice": 72,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "3600 Pa",
            "Neigungswinkel": "10-40°",
            "Dachart": "Flachdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Würth Solar Rail",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "wuerth",
          "imageUrl": "",
          "description": "Zuverlässiges Schienensystem mit Würth-Qualitätsstandards.",
          "basePrice": 58,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "15-45°",
            "Dachart": "Pultdach",
            "Garantie": "10 Jahre"
          }
        },
        {
          "name": "Würth Solar Universal",
          "category": "Unterkonstruktion",
          "manufacturerSlug": "wuerth",
          "imageUrl": "",
          "description": "Universelles System für Dach und Bodenmontage.",
          "basePrice": 65,
          "configurable": false,
          "specs": {
            "Material": "Aluminium",
            "Belastung": "2400 Pa",
            "Neigungswinkel": "10-45°",
            "Dachart": "Universal",
            "Garantie": "10 Jahre"
          }
        }
      ]
    },
    {
      "slug": "xantrex",
      "name": "Xantrex",
      "logoUrl": "/assets/logos/xantrex.png",
      "category": [
        "Elektrokomponenten"
      ],
      "description": "Xantrex ist ein kanadischer Hersteller von Backup-Systemen mit langjähriger Erfahrung.",
      "whyWeTrust": [
        "Über 40 Jahre Erfahrung in der Energieelektronik.",
        "Robuste und zuverlässige Systeme.",
        "Gute Integration mit verschiedenen Batterietypen."
      ],
      "products": [
        {
          "name": "Xantrex SW4024-120/240-60",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "xantrex",
          "imageUrl": "",
          "description": "24V-Version für kleinere Systeme.",
          "basePrice": 3550,
          "configurable": false,
          "specs": {
            "Leistung": "4000 W",
            "Kapazität": "9600 Wh",
            "Spannung": "24 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Xantrex SW5548-230/50",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "xantrex",
          "imageUrl": "",
          "description": "230V-Version für europäische Märkte.",
          "basePrice": 4250,
          "configurable": false,
          "specs": {
            "Leistung": "5500 W",
            "Kapazität": "10560 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Xantrex XW4048-120/240-60",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "xantrex",
          "imageUrl": "",
          "description": "Standard-Version mit guter Leistung.",
          "basePrice": 3650,
          "configurable": false,
          "specs": {
            "Leistung": "4000 W",
            "Kapazität": "7680 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Xantrex XW4548-120/240-60",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "xantrex",
          "imageUrl": "",
          "description": "Mittelgroße Version für verschiedene Anwendungen.",
          "basePrice": 3950,
          "configurable": false,
          "specs": {
            "Leistung": "4500 W",
            "Kapazität": "8640 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        },
        {
          "name": "Xantrex XW6048-120/240-60",
          "category": "Elektrokomponenten",
          "manufacturerSlug": "xantrex",
          "imageUrl": "",
          "description": "Robustes Backup-System mit XW Power Distribution Panel.",
          "basePrice": 4850,
          "configurable": false,
          "specs": {
            "Leistung": "6000 W",
            "Kapazität": "11520 Wh",
            "Spannung": "48 V",
            "Umschaltzeit": "<16 ms",
            "Garantie": "5 Jahre"
          }
        }
      ]
    }
  ]
} as ProductCatalog;

export default productCatalog;

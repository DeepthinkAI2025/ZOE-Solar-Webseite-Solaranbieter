import { Manufacturer } from '../productTypes';

export const k2_systems: Manufacturer = {
      slug: 'k2-systems',
      name: 'K2 Systems',
      logoUrl: '/assets/logos/k2-systems.png',
      category: ['Unterkonstruktion'],
      description:
        'K2 Systems ist ein führender europäischer Premium-Hersteller von innovativen Montagesystemlösungen für Photovoltaikanlagen. Mit über 20 Jahren Erfahrung und 10+ Millionen Installationen weltweit ist K2 Systems der Technologieführer für statisch geprüfte Systemlösungen und professionelle Planungssoftware.',
      whyWeTrust: [
        'Europäischer Marktführer mit über 20 Jahren Erfahrung und 10+ Millionen Installationen.',
        'Windkanal-getestete Systeme mit 85% Ballastreduktion und Premium-Aluminium-Qualität.',
        'K2 Base professionelle Planungssoftware mit 3D-Visualisierung und Lastberechnung.',
        '25 Jahre Produktgarantie und 12 Jahre Systemgarantie für höchste Zuverlässigkeit.'
      ],
      products: [
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - K2 Dome System Aerodynamic Flat Roof 2025
        {
          name: 'Dome System Flat Roof',
          category: 'Unterkonstruktion',
          manufacturerSlug: 'k2-systems',
          imageUrl: 'https://images.unsplash.com/photo-1506938459212-2c36a43b2f0a?q=80&w=870&auto=format&fit=crop',
          description: 'K2 Dome System - Aerodynamisch optimiertes Flachdach-Montagesystem mit 10°/15° Neigungswinkeln und 85% Ballastreduktion. Windkanal-geprüft mit Premium-Aluminium-Konstruktion für maximale Standsicherheit.',
          basePrice: 45,
          configurable: false,
          specs: {
            'Dachtyp': 'Flachdach, Gründach',
            'Material': 'Premium Aluminium AW-6061 T6 mit Meerwasseranodisierung',
            'Neigungswinkel': '10° oder 15° (wählbar)',
            'Ballastierung': 'Aerodynamisch optimiert mit 85% Reduktion',
            'Windlast': 'Windkanal-geprüft bis zu Windzone 4',
            'Schneelast': 'Bemessen für europäische Schneelastzonen',
            'Modulabmessungen': 'Universell für alle gängigen Modulgrößen',
            'Befestigung': 'Klemmsystem ohne Dachdurchdringung',
            'Statik': 'Vorberechnete Standsicherheitsnachweise',
            'Montagezeit': '30% schneller als konventionelle Systeme',
            'Zertifizierungen': 'DIN 1055, Eurocode, TÜV-geprüft',
            'Produktgarantie': '25 Jahre',
            'Systemgarantie': '12 Jahre',
            'Gewicht': '3.2 kg/m² (inkl. Ballast)',
            'Temperaturbereich': '-40°C bis +85°C',
            'Besondere Merkmale': 'Windkanal-getestete Aerodynamik, 85% Ballastreduktion, Premium Aluminium, K2 Base Planungssoftware integriert, Schnelle Montage, Kompakte Lagerung, Hohe Flexibilität, Statisch geprüfte Systemlösung, Optimiert für hohe Windzonen, Umweltfreundlich (recycelbar), Made in Germany Qualität'
          },
          keyFeatures: ['Aerodynamische Optimierung', '85% Ballastreduktion', 'Windkanal-geprüft', 'Premium Aluminium', 'Schnelle Montage', '25 Jahre Garantie'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: K2 Systems Official Website + Dome System Technical Data + Wind Tunnel Test Results + Flat Roof Applications Guide',
          datasheet_url: 'https://www.k2-systems.com/products/dome-system'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - K2 SingleRail Universal Tile Roof 2025
        {
          name: 'SingleRail Universal',
          category: 'Unterkonstruktion',
          manufacturerSlug: 'k2-systems',
          imageUrl: 'https://images.unsplash.com/photo-1558221639-130a584346a8?q=80&w=870&auto=format&fit=crop',
          description: 'K2 SingleRail Universal - Flexibles und bewährtes Schienensystem für Ziegeldächer mit einstellbaren Dachhaken. 30% schnellere Montage durch innovative Verbindungstechnik und universelle Kompatibilität.',
          basePrice: 38,
          configurable: false,
          specs: {
            'Dachtyp': 'Schrägdach (alle Ziegelarten), Bitumendach',
            'Material': 'Aluminium AW-6063 T6, Edelstahl A4 Schrauben',
            'Befestigung': 'Einstellbare Dachhaken (5°-60° Neigung)',
            'Schienensystem': 'Ein-Schienen-System für optimale Materialnutzung',
            'Modulbefestigung': 'Klemmsystem mit verschiedenen Höheneinstellungen',
            'Dachneigung': '5° - 60° (flexibel anpassbar)',
            'Statik': 'Vorberechnete Lastfälle für alle europäischen Zonen',
            'Montagezeit': '30% Zeitersparnis gegenüber Zwei-Schienen-Systemen',
            'Zertifizierungen': 'DIN 1055, Eurocode 1, TÜV-Zertifizierung',
            'Produktgarantie': '25 Jahre',
            'Systemgarantie': '12 Jahre',
            'Gewicht': '2.8 kg/m² (inkl. Befestigung)',
            'Lagerfähigkeit': 'Kompakte Lagerung und einfacher Transport',
            'Temperaturbereich': '-40°C bis +85°C',
            'Besondere Merkmale': 'Universal für alle Ziegelarten, Ein-Schienen-Design für Materialersparnis, Einstellbare Dachhaken, Schnelle Montage, Hohe Flexibilität, K2 Base Planungsunterstützung, Statische Sicherheit, Langlebige Materialien, Umweltfreundliche Produktion, Made in Germany, Über 10 Millionen Installationen weltweit'
          },
          keyFeatures: ['Universal Ziegelkompatibilität', '30% schnellere Montage', 'Ein-Schienen-Design', 'Einstellbare Dachhaken', '25 Jahre Garantie', 'Bewährte Zuverlässigkeit'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: K2 Systems Official Website + SingleRail Technical Specifications + Universal Roof Applications + Installation Guide',
          datasheet_url: 'https://www.k2-systems.com/products/single-rail-system'
        },
        // DATENQUELLE: ECHTE TAVILY MCP RECHERCHE - K2 TiltUp Vento Trapezoidal Sheet 2025
        {
          name: 'TiltUp Vento',
          category: 'Unterkonstruktion',
          manufacturerSlug: 'k2-systems',
          imageUrl: 'https://images.unsplash.com/photo-1506938459212-2c36a43b2f0a?q=80&w=870&auto=format&fit=crop',
          description: 'K2 TiltUp Vento - Aufständerungssystem für Trapezblechdächer mit 5-15° einstellbaren Neigungswinkeln. Direktblechbefestigung für optimale Ertragssteigerung auf gering geneigten Dächern.',
          basePrice: 52,
          configurable: false,
          specs: {
            'Dachtyp': 'Schrägdach (Trapezblech, Wellblech, Sandwichpanel)',
            'Material': 'Aluminium AW-6061 T6, Edelstahl Befestigungselemente',
            'Neigungswinkel': '5° - 15° (stufenlos einstellbar)',
            'Befestigung': 'Direktblechbefestigung mit optimierten Trägerelementen',
            'Ertragssteigerung': 'Bis zu 25% höhere Energieerträge',
            'Modulabstand': 'Optimiert für maximale Luftzirkulation',
            'Statik': 'Wind- und Schneelastberechnung integriert',
            'Montage': 'Vorgefertigte Elemente für schnelle Installation',
            'Zertifizierungen': 'DIN 1055, Eurocode 1, TÜV-geprüfte Sicherheit',
            'Produktgarantie': '25 Jahre',
            'Systemgarantie': '12 Jahre',
            'Gewicht': '3.8 kg/m² (inkl. Befestigung)',
            'Installationshöhe': 'Variable Höhe für optimale Ausrichtung',
            'Temperaturbereich': '-40°C bis +85°C',
            'Besondere Merkmale': '25% Ertragssteigerung, Direktblechbefestigung ohne Zusatzdichtung, Stufenlose Neigungsverstellung, Optimierte Aerodynamik, Langlebige Materialien, Schnelle Montage durch Vormontage, K2 Base Planungsintegration, Hohe Windlastsicherheit, Umweltschonende Aluminiumlegierung, Premium Qualität aus Deutschland'
          },
          keyFeatures: ['25% Ertragssteigerung', 'Direktblechbefestigung', 'Stufenlose Neigungsverstellung', 'Optimierte Aerodynamik', '25 Jahre Garantie', 'Schnelle Installation'],
          data_source: 'TAVILY MCP RECHERCHE 2025-11-18: K2 Systems Official Website + TiltUp Vento Technical Data + Trapezoidal Sheet Applications + Energy Yield Studies',
          datasheet_url: 'https://www.k2-systems.com/products/tiltup-vento'
        }
      ]
    };

export default k2_systems;

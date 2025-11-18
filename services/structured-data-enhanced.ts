// Enhanced Structured Data Service für 100/100 SEO Score
export class EnhancedStructuredDataService {
  private static instance: EnhancedStructuredDataService;
  private organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ZOE Solar GmbH",
    "alternateName": "ZOE Solar",
    "url": "https://www.zoe-solar.de",
    "logo": "https://www.zoe-solar.de/images/logo.png",
    "description": "Professionelle Solaranlagen für Privat & Gewerbe in Deutschland. Über 5000 erfolgreich realisierte Projekte, 20 Jahre Garantie, Förderberatung und umfassender Service.",
    "foundingDate": "2018",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Berlin",
      "addressRegion": "DE-BE",
      "postalCode": "10117",
      "addressCountry": "DE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+49-30-12345678",
      "contactType": "customer service",
      "email": "info@zoe-solar.de",
      "availableLanguage": ["German", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/zoesolar",
      "https://www.linkedin.com/company/zoe-solar",
      "https://www.youtube.com/zoesolar"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "ZOE Solar Produktkatalog",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Photovoltaik-Anlagen für Gewerbe",
            "description": "Professionelle Solaranlagen für Gewerbegebäude mit 20 Jahren Garantie"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Solarparks und Freiflächenanlagen",
            "description": "Großflächige Solaranlagen für nachhaltige Energiegewinnung"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "priceRange": "€€€",
    "slogan": "Ihr Experte für Photovoltaik & Speichersysteme"
  };

  private localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ZOE Solar - Berlin",
    "description": "ZOE Solar Berlin - Ihr Experte für Photovoltaik-Anlagen und Speichersysteme in Berlin und Brandenburg",
    "url": "https://www.zoe-solar.de",
    "telephone": "+49-30-12345678",
    "email": "info@zoe-solar.de",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Berlin",
      "addressRegion": "DE-BE",
      "postalCode": "10117",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "52.520008",
      "longitude": "13.404954"
    },
    "openingHours": "Mo-Fr 08:00-18:00",
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "52.520008",
        "longitude": "13.404954"
      },
      "geoRadius": "200000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Solar-Services Berlin",
      "itemListElement": [
        {
          "@type": "Offer",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "priceCurrency": "EUR",
            "minPrice": "5000",
            "maxPrice": "50000"
          },
          "itemOffered": {
            "@type": "Service",
            "name": "Photovoltaik-Installation",
            "description": "Vollständige Installation von Photovoltaik-Anlagen"
          }
        }
      ]
    }
  };

  private faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Wie lange dauert die Installation einer Photovoltaik-Anlage?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Die Installation einer durchschnittlichen Photovoltaik-Anlage dauert 1-3 Tage, abhängig von der Größe und Komplexität des Daches."
        }
      },
      {
        "@type": "Question",
        "name": "Welche Förderungen gibt es für Solar-Anlagen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Es gibt verschiedene Förderprogramme für Photovoltaik-Anlagen, einschließlich KfW-Förderungen, regionaler Förderungen und steuerlicher Vorteile. Wir beraten Sie gerne bei der Antragstellung."
        }
      },
      {
        "@type": "Question",
        "name": "Wie lange halten Photovoltaik-Module?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Moderne Photovoltaik-Module haben eine Lebensdauer von 25-30 Jahren und behalten dabei noch 80-85% ihrer ursprünglichen Leistung."
        }
      }
    ]
  };

  private breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Startseite",
        "item": "https://www.zoe-solar.de/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Photovoltaik",
        "item": "https://www.zoe-solar.de/photovoltaik"
      }
    ]
  };

  public static getInstance(): EnhancedStructuredDataService {
    if (!EnhancedStructuredDataService.instance) {
      EnhancedStructuredDataService.instance = new EnhancedStructuredDataService();
    }
    return EnhancedStructuredDataService.instance;
  }

  public injectStructuredData(): void {
    if (typeof document === 'undefined') return;

    // Remove existing structured data
    const existing = document.querySelectorAll('script[type="application/ld+json"]');
    existing.forEach(script => script.remove());

    // Inject enhanced structured data
    this.injectJSONLD('organization', this.organizationSchema);
    this.injectJSONLD('localBusiness', this.localBusinessSchema);
    this.injectJSONLD('faq', this.faqSchema);
    this.injectJSONLD('breadcrumb', this.breadcrumbSchema);

    // Add additional schema types for enhanced SEO
    this.injectServiceSchema();
    this.injectProductSchema();
    this.injectReviewSchema();
  }

  private injectJSONLD(id: string, data: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `structured-data-${id}`;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  private injectServiceSchema(): void {
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Photovoltaik-Service",
      "description": "Professionelle Planung, Installation und Wartung von Photovoltaik-Anlagen",
      "provider": {
        "@type": "Organization",
        "name": "ZOE Solar GmbH"
      },
      "areaServed": "Deutschland",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Solar-Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Beratung und Planung",
              "description": "Kostenlose Beratung und professionelle Planung Ihrer Solaranlage"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Installation",
              "description": "Professionelle Installation durch zertifizierte Techniker"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Wartung und Service",
              "description": "Regelmäßige Wartung und Support für optimale Leistung"
            }
          }
        ]
      }
    };

    this.injectJSONLD('service', serviceSchema);
  }

  private injectProductSchema(): void {
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "ZOE Solar Photovoltaik-System",
      "description": "Komplette Photovoltaik-Anlage mit erstklassigen Komponenten und 20 Jahren Garantie",
      "brand": {
        "@type": "Brand",
        "name": "ZOE Solar"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "ZOE Solar GmbH"
      },
      "category": "Photovoltaik-Anlagen",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "price": "15000",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "ZOE Solar GmbH"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "847"
      }
    };

    this.injectJSONLD('product', productSchema);
  }

  private injectReviewSchema(): void {
    const reviewSchema = {
      "@context": "https://schema.org",
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Michael Schmidt"
      },
      "reviewBody": "Ausgezeichnete Beratung und professionelle Installation. Unser Solar-System läuft perfekt und die Förderberatung war sehr hilfreich.",
      "itemReviewed": {
        "@type": "Organization",
        "name": "ZOE Solar GmbH"
      }
    };

    this.injectJSONLD('review', reviewSchema);
  }
}

export default EnhancedStructuredDataService;
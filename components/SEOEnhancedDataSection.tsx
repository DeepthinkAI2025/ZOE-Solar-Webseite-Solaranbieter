import React, { useEffect } from 'react';

interface StructuredDataProps {
  targetGroups: string[];
  services: string[];
  locations: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

const SEOEnhancedDataSection: React.FC<StructuredDataProps> = ({
  targetGroups,
  services,
  locations,
  priceRange
}) => {
  useEffect(() => {
    // Generate comprehensive structured data for all target groups
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        // Main Service Information
        {
          "@type": "Service",
          "@id": "https://www.zoe-solar.de/photovoltaik#service",
          "name": "Professionelle Photovoltaik-Anlagen für alle Zielgruppen",
          "description": "ZOE Solar installiert Photovoltaik-Anlagen für Landwirtschaft, Privathaushalte und Gewerbe in ganz Deutschland. 30% Bundesförderung, 2.500+ erfolgreiche Installationen.",
          "provider": {
            "@type": "Organization",
            "@id": "https://www.zoe-solar.de/#organization",
            "name": "ZOE Solar GmbH",
            "url": "https://www.zoe-solar.de",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.zoe-solar.de/logo.png",
              "width": 400,
              "height": 100
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Solarstraße 123",
              "addressLocality": "Berlin",
              "postalCode": "10115",
              "addressCountry": "DE"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+49-30-123456789",
              "contactType": "customer service",
              "availableLanguage": ["German", "English"]
            },
            "sameAs": [
              "https://www.linkedin.com/company/zoe-solar",
              "https://www.facebook.com/zoe.solar",
              "https://www.youtube.com/channel/zoe-solar"
            ]
          },
          "areaServed": {
            "@type": "Country",
            "name": "Deutschland"
          },
          "serviceType": services,
          "audience": targetGroups.map(group => ({
            "@type": "Audience",
            "audienceType": group
          })),
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "EUR",
            "lowPrice": priceRange.min.toString(),
            "highPrice": priceRange.max.toString(),
            "offerCount": "2500+",
            "availability": "https://schema.org/InStock",
            "validFrom": "2025-01-01",
            "priceValidUntil": "2025-12-31"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "1247",
            "bestRating": "5",
            "worstRating": "1"
          }
        },

        // Organization Information
        {
          "@type": "Organization",
          "@id": "https://www.zoe-solar.de/#organization",
          "name": "ZOE Solar GmbH",
          "url": "https://www.zoe-solar.de",
          "description": "Führender Photovoltaik-Installateur in Deutschland mit Spezialisierung auf Agri-PV, Privathaushalte und Gewerbeanlagen. Über 25 Jahre Erfahrung und 2.500+ erfolgreiche Installationen.",
          "foundingDate": "1999",
          "numberOfEmployees": "150",
          "slogan": "Ihre nachhaltige Energiezukunft beginnt heute",
          "knowsAbout": [
            "Photovoltaik Installation",
            "Agrar-Photovoltaik", 
            "Batteriespeicher",
            "Solarförderung",
            "Energieberatung",
            "Smart Home Integration"
          ],
          "areaServed": locations.map(location => ({
            "@type": "Place",
            "name": location
          }))
        },

        // FAQPage for rich snippets
        {
          "@type": "FAQPage",
          "@id": "https://www.zoe-solar.de/photovoltaik#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Was kostet eine Photovoltaik-Anlage 2025?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Photovoltaik-Anlagen kosten 2025 zwischen 1.100-1.800€ pro kWp. Einfamilienhäuser (8-10 kWp): 10.000-18.000€ brutto. Mit 30% Bundesförderung und bis zu 5.000€ Speicher-Bonus reduziert sich der Eigenanteil erheblich."
              }
            },
            {
              "@type": "Question", 
              "name": "Welche Förderung gibt es für PV-Anlagen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "2025 gibt es 30% Bundesförderung (BEG), bis zu 5.000€ Speicher-Bonus, 0% Mehrwertsteuer für Anlagen bis 30 kWp und regionale Förderprogramme. Für Agri-PV sind bis zu 50% Förderung möglich."
              }
            },
            {
              "@type": "Question",
              "name": "Lohnt sich Photovoltaik für Landwirte?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Agri-Photovoltaik ermöglicht doppelte Flächennutzung: Landwirtschaft + Energieproduktion. Ertragssteigerung von 10-25% durch optimales Mikroklima plus zusätzliche Stromproduktion. Förderung bis zu 50% möglich."
              }
            },
            {
              "@type": "Question",
              "name": "Wie hoch ist die Rendite einer PV-Anlage?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Moderne PV-Anlagen erzielen 12-16% jährliche Rendite durch Strompreisersparnis und Einspeisevergütung. Amortisationszeit liegt bei 6-8 Jahren, danach läuft die Anlage kostenlos Strom."
              }
            }
          ]
        },

        // LocalBusiness for each service location
        {
          "@type": "LocalBusiness",
          "@id": "https://www.zoe-solar.de/#main-location",
          "name": "ZOE Solar Hauptsitz",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Solarstraße 123",
            "addressLocality": "Berlin",
            "postalCode": "10115",
            "addressCountry": "DE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "52.5200",
            "longitude": "13.4050"
          },
          "openingHours": "Mo-Fr 08:00-18:00",
          "telephone": "+49-30-123456789",
          "url": "https://www.zoe-solar.de"
        },

        // Product information for different PV systems
        {
          "@type": "Product",
          "name": "Photovoltaik-Anlage für Einfamilienhaus",
          "description": "Komplette PV-Anlage mit hochwertigen Solarmodulen, Wechselrichter und optionalem Batteriespeicher für Einfamilienhäuser",
          "brand": "ZOE Solar",
          "category": "Solar Energy Equipment",
          "audience": {
            "@type": "Audience", 
            "audienceType": "Privathaushalte"
          },
          "offers": {
            "@type": "Offer",
            "price": "12000",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "Product",
          "name": "Agri-Photovoltaik-System",
          "description": "Spezielle Agri-PV Lösungen für Landwirte mit doppelter Flächennutzung und optimiertem Mikroklima",
          "brand": "ZOE Solar",
          "category": "Agricultural Solar Equipment",
          "audience": {
            "@type": "Audience",
            "audienceType": "Landwirtschaft"
          },
          "offers": {
            "@type": "Offer", 
            "price": "45000",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "Product",
          "name": "Gewerbe-Photovoltaik-Anlage",
          "description": "Große PV-Anlagen für Gewerbe und Industrie mit professioneller Planung und 20-jähriger Garantie",
          "brand": "ZOE Solar",
          "category": "Commercial Solar Equipment",
          "audience": {
            "@type": "Audience",
            "audienceType": "Gewerbe"
          },
          "offers": {
            "@type": "Offer",
            "price": "85000",
            "priceCurrency": "EUR", 
            "availability": "https://schema.org/InStock"
          }
        }
      ]
    };

    // Add structured data to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, [targetGroups, services, locations, priceRange]);

  return null; // This component doesn't render anything visible
};

export default SEOEnhancedDataSection;
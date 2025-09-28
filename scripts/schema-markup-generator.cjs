#!/usr/bin/env node

/**
 * Schema Markup Generator für ZOE Solar
 * Generiert JSON-LD Schema Markup für verschiedene Content-Typen
 */

const fs = require('fs');
const path = require('path');

/**
 * Generiert Organization Schema für ZOE Solar
 */
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ZOE Solar GmbH",
    "url": "https://zoe-solar.de",
    "logo": "https://zoe-solar.de/assets/logos/zoe-solar-logo.png",
    "description": "Professionelle Agri-Photovoltaik Lösungen für Landwirte. Kombinieren Sie Landwirtschaft und Stromerzeugung für maximale Effizienz.",
    "foundingDate": "2020",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Berlin",
      "postalCode": "10115",
      "addressCountry": "DE"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+49-30-12345678",
      "contactType": "customer service",
      "availableLanguage": ["German", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/zoesolar",
      "https://www.linkedin.com/company/zoe-solar",
      "https://www.youtube.com/@zoesolar"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Agri-PV Lösungen",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Agri-Photovoltaik Beratung",
            "description": "Kostenlose Erstberatung für Agri-PV Projekte"
          }
        }
      ]
    }
  };
}

/**
 * Generiert Article Schema für Blog-Artikel
 */
function generateArticleSchema(articleData) {
  const {
    title,
    description,
    url,
    image,
    author,
    publishDate,
    modifiedDate,
    keywords
  } = articleData;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": author || "ZOE Solar Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ZOE Solar GmbH",
      "logo": {
        "@type": "ImageObject",
        "url": "https://zoe-solar.de/assets/logos/zoe-solar-logo.png"
      }
    },
    "datePublished": publishDate,
    "dateModified": modifiedDate || publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "keywords": keywords,
    "articleSection": "Agri-Photovoltaik"
  };
}

/**
 * Generiert Product Schema für Produkte
 */
function generateProductSchema(productData) {
  const {
    name,
    description,
    image,
    url,
    price,
    currency,
    availability,
    brand,
    category,
    sku
  } = productData;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": currency || "EUR",
      "price": price,
      "availability": availability || "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "ZOE Solar GmbH"
      }
    },
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": category,
    "sku": sku,
    "manufacturer": {
      "@type": "Organization",
      "name": "ZOE Solar GmbH"
    }
  };
}

/**
 * Generiert FAQ Schema
 */
function generateFAQSchema(faqData) {
  const faqItems = faqData.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems
  };
}

/**
 * Generiert Breadcrumb Schema
 */
function generateBreadcrumbSchema(breadcrumbs) {
  const itemListElements = breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElements
  };
}

/**
 * Generiert LocalBusiness Schema für Standorte
 */
function generateLocalBusinessSchema(locationData) {
  const {
    name,
    address,
    phone,
    email,
    url,
    image,
    priceRange,
    openingHours
  } = locationData;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": name,
    "image": image,
    "telephone": phone,
    "email": email,
    "url": url,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "postalCode": address.zip,
      "addressCountry": address.country
    },
    "priceRange": priceRange || "€€€",
    "openingHours": openingHours,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };
}

/**
 * Generiert Service Schema für Dienstleistungen
 */
function generateServiceSchema(serviceData) {
  const {
    name,
    description,
    provider,
    areaServed,
    offers
  } = serviceData;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider
    },
    "areaServed": areaServed,
    "offers": offers.map(offer => ({
      "@type": "Offer",
      "name": offer.name,
      "description": offer.description,
      "price": offer.price,
      "priceCurrency": "EUR"
    }))
  };
}

/**
 * Generiert HowTo Schema für Anleitungen
 */
function generateHowToSchema(howToData) {
  const {
    name,
    description,
    steps,
    totalTime,
    supply,
    tool
  } = howToData;

  const stepItems = steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    "image": step.image
  }));

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "totalTime": totalTime,
    "supply": supply,
    "tool": tool,
    "step": stepItems
  };
}

/**
 * Hauptfunktion - Generiert alle Schema Markups
 */
function main() {
  console.log('🏗️  Starte Schema Markup Generierung...\n');

  const schemas = {};

  // Organization Schema
  schemas.organization = generateOrganizationSchema();
  console.log('✅ Organization Schema generiert');

  // Beispiel-Artikel Schema
  const sampleArticle = {
    title: "Agri-Photovoltaik: Die Zukunft der Landwirtschaft",
    description: "Erfahren Sie, wie Agri-PV Landwirtschaft und Stromerzeugung kombiniert",
    url: "https://zoe-solar.de/blog/agri-photovoltaik-zukunft",
    image: "https://zoe-solar.de/assets/blog/agri-pv-zukunft.jpg",
    author: "Max Mustermann",
    publishDate: "2024-01-15T10:00:00+01:00",
    keywords: ["Agri-PV", "Landwirtschaft", "Photovoltaik", "Nachhaltigkeit"]
  };
  schemas.article = generateArticleSchema(sampleArticle);
  console.log('✅ Article Schema generiert');

  // Beispiel-Produkt Schema
  const sampleProduct = {
    name: "Agri-PV Komplettsystem 100kW",
    description: "Professionelles Agri-Photovoltaik System für landwirtschaftliche Flächen",
    image: "https://zoe-solar.de/assets/products/agri-pv-100kw.jpg",
    url: "https://zoe-solar.de/produkte/agri-pv-100kw",
    price: "150000",
    currency: "EUR",
    availability: "https://schema.org/InStock",
    brand: "ZOE Solar",
    category: "Photovoltaik Systeme",
    sku: "APV-100KW-001"
  };
  schemas.product = generateProductSchema(sampleProduct);
  console.log('✅ Product Schema generiert');

  // Beispiel-FAQ Schema
  const sampleFAQ = [
    {
      question: "Was ist Agri-Photovoltaik?",
      answer: "Agri-Photovoltaik kombiniert Landwirtschaft und Photovoltaik auf derselben Fläche."
    },
    {
      question: "Welche Förderungen gibt es für Agri-PV?",
      answer: "Es gibt verschiedene Förderprogramme wie KfW und BAFA für Agri-PV Projekte."
    }
  ];
  schemas.faq = generateFAQSchema(sampleFAQ);
  console.log('✅ FAQ Schema generiert');

  // Beispiel-Breadcrumb Schema
  const sampleBreadcrumbs = [
    { name: "Startseite", url: "https://zoe-solar.de" },
    { name: "Produkte", url: "https://zoe-solar.de/produkte" },
    { name: "Agri-PV Systeme", url: "https://zoe-solar.de/produkte/agri-pv" }
  ];
  schemas.breadcrumb = generateBreadcrumbSchema(sampleBreadcrumbs);
  console.log('✅ Breadcrumb Schema generiert');

  // Beispiel-LocalBusiness Schema
  const sampleLocation = {
    name: "ZOE Solar Berlin",
    address: {
      street: "Musterstraße 123",
      city: "Berlin",
      zip: "10115",
      country: "DE"
    },
    phone: "+49-30-12345678",
    email: "berlin@zoe-solar.de",
    url: "https://zoe-solar.de/standort/berlin",
    image: "https://zoe-solar.de/assets/locations/berlin.jpg",
    openingHours: ["Mo-Fr 09:00-18:00", "Sa 10:00-14:00"]
  };
  schemas.localBusiness = generateLocalBusinessSchema(sampleLocation);
  console.log('✅ LocalBusiness Schema generiert');

  // Beispiel-Service Schema
  const sampleService = {
    name: "Agri-PV Beratung",
    description: "Professionelle Beratung für Agri-Photovoltaik Projekte",
    provider: "ZOE Solar GmbH",
    areaServed: ["Deutschland", "Österreich", "Schweiz"],
    offers: [
      {
        name: "Erstberatung",
        description: "Kostenlose Erstberatung für Agri-PV Projekte",
        price: "0"
      },
      {
        name: "Vollberatung",
        description: "Komplette Projektberatung inkl. Wirtschaftlichkeitsberechnung",
        price: "1500"
      }
    ]
  };
  schemas.service = generateServiceSchema(sampleService);
  console.log('✅ Service Schema generiert');

  // Speichere alle Schemas
  const outputFile = path.join(__dirname, '..', 'data', 'schema-markups.json');
  fs.writeFileSync(outputFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    schemas
  }, null, 2));

  console.log(`\n💾 Schema Markups gespeichert: ${outputFile}`);
  console.log('\n🎉 Schema Markup Generierung abgeschlossen!');
  console.log('\n📋 Generierte Schema-Typen:');
  Object.keys(schemas).forEach(type => {
    console.log(`  • ${type.charAt(0).toUpperCase() + type.slice(1)} Schema`);
  });
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  generateOrganizationSchema,
  generateArticleSchema,
  generateProductSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
  generateHowToSchema
};
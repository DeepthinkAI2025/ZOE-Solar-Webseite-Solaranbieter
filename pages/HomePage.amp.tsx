import React from 'react';

const HomePageAMP: React.FC = () => {
  const ampHtml = `<!DOCTYPE html>
<html amp lang="de">
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-carousel" src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js"></script>
  <script async custom-element="amp-accordion" src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"></script>
  <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>
  <title>Solaranlage Eigenheim - Komplette Photovoltaik-Lösungen für Ihr Zuhause | ZOE Solar</title>
  <meta name="description" content="Solaranlage für Einfamilienhaus: Kostenlose Beratung, Planung & Installation. Bis zu 30% Förderung. Testsieger 2025. Jetzt kostenloses Angebot anfordern! Bis zu 30% Förderung möglich." />
  <meta name="keywords" content="Solaranlage Eigenheim, Photovoltaik Einfamilienhaus, Solaranlage Kosten, PV-Anlage Haus, Solarstrom Eigenheim" />
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <meta property="og:title" content="Solaranlage Eigenheim - Komplette Photovoltaik-Lösungen für Ihr Zuhause" />
  <meta property="og:description" content="Solaranlage für Einfamilienhaus: Kostenlose Beratung, Planung & Installation. Bis zu 30% Förderung. Testsieger 2025." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Solaranlage Eigenheim - Komplette Photovoltaik-Lösungen" />
  <meta name="twitter:description" content="Solaranlage für Einfamilienhaus: Kostenlose Beratung, Planung & Installation. Bis zu 30% Förderung." />
  <link rel="canonical" href="https://zoe-solar.de/" />
  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <style amp-custom>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
    .hero { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 50px 20px; text-align: center; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 20px; }
    .hero p { font-size: 1.2rem; margin-bottom: 30px; }
    .cta-button { background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
    .section { padding: 40px 20px; max-width: 1200px; margin: 0 auto; }
    .section h2 { color: #1e3a8a; font-size: 2rem; margin-bottom: 20px; }
    .benefits { display: flex; flex-wrap: wrap; gap: 20px; }
    .benefit { flex: 1 1 300px; text-align: center; }
    .benefit amp-img { width: 100px; height: 100px; margin: 0 auto 20px; }
    .faq { margin-top: 40px; }
    .faq amp-accordion { background: #f9f9f9; }
    .faq section { border-bottom: 1px solid #ddd; }
    .faq section h3 { background: #1e3a8a; color: white; padding: 15px; margin: 0; }
    .faq section p { padding: 15px; margin: 0; }
  </style>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "name": "ZOE Solar",
          "description": "Ihr Experte für Solaranlagen im Eigenheim. Komplette Photovoltaik-Lösungen mit kostenloser Beratung und Installation.",
          "url": "https://zoe-solar.de",
          "logo": "https://zoe-solar.de/logo.png",
          "sameAs": [
            "https://www.facebook.com/zoesolar",
            "https://www.instagram.com/zoesolar",
            "https://www.linkedin.com/company/zoe-solar"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+49-30-12345678",
            "contactType": "customer service",
            "availableLanguage": "German"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Germany"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Solaranlagen Dienstleistungen",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Solaranlage Installation",
                  "description": "Komplette Installation von Photovoltaik-Anlagen für Einfamilienhäuser"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Solaranlage Beratung",
                  "description": "Kostenlose Beratung zur optimalen Solaranlage für Ihr Zuhause"
                }
              }
            ]
          }
        },
        {
          "@type": "WebSite",
          "name": "ZOE Solar",
          "url": "https://zoe-solar.de",
          "description": "Solaranlagen für Einfamilienhäuser - Kostenlose Beratung und Installation",
          "publisher": {
            "@type": "Organization",
            "name": "ZOE Solar"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://zoe-solar.de/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "Product",
          "name": "Solaranlage Komplettsystem",
          "description": "Komplette Photovoltaik-Anlage für Einfamilienhäuser mit Speicher und Wallbox",
          "brand": {
            "@type": "Brand",
            "name": "ZOE Solar"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "priceRange": "15000-35000",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "ZOE Solar"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Wie viel kostet eine Solaranlage für ein Einfamilienhaus?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Die Kosten für eine Solaranlage liegen zwischen 15.000€ und 35.000€, abhängig von Größe und Ausstattung. Mit Förderungen reduzieren sich die Kosten um bis zu 30%."
              }
            },
            {
              "@type": "Question",
              "name": "Wie lange dauert die Installation einer Solaranlage?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Die Installation dauert typischerweise 2-5 Tage, abhängig von der Komplexität der Anlage und Dachsituation."
              }
            }
          ]
        },
        {
          "@type": "Service",
          "name": "Solaranlage Wartung",
          "description": "Professionelle Wartung und Service für Ihre Photovoltaik-Anlage",
          "provider": {
            "@type": "Organization",
            "name": "ZOE Solar"
          },
          "serviceType": "Wartungsservice",
          "areaServed": {
            "@type": "Country",
            "name": "Germany"
          }
        }
      ]
    }
  </script>
</head>
<body>
  <header class="hero">
    <amp-img src="/assets/logos/zoe-solar-logo.png" width="200" height="60" alt="ZOE Solar Logo"></amp-img>
    <h1>Solaranlage für Ihr Eigenheim</h1>
    <p>Kostenlose Beratung • Professionelle Installation • Bis zu 30% Förderung</p>
    <a href="tel:+493012345678" class="cta-button">Jetzt anrufen</a>
  </header>

  <section class="section">
    <h2>Warum ZOE Solar?</h2>
    <div class="benefits">
      <div class="benefit">
        <amp-img src="/assets/icons/expertise.png" width="100" height="100" alt="Expertise"></amp-img>
        <h3>Testsieger 2025</h3>
        <p>Mehrfach ausgezeichnet für Qualität und Kundenzufriedenheit</p>
      </div>
      <div class="benefit">
        <amp-img src="/assets/icons/guarantee.png" width="100" height="100" alt="Garantie"></amp-img>
        <h3>10 Jahre Garantie</h3>
        <p>Vollständige Garantie auf alle Komponenten und Installation</p>
      </div>
      <div class="benefit">
        <amp-img src="/assets/icons/savings.png" width="100" height="100" alt="Einsparungen"></amp-img>
        <h3>Bis zu 30% Förderung</h3>
        <p>Maximale staatliche Förderungen für Ihre Solaranlage</p>
      </div>
    </div>
  </section>

  <section class="section">
    <h2>Unsere Dienstleistungen</h2>
    <amp-carousel height="300" layout="fixed-height" type="slides">
      <div>
        <h3>Komplette Solaranlagen</h3>
        <p>Von der Beratung bis zur Inbetriebnahme - alles aus einer Hand</p>
      </div>
      <div>
        <h3>E-Mobilität</h3>
        <p>Ladestationen und Wallboxen für Elektroautos</p>
      </div>
      <div>
        <h3>Energiespeicher</h3>
        <p>Optimale Speicherlösungen für Ihren Solarstrom</p>
      </div>
    </amp-carousel>
  </section>

  <section class="section faq">
    <h2>Häufige Fragen</h2>
    <amp-accordion>
      <section>
        <h3>Wie viel kostet eine Solaranlage?</h3>
        <p>Die Kosten liegen zwischen 15.000€ und 35.000€, abhängig von Größe und Ausstattung. Mit Förderungen reduzieren sich die Kosten um bis zu 30%.</p>
      </section>
      <section>
        <h3>Wie lange dauert die Installation?</h3>
        <p>Die Installation dauert typischerweise 2-5 Tage, abhängig von der Komplexität der Anlage und Dachsituation.</p>
      </section>
      <section>
        <h3>Welche Förderungen gibt es?</h3>
        <p>Es gibt verschiedene Förderprogramme wie KFW-Förderung, Einspeisevergütung und lokale Förderungen bis zu 30% der Gesamtkosten.</p>
      </section>
    </amp-accordion>
  </section>

  <section class="section">
    <h2>Kostenloses Angebot anfordern</h2>
    <form method="post" action-xhr="/api/contact" target="_top">
      <input type="text" name="name" placeholder="Ihr Name" required>
      <input type="email" name="email" placeholder="Ihre E-Mail" required>
      <input type="tel" name="phone" placeholder="Ihre Telefonnummer" required>
      <input type="submit" value="Angebot anfordern">
    </form>
  </section>

  <footer class="section" style="background: #1e3a8a; color: white; text-align: center;">
    <p>&copy; 2025 ZOE Solar. Alle Rechte vorbehalten.</p>
    <p>Telefon: +49 30 12345678 | E-Mail: info@zoe-solar.de</p>
  </footer>
</body>
</html>`;

  return <div dangerouslySetInnerHTML={{ __html: ampHtml }} />;
};

export default HomePageAMP;
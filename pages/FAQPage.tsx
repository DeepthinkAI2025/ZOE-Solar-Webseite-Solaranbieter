import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Page } from '../types';
import { SemanticMain, SemanticSection } from '../components/SemanticLayout';
import FAQ from '../components/FAQ';

interface FAQPageProps {
  setPage: (page: Page) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ setPage }) => {
  const [customerType, setCustomerType] = useState<'private' | 'business'>('private');

  return (
    <SemanticMain className="w-full">
      <Helmet>
        <title>Häufige Fragen (FAQ) - ZOE Solar | Antworten zu Solaranlagen</title>
        <meta name="description" content="Häufige Fragen und Antworten zu Solaranlagen, Photovoltaik, Installation und Förderungen. Professionelle Beratung von ZOE Solar." />
        <meta name="keywords" content="FAQ Solaranlagen, Photovoltaik Fragen, Solaranlage Beratung, PV-Anlage Kosten, Förderungen Solar" />
        <meta property="og:title" content="Häufige Fragen (FAQ) - ZOE Solar" />
        <meta property="og:description" content="Häufige Fragen und Antworten zu Solaranlagen, Photovoltaik, Installation und Förderungen." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Häufige Fragen (FAQ) - ZOE Solar" />
        <meta name="twitter:description" content="Häufige Fragen und Antworten zu Solaranlagen, Photovoltaik, Installation und Förderungen." />
        <link rel="canonical" href="https://zoe-solar.de/wissen/faq" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Wie viel kostet eine Solaranlage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Die Kosten für eine Solaranlage liegen typischerweise zwischen 1.200-1.800 € pro kWp installierter Leistung. Für eine 10 kWp Anlage betragen die Gesamtkosten somit etwa 12.000-18.000 €. Förderungen können die Kosten um bis zu 40% reduzieren."
                }
              },
              {
                "@type": "Question",
                "name": "Wie lange dauert die Installation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Von der ersten Beratung bis zur Inbetriebnahme dauert es typischerweise 8-12 Wochen. Die Planungsphase nimmt etwa 2-4 Wochen in Anspruch, die Installation selbst erfolgt innerhalb von 1-2 Tagen."
                }
              },
              {
                "@type": "Question",
                "name": "Welche Förderungen gibt es?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Es gibt verschiedene Förderprogramme: KfW-Förderung bis zu 7.500 €, Einspeisevergütung nach EEG, steuerliche Vorteile und lokale Förderungen. Die genauen Konditionen ändern sich regelmäßig – wir halten Sie auf dem neuesten Stand."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <SemanticSection aria-label="Häufige Fragen">
        <FAQ customerType={customerType} setPage={setPage} />
      </SemanticSection>
    </SemanticMain>
  );
};

export default FAQPage;
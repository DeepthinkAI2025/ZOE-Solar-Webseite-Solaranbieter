import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import HighIntentCTA from '../components/HighIntentCTA';
import VideoSection from '../components/VideoSection';
import GlossarLink from '../components/GlossarLink';

const PhotovoltaikIndustriePage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Photovoltaik für Industrie: Wirtschaftliche Solarlösungen für Unternehmen",
    "description": "Entdecken Sie die Vorteile von Photovoltaik-Anlagen für Industriebetriebe. Von Energieautarkie bis zur CO2-Reduzierung - wir zeigen Ihnen profitable Lösungen für Ihr Unternehmen.",
    "author": {
      "@type": "Organization",
      "name": "ZOE Solar"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ZOE Solar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.zoe-solar.de/logo.png"
      }
    },
    "datePublished": "2026-01-15",
    "dateModified": "2026-01-15",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.zoe-solar.de/photovoltaik-industrie"
    },
    "articleSection": "Photovoltaik für Industrie",
    "keywords": "Photovoltaik Industrie, Solaranlagen Unternehmen, Energieautarkie Industrie, CO2 Reduzierung Betrieb, Photovoltaik ROI Industrie"
  };

  const heroData = {
    title: "Photovoltaik für Industrie: Wirtschaftliche Solarlösungen für Unternehmen",
    subtitle: "Maximieren Sie Ihre Energieautarkie und senken Sie nachhaltig Ihre Betriebskosten mit maßgeschneiderten Photovoltaik-Anlagen für Industriebetriebe.",
    ctaText: "Kostenlose Beratung anfordern",
    ctaLink: "/kontakt",
    backgroundImage: "/images/industrial-solar-hero.jpg"
  };

  return (
    <>
      <Helmet>
        <title>Photovoltaik für Industrie | Wirtschaftliche Solarlösungen für Unternehmen | ZOE Solar</title>
        <meta name="description" content="Entdecken Sie die Vorteile von Photovoltaik-Anlagen für Industriebetriebe. Von Energieautarkie bis zur CO2-Reduzierung - wir zeigen Ihnen profitable Lösungen für Ihr Unternehmen." />
        <meta name="keywords" content="Photovoltaik Industrie, Solaranlagen Unternehmen, Energieautarkie Industrie, CO2 Reduzierung Betrieb, Photovoltaik ROI Industrie" />
        <link rel="canonical" href="https://www.zoe-solar.de/photovoltaik-industrie" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Hero {...heroData} />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Warum Photovoltaik für Industriebetriebe die Zukunft ist
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  💰 Wirtschaftliche Vorteile
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Reduzierung der Energiekosten um bis zu 70%</li>
                  <li>• Schnelle Amortisation durch hohe Dachflächen</li>
                  <li>• Steuerliche Vorteile und Fördermöglichkeiten</li>
                  <li>• Schutz vor steigenden Strompreisen</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🌱 Nachhaltigkeitsaspekte
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Signifikante CO2-Reduzierung</li>
                  <li>• Beitrag zu Unternehmens-Image</li>
                  <li>• Erfüllung von ESG-Kriterien</li>
                  <li>• Zukunftssicherheit durch grüne Energie</li>
                </ul>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h3>Individuelle Lösungen für Industriebetriebe</h3>

              <p>
                Industriebetriebe haben besondere Anforderungen an ihre Energieversorgung. Hoher Energieverbrauch,
                unregelmäßige Produktionszeiten und große Dachflächen erfordern maßgeschneiderte Photovoltaik-Lösungen.
                Bei ZOE Solar entwickeln wir Konzepte, die perfekt auf Ihren Betrieb abgestimmt sind.
              </p>

              <h4>Technische Besonderheiten für Industrieanlagen</h4>

              <ul>
                <li><strong>Hohe Leistung:</strong> Module mit bis zu 500Wp für maximale Energieausbeute</li>
                <li><strong>Robustheit:</strong> Wetterfeste Konstruktion für industrielle Umgebungen</li>
                <li><strong>Monitoring:</strong> 24/7 Überwachung der Anlagenperformance</li>
                <li><strong>Integration:</strong> Nahtlose Einbindung in bestehende Energiesysteme</li>
              </ul>

              <h4>Finanzierungsmodelle für Unternehmen</h4>

              <p>
                Wir bieten verschiedene Finanzierungsmöglichkeiten, die speziell auf die Bedürfnisse von Industriebetrieben
                zugeschnitten sind. Von Leasing über Contracting bis hin zu klassischer Finanzierung - finden wir gemeinsam
                die optimale Lösung für Ihr Unternehmen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <VideoSection
        title="Photovoltaik in der Industrie - Erfolgsgeschichten"
        subtitle="Sehen Sie, wie andere Industriebetriebe von Photovoltaik profitieren"
        videoId="industrial-solar-success"
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Bereit für Ihre Energiewende?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Lassen Sie uns gemeinsam Ihre Photovoltaik-Lösung planen. Unsere Experten beraten Sie kostenlos
              und erstellen ein maßgeschneidertes Konzept für Ihren Industriebetrieb.
            </p>
          </div>
        </div>
      </section>

      <HighIntentCTA setPage={(page) => window.location.href = `/${page}`} customerType="business" />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Weitere Informationen
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <GlossarLink term="Photovoltaik" />
              <GlossarLink term="Energieautarkie" />
              <GlossarLink term="CO2-Reduzierung" />
              <GlossarLink term="Fördermittel" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PhotovoltaikIndustriePage;
import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '../components/Hero';
import HighIntentCTA from '../components/HighIntentCTA';
import VideoSection from '../components/VideoSection';
import GlossarLink from '../components/GlossarLink';
import { getBaseUrl } from '../src/utils/urlUtils';

const PhotovoltaikGewerbegebaeudePage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Photovoltaik für Gewerbegebäude: Nachhaltige Energie für Unternehmen",
    "description": "Entdecken Sie die Vorteile von Photovoltaik-Anlagen auf Gewerbegebäuden. Von Dach- über Fassaden-PV bis zu Carport-Lösungen - wir zeigen rentable Lösungen für Gewerbeimmobilien.",
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
      "@id": "https://www.zoe-solar.de/photovoltaik-gewerbegebaeude"
    },
    "articleSection": "Photovoltaik für Gewerbegebäude",
    "keywords": "Photovoltaik Gewerbegebäude, Solaranlagen Bürogebäude, PV Gewerbeimmobilien, Dach-Photovoltaik Gewerbe, Fassaden-PV"
  };

  const heroData = {
    title: "Photovoltaik für Gewerbegebäude: Wirtschaftlich und Nachhaltig",
    subtitle: "Transformieren Sie Ihr Gewerbegebäude in eine Energiequelle. Von Bürokomplexen bis zu Industriehallen - wir planen maßgeschneiderte PV-Lösungen für maximale Wirtschaftlichkeit.",
    ctaText: "Kostenlose Gebäudeanalyse",
    ctaLink: "/kontakt",
    backgroundImage: "/images/commercial-building-solar-hero.jpg"
  };

  return (
    <>
      <Helmet>
        <title>Photovoltaik für Gewerbegebäude | Wirtschaftliche Solarlösungen | ZOE Solar</title>
        <meta name="description" content="Entdecken Sie die Vorteile von Photovoltaik-Anlagen auf Gewerbegebäuden. Von Dach- über Fassaden-PV bis zu Carport-Lösungen - wir zeigen rentable Lösungen für Gewerbeimmobilien." />
        <meta name="keywords" content="Photovoltaik Gewerbegebäude, Solaranlagen Bürogebäude, PV Gewerbeimmobilien, Dach-Photovoltaik Gewerbe, Fassaden-PV" />
        <link rel="canonical" href="https://www.zoe-solar.de/photovoltaik-gewerbegebaeude" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Hero {...heroData} />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Warum Photovoltaik für Gewerbegebäude die ideale Wahl ist
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🏢 Gebäudeoptimierung
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Maximale Dachflächenausnutzung</li>
                  <li>• Fassaden- und Carport-Integration</li>
                  <li>• Ästhetische und funktionale Lösungen</li>
                  <li>• Wertsteigerung der Immobilie</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  💼 Wirtschaftliche Vorteile
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Reduzierte Betriebskosten</li>
                  <li>• Attraktive Fördermöglichkeiten</li>
                  <li>• Steuerliche Vorteile für Unternehmen</li>
                  <li>• Positive Marketingeffekte</li>
                </ul>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h3>Photovoltaik-Lösungen für verschiedene Gewerbegebäude-Typen</h3>

              <p>
                Gewerbegebäude bieten ideale Voraussetzungen für Photovoltaik-Anlagen. Große Dachflächen,
                hoher Energieverbrauch und die Möglichkeit zur Eigenstromnutzung machen PV-Investitionen
                besonders rentabel. Bei ZOE Solar entwickeln wir maßgeschneiderte Konzepte für alle
                Gewerbeimmobilien-Typen.
              </p>

              <h4>PV-Anlagen für Bürogebäude</h4>

              <p>
                Moderne Bürokomplexe profitieren besonders von Photovoltaik-Anlagen. Tagsüber hoher
                Stromverbrauch durch Beleuchtung, Klimaanlagen und Bürogeräte macht den Eigenverbrauch
                des erzeugten Solarstroms optimal.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg my-8">
                <h5 className="font-semibold mb-4">Optimale Bürogebäude-Konfigurationen:</h5>
                <ul className="space-y-2">
                  <li><strong>Dach-PV:</strong> Klassische Aufdach-Lösungen mit 100-500 kWp</li>
                  <li><strong>Fassaden-PV:</strong> Vertikale Module für Süd- und Westfassaden</li>
                  <li><strong>Carport-PV:</strong> Überdachte Parkplätze mit integrierten Modulen</li>
                  <li><strong>BIPV:</strong> Gebäudeintegrierte Module als architektonisches Element</li>
                </ul>
              </div>

              <h4>Industriehallen und Produktionsgebäude</h4>

              <p>
                Große Hallendächer bieten enormes Potenzial für Photovoltaik. Die hohen Stromkosten
                in der Industrie machen PV-Anlagen zu einer der rentabelsten Investitionen überhaupt.
              </p>

              <h4>Handels- und Einzelhandelsgebäude</h4>

              <p>
                Einkaufszentren, Supermärkte und Fachmärkte haben typischerweise große Dachflächen
                und profitieren von der positiven Außenwirkung nachhaltiger Energieversorgung.
              </p>

              <h4>Technische Planung und Genehmigung</h4>

              <p>
                Bei Gewerbegebäuden sind statische Anforderungen, Brandschutz und baurechtliche
                Aspekte besonders wichtig. Wir übernehmen die komplette Planung und koordinieren
                alle notwendigen Genehmigungen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <VideoSection
        title="Photovoltaik auf Gewerbegebäuden - Referenzprojekte"
        subtitle="Sehen Sie erfolgreiche Installationen auf Bürogebäuden und Gewerbeimmobilien"
        videoId="commercial-building-solar-cases"
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Wirtschaftlichkeitsanalyse für Gewerbegebäude
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Amortisationszeiten</h4>
                <p className="text-gray-700 text-sm">
                  Bei Gewerbegebäuden beträgt die Amortisationszeit typischerweise 6-10 Jahre,
                  abhängig von Dachgröße, Strompreisen und Förderungen.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Fördermöglichkeiten</h4>
                <p className="text-gray-700 text-sm">
                  Neben KfW-Förderungen profitieren Gewerbegebäude von steuerlichen Vorteilen
                  und möglichen Mieterstrom-Modellen.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Wertsteigerung</h4>
                <p className="text-gray-700 text-sm">
                  PV-Anlagen erhöhen den Immobilienwert und machen Gebäude attraktiver
                  für Mieter und Käufer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Von der Planung zur Installation
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Wir begleiten Sie durch den gesamten Prozess - von der ersten Beratung über die
              technische Planung bis zur schlüsselfertigen Installation und Wartung Ihrer
              Gewerbe-PV-Anlage.
            </p>
          </div>
        </div>
      </section>

      <HighIntentCTA setPage={(page) => window.location.href = `${getBaseUrl()}/${page}`} customerType="business" />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Weitere Informationen
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <GlossarLink term="Photovoltaik" />
              <GlossarLink term="Fördermittel" />
              <GlossarLink term="BIPV" />
              <GlossarLink term="Eigenverbrauch" />
            </div>
            <p className="mt-6 text-center text-sm text-gray-600">
              Erfahren Sie mehr über unsere <a href="/photovoltaik-gewerbe" className="text-green-600 hover:underline">umfassenden Photovoltaik-Lösungen für Gewerbe</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PhotovoltaikGewerbegebaeudePage;
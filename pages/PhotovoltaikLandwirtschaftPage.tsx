import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '../components/Hero';
import HighIntentCTA from '../components/HighIntentCTA';
import VideoSection from '../components/VideoSection';
import GlossarLink from '../components/GlossarLink';

const PhotovoltaikLandwirtschaftPage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Photovoltaik für Landwirtschaft: AgriPV - Ernte und Energie gleichzeitig",
    "description": "Entdecken Sie Agri-Photovoltaik: Moderne Solaranlagen für Landwirte, die Ernte und Stromproduktion kombinieren. Maximale Flächeneffizienz und nachhaltige Landbewirtschaftung.",
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
      "@id": "https://www.zoe-solar.de/photovoltaik-landwirtschaft"
    },
    "articleSection": "Agri-Photovoltaik",
    "keywords": "AgriPV, Photovoltaik Landwirtschaft, Solaranlagen Bauern, Agrivoltaik, Photovoltaik Ackerbau, Solarenergie Landwirte"
  };

  const heroData = {
    title: "Agri-Photovoltaik: Ernte und Energie gleichzeitig produzieren",
    subtitle: "Moderne Solaranlagen für Landwirte, die landwirtschaftliche Nutzung und Stromproduktion optimal kombinieren. Maximale Effizienz für Ihre Flächen.",
    ctaText: "Kostenlose Beratung für Landwirte",
    ctaLink: "/kontakt",
    backgroundImage: "/images/agri-solar-hero.jpg"
  };

  return (
    <>
      <Helmet>
        <title>Agri-Photovoltaik | Photovoltaik für Landwirtschaft | ZOE Solar</title>
        <meta name="description" content="Entdecken Sie Agri-Photovoltaik: Moderne Solaranlagen für Landwirte, die Ernte und Stromproduktion kombinieren. Maximale Flächeneffizienz und nachhaltige Landbewirtschaftung." />
        <meta name="keywords" content="AgriPV, Photovoltaik Landwirtschaft, Solaranlagen Bauern, Agrivoltaik, Photovoltaik Ackerbau, Solarenergie Landwirte" />
        <link rel="canonical" href="https://www.zoe-solar.de/photovoltaik-landwirtschaft" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <Hero {...heroData} />

      <section className="section-y bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-section text-slate-900 mb-8 text-center">
              Warum Agri-Photovoltaik die Zukunft der Landwirtschaft ist
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-primary-50 to-yellow-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  🌾 Doppelte Flächennutzung
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Stromproduktion über der Ernte</li>
                  <li>• Optimale Lichtdurchlässigkeit für Pflanzen</li>
                  <li>• Schutz vor extremen Wetterbedingungen</li>
                  <li>• Maximale Effizienz der landwirtschaftlichen Flächen</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  💰 Wirtschaftliche Vorteile
                </h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Zusätzliches Einkommen aus Stromverkauf</li>
                  <li>• Reduzierte Energiekosten für den Betrieb</li>
                  <li>• Fördermöglichkeiten für AgriPV-Anlagen</li>
                  <li>• Langfristige Wertsteigerung der Flächen</li>
                </ul>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h3>Agri-Photovoltaik: Die intelligente Lösung für moderne Landwirtschaft</h3>

              <p>
                Agri-Photovoltaik (AgriPV) revolutioniert die traditionelle Landwirtschaft, indem sie Solarenergiegewinnung
                und landwirtschaftliche Produktion auf derselben Fläche kombiniert. Durch speziell entwickelte Systeme
                wird das Sonnenlicht optimal zwischen Pflanzenwachstum und Stromproduktion verteilt.
              </p>

              <h4>Technische AgriPV-Lösungen</h4>

              <ul>
                <li><strong>Optimale Lichtdurchlässigkeit:</strong> 20-40% des Sonnenlichts erreicht die Pflanzen</li>
                <li><strong>Höhenverstellbare Systeme:</strong> Anpassung an verschiedene Kulturpflanzen</li>
                <li><strong>Schattenoptimierung:</strong> Gleichmäßige Lichtverteilung für besseres Pflanzenwachstum</li>
                <li><strong>Wetterprotection:</strong> Schutz vor Hagel, starkem Regen und intensiver Sonneneinstrahlung</li>
              </ul>

              <h4>Passende Kulturen für AgriPV</h4>

              <p>
                Nicht alle Pflanzen eignen sich gleichermaßen für den Anbau unter Solaranlagen. Wir beraten Sie
                bei der Auswahl der optimalen Kulturen für Ihre AgriPV-Anlage und entwickeln maßgeschneiderte
                Lösungen für Ihren Betrieb.
              </p>

              <div className="bg-slate-50 p-6 rounded-lg my-8">
                <h5 className="font-semibold mb-4">Geeignete Kulturpflanzen:</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-1">
                    <li>• Spargel und Erdbeeren</li>
                    <li>• Kartoffeln und Karotten</li>
                    <li>• Salate und Kräuter</li>
                    <li>• Beerenobst</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• Weinreben</li>
                    <li>• Extensive Grünlandnutzung</li>
                    <li>• Heil- und Gewürzpflanzen</li>
                    <li>• Spezielle Schattenkulturen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoSection
        title="AgriPV in der Praxis - Erfolgsgeschichten aus der Landwirtschaft"
        subtitle="Sehen Sie, wie Landwirte von der Kombination aus Ernte und Solarenergie profitieren"
        videoId="agri-solar-success"
      />

      <section className="section-y bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-section text-slate-900 mb-8 text-center">
              Fördermöglichkeiten für Agri-Photovoltaik
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-3">Bundesförderung</h4>
                <p className="text-slate-700 text-sm">
                  Bis zu 40% Förderung für AgriPV-Anlagen durch das Bundesministerium für Ernährung und Landwirtschaft.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-3">Landesförderung</h4>
                <p className="text-slate-700 text-sm">
                  Zusätzliche Förderprogramme der Bundesländer für innovative AgriPV-Projekte.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-3">EU-Förderung</h4>
                <p className="text-slate-700 text-sm">
                  Unterstützung durch den Europäischen Landwirtschaftsfonds für die Entwicklung des ländlichen Raums.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-section text-slate-900 mb-8">
              Starten Sie Ihre AgriPV-Zukunft
            </h2>
            <p className="text-lg text-slate-700 mb-8">
              Als erfahrener Partner für landwirtschaftliche Solarprojekte unterstützen wir Sie bei allen
              Schritten - von der Planung über die Fördermittelbeantragung bis zur Installation und Wartung.
            </p>
          </div>
        </div>
      </section>

      <HighIntentCTA setPage={(page) => window.location.href = `/${page}`} customerType="business" />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Weitere Informationen
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <GlossarLink term="Agri-Photovoltaik" />
              <GlossarLink term="Fördermittel" />
              <GlossarLink term="Photovoltaik" />
              <GlossarLink term="Energieautarkie" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PhotovoltaikLandwirtschaftPage;
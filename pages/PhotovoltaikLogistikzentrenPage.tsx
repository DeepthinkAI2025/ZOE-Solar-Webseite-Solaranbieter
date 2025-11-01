import React from 'react';
import { Helmet } from 'react-helmet';
import PageHero from '../components/PageHero';
import HighIntentCTA from '../components/HighIntentCTA';

const PhotovoltaikLogistikzentrenPage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Photovoltaik für Logistikzentren | ZOE Solar",
    "description": "Entdecken Sie maßgeschneiderte Photovoltaik-Lösungen für Logistikzentren. Maximieren Sie Ihre Energieeffizienz und senken Sie Betriebskosten mit solarer Stromerzeugung.",
    "url": "https://zoe-solar.de/photovoltaik-logistikzentren",
    "publisher": {
      "@type": "Organization",
      "name": "ZOE Solar",
      "url": "https://zoe-solar.de"
    },
    "mainEntity": {
      "@type": "Service",
      "name": "Photovoltaik für Logistikzentren",
      "description": "Professionelle Photovoltaik-Installation für Logistikzentren mit maßgeschneiderten Lösungen für Dach- und Freiflächenmontage.",
      "provider": {
        "@type": "Organization",
        "name": "ZOE Solar"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Photovoltaik für Logistikzentren | ZOE Solar</title>
        <meta name="description" content="Entdecken Sie maßgeschneiderte Photovoltaik-Lösungen für Logistikzentren. Maximieren Sie Ihre Energieeffizienz und senken Sie Betriebskosten mit solarer Stromerzeugung." />
        <meta name="keywords" content="Photovoltaik Logistikzentren, Solaranlagen Logistik, Dach-Photovoltaik Lagerhallen, Freiflächenanlagen Logistik, Energieeffizienz Logistikzentren" />
        <link rel="canonical" href="https://zoe-solar.de/photovoltaik-logistikzentren" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <PageHero
          title="Photovoltaik für Logistikzentren"
          subtitle="Maximale Energieeffizienz für Ihre Logistik-Immobilien"
          description="Nutzen Sie das Potenzial Ihrer Dachflächen und Freiflächen für nachhaltige Stromerzeugung. Unsere maßgeschneiderten Photovoltaik-Lösungen für Logistikzentren reduzieren Ihre Betriebskosten und stärken Ihre Nachhaltigkeitsziele."
          primaryButtonText="Kostenlose Beratung"
          primaryButtonLink="/kontakt"
          secondaryButtonText="Referenzprojekte ansehen"
          secondaryButtonLink="/fallstudien"
        />

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Warum Photovoltaik für Logistikzentren?
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Logistikzentren bieten ideale Voraussetzungen für Photovoltaik-Anlagen:
                    Große Dachflächen, hoher Stromverbrauch und oft vorhandene Freiflächen
                    machen sie zu perfekten Kandidaten für solare Energiegewinnung.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Hohe Dachlasten ermöglichen optimale Modulausrichtung</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Direkter Eigenverbrauch des erzeugten Stroms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Reduzierung der Netzentgelte durch Lastverschiebung</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Stärkung des Unternehmensimages als Nachhaltigkeitsführer</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Wirtschaftliche Vorteile
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Amortisationszeit</span>
                    <span className="font-semibold text-green-600">6-8 Jahre</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Stromkosteneinsparung</span>
                    <span className="font-semibold text-green-600">bis zu 30%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">CO₂-Einsparung</span>
                    <span className="font-semibold text-green-600">100-500 t/Jahr</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Fördermöglichkeiten</span>
                    <span className="font-semibold text-green-600">bis zu 20%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Dachmontage
                </h3>
                <p className="text-gray-600 mb-4">
                  Optimale Nutzung vorhandener Dachflächen ohne zusätzlichen Flächenverbrauch.
                  Ideal für bestehende Logistikzentren.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Flachdach- und Pultdachsysteme</li>
                  <li>• Ballastierung ohne Dachdurchdringung</li>
                  <li>• Integration in bestehende Gebäude</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-xl">🌞</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Freiflächenanlagen
                </h3>
                <p className="text-gray-600 mb-4">
                  Maximale Stromerzeugung durch freistehende Anlagen auf Parkplätzen
                  oder Brachflächen des Logistikzentrums.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Höchste Erträge pro qm</li>
                  <li>• Nachrüstbare Speichersysteme</li>
                  <li>• Flexible Erweiterungsmöglichkeiten</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Hybridsysteme
                </h3>
                <p className="text-gray-600 mb-4">
                  Kombination aus Dach- und Freiflächenanlagen für maximale
                  Energieautarkie und Wirtschaftlichkeit.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Optimale Lastverteilung</li>
                  <li>• Redundante Stromversorgung</li>
                  <li>• Skalierbare Lösungen</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">
                Bereit für die Energiewende?
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Lassen Sie uns gemeinsam Ihre Logistikimmobilie nachhaltig und wirtschaftlich gestalten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/kontakt"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Kostenlose Beratung
                </a>
                <a
                  href="/photovoltaik-gewerbe"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Mehr zu Gewerbe-Photovoltaik
                </a>
              </div>
            </div>
          </div>
        </section>

        <HighIntentCTA setPage={(page) => window.location.href = `/${page}`} customerType="business" />
      </div>
    </>
  );
};

export default PhotovoltaikLogistikzentrenPage;
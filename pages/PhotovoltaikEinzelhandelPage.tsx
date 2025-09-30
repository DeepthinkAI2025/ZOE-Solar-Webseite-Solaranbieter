import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHero from '../components/PageHero';
import HighIntentCTA from '../components/HighIntentCTA';

const PhotovoltaikEinzelhandelPage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Photovoltaik für Einzelhandel | ZOE Solar",
    "description": "Entdecken Sie Photovoltaik-Lösungen für den Einzelhandel. Reduzieren Sie Energiekosten und stärken Sie Ihre Nachhaltigkeitsziele mit solarer Stromerzeugung.",
    "url": "https://zoe-solar.de/photovoltaik-einzelhandel",
    "publisher": {
      "@type": "Organization",
      "name": "ZOE Solar",
      "url": "https://zoe-solar.de"
    },
    "mainEntity": {
      "@type": "Service",
      "name": "Photovoltaik für Einzelhandel",
      "description": "Professionelle Photovoltaik-Installation für Einzelhandelsimmobilien mit maßgeschneiderten Lösungen für Dach- und Fassadenmontage.",
      "provider": {
        "@type": "Organization",
        "name": "ZOE Solar"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Photovoltaik für Einzelhandel | ZOE Solar</title>
        <meta name="description" content="Entdecken Sie Photovoltaik-Lösungen für den Einzelhandel. Reduzieren Sie Energiekosten und stärken Sie Ihre Nachhaltigkeitsziele mit solarer Stromerzeugung." />
        <meta name="keywords" content="Photovoltaik Einzelhandel, Solaranlagen Geschäfte, Dach-Photovoltaik Ladenlokale, Fassaden-PV Einzelhandel, Energieeffizienz Retail" />
        <link rel="canonical" href="https://zoe-solar.de/photovoltaik-einzelhandel" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <PageHero
          title="Photovoltaik für den Einzelhandel"
          subtitle="Nachhaltige Energie für Ihren Handel"
          description="Nutzen Sie die Potenziale Ihrer Einzelhandelsimmobilien für saubere Energiegewinnung. Unsere Photovoltaik-Lösungen helfen Ihnen, Energiekosten zu senken und Ihr Unternehmen als Vorreiter für Nachhaltigkeit zu positionieren."
          primaryButtonText="Kostenlose Beratung"
          primaryButtonLink="/kontakt"
          secondaryButtonText="Erfolgsgeschichten ansehen"
          secondaryButtonLink="/fallstudien"
        />

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Warum Photovoltaik für den Einzelhandel?
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Einzelhandelsimmobilien bieten ideale Bedingungen für Photovoltaik-Anlagen:
                    Hohe Dachflächen, lange Öffnungszeiten und steigender Energieverbrauch machen
                    solare Stromerzeugung besonders attraktiv.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Attraktive Dachflächen für optimale Sonneneinstrahlung</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Hoher Eigenverbrauch durch lange Betriebszeiten</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Stärkung der Kundenbindung durch Nachhaltigkeitsimage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Reduzierung der Energiekosten um bis zu 40%</span>
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
                    <span className="font-semibold text-green-600">5-7 Jahre</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Stromkosteneinsparung</span>
                    <span className="font-semibold text-green-600">bis zu 40%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">CO₂-Einsparung</span>
                    <span className="font-semibold text-green-600">200-800 t/Jahr</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Fördermöglichkeiten</span>
                    <span className="font-semibold text-green-600">bis zu 25%</span>
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
                  Klassische Dachinstallation mit optimaler Ausrichtung für maximale
                  Energieerträge bei minimaler Beeinträchtigung des Betriebs.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Flachdach- und Pultdachsysteme</li>
                  <li>• Ballastierung ohne Dachdurchdringung</li>
                  <li>• Integration in bestehende Gebäude</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-xl">🏢</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Fassadenmontage
                </h3>
                <p className="text-gray-600 mb-4">
                  Innovative Fassaden-PV-Systeme für eine moderne Optik und
                  zusätzliche Energiegewinnung an vertikalen Flächen.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• BIPV (Building Integrated PV)</li>
                  <li>• Ästhetische Fassadengestaltung</li>
                  <li>• Zusätzliche Energiequelle</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Parkplatzanlagen
                </h3>
                <p className="text-gray-600 mb-4">
                  Photovoltaik-Carports für Kundenparkplätze kombinieren
                  Solarenergiegewinnung mit Wetterschutz für Fahrzeuge.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Doppelte Flächennutzung</li>
                  <li>• Kundenkomfort steigern</li>
                  <li>• Zusätzliche Einnahmequelle</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">
                Werden Sie zum Vorreiter im nachhaltigen Handel
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Profitieren Sie von staatlichen Förderungen und positionieren Sie Ihr Unternehmen als nachhaltigen Marktführer.
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

export default PhotovoltaikEinzelhandelPage;
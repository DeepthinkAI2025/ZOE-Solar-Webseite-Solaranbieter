import React from 'react';
import { Page } from '../types';
import PageHero from '../components/PageHero';
import { pageHeroData } from '../data/pageContent';

const PhotovoltaikGewerbePage: React.FC = () => {
  const heroData = {
    title: 'Photovoltaik für Gewerbe, Landwirtschaft & Industrie',
    subtitle: 'Maximale Energieeffizienz für Unternehmen - Von Agri-PV bis Industrieanlagen',
    description: `Entdecken Sie die vielfältigen Möglichkeiten der Photovoltaik für gewerbliche Anwendungen. Von landwirtschaftlichen Flächen über Gewerbedächer bis hin zu industriellen Großanlagen - wir realisieren maßgeschneiderte Solarlösungen, die Ihre Betriebskosten senken und Ihre Energieautarkie maximieren.`,
    primaryCta: {
      text: 'Kostenlose Beratung',
      href: '/kontakt'
    },
    secondaryCta: {
      text: 'ROI-Rechner',
      href: '/photovoltaik-rechner-gewerbe'
    },
    bgImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Moderne Photovoltaik-Anlage auf einem Gewerbegebäude'
  };

  return (
    <div className="min-h-screen">
      <PageHero {...heroData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Einleitung: Marktübersicht und Chancen für Unternehmen */}
        <article itemscope itemtype="https://schema.org/Article">
          <header>
            <meta itemprop="headline" content="Photovoltaik für Gewerbe, Landwirtschaft & Industrie - ZOE Solar" />
            <meta itemprop="description" content="Entdecken Sie die vielfältigen Möglichkeiten der Photovoltaik für gewerbliche Anwendungen. Von landwirtschaftlichen Flächen über Gewerbedächer bis hin zu industriellen Großanlagen." />
            <meta itemprop="author" content="ZOE Solar" />
            <meta itemprop="publisher" content="ZOE Solar" />
            <time itemprop="datePublished" datetime="2025-01-15">2025-01-15</time>
            <time itemprop="dateModified" datetime="2025-09-29">2025-09-29</time>
          </header>

          <section className="mb-16" itemprop="articleBody">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Photovoltaik Gewerbe: Der Markt im Wandel
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Der Markt für gewerbliche Photovoltaik boomt. Immer mehr Unternehmen erkennen die Vorteile
                der eigenen Stromproduktion: Kostensenkung, Unabhängigkeit von Energiepreisen und Beitrag
                zur Nachhaltigkeit. Mit über 3,2 Millionen Gewerbegebäuden in Deutschland bietet sich
                ein riesiges Potenzial für Solaranlagen auf Gewerbedächern.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Reduzieren Sie Ihre Energiekosten um bis zu 70%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Nutzen Sie Förderungen bis zu 70% der Investitionskosten</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Erhöhen Sie Ihre Energieautarkie und Zukunftssicherheit</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Profitieren Sie von steuerlichen Vorteilen und Abschreibungen</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Marktpotenzial Deutschland
              </h3>

              <div className="space-y-4">
                <div>
                  <strong className="text-gray-900">Gewerbedächer:</strong>
                  <p className="text-gray-600">3,2 Mio. Gebäude mit 2.800 km² Dachfläche</p>
                </div>

                <div>
                  <strong className="text-gray-900">Agrarfläche:</strong>
                  <p className="text-gray-600">16,7 Mio. ha für Agri-PV-Anlagen</p>
                </div>

                <div>
                  <strong className="text-gray-900">Industrielle Anlagen:</strong>
                  <p className="text-gray-600">Großflächige PV für Produktionsbetriebe</p>
                </div>

                <div>
                  <strong className="text-gray-900">Fördervolumen 2025:</strong>
                  <p className="text-gray-600">Bis zu 70% Zuschuss für Agri-PV</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Anwendungsfälle: Gewerbe, Agri-PV, Industrie, Ladeinfrastruktur */}
        <section className="mb-16" itemprop="articleBody">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Anwendungsfälle für Photovoltaik Gewerbe
          </h2>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Anwendungsfälle für Photovoltaik Gewerbe",
                "description": "Verschiedene Anwendungsbereiche für gewerbliche Photovoltaik-Anlagen",
                "numberOfItems": 4,
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Gewerbedächer PV",
                    "description": "Optimale Nutzung vorhandener Dachflächen für maximale Energieproduktion"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Agri-PV Deutschland",
                    "description": "Photovoltaik auf landwirtschaftlichen Flächen für optimale Flächennutzung"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Industrielle PV",
                    "description": "Großflächige Solaranlagen für Industriebetriebe"
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "E-Mobilität Integration",
                    "description": "Kombination von PV-Anlagen mit Ladeinfrastruktur für Elektrofahrzeuge"
                  }
                ]
              })
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Gewerbedächer PV
              </h3>
              <p className="text-gray-600 mb-4">
                Optimale Nutzung vorhandener Dachflächen für maximale Energieproduktion.
                Ideal für Bürogebäude, Lagerhallen und Produktionsstätten.
              </p>
              <a href="/photovoltaik-gewerbedaecker" className="text-blue-600 hover:text-blue-800 font-medium">
                Mehr erfahren →
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Agri-PV Deutschland
              </h3>
              <p className="text-gray-600 mb-4">
                Photovoltaik auf landwirtschaftlichen Flächen. Kombinieren Sie Landwirtschaft
                mit Solarenergie für optimale Flächennutzung.
              </p>
              <a href="/agri-pv-bayern" className="text-green-600 hover:text-green-800 font-medium">
                Mehr erfahren →
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Industrielle PV
              </h3>
              <p className="text-gray-600 mb-4">
                Großflächige Solaranlagen für Industriebetriebe. Maximale Leistung
                für hohe Energieverbräuche und Produktionsanlagen.
              </p>
              <a href="/photovoltaik-industrie" className="text-orange-600 hover:text-orange-800 font-medium">
                Mehr erfahren →
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                E-Mobilität Integration
              </h3>
              <p className="text-gray-600 mb-4">
                Kombination von PV-Anlagen mit Ladeinfrastruktur für Elektrofahrzeuge.
                Vollständige Energielösung für moderne Unternehmen.
              </p>
              <a href="/elektromobilitaet-ladeinfrastruktur" className="text-purple-600 hover:text-purple-800 font-medium">
                Mehr erfahren →
              </a>
            </div>
          </div>
        </section>

        {/* Technologien: Verschiedene PV-Systeme und Speicherlösungen */}
        <section className="bg-gray-50 p-8 rounded-lg mb-16" itemprop="articleBody">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Technologien für Photovoltaik Gewerbe
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                PV-Systeme für verschiedene Anwendungen
              </h3>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Dachmontage-Systeme
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Optimierte Montagesysteme für Flach- und Schrägdächer. Maximale
                    Energieausbeute durch optimale Ausrichtung und Neigungswinkel.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Aufständerungen für Flachdächer</li>
                    <li>• Indach-Systeme für geneigte Dächer</li>
                    <li>• Ballastierung ohne Dachdurchdringung</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Freiflächen-Anlagen
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Großflächige PV-Anlagen für Agri-PV und Industrie. Optimierte
                    Tracker-Systeme für maximale Sonnenausbeute.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Einachsige Tracker-Systeme</li>
                    <li>• Festaufständerungen für Agri-PV</li>
                    <li>• Bifacial-Module für höhere Effizienz</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Energiespeicher-Systeme
              </h3>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Lithium-Ionen Speicher
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Moderne Batteriespeicher für optimale Energieversorgung.
                    Laden Sie tagsüber und nutzen Sie Strom abends und nachts.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Hohe Speicherkapazität bis 1 MWh</li>
                    <li>• Schnellladefunktion</li>
                    <li>• Langzeitgarantie (10+ Jahre)</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Netzdienliche Speicher
                  </h4>
                  <p className="text-gray-600 mb-3">
                    Intelligente Speichersysteme mit Netzdienstleistungen.
                    Profitieren Sie von Regelleistung und Primärregelleistung.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• FCR (Frequency Containment Reserve)</li>
                    <li>• aFRR (automatic Frequency Restoration Reserve)</li>
                    <li>• Zusätzliche Einnahmequelle</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a href="/batteriespeicher-gewerbe" className="text-green-600 hover:text-green-800 font-medium">
              Mehr über Energiespeicher für Gewerbe →
            </a>
          </div>
        </section>

        {/* Fördermöglichkeiten: Aktuelle Programme und Finanzierung */}
        <section className="mb-16" itemprop="articleBody">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Fördermöglichkeiten für Photovoltaik Gewerbe 2025
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-green-600 mb-3">
                Agri-PV Förderung
              </h3>
              <p className="text-gray-600 mb-4">
                Bis zu 70% Zuschuss für Photovoltaik-Anlagen auf landwirtschaftlichen Flächen.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mindestgröße: 500 kWp</li>
                <li>• Max. 70% Förderung</li>
                <li>• Laufzeit bis 2028</li>
              </ul>
              <a href="/foerdermittel-photovoltaik-gewerbe" className="text-green-600 hover:text-green-800 font-medium mt-3 inline-block">
                Details →
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-green-600 mb-3">
                KfW-Förderung Gewerbe
              </h3>
              <p className="text-gray-600 mb-4">
                Zinsgünstige Kredite für gewerbliche Solaranlagen und Speichersysteme.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• KfW 275: Energieeffizient Sanieren</li>
                <li>• KfW 276: Erneuerbare Energien</li>
                <li>• Tilgungszuschüsse möglich</li>
              </ul>
              <a href="/foerdermittel-photovoltaik-gewerbe" className="text-green-600 hover:text-green-800 font-medium mt-3 inline-block">
                Details →
              </a>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-green-600 mb-3">
                EEG-Vergütung
              </h3>
              <p className="text-gray-600 mb-4">
                Einspeisevergütung für Solarstrom nach Erneuerbare-Energien-Gesetz.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 8,2 Ct/kWh Grundvergütung</li>
                <li>• +2,5 Ct/kWh Agri-PV Bonus</li>
                <li>• 20 Jahre garantierte Vergütung</li>
              </ul>
              <a href="/foerdermittel-photovoltaik-gewerbe" className="text-green-600 hover:text-green-800 font-medium mt-3 inline-block">
                Details →
              </a>
            </div>
          </div>
        </section>

        {/* ROI-Analyse: Wirtschaftlichkeitsberechnungen */}
        <section className="bg-green-50 p-8 rounded-lg mb-16" itemprop="articleBody">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Wirtschaftlichkeitsanalyse Photovoltaik Gewerbe
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                ROI-Beispiel: Gewerbedach 500 kWp
              </h3>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investition:</span>
                    <span className="font-semibold">€ 450.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jährliche Einsparung:</span>
                    <span className="font-semibold text-green-600">€ 65.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Förderung (30%):</span>
                    <span className="font-semibold text-green-600">€ 135.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amortisation:</span>
                    <span className="font-semibold">8,5 Jahre</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IRR (Internal Rate of Return):</span>
                    <span className="font-semibold text-green-600">12,3%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Nutzen Sie unseren ROI-Rechner
              </h3>

              <p className="text-gray-600 mb-6">
                Berechnen Sie die Wirtschaftlichkeit Ihrer individuellen Photovoltaik-Anlage.
                Berücksichtigen Sie alle Förderungen, Strompreise und Standortfaktoren.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Individuelle Dachanalyse</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Aktuelle Förderungen berücksichtigt</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>20-Jahres Prognose</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span>Kostenlose Erstberatung</span>
                </div>
              </div>

              <a href="/photovoltaik-rechner-gewerbe" className="inline-block mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                ROI-Rechner starten
              </a>
            </div>
          </div>
        </section>

        {/* Case Studies: Erfolgreiche Projekte */}
        <section className="mb-16" itemprop="articleBody">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Erfolgreiche Projekte Photovoltaik Gewerbe
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Produktionsbetrieb Nordrhein-Westfalen
              </h3>
              <p className="text-gray-600 mb-4">
                "Die 750 kWp PV-Anlage auf unserem Dach deckt 85% unseres Strombedarfs.
                Durch die Kombination mit einem 500 kWh Speicher sind wir nahezu autark.
                Die Investition hat sich bereits nach 7 Jahren amortisiert."
              </p>
              <div className="text-sm text-green-600 font-medium">
                35% Förderung • 14% IRR • 7 Jahre Amortisation
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Agri-PV Hof Bayern
              </h3>
              <p className="text-gray-600 mb-4">
                "Über unseren 45 ha Ackerflächen haben wir eine 2,1 MWp Agri-PV-Anlage installiert.
                Die Module schützen die Kulturen vor Trockenheit und wir produzieren jährlich
                2,3 Mio. kWh Strom für den Eigenverbrauch und Verkauf."
              </p>
              <div className="text-sm text-green-600 font-medium">
                68% Förderung • 16% IRR • 12 Jahre Amortisation
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Logistikzentrum Hessen
              </h3>
              <p className="text-gray-600 mb-4">
                "Die 1,2 MWp Dachanlage mit integrierter Ladeinfrastruktur für unsere E-Fahrzeugflotte
                hat unsere Energiekosten um 60% gesenkt. Zusätzlich bieten wir Ladesäulen für Kunden an."
              </p>
              <div className="text-sm text-green-600 font-medium">
                25% Förderung • 13% IRR • 9 Jahre Amortisation
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Industriebetrieb Sachsen
              </h3>
              <p className="text-gray-600 mb-4">
                "Unsere 3 MWp Freiflächenanlage neben dem Produktionsgelände liefert sauberen Strom
                für unsere energieintensive Fertigung. Der Speicher gleicht Lastspitzen aus."
              </p>
              <div className="text-sm text-green-600 font-medium">
                40% Förderung • 15% IRR • 8 Jahre Amortisation
              </div>
            </div>
          </div>
        </section>

        {/* CTA: Individuelle Beratung anfordern */}
        <section className="bg-green-600 text-white p-8 rounded-lg text-center" itemprop="articleBody">
          <h2 className="text-3xl font-bold mb-4">
            Bereit für Ihre Photovoltaik-Lösung?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Lassen Sie uns gemeinsam Ihre Möglichkeiten für Photovoltaik Gewerbe analysieren.
            Von der ersten Beratung bis zur schlüsselfertigen Übergabe begleiten wir Sie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/kontakt"
              className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Individuelle Beratung
            </a>
            <a
              href="/photovoltaik-planung-gewerbe"
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Planung & Installation
            </a>
          </div>
          <p className="mt-6 text-sm opacity-75">
            Erfahren Sie mehr über unsere <a href="/agri-pv-bayern" className="underline hover:no-underline">Agri-PV-Lösungen</a> oder
            <a href="/photovoltaik-gewerbedaecker" className="underline hover:no-underline ml-1">Gewerbedach-Installationen</a>.
          </p>
        </section>
      </article>
    </main>
  );
};

export { PhotovoltaikGewerbePage as default };
import React from 'react';
import { Page } from '../types';
import PageHero from '../components/PageHero';
import { pageHeroData } from '../data/pageContent';

const AgriPVNordrheinWestfalenPage: React.FC = () => {
  const heroData = {
    title: 'Agri-PV Nordrhein-Westfalen',
    subtitle: 'Industrie trifft Landwirtschaft: Agri-PV im Herzen Europas',
    description: `Nordrhein-Westfalen ist das bevölkerungsreichste Bundesland und verbindet urbane Industrie mit traditionsreicher Landwirtschaft. Nutzen Sie die neuen Agri-PV-Förderungen 2025 und erschließen Sie das Potenzial Ihrer Flächen im Rheinland, Münsterland oder in der Eifel. Agri-PV für moderne Landwirte in NRW.`,
    primaryCta: {
      text: 'Jetzt Fläche analysieren',
      href: '/foerdermittel/check'
    },
    secondaryCta: {
      text: 'Persönliche Beratung',
      href: '/kontakt'
    },
    bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Agri-PV Anlage über rheinischen Weinfeldern'
  };

  return (
    <div className="min-h-screen">
      <PageHero {...heroData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Lokale Agri-PV Informationen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Agri-PV für Nordrhein-Westfälische Landwirte
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Nordrhein-Westfalen verbindet urbane Industrie mit traditionsreicher Landwirtschaft.
              Als erfahrener Partner realisieren wir Agri-PV-Anlagen, die perfekt auf Ihre NRW-spezifischen
              Gegebenheiten abgestimmt sind - ob Ackerbau im Münsterland, Weinanbau an der Ahr
              oder Sonderkulturen im Rheinland.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Kostenlose Flächenbewertung vor Ort</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Maximale Förderungen sichern (bis 70% Zuschuss)</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Ernteverträgliche Konstruktion für alle Kulturen</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Direktvermarktung über lokale Netzbetreiber</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              NRW Agri-PV Vorteile
            </h3>

            <div className="space-y-4">
              <div>
                <strong className="text-gray-900">Agrarfläche:</strong>
                <p className="text-gray-600">1,8 Mio. ha (hohe Flächeneffizienz)</p>
              </div>

              <div>
                <strong className="text-gray-900">Förderhöhe:</strong>
                <p className="text-gray-600">Bis zu 70% der Investitionskosten</p>
              </div>

              <div>
                <strong className="text-gray-900">Regionen:</strong>
                <p className="text-gray-600">Rheinland, Münsterland, Eifel, Sauerland</p>
              </div>

              <div>
                <strong className="text-gray-900">Kulturen:</strong>
                <p className="text-gray-600">Weizen, Zuckerrüben, Mais, Wein, Spargel, Beeren</p>
              </div>
            </div>
          </div>
        </div>

        {/* Förderungen Sektion */}
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Agri-PV Förderungen Nordrhein-Westfalen 2025
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-green-600 mb-3">
                Bundesförderung Agri-PV
              </h3>
              <p className="text-gray-600 mb-4">
                Bis zu 70% Zuschuss für Agri-PV-Anlagen auf landwirtschaftlichen Flächen.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mindestgröße: 500 kWp</li>
                <li>• Max. 70% Förderung</li>
                <li>• Laufzeit bis 2028</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-green-600 mb-3">
                NRW Agrarförderung
              </h3>
              <p className="text-gray-600 mb-4">
                Landesförderung für nachhaltige Landwirtschaft und Energiegewinnung.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Investitionsförderung</li>
                <li>• Beratungskostenzuschuss</li>
                <li>• Kombinierbar mit Bundesmitteln</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-green-600 mb-3">
                EEG-Boni für besondere Anlagen
              </h3>
              <p className="text-gray-600 mb-4">
                Zusätzliche Vergütung für innovative Agri-PV-Konzepte.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• +2,5 Ct/kWh für Agri-PV</li>
                <li>• +1,0 Ct/kWh für Biodiversität</li>
                <li>• 20 Jahre garantierte Vergütung</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Erfolgsgeschichten */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Erfolgsgeschichten aus Nordrhein-Westfalen
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Weinanbau Ahr
              </h3>
              <p className="text-gray-600 mb-4">
                "Die Agri-PV-Anlage über unseren Weinbergen hat die Traubenqualität verbessert und vor Hagel
                geschützt. Zusätzlich produzieren wir jährlich 5 Mio. kWh Strom für die Region."
              </p>
              <div className="text-sm text-green-600 font-medium">
                70% Förderung • 18% IRR • 17 Jahre Amortisation
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Ackerbaubetrieb Münsterland
              </h3>
              <p className="text-gray-600 mb-4">
                "Über unseren 95 ha Weizen- und Zuckerrübenfeldern haben wir Agri-PV installiert.
                Die Module reduzieren die Verdunstung und wir haben ein zweites Einkommen durch Strom."
              </p>
              <div className="text-sm text-green-600 font-medium">
                69% Förderung • 16% IRR • 19 Jahre Amortisation
              </div>
            </div>
          </div>
        </div>

        {/* CTA Sektion */}
        <div className="bg-green-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bereit für Ihre Agri-PV Zukunft in NRW?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Lassen Sie uns gemeinsam Ihre Flächen im Rheinland, Münsterland oder in der Eifel bewerten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/foerdermittel/check"
              className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Förderung prüfen
            </a>
            <a
              href="/kontakt"
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriPVNordrheinWestfalenPage;
import React from 'react';
import { Page } from '../types';
import PageHero from '../components/PageHero';
import { pageHeroData } from '../data/pageContent';
import PainPoints from '../components/PainPoints';
import Solutions from '../components/Solutions';
import Process from '../components/Process';
import ProjectGallery from '../components/ProjectGallery';
import PricingSection from '../components/PricingSection';
import GuaranteeSection from '../components/GuaranteeSection';
import FAQ from '../components/FAQ';

const AgriPVBayernPage: React.FC = () => {
  const heroData = {
    title: 'Agri-PV Bayern',
    subtitle: 'Tradition trifft Innovation: Bayerische Landwirtschaft geht solar',
    description: `Bayern ist nicht nur das größte Bundesland, sondern auch eine der traditionsreichsten Agrarregionen Deutschlands. Nutzen Sie die neuen Agri-PV-Förderungen 2025 und kombinieren Sie Ihre traditionelle Landwirtschaft mit moderner Solartechnik. Vom Allgäu über die Oberpfalz bis zur Hallertau - Agri-PV für alle bayerischen Regionen.`,
    primaryCta: {
      text: 'Kostenlose Beratung',
      href: '/foerdermittel/check'
    },
    secondaryCta: {
      text: 'Fördercheck starten',
      href: '/kontakt'
    },
    bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Agri-PV Anlage über bayerischen Hopfenfeldern'
  };

  const setPage = (page: Page) => {
    window.location.href = `/${page}`;
  };

  return (
    <div className="min-h-screen">
      <PageHero {...heroData} />

      <PainPoints />
      <Solutions />
      <Process customerType="business" setPage={setPage} />
      <ProjectGallery customerType="business" setPage={setPage} />
      <PricingSection setPage={setPage} customerType="business" />
      <GuaranteeSection setPage={setPage} />
      <FAQ customerType="business" setPage={setPage} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Lokale Agri-PV Informationen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Agri-PV für Bayerische Landwirte
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Bayern ist das größte Bundesland und eine der traditionsreichsten Agrarregionen Deutschlands.
              Als erfahrener Partner realisieren wir Agri-PV-Anlagen, die perfekt auf Ihre bayerischen
              Gegebenheiten abgestimmt sind - ob Hopfenanbau in der Hallertau, Milchwirtschaft im Allgäu
              oder Ackerbau in der Oberpfalz.
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
              Bayern Agri-PV Vorteile
            </h3>

            <div className="space-y-4">
              <div>
                <strong className="text-gray-900">Agrarfläche:</strong>
                <p className="text-gray-600">3,2 Mio. ha (größte Fläche Deutschlands)</p>
              </div>

              <div>
                <strong className="text-gray-900">Förderhöhe:</strong>
                <p className="text-gray-600">Bis zu 70% der Investitionskosten</p>
              </div>

              <div>
                <strong className="text-gray-900">Regionen:</strong>
                <p className="text-gray-600">Allgäu, Oberpfalz, Hallertau, Niederbayern</p>
              </div>

              <div>
                <strong className="text-gray-900">Kulturen:</strong>
                <p className="text-gray-600">Hopfen, Weizen, Gerste, Mais, Spargel, Erdbeeren</p>
              </div>
            </div>
          </div>
        </div>

        {/* Förderungen Sektion */}
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Agri-PV Förderungen Bayern 2025
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
                Bayerische Agrarförderung
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
            Erfolgsgeschichten aus Bayern
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Hopfenanbau Hallertau
              </h3>
              <p className="text-gray-600 mb-4">
                "Die Agri-PV-Anlage über unseren Hopfenfeldern hat sich bereits nach 12 Jahren amortisiert.
                Die Hopfenqualität ist besser geworden und wir produzieren jährlich 8 Mio. kWh Strom."
              </p>
              <div className="text-sm text-green-600 font-medium">
                68% Förderung • 16% IRR • 19 Jahre Amortisation
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Milchviehbetrieb Allgäu
              </h3>
              <p className="text-gray-600 mb-4">
                "Über unseren 120 ha Weideflächen haben wir Agri-PV installiert. Die Module schützen das Gras
                vor Trockenheit und wir haben ein zweites stabiles Einkommen durch Stromverkauf."
              </p>
              <div className="text-sm text-green-600 font-medium">
                72% Förderung • 17% IRR • 18 Jahre Amortisation
              </div>
            </div>
          </div>
        </div>

        {/* CTA Sektion */}
        <div className="bg-green-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bereit für Ihre Agri-PV Zukunft in Bayern?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Lassen Sie uns gemeinsam Ihre Flächen im Allgäu, in der Hallertau oder Oberpfalz bewerten.
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
          <p className="mt-6 text-sm opacity-75">
            Erfahren Sie mehr über unsere <a href="/photovoltaik-gewerbe" className="underline hover:no-underline">Photovoltaik-Lösungen für Gewerbe</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgriPVBayernPage;
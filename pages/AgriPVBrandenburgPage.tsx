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

const AgriPVBrandenburgPage: React.FC = () => {
  const heroData = {
    title: 'Agri-PV in Brandenburg',
    subtitle: 'Die Zukunft der Landwirtschaft: Strom ernten und Felder schützen',
    description: `Nutzen Sie die neuen Agri-PV-Förderungen 2025 in Brandenburg. Schützen Sie Ihre Kulturen vor Wetterextremen, sparen Sie Wasser und generieren Sie zusätzliche Einnahmen durch Stromproduktion. Als erfahrener Partner begleiten wir Sie von der Flächenbewertung bis zur Inbetriebnahme.`,
    primaryCta: {
      text: 'Förderung beantragen',
      href: '/foerdermittel/check'
    },
    secondaryCta: {
      text: 'Fläche bewerten',
      href: '/kontakt'
    },
    bgImage: 'https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Agri-PV Anlage über Weizenfeld in Brandenburg'
  };

  return (
    <div className="min-h-screen">
      <PageHero {...heroData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Lokale Agri-PV Informationen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Agri-PV für Brandenburger Landwirte
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Brandenburg bietet ideale Bedingungen für Agri-PV: Große landwirtschaftliche Flächen,
              hohe Sonneneinstrahlung und die neue Bundesförderung machen Investitionen besonders attraktiv.
              Als regionaler Experte kennen wir die lokalen Gegebenheiten und Anforderungen.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Kostenlose Flächenanalyse vor Ort</span>
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
                <span>Direktvermarktung des Stroms</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Brandenburg Agri-PV Vorteile
            </h3>

            <div className="space-y-4">
              <div>
                <strong className="text-gray-900">Sonneneinstrahlung:</strong>
                <p className="text-gray-600">1.100-1.200 kWh/m² pro Jahr</p>
              </div>

              <div>
                <strong className="text-gray-900">Förderhöhe:</strong>
                <p className="text-gray-600">Bis zu 70% der Investitionskosten</p>
              </div>

              <div>
                <strong className="text-gray-900">Regionen:</strong>
                <p className="text-gray-600">Prignitz, Havelland, Oderbruch, Lausitz</p>
              </div>

              <div>
                <strong className="text-gray-900">Kulturen:</strong>
                <p className="text-gray-600">Weizen, Raps, Mais, Kartoffeln, Beeren</p>
              </div>
            </div>
          </div>
        </div>

        {/* Förderungen Sektion */}
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Aktuelle Agri-PV Förderungen Brandenburg 2025
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
                Brandenburg Agrarförderung
              </h3>
              <p className="text-gray-600 mb-4">
                Zusätzliche Landesmittel für nachhaltige Landwirtschaft und Energieerzeugung.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Investitionszuschuss</li>
                <li>• Beratungsförderung</li>
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
            Erfolgsgeschichten aus Brandenburg
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Milchviehbetrieb Prignitz
              </h3>
              <p className="text-gray-600 mb-4">
                "Durch Agri-PV konnten wir unsere 50 ha Weidefläche doppelt nutzen. Die Module schützen
                das Gras vor Austrocknung und wir erzeugen jährlich 800.000 kWh Strom."
              </p>
              <div className="text-sm text-green-600 font-medium">
                65% Förderung • 12% IRR • 25 Jahre Amortisation
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Ackerbaubetrieb Havelland
              </h3>
              <p className="text-gray-600 mb-4">
                "Die Agri-PV-Anlage über unseren Rapsfeldern hat sich bereits nach 8 Jahren amortisiert.
                Zusätzlich sparen wir 30% Bewässerungswasser."
              </p>
              <div className="text-sm text-green-600 font-medium">
                70% Förderung • 15% IRR • 20 Jahre Amortisation
              </div>
            </div>
          </div>
        </div>

        <PainPoints />
        <Solutions />
        <Process customerType="business" />
        <ProjectGallery customerType="business" />
        <PricingSection customerType="business" />
        <GuaranteeSection />
        <FAQ customerType="business" />

        {/* CTA Sektion */}
        <div className="bg-green-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bereit für Ihre Agri-PV Zukunft?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Lassen Sie uns gemeinsam Ihre Flächen bewerten und die optimale Agri-PV-Lösung entwickeln.
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

export default AgriPVBrandenburgPage;
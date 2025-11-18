import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Page } from '../types';
import { SemanticMain, SemanticSection } from '../components/SemanticLayout';
import FAQ from '../components/FAQ';
import { completeFAQSchema } from '../data/faqSchemaData';

interface FAQPageProps {
  setPage: (page: Page) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ setPage }) => {
  const [customerType, setCustomerType] = useState<'private' | 'business'>('private');

  return (
    <SemanticMain className="w-full">
      <Helmet>
        {/* Enhanced Title for AI Overview Optimization */}
        <title>FAQ: 85+ Antworten zu Solaranlagen • Winter-Aktion bis 5.000€ • 2026 Trends | ZOE Solar Experten</title>

        {/* AI-Optimized Description */}
        <meta name="description" content="🔥 Die ultimative FAQ zu Solaranlagen 2025/26: Winter-Aktion bis 5.000€, BEG-Förderung, Agri-PV, 2026-Technologien. 85+ aktuelle Experten-Antworten für Gewerbe & Privat. Jetzt informieren!" />

        {/* Clean, Focused Keywords */}
        <meta name="keywords" content="Solaranlage Kosten, BEG Förderung 2025, Photovoltaik Förderung, Batteriespeicher, Agri-PV, Einspeisevergütung, Solaranlage Installation, Solaranlage Wartung" />

        {/* OpenGraph for Social Media AI */}
        <meta property="og:title" content="FAQ: 85+ Aktuelle Experten-Antworten zu Solaranlagen • Winter-Aktion bis 5.000€ • 2026 Trends" />
        <meta property="og:description" content="🔥 Die umfassendste Solar-FAQ 2025/26: Winter-Aktion bis 5.000€, BEG-Förderung, Agri-PV, 2026-Technologien. 85+ aktuelle Experten-Antworten." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="de_DE" />
        <meta property="og:site_name" content="ZOE Solar - Photovoltaik Experten" />

        {/* Twitter Card Optimization */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ: 85+ Solar-Experten-Antworten • Winter-Aktion bis 5.000€ • 2026 Trends" />
        <meta name="twitter:description" content="🔥 Die ultimative Solar-FAQ 2025/26: 85+ aktuelle Experten-Antworten. Winter-Aktion, BEG-Förderung, Installation, Speicherung, E-Mobilität, Agri-PV, 2026-Trends." />
        <meta name="twitter:creator" content="@ZOE_Solar_DE" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://zoe-solar.de/wissen/faq" />

        {/* Alternative Language for AI */}
        <link rel="alternate" hreflang="de" href="https://zoe-solar.de/wissen/faq" />
        <link rel="alternate" hreflang="en" href="https://zoe-solar.de/en/faq" />

        {/* Clean SEO Meta Tags */}
        <meta name="author" content="ZOE Solar - Photovoltaik Experten" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* Content Information */}
        <meta name="topic" content="Solaranlagen, Photovoltaik, Erneuerbare Energien" />
        <meta name="content-type" content="FAQ" />
        <meta name="target-audience" content="Privatkunden, Gewerbekunden, Landwirte" />
        <meta name="last-updated" content="2025-11-01" />

        {/* Geographic and Business Info */}
        <meta name="geo.region" content="DE" />
        <meta name="geo.placename" content="Deutschland" />
        <meta name="icbm" content="51.1657;10.4515" />
        <meta name="business:contact_data:street_address" content="Musterstraße 123" />
        <meta name="business:contact_data:locality" content="Musterstadt" />
        <meta name="business:contact_data:postal_code" content="12345" />
        <meta name="business:contact_data:country_name" content="Deutschland" />
        <meta name="business:contact_data:email" content="info@zoe-solar.de" />
        <meta name="business:contact_data:phone_number" content="+49 123 4567890" />

        {/* Clean FAQ Schema Only */}
        <script type="application/ld+json">
          {JSON.stringify(completeFAQSchema)}
        </script>
      </Helmet>

      {/* Enhanced Header Section for AI Overview */}
      <SemanticSection aria-label="FAQ Übersicht" className="bg-gradient-to-br from-slate-50 to-green-50 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              FAQ: 85+ Aktuelle Experten-Antworten zu <span className="text-green-600">Solaranlagen 2025/26</span>
            </h1>
            <p className="text-xl text-slate-600 mb-6 max-w-3xl mx-auto">
              🔥 Die umfassendste Solar-FAQ 2025/26: Winter-Aktion bis 5.000€, BEG-Förderung, Agri-PV, 2026-Trends, Installation, Speicherung,
              E-Mobilität, Freiflächenanlagen. Alle Fragen expertengeprüft und zukunftssicher für November 2025.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                ✅ 85+ Aktuelle Experten-Antworten
              </span>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                🎁 Winter-Aktion bis 5.000€
              </span>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                📈 BEG-Förderung 2025
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                🚀 2026-Technologien
              </span>
              <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                🌾 Agri-PV & Innovation
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
              <p className="text-slate-700 font-medium mb-2">
                🤖 <strong>KI-Optimiert:</strong> Diese FAQ ist speziell für
                <span className="text-green-600 font-semibold"> Google AI Overview</span> und
                andere KI-Systeme optimiert für maximale Sichtbarkeit.
              </p>
            </div>
          </div>
        </div>
      </SemanticSection>

      {/* Customer Type Selection */}
      <SemanticSection aria-label="Kundentyp Auswahl" className="py-8 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welche Fragen interessieren Sie?</h2>
            <p className="text-slate-600">Wählen Sie Ihren Kundentyp für relevante Antworten</p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCustomerType('private')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                customerType === 'private'
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🏠 Privatkunden
            </button>
            <button
              onClick={() => setCustomerType('business')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                customerType === 'business'
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🏢 Gewerbe & Landwirtschaft
            </button>
          </div>
        </div>
      </SemanticSection>

      {/* Main FAQ Content */}
      <SemanticSection aria-label="Häufige Fragen" className="py-12">
        <FAQ customerType={customerType} setPage={setPage} />
      </SemanticSection>

      {/* Additional SEO Content */}
      <SemanticSection aria-label="Zusätzliche Informationen" className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              📚 Wissensdatenbank für Solaranlagen
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">💡</span>
                  Grundlagenwissen
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Funktionsweise von Photovoltaik-Anlagen</li>
                  <li>• Unterschiede zwischen Mono- und Polykristallin</li>
                  <li>• Bedeutung von Modulwirkungsgrad</li>
                  <li>• Wechselrichter-Technologien</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">💰</span>
                  Wirtschaftlichkeit
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Amortisationszeiten berechnen</li>
                  <li>• Fördermittel optimal nutzen</li>
                  <li>• Rendite-Prognosen</li>
                  <li>• Vergleich Strompreis vs. Solarstrom</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🔧</span>
                  Technische Details
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Montagesysteme für verschiedene Dachtypen</li>
                  <li>• Überwachung und Monitoring</li>
                  <li>• Wartung und Reinigung</li>
                  <li>• Störungsbeseitigung</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🌱</span>
                  Nachhaltigkeit
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• CO2-Einsparung berechnen</li>
                  <li>• Ökologische Bilanz</li>
                  <li>• Recycling von Solaranlagen</li>
                  <li>• Beitrag zur Energiewende</li>
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">
                🚀 Haben Sie weitere Fragen?
              </h3>
              <p className="text-xl mb-6 text-green-100">
                Unsere Experten stehen Ihnen für eine persönliche Beratung zur Verfügung.
              </p>
              <button
                onClick={() => setPage('kontakt')}
                className="bg-white text-green-600 font-bold py-4 px-8 rounded-lg hover:bg-slate-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                💬 Jetzt Experten-Beratung anfordern
              </button>
            </div>
          </div>
        </div>
      </SemanticSection>
    </SemanticMain>
  );
};

export default FAQPage;
import React from 'react';
import { Page } from '../types';

interface HighIntentCTAProps {
  setPage: (page: Page, options?: { anchor?: string }) => void;
  customerType: 'private' | 'business';
}

const bulletPoints = {
  private: [
    {
      icon: '🏠',
      title: 'Kostenlose Dachanalyse',
      description: 'Professionelle Bewertung Ihres Daches und Solarpotenzials'
    },
    {
      icon: '💰',
      title: '0€ Eigenkapital',
      description: 'Finanzierung ohne eigene Investition möglich'
    },
    {
      icon: '⚡',
      title: 'Maximale Förderungen',
      description: 'Alle verfügbaren Zuschüsse und Einspeisevergütungen sichern'
    },
  ],
  business: [
    {
      icon: '📊',
      title: 'Cashflow-Plan',
      description: 'Detaillierte Wirtschaftlichkeitsberechnung mit ROI-Prognose'
    },
    {
      icon: '🔍',
      title: '48h Netzprüfung',
      description: 'Die 48-Stunden-Netzprüfung ist kostenfrei nur bei erfolgreichem Vertragsabschluss. Bei Nichtbeauftragung wird diese separat in Rechnung gestellt.'
    },
    {
      icon: '🎯',
      title: 'Fördermittel-Optimierung',
      description: 'Maximale staatliche Unterstützung für Ihr Projekt'
    },
  ],
};

const HighIntentCTA: React.FC<HighIntentCTAProps> = ({ setPage, customerType }) => {
  const handleChat = () => {
    document.dispatchEvent(new CustomEvent('open-chat'));
  };

  const currentBulletPoints = bulletPoints[customerType];

  return (
    <section className="relative py-24 bg-white text-gray-900 overflow-hidden" aria-labelledby="cta-heading">
      {/* Background Effects - Subtle like other sections */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-32 h-96 w-96 rounded-full bg-green-500/5 blur-[160px]" />
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-blue-500/5 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-gray-200/30 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Premium Badge */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">
              {customerType === 'private' ? 'Premium-Service für Privatkunden' : 'Exklusiv für Unternehmen'}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">KOSTENLOS</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-16">
          <h2 id="cta-heading" className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 leading-tight mb-8">
            {customerType === 'private'
              ? 'Ihr Dach wird zur Goldmine'
              : 'Ihr Standort wird profitabel'
            }
          </h2>

          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
              {customerType === 'private'
                ? 'Entdecken Sie, wie Ihr Dach jährlich tausende Euro spart und gleichzeitig die Umwelt schützt.'
                : 'Transformieren Sie ungenutzte Flächen in profitable Energiequellen mit maximaler staatlicher Förderung.'
              }
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">100% Kostenlos</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Verbindlich & Transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Experten seit 2018</span>
            </div>
          </div>
        </div>

        {/* Enhanced Bullet Points */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {currentBulletPoints.map((point, index) => (
            <div
              key={point.title}
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors duration-300">
                    <div className="text-2xl">{point.icon}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-800 transition-colors duration-300">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => setPage('kontakt')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
              </svg>
              {customerType === 'private' ? 'Jetzt kostenlose Analyse sichern' : 'Jetzt Strategiegespräch buchen'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>

          <button
            onClick={handleChat}
            className="bg-white border-2 border-green-600 hover:bg-green-50 text-green-700 hover:text-green-800 font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              KI-Berater starten
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </button>
        </div>

        {/* Bottom Trust Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full px-6 py-3 shadow-lg">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">✓</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
            </div>
            <span className="text-sm font-semibold text-gray-700">Über 500 zufriedene Kunden vertrauen uns</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighIntentCTA;

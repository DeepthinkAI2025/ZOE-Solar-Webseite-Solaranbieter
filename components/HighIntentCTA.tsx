import React from 'react';
import { Page } from '../types';

interface HighIntentCTAProps {
  setPage: (page: Page, options?: { anchor?: string }) => void;
}

const bulletPoints = [
  'Verbindliche Prognose inklusive Cashflow-Plan',
  'Kostenfreie Flächen- & Netzprüfung innerhalb von 48h',
  'Individuelles Finanzierungskonzept mit Fördermitteln',
];

const HighIntentCTA: React.FC<HighIntentCTAProps> = ({ setPage }) => {
  const handleChat = () => {
    document.dispatchEvent(new CustomEvent('open-chat'));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500" aria-labelledby="cta-heading">
      <div className="max-w-5xl mx-auto px-6 text-white text-center">
        <p className="uppercase text-sm font-semibold tracking-[0.3em] text-white/70">Nächster Schritt</p>
        <h2 id="cta-heading" className="text-4xl md:text-5xl font-extrabold mt-4 leading-tight">
          Lassen Sie uns Ihren Hof oder Standort in ein profitables Solarkraftwerk verwandeln.
        </h2>
        <p className="text-lg md:text-xl text-white/90 mt-6">
          Buchen Sie Ihr Strategiegespräch mit unseren Projektingenieuren und erhalten Sie eine klar kalkulierte Entscheidungsvorlage.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-4 text-left">
          {bulletPoints.map((text) => (
            <div key={text} className="bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="text-sm font-semibold">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setPage('kontakt')}
            className="bg-white text-green-600 font-bold py-4 px-10 rounded-lg text-lg shadow-xl hover:bg-slate-100 transition-all duration-300"
          >
            Strategiegespräch sichern
          </button>
          <button
            onClick={handleChat}
            className="bg-green-700/40 border border-white/40 text-white font-semibold py-4 px-10 rounded-lg text-lg hover:bg-green-700/60 transition-all duration-300"
          >
            Direkt mit KI-Berater starten
          </button>
        </div>
      </div>
    </section>
  );
};

export default HighIntentCTA;

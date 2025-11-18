import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Page } from '../types';
import AnimatedSection from '../components/AnimatedSection';
import { pageToPath } from '../data/pageRoutes';
import { fetchLiveProducts } from '../services/productService';

interface PhotovoltaikRechnerGewerbePageProps {
  setPage: (page: Page, options?: { anchor?: string }) => void;
}

interface CalculatorInputs {
  roofArea: number;
  electricityCost: number;
  investmentCost: number;
  subsidies: number;
  amortizationPeriod: number;
}

interface CalculatorResults {
  annualGeneration: number;
  annualSavings: number;
  roi: number;
  paybackPeriod: number;
  netInvestment: number;
}

const PhotovoltaikRechnerGewerbePage: React.FC<PhotovoltaikRechnerGewerbePageProps> = ({ setPage }) => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    roofArea: 1000,
    electricityCost: 0.35,
    investmentCost: 150000,
    subsidies: 30000,
    amortizationPeriod: 20
  });

  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [optimizedContent, setOptimizedContent] = useState<string>('');

  // Constants for calculations
  const POWER_PER_SQM = 0.15; // kWp per m²
  const ANNUAL_IRRADIATION = 1000; // kWh/kWp per year
  const EFFICIENCY_FACTOR = 0.85; // System efficiency

  const calculateResults = (calcInputs: CalculatorInputs): CalculatorResults => {
    const powerOutput = calcInputs.roofArea * POWER_PER_SQM; // kWp
    const annualGeneration = powerOutput * ANNUAL_IRRADIATION * EFFICIENCY_FACTOR; // kWh
    const annualSavings = annualGeneration * calcInputs.electricityCost; // €
    const netInvestment = calcInputs.investmentCost - calcInputs.subsidies; // €
    const roi = (annualSavings / netInvestment) * 100; // %
    const paybackPeriod = netInvestment / annualSavings; // years

    return {
      annualGeneration,
      annualSavings,
      roi,
      paybackPeriod,
      netInvestment
    };
  };

  useEffect(() => {
    const newResults = calculateResults(inputs);
    setResults(newResults);
  }, [inputs]);

  useEffect(() => {
    // Optimize content for AI
    const optimizeContent = async () => {
      const content = `
        Wirtschaftlichkeitsrechner für gewerbliche Photovoltaik-Anlagen.
        Berechnen Sie ROI, Amortisationszeit und Einsparungen für Ihr Unternehmen.
        Dachfläche: ${inputs.roofArea} m², Stromkosten: ${inputs.electricityCost} €/kWh,
        Investition: ${inputs.investmentCost} €, Förderungen: ${inputs.subsidies} €.
      `;

      try {
        // Content-Optimierung entfernt, da Service nicht verfügbar
        const optimized = content;
        setOptimizedContent(optimized);
      } catch (error) {
        console.error('Content optimization failed:', error);
      }
    };

    optimizeContent();
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openChat = () => {
    document.dispatchEvent(new CustomEvent('open-chat'));
  };

  const pageTitle = "Photovoltaik Wirtschaftlichkeitsrechner Gewerbe | ROI-Rechner für Unternehmen";
  const pageDescription = "Kostenloser Wirtschaftlichkeitsrechner für gewerbliche Photovoltaik-Anlagen. Berechnen Sie ROI, Amortisationszeit und Einsparungen für Ihr Unternehmen. Jetzt kalkulieren!";
  const pageKeywords = "Photovoltaik Rechner Gewerbe, Wirtschaftlichkeitsrechner Solar, ROI Rechner Unternehmen, Photovoltaik Amortisation, Solar Investition Gewerbe";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Photovoltaik Wirtschaftlichkeitsrechner Gewerbe",
    "description": "Interaktiver Rechner zur Berechnung der Wirtschaftlichkeit von gewerblichen Photovoltaik-Anlagen",
    "url": "https://www.zoe-solar.de/photovoltaik-rechner-gewerbe",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "provider": {
      "@type": "Organization",
      "name": "ZOE Solar GmbH"
    }
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href="https://www.zoe-solar.de/photovoltaik-rechner-gewerbe" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <div className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Photovoltaik Wirtschaftlichkeitsrechner für Gewerbe
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Berechnen Sie die Wirtschaftlichkeit Ihrer gewerblichen Photovoltaik-Anlage.
                Ermitteln Sie ROI, Amortisationszeit und potenzielle Einsparungen für Ihr Unternehmen.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Input Form */}
              <div className="bg-slate-50 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Eingabeparameter</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Dachfläche (m²)
                    </label>
                    <input
                      type="number"
                      value={inputs.roofArea}
                      onChange={(e) => handleInputChange('roofArea', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="100"
                      max="10000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stromkosten (€/kWh)
                    </label>
                    <input
                      type="number"
                      value={inputs.electricityCost}
                      onChange={(e) => handleInputChange('electricityCost', Number(e.target.value))}
                      step="0.01"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0.1"
                      max="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Investitionskosten (€)
                    </label>
                    <input
                      type="number"
                      value={inputs.investmentCost}
                      onChange={(e) => handleInputChange('investmentCost', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="10000"
                      max="1000000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Förderungen (€)
                    </label>
                    <input
                      type="number"
                      value={inputs.subsidies}
                      onChange={(e) => handleInputChange('subsidies', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Betrachtungszeitraum (Jahre)
                    </label>
                    <input
                      type="number"
                      value={inputs.amortizationPeriod}
                      onChange={(e) => handleInputChange('amortizationPeriod', Number(e.target.value))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="5"
                      max="30"
                    />
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-green-50 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Ergebnisse</h2>

                {results && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {results.annualGeneration.toLocaleString('de-DE')} kWh
                        </div>
                        <p className="text-slate-600">Jährliche Stromerzeugung</p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {results.annualSavings.toLocaleString('de-DE')} €
                        </div>
                        <p className="text-slate-600">Jährliche Einsparungen</p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {results.roi.toFixed(1)}%
                        </div>
                        <p className="text-slate-600">Return on Investment (ROI)</p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {results.paybackPeriod.toFixed(1)} Jahre
                        </div>
                        <p className="text-slate-600">Amortisationszeit</p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-slate-900 mb-2">
                          {results.netInvestment.toLocaleString('de-DE')} €
                        </div>
                        <p className="text-slate-600">Netto-Investition (nach Förderungen)</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-slate-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Bereit für Ihre Photovoltaik-Anlage?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Lassen Sie sich von unseren Experten beraten und erhalten Sie ein maßgeschneidertes Angebot für Ihr Unternehmen.
            </p>
            <button
              onClick={openChat}
              className="inline-flex justify-center bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl transform hover:-translate-y-1"
            >
              Kostenlose Beratung starten
            </button>
            <p className="mt-6 text-sm text-slate-400">
              Erfahren Sie mehr über unsere <a href="/photovoltaik-gewerbe" className="underline hover:no-underline text-green-400">Photovoltaik-Lösungen für Gewerbe</a>.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default PhotovoltaikRechnerGewerbePage;
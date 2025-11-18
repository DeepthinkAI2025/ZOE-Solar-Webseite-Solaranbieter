import React, { useState } from 'react';

interface PricingPackage {
  id: string;
  name: string;
  systemSize: string;
  capacity: string;
  monthlyPayment: string;
  totalCost: string;
  saving: string;
  features: string[];
  popular?: boolean;
  roi: string;
  payback: string;
}

interface FinancingOption {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  requirements: string[];
  cta: string;
}

const PricingOverviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const pricingPackages: PricingPackage[] = [
    {
      id: "basic",
      name: "Basis Komplett-Paket",
      systemSize: "5,0 kWp",
      capacity: "ca. 5.250 kWh/Jahr",
      monthlyPayment: "ab 165€",
      totalCost: "13.900€",
      saving: "1.250€/Jahr",
      features: [
        "14x Premium Solarpanels (360W)",
        "5kW Wechselrichter",
        "Komplette Montage & Elektroinstallation",
        "Netzanschluss & Inbetriebnahme",
        "25 Jahre Garantie auf Panels",
        "Förderung: 30% = 4.170€",
        "Monitoring-App inklusive"
      ],
      roi: "12,8%",
      payback: "7,2 Jahre"
    },
    {
      id: "optimal",
      name: "Optimal-Paket",
      systemSize: "8,0 kWp",
      capacity: "ca. 8.400 kWh/Jahr",
      monthlyPayment: "ab 245€",
      totalCost: "19.900€",
      saving: "2.180€/Jahr",
      features: [
        "22x Premium Solarpanels (365W)",
        "8kW Hybrid-Wechselrichter",
        "Komplette Montage & Elektroinstallation",
        "Speicher-Ready Technologie",
        "25 Jahre Garantie auf Panels",
        "Förderung: 30% = 5.970€",
        "Smart Monitoring + App",
        "Erweiterte Garantie"
      ],
      popular: true,
      roi: "14,2%",
      payback: "6,8 Jahre"
    },
    {
      id: "premium",
      name: "Premium Maximal",
      systemSize: "12,0 kWp",
      capacity: "ca. 12.600 kWh/Jahr",
      monthlyPayment: "ab 325€",
      totalCost: "28.900€",
      saving: "3.340€/Jahr",
      features: [
        "33x Premium Solarpanels (365W)",
        "12kW Premium Wechselrichter",
        "10kWh LiFePO4 Speichersystem",
        "Komplette Montage & Elektroinstallation",
        "Smart Home Integration",
        "25 Jahre Garantie auf Panels",
        "Förderung: 30% = 8.670€",
        "Premium Monitoring & Support",
        "Individuelle Energieberatung"
      ],
      roi: "15,8%",
      payback: "6,1 Jahre"
    }
  ];

  const financingOptions: FinancingOption[] = [
    {
      id: "kfw",
      name: "KfW-Kredit 270",
      description: "0% Zinsen - 100% finanziert",
      benefits: [
        "Kostenlose Finanzierung (0% Zinsen)",
        "Laufzeit bis zu 20 Jahre",
        "100% der Investitionskosten finanzierbar",
        "Flexible Sondertilgung",
        "Volltilgung möglich nach 10 Jahren"
      ],
      requirements: [
        "Bauantrag ab 01.01.2023",
        "Maximale Anlagengröße 50 kWp",
        "Kreditlaufzeit: 10-20 Jahre",
        "Antrag über Bank oder Sparkasse"
      ],
      cta: "Jetzt KfW-Finanzierung beantragen"
    },
    {
      id: "own",
      name: "Eigenkapital + Förderung",
      description: "Optimale Förderung nutzen",
      benefits: [
        "Maximale Förderung 30% = 8.670€",
        "Kurze Finanzierungsdauer",
        "Hohe Rendite durch vollen Besitz",
        "Volle Kontrolle über die Anlage",
        "Optional: Vorsteuerabzug"
      ],
      requirements: [
        "Mindestens 20% Eigenkapital",
        "Feststehende Baugenehmigung",
        "Nachweis des Eigenkapitals",
        "Positive Kreditwürdigkeitsprüfung"
      ],
      cta: "Förderung berechnen"
    },
    {
      id: "leasing",
      name: "Leasing-Modell",
      description: "Sofort starten ohne Eigenkapital",
      benefits: [
        "0€ Anzahlung erforderlich",
        "Monatliche Raten ab 165€",
        "Sofortige Stromproduktion",
        "Option zum späteren Kauf",
        "All-inclusive Service"
      ],
      requirements: [
        "Bonitätsprüfung erforderlich",
        "Mindestlaufzeit 20 Jahre",
        "Verpflichtung zu Wartung",
        "Öffentliche Förderung nicht nutzbar"
      ],
      cta: "Leasing-Konditionen anfragen"
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-bold text-green-600 uppercase tracking-wider">Investition & Finanzierung</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
            Ihr Weg zur Solaranlage - Faire Preise, große Ersparnis
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Transparente Preise, attraktive Förderung und flexible Finanzierung. 
            Finden Sie die optimale Solarlösung für Ihr Budget und Ihre Bedürfnisse.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 0
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
          >
            Paket-Angebote
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
              activeTab === 1
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
          >
            Finanzierung
          </button>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                  pkg.popular
                    ? 'border-green-300 shadow-xl relative transform -translate-y-2'
                    : 'border-slate-200 hover:shadow-lg'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Beliebtestes Paket
                    </span>
                  </div>
                )}

                {/* Package Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                  <p className="text-slate-600 mb-4">{pkg.systemSize} • {pkg.capacity}</p>
                  
                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-green-600 mb-1">{pkg.totalCost}</div>
                    <div className="text-sm text-slate-600">bei {pkg.monthlyPayment}/Monat</div>
                  </div>

                  {/* ROI Metrics */}
                  <div className="bg-green-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">{pkg.roi}</div>
                        <div className="text-xs text-slate-600">Rendite p.a.</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{pkg.payback}</div>
                        <div className="text-xs text-slate-600">Amortisation</div>
                      </div>
                    </div>
                    <div className="text-center mt-3 pt-3 border-t border-green-200">
                      <div className="text-lg font-bold text-green-600">{pkg.saving}</div>
                      <div className="text-xs text-slate-600">Jährliche Ersparnis</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-green-600 text-white hover:bg-green-700 transform hover:-translate-y-1'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                  Paket konfigurieren
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 1 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {financingOptions.map((option, index) => (
              <div
                key={option.id}
                className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{option.name}</h3>
                  <p className="text-slate-600">{option.description}</p>
                </div>

                {/* Benefits */}
                <div className="mb-8">
                  <h4 className="font-semibold text-slate-900 mb-4">Ihre Vorteile:</h4>
                  <div className="space-y-3">
                    {option.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-8">
                  <h4 className="font-semibold text-slate-900 mb-4">Voraussetzungen:</h4>
                  <div className="space-y-2">
                    {option.requirements.map((req, reqIndex) => (
                      <div key={reqIndex} className="text-slate-600 text-sm">
                        • {req}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1">
                  {option.cta}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 lg:p-12 text-white text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            Bereit für Ihre Solarzukunft?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Lassen Sie sich von unseren Experten beraten und finden Sie die optimale Lösung für Ihr Budget.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">30%</div>
              <div className="text-sm opacity-90">Förderung sichern</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">0%</div>
              <div className="text-sm opacity-90">Zinsen bei KfW</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold">25+</div>
              <div className="text-sm opacity-90">Jahre Garantie</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1">
              Kostenlose Beratung
            </button>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              Finanzierung berechnen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingOverviewSection;
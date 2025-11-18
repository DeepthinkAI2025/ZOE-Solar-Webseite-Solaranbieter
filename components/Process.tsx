import React, { useState } from 'react';
import { Page } from '../types';

interface ProcessProps {
  customerType?: 'private' | 'business';
  setPage: (page: Page) => void;
}

const processData = {
  private: {
    badge: 'Ihr Weg zur Unabhängigkeit',
    title: 'Der ZOE Solar Weg',
    subtitle: 'Vom ersten Gedanken bis zur eigenen Stromproduktion – wir machen es einfach und transparent für Sie.',
    steps: [
      {
        step: 1,
        title: 'Persönliche Beratung',
        subtitle: 'Kostenlose Analyse',
        description: 'Wir kommen zu Ihnen nach Hause und analysieren Ihr Dach, Ihren Stromverbrauch und Ihre Möglichkeiten. Sie erhalten eine maßgeschneiderte Empfehlung ohne Verpflichtung.',
        details: [
          'Vor-Ort-Besichtigung Ihres Dachs',
          'Verbrauchsanalyse Ihrer Haushaltsgeräte',
          'Transparente Kosten-Nutzen-Rechnung',
          'Persönliche Beratung durch zertifizierte Experten'
        ],
        icon: 'consultation',
        duration: '1-2 Tage',
        cost: 'Kostenlos'
      },
      {
        step: 2,
        title: 'Maßgeschneiderte Planung',
        subtitle: 'Individuelle Lösung',
        description: 'Basierend auf Ihrer Situation erstellen wir einen detaillierten Plan. Von der kleinen Balkonanlage bis zur kompletten Dachsanierung – alles ist möglich.',
        details: [
          'Technische Planung und 3D-Visualisierung',
          'Ermittlung aller Fördermöglichkeiten',
          'Bauantrag und Genehmigungsmanagement',
          'Finanzierungsberatung und Kreditoptionen'
        ],
        icon: 'planning',
        duration: '1-2 Wochen',
        cost: 'Im Paketpreis'
      },
      {
        step: 3,
        title: 'Professionelle Installation',
        subtitle: 'Schlüsselfertige Montage',
        description: 'Unsere zertifizierten Monteure installieren Ihre Anlage termingerecht und nach höchsten Qualitätsstandards. Sie müssen sich um nichts kümmern.',
        details: [
          'Termingerechte Montage durch Fachpersonal',
          'Qualitätssicherung nach DIN-Normen',
          'Sicherheitsprüfung und Funktionskontrolle',
          'Reinigung und Endabnahme mit Ihnen'
        ],
        icon: 'installation',
        duration: '1-3 Tage',
        cost: 'Im Paketpreis'
      },
      {
        step: 4,
        title: 'Betreuung & Service',
        subtitle: 'Langfristige Partnerschaft',
        description: 'Nach der Installation betreuen wir Sie langfristig. Von der Garantie über Wartung bis hin zu Optimierungen – wir sind immer für Sie da.',
        details: [
          '10 Jahre Herstellergarantie auf Module',
          '25 Jahre Leistungsgarantie',
          'Jährliche Wartung und Überprüfung',
          '24/7 Monitoring und Support-Hotline'
        ],
        icon: 'support',
        duration: '25+ Jahre',
        cost: 'Im Servicevertrag'
      }
    ]
  },
  business: {
    badge: 'Professionelle Projektumsetzung',
    title: 'Der ZOE Solar Business Blueprint',
    subtitle: 'Von der Machbarkeitsstudie bis zur Inbetriebnahme – skalierbare Lösungen für Unternehmen jeder Größe.',
    steps: [
      {
        step: 1,
        title: 'Business Analyse',
        subtitle: 'Potenzialbewertung',
        description: 'Wir analysieren Ihre betrieblichen Strukturen, Energieverbräuche und Einsparpotenziale. Sie erhalten eine fundierte Wirtschaftlichkeitsberechnung.',
        details: [
          'Detaillierte Energieverbrauchsanalyse',
          'ROI-Berechnung und Amortisationsplanung',
          'Fördermittelrecherche und Beantragung',
          'Risiko- und Chancenbewertung'
        ],
        icon: 'analysis',
        duration: '1-2 Wochen',
        cost: 'Kostenlos'
      },
      {
        step: 2,
        title: 'Strategische Planung',
        subtitle: 'Maßgeschneiderte Konzepte',
        description: 'Wir entwickeln skalierbare Lösungen für Ihr Unternehmen. Von der Produktionshalle bis zum Solarpark – wir planen Ihre Energiezukunft.',
        details: [
          'Technische und wirtschaftliche Feasibility-Studie',
          'Projektstrukturierung und Finanzierungsmodell',
          'Umweltverträglichkeitsprüfung und Genehmigungen',
          'Integrationsplanung in bestehende Infrastruktur'
        ],
        icon: 'strategy',
        duration: '2-4 Wochen',
        cost: 'Im Projektbudget'
      },
      {
        step: 3,
        title: 'Professionelle Umsetzung',
        subtitle: 'Qualitätsgesicherte Installation',
        description: 'Unsere erfahrenen Teams realisieren Ihr Projekt termingerecht und budgetkonform. Minimale Betriebsunterbrechung, maximale Qualität.',
        details: [
          'Projektmanagement nach IPMA-Standards',
          'Qualitätsmanagement nach ISO 9001',
          'Sicherheitskoordination und Arbeitsschutz',
          'Regelmäßige Fortschrittsberichterstattung'
        ],
        icon: 'execution',
        duration: '4-12 Wochen',
        cost: 'Im Projektbudget'
      },
      {
        step: 4,
        title: 'Betrieb & Optimierung',
        subtitle: 'Langfristiger Erfolg',
        description: 'Wir überwachen und optimieren Ihre Anlage kontinuierlich. Durch regelmäßige Analysen maximieren wir Ihre Rendite über die gesamte Lebensdauer.',
        details: [
          '24/7 Anlagenmonitoring und Fernwartung',
          'Regelmäßige Performance-Optimierungen',
          'Jahresberichte und Wirtschaftlichkeitsanalysen',
          'Erweiterungsplanung und Skalierungsmöglichkeiten'
        ],
        icon: 'optimization',
        duration: '25+ Jahre',
        cost: 'Im Servicevertrag'
      }
    ]
  }
};

const ProcessIcon: React.FC<{ name: string }> = ({ name }) => {
  const className = "w-8 h-8 text-white";
  switch (name) {
    case 'consultation':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'planning':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'installation':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'support':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'analysis':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'strategy':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      );
    case 'execution':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'optimization':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    default:
      return null;
  }
};

const Process: React.FC<ProcessProps> = ({ customerType = 'private', setPage }) => {
  const [activeStep, setActiveStep] = useState(1);
  const currentData = processData[customerType] || processData.private;
  const activeStepData = currentData.steps.find(s => s.step === activeStep);

  return (
    <section className="relative py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary-200/8 to-primary-200/5 blur-[200px]" />
        <div className="absolute top-1/4 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-200/6 to-indigo-200/3 blur-[180px]" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-200/4 to-pink-200/2 blur-[160px]" />
        <div className="absolute top-3/4 left-1/4 h-[300px] w-[300px] rounded-full bg-white/20 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Professional Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-50 to-primary-50 border border-primary-200/60 mb-8 shadow-sm">
            <div className="p-1.5 rounded-full bg-primary-100">
              <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
              {currentData.badge}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 leading-tight mb-6">
            {currentData.title}
          </h2>

          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            {currentData.subtitle}
          </p>
        </div>

        {/* Professional Step Navigation */}
        <div className="relative mb-16">
          {/* Timeline Background */}
          <div className="absolute top-8 left-0 w-full h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
          <div
            className="absolute top-8 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-500 rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${((activeStep - 1) / (currentData.steps.length - 1)) * 100}%` }}
          ></div>

          {/* Step Indicators */}
          <div className="relative flex justify-between">
            {currentData.steps.map((step, index) => (
              <button
                key={step.step}
                onClick={() => setActiveStep(step.step)}
                className="group relative flex flex-col items-center focus:outline-none focus:ring-4 focus:ring-primary-200 rounded-2xl p-4 transition-all duration-300"
              >
                {/* Step Circle */}
                <div className={`relative w-16 h-16 rounded-full border-4 transition-all duration-500 shadow-lg ${
                  activeStep >= step.step
                    ? 'bg-gradient-to-br from-primary-500 to-primary-500 border-primary-400 shadow-primary-200'
                    : 'bg-white border-gray-300 hover:border-primary-300 hover:shadow-primary-100'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ProcessIcon name={step.icon} />
                  </div>
                  {activeStep > step.step && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Step Info */}
                <div className="mt-6 text-center max-w-[200px]">
                  <div className={`text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
                    activeStep === step.step ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-500'
                  }`}>
                    Schritt {step.step}
                  </div>
                  <h3 className={`text-lg font-bold mt-2 transition-colors duration-300 ${
                    activeStep === step.step ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm mt-1 transition-colors duration-300 ${
                    activeStep === step.step ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-500'
                  }`}>
                    {step.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Professional Content Display */}
        {activeStepData && (
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side - Main Content */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <ProcessIcon name={activeStepData.icon} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{activeStepData.title}</h3>
                    <p className="text-primary-600 font-semibold">{activeStepData.subtitle}</p>
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {activeStepData.description}
                </p>

                {/* Details List */}
                <div className="space-y-4 mb-8">
                  {activeStepData.details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Meta Information */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">{activeStepData.duration}</div>
                    <div className="text-sm text-gray-600 font-medium">Dauer</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-1">{activeStepData.cost}</div>
                    <div className="text-sm text-gray-600 font-medium">Kosten</div>
                  </div>
                </div>
              </div>

              {/* Right Side - Visual Enhancement */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-50 p-8 lg:p-12 flex flex-col justify-center">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <ProcessIcon name={activeStepData.icon} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Warum Schritt {activeStepData.step} entscheidend ist
                  </h4>
                  <p className="text-gray-600">
                    {activeStepData.step === 1 && (customerType === 'private'
                      ? "Die Basis für Ihre Entscheidung – transparente Informationen ohne Verpflichtung."
                      : "Fundierte Analyse als Grundlage für skalierbare und profitable Lösungen."
                    )}
                    {activeStepData.step === 2 && (customerType === 'private'
                      ? "Ihre persönliche Lösung – maßgeschneidert auf Ihre Bedürfnisse und Möglichkeiten."
                      : "Strategische Planung für maximale Wirtschaftlichkeit und Zukunftssicherheit."
                    )}
                    {activeStepData.step === 3 && (customerType === 'private'
                      ? "Professionelle Ausführung – Sie können sich entspannt zurücklehnen."
                      : "Qualitätsgesicherte Umsetzung mit minimalen Betriebsunterbrechungen."
                    )}
                    {activeStepData.step === 4 && (customerType === 'private'
                      ? "Langfristige Partnerschaft – wir begleiten Sie über die gesamte Lebensdauer."
                      : "Kontinuierliche Optimierung für maximale Rendite über 25+ Jahre."
                    )}
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Fortschritt</span>
                    <span>{activeStepData.step} von {currentData.steps.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-500 h-3 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${(activeStepData.step / currentData.steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setPage('kontakt')}
                    className="bg-gradient-to-r from-primary-600 to-primary-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-primary-700 hover:to-primary-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    Jetzt Beratung anfordern
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Process;
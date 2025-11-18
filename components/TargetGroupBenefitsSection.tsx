import React, { useState } from 'react';

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CaseStudy {
  title: string;
  description: string;
  metrics: {
    label: string;
    value: string;
  }[];
  result: string;
}

interface TargetGroup {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: Benefit[];
  caseStudy: CaseStudy;
  keywords: string[];
  popular?: boolean;
}

const TargetGroupBenefitsSection: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState(0);

  const targetGroups: TargetGroup[] = [
    {
      id: "residential",
      title: "Privatkunden & Einfamilienhaus",
      subtitle: "Ihre Energiewende für Zuhause",
      description: "Einfamilienhaus-Besitzer profitieren maximal von Photovoltaik: hohe Eigenverbrauchs-Quoten, attraktive Förderung und langfristige Kosteneinsparungen machen Solar zur rentabelsten Investition für Ihr Zuhause.",
      benefits: [
        {
          title: "Maximale Eigenverbrauchs-Quote",
          description: "Bis zu 80% Eigenverbrauch durch intelligenten Verbrauch und optionalen Batteriespeicher möglich",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5 10.5 6l6.75 7.5M10.5 6l3.75 3.75M12 4.5v9m0 0l3.75 3.75M12 4.5H8.25" />
            </svg>
          )
        },
        {
          title: "Attraktive Förderung 2025",
          description: "30% Bundesförderung + bis zu 5.000€ Speicher-Bonus sichern Ihnen maximale finanzielle Vorteile",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          )
        },
        {
          title: "25+ Jahre Rendite-Sicherheit",
          description: "Über 12% jährliche Rendite durch Strompreisersparnis und Einspeisevergütung bei 25+ Jahren Garantie",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          )
        },
        {
          title: "Smart Home Integration",
          description: "Modernste Monitoring-Technologie mit App-Steuerung für optimale Eigenverbrauchs-Optimierung",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.12L9 21l1.879-1.879A3 3 0 0113.5 18.257V17.25a6 6 0 00-6-6H9z" />
            </svg>
          )
        }
      ],
      caseStudy: {
        title: "Familie Schmidt, Potsdam",
        description: "8 kWp Anlage mit 10 kWh Speicher",
        metrics: [
          { label: "Anlagengröße", value: "8,0 kWp" },
          { label: "Jahresertrag", value: "8.400 kWh" },
          { label: "Eigenverbrauch", value: "78%" },
          { label: "Monatsrate", value: "245€" },
          { label: "Rendite p.a.", value: "14,2%" },
          { label: "Amortisation", value: "6,8 Jahre" }
        ],
        result: "Nach 3 Jahren bereits 3.240€ Ersparnis und volle finanzielle Unabhängigkeit erreicht"
      },
      keywords: [
        "Photovoltaik Einfamilienhaus",
        "Solaranlage Eigenheim", 
        "PV Anlage Privat",
        "Solarstrom Zuhause",
        "Photovoltaik Kosten"
      ]
    },
    {
      id: "agriculture",
      title: "Landwirtschaft & Agrarflächen",
      subtitle: "Agri-PV: Doppelte Nutzung für mehr Ertrag",
      description: "Agrarphotovoltaik revolutioniert die Landwirtschaft: Schutz der Kulturpflanzen, höhere Erträge durch optimales Klima und zusätzliche Stromproduktion machen Agri-PV zur Zukunft der nachhaltigen Landwirtschaft.",
      benefits: [
        {
          title: "Doppelter Flächenertrag",
          description: "Gleichzeitige Nutzung für Landwirtschaft und Stromproduktion: bis zu 160% Flächennutzung",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          )
        },
        {
          title: "Klimaschutz für Ernte",
          description: "Bis zu 25% Ertragssteigerung durch optimales Mikroklima und Schutz vor Hagel und Frost",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          )
        },
        {
          title: "Spezielle Agrar-Förderung",
          description: "Bis zu 50% Förderung für Agri-PV Projekte + EEG-Vergütung für Stromproduktion",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3.75v16.5m8.25-8.25H3.75m0 0L12 6l8.25-2.25M12 21v-8.25M3.75 21V6l8.25 2.25" />
            </svg>
          )
        },
        {
          title: "Beratung & Planung",
          description: "Spezialisierte Beratung für optimale Agri-PV Lösungen: von der Kulturpflanzen-Auswahl bis zur Ernte-Integration",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          )
        }
      ],
      caseStudy: {
        title: "Bio-Hof Müller, Brandenburg",
        description: "50 kWp Agri-PV auf Ackerfläche (2 ha)",
        metrics: [
          { label: "Agrarfläche", value: "2,0 ha" },
          { label: "PV-Leistung", value: "50 kWp" },
          { label: "Stromproduktion", value: "52.000 kWh/Jahr" },
          { label: "Förderung", value: "45%" },
          { label: "Ertragssteigerung", value: "+18%" },
          { label: "ROI", value: "16,3%" }
        ],
        result: "Agrar-PV ermöglicht 52.000 kWh Solarstrom + 18% höhere Ernteerträge - doppelter Nutzen!"
      },
      keywords: [
        "Agrarphotovoltaik",
        "Agri PV Landwirtschaft",
        "Solar Bauernhof",
        "Freiflächen Photovoltaik",
        "Agrar PV Förderung"
      ],
      popular: true
    },
    {
      id: "commercial",
      title: "Gewerbe & Unternehmen",
      subtitle: "Erneuerbare Energie für Ihr Business",
      description: "Unternehmen reduzieren Energiekosten drastisch und erreichen Klimaziele: Gewerbebetriebe profitieren von attraktiven Abschreibungen, steuerlichen Vorteilen und maximaler Kosteneinsparung durch Solarenergie.",
      benefits: [
        {
          title: "Maximale Steuerersparnis",
          description: "20 Jahre lineare Abschreibung + Vorsteuerabzug = bis zu 40% Gesamtersparnis für Unternehmen",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          )
        },
        {
          title: "Erhöhung Eigenverbrauch",
          description: "Gewerbeanlagen nutzen 60-85% des Solarstroms durch Produktionszeiten tagsüber",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5 10.5 6l6.75 7.5M10.5 6l3.75 3.75M12 4.5v9m0 0l3.75 3.75M12 4.5H8.25" />
            </svg>
          )
        },
        {
          title: "Nachhaltige Unternehmensdarstellung",
          description: "Erreichen Sie Klimaziele und verbessern Sie Ihr Image mit erneuerbarer Energie vor Ort",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          )
        },
        {
          title: "Maßgeschneiderte Lösungen",
          description: "Professionelle Planung für Hallen, Lagerhallen und Großdächer mit optimaler Flächennutzung",
          icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          )
        }
      ],
      caseStudy: {
        title: "Möbelhaus König, Berlin",
        description: "120 kWp Gewerbeanlage auf Verkaufsfläche",
        metrics: [
          { label: "Dachfläche", value: "800 m²" },
          { label: "PV-Leistung", value: "120 kWp" },
          { label: "Jahresertrag", value: "126.000 kWh" },
          { label: "Eigenverbrauch", value: "82%" },
          { label: "Abschreibung", value: "20 Jahre" },
          { label: "Steuervorteil", value: "42%" }
        ],
        result: "Über 35.000€ jährliche Kosteneinsparung + 42% Steuervorteil - payback nach 5,2 Jahren!"
      },
      keywords: [
        "Gewerbe Photovoltaik",
        "Industriedächer Solar",
        "Photovoltaik Unternehmen",
        "Gewerbehallen Solar",
        "Betriebsstrom Solar"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-bold text-green-600 uppercase tracking-wider">Zielgruppen</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
            Die passende Solar-Lösung für jeden Bedarf
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Ob Privathaushalt, Landwirtschaft oder Gewerbe - wir entwickeln maßgeschneiderte 
            Photovoltaik-Lösungen, die optimal zu Ihren spezifischen Anforderungen passen.
          </p>
        </div>

        {/* Target Group Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {targetGroups.map((group, index) => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(index)}
              className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 relative ${
                activeGroup === index
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {group.title}
              {group.popular && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  TOP
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active Target Group Content */}
        <div className="bg-slate-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Benefits */}
            <div>
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">
                  {targetGroups[activeGroup].title}
                </h3>
                <p className="text-green-600 font-semibold text-lg mb-4">
                  {targetGroups[activeGroup].subtitle}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {targetGroups[activeGroup].description}
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="space-y-6">
                {targetGroups[activeGroup].benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <div className="text-green-600">
                          {benefit.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">
                          {benefit.title}
                        </h4>
                        <p className="text-slate-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Keywords */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Relevante Keywords:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {targetGroups[activeGroup].keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Case Study */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="text-xl font-bold text-slate-900 mb-6">
                  Erfolgreiche Referenz
                </h4>
                
                <div className="mb-6">
                  <h5 className="text-lg font-semibold text-slate-800 mb-2">
                    {targetGroups[activeGroup].caseStudy.title}
                  </h5>
                  <p className="text-slate-600 mb-4">
                    {targetGroups[activeGroup].caseStudy.description}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {targetGroups[activeGroup].caseStudy.metrics.map((metric, index) => (
                    <div key={index} className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-xs text-slate-600">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Result */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-700 font-medium">
                      {targetGroups[activeGroup].caseStudy.result}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            Bereit für Ihre maßgeschneiderte Solar-Lösung?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Lassen Sie sich von unseren Experten beraten und finden Sie die optimale Lösung für Ihre spezifischen Anforderungen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1">
              Kostenlose Beratung für meine Zielgruppe
            </button>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              Zielgruppen-spezifisches Angebot
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetGroupBenefitsSection;
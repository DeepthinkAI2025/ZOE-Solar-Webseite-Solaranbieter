import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface FAQProps {
  customerType?: 'private' | 'business';
  setPage: (page: Page) => void;
}

const faqData = {
  private: {
    badge: 'Privatkunden FAQ',
    title: 'Ihre Fragen, unsere Antworten',
    subtitle: 'Alles Wissenswerte rund um Ihre private Solaranlage – transparent und verständlich erklärt.',
    categories: [
      {
        name: 'Planung & Beratung',
        icon: '📋',
        questions: [
          {
            question: 'Wie viel Dachfläche benötige ich für eine Solaranlage?',
            answer: 'Für eine typische 10 kWp Anlage benötigen Sie etwa 60-80 m² freie Dachfläche. Die genaue Größe hängt von der gewünschten Leistung, der Dachausrichtung und dem Modultyp ab. Unser Team berät Sie gerne bei der optimalen Planung.'
          },
          {
            question: 'Wie lange dauert die Planung und Installation?',
            answer: 'Von der ersten Beratung bis zur Inbetriebnahme dauert es typischerweise 8-12 Wochen. Die Planungsphase nimmt etwa 2-4 Wochen in Anspruch, die Installation selbst erfolgt innerhalb von 1-2 Tagen.'
          },
          {
            question: 'Welche Unterlagen benötige ich für die Beantragung?',
            answer: 'Sie benötigen einen gültigen Personalausweis, eine Grundbuchauskunft und ggf. eine Baugenehmigung. Bei Mietobjekten ist die Zustimmung des Vermieters erforderlich. Wir unterstützen Sie bei allen Formalitäten.'
          }
        ]
      },
      {
        name: 'Technik & Leistung',
        icon: '⚡',
        questions: [
          {
            question: 'Wie hoch ist der Stromertrag einer Solaranlage?',
            answer: 'Bei optimalen Bedingungen (Südausrichtung, 30° Neigung) können Sie mit 850-1.100 kWh pro kWp installierter Leistung pro Jahr rechnen. Der tatsächliche Ertrag hängt von Standort, Ausrichtung und Wetterbedingungen ab.'
          },
          {
            question: 'Was passiert bei einem Stromausfall?',
            answer: 'Solaranlagen sind netzgekoppelt und schalten sich bei einem Stromausfall automatisch ab. Mit einem zusätzlichen Energiespeicher können Sie jedoch auch bei Netzausfall Strom nutzen. Wir beraten Sie zu den besten Lösungen.'
          },
          {
            question: 'Wie funktioniert die Einspeisevergütung?',
            answer: 'Überschüssiger Solarstrom wird ins öffentliche Netz eingespeist und vergütet. Die Höhe der Vergütung richtet sich nach dem Erneuerbare-Energien-Gesetz (EEG) und beträgt derzeit etwa 8-10 Cent pro kWh, je nach Anlagengröße und Inbetriebnahmedatum.'
          }
        ]
      },
      {
        name: 'Kosten & Wirtschaftlichkeit',
        icon: '💰',
        questions: [
          {
            question: 'Wie hoch sind die Anschaffungskosten?',
            answer: 'Die Kosten liegen typischerweise zwischen 1.200-1.800 € pro kWp installierter Leistung. Für eine 10 kWp Anlage betragen die Gesamtkosten somit etwa 12.000-18.000 €. Förderungen können die Kosten um bis zu 40% reduzieren.'
          },
          {
            question: 'Wie schnell amortisiert sich die Anlage?',
            answer: 'Bei optimalen Bedingungen amortisiert sich eine Solaranlage in 8-12 Jahren. Durch die Eigenstromnutzung und die Einspeisevergütung sparen Sie jährlich mehrere tausend Euro an Stromkosten. Die Anlage produziert danach jahrzehntelang kostenlosen Strom.'
          },
          {
            question: 'Welche Förderungen gibt es 2025?',
            answer: 'Die neuen Förderprogramme 2025: BEG-Förderung bis zu 50% Zuschuss, KfW-Kredite mit 2,55% Zinsen, EEG 2025 mit 8,2 ct/kWh Vergütung, BAFA-Zuschüsse bis 40%, regionale Förderungen (Bayern bis 75.000 €). Steuerlich: Sonder-AfA §7c EStG, Vorsteuerabzug.'
          },
          {
            question: 'Welche Winter-Aktionen gibt es bei Solaranlagen 2025/26?',
            answer: 'Winter-Aktion 2025/26: ZOE Solar bietet bis 31.12.2025 einen Extra-Rabatt von bis zu 5.000 € auf komplette Solaranlagen. Zusätzlich: 1) Kostenlose Dachstatik-Prüfung, 2) 3 Jahre kostenlose Wartung, 3) BEG-Förderung 2025 kombinierbar, 4) Besondere Winter-Konditionen für Installation, 5) Planungsvorteile durch frühe Buchung.'
          }
        ]
      },
      {
        name: 'Neue Technologien 2025-26',
        icon: '🚀',
        questions: [
          {
            question: 'Welche neuen Solarmodule gibt es 2025?',
            answer: 'Die neuesten Module 2025: TOPCon-Technologie (bis 23% Wirkungsgrad), bifaziale Module (bis 30% Mehrertrag), Glas-Glas-Module (30 Jahre Garantie), perovskite-Silizium-Tandemzellen (über 30% Wirkungsgrad). Alle mit 25-30 Jahren Leistungsgarantie.'
          },
          {
            question: 'Was sind die Solar-Trends 2026 die ich beachten sollte?',
            answer: '2026 Solar-Trends: 1) Perowskit-Silizium-Tandemzellen (über 30% Wirkungsgrad), 2) Vollautomatische KI-Monitoring-Systeme, 3) Solarfassaden als Standard-Bauteil, 4) Bidirektionale E-Auto-Ladestationen (V2H/V2G), 5) Solarparks mit Agri-PV-Kombination, 6) Blockchain-basierte Stromhandelsplattformen. 2026 wird das Jahr der integrierten Energiesysteme.'
          },
          {
            question: 'Lohnt es sich, mit der Solaranlage bis 2026 zu warten?',
            answer: 'Nein, warten lohnt sich nicht: 1) BEG-Förderung 2025 ist jetzt am höchsten, 2) Winter-Aktion bis 5.000 € Rabatt läuft nur bis 31.12.2025, 3) Strompreise steigen weiter, 4) 2026 werden neue Module teurer (Silizium-Engpässe), 5) Wartelisten für Installationen werden länger. Jetzt investieren spart 8.000-15.000 € vs. 2026.'
          }
        ]
      },
      {
        name: 'Energiekrise & Unabhängigkeit',
        icon: '⚡',
        questions: [
          {
            question: 'Wie wird Solar in der Energiekrise 2025/26 wichtiger?',
            answer: 'Solar in der Energiekrise: 1) Unabhängigkeit von Gas- und Strompreisen, 2) Inflationsschutz für 25+ Jahre, 3) Versorgungssicherheit durch Eigenstrom, 4) Bei Blackout mit Speicher weiter versorgt, 5) Beitrag zur Energiewende und Klimaschutz. 2025/26 sind die kritischsten Jahre für Energieunabhängigkeit.'
          },
          {
            question: 'Wie funktioniert die neue KI-Solar-Technologie 2026?',
            answer: 'KI-Solar 2026: 1) Predictive Maintenance mit 95% Vorhersagegenauigkeit, 2) Automatische Ertragsoptimierung durch Wetter-KI, 3) Intelligente Eigenstrom-Steuerung, 4) AR-basierte Wartungsanleitungen per Smartphone, 5) Blockchain-garantierte Herkunftsnachweise, 6) Sprachsteuerung für das gesamte Energiesystem. Unsere KI lernt Ihr Verhalten und optimiert automatisch.'
          }
        ]
      }
    ]
  },
  business: {
    badge: 'Geschäftskunden FAQ',
    title: 'Professionelle Antworten für Ihr Business 2025',
    subtitle: 'Neue Förderprogramme, Agri-PV, KI-Technologien: Alles für erfolgreiche Solarprojekte 2025.',
    categories: [
      {
        name: 'BEG-Förderung 2025 & neue Programme',
        icon: '💰',
        questions: [
          {
            question: 'Wie funktioniert die neue BEG-Förderung 2025?',
            answer: 'BEG 2025: Bis zu 50% Zuschuss für gewerbliche PV-Anlagen, 70% für Agri-PV, kombiniert mit KfW-Krediten (2,55% Zinsen). Förderung für Planung, Installation, Speicher und Monitoring. Antragstellung über BAFA online.'
          },
          {
            question: 'Welche Agri-PV-Förderungen gibt es 2025?',
            answer: 'Agri-PV 2025: Bis zu 70% Zuschuss, Förderung für erhöhte Aufständerung (4m+), Speicherförderung, landwirtschaftliche Mehrnutzung. Bayern: bis 75.000 €, Baden-Württemberg: bis 60.000 € pro Hektar. Vereinfachte Genehmigungsverfahren.'
          },
          {
            question: 'Was sind die neuen EEG 2025 Regelungen?',
            answer: 'EEG 2025: 8,2 ct/kWh für Anlagen bis 100 kWp, Direktvermarktung ab 100 kWp, Marktprämie garantiert, 20 Jahre Vergütung. Neue Regelungen für Balkonanlagen (bis 2 kWp ohne Anmeldung), Photovoltaikpflicht für Neubauten.'
          }
        ]
      },
      {
        name: 'KI & Digitalisierung 2025',
        icon: '🤖',
        questions: [
          {
            question: 'Wie helfen KI-Systeme bei der Solarplanung 2025?',
            answer: 'KI-Optimierung 2025: Automatische Verschattungsanalyse, Ertragsprognosen mit 95% Genauigkeit, predictive maintenance für 30% weniger Ausfallzeit, KI-basierte Wechselrichter-Optimierung, automatische Anomalie-Erkennung.'
          },
          {
            question: 'Was ist neu beim Monitoring 2025?',
            answer: 'Smart-Monitoring 2025: Echtzeit-KI-Analysen, mobile App mit AR-Funktionen, Drohnen-Inspektionen, Wetter-Integration, automatische Störungsmeldungen, Cloud-basierte Datenanalyse, Blockchain-Verifizierung der Ertragsdaten.'
          },
          {
            question: 'Welche digitalen Services gibt es 2025?',
            answer: 'Digital-Services 2025: Online-Konfigurator mit 3D-Visualisierung, KI-basierte Wirtschaftlichkeitsrechnung, automatisierte Förderanträge, digitale twins der Anlage, predictive analytics für Wartung, Blockchain-basierte Herkunftsnachweise.'
          }
        ]
      },
      {
        name: 'Moderne Speicher & E-Mobilität',
        icon: '🔋',
        questions: [
          {
            question: 'Welche neuen Speichertechnologien sind verfügbar?',
            answer: 'Speicher 2025: LiFePO4-Batterien (kostengünstig, sicher), Natrium-Ionen (umweltfreundlich), Redox-Flow (langzeitstabil), Wasserstoff (saisonal). Kapazitäten: 10-500 kWh, Lebensdauer 15-25 Jahre, 90% Effizienz.'
          },
          {
            question: 'Wie funktioniert Vehicle-to-Grid 2025?',
            answer: 'V2G 2025: Bidirektionales Laden mit E-Fahrzeugen als Speicher, 50-100 kWh zusätzliche Kapazität, Netzdienstleistungen verkaufen, bis zu 2.000€ jährliche Einnahmen, Integration in Gebäudeenergiemanagement.'
          },
          {
            question: 'Was sind die neuen Wallbox-Standards?',
            answer: 'Wallbox 2025: 22-350 kW Ladeleistung, OCPP 2.0 Standard, Plug&Charge, integrierte PV-Steuerung, Lastmanagement für Unternehmen, ISO 15118 Unterstützung, Smart-Grid-Integration, gesteuertes Laden.'
          }
        ]
      },
      {
        name: 'Freiflächen & Solarparks',
        icon: '🏭',
        questions: [
          {
            question: 'Welche Freiflächen eignen sich für Solarparks 2025?',
            answer: 'Freiflächen 2025: Ackerland (nach EEG), Konversionsflächen, Deponien, Autobahnrandstreifen, Gewerbeflächen. Flächenbedarf: 2 ha pro MW, Abstand zu Wohngebieten: 100-300m. Renditen: 8-12% jährlich.'
          },
          {
            question: 'Wie läuft die Genehmigung für Solarparks?',
            answer: 'Genehmigung 2025: Raumordnungsverfahren, Planfeststellung, Umweltverträglichkeitsprüfung, Naturschutzrecht, EEG-Vorranggebiete. Dauer: 18-36 Monate. Kosten: 50.000-200.000 € für Genehmigungsverfahren.'
          },
          {
            question: 'Welche Betriebskosten entstehen bei Solarparks?',
            answer: 'Betriebskosten 2025: Versicherung (0,5% Invest), Wartung (15-25 €/kWp/Jahr), Grundsteuer (0,5% Grundwert), Pacht (800-1.500 €/ha/Jahr), Verwaltung (10 €/kWp/Jahr). Gesamt: 25-40 €/kWp jährlich.'
          }
        ]
      },
      {
        name: 'Agri-PV Speziallösungen 2025',
        icon: '🌾',
        questions: [
          {
            question: 'Welche Agri-PV-Systeme gibt es 2025?',
            answer: 'Agri-PV 2025: Hochaufgeständerte Systeme (4-8m Höhe, 80% Lichtdurchlässigkeit), vertikale Systeme (bifaziale Module), Gewächshaus-Integration, Weidehaltung unter Modulen. Spezielle Kulturen: Beerenobst, Wein, Gemüse.'
          },
          {
            question: 'Wie wirkt sich Agri-PV auf die Landwirtschaft aus?',
            answer: 'Agri-PV-Effekte 2025: Schutz vor Hagel/Sturm (90% weniger Schäden), Wassereinsparung (30-50%), Temperaturregulierung (+3-5°C im Winter, -3-5°C im Sommer), höhere Erntequalität, Doppelternte, neue Einnahmequellen.'
          },
          {
            question: 'Welche Pflanzen eignen sich für Agri-PV?',
            answer: 'Agri-PV-Kulturen 2025: Beerensträucher (Himbeeren, Brombeeren), Weinreben, Hopfen, Salate, Kräuter, Blumen, Setzlinge. Nicht geeignet: Getreide, Mais, Raps. Pilotprojekte: Kartoffeln, Tomaten unter Glas.'
          }
        ]
      },
      {
        name: 'Finanzierung & PPA 2025',
        icon: '💳',
        questions: [
          {
            question: 'Wie funktionieren PPA-Modelle 2025?',
            answer: 'PPA 2025: 15-25 Jahre Laufzeit, 6-12 ct/kWh Strompreis, indexiert an Verbraucherpreisindex, Kapitalkosten 4-7%, moderne PPA mit Integration von Speichern und E-Mobilität. Das Unternehmen erwirbt die Anlage nach Laufzeitende.'
          },
          {
            question: 'Welche Steuervorteile gibt es 2025?',
            answer: 'Steuern 2025: Sonder-AfA §7c EStG (50% Sofortabschreibung), Vorsteuerabzug, §3 Nr.72 EStG (steuerfreie Einspeisung), Investitionsabzugsbeträge, lineare Abschreibung 20 Jahre, Gewerbesteuer-Vorteile durch höhere Abschreibungen.'
          },
          {
            question: 'Wie beeinflusst CSRD die Solarinvestitionen?',
            answer: 'CSRD 2025: Nachhaltigkeitsberichterstattung für große Unternehmen, Solaranlagen verbessern ESG-Score, reduzieren CO2-Fußabdruck, verbessern Nachhaltigkeitsratings, erleichtern Zugang zu nachhaltigen Finanzierungen.'
          }
        ]
      }
    ]
  }
};

// Enhanced FAQ Item Component with Professional Design
const FAQItem: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isMobileOptimized?: boolean;
}> = ({ question, answer, isOpen, onToggle, index, isMobileOptimized = false }) => {
  return (
    <div className="group">
      <button
        onClick={onToggle}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-xl"
      >
        <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
          isOpen
            ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }`}>
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-400 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          <div className="relative p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isOpen ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg md:text-xl font-bold leading-tight transition-colors ${
                    isOpen ? 'text-green-800' : 'text-gray-900 group-hover:text-green-700'
                  }`}>
                    {question}
                  </h3>
                </div>
              </div>

              <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                <svg className={`w-6 h-6 transition-colors ${
                  isOpen ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Expandable Answer Section */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <div className="pt-4 border-t border-gray-200">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">{answer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Professional CTA within answer - moved outside the button */}
      {isOpen && (
        <div className="mt-4 ml-14 mr-6 md:ml-16 md:mr-8">
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-3">Haben Sie weitere Fragen zu diesem Thema?</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Experten kontaktieren
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Category Card Component
const CategoryCard: React.FC<{
  category: typeof faqData.private.categories[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ category, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 text-left ${
        isActive
          ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-xl scale-105'
          : 'bg-white border-2 border-gray-200 hover:border-green-300 hover:shadow-lg'
      }`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`text-4xl ${isActive ? 'text-white' : 'text-green-400'}`}>
          {category.icon}
        </div>
      </div>

      <div className="relative">
        <div className={`text-3xl mb-3 ${isActive ? 'text-white' : 'text-green-500'}`}>
          {category.icon}
        </div>
        <h3 className={`text-lg font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-900'}`}>
          {category.name}
        </h3>
        <p className={`text-sm ${isActive ? 'text-green-100' : 'text-gray-600'}`}>
          {category.questions.length} Fragen
        </p>
      </div>
    </button>
  );
};

const FAQ: React.FC<FAQProps> = ({ customerType = 'private', setPage }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);

  // Server-side rendering optimization
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const currentData = faqData[customerType] || faqData.private;
  const currentCategory = currentData.categories[activeCategory];

  const toggleQuestion = (question: string) => {
    setOpenQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(question)) {
        newSet.delete(question);
      } else {
        newSet.add(question);
      }
      return newSet;
    });
  };

  const handleContactClick = () => {
    setPage('kontakt');
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-green-200/8 to-emerald-200/5 blur-[200px]" />
        <div className="absolute top-1/4 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-200/6 to-indigo-200/3 blur-[180px]" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-200/4 to-pink-200/2 blur-[160px]" />
        <div className="absolute top-3/4 left-1/4 h-[300px] w-[300px] rounded-full bg-white/20 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 mb-8 shadow-sm">
            <div className="p-1.5 rounded-full bg-green-100">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              {currentData.badge}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 leading-tight mb-6">
            {currentData.title}
          </h2>

          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            {currentData.subtitle}
          </p>
        </div>

        {/* Category Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {currentData.categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              category={category}
              isActive={activeCategory === index}
              onClick={() => setActiveCategory(index)}
            />
          ))}
        </div>

        {/* Mobile-Optimized FAQ Items with Lazy Loading */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {currentCategory.questions.map((faq, index) => {
              // Lazy loading für bessere Performance
              const shouldRender = index < 10 || openQuestions.has(faq.question);
              
              return shouldRender ? (
                <FAQItem
                  key={`${currentCategory.name}-${index}`}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openQuestions.has(faq.question)}
                  onToggle={() => toggleQuestion(faq.question)}
                  index={index}
                  isMobileOptimized={true}
                />
              ) : (
                <div key={`${currentCategory.name}-${index}`} className="faq-skeleton">
                  <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Professional CTA Section */}
        <div className="mt-20">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/60">
            <div className="text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Haben Sie weitere Fragen?
              </h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Unser Expertenteam steht Ihnen für individuelle Beratung zur Verfügung.
                Lassen Sie uns gemeinsam Ihre Solarlösung planen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleContactClick}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Kostenlose Beratung starten
                </button>

                <button className="border-2 border-gray-300 text-gray-700 font-bold py-4 px-8 rounded-2xl hover:border-green-300 hover:text-green-700 transition-all duration-300">
                  Projekt anfragen
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Kostenfrei
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unverbindlich
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Individuell
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
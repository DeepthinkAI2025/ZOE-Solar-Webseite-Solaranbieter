import React, { useState } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

interface FAQCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  faqs: FAQ[];
}

const ExtendedFAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const faqCategories: FAQCategory[] = [
    {
      id: "photovoltaik-basics",
      name: "Photovoltaik Grundlagen",
      description: "Alles über Photovoltaik-Technologie und Funktionsweise",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      faqs: [
        {
          id: "photovoltaik-funktionsweise",
          question: "Wie funktioniert eine Photovoltaik-Anlage?",
          answer: "Photovoltaik-Anlagen wandeln Sonnenlicht direkt in elektrischen Strom um. Die Solarzellen bestehen aus Silizium und erzeugen durch den photoelektrischen Effekt Gleichstrom. Ein Wechselrichter wandelt diesen Gleichstrom in Wechselstrom um, der dann im Haushalt genutzt oder ins Stromnetz eingespeist werden kann. Moderne Anlagen erreichen Wirkungsgrade von 18-22% und können je nach Ausrichtung und Neigung zwischen 800-1.200 kWh pro kWp und Jahr produzieren. Bei einer optimalen Südausrichtung mit 30-35° Neigung werden die besten Erträge erzielt.",
          category: "photovoltaik-basics",
          keywords: ["Photovoltaik Funktionsweise", "Wie funktioniert Solar", "Solarzellen Wirkungsgrad", "Photovoltaik Wechselrichter"]
        },
        {
          id: "pv-anlage-komponenten",
          question: "Welche Komponenten braucht eine PV-Anlage?",
          answer: "Eine vollständige PV-Anlage besteht aus: 1) Solarzellen/Module (verschiedene Zelltypen: monokristallin, polykristallin, dünnfilm), 2) Wechselrichter (String-Wechselrichter, Micro-Wechselrichter oder Hybrid-Wechselrichter), 3) DC/AC-Verkabelung und Schutzschalter, 4) Unterkonstruktion (Dachhaken, Schienen), 5) Optional: Batteriespeicher für Eigenverbrauchsoptimierung, 6) Monitoring-System für Ertragskontrolle, 7) Überspannungsschutz und Sicherheitsschalter. Moderne Komponenten haben Garantien von 20-25 Jahren für Module und 10-15 Jahren für Wechselrichter.",
          category: "photovoltaik-basics",
          keywords: ["PV Anlage Komponenten", "Solar Wechselrichter", "Photovoltaik Komponenten", "PV Verkabelung"]
        },
        {
          id: "modul-typen-vergleich",
          question: "Welcher Solarzellentyp ist der beste?",
          answer: "Die Wahl des Solarzellen-Typs hängt von den spezifischen Bedingungen ab: 1) Monokristalline Module (20-22% Wirkungsgrad) - optimal für begrenzte Flächen, hohe Effizienz, 2) Polykristalline Module (16-18% Wirkungsgrad) - kostengünstiger, etwas geringere Effizienz, 3) Dünnschicht-Module (10-13% Wirkungsgrad) - flexibel, bei diffusem Licht vorteilhaft, 4) PERC-Technologie (Passivated Emitter and Rear Cell) - höhere Effizienz durch bessere Lichtabsorption. Für deutsche Bedingungen sind monokristalline Module mit PERC-Technologie die beste Wahl für optimale Flächennutzung und langfristige Leistung.",
          category: "photovoltaik-basics",
          keywords: ["Monokristallin vs Polykristallin", "PERC Module", "Solarzellen Vergleich", "Beste Solar Module"]
        }
      ]
    },
    {
      id: "kosten-finanzierung",
      name: "Kosten & Finanzierung",
      description: "Preise, Förderung und Finanzierungsmöglichkeiten",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      faqs: [
        {
          id: "photovoltaik-kosten",
          question: "Was kostet eine Photovoltaik-Anlage 2025?",
          answer: "Die Kosten für PV-Anlagen liegen 2025 zwischen 1.100-1.800€ pro kWp Installation: 1) 8-10 kWp Einfamilienhaus: 10.000-18.000€ brutto, 2) 20-50 kWp Gewerbe: 25.000-90.000€, 3) 100+ kWp Großanlagen: ab 150.000€. Mit 30% Bundesförderung reduzieren sich die Netto-Kosten erheblich. Zusätzlich gibt es bis zu 5.000€ Speicher-Bonus. Die Amortisationszeit liegt bei 6-8 Jahren, danach läuft die Anlage kostenlos Strom. Förderfähige Komponenten: Module (60% Förderanteil), Wechselrichter (30%), Speicher (bis zu 5.000€).",
          category: "kosten-finanzierung",
          keywords: ["Photovoltaik Kosten 2025", "PV Anlage Preis", "Solar Anlage Kosten", "Bundesförderung Solar"]
        },
        {
          id: "foerderung-bafa-2025",
          question: "Welche Förderung gibt es 2025 für PV-Anlagen?",
          answer: "Aktuelle Förderung 2025: 1) Bundesförderung für effiziente Gebäude (BEG) - 30% der förderfähigen Kosten (mindestens 2.000€, max. 10.500€ für Privathaushalte), 2) Speicher-Bonus bis zu 5.000€ für Batteriespeicher, 3) Ergänzungsförderung für Agri-PV bis zu 50% der Investitionskosten, 4) Zusätzlich regionale Förderprogramme (je nach Bundesland), 5) Steuerliche Vorteile: 20 Jahre lineare Abschreibung, 0% Mehrwertsteuer für PV-Anlagen bis 30 kWp. Förderanträge müssen vor Projektbeginn gestellt werden. Regionale Förderung varies by state: Baden-Württemberg bis zu 10%, Bayern bis zu 15%, Brandenburg bis zu 20%.",
          category: "kosten-finanzierung",
          keywords: ["BEG Förderung 2025", "Photovoltaik Förderung", "Bafa Solar", "Speicher Förderung"]
        },
        {
          id: "finanzierung-leasing",
          question: "Wie kann ich eine PV-Anlage finanzieren?",
          answer: "Finanzierungsoptionen für PV-Anlagen: 1) Eigenkapital + Bundesförderung, 2) Bankkredit mit tilgungsfreier Zeit während Installation, 3) Leasing: keine Anzahlung, feste Monatsraten, 4) Pachtmodell: 0% Anzahlung, monatliche Pacht an ZOE Solar, 5) PPA (Power Purchase Agreement): 0% Anzahlung, günstiger Stromkauf, 6) Einmalzahlung mit Skonto. Empfehlung: Bei 0% Mehrwertsteuer (bis 30 kWp) und 30% Förderung lohnt sich häufig der direkte Kauf. Leasing/Pacht ist optimal für Unternehmen zur sofortigen Liquiditätsschonung und steuerlichen Absetzung der monatlichen Raten.",
          category: "kosten-finanzierung",
          keywords: ["PV Anlage Finanzierung", "Solar Leasing", "Photovoltaik Kredit", "PPA Solar"]
        },
        {
          id: "rendite-amortisation",
          question: "Wie hoch ist die Rendite einer PV-Anlage?",
          answer: "Moderne PV-Anlagen erzielen 12-16% jährliche Rendite: 1) Strompreisersparnis: 25-35ct/kWh gespart, 2) Einspeisevergütung: 8,2 ct/kWh (20 Jahre garantiert), 3) Inflationsschutz durch steigende Strompreise, 4) CO₂-Zertifikate: zusätzliche Einnahmen. Amortisationszeit: 6-8 Jahre je nach Größe, Standort und Finanzierungsmodell. Nach 20 Jahren Garantiezeit läuft die Anlage noch 10-15 Jahre kostenlos und erwirtschaftet reine Gewinne. Rechenbeispiel 8 kWp Anlage: 10.000€ Investition, 1.400€/Jahr Ersparnis = 14% Rendite, Amortisation nach 6,4 Jahren. Beste Rendite bei hohem Eigenverbrauch (70-80%).",
          category: "kosten-finanzierung",
          keywords: ["PV Anlage Rendite", "Photovoltaik Amortisation", "Solar Rendite", "PV ROI"]
        }
      ]
    },
    {
      id: "installation-wartung",
      name: "Installation & Wartung",
      description: "Planung, Installation und langfristige Wartung",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
      faqs: [
        {
          id: "dach-eignung",
          question: "Ist mein Dach für eine PV-Anlage geeignet?",
          answer: "Eignungskriterien für PV-Dächer: 1) Ausrichtung: Süden optimal, Südost/Südwest noch gut, Osten/Westen möglich mit Ertragseinbußen von 10-20%, 2) Neigungswinkel: 30-35° optimal für Deutschland, Flachdächer mit Aufständerung möglich, 3) Verschattung: keine ganztägige Verschattung durch Bäume/Chimneys, 4) Dachfläche: min. 40-50 m² für sinnvolle Anlage, 5) Traglast:ca. 15-25 kg/m² zusätzliche Last, 6) Dachmaterial: Ziegel, Blech, Schiefer geeignet, 7) Dachalter: bei älteren Dächern sanieren vor PV-Installation. Vor-Ort-Beratung mit Verschattungsanalyse und Flächenberechnung ist empfehlenswert. Kostenlose Dach-Check von ZOE Solar klärt alle Details.",
          category: "installation-wartung",
          keywords: ["PV Dach Eignung", "Photovoltaik Dach Check", "Verschattung Solar", "Dach Neigung PV"]
        },
        {
          id: "installation-dauer",
          question: "Wie lange dauert die PV-Installation?",
          answer: "PV-Installationszeit nach Projektstart: 1) Planung & Genehmigung: 2-4 Wochen, 2) Materiallieferung: 1-2 Wochen, 3) Installation: 1-3 Tage je nach Anlagengröße, 4) Anschluss & Inbetriebnahme: 1 Tag, 5) Zählertausch: 2-4 Wochen (Netzbetreiber), 6) Gesamtdauer: 6-10 Wochen von Beratung bis Stromproduktion. Einfamilienhaus (8 kWp): 1-2 Installationstage, Gewerbeanlage (100 kWp): 3-5 Tage. ZOE Solar koordiniert alle Schritte und übernimmt die komplette Abwicklung inkl. Anmeldung beim Netzbetreiber und Förderantrag. Bei Eillieferungen sind auch 4-5 Wochen Gesamtdauer möglich.",
          category: "installation-wartung",
          keywords: ["PV Installation Dauer", "Photovoltaik Einbauzeit", "Solar Anlage Montage", "PV Zeitplan"]
        },
        {
          id: "wartung-pflege",
          question: "Wie wartungsintensiv sind PV-Anlagen?",
          answer: "PV-Anlagen sind wartungsarm: 1) Automatische Selbstreinigung durch Regen, 2) Regelmäßige Sichtkontrolle: 1-2x jährlich, 3) Professionelle Reinigung: alle 2-3 Jahre je nach Standort, 4) Monitoring: automatische Fehlererkennung, 5) Leistungsgarantie: 80% nach 25 Jahren, 6) Wechselrichter-Service: alle 10-15 Jahre fällig. Kosten Wartung: 50-150€/Jahr je nach Anlage. Moderne Anlagen haben >99% Verfügbarkeit. Wichtige Wartungspunkte: Verschattung entfernen, Anlagenspannung prüfen, Einspeiseleistung dokumentieren. Garantieleistungen: 12 Jahre Produktgarantie auf Module, 25 Jahre Leistungsgarantie auf 80% Nennleistung.",
          category: "installation-wartung",
          keywords: ["PV Wartung", "Photovoltaik Pflege", "Solar Anlage Reinigung", "PV Garantie"]
        }
      ]
    },
    {
      id: "spezielle-anwendungen",
      name: "Spezielle Anwendungen",
      description: "Agri-PV, Gewerbe und Spezialanwendungen",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5-.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
        </svg>
      ),
      faqs: [
        {
          id: "agri-pv-landwirtschaft",
          question: "Was ist Agri-Photovoltaik für Landwirte?",
          answer: "Agri-Photovoltaik (Agri-PV) kombiniert Landwirtschaft und Solarstromproduktion auf derselben Fläche: 1) Hochgeständer-Module über Kulturpflanzen, 2) Doppelte Flächennutzung: Agrar + Energieproduktion, 3) Ertragssteigerung: 10-25% durch optimales Mikroklima, 4) Schutz vor Hagel, Frost und extremer Hitze, 5) Förderung: bis zu 50% für Agri-PV Projekte, 6) Gute Stromerträge: 800-1.000 kWh/kWp durch erhöhte Module. Anwendung: Beerenobst, Gemüse, Getreide, Weinbau. Agri-PV ermöglicht 160% Flächennutzung und zusätzliche Einnahmequellen für Landwirte. Special module designs für Landwirtschaft mit bee-friendly features.",
          category: "spezielle-anwendungen",
          keywords: ["Agri Photovoltaik", "Agrar PV", "Landwirtschaft Solar", "Freiflächen Photovoltaik"]
        },
        {
          id: "gewerbe-industrie",
          question: "Lohnt sich PV für Gewerbe und Industrie?",
          answer: "Gewerbe-PV ist sehr rentabel: 1) Hoher Eigenverbrauch: 60-85% durch Produktionszeiten tagsüber, 2) Steuervorteile: 20 Jahre lineare Abschreibung, 0% MwSt bei Kleinunternehmerregelung, 3) Ersparnis: 8-12ct/kWh beim Bezug, 4) Image-Vorteil: Nachhaltigkeitsreporting und CSR, 5) Dachflächen oft untergenutzt, 6) Größenvorteile: ab 100 kWp deutlich günstigere Kosten pro kWp. Gewerbeanlagen ab 50 kWp amortisieren sich in 5-7 Jahren. Zusätzlich: RCP (Renewable Energy Certificates) für nachhaltige Produkte. Moderne Gewerbeanlagen erreichen 15%+ Rendite durch hohe Eigenverbrauchsquoten und steuerliche Optimierung.",
          category: "spezielle-anwendungen",
          keywords: ["Gewerbe Photovoltaik", "Industrie Solar", "Betriebsstrom PV", "Gewerbeanlage Solar"]
        },
        {
          id: "batteriespeicher",
          question: "Lohnt sich ein Batteriespeicher für PV?",
          answer: "Batteriespeicher erhöhen Eigenverbrauch von 30% auf 60-80%: 1) Speicher-Bonus: bis zu 5.000€ Förderung, 2) Autarkie: bis zu 80% Selbstversorgung möglich, 3) Blackout-Schutz: Notstrom bei Stromausfall, 4) Zeitverschiebung: Strom teuer kaufen, günstig produzieren, 5) Batterietypen: Lithium-Ion (10-15 Jahre Lebensdauer), 6) Dimensionierung: 1-1,5 kWh pro kWp Anlagengröße. Beispiel: 8 kWp Anlage + 10 kWh Speicher = 85% Eigenverbrauch. Ohne Speicher: 2.400€/Jahr Ersparnis, mit Speicher: 3.100€/Jahr. Speicher amortisieren sich in 8-12 Jahren, danach reiner Gewinn.",
          category: "spezielle-anwendungen",
          keywords: ["PV Batteriespeicher", "Photovoltaik Speicher", "Solar Speicher Förderung", "Tesla Powerwall"]
        }
      ]
    }
  ];

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-bold text-green-600 uppercase tracking-wider">Häufige Fragen</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
            Alles was Sie über Photovoltaik wissen müssen
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Hier finden Sie ausführliche Antworten auf alle wichtigen Fragen rund um Photovoltaik, 
            von den Grundlagen bis zu speziellen Anwendungen für verschiedene Zielgruppen.
          </p>
        </div>

        {/* FAQ Navigation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {faqCategories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(index)}
              className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                activeCategory === index
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  activeCategory === index 
                    ? 'bg-white/20' 
                    : 'bg-green-100'
                }`}>
                  <div className={activeCategory === index ? 'text-white' : 'text-green-600'}>
                    {category.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className={`text-sm ${
                    activeCategory === index ? 'text-green-100' : 'text-slate-500'
                  }`}>
                    {category.faqs.length} Fragen
                  </p>
                </div>
              </div>
              <p className={`text-sm ${
                activeCategory === index ? 'text-green-100' : 'text-slate-600'
              }`}>
                {category.description}
              </p>
            </button>
          ))}
        </div>

        {/* Active FAQ Category */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-2">
              {faqCategories[activeCategory].name}
            </h3>
            <p className="text-green-100 text-lg">
              {faqCategories[activeCategory].description}
            </p>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              {faqCategories[activeCategory].faqs.map((faq) => (
                <div key={faq.id} className="border border-slate-200 rounded-xl">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-6 text-left hover:bg-slate-50 transition-colors duration-200 flex justify-between items-center"
                  >
                    <h4 className="text-lg font-semibold text-slate-900 pr-4">
                      {faq.question}
                    </h4>
                    <div className={`transform transition-transform duration-200 ${
                      openFAQ === faq.id ? 'rotate-180' : ''
                    }`}>
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {openFAQ === faq.id && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-slate-100 pt-6">
                        <p className="text-slate-700 leading-relaxed mb-4">
                          {faq.answer}
                        </p>
                        
                        {/* Keywords */}
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-slate-500 font-medium mr-2">Keywords:</span>
                          {faq.keywords.map((keyword, index) => (
                            <span 
                              key={index}
                              className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Statistics */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
            <div className="text-slate-600">Häufige Fragen beantwortet</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-slate-600">Kundenzufriedenheit</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
            <div className="text-slate-600">FAQ Hilfs-Score</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">24h</div>
            <div className="text-slate-600">Antwortzeit</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            Weitere Fragen? Lassen Sie sich beraten!
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Unsere Experten beantworten gerne alle Ihre Fragen rund um Photovoltaik 
            und finden die optimale Lösung für Ihre spezifischen Anforderungen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1">
              Persönliche Beratung anfragen
            </button>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              FAQ-Dokumentation downloaden
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtendedFAQSection;
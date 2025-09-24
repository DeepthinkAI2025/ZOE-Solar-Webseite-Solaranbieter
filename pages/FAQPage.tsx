import React, { useState, useMemo, useEffect } from 'react';
import { Page } from '../types';
import GlossarLink from '../components/GlossarLink';
import { glossarData } from '../data/glossarData';

type FaqCategory = 'Grundlagen' | 'Wirtschaftlichkeit' | 'Förderung' | 'Technik' | 'Installation' | 'Betrieb' | 'ZOE Solar Vorteile' | 'Anbieterwahl';

interface FaqItemData {
  category: FaqCategory;
  question: string;
  answer: React.ReactNode;
}

const FAQHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="faq-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Häufig gestellte Fragen.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Antworten auf alle Ihre Fragen. Umfassend, detailliert und transparent – von der ersten Idee bis zum laufenden Betrieb Ihrer Anlage.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('faq-list')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Zu den Antworten
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <div className="floating-hero-img faq-hero img-1 bg-green-500 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop" alt="Beratung" className="floating-hero-img faq-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1517436026-163580462p8?q=80&w=800&auto=format&fit=crop" alt="Wissensbasis" className="floating-hero-img faq-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Helper to create URL-friendly slugs from terms
const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s*\(.*\)\s*/g, '') // Remove content in parentheses and surrounding spaces
        .replace(/\s+/g, '-') 
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');

// Component to create links to the glossary
const CategoryIcon: React.FC<{ category: FaqCategory }> = ({ category }) => {
    const className = "w-7 h-7 text-slate-500 group-hover:text-green-600 group-data-[active=true]:text-green-600 transition-colors";
    switch (category) {
        case 'Grundlagen': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082a.75.75 0 00-.814.814c.032.249.059.5.082.75v5.714M9.75 3.104a2.25 2.25 0 00-2.659-1.591L5 3.104m6.375 7.375l.47-2.093a.75.75 0 00-.216-.814l-2.093-.47a.75.75 0 00-.814.216l-2.093.47a.75.75 0 00.216.814l.47 2.093a.75.75 0 00.814-.216l2.093-.47a.75.75 0 00.216-.814zm-3.47-2.093a.75.75 0 00-.216.814l.47 2.093a.75.75 0 00.814-.216l2.093-.47a.75.75 0 00.216-.814l-.47-2.093a.75.75 0 00-.814.216l-2.093.47z" /></svg>;
        case 'Wirtschaftlichkeit': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;
        case 'Förderung': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
        case 'Technik': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
        case 'Installation': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 000-4.773L6.75 3.75l-4.773 0a3.375 3.375 0 00-4.773 4.773l2.472 2.472" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 1.5l6 6" /></svg>;
        case 'Betrieb': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15h.008" /></svg>;
        case 'ZOE Solar Vorteile': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>;
        case 'Anbieterwahl': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15h.008" /></svg>;
        default: return null;
    }
}

const FaqItem: React.FC<{ item: FaqItemData; isOpen: boolean; onClick: () => void, highlight: string }> = ({ item, isOpen, onClick, highlight }) => {
  
  const highlightText = (node: React.ReactNode, highlightStr: string): React.ReactNode => {
    if (!highlightStr.trim()) {
      return node;
    }

    if (typeof node === 'string') {
        const regex = new RegExp(`(${highlightStr})`, 'gi');
        const parts = node.split(regex);
        return (
          <>
            {parts.map((part, index) =>
              part.toLowerCase() === highlightStr.toLowerCase() ? (
                <span key={index} className="bg-green-100 text-green-800 font-semibold px-1 rounded">{part}</span>
              ) : (
                part
              )
            )}
          </>
        );
    }
    
    if (Array.isArray(node)) {
      return node.map((child, index) => <React.Fragment key={index}>{highlightText(child, highlightStr)}</React.Fragment>);
    }

    if (React.isValidElement(node) && node.props.children) {
      return React.cloneElement(node, { ...node.props, children: highlightText(node.props.children, highlightStr) });
    }

    return node;
  };

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-start text-left py-6 px-2 focus:outline-none group"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-slate-800 group-hover:text-green-600 transition-colors pr-4">{highlightText(item.question, highlight)}</span>
        <div className="flex-shrink-0 ml-4 mt-1">
          <svg className={`h-6 w-6 text-slate-400 transform transition-transform duration-300 group-hover:text-green-600 ${isOpen ? 'rotate-180 text-green-600' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
      >
        <div className="pb-6 px-2 text-slate-600 prose-custom max-w-none">
            {highlightText(item.answer, highlight)}
        </div>
      </div>
    </div>
  );
};

// Helper function to extract searchable text from React.ReactNode
const extractTextFromReactNode = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join(' ');
  }
  if (React.isValidElement(node)) {
    // Special handling for GlossarLink to also search its 'term' prop
    if (node.type === GlossarLink) {
      return `${node.props.term} ${extractTextFromReactNode(node.props.children)}`;
    }
    if (node.props.children) {
      return extractTextFromReactNode(node.props.children);
    }
  }
  return '';
};


const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('Anbieterwahl');

  const openChat = () => {
    document.dispatchEvent(new CustomEvent('open-chat'));
  };

  const openPopup = (url: string) => {
    const width = 1024;
    const height = 768;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(safeUrl, 'Popup', `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`);
  };

  const faqData: FaqItemData[] = [
    // Grundlagen & Planung
    {
      category: 'Grundlagen',
      question: 'Wie groß muss eine Fläche für eine gewerbliche Anlage sein?',
      answer: <>Grundsätzlich gilt: je größer, desto rentabler. Wir spezialisieren uns auf <GlossarLink term="Freiflächenanlage">Freiflächen</GlossarLink> ab 1 <GlossarLink term="Hektar (ha)">Hektar</GlossarLink> (10.000 m²). Für <GlossarLink term="Dachanlage">Dachanlagen</GlossarLink> sind Flächen ab ca. 500 m² interessant. Kontaktieren Sie uns für eine kostenlose Ersteinschätzung – oft sind auch Flächen geeignet, die man zunächst nicht im Blick hat.</>,
    },
     {
      category: 'Grundlagen',
      question: 'Ist mein Dach für eine PV-Anlage geeignet (Statik, Ausrichtung)?',
      answer: <>Die meisten Gewerbedächer sind ideal für PV-Anlagen. Wir führen im Rahmen der Detailplanung eine genaue Prüfung der <GlossarLink term="Statik" /> , der Dacheindeckung und der <GlossarLink term="Azimut">Ausrichtung</GlossarLink> durch. Eine Südausrichtung ist optimal, aber auch <GlossarLink term="Ost-West-Anlage">Ost-West-Anlagen</GlossarLink> können sehr rentabel sein, da sie die Stromproduktion gleichmäßiger über den Tag verteilen.</>,
    },
    {
      category: 'Grundlagen',
      question: 'Wie lange dauert der Prozess von der Planung bis zur Inbetriebnahme?',
      answer: <>Die Dauer kann variieren, abhängig von der Komplexität und den <GlossarLink term="Genehmigungsverfahren" />. Im Durchschnitt können Sie von der ersten Kontaktaufnahme bis zur stromproduzierenden Anlage mit 6 bis 12 Monaten rechnen. Unser "Alles aus einer Hand"-Prinzip beschleunigt den Prozess erheblich.</>,
    },
    {
      category: 'Grundlagen',
      question: 'Was ist der Unterschied zwischen kWp und kWh?',
      answer: <><GlossarLink term="Kilowatt-Peak (kWp)">Kilowatt-Peak (kWp)</GlossarLink> ist die Maßeinheit für die <GlossarLink term="Nennleistung">Spitzenleistung</GlossarLink> einer Solaranlage unter Standard-Testbedingungen. Es beschreibt also das Potenzial. <GlossarLink term="Kilowattstunde (kWh)">Kilowattstunde (kWh)</GlossarLink> ist die Maßeinheit für die tatsächlich erzeugte oder verbrauchte Energie. Vereinfacht gesagt: kWp ist die "PS-Zahl" des Motors, kWh ist die "gefahrene Strecke".</>,
    },
    
    // Wirtschaftlichkeit & Finanzen
    {
      category: 'Wirtschaftlichkeit',
      question: 'Wann amortisiert sich eine gewerbliche PV-Anlage?',
      answer: <>Die <GlossarLink term="Amortisationszeit" /> hängt von der Anlagengröße, Ihrer <GlossarLink term="Eigenverbrauch">Eigenverbrauchsquote</GlossarLink> und der Strompreisentwicklung ab. Dank gesunkener Anlagenpreise und hoher Stromkosten liegen die Amortisationszeiten für gewerbliche Anlagen oft nur noch bei 6 bis 10 Jahren – bei einer technischen <GlossarLink term="Lebensdauer" /> von über 30 Jahren. Damit ist die Investition nicht nur ökologisch, sondern auch ökonomisch extrem nachhaltig.</>,
    },
    {
      category: 'Wirtschaftlichkeit',
      question: 'Wie beeinflusst der Eigenverbrauch die Wirtschaftlichkeit?',
      answer: <>Ganz erheblich. Jede <GlossarLink term="Kilowattstunde (kWh)">Kilowattstunde (kWh)</GlossarLink>, die Sie selbst verbrauchen (<GlossarLink term="Eigenverbrauch" />), spart Ihnen den teuren Zukauf von <GlossarLink term="Netzstrom" /> (z.B. 28 ct/kWh). Jede kWh, die Sie hingegen einspeisen, bringt Ihnen die geringere <GlossarLink term="Einspeisevergütung" /> (z.B. 8 ct/kWh). Ein hoher Eigenverbrauch ist also der größte Hebel für eine schnelle <GlossarLink term="Amortisationszeit">Amortisation</GlossarLink>. Durch intelligente Steuerung und die Kombination mit <GlossarLink term="Batteriespeicher">Speichern</GlossarLink> oder <GlossarLink term="Ladeinfrastruktur">Ladeinfrastruktur</GlossarLink> kann die Eigenverbrauchsquote oft auf über 70% gesteigert werden.</>,
    },
    {
        category: 'Wirtschaftlichkeit',
        question: 'Was ist der Unterschied zwischen Direktvermarktung und EEG-Vergütung?',
        answer: <>Die <GlossarLink term="Einspeisevergütung" /> ist ein staatlich festgelegter, fester Preis, den Sie für jede eingespeiste Kilowattstunde über 20 Jahre erhalten. Bei der <GlossarLink term="Direktvermarktung" /> wird Ihr Strom direkt an der Strombörse verkauft. Der Preis ist variabel, liegt aber oft über der <GlossarLink term="EEG (Erneuerbare-Energien-Gesetz)">EEG-Vergütung</GlossarLink>. Ab einer bestimmten Anlagengröße (aktuell >100 <GlossarLink term="Kilowatt-Peak (kWp)">kWp</GlossarLink>) ist die Direktvermarktung verpflichtend. Wir beraten Sie, welches Modell für Sie am profitabelsten ist.</>,
    },
    {
      category: 'Wirtschaftlichkeit',
      question: 'Welche Vorteile bietet ein Batteriespeicher für mein Unternehmen?',
      answer: <>Ein <GlossarLink term="Batteriespeicher" /> maximiert die <GlossarLink term="Rendite">Rentabilität</GlossarLink> Ihrer PV-Anlage auf zwei Wegen: 1. **<GlossarLink term="Eigenverbrauch" />soptimierung:** Überschüssiger <GlossarLink term="Solarstrom" /> vom Tag wird gespeichert und kann nachts oder in produktionsschwachen Zeiten genutzt werden. Das senkt den teuren <GlossarLink term="Netzstrom">Netzbezug</GlossarLink>. 2. **<GlossarLink term="Lastspitzenkappung (Peak Shaving)">Lastspitzenkappung (Peak Shaving)</GlossarLink>:** Viele Gewerbebetriebe zahlen hohe Netzentgelte, die sich an der höchsten kurzzeitigen Leistungsspitze (Peak) im Jahr orientieren. Ein Batteriespeicher kann diese Peaks abfangen ('shaven'), indem er bei hohem Bedarf blitzschnell Energie bereitstellt. Das kann die Stromrechnung drastisch senken.</>,
    },
    {
      category: 'Wirtschaftlichkeit',
      question: 'Lohnen sich Ladestationen in Kombination mit einer PV-Anlage?',
      answer: <>Ja, absolut. <GlossarLink term="Ladeinfrastruktur">Ladestationen</GlossarLink> sind die perfekte Ergänzung. Sie erhöhen den <GlossarLink term="Eigenverbrauch" /> massiv, da der Fuhrpark oder die Fahrzeuge von Mitarbeitern und Kunden mit günstigem <GlossarLink term="Solarstrom" /> 'betankt' werden. Das senkt nicht nur die Betriebskosten Ihrer Flotte, sondern positioniert Ihr Unternehmen als modern und nachhaltig, was wiederum die Kunden- und Mitarbeiterbindung stärkt.</>,
    },
    {
      category: 'Wirtschaftlichkeit',
      question: 'Was ist ein PPA (Power Purchase Agreement)?',
      answer: <>Ein <GlossarLink term="Power Purchase Agreement (PPA)">Power Purchase Agreement</GlossarLink> ist ein langfristiger Stromliefervertrag zwischen einem Stromerzeuger (Ihnen) und einem Abnehmer (z.B. ein großes Unternehmen oder ein Energiehändler). Anstatt der <GlossarLink term="EEG (Erneuerbare-Energien-Gesetz)">EEG-Vergütung</GlossarLink> erhalten Sie einen vertraglich festgelegten Preis für Ihren Strom, oft über 10-15 Jahre. Das bietet hohe Planungssicherheit.</>,
    },
      
    // Förderung
    {
      category: 'Förderung',
      question: 'Wie finde ich die passende Förderung für mein Projekt?',
      answer: (
          <>
              <p>Die Förderlandschaft ist komplex und ändert sich ständig. Um Ihnen die Suche zu erleichtern, empfehlen wir den digitalen Förderassistenten unseres Partners <strong>energie Förder-Finder</strong>.</p>
              <p>Dort können Sie mit wenigen Klicks alle relevanten Bundes-, Landes- und Kommunalförderungen für Ihr spezifisches Vorhaben finden.</p>
              <button
                  onClick={() => openPopup('www.eförderfinder.de')}
                  className="mt-4 inline-flex items-center gap-2 bg-white border border-green-500 text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-green-50 transition-colors duration-200 shadow-sm"
              >
                  Zum Förderassistenten auf eförderfinder.de
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </button>
          </>
      ),
    },
    {
      category: 'Förderung',
      question: 'Welche staatlichen Förderungen gibt es für gewerbliche PV-Anlagen?',
      answer: <>Unternehmen profitieren von diversen Programmen wie zinsgünstigen <GlossarLink term="KfW (Kreditanstalt für Wiederaufbau)">KfW-Krediten</GlossarLink>, Investitionszuschüssen (z.B. über die <GlossarLink term="BAFA (Bundesamt für Wirtschaft und Ausfuhrkontrolle)">BAFA</GlossarLink>) und Sonderabschreibungen. Auch die <GlossarLink term="EEG (Erneuerbare-Energien-Gesetz)">EEG</GlossarLink>-<GlossarLink term="Einspeisevergütung" /> ist eine Form der Förderung. Wir prüfen für Ihr Projekt alle verfügbaren Bundes- und Landesprogramme und unterstützen Sie bei der Antragsstellung.</>,
    },
    {
      category: 'Förderung',
      question: 'Kann ich die Investitionskosten steuerlich absetzen?',
      answer: <>Ja, die Investition in eine PV-Anlage kann über die <GlossarLink term="Lebensdauer">Nutzungsdauer</GlossarLink> abgeschrieben werden (lineare <GlossarLink term="Amortisationszeit">AfA</GlossarLink>). Zusätzlich gibt es Möglichkeiten zur Sonderabschreibung und den <GlossarLink term="Investitionsabzugsbetrag (IAB)">Investitionsabzugsbetrag</GlossarLink>, die Ihre Steuerlast in den Anfangsjahren erheblich senken können. Wir stellen Ihnen alle nötigen technischen Unterlagen für Ihren Steuerberater zur Verfügung.</>,
    },
  
    // Technik
    {
      category: 'Technik',
      question: 'Was bedeutet N-Type vs. P-Type bei Solarmodulen?',
      answer: <>Dies bezieht sich auf die Dotierung der Silizium-Wafer. <GlossarLink term="N-Typ-Zellen">N-Type-Zellen</GlossarLink> (z.B. mit Phosphor dotiert) sind technologisch fortschrittlicher. Sie haben eine höhere Effizienz, eine geringere lichtinduzierte <GlossarLink term="Degradation" /> (<GlossarLink term="LID (Lichtinduzierte Degradation)">LID</GlossarLink>) und einen besseren <GlossarLink term="Temperaturkoeffizient" />. Das bedeutet: Sie verlieren über die Jahre weniger an Leistung und produzieren bei Hitze mehr Strom. Wir setzen bevorzugt auf die zukunftssichere N-Type-Technologie.</>,
    },
    {
      category: 'Technik',
      question: 'Wie lange halten Solarmodule und Wechselrichter?',
      answer: <>Hochwertige <GlossarLink term="Solarmodul">Solarmodule</GlossarLink> haben eine <GlossarLink term="Lebensdauer" /> von 30 bis 40 Jahren und kommen mit einer <GlossarLink term="Garantie (Produkt/Leistung)">Leistungsgarantie</GlossarLink> von 25-30 Jahren. Moderne <GlossarLink term="Wechselrichter" /> sind auf eine Lebensdauer von ca. 15-20 Jahren ausgelegt und müssen im Lebenszyklus der Anlage eventuell einmal getauscht werden. Wir setzen ausschließlich auf Komponenten mit branchenführenden Garantien.</>,
    },
    {
      category: 'Technik',
      question: 'Was passiert bei einem Stromausfall?',
      answer: <>Standard-<GlossarLink term="Photovoltaik (PV)">PV-Anlagen</GlossarLink> schalten sich bei einem <GlossarLink term="Blackout">Stromausfall</GlossarLink> aus Sicherheitsgründen ab. In Kombination mit einem <GlossarLink term="Batteriespeicher" /> kann jedoch eine <GlossarLink term="Notstrom">Not- oder Ersatzstromversorgung</GlossarLink> realisiert werden, die im Extremfall auch den Betrieb als autarke <GlossarLink term="Inselanlage (Off-Grid)">Inselanlage</GlossarLink> ermöglicht. Damit können ausgewählte, wichtige Verbraucher in Ihrem Betrieb auch bei einem Netzausfall weiterversorgt werden.</>,
    },
  
    // Installation
    {
      category: 'Installation',
      question: 'Beeinträchtigt die Installation meinen laufenden Betrieb?',
      answer: 'Wir planen die Installation so, dass Ihr Betriebsablauf so wenig wie möglich gestört wird. Unsere erfahrenen Projektleiter stimmen alle Schritte eng mit Ihnen ab. Die finalen Anschlussarbeiten erfordern in der Regel nur eine sehr kurze, geplante Betriebsunterbrechung.',
    },
    {
      category: 'Installation',
      question: 'Wer führt die Installation durch?',
      answer: <>Ein entscheidender ZOE Solar Vorteil: Wir setzen keine <GlossarLink term="Subunternehmer" /> ein. Ihr Projekt wird ausschließlich von unseren festangestellten, <GlossarLink term="IHK-zertifiziert">IHK-zertifizierten</GlossarLink> Fachexperten umgesetzt. Das garantiert höchste Qualität, direkte Kommunikation und volle Verantwortung.</>,
    },
    {
      category: 'Installation',
      question: 'Wie lange dauert die eigentliche Montage vor Ort?',
      answer: <>Die <GlossarLink term="Montage">Montagedauer</GlossarLink> vor Ort hängt von der Anlagengröße ab. Für eine mittelgroße gewerbliche Dachanlage (ca. 500 <GlossarLink term="Kilowatt-Peak (kWp)">kWp</GlossarLink>) können Sie mit einer <GlossarLink term="Installationszeit">Installationszeit</GlossarLink> von etwa 2 bis 4 Wochen rechnen. Einen detaillierten Zeitplan erhalten Sie von uns immer im Voraus.</>,
    },
    
    // Betrieb & Service
    {
      category: 'Betrieb',
      question: 'Übernimmt ZOE Solar auch den ganzen bürokratischen Aufwand?',
      answer: <>Ja, absolut. Das ist ein Kernbestandteil unseres Services. Wir kümmern uns um alle Anträge, Genehmigungen und die komplette Kommunikation mit <GlossarLink term="Netzbetreiber">Netzbetreibern</GlossarLink> und Behörden. Sie können sich auf Ihr Kerngeschäft konzentrieren.</>,
    },
    {
      category: 'Betrieb',
      question: 'Wie kann ich die Leistung meiner Anlage überwachen?',
      answer: <>Alle von uns installierten Anlagen verfügen über ein modernes <GlossarLink term="Monitoring">Online-Monitoring-System</GlossarLink>. Sie können jederzeit per App oder Webportal alle relevanten Leistungsdaten Ihrer Anlage in Echtzeit einsehen – von der Gesamtproduktion bis hin zur Leistung einzelner Teilbereiche. So haben Sie die volle Transparenz über Ihr Investment.</>,
    },
    {
      category: 'Betrieb',
      question: 'Was passiert bei einem Defekt oder einer Störung?',
      answer: <>Durch unser 24/7-<GlossarLink term="Monitoring" /> erkennen wir die meisten Störungen, bevor Sie sie überhaupt bemerken. Unser Service-Team wird automatisch informiert und nimmt umgehend Kontakt mit Ihnen auf, um das Problem schnellstmöglich zu beheben. Als regionaler Partner sind wir schnell vor Ort.</>,
    },
    {
      category: 'Betrieb',
      question: 'Welche Garantien gibt es auf die Komponenten und die Installation?',
      answer: <>Sie profitieren von umfassenden Garantien. Die Hersteller geben in der Regel 25-30 Jahre <GlossarLink term="Garantie (Produkt/Leistung)">Leistungsgarantie</GlossarLink> auf die <GlossarLink term="Solarmodul">Module</GlossarLink> und 5-10 Jahre <GlossarLink term="Garantie (Produkt/Leistung)">Produktgarantie</GlossarLink> auf die <GlossarLink term="Wechselrichter" /> (oft erweiterbar). ZOE Solar gibt Ihnen zusätzlich eine 5-jährige <GlossarLink term="Gewährleistung" /> auf die gesamte <GlossarLink term="Installation" />. Ihre Investition ist also bestens abgesichert.</>,
    },
    {
      category: 'Betrieb',
      question: 'Wie bin ich gegen Ertragsausfälle oder Schäden versichert?',
      answer: <>Wir bieten Ihnen optional umfassende <GlossarLink term="Versicherung">Versicherungspakete</GlossarLink> an. Diese decken nicht nur Schäden durch Wetterereignisse oder Vandalismus ab, sondern können auch <GlossarLink term="Ertragsausfall">Ertragsausfälle</GlossarLink> durch technische Störungen kompensieren. So sichern Sie Ihre Investition und Ihre Einnahmen gegen unvorhergesehene Ereignisse ab.</>,
    },
  
    // ZOE Solar Vorteile
    {
      category: 'ZOE Solar Vorteile',
      question: 'Was unterscheidet ZOE Solar von anderen Anbietern?',
      answer: <>Drei wesentliche Punkte: 1. Wir sind <GlossarLink term="herstellerunabhängig">herstellerunabhängig</GlossarLink> und wählen immer die beste Technik für *Ihre* maximale <GlossarLink term="Rendite">Rendite</GlossarLink> aus. 2. Wir arbeiten ausschließlich mit eigenen, zertifizierten Expertenteams, ohne <GlossarLink term="Subunternehmer" />. 3. Wir sind Ihr einziger Ansprechpartner für alles – von der Planung bis zum <GlossarLink term="Netzanschluss" />.</>,
    },
    {
      category: 'ZOE Solar Vorteile',
      question: 'Warum ist die Herstellerunabhängigkeit so wichtig?',
      answer: <>Unsere einzige Verpflichtung ist die maximale <GlossarLink term="Rendite">Rendite</GlossarLink> für Sie. Als unabhängiger Anbieter sind wir nicht an die Produkte oder Margen eines einzelnen Herstellers gebunden. Wir können aus dem gesamten Weltmarkt die technologisch führenden und für Ihr Projekt am besten geeigneten Komponenten auswählen. Das garantiert Ihnen die bestmögliche Performance.</>,
    },
    
    // Anbieterwahl
    {
      category: 'Anbieterwahl',
      question: 'Wie schneidet ZOE Solar im Anbietervergleich ab?',
      answer: (
          <>
              <p>Wir sind stolz auf unsere hohen Qualitätsstandards und die Zufriedenheit unserer Kunden. Diese wird uns auch von unabhängiger Seite bestätigt.</p>
              <p>Das Portal <strong>PhotovoltaikTest.de</strong> hat ZOE Solar nach umfangreichen Tests als <strong>Testsieger und besten Anbieter für gewerbliche Solaranlagen 2025</strong> ausgezeichnet. Besonders hervorgehoben wurden unsere <GlossarLink term="herstellerunabhängig">Herstellerunabhängigkeit</GlossarLink>, die ausschließliche Verwendung eigener Fachkräfte und die transparente Projektbegleitung.</p>
              <button
                  onClick={() => openPopup('www.photovoltaiktest.de')}
                  className="mt-4 inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                  Zum Testbericht auf PhotovoltaikTest.de
              </button>
          </>
      ),
    },
    {
      category: 'Anbieterwahl',
      question: 'Worauf sollte ich bei der Auswahl eines Solaranbieters achten?',
      answer: <>Achten Sie auf Unabhängigkeit: Anbieter, die an Marken gebunden sind, bieten nicht immer die beste Technik. Fragen Sie explizit, ob <GlossarLink term="Subunternehmer" /> eingesetzt werden – das ist oft ein Qualitätsrisiko. Bestehen Sie zudem auf einem transparenten <GlossarLink term="Festpreisangebot" />, um versteckte Kosten zu vermeiden.</>,
    },
    {
      category: 'Anbieterwahl',
      question: 'Was sind typische "rote Flaggen" bei Angeboten?',
      answer: <>Vorsicht bei unrealistisch günstigen Preisen, die oft mit minderwertigen Komponenten oder späteren Nachforderungen einhergehen. Vage Aussagen über Montageteams (statt der Bestätigung von festangestellten Fachkräften) sind ein Warnsignal. Auch eine fehlende, detaillierte <GlossarLink term="Ertragsprognose" /> und Komponentenspezifikation sollten Sie skeptisch machen.</>,
    },
  ];

  const categories: FaqCategory[] = ['Anbieterwahl', 'Grundlagen', 'Wirtschaftlichkeit', 'Förderung', 'Technik', 'Installation', 'Betrieb', 'ZOE Solar Vorteile'];

  const filteredFaqs = useMemo(() => {
    const searchIsActive = searchTerm.trim().length > 0;
    
    if (searchIsActive) {
        return faqData.filter(item => {
            const questionMatch = item.question.toLowerCase().includes(searchTerm.toLowerCase());
            const answerText = extractTextFromReactNode(item.answer);
            const answerMatch = answerText.toLowerCase().includes(searchTerm.toLowerCase());
            return questionMatch || answerMatch;
        });
    }
    return faqData.filter(item => item.category === activeCategory);
  }, [activeCategory, searchTerm]);
  
  const handleCategoryClick = (category: FaqCategory) => {
      setSearchTerm(''); 
      setActiveCategory(category);
  }

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (filteredFaqs.length > 0) {
      setOpenIndex(0);
    } else {
      setOpenIndex(null);
    }
  }, [activeCategory, searchTerm, filteredFaqs.length]);

  const handleHeroCta = (anchor?: string) => {
      if (anchor) {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    <>
    <FAQHero onCtaClick={handleHeroCta} />
    <section id="faq-list" className="py-20 bg-slate-50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto bg-white p-4 sm:p-8 rounded-2xl shadow-2xl border border-slate-200">
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Left Column: Categories */}
                <aside className="lg:col-span-1 lg:border-r lg:pr-8 border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 hidden lg:block">Kategorien</h3>
                    <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
                        {categories.map(category => (
                             <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                data-active={activeCategory === category && !searchTerm.trim()}
                                className="group w-full flex-shrink-0 lg:w-auto flex items-center gap-4 p-4 rounded-lg text-left transition-all duration-200 hover:bg-slate-100 hover:text-green-600 data-[active=true]:bg-green-50 data-[active=true]:shadow-inner data-[active=true]:text-green-700"
                            >
                                <CategoryIcon category={category} />
                                <span className="font-semibold text-slate-700 group-hover:text-green-600 group-data-[active=true]:text-green-700 transition-colors">
                                    {category === 'Grundlagen' ? 'Planung' : category}
                                </span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Right Column: Content */}
                <main className="lg:col-span-3">
                    <div className="relative mb-6">
                        <input 
                            type="text"
                            placeholder="Stichwort eingeben (z.B. Förderung, Garantie)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow text-lg bg-white text-slate-800 placeholder-slate-400"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div>
                      {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((item, index) => (
                          <FaqItem
                            key={`${item.question}-${index}`}
                            item={item}
                            isOpen={openIndex === index}
                            onClick={() => handleClick(index)}
                            highlight={searchTerm}
                          />
                        ))
                      ) : (
                        <div className="text-center py-16 px-6 bg-slate-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="mt-4 text-xl font-semibold text-slate-700">Keine Ergebnisse gefunden</h3>
                            <p className="text-slate-500 mt-2">
                                {searchTerm 
                                    ? `Für Ihre Suche nach "${searchTerm}" konnten wir leider keine passende Antwort finden.`
                                    : `Für die Kategorie "${activeCategory}" sind keine Einträge vorhanden.`
                                }
                            </p>
                        </div>
                      )}
                    </div>
                </main>
            </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto mt-16">
            <div className="relative bg-slate-800 rounded-3xl overflow-hidden border border-slate-700">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/30 to-slate-800 opacity-50"></div>
                <div className="relative grid lg:grid-cols-5 gap-12 items-center p-8 md:p-12">
                    {/* Left Column: Text Content */}
                    <div className="lg:col-span-3">
                        <h3 className="text-4xl font-bold text-white leading-tight">Ihre Frage wurde nicht beantwortet?</h3>
                        <p className="text-slate-300 mt-4 max-w-lg">
                            Kein Problem. Jedes Projekt ist einzigartig. Unser Expertenteam steht Ihnen für Ihre spezifischen Fragen gerne persönlich zur Verfügung und erstellt eine individuelle Analyse für Sie.
                        </p>
                        <ul className="mt-8 space-y-4">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-slate-200">Kostenlose und unverbindliche Potenzialanalyse</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-slate-200">Antworten direkt von unseren Fachingenieuren</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-slate-200">Individuelle Beratung für Ihr spezifisches Projekt</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Column: Image and CTAs */}
                    <div className="lg:col-span-2 bg-slate-900/50 p-8 rounded-2xl border border-slate-700 text-center">
                        <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop" alt="ZOE Solar Beraterteam" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-700 object-cover"/>
                        <h4 className="font-bold text-white text-xl">Wir sind für Sie da</h4>
                        <p className="text-slate-400 text-sm mb-6">Starten Sie den Dialog – unkompliziert und schnell.</p>
                        
                        <div className="space-y-4">
                            <button onClick={openChat} className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-base hover:bg-green-600 transition-all duration-300 shadow-lg cta-button-glow transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                Mit KI-Berater sprechen
                            </button>
                            <a href="tel:+493012345678" className="w-full block bg-white/10 text-white font-bold py-3 px-6 rounded-lg text-base hover:bg-white/20 transition-all duration-300 border border-slate-600 flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                Direkt anrufen
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default FAQPage;
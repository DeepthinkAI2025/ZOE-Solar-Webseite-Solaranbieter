import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { faqData, FaqCategory } from '../data/faqData';
import { glossarData } from '../data/glossarData';
import GlossarLink from './GlossarLink';
import { pageToPath } from '../data/pageRoutes';


// Glossar linking logic
const glossarTerms = glossarData.map(item => item.term).sort((a, b) => b.length - a.length);
// Escape special characters for regex
const escapedGlossarTerms = glossarTerms.map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
const glossarRegex = new RegExp(`\\b(${escapedGlossarTerms.join('|')})\\b`, 'gi');

const renderContentWithGlossar = (text: string): React.ReactNode => {
    if (!text) return text;
    // Split by markdown-like bold tags: **text**
    const boldParts = text.split(/(\*\*.*?\*\*)/g);

    return boldParts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return <strong key={i}>{boldText}</strong>;
        }

        // For non-bold parts, apply glossary linking
        const glossarParts = part.split(glossarRegex);
        return glossarParts.map((glossarPart, j) => {
            const matchedTerm = glossarTerms.find(term => term.toLowerCase() === glossarPart.toLowerCase());
            if (matchedTerm) {
                return <GlossarLink key={`${i}-${j}`} term={matchedTerm}>{glossarPart}</GlossarLink>;
            }
            return <React.Fragment key={`${i}-${j}`}>{glossarPart}</React.Fragment>;
        });
    });
};

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  id: string;
  speakable?: boolean;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onClick, id, speakable }) => (
  <div className="border-b border-slate-200">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-start text-left py-6 focus:outline-none group"
      aria-expanded={isOpen}
      aria-controls={`faq-panel-${id}`}
      id={`faq-button-${id}`}
    >
      <span
        className={`text-lg font-semibold text-slate-800 group-hover:text-green-600 transition-colors pr-4 ${speakable ? 'faq-speakable-question' : ''}`}
      >
        {question}
      </span>
      <div className="flex-shrink-0 ml-4 mt-1">
        <svg className={`h-6 w-6 text-slate-400 transform transition-transform duration-300 group-hover:text-green-600 ${isOpen ? 'rotate-180 text-green-600' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
    <div
      id={`faq-panel-${id}`}
      role="region"
      aria-labelledby={`faq-button-${id}`}
      hidden={!isOpen}
      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
    >
      <div className={`pb-6 pr-10 text-slate-600 prose-custom max-w-none ${speakable ? 'faq-speakable-answer' : ''}`}>
          <p>{renderContentWithGlossar(answer)}</p>
      </div>
    </div>
  </div>
);


const CATEGORY_ORDER: FaqCategory[] = [
  'Allgemein',
  'Wirtschaftlichkeit',
  'Förderung',
  'Finanzierung',
  'Technik',
  'Betrieb',
  'Verträge',
  'Region',
];

const REGION_LABELS: Record<string, string> = {
  berlin: 'Berlin & Brandenburg',
  muenchen: 'München & Südbayern',
  zuerich: 'Zürich & Schweiz',
};

interface FAQProps {
  regionSlug?: string;
}

const FAQ: React.FC<FAQProps> = ({ regionSlug }) => {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | FaqCategory>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>(regionSlug ?? 'all');

  const categories = useMemo(() => {
    const available = new Set(faqData.map((item) => item.category));
    const ordered = CATEGORY_ORDER.filter((category) => available.has(category));
    const remaining = Array.from(available).filter((category) => !CATEGORY_ORDER.includes(category));
    return ['all', ...ordered, ...remaining];
  }, []);

  const availableRegions = useMemo(() => {
    const regionSet = new Set<string>();
    faqData.forEach((item) => {
      if (item.regions) {
        item.regions.forEach((region) => regionSet.add(region));
      }
    });
    return ['all', ...Array.from(regionSet)];
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesRegion =
        selectedRegion === 'all' || !item.regions || item.regions.includes(selectedRegion);
      return matchesCategory && matchesRegion;
    });
  }, [selectedCategory, selectedRegion]);

  useEffect(() => {
    if (regionSlug) {
      setSelectedRegion(regionSlug);
    }
  }, [regionSlug]);

  useEffect(() => {
    if (filteredFaqs.length === 0) {
      setOpenQuestion(null);
      return;
    }
    if (!openQuestion || !filteredFaqs.some((item) => item.question === openQuestion)) {
      setOpenQuestion(filteredFaqs[0].question);
    }
  }, [filteredFaqs, openQuestion]);

  const speakableQuestions = useMemo(() => {
    return new Set(filteredFaqs.slice(0, 5).map((item) => item.question));
  }, [filteredFaqs]);

  const handleClick = (question: string) => {
    setOpenQuestion((prev) => (prev === question ? null : question));
  };

  const openChat = () => {
    document.dispatchEvent(new CustomEvent('open-chat'));
  };

  const isRegionalView = selectedRegion !== 'all';
  const sectionClassName = [
    'py-20',
    'bg-white',
    'faq-section',
    'pillar-faq',
    isRegionalView ? 'region-faq' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section id="faq" className={sectionClassName}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <p className="font-bold text-green-600 uppercase tracking-wider">Wissensbasis</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Häufig gestellte Fragen.</h2>
          <p className="text-lg text-slate-600 mt-4">
            Wir beantworten die wichtigsten Fragen rund um Ihr gewerbliches Solarprojekt – transparent, verständlich und auf den Punkt gebracht.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between mb-10">
          <div className="flex flex-wrap gap-3" aria-label="FAQ Kategorien filtern">
            {categories.map((categoryKey) => {
              const isAll = categoryKey === 'all';
              const isActive = selectedCategory === categoryKey;
              const label = isAll ? 'Alle Themen' : categoryKey;
              return (
                <button
                  key={categoryKey}
                  type="button"
                  onClick={() => setSelectedCategory(isAll ? 'all' : (categoryKey as FaqCategory))}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-600 border-green-600 text-white shadow-md'
                      : 'border-slate-200 text-slate-600 hover:border-green-300 hover:text-green-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {availableRegions.length > 1 && (
            <div className="flex items-center gap-3" aria-label="Regionale FAQs filtern">
              <span className="text-sm font-semibold text-slate-700">Regionale Insights:</span>
              <div className="flex flex-wrap gap-2">
                {availableRegions.map((regionKey) => {
                  const isAll = regionKey === 'all';
                  const isActive = selectedRegion === regionKey;
                  const label = isAll ? 'Alle Regionen' : REGION_LABELS[regionKey] ?? regionKey;
                  return (
                    <button
                      key={regionKey}
                      type="button"
                      onClick={() => setSelectedRegion(regionKey)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wide transition-colors ${
                        isActive
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                          : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="max-w-3xl mx-auto" data-region={selectedRegion}>
          {filteredFaqs.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-600">
              Keine Treffer für diese Kombination. Setzen Sie die Filter zurück oder kontaktieren Sie unser Team direkt.
            </div>
          )}
          {filteredFaqs.map((item, index) => (
            <FaqItem
              key={item.question}
              id={item.question.toLowerCase().replace(/\s+/g, '-')}
              question={item.question}
              answer={item.answer}
              isOpen={openQuestion === item.question}
              onClick={() => handleClick(item.question)}
              speakable={speakableQuestions.has(item.question)}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800">Ihre Frage wurde nicht beantwortet?</h3>
            <p className="text-slate-600 my-4">Kein Problem. Unser Expertenteam steht Ihnen für Ihre spezifischen Fragen gerne persönlich zur Verfügung. Starten Sie jetzt eine unverbindliche Analyse.</p>
      <Link
        to={pageToPath.kontakt}
        onClick={(event) => {
          event.preventDefault();
          openChat();
        }}
        className="inline-flex justify-center bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
      >
        Kostenlose Analyse starten
      </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
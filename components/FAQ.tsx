import React, { useState } from 'react';
import { faqData, FaqCategory } from '../data/faqData';
import { glossarData } from '../data/glossarData';
import GlossarLink from './GlossarLink';


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
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onClick, id }) => (
  <div className="border-b border-slate-200">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-start text-left py-6 focus:outline-none group"
      aria-expanded={isOpen}
      aria-controls={`faq-panel-${id}`}
      id={`faq-button-${id}`}
    >
      <span className="text-lg font-semibold text-slate-800 group-hover:text-green-600 transition-colors pr-4">{question}</span>
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
      <div className="pb-6 pr-10 text-slate-600 prose-custom max-w-none">
          <p>{renderContentWithGlossar(answer)}</p>
      </div>
    </div>
  </div>
);


const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const openChat = () => {
    document.dispatchEvent(new CustomEvent('open-chat'));
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <p className="font-bold text-green-600 uppercase tracking-wider">Wissensbasis</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Häufig gestellte Fragen.</h2>
          <p className="text-lg text-slate-600 mt-4">
            Wir beantworten die wichtigsten Fragen rund um Ihr gewerbliches Solarprojekt – transparent, verständlich und auf den Punkt gebracht.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              id={index.toString()}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-800">Ihre Frage wurde nicht beantwortet?</h3>
            <p className="text-slate-600 my-4">Kein Problem. Unser Expertenteam steht Ihnen für Ihre spezifischen Fragen gerne persönlich zur Verfügung. Starten Sie jetzt eine unverbindliche Analyse.</p>
            <button onClick={openChat} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-md transform hover:-translate-y-0.5">
                Kostenlose Analyse starten
            </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
import React, { useState } from 'react';
import { enhancedFAQs } from '../data/enhancedFAQsData';

const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('alle');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<{[key: number]: number}>({});

  // Kategorien extrahieren
  const categories = ['alle', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  // Filtered FAQs
  const filteredFAQs = activeCategory === 'alle' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  // Vote helpful
  const voteHelpful = (index: number) => {
    const voteCount = helpfulVotes[index] || 0;
    setHelpfulVotes({...helpfulVotes, [index]: voteCount + 1});
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-bold text-green-600 uppercase tracking-wider">Häufige Fragen</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
            Was Sie schon immer über Photovoltaik wissen wollten
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Hier finden Sie Antworten auf die wichtigsten Fragen rund um Solarenergie, 
            Förderung, Installation und Kosten - von unseren Experten zusammengestellt.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category === 'alle' ? 'Alle Fragen' : category}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Question Header */}
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-100 transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {faq.category}
                      </span>
                      {helpfulVotes[index] && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {helpfulVotes[index]} hilfreich
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                        activeFAQ === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeFAQ === index ? 'max-h-screen' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 pt-0 border-t border-slate-200">
                    <div 
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                    
                    {/* Helpful Vote Button */}
                    <div className="mt-6 flex items-center gap-4">
                      <span className="text-sm text-slate-600">War diese Antwort hilfreich?</span>
                      <button
                        onClick={() => voteHelpful(index)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-sm font-medium">Ja</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help CTA */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Haben Sie weitere Fragen?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Unsere Solar-Experten stehen Ihnen gerne für eine persönliche Beratung zur Verfügung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 font-bold py-3 px-8 rounded-xl text-lg hover:bg-slate-50 transition-all duration-300">
              Kostenlose Beratung
            </button>
            <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-xl text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              FAQ per E-Mail
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
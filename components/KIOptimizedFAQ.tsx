import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface KIOptimizedFAQProps {
  setPage: (page: Page) => void;
}

// KI-optimierte FAQ-Struktur mit speakable content
const KIOptimizedFAQ: React.FC<KIOptimizedFAQProps> = ({ setPage }) => {
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null);

  // Speakable FAQ items für KI-Crawler
  const speakableFAQs = [
    {
      id: 'kosten-solaranlage-2025',
      question: 'Wie viel kostet eine Solaranlage 2025?',
      answer: 'Solaranlage Kosten 2025: Die Anschaffungskosten liegen typischerweise zwischen 1.200 bis 1.800 Euro pro kWp installierter Leistung. Für eine typische 10 kWp Solaranlage betragen die Gesamtkosten somit 12.000 bis 18.000 Euro. Diese Kosten beinhalten alle Komponenten, Montage, Wechselrichter und Installation. Mit der BEG-Förderung 2025 können die Kosten um bis zu 50 Prozent reduziert werden. Zusätzlich bietet ZOE Solar eine Winter-Aktion mit bis zu 5.000 Euro Rabatt bis zum 31. Dezember 2025.',
      keywords: ['Solaranlage Kosten', 'Photovoltaik Preis', 'Solaranlage Investition', 'PV Kosten']
    },
    {
      id: 'beg-foerderung-2025',
      question: 'Wie beantrage ich BEG-Förderung 2025?',
      answer: 'BEG-Förderung 2025 Schritt-für-Schritt: Zuerst die Registrierung bei BAFA-Online-Portal. Dann Energieberater beauftragen, da dies Pflicht für BEG EM ist. Antragsformular ausfüllen mit bis zu 50 Prozent Zuschuss. Förderzusage abwarten, dies dauert 8 bis 12 Wochen. Installation darf erst nach Förderzusage beginnen. Wichtig: Antrag muss vor Maßnahmebeginn gestellt werden. ZOE Solar übernimmt den kompletten Antragsprozess kostenfrei.',
      keywords: ['BEG Förderung', 'BAFA Antrag', 'Solarförderung', 'Photovoltaik Zuschuss']
    },
    {
      id: 'batteriespeicher-lohnt',
      question: 'Wann lohnt sich ein Batteriespeicher?',
      answer: 'Ein Batteriespeicher lohnt sich besonders bei hohen Strompreisen und wenn Sie viel Solarstrom selbst nutzen möchten. Mit einem Speicher können Sie bis zu 70 Prozent Ihres Solarstroms selbst nutzen statt nur 30 Prozent ohne Speicher. Die Speicherkosten liegen bei 500 bis 1.200 Euro pro kWh Speicherkapazität. Bei einem 10-kWp-System mit 10-kWh-Speicher amortisiert sich der Speicher allein in 8 bis 12 Jahren durch Stromkosteneinsparungen.',
      keywords: ['Batteriespeicher', 'Solarstrom Speicher', 'Eigenverbrauch', 'Photovoltaik Speicher']
    },
    {
      id: 'agr-pv-foerderung',
      question: 'Was ist Agri-PV und welche Förderungen gibt es?',
      answer: 'Agri-PV kombiniert Landwirtschaft und Photovoltaik auf derselben Fläche. Offene Agri-PV-Systeme lassen 80 bis 90 Prozent Licht durch und ermöglichen landwirtschaftliche Nutzung darunter. Die BEG-Förderung 2025 bietet bis zu 70 Prozent Zuschuss für Agri-PV-Systeme. Bayern fördert besonders stark mit bis zu 75.000 Euro, Baden-Württemberg mit bis zu 60.000 Euro pro Hektar. Zusätzlich gibt es vereinfachte Genehmigungsverfahren.',
      keywords: ['Agri-PV', 'Agrivoltaik', 'Landwirtschaft Solar', 'Agri-PV Förderung']
    },
    {
      id: 'winter-aktion-2025',
      question: 'Welche Winter-Aktionen gibt es 2025?',
      answer: 'Winter-Aktion 2025: ZOE Solar bietet bis 31. Dezember 2025 einen Extra-Rabatt von bis zu 5.000 Euro auf komplette Solaranlagen. Zusätzlich erhalten Sie kostenlose Dachstatik-Prüfung, 3 Jahre kostenlose Wartung, BEG-Förderung 2025 ist kombinierbar, besondere Winter-Konditionen für Installation und Planungsvorteile durch frühe Buchung. Die Anzahl der verfügbaren Aktionen ist begrenzt.',
      keywords: ['Winter-Aktion', 'Solar Rabatt', 'Solaranlage Aktion', 'Solar Angebot']
    }
  ];

  // Voice-Search optimierte Transformation
  const voiceOptimizedFAQs = speakableFAQs.map(faq => ({
    ...faq,
    spoken_question: faq.question.replace(/^[Wie|Was|Wann|Wo|Warum|Wer] /, ''),
    voice_keywords: faq.keywords
  }));

  return (
    <section className="faq-section" id="faq-content" role="main">
      {/* KI-freundliche Navigation */}
      <nav className="faq-navigation" aria-label="FAQ Navigation">
        <h2 className="sr-only">FAQ Navigation</h2>
        <ul className="faq-nav-list">
          {speakableFAQs.map((faq) => (
            <li key={faq.id}>
              <a 
                href={`#${faq.id}`}
                className="faq-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveFAQ(faq.id);
                }}
              >
                {faq.question}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Speakable FAQ Items */}
      <div className="speakable-faq-container">
        {speakableFAQs.map((faq) => (
          <div 
            key={faq.id}
            id={faq.id}
            className={`speakable-faq-item ${activeFAQ === faq.id ? 'active' : ''}`}
            role="article"
            aria-labelledby={`question-${faq.id}`}
          >
            <h3 
              id={`question-${faq.id}`}
              className="speakable-question"
              tabIndex={0}
            >
              {faq.question}
            </h3>
            
            <div className="speakable-answer">
              {/* Strukturierte Antwort für KI-Parsing */}
              <div className="answer-content" itemProp="acceptedAnswer">
                <p>{faq.answer}</p>
              </div>
              
              {/* Keywords für KI-Systeme */}
              <meta 
                name="keywords" 
                content={faq.keywords.join(', ')} 
                itemProp="keywords"
              />
              
              {/* Zusätzliche KI-Metadaten */}
              <div className="ai-meta" style={{ display: 'none' }}>
                <span className="question-type">faq</span>
                <span className="content-type">solar-energy</span>
                <span className="expertise-level">expert</span>
                <span className="last-updated">2025-11-01</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Structured Data für KI-Systeme */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": speakableFAQs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </section>
  );
};

export default KIOptimizedFAQ;
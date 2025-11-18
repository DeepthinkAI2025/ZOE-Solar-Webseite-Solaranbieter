/**
 * 🤖 AI-GENERATED ANSWER COMPONENT 2025
 * Speziell optimiert für OpenRouter (Mistral), AI Overview und SGE (Search Generative Experience)
 * Maximiert Sichtbarkeit in KI-generierten Antworten und Featured Snippets
 */

import React, { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';

interface AIAnswerData {
  question: string;
  answer: string;
  context: string;
  confidence: number;
  sources: Array<{
    title: string;
    url: string;
    type: 'study' | 'expert' | 'official' | 'testimonial';
  }>;
  relatedQuestions: Array<{
    question: string;
    preview: string;
  }>;
  lastUpdated: string;
  expertiseLevel: 'beginner' | 'intermediate' | 'expert';
  location?: string;
}

interface AIGeneratedAnswerProps {
  data: AIAnswerData;
  variant?: 'featured-snippet' | 'ai-overview' | 'sge-optimized' | 'openrouter-ready';
  showSources?: boolean;
  showRelatedQuestions?: boolean;
  locationSpecific?: boolean;
  interactive?: boolean;
}

const AIGeneratedAnswer: React.FC<AIGeneratedAnswerProps> = ({
  data,
  variant = 'ai-overview',
  showSources = true,
  showRelatedQuestions = true,
  locationSpecific = false,
  interactive = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [helpfulnessRating, setHelpfulnessRating] = useState<number | null>(null);
  const [personalizedContext, setPersonalizedContext] = useState<string>('');

  // User-Standort für Personalisierung abrufen
  useEffect(() => {
    if (locationSpecific && !userLocation) {
      // Versuche, den Standort zu ermitteln
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // In Echtzeit würde hier ein Geocoding-Service aufgerufen
            setUserLocation('Ihr Standort');
            personalizeAnswer('Ihr Standort');
          },
          (error) => {
            console.log('Geolocation nicht verfügbar:', error);
            setUserLocation('Deutschland');
            personalizeAnswer('Deutschland');
          }
        );
      } else {
        setUserLocation('Deutschland');
        personalizeAnswer('Deutschland');
      }
    }
  }, [locationSpecific, userLocation]);

  // Personalisiere Antwort basierend auf Kontext
  const personalizeAnswer = (location: string) => {
    const personalizedText = data.answer.replace(
      /\[Standort\]/g,
      location
    ).replace(
      /\[Region\]/g,
      location
    );
    setPersonalizedContext(personalizedText);
  };

  // Vertrauensscore-Berechnung für AI-Zitate
  const getTrustScore = (): number => {
    let score = data.confidence * 100;

    // Bonus für autoritative Quellen
    data.sources.forEach(source => {
      if (source.type === 'expert') score += 10;
      if (source.type === 'study') score += 15;
      if (source.type === 'official') score += 20;
    });

    // Bonus für aktuelle Daten
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(data.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceUpdate < 30) score += 10;
    if (daysSinceUpdate < 7) score += 15;

    return Math.min(100, Math.floor(score));
  };

  // Strukturierte Daten für AI-Understanding
  const generateStructuredData = () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": data.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": personalizedContext || data.answer,
          "author": {
            "@type": "Organization",
            "name": "ZOE Solar GmbH",
            "url": "https://zoe-solar.de"
          },
          "dateCreated": data.lastUpdated,
          "confidence": getTrustScore() / 100,
          "citation": data.sources.map(source => ({
            "@type": "CreativeWork",
            "name": source.title,
            "url": source.url
          }))
        }
      }]
    };

    // AI-spezifische Erweiterungen
  if (variant === 'ai-overview' || variant === 'openrouter-ready') {
      if (structuredData.mainEntity[0]?.acceptedAnswer) {
        (structuredData.mainEntity[0] as any).acceptedAnswer.aiGenerated = true;
        (structuredData.mainEntity[0] as any).acceptedAnswer.contextualInformation = data.context;
        (structuredData.mainEntity[0] as any).acceptedAnswer.expertiseLevel = data.expertiseLevel;

        if (locationSpecific && userLocation) {
          (structuredData.mainEntity[0] as any).acceptedAnswer.locationSpecificity = {
            "@type": "Place",
            "name": userLocation
          };
        }
      }
    }

    return structuredData;
  };

  const trustScore = getTrustScore();

  return (
    <>
      {/* Strukturierte Daten für AI-Crawler */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
      />

      {/* Visuelle Komponente */}
      <article className="ai-generated-answer-component" data-variant={variant}>
        <div className="ai-answer ai-overview">
          <div className="ai-overview-header">
            <span className="ai-badge">KI-generierte Antwort</span>
            <div className="ai-indicators">
              <span className="confidence-score">Konfidenz: {data.confidence}%</span>
              <span className="expertise-level">Niveau: {data.expertiseLevel}</span>
            </div>
          </div>

          <div className="ai-content">
            <div className="question-context">
              <h3>{data.question}</h3>
              {data.context && (
                <p className="context-info">{data.context}</p>
              )}
            </div>

            <div className="answer-main">
              <div className="answer-text" itemProp="text">
                {personalizedContext || data.answer}
              </div>

              {locationSpecific && userLocation && (
                <div className="location-specific-info">
                  <span className="location-icon">📍</span>
                  <span>Spezifisch für {userLocation}</span>
                </div>
              )}
            </div>
          </div>

          {interactive && (
            <div className="interactive-elements">
              <div className="helpfulness-rating">
                <span>Hilfreich?</span>
                <button
                  onClick={() => setHelpfulnessRating(1)}
                  className={`rating-btn ${helpfulnessRating === 1 ? 'active' : ''}`}
                >
                  👍
                </button>
                <button
                  onClick={() => setHelpfulnessRating(0)}
                  className={`rating-btn ${helpfulnessRating === 0 ? 'active' : ''}`}
                >
                  👎
                </button>
              </div>

              <button
                className="expand-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Weniger anzeigen' : 'Mehr erfahren'}
              </button>
            </div>
          )}

          {isExpanded && showSources && data.sources.length > 0 && (
            <div className="expanded-content">
              <div className="detailed-sources">
                <h4>Verifizierte Quellen:</h4>
                {data.sources.map((source, index) => (
                  <div key={index} className="source-item">
                    <span className="source-type">{source.type}</span>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.title}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Verwandte Fragen */}
        {showRelatedQuestions && data.relatedQuestions.length > 0 && (
          <div className="related-questions">
            <h4>Verwandte Fragen:</h4>
            <div className="related-questions-grid">
              {data.relatedQuestions.map((related, index) => (
                <button key={index} className="related-question-btn">
                  <span className="question-text">{related.question}</span>
                  <span className="question-preview">{related.preview}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer mit Metadaten */}
        <footer className="ai-answer-footer">
          <div className="metadata">
            <span>Zuletzt aktualisiert: {new Date(data.lastUpdated).toLocaleDateString('de-DE')}</span>
            {locationSpecific && userLocation && (
              <span>Standort: {userLocation}</span>
            )}
            <span>Vertrauensscore: {trustScore}%</span>
          </div>

          {data.expertiseLevel === 'expert' && (
            <div className="expert-verification">
              <span>👨‍🔬 Expertengeprüft</span>
            </div>
          )}
        </footer>
      </article>
    </>
  );
};

export default AIGeneratedAnswer;
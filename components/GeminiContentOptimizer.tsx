/**
 * ✨ GEMINI CONTENT OPTIMIZER 2025
 * Real-time Content-Optimierung für Google Gemini und AI Overview
 * Maximiert Sichtbarkeit in KI-generierten Suchergebnissen
 */

import React, { useState, useEffect, useCallback } from 'react';

interface ContentAnalysis {
  keywordDensity: Map<string, number>;
  readabilityScore: number;
  aiUnderstandingScore: number;
  snippetPotential: number;
  citationAuthority: number;
  contextualRelevance: number;
  recommendedImprovements: Array<{
    type: 'keyword' | 'structure' | 'readability' | 'authority' | 'context';
    priority: 'high' | 'medium' | 'low';
    description: string;
    suggestion: string;
    impact: number;
  }>;
}

interface OptimizationMetrics {
  geminiReadiness: number;
  aiOverviewScore: number;
  featuredSnippetChance: number;
  sgeVisibility: number;
  userIntentMatch: number;
  topicalAuthority: number;
  freshnessScore: number;
  overallScore: number;
}

interface GeminiContentOptimizerProps {
  content: string;
  targetKeywords: string[];
  contentType: 'blog' | 'faq' | 'product' | 'service' | 'landing-page';
  industry: 'solar' | 'renewable-energy' | 'technology' | 'general';
  targetAudience: 'beginner' | 'intermediate' | 'expert' | 'mixed';
  onOptimizationComplete?: (optimizedContent: string, metrics: OptimizationMetrics) => void;
  autoOptimize?: boolean;
  realTimeOptimization?: boolean;
}

const GeminiContentOptimizer: React.FC<GeminiContentOptimizerProps> = ({
  content,
  targetKeywords,
  contentType,
  industry,
  targetAudience,
  onOptimizationComplete,
  autoOptimize = false,
  realTimeOptimization = false
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [optimizedContent, setOptimizedContent] = useState<string>('');
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null);

  // Real-time Analyse und Optimierung
  useEffect(() => {
    if (realTimeOptimization && content) {
      const debounceTimer = setTimeout(() => {
        analyzeContent();
      }, 1000); // Debounce für Performance

      return () => clearTimeout(debounceTimer);
    }
  }, [content, targetKeywords, realTimeOptimization]);

  // Inhalt analysieren
  const analyzeContent = useCallback(async () => {
    setIsAnalyzing(true);

    try {
      // Simuliere API-Aufruf zu Gemini/Analyse-Service
      await new Promise(resolve => setTimeout(resolve, 1500));

      const contentAnalysis = await performContentAnalysis(content, targetKeywords);
      setAnalysis(contentAnalysis);

      const optimizationMetrics = calculateOptimizationMetrics(contentAnalysis);
      setMetrics(optimizationMetrics);

    } catch (error) {
      console.error('Content-Analyse fehlgeschlagen:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [content, targetKeywords]);

  // Detaillierte Content-Analyse durchführen
  const performContentAnalysis = async (
    text: string,
    keywords: string[]
  ): Promise<ContentAnalysis> => {
    // Keyword-Dichte analysieren
    const keywordDensity = new Map<string, number>();
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;

    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const count = words.filter(word => word.includes(keywordLower)).length;
      keywordDensity.set(keyword, (count / totalWords) * 100);
    });

    // Lesbarkeit bewerten (vereinfachter Flesch-Kincaid Algorithmus)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = totalWords / sentences.length;
    const avgSyllablesPerWord = 1.5; // Vereinfacht
    const readabilityScore = Math.max(0, Math.min(100,
      206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
    ));

    // AI-Verständlichkeit bewerten
    const aiUnderstandingScore = calculateAIUnderstandingScore(text, keywords, contentType);

    // Featured Snippet Potenzial
    const snippetPotential = calculateSnippetPotential(text, keywords, contentType);

    // Zitations-Autorität
    const citationAuthority = calculateCitationAuthority(text, industry);

    // Kontextuelle Relevanz
    const contextualRelevance = calculateContextualRelevance(text, keywords, industry);

    // Verbesserungsvorschläge generieren
    const recommendedImprovements = generateImprovementSuggestions(
      keywordDensity,
      readabilityScore,
      aiUnderstandingScore,
      snippetPotential,
      citationAuthority,
      contextualRelevance
    );

    return {
      keywordDensity,
      readabilityScore,
      aiUnderstandingScore,
      snippetPotential,
      citationAuthority,
      contextualRelevance,
      recommendedImprovements
    };
  };

  // AI-Verständlichkeit berechnen
  const calculateAIUnderstandingScore = (
    text: string,
    keywords: string[],
    type: string
  ): number => {
    let score = 50; // Basis-Score

    // Strukturierte Inhalte sind besser für AI
    if (text.includes('##') || text.includes('###')) score += 10;
    if (text.match(/\d+\./)) score += 5; // Nummerierte Listen
    if (text.match(/•|·|*/)) score += 5; // Bullet Points

    // Fragen und Antworten
    if (text.match(/\?/)) score += 10;
    if (text.toLowerCase().includes('antwort') || text.toLowerCase().includes('solution')) score += 5;

    // Fachliche Präzision
    keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) score += 2;
    });

    return Math.min(100, Math.max(0, score));
  };

  // Featured Snippet Potenzial berechnen
  const calculateSnippetPotential = (
    text: string,
    keywords: string[],
    type: string
  ): number => {
    let score = 30; // Basis-Score

    // Direkte Antworten
    if (text.length >= 50 && text.length <= 300) score += 20;

    // Frage-Antwort Struktur
    if (text.match(/\b(was|wie|warum|wann|wo|wer|welche|weshalb)\b/i)) score += 15;

    // Definitions-Formate
    if (text.includes('ist') && text.includes(',')) score += 10;

    // Schritt-für-Schritt Anleitungen
    if (text.match(/schritt\s*\d+|step\s*\d+/i)) score += 15;
    if (text.match(/1\.\s*2\.\s*3\./)) score += 10;

    return Math.min(100, score);
  };

  // Zitations-Autorität berechnen
  const calculateCitationAuthority = (text: string, industry: string): number => {
    let score = 40; // Basis-Score

    // Offizielle Quellen
    if (text.includes('BMWK') || text.includes('Bundesministerium')) score += 15;
    if (text.includes('Studie') || text.includes('research')) score += 10;

    // Daten und Statistiken
    if (text.match(/\d{4}/)) score += 5; // Jahreszahlen
    if (text.includes('%')) score += 5; // Prozentangaben

    return Math.min(100, score);
  };

  // Kontextuelle Relevanz berechnen
  const calculateContextualRelevance = (
    text: string,
    keywords: string[],
    industry: string
  ): number => {
    let score = 50; // Basis-Score

    // Keyword-Relevanz
    const keywordMatches = keywords.filter(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    score += (keywordMatches / keywords.length) * 30;

    return Math.min(100, Math.max(0, score));
  };

  // Verbesserungsvorschläge generieren
  const generateImprovementSuggestions = (
    keywordDensity: Map<string, number>,
    readabilityScore: number,
    aiUnderstandingScore: number,
    snippetPotential: number,
    citationAuthority: number,
    contextualRelevance: number
  ): Array<{
    type: 'keyword' | 'structure' | 'readability' | 'authority' | 'context';
    priority: 'high' | 'medium' | 'low';
    description: string;
    suggestion: string;
    impact: number;
  }> => {
    const suggestions = [];

    // Keyword-Dichte Optimierung
    keywordDensity.forEach((density, keyword) => {
      if (density < 1) {
        suggestions.push({
          type: 'keyword',
          priority: 'high',
          description: `Keyword "${keyword}" hat geringe Dichte (${density.toFixed(1)}%)`,
          suggestion: `Integriere "${keyword}" natürlicher in Überschriften und Absätze`,
          impact: 15
        });
      }
    });

    // Lesbarkeit
    if (readabilityScore < 60) {
      suggestions.push({
        type: 'readability',
        priority: 'high',
        description: `Lesbarkeit ist niedrig (${readabilityScore.toFixed(0)}%)`,
        suggestion: 'Verwende kürzere Sätze, einfachere Sprache und mehr Absätze',
        impact: 20
      });
    }

    // AI-Verständlichkeit
    if (aiUnderstandingScore < 70) {
      suggestions.push({
        type: 'structure',
        priority: 'high',
        description: `AI-Verständlichkeit könnte verbessert werden (${aiUnderstandingScore.toFixed(0)}%)`,
        suggestion: 'Füge strukturierte Daten, Überschriften und Listen hinzu',
        impact: 25
      });
    }

    return suggestions;
  };

  // Optimierungsmetriken berechnen
  const calculateOptimizationMetrics = (analysis: ContentAnalysis): OptimizationMetrics => {
    const geminiReadiness = (analysis.aiUnderstandingScore + analysis.contextualRelevance) / 2;
    const aiOverviewScore = (analysis.snippetPotential + analysis.citationAuthority) / 2;
    const featuredSnippetChance = analysis.snippetPotential;
    const sgeVisibility = (analysis.aiUnderstandingScore + analysis.readabilityScore) / 2;
    const userIntentMatch = analysis.contextualRelevance;
    const topicalAuthority = analysis.citationAuthority;
    const freshnessScore = 95; // Simulierter Freshness Score
    const overallScore = (
      geminiReadiness * 0.25 +
      aiOverviewScore * 0.20 +
      featuredSnippetChance * 0.20 +
      sgeVisibility * 0.15 +
      userIntentMatch * 0.10 +
      topicalAuthority * 0.10
    );

    return {
      geminiReadiness: Math.min(100, geminiReadiness),
      aiOverviewScore: Math.min(100, aiOverviewScore),
      featuredSnippetChance: Math.min(100, featuredSnippetChance),
      sgeVisibility: Math.min(100, sgeVisibility),
      userIntentMatch: Math.min(100, userIntentMatch),
      topicalAuthority: Math.min(100, topicalAuthority),
      freshnessScore: Math.min(100, freshnessScore),
      overallScore: Math.min(100, overallScore)
    };
  };

  return (
    <div className="gemini-content-optimizer">
      <div className="optimizer-header">
        <h2>🤖 Google Gemini Content Optimizer</h2>
        <div className="optimizer-controls">
          <button
            onClick={analyzeContent}
            disabled={isAnalyzing}
            className="btn-analyze"
          >
            {isAnalyzing ? 'Analysiere...' : 'Inhalt analysieren'}
          </button>
        </div>
      </div>

      {/* Metriken-Dashboard */}
      {metrics && (
        <div className="metrics-dashboard">
          <h3>Optimierungsmetriken</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-label">Gemini Readiness</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{ width: `${metrics.geminiReadiness}%` }}
                />
              </div>
              <span className="metric-value">{metrics.geminiReadiness.toFixed(0)}%</span>
            </div>

            <div className="metric-item">
              <span className="metric-label">Overall Score</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${metrics.overallScore}%`,
                    backgroundColor: metrics.overallScore >= 85 ? '#4CAF50' :
                                   metrics.overallScore >= 70 ? '#FF9800' : '#F44336'
                  }}
                />
              </div>
              <span className="metric-value">{metrics.overallScore.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiContentOptimizer;
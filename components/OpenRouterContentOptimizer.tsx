import React, { useState, useCallback } from 'react';

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
  openrouterReadiness: number;
  aiOverviewScore: number;
  featuredSnippetChance: number;
  sgeVisibility: number;
  userIntentMatch: number;
  topicalAuthority: number;
  freshnessScore: number;
  overallScore: number;
}

interface OpenRouterContentOptimizerProps {
  content?: string;
  targetKeywords?: string[];
  contentType?: string;
  industry?: string;
  onOptimizationComplete?: (content: string, metrics: OptimizationMetrics) => void;
}

const OpenRouterContentOptimizer: React.FC<OpenRouterContentOptimizerProps> = ({
  content = '',
  targetKeywords = [],
  contentType = 'general',
  industry = 'solar',
  onOptimizationComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null);

  // --- Hilfsfunktionen ---
  const calculateAIUnderstandingScore = (
    text: string,
    keywords: string[],
    type?: string
  ): number => {
    let score = 50;
    if (text.includes('##') || text.includes('###')) score += 10;
    if (text.match(/\d+\./)) score += 5;
    if (text.match(/[•·*]/)) score += 5;
    if (text.match(/\?/)) score += 10;
    if (text.toLowerCase().includes('antwort') || text.toLowerCase().includes('solution')) score += 5;
    keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) score += 2;
    });
    return Math.min(100, Math.max(0, score));
  };

  const calculateSnippetPotential = (
    text: string,
    keywords: string[],
    type?: string
  ): number => {
    let score = 30;
    if (text.length >= 50 && text.length <= 300) score += 20;
    if (text.match(/\b(was|wie|warum|wann|wo|wer|welche|weshalb)\b/i)) score += 15;
    if (text.includes('ist') && text.includes(',')) score += 10;
    if (text.match(/schritt\s*\d+|step\s*\d+/i)) score += 15;
    if (text.match(/1\.\s*2\.\s*3\./)) score += 10;
    return Math.min(100, score);
  };

  const calculateCitationAuthority = (text: string, industry?: string): number => {
    let score = 40;
    if (text.includes('BMWK') || text.includes('Bundesministerium')) score += 15;
    if (text.includes('Studie') || text.includes('research')) score += 10;
    if (text.match(/\d{4}/)) score += 5;
    if (text.includes('%')) score += 5;
    return Math.min(100, score);
  };

  const calculateContextualRelevance = (
    text: string,
    keywords: string[],
    industry?: string
  ): number => {
    let score = 50;
    const keywordMatches = keywords.filter(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    score += (keywordMatches / (keywords.length || 1)) * 30;
    return Math.min(100, Math.max(0, score));
  };

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
    const suggestions: Array<{
      type: 'keyword' | 'structure' | 'readability' | 'authority' | 'context';
      priority: 'high' | 'medium' | 'low';
      description: string;
      suggestion: string;
      impact: number;
    }> = [];
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
    if (readabilityScore < 60) {
      suggestions.push({
        type: 'readability',
        priority: 'high',
        description: `Lesbarkeit ist niedrig (${readabilityScore.toFixed(0)}%)`,
        suggestion: 'Verwende kürzere Sätze, einfachere Sprache und mehr Absätze',
        impact: 20
      });
    }
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

  const calculateOptimizationMetrics = (analysis: ContentAnalysis): OptimizationMetrics => {
    const openrouterReadiness = (analysis.aiUnderstandingScore + analysis.contextualRelevance) / 2;
    const aiOverviewScore = (analysis.snippetPotential + analysis.citationAuthority) / 2;
    const featuredSnippetChance = analysis.snippetPotential;
    const sgeVisibility = (analysis.aiUnderstandingScore + analysis.readabilityScore) / 2;
    const userIntentMatch = analysis.contextualRelevance;
    const topicalAuthority = analysis.citationAuthority;
    const freshnessScore = 95;
    const overallScore = (
      openrouterReadiness * 0.25 +
      aiOverviewScore * 0.20 +
      featuredSnippetChance * 0.20 +
      sgeVisibility * 0.15 +
      userIntentMatch * 0.10 +
      topicalAuthority * 0.10
    );
    return {
      openrouterReadiness: Math.min(100, openrouterReadiness),
      aiOverviewScore: Math.min(100, aiOverviewScore),
      featuredSnippetChance: Math.min(100, featuredSnippetChance),
      sgeVisibility: Math.min(100, sgeVisibility),
      userIntentMatch: Math.min(100, userIntentMatch),
      topicalAuthority: Math.min(100, topicalAuthority),
      freshnessScore: Math.min(100, freshnessScore),
      overallScore: Math.min(100, overallScore)
    };
  };

  const performContentAnalysis = async (
    text: string,
    keywords: string[],
    contentType?: string,
    industry?: string
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
    const avgWordsPerSentence = totalWords / (sentences.length || 1);
    const avgSyllablesPerWord = 1.5;
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

  // Content analysieren
  const analyzeContent = useCallback(async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Simuliere API-Aufruf zu OpenRouter/Analyse-Service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const contentAnalysis = await performContentAnalysis(content, targetKeywords, contentType, industry);
      setAnalysis(contentAnalysis);
      
      const optimizationMetrics = calculateOptimizationMetrics(contentAnalysis);
      setMetrics(optimizationMetrics);
      
      onOptimizationComplete?.(content, optimizationMetrics);
    } catch (error) {
      console.error('Content-Analyse fehlgeschlagen:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [content, targetKeywords, contentType, industry, onOptimizationComplete]);

  return (
    <div className="openrouter-content-optimizer">
      <div className="optimizer-header">
        <h2>🤖 OpenRouter Content Optimizer</h2>
        <div className="optimizer-controls">
          <button
            onClick={analyzeContent}
            disabled={isAnalyzing || !content.trim()}
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
              <span className="metric-label">OpenRouter Readiness</span>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{ width: `${metrics.openrouterReadiness}%` }}
                />
              </div>
              <span className="metric-value">{metrics.openrouterReadiness.toFixed(0)}%</span>
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

      {/* Verbesserungsvorschläge */}
      {analysis && analysis.recommendedImprovements.length > 0 && (
        <div className="improvements-section">
          <h3>Verbesserungsvorschläge</h3>
          <div className="improvements-list">
            {analysis.recommendedImprovements.map((improvement, index) => (
              <div key={index} className={`improvement-item priority-${improvement.priority}`}>
                <div className="improvement-header">
                  <span className="improvement-type">{improvement.type}</span>
                  <span className={`priority-badge ${improvement.priority}`}>
                    {improvement.priority}
                  </span>
                </div>
                <p className="improvement-description">{improvement.description}</p>
                <p className="improvement-suggestion">{improvement.suggestion}</p>
                <span className="impact-score">Impact: +{improvement.impact}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenRouterContentOptimizer;
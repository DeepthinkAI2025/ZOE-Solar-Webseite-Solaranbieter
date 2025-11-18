/**
 * Gemini Client - Migrated to OpenRouter
 * This service has been consolidated into the new AI Gateway Service
 * Uses OpenRouter API with minimax:m2 model for better performance and cost efficiency
 */

import { getAIGatewayService } from '../../services/core/AIGatewayService.js';

export async function suggestForManufacturer() {
  // This functionality is now handled by the AI Gateway Service
  // Use getAIGatewayService().generateLocalSEO() for manufacturer-specific content
  throw new Error('Die suggestForManufacturer-Funktionalität wurde in die AI Gateway Service migriert. Verwende getAIGatewayService().generateLocalSEO()');
}

export async function optimizeKeywords(content, targetKeywords, language = 'de') {
  // Use the new AI Gateway Service for keyword optimization
  try {
    const aiGateway = getAIGatewayService();

    const result = await aiGateway.optimizeContent({
      content,
      targetKeywords,
      language,
      optimizationGoals: ['seo', 'readability', 'engagement']
    });

    if (result.success && result.content) {
      // Parse JSON response from AI Gateway
      const optimizedContent = JSON.parse(result.content);
      return optimizedContent;
    }

    // Fallback if AI Gateway fails
    const safeContent = typeof content === 'string' ? content : (content ? JSON.stringify(content) : '');

    return {
      optimizedTitle: (safeContent.split('\n')[0] || 'Optimiert Titel'),
      optimizedMetaDescription: safeContent.substring(0, 160),
      optimizedContent: safeContent,
      keywordDensity: {},
      suggestions: ['Content wurde analysiert mit Fallback-Methoden']
    };

  } catch (error) {
    // Handle migration error gracefully
    console.error('AI Gateway Service error:', error);

    // Return basic optimization as fallback
    const safeContent = typeof content === 'string' ? content : (content ? JSON.stringify(content) : '');

    return {
      optimizedTitle: (safeContent.split('\n')[0] || 'Optimiert Titel'),
      optimizedMetaDescription: safeContent.substring(0, 160),
      optimizedContent: safeContent,
      keywordDensity: {},
      suggestions: ['Fehler bei der KI-Optimierung, Basis-Content verwendet']
    };
  }
}

/**
 * Legacy migration helper for content optimization
 * @deprecated Use getAIGatewayService().optimizeContent() instead
 */
export async function legacyContentOptimization(content, options = {}) {
  const aiGateway = getAIGatewayService();
  return aiGateway.optimizeContent({
    content,
    targetKeywords: options.keywords || [],
    language: options.language || 'de',
    optimizationGoals: options.goals || ['seo', 'readability']
  });
}

/**
 * Legacy migration helper for conversation
 * @deprecated Use getAIGatewayService().generateConversation() instead
 */
export async function legacyConversation(message, context = 'ZOE Solar') {
  const aiGateway = getAIGatewayService();
  return aiGateway.generateConversation({
    userMessage: message,
    context,
    userType: 'customer'
  });
}

export default {
  suggestForManufacturer,
  optimizeKeywords,
  legacyContentOptimization,
  legacyConversation
};
/**
 * OpenRouter AI Client - Consolidated LLM Service
 * Replaces multiple AI providers with single OpenRouter API integration
 * Using minimax:m2 model for optimal performance and cost efficiency
 */

export interface AIRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  context?: string;
  systemPrompt?: string;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
  };
  error?: string;
}

export interface OpenRouterConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  timeout?: number;
}

class OpenRouterClient {
  private config: OpenRouterConfig;
  private cache = new Map<string, AIResponse>();
  private rateLimiter = {
    tokens: 0,
    lastReset: Date.now(),
    maxTokens: 100, // Conservative rate limit
    windowMs: 60000 // 1 minute window
  };

  constructor(config: OpenRouterConfig) {
    this.config = {
      model: 'minimax/minimax-m2',
      baseUrl: 'https://openrouter.ai/api/v1',
      timeout: 30000,
      ...config
    };
  }

  /**
   * Check rate limiting and wait if necessary
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastReset = now - this.rateLimiter.lastReset;

    if (timeSinceLastReset >= this.rateLimiter.windowMs) {
      this.rateLimiter.tokens = 0;
      this.rateLimiter.lastReset = now;
    }

    if (this.rateLimiter.tokens >= this.rateLimiter.maxTokens) {
      const waitTime = this.rateLimiter.windowMs - timeSinceLastReset;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.rateLimiter.tokens = 0;
      this.rateLimiter.lastReset = Date.now();
    }

    this.rateLimiter.tokens++;
  }

  /**
   * Generate cache key for request
   */
  private getCacheKey(request: AIRequest): string {
    return `${request.prompt}-${request.temperature || 0.7}-${request.maxTokens || 1000}-${request.context || ''}`;
  }

  /**
   * Calculate cost based on token usage
   */
  private calculateCost(tokens: number): number {
    // minimax:m2 pricing: ~$0.50 per 1M input tokens, ~$1.50 per 1M output tokens
    const avgCostPerToken = 0.000001; // Conservative estimate
    return tokens * avgCostPerToken;
  }

  /**
   * Make API request to OpenRouter
   */
  private async makeAPIRequest(request: AIRequest): Promise<any> {
    await this.checkRateLimit();

    const payload = {
      model: this.config.model,
      messages: [
        ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
        { role: 'user', content: request.prompt }
      ],
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 1000,
      ...(request.context && { context: request.context })
    };

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ZOE Solar Website'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(this.config.timeout || 30000)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate content using OpenRouter API
   */
  async generateContent(request: AIRequest): Promise<AIResponse> {
    try {
      // Check cache first
      const cacheKey = this.getCacheKey(request);
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!;
      }

      const data = await this.makeAPIRequest(request);

      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error('Invalid response from OpenRouter API');
      }

      const content = data.choices[0].message.content;
      const usage = data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

      const response: AIResponse = {
        success: true,
        content,
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
          cost: this.calculateCost(usage.total_tokens)
        }
      };

      // Cache successful responses
      this.cache.set(cacheKey, response);

      // Limit cache size
      if (this.cache.size > 100) {
        const firstKey = this.cache.keys().next().value;
        if (typeof firstKey === 'string') {
          this.cache.delete(firstKey);
        }
      }

      return response;

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate SEO-optimized content
   */
  async generateSEOContent(
    content: string,
    targetKeywords: string[],
    language: string = 'de'
  ): Promise<AIResponse> {
    const systemPrompt = `You are an expert SEO content optimizer. Create content that is:
1. SEO-optimized with natural keyword integration
2. Engaging and readable for users
3. Semantically relevant and comprehensive
4. Optimized for search engines and user experience
5. Written in ${language}

Always respond with properly formatted JSON containing:
- optimizedTitle
- optimizedMetaDescription
- optimizedContent
- keywordDensity (object with keyword percentages)
- suggestions (array of improvement suggestions)`;

    const prompt = `Analyze and optimize this content for the given keywords:

Content: ${content}
Target Keywords: ${targetKeywords.join(', ')}
Language: ${language}

Please provide SEO-optimized versions of the title, meta description, and content that naturally integrates the keywords while maintaining readability and user engagement.`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.3,
      maxTokens: 2000
    });
  }

  /**
   * Generate conversational AI responses
   */
  async generateConversationResponse(
    userMessage: string,
    conversationHistory: Array<{role: string, content: string}> = [],
    context: string = 'ZOE Solar business context'
  ): Promise<AIResponse> {
    const systemPrompt = `You are a helpful AI assistant for ZOE Solar, a German solar energy company. You help customers with:
- Solar energy questions and advice
- Product information and recommendations
- General inquiries about solar solutions
- Customer service and support

Be friendly, professional, and helpful. Always provide accurate information about solar energy. If you don't know something, admit it and suggest contacting ZOE Solar's human experts.

Context: ${context}`;

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-5) // Keep last 5 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `${conversationContext ? 'Previous conversation:\n' + conversationContext + '\n\n' : ''}User: ${userMessage}`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 1000,
      context
    });
  }

  /**
   * Generate local SEO content
   */
  async generateLocalSEOContent(
    businessType: string,
    location: string,
    services: string[]
  ): Promise<AIResponse> {
    const systemPrompt = `You are an expert in local SEO for businesses. Create content that helps businesses rank well in local search results and on Google Maps.

Always respond with JSON containing:
- businessDescription
- localKeywords
- serviceDescriptions
- locationSpecificContent
- googleBusinessProfilePosts`;

    const prompt = `Generate local SEO content for:

Business Type: ${businessType}
Location: ${location}
Services: ${services.join(', ')}

Create content that helps this business rank well in local search results and appear in "near me" searches.`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.4,
      maxTokens: 1500
    });
  }

  /**
   * Generate product descriptions
   */
  async generateProductDescription(
    productType: string,
    features: string[],
    targetAudience: string
  ): Promise<AIResponse> {
    const systemPrompt = `You are an expert copywriter for solar energy products. Create compelling, professional product descriptions that:
1. Highlight key benefits and features
2. Address customer pain points and needs
3. Include technical details in accessible language
4. Drive purchase decisions
5. Are SEO-optimized

Always respond with JSON containing:
- title
- shortDescription
- detailedDescription
- keyFeatures
- benefits
- technicalSpecs
- callToAction`;

    const prompt = `Create a product description for:

Product Type: ${productType}
Features: ${features.join(', ')}
Target Audience: ${targetAudience}

Write compelling copy that persuades customers to choose this product.`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.6,
      maxTokens: 1200
    });
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): {
    totalRequests: number;
    cacheSize: number;
    rateLimitStatus: {
      tokens: number;
      maxTokens: number;
      resetIn: number;
    };
  } {
    const timeUntilReset = this.rateLimiter.windowMs - (Date.now() - this.rateLimiter.lastReset);

    return {
      totalRequests: this.cache.size,
      cacheSize: this.cache.size,
      rateLimitStatus: {
        tokens: this.rateLimiter.tokens,
        maxTokens: this.rateLimiter.maxTokens,
        resetIn: Math.max(0, timeUntilReset)
      }
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance for the application
let openRouterClient: OpenRouterClient | null = null;

export function getOpenRouterClient(): OpenRouterClient {
  if (!openRouterClient) {
    // Direkt den Key und das Modell setzen (OpenHermes-2.5, Stand Nov 2025 free)
    const apiKey = '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';
    openRouterClient = new OpenRouterClient({
      apiKey,
      model: 'openhermes-2.5'
    });
  }

  return openRouterClient;
}

export default OpenRouterClient;
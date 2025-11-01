/**
 * 🚀 OpenRouter API Client for ZOE Solar
 *
 * Zentrale AI-Integration mit OpenRouter API und minimax:m2 Modell
 * Konsolidiert alle AI-Services in einem performanten Gateway
 */

interface OpenRouterConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  timeout: number;
  maxRetries: number;
}

interface AIRequest {
  prompt: string;
  context?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  cacheKey?: string;
}

interface AIResponse {
  success: boolean;
  content?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
  };
  error?: string;
  cached?: boolean;
  timestamp: string;
  requestId: string;
}

interface CacheEntry {
  content: string;
  timestamp: number;
  ttl: number;
  usage: AIResponse['usage'];
}

class OpenRouterClient {
  private config: OpenRouterConfig;
  private cache: Map<string, CacheEntry>;
  private rateLimiter: Map<string, number[]>;

  constructor() {
    this.config = {
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseURL: 'https://openrouter.ai/api/v1',
      model: 'minimax/minimax-m2',
      timeout: 30000,
      maxRetries: 3
    };

    this.cache = new Map();
    this.rateLimiter = new Map();

    if (!this.config.apiKey) {
      console.warn('⚠️ OpenRouter API Key nicht gefunden - bitte .env überprüfen');
    }
  }

  /**
   * Zentrale AI-Anfrage mit Caching und Rate Limiting
   */
  async generateContent(request: AIRequest): Promise<AIResponse> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // Cache Check
      if (request.cacheKey) {
        const cached = this.getCachedResponse(request.cacheKey);
        if (cached) {
          return {
            success: true,
            content: cached.content,
            usage: cached.usage,
            cached: true,
            timestamp: new Date().toISOString(),
            requestId
          };
        }
      }

      // Rate Limiting Check
      if (!this.checkRateLimit(requestId)) {
        throw new Error('Rate limit exceeded');
      }

      // API Request
      const response = await this.makeAPIRequest(request);

      // Cache Response
      if (request.cacheKey && response.success) {
        this.setCachedResponse(request.cacheKey, response);
      }

      console.log(`✅ OpenRouter Request ${requestId} completed in ${Date.now() - startTime}ms`);
      return response;

    } catch (error) {
      console.error(`❌ OpenRouter Request ${requestId} failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        requestId
      };
    }
  }

  /**
   * Spezialisierte Methoden für verschiedene Use Cases
   */

  async generateSEOContent(
    topic: string,
    keywords: string[],
    contentType: 'page' | 'article' | 'product' = 'page'
  ): Promise<AIResponse> {
    const systemPrompt = `Du bist ein SEO-Experte für ZOE Solar, ein führendes Solarunternehmen in Deutschland.
Erstelle hochwertigen, SEO-optimierten Content über ${topic}.
Füge die Keywords natürlich ein: ${keywords.join(', ')}.
Der Content soll professionell, informativ und überzeugend sein.
Antworte auf Deutsch.`;

    const prompt = `Erstelle einen ${contentType} über ${topic} mit Fokus auf Solarlösungen für Unternehmen.`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 2000,
      cacheKey: `seo-${topic}-${contentType}-${keywords.join('-')}`
    });
  }

  async generateLocalSEOContent(
    location: string,
    service: string,
    targetAudience: string = 'Unternehmen'
  ): Promise<AIResponse> {
    const systemPrompt = `Du bist ein Local SEO Experte für ZOE Solar.
Erstelle location-spezifischen Content für ${service} in ${location}.
Zielgruppe: ${targetAudience}.
Füge lokale Bezüge und Geotags ein.
Antworte auf Deutsch.`;

    const prompt = `Erstelle einen überzeugenden Text über ${service} in ${location} für ${targetAudience}.`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.8,
      maxTokens: 1500,
      cacheKey: `local-${location}-${service}-${targetAudience}`
    });
  }

  async generateConversationalResponse(
    userMessage: string,
    conversationHistory: string[] = [],
    context: string = ''
  ): Promise<AIResponse> {
    const systemPrompt = `Du bist ein hilfreicher Solar-Experte von ZOE Solar.
Beantworte Fragen professionell und kundenfreundlich.
Fokus auf Photovoltaik-Lösungen für Unternehmen.
Sei präzise, aber verständlich.
Antworte auf Deutsch.`;

    const conversationContext = conversationHistory.length > 0
      ? '\n\nVerlauf:\n' + conversationHistory.slice(-3).join('\n')
      : '';

    const prompt = `${context}${conversationContext}\n\nKundenfrage: ${userMessage}`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.9,
      maxTokens: 800,
      cacheKey: `chat-${userMessage.slice(0, 50)}`
    });
  }

  async generateProductDescription(
    product: string,
    features: string[],
    benefits: string[],
    targetIndustry: string = 'alle'
  ): Promise<AIResponse> {
    const systemPrompt = `Du bist ein Copywriter für ZOE Solar.
Erstelle überzeugende Produktbeschreibungen für B2B-Kunden.
Fokus auf Vorteile und ROI.
Verwende professionelle, aber verständliche Sprache.
Antworte auf Deutsch.`;

    const prompt = `Beschreibe ${product} für die Zielgruppe ${targetIndustry}.

Merkmale: ${features.join(', ')}
Vorteile: ${benefits.join(', ')}`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.6,
      maxTokens: 1000,
      cacheKey: `product-${product}-${targetIndustry}`
    });
  }

  async generateTechnicalDocumentation(
    topic: string,
    technicalLevel: 'basic' | 'intermediate' | 'advanced' = 'intermediate',
    targetAudience: string = 'technische Entscheidungsträger'
  ): Promise<AIResponse> {
    const levelDescriptions = {
      basic: 'einfach verständlich für Nicht-Techniker',
      intermediate: 'technisch fundiert für Entscheidungsträger',
      advanced: 'detailliert für technische Experten'
    };

    const systemPrompt = `Du bist technischer Autor bei ZOE Solar.
Erstelle ${levelDescriptions[technicalLevel]} technische Dokumentation.
Fokus auf ${topic} im Kontext von Photovoltaik-Lösungen.
Sei präzise und informativ.
Antworte auf Deutsch.`;

    const prompt = `Erstelle eine technische Erläuterung über ${topic} für ${targetAudience}.`;

    return this.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.4,
      maxTokens: 2500,
      cacheKey: `tech-${topic}-${technicalLevel}`
    });
  }

  /**
   * Private Helper Methods
   */

  private async makeAPIRequest(request: AIRequest): Promise<AIResponse> {
    const requestBody = {
      model: this.config.model,
      messages: [
        ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
        { role: 'user', content: request.prompt }
      ],
      temperature: request.temperature || 0.7,
      max_tokens: request.maxTokens || 1000
    };

    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://zoe-solar.de',
        'X-Title': 'ZOE Solar AI Platform'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      content: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
        cost: this.calculateCost(data.usage?.total_tokens || 0)
      },
      cached: false,
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
  }

  private calculateCost(tokens: number): number {
    // minimax:m2 pricing (approximately)
    // $0.20 per 1M input tokens, $0.60 per 1M output tokens
    // Using conservative estimate of $0.40 per 1M total tokens
    return (tokens * 0.40) / 1000000;
  }

  private getCachedResponse(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  private setCachedResponse(key: string, response: AIResponse): void {
    if (response.success && response.usage) {
      this.cache.set(key, {
        content: response.content || '',
        timestamp: Date.now(),
        ttl: 3600000, // 1 hour
        usage: response.usage
      });
    }
  }

  private checkRateLimit(requestId: string): boolean {
    const now = Date.now();
    const window = 60000; // 1 minute
    const maxRequests = 60; // per minute

    if (!this.rateLimiter.has(requestId)) {
      this.rateLimiter.set(requestId, []);
    }

    const requests = this.rateLimiter.get(requestId)!;
    const validRequests = requests.filter(time => now - time < window);

    if (validRequests.length >= maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.rateLimiter.set(requestId, validRequests);
    return true;
  }

  private generateRequestId(): string {
    return `or_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Utility Methods
   */

  getHealthStatus(): { status: 'healthy' | 'degraded' | 'unhealthy', details: any } {
    const cacheSize = this.cache.size;
    const activeRequests = this.rateLimiter.size;
    const hasApiKey = !!this.config.apiKey;

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (!hasApiKey) status = 'unhealthy';
    else if (cacheSize > 1000 || activeRequests > 100) status = 'degraded';

    return {
      status,
      details: {
        cacheSize,
        activeRequests,
        hasApiKey,
        model: this.config.model
      }
    };
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ OpenRouter Cache cleared');
  }

  getUsageStats(): { totalRequests: number, cacheHits: number, totalCost: number } {
    // Implementation for usage tracking
    return {
      totalRequests: 0,
      cacheHits: 0,
      totalCost: 0
    };
  }
}

// Singleton Instance
export const openRouterClient = new OpenRouterClient();
export default openRouterClient;
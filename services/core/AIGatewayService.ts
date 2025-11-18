/**
 * AI Gateway Service - Unified AI Service Interface
 * Consolidates all AI functionality through OpenRouter API
 * Replaces multiple fragmented AI services with single gateway
 */

import { getOpenRouterClient, AIRequest, AIResponse } from './OpenRouterClient';

export interface ContentOptimizationRequest {
  content: string;
  targetKeywords?: string[];
  language?: string;
  optimizationGoals?: ('seo' | 'readability' | 'engagement' | 'conversion')[];
}

export interface ConversationRequest {
  userMessage: string;
  conversationHistory?: Array<{role: string, content: string}>;
  context?: string;
  userType?: 'customer' | 'prospect' | 'partner' | 'general';
}

export interface LocalSEORequest {
  businessType: string;
  location: string;
  services: string[];
  targetRadius?: number; // in km
}

export interface ProductDescriptionRequest {
  productType: string;
  features: string[];
  targetAudience: string;
  technicalSpecs?: Record<string, any>;
  usps?: string[]; // Unique Selling Points
}

export interface SEOAnalysisRequest {
  content: string;
  targetKeywords: string[];
  competitorContent?: string;
  analysisType?: 'basic' | 'comprehensive' | 'competitive';
}

export interface BatchRequest {
  requests: Array<{
    type: 'content' | 'conversation' | 'localSEO' | 'product' | 'seoAnalysis';
    data: any;
    priority?: 'low' | 'normal' | 'high';
  }>;
  priority?: 'low' | 'normal' | 'high';
}

class AIGatewayService {
  private openRouter = getOpenRouterClient();
  private requestQueue: Array<{request: any, resolve: Function, reject: Function}> = [];
  private isProcessing = false;

  constructor() {
    this.startQueueProcessor();
  }

  /**
   * Start processing queue for rate limiting
   */
  private startQueueProcessor(): void {
    setInterval(() => {
      if (!this.isProcessing && this.requestQueue.length > 0) {
        this.processQueue();
      }
    }, 100); // Process queue every 100ms
  }

  /**
   * Process queued requests
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const {request, resolve, reject} = this.requestQueue.shift()!;

      try {
        const result = await this.executeRequest(request);
        resolve(result);
      } catch (error) {
        reject(error);
      }

      // Small delay between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    this.isProcessing = false;
  }

  /**
   * Execute individual request
   */
  private async executeRequest(request: any): Promise<AIResponse> {
    switch (request.type) {
      case 'content':
        return this.handleContentOptimization(request.data);
      case 'conversation':
        return this.handleConversation(request.data);
      case 'localSEO':
        return this.handleLocalSEO(request.data);
      case 'product':
        return this.handleProductDescription(request.data);
      case 'seoAnalysis':
        return this.handleSEOAnalysis(request.data);
      default:
        throw new Error(`Unknown request type: ${request.type}`);
    }
  }

  /**
   * Queue request for processing
   */
  private queueRequest<T>(type: string, data: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({
        request: {type, data},
        resolve,
        reject
      });
    });
  }

  /**
   * Handle content optimization requests
   * Consolidates: aiContentOptimizationService + aiFirstContentOptimizationService + dynamicContentOptimizationService
   */
  private async handleContentOptimization(request: ContentOptimizationRequest): Promise<AIResponse> {
    const {content, targetKeywords = [], language = 'de', optimizationGoals = ['seo']} = request;

    // Build system prompt based on optimization goals
    let systemPrompt = `You are an expert content optimizer for ZOE Solar, a German solar energy company. `;

    if (optimizationGoals.includes('seo')) {
      systemPrompt += `Focus on SEO optimization with natural keyword integration. `;
    }
    if (optimizationGoals.includes('readability')) {
      systemPrompt += `Ensure content is easily readable and accessible. `;
    }
    if (optimizationGoals.includes('engagement')) {
      systemPrompt += `Create engaging, compelling content that captures reader attention. `;
    }
    if (optimizationGoals.includes('conversion')) {
      systemPrompt += `Include persuasive elements and clear calls-to-action. `;
    }

    systemPrompt += `

Always respond with properly formatted JSON containing:
- optimizedTitle
- optimizedMetaDescription
- optimizedContent
- keywordDensity (object with keyword percentages)
- readabilityScore (1-100)
- engagementScore (1-100)
- conversionElements (array of conversion-focused elements)
- suggestions (array of improvement suggestions)`;

    const prompt = `Optimize this content for ZOE Solar:

Original Content: ${content}
Target Keywords: ${targetKeywords.join(', ')}
Language: ${language}
Optimization Goals: ${optimizationGoals.join(', ')}

Please provide optimized content that meets all the specified goals.`;

    return this.openRouter.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.4,
      maxTokens: 2500
    });
  }

  /**
   * Handle conversation requests
   * Consolidates: conversationalAIService + aiCustomerService + smartChatAssistant
   */
  private async handleConversation(request: ConversationRequest): Promise<AIResponse> {
    const {userMessage, conversationHistory = [], context = 'ZOE Solar business context', userType = 'customer'} = request;

    let systemPrompt = `You are a helpful AI assistant for ZOE Solar, a leading German solar energy company. `;

    switch (userType) {
      case 'customer':
        systemPrompt += `You're helping an existing customer with service, support, and technical questions. `;
        break;
      case 'prospect':
        systemPrompt += `You're helping a potential customer learn about solar solutions and guide them toward making a decision. `;
        break;
      case 'partner':
        systemPrompt += `You're helping a business partner with collaboration, technical details, and partnership opportunities. `;
        break;
      default:
        systemPrompt += `You're helping general visitors with information about solar energy and ZOE Solar's services. `;
    }

    systemPrompt += `

Your expertise includes:
- Solar panel systems and installations
- Battery storage solutions
- EV charging infrastructure
- Energy optimization and savings
- Government incentives and regulations
- Technical specifications and requirements
- Cost calculations and ROI analysis

Be friendly, professional, and helpful. Provide accurate, detailed information. If you don't know something, admit it and suggest connecting with ZOE Solar's human experts.

Context: ${context}`;

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-5) // Keep last 5 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `${conversationContext ? 'Previous conversation:\n' + conversationContext + '\n\n' : ''}User (${userType}): ${userMessage}`;

    return this.openRouter.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 1200,
      context
    });
  }

  /**
   * Handle local SEO requests
   * Consolidates: localSEOService + geoOptimizationService + googleBusinessProfileService
   */
  private async handleLocalSEO(request: LocalSEORequest): Promise<AIResponse> {
    const {businessType, location, services, targetRadius = 50} = request;

    const systemPrompt = `You are an expert in local SEO for solar energy companies. Create content that helps ZOE Solar dominate local search results and Google Maps rankings.

Always respond with properly formatted JSON containing:
- businessDescription (compelling, locally-focused)
- localKeywords (array of location-specific keywords)
- serviceDescriptions (localized for the area)
- locationSpecificContent (content mentioning local landmarks, climate, regulations)
- googleBusinessProfilePosts (5 engaging posts)
- localBacklinkOpportunities (suggestions for local partnerships)
- serviceAreaDescriptions (for different neighborhoods in the area)
- localFAQ (questions specific to the location)`;

    const prompt = `Generate comprehensive local SEO content for ZOE Solar:

Business Type: ${businessType}
Primary Location: ${location}
Service Radius: ${targetRadius}km
Services: ${services.join(', ')}

Create content that helps ZOE Solar rank #1 in local search results and appear in "solar company near me" searches. Consider local factors like:
- Regional climate and sun conditions
- Local electricity rates and regulations
- Regional incentives and subsidies
- Local competition and market conditions
- Community-specific needs and concerns`;

    return this.openRouter.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.5,
      maxTokens: 2000
    });
  }

  /**
   * Handle product description requests
   * Consolidates: productDescriptionService + aiProductContent + technicalSpecificationWriter
   */
  private async handleProductDescription(request: ProductDescriptionRequest): Promise<AIResponse> {
    const {productType, features, targetAudience, technicalSpecs, usps = []} = request;

    const systemPrompt = `You are an expert copywriter for solar energy products. Create compelling, professional product descriptions that drive conversions.

Always respond with properly formatted JSON containing:
- title (SEO-optimized, compelling)
- shortDescription (1-2 sentences for quick overview)
- detailedDescription (comprehensive, benefit-focused)
- keyFeatures (array of main features with benefits)
- benefits (array of customer benefits)
- technicalSpecs (clear, accessible technical details)
- installationSpecs (installation requirements)
- warrantyInfo (warranty and support details)
- callToAction (persuasive CTA)
- faq (frequently asked questions)
- targetAudiencePainPoints (addressed pain points)`;

    const prompt = `Create a compelling product description for ZOE Solar:

Product Type: ${productType}
Key Features: ${features.join(', ')}
Target Audience: ${targetAudience}
${technicalSpecs ? `Technical Specifications: ${JSON.stringify(technicalSpecs)}` : ''}
${usps.length > 0 ? `Unique Selling Points: ${usps.join(', ')}` : ''}

Write persuasive copy that:
1. Highlights key benefits over features
2. Addresses customer pain points and needs
3. Includes technical details in accessible language
4. Builds trust and credibility
5. Drives purchase decisions
6. Is optimized for search engines
7. Appeals specifically to the target audience`;

    return this.openRouter.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.6,
      maxTokens: 1800
    });
  }

  /**
   * Handle SEO analysis requests
   * Consolidates: seoAnalysisService + contentAnalysisService + competitorAnalysisService
   */
  private async handleSEOAnalysis(request: SEOAnalysisRequest): Promise<AIResponse> {
    const {content, targetKeywords, competitorContent, analysisType = 'comprehensive'} = request;

    let systemPrompt = `You are an expert SEO analyst specializing in solar energy websites. `;

    switch (analysisType) {
      case 'basic':
        systemPrompt += `Provide a basic SEO analysis with key recommendations. `;
        break;
      case 'comprehensive':
        systemPrompt += `Provide a comprehensive SEO analysis with detailed recommendations. `;
        break;
      case 'competitive':
        systemPrompt += `Provide competitive SEO analysis comparing against competitors. `;
        break;
    }

    systemPrompt += `

Always respond with properly formatted JSON containing:
- seoScore (1-100)
- keywordAnalysis (density, placement, variants)
- contentStructure (headings, readability, length)
- technicalSEO (meta tags, schema, internal links)
- contentGaps (missing topics or keywords)
- improvementSuggestions (prioritized recommendations)
- competitorInsights (if competitor content provided)
- localSEOFactors (local optimization opportunities)
- mobileOptimization (mobile-specific recommendations)`;

    let prompt = `Analyze this content for ZOE Solar:

Content to Analyze: ${content}
Target Keywords: ${targetKeywords.join(', ')}
Analysis Type: ${analysisType}`;

    if (competitorContent) {
      prompt += `\n\nCompetitor Content: ${competitorContent}`;
    }

    prompt += `

Provide actionable insights to improve search rankings and user experience.`;

    return this.openRouter.generateContent({
      prompt,
      systemPrompt,
      temperature: 0.3,
      maxTokens: 2000
    });
  }

  /**
   * Public method for content optimization
   */
  async optimizeContent(request: ContentOptimizationRequest): Promise<AIResponse> {
    return this.queueRequest<AIResponse>('content', request);
  }

  /**
   * Public method for conversation
   */
  async generateConversation(request: ConversationRequest): Promise<AIResponse> {
    return this.queueRequest<AIResponse>('conversation', request);
  }

  /**
   * Public method for local SEO
   */
  async generateLocalSEO(request: LocalSEORequest): Promise<AIResponse> {
    return this.queueRequest<AIResponse>('localSEO', request);
  }

  /**
   * Public method for product descriptions
   */
  async generateProductDescription(request: ProductDescriptionRequest): Promise<AIResponse> {
    return this.queueRequest<AIResponse>('product', request);
  }

  /**
   * Public method for SEO analysis
   */
  async analyzeSEO(request: SEOAnalysisRequest): Promise<AIResponse> {
    return this.queueRequest<AIResponse>('seoAnalysis', request);
  }

  /**
   * Handle batch requests
   */
  async handleBatchRequest(request: BatchRequest): Promise<AIResponse[]> {
    const results: AIResponse[] = [];

    // Sort by priority
    const sortedRequests = request.requests.sort((a, b) => {
      const priority: Record<string, number> = { high: 3, normal: 2, low: 1 };
      const aPriority = a.priority || 'normal';
      const bPriority = b.priority || 'normal';
      return (priority[bPriority] || 2) - (priority[aPriority] || 2);
    });

    for (const req of sortedRequests) {
      try {
        const result = await this.queueRequest<AIResponse>(req.type, req.data);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Get service statistics
   */
  getServiceStats(): {
    queueLength: number;
    isProcessing: boolean;
    openRouterStats: any;
  } {
    return {
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessing,
      openRouterStats: this.openRouter.getUsageStats()
    };
  }

  /**
   * Clear request queue
   */
  clearQueue(): void {
    this.requestQueue.forEach(({reject}) => {
      reject(new Error('Request cancelled'));
    });
    this.requestQueue = [];
  }
}

// Singleton instance
let aiGatewayService: AIGatewayService | null = null;

export function getAIGatewayService(): AIGatewayService {
  if (!aiGatewayService) {
    aiGatewayService = new AIGatewayService();
  }
  return aiGatewayService;
}

export default AIGatewayService;
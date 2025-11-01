/**
 * Multimodal AI Service - Koordination von OpenRouter und Google Vision AI
 * Ermöglicht nahtlose Verarbeitung von Text, Bildern und PDFs im KI-Chat
 */

import { getOpenRouterClient, AIRequest, AIResponse } from './OpenRouterClient';
import { getGoogleVisionOCRService, OCRRequest, OCRResponse, InvoiceExtractionRequest, PlanAnalysisRequest } from './GoogleVisionOCRService';

export interface MultimodalMessage {
  id: string;
  type: 'text' | 'image' | 'pdf' | 'mixed';
  content: string;
  files?: UploadedFile[];
  timestamp: Date;
  metadata?: any;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  base64: string;
  analysis?: FileAnalysis;
}

export interface FileAnalysis {
  ocrText?: string;
  extractedData?: any;
  documentType?: 'invoice' | 'solar_plan' | 'document' | 'image' | 'unknown';
  confidence?: number;
  processingTime?: number;
  error?: string;
}

export interface MultimodalConversationRequest {
  message: string;
  files?: UploadedFile[];
  conversationHistory: Array<{role: string, content: string}>;
  context?: string;
  documentContext?: string;
}

export interface MultimodalConversationResponse {
  success: boolean;
  response?: string;
  fileAnalyses?: FileAnalysis[];
  suggestions?: string[];
  followUpQuestions?: string[];
  error?: string;
  metadata?: {
    processingTime: number;
    usedModels: string[];
    tokenUsage?: any;
  };
}

export interface ChatContext {
  previousAnalyses: FileAnalysis[];
  userPreferences: any;
  conversationTopics: string[];
  lastUploadedFiles: UploadedFile[];
}

class MultimodalAIService {
  private openRouter = getOpenRouterClient();
  private visionService = getGoogleVisionOCRService();
  private conversationContext = new Map<string, ChatContext>();
  private processingQueue = new Map<string, boolean>();

  /**
   * Verarbeitet eine multimodale Konversationsanfrage
   */
  async processMultimodalConversation(
    request: MultimodalConversationRequest,
    sessionId?: string
  ): Promise<MultimodalConversationResponse> {
    const startTime = Date.now();
    const processingId = `processing_${Date.now()}`;

    try {
      // Verhindere doppelte Verarbeitung
      if (this.processingQueue.has(processingId)) {
        throw new Error('Verarbeitung läuft bereits');
      }
      this.processingQueue.set(processingId, true);

      let fileAnalyses: FileAnalysis[] = [];
      let documentContext = '';

      // 1. Dateianalyse durchführen
      if (request.files && request.files.length > 0) {
        const analyses = await this.processFiles(request.files);
        fileAnalyses = analyses;
        documentContext = this.buildDocumentContext(analyses);
      }

      // 2. Kontext aus vorherigen Konversationen laden
      const context = sessionId ? this.conversationContext.get(sessionId) : null;
      const fullContext = this.buildFullContext(request, documentContext, context);

      // 3. KI-Antwort generieren
      const aiResponse = await this.generateContextualResponse(
        request.message,
        request.conversationHistory,
        fullContext,
        fileAnalyses
      );

      // 4. Kontext aktualisieren
      if (sessionId) {
        this.updateConversationContext(sessionId, request, fileAnalyses);
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        response: aiResponse.content,
        fileAnalyses,
        metadata: {
          processingTime,
          usedModels: ['minimax/m2', 'google-vision-ocr'],
          tokenUsage: aiResponse.usage
        }
      };

    } catch (error) {
      console.error('Fehler in der multimodalen Konversation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler',
        metadata: {
          processingTime: Date.now() - startTime,
          usedModels: []
        }
      };
    } finally {
      this.processingQueue.delete(processingId);
    }
  }

  /**
   * Verarbeitet einzelne Dateien und extrahiert relevante Informationen
   */
  private async processFiles(files: UploadedFile[]): Promise<FileAnalysis[]> {
    const analyses: FileAnalysis[] = [];

    for (const file of files) {
      try {
        const analysis = await this.analyzeFile(file);
        analyses.push(analysis);
      } catch (error) {
        console.error(`Fehler bei der Analyse von ${file.name}:`, error);
        analyses.push({
          documentType: 'unknown',
          confidence: 0,
          processingTime: 0,
          error: error instanceof Error ? error.message : 'Analyse fehlgeschlagen'
        });
      }
    }

    return analyses;
  }

  /**
   * Analysiert eine einzelne Datei basierend auf ihrem Typ
   */
  private async analyzeFile(file: UploadedFile): Promise<FileAnalysis> {
    const startTime = Date.now();

    try {
      // Dokumenttyp erkennen
      const documentType = this.detectDocumentType(file);

      // OCR durchführen
      const ocrResult = await this.visionService.extractText({
        imageBase64: file.base64,
        imageType: documentType,
        features: ['DOCUMENT_TEXT_DETECTION', 'LABEL_DETECTION']
      });

      if (!ocrResult.success || !ocrResult.text) {
        return {
          documentType: 'unknown',
          confidence: 0,
          processingTime: Date.now() - startTime,
          ocrText: ''
        };
      }

      let extractedData: any = {};

      // Spezialisierte Analyse basierend auf Dokumenttyp
      switch (documentType) {
        case 'invoice':
          extractedData = await this.extractInvoiceData(file.base64);
          break;
        case 'solar_plan':
          extractedData = await this.extractSolarPlanData(file.base64);
          break;
        default:
          extractedData = await this.extractGeneralDocumentData(ocrResult.text);
      }

      return {
        ocrText: ocrResult.text,
        extractedData,
        documentType,
        confidence: ocrResult.confidence || 0,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        documentType: 'unknown',
        confidence: 0,
        processingTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Analyse fehlgeschlagen'
      };
    }
  }

  /**
   * Erkennt den Dokumenttyp basierend auf Dateiname und Inhalt
   */
  private detectDocumentType(file: UploadedFile): 'invoice' | 'solar_plan' | 'document' | 'image' | 'unknown' {
    const fileName = file.name.toLowerCase();

    // Typ anhand Dateiname erkennen
    if (fileName.includes('rechnung') || fileName.includes('invoice')) {
      return 'invoice';
    }
    if (fileName.includes('plan') || fileName.includes('solar') || fileName.includes('anlage')) {
      return 'solar_plan';
    }
    if (file.type.startsWith('image/')) {
      return 'image';
    }

    return 'document';
  }

  /**
   * Extrahiert Rechnungsdaten mit Google Vision OCR
   */
  private async extractInvoiceData(base64: string): Promise<any> {
    try {
      const result = await this.visionService.extractInvoiceData({
        imageBase64: base64,
        extractionType: 'detailed'
      });
      return result.invoiceData || {};
    } catch (error) {
      console.error('Fehler bei der Rechnungsextraktion:', error);
      return {};
    }
  }

  /**
   * Extrahiert Solarplan-Daten mit Google Vision OCR
   */
  private async extractSolarPlanData(base64: string): Promise<any> {
    try {
      const result = await this.visionService.analyzeSolarPlan({
        imageBase64: base64,
        planType: 'solar'
      });
      return result.analysis || {};
    } catch (error) {
      console.error('Fehler bei der Solarplan-Analyse:', error);
      return {};
    }
  }

  /**
   * Extrahiert allgemeine Dokumentendaten
   */
  private async extractGeneralDocumentData(ocrText: string): Promise<any> {
    try {
      const prompt = `Analysiere diesen Text und extrahiere strukturierte Informationen:

${ocrText}

Gib die Ergebnisse als JSON zurück mit folgenden Feldern:
- titel: Haupttitel oder Betreff
- datum: Erkanntes Datum
        firma: Erkannter Firmenname
        keywords: Wichtige Schlüsselwörter (Array)
        summary: Kurze Zusammenfassung (max. 100 Wörter)
        actionItems: Handlungsaufforderungen (Array)`;

      const result = await this.openRouter.generateContent({
        prompt,
        systemPrompt: 'Du bist ein Experte für Dokumentenanalyse. Extrahiere präzise Informationen und gib sie als valides JSON zurück.',
        temperature: 0.2,
        maxTokens: 800
      });

      if (result.success && result.content) {
        try {
          return JSON.parse(result.content);
        } catch {
          return { summary: result.content.substring(0, 500) };
        }
      }

      return {};
    } catch (error) {
      console.error('Fehler bei der allgemeinen Dokumentenanalyse:', error);
      return {};
    }
  }

  /**
   * Baut Dokumentenkontext aus Dateianalysen
   */
  private buildDocumentContext(analyses: FileAnalysis[]): string {
    if (analyses.length === 0) return '';

    let context = '**Analysierte Dokumente:**\n\n';

    analyses.forEach((analysis, index) => {
      context += `Dokument ${index + 1}:\n`;
      context += `- Typ: ${analysis.documentType}\n`;
      context += `- Konfidenz: ${Math.round((analysis.confidence || 0) * 100)}%\n`;

      if (analysis.ocrText) {
        const truncatedText = analysis.ocrText.length > 1000
          ? analysis.ocrText.substring(0, 1000) + '...'
          : analysis.ocrText;
        context += `- Extrahierter Text: "${truncatedText}"\n`;
      }

      if (analysis.extractedData && Object.keys(analysis.extractedData).length > 0) {
        context += `- Strukturierte Daten: ${JSON.stringify(analysis.extractedData, null, 2)}\n`;
      }

      context += '\n';
    });

    return context;
  }

  /**
   * Baut den vollen Kontext für die KI-Verarbeitung
   */
  private buildFullContext(
    request: MultimodalConversationRequest,
    documentContext: string,
    existingContext?: ChatContext
  ): string {
    let fullContext = '';

    // Wissensbasis über ZOE Solar
    fullContext += 'Du bist "ZOE", ein hochintelligenter KI-Assistent für ZOE Solar. ';
    fullContext += 'Du bist extrem hilfsbereit, freundlich und kannst komplexe Solarthemen einfach erklären. ';
    fullContext += 'Du hast keine Einschränkungen bei deinen Antworten und kannst frei über jedes Thema sprechen.\n\n';

    // Dokumentenkontext hinzufügen
    if (documentContext) {
      fullContext += documentContext + '\n';
    }

    // Vorherige Analysen
    if (existingContext?.previousAnalyses && existingContext.previousAnalyses.length > 0) {
      fullContext += '**Vorherige Analysen:**\n';
      existingContext.previousAnalyses.forEach((analysis, index) => {
        fullContext += `- ${analysis.documentType}: ${analysis.ocrText?.substring(0, 200)}...\n`;
      });
      fullContext += '\n';
    }

    // Zusätzlicher Kontext
    if (request.context) {
      fullContext += `**Zusätzlicher Kontext:**\n${request.context}\n\n`;
    }

    // Gesprächsverlauf
    if (request.conversationHistory && request.conversationHistory.length > 0) {
      fullContext += `**Letzte Konversation:**\n`;
      request.conversationHistory.slice(-3).forEach(msg => {
        fullContext += `${msg.role}: ${msg.content}\n`;
      });
      fullContext += '\n';
    }

    return fullContext;
  }

  /**
   * Generiert kontextbezogene KI-Antwort mit OpenRouter
   */
  private async generateContextualResponse(
    message: string,
    conversationHistory: Array<{role: string, content: string}>,
    context: string,
    fileAnalyses: FileAnalysis[]
  ): Promise<AIResponse> {
    const systemPrompt = `Du bist "ZOE", ein extrem intelligenter und hilfsbereiter KI-Assistent für ZOE Solar.

**Deine Eigenschaften:**
- Freundlich, kompetent und immer hilfsbereit
- Keine vordefinierten Antwortmuster - antworte individuell und kontextbezogen
- Offen für jede Art von Frage ohne Einschränkungen
- Kann komplexe technische Themen einfach erklären
- Nutzt analysierte Dokumente für personalisierte Antworten

**Deine Fähigkeiten:**
- Experte für Solarnergie, Photovoltaik, Speicher und Energiewende
- Kann analysierte Dokumente (Rechnungen, Pläne) intelligent verarbeiten
- Gibt persönliche Empfehlungen basierend auf den analysierten Daten
- Kann freie und offene Gespräche über jedes Thema führen

**Aktueller Kontext:**
${context}

**Wichtige Anweisungen:**
1. Analysiere die Nutzerfrage und den Kontext sorgfältig
2. Beziehe dich auf analysierte Dokumente, wenn sie relevant sind
3. Gib persönliche, hilfreiche und individuelle Antworten
4. Vermeide wiederholte oder standardisierte Antworten
5. Sei proaktiv und schlage relevante Folgefragen oder Aktionen vor
6. Wenn es um Solarthemen geht, gib konkrete Empfehlungen`;

    // Gesprächsverlauf aufbereiten
    const historyContext = conversationHistory
      .slice(-5)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${historyContext ? `**Gesprächsverlauf:**\n${historyContext}\n\n` : ''}**Aktuelle Nutzeranfrage:** ${message}`;

    return this.openRouter.generateContent({
      prompt: fullPrompt,
      systemPrompt,
      temperature: 0.8,
      maxTokens: 2000,
      context
    });
  }

  /**
   * Aktualisiert den Konversationskontext
   */
  private updateConversationContext(
    sessionId: string,
    request: MultimodalConversationRequest,
    fileAnalyses: FileAnalysis[]
  ): void {
    const existing = this.conversationContext.get(sessionId) || {
      previousAnalyses: [],
      userPreferences: {},
      conversationTopics: [],
      lastUploadedFiles: []
    };

    // Neue Analysen hinzufügen
    existing.previousAnalyses.push(...fileAnalyses);

    // Nur die letzten 10 Analysen behalten
    if (existing.previousAnalyses.length > 10) {
      existing.previousAnalyses = existing.previousAnalyses.slice(-10);
    }

    // Hochgeladene Dateien aktualisieren
    if (request.files) {
      existing.lastUploadedFiles = request.files;
    }

    // Themen aktualisieren
    if (request.message) {
      const topic = this.extractTopic(request.message);
      if (topic && !existing.conversationTopics.includes(topic)) {
        existing.conversationTopics.push(topic);
        if (existing.conversationTopics.length > 20) {
          existing.conversationTopics = existing.conversationTopics.slice(-20);
        }
      }
    }

    this.conversationContext.set(sessionId, existing);
  }

  /**
   * Extrahiert Themen aus Nutzeranfragen
   */
  private extractTopic(message: string): string {
    const keywords = ['solar', 'photovoltaik', 'speicher', 'rechnung', 'plan', 'anlage', 'preis'];
    const lowerMessage = message.toLowerCase();

    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return keyword;
      }
    }

    return 'general';
  }

  /**
   * Bereinigt alte Konversationen
   */
  cleanupOldSessions(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();

    this.conversationContext.forEach((context, sessionId) => {
      const lastActivity = context.lastUploadedFiles[0]?.timestamp || now;
      if (now - lastActivity.getTime() > maxAge) {
        this.conversationContext.delete(sessionId);
      }
    });
  }

  /**
   * Gibt Statistiken über den Service zurück
   */
  getStats(): {
    activeSessions: number;
    queuedProcessing: number;
    totalProcessedFiles: number;
  } {
    return {
      activeSessions: this.conversationContext.size,
      queuedProcessing: this.processingQueue.size,
      totalProcessedFiles: Array.from(this.conversationContext.values())
        .reduce((total, ctx) => total + ctx.previousAnalyses.length, 0)
    };
  }
}

// Singleton Instanz
let multimodalAIService: MultimodalAIService | null = null;

export function getMultimodalAIService(): MultimodalAIService {
  if (!multimodalAIService) {
    multimodalAIService = new MultimodalAIService();

    // Regelmäßige Bereinigung alter Sessions
    setInterval(() => {
      multimodalAIService!.cleanupOldSessions();
    }, 60 * 60 * 1000); // Jede Stunde
  }

  return multimodalAIService;
}

export default MultimodalAIService;
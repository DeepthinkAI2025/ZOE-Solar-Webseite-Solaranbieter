/**
 * Google Vision AI OCR Service - Spezialisiert für Dokumentenverarbeitung
 * Bleibt erhalten für kritische OCR-Funktionen im Solar-Business
 * Wird für Dokumentenanalyse, Rechnungserkennung und Planauswertung verwendet
 */

export interface OCRRequest {
  imageBase64: string;
  imageType?: 'document' | 'invoice' | 'plan' | 'certificate' | 'general';
  languageHints?: string[]; // z.B. ['de', 'en']
  features?: ('TEXT_DETECTION' | 'DOCUMENT_TEXT_DETECTION' | 'LABEL_DETECTION')[];
}

export interface OCRResponse {
  success: boolean;
  text?: string;
  confidence?: number;
  boundingBoxes?: Array<{
    text: string;
    confidence: number;
    vertices: Array<{x: number, y: number}>;
  }>;
  labels?: Array<{
    description: string;
    confidence: number;
  }>;
  metadata?: {
    mimeType: string;
    pagesDetected?: number;
    textBlocks?: number;
    processingTime: number;
  };
  error?: string;
}

export interface InvoiceExtractionRequest {
  imageBase64: string;
  extractionType?: 'basic' | 'detailed' | 'financial';
}

export interface InvoiceData {
  invoiceNumber?: string;
  date?: string;
  vendor?: string;
  totalAmount?: number;
  taxAmount?: number;
  lineItems?: Array<{
    description: string;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
  }>;
  paymentTerms?: string;
  dueDate?: string;
}

export interface PlanAnalysisRequest {
  imageBase64: string;
  planType?: 'solar' | 'electrical' | 'construction' | 'general';
}

export interface PlanAnalysisResult {
  detectedElements?: Array<{
    type: string;
    confidence: number;
    coordinates: Array<{x: number, y: number}>;
  }>;
  dimensions?: Array<{
    measurement: string;
    location: string;
  }>;
  annotations?: string[];
  scale?: number;
  units?: string;
}

// Neue Interfaces für multimodale Erweiterung
export interface MultimodalAnalysisRequest {
  files: Array<{
    id: string;
    name: string;
    type: string;
    base64: string;
  }>;
  analysisTypes?: Array<'text' | 'objects' | 'labels' | 'faces' | 'documents' | 'handwriting'>;
  context?: string;
  priority?: 'speed' | 'accuracy';
}

export interface MultimodalAnalysisResult {
  success: boolean;
  results?: Array<{
    fileId: string;
    fileName: string;
    analysis: {
      extractedText?: string;
      detectedObjects?: Array<{
        name: string;
        confidence: number;
        boundingBox: Array<{x: number, y: number}>;
      }>;
      detectedLabels?: Array<{
        description: string;
        confidence: number;
      }>;
      documentAnalysis?: {
        documentType: string;
        keyValues: Array<{key: string, value: string}>;
        entities: Array<{text: string, type: string, confidence: number}>;
      };
      confidence: number;
      processingTime: number;
    };
  }>;
  combinedInsights?: {
    overallTheme: string;
    extractedData: any;
    recommendations: string[];
    questions: string[];
  };
  error?: string;
  metadata?: {
    totalProcessingTime: number;
    usedFeatures: string[];
    languageDetected: string;
  };
}

export interface SmartDocumentInsight {
  category: 'invoice' | 'contract' | 'technical_spec' | 'solar_plan' | 'energy_bill' | 'unknown';
  confidence: number;
  extractedData: any;
  actionableInsights: string[];
  suggestedQuestions: string[];
  relevantForSolarPlanning: boolean;
}

class GoogleVisionOCRService {
  private apiKey: string;
  private baseUrl = 'https://vision.googleapis.com/v1';
  private cache = new Map<string, OCRResponse>();

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generische OCR-Anfrage an Google Vision API
   */
  private async makeVisionRequest(imageBase64: string, features: any[]): Promise<any> {
    const requestPayload = {
      requests: [{
        image: {
          content: imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')
        },
        features: features,
        imageContext: {
          languageHints: ['de', 'en-Latn']
        }
      }]
    };

    const response = await fetch(`${this.baseUrl}/images:annotate?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Google Vision API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Texterkennung aus Bildern
   */
  async extractText(request: OCRRequest): Promise<OCRResponse> {
    const startTime = Date.now();

    try {
      // Cache Key generieren
      const cacheKey = this.generateCacheKey(request.imageBase64, request.imageType || 'general');
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!;
      }

      const features = request.features || [
        { type: request.imageType === 'document' || request.imageType === 'unknown' ? 'DOCUMENT_TEXT_DETECTION' : 'TEXT_DETECTION', maxResults: 10 }
      ];

      // Sprachhinweise hinzufügen
      const languageHints = request.languageHints || ['de', 'en-Latn'];

      const result = await this.makeVisionRequest(request.imageBase64, features);

      if (!result.responses || !result.responses[0]) {
        throw new Error('Ungültige Antwort von Google Vision API');
      }

      const response = result.responses[0];
      const processingTime = Date.now() - startTime;

      // Text auslesen
      let text = '';
      let confidence = 0;
      let boundingBoxes: any[] = [];
      let textBlocks = 0;

      if (response.fullTextAnnotation) {
        text = response.fullTextAnnotation.text;

        // Bounding Boxes und Confidence extrahieren
        if (response.fullTextAnnotation.pages) {
          response.fullTextAnnotation.pages.forEach((page: any) => {
            if (page.blocks) {
              textBlocks += page.blocks.length;
              page.blocks.forEach((block: any) => {
                if (block.paragraphs) {
                  block.paragraphs.forEach((paragraph: any) => {
                    if (paragraph.words) {
                      paragraph.words.forEach((word: any) => {
                        const wordText = word.symbols?.map((s: any) => s.text).join('') || '';
                        const wordConfidence = word.confidence || 0;

                        if (word.boundingBox?.vertices) {
                          boundingBoxes.push({
                            text: wordText,
                            confidence: wordConfidence,
                            vertices: word.boundingBox.vertices
                          });
                        }

                        confidence = Math.max(confidence, wordConfidence);
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }

      // Labels extrahieren (falls vorhanden)
      let labels: any[] = [];
      if (response.labelAnnotations) {
        labels = response.labelAnnotations.map((label: any) => ({
          description: label.description,
          confidence: label.score
        }));
      }

      const ocrResponse: OCRResponse = {
        success: true,
        text: text || '',
        confidence: confidence,
        boundingBoxes: boundingBoxes,
        labels: labels,
        metadata: {
          mimeType: 'image/jpeg',
          pagesDetected: response.fullTextAnnotation?.pages?.length || 1,
          textBlocks: textBlocks,
          processingTime: processingTime
        }
      };

      // Cache aktualisieren
      this.cache.set(cacheKey, ocrResponse);

      // Cache-Limit
      if (this.cache.size > 50) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      return ocrResponse;

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler bei der OCR-Analyse'
      };
    }
  }

  /**
   * Rechnungsinformationen extrahieren (Solarbranche-spezifisch)
   */
  async extractInvoiceData(request: InvoiceExtractionRequest): Promise<{
    success: boolean;
    invoiceData?: InvoiceData;
    ocrText?: string;
    error?: string;
  }> {
    try {
      // Zuerst Text extrahieren
      const ocrResult = await this.extractText({
        imageBase64: request.imageBase64,
        imageType: 'invoice',
        features: ['DOCUMENT_TEXT_DETECTION']
      });

      if (!ocrResult.success || !ocrResult.text) {
        return {
          success: false,
          error: 'Konnte keinen Text aus der Rechnung extrahieren',
          ocrText: ocrResult.text || ''
        };
      }

      // Text mit OpenRouter analysieren für strukturierte Datenextraktion
      const { getOpenRouterClient } = require('./OpenRouterClient');
      const openRouter = getOpenRouterClient();

      const prompt = `Extrahiere strukturierte Daten aus dieser Solar-Rechnung. Analysiere den folgenden Text und gib die Informationen als JSON zurück:

Rechnungstext:
${ocrResult.text}

Extrahiere folgende Informationen:
- Rechnungsnummer
- Datum
- Lieferant/Unternehmen
- Gesamtbetrag
- Steuerbetrag
- Positionsdaten (Artikel, Menge, Preis)
- Zahlungsbedingungen
- Fälligkeitsdatum

Antworte NUR mit gültigem JSON Format:
{
  "invoiceNumber": "...",
  "date": "...",
  "vendor": "...",
  "totalAmount": 0.00,
  "taxAmount": 0.00,
  "lineItems": [
    {
      "description": "...",
      "quantity": 0,
      "unitPrice": 0.00,
      "totalPrice": 0.00
    }
  ],
  "paymentTerms": "...",
  "dueDate": "..."
}`;

      const aiResult = await openRouter.generateContent({
        prompt,
        systemPrompt: 'Du bist ein Experte für die Analyse von Solar-Rechnungen. Extrahiere präzise Finanzdaten und gib sie als JSON zurück.',
        temperature: 0.1,
        maxTokens: 1000
      });

      if (aiResult.success && aiResult.content) {
        try {
          const invoiceData = JSON.parse(aiResult.content);
          return {
            success: true,
            invoiceData,
            ocrText: ocrResult.text
          };
        } catch (parseError) {
          // Wenn JSON-Parsing fehlschlägt, Basis-Informationen zurückgeben
          return {
            success: true,
            invoiceData: this.extractBasicInvoiceInfo(ocrResult.text),
            ocrText: ocrResult.text
          };
        }
      }

      // Fallback: Basis-Extraktion
      return {
        success: true,
        invoiceData: this.extractBasicInvoiceInfo(ocrResult.text),
        ocrText: ocrResult.text
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Fehler bei der Rechnungsextraktion'
      };
    }
  }

  /**
   * Solarplan-Analyse
   */
  async analyzeSolarPlan(request: PlanAnalysisRequest): Promise<{
    success: boolean;
    analysis?: PlanAnalysisResult;
    ocrText?: string;
    error?: string;
  }> {
    try {
      const ocrResult = await this.extractText({
        imageBase64: request.imageBase64,
        imageType: 'plan',
        features: ['DOCUMENT_TEXT_DETECTION', 'LABEL_DETECTION']
      });

      if (!ocrResult.success) {
        return {
          success: false,
          error: 'Konnte den Solarplan nicht analysieren'
        };
      }

      // Mit OpenRouter Plan analysieren
      const { getOpenRouterClient } = require('./OpenRouterClient');
      const openRouter = getOpenRouterClient();

      const prompt = `Analysiere diesen Solarplan und extrahiere technische Informationen. Plan-Text und erkannte Elemente:

${ocrResult.text}

Erkannte Labels: ${ocrResult.labels?.map(l => l.description).join(', ') || 'Keine'}

Extrahiere:
- Erkannte Solarelemente (Module, Wechselrichter, etc.)
- Abmessungen und Maße
- technische Spezifikationen
- Skalierungsinformationen
- wichtige Anmerkungen

Antworte mit JSON:
{
  "detectedElements": [
    {
      "type": "Solar-Modul",
      "confidence": 0.95,
      "coordinates": [{"x": 100, "y": 200}]
    }
  ],
  "dimensions": [
    {
      "measurement": "10m x 5m",
      "location": "Dachfläche"
    }
  ],
  "annotations": ["...", "..."],
  "scale": 1.0,
  "units": "Meter"
}`;

      const aiResult = await openRouter.generateContent({
        prompt,
        systemPrompt: 'Du bist ein Experte für die Analyse von Solarplänen. Identifiziere technische Komponenten und Maße präzise.',
        temperature: 0.2,
        maxTokens: 1500
      });

      if (aiResult.success && aiResult.content) {
        try {
          const analysis = JSON.parse(aiResult.content);
          return {
            success: true,
            analysis,
            ocrText: ocrResult.text
          };
        } catch (parseError) {
          return {
            success: true,
            analysis: {
              detectedElements: [],
              dimensions: [],
              annotations: [ocrResult.text.substring(0, 500)],
              scale: 1.0,
              units: 'Unbekannt'
            },
            ocrText: ocrResult.text
          };
        }
      }

      return {
        success: true,
        analysis: {
          detectedElements: [],
          dimensions: [],
          annotations: ['Plan analysiert, aber keine detaillierte Extraktion möglich'],
          scale: 1.0,
          units: 'Unbekannt'
        },
        ocrText: ocrResult.text
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Fehler bei der Plananalyse'
      };
    }
  }

  /**
   * Basis-Rechnungsinformationen per Regex extrahieren (Fallback)
   */
  private extractBasicInvoiceInfo(text: string): InvoiceData {
    const invoiceData: InvoiceData = {};

    // Rechnungsnummer
    const invoiceNumberMatch = text.match(/Rechnung\s*[:#]?\s*([A-Z0-9\-\/]+)/i);
    if (invoiceNumberMatch) {
      invoiceData.invoiceNumber = invoiceNumberMatch[1];
    }

    // Datum
    const dateMatch = text.match(/(\d{2}\.\d{2}\.\d{4}|\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      invoiceData.date = dateMatch[1];
    }

    // Gesamtbetrag
    const amountMatch = text.match(/Gesamtbetrag[:\s]*([0-9.,]+)\s*€/i);
    if (amountMatch) {
      invoiceData.totalAmount = parseFloat(amountMatch[1].replace(',', '.'));
    }

    return invoiceData;
  }

  /**
   * Cache Key generieren
   */
  private generateCacheKey(imageBase64: string, type: string): string {
    // Ersten 100 Zeichen des Base64-Codes als Key verwenden
    const imageHash = imageBase64.substring(0, 100);
    return `${type}-${imageHash}`;
  }

  /**
   * Multimodale Analyse für mehrere Dateien
   */
  async analyzeMultimodalDocuments(request: MultimodalAnalysisRequest): Promise<MultimodalAnalysisResult> {
    const startTime = Date.now();
    const analysisTypes = request.analysisTypes || ['text', 'labels', 'documents'];
    const results: MultimodalAnalysisResult['results'] = [];

    try {
      // Dateien einzeln analysieren
      for (const file of request.files) {
        const fileResult = await this.analyzeSingleFileMultimodal(file, analysisTypes, request.context);
        results.push(fileResult);
      }

      // Kombinierte Erkenntnisse generieren
      const combinedInsights = await this.generateCombinedInsights(results, request.context);

      return {
        success: true,
        results,
        combinedInsights,
        metadata: {
          totalProcessingTime: Date.now() - startTime,
          usedFeatures: analysisTypes,
          languageDetected: this.detectPrimaryLanguage(results)
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler bei der multimodalen Analyse',
        metadata: {
          totalProcessingTime: Date.now() - startTime,
          usedFeatures: [],
          languageDetected: 'unknown'
        }
      };
    }
  }

  /**
   * Analysiert eine einzelne Datei multimodal
   */
  private async analyzeSingleFileMultimodal(
    file: { id: string; name: string; type: string; base64: string },
    analysisTypes: Array<string>,
    context?: string
  ): Promise<MultimodalAnalysisResult['results'][0]> {
    const startTime = Date.now();
    const analysis: any = {
      confidence: 0,
      processingTime: 0
    };

    try {
      // Textextraktion
      if (analysisTypes.includes('text') || analysisTypes.includes('documents')) {
        const ocrResult = await this.extractText({
          imageBase64: file.base64,
          imageType: this.detectImageType(file.name, file.type),
          features: analysisTypes.includes('documents') ? ['DOCUMENT_TEXT_DETECTION'] : ['TEXT_DETECTION']
        });

        if (ocrResult.success) {
          analysis.extractedText = ocrResult.text;
          analysis.confidence = Math.max(analysis.confidence, ocrResult.confidence || 0);
        }
      }

      // Objekterkennung
      if (analysisTypes.includes('objects')) {
        const objects = await this.detectObjects(file.base64);
        if (objects.length > 0) {
          analysis.detectedObjects = objects;
          analysis.confidence = Math.max(analysis.confidence, Math.max(...objects.map(o => o.confidence)));
        }
      }

      // Label-Erkennung
      if (analysisTypes.includes('labels')) {
        const labels = await this.detectLabels(file.base64);
        if (labels.length > 0) {
          analysis.detectedLabels = labels;
          analysis.confidence = Math.max(analysis.confidence, Math.max(...labels.map(l => l.confidence)));
        }
      }

      // Dokumentenanalyse
      if (analysisTypes.includes('documents') && analysis.extractedText) {
        const documentAnalysis = await this.analyzeDocumentStructure(analysis.extractedText, file.name, context);
        analysis.documentAnalysis = documentAnalysis;
      }

      analysis.processingTime = Date.now() - startTime;

      return {
        fileId: file.id,
        fileName: file.name,
        analysis
      };

    } catch (error) {
      analysis.processingTime = Date.now() - startTime;
      return {
        fileId: file.id,
        fileName: file.name,
        analysis: {
          ...analysis,
          error: error instanceof Error ? error.message : 'Fehler bei der Analyse'
        }
      };
    }
  }

  /**
   * Erkennt Objekte in Bildern
   */
  private async detectObjects(imageBase64: string): Promise<Array<{name: string, confidence: number, boundingBox: Array<{x: number, y: number}>}>> {
    try {
      const features = [{ type: 'OBJECT_LOCALIZATION', maxResults: 10 }];
      const result = await this.makeVisionRequest(imageBase64, features);

      if (result.responses && result.responses[0]?.localizedObjectAnnotations) {
        return result.responses[0].localizedObjectAnnotations.map((obj: any) => ({
          name: obj.name,
          confidence: obj.score,
          boundingBox: obj.boundingPoly?.normalizedVertices || []
        }));
      }

      return [];
    } catch (error) {
      console.error('Fehler bei der Objekterkennung:', error);
      return [];
    }
  }

  /**
   * Erkennt Labels in Bildern
   */
  private async detectLabels(imageBase64: string): Promise<Array<{description: string, confidence: number}>> {
    try {
      const features = [{ type: 'LABEL_DETECTION', maxResults: 15 }];
      const result = await this.makeVisionRequest(imageBase64, features);

      if (result.responses && result.responses[0]?.labelAnnotations) {
        return result.responses[0].labelAnnotations.map((label: any) => ({
          description: label.description,
          confidence: label.score
        }));
      }

      return [];
    } catch (error) {
      console.error('Fehler bei der Label-Erkennung:', error);
      return [];
    }
  }

  /**
   * Analysiert die Dokumentenstruktur
   */
  private async analyzeDocumentStructure(text: string, fileName: string, context?: string): Promise<{
    documentType: string;
    keyValues: Array<{key: string, value: string}>;
    entities: Array<{text: string, type: string, confidence: number}>;
  }> {
    try {
      const { getOpenRouterClient } = require('./OpenRouterClient');
      const openRouter = getOpenRouterClient();

      const prompt = `Analysiere diesen Text aus dem Dokument "${fileName}" und extrahiere strukturierte Informationen:

${text.substring(0, 2000)}${text.length > 2000 ? '...' : ''}

${context ? `Kontext: ${context}` : ''}

Gib die Ergebnisse als JSON zurück mit:
- documentType: Art des Dokuments (Rechnung, Vertrag, technisches Datenblatt, etc.)
- keyValues: Wichtige Schlüssel-Wert-Paare (Array von {key, value})
- entities: Erkannte Entitäten (Array von {text, type, confidence})

Beispiel für keyValues: [{"key": "Rechnungsnummer", "value": "R-2024-001"}]`;

      const result = await openRouter.generateContent({
        prompt,
        systemPrompt: 'Du bist ein Experte für Dokumentenanalyse. Extrahiere präzise Informationen und gib sie als valides JSON zurück.',
        temperature: 0.2,
        maxTokens: 1000
      });

      if (result.success && result.content) {
        try {
          return JSON.parse(result.content);
        } catch {
          return {
            documentType: 'unknown',
            keyValues: [],
            entities: []
          };
        }
      }

      return {
        documentType: 'unknown',
        keyValues: [],
        entities: []
      };

    } catch (error) {
      console.error('Fehler bei der Dokumentenstrukturanalyse:', error);
      return {
        documentType: 'unknown',
        keyValues: [],
        entities: []
      };
    }
  }

  /**
   * Generiert kombinierte Erkenntnisse aus mehreren Dokumenten
   */
  private async generateCombinedInsights(
    results: MultimodalAnalysisResult['results'],
    context?: string
  ): Promise<{
    overallTheme: string;
    extractedData: any;
    recommendations: string[];
    questions: string[];
  }> {
    try {
      const { getOpenRouterClient } = require('./OpenRouterClient');
      const openRouter = getOpenRouterClient();

      // Alle extrahierten Texte sammeln
      const allTexts = results
        .filter(r => r.analysis.extractedText)
        .map(r => `Aus "${r.fileName}":\n${r.analysis.extractedText?.substring(0, 1000)}...`)
        .join('\n\n');

      if (!allTexts) {
        return {
          overallTheme: 'Keine analysierbaren Inhalte gefunden',
          extractedData: {},
          recommendations: ['Bitte laden Sie Dokumente mit klar lesbarem Text hoch.'],
          questions: ['Welche Informationen möchten Sie aus diesen Dokumenten extrahieren?']
        };
      }

      const prompt = `Analysiere diese gesammelten Dokumenteninhalte und gib intelligente, kombinierte Erkenntnisse:

${allTexts}

${context ? `Zusätzlicher Kontext: ${context}` : ''}

Gib die Ergebnisse als JSON zurück mit:
- overallTheme: Das Hauptthema oder die Dokumentenart
- extractedData: Wichtigste konsolidierte Daten
- recommendations: 3-5 konkrete Empfehlungen für ZOE Solar
- questions: 2-3 relevante Fragen, die an den Nutzer gestellt werden könnten

Fokussiere dich auf Solarrelevante Informationen: Kosten, technische Daten, Standorte, Verträge, etc.`;

      const result = await openRouter.generateContent({
        prompt,
        systemPrompt: 'Du bist ein Experte für Solaranlagen und Dokumentenanalyse. Identifiziere relevante Informationen und gib praktische Empfehlungen.',
        temperature: 0.3,
        maxTokens: 1500
      });

      if (result.success && result.content) {
        try {
          return JSON.parse(result.content);
        } catch {
          return {
            overallTheme: 'Dokumente analysiert',
            extractedData: {},
            recommendations: ['Dokumente wurden erfolgreich verarbeitet.'],
            questions: ['Haben Sie Fragen zu den analysierten Dokumenten?']
          };
        }
      }

      return {
        overallTheme: 'Analyse abgeschlossen',
        extractedData: {},
        recommendations: ['Dokumente wurden analysiert.'],
        questions: ['Welche weiteren Informationen benötigen Sie?']
      };

    } catch (error) {
      console.error('Fehler bei der Generierung kombinierter Erkenntnisse:', error);
      return {
        overallTheme: 'Fehler bei der Analyse',
        extractedData: {},
        recommendations: ['Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.'],
        questions: []
      };
    }
  }

  /**
   * Erzeugt intelligente Dokumenten-Einsichten
   */
  async generateSmartDocumentInsight(file: {
    name: string;
    type: string;
    base64: string;
  }): Promise<SmartDocumentInsight> {
    try {
      // OCR durchführen
      const ocrResult = await this.extractText({
        imageBase64: file.base64,
        imageType: this.detectImageType(file.name, file.type),
        features: ['DOCUMENT_TEXT_DETECTION', 'LABEL_DETECTION']
      });

      if (!ocrResult.success || !ocrResult.text) {
        return {
          category: 'unknown',
          confidence: 0,
          extractedData: {},
          actionableInsights: [],
          suggestedQuestions: [],
          relevantForSolarPlanning: false
        };
      }

      // KI-basierte Analyse
      const { getOpenRouterClient } = require('./OpenRouterClient');
      const openRouter = getOpenRouterClient();

      const prompt = `Analysiere dieses Dokument und klassifiziere es für ZOE Solar:

Dateiname: ${file.name}
Typ: ${file.type}
Extrahierter Text: ${ocrResult.text.substring(0, 1500)}${ocrResult.text.length > 1500 ? '...' : ''}

Gib die Ergebnisse als JSON zurück mit:
- category: Eine dieser Kategorien: "invoice", "contract", "technical_spec", "solar_plan", "energy_bill", "unknown"
- confidence: Wie sicher du dir bei der Klassifizierung bist (0-1)
- extractedData: Wichtigste extrahierte Daten
- actionableInsights: 2-3 konkrete Handlungsempfehlungen für ZOE Solar
- suggestedQuestions: 2-3 Fragen, die an den Kunden gestellt werden könnten
- relevantForSolarPlanning: Ob dieses Dokument für die Solarplanung relevant ist (true/false)`;

      const result = await openRouter.generateContent({
        prompt,
        systemPrompt: 'Du bist ein Experte für Dokumentenanalyse im Solarbereich. Klassifiziere Dokumente präzise und gib praktische Empfehlungen.',
        temperature: 0.2,
        maxTokens: 1200
      });

      if (result.success && result.content) {
        try {
          const insight = JSON.parse(result.content);
          return {
            category: insight.category || 'unknown',
            confidence: insight.confidence || 0,
            extractedData: insight.extractedData || {},
            actionableInsights: insight.actionableInsights || [],
            suggestedQuestions: insight.suggestedQuestions || [],
            relevantForSolarPlanning: insight.relevantForSolarPlanning || false
          };
        } catch {
          return {
            category: 'unknown',
            confidence: 0,
            extractedData: { text: ocrResult.text.substring(0, 500) },
            actionableInsights: ['Dokument wurde analysiert, aber keine spezifische Klassifizierung möglich.'],
            suggestedQuestions: ['Welche Informationen aus diesem Dokument sind für Sie relevant?'],
            relevantForSolarPlanning: false
          };
        }
      }

      return {
        category: 'unknown',
        confidence: 0,
        extractedData: {},
        actionableInsights: [],
        suggestedQuestions: [],
        relevantForSolarPlanning: false
      };

    } catch (error) {
      console.error('Fehler bei der intelligenten Dokumentenanalyse:', error);
      return {
        category: 'unknown',
        confidence: 0,
        extractedData: {},
        actionableInsights: ['Fehler bei der Dokumentenanalyse.'],
        suggestedQuestions: [],
        relevantForSolarPlanning: false
      };
    }
  }

  /**
   * Hilfsmethoden
   */
  private detectImageType(fileName: string, mimeType: string): 'document' | 'invoice' | 'plan' | 'certificate' | 'general' | 'unknown' {
    const name = fileName.toLowerCase();
    const type = mimeType.toLowerCase();

    if (name.includes('rechnung') || name.includes('invoice')) return 'invoice';
    if (name.includes('plan') || name.includes('solar')) return 'plan';
    if (name.includes('zertifikat') || name.includes('certificate')) return 'certificate';
    if (type.includes('pdf') || type.includes('document')) return 'document';
    if (type.includes('image')) return 'general';
    return 'unknown';
  }

  private detectPrimaryLanguage(results: MultimodalAnalysisResult['results']): string {
    // Vereinfachte Spracherkennung basierend auf Textinhalten
    for (const result of results) {
      if (result.analysis.extractedText) {
        const text = result.analysis.extractedText.substring(0, 500);
        if (text.includes('der') || text.includes('die') || text.includes('und')) return 'de';
        if (text.includes('the') || text.includes('and') || text.includes('you')) return 'en';
      }
    }
    return 'unknown';
  }

  /**
   * Service-Statistiken
   */
  getStats(): {
    cacheSize: number;
    supportedFormats: string[];
    apiEndpoint: string;
  } {
    return {
      cacheSize: this.cache.size,
      supportedFormats: ['JPEG', 'PNG', 'GIF', 'BMP', 'WEBP'],
      apiEndpoint: this.baseUrl
    };
  }

  /**
   * Cache leeren
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton Instanz
let googleVisionOCRService: GoogleVisionOCRService | null = null;

export function getGoogleVisionOCRService(): GoogleVisionOCRService {
  if (!googleVisionOCRService) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is required for OCR functionality');
    }

    googleVisionOCRService = new GoogleVisionOCRService(apiKey);
  }

  return googleVisionOCRService;
}

export default GoogleVisionOCRService;
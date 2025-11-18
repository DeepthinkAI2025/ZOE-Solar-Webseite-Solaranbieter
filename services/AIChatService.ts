// Using a more generic type for now since we're using OpenRouter/Mistral instead of Google GenAI
type GenerateContentResponse = {
  text: string;
  candidates?: Array<{ groundingMetadata?: { groundingChunks?: Array<any> } }>;
};

type Type = {
  OBJECT: string;
  ARRAY: string;
  STRING: string;
  NUMBER: string;
  BOOLEAN: string;
};

// Define Type enum to match the Google GenAI structure
const Type = {
  OBJECT: 'OBJECT',
  ARRAY: 'ARRAY',
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN'
} as const;

// Define a simple interface that matches the GoogleGenAI API but uses OpenRouter
interface GenerativeModel {
  generateContent: (request: any) => Promise<GenerateContentResponse>;
  generateContentStream: (request: any) => Promise<any>; // Stream response will be adapted
}

interface GoogleGenAI {
  getGenerativeModel: (config: { model: string }) => GenerativeModel;
}

// Create a wrapper for OpenRouter API calls
class OpenRouterGenAI implements GoogleGenAI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getGenerativeModel({ model }: { model: string }): GenerativeModel {
    return new OpenRouterGenerativeModel(this.apiKey, model);
  }
}

class OpenRouterGenerativeModel implements GenerativeModel {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateContent(request: any): Promise<GenerateContentResponse> {
    // Extract the text from the request
    const textContent = this.extractTextFromRequest(request);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: textContent }],
        response_format: request.generationConfig?.responseMimeType === "application/json"
          ? { type: "json_object" }
          : undefined
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0]?.message?.content || '',
      candidates: [] // Simplified for now
    };
  }

  async generateContentStream(request: any) {
    // Extract the text from the request
    const textContent = this.extractTextFromRequest(request);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: textContent }],
        stream: true,
        tools: request.tools || []
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    // Create a simple stream response object that mimics the Google API
    const reader = response.body?.getReader();
    const stream = new ReadableStream({
      start(controller) {
        const decoder = new TextDecoder();
        let buffer = '';

        function read() {
          reader?.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            buffer += decoder.decode(value, { stream: true });

            // Process complete lines
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.trim() && line.startsWith('data: ')) {
                const dataStr = line.slice(6); // Remove 'data: ' prefix
                if (dataStr === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const data = JSON.parse(dataStr);
                  if (data.choices && data.choices[0]?.delta?.content) {
                    controller.enqueue({ text: data.choices[0].delta.content });
                  }
                } catch (e) {
                  // Ignore JSON parse errors
                }
              }
            }

            read();
          }).catch(err => {
            controller.error(err);
            reader?.cancel();
          });
        }

        read();
      }
    });

    // Enhanced response with both stream and response methods
    const streamResponse = {
      stream: stream,
      response: async () => {
        // For now, just return a basic response - in a real implementation you'd collect and return the full response
        return { text: '', candidates: [] };
      }
    };

    return streamResponse;
  }

  private extractTextFromRequest(request: any): string {
    if (request.contents?.[0]?.parts) {
      // Process all parts in the request (text and image data)
      return request.contents[0].parts
        .map((part: any) => {
          if (part.text) {
            return part.text;
          } else if (part.inlineData?.data) {
            // For image data, return a placeholder since OpenRouter doesn't support image input in the same way
            return "Image data provided (base64: " + part.inlineData.data.substring(0, 20) + "...)";
          }
          return "";
        })
        .join(" ");
    }
    return request.contents?.text || request.contents || '';
  }
}
import { sendInquiryToFapro } from './faproService';
import { ContactFormData } from '../types';
import { RoofAnalysisData } from '../hooks/useAIChatState';
import { Product } from '../data/productTypes';

// Helper function for API calls with exponential backoff for rate limiting
export const callOpenRouterWithRetry = async <T extends {}>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await apiCall();
    } catch (err: any) {
      attempt++;

      let errorMessage = '';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else {
        try {
          errorMessage = JSON.stringify(err);
        } catch {
          errorMessage = 'An unknown error occurred during retry logic.';
        }
      }

      const isRateLimitError = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');

      if (isRateLimitError && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        console.warn(`Rate limit exceeded. Retrying in ${Math.round(delay)}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries exceeded");
};

export const getErrorMessageAsString = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return 'An unknown error occurred.';
  }
};

interface AIChatServiceOptions {
  apiKey: string;
}

interface ProcessGeneralQuestionResult {
  success: boolean;
  response?: string;
  sources?: Array<{ uri: string; title: string }>;
  videoId?: string;
  error?: string;
  triggerInquiryType?: boolean;
}

interface RoofAnalysisOptions {
  address: string;
  zoomLevels?: number[];
  apiKey: string;
}

interface GenerateQuestionsOptions {
  useCaseId: string;
  useCaseTitle: string;
  challenges: Array<{ title: string }>;
  solutions: Array<{ title: string }>;
}

export class AIChatService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string;

  constructor(options: AIChatServiceOptions) {
    this.apiKey = options.apiKey;
    this.initializeAI();
  }

  private initializeAI() {
    if (this.apiKey) {
      try {
        this.ai = new OpenRouterGenAI(this.apiKey);
      } catch (error) {
        console.error('Fehler bei der Initialisierung von OpenRouterGenAI:', error);
        this.ai = null;
      }
    }
  }

  public async submitInquiry(formData: Partial<ContactFormData>): Promise<{ success: boolean; error?: string }> {
    try {
      const { dataPrivacy, ...dataToSend } = formData;
      await sendInquiryToFapro(dataToSend as Omit<ContactFormData, 'dataPrivacy'>);
      return { success: true };
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      return { success: false, error: getErrorMessageAsString(error) };
    }
  }

  public async analyzeRoof(options: RoofAnalysisOptions): Promise<{ success: boolean; data?: RoofAnalysisData; imageDataUrl?: string; error?: string }> {
    if (!this.ai) {
      return { success: false, error: 'AI not available' };
    }

    const { address, zoomLevels = [20, 19, 18], apiKey } = options;
    let bestImage: { base64: string; dataUrl: string } | null = null;

    try {
      // Step 1 & 2: Find a valid satellite image by trying different zoom levels and validating with AI
      for (const zoom of zoomLevels) {
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=${zoom}&size=600x600&maptype=satellite&key=${apiKey}`;
        const mapResponse = await fetch(mapUrl);

        if (!mapResponse.ok) {
          console.warn(`Map API error for zoom ${zoom}`);
          continue;
        }

        const imageBlob = await mapResponse.blob();

        if (imageBlob.size < 10000) {
          console.warn(`Image size too small for zoom ${zoom}, likely an error image.`);
          continue;
        }

        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            if (result) {
              resolve(result);
            } else {
              reject(new Error('Failed to read file as data URL'));
            }
          };
          reader.onerror = () => reject(new Error('FileReader error'));
          reader.readAsDataURL(imageBlob);
        });

        const base64data = dataUrl.split(',')[1];

        const validationSchema = {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN, description: "True, if the image is a clear, high-quality satellite view of a single building's roof." },
            reason: { type: Type.STRING, description: "Reason for the decision. E.g., 'Too blurry', 'Multiple buildings shown', 'Clear view of a single roof'." }
          },
          required: ["isValid", "reason"]
        };

        const validationPrompt = "Is this a clear satellite image showing a single building's roof, suitable for solar potential analysis? The image should not be blurry, obstructed by clouds, or show multiple main buildings. Answer ONLY in JSON format according to the schema.";

        const validationApiCall = () => this.ai!.getGenerativeModel({ model: 'mistral-7b-instruct' }).generateContent({
          contents: [{
            role: 'user',
            parts: [
              { inlineData: { mimeType: imageBlob.type || "image/jpeg", data: base64data } },
              { text: validationPrompt },
            ],
          }],
          generationConfig: { responseMimeType: "application/json", responseSchema: validationSchema }
        });

        try {
          const validationResponse = await callOpenRouterWithRetry<GenerateContentResponse>(validationApiCall, 2);
          const validationResult = JSON.parse(validationResponse.text);

          if (validationResult.isValid && dataUrl && base64data) {
            bestImage = { base64: base64data, dataUrl };
            break;
          }
        } catch (validationErr) {
          console.warn(`AI validation failed for zoom ${zoom}:`, validationErr);
        }
      }

      if (!bestImage) {
        throw new Error("Map API or Validation Error: Could not find a suitable image.");
      }

      const analysisSchema = {
        type: Type.OBJECT,
        properties: {
          analysisPossible: { type: Type.BOOLEAN, description: "Gibt an, ob eine sinnvolle Analyse des Bildes möglich war." },
          usableAreaSqm: { type: Type.NUMBER, description: "Geschätzte nutzbare Dachfläche in Quadratmetern. 0, wenn Analyse nicht möglich." },
          obstructions: { type: Type.ARRAY, description: "Eine Liste der erkannten Störelemente. Leer, wenn Analyse nicht möglich.", items: { type: Type.STRING } },
          estimatedModuleCount: { type: Type.NUMBER, description: "Geschätzte Anzahl an Standard-Solarmodulen. 0, wenn Analyse nicht möglich." },
        },
        required: ["analysisPossible", "usableAreaSqm", "obstructions", "estimatedModuleCount"],
      };

      const analysisPrompt = `Du bist ein Experte für die Bewertung von Solardächern. Analysiere das beigefügte, bereits validierte Satellitenbild. Identifiziere das Hauptgebäude, schätze die nutzbare Dachfläche in Quadratmetern (ohne Störelemente), liste alle sichtbaren Störelemente (z.B. Schornstein, Dachfenster) auf und schätze die maximale Anzahl an Standard-Solarmodulen (1.75m x 1.1m), die auf die nutzbare Fläche passen. Antworte ausschließlich im JSON-Format gemäß dem Schema. Wenn die Analyse trotz Validierung nicht möglich ist, setze "analysisPossible" auf false.`;

      const analysisApiCall = () => this.ai!.getGenerativeModel({ model: 'mistral-7b-instruct' }).generateContent({
        contents: [{
          role: 'user',
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: bestImage!.base64 || "" } },
            { text: analysisPrompt },
          ],
        }],
        generationConfig: { responseMimeType: "application/json", responseSchema: analysisSchema }
      });

  const analysisResponse = await callOpenRouterWithRetry<GenerateContentResponse>(analysisApiCall);
      const analysisResult: RoofAnalysisData = JSON.parse(analysisResponse.text);

      if (!analysisResult.analysisPossible) {
        throw new Error("Analysis failed: AI could not analyze the validated image.");
      }

      return {
        success: true,
        data: analysisResult,
        imageDataUrl: bestImage.dataUrl
      };

    } catch (err) {
      const errorMessage = getErrorMessageAsString(err);
      console.error("Fehler bei der Dachanalyse:", err);

      if (errorMessage.includes("Map API")) {
        return { success: false, error: 'map_error' };
      } else {
        return { success: false, error: 'analysis_error' };
      }
    }
  }

  public async generateComparisonAnalysis(products: Product[]): Promise<{ success: boolean; response?: string; error?: string }> {
    if (!this.ai) {
      return { success: false, error: 'AI not available' };
    }

    const productDataForPrompt = products.map(item => ({
      name: item.name,
      description: item.description,
      basePrice: item.basePrice,
      specs: item.specs,
    }));

    const prompt = `Sie sind ein erstklassiger Experte für Photovoltaik-Technologie und Berater für ZOE Solar. Ein Kunde möchte die folgenden Produkte aus der Kategorie "${products[0]?.category || 'Unbekannt'}" vergleichen.

Produktdaten:
${JSON.stringify(productDataForPrompt, null, 2)}

Ihre Aufgabe ist es, eine umfassende Vergleichsanalyse und eine klare Empfehlung im Markdown-Format für eine Chat-Anzeige zu liefern.

**Antwort-Struktur:**
1.  **Einleitung:** Beginnen Sie mit einer kurzen Zusammenfassung der verglichenen Produkte.
2.  **Direktvergleich:** Vergleichen Sie die Produkte anhand der wichtigsten Spezifikationen (z.B. Leistung, Wirkungsgrad, Garantie, Technologie, Preis). Nutzen Sie Fettdruck und Listen zur Verdeutlichung.
3.  **Empfehlung & Fazit:** Geben Sie eine klare, begründete Empfehlung. Erklären Sie, welches Produkt für welchen Kundentyp (z.B. "preisbewusst", "leistungsorientiert", "auf Langlebigkeit bedacht") die beste Wahl ist. Schließen Sie mit einem zusammenfassenden Satz.`;

    try {
      const apiCall = () => this.ai!.getGenerativeModel({ model: "mistral-7b-instruct" }).generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }],
        }],
      });
      const response: GenerateContentResponse = await callOpenRouterWithRetry(apiCall);
      return { success: true, response: response.text };
    } catch (err) {
      const errorMessage = getErrorMessageAsString(err);
      console.error("Fehler bei der KI-Analyse:", errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  public async generateUseCaseQuestions(options: GenerateQuestionsOptions): Promise<{ success: boolean; questions?: Array<{ questionText: string; options: string[] }>; error?: string }> {
    if (!this.ai) {
      return { success: false, error: 'AI not available' };
    }

    const { useCaseId, useCaseTitle, challenges, solutions } = options;

    let prompt = `Sie sind ein Experte für Photovoltaik-Lösungen für Gewerbekunden bei ZOE Solar. Ein potenzieller Kunde aus der Branche "${useCaseTitle}" interessiert sich für unsere Lösungen.

    Ihre Aufgabe: Generieren Sie die 2-3 wichtigsten, weiterführenden Fragen, um den Bedarf des Kunden zu qualifizieren. Die Fragen sollen sich auf die spezifischen Herausforderungen und Lösungen dieser Branche beziehen, die hier aufgeführt sind:
    - Typische Herausforderungen: ${challenges.map(c => c.title).join(', ')}
    - Unsere Lösungen: ${solutions.map(s => s.title).join(', ')}

    Geben Sie für jede Frage 3-4 plausible Multiple-Choice-Antwortmöglichkeiten vor. Die erste Frage sollte allgemein den primären Anwendungsfall klären.

    Antworten Sie ausschließlich im JSON-Format, das dem vorgegebenen Schema entspricht. Fügen Sie keine Erklärungen oder einleitenden Text hinzu.`;

    // Specialized prompt for Agri-PV
    if (useCaseId === 'agri-pv') {
      prompt = `Sie sind ein hochspezialisierter KI-Berater für Agri-Photovoltaik bei ZOE Solar. Ein Landwirt interessiert sich für Agri-PV.

      Ihre Aufgabe: Generieren Sie 3-4 extrem intelligente und detaillierte Multiple-Choice-Fragen, um den Bedarf präzise zu qualifizieren. Die Fragen sollen sich auf die Kernthemen der Agri-PV beziehen: Flächennutzung, angebauten Kulturen und wirtschaftliche Ziele.

      **Fragen-Struktur:**
      1.  **Frage 1 (Kultur):** Fragen Sie nach der Art der landwirtschaftlichen Nutzung, um zwischen den Systemen (hochaufgeständert vs. vertikal) zu unterscheiden.
      2.  **Frage 2 (Fläche):** Fragen Sie nach der Größe der relevanten Fläche. Dies ist entscheidend für die Skalierung des Projekts.
      3.  **Frage 3 (Ziel):** Fragen Sie nach dem primären wirtschaftlichen Ziel des Landwirts mit der Agri-PV-Anlage.

      **Beispiel für eine gute Frage:** "Welche Art von Kulturen bauen Sie hauptsächlich auf der Fläche an, die Sie für Agri-PV in Betracht ziehen?" mit Optionen wie "Sonderkulturen (Obst, Wein)", "Ackerbau (Getreide, Mais)", "Tierhaltung / Weideland", "Bisher ungenutzte Fläche".

      Antworten Sie ausschließlich im JSON-Format gemäß dem Schema.`;
    }

    const schema = {
      type: Type.OBJECT,
      properties: {
        questions: {
          type: Type.ARRAY,
          description: "Eine Liste von 2-4 Qualifizierungsfragen.",
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: { type: Type.STRING, description: "Die Frage an den Kunden." },
              options: { type: Type.ARRAY, description: "Eine Liste von 3-4 Multiple-Choice-Antworten.", items: { type: Type.STRING } }
            },
            required: ["questionText", "options"]
          }
        }
      },
      required: ["questions"]
    };

    try {
      const apiCall = () => this.ai!.getGenerativeModel({ model: "mistral-7b-instruct" }).generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }],
        }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
  const response: GenerateContentResponse = await callOpenRouterWithRetry(apiCall);
      const result = JSON.parse(response.text);

      if (result.questions && result.questions.length > 0) {
        return { success: true, questions: result.questions };
      } else {
        throw new Error("AI hat keine validen Fragen zurückgegeben.");
      }
    } catch (err) {
      const errorMessage = getErrorMessageAsString(err);
      console.error("Fehler bei der Generierung der KI-Fragen:", errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  public async processGeneralQuestion(question: string, context?: string, pageContext?: string, websiteKnowledge?: string, services?: Array<{ id: string; title: string; context: string }>, currentLang: 'de-DE' | 'en-US' = 'de-DE'): Promise<ProcessGeneralQuestionResult> {
    if (!this.ai) {
      return { success: false, error: 'AI not available' };
    }

    const serviceKnowledge = services || [];
    const languageInstruction = currentLang === 'de-DE' ? 'Antworte auf Deutsch.' : 'Answer in English.';
    const pageContextText = pageContext || `Der Nutzer befindet sich gerade auf der Seite.`;
    const knowledgeBase = websiteKnowledge || '';

    const prompt = `Du bist "ZOE", ein freundlicher und kompetenter KI-Berater für ZOE Solar. ${languageInstruction} ${pageContextText}
    ${context ? `**Zusätzlicher Kontext zum aktuellen Thema des Nutzers:**\n${context}\n\n` : ''}
    **Wissensbasis über ZOE Solar:**
    ${knowledgeBase}

    **Aktuelle Benutzeranfrage:**
    "${question}"

    **Deine Aufgabe:**
    1. Prüfe zuerst, ob die Anfrage des Nutzers eindeutig einem der folgenden Services zugeordnet werden kann. Wenn ja, antworte NUR mit dem JSON-Objekt {"serviceId": "ID_DES_SERVICES"}.
    Service-Liste: ${JSON.stringify(serviceKnowledge)}

    2. Wenn keine klare Service-Zuordnung möglich ist, nutze die Google-Suche, um aktuelle Informationen, Ereignisse oder Themen zu recherchieren, die nicht in deiner Wissensbasis enthalten sind. Antworte dann kurz, präzise und hilfreich.
    3. Wenn die Antwort nicht in deiner Wissensbasis enthalten ist, weise freundlich darauf hin und biete an, eine Anfrage an einen menschlichen Experten zu stellen.
    4. Wenn der Nutzer nach einem Angebot fragt, starte proaktiv den Anfrageprozess, indem du fragst: "Sehr gerne! Handelt es sich um ein gewerbliches oder privates Projekt?" und setze den internen Step auf 'inquiry_type'.
    5. Prüfe IMMER, ob es ein relevantes YouTube-Video gibt, das die Antwort visuell unterstützen könnte. Wenn ein passendes, seriöses Video (von Experten, Herstellern, Fachkanälen) existiert, FÜGE IMMER den vollständigen YouTube-Link in einer neuen Zeile in deine Antwort ein. Gib Videos den Vorzug, wenn es das Verständnis verbessert.
    6. Beende allgemeine Antworten immer mit einer offenen Frage, wie "Kann ich sonst noch etwas für Sie?"?
    `;

    try {
      const streamResult = await this.ai.getGenerativeModel({ model: "mistral-7b-instruct" }).generateContentStream({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }],
        }],
        generationConfig: {
          responseMimeType: "text/plain", // For streaming content
        },
        tools: [{ googleSearch: {} }],
      });

      let fullResponseText = "";
      let finalResponse: GenerateContentResponse | null = null;

      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullResponseText += chunkText;
        }
      }

      // Get the full response with all metadata
      finalResponse = await streamResult.response;
      const groundingChunks = finalResponse?.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources: Array<{ uri: string; title: string }> = groundingChunks
        ?.map((chunk: any) => chunk.web)
        .filter((source: any) => source?.uri) || [];

      const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
      const match = fullResponseText.match(youtubeRegex);
      const videoId = match ? match[1] : undefined;
      let cleanText = videoId ? fullResponseText.replace(youtubeRegex, '').trim() : fullResponseText;

      // Check for service ID in response
      try {
        const jsonResponse = JSON.parse(cleanText);
        if (jsonResponse.serviceId) {
          return { success: true, response: JSON.stringify(jsonResponse) }; // Return JSON for service context handling
        }
      } catch (e) {
        // Not JSON, continue with normal response
      }

      // Check for inquiry type trigger
      if (cleanText.includes("inquiry_type")) {
        const textWithoutTrigger = cleanText.replace("inquiry_type", "").trim();
        return { success: true, response: textWithoutTrigger, videoId, sources, triggerInquiryType: true };
      }

      return { success: true, response: cleanText, videoId, sources };

    } catch (err) {
      const errorMessage = getErrorMessageAsString(err);
      console.error("Fehler bei der allgemeinen KI-Anfrage:", errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  public cleanup() {
    this.ai = null;
  }
}
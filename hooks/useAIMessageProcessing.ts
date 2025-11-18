import { useState, useRef, useCallback } from 'react';
import { getOpenRouterClient, AIResponse } from '../services/core/OpenRouterClient';
import { Page } from '../types';
import { websiteKnowledge } from '../data/websiteKnowledge';
import { services, Service } from '../data/services';
import { Product } from '../data/productTypes';
import { UseCase } from '../data/useCases';
import { Message, Language, FunnelStep } from './useAIChatState';

interface UseAIMessageProcessingOptions {
    apiKey: string;
    currentLang: Language;
    currentPage: Page;
    isAiAvailable: boolean;
    aiFallbackMessage: string;
    rateLimitError: string;
    genericError: string;
}

interface UseAIMessageProcessingReturn {
    ai: React.MutableRefObject<ReturnType<typeof getOpenRouterClient> | null>;
    comparisonContextRef: React.MutableRefObject<Product[] | null>;
    streamingMessageId: React.MutableRefObject<number | null>;
    getComparisonAnalysis: (products: Product[]) => Promise<string | undefined>;
    generateUseCaseQuestions: (useCase: UseCase) => Promise<void>;
    processGeneralQuestion: (
        question: string,
        context?: string,
        onUpdateMessages?: (updater: (prev: Message[]) => Message[]) => void,
        onSetStep?: (step: FunnelStep) => void,
        onSetStepHistory?: (updater: (prev: FunnelStep[]) => FunnelStep[]) => void,
        onResetConversation?: (type: 'service_context', context: any) => void
    ) => Promise<string | undefined>;
}

// Helper function for API calls with exponential backoff
// Renamed: previously Gemini-specific — now provider-agnostic and used for OpenRouter/Mistral
const callOpenRouterWithRetry = async <T extends {}>(
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

const getErrorMessageAsString = (error: unknown): string => {
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

export const useAIMessageProcessing = (options: UseAIMessageProcessingOptions): UseAIMessageProcessingReturn => {
    const { apiKey, currentLang, currentPage, isAiAvailable, aiFallbackMessage, rateLimitError, genericError } = options;

    const ai = useRef<ReturnType<typeof getOpenRouterClient> | null>(null);
    const comparisonContextRef = useRef<Product[] | null>(null);
    const streamingMessageId = useRef<number | null>(null);

    // Initialize AI
    const initializeAI = useCallback(() => {
        if (apiKey) {
            try {
                ai.current = getOpenRouterClient();
            } catch (error) {
                console.error('Fehler bei der Initialisierung von OpenRouter:', error);
                ai.current = null;
            }
        } else {
            ai.current = null;
        }
    }, [apiKey]);

    // Initialize AI on mount
    useState(() => {
        initializeAI();
    });

    const getComparisonAnalysis = useCallback(async (products: Product[]) => {
        if (!ai.current) {
            return;
        }

        const productDataForPrompt = products.map(item => ({
            name: item.name,
            description: item.description,
            basePrice: item.basePrice,
            specs: item.specs,
        }));

        const category = products[0]?.category || 'unbekannt';
        const prompt = `Sie sind ein erstklassiger Experte für Photovoltaik-Technologie und Berater für ZOE Solar. Ein Kunde möchte die folgenden Produkte aus der Kategorie "${category}" vergleichen.

Produktdaten:
${JSON.stringify(productDataForPrompt, null, 2)}

Ihre Aufgabe ist es, eine umfassende Vergleichsanalyse und eine klare Empfehlung im Markdown-Format für eine Chat-Anzeige zu liefern.

**Antwort-Struktur:**
1.  **Einleitung:** Beginnen Sie mit einer kurzen Zusammenfassung der verglichenen Produkte.
2.  **Direktvergleich:** Vergleichen Sie die Produkte anhand der wichtigsten Spezifikationen (z.B. Leistung, Wirkungsgrad, Garantie, Technologie, Preis). Nutzen Sie Fettdruck und Listen zur Verdeutlichung.
3.  **Empfehlung & Fazit:** Geben Sie eine klare, begründete Empfehlung. Erklären Sie, welches Produkt für welchen Kundentyp (z.B. "preisbewusst", "leistungsorientiert", "auf Langlebigkeit bedacht") die beste Wahl ist. Schließen Sie mit einem zusammenfassenden Satz.`;

        try {
            const response: AIResponse = await callOpenRouterWithRetry(() =>
                ai.current!.generateContent({
                    prompt,
                    temperature: 0.7,
                    maxTokens: 1500
                })
            );

            if (response.success && response.content) {
                return response.content;
            } else {
                throw new Error(response.error || 'Unknown error from OpenRouter');
            }
        } catch (err) {
            const errorMessage = getErrorMessageAsString(err);
            console.error("Fehler bei der KI-Analyse:", errorMessage);
            const userMessage = (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED'))
                ? rateLimitError
                : genericError;
            return userMessage;
        }
    }, [rateLimitError, genericError]);

    const generateUseCaseQuestions = useCallback(async (useCase: UseCase) => {
        if (!ai.current) {
            throw new Error('AI not available');
        }

        let prompt = `Sie sind ein Experte für Photovoltaik-Lösungen für Gewerbekunden bei ZOE Solar. Ein potenzieller Kunde aus der Branche "${useCase.title}" interessiert sich für unsere Lösungen.

Ihre Aufgabe: Generieren Sie die 2-3 wichtigsten, weiterführenden Fragen, um den Bedarf des Kunden zu qualifizieren. Die Fragen sollen sich auf die spezifischen Herausforderungen und Lösungen dieser Branche beziehen, die hier aufgeführt sind:
- Typische Herausforderungen: ${useCase.challenges.map(c => c.title).join(', ')}
- Unsere Lösungen: ${useCase.solutions.map(s => s.title).join(', ')}

Geben Sie für jede Frage 3-4 plausible Multiple-Choice-Antwortmöglichkeiten vor. Die erste Frage sollte allgemein den primären Anwendungsfall klären.

Antworten Sie ausschließlich im JSON-Format mit folgender Struktur:
{
  "questions": [
    {
      "questionText": "Die Frage an den Kunden",
      "options": ["Antwort 1", "Antwort 2", "Antwort 3"]
    }
  ]
}

Fügen Sie keine Erklärungen oder einleitenden Text hinzu.`;

        // Specialized prompt for Agri-PV
        if (useCase.id === 'agri-pv') {
            prompt = `Sie sind ein hochspezialisierter KI-Berater für Agri-Photovoltaik bei ZOE Solar. Ein Landwirt interessiert sich für Agri-PV.

Ihre Aufgabe: Generieren Sie 3-4 extrem intelligente und detaillierte Multiple-Choice-Fragen, um den Bedarf präzise zu qualifizieren. Die Fragen sollen sich auf die Kernthemen der Agri-PV beziehen: Flächennutzung, angebauten Kulturen und wirtschaftliche Ziele.

**Fragen-Struktur:**
1. **Frage 1 (Kultur):** Fragen Sie nach der Art der landwirtschaftlichen Nutzung, um zwischen den Systemen (hochaufgeständert vs. vertikal) zu unterscheiden.
2. **Frage 2 (Fläche):** Fragen Sie nach der Größe der relevanten Fläche. Dies ist entscheidend für die Skalierung des Projekts.
3. **Frage 3 (Ziel):** Fragen Sie nach dem primären wirtschaftlichen Ziel des Landwirts mit der Agri-PV-Anlage.

**Beispiel für eine gute Frage:** "Welche Art von Kulturen bauen Sie hauptsächlich auf der Fläche an, die Sie für Agri-PV in Betracht ziehen?" mit Optionen wie "Sonderkulturen (Obst, Wein)", "Ackerbau (Getreide, Mais)", "Tierhaltung / Weideland", "Bisher ungenutzte Fläche".

Antworten Sie ausschließlich im JSON-Format gemäß der obigen Struktur.`;
        }

        try {
            const response: AIResponse = await callOpenRouterWithRetry(() =>
                ai.current!.generateContent({
                    prompt,
                    temperature: 0.3,
                    maxTokens: 800,
                    systemPrompt: "You are a JSON generation expert. Always respond with valid JSON only, no additional text."
                })
            );

            if (response.success && response.content) {
                const result = JSON.parse(response.content);

                if (result.questions && result.questions.length > 0) {
                    return result.questions;
                } else {
                    throw new Error("AI hat keine validen Fragen zurückgegeben.");
                }
            } else {
                throw new Error(response.error || 'Unknown error from OpenRouter');
            }
        } catch (err) {
            const errorMessage = getErrorMessageAsString(err);
            console.error("Fehler bei der Generierung der KI-Fragen:", errorMessage);
            const userMessage = (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED'))
                ? "Unsere KI-Systeme sind leider überlastet. Lassen Sie uns den Standardweg zur Anfrage gehen, das geht immer!"
                : "Entschuldigung, bei der Vorbereitung Ihrer intelligenten Fragen ist ein Fehler aufgetreten. Lassen Sie uns stattdessen den Standardweg gehen.";
            throw new Error(userMessage);
        }
    }, []);

    const processGeneralQuestion = useCallback(async (
        question: string,
        context?: string,
        onUpdateMessages?: (updater: (prev: Message[]) => Message[]) => void,
        onSetStep?: (step: FunnelStep) => void,
        onSetStepHistory?: (updater: (prev: FunnelStep[]) => FunnelStep[]) => void,
        onResetConversation?: (type: 'service_context', context: any) => void
    ) => {
        if (!ai.current) {
            return aiFallbackMessage;
        }

        const serviceKnowledge = services.map(s => ({ id: s.id, title: s.title, context: s.context }));
        const languageInstruction = currentLang === 'de-DE' ? 'Antworte auf Deutsch.' : 'Answer in English.';
        const pageContext = `Der Nutzer befindet sich gerade auf der Seite "${currentPage}". Beziehe dich in deiner Antwort proaktiv darauf, wenn es zur Frage passt.`;

        const systemPrompt = `Du bist "ZOE", ein freundlicher und kompetenter KI-Berater für ZOE Solar. ${languageInstruction} ${pageContext}
        ${context ? `**Zusätzlicher Kontext zum aktuellen Thema des Nutzers:**\n${context}\n\n` : ''}

**Deine Aufgabe:**
1. Prüfe zuerst, ob die Anfrage des Nutzers eindeutig einem der folgenden Services zugeordnet werden kann. Wenn ja, antworte NUR mit dem JSON-Objekt {"serviceId": "ID_DES_SERVICES"}.
2. Wenn keine klare Service-Zuordnung möglich ist, nutze dein Wissen, um aktuelle Informationen, Ereignisse oder Themen zu recherchieren, die nicht in deiner Wissensbasis enthalten sind. Antworte dann kurz, präzise und hilfreich.
3. Wenn die Antwort nicht in deiner Wissensbasis enthalten ist, weise freundlich darauf hin und biete an, eine Anfrage an einen menschlichen Experten zu stellen.
4. Wenn der Nutzer nach einem Angebot fragt, starte proaktiv den Anfrageprozess, indem du fragst: "Sehr gerne! Handelt es sich um ein gewerbliches oder privates Projekt?" und setze den internen Step auf 'inquiry_type'.
5. Prüfe IMMER, ob es ein relevantes YouTube-Video gibt, das die Antwort visuell unterstützen könnte. Wenn ein passendes, seriöses Video (von Experten, Herstellern, Fachkanälen) existiert, FÜGE IMMER den vollständigen YouTube-Link in einer neuen Zeile in deine Antwort ein. Gib Videos den Vorzug, wenn es das Verständnis verbessert.
6. Beende allgemeine Antworten immer mit einer offenen Frage, wie "Kann ich sonst noch etwas für Sie?"?`;

        const servicePrompt = `Service-Liste: ${JSON.stringify(serviceKnowledge)}`;

        const knowledgePrompt = `**Wissensbasis über ZOE Solar:**
${websiteKnowledge}

**Aktuelle Benutzeranfrage:**
"${question}"`;

        const fullPrompt = `${systemPrompt}

${knowledgePrompt}

${servicePrompt}`;

        const newAiMessageId = Date.now() + Math.random();
        streamingMessageId.current = newAiMessageId;

        let sources: Array<{ uri: string; title: string }> = [];

        try {
            const response: AIResponse = await callOpenRouterWithRetry(() =>
                ai.current!.generateContent({
                    prompt: fullPrompt,
                    temperature: 0.7,
                    maxTokens: 1000
                })
            );

            if (!response.success || !response.content) {
                throw new Error(response.error || 'Unknown error from OpenRouter');
            }

            let fullResponseText = response.content;

            // For OpenRouter, we don't have grounding metadata in the same way
            const sources: Array<{ uri: string; title: string }> = [];

            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
            const match = fullResponseText.match(youtubeRegex);
            const videoId = match ? match[1] : undefined;
            let cleanText = videoId ? fullResponseText.replace(youtubeRegex, '').trim() : fullResponseText;

            try {
                const jsonResponse = JSON.parse(cleanText);
                if (jsonResponse.serviceId) {
                    const matchedService = services.find(s => s.id === jsonResponse.serviceId);
                    if (matchedService) {
                        if (onResetConversation) {
                            onResetConversation('service_context', { ...matchedService, context: question });
                        }
                        return; // Early return to trigger service context
                    }
                }
            } catch (e) {
                // Not JSON, continue
            }

            if (cleanText.includes("inquiry_type")) {
                const textWithoutTrigger = cleanText.replace("inquiry_type", "").trim();
                if (onSetStep) onSetStep('inquiry_type');
                if (onSetStepHistory) onSetStepHistory(prev => [...prev, 'inquiry_type']);
                if (onUpdateMessages) {
                    onUpdateMessages(prev => prev.map(msg =>
                        msg.id === newAiMessageId
                        ? { ...msg, text: textWithoutTrigger, videoId, sources, options: ['Gewerblich', 'Privat'] }
                        : msg
                    ));
                }
                return textWithoutTrigger;
            } else {
                if (onUpdateMessages) {
                    onUpdateMessages(prev => prev.map(msg =>
                        msg.id === newAiMessageId ? { ...msg, text: cleanText, videoId, sources } : msg
                    ));
                }
                return cleanText;
            }
        } catch (err) {
            const errorMessage = getErrorMessageAsString(err);
            console.error("Fehler bei der allgemeinen KI-Anfrage:", errorMessage);
            const userMessage = (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED'))
                ? rateLimitError
                : genericError;
            return userMessage;
        } finally {
            streamingMessageId.current = null;
        }
    }, [currentLang, currentPage, aiFallbackMessage, rateLimitError, genericError]);

    return {
        ai,
        comparisonContextRef,
        streamingMessageId,
        getComparisonAnalysis,
        generateUseCaseQuestions,
        processGeneralQuestion,
    };
};
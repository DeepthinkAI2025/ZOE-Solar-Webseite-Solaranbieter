// Conversational AI & Voice Commerce Service für ZOE Solar
import { AIReadableFAQService } from './aiReadableFAQService';
import { crmLeadTrackingIntegrationService } from './crmLeadTrackingIntegrationService';

export interface ConversationalAIConfig {
  enableVoiceSearch: boolean;
  enableLeadGen: boolean;
  supportedLanguages: string[];
}

export interface ChatMessage {
  userId: string;
  text: string;
  language: string;
  timestamp: Date;
}

export interface VoiceInput {
  audioData: Buffer;
  language: string;
  timestamp: Date;
}

export interface ChatbotResponse {
  text: string;
  intent: string;
  actions?: string[];
  leadGenerated?: boolean;
  faqReference?: string;
}

export class ConversationalAIService {
  private config: ConversationalAIConfig;
  private faqService: AIReadableFAQService;
  private leadService: typeof crmLeadTrackingIntegrationService;

  constructor(config: ConversationalAIConfig) {
    this.config = config;
    this.faqService = new AIReadableFAQService();
    this.leadService = crmLeadTrackingIntegrationService;
  }

  public async processChatMessage(msg: ChatMessage): Promise<ChatbotResponse> {
    const intent = await this.detectIntent(msg.text, msg.language);
    let response: ChatbotResponse = { text: '', intent };

    if (intent === 'faq') {
      const faq = await this.faqService.findRelevantFAQ(msg.text, msg.language);
      response.text = faq ? faq.answer : 'Kann ich leider nicht beantworten.';
      response.faqReference = faq?.id;
    } else if (intent === 'lead') {
      const lead = await this.leadService.createLead(msg.userId, msg.text);
      response.text = 'Ihr Anliegen wurde aufgenommen. Ein Berater meldet sich.';
      response.leadGenerated = !!lead;
    } else {
      response.text = await this.generateDialogResponse(msg.text, intent, msg.language);
    }
    return response;
  }

  public async processVoiceInput(input: VoiceInput): Promise<ChatbotResponse> {
    const text = await this.transcribeAudio(input.audioData, input.language);
    return this.processChatMessage({
      userId: 'voice-' + Date.now(),
      text,
      language: input.language,
      timestamp: input.timestamp,
    });
  }

  private async detectIntent(text: string, language: string): Promise<string> {
    // Intent-Erkennung (vereinfachtes Beispiel)
    if (text.toLowerCase().includes('angebot') || text.toLowerCase().includes('beratung')) return 'lead';
    if (text.toLowerCase().includes('wie') || text.toLowerCase().includes('was')) return 'faq';
    return 'dialog';
  }

  private async generateDialogResponse(text: string, intent: string, language: string): Promise<string> {
    // KI-generierte Antwort (Platzhalter)
    return `Antwort (${intent}): ${text}`;
  }

  private async transcribeAudio(audio: Buffer, language: string): Promise<string> {
    // Spracherkennung (Platzhalter)
    return 'Transkribierter Text aus Audio';
  }

  public getConfig(): ConversationalAIConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<ConversationalAIConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Voice Assistant Event Handler für externe Sprachassistenten (Alexa, Google Assistant etc.)
  public async handleVoiceAssistantEvent(event: {
    assistant: string;
    userId: string;
    utterance: string;
    language: string;
    timestamp: Date;
  }): Promise<ChatbotResponse> {
    // Intent-Erkennung und Routing
    const intent = await this.detectIntent(event.utterance, event.language);
    if (intent === 'lead') {
      await this.leadService.createLead(event.userId, event.utterance);
      return {
        text: 'Lead wurde erfolgreich aufgenommen.',
        intent,
        leadGenerated: true,
      };
    }
    if (intent === 'faq') {
      const faq = await this.faqService.findRelevantFAQ(event.utterance, event.language);
      return {
        text: faq ? faq.answer : 'Keine passende Antwort gefunden.',
        intent,
        faqReference: faq?.id,
      };
    }
    // Voice Commerce Trigger (Platzhalter)
    if (event.utterance.toLowerCase().includes('kaufen') || event.utterance.toLowerCase().includes('bestellen')) {
      return {
        text: 'Ihr Bestellwunsch wurde weitergeleitet.',
        intent: 'commerce',
        actions: ['order'],
      };
    }
    // Standard-Dialog
    return {
      text: await this.generateDialogResponse(event.utterance, intent, event.language),
      intent,
    };
  }
}
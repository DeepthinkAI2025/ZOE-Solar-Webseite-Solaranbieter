import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { sendInquiryToFapro } from '../services/faproService';
import { ContactFormData, Page } from '../types';
import { websiteKnowledge } from '../data/websiteKnowledge';
import { innovations } from '../data/innovations';
import { Product } from '../data/productTypes';
import { UseCase } from '../data/useCases';
import { services, Service, ConfigurableField } from '../data/services';
import YouTubeEmbed from './YouTubeEmbed';

// Helper function for API calls with exponential backoff for rate limiting
const callGeminiWithRetry = async <T extends {}>(
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
        const delay = initialDelay * Math.pow(2, attempt - 1) + Math.random() * 1000; // Add jitter
        console.warn(`Rate limit exceeded. Retrying in ${Math.round(delay)}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw err; // Re-throw original error if not a rate limit error or retries exhausted
      }
    }
  }
  // This line is technically unreachable if the loop always throws, but required for TS
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

type GroundingSource = { uri: string; title: string };

type Message = {
  sender: 'user' | 'ai' | 'system';
  text?: string;
  options?: string[];
  component?: React.ReactNode;
  id: number;
  videoId?: string;
  sources?: GroundingSource[];
};

type FunnelStep = 'start' | 'inquiry_type' | 'service_type' | 'get_name' | 'get_email' | 'get_phone' | 'confirm_and_send' | 'final' | 'general_chat' | 'get_name_for_callback' | 'get_phone_for_callback' | 'confirm_and_send_callback' | 'callback_final' | 'asking_ai_questions' | 'configure_service' | 'get_address' | 'analyzing_roof' | 'confirm_roof';
type Language = 'de-DE' | 'en-US';

type RoofAnalysisData = {
    analysisPossible: boolean;
    usableAreaSqm: number;
    obstructions: string[];
    estimatedModuleCount: number;
};

const buttonPrompts = [
    "Wie kann ich helfen?",
    "Neue Anfrage starten...",
    "Was ist Agri-PV?",
    "Rechnet sich eine Solaranlage für mich?",
    "Welche Förderungen gibt es 2025?",
];

const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY ?? import.meta.env.VITE_API_KEY ?? '') as string;

const translations: Record<Language, Record<string, any>> = {
    'de-DE': {
        assistantName: 'ZOE Solar Assistent',
        online: 'Online',
        isSpeaking: 'Spricht...',
        initialGreeting: 'Hallo! Ich bin der digitale Assistent von ZOE Solar. Wie kann ich Ihnen helfen?',
        initialOptions: ["Anfrage stellen", "Dach-Potenzial analysieren", "Ich habe eine Frage"],
        thinking: 'KI denkt nach...',
        thinkingMessages: [
            'Analysiere Ihre Anfrage...',
            'Durchsuche die ZOE Solar Wissensdatenbank...',
            'Führe eine Websuche für aktuelle Daten durch...',
            'Vergleiche relevante Informationen...',
            'Synthetisiere die Ergebnisse...',
            'Formuliere eine hilfreiche Antwort...',
        ],
        inputPlaceholder: 'Ihre Nachricht...',
        inputDisabledPlaceholder: 'Bitte nutzen Sie das Formular/Buttons oben.',
        rateLimitError: "Unsere KI-Systeme sind im Moment stark ausgelastet. Bitte versuchen Sie es in ein paar Augenblicken erneut.",
        genericError: "Entschuldigung, es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
    aiUnavailable: 'Der KI-Assistent steht derzeit nicht zur Verfügung. Bitte nutzen Sie unser Kontaktformular oder rufen Sie uns direkt an.',
        callCustomerService: 'Kundenservice anrufen',
        speakWithAI: 'Mit KI-Berater sprechen',
        roofAnalysisPrompt: 'Dach-Potenzial analysieren',
        getAddress: 'Verstanden. Bitte geben Sie die vollständige Adresse des Gebäudes an (Straße, Hausnummer, PLZ, Ort).',
        analyzingRoof: 'Analysiere Satellitenbild...',
        analysisResultPrompt: 'Ist das Ihr Gebäude? Hier ist meine Analyse:',
        confirmYes: 'Ja, das ist mein Haus',
        confirmNo: 'Nein, Adresse erneut eingeben',
        analysisSaved: 'Vielen Dank! Ich habe diese Informationen für Ihre Anfrage übernommen.',
        analysisRejected: 'Kein Problem. Bitte geben Sie die Adresse erneut an, vielleicht mit einem genaueren Hinweis (z.B. "das rote Dach links").',
        mapError: 'Entschuldigung, ich konnte unter dieser Adresse kein klares Satellitenbild finden. Bitte versuchen Sie es mit einer genaueren Angabe.',
        analysisError: 'Entschuldigung, bei der automatischen Analyse des Daches ist ein Fehler aufgetreten. Lassen Sie uns auf dem normalen Weg fortfahren.',
    },
    'en-US': {
        assistantName: 'ZOE Solar Assistant',
        online: 'Online',
        isSpeaking: 'Speaking...',
        initialGreeting: 'Hello! I am the ZOE Solar digital assistant. How can I help you?',
        initialOptions: ["Make an inquiry", "Analyze roof potential", "I have a question"],
        thinking: 'AI is thinking...',
        thinkingMessages: [
            'Analyzing your request...',
            'Searching the ZOE Solar knowledge base...',
            'Performing a web search for current data...',
            'Comparing relevant information...',
            'Synthesizing the results...',
            'Formulating a helpful answer...',
        ],
        inputPlaceholder: 'Your message...',
        inputDisabledPlaceholder: 'Please use the form/buttons above.',
        rateLimitError: "Our AI systems are currently under heavy load. Please try again in a few moments.",
        genericError: "Sorry, a technical error occurred. Please try again later.",
    aiUnavailable: 'The AI assistant is currently unavailable. Please contact us via the form or by phone.',
        callCustomerService: 'Call Customer Service',
        speakWithAI: 'Speak with AI Assistant',
        roofAnalysisPrompt: 'Analyze roof potential',
        getAddress: 'Understood. Please provide the full address of the building (Street, Number, Postal Code, City).',
        analyzingRoof: 'Analyzing satellite image...',
        analysisResultPrompt: 'Is this your building? Here is my analysis:',
        confirmYes: 'Yes, this is my house',
        confirmNo: 'No, enter new address',
        analysisSaved: 'Thank you! I have included this information in your inquiry.',
        analysisRejected: 'No problem. Please provide the address again, perhaps with a more precise hint (e.g., "the red roof on the left").',
        mapError: 'Sorry, I could not find a clear satellite image for this address. Please try again with a more specific address.',
        analysisError: 'Sorry, an error occurred during the automatic roof analysis. Let\'s proceed the standard way.',
    }
};

interface ConfirmationFormProps {
    formData: Partial<ContactFormData>;
    onUpdate: (data: Partial<ContactFormData>) => void;
    onSubmit: () => void;
    onBack: () => void;
}

// Confirmation Form Component
const ConfirmationForm: React.FC<ConfirmationFormProps> = ({ formData, onUpdate, onSubmit, onBack }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-3 text-sm animate-fade-in p-3 bg-slate-100 rounded-2xl">
             <div className="p-3 bg-white rounded-lg border">
                <label className="block text-xs font-medium text-slate-500">Name</label>
                <input type="text" name="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"/>
            </div>
            <div className="p-3 bg-white rounded-lg border">
                <label className="block text-xs font-medium text-slate-500">E-Mail</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"/>
            </div>
            <div className="p-3 bg-white rounded-lg border">
                <label className="block text-xs font-medium text-slate-500">Telefon</label>
                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full bg-transparent font-semibold text-slate-800 focus:outline-none"/>
            </div>
            <div className="flex gap-2 mt-4">
                 <button onClick={onBack} className="flex-1 bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors text-sm">
                    Zurück
                </button>
                <button onClick={onSubmit} className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Anfrage senden
                </button>
            </div>
        </div>
    );
};

interface ConfigSliderProps {
    field: ConfigurableField;
    onConfirm: (value: number) => void;
}
const ConfigSlider: React.FC<ConfigSliderProps> = ({ field, onConfirm }) => {
    const [value, setValue] = useState(field.defaultValue);
    return (
        <div className="space-y-3 text-sm animate-fade-in p-3 bg-slate-100 rounded-2xl">
            <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-slate-700">{field.label}</label>
                <div className="font-mono font-bold text-green-700 bg-white px-3 py-1 rounded-md border">
                    {value.toLocaleString('de-DE')} {field.unit}
                </div>
            </div>
            <input
                type="range"
                min={field.min}
                max={field.max}
                step={field.step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <button onClick={() => onConfirm(value)} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm mt-2">
                Bestätigen
            </button>
        </div>
    );
};

interface RoofAnalysisCardProps {
    imageDataUrl: string;
    analysisData: RoofAnalysisData;
    onConfirm: () => void;
    onReject: () => void;
    t: Record<string, any>;
}

const RoofAnalysisCard: React.FC<RoofAnalysisCardProps> = ({ imageDataUrl, analysisData, onConfirm, onReject, t }) => {
    return (
        <div className="space-y-3 text-sm animate-fade-in p-3 bg-slate-100 rounded-2xl">
            <p className="font-semibold text-slate-700">{t.analysisResultPrompt}</p>
            <img src={imageDataUrl} alt="Satellitenbild des Daches" className="rounded-lg border-4 border-white shadow-md" />
            <div className="p-3 bg-white rounded-lg border space-y-2">
                 <div className="flex justify-between">
                    <span className="text-slate-500">Nutzbare Fläche:</span>
                    <span className="font-bold text-slate-800">ca. {analysisData.usableAreaSqm} m²</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Störelemente:</span>
                    <span className="font-bold text-slate-800">{analysisData.obstructions.join(', ') || 'Keine'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Mögliche Module:</span>
                    <span className="font-bold text-slate-800">{analysisData.estimatedModuleCount} Stk.</span>
                </div>
            </div>
             <div className="flex flex-col gap-2 mt-2">
                 <button onClick={onConfirm} className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    {t.confirmYes}
                </button>
                <button onClick={onReject} className="w-full bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                    {t.confirmNo}
                </button>
            </div>
        </div>
    );
};


interface AIChatFunnelProps {
  onOpen: () => void;
  currentPage: Page;
  initialContext?: string;
}

const contextualPromptsMap: Partial<Record<Page, string[]>> = {
    'home': ["Was ist Agri-PV?", "Welche Förderungen gibt es 2025?", "Rechnet sich eine Solaranlage für mich?"],
    'photovoltaik': ["Was ist der Unterschied zwischen Aufdach- und Freiflächenanlagen?", "Bietet ihr auch Wartung an?", "Was sind die ZOE Solar Vorteile?"],
    'preise': ["Wie funktioniert die 0€ Anzahlung?", "Gibt es Rabatte für Großanlagen?", "Kann ich ein individuelles Paket erhalten?"],
    'projekte': ["Kann ich Details zu einem bestimmten Projekt sehen?", "Welche Technologien wurden bei diesen Projekten eingesetzt?", "Wie lange hat die Umsetzung gedauert?"],
    'ueber-uns': ["Was ist die Mission von ZOE Solar?", "Wer sind die Gründer?", "Wie lange gibt es ZOE Solar schon?"],
    'finanzierung': ["Welche KfW-Kredite gibt es?", "Was sind die steuerlichen Vorteile?", "Übernehmt ihr die komplette Abwicklung?"],
    'produkte': ["Welches Modul ist am effizientesten?", "Was ist der Unterschied zwischen SMA und Fronius?", "Empfehhl mir einen Speicher für mein Haus."],
    'hersteller-detail': ["Was sind die Vorteile dieses Herstellers?", "Gibt es Alternativen?", "Zeige mir die Garantiedetails."],
    'agri-pv': ["Welche Kulturen eignen sich für Agri-PV?", "Wie hoch ist die neue Förderung?", "Schützt Agri-PV meine Ernte?"],
    'kontakt': ["Wie sind die Öffnungszeiten?", "Kann ich einen Rückruf vereinbaren?", "Wo befindet sich euer Büro?"],
    'karriere': ["Welche Stellen sind offen?", "Wie kann ich mich bewerben?", "Welche Benefits bietet ZOE Solar?"],
    'faq-page': ["Was ist der Unterschied zwischen kWp und kWh?", "Wie lange hält ein Wechselrichter?", "Was passiert bei einem Stromausfall?"],
    'wissens-hub': ["Was ist Direktvermarktung?", "Erkläre Peak Shaving.", "Zeige mir den Leitfaden für Gewerbedächer."],
    'sonderaktionen': ["Welche Aktion ist aktuell am beliebtesten?", "Gelten die Aktionen auch für mich?", "Wie kann ich den Bonus einlösen?"],
    'impressum': ["Wer ist der Geschäftsführer?", "Wo ist der Firmensitz?"],
    'datenschutz': ["Wie geht ZOE Solar mit meinen Daten um?", "Welche Cookies werden verwendet?"],
};

const AIChatFunnel: React.FC<AIChatFunnelProps> = ({ onOpen, currentPage, initialContext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [thinkingMessage, setThinkingMessage] = useState<string | null>(null);
    const [step, setStep] = useState<FunnelStep>('start');
    const [stepHistory, setStepHistory] = useState<FunnelStep[]>(['start']);
    const [formData, setFormData] = useState<Partial<ContactFormData>>({});
    const [currentForm, setCurrentForm] = useState<React.ReactNode | null>(null);
    const [aiQuestions, setAiQuestions] = useState<{ questionText: string; options: string[] }[]>([]);
    const [currentAiQuestionIndex, setCurrentAiQuestionIndex] = useState(0);
    const [activeConfigurableService, setActiveConfigurableService] = useState<Service | null>(null);
    const [currentConfigStep, setCurrentConfigStep] = useState(0);
    const [initialAIContext, setInitialAIContext] = useState<string | null>(initialContext || null);
    const [roofAnalysisData, setRoofAnalysisData] = useState<RoofAnalysisData | null>(null);
    const [aiInitError, setAiInitError] = useState<string | null>(GEMINI_API_KEY ? null : 'missing-key');
    
    // New states for enhanced features
    const [currentLang, setCurrentLang] = useState<Language>('de-DE');
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isCallMenuOpen, setIsCallMenuOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isVoiceInputSupported, setIsVoiceInputSupported] = useState(false);
    const [contextualPrompts, setContextualPrompts] = useState<string[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentButtonPrompt, setCurrentButtonPrompt] = useState(buttonPrompts[0]);
    const [isButtonVisible, setIsButtonVisible] = useState(false); // NEW: For button intro animation
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const thinkingIntervalRef = useRef<number | null>(null);
    const ai = useRef<GoogleGenAI | null>(null);
    const recognitionRef = useRef<any | null>(null);
    const langMenuRef = useRef<HTMLDivElement>(null);
    const callMenuRef = useRef<HTMLDivElement>(null);
    const comparisonContextRef = useRef<Product[] | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const streamingMessageId = useRef<number | null>(null);
    const utteranceQueue = useRef<string[]>([]);
    const isSpeakingRef = useRef(false);

    // NEW: Effect for button intro animation and prompt cycling
    useEffect(() => {
        const promptInterval = setInterval(() => {
            setCurrentButtonPrompt(prev => {
                const currentIndex = buttonPrompts.indexOf(prev);
                const nextIndex = (currentIndex + 1) % buttonPrompts.length;
                return buttonPrompts[nextIndex];
            });
        }, 5000); // Change every 5 seconds

        const timer = setTimeout(() => {
            setIsButtonVisible(true);
        }, 1500); // Appear after 1.5 seconds

        return () => {
            clearInterval(promptInterval);
            clearTimeout(timer);
        };
    }, []);

    const cancelSpeech = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        utteranceQueue.current = [];
        setIsSpeaking(false);
        isSpeakingRef.current = false;
    };
    
    const speak = useCallback((text: string) => {
        if (isMuted || !text.trim() || !window.speechSynthesis) return;
    
        const processQueue = () => {
            if (utteranceQueue.current.length === 0) {
                setIsSpeaking(false);
                isSpeakingRef.current = false;
                return;
            }
    
            setIsSpeaking(true);
            isSpeakingRef.current = true;
            const textToSpeak = utteranceQueue.current.shift();
            if (!textToSpeak) {
                processQueue();
                return;
            }
            
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            
            const voices = window.speechSynthesis.getVoices();
            const germanVoice = voices.find(voice => voice.lang === 'de-DE' && voice.name.includes('Google')) || voices.find(voice => voice.lang === 'de-DE');
            const englishVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google')) || voices.find(voice => voice.lang === 'en-US');

            utterance.voice = currentLang === 'de-DE' ? germanVoice : englishVoice;
            utterance.lang = currentLang;
    
            utterance.onend = () => {
                processQueue();
            };
            utterance.onerror = (e) => {
                console.error('SpeechSynthesis Error', e);
                processQueue();
            };
            window.speechSynthesis.speak(utterance);
        };
    
        const sentences = text.match(/[^.!?]+[.!?]+|\S+/g) || [text];
        utteranceQueue.current.push(...sentences);
    
        if (!isSpeakingRef.current) {
            processQueue();
        }
    }, [isMuted, currentLang]);

    // Initialize AI and Speech Recognition
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (GEMINI_API_KEY) {
            try {
                ai.current = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
                setAiInitError(null);
            } catch (error) {
                console.error('Fehler bei der Initialisierung von GoogleGenAI:', error);
                setAiInitError('init-failed');
            }
        } else {
            ai.current = null;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setIsVoiceInputSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = currentLang;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => {
                if (isListening) {
                    setIsListening(false);
                }
            };
            
            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                setUserInput(prev => finalTranscript ? prev + finalTranscript : prev);
            };
            recognitionRef.current = recognition;
        }

        const onVoicesChanged = () => {};
        window.speechSynthesis?.addEventListener('voiceschanged', onVoicesChanged);

        return () => {
            window.speechSynthesis?.removeEventListener('voiceschanged', onVoicesChanged);
            cancelSpeech();
            ai.current = null;
        };
    }, []);

    useEffect(() => {
        if(recognitionRef.current) {
            recognitionRef.current.lang = currentLang;
        }
    }, [currentLang]);

    // Handle clicks outside menus
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
            if (callMenuRef.current && !callMenuRef.current.contains(event.target as Node)) {
                setIsCallMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Textarea auto-resize
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 128;
            textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    }, [userInput]);

    // Contextual prompts logic
    useEffect(() => {
        if (isOpen && messages.length <= 1) {
            setContextualPrompts(contextualPromptsMap[currentPage] || []);
        }
    }, [isOpen, currentPage, messages.length]);

    const t = translations[currentLang];
    const isAiAvailable = Boolean(GEMINI_API_KEY) && !aiInitError;
    const aiFallbackMessage = aiInitError === 'missing-key' ? t.aiUnavailable : t.genericError;

    useEffect(() => {
        if (isLoading) {
            let messageIndex = 0;
            const thinkingMessages = thinkingMessage === t.analyzingRoof ? [t.analyzingRoof] : t.thinkingMessages;
            setThinkingMessage(thinkingMessages[0]);
            thinkingIntervalRef.current = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % thinkingMessages.length;
                setThinkingMessage(thinkingMessages[messageIndex]);
            }, 2500);
        } else {
            if (thinkingIntervalRef.current) {
                clearInterval(thinkingIntervalRef.current);
            }
            setThinkingMessage(null);
        }
        return () => {
            if (thinkingIntervalRef.current) {
                clearInterval(thinkingIntervalRef.current);
            }
        };
    }, [isLoading, t, thinkingMessage]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, currentForm, contextualPrompts]);

    useEffect(() => {
        if (isOpen) {
            if (comparisonContextRef.current) {
                const products = comparisonContextRef.current;
                comparisonContextRef.current = null;
                setMessages([]);
                setIsLoading(true);
                setStep('general_chat');
                setStepHistory(['start', 'general_chat']);
                setFormData({});
                setCurrentForm(null);
                
                setTimeout(() => {
                    const productNames = products.map(p => p.name).join(', ');
                    addMessage('user', `Vergleiche bitte diese Produkte für mich: ${productNames}`);
                    getComparisonAnalysis(products);
                }, 100);
            } else {
                const savedState = sessionStorage.getItem('aiChatState');
                if (savedState) {
                    const { savedMessages, savedStep, savedFormData, savedStepHistory, savedLang } = JSON.parse(savedState);
                    setMessages(savedMessages);
                    setStep(savedStep);
                    setFormData(savedFormData);
                    setStepHistory(savedStepHistory || ['start']);
                    setCurrentLang(savedLang || 'de-DE');
                } else {
                    resetConversation('initial');
                }
            }
        }
    }, [isOpen]);
    
    useEffect(() => {
        if (isOpen && !step.startsWith('confirm') && !comparisonContextRef.current) {
            sessionStorage.setItem('aiChatState', JSON.stringify({
                savedMessages: messages,
                savedStep: step,
                savedFormData: formData,
                savedStepHistory: stepHistory,
                savedLang: currentLang,
            }));
        }
    }, [messages, step, formData, stepHistory, isOpen, currentLang]);

    useEffect(() => {
        const handleOpenChat = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (!isOpen) {
                setIsOpen(true);
                onOpen();
            }
            if (customEvent.detail && customEvent.detail.context) {
                 resetConversation('context', customEvent.detail);
            }
        };
        const handleStartNewChatPromo = () => { 
            if (!isOpen) {
                setIsOpen(true);
                onOpen();
            }
            resetConversation('promo'); 
        };
        const handleStartChatWithContext = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (!isOpen) {
                setIsOpen(true);
                onOpen();
            }
            resetConversation('context', customEvent.detail);
        };
         const handleStartComparisonChat = (event: Event) => {
            const customEvent = event as CustomEvent<Product[]>;
            comparisonContextRef.current = customEvent.detail;
            sessionStorage.removeItem('aiChatState');
            if (!isOpen) {
                setIsOpen(true);
                onOpen();
            }
        };
        const handleStartChatWithService = (event: Event) => {
            const customEvent = event as CustomEvent<Service>;
            if (!isOpen) {
                setIsOpen(true);
                onOpen();
            }
            resetConversation('service_context', customEvent.detail);
        };

        document.addEventListener('open-chat', handleOpenChat);
        document.addEventListener('start-new-chat-promo', handleStartNewChatPromo);
        document.addEventListener('start-chat-with-context', handleStartChatWithContext);
        document.addEventListener('start-chat-with-comparison-context', handleStartComparisonChat);
        document.addEventListener('start-chat-with-service', handleStartChatWithService);
        return () => {
            document.removeEventListener('open-chat', handleOpenChat);
            document.removeEventListener('start-new-chat-promo', handleStartNewChatPromo);
            document.removeEventListener('start-chat-with-context', handleStartChatWithContext);
            document.removeEventListener('start-chat-with-comparison-context', handleStartComparisonChat);
            document.removeEventListener('start-chat-with-service', handleStartChatWithService);
        };
    }, [isOpen, onOpen]);

    const addMessage = (sender: 'user' | 'ai' | 'system', text?: string, options?: string[], component?: React.ReactNode, videoId?: string, sources?: GroundingSource[]) => {
        const newMsg = { sender, text, options, component, id: Date.now() + Math.random(), videoId, sources };
        setMessages(prev => [...prev, newMsg]);
        if (sender === 'ai' && text) {
            speak(text);
        }
    };

    const resetConversation = (startType: 'initial' | 'promo' | 'context' | 'service_context', context?: any) => {
        cancelSpeech();
        setIsLoading(true);
        setCurrentForm(null);
        setInitialAIContext(null);
        sessionStorage.removeItem('aiChatState');

        if (!isAiAvailable) {
            setMessages([]);
            setStep('final');
            setStepHistory(['start']);
            setFormData({});

            setTimeout(() => {
                setIsLoading(false);
                addMessage('ai', t.aiUnavailable);
            }, 200);
            return;
        }
        
        let introMessage = t.initialGreeting;
        let initialOptions: string[] | undefined = t.initialOptions;
        let nextStep: FunnelStep = 'start';
        let nextStepHistory: FunnelStep[] = ['start'];
        let initialFormData: Partial<ContactFormData> = {};
            
        if (startType === 'promo') {
            introMessage = "Hallo! Ich sehe, Sie interessieren sich für unser Angebot. Lassen Sie uns direkt loslegen und Ihre kostenlose Analyse mit 1.500 € Rabatt sichern!";
            initialOptions = ["Ja, gerne!", "Ich habe eine andere Frage"];
        } else if (startType === 'service_context' && context) {
            const service = context as Service;
            if (service.configurableFields && service.configurableFields.length > 0) {
                setActiveConfigurableService(service);
                setCurrentConfigStep(0);
                setMessages([]);
                setFormData({ serviceType: service.context });
                setStep('configure_service');
                setStepHistory(['start', 'configure_service']);

                const firstField = service.configurableFields[0];
                setTimeout(() => {
                    setIsLoading(false);
                    addMessage('ai', `Sehr gerne. Um Ihnen ein genaues Angebot für "${service.title}" zu erstellen, benötige ich eine Angabe:`);
                    addMessage('ai', undefined, undefined, <ConfigSlider field={firstField} onConfirm={handleConfigConfirm} />);
                }, 500);
                return; // Exit early
            } else {
                introMessage = `Hallo! Gerne helfe ich Ihnen bei Ihrer Anfrage zum Thema "${service.context}". Handelt es sich um ein gewerbliches oder privates Projekt?`;
                initialOptions = ["Gewerblich", "Privat"];
                nextStep = 'inquiry_type';
                nextStepHistory = ['start', 'inquiry_type'];
                initialFormData = { serviceType: service.context };
            }
        } else if (startType === 'context' && context) {
             if (context.type === 'contextual_help') {
                setInitialAIContext(context.context); // Set the context
                const heading = context.context.split('\n')[0];
                introMessage = `Hallo! Ich sehe, Sie haben eine Frage zum Abschnitt "${heading.substring(0, 50)}...". Was möchten Sie dazu wissen?`;
                initialOptions = ["Was sind die Kernaussagen?", "Kannst du das vereinfachen?", "Gibt es dazu ein Praxisbeispiel?"];
                nextStep = 'general_chat';
                nextStepHistory = ['start', 'general_chat'];
            } else if (context.type === 'use_case') {
                const useCase = context.useCase as UseCase;
                introMessage = `Hallo! Ich sehe, Sie interessieren sich für unsere Lösungen im Bereich "${useCase.title}". Um Sie bestmöglich zu beraten, habe ich ein paar kurze, intelligente Fragen vorbereitet.`;
                initialOptions = undefined;
                initialFormData = { serviceType: `Anfrage für ${useCase.title}` };
                nextStep = 'asking_ai_questions';
                nextStepHistory = ['start', 'asking_ai_questions'];
                
                setTimeout(() => {
                    addMessage('ai', introMessage);
                    generateUseCaseQuestions(useCase);
                }, 500);
                setMessages([]);
                setFormData(initialFormData);
                setStep(nextStep);
                setStepHistory(nextStepHistory);
                return;
            } else if (context.type === 'package_quote') {
                const pkg = context.packageData;
                introMessage = `Hallo! Ich sehe, Sie interessieren sich für unser ${pkg.name}. Eine ausgezeichnete Wahl!\n\n**Zusammenfassung:**\n- Paket: ${pkg.name}\n- Details: ${pkg.details}\n- Preis: ${pkg.price}\n\nUm Ihnen ein passendes Angebot zu erstellen, benötige ich nun noch Ihren Namen.`;
                initialOptions = undefined;
                nextStep = 'get_name';
                nextStepHistory = ['start', 'get_name'];
                initialFormData = { serviceType: pkg.name, userType: pkg.userType };
            } else if (context.type === 'direct_purchase') {
                    introMessage = `Hallo! Ich sehe, Sie möchten den Service "${context.service}" buchen.\n\n**Zusammenfassung:**\n- Service: ${context.service}\n- Details: ${context.details}\n- Geschätzter Preis: ${context.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}\n\nUm die Buchung abzuschließen, benötige ich nun noch Ihren Namen.`;
                initialOptions = undefined;
                nextStep = 'get_name';
                nextStepHistory = ['start', 'get_name'];
                initialFormData = { serviceType: `${context.service} (${context.details})`, userType: 'private' }; // Default to private
            } else if (typeof context === 'string') { // Handle innovation context
                const innovation = innovations.find(i => i.id === context);
                if (innovation) {
                    introMessage = `Hallo! Ich sehe, Sie interessieren sich für unsere Innovation "${innovation.title}". ${innovation.aiInfo}\n\nMöchten Sie dazu ein konkretes Angebot oder haben Sie weitere Fragen?`;
                    initialOptions = ["Angebot anfordern", "Ich habe eine Frage"];
                    initialFormData = { serviceType: innovation.title };
                }
            } else if (context.serviceType) { // Handle generic service context from old wizard
                 introMessage = `Hallo! Gerne helfe ich Ihnen bei Ihrer Anfrage zum Thema "${context.serviceType}". Handelt es sich um ein gewerbliches oder privates Projekt?`;
                 initialOptions = ["Gewerblich", "Privat"];
                 nextStep = 'inquiry_type';
                 nextStepHistory = ['start', 'inquiry_type'];
                 initialFormData = { serviceType: context.serviceType };
            }
        }
            
        setMessages([]);
        setStep(nextStep);
        setStepHistory(nextStepHistory);
        setFormData(initialFormData);

        setTimeout(() => {
            setIsLoading(false);
            addMessage('ai', introMessage, initialOptions);
        }, 500);
    };

    const triggerStepLogic = (targetStep: FunnelStep) => {
        switch(targetStep) {
            case 'start': addMessage('ai', t.initialGreeting, t.initialOptions); break;
            case 'inquiry_type': addMessage('ai', 'Sehr gerne! Handelt es sich um ein gewerbliches oder privates Projekt?', ['Gewerblich', 'Privat']); break;
            case 'service_type': addMessage('ai', 'Verstanden. Wofür interessieren Sie sich im Speziellen?', ["Photovoltaik-Anlage", "Ladepark / Wallbox", "Energiespeicher", "Sonstiges"]); break;
            case 'get_address': addMessage('ai', t.getAddress); break;
            case 'get_name': addMessage('ai', 'Vielen Dank. Wie lautet Ihr vollständiger Name?'); break;
            case 'get_email': addMessage('ai', `Danke. Und Ihre E-Mail-Adresse?`); break;
            case 'get_phone': addMessage('ai', 'Super. Wie lautet Ihre Telefonnummer für Rückfragen? (Optional)'); break;
        }
    };

    const handleBackClick = () => {
        if (stepHistory.length <= 1) return;
        
        addMessage('user', 'Zurück');

        const newHistory = [...stepHistory];
        newHistory.pop();
        const prevStep = newHistory[newHistory.length-1];

        setStep(prevStep);
        setStepHistory(newHistory);
        triggerStepLogic(prevStep);
    };

    const handleSkipClick = () => {
        addMessage('user', 'Fragen überspringen');
        addMessage('ai', 'Verstanden. Um einen Rückruf zu vereinbaren, benötige ich nur Ihren Namen.');
        setStep('get_name_for_callback');
        setStepHistory(prev => [...prev, 'get_name_for_callback']);
    };
    
    const goToStep = (nextStep: FunnelStep) => {
        setStep(nextStep);
        setStepHistory(prev => [...prev, nextStep]);
        triggerStepLogic(nextStep);
    };

    const handleConfirmRoof = () => {
        if (!roofAnalysisData) return;

        const analysisText = `
**Automatische Dachanalyse:**
- **Nutzbare Fläche:** ca. ${roofAnalysisData.usableAreaSqm} m²
- **Störelemente:** ${roofAnalysisData.obstructions.join(', ') || 'Keine'}
- **Mögliche Module:** ca. ${roofAnalysisData.estimatedModuleCount} Stk.
        `;
        setFormData(prev => ({...prev, message: (prev.message || '') + '\n\n' + analysisText}));
        setRoofAnalysisData(null);
        
        addMessage('user', t.confirmYes);
        addMessage('ai', t.analysisSaved);
        goToStep('get_name');
    };

    const handleRejectRoof = () => {
        setRoofAnalysisData(null);
        addMessage('user', t.confirmNo);
        addMessage('ai', t.analysisRejected);
        goToStep('get_address');
    };

    const analyzeRoofFromAddress = async (address: string) => {
        if (!ai.current) {
            addMessage('ai', aiFallbackMessage);
            setIsLoading(false);
            goToStep('inquiry_type');
            return;
        }
        setStep('analyzing_roof');
        setThinkingMessage(t.analyzingRoof);
        setIsLoading(true);
    
        const zoomLevels = [20, 19, 18];
        let bestImage: { base64: string; dataUrl: string } | null = null;
    
        try {
            // Step 1 & 2: Find a valid satellite image by trying different zoom levels and validating with AI
            for (const zoom of zoomLevels) {
                const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=${zoom}&size=600x600&maptype=satellite&key=${process.env.API_KEY}`;
                const mapResponse = await fetch(mapUrl);
                if (!mapResponse.ok) {
                    console.warn(`Map API error for zoom ${zoom}`);
                    continue; // Try next zoom level
                }
                const imageBlob = await mapResponse.blob();
    
                if (imageBlob.size < 10000) { // < 10KB
                    console.warn(`Image size too small for zoom ${zoom}, likely an error image.`);
                    continue;
                }
    
                const dataUrl = await new Promise<string>(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
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
                
                const validationApiCall = () => ai.current!.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: {
                        parts: [
                            { inlineData: { mimeType: imageBlob.type, data: base64data } },
                            { text: validationPrompt },
                        ],
                    },
                    config: { responseMimeType: "application/json", responseSchema: validationSchema }
                });
    
                try {
                    const validationResponse = await callGeminiWithRetry<GenerateContentResponse>(validationApiCall, 2); // Fewer retries for validation
                    const validationResult = JSON.parse(validationResponse.text);
    
                    if (validationResult.isValid) {
                        bestImage = { base64: base64data, dataUrl };
                        break; // Found a good image, exit loop
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
    
            const analysisApiCall = () => ai.current!.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { inlineData: { mimeType: 'image/jpeg', data: bestImage!.base64 } },
                        { text: analysisPrompt },
                    ],
                },
                config: { responseMimeType: "application/json", responseSchema: analysisSchema }
            });
    
            const analysisResponse = await callGeminiWithRetry<GenerateContentResponse>(analysisApiCall);
            const analysisResult: RoofAnalysisData = JSON.parse(analysisResponse.text);
            
            if (!analysisResult.analysisPossible) {
                 throw new Error("Analysis failed: AI could not analyze the validated image.");
            }
    
            setRoofAnalysisData(analysisResult);
            addMessage('ai', undefined, undefined, 
                <RoofAnalysisCard 
                    imageDataUrl={bestImage.dataUrl} 
                    analysisData={analysisResult}
                    onConfirm={handleConfirmRoof}
                    onReject={handleRejectRoof}
                    t={t}
                />
            );
            setStep('confirm_roof');
            
        } catch (err) {
            console.error("Fehler bei der Dachanalyse:", err);
            const errorMessage = getErrorMessageAsString(err);
            if (errorMessage.includes("Map API")) {
                addMessage('ai', t.mapError);
                goToStep('get_address'); // Allow user to re-enter address
            } else {
                addMessage('ai', t.analysisError);
                goToStep('inquiry_type'); // Fallback to normal funnel if analysis itself fails
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const getComparisonAnalysis = async (products: Product[]) => {
        if (!ai.current) {
            addMessage('ai', aiFallbackMessage);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setStep('general_chat'); 

        const productDataForPrompt = products.map(item => ({
            name: item.name,
            description: item.description,
            basePrice: item.basePrice,
            specs: item.specs,
        }));
        
        const prompt = `Sie sind ein erstklassiger Experte für Photovoltaik-Technologie und Berater für ZOE Solar. Ein Kunde möchte die folgenden Produkte aus der Kategorie "${products[0].category}" vergleichen.

Produktdaten:
${JSON.stringify(productDataForPrompt, null, 2)}

Ihre Aufgabe ist es, eine umfassende Vergleichsanalyse und eine klare Empfehlung im Markdown-Format für eine Chat-Anzeige zu liefern.

**Antwort-Struktur:**
1.  **Einleitung:** Beginnen Sie mit einer kurzen Zusammenfassung der verglichenen Produkte.
2.  **Direktvergleich:** Vergleichen Sie die Produkte anhand der wichtigsten Spezifikationen (z.B. Leistung, Wirkungsgrad, Garantie, Technologie, Preis). Nutzen Sie Fettdruck und Listen zur Verdeutlichung.
3.  **Empfehlung & Fazit:** Geben Sie eine klare, begründete Empfehlung. Erklären Sie, welches Produkt für welchen Kundentyp (z.B. "preisbewusst", "leistungsorientiert", "auf Langlebigkeit bedacht") die beste Wahl ist. Schließen Sie mit einem zusammenfassenden Satz.`;

        try {
            const apiCall = () => ai.current!.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
            const response: GenerateContentResponse = await callGeminiWithRetry(apiCall);
            addMessage('ai', response.text);
        } catch (err) {
            const errorMessage = getErrorMessageAsString(err);
            console.error("Fehler bei der KI-Analyse:", errorMessage);
            const userMessage = (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED'))
                ? t.rateLimitError
                : t.genericError;
            addMessage('ai', userMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const generateUseCaseQuestions = async (useCase: UseCase) => {
        if (!ai.current) {
            setIsLoading(false);
            addMessage('ai', aiFallbackMessage);
            goToStep('inquiry_type');
            return;
        }

        let prompt = `Sie sind ein Experte für Photovoltaik-Lösungen für Gewerbekunden bei ZOE Solar. Ein potenzieller Kunde aus der Branche "${useCase.title}" interessiert sich für unsere Lösungen.

        Ihre Aufgabe: Generieren Sie die 2-3 wichtigsten, weiterführenden Fragen, um den Bedarf des Kunden zu qualifizieren. Die Fragen sollen sich auf die spezifischen Herausforderungen und Lösungen dieser Branche beziehen, die hier aufgeführt sind:
        - Typische Herausforderungen: ${useCase.challenges.map(c => c.title).join(', ')}
        - Unsere Lösungen: ${useCase.solutions.map(s => s.title).join(', ')}

        Geben Sie für jede Frage 3-4 plausible Multiple-Choice-Antwortmöglichkeiten vor. Die erste Frage sollte allgemein den primären Anwendungsfall klären.

        Antworten Sie ausschließlich im JSON-Format, das dem vorgegebenen Schema entspricht. Fügen Sie keine Erklärungen oder einleitenden Text hinzu.`;

        // NEW SOPHISTICATED PROMPT FOR AGRI-PV
        if (useCase.id === 'agri-pv') {
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
            const apiCall = () => ai.current!.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });
            const response: GenerateContentResponse = await callGeminiWithRetry(apiCall);
            const result = JSON.parse(response.text);

            if (result.questions && result.questions.length > 0) {
                setAiQuestions(result.questions);
                setCurrentAiQuestionIndex(0);
                addMessage('ai', result.questions[0].questionText, result.questions[0].options);
            } else {
                throw new Error("AI hat keine validen Fragen zurückgegeben.");
            }
        } catch (err) {
            const errorMessage = getErrorMessageAsString(err);
            console.error("Fehler bei der Generierung der KI-Fragen:", errorMessage);
            const userMessage = (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED'))
                ? "Unsere KI-Systeme sind leider überlastet. Lassen Sie uns den Standardweg zur Anfrage gehen, das geht immer!"
                : "Entschuldigung, bei der Vorbereitung Ihrer intelligenten Fragen ist ein Fehler aufgetreten. Lassen Sie uns stattdessen den Standardweg gehen.";
            addMessage('ai', userMessage);
            goToStep('inquiry_type'); // Fallback
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleConfigConfirm = (value: number) => {
        if (!activeConfigurableService || !activeConfigurableService.configurableFields) return;

        const currentField = activeConfigurableService.configurableFields[currentConfigStep];
        addMessage('user', `${currentField.label}: ${value} ${currentField.unit}`);
        setFormData(prev => ({ ...prev, [currentField.id]: value, message: `${prev.message || ''} ${currentField.label}: ${value} ${currentField.unit}\n` }));

        const nextStepIndex = currentConfigStep + 1;
        if (nextStepIndex < activeConfigurableService.configurableFields.length) {
            setCurrentConfigStep(nextStepIndex);
            const nextField = activeConfigurableService.configurableFields[nextStepIndex];
            addMessage('ai', `Vielen Dank. Als nächstes benötige ich diese Angabe:`);
            addMessage('ai', undefined, undefined, <ConfigSlider field={nextField} onConfirm={handleConfigConfirm} />);
        } else {
            setActiveConfigurableService(null);
            setCurrentConfigStep(0);
            goToStep('get_name');
        }
    };

    const handleUserInput = async (input: string) => {
        if (!input.trim()) return;
        addMessage('user', input);
        setUserInput('');
        setIsLoading(true);
        setContextualPrompts([]);
    
        if (initialAIContext) {
            await processGeneralQuestion(input, initialAIContext);
            setInitialAIContext(null);
            return;
        }
    
        let shouldSetLoadingFalse = true;
    
        switch(step) {
            case 'start':
                if (input.toLowerCase().includes('anfrage') || input.toLowerCase().includes('angebot')) { goToStep('inquiry_type'); } 
                else if (input === t.roofAnalysisPrompt) { goToStep('get_address'); }
                else { 
                    shouldSetLoadingFalse = false;
                    await processGeneralQuestion(input); 
                }
                break;
            case 'inquiry_type':
                setFormData(prev => ({ ...prev, userType: input.toLowerCase().includes('gewerblich') ? 'commercial' : 'private' }));
                goToStep('service_type');
                break;
            case 'service_type':
                setFormData(prev => ({ ...prev, serviceType: input }));
                goToStep('get_name');
                break;
            case 'get_address':
                shouldSetLoadingFalse = false;
                await analyzeRoofFromAddress(input);
                break;
            case 'confirm_roof':
                addMessage('ai', 'Bitte benutzen Sie die Buttons, um zu bestätigen.');
                break;
            case 'configure_service':
                addMessage('ai', 'Bitte benutzen Sie den Schieberegler, um Ihre Auswahl zu treffen.');
                break;
            case 'asking_ai_questions':
                const currentQuestionText = aiQuestions[currentAiQuestionIndex]?.questionText;
                const answerKey = `AI-Frage ${currentAiQuestionIndex + 1}: ${currentQuestionText}`;
                setFormData(prev => ({ ...prev, [answerKey]: input }));
                
                const nextIndex = currentAiQuestionIndex + 1;
                if (nextIndex < aiQuestions.length) {
                    setCurrentAiQuestionIndex(nextIndex);
                    const nextQuestion = aiQuestions[nextIndex];
                    addMessage('ai', nextQuestion.questionText, nextQuestion.options);
                } else {
                    addMessage('ai', 'Vielen Dank für Ihre Antworten! Um Ihre Anfrage abzuschließen, benötige ich nun noch Ihre Kontaktdaten.');
                    setAiQuestions([]);
                    setCurrentAiQuestionIndex(0);
                    goToStep('get_name');
                }
                break;
            case 'get_name':
                 setFormData(prev => ({ ...prev, contactPerson: input }));
                 goToStep('get_email');
                 break;
            case 'get_email':
                if (!input.includes('@') || !input.includes('.')) {
                    addMessage('ai', 'Das scheint keine gültige E-Mail-Adresse zu sein. Bitte versuchen Sie es erneut.');
                } else {
                    setFormData(prev => ({ ...prev, email: input }));
                    goToStep('get_phone');
                }
                break;
            case 'get_phone':
                const finalFormData = { ...formData, phone: input };
                setFormData(finalFormData);
                addMessage('ai', 'Fast geschafft! Bitte prüfen und bestätigen Sie Ihre Angaben.');
                setStep('confirm_and_send');
                setCurrentForm(<ConfirmationForm formData={finalFormData} onUpdate={setFormData} onSubmit={submitInquiry} onBack={() => {
                    setCurrentForm(null);
                    addMessage('ai', 'Okay, was möchten Sie ändern? Beginnen wir erneut mit Ihrem Namen.');
                    goToStep('get_name');
                }}/>);
                break;
            case 'get_name_for_callback':
                setFormData({ ...formData, contactPerson: input });
                addMessage('ai', `Danke, ${input}. Und Ihre Telefonnummer für den Rückruf?`);
                setStep('get_phone_for_callback');
                setStepHistory(prev => [...prev, 'get_phone_for_callback']);
                break;
            case 'get_phone_for_callback':
                setFormData(prev => ({ ...prev, phone: input }));
                addMessage('ai', `Vielen Dank. Ich habe notiert: Rückruf für ${formData.contactPerson} an ${input}. Ist das korrekt?`, ['Ja, Rückruf anfordern', 'Nein, korrigieren']);
                setStep('confirm_and_send_callback');
                setStepHistory(prev => [...prev, 'confirm_and_send_callback']);
                break;
            case 'confirm_and_send_callback':
                if (input.toLowerCase().includes('ja')) {
                    shouldSetLoadingFalse = false;
                    await submitInquiry();
                } else {
                    addMessage('ai', 'Okay, lassen Sie uns die Daten korrigieren. Wie lautet Ihr Name?');
                    goToStep('get_name_for_callback');
                }
                break;
            default:
                 shouldSetLoadingFalse = false;
                 await processGeneralQuestion(input);
        }

        if (shouldSetLoadingFalse) {
            setIsLoading(false);
        }
    };

    const processGeneralQuestion = async (question: string, context?: string) => {
        if (!ai.current) {
            addMessage('ai', aiFallbackMessage);
            setIsLoading(false);
            return;
        }
    
        cancelSpeech();
    
        const serviceKnowledge = services.map(s => ({ id: s.id, title: s.title, context: s.context }));
        const languageInstruction = currentLang === 'de-DE' ? 'Antworte auf Deutsch.' : 'Answer in English.';
        const pageContext = `Der Nutzer befindet sich gerade auf der Seite "${currentPage}". Beziehe dich in deiner Antwort proaktiv darauf, wenn es zur Frage passt.`;
    
        const prompt = `Du bist "ZOE", ein freundlicher und kompetenter KI-Berater für ZOE Solar. ${languageInstruction} ${pageContext}
        ${context ? `**Zusätzlicher Kontext zum aktuellen Thema des Nutzers:**\n${context}\n\n` : ''}
        **Wissensbasis über ZOE Solar:**
        ${websiteKnowledge}
    
        **Aktuelle Benutzeranfrage:**
        "${question}"
    
        **Deine Aufgabe:**
        1. Prüfe zuerst, ob die Anfrage des Nutzers eindeutig einem der folgenden Services zugeordnet werden kann. Wenn ja, antworte NUR mit dem JSON-Objekt {"serviceId": "ID_DES_SERVICES"}.
        Service-Liste: ${JSON.stringify(serviceKnowledge)}
        
        2. Wenn keine klare Service-Zuordnung möglich ist, nutze die Google-Suche, um aktuelle Informationen, Ereignisse oder Themen zu recherchieren, die nicht in deiner Wissensbasis enthalten sind. Antworte dann kurz, präzise und hilfreich.
        3. Wenn die Antwort nicht in deiner Wissensbasis enthalten ist, weise freundlich darauf hin und biete an, eine Anfrage an einen menschlichen Experten zu stellen.
        4. Wenn der Nutzer nach einem Angebot fragt, starte proaktiv den Anfrageprozess, indem du fragst: "Sehr gerne! Handelt es sich um ein gewerbliches oder privates Projekt?" und setze den internen Step auf 'inquiry_type'.
        5. Prüfe IMMER, ob es ein relevantes YouTube-Video gibt, das die Antwort visuell unterstützen könnte. Wenn ein passendes, seriöses Video (von Experten, Herstellern, Fachkanälen) existiert, FÜGE IMMER den vollständigen YouTube-Link in einer neuen Zeile in deine Antwort ein. Gib Videos den Vorzug, wenn es das Verständnis verbessert.
        6. Beende allgemeine Antworten immer mit einer offenen Frage, wie "Kann ich sonst noch etwas für Sie tun?".
        `;
        
        const newAiMessageId = Date.now() + Math.random();
        streamingMessageId.current = newAiMessageId;
        setMessages(prev => [...prev, { sender: 'ai', id: newAiMessageId, text: '' }]);
        
        let fullResponseText = "";
        let ttsBuffer = "";
    
        try {
            const streamResult = await ai.current.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    tools: [{googleSearch: {}}],
                },
            });
    
            for await (const chunk of streamResult) {
                const chunkText = chunk.text;
                if (chunkText) {
                    fullResponseText += chunkText;
                    ttsBuffer += chunkText;
    
                    setMessages(prev => prev.map(msg => 
                        msg.id === newAiMessageId ? { ...msg, text: fullResponseText } : msg
                    ));
    
                    let lastPunctuationIndex = -1;
                    for (let i = ttsBuffer.length - 1; i >= 0; i--) {
                        if (".!?".includes(ttsBuffer[i])) {
                            lastPunctuationIndex = i;
                            break;
                        }
                    }
                    if (lastPunctuationIndex !== -1) {
                        const sentenceToSpeak = ttsBuffer.substring(0, lastPunctuationIndex + 1);
                        speak(sentenceToSpeak);
                        ttsBuffer = ttsBuffer.substring(lastPunctuationIndex + 1);
                    }
                }
            }
            
            speak(ttsBuffer);
            
            const finalResponse = await streamResult.response;
            const groundingChunks = finalResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
            const sources: GroundingSource[] = groundingChunks
                    ?.map((chunk: any) => chunk.web)
                    .filter((source: any) => source?.uri) || [];
    
            const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu.be\/)([a-zA-Z0-9_-]{11})/;
            const match = fullResponseText.match(youtubeRegex);
            const videoId = match ? match[1] : undefined;
            let cleanText = videoId ? fullResponseText.replace(youtubeRegex, '').trim() : fullResponseText;
    
             try {
                const jsonResponse = JSON.parse(cleanText);
                if (jsonResponse.serviceId) {
                    const matchedService = services.find(s => s.id === jsonResponse.serviceId);
                    if (matchedService) {
                        setIsLoading(false);
                        resetConversation('service_context', {...matchedService, context: question });
                        return;
                    }
                }
            } catch (e) {
                // Not JSON, continue
            }
            
            if(cleanText.includes("inquiry_type")){
                const textWithoutTrigger = cleanText.replace("inquiry_type", "").trim();
                 setStep('inquiry_type');
                 setStepHistory(prev => [...prev, 'inquiry_type']);
                 setMessages(prev => prev.map(msg => 
                     msg.id === newAiMessageId 
                     ? { ...msg, text: textWithoutTrigger, videoId, sources, options: ['Gewerblich', 'Privat'] } 
                     : msg
                 ));
                 speak(textWithoutTrigger);
            } else {
                 setMessages(prev => prev.map(msg => 
                     msg.id === newAiMessageId ? { ...msg, text: cleanText, videoId, sources } : msg
                 ));
            }
        } catch (err) {
            const errorMessage = getErrorMessageAsString(err);
            console.error("Fehler bei der allgemeinen KI-Anfrage:", errorMessage);
            const userMessage = (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED'))
                ? t.rateLimitError
                : t.genericError;
            addMessage('ai', userMessage);
        } finally {
            setIsLoading(false);
            streamingMessageId.current = null;
        }
    };
    
    const submitInquiry = async () => {
        setCurrentForm(null);
        setIsLoading(true);
        addMessage('system', 'Sende Anfrage an die Experten...');
        try {
            const { dataPrivacy, ...dataToSend } = formData;
            await sendInquiryToFapro(dataToSend as Omit<ContactFormData, 'dataPrivacy'>);
            addMessage('ai', `Vielen Dank, ${formData.contactPerson}! Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns in Kürze. Kann ich sonst noch etwas für Sie tun?`);
            setStep('final');
        } catch (error) {
             addMessage('ai', 'Leider gab es ein Problem beim Senden. Bitte versuchen Sie es später erneut.');
             console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            cancelSpeech();
            recognitionRef.current.start();
        }
        setIsCallMenuOpen(false);
    };

    const selectLang = (lang: Language) => {
        setCurrentLang(lang);
        setIsLangMenuOpen(false);
        if(messages.length <= 1) {
            resetConversation('initial');
        }
    };
    
    const isFunnelStep = step !== 'start' && step !== 'general_chat' && !step.startsWith('confirm') && !step.includes('final') && step !== 'asking_ai_questions' && step !== 'configure_service';

    return (
        <>
            <button 
                onClick={() => { setIsOpen(prev => !prev); if(!isOpen) onOpen(); }} 
                className={`fixed bottom-6 right-6 z-[110] flex items-center gap-4 h-16 px-6 rounded-full bg-slate-800 text-white font-bold shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg hover:shadow-green-400/30 focus:outline-none focus:ring-4 focus:ring-green-400/50 
                ${isOpen ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100'} 
                ${isButtonVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} 
                aria-label="KI-Berater fragen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span key={currentButtonPrompt} className="hidden sm:inline animate-text-overlay">{currentButtonPrompt}</span>
            </button>
            
             <div className={`fixed bottom-6 right-6 z-[110] w-full max-w-lg h-[80vh] max-h-[700px] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/80 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <header className="flex-shrink-0 p-4 bg-slate-50 flex justify-between items-center border-b border-slate-200">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">{t.assistantName}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`}></span>
                            {isSpeaking ? t.isSpeaking : t.online}
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                         <div className="relative" ref={langMenuRef}>
                            <button onClick={() => setIsLangMenuOpen(p => !p)} className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-1.5" aria-label="Sprache wechseln">
                                <span className="text-xl">{currentLang === 'de-DE' ? '🇩🇪' : '🇬🇧'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {isLangMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-200 animate-fade-in z-20">
                                    <button onClick={() => selectLang('de-DE')} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-slate-100">🇩🇪 Deutsch</button>
                                    <button onClick={() => selectLang('en-US')} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-slate-100">🇬🇧 English</button>
                                </div>
                            )}
                         </div>
                         <button onClick={() => setIsMuted(prev => !prev)} className={`p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors ${!isMuted ? '' : 'bg-red-100 text-red-600'}`} aria-label={isMuted ? "Stummschaltung aufheben" : "Stummschalten"}>
                            {isMuted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l4-4m0 0l-4-4m4 4H7" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                            )}
                        </button>
                         <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors" aria-label="Chat schließen"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                </header>

                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                <div className={`prose-custom prose-sm max-w-[85%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : (msg.sender === 'system' ? 'w-full text-center text-slate-500 text-sm' : 'bg-slate-100 text-slate-800 rounded-bl-none')}`}>
                                    {msg.videoId && <YouTubeEmbed videoId={msg.videoId} />}
                                    {msg.text && <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\* (.*?)(?=\n\* |$)/g, '<li>$1</li>').replace(/(\r\n|\n|\r)/gm,"<br>").replace(/<li>/g, '<li style="margin-left: 1.5em; list-style-type: disc;">') }}></div>}
                                    {msg.component}
                                    {msg.options && (
                                        <div className="mt-3 flex flex-col items-start gap-2">
                                            {msg.options.map((option, i) => (
                                                <button 
                                                    key={i} 
                                                    onClick={() => handleUserInput(option)} 
                                                    className="px-4 py-2.5 bg-white border border-slate-300 text-slate-800 rounded-xl font-semibold hover:bg-green-50 hover:border-green-400 transition-all duration-200 self-stretch text-left shadow-sm">
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-slate-200">
                                            <h4 className="text-xs font-bold text-slate-500 mb-2">Quellen:</h4>
                                            <ul className="space-y-1 text-xs">
                                                {msg.sources.map((source, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-slate-400">{i + 1}.</span>
                                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline truncate block" title={source.title}>
                                                            {source.title || new URL(source.uri).hostname}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {msg.sender === 'ai' && isFunnelStep && index === messages.length - 1 && (
                                <div className="mt-2 flex items-center gap-2">
                                    <button onClick={handleBackClick} className="text-xs text-slate-500 hover:text-slate-800 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                        Zurück
                                    </button>
                                    <button onClick={handleSkipClick} className="text-xs text-slate-500 hover:text-slate-800 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
                                        Fragen überspringen
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] p-3 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-none flex items-center gap-4">
                                <div className="w-8 h-8 flex-shrink-0">
                                    <div className="w-full h-full border-2 border-t-transparent border-green-500 rounded-full animate-spin"></div>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-slate-800">{thinkingMessage === t.analyzingRoof ? t.analyzingRoof : t.thinking}</p>
                                    {thinkingMessage && thinkingMessage !== t.analyzingRoof && <p key={thinkingMessage} className="text-sm text-slate-500 animate-fade-in">{thinkingMessage}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {currentForm && <div className="p-4 border-t border-slate-200">{currentForm}</div>}

                <footer className="flex-shrink-0 p-3 bg-slate-50 border-t border-slate-200 form-on-light">
                    {contextualPrompts.length > 0 && (
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2 hide-scrollbar">
                            {contextualPrompts.map((prompt, i) => (
                                <button key={i} onClick={() => handleUserInput(prompt)} className="flex-shrink-0 px-3 py-1.5 bg-slate-200 text-slate-700 text-sm font-semibold rounded-full hover:bg-green-100 hover:text-green-800 transition-colors">
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="relative">
                        {isCallMenuOpen && (
                            <div ref={callMenuRef} className="absolute bottom-full mb-3 w-full bg-white rounded-xl shadow-2xl border border-slate-200 p-2 space-y-2 animate-fade-in">
                                <a href="tel:+493012345678" className="w-full text-left flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group">
                                    <span className="text-green-600">☀️</span>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{t.callCustomerService}</h4>
                                        <p className="text-sm text-slate-500">+49 30 123 456 78</p>
                                    </div>
                                </a>
                                <button onClick={toggleListening} className="w-full text-left flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group">
                                    <span className="text-green-600">🤖</span>
                                     <div>
                                        <h4 className="font-bold text-slate-800">{t.speakWithAI}</h4>
                                        <p className="text-sm text-slate-500">Spracheingabe starten</p>
                                    </div>
                                </button>
                            </div>
                        )}
                        <form onSubmit={(e) => { e.preventDefault(); handleUserInput(userInput); }} className="flex items-end gap-2 bg-white p-2 rounded-xl border border-slate-300 focus-within:ring-2 focus-within:ring-green-500 transition-shadow">
                             <button type="button" onClick={() => setIsCallMenuOpen(p => !p)} className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100 text-slate-500" aria-label="Anruf-Optionen">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                            </button>
                             {isVoiceInputSupported && (
                                <button type="button" onClick={toggleListening} className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 text-white' : 'hover:bg-slate-100 text-slate-500'}`} aria-label={isListening ? "Spracheingabe stoppen" : "Spracheingabe starten"}>
                                    {isListening ? (
                                        <div className="w-4 h-4 bg-white rounded-md animate-pulse"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                    )}
                                </button>
                             )}
                            <textarea
                                ref={textareaRef}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleUserInput(userInput);
                                    }
                                }}
                                placeholder={step.startsWith('confirm') || step === 'configure_service' ? t.inputDisabledPlaceholder : t.inputPlaceholder}
                                className="w-full bg-transparent focus:outline-none resize-none text-slate-800"
                                rows={1}
                                disabled={isLoading || step.startsWith('confirm') || step === 'configure_service'}
                            />
                            <button type="submit" className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors disabled:bg-slate-400" disabled={isLoading || !userInput.trim() || step.startsWith('confirm') || step === 'configure_service'}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button>
                        </form>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default AIChatFunnel;
import React, { useEffect, useRef, useState } from 'react';
import { Page } from '../../types';
import { useAIChatState, Language } from '../../hooks/useAIChatState';
import { useAIVoiceInput } from '../../hooks/useAIVoiceInput';
import { useAIChatPersistence } from '../../hooks/useAIChatPersistence';
import { useAIMessageProcessing } from '../../hooks/useAIMessageProcessing';
import { useAIDocumentGeneration } from '../../hooks/useAIDocumentGeneration';
import { AIChatService } from '../../services/AIChatService';
import { websiteKnowledge } from '../../data/websiteKnowledge';
import { services } from '../../data/services';
import { Product } from '../../data/productTypes';
import { UseCase } from '../../data/useCases';
import { innovations } from '../../data/innovations';
import AIChatMessages from './AIChatMessages';
import AIChatInput from './AIChatInput';
import AIChatVoiceControls from './AIChatVoiceControls';
import { ConfigSlider } from '../ConfigSlider';
import ConfirmationForm from '../ConfirmationForm';
import RoofAnalysisCard from '../RoofAnalysisCard';
import YouTubeEmbed from '../YouTubeEmbed';
import DOMPurify from 'dompurify';

type FunnelStep = 'start' | 'inquiry_type' | 'service_type' | 'get_name' | 'get_email' | 'get_phone' | 'confirm_and_send' | 'final' | 'general_chat' | 'get_name_for_callback' | 'get_phone_for_callback' | 'confirm_and_send_callback' | 'callback_final' | 'asking_ai_questions' | 'configure_service' | 'get_address' | 'analyzing_roof' | 'confirm_roof';

const buttonPrompts = [
    "Wie kann ich helfen?",
    "Neue Anfrage starten...",
    "Was ist Agri-PV?",
    "Rechnet sich eine Solaranlage für mich?",
    "Welche Förderungen gibt es 2025?",
];

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

const translations: Record<Language, Record<string, string | string[]>> = {
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

interface AIChatContainerProps {
    onOpen: () => void;
    currentPage: Page;
    initialContext?: string;
}

const AIChatContainer: React.FC<AIChatContainerProps> = ({ onOpen, currentPage, initialContext }) => {
    // State management
    const {
        isOpen, setIsOpen, messages, setMessages, userInput, setUserInput, isLoading, setIsLoading,
        thinkingMessage, setThinkingMessage, step, setStep, stepHistory, setStepHistory,
        formData, setFormData, currentForm, setCurrentForm, aiQuestions, setAiQuestions,
        currentAiQuestionIndex, setCurrentAiQuestionIndex, activeConfigurableService,
        setActiveConfigurableService, currentConfigStep, setCurrentConfigStep,
        initialAIContext, setInitialAIContext, roofAnalysisData, setRoofAnalysisData,
        currentLang, setCurrentLang, isLangMenuOpen, setIsLangMenuOpen,
        isCallMenuOpen, setIsCallMenuOpen, contextualPrompts, setContextualPrompts,
        aiInitError, setAiInitError, addMessage, goToStep, resetFormData
    } = useAIChatState();

    // Additional local state
    const [currentButtonPrompt, setCurrentButtonPrompt] = useState(buttonPrompts[0]);
    const [isButtonVisible, setIsButtonVisible] = useState(false);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const thinkingIntervalRef = useRef<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const langMenuRef = useRef<HTMLDivElement | null>(null);
    const callMenuRef = useRef<HTMLDivElement | null>(null);

    // API configuration
    const OPENROUTER_API_KEY = (import.meta.env.VITE_OPENROUTER_API_KEY ?? import.meta.env.VITE_API_KEY ?? '') as string;
    const isAiAvailable = Boolean(OPENROUTER_API_KEY) && !aiInitError;
    const aiFallbackMessage = (aiInitError === 'missing-key'
        ? (typeof translations[currentLang].aiUnavailable === 'string'
            ? translations[currentLang].aiUnavailable
            : Array.isArray(translations[currentLang].aiUnavailable)
                ? translations[currentLang].aiUnavailable[0]
                : "Der KI-Assistent steht derzeit nicht zur Verfügung.")
        : (typeof translations[currentLang].genericError === 'string'
            ? translations[currentLang].genericError
            : Array.isArray(translations[currentLang].genericError)
                ? translations[currentLang].genericError[0]
                : "Entschuldigung, es ist ein technischer Fehler aufgetreten."
        )) as string;

    // Voice input hook
    const {
        isListening, isVoiceInputSupported, isMuted, isSpeaking,
        setIsMuted, toggleListening, cancelSpeech, speak
    } = useAIVoiceInput(currentLang, setUserInput);

    // Message processing hook
    const {
        ai, comparisonContextRef, streamingMessageId,
        getComparisonAnalysis, generateUseCaseQuestions, processGeneralQuestion
    } = useAIMessageProcessing({
        apiKey: OPENROUTER_API_KEY,
        currentLang,
        currentPage,
        isAiAvailable,
        aiFallbackMessage,
        rateLimitError: (typeof translations[currentLang].rateLimitError === 'string'
            ? translations[currentLang].rateLimitError
            : Array.isArray(translations[currentLang].rateLimitError)
                ? translations[currentLang].rateLimitError[0]
                : "Unsere KI-Systeme sind im Moment stark ausgelastet."
        ) as string,
        genericError: (typeof translations[currentLang].genericError === 'string'
            ? translations[currentLang].genericError
            : Array.isArray(translations[currentLang].genericError)
                ? translations[currentLang].genericError[0]
                : "Entschuldigung, es ist ein technischer Fehler aufgetreten."
        ) as string,
    });

    // Persistence hook
    const { saveChatState, loadChatState, clearChatState } = useAIChatPersistence({
        isOpen, messages, step, formData, stepHistory, currentLang, onOpen,
        comparisonContextRef,
        onResetConversation: (type, context) => resetConversation(type, context),
        onSetMessages: setMessages,
        onSetStep: setStep,
        onSetFormData: setFormData,
        onSetStepHistory: setStepHistory,
        onSetCurrentLang: setCurrentLang,
        onSetIsLoading: setIsLoading,
    });

    // Document generation hook
    const { generatePDFProposal, downloadDocument } = useAIDocumentGeneration();

    // AI Service
    const aiService = useRef<AIChatService | null>(null);
    useEffect(() => {
        if (OPENROUTER_API_KEY) {
            aiService.current = new AIChatService({ apiKey: OPENROUTER_API_KEY });
        }
        return () => {
            aiService.current?.cleanup();
        };
    }, [OPENROUTER_API_KEY]);

    // Button animation effect
    useEffect(() => {
        const promptInterval = setInterval(() => {
            setCurrentButtonPrompt(prev => {
                const currentIndex = buttonPrompts.indexOf(prev || '');
                const nextIndex = (currentIndex + 1) % buttonPrompts.length;
                return buttonPrompts[nextIndex];
            });
        }, 5000);

        const timer = setTimeout(() => {
            setIsButtonVisible(true);
        }, 1500);

        return () => {
            clearInterval(promptInterval);
            clearTimeout(timer);
        };
    }, []);

    // Thinking message animation
    useEffect(() => {
        if (isLoading) {
            let messageIndex = 0;
            const t = translations[currentLang];
            const analyzingRoofMessage = (typeof t.analyzingRoof === 'string' ? t.analyzingRoof : Array.isArray(t.analyzingRoof) ? t.analyzingRoof[0] : "Analysiere Satellitenbild...");
            const thinkingMessages = thinkingMessage === analyzingRoofMessage
                ? [analyzingRoofMessage]
                : (Array.isArray(t.thinkingMessages)
                    ? t.thinkingMessages.map(msg => typeof msg === 'string' ? msg : (Array.isArray(msg) ? msg[0] : "KI denkt nach..."))
                    : ["KI denkt nach..."]);

            if (thinkingMessages && thinkingMessages.length > 0) {
                setThinkingMessage(thinkingMessages[0] || null);
                thinkingIntervalRef.current = window.setInterval(() => {
                    messageIndex = (messageIndex + 1) % thinkingMessages.length;
                    setThinkingMessage(thinkingMessages[messageIndex] || null);
                }, 2500);
            }
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
    }, [isLoading, currentLang, thinkingMessage]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, currentForm, contextualPrompts]);

    // Contextual prompts logic
    useEffect(() => {
        if (isOpen && messages.length <= 1) {
            setContextualPrompts(contextualPromptsMap[currentPage] || []);
        }
    }, [isOpen, currentPage, messages.length]);

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

    // Enhanced addMessage with speech
    const enhancedAddMessage = (sender: 'user' | 'ai' | 'system', text?: string, options?: string[], component?: React.ReactNode, videoId?: string, sources?: Array<{ uri: string; title: string }>) => {
        addMessage(sender, text, options, component, videoId, sources);
        if (sender === 'ai' && text) {
            speak(text);
        }
    };

    const resetConversation = (startType: 'initial' | 'promo' | 'context' | 'service_context', context?: any) => {
        cancelSpeech();
        setIsLoading(true);
        setCurrentForm(null);
        setInitialAIContext(null);
        clearChatState();
        resetFormData();

        const t = translations[currentLang];

        if (!isAiAvailable) {
            setMessages([]);
            setStep('final' as FunnelStep);
            setTimeout(() => {
                setIsLoading(false);
                const aiUnavailableMessage = typeof t.aiUnavailable === 'string'
                    ? t.aiUnavailable
                    : Array.isArray(t.aiUnavailable)
                        ? t.aiUnavailable[0]
                        : "Der KI-Assistent steht derzeit nicht zur Verfügung.";
                addMessage('ai', aiUnavailableMessage);
            }, 200);
            return;
        }

        // Handle different start types
        let introMessage = t.initialGreeting;
        let initialOptions: string[] | undefined = Array.isArray(t.initialOptions) ? t.initialOptions : undefined;
        let nextStep = 'start';

        if (startType === 'promo') {
            introMessage = "Hallo! Ich sehe, Sie interessieren sich für unser Angebot. Lassen Sie uns direkt loslegen und Ihre kostenlose Analyse mit 1.500 € Rabatt sichern!";
            initialOptions = ["Ja, gerne!", "Ich habe eine andere Frage"];
        } else if (startType === 'service_context' && context) {
            // Handle service context initialization
            if (context.configurableFields && context.configurableFields.length > 0) {
                setActiveConfigurableService(context);
                setCurrentConfigStep(0);
                setFormData({ serviceType: context.context });
                setStep('configure_service' as FunnelStep);

                const firstField = context.configurableFields[0];
                setTimeout(() => {
                    setIsLoading(false);
                    addMessage('ai', `Sehr gerne. Um Ihnen ein genaues Angebot für "${context.title}" zu erstellen, benötige ich eine Angabe:`);
                    addMessage('ai', undefined, undefined, <ConfigSlider field={firstField} onConfirm={handleConfigConfirm} />);
                }, 500);
                return;
            } else {
                introMessage = `Hallo! Gerne helfe ich Ihnen bei Ihrer Anfrage zum Thema "${context.context}". Handelt es sich um ein gewerbliches oder privates Projekt?`;
                initialOptions = ["Gewerblich", "Privat"];
                nextStep = 'inquiry_type';
                setFormData({ serviceType: context.context });
            }
        } else if (startType === 'context' && context) {
            // Handle other context types
            if (context.type === 'use_case') {
                const useCase = context.useCase as UseCase;
                introMessage = `Hallo! Ich sehe, Sie interessieren sich für unsere Lösungen im Bereich "${useCase.title || 'unbekannt'}". Um Sie bestmöglich zu beraten, habe ich ein paar kurze, intelligente Fragen vorbereitet.`;
                setFormData({ serviceType: `Anfrage für ${useCase.title}` });
                nextStep = 'asking_ai_questions';

                setTimeout(() => {
                    addMessage('ai', typeof introMessage === 'string' ? introMessage : 'Hallo! Wie kann ich Ihnen helfen?');
                    handleGenerateUseCaseQuestions(useCase);
                }, 500);
                setMessages([]);
                setFormData({ serviceType: `Anfrage für ${useCase.title}` });
                setStep(nextStep as FunnelStep);
                return;
            }
            // Add more context handling as needed
        }

        setMessages([]);
        setStep(nextStep as any);
        setTimeout(() => {
            setIsLoading(false);
            const messageText = typeof introMessage === 'string' ? introMessage : (Array.isArray(introMessage) ? introMessage[0] : 'Hallo! Wie kann ich Ihnen helfen?');
            addMessage('ai', messageText, initialOptions);
        }, 500);
    };

    const handleGenerateUseCaseQuestions = async (useCase: UseCase) => {
        try {
            setIsLoading(true);
            const questionResult = await generateUseCaseQuestions(useCase);
            const questions = Array.isArray(questionResult) ? questionResult : [];
            if (questions.length > 0) {
                setAiQuestions(questions);
                setCurrentAiQuestionIndex(0);
                const firstQuestion = questions[0];
                if (firstQuestion && typeof firstQuestion === 'object' && 'questionText' in firstQuestion) {
                    addMessage('ai', (firstQuestion as any).questionText || 'Bitte stellen Sie Ihre Frage:', (firstQuestion as any).options);
                }
            }
        } catch (error) {
            console.error('Error generating use case questions:', error);
            addMessage('ai', 'Entschuldigung, bei der Vorbereitung Ihrer Fragen ist ein Fehler aufgetreten. Lassen Sie uns stattdessen den Standardweg gehen.');
            goToStep('inquiry_type');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfigConfirm = (value: number) => {
        if (!activeConfigurableService || !activeConfigurableService.configurableFields) return;

        const currentField = activeConfigurableService.configurableFields[currentConfigStep];
        if (!currentField) return;

        addMessage('user', `${currentField.label}: ${value} ${currentField.unit}`);
        setFormData(prev => ({ ...prev, [currentField.id]: value, message: `${prev.message || ''} ${currentField.label}: ${value} ${currentField.unit}\n` }));

        const nextStepIndex = currentConfigStep + 1;
        if (activeConfigurableService.configurableFields && nextStepIndex < activeConfigurableService.configurableFields.length) {
            setCurrentConfigStep(nextStepIndex);
            const nextField = activeConfigurableService.configurableFields[nextStepIndex];
            if (nextField) {
                addMessage('ai', `Vielen Dank. Als nächstes benötige ich diese Angabe:`);
                addMessage('ai', undefined, undefined, <ConfigSlider field={nextField} onConfirm={handleConfigConfirm} />);
            }
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

        // Handle different steps and user inputs
        switch (step) {
            case 'start':
                if (input.toLowerCase().includes('anfrage') || input.toLowerCase().includes('angebot')) {
                    goToStep('inquiry_type');
                } else if (input === (typeof translations[currentLang].roofAnalysisPrompt === 'string'
                        ? translations[currentLang].roofAnalysisPrompt
                        : Array.isArray(translations[currentLang].roofAnalysisPrompt) && translations[currentLang].roofAnalysisPrompt.length > 0
                            ? translations[currentLang].roofAnalysisPrompt[0]
                            : "Dach-Potenzial analysieren")) {
                    goToStep('get_address');
                } else {
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

            case 'asking_ai_questions':
                const currentQuestion = aiQuestions[currentAiQuestionIndex];
                if (!currentQuestion) break;

                const currentQuestionText = currentQuestion.questionText;
                const answerKey = `AI-Frage ${currentAiQuestionIndex + 1}: ${currentQuestionText}`;
                setFormData(prev => ({ ...prev, [answerKey]: input }));

                const nextIndex = currentAiQuestionIndex + 1;
                if (nextIndex < aiQuestions.length) {
                    setCurrentAiQuestionIndex(nextIndex);
                    const nextQuestion = aiQuestions[nextIndex];
                    if (nextQuestion) {
                        addMessage('ai', nextQuestion.questionText, nextQuestion.options);
                    }
                } else {
                    addMessage('ai', 'Vielen Dank für Ihre Antworten! Um Ihre Anfrage abzuschließen, benötige ich nun noch Ihre Kontaktdaten.');
                    setAiQuestions([]);
                    setCurrentAiQuestionIndex(0);
                    goToStep('get_name');
                }
                break;

            // Add more step handling as needed
            default:
                await processGeneralQuestion(input);
        }

        setIsLoading(false);
    };

    const t = translations[currentLang];
    const isFunnelStep = step !== 'start' && step !== 'general_chat' && !step.startsWith('confirm') && !step.includes('final') && step !== 'asking_ai_questions' && step !== 'configure_service';

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => { setIsOpen((prev: boolean) => !prev); if (!isOpen) onOpen(); }}
                className={`fixed bottom-6 right-6 z-[110] flex items-center gap-4 h-16 px-6 rounded-full bg-slate-800 text-white font-bold shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg hover:shadow-green-400/30 focus:outline-none focus:ring-4 focus:ring-green-400/50
                ${isOpen ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100'}
                ${isButtonVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                aria-label="KI-Berater fragen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span key={currentButtonPrompt} className="hidden sm:inline animate-text-overlay">{currentButtonPrompt}</span>
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-6 right-6 z-[110] w-full max-w-lg h-[80vh] max-h-[700px] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/80 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <header className="flex-shrink-0 p-4 bg-slate-50 flex justify-between items-center border-b border-slate-200">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">{t.assistantName}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`}></span>
                            {isSpeaking ? t.isSpeaking : t.online}
                        </p>
                    </div>

                    {/* Voice Controls */}
                    <AIChatVoiceControls
                        currentLang={currentLang}
                        setCurrentLang={setCurrentLang}
                        isLangMenuOpen={isLangMenuOpen}
                        setIsLangMenuOpen={setIsLangMenuOpen}
                        isMuted={isMuted}
                        setIsMuted={setIsMuted}
                        setIsOpen={setIsOpen}
                        langMenuRef={langMenuRef as React.RefObject<HTMLDivElement>}
                    />
                </header>

                {/* Messages */}
                <AIChatMessages
                    messages={messages}
                    isLoading={isLoading}
                    thinkingMessage={thinkingMessage}
                    t={t}
                    isFunnelStep={isFunnelStep}
                    messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
                    onUserInput={handleUserInput}
                />

                {/* Form */}
                {currentForm && <div className="p-4 border-t border-slate-200">{currentForm}</div>}

                {/* Input */}
                <AIChatInput
                    userInput={userInput}
                    setUserInput={setUserInput}
                    isLoading={isLoading}
                    step={step}
                    t={t}
                    contextualPrompts={contextualPrompts}
                    isCallMenuOpen={isCallMenuOpen}
                    setIsCallMenuOpen={setIsCallMenuOpen}
                    isVoiceInputSupported={isVoiceInputSupported}
                    isListening={isListening}
                    toggleListening={toggleListening}
                    onUserInput={handleUserInput}
                    textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
                    callMenuRef={callMenuRef as React.RefObject<HTMLDivElement>}
                />
            </div>
        </>
    );
};

export default React.memo(AIChatContainer);
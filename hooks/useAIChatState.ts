import { useState, useCallback } from 'react';
import { ContactFormData } from '../types';
import { Service } from '../data/services';
import { Product } from '../data/productTypes';
import { UseCase } from '../data/useCases';

export type FunnelStep = 'start' | 'inquiry_type' | 'service_type' | 'get_name' | 'get_email' | 'get_phone' | 'confirm_and_send' | 'final' | 'general_chat' | 'get_name_for_callback' | 'get_phone_for_callback' | 'confirm_and_send_callback' | 'callback_final' | 'asking_ai_questions' | 'configure_service' | 'get_address' | 'analyzing_roof' | 'confirm_roof';

export type Language = 'de-DE' | 'en-US';

export interface RoofAnalysisData {
    analysisPossible: boolean;
    usableAreaSqm: number;
    obstructions: string[];
    estimatedModuleCount: number;
}

export interface Message {
    sender: 'user' | 'ai' | 'system';
    text?: string;
    options?: string[];
    component?: React.ReactNode;
    id: number;
    videoId?: string;
    sources?: Array<{ uri: string; title: string }>;
}

interface UseAIChatStateReturn {
    // Basic state
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    messages: Message[];
    setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
    userInput: string;
    setUserInput: (input: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    thinkingMessage: string | null;
    setThinkingMessage: (message: string | null) => void;

    // Funnel state
    step: FunnelStep;
    setStep: (step: FunnelStep) => void;
    stepHistory: FunnelStep[];
    setStepHistory: (history: FunnelStep[] | ((prev: FunnelStep[]) => FunnelStep[])) => void;
    formData: Partial<ContactFormData>;
    setFormData: (data: Partial<ContactFormData> | ((prev: Partial<ContactFormData>) => Partial<ContactFormData>)) => void;
    currentForm: React.ReactNode | null;
    setCurrentForm: (form: React.ReactNode | null) => void;

    // AI Questions state
    aiQuestions: Array<{ questionText: string; options: string[] }>;
    setAiQuestions: (questions: Array<{ questionText: string; options: string[] }>) => void;
    currentAiQuestionIndex: number;
    setCurrentAiQuestionIndex: (index: number) => void;

    // Service configuration state
    activeConfigurableService: Service | null;
    setActiveConfigurableService: (service: Service | null) => void;
    currentConfigStep: number;
    setCurrentConfigStep: (step: number) => void;

    // Context state
    initialAIContext: string | null;
    setInitialAIContext: (context: string | null) => void;
    roofAnalysisData: RoofAnalysisData | null;
    setRoofAnalysisData: (data: RoofAnalysisData | null) => void;

    // Language and UI state
    currentLang: Language;
    setCurrentLang: (lang: Language) => void;
    isLangMenuOpen: boolean;
    setIsLangMenuOpen: (open: boolean) => void;
    isCallMenuOpen: boolean;
    setIsCallMenuOpen: (open: boolean) => void;
    contextualPrompts: string[];
    setContextualPrompts: (prompts: string[]) => void;

    // Error state
    aiInitError: string | null;
    setAiInitError: (error: string | null) => void;

    // Utility functions
    addMessage: (sender: 'user' | 'ai' | 'system', text?: string, options?: string[], component?: React.ReactNode, videoId?: string, sources?: Array<{ uri: string; title: string }>) => void;
    goToStep: (nextStep: FunnelStep) => void;
    resetFormData: () => void;
}

export const useAIChatState = (): UseAIChatStateReturn => {
    // Basic state
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [thinkingMessage, setThinkingMessage] = useState<string | null>(null);

    // Funnel state
    const [step, setStep] = useState<FunnelStep>('start');
    const [stepHistory, setStepHistory] = useState<FunnelStep[]>(['start']);
    const [formData, setFormData] = useState<Partial<ContactFormData>>({});
    const [currentForm, setCurrentForm] = useState<React.ReactNode | null>(null);

    // AI Questions state
    const [aiQuestions, setAiQuestions] = useState<{ questionText: string; options: string[] }[]>([]);
    const [currentAiQuestionIndex, setCurrentAiQuestionIndex] = useState(0);

    // Service configuration state
    const [activeConfigurableService, setActiveConfigurableService] = useState<Service | null>(null);
    const [currentConfigStep, setCurrentConfigStep] = useState(0);

    // Context state
    const [initialAIContext, setInitialAIContext] = useState<string | null>(null);
    const [roofAnalysisData, setRoofAnalysisData] = useState<RoofAnalysisData | null>(null);

    // Language and UI state
    const [currentLang, setCurrentLang] = useState<Language>('de-DE');
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isCallMenuOpen, setIsCallMenuOpen] = useState(false);
    const [contextualPrompts, setContextualPrompts] = useState<string[]>([]);

    // Error state
    const [aiInitError, setAiInitError] = useState<string | null>(null);

    // Utility functions
    const addMessage = useCallback((
        sender: 'user' | 'ai' | 'system',
        text?: string,
        options?: string[],
        component?: React.ReactNode,
        videoId?: string,
        sources?: Array<{ uri: string; title: string }>
    ) => {
        const newMsg = {
            sender,
            text,
            options,
            component,
            id: Date.now() + Math.random(),
            videoId,
            sources
        };
        setMessages(prev => [...prev, newMsg]);
    }, []);

    const goToStep = useCallback((nextStep: FunnelStep) => {
        setStep(nextStep);
        setStepHistory(prev => [...prev, nextStep]);
    }, []);

    const resetFormData = useCallback(() => {
        setFormData({});
        setStepHistory(['start']);
        setAiQuestions([]);
        setCurrentAiQuestionIndex(0);
        setActiveConfigurableService(null);
        setCurrentConfigStep(0);
        setRoofAnalysisData(null);
        setInitialAIContext(null);
    }, []);

    return {
        // Basic state
        isOpen,
        setIsOpen,
        messages,
        setMessages,
        userInput,
        setUserInput,
        isLoading,
        setIsLoading,
        thinkingMessage,
        setThinkingMessage,

        // Funnel state
        step,
        setStep,
        stepHistory,
        setStepHistory,
        formData,
        setFormData,
        currentForm,
        setCurrentForm,

        // AI Questions state
        aiQuestions,
        setAiQuestions,
        currentAiQuestionIndex,
        setCurrentAiQuestionIndex,

        // Service configuration state
        activeConfigurableService,
        setActiveConfigurableService,
        currentConfigStep,
        setCurrentConfigStep,

        // Context state
        initialAIContext,
        setInitialAIContext,
        roofAnalysisData,
        setRoofAnalysisData,

        // Language and UI state
        currentLang,
        setCurrentLang,
        isLangMenuOpen,
        setIsLangMenuOpen,
        isCallMenuOpen,
        setIsCallMenuOpen,
        contextualPrompts,
        setContextualPrompts,

        // Error state
        aiInitError,
        setAiInitError,

        // Utility functions
        addMessage,
        goToStep,
        resetFormData,
    };
};
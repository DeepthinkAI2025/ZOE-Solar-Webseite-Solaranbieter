import { useEffect, useCallback } from 'react';
import { ContactFormData } from '../types';
import { Product } from '../data/productTypes';
import { Message, Language, FunnelStep } from './useAIChatState';

interface UseAIChatPersistenceOptions {
    isOpen: boolean;
    messages: Message[];
    step: FunnelStep;
    formData: Partial<ContactFormData>;
    stepHistory: FunnelStep[];
    currentLang: Language;
    onOpen: () => void;
    comparisonContextRef: React.MutableRefObject<Product[] | null>;
    onResetConversation: (type: 'initial' | 'context', context?: any) => void;
    onSetMessages: (messages: Message[]) => void;
    onSetStep: (step: FunnelStep) => void;
    onSetFormData: (data: Partial<ContactFormData>) => void;
    onSetStepHistory: (history: FunnelStep[]) => void;
    onSetCurrentLang: (lang: Language) => void;
    onSetIsLoading: (loading: boolean) => void;
}

interface ChatState {
    savedMessages: Message[];
    savedStep: FunnelStep;
    savedFormData: Partial<ContactFormData>;
    savedStepHistory: FunnelStep[];
    savedLang: Language;
}

export const useAIChatPersistence = (options: UseAIChatPersistenceOptions) => {
    const {
        isOpen,
        messages,
        step,
        formData,
        stepHistory,
        currentLang,
        onOpen,
        comparisonContextRef,
        onResetConversation,
        onSetMessages,
        onSetStep,
        onSetFormData,
        onSetStepHistory,
        onSetCurrentLang,
        onSetIsLoading,
    } = options;

    // Save chat state to sessionStorage
    const saveChatState = useCallback(() => {
        if (isOpen && !step.startsWith('confirm') && !comparisonContextRef.current) {
            const stateToSave: ChatState = {
                savedMessages: messages,
                savedStep: step,
                savedFormData: formData,
                savedStepHistory: stepHistory,
                savedLang: currentLang,
            };
            sessionStorage.setItem('aiChatState', JSON.stringify(stateToSave));
        }
    }, [isOpen, step, messages, formData, stepHistory, currentLang, comparisonContextRef]);

    // Load chat state from sessionStorage
    const loadChatState = useCallback(() => {
        const savedState = sessionStorage.getItem('aiChatState');
        if (savedState) {
            try {
                const { savedMessages, savedStep, savedFormData, savedStepHistory, savedLang }: ChatState = JSON.parse(savedState);
                onSetMessages(savedMessages);
                onSetStep(savedStep);
                onSetFormData(savedFormData);
                onSetStepHistory(savedStepHistory || ['start']);
                onSetCurrentLang(savedLang || 'de-DE');
            } catch (error) {
                console.error('Failed to load chat state:', error);
                onResetConversation('initial');
            }
        } else {
            onResetConversation('initial');
        }
    }, [onResetConversation, onSetMessages, onSetStep, onSetFormData, onSetStepHistory, onSetCurrentLang]);

    // Clear chat state
    const clearChatState = useCallback(() => {
        sessionStorage.removeItem('aiChatState');
    }, []);

    // Handle chat opening
    useEffect(() => {
        if (isOpen) {
            if (comparisonContextRef.current) {
                const products = comparisonContextRef.current;
                comparisonContextRef.current = null;
                onSetMessages([]);
                onSetIsLoading(true);
                onSetStep('general_chat');
                onSetStepHistory(['start', 'general_chat']);
                onSetFormData({});
            } else {
                loadChatState();
            }
        }
    }, [isOpen, comparisonContextRef, loadChatState, onSetMessages, onSetIsLoading, onSetStep, onSetStepHistory, onSetFormData]);

    // Auto-save chat state
    useEffect(() => {
        saveChatState();
    }, [saveChatState]);

    // Setup event listeners for external chat triggers
    useEffect(() => {
        const handleOpenChat = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (!isOpen) {
                onOpen();
            }
            if (customEvent.detail && customEvent.detail.context) {
                onResetConversation('context', customEvent.detail);
            }
        };

        const handleStartNewChatPromo = () => {
            if (!isOpen) {
                onOpen();
            }
            onResetConversation('promo');
        };

        const handleStartChatWithContext = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (!isOpen) {
                onOpen();
            }
            onResetConversation('context', customEvent.detail);
        };

        const handleStartComparisonChat = (event: Event) => {
            const customEvent = event as CustomEvent<Product[]>;
            comparisonContextRef.current = customEvent.detail;
            clearChatState();
            if (!isOpen) {
                onOpen();
            }
        };

        const handleStartChatWithService = (event: Event) => {
            const customEvent = event as CustomEvent<any>;
            if (!isOpen) {
                onOpen();
            }
            onResetConversation('service_context', customEvent.detail);
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
    }, [isOpen, onOpen, onResetConversation, comparisonContextRef, clearChatState]);

    return {
        saveChatState,
        loadChatState,
        clearChatState,
    };
};
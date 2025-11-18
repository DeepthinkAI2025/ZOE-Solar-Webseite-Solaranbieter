import { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from './useAIChatState';

interface UseAIVoiceInputReturn {
    isListening: boolean;
    isVoiceInputSupported: boolean;
    isMuted: boolean;
    isSpeaking: boolean;
    setIsMuted: (muted: boolean) => void;
    toggleListening: () => void;
    cancelSpeech: () => void;
    speak: (text: string) => void;
    recognitionRef: React.MutableRefObject<any | null>;
}

export const useAIVoiceInput = (
    currentLang: Language,
    setUserInput: (input: string) => void,
    onTranscriptComplete?: (transcript: string) => void
): UseAIVoiceInputReturn => {
    const [isListening, setIsListening] = useState(false);
    const [isVoiceInputSupported, setIsVoiceInputSupported] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const recognitionRef = useRef<any | null>(null);
    const utteranceQueue = useRef<string[]>([]);
    const isSpeakingRef = useRef(false);

    // Speech synthesis functionality
    const cancelSpeech = useCallback(() => {
        if (window.speechSynthesis?.speaking) {
            window.speechSynthesis.cancel();
        }
        utteranceQueue.current = [];
        setIsSpeaking(false);
        isSpeakingRef.current = false;
    }, []);

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
            const germanVoice = voices.find(voice =>
                voice.lang === 'de-DE' && voice.name.includes('Google')
            ) || voices.find(voice => voice.lang === 'de-DE');
            const englishVoice = voices.find(voice =>
                voice.lang === 'en-US' && voice.name.includes('Google')
            ) || voices.find(voice => voice.lang === 'en-US');

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

    // Speech recognition functionality
    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            cancelSpeech();
            recognitionRef.current.start();
        }
    }, [isListening, cancelSpeech]);

    // Initialize speech recognition and synthesis
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
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

                if (finalTranscript) {
                    setUserInput(prev => prev + finalTranscript);
                    if (onTranscriptComplete) {
                        onTranscriptComplete(finalTranscript);
                    }
                }
            };

            recognitionRef.current = recognition;
        }

        const onVoicesChanged = () => {};
        window.speechSynthesis?.addEventListener('voiceschanged', onVoicesChanged);

        return () => {
            window.speechSynthesis?.removeEventListener('voiceschanged', onVoicesChanged);
            cancelSpeech();
        };
    }, [currentLang, setUserInput, onTranscriptComplete, cancelSpeech]);

    // Update recognition language when language changes
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = currentLang;
        }
    }, [currentLang]);

    return {
        isListening,
        isVoiceInputSupported,
        isMuted,
        isSpeaking,
        setIsMuted,
        toggleListening,
        cancelSpeech,
        speak,
        recognitionRef,
    };
};
import React, { useRef, useEffect } from 'react';
import { Language } from '../../hooks/useAIChatState';

interface AIChatVoiceControlsProps {
    currentLang: Language;
    setCurrentLang: (lang: Language) => void;
    isLangMenuOpen: boolean;
    setIsLangMenuOpen: (open: boolean) => void;
    isMuted: boolean;
    setIsMuted: (muted: boolean) => void;
    setIsOpen: (open: boolean) => void;
    langMenuRef: React.RefObject<HTMLDivElement>;
}

const AIChatVoiceControls: React.FC<AIChatVoiceControlsProps> = ({
    currentLang,
    setCurrentLang,
    isLangMenuOpen,
    setIsLangMenuOpen,
    isMuted,
    setIsMuted,
    setIsOpen,
    langMenuRef,
}) => {
    // Handle clicks outside language menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };

        if (isLangMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLangMenuOpen, langMenuRef, setIsLangMenuOpen]);

    const selectLang = (lang: Language) => {
        setCurrentLang(lang);
        setIsLangMenuOpen(false);
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-1">
            {/* Language Selector */}
            <div className="relative" ref={langMenuRef}>
                <button
                    onClick={() => setIsLangMenuOpen(p => !p)}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    aria-label="Sprache wechseln"
                >
                    <span className="text-xl">{currentLang === 'de-DE' ? '🇩🇪' : '🇬🇧'}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {isLangMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-200 animate-fade-in z-20">
                        <button
                            onClick={() => selectLang('de-DE')}
                            className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-slate-100 transition-colors"
                        >
                            🇩🇪 Deutsch
                        </button>
                        <button
                            onClick={() => selectLang('en-US')}
                            className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-slate-100 transition-colors"
                        >
                            🇬🇧 English
                        </button>
                    </div>
                )}
            </div>

            {/* Mute/Unmute Button */}
            <button
                onClick={toggleMute}
                className={`p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors ${
                    !isMuted ? '' : 'bg-red-100 text-red-600'
                }`}
                aria-label={isMuted ? "Stummschaltung aufheben" : "Stummschalten"}
            >
                {isMuted ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            clipRule="evenodd"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 14l4-4m0 0l-4-4m4 4H7"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                    </svg>
                )}
            </button>

            {/* Close Button */}
            <button
                onClick={closeChat}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors"
                aria-label="Chat schließen"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
};

export default React.memo(AIChatVoiceControls);
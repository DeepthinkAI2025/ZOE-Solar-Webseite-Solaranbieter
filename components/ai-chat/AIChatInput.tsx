import React, { useRef } from 'react';

interface AIChatInputProps {
    userInput: string;
    setUserInput: (input: string) => void;
    isLoading: boolean;
    step: string;
    t: Record<string, string | string[]>;
    contextualPrompts: string[];
    isCallMenuOpen: boolean;
    setIsCallMenuOpen: (open: boolean) => void;
    isVoiceInputSupported: boolean;
    isListening: boolean;
    toggleListening: () => void;
    onUserInput: (input: string) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    callMenuRef: React.RefObject<HTMLDivElement>;
}

const AIChatInput: React.FC<AIChatInputProps> = ({
    userInput,
    setUserInput,
    isLoading,
    step,
    t,
    contextualPrompts,
    isCallMenuOpen,
    setIsCallMenuOpen,
    isVoiceInputSupported,
    isListening,
    toggleListening,
    onUserInput,
    textareaRef,
    callMenuRef,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUserInput(userInput);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onUserInput(userInput);
        }
    };

    const isInputDisabled = isLoading || step.startsWith('confirm') || step === 'configure_service';

    return (
        <footer className="flex-shrink-0 p-3 bg-slate-50 border-t border-slate-200 form-on-light">
            {/* Contextual Prompts */}
            {contextualPrompts.length > 0 && (
                <div className="flex gap-2 mb-2 overflow-x-auto pb-2 hide-scrollbar">
                    {contextualPrompts.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => onUserInput(prompt)}
                            className="flex-shrink-0 px-3 py-1.5 bg-slate-200 text-slate-700 text-sm font-semibold rounded-full hover:bg-green-100 hover:text-green-800 transition-colors"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            <div className="relative">
                {/* Call Menu */}
                {isCallMenuOpen && (
                    <div
                        ref={callMenuRef}
                        className="absolute bottom-full mb-3 w-full bg-white rounded-xl shadow-2xl border border-slate-200 p-2 space-y-2 animate-fade-in"
                    >
                        <a
                            href="tel:+493012345678"
                            className="w-full text-left flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group"
                        >
                            <span className="text-green-600">☀️</span>
                            <div>
                                <h4 className="font-bold text-slate-800">{t.callCustomerService}</h4>
                                <p className="text-sm text-slate-500">+49 30 123 456 78</p>
                            </div>
                        </a>
                        <button
                            onClick={toggleListening}
                            className="w-full text-left flex items-center gap-4 p-4 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group"
                        >
                            <span className="text-green-600">🤖</span>
                            <div>
                                <h4 className="font-bold text-slate-800">{t.speakWithAI}</h4>
                                <p className="text-sm text-slate-500">Spracheingabe starten</p>
                            </div>
                        </button>
                    </div>
                )}

                {/* Input Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex items-end gap-2 bg-white p-2 rounded-xl border border-slate-300 focus-within:ring-2 focus-within:ring-green-500 transition-shadow"
                >
                    {/* Call Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsCallMenuOpen(p => !p)}
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100 text-slate-500"
                        aria-label="Anruf-Optionen"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                    </button>

                    {/* Voice Input Button */}
                    {isVoiceInputSupported && (
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                isListening ? 'bg-red-500 text-white' : 'hover:bg-slate-100 text-slate-500'
                            }`}
                            aria-label={isListening ? "Spracheingabe stoppen" : "Spracheingabe starten"}
                        >
                            {isListening ? (
                                <div className="w-4 h-4 bg-white rounded-md animate-pulse"></div>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Text Input */}
                    <textarea
                        ref={textareaRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            step.startsWith('confirm') || step === 'configure_service'
                                ? t.inputDisabledPlaceholder
                                : t.inputPlaceholder
                        }
                        className="w-full bg-transparent focus:outline-none resize-none text-slate-800"
                        rows={1}
                        disabled={isInputDisabled}
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors disabled:bg-slate-400"
                        disabled={isInputDisabled || !userInput.trim()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </footer>
    );
};

export default React.memo(AIChatInput);
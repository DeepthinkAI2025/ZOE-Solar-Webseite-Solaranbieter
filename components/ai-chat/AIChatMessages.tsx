import React from 'react';
import { Message } from '../../hooks/useAIChatState';
import YouTubeEmbed from '../YouTubeEmbed';
import DOMPurify from 'dompurify';

interface AIChatMessagesProps {
    messages: Message[];
    isLoading: boolean;
    thinkingMessage: string | null;
    t: Record<string, string | string[]>;
    isFunnelStep: boolean;
    messagesEndRef: React.RefObject<HTMLDivElement>;
    onUserInput: (input: string) => void;
}

const AIChatMessages: React.FC<AIChatMessagesProps> = ({
    messages,
    isLoading,
    thinkingMessage,
    t,
    isFunnelStep,
    messagesEndRef,
    onUserInput,
}) => {
    const handleBackClick = () => {
        onUserInput('Zurück');
    };

    const handleSkipClick = () => {
        onUserInput('Fragen überspringen');
    };

    return (
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                        <div className={`prose-custom prose-sm max-w-[85%] p-3 rounded-2xl ${
                            msg.sender === 'user'
                                ? 'bg-green-600 text-white rounded-br-none'
                                : msg.sender === 'system'
                                ? 'w-full text-center text-slate-500 text-sm'
                                : 'bg-slate-100 text-slate-800 rounded-bl-none'
                        }`}>
                            {/* Video Embed */}
                            {msg.videoId && <YouTubeEmbed videoId={msg.videoId} />}

                            {/* Message Text */}
                            {msg.text && (
                                <div
                                    className="whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            msg.text
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/\* (.*?)(?=\n\* |$)/g, '<li>$1</li>')
                                                .replace(/(\r\n|\n|\r)/gm, "<br>")
                                                .replace(/<li>/g, '<li style="margin-left: 1.5em; list-style-type: disc;">')
                                        )
                                    }}
                                />
                            )}

                            {/* Custom Component */}
                            {msg.component}

                            {/* Options */}
                            {msg.options && (
                                <div className="mt-3 flex flex-col items-start gap-2">
                                    {msg.options.map((option, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onUserInput(option)}
                                            className="px-4 py-2.5 bg-white border border-slate-300 text-slate-800 rounded-xl font-semibold hover:bg-green-50 hover:border-green-400 transition-all duration-200 self-stretch text-left shadow-sm"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Sources */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-500 mb-2">Quellen:</h4>
                                    <ul className="space-y-1 text-xs">
                                        {msg.sources.map((source, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-slate-400">{i + 1}.</span>
                                                <a
                                                    href={source.uri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-green-700 hover:underline truncate block"
                                                    title={source.title}
                                                >
                                                    {source.title || new URL(source.uri).hostname}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Buttons for Funnel Steps */}
                    {msg.sender === 'ai' && isFunnelStep && index === messages.length - 1 && (
                        <div className="mt-2 flex items-center gap-2">
                            <button
                                onClick={handleBackClick}
                                className="text-xs text-slate-500 hover:text-slate-800 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Zurück
                            </button>
                            <button
                                onClick={handleSkipClick}
                                className="text-xs text-slate-500 hover:text-slate-800 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
                            >
                                Fragen überspringen
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="max-w-[85%] p-3 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-none flex items-center gap-4">
                        <div className="w-8 h-8 flex-shrink-0">
                            <div className="w-full h-full border-2 border-t-transparent border-green-500 rounded-full animate-spin"></div>
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-slate-800">{thinkingMessage === t.analyzingRoof ? t.analyzingRoof : t.thinking}</p>
                            {thinkingMessage && thinkingMessage !== t.analyzingRoof && (
                                <p key={thinkingMessage} className="text-sm text-slate-500 animate-fade-in">
                                    {thinkingMessage}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default React.memo(AIChatMessages);
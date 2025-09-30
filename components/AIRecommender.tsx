import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { pricingPackages, PricingPackage } from '../data/pricingPackages.ts';

type RecommenderState = 'idle' | 'thinking' | 'asking' | 'recommending' | 'error';

interface Question {
    questionText: string;
    options: string[];
}

const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY ?? import.meta.env.VITE_API_KEY ?? '') as string;

const AIRecommender: React.FC = () => {
    const [state, setState] = useState<RecommenderState>('idle');
    const [conversationHistory, setConversationHistory] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [recommendations, setRecommendations] = useState<PricingPackage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const ai = useRef<GoogleGenAI | null>(null);

    useEffect(() => {
        const apiKey = GEMINI_API_KEY?.trim();
        if (!apiKey) {
            console.warn('[AIRecommender] Kein Gemini API-Key konfiguriert. KI-Empfehlungen werden deaktiviert.');
            return;
        }

        ai.current = new GoogleGenAI({ apiKey });
    }, []);

    const startRecommendation = async () => {
        setState('thinking');
        setError(null);
        setConversationHistory([]);
        setRecommendations([]);
        await getNextQuestion();
    };

    const getNextQuestion = async (userAnswer?: string) => {
        if (!ai.current) {
            setError('Der KI-Empfehlungsservice ist derzeit nicht verfügbar. Bitte nutzen Sie unser Kontaktformular oder wenden Sie sich direkt an unser Vertriebsteam.');
            setState('error');
            return;
        }

        setState('thinking');
        
        let newHistory = [...conversationHistory];
        if(userAnswer) {
            newHistory.push(`Antwort: ${userAnswer}`);
        }

        const prompt = `Du bist "ZOE", ein freundlicher und kompetenter KI-Produktberater für ZOE Solar. Deine Aufgabe ist es, Kunden durch 2-3 gezielte Fragen zu führen, um ihnen das am besten passende Solarpaket aus unserer Liste zu empfehlen.

            Verfügbare Solarpakete:
            ${JSON.stringify(pricingPackages.map(p => ({id: p.id, name: p.name, target: p.target, userType: p.userType})))}
            
            Bisheriges Gespräch:
            ${newHistory.join('\n')}

            Deine Aufgabe:
            1.  Wenn das Gespräch gerade erst beginnt (weniger als 1 Frage gestellt), stelle die wichtigste erste Frage, um zwischen Privat- und Gewerbekunden zu unterscheiden.
            2.  Basierend auf der letzten Antwort, stelle die nächste logische Frage, um die Auswahl weiter einzugrenzen (z.B. nach Verbrauchsart, Zielen, Dachgröße).
            3.  Wenn du nach 2-3 Fragen genug Informationen hast, antworte NUR mit einem JSON-Objekt, das die IDs der 1-3 am besten passenden Pakete enthält. Format: {"recommendationIds": ["id1", "id2"]}
            4.  Ansonsten, antworte NUR mit einem JSON-Objekt, das die nächste Frage und 3-4 Multiple-Choice-Antworten enthält.
            
            Halte die Fragen kurz und die Antworten einfach. Du bist in einem Chat-Interface.`;

        const schema = {
             type: Type.OBJECT,
             properties: {
                questionText: { type: Type.STRING, description: 'Die nächste Frage an den Kunden.' },
                options: { type: Type.ARRAY, description: '3-4 Multiple-Choice-Antworten.', items: { type: Type.STRING }},
                recommendationIds: { type: Type.ARRAY, description: 'Eine Liste von 1-3 Paket-IDs als finale Empfehlung.', items: { type: Type.STRING }}
             }
        };

        try {
            const response: GenerateContentResponse = await ai.current.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema }
            });
            
            const result = JSON.parse(response.text);

            if (result.recommendationIds && result.recommendationIds.length > 0) {
                const recommendedPkgs = pricingPackages.filter(p => result.recommendationIds.includes(p.id));
                setRecommendations(recommendedPkgs);
                setState('recommending');
            } else if (result.questionText && result.options) {
                setCurrentQuestion({ questionText: result.questionText, options: result.options });
                setConversationHistory(prev => [...prev, `Frage: ${result.questionText}`]);
                setState('asking');
            } else {
                throw new Error("Unerwartete API-Antwort.");
            }
        } catch (err) {
            console.error("Fehler im AIRecommender:", err);
            setError("Entschuldigung, bei der Analyse ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
            setState('error');
        }
    };
    
    const handleAnswer = (answer: string) => {
        getNextQuestion(answer);
    };

    const handlePackageSelect = (pkg: PricingPackage) => {
        const detail = {
            type: 'package_quote',
            packageData: {
                name: pkg.name,
                userType: pkg.userType,
                price: pkg.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
                details: `${pkg.specs.modulesKwp} kWp Module, ${pkg.specs.storageKwh ?? 0} kWh Speicher`
            }
        };
        document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail }));
    };

    return (
        <section className="bg-white text-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 my-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50/50 to-white">
            <div className="max-w-4xl mx-auto text-center">
                {state === 'idle' && (
                    <div className="animate-ai-fade-in">
                        <h2 className="text-3xl font-bold text-slate-800">Unsicher, welches Paket das Richtige ist?</h2>
                        <p className="text-slate-600 my-4 text-lg">Lassen Sie sich von unserem KI-Berater in 60 Sekunden die passende Lösung empfehlen. Unverbindlich und intelligent.</p>
                        <button onClick={startRecommendation} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow transform hover:-translate-y-1">
                            Beratung starten
                        </button>
                    </div>
                )}
                
                {state === 'thinking' && (
                    <div className="animate-thinking-wrapper-light min-h-[200px] flex flex-col items-center justify-center">
                        <div className="loader-light"></div>
                        <p className="mt-4 text-lg font-semibold text-slate-700 thinking-text-light">Analysiere Ihre Bedürfnisse...</p>
                    </div>
                )}

                {state === 'asking' && currentQuestion && (
                    <div className="animate-ai-fade-in">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">{currentQuestion.questionText}</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {currentQuestion.options.map(option => (
                                <button key={option} onClick={() => handleAnswer(option)} className="p-4 bg-white border-2 border-slate-200 rounded-lg font-semibold text-slate-700 hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all duration-200 transform hover:-translate-y-1">
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {state === 'recommending' && (
                    <div className="animate-ai-fade-in">
                        <h2 className="text-3xl font-bold text-slate-800">Basierend auf Ihren Angaben empfehlen wir:</h2>
                        <p className="text-slate-600 my-4">Hier sind die Top-Pakete, die zu Ihren Zielen passen.</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left mt-8">
                            {recommendations.map((pkg, index) => (
                                <div key={pkg.id} className="recommendation-card-light bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-lg" style={{animationDelay: `${index * 0.15}s`}}>
                                    <h3 className="text-xl font-bold text-slate-800">{pkg.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4 flex-grow">{pkg.target}</p>
                                    <div className="text-3xl font-bold text-green-600 my-4">{pkg.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}</div>
                                    <button onClick={() => handlePackageSelect(pkg)} className="w-full mt-auto bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                        Paket anfragen
                                    </button>
                                </div>
                            ))}
                        </div>
                         <button onClick={startRecommendation} className="mt-8 text-sm text-slate-500 hover:text-slate-800 hover:underline">
                            Neu starten
                        </button>
                    </div>
                )}
                
                {state === 'error' && (
                     <div className="animate-ai-fade-in min-h-[200px] flex flex-col items-center justify-center">
                        <p className="text-lg font-semibold text-red-600 mb-4">{error}</p>
                        <button onClick={startRecommendation} className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors">
                            Erneut versuchen
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

export default AIRecommender;

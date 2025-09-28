import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

type VideoGenerationState = 'idle' | 'generating' | 'success' | 'error';

const loadingMessages = [
    "Initialisiere Video-Engine...",
    "Analysiere Marktdaten für die besten Visuals...",
    "Erstelle beeindruckende Luftaufnahmen...",
    "Komponiere einen motivierenden Soundtrack...",
    "Schneide die Szenen für maximale Wirkung...",
    "Rendere das finale Meisterwerk...",
    "Fast fertig, der letzte Schliff wird angelegt...",
];

const PromoVideo: React.FC = () => {
    const [generationState, setGenerationState] = useState<VideoGenerationState>('idle');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        if (generationState === 'generating') {
            let messageIndex = 0;
            const intervalId = setInterval(() => {
                messageIndex = (messageIndex + 1) % loadingMessages.length;
                setCurrentLoadingMessage(loadingMessages[messageIndex]);
            }, 4000);
            return () => clearInterval(intervalId);
        }
    }, [generationState]);

    const generateVideo = async () => {
        setGenerationState('generating');
        setError(null);
        setVideoUrl(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const prompt = `Erstelle ein kurzes, dynamisches Werbevideo (ca. 45-60 Sekunden) für ZOE Solar, einen Installateur für gewerbliche Photovoltaikanlagen.
            - **Stil:** Hochprofessionell, modern, inspirierend, mit schnellen Schnitten und dynamischen Kamerafahrten (Drohnenaufnahmen).
            - **Musik:** Upbeat, motivierender Corporate-Soundtrack.
            - **Szenen:**
                1. Anfang: Eine schnelle Drohnenaufnahme, die über ein großes Firmendach oder ein Feld fliegt und eine glänzende, neue Solaranlage enthüllt. Text-Overlay: "Steigende Energiekosten?"
                2. Mitte: Schnitte, die animierte Graphen mit sinkenden Kosten zeigen, glückliche, zuversichtliche Unternehmer und saubere, grüne Landschaften. Text-Overlays: "Kosten senken. Nachhaltig wirtschaften. Energieunabhängigkeit erreichen."
                3. Ende: Das ZOE Solar Logo erscheint prominent. Dann eine letzte, epische Aufnahme der Solaranlage im Sonnenuntergang. Call-to-Action Text-Overlay: "ZOE Solar. Starten Sie jetzt Ihre kostenlose Analyse."
            - **Qualität:** Hochauflösend, 16:9-Format.`;

            let operation = await ai.models.generateVideos({
                model: 'veo-2.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                }
            });

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

            if (!downloadLink) {
                throw new Error("Videogenerierung erfolgreich, aber kein Download-Link erhalten.");
            }

            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!response.ok) {
                throw new Error(`Fehler beim Herunterladen des Videos: ${response.statusText}`);
            }

            const videoBlob = await response.blob();
            const url = URL.createObjectURL(videoBlob);
            setVideoUrl(url);
            setGenerationState('success');

        } catch (err) {
            console.error("Fehler bei der Videogenerierung:", err);
            const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
            const userFriendlyError = (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED'))
                ? "Unsere Video-Server sind im Moment stark ausgelastet. Bitte versuchen Sie es in ein paar Augenblicken erneut."
                : "Bei der Erstellung des Videos ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.";
            setError(userFriendlyError);
            setGenerationState('error');
        }
    };
    
    return (
        <div className="aspect-video bg-slate-900 flex items-center justify-center p-4">
            {generationState === 'idle' && (
                <div className="text-center">
                    <button onClick={generateVideo} className="bg-green-500 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                        KI-Video generieren
                    </button>
                    <p className="text-slate-400 mt-4 text-sm">Die Erstellung kann einige Minuten dauern.</p>
                </div>
            )}
            {generationState === 'generating' && (
                <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-t-transparent border-green-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-semibold">Video wird generiert...</p>
                    <p className="text-slate-300 mt-2">{currentLoadingMessage}</p>
                </div>
            )}
            {generationState === 'error' && (
                 <div className="text-center text-white p-8">
                    <h3 className="text-2xl font-bold text-red-500 mb-4">Fehler bei der Generierung</h3>
                    <p className="text-slate-300 mb-6">{error || 'Es ist ein unerwarteter Fehler aufgetreten.'}</p>
                    <button onClick={generateVideo} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors duration-300">
                        Erneut versuchen
                    </button>
                </div>
            )}
            {generationState === 'success' && videoUrl && (
                <video src={videoUrl} controls autoPlay muted loop className="w-full h-full object-contain rounded-md" />
            )}
        </div>
    );
};

export default PromoVideo;
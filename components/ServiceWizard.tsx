import React, { useState } from 'react';
import { getOpenRouterClient, AIResponse } from '../services/core/OpenRouterClient';
import { services, Service, ServiceCategory } from '../data/services';

// --- ICONS ---
const SolarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const EmobilityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const RoofIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PlanningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM10.5 12h3.75" /></svg>;
const LoadingSpinner = () => <div className="loader h-6 w-6 border-t-2 border-white"></div>;

const openRouterClient = getOpenRouterClient();


const categories: { id: string, title: ServiceCategory, icon: React.ReactNode }[] = [
  { id: 'solar', title: 'Solaranlagen & Speicher', icon: <SolarIcon /> },
  { id: 'emobility', title: 'E-Mobilität & Ladeparks', icon: <EmobilityIcon /> },
  { id: 'building', title: 'Dach- & Gebäudeservice', icon: <RoofIcon /> },
  { id: 'planning', title: 'Planung & Beratung', icon: <PlanningIcon /> },
];

const InspirationCard: React.FC<{ title: string; icon: React.ReactNode; onClick: () => void }> = ({ title, icon, onClick }) => (
    <div onClick={onClick} className="group bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center gap-4 cursor-pointer hover:bg-white hover:shadow-xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">{icon}</div>
        <span className="font-bold text-slate-700 text-lg">{title}</span>
    </div>
);

const SubServiceCard: React.FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
    <div onClick={onClick} className="group bg-slate-50 border border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:bg-green-50 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1 h-full flex items-center justify-center">
        <span className="font-bold text-slate-700 group-hover:text-green-700 transition-colors">{title}</span>
    </div>
);


const ServiceWizard: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<ServiceCategory | null>(null);

    const startChatWithService = (service: Service) => {
        document.dispatchEvent(new CustomEvent('start-chat-with-service', { detail: service }));
    };

    const handleAnalysis = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError(null);
        
        try {
            const serviceKnowledge = services.map(s => ({ id: s.id, title: s.title, context: s.context }));

            const systemPrompt = `Du bist ein intelligenter Service-Zuordnungsassistent für ZOE Solar. Analysiere die Service-Anfrage eines Kunden und finde den am besten passenden Service aus der bereitgestellten Liste.

Service-Liste:
${JSON.stringify(serviceKnowledge)}

Deine Aufgabe:
1. Analysiere die Kundenanfrage
2. Finde den am besten passenden Service aus der Liste
3. Antworte NUR mit einem JSON-Objekt im Format: {"serviceId": "service_id"}

Wenn nichts klar passt, verwende 'plan-sonstiges'.`;

            const response: AIResponse = await openRouterClient.generateContent({
                prompt: `Kundenanfrage: "${query}"`,
                systemPrompt,
                temperature: 0.1,
                maxTokens: 200,
                context: `Service Liste: ${serviceKnowledge.map(s => s.id).join(', ')}`
            });

            if (!response.success || !response.content) {
                throw new Error(response.error || 'Unbekannter Fehler');
            }
            
            const result = JSON.parse(response.content);
            const matchedService = services.find(s => s.id === result.serviceId);

             if (matchedService) {
                // To provide better context for the chat, we override the title with the user's query
                // if the service is configurable or a general inquiry. This way the chat starts with the user's exact words.
                const serviceToDispatch = { ...matchedService, context: query };
                startChatWithService(serviceToDispatch);
            } else {
                // Fallback for general inquiry, using the user's original query as context
                startChatWithService({
                    id: 'plan-sonstiges',
                    title: query,
                    category: 'Planung & Beratung',
                    context: query,
                });
            }


        } catch (err) {
            console.error("Fehler bei der KI-Analyse:", err);
            setError("Die Analyse ist fehlgeschlagen. Ich starte den Chat für Sie mit Ihrer Anfrage.");
            setTimeout(() => {
                // Start chat with the raw query as a fallback
                startChatWithService({
                    id: 'plan-sonstiges',
                    title: query,
                    category: 'Planung & Beratung',
                    context: query,
                });
            }, 2000);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedCategoryData = activeCategory ? {
        title: activeCategory,
        subServices: services.filter(s => s.category === activeCategory)
    } : null;

    return (
        <div className="max-w-6xl mx-auto relative overflow-hidden min-h-[480px] flex items-center">
            {/* View Container */}
            <div className="relative w-full">
                {/* Main View */}
                 <div className={`transition-all duration-500 ease-in-out w-full ${activeCategory ? 'opacity-0 -translate-x-full absolute pointer-events-none' : 'opacity-100 translate-x-0'}`}>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column: AI Input */}
                        <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Wie können wir Ihnen helfen?</h3>
                            <p className="text-slate-500 mb-6">Beschreiben Sie Ihr Anliegen in einfachen Worten. Unsere KI leitet Sie direkt zum richtigen Ansprechpartner weiter.</p>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="z.B. 'Ich brauche eine PV-Anlage für mein Firmendach' oder 'Dachrinnenreinigung für eine 15m lange Halle'"
                                className="w-full p-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow text-base bg-slate-50 text-slate-800 placeholder-slate-400 min-h-[120px]"
                                rows={4}
                            />
                            <button
                                onClick={handleAnalysis}
                                disabled={isLoading}
                                className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow transform hover:-translate-y-1 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <LoadingSpinner />
                                        <span>Analysiere...</span>
                                    </div>
                                ) : "Anfrage per KI starten"}
                            </button>
                            {error && <p className="text-sm text-red-600 text-center mt-3">{error}</p>}
                        </div>

                        {/* Right Column: Inspiration Cards */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-slate-700 text-center lg:text-left mb-4">Oder wählen Sie direkt einen Bereich:</h3>
                            {categories.map(cat => (
                                <InspirationCard key={cat.id} title={cat.title} icon={cat.icon} onClick={() => setActiveCategory(cat.title)} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sub-Service View */}
                <div className={`transition-all duration-500 ease-in-out w-full lg:col-span-2 ${activeCategory ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute pointer-events-none'}`}>
                    {selectedCategoryData && (
                        <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200">
                            <div className="flex items-center mb-6">
                                <button onClick={() => setActiveCategory(null)} className="p-2 rounded-full hover:bg-slate-100 mr-4 transition-colors" aria-label="Zurück zur Übersicht">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                </button>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">{selectedCategoryData.title}</h3>
                                    <p className="text-slate-500">Bitte präzisieren Sie Ihre Anfrage.</p>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {selectedCategoryData.subServices.map(service => (
                                    <SubServiceCard key={service.id} title={service.title} onClick={() => startChatWithService(service)} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceWizard;
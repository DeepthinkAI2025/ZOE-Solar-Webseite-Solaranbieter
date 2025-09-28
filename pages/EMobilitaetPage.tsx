import React from 'react';
import { Page } from '../types';
import AnimatedSection from '../components/AnimatedSection';
import { services } from '../data/services';

interface EMobilitaetPageProps {
  setPage: (page: Page) => void;
}

const keyFeatures = [
    { title: 'AC- & DC-Ladelösungen', description: 'Von der Normalladung für Mitarbeiter bis zum High-Power-Charging für Kunden – wir planen die passende Technologie.', icon: 'charging' },
    { title: 'Intelligentes Lastmanagement', description: 'Vermeiden Sie teure Lastspitzen. Unser System verteilt die verfügbare Leistung dynamisch und intelligent auf alle ladebereiten Fahrzeuge.', icon: 'management' },
    { title: 'Skalierbare Infrastruktur', description: 'Unsere Ladelösungen wachsen mit Ihrem Bedarf. Beginnen Sie klein und erweitern Sie Ihren Ladepark jederzeit modular.', icon: 'scalable' },
    { title: 'Backend & Abrechnung', description: 'Wir integrieren professionelle Backend-Systeme für Monitoring, Nutzerverwaltung und flexible Abrechnungsmodelle (z.B. per App, Ladekarte).', icon: 'billing' },
];

const Icon: React.FC<{ name: string }> = ({ name }) => {
    const className = 'w-8 h-8 text-green-600';
    switch(name) {
        case 'charging': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
        case 'management': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>;
        case 'scalable': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>;
        case 'billing': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m-6 2.25h6M12 9.75l.487.042a1.125 1.125 0 011.013 1.014l.042.487m0 0l-.487-.042a1.125 1.125 0 01-1.013-1.014l-.042-.487m0 0l.487.042a1.125 1.125 0 001.013-1.014l.042-.487m0 0l-.487.042a1.125 1.125 0 00-1.013 1.014l-.042.487m-3.375 9.75c0-1.244 1.006-2.25 2.25-2.25s2.25 1.006 2.25 2.25" /></svg>;
    }
    return null;
}

const EMobilitaetHero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
    return (
        <section className="ladeparks-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left z-10">
                        <p className="font-bold text-green-600 uppercase tracking-wider page-hero-animate-item page-hero-breadcrumb">E-Mobilität</p>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter page-hero-animate-item page-hero-title">
                            Zukunft laden.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 page-hero-animate-item page-hero-subtitle">
                           Positionieren Sie sich als Vorreiter der Mobilitätswende. Wir schaffen maßgeschneiderte Ladeinfrastruktur für Ihren Fuhrpark, Ihre Mitarbeiter und Kunden.
                        </p>
                        <div className="mt-8 page-hero-animate-item page-hero-cta">
                             <button onClick={onCtaClick} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                 Jetzt Beratung starten
                             </button>
                         </div>
                    </div>
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=800&auto=format&fit=crop" alt="HPC Ladesäule" className="floating-hero-img ladeparks-hero glowing-img img-1" />
                            <img src="https://images.unsplash.com/photo-1633333393122-2c63e2f5b80a?q=80&w=800&auto=format&fit=crop" alt="Wohnquartier Ladepark" className="floating-hero-img ladeparks-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1632833252069-e325239a7a6c?q=80&w=800&auto=format&fit=crop" alt="Betriebshof" className="floating-hero-img ladeparks-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const EMobilitaetPage: React.FC<EMobilitaetPageProps> = ({ setPage }) => {
    const openChatWithContext = (contextId: string) => {
        const service = services.find(s => s.id === contextId);
        if (service) {
            document.dispatchEvent(new CustomEvent('start-chat-with-service', { detail: service }));
        }
    };
    
    return (
        <div className="bg-white">
            <EMobilitaetHero onCtaClick={() => openChatWithContext('emob-ladepark-hpc')} />
            <div className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <main className="max-w-4xl mx-auto space-y-16">
                        {/* Intro */}
                        <AnimatedSection>
                            <div className="text-center">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Mehr als nur tanken: Ein Service für die Zukunft.</h2>
                                <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                                    Die Elektromobilität ist keine Zukunftsvision mehr, sie ist Realität. Bieten Sie Ihrem Fuhrpark, Ihren Mitarbeitern und Kunden eine moderne Ladeinfrastruktur und positionieren Sie sich als zukunftsorientiertes Unternehmen. In Kombination mit einer Photovoltaikanlage wird Ihr Ladepark zur profitablen Investition in saubere Energie.
                                </p>
                            </div>
                        </AnimatedSection>

                        {/* Features Section */}
                        <AnimatedSection>
                            <div className="grid md:grid-cols-2 gap-8">
                                {keyFeatures.map(feature => (
                                    <div key={feature.title} className="flex items-start gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex-shrink-0 bg-green-100 p-3 rounded-full mt-1">
                                            <Icon name={feature.icon}/>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                                            <p className="text-slate-600">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedSection>
                        
                        {/* Synergy Section */}
                        <AnimatedSection>
                             <div className="bg-slate-800 text-white p-12 rounded-lg shadow-lg">
                                <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
                                <div className="md:col-span-1 flex justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </div>
                                <div className="md:col-span-2">
                                        <h2 className="text-3xl font-bold text-white">Die perfekte Synergie: PV-Anlage + Ladepark</h2>
                                        <p className="text-slate-300 mt-2">
                                            Laden Sie Ihre E-Fahrzeuge direkt mit Ihrem eigenen, sauberen Solarstrom. Das senkt nicht nur Ihre Betriebskosten dramatisch, sondern maximiert auch den Eigenverbrauch Ihrer PV-Anlage und beschleunigt deren Amortisation.
                                        </p>
                                        <button onClick={() => setPage('service-ladeparks')} className="mt-6 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
                                            Mehr erfahren
                                        </button>
                                </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection>
                            <div className="text-center pt-12 border-t border-slate-200">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Starten Sie Ihre intelligente Bedarfsanalyse</h2>
                                <p className="text-lg text-slate-600 my-4 max-w-3xl mx-auto">
                                    Unser KI-Assistent stellt Ihnen einige gezielte Fragen zu Ihrem Ladebedarf, um die perfekte Lösung für Sie zu finden. Unverbindlich und in nur 2 Minuten.
                                </p>
                                <button onClick={() => openChatWithContext('emob-ladepark-hpc')} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                    KI-Analyse starten
                                </button>
                            </div>
                        </AnimatedSection>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default EMobilitaetPage;

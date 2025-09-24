import React from 'react';
import { Page } from '../types';
import { useCasesData } from '../data/useCases';

const AgriPVHero: React.FC<{ onCtaClick: (action: 'scroll' | 'open-chat', anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="agripv-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Agri-PV:
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Die doppelte Ernte.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Verbinden Sie Landwirtschaft mit Energieerzeugung. Schützen Sie Ihre Kulturen, sparen Sie Wasser und schaffen Sie eine zweite, stabile Einnahmequelle mit der neuen Bundesförderung 2025.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <button onClick={() => onCtaClick('open-chat')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Förderung prüfen
                            </button>
                             <a onClick={() => onCtaClick('scroll', 'benefits')} className="w-full sm:w-auto bg-white text-slate-700 font-bold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors border border-slate-300 shadow-md cursor-pointer">
                                Mehr erfahren
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=800&auto=format&fit=crop" alt="Agri-PV Anlage" className="floating-hero-img agripv-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop" alt="Weizenfeld" className="floating-hero-img agripv-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1695932543949-5a6797240212?q=80&w=800&auto=format&fit=crop" alt="Traktor fährt unter Agri-PV" className="floating-hero-img agripv-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const benefits = [
    { title: 'Doppelte Ernte', description: 'Maximieren Sie Ihre Flächeneffizienz durch die gleichzeitige Produktion von Nahrungsmitteln und sauberem Strom.', icon: 'dual-use' },
    { title: 'Ernteschutz & Wassereinsparung', description: 'Die Module schützen empfindliche Kulturen vor Wetterextremen wie Hagel oder Sonnenbrand und reduzieren die Wasserverdunstung.', icon: 'weather' },
    { title: 'Stabile Einnahmequelle', description: 'Schaffen Sie eine wetterunabhängige, planbare Einnahmequelle durch den Stromverkauf und werden Sie resilienter gegen Ernteausfälle.', icon: 'revenue' },
    { title: 'Biodiversität & Bodenschutz', description: 'Agri-PV kann die Artenvielfalt fördern und den Boden vor Erosion schützen.', icon: 'esg' },
];

const BenefitIcon: React.FC<{ name: string }> = ({ name }) => {
    const className = "w-10 h-10 text-green-700";
    const strokeWidth = 1.5;
    const icons: { [key: string]: React.ReactNode } = {
        'dual-use': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" /></svg>,
        'weather': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        'revenue': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
        'esg': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002-.018.005-.004.001-.002.001-.001.001A49.954 49.954 0 0112 13.486a49.954 49.954 0 018.232-3.339l-.001-.001-.002-.001-.004-.001-.018-.005-.07-.002m-15.482 0l-2.658-.814" /></svg>,
    };
    return icons[name] || null;
};

const AgriPVPage: React.FC = () => {
    const openChatWithContext = () => {
        const useCase = useCasesData.find(uc => uc.id === 'agri-pv');
        if (useCase) {
            const detail = { type: 'use_case', useCase };
            document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail }));
        }
    };

     const handleHeroCta = (action: 'scroll' | 'open-chat', anchor?: string) => {
        if (action === 'open-chat') {
            openChatWithContext();
        } else if (action === 'scroll' && anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white">
            <AgriPVHero onCtaClick={handleHeroCta} />
            
            {/* Benefits Section */}
            <section id="benefits" className="py-20 scroll-mt-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold text-slate-900">Vierfacher Vorteil für Ihren Betrieb</h2>
                        <p className="text-lg text-slate-600 mt-4">Mehr als nur Strom: Agri-PV ist ein Werkzeug für eine zukunftsfähige Landwirtschaft.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map(benefit => (
                            <div key={benefit.title} className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                                <div className="inline-block bg-green-100 p-3 rounded-full mb-4">
                                    <BenefitIcon name={benefit.icon} />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-slate-800">{benefit.title}</h3>
                                <p className="text-slate-600 text-sm">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* New Subsidies Section */}
            <section className="py-20 bg-green-50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                         <p className="font-bold text-green-600 uppercase tracking-wider">Exklusiv für Landwirte</p>
                        <h2 className="text-4xl font-bold text-slate-900 mt-2">Die Agri-PV Förderoffensive 2025</h2>
                        <p className="text-lg text-slate-600 mt-4">Die Bundesregierung hat die Bedeutung der Agri-PV erkannt und unterstützt Landwirte mit einem attraktiven Förderpaket. Wir sichern Ihnen die maximale Förderung.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
                             <p className="text-4xl font-bold text-green-600">bis zu 40%</p>
                             <h3 className="font-semibold text-slate-800 mt-2">Investitionszuschuss</h3>
                             <p className="text-sm text-slate-500 mt-1">Auf die Mehrkosten der aufgeständerten Unterkonstruktion.</p>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
                             <p className="text-4xl font-bold text-green-600">+1,5 ct/kWh</p>
                             <h3 className="font-semibold text-slate-800 mt-2">Agri-Bonus</h3>
                             <p className="text-sm text-slate-500 mt-1">Zusätzliche Vergütung auf jede eingespeiste Kilowattstunde Strom.</p>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
                             <p className="text-4xl font-bold text-green-600">Beschleunigt</p>
                             <h3 className="font-semibold text-slate-800 mt-2">Genehmigungsverfahren</h3>
                             <p className="text-sm text-slate-500 mt-1">Agri-PV-Projekte werden im Baugenehmigungsverfahren privilegiert.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* System Types Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900">Zwei Systeme, maximale Flexibilität</h2>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* High-Ständer */}
                        <div className="bg-slate-50 p-8 rounded-lg shadow-lg border border-slate-200">
                             <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop" alt="Hochaufgeständerte Agri-PV" className="rounded-md mb-6 w-full h-64 object-cover" />
                             <h3 className="text-2xl font-bold text-green-700 mb-3">Hochaufgeständerte Systeme</h3>
                             <p className="text-slate-600 mb-4">Die Module werden in mehreren Metern Höhe über der Anbaufläche installiert. Dies ermöglicht die normale Bewirtschaftung mit Standard-Landmaschinen und schützt die Kulturen darunter.</p>
                             <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                                 <li><strong>Ideal für:</strong> Obst, Wein, Beeren und andere empfindliche Sonderkulturen.</li>
                                 <li><strong>Vorteil:</strong> Maximaler Schutz, kaum Flächenverlust.</li>
                             </ul>
                        </div>
                        {/* Vertical */}
                        <div className="bg-slate-50 p-8 rounded-lg shadow-lg border border-slate-200">
                             <img src="https://images.unsplash.com/photo-1695932543949-5a6797240212?q=80&w=2070&auto=format&fit=crop" alt="Vertikale Agri-PV" className="rounded-md mb-6 w-full h-64 object-cover" />
                             <h3 className="text-2xl font-bold text-green-700 mb-3">Vertikale, bifaziale Systeme</h3>
                             <p className="text-slate-600 mb-4">Senkrecht aufgestellte, beidseitig aktive Modulreihen mit breitem Abstand. Sie produzieren Strom vor allem morgens und abends – perfekt für das Stromnetz.</p>
                             <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                                <li><strong>Ideal für:</strong> Ackerkulturen wie Getreide, Kartoffeln oder Grünland.</li>
                                <li><strong>Vorteil:</strong> Minimale Bodenversiegelung, einfache Bewirtschaftung zwischen den Reihen.</li>
                             </ul>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Intelligent Funnel CTA */}
            <section className="text-center py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Starten Sie Ihre intelligente Bedarfsanalyse</h2>
                    <p className="text-lg text-slate-600 my-4 max-w-3xl mx-auto">
                        Unser KI-Assistent stellt Ihnen einige gezielte Fragen zu Ihren Flächen und Zielen, um die perfekte Agri-PV-Lösung für Sie zu finden. Unverbindlich und in nur 2 Minuten.
                    </p>
                    <button onClick={openChatWithContext} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                        KI-Analyse starten
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AgriPVPage;
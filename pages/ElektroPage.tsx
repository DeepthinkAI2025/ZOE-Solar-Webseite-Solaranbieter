import React from 'react';
import { Page } from '../types';
import AnimatedSection from '../components/AnimatedSection';

interface ElektroPageProps {
  setPage: (page: Page) => void;
}

const serviceCards = [
    {
        page: 'service-netzanschluss' as Page,
        title: 'Netzanschlüsse',
        description: 'Vom Hausanschluss bis zur Mittelspannungs-Übergabestation für Solarparks.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    },
    {
        page: 'service-verteilerbau' as Page,
        title: 'Verteilerbau & Umbau',
        description: 'Planung und Bau von Zählerschränken und Hauptverteilungen nach aktuellen Normen.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15h.008" /></svg>,
    },
    {
        page: 'service-zaehlerbau' as Page,
        title: 'Zählerplatz & Messkonzepte',
        description: 'Umsetzung komplexer Messkonzepte für Mieterstrom oder Direktvermarktung.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>,
    }
];


const ElektroHero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
    return (
        <section className="leistungen-hero-v2 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                         <p className="font-bold text-green-600 uppercase tracking-wider page-hero-animate-item page-hero-breadcrumb">Elektro-Fachbetrieb</p>
                         <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter mt-4 page-hero-animate-item page-hero-title">
                             Das Fundament Ihrer Energieanlage.
                         </h1>
                         <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 page-hero-animate-item page-hero-subtitle">
                            Von der Planung des Netzanschlusses bis zum Bau komplexer Verteileranlagen – unsere zertifizierten Elektromeister schaffen die sichere und normgerechte Basis für Ihr Energieprojekt.
                         </p>
                         <div className="mt-8 page-hero-animate-item page-hero-cta">
                             <button onClick={onCtaClick} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                 Jetzt Beratung starten
                             </button>
                         </div>
                    </div>
                     <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1632598822839-867cce349323?q=80&w=800&auto=format&fit=crop" alt="Verteilerbau" className="floating-hero-img elektro-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1581092921531-03105f24161a?q=80&w=800&auto=format&fit=crop" alt="Elektro-Planung" className="floating-hero-img elektro-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1588339323423-64537359a3e6?q=80&w=800&auto=format&fit=crop" alt="Netzanschluss" className="floating-hero-img elektro-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ElektroPage: React.FC<ElektroPageProps> = ({ setPage }) => {
    const openChat = () => {
        document.dispatchEvent(new CustomEvent('open-chat'));
    };

    return (
        <div className="bg-white">
            <ElektroHero onCtaClick={openChat} />
            
            <AnimatedSection>
                <section id="services-overview" className="py-20 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16 max-w-4xl mx-auto">
                            <p className="font-bold text-green-600 uppercase tracking-wider">Unsere Elektro-Leistungen</p>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Alles aus einer Hand.</h2>
                            <p className="text-lg text-slate-600 mt-4">
                                Wir bieten umfassende Elektro-Dienstleistungen, die weit über die reine PV-Installation hinausgehen, um eine sichere, effiziente und zukunftsfähige Energieinfrastruktur für Ihr Gebäude zu gewährleisten.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {serviceCards.map(card => (
                                <div key={card.page} className="group bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center">
                                    <div className="bg-green-50 p-4 rounded-full mb-6 transition-colors group-hover:bg-green-100">
                                        {card.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                                    <p className="text-slate-600 text-sm flex-grow mb-6">{card.description}</p>
                                    <button onClick={() => setPage(card.page)} className="mt-auto font-bold text-green-600 group-hover:text-green-700 transition-colors">
                                        Mehr erfahren <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default ElektroPage;
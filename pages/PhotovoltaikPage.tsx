import React, { useState } from 'react';
import { Page } from '../types';
import AnimatedSection from '../components/AnimatedSection';
import ServiceWizard from '../components/ServiceWizard';

interface PhotovoltaikPageProps {
  setPage: (page: Page, options?: { anchor?: string }) => void;
}

// --- START: Hero Component ---
const ServiceIcon: React.FC<{ name: string }> = ({ name }) => {
    const icons: { [key: string]: React.ReactNode } = {
        'dachanlagen': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.75M9 11.25h6.75M9 15.75h6.75M9 20.25h6.75" /></svg>,
        'agri-pv': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
        'speicher': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>,
    };
    return icons[name] || null;
};
const serviceCards = [
    { id: 'dachanlagen', title: 'Dachanlagen', icon: 'dachanlagen', page: 'service-photovoltaik' as Page },
    { id: 'agri-pv', title: 'Agri-PV', icon: 'agri-pv', page: 'agri-pv' as Page },
    { id: 'speicher', title: 'Speicher', icon: 'speicher', page: 'service-speicher' as Page },
];
const PhotovoltaikHero: React.FC<{ setPage: (page: Page) => void, onCtaClick: () => void }> = ({ setPage, onCtaClick }) => {
    return (
        <section className="leistungen-hero-v2 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                         <p className="font-bold text-green-600 uppercase tracking-wider page-hero-animate-item page-hero-breadcrumb">Photovoltaik</p>
                         <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter mt-4 page-hero-animate-item page-hero-title">
                             Ganzheitliche Solarlösungen.
                         </h1>
                         <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 page-hero-animate-item page-hero-subtitle">
                            Wir sind Ihr strategischer Partner für die solare Energiewende und begleiten Sie von der ersten Analyse bis zur langfristigen Betriebsführung Ihrer Anlage.
                         </p>
                         <div className="mt-8 page-hero-animate-item page-hero-cta">
                             <button onClick={onCtaClick} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                 Jetzt Beratung starten
                             </button>
                         </div>
                    </div>
                    {/* Right Column: Service Grid */}
                    <div className="flex flex-col items-center justify-center">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 page-hero-animate-item" style={{ animationDelay: '0.4s' }}>Wählen Sie Ihren Leistungsbereich</h3>
                         <div className="service-grid">
                            {serviceCards.map((card, index) => (
                                <div key={card.id} className={`service-card card-${index + 1}`} onClick={() => setPage(card.page)}>
                                    <div className="service-card-arrow">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </div>
                                    <div className="service-card-icon-wrapper">
                                        <ServiceIcon name={card.icon} />
                                    </div>
                                    <h4>{card.title}</h4>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
// --- END: Hero Component ---

const PhotovoltaikPage: React.FC<PhotovoltaikPageProps> = ({ setPage }) => {
    const openChat = () => {
        document.dispatchEvent(new CustomEvent('open-chat'));
    };

    return (
        <div className="bg-white">
            <PhotovoltaikHero setPage={setPage} onCtaClick={openChat} />
            
            <AnimatedSection>
                <section id="service-finder" className="py-20 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16 max-w-4xl mx-auto">
                            <p className="font-bold text-green-600 uppercase tracking-wider">Lösungsfinder</p>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Finden Sie den richtigen Service.</h2>
                            <p className="text-lg text-slate-600 mt-4">
                                Unsicher, welche Dienstleistung Sie benötigen? Beschreiben Sie Ihr Anliegen in einfachen Worten oder wählen Sie direkt einen Bereich, um Ihre Anfrage zu präzisieren.
                            </p>
                        </div>
                        <ServiceWizard />
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default PhotovoltaikPage;

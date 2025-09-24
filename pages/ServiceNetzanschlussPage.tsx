import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import AnimatedSection from '../components/AnimatedSection';

interface ServiceNetzanschlussPageProps {
    setPage: (page: Page) => void;
    currentPage: Page;
    bannerHeight: number;
    headerHeight: number;
}

const ServiceNetzanschlussPage: React.FC<ServiceNetzanschlussPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
    const openChat = () => document.dispatchEvent(new CustomEvent('open-chat'));
    
    const navItems = [
        { id: 'elektro', title: 'Übersicht Elektro', page: 'elektro' as Page },
        { id: 'service-netzanschluss', title: 'Netzanschlüsse', page: 'service-netzanschluss' as Page },
        { id: 'service-verteilerbau', title: 'Verteilerbau', page: 'service-verteilerbau' as Page },
        { id: 'service-zaehlerbau', title: 'Zählerplatz', page: 'service-zaehlerbau' as Page },
    ];

    return (
        <div className="bg-white">
            <SubHeader navItems={navItems} activeItemId={currentPage} onItemClick={(id, page) => setPage(page as Page)} bannerHeight={bannerHeight} headerHeight={headerHeight} />
            <div className="py-20">
                <div className="container mx-auto px-6 prose-custom prose-lg max-w-4xl">
                    <AnimatedSection>
                        <h2>Netzanschlüsse: Das Tor zur Energiewelt</h2>
                        <p className="lead">Der Netzanschluss ist die entscheidende Schnittstelle zwischen Ihrer Energieanlage und dem öffentlichen Stromnetz. Eine fachgerechte Planung und Ausführung ist nicht nur eine technische Notwendigkeit, sondern auch eine rechtliche Voraussetzung für den sicheren und rentablen Betrieb.</p>
                        
                        <h3>Unsere Leistungen im Überblick</h3>
                        <p>Als eingetragener Meisterbetrieb planen und realisieren wir Netzanschlüsse für Projekte jeder Größenordnung:</p>
                        <ul>
                            <li><strong>Netzverträglichkeitsprüfung (NVP):</strong> Wir klären frühzeitig mit dem Netzbetreiber die technischen Möglichkeiten an Ihrem Standort.</li>
                            <li><strong>Planung & Dimensionierung:</strong> Wir berechnen die benötigte Anschlussleistung und dimensionieren alle Komponenten (Kabel, Schutztechnik) normgerecht.</li>
                            <li><strong>Trafostationen:</strong> Für Großanlagen im Megawatt-Bereich planen und errichten wir komplette Mittelspannungs-Übergabestationen.</li>
                            <li><strong>Komplette Antragsstellung:</strong> Wir übernehmen die gesamte Kommunikation und Antragsstellung bei Ihrem zuständigen Verteilnetzbetreiber (VNB).</li>
                        </ul>

                         <div className="info-card info-card-info">
                             <div className="info-card-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                            <div>
                                <h4>Vermeiden Sie Verzögerungen</h4>
                                <p>Ein unvollständiger oder fehlerhafter Antrag kann Projekte um Monate verzögern. Vertrauen Sie auf unsere Expertise für einen reibungslosen und schnellen Anschlussprozess.</p>
                            </div>
                        </div>

                        <div className="text-center mt-16">
                            <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                Jetzt Netzanschluss anfragen
                            </button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
};

export default ServiceNetzanschlussPage;
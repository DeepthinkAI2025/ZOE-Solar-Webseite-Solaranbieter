import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import AnimatedSection from '../components/AnimatedSection';

interface ServiceZaehlerbauPageProps {
    setPage: (page: Page) => void;
    currentPage: Page;
    bannerHeight: number;
    headerHeight: number;
}

const ServiceZaehlerbauPage: React.FC<ServiceZaehlerbauPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
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
                        <h2>Zählerplatz &amp; Messkonzepte</h2>
                        <p className="lead">Die korrekte Erfassung von Energieströmen ist die Grundlage für jede Abrechnung und Optimierung. Wir errichten normgerechte Zählerplätze und entwickeln intelligente Messkonzepte für anspruchsvolle Anwendungsfälle.</p>
                        
                        <h3>Unsere Leistungen im Überblick</h3>
                        <p>Wir sorgen dafür, dass Ihre Energieflüsse präzise und rechtssicher gemessen werden:</p>
                        <ul>
                            <li><strong>Errichtung von Zählerplätzen:</strong> Wir bauen und verdrahten Zählerplätze nach den aktuellen Technischen Anschlussbedingungen (TAB) Ihres Netzbetreibers.</li>
                            <li><strong>Installation von Smart Metern:</strong> Wir installieren moderne Messeinrichtungen (Smart Meter) als Voraussetzung für die Direktvermarktung und dynamische Tarife.</li>
                            <li><strong>Entwicklung von Messkonzepten:</strong> Für komplexe Szenarien wie Mieterstrom, Direktlieferung (PPA) oder die Versorgung mehrerer Gebäude entwickeln wir das passende, abrechnungssichere Messkonzept.</li>
                            <li><strong>Wandlermessungen:</strong> Bei großen Leistungen über 63A planen und installieren wir die notwendige Wandlermessung.</li>
                        </ul>

                         <div className="info-card info-card-info">
                             <div className="info-card-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                            <div>
                                <h4>Grundlage für die Abrechnung</h4>
                                <p>Ein korrektes Messkonzept ist die unabdingbare Voraussetzung für die rechtssichere Abrechnung von eingespeistem und selbst verbrauchtem Strom. Wir stellen sicher, dass alle Anforderungen erfüllt sind.</p>
                            </div>
                        </div>

                        <div className="text-center mt-16">
                            <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                Jetzt Messkonzept anfragen
                            </button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
};

export default ServiceZaehlerbauPage;
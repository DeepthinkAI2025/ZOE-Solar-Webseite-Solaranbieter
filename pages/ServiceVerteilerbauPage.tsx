import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import AnimatedSection from '../components/AnimatedSection';

interface ServiceVerteilerbauPageProps {
    setPage: (page: Page) => void;
    currentPage: Page;
    bannerHeight: number;
    headerHeight: number;
}

const ServiceVerteilerbauPage: React.FC<ServiceVerteilerbauPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
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
                        <h2>Verteilerbau: Die Schaltzentrale Ihrer Energie</h2>
                        <p className="lead">Die Hauptverteilung ist das Herz Ihrer elektrischen Infrastruktur. Mit der Integration von PV, Speicher und E-Mobilität steigen die Anforderungen an moderne Verteileranlagen enorm. Wir sorgen dafür, dass Ihre Schaltzentrale für die Zukunft gerüstet ist.</p>
                        
                        <h3>Unsere Leistungen im Überblick</h3>
                        <p>Ob Neubau oder Modernisierung im Bestand – wir sind Ihr Partner für normgerechten und zukunftssicheren Verteilerbau:</p>
                        <ul>
                            <li><strong>Planung & Dimensionierung:</strong> Wir planen Ihre Verteilung nach VDE-Norm und dimensionieren alle Schutz- und Schaltgeräte passend zu Ihren Anforderungen.</li>
                            <li><strong>Neubau von Verteilungen:</strong> Errichtung kompletter Haupt- und Unterverteilungen für Gewerbe- und Industriebauten.</li>
                            <li><strong>Umbau & Erweiterung:</strong> Wir modernisieren bestehende Anlagen und integrieren fachgerecht die Komponenten für PV, Speicher und Ladeinfrastruktur.</li>
                            <li><strong>Dokumentation & Prüfung:</strong> Jede von uns gebaute oder umgebaute Verteilung wird umfassend geprüft und mit einem sauberen Schaltplan dokumentiert.</li>
                        </ul>

                        <div className="info-card info-card-tip">
                            <div className="info-card-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></div>
                            <div>
                                <h4>Sauberkeit & Qualität</h4>
                                <p>Ein sauber verdrahteter und klar beschrifteter Verteilerschrank ist nicht nur eine Frage der Optik, sondern ein wesentliches Sicherheitsmerkmal. Wir legen höchsten Wert auf eine handwerklich perfekte Ausführung.</p>
                            </div>
                        </div>

                        <div className="text-center mt-16">
                            <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                Jetzt Verteilerbau anfragen
                            </button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
};

export default ServiceVerteilerbauPage;
import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import AnimatedSection from '../components/AnimatedSection';

interface FoerdermittelKFWPageProps {
    setPage: (page: Page) => void;
    currentPage: Page;
    bannerHeight: number;
    headerHeight: number;
}

const FoerdermittelKFWPage: React.FC<FoerdermittelKFWPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
    const openChat = () => document.dispatchEvent(new CustomEvent('open-chat'));
    
    const navItems = [
        { id: 'finanzierung', title: 'Übersicht', page: 'finanzierung' as Page },
        { id: 'foerdermittel-kfw', title: 'KfW', page: 'foerdermittel-kfw' as Page },
        { id: 'foerdermittel-ibb', title: 'IBB', page: 'foerdermittel-ibb' as Page },
        { id: 'foerdermittel-bafa', title: 'BAFA', page: 'foerdermittel-bafa' as Page },
    ];

    return (
        <div className="bg-white">
            <SubHeader navItems={navItems} activeItemId={currentPage} onItemClick={(id, page) => setPage(page as Page)} bannerHeight={bannerHeight} headerHeight={headerHeight} />
            <div className="py-20">
                <div className="container mx-auto px-6 prose-custom prose-lg max-w-4xl">
                    <AnimatedSection>
                        <h2>KfW-Bankengruppe: Der Motor für die Energiewende</h2>
                        <p className="lead">Die Kreditanstalt für Wiederaufbau (KfW) ist die zentrale Förderbank des Bundes. Sie unterstützt Unternehmen, die in erneuerbare Energien investieren, mit äußerst zinsgünstigen Krediten und Tilgungszuschüssen, um die Energiewende in Deutschland voranzutreiben.</p>
                        
                        <h3>Top-Programm: Erneuerbare Energien – Standard (270)</h3>
                        <p>Dieses Programm ist das wichtigste Instrument zur Finanzierung von Photovoltaikanlagen, Speichern und Ladeinfrastruktur. Es richtet sich an Unternehmen, Freiberufler und gemeinnützige Organisationen, die in die Zukunft investieren wollen.</p>
                        <ul>
                            <li><strong>Extrem niedrige Zinssätze:</strong> Profitieren Sie von Konditionen, die oft deutlich unter dem Marktniveau liegen.</li>
                            <li><strong>Lange Laufzeiten:</strong> Planen Sie sicher mit Laufzeiten von bis zu 20 Jahren.</li>
                            <li><strong>Tilgungsfreie Anlaufjahre:</strong> Schonen Sie Ihre Liquidität in der Startphase des Projekts.</li>
                            <li><strong>Bis zu 100% Finanzierung:</strong> Decken Sie die gesamten Netto-Investitionskosten über den Kredit ab.</li>
                        </ul>

                        <div className="info-card info-card-tip">
                            <div className="info-card-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></div>
                            <div>
                                <h4>Unser Service für Sie</h4>
                                <p>Die Beantragung eines KfW-Kredits erfolgt über Ihre Hausbank. Wir nehmen Ihnen die Arbeit ab: ZOE Solar erstellt alle notwendigen technischen Unterlagen, Wirtschaftlichkeitsberechnungen und Angebote, die Sie für einen reibungslosen und schnellen Antragsprozess benötigen.</p>
                            </div>
                        </div>

                        <blockquote>
                            <p>Nutzen Sie die staatliche Unterstützung, um Ihre Energiekosten zu senken und gleichzeitig einen Beitrag zum Klimaschutz zu leisten. Wir zeigen Ihnen wie.</p>
                        </blockquote>

                        <div className="text-center mt-16">
                            <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                Jetzt KfW-Potenzial prüfen lassen
                            </button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
};

export default FoerdermittelKFWPage;
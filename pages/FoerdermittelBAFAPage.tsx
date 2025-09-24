import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import AnimatedSection from '../components/AnimatedSection';

interface FoerdermittelBAFAPageProps {
    setPage: (page: Page) => void;
    currentPage: Page;
    bannerHeight: number;
    headerHeight: number;
}

const FoerdermittelBAFAPage: React.FC<FoerdermittelBAFAPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
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
                        <h2>BAFA: Direkte Zuschüsse für Energieeffizienz</h2>
                        <p className="lead">Das Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA) ist eine Bundesbehörde, die gezielte Zuschüsse für Maßnahmen zur Steigerung der Energieeffizienz vergibt. Oft sind diese eine ideale Ergänzung zur Finanzierung einer PV-Anlage.</p>
                        
                        <h3>Fokus auf Einzelmaßnahmen & Beratung</h3>
                        <p>Im Gegensatz zur KfW, die meist die gesamte Anlage finanziert, fokussiert sich die BAFA auf spezifische Einzelmaßnahmen. Die Förderprogramme ändern sich häufig, aber typische förderfähige Bereiche sind:</p>
                        <ul>
                            <li><strong>Energieberatung für Nichtwohngebäude (DIN V 18599):</strong> Lassen Sie sich die Kosten für eine professionelle Energieberatung bezuschussen, die die Grundlage für Ihr Sanierungs- und PV-Konzept bildet.</li>
                            <li><strong>Einzelmaßnahmen an der Gebäudehülle:</strong> Zuschüsse für Dämmung oder neue Fenster, die den Energiebedarf senken.</li>
                            <li><strong>Heizungsoptimierung:</strong> Förderung für den Umstieg auf erneuerbare Wärmesysteme wie Wärmepumpen, die perfekt mit einer PV-Anlage harmonieren.</li>
                        </ul>

                        <div className="info-card info-card-warning">
                            <div className="info-card-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
                            <div>
                                <h4>Wichtig: Antrag vor Beauftragung!</h4>
                                <p>Ein entscheidender Grundsatz bei BAFA-Förderungen ist: Der Förderantrag muss immer *vor* der Vergabe des Auftrags an ein Unternehmen gestellt werden. Eine nachträgliche Förderung ist ausgeschlossen. Wir helfen Ihnen, diese Fristen einzuhalten.</p>
                            </div>
                        </div>
                        
                        <blockquote>
                            <p>Durch die clevere Kombination von BAFA-Zuschüssen und KfW-Krediten kann die Gesamtrendite Ihres Projekts oft noch weiter gesteigert werden.</p>
                        </blockquote>

                        <div className="text-center mt-16">
                            <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                BAFA-Fördermöglichkeiten prüfen
                            </button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
};

export default FoerdermittelBAFAPage;
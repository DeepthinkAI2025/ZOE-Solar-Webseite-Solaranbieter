import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import AnimatedSection from '../components/AnimatedSection';

interface FoerdermittelIBBPageProps {
    setPage: (page: Page) => void;
    currentPage: Page;
    bannerHeight: number;
    headerHeight: number;
}

const FoerdermittelIBBPage: React.FC<FoerdermittelIBBPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
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
                        <h2>IBB: Förderung für die Hauptstadt</h2>
                        <p className="lead">Die Investitionsbank Berlin (IBB) ist die Förderbank des Landes Berlin. Sie unterstützt gezielt Berliner Unternehmen bei Investitionen in Nachhaltigkeit, Innovation und Wachstum.</p>
                        
                        <h3>Top-Programm: "Wirtschaft nah"</h3>
                        <p>Dieses Programm ist besonders für kleine und mittlere Unternehmen (KMU) in Berlin interessant. Es fördert Investitionen, die zur Modernisierung und Stärkung des Betriebs beitragen. Die Errichtung einer Photovoltaikanlage zur Senkung der Energiekosten und zur Verbesserung der CO₂-Bilanz ist hier oft ein zentraler Baustein.</p>
                        <ul>
                            <li><strong>Direkte Zuschüsse:</strong> Erhalten Sie einen prozentualen Zuschuss auf Ihre Investitionskosten, der nicht zurückgezahlt werden muss.</li>
                            <li><strong>Kombinierbarkeit:</strong> Die IBB-Förderung kann oft mit den Krediten der KfW kombiniert werden.</li>
                            <li><strong>Fokus auf Nachhaltigkeit:</strong> Projekte, die einen klaren ökologischen Mehrwert bieten, werden bevorzugt behandelt.</li>
                        </ul>

                        <div className="info-card info-card-info">
                             <div className="info-card-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                            <div>
                                <h4>Lokal & Kompetent</h4>
                                <p>Als Berliner Unternehmen kennen wir die Anforderungen und Prozesse der IBB genau. Wir prüfen die Förderfähigkeit Ihres Projekts und unterstützen Sie bei der Erstellung eines überzeugenden Antrags, um Ihre Chancen auf eine Zusage zu maximieren.</p>
                            </div>
                        </div>

                        <blockquote>
                            <p>Investieren Sie in die Zukunft Ihres Berliner Betriebs. Mit der richtigen Kombination aus PV-Anlage und Förderung wird Ihr Projekt zum doppelten Gewinn.</p>
                        </blockquote>

                        <div className="text-center mt-16">
                            <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                Jetzt IBB-Potenzial prüfen lassen
                            </button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
};

export default FoerdermittelIBBPage;
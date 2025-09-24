import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import AnimatedSection from '../components/AnimatedSection';

interface ServiceAnmeldungLadestationenPageProps {
    setPage: (page: Page) => void;
    currentPage: Page;
    bannerHeight: number;
    headerHeight: number;
}

const ServiceAnmeldungLadestationenPage: React.FC<ServiceAnmeldungLadestationenPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
    const openChat = () => document.dispatchEvent(new CustomEvent('open-chat'));
    
    const navItems = [
      { id: 'service-ladeparks', title: 'Ladeparks & E-Mobilität', page: 'service-ladeparks' as Page },
      { id: 'service-anmeldung-ladestationen', title: 'Anmeldung & Anträge', page: 'service-anmeldung-ladestationen' as Page },
    ];

    return (
        <div className="bg-white">
            <SubHeader navItems={navItems} activeItemId={currentPage} onItemClick={(id, page) => setPage(page as Page)} bannerHeight={bannerHeight} headerHeight={headerHeight} />
            <div className="py-20">
                <div className="container mx-auto px-6 prose-custom prose-lg max-w-4xl">
                    <AnimatedSection>
                        <h2>Anmeldung von Ladeinfrastruktur</h2>
                        <p className="lead">Die Installation von Ladeinfrastruktur, von der einzelnen Wallbox bis zum großen Ladepark, unterliegt klaren Anmelde- und Genehmigungspflichten. Wir sorgen dafür, dass Ihr Vorhaben von Anfang an auf einem rechtssicheren Fundament steht.</p>
                        
                        <h3>Wann muss ich Ladeinfrastruktur anmelden?</h3>
                        <ul>
                            <li><strong>Anzeigepflicht:</strong> Jede Ladeeinrichtung (auch private Wallboxen) mit einer Leistung von mehr als 3,7 kW muss dem Netzbetreiber vor der Inbetriebnahme angezeigt werden.</li>
                            <li><strong>Genehmigungspflicht:</strong> Ladeeinrichtungen mit einer Leistung von mehr als 12 kW benötigen vor der Installation eine explizite Genehmigung des Netzbetreibers. Dieser prüft, ob die zusätzliche Last vom Netzanschluss und dem lokalen Stromnetz getragen werden kann.</li>
                        </ul>

                        <div className="info-card info-card-info">
                             <div className="info-card-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                            <div>
                                <h4>Unser Service für Sie</h4>
                                <p>Wir übernehmen den kompletten Anmeldeprozess für Sie. Wir prüfen die technischen Voraussetzungen, stellen alle notwendigen Anträge beim Netzbetreiber und sorgen für eine schnelle und reibungslose Genehmigung, damit Sie Ihre E-Fahrzeuge so schnell wie möglich laden können.</p>
                            </div>
                        </div>

                        <h3>Öffentliche Ladesäulen & Eichrecht</h3>
                        <p>Wenn Sie den Ladestrom an Dritte verkaufen möchten (z.B. auf einem Kundenparkplatz), müssen die Ladesäulen eichrechtskonform sein. Das bedeutet, sie müssen den Stromverbrauch manipulationssicher und kilowattstundengenau erfassen können. Wir planen Ihre Anlage von Anfang an nach diesen Vorgaben und unterstützen Sie bei der Auswahl des passenden Abrechnungs-Backends.</p>

                        <div className="text-center mt-16">
                            <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                Jetzt Ladeinfrastruktur planen
                            </button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
};

export default ServiceAnmeldungLadestationenPage;
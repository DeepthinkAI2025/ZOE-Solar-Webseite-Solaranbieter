import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import AnimatedSection from '../components/AnimatedSection';

interface ServiceAnmeldungPVPageProps {
    setPage: (page: Page) => void;
    currentPage: Page;
    bannerHeight: number;
    headerHeight: number;
}

const ServiceAnmeldungPVPage: React.FC<ServiceAnmeldungPVPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
    const openChat = () => document.dispatchEvent(new CustomEvent('open-chat'));
    
    const navItems = [
      { id: 'service-photovoltaik', title: 'Photovoltaik Gewerbe', page: 'service-photovoltaik' as Page },
      { id: 'service-anmeldung-pv', title: 'Anmeldung & Anträge', page: 'service-anmeldung-pv' as Page },
      { id: 'service-speicher', title: 'Industrielle Speicher', page: 'service-speicher' as Page },
    ];

    return (
        <div className="bg-white">
            <SubHeader navItems={navItems} activeItemId={currentPage} onItemClick={(id, page) => setPage(page as Page)} bannerHeight={bannerHeight} headerHeight={headerHeight} />
            <div className="py-20">
                <div className="container mx-auto px-6 prose-custom prose-lg max-w-4xl">
                    <AnimatedSection>
                        <h2>Bürokratie? Übernehmen wir.</h2>
                        <p className="lead">Die Anmeldung einer gewerblichen Photovoltaikanlage ist ein komplexer Prozess mit vielen Schritten und Fristen. Als Ihr Generalunternehmer nehmen wir Ihnen diesen Aufwand komplett ab und sorgen für eine reibungslose und vorschriftsmäßige Abwicklung.</p>
                        
                        <h3>Der Prozess im Überblick</h3>
                        <p>Wir koordinieren alle notwendigen Schritte, damit Sie sich auf Ihr Kerngeschäft konzentrieren können:</p>
                        <ol>
                            <li><strong>Netzverträglichkeitsprüfung (NVP):</strong> Schon vor der Detailplanung stellen wir eine Anfrage bei Ihrem Netzbetreiber, um die Kapazität am gewünschten Netzanschlusspunkt zu prüfen.</li>
                            <li><strong>Anmeldung zum Netzanschluss (AZA):</strong> Wir reichen alle technischen Unterlagen und Datenblätter Ihrer geplanten Anlage fristgerecht beim Netzbetreiber ein.</li>
                            <li><strong>Registrierung im Marktstammdatenregister (MaStR):</strong> Jede Energieerzeugungsanlage in Deutschland muss bei der Bundesnetzagentur registriert werden. Wir erledigen das für Sie.</li>
                            <li><strong>Inbetriebnahmeprotokoll (E.8):</strong> Nach der Installation führt unser zertifizierter Elektromeister die Inbetriebnahme durch und erstellt das rechtlich erforderliche Protokoll für den Netzbetreiber.</li>
                            <li><strong>Anmeldung zur Direktvermarktung:</strong> Bei Anlagen über 100 kWp kümmern wir uns um die Auswahl des passenden Direktvermarkters und die technische Anbindung.</li>
                        </ol>

                        <div className="info-card info-card-tip">
                            <div className="info-card-icon-wrapper"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
                            <div>
                                <h4>Ihr Vorteil: Ein Ansprechpartner</h4>
                                <p>Sie müssen sich nicht mit Netzbetreibern, Behörden und Direktvermarktern auseinandersetzen. Wir sind Ihr zentraler Ansprechpartner, der den gesamten administrativen Prozess für Sie steuert und überwacht.</p>
                            </div>
                        </div>

                        <div className="text-center mt-16">
                            <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                Jetzt Projekt starten
                            </button>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
};

export default ServiceAnmeldungPVPage;
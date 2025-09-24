import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import { services } from '../data/services';

interface ServicePhotovoltaikPageProps {
  setPage: (page: Page) => void;
  currentPage: Page;
  bannerHeight: number;
  headerHeight: number;
}

const benefits = [
    { title: 'Kosten senken', description: 'Produzieren Sie Ihren eigenen Strom zu einem Bruchteil der Netzkosten und machen Sie sich unabhängig von Preissteigerungen.', icon: 'cost' },
    { title: 'Einnahmen generieren', description: 'Speisen Sie überschüssigen Strom ins Netz ein und profitieren Sie von der EEG-Vergütung oder Direktvermarktung.', icon: 'revenue' },
    { title: 'Nachhaltiges Image', description: 'Zeigen Sie Engagement für den Klimaschutz und stärken Sie Ihr Markenimage bei Kunden und Partnern.', icon: 'image' },
    { title: 'Wertsteigerung', description: 'Eine moderne PV-Anlage steigert den Wert Ihrer Gewerbeimmobilie nachhaltig.', icon: 'value' },
];

const Icon: React.FC<{ name: string }> = ({ name }) => {
    const className = 'w-10 h-10 text-white';
    switch(name) {
        case 'cost': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'revenue': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;
        case 'image': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.002-.018.005-.004.001-.002.001-.001.001A49.954 49.954 0 0112 13.486a49.954 49.954 0 018.232-3.339l-.001-.001-.002-.001-.004-.001-.018-.005-.07-.002m-15.482 0l-2.658-.814" /></svg>;
        case 'value': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
    }
    return null;
};

const PhotovoltaikHero: React.FC = () => {
    return (
        <section className="photovoltaik-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left relative z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter">
                            Photovoltaik für Gewerbe
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                           Verwandeln Sie ungenutzte Flächen in hochrentable Solarkraftwerke und sichern Sie sich langfristig stabile Erträge.
                        </p>
                    </div>
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1599454100913-b903e12a4459?q=80&w=800&auto=format&fit=crop" alt="Dachanlage" className="floating-hero-img photovoltaik-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=800&auto=format&fit=crop" alt="Freiflächenanlage" className="floating-hero-img photovoltaik-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1666209593430-349f7a778b7b?q=80&w=800&auto=format&fit=crop" alt="Solar Carport" className="floating-hero-img photovoltaik-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ServicePhotovoltaikPage: React.FC<ServicePhotovoltaikPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
    const openChatWithContext = () => {
        const service = services.find(s => s.id === 'solar-dach-gewerbe');
        if (service) {
            document.dispatchEvent(new CustomEvent('start-chat-with-service', { detail: service }));
        }
    };
    
    const navItems = [
      { id: 'service-photovoltaik', title: 'Photovoltaik Gewerbe', page: 'service-photovoltaik' as Page },
      { id: 'service-ladeparks', title: 'Ladeparks & E-Mobilität', page: 'service-ladeparks' as Page },
      { id: 'service-speicher', title: 'Industrielle Speicher', page: 'service-speicher' as Page },
    ];
    
    return (
        <div className="bg-slate-50">
            <div style={{ paddingTop: `${bannerHeight + headerHeight}px` }}>
                <PhotovoltaikHero />
            </div>
            <SubHeader
                navItems={navItems}
                activeItemId={currentPage}
                // FIX: Cast page to Page type to match setPage function signature.
                onItemClick={(id, page) => setPage(page as Page)}
                bannerHeight={bannerHeight}
                headerHeight={headerHeight}
            />
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <main className="max-w-4xl mx-auto space-y-16">
                        {/* Intro */}
                        <section className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Machen Sie Ihre Flächen zu Geld.</h2>
                            <p className="text-lg text-slate-600 mt-4">
                                Ungenutzte Dach- und Freiflächen sind totes Kapital. Wir verwandeln sie in hochrentable Solarkraftwerke. Senken Sie Ihre Betriebskosten, sichern Sie sich gegen steigende Strompreise ab und generieren Sie eine stabile, zusätzliche Einnahmequelle – bei einer Amortisationszeit von oft nur 6-10 Jahren.
                            </p>
                        </section>

                        {/* Benefits Section */}
                        <section className="bg-slate-800 text-white p-12 rounded-lg shadow-lg">
                             <h2 className="text-3xl font-bold mb-8 text-center">Ihre Vorteile auf einen Blick</h2>
                             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {benefits.map(benefit => (
                                    <div key={benefit.title} className="text-center">
                                        <div className="inline-block bg-green-500/20 p-4 rounded-full mb-4">
                                            <Icon name={benefit.icon} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                                        <p className="text-slate-300 mt-2 text-sm">{benefit.description}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* Solutions Section */}
                        <section>
                            <div className="grid md:grid-cols-2 gap-10 items-center">
                                <img src="https://images.unsplash.com/photo-1558221639-130a584346a8?q=80&w=2070&auto=format&fit=crop" alt="Verschiedene Anlagentypen" loading="lazy" decoding="async" className="rounded-lg shadow-xl w-full object-cover aspect-video" />
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">Lösungen für jede Fläche</h2>
                                    <p className="text-slate-600 mt-4">Ob Flachdach, Schrägdach oder ungenutztes Land – wir entwickeln das passende Konzept:</p>
                                    <ul className="mt-4 space-y-3">
                                        <li className="flex items-start"><svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg><span><strong>Aufdachanlagen:</strong> Der Klassiker für Industrie- und Logistikhallen.</span></li>
                                        <li className="flex items-start"><svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg><span><strong>Solar-Carports:</strong> Parkplätze doppelt nutzen – Schatten spenden und Strom erzeugen.</span></li>
                                        <li className="flex items-start"><svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg><span><strong>Freiflächenanlagen:</strong> Konversions- und Grenzertragsflächen in profitable Solarparks verwandeln.</span></li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                        
                        {/* Intelligent Funnel CTA */}
                        <section className="text-center pt-12 border-t border-slate-200">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Starten Sie Ihre intelligente Bedarfsanalyse</h2>
                            <p className="text-lg text-slate-600 my-4 max-w-3xl mx-auto">
                                Unser KI-Assistent stellt Ihnen einige gezielte Fragen zu Ihrem Gewerbe, um die perfekte Lösung für Sie zu finden. Unverbindlich und in nur 2 Minuten.
                            </p>
                            <button onClick={openChatWithContext} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                KI-Analyse starten
                            </button>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ServicePhotovoltaikPage;
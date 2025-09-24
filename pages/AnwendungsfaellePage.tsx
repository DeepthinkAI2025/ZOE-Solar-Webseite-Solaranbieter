import React from 'react';
import { useCasesData, UseCase } from '../data/useCases';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';

interface AnwendungsfaellePageProps {
    onSelectAnwendungsfall: (slug: string) => void;
    bannerHeight: number;
    headerHeight: number;
}

const AnwendungsfaelleHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="anwendungsfaelle-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                            Lösungen für Ihre Branche.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Entdecken Sie, wie ZOE Solar maßgeschneiderte Energielösungen für Logistik, Handel, Landwirtschaft und Immobilienwirtschaft realisiert und echten Mehrwert schafft.
                        </p>
                        <div className="mt-8 text-left animate-slide-in-up" style={{ animationDelay: '0.7s' }}>
                            <p className="font-semibold text-green-700 uppercase tracking-wider text-sm mb-3">Unsere Kernkompetenz:</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-700">
                                <span className="font-semibold flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    Spezialisiert auf Großanlagen
                                </span>
                                <span className="font-semibold flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    Führend bei Agri-PV Freiflächenanlagen
                                </span>
                            </div>
                        </div>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('anwendungsfaelle-liste')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Alle Branchenlösungen ansehen
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <a onClick={() => onCtaClick('anwendungsfaelle-liste')} className="floating-hero-img anwendungsfaelle-hero img-1 cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1587293852726-70cdb122126a?q=80&w=800&auto=format&fit=crop" alt="Logistik & Industrie" className="w-full h-full object-cover" />
                                <div className="floating-hero-img-label">Logistik & Industrie</div>
                            </a>
                             <a onClick={() => onCtaClick('anwendungsfaelle-liste')} className="floating-hero-img anwendungsfaelle-hero img-2 cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=800&auto=format&fit=crop" alt="Agri-PV & Landwirtschaft" className="w-full h-full object-cover" />
                                <div className="floating-hero-img-label">Agri-PV & Landwirtschaft</div>
                            </a>
                             <a onClick={() => onCtaClick('anwendungsfaelle-liste')} className="floating-hero-img anwendungsfaelle-hero img-3 cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1528698827591-e19ccd7e23ec?q=80&w=800&auto=format&fit=crop" alt="Handel" className="w-full h-full object-cover" />
                                <div className="floating-hero-img-label">Handel</div>
                            </a>
                             <a onClick={() => onCtaClick('anwendungsfaelle-liste')} className="floating-hero-img anwendungsfaelle-hero img-4 cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" alt="Immobilienwirtschaft" className="w-full h-full object-cover" />
                                <div className="floating-hero-img-label">Immobilienwirtschaft</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const UseCaseCard: React.FC<{ useCase: UseCase, onSelect: () => void }> = ({ useCase, onSelect }) => (
    <div onClick={onSelect} className="group bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col cursor-pointer hover:shadow-2xl hover:border-green-300 h-full">
        <div className="overflow-hidden relative">
            <img
                src={useCase.imageUrl}
                alt={useCase.title}
                loading="lazy"
                decoding="async"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors duration-300">{useCase.title}</h2>
            <h3 className="text-lg font-semibold text-green-700 mb-3">{useCase.headline}</h3>
            <p className="text-slate-600 text-sm mb-4 flex-grow">{useCase.description}</p>
            <div className="self-start font-bold text-green-600 group-hover:text-green-700 transition-colors mt-auto">
                Details ansehen <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </div>
        </div>
    </div>
);

const LegacySection: React.FC = () => {
    const openChat = () => {
        const detail = {
            type: 'contextual_help',
            context: 'Der Kunde interessiert sich dafür, wie er die Zukunft seines Hofes/Betriebes für die nächste Generation sichern kann.',
            source: 'Anwendungsfälle - Sektion Generationen'
        };
        document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail }));
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-200 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                        <p className="font-bold text-green-600 uppercase tracking-wider">IHR ERBE. IHRE ZUKUNFT.</p>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Eine Entscheidung für Generationen.</h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Sie haben Ihren Hof oder Betrieb mit harter Arbeit aufgebaut. Doch was schützt Ihr Lebenswerk vor den unsicheren Energiekosten von morgen? Wie sichern Sie den Wohlstand für die nächste Generation ab, wenn die Rahmenbedingungen immer unvorhersehbarer werden?
                        </p>
                        <p className="text-slate-600 mt-4">
                            Eine Solaranlage von ZOE Solar ist mehr als nur eine Investition. Es ist ein wetterfestes Zweiteinkommen und ein Versprechen an Ihre Kinder und Enkel: Ein Hof, der sich selbst versorgt. Ein Betrieb, der auf einem soliden, unabhängigen Fundament steht.
                        </p>
                         <button onClick={openChat} className="mt-8 bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow transform hover:-translate-y-1">
                            Zukunft des Betriebs sichern
                        </button>
                    </div>
                    <div className="order-1 lg:order-2">
                         <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1580252459873-2167d65f1373?q=80&w=1200&auto=format&fit=crop" 
                                alt="Drei Generationen einer Bauernfamilie auf einem Feld" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="text-2xl font-bold [text-shadow:_1px_1px_4px_rgb(0_0_0_/_60%)]">"Wir schaffen Werte, die bleiben."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


const AnwendungsfaellePage: React.FC<AnwendungsfaellePageProps> = ({ onSelectAnwendungsfall, bannerHeight, headerHeight }) => {
    
    const handleHeroCta = (anchor?: string) => {
      if (anchor) {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    const navItems = [
        { id: 'alle', title: 'Alle Anwendungsfälle', page: 'anwendungsfaelle' as Page },
        ...useCasesData.map(uc => ({
            id: uc.id,
            title: uc.title,
            page: 'anwendungsfall-detail' as Page,
        }))
    ];

    const handleSubNavClick = (id: string) => {
        if (id === 'alle') {
             const heroElement = document.querySelector('.anwendungsfaelle-hero');
            if (heroElement) {
                heroElement.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            onSelectAnwendungsfall(id);
        }
    };
    
    return (
        <>
            <div style={{ paddingTop: `${bannerHeight + headerHeight}px` }}>
                <AnwendungsfaelleHero onCtaClick={handleHeroCta} />
            </div>

            <SubHeader
                navItems={navItems}
                activeItemId={'alle'}
                onItemClick={(id) => handleSubNavClick(id)}
                bannerHeight={bannerHeight}
                headerHeight={headerHeight}
            />

            <div id="anwendungsfaelle-liste" className="py-20 bg-slate-50 scroll-mt-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {useCasesData.map((useCase) => (
                            <UseCaseCard 
                                key={useCase.id} 
                                useCase={useCase}
                                onSelect={() => onSelectAnwendungsfall(useCase.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            <LegacySection />
        </>
    );
};

export default AnwendungsfaellePage;

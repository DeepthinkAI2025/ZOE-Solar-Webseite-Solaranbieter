import React from 'react';
import { Page } from '../types';
import { innovations, TechSpec } from '../data/innovations';
import InnovationsSlider from '../components/InnovationsSlider';

interface InnovationsPageProps {
  setPage: (page: Page) => void;
}

const InnovationsHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="innovations-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Zukunftstechnologien.
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Heute schon erleben.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Entdecken Sie wegweisende Solarlösungen, die Ästhetik, Effizienz und neue Anwendungsbereiche vereinen und die Grenzen des Möglichen neu definieren.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('innovations-list')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Alle Innovationen entdecken
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src={innovations[2].imageUrl} alt={innovations[2].title} className="floating-hero-img innovations-hero glowing-img img-1" />
                            <img src={innovations[1].imageUrl} alt={innovations[1].title} className="floating-hero-img innovations-hero img-2" />
                            <img src={innovations[0].imageUrl} alt={innovations[0].title} className="floating-hero-img innovations-hero glowing-img img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const TechSpecIcon: React.FC<{ icon: TechSpec['icon'] }> = ({ icon }) => {
    const className = "w-8 h-8 text-green-600";
    const icons = {
        'yield': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
        'design': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 01-3.388-1.62m-5.043-.025a15.998 15.998 0 01-1.622-3.385m-3.388 1.62A15.998 15.998 0 015.96 5.043m-3.388 1.622a15.998 15.998 0 01-1.622 3.385m3.388-1.622a15.998 15.998 0 00-1.622 3.385m5.043.025a15.998 15.998 0 01-3.388 1.622m3.388-1.622a15.998 15.998 0 003.388 1.622m-5.043.025a15.998 15.998 0 011.622 3.385" /></svg>,
        'dual-use': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" /></svg>
    };
    return icons[icon] || null;
};

const InnovationsPage: React.FC<InnovationsPageProps> = ({ setPage }) => {
    
    const openChat = (innovationId: string) => {
        document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail: innovationId }));
    };

     const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white">
            <InnovationsHero onCtaClick={handleHeroCta} />
            <InnovationsSlider />
            <div id="innovations-list" className="container mx-auto px-6 py-20 space-y-24 scroll-mt-24">
                {innovations.map((item, index) => (
                    <section key={item.id} className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className={` ${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                            <p className="font-bold text-green-600 uppercase tracking-wider">{item.category}</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 my-4">{item.title}</h2>
                            <p className="text-lg text-slate-600 mb-6">{item.description}</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                {item.techSpecs.map(spec => (
                                    <div key={spec.label} className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200">
                                        <div className="flex justify-center mb-2"><TechSpecIcon icon={spec.icon} /></div>
                                        <p className="text-sm font-semibold text-slate-700">{spec.label}</p>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => openChat(item.id)} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md transform hover:-translate-y-0.5">
                                {item.callToAction}
                            </button>
                        </div>
                         <div className={`relative ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                             <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                loading="lazy"
                                decoding="async"
                                className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-square"
                            />
                            <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-xl max-w-xs border border-slate-200">
                                <p className="text-lg font-bold text-slate-800">{item.tagline}</p>
                            </div>
                        </div>
                    </section>
                ))}
            </div>

             {/* CTA Section */}
            <section className="bg-slate-50 mt-24">
                <div className="container mx-auto px-6 py-20">
                    <div className="bg-slate-800 rounded-lg text-white p-12 text-center shadow-2xl max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Haben Sie eine eigene Vision?</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">
                           Die Möglichkeiten der gebäudeintegrierten Photovoltaik sind grenzenlos. Sprechen Sie mit unseren Ingenieuren über Ihr individuelles Projekt.
                        </p>
                         <button onClick={() => openChat('custom_innovation')} className="bg-green-500 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-xl transform hover:-translate-y-1">
                            Individuelles Projekt anfragen
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InnovationsPage;
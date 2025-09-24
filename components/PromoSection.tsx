import React, { useState } from 'react';
import { offersData } from '../data/offers';

const PromoSection: React.FC = () => {
    const [activeType, setActiveType] = useState<'commercial' | 'private'>('commercial');

    const commercialOffer = offersData.find(o => o.customerType === 'commercial' && o.isFeatured);
    const privateOffer = offersData.find(o => o.customerType === 'private');

    if (!commercialOffer || !privateOffer) return null;

    const activeOffer = activeType === 'commercial' ? commercialOffer : privateOffer;

    const handleLinkClick = () => {
        const event = new CustomEvent('set-page', { detail: 'sonderaktionen' });
        document.dispatchEvent(event);
    };

    return (
        <section id="promo-section" className="py-20 bg-slate-800 text-white">
            <div className="container mx-auto px-6">
                
                {/* Customer Type Switcher */}
                <div className="flex justify-center bg-slate-700/50 p-1.5 rounded-full max-w-sm mx-auto mb-12">
                    <button onClick={() => setActiveType('commercial')} className={`w-1/2 py-3 rounded-full font-bold transition-all duration-300 ${activeType === 'commercial' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-300'}`}>
                        Für Gewerbe
                    </button>
                    <button onClick={() => setActiveType('private')} className={`w-1/2 py-3 rounded-full font-bold transition-all duration-300 ${activeType === 'private' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-300'}`}>
                        Für Privat
                    </button>
                </div>

                <div key={activeType} className="grid lg:grid-cols-2 gap-12 items-center bg-slate-900/50 rounded-2xl p-8 md:p-12 border border-slate-700 animate-fade-in">
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <p className="font-bold text-green-400 uppercase tracking-wider">Sonderaktion</p>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2 leading-tight">{activeOffer.title}</h2>
                        <p className="text-xl text-slate-300 mt-4">{activeOffer.subtitle}</p>
                        <p className="text-slate-300 mt-6 max-w-xl mx-auto lg:mx-0">{activeOffer.description}</p>
                        
                         <button onClick={handleLinkClick} className="mt-8 bg-green-500 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1 cursor-pointer">
                           Mehr erfahren & Bonus sichern
                        </button>
                        <p className="text-xs text-slate-400 mt-3">Gültig bis {activeOffer.validUntil}</p>
                    </div>
                    <div className="order-1 lg:order-2">
                         <img 
                            src={activeOffer.imageUrl} 
                            alt={activeOffer.title} 
                            className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-square"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromoSection;
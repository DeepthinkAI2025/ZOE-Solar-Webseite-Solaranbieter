import React, { useState, useMemo } from 'react';
import { offersData } from '../data/offers';
import OfferCard from '../components/OfferCard';
import { Page } from '../types';

const SonderaktionenHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="sonderaktionen-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Exklusive Aktionen.
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-yellow-500 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Jetzt Vorteile sichern.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Profitieren Sie von unseren zeitlich begrenzten Sonderaktionen und sichern Sie sich attraktive Vorteile für Ihr Solarprojekt. Schnell sein lohnt sich!
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('angebote')} className="w-full sm:w-auto bg-yellow-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-600 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Zu den Angeboten
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1579103800244-07a889c37a5b?q=80&w=800&auto=format&fit=crop" alt="Geschenk" className="floating-hero-img sonderaktionen-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1620714223084-86c6df3855cb?q=80&w=800&auto=format&fit=crop" alt="Rabatt" className="floating-hero-img sonderaktionen-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1512910828796-6d63c5a72a7c?q=80&w=800&auto=format&fit=crop" alt="Kalender" className="floating-hero-img sonderaktionen-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SonderaktionenPage: React.FC = () => {
    const [activeType, setActiveType] = useState<'private' | 'commercial'>('commercial');
    
    const activeOffers = useMemo(() => {
        return offersData.filter(offer => 
            offer.status === 'active' && 
            (offer.customerType === activeType || offer.customerType === 'all')
        );
    }, [activeType]);

    const expiredOffers = useMemo(() => {
        return offersData.filter(offer => 
            offer.status === 'expired' &&
            (offer.customerType === activeType || offer.customerType === 'all')
        );
    }, [activeType]);

    const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-slate-50">
            <SonderaktionenHero onCtaClick={handleHeroCta} />
            <section id="angebote" className="py-20 scroll-mt-24">
                <div className="container mx-auto px-6 space-y-20">
                    <div>
                        <div className="flex justify-center bg-slate-200 p-1.5 rounded-full max-w-sm mx-auto mb-12">
                            <button onClick={() => setActiveType('commercial')} className={`w-1/2 py-3 rounded-full font-bold transition-colors ${activeType === 'commercial' ? 'bg-white text-green-700 shadow-md' : 'text-slate-600'}`}>Für Gewerbekunden</button>
                            <button onClick={() => setActiveType('private')} className={`w-1/2 py-3 rounded-full font-bold transition-colors ${activeType === 'private' ? 'bg-white text-green-700 shadow-md' : 'text-slate-600'}`}>Für Privatkunden</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            {activeOffers.map(offer => (
                                <OfferCard key={offer.id} offer={offer} />
                            ))}
                        </div>
                    </div>
                    
                    {expiredOffers.length > 0 && (
                        <div>
                            <div className="text-center mb-12 border-t border-slate-300 pt-16">
                                <h2 className="text-3xl font-bold text-slate-800">Verpasste Aktionen</h2>
                                <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
                                    Hier sehen Sie einige unserer vergangenen Angebote. Seien Sie schnell, unsere Aktionen sind oft zeitlich begrenzt!
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                                {expiredOffers.map(offer => (
                                    <OfferCard key={offer.id} offer={offer} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SonderaktionenPage;
import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface ExitIntentPopupProps {
  setPage: (page: Page) => void;
}

const BenefitIcon: React.FC<{ type: 'costs' | 'value' | 'independence' }> = ({ type }) => {
    const className = "w-7 h-7 text-green-600";
    const icons = {
        'costs': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>,
        'value': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
        'independence': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    };
    return icons[type] || null;
};

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ setPage }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseOut = (e: MouseEvent) => {
            if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShown')) {
                setIsVisible(true);
                sessionStorage.setItem('exitIntentShown', 'true');
            }
        };

        document.addEventListener('mouseout', handleMouseOut);
        return () => document.removeEventListener('mouseout', handleMouseOut);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };
    
    const handleCtaClick = () => {
        document.dispatchEvent(new CustomEvent('open-chat'));
        handleClose();
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="exit-popup-title">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
            <div className="relative z-10 w-full max-w-4xl bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl overflow-hidden transform animate-slide-in-up">
                <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors z-20" aria-label="Schließen">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="grid md:grid-cols-2">
                    {/* Left Column: Content */}
                    <div className="p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
                        <h2 id="exit-popup-title" className="text-3xl lg:text-4xl font-extrabold text-slate-800">
                            Stop! Verwandeln Sie Ihre Kosten in <span className="text-green-600">Gewinn.</span>
                        </h2>
                        <p className="text-slate-600 my-6 text-lg">
                            Ein Klick auf 'Schließen' ändert nichts. Ein Klick auf 'Analyse starten' könnte Ihnen <strong className="text-slate-800">jedes Jahr tausende Euro sparen</strong>.
                        </p>
                        
                        <div className="space-y-4 text-left mb-8">
                            <div className="flex items-center gap-4"><div className="bg-green-100 p-2 rounded-full"><BenefitIcon type="costs" /></div><span className="font-semibold text-slate-700">Energiekosten drastisch senken</span></div>
                            <div className="flex items-center gap-4"><div className="bg-green-100 p-2 rounded-full"><BenefitIcon type="value" /></div><span className="font-semibold text-slate-700">Immobilienwert nachhaltig steigern</span></div>
                            <div className="flex items-center gap-4"><div className="bg-green-100 p-2 rounded-full"><BenefitIcon type="independence" /></div><span className="font-semibold text-slate-700">Unabhängig von Strompreisen werden</span></div>
                        </div>

                        <button onClick={handleCtaClick} className="w-full bg-green-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow text-lg">
                            Kostenlose Analyse starten (in 60 Sek.)
                        </button>
                        <button onClick={handleClose} className="mt-4 text-sm text-slate-500 hover:text-slate-800 hover:underline">
                            Vielleicht später
                        </button>
                    </div>
                    {/* Right Column: Image */}
                    <div className="hidden md:block relative">
                         <img
                            src="https://images.unsplash.com/photo-1599056228640-3275f63f5367?q=80&w=800&auto=format&fit=crop"
                            alt="Wachstum und Ersparnis durch Solarenergie"
                            className="w-full h-full object-cover"
                        />
                         <div className="absolute inset-0 bg-gradient-to-l from-white/10 via-white/5 to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExitIntentPopup;

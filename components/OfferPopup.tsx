import React, { useState, useEffect } from 'react';
import { offersData } from '../data/offers';

const OfferPopup: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const popupOffer = offersData.find(o => !o.isFeatured) || offersData[0];

    useEffect(() => {
        if (sessionStorage.getItem('offerPopupShown')) {
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(true);
            sessionStorage.setItem('offerPopupShown', 'true');
        }, 10000); // Show after 10 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleCtaClick = () => {
        document.dispatchEvent(new CustomEvent('start-new-chat-promo'));
        handleClose();
    };

    if (!isVisible || !popupOffer) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="offer-popup-title">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>
            <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform animate-slide-in-up">
                 <button onClick={handleClose} className="absolute top-3 right-3 p-1 text-slate-500 hover:text-slate-800 z-10" aria-label="Schließen">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="grid md:grid-cols-2">
                    <div className="p-8 flex flex-col justify-center">
                        <span className="font-bold text-green-600 uppercase tracking-wide">Exklusives Angebot</span>
                        <h2 id="offer-popup-title" className="text-3xl font-bold text-slate-800 my-2">{popupOffer.title}</h2>
                        <p className="text-slate-600 mb-6 text-sm">{popupOffer.description}</p>
                        <button onClick={handleCtaClick} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors shadow-md">
                            {popupOffer.ctaText}
                        </button>
                    </div>
                    <div className="hidden md:block">
                        <img
                            src={popupOffer.imageUrl}
                            alt="Solar panels"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferPopup;
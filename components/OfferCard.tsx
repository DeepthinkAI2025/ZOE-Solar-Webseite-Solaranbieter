import React from 'react';
import { Offer } from '../data/offers';
import { Page } from '../types';

interface OfferCardProps {
  offer: Offer;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
    const isExpired = offer.status === 'expired';

    const handleCtaClick = () => {
        if (isExpired) return;

        if (offer.ctaPage) {
            const event = new CustomEvent('set-page', { detail: offer.ctaPage as Page });
            document.dispatchEvent(event);
        } else {
             const detail = {
                type: 'promo_inquiry',
                promoDetails: {
                    title: offer.title,
                    subtitle: offer.subtitle,
                }
            };
            document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail }));
        }
    };

    return (
        <div className={`bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-300 ${isExpired ? 'grayscale opacity-60' : ''} ${offer.isFeatured ? 'border-green-500 border-2' : 'border-slate-200'}`}>
            <div className="relative">
                <img src={offer.imageUrl} alt={offer.title} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-3xl font-bold text-white shadow-text">{offer.title}</h2>
                    <p className={`${isExpired ? 'text-slate-300' : 'text-green-300'} font-semibold text-lg shadow-text`}>{offer.subtitle}</p>
                </div>
            </div>
            <div className="p-8 flex flex-col flex-grow">
                <p className="text-slate-600 mb-6 flex-grow">{offer.description}</p>
                
                <div className="mb-6">
                    <h4 className="font-bold text-slate-700 mb-3">Konditionen:</h4>
                    <ul className="space-y-2">
                        {offer.conditions.map((condition, index) => (
                            <li key={index} className="flex items-start text-sm">
                                <svg className={`w-5 h-5 ${isExpired ? 'text-slate-400' : 'text-green-500'} mr-2 flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-slate-600">{condition}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-200 text-center">
                     <button 
                        onClick={handleCtaClick} 
                        disabled={isExpired}
                        className={`w-full font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg  
                            ${isExpired 
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700 cta-button-glow transform hover:-translate-y-1'}`
                        }
                    >
                        {offer.ctaText}
                    </button>
                    <p className={`text-xs mt-3 ${isExpired ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
                        {isExpired ? `Abgelaufen am ${offer.validUntil}` : `Gültig bis ${offer.validUntil}`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OfferCard;
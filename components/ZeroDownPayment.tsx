import React from 'react';
import { Page } from '../types';

interface ZeroDownPaymentProps {
    setPage: (page: Page) => void;
}

const ZeroDownPayment: React.FC<ZeroDownPaymentProps> = ({ setPage }) => {

    const handleLinkClick = () => {
        setPage('finanzierung');
    };

    return (
        <section id="zero-down-payment" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-200 shadow-xl grid lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                        <p className="font-bold text-green-600 uppercase tracking-wider">Finanzierung leicht gemacht</p>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Ihre Solaranlage für 0€ Anzahlung.</h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Starten Sie Ihre Energiewende ohne Eigenkapital. Dank unserer intelligenten Finanzierungslösungen und attraktiver Förderkredite ist Ihre monatliche Ersparnis oft höher als die Rate – Sie profitieren vom ersten Tag an.
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Liquidität schonen</h4>
                                    <p className="text-slate-500 text-sm">Kein Einsatz von Eigenkapital notwendig.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Sofortiger Gewinn</h4>
                                    <p className="text-slate-500 text-sm">Die Einsparungen übersteigen die monatliche Rate.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Alles aus einer Hand</h4>
                                    <p className="text-slate-500 text-sm">Wir kümmern uns um die komplette Kreditabwicklung.</p>
                                </div>
                            </div>
                        </div>
                         <button onClick={handleLinkClick} className="mt-8 bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow transform hover:-translate-y-1">
                            Mehr zur 0€ Anzahlung
                        </button>
                    </div>
                    <div className="order-1 lg:order-2">
                        <img 
                            src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop" 
                            alt="Sparschwein mit wachsender Pflanze" 
                            className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-square"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ZeroDownPayment;
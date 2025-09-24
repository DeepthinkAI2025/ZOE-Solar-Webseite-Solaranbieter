import React from 'react';
import { Page } from '../types';

interface AgriPVBenefitsProps {
    setPage: (page: Page) => void;
}

const BenefitIcon: React.FC<{ name: string }> = ({ name }) => {
    const className = "h-8 w-8 text-green-600";
    const strokeWidth = 1.5;
    const icons: { [key: string]: React.ReactNode } = {
        'dual-use': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" /></svg>,
        'weather': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        'revenue': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
    };
    return icons[name] || null;
};

const AgriPVBenefits: React.FC<AgriPVBenefitsProps> = ({ setPage }) => {
    return (
        <section id="agri-pv-benefits" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="bg-green-50/50 rounded-2xl p-8 md:p-12 border border-green-200 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="order-2 lg:order-1">
                        <p className="font-bold text-green-600 uppercase tracking-wider">Speziell für Landwirte</p>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Agri-PV: Die doppelte Ernte.</h2>
                        <p className="text-lg text-slate-600 mt-4">
                           Maximieren Sie den Wert Ihres Landes. Schützen Sie Ihre Ernte vor Wetterextremen, senken Sie Ihre Betriebskosten und sichern Sie sich ein wetterfestes Zweiteinkommen durch den Verkauf von sauberem Strom.
                        </p>
                        <div className="mt-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 bg-white p-3 rounded-full border border-slate-200 shadow-sm"><BenefitIcon name="dual-use" /></div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Duale Flächennutzung</h4>
                                    <p className="text-slate-500 text-sm">Kombinieren Sie Ackerbau und Energieerzeugung. Kein Flächenverlust, doppelter Ertrag.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                               <div className="flex-shrink-0 bg-white p-3 rounded-full border border-slate-200 shadow-sm"><BenefitIcon name="weather" /></div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Ernteschutz & Wassereinsparung</h4>
                                    <p className="text-slate-500 text-sm">Die Module schützen empfindliche Kulturen vor Hagel und Sonnenbrand und reduzieren die Wasserverdunstung.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                               <div className="flex-shrink-0 bg-white p-3 rounded-full border border-slate-200 shadow-sm"><BenefitIcon name="revenue" /></div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">Stabile Einnahmequelle</h4>
                                    <p className="text-slate-500 text-sm">Erwirtschaften Sie planbare Erträge durch den Stromverkauf – unabhängig von Ernteerfolgen und Marktpreisen.</p>
                                </div>
                            </div>
                        </div>
                         <button onClick={() => setPage('agri-pv')} className="mt-8 bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow transform hover:-translate-y-1">
                            Mehr über Agri-PV erfahren
                        </button>
                    </div>
                    <div className="order-1 lg:order-2">
                        <img 
                            src="https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=2070&auto=format&fit=crop"
                            alt="Agri-PV Anlage schützt Pflanzen" 
                            className="rounded-xl shadow-2xl w-full h-auto object-cover aspect-square"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AgriPVBenefits;
import React, { useState } from 'react';
import { Page } from '../types';
import ImageWithFallback from '../components/ImageWithFallback';

const EmpfehlungspraemieHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="empfehlung-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Empfehlen &
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Prämie sichern.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Gute Kontakte zahlen sich aus. Erhalten Sie bis zu 500 € Prämie für jede erfolgreiche Empfehlung. Teilen Sie Ihre positiven Erfahrungen mit ZOE Solar und profitieren Sie direkt vom Erfolg.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('empfehlung-formular')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Jetzt empfehlen
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="polaroid-stack">
                            <a onClick={() => onCtaClick('empfehlung-formular')} className="polaroid polaroid-1 cursor-pointer">
                                <ImageWithFallback src="https://images.unsplash.com/photo-1630571101344-15a05f17a950?q=80&w=800&auto=format&fit=crop" alt="Empfehlung" className="w-full h-full object-cover" imgWidth={220} imgHeight={180}/>
                            </a>
                            <a onClick={() => onCtaClick('empfehlung-formular')} className="polaroid polaroid-2 cursor-pointer">
                                <ImageWithFallback src="https://images.unsplash.com/photo-1556742518-a6e5b402c6a2?q=80&w=800&auto=format&fit=crop" alt="Partnerschaft" className="w-full h-full object-cover" imgWidth={250} imgHeight={210}/>
                            </a>
                            <a onClick={() => onCtaClick('empfehlung-formular')} className="polaroid polaroid-3 cursor-pointer">
                                <ImageWithFallback src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop" alt="Prämie" className="w-full h-full object-cover" imgWidth={200} imgHeight={160}/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const EmpfehlungspraemiePage: React.FC = () => {
    const [formData, setFormData] = useState({
        referrerName: '',
        referrerEmail: '',
        refereeName: '',
        refereeCompany: '',
        refereeContact: '',
        dataPrivacy: false,
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.dataPrivacy) {
            alert('Bitte stimmen Sie der Datenschutzerklärung zu.');
            return;
        }
        setStatus('loading');
        // Simulate API call
        setTimeout(() => {
            console.log('Referral Submitted:', formData);
            setStatus('success');
        }, 1500);
    };
    
    const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const inputClasses = "w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm";

    return (
        <div className="bg-slate-50">
            <EmpfehlungspraemieHero onCtaClick={handleHeroCta} />
            <div className="py-20">
                <div className="container mx-auto px-6">

                    {/* How it works Section */}
                    <section className="max-w-4xl mx-auto text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">So einfach verdienen Sie mit uns</h2>
                        <p className="text-lg text-slate-600 mt-4">
                            Gute Kontakte sind wertvoll. Teilen Sie Ihre positiven Erfahrungen mit ZOE Solar und profitieren Sie direkt vom Erfolg.
                        </p>
                        <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
                            <div className="flex items-start gap-4">
                                <div className="text-3xl font-bold text-green-600 flex-shrink-0">1.</div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Kontakt empfehlen</h3>
                                    <p className="text-slate-600 text-sm">Sie kennen ein Unternehmen mit großen Dach- oder Freiflächen? Füllen Sie einfach unser Formular aus.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="text-3xl font-bold text-green-600 flex-shrink-0">2.</div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Wir übernehmen</h3>
                                    <p className="text-slate-600 text-sm">Unser Team nimmt Kontakt auf und berät Ihren Kontakt professionell und unverbindlich.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="text-3xl font-bold text-green-600 flex-shrink-0">3.</div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Prämie erhalten</h3>
                                    <p className="text-slate-600 text-sm">Führt Ihre Empfehlung zu einem realisierten Projekt, erhalten Sie Ihre Prämie direkt auf Ihr Konto.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Rewards Section */}
                    <section className="bg-green-600 text-white py-16 rounded-2xl mb-20 shadow-xl">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-8">Ihre Prämie nach Projektgröße</h2>
                            <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                                <div className="bg-green-700/50 p-6 rounded-lg border border-green-500">
                                    <p className="text-4xl font-bold text-white">250 €</p>
                                    <p className="text-green-200 mt-1">für Projekte bis 100 kWp</p>
                                </div>
                                <div className="bg-green-700/50 p-6 rounded-lg border-2 border-green-400 scale-105 shadow-2xl">
                                    <p className="text-4xl font-bold text-white">350 €</p>
                                    <p className="text-green-200 mt-1">für Projekte von 100 - 500 kWp</p>
                                </div>
                                <div className="bg-green-700/50 p-6 rounded-lg border border-green-500">
                                    <p className="text-4xl font-bold text-white">500 €</p>
                                    <p className="text-green-200 mt-1">für Projekte über 500 kWp</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Referral Form Section */}
                    <section id="empfehlung-formular" className="max-w-2xl mx-auto scroll-mt-24">
                        <div className="bg-white p-8 md:p-12 rounded-lg shadow-2xl border border-slate-200">
                            {status === 'success' ? (
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-green-800 mb-3">Vielen Dank für Ihre Empfehlung!</h2>
                                    <p className="text-slate-700">Wir werden Ihren Kontakt prüfen und uns bei Ihnen melden, sobald es Neuigkeiten gibt.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Jetzt Empfehlung einreichen</h2>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-slate-700 border-b pb-2 mb-4">Ihre Daten als Tippgeber</h3>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <input type="text" name="referrerName" placeholder="Ihr Name" required onChange={handleChange} className={inputClasses} />
                                                <input type="email" name="referrerEmail" placeholder="Ihre E-Mail" required onChange={handleChange} className={inputClasses} />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-700 border-b pb-2 mb-4">Daten des potenziellen Kunden</h3>
                                            <div className="space-y-4">
                                                <input type="text" name="refereeName" placeholder="Name des Ansprechpartners" required onChange={handleChange} className={inputClasses} />
                                                <input type="text" name="refereeCompany" placeholder="Firma (optional)" onChange={handleChange} className={inputClasses} />
                                                <input type="text" name="refereeContact" placeholder="E-Mail oder Telefon" required onChange={handleChange} className={inputClasses} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input type="checkbox" name="dataPrivacy" checked={formData.dataPrivacy} onChange={handleChange} className="h-5 w-5 mt-0.5 text-green-600 border-slate-300 rounded focus:ring-green-500" />
                                                <span className="text-sm text-slate-600">Ich bestätige, dass ich die Zustimmung meines Kontakts zur Weitergabe der Daten habe und stimme der <a href="#" className="text-green-600 hover:underline">Datenschutzerklärung</a> zu.</span>
                                            </label>
                                        </div>
                                        <button type="submit" disabled={status === 'loading'} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-400">
                                            {status === 'loading' ? 'Wird gesendet...' : 'Empfehlung absenden & Prämie sichern'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default EmpfehlungspraemiePage;

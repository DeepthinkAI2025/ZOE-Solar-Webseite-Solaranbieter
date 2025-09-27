import React from 'react';
import { Page } from '../types';
import ContactForm from '../components/ContactForm';
import AnimatedSection from '../components/AnimatedSection';

const KontaktHero: React.FC = () => {
    return (
        <section className="kontakt-hero bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up hero-headline" style={{ animationDelay: '0.2s' }}>
                            Kontakt aufnehmen.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up hero-pitch" style={{ animationDelay: '0.6s' }}>
                           Wir sind bereit für Ihr Projekt. Lassen Sie uns sprechen, wie wir Ihre Flächen in eine rentable Einnahmequelle verwandeln können.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <button onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow">
                                Anfrage per KI starten
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <div className="floating-hero-img img-1 bg-green-500 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
                            <div className="floating-hero-img img-2 bg-slate-800 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                            <div className="floating-hero-img img-3 bg-white flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


interface KontaktPageProps {
  setPage: (page: Page) => void;
}

const KontaktPage: React.FC<KontaktPageProps> = ({ setPage }) => {
    return (
        <div className="bg-slate-50">
            <KontaktHero />
            <AnimatedSection>
                <div className="py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-5 gap-10 xl:gap-16">
                            {/* Contact Info */}
                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Nehmen Sie Kontakt auf</h2>
                                    <p className="text-slate-600 leading-relaxed">
                                        Wir freuen uns darauf, Sie und Ihren Betrieb kennenzulernen. Lassen Sie uns in einem persönlichen Gespräch herausfinden, wie wir gemeinsam die Zukunft Ihres Unternehmens sichern können. Nutzen Sie das Formular oder erreichen Sie uns direkt.
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-slate-700">ZOE Solar</h3>
                                        <p className="text-slate-600">
                                            Kurfürstenstraße 124<br/>
                                            10785 Berlin
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-700">E-Mail</h3>
                                        <a href="mailto:kundenervice@zukunftsorientierte-energie.de" className="text-green-600 hover:underline">kundenervice@zukunftsorientierte-energie.de</a>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-700">Telefon</h3>
                                        <a href="tel:+4915678876200" className="text-green-600 hover:underline">+49 15678876200</a>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-700">Bürozeiten</h3>
                                        <p className="text-slate-600">
                                            Montag - Freitag<br/>
                                            08:00 - 17:00 Uhr
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form Section */}
                            <div className="lg:col-span-3">
                                <div className="bg-white p-8 md:p-10 rounded-lg shadow-2xl border border-slate-200 form-on-light">
                                    <h2 className="text-2xl font-bold text-green-800 mb-1">Starten Sie jetzt Ihre kostenlose Analyse</h2>
                                    <p className="text-slate-600 mb-6">
                                        Dank Browser-Autofill ist das Formular in Sekunden ausgefüllt. Wir melden uns umgehend bei Ihnen.
                                    </p>
                                    <ContactForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    );
};

export default KontaktPage;
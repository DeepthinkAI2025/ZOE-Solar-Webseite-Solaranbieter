import React from 'react';
import { Page } from '../types';

const DIYHubHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="diyhub-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           DIY-Hub:
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Wir sichern Sie ab.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Sie haben das Know-how für den Eigenbau? Fantastisch! Wir unterstützen Sie bei den entscheidenden, sicherheitsrelevanten Schritten.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('services')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Services buchen
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1621905251918-48415d953472?q=80&w=800&auto=format&fit=crop" alt="Werkzeug" className="floating-hero-img diyhub-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1581092921531-03105f24161a?q=80&w=800&auto=format&fit=crop" alt="Elektronik" className="floating-hero-img diyhub-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1621905252507-b3c04bd9bb0a?q=80&w=800&auto=format&fit=crop" alt="Handwerker" className="floating-hero-img diyhub-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const services = [
    {
        title: "Netzanschluss-Service",
        description: "Wir übernehmen die komplette Bürokratie für Sie. Von der Anmeldung beim Netzbetreiber bis zur finalen Zählersetzung – wir sorgen für einen reibungslosen und vorschriftsmäßigen Netzanschluss Ihrer selbstgebauten Anlage.",
        price: 350,
        priceNote: 'für Anlagen < 30 kWp',
        isFeatured: false,
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3C4.204 3 3 10.193 3 12c0 1.807 1.204 9 9 9s9-7.193 9-9c0-1.807-1.204-9-9-9z" /></svg>,
    },
    {
        title: "Inbetriebnahme & Protokoll",
        description: "Sicherheit geht vor. Unsere zertifizierten Elektriker nehmen Ihre Anlage fachgerecht in Betrieb und erstellen das rechtlich erforderliche Inbetriebnahmeprotokoll nach VDE-Norm (E.8).",
        price: 900,
        priceNote: 'ab',
        isFeatured: false,
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
        title: "Anlagen-Check (E-Check)",
        description: "Lassen Sie Ihre Installation von einem Profi prüfen. Wir führen einen umfassenden E-Check durch und bestätigen die normgerechte Ausführung für Ihre Sicherheit und Versicherung.",
        price: 500,
        priceNote: 'Festpreis',
        isFeatured: false,
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    }
];

const allInOnePackage = {
    title: "Komplettpaket",
    description: "Alle drei Services zum Vorteilspreis. Wir übernehmen den Netzanschluss, die Inbetriebnahme mit Protokoll und den finalen E-Check. Ihr Rundum-Sorglos-Paket für eine sichere und vorschriftsmäßige Anlage.",
    price: 1500,
    priceNote: 'Sie sparen 250 €',
    isFeatured: true,
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
};


const Step: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="flex items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 bg-green-100 text-green-700 text-2xl font-bold rounded-full flex items-center justify-center border-4 border-white shadow-md">
            {number}
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-600">{children}</p>
        </div>
    </div>
);

const DIYHubPage: React.FC = () => {
    const openChat = (service: string, details: string, price: number) => {
        const eventDetail = {
            type: 'direct_purchase',
            service: service,
            details: details,
            price: price,
        };
        document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail: eventDetail }));
    };

    const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white">
            <DIYHubHero onCtaClick={handleHeroCta} />
            {/* Services Section */}
            <section id="services" className="py-20 scroll-mt-24">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900">Sie bauen selbst? Wir sichern Sie ab.</h2>
                        <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                            Sie haben das Know-how und den Willen, Ihre Solaranlage selbst zu errichten? Fantastisch! Wir unterstützen Sie bei den entscheidenden, sicherheitsrelevanten Schritten, die eine professionelle Abnahme erfordern. Buchen Sie unsere Services direkt online.
                        </p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                        
                        {/* Featured Package */}
                        <div className="lg:col-span-1 bg-green-50 p-8 rounded-2xl shadow-2xl border-2 border-green-500 flex flex-col relative transform lg:scale-105">
                             <div className="absolute -top-4 self-center bg-green-600 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-lg">Preis-Leistungs-Sieger</div>
                            <div className="text-center">
                                <div className="inline-block bg-white text-green-600 p-4 rounded-full mb-4 ring-4 ring-green-100">
                                    {allInOnePackage.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">{allInOnePackage.title}</h3>
                            </div>
                            <p className="text-slate-600 flex-grow my-4 text-center">{allInOnePackage.description}</p>
                            <div className="my-6 text-center">
                                <span className="text-5xl font-bold text-slate-900">{allInOnePackage.price.toLocaleString('de-DE')} €</span>
                                <span className="block text-green-700 font-semibold">{allInOnePackage.priceNote}</span>
                            </div>
                            <button 
                                onClick={() => openChat(allInOnePackage.title, 'Alle DIY-Services', allInOnePackage.price)}
                                className="w-full mt-auto bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
                            >
                                Jetzt buchen
                            </button>
                        </div>
                        
                        {/* Standard Services */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {services.map(service => (
                                <div key={service.title} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 flex flex-col">
                                    <div className="text-center">
                                        <div className="inline-block bg-green-100 text-green-600 p-4 rounded-full mb-4">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{service.title}</h3>
                                    </div>
                                    <p className="text-slate-600 flex-grow my-4 text-center text-sm">{service.description}</p>
                                    <div className="my-4 text-center">
                                         <span className="text-3xl font-bold text-slate-900">{service.priceNote === 'ab' ? 'ab ' : ''}{service.price.toLocaleString('de-DE')} €</span>
                                        <span className="block text-slate-500 text-sm">{service.priceNote}</span>
                                    </div>
                                    <button 
                                        onClick={() => openChat(service.title, service.priceNote, service.price)}
                                        className="w-full mt-auto bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors"
                                    >
                                        Jetzt buchen
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works Section */}
             <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                         <div>
                            <img src="https://images.unsplash.com/photo-1556742518-a6e5b402c6a2?q=80&w=2070&auto=format&fit=crop" alt="ZOE Solar Team bei der Arbeit" className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video" />
                        </div>
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-slate-900 leading-tight">So einfach geht's:</h2>
                            <Step number="1" title="Service buchen">Starten Sie unseren Chatbot durch Klick auf "Jetzt buchen". Der Bot erfasst alle nötigen Informationen zu Ihrem Projekt.</Step>
                            <Step number="2" title="Dokumente bereitstellen">Sie stellen uns die notwendigen Unterlagen Ihrer Anlage zur Verfügung (z.B. Datenblätter, Schaltplan).</Step>
                            <Step number="3" title="Termin & Durchführung">Wir vereinbaren einen Termin mit Ihnen, an dem unsere Experten zu Ihnen kommen und den gebuchten Service professionell durchführen.</Step>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-24 text-center">
                 <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-slate-900">Noch Fragen zum Eigenbau?</h2>
                    <p className="text-lg text-slate-600 my-6 max-w-3xl mx-auto">
                        Sie sind unsicher, welcher Service der richtige ist oder haben eine andere Frage? Unser Expertenteam hilft Ihnen gerne weiter.
                    </p>
                    <button onClick={() => openChat('Allgemeine Anfrage zum DIY-Hub', '', 0)} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                        Unverbindliche Beratung starten
                    </button>
                 </div>
            </section>
        </div>
    );
};

export default DIYHubPage;
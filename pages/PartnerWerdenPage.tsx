import React, { useState } from 'react';
import PartnerApplicationFunnel from '../components/PartnerApplicationFunnel';
import { Page } from '../types';

const PartnerWerdenHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="partner-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Werden Sie Partner.
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Gemeinsam wachsen.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Wir bauen ein bundesweites Netzwerk aus exzellenten Fachbetrieben auf. Konzentrieren Sie sich auf Ihr Handwerk, wir kümmern uns um den Rest.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('bewerbung')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Jetzt bewerben
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1556742518-a6e5b402c6a2?q=80&w=800&auto=format&fit=crop" alt="Partnerschaft" className="floating-hero-img partner-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1621905252507-b3c04bd9bb0a?q=80&w=800&auto=format&fit=crop" alt="Handwerk" className="floating-hero-img partner-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop" alt="Team" className="floating-hero-img partner-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="flex justify-center mb-4">
            <div className="bg-green-100 text-green-600 p-4 rounded-full">
                {icon}
            </div>
        </div>
        <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{children}</p>
    </div>
);

const PartnerWerdenPage: React.FC = () => {
    const [isFunnelOpen, setIsFunnelOpen] = useState(false);

    const handleHeroCta = (anchor?: string) => {
        if (anchor === 'bewerbung') {
            setIsFunnelOpen(true);
        } else if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
        <div className="bg-slate-50">
            <PartnerWerdenHero onCtaClick={handleHeroCta} />
            {/* Section 1: Introduction & Benefits */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900">Gemeinsam die Energiewende beschleunigen.</h2>
                        <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                            ZOE Solar wächst und realisiert bundesweit anspruchsvolle PV-Großprojekte. Um unseren hohen Qualitätsansprüchen überall gerecht zu werden, bauen wir ein Netzwerk aus exzellenten, lokalen Fachbetrieben auf. Werden Sie Teil unseres Erfolgs.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <BenefitCard title="Volle Auftragsbücher" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}>
                            Profitieren Sie von einer konstanten Auslastung durch unsere Großprojekte in Ihrer Region.
                        </BenefitCard>
                        <BenefitCard title="Faire & pünktliche Bezahlung" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}>
                            Wir schätzen gute Arbeit. Verlassen Sie sich auf eine transparente, faire Vergütung und schnelle Zahlungsziele.
                        </BenefitCard>
                        <BenefitCard title="Klare Planung & Logistik" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM10.5 12h3.75" /></svg>}>
                            Wir liefern Ihnen detaillierte Ausführungspläne und sorgen für eine pünktliche Materiallieferung direkt zur Baustelle.
                        </BenefitCard>
                    </div>
                </div>
            </section>

            {/* Section 2: Who we are looking for */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900">Wen wir suchen: Experten ihres Fachs.</h2>
                        <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                            Wir suchen zuverlässige Partner, die unseren hohen Qualitätsanspruch teilen und sich auf ihr Kerngeschäft konzentrieren wollen.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Elektroinstallateure */}
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">Elektro-Profis für den Netzanschluss (AC)</h3>
                            <p className="text-slate-600 mb-6">Sie sind das Bindeglied zum Stromnetz und sorgen für den finalen, sicheren Anschluss unserer Anlagen.</p>
                            <h4 className="font-semibold text-slate-700 mb-3">Ihre Aufgaben:</h4>
                            <ul className="space-y-2 text-slate-600 text-sm list-disc list-inside mb-6">
                                <li>AC-seitige Installation und Anschluss der Wechselrichter</li>
                                <li>Umbau und Erweiterung von Zählerschränken</li>
                                <li>Anmeldung der Anlage beim zuständigen Netzbetreiber</li>
                                <li>Durchführung der Inbetriebnahme-Messungen (VDE)</li>
                            </ul>
                            <h4 className="font-semibold text-slate-700 mb-3">Ihr Profil:</h4>
                            <ul className="space-y-2 text-slate-600 text-sm list-disc list-inside">
                                <li>Eingetragener Elektro-Meisterbetrieb</li>
                                <li>Erfahrung im Anschluss von PV-Anlagen</li>
                                <li>Hohes Maß an Zuverlässigkeit und Qualitätsbewusstsein</li>
                            </ul>
                        </div>
                        {/* Montageteams */}
                        <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">Montage-Teams für Dach & Modul (DC)</h3>
                            <p className="text-slate-600 mb-6">Sie sind die Experten für die Gebäudehülle und sorgen für die solide und sichere Basis unserer Kraftwerke.</p>
                             <h4 className="font-semibold text-slate-700 mb-3">Ihre Aufgaben:</h4>
                            <ul className="space-y-2 text-slate-600 text-sm list-disc list-inside mb-6">
                                <li>Montage der Unterkonstruktion auf Flach- und Schrägdächern</li>
                                <li>Fachgerechte Installation der Solarmodule</li>
                                <li>DC-seitige Verkabelung der Module bis zum Wechselrichter</li>
                                <li>Dokumentation der Arbeiten</li>
                            </ul>
                             <h4 className="font-semibold text-slate-700 mb-3">Ihr Profil:</h4>
                            <ul className="space-y-2 text-slate-600 text-sm list-disc list-inside">
                                <li>Erfahrung als Dachdecker, Zimmermann oder Solarteur</li>
                                <li>Kenntnisse gängiger Montagesysteme (z.B. K2, Schletter)</li>
                                <li>Sicherer Umgang mit Arbeiten in der Höhe (Höhentauglichkeit)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Section 3: How it works & CTA */}
            <section className="py-20">
                 <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-green-600 text-white p-12 rounded-2xl shadow-2xl text-center">
                        <h2 className="text-4xl font-bold mb-4">Bereit für eine starke Partnerschaft?</h2>
                        <p className="text-green-200 max-w-2xl mx-auto mb-8 text-lg">
                           Werden Sie Teil unseres Netzwerks und gestalten Sie die Energiewende mit uns. Wir freuen uns auf Ihre aussagekräftige Bewerbung.
                        </p>
                         <button
                            onClick={() => setIsFunnelOpen(true)}
                            className="inline-block bg-white text-green-600 font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-50 transition-all duration-300 shadow-xl transform hover:-translate-y-1"
                        >
                            Jetzt bewerben
                        </button>
                        <p className="text-sm text-green-300 mt-4">Starten Sie unseren digitalen Bewerbungsprozess.</p>
                    </div>
                 </div>
            </section>
        </div>
        {isFunnelOpen && <PartnerApplicationFunnel onClose={() => setIsFunnelOpen(false)} />}
        </>
    );
};

export default PartnerWerdenPage;
import React from 'react';

const servicePackages = [
    {
        name: 'Basic Monitoring',
        price: 'ab 15 €',
        priceUnit: '/Monat',
        features: [
            '24/7 Fernüberwachung der Anlage',
            'Automatische Fehlerbenachrichtigung per E-Mail',
            'Monatlicher Ertragsreport',
            'Online-Portal Zugang',
        ],
        isPopular: false,
    },
    {
        name: 'Advanced Service',
        price: 'ab 45 €',
        priceUnit: '/Monat',
        features: [
            'Alle Leistungen aus Basic Monitoring',
            'Jährliche elektrische Prüfung (VDE)',
            'Sichtprüfung der Module & Unterkonstruktion',
            'Reinigung des Wechselrichters',
            'Priorisierter technischer Support',
        ],
        isPopular: true,
    },
    {
        name: 'Premium O&M',
        price: 'Auf Anfrage',
        priceUnit: '',
        features: [
            'Alle Leistungen aus Advanced Service',
            'Regelmäßige Modulreinigung',
            'Thermografie-Inspektion alle 2 Jahre',
            'Ertragsausfallversicherung inklusive',
            'Umfassende jährliche Dokumentation',
        ],
        isPopular: false,
    }
];

const WartungHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="wartung-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Betriebsführung & Wartung.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Maximieren Sie die Lebensdauer und den Ertrag Ihrer Anlage mit unseren professionellen O&M-Services.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('service-pakete')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Service-Pakete ansehen
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1548894274-643681478299?q=80&w=800&auto=format&fit=crop" alt="Wartung" className="floating-hero-img wartung-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1621905252507-b3c04bd9bb0a?q=80&w=800&auto=format&fit=crop" alt="Techniker" className="floating-hero-img wartung-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1581092916376-023961f31b34?q=80&w=800&auto=format&fit=crop" alt="Prüfung" className="floating-hero-img wartung-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const WartungServicePage: React.FC = () => {
    const openChat = () => document.dispatchEvent(new CustomEvent('open-chat'));
    
    const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white">
            <WartungHero onCtaClick={handleHeroCta} />
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Ihre Investition in sicheren Händen.</h2>
                            <p className="text-lg text-slate-600 mt-4">Eine Photovoltaikanlage ist eine Investition, die über Jahrzehnte Rendite erwirtschaften soll. Eine regelmäßige, professionelle Wartung ist der Schlüssel, um die maximale Leistungsfähigkeit, die Sicherheit und den Wert Ihrer Anlage langfristig zu sichern. Verlassen Sie sich auf unsere Experten.</p>
                        </div>
                         <div className="grid grid-cols-2 gap-6">
                             <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                <h3 className="font-bold text-slate-800">Ertragsmaximierung</h3>
                                <p className="text-sm text-slate-500">Frühzeitiges Erkennen von Leistungsabfällen.</p>
                             </div>
                              <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                <h3 className="font-bold text-slate-800">Sicherheit</h3>
                                <p className="text-sm text-slate-500">Prüfung aller Komponenten zur Vermeidung von Risiken.</p>
                             </div>
                         </div>
                    </div>
                </div>
            </section>
            
            <section id="service-pakete" className="py-20 scroll-mt-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold text-slate-900">Unsere Servicepakete</h2>
                        <p className="text-lg text-slate-600 mt-4">Wählen Sie das Paket, das perfekt zu Ihren Anforderungen passt. Alle Pakete sind flexibel anpassbar.</p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
                        {servicePackages.map(pkg => (
                             <div key={pkg.name} className={`bg-white rounded-2xl shadow-lg border-2 flex flex-col p-8 ${pkg.isPopular ? 'border-green-500' : 'border-slate-200'}`}>
                                {pkg.isPopular && <div className="bg-green-500 text-white font-bold text-sm px-4 py-1 rounded-full absolute -top-4 self-center">Beliebteste Wahl</div>}
                                <h3 className="text-2xl font-bold text-slate-800">{pkg.name}</h3>
                                <div className="my-6">
                                    <span className="text-4xl font-bold text-slate-900">{pkg.price}</span>
                                    {pkg.priceUnit && <span className="text-slate-500">{pkg.priceUnit}</span>}
                                </div>
                                <ul className="space-y-4 flex-grow">
                                    {pkg.features.map(feature => (
                                         <li key={feature} className="flex items-start">
                                            <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                            <span className="text-slate-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={openChat} className={`w-full font-bold py-3 px-6 rounded-lg mt-8 transition-colors ${pkg.isPopular ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}>
                                    Paket anfragen
                                </button>
                             </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-24 text-center bg-slate-50">
                 <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-slate-900">Sichern Sie Ihre Investition langfristig ab.</h2>
                    <p className="text-lg text-slate-600 my-6 max-w-3xl mx-auto">
                        Lassen Sie uns über den optimalen Service für Ihre Anlage sprechen. Unser Expertenteam erstellt Ihnen gerne ein individuelles Angebot.
                    </p>
                    <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                        Jetzt Service-Beratung anfordern
                    </button>
                 </div>
            </section>
        </div>
    );
};

export default WartungServicePage;
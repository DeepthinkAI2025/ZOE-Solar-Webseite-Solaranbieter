import React from 'react';

const values = [
    {
        icon: 'idea',
        title: 'Herstellerunabhängig & Technologieführend',
        description: 'Der Photovoltaik-Markt entwickelt sich rasant. Eine Bindung an einen einzigen Hersteller bedeutet oft, nicht die beste, sondern nur die profitabelste Lösung für den Anbieter zu erhalten. Wir sind frei von solchen Verpflichtungen.',
        details: 'Unsere Experten analysieren kontinuierlich den globalen Markt, um die leistungsstärksten, langlebigsten und wirtschaftlichsten Komponenten für Ihr spezifisches Projekt auszuwählen. Das bedeutet für Sie: maximale Energieausbeute, schnellere Amortisation und eine zukunftssichere Investition.',
        imageUrl: 'https://images.unsplash.com/photo-1629235942484-9366f3630132?q=80&w=1974&auto=format&fit=crop'
    },
    {
        icon: 'team',
        title: 'Eigenes, zertifiziertes Expertenteam',
        description: 'Viele Anbieter agieren nur als Vermittler und geben die eigentliche Arbeit an Subunternehmer weiter. Dies führt oft zu Kommunikationsproblemen, Qualitätsverlust und einer unklaren Haftung im Schadensfall.',
        details: 'Bei ZOE Solar setzen wir ausschließlich auf unsere eigenen, festangestellten und IHK-zertifizierten Fachkräfte. Von der Planung durch unsere Ingenieure bis zur Montage durch unsere Solarteure – Sie haben immer einen direkten Ansprechpartner und können sich auf höchste Qualitätsstandards nach deutschen Normen verlassen.',
        imageUrl: 'https://images.unsplash.com/photo-1556742518-a6e5b402c6a2?q=80&w=2070&auto=format&fit=crop'
    },
    {
        icon: 'partner',
        title: 'Alles aus einer Hand – Ihr strategischer Partner',
        description: 'Ein PV-Großprojekt ist komplex. Die Koordination von Netzbetreibern, Genehmigungsbehörden und Lieferanten kann für Sie als Unternehmer zu einer enormen Belastung werden.',
        details: 'Wir nehmen Ihnen den gesamten Prozess ab. Von der ersten Potenzialanalyse über die detaillierte Planung, die Einholung aller Genehmigungen, die schlüsselfertige Installation bis hin zur anschließenden Wartung und Versicherung. Wir sind Ihr zentraler Partner, der den gesamten Prozess effizient und stressfrei für Sie steuert.',
        imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop'
    }
];

const Icon: React.FC<{ name: string }> = ({ name }) => {
    const className = 'w-16 h-16 text-green-600 bg-green-50 p-3 rounded-full';
    const strokeWidth = 1.5;
    
    const icons: { [key: string]: React.ReactNode } = {
        idea: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.255 0-2.42-.157-3.548-.437m14.596 0c-1.128.28-2.293.437-3.548.437a7.5 7.5 0 01-7.5 0" /></svg>,
        team: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 0110.5 9.75v-.75a3.375 3.375 0 013.375-3.375s-1.543.425-2.25 1.5c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75M6.375 12v.75a3.375 3.375 0 01-3.375 3.375c-1.386 0-2.595-.57-3.375-1.5m15.75-3.375c.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75M9 12.75h6" /></svg>,
        partner: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662v4.286a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7v-4.286zM12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>,
    };
    return icons[name] || null;
};

const WarumZoeSolarHero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
    return (
        <section className="warum-zoe-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                            Der ZOE Solar Unterschied.
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Qualität. Partnerschaft. Innovation.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Entdecken Sie die drei Säulen, die den Erfolg Ihres Projekts garantieren und uns vom Wettbewerb abheben.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <button onClick={onCtaClick} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow">
                                Jetzt Analyse starten
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1600880292210-252c72b6b47c?q=80&w=800&auto=format&fit=crop" alt="Qualität & Garantie" className="floating-hero-img warum-zoe-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1556742518-a6e5b402c6a2?q=80&w=800&auto=format&fit=crop" alt="Partnerschaft" className="floating-hero-img warum-zoe-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1617585035213-a8685d6b3a0a?q=80&w=800&auto=format&fit=crop" alt="Innovation" className="floating-hero-img warum-zoe-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const WarumZoeSolarPage: React.FC = () => {
    const openChat = () => {
        document.dispatchEvent(new CustomEvent('open-chat'));
    };
    
    return (
        <>
        <WarumZoeSolarHero onCtaClick={openChat} />
        <div className="bg-white">
            {values.map((value, index) => (
                <section 
                    key={index} 
                    className={`overflow-hidden ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                >
                    <div className="container mx-auto px-6 py-20 lg:py-24">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <div className={`${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                                <div className="mb-6"><Icon name={value.icon} /></div>
                                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{value.title}</h2>
                                <p className="text-lg text-slate-600 mb-4 font-semibold italic">{value.description}</p>
                                <p className="text-slate-600 leading-relaxed">{value.details}</p>
                            </div>
                            <div className={`relative ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                                <div className="aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden">
                                    <img 
                                        src={value.imageUrl} 
                                        alt={value.title} 
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

             {/* CTA Section */}
            <section className="bg-white">
                <div className="container mx-auto px-6 py-24">
                    <div className="bg-green-600 rounded-2xl text-white p-12 text-center shadow-2xl max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit für eine Photovoltaik-Lösung ohne Kompromisse?</h2>
                        <p className="text-green-200 max-w-3xl mx-auto mb-8 text-lg">
                            Lassen Sie uns gemeinsam herausfinden, wie viel Potenzial in Ihren ungenutzten Flächen steckt. Starten Sie jetzt Ihre kostenlose und unverbindliche Analyse.
                        </p>
                         <button onClick={openChat} className="bg-white text-green-600 font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-50 transition-all duration-300 shadow-xl transform hover:-translate-y-1">
                            Kostenlose Potenzial-Analyse starten
                        </button>
                    </div>
                </div>
            </section>
        </div>
        </>
    );
};

export default WarumZoeSolarPage;
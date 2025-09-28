import React from 'react';
import ImageWithFallback from '../components/ImageWithFallback';

const GarantieHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="garantie-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Garantie & Gewährleistung.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Wir stehen zu unserem Qualitätsversprechen. Im Garantiefall sind wir schnell und unkompliziert für Sie da.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('garantie-prozess')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Zum Prozess im Garantiefall
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <a onClick={() => onCtaClick('garantie-prozess')} className="floating-hero-img garantie-hero img-1 cursor-pointer">
                                <ImageWithFallback src="https://images.unsplash.com/photo-1600880292210-252c72b6b47c?q=80&w=800&auto=format&fit=crop" alt="Vertrauen" className="w-full h-full object-cover" imgWidth={280} imgHeight={200}/>
                            </a>
                            <a onClick={() => onCtaClick('garantie-prozess')} className="floating-hero-img garantie-hero img-2 cursor-pointer">
                                <ImageWithFallback src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop" alt="Vertrag" className="w-full h-full object-cover" imgWidth={220} imgHeight={300}/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const GarantieabwicklungPage: React.FC = () => {
    const openChat = () => document.dispatchEvent(new CustomEvent('open-chat'));
    
    const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white">
            <GarantieHero onCtaClick={handleHeroCta} />
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-6xl">
                     <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900">Unser Versprechen: Wir sind für Sie da.</h2>
                        <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                           Eine hochwertige Solaranlage ist eine langfristige Investition. Deshalb stehen wir auch nach der Installation fest an Ihrer Seite. Erfahren Sie hier alles über unser umfassendes Garantie- und Gewährleistungsversprechen.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* ZOE Solar Gewährleistung */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-green-500">
                             <h3 className="text-2xl font-bold text-green-700 mb-4">ZOE Solar Gewährleistung</h3>
                             <p className="text-slate-600 mb-6">Als Ihr Vertragspartner geben wir Ihnen eine <strong>5-jährige Gewährleistung auf unsere gesamte Installationsarbeit</strong>. Das bedeutet:</p>
                             <ul className="space-y-3">
                                <li className="flex items-start"><svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>Wir haften für die fachgerechte Montage aller Komponenten.</span></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>Wir sind Ihr erster Ansprechpartner bei jeglichen Problemen.</span></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span>Wir kümmern uns im Schadensfall um die Koordination.</span></li>
                             </ul>
                        </div>
                        {/* Herstellergarantie */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                             <h3 className="text-2xl font-bold text-slate-800 mb-4">Herstellergarantien</h3>
                             <p className="text-slate-600 mb-6">Zusätzlich profitieren Sie von den langfristigen Garantien der Komponentenhersteller. Wir verbauen ausschließlich Produkte mit branchenführenden Garantieleistungen:</p>
                             <ul className="space-y-3">
                                <li className="flex items-start"><svg className="w-6 h-6 text-slate-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span><strong>25-30 Jahre</strong> lineare Leistungsgarantie auf Solarmodule.</span></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-slate-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span><strong>15-30 Jahre</strong> Produktgarantie auf Solarmodule.</span></li>
                                <li className="flex items-start"><svg className="w-6 h-6 text-slate-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span><strong>5-12 Jahre</strong> Produktgarantie auf Wechselrichter & Speicher.</span></li>
                             </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section id="garantie-prozess" className="py-20 scroll-mt-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-12">
                         <h2 className="text-4xl font-bold text-slate-900">Der Prozess im Garantiefall: <br/>Einfach & Sorgenfrei.</h2>
                         <p className="text-lg text-slate-600 mt-4">Sollte wider Erwarten ein Problem auftreten, lassen wir Sie nicht im Regen stehen. Unser standardisierter Prozess sorgt für eine schnelle und unkomplizierte Lösung.</p>
                    </div>
                     <div className="relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" aria-hidden="true"></div>
                        <div className="space-y-16">
                            {/* Step 1 */}
                            <div className="md:grid md:grid-cols-2 md:gap-12 items-center relative">
                                <div className="md:text-right md:pr-12">
                                    <p className="text-green-600 font-bold">Schritt 1</p>
                                    <h3 className="text-2xl font-bold text-slate-800">Meldung & Ferndiagnose</h3>
                                    <p className="text-slate-600 mt-2">Sie kontaktieren uns per Telefon, E-Mail oder über unser Kundenportal. Durch unser 24/7 Monitoring können wir oft schon aus der Ferne eine erste Diagnose stellen.</p>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-green-600 border-4 border-white rounded-full hidden md:block"></div>
                                <div className="mt-4 md:mt-0">
                                    <img src="https://images.unsplash.com/photo-1587560699334-cc426240169f?q=80&w=2070&auto=format&fit=crop" alt="Kontakt" className="rounded-lg shadow-lg" />
                                </div>
                            </div>
                             {/* Step 2 */}
                             <div className="md:grid md:grid-cols-2 md:gap-12 items-center relative">
                                <div className="md:order-2 md:text-left md:pl-12">
                                    <p className="text-green-600 font-bold">Schritt 2</p>
                                    <h3 className="text-2xl font-bold text-slate-800">Abwicklung mit dem Hersteller</h3>
                                    <p className="text-slate-600 mt-2">Wir übernehmen die komplette Kommunikation und Garantieabwicklung mit dem jeweiligen Komponentenhersteller. Sie müssen sich um nichts kümmern.</p>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-green-600 border-4 border-white rounded-full hidden md:block"></div>
                                <div className="md:order-1 mt-4 md:mt-0">
                                     <img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop" alt="Kommunikation" className="rounded-lg shadow-lg" />
                                </div>
                            </div>
                             {/* Step 3 */}
                            <div className="md:grid md:grid-cols-2 md:gap-12 items-center relative">
                                <div className="md:text-right md:pr-12">
                                    <p className="text-green-600 font-bold">Schritt 3</p>
                                    <h3 className="text-2xl font-bold text-slate-800">Austausch & Reparatur</h3>
                                    <p className="text-slate-600 mt-2">Sobald das Ersatzteil geliefert wurde, vereinbart unser Service-Team einen Termin mit Ihnen und führt den Austausch oder die Reparatur vor Ort schnell und fachgerecht durch.</p>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-green-600 border-4 border-white rounded-full hidden md:block"></div>
                                <div className="mt-4 md:mt-0">
                                    <img src="https://images.unsplash.com/photo-1621905252507-b3c04bd9bb0a?q=80&w=2070&auto=format&fit=crop" alt="Techniker" className="rounded-lg shadow-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="py-24 text-center">
                 <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-slate-900">Haben Sie einen Servicefall?</h2>
                    <p className="text-lg text-slate-600 my-6 max-w-3xl mx-auto">
                       Zögern Sie nicht, uns zu kontaktieren. Starten Sie eine Serviceanfrage über unseren Chatbot, um Ihr Anliegen schnell und unkompliziert zu melden.
                    </p>
                    <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                        Servicefall melden
                    </button>
                 </div>
            </section>
        </div>
    );
};

export default GarantieabwicklungPage;

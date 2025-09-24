import React from 'react';

const NachhaltigkeitHero: React.FC = () => {
    return (
        <section className="nachhaltigkeit-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Unser Beitrag zur
                        </h1>
                         <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Nachhaltigkeit.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Wir gestalten die Energiewende aktiv mit – ökologisch, ökonomisch und sozial verantwortlich.
                        </p>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop" alt="Nachhaltigkeit" className="floating-hero-img nachhaltigkeit-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=800&auto=format&fit=crop" alt="Windräder und Solar" className="floating-hero-img nachhaltigkeit-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop" alt="Agri-PV" className="floating-hero-img nachhaltigkeit-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const NachhaltigkeitPage: React.FC = () => {
    // Reusing stats from UeberUnsPage for consistency
    const stats = [
        { value: '> 150 MWp', label: 'Installierte Leistung' },
        { value: '> 85.000 t', label: 'CO₂ Einsparung pro Jahr' },
        { value: '> 50.000', label: 'Versorgte Haushalte (äquiv.)' },
    ];

    return (
        <div className="bg-white">
            <NachhaltigkeitHero />
             {/* Mission Section */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                         <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Unsere Mission: <span className="text-green-600">100% Erneuerbare Energien</span></h2>
                         <p className="text-lg text-slate-600 mt-4">
                            Wir bei ZOE Solar sind überzeugt, dass die Energiewende die größte Chance unserer Zeit ist. Unsere Mission ist es, Unternehmen und Landwirten zu ermöglichen, Teil dieser Wende zu werden – und zwar auf eine Weise, die ökologisch und ökonomisch sinnvoll ist.
                         </p>
                         <p className="text-slate-600 mt-4">
                             Jedes von uns realisierte Projekt ist ein aktiver Beitrag zum Klimaschutz, zur Reduzierung von Treibhausgasemissionen und zur Schonung endlicher Ressourcen. Wir sehen uns als Partner des deutschen Mittelstands auf dem Weg in eine saubere und unabhängige Energiezukunft.
                         </p>
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop" alt="Solar panels in a green landscape" loading="lazy" decoding="async" className="rounded-lg shadow-xl" />
                    </div>
                </div>
            </section>

             {/* Stats Section */}
            <section className="bg-slate-800 text-white py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Unser Beitrag in Zahlen</h2>
                        <p className="text-slate-300 mt-2">Gemeinsam mit unseren Kunden haben wir bereits viel erreicht.</p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                        {stats.map(stat => (
                            <div key={stat.label} className="bg-slate-700 p-8 rounded-lg">
                                <p className="text-4xl md:text-5xl font-bold text-green-400">{stat.value}</p>
                                <p className="text-slate-300 mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Responsibility Section */}
             <section className="py-20">
                <div className="container mx-auto px-6 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Verantwortung über das Geschäft hinaus</h2>
                         <p className="text-lg text-slate-600 mt-4">
                            Nachhaltigkeit bedeutet für uns mehr als nur sauberen Strom.
                         </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-8 rounded-lg border border-slate-200">
                             <h3 className="text-2xl font-bold text-green-600 mb-2">Regionale Wertschöpfung</h3>
                            <p className="text-slate-600">Durch die Beschäftigung lokaler Fachkräfte und die Zusammenarbeit mit regionalen Partnern stärken wir die Wirtschaft in Berlin, Brandenburg und darüber hinaus. Wir glauben an kurze Wege und den Aufbau langfristiger, vertrauensvoller Geschäftsbeziehungen.</p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-lg border border-slate-200">
                            <h3 className="text-2xl font-bold text-green-600 mb-2">Faire Arbeitsbedingungen</h3>
                            <p className="text-slate-600">Unser Erfolg basiert auf dem Engagement und der Expertise unserer Mitarbeiter. Deshalb schaffen wir ein Arbeitsumfeld, das von Respekt, Fairness und kontinuierlicher Weiterbildung geprägt ist. Wir lehnen den Einsatz von Subunternehmerketten strikt ab.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NachhaltigkeitPage;
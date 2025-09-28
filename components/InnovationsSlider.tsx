import React, { useState } from 'react';
import { innovations, TechSpec } from '../data/innovations';

const TechSpecIcon: React.FC<{ icon: TechSpec['icon'] }> = ({ icon }) => {
    const className = "w-8 h-8 text-green-400";
    const icons = {
        'yield': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
        'design': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 01-3.388-1.62m-5.043-.025a15.998 15.998 0 01-1.622-3.385m-3.388 1.62A15.998 15.998 0 015.96 5.043m-3.388 1.622a15.998 15.998 0 01-1.622 3.385m3.388-1.622a15.998 15.998 0 00-1.622 3.385m5.043.025a15.998 15.998 0 01-3.388 1.622m3.388-1.622a15.998 15.998 0 003.388 1.622m-5.043.025a15.998 15.998 0 011.622 3.385" /></svg>,
        'dual-use': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" /></svg>
    };
    return icons[icon] || null;
};


const InnovationsSlider: React.FC = () => {
    const [activeInnovation, setActiveInnovation] = useState(innovations[0]);

    const handleCallToAction = (innovationId: string) => {
        document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail: innovationId }));
    };

    return (
        <section id="innovations" className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-16 max-w-4xl mx-auto">
                    <p className="font-bold text-green-400 uppercase tracking-wider">Technologie-Vorschau</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2">Die Zukunft der Solarenergie ist jetzt.</h2>
                    <p className="text-lg text-slate-300 mt-4">
                        Wir integrieren nicht nur bewährte Technik, sondern gestalten aktiv die Zukunft mit. Entdecken Sie innovative Lösungen, die Ästhetik, Effizienz und neue Anwendungsbereiche erschließen.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
                    {/* Left Navigation */}
                    <aside className="lg:col-span-1">
                        <div className="space-y-4" role="tablist" aria-orientation="vertical">
                            {innovations.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveInnovation(item)}
                                    className={`w-full p-6 rounded-xl text-left transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                                        activeInnovation.id === item.id
                                        ? 'bg-slate-800 ring-2 ring-green-500 shadow-2xl'
                                        : 'bg-slate-800/50 hover:bg-slate-800'
                                    }`}
                                    role="tab"
                                    aria-selected={activeInnovation.id === item.id}
                                >
                                    <p className="font-semibold text-green-400 mb-1 uppercase tracking-wide text-xs">{item.category}</p>
                                    <h3 className="font-bold text-lg text-white">{item.title}</h3>
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Right Content */}
                    <main className="lg:col-span-2">
                        {activeInnovation && (
                             <div key={activeInnovation.id} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 animate-fade-in flex flex-col h-full">
                                <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-xl">
                                    <img 
                                        src={activeInnovation.imageUrl}
                                        alt={activeInnovation.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                     <div className="absolute -bottom-4 right-6 bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-slate-700">
                                        <p className="text-lg font-bold text-white">{activeInnovation.tagline}</p>
                                    </div>
                                </div>
                                
                                <h2 className="text-3xl font-bold text-green-400 mb-3">{activeInnovation.title}</h2>
                                <p className="text-slate-300 mb-8 flex-grow">{activeInnovation.description}</p>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                    {activeInnovation.techSpecs.map(spec => (
                                        <div key={spec.label} className="bg-slate-900/50 p-4 rounded-lg text-center border border-slate-700">
                                            <div className="flex justify-center mb-2"><TechSpecIcon icon={spec.icon} /></div>
                                            <p className="text-sm font-semibold text-slate-200">{spec.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => handleCallToAction(activeInnovation.id)} className="w-full mt-auto bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-lg cta-button-glow transform hover:-translate-y-1">
                                    {activeInnovation.callToAction}
                                </button>
                             </div>
                        )}
                    </main>
                </div>
            </div>
        </section>
    );
};

export default InnovationsSlider;
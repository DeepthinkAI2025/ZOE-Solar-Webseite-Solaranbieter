import React, { useState } from 'react';

// Data for the guide steps
const guideSteps = [
  {
    step: 1,
    title: 'Analyse & Beratung',
    description: 'Alles beginnt mit einem Gespräch. Wir hören zu, verstehen Ihre Ziele und analysieren Ihren Energiebedarf sowie die Gegebenheiten vor Ort. Auf dieser Basis erhalten Sie eine transparente, datengestützte Potenzialanalyse und eine erste Renditeprognose – kostenlos und unverbindlich.',
    advantage: {
        title: 'Ihr Vorteil: Herstellerunabhängige Analyse',
        text: 'Wir sind nicht an Marken gebunden. Unsere Empfehlungen basieren rein auf der besten technischen und wirtschaftlichen Lösung für Sie.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop',
    icon: 'analyze',
  },
  {
    step: 2,
    title: 'Planung & Engineering',
    description: 'Präzision ist alles. Unsere hauseigenen Ingenieure planen Ihre Anlage bis ins kleinste Detail, wählen die optimalen Komponenten aus und kümmern sich um alle bürokratischen Hürden – von der Statikprüfung über Genehmigungen bis zur Anmeldung beim Netzbetreiber.',
    advantage: {
        title: 'Ihr Vorteil: Technologiefreiheit',
        text: 'Dank unserer Unabhängigkeit kombinieren wir die leistungsstärksten Komponenten des Weltmarkts zu einem perfekt abgestimmten Kraftwerk für maximale Effizienz.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1556742518-a6e5b402c6a2?q=80&w=2070&auto=format&fit=crop',
    icon: 'plan',
  },
  {
    step: 3,
    title: 'Schlüsselfertige Installation',
    description: 'Jetzt wird Ihre Vision Realität. Unsere Montageteams setzen Ihr Projekt professionell, pünktlich und nach höchsten deutschen Qualitäts- und Sicherheitsstandards um. Ein fester Projektleiter hält Sie dabei stets auf dem Laufenden.',
    advantage: {
        title: 'Ihr Vorteil: Keine Subunternehmer',
        text: 'Bei uns gibt es keine undurchsichtigen Subunternehmer-Ketten. Ihr Projekt wird ausschließlich von unseren eigenen, IHK-zertifizierten Fachexperten realisiert.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1628087942182-7b3d0e34ab3c?q=80&w=1974&auto=format&fit=crop',
    icon: 'install',
  },
  {
    step: 4,
    title: 'Inbetriebnahme & Service',
    description: 'Wir übergeben Ihnen nicht nur eine Anlage, sondern ein schlüsselfertiges Kraftwerk. Nach der erfolgreichen Inbetriebnahme und Netzanmeldung überwachen wir Ihr System 24/7 und stehen Ihnen als regionaler Partner langfristig für Service und Wartung zur Seite.',
    advantage: {
        title: 'Ihr Vorteil: Ein Partner für alles',
        text: 'Auch nach der Installation sind wir für Sie da. Mit unserem Monitoring erkennen wir Störungen oft, bevor Sie sie bemerken, und sorgen für maximale Erträge.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509390621415-05581bda341d?q=80&w=2070&auto=format&fit=crop',
    icon: 'service',
  },
];

const StepIcon: React.FC<{ name: string }> = ({ name }) => {
    const className = "w-8 h-8 text-green-600";
    const strokeWidth = 1.5;
    switch (name) {
        case 'analyze': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>;
        case 'plan': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM10.5 12h3.75" /></svg>;
        case 'install': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 000-4.773L6.75 3.75l-4.773 0a3.375 3.375 0 00-4.773 4.773l2.472 2.472" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 1.5l6 6" /></svg>;
        case 'service': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        default: return null;
    }
};

const InteractiveGuide: React.FC = () => {
    const [activeStep, setActiveStep] = useState(1);
    const activeStepData = guideSteps.find(s => s.step === activeStep);

    const openChat = () => {
        document.dispatchEvent(new CustomEvent('open-chat'));
    };

    return (
        <section id="prozess" className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <p className="font-bold text-green-600 uppercase tracking-wider">Unser Vorgehen</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Unser gemeinsamer Weg: <br/>Ihr Projekt.</h2>
                    <p className="text-lg text-slate-600 mt-4">
                        Von der ersten Idee bis zur Stromproduktion – unser Prozess ist darauf ausgelegt, Ihnen Sicherheit zu geben und Sie partnerschaftlich zu begleiten. Entdecken Sie, wie wir Ihr Projekt zum Erfolg führen.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-white p-4 sm:p-8 rounded-2xl shadow-2xl border border-slate-200">
                    {/* Stepper Navigation */}
                    <div role="tablist" aria-label="Projektphasen" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {guideSteps.map(step => (
                            <button
                                key={step.step}
                                onClick={() => setActiveStep(step.step)}
                                className={`p-4 rounded-lg text-left transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 ${
                                    activeStep === step.step 
                                    ? 'bg-green-600 text-white shadow-xl' 
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                                role="tab"
                                aria-selected={activeStep === step.step}
                                aria-controls={`step-content-${step.step}`}
                            >
                                <span className={`block font-bold text-sm ${activeStep === step.step ? 'text-green-200' : 'text-slate-500'}`}>Schritt {step.step}</span>
                                <span className="font-bold text-lg">{step.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Display */}
                    {activeStepData && (
                        <div 
                            key={activeStep} 
                            id={`step-content-${activeStep}`}
                            role="tabpanel"
                            aria-labelledby={`step-tab-${activeStep}`}
                            className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center animate-fade-in"
                        >
                            <div className="order-2 lg:order-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <StepIcon name={activeStepData.icon} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800">{activeStepData.title}</h3>
                                </div>
                                <p className="text-slate-600 mb-6">{activeStepData.description}</p>
                                
                                <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                                    <h4 className="font-bold text-green-800 text-lg mb-2">{activeStepData.advantage.title}</h4>
                                    <p className="text-green-700">{activeStepData.advantage.text}</p>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2">
                                <img 
                                    src={activeStepData.imageUrl} 
                                    alt={activeStepData.title} 
                                    className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video"
                                />
                            </div>
                        </div>
                    )}
                </div>
                
                 <div className="text-center mt-16">
                    <button onClick={openChat} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer">
                        Starten Sie jetzt Schritt 1: Ihre kostenlose Analyse
                    </button>
                </div>
            </div>
        </section>
    );
};

export default InteractiveGuide;
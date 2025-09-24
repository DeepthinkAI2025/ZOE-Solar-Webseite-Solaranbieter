import React, { useState } from 'react';

const steps = [
  {
    step: 1,
    title: 'Analyse & Beratung',
    description: 'Wir beginnen mit einer kostenlosen und unverbindlichen Analyse Ihrer Flächen. Sie erhalten eine transparente Einschätzung des Potenzials und eine erste Renditeprognose.',
    icon: 'analyze',
  },
  {
    step: 2,
    title: 'Planung & Engineering',
    description: 'Unser Expertenteam plant Ihre Anlage bis ins kleinste Detail, holt alle Genehmigungen ein und kümmert sich um die Anmeldung beim Netzbetreiber.',
    icon: 'plan',
  },
  {
    step: 3,
    title: 'Installation',
    description: 'Unsere festangestellten Montageteams installieren Ihre Photovoltaikanlage pünktlich, professionell und nach höchsten Qualitätsstandards.',
    icon: 'install',
  },
  {
    step: 4,
    title: 'Inbetriebnahme & Service',
    description: 'Wir nehmen die Anlage in Betrieb und übergeben Ihnen ein schlüsselfertiges Kraftwerk. Auch danach stehen wir Ihnen für Wartung und Service zur Seite.',
    icon: 'service',
  },
];

const ProcessIcon: React.FC<{ name: string }> = ({ name }) => {
    const className = "w-12 h-12 text-green-600 group-hover:text-green-700 transition-colors duration-300";
    const strokeWidth = 1.5;
    switch (name) {
        case 'analyze': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>;
        case 'plan': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM10.5 12h3.75" /></svg>;
        case 'install': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 000-4.773L6.75 3.75l-4.773 0a3.375 3.375 0 00-4.773 4.773l2.472 2.472" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 1.5l6 6" /></svg>;
        case 'service': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        default: return null;
    }
};

const Process: React.FC = () => {
    const [activeStep, setActiveStep] = useState(1);
    const activeStepData = steps.find(s => s.step === activeStep);

    return (
        <section id="prozess" className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="font-bold text-green-600 uppercase tracking-wider">Unser Vorgehen</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Der ZOE Solar Blueprint: <br/>Ihr Fahrplan zum Erfolg.</h2>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                        Von der ersten Idee bis zur Stromproduktion – unser Prozess ist darauf ausgelegt, für Sie maximal effizient und transparent zu sein.
                    </p>
                </div>
                
                <div className="max-w-5xl mx-auto">
                    {/* Step Navigation */}
                    <div className="relative mb-12" role="tablist" aria-label="Projektphasen">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200" aria-hidden="true"></div>
                        <div 
                            className="absolute top-1/2 left-0 h-1 bg-green-500 transition-all duration-500 ease-in-out" 
                            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
                            aria-hidden="true"
                        ></div>
                        <div className="relative flex justify-between">
                            {steps.map(step => (
                                <button
                                    key={step.step}
                                    onClick={() => setActiveStep(step.step)}
                                    className="z-10 flex flex-col items-center text-center w-24 focus:outline-none"
                                    role="tab"
                                    aria-selected={activeStep === step.step}
                                    aria-controls={`step-panel-${step.step}`}
                                    id={`step-tab-${step.step}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                                        activeStep >= step.step ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'
                                    }`}>
                                        <span className={`text-xl font-bold transition-colors duration-300 ${
                                            activeStep >= step.step ? 'text-white' : 'text-slate-500'
                                        }`}>{step.step}</span>
                                    </div>
                                    <p className={`mt-3 text-sm font-semibold transition-colors duration-300 ${
                                        activeStep === step.step ? 'text-green-600' : 'text-slate-500'
                                    }`}>{step.title.split(' ')[0]}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Display */}
                    {activeStepData && (
                        <div key={activeStep} className="bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-slate-200 min-h-[250px]" style={{ animation: 'animate-step-content-fade-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}
                             role="tabpanel"
                             id={`step-panel-${activeStepData.step}`}
                             aria-labelledby={`step-tab-${activeStepData.step}`}
                        >
                           <div className="grid md:grid-cols-3 gap-8 items-center">
                               <div className="md:col-span-1 flex flex-col items-center text-center">
                                   <div className="bg-green-50 p-5 rounded-full mb-4 group">
                                       <ProcessIcon name={activeStepData.icon} />
                                   </div>
                                   <h3 className="text-2xl font-bold text-slate-800">{activeStepData.title}</h3>
                               </div>
                               <div className="md:col-span-2">
                                   <p className="text-slate-600 text-lg leading-relaxed">{activeStepData.description}</p>
                               </div>
                           </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Process;
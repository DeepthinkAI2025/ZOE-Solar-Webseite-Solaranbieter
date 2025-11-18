import React from 'react';
import { processSteps } from '../data/processStepsData';

const StepIcon: React.FC<{ step: number; active?: boolean }> = ({ step, active = false }) => (
  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
    active 
      ? 'bg-green-600 text-white shadow-lg transform scale-110' 
      : 'bg-slate-100 text-slate-400'
  }`}>
    {step}
  </div>
);

const ProcessIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-12 h-12" }) => {
  const icons: { [key: string]: React.ReactNode } = {
    consultation: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    planning: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0018 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    installation: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17 17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437L18.16 19.673a2.25 2.25 0 01-2.244 2.245H6.09a2.25 2.25 0 01-2.244-2.245L2.909 15.91z" />
      </svg>
    ),
    monitoring: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.12L9 21l1.879-1.879A3 3 0 0113.5 18.257V17.25a6 6 0 00-6-6H9z" />
      </svg>
    ),
  };
  return icons[name] || null;
};

const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-bold text-green-600 uppercase tracking-wider">Ihr Weg zur Solarenergie</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
            So einfach funktioniert Ihre Photovoltaik-Anlage
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Von der ersten Beratung bis zur Stromproduktion in nur wenigen Wochen. 
            Erfahren Sie, wie unkompliziert der Weg zu Ihrer eigenen Solaranlage ist.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-8 left-0 w-full h-0.5 bg-slate-200 hidden lg:block"></div>
          <div className="absolute top-8 left-8 w-0.5 h-full bg-slate-200 lg:hidden"></div>

          <div className="grid lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Mobile Progress Bar */}
                <div className="lg:hidden absolute left-4 top-16 w-0.5 h-32 bg-slate-200">
                  <div 
                    className="w-0.5 bg-green-600 transition-all duration-500"
                    style={{ height: index <= activeStep ? '100%' : '0%' }}
                  ></div>
                </div>

                {/* Step Card */}
                <div 
                  className={`bg-slate-50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    activeStep === index ? 'ring-2 ring-green-500 shadow-lg' : ''
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <StepIcon step={step.id} active={activeStep === index} />
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <ProcessIcon name={step.icon?.props?.className?.includes('12') ? 'consultation' : step.icon?.props?.className?.includes('2') ? 'installation' : 'planning'} className="w-6 h-6 text-green-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center lg:text-left">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-green-600 font-semibold mb-3">
                      {step.subtitle}
                    </p>
                    <p className="text-slate-600 text-sm mb-4">
                      {step.description}
                    </p>
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">{step.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed View */}
        <div className="mt-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Visual */}
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ProcessIcon 
                  name={processSteps[activeStep].icon?.props?.className?.includes('12') ? 'consultation' : 
                        processSteps[activeStep].icon?.props?.className?.includes('2') ? 'installation' : 
                        processSteps[activeStep].icon?.props?.className?.includes('4') ? 'monitoring' : 'planning'} 
                  className="w-16 h-16 text-green-600" 
                />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-2">
                {processSteps[activeStep].title}
              </h4>
              <p className="text-slate-600">
                {processSteps[activeStep].subtitle}
              </p>
            </div>

            {/* Right: Details */}
            <div>
              <h5 className="text-lg font-semibold text-slate-900 mb-4">
                Das erwartet Sie in diesem Schritt:
              </h5>
              <div className="space-y-3">
                {processSteps[activeStep].details.map((detail, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{detail}</span>
                  </div>
                ))}
              </div>
              
              {processSteps[activeStep].cta && (
                <button className="mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1">
                  {processSteps[activeStep].cta}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="text-3xl font-bold text-green-600 mb-2">4</div>
            <div className="text-slate-900 font-semibold mb-1">Einfache Schritte</div>
            <div className="text-slate-600 text-sm">Von der Beratung bis zur Stromproduktion</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="text-3xl font-bold text-green-600 mb-2">2-4</div>
            <div className="text-slate-900 font-semibold mb-1">Wochen</div>
            <div className="text-slate-600 text-sm">Durchschnittliche Projektlaufzeit</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
            <div className="text-slate-900 font-semibold mb-1">Jahre</div>
            <div className="text-slate-600 text-sm">Garantierte Stromproduktion</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
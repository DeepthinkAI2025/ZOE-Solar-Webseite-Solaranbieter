import React, { useState, useEffect } from 'react';

// Nutzer-freundliche Solar-Erklärung - Statt Business-Daten
interface TechnologyProps {
  customerType: 'private' | 'business';
}

const Technology: React.FC<TechnologyProps> = ({ customerType }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Solar Erklärung Steps - Einfach und verständlich
  const solarSteps = [
    {
      id: 'sun',
      title: 'Sonne scheint',
      description: 'Die Sonne scheint jeden Tag auf Ihr Dach und erzeugt Strom',
      icon: 'sun',
      benefit: 'Kostenlose Energie aus der Natur'
    },
    {
      id: 'panels',
      title: 'Module wandeln um',
      description: 'Ihre Solarmodule fangen das Sonnenlicht ein und machen daraus Strom',
      icon: 'panel',
      benefit: 'Sauberer Strom direkt auf Ihrem Dach'
    },
    {
      id: 'house',
      title: 'Strom für Zuhause',
      description: 'Der produzierte Strom fließt direkt in Ihr Zuhause',
      icon: 'house',
      benefit: 'Ihr eigener Strom - immer verfügbar'
    },
    {
      id: 'save',
      title: 'Geld sparen',
      description: 'Sie verbrauchen weniger Strom vom Stromanbieter',
      icon: 'save',
      benefit: 'Bis zu 80% weniger Stromkosten'
    }
  ];

  // Testimonials von echten Kunden
  const testimonials = [
    {
      name: 'Familie Müller aus München',
      text: 'Wir sparen jetzt 200€ im Monat und unser Dach sieht noch schöner aus!',
      rating: 5,
      savings: '2.400€/Jahr gespart'
    },
    {
      name: 'Herr Schmidt aus Hamburg', 
      text: 'Die Installation war super professionell. Alles funktioniert einwandfrei.',
      rating: 5,
      savings: '1.800€/Jahr gespart'
    },
    {
      name: 'Familie Weber aus Berlin',
      text: 'Endlich unabhängig von steigenden Strompreisen. Top Entscheidung!',
      rating: 5,
      savings: '3.100€/Jahr gespart'
    }
  ];

  // Einfache Animation für Solar-Erklärung
  const SolarAnimation: React.FC<{ isActive: boolean; step: typeof solarSteps[0] }> = ({ isActive, step }) => {
    if (!isActive) return null;

    return (
      <div className="relative h-64 bg-gradient-to-b from-blue-400 via-blue-300 to-green-300 rounded-2xl overflow-hidden">
        {/* Sonnenschein */}
        {step.id === 'sun' && (
          <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-400 rounded-full animate-pulse shadow-lg">
            <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping"></div>
          </div>
        )}
        
        {/* Solar Panel Animation */}
        {(step.id === 'panels' || step.id === 'house') && (
          <div className="absolute bottom-8 left-8 right-8 h-20 bg-blue-800 rounded-lg border-2 border-gray-300">
            <div className="grid grid-cols-4 h-full gap-1 p-2">
              {Array.from({ length: 8 }, (_, i) => (
                <div 
                  key={i} 
                  className={`bg-blue-900 rounded ${step.id === 'panels' ? 'animate-pulse' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
            {/* Energiefluss */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
                <div className="w-8 h-1 bg-yellow-300 animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Haus Animation */}
        {(step.id === 'house' || step.id === 'save') && (
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-amber-600 rounded-lg border-2 border-amber-700">
            <div className="w-full h-1/2 bg-red-600"></div>
            <div className="flex p-2 gap-1">
              <div className="w-4 h-4 bg-blue-300 rounded"></div>
              <div className="w-4 h-4 bg-blue-300 rounded"></div>
            </div>
          </div>
        )}
        
        {/* Sparen Animation */}
        {step.id === 'save' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-4xl animate-bounce">💰</div>
          </div>
        )}
      </div>
    );
  };

  const handleStepChange = (stepIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveStep(stepIndex);
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header - Einfach und einladend */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
            <span className="text-2xl">☀️</span>
            <span className="text-green-800 font-medium">So einfach funktioniert Solar</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {customerType === 'private' 
              ? 'Ihr eigener Strom vom Dach'
              : 'Solar für Ihr Unternehmen'
            }
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {customerType === 'private'
              ? 'Von der Sonne bis zu Ihren Steckdosen - in 4 einfachen Schritten erklärt'
              : 'Entdecken Sie, wie Solarstrom Ihr Unternehmen unabhängiger macht'
            }
          </p>
        </div>

        {/* Solar-Erklärung - Interaktiv */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Animation */}
          <div className="order-2 lg:order-1">
            <SolarAnimation 
              isActive={true} 
              step={solarSteps[activeStep]}
            />
          </div>

          {/* Steps */}
          <div className="order-1 lg:order-2 space-y-4">
            {solarSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepChange(index)}
                disabled={isAnimating}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-white shadow-lg border-2 border-green-200 scale-[1.02]'
                    : 'bg-white/70 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    activeStep === index ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {step.id === 'sun' && '☀️'}
                    {step.id === 'panels' && '⚡'}
                    {step.id === 'house' && '🏠'}
                    {step.id === 'save' && '💰'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Schritt {index + 1}: {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                    <p className="text-green-600 font-medium text-sm">{step.benefit}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials - Social Proof */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Was unsere Kunden sagen
            </h3>
            <p className="text-gray-600">Echte Erfahrungen von echten Familien</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{testimonial.name}</span>
                  <span className="text-green-600 font-bold text-sm">{testimonial.savings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action - Klar und eindeutig */}
        <div className="text-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Bereit für Ihren eigenen Solarstrom?
            </h3>
            <p className="text-gray-600 mb-6">
              {customerType === 'private'
                ? 'Kostenlose Beratung und unverbindliches Angebot in 24h'
                : 'Professionelle Beratung für Ihr Unternehmen'
              }
            </p>
            <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              {customerType === 'private' 
                ? '💬 Jetzt kostenlose Beratung anfordern'
                : '📞 Beratung für Unternehmen anfragen'
              }
            </button>
            <p className="text-sm text-gray-500 mt-3">
              ✅ Kostenlos ✅ Unverbindlich ✅ In 24h Antwort
            </p>
          </div>
        </div>

        {/* Trust Signals - Einfach */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">5.000+ zufriedene Kunden</h4>
              <p className="text-gray-600 text-sm">In ganz Deutschland vertrauen uns Familien</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">10 Jahre Erfahrung</h4>
              <p className="text-gray-600 text-sm">Professionelle Installation und Service</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">25 Jahre Garantie</h4>
              <p className="text-gray-600 text-sm">Sicherheit für Sie und Ihre Investition</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;
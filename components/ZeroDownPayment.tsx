import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface ZeroDownPaymentProps {
  customerType?: 'private' | 'business';
  setPage: (page: Page) => void;
}

const smartEnergyData = {
  private: {
    badge: 'Klimaschutz & Nachhaltigkeit',
    title: 'Für eine grüne Zukunft',
    subtitle: 'Beitragen Sie aktiv zum Klimaschutz und sparen Sie gleichzeitig Geld mit sauberer Solarenergie.',
    description: 'Mit Ihrer Solaranlage von ZOE Solar leisten Sie einen wichtigen Beitrag zum Umweltschutz. Reduzieren Sie Ihren CO₂-Fußabdruck erheblich und werden Sie Teil der Energiewende.',
    keyMetrics: [
      { label: 'CO₂-Einsparung', value: '4,2', hint: 'Tonnen pro Jahr', color: 'text-primary-400' },
      { label: 'Erneuerbare Energie', value: '100%', hint: 'Sauberer Solarstrom', color: 'text-primary-400' },
      { label: 'Umweltbelastung', value: '0%', hint: 'Keine Emissionen', color: 'text-blue-400' },
      { label: 'Nachhaltigkeit', value: '25+', hint: 'Jahre Lebensdauer', color: 'text-purple-400' }
    ],
    smartFeatures: [
      {
        id: 'co2-reduction',
        title: 'CO₂-Reduzierung',
        subtitle: 'Aktiver Beitrag zum Klimaschutz',
        benefits: ['4,2 Tonnen CO₂-Einsparung pro Jahr', 'Reduzierung der Treibhausgasemissionen', 'Beitrag zur Erreichung der Klimaziele', 'Umweltfreundliche Energieproduktion'],
        icon: '🌱',
        popular: true
      },
      {
        id: 'renewable-energy',
        title: 'Erneuerbare Energie',
        subtitle: '100% saubere Sonnenenergie',
        benefits: ['Ausschließlich erneuerbare Energiequelle', 'Keine fossilen Brennstoffe notwendig', 'Nachhaltige Energie für zukünftige Generationen', 'Beitrag zur Energiewende'],
        icon: '☀️',
        popular: false
      },
      {
        id: 'sustainable-living',
        title: 'Nachhaltiges Leben',
        subtitle: 'Umweltbewusst wohnen und leben',
        benefits: ['Reduzierter ökologischer Fußabdruck', 'Unabhängig von fossilen Energieträgern', 'Beitrag zu einer sauberen Umwelt', 'Zukunftssichere Energieversorgung'],
        icon: '🌍',
        popular: false
      }
    ],
    cta: 'Klimaschutz starten'
  },
  business: {
    badge: 'Nachhaltiges Business',
    title: 'Corporate Green Solutions',
    subtitle: 'Machen Sie Ihr Unternehmen klimafreundlich und profitieren Sie von grünen Geschäftsvorteilen.',
    description: 'Als Unternehmen übernehmen Sie Verantwortung für die Umwelt. Mit ZOE Solar werden Sie zum Vorreiter in Sachen Nachhaltigkeit und stärken gleichzeitig Ihre Marktposition.',
    keyMetrics: [
      { label: 'CO₂-Neutral', value: '100%', hint: 'Bei voller Autarkie', color: 'text-primary-400' },
      { label: 'Green Image', value: '+40%', hint: 'Verbesserte Reputation', color: 'text-primary-400' },
      { label: 'CSR-Impact', value: 'Hoch', hint: 'Nachhaltigkeitsbewertung', color: 'text-blue-400' },
      { label: 'Förderungen', value: '€100.000+', hint: 'Mögliche Zuschüsse', color: 'text-purple-400' }
    ],
    smartFeatures: [
      {
        id: 'corporate-sustainability',
        title: 'Corporate Sustainability',
        subtitle: 'Nachhaltigkeit als Unternehmensstrategie',
        benefits: ['CO₂-neutrale Geschäftstätigkeit möglich', 'Verbesserte ESG-Bewertung', 'Attraktivität für grüne Investoren', 'Vorteile bei öffentlichen Ausschreibungen'],
        icon: '🏢',
        popular: true
      },
      {
        id: 'green-certifications',
        title: 'Green Certifications',
        subtitle: 'Zertifizierte Nachhaltigkeitsstandards',
        benefits: ['Internationale Umweltzertifizierungen', 'Nachweisbare Klimaschutzbeiträge', 'Marketingvorteile durch Green Labels', 'Steuerliche Vorteile für Umweltinvestitionen'],
        icon: '✅',
        popular: false
      },
      {
        id: 'sustainability-reporting',
        title: 'Sustainability Reporting',
        subtitle: 'Transparente Nachhaltigkeitsberichterstattung',
        benefits: ['Automatische CO₂-Bilanzierung', 'Umweltberichte für Stakeholder', 'Nachhaltigkeits-KPIs im Dashboard', 'Compliance mit Berichtsstandards'],
        icon: '📊',
        popular: false
      }
    ],
    cta: 'Green Business starten'
  }
};

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: string; color: string }> = ({ value, color }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`counter-${value}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    if (!isVisible) return;

    const numericValue = parseFloat(value.replace(',', '.'));
    const isCurrency = value.includes('€');
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        if (isCurrency) {
          setDisplayValue(`€${Math.floor(current).toLocaleString()}`);
        } else {
          setDisplayValue(current.toFixed(1).replace('.', ','));
        }
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div id={`counter-${value}`} className="text-center">
      <div className={`text-4xl md:text-5xl font-black ${color} mb-2`}>
        {displayValue}
      </div>
    </div>
  );
};

// Smart Feature Card Component
const SmartFeatureCard: React.FC<{
  feature: typeof smartEnergyData.private.smartFeatures[0];
  onSelect: () => void;
  isSelected: boolean;
}> = ({ feature, onSelect, isSelected }) => {
  return (
    <div
      onClick={onSelect}
      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group hover:scale-105 ${
        isSelected
          ? 'border-primary-300 bg-gradient-to-br from-primary-50 to-primary-50 shadow-xl shadow-primary-100/50'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
      }`}
    >
      {feature.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-primary-500 to-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            PREMIUM
          </span>
        </div>
      )}

      <div className="text-center mb-4">
        <div className="text-4xl mb-3">{feature.icon}</div>
        <h3 className={`text-xl font-bold mb-2 ${
          isSelected ? 'text-primary-800' : 'text-gray-800'
        }`}>
          {feature.title}
        </h3>
        <p className={`text-sm ${
          isSelected ? 'text-primary-600' : 'text-gray-600'
        }`}>
          {feature.subtitle}
        </p>
      </div>

      <ul className="space-y-2">
        {feature.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <div className={`flex-shrink-0 w-4 h-4 rounded-full mt-0.5 ${
              isSelected ? 'bg-primary-100' : 'bg-gray-100'
            } flex items-center justify-center`}>
              <svg className={`w-2.5 h-2.5 ${
                isSelected ? 'text-primary-600' : 'text-gray-500'
              }`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className={isSelected ? 'text-primary-700' : 'text-gray-700'}>
              {benefit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ZeroDownPayment: React.FC<ZeroDownPaymentProps> = ({ customerType = 'private', setPage }) => {
  const [selectedFeature, setSelectedFeature] = useState<string>('co2-reduction');
  const currentData = smartEnergyData[customerType] || smartEnergyData.private;

  const handleLinkClick = () => {
    setPage('kontakt');
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary-200/10 to-primary-200/5 blur-[200px]" />
        <div className="absolute top-1/4 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-200/8 to-indigo-200/3 blur-[180px]" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-200/6 to-pink-200/2 blur-[160px]" />
        <div className="absolute top-3/4 left-1/4 h-[300px] w-[300px] rounded-full bg-white/20 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-50 to-primary-50 border border-primary-200/60 mb-8 shadow-sm">
            <div className="p-1.5 rounded-full bg-primary-100">
              <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
              {currentData.badge}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 leading-tight mb-6">
            {currentData.title}
          </h2>

          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            {currentData.subtitle}
          </p>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {currentData.keyMetrics.map((metric, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105">
              <div className="mb-4">
                <AnimatedCounter value={metric.value} color={metric.color} />
              </div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Financing Options Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {currentData.smartFeatures.map((feature) => (
            <SmartFeatureCard
              key={feature.id}
              feature={feature}
              onSelect={() => setSelectedFeature(feature.id)}
              isSelected={selectedFeature === feature.id}
            />
          ))}
        </div>

        {/* Detailed Information Panel */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/60">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Warum {customerType === 'private' ? 'Sie' : 'Ihr Unternehmen'} von unserer Technologie profitieren
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {currentData.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-primary-50 rounded-xl border border-primary-200/50">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-800">CO₂-Reduzierung</h4>
                    <p className="text-sm text-primary-700">Aktiver Beitrag zum Klimaschutz</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Erneuerbare Energie</h4>
                    <p className="text-sm text-blue-700">100% saubere Sonnenenergie</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Nachhaltigkeit</h4>
                    <p className="text-sm text-purple-700">Langfristiger Umweltschutz</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200/60 shadow-inner">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Green Dashboard</h4>
                  <p className="text-gray-600">Ihr Beitrag zum Klimaschutz im Überblick</p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">CO₂-Einsparung</span>
                      <span className="text-sm font-bold text-primary-600">4,2t/Jahr</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Erneuerbare Energie</span>
                      <span className="text-lg font-bold text-blue-600">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-full"></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Umweltimpact</span>
                      <span className="text-lg font-bold text-primary-600">Hoch</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full w-5/6"></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLinkClick}
                  className="mt-8 w-full bg-gradient-to-r from-primary-600 to-primary-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-primary-700 hover:to-primary-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  {currentData.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZeroDownPayment;

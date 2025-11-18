import React from 'react';
import { Link } from 'react-router-dom';

interface TargetGroupData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  features: string[];
  icon: React.ReactNode;
  bgGradient: string;
  textColor: string;
  buttonText: string;
  buttonLink: string;
  imageAlt: string;
  stats: {
    value: string;
    label: string;
  }[];
}

interface TargetGroupSectionProps {
  targetGroups: TargetGroupData[];
}

const TargetGroupIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-12 h-12" }) => {
  const icons: { [key: string]: React.ReactNode } = {
    agriculture: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12L9 17.5l4.5-5.5M9 17.5l-1.5-1.5L12 11.5" />
      </svg>
    ),
    residential: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    business: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-5h18c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v14.25c0 .621.504 1.125 1.125 1.125z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5V9.75a1.5 1.5 0 013 0V12a1.5 1.5 0 003 0v-1.5" />
      </svg>
    ),
  };
  return icons[name] || null;
};

const TargetGroupSection: React.FC<TargetGroupSectionProps> = ({ targetGroups }) => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-bold text-green-600 uppercase tracking-wider">Unsere Lösungen</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
            Für jede Anforderung die richtige Photovoltaik-Lösung
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Ob Landwirtschaft, Privathaushalt oder Unternehmen - wir bieten maßgeschneiderte Solarenergie-Lösungen 
            für jeden Bedarf und jeden Standort.
          </p>
        </div>

        <div className="space-y-16">
          {targetGroups.map((group, index) => (
            <div key={group.id} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${group.bgGradient} mb-6`}>
                  <TargetGroupIcon name={group.icon.props?.className?.includes('12') ? group.id : group.id} className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                  {group.title}
                </h3>
                
                <p className="text-xl text-slate-600 mb-6">
                  {group.subtitle}
                </p>
                
                <p className="text-lg text-slate-700 mb-8">
                  {group.description}
                </p>

                {/* Benefits */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {group.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {group.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-green-600">{stat.value}</div>
                      <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  to={group.buttonLink}
                  className={`inline-flex items-center justify-center ${group.bgGradient} text-white font-bold py-4 px-8 rounded-xl text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  {group.buttonText}
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <div className="relative">
                  <div className={`absolute inset-0 ${group.bgGradient} rounded-2xl transform rotate-6 opacity-20`}></div>
                  <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                    {/* Feature List */}
                    <h4 className="text-xl font-bold text-slate-900 mb-6">Spezial-Features:</h4>
                    <div className="space-y-4">
                      {group.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <TargetGroupIcon 
                            name={group.id} 
                            className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" 
                          />
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Additional Visual Element */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <div className="flex items-center justify-center h-32 bg-slate-50 rounded-xl">
                        <TargetGroupIcon 
                          name={group.id} 
                          className="w-16 h-16 text-slate-400" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetGroupSection;
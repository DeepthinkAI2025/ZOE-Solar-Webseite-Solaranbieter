import React, { useState } from 'react';
import { technicalSpecs, warranties, financingOptions } from '../data/technicalSpecsData';



const SpecIcon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-8 h-8" }) => {
  const icons: { [key: string]: React.ReactNode } = {
    panels: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0018 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    inverter: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5 10.5 6l6.75 7.5M10.5 6l3.75 3.75M12 4.5v9m0 0l3.75 3.75M12 4.5H8.25" />
      </svg>
    ),
    storage: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" />
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

const TechnicalSpecsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeWarranty, setActiveWarranty] = useState(0);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-bold text-green-600 uppercase tracking-wider">Technische Exzellenz</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
            Modernste Technologie für maximale Effizienz
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Unsere Photovoltaik-Systeme setzen auf bewährte Premium-Komponenten und modernste Technologien, 
            um Ihnen die höchste Energieausbeute und longest lifetime zu garantieren.
          </p>
        </div>

        {/* Technical Specifications Tabs */}
        <div className="mb-20">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {technicalSpecs.map((spec, index) => (
              <button
                key={spec.category}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <SpecIcon name={spec.icon?.props?.className?.includes('8') ? spec.category : spec.category} className="w-5 h-5" />
                <span>{spec.category}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Specifications */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <SpecIcon name={technicalSpecs[activeTab].icon?.props?.className?.includes('8') ? technicalSpecs[activeTab].category : technicalSpecs[activeTab].category} className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {technicalSpecs[activeTab].category}
                  </h3>
                </div>

                <div className="space-y-6">
                  {technicalSpecs[activeTab].specifications.map((item, index) => (
                    <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-900">{item.name}</h4>
                        <span className="text-xl font-bold text-green-600 whitespace-nowrap ml-4">
                          {item.value}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-slate-600 text-sm">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Advantages */}
              <div>
                <h4 className="text-2xl font-bold text-slate-900 mb-6">
                  Ihre Vorteile
                </h4>
                <div className="space-y-4">
                  {technicalSpecs[activeTab].advantages.map((advantage, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700">{advantage}</span>
                    </div>
                  ))}
                </div>

                {/* Visual Element */}
                <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
                  <div className="flex items-center justify-center h-32">
                    <SpecIcon 
                      name={technicalSpecs[activeTab].category} 
                      className="w-24 h-24 text-green-300" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warranty Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              30 Jahre Garantie & Sicherheit
            </h3>
            <p className="text-lg text-slate-600">
              Vertrauen Sie auf unsere langfristige Qualitätsgarantie und umfassenden Service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {warranties.map((warranty, index) => (
              <div
                key={warranty.component}
                onClick={() => setActiveWarranty(index)}
                className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                  activeWarranty === index
                    ? 'border-green-300 shadow-xl transform -translate-y-2'
                    : 'border-slate-200 hover:shadow-lg'
                }`}
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    {warranty.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">{warranty.component}</h4>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {warranty.coverage}
                  </div>
                  <p className="text-sm text-slate-600">{warranty.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financing Options */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Flexible Finanzierungsmodelle
            </h3>
            <p className="text-lg text-slate-600">
              Starten Sie noch heute in Ihre nachhaltige Energiezukunft - ohne große Anfangsinvestition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {financingOptions.map((option, index) => (
              <div
                key={option.name}
                className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                  option.popular
                    ? 'border-green-300 shadow-xl relative'
                    : 'border-slate-200 hover:shadow-lg'
                }`}
              >
                {option.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Beliebteste Option
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">{option.name}</h4>
                  <p className="text-slate-600">{option.description}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {option.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                  option.popular
                    ? 'bg-green-600 text-white hover:bg-green-700 transform hover:-translate-y-1'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                  {option.ctaText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            Bereit für modernste Solar-Technologie?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Lassen Sie sich von unseren Experten beraten und finden Sie die optimale Lösung für Ihre Anforderungen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1">
              Kostenlose Beratung
            </button>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              Technische Details anfordern
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSpecsSection;
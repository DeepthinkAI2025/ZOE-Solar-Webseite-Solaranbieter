import React, { useRef, useEffect } from 'react';
import { Page } from '../types';

interface LeistungenMegaMenuProps {
  setPage: (page: Page) => void;
  closeMenu: () => void;
}

const LeistungenMegaMenu: React.FC<LeistungenMegaMenuProps> = ({ setPage, closeMenu }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: Page) => {
    setPage(page);
    closeMenu();
  };

  const handleLinkClick = (page: Page) => {
    setPage(page);
    closeMenu();
  };

  // Quick Actions für mobile & desktop
  const featuredServices = [
    {
      title: "Photovoltaik",
      description: "Komplettanlagen für Eigenheim & Gewerbe",
      icon: "☀️",
      page: 'photovoltaik' as Page,
      popular: true,
      features: ["Dachmontage", "Dachsanierung", "Planung & Beratung"]
    },
    {
      title: "E-Mobilität", 
      description: "Ladestationen & Wallbox-Installation",
      icon: "🔌",
      page: 'e-mobilitaet' as Page,
      popular: true,
      features: ["Wandladestationen", "AC/DC Ladeparks", "Smart Charging"]
    },
    {
      title: "Elektro",
      description: "Netzanschluss & Elektroinstallation",
      icon: "⚡",
      page: 'elektro' as Page,
      popular: false,
      features: ["Netzanschluss", "Zähleranlagen", "Verteilerbau"]
    }
  ];

  const coreServices = [
    {
      title: "Wartung & Service",
      description: "Regelmäßige Wartung & Support",
      page: 'wartung-service' as Page,
      icon: "🛠️"
    },
    {
      title: "Speichersysteme",
      description: "Batteriespeicher für Ihre PV-Anlage", 
      page: 'service-speicher' as Page,
      icon: "🔋"
    },
    {
      title: "Agri-PV",
      description: "Photovoltaik für Landwirtschaft",
      page: 'agri-pv' as Page,
      icon: "🌾"
    }
  ];

  const supportServices = [
    {
      title: "Finanzierung",
      description: "Leasing & Finanzierungslösungen",
      page: 'finanzierung' as Page,
      icon: "💰"
    },
    {
      title: "Fördermittel",
      description: "KfW, BAFA & regionale Förderung",
      page: 'foerdermittel-check' as Page,
      icon: "🏛️"
    },
    {
      title: "Innovationen",
      description: "Neueste Technologien & Trends",
      page: 'innovations' as Page,
      icon: "🚀"
    }
  ];

  return (
    <div 
      ref={menuRef}
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-5xl mx-auto"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden backdrop-blur-xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-slate-200/60">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Unsere Leistungen</h3>
              <p className="text-slate-600">Professionelle Energielösungen für Privat & Gewerbe</p>
            </div>
            <button 
              onClick={closeMenu}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-8">
          {/* Featured Services Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredServices.map((service) => (
              <div 
                key={service.title}
                onClick={() => handlePageChange(service.page)}
                className="group relative bg-white rounded-xl p-6 border-2 border-slate-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Beliebt
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h4 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-green-600 transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-slate-600 text-sm mb-4">{service.description}</p>
                  
                  <div className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center gap-2 text-xs text-slate-500">
                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Core Services */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Kernleistungen
              </h4>
              <div className="space-y-3">
                {coreServices.map((service) => (
                  <div
                    key={service.title}
                    onClick={() => handlePageChange(service.page)}
                    className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="text-lg">{service.icon}</div>
                    <div>
                      <h5 className="font-semibold text-slate-700 group-hover:text-green-600 transition-colors">
                        {service.title}
                      </h5>
                      <p className="text-xs text-slate-500">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Services */}
            <div>
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Service & Support
              </h4>
              <div className="space-y-3">
                {supportServices.map((service) => (
                  <div
                    key={service.title}
                    onClick={() => handlePageChange(service.page)}
                    className="group flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="text-lg">{service.icon}</div>
                    <div>
                      <h5 className="font-semibold text-slate-700 group-hover:text-green-600 transition-colors">
                        {service.title}
                      </h5>
                      <p className="text-xs text-slate-500">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & CTA */}
            <div>
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Beratung & Kontakt
              </h4>
              <div className="space-y-4">
                <button
                  onClick={() => handleLinkClick('kontakt')}
                  className="w-full bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Kostenlose Beratung
                </button>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))}
                  className="w-full border border-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  Mit KI-Berater sprechen
                </button>
                <div className="text-xs text-slate-500">
                  <p className="flex items-center gap-2 mb-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    +49 30 12345678
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Berlin • Brandenburg
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeistungenMegaMenu;
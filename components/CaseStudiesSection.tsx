import React, { useState } from 'react';

interface Testimonial {
  name: string;
  location: string;
  project: string;
  image: string;
  rating: number;
  quote: string;
  savings: string;
  roi: string;
}

interface Project {
  title: string;
  location: string;
  type: string;
  size: string;
  output: string;
  completion: string;
  image: string;
  features: string[];
  impact: {
    label: string;
    value: string;
  }[];
}

interface Certificate {
  name: string;
  year: number;
  description: string;
  icon: React.ReactNode;
}

const CaseStudiesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const testimonials: Testimonial[] = [
    {
      name: "Familie Schmidt",
      location: "Potsdam, Brandenburg",
      project: "8 kWp Eigenheim mit 10 kWh Speicher",
      image: "/images/testimonials/familie-schmidt.jpg",
      rating: 5,
      quote: "Die Anlage funktioniert perfekt! Nach 18 Monaten haben wir bereits 2.100€ gespart und produzieren sogar mehr Strom als verbraucht wird.",
      savings: "2.340€/Jahr",
      roi: "13,8% p.a."
    },
    {
      name: "Bio-Hof Müller",
      location: "Strausberg, Brandenburg", 
      project: "50 kWp Agri-PV Anlage",
      image: "/images/testimonials/bio-haus-mueller.jpg",
      rating: 5,
      quote: "Agri-PV war die beste Entscheidung! Unsere Ernteerträge sind um 18% gestiegen und wir produzieren zusätzlich 52.000 kWh Ökostrom.",
      savings: "12.400€/Jahr",
      roi: "16,2% p.a."
    },
    {
      name: "Möbelhaus König",
      location: "Berlin-Mitte",
      project: "120 kWp Gewerbeanlage",
      image: "/images/testimonials/moebelhaus-koenig.jpg",
      rating: 5,
      quote: "Die Solaranlage reduziert unsere Betriebskosten massiv. Über 35.000€ jährliche Einsparung und unser Image als nachhaltiges Unternehmen stärkt das.",
      savings: "35.200€/Jahr",
      roi: "11,4% p.a."
    }
  ];

  const projects: Project[] = [
    {
      title: "Privat: Energieautarkes Einfamilienhaus",
      location: "Potsdam-West",
      type: "Einfamilienhaus",
      size: "9,8 kWp + 12,8 kWh Speicher",
      output: "10.200 kWh/Jahr",
      completion: "2024",
      image: "/images/projects/einfamilienhaus-potsdam.jpg",
      features: [
        "420Wp Hochleistungsmodule",
        "Tesla Powerwall 3",
        "Huawei Wechselrichter",
        "Smart Home Integration",
        "E-Auto Wallbox"
      ],
      impact: [
        { label: "Eigenverbrauch", value: "85%" },
        { label: "Jährliche Ersparnis", value: "2.340€" },
        { label: "CO₂-Einsparung", value: "6,1 t/Jahr" },
        { label: "Amortisation", value: "6,4 Jahre" }
      ]
    },
    {
      title: "Gewerbe: Logistikzentrum Süd",
      location: "Hamburg-Billstedt",
      type: "Logistik & Lager",
      size: "350 kWp Dachanlage",
      output: "367.500 kWh/Jahr",
      completion: "2024",
      image: "/images/projects/logistikzentrum-hamburg.jpg",
      features: [
        "TwinPeak Module 410Wp",
        "Zentralwechselrichter",
        "Schneerutsch-System",
        "Monitoring-System",
        "Perimeter-Detection"
      ],
      impact: [
        { label: "Eigenverbrauch", value: "73%" },
        { label: "Jährliche Ersparnis", value: "89.300€" },
        { label: "CO₂-Einsparung", value: "220 t/Jahr" },
        { label: "Vermeidungskosten", value: "4.400€ CO₂" }
      ]
    },
    {
      title: "Agri-PV: Innovative Landwirtschaft",
      location: "Uckermark, Brandenburg",
      type: "Agri-Photovoltaik",
      size: "75 kWp Agri-System",
      output: "78.750 kWh/Jahr",
      completion: "2023",
      image: "/images/projects/agri-pv-uckermark.jpg",
      features: [
        "Hochgeständer Agri-Module",
        "Foliengewächshaus-Integration",
        "Automatische Reinigung",
        "Bee-Friendly Design",
        "Regenerative Landwirtschaft"
      ],
      impact: [
        { label: "Agrarflächen-Effizienz", value: "165%" },
        { label: "Agrar-Ertrag Plus", value: "+22%" },
        { label: "Jährliche Ersparnis", value: "15.600€" },
        { label: "Nachhaltigkeits-Bonus", value: "Extra-Einnahmen" }
      ]
    }
  ];

  const certificates: Certificate[] = [
    {
      name: "Zertifizierter Solar-Installateur",
      year: 2024,
      description: "Qualifizierte Fachbetriebe für Solar-Installationen",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )
    },
    {
      name: "ISO 9001:2015",
      year: 2024,
      description: "Qualitätsmanagement-System zertifiziert",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      )
    },
    {
      name: "TÜV Rheinland",
      year: 2024,
      description: "Technische Sicherheit geprüft und zertifiziert",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )
    },
    {
      name: "Energie-Effizienz-Experte",
      year: 2024,
      description: "Fördermittel-Beratung von staatlich geprüften Experten",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    }
  ];

  const tabs = [
    { id: "testimonials", label: "Kundenstimmen", count: testimonials.length },
    { id: "projects", label: "Referenzprojekte", count: projects.length },
    { id: "certificates", label: "Zertifizierungen", count: certificates.length }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-bold text-green-600 uppercase tracking-wider">Erfolgsgeschichten</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">
            Über 2.500+ erfolgreiche Solar-Installationen
          </h2>
          <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
            Von Privathaushalten bis zu Großanlagen - entdecken Sie unsere Erfolgsgeschichten und 
            sehen Sie, wie unsere Kunden mit erneuerbarer Energie Geld sparen und die Umwelt schützen.
          </p>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">2.500+</div>
            <div className="text-slate-600">Installierte Anlagen</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">98,5%</div>
            <div className="text-slate-600">Kundenzufriedenheit</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">14,2%</div>
            <div className="text-slate-600">Ø Rendite p.a.</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
            <div className="text-slate-600">Jahre Erfahrung</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === index
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Testimonials Tab */}
        {activeTab === 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                {/* Avatar & Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-slate-500 text-sm">{testimonial.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <p className="font-semibold text-slate-800 mb-2">{testimonial.project}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Jährliche Ersparnis:</span>
                      <div className="font-bold text-green-600">{testimonial.savings}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">ROI:</span>
                      <div className="font-bold text-green-600">{testimonial.roi}</div>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-slate-700 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 1 && (
          <div className="space-y-12">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left: Project Details */}
                  <div>
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {project.type}
                        </span>
                        <span className="text-slate-500 text-sm">{project.completion}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{project.title}</h3>
                      <p className="text-slate-600 mb-4">{project.location}</p>
                    </div>

                    {/* Project Specs */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-sm text-slate-500 mb-1">Anlagengröße</div>
                        <div className="font-bold text-slate-900">{project.size}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-sm text-slate-500 mb-1">Jahresertrag</div>
                        <div className="font-bold text-slate-900">{project.output}</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Technische Features:</h4>
                      <div className="space-y-2">
                        {project.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-slate-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      {project.impact.map((metric, mIndex) => (
                        <div key={mIndex} className="bg-green-50 rounded-xl p-4 text-center">
                          <div className="text-xl font-bold text-green-600 mb-1">
                            {metric.value}
                          </div>
                          <div className="text-sm text-slate-600">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Project Image */}
                  <div className="lg:order-first">
                    <div className="bg-slate-200 rounded-2xl h-80 flex items-center justify-center">
                      <span className="text-slate-500">Projektbild: {project.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 2 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-green-600">
                    {cert.icon}
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{cert.name}</h4>
                <p className="text-sm text-slate-600 mb-3">{cert.description}</p>
                <div className="bg-green-50 rounded-lg px-3 py-1">
                  <span className="text-green-700 font-semibold text-sm">Seit {cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            Werden Sie unsere nächste Erfolgsgeschichte!
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Über 2.500 zufriedene Kunden haben bereits mit uns ihre nachhaltige Energiezukunft gestaltet. 
            Lassen Sie uns gemeinsam Ihr Solar-Projekt umsetzen.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl text-lg hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1">
              Kostenlose Beratung vereinbaren
            </button>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-green-600 transition-all duration-300">
              Referenzprojekt besichtigen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
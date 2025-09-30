import React, { useState } from 'react';

const benefits = [
  {
    title: 'Zusätzliche Einnahmen',
    description: 'Verdienen Sie Geld mit Ihrem Land, ohne die landwirtschaftliche Nutzung aufzugeben. Agri-PV-Anlagen generieren stabile Einnahmen durch Stromverkauf.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
    stat: '+30% Einnahmen',
    detail: 'pro Hektar im Vergleich zu konventioneller Landwirtschaft'
  },
  {
    title: 'Schutz vor Wetterextremen',
    description: 'Ihre Pflanzen sind geschützt vor Hagel, Starkregen und intensiver Sonneneinstrahlung. Gleichzeitig produzieren Sie sauberen Strom.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3h-12" />
      </svg>
    ),
    stat: '85% weniger Ernteausfälle',
    detail: 'durch Wetterschutz bei Extremwetterereignissen'
  },
  {
    title: 'Nachhaltige Zukunft',
    description: 'Werden Sie Teil der Energiewende und sichern Sie Ihren Hof für die nächste Generation. Agri-PV ist die Zukunft der Landwirtschaft.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    stat: '100% CO2-neutral',
    detail: 'Stromproduktion ohne fossile Brennstoffe'
  },
];

const testimonials = [
  {
    quote: '„Seit wir Agri-PV haben, sind unsere Erträge stabiler und wir verdienen zusätzlich 25.000€ pro Jahr durch Stromverkauf. Das hat unseren Hof gerettet."',
    author: 'Familie Müller',
    location: 'Brandenburg',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    quote: '„Die Anlage schützt unsere Pflanzen vor Hagel und produziert gleichzeitig sauberen Strom. Eine Win-Win-Situation für uns und die Umwelt."',
    author: 'Biohof Schneider',
    location: 'Bayern',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

const newsItems = [
  {
    title: 'Neue Förderungen für Agri-PV 2025',
    excerpt: 'Die Bundesregierung erhöht die Fördersätze für landwirtschaftliche Photovoltaik um 15%. Jetzt ist der ideale Zeitpunkt für Investitionen.',
    date: '28. Sep 2025',
    category: 'Förderung'
  },
  {
    title: 'Rekordertrag bei deutscher Agri-PV-Anlage',
    excerpt: 'Eine Anlage in Mecklenburg-Vorpommern erreicht 1.200 kWh/kWp – 20% über dem Durchschnitt. Moderne Technologie zahlt sich aus.',
    date: '25. Sep 2025',
    category: 'Technik'
  },
  {
    title: 'Landwirte sparen 40% Energiekosten',
    excerpt: 'Durch Eigenverbrauch und Direktvermarktung reduzieren Agri-PV-Betriebe ihre Stromkosten um durchschnittlich 40%.',
    date: '22. Sep 2025',
    category: 'Wirtschaft'
  }
];

const TrustSignals: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="relative py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 text-gray-900 overflow-hidden" aria-labelledby="agri-pv-heading">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-32 h-96 w-96 rounded-full bg-green-200/30 blur-[160px]" />
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-emerald-200/20 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-green-300/25 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">Für Landwirte & Agrarbetriebe</span>
          </div>

          <h2 id="agri-pv-heading" className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
            Ihr Land. Ihre Energie. Ihre Zukunft.
          </h2>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Nutzen Sie Ihre landwirtschaftlichen Flächen doppelt: Produzieren Sie hochwertige Lebensmittel UND sauberen Strom.
            Agri-Photovoltaik macht Ihren Betrieb zukunftssicher und profitabel.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-20">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors duration-300">
                    {benefit.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{benefit.stat}</div>
                    <div className="text-xs text-gray-500">{benefit.detail}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials & News */}
        <div className="grid gap-12 lg:grid-cols-2 mb-20">
          {/* Testimonials */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Erfolgsgeschichten aus der Praxis</h3>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <blockquote className="text-lg text-gray-700 mb-6 italic">
                {testimonials[activeTestimonial].quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonials[activeTestimonial].author}</div>
                  <div className="text-sm text-gray-500">{testimonials[activeTestimonial].location}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  aria-label={`Testimonial ${index + 1} anzeigen`}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* News */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Aktuelle Agri-PV News</h3>
            <div className="space-y-4">
              {newsItems.map((news, index) => (
                <div
                  key={news.title}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-green-600 bg-green-100 px-2 py-1 rounded">
                      {news.category}
                    </span>
                    <span className="text-xs text-gray-500">{news.date}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{news.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-6">Bereit für die Zukunft Ihres Hofes?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Lassen Sie uns gemeinsam prüfen, wie Agri-PV Ihren Betrieb voranbringt. Kostenlose Erstberatung und Wirtschaftlichkeitsberechnung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Kostenlose Beratung vereinbaren
            </button>
            <button className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition-all duration-300">
              Wirtschaftlichkeitsrechner
            </button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            ✓ Keine Anzahlung ✓ Individuelle Planung ✓ Fördermittel-Check ✓ 25 Jahre Garantie
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;

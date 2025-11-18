import React, { useState } from 'react';

interface CustomerBenefitsProps {
  customerType: 'private' | 'business';
}

const getStrengths = (customerType: 'private' | 'business') => {
  if (customerType === 'private') {
    return [
      {
        title: 'Testsieger 2025',
        description: 'Als mehrfach ausgezeichneter Solaranbieter bieten wir Ihnen höchste Qualität und Zuverlässigkeit. Unsere Anlagen überzeugen durch Leistung und Langlebigkeit.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ),
        stat: '5 Sterne',
        detail: 'in allen Kategorien'
      },
      {
        title: '100% Kostenlose Analyse',
        description: 'Wir analysieren Ihr Potenzial komplett kostenfrei. Von der ersten Beratung bis zum maßgeschneiderten Angebot - ohne versteckte Kosten oder Verpflichtungen.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        stat: '0 €',
        detail: 'für Erstanalyse'
      },
      {
        title: 'Premium-Partner',
        description: 'Wir arbeiten ausschließlich mit erstklassigen Herstellern zusammen. Von SMA bis LG - nur die besten Komponenten für Ihre Anlage.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        stat: '15+ Premium-Marken',
        detail: 'in unserem Portfolio'
      },
      {
        title: 'Fördermittel-Experten',
        description: 'Wir kennen alle Förderprogramme und sichern Ihnen die maximale Unterstützung. Von KfW bis Landesförderungen - wir holen das Maximum für Sie heraus.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        stat: 'bis zu 50%',
        detail: 'Förderung möglich'
      },
      {
        title: '25 Jahre Garantie',
        description: 'Unsere Anlagen sind für die Ewigkeit gebaut. Mit umfassender Garantie und Wartungsservice bleiben Sie langfristig sorglos.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        stat: '25 Jahre',
        detail: 'Leistungsgarantie'
      },
      {
        title: 'Individuelle Beratung',
        description: 'Jeder Kunde ist einzigartig. Wir nehmen uns Zeit für Ihre persönlichen Ziele und entwickeln maßgeschneiderte Lösungen für Ihr Zuhause oder Unternehmen.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
        stat: '98% Kundenzufriedenheit',
        detail: 'in der Beratung'
      }
    ];
  } else {
    return [
      {
        title: 'Unternehmens-Testsieger',
        description: 'Als führender Anbieter für gewerbliche Solaranlagen bieten wir skalierbare Lösungen für Unternehmen jeder Größe. Maximale Effizienz und Rentabilität.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        stat: '500+ Unternehmen',
        detail: 'erfolgreich beraten'
      },
      {
        title: 'ROI-Analyse kostenfrei',
        description: 'Detaillierte Wirtschaftlichkeitsberechnung für Ihr Unternehmen. Return on Investment, Amortisationszeit und langfristige Rentabilität transparent dargestellt.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        stat: '0 €',
        detail: 'für Wirtschaftlichkeitsanalyse'
      },
      {
        title: 'Premium-Industriepartner',
        description: 'Exklusive Partnerschaften mit führenden Herstellern für gewerbliche Anwendungen. Skalierbare Lösungen für Industrie und Gewerbe.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        stat: '25+ Premium-Hersteller',
        detail: 'für Gewerbeanwendungen'
      },
      {
        title: 'Fördermittel-Maximierung',
        description: 'Spezialisierte Fördermittelberatung für Unternehmen. Von BAFA bis Landesförderungen - wir maximieren Ihre Förderquote auf bis zu 70%.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        stat: 'bis zu 70%',
        detail: 'Förderung für Unternehmen'
      },
      {
        title: '30 Jahre Garantie',
        description: 'Industrielle Qualität für gewerbliche Anwendungen. Umfassende Garantiepakete und 24/7-Service für maximale Betriebssicherheit.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        stat: '30 Jahre',
        detail: 'Leistungsgarantie'
      },
      {
        title: 'Enterprise-Beratung',
        description: 'Dediziertes Beratungsteam für Großunternehmen. Individuelle Lösungen, skalierbare Konzepte und strategische Partnerschaft.',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        stat: '24/7 Support',
        detail: 'für Unternehmenskunden'
      }
    ];
  }
};

const getTestimonials = (customerType: 'private' | 'business') => {
  if (customerType === 'private') {
    return [
      {
        quote: '„ZOE Solar hat uns von Anfang an überzeugt. Die kostenlose Analyse war detailliert und das Angebot fair. Unsere Anlage läuft seit 3 Jahren einwandfrei."',
        author: 'Familie M.',
        type: 'Photovoltaik',
        location: 'Einfamilienhaus',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        quote: '„Die Solaranlage auf unserem Dach bringt 8% Rendite. Bessere Investition als Aktien. Danke für die kompetente Beratung!"',
        author: 'Familie K.',
        type: 'Photovoltaik',
        location: 'Mehrfamilienhaus',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        quote: '„Von der Planung bis zur Installation - alles lief reibungslos. Die Wallbox lädt unser E-Auto perfekt und wir sparen Stromkosten."',
        author: 'Dr. B.',
        type: 'Photovoltaik + Wallbox',
        location: 'Einfamilienhaus',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        quote: '„Die Elektroinstallation war top. Moderne Technik, faire Preise und hervorragender Service. Kann ich nur weiterempfehlen!"',
        author: 'Frau L.',
        type: 'Elektroinstallation',
        location: 'Wohnung',
        avatar: 'https://images.pexels.com/photos/1239292/pexels-photo-1239292.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        quote: '„Mit der Förderung von 40% war die Entscheidung leicht. ZOE Solar hat uns durch alle Formalitäten geführt. Sehr zufrieden!"',
        author: 'Herr P.',
        type: 'Photovoltaik',
        location: 'Einfamilienhaus',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        quote: '„Unser Stromverbrauch hat sich halbiert seit der Solaranlage. Die Investition hat sich schon nach 7 Jahren amortisiert."',
        author: 'Familie S.',
        type: 'Photovoltaik + Speicher',
        location: 'Doppelhaushälfte',
        avatar: 'https://images.pexels.com/photos/162539/architecture-man-people-woman-162539.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    ];
  } else {
    return [
      {
        quote: '„Als mittelständisches Unternehmen haben wir uns für ZOE Solar entschieden. Die ROI-Analyse war beeindruckend - Amortisation in unter 6 Jahren."',
        author: 'Herr M., Geschäftsführer',
        type: 'Gewerbliche PV',
        location: 'Produktionsbetrieb',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        quote: '„Die skalierbare Lösung von ZOE Solar passt perfekt zu unserem Wachstum. Von 50 kWp auf 200 kWp erweitert ohne Probleme."',
        author: 'Frau K., CFO',
        type: 'Solarpark',
        location: 'Logistikzentrum',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        quote: '„70% Förderung durch die BAFA - das hätte ich ohne ZOE Solar nie erreicht. Professionelle Beratung auf höchstem Niveau."',
        author: 'Dr. S., Technischer Leiter',
        type: 'Industrie-PV',
        location: 'Chemiebetrieb',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        quote: '„Die Eigenverbrauchsoptimierung spart uns jährlich 45.000€. Die Investition hat sich bereits nach 5 Jahren amortisiert."',
        author: 'Herr B., Einkaufsleiter',
        type: 'Gewerbe-PV',
        location: 'Einzelhandelskette',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        quote: '„Als Landwirt nutze ich die Agri-PV-Anlage optimal. Zusätzliche Einnahmen von 80.000€ pro Jahr bei gleichzeitiger Kulturschutz."',
        author: 'Bauer L., Agrarbetrieb',
        type: 'Agri-PV',
        location: 'Landwirtschaft 200 ha',
        avatar: 'https://images.pexels.com/photos/162539/architecture-man-people-woman-162539.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        quote: '„24/7-Support und die Enterprise-Beratung machen den Unterschied. ZOE Solar denkt strategisch mit uns."',
        author: 'Herr W., CEO',
        type: 'Solarpark',
        location: 'Energieversorger',
        avatar: 'https://images.pexels.com/photos/1239292/pexels-photo-1239292.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    ];
  }
};

const getNewsItems = (customerType: 'private' | 'business') => {
  if (customerType === 'private') {
    return [
      {
        title: 'KfW-Förderung 2025: Neue Rekordhöhen',
        excerpt: 'Die KfW erhöht die Fördersätze für Photovoltaik auf bis zu 50%. Wir sichern Ihnen die maximale Förderung.',
        date: '28. Sep 2025',
        category: 'Förderung'
      },
      {
        title: 'Solarstrom wird günstiger als Netzstrom',
        excerpt: 'In vielen Regionen ist Solarstrom bereits jetzt kostengünstiger. Der Trend setzt sich 2025 fort.',
        date: '25. Sep 2025',
        category: 'Markt'
      },
      {
        title: 'Neue Speicher-Technologien revolutionieren die Energiewende',
        excerpt: 'Moderne Batteriespeicher machen Solaranlagen noch effizienter und unabhängiger vom Netz.',
        date: '22. Sep 2025',
        category: 'Technik'
      }
    ];
  } else {
    return [
      {
        title: 'BAFA-Förderung 2025: Bis zu 70% für Unternehmen',
        excerpt: 'Neue Förderhöhen für gewerbliche Solaranlagen. Profitieren Sie von maximaler staatlicher Unterstützung.',
        date: '28. Sep 2025',
        category: 'Förderung'
      },
      {
        title: 'Solaranlagen als Kapitalanlage attraktiv',
        excerpt: 'Steuerliche Vorteile und hohe Renditen machen Solarparks zur lukrativen Investition für Unternehmen.',
        date: '25. Sep 2025',
        category: 'Investition'
      },
      {
        title: 'Industrielle Speichersysteme für Gewerbe',
        excerpt: 'Neue Großspeicher ermöglichen Lastspitzenkappung und maximieren die Wirtschaftlichkeit Ihrer Anlage.',
        date: '22. Sep 2025',
        category: 'Technik'
      }
    ];
  }
};

const WhyZoeSolar: React.FC<CustomerBenefitsProps> = ({ customerType }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const strengths = getStrengths(customerType);
  const testimonials = getTestimonials(customerType);
  const newsItems = getNewsItems(customerType);

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 overflow-hidden" aria-labelledby="why-zoe-heading">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-32 h-96 w-96 rounded-full bg-primary-500/5 blur-[160px]" />
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-blue-500/5 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-gray-200/30 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Warum ZOE Solar</span>
          </div>

          <h2 id="why-zoe-heading" className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-slate-900">
            Ihr vertrauensvoller Partner
            <span className="block text-primary-600">für die Energiewende</span>
          </h2>

          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Seit Jahren setzen wir Maßstäbe in der Solarbranche. Als Testsieger 2025 bieten wir Ihnen nicht nur Technik,
            sondern echte Partnerschaft auf dem Weg in Ihre energiegeladene Zukunft.
          </p>
        </div>

        {/* Strengths Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {strengths.map((strength, index) => (
            <div
              key={strength.title}
              className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-full bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors duration-300">
                    {strength.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">{strength.stat}</div>
                    <div className="text-xs text-slate-500">{strength.detail}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{strength.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {strength.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials & News */}
        <div className="grid gap-12 lg:grid-cols-2 mb-20">
          {/* Testimonials */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-slate-900 mb-8">Was unsere Kunden sagen</h3>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 backdrop-blur-sm">
              <blockquote className="text-lg text-slate-700 mb-6 italic">
                {testimonials[activeTestimonial].quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-slate-900">{testimonials[activeTestimonial].author}</div>
                  <div className="text-sm text-primary-600 font-medium">{testimonials[activeTestimonial].type}</div>
                  <div className="text-sm text-slate-500">{testimonials[activeTestimonial].location}</div>
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
                    index === activeTestimonial ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* News */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-slate-900 mb-8">Aktuelle Entwicklungen</h3>
            <div className="space-y-4">
              {newsItems.map((news, index) => (
                <div
                  key={news.title}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {news.category}
                    </span>
                    <span className="text-xs text-slate-500">{news.date}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">{news.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{news.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white border border-slate-200 rounded-3xl p-12 shadow-lg">
          <h3 className="text-4xl font-bold mb-6 text-slate-900">Bereit für Ihre Energiewende?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-600">
            Lassen Sie uns gemeinsam Ihre Möglichkeiten erkunden. Kostenlose Analyse, maßgeschneidertes Angebot und professionelle Beratung.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Kostenlose Analyse starten
            </button>
            <button className="border-2 border-primary-600 text-primary-600 font-bold py-4 px-8 rounded-lg hover:bg-primary-50 transition-all duration-300">
              Beratungsgespräch vereinbaren
            </button>
          </div>
          <p className="text-sm mt-6 text-slate-500">
            ✓ 100% kostenfrei ✓ Keine Verpflichtungen ✓ Individuelle Lösungen ✓ Premium-Qualität
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyZoeSolar;
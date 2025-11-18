import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { caseStudies, getCaseStudiesByLocation } from '../data/caseStudies';

const AgriPVErfahrungenPage: React.FC = () => {
  const agriPVCases = caseStudies.filter(study => study.category === 'agricultural');

  const experiences = [
    {
      farmer: 'Biohof Schmidt',
      location: 'Brandenburg',
      experience: 'Agri-PV hat unsere Tierhaltung revolutioniert. Die Kühe haben natürlichen Schatten, die Weiden sind grüner und wir sparen Wasser.',
      benefits: ['35% bessere Tiergesundheit', '25% Wassereinsparung', 'Zweite Einnahmequelle'],
      rating: 5,
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&auto=format&fit=crop'
    },
    {
      farmer: 'Weingut Müller',
      location: 'Rheinhessen',
      experience: 'Die Reben lieben den sanften Schatten. Unsere Weinqualität hat sich deutlich verbessert und wir produzieren klimaneutralen Strom.',
      benefits: ['18% höhere Traubenqualität', 'Natürlicher Frostschutz', 'Stabile Erträge'],
      rating: 5,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=400&auto=format&fit=crop'
    },
    {
      farmer: 'Gemüse Wagner',
      location: 'Sachsen-Anhalt',
      experience: 'Agri-PV schützt unsere empfindlichen Kulturen perfekt. Die Pflanzen wachsen besser und unsere Energiekosten sind um 40% gesunken.',
      benefits: ['22% höhere Ernteerträge', '40% Energiekostensenkung', '30% Wassereinsparung'],
      rating: 5,
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&auto=format&fit=crop'
    },
    {
      farmer: 'Obstplantage Huber',
      location: 'Bayern',
      experience: 'Hagelnetze waren gestern! Agri-PV bietet perfekten Schutz und unsere Äpfel sind saftiger und größer als je zuvor.',
      benefits: ['25% bessere Fruchtqualität', '100% Hagelschutz', 'Neue Einnahmequelle'],
      rating: 5,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop'
    },
    {
      farmer: 'Hopfen Krauss',
      location: 'Hallertau',
      experience: 'Unsere Brauerei läuft jetzt zu 100% auf Sonnenstrom. Der Hopfen ist aromatischer und wir haben Premium-Qualität erreicht.',
      benefits: ['20% bessere Hopfenqualität', '100% Eigenstrom', 'Klimaneutrales Bier'],
      rating: 5,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop'
    }
  ];

  const stats = [
    { value: '500+', label: 'Agri-PV Anlagen installiert', icon: '☀️' },
    { value: '98%', label: 'Zufriedenheit der Landwirte', icon: '😊' },
    { value: '25%', label: 'Durchschnittliche Ertragssteigerung', icon: '📈' },
    { value: '8 Jahre', label: 'Durchschnittliche Amortisation', icon: '💰' }
  ];

  const challenges = [
    {
      title: 'Wetterextreme & Klimawandel',
      description: 'Hitzewellen, Dürren und Hagel gefährden traditionelle Landwirtschaft.',
      solution: 'Agri-PV bietet natürlichen Schutz und optimiertes Mikroklima.'
    },
    {
      title: 'Hohe Energiekosten',
      description: 'Landwirtschaftliche Betriebe haben hohe Stromkosten für Bewässerung und Maschinen.',
      solution: 'Eigene Stromproduktion senkt Kosten um 30-50% und schafft Unabhängigkeit.'
    },
    {
      title: 'Flächenkonkurrenz',
      description: 'Begrenzte landwirtschaftliche Flächen werden für Solarparks genutzt.',
      solution: 'Agri-PV kombiniert beide Nutzungen auf derselben Fläche.'
    },
    {
      title: 'Einkommensunsicherheit',
      description: 'Wetterabhängige Ernten führen zu schwankenden Einkommen.',
      solution: 'Zweite, wetterunabhängige Einnahmequelle durch Stromverkauf.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <PageHero
        title="Agri-PV Erfahrungen"
        subtitle="Erfahrungen und Erfolgsgeschichten von Landwirten mit Agri-Photovoltaik"
        backgroundImage="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2050&auto=format&fit=crop"
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Agri-PV', href: '/agri-pv' },
          { label: 'Erfahrungen', href: '/agri-pv-erfahrungen' }
        ]}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-100">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-green-600 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 md:p-12 mb-16 border border-amber-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Warum Agri-PV die Zukunft der Landwirtschaft ist
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Agri-Photovoltaik revolutioniert die Landwirtschaft, indem sie Landwirten ermöglicht,
              gleichzeitig Nahrungsmittel anzubauen und sauberen Strom zu produzieren. Über 500 Betriebe
              in Deutschland haben bereits die Vorteile entdeckt und teilen ihre positiven Erfahrungen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl mb-3">🛡️</div>
                <h3 className="font-semibold text-gray-900 mb-2">Natürlicher Ernteschutz</h3>
                <p className="text-gray-600">Schutz vor Hagel, Sonnenbrand und extremen Wetterbedingungen.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl mb-3">🌱</div>
                <h3 className="font-semibold text-gray-900 mb-2">Nachhaltige Produktion</h3>
                <p className="text-gray-600">Klimawandelresistente Landwirtschaft mit reduziertem Wasserverbrauch.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges & Solutions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Häufige Herausforderungen & Agri-PV Lösungen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-red-600 mb-3">{challenge.title}</h3>
                <p className="text-gray-700 mb-4">{challenge.description}</p>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-green-800 font-medium">{challenge.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farmer Experiences */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Erfahrungen unserer Landwirte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.farmer}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{exp.farmer}</h3>
                    <span className="text-sm text-gray-500">{exp.location}</span>
                  </div>

                  <div className="flex items-center mb-4">
                    {[...Array(exp.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>

                  <blockquote className="text-gray-700 italic mb-4">
                    "{exp.experience}"
                  </blockquote>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600">Erfolge:</h4>
                    {exp.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2 flex-shrink-0">✅</span>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Detaillierte Fallstudien
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agriPVCases.slice(0, 4).map((caseStudy) => (
              <div key={caseStudy.slug} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={caseStudy.imageUrl}
                    alt={caseStudy.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{caseStudy.title}</h3>
                    <p className="text-sm text-gray-600">{caseStudy.location}</p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {caseStudy.excerpt}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{caseStudy.projectSize}</div>
                    <div className="text-xs text-gray-500">Leistung</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{caseStudy.roi}</div>
                    <div className="text-xs text-gray-500">Amortisation</div>
                  </div>
                </div>

                <Link
                  to={`/fallstudie/${caseStudy.slug}`}
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Vollständige Fallstudie lesen
                  <span className="ml-2">📈</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 text-center border border-green-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ihre Agri-PV Erfahrungen beginnen hier
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Werden Sie Teil der Agri-PV Revolution. Lassen Sie sich von unseren Experten beraten
            und profitieren Sie von der Erfahrung aus über 500 erfolgreichen Projekten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/agri-pv"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <span className="mr-2">👥</span>
              Agri-PV Planung starten
            </Link>
            <Link
              to="/foerdermittel/check"
              className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              <span className="mr-2">📈</span>
              Fördermittel prüfen
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AgriPVErfahrungenPage;
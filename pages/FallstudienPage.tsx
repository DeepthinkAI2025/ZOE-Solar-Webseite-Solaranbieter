import React from 'react';
import { Link } from 'react-router-dom';
import { caseStudies, getFeaturedCaseStudies } from '../data/caseStudies';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';
import Header from '../components/Header';

const FallstudienPage: React.FC = () => {
  const featuredCaseStudies = getFeaturedCaseStudies(6);

  const stats = [
    { label: 'Installierte Anlagen', value: '500+', icon: '☀️' },
    { label: 'Zufriedene Kunden', value: '98%', icon: '😊' },
    { label: 'Durchschnittlicher ROI', value: '6,5 Jahre', icon: '💰' },
    { label: 'CO₂-Einsparung', value: '2.500 t/Jahr', icon: '🌱' }
  ];

  const categories = [
    { key: 'residential', label: 'Wohngebäude', count: caseStudies.filter(cs => cs.category === 'residential').length },
    { key: 'commercial', label: 'Gewerbe', count: caseStudies.filter(cs => cs.category === 'commercial').length },
    { key: 'agricultural', label: 'Landwirtschaft', count: caseStudies.filter(cs => cs.category === 'agricultural').length }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <PageHero
        title="Fallstudien & Erfolgsgeschichten"
        subtitle="Erfahren Sie von erfolgreichen Photovoltaik-Projekten in ganz Deutschland"
        backgroundImage="https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2050&auto=format&fit=crop"
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Fallstudien', href: '/fallstudien' }
        ]}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center border border-blue-100">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Projekte nach Kategorie</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.key} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{category.label}</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {category.count} Projekte
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  {category.key === 'residential' && 'Von Einfamilienhäusern bis Mehrfamilienhäuser - sehen Sie, wie Privatkunden von Solaranlagen profitieren.'}
                  {category.key === 'commercial' && 'Gewerbliche Solaranlagen für Unternehmen, Industrie und Gewerbeimmobilien mit maximaler Wirtschaftlichkeit.'}
                  {category.key === 'agricultural' && 'Agri-PV Lösungen für Landwirte: Stromerzeugung über Ackerflächen ohne Beeinträchtigung der Bewirtschaftung.'}
                </p>
                <Link
                  to={`/fallstudien?kategorie=${category.key}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Alle {category.label}-Projekte ansehen
                  <span className="ml-2">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Case Studies */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Ausgewählte Projekte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCaseStudies.map((caseStudy) => (
              <div key={caseStudy.slug} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={caseStudy.imageUrl}
                    alt={caseStudy.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {caseStudy.category === 'residential' ? 'Wohngebäude' :
                       caseStudy.category === 'commercial' ? 'Gewerbe' : 'Landwirtschaft'}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <span>📍</span>
                      {caseStudy.location}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {caseStudy.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {caseStudy.excerpt}
                  </p>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{caseStudy.projectSize}</div>
                      <div className="text-xs text-gray-500">Leistung</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{caseStudy.roi}</div>
                      <div className="text-xs text-gray-500">Amortisation</div>
                    </div>
                  </div>

                  {/* Testimonial Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(caseStudy.testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Kundenzufriedenheit</span>
                  </div>

                  <Link
                    to={`/fallstudie/${caseStudy.slug}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Fallstudie lesen
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ihr Projekt als nächste Erfolgsgeschichte?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Lassen Sie sich von unseren Experten beraten und profitieren Sie von jahrelanger Erfahrung
            in der Planung und Installation von Photovoltaik-Anlagen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kontakt"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <span className="mr-2">👥</span>
              Kostenlose Beratung
            </Link>
            <Link
              to="/preise"
              className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              <span className="mr-2">📈</span>
              Preisrechner
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FallstudienPage;
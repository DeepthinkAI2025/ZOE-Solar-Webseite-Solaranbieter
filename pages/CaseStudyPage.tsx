import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCaseStudyBySlug, CaseStudy } from '../data/caseStudies';
import { localContentByCity } from '../data/localContent';
import PageHero from '../components/PageHero';
import Footer from '../components/Footer';
import Header from '../components/Header';

const CaseStudyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const caseStudy = slug ? getCaseStudyBySlug(slug) : undefined;

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fallstudie nicht gefunden</h1>
          <p className="text-gray-600 mb-8">Die gesuchte Fallstudie konnte nicht gefunden werden.</p>
          <Link
            to="/fallstudien"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">←</span>
            Zurück zu allen Fallstudien
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const locationData = localContentByCity[caseStudy.locationKey];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'residential': return '🏠';
      case 'commercial': return '🏢';
      case 'agricultural': return '🚜';
      default: return '⚡';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'residential': return 'Wohngebäude';
      case 'commercial': return 'Gewerbe';
      case 'agricultural': return 'Landwirtschaft';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <PageHero
        title={caseStudy.title}
        subtitle={`${caseStudy.clientName} • ${caseStudy.location}`}
        backgroundImage={caseStudy.imageUrl}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Fallstudien', href: '/fallstudien' },
          { label: caseStudy.location, href: `/standort/${caseStudy.locationKey}` },
          { label: caseStudy.title, href: `/fallstudie/${caseStudy.slug}` }
        ]}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {caseStudy.highlights.map((highlight, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <div className="text-3xl mb-2">{highlight.icon}</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{highlight.value}</div>
              <div className="text-sm text-gray-600">{highlight.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Overview */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <span>{getCategoryIcon(caseStudy.category)}</span>
                  <span className="font-semibold">{getCategoryLabel(caseStudy.category)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📍</span>
                  <span>{caseStudy.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📅</span>
                  <span>{new Date(caseStudy.date).toLocaleDateString('de-DE')}</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Projektübersicht</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{caseStudy.excerpt}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Leistung</div>
                  <div className="font-bold text-blue-600">{caseStudy.projectSize}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Installationszeit</div>
                  <div className="font-bold text-blue-600">{caseStudy.installationTime}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Amortisation</div>
                  <div className="font-bold text-blue-600">{caseStudy.roi}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">CO₂-Einsparung</div>
                  <div className="font-bold text-blue-600">{caseStudy.co2Savings}</div>
                </div>
              </div>
            </div>

            {/* Challenge & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-xl p-8 border border-red-100">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    ⚠️
                  </span>
                  Herausforderung
                </h3>
                <p className="text-red-700 leading-relaxed">{caseStudy.challenge}</p>
              </div>

              <div className="bg-green-50 rounded-xl p-8 border border-green-100">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    ✅
                  </span>
                  Lösung
                </h3>
                <p className="text-green-700 leading-relaxed">{caseStudy.solution}</p>
              </div>
            </div>

            {/* Results */}
            <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Ergebnisse
              </h3>
              <p className="text-blue-700 leading-relaxed text-lg">{caseStudy.results}</p>
            </div>

            {/* Technical Details */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Technische Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Komponenten</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Module:</strong> {caseStudy.technicalDetails.modules}</li>
                    <li><strong>Wechselrichter:</strong> {caseStudy.technicalDetails.inverter}</li>
                    {caseStudy.technicalDetails.battery && (
                      <li><strong>Batterie:</strong> {caseStudy.technicalDetails.battery}</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Installation</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Dachtyp:</strong> {caseStudy.technicalDetails.roofType}</li>
                    <li><strong>Ausrichtung:</strong> {caseStudy.technicalDetails.orientation}</li>
                    <li><strong>Neigung:</strong> {caseStudy.technicalDetails.tilt}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {caseStudy.gallery && caseStudy.gallery.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Projektgalerie</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {caseStudy.gallery.map((image, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${caseStudy.title} - Bild ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Testimonial */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Kundenstimmen</h3>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(caseStudy.testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <blockquote className="text-gray-700 italic mb-4">
                  "{caseStudy.testimonial.quote}"
                </blockquote>
                <div className="text-sm text-gray-600">
                  <div className="font-semibold">{caseStudy.testimonial.author}</div>
                  <div>{caseStudy.testimonial.position}</div>
                </div>
              </div>
            </div>

            {/* Related Services */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Verwandte Leistungen</h3>
              <div className="space-y-3">
                {caseStudy.relatedServices.map((service, index) => (
                  <Link
                    key={index}
                    to={service.url}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-blue-600">{service.title}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Location CTA */}
            {locationData && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Standort {caseStudy.location}</h3>
                <p className="text-gray-700 mb-6">
                  Erfahren Sie mehr über unsere Dienstleistungen in {caseStudy.location} und lassen Sie sich individuell beraten.
                </p>
                <Link
                  to={`/standort/${caseStudy.locationKey}`}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span className="mr-2">📍</span>
                  Standort besuchen
                </Link>
              </div>
            )}

            {/* Contact CTA */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 border border-orange-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Jetzt beraten lassen</h3>
              <p className="text-gray-700 mb-6">
                Interessiert an einer ähnlichen Lösung? Kontaktieren Sie unsere Experten für eine kostenlose Erstberatung.
              </p>
              <Link
                to="/kontakt"
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <span className="mr-2">✅</span>
                Kostenlose Beratung
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Case Studies */}
        <div className="mt-16 text-center">
          <Link
            to="/fallstudien"
            className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="mr-2">←</span>
            Zurück zu allen Fallstudien
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CaseStudyPage;
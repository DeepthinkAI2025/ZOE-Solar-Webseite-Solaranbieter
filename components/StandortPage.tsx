import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { pageHeroData } from '../data/pageContent';
import { localContentByCity } from '../data/localContent';

interface StandortPageProps {
  locationKey?: keyof typeof localContentByCity;
  city: string;
  state: string;
  regionCode: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
}

const StandortPage: React.FC<StandortPageProps> = ({
  locationKey,
  city,
  state,
  regionCode,
  postalCode,
  latitude,
  longitude,
  radiusKm
}) => {
  const displayCity = city;
  const localContent = locationKey ? localContentByCity[locationKey] : undefined;

  const heroData = {
    title: `Solaranlagen in ${displayCity}`,
    subtitle: `Professionelle Photovoltaik-Lösungen für ${displayCity} und Umgebung`,
    description: `Als regionaler Experte für Solaranlagen bieten wir in ${displayCity} und einem Umkreis von ${radiusKm} km maßgeschneiderte Photovoltaik-Lösungen. Von der Beratung über die Planung bis zur Installation - alles aus einer Hand.`,
    primaryCta: {
      text: 'Jetzt beraten lassen',
      href: '/kontakt'
    },
    secondaryCta: {
      text: 'Förderungen prüfen',
      href: '/foerdermittel/check'
    },
    bgImage: pageHeroData.photovoltaik.bgImage,
    imageAlt: `Solaranlagen Installation in ${displayCity}`
  };

  return (
    <div className="min-h-screen">
      <PageHero {...heroData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Lokale Informationen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ihr Solar-Partner in {displayCity}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Mit über 10 Jahren Erfahrung sind wir Ihr vertrauensvoller Partner für Solaranlagen
              in {displayCity} und der Region {state}. Wir planen und installieren Photovoltaik-Anlagen
              für Privatkunden, Gewerbebetriebe und landwirtschaftliche Betriebe.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Kostenlose Erstberatung vor Ort</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Komplette Systemplanung inklusive</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Alle Förderungen und Zuschüsse</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>24/7 Wartung und Support</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Service-Gebiet {displayCity}
            </h3>

            <div className="space-y-4">
              <div>
                <strong className="text-gray-900">Region:</strong>
                <p className="text-gray-600">{state}, Deutschland</p>
              </div>

              <div>
                <strong className="text-gray-900">Postleitzahl:</strong>
                <p className="text-gray-600">{postalCode}</p>
              </div>

              <div>
                <strong className="text-gray-900">Service-Radius:</strong>
                <p className="text-gray-600">{radiusKm} km um {displayCity}</p>
              </div>

              <div>
                <strong className="text-gray-900">Koordinaten:</strong>
                <p className="text-gray-600">{latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="/kontakt"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Termin vereinbaren
              </a>
            </div>
          </div>
        </div>

        {/* Lokale Referenzen */}
  <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Erfolgreiche Projekte in {displayCity}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Installierte Anlagen</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2.5 MWp</div>
              <div className="text-gray-600">Installierte Leistung</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Kundenzufriedenheit</div>
            </div>
          </div>
        </div>

        {/* Lokale Förderungen */}
        <div className="bg-blue-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Aktuelle Förderungen für {displayCity}
          </h3>

          <p className="text-lg text-gray-700 mb-6 text-center">
            Profitieren Sie von regionalen und bundesweiten Förderprogrammen.
            Wir übernehmen die komplette Antragsstellung für Sie.
          </p>

          <div className="text-center">
            <a
              href="/foerdermittel/check"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Förderungen berechnen
            </a>
          </div>
        </div>
        {localContent?.introStat && (
          <div className="bg-blue-600 text-white rounded-lg px-6 py-8 text-center shadow-xl">
            <p className="text-lg font-medium uppercase tracking-wide">Regionale Erfolgsbilanz</p>
            <p className="text-3xl font-semibold mt-3">{localContent.introStat}</p>
          </div>
        )}

        {localContent?.blogPosts?.length ? (
          <section className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">Aktuelle Insights aus {displayCity}</h3>
              <p className="text-gray-600 mt-2">
                Fachartikel und Nachrichten mit direktem Bezug zu Ihrer Region.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {localContent.blogPosts.map((post) => (
                <article
                  key={post.title}
                  className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h4>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <Link
                    to={post.url}
                    className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {post.cta}
                    <span aria-hidden className="ml-2">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {localContent?.caseStudies?.length ? (
          <section className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">Regionale Referenzen</h3>
              <p className="text-gray-600 mt-2">
                Ausgewählte Projekte, die zeigen, wie wir Standorte wie {displayCity} erfolgreich elektrifizieren.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {localContent.caseStudies.map((project) => (
                <article
                  key={project.title}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">{project.title}</h4>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      Erfolgsprojekt
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {project.highlights.map((item) => (
                      <div key={`${project.title}-${item.label}`} className="bg-gray-50 rounded-lg px-3 py-4 text-center">
                        <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                        <dd className="text-lg font-semibold text-gray-900 mt-1">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {(project.url || project.cta) && (
                    <Link
                      to={project.url ?? '/kontakt'}
                      className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {project.cta ?? 'Jetzt beraten lassen'}
                      <span aria-hidden className="ml-2">→</span>
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {localContent?.serviceLinks?.length ? (
          <section className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">Direkte Services für {displayCity}</h3>
              <p className="text-gray-600 mt-2">Nutzen Sie unsere beliebtesten Angebote für Ihre Region.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {localContent.serviceLinks.map((service) => (
                <article
                  key={service.title}
                  className="h-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h4>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                  <Link
                    to={service.url}
                    className="mt-6 inline-flex items-center font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {service.cta}
                    <span aria-hidden className="ml-2">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default StandortPage;
import React from 'react';
import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';

const PhotovoltaikPlanungGewerbePage: React.FC = () => {
  const heroData = {
    title: 'Photovoltaik-Planung für Gewerbe & Industrie',
    subtitle: 'Ganzheitliche Planung, die Ihre Investition in jede Projektphase absichert',
    description:
      'Wir begleiten Unternehmen von der ersten Machbarkeitsanalyse bis zur baureifen Ausführungsplanung. Profitieren Sie von präzisen Daten, optimierten Erträgen und nahtlos abgestimmten Gewerken.',
    primaryCta: {
      text: 'Planungsworkshop buchen',
      href: '/kontakt',
    },
    secondaryCta: {
      text: 'Referenzen ansehen',
      href: '/fallstudien',
    },
    bgImage:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Technische Planung einer gewerblichen Photovoltaikanlage',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero {...heroData} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <AnimatedSection>
          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Strategische Photovoltaik-Planung für professionelle Energieprojekte
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Gewerbliche PV-Projekte erfordern ein präzises Zusammenspiel aus Technik, Wirtschaftlichkeit
                und Genehmigungsfähigkeit. Wir entwickeln belastbare Planungsgrundlagen, damit Ihr Projekt
                terminsicher umgesetzt und langfristig wirtschaftlich betrieben werden kann.
              </p>
            </header>

            <section className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Kernleistungen in der Planungsphase</h2>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <span className="mt-1 mr-3 inline-flex h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <strong className="text-gray-900">Machbarkeits- & Potenzialanalyse</strong>
                      <p>Standortbewertung, Netzanschlussprüfung und Flächennutzungskonzepte inklusive Ertragssimulation.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mt-1 mr-3 inline-flex h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <strong className="text-gray-900">Technische Auslegung & CAD-Planung</strong>
                      <p>Modulbelegung, Verschattungsanalysen, statische Vorbemessung und Kabelführung im digitalen Zwilling.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="mt-1 mr-3 inline-flex h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <strong className="text-gray-900">Genehmigungs- & Ausschreibungsunterlagen</strong>
                      <p>Einreichungsfähige Pläne, Leistungsverzeichnisse und Schnittstellenkoordination mit Behörden und Netzbetreibern.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <aside className="bg-green-50 border border-green-100 rounded-xl p-6 space-y-6">
                <h3 className="text-xl font-semibold text-green-900">Ihre Vorteile</h3>
                <ul className="space-y-4 text-green-900/80">
                  <li>• Reduziertes Projektrisiko durch belastbare Datenbasis</li>
                  <li>• Optimale CAPEX/OPEX dank wirtschaftlicher Dimensionierung</li>
                  <li>• Klare Entscheidungsgrundlagen für Investoren & Gremien</li>
                  <li>• Koordination aller Gewerke vor Baubeginn</li>
                </ul>
                <div className="rounded-lg bg-white p-5 shadow-inner">
                  <h4 className="font-semibold text-gray-900">Ergebnisdokumente</h4>
                  <p className="mt-2 text-sm text-gray-600">
                    Technische Konzeptmappe, Simulationsergebnisse, Kostenschätzung, Termin- und Ressourcenplan, Genehmigungscheckliste.
                  </p>
                </div>
              </aside>
            </section>
          </article>
        </AnimatedSection>

        <AnimatedSection>
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Planungsprozess in fünf Phasen</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  title: '1. Analyse',
                  description:
                    'Standortaufnahme, Lastprofil-Analyse, Netzanschlussscreening und Fördermittel-Check liefern die Entscheidungsgrundlage.',
                },
                {
                  title: '2. Konzept',
                  description:
                    'Layout-Varianten, Ertrags- und Renditeberechnungen sowie Grobstatik für Dach- oder Freiflächenanlagen.',
                },
                {
                  title: '3. Detailplanung',
                  description:
                    'Komponenten-Spezifikation, Stringplanung, Kabeltrassen, Steuerungs- und Monitoringkonzept.',
                },
                {
                  title: '4. Genehmigung',
                  description:
                    'Erstellung aller technischen Unterlagen für Netzbetreiber, Bauamt und Förderstellen inklusive Nachreichungen.',
                },
                {
                  title: '5. Ausschreibung',
                  description:
                    'Leistungsverzeichnisse, Bewertungsmatrix und Vergabe-Empfehlung für einen transparenten Beschaffungsprozess.',
                },
              ].map((step, index) => (
                <div key={step.title} className="relative h-full rounded-xl border border-gray-100 p-5">
                  <span className="absolute -top-4 left-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white font-semibold shadow-md">
                    {index + 1}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 rounded-2xl shadow-lg text-white p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Bereit für Ihren Planungsstart?</h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Sichern Sie sich einen strukturierten Projektablauf, verlässliche Kostenrahmen und messbare Ertragsprognosen. Unser Planungsteam begleitet Sie bis zur fertigen Ausschreibung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/kontakt"
                className="bg-white text-green-600 font-semibold py-3 px-8 rounded-lg shadow hover:bg-gray-100 transition-colors"
              >
                Beratungstermin vereinbaren
              </a>
              <a
                href="/photovoltaik-rechner-gewerbe"
                className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors"
              >
                Projektpotenzial berechnen
              </a>
            </div>
            <p className="mt-6 text-sm text-white/80">
              Optional integrieren wir Ihre Planung direkt mit Speicher-, Lade- und Gebäudeautomationskonzepten.
            </p>
          </section>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default PhotovoltaikPlanungGewerbePage;
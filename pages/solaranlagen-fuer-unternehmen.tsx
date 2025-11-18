/**
 * Comprehensive Pillar Page: Solaranlagen für Unternehmen
 *
 * Haupt-Pillar Page für gewerbliche Photovoltaik
 * Deutsche SEO-Optimierung mit allen Keywords und Schema-Typen
 */

import { GetStaticProps } from 'next';
import SEOHead from '../components/SEOHead';
import { performanceOptimizationService } from '../services/performance-optimization-service';

interface PillarPageProps {
  seoData: {
    title: string;
    description: string;
    keywords: string[];
    structuredData: any;
  };
  contentData: {
    sections: Array<{
      id: string;
      title: string;
      content: string;
      image?: string;
      cta?: {
        text: string;
        link: string;
      };
    }>;
    faq: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export default function SolaranlagenFuerUnternehmen({ seoData, contentData }: PillarPageProps) {
  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords.join(', ')}
        article={false}
        jsonLd={seoData.structuredData}
      />

      {/* Hero Section mit Core Web Vitals Optimierung */}
      <section className="hero-section" data-service="performance">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Solaranlagen für Unternehmen
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Profitieren Sie von gewerblichen Photovoltaik-Anlagen mit bis zu 25% Rendite.
                ZOE Solar plant und installiert maßgeschneiderte Solarlösungen für Unternehmen in ganz Deutschland.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="#kontakt"
                  className="bg-amber-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                >
                  Kostenlose Beratung anfordern
                </a>
                <a
                  href="#rechner"
                  className="border-2 border-amber-500 text-amber-500 px-8 py-4 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
                >
                  Solarrechner
                </a>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-amber-500">25%</div>
                  <div className="text-sm text-gray-600">Rendite</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-500">20%</div>
                  <div className="text-sm text-gray-600">Förderung</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-500">25J</div>
                  <div className="text-sm text-gray-600">Garantie</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/solaranlagen-unternehmen-hero.webp"
                alt="Gewerbliche Solaranlage auf Firmendach"
                className="rounded-lg shadow-2xl w-full"
                loading="eager"
                width="600"
                height="400"
              />
              {/* Schema Markup für Hero Image */}
              <meta itemProp="image" content="https://zoe-solar.de/images/solaranlagen-unternehmen-hero.webp" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Content Sections */}
      {contentData.sections.map((section) => (
        <section key={section.id} id={section.id} className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={section.id % 2 === 0 ? 'order-2' : ''}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {section.title}
                </h2>
                <div
                  className="prose prose-lg text-gray-600"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
                {section.cta && (
                  <div className="mt-8">
                    <a
                      href={section.cta.link}
                      className="inline-flex items-center bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      {section.cta.text}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
              {section.image && (
                <div className={section.id % 2 === 0 ? 'order-1' : ''}>
                  <img
                    src={section.image}
                    alt={section.title}
                    className="rounded-lg shadow-lg w-full"
                    loading="lazy"
                    width="500"
                    height="350"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Vorteile Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Ihre Vorteile mit ZOE Solar
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '💰',
                title: 'Kostenersparnis',
                description: 'Reduzieren Sie Ihre Stromkosten um bis zu 70% und werden Sie unabhängig von Preissteigerungen.'
              },
              {
                icon: '🌱',
                title: 'Nachhaltigkeit',
                description: 'Positionieren Sie sich als umweltbewusstes Unternehmen und verbessern Sie Ihr Image.'
              },
              {
                icon: '📈',
                title: 'Rendite',
                description: 'Erzielen Sie attraktive Renditen von 8-15% durch staatliche Förderung und Einsparungen.'
              },
              {
                icon: '🏭',
                title: 'Planungssicherheit',
                description: 'Fixe Strompreise für 25 Jahre durch Ihre eigene Solaranlage.'
              },
              {
                icon: '🔧',
                title: 'Service',
                description: 'Komplettservice von Planung bis Wartung aus einer Hand.'
              },
              {
                icon: '🏆',
                title: 'Qualität',
                description: 'Nur Premium-Produkte von führenden Herstellern mit 25 Jahren Garantie.'
              }
            ].map((vorteil, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{vorteil.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{vorteil.title}</h3>
                <p className="text-gray-600">{vorteil.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kosten & Förderung Section */}
      <section id="kosten-foerderung" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Kosten & Förderung für gewerbliche Solaranlagen
          </h2>

          {/* Kosten Calculator */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ihre persönliche Kostenkalkulation</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gewünschte Anlagengröße (kWp)
                </label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  defaultValue="100"
                  className="w-full mb-2"
                  id="leistung-slider"
                />
                <div className="text-center font-bold text-amber-500" id="leistung-display">100 kWp</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standort
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg" id="standort-select">
                  <option value="berlin">Berlin</option>
                  <option value="muenchen">München</option>
                  <option value="hamburg">Hamburg</option>
                  <option value="koeln">Köln</option>
                  <option value="frankfurt">Frankfurt</option>
                </select>
              </div>
            </div>
            <div className="mt-8 p-6 bg-amber-50 rounded-lg">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Geschätzte Investition</div>
                  <div className="text-2xl font-bold text-gray-900" id="investition">€100.000</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Förderung</div>
                  <div className="text-2xl font-bold text-green-600" id="foerderung">€20.000</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Ihre Kosten</div>
                  <div className="text-2xl font-bold text-amber-600" id="netto-kosten">€80.000</div>
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <a href="#kontakt" className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                Detailliertes Angebot anfordern
              </a>
            </div>
          </div>

          {/* Förderprogramme */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">KfW Bankprogramm</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Zinsgünstige Kredite (1,23% effektiver Zins)</li>
                <li>• Kreditbetrag bis zu 25 Mio. €</li>
                <li>• Laufzeit bis zu 20 Jahre</li>
                <li>• Tilgungszuschüsse möglich</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">BAFA Förderung</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Investitionszuschuss für Speicher</li>
                <li>• Bis zu 3.300 € pro Speicher</li>
                <li>• De-minimis-Beihilfe</li>
                <li>• Einfache Online-Bewerbung</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50" data-service="faq">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Häufige Fragen zu gewerblichen Solaranlagen
          </h2>
          <div className="max-w-3xl mxspace-y-4">
            {contentData.faq.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                  onClick={() => {
                    const content = document.getElementById(`faq-content-${index}`);
                    const button = content?.previousElementSibling as HTMLButtonElement;
                    if (content) {
                      content.classList.toggle('hidden');
                      button.innerHTML = button.innerHTML.replace('▶', '▼').replace('▼', '▶');
                    }
                  }}
                >
                  <span>▶</span> {item.question}
                </button>
                <div id={`faq-content-${index}`} className="hidden px-6 py-4 text-gray-600 border-t">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standorte Section */}
      <section id="standorte" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Unsere Standorte in Deutschland
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                city: 'Berlin',
                address: 'Alt-Moabit 101, 10559 Berlin',
                phone: '+49 30 12345678',
                email: 'berlin@zoe-solar.de',
                radius: '100km'
              },
              {
                city: 'München',
                address: 'Sendlinger Str. 45, 80331 München',
                phone: '+49 89 12345678',
                email: 'muenchen@zoe-solar.de',
                radius: '100km'
              },
              {
                city: 'Hamburg',
                address: 'Rathausstraße 1, 20095 Hamburg',
                phone: '+49 40 12345678',
                email: 'hamburg@zoe-solar.de',
                radius: '100km'
              }
            ].map((standort, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">ZOE Solar {standort.city}</h3>
                <div className="space-y-2 text-gray-600">
                  <p>📍 {standort.address}</p>
                  <p>📞 {standort.phone}</p>
                  <p>📧 {standort.email}</p>
                  <p>🗺️ Umkreis {standort.radius}</p>
                </div>
                <div className="mt-6">
                  <a
                    href={`#kontakt?standort=${standort.city.toLowerCase()}`}
                    className="text-amber-500 font-semibold hover:text-amber-600 transition-colors"
                  >
                    Beratung in {standort.city} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontakt Section */}
      <section id="kontakt" className="py-16 bg-amber-50" data-service="contact">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Kostenlose Beratung anfordern
          </h2>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                // Form submission logic
                alert('Vielen Dank für Ihre Anfrage! Wir melden uns innerhalb von 24 Stunden bei Ihnen.');
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unternehmen *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gewünschte Anlagengröße (kWp)
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="">Bitte wählen</option>
                  <option value="10-50">10 - 50 kWp</option>
                  <option value="50-100">50 - 100 kWp</option>
                  <option value="100-500">100 - 500 kWp</option>
                  <option value="500+">500+ kWp</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ihre Nachricht
                </label>
                <textarea
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Beschreiben Sie kurz Ihr Vorhaben..."
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-amber-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                >
                  Kostenfreie Beratung anfordern
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  * Pflichtfelder | Ihre Daten werden vertraulich behandelt.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* JavaScript für Interaktivität */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Kosten Calculator
          const leistungSlider = document.getElementById('leistung-slider');
          const leistungDisplay = document.getElementById('leistung-display');
          const investition = document.getElementById('investition');
          const foerderung = document.getElementById('foerderung');
          const nettoKosten = document.getElementById('netto-kosten');

          if (leistungSlider) {
            leistungSlider.addEventListener('input', function() {
              const leistung = this.value;
              leistungDisplay.textContent = leistung + ' kWp';

              const kosten = leistung * 1000;
              const foerderungBetrag = kosten * 0.2;
              const netto = kosten - foerderungBetrag;

              investition.textContent = '€' + kosten.toLocaleString('de-DE');
              foerderung.textContent = '€' + foerderungBetrag.toLocaleString('de-DE');
              nettoKosten.textContent = '€' + netto.toLocaleString('de-DE');
            });
          }
        `
      }} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // SEO Data
  const seoData = {
    title: "Solaranlagen für Unternehmen | Gewerbliche Photovoltaik von ZOE Solar",
    description: "Professionelle Solaranlagen für Unternehmen von ZOE Solar. Planung, Installation und Wartung von gewerblichen Photovoltaik-Anlagen in ganz Deutschland. Kostenlose Beratung ✓ Hohe Rendite ✓ 25J Garantie ✓ Fördermittel-Support ✓",
    keywords: [
      "Solaranlagen für Unternehmen",
      "Photovoltaik Gewerbe",
      "gewerbliche Solaranlagen",
      "Solaranlage Kosten",
      "Photovoltaik Rendite",
      "Solarförderung Unternehmen",
      "Photovoltaik Finanzierung",
      "Solaranlagen Hersteller"
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Solaranlagen für Unternehmen",
      "description": "Professionelle Solaranlagen für Unternehmen von ZOE Solar in Deutschland",
      "url": "https://zoe-solar.de/solaranlagen-fuer-unternehmen",
      "about": {
        "@type": "Thing",
        "name": "Gewerbliche Photovoltaik"
      },
      "mainEntity": {
        "@type": "Service",
        "name": "Solaranlagen für Unternehmen",
        "description": "Planung und Installation von gewerblichen Solaranlagen",
        "provider": {
          "@type": "Organization",
          "name": "ZOE Solar GmbH"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Germany"
        }
      }
    }
  };

  // Content Data
  const contentData = {
    sections: [
      {
        id: "was-ist-photovoltaik",
        title: "Was ist gewerbliche Photovoltaik?",
        content: `
          <p>Gewerbliche Photovoltaik bezeichnet die Installation von Solaranlagen auf Unternehmensgebäuden oder Firmengrundstücken. Im Gegensatz zu privaten Anlagen sind gewerbliche Solaranlagen typischerweise größer und auf die spezifischen Bedürfnisse von Unternehmen zugeschnitten.</p>
          <p>Unternehmen profitieren dabei von mehreren Vorteilen: deutliche Kosteneinsparungen bei den Stromrechnungen, steuerliche Vorteile, verbesserte CO₂-Bilanz und ein positives Image als umweltbewusstes Unternehmen.</p>
          <p><strong>Typische Anlagengrößen:</strong></p>
          <ul>
            <li>Kleine Unternehmen: 10-50 kWp</li>
            <li>Mittelständische Betriebe: 50-500 kWp</li>
            <li>Industrieanlagen: 500-1000+ kWp</li>
          </ul>
        `,
        image: "/images/photovoltaik-wirtschaft.webp",
        cta: {
          text: "Passende Anlage finden",
          link: "#rechner"
        }
      },
      {
        id: "kosten-uebersicht",
        title: "Kostenübersicht für gewerbliche Solaranlagen",
        content: `
          <p>Die Kosten für eine gewerbliche Solaranlage setzen sich aus mehreren Faktoren zusammen. Als Faustregel können Sie mit <strong>1.000-1.500 € pro kWp</strong> installierter Leistung rechnen.</p>
          <p><strong>Kostenbeispiele:</strong></p>
          <ul>
            <li><strong>50 kWp Anlage:</strong> ca. 50.000-75.000 €</li>
            <li><strong>100 kWp Anlage:</strong> ca. 100.000-150.000 €</li>
            <li><strong>500 kWp Anlage:</strong> ca. 500.000-750.000 €</li>
          </ul>
          <p>Durch staatliche Förderungen können bis zu 20-30% der Kosten eingespart werden. Die Amortisationszeit liegt typischerweise bei 8-12 Jahren.</p>
        `,
        image: "/images/solaranlagen-kosten.webp",
        cta: {
          text: "Kostenkalkulation starten",
          link: "#kosten-foerderung"
        }
      },
      {
        id: "foerderung",
        title: "Förderprogramme und Zuschüsse",
        content: `
          <p>Unternehmen in Deutschland können von verschiedenen Förderprogrammen profitieren, die die Investition in Solaranlagen deutlich attraktiver machen:</p>
          <p><strong>KfW Bankprogramm:</strong> Zinsgünstige Kredite mit Tilgungszuschüssen. Die Konditionen sind aktuell besonders günstig mit effektiven Zinsen ab 1,23%.</p>
          <p><strong>BAFA Förderung:</strong> Direkte Zuschüsse für Solarspeicher, insbesondere für Unternehmen. Bis zu 3.300 € pro Speicher sind möglich.</p>
          <p><strong>Regionale Förderungen:</strong> Viele Bundesländer und Kommunen bieten zusätzliche Zuschüsse. Wir unterstützen Sie bei der Beantragung aller verfügbaren Fördermittel.</p>
        `,
        image: "/images/foerderung-photovoltaik.webp",
        cta: {
          text: "Förderung prüfen",
          link: "#kontakt"
        }
      }
    ],
    faq: [
      {
        question: "Was kostet eine gewerbliche Solaranlage?",
        answer: "Die Kosten für eine gewerbliche Solaranlage liegen durchschnittlich bei 1.000-1.500 € pro Kilowatt-Peak (kWp). Eine 100 kWp Anlage kostet somit ca. 100.000-150.000 €. Durch Förderungen können bis zu 30% der Kosten eingespart werden."
      },
      {
        question: "Welche Förderungen gibt es für gewerbliche Photovoltaik?",
        answer: "Unternehmen können KfW-Kredite mit günstigen Zinsen, BAFA-Zuschüsse für Speicher und regionale Förderprogramme nutzen. Insgesamt können bis zu 30% der Investitionskosten gefördert werden."
      },
      {
        question: "Wie hoch ist die Rendite bei gewerblichen Solaranlagen?",
        answer: "Die Rendite liegt typischerweise bei 8-15% pro Jahr, abhängig von Standort, Anlagengröße und Strompreisentwicklung. Die Amortisationszeit beträgt meist 8-12 Jahre."
      },
      {
        question: "Ist meine Dachfläche für eine Solaranlage geeignet?",
        answer: "Ideal sind Dächer mit südlicher Ausrichtung und 30-35° Neigung. Aber auch Ost-West-Dächer können rentabel sein. Wir prüfen kostenlos die Eignung Ihres Daches."
      },
      {
        question: "Welche Genehmigungen werden benötigt?",
        answer: "In den meisten Fällen genügt eine Bauanmeldung. Bei Anlagen über 100 kWp kann ein vollständiges Baugenehmigungsverfahren erforderlich sein. Wir übernehmen die gesamte Abwicklung."
      },
      {
        question: "Wie lange dauert die Installation?",
        answer: "Die Planungsphase dauert 2-4 Wochen, die Genehmigung 4-8 Wochen. Die eigentliche Montage ist je nach Anlagengröße in 1-5 Tagen abgeschlossen."
      },
      {
        question: "Welche Wartung ist erforderlich?",
        answer: "Solaranlagen sind sehr wartungsarm. Wir empfehlen eine jährliche Inspektion und alle 2-3 Jahre eine Reinigung der Module. Viele Hersteller bieten 25 Jahre Leistungsgarantie."
      },
      {
        question: "Kann ich Solarstrom speichern?",
        answer: "Ja, Solarspeicher sind für Unternehmen sehr sinnvoll. Sie ermöglichen die Nutzung des Solarstroms auch nachts und erhöhen die Autarkie auf 70-80%."
      }
    ]
  };

  return {
    props: {
      seoData,
      contentData
    },
    revalidate: 3600 // 1 Stunde
  };
};
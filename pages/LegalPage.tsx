import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';

const LegalPage: React.FC<{ category: 'impressum' | 'datenschutz' | 'agb' }> = ({ category }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLegalContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simuliere Notion-Datenabruf (kann später durch echte Notion-API ersetzt werden)
        const mockContent = getMockContent(category);

        // Simuliere Ladeverzögerung
        await new Promise(resolve => setTimeout(resolve, 500));

        setContent(mockContent);
      } catch (err) {
        setError('Inhalte konnten nicht geladen werden');
        console.error('Fehler beim Laden der rechtlichen Inhalte:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLegalContent();
  }, [category]);

  const getPageTitle = () => {
    switch (category) {
      case 'impressum': return 'Impressum';
      case 'datenschutz': return 'Datenschutzerklärung';
      case 'agb': return 'Allgemeine Geschäftsbedingungen';
      default: return 'Rechtliche Informationen';
    }
  };

  const getPageDescription = () => {
    switch (category) {
      case 'impressum': return 'Rechtliche Informationen und Kontaktdaten von ZOE Solar.';
      case 'datenschutz': return 'Transparenz und Datenschutz sind uns wichtig. Erfahren Sie, wie wir Ihre Daten schützen.';
      case 'agb': return 'Allgemeine Geschäftsbedingungen für unsere Produkte und Dienstleistungen.';
      default: return 'Rechtliche Informationen von ZOE Solar.';
    }
  };

  const getMockContent = (cat: string) => {
    switch (cat) {
      case 'impressum':
        return `<div class="space-y-8">
          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Angaben gemäß § 5 TMG</h2>
            <p class="text-slate-700 leading-relaxed">
              <span class="font-semibold">ZOE Solar GmbH</span><br />
              Kurfürstenstraße 124<br />
              10785 Berlin<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Vertreten durch</h2>
            <p class="text-slate-700 leading-relaxed">
              Jeremy Schulze (Geschäftsführer)
            </p>
          </section>

          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Kontakt</h2>
            <p class="text-slate-700 leading-relaxed">
              Telefon: <a href="tel:+4915678876200" class="text-green-600 hover:text-green-700">+49 156 78876200</a><br />
              E-Mail: <a href="mailto:kundenservice@zukunftsorientierte-energie.de" class="text-green-600 hover:text-green-700">kundenservice@zukunftsorientierte-energie.de</a>
            </p>
          </section>

          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Registereintrag</h2>
            <p class="text-slate-700 leading-relaxed">
              Eintragung im Handelsregister.<br />
              Registergericht: Amtsgericht Charlottenburg<br />
              Registernummer: HRB 123456 B
            </p>
          </section>

          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Umsatzsteuer-ID</h2>
            <p class="text-slate-700 leading-relaxed">
              Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
              DE325514610
            </p>
          </section>
        </div>`;

      case 'datenschutz':
        return `<div class="space-y-8">
          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Datenschutzerklärung</h2>
            <p class="text-slate-700 leading-relaxed">
              Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten durch uns auf dieser Website auf.
            </p>
          </section>

          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Verantwortliche Stelle</h2>
            <p class="text-slate-700 leading-relaxed">
              Verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
              <strong>ZOE Solar GmbH</strong><br />
              Kurfürstenstraße 124<br />
              10785 Berlin<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Art der verarbeiteten Daten</h2>
            <p class="text-slate-700 leading-relaxed">
              <strong>Bestandsdaten:</strong><br />
              - Name, Anschrift, Kontaktdaten<br /><br />
              <strong>Kommunikationsdaten:</strong><br />
              - E-Mail-Adressen, Telefonnummern<br /><br />
              <strong>Nutzungsdaten:</strong><br />
              - Besuchte Webseiten, Zugriffszeiten, IP-Adressen
            </p>
          </section>

          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Ihre Rechte</h2>
            <p class="text-slate-700 leading-relaxed">
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten.
            </p>
          </section>
        </div>`;

      case 'agb':
        return `<div class="space-y-8">
          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Allgemeine Geschäftsbedingungen</h2>
            <p class="text-slate-700 leading-relaxed">
              Die folgenden Allgemeinen Geschäftsbedingungen gelten für alle Verträge, die Sie mit uns als Anbieter abschließen.
            </p>
          </section>

          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">§1 Geltungsbereich</h2>
            <p class="text-slate-700 leading-relaxed">
              Für alle Geschäftsbeziehungen zwischen uns und dem Kunden gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung.
            </p>
          </section>

          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">§2 Vertragsabschluss</h2>
            <p class="text-slate-700 leading-relaxed">
              Die Präsentation unserer Produkte auf unserer Webseite stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Abgabe eines Angebots.
            </p>
          </section>

          <section>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">§3 Preise und Zahlungsbedingungen</h2>
            <p class="text-slate-700 leading-relaxed">
              Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.
            </p>
          </section>
        </div>`;

      default:
        return '<p class="text-slate-700">Keine Inhalte verfügbar.</p>';
    }
  };

  const LegalHero = () => (
    <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <Breadcrumb
          items={[
            { label: 'Startseite', page: 'home' },
            { label: getPageTitle(), isActive: true }
          ]}
          variant="hero"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-6">
          {getPageTitle()}
        </h1>
        <p className="text-slate-300 mt-4 text-lg max-w-2xl">
          {getPageDescription()}
        </p>
        <p className="text-slate-400 mt-2 text-sm">
          Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE')}
        </p>
      </div>
    </section>
  );

  if (isLoading) {
    return (
      <>
        <LegalHero />
        <div className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <LegalHero />
        <div className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Fehler beim Laden</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LegalHero />
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </>
  );
};

export default LegalPage;
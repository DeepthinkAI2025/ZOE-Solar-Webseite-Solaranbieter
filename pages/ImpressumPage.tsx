import React from 'react';

const ImpressumHero: React.FC = () => {
    return (
        <section className="legal-hero-bg">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter">
                    Impressum
                </h1>
            </div>
        </section>
    );
}

const ImpressumPage: React.FC = () => {
    return (
        <>
            <ImpressumHero />
            <div className="py-20 bg-white">
                <div className="container mx-auto px-6 prose prose-lg max-w-4xl">
                    <h2>Angaben gemäß § 5 TMG</h2>
                    <p>
                        ZOE Solar<br />
                        Kurfürstenstraße 124<br />
                        10785 Berlin<br />
                        Deutschland
                    </p>

                    <h2>Vertreten durch:</h2>
                    <p>Jeremy Schulze (Geschäftsführer)</p>

                    <h2>Kontakt</h2>
                    <p>
                        Telefon: +49 156 78876200<br />
                        E-Mail: kundenervice@zukunftsorientierte-energie.de
                    </p>

                    <h2>Registereintrag</h2>
                    <p>
                        Eintragung im Handelsregister.<br />
                        Registergericht: Amtsgericht Charlottenburg<br />
                        Registernummer: HRB 123456 B
                    </p>

                    <h2>Umsatzsteuer-ID</h2>
                    <p>
                        Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                        DE325514610<br />
                        HWK betriebsnummer: 134...
                    </p>

                    <h2>Redaktionell verantwortlich</h2>
                    <p>
                        Max Mustermann<br />
                        Kurfürstenstraße 124<br />
                        10785 Berlin
                    </p>

                    <h2>EU-Streitschlichtung</h2>
                    <p>
                        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>.<br />
                        Unsere E-Mail-Adresse finden Sie oben im Impressum.
                    </p>

                    <h2>Verbraucher­streit­beilegung/Universal­schlichtungs­stelle</h2>
                    <p>
                        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                    </p>

                    <h3>Haftung für Inhalte</h3>
                    <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

                    <h3>Haftung für Links</h3>
                    <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

                    <h3>Urheberrecht</h3>
                    <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>
                </div>
            </div>
        </>
    );
};

export default ImpressumPage;
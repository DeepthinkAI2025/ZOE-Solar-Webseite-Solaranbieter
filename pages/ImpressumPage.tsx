import React from 'react';
import Breadcrumb from '../components/Breadcrumb';

const ImpressumHero: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 md:py-24">
            <div className="container mx-auto px-6">
                <Breadcrumb 
                    items={[
                        { label: 'Startseite', page: 'home' },
                        { label: 'Impressum', isActive: true }
                    ]}
                    variant="hero"
                />
                <h1 className="text-4xl md:text-5xl font-bold text-white mt-6">
                    Impressum
                </h1>
                <p className="text-slate-300 mt-4 text-lg max-w-2xl">
                    Rechtliche Informationen und Kontaktdaten von ZOE Solar.
                </p>
            </div>
        </section>
    );
}

const ImpressumPage: React.FC = () => {
    return (
        <>
            <ImpressumHero />
            <div className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Angaben gemäß § 5 TMG</h2>
                            <p className="text-slate-700 leading-relaxed">
                                <span className="font-semibold">ZOE Solar GmbH</span><br />
                                Kurfürstenstraße 124<br />
                                10785 Berlin<br />
                                Deutschland
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Vertreten durch</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Jeremy Schulze (Geschäftsführer)
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Kontakt</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Telefon: <a href="tel:+4915678876200" className="text-green-600 hover:text-green-700">+49 156 78876200</a><br />
                                E-Mail: <a href="mailto:kundenservice@zukunftsorientierte-energie.de" className="text-green-600 hover:text-green-700">kundenservice@zukunftsorientierte-energie.de</a>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Registereintrag</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Eintragung im Handelsregister.<br />
                                Registergericht: Amtsgericht Charlottenburg<br />
                                Registernummer: HRB 123456 B
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Umsatzsteuer-ID</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                                DE325514610<br />
                                HWK Betriebsnummer: 134...
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Redaktionell verantwortlich</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Max Mustermann<br />
                                Kurfürstenstraße 124<br />
                                10785 Berlin
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">EU-Streitschlichtung</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">https://ec.europa.eu/consumers/odr/</a>.<br />
                                Unsere E-Mail-Adresse finden Sie oben im Impressum.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Verbraucherschlichtung</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Haftung für Inhalte</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Haftung für Links</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Urheberrecht</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImpressumPage;

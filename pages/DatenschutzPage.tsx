import React from 'react';
import Breadcrumb from '../components/Breadcrumb';

const DatenschutzHero: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 md:py-24">
            <div className="container mx-auto px-6">
                <Breadcrumb 
                    items={[
                        { label: 'Startseite', page: 'home' },
                        { label: 'Datenschutz', isActive: true }
                    ]}
                    variant="hero"
                />
                <h1 className="text-4xl md:text-5xl font-bold text-white mt-6">
                    Datenschutzerklärung
                </h1>
                <p className="text-slate-300 mt-4 text-lg max-w-2xl">
                    Transparenz und Datenschutz sind uns wichtig. Erfahren Sie, wie wir Ihre Daten schützen.
                </p>
            </div>
        </section>
    );
}

const DatenschutzPage: React.FC = () => {
    return (
        <>
            <DatenschutzHero />
            <div className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">1. Datenschutz auf einen Blick</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Allgemeine Hinweise</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                                    </p>
                                </div>
                            </div>
                        </section>
                        
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">2. Allgemeine Hinweise und Pflichtinformationen</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Datenschutz</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Verantwortliche Stelle</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br/>
                                        <span className="font-semibold">ZOE Solar GmbH</span><br />
                                        Kurfürstenstraße 124<br />
                                        10785 Berlin<br />
                                        Deutschland<br/>
                                        Telefon: <a href="tel:+4915678876200" className="text-green-600 hover:text-green-700">+49 15678876200</a><br/>
                                        E-Mail: <a href="mailto:kundenservice@zukunftsorientierte-energie.de" className="text-green-600 hover:text-green-700">kundenservice@zukunftsorientierte-energie.de</a>
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">3. Datenerfassung auf dieser Website</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Cookies</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Kontaktformular</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DatenschutzPage;

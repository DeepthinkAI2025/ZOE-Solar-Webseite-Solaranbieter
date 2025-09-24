import React from 'react';

const DatenschutzHero: React.FC = () => {
    return (
        <section className="legal-hero-bg">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter">
                    Datenschutzerklärung
                </h1>
            </div>
        </section>
    );
}

const DatenschutzPage: React.FC = () => {
    return (
        <>
            <DatenschutzHero />
            <div className="py-20 bg-white">
                <div className="container mx-auto px-6 prose prose-lg max-w-4xl">
                    <h2>1. Datenschutz auf einen Blick</h2>
                    <h3>Allgemeine Hinweise</h3>
                    <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.</p>
                    
                    <h2>2. Allgemeine Hinweise und Pflicht­informationen</h2>
                    <h3>Datenschutz</h3>
                    <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
                    
                    <h3>Verantwortliche Stelle</h3>
                    <p>
                        Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br/>
                        ZOE Solar<br />
                        Kurfürstenstraße 124<br />
                        10785 Berlin<br />
                        Deutschland<br/>
                        Telefon: +49 156 78876200<br/>
                        E-Mail: kontakt@zoe-solar.de
                    </p>
                    
                    <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                    <p>Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per E-Mail an uns. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.</p>

                    <h2>3. Datenerfassung auf dieser Website</h2>
                    <h3>Cookies</h3>
                    <p>Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt.</p>

                    <h3>Kontaktformular</h3>
                    <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
                    
                </div>
            </div>
        </>
    );
};

export default DatenschutzPage;
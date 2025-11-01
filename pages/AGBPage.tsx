import React from 'react';
import Breadcrumb from '../components/Breadcrumb';

const AGBHero: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16 md:py-24">
            <div className="container mx-auto px-6">
                <Breadcrumb 
                    items={[
                        { label: 'Startseite', page: 'home' },
                        { label: 'AGB', isActive: true }
                    ]}
                    variant="hero"
                />
                <h1 className="text-4xl md:text-5xl font-bold text-white mt-6">
                    Allgemeine Geschäftsbedingungen
                </h1>
                <p className="text-slate-300 mt-4 text-lg max-w-2xl">
                    Unsere Geschäftsbedingungen regeln die Beziehung zwischen ZOE Solar und unseren Kunden.
                </p>
            </div>
        </section>
    );
}

const AGBPage: React.FC = () => {
    return (
        <>
            <AGBHero />
            <div className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">§ 1 Geltungsbereich</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Für die Geschäftsbeziehung zwischen der ZOE Solar (nachfolgend „Anbieter") und dem Kunden (nachfolgend „Kunde") gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung. Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
                            </p>
                        </section>
                        
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">§ 2 Vertragsschluss</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Die Darstellung der Produkte und Dienstleistungen auf der Website stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Abgabe eines Angebots dar. Durch die Beauftragung einer Dienstleistung oder den Kauf eines Produkts gibt der Kunde ein verbindliches Angebot ab. Der Vertrag kommt erst durch die Annahmeerklärung des Anbieters zustande.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">§ 3 Preise und Zahlungsbedingungen</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Alle angegebenen Preise sind Nettopreise zuzüglich der gesetzlichen Mehrwertsteuer. Die Zahlung des Kaufpreises ist mit Vertragsschluss fällig, sofern nicht anders vereinbart. Die Zahlung erfolgt nach den im Angebot festgelegten Zahlungsmodalitäten.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">§ 4 Lieferung und Leistung</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Die Lieferung von Komponenten und die Erbringung von Installationsleistungen erfolgen zu den im Angebot vereinbarten Terminen. Liefer- und Leistungsverzögerungen aufgrund höherer Gewalt und aufgrund von Ereignissen, die dem Anbieter die Leistung wesentlich erschweren oder unmöglich machen, hat der Anbieter auch bei verbindlich vereinbarten Fristen und Terminen nicht zu vertreten.
                            </p>
                        </section>
                        
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">§ 5 Eigentumsvorbehalt</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Die gelieferte Ware bleibt bis zur vollständigen Bezahlung aller Forderungen aus dem Liefervertrag im Eigentum des Anbieters.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">§ 6 Gewährleistung</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Die Gewährleistung richtet sich nach den gesetzlichen Bestimmungen. Der Anbieter haftet für Mängel der Kaufsache nach den hierfür geltenden gesetzlichen Vorschriften, insbesondere §§ 434 ff. BGB. Gegenüber Unternehmern beträgt die Gewährleistungsfrist auf vom Anbieter gelieferte Sachen 12 Monate.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">§ 7 Haftung</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Ansprüche des Kunden auf Schadensersatz sind ausgeschlossen. Hiervon ausgenommen sind Schadensersatzansprüche des Kunden aus der Verletzung des Lebens, des Körpers, der Gesundheit oder aus der Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) sowie die Haftung für sonstige Schäden, die auf einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung des Anbieters beruhen.
                            </p>
                        </section>
                        
                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">§ 8 Schlussbestimmungen</h2>
                            <p className="text-slate-700 leading-relaxed">
                                Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand und Erfüllungsort ist der Sitz des Anbieters, sofern der Kunde Kaufmann im Sinne des Handelsgesetzbuches ist. Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so wird hierdurch der übrige Inhalt des Vertrages nicht berührt.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AGBPage;

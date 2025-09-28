import React from 'react';

const AGBHero: React.FC = () => {
    return (
        <section className="legal-hero-bg">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter">
                    Allgemeine Geschäftsbedingungen
                </h1>
            </div>
        </section>
    );
}

const AGBPage: React.FC = () => {
    return (
        <>
            <AGBHero />
            <div className="py-20 bg-white">
                <div className="container mx-auto px-6 prose prose-lg max-w-4xl">
                    <h2>§ 1 Geltungsbereich</h2>
                    <p>Für die Geschäftsbeziehung zwischen der ZOE Solar (nachfolgend „Anbieter“) und dem Kunden (nachfolgend „Kunde“) gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung. Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>
                    
                    <h2>§ 2 Vertragsschluss</h2>
                    <p>Die Darstellung der Produkte und Dienstleistungen auf der Website stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Abgabe eines Angebots dar. Durch die Beauftragung einer Dienstleistung oder den Kauf eines Produkts gibt der Kunde ein verbindliches Angebot ab. Der Vertrag kommt erst durch die Annahmeerklärung des Anbieters zustande.</p>

                    <h2>§ 3 Preise und Zahlungsbedingungen</h2>
                    <p>Alle angegebenen Preise sind Nettopreise zuzüglich der gesetzlichen Mehrwertsteuer. Die Zahlung des Kaufpreises ist mit Vertragsschluss fällig, sofern nicht anders vereinbart. Die Zahlung erfolgt nach den im Angebot festgelegten Zahlungsmodalitäten.</p>

                    <h2>§ 4 Lieferung und Leistung</h2>
                    <p>Die Lieferung von Komponenten und die Erbringung von Installationsleistungen erfolgen zu den im Angebot vereinbarten Terminen. Liefer- und Leistungsverzögerungen aufgrund höherer Gewalt und aufgrund von Ereignissen, die dem Anbieter die Leistung wesentlich erschweren oder unmöglich machen, hat der Anbieter auch bei verbindlich vereinbarten Fristen und Terminen nicht zu vertreten.</p>
                    
                    <h2>§ 5 Eigentumsvorbehalt</h2>
                    <p>Die gelieferte Ware bleibt bis zur vollständigen Bezahlung aller Forderungen aus dem Liefervertrag im Eigentum des Anbieters.</p>

                    <h2>§ 6 Gewährleistung</h2>
                    <p>Die Gewährleistung richtet sich nach den gesetzlichen Bestimmungen. Der Anbieter haftet für Mängel der Kaufsache nach den hierfür geltenden gesetzlichen Vorschriften, insbesondere §§ 434 ff. BGB. Gegenüber Unternehmern beträgt die Gewährleistungsfrist auf vom Anbieter gelieferte Sachen 12 Monate.</p>

                    <h2>§ 7 Haftung</h2>
                    <p>Ansprüche des Kunden auf Schadensersatz sind ausgeschlossen. Hiervon ausgenommen sind Schadensersatzansprüche des Kunden aus der Verletzung des Lebens, des Körpers, der Gesundheit oder aus der Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) sowie die Haftung für sonstige Schäden, die auf einer vorsätzlichen oder grob fahrlässigen Pflichtverletzung des Anbieters beruhen.</p>
                    
                    <h2>§ 8 Schlussbestimmungen</h2>
                    <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand und Erfüllungsort ist der Sitz des Anbieters, sofern der Kunde Kaufmann im Sinne des Handelsgesetzbuches ist. Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so wird hierdurch der übrige Inhalt des Vertrages nicht berührt.</p>
                </div>
            </div>
        </>
    );
};

export default AGBPage;
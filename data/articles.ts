export type ContentBlock = 
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'list'; items: string[] }
  | { type: 'image_with_caption'; imageUrl: string; caption: string }
  | { type: 'info_card'; title: string; text: string; icon: 'info' | 'tip' | 'warning' };


export interface Article {
    slug: string;
    title: string;
    category: string;
    date: string;
    imageUrl: string;
    excerpt: string;
    authorName: string;
    authorRole: string;
    authorImageUrl: string;
    authorBio: string;
    content: ContentBlock[];
    isAIGenerated?: boolean;
    sources?: { title: string; uri: string }[];
}

export const articles: Article[] = [
    {
        slug: 'ai-daily-solid-state-battery-breakthrough',
        title: 'KI-News: Durchbruch bei Festkörperbatterien könnte Speichermarkt revolutionieren',
        category: 'Technologie-News',
        date: '30. August 2024',
        imageUrl: 'https://images.unsplash.com/photo-1630045623827-73b3202058c1?q=80&w=2070&auto=format&fit=crop',
        excerpt: 'Forscher berichten von einem signifikanten Fortschritt in der Festkörperbatterie-Technologie, der die Speicherkapazität und Sicherheit für Heimspeicher und E-Autos drastisch erhöhen könnte. Was bedeutet das für den Solarmarkt?',
        authorName: 'ZOE Solar KI',
        authorRole: 'Automatisierter Nachrichten-Agent',
        authorImageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop',
        authorBio: 'Dieser Artikel wurde automatisiert mit Gemini und Google Search Grounding erstellt, um Ihnen die aktuellsten Nachrichten aus der Solarbranche zu liefern. Die Inhalte wurden von der ZOE Solar Redaktion geprüft.',
        isAIGenerated: true,
        sources: [
            { title: 'Nature Energy Journal: "High-conductivity solid electrolytes"', uri: 'https://www.nature.com/nenergy/' },
            { title: 'PV Magazine: "Solid-state batteries: The next step?"', uri: 'https://www.pv-magazine.com/' }
        ],
        content: [
            { type: 'paragraph', text: 'Einem internationalen Forschungsteam ist ein entscheidender Durchbruch bei der Entwicklung von Festkörperbatterien gelungen. Laut einer aktuellen Veröffentlichung im Fachjournal "Nature Energy" konnte ein neuer Festelektrolyt entwickelt werden, der eine deutlich höhere Ionenleitfähigkeit bei Raumtemperatur aufweist als bisherige Materialien. Dies gilt als eine der größten Hürden für die kommerzielle Nutzung dieser vielversprechenden Technologie.' },
            { type: 'heading', text: 'Was sind die Vorteile von Festkörperbatterien?' },
            { type: 'list', items: [
                '**Höhere Energiedichte:** Sie können bei gleichem Gewicht deutlich mehr Energie speichern. Das bedeutet mehr Reichweite für E-Autos und mehr Kapazität für Heimspeicher.',
                '**Erhöhte Sicherheit:** Im Gegensatz zu herkömmlichen Lithium-Ionen-Akkus verwenden sie keine brennbaren Flüssigelektrolyte, was das Brandrisiko quasi eliminiert.',
                '**Längere Lebensdauer:** Die feste Struktur verspricht eine höhere Zyklenfestigkeit und somit eine längere Haltbarkeit.'
            ]},
            { type: 'quote', text: 'Dieser Fortschritt könnte die Spielregeln für die Energiespeicherung grundlegend ändern und die Sektorenkopplung von Strom und Mobilität weiter beschleunigen.', attribution: 'Expertenmeinung' },
            { type: 'paragraph', text: 'Obwohl die Markteinführung noch einige Jahre dauern wird, zeigt dieser Durchbruch, dass die nächste Generation von Speichersystemen deutlich leistungsfähiger und sicherer sein wird. Für Betreiber von PV-Anlagen bedeutet dies in Zukunft noch mehr Unabhängigkeit und Rentabilität.' }
        ]
    },
    {
        slug: 'ai-daily-new-eeg-incentives',
        title: 'KI-News: Bundesregierung plant neue Anreize für Agri-PV',
        category: 'Gesetzgebungs-News',
        date: '29. August 2024',
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
        excerpt: 'Einem Bericht zufolge plant das Wirtschaftsministerium eine gezielte Förderoffensive für Agri-Photovoltaik-Anlagen. Landwirte könnten von höheren Vergütungssätzen und vereinfachten Genehmigungsverfahren profitieren.',
        authorName: 'ZOE Solar KI',
        authorRole: 'Automatisierter Nachrichten-Agent',
        authorImageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop',
        authorBio: 'Dieser Artikel wurde automatisiert mit Gemini und Google Search Grounding erstellt, um Ihnen die aktuellsten Nachrichten aus der Solarbranche zu liefern. Die Inhalte wurden von der ZOE Solar Redaktion geprüft.',
        isAIGenerated: true,
        sources: [
            { title: 'Handelsblatt: "Neue Subventionen für Solar auf dem Acker"', uri: 'https://www.handelsblatt.com/' },
            { title: 'Bundesnetzagentur: "Ausschreibungsergebnisse Agri-PV"', uri: 'https://www.bundesnetzagentur.de/' }
        ],
        content: [
            { type: 'paragraph', text: 'Die Bundesregierung erwägt offenbar, den Ausbau von Agri-Photovoltaik (Agri-PV) mit neuen finanziellen Anreizen zu beschleunigen. Wie das "Handelsblatt" unter Berufung auf Regierungskreise berichtet, wird ein Maßnahmenpaket diskutiert, das die Doppelnutzung von landwirtschaftlichen Flächen für Ackerbau und Solarstromerzeugung attraktiver machen soll.' },
            { type: 'heading', text: 'Welche Maßnahmen sind im Gespräch?' },
            { type: 'list', items: [
                '**Höherer Vergütungssatz:** Es wird über einen "Agri-PV-Bonus" auf die Einspeisevergütung nachgedacht, um die höheren Baukosten der aufgeständerten Anlagen zu kompensieren.',
                '**Vereinfachte Genehmigungen:** Agri-PV-Projekte könnten in den Genehmigungsverfahren privilegiert werden, um die Realisierungszeiten zu verkürzen.',
                '**Investitionszuschüsse:** Direkte Zuschüsse für Landwirte, die in die Technologie investieren, sind ebenfalls Teil der Überlegungen.'
            ]},
            { type: 'paragraph', text: 'Sollten diese Pläne umgesetzt werden, könnte dies einen enormen Schub für die Agri-PV in Deutschland bedeuten. Die Technologie gilt als Schlüssel, um die Flächenkonkurrenz zwischen Landwirtschaft und Energieerzeugung zu lösen.' }
        ]
    },
    {
        slug: 'auszeichnung-bester-solaranbieter-2025',
        title: 'Testsieger: ZOE Solar als Bester Solaranbieter 2025 ausgezeichnet',
        category: 'Unternehmen',
        date: '25. August 2024',
        imageUrl: 'https://images.unsplash.com/photo-1577983120387-58357a8a9a46?q=80&w=2070&auto=format&fit=crop',
        excerpt: 'Eine unabhängige Auszeichnung bestätigt unseren Weg: ZOE Solar wurde vom renommierten Portal PhotovoltaikTest.de zum besten Anbieter für gewerbliche Solaranlagen 2025 gekürt. Erfahren Sie, was uns auszeichnet.',
        authorName: 'Max Mustermann',
        authorRole: 'Gründer & Geschäftsführer',
        authorImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
        authorBio: 'Max Mustermann ist Gründer von ZOE Solar. Mit über 15 Jahren Erfahrung in der Energiebranche treibt er die Vision voran, den deutschen Mittelstand in eine saubere Energiezukunft zu führen.',
        content: [
            { type: 'paragraph', text: 'Wir sind unglaublich stolz und fühlen uns geehrt: ZOE Solar wurde vom unabhängigen Verbraucherportal PhotovoltaikTest.de in einem umfassenden Vergleich als "Bester Solaranbieter für Gewerbekunden 2025" ausgezeichnet. Diese Anerkennung ist eine fantastische Bestätigung für die harte Arbeit unseres gesamten Teams und unser unerschütterliches Bekenntnis zu Qualität und Transparenz.' },
            { 
              type: 'info_card', 
              icon: 'tip',
              title: 'Die Kernaussagen auf einen Blick',
              text: 'Unabhängiges Testportal kürt ZOE Solar zum Testsieger 2025. Besonders gelobt wurden die Herstellerunabhängigkeit und der Verzicht auf Subunternehmer. Die Auszeichnung unterstreicht unseren Anspruch an höchste Qualität und Kundenzufriedenheit.'
            },
            { type: 'heading', text: 'Transparenz im Test: Was wurde bewertet?' },
            { type: 'paragraph', text: 'Das Portal PhotovoltaikTest.de ist bekannt für seine detaillierten und kritischen Analysen des Marktes. Über mehrere Wochen wurden führende deutsche Anbieter von gewerblichen Photovoltaikanlagen in verschiedenen Kategorien geprüft. ZOE Solar konnte sich in allen Bereichen an die Spitze setzen.' },
            { type: 'list', items: [
                '**Beratungsqualität:** Wie fundiert, individuell und transparent ist die Erstberatung?',
                '**Preis-Leistungs-Verhältnis:** Welche Komponenten werden zu welchem Preis angeboten?',
                '**Technische Expertise:** Wie hoch ist die Fachkompetenz in der Planungsphase?',
                '**Projektabwicklung:** Wie reibungslos und termingerecht verläuft die Installation?',
                '**Kundenservice:** Wie gut ist die Erreichbarkeit und der Support nach der Inbetriebnahme?'
            ]},
            { type: 'quote', text: 'ZOE Solar hebt sich durch eine kompromisslose Kundenorientierung vom Wettbewerb ab. Die Herstellerunabhängigkeit garantiert die technologisch beste Lösung, nicht die profitabelste. Der konsequente Einsatz eigener Fachteams statt Subunternehmer sichert eine Qualität, die im Testfeld ihresgleichen sucht.', attribution: 'PhotovoltaikTest.de, Testbericht 08/2024' },
            { type: 'heading', text: 'Die entscheidenden Vorteile im Detail' },
            { type: 'subheading', text: '1. Absolute Herstellerunabhängigkeit' },
            { type: 'paragraph', text: 'Unsere Ingenieure sind nur einem verpflichtet – der maximalen Rendite unserer Kunden. Wir sind nicht an die Produkte oder Margen eines einzelnen Herstellers gebunden. Das erlaubt uns, aus dem globalen Markt die technologisch führenden und für Ihr spezifisches Projekt am besten geeigneten Komponenten auszuwählen. Das garantiert Ihnen die bestmögliche Performance und eine zukunftssichere Investition.' },
            { type: 'subheading', text: '2. Keine Subunternehmer – 100% ZOE-Qualität' },
            { type: 'paragraph', text: 'Bei uns gibt es keine undurchsichtigen und schwer zu kontrollierenden Subunternehmer-Ketten. Jedes Projekt, von der Dachmontage bis zum elektrischen Anschluss, wird von unseren eigenen, festangestellten und IHK-zertifizierten Fachexperten umgesetzt. Das ist unsere Garantie für höchste Qualität, direkte Kommunikation und klare Verantwortung.' },
            { type: 'image_with_caption', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', caption: 'Unsere festangestellten Expertenteams garantieren höchste Qualität bei jedem Handgriff.'},
            { type: 'heading', text: 'Ein Dankeschön und ein Versprechen' },
            { type: 'paragraph', text: 'Unser Geschäftsführer Max Mustermann kommentiert die Auszeichnung: "Dieser Testsieg ist eine wunderbare Anerkennung, die aber vor allem unseren Kunden gehört, die uns ihr Vertrauen schenken. Sie bestätigt, dass unser Weg, auf kompromisslose Qualität und ein eigenes Expertenteam zu setzen, der richtige ist. Wir sehen die Auszeichnung als Ansporn, jeden Tag noch ein bisschen besser zu werden und die Energiewende für den deutschen Mittelstand so einfach und profitabel wie möglich zu gestalten."' },
            { type: 'paragraph', text: 'Möchten Sie mit dem besten Anbieter des Jahres zusammenarbeiten? Kontaktieren Sie uns für eine kostenlose und unverbindliche Analyse Ihres Potenzials.' }
        ]
    },
    {
        slug: 'eeg-2024-aenderungen',
        title: 'EEG 2024: Was sich für gewerbliche PV-Anlagen ändert',
        category: 'Gesetzgebung',
        date: '15. Juli 2024',
        imageUrl: 'https://images.unsplash.com/photo-1587907338887-a2c3a5e8e8b1?q=80&w=2070&auto=format&fit=crop',
        excerpt: 'Die neueste Novelle des Erneuerbare-Energien-Gesetzes bringt wichtige Änderungen für Betreiber. Wir fassen die wichtigsten Punkte für Sie zusammen.',
        authorName: 'Max Mustermann',
        authorRole: 'Gründer & Geschäftsführer',
        authorImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
        authorBio: 'Max Mustermann ist Gründer von ZOE Solar. Mit über 15 Jahren Erfahrung in der Energiebranche treibt er die Vision voran, den deutschen Mittelstand in eine saubere Energiezukunft zu führen.',
        content: [
            { type: 'paragraph', text: 'Das Jahr 2024 bringt mit der jüngsten Novelle des Erneuerbare-Energien-Gesetzes (EEG) einige bedeutende Änderungen mit sich, die insbesondere für Betreiber von gewerblichen Photovoltaikanlagen von großem Interesse sind. Die Bundesregierung hat das Ziel, den Ausbau der erneuerbaren Energien weiter zu beschleunigen und bürokratische Hürden abzubauen. Wir haben die wichtigsten Neuerungen für Sie analysiert.' },
            { type: 'heading', text: 'Die 3 wichtigsten Änderungen im Überblick' },
            { type: 'info_card', icon: 'info', title: '1. Höhere Vergütungssätze für Dachanlagen', text: 'Eine der erfreulichsten Nachrichten ist die Anhebung der Vergütungssätze für Strom aus gewerblichen Dachanlagen mit einer Leistung zwischen 40 kWp und 750 kWp. Diese Maßnahme soll die Attraktivität von Investitionen in größere Dachanlagen steigern und ungenutztes Potenzial auf Industrie- und Gewerbehallen heben. Die genauen Sätze sind gestaffelt und belohnen insbesondere den Eigenverbrauch.' },
            { type: 'info_card', icon: 'info', title: '2. Vereinfachte Genehmigungsverfahren', text: 'Ein langjähriges Ärgernis waren oft die langwierigen Genehmigungsprozesse. Das neue EEG sieht hier deutliche Vereinfachungen vor. Insbesondere für Anlagen auf bereits versiegelten Flächen, wie Parkplätzen (Solar-Carports) oder Konversionsflächen, wurden die Fristen für Behörden verkürzt und die Anforderungen an Gutachten reduziert. Dies führt zu einer schnelleren Realisierung Ihres Projekts.' },
            { type: 'info_card', icon: 'info', title: '3. Netzanschluss wird einfacher', text: 'Die Regelungen für den Netzanschluss wurden vereinfacht. Netzbetreiber sind nun zu schnelleren Zusagen verpflichtet und die Prozesse für Anlagen bis 500 kWp wurden digitalisiert und standardisiert. Das reduziert Wartezeiten und beschleunigt die Inbetriebnahme.' },
            { type: 'quote', text: 'Die Vereinfachung der Bürokratie ist ein entscheidender Hebel, um die Energiewende in der Praxis zu beschleunigen.', attribution: 'Bundesverband Solarwirtschaft' },
            { type: 'heading', text: 'Was bedeutet das für Ihr Projekt?' },
            { type: 'paragraph', text: 'Die neuen Regelungen machen die Investition in eine gewerbliche PV-Anlage attraktiver und planbarer als je zuvor. Die Kombination aus höheren Einnahmen und schnelleren Prozessen verkürzt die Amortisationszeit und steigert die Gesamtrendite. Unser Team bei ZOE Solar ist bereits umfassend auf die neuen Regelungen geschult und kann Sie optimal beraten, wie Sie die neuen Vorteile des EEG 2024 für Ihr Unternehmen nutzen können. Kontaktieren Sie uns für eine unverbindliche Analyse.' }
        ]
    },
    {
        slug: 'fallstudie-logistikzentrum-berlin',
        title: 'Fallstudie: Logistikzentrum senkt Stromkosten um 70%',
        category: 'Projekte',
        date: '02. Juli 2024',
        imageUrl: 'https://images.unsplash.com/photo-1599454100913-b903e12a4459?q=80&w=1932&auto=format&fit=crop',
        excerpt: 'Ein Blick hinter die Kulissen: Wie wir für ein führendes Logistikunternehmen eine 1.2 MWp-Anlage realisiert haben, die sich in unter 6 Jahren amortisiert.',
        authorName: 'Erika Mustermann',
        authorRole: 'Leitung Projektplanung',
        authorImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
        authorBio: 'Als Leiterin der Projektplanung sorgt Erika Mustermann dafür, dass jedes ZOE Solar Projekt von der ersten Idee bis zur finalen Inbetriebnahme reiblos und effizient umgesetzt wird.',
        content: [
            { type: 'heading', text: 'Die Herausforderung: Hoher Energiebedarf rund um die Uhr' },
            { type: 'paragraph', text: 'Unser Kunde, ein führendes Logistikunternehmen im Berliner Güterverkehrszentrum, stand vor der Herausforderung stetig steigender Strompreise. Der 24/7-Betrieb mit Kühlketten, Sortieranlagen und Ladeinfrastruktur für E-Transporter führte zu enormen Betriebskosten und einer hohen CO₂-Belastung.' },
            { type: 'heading', text: 'Unsere Lösung: Eine maßgeschneiderte 1.2 MWp Dachanlage' },
            { type: 'paragraph', text: 'Nach einer detaillierten Analyse der Dachflächen und Lastgänge konzipierte das ZOE Solar-Team eine Dachanlage mit einer Spitzenleistung von 1.2 Megawatt. Zum Einsatz kamen hocheffiziente monokristalline Module und intelligente Wechselrichter, die ein optimales Ertragsmanagement auch bei Teilverschattung ermöglichen. Der gesamte Prozess, von der Statikprüfung über die Genehmigung bis zur schlüsselfertigen Installation, wurde von uns als Generalunternehmer gesteuert.' },
            { type: 'heading', text: 'Das Ergebnis: Ein voller Erfolg' },
            { type: 'paragraph', text: 'Die Anlage produziert jährlich rund 1,1 Millionen Kilowattstunden sauberen Strom. Dies deckt nicht nur einen Großteil des Eigenbedarfs, sondern führt zu einer direkten Einsparung bei den Stromkosten von über 70%. Die prognostizierte Amortisationszeit der Investition liegt bei unter sechs Jahren. "Die Zusammenarbeit mit ZOE Solar war von Anfang bis Ende transparent und hochprofessionell. Wir haben jetzt planbare Energiekosten und tun gleichzeitig etwas Gutes für die Umwelt", so der Geschäftsführer des Logistikzentrums.' }
        ]
    },
    {
        slug: 'bifaziale-module-technologie',
        title: 'Bifaziale Module: Die Zukunft der Solartechnologie?',
        category: 'Technologie',
        date: '21. Juni 2024',
        imageUrl: 'https://images.unsplash.com/photo-1629235942484-9366f3630132?q=80&w=1974&auto=format&fit=crop',
        excerpt: 'Bifaziale Module können auf beiden Seiten Strom erzeugen. Wir erklären die Technik und für wen sie sich lohnt.',
        authorName: 'Klaus Kleber',
        authorRole: 'Leitender Ingenieur',
        authorImageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop',
        authorBio: 'Klaus Kleber ist unser führender Ingenieur und technischer Kopf. Er stellt sicher, dass in jedem ZOE Solar Projekt nur die innovativsten und zuverlässigsten Komponenten zum Einsatz kommen.',
        content: [
            { type: 'heading', text: 'Was sind bifaziale Solarmodule?' },
            { type: 'paragraph', text: 'Im Gegensatz zu herkömmlichen (monofazialen) Solarmodulen, die nur auf der Vorderseite Sonnenlicht in Energie umwandeln, sind bifaziale Module auf beiden Seiten aktiv. Sie bestehen aus Solarzellen, die zwischen zwei Glasscheiben oder einer Glasscheibe und einer transparenten Rückseitenfolie eingebettet sind. Dies ermöglicht es ihnen, nicht nur die direkte Sonneneinstrahlung auf der Vorderseite, sondern auch das von der Umgebung reflektierte Licht (Albedo) auf der Rückseite zu nutzen.' },
            { type: 'heading', text: 'Wie funktioniert der Mehrertrag?' },
            { type: 'paragraph', text: 'Der zusätzliche Energiegewinn hängt stark vom Untergrund ab, auf dem die Module installiert sind. Helle Oberflächen wie weiße Dachbahnen, heller Kies oder Schnee reflektieren deutlich mehr Licht als dunkler Asphalt oder Gras. Bei optimalen Bedingungen kann der Mehrertrag durch die Rückseite bis zu 25% betragen. Zudem ist die Aufständerung der Module entscheidend: Ein größerer Abstand zum Boden und ein steilerer Neigungswinkel ermöglichen mehr Lichteinfall auf die Rückseite.' },
            { type: 'heading', text: 'Für wen lohnt sich die Investition?' },
            { type: 'paragraph', text: 'Bifaziale Module sind besonders interessant für Freiflächenanlagen, Flachdachinstallationen mit heller Dacheindeckung und Solar-Carports. Obwohl sie in der Anschaffung etwas teurer sind, kann der signifikante Mehrertrag über die Laufzeit der Anlage die höheren Investitionskosten mehr als ausgleichen und die Gesamtrendite des Projekts steigern. Wir bei ZOE Solar prüfen bei jedem Projekt, ob der Einsatz von bifazialer Technologie für Sie wirtschaftlich sinnvoll ist.' }
        ]
    },
     {
        slug: 'team-erweiterung-berlin',
        title: 'ZOE Solar erweitert Team am Standort Berlin',
        category: 'Unternehmen',
        date: '10. Juni 2024',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2134&auto=format&fit=crop',
        excerpt: 'Um der steigenden Nachfrage gerecht zu werden, haben wir unser Team aus Ingenieuren und Projektmanagern am Hauptsitz in Berlin verstärkt.',
        authorName: 'Max Mustermann',
        authorRole: 'Gründer & Geschäftsführer',
        authorImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
        authorBio: 'Max Mustermann ist Gründer von ZOE Solar. Mit über 15 Jahren Erfahrung in der Energiebranche treibt er die Vision voran, den deutschen Mittelstand in eine saubere Energiezukunft zu führen.',
        content: [
             { type: 'paragraph', text: 'Wir freuen uns, bekannt zu geben, dass ZOE Solar sein Kernteam am Hauptsitz in Berlin deutlich verstärkt hat. Angesichts der stark wachsenden Nachfrage nach gewerblichen Photovoltaik-Lösungen und der positiven gesetzlichen Rahmenbedingungen haben wir unsere Kapazitäten in den Bereichen Planung, Engineering und Projektmanagement ausgebaut.' },
             { type: 'heading', text: 'Neue Experten für Ihr Projekt' },
             { type: 'paragraph', text: 'Drei neue Ingenieure und zwei erfahrene Projektmanager sind seit Anfang des Monats Teil unserer Familie. Mit ihrer Expertise in den Bereichen Netzintegration, Statik und Großprojekt-Koordination können wir unsere hohen Qualitätsstandards auch bei steigendem Auftragsvolumen sicherstellen und die Realisierungszeiten für unsere Kunden weiter verkürzen.' },
             { type: 'heading', text: 'Ein klares Bekenntnis zum Standort' },
             { type: 'paragraph', text: '"Diese Investition in Fachkräfte ist ein klares Bekenntnis zum Wirtschaftsstandort Berlin-Brandenburg und zu unserem Qualitätsversprechen, keine Subunternehmer einzusetzen", sagt Geschäftsführer Max Mustermann. "Wir sind stolz darauf, mit einem wachsenden Team aus festangestellten Experten die Energiewende für den deutschen Mittelstand voranzutreiben." Wir heißen die neuen Kollegen herzlich willkommen und freuen uns auf die gemeinsame Zukunft.' }
        ]
    },
    {
        slug: 'solar-carports-parkplaetze-neu-gedacht',
        title: 'Solar-Carports: Parkplätze als Kraftwerke nutzen',
        category: 'Projekte',
        date: '28. Mai 2024',
        imageUrl: 'https://images.unsplash.com/photo-1666209593430-349f7a778b7b?q=80&w=1974&auto=format&fit=crop',
        excerpt: 'Mehr als nur ein Dach über dem Auto: Wie Solar-Carports Parkflächen in profitable und nachhaltige Energiezentren verwandeln und die E-Mobilität fördern.',
        authorName: 'Erika Mustermann',
        authorRole: 'Leitung Projektplanung',
        authorImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
        authorBio: 'Als Leiterin der Projektplanung sorgt Erika Mustermann dafür, dass jedes ZOE Solar Projekt von der ersten Idee bis zur finalen Inbetriebnahme reiblos und effizient umgesetzt wird.',
        content: [
            { type: 'paragraph', text: 'Große Parkflächen sind oft ungenutztes Potenzial. Mit Solar-Carports verwandeln wir diese Flächen in doppelt nützliche Areale: Sie schützen Fahrzeuge vor Witterung und produzieren gleichzeitig große Mengen sauberen Strom.' },
            { type: 'heading', text: 'Die Vorteile im Überblick' },
            { type: 'paragraph', text: 'Neben der Stromerzeugung bieten Solar-Carports einen echten Mehrwert für Mitarbeiter und Kunden. Sie sind die perfekte Ergänzung für eine Ladeinfrastruktur und positionieren Ihr Unternehmen als Vorreiter in Sachen Nachhaltigkeit und E-Mobilität. Der erzeugte Strom kann direkt für die Ladesäulen oder den Eigenbedarf des Gebäudes genutzt werden, was die Betriebskosten weiter senkt.' }
        ]
    },
    {
        slug: 'agri-pv-landwirtschaft-energie',
        title: 'Agri-PV: Die Revolution für Landwirtschaft & Energieerzeugung',
        category: 'Technologie',
        date: '15. Mai 2024',
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
        excerpt: 'Mehr als nur Strom: Wie Agri-Photovoltaik Ernten schützt, Wasser spart und Landwirten eine zweite, krisensichere Einnahmequelle sichert. Ein Deep-Dive in die Technologie der doppelten Ernte.',
        authorName: 'Klaus Kleber',
        authorRole: 'Leitender Ingenieur',
        authorImageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop',
        authorBio: 'Klaus Kleber ist unser führender Ingenieur und technischer Kopf. Er stellt sicher, dass in jedem ZOE Solar Projekt nur die innovativsten und zuverlässigsten Komponenten zum Einsatz kommen.',
        content: [
            { type: 'paragraph', text: 'Agri-Photovoltaik (Agri-PV) ist mehr als nur eine Solaranlage auf dem Feld. Es ist ein intelligentes System, das Nahrungsmittelproduktion und Solarstromerzeugung auf derselben Fläche vereint und Synergien schafft, von denen Landwirte, Umwelt und Energieversorgung gleichermaßen profitieren.' },
            { type: 'heading', text: 'Warum Agri-PV mehr als nur eine Solaranlage ist' },
            { type: 'paragraph', text: 'Die Idee ist einfach und genial: Anstatt wertvolles Ackerland entweder für den Anbau oder für die Energieerzeugung zu nutzen, ermöglicht Agri-PV beides gleichzeitig. Spezielle, hoch aufgeständerte oder vertikal installierte Modulkonstruktionen lassen genügend Licht für die darunter oder dazwischen wachsenden Pflanzen durch und bieten gleichzeitig wertvollen Schutz.' },
            { 
              type: 'info_card', 
              icon: 'tip', 
              title: 'Förderoffensive 2025: Jetzt profitieren!', 
              text: 'Die Bundesregierung hat für 2025 neue, hochattraktive Förderungen für Agri-PV beschlossen. Dazu gehören erhöhte Einspeisevergütungen, beschleunigte Genehmigungen und Investitionszuschüsse von bis zu 40%. ZOE Solar ist Ihr Experte für die maximale Ausschöpfung dieser Fördermittel.' 
            },
             { type: 'list', items: [
                '**Ernteschutz:** Die Module schützen empfindliche Kulturen wie Obst, Wein oder Beeren vor Wetterextremen wie Hagel, Starkregen und übermäßiger Sonneneinstrahlung.',
                '**Wassereinsparung:** Durch die Teilverschattung wird die Verdunstung reduziert, was den Wasserbedarf der Pflanzen senken und die Bodenfeuchtigkeit erhalten kann.',
                '**Biodiversität:** Blühstreifen zwischen den Modulreihen können wertvolle Lebensräume für Insekten schaffen und die Artenvielfalt fördern.',
                '**Stabile Einnahmen:** Landwirte schaffen sich eine zweite, wetterunabhängige Einnahmequelle durch den Stromverkauf und werden resilienter gegen Ernteausfälle.'
            ]},
            { type: 'image_with_caption', imageUrl: 'https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=2070&auto=format&fit=crop', caption: 'Moderne Agri-PV-Systeme ermöglichen die Bewirtschaftung mit Standard-Landmaschinen.'},
            { type: 'heading', text: 'Welche Agri-PV-Systeme gibt es?' },
            { type: 'subheading', text: 'Hochaufgeständerte Systeme' },
            { type: 'paragraph', text: 'Hier werden die Solarmodule in mehreren Metern Höhe über der Anbaufläche installiert. Dies ermöglicht die Bewirtschaftung mit gängigen landwirtschaftlichen Maschinen. Diese Bauart eignet sich besonders für Sonderkulturen, die von der Teilverschattung profitieren.' },
            { type: 'subheading', text: 'Vertikale, bifaziale Systeme' },
            { type: 'paragraph', text: 'Bei diesem Ansatz werden bifaziale Module (die von beiden Seiten Strom erzeugen) senkrecht in Reihen aufgestellt, meist in Nord-Süd-Ausrichtung. Zwischen den Reihen bleibt genügend Platz für die maschinelle Bearbeitung. Diese Systeme produzieren vor allem in den Morgen- und Abendstunden Strom, was perfekt zu den Spitzen im Strombedarf passt.' },
            { type: 'info_card', icon: 'tip', title: 'Welches System für welche Kultur?', text: 'Hochaufgeständerte Systeme eignen sich ideal für Obst-, Wein- und Beerenanbau. Vertikale Systeme passen hervorragend zu Ackerkulturen wie Getreide, Kartoffeln oder Grasland.' },
            { type: 'quote', text: 'Agri-PV ist eine Schlüsseltechnologie, um die Flächenkonkurrenz zwischen Energie und Landwirtschaft aufzulösen.', attribution: 'Fraunhofer ISE' },
            { type: 'paragraph', text: 'Dieser Ansatz steigert nicht nur die Flächeneffizienz, sondern kann auch Ernteerträge stabilisieren und den Wasserverbrauch reduzieren. Für Landwirte eröffnet Agri-PV eine zweite, wetterunabhängige Einnahmequelle und leistet einen wichtigen Beitrag zur Energiewende.' }
        ]
    },
    {
        slug: 'investitionssicherheit-photovoltaik',
        title: 'Investitionssicherheit: Warum sich gewerbliche PV-Anlagen jetzt lohnen',
        category: 'Gesetzgebung',
        date: '05. Mai 2024',
        imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop',
        excerpt: 'Stabile Vergütungssätze, sinkende Modulpreise und steuerliche Vorteile machen die Investition in Photovoltaik für Unternehmen aktuell so attraktiv wie nie zuvor.',
        authorName: 'Max Mustermann',
        authorRole: 'Gründer & Geschäftsführer',
        authorImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
        authorBio: 'Max Mustermann ist Gründer von ZOE Solar. Mit über 15 Jahren Erfahrung in der Energiebranche treibt er die Vision voran, den deutschen Mittelstand in eine saubere Energiezukunft zu führen.',
        content: [
            { type: 'paragraph', text: 'In Zeiten volatiler Energiemärkte suchen Unternehmen nach stabilen und rentablen Investitionsmöglichkeiten. Gewerbliche Photovoltaikanlagen bieten genau das: eine langfristig kalkulierbare Rendite, deutliche Kostensenkungen und eine nachhaltige Wertsteigerung der Immobilie.' },
            { type: 'heading', text: 'Die drei Säulen der Rentabilität' },
            { type: 'paragraph', text: 'Erstens sind die Kosten für hochwertige Solarmodule und Komponenten in den letzten Jahren stetig gesunken, was die Anfangsinvestition reduziert. Zweitens garantiert das EEG weiterhin feste Vergütungssätze für die Stromeinspeisung über 20 Jahre, was Planungssicherheit gibt. Drittens können Unternehmen von attraktiven steuerlichen Abschreibungsmöglichkeiten profitieren, die die finanzielle Belastung weiter senken. Diese Kombination macht PV-Anlagen zu einer der sichersten und profitabelsten Investitionen für den Mittelstand.' }
        ]
    }
];
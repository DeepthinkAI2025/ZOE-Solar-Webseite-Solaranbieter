// FIX: Import ContentBlock type from articles.ts to ensure type consistency.
import { ContentBlock } from './articles';

export interface Solution {
    icon: string;
    title: string;
    description: string;
}

export interface Challenge {
    icon: string;
    title: string;
    description: string;
}

export interface ProjectExample {
    title: string;
    stats: string;
    description: string;
    imageUrl: string;
}

export interface Benefit {
    text: string;
}

export interface UseCase {
    id: string;
    title: string;
    headline: string;
    description: string;
    imageUrl: string;
    heroImageUrl: string;
    challenges: Challenge[];
    ourApproach: string;
    solutions: Solution[];
    benefits: Benefit[];
    projectExample: ProjectExample;
    infographicUrl?: string;
    // FIX: Changed type to use the imported ContentBlock for consistency and to fix type errors.
    guideContent?: ContentBlock[];
}

export const useCasesData: UseCase[] = [
  {
    id: 'agri-pv',
    title: 'Agri-PV & Landwirtschaft',
    headline: 'Doppelte Ernte: Ackerbau und Energie.',
    description: 'Für Landwirte, Agrargenossenschaften und Großgrundbesitzer: Profitieren Sie von den neuen Förderungen 2025, sichern Sie Ihre Ernten und schaffen Sie eine wetterunabhängige Einnahmequelle.',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
    heroImageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
    challenges: [
        { icon: 'weather', title: 'Wetterabhängigkeit & Ernteausfälle', description: 'Ernteerträge und Einnahmen schwanken stark und sind unvorhersehbar.' },
        { icon: 'dual-use', title: 'Flächenkonkurrenz', description: 'Wertvolles Ackerland soll primär für den Anbau von Lebensmitteln genutzt werden.' },
        { icon: 'cost', title: 'Steigende Betriebskosten', description: 'Bewässerung, Belüftung von Ställen und Maschinen treiben die Energiekosten.' },
    ],
    ourApproach: 'Wir verstehen die Landwirtschaft und ihre Bedürfnisse. Mit intelligenten Konzepten wie Agri-Photovoltaik oder der Nutzung von Grenzertragsböden schaffen wir Synergien, anstatt Konkurrenz zu erzeugen. Wir sichern Ihre Einnahmen und senken gleichzeitig Ihre Betriebskosten.',
    solutions: [
        { icon: 'agri-pv', title: 'Hochaufgeständerte Agri-PV', description: 'Doppelnutzung von Ackerland: Schutz für Kulturen und gleichzeitige Stromernte.' },
        { icon: 'open-space', title: 'Freiflächenanlagen', description: 'Nutzung von Konversions- oder ertragsschwachen Flächen für Solarparks.' },
        { icon: 'roof', title: 'PV auf Scheunen & Ställen', description: 'Die riesigen Dächer sind ideal für Anlagen zur Deckung des Eigenbedarfs.' },
    ],
    benefits: [
        { text: 'Schutz von Sonderkulturen (Obst, Wein) vor extremen Wetterereignissen.' },
        { text: 'Schaffung einer zweiten, stabilen und planbaren Einnahmequelle.' },
        { text: 'Senkung der Energiekosten für den Betrieb (z.B. Pumpen, Lüftung).' },
        { text: 'Sinnvolle und profitable Nutzung von ertragsschwachen Flächen.' },
    ],
    projectExample: {
        title: 'Innovativer Obstbaubetrieb',
        stats: '750 kWp Agri-PV Anlage | +15% Mehrertrag',
        description: 'Die hoch aufgeständerte, bifaziale PV-Anlage schützt die empfindlichen Apfelbäume vor Hagel und Sonnenbrand. Der erzeugte Strom wird direkt vermarktet und sichert dem Betrieb ein stabiles Grundeinkommen, unabhängig vom Ernteerfolg.',
        imageUrl: 'https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=2070&auto=format&fit=crop',
    },
  },
  {
    id: 'logistics',
    title: 'Logistik & Industrie',
    headline: 'Energiekosten senken, Prozesse sichern.',
    description: 'Hoher Stromverbrauch rund um die Uhr macht Logistik- und Industrieunternehmen besonders anfällig für steigende Energiepreise.',
    imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb122126a?q=80&w=2070&auto=format&fit=crop',
    heroImageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb122126a?q=80&w=2070&auto=format&fit=crop',
    challenges: [
        { icon: 'cost', title: 'Hohe Energiekosten', description: '24/7-Betrieb, Kühlung und Maschinen treiben die Stromrechnung in die Höhe.' },
        { icon: 'grid', title: 'Netzstabilität', description: 'Lastspitzen durch Maschinenanläufe belasten das Netz und verursachen hohe Netzentgelte.' },
        { icon: 'esg', title: 'ESG-Anforderungen', description: 'Kunden und Investoren fordern einen Nachweis für nachhaltiges Wirtschaften.' },
    ],
    ourApproach: 'Wir analysieren Ihre Lastgänge präzise und konzipieren eine maßgeschneiderte PV-Anlage, die Ihren Energiebedarf optimal deckt. Durch die Kombination mit intelligenten Speichersystemen und Ladeinfrastruktur maximieren wir Ihren Eigenverbrauch und sichern Ihre kritischen Prozesse ab.',
    solutions: [
        { icon: 'roof', title: 'Großflächige Dachanlagen', description: 'Nutzung riesiger Hallendächer für maximale Energieerzeugung.' },
        { icon: 'storage', title: 'Industrielle Speicher', description: 'Kappen von Lastspitzen (Peak Shaving) und Erhöhung des Eigenverbrauchs.' },
        { icon: 'charging', title: 'Ladeparks für Flotten', description: 'Elektrifizierung des Fuhrparks mit günstigem Solarstrom vom eigenen Dach.' },
    ],
    benefits: [
        { text: 'Drastische Senkung der Betriebskosten durch minimierten Strombezug.' },
        { text: 'Energieunabhängigkeit und Schutz vor Strompreisschwankungen.' },
        { text: 'Verbesserung der CO₂-Bilanz und Erfüllung von ESG-Kriterien.' },
        { text: 'Zusätzliche Einnahmen durch Einspeisung von Überschüssen.' },
    ],
    projectExample: {
        title: 'Logistikzentrum Potsdam',
        stats: '750 kWp Leistung | 60% Eigenverbrauchsanteil',
        description: 'Eine Dachanlage versorgt die energieintensive Förder- und Kühltechnik. Ein 200 kWh Speicher kappt die teuren Anlaufströme am Morgen und senkt die Netzentgelte um über 40%.',
        imageUrl: 'https://images.unsplash.com/photo-1599454100913-b903e12a4459?q=80&w=1932&auto=format&fit=crop',
    },
    infographicUrl: 'https://images.unsplash.com/photo-1629235942484-9366f3630132?q=80&w=1200&h=1500&auto=format&fit=crop',
  },
   {
    id: 'kommunen',
    title: 'Kommunen & Öffentliche Hand',
    headline: 'Brachflächen in Bürgervermögen verwandeln.',
    description: 'Kommunen, Flughäfen und öffentliche Einrichtungen verfügen oft über ungenutzte Flächen wie Deponien oder Konversionsflächen. Wir verwandeln diese in profitable Solarparks und schaffen regionale Wertschöpfung.',
    imageUrl: 'https://images.unsplash.com/photo-1508235281165-a88981b2484a?q=80&w=2071&auto=format&fit=crop',
    heroImageUrl: 'https://images.unsplash.com/photo-1508235281165-a88981b2484a?q=80&w=2071&auto=format&fit=crop',
    challenges: [
        { icon: 'dual-use', title: 'Ungenutzte, belastete Flächen', description: 'Ehemalige Deponien oder Militärflächen liegen brach und verursachen Kosten.' },
        { icon: 'revenue', title: 'Haushaltskonsolidierung', description: 'Kommunen suchen nach neuen, stabilen Einnahmequellen ohne eigene Investitionen.' },
        { icon: 'grid', title: 'Regionale Energieversorgung', description: 'Die Stärkung der lokalen Energieautarkie ist ein politisches Ziel.' },
    ],
    ourApproach: 'Wir sind Ihr Partner für die kommunale Energiewende. Wir analysieren das Potenzial Ihrer Flächen, entwickeln maßgeschneiderte Solarpark-Konzepte und binden auf Wunsch lokale Akteure durch Bürgerbeteiligungsmodelle mit ein. Sie profitieren von langfristigen Pachteinnahmen, ohne selbst investieren zu müssen.',
    solutions: [
        { icon: 'open-space', title: 'Solarparks auf Konversionsflächen', description: 'Sinnvolle und profitable Nachnutzung von ehemaligen Industrie-, Militär- oder Deponieflächen.' },
        { icon: 'tenant-power', title: 'Bürgerbeteiligungsmodelle', description: 'Finanzielle Teilhabe der Bürger am lokalen Solarpark zur Steigerung der Akzeptanz.' },
        { icon: 'roof', title: 'PV auf öffentlichen Gebäuden', description: 'Nutzung von Dächern von Schulen, Rathäusern oder Kläranlagen zur Senkung der kommunalen Stromkosten.' },
    ],
    benefits: [
        { text: 'Langfristige, stabile Pachteinnahmen für den kommunalen Haushalt.' },
        { text: 'Sinnvolle und ökologische Nachnutzung von Brachflächen.' },
        { text: 'Stärkung der regionalen Wertschöpfung und Energieautarkie.' },
        { text: 'Positives Image als Vorreiter-Kommune in der Energiewende.' },
    ],
    projectExample: {
        title: 'Bürger-Solarpark auf ehemaliger Deponie',
        stats: '2 MWp Leistung | Versorgung von ~600 Haushalten',
        description: 'Auf einer stillgelegten Deponie wurde ein Solarpark errichtet. Die Kommune profitiert von Pachteinnahmen, während die Bürger über eine Genossenschaft direkt in den Park investieren und von den Erträgen profitieren konnten.',
        imageUrl: 'https://images.unsplash.com/photo-1596371801258-a833216b251a?q=80&w=2070&auto=format&fit=crop',
    },
  },
  {
    id: 'retail',
    title: 'Handel',
    headline: 'Kunden anziehen, Kosten senken.',
    description: 'Supermärkte und Einkaufszentren haben durch Kühlung, Beleuchtung und lange Öffnungszeiten einen hohen und konstanten Energiebedarf.',
    imageUrl: 'https://images.unsplash.com/photo-1570857502907-a8b6b3d142f3?q=80&w=2070&auto=format&fit=crop',
    heroImageUrl: 'https://images.unsplash.com/photo-1570857502907-a8b6b3d142f3?q=80&w=2070&auto=format&fit=crop',
    challenges: [
        { icon: 'cost', title: 'Hohe Stromkosten', description: 'Kontinuierlicher Betrieb von Kühltheken und Beleuchtung führt zu hohen Grundlasten.' },
        { icon: 'customer', title: 'Neue Kundenanforderungen', description: 'Kunden mit E-Autos erwarten Lademöglichkeiten und bevorzugen nachhaltige Unternehmen.' },
        { icon: 'esg', title: 'Nachhaltigkeits-Reporting', description: 'Der Handel steht unter Druck, seine CO₂-Bilanz sichtbar zu verbessern.' },
    ],
    ourApproach: 'Wir verwandeln Ihren Standort in ein nachhaltiges Service-Center. Photovoltaik auf dem Dach und über den Parkplätzen (Solar-Carports) senkt nicht nur Ihre Energiekosten, sondern schafft auch eine moderne Ladeinfrastruktur, die neue, kaufkräftige Kundengruppen anzieht.',
    solutions: [
        { icon: 'roof', title: 'PV-Anlagen auf dem Dach', description: 'Nutzung großer Dachflächen zur Deckung der Grundlast von Kühlung und Beleuchtung.' },
        { icon: 'carport', title: 'Solar-Carports', description: 'Überdachung von Kundenparkplätzen zur Stromerzeugung und als Serviceangebot.' },
        { icon: 'charging', title: 'Öffentliche Ladesäulen', description: 'Schaffung eines neuen Umsatzstroms und Anziehungspunkt für E-Autofahrer.' },
    ],
    benefits: [
        { text: 'Reduzierung der Energiekosten um bis zu 40%.' },
        { text: 'Stärkung des Markenimages als modernes, nachhaltiges Unternehmen.' },
        { text: 'Neue Einnahmequellen durch den Verkauf von Ladestrom.' },
        { text: 'Erhöhung der Kundenfrequenz und Verweildauer.' },
    ],
    projectExample: {
        title: 'Edeka-Markt, Brandenburg',
        stats: '400 kWp Dachanlage | 250 kWp Solar-Carport | 10 HPC-Ladepunkte',
        description: 'Die Kombination aus Dach- und Carport-Anlage deckt über 50% des Eigenbedarfs. Der öffentliche Ladepark hat sich zu einem beliebten Treffpunkt für E-Autofahrer entwickelt und die Kundenfrequenz nachweislich erhöht.',
        imageUrl: 'https://images.unsplash.com/photo-1666209593430-349f7a778b7b?q=80&w=1974&auto=format&fit=crop',
    },
  },
  {
    id: 'real-estate',
    title: 'Immobilienwirtschaft',
    headline: 'Immobilienwert steigern, Mieter binden.',
    description: 'Für Wohnungsbaugesellschaften und Gewerbeimmobilien-Besitzer wird eine nachhaltige Energieversorgung zum entscheidenden Wettbewerbsvorteil.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    heroImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    challenges: [
        { icon: 'value', title: 'Steigerung des Immobilienwerts', description: 'Nachhaltige und energieeffiziente Gebäude erzielen höhere Mieten und Verkaufspreise.' },
        { icon: 'customer', title: 'Mieteranforderungen', description: 'Mieter fragen aktiv nach günstiger, sauberer Energie und Ladeinfrastruktur.' },
        { icon: 'esg', title: 'Regulatorischer Druck', description: 'Gesetzliche Anforderungen an die Energieeffizienz von Gebäuden (GEG) steigen.' },
    ],
    ourApproach: 'Wir entwickeln ganzheitliche Energiekonzepte für Ihre Immobilien. Mit Mieterstrommodellen bieten Sie Ihren Mietern günstigen, sauberen Strom direkt vom Dach. Eine flächendeckende Ladeinfrastruktur macht Ihr Objekt für E-Auto-Besitzer attraktiv und steigert den Wert Ihrer Immobilie nachhaltig.',
    solutions: [
        { icon: 'tenant-power', title: 'Mieterstrommodelle', description: 'Direkte Belieferung Ihrer Mieter mit günstigem Solarstrom vom Dach.' },
        { icon: 'charging', title: 'AC-Ladeinfrastruktur', description: 'Bereitstellung von Ladepunkten in Tiefgaragen und auf Stellplätzen.' },
        { icon: 'storage', title: 'Quartierspeicher', description: 'Zentrale Speicher zur Optimierung des Eigenverbrauchs im gesamten Gebäude.' },
    ],
    benefits: [
        { text: 'Nachhaltige Wertsteigerung Ihrer Immobilien.' },
        { text: 'Erhöhung der Attraktivität und Senkung der Mieterfluktuation.' },
        { text: 'Erfüllung von KfW-Effizienzstandards und gesetzlichen Vorgaben.' },
        { text: 'Zusätzliche Einnahmen durch den Verkauf von Mieter- und Ladestrom.' },
    ],
    projectExample: {
        title: 'Wohnquartier Berlin-Adlershof',
        stats: '350 kWp Dachanlage | 50 Ladepunkte',
        description: 'Ein Neubauquartier wurde von Beginn an als KfW-40 Plus-Haus geplant. Die PV-Anlage versorgt die Wohnungen über ein Mieterstrommodell und die Tiefgarage mit Ladestrom. Dies senkt die Nebenkosten für die Mieter und war ein zentrales Verkaufsargument.',
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop',
    },
  },
  {
    id: 'strom-verkaufen',
    title: 'Strom verkaufen',
    headline: 'Vom Erzeuger zum Energiehändler werden.',
    description: 'Ihre PV-Anlage produziert mehr Strom als Sie verbrauchen? Perfekt! Erfahren Sie hier alles über die verschiedenen Modelle, wie Sie Ihren überschüssigen Solarstrom profitabel verkaufen und so Ihre Rendite maximieren können.',
    imageUrl: 'https://images.unsplash.com/photo-1628087942182-7b3d0e34ab3c?q=80&w=2070&auto=format&fit=crop',
    heroImageUrl: 'https://images.unsplash.com/photo-1628087942182-7b3d0e34ab3c?q=80&w=2070&auto=format&fit=crop',
    challenges: [
        { icon: 'bureaucracy', title: 'Komplexität der Marktmodelle', description: 'EEG, Direktvermarktung, PPA – die Wahl des richtigen Modells ist entscheidend und oft unübersichtlich.' },
        { icon: 'tech', title: 'Technische & rechtliche Hürden', description: 'Fernsteuerbarkeit, Messkonzepte und Verträge erfordern tiefgehendes technisches und juristisches Wissen.' },
        { icon: 'revenue', title: 'Erlösoptimierung', description: 'Wie stelle ich sicher, dass ich den bestmöglichen Preis für meinen Strom erhalte und keine Fristen verpasse?' },
    ],
    ourApproach: 'Der Verkauf von Solarstrom bietet enorme Chancen, kann aber komplex sein. Wir bei ZOE Solar sehen uns als Ihr Lotse im Energiemarkt. Wir analysieren Ihr Erzeugungsprofil, bewerten die verschiedenen Vermarktungsoptionen und finden die für Sie profitabelste Strategie. Unser Service umfasst die komplette technische und administrative Abwicklung, damit Sie sich auf eines konzentrieren können: maximale Erträge zu erzielen. In diesem Leitfaden stellen wir Ihnen die drei gängigsten Modelle vor.',
    solutions: [
        { icon: 'revenue', title: 'EEG-Einspeisevergütung', description: 'Der garantierte, sichere Weg für Anlagen unter 100 kWp.' },
        { icon: 'grid', title: 'Direktvermarktung an der Börse', description: 'Der profitable Profi-Weg für größere Anlagen.' },
        { icon: 'tenant-power', title: 'Direktverkauf (PPA)', description: 'Individuelle Verträge für maximale Erlöse bei lokaler Abnahme.' },
    ],
    benefits: [
        { text: 'Maximierung Ihrer Rendite durch die Wahl des optimalen Vermarktungsmodells.' },
        { text: 'Schaffung einer zusätzlichen, stabilen Einnahmequelle.' },
        { text: 'Vollständige Übernahme der komplexen administrativen und technischen Prozesse.' },
        { text: 'Beitrag zur Netzstabilität und aktiven Teilnahme an der Energiewende.' },
    ],
    projectExample: {
        title: 'Solarpark Lausitz am Spotmarkt',
        stats: '5 MWp Leistung | Ø 1,5 ct/kWh Mehrerlös',
        description: 'Der 5 MWp-Solarpark vermarktet seinen Strom erfolgreich am Spotmarkt. Durch eine präzise Erzeugungsprognose und eine intelligente Handelsstrategie werden durchschnittlich 1,5 Cent pro kWh mehr erlöst als mit der festen EEG-Vergütung.',
        imageUrl: 'https://images.unsplash.com/photo-1508235281165-a88981b2484a?q=80&w=2071&auto=format&fit=crop',
    },
    guideContent: [
        { type: 'heading', text: 'Modell 1: EEG-Einspeisevergütung (Der sichere Klassiker)' },
        { type: 'subheading', text: 'Für wen?' },
        { type: 'paragraph', text: 'Primär für Anlagen mit einer Leistung **unter 100 kWp**. Es ist die einfachste Form, überschüssigen Strom zu verkaufen.' },
        { type: 'subheading', text: 'Wie funktioniert es?' },
        { type: 'paragraph', text: 'Sie erhalten einen staatlich garantierten Preis vom Netzbetreiber für jede eingespeiste Kilowattstunde (kWh). Dieser Preis ist für 20 Jahre festgeschrieben und bietet absolute Planungssicherheit. Wir übernehmen die komplette Anmeldung für Sie.' },
        { type: 'info_card', icon: 'info', title: 'Fazit EEG-Vergütung', text: 'Die ideale Lösung für kleinere bis mittlere Gewerbeanlagen, bei denen Einfachheit und garantierte Einnahmen im Vordergrund stehen.'},
        { type: 'heading', text: 'Modell 2: Direktvermarktung an der Börse (Der Profi-Weg)' },
        { type: 'subheading', text: 'Für wen?' },
        { type: 'paragraph', text: 'Verpflichtend für alle Neuanlagen mit einer Leistung **über 100 kWp**.' },
        { type: 'subheading', text: 'Wie funktioniert es?' },
        { type: 'paragraph', text: 'Ihr Strom wird über einen spezialisierten Dienstleister (Direktvermarkter) an der Strombörse verkauft. Sie erhalten den aktuellen Marktpreis plus eine staatliche Marktprämie. Die Erlöse sind variabel, liegen aber meist leicht über der festen EEG-Vergütung.' },
        { type: 'list', items: [
            '**Voraussetzung:** Ihre Anlage muss fernsteuerbar sein.',
            '**Unser Service:** Wir wählen den passenden Direktvermarkter für Sie aus und kümmern uns um die gesamte technische und administrative Abwicklung.'
        ]},
        { type: 'heading', text: 'Modell 3: Sonstige Direktvermarktung / PPA (Der individuelle Vertrag)' },
        { type: 'subheading', text: 'Für wen?' },
        { type: 'paragraph', text: 'Für Anlagenbetreiber, die einen oder mehrere konkrete Abnehmer in räumlicher Nähe haben (z.B. ein benachbartes Unternehmen).' },
        { type: 'subheading', text: 'Wie funktioniert es?' },
        { type: 'paragraph', text: 'Sie schließen einen direkten, langfristigen Stromliefervertrag (Power Purchase Agreement, PPA) mit dem Abnehmer. Der Strompreis ist frei verhandelbar und liegt typischerweise deutlich über der EEG-Vergütung.' },
        { type: 'info_card', icon: 'warning', title: 'Komplexität beachten', text: 'Dies ist das potenziell lukrativste, aber auch mit Abstand komplexeste Modell. Es erfordert eine intensive juristische und technische Begleitung, die wir gerne für Sie übernehmen.'}
    ],
  },
];

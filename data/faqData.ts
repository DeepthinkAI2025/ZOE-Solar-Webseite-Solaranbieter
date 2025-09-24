export type FaqCategory = 'Allgemein' | 'Technik' | 'Wirtschaftlichkeit';

export interface FaqItem {
    category: FaqCategory;
    question: string;
    answer: string;
}

export const faqData: FaqItem[] = [
    {
        category: 'Allgemein',
        question: 'Für wen eignet sich eine gewerbliche PV-Anlage?',
        answer: 'Eine gewerbliche PV-Anlage eignet sich für jedes Unternehmen mit großen, ungenutzten Dach- oder Freiflächen und einem konstanten Stromverbrauch, z.B. Logistikzentren, Produktionsbetriebe, Kühlhäuser, landwirtschaftliche Betriebe oder Handelsfilialen.'
    },
    {
        category: 'Allgemein',
        question: 'Was unterscheidet ZOE Solar von anderen Anbietern?',
        answer: 'Drei wesentliche Punkte: 1. Wir sind herstellerunabhängig und wählen immer die beste Technik für Ihre maximale Rendite. 2. Wir arbeiten ausschließlich mit eigenen, IHK-zertifizierten Expertenteams, ohne Subunternehmer. 3. Wir sind Ihr einziger Ansprechpartner für alles – von der Planung bis zum Netzanschluss.'
    },
    {
        category: 'Technik',
        question: 'Wie lange halten Solarmodule und Wechselrichter?',
        answer: 'Hochwertige Solarmodule haben eine Lebensdauer von 30 bis 40 Jahren und kommen mit einer Leistungsgarantie von 25-30 Jahren. Moderne Wechselrichter sind auf eine Lebensdauer von ca. 15-20 Jahren ausgelegt und müssen im Lebenszyklus der Anlage eventuell einmal getauscht werden.'
    },
    {
        category: 'Technik',
        question: 'Was passiert bei einem Stromausfall?',
        answer: 'Standard-PV-Anlagen schalten sich bei einem Stromausfall aus Sicherheitsgründen ab. In Kombination mit einem Batteriespeicher kann jedoch eine Not- oder Ersatzstromversorgung realisiert werden, die kritische Verbraucher in Ihrem Betrieb weiterversorgt.'
    },
    {
        category: 'Wirtschaftlichkeit',
        question: 'Wann amortisiert sich eine gewerbliche PV-Anlage?',
        answer: 'Die Amortisationszeit hängt von der Anlagengröße, Ihrer Eigenverbrauchsquote und der Strompreisentwicklung ab. Dank gesunkener Anlagenpreise und hoher Stromkosten liegen die Amortisationszeiten für gewerbliche Anlagen oft nur noch bei 6 bis 10 Jahren.'
    },
    {
        category: 'Wirtschaftlichkeit',
        question: 'Welche Vorteile bietet ein Batteriespeicher für mein Unternehmen?',
        answer: 'Ein Batteriespeicher maximiert die Rentabilität durch zwei Hauptfunktionen: 1. Erhöhung des Eigenverbrauchs, indem tagsüber erzeugter Strom nachts verfügbar gemacht wird. 2. Kappung von teuren Lastspitzen (Peak Shaving), was die Netzentgelte erheblich senken kann.'
    },
];

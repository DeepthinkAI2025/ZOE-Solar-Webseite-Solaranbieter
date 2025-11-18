// Typdefinition für FAQ-Kategorien
export type FaqCategory =
  | 'Allgemein'
  | 'Technik'
  | 'Wirtschaftlichkeit'
  | 'Finanzierung'
  | 'Förderung'
  | 'Region'
  | 'Betrieb'
  | 'Verträge';

// FAQ-Daten
export const faqData: {
  category: FaqCategory;
  question: string;
  answer: string;
  regions?: string[];
}[] = [
  {
    category: 'Allgemein',
    question: 'Für wen eignet sich eine gewerbliche PV-Anlage?',
    answer:
      'Eine gewerbliche PV-Anlage lohnt sich für Unternehmen mit hohen Stromkosten und nutzbaren Dach- oder Freiflächen – etwa **Logistikzentren**, **Produktionsbetriebe**, Kühlhäuser, Hotels oder landwirtschaftliche Höfe mit konstantem Energiebedarf.',
  },
  {
    category: 'Allgemein',
    question: 'Was unterscheidet ZOE Solar von anderen Anbietern?',
    answer:
      'Wir kombinieren **herstellerunabhängige Planung**, eigene IHK-zertifizierte Montageteams und ein End-to-End-Projektmanagement – von der Machbarkeitsanalyse über Finanzierung und Netzanschluss bis hin zu 24/7-Monitoring und Wartung.',
  },
  {
    category: 'Technik',
    question: 'Wie lange halten Solarmodule und Wechselrichter?',
    answer:
      'Premium-Module erreichen Lebensdauern von 30–40 Jahren und sind häufig mit 25- bzw. 30-jähriger **Leistungsgarantie** ausgestattet. Wechselrichter laufen im Schnitt 15–20 Jahre; Wartungspläne von ZOE Solar berücksichtigen den rechtzeitigen Tausch.',
  },
  {
    category: 'Technik',
    question: 'Was passiert bei einem Stromausfall?',
    answer:
      'Aus Sicherheitsgründen trennen sich PV-Anlagen ohne Speicher vom Netz. Mit einem **Batteriespeicher** und einem Ersatzstrom- oder Schwarzstart-Konzept (z. B. NA-Schutz, Feuerwehrschalter) stellen wir kritische Verbraucher weiterhin bereit.',
  },
  {
    category: 'Wirtschaftlichkeit',
    question: 'Wann amortisiert sich eine gewerbliche PV-Anlage?',
    answer:
      'Je nach Eigenverbrauchsquote, **Strompreis** und Förderlage amortisieren sich moderne Gewerbeanlagen in 6–10 Jahren. Mit **Lastmanagement** und Speichern lassen sich Spitzenlasten reduzieren und die Rendite weiter erhöhen.',
  },
  {
    category: 'Wirtschaftlichkeit',
    question: 'Welche Vorteile bietet ein Batteriespeicher für mein Unternehmen?',
    answer:
      'Speicher erhöhen den **Eigenverbrauch**, vermeiden teure Lastspitzen (Peak Shaving) und sichern sensible Prozesse ab. In Kombination mit variablen Tarifen können Unternehmen zusätzliche Arbitragegewinne erzielen.',
  },
  {
    category: 'Finanzierung',
    question: 'Wie funktioniert das Power Purchase Agreement (PPA) mit ZOE Solar?',
    answer:
      'Beim **Power Purchase Agreement (PPA)** übernimmt ZOE Solar Investition, Betrieb und Wartung der Anlage. Sie zahlen einen langfristig planbaren Strompreis, der an einen Energieindex gekoppelt werden kann, und benötigen kein eigenes CAPEX.',
  },
  {
    category: 'Finanzierung',
    question: 'Welche steuerlichen Effekte bringt eine PV-Anlage für Gewerbekunden?',
    answer:
      'Unternehmen nutzen die **Sonder-AfA nach §7c EStG**, erhalten Vorsteuerabzug und profitieren von §3 Nr. 72 EStG (steuerfreie Einspeiseerlöse). Wir liefern alle Daten für Abschreibung, Bilanzierung und CSRD-Reporting mit.',
  },
  {
    category: 'Förderung',
    question: 'Welche Förderprogramme stehen 2025 für Unternehmen in Berlin zur Verfügung?',
    answer:
      'In Berlin kombinieren Betriebe die **IBB-Energie**-Förderung mit der **Bundesförderung für effiziente Gebäude (BEG)** und ggf. dem **EEG-Einspeisetarif**. Wir prüfen zusätzlich steuerliche Sonderabschreibungen und regionale Zuschüsse.',
    regions: ['berlin'],
  },
  {
    category: 'Region',
    question: 'Welche Besonderheiten gelten in München für große Dachanlagen?',
    answer:
      'In München sind **Schneelastzonen** und Blitzschutzklasse II einzuplanen. Wir liefern Statiknachweise nach **DIN 1055**, integrieren Schneefangsysteme und stimmen uns mit den Stadtwerken München zu Förderungen und Netzanschluss ab.',
    regions: ['muenchen'],
  },
  {
    category: 'Region',
    question: 'Wie läuft der Netzanschlussprozess mit ewz in Zürich?',
    answer:
      'Für Zürich melden wir Projekte bei **Pronovo** an, reichen das Netzanschlussgesuch bei **ewz** ein und kümmern uns um die Abnahme. Die Einmalvergütung (EIV) und kantonale Förderprogramme werden automatisch berücksichtigt.',
    regions: ['zuerich'],
  },
  {
    category: 'Betrieb',
    question: 'Welche Monitoring-Lösung setzt ZOE Solar ein?',
    answer:
      'Über unsere **SCADA-Plattform** mit App-Zugang behalten Sie Ertrag, Verbrauch, Speicher und Ladepunkte live im Blick. Alarme werden per SMS, E-Mail oder Ticketsystem an Ihr Betriebsteam und unseren Service übergeben.',
  },
  {
    category: 'Betrieb',
    question: 'Wie häufig wird eine gewerbliche PV-Anlage gewartet?',
    answer:
      'Wir führen jährliche Sicht- und Funktionsprüfungen, halbjährliche **Thermografien** und Vegetationsmanagement bei Freiflächen durch. Kritische Komponenten werden per Predictive-Maintenance überwacht.',
  },
  {
    category: 'Verträge',
    question: 'Welche Garantien und Versicherungen deckt ZOE Solar ab?',
    answer:
      'Unsere Projekte beinhalten Produkt- und Leistungsgarantien der Hersteller (bis 30 Jahre), eine 10-jährige Montagegarantie sowie optional **Elektronik- und Betriebsunterbrechungsversicherungen**. Auf Wunsch integrieren wir Cyber-Deckungen.',
  },
  {
    category: 'Verträge',
    question: 'Was passiert am Ende eines Contracting-Vertrags?',
    answer:
      'Zum Laufzeitende wählen Sie zwischen **Kauf der Anlage (Buy-out)**, Vertragsverlängerung oder einem Rückbau durch uns. Alle Optionen werden bereits im Vertrag transparent mit Restwerten und Servicepaketen ausgewiesen.',
  },
  {
    category: 'Förderung',
    question: 'Ab wie viel kW Peak Solaranlage muss ich an die Börse verkaufen?',
    answer:
      'Sie müssen Ihre Solaranlage an die Börse verkaufen, wenn sie eine Leistung von über 100 kWp hat und ab dem 1. Januar 2016 in Betrieb genommen wurde. Dies ist im Erneuerbare-Energien-Gesetz (EEG) geregelt. Die Abwicklung erfolgt über einen Dienstleister, einen sogenannten Direktvermarkter, der den Strom dann an der Strombörse verkauft.\n\n**Was bedeutet das für Sie?**\n\n- **Pflicht zur Direktvermarktung**: Als Betreiber einer Anlage über 100 kWp sind Sie dazu verpflichtet, Ihren Strom an der Börse zu verkaufen.\n- **Rolle des Direktvermarkters**: Ein Energiehandelsunternehmen kümmert sich um den technischen Anschluss und den Verkauf des Stroms an der Börse, da die Anlage fernsteuerbar sein muss.\n- **Marktprämienmodell**: Sie erhalten nicht nur den Erlös aus dem Stromverkauf an der Börse, sondern zusätzlich eine Marktprämie, die die Differenz zwischen dem Börsenpreis und einem bestimmten anzulegenden Wert ausgleichen soll.\n- **Ausnahmen für ältere Anlagen**: Anlagen, deren Inbetriebnahme vor dem 1. Januar 2016 erfolgte, haben weiterhin die Wahl zwischen der Direktvermarktung und der klassischen Einspeisevergütung.\n\n**Zusammenfassend**: Betreiben Sie eine PV-Anlage mit einer Leistung von über 100 kWp, die nach dem 1. Januar 2016 in Betrieb genommen wurde, müssen Sie diese nicht selbst direkt an der Börse verkaufen, sondern die Direktvermarktung nutzen.',
  },
  {
    category: 'Förderung',
    question: 'Welche Förderprogramme stehen 2025 für Unternehmen in Berlin zur Verfügung?',
    answer:
      'In Berlin profitieren Sie von der **IBB-Energieeffizienzförderung** (bis 50 % Zuschuss für PV-Anlagen), Bundesförderung effiziente Gebäude (BEG) und steuerlichen Sonderabschreibungen (§7c EStG). Wir prüfen Ihre Förderfähigkeit und übernehmen die Antragstellung.',
    regions: ['Berlin'],
  },
  {
    category: 'Technik',
    question: 'Welche Monitoring-Lösung setzt ZOE Solar ein und wie können Betreiber zugreifen?',
    answer:
      'Wir nutzen SCADA-basierte Monitoring-Plattformen mit 24/7-Überwachung, Alarmierung per SMS/E-Mail und detaillierten Ertragsberichten. Betreiber erhalten Zugang über eine sichere Web-App oder API-Integration in bestehende ERP-Systeme.',
  },
  {
    category: 'Technik',
    question: 'Wie werden Brandschutz und Abschaltkonzepte umgesetzt?',
    answer:
      'Unsere Anlagen entsprechen **DIN VDE 0100-712** und beinhalten Feuerwehrschalter, Blitzschutzsysteme (Klasse II) und Notabschaltungen. Wir erstellen Brandschutzkonzepte und Schulungen für Ihre Mitarbeiter.',
  },
  {
    category: 'Technik',
    question: 'Welche Wartungsintervalle gelten für Dach- vs. Freiflächenanlagen?',
    answer:
      'Dachanlagen erhalten jährliche Inspektionen und Thermografie-Scans; Freiflächenanlagen zusätzlich halbjährliche Vegetationskontrollen. Wir bieten Serviceverträge mit SLA von 99 % Verfügbarkeit.',
  },
  {
    category: 'Technik',
    question: 'Wie integriert ihr Batteriespeicher in bestehende EMS-Systeme?',
    answer:
      'Unsere Speicher kommunizieren über **Modbus/TCP** oder REST-APIs mit gängigen Energiemanagementsystemen. Wir unterstützen Lastganganalysen, Peak-Shaving und Integration in Smart-Grid-Konzepte.',
  },
  {
    category: 'Finanzierung',
    question: 'Wie funktioniert das PPA-Modell (Power Purchase Agreement) mit ZOE Solar?',
    answer:
      'Bei PPA kaufen Sie den erzeugten Strom zu festen Preisen (10–15 Jahre Laufzeit, indexiert). Wir übernehmen Planung, Bau und Betrieb; Sie profitieren von stabilen Kosten ohne Investition. Ideal für Unternehmen ohne Eigenkapital.',
  },
  {
    category: 'Wirtschaftlichkeit',
    question: 'Welche steuerlichen Effekte bringt eine PV-Anlage für Gewerbekunden?',
    answer:
      'Sie profitieren von **Vorsteuerabzug**, Sonder-AfA (§7c EStG), Gewerbesteuerreduktion durch höhere Abschreibungen und möglichen Umsatzsteuerbefreiungen. Wir beraten zu steueroptimierten Modellen.',
  },
  {
    category: 'Region',
    question: 'Welche Genehmigungen brauche ich in Berlin für eine Dach-PV?',
    answer:
      'In Berlin reicht meist eine **vereinfachte Anzeige** beim Bauamt (unter 10 kWp). Bei denkmalgeschützten Gebäuden prüfen wir Denkmalschutz; Brandschutzkonzepte und Netzanschlussanmeldung übernehmen wir.',
    regions: ['Berlin'],
  },
  {
    category: 'Region',
    question: 'Welche Besonderheiten gelten in München (Schneelast, Blitzschutz)?',
    answer:
      'München erfordert statische Prüfungen nach **DIN 1055** (Schneelastzone 2), Schneefangsysteme und Blitzschutz Klasse II. Wir berücksichtigen lokale Vorschriften und bieten zertifizierte Montage.',
    regions: ['München'],
  },
  {
    category: 'Region',
    question: 'Wie läuft der Netzanschlussprozess mit ewz/Energie 360° in Zürich?',
    answer:
      'In Zürich erfolgt die Anmeldung über **Pronovo** mit Netzanschlussgesuch. Wir koordinieren die Abnahme durch ewz und integrieren Smart-Metering für optimale Lastverteilung.',
    regions: ['Zürich'],
  },
];
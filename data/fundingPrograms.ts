import { FundingProgram, FundingProgramLevel } from '../types';

export const fundingPrograms: FundingProgram[] = [
  {
    slug: "kfw",
    title: "KfW-Förderlandschaft Erneuerbare Energien",
    shortTitle: "KfW Überblick",
    provider: "KfW Bankengruppe",
    level: "bund",
    isActive: true,
    summary:
      "Die KfW bündelt mehrere Bundesprogramme für erneuerbare Energien, Speicher, Ladeinfrastruktur und energieeffiziente Produktionsprozesse. Unternehmen erhalten langfristige, zinsgünstige Kredite mit optionalen Tilgungszuschüssen.",
    tagline: "Zinsgünstige Bundesprogramme für Solar-, Speicher- und Ladeprojekte",
    heroImage:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/KfW-Logo.svg/2560px-KfW-Logo.svg.png",
    fundingTypes: ["Kredit", "Tilgungszuschuss"],
    maxFunding: "Bis zu 100 % der förderfähigen Investitionskosten",
    fundingRate: "Effektivzinssätze ab 1,60 % p.a.",
    targetGroups: ["Gewerbe", "Industrie", "Landwirtschaft", "Kommunen", "Contractoren"],
    eligibleProjects: [
      "Photovoltaik-Aufdachanlagen ab 10 kWp",
      "Freiflächenanlagen auf Konversions- und Gewerbeflächen",
      "Batteriespeicher, Wasserstoff- und Hybridlösungen",
      "Wärmepumpen, Solarthermie und Power-to-Heat",
    ],
    eligibleCosts: [
      "Planung, Projektierung und Baunebenkosten",
      "Technische Komponenten inkl. Speicher und EMS",
      "Netzanschluss, Trafo und Messkonzepte",
      "Software für Monitoring und Flexibilitätsvermarktung",
    ],
    nonEligibleCosts: [
      "Ersatzbeschaffungen ohne Effizienzgewinn",
      "Reine Stromhandelsaktivitäten ohne Eigenverbrauch",
      "Investitionen, die bereits über andere Bundesprogramme vollständig bezuschusst werden",
    ],
    requirements: [
      "Antragstellung zwingend vor Projektbeginn (Hausbankprinzip)",
      "Nachweis eines wirtschaftlichen Geschäftsmodells über Jahresabschlüsse/BWA",
      "Technisches Gesamtkonzept mit realistischer Ertragsprognose",
      "Einhaltung der EU-Taxonomie- und ESG-Vorgaben",
    ],
    applicationSteps: [
      "Fördermittel-Screening & Strategie-Workshop mit ZOE Solar",
      "Hausbanktermin und Einreichung der KfW-Unterlagen",
      "Detailplanung, Lieferantenauswahl und Genehmigungen",
      "Kreditzusage, Abrufplan und Projektstart",
      "Projektumsetzung, Nachweisführung und Auszahlung von Tilgungszuschüssen",
    ],
    documentsRequired: [
      "Jahresabschlüsse bzw. BWA der letzten zwei Geschäftsjahre",
      "Aktueller Liquiditäts- und Finanzierungsplan",
      "Flächen- oder Dachnutzungsrechte sowie Netzanschlusszusage",
      "Technisches Konzept inkl. Ertragsgutachten",
      "Nachweis der Unternehmensbonität (Schufa/Rating)",
    ],
    processingTime: "6–8 Wochen nach Vollständigkeit der Unterlagen",
    deadlines: "Laufende Antragstellung – Mittelreservierung nach Hausbankkontingent",
    combinationTips: [
      "Mit BAFA-Zuschüssen (EEW) oder regionalen Bonusprogrammen kombinierbar",
      "Einsatz von Contracting-Strukturen möglich, sofern wirtschaftliches Eigentum klar geregelt ist",
      "In Kombination mit Stromlieferverträgen (PPA) planbar",
    ],
    repaymentBenefits: [
      "Tilgungsfreie Anlaufjahre (1–3 Jahre) entlasten die Liquidität",
      "Optionale Sondertilgungen ohne Vorfälligkeitsentschädigung (programmspezifisch)",
      "Tilgungszuschüsse bei besonders klimarelevanten Projekten",
    ],
    supportServices: [
      "Bankfähige Business-Cases und Cashflow-Modelle",
      "Vorbereitung und Moderation aller Banktermine",
      "Projektsteuerung bis zur Verwendungsnachweisprüfung",
      "Monitoring & Reporting für ESG/Nachhaltigkeitsanforderungen",
    ],
    highlights: [
      {
        title: "Langfristige Zinssicherheit",
        description: "Festzins über bis zu 20 Jahre schützt vor steigenden Kapitalkosten.",
      },
      {
        title: "Hohe Volumina",
        description: "Kredite bis 50 Mio. € pro Vorhaben ermöglichen große Solarparks und Werksprojekte.",
      },
      {
        title: "Hausbankprinzip",
        description: "Betreuung durch die vertraute Hausbank bei gleichzeitiger Bundesförderung.",
      },
    ],
    faqs: [
      {
        question: "Kann die KfW-Finanzierung mit Zuschüssen kombiniert werden?",
        answer:
          "Ja. BAFA-Zuschüsse, Landesprogramme oder kommunale Boni können als Eigenmittelersatz eingesetzt werden. Wichtig ist, dass die Summe der Förderungen die Investitionskosten nicht übersteigt.",
      },
      {
        question: "Wie lange bleibt der bewilligte Zinssatz gültig?",
        answer:
          "Nach Zusage gilt die Zinsbindung in der Regel 6 Monate. Innerhalb dieser Zeit muss der Kredit abgerufen werden. Auf Antrag kann die Frist verlängert werden.",
      },
      {
        question: "Wer reicht den Antrag bei der KfW ein?",
        answer:
          "Die Antragstellung erfolgt immer über die Hausbank. ZOE Solar bereitet die Unterlagen vor und begleitet Ihr Bankgespräch.",
      },
    ],
    contact: {
      phone: "0800 539 9001",
      email: "infocenter@kfw.de",
      url: "https://www.kfw.de/",
      hotlineHours: "Mo–Fr 08:00–18:00 Uhr",
      note: "Bitte halten Sie Ihre Kundennummer oder das geplante Investitionsvolumen bereit.",
    },
    externalLinks: [
      {
        label: "KfW Programmübersicht Erneuerbare Energien",
        url: "https://www.kfw.de/inlandsfoerderung/Unternehmen/Energie-Umwelt/Erneuerbare-Energien/",
      },
      { label: "Merkblatt Programm 270", url: "https://www.kfw.de/270" },
    ],
    seo: {
      title: "KfW Förderung für Photovoltaik & Speicher 2025 | ZOE Solar",
      description:
        "Überblick über alle aktiven KfW-Programme für Solarstrom, Speicher und Ladeinfrastruktur inkl. Tilgungszuschüssen.",
      keywords: [
        "KfW 270",
        "KfW Förderung Photovoltaik",
        "KfW Kredit Solar",
        "Tilgungszuschuss erneuerbare Energien",
        "Solar Finanzierung Gewerbe",
      ],
      canonical: "https://www.zoe-solar.de/foerdermittel/kfw",
    },
    lastUpdated: "September 2025",
    legalBasis: "KfW-Richtlinie Erneuerbare Energien 2024",
    notes: "Anträge müssen vor dem ersten rechtsverbindlichen Liefer- oder Leistungsvertrag gestellt werden.",
  },
  {
    slug: "kfw-270-erneuerbare-energien",
    title: "KfW-Programm 270 – Erneuerbare Energien Standard",
    shortTitle: "KfW 270",
    provider: "KfW Bankengruppe",
    level: "bund",
    isActive: true,
    summary:
      "Das wichtigste Bundesprogramm für Photovoltaik, Speicher und Wärmenetze. Bis zu 100 % der Nettoinvestition lassen sich über langfristige Kredite mit sehr günstigen Zinssätzen finanzieren.",
    tagline: "Das Referenzprogramm für Solar- und Speicherprojekte in Deutschland",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/KfW-Logo.svg/2560px-KfW-Logo.svg.png",
    fundingTypes: ["Kredit"],
    maxFunding: "Bis zu 50 Mio. € Kreditvolumen",
    fundingRate: "Bis zu 100 % Finanzierung + 3 tilgungsfreie Jahre",
    targetGroups: ["Mittelstand", "Industrie", "Landwirtschaft", "Gemeinnützige Institutionen"],
    eligibleProjects: [
      "PV-Aufdachanlagen ab 40 kWp",
      "Freiflächenanlagen auf Konversionsflächen",
      "Batteriespeicher und Sektorkopplung",
      "Netz- und Trafostationen für Eigenstrom",
    ],
    eligibleCosts: [
      "Anlagenhardware inkl. Speicher",
      "Planungs- und Projektierungskosten",
      "Bauausführung, Montage und Inbetriebnahme",
      "Netzanschluss, Kabeltrassen und Trafostationen",
    ],
    nonEligibleCosts: [
      "PV-Anlagen, die bereits in Betrieb sind",
      "Aufwendungen für reine Grundstücks- oder Gebäudeanschaffung",
      "Refinanzierung bereits bezahlter Rechnungen",
    ],
    requirements: [
      "Förderfähiger Eigenverbrauchs- oder Direktlieferanteil",
      "Einhaltung der EEG- und BEG-Richtlinien",
      "Bonitätsnachweis durch Hausbank",
    ],
    applicationSteps: [
      "Technische und wirtschaftliche Erstbewertung",
      "Förderfähige Kosten aufbereiten & Bankgespräch",
      "Antragstellung über Hausbank vor Projektstart",
      "Projektumsetzung & Rechnungslegung",
      "Verwendungsnachweis gegenüber Hausbank & KfW",
    ],
    documentsRequired: [
      "Detailliertes Angebot inkl. Stückliste",
      "Standortanalyse & Ertragsberechnung",
      "BWA/Jahresabschluss",
      "Nachweis Eigentums- bzw. Nutzungsrechte",
    ],
    processingTime: "4–6 Wochen",
    deadlines: "Laufend, Mittel 2025 gesichert",
    combinationTips: [
      "Mit BAFA-Transformationskonzepten kombinierbar",
      "Ergänzend zu kommunalen Zuschüssen nutzbar",
    ],
    repaymentBenefits: ["Bis zu 3 tilgungsfreie Jahre"],
    supportServices: [
      "Machbarkeitsanalyse",
      "Bankfähige Kalkulation",
      "Netzanschlusskoordination",
    ],
    highlights: [
      {
        title: "Top-Zinsen",
        description: "Zinssätze deutlich unter Marktvergleich bei fester Laufzeit.",
      },
      {
        title: "Flexible Laufzeiten",
        description: "Laufzeiten 5–20 Jahre, optional unterschiedliche Tilgungsmodelle.",
      },
    ],
    faqs: [
      {
        question: "Wie hoch ist die Mindestgröße?",
        answer: "Es gibt keine formale Mindestgröße, wirtschaftlich sinnvoll ab ca. 40 kWp.",
      },
      {
        question: "Brauche ich Eigenkapital?",
        answer: "Nein, bis zu 100 % Finanzierung möglich. Sicherheiten stellt meist die Hausbank.",
      },
    ],
    contact: {
      phone: "0800 539 9001",
      email: "infocenter@kfw.de",
      url: "https://www.kfw.de/270",
    },
    externalLinks: [
      { label: "Programm 270 Details", url: "https://www.kfw.de/270" },
      { label: "KfW Tilgungsrechner", url: "https://www.kfw.de/rechner" },
    ],
    seo: {
      title: "KfW 270 Förderung – Erneuerbare Energien Standard",
      description: "Zinsgünstiger KfW-Kredit 270 für PV, Speicher und Netzinfrastruktur erklärt.",
      keywords: [
        "KfW 270",
        "KfW Photovoltaik Kredit",
        "KfW Speicher Finanzierung",
        "Tilgungsfreie Jahre KfW",
      ],
    },
    lastUpdated: "September 2025",
    legalBasis: "KfW Merkblatt 270/2025",
  },
  {
  slug: "kfw-359-ladeinfrastruktur-gewerbe",
    title: "KfW 359 – Ladeinfrastruktur für Unternehmen",
    shortTitle: "KfW 359",
    provider: "KfW Bankengruppe",
    level: "bund",
    isActive: true,
    summary:
      "Fördert den Aufbau von Ladepunkten auf Betriebsgeländen, im Gewerbepark oder am Firmenstandort. Kombinierbar mit PV-Anlagen und Speichern für genuines Energiemanagement.",
    tagline: "Bundesförderung für gewerbliche Ladeinfrastruktur",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/KfW-Logo.svg/2560px-KfW-Logo.svg.png",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 45.000 € Zuschuss pro Standort",
    fundingRate: "Bis zu 70 % der förderfähigen Kosten",
    targetGroups: ["Unternehmen", "Kommunale Betriebe", "Wohnungswirtschaft"],
    eligibleProjects: [
      "AC- und DC-Ladepunkte bis 150 kW",
      "Intelligente Mess- und Steuerungstechnik",
      "PV-gekoppelte Ladehubs",
    ],
    eligibleCosts: [
      "Kauf und Installation der Ladehardware",
      "Anschlussarbeiten, Kabel und Fundament",
      "Energiemanagement-Software",
    ],
    nonEligibleCosts: ["Betriebskosten und Wartungsverträge"],
    requirements: [
      "Strom muss aus erneuerbaren Quellen stammen",
      "Ladepunkte dürfen nicht öffentlich zugänglich sein",
    ],
    applicationSteps: [
      "Antragstellung im KfW-Zuschussportal",
      "Technische Planung und Angebotseinholung",
      "Umsetzung innerhalb von 12 Monaten",
      "Verwendungsnachweis mit Rechnungen",
    ],
    documentsRequired: [
      "Kostenvoranschlag",
      "Lastmanagementkonzept",
      "Nachweis über Ökostromlieferung",
    ],
    processingTime: "2–3 Wochen",
    deadlines: "Fördertopf 2025 mit 400 Mio. € gefüllt",
    combinationTips: [
      "Mit KfW 270 für PV- und Speicherkopplung kombinierbar",
      "Zusätzliche Landeszuschüsse für Ladeinfrastruktur prüfen",
    ],
    supportServices: [
      "Lastprofilanalyse",
      "Hardware- und Anbieterbenchmark",
      "Inbetriebnahme & Messkonzept",
    ],
    highlights: [
      { title: "Hohe Zuschussquote", description: "Bis zu 70 % Förderung reduziert CAPEX deutlich." },
      { title: "Digitales Portal", description: "Antrag komplett online ohne Hausbank." },
    ],
    faqs: [
      {
        question: "Darf öffentliches Laden angeboten werden?",
        answer: "Nein, Programm 359 richtet sich an nicht öffentliche Ladepunkte. Für öffentliches Laden gibt es andere Programme.",
      },
    ],
    contact: {
      phone: "0800 539 9002",
      url: "https://www.kfw.de/359",
    },
    seo: {
      title: "KfW 359 Ladeinfrastruktur – Zuschuss für Unternehmen",
      description: "Bis zu 70 % Zuschuss für firmeneigene Ladepunkte inkl. PV-Anbindung.",
      keywords: ["KfW 359", "Ladeinfrastruktur Förderung", "Firmenladenpunkte Zuschuss"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "bafa-eew-zuschuss",
    title: "BAFA EEW – Bundesförderung für Energie- und Ressourceneffizienz",
    shortTitle: "BAFA EEW",
    provider: "BAFA",
    level: "bund",
    isActive: true,
    summary:
      "Direkte Zuschüsse für einzelne Effizienzmaßnahmen in Unternehmen. PV-gekoppelte Prozesse, Abwärmenutzung und Stromspeicher lassen sich fördern.",
    tagline: "Direkte Zuschüsse für Effizienz und Dekarbonisierung",
    logo: "https://www.bafa.de/SharedDocs/Downloads/DE/bafa_logo.png?__blob=publicationFile&v=4",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 15 Mio. € Zuschuss pro Maßnahme",
    fundingRate: "Bis zu 40 % (KMU bis 60 %)",
    targetGroups: ["Industrie", "Gewerbe", "Rechenzentren"],
    eligibleProjects: [
      "PV-gestützte Prozessstromversorgung",
      "Strom- und Wärmespeicher",
      "Energiemonitoring & -steuerung",
    ],
    eligibleCosts: ["Investitionskosten + Montage", "Planung & Engineering", "Mess- und Regeltechnik"],
    nonEligibleCosts: ["Ersatzinvestitionen ohne Effizienzgewinn", "Fahrzeuge"],
    requirements: [
      "Transformationskonzept oder Energieaudit",
      "Nachweis beträchtlicher Energieeinsparung",
    ],
    applicationSteps: [
      "Vorprüfung & Erstellung Fördermodul",
      "Antrag im BAFA-Portal vor Maßnahmenbeginn",
      "Zuwendungsbescheid abwarten",
      "Maßnahme umsetzen & Nachweis einreichen",
    ],
    documentsRequired: [
      "Energieauditbericht",
      "Technische Projektbeschreibung",
      "Kostenvoranschläge",
    ],
    processingTime: "8–12 Wochen",
    deadlines: "Anträge fortlaufend, Budgets 2025 gesichert",
    combinationTips: [
      "Mit KfW-Darlehen als Kofinanzierung nutzen",
      "Kommunale Zuschüsse ergänzen die Eigenmittel",
    ],
    supportServices: [
      "Erstellung von BAFA-konformen Nachweisen",
      "Berechnung der CO₂-Einsparung",
      "Begleitung der Verwendungsnachweise",
    ],
    highlights: [
      {
        title: "Hohe Zuschussquote",
        description: "Gerade für KMU werden bis zu 60 % der Investition übernommen.",
      },
      {
        title: "Technologieoffen",
        description: "Von PV über Speicher bis Prozesswärme – modular förderfähig.",
      },
    ],
    faqs: [
      {
        question: "Brauche ich ein Transformationskonzept?",
        answer: "Für Module 4 (Transformationskonzept) ja, für Einzelmaßnahmen reicht ein Energieaudit nach DIN EN 16247-1.",
      },
      {
        question: "Wann erfolgt die Auszahlung?",
        answer: "Nach Abschluss der Maßnahme und positiver Verwendungsbestätigung.",
      },
    ],
    contact: {
      phone: "06196 908-1625",
      email: "beratung@bafa.de",
      url: "https://www.bafa.de/DE/Energie/Energieeffizienz/eeffizienz_node.html",
    },
    externalLinks: [
      { label: "BAFA EEW Übersicht", url: "https://www.bafa.de/EEW" },
      { label: "Online-Portal Antrag", url: "https://fms.bafa.de/BafaFrame/fjs" },
    ],
    seo: {
      title: "BAFA EEW Zuschuss – Energieeffizienz im Unternehmen",
      description: "Alle Module der BAFA-Energieeffizienzförderung inkl. PV- und Speicherbezug.",
      keywords: [
        "BAFA EEW",
        "BAFA Zuschuss Energieeffizienz",
        "Transformationskonzept",
        "BAFA Förderung PV Speicher",
      ],
    },
    lastUpdated: "September 2025",
    notes: "Anträge müssen vor Vertragsabschluss gestellt werden. Förderquoten für KMU höher.",
  },
  {
    slug: "bafa-transformationskonzept",
    title: "BAFA EEW Modul 5 – Transformationskonzepte",
    shortTitle: "BAFA Transformationskonzept",
    provider: "BAFA",
    level: "bund",
    isActive: true,
    summary:
      "Fördert die Erstellung langfristiger Dekarbonisierungsfahrpläne. Solarenergie, Speicher und Wärmepumpen können als Maßnahmenpakete geplant werden.",
    tagline: "Bis zu 60 % Zuschuss für Dekarbonisierungsstrategien",
    logo: "https://www.bafa.de/SharedDocs/Downloads/DE/bafa_logo.png?__blob=publicationFile&v=4",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 80.000 € Zuschuss",
    fundingRate: "Bis zu 60 % (KMU) / 40 % (Nicht-KMU)",
    targetGroups: ["Industrie", "Gewerbe", "Krankenhäuser", "Kommunale Unternehmen"],
    eligibleProjects: [
      "Langfristige Klimaneutralitäts-Roadmap",
      "Szenarien mit PV, Speichern & PPAs",
      "Elektrifizierung von Prozesswärme",
    ],
    eligibleCosts: ["Beratungshonorare", "Simulationen", "Machbarkeitsstudien"],
    nonEligibleCosts: ["Investitionskosten selbst"],
    requirements: [
      "Zertifizierte Energieberater (EBN/EBM)",
      "CO₂-Ausgangsbilanz",
    ],
    applicationSteps: [
      "Beratervertrag & Angebotsprüfung",
      "Antragstellung beim BAFA",
      "Genehmigung abwarten",
      "Konzept erarbeiten & einreichen",
    ],
    documentsRequired: ["Beraterangebot", "Unternehmensdaten", "CO₂-Ausgangsbilanz"],
    processingTime: "4–6 Wochen",
    deadlines: "Fortlaufend 2025",
    combinationTips: [
      "Erforderlich für hohe EEW-Investitionszuschüsse",
      "Grundlage für ESG-Reporting und Taxonomie",
    ],
    supportServices: [
      "CO₂-Bilanzierung",
      "Technologie- & Maßnahmenclustering",
      "Roadmap-Workshops",
    ],
    highlights: [
      { title: "Zuschuss für Planung", description: "Fördert Strategiearbeit, bevor Investitionen starten." },
    ],
    faqs: [
      {
        question: "Wer darf beraten?",
        answer: "Nur gelistete Energieberater nach §8a EDL-G oder EEP.",
      },
    ],
    contact: {
      phone: "06196 908-1625",
      url: "https://www.bafa.de/EEW",
    },
    seo: {
      title: "BAFA Transformationskonzept – Zuschuss für Dekarbonisierung",
      description: "Bis zu 80.000 € Zuschuss für Klimastrategien mit PV und Speicher.",
      keywords: ["Transformationskonzept", "BAFA Förderung Strategie"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "ibb-wirtschaft-nah",
    title: "IBB Programm Wirtschaft innovativ – Nachhaltige Investitionen",
    shortTitle: "IBB Wirtschaft innovativ",
    provider: "Investitionsbank Berlin (IBB)",
    level: "land",
    region: "Berlin",
    isActive: true,
    summary:
      "Unterstützt Berliner KMU bei Transformationsprojekten mit Fokus auf Energieeffizienz, Klimaschutz und Digitalisierung. PV-Anlagen, Speicher und Ladeinfrastruktur sind förderfähig.",
    tagline: "Direkte Zuschüsse und Darlehen für Berliner Unternehmen",
    heroImage: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/IBB_Investitionsbank_Berlin_logo.svg/1280px-IBB_Investitionsbank_Berlin_logo.svg.png",
    fundingTypes: ["Zuschuss", "Darlehen"],
    maxFunding: "Zuschuss bis 500.000 € | Darlehen bis 2 Mio. €",
    fundingRate: "Zuschuss bis 30 % (KMU bis 50 %)",
    targetGroups: ["Berliner KMU", "Start-ups mit Betriebsstätte Berlin"],
    eligibleProjects: [
      "PV-Anlagen auf Gewerbedächern",
      "Speicher und Lastmanagement",
      "Elektrifizierte Fahrzeugflotten mit Ladepunkten",
    ],
    eligibleCosts: [
      "Planungs- und Beratungsleistungen",
      "Anschaffung und Installation",
      "Schulung und Einweisung",
    ],
    nonEligibleCosts: ["Projekte außerhalb Berlins", "Reine Ersatzinvestitionen"],
    requirements: [
      "Betriebsstätte in Berlin",
      "Positive Fortführungsprognose",
      "Nachweis CO₂-Reduktion oder Effizienzsteigerung",
    ],
    applicationSteps: [
      "Projektanalyse & Fördercheck",
      "Antrag bei der IBB vor Auftragsvergabe",
      "Einreichung aller Nachweise",
      "Bewilligungsbescheid & Mittelabruf",
    ],
    documentsRequired: [
      "Businessplan/Projektbeschreibung",
      "Finanzierungsplan",
      "CO₂-Einsparungsberechnung",
      "Angebote",
    ],
    processingTime: "6–10 Wochen",
    deadlines: "First-Come-First-Serve, Budget 2025 noch verfügbar",
    combinationTips: [
      "Mit KfW-Krediten kombinierbar",
      "Kopplung mit SolarPLUS-Förderung der Stadt möglich",
    ],
    supportServices: [
      "Vorbereitete IBB-Antragsunterlagen",
      "Abstimmung mit Wirtschaftsförderung",
      "Monitoring der Förderauflagen",
    ],
    highlights: [
      { title: "Hohe Zuschussquote", description: "KMU erhalten bis zu 50 % Zuschuss." },
      { title: "Berlin Fokus", description: "Regionaler Ansprechpartner mit kurzen Wegen." },
    ],
    faqs: [
      {
        question: "Wie wird der Zuschuss ausgezahlt?",
        answer: "Erfolgt nach Projektabschluss und Prüfung der Rechnungen.",
      },
      {
        question: "Gibt es branchenspezifische Prioritäten?",
        answer: "Besonders innovative und nachhaltige Projekte werden bevorzugt.",
      },
    ],
    contact: {
      phone: "+49 30 2125-4747",
      email: "foerderprogramme@ibb.de",
      url: "https://www.ibb.de/de/foerderprogramme/wirtschaft-innovativ.html",
    },
    externalLinks: [
      {
        label: "Programmseite IBB",
        url: "https://www.ibb.de/de/foerderprogramme/wirtschaft-innovativ.html",
      },
    ],
    seo: {
      title: "IBB Wirtschaft innovativ – Förderung für Berliner Solarprojekte",
      description:
        "Zuschüsse und Darlehen der IBB für PV, Speicher und Ladeinfrastruktur in Berlin – Voraussetzungen, Fristen, Unterlagen.",
      keywords: [
        "IBB Förderung",
        "Berlin Solar Zuschuss",
        "IBB Darlehen Nachhaltigkeit",
        "Förderung PV Berlin",
      ],
      canonical: "https://www.zoe-solar.de/foerdermittel/ibb",
    },
    lastUpdated: "September 2025",
    notes: "Bei Kumulierung mit Bundesmitteln gelten EU-Beihilfegrenzen (De-minimis/AGVO).",
  },
  {
    slug: "ilb-speicher-brandenburg",
    title: "ILB Brandenburg – RENplus Speicherförderung",
    shortTitle: "ILB RENplus Speicher",
    provider: "Investitionsbank des Landes Brandenburg (ILB)",
    level: "land",
    region: "Brandenburg",
    isActive: true,
    summary:
      "Zuschüsse für stationäre Speicher in Verbindung mit erneuerbaren Energieerzeugern. Besonders relevant für Agri-PV und Gewerbedächer.",
    tagline: "Landesmittel für Speicherlösungen in Brandenburg",
    logo: "https://www.ilb.de/media/ilb/logo.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 500.000 €",
    fundingRate: "Bis zu 40 %",
    targetGroups: ["Unternehmen", "Kommunen", "Landwirtschaft"],
    eligibleProjects: [
      "Lithium- und Redox-Flow-Speicher",
      "Hybrid-Speichersysteme mit PV",
      "Quartiersspeicher",
    ],
    eligibleCosts: ["Hardware", "Planung", "Netzintegration"],
    nonEligibleCosts: ["Mobiles Speicherequipment", "Gebrauchtanlagen"],
    requirements: [
      "Standort Brandenburg",
      "Neuanlage (keine Nachrüstung bestehender Speicher)",
    ],
    applicationSteps: [
      "Projektbewertung & Fördercheck",
      "Antragstellung im ILB-Portal",
      "Bewilligung & Umsetzung",
      "Verwendungsnachweis",
    ],
    documentsRequired: [
      "Technisches Konzept",
      "Finanzierungsplan",
      "CO₂-Einsparnachweis",
    ],
    processingTime: "8 Wochen",
    deadlines: "Call 2025 bis 31.12. offen",
    combinationTips: ["Mit KfW-Darlehen kombinierbar"],
    supportServices: ["Speicherauslegung", "Genehmigungsmanagement"],
    highlights: [
      { title: "Speicherfokus", description: "Selten hohe Zuschüsse speziell für Speicher." },
    ],
    faqs: [
      {
        question: "Sind Second-Life Speicher zulässig?",
        answer: "Nein, nur fabrikneue Systeme.",
      },
    ],
    contact: {
      phone: "+49 331 660-0",
      url: "https://www.ilb.de/de/foerderprogramme/renplus/",
    },
    seo: {
      title: "ILB RENplus Speicherförderung Brandenburg",
      description: "40 % Zuschuss für Batteriespeicher in Brandenburg.",
      keywords: ["RENplus", "ILB Speicher", "Brandenburg Förderung Speicher"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "nrwbank-progress-effizienz",
    title: "NRW.Bank progres.nrw – Klimafreundliche Unternehmen",
    shortTitle: "progres.nrw Unternehmen",
    provider: "NRW.Bank",
    level: "land",
    region: "Nordrhein-Westfalen",
    isActive: true,
    summary:
      "Fördert PV, Speicher und Ladeinfrastruktur als Klimaschutzmaßnahmen in NRW. Zuschüsse für KMU und Kommunen.",
    tagline: "Landesmittel für Solar & Speicher in NRW",
    logo: "https://www.nrwbank.de/export/system/modules/com.nrwbank.www/client/resources/images/nrwbank-logo.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "200.000 € Zuschuss pro Projekt",
    fundingRate: "Bis zu 60 %",
    targetGroups: ["KMU", "Kommunen", "Sondervermögen"],
    eligibleProjects: [
      "PV-Aufdachanlagen",
      "Speichersysteme",
      "Ladeinfrastruktur",
    ],
    eligibleCosts: ["Material", "Montage", "Planung"],
    nonEligibleCosts: ["Repowering alter Anlagen"],
    requirements: ["Standort in NRW", "Nachweis Klimaschutzwirkung"],
    applicationSteps: [
      "Vorprüfung & Registrierung",
      "Antragstellung im Förderportal",
      "Bewilligung abwarten",
      "Projektumsetzung",
      "Verwendungsnachweis",
    ],
    documentsRequired: [
      "Kostenangebote",
      "CO₂-Einsparberechnung",
      "Eigentumsnachweis",
    ],
    processingTime: "6 Wochen",
    deadlines: "Call-System, nächste Runde Oktober 2025",
    combinationTips: ["Mit Bundesförderung kombinierbar bei Beihilfeprüfung"],
    supportServices: ["NRW Fördermonitoring", "Beihilfeprüfung"],
    highlights: [
      { title: "Bis 60 % Zuschuss", description: "Besonders attraktiv für KMU." },
    ],
    faqs: [
      {
        question: "Wie schnell müssen Projekte umgesetzt werden?",
        answer: "Innerhalb von 24 Monaten nach Bewilligung.",
      },
    ],
    contact: {
      phone: "+49 211 91741-0",
      url: "https://www.nrwbank.de/de/foerderprogramme/progres-nrw.html",
    },
    seo: {
      title: "progres.nrw Förderung für Unternehmen",
      description: "Landesförderung für PV, Speicher und Ladepunkte in Nordrhein-Westfalen.",
      keywords: ["progres.nrw", "NRW Förderung Photovoltaik", "NRW Speicherzuschuss"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "bayern-energiebonus-betriebe",
    title: "Bayern EnergieBonusBetriebe",
    shortTitle: "EnergieBonusBetriebe",
    provider: "Bayerisches Wirtschaftsministerium",
    level: "land",
    region: "Bayern",
    isActive: true,
    summary:
      "Zuschüsse für kleine und mittlere Unternehmen zur Umsetzung von Energieeffizienz- und Klimaschutzmaßnahmen, inklusive PV und Speichern.",
    tagline: "Bayerischer Zuschuss für klimafreundliche Betriebe",
    logo: "https://www.stmwi.bayern.de/fileadmin/_processed_/csm_bayern_logo_0a2d1c1f7c.png",
    fundingTypes: ["Zuschuss"],
    maxFunding: "30 % Zuschuss, max. 50.000 €",
    fundingRate: "Bis zu 40 % (KMU) / 30 % (Nicht-KMU)",
    targetGroups: ["Handwerk", "Dienstleistung", "Produzierendes Gewerbe"],
    eligibleProjects: [
      "PV-Anlagen und Speicher",
      "Energieeffizienzmaßnahmen",
      "Wärmerückgewinnung",
    ],
    eligibleCosts: ["Investitionskosten", "Planung", "Inbetriebnahme"],
    nonEligibleCosts: ["Eigenleistungen"],
    requirements: ["Betriebsstätte in Bayern", "KMU-Kriterien"],
    applicationSteps: [
      "Vorabantrag",
      "Bewilligung abwarten",
      "Umsetzung",
      "Nachweis & Auszahlung",
    ],
    documentsRequired: [
      "Angebote",
      "KMU-Erklärung",
      "Energieberatungsbericht",
    ],
    processingTime: "4–6 Wochen",
    deadlines: "Einreichung bis 30.11.2025",
    combinationTips: [
      "Zusätzlich zu KfW-Krediten nutzbar",
      "Mit kommunalen Programmen kombinierbar",
    ],
    supportServices: ["KMU-Check", "Dokumentenservice"],
    highlights: [
      { title: "Schnelle Bewilligung", description: "Erfahrungsgemäß kurze Entscheidungswege." },
    ],
    faqs: [
      {
        question: "Sind Contracting-Modelle zulässig?",
        answer: "Ja, sofern wirtschaftliches Eigentum beim Antragsteller liegt.",
      },
    ],
    contact: {
      phone: "+49 89 2162-0",
      url: "https://www.stmwi.bayern.de/energie/foerderprogramme/energiebonaus-betriebe/",
    },
    seo: {
      title: "EnergieBonusBetriebe Bayern – Förderung für PV & Effizienz",
      description: "Zuschussprogramm Bayern für KMU mit PV- und Speicherprojekten.",
      keywords: ["EnergieBonusBetriebe", "Bayern PV Förderung"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "hamburg-ifb-erneuerbare",
    title: "IFB Hamburg – Erneuerbare Wärme & Strom",
    shortTitle: "IFB Erneuerbare",
    provider: "Hamburgische Investitions- und Förderbank",
    level: "land",
    region: "Hamburg",
    isActive: true,
    summary:
      "Fördert PV-Anlagen, Speicher und Wärmepumpen auf Hamburger Gebäuden. Zuschüsse und Darlehen kombinierbar.",
    tagline: "Hamburger Klimaschutzförderung für Gebäude",
    logo: "https://www.ifbhh.de/fileadmin/_processed_/csm_ifb_logo_2c_0c7a5094c7.png",
    fundingTypes: ["Zuschuss", "Darlehen"],
    maxFunding: "Zuschuss bis 100.000 €",
    fundingRate: "Bis 35 %",
    targetGroups: ["Wohnungswirtschaft", "Gewerbe", "Genossenschaften"],
    eligibleProjects: ["PV", "Speicher", "Wärmepumpen"],
    eligibleCosts: ["Anschaffung", "Montage", "Planung"],
    nonEligibleCosts: ["Projekte außerhalb Hamburgs"],
    requirements: ["Gebäude in Hamburg", "Nachweis CO₂-Einsparung"],
    applicationSteps: ["Antrag vor Auftrag", "Bewilligung", "Umsetzung", "Nachweis"],
    documentsRequired: ["Energieberatung", "Kostenvoranschläge", "Eigentumsnachweis"],
    processingTime: "6 Wochen",
    deadlines: "Mittelverfügbarkeit 2025 gesichert",
    combinationTips: ["KfW-Kredite ergänzen", "Bundesförderung BEG kombinieren"],
    supportServices: ["Fördermittel-Coaching", "Nachweisführung"],
    highlights: [
      { title: "Stadtweiter Fokus", description: "Hohe Zuschüsse für urbane Gebäude." },
    ],
    faqs: [
      {
        question: "Sind Mieterstromprojekte förderfähig?",
        answer: "Ja, sofern sie die Klimaschutzziele erfüllen.",
      },
    ],
    contact: {
      phone: "+49 40 24846-0",
      url: "https://www.ifbhh.de/foerderprogramme/klimaschutz/",
    },
    seo: {
      title: "IFB Hamburg Förderung – Erneuerbare Wärme & Strom",
      description: "Förderprogramme der IFB für PV, Speicher und Wärmepumpen in Hamburg.",
      keywords: ["IFB Förderung", "Hamburg PV Zuschuss"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "berlin-solarplus",
    title: "SolarPLUS Berlin – Investitionszuschuss",
    shortTitle: "SolarPLUS Berlin",
    provider: "Land Berlin (Senatsverwaltung für Wirtschaft, Energie und Betriebe)",
    level: "kommunal",
    region: "Berlin",
    isActive: true,
    summary:
      "Zuschüsse für Photovoltaik, Speicher und Mieterstrommodelle auf Berliner Dächern. Ideal in Kombination mit IBB und KfW.",
    tagline: "Bis zu 30 % Zuschuss für Berliner Solarprojekte",
    logo: "https://energieatlas.berlin.de/fileadmin/_processed_/6/b/csm_Berlin-Logo_mit-Claim.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "30 % Zuschuss, bis 200.000 €",
    fundingRate: "20 % Grundförderung + Boni",
    targetGroups: ["Wohnungswirtschaft", "Gewerbe", "Energiegenossenschaften"],
    eligibleProjects: [
      "PV-Anlagen ab 7 kWp",
      "Gemeinschaftsanlagen",
      "Speicher bis 100 kWh",
    ],
    eligibleCosts: ["Anschaffung", "Montage", "Planung"],
    nonEligibleCosts: ["Bereits geförderte Anlagen"],
    requirements: ["Standort Berlin", "Mieterstrom oder Eigenverbrauch"],
    applicationSteps: [
      "Online-Antrag",
      "Reservierungsbescheid",
      "Projektumsetzung",
      "Nachweis & Auszahlung",
    ],
    documentsRequired: [
      "Angebote",
      "Netzanschlussbestätigung",
      "Eigentumsnachweis",
    ],
    processingTime: "4–8 Wochen",
    deadlines: "Topf 2025 bis 15.12.",
    combinationTips: [
      "Mit IBB und KfW kombinierbar",
      "Zuschuss mindert Eigenkapitalbedarf",
    ],
    supportServices: ["Fördermittelmatching", "Nachweisführung"],
    highlights: [
      { title: "Urbaner Fokus", description: "Attraktive Boni für Mieterstrom." },
    ],
    faqs: [
      {
        question: "Gilt die Förderung auch für Denkmalschutz?",
        answer: "Ja, sofern Denkmalschutzbehörde zustimmt.",
      },
    ],
    contact: {
      phone: "+49 30 6017444",
      url: "https://energieatlas.berlin.de/solarplus",
    },
    seo: {
      title: "SolarPLUS Berlin – Zuschuss für PV & Speicher",
      description: "Lokale Förderung für Photovoltaik und Speicher in Berlin.",
      keywords: ["SolarPLUS", "Berlin PV Zuschuss", "Mieterstrom Förderung Berlin"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "muenchen-solarfoerderprogramm",
    title: "Förderprogramm Solarenergie München",
    shortTitle: "München Solar",
    provider: "Stadtwerke München / Landeshauptstadt München",
    level: "kommunal",
    region: "München",
    isActive: true,
    summary:
      "Fördert PV-Anlagen, Speicher und Balkonmodule im Stadtgebiet München mit Zuschüssen und Bonuskomponenten.",
    tagline: "Kommunaler Zuschuss für Solar in München",
    logo: "https://www.swm.de/resource/blob/16390/6b751f3f711e67cc5405cb9184160cdc/swm-logo.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 30.000 €",
    fundingRate: "Bis 30 % + Boni",
    targetGroups: ["Privat", "Gewerbe", "Wohnungsbaugesellschaften"],
    eligibleProjects: [
      "PV-Dachanlagen",
      "Stromspeicher",
      "Mieterstrom",
    ],
    eligibleCosts: ["Material", "Montage", "Planung"],
    nonEligibleCosts: ["Projekte außerhalb Münchens"],
    requirements: ["Standort München"],
    applicationSteps: ["Online-Antrag", "Reservierung", "Umsetzung", "Nachweis"],
    documentsRequired: ["Angebote", "Netzanschluss", "IBAN"],
    processingTime: "3–5 Wochen",
    deadlines: "2025 Budget 15 Mio. €",
    combinationTips: ["Mit Bayern EnergieBonus kombinierbar"],
    supportServices: ["Fördermittelberatung", "Nachweisservice"],
    highlights: [
      { title: "Schnelle Auszahlung", description: "Digitale Prozesskette." },
    ],
    faqs: [
      {
        question: "Wer kann beantragen?",
        answer: "Eigentümer, Pächter mit Zustimmung, WEGs.",
      },
    ],
    contact: {
      phone: "+49 89 2361-0",
      url: "https://www.swm.de/solarfoerderung",
    },
    seo: {
      title: "Solarförderprogramm München – Zuschuss für PV & Speicher",
      description: "Kommunale Förderung der Stadt München für Photovoltaik und Speicher.",
      keywords: ["München Solar Förderung", "SWM Zuschuss"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "life-clean-energy-transition",
    title: "EU LIFE Clean Energy Transition",
    shortTitle: "LIFE CET",
    provider: "Europäische Kommission",
    level: "eu",
    region: "EU-weit",
    isActive: true,
    summary:
      "Finanziert großvolumige Projekte zur Beschleunigung der Energiewende, inklusive Solar- und Speicherlösungen in komplexen Konstellationen.",
    tagline: "EU-Förderung für strategische Energiewendeprojekte",
    logo: "https://ec.europa.eu/life/images/life_logo.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 10 Mio. € Zuschuss",
    fundingRate: "Bis zu 95 % der förderfähigen Kosten",
    targetGroups: ["Unternehmensverbünde", "Kommunen", "Forschungseinrichtungen"],
    eligibleProjects: [
      "Regionale Energiewendeprogramme",
      "Solarparks mit Bürgerbeteiligung",
      "Industrie-Dekarbonisierungsprojekte",
    ],
    eligibleCosts: ["Investitionen", "Personal", "Pilotanlagen"],
    nonEligibleCosts: ["Reine Forschung ohne Umsetzung"],
    requirements: [
      "EU-Konsortium",
      "Skalierbarer Klimanutzen",
      "Mind. 3 Mitgliedstaaten beteiligt",
    ],
    applicationSteps: [
      "Konsortialbildung",
      "Konzeptskizze (Concept Note)",
      "Vollantrag",
      "Grant Agreement",
    ],
    documentsRequired: [
      "Businessplan",
      "Finanzplan",
      "Nachweis Projektpartnerschaften",
    ],
    processingTime: "9–12 Monate",
    deadlines: "Call 2025: Einreichung 21. November",
    combinationTips: ["Mit nationalen Programmen kombinierbar (State Aid prüfen)"],
    supportServices: ["EU-Projektstrukturierung", "Partnermatching", "Grant-Management"],
    highlights: [
      { title: "Hoher Zuschuss", description: "Bis zu 95 % Förderung für Transformationsprojekte." },
    ],
    faqs: [
      {
        question: "Wie hoch ist der Eigenanteil?",
        answer: "Mindestens 5 % müssen durch das Konsortium getragen werden.",
      },
    ],
    contact: {
      phone: "+352 4301 37709",
      email: "life@ec.europa.eu",
      url: "https://cinea.ec.europa.eu/programmes/life/life-clean-energy-transition_en",
    },
    seo: {
      title: "EU LIFE Clean Energy Transition – Solar & Speicher Projekte",
      description: "EU-Zuschüsse für großvolumige Energiewende-Projekte mit Solar- und Speicherschwerpunkt.",
      keywords: ["LIFE Clean Energy", "EU Förderung Solar", "CINEA Funding"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "innovation-fund-small-scale",
    title: "EU Innovation Fund – Small Scale",
    shortTitle: "Innovation Fund Small",
    provider: "Europäische Kommission (CINEA)",
    level: "eu",
    region: "EU-weit",
    isActive: true,
    summary:
      "Unterstützt innovative Dekarbonisierungstechnologien mit Investitionssummen zwischen 2,5 und 20 Mio. €. Ideal für industrielle Solarthermie, PVT und Power-to-X.",
    tagline: "EU-Förderung für innovative Klimatechnologien",
    logo: "https://ec.europa.eu/info/sites/default/files/research_and_innovation/logos/inno-fund_en.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 60 % der beihilfefähigen Kosten",
    fundingRate: "Bis 60 %",
    targetGroups: ["Industrie", "Energieversorger", "Cleantech-Start-ups"],
    eligibleProjects: [
      "Innovative PV-Produktionsprozesse",
      "Solar-Wasserstoff",
      "Hybridkraftwerke",
    ],
    eligibleCosts: ["CAPEX", "OPEX für Monitoring", "Projektentwicklung"],
    nonEligibleCosts: ["Reine F&E ohne Skalierung"],
    requirements: [
      "Innovation über Stand der Technik",
      "Messbarer Treibhausgasminderungseffekt",
      "Skalierbarkeit",
    ],
    applicationSteps: [
      "Executive Summary",
      "Vollständiger Antrag",
      "Due Diligence",
      "Grant Agreement",
    ],
    documentsRequired: [
      "Businessplan",
      "Technischer Dossier",
      "Finanzierungsnachweise",
    ],
    processingTime: "12 Monate",
    deadlines: "Call 2025 – Einreichung bis 19. März",
    combinationTips: ["Mit nationalen Demo-Programmen kombinierbar"],
    supportServices: ["Innovation Coaching", "Pitch-Decks", "Grant-Administration"],
    highlights: [
      { title: "Fokus Innovation", description: "Ideal für neue Solar- und Speichertechnologien." },
    ],
    faqs: [
      {
        question: "Welche TRL ist gefordert?",
        answer: "Mindestens TRL 6; Demonstrator muss marktnah sein.",
      },
    ],
    contact: {
      email: "innovationfund@cinea.ec.europa.eu",
      url: "https://cinea.ec.europa.eu/innovation-fund_en",
    },
    seo: {
      title: "Innovation Fund Small Scale – Förderung für Solar-Innovationen",
      description: "Bis zu 60 % Zuschuss für innovative PV- und Speicherprojekte in Europa.",
      keywords: ["Innovation Fund", "EU Solar Innovation"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "european-energy-efficiency-fund",
    title: "European Energy Efficiency Fund (EEEF)",
    shortTitle: "EEEF",
    provider: "European Energy Efficiency Fund S.A.",
    level: "eu",
    region: "EU-weit",
    isActive: true,
    summary:
      "Finanzierungsinstrument der EU für Kommunen und Unternehmen mit Fokus auf Energieeffizienz und erneuerbare Energien. Bietet Darlehen, Leasing oder ESCO-Strukturen.",
    tagline: "EU-Finanzierungsinstrument für Energieeffizienz & Erneuerbare",
    logo: "https://www.eeef.lu/fileadmin/templates/img/logo.svg",
    fundingTypes: ["Darlehen", "Mezzanine", "Leasing"],
    maxFunding: "Projektabhängig bis 50 Mio. €",
    fundingRate: "Marktgerecht mit Förderkonditionen",
    targetGroups: ["Kommunen", "Öffentliche Unternehmen", "ESCo"],
    eligibleProjects: [
      "PV-Anlagen mit Contracting",
      "Energetische Quartiersversorgung",
      "Smart-City-Lösungen",
    ],
    eligibleCosts: ["Projektinvestitionen", "Planung", "Betrieb"],
    nonEligibleCosts: ["Reine Forschungsprojekte"],
    requirements: [
      "CO₂-Einsparung >20 %",
      "Öffentlicher oder semi-öffentlicher Träger",
      "Solide Projektpipeline",
    ],
    applicationSteps: [
      "Projekt-Pitch Deck",
      "Due Diligence",
      "Term Sheet",
      "Vertragsabschluss",
    ],
    documentsRequired: ["Finanzkennzahlen", "ESG-Daten", "Technisches Konzept"],
    processingTime: "4–6 Monate",
    deadlines: "Rolling Intake",
    combinationTips: ["Mit nationalen Zuschüssen kombinierbar"],
    supportServices: ["Finanzierungsstrukturierung", "ESCo-Modellierung"],
    highlights: [
      { title: "Flexible Finanzierung", description: "Individuelle Strukturen statt Standardprogramme." },
    ],
    faqs: [
      {
        question: "Welche Projektgrößen werden bevorzugt?",
        answer: "Investitionen zwischen 5 und 50 Mio. € haben die besten Chancen.",
      },
    ],
    contact: {
      email: "info@eeef.lu",
      url: "https://www.eeef.lu/",
    },
    seo: {
      title: "European Energy Efficiency Fund – Finanzierung für Solarprojekte",
      description: "Darlehen und Contracting-Strukturen des EEEF für Kommunen und Unternehmen.",
      keywords: ["EEEF", "EU Finanzierung Energieeffizienz", "Contracting Solar"],
    },
    lastUpdated: "September 2025",
  },
  {
    slug: "baden-wuerttemberg-photovoltaiknetzwerke",
    title: "Baden-Württemberg: Photovoltaik-Netzwerke",
    shortTitle: "BW PV-Netzwerke",
    provider: "L-Bank Baden-Württemberg",
    level: "land",
    region: "Baden-Württemberg",
    isActive: true,
    summary: "Fördert den Ausbau von Photovoltaik-Netzwerken und Quartierslösungen in Baden-Württemberg mit zinsgünstigen Darlehen und Zuschüssen.",
    tagline: "Förderung für vernetzte PV-Lösungen in BW",
    logo: "https://www.l-bank.de/media/l-bank-logo.svg",
    fundingTypes: ["Darlehen", "Zuschuss"],
    maxFunding: "Bis zu 5 Mio. € pro Vorhaben",
    fundingRate: "Bis zu 40% Zuschuss + zinsgünstiges Darlehen",
    targetGroups: ["Kommunen", "Stadtwerke", "Energiegenossenschaften", "Wohnungsunternehmen"],
    eligibleProjects: [
      "Quartiers-PV mit mindestens 5 Gebäuden",
      "Genossenschaftliche Solarprojekte",
      "Mieterstrom-Netzwerke",
      "Agri-PV Gemeinschaftsanlagen"
    ],
    eligibleCosts: [
      "PV-Anlagen und Speichersysteme",
      "Smart-Grid Infrastruktur",
      "Messsysteme und Datenmanagement",
      "Netzanschlüsse und Kabelinfrastruktur"
    ],
    nonEligibleCosts: [
      "Einzelanlagen ohne Netzwerkcharakter",
      "Reine Eigenverbrauchsanlagen",
      "Projekte außerhalb Baden-Württembergs"
    ],
    requirements: [
      "Mindestens 5 vernetzte Gebäude/Anlagen",
      "Nachweis der CO₂-Einsparung von mind. 40%",
      "Bürgerbeteiligung oder genossenschaftliche Struktur",
      "Technisches Gesamtkonzept inkl. Energiemanagement"
    ],
    applicationSteps: [
      "Machbarkeitsstudie und Konzepterstellung",
      "Antragstellung bei L-Bank mit Projektpartnern",
      "Bewilligung und Detailplanung",
      "Umsetzung mit regelmäßigem Monitoring",
      "Nachweisführung und Evaluierung"
    ],
    documentsRequired: [
      "Netzwerk-Konzept mit Teilnehmerliste",
      "Energiebilanzen aller beteiligten Gebäude",
      "Gesellschaftsverträge bei Genossenschaften",
      "Zustimmungserklärungen aller Netzwerkteilnehmer"
    ],
    processingTime: "8-12 Wochen",
    deadlines: "Anträge bis 31. Oktober 2025",
    combinationTips: [
      "Mit KfW 270 kombinierbar für Einzelkomponenten",
      "BAFA-Förderung für Energieeffizienzmaßnahmen ergänzend",
      "Kommunale Zuschüsse oft zusätzlich möglich"
    ],
    supportServices: [
      "Netzwerk-Beratung und Teilnehmergewinnung",
      "Rechtliche Strukturierung von Genossenschaften",
      "Technische Planung vernetzter Systeme",
      "Monitoring und Betriebsführung"
    ],
    highlights: [
      {
        title: "Vernetzter Ansatz",
        description: "Besonders hohe Förderung für gemeinschaftliche Projekte."
      },
      {
        title: "Smart-Grid Integration",
        description: "Förderung moderner Energiemanagement-Systeme."
      }
    ],
    faqs: [
      {
        question: "Welche Mindestgröße muss das Netzwerk haben?",
        answer: "Mindestens 5 Gebäude oder Anlagen müssen vernetzt werden."
      },
      {
        question: "Sind auch gewerbliche Netzwerke förderfähig?",
        answer: "Ja, besonders Gewerbegebiete und Industrieparks sind gut geeignet."
      }
    ],
    contact: {
      phone: "+49 721 150-0",
      url: "https://www.l-bank.de/pv-netzwerke",
    },
    seo: {
      title: "Baden-Württemberg PV-Netzwerke Förderung | L-Bank",
      description: "Förderung für vernetzte Photovoltaik-Lösungen in Baden-Württemberg durch die L-Bank.",
      keywords: ["BW PV Netzwerk", "L-Bank Solar", "Quartierslösungen Förderung"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "schleswig-holstein-klimaschutz-investitionen",
    title: "Schleswig-Holstein: Klimaschutz-Investitionsprogramm",
    shortTitle: "SH Klimaschutz",
    provider: "IB.SH - Investitionsbank Schleswig-Holstein",
    level: "land",
    region: "Schleswig-Holstein",
    isActive: true,
    summary: "Umfassendes Förderprogramm für Klimaschutzinvestitionen mit Schwerpunkt auf erneuerbaren Energien und Energieeffizienz.",
    tagline: "Klimaschutz-Förderung für Unternehmen in SH",
    logo: "https://www.ib-sh.de/fileadmin/user_upload/logos/IBSH_Logo.svg",
    fundingTypes: ["Zuschuss", "Darlehen"],
    maxFunding: "Bis zu 2 Mio. € Zuschuss",
    fundingRate: "Bis zu 50% der förderfähigen Kosten",
    targetGroups: ["KMU", "Handwerk", "Landwirtschaft", "Kommunen"],
    eligibleProjects: [
      "PV-Anlagen mit Eigenstromnutzung",
      "Windkraft-Kleinanlagen",
      "Biomasse- und Biogasanlagen",
      "Geothermie und Wärmepumpen",
      "Energiespeicher aller Art"
    ],
    eligibleCosts: [
      "Anschaffung und Installation erneuerbarer Energieanlagen",
      "Energieeffiziente Produktionsanlagen",
      "Mess-, Steuer- und Regelungstechnik",
      "Beratungskosten für Energiekonzepte"
    ],
    nonEligibleCosts: [
      "Anlagen zur reinen Netzeinspeisung ohne Eigennutzung",
      "Fossile Brennstoffanlagen",
      "Bereits begonnene Maßnahmen"
    ],
    requirements: [
      "Unternehmenssitz in Schleswig-Holstein",
      "Nachweis der CO₂-Einsparung von mindestens 25%",
      "Mindestinvestition von 25.000 €",
      "Eigenanteil von mindestens 50%"
    ],
    applicationSteps: [
      "Energieberatung und Konzepterstellung",
      "Antragstellung mit vollständigen Unterlagen",
      "Prüfung und Bewilligung durch IB.SH",
      "Umsetzung des Vorhabens",
      "Verwendungsnachweis und Auszahlung"
    ],
    documentsRequired: [
      "Energiekonzept mit CO₂-Bilanzierung",
      "Kostenvoranschläge aller Gewerke",
      "Nachweis der Finanzierungsfähigkeit",
      "Genehmigungen und Gutachten"
    ],
    processingTime: "6-8 Wochen",
    deadlines: "Laufende Antragstellung bis Mittelerschöpfung",
    combinationTips: [
      "Mit KfW-Programmen kombinierbar",
      "BAFA-Zuschüsse ergänzend nutzbar",
      "EU-Fördermittel für größere Projekte"
    ],
    supportServices: [
      "Energieberatung und Wirtschaftlichkeitsanalyse",
      "Unterstützung bei Genehmigungsverfahren",
      "Projektmanagement und Monitoring",
      "Nachhaltigkeitsberichterstattung"
    ],
    highlights: [
      {
        title: "Hohe Förderquote",
        description: "Bis zu 50% Zuschuss für innovative Klimaschutzprojekte."
      },
      {
        title: "Umfassender Ansatz",
        description: "Förderung aller erneuerbaren Energietechnologien."
      }
    ],
    faqs: [
      {
        question: "Welche Mindestinvestition ist erforderlich?",
        answer: "Die Mindestinvestition beträgt 25.000 € für förderfähige Maßnahmen."
      },
      {
        question: "Sind auch Contracting-Modelle förderfähig?",
        answer: "Ja, bei entsprechender vertraglicher Gestaltung sind auch Contracting-Lösungen möglich."
      }
    ],
    contact: {
      phone: "+49 431 9905-0",
      url: "https://www.ib-sh.de/klimaschutz-investitionen",
    },
    seo: {
      title: "Schleswig-Holstein Klimaschutz-Investitionsprogramm | IB.SH",
      description: "Förderung für Klimaschutzinvestitionen und erneuerbare Energien in Schleswig-Holstein.",
      keywords: ["SH Klimaschutz", "IB.SH Förderung", "Erneuerbare Energien SH"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "hessen-energieeffizienz-unternehmen",
    title: "Hessen: Förderung energieeffizienter Unternehmen",
    shortTitle: "Hessen Energieeffizienz",
    provider: "WIBank - Wirtschafts- und Infrastrukturbank Hessen",
    level: "land",
    region: "Hessen",
    isActive: true,
    summary: "Unterstützt hessische Unternehmen bei Investitionen in erneuerbare Energien und Energieeffizienzmaßnahmen mit zinsgünstigen Darlehen.",
    tagline: "Energieeffizienz-Förderung für hessische Unternehmen",
    logo: "https://www.wibank.de/dam/jcr:c2c4c4c4-8f8f-4f8f-8f8f-4f8f8f8f8f8f/wibank-logo.svg",
    fundingTypes: ["Darlehen", "Bürgschaft"],
    maxFunding: "Bis zu 10 Mio. € Darlehen",
    fundingRate: "Zinsverbilligung bis zu 2 Prozentpunkte",
    targetGroups: ["KMU", "Freiberufler", "Handwerk", "Start-ups"],
    eligibleProjects: [
      "Photovoltaikanlagen für Eigenverbrauch",
      "BHKW und Kraft-Wärme-Kopplung",
      "Energiespeichersysteme",
      "Energieeffiziente Produktionsanlagen",
      "LED-Beleuchtung und Steuerungstechnik"
    ],
    eligibleCosts: [
      "Anschaffung und Errichtung von Anlagen",
      "Planungs- und Installationskosten",
      "Mess- und Regelungstechnik",
      "Nebenkosten bis 15% der Hauptinvestition"
    ],
    nonEligibleCosts: [
      "Grundstückserwerb und Erschließung",
      "Gebrauchte Anlagen ohne Effizienzgewinn",
      "Reine Instandhaltungsmaßnahmen"
    ],
    requirements: [
      "Betriebsstätte in Hessen seit mindestens 2 Jahren",
      "Nachweis der Energieeinsparung oder CO₂-Reduktion",
      "Geordnete Vermögensverhältnisse",
      "Vorlage einer Energieberatung"
    ],
    applicationSteps: [
      "Energieberatung durch zertifizierten Berater",
      "Antragstellung über Hausbank",
      "Prüfung durch WIBank",
      "Kreditzusage und Auszahlungsplan",
      "Projektrealisierung und Monitoring"
    ],
    documentsRequired: [
      "Energieaudit nach DIN EN 16247",
      "Betriebswirtschaftliche Auswertung",
      "Angebote und Kostenaufstellungen",
      "Nachweis der Eigenkapitalquote"
    ],
    processingTime: "4-6 Wochen",
    deadlines: "Ganzjährige Antragstellung möglich",
    combinationTips: [
      "Mit KfW-Energieeffizienzprogrammen kombinierbar",
      "BAFA-Zuschüsse reduzieren Kreditbedarf",
      "Bürgschaften erleichtern Finanzierung"
    ],
    supportServices: [
      "Energieberatung und Wirtschaftlichkeitsrechnung",
      "Finanzierungsberatung und Bankengespräche",
      "Fördermittel-Scouting für Kombinationen",
      "Controlling und Erfolgsmessung"
    ],
    highlights: [
      {
        title: "Flexible Finanzierung",
        description: "Individuelle Darlehensgestaltung nach Projektanforderungen."
      },
      {
        title: "Bürgschaftsmöglichkeit",
        description: "Bürgschaften für bessere Kreditkonditionen verfügbar."
      }
    ],
    faqs: [
      {
        question: "Welche Energieeinsparung muss nachgewiesen werden?",
        answer: "Mindestens 20% Energieeinsparung oder entsprechende CO₂-Reduktion."
      },
      {
        question: "Sind auch größere Investitionen über 10 Mio. € möglich?",
        answer: "Ja, in Einzelfällen auch höhere Darlehen nach individueller Prüfung."
      }
    ],
    contact: {
      phone: "+49 611 774-0",
      url: "https://www.wibank.de/energieeffizienz",
    },
    seo: {
      title: "Hessen Energieeffizienz-Förderung für Unternehmen | WIBank",
      description: "Zinsgünstige Darlehen für Energieeffizienz und erneuerbare Energien in Hessen.",
      keywords: ["Hessen Energieeffizienz", "WIBank Darlehen", "Solar Förderung Hessen"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "sachsen-richtlinie-energie-klima",
    title: "Sachsen: Richtlinie Energie/Klima (RL EK)",
    shortTitle: "Sachsen RL EK",
    provider: "Sächsische Aufbaubank (SAB)",
    level: "land",
    region: "Sachsen",
    isActive: true,
    summary: "Förderung von Maßnahmen zur Energieeinsparung, Energieeffizienz und zum Einsatz erneuerbarer Energien in Sachsen.",
    tagline: "Umfassende Energie- und Klimaschutzförderung",
    logo: "https://www.sab.sachsen.de/content/dam/de/sab/logos/sab-logo.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 500.000 € Zuschuss",
    fundingRate: "30-50% je nach Maßnahme",
    targetGroups: ["Unternehmen", "Kommunen", "Vereine", "Kirchgemeinden"],
    eligibleProjects: [
      "Photovoltaikanlagen bis 100 kWp",
      "Solarthermie-Anlagen",
      "Biomasseanlagen",
      "Wärmepumpen und Geothermie",
      "Energiespeicher",
      "Energieeffiziente Beleuchtung"
    ],
    eligibleCosts: [
      "Material- und Installationskosten",
      "Planungskosten",
      "Mess- und Regelungstechnik",
      "Begleitende Energieberatung"
    ],
    nonEligibleCosts: [
      "Eigenleistungen",
      "Finanzierungskosten",
      "Umsatzsteuer bei Vorsteuerabzug",
      "Maßnahmen nach Rechtspflicht"
    ],
    requirements: [
      "Standort der Anlage in Sachsen",
      "Antragstellung vor Maßnahmenbeginn",
      "Nachweis der technischen Eignung",
      "Mindestinvestition von 1.000 €"
    ],
    applicationSteps: [
      "Beratung durch Energieberater",
      "Online-Antragstellung bei SAB",
      "Prüfung und Bewilligung",
      "Umsetzung der Maßnahme",
      "Verwendungsnachweis und Auszahlung"
    ],
    documentsRequired: [
      "Angebote der Fachfirmen",
      "Energieberatungsbericht",
      "Nachweis der Antragsberechtigung",
      "Finanzierungsnachweis"
    ],
    processingTime: "8-10 Wochen",
    deadlines: "Anträge bis 30. November 2025",
    combinationTips: [
      "Mit KfW-Programmen kombinierbar",
      "BAFA-Förderung bei Wärmepumpen ergänzend",
      "Kommunale Zusatzförderungen möglich"
    ],
    supportServices: [
      "Energieberatung und Potenzialanalyse",
      "Technische Machbarkeitsstudien",
      "Wirtschaftlichkeitsberechnungen",
      "Unterstützung bei Genehmigungsverfahren"
    ],
    highlights: [
      {
        title: "Breites Spektrum",
        description: "Förderung vielfältiger erneuerbarer Energietechnologien."
      },
      {
        title: "Auch für kleine Anlagen",
        description: "Bereits ab 1.000 € Investitionssumme förderfähig."
      }
    ],
    faqs: [
      {
        question: "Gibt es eine Mindestgröße für PV-Anlagen?",
        answer: "Nein, auch kleine Anlagen sind förderfähig, wenn sie wirtschaftlich sind."
      },
      {
        question: "Können auch Mieter eine Förderung erhalten?",
        answer: "Ja, bei Zustimmung des Eigentümers sind auch Mieter antragsberechtigt."
      }
    ],
    contact: {
      phone: "+49 351 4910-0",
      url: "https://www.sab.sachsen.de/rl-energie-klima",
    },
    seo: {
      title: "Sachsen Richtlinie Energie/Klima Förderung | SAB",
      description: "Zuschüsse für erneuerbare Energien und Energieeffizienz in Sachsen.",
      keywords: ["Sachsen RL EK", "SAB Förderung", "Erneuerbare Energien Sachsen"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "thueringen-green-invest",
    title: "Thüringen: Green Invest - Nachhaltige Technologien",
    shortTitle: "Thüringen Green Invest",
    provider: "Thüringer Aufbaubank (TAB)",
    level: "land",
    region: "Thüringen",
    isActive: true,
    summary: "Förderung von Investitionen in nachhaltige Technologien und erneuerbare Energien für Unternehmen in Thüringen.",
    tagline: "Investitionen in grüne Technologien",
    logo: "https://www.aufbaubank.de/content/dam/de/aufbaubank/logos/tab-logo.svg",
    fundingTypes: ["Zuschuss", "Darlehen"],
    maxFunding: "Bis zu 1 Mio. € Zuschuss",
    fundingRate: "Bis zu 35% der förderfähigen Kosten",
    targetGroups: ["KMU", "Mittelständische Unternehmen", "Start-ups"],
    eligibleProjects: [
      "Innovative Photovoltaik-Systeme",
      "Energiespeicher mit Smart-Grid Anbindung",
      "Wasserstoff-Technologien",
      "Effiziente Kraft-Wärme-Kopplung",
      "Biomasse-Nutzung",
      "Geothermie-Projekte"
    ],
    eligibleCosts: [
      "Forschung und Entwicklung",
      "Prototypenerstellung",
      "Investitionen in Anlagen und Ausrüstung",
      "Patentierung und Zertifizierung"
    ],
    nonEligibleCosts: [
      "Reine Handelsaktivitäten",
      "Grundstückserwerb",
      "Refinanzierung bestehender Verbindlichkeiten"
    ],
    requirements: [
      "Unternehmenssitz in Thüringen",
      "Innovationsgehalt der Technologie",
      "Nachweis der Marktfähigkeit",
      "Arbeitsplätze in Thüringen"
    ],
    applicationSteps: [
      "Innovationsberatung und Technologiebewertung",
      "Antragstellung mit Business Plan",
      "Technische und wirtschaftliche Prüfung",
      "Bewilligung und Vertragsabschluss",
      "Projektdurchführung mit Monitoring"
    ],
    documentsRequired: [
      "Detaillierter Businessplan",
      "Technische Dokumentation",
      "Finanzierungsplan",
      "Nachweis der Innovationsfähigkeit"
    ],
    processingTime: "10-12 Wochen",
    deadlines: "Anträge bis 15. Dezember 2025",
    combinationTips: [
      "Mit EU-Innovationsprogrammen kombinierbar",
      "BMBF-Förderung für F&E-Anteile",
      "KfW-Digitalisierungsprogramme ergänzend"
    ],
    supportServices: [
      "Innovationsberatung und Technologietransfer",
      "Patent- und Schutzrechtsberatung",
      "Marktanalysen und Geschäftsmodellentwicklung",
      "Vernetzung mit Forschungseinrichtungen"
    ],
    highlights: [
      {
        title: "Innovationsfokus",
        description: "Besondere Förderung für innovative grüne Technologien."
      },
      {
        title: "Technologietransfer",
        description: "Unterstützung beim Transfer von Forschung in die Praxis."
      }
    ],
    faqs: [
      {
        question: "Was gilt als innovative Technologie?",
        answer: "Technologien, die über den Stand der Technik hinausgehen und Marktpotenzial haben."
      },
      {
        question: "Sind auch Kooperationsprojekte förderfähig?",
        answer: "Ja, Kooperationen mit Hochschulen oder anderen Unternehmen sind erwünscht."
      }
    ],
    contact: {
      phone: "+49 361 7316-0",
      url: "https://www.aufbaubank.de/green-invest",
    },
    seo: {
      title: "Thüringen Green Invest Förderung | TAB",
      description: "Förderung nachhaltiger Technologien und erneuerbarer Energien in Thüringen.",
      keywords: ["Thüringen Green Invest", "TAB Förderung", "Nachhaltige Technologien"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "bafa-bundesfoerderung-energieeffizienz-wirtschaft",
    title: "BAFA: Bundesförderung für Energieeffizienz in der Wirtschaft (BEW)",
    shortTitle: "BAFA BEW",
    provider: "Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA)",
    level: "bund",
    isActive: true,
    summary: "Umfassendes Bundesprogramm zur Förderung von Energieeffizienzmaßnahmen und erneuerbaren Energien in Unternehmen mit Zuschüssen bis zu 55%.",
    tagline: "Bundesweite Energieeffizienz-Förderung für Unternehmen",
    logo: "https://www.bafa.de/SharedDocs/Bilder/DE/Energie/bafa_logo.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 15 Mio. € Zuschuss pro Vorhaben",
    fundingRate: "30-55% je nach Maßnahme und Unternehmensgröße",
    targetGroups: ["Unternehmen aller Größen", "Contractoren", "Kommunale Unternehmen"],
    eligibleProjects: [
      "Hocheffiziente Wärmepumpen",
      "Solarthermie-Anlagen",
      "Biomasseheizsysteme",
      "Effiziente Wärmenetze",
      "KWK-Anlagen bis 20 MW",
      "Energiemanagement-Systeme",
      "Mess-, Steuer- und Regelungstechnik",
      "Energieeffiziente und klimaschonende Produktionsprozesse"
    ],
    eligibleCosts: [
      "Anschaffungs- und Installationskosten",
      "Baukosten für energieeffiziente Gebäudehüllen",
      "Planungskosten bis 50% der Investitionskosten",
      "Nebenkosten wie Montage und Inbetriebnahme"
    ],
    nonEligibleCosts: [
      "Kosten für konventionelle Heizsysteme",
      "Eigenleistungen",
      "Finanzierungs-, Betriebs- und Wartungskosten",
      "Kosten für den Anschluss an das öffentliche Gasnetz"
    ],
    requirements: [
      "Mindestinvestition von 2.000 € (Einzelmaßnahmen) bzw. 20.000 € (Systemförderung)",
      "Erfüllung technischer Mindestanforderungen",
      "Nachweis der Energieeinsparung oder CO₂-Reduktion",
      "Antragstellung vor Vorhabenbeginn"
    ],
    applicationSteps: [
      "Energieaudit oder Energieberatung",
      "Online-Antragstellung über BAFA-Portal",
      "Technische Prüfung und Bewilligung",
      "Durchführung der Maßnahmen",
      "Verwendungsnachweis mit Rechnungen und Nachweisen"
    ],
    documentsRequired: [
      "Energieaudit nach DIN EN 16247 oder vergleichbar",
      "Kostenvoranschläge aller Komponenten",
      "Technische Datenblätter der Anlagen",
      "Nachweis der Fachunternehmereigenschaft"
    ],
    processingTime: "8-12 Wochen nach Antragseingang",
    deadlines: "Laufende Antragstellung - Budget wird jährlich neu festgelegt",
    combinationTips: [
      "Mit KfW-Krediten für Restfinanzierung kombinierbar",
      "Ergänzung durch Landesprogramme möglich",
      "EU-Beihilferecht bei großen Unternehmen beachten"
    ],
    supportServices: [
      "Energieberatung nach BAFA-Richtlinie",
      "Technische Machbarkeitsstudien",
      "Wirtschaftlichkeitsberechnungen",
      "Monitoring und Erfolgskontrolle"
    ],
    highlights: [
      {
        title: "Hohe Förderquoten",
        description: "Bis zu 55% Zuschuss für besonders effiziente Technologien."
      },
      {
        title: "Flexibles Programm",
        description: "Einzelmaßnahmen oder Systemlösungen förderfähig."
      },
      {
        title: "Contracting-fähig",
        description: "Auch für Contracting-Projekte geeignet."
      }
    ],
    faqs: [
      {
        question: "Können auch PV-Anlagen gefördert werden?",
        answer: "Nein, reine PV-Anlagen sind nicht förderfähig. Wohl aber PVT-Kollektoren oder PV in Kombination mit Wärmepumpen."
      },
      {
        question: "Wie hoch ist die maximale Förderung?",
        answer: "Maximal 15 Mio. € pro Vorhaben, bei KMU bis zu 55% der förderfähigen Kosten."
      },
      {
        question: "Sind auch Contractoren antragsberechtigt?",
        answer: "Ja, Contractoren können Anträge stellen, wenn sie die technischen Anforderungen erfüllen."
      }
    ],
    contact: {
      phone: "+49 6196 908-0",
      email: "bew@bafa.bund.de",
      url: "https://www.bafa.de/bew",
    },
    seo: {
      title: "BAFA Bundesförderung Energieeffizienz Wirtschaft (BEW) | Zuschüsse bis 55%",
      description: "Umfassende Förderung für Energieeffizienz und erneuerbare Energien in Unternehmen durch das BAFA.",
      keywords: ["BAFA BEW", "Energieeffizienz Förderung", "Bundesförderung Unternehmen", "Wärmepumpe Zuschuss"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "bmwk-energie-klimafonds-transformation",
    title: "BMWK: Energie- und Klimafonds - Industrielle Transformation",
    shortTitle: "EKF Transformation",
    provider: "Bundesministerium für Wirtschaft und Klimaschutz (BMWK)",
    level: "bund",
    isActive: true,
    summary: "Großvolumige Förderung für die klimaneutrale Transformation der Industrie mit Fokus auf erneuerbare Energien und Dekarbonisierung.",
    tagline: "Transformation der Industrie zur Klimaneutralität",
    logo: "https://www.bmwk.de/Redaktion/DE/Logos/bmwk-logo.svg",
    fundingTypes: ["Zuschuss", "Darlehen"],
    maxFunding: "Bis zu 200 Mio. € pro Projekt",
    fundingRate: "Bis zu 50% der beihilfefähigen Kosten",
    targetGroups: ["Industrieunternehmen", "Energieintensive Branchen", "Unternehmensverbünde"],
    eligibleProjects: [
      "Großsolaranlagen für Industrieprozesse",
      "Power-to-X Anlagen (Wasserstoff, E-Fuels)",
      "Elektrische Prozesswärme",
      "Industrielle Wärmepumpen",
      "Carbon Capture and Utilization (CCU)",
      "Energieeffiziente Produktionsverfahren",
      "Erneuerbare Energien für Industriestandorte"
    ],
    eligibleCosts: [
      "Investitionen in klimaneutrale Technologien",
      "Forschung und Entwicklung für Pilot- und Demonstrationsanlagen",
      "Infrastruktur für erneuerbare Energien",
      "Begleitende Studien und Zertifizierungen"
    ],
    nonEligibleCosts: [
      "Reine Energieeffizienzmaßnahmen ohne Transformationscharakter",
      "Konventionelle fossile Technologien",
      "Maßnahmen nach gesetzlicher Verpflichtung"
    ],
    requirements: [
      "Signifikante CO₂-Einsparung (mindestens 40%)",
      "Industriestandort in Deutschland",
      "Nachweis der technischen und wirtschaftlichen Realisierbarkeit",
      "Beitrag zur Systemintegration erneuerbarer Energien"
    ],
    applicationSteps: [
      "Strategieberatung und Transformationskonzept",
      "Projektskizze und Vorprüfung",
      "Vollständiger Förderantrag mit Detailplanung",
      "Bewilligung und Vertragsverhandlung",
      "Projektdurchführung mit regelmäßigem Monitoring"
    ],
    documentsRequired: [
      "Umfassendes Transformationskonzept",
      "CO₂-Bilanzierung und Einsparnachweis",
      "Technische Machbarkeitsstudie",
      "Finanzierungsplan und Wirtschaftlichkeitsrechnung",
      "Nachweis der Systemrelevanz"
    ],
    processingTime: "6-12 Monate je nach Projektgröße",
    deadlines: "Stichtage: 31. März und 30. September",
    combinationTips: [
      "Mit EU Important Projects of Common European Interest (IPCEI) kombinierbar",
      "Ergänzung durch Landesprogramme für regionale Aspekte",
      "KfW-Kredite für Kofinanzierung"
    ],
    supportServices: [
      "Strategische Transformationsberatung",
      "Technologie-Roadmaps und Szenarioentwicklung",
      "Stakeholder-Management und Behördenkommunikation",
      "Projektmanagement für Großvorhaben",
      "Monitoring und Impact-Messung"
    ],
    highlights: [
      {
        title: "Großvolumig",
        description: "Förderung von Projekten bis 200 Mio. € möglich."
      },
      {
        title: "Systemrelevant",
        description: "Fokus auf volkswirtschaftlich wichtige Transformationsprojekte."
      },
      {
        title: "Sektorübergreifend",
        description: "Förderung aller energieintensiven Industriebranchen."
      }
    ],
    faqs: [
      {
        question: "Welche Industriebranchen sind besonders relevant?",
        answer: "Stahl, Chemie, Zement, Aluminium, Glas und andere energieintensive Sektoren."
      },
      {
        question: "Sind auch kleinere Projekte unter 10 Mio. € förderfähig?",
        answer: "Ja, wenn sie einen wichtigen Beitrag zur Sektortransformation leisten."
      },
      {
        question: "Wie wird die CO₂-Einsparung bewertet?",
        answer: "Lifecycle-Assessment über die gesamte Wertschöpfungskette erforderlich."
      }
    ],
    contact: {
      phone: "+49 30 18615-0",
      email: "transformation@bmwk.bund.de",
      url: "https://www.bmwk.de/industrie-transformation",
    },
    seo: {
      title: "BMWK Energie- und Klimafonds Industrielle Transformation",
      description: "Großvolumige Förderung für die klimaneutrale Transformation der deutschen Industrie.",
      keywords: ["BMWK Transformation", "Industrie Dekarbonisierung", "EKF Förderung", "Klimaneutrale Industrie"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "horizon-europe-green-deal",
    title: "Horizon Europe: European Green Deal Call",
    shortTitle: "Horizon Green Deal",
    provider: "European Commission - Horizon Europe",
    level: "eu",
    region: "EU + Associated Countries",
    isActive: true,
    summary: "EU-weites Forschungs- und Innovationsprogramm mit Fokus auf den Green Deal, inklusive großvolumiger Solar- und Energiespeicherprojekte.",
    tagline: "EU-Forschungsförderung für den Green Deal",
    logo: "https://ec.europa.eu/info/sites/default/files/research_and_innovation/logos/horizon-europe_0.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 50 Mio. € pro Konsortium",
    fundingRate: "100% für Forschung, 70% für Innovation",
    targetGroups: ["Forschungseinrichtungen", "Unternehmen", "Städte", "Regionen"],
    eligibleProjects: [
      "Next-Generation Photovoltaik (Perowskit, Tandem)",
      "Sektorintegration und Smart Grids",
      "Circular Economy in der PV-Industrie",
      "Agri-Photovoltaik und Floating Solar",
      "Digitale Zwillinge für Energiesysteme",
      "Wasserstoff aus erneuerbaren Energien"
    ],
    eligibleCosts: [
      "Personalkosten für Forschung und Innovation",
      "Equipment und Infrastruktur",
      "Verbrauchsmaterialien",
      "Dissemination und Exploitation"
    ],
    nonEligibleCosts: [
      "Reine kommerzielle Aktivitäten",
      "Infrastruktur ohne Forschungscharakter",
      "Aktivitäten außerhalb der EU und assoziierten Ländern"
    ],
    requirements: [
      "Mindestens 3 Partner aus 3 verschiedenen EU-Ländern",
      "Klarer wissenschaftlicher Exzellenzanspruch",
      "Beitrag zu den EU Green Deal Zielen",
      "Technology Readiness Level (TRL) 3-8"
    ],
    applicationSteps: [
      "Konsortiumsbildung und Partner-Matching",
      "Einreichung der Proposal über Funding & Tenders Portal",
      "Evaluation durch unabhängige Experten",
      "Grant Agreement Verhandlung",
      "Projektstart und kontinuierliches Reporting"
    ],
    documentsRequired: [
      "Technical Annex mit Arbeitspaketen",
      "Management und Governance Plan",
      "Dissemination und Communication Strategy",
      "Financial Capacity Assessment"
    ],
    processingTime: "6-8 Monate von Einreichung bis Grant Agreement",
    deadlines: "Calls zweimal jährlich - nächste Deadline: 7. Februar 2025",
    combinationTips: [
      "Mit nationalen F&E-Programmen kombinierbar",
      "EIC Accelerator für Kommerzialisierung",
      "Digital Europe Programme für digitale Aspekte"
    ],
    supportServices: [
      "Partner-Suche und Konsortiumsbildung",
      "Proposal Writing und Technical Reviews",
      "EU-Projektmanagement und Reporting",
      "IP-Strategie und Exploitation Planning"
    ],
    highlights: [
      {
        title: "Vollfinanzierung",
        description: "100% Förderung für Grundlagenforschung möglich."
      },
      {
        title: "Europäische Vernetzung",
        description: "Zugang zu führenden EU-Forschungsinstitutionen."
      },
      {
        title: "Marktführung",
        description: "Entwicklung von Technologien für globale Märkte."
      }
    ],
    faqs: [
      {
        question: "Können auch KMU als Koordinator fungieren?",
        answer: "Ja, KMU können Projekte koordinieren und erhalten dabei besondere Unterstützung."
      },
      {
        question: "Ist eine Beteiligung aus der Schweiz möglich?",
        answer: "Ja, die Schweiz ist assoziiertes Land und vollberechtigt."
      },
      {
        question: "Welche TRL-Stufen werden gefördert?",
        answer: "Hauptsächlich TRL 3-8, je nach Call auch niedrigere oder höhere Levels."
      }
    ],
    contact: {
      email: "horizon-green-deal@ec.europa.eu",
      url: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/programmes/horizon",
    },
    seo: {
      title: "Horizon Europe Green Deal Call - EU Forschungsförderung",
      description: "Großvolumige EU-Förderung für Green Deal Forschung und Innovation in erneuerbaren Energien.",
      keywords: ["Horizon Europe", "Green Deal", "EU Forschung Solar", "Innovation Förderung"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "interreg-central-europe-energy",
    title: "Interreg Central Europe: Low Carbon Economy",
    shortTitle: "Interreg CE Energy",
    provider: "Interreg Central Europe Programme",
    level: "eu",
    region: "Mitteleuropa",
    isActive: true,
    summary: "Transnationale Zusammenarbeit für nachhaltige Energielösungen und CO₂-arme Wirtschaft in Mitteleuropa.",
    tagline: "Grenzüberschreitende Energieprojekte in Mitteleuropa",
    logo: "https://www.interreg-central.eu/media/img/logo.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 2,3 Mio. € pro Projekt",
    fundingRate: "75-85% je nach Partnertyp",
    targetGroups: ["Regionen", "Städte", "Forschungseinrichtungen", "KMU"],
    eligibleProjects: [
      "Regionale Energiepläne mit erneuerbaren Energien",
      "Smart Energy Communities",
      "Innovative PV-Integration in Städten",
      "Energiespeicher für ländliche Gebiete",
      "Capacity Building für Energiewende"
    ],
    eligibleCosts: [
      "Personalkosten",
      "Beratungsdienstleistungen",
      "Pilotinvestitionen bis 20% des Budgets",
      "Dissemination und Kommunikation"
    ],
    nonEligibleCosts: [
      "Große Infrastrukturinvestitionen",
      "Kommerzielle Aktivitäten",
      "Kosten außerhalb des Programmgebiets"
    ],
    requirements: [
      "Mindestens 3 Partner aus 3 verschiedenen Ländern",
      "Transnationaler Mehrwert",
      "Beitrag zu EU-Kohäsions- und Klimazielen",
      "Nachhaltigkeit über Projektlaufzeit hinaus"
    ],
    applicationSteps: [
      "Partnersuche über Programmplattform",
      "Einreichung des Application Forms",
      "Quality Assessment durch Programmstellen",
      "Subsidy Contract Verhandlung",
      "Projektimplementierung mit Monitoring"
    ],
    documentsRequired: [
      "Project Application Form",
      "Partnership Agreement",
      "Work Plan mit Deliverables",
      "Budget Breakdown alle Partner"
    ],
    processingTime: "4-6 Monate",
    deadlines: "Nächster Call: 15. Januar 2025",
    combinationTips: [
      "Mit ERDF-Programmen der Bundesländer kombinierbar",
      "LIFE Programme für Umweltaspekte",
      "EIT Climate-KIC für Innovation"
    ],
    supportServices: [
      "Partnervermittlung und Projektentwicklung",
      "Antragstellungsworkshops",
      "Projektmanagement-Training",
      "Peer-Learning zwischen Projekten"
    ],
    highlights: [
      {
        title: "Transnational",
        description: "Lernen von Nachbarländern und gemeinsame Lösungsentwicklung."
      },
      {
        title: "Praxisorientiert",
        description: "Kombination aus Strategieentwicklung und Pilotmaßnahmen."
      }
    ],
    faqs: [
      {
        question: "Welche Länder können teilnehmen?",
        answer: "Deutschland, Österreich, Polen, Tschechien, Slowakei, Ungarn, Slowenien, Italien, Kroatien."
      },
      {
        question: "Können auch private Unternehmen Partner sein?",
        answer: "Ja, KMU sind als assoziierte Partner willkommen."
      }
    ],
    contact: {
      phone: "+49 3521 7231-0",
      email: "info@interreg-central.eu",
      url: "https://www.interreg-central.eu/",
    },
    seo: {
      title: "Interreg Central Europe Low Carbon Economy Förderung",
      description: "Transnationale EU-Förderung für nachhaltige Energieprojekte in Mitteleuropa.",
      keywords: ["Interreg Central Europe", "EU regional cooperation", "Low Carbon Economy"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "koeln-klimaschutzsonderprogramm",
    title: "Köln: Klimaschutz-Sonderprogramm für erneuerbare Energien",
    shortTitle: "Köln Klimaschutz",
    provider: "Stadt Köln",
    level: "kommunal",
    region: "Köln",
    isActive: true,
    summary: "Umfassendes städtisches Förderprogramm für Klimaschutzmaßnahmen und erneuerbare Energien im Kölner Stadtgebiet.",
    tagline: "Klimaschutz-Förderung für das Kölner Stadtgebiet",
    logo: "https://www.stadt-koeln.de/images/logo_stadt_koeln.svg",
    fundingTypes: ["Zuschuss"],
    maxFunding: "Bis zu 50.000 € pro Vorhaben",
    fundingRate: "Bis zu 40% der förderfähigen Kosten",
    targetGroups: ["Privatpersonen", "Unternehmen", "Hausverwaltungen", "Vereine"],
    eligibleProjects: [
      "Balkon-PV-Anlagen",
      "Aufdach-PV bis 30 kWp",
      "Stromspeicher für Eigenheime",
      "E-Ladesäulen mit Solarstrom",
      "Solarthermie-Anlagen",
      "Energieberatung"
    ],
    eligibleCosts: [
      "Anschaffung und Installation",
      "Elektrische Anschlussarbeiten",
      "Zähler und Messeinrichtungen",
      "Beratungskosten"
    ],
    nonEligibleCosts: [
      "Projekte außerhalb Kölns",
      "Bereits begonnene Maßnahmen",
      "Eigenleistungen"
    ],
    requirements: [
      "Wohnsitz oder Unternehmenssitz in Köln",
      "Antragstellung vor Maßnahmenbeginn",
      "Fachgerechte Installation",
      "Mindestnutzungsdauer von 10 Jahren"
    ],
    applicationSteps: [
      "Online-Antrag auf städtischer Website",
      "Prüfung und Bewilligung",
      "Durchführung der Maßnahme",
      "Nachweis durch Rechnungen und Fotos",
      "Auszahlung des Zuschusses"
    ],
    documentsRequired: [
      "Kostenvoranschläge",
      "Lageplan/Foto der geplanten Installation",
      "Einverständnis Vermieter bei Mietobjekten",
      "Nachweis Eigenverbrauchsanteil"
    ],
    processingTime: "4-6 Wochen",
    deadlines: "Anträge bis 30. November 2025 (budgetabhängig)",
    combinationTips: [
      "Mit NRW progres.nrw kombinierbar",
      "KfW-Kredite für größere Anlagen ergänzend",
      "Stadtwerke Köln Ökostrom-Tarife"
    ],
    supportServices: [
      "Kostenlose Erstberatung durch Verbraucherzentrale",
      "Liste qualifizierter Installationsbetriebe",
      "Online-Rechner für Förderungshöhe",
      "Nachbarschaftsnetzwerke und Erfahrungsaustausch"
    ],
    highlights: [
      {
        title: "Niedrigschwellig",
        description: "Auch kleine Balkon-PV-Anlagen werden gefördert."
      },
      {
        title: "Schnelle Bearbeitung",
        description: "Kurze Bearbeitungszeiten durch digitale Prozesse."
      }
    ],
    faqs: [
      {
        question: "Werden auch Balkon-Solaranlagen gefördert?",
        answer: "Ja, Balkon-PV wird mit bis zu 200 € pro Anlage gefördert."
      },
      {
        question: "Kann ich mehrere Förderungen kombinieren?",
        answer: "Ja, mit anderen Programmen bis zur Grenze der Vollfinanzierung."
      }
    ],
    contact: {
      phone: "+49 221 221-0",
      email: "klimaschutz@stadt-koeln.de",
      url: "https://www.stadt-koeln.de/klimaschutz-foerderung",
    },
    seo: {
      title: "Köln Klimaschutz-Sonderprogramm - Solar Förderung",
      description: "Städtische Förderung für erneuerbare Energien und Klimaschutz in Köln.",
      keywords: ["Köln Solar Förderung", "Klimaschutz Köln", "Balkon PV Zuschuss"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "duesseldorf-climate-city-contract",
    title: "Düsseldorf: Climate City Contract - Erneuerbare Energien",
    shortTitle: "Düsseldorf CCC",
    provider: "Landeshauptstadt Düsseldorf",
    level: "kommunal",
    region: "Düsseldorf",
    isActive: true,
    summary: "Innovative Stadtförderung im Rahmen des EU Climate City Contracts mit Fokus auf Bürgerbeteiligung und dezentrale Energieversorgung.",
    tagline: "Innovative Klimaschutz-Förderung für Düsseldorf",
    logo: "https://www.duesseldorf.de/fileadmin/Amt12/logos/logo_duesseldorf.svg",
    fundingTypes: ["Zuschuss", "Bürgschaftsprogramm"],
    maxFunding: "Bis zu 100.000 € für Gemeinschaftsprojekte",
    fundingRate: "Bis zu 60% bei Bürgerbeteiligung",
    targetGroups: ["Bürgergemeinschaften", "Stadtquartiere", "Gewerbegebiete", "Bildungseinrichtungen"],
    eligibleProjects: [
      "Bürger-Solarparks auf städtischen Dächern",
      "Quartierspeicher mit Sharing-Konzepten",
      "Schulprojekte für erneuerbare Energien",
      "Gewerbegebiets-Microgrids",
      "Urban Farming mit Agri-PV"
    ],
    eligibleCosts: [
      "Gemeinschaftsanlagen und Infrastruktur",
      "Partizipations- und Planungskosten",
      "Digitale Plattformen für Energy Sharing",
      "Bildungs- und Öffentlichkeitsarbeit"
    ],
    nonEligibleCosts: [
      "Individuelle Hausanlagen ohne Gemeinschaftscharakter",
      "Kommerzielle Projekte ohne Bürgerbeteiligung",
      "Projekte außerhalb Düsseldorfs"
    ],
    requirements: [
      "Mindestens 10 beteiligte Haushalte/Unternehmen",
      "Nachweis der Bürgerbeteiligung",
      "CO₂-Neutralitätsbeitrag für Düsseldorf 2035",
      "Innovative Technologie oder Geschäftsmodell"
    ],
    applicationSteps: [
      "Community Building und Interessensbekundung",
      "Machbarkeitsstudie mit städtischer Unterstützung",
      "Antragstellung im Projektformat",
      "Bewilligung und Implementierungsphase",
      "Monitoring und Community-Berichterstattung"
    ],
    documentsRequired: [
      "Gemeinschaftsvereinbarung/Genossenschaftssatzung",
      "Partizipationskonzept",
      "Technisches Gesamtkonzept",
      "Finanzierungs- und Betriebsmodell"
    ],
    processingTime: "8-12 Wochen",
    deadlines: "Quartalsweise Antragsrunden",
    combinationTips: [
      "Mit EU Mission Climate-Neutral Cities Förderung kombinierbar",
      "NRW.Bank Bürgschaftsprogramme ergänzend",
      "Stadtwerke Düsseldorf als Projektpartner"
    ],
    supportServices: [
      "Community Organizing und Partizipationsberatung",
      "Rechtliche Beratung für Bürgerprojekte",
      "Technische Machbarkeitsstudien",
      "Vernetzung mit anderen Bürgerprojekten"
    ],
    highlights: [
      {
        title: "Bürgerzentriert",
        description: "Besonders hohe Förderung für Bürgerbeteiligungsprojekte."
      },
      {
        title: "Innovation",
        description: "Pilotprojekte für neue Geschäfts- und Teilhabemodelle."
      },
      {
        title: "EU-vernetzt",
        description: "Teil des europäischen Climate City Netzwerks."
      }
    ],
    faqs: [
      {
        question: "Was bedeutet 'Climate City Contract'?",
        answer: "Ein Vertrag mit der EU für klimaneutrale Stadtentwicklung bis 2030."
      },
      {
        question: "Können auch Mieter Projekte initiieren?",
        answer: "Ja, mit Zustimmung der Eigentümer sind Mieter-Community-Projekte förderfähig."
      }
    ],
    contact: {
      phone: "+49 211 89-0",
      email: "climate-city@duesseldorf.de",
      url: "https://www.duesseldorf.de/climate-city-contract",
    },
    seo: {
      title: "Düsseldorf Climate City Contract - Bürger-Solar Förderung",
      description: "Innovative städtische Förderung für Bürgerprojekte im Bereich erneuerbare Energien.",
      keywords: ["Düsseldorf Climate City", "Bürger Solar", "Community Energy"],
    },
    lastUpdated: "November 2025",
  },
  {
    slug: "frankfurt-klimabonus-solar",
    title: "Frankfurt am Main: Klimabonus für Solarenergie",
    shortTitle: "Frankfurt Klimabonus",
    provider: "Stadt Frankfurt am Main",
    level: "kommunal",
    region: "Frankfurt am Main",
    isActive: true,
    summary: "Städtisches Bonusprogramm für Photovoltaik und Solarthermie mit zusätzlichen Anreizen für innovative Technologien und Gebäudeintegration.",
    tagline: "Klimabonus für innovative Solarlösungen",
    logo: "https://frankfurt.de/-/media/frankfurtde/global/logos/logo-frankfurt-main.svg",
    fundingTypes: ["Bonus-Zuschuss"],
    maxFunding: "Bis zu 25.000 € pro Objekt",
    fundingRate: "200-1.000 €/kWp je nach Kategorie",
    targetGroups: ["Hauseigentümer", "Gewerbetreibende", "Wohnungsunternehmen"],
    eligibleProjects: [
      "Innovative PV-Fassadenintegration",
      "Denkmalschutz-PV mit besonderen Modulen",
      "Floating-PV auf städtischen Gewässern",
      "Agri-PV auf städtischen Flächen",
      "PV-Überdachungen (Parkplätze, etc.)",
      "Gebäudeintegrierte Photovoltaik (BIPV)"
    ],
    eligibleCosts: [
      "Mehrkosten für Design-Integration",
      "Speziallösungen für Denkmalschutz",
      "Innovative Montagesysteme",
      "Aufständerungen und Unterkonstruktionen"
    ],
    nonEligibleCosts: [
      "Standard-Aufdachanlagen ohne Innovation",
      "Reine Kosteneinsparungsmaßnahmen",
      "Projekte außerhalb Frankfurts"
    ],
    requirements: [
      "Innovative oder gestalterisch hochwertige Lösung",
      "Sichtbare Vorbildfunktion im Stadtbild",
      "Fachplanung durch qualifizierten Architekten/Planer",
      "10-jährige Betriebsgarantie"
    ],
    applicationSteps: [
      "Designberatung durch Stadtplanungsamt",
      "Antragstellung mit Visualisierungen",
      "Design-Review durch Expertenbeirat",
      "Bewilligung und Realisierung",
      "Dokumentation für städtische Referenzdatenbank"
    ],
    documentsRequired: [
      "Architektonische Visualisierungen",
      "Technisches Konzept mit Innovationsnachweis",
      "Gestaltungsplan mit Stadtbildintegration",
      "Kostenkalkulation mit Innovationsmehrkosten"
    ],
    processingTime: "6-8 Wochen inkl. Design-Review",
    deadlines: "Laufende Antragstellung, Budget 2025: 2 Mio. €",
    combinationTips: [
      "Mit Hessen-Förderprogrammen stackbar",
      "KfW-Erneuerbare Energien Standard",
      "Mainova-Contracting für Betriebsführung"
    ],
    supportServices: [
      "Architekturberatung für BIPV-Lösungen",
      "Denkmalschutz-Beratung",
      "Vernetzung mit Spezialisten und Herstellern",
      "Referenzdatenbank erfolgreicher Projekte"
    ],
    highlights: [
      {
        title: "Design-orientiert",
        description: "Besondere Förderung für architektonisch anspruchsvolle Lösungen."
      },
      {
        title: "Innovationsbonus",
        description: "Höhere Förderung für technische Innovationen."
      },
      {
        title: "Vorbildcharakter",
        description: "Stadt als Referenz für andere Kommunen."
      }
    ],
    faqs: [
      {
        question: "Was gilt als 'innovative' PV-Lösung?",
        answer: "Fassadenintegration, besondere Ästhetik, Multifunktionalität oder neue Technologien."
      },
      {
        question: "Sind auch kleinere Anlagen unter 10 kWp förderfähig?",
        answer: "Ja, bei entsprechendem Innovationscharakter auch kleine Anlagen."
      }
    ],
    contact: {
      phone: "+49 69 212-0",
      email: "klimabonus@stadt-frankfurt.de",
      url: "https://frankfurt.de/klimabonus-solar",
    },
    seo: {
      title: "Frankfurt Klimabonus für innovative Solarenergie",
      description: "Städtische Förderung für architektonisch anspruchsvolle und innovative PV-Lösungen.",
      keywords: ["Frankfurt Klimabonus", "BIPV Förderung", "Innovative Photovoltaik"],
    },
    lastUpdated: "November 2025",
  }
];

export const getFundingProgramBySlug = (slug: string): FundingProgram | undefined =>
  fundingPrograms.find((program) => program.slug === slug);

export const getFundingProgramsByLevel = (level: FundingProgramLevel): FundingProgram[] =>
  fundingPrograms.filter((program) => program.level === level && program.isActive);

export const getActiveFundingPrograms = (): FundingProgram[] =>
  fundingPrograms.filter((program) => program.isActive);

export const fundingProgramLevels: { level: FundingProgramLevel; label: string }[] = [
  { level: 'bund', label: 'Bundesweite Programme' },
  { level: 'land', label: 'Landesprogramme' },
  { level: 'eu', label: 'EU-weit & international' },
  { level: 'kommunal', label: 'Kommunal & Stadtwerke' },
];

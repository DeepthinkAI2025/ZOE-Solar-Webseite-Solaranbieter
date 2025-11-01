// Voice-Search und KI-Chat optimierte FAQ-Daten
// Transformation für bessere Sprach- und Chat-Optimierung

export const voiceOptimizedFAQs = {
  // Originalfrage: "Wie viel kostet eine Solaranlage?"
  // Voice-optimiert: "Was kostet eine Solaranlage für mein Haus?"
  "was-kostet-eine-solaranlage-fuer-mein-haus": {
    canonical_question: "Wie hoch sind die Anschaffungskosten für eine Solaranlage?",
    spoken_answer: "Eine Solaranlage kostet zwischen zwölftausend und achtzehntausend Euro für eine typische Anlage.",
    voice_keywords: ["Solaranlage Kosten", "Photovoltaik Preis", "Haus Solaranlage"],
    detailed_answer: "Die Kosten liegen typischerweise zwischen 1.200-1.800 Euro pro kWp installierter Leistung. Für eine 10 kWp Anlage betragen die Gesamtkosten somit 12.000-18.000 Euro. Mit Förderungen reduzieren sich die Kosten um bis zu 40%.",
    confidence_score: 0.95,
    last_updated: "2025-11-01"
  },

  // Originalfrage: "Welche Förderungen gibt es für Solaranlagen?"
  // Voice-optimiert: "Was für Förderungen gibt es für Solar?"
  "was-fuer-foerderungen-gibt-es-fuer-solar": {
    canonical_question: "Welche Förderungen gibt es für Solaranlagen?",
    spoken_answer: "Die wichtigsten Förderungen sind BEG-Förderung bis zu fünfzig Prozent und KfW-Förderung.",
    voice_keywords: ["Solarförderung", "BEG Förderung", "KfW Solar", "PV Zuschuss"],
    detailed_answer: "BEG-Förderung bis zu 50% Zuschuss, KfW-Wohngebäudedarlehen zinsgünstig bis 7.500 €, KfW-Zuschuss für LiFePO4-Batteriespeicher bis 3.000 €, Einspeisevergütung nach EEG bis 8,2 ct/kWh, regionale Förderungen je nach Bundesland.",
    confidence_score: 0.92,
    last_updated: "2025-11-01"
  },

  // Originalfrage: "Lohnt sich ein Batteriespeicher?"
  // Voice-optimiert: "Wann lohnt sich ein Solar-Speicher?"
  "wann-lohnt-sich-ein-solar-speicher": {
    canonical_question: "Lohnt sich ein Batteriespeicher?",
    spoken_answer: "Ein Solar-Speicher lohnt sich besonders bei hohen Strompreisen und wenn Sie viel Solarstrom selbst nutzen möchten.",
    voice_keywords: ["Batteriespeicher", "Solar Speicher", "Eigenverbrauch", "Speicher lohnen"],
    detailed_answer: "Mit Speicher nutzen Sie bis zu 70% Solarstrom selbst (statt 30% ohne). Speicherkosten: 500-1.200 €/kWh. Amortisation: 8-12 Jahre durch Stromkosteneinsparungen.",
    confidence_score: 0.89,
    last_updated: "2025-11-01"
  },

  // Originalfrage: "Was ist Agri-PV?"
  // Voice-optimiert: "Was ist Agri-PV und wie funktioniert es?"
  "was-ist-agr-pv-und-wie-funktioniert-es": {
    canonical_question: "Was ist Agri-PV und wie funktioniert es?",
    spoken_answer: "Agri-PV kombiniert Landwirtschaft und Solarstrom auf derselben Fläche.",
    voice_keywords: ["Agri-PV", "Agrivoltaik", "Landwirtschaft Solar", "Solar Landwirtschaft"],
    detailed_answer: "Agri-PV kombiniert Landwirtschaft und Photovoltaik. Offene Systeme lassen 80-90% Licht durch, ermöglichen landwirtschaftliche Nutzung. Bis zu 40% Zuschuss verfügbar.",
    confidence_score: 0.91,
    last_updated: "2025-11-01"
  },

  // Originalfrage: "Brauche ich eine Baugenehmigung?"
  // Voice-optimiert: "Brauche ich Genehmigung für Solaranlage?"
  "brauche-ich-genehmigung-fuer-solaranlage": {
    canonical_question: "Brauche ich eine Baugenehmigung für meine Solaranlage?",
    spoken_answer: "In den meisten Fällen benötigen Sie keine Baugenehmigung für Dachanlagen.",
    voice_keywords: ["Solar Genehmigung", "Baugenehmigung Solar", "Solaranlage Erlaubnis"],
    detailed_answer: "In den meisten Bundesländern benötigen Solaranlagen auf Dachflächen keine Baugenehmigung (Solarprivilegierung nach § 6 BauGB). Ausnahmen: Denkmalschutzgebiete, Freiflächenanlagen ab 500 kWp.",
    confidence_score: 0.94,
    last_updated: "2025-11-01"
  }
};

// KI-Chat optimierte Response-Struktur
export const aiChatResponses = {
  "cost": {
    primary_question: "Wie viel kostet eine Solaranlage?",
    response_template: "Solaranlage Kosten 2025: {cost_range} für {system_size} Anlage. Mit BEG-Förderung {discount}% günstiger.",
    confidence_indicators: ["cost_range", "system_size", "discount_percentage"],
    related_questions: [
      "Welche Förderungen gibt es?",
      "Wie schnell amortisiert sich eine Anlage?",
      "Was kostet ein Batteriespeicher?"
    ]
  },
  "funding": {
    primary_question: "Welche Förderungen gibt es?",
    response_template: "BEG-Förderung: {beg_percentage}%, KfW: {kfw_amount}€, Speicher: {storage_bonus}€.",
    confidence_indicators: ["beg_percentage", "kfw_amount", "storage_bonus"],
    related_questions: [
      "Wie beantrage ich BEG-Förderung?",
      "Wie lange dauert die Bearbeitung?",
      "Welche Unterlagen brauche ich?"
    ]
  },
  "technical": {
    primary_question: "Wie funktioniert eine Solaranlage?",
    response_template: "Photovoltaik wandelt Sonnenlicht in Strom um. {basic_explanation}",
    confidence_indicators: ["efficiency", "lifespan", "maintenance"],
    related_questions: [
      "Wie hoch ist der Ertrag?",
      "Wie lange hält eine Anlage?",
      "Was passiert bei bewölktem Himmel?"
    ]
  }
};

// Schema für ChatGPT/Claude Optimierung
export const chatOptimizedSchema = {
  "solar_panel_cost": {
    question: "Wie viel kostet eine Solaranlage?",
    answer_summary: "12.000-18.000€ für 10 kWp, BEG-Förderung bis 50%",
    answer_details: "Vollständige Kostenaufschlüsselung mit allen Komponenten...",
    speakable_version: "Eine Solaranlage kostet zwischen zwölftausend und achtzehntausend Euro.",
    confidence_level: 0.95,
    sources: [
      {
        title: "ZOE Solar Kostenrechner",
        url: "https://zoe-solar.de/kostenrechner",
        reliability: "high"
      }
    ]
  }
};
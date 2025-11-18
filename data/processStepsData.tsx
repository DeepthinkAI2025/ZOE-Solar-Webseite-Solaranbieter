export interface ProcessStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  timeline: string;
  icon: React.ReactNode;
  details: string[];
  cta?: string;
}

// Icon-Komponenten für den Prozess
const ConsultationIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const PlanningIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0018 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>
);

const InstallationIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17 17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437L18.16 19.673a2.25 2.25 0 01-2.244 2.245H6.09a2.25 2.25 0 01-2.244-2.245L2.909 15.91z" />
  </svg>
);

const MonitoringIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.12L9 21l1.879-1.879A3 3 0 0113.5 18.257V17.25a6 6 0 00-6-6H9z" />
  </svg>
);

// 4-Schritte-Prozess für Photovoltaik-Installation
export const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: "Kostenlose Beratung",
    subtitle: "Ihr Solarberater analysiert Ihre Situation",
    description: "Im kostenlosen Beratungsgespräch analysieren wir Ihr Dach, Ihren Stromverbrauch und entwickeln die optimale Photovoltaik-Lösung für Ihre Bedürfnisse.",
    timeline: "1 Woche",
    icon: <ConsultationIcon className="w-12 h-12 text-green-600" />,
    details: [
      "Kostenlose Dachanalyse und Vermessung",
      "Stromverbrauchsanalyse für optimale Dimensionierung",
      "Individuelle Renditeberechnung und Förderung",
      "Unverbindliches Angebot mit allen Details",
      "Optional: 3D-Simulation des fertigen Daches"
    ],
    cta: "Jetzt Beratungstermin vereinbaren"
  },
  {
    id: 2,
    title: "Professionelle Planung",
    subtitle: "Detaillierte Systemauslegung und Genehmigungen",
    description: "Nach Ihrer Entscheidung erstellen wir die detaillierte Planung mit technischer Auslegung, statischen Berechnungen und kümmern uns um alle erforderlichen Genehmigungen.",
    timeline: "1-2 Wochen",
    icon: <PlanningIcon className="w-12 h-12 text-green-600" />,
    details: [
      "Detaillierte technische Systemauslegung",
      "3D-Modellierung für optimale Platzausnutzung",
      "Genehmigungsantrag beim Netzbetreiber",
      "Koordination mit Denkmalschutz (falls erforderlich)",
      "Vor-Ort-Vermessung für finale Montageplanung"
    ],
    cta: "Planungsunterlagen anfordern"
  },
  {
    id: 3,
    title: "Expertise Installation",
    subtitle: "Professionelle Montage durch zertifizierte Techniker",
    description: "Unsere erfahrenen Solarteure installieren Ihre Anlage in 1-2 Tagen - sauber, schnell und fachgerecht nach höchsten Sicherheitsstandards.",
    timeline: "1-2 Tage",
    icon: <InstallationIcon className="w-12 h-12 text-green-600" />,
    details: [
      "Fachgerechte Montage der Solarpanels",
      "Installation des Wechselrichters",
      "Elektrische Verkabelung und Netzanschluss",
      "Test der Anlage und Inbetriebnahme",
      "Einweisung in das Monitoring-System"
    ],
    cta: "Installationstermin buchen"
  },
  {
    id: 4,
    title: "Monitoring & Service",
    subtitle: "25+ Jahre Überwachung und Support",
    description: "Ihre Anlage wird 24/7 überwacht. Bei Problemen reagieren wir sofort, und Sie profitieren von unserem umfassenden Service und der langen Garantie.",
    timeline: "Lebenslanger Service",
    icon: <MonitoringIcon className="w-12 h-12 text-green-600" />,
    details: [
      "24/7 Remote-Monitoring Ihrer Anlage",
      "Sofortige Fehlerbenachrichtigung",
      "Regelmäßige Wartung und Reinigung",
      "Schneller Austausch defekter Komponenten",
      "Optimierung des Eigenverbrauchs"
    ],
    cta: "Service-Optionen anzeigen"
  }
];

// Erweiterte Prozess-Details für SEO-optimierte Inhalte
export const extendedProcessContent = {
  fase1: {
    title: "Beratungsphase - Ihre Bedürfnisse im Fokus",
    description: "In der ersten Phase nehmen wir uns Zeit für Sie. Unsere Solarberater analysieren nicht nur Ihr Dach, sondern auch Ihre Lebensgewohnheiten und Stromverbrauchsmuster.",
    highlights: [
      "Persönliche Beratung vor Ort oder online",
      "Kostenlose Dachanalyse mit modernster 3D-Vermessung",
      "Stromverbrauchsanalyse für optimale Systemdimensionierung",
      "Individuelle Finanzierungslösungen",
      "Transparente Förderungsberatung für maximale Vorteile"
    ],
    faqs: [
      {
        question: "Wie lange dauert die erste Beratung?",
        answer: "Das Beratungsgespräch dauert etwa 60-90 Minuten, je nach Komplexität Ihrer Situation."
      },
      {
        question: "Kostet die Beratung wirklich nichts?",
        answer: "Ja, die Beratung, Dachanalyse und Angebotserstellung sind für Sie komplett kostenlos und unverbindlich."
      }
    ]
  },
  fase2: {
    title: "Planungsphase - Präzision vor der Umsetzung",
    description: "In der Planungsphase wird aus Idee konkrete Realität. Jedes Detail wird durchdacht und optimiert, um maximale Erträge zu sichern.",
    highlights: [
      "Professionelle Systemauslegung mit moderner Software",
      "3D-Visualisierung für optimale Ansprechbarkeit",
      "Genehmigungsmanagement durch unsere Experten",
      "Koordination mit lokalen Behörden",
      "Statische Berechnung für Dachbelastung"
    ],
    faqs: [
      {
        question: "Werden alle Genehmigungen für mich eingereicht?",
        answer: "Ja, wir kümmern uns um alle erforderlichen Genehmigungen beim Netzbetreiber und anderen Behörden."
      }
    ]
  },
  fase3: {
    title: "Installationsphase - Schnell, sauber, professionell",
    description: "Die Installation erfolgt durch unsere zertifizierten Solarteure nach höchsten Qualitätsstandards. Saubere Arbeit und minimaler Eingriff in Ihren Alltag stehen im Mittelpunkt.",
    highlights: [
      "Vollständige Werksmontage durch erfahrene Spezialisten",
      "Kurze Montagezeit: nur 1-2 Tage für Standardanlagen",
      "Saubere Arbeitsweise ohne Beschädigung der Dachfläche",
      "Sofortige Funktionsprüfung und Inbetriebnahme",
      "Einweisung in das Monitoring-System"
    ],
    faqs: [
      {
        question: "Muss ich während der Installation zu Hause sein?",
        answer: "Grundsätzlich reicht die Anwesenheit zur Inbetriebnahme. Wir informieren Sie rechtzeitig über alle erforderlichen Termine."
      }
    ]
  },
  fase4: {
    title: "Servicephase - 25+ Jahre für maximale Sicherheit",
    description: "Ihre Photovoltaik-Anlage soll über Jahrzehnte zuverlässig funktionieren. Deshalb überwachen wir sie 24/7 und bieten umfassenden Service.",
    highlights: [
      "24/7 Remote-Überwachung aller Systemparameter",
      "Automatische Fehlererkennung und Benachrichtigung",
      "Regelmäßige Wartung für optimale Leistung",
      "Schneller Support und Austausch defekter Teile",
      "Langfristige Optimierung des Eigenverbrauchs"
    ],
    faqs: [
      {
        question: "Was passiert bei einem Defekt?",
        answer: "Unser 24/7 Monitoring erkennt Probleme sofort. Wir reagieren umgehend und sorgen für schnellste Reparatur oder Austausch."
      }
    ]
  }
};
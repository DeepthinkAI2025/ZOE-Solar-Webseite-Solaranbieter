export type ServiceCategory = 'Solaranlagen & Speicher' | 'E-Mobilität & Ladeparks' | 'Dach- & Gebäudeservice' | 'Planung & Beratung';

export interface ConfigurableField {
  id: string;
  type: 'slider';
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  context: string; // Used for starting the chat
  configurableFields?: ConfigurableField[];
}

export const services: Service[] = [
  // Solaranlagen & Speicher
  { id: 'solar-dach-gewerbe', title: 'Gewerbliche Dachanlage', category: 'Solaranlagen & Speicher', context: 'Anfrage für gewerbliche Dachanlage' },
  { id: 'solar-freiflaeche', title: 'Freiflächen-Solarpark', category: 'Solaranlagen & Speicher', context: 'Anfrage für Freiflächen-Solarpark' },
  { id: 'solar-speicher-industrie', title: 'Industrieller Batteriespeicher', category: 'Solaranlagen & Speicher', context: 'Anfrage für industriellen Batteriespeicher' },
  { id: 'solar-carport', title: 'Solar-Carport', category: 'Solaranlagen & Speicher', context: 'Anfrage für Solar-Carport' },
  { id: 'balkonkraftwerk', title: 'Balkonkraftwerk', category: 'Solaranlagen & Speicher', context: 'Anfrage für Balkonkraftwerk' },

  // E-Mobilität & Ladeparks
  { id: 'emob-ladepark-hpc', title: 'Öffentlicher Ladepark (HPC)', category: 'E-Mobilität & Ladeparks', context: 'Anfrage für öffentlichen Ladepark' },
  { id: 'emob-flottenladen', title: 'Mitarbeiter- & Flottenladen', category: 'E-Mobilität & Ladeparks', context: 'Anfrage für Mitarbeiter- & Flottenladen' },
  {
    id: 'emob-wallbox',
    title: 'Einzelne Wallboxen',
    category: 'E-Mobilität & Ladeparks',
    context: 'Anfrage für einzelne Wallboxen',
    configurableFields: [
      { id: 'cableLength', type: 'slider', label: 'Benötigte Leitungslänge vom Zählerschrank', unit: 'm', min: 1, max: 50, step: 1, defaultValue: 10 }
    ]
  },

  // Dach- & Gebäudeservice
  {
    id: 'dach-rinnenreinigung',
    title: 'Dachrinnenreinigung',
    category: 'Dach- & Gebäudeservice',
    context: 'Anfrage für Dachrinnenreinigung',
    configurableFields: [
      { id: 'gutterLength', type: 'slider', label: 'Länge der Dachrinne', unit: 'm', min: 5, max: 200, step: 1, defaultValue: 20 }
    ]
  },
  { id: 'dach-reparatur', title: 'Dachreparatur / Ziegelaustausch', category: 'Dach- & Gebäudeservice', context: 'Anfrage für Dachreparatur' },
  { id: 'dach-wartung-pv', title: 'Wartung & Reinigung PV-Anlage', category: 'Dach- & Gebäudeservice', context: 'Anfrage für Wartung & Reinigung PV-Anlage' },

  // Planung & Beratung
  { id: 'plan-elektro', title: 'Allgemeine Elektroarbeiten', category: 'Planung & Beratung', context: 'Anfrage für allgemeine Elektroarbeiten' },
  { id: 'plan-netzanschluss', title: 'Netzanschluss & Anmeldung', category: 'Planung & Beratung', context: 'Anfrage für Netzanschluss & Anmeldung' },
  { id: 'plan-foerderung', title: 'Fördermittelberatung', category: 'Planung & Beratung', context: 'Anfrage für Fördermittelberatung' },
  { id: 'plan-sonstiges', title: 'Sonstige Anfrage', category: 'Planung & Beratung', context: 'Allgemeine Anfrage' },
];
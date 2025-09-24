export interface Offer {
  id: string;
  customerType: 'private' | 'commercial' | 'all';
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  validUntil: string;
  ctaText: string;
  conditions: string[];
  isFeatured?: boolean;
  requiredMinPower?: number;
  status: 'active' | 'expired';
  bonusType: 'discount' | 'referral' | 'product';
  ctaPage?: 'empfehlungspraemie';
}

export const offersData: Offer[] = [
  {
    id: 'agri-pv-foerderung-2025',
    customerType: 'commercial',
    title: 'Agri-PV Förder-Offensive 2025',
    subtitle: 'Bis zu 1 Mio. € Zuschuss sichern',
    description: 'Profitieren Sie von der neuen Bundesförderung 2025! Wir analysieren Ihr Potenzial, planen Ihre Anlage und sichern Ihnen die maximale staatliche Förderung für Ihr Agri-PV Projekt. Machen Sie Ihr Land jetzt doppelt wertvoll.',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
    validUntil: '31. Dezember 2025',
    ctaText: 'Jetzt Förderung prüfen',
    conditions: [
        'Für Landwirte & Grundbesitzer',
        'Kombiniert Bundes- & Landesmittel',
        'Wir übernehmen die komplette Antragsstellung'
    ],
    isFeatured: true,
    status: 'active',
    bonusType: 'product',
  },
  {
    id: 'agri-pv-starter',
    customerType: 'commercial',
    title: 'Agri-PV Starter-Bonus',
    subtitle: 'Bis zu 125.000 € Projektvorteil sichern',
    description: 'Planen Sie jetzt Ihr Agri-PV-Projekt und sichern Sie sich unseren Starter-Bonus. Wir übernehmen die komplette Förderantragsstellung und erstellen eine detaillierte Wirtschaftlichkeitsanalyse, um Ihnen Projektvorteile von bis zu 125.000 € zu sichern.',
    imageUrl: 'https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=2070&auto=format&fit=crop',
    validUntil: '31. März 2025',
    ctaText: 'Jetzt Analyse anfordern',
    conditions: [
        'Gilt für landwirtschaftliche Betriebe',
        'Für geplante Anlagen ab 100 kWp',
        'Unverbindlich und kostenlos'
    ],
    isFeatured: false,
    status: 'active',
    bonusType: 'product',
  },
  {
    id: 'gewerbe-bonus-5000',
    customerType: 'commercial',
    title: '5.000 € Gewerbe-Bonus',
    subtitle: 'Für Solaranlagen ab 30 kWp',
    description: 'Investieren Sie jetzt in eine leistungsstarke Solaranlage und wir belohnen Ihre Entscheidung mit einem einmaligen Bonus von 5.000 €. Die perfekte Starthilfe für Ihre Energieunabhängigkeit.',
    imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb122126a?q=80&w=1200&auto=format&fit=crop',
    validUntil: '31. Dezember 2025',
    ctaText: 'Jetzt 5.000 € Bonus sichern',
    conditions: [
      'Gilt für alle Neuanlagen ab 30 kWp',
      'Beauftragung muss bis zum Stichtag erfolgen',
      'Nicht mit anderen Aktionen kombinierbar'
    ],
    isFeatured: false,
    requiredMinPower: 30,
    status: 'active',
    bonusType: 'discount',
  },
  {
    id: 'privat-bonus-1500',
    customerType: 'private',
    title: '1.500 € Privat-Bonus',
    subtitle: 'Für Solaranlagen bis 30 kWp',
    description: 'Sichern Sie sich Ihren persönlichen Bonus für Ihr Solarprojekt. Ideal für Eigenheime und kleinere Gewerbeeinheiten, um den Einstieg in die saubere Energie noch attraktiver zu gestalten.',
    imageUrl: 'https://images.unsplash.com/photo-1509390621415-05581bda341d?q=80&w=1200&auto=format&fit=crop',
    validUntil: '31. September 2025',
    ctaText: 'Jetzt 1.500 € Bonus sichern',
    conditions: [
      'Gilt für alle Neuanlagen bis 30 kWp',
      'Wird bei der Endabrechnung gutgeschrieben',
      'Nicht mit anderen Aktionen kombinierbar'
    ],
    status: 'active',
    bonusType: 'discount',
  },
  {
    id: 'empfehlungs-bonus',
    customerType: 'all',
    title: 'Empfehlen & Verdienen',
    subtitle: 'Bis zu 500 € Prämie sichern',
    description: 'Gute Kontakte zahlen sich aus. Empfehlen Sie uns an Geschäftspartner oder Freunde weiter und erhalten Sie eine attraktive Prämie für jedes erfolgreich realisierte Projekt.',
    imageUrl: 'https://images.unsplash.com/photo-1556742518-a6e5b402c6a2?q=80&w=1200&auto=format&fit=crop',
    validUntil: 'Unbegrenzt gültig',
    ctaText: 'Mehr erfahren & empfehlen',
    conditions: [
      'Prämie gestaffelt nach Anlagengröße',
      'Auszahlung nach Inbetriebnahme',
      'Gilt für Privat- & Gewerbekunden'
    ],
    status: 'active',
    bonusType: 'referral',
    ctaPage: 'empfehlungspraemie',
  },
  {
    id: 'wallbox-rabatt',
    customerType: 'private',
    title: 'E-Mobility Starter-Bonus',
    subtitle: '250 € Rabatt auf Ihre Wallbox',
    description: 'Kombinieren Sie Ihr neues Solarpaket (ab 8 kWp) mit einer intelligenten Wallbox und wir schenken Ihnen 250 €. Laden Sie Ihr E-Auto mit günstigem Solarstrom vom eigenen Dach.',
    imageUrl: 'https://images.unsplash.com/photo-1629828113880-7a877169d2a0?q=80&w=1200&auto=format&fit=crop',
    validUntil: '31. Oktober 2025',
    ctaText: 'Bonus anfragen',
    conditions: [
      'Gilt beim Kauf eines Solarpakets ab 8 kWp',
      'Gilt für ausgewählte Wallbox-Modelle',
      'Nicht mit anderen Aktionen kombinierbar'
    ],
    status: 'active',
    bonusType: 'product',
  },
  {
    id: 'fruehbucher-bonus-abgelaufen',
    customerType: 'commercial',
    title: 'Frühbucher-Bonus 2024',
    subtitle: '10% auf die Unterkonstruktion',
    description: 'Alle Unternehmer, die ihr Projekt für das zweite Halbjahr 2024 frühzeitig mit uns geplant haben, erhielten einen exklusiven Rabatt von 10% auf das gesamte Montagesystem.',
    imageUrl: 'https://images.unsplash.com/photo-1628087942182-7b3d0e34ab3c?q=80&w=1974&auto=format&fit=crop',
    validUntil: '30. Juni 2024',
    ctaText: 'Aktion beendet',
    conditions: [
      'Galt für Beauftragungen bis 30.06.2024',
      'Für alle gewerblichen Dachanlagen',
      'Aktion ist leider abgelaufen'
    ],
    status: 'expired',
    bonusType: 'discount',
  },
];

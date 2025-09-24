export interface TechSpec {
  icon: 'yield' | 'design' | 'dual-use';
  label: string;
}

export interface Innovation {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  callToAction: string;
  aiInfo: string;
  tagline: string;
  techSpecs: TechSpec[];
}

export const innovations: Innovation[] = [
  {
    id: 'solar-fence',
    title: "Der dynamische Solarzaun",
    category: "Grundstücksgrenzen neu gedacht",
    description: "Mehr als nur eine Grenze: Unsere Solarzäune sind blickdicht, sicher und produzieren Strom. Bifaziale Module nutzen die Sonne von beiden Seiten – ideal für Ost-West-Ausrichtungen und maximale Energieausbeute.",
    imageUrl: "https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=2070&auto=format&fit=crop",
    callToAction: "Potenzial entdecken",
    aiInfo: "Unsere bifazialen Solarzäune sind eine intelligente Doppelnutzung für Ihr Grundstück. Sie dienen nicht nur als sicherer und moderner Sichtschutz, sondern produzieren dank beidseitig aktiver Zellen den ganzen Tag über Strom – besonders ertragreich in den Morgen- und Abendstunden, wenn die Sonne flach steht. Ideal für die Abgrenzung von Gewerbe- oder Agrarflächen.",
    tagline: "Ihre Grenze wird zum Kraftwerk.",
    techSpecs: [
      { icon: 'yield', label: 'Bis zu +25% Mehrertrag' },
      { icon: 'design', label: 'Sichtschutz & Design' },
      { icon: 'dual-use', label: 'Doppelnutzung der Fläche' },
    ]
  },
  {
    id: 'solar-tile',
    title: "Der unsichtbare Solardachziegel",
    category: "Ästhetik trifft Effizienz",
    description: "Für denkmalgeschützte Gebäude oder anspruchsvolle Architektur: Unsere Solardachziegel ersetzen herkömmliche Ziegel und integrieren sich nahtlos in Ihr Dach. Kompromisslose Optik bei starker Leistung.",
    imageUrl: "https://images.unsplash.com/photo-1599443313248-10b84d54a2a3?q=80&w=1974&auto=format&fit=crop",
    callToAction: "Design anfragen",
    aiInfo: "Solardachziegel sind die ästhetische Revolution für Ihr Dach. Sie ersetzen klassische Ziegel und fügen sich optisch perfekt in die Dachfläche ein, ohne als Solaranlage erkennbar zu sein. Damit erfüllen sie höchste Designansprüche und sind oft die einzige Lösung für denkmalgeschützte Gebäude, um saubere Energie zu erzeugen.",
    tagline: "Energieerzeugung in ihrer schönsten Form.",
     techSpecs: [
      { icon: 'design', label: 'Nahtlose Integration' },
      { icon: 'design', label: 'Ideal für Denkmalschutz' },
      { icon: 'yield', label: 'Hohe Witterungsbeständigkeit' },
    ]
  },
  {
    id: 'energy-facade',
    title: "Die transparente Energiefassade",
    category: "Gebäudeintegrierte PV (BIPV)",
    description: "Verwandeln Sie Fensterfronten und Glasfassaden in aktive Stromerzeuger. Unsere transparenten Solarmodule lassen Tageslicht herein und senken gleichzeitig Ihre Energiekosten. Die Zukunft der urbanen Architektur.",
    imageUrl: "https://images.unsplash.com/photo-1617585035213-a8685d6b3a0a?q=80&w=1964&auto=format&fit=crop",
    callToAction: "Mehr erfahren",
    aiInfo: "Mit gebäudeintegrierter Photovoltaik (BIPV) wird Ihre Fassade zum Kraftwerk. Transparente oder farbige Solarmodule können in die Gebäudehülle integriert werden, um Strom zu erzeugen, ohne die architektonische Vision zu beeinträchtigen. Sie bieten zudem Wärmedämmung und Witterungsschutz – ein multifunktionales Bauelement der Zukunft.",
    tagline: "Ihr Gebäude atmet Energie.",
    techSpecs: [
      { icon: 'design', label: 'Architektonische Freiheit' },
      { icon: 'yield', label: 'Wärme- & Schallschutz' },
      { icon: 'dual-use', label: 'Vertikale Stromerzeugung' },
    ]
  },
  {
    id: 'agri-pv',
    title: "Agri-PV: Vertikale Landwirtschaft",
    category: "Landwirtschaft & Energie",
    description: "Doppelte Ernte auf gleicher Fläche. Vertikal installierte, bifaziale Module ermöglichen die gleichzeitige landwirtschaftliche Nutzung und Stromproduktion, optimieren die Bewässerung und schützen Kulturen.",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop",
    callToAction: "Synergien prüfen",
    aiInfo: "Agri-Photovoltaik schafft eine Win-Win-Situation für Landwirtschaft und Energieerzeugung. Die hoch aufgeständerten Solarmodule ermöglichen die Bewirtschaftung der Flächen mit landwirtschaftlichen Maschinen, während sie gleichzeitig die Kulturen vor zu starker Sonneneinstrahlung, Hagel oder Dürre schützen. Das Ergebnis: stabile Ernten und eine zusätzliche, wetterunabhängige Einnahmequelle.",
    tagline: "Ernte & Energie im Einklang.",
    techSpecs: [
      { icon: 'dual-use', label: 'Land & Strom ernten' },
      { icon: 'yield', label: 'Schutz vor Wetterextremen' },
      { icon: 'yield', label: 'Stabile Zweiteinnahme' },
    ]
  },
];
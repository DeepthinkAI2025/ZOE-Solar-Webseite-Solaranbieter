// Typdefinition für PageHeroData (optional, für bessere Typisierung)
export type PageHeroData = Record<string, {
  title: string;
  subtitle: string;
  bgImage: string;
  ctaText?: string;
  ctaPage?: string;
  ctaAction?: string;
  stats?: { value: string; label: string }[];
  benefits?: { icon: string; text: string }[];
}>;

// Datenexport
export const pageHeroData: PageHeroData = {
  photovoltaik: {
    title: "Ein Partner für alle Energiefragen.",
    subtitle: "Wir sind mehr als nur ein Installateur – wir sind Ihr strategischer Partner, der die Zukunft Ihres Betriebs sichert, über den gesamten Lebenszyklus Ihrer Energie- und Gebäudetechnik.",
    bgImage: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=2070",
    ctaText: "Alle Leistungen entdecken",
    ctaPage: 'photovoltaik',
  },
  preise: {
    title: "Transparenz, die sich auszahlt.",
    subtitle: "Entdecken Sie unsere schlüsselfertigen Solarpakete zum Festpreis. Beste Technologie, erstklassiger Service – garantiert ohne versteckte Kosten.",
    bgImage: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=2070",
    ctaText: "Zu den Paketen springen",
    ctaPage: 'preise',
    stats: [
      { value: "0€", label: "Anzahlung bei Finanzierung" },
      { value: "100%", label: "Festpreis-Garantie" },
      { value: "5 J.", label: "Gewährleistung auf alles" }
    ],
  },
  // ... (weitere Seiten analog aus der Originaldatei übernehmen)
};
export interface GoogleReview {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export const googleReviews: GoogleReview[] = [
  {
    name: 'Peter S.',
    rating: 5,
    text: 'Von der ersten Beratung bis zur Inbetriebnahme unserer 750 kWp-Anlage lief alles wie am Schnürchen. Das Team von ZOE Solar ist kompetent, zuverlässig und hat uns eine Lösung geliefert, die unsere Erwartungen übertrifft. Absolut empfehlenswert!',
    date: 'August 2024',
  },
  {
    name: 'Sabine H.',
    rating: 5,
    text: 'Wir haben unseren Mitarbeiterparkplatz mit Solar-Carports und Ladesäulen ausstatten lassen. Ein voller Erfolg! Die Mitarbeiter sind begeistert und unser Image als nachhaltiger Arbeitgeber wurde enorm gestärkt.',
    date: 'Juli 2024',
  },
  {
    name: 'Frank L.',
    rating: 4,
    text: 'Gute Beratung und saubere Ausführung. Es gab eine kleine Verzögerung beim Netzanschluss, aber die Kommunikation war jederzeit transparent. Wir sind mit dem Ergebnis sehr zufrieden.',
    date: 'Juli 2024',
  },
  {
    name: 'Anonym',
    rating: 2,
    text: 'Die Anlage läuft, aber der Weg dahin war steinig. Die Kommunikation hätte besser sein können.',
    date: 'Juni 2024',
  },
  {
    name: 'Michael T.',
    rating: 5,
    text: 'Als Landwirt kann ich ZOE Solar uneingeschränkt empfehlen. Die Freiflächenanlage auf unserem Grenzertragsboden ist eine sichere, zweite Einnahmequelle für unseren Hof geworden.',
    date: 'Mai 2024',
  },
];

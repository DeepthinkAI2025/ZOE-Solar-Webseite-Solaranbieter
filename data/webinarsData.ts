export interface Webinar {
    slug: string;
    title: string;
    description: string;
    type: 'Aufzeichnung' | 'Live-Event';
    imageUrl: string;
    date: string; // Format: YYYY-MM-DD
    videoId?: string;
}

export const webinars: Webinar[] = [
    {
        slug: 'webinar-peak-shaving',
        title: 'Webinar: Peak Shaving mit Batteriespeichern',
        description: 'Sehen Sie in unserer Experten-Aufzeichnung, wie Sie mit intelligenten Speichern teure Lastspitzen kappen und Ihre Netzentgelte drastisch reduzieren können.',
        type: 'Aufzeichnung',
        imageUrl: 'https://images.unsplash.com/photo-1630045623827-73b3202058c1?q=80&w=2070&auto=format&fit=crop',
        date: '2024-08-20',
        videoId: '420-qW_H-kI'
    },
    {
        slug: 'webinar-agri-pv-zukunft',
        title: 'Webinar: Die Zukunft der Agri-PV',
        description: 'Diskussion mit führenden Experten über die Chancen der Agri-Photovoltaik für die Landwirtschaft, inklusive Praxisbeispielen und Wirtschaftlichkeitsanalysen.',
        type: 'Aufzeichnung',
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
        date: '2024-07-18',
        videoId: '420-qW_H-kI'
    },
    {
        slug: 'webinar-direktvermarktung-live',
        title: 'Live-Event: Q&A zur Direktvermarktung',
        description: 'Unser nächstes Live-Webinar: Stellen Sie unseren Experten Ihre Fragen zur Direktvermarktung von Solarstrom. Melden Sie sich jetzt kostenlos an. (Termin folgt)',
        type: 'Live-Event',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2134&auto=format&fit=crop',
        date: '2024-09-15',
    }
];
export interface CustomerOffer {
    id: string;
    date: string;
    amount: number;
    status: 'offen' | 'angenommen' | 'abgelehnt';
    pdfUrl: string;
}

export interface CustomerInvoice {
    id: string;
    date: string;
    amount: number;
    status: 'offen' | 'bezahlt' | 'überfällig';
    pdfUrl: string;
}

export interface ProjectHistoryEvent {
    date: string;
    event: string;
    description?: string;
}

export interface ProjectMessage {
    id: string;
    date: string;
    from: 'ZOE Solar' | 'Kunde';
    text: string;
}

export interface CustomerProject {
    id: string;
    name: string;
    status: 'Anfrage' | 'Planung' | 'Angebot' | 'In Umsetzung' | 'In Betrieb' | 'Abgeschlossen';
    power: string;
    startDate: string;
    offers: CustomerOffer[];
    invoices: CustomerInvoice[];
    history: ProjectHistoryEvent[];
    messages: ProjectMessage[];
}

export interface CustomerData {
    id: string;
    name: string;
    email: string;
    companyName: string;
    address: string;
    phone: string;
    projects: CustomerProject[];
}


export const mockCustomer: CustomerData = {
    id: 'cus_12345',
    name: 'Dr. Anna Schneider',
    email: 'kunde@test.de',
    companyName: 'Schneider Logistik GmbH',
    address: 'Industriestraße 5, 14482 Potsdam',
    phone: '+49 176 12345678',
    projects: [
        {
            id: 'proj_abc',
            name: 'Dachanlage Logistikzentrum Potsdam',
            status: 'In Betrieb',
            power: '750 kWp',
            startDate: '2023-05-10',
            offers: [
                { id: 'offer_1', date: '2023-04-15', amount: 650000, status: 'angenommen', pdfUrl: '#' }
            ],
            invoices: [
                { id: 'inv_1', date: '2023-05-20', amount: 325000, status: 'bezahlt', pdfUrl: '#' },
                { id: 'inv_2', date: '2023-07-30', amount: 325000, status: 'bezahlt', pdfUrl: '#' }
            ],
            history: [
                { date: '2023-08-01', event: 'Anlage in Betrieb genommen' },
                { date: '2023-07-15', event: 'Installation abgeschlossen' },
                { date: '2023-06-05', event: 'Installationsbeginn' },
                { date: '2023-04-20', event: 'Angebot angenommen' },
                { date: '2023-03-10', event: 'Anfrage eingegangen' },
            ],
            messages: [
                { id: 'msg_1', date: '2023-07-25', from: 'ZOE Solar', text: 'Guten Tag Frau Dr. Schneider, die Installation ist fast abgeschlossen. Wir planen die Inbetriebnahme für Anfang August. Passt Ihnen der 01.08.?' },
                { id: 'msg_2', date: '2023-07-26', from: 'Kunde', text: 'Hallo, ja der 1. August passt perfekt. Wir freuen uns!' }
            ]
        },
        {
            id: 'proj_def',
            name: 'Ladepark für Mitarbeiter',
            status: 'Angebot',
            power: '220 kW (20 Ladesäulen)',
            startDate: '2024-06-20',
            offers: [
                { id: 'offer_2', date: '2024-07-10', amount: 85000, status: 'offen', pdfUrl: '#' }
            ],
            invoices: [],
            history: [
                 { date: '2024-07-10', event: 'Angebot erstellt' },
                 { date: '2024-06-20', event: 'Anfrage für Ladepark gestellt' }
            ],
            messages: [
                 { id: 'msg_3', date: '2024-07-10', from: 'ZOE Solar', text: 'Sehr geehrte Frau Dr. Schneider, anbei das Angebot für Ihren neuen Mitarbeiter-Ladepark. Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.' }
            ]
        }
    ]
};

export const mockDemoCustomer: CustomerData = {
    id: 'cus_demo',
    name: 'Demo Benutzer',
    email: 'demo',
    companyName: 'Demo Firma GmbH',
    address: 'Testallee 1, 12345 Teststadt',
    phone: '+49 123 4567890',
    projects: [
        {
            id: 'proj_demo_1',
            name: 'Dachanlage Test-Logistik',
            status: 'In Betrieb',
            power: '500 kWp',
            startDate: '2023-11-20',
            offers: [
                { id: 'offer_demo_1', date: '2023-10-01', amount: 480000, status: 'angenommen', pdfUrl: '#' }
            ],
            invoices: [
                { id: 'inv_demo_1', date: '2023-10-15', amount: 240000, status: 'bezahlt', pdfUrl: '#' },
                { id: 'inv_demo_2', date: '2023-12-01', amount: 240000, status: 'bezahlt', pdfUrl: '#' }
            ],
            history: [
                { date: '2023-12-15', event: 'Anlage in Betrieb genommen' },
                { date: '2023-11-01', event: 'Installationsbeginn' },
                { date: '2023-10-05', event: 'Angebot angenommen' },
            ],
            messages: [
                { id: 'msg_demo_1', date: '2023-12-10', from: 'ZOE Solar', text: 'Hallo Demo-Benutzer, die Inbetriebnahme war erfolgreich. Alle Dokumente finden Sie hier im Portal.' }
            ]
        }
    ]
};
import React from 'react';

export interface DiyService {
    id: string;
    title: string;
    description: string;
    price: number;
    priceNote: string;
    isFeatured: boolean;
    icon: React.ReactNode;
}

export const diyServices: DiyService[] = [
    {
        id: 'all-in-one',
        title: "Komplettpaket",
        description: "Alle drei Services zum Vorteilspreis. Wir übernehmen den Netzanschluss, die Inbetriebnahme mit Protokoll und den finalen E-Check. Ihr Rundum-Sorglos-Paket für eine sichere und vorschriftsmäßige Anlage.",
        price: 1500,
        priceNote: 'Sie sparen 250 €',
        isFeatured: true,
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" })),
    },
    {
        id: 'netzanschluss',
        title: "Netzanschluss-Service",
        description: "Wir übernehmen die komplette Bürokratie für Sie. Von der Anmeldung beim Netzbetreiber bis zur finalen Zählersetzung – wir sorgen für einen reibungslosen und vorschriftsmäßigen Netzanschluss Ihrer selbstgebauten Anlage.",
        price: 350,
        priceNote: 'für Anlagen < 30 kWp',
        isFeatured: false,
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3v18" }), React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3C4.204 3 3 10.193 3 12c0 1.807 1.204 9 9 9s9-7.193 9-9c0-1.807-1.204-9-9-9z" })),
    },
    {
        id: 'inbetriebnahme',
        title: "Inbetriebnahme & Protokoll",
        description: "Sicherheit geht vor. Unsere zertifizierten Elektriker nehmen Ihre Anlage fachgerecht in Betrieb und erstellen das rechtlich erforderliche Inbetriebnahmeprotokoll nach VDE-Norm (E.8).",
        price: 900,
        priceNote: 'ab',
        isFeatured: false,
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
    },
    {
        id: 'e-check',
        title: "Anlagen-Check (E-Check)",
        description: "Lassen Sie Ihre Installation von einem Profi prüfen. Wir führen einen umfassenden E-Check durch und bestätigen die normgerechte Ausführung für Ihre Sicherheit und Versicherung.",
        price: 500,
        priceNote: 'Festpreis',
        isFeatured: false,
        icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" })),
    }
];
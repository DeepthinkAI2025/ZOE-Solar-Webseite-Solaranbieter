"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingPackages = void 0;
exports.pricingPackages = [
    // Private Packages
    {
        id: 'paket-eco',
        userType: 'private',
        name: 'Solarpaket Eco',
        target: 'Für preisbewusste Hausbesitzer',
        price: 14990,
        priceNote: 'inkl. 0% MwSt.',
        badge: 'Preis-Tipp',
        badgeColor: 'yellow',
        imageUrl: 'https://images.unsplash.com/photo-1599809275661-059c5b5321?q=80&w=1200&auto=format&fit=crop',
        specs: {
            modulesKwp: 6,
            storageKwh: 5,
        },
        includes: [
            'Komplette Planung & Anmeldung',
            'Hochwertige Unterkonstruktion',
            'Schlüsselfertige Installation',
            'Inbetriebnahme & Einweisung',
            '5 Jahre Gewährleistung',
        ],
        components: {
            module: 'Jinko Solar Tiger Neo 440Wp (14x)',
            inverter: 'GoodWe GW5K-ET Plus+',
            storage: 'BYD Battery-Box HVS 5.1',
        },
        componentLogos: [
            '/assets/logos/jinko-solar.png',
            '/assets/logos/goodwe.png',
            '/assets/logos/byd.png',
        ]
    },
    {
        id: 'paket-s',
        userType: 'private',
        name: 'Solarpaket S',
        target: 'Für Einfamilienhäuser',
        price: 18990,
        priceNote: 'inkl. 0% MwSt.',
        imageUrl: 'https://images.unsplash.com/photo-1588012885473-35076531b73f?q=80&w=1200&auto=format&fit=crop',
        specs: {
            modulesKwp: 8,
            storageKwh: 5,
        },
        includes: [
            'Komplette Planung & Anmeldung',
            'Hochwertige Unterkonstruktion',
            'Schlüsselfertige Installation durch ZOE-Experten',
            'Inbetriebnahme & Einweisung',
            '5 Jahre Gewährleistung auf alles',
        ],
        components: {
            module: 'Meyer Burger Black 400Wp (20x)',
            inverter: 'SMA Sunny Tripower 8.0',
            storage: 'BYD Battery-Box HVS 5.1',
        },
        componentLogos: [
            '/assets/logos/meyer-burger.png',
            '/assets/logos/sma.png',
            '/assets/logos/byd.png',
        ]
    },
    {
        id: 'paket-m',
        userType: 'private',
        name: 'Solarpaket M',
        target: 'Für große Dächer & hohen Verbrauch',
        price: 24990,
        priceNote: 'inkl. 0% MwSt.',
        badge: 'Beliebteste Wahl',
        badgeColor: 'green',
        imageUrl: 'https://images.unsplash.com/photo-1617462474252-a33758e5781a?q=80&w=1200&auto=format&fit=crop',
        specs: {
            modulesKwp: 12,
            storageKwh: 10,
            wallboxKw: 11,
        },
        includes: [
            'Komplette Planung & Anmeldung',
            'Hochwertige Unterkonstruktion',
            'Schlüsselfertige Installation durch ZOE-Experten',
            'Inbetriebnahme & Einweisung',
            '5 Jahre Gewährleistung auf alles',
        ],
        components: {
            module: 'Q-Cells Q.TRON BLK M-G2+ 430Wp (28x)',
            inverter: 'Fronius Symo GEN24 10.0 Plus',
            storage: 'BYD Battery-Box HVS 10.2',
            wallbox: 'Wallbox Pulsar Plus 11 kW',
        },
        componentLogos: [
            '/assets/logos/q-cells.png',
            '/assets/logos/fronius.png',
            '/assets/logos/byd.png',
            '/assets/logos/wallbox.png',
        ]
    },
    {
        id: 'paket-emobility-starter',
        userType: 'private',
        name: 'E-Mobilität Starter',
        target: 'Für die eigene Wallbox',
        price: 2250,
        priceNote: 'inkl. 0% MwSt.',
        imageUrl: 'https://images.unsplash.com/photo-1629828113880-7a877169d2a0?q=80&w=1200&auto=format&fit=crop',
        specs: {
            modulesKwp: 0,
            wallboxKw: 11,
        },
        includes: [
            'Intelligente Wallbox (11 kW)',
            'Standard-Installation & Anschluss',
            'Inbetriebnahme & Einweisung',
            '5 Jahre Gewährleistung',
        ],
        components: {
            module: 'Keine',
            inverter: 'Keiner',
            wallbox: 'Wallbox Pulsar Plus 11 kW',
        },
        componentLogos: [
            '/assets/logos/wallbox.png',
        ]
    },
    // Commercial Packages
    {
        id: 'gewerbe-eco',
        userType: 'commercial',
        name: 'Gewerbepaket Eco',
        target: 'Für den schnellen Return on Investment',
        price: 29900,
        priceNote: 'zzgl. 19% MwSt.',
        badge: 'Beste Amortisation',
        badgeColor: 'yellow',
        imageUrl: 'https://images.unsplash.com/photo-1562237332-2313d33a772b?q=80&w=1200&auto=format&fit=crop',
        specs: {
            modulesKwp: 25,
        },
        includes: [
            'Detaillierte Lastganganalyse',
            'Komplette Planung & Genehmigung',
            'Schlüsselfertige Installation',
            'Netzanschluss & Inbetriebnahme',
            '24/7 Anlagen-Monitoring',
        ],
        components: {
            module: 'JA Solar DeepBlue 4.0 Pro 440Wp',
            inverter: 'GoodWe GW25K-ET',
        },
        componentLogos: [
            '/assets/logos/ja-solar.png',
            '/assets/logos/goodwe.png',
        ]
    },
    {
        id: 'gewerbe-m',
        userType: 'commercial',
        name: 'Gewerbepaket M',
        target: 'Für Mittelstand & Gewerbehallen',
        price: 48500,
        priceNote: 'zzgl. 19% MwSt.',
        badge: 'Beliebteste Wahl',
        badgeColor: 'green',
        imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb122126a?q=80&w=1200&auto=format&fit=crop',
        specs: {
            modulesKwp: 30,
            storageKwh: 30,
        },
        includes: [
            'Detaillierte Lastganganalyse',
            'Komplette Planung & Genehmigung',
            'Schlüsselfertige Installation',
            'Netzanschluss & Inbetriebnahme',
            '24/7 Anlagen-Monitoring',
        ],
        components: {
            module: 'Q-Cells Q.PEAK DUO G11S 415Wp',
            inverter: 'SMA Sunny Tripower X 25kW',
            storage: 'sonnen (Industriespeicher LFP)',
        },
        componentLogos: [
            '/assets/logos/q-cells.png',
            '/assets/logos/sma.png',
            '/assets/logos/sonnen.png',
        ]
    },
    {
        id: 'gewerbe-l',
        userType: 'commercial',
        name: 'Gewerbepaket L',
        target: 'Für energieintensive Betriebe',
        price: 99900,
        priceNote: 'zzgl. 19% MwSt.',
        imageUrl: 'https://images.unsplash.com/photo-1508235281165-a88981b2484a?q=80&w=1200&auto=format&fit=crop',
        specs: {
            modulesKwp: 100,
            storageKwh: 50,
        },
        includes: [
            'Lastspitzenkappung-Analyse (Peak Shaving)',
            'Komplette Planung & Genehmigung',
            'Schlüsselfertige Installation',
            'Anbindung an Direktvermarktung',
            '24/7 Anlagen-Monitoring',
        ],
        components: {
            module: 'Jinko Solar Tiger Neo N-Type 575Wp',
            inverter: 'Fronius Tauro 100kW',
            storage: 'BYD (Industriespeicher LFP)',
        },
        componentLogos: [
            '/assets/logos/jinko-solar.png',
            '/assets/logos/fronius.png',
            '/assets/logos/byd.png',
        ]
    },
    {
        id: 'solarpark-s',
        userType: 'commercial',
        name: 'Solarpark S',
        target: 'Für Landbesitzer & Investoren (ca. 1 ha)',
        price: 850000,
        priceNote: 'zzgl. 19% MwSt., schlüsselfertig',
        imageUrl: 'https://images.unsplash.com/photo-1596371801258-a833216b251a?q=80&w=2070&auto=format&fit=crop',
        specs: {
            modulesKwp: 1000, // 1 MWp
        },
        includes: [
            'Komplette Projektentwicklung',
            'Einholung aller Genehmigungen (BImSchG)',
            'Schlüsselfertiger Bau inkl. Trafostation',
            'Anbindung an Direktvermarktung',
            'Technische Betriebsführung (O&M)',
        ],
        components: {
            module: 'Trina Solar Vertex N 690Wp',
            inverter: 'SMA Sunny Central / Zentralwechselrichter',
        },
        componentLogos: [
            '/assets/logos/trina-solar.png',
            '/assets/logos/sma.png',
        ]
    },
    {
        id: 'solarpark-m',
        userType: 'commercial',
        name: 'Solarpark M',
        target: 'Für große Flächen & Kommunen (ca. 5 ha)',
        price: 4200000,
        priceNote: 'zzgl. 19% MwSt., schlüsselfertig',
        badge: 'Maximale Pacht',
        badgeColor: 'blue',
        imageUrl: 'https://images.unsplash.com/photo-1599454100913-b903e12a4459?q=80&w=1932&auto=format&fit=crop',
        specs: {
            modulesKwp: 5000, // 5 MWp
        },
        includes: [
            'Komplette Projektentwicklung',
            'Einholung aller Genehmigungen (BImSchG)',
            'Schlüsselfertiger Bau inkl. Trafostation',
            'Anbindung an Direktvermarktung / PPA',
            'Technische Betriebsführung (O&M)',
        ],
        components: {
            module: 'LONGi Hi-MO 6 Explorer 580Wp',
            inverter: 'SMA Sunny Central / Zentralwechselrichter',
        },
        componentLogos: [
            '/assets/logos/longi-solar.png',
            '/assets/logos/sma.png',
        ]
    },
];

import { Manufacturer } from '../productTypes';

export const wallbox_chargers: Manufacturer = {
      slug: 'wallbox-chargers',
      name: 'Wallbox',
      logoUrl: '/assets/logos/wallbox.png',
      category: ['Ladestationen'],
      description:
        'Wallbox ist ein globales Unternehmen, das sich zum Ziel gesetzt hat, die Akzeptanz von Elektrofahrzeugen zu fördern, indem es intelligente und benutzerfreundliche Lade- und Energiemanagementlösungen entwickelt.',
      whyWeTrust: [
        'Innovatives und ausgezeichnetes Design.',
        'Intelligente Funktionen wie Power-Sharing und Solar-Überschussladen.',
        'Umfassendes Portfolio für den privaten und gewerblichen Bereich.'
      ],
      products: [
        {
          name: 'Pulsar Plus 11 kW',
          category: 'Ladestationen',
          manufacturerSlug: 'wallbox-chargers',
          imageUrl: 'https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=870&auto=format&fit',
          description:
            'Eine der kleinsten, leistungsstärksten und smartesten Wallboxen für zu Hause. Inklusive App-Steuerung und optionalem dynamischem Lastmanagement.',
          basePrice: 699,
          configurable: true,
          specs: {
            'Max. Ladeleistung': '11 kW (3-phasig)',
            Anschluss: 'Typ 2 (5m Kabel)',
            Konnektivität: 'WLAN, Bluetooth',
            Steuerung: 'App, Sprachsteuerung',
            Schutzart: 'IP54',
            'Förderfähig (KfW)': 'Ja'
          },
          keyFeatures: ['Sehr kompaktes Design', 'Smarte App-Steuerung', 'PV-Überschussladen möglich']
        },
        {
          name: 'Commander 2 22 kW',
          category: 'Ladestationen',
          manufacturerSlug: 'wallbox-chargers',
          imageUrl: 'https://images.unsplash.com/photo-1633333393122-2c63e2f5b80a?q=80&w=870&auto=format=fit',
          description:
            'Die ideale Ladelösung für Firmenparkplätze mit 7-Zoll-Touchscreen, RFID-Authentifizierung und einfacher Nutzerverwaltung über die MyWallbox-Plattform.',
          basePrice: 1250,
          configurable: true,
          specs: {
            'Max. Ladeleistung': '22 kW (3-phasig)',
            Anschluss: 'Typ 2 (5m Kabel)',
            Konnektivität: 'WLAN, Ethernet, Bluetooth',
            Authentifizierung: 'RFID, App, PIN',
            Display: '7" Touchscreen',
            Schutzart: 'IP54'
          },
          keyFeatures: ['Touchscreen-Bedienung', 'Integrierte Nutzerverwaltung', 'Ideal für Firmenparkplätze']
        }
      ]
    };

export default wallbox_chargers;

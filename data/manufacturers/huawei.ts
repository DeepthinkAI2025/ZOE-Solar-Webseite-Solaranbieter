import { Manufacturer } from '../productTypes';

export const huawei: Manufacturer = {
  slug: 'huawei',
  name: 'Huawei Digital Power',
  logoUrl: '/assets/logos/huawei.png',
  category: ['Speicher', 'Wechselrichter'],
  description:
    'Huawei FusionSolar verknüpft digitale Technologien mit intelligenter PV- und Speichertechnik und liefert skalierbare Lösungen von Residential bis Utility-Scale.',
  whyWeTrust: [
    'Skalierbare Energiespeichersysteme mit aktiver Sicherheit und 98 % Wirkungsgrad.',
    'Intelligentes Energiemanagement inklusive Cloud-Monitoring und Grid-Forming-Funktionen.',
    'Umfangreiches Service- und Garantieprogramm für kommerzielle sowie industrielle Anwendungen.'
  ],
  products: [
    {
      name: 'LUNA2000 Smart String ESS',
      category: 'Speicher',
      manufacturerSlug: 'huawei',
      imageUrl: 'https://solar.huawei.com/eu/products/for-home/luna2000',
      description:
        'Modulares LFP-Speichersystem mit Smart PCS und bis zu 3.870 kWh Kapazität für Gewerbe- und C&I-Anwendungen.',
      specs: {
        Kapazität: '100 – 3.870 kWh',
        Wechselrichter: 'LUNA2000-100KTL-M1',
        Wirkungsgrad: '98,4 %',
        Schutzklasse: 'IP66',
        Zyklenfestigkeit: '≥6.000 Zyklen'
      },
      keyFeatures: [
        'Modular kaskadierbares Speichersystem',
        'Intelligente Kühlung & Brandschutz integriert',
        'Kompatibel mit FusionSolar Smart PV Management'
      ],
      documents: [
        {
          type: 'datasheet',
          url: 'https://solar.huawei.com/admin/asset/v1/pro/view/ad91d6d343ee4f13860b641e8239e53c.pdf',
          title: 'Huawei LUNA2000-100KTL-M1 Datenblatt'
        },
        {
          type: 'datasheet',
          url: 'https://solar.huawei.com/download?p=%2F-%2Fmedia%2FSolarV4%2Fsolar-version2%2Fcommon%2Fprofessionals%2Fall-products%2Fci%2Fsmart-string-ess%2Fluna2000-200kwhg-2h1%2Fdatasheet%2Fluna2000-200kwhg-2h1-dtatsheet-20230310.pdf',
          title: 'Huawei LUNA2000-200KWH-2H1 Technical Data'
        },
        {
          type: 'installation_manual',
          url: 'https://solar.huawei.com/admin/asset/v1/pro/view/1d15e9e120be44748cef729b4dc8a351.pdf',
          title: 'Huawei LUNA2000 Smart String ESS – User Manual'
        },
        {
          type: 'other',
          url: 'https://solar.huawei.com/~/media/Solar/attachment/pdf/apac/service/download/HUAWEI_Warranty_and_Service_Conditions_for_Smart_PV_Products2.pdf',
          title: 'Huawei Smart PV Warranty'
        }
      ]
    },
    {
      name: 'Smart String Energy Storage 2.0 MWh',
      category: 'Speicher',
      manufacturerSlug: 'huawei',
      imageUrl: 'https://solar.huawei.com/eu/products/for-business/smart-string-energy-storage',
      description:
        'Containerisiertes Smart-String-ESS mit 2.032 kWh nutzbarer Energie und Hybrid-Kühlung für Utility-Scale-Projekte.',
      specs: {
        Kapazität: '2.032 kWh pro Container',
        Leistungsabgabe: 'bis 2.064 kW',
        Nennspannung: '1.250 V DC',
        Kühlung: 'Hybrid (Flüssig + Luft)',
        Kommunikation: 'Ethernet / Modbus TCP'
      },
      keyFeatures: [
        'Hybridgekühltes Batteriesystem mit Brandschutz',
        'Grid-forming-ready für neue Energiesysteme',
        'IP55 Schutz und Betrieb bis -30 °C'
      ],
      documents: [
        {
          type: 'datasheet',
          url: 'https://digitalpower.huawei.com/upload-pro/index/64fd034f35534588bf76e6a66815032c/Active-Safety-and-Grid-Forming-Accelerating-PV-ESS-as-the-Main-Energy-Source.pdf',
          title: 'Huawei Active Safety & Grid Forming Whitepaper'
        },
        {
          type: 'datasheet',
          url: 'https://solar.huawei.com/download?p=%2F-%2Fmedia%2FSolarV4%2Fsolar-version2%2Fcommon%2Fprofessionals%2Fall-products%2Fci%2Fsmart-string-ess%2Fluna2000-200kwhg-2h1%2Fdatasheet%2Fluna2000-200kwhg-2h1-dtatsheet-20230310.pdf',
          title: 'LUNA2000-200KWH-2H1 Datenblatt'
        },
        {
          type: 'installation_manual',
          url: 'https://solar.huawei.com/admin/asset/v1/pro/view/324114d5a1154060a1b398099f34d08b.pdf',
          title: 'LUNA2000-215 Smart String ESS – Installationshandbuch'
        },
        {
          type: 'other',
          url: 'https://solar.huawei.com/download?p=%2F-%2Fmedia%2FSolarV4%2Fsolar-version2%2Fcommon%2Fservice-support%2Fwarranty%2Fpdf%2Fc-i-ess-warranty-policy-oversea-v2-0.pdf',
          title: 'Huawei C&I ESS Warranty Policy'
        }
      ]
    }
  ]
};

export default huawei;

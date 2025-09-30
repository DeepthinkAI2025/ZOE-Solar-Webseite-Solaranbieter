import { Page } from '../types';

export const pageToPath: Record<Page, string> = {
  home: '/',
  photovoltaik: '/photovoltaik',
  'e-mobilitaet': '/e-mobilitaet',
  preise: '/preise',
  projekte: '/projekte',
  produkte: '/produkte',
  'hersteller-detail': '/produkte',
  'ueber-uns': '/ueber-uns',
  karriere: '/karriere',
  kontakt: '/kontakt',
  'service-photovoltaik': '/service/photovoltaik',
  'service-ladeparks': '/service/ladeparks',
  'service-speicher': '/service/speicher',
  nachhaltigkeit: '/nachhaltigkeit',
  aktuelles: '/aktuelles',
  'article-detail': '/aktuelles',
  anwendungsfaelle: '/anwendungsfaelle',
  'anwendungsfall-detail': '/anwendungsfaelle',
  login: '/login',
  dashboard: '/dashboard',
  empfehlungspraemie: '/empfehlungspraemie',
  'wissens-hub': '/wissens-hub',
  magazin: '/magazin',
  glossar: '/glossar',
  'guide-detail': '/wissen',
  innovations: '/innovationen',
  finanzierung: '/finanzierung',
  sonderaktionen: '/sonderaktionen',
  'faq-page': '/wissen/faq',
  'partner-werden': '/partner-werden',
  impressum: '/impressum',
  datenschutz: '/datenschutz',
  agb: '/agb',
  presse: '/presse',
  'wartung-service': '/wartung-service',
  garantieabwicklung: '/garantieabwicklung',
  'foerdermittel-check': '/foerdermittel/check',
  'diy-hub': '/diy-hub',
  'agri-pv': '/agri-pv',
  team: '/team',
  'warum-zoe-solar': '/warum-zoe-solar',
  'foerdermittel-kfw': '/foerdermittel/kfw',
  'foerdermittel-ibb': '/foerdermittel/ibb',
  'foerdermittel-bafa': '/foerdermittel/bafa',
  elektro: '/elektro',
  'service-anmeldung-pv': '/service/anmeldung-pv',
  'service-anmeldung-ladestationen': '/service/anmeldung-ladestationen',
  'service-netzanschluss': '/service/netzanschluss',
  'service-verteilerbau': '/service/verteilerbau',
  'service-zaehlerbau': '/service/zaehlerbau',
  standort: '/standort/:city',
  'agri-pv-brandenburg': '/agri-pv/brandenburg',
  'agri-pv-sachsen-anhalt': '/agri-pv/sachsen-anhalt',
  'agri-pv-niedersachsen': '/agri-pv/niedersachsen',
  'agri-pv-bayern': '/agri-pv/bayern',
  'agri-pv-nordrhein-westfalen': '/agri-pv/nordrhein-westfalen',
  'eigenheim': '/eigenheim',
  'eigenheim-kosten': '/eigenheim-kosten',
  'eigenheim-einfamilienhaus-kosten': '/eigenheim-einfamilienhaus-kosten',
  'eigenheim-planung': '/eigenheim-planung',
  'photovoltaik-gewerbe': '/photovoltaik-gewerbe',
  'photovoltaik-logistikzentren': '/photovoltaik-logistikzentren',
  'photovoltaik-einzelhandel': '/photovoltaik-einzelhandel',
  'photovoltaik-installation-dach': '/photovoltaik-installation-dach',
  'eigenheim-installation': '/eigenheim-installation',
  'seo-monitoring': '/seo-monitoring',
  fallstudien: '/fallstudien',
  'fallstudie-detail': '/fallstudie',
  'agri-pv-erfahrungen': '/agri-pv-erfahrungen',
  'mitarbeiter-login': '/mitarbeiter-login',
  'photovoltaik-rechner-gewerbe': '/photovoltaik-rechner-gewerbe',
  'photovoltaik-planung-gewerbe': '/photovoltaik-planung-gewerbe',
};

export const derivePageFromPath = (pathname: string): Page => {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/photovoltaik')) return 'photovoltaik';
  if (pathname.startsWith('/e-mobilitaet')) return 'e-mobilitaet';
  if (pathname.startsWith('/elektro')) return 'elektro';
  if (pathname.startsWith('/preise')) return 'preise';
  if (pathname.startsWith('/projekte')) return 'projekte';
  if (pathname.startsWith('/produkte')) {
    return pathname.split('/').filter(Boolean).length > 1 ? 'hersteller-detail' : 'produkte';
  }
  if (pathname.startsWith('/ueber-uns')) return 'ueber-uns';
  if (pathname.startsWith('/team')) return 'team';
  if (pathname.startsWith('/warum-zoe-solar')) return 'warum-zoe-solar';
  if (pathname.startsWith('/karriere')) return 'karriere';
  if (pathname.startsWith('/kontakt')) return 'kontakt';
  if (pathname.startsWith('/service/anmeldung-pv')) return 'service-anmeldung-pv';
  if (pathname.startsWith('/service/anmeldung-ladestationen')) return 'service-anmeldung-ladestationen';
  if (pathname.startsWith('/service/netzanschluss')) return 'service-netzanschluss';
  if (pathname.startsWith('/service/verteilerbau')) return 'service-verteilerbau';
  if (pathname.startsWith('/service/zaehlerbau')) return 'service-zaehlerbau';
  if (pathname.startsWith('/service/photovoltaik')) return 'service-photovoltaik';
  if (pathname.startsWith('/service/ladeparks')) return 'service-ladeparks';
  if (pathname.startsWith('/service/speicher')) return 'service-speicher';
  if (pathname.startsWith('/nachhaltigkeit')) return 'nachhaltigkeit';
  if (pathname.startsWith('/aktuelles')) {
    return pathname.split('/').filter(Boolean).length > 1 ? 'article-detail' : 'aktuelles';
  }
  if (pathname.startsWith('/anwendungsfaelle')) {
    return pathname.split('/').filter(Boolean).length > 1 ? 'anwendungsfall-detail' : 'anwendungsfaelle';
  }
  if (pathname.startsWith('/login')) return 'login';
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  if (pathname.startsWith('/empfehlungspraemie')) return 'empfehlungspraemie';
  if (pathname.startsWith('/wissen/guide')) return 'guide-detail';
  if (pathname.startsWith('/glossar')) return 'glossar';
  if (pathname.startsWith('/wissen/faq')) return 'faq-page';
  if (pathname.startsWith('/wissens-hub')) return 'wissens-hub';
  if (pathname.startsWith('/magazin')) return 'magazin';
  if (pathname.startsWith('/innovationen')) return 'innovations';
  if (pathname.startsWith('/finanzierung')) return 'finanzierung';
  if (pathname.startsWith('/sonderaktionen')) return 'sonderaktionen';
  if (pathname.startsWith('/partner-werden')) return 'partner-werden';
  if (pathname.startsWith('/impressum')) return 'impressum';
  if (pathname.startsWith('/datenschutz')) return 'datenschutz';
  if (pathname.startsWith('/agb')) return 'agb';
  if (pathname.startsWith('/presse')) return 'presse';
  if (pathname.startsWith('/wartung-service')) return 'wartung-service';
  if (pathname.startsWith('/garantieabwicklung')) return 'garantieabwicklung';
  if (pathname.startsWith('/foerdermittel/check')) return 'foerdermittel-check';
  if (pathname.startsWith('/foerdermittel/kfw')) return 'foerdermittel-kfw';
  if (pathname.startsWith('/foerdermittel/ibb')) return 'foerdermittel-ibb';
  if (pathname.startsWith('/foerdermittel/bafa')) return 'foerdermittel-bafa';
  if (pathname.startsWith('/diy-hub')) return 'diy-hub';
  if (pathname.startsWith('/standort/')) return 'standort';
  if (pathname.startsWith('/agri-pv/brandenburg')) return 'agri-pv-brandenburg';
  if (pathname.startsWith('/agri-pv/sachsen-anhalt')) return 'agri-pv-sachsen-anhalt';
  if (pathname.startsWith('/agri-pv/niedersachsen')) return 'agri-pv-niedersachsen';
  if (pathname.startsWith('/agri-pv/bayern')) return 'agri-pv-bayern';
  if (pathname.startsWith('/agri-pv/nordrhein-westfalen')) return 'agri-pv-nordrhein-westfalen';
  if (pathname.startsWith('/eigenheim')) {
    if (pathname === '/eigenheim-kosten') return 'eigenheim-kosten';
    if (pathname === '/eigenheim-einfamilienhaus-kosten') return 'eigenheim-einfamilienhaus-kosten';
    if (pathname === '/eigenheim-planung') return 'eigenheim-planung';
    if (pathname === '/eigenheim-installation') return 'eigenheim-installation';
    return 'eigenheim';
  }
  if (pathname.startsWith('/photovoltaik-gewerbe')) return 'photovoltaik-gewerbe';
  if (pathname.startsWith('/photovoltaik-industrie')) return 'photovoltaik-industrie';
  if (pathname.startsWith('/photovoltaik-landwirtschaft')) return 'photovoltaik-landwirtschaft';
  if (pathname.startsWith('/photovoltaik-gewerbegebaeude')) return 'photovoltaik-gewerbegebaeude';
  if (pathname.startsWith('/photovoltaik-logistikzentren')) return 'photovoltaik-logistikzentren';
  if (pathname.startsWith('/photovoltaik-einzelhandel')) return 'photovoltaik-einzelhandel';
  if (pathname.startsWith('/photovoltaik-installation-dach')) return 'photovoltaik-installation-dach';
  if (pathname.startsWith('/seo-monitoring')) return 'seo-monitoring';
  if (pathname.startsWith('/fallstudien')) return 'fallstudien';
  if (pathname.startsWith('/fallstudie/')) return 'fallstudie-detail';
  if (pathname.startsWith('/agri-pv-erfahrungen')) return 'agri-pv-erfahrungen';
  if (pathname.startsWith('/mitarbeiter-login')) return 'mitarbeiter-login';
  if (pathname.startsWith('/photovoltaik-rechner-gewerbe')) return 'photovoltaik-rechner-gewerbe';
  if (pathname.startsWith('/photovoltaik-planung-gewerbe')) return 'photovoltaik-planung-gewerbe';
  return 'home';
};

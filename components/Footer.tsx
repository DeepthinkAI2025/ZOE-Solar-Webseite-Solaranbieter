import React from 'react';
// FIX: Changed import to ../types to resolve circular dependency with App.tsx
import { Page } from '../types';

interface FooterProps {
  setPage: (page: Page) => void;
}

const FooterLink: React.FC<{ page: Page; setPage: (page: Page) => void; children: React.ReactNode; isExternal?: boolean; href?: string, action?: () => void }> = ({ page, setPage, children, isExternal, href, action }) => (
    <li>
        <a 
            onClick={(e) => {
                e.preventDefault();
                if (action) {
                    action();
                } else if (!isExternal) {
                    setPage(page);
                } else {
                    window.open(href, '_blank', 'noopener,noreferrer');
                }
            }} 
            href={isExternal ? href : '#'}
            className="text-slate-400 hover:text-green-400 transition-colors cursor-pointer"
        >
            {children}
        </a>
    </li>
);

const Footer: React.FC<FooterProps> = ({ setPage }) => {
  const handleScrollTo = (elementId: string) => {
    setPage('home');
    setTimeout(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleSelectArticle = (slug: string) => {
    document.dispatchEvent(new CustomEvent('select-article', { detail: slug }));
  };
  
  const handleSelectGuide = (slug: string) => {
    document.dispatchEvent(new CustomEvent('select-guide', { detail: slug }));
  };
    
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-6 py-16">
        {/* Top Section: Branding + Primary Links */}
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
            {/* Branding Column */}
            <div className="lg:col-span-3">
                <div className="text-4xl font-bold text-white mb-4 cursor-pointer inline-block" onClick={() => setPage('home')}>
                    ZOE <span className="text-green-500">Solar</span>
                </div>
                <p className="max-w-xs mb-6 text-slate-400">
                  Ihr Partner für gewerbliche Photovoltaik-Großanlagen.
                </p>
                <div className="flex items-center gap-5">
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-400 transition-colors" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>
                    <a href="https://www.xing.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-400 transition-colors" aria-label="Xing">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 12.833-7.905 13.663-.45.83.056 1.348.831 1.348.475 0 .666-.248.923-.666l3.54-6.096c.258-.418.167-.741-.248-.741-.396 0-.622.279-.832.667l-2.115 3.659c-.21.388-.083.666.248.666h.023c.331 0 .541-.278.751-.666l2.115-3.66c.21-.388.476-.831.972-.831.54 0 .792.324.925.66l3.54 6.096c.257.418.475.666.925.666.775 0 1.28-.518 1.332-1.348-.449-.83-7.904-13.663-7.904-13.663-.187-.335-.41-.66-.925-.66zM4.868 3.518c-.331 0-.541.278-.751.666L.86 11.28c-.21.388-.083.666.248.666h.023c.331 0 .541-.278.751-.666l3.255-7.096c.21-.388-.046-.831-.469-.831z"/>
                        </svg>
                    </a>
                </div>
            </div>
            
            {/* Link Columns */}
            <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-8 text-base">
                <div>
                    <h4 className="font-bold text-white uppercase tracking-wider mb-4">Leistungen</h4>
                    <ul className="space-y-4">
                        <FooterLink page="service-photovoltaik" setPage={setPage}>Aufdachanlagen</FooterLink>
                        <FooterLink page="agri-pv" setPage={setPage}>Agri-PV</FooterLink>
                        <FooterLink page="service-photovoltaik" setPage={setPage}>Solar-Carports</FooterLink>
                        <FooterLink page="service-speicher" setPage={setPage}>Speicherlösungen</FooterLink>
                        <FooterLink page="service-ladeparks" setPage={setPage}>Ladeparks</FooterLink>
                        <FooterLink page="innovations" setPage={setPage}>Innovative Technologien</FooterLink>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white uppercase tracking-wider mb-4">Unternehmen</h4>
                    <ul className="space-y-4">
                        <FooterLink page="ueber-uns" setPage={setPage}>Über Uns</FooterLink>
                        <FooterLink page="team" setPage={setPage}>Unser Team</FooterLink>
                        <FooterLink page="warum-zoe-solar" setPage={setPage}>Warum ZOE Solar</FooterLink>
                        <FooterLink page="projekte" setPage={setPage}>Referenzen</FooterLink>
                        <FooterLink page="nachhaltigkeit" setPage={setPage}>Nachhaltigkeit</FooterLink>
                        <FooterLink page="karriere" setPage={setPage}>Karriere</FooterLink>
                        <FooterLink page="presse" setPage={setPage}>Presse</FooterLink>
                        <FooterLink page="kontakt" setPage={setPage}>Kontakt</FooterLink>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white uppercase tracking-wider mb-4">Partner</h4>
                    <ul className="space-y-4">
                        <FooterLink page="partner-werden" setPage={setPage}>Partner werden</FooterLink>
                        <FooterLink page="empfehlungspraemie" setPage={setPage}>Empfehlungsprämie</FooterLink>
                        <FooterLink page="partner-werden" setPage={setPage}>Für Installateure</FooterLink>
                        <FooterLink page="partner-werden" setPage={setPage}>Für Energieberater</FooterLink>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-white uppercase tracking-wider mb-4">Support</h4>
                    <ul className="space-y-4">
                        <FooterLink page="faq-page" setPage={setPage}>Help Center (FAQ)</FooterLink>
                        <FooterLink page="diy-hub" setPage={setPage}>DIY-Hub</FooterLink>
                        <FooterLink page="dashboard" setPage={setPage}>Anlagen-Monitoring</FooterLink>
                        <FooterLink page="wartung-service" setPage={setPage}>Wartung & Service</FooterLink>
                        <FooterLink page="garantieabwicklung" setPage={setPage}>Garantieabwicklung</FooterLink>
                        <FooterLink page="home" setPage={setPage} action={() => document.dispatchEvent(new CustomEvent('open-chat'))}>Rückrufservice</FooterLink>
                    </ul>
                </div>
            </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-700 my-12" />
        
        {/* Bottom Section: Secondary Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-base">
            <div>
                <h4 className="font-bold text-white uppercase tracking-wider mb-4">Top-Anwendungsfälle</h4>
                <ul className="space-y-4">
                    <FooterLink page="anwendungsfaelle" setPage={setPage}>Logistik & Industrie</FooterLink>
                    <FooterLink page="anwendungsfaelle" setPage={setPage}>Handel & Gewerbe</FooterLink>
                    <FooterLink page="anwendungsfaelle" setPage={setPage}>Landwirtschaft</FooterLink>
                    <FooterLink page="anwendungsfaelle" setPage={setPage}>Immobilienwirtschaft</FooterLink>
                    <li className="pt-2"><a onClick={() => setPage('anwendungsfaelle')} className="text-slate-500 hover:text-green-400 transition-colors cursor-pointer underline">Mehr anzeigen</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white uppercase tracking-wider mb-4">Beliebte Technologien</h4>
                <ul className="space-y-4">
                    <FooterLink page="produkte" setPage={setPage}>Hochleistungsmodule</FooterLink>
                    <FooterLink page="produkte" setPage={setPage}>Intelligente Wechselrichter</FooterLink>
                    <FooterLink page="produkte" setPage={setPage}>LFP-Speicher</FooterLink>
                    <FooterLink page="produkte" setPage={setPage}>HPC-Ladesäulen</FooterLink>
                    <li className="pt-2"><a onClick={() => setPage('produkte')} className="text-slate-500 hover:text-green-400 transition-colors cursor-pointer underline">Mehr anzeigen</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white uppercase tracking-wider mb-4">Wissens-Hub</h4>
                <ul className="space-y-4">
                    <FooterLink page="guide-detail" setPage={setPage} action={() => handleSelectGuide('leitfaden-gewerbedach')}>Leitfaden Gewerbedach</FooterLink>
                    <FooterLink page="guide-detail" setPage={setPage} action={() => handleSelectGuide('direktvermarktung-solarstrom')}>Leitfaden Direktvermarktung</FooterLink>
                    <FooterLink page="guide-detail" setPage={setPage} action={() => handleSelectGuide('whitepaper-industrielle-batteriespeicher')}>Whitepaper Speicher</FooterLink>
                    <FooterLink page="glossar" setPage={setPage}>Solar-Glossar</FooterLink>
                    <li className="pt-2"><a onClick={() => setPage('wissens-hub')} className="text-slate-500 hover:text-green-400 transition-colors cursor-pointer underline">Mehr anzeigen</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white uppercase tracking-wider mb-4">Tools & Rechner</h4>
                <ul className="space-y-4">
                    <FooterLink page="home" setPage={() => handleScrollTo('rechner')}>Amortisationsrechner</FooterLink>
                    <FooterLink page="home" setPage={() => handleScrollTo('co2-rechner')}>CO₂-Rechner</FooterLink>
                    <FooterLink page="home" setPage={() => document.dispatchEvent(new CustomEvent('open-chat'))}>Potenzial-Analyse</FooterLink>
                    <FooterLink page="foerdermittel-check" setPage={setPage}>Fördermittel-Check</FooterLink>
                    <li className="pt-2"><a onClick={() => setPage('wissens-hub')} className="text-slate-500 hover:text-green-400 transition-colors cursor-pointer underline">Mehr anzeigen</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-white uppercase tracking-wider mb-4">Top-Artikel</h4>
                <ul className="space-y-4">
                    <FooterLink page="article-detail" setPage={setPage} action={() => handleSelectArticle('auszeichnung-bester-solaranbieter-2025')}>Testsieger 2025</FooterLink>
                    <FooterLink page="article-detail" setPage={setPage} action={() => handleSelectArticle('eeg-2024-aenderungen')}>EEG 2024 Änderungen</FooterLink>
                    <FooterLink page="article-detail" setPage={setPage} action={() => handleSelectArticle('fallstudie-logistikzentrum-berlin')}>Fallstudie Logistik</FooterLink>
                    <FooterLink page="article-detail" setPage={setPage} action={() => handleSelectArticle('agri-pv-landwirtschaft-energie')}>Agri-PV</FooterLink>
                    <li className="pt-2"><a onClick={() => setPage('aktuelles')} className="text-slate-500 hover:text-green-400 transition-colors cursor-pointer underline">Mehr anzeigen</a></li>
                </ul>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-center gap-6">
            <div className="flex gap-6 text-sm order-2 sm:order-1">
                <FooterLink page="impressum" setPage={setPage}>Impressum</FooterLink>
                <FooterLink page="agb" setPage={setPage}>AGB</FooterLink>
                <FooterLink page="datenschutz" setPage={setPage}>Datenschutz</FooterLink>
            </div>
            <p className="text-sm text-slate-500 order-1 sm:order-2">&copy; {new Date().getFullYear()} ZOE Solar GmbH. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

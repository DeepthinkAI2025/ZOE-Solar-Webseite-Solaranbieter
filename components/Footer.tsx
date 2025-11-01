import React, { useState } from 'react';
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

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
  isMobile?: boolean;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, children, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isMobile) {
    return (
      <div>
        <h4 className="font-bold text-white uppercase tracking-wider mb-4 text-sm">{title}</h4>
        <ul className="space-y-3 text-sm">
          {children}
        </ul>
      </div>
    );
  }

  return (
    <div className="border-b border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-white font-semibold hover:text-green-400 transition-colors"
      >
        <span className="uppercase tracking-wider text-sm">{title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
      {isOpen && (
        <ul className="pb-4 space-y-3 text-sm pl-4">
          {children}
        </ul>
      )}
    </div>
  );
};

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
                <p className="max-w-xs mb-6 text-slate-400 text-sm">
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
            
            {/* Link Columns - Desktop */}
            <div className="hidden lg:grid lg:col-span-9 grid-cols-4 gap-8 text-sm">
                <FooterSection title="Über ZOE Solar">
                    <FooterLink page="ueber-uns" setPage={setPage}>Über Uns</FooterLink>
                    <FooterLink page="team" setPage={setPage}>Unser Team</FooterLink>
                    <FooterLink page="warum-zoe-solar" setPage={setPage}>Warum ZOE Solar</FooterLink>
                    <FooterLink page="projekte" setPage={setPage}>Referenzen</FooterLink>
                    <FooterLink page="nachhaltigkeit" setPage={setPage}>Nachhaltigkeit</FooterLink>
                    <FooterLink page="karriere" setPage={setPage}>Karriere</FooterLink>
                    <FooterLink page="presse" setPage={setPage}>Presse</FooterLink>
                    <FooterLink page="kontakt" setPage={setPage}>Kontakt</FooterLink>
                </FooterSection>

                <FooterSection title="Produkte & Services">
                    <FooterLink page="service-photovoltaik" setPage={setPage}>Aufdachanlagen</FooterLink>
                    <FooterLink page="agri-pv" setPage={setPage}>Agri-PV</FooterLink>
                    <FooterLink page="service-photovoltaik" setPage={setPage}>Solar-Carports</FooterLink>
                    <FooterLink page="service-speicher" setPage={setPage}>Speicherlösungen</FooterLink>
                    <FooterLink page="service-ladeparks" setPage={setPage}>Ladeparks</FooterLink>
                    <FooterLink page="innovations" setPage={setPage}>Innovative Technologien</FooterLink>
                </FooterSection>

                <FooterSection title="Ressourcen">
                    <FooterLink page="faq-page" setPage={setPage}>Help Center (FAQ)</FooterLink>
                    <FooterLink page="diy-hub" setPage={setPage}>DIY-Hub</FooterLink>
                    <FooterLink page="dashboard" setPage={setPage}>Anlagen-Monitoring</FooterLink>
                    <FooterLink page="wartung-service" setPage={setPage}>Wartung & Service</FooterLink>
                    <FooterLink page="garantieabwicklung" setPage={setPage}>Garantieabwicklung</FooterLink>
                    <FooterLink page="glossar" setPage={setPage}>Solar-Glossar</FooterLink>
                </FooterSection>

                <FooterSection title="Kontakt & Legal">
                    <FooterLink page="kontakt" setPage={setPage}>Kontakt</FooterLink>
                    <FooterLink page="impressum" setPage={setPage}>Impressum</FooterLink>
                    <FooterLink page="agb" setPage={setPage}>AGB</FooterLink>
                    <FooterLink page="datenschutz" setPage={setPage}>Datenschutz</FooterLink>
                    <FooterLink page="partner-werden" setPage={setPage}>Partner werden</FooterLink>
                    <FooterLink page="mitarbeiter-login" setPage={setPage}>Mitarbeiter-Login</FooterLink>
                </FooterSection>
            </div>

            {/* Link Columns - Mobile Accordion */}
            <div className="lg:hidden lg:col-span-9 border-t border-slate-700">
                <FooterSection title="Über ZOE Solar" isMobile>
                    <FooterLink page="ueber-uns" setPage={setPage}>Über Uns</FooterLink>
                    <FooterLink page="team" setPage={setPage}>Unser Team</FooterLink>
                    <FooterLink page="warum-zoe-solar" setPage={setPage}>Warum ZOE Solar</FooterLink>
                    <FooterLink page="projekte" setPage={setPage}>Referenzen</FooterLink>
                    <FooterLink page="nachhaltigkeit" setPage={setPage}>Nachhaltigkeit</FooterLink>
                    <FooterLink page="karriere" setPage={setPage}>Karriere</FooterLink>
                    <FooterLink page="presse" setPage={setPage}>Presse</FooterLink>
                    <FooterLink page="kontakt" setPage={setPage}>Kontakt</FooterLink>
                </FooterSection>

                <FooterSection title="Produkte & Services" isMobile>
                    <FooterLink page="service-photovoltaik" setPage={setPage}>Aufdachanlagen</FooterLink>
                    <FooterLink page="agri-pv" setPage={setPage}>Agri-PV</FooterLink>
                    <FooterLink page="service-photovoltaik" setPage={setPage}>Solar-Carports</FooterLink>
                    <FooterLink page="service-speicher" setPage={setPage}>Speicherlösungen</FooterLink>
                    <FooterLink page="service-ladeparks" setPage={setPage}>Ladeparks</FooterLink>
                    <FooterLink page="innovations" setPage={setPage}>Innovative Technologien</FooterLink>
                </FooterSection>

                <FooterSection title="Ressourcen" isMobile>
                    <FooterLink page="faq-page" setPage={setPage}>Help Center (FAQ)</FooterLink>
                    <FooterLink page="diy-hub" setPage={setPage}>DIY-Hub</FooterLink>
                    <FooterLink page="dashboard" setPage={setPage}>Anlagen-Monitoring</FooterLink>
                    <FooterLink page="wartung-service" setPage={setPage}>Wartung & Service</FooterLink>
                    <FooterLink page="garantieabwicklung" setPage={setPage}>Garantieabwicklung</FooterLink>
                    <FooterLink page="glossar" setPage={setPage}>Solar-Glossar</FooterLink>
                </FooterSection>

                <FooterSection title="Kontakt & Legal" isMobile>
                    <FooterLink page="kontakt" setPage={setPage}>Kontakt</FooterLink>
                    <FooterLink page="impressum" setPage={setPage}>Impressum</FooterLink>
                    <FooterLink page="agb" setPage={setPage}>AGB</FooterLink>
                    <FooterLink page="datenschutz" setPage={setPage}>Datenschutz</FooterLink>
                    <FooterLink page="partner-werden" setPage={setPage}>Partner werden</FooterLink>
                    <FooterLink page="mitarbeiter-login" setPage={setPage}>Mitarbeiter-Login</FooterLink>
                </FooterSection>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-center gap-6">
            <div className="flex gap-6 text-xs sm:text-sm order-2 sm:order-1 flex-wrap justify-center">
                <FooterLink page="impressum" setPage={setPage}>Impressum</FooterLink>
                <FooterLink page="agb" setPage={setPage}>AGB</FooterLink>
                <FooterLink page="datenschutz" setPage={setPage}>Datenschutz</FooterLink>
                <FooterLink page="mitarbeiter-login" setPage={setPage}>Mitarbeiter-Login</FooterLink>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 order-1 sm:order-2">&copy; {new Date().getFullYear()} ZOE Solar GmbH. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

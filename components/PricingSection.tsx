import React from 'react';
import { Page } from '../types';

interface PricingSectionProps {
    setPage: (page: Page) => void;
    customerType?: 'private' | 'business';
}

const Icon: React.FC<{ name: string }> = ({ name }) => {
    const className = "h-12 w-12 text-primary-500 mb-6";
    const icons: { [key: string]: React.ReactNode } = {
        'packages': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>,
        'financing': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        'subsidies': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" /></svg>,
    };
    return icons[name] || null;
}

const InfoCard: React.FC<{ iconName: string; title: string; text: string; linkText: string; onClick: () => void; isFeatured?: boolean }> = ({ iconName, title, text, linkText, onClick, isFeatured }) => (
    <div className={`group relative p-8 rounded-2xl border-2 flex flex-col transition-all duration-300 ${isFeatured ? 'bg-slate-800 border-slate-700 text-white shadow-2xl lg:scale-105' : 'bg-white border-slate-200 hover:border-primary-300 hover:shadow-xl hover:-translate-y-2'}`}>
        <Icon name={iconName} />
        <h3 className={`text-2xl font-bold mb-3 ${isFeatured ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
        <p className={`flex-grow mb-6 ${isFeatured ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>
        <button onClick={onClick} className={`mt-auto font-bold group-hover:text-primary-700 transition-colors ${isFeatured ? 'text-primary-400 group-hover:text-white' : 'text-primary-600'}`}>
            {linkText} <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
        </button>
    </div>
);

const PricingSection: React.FC<PricingSectionProps> = ({ setPage, customerType = 'business' }) => {
    const getPricingContent = () => {
        if (customerType === 'private') {
            return {
                sectionTitle: "Transparent, fair & planbar für Ihr Zuhause.",
                sectionDescription: "Ihre Investition in die Zukunft soll sich lohnen – vom ersten Tag an. Entdecken Sie unsere Festpreis-Pakete speziell für Einfamilienhäuser und attraktive Finanzierungs- und Fördermöglichkeiten.",
                packages: {
                    title: "Haus-Pakete & Preise",
                    text: "Transparente Festpreise für Einfamilienhäuser. Finden Sie das passende Solarpaket für Ihr Zuhause – ohne versteckte Kosten."
                },
                financing: {
                    title: "0€ Anzahlung möglich",
                    text: "Starten Sie ohne Eigenkapital in die Energiewende. Dank KfW-Förderkredite übersteigt Ihre Ersparnis oft die monatliche Rate."
                },
                subsidies: {
                    title: "Fördermittel für Privat",
                    text: "Kein Geld verschenken. Wir navigieren Sie durch den Förderdschungel und finden die maximalen Zuschüsse für Ihr Einfamilienhaus."
                }
            };
        } else {
            return {
                sectionTitle: "Transparent, fair & planbar für Ihr Unternehmen.",
                sectionDescription: "Ihre Investition in die Zukunft soll sich lohnen – vom ersten Tag an. Entdecken Sie unsere Festpreis-Pakete für gewerbliche Solaranlagen und attraktive Finanzierungs- und Fördermöglichkeiten.",
                packages: {
                    title: "Gewerbe-Pakete & Preise",
                    text: "Transparente Festpreise für Unternehmen. Finden Sie das passende Solarpaket für Ihre Geschäftsräume – ohne versteckte Kosten."
                },
                financing: {
                    title: "Flexible Finanzierung",
                    text: "Optimieren Sie Ihre Liquidität. Dank attraktiver Förderkredite und Leasing-Optionen schonen Sie Ihr Working Capital."
                },
                subsidies: {
                    title: "Fördermittel für Gewerbe",
                    text: "Maximale Förderung sichern. Wir navigieren Sie durch den Förderdschungel und finden die optimalen Zuschüsse für Ihr Unternehmen."
                }
            };
        }
    };

    const content = getPricingContent();

    return (
        <section id="pricing-section" className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-16 max-w-4xl mx-auto">
                    <p className="font-bold text-green-600 uppercase tracking-wider">Preisgestaltung & Pakete</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">{content.sectionTitle}</h2>
                    <p className="text-lg text-slate-600 mt-4">
                        {content.sectionDescription}
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <InfoCard
                        iconName="packages"
                        title={content.packages.title}
                        text={content.packages.text}
                        linkText="Zu den Paketen"
                        onClick={() => setPage('preise')}
                    />
                    <InfoCard
                        iconName="financing"
                        title={content.financing.title}
                        text={content.financing.text}
                        linkText="Mehr zur Finanzierung"
                        onClick={() => setPage('finanzierung')}
                        isFeatured={true}
                    />
                     <InfoCard
                        iconName="subsidies"
                        title={content.subsidies.title}
                        text={content.subsidies.text}
                        linkText="Jetzt Förderung prüfen"
                        onClick={() => setPage('foerdermittel-check')}
                    />
                </div>
            </div>
        </section>
    );
};

export default PricingSection;

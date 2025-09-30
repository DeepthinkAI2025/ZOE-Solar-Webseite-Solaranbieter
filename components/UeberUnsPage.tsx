import React from 'react';
import { Page } from '../types';
import ProblemSolution from '../components/ProblemSolution';

const teamMembers = [
    { name: 'Jeremy Schulze', role: 'Gründer & Geschäftsführer', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Erika Mustermann', role: 'Leitung Projektplanung', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Klaus Kleber', role: 'Leitender Ingenieur', imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop' },
];

const values = [
    {
        icon: 'idea',
        problemTitle: 'Gefangen im System',
        problemDescription: 'Anbieter sind oft an wenige Marken gebunden. Sie erhalten nicht die beste Technologie, sondern die profitabelste für den Verkäufer.',
        solutionTitle: 'Herstellerunabhängig & Technologieführend',
        solutionDescription: 'Unsere Experten analysieren kontinuierlich den globalen Markt, um die leistungsstärksten, langlebigsten und wirtschaftlichsten Komponenten für Ihr spezifisches Projekt auszuwählen. Das bedeutet für Sie: maximale Energieausbeute und eine zukunftssichere Investition.',
    },
    {
        icon: 'team',
        problemTitle: 'Unklare Verantwortung',
        problemDescription: 'Die Installation wird an anonyme Subunternehmer vergeben. Mangelnde Kontrolle und Qualitätsrisiken sind die Folge.',
        solutionTitle: 'Eigenes, zertifiziertes Expertenteam',
        solutionDescription: 'Bei ZOE Solar setzen wir ausschließlich auf unsere eigenen, festangestellten und IHK-zertifizierten Fachkräfte. Sie haben immer einen direkten Ansprechpartner und können sich auf höchste Qualitätsstandards verlassen.',
    },
    {
        icon: 'partner',
        problemTitle: 'Komplexität & Aufwand',
        problemDescription: 'Die Koordination von Netzbetreibern, Genehmigungsbehörden und Lieferanten kann für Sie als Unternehmer zu einer enormen Belastung werden.',
        solutionTitle: 'Alles aus einer Hand – Ihr strategischer Partner',
        solutionDescription: 'Wir nehmen Ihnen den gesamten Prozess ab. Von der ersten Potenzialanalyse über die Planung, die Einholung aller Genehmigungen bis zur schlüsselfertigen Installation und Wartung. Wir steuern den Prozess effizient und stressfrei für Sie.',
    }
];

const stats = [
    { value: '> 150 MWp', label: 'Installierte Leistung' },
    { value: '> 85.000 t', label: 'CO₂ Einsparung pro Jahr' },
    { value: '> 50.000', label: 'Versorgte Haushalte (äquiv.)' },
];

const Icon: React.FC<{ name: string }> = ({ name }) => {
    const className = 'w-16 h-16 text-green-600 bg-green-50 p-3 rounded-full';
    const strokeWidth = 1.5;
    
    const icons: { [key: string]: React.ReactNode } = {
        idea: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.255 0-2.42-.157-3.548-.437m14.596 0c-1.128.28-2.293.437-3.548.437a7.5 7.5 0 01-7.5 0" /></svg>,
        team: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 0110.5 9.75v-.75a3.375 3.375 0 013.375-3.375s-1.543.425-2.25 1.5c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75M6.375 12v.75a3.375 3.375 0 01-3.375 3.375c-1.386 0-2.595-.57-3.375-1.5m15.75-3.375c.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75M9 12.75h6" /></svg>,
        partner: <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662v4.286a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7v-4.286zM12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>,
    };
    return icons[name] || null;
};

interface UeberUnsPageProps {
  setPage: (page: Page) => void;
}

const UeberUnsPage: React.FC<UeberUnsPageProps> = ({ setPage }) => {
    return (
        <div className="bg-white">
            {/* Mission Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Unsere Mission: <span className="text-green-600">Ihr strategischer Partner für die Energiewende.</span></h2>
                    <p className="text-lg text-slate-600 mt-6">
                        ZOE Solar wurde aus der Überzeugung gegründet, dass die Zukunft der Energieversorgung dezentral, erneuerbar und wirtschaftlich sein muss. Wir sind mehr als nur ein Installationsbetrieb – wir begleiten den deutschen Mittelstand auf dem Weg in eine profitable und unabhängige Energiezukunft.
                    </p>
                </div>
            </section>
            
            {/* The ZOE Solar Difference */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900">Der ZOE Solar Unterschied</h2>
                        <p className="text-lg text-slate-600 mt-4">Entdecken Sie die drei Säulen, die den Erfolg Ihres Projekts garantieren und uns vom Wettbewerb abheben.</p>
                    </div>
                    <div className="space-y-12">
                        {values.map((value, index) => (
                            <ProblemSolution 
                                key={index}
                                icon={<Icon name={value.icon} />}
                                problemTitle={value.problemTitle}
                                problemDescription={value.problemDescription}
                                solutionTitle={value.solutionTitle}
                                solutionDescription={value.solutionDescription}
                            />
                        ))}
                    </div>
                </div>
            </section>

             {/* Team Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                         <h2 className="text-4xl font-bold text-slate-900">Unser Kernteam</h2>
                         <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                            Erfahrung, Leidenschaft und Kompetenz für Ihr Projekt.
                         </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        {teamMembers.map(member => (
                            <div key={member.name} className="text-center">
                                <img src={member.imageUrl} alt={member.name} loading="lazy" decoding="async" className="w-40 h-40 rounded-full object-cover mx-auto mb-4 shadow-lg"/>
                                <h4 className="font-bold text-slate-800 text-lg">{member.name}</h4>
                                <p className="text-slate-500">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Sustainability Section */}
            <section className="py-20 bg-slate-800 text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Unser Beitrag in Zahlen</h2>
                        <p className="text-slate-300 mt-2">Gemeinsam mit unseren Kunden haben wir bereits viel erreicht.</p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                        {stats.map(stat => (
                            <div key={stat.label} className="bg-slate-700 p-8 rounded-lg">
                                <p className="text-4xl md:text-5xl font-bold text-green-400">{stat.value}</p>
                                <p className="text-slate-300 mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UeberUnsPage;
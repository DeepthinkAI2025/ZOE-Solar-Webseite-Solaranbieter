import React from 'react';
import { CustomerData } from '../../data/customerData';
import { DashboardView } from '../../pages/DashboardPage';

interface DashboardOverviewProps {
    user: CustomerData;
    setActiveView: (view: DashboardView) => void;
}

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex items-center gap-4">
        <div className="bg-green-100 text-green-600 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user, setActiveView }) => {
    const openProject = user.projects.find(p => p.status === 'Angebot');
    const activeProject = user.projects.find(p => p.status === 'In Betrieb' || p.status === 'In Umsetzung');
    const totalPower = user.projects
        .filter(p => p.status === 'In Betrieb')
        .reduce((sum, p) => sum + (parseFloat(p.power) || 0), 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-slate-800">Willkommen zurück,</h1>
                <p className="text-4xl font-bold text-green-600">{user.name}!</p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <StatCard 
                    label="Aktive Projekte"
                    value={user.projects.filter(p => p.status !== 'Abgeschlossen').length.toString()}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                 />
                 <StatCard 
                    label="Gesamtleistung"
                    value={`${totalPower.toLocaleString('de-DE')} kWp`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                 />
                 <StatCard 
                    label="Offene Angebote"
                    value={user.projects.filter(p => p.offers.some(o => o.status === 'offen')).length.toString()}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                 />
            </div>
            
            {/* Actionable Items */}
            <div className="space-y-6">
                {openProject && (
                    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Sie haben ein neues Angebot!</h2>
                            <p className="text-slate-600 mt-1">Ihr Projekt "{openProject.name}" wartet auf Ihre Entscheidung.</p>
                        </div>
                        <button 
                            onClick={() => setActiveView('projects')} 
                            className="bg-green-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            Angebot prüfen
                        </button>
                    </div>
                )}
                {activeProject && (
                     <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Ihr aktives Projekt: {activeProject.name}</h2>
                            <p className="text-slate-600 mt-1">Aktueller Status: <span className="font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{activeProject.status}</span>.</p>
                        </div>
                        <button 
                            onClick={() => setActiveView('projects')} 
                            className="bg-slate-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-slate-700 transition-all duration-300 shadow-md transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                            Zum Projekt
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardOverview;

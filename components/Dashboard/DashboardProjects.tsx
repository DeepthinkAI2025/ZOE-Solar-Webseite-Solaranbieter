import React, { useState, useEffect } from 'react';
import { CustomerProject, CustomerOffer, CustomerInvoice, ProjectHistoryEvent, ProjectMessage, CustomerData } from '../../data/customerData';

const StatusBadge: React.FC<{ status: CustomerProject['status'] }> = ({ status }) => {
    const baseClass = "px-2.5 py-1 text-xs font-semibold rounded-full";
    const colors = {
        'Anfrage': 'bg-slate-200 text-slate-800',
        'Planung': 'bg-blue-100 text-blue-800',
        'Angebot': 'bg-yellow-100 text-yellow-800',
        'In Umsetzung': 'bg-indigo-100 text-indigo-800',
        'In Betrieb': 'bg-green-100 text-green-800',
        'Abgeschlossen': 'bg-gray-100 text-gray-800',
    };
    return <span className={`${baseClass} ${colors[status]}`}>{status}</span>;
};

const MessagesTab: React.FC<{ messages: ProjectMessage[] }> = ({ messages }) => {
    return (
        <div className="space-y-4">
            {messages.length === 0 ? <p className="text-slate-500">Keine Nachrichten für dieses Projekt.</p> :
            messages.map(msg => (
                <div key={msg.id} className={`p-4 rounded-lg w-full sm:w-4/5 ${msg.from === 'Kunde' ? 'bg-green-50 ml-auto' : 'bg-slate-50'}`}>
                    <div className="flex justify-between items-baseline mb-1">
                        <p className="font-bold text-slate-800 text-sm">{msg.from}</p>
                        <time className="text-xs text-slate-400">{msg.date}</time>
                    </div>
                    <p className="text-slate-700 text-sm">{msg.text}</p>
                </div>
            ))}
        </div>
    );
};


const ProjectDetailTabs: React.FC<{ project: CustomerProject, onOfferAccept: (projectId: string, offerId: string) => void, onInvoicePay: (projectId: string, invoiceId: string) => void }> = ({ project, onOfferAccept, onInvoicePay }) => {
    const [activeTab, setActiveTab] = useState('offers');
    
    useEffect(() => {
        if (project.status === 'Anfrage') setActiveTab('messages');
        else if (project.status === 'Angebot') setActiveTab('offers');
        else if (project.status === 'In Umsetzung' || project.status === 'In Betrieb') setActiveTab('history');
        else setActiveTab('offers');
    }, [project.status]);

    return (
        <div>
            <div className="border-b border-slate-200 mb-4">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    <button onClick={() => setActiveTab('offers')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'offers' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Angebote</button>
                    <button onClick={() => setActiveTab('invoices')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'invoices' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Rechnungen</button>
                    <button onClick={() => setActiveTab('history')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Verlauf</button>
                    <button onClick={() => setActiveTab('messages')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'messages' ? 'border-green-500 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Nachrichten</button>
                </nav>
            </div>
            <div>
                {activeTab === 'offers' && <OffersTab offers={project.offers} onAccept={(offerId) => onOfferAccept(project.id, offerId)} />}
                {activeTab === 'invoices' && <InvoicesTab invoices={project.invoices} onPay={(invoiceId) => onInvoicePay(project.id, invoiceId)} />}
                {activeTab === 'history' && <HistoryTab history={project.history} />}
                {activeTab === 'messages' && <MessagesTab messages={project.messages} />}
            </div>
        </div>
    );
};

const OffersTab: React.FC<{ offers: CustomerOffer[], onAccept: (offerId: string) => void }> = ({ offers, onAccept }) => (
    <div className="space-y-3">
        {offers.length === 0 ? <p className="text-slate-500">Für dieses Projekt liegen keine Angebote vor.</p> :
        offers.map(offer => (
            <div key={offer.id} className="bg-slate-50 p-4 rounded-md flex justify-between items-center">
                <div>
                    <p className="font-semibold text-slate-800">Angebot vom {offer.date}</p>
                    <p className="text-slate-600">{offer.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
                </div>
                {offer.status === 'offen' && <button onClick={() => onAccept(offer.id)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Annehmen</button>}
                {offer.status === 'angenommen' && <span className="font-semibold text-green-700">Angenommen</span>}
            </div>
        ))}
    </div>
);

const InvoicesTab: React.FC<{ invoices: CustomerInvoice[], onPay: (invoiceId: string) => void }> = ({ invoices, onPay }) => (
     <div className="space-y-3">
        {invoices.length === 0 ? <p className="text-slate-500">Für dieses Projekt liegen keine Rechnungen vor.</p> :
        invoices.map(invoice => (
            <div key={invoice.id} className="bg-slate-50 p-4 rounded-md flex justify-between items-center">
                <div>
                    <p className="font-semibold text-slate-800">Rechnung vom {invoice.date}</p>
                    <p className="text-slate-600">{invoice.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
                </div>
                {invoice.status === 'offen' && <button onClick={() => onPay(invoice.id)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Jetzt bezahlen</button>}
                {invoice.status === 'bezahlt' && <span className="font-semibold text-green-700">Bezahlt</span>}
            </div>
        ))}
    </div>
);

const HistoryTab: React.FC<{ history: ProjectHistoryEvent[] }> = ({ history }) => (
    <ol className="relative border-l border-slate-200">                  
        {history.map((item, index) => (
            <li key={index} className="mb-6 ml-6">            
                <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-900">{item.event}</h3>
                <time className="block mb-2 text-sm font-normal leading-none text-slate-400">{item.date}</time>
            </li>
        ))}
    </ol>
);

interface DashboardProjectsProps {
    user: CustomerData;
}


const DashboardProjects: React.FC<DashboardProjectsProps> = ({ user }) => {
    const [projects, setProjects] = useState(user.projects);
    const [openProjectId, setOpenProjectId] = useState<string | null>(projects.find(p => p.status === 'Anfrage' || p.status === 'Angebot')?.id || projects[0]?.id || null);

    const handleAcceptOffer = (projectId: string, offerId: string) => {
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === projectId) {
                const newOffers = p.offers.map(o => o.id === offerId ? { ...o, status: 'angenommen' as const } : o);
                return { ...p, offers: newOffers, status: 'In Umsetzung' as const };
            }
            return p;
        }));
        alert(`Angebot für Projekt ${projectId} angenommen!`);
    };
    
    const handlePayInvoice = (projectId: string, invoiceId: string) => {
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === projectId) {
                const newInvoices = p.invoices.map(i => i.id === invoiceId ? { ...i, status: 'bezahlt' as const } : i);
                return { ...p, invoices: newInvoices };
            }
            return p;
        }));
        alert(`Rechnung für Projekt ${projectId} bezahlt!`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Meine Projekte</h1>
            <div className="space-y-4">
                {projects.map(project => (
                    <div key={project.id} className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                        <button 
                            onClick={() => setOpenProjectId(openProjectId === project.id ? null : project.id)} 
                            className="w-full p-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                            aria-expanded={openProjectId === project.id}
                        >
                           <div className="flex items-center gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">{project.name}</h2>
                                    <p className="text-sm text-slate-500">{project.power} | Gestartet: {project.startDate}</p>
                                </div>
                           </div>
                           <div className="flex items-center gap-4">
                               <StatusBadge status={project.status} />
                               <svg className={`w-6 h-6 text-slate-500 transform transition-transform ${openProjectId === project.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                           </div>
                        </button>
                        <div className={`transition-all duration-500 ease-in-out ${openProjectId === project.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-6 border-t border-slate-200">
                                <ProjectDetailTabs project={project} onOfferAccept={handleAcceptOffer} onInvoicePay={handlePayInvoice} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default DashboardProjects;

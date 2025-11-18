import React from 'react';
import { DashboardView } from '../../pages/DashboardPage';

interface DashboardSidebarProps {
    activeView: DashboardView;
    setActiveView: (view: DashboardView) => void;
}

const OverviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ProjectsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const NewInquiryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;


const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'overview', label: 'Übersicht', icon: <OverviewIcon /> },
        { id: 'projects', label: 'Meine Projekte', icon: <ProjectsIcon /> },
        { id: 'profile', label: 'Profil', icon: <ProfileIcon /> },
        { id: 'docs', label: 'Dokumentation', icon: <DocsIcon /> },
        { id: 'review', label: 'Bewertung abgeben', icon: <StarIcon /> }
    ];

    const openChat = () => {
      document.dispatchEvent(new CustomEvent('open-chat'));
    };

    return (
        <aside className="lg:w-64 xl:w-72 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
                <nav className="space-y-1">
                    {navItems.map(item => (
                         <button
                            key={item.id}
                            onClick={() => setActiveView(item.id as DashboardView)}
                            className={`w-full flex items-center gap-4 p-3 rounded-md text-left font-semibold transition-colors duration-200 ${
                                activeView === item.id 
                                ? 'bg-green-100 text-green-800'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="border-t border-slate-200 my-4"></div>

                <button
                    onClick={openChat}
                    className="w-full flex items-center gap-4 p-3 rounded-md text-left font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200"
                >
                    <NewInquiryIcon />
                    <span>Neue Anfrage</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
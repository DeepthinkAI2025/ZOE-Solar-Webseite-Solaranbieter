import React, { useState, useEffect } from 'react';
import { CustomerData } from '../data/customerData';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';
import DashboardOverview from '../components/Dashboard/DashboardOverview';
import DashboardProjects from '../components/Dashboard/DashboardProjects';
import DashboardProfile from '../components/Dashboard/DashboardProfile';
import DashboardReview from '../components/Dashboard/DashboardReview';

export type DashboardView = 'overview' | 'projects' | 'profile' | 'messages' | 'new_inquiry' | 'review';

interface DashboardPageProps {
    user: CustomerData;
    message?: string | null;
    clearMessage?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, message, clearMessage }) => {
    const [activeView, setActiveView] = useState<DashboardView>('overview');

    useEffect(() => {
        if (message && clearMessage) {
            const timer = setTimeout(() => {
                clearMessage();
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [message, clearMessage]);

    const renderView = () => {
        switch(activeView) {
            case 'projects':
                return <DashboardProjects user={user} />;
            case 'profile':
                return <DashboardProfile user={user} />;
            case 'review':
                return <DashboardReview />;
            case 'overview':
            default:
                return <DashboardOverview user={user} setActiveView={setActiveView} />;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-6 py-12 lg:py-16">
                 {message && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-8 shadow-md animate-fade-in" role="alert">
                        <p className="font-bold">Erfolg!</p>
                        <p>{message}</p>
                    </div>
                )}
                <div className="lg:flex lg:gap-8 xl:gap-12">
                    <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
                    <main className="flex-1 mt-8 lg:mt-0">
                        {renderView()}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;

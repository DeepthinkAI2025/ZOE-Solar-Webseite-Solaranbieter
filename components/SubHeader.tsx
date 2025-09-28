import React from 'react';
import { Page } from '../types';

interface NavItem {
    id: string;
    title: string;
    page: Page | string; // page can be a slug for detail pages
}

interface SubHeaderProps {
    navItems: NavItem[];
    activeItemId: string;
    onItemClick: (id: string, page: Page | string) => void;
    bannerHeight: number;
    headerHeight: number;
}

const SubHeader: React.FC<SubHeaderProps> = ({ navItems, activeItemId, onItemClick, bannerHeight, headerHeight }) => {
    return (
        <div 
            className="sticky z-40 bg-white shadow-md border-b border-slate-200"
            style={{ top: `${bannerHeight + headerHeight}px` }}
        >
            <div className="container mx-auto px-6">
                <nav className="flex items-center gap-6 -mb-px overflow-x-auto hide-scrollbar">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onItemClick(item.id, item.page)}
                            className={`py-4 px-1 border-b-4 font-semibold text-sm whitespace-nowrap transition-colors duration-200 ${
                                activeItemId === item.id
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                            }`}
                            aria-current={activeItemId === item.id}
                        >
                            {item.title}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default SubHeader;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Page } from '../types';

interface BreadcrumbItem {
  label: string;
  page?: Page;
  href?: string;
  path?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  setPage?: (page: Page) => void;
  variant?: 'default' | 'hero';
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, setPage, variant = 'default', className = '' }) => {
  const location = useLocation();

  // Default breadcrumb logic based on current path
  const getDefaultBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Startseite', path: '/' }
    ];

    // Map common routes to readable labels
    const routeLabels: { [key: string]: string } = {
      'photovoltaik': 'Photovoltaik',
      'speicherloesungen': 'Speicherlösungen',
      'elektro': 'Elektrotechnik',
      'e-mobilitaet': 'E-Mobilität',
      'anwendungsfaelle': 'Anwendungsfälle',
      'agri-pv': 'Agri-PV',
      'preise': 'Preise',
      'referenzen': 'Referenzen',
      'kontakt': 'Kontakt',
      'ueber-uns': 'Über uns',
      'karriere': 'Karriere',
      'news': 'News',
      'blog': 'Blog',
      'faq': 'FAQ',
      'downloads': 'Downloads',
      'impressum': 'Impressum',
      'datenschutz': 'Datenschutz',
      'agb': 'AGB'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const isLast = index === pathSegments.length - 1;

      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || getDefaultBreadcrumbs();

  if (variant === 'hero') {
    return (
      <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm mb-6 ${className}`}>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.path || item.href || index}>
            {index > 0 && (
              <svg
                className="w-4 h-4 text-slate-400 mx-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {item.isActive ? (
              <span className="text-slate-300 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : item.path ? (
              <Link
                to={item.path}
                className="text-slate-400 hover:text-green-400 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : item.page && setPage ? (
              <button
                onClick={() => setPage(item.page!)}
                className="text-slate-400 hover:text-green-400 transition-colors duration-200"
              >
                {item.label}
              </button>
            ) : item.href ? (
              <a
                href={item.href}
                className="text-slate-400 hover:text-green-400 transition-colors duration-200"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-slate-300 font-medium">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // Default variant
  return (
    <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {item.page && setPage ? (
              <button
                onClick={() => setPage(item.page!)}
                className="hover:text-green-600 transition-colors"
              >
                {item.label}
              </button>
            ) : item.href ? (
              <a href={item.href} className="hover:text-green-600 transition-colors">
                {item.label}
              </a>
            ) : item.path ? (
              <Link to={item.path} className="hover:text-green-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
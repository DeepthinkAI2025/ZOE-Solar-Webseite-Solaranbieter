import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface MegaMenuItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string;
  featured?: boolean;
  items?: MegaMenuItem[];
  columns?: number;
  image?: string;
  category?: string;
}

export interface MegaMenuSection {
  id: string;
  title: string;
  items: MegaMenuItem[];
  columns?: number;
}

export interface EnhancedMegaMenuProps {
  sections: MegaMenuSection[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  className?: string;
  featuredContent?: {
    title: string;
    description: string;
    image: string;
    cta: string;
    href: string;
  };
}

const EnhancedMegaMenu: React.FC<EnhancedMegaMenuProps> = ({
  sections,
  isOpen,
  onClose,
  onNavigate,
  className = '',
  featuredContent
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          // Navigate to next item
          break;
        case 'ArrowUp':
          e.preventDefault();
          // Navigate to previous item
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Filter sections based on search
  const filteredSections = React.useMemo(() => {
    if (!searchTerm) return sections;

    return sections.map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(section => section.items.length > 0);
  }, [sections, searchTerm]);

  const handleItemClick = useCallback((href: string) => {
    onNavigate(href);
    onClose();
  }, [onNavigate, onClose]);

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.15, ease: 'easeIn' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className={cn(
            'absolute top-full left-0 right-0 z-[100] glass-heavy border border-slate-200/50 rounded-2xl shadow-2xl overflow-hidden',
            className
          )}
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            backdropFilter: 'blur(24px) saturate(200%)',
            background: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-200/50">
            <div className="relative max-w-md mx-auto">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Menü durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex">
            {/* Main Menu Content */}
            <div className="flex-1 p-6">
              <div className="grid gap-8">
                {filteredSections.map((section) => (
                  <motion.div
                    key={section.id}
                    variants={itemVariants}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">
                      {section.title}
                    </h3>
                    <div
                      className={cn(
                        'grid gap-4',
                        section.columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'
                      )}
                    >
                      {section.items.map((item) => (
                        <MegaMenuItemComponent
                          key={item.id}
                          item={item}
                          onItemClick={handleItemClick}
                          onMouseEnter={() => setActiveSection(item.id)}
                          isActive={activeSection === item.id}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Featured Content Sidebar */}
            {featuredContent && (
              <motion.div
                variants={itemVariants}
                className="w-80 bg-gradient-to-br from-green-50 to-blue-50 p-6 border-l border-slate-200/50"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {featuredContent.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {featuredContent.description}
                  </p>
                  {featuredContent.image && (
                    <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden mb-4">
                      <img
                        src={featuredContent.image}
                        alt={featuredContent.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => handleItemClick(featuredContent.href)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {featuredContent.cta}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Actions Footer */}
          <div className="border-t border-slate-200/50 p-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => handleItemClick('/kontakt')}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-green-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat starten
                </button>
                <button
                  onClick={() => window.location.href = 'tel:+493012345678'}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-green-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Anrufen
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs">ESC</kbd>
                schließen
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Mega Menu Item Component
const MegaMenuItemComponent: React.FC<{
  item: MegaMenuItem;
  onItemClick: (href: string) => void;
  onMouseEnter: () => void;
  isActive: boolean;
}> = ({ item, onItemClick, onMouseEnter, isActive }) => {
  const handleClick = () => {
    if (item.href) {
      onItemClick(item.href);
    }
  };

  return (
    <motion.div
      className={cn(
        'group relative p-4 rounded-lg cursor-pointer transition-all duration-200',
        'hover:bg-slate-100/50 hover:shadow-md',
        'border border-transparent hover:border-slate-200/50',
        item.featured && 'bg-gradient-to-r from-green-50/50 to-blue-50/50',
        isActive && 'bg-slate-100 border-slate-200 shadow-md'
      )}
      onMouseEnter={onMouseEnter}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        {item.icon && (
          <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
            {item.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-slate-800 group-hover:text-green-600 transition-colors">
              {item.title}
            </h4>
            {item.badge && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                {item.badge}
              </span>
            )}
            {item.featured && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
              {item.description}
            </p>
          )}
          {item.image && (
            <div className="aspect-video bg-slate-200 rounded-md overflow-hidden mb-2">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          {item.category && (
            <span className="text-xs text-slate-500 uppercase tracking-wide">
              {item.category}
            </span>
          )}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 rounded-lg border-2 border-green-500 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </motion.div>
  );
};

export default EnhancedMegaMenu;
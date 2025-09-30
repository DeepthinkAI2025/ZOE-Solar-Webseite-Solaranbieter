import React from 'react';

interface SemanticLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const SemanticHeader: React.FC<SemanticLayoutProps> = ({ children, className = '' }) => (
  <header className={className} role="banner">
    {children}
  </header>
);

export const SemanticMain: React.FC<SemanticLayoutProps> = ({ children, className = '' }) => (
  <main className={className} role="main">
    {children}
  </main>
);

export const SemanticSection: React.FC<SemanticLayoutProps & { 'aria-labelledby'?: string; 'aria-label'?: string }> = ({
  children,
  className = '',
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel
}) => (
  <section className={className} aria-labelledby={ariaLabelledBy} aria-label={ariaLabel}>
    {children}
  </section>
);

export const SemanticArticle: React.FC<SemanticLayoutProps & { 'itemscope'?: boolean; 'itemtype'?: string }> = ({
  children,
  className = '',
  itemscope,
  itemtype
}) => (
  <article className={className} {...(itemscope ? { itemScope: true, itemType: itemtype } : {})}>
    {children}
  </article>
);

export const SemanticAside: React.FC<SemanticLayoutProps> = ({ children, className = '' }) => (
  <aside className={className} role="complementary">
    {children}
  </aside>
);

export const SemanticFooter: React.FC<SemanticLayoutProps> = ({ children, className = '' }) => (
  <footer className={className} role="contentinfo">
    {children}
  </footer>
);

export const SemanticNav: React.FC<SemanticLayoutProps & { 'aria-label'?: string }> = ({
  children,
  className = '',
  'aria-label': ariaLabel
}) => (
  <nav className={className} aria-label={ariaLabel} role="navigation">
    {children}
  </nav>
);

export const SemanticLayout: React.FC<SemanticLayoutProps> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

interface AccessibilityContextType {
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  setFocus: (element: HTMLElement | null, options?: { preventScroll?: boolean }) => void;
  trapFocus: (container: HTMLElement) => (() => void) | undefined;
  generateId: (prefix: string) => string;
  state: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    focusVisible: boolean;
  };
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const accessibility = useAccessibility();

  // Announce page changes to screen readers
  useEffect(() => {
    const handlePageChange = () => {
      const pageTitle = document.title;
      accessibility.announceToScreenReader(`Seite gewechselt: ${pageTitle}`, 'assertive');
    };

    // Listen for route changes (would integrate with router)
    window.addEventListener('popstate', handlePageChange);

    return () => {
      window.removeEventListener('popstate', handlePageChange);
    };
  }, [accessibility]);

  const value: AccessibilityContextType = {
    announceToScreenReader: accessibility.announceToScreenReader,
    setFocus: accessibility.setFocus,
    trapFocus: accessibility.trapFocus,
    generateId: accessibility.generateId,
    state: accessibility.state,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
  }
  return context;
};

// Accessibility utility components
export const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links fixed top-0 left-0 z-[9999] transform -translate-y-full focus-within:translate-y-0">
      <a
        href="#main-content"
        className="block px-4 py-3 bg-green-600 text-white font-semibold text-decoration-none hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Zum Hauptinhalt springen
      </a>
      <a
        href="#navigation"
        className="block px-4 py-3 bg-green-600 text-white font-semibold text-decoration-none hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Zur Navigation springen
      </a>
      <a
        href="#footer"
        className="block px-4 py-3 bg-green-600 text-white font-semibold text-decoration-none hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Zur Fußzeile springen
      </a>
    </div>
  );
};

export const LiveRegion: React.FC<{
  children: ReactNode;
  priority?: 'polite' | 'assertive';
  className?: string;
}> = ({ children, priority = 'polite', className = '' }) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  );
};

export const FocusBoundary: React.FC<{
  children: ReactNode;
  className?: string;
  trapped?: boolean;
  onEscape?: () => void;
}> = ({ children, className = '', trapped = false, onEscape }) => {
  const { trapFocus } = useAccessibilityContext();
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trapped && containerRef.current) {
      const cleanup = trapFocus(containerRef.current);
      if (cleanup) {
        return cleanup;
      }
    }
    return undefined;
  }, [trapped, trapFocus]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    if (trapped) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [trapped, onEscape]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// Accessible Button Component
export interface AccessibleButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  className = '',
  variant = 'primary',
  size = 'md'
}) => {
  const { state } = useAccessibilityContext();

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const focusClasses = state.focusVisible ? 'focus:ring-2' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${focusClasses}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Accessible Link Component
export interface AccessibleLinkProps {
  children: ReactNode;
  href: string;
  external?: boolean;
  ariaLabel?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const AccessibleLink: React.FC<AccessibleLinkProps> = ({
  children,
  href,
  external = false,
  ariaLabel,
  className = '',
  onClick
}) => {
  const { state } = useAccessibilityContext();

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);

    // Announce navigation for screen readers
    if (state.screenReader) {
      setTimeout(() => {
        const announcement = `Link zu ${href} geöffnet`;
        // This would be handled by the actual navigation
      }, 100);
    }
  };

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center font-medium text-green-600 hover:text-green-700
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded
        transition-colors duration-200
        ${state.keyboardNavigation ? 'underline' : ''}
        ${className}
      `}
      onClick={handleClick}
    >
      {children}
      {external && (
        <span className="sr-only">(öffnet in neuem Fenster)</span>
      )}
    </a>
  );
};

// Accessible Form Component
export interface AccessibleFieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export const AccessibleField: React.FC<AccessibleFieldProps> = ({
  label,
  id,
  error,
  hint,
  required = false,
  children
}) => {
  const { generateId } = useAccessibilityContext();
  const hintId = hint ? generateId(`hint-${id}`) : undefined;
  const errorId = error ? generateId(`error-${id}`) : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="erforderlich">*</span>
        )}
      </label>

      {children}

      {hint && (
        <p id={hintId} className="text-sm text-slate-500">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-sm text-red-600 font-medium"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}

      {/* Clone child and add accessibility props */}
      {React.isValidElement(children) && React.cloneElement(children as React.ReactElement<any>, {
        id,
        'aria-describedby': describedBy,
        'aria-invalid': !!error,
        'aria-required': required,
      })}
    </div>
  );
};

export default AccessibilityProvider;
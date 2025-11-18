import React, { ReactNode } from 'react';
import { ModalProvider } from '../modals/ModalProvider';
import { AccessibilityProvider } from '../AccessibilityProvider';
import { AIStateProvider } from './AIStateProvider';
import { SEOProvider } from './SEOProvider';
import { ThemeProvider } from './ThemeProvider';
import { AnalyticsProvider } from './AnalyticsProvider';
import { AppErrorBoundary } from '../error-boundaries/AppErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Zentralisierte Provider Komposition für die gesamte App
 *
 * Dieser Provider umschließt alle anderen Provider in der korrekten Reihenfolge,
 * um sicherzustellen, dass der Kontextfluss richtig funktioniert.
 *
 * Reihenfolge (von außen nach innen):
 * 1. ErrorBoundary - Fängt Fehler in allen inneren Providern ab
 * 2. AccessibilityProvider - Stellt Barrierefreiheit für gesamte App bereit
 * 3. ThemeProvider - Theming und User Preferences
 * 4. AIStateProvider - AI Service State Management
 * 5. SEOProvider - SEO Performance State
 * 6. AnalyticsProvider - User Analytics State
 * 7. ModalProvider - Modal Management
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AppErrorBoundary>
      <AccessibilityProvider>
        <ThemeProvider>
          <AIStateProvider>
            <SEOProvider>
              <AnalyticsProvider>
                <ModalProvider>
                  {children}
                </ModalProvider>
              </AnalyticsProvider>
            </SEOProvider>
          </AIStateProvider>
        </ThemeProvider>
      </AccessibilityProvider>
    </AppErrorBoundary>
  );
};

export default AppProviders;
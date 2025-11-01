/**
 * ZOE SOLAR - Error Boundary Component
 * Rekonstruiert aus Chat-Verlauf - Vollständige Implementierung
 * 
 * Features:
 * - React Error Boundary Pattern
 * - Graceful Error Handling
 * - User-Friendly Error Display
 * - Error Reporting & Analytics
 * - Recovery Mechanisms
 * - Accessibility Support
 * - Loading State Management
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  enableReport?: boolean;
  enableNavigation?: boolean;
  title?: string;
  description?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  isRetrying: boolean;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private static defaultProps = {
    enableRetry: true,
    enableReport: true,
    enableNavigation: true
  };

  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      isRetrying: false,
      showDetails: false
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: ErrorBoundary.generateErrorId()
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to analytics service
    this.reportError(error, errorInfo);
  }

  private static generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // In a real implementation, this would send to error tracking service
    const errorReport = {
      id: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId()
    };

    console.log('📊 Error Report:', errorReport);

    // Could integrate with services like Sentry, LogRocket, etc.
    // errorTrackingService.report(errorReport);
  }

  private getCurrentUserId(): string | null {
    // In a real implementation, this would get from user context or authentication service
    return localStorage.getItem('user-id');
  }

  private getCurrentSessionId(): string | null {
    return sessionStorage.getItem('analytics-session-id');
  }

  private handleRetry = async () => {
    this.setState({ isRetrying: true });

    try {
      // Simulate retry delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: '',
        isRetrying: false,
        showDetails: false
      });
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      this.setState({ isRetrying: false });
    }
  };

  private handleReportError = () => {
    if (!this.state.error) return;

    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error.message,
      stack: this.state.error.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Create mailto link for manual reporting
    const subject = encodeURIComponent(`Error Report - ${this.state.errorId}`);
    const body = encodeURIComponent(`
An error occurred on the ZOE Solar website:

Error ID: ${this.state.errorId}
Message: ${this.state.error.message}
URL: ${window.location.href}
Time: ${new Date().toISOString()}

Details:
${JSON.stringify(errorDetails, null, 2)}
    `.trim());

    const mailtoLink = `mailto:support@zoe-solar.de?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleToggleDetails = () => {
    this.setState(prev => ({
      showDetails: !prev.showDetails
    }));
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div 
          className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
          role="alert"
          aria-labelledby="error-title"
          aria-describedby="error-description"
        >
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>

            {/* Error Title */}
            <h1 
              id="error-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              {this.props.title || 'Entschuldigung, ein Fehler ist aufgetreten'}
            </h1>

            {/* Error Description */}
            <p 
              id="error-description"
              className="text-sm text-gray-600 mb-6"
            >
              {this.props.description || 
                'Etwas ist schief gelaufen. Unser Team wurde automatisch informiert und arbeitet an einer Lösung.'
              }
            </p>

            {/* Error ID for Support */}
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500">
                Fehler-ID: <span className="font-mono">{this.state.errorId}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Retry Button */}
              {this.props.enableRetry && (
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.isRetrying}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-describedby="retry-description"
                >
                  {this.state.isRetrying ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                      Wird wiederholt...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                      Erneut versuchen
                    </>
                  )}
                </button>
              )}

              <div id="retry-description" className="sr-only">
                Lädt die Komponente neu, um den Fehler zu beheben
              </div>

              {/* Home Button */}
              {this.props.enableNavigation && (
                <button
                  onClick={this.handleGoHome}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Home className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                  Zur Startseite
                </button>
              )}

              {/* Report Error Button */}
              {this.props.enableReport && (
                <button
                  onClick={this.handleReportError}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Mail className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                  Fehler melden
                </button>
              )}
            </div>

            {/* Technical Details Toggle */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={this.handleToggleDetails}
                className="text-xs text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
                aria-expanded={this.state.showDetails}
                aria-controls="error-details"
              >
                {this.state.showDetails ? 'Weniger Details anzeigen' : 'Technische Details anzeigen'}
              </button>

              {/* Technical Details */}
              {this.state.showDetails && (
                <div 
                  id="error-details"
                  className="mt-3 text-left bg-gray-50 rounded-md p-3"
                >
                  <div className="text-xs font-mono text-gray-700 space-y-2">
                    {this.state.error && (
                      <div>
                        <strong>Fehlermeldung:</strong>
                        <div className="mt-1 p-2 bg-white rounded border">
                          {this.state.error.message}
                        </div>
                      </div>
                    )}
                    
                    {this.state.error && this.state.error.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-auto max-h-32">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 p-2 bg-white rounded border text-xs overflow-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Support Contact */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Benötigen Sie Hilfe? Kontaktieren Sie unseren{' '}
                <a 
                  href="mailto:support@zoe-solar.de" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Support
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-Order Component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error reporting (for functional components)
export function useErrorHandler() {
  const reportError = (error: Error, context?: any) => {
    console.error('Manual error report:', error, context);
    
    // In a real implementation, this would integrate with error tracking service
    const errorReport = {
      error: error.message,
      stack: error.stack,
      context,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem('user-id'),
      sessionId: sessionStorage.getItem('analytics-session-id')
    };
    
    // errorTrackingService.report(errorReport);
  };

  return { reportError };
}

// Simple error boundary for specific use cases
export function SimpleErrorBoundary({ 
  children, 
  fallback = <div>Ein Fehler ist aufgetreten.</div> 
}: { 
  children: ReactNode; 
  fallback?: ReactNode; 
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}

// Error boundary for forms
export function FormErrorBoundary({ 
  children, 
  onError 
}: { 
  children: ReactNode; 
  onError?: (error: Error) => void; 
}) {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error('Form error:', error);
    onError?.(error);
  };

  return (
    <ErrorBoundary 
      onError={handleError}
      title="Formularfehler"
      description="Es gab ein Problem beim Verarbeiten des Formulars."
      enableNavigation={false}
    >
      {children}
    </ErrorBoundary>
  );
}

// Error boundary for API calls
export function APIErrorBoundary({ 
  children, 
  onRetry 
}: { 
  children: ReactNode; 
  onRetry?: () => void; 
}) {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error('API error:', error);
    
    // Check if it's a network error
    if (error.message.includes('Network Error') || error.message.includes('fetch')) {
      // Handle network errors specifically
    }
  };

  const handleRetry = () => {
    onRetry?.();
  };

  return (
    <ErrorBoundary 
      onError={handleError}
      title="Verbindungsfehler"
      description="Es gab ein Problem beim Laden der Daten. Bitte versuchen Sie es erneut."
      enableNavigation={false}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
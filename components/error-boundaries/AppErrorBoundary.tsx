import React, { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  isRecovering: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
  enableErrorReporting?: boolean;
}

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = this.state.errorId || 'unknown';

    // Log to console for development
    console.group('🚨 App Error Boundary - Error Caught');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Error ID:', errorId);
    console.groupEnd();

    // Update state with error info
    this.setState({
      errorInfo,
      errorId,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorId);
    }

    // Report error to monitoring service if enabled
    if (this.props.enableErrorReporting) {
      this.reportError(error, errorInfo, errorId);
    }
  }

  componentWillUnmount() {
    // Clean up any pending timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  private reportError = (error: Error, errorInfo: ErrorInfo, errorId: string) => {
    // Enhanced error reporting with context
    const errorReport = {
      id: errorId,
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      buildVersion: process.env.REACT_APP_VERSION || 'unknown',
      environment: process.env.NODE_ENV || 'unknown',
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      memory: 'memory' in performance ? (performance as any).memory : undefined,
      connection: 'connection' in navigator ? {
        effectiveType: (navigator as any).connection?.effectiveType,
        downlink: (navigator as any).connection?.downlink,
        rtt: (navigator as any).connection?.rtt,
      } : undefined,
    };

    // Send to error reporting service
    this.sendErrorReport(errorReport);
  };

  private sendErrorReport = async (errorReport: any) => {
    try {
      // In production, send to your error reporting service
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/error-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorReport),
        });
      }

      // Also store in localStorage for fallback
      const storedErrors = JSON.parse(localStorage.getItem('error-reports') || '[]');
      storedErrors.push(errorReport);

      // Keep only last 50 errors
      if (storedErrors.length > 50) {
        storedErrors.splice(0, storedErrors.length - 50);
      }

      localStorage.setItem('error-reports', JSON.stringify(storedErrors));

    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private getUserId = (): string => {
    return localStorage.getItem('user-id') || 'anonymous';
  };

  private getSessionId = (): string => {
    return sessionStorage.getItem('session-id') || 'unknown';
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.setState({
        isRecovering: true,
        retryCount: retryCount + 1,
      });

      // Exponential backoff for retries
      const delay = Math.pow(2, retryCount) * 1000;
      const timeout = setTimeout(() => {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          errorId: null,
          isRecovering: false,
        });
      }, delay);

      this.retryTimeouts.push(timeout);
    }
  };

  private handleReset = () => {
    // Clear all state and timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts = [];

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isRecovering: false,
    });
  };

  private reloadPage = () => {
    window.location.reload();
  };

  private copyErrorDetails = async () => {
    const { error, errorInfo, errorId } = this.state;

    const errorText = `
Error ID: ${errorId}
Time: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Error: ${error?.name}
Message: ${error?.message}
Stack: ${error?.stack}

Component Stack: ${errorInfo?.componentStack}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      alert('Error details copied to clipboard');
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  render() {
    const { children, fallback, showErrorDetails = process.env.NODE_ENV === 'development', maxRetries = 3 } = this.props;
    const { hasError, error, errorInfo, errorId, retryCount, isRecovering } = this.state;

    if (hasError) {
      // Custom fallback UI provided by props
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Etwas ist schiefgelaufen
              </h1>
              <p className="text-slate-600 mb-1">
                Ein unerwarteter Fehler ist aufgetreten.
              </p>
              {errorId && (
                <p className="text-sm text-slate-500">
                  Fehler-ID: <code className="bg-slate-100 px-2 py-1 rounded">{errorId}</code>
                </p>
              )}
            </div>

            {/* Recovery Options */}
            <div className="space-y-3 mb-6">
              <button
                onClick={this.handleRetry}
                disabled={isRecovering || retryCount >= maxRetries}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isRecovering ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Wiederherstellen...
                  </>
                ) : retryCount >= maxRetries ? (
                  `Maximale Versuche erreicht (${maxRetries})`
                ) : (
                  `Erneut versuchen (${retryCount + 1}/${maxRetries})`
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={this.handleReset}
                  className="bg-slate-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
                >
                  Zurücksetzen
                </button>
                <button
                  onClick={this.reloadPage}
                  className="bg-slate-200 text-slate-700 px-4 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Neu laden
                </button>
              </div>
            </div>

            {/* Error Details (Development Only) */}
            {showErrorDetails && error && (
              <details className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <summary className="cursor-pointer font-medium text-slate-700 mb-2">
                  Fehlerdetails (Entwicklungsmodus)
                </summary>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-slate-700">Fehler:</strong>
                    <pre className="mt-1 p-2 bg-white rounded border border-slate-200 overflow-x-auto text-xs">
                      {error.name}: {error.message}
                    </pre>
                  </div>
                  {error.stack && (
                    <div>
                      <strong className="text-slate-700">Stack Trace:</strong>
                      <pre className="mt-1 p-2 bg-white rounded border border-slate-200 overflow-x-auto text-xs">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  {errorInfo?.componentStack && (
                    <div>
                      <strong className="text-slate-700">Component Stack:</strong>
                      <pre className="mt-1 p-2 bg-white rounded border border-slate-200 overflow-x-auto text-xs">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                  <button
                    onClick={this.copyErrorDetails}
                    className="w-full bg-slate-200 text-slate-700 px-3 py-2 rounded font-medium hover:bg-slate-300 transition-colors text-xs"
                  >
                    📋 Details kopieren
                  </button>
                </div>
              </details>
            )}

            {/* Support Information */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-600 mb-2">
                Das Problem weiterhin vorhanden?
              </p>
              <a
                href="/kontakt"
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Kontakt zum Support →
              </a>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Hook for using error boundary context (future enhancement)
export const useErrorBoundary = () => {
  // This could be expanded to provide access to error boundary state
  // from within child components if needed
  return {
    reportError: (error: Error) => {
      console.error('Manual error report:', error);
      // Could send to error reporting service
    },
  };
};

export default AppErrorBoundary;
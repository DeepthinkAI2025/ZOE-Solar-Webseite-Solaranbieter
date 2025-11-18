/* eslint-disable @typescript-eslint/no-explicit-any */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor() {
    this.config = {
      level: import.meta.env.NODE_ENV === 'development' ? 'debug' : 'warn',
      enableConsole: import.meta.env.NODE_ENV === 'development',
      enableRemote: import.meta.env.NODE_ENV === 'production',
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.config.level];
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog('debug') && this.config.enableConsole) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog('info') && this.config.enableConsole) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog('warn') && this.config.enableConsole) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error | any, ...args: any[]) {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error, ...args);

      // In production, send errors to monitoring service
      if (this.config.enableRemote && error instanceof Error) {
        this.sendToRemote('error', message, error);
      }
    }
  }

  private async sendToRemote(level: LogLevel, message: string, error?: Error) {
    try {
      // Implementation for remote logging (e.g., Sentry, LogRocket, etc.)
      // This is a placeholder for actual remote logging integration
      if (level === 'error' && error) {
        // Send to monitoring service
        console.log('Remote logging:', { level, message, error: error.message, stack: error.stack });
      }
    } catch (e) {
      // Fail silently to avoid infinite loops
      console.warn('Failed to send log to remote service:', e);
    }
  }

  // Performance logging
  time(label: string) {
    if (this.shouldLog('debug') && this.config.enableConsole) {
      console.time(label);
    }
  }

  timeEnd(label: string) {
    if (this.shouldLog('debug') && this.config.enableConsole) {
      console.timeEnd(label);
    }
  }

  // Group logging
  group(label: string) {
    if (this.shouldLog('debug') && this.config.enableConsole) {
      console.group(label);
    }
  }

  groupEnd() {
    if (this.shouldLog('debug') && this.config.enableConsole) {
      console.groupEnd();
    }
  }
}

export const logger = new Logger();
export default logger;
/* eslint-enable @typescript-eslint/no-explicit-any */
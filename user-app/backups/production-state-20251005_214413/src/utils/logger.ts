
// Enhanced logger utility for development and production
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  component?: string;
  service?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  args?: any[];
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';
  
  private formatMessage(level: LogLevel, message: string, context?: LogContext, ..._args: any[]): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${Object.entries(context).map(([k, v]) => `${k}:${v}`).join(', ')}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isProduction) {
      // In production, only log errors and warnings
      return level === 'error' || level === 'warn';
    }
    return true; // In development, log everything
  }

  private log(level: LogLevel, message: string, context?: LogContext, ...args: unknown[]): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context, ...args);
    
    // Use native console methods but with better formatting
    // This is the standard way to implement logging in browsers
    switch (level) {
      case 'debug':
        if (console.debug) {
          console.debug(formattedMessage, ...args);
        } else {
          console.log(formattedMessage, ...args);
        }
        break;
      case 'info':
        if (console.info) {
          console.info(formattedMessage, ...args);
        } else {
          console.log(formattedMessage, ...args);
        }
        break;
      case 'warn':
        if (console.warn) {
          console.warn(formattedMessage, ...args);
        } else {
          console.log(formattedMessage, ...args);
        }
        break;
      case 'error':
        if (console.error) {
          console.error(formattedMessage, ...args);
        } else {
          console.log(formattedMessage, ...args);
        }
        break;
    }
  }

  debug(message: string, context?: LogContext, ...args: unknown[]): void {
    this.log('debug', message, context, ...args);
  }

  info(message: string, context?: LogContext, ...args: unknown[]): void {
    this.log('info', message, context, ...args);
  }

  warn(message: string, context?: LogContext, ...args: unknown[]): void {
    this.log('warn', message, context, ...args);
  }

  error(message: string, context?: LogContext, ...args: unknown[]): void {
    this.log('error', message, context, ...args);
  }

  // Convenience methods for common use cases
  component(componentName: string) {
    return {
      debug: (message: string, ...args: unknown[]) => this.debug(message, { component: componentName }, ...args),
      info: (message: string, ...args: unknown[]) => this.info(message, { component: componentName }, ...args),
      warn: (message: string, ...args: unknown[]) => this.warn(message, { component: componentName }, ...args),
      error: (message: string, ...args: unknown[]) => this.error(message, { component: componentName }, ...args),
    };
  }

  service(serviceName: string) {
    return {
      debug: (message: string, ...args: unknown[]) => this.debug(message, { service: serviceName }, ...args),
      info: (message: string, ...args: unknown[]) => this.info(message, { service: serviceName }, ...args),
      warn: (message: string, ...args: unknown[]) => this.warn(message, { service: serviceName }, ...args),
      error: (message: string, ...args: unknown[]) => this.error(message, { service: serviceName }, ...args),
    };
  }
}

// Create singleton instance
export const logger = new Logger();

// Legacy export for backward compatibility
export const legacyLogger = {
  info: (message: string, ...args: unknown[]) => logger.info(message, undefined, ...args),
  warn: (message: string, ...args: unknown[]) => logger.warn(message, undefined, ...args),
      error: (message: string, ...args: unknown[]) => logger.error(message, undefined, ...args),
    debug: (message: string, ...args: unknown[]) => logger.debug(message, undefined, ...args),
};

export default logger;

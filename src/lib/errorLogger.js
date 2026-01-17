/**
 * Error Logging Service
 *
 * Centralized error logging that can be integrated with external services
 * like Sentry, LogRocket, Rollbar, etc.
 *
 * Usage:
 * import { errorLogger } from '@/lib/errorLogger';
 * errorLogger.logError(error, context);
 */

class ErrorLogger {
  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.isDevelopment = import.meta.env.DEV;
    this.errorQueue = [];
    this.maxQueueSize = 50;
  }

  /**
   * Log an error with context
   * @param {Error} error - The error object
   * @param {Object} context - Additional context information
   */
  logError(error, context = {}) {
    const errorInfo = this.formatError(error, context);

    // Always log to console in development
    if (this.isDevelopment) {
      this.logToConsole(errorInfo);
    }

    // Add to queue
    this.addToQueue(errorInfo);

    // Send to external service in production
    if (this.isProduction) {
      this.sendToExternalService(errorInfo);
    }
  }

  /**
   * Log a warning (non-critical error)
   * @param {string} message - Warning message
   * @param {Object} context - Additional context
   */
  logWarning(message, context = {}) {
    const warningInfo = {
      level: 'warning',
      message,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    if (this.isDevelopment) {
      console.warn('⚠️ Warning:', message, context);
    }

    this.addToQueue(warningInfo);
  }

  /**
   * Log user action for debugging
   * @param {string} action - Action name
   * @param {Object} data - Action data
   */
  logUserAction(action, data = {}) {
    if (this.isDevelopment) {
      console.log('👤 User Action:', action, data);
    }

    // You can send important user actions to analytics
    // this.sendToAnalytics(action, data);
  }

  /**
   * Format error with context
   * @private
   */
  formatError(error, context) {
    return {
      level: 'error',
      message: error.message || 'Unknown error',
      stack: error.stack,
      name: error.name,
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    };
  }

  /**
   * Log to browser console with formatting
   * @private
   */
  logToConsole(errorInfo) {
    console.group('🔴 Error Logged');
    console.error('Message:', errorInfo.message);
    console.error('Stack:', errorInfo.stack);
    console.log('Context:', errorInfo.context);
    console.log('Timestamp:', errorInfo.context.timestamp);
    console.groupEnd();
  }

  /**
   * Add error to queue for batch processing
   * @private
   */
  addToQueue(errorInfo) {
    this.errorQueue.push(errorInfo);

    // Keep queue size manageable
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }
  }

  /**
   * Send error to external monitoring service
   * @private
   */
  sendToExternalService(errorInfo) {
    // Example integration with Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(new Error(errorInfo.message), {
    //     contexts: {
    //       custom: errorInfo.context,
    //     },
    //     tags: {
    //       component: errorInfo.context.component,
    //     },
    //   });
    // }

    // Example integration with LogRocket
    // if (window.LogRocket) {
    //   window.LogRocket.captureException(new Error(errorInfo.message), {
    //     extra: errorInfo.context,
    //   });
    // }

    // Example: Send to custom endpoint
    // this.sendToCustomEndpoint(errorInfo);

    // For now, we'll just log that we would send it
    if (this.isDevelopment) {
      console.log('📡 Would send to external service in production:', errorInfo);
    }
  }

  /**
   * Send error to custom endpoint
   * @private
   */
  async sendToCustomEndpoint(errorInfo) {
    try {
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      });
    } catch (error) {
      // Don't let error logging errors break the app
      console.error('Failed to send error to endpoint:', error);
    }
  }

  /**
   * Get all logged errors (useful for debugging)
   */
  getErrorQueue() {
    return [...this.errorQueue];
  }

  /**
   * Clear error queue
   */
  clearErrorQueue() {
    this.errorQueue = [];
  }

  /**
   * Export errors as JSON (for support tickets)
   */
  exportErrors() {
    const data = {
      errors: this.errorQueue,
      exportedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Download errors as file
   */
  downloadErrors() {
    const data = this.exportErrors();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-log-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Export helper functions
export const logError = (error, context) => errorLogger.logError(error, context);
export const logWarning = (message, context) => errorLogger.logWarning(message, context);
export const logUserAction = (action, data) => errorLogger.logUserAction(action, data);

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  errorLogger.logError(event.error || new Error(event.message), {
    type: 'uncaught_error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  errorLogger.logError(
    event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
    {
      type: 'unhandled_promise_rejection',
    }
  );
});

export default errorLogger;

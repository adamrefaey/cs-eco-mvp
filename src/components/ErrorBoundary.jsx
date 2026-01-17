import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { errorLogger } from '@/lib/errorLogger';

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Best Practices:
 * - Class component (required for Error Boundaries)
 * - Logs errors to console and can integrate with error reporting services
 * - Provides user-friendly fallback UI
 * - Allows users to recover from errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to error logging service (integrates with Sentry, LogRocket, etc.)
    errorLogger.logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      errorCount: this.state.errorCount + 1,
      component: this.props.name || 'ErrorBoundary',
    });
  }


  handleReset = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Optional: reload the page if multiple errors occur
    if (this.state.errorCount >= 3) {
      window.location.reload();
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    // Create a detailed error report
    const report = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    // Copy to clipboard for easy reporting
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
      .then(() => alert('Error details copied to clipboard'))
      .catch(() => console.error('Failed to copy error details'));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.handleReset,
        });
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#0f0520] to-[#1a0b2e] flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full bg-black/40 backdrop-blur-xl border-red-500/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-white text-2xl">Something went wrong</CardTitle>
              <CardDescription className="text-white/60">
                The application encountered an unexpected error
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error Message */}
              {this.state.error && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Bug className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-red-300 mb-1">Error Details</p>
                      <p className="text-sm text-red-200/80 font-mono break-all">
                        {this.state.error.toString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Count Warning */}
              {this.state.errorCount >= 2 && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-sm text-yellow-300 text-center">
                    Multiple errors detected ({this.state.errorCount}). Consider refreshing the page.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 border-white/10 text-white hover:bg-white/5"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Report Error Button */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  onClick={this.handleReportError}
                  variant="ghost"
                  className="w-full text-white/60 hover:text-white hover:bg-white/5"
                  size="sm"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Copy Error Details
                </Button>
              )}

              {/* Development Info */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="bg-black/40 border border-white/5 rounded-lg p-4">
                  <summary className="text-sm text-white/60 cursor-pointer hover:text-white/80">
                    Component Stack (Development Only)
                  </summary>
                  <pre className="mt-3 text-xs text-white/50 overflow-auto max-h-48 whitespace-pre-wrap break-words">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Help Text */}
              <p className="text-center text-sm text-white/40">
                If this problem persists, please contact support
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;

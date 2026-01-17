import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Reusable Error Fallback Component
 *
 * A customizable error display component that can be used
 * with ErrorBoundary or standalone for error states.
 *
 * @param {Object} props
 * @param {Error} props.error - The error object
 * @param {Function} props.resetError - Function to reset the error state
 * @param {string} props.title - Custom title (optional)
 * @param {string} props.message - Custom message (optional)
 * @param {boolean} props.showErrorDetails - Show detailed error info (default: false)
 */
export function ErrorFallback({
  error,
  resetError,
  title = 'Something went wrong',
  message = 'The application encountered an unexpected error',
  showErrorDetails = false,
}) {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#0f0520] to-[#1a0b2e] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-black/40 backdrop-blur-xl border-red-500/20 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <CardTitle className="text-white text-2xl">{title}</CardTitle>
          <CardDescription className="text-white/60">{message}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Details */}
          {showErrorDetails && error && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm font-mono text-red-200 break-all">
                {error.toString()}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {resetError && (
              <Button
                onClick={resetError}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}

            <Button
              onClick={handleGoHome}
              variant="outline"
              className={`${resetError ? 'flex-1' : 'w-full'} border-white/10 text-white hover:bg-white/5`}
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          <p className="text-center text-sm text-white/40 mt-4">
            If this problem persists, please contact support
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Lightweight Error Fallback for inline errors
 * (doesn't take up full screen)
 */
export function InlineErrorFallback({ error, resetError, title = 'Error loading content' }) {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="max-w-md w-full bg-black/20 backdrop-blur-sm border-red-500/20">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3 text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-white">{title}</h3>
              {error && (
                <p className="text-sm text-white/60 mt-1">{error.message}</p>
              )}
            </div>
          </div>

          {resetError && (
            <Button
              onClick={resetError}
              size="sm"
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Network Error Fallback
 * Specialized fallback for network/API errors
 */
export function NetworkErrorFallback({ error, resetError }) {
  return (
    <ErrorFallback
      error={error}
      resetError={resetError}
      title="Connection Error"
      message="Unable to connect to the server. Please check your internet connection."
      showErrorDetails={false}
    />
  );
}

/**
 * Page Not Found Fallback
 * For route-level errors
 */
export function NotFoundFallback() {
  return (
    <ErrorFallback
      error={null}
      resetError={null}
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      showErrorDetails={false}
    />
  );
}

export default ErrorFallback;

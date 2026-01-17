import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

/**
 * Error Boundary Test Component
 *
 * This component is used to test the ErrorBoundary functionality.
 * It provides buttons to trigger different types of errors.
 *
 * Usage: Add this to any page during development to test error boundaries
 * <ErrorBoundaryTest />
 */

// Component that throws an error on render
function BrokenComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('This is a test error thrown by BrokenComponent!');
  }
  return <div>Component is working fine.</div>;
}

// Component that throws async error
function AsyncErrorComponent({ shouldThrow }) {
  React.useEffect(() => {
    if (shouldThrow) {
      // Simulate async error (not caught by error boundaries)
      setTimeout(() => {
        throw new Error('Async error - not caught by ErrorBoundary');
      }, 100);
    }
  }, [shouldThrow]);

  return <div>Async error will be thrown...</div>;
}

export function ErrorBoundaryTest() {
  const [throwRenderError, setThrowRenderError] = useState(false);
  const [throwAsyncError, setThrowAsyncError] = useState(false);

  const handleUndefinedAccess = () => {
    // This will throw: Cannot read property 'foo' of undefined
    const obj = undefined;
    console.log(obj.foo.bar);
  };

  const handleAsyncRejection = () => {
    // This will trigger unhandledrejection event
    Promise.reject(new Error('Unhandled promise rejection'));
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <Card className="bg-yellow-500/10 border-yellow-500/30 mb-6">
      <CardHeader>
        <CardTitle className="text-yellow-300 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Error Boundary Test (Development Only)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-white/70">
          Use these buttons to test error boundary functionality. These buttons only appear in development mode.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setThrowRenderError(true)}
            variant="destructive"
            size="sm"
          >
            Throw Render Error
          </Button>

          <Button
            onClick={handleUndefinedAccess}
            variant="destructive"
            size="sm"
          >
            Undefined Access Error
          </Button>

          <Button
            onClick={() => setThrowAsyncError(true)}
            variant="destructive"
            size="sm"
          >
            Throw Async Error
          </Button>

          <Button
            onClick={handleAsyncRejection}
            variant="destructive"
            size="sm"
          >
            Promise Rejection
          </Button>
        </div>

        {throwRenderError && <BrokenComponent shouldThrow={true} />}
        {throwAsyncError && <AsyncErrorComponent shouldThrow={true} />}

        <p className="text-xs text-white/50 mt-4">
          Note: Async errors and promise rejections are caught by global handlers and logged,
          but won't trigger the ErrorBoundary component (React limitation).
        </p>
      </CardContent>
    </Card>
  );
}

export default ErrorBoundaryTest;

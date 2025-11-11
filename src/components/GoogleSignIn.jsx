import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useAuthStore } from '../store';

const GoogleSignIn = ({ onSuccess, onError }) => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { login: authLogin } = useAuthStore();

  // Google OAuth Client ID - Replace with your actual client ID
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';

  useEffect(() => {
    // Check if Google Identity Services is loaded
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleLoaded(true);
        initializeGoogleSignIn();
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  const initializeGoogleSignIn = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
      if (onError) onError(error);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      // The response.credential contains the JWT ID token
      const idToken = response.credential;
      
      // Send the token to your backend for verification
      const result = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!result.ok) {
        throw new Error('Google authentication failed');
      }

      const data = await result.json();
      
      // Update auth store with the authenticated user
      authLogin(data, { accessToken: data.accessToken, refreshToken: data.refreshToken });
      
      if (onSuccess) onSuccess(data);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      if (onError) onError(error);
    }
  };

  const handleGoogleSignIn = () => {
    if (!isGoogleLoaded) {
      console.error('Google Identity Services not loaded');
      return;
    }

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup if prompt is not displayed
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with',
              shape: 'pill',
            }
          );
        }
      });
    } catch (error) {
      console.error('Error prompting Google Sign-In:', error);
      if (onError) onError(error);
    }
  };

  return (
    <div className="w-full">
      <Button
        type="button"
        variant="outline"
        className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        onClick={handleGoogleSignIn}
        disabled={!isGoogleLoaded}
      >
        <div className="flex items-center justify-center gap-3">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isGoogleLoaded ? 'Continue with Google' : 'Loading Google...'}
        </div>
      </Button>
      
      {/* Hidden div for Google button rendering fallback */}
      <div id="google-signin-button" className="hidden"></div>
    </div>
  );
};

export default GoogleSignIn;
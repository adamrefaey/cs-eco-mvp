# Google OAuth Setup Guide

## Overview
This guide explains how to set up Google Sign-In for the Lumanagi Intelligence Agent application.

## Google Cloud Console Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API or Google Identity Services

### 2. Configure OAuth Consent Screen
1. Navigate to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have Google Workspace)
3. Fill in the required information:
   - App name: `Lumanagi Intelligence Agent`
   - User support email: Your email
   - App logo: (optional)
   - App domain: `http://localhost:5174` (for development)
   - Authorized domains: `localhost`
   - Developer contact: Your email

### 3. Create OAuth 2.0 Credentials
1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Set up the configuration:
   - Name: `Lumanagi Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:5174` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:5174` (development)
     - `https://yourdomain.com` (production)

### 4. Get Your Client ID
1. After creating the credentials, copy the "Client ID"
2. It will look like: `123456789-abcdefg.apps.googleusercontent.com`

## Application Configuration

### Frontend Configuration
Update the `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
```

### Backend Configuration
Update the `backend/.env` file:

```env
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
```

## Testing Google Sign-In

### Development Setup
1. Make sure both frontend and backend are running:
   ```bash
   # Terminal 1: Frontend
   npm start

   # Terminal 2: Backend
   cd backend
   npm start
   ```

2. Navigate to `http://localhost:5174`
3. Click "Continue with Google" button
4. Complete the Google authentication flow

### Production Setup
1. Update the OAuth consent screen with your production domain
2. Add your production domain to authorized origins
3. Update environment variables with production values
4. Deploy both frontend and backend

## Security Notes

### Development
- The app runs on `localhost:5174` for frontend
- Backend API runs on `localhost:3001`
- Google OAuth is configured for localhost domains

### Production
- Use HTTPS for all domains
- Configure proper CORS settings
- Store environment variables securely
- Consider implementing additional security measures

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Ensure the redirect URI in Google Console matches your app URL exactly
   - Check that you've added the correct authorized origins

2. **"This app isn't verified" warning**
   - Normal for development, can be bypassed by clicking "Advanced" > "Go to [app name]"
   - For production, complete the verification process in Google Console

3. **"popup_closed_by_user" error**
   - User closed the popup before completing authentication
   - Handle this gracefully in your error callback

4. **Token verification fails**
   - Check that GOOGLE_CLIENT_ID in backend matches the frontend
   - Ensure the token hasn't expired

### Development Tips
- Use browser developer tools to inspect network requests
- Check console for detailed error messages
- Verify environment variables are loaded correctly
- Test with different Google accounts

## Features Implemented

### Frontend
- ✅ Google Sign-In button with official Google styling
- ✅ Modern Google Identity Services integration
- ✅ Error handling and loading states
- ✅ Responsive design
- ✅ Integration with existing auth flow

### Backend
- ✅ Google ID token verification
- ✅ User creation from Google profile
- ✅ JWT token generation for Google users
- ✅ Linking Google accounts to existing users
- ✅ Profile information storage (name, email, avatar)

## Next Steps

1. **Get Google OAuth Credentials**: Follow the setup guide above
2. **Update Environment Variables**: Add your actual Client ID and Secret
3. **Test the Integration**: Try signing in with your Google account
4. **Production Deployment**: Configure for your production domain

The Google Sign-In feature is now fully integrated and ready for use!
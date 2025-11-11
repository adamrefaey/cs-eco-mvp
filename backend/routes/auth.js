const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Mock user database (replace with real database)
const users = [
  {
    id: '1',
    email: 'admin@lumanagi.com',
    password: '$2a$10$8K1p/A0dygxRkLv7P8/Yl.YwLbgYABLcXGnCqGqYfBSY5HP.M4nOG', // 'demo123'
    full_name: 'Admin User',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: '2', 
    email: 'user@lumanagi.com',
    password: '$2a$10$8K1p/A0dygxRkLv7P8/Yl.YwLbgYABLcXGnCqGqYfBSY5HP.M4nOG', // 'demo123'
    full_name: 'Regular User',
    role: 'user',
    created_at: new Date().toISOString()
  }
];

// Refresh tokens storage (in production, use Redis or database)
const refreshTokens = new Set();

// Generate tokens
const generateTokens = (user) => {
  const payload = { 
    id: user.id, 
    email: user.email, 
    role: user.role 
  };
  
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    refreshTokens.add(refreshToken);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password: hashedPassword,
      full_name,
      role: 'user',
      created_at: new Date().toISOString()
    };

    users.push(newUser);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);
    refreshTokens.add(refreshToken);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken || !refreshTokens.has(refreshToken)) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new access token
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    
    // Remove old refresh token and add new one
    refreshTokens.delete(refreshToken);
    refreshTokens.add(newRefreshToken);

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { 
      sub: googleId,
      email,
      name: full_name,
      picture: avatar_url,
      email_verified 
    } = payload;

    if (!email_verified) {
      return res.status(400).json({ error: 'Google email not verified' });
    }

    // Check if user exists
    let user = users.find(u => u.email === email);
    
    if (!user) {
      // Create new user from Google account
      user = {
        id: (users.length + 1).toString(),
        email,
        full_name,
        avatar_url,
        google_id: googleId,
        role: 'user',
        created_at: new Date().toISOString(),
        // No password for Google users
        password: null
      };
      users.push(user);
    } else {
      // Update existing user with Google info if not already linked
      if (!user.google_id) {
        user.google_id = googleId;
        user.avatar_url = avatar_url;
      }
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    refreshTokens.add(refreshToken);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
import { Request, Response } from 'express';
import { handleGoogleAuth, GoogleProfile } from '../services/auth.service';
import ms from 'ms'; // ✅ compatible with all tsconfig settings
import dotenv from 'dotenv';
import { createUser, findUserByEmail, verifyPassword } from '../services/user.service';
import { signToken } from '../utils/jwt';
import { validateLogin, validateSignup } from '../utils/validation';
import { User } from '@prisma/client';

dotenv.config();

// Handle Google OAuth callback
export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user profile from Passport
    const profile = req.user as unknown as GoogleProfile;
    
    if (!profile) {
      res.status(400).json({ message: 'Google authentication failed: No profile received' });
      return;
    }

    // Process the Google profile
    const { user, token } = await handleGoogleAuth(profile);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms('7d'), // convert "7d" to milliseconds
    });
    

    // Redirect to frontend dashboard
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

// Login with email and password
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const validation = validateLogin(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const { email, password } = validation.data!;

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT
    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms('7d'),
    });

    // Return success response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Signup with email and password
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate input
    const validation = validateSignup(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const { name, email, password } = validation.data!;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    // Create new user
    const user = await createUser(email, password, name);

    // Generate JWT
    const token = signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ms('7d'),
    });

    // Return success response
    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Get current user
export const getCurrentUser = (req: Request, res: Response): void => {
  // User is attached to request by auth middleware
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const user = req.user as User;

  // Return user data (excluding sensitive info if any)
  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  });
};

// Logout user
export const logout = (req: Request, res: Response): void => {
  // Clear the token cookie
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
}; 